export async function onRequestGet({params, env}) {
  const subdomain = params.subdomain;
  if (!subdomain) return new Response("Not Found", {status: 404});

  const r = await fetch(
    `${env.SUPABASE_URL}/rest/v1/orders?subdomain=eq.${encodeURIComponent(subdomain)}&select=firmenname,email,telefon,adresse,plz,ort,bundesland,facebook,instagram,linkedin,tiktok,url_logo`,
    {headers: {"apikey": env.SUPABASE_SERVICE_KEY, "Authorization": `Bearer ${env.SUPABASE_SERVICE_KEY}`}}
  );
  if (!r.ok) return new Response("Fehler", {status: 502});
  const rows = await r.json();
  if (!rows.length) return new Response("Not Found", {status: 404});

  const o = rows[0];
  const tel = (o.telefon || "").replace(/\s/g, "");
  const adr = [o.adresse, [o.plz, o.ort].filter(Boolean).join(" ")].filter(Boolean).join(", ");
  const website = `https://sitereadyprototype.pages.dev/s/${subdomain}`;

  const vcf = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${o.firmenname || subdomain}`,
    `ORG:${o.firmenname || ""}`,
    tel ? `TEL;TYPE=WORK:${tel}` : "",
    o.email ? `EMAIL;TYPE=WORK:${o.email}` : "",
    adr ? `ADR;TYPE=WORK:;;${o.adresse || ""};${o.ort || ""};;${o.plz || ""};\u00D6sterreich` : "",
    `URL:${website}`,
    o.url_logo ? `PHOTO;VALUE=uri:${o.url_logo}` : "",
    "END:VCARD",
  ].filter(Boolean).join("\r\n");

  const filename = (o.firmenname || subdomain).replace(/[^a-zA-Z0-9\u00C0-\u024F]/g, "_") + ".vcf";

  return new Response(vcf, {
    status: 200,
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
