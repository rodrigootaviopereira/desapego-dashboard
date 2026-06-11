const BACKEND_URL = "https://desapego.goskip.app/backend/v1";
const POCKETBASE_URL = "https://desapego.goskip.app";
const CLIENT_ID = "RfMFWJuWFtKpueUG";
const CLIENT_SECRET = "56hk9MHxTgInKAohIhrEEjgHZwkQSwJ7";

let cachedToken: string | null = null;
let tokenExpiry = 0;

async function getToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken;

  const res = await fetch(`${BACKEND_URL}/api/auth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET }),
  });

  if (!res.ok) throw new Error(`Auth falhou: ${res.status}`);
  const data = await res.json();
  cachedToken = data.token ?? data.access_token;
  tokenExpiry = Date.now() + ((data.expires_in ?? 86400) - 300) * 1000;
  return cachedToken!;
}

function authHeaders(token: string) {
  return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
}

export async function fetchItems(filter?: string, page = 1, perPage = 100) {
  const token = await getToken();
  const params = new URLSearchParams({ page: String(page), perPage: String(perPage) });
  if (filter) params.set("filter", filter);

  const res = await fetch(
    `${POCKETBASE_URL}/api/collections/inventory_items/records?${params}`,
    { headers: authHeaders(token) }
  );
  if (!res.ok) throw new Error(`Erro ao buscar itens: ${res.status}`);
  return res.json();
}

export async function markSold(itemId: string, valorFinal: number) {
  const token = await getToken();
  const res = await fetch(`${BACKEND_URL}/api/items/${itemId}/mark-sold`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ valor_final: valorFinal }),
  });
  if (!res.ok) throw new Error(`Erro mark-sold: ${res.status}`);
  return res.json();
}

export async function markDonated(itemId: string, recipient: string, date: string) {
  const token = await getToken();
  const res = await fetch(`${BACKEND_URL}/api/items/${itemId}/mark-donated`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ donation_recipient: recipient, donation_date: date }),
  });
  if (!res.ok) throw new Error(`Erro mark-donated: ${res.status}`);
  return res.json();
}
