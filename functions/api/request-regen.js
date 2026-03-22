export async function onRequestPost({request, env}) {
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

    // 2. Bestellung laden
    const orderRes = await fetch(
      `${env.SUPABASE_URL}/rest/v1/orders?email=eq.${encodeURIComponent(user.email)}&select=id,status,last_regen_at,prev_regen_at&order=created_at.desc&limit=1`,
      {headers: {"apikey": env.SUPABASE_SERVICE_KEY, "Authorization": `Bearer ${env.SUPABASE_SERVICE_KEY}`}},
    );
    const orders = await orderRes.json();
    if (!orders.length) return Response.json({error: "Keine Bestellung gefunden"}, {status: 404});
    const order = orders[0];

    // 3. Rate-Limit: 2 Neugenierungen pro 30 Tage
    const now = new Date();
    const ago30 = now.getTime() - 30 * 24 * 60 * 60 * 1000;
    const recent = [order.last_regen_at, order.prev_regen_at]
      .filter(Boolean)
      .map(d => new Date(d))
      .filter(d => d.getTime() > ago30)
      .sort((a, b) => a - b);

    if (recent.length >= 2) {
      const nextFree = new Date(recent[0].getTime() + 30 * 24 * 60 * 60 * 1000);
      return Response.json({error: "limit_reached", next_available: nextFree.toISOString()}, {status: 429});
    }

    // 4. Body: section + data (neue Leistungen/Design-Werte)
    let body;
    try { body = await request.json(); } catch(e) { return Response.json({error: "Invalid JSON"}, {status: 400}); }
    const {section, data} = body;
    if (!section || !data) return Response.json({error: "section und data erforderlich"}, {status: 400});

    // 5. Daten + Regen-Timestamps + Status speichern
    const patch = {
      ...data,
      prev_regen_at: order.last_regen_at || null,
      last_regen_at: now.toISOString(),
      regen_requested: false,
      status: "in_arbeit",
    };
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

    // 6. Website generieren (synchron, ca. 20-30s)
    const origin = new URL(request.url).origin;
    const genRes = await fetch(`${origin}/api/generate-website?key=${env.ADMIN_SECRET}`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({order_id: order.id}),
    });
    const genData = await genRes.json();

    if (!genData.ok) {
      // Rollback status auf bisherigen Wert
      await fetch(`${env.SUPABASE_URL}/rest/v1/orders?id=eq.${order.id}`, {
        method: "PATCH",
        headers: {"Content-Type":"application/json","apikey":env.SUPABASE_SERVICE_KEY,"Authorization":`Bearer ${env.SUPABASE_SERVICE_KEY}`,"Prefer":"return=minimal"},
        body: JSON.stringify({status: order.status || "paid"}),
      });
      return Response.json({error: "Generierung fehlgeschlagen: " + (genData.error || "Unbekannt")}, {status: 500});
    }

    return Response.json({ok: true, status: "review"});

  } catch(e) {
    return Response.json({error: "Interner Fehler: " + e.message}, {status: 500});
  }
}
