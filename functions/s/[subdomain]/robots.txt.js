// robots.txt pro Kunden-Subdomain.
// Trial/Beta: Disallow: / (doppelter Schutz zusaetzlich zum noindex-Meta)
// Live: Allow + Sitemap-Hinweis
export async function onRequestGet({params, env, request}) {
  const subdomain = params.subdomain;
  if (!subdomain) {
    return new Response("User-agent: *\nDisallow: /\n", {
      headers: {"Content-Type": "text/plain; charset=utf-8"},
    });
  }

  const r = await fetch(
    `${env.SUPABASE_URL}/rest/v1/orders?subdomain=eq.${encodeURIComponent(subdomain)}&select=status`,
    {headers: {"apikey": env.SUPABASE_SERVICE_KEY, "Authorization": `Bearer ${env.SUPABASE_SERVICE_KEY}`}}
  );

  let status = null;
  if (r.ok) {
    const rows = await r.json();
    status = rows[0]?.status || null;
  }

  const url = new URL(request.url);
  const base = `${url.protocol}//${url.host}/s/${subdomain}`;

  if (status === "live") {
    return new Response(
      `User-agent: *\nAllow: /\n\nSitemap: ${base}/sitemap.xml\n`,
      {headers: {"Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600"}}
    );
  }

  return new Response(
    `User-agent: *\nDisallow: /\n`,
    {headers: {"Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=300"}}
  );
}
