import { NextRequest, NextResponse } from "next/server";
import { validatePlayer } from "@/lib/shop2topup";

/**
 * POST /api/validate
 * Body: { sub_category_id?, player_id, server? }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { player_id, server, sub_category_id } = body;

    if (!player_id || typeof player_id !== "string") {
      return NextResponse.json(
        { success: false, error: "player_id es requerido" },
        { status: 400 }
      );
    }

    // Si hay API key, usamos Shop2TopUp de verdad
    if (process.env.SHOP2TOPUP_API_KEY && sub_category_id) {
      try {
        const result = await validatePlayer({
          sub_category_id: Number(sub_category_id),
          player_id: String(player_id),
          ...(server ? { server: String(server) } : {}),
        });
        return NextResponse.json(result);
      } catch (err: unknown) {
        const e = err as { code?: string; message?: string; status?: number };
        return NextResponse.json(
          {
            success: false,
            error: {
              code: e.code || "VALIDATE_ERROR",
              message: e.message || "No se pudo validar el jugador",
            },
          },
          { status: e.status || 400 }
        );
      }
    }

    // Fallback mock (si aún no hay key o no envías sub_category_id)
    if (player_id.trim().length < 5) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "PLAYER_NOT_FOUND", message: "Player ID no encontrado" },
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      player: {
        player_id,
        player_name: `Jugador_${player_id.slice(-4)}`,
        region: server || "Global",
      },
    });
  } catch (err) {
    console.error("[api/validate]", err);
    return NextResponse.json(
      { success: false, error: "Error interno" },
      { status: 500 }
    );
  }
}
