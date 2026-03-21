export async function onRequestGet({request, env}) {
  const url = new URL(request.url);
  const key = url.searchParams.get("key");
  if (!key || key !== env.ADMIN_SECRET) {
    return Response.json({error: "Unauthorized"}, {status: 401});
  }

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
