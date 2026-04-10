// Health Monitor – prueft Kunden-Websites und APIs, erstellt Tickets bei Problemen
// Aufruf: GET /api/health-monitor?key=ADMIN_SECRET
// Fuer Production: als Cloudflare Cron Trigger konfigurieren (alle 15 Min)

export async function onRequestGet({request, env}) {
  const url = new URL(request.url);
  if (url.searchParams.get("key") !== env.ADMIN_SECRET) {
    return Response.json({error: "Unauthorized"}, {status: 401});
  }

  const sb = env.SUPABASE_URL;
  const sbKey = env.SUPABASE_SERVICE_KEY;
  if (!sb || !sbKey) return Response.json({error: "Supabase nicht konfiguriert"}, {status: 500});

  const headers = {"Content-Type":"application/json","apikey":sbKey,"Authorization":`Bearer ${sbKey}`};
  const results = {websites: [], apis: [], tickets: 0};

  // ═══ 1. Kunden-Websites pruefen ═══
  const ordersRes = await fetch(
    `${sb}/rest/v1/orders?status=in.(live,trial)&subdomain=not.is.null&select=id,subdomain,firmenname,status`,
    {headers: {"apikey": sbKey, "Authorization": `Bearer ${sbKey}`}}
  );
  const orders = await ordersRes.json();
  const siteUrl = env.SITE_URL || "https://sitereadyprototype.pages.dev";

  for (const o of (orders || [])) {
    if (!o.subdomain) continue;
    try {
      const r = await fetch(`${siteUrl}/s/${o.subdomain}`, {method: "HEAD", redirect: "follow"});
      if (!r.ok) {
        results.websites.push({subdomain: o.subdomain, status: r.status});
        // Ticket erstellen
        try {
          await fetch(`${sb}/rest/v1/support_requests`, {
            method: "POST", headers,
            body: JSON.stringify({
              email: "system@siteready.at",
              subject: `[Auto] Website nicht erreichbar: ${o.firmenname || o.subdomain}`,
              message: `Die Website ${o.subdomain}.siteready.at ist nicht erreichbar.\n\nHTTP Status: ${r.status}\nOrder: ${o.id}\nFirma: ${o.firmenname || "unbekannt"}\nStatus: ${o.status}`,
              status: "offen"
            })
          });
          results.tickets++;
        } catch(e) { console.error("health-monitor: Ticket erstellen fehlgeschlagen", e.message); }
      }
    } catch(e) {
      results.websites.push({subdomain: o.subdomain, error: e.message});
      try {
        await fetch(`${sb}/rest/v1/support_requests`, {
          method: "POST", headers,
          body: JSON.stringify({
            email: "system@siteready.at",
            subject: `[Auto] Website Fehler: ${o.firmenname || o.subdomain}`,
            message: `Fehler beim Pruefen von ${o.subdomain}.siteready.at:\n\n${e.message}\n\nOrder: ${o.id}\nFirma: ${o.firmenname || "unbekannt"}`,
            status: "offen"
          })
        });
        results.tickets++;
      } catch(e) { console.error("health-monitor: Ticket erstellen fehlgeschlagen", e.message); }
    }
  }

  // ═══ 2. APIs pruefen ═══
  const apis = [
    {name: "Supabase", check: async () => {
      const r = await fetch(`${sb}/rest/v1/orders?select=id&limit=1`, {headers: {"apikey": sbKey, "Authorization": `Bearer ${sbKey}`}});
      return r.ok;
    }},
    {name: "Stripe", check: async () => {
      if (!env.STRIPE_SECRET_KEY) return true; // Skip wenn nicht konfiguriert
      const r = await fetch("https://api.stripe.com/v1/balance", {headers: {"Authorization": `Bearer ${env.STRIPE_SECRET_KEY}`}});
      return r.ok;
    }},
    // Anthropic wird nicht geprueft — Rate-Limits erzeugen False-Positives.
    // Bei echten Problemen kommt ein Ticket via generate-website.js.
  ];

  for (const api of apis) {
    try {
      const ok = await api.check();
      if (!ok) {
        results.apis.push({name: api.name, ok: false});
        try {
          await fetch(`${sb}/rest/v1/support_requests`, {
            method: "POST", headers,
            body: JSON.stringify({
              email: "system@siteready.at",
              subject: `[Auto] API nicht erreichbar: ${api.name}`,
              message: `Die ${api.name} API ist nicht erreichbar oder antwortet mit einem Fehler.\n\nZeitpunkt: ${new Date().toISOString()}\n\nBitte umgehend pruefen.`,
              status: "offen"
            })
          });
          results.tickets++;
        } catch(e) { console.error("health-monitor: Ticket erstellen fehlgeschlagen", e.message); }
      } else {
        results.apis.push({name: api.name, ok: true});
      }
    } catch(e) {
      results.apis.push({name: api.name, ok: false, error: e.message});
      try {
        await fetch(`${sb}/rest/v1/support_requests`, {
          method: "POST", headers,
          body: JSON.stringify({
            email: "system@siteready.at",
            subject: `[Auto] API Fehler: ${api.name}`,
            message: `Fehler beim Pruefen der ${api.name} API:\n\n${e.message}\n\nZeitpunkt: ${new Date().toISOString()}`,
            status: "offen"
          })
        });
        results.tickets++;
      } catch(e) { console.error("health-monitor: Ticket erstellen fehlgeschlagen", e.message); }
    }
  }

  return Response.json({
    ok: results.websites.length === 0 && results.apis.every(a => a.ok),
    checked: {websites: orders?.length || 0, apis: apis.length},
    issues: results,
    timestamp: new Date().toISOString()
  });
}
