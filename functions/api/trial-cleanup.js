// Trial Cleanup – loescht abgelaufene Testphasen (status:trial + trial_expires_at < now)
// Aufruf: GET /api/trial-cleanup?key=ADMIN_SECRET
// Fuer Production: als Cloudflare Cron Trigger konfigurieren (taeglich 03:00 UTC)

export async function onRequestGet({request, env}) {
  const url = new URL(request.url);
  if (url.searchParams.get("key") !== env.ADMIN_SECRET) {
    return Response.json({error: "Unauthorized"}, {status: 401});
  }

  const sb = env.SUPABASE_URL;
  const sbKey = env.SUPABASE_SERVICE_KEY;
  if (!sb || !sbKey) return Response.json({error: "Supabase nicht konfiguriert"}, {status: 500});

  // Alle abgelaufenen Trial-Orders laden
  const now = new Date().toISOString();
  const r = await fetch(
    `${sb}/rest/v1/orders?status=eq.trial&trial_expires_at=lt.${encodeURIComponent(now)}&select=id,user_id,subdomain`,
    {headers: {"apikey": sbKey, "Authorization": `Bearer ${sbKey}`}}
  );
  const expired = await r.json();

  if (!expired.length) return Response.json({deleted: 0, message: "Keine abgelaufenen Trials"});

  let deleted = 0;
  const errors = [];

  for (const order of expired) {
    try {
      // 1. Supabase Storage loeschen (logo + fotos)
      if (order.user_id) {
        const files = ["logo.png","logo.jpg","logo.webp","foto1.jpg","foto1.png","foto1.webp",
          "foto2.jpg","foto2.png","foto2.webp","foto3.jpg","foto3.png","foto3.webp",
          "foto4.jpg","foto4.png","foto4.webp","foto5.jpg","foto5.png","foto5.webp"];
        await fetch(`${sb}/storage/v1/object/customer-assets`, {
          method: "DELETE",
          headers: {"apikey": sbKey, "Authorization": `Bearer ${sbKey}`, "Content-Type": "application/json"},
          body: JSON.stringify({prefixes: [`${order.user_id}/`]}),
        }).catch(e => errors.push({id: order.id, step: "storage", error: e.message}));
      }

      // 2. Supabase Auth User loeschen
      if (order.user_id) {
        await fetch(`${sb}/auth/v1/admin/users/${order.user_id}`, {
          method: "DELETE",
          headers: {"apikey": sbKey, "Authorization": `Bearer ${sbKey}`},
        }).catch(e => errors.push({id: order.id, step: "auth-user", error: e.message}));
      }

      // 3. Order-Record loeschen
      await fetch(`${sb}/rest/v1/orders?id=eq.${order.id}`, {
        method: "DELETE",
        headers: {"apikey": sbKey, "Authorization": `Bearer ${sbKey}`},
      });

      deleted++;
    } catch(e) {
      errors.push({id: order.id, error: e.message});
    }
  }

  return Response.json({deleted, errors: errors.length ? errors : undefined});
}
