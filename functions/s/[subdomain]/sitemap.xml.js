// sitemap.xml pro Kunden-Subdomain. Nur fuer Live-Kunden.
// Trial/Beta: 404 (kein Leak, kein Indexierungs-Hinweis an Google).
export async function onRequestGet({params, env, request}) {
  const subdomain = params.subdomain;
  if (!subdomain) return new Response("Not Found", {status: 404});

  const r = await fetch(
    `${env.SUPABASE_URL}/rest/v1/orders?subdomain=eq.${encodeURIComponent(subdomain)}&select=status,updated_at,faq,galerie`,
    {headers: {"apikey": env.SUPABASE_SERVICE_KEY, "Authorization": `Bearer ${env.SUPABASE_SERVICE_KEY}`}}
  );
  if (!r.ok) return new Response("Not Found", {status: 404});
  const rows = await r.json();
  if (!rows.length || rows[0].status !== "live") {
    return new Response("Not Found", {status: 404});
  }
  const o = rows[0];

  const url = new URL(request.url);
  const base = `${url.protocol}//${url.host}/s/${subdomain}`;
  const lastmod = String(o.updated_at || new Date().toISOString()).split("T")[0];

  // Anchor-Links helfen Google bei Jump-to-Section-Ergebnissen
  const entries = [
    {loc: `${base}/`, priority: "1.0", changefreq: "monthly"},
    {loc: `${base}/#leistungen`, priority: "0.8"},
    {loc: `${base}/#ueber-uns`, priority: "0.7"},
    {loc: `${base}/#kontakt`, priority: "0.8"},
  ];
  if (Array.isArray(o.faq) && o.faq.length > 0) entries.push({loc: `${base}/#faq`, priority: "0.6"});
  if (Array.isArray(o.galerie) && o.galerie.length > 0) entries.push({loc: `${base}/#galerie`, priority: "0.5"});
  entries.push({loc: `${base}/impressum`, priority: "0.3"});
  entries.push({loc: `${base}/datenschutz`, priority: "0.3"});

  const xmlEntries = entries.map(e => {
    const parts = [`<loc>${e.loc}</loc>`, `<lastmod>${lastmod}</lastmod>`];
    if (e.changefreq) parts.push(`<changefreq>${e.changefreq}</changefreq>`);
    if (e.priority) parts.push(`<priority>${e.priority}</priority>`);
    return `  <url>${parts.join("")}</url>`;
  }).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlEntries}
</urlset>`;

  return new Response(xml, {
    headers: {"Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600"},
  });
}
