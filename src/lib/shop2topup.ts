/**
 * Cliente mínimo para la API de Shop2TopUp.
 *
 * IMPORTANTE:
 * - La API Key NUNCA debe estar en el frontend.
 * - Solo se usa desde Server Components / API Routes / Server Actions.
 * - Guarda la key en Vercel → Environment Variables:
 *     SHOP2TOPUP_API_KEY = "tu_key_id.tu_secret"
 */

const BASE_URL = "https://shop2topup.com/api/endpoints/v1";

function getApiKey(): string {
  const key = process.env.SHOP2TOPUP_API_KEY;
  if (!key) {
    throw new Error(
      "Falta la variable de entorno SHOP2TOPUP_API_KEY. Configúrala en Vercel."
    );
  }
  return key;
}

async function s2tFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${getApiKey()}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    // Importante para no cachear precios/catálogo en producción
    cache: "no-store",
  });

  const data = await res.json();

  if (!res.ok || data.success === false) {
    const code = data?.error?.code || `HTTP_${res.status}`;
    const message = data?.error?.message || "Error en la API de Shop2TopUp";
    throw Object.assign(new Error(message), { code, status: res.status });
  }

  return data as T;
}

// ─── Endpoints útiles ───────────────────────────────────────

export async function getAccount() {
  return s2tFetch<{
    success: boolean;
    account: { balance: string; currency: string; status: string };
  }>("/account");
}

export async function getCategories(bigCategoryId = 1) {
  return s2tFetch<{
    success: boolean;
    categories: Array<{
      id: number;
      name: string;
      description: string;
      big_category_id: number;
    }>;
  }>(`/catalog/categories?bigCategoryId=${bigCategoryId}&for_ui=true`);
}

export async function getSubcategories(categoryId: number) {
  return s2tFetch<{
    success: boolean;
    subcategories: Array<{
      item_id: number;
      name: string;
      description: string;
      category_id: number;
      price: string;
      product_type: string;
    }>;
  }>(`/catalog/subcategories?categoryId=${categoryId}`);
}

export async function getItemPrice(itemId: number) {
  return s2tFetch<{
    success: boolean;
    price: {
      item_id: number;
      item_name: string;
      unit_price: string;
      currency: string;
    };
  }>(`/catalog/subcategory/${itemId}/price`);
}

export async function getCategoryRequirements(categoryId: number) {
  return s2tFetch<{
    success: boolean;
    requirements: Array<{
      field_name: string;
      data_type: string;
      placeholder?: string;
      select_options?: string[];
    }>;
  }>(`/catalog/category/${categoryId}/requirements`);
}

export async function validatePlayer(payload: {
  sub_category_id: number;
  player_id: string;
  server?: string;
  [key: string]: unknown;
}) {
  return s2tFetch<{
    success: boolean;
    player: {
      player_id: string;
      player_name: string;
      region?: string;
    };
  }>("/player/validate", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function createOrder(payload: {
  order_id: string; // UUID que generas tú (idempotency key)
  sub_category_id: number;
  quantity: number;
  requirements: Record<string, string>;
  expected_unit_price: string;
}) {
  return s2tFetch<{
    success: boolean;
    order: {
      order_id: string;
      status: "pending" | "completed" | "refunded" | "partial";
      player_id: string;
      player_name?: string;
      subcategory_name: string;
      quantity: number;
      charged_amount: string;
      currency: string;
      created_at: string;
    };
  }>("/orders/create", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getOrder(orderId: string) {
  return s2tFetch<{
    success: boolean;
    order: {
      order_id: string;
      status: string;
      player_id: string;
      player_name?: string;
      subcategory_name: string;
      charged_amount: string;
      vouchers?: Array<{ code: string; serial_number?: string }>;
    };
  }>(`/orders/${orderId}`);
}
