export async function onRequestGet({request, env}) {
  const url = new URL(request.url);
  if (url.searchParams.get("key") !== env.ADMIN_SECRET) return new Response("Unauthorized", {status:401});
  const orderId = url.searchParams.get("order_id");
  if (!orderId) return Response.json({error:"order_id required"}, {status:400});

  const resp = await fetch(
    `${env.SUPABASE_URL}/rest/v1/activity_log?order_id=eq.${encodeURIComponent(orderId)}&order=created_at.desc&limit=50`,
    {headers:{"apikey":env.SUPABASE_SERVICE_KEY,"Authorization":`Bearer ${env.SUPABASE_SERVICE_KEY}`}}
  );
  const data = await resp.json();
  return Response.json(Array.isArray(data) ? data : []);
}

export async function onRequestPost({request, env}) {
  const url = new URL(request.url);
  if (url.searchParams.get("key") !== env.ADMIN_SECRET) return new Response("Unauthorized", {status:401});

  const {order_id, action, details, actor} = await request.json();
  if (!order_id || !action) return Response.json({error:"order_id + action required"}, {status:400});

  await fetch(`${env.SUPABASE_URL}/rest/v1/activity_log`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": env.SUPABASE_SERVICE_KEY,
      "Authorization": `Bearer ${env.SUPABASE_SERVICE_KEY}`,
      "Prefer": "return=minimal",
    },
    body: JSON.stringify({order_id, action, details: details||null, actor: actor||"admin"}),
  });
  return Response.json({ok: true});
}
