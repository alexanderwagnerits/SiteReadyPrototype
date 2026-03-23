export async function onRequestPost({request, env, ctx}) {
  try {
    // 1. Supabase JWT pruefen
    const auth = request.headers.get("Authorization") || "";
    if (!auth.startsWith("Bearer ")) return Response.json({error: "Unauthorized"}, {status: 401});
    const token = auth.slice(7);

    const userRes = await fetch(`${env.SUPABASE_URL}/auth/v1/user`, {
      headers: {"apikey": env.SUPABASE_SERVICE_KEY, "Authorization": `Bearer ${token}`},
    });
    if (!userRes.ok) return Response.json({error: "Unauthorized"}, {status: 401});
    const user = await userRes.json();
    if (!user?.email) return Response.json({error: "Unauthorized"}, {status: 401});

    // 2. Body parsen
    let body = {};
    try { body = await request.json(); } catch(_) {}
    const fotos = body.fotos !== undefined ? body.fotos : null;

    // 3. Bestellung laden
    const orderRes = await fetch(
      `${env.SUPABASE_URL}/rest/v1/orders?email=eq.${encodeURIComponent(user.email)}&select=id,status&order=created_at.desc&limit=1`,
      {headers: {"apikey": env.SUPABASE_SERVICE_KEY, "Authorization": `Bearer ${env.SUPABASE_SERVICE_KEY}`}}
    );
    const orders = await orderRes.json();
    if (!orders.length) return Response.json({error: "Keine Bestellung gefunden"}, {status: 404});
    const order = orders[0];

    // 4. trial_expires_at setzen (7 Tage ab jetzt), Status bleibt pending bis Generierung fertig
    const trialExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    const patch = {regen_requested: false, trial_expires_at: trialExpiresAt};
    if (fotos !== null) patch.fotos = fotos;

    await fetch(`${env.SUPABASE_URL}/rest/v1/orders?id=eq.${order.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "apikey": env.SUPABASE_SERVICE_KEY,
        "Authorization": `Bearer ${env.SUPABASE_SERVICE_KEY}`,
        "Prefer": "return=minimal",
      },
      body: JSON.stringify(patch),
    });

    // 5. Website-Generierung im Hintergrund starten (setzt status: trial nach Abschluss)
    if (env.SITE_URL && env.ADMIN_SECRET) {
      ctx.waitUntil(
        fetch(`${env.SITE_URL}/api/generate-website?key=${env.ADMIN_SECRET}`, {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({order_id: order.id}),
        }).catch(() => {})
      );
    }

    return Response.json({ok: true});
  } catch(e) {
    return Response.json({error: "Interner Fehler: " + e.message}, {status: 500});
  }
}
