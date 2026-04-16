import { checkAdminAuth } from "../_lib/auth.js";

export async function onRequestGet({request, env}) {
  const unauthorized = checkAdminAuth(request, env);
  if (unauthorized) return unauthorized;

  const headers = {
    "apikey": env.SUPABASE_SERVICE_KEY,
    "Authorization": `Bearer ${env.SUPABASE_SERVICE_KEY}`,
  };

  const [ordersResp, ticketsResp] = await Promise.all([
    fetch(`${env.SUPABASE_URL}/rest/v1/orders?select=*&order=created_at.desc`, {headers}),
    fetch(`${env.SUPABASE_URL}/rest/v1/support_requests?select=*&order=created_at.desc`, {headers}),
  ]);

  const orders = await ordersResp.json();
  const tickets = await ticketsResp.json();

  return Response.json({
    orders: Array.isArray(orders) ? orders : [],
    tickets: Array.isArray(tickets) ? tickets : [],
  });
}
