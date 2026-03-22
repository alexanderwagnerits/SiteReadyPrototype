export async function onRequestPost({request, env}) {
  const url = new URL(request.url);
  const key = url.searchParams.get("key");
  if (!key || key !== env.ADMIN_SECRET) {
    return Response.json({error: "Unauthorized"}, {status: 401});
  }

  const {id} = await request.json();
  if (!id) return Response.json({error: "ID required"}, {status: 400});

  const resp = await fetch(
    `${env.SUPABASE_URL}/rest/v1/orders?id=eq.${id}`,
    {
      method: "DELETE",
      headers: {
        "apikey": env.SUPABASE_SERVICE_KEY,
        "Authorization": `Bearer ${env.SUPABASE_SERVICE_KEY}`,
        "Prefer": "return=minimal",
      },
    }
  );

  return Response.json({ok: resp.ok});
}
