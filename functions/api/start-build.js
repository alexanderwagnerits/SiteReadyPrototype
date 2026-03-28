export async function onRequestPost({request, env, ctx}) {
  try {
    // Body parsen
    let body = {};
    try { body = await request.json(); } catch(_) {}
    const fotos = body.fotos !== undefined ? body.fotos : null;

    let order = null;

    // Variante A: order_id direkt uebergeben (nach signUp, kein Token vorhanden)
    if (body.order_id) {
      const orderRes = await fetch(
        `${env.SUPABASE_URL}/rest/v1/orders?id=eq.${body.order_id}&select=id,status&limit=1`,
        {headers: {"apikey": env.SUPABASE_SERVICE_KEY, "Authorization": `Bearer ${env.SUPABASE_SERVICE_KEY}`}}
      );
      const orders = await orderRes.json();
      if (!orders.length) return Response.json({error: "Bestellung nicht gefunden"}, {status: 404});
      order = orders[0];
    }
    // Variante B: JWT-Token (Portal-Regenerierung)
    else {
      const auth = request.headers.get("Authorization") || "";
      if (!auth.startsWith("Bearer ")) return Response.json({error: "Unauthorized"}, {status: 401});
      const token = auth.slice(7);
      const userRes = await fetch(`${env.SUPABASE_URL}/auth/v1/user`, {
        headers: {"apikey": env.SUPABASE_SERVICE_KEY, "Authorization": `Bearer ${token}`},
      });
      if (!userRes.ok) return Response.json({error: "Unauthorized"}, {status: 401});
      const user = await userRes.json();
      if (!user?.email) return Response.json({error: "Unauthorized"}, {status: 401});
      const orderRes = await fetch(
        `${env.SUPABASE_URL}/rest/v1/orders?email=eq.${encodeURIComponent(user.email)}&select=id,status&order=created_at.desc&limit=1`,
        {headers: {"apikey": env.SUPABASE_SERVICE_KEY, "Authorization": `Bearer ${env.SUPABASE_SERVICE_KEY}`}}
      );
      const orders = await orderRes.json();
      if (!orders.length) return Response.json({error: "Keine Bestellung gefunden"}, {status: 404});
      order = orders[0];
    }

    // trial_expires_at setzen (7 Tage ab jetzt), Status bleibt pending bis Generierung fertig
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

    // Website-Generierung im Hintergrund + Auto-Retry nach 5 Min bei Fehler
    const siteUrl = env.SITE_URL || new URL(request.url).origin;
    if (env.ADMIN_SECRET) {
      ctx.waitUntil((async () => {
        const genUrl = `${siteUrl}/api/generate-website?key=${env.ADMIN_SECRET}`;
        const genBody = JSON.stringify({order_id: order.id});
        const genHeaders = {"Content-Type": "application/json"};

        // 1. Versuch
        try {
          const r = await fetch(genUrl, {method: "POST", headers: genHeaders, body: genBody});
          if (r.ok) return; // Erfolg
        } catch(_) {}

        // 2. Versuch nach 5 Minuten
        await new Promise(res => setTimeout(res, 5 * 60 * 1000));
        try {
          await fetch(genUrl, {method: "POST", headers: genHeaders, body: genBody});
        } catch(_) {}
      })());
    }

    // Auto-Resend Bestaetigungsmail nach 10 Min falls nicht bestaetigt
    if (body.order_id && env.SUPABASE_URL && env.SUPABASE_SERVICE_KEY) {
      ctx.waitUntil((async () => {
        await new Promise(res => setTimeout(res, 10 * 60 * 1000));
        // Pruefen ob User bestaetigt ist
        const email = (await (await fetch(
          `${env.SUPABASE_URL}/rest/v1/orders?id=eq.${order.id}&select=email`,
          {headers: {"apikey": env.SUPABASE_SERVICE_KEY, "Authorization": `Bearer ${env.SUPABASE_SERVICE_KEY}`}}
        )).json())?.[0]?.email;
        if (!email) return;
        // User-Status pruefen via Admin API
        const usersRes = await fetch(
          `${env.SUPABASE_URL}/auth/v1/admin/users?page=1&per_page=1`,
          {headers: {"apikey": env.SUPABASE_SERVICE_KEY, "Authorization": `Bearer ${env.SUPABASE_SERVICE_KEY}`}}
        );
        if (!usersRes.ok) return;
        const usersData = await usersRes.json();
        const allUsers = usersData?.users || [];
        const user = allUsers.find(u => u.email === email);
        if (user && !user.email_confirmed_at) {
          // Bestaetigungsmail erneut senden
          await fetch(`${env.SUPABASE_URL}/auth/v1/resend`, {
            method: "POST",
            headers: {"apikey": env.SUPABASE_SERVICE_KEY, "Content-Type": "application/json"},
            body: JSON.stringify({type: "signup", email}),
          });
        }
      })());
    }

    return Response.json({ok: true});
  } catch(e) {
    return Response.json({error: "Interner Fehler: " + e.message}, {status: 500});
  }
}
