export async function onRequestGet({params, env}) {
  const subdomain = params.subdomain;
  if (!subdomain) return new Response("Not Found", {status: 404});

  const r = await fetch(
    `${env.SUPABASE_URL}/rest/v1/orders?subdomain=eq.${encodeURIComponent(subdomain)}&select=website_html,firmenname,status,url_logo,url_hero,url_foto1,url_foto2,url_team`,
    {headers: {"apikey": env.SUPABASE_SERVICE_KEY, "Authorization": `Bearer ${env.SUPABASE_SERVICE_KEY}`}}
  );
  if (!r.ok) return new Response("Fehler beim Laden", {status: 502});

  const rows = await r.json();
  if (!rows.length || !rows[0].website_html) {
    return new Response(notFoundPage(subdomain), {status: 404, headers: {"Content-Type": "text/html; charset=utf-8"}});
  }

  let html = rows[0].website_html;
  const o = rows[0];

  // Logo in Nav injizieren (ersetzt Firmenname-Text durch <img>)
  if (o.url_logo) {
    html = html.replace(
      /(<a[^>]*id="site-nav-logo"[^>]*>)[^<]*(<\/a>)/,
      `$1<img src="${o.url_logo}" alt="Logo" style="height:38px;width:auto;object-fit:contain;display:block;max-width:160px">$2`
    );
  }

  // Foto-Slots injizieren: <img> wird absolut in den Platzhalter-Div eingefuegt
  const slots = [
    {id: "slot-hero",  url: o.url_hero},
    {id: "slot-foto1", url: o.url_foto1},
    {id: "slot-foto2", url: o.url_foto2},
    {id: "slot-team",  url: o.url_team},
  ];
  for (const slot of slots) {
    if (!slot.url) continue;
    // Fuge img direkt nach dem oeffnenden Tag ein (ueberdeckt Platzhalter-Inhalt)
    html = html.replace(
      new RegExp(`(<[^>]+id="${slot.id}"[^>]*>)`),
      `$1<img src="${slot.url}" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:1;display:block">`
    );
  }

  // noindex entfernen wenn live (Google darf indexieren)
  if (o.status === "live") {
    html = html.replace(
      /<meta\s+name=["']robots["']\s+content=["']noindex,nofollow["']\s*\/?>/i,
      '<meta name="robots" content="index,follow">'
    );
  }

  return new Response(html, {
    status: 200,
    headers: {"Content-Type": "text/html; charset=utf-8", "Cache-Control": "public, max-age=60"},
  });
}

function notFoundPage(subdomain) {
  return `<!DOCTYPE html><html lang="de"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Website nicht gefunden</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:system-ui,sans-serif;background:#f8fafc;color:#1e293b;display:flex;align-items:center;justify-content:center;min-height:100vh;padding:24px}.box{text-align:center;max-width:480px}h1{font-size:5rem;font-weight:900;color:#e2e8f0;line-height:1}h2{font-size:1.5rem;font-weight:700;margin:16px 0 8px}p{color:#64748b;line-height:1.6}</style>
</head><body><div class="box"><h1>404</h1><h2>Website nicht gefunden</h2><p>Diese Website existiert noch nicht oder wird gerade erstellt.</p></div></body></html>`;
}
