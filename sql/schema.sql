-- Ejecuta esto UNA vez en el SQL Editor de Neon (o se crea solo con ensureSchema)
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
);

CREATE INDEX IF NOT EXISTS idx_orders_player ON orders(player_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);
