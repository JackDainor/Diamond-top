import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import {
  createOrder as s2tCreateOrder,
  getItemPrice,
} from "@/lib/shop2topup";
import {
  ensureSchema,
  createOrderRecord,
  updateOrderByOrderId,
} from "@/lib/db";

/**
 * POST /api/orders/create
 *
 * Flujo:
 * 1. Guarda el pedido en Neon (status: processing)
 * 2. Llama a Shop2TopUp /orders/create
 * 3. Actualiza el pedido con el resultado
 *
 * NOTA: En producción real deberías cobrar ANTES de llamar a Shop2TopUp.
 * Por ahora (pruebas) creamos el pedido directo.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      game_id,
      game_name,
      package_id,
      package_name,
      player_id,
      player_name,
      server,
      sell_price,
      sub_category_id,
    } = body;

    if (!player_id || !package_id || !game_id || !sell_price) {
      return NextResponse.json(
        { success: false, error: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    const orderId = randomUUID();
    const internalId = randomUUID();

    let dbAvailable = false;
    try {
      await ensureSchema();
      await createOrderRecord({
        id: internalId,
        order_id: orderId,
        game_id,
        game_name: game_name || game_id,
        package_id,
        package_name: package_name || package_id,
        player_id: String(player_id),
        player_name: player_name || null,
        server: server || null,
        sell_price: String(sell_price),
        status: "processing",
      });
      dbAvailable = true;
    } catch (dbErr) {
      console.warn("[orders/create] DB no disponible (Neon?):", dbErr);
    }

    if (!process.env.SHOP2TOPUP_API_KEY || !sub_category_id) {
      if (dbAvailable) {
        await updateOrderByOrderId(orderId, {
          status: "completed",
          s2t_status: "demo",
        });
      }
      return NextResponse.json({
        success: true,
        demo: true,
        order: {
          order_id: orderId,
          status: "completed",
          player_id,
          player_name: player_name || `Jugador_${String(player_id).slice(-4)}`,
          package_name: package_name || package_id,
          sell_price,
        },
      });
    }

    try {
      let unitPrice = "0.01";
      try {
        const priceRes = await getItemPrice(Number(sub_category_id));
        unitPrice = priceRes.unit_price;
      } catch {
        console.warn("[orders/create] No se pudo leer precio, usando fallback");
      }

      const requirements: Record<string, string> = {
        player_id: String(player_id),
      };
      if (server) requirements.server = String(server);

      const result = await s2tCreateOrder({
        order_id: orderId,
        sub_category_id: Number(sub_category_id),
        quantity: 1,
        requirements,
        expected_unit_price: unitPrice,
      });

      if (dbAvailable) {
        await updateOrderByOrderId(orderId, {
          status: "processing",
          s2t_status: result.order.status,
          cost_price: result.order.charged_amount,
          player_name: result.order.player_name || player_name,
        });
      }

      return NextResponse.json({
        success: true,
        order: {
          order_id: orderId,
          status: result.order.status,
          player_id: result.order.player_id,
          player_name: result.order.player_name,
          package_name: result.order.subcategory_name,
          charged_amount: result.order.charged_amount,
          sell_price,
        },
      });
    } catch (apiErr: unknown) {
      const e = apiErr as { code?: string; message?: string };
      if (dbAvailable) {
        await updateOrderByOrderId(orderId, {
          status: "failed",
          s2t_status: e.code || "error",
        });
      }
      return NextResponse.json(
        {
          success: false,
          error: {
            code: e.code || "ORDER_FAILED",
            message: e.message || "No se pudo crear el pedido en Shop2TopUp",
          },
        },
        { status: 400 }
      );
    }
  } catch (err) {
    console.error("[api/orders/create]", err);
    return NextResponse.json(
      { success: false, error: "Error interno" },
      { status: 500 }
    );
  }
}
