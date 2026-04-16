// llms.txt pro Kunden-Subdomain — strukturierte Zusammenfassung fuer AI-Search
// (ChatGPT, Perplexity, Claude). Nur fuer Live-Kunden.
export async function onRequestGet({params, env, request}) {
  const subdomain = params.subdomain;
  if (!subdomain) return new Response("Not Found", {status: 404});

  const r = await fetch(
    `${env.SUPABASE_URL}/rest/v1/orders?subdomain=eq.${encodeURIComponent(subdomain)}&select=*`,
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

  const adr = [o.adresse, [o.plz, o.ort].filter(Boolean).join(" ")].filter(Boolean).join(", ");
  const oezMap = {
    "mo-fr-8-17": "Mo–Fr 08:00–17:00",
    "mo-fr-7-16": "Mo–Fr 07:00–16:00",
    "mo-fr-8-18": "Mo–Fr 08:00–18:00",
    "mo-sa-8-17": "Mo–Sa 08:00–17:00",
    "mo-sa-8-12": "Mo–Sa 08:00–12:00",
    "vereinbarung": "Nach Vereinbarung",
  };
  const oez = o.oeffnungszeiten_custom || oezMap[o.oeffnungszeiten] || "";

  const lines = [];
  lines.push(`# ${o.firmenname || subdomain}`);
  lines.push("");
  if (o.kurzbeschreibung) {
    lines.push(`> ${o.kurzbeschreibung}`);
    lines.push("");
  }

  lines.push("## Kontakt");
  if (o.telefon) lines.push(`- Telefon: ${o.telefon}`);
  if (o.email) lines.push(`- E-Mail: ${o.email}`);
  if (adr) lines.push(`- Adresse: ${adr}`);
  if (o.einsatzgebiet) lines.push(`- Einsatzgebiet: ${o.einsatzgebiet}`);
  if (oez) lines.push(`- Öffnungszeiten: ${oez}`);
  lines.push("");

  if (Array.isArray(o.leistungen) && o.leistungen.length > 0) {
    lines.push("## Leistungen");
    for (const l of o.leistungen) {
      const desc = o.leistungen_beschreibungen?.[l];
      lines.push(desc ? `- **${l}**: ${desc}` : `- ${l}`);
    }
    lines.push("");
  }

  if (o.text_ueber_uns) {
    lines.push("## Über uns");
    lines.push(o.text_ueber_uns);
    lines.push("");
  }

  if (Array.isArray(o.team_members) && o.team_members.length > 0) {
    lines.push("## Team");
    for (const t of o.team_members) {
      const rolle = t.rolle ? ` (${t.rolle})` : "";
      lines.push(`- ${t.name}${rolle}`);
    }
    lines.push("");
  }

  if (Array.isArray(o.faq) && o.faq.length > 0) {
    lines.push("## Häufige Fragen");
    for (const f of o.faq) {
      if (!f.frage) continue;
      lines.push(`### ${f.frage}`);
      if (f.antwort) lines.push(f.antwort);
      lines.push("");
    }
  }

  if (Array.isArray(o.bewertungen) && o.bewertungen.length > 0) {
    lines.push("## Kundenbewertungen");
    for (const b of o.bewertungen.slice(0, 5)) {
      if (!b.text) continue;
      const sterne = b.sterne ? ` (${b.sterne}/5)` : "";
      const name = b.name ? ` — ${b.name}` : "";
      lines.push(`> "${b.text}"${name}${sterne}`);
      lines.push("");
    }
  }

  lines.push("## Website");
  lines.push(`- ${base}`);
  lines.push(`- Impressum: ${base}/impressum`);
  lines.push(`- Datenschutz: ${base}/datenschutz`);

  return new Response(lines.join("\n"), {
    headers: {"Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600"},
  });
}
