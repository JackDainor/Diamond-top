/**
 * Conexión a Neon (Postgres serverless)
 * La variable DATABASE_URL la crea automáticamente Vercel al instalar Neon.
 */
import { neon } from "@neondatabase/serverless";

function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "Falta DATABASE_URL. Crea una base de datos Neon en Vercel → Storage."
    );
  }
  return neon(url);
}

export type OrderStatus =
  | "pending_payment"
  | "paid"
  | "processing"
  | "completed"
  | "refunded"
  | "failed";

export type Order = {
  id: string;
  order_id: string; // UUID que enviamos a Shop2TopUp (idempotency)
  game_id: string;
  game_name: string;
  package_id: string;
  package_name: string;
  player_id: string;
  player_name: string | null;
  server: string | null;
  sell_price: string; // lo que cobra el cliente
  cost_price: string | null; // lo que nos cobra Shop2TopUp
  status: OrderStatus;
  s2t_status: string | null;
  voucher_code: string | null;
  created_at: string;
  updated_at: string;
};

/** Crea las tablas si no existen (ejecutar una vez al arrancar o manualmente) */
export async function ensureSchema() {
  const sql = getSql();
  await sql`
    CREATE TABLE IF NOT EXISTS orders (
      id            TEXT PRIMARY KEY,
      order_id      TEXT UNIQUE NOT NULL,
      game_id       TEXT NOT NULL,
      game_name     TEXT NOT NULL,
      package_id    TEXT NOT NULL,
      package_name  TEXT NOT NULL,
      player_id     TEXT NOT NULL,
      player_name   TEXT,
      server        TEXT,
      sell_price    TEXT NOT NULL,
      cost_price    TEXT,
      status        TEXT NOT NULL DEFAULT 'pending_payment',
      s2t_status    TEXT,
      voucher_code  TEXT,
      created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS idx_orders_player ON orders(player_id)
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)
  `;
}

export async function createOrderRecord(data: {
  id: string;
  order_id: string;
  game_id: string;
  game_name: string;
  package_id: string;
  package_name: string;
  player_id: string;
  player_name?: string | null;
  server?: string | null;
  sell_price: string;
  cost_price?: string | null;
  status?: OrderStatus;
}) {
  const sql = getSql();
  const rows = await sql`
    INSERT INTO orders (
      id, order_id, game_id, game_name, package_id, package_name,
      player_id, player_name, server, sell_price, cost_price, status
    ) VALUES (
      ${data.id},
      ${data.order_id},
      ${data.game_id},
      ${data.game_name},
      ${data.package_id},
      ${data.package_name},
      ${data.player_id},
      ${data.player_name ?? null},
      ${data.server ?? null},
      ${data.sell_price},
      ${data.cost_price ?? null},
      ${data.status ?? "pending_payment"}
    )
    RETURNING *
  `;
  return rows[0] as Order;
}

export async function updateOrderByOrderId(
  orderId: string,
  patch: {
    status?: OrderStatus;
    s2t_status?: string;
    cost_price?: string;
    voucher_code?: string;
    player_name?: string;
  }
) {
  const sql = getSql();
  const rows = await sql`
    UPDATE orders SET
      status = COALESCE(${patch.status ?? null}, status),
      s2t_status = COALESCE(${patch.s2t_status ?? null}, s2t_status),
      cost_price = COALESCE(${patch.cost_price ?? null}, cost_price),
      voucher_code = COALESCE(${patch.voucher_code ?? null}, voucher_code),
      player_name = COALESCE(${patch.player_name ?? null}, player_name),
      updated_at = NOW()
    WHERE order_id = ${orderId}
    RETURNING *
  `;
  return rows[0] as Order | undefined;
}

export async function getOrderByOrderId(orderId: string) {
  const sql = getSql();
  const rows = await sql`
    SELECT * FROM orders WHERE order_id = ${orderId} LIMIT 1
  `;
  return (rows[0] as Order) || null;
}

export async function listRecentOrders(limit = 50) {
  const sql = getSql();
  const rows = await sql`
    SELECT * FROM orders ORDER BY created_at DESC LIMIT ${limit}
  `;
  return rows as Order[];
}
