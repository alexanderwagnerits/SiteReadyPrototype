export async function onRequestPost({request, env}) {
  const url = new URL(request.url);
  const key = url.searchParams.get("key");
  if (!key || key !== env.ADMIN_SECRET) {
    return Response.json({error: "Unauthorized"}, {status: 401});
  }

  const {id} = await request.json();
  if (!id) return Response.json({error: "ID required"}, {status: 400});

  const headers = {
    "apikey": env.SUPABASE_SERVICE_KEY,
    "Authorization": `Bearer ${env.SUPABASE_SERVICE_KEY}`,
    "Content-Type": "application/json",
  };

  // 1. Order laden (fuer email + user_id)
  const orderResp = await fetch(
    `${env.SUPABASE_URL}/rest/v1/orders?id=eq.${id}&select=email,user_id`,
    {headers}
  );
  const orders = await orderResp.json();
  const order = orders?.[0];
  const email = order?.email;
  const userId = order?.user_id;

  // 2. Storage-Dateien loeschen (alle Fotos des Kunden)
  if (userId) {
    try {
      const listResp = await fetch(
        `${env.SUPABASE_URL}/storage/v1/object/list/customer-assets`,
        {method: "POST", headers, body: JSON.stringify({prefix: `${userId}/`, limit: 100})}
      );
      const files = await listResp.json();
      if (Array.isArray(files) && files.length > 0) {
        const paths = files.map(f => `${userId}/${f.name}`);
        await fetch(
          `${env.SUPABASE_URL}/storage/v1/object/customer-assets`,
          {method: "DELETE", headers, body: JSON.stringify({prefixes: paths})}
        );
      }
    } catch(_) {}
  }

  // 3. Auth-User loeschen
  if (userId) {
    try {
      await fetch(
        `${env.SUPABASE_URL}/auth/v1/admin/users/${userId}`,
        {method: "DELETE", headers}
      );
    } catch(_) {}
  }

  // 4. Support-Anfragen loeschen
  if (email) {
    try {
      await fetch(
        `${env.SUPABASE_URL}/rest/v1/support_requests?email=eq.${encodeURIComponent(email)}`,
        {method: "DELETE", headers: {...headers, "Prefer": "return=minimal"}}
      );
    } catch(_) {}
  }

  // 5. Order loeschen
  const delResp = await fetch(
    `${env.SUPABASE_URL}/rest/v1/orders?id=eq.${id}`,
    {method: "DELETE", headers: {...headers, "Prefer": "return=minimal"}}
  );

  return Response.json({ok: delResp.ok});
}
