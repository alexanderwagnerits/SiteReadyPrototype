import { createLogger } from "../_lib/log.js";

export async function onRequestPost(context) {
  const {request, env, waitUntil} = context;
  const log = createLogger(env);
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

    await log.info(order.id, "build_started", {source: body.order_id ? "signup" : "portal", fotos});

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

    // Website-Generierung im Hintergrund (direkter Funktionsaufruf)
    const { generateWebsite } = await import("../_lib/generate.js");
    waitUntil((async () => {
      // 1. Versuch
      try {
        await generateWebsite(order.id, env);
        await log.info(order.id, "build_success", {attempt: 1});
        return;
      } catch(e1) {
        await log.error("start-build", {message: "Versuch 1 fehlgeschlagen: " + e1.message, stack: e1.stack});
      }

      // 2. Versuch nach 5 Minuten
      await new Promise(res => setTimeout(res, 5 * 60 * 1000));
      try {
        await generateWebsite(order.id, env);
        await log.info(order.id, "build_success", {attempt: 2});
      } catch(e2) {
        await log.error("start-build", {message: "Versuch 2 fehlgeschlagen: " + e2.message, stack: e2.stack});
        await log.info(order.id, "build_failed", {message: e2.message});
        // Fehler in DB loggen damit Portal/BuildScreen ihn anzeigen kann
        try {
          await fetch(`${env.SUPABASE_URL}/rest/v1/orders?id=eq.${order.id}`, {
            method: "PATCH",
            headers: {"Content-Type":"application/json","apikey":env.SUPABASE_SERVICE_KEY,"Authorization":`Bearer ${env.SUPABASE_SERVICE_KEY}`,"Prefer":"return=minimal"},
            body: JSON.stringify({last_error: "Generierung fehlgeschlagen nach 2 Versuchen: " + e2.message}),
          });
        } catch(e3) { console.error("start-build: DB-Patch last_error fehlgeschlagen", e3.message); }
      }
    })());

    // Auto-Resend Bestaetigungsmail nach 10 Min falls nicht bestaetigt
    if (body.order_id && env.SUPABASE_URL && env.SUPABASE_SERVICE_KEY) {
      waitUntil((async () => {
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
    await log.error("start-build", {message: e.message, stack: e.stack});
    return Response.json({error: "Interner Fehler: " + e.message}, {status: 500});
  }
}
