const OEZ_LABELS = {
  "mo-fr-8-17": "Mo\u2013Fr 8:00\u201317:00",
  "mo-fr-7-16": "Mo\u2013Fr 7:00\u201316:00",
  "mo-fr-8-18": "Mo\u2013Fr 8:00\u201318:00",
  "mo-sa-8-17": "Mo\u2013Sa 8:00\u201317:00",
  "mo-sa-8-12": "Mo\u2013Sa 8:00\u201312:00",
  "vereinbarung": "Nach Vereinbarung",
};

function normSocial(v) {
  if (!v) return "";
  v = v.trim().replace(/\/+$/, "");
  return v.startsWith("http") ? v : "https://" + v;
}

// SVG Icons (24x24 viewBox, stroke-based)
const ICONS = {
  phone: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
  mail: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
  map: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
  globe: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>`,
  whatsapp: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>`,
  clock: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  area: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
  save: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>`,
  share: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>`,
};

export async function onRequestGet({params, env}) {
  const subdomain = params.subdomain;
  if (!subdomain) return new Response("Not Found", {status: 404});

  const r = await fetch(
    `${env.SUPABASE_URL}/rest/v1/orders?subdomain=eq.${encodeURIComponent(subdomain)}&select=firmenname,kurzbeschreibung,email,telefon,adresse,plz,ort,bundesland,oeffnungszeiten,oeffnungszeiten_custom,einsatzgebiet,leistungen,facebook,instagram,linkedin,tiktok,url_logo,stil,status`,
    {headers: {"apikey": env.SUPABASE_SERVICE_KEY, "Authorization": `Bearer ${env.SUPABASE_SERVICE_KEY}`}}
  );
  if (!r.ok) return new Response("Fehler", {status: 502});
  const rows = await r.json();
  if (!rows.length) return new Response(notFoundHtml(), {status: 404, headers: {"Content-Type": "text/html; charset=utf-8"}});

  const o = rows[0];
  if (o.status === "offline") return new Response(notFoundHtml(), {status: 503, headers: {"Content-Type": "text/html; charset=utf-8"}});

  const tel = o.telefon || "";
  const telClean = tel.replace(/\s/g, "");
  const telHref = tel ? "tel:" + telClean : "";
  const waHref = tel ? "https://wa.me/" + telClean.replace(/^\+/, "") : "";
  const emailHref = o.email ? "mailto:" + o.email : "";
  const adr = [o.adresse, [o.plz, o.ort].filter(Boolean).join(" ")].filter(Boolean).join(", ");
  const mapsUrl = adr ? `https://maps.google.com/maps?q=${encodeURIComponent(adr + ", \u00D6sterreich")}` : "";
  const oez = o.oeffnungszeiten === "custom" ? (o.oeffnungszeiten_custom || "") : (OEZ_LABELS[o.oeffnungszeiten] || o.oeffnungszeiten || "");
  const websiteUrl = `https://sitereadyprototype.pages.dev/s/${subdomain}`;
  const vcardUrl = `/s/${subdomain}/vcard-contact`;
  const leistungen = o.leistungen || [];

  const socials = [
    {url: normSocial(o.facebook),  label: "Facebook",  svg: `<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>`},
    {url: normSocial(o.instagram), label: "Instagram", svg: `<rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.5" cy="6.5" r="1"/>`},
    {url: normSocial(o.linkedin),  label: "LinkedIn",  svg: `<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/>`},
    {url: normSocial(o.tiktok),    label: "TikTok",    svg: `<path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/>`},
  ].filter(s => s.url);

  // Color palette per style
  const palettes = {
    professional: {accent: "#2563eb", accentLight: "#eff6ff", primary: "#0f172a", textMuted: "#64748b", bg: "#f8fafc", card: "#ffffff", border: "#e2e8f0", heroBg: "linear-gradient(135deg,#0f172a 0%,#1e3a5f 50%,#2563eb 100%)"},
    modern:       {accent: "#059669", accentLight: "#ecfdf5", primary: "#0f172a", textMuted: "#64748b", bg: "#f0fdf4", card: "#ffffff", border: "#d1fae5", heroBg: "linear-gradient(135deg,#064e3b 0%,#065f46 50%,#059669 100%)"},
    traditional:  {accent: "#b45309", accentLight: "#fffbeb", primary: "#1c1917", textMuted: "#78716c", bg: "#fefce8", card: "#ffffff", border: "#fde68a", heroBg: "linear-gradient(135deg,#1c1917 0%,#44403c 50%,#b45309 100%)"},
  };
  const p = palettes[o.stil] || palettes.professional;

  // Build action buttons array dynamically
  const actions = [];
  if (tel) actions.push({href: telHref, icon: ICONS.phone, label: "Anrufen"});
  if (tel) actions.push({href: waHref, icon: ICONS.whatsapp, label: "WhatsApp", target: "_blank", green: true});
  if (o.email) actions.push({href: emailHref, icon: ICONS.mail, label: "E-Mail"});
  if (mapsUrl) actions.push({href: mapsUrl, icon: ICONS.map, label: "Route", target: "_blank"});
  actions.push({href: websiteUrl, icon: ICONS.globe, label: "Website", target: "_blank"});

  // Grid columns: adapt to number of actions (max 5)
  const gridCols = actions.length <= 3 ? `repeat(${actions.length},1fr)` : actions.length === 4 ? "repeat(2,1fr)" : "repeat(3,1fr)";

  const html = `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="robots" content="noindex,nofollow">
<title>${o.firmenname || subdomain} \u2013 Visitenkarte</title>
<meta name="description" content="${(o.kurzbeschreibung || o.firmenname || "").replace(/"/g, "&quot;")}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'DM Sans',system-ui,sans-serif;background:${p.bg};color:${p.primary};min-height:100dvh;display:flex;flex-direction:column;align-items:center;padding:0 0 env(safe-area-inset-bottom)}
.card{width:100%;max-width:440px;margin:0 auto;display:flex;flex-direction:column;min-height:100dvh;padding-bottom:100px}
.hero{background:${p.heroBg};color:#fff;padding:48px 28px 36px;text-align:center;position:relative;overflow:hidden}
.hero::before{content:'';position:absolute;inset:0;background:radial-gradient(circle at 30% 20%,rgba(255,255,255,.08) 0%,transparent 60%)}
.logo{width:76px;height:76px;border-radius:22px;object-fit:contain;background:#fff;padding:8px;box-shadow:0 8px 32px rgba(0,0,0,.2);margin:0 auto 20px;display:block;position:relative}
.no-logo{width:76px;height:76px;border-radius:22px;background:linear-gradient(135deg,rgba(255,255,255,.2),rgba(255,255,255,.05));backdrop-filter:blur(8px);margin:0 auto 20px;display:flex;align-items:center;justify-content:center;font-size:1.8rem;font-weight:800;color:#fff;letter-spacing:-.02em;box-shadow:0 8px 32px rgba(0,0,0,.15);border:1px solid rgba(255,255,255,.15);position:relative}
h1{font-size:1.5rem;font-weight:800;margin-bottom:6px;letter-spacing:-.02em;position:relative}
.desc{font-size:.88rem;opacity:.8;line-height:1.5;max-width:320px;margin:0 auto;position:relative}
.body{padding:24px 20px;flex:1;display:flex;flex-direction:column;gap:12px}
.actions{display:grid;grid-template-columns:${gridCols};gap:8px;margin-bottom:4px}
.act{display:flex;flex-direction:column;align-items:center;gap:6px;padding:16px 8px;background:${p.card};border:1.5px solid ${p.border};border-radius:14px;text-decoration:none;color:${p.primary};transition:all .2s;cursor:pointer}
.act:hover{border-color:${p.accent};box-shadow:0 4px 16px ${p.accent}18}
.act-icon{width:42px;height:42px;border-radius:12px;background:${p.accentLight};color:${p.accent};display:flex;align-items:center;justify-content:center}
.act-icon.wa{background:#dcfce7;color:#16a34a}
.act:hover .act-icon.wa{background:#16a34a;color:#fff}
.act:hover .act-icon{background:${p.accent};color:#fff}
.act-label{font-size:.72rem;font-weight:600;text-align:center}
.section{background:${p.card};border:1.5px solid ${p.border};border-radius:14px;padding:18px 20px}
.section-title{font-size:.65rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:${p.textMuted};margin-bottom:12px}
.info-row{display:flex;align-items:flex-start;gap:12px;padding:9px 0;border-bottom:1px solid ${p.border}33}
.info-row:last-child{border-bottom:none}
.info-icon{width:30px;height:30px;border-radius:9px;background:${p.accentLight};color:${p.accent};display:flex;align-items:center;justify-content:center;flex-shrink:0}
.info-text{flex:1}
.info-label{font-size:.68rem;color:${p.textMuted};font-weight:500}
.info-value{font-size:.88rem;font-weight:600;color:${p.primary};margin-top:1px}
.info-value a{color:${p.accent};text-decoration:none}
.tags{display:flex;flex-wrap:wrap;gap:6px}
.tag{padding:6px 12px;background:${p.accentLight};color:${p.accent};border-radius:100px;font-size:.75rem;font-weight:600}
.socials{display:flex;gap:10px;justify-content:center;padding:8px 0}
.soc{width:40px;height:40px;border-radius:12px;background:rgba(255,255,255,.12);color:#fff;display:flex;align-items:center;justify-content:center;text-decoration:none;transition:all .2s;border:1px solid rgba(255,255,255,.1)}
.soc:hover{background:rgba(255,255,255,.25)}
.soc svg{width:18px;height:18px;fill:currentColor}
.footer{text-align:center;padding:20px;font-size:.68rem;color:${p.textMuted}}
.footer a{color:${p.accent};text-decoration:none;font-weight:600}
/* Sticky bottom bar */
.sticky-bar{position:fixed;bottom:0;left:0;right:0;background:${p.card};border-top:1px solid ${p.border};padding:12px 16px calc(12px + env(safe-area-inset-bottom));display:flex;gap:10px;max-width:440px;margin:0 auto;z-index:10;box-shadow:0 -4px 24px rgba(0,0,0,.06)}
.save-btn{flex:1;display:flex;align-items:center;justify-content:center;gap:8px;padding:14px;background:${p.accent};color:#fff;border:none;border-radius:12px;font-size:.9rem;font-weight:700;font-family:inherit;cursor:pointer;transition:opacity .2s;text-decoration:none}
.save-btn:hover{opacity:.85}
.share-btn{width:48px;height:48px;display:flex;align-items:center;justify-content:center;background:${p.accentLight};color:${p.accent};border:1.5px solid ${p.border};border-radius:12px;cursor:pointer;transition:all .2s;flex-shrink:0}
.share-btn:hover{background:${p.accent};color:#fff;border-color:${p.accent}}
/* Animations */
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
.hero{animation:fadeUp .5s ease}
.actions{animation:fadeUp .5s ease .1s both}
.section{animation:fadeUp .5s ease .2s both}
.sticky-bar{animation:fadeUp .3s ease .4s both}
</style>
</head>
<body>
<div class="card">
  <div class="hero">
    ${o.url_logo
      ? `<img class="logo" src="${o.url_logo}" alt="Logo">`
      : `<div class="no-logo">${(o.firmenname || "?").slice(0, 2).toUpperCase()}</div>`}
    <h1>${o.firmenname || subdomain}</h1>
    ${o.kurzbeschreibung ? `<p class="desc">${o.kurzbeschreibung}</p>` : ""}
    ${socials.length ? `<div class="socials" style="margin-top:16px">${socials.map(s =>
      `<a class="soc" href="${s.url}" target="_blank" rel="noopener" aria-label="${s.label}"><svg viewBox="0 0 24 24">${s.svg}</svg></a>`
    ).join("")}</div>` : ""}
  </div>

  <div class="body">
    <!-- Quick Actions -->
    <div class="actions">
      ${actions.map(a => `<a class="act" href="${a.href}"${a.target ? ` target="${a.target}" rel="noopener"` : ""}>` +
        `<div class="act-icon${a.green ? " wa" : ""}">${a.icon}</div>` +
        `<div class="act-label">${a.label}</div></a>`
      ).join("\n      ")}
    </div>

    <!-- Contact Info -->
    <div class="section">
      <div class="section-title">Kontakt</div>
      ${tel ? `<div class="info-row"><div class="info-icon">${ICONS.phone}</div><div class="info-text"><div class="info-label">Telefon</div><div class="info-value"><a href="${telHref}">${tel}</a></div></div></div>` : ""}
      ${o.email ? `<div class="info-row"><div class="info-icon">${ICONS.mail}</div><div class="info-text"><div class="info-label">E-Mail</div><div class="info-value"><a href="${emailHref}">${o.email}</a></div></div></div>` : ""}
      ${adr ? `<div class="info-row"><div class="info-icon">${ICONS.map}</div><div class="info-text"><div class="info-label">Adresse</div><div class="info-value">${adr}</div></div></div>` : ""}
      ${oez ? `<div class="info-row"><div class="info-icon">${ICONS.clock}</div><div class="info-text"><div class="info-label">\u00D6ffnungszeiten</div><div class="info-value">${oez}</div></div></div>` : ""}
      ${o.einsatzgebiet ? `<div class="info-row"><div class="info-icon">${ICONS.area}</div><div class="info-text"><div class="info-label">Einsatzgebiet</div><div class="info-value">${o.einsatzgebiet}</div></div></div>` : ""}
    </div>

    <!-- Services -->
    ${leistungen.length ? `<div class="section">
      <div class="section-title">Leistungen</div>
      <div class="tags">${leistungen.map(l => `<span class="tag">${l}</span>`).join("")}</div>
    </div>` : ""}
  </div>

  <div class="footer">Erstellt mit <a href="https://sitereadyprototype.pages.dev">SiteReady</a></div>
</div>

<!-- Sticky Bottom Bar -->
<div class="sticky-bar">
  <a class="save-btn" href="${vcardUrl}" download>${ICONS.save} Kontakt speichern</a>
  <button class="share-btn" onclick="if(navigator.share){navigator.share({title:'${(o.firmenname || "").replace(/'/g, "\\'")}',url:location.href})}else{navigator.clipboard.writeText(location.href);this.innerHTML='&#10003;';setTimeout(()=>this.innerHTML='${ICONS.share.replace(/'/g, "\\'")}',2000)}" aria-label="Teilen">${ICONS.share}</button>
</div>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: {"Content-Type": "text/html; charset=utf-8", "Cache-Control": "public, max-age=120"},
  });
}

function notFoundHtml() {
  return `<!DOCTYPE html><html lang="de"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Nicht gefunden</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:system-ui,sans-serif;background:#f8fafc;color:#1e293b;display:flex;align-items:center;justify-content:center;min-height:100vh;padding:24px;text-align:center}h1{font-size:4rem;font-weight:900;color:#e2e8f0}p{color:#64748b;margin-top:8px}</style>
</head><body><div><h1>404</h1><p>Diese Visitenkarte existiert nicht.</p></div></body></html>`;
}
