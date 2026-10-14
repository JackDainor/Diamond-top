import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { updateOrderByOrderId } from "@/lib/db";

const WEBHOOK_SECRET = process.env.SHOP2TOPUP_WEBHOOK_SECRET || "";

function verifySignature(rawBody: string, signatureHeader: string | null): boolean {
  if (!WEBHOOK_SECRET || !signatureHeader) return false;
  const expected = signatureHeader.replace(/^sha256=/, "");
  const computed = crypto
    .createHmac("sha256", WEBHOOK_SECRET)
    .update(rawBody)
    .digest("hex");
  try {
    return crypto.timingSafeEqual(
      Buffer.from(expected, "hex"),
      Buffer.from(computed, "hex")
    );
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-shop2topup-signature");
  const event = req.headers.get("x-shop2topup-event");

  if (WEBHOOK_SECRET && !verifySignature(rawBody, signature)) {
    console.warn("[webhook] Firma inválida");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: {
    event: string;
    timestamp: string;
    data: {
      order_id: string;
      status: string;
      player_id?: string;
      player_name?: string;
      subcategory_name?: string;
      charged_amount?: string;
      vouchers?: Array<{ code: string; serial_number?: string }>;
    };
  };

  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const orderId = payload.data?.order_id;
  console.log(`[webhook] ${event || payload.event} → ${orderId}`);

  if (orderId) {
    try {
      const voucher =
        payload.data.vouchers && payload.data.vouchers.length > 0
          ? payload.data.vouchers[0].code
          : undefined;

      if (payload.event === "order.completed" || event === "order.completed") {
        await updateOrderByOrderId(orderId, {
          status: "completed",
          s2t_status: "completed",
          voucher_code: voucher,
          player_name: payload.data.player_name,
        });
      } else if (
        payload.event === "order.refunded" ||
        event === "order.refunded"
      ) {
        await updateOrderByOrderId(orderId, {
          status: "refunded",
          s2t_status: "refunded",
        });
      }
    } catch (dbErr) {
      console.error("[webhook] Error actualizando DB:", dbErr);
    }
  }

  return NextResponse.json({ received: true });
}
