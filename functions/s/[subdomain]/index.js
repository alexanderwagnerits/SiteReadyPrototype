function normSocial(v) {
  if (!v) return "";
  v = v.trim().replace(/\/+$/, "");
  return v.startsWith("http") ? v : "https://" + v;
}

function buildSocialIcons(o) {
  const socials = [
    {url: normSocial(o.facebook),  label:"Facebook",  icon:`<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>`},
    {url: normSocial(o.instagram), label:"Instagram", icon:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>`},
    {url: normSocial(o.linkedin),  label:"LinkedIn",  icon:`<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>`},
    {url: normSocial(o.tiktok),    label:"TikTok",    icon:`<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/></svg>`},
  ].filter(s => s.url);
  if (!socials.length) return "";
  return `<div style="display:flex;gap:12px;margin-top:16px">${socials.map(s=>`<a href="${s.url}" target="_blank" rel="noopener noreferrer" aria-label="${s.label}" style="display:flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:50%;background:rgba(255,255,255,.12);color:#fff;text-decoration:none;transition:background .2s" onmouseover="this.style.background='rgba(255,255,255,.25)'" onmouseout="this.style.background='rgba(255,255,255,.12)'">${s.icon}</a>`).join("")}</div>`;
}

const OEZ_LABELS = {
  "mo-fr-8-17": "Mo\u2013Fr 8:00\u201317:00",
  "mo-fr-7-16": "Mo\u2013Fr 7:00\u201316:00",
  "mo-fr-8-18": "Mo\u2013Fr 8:00\u201318:00",
  "mo-sa-8-17": "Mo\u2013Sa 8:00\u201317:00",
  "mo-sa-8-12": "Mo\u2013Sa 8:00\u201312:00",
  "vereinbarung": "Nach Vereinbarung",
};

export async function onRequestGet({params, env}) {
  const subdomain = params.subdomain;
  if (!subdomain) return new Response("Not Found", {status: 404});

  const r = await fetch(
    `${env.SUPABASE_URL}/rest/v1/orders?subdomain=eq.${encodeURIComponent(subdomain)}&select=website_html,firmenname,status,url_logo,url_hero,url_foto1,url_foto2,url_team,telefon,email,adresse,plz,ort,kurzbeschreibung,oeffnungszeiten,oeffnungszeiten_custom,facebook,instagram,linkedin,tiktok,einsatzgebiet`,
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

  // ── Serve-time Variablen-Ersetzung (Sofort-Updates ohne Re-Generierung) ──
  const tel = o.telefon || "";
  const telHref = tel ? "tel:" + tel.replace(/\s/g, "") : "";
  const adresseVoll = [o.adresse, [o.plz, o.ort].filter(Boolean).join(" ")].filter(Boolean).join(", ");
  const oezKey = o.oeffnungszeiten || "";
  const oezLabel = oezKey === "custom" ? (o.oeffnungszeiten_custom || "") : (OEZ_LABELS[oezKey] || oezKey || "Nach Vereinbarung");

  const vars = {
    "{{FIRMENNAME}}":      o.firmenname || "",
    "{{TEL_HREF}}":        telHref,
    "{{TEL_DISPLAY}}":     tel,
    "{{EMAIL}}":           o.email || "",
    "{{ADRESSE_VOLL}}":    adresseVoll,
    "{{PLZ_ORT}}":         [o.plz, o.ort].filter(Boolean).join(" "),
    "{{KURZBESCHREIBUNG}}": o.kurzbeschreibung || "",
    "{{OEFFNUNGSZEITEN}}": oezLabel,
    "{{EINSATZGEBIET}}":   o.einsatzgebiet || "",
    "{{SOCIAL_ICONS}}":    buildSocialIcons(o),
  };
  for (const [key, val] of Object.entries(vars)) {
    html = html.split(key).join(val);
  }

  // TODO: noindex entfernen wenn live (aktivieren wenn Prototyp-Phase abgeschlossen)
  // if (o.status === "live") {
  //   html = html.replace(
  //     /<meta\s+name=["']robots["']\s+content=["']noindex,nofollow["']\s*\/?>/i,
  //     '<meta name="robots" content="index,follow">'
  //   );
  // }

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
