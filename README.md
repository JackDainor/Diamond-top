# DiamondTop — Tienda de recargas

Next.js + Vercel + Neon + Shop2TopUp

## Desplegar en Vercel (celular)

1. Sube la carpeta `topup-store` a un repo de GitHub
2. Vercel → Add New Project → conecta el repo → Deploy
3. Environment Variables:
   - `SHOP2TOPUP_API_KEY` = tu key (keyId.secret)
4. Storage → Create Database → **Neon** (plan Free)
5. Redeploy

## Crear las tablas en Neon

Opción A (automática): la primera vez que crees un pedido, el código ejecuta `ensureSchema()`.

Opción B (manual):
1. Vercel → Storage → tu base Neon → Open in Neon
2. SQL Editor → pega el contenido de `sql/schema.sql` → Run

## Pedidos reales en Shop2TopUp

Los paquetes de `src/lib/games.ts` son de **ejemplo**.  
Para pedidos reales necesitas los `item_id` (sub_category_id) del catálogo de Shop2TopUp.

1. Con tu API key llama a:
   `GET /catalog/categories?bigCategoryId=1`
   y luego
   `GET /catalog/subcategories?categoryId=XX`
2. Copia los `item_id` reales
3. Agrégalos a cada paquete en `games.ts` (campo `s2tItemId`)
4. En `OrderForm` descomenta el envío de `sub_category_id`

Sin `sub_category_id` el sistema guarda el pedido en Neon en modo demo y **no** cobra a Shop2TopUp.

## Webhook

URL pública después del deploy:
`https://TU-DOMINIO.vercel.app/api/webhook/shop2topup`

Configúrala en el panel de Shop2TopUp → Webhooks.

## Flujo actual (pruebas)

1. Usuario elige paquete + Player ID
2. Se valida (API real si hay key + sub_category_id)
3. Al confirmar → se guarda en Neon + se crea orden en Shop2TopUp (si hay saldo)
4. Webhook actualiza el estado a completed / refunded

**Importante:** aún no hay cobro al cliente. En producción cobra primero (Mercado Pago, etc.) y solo después creas la orden en Shop2TopUp.
