export async function onRequestGet({params, env}) {
  const subdomain = params.subdomain;

  if (!subdomain) {
    return new Response("Not Found", {status: 404});
  }

  const r = await fetch(
    `${env.SUPABASE_URL}/rest/v1/orders?subdomain=eq.${encodeURIComponent(subdomain)}&select=website_html,firmenname,status`,
    {headers: {"apikey": env.SUPABASE_SERVICE_KEY, "Authorization": `Bearer ${env.SUPABASE_SERVICE_KEY}`}}
  );

  if (!r.ok) {
    return new Response("Fehler beim Laden", {status: 502});
  }

  const rows = await r.json();
  if (!rows.length || !rows[0].website_html) {
    return new Response(notFoundPage(subdomain), {
      status: 404,
      headers: {"Content-Type": "text/html; charset=utf-8"},
    });
  }

  return new Response(rows[0].website_html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=300",
      "X-Frame-Options": "SAMEORIGIN",
    },
  });
}

function notFoundPage(subdomain) {
  return `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Website nicht gefunden</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:system-ui,sans-serif;background:#f8fafc;color:#1e293b;display:flex;align-items:center;justify-content:center;min-height:100vh;padding:24px}
  .box{text-align:center;max-width:480px}
  h1{font-size:5rem;font-weight:900;color:#e2e8f0;line-height:1}
  h2{font-size:1.5rem;font-weight:700;margin:16px 0 8px}
  p{color:#64748b;line-height:1.6}
  .sub{display:inline-block;background:#f1f5f9;border:1px solid #e2e8f0;border-radius:6px;padding:4px 12px;font-family:monospace;font-size:.9rem;margin:12px 0 24px;color:#475569}
</style>
</head>
<body>
<div class="box">
  <h1>404</h1>
  <h2>Website nicht gefunden</h2>
  <div class="sub">/s/${subdomain}</div>
  <p>Diese Website existiert noch nicht oder wird gerade erstellt.</p>
</div>
</body>
</html>`;
}
