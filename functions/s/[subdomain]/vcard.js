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

function esc(s) { return (s || "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }

// SVG Icons — consistent 20x20, stroke-width 2, Lucide style
const ICONS = {
  phone: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
  mail: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
  map: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
  globe: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>`,
  whatsapp: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>`,
  clock: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  area: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z"/><path d="M8 2v16"/><path d="M16 6v16"/></svg>`,
  save: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>`,
  share: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>`,
};

export async function onRequestGet({params, env}) {
  const subdomain = params.subdomain;
  if (!subdomain) return new Response("Not Found", {status: 404});

  const r = await fetch(
    `${env.SUPABASE_URL}/rest/v1/orders?subdomain=eq.${encodeURIComponent(subdomain)}&select=firmenname,kurzbeschreibung,email,telefon,adresse,plz,ort,bundesland,oeffnungszeiten,einsatzgebiet,facebook,instagram,linkedin,tiktok,url_logo,stil,status`,
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
  const oez = OEZ_LABELS[o.oeffnungszeiten] || o.oeffnungszeiten || "";
  const websiteUrl = `https://sitereadyprototype.pages.dev/s/${subdomain}`;
  const vcardUrl = `/s/${subdomain}/vcard-contact`;
  const firmenname = esc(o.firmenname || subdomain);

  const socials = [
    {url: normSocial(o.facebook),  label: "Facebook",  svg: `<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>`},
    {url: normSocial(o.instagram), label: "Instagram", svg: `<rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.5" cy="6.5" r="1"/>`},
    {url: normSocial(o.linkedin),  label: "LinkedIn",  svg: `<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/>`},
    {url: normSocial(o.tiktok),    label: "TikTok",    svg: `<path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/>`},
  ].filter(s => s.url);

  // Semantic color tokens — prefer custom_* from DB (set via Branchengruppe or user override), fallback to style defaults
  const stilPalettes = {
    klassisch:    {accent: "#0369a1", accentLight: "#e0f2fe", accentHover: "#075985", primary: "#094067", textSecondary: "#5f6c7b", textMuted: "#5f6c7b", bg: "#fffffe", card: "#ffffff", border: "#d8eefe", borderSubtle: "#e0f2fe", heroBg: "linear-gradient(135deg,#094067 0%,#062b44 50%,#0a1f42 100%)", focusRing: "rgba(3,105,161,.4)"},
    modern:       {accent: "#4f46e5", accentLight: "#eef2ff", accentHover: "#4338ca", primary: "#18181b", textSecondary: "#52525b", textMuted: "#71717a", bg: "#fafafa", card: "#ffffff", border: "#e4e4e7", borderSubtle: "#f4f4f5", heroBg: "linear-gradient(135deg,#18181b 0%,#1e1b4b 50%,#4f46e5 100%)", focusRing: "rgba(79,70,229,.4)"},
    elegant:      {accent: "#7a6844", accentLight: "#f5f0e8", accentHover: "#6b5b3b", primary: "#020826", textSecondary: "#716040", textMuted: "#716040", bg: "#f9f4ef", card: "#ffffff", border: "#eaddcf", borderSubtle: "#f0e6d8", heroBg: "linear-gradient(135deg,#020826 0%,#0a1628 50%,#1a1510 100%)", focusRing: "rgba(122,104,68,.4)"},
    professional: {accent: "#0369a1", accentLight: "#e0f2fe", accentHover: "#075985", primary: "#094067", textSecondary: "#5f6c7b", textMuted: "#5f6c7b", bg: "#fffffe", card: "#ffffff", border: "#d8eefe", borderSubtle: "#e0f2fe", heroBg: "linear-gradient(135deg,#094067 0%,#062b44 50%,#0a1f42 100%)", focusRing: "rgba(3,105,161,.4)"},
    traditional:  {accent: "#7a6844", accentLight: "#f5f0e8", accentHover: "#6b5b3b", primary: "#020826", textSecondary: "#716040", textMuted: "#716040", bg: "#f9f4ef", card: "#ffffff", border: "#eaddcf", borderSubtle: "#f0e6d8", heroBg: "linear-gradient(135deg,#020826 0%,#0a1628 50%,#1a1510 100%)", focusRing: "rgba(122,104,68,.4)"},
  };
  const base = stilPalettes[o.stil] || stilPalettes.klassisch;
  // Override with custom_* fields from DB if present
  const cAcc = o.custom_accent || base.accent;
  const cPri = o.custom_color || base.primary;
  const cBg  = o.custom_bg || base.bg;
  const cSep = o.custom_sep || base.border;
  const cMut = o.custom_text_muted || base.textMuted;
  const p = {
    ...base,
    accent: cAcc, primary: cPri, bg: cBg, border: cSep, borderSubtle: cSep,
    textSecondary: cMut, textMuted: cMut,
    accentLight: cAcc + "18", accentHover: cAcc,
    heroBg: `linear-gradient(135deg,${cPri} 0%,${cPri}ee 50%,${cPri}cc 100%)`,
    focusRing: cAcc + "66",
  };

  // Build action buttons dynamically
  const actions = [];
  if (tel) actions.push({href: telHref, icon: ICONS.phone, label: "Anrufen", ariaLabel: `${firmenname} anrufen`});
  if (tel) actions.push({href: waHref, icon: ICONS.whatsapp, label: "WhatsApp", target: "_blank", green: true, ariaLabel: `${firmenname} per WhatsApp kontaktieren`});
  if (o.email) actions.push({href: emailHref, icon: ICONS.mail, label: "E-Mail", ariaLabel: `E-Mail an ${firmenname}`});
  if (mapsUrl) actions.push({href: mapsUrl, icon: ICONS.map, label: "Route", target: "_blank", ariaLabel: `Route zu ${firmenname}`});
  actions.push({href: websiteUrl, icon: ICONS.globe, label: "Website", target: "_blank", ariaLabel: `Website von ${firmenname}`});

  // Responsive grid: 3 cols for 5 items, 2 cols for 4, auto for <=3
  const gridCols = actions.length <= 3 ? `repeat(${actions.length},1fr)` : actions.length === 4 ? "repeat(2,1fr)" : "repeat(3,1fr)";

  const html = `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="robots" content="noindex,nofollow">
<meta name="theme-color" content="${p.primary}">
<title>${firmenname} \u2013 Visitenkarte</title>
<meta name="description" content="${esc(o.kurzbeschreibung || o.firmenname || "")}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
/* === Reset & Base === */
*{margin:0;padding:0;box-sizing:border-box}
*:focus-visible{outline:3px solid ${p.focusRing};outline-offset:2px;border-radius:8px}
body{font-family:'DM Sans',system-ui,-apple-system,sans-serif;background:${p.bg};color:${p.primary};min-height:100dvh;display:flex;flex-direction:column;align-items:center;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}

/* === Layout === */
.card{width:100%;max-width:440px;margin:0 auto;display:flex;flex-direction:column;min-height:100dvh;padding-bottom:120px}

/* === Hero === */
.hero{background:${p.heroBg};color:#fff;padding:48px 24px 40px;text-align:center;position:relative;overflow:hidden}
.hero::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 30% 0%,rgba(255,255,255,.1) 0%,transparent 60%);pointer-events:none}
.logo{width:80px;height:80px;border-radius:20px;object-fit:contain;background:transparent;padding:0;margin:0 auto 20px;display:block;position:relative}
.no-logo{width:80px;height:80px;border-radius:20px;background:linear-gradient(135deg,rgba(255,255,255,.18),rgba(255,255,255,.06));backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);margin:0 auto 20px;display:flex;align-items:center;justify-content:center;font-size:1.8rem;font-weight:800;color:#fff;letter-spacing:-.02em;box-shadow:0 8px 32px rgba(0,0,0,.15);border:1px solid rgba(255,255,255,.12);position:relative}
h1{font-size:1.5rem;font-weight:800;margin-bottom:8px;letter-spacing:-.02em;position:relative;line-height:1.25}
.desc{font-size:.875rem;opacity:.75;line-height:1.6;max-width:300px;margin:0 auto;position:relative}

/* === Social Icons (Hero) === */
.socials{display:flex;gap:8px;justify-content:center;margin-top:20px}
.soc{width:40px;height:40px;border-radius:12px;background:rgba(255,255,255,.1);color:#fff;display:flex;align-items:center;justify-content:center;text-decoration:none;transition:background .2s,transform .15s;border:1px solid rgba(255,255,255,.1)}
.soc:hover{background:rgba(255,255,255,.22)}
.soc:active{transform:scale(.95)}
.soc svg{width:18px;height:18px;fill:currentColor}

/* === Body === */
.body{padding:20px 16px;flex:1;display:flex;flex-direction:column;gap:16px}

/* === Action Buttons === */
.actions{display:grid;grid-template-columns:${gridCols};gap:8px}
.act{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;padding:16px 8px;min-height:88px;background:${p.card};border:1.5px solid ${p.border};border-radius:16px;text-decoration:none;color:${p.primary};transition:border-color .2s,box-shadow .2s,transform .15s;cursor:pointer}
.act:hover{border-color:${p.accent};box-shadow:0 4px 16px ${p.accent}15}
.act:active{transform:scale(.97)}
.act-icon{width:44px;height:44px;border-radius:12px;background:${p.accentLight};color:${p.accent};display:flex;align-items:center;justify-content:center;transition:background .2s,color .2s}
.act-icon.wa{background:#dcfce7;color:#16a34a}
.act:hover .act-icon{background:${p.accent};color:#fff}
.act:hover .act-icon.wa{background:#16a34a;color:#fff}
.act-label{font-size:.8125rem;font-weight:600;text-align:center;color:${p.textSecondary}}

/* === Sections === */
.section{background:${p.card};border:1.5px solid ${p.border};border-radius:16px;padding:20px}
.section-title{font-size:.6875rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:${p.textMuted};margin-bottom:16px}

/* === Info Rows === */
.info-row{display:flex;align-items:flex-start;gap:12px;padding:10px 0;border-bottom:1px solid ${p.borderSubtle}}
.info-row:last-child{border-bottom:none;padding-bottom:0}
.info-row:first-of-type{padding-top:0}
.info-icon{width:32px;height:32px;border-radius:10px;background:${p.accentLight};color:${p.accent};display:flex;align-items:center;justify-content:center;flex-shrink:0}
.info-text{flex:1;min-width:0}
.info-label{font-size:.75rem;color:${p.textMuted};font-weight:500;line-height:1.4}
.info-value{font-size:.9375rem;font-weight:600;color:${p.primary};margin-top:2px;line-height:1.4;word-break:break-word}
.info-value a{color:${p.accent};text-decoration:none}
.info-value a:hover{text-decoration:underline}

/* === Service Tags === */
.tags{display:flex;flex-wrap:wrap;gap:8px}
.tag{padding:6px 14px;background:${p.accentLight};color:${p.accent};border-radius:100px;font-size:.8125rem;font-weight:600;line-height:1.4}

/* === Footer === */
.footer{text-align:center;padding:24px 16px;font-size:.75rem;color:${p.textMuted}}
.footer a{color:${p.accent};text-decoration:none;font-weight:600}

/* === Sticky Bottom Bar === */
.sticky-bar{position:fixed;bottom:0;left:0;right:0;background:${p.card};border-top:1px solid ${p.border};padding:12px 16px calc(12px + env(safe-area-inset-bottom));display:flex;gap:10px;max-width:440px;margin:0 auto;z-index:10;box-shadow:0 -4px 24px rgba(0,0,0,.06)}
.save-btn{flex:1;display:flex;align-items:center;justify-content:center;gap:8px;padding:14px 16px;background:${p.accent};color:#fff;border:none;border-radius:14px;font-size:.9375rem;font-weight:700;font-family:inherit;cursor:pointer;transition:background .2s,transform .15s;text-decoration:none;min-height:48px}
.save-btn:hover{background:${p.accentHover}}
.save-btn:active{transform:scale(.98)}
.share-btn{width:48px;min-height:48px;display:flex;align-items:center;justify-content:center;background:${p.accentLight};color:${p.accent};border:1.5px solid ${p.border};border-radius:14px;cursor:pointer;transition:background .2s,color .2s,border-color .2s,transform .15s;flex-shrink:0}
.share-btn:hover{background:${p.accent};color:#fff;border-color:${p.accent}}
.share-btn:active{transform:scale(.95)}

/* === Animations === */
@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
.hero{animation:fadeUp .4s ease-out}
.actions{animation:fadeUp .4s ease-out .08s both}
.section{animation:fadeUp .4s ease-out .16s both}
.sticky-bar{animation:fadeUp .3s ease-out .32s both}
@media(prefers-reduced-motion:reduce){
  *{animation-duration:0.01ms!important;animation-iteration-count:1!important;transition-duration:0.01ms!important}
}
</style>
</head>
<body>
<div class="card">
  <header class="hero" role="banner">
    ${o.url_logo
      ? `<img class="logo" src="${o.url_logo}" alt="Logo von ${firmenname}" width="80" height="80">`
      : `<div class="no-logo" role="img" aria-label="Logo ${firmenname}">${(o.firmenname || "?").slice(0, 2).toUpperCase()}</div>`}
    <h1>${firmenname}</h1>
    ${o.kurzbeschreibung ? `<p class="desc">${esc(o.kurzbeschreibung)}</p>` : ""}
    ${socials.length ? `<nav class="socials" aria-label="Social Media">${socials.map(s =>
      `<a class="soc" href="${s.url}" target="_blank" rel="noopener noreferrer" aria-label="${s.label}"><svg viewBox="0 0 24 24">${s.svg}</svg></a>`
    ).join("")}</nav>` : ""}
  </header>

  <main class="body">
    <nav class="actions" aria-label="Kontakt-Aktionen">
      ${actions.map(a => `<a class="act" href="${a.href}"${a.target ? ` target="${a.target}" rel="noopener noreferrer"` : ""} aria-label="${a.ariaLabel}">` +
        `<div class="act-icon${a.green ? " wa" : ""}">${a.icon}</div>` +
        `<div class="act-label">${a.label}</div></a>`
      ).join("\n      ")}
    </nav>

    <section class="section" aria-label="Kontaktinformationen">
      <div class="section-title">Kontakt</div>
      ${tel ? `<div class="info-row"><div class="info-icon" aria-hidden="true">${ICONS.phone}</div><div class="info-text"><div class="info-label">Telefon</div><div class="info-value"><a href="${telHref}">${esc(tel)}</a></div></div></div>` : ""}
      ${o.email ? `<div class="info-row"><div class="info-icon" aria-hidden="true">${ICONS.mail}</div><div class="info-text"><div class="info-label">E-Mail</div><div class="info-value"><a href="${emailHref}">${esc(o.email)}</a></div></div></div>` : ""}
      ${adr ? `<div class="info-row"><div class="info-icon" aria-hidden="true">${ICONS.map}</div><div class="info-text"><div class="info-label">Adresse</div><div class="info-value">${esc(adr)}</div></div></div>` : ""}
      ${oez ? `<div class="info-row"><div class="info-icon" aria-hidden="true">${ICONS.clock}</div><div class="info-text"><div class="info-label">\u00D6ffnungszeiten</div><div class="info-value">${esc(oez)}</div></div></div>` : ""}
      ${o.einsatzgebiet ? `<div class="info-row"><div class="info-icon" aria-hidden="true">${ICONS.area}</div><div class="info-text"><div class="info-label">Einsatzgebiet</div><div class="info-value">${esc(o.einsatzgebiet)}</div></div></div>` : ""}
    </section>

  </main>

  <footer class="footer">Erstellt mit <a href="https://sitereadyprototype.pages.dev">SiteReady</a></footer>
</div>

<div class="sticky-bar" role="toolbar" aria-label="Aktionen">
  <a class="save-btn" href="${vcardUrl}" download aria-label="Kontakt im Adressbuch speichern">${ICONS.save} Kontakt speichern</a>
  <button class="share-btn" id="share-btn" type="button" aria-label="Visitenkarte teilen">${ICONS.share}</button>
</div>
<script>
document.getElementById('share-btn').addEventListener('click',function(){
  var t='${(o.firmenname || "").replace(/'/g, "\\'")}';
  if(navigator.share){navigator.share({title:t,url:location.href})}
  else{navigator.clipboard.writeText(location.href);this.textContent='\u2713';var b=this;setTimeout(function(){b.textContent='Teilen'},2000)}
});
</script>
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
