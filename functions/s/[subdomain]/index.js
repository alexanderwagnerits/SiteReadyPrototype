const { esc, normSocial, OEZ_LABELS } = require("../../_lib/shared");

function buildSocialIcons(o) {
  const socials = [
    {url: normSocial(o.facebook),  label:"Facebook",  icon:`<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>`},
    {url: normSocial(o.instagram), label:"Instagram", icon:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>`},
    {url: normSocial(o.linkedin),  label:"LinkedIn",  icon:`<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>`},
    {url: normSocial(o.tiktok),    label:"TikTok",    icon:`<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/></svg>`},
  ].filter(s => s.url);
  if (!socials.length) return "";
  return `<div style="display:flex;gap:12px;margin-top:16px">${socials.map(s=>`<a href="${s.url}" target="_blank" rel="noopener noreferrer" aria-label="${s.label}" class="sr-social-icon" style="display:flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:50%;background:rgba(255,255,255,.12);color:#fff;text-decoration:none;transition:background .2s">${s.icon}</a>`).join("")}</div>`;
}

export async function onRequestGet({params, env}) {
  const subdomain = params.subdomain;
  if (!subdomain) return new Response("Not Found", {status: 404});

  const r = await fetch(
    `${env.SUPABASE_URL}/rest/v1/orders?subdomain=eq.${encodeURIComponent(subdomain)}&select=*`,
    {headers: {"apikey": env.SUPABASE_SERVICE_KEY, "Authorization": `Bearer ${env.SUPABASE_SERVICE_KEY}`}}
  );
  if (!r.ok) {
    // DB-Fehler loggen
    try {
      const { createLogger } = await import("../../_lib/log.js");
      const log = createLogger(env);
      await log.error("serve", {message: `DB-Fehler ${r.status} fuer /${subdomain}`, url: `/s/${subdomain}`});
    } catch(e) { console.error("serve: Logger-Init fehlgeschlagen", e.message); }
    return new Response("Fehler beim Laden", {status: 502});
  }

  const rows = await r.json();
  if (!rows.length) {
    return new Response(notFoundPage(subdomain), {status: 404, headers: {"Content-Type": "text/html; charset=utf-8"}});
  }
  if (rows[0].status === "offline") {
    return new Response(offlinePage(rows[0].firmenname || subdomain), {status: 503, headers: {"Content-Type": "text/html; charset=utf-8", "Retry-After": "3600"}});
  }
  if (!rows[0].website_html) {
    return new Response(notFoundPage(subdomain), {status: 404, headers: {"Content-Type": "text/html; charset=utf-8"}});
  }

  let html = rows[0].website_html;
  const o = rows[0];

  // ── Stil lesen ──
  const stilName = o.stil || "klassisch";
  const isModern = stilName === "modern";
  const isElegant = stilName === "elegant";

  // ── Section-Varianten: varianten_cache (neu) oder Legacy-Felder (alt) ──
  const vc = (typeof o.varianten_cache === "object" && o.varianten_cache) || {};
  const tmCount = (Array.isArray(o.team_members) ? o.team_members.filter(t => t && t.name) : []).length;
  const v = {
    hero: vc.hero || (
      (o.hero_variante === "minimal") ? "minimal" :
      (o.hero_variante === "split" || (o.hero_layout || "split") === "split") ? "split" :
      "fullscreen"
    ),
    leistungen: vc.leistungen || "grid",
    ablauf: vc.ablauf || "horizontal",
    bewertungen: vc.bewertungen || (
      o.bewertungen_variante === "highlight" ? "blockquote" :
      o.bewertungen_variante === "liste" ? "cards" :
      "cards"
    ),
    team: vc.team || (
      tmCount === 1 ? "single" : tmCount <= 3 ? "grid-3" : "grid-4"
    ),
    faq: vc.faq || "einspaltig",
    galerie: vc.galerie || "grid-2x2",
    kontakt: vc.kontakt || (
      (o.kontakt_variante === "kompakt") ? "ohne-map" :
      (o.adresse || o.plz) ? "mit-map" : "ohne-map"
    ),
  };
  const sv = o.sections_visible || {};

  // Trust-Leiste serve-time (live updates bei Feature-Aenderungen)
  if (html.includes("<!-- TRUST -->")) {
    const tIcon = (svg) => `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${svg}</svg>`;
    const trustItems = [];
    if (o.notdienst) trustItems.push({l:"24/7 Notdienst",i:tIcon(`<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>`)});
    if (o.meisterbetrieb) trustItems.push({l:"Meisterbetrieb",i:tIcon(`<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>`)});
    if (o.kostenvoranschlag) trustItems.push({l:"Kostenloser KV",i:tIcon(`<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><polyline points="9 15 11 17 15 13"/>`)});
    if (o.foerderungsberatung) trustItems.push({l:"Förderungsberatung",i:tIcon(`<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>`)});
    if (o.erstgespraech_gratis) trustItems.push({l:"Erstgespräch gratis",i:tIcon(`<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>`)});
    if (o.ratenzahlung) trustItems.push({l:"Ratenzahlung",i:tIcon(`<rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>`)});
    if (o.zertifiziert) trustItems.push({l:"Zertifiziert",i:tIcon(`<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>`)});
    if (o.gutscheine) trustItems.push({l:"Gutscheine",i:tIcon(`<path d="M20 12v10H4V12"/><path d="M2 7h20v5H2z"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>`)});
    const kassenLabel = o.kassenvertrag === "alle_kassen" ? "Alle Kassen" : o.kassenvertrag === "wahlarzt" ? "Wahlarzt" : o.kassenvertrag === "privat" ? "Privat" : o.kassenvertrag === "oegk" ? "ÖGK" : o.kassenvertrag === "bvaeb" ? "BVAEB" : o.kassenvertrag === "svs" ? "SVS" : null;
    if (kassenLabel) trustItems.push({l:kassenLabel,i:tIcon(`<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>`)});
    if (o.barrierefrei) trustItems.push({l:"Barrierefrei",i:tIcon(`<circle cx="12" cy="4" r="2"/><path d="M12 6v6l4 4"/><path d="M8 12l-2 6h12"/>`)});
    if (o.terminvereinbarung) trustItems.push({l:"Online-Termin",i:tIcon(`<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>`)});
    if (o.kartenzahlung) trustItems.push({l:"Kartenzahlung",i:tIcon(`<rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>`)});
    if (o.parkplaetze) trustItems.push({l:"Parkplätze",i:tIcon(`<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/>`)});
    if (o.gastgarten) trustItems.push({l:"Gastgarten",i:tIcon(`<circle cx="12" cy="12" r="10"/><path d="M8 12l2 2 4-4"/>`)});
    if (o.takeaway) trustItems.push({l:"Take-away",i:tIcon(`<path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z"/>`)});
    if (o.lieferservice) trustItems.push({l:"Lieferservice",i:tIcon(`<rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>`)});
    if (o.online_beratung) trustItems.push({l:"Online-Beratung",i:tIcon(`<path d="M15 10l5 5-5 5"/><path d="M4 4v7a4 4 0 0 0 4 4h12"/>`)});
    if (o.hausbesuche) trustItems.push({l:"Hausbesuche",i:tIcon(`<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>`)});
    if (trustItems.length > 0) {
      const items = trustItems.map(t => `<div class="trust-item">${t.i}<span>${t.l}</span></div>`).join("");
      // Trust-Items direkt nach den Hero-Buttons einfuegen (innerhalb hero-inner)
      const trustInHero = `<div class="hero-trust">${items}</div>`;
      const trustStyle = `<style>.hero-trust{display:flex;flex-wrap:wrap;gap:8px;margin-top:32px;padding-top:24px;border-top:1px solid rgba(255,255,255,.12)}.hero-trust .trust-item{display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.12);padding:6px 14px;border-radius:100px;color:rgba(255,255,255,.85);font-size:.78rem;font-weight:600;backdrop-filter:blur(4px)}.hero-trust .trust-item svg{color:rgba(255,255,255,.6);width:14px;height:14px;flex-shrink:0}.hero.text-center .hero-trust{justify-content:center}@media(max-width:768px){.hero-trust{gap:6px;margin-top:24px;padding-top:18px}.hero-trust .trust-item{font-size:.72rem;padding:5px 11px}}</style>`;
      html = html.replace(/(<div class="hero-btns">[\s\S]*?<\/div>)/, '$1\n' + trustInHero);
      html = html.replace("<!-- TRUST -->", "");
      html = html.replace('</head>', trustStyle + '</head>');
    } else {
      html = html.replace("<!-- TRUST -->", "");
    }
  }

  // Logo in Nav injizieren (ersetzt Firmenname-Text durch <img>)
  if (o.url_logo) {
    html = html.replace(
      /(<a[^>]*id="site-nav-logo"[^>]*>)[\s\S]*?(<\/a>)/,
      `$1<img src="${esc(o.url_logo)}" alt="Logo" style="height:64px;width:auto;object-fit:contain;display:block;max-width:240px">$2`
    );
  }

  // Aktuelles-Banner injizieren (aktive Announcements mit Start/Enddatum)
  const announcements = (o.announcements || []).filter(a => a.active && a.text?.trim());
  if (announcements.length > 0) {
    const today = new Date().toISOString().split("T")[0];
    const validAnn = announcements.filter(a => {
      const start = a.date_start || "";
      const end = a.date_end || a.date || "";
      if (start && start > today) return false; // noch nicht gestartet
      if (end && end < today) return false; // abgelaufen (Enddatum ist inklusive)
      return true;
    });
    if (validAnn.length > 0) {
      const annText = validAnn.map(a => esc(a.text)).join(" · ");
      const annHtml = `<div id="sr-announcements" style="display:inline-flex;align-items:center;background:var(--accent,#2563eb);color:#fff;padding:9px 20px;border-radius:100px;font-size:.8rem;font-weight:600;line-height:1.4;margin-bottom:20px;box-shadow:0 2px 12px rgba(0,0,0,.2)">` +
        `<span style="opacity:.9">${annText}</span>` +
        `</div>`;
      // Im Hero vor dem h1 einfuegen
      if (html.includes('<div class="hero-inner">')) {
        html = html.replace('<div class="hero-inner">', `<div class="hero-inner">\n${annHtml}`);
      }
    }
  }

  // Hero-Bild + Variante: fullscreen (Hintergrundbild), split (Bild rechts), minimal (kein Bild)
  html = html.replace(/<section(?![^>]*id=)/i, '<section id="sr-hero"');

  // Stil-spezifische Werte fuer Hero-Varianten
  const heroImgR = isModern ? "16px" : isElegant ? "2px" : "var(--rLg,8px)";
  const heroMinH1Weight = isElegant ? "500" : "800";

  if (v.hero === "minimal") {
    // Minimal: Kein Bild, zentriert, reduziert
    const minimalStyle = `<style>
.hero{min-height:70vh!important;min-height:70svh!important;justify-content:center;text-align:center}
.hero-inner{display:flex!important;flex-direction:column;align-items:center}
.hero h1{font-size:clamp(2.5rem,6vw,4rem)!important;max-width:100%;font-weight:${heroMinH1Weight}!important}
.hero-desc{text-align:center;max-width:480px}
.hero-btns{justify-content:center}
.hero-trust{justify-content:center}
.hero-sub{margin-bottom:16px}
.hero-accent-line{display:block!important;width:48px;height:${isElegant ? "1px" : "2px"};background:var(--accent);margin:16px auto 24px;opacity:.6}
</style>`;
    html = html.replace("</head>", minimalStyle + "</head>");
  } else if (v.hero === "split") {
    // Split: Bild rechts neben dem Text
    if (o.url_hero) {
      const heroStyle = `<style>` +
        `.hero{align-items:center!important}` +
        `.hero-split-img{margin-top:24px;border-radius:${heroImgR};overflow:hidden}` +
        `.hero-split-img img{width:100%;display:block;border-radius:${heroImgR};aspect-ratio:16/9;object-fit:cover}` +
        `@media(min-width:900px){` +
        `.hero-inner{display:grid!important;grid-template-columns:1.1fr 1fr;gap:48px;align-items:center;padding-top:100px!important;padding-bottom:64px!important}` +
        `.hero-split-text{grid-column:1}` +
        `.hero-split-img{grid-column:2;margin-top:0;border-radius:${heroImgR};overflow:hidden;box-shadow:0 16px 48px rgba(0,0,0,.25)}` +
        `.hero-split-img img{width:100%;aspect-ratio:16/10;object-fit:cover;border-radius:${heroImgR}}` +
        `.hero h1{font-size:clamp(2.2rem,4vw,3.2rem)!important}` +
        `}` +
        `@media(min-width:1200px){` +
        `.hero-split-img img{aspect-ratio:3/2}` +
        `}</style>`;
      // Alle Text-Kinder von hero-inner in einen Wrapper wrappen
      html = html.replace(
        /(<div class="hero-inner">)([\s\S]*?)(<\/div>\s*<\/section>)/,
        `$1<div class="hero-split-text">$2</div><div class="hero-split-img"><img src="${esc(o.url_hero)}" alt="${esc(o.firmenname || "")}" style="width:100%;display:block" fetchpriority="high"/></div>$3`
      );
      html = html.replace('</head>', heroStyle + '</head>');
    }
  } else if (o.url_hero) {
    // Standard + full: Hintergrundbild
    const heroStyle = `<style>#sr-hero,#hero,section.hero{background:linear-gradient(to bottom,rgba(0,0,0,.3) 0%,rgba(0,0,0,.2) 40%,rgba(0,0,0,.5) 100%),url('${o.url_hero}') center/cover no-repeat!important}` +
      `#sr-hero h1,#hero h1{text-shadow:0 2px 16px rgba(0,0,0,.5)}` +
      `#sr-hero .hero-sub,#sr-hero .hero-desc,#sr-hero .hero-badge{text-shadow:0 1px 8px rgba(0,0,0,.4)}` +
      `#sr-hero .hero-btns .btn{text-shadow:none}` +
      `#sr-hero .hero-trust .trust-item{text-shadow:0 1px 6px rgba(0,0,0,.3)}</style>`;
    html = html.replace('</head>', heroStyle + '</head>');
  }

  // Maps-Placeholder serve-time ersetzen (falls Claude einen Platzhalter generiert hat)
  const mapsAddr = [o.adresse, o.plz, o.ort].filter(Boolean).join(", ");
  if (mapsAddr) {
    const mapsQuery = encodeURIComponent(mapsAddr + ", Österreich");
    const mapsIframe = `<div style="margin-top:24px;border-radius:12px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,.10)"><iframe src="https://maps.google.com/maps?q=${mapsQuery}&output=embed&hl=de&z=15" width="100%" height="280" style="border:0;display:block" allowfullscreen loading="lazy" title="Standort"></iframe></div>`;
    html = html.replace(/<!-- MAPS -->/g, mapsIframe);
    html = html.replace(/<div[^>]*class="maps-placeholder"[^>]*>[\s\S]*?<\/div>/gi, mapsIframe);
    html = html.replace(/🗺️[^<]*Kartenansicht[^<]*/gi, "");
  } else {
    html = html.replace(/<!-- MAPS -->/g, "");
    html = html.replace(/<div[^>]*class="maps-placeholder"[^>]*>[\s\S]*?<\/div>/gi, "");
  }

  // Leistungen-Fotos Galerie entfernt — Fotos sind jetzt in den Cards
  html = html.replace("<!-- LEIST_FOTOS -->", "");

  // Team-Members + Berufsregister-Nr. — rechte Spalte in Über-uns
  const teamMembers = Array.isArray(o.team_members) ? o.team_members.filter(m => m && m.name) : [];
  const berufsregNr = o.berufsregister_nr ? `<div style="margin-top:20px;padding-top:16px;border-top:1px solid rgba(255,255,255,.08);font-size:.75rem;opacity:.4"><span style="text-transform:uppercase;letter-spacing:.1em;font-weight:600">Berufsregister-Nr.</span><br><span style="font-weight:500;opacity:1">${o.berufsregister_nr}</span></div>` : "";
  if (teamMembers.length > 0 && html.includes("<!-- TEAM -->")) {
    const avatarColors = ["#2563eb","#6366f1","#0891b2","#059669","#d97706","#dc2626","#7c3aed","#db2777"];
    const avatarR = isModern ? "50%" : isElegant ? "4px" : "50%";
    const nameWeight = isElegant ? "600" : "700";
    const nameSize = isElegant ? "1rem" : "1.05rem";
    const cards = teamMembers.map((m, idx) => {
      const hasImg = !!m.foto;
      const initials = esc(m.name.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase());
      const color = avatarColors[idx % avatarColors.length];
      const avatar = hasImg
        ? `<img src="${m.foto}" alt="${esc(m.name)}" style="width:72px;height:72px;border-radius:${avatarR};object-fit:cover;flex-shrink:0;border:3px solid rgba(255,255,255,.15)">`
        : `<div style="width:72px;height:72px;border-radius:${avatarR};background:${color};display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:1.2rem;font-weight:800;color:#fff;letter-spacing:.02em">${initials}</div>`;
      return `<div style="display:flex;align-items:center;gap:18px;padding:14px 0">${avatar}<div><div style="font-weight:${nameWeight};font-size:${nameSize};color:#fff">${esc(m.name)}</div>${m.rolle ? `<div style="font-size:.85rem;opacity:.55;margin-top:3px">${esc(m.rolle)}</div>` : ""}</div></div>`;
    }).join("");
    html = html.replace("<!-- TEAM -->", `<div style="margin-top:28px;padding-top:20px;border-top:1px solid rgba(255,255,255,.1)"><div style="font-size:.65rem;font-weight:700;text-transform:uppercase;letter-spacing:.12em;opacity:.4;margin-bottom:12px">Unser Team</div>${cards}${berufsregNr}</div>`);
  } else if (berufsregNr) {
    html = html.replace("<!-- TEAM -->", `<div style="margin-top:28px;padding-top:20px;border-top:1px solid rgba(255,255,255,.1)">${berufsregNr}</div>`);
  } else {
    // Kein Team — About-Fotos in die rechte Spalte verschieben
    const aboutFotosForTeamSlot = [o.url_about1, o.url_about2, o.url_about3, o.url_about4, o.url_about5, o.url_about6, o.url_about7, o.url_about8].filter(Boolean);
    if (aboutFotosForTeamSlot.length > 0) {
      const items = aboutFotosForTeamSlot.map(url =>
        `<div style="overflow:hidden;border-radius:var(--r,4px);line-height:0;cursor:zoom-in">` +
        `<img class="sr-zoom sr-img-hover" src="${url}" alt="" loading="lazy" style="width:100%;height:100%;object-fit:cover;display:block;aspect-ratio:1/1;transition:transform .3s">` +
        `</div>`
      ).join("");
      const n = aboutFotosForTeamSlot.length;
      const cols = n === 1 ? "1fr" : n === 2 ? "1fr" : "1fr 1fr";
      const grid = `<div style="display:grid;grid-template-columns:${cols};gap:12px">${items}</div>`;
      html = html.replace("<!-- TEAM -->", grid);
      html = html.replace("<!-- ABOUT_FOTOS -->", "");
    } else {
      html = html.replace("<!-- TEAM -->", "");
    }
  }

  // Über-uns-Fotos (max 8) — unter dem Text, nur wenn nicht schon rechts angezeigt
  const aboutFotos = [o.url_about1, o.url_about2, o.url_about3, o.url_about4, o.url_about5, o.url_about6, o.url_about7, o.url_about8].filter(Boolean);
  if (aboutFotos.length > 0 && html.includes("<!-- ABOUT_FOTOS -->")) {
    const items = aboutFotos.map(url =>
      `<div style="overflow:hidden;border-radius:var(--r,4px);line-height:0;cursor:zoom-in">` +
      `<img class="sr-zoom sr-img-hover" src="${url}" alt="" loading="lazy" style="width:100%;height:100%;object-fit:cover;display:block;aspect-ratio:1/1;transition:transform .3s">` +
      `</div>`
    ).join("");
    const cols = aboutFotos.length <= 2 ? "1fr 1fr" : aboutFotos.length <= 4 ? `repeat(${Math.min(aboutFotos.length, 4)},1fr)` : "repeat(4,1fr)";
    const grid = `<div class="sr-foto-grid" style="display:grid;grid-template-columns:${cols};gap:12px;margin-top:32px">${items}</div>`;
    html = html.replace("<!-- ABOUT_FOTOS -->", grid);
  } else {
    html = html.replace("<!-- ABOUT_FOTOS -->", "");
  }

  // Ueber-uns: immer Standard-Layout (Story/Team-Fokus Varianten entfernt)

  // Layout-Feld entfernt — Sections per sections_visible + Auto-Varianten gesteuert

  // Stil-spezifische Label-Variante
  const sectionLabel = (text) => {
    if (isElegant) return `<div style="font-size:.65rem;font-weight:500;letter-spacing:.16em;text-transform:uppercase;color:var(--accent);margin-bottom:14px">${text}</div>`;
    if (isModern) return `<div style="display:inline-flex;align-items:center;font-size:.7rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--accent);margin-bottom:14px;background:color-mix(in srgb,var(--accent) 8%,transparent);padding:6px 14px;border-radius:100px">${text}</div>`;
    return `<div style="display:inline-flex;align-items:center;font-size:.68rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--accent);margin-bottom:14px;background:color-mix(in srgb,var(--accent) 10%,transparent);padding:5px 14px;border-radius:100px;border:1px solid color-mix(in srgb,var(--accent) 20%,transparent)">${text}</div>`;
  };
  const sectionH2 = (text) => {
    if (isElegant) return `<h2 style="font-size:clamp(1.3rem,3vw,1.8rem);font-weight:500;color:var(--primary);letter-spacing:-.02em">${text}</h2>`;
    return `<h2 style="font-size:clamp(1.4rem,3vw,2rem);font-weight:800;color:var(--primary);letter-spacing:-.03em">${text}</h2>`;
  };

  // Ablauf-Section — "So laeuft es ab" zwischen Leistungen und Ueber uns
  const ablaufSteps = Array.isArray(o.ablauf_schritte) ? o.ablauf_schritte.filter(s => s && s.titel) : [];
  const showAblauf = sv.ablauf !== false && ablaufSteps.length >= 2;
  if (showAblauf && html.includes("<!-- ABLAUF -->")) {
    let ablaufContent;
    // Stil-spezifische Varianten
    const circleR = isModern ? "50%" : isElegant ? "2px" : "50%";
    const circleSize = isElegant ? "28px" : "40px";
    const circleFontSize = isElegant ? ".72rem" : ".92rem";
    const circleFontWeight = isElegant ? "500" : "800";
    const titleWeight = isElegant ? "600" : "700";

    if (v.ablauf === "vertikal") {
      // Vertical Timeline
      const vSteps = ablaufSteps.slice(0, 5).map((s, i) =>
        `<div style="margin-bottom:28px;position:relative;padding-left:48px">` +
        `<div style="position:absolute;left:0;top:0;width:32px;height:32px;border-radius:${circleR};background:var(--accent);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:${circleFontWeight};font-size:.82rem;z-index:1">${i + 1}</div>` +
        `<div style="font-weight:${titleWeight};font-size:.95rem;color:var(--primary);margin-bottom:4px">${esc(s.titel)}</div>` +
        (s.text ? `<div style="font-size:.85rem;color:var(--textMuted,#64748b);line-height:1.7">${esc(s.text)}</div>` : "") +
        `</div>`
      ).join("");
      ablaufContent = `<div style="position:relative;max-width:560px"><div style="position:absolute;left:15px;top:0;bottom:0;width:${isElegant ? "1px" : "2px"};background:var(--sep,#e2e8f0)"></div>${vSteps}</div>`;
    } else {
      // Standard: Horizontal
      const hSteps = ablaufSteps.slice(0, 5).map((s, i) =>
        `<div style="flex:1;text-align:center;min-width:140px">` +
        `<div style="width:${circleSize};height:${circleSize};border-radius:${circleR};background:var(--accent);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:${circleFontWeight};font-size:${circleFontSize};margin:0 auto 12px">${i + 1}</div>` +
        `<div style="font-weight:${titleWeight};font-size:.95rem;color:var(--primary);margin-bottom:6px">${esc(s.titel)}</div>` +
        (s.text ? `<div style="font-size:.82rem;color:var(--textMuted,#64748b);line-height:1.6">${esc(s.text)}</div>` : "") +
        `</div>`
      ).join(`<div class="sr-ablauf-arrow" style="flex-shrink:0;display:flex;align-items:flex-start;padding-top:18px;color:var(--sep,#e2e8f0)"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${isElegant ? "1.5" : "2"}"><polyline points="9 18 15 12 9 6"/></svg></div>`);
      ablaufContent = `<div class="sr-ablauf-h" style="display:flex;align-items:flex-start;justify-content:center;gap:16px;flex-wrap:wrap">${hSteps}</div>`;
    }

    const section = `<section class="sr-fade" style="padding:80px 0;background:var(--bg,#f8fafc)"><div class="w"><div style="text-align:center;margin-bottom:40px">${sectionLabel("So läuft es ab")}${sectionH2("Ihr Weg zu uns")}</div>${ablaufContent}</div></section>`;
    html = html.replace("<!-- ABLAUF -->", section);
  } else {
    html = html.replace("<!-- ABLAUF -->", "");
  }

  // Kundenbewertungen — zwischen Ueber uns und Kontakt (3 Varianten)
  const bewertungen = Array.isArray(o.bewertungen) ? o.bewertungen.filter(b => b && b.text) : [];
  if (bewertungen.length > 0 && html.includes("<!-- BEWERTUNGEN -->")) {
    const starSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="var(--accent)" stroke="var(--accent)" stroke-width="1"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;
    const emptyStar = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--sep)" stroke-width="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;
    const makeStars = (b) => b.sterne ? Array.from({length:5}, (_,i) => i < b.sterne ? starSvg : emptyStar).join("") : "";
    const bewLabel = sectionLabel("Kundenstimmen");
    const bewH2 = sectionH2("Was unsere Kunden sagen");
    let bewContent;

    // Stil-spezifische Card-Variablen fuer Bewertungen
    const bewCardR = isModern ? "16px" : isElegant ? "2px" : "var(--rLg,8px)";
    const bewCardBorder = isModern ? "border:none;box-shadow:0 4px 20px rgba(0,0,0,.06)" : "border:1px solid var(--sep)";
    const bewNameWeight = isElegant ? "600" : "700";

    if (v.bewertungen === "blockquote") {
      // Blockquote: Erste Bewertung gross, Rest als kleine Karten
      const main = bewertungen[0];
      const rest = bewertungen.slice(1, 5);
      const mainStars = makeStars(main);
      const highlight = `<div style="background:var(--primary);color:#fff;border-radius:${bewCardR};padding:36px;margin-bottom:20px;text-align:center">` +
        `<div style="font-size:2rem;margin-bottom:12px;opacity:.3">„</div>` +
        `<div style="font-size:1rem;font-weight:${isElegant ? "400" : "500"};line-height:1.8;max-width:520px;margin:0 auto;opacity:.9">${esc(main.text)}</div>` +
        `<div style="margin-top:16px;font-size:.82rem;font-weight:${bewNameWeight};opacity:.7">${esc(main.name) || "Kunde"}</div>` +
        (mainStars ? `<div style="margin-top:8px;display:flex;justify-content:center;gap:2px">${mainStars}</div>` : "") +
        `</div>`;
      const restCards = rest.map(b => {
        const stars = makeStars(b);
        return `<div style="background:#fff;${bewCardBorder};border-radius:${bewCardR};padding:20px;display:flex;flex-direction:column;gap:8px">` +
          (stars ? `<div style="display:flex;gap:2px">${stars}</div>` : "") +
          `<p style="font-size:.88rem;color:var(--text);line-height:1.7;margin:0;flex:1;font-style:italic">„${esc(b.text)}"</p>` +
          `<div style="font-size:.78rem;font-weight:${bewNameWeight};color:var(--primary)">${esc(b.name) || "Kunde"}</div></div>`;
      }).join("");
      const restCols = rest.length <= 2 ? `repeat(${rest.length},1fr)` : "repeat(3,1fr)";
      bewContent = highlight + (rest.length > 0 ? `<div class="sec-bew-grid" style="display:grid;grid-template-columns:${restCols};gap:16px">${restCards}</div>` : "");

    } else {
      // Cards (Standard): Grid nebeneinander
      const cards = bewertungen.slice(0, 6).map(b => {
        const stars = makeStars(b);
        return `<div style="background:#fff;${bewCardBorder};border-radius:${bewCardR};padding:24px;display:flex;flex-direction:column;gap:12px">` +
          (stars ? `<div style="display:flex;gap:2px">${stars}</div>` : "") +
          `<p style="font-size:.92rem;color:var(--text);line-height:1.7;margin:0;flex:1">„${esc(b.text)}"</p>` +
          `<div style="font-size:.82rem;font-weight:${bewNameWeight};color:var(--primary)">${esc(b.name) || "Kunde"}</div>` +
          `</div>`;
      }).join("");
      const cols = bewertungen.length === 1 ? "1fr" : bewertungen.length === 2 ? "1fr 1fr" : "repeat(3,1fr)";
      bewContent = `<div class="sec-bew-grid" style="display:grid;grid-template-columns:${cols};gap:20px">${cards}</div>`;
    }

    const section = `<section style="padding:80px 0;background:#fff"><div class="w"><div style="text-align:center;margin-bottom:40px">${bewLabel}${bewH2}</div>${bewContent}</div></section>`;
    html = html.replace("<!-- BEWERTUNGEN -->", section);
  } else {
    html = html.replace("<!-- BEWERTUNGEN -->", "");
  }

  // Kontakt-Infos — Features (Badges) getrennt von Hinweistexten (Gut zu wissen)
  const featureBadges = [];
  const kIcon = (svg) => `<div class="kontakt-info-icon"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${svg}</svg></div>`;
  if (o.terminvereinbarung) featureBadges.push(kIcon(`<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>`) + `<span>Nur mit Termin</span>`);
  if (o.barrierefrei) featureBadges.push(kIcon(`<circle cx="12" cy="4" r="2"/><path d="M12 6v6l4 4"/><path d="M8 12l-2 6h12"/>`) + `<span>Barrierefrei</span>`);
  if (o.hausbesuche) featureBadges.push(kIcon(`<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>`) + `<span>Hausbesuche</span>`);
  if (o.online_beratung) featureBadges.push(kIcon(`<rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>`) + `<span>Online-Beratung</span>`);
  if (o.parkplaetze) featureBadges.push(kIcon(`<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/>`) + `<span>Parkplätze</span>`);
  if (o.kartenzahlung) featureBadges.push(kIcon(`<rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>`) + `<span>Kartenzahlung</span>`);
  if (o.gastgarten) featureBadges.push(kIcon(`<circle cx="12" cy="12" r="10"/><path d="M8 12l2 2 4-4"/>`) + `<span>Gastgarten / Terrasse</span>`);
  if (o.takeaway) featureBadges.push(kIcon(`<path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z"/>`) + `<span>Take-away</span>`);
  if (o.lieferservice) featureBadges.push(kIcon(`<rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>`) + `<span>Lieferservice</span>`);
  const gzwLines = (o.gut_zu_wissen || "").split("\n").map(s => s.trim()).filter(Boolean).slice(0, 5);

  if ((featureBadges.length > 0 || gzwLines.length > 0) && html.includes("<!-- KONTAKT_INFOS -->")) {
    let infoHtml = "";
    if (featureBadges.length > 0) {
      infoHtml += `<div class="kontakt-infos" style="display:flex;flex-wrap:wrap;gap:10px">${featureBadges.map(b => `<div class="kontakt-info-item" style="display:inline-flex;align-items:center;gap:8px;padding:8px 14px;background:var(--bg);border:1px solid var(--sep);border-radius:var(--rLg,8px);font-size:.82rem;font-weight:500;white-space:nowrap">${b}</div>`).join("")}</div>`;
    }
    if (gzwLines.length > 0) {
      infoHtml += `<div style="margin-top:${featureBadges.length > 0 ? "16px" : "0"};padding-top:${featureBadges.length > 0 ? "16px;border-top:1px solid var(--sep)" : "0"}">` +
        `<div style="font-size:.68rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--textMuted);margin-bottom:10px">Gut zu wissen</div>` +
        `<div style="display:flex;flex-direction:column;gap:8px">${gzwLines.map(l => `<div style="display:flex;align-items:flex-start;gap:8px;font-size:.85rem;color:var(--text);line-height:1.55">${kIcon(`<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>`)}<span>${esc(l)}</span></div>`).join("")}</div></div>`;
    }
    html = html.replace("<!-- KONTAKT_INFOS -->", `<div style="margin-top:20px;padding-top:16px">${infoHtml}</div>`);
  } else {
    html = html.replace("<!-- KONTAKT_INFOS -->", "");
  }

  // ── Kontakt-Variante: mit-map/ohne-map (Map-Injection erfolgt ueber MAPS-Placeholder oben) ──
  // "ohne-map": Map-Placeholder wurde bereits entfernt wenn keine Adresse vorhanden
  // Keine zusaetzlichen Style-Overrides noetig — Layout kommt aus dem Template

  // Legacy: alte Platzhalter entfernen falls noch vorhanden
  html = html.replace(/<!-- FOTO_BAND -->/g, "");

  // ── Neue Sections serve-time (Layout-abhaengig) ──

  // CTA-Zwischenblock — Auflockerer zwischen Leistungen und Ablauf
  // Default: immer anzeigen, außer explizit deaktiviert (sv.cta_block === false)
  if (sv.cta_block !== false && html.includes("<!-- CTA_BLOCK -->")) {
    const ctaBtnR = isModern ? "100px" : "var(--r)";
    const ctaBtnShadow = isModern ? ";box-shadow:0 4px 16px rgba(0,0,0,.15)" : "";
    const ctaH2Weight = isElegant ? "500" : "800";
    const ctaPOpacity = isElegant ? ".5" : ".7";
    // Branchenspezifische CTA-Texte (Kunde kann im Portal überschreiben)
    const brGruppe = {
      elektro:"handwerk",installateur:"handwerk",maler:"handwerk",tischler:"handwerk",fliesenleger:"handwerk",schlosser:"handwerk",dachdecker:"handwerk",zimmerei:"handwerk",maurer:"handwerk",bodenleger:"handwerk",glaser:"handwerk",gaertner:"handwerk",klima:"handwerk",reinigung:"handwerk",baumeister:"handwerk",kfz:"handwerk",aufsperrdienst:"handwerk",hafner:"handwerk",raumausstatter:"handwerk",goldschmied:"handwerk",schneider:"handwerk",rauchfangkehrer:"handwerk",schaedlingsbekaempfung:"handwerk",fahrradwerkstatt:"handwerk",erdbau:"handwerk",
      friseur:"kosmetik",kosmetik:"kosmetik",nagel:"kosmetik",massage:"kosmetik",tattoo:"kosmetik",fusspflege:"kosmetik",permanent_makeup:"kosmetik",hundesalon:"kosmetik",
      restaurant:"gastro",cafe:"gastro",baeckerei:"gastro",catering:"gastro",bar:"gastro",heuriger:"gastro",imbiss:"gastro",fleischerei:"gastro",winzer:"gastro",
      arzt:"gesundheit",zahnarzt:"gesundheit",physiotherapie:"gesundheit",psychotherapie:"gesundheit",tierarzt:"gesundheit",apotheke:"gesundheit",optiker:"gesundheit",heilpraktiker:"gesundheit",ergotherapie:"gesundheit",logopaedie:"gesundheit",energetiker:"gesundheit",hebamme:"gesundheit",diaetologe:"gesundheit",hoerakustiker:"gesundheit",zahntechnik:"gesundheit",heilmasseur:"gesundheit",osteopath:"gesundheit",lebensberater:"gesundheit",
      steuerberater:"dienstleistung",rechtsanwalt:"dienstleistung",fotograf:"dienstleistung",versicherung:"dienstleistung",immobilien:"dienstleistung",hausverwaltung:"dienstleistung",umzug:"dienstleistung",eventplanung:"dienstleistung",florist:"dienstleistung",architekt:"dienstleistung",it_service:"dienstleistung",werbeagentur:"dienstleistung",bestattung:"dienstleistung",notar:"dienstleistung",finanzberater:"dienstleistung",reisebuero:"dienstleistung",innenarchitekt:"dienstleistung",textilreinigung:"dienstleistung",unternehmensberater:"dienstleistung",dolmetscher:"dienstleistung",druckerei:"dienstleistung",sicherheitsdienst:"dienstleistung",
      fahrschule:"bildung",nachhilfe:"bildung",musikschule:"bildung",trainer:"bildung",yoga:"bildung",hundeschule:"bildung",tanzschule:"bildung",reitschule:"bildung",schwimmschule:"bildung",coach:"bildung",
    }[o.branche] || "";
    const ctaBranch = {
      // Handwerk
      elektro:               {h:"Strom-Probleme? Wir helfen sofort",          t:"Sichere Elektroinstallationen vom Fachbetrieb — jetzt anfragen."},
      installateur:          {h:"Heizung, Bad oder Sanitär?",                 t:"Wir sind Ihr verlässlicher Partner — kontaktieren Sie uns."},
      maler:                 {h:"Neuer Anstrich gefällig?",                   t:"Fassade, Innenräume oder Spezialanstrich — wir beraten Sie gerne."},
      tischler:              {h:"Maßarbeit aus Meisterhand",                  t:"Individuelle Möbel und Einbauten — lassen Sie sich beraten."},
      fliesenleger:          {h:"Fliesen, die begeistern",                    t:"Bad, Küche oder Terrasse — wir verlegen mit Präzision."},
      schlosser:             {h:"Metall in Bestform",                         t:"Geländer, Tore oder Sonderanfertigungen — sprechen Sie uns an."},
      dachdecker:            {h:"Dicht, sicher, langlebig",                   t:"Ihr Dach in besten Händen — jetzt unverbindlich anfragen."},
      zimmerei:              {h:"Holzbau vom Profi",                          t:"Dachstuhl, Carport oder Ausbau — wir setzen Ihr Projekt um."},
      maurer:                {h:"Solide gebaut, fair kalkuliert",             t:"Neubau, Umbau oder Sanierung — kontaktieren Sie uns."},
      bodenleger:            {h:"Der perfekte Boden für Ihr Zuhause",         t:"Parkett, Vinyl oder Fliesen — wir beraten und verlegen."},
      glaser:                {h:"Glas nach Maß",                              t:"Fenster, Spiegel oder Glasduschen — fragen Sie jetzt an."},
      gaertner:              {h:"Ihr Garten in Profi-Händen",                 t:"Pflege, Gestaltung oder Neubepflanzung — wir sind für Sie da."},
      klima:                 {h:"Angenehmes Klima, das ganze Jahr",           t:"Klimaanlagen und Lüftungstechnik — jetzt beraten lassen."},
      reinigung:             {h:"Sauberkeit, auf die Sie sich verlassen",     t:"Professionelle Reinigung für Büro, Praxis oder Zuhause."},
      baumeister:            {h:"Ihr Bauvorhaben in besten Händen",           t:"Planung und Ausführung aus einer Hand — jetzt anfragen."},
      kfz:                   {h:"Ihr Auto verdient das Beste",                t:"Reparatur, Service oder Pickerl — vereinbaren Sie einen Termin."},
      aufsperrdienst:        {h:"Ausgesperrt? Wir kommen sofort",            t:"Schnelle Hilfe rund um die Uhr — rufen Sie uns an."},
      hafner:                {h:"Wärme, die von Herzen kommt",                t:"Kachelofen, Kamin oder Sanierung — lassen Sie sich beraten."},
      raumausstatter:        {h:"Wohnen, das zu Ihnen passt",                 t:"Vorhänge, Polster oder Bodenbeläge — individuelle Beratung."},
      goldschmied:           {h:"Schmuck, so einzigartig wie Sie",            t:"Individuelle Anfertigungen und Reparaturen — besuchen Sie uns."},
      schneider:             {h:"Perfekter Sitz, perfekter Stil",             t:"Änderungen oder Maßanfertigungen — wir freuen uns auf Sie."},
      rauchfangkehrer:       {h:"Sicherheit für Ihr Zuhause",                 t:"Kehrung, Überprüfung oder Beratung — jetzt Termin vereinbaren."},
      schaedlingsbekaempfung:{h:"Schädlinge? Wir lösen das Problem",          t:"Diskret, effektiv und nachhaltig — kontaktieren Sie uns."},
      fahrradwerkstatt:      {h:"Ihr Rad in besten Händen",                    t:"Reparatur, Service oder E-Bike-Check — kommen Sie vorbei."},
      erdbau:                {h:"Baggerarbeiten vom Profi",                    t:"Aushub, Planierung oder Kanalbau — jetzt unverbindlich anfragen."},
      // Kosmetik
      friseur:               {h:"Zeit für einen neuen Look?",                 t:"Schnitt, Farbe oder Styling — buchen Sie Ihren Termin."},
      kosmetik:              {h:"Gönnen Sie sich eine Auszeit",               t:"Pflege und Beauty-Treatments — jetzt Termin buchen."},
      nagel:                 {h:"Gepflegte Nägel, perfekter Auftritt",        t:"Maniküre, Pediküre oder Nageldesign — wir freuen uns auf Sie."},
      massage:               {h:"Entspannung, die Sie verdienen",             t:"Klassisch, Thai oder Sportmassage — buchen Sie jetzt."},
      tattoo:                {h:"Ihre Idee, unsere Kunst",                    t:"Individuelles Tattoo-Design — vereinbaren Sie ein Beratungsgespräch."},
      fusspflege:            {h:"Gesunde Füße, leichter Schritt",             t:"Professionelle Fußpflege — jetzt Termin vereinbaren."},
      permanent_makeup:      {h:"Natürliche Schönheit, dauerhaft betont",     t:"Augenbrauen, Lippen oder Lidstrich — lassen Sie sich beraten."},
      hundesalon:            {h:"Wellness für Ihren Vierbeiner",              t:"Fellpflege und Styling — buchen Sie einen Termin für Ihren Hund."},
      // Gastronomie
      restaurant:            {h:"Genuss, der verbindet",                      t:"Reservieren Sie jetzt Ihren Tisch — wir freuen uns auf Sie."},
      cafe:                  {h:"Kaffee, Kuchen und gute Laune",              t:"Kommen Sie vorbei — wir haben einen Platz für Sie."},
      baeckerei:             {h:"Frisch gebacken, mit Liebe gemacht",         t:"Brot, Gebäck und Mehlspeisen — besuchen Sie uns."},
      catering:              {h:"Ihr Event, unser Genuss",                    t:"Catering für jeden Anlass — jetzt unverbindlich anfragen."},
      bar:                   {h:"Auf einen guten Abend",                      t:"Cocktails, Wein und beste Stimmung — wir freuen uns auf Sie."},
      heuriger:              {h:"Gemütlichkeit und guter Wein",               t:"Jause, Wein und Gastfreundschaft — kommen Sie vorbei."},
      imbiss:                {h:"Schnell, frisch und richtig lecker",         t:"Hunger? Schauen Sie bei uns vorbei oder bestellen Sie vor."},
      fleischerei:           {h:"Qualität, die man schmeckt",                 t:"Frisches Fleisch und Wurstwaren — besuchen Sie uns."},
      winzer:                {h:"Wein mit Charakter",                         t:"Verkostung, Ab-Hof-Verkauf oder Kellerführung — besuchen Sie uns."},
      // Gesundheit
      arzt:                  {h:"Ihre Gesundheit in guten Händen",            t:"Vereinbaren Sie jetzt Ihren Termin — wir nehmen uns Zeit für Sie."},
      zahnarzt:              {h:"Für Ihr schönstes Lächeln",                  t:"Prophylaxe, Behandlung oder Beratung — jetzt Termin vereinbaren."},
      physiotherapie:        {h:"Bewegung ist die beste Medizin",             t:"Individuelle Therapie für Ihre Beschwerden — jetzt Termin buchen."},
      psychotherapie:        {h:"Der erste Schritt zählt",                    t:"Vertraulich und einfühlsam — vereinbaren Sie ein Erstgespräch."},
      tierarzt:              {h:"Das Beste für Ihr Tier",                     t:"Vorsorge, Behandlung oder Notfall — wir sind für Sie da."},
      apotheke:              {h:"Gesundheit beginnt bei guter Beratung",      t:"Medikamente, Hausmittel oder Tipps — besuchen Sie uns."},
      optiker:               {h:"Sehen Sie die Welt in bester Qualität",      t:"Sehtest, Brillen oder Kontaktlinsen — jetzt Termin vereinbaren."},
      heilpraktiker:         {h:"Ganzheitlich gesund werden",                 t:"Naturheilkunde und individuelle Therapie — jetzt anfragen."},
      ergotherapie:          {h:"Wieder aktiv im Alltag",                     t:"Ergotherapie für Kinder und Erwachsene — Termin vereinbaren."},
      logopaedie:            {h:"Sprache verbindet",                          t:"Sprachtherapie für alle Altersgruppen — jetzt Termin buchen."},
      energetiker:           {h:"Neue Energie für Körper und Geist",          t:"Ganzheitliche Behandlungen — vereinbaren Sie einen Termin."},
      hebamme:               {h:"Begleitung von Anfang an",                   t:"Schwangerschaft, Geburt und Nachsorge — jetzt Kontakt aufnehmen."},
      diaetologe:            {h:"Ernährung, die zu Ihnen passt",              t:"Individuelle Beratung für Ihre Gesundheitsziele — jetzt anfragen."},
      hoerakustiker:         {h:"Wieder gut hören, besser leben",             t:"Hörtest und Beratung — vereinbaren Sie Ihren Termin."},
      zahntechnik:           {h:"Perfektion bis ins Detail",                  t:"Hochwertiger Zahnersatz aus dem Meisterlabor — jetzt anfragen."},
      heilmasseur:           {h:"Heilsame Hände, spürbare Wirkung",           t:"Medizinische Massage — jetzt Termin vereinbaren."},
      osteopath:             {h:"Ganzheitlich behandeln, nachhaltig heilen",  t:"Osteopathische Therapie — vereinbaren Sie einen Termin."},
      lebensberater:         {h:"Neue Perspektiven entdecken",                t:"Professionelle Begleitung in jeder Lebenslage — Erstgespräch vereinbaren."},
      // Dienstleistung
      steuerberater:         {h:"Steuern sparen, Überblick behalten",         t:"Professionelle Steuerberatung — vereinbaren Sie ein Erstgespräch."},
      rechtsanwalt:          {h:"Ihr Recht in starken Händen",                t:"Kompetente Rechtsberatung — jetzt Termin vereinbaren."},
      fotograf:              {h:"Momente, die bleiben",                       t:"Professionelle Fotografie für jeden Anlass — jetzt anfragen."},
      versicherung:          {h:"Gut versichert, sorgenfrei leben",           t:"Individuelle Beratung für Ihren optimalen Schutz."},
      immobilien:            {h:"Ihr Zuhause wartet",                         t:"Kauf, Verkauf oder Vermietung — lassen Sie sich beraten."},
      hausverwaltung:        {h:"Ihre Immobilie in besten Händen",            t:"Professionelle Verwaltung — kontaktieren Sie uns."},
      umzug:                 {h:"Stressfrei ins neue Zuhause",                t:"Umzugsservice vom Profi — jetzt unverbindlich anfragen."},
      eventplanung:          {h:"Ihr Event, unser Konzept",                   t:"Von der Idee bis zur Umsetzung — lassen Sie uns planen."},
      florist:               {h:"Blumen sagen mehr als Worte",                t:"Sträuße, Gestecke oder Eventfloristik — besuchen Sie uns."},
      architekt:             {h:"Räume, die inspirieren",                     t:"Planung und Entwurf — kontaktieren Sie uns für ein Erstgespräch."},
      it_service:            {h:"IT-Probleme? Wir kümmern uns",               t:"Support, Netzwerk oder Sicherheit — jetzt anfragen."},
      werbeagentur:          {h:"Ihre Marke verdient Aufmerksamkeit",         t:"Kreative Lösungen für Ihren Erfolg — sprechen Sie uns an."},
      bestattung:            {h:"In schweren Stunden für Sie da",             t:"Einfühlsame Begleitung und Organisation — rufen Sie uns an."},
      notar:                 {h:"Rechtssicherheit für Ihre Vorhaben",         t:"Beglaubigungen und Beurkundungen — Termin vereinbaren."},
      finanzberater:         {h:"Finanzen klug gestalten",                    t:"Unabhängige Beratung für Ihre Zukunft — jetzt Gespräch vereinbaren."},
      reisebuero:            {h:"Traumurlaub beginnt hier",                   t:"Individuelle Reiseplanung — lassen Sie sich inspirieren."},
      innenarchitekt:        {h:"Wohnen, das begeistert",                     t:"Raumkonzepte mit Stil — vereinbaren Sie eine Beratung."},
      textilreinigung:       {h:"Sauber, frisch und gepflegt",                t:"Professionelle Reinigung für Ihre Textilien — besuchen Sie uns."},
      unternehmensberater:   {h:"Ihr Unternehmen, unsere Expertise",          t:"Strategieberatung und Prozessoptimierung — jetzt Erstgespräch vereinbaren."},
      dolmetscher:           {h:"Sprache verbindet Welten",                   t:"Professionelle Übersetzungen und Dolmetschleistungen — jetzt anfragen."},
      druckerei:             {h:"Druck, der Eindruck macht",                  t:"Visitenkarten, Flyer oder Großformat — jetzt bestellen."},
      sicherheitsdienst:     {h:"Sicherheit, auf die Sie zählen können",      t:"Objektschutz, Veranstaltungen oder Ermittlungen — kontaktieren Sie uns."},
      // Bildung
      fahrschule:            {h:"Führerschein? Los geht's!",                  t:"Anmeldung und Beratung — starten Sie jetzt durch."},
      nachhilfe:             {h:"Bessere Noten, mehr Selbstvertrauen",        t:"Individuelle Nachhilfe — jetzt Probestunde vereinbaren."},
      musikschule:           {h:"Musik macht glücklich",                      t:"Instrument lernen in jedem Alter — melden Sie sich an."},
      trainer:               {h:"Erreichen Sie Ihre Ziele",                   t:"Persönliches Training — buchen Sie Ihre erste Einheit."},
      yoga:                  {h:"Finden Sie Ihre innere Balance",             t:"Yoga-Kurse für alle Levels — jetzt Probestunde buchen."},
      hundeschule:           {h:"Ein gutes Team — Mensch und Hund",           t:"Training und Erziehung — melden Sie sich zur Schnupperstunde."},
      tanzschule:            {h:"Tanzen lernen mit Freude",                   t:"Kurse für Anfänger und Fortgeschrittene — jetzt anmelden."},
      reitschule:            {h:"Reiten lernen, Natur erleben",               t:"Reitstunden für alle Altersgruppen — jetzt Schnupperstunde buchen."},
      schwimmschule:         {h:"Sicher schwimmen lernen",                    t:"Schwimmkurse für Kinder und Erwachsene — jetzt anmelden."},
      coach:                 {h:"Ihr nächster Schritt beginnt hier",          t:"Business oder Life Coaching — buchen Sie Ihr Erstgespräch."},
    };
    const ctaGroupDefaults = {
      handwerk:       {h:"Bereit für Ihr Projekt?",            t:"Wir beraten Sie gerne — kostenlos und unverbindlich."},
      kosmetik:       {h:"Bereit für Ihren Termin?",           t:"Wir freuen uns auf Ihren Besuch."},
      gastro:         {h:"Lust auf guten Geschmack?",          t:"Reservieren Sie jetzt Ihren Tisch."},
      gesundheit:     {h:"Ihre Gesundheit liegt uns am Herzen",t:"Vereinbaren Sie jetzt einen Termin."},
      dienstleistung: {h:"Lassen Sie uns starten",             t:"Wir freuen uns auf Ihre Anfrage."},
      bildung:        {h:"Bereit für den nächsten Schritt?",   t:"Melden Sie sich jetzt an."},
    };
    const ctaDef = ctaBranch[o.branche] || ctaGroupDefaults[brGruppe] || {h:"Wir freuen uns auf Sie", t:"Kontaktieren Sie uns — wir sind für Sie da."};
    const ctaH = esc(o.cta_headline || ctaDef.h);
    const ctaT = esc(o.cta_text || ctaDef.t);
    const ctaBlock = `<section class="sec-cta-block sr-fade" style="padding:80px 0;background:var(--accent);color:#fff;text-align:center"><div class="w"><h2 style="font-size:clamp(1.3rem,3vw,1.8rem);font-weight:${ctaH2Weight};margin-bottom:8px;color:#fff">${ctaH}</h2><p style="font-size:.9rem;opacity:${ctaPOpacity};margin-bottom:24px">${ctaT}</p><a href="#kontakt" class="btn" style="background:#fff;color:var(--accent);font-weight:700;border-radius:${ctaBtnR};padding:14px 36px;font-size:.95rem;text-decoration:none;display:inline-block${ctaBtnShadow}">Jetzt Kontakt aufnehmen</a></div></section>`;
    html = html.replace("<!-- CTA_BLOCK -->", ctaBlock);
  } else {
    html = html.replace("<!-- CTA_BLOCK -->", "");
  }

  // FAQ — Haeufig gestellte Fragen
  const faqItems = Array.isArray(o.faq) ? o.faq.filter(f => f && f.frage && f.antwort) : [];
  const showFaq = sv.faq !== false && faqItems.length > 0;
  if (showFaq && html.includes("<!-- FAQ -->")) {
    const items = faqItems.slice(0, 8).map((f, i) =>
      `<div style="border-bottom:1px solid var(--sep)">` +
      `<button class="sr-faq-btn" aria-expanded="false" aria-controls="sr-faq-a${i}" style="width:100%;display:flex;justify-content:space-between;align-items:center;padding:18px 0;background:none;border:none;cursor:pointer;font-family:var(--font);font-size:.95rem;font-weight:700;color:var(--primary);text-align:left;line-height:1.5"><span style="flex:1">${esc(f.frage)}</span><span class="sr-faq-icon" style="font-size:1.2rem;color:var(--accent);font-weight:300;margin-left:16px;flex-shrink:0">+</span></button>` +
      `<div id="sr-faq-a${i}" role="region" class="sr-faq-answer" style="max-height:0;overflow:hidden;transition:max-height .3s ease,padding-bottom .3s ease;padding-bottom:0">` +
      `<p style="font-size:.88rem;color:var(--textMuted);line-height:1.8;margin:0;padding-right:32px">${esc(f.antwort) || ""}</p>` +
      `</div></div>`
    ).join("");
    const faqToggleWeight = isElegant ? "600" : "700";
    const faqToggleSize = isElegant ? ".9rem" : ".95rem";
    const styledItems = items.replace(/font-weight:700;/g, `font-weight:${faqToggleWeight};`).replace(/font-size:\.95rem;/g, `font-size:${faqToggleSize};`);
    const isTwoCol = v.faq === "zweispaltig";
    const faqLayout = isTwoCol
      ? `<div class="sr-faq-grid">${styledItems}</div>`
      : `<div style="max-width:720px">${styledItems}</div>`;
    const faqGridStyle = isTwoCol ? `<style>.sr-faq-grid{display:grid;grid-template-columns:1fr 1fr;gap:0 40px}@media(max-width:768px){.sr-faq-grid{grid-template-columns:1fr}}</style>` : "";
    const section = `<section class="sec-faq sr-fade" style="padding:100px 0;background:#fff"><div class="w"><div style="margin-bottom:40px">${sectionLabel("FAQ")}${sectionH2("Häufig gestellte Fragen")}</div>${faqLayout}</div></section>`;
    if (faqGridStyle) html = html.replace("</head>", faqGridStyle + "</head>");
    html = html.replace("<!-- FAQ -->", section);
    // FAQ-Accordion Script (Event-Listener statt inline onclick)
    const faqScript = `<script>(function(){document.querySelectorAll('.sr-faq-btn').forEach(function(btn){btn.addEventListener('click',function(){var a=btn.nextElementSibling;var open=a.style.maxHeight!=='0px';a.style.maxHeight=open?'0px':a.scrollHeight+'px';a.style.paddingBottom=open?'0':'16px';btn.querySelector('.sr-faq-icon').textContent=open?'+':'\\u2212';btn.setAttribute('aria-expanded',open?'false':'true');});});})();</script>`;
    html = html.replace("</body>", faqScript + "\n</body>");
  } else {
    html = html.replace("<!-- FAQ -->", "");
  }

  // Galerie — Foto-Grid mit Lightbox
  const galerieItems = Array.isArray(o.galerie) ? o.galerie.filter(g => g && g.url) : [];
  const showGalerie = sv.galerie !== false && galerieItems.length > 0;
  if (showGalerie && html.includes("<!-- GALERIE -->")) {
    const cols = v.galerie === "grid-3x2" ? "repeat(3,1fr)" : "repeat(2,1fr)";
    const photos = galerieItems.slice(0, 12).map(g =>
      `<div style="overflow:hidden;border-radius:var(--rLg);line-height:0;cursor:zoom-in;aspect-ratio:4/3">` +
      `<img class="sr-zoom sr-img-hover" src="${g.url}" alt="${esc(g.caption) || ""}" loading="lazy" style="width:100%;height:100%;object-fit:cover;display:block;transition:transform .3s">` +
      `</div>`
    ).join("");
    const galerieRadius = isModern ? "16px" : isElegant ? "2px" : "var(--rLg)";
    const section = `<section class="sec-galerie sr-fade" style="padding:100px 0;background:var(--bg)"><div class="w"><div style="margin-bottom:40px">${sectionLabel("Galerie")}${sectionH2("Einblicke in unsere Arbeit")}</div><div style="display:grid;grid-template-columns:${cols};gap:${isElegant ? "8px" : "12px"}">${photos.replace(/border-radius:var\(--rLg\)/g, `border-radius:${galerieRadius}`)}</div></div></section>`;
    html = html.replace("<!-- GALERIE -->", section);
  } else {
    html = html.replace("<!-- GALERIE -->", "");
  }

  // Zahlen & Fakten — Counter-Blocks
  const faktenItems = Array.isArray(o.fakten) ? o.fakten.filter(f => f && f.zahl) : [];
  const showFakten = sv.fakten !== false && faktenItems.length >= 2;
  if (showFakten && html.includes("<!-- FAKTEN -->")) {
    const cols = `repeat(${Math.min(faktenItems.length, 4)},1fr)`;
    const faktenFontWeight = isElegant ? "500" : "800";
    const faktenFontSize = isElegant ? "clamp(1.4rem,3.5vw,2rem)" : "clamp(1.6rem,4vw,2.4rem)";
    const items = faktenItems.slice(0, 4).map(f =>
      `<div style="text-align:center;padding:20px"><div style="font-size:${faktenFontSize};font-weight:${faktenFontWeight};color:var(--accent);letter-spacing:-.03em;line-height:1">${esc(f.zahl)}</div><div style="font-size:.85rem;color:var(--textMuted);margin-top:6px">${esc(f.label) || ""}</div></div>`
    ).join("");
    const section = `<section class="sec-fakten sr-fade" style="padding:80px 0;background:var(--bg)"><div class="w"><div style="display:grid;grid-template-columns:${cols};gap:16px">${items}</div></div></section>`;
    html = html.replace("<!-- FAKTEN -->", section);
  } else {
    html = html.replace("<!-- FAKTEN -->", "");
  }

  // Partner & Zertifikate — Logo-Leiste
  const partnerItems = Array.isArray(o.partner) ? o.partner.filter(p => p && (p.url_logo || p.name)) : [];
  const showPartner = sv.partner !== false && partnerItems.length > 0;
  if (showPartner && html.includes("<!-- PARTNER -->")) {
    const logos = partnerItems.slice(0, 8).map(p => {
      if (p.url_logo) {
        return `<div style="display:flex;align-items:center;justify-content:center;padding:12px 20px"><img src="${p.url_logo}" alt="${esc(p.name) || "Partner"}" loading="lazy" style="height:40px;width:auto;object-fit:contain;opacity:.7;filter:grayscale(30%);transition:opacity .2s,filter .2s" class="sr-partner-hover"></div>`;
      }
      return `<div style="display:flex;align-items:center;justify-content:center;padding:12px 24px;background:var(--bg);border:1px solid var(--sep);border-radius:var(--r);font-size:.75rem;font-weight:600;color:var(--textMuted)">${esc(p.name)}</div>`;
    }).join("");
    const section = `<section class="sec-partner" style="padding:48px 0;background:#fff;border-top:1px solid var(--sep)"><div class="w"><div style="text-align:center;margin-bottom:16px;font-size:.72rem;font-weight:600;color:var(--textMuted);text-transform:uppercase;letter-spacing:.1em">Unsere Partner &amp; Zertifizierungen</div><div style="display:flex;justify-content:center;align-items:center;flex-wrap:wrap;gap:16px">${logos}</div></div></section>`;
    html = html.replace("<!-- PARTNER -->", section);
  } else {
    html = html.replace("<!-- PARTNER -->", "");
  }

  // Kontaktformular in die Kontakt-Sektion injizieren (<!-- KONTAKT_FORM --> Platzhalter)
  if (html.includes("<!-- KONTAKT_FORM -->")) {
    const br = (o.branche || "").toLowerCase();
    // Explizite Wahl aus Portal oder automatisch nach Branche
    let formType = o.kontakt_formular || "auto";
    if (formType === "auto") {
      if (["restaurant","cafe","bar","heuriger","imbiss","catering","baeckerei","fleischerei"].includes(br)) formType = "reservierung";
      else if (["kosmetik","friseur","nagel","massage","tattoo","fusspflege","permanent_makeup","hundesalon",
        "physiotherapie","arzt","zahnarzt","tierarzt","psychotherapie","ergotherapie","logopaedie",
        "energetiker","hebamme","diaetologe","hoerakustiker","heilmasseur","optiker"].includes(br)) formType = "termin";
      else if (["elektro","installateur","maler","tischler","fliesenleger","schlosser","dachdecker",
        "zimmerei","maurer","bodenleger","glaser","gaertner","klima","reinigung","kfz","hafner",
        "raumausstatter","umzug","schaedlingsbekaempfung"].includes(br)) formType = "angebot";
      else formType = "standard";
    }
    const gastro = formType === "reservierung";
    const termin = formType === "termin";
    const angebot = formType === "angebot";

    let headline = "Schreiben Sie uns";
    let extraFields = "";
    let msgLabel = "Nachricht";
    let msgPlaceholder = "Ihre Nachricht...";
    let msgRows = 5;
    let btnText = "Nachricht senden";
    let okText = "Wir haben Ihre Nachricht erhalten und melden uns bald bei Ihnen.";

    if (gastro) {
      headline = "Reservierung anfragen";
      extraFields =
        `<div class="k-form-row">` +
        `<div><label>Datum</label><input type="date" autocomplete="off"></div>` +
        `<div><label>Uhrzeit</label><input type="time" autocomplete="off"></div>` +
        `<div><label>Personen</label><input type="number" min="1" max="50" placeholder="2" inputmode="numeric" autocomplete="off"></div>` +
        `</div>`;
      msgLabel = "Anmerkungen";
      msgPlaceholder = "z.B. Allergien, Kinderhochstuhl, besondere Wünsche...";
      btnText = "Reservierung anfragen";
      okText = "Wir haben Ihre Reservierungsanfrage erhalten und bestätigen diese so rasch wie möglich.";
    } else if (termin) {
      headline = "Termin anfragen";
      extraFields =
        `<div class="k-form-row k-form-row-2">` +
        `<div><label>Wunschtermin</label><input type="date" autocomplete="off"></div>` +
        `<div><label>Bevorzugte Uhrzeit</label><select aria-label="Bevorzugte Uhrzeit" style="width:100%;padding:11px 14px;border:1.5px solid var(--sep);border-radius:var(--r);font-size:.88rem;font-family:var(--font);background:#fff;color:var(--text);box-sizing:border-box;min-height:44px">` +
        `<option value="">Egal</option><option>Vormittag</option><option>Nachmittag</option><option>Abend</option>` +
        `</select></div>` +
        `</div>`;
      msgLabel = "Anliegen";
      msgPlaceholder = "Welche Behandlung oder welches Anliegen?";
      btnText = "Termin anfragen";
      okText = "Wir haben Ihre Terminanfrage erhalten und melden uns zur Bestätigung.";
    } else if (angebot) {
      headline = "Anfrage senden";
      extraFields =
        `<div class="k-form-field"><label>Adresse / Einsatzort</label><input type="text" placeholder="Straße, PLZ Ort" autocomplete="street-address"></div>`;
      msgLabel = "Beschreibung des Anliegens";
      msgPlaceholder = "Was soll gemacht werden? Bitte beschreiben Sie Ihr Anliegen möglichst genau.";
      msgRows = 6;
      btnText = "Anfrage senden";
      okText = "Wir haben Ihre Anfrage erhalten und melden uns für einen Termin oder ein Angebot.";
    }

    const inlineForm = `<div class="k-form">` +
      `<h3>${headline}</h3>` +
      `<div id="sr-form-wrap">` +
      `<form id="sr-kf" onsubmit="document.getElementById('sr-form-wrap').style.display='none';document.getElementById('sr-form-ok').style.display='block';return false;">` +
      `<div class="k-form-row">` +
      `<div><label>Name *</label><input required aria-required="true" type="text" placeholder="Ihr Name" autocomplete="name"></div>` +
      `<div><label>E-Mail *</label><input required aria-required="true" type="email" placeholder="ihre@email.at" autocomplete="email" inputmode="email"></div>` +
      `<div><label>Telefon</label><input type="tel" placeholder="+43 ..." autocomplete="tel" inputmode="tel"></div>` +
      `</div>` +
      extraFields +
      `<div class="k-form-field"><label>${msgLabel} *</label><textarea required aria-required="true" rows="${msgRows}" placeholder="${msgPlaceholder}"></textarea></div>` +
      `<button type="submit">${btnText}</button>` +
      `</form></div>` +
      `<div id="sr-form-ok" class="k-form-ok">` +
      `<div style="font-size:1.8rem;color:#16a34a">&#10003;</div>` +
      `<h4>Vielen Dank!</h4>` +
      `<p>${okText}</p>` +
      `<p style="font-size:.75rem;color:#94a3b8;margin-top:12px">Hinweis: Im Testbetrieb wird diese Nachricht nicht zugestellt. Das Formular ist eine Vorschau.</p>` +
      `</div>` +
      `</div>`;
    html = html.replace("<!-- KONTAKT_FORM -->", inlineForm);
  }

  // ── Leistungen Cards serve-time injizieren (<!-- LEISTUNGEN --> Platzhalter) ──
  if (html.includes("<!-- LEISTUNGEN -->")) {
    const leistungenArr = [...(o.leistungen || [])];
    if (o.extra_leistung?.trim()) {
      leistungenArr.push(...o.extra_leistung.split(/[,\n]+/).map(s => s.trim()).filter(Boolean));
    }
    const descMap = o.leistungen_beschreibungen || {};
    const checkIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
    const cardStyleMap = {
      klassisch:  "border:1px solid var(--sep,#e2e8f0);background:#fff;border-radius:var(--rLg,8px);box-shadow:0 1px 3px rgba(0,0,0,.04),0 4px 16px rgba(0,0,0,.06);transition:transform .25s cubic-bezier(.22,1,.36,1),box-shadow .25s ease;overflow:hidden",
      modern:     "border-radius:16px;box-shadow:0 2px 8px rgba(0,0,0,.04),0 8px 32px rgba(0,0,0,.07);background:#fff;transition:transform .25s cubic-bezier(.22,1,.36,1),box-shadow .25s ease;overflow:hidden",
      elegant:    "border:1px solid var(--sep,#e7e5e4);background:#fff;border-radius:2px;box-shadow:0 1px 2px rgba(0,0,0,.03);transition:transform .25s cubic-bezier(.22,1,.36,1),box-shadow .25s ease;overflow:hidden",
      custom:     "border:1px solid var(--sep,#e5e7eb);background:#fff;border-radius:var(--rLg,8px);box-shadow:0 1px 3px rgba(0,0,0,.04),0 4px 16px rgba(0,0,0,.06);transition:transform .25s cubic-bezier(.22,1,.36,1),box-shadow .25s ease;overflow:hidden",
    };
    const iconStyleMap = {
      klassisch: "width:42px;height:42px;border-radius:8px;background:var(--accent);display:flex;align-items:center;justify-content:center;margin-bottom:18px;flex-shrink:0",
      modern:    "width:44px;height:44px;border-radius:50%;background:var(--accent);display:flex;align-items:center;justify-content:center;margin-bottom:18px;flex-shrink:0",
      elegant:   "width:32px;height:32px;border-radius:2px;background:var(--accent);display:flex;align-items:center;justify-content:center;margin-bottom:20px;flex-shrink:0;opacity:.85",
      custom:    "width:44px;height:44px;border-radius:10px;background:var(--accent);display:flex;align-items:center;justify-content:center;margin-bottom:18px;flex-shrink:0",
    };
    const gradients = [
      "linear-gradient(135deg,color-mix(in srgb,var(--accent) 85%,#000) 0%,var(--accent) 100%)",
      "linear-gradient(135deg,var(--accent) 0%,color-mix(in srgb,var(--accent) 60%,#fff) 100%)",
      "linear-gradient(135deg,color-mix(in srgb,var(--primary) 80%,var(--accent)) 0%,var(--accent) 100%)",
      "linear-gradient(135deg,var(--primary) 0%,color-mix(in srgb,var(--accent) 70%,var(--primary)) 100%)",
      "linear-gradient(135deg,color-mix(in srgb,var(--accent) 90%,#000) 0%,color-mix(in srgb,var(--accent) 60%,#fff) 100%)",
      "linear-gradient(135deg,var(--accent) 0%,var(--primary) 100%)",
    ];
    const cardStyle = cardStyleMap[stilName] || cardStyleMap.klassisch;
    const iconStyle = iconStyleMap[stilName] || iconStyleMap.klassisch;
    const preisMap = o.leistungen_preise || {};
    const fotoMap = o.leistungen_fotos || {};
    const findInMap = (map, key) => {
      if (map[key]) return map[key];
      const kLow = key.toLowerCase();
      for (const [k, v] of Object.entries(map)) { if (k.toLowerCase() === kLow) return v; }
      return "";
    };
    const cards = leistungenArr.map((l, i) => {
      const lCapitalized = esc(l.charAt(0).toUpperCase() + l.slice(1));
      const desc = esc(findInMap(descMap, l) || findInMap(descMap, l.charAt(0).toUpperCase() + l.slice(1)));
      const preis = esc(findInMap(preisMap, l) || findInMap(preisMap, l.charAt(0).toUpperCase() + l.slice(1)));
      const foto = findInMap(fotoMap, l) || findInMap(fotoMap, l.charAt(0).toUpperCase() + l.slice(1));
      const imgArea = foto
        ? `<div style="height:160px;overflow:hidden"><img src="${foto}" alt="${lCapitalized}" loading="lazy" style="width:100%;height:100%;object-fit:cover;display:block"></div>`
        : "";
      return `<div class="sr-fade sr-card-hover" style="${cardStyle}">` +
        imgArea +
        `<div style="padding:24px 26px">` +
        `<div style="${iconStyle}">${checkIcon}</div>` +
        `<h3 style="color:var(--primary,#0f2b5b);font-weight:800;margin:0 0 10px;font-size:1.08rem;letter-spacing:-.02em;line-height:1.3">${lCapitalized}</h3>` +
        (desc ? `<p style="color:var(--textMuted,#64748b);margin:0;font-size:.95rem;line-height:1.7">${desc}</p>` : `<p style="color:var(--textMuted,#64748b);margin:0;font-size:.95rem;line-height:1.7;opacity:.6">Professionelle Leistung für Ihre Bedürfnisse.</p>`) +
        (preis ? `<div style="margin-top:14px;padding-top:12px;border-top:1px solid rgba(0,0,0,.06);font-size:.92rem;font-weight:700;color:var(--accent,#6366f1)">${preis}</div>` : "") +
        `</div></div>`;
    }).join("");
    const n = leistungenArr.length;

    let grid;
    if (v.leistungen === "editorial") {
      // Editorial: Liste mit Foto + Beschreibung nebeneinander
      const listCards = leistungenArr.map((l, i) => {
        const lCap = esc(l.charAt(0).toUpperCase() + l.slice(1));
        const desc = esc(findInMap(descMap, l) || findInMap(descMap, l.charAt(0).toUpperCase() + l.slice(1)));
        const preis = esc(findInMap(preisMap, l) || findInMap(preisMap, l.charAt(0).toUpperCase() + l.slice(1)));
        const foto = findInMap(fotoMap, l) || findInMap(fotoMap, l.charAt(0).toUpperCase() + l.slice(1));
        return `<div class="sr-fade sr-card-hover" style="${cardStyle};display:grid;grid-template-columns:${foto ? '160px ' : ''}auto 1fr;gap:0;align-items:stretch">` +
          (foto ? `<div style="overflow:hidden"><img src="${foto}" alt="${lCap}" loading="lazy" style="width:100%;height:100%;object-fit:cover;display:block"></div>` : "") +
          `<div style="padding:20px 24px;display:flex;align-items:center">` +
          `<div style="${iconStyle};margin:0 16px 0 0">${checkIcon}</div>` +
          `<div style="flex:1">` +
          `<h3 style="color:var(--primary);font-weight:800;margin:0 0 4px;font-size:1.05rem;letter-spacing:-.02em">${lCap}</h3>` +
          (desc ? `<p style="color:var(--textMuted);margin:0;font-size:.88rem;line-height:1.7">${desc}</p>` : "") +
          (preis ? `<div style="margin-top:8px;font-size:.88rem;font-weight:700;color:var(--accent)">${preis}</div>` : "") +
          `</div></div></div>`;
      }).join("");
      grid = `<div class="sr-leist-grid" style="display:grid;grid-template-columns:1fr;gap:14px">${listCards}</div>`;
    } else {
      // Standard: Grid
      const gridCols = n === 1 ? "1fr" : n <= 3 ? `repeat(${n},1fr)` : n === 4 ? "repeat(2,1fr)" : "repeat(3,1fr)";
      grid = `<div class="sr-leist-grid" style="display:grid;grid-template-columns:${gridCols};gap:20px">${cards}</div>`;
    }
    // Downloads unter den Leistungen (optional, max 3 PDFs/Links)
    const downloads = Array.isArray(o.downloads) ? o.downloads.filter(d => d && d.url && d.label) : [];
    if (downloads.length > 0) {
      const dlR = isModern ? "12px" : isElegant ? "2px" : "6px";
      const dlBadgeR = isModern ? "100px" : isElegant ? "2px" : "4px";
      const dlShadow = isModern ? "box-shadow:0 2px 8px rgba(0,0,0,.06)" : "";
      const dlBorder = isModern ? "border:none" : `border:1px solid var(--sep)`;
      const dlIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><polyline points="9 15 12 18 15 15"/></svg>`;
      const dlArrow = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round"><path d="M7 17l9.2-9.2M17 17V7.8H7.8"/></svg>`;
      const dlHtml = downloads.map(d => {
        const ext = (d.url.match(/\.(\w{2,4})(\?|$)/)||[])[1]||"";
        const badge = ext ? `<span style="font-size:.65rem;font-weight:700;text-transform:uppercase;letter-spacing:.05em;padding:3px 8px;border-radius:${dlBadgeR};background:color-mix(in srgb,var(--accent) 8%,transparent);color:var(--accent)">${ext}</span>` : "";
        return `<a href="${d.url}" target="_blank" rel="noopener" class="sr-dl-card" style="display:flex;align-items:center;gap:14px;padding:16px 20px;${dlBorder};border-radius:${dlR};background:#fff;${dlShadow};text-decoration:none;transition:all .25s cubic-bezier(.22,1,.36,1);cursor:pointer">` +
          `<div style="width:44px;height:44px;border-radius:${dlR};background:color-mix(in srgb,var(--accent) 8%,transparent);display:flex;align-items:center;justify-content:center;flex-shrink:0">${dlIcon}</div>` +
          `<div style="flex:1;min-width:0"><div style="font-size:.95rem;font-weight:700;color:var(--text);display:flex;align-items:center;gap:8px;flex-wrap:wrap">${d.label}${badge}</div></div>` +
          `<div style="flex-shrink:0;opacity:.5">${dlArrow}</div></a>`;
      }).join("");
      const dlCols = downloads.length === 1 ? "1fr" : "1fr 1fr";
      grid += `<div style="margin-top:24px;display:grid;grid-template-columns:${dlCols};gap:12px">` +
        `<style>.sr-dl-card:hover{transform:translateY(-2px);box-shadow:0 4px 16px rgba(0,0,0,.08)!important}</style>` +
        dlHtml + `</div>`;
    }
    html = html.replace("<!-- LEISTUNGEN -->", grid);
  }

  // ── Serve-time Variablen-Ersetzung (Sofort-Updates ohne Re-Generierung) ──
  const tel = o.telefon || "";
  const telHref = tel ? "tel:" + tel.replace(/\s/g, "") : "";
  const adresseVoll = [o.adresse, [o.plz, o.ort].filter(Boolean).join(" ")].filter(Boolean).join(", ");
  const oezKey = o.oeffnungszeiten || "";
  const oezRaw = oezKey === "custom" ? (o.oeffnungszeiten_custom || "") : (OEZ_LABELS[oezKey] || oezKey || "Nach Vereinbarung");
  // Mehrzeilige Öffnungszeiten als kleine Tabelle darstellen
  const oezLines = oezRaw.split(/[,\n]+/).map(s => s.trim()).filter(Boolean);
  let oezLabel;
  if (oezLines.length > 1) {
    const rows = oezLines.map(line => {
      const m = line.match(/^(Mo|Di|Mi|Do|Fr|Sa|So|Mon|Die|Mit|Don|Fre|Sam|Son)[a-z]*\.?\s*[:\-]?\s*(.*)/i);
      if (m) return `<tr><td style="font-weight:600;padding:3px 16px 3px 0;white-space:nowrap;vertical-align:top">${m[1]}</td><td style="padding:3px 0">${m[2]}</td></tr>`;
      return `<tr><td colspan="2" style="padding:3px 0">${line}</td></tr>`;
    }).join("");
    oezLabel = `<table style="font-size:.9rem;line-height:1.5;border-collapse:collapse">${rows}</table>`;
  } else {
    oezLabel = oezRaw;
  }

  // Vorteile HTML aus text_vorteile JSON-Array aufbauen
  let vorteileHtml = "";
  if (Array.isArray(o.text_vorteile) && o.text_vorteile.length) {
    const stil = o.stil || "klassisch";
    if (stil === "modern") {
      vorteileHtml = o.text_vorteile.map(v =>
        `<div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:16px">` +
        `<div style="width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,.15);color:#fff;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:.85rem;font-weight:700">&#10003;</div>` +
        `<span style="padding-top:8px">${esc(v)}</span></div>`
      ).join("");
    } else if (stil === "elegant") {
      vorteileHtml = o.text_vorteile.map(v =>
        `<div style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,.1)">` +
        `<span style="color:rgba(255,255,255,.5);font-weight:300;margin-right:8px">&#8211;</span>${esc(v)}</div>`
      ).join("");
    } else {
      vorteileHtml = o.text_vorteile.map(v =>
        `<div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:12px">` +
        `<span style="color:rgba(255,255,255,.8);font-weight:700;flex-shrink:0">&#10003;</span><span>${esc(v)}</span></div>`
      ).join("");
    }
  }

  const vars = {
    "{{FIRMENNAME}}":       esc(o.firmenname || ""),
    "{{TEL_HREF}}":         telHref,
    "{{TEL_DISPLAY}}":      esc(tel),
    "{{EMAIL}}":            esc(o.email || ""),
    "{{ADRESSE_VOLL}}":     esc(adresseVoll),
    "{{PLZ_ORT}}":          esc([o.plz, o.ort].filter(Boolean).join(" ")),
    "{{KURZBESCHREIBUNG}}": esc(o.kurzbeschreibung || ""),
    "{{OEFFNUNGSZEITEN}}":  oezLabel,
    "{{EINSATZGEBIET}}":    esc(o.einsatzgebiet || ""),
    "{{SOCIAL_ICONS}}":     buildSocialIcons(o),
    "{{UEBER_UNS_TEXT}}":   esc(o.text_ueber_uns || ""),
    "{{VORTEILE}}":         vorteileHtml,
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

  // ── Serve-time Style Fixes (Hover + Responsive) ──
  const responsiveStyle = `<style>
/* CSS Hover-Effekte (statt inline JS — funktioniert auch auf Touch/Keyboard) */
.sr-card-hover{transition:transform .25s cubic-bezier(.22,1,.36,1),box-shadow .25s ease}
.sr-card-hover:hover{transform:translateY(-4px);box-shadow:0 8px 24px rgba(0,0,0,.1),0 2px 8px rgba(0,0,0,.06)}
.sr-img-hover{transition:transform .3s}
.sr-img-hover:hover{transform:scale(1.03)}
.sr-partner-hover{transition:opacity .2s,filter .2s}
.sr-partner-hover:hover{opacity:1!important;filter:none!important}
.sr-social-icon:hover{background:rgba(255,255,255,.25)!important}
.hero{min-height:92vh;min-height:92svh}
@media(max-width:768px){
/* Bewertungen: 3col → 1col */
.sec-bew-grid{grid-template-columns:1fr!important}
/* Fakten: bis zu 4col → 2col */
.sec-fakten [style*="grid-template-columns"]{grid-template-columns:repeat(2,1fr)!important}
/* Galerie: 3col → 2col */
.sec-galerie [style*="grid-template-columns"]{grid-template-columns:1fr 1fr!important}
/* Ablauf horizontal: Arrows verstecken, vertikal stapeln */
.sr-ablauf-h{flex-direction:column!important;gap:24px!important;align-items:center!important}
.sr-ablauf-h>div:not(.sr-ablauf-arrow){width:100%!important;max-width:320px}
.sr-ablauf-h .sr-ablauf-arrow{display:none!important}
/* Ausfuehrliche Leistungen: Foto-Grid → Stack */
.sr-leist-grid [style*="grid-template-columns:160px"]{grid-template-columns:1fr!important}
/* Kompakt Leistungen: 4col → 2col */
.sr-leist-grid[style*="repeat(4"]{grid-template-columns:repeat(2,1fr)!important}
/* Kontakt kompakt Cards: 2col → 1col */
.kontakt .kontakt-grid>div:first-child{grid-template-columns:1fr!important}
/* Team-Fokus: bis zu 4col → 2col */
.sr-team-fokus{grid-template-columns:repeat(2,1fr)!important}
/* Section-Padding verkleinern */
.sec-faq,.sec-galerie{padding:56px 0!important}
.sec-fakten,.sec-cta-block{padding:44px 0!important}
/* Leistungen + Ueber + Kontakt */
.leist,.ueber,.kontakt{padding:56px 0!important}
}
@media(max-width:640px){
.sr-foto-grid{grid-template-columns:1fr 1fr!important}
.sr-leist-grid{grid-template-columns:1fr!important}
.sr-leist-grid div p{font-size:.88rem!important;line-height:1.65!important}
.sr-leist-grid div h3{font-size:.92rem!important}
.kontakt-form-wrap{margin-bottom:24px}
/* Fakten: 2col bleibt */
.sec-fakten [style*="grid-template-columns"]{grid-template-columns:1fr 1fr!important}
/* Galerie: 2col → 1col bei ganz schmal */
.sec-galerie [style*="grid-template-columns"]{grid-template-columns:1fr!important}
}
@media(max-width:480px){
/* Fakten ganz klein: 2col bleibt (zahlen sind kurz) */
.sr-team-fokus{grid-template-columns:1fr 1fr!important}
}
</style>`;
  html = html.replace("</head>", responsiveStyle + "</head>");

  // ── OG-Image serve-time (Hero-Bild oder Fallback) ──
  const ogImage = o.url_hero || o.url_logo || "";
  html = html.replace("{{OG_IMAGE}}", ogImage);

  // ── Stil-Klasse serve-time aktualisieren (erlaubt Stilwechsel ohne Regenerierung) ──
  const currentStil = o.stil || "klassisch";
  html = html.replace(/class="stil-\w+"/g, `class="stil-${currentStil}"`);

  // ── Kontrast-Check: zu helle Farben abdunkeln (4.5:1 auf weiss) ──
  function ensureContrast(hex, minRatio) {
    if (!hex || !/^#[0-9a-fA-F]{6}$/i.test(hex)) return hex;
    minRatio = minRatio || 4.5;
    const lum = (c) => { const v = parseInt(c, 16) / 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    const L = (h) => { return 0.2126 * lum(h.slice(1, 3)) + 0.7152 * lum(h.slice(3, 5)) + 0.0722 * lum(h.slice(5, 7)); };
    const ratio = (l1, l2) => (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    let color = hex;
    for (let i = 0; i < 20; i++) {
      if (ratio(1, L(color)) >= minRatio) return color;
      const r = Math.max(0, parseInt(color.slice(1, 3), 16) - 10);
      const g = Math.max(0, parseInt(color.slice(3, 5), 16) - 10);
      const b = Math.max(0, parseInt(color.slice(5, 7), 16) - 10);
      color = "#" + [r, g, b].map(v => v.toString(16).padStart(2, "0")).join("");
    }
    return color;
  }

  // ── Stil-Farben serve-time IMMER anwenden (damit Änderungen sofort greifen) ──
  const STIL_COLORS = {
    klassisch: {p:"#094067",a:"#0369a1",bg:"#f4f7fa",s:"#d8eefe",t:"#1e293b",tm:"#475569"},
    modern:    {p:"#18181b",a:"#4f46e5",bg:"#fafafa",s:"#e4e4e7",t:"#18181b",tm:"#71717a"},
    elegant:   {p:"#020826",a:"#7a6844",bg:"#f9f4ef",s:"#eaddcf",t:"#2c2620",tm:"#6b6058"},
  };
  const stilColors = STIL_COLORS[currentStil] || STIL_COLORS.klassisch;

  // Custom-Felder ueberschreiben Stil-Defaults bei JEDEM Stil
  // Accent + Primary werden durch Kontrast-Check abgesichert (zu hell → abdunkeln)
  const safeAccent = o.custom_accent ? ensureContrast(o.custom_accent) : stilColors.a;
  const safePrimary = o.custom_color ? ensureContrast(o.custom_color, 3.0) : stilColors.p;
  const customDesign = [
    `--primary:${safePrimary}`,
    `--accent:${safeAccent}`,
    `--bg:${o.custom_bg || stilColors.bg}`,
    `--sep:${o.custom_sep || stilColors.s}`,
    `--text:${o.custom_text || stilColors.t}`,
    `--textMuted:${o.custom_text_muted || stilColors.tm}`,
    o.custom_radius && `--r:${o.custom_radius}`,
    o.custom_radius && `--rLg:${parseInt(o.custom_radius)+4}px`,
  ].filter(Boolean);

  // Font: URL importieren + font-family ueberschreiben
  const FONT_URLS = {dm_sans:"https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap",inter:"https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap",outfit:"https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap",poppins:"https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap",montserrat:"https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap",raleway:"https://fonts.googleapis.com/css2?family=Raleway:wght@400;500;600;700;800&display=swap",open_sans:"https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700;800&display=swap",lato:"https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&display=swap",roboto:"https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap",nunito:"https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap",work_sans:"https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;500;600;700;800&display=swap",manrope:"https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap",space_grotesk:"https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap",plus_jakarta:"https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap",rubik:"https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;600;700&display=swap",source_serif:"https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&display=swap",playfair:"https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&display=swap",lora:"https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&display=swap",merriweather:"https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700;900&display=swap",dm_serif:"https://fonts.googleapis.com/css2?family=DM+Serif+Display&display=swap"};
  const FONT_FAMILIES = {dm_sans:"'DM Sans',sans-serif",inter:"'Inter',sans-serif",outfit:"'Outfit',sans-serif",poppins:"'Poppins',sans-serif",montserrat:"'Montserrat',sans-serif",raleway:"'Raleway',sans-serif",open_sans:"'Open Sans',sans-serif",lato:"'Lato',sans-serif",roboto:"'Roboto',sans-serif",nunito:"'Nunito',sans-serif",work_sans:"'Work Sans',sans-serif",manrope:"'Manrope',sans-serif",space_grotesk:"'Space Grotesk',sans-serif",plus_jakarta:"'Plus Jakarta Sans',sans-serif",rubik:"'Rubik',sans-serif",source_serif:"'Source Serif 4',Georgia,serif",playfair:"'Playfair Display',Georgia,serif",lora:"'Lora',Georgia,serif",merriweather:"'Merriweather',Georgia,serif",dm_serif:"'DM Serif Display',Georgia,serif"};

  // Font-Links: <link> im <head> statt @import (parallel, non-blocking)
  const fontLinks = [];
  if (o.custom_font && FONT_URLS[o.custom_font]) {
    fontLinks.push(`<link rel="stylesheet" href="${FONT_URLS[o.custom_font]}">`);
    customDesign.push(`--font:${FONT_FAMILIES[o.custom_font]}`);
  }
  if (currentStil === "elegant") {
    fontLinks.push(`<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&display=swap">`);
  }
  if (fontLinks.length > 0) {
    html = html.replace("</head>", fontLinks.join("\n") + "\n</head>");
  }

  // Style-Override am Ende des body (damit es ALLE vorherigen :root ueberschreibt)
  const heroOverride = `.hero{background:linear-gradient(160deg,var(--primary) 0%,color-mix(in srgb,var(--primary) 72%,#000) 55%,color-mix(in srgb,var(--primary) 85%,var(--accent)) 100%)!important}` +
    `.stil-modern .hero{background:var(--primary)!important}` +
    `.stil-elegant .hero{background:linear-gradient(135deg,var(--primary) 0%,color-mix(in srgb,var(--primary) 70%,#000) 100%)!important}` +
    `#sitenav{background:var(--primary)!important}`;
  const overrideStyle = `<style>:root{${customDesign.join(";")}}${heroOverride}</style>`;
  html = html.replace("</body>", overrideStyle + "\n</body>");

  // ── Floating CTA Button (ein einziger, unten rechts) ──
  if (sv.sticky_cta !== false) {
    let floatHref = "";
    let floatIcon = "";
    let floatLabel = "";
    let floatBg = "var(--accent)";
    const telClean = (o.telefon||"").replace(/[\s\-\/()]/g, "");

    if (o.whatsapp) {
      const waNum = o.whatsapp.replace(/[\s\-\/()]/g, "").replace(/^0/, "+43");
      floatHref = `https://wa.me/${waNum.replace("+", "")}`;
      floatIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`;
      floatLabel = "WhatsApp";
      floatBg = "#25D366";
    } else if (o.buchungslink) {
      floatHref = o.buchungslink;
      floatIcon = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`;
      floatLabel = "Termin buchen";
    } else if (telClean) {
      floatHref = `tel:${telClean}`;
      floatIcon = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>`;
      floatLabel = "Anrufen";
    }

    if (floatHref) {
      const floatBtn = `<a href="${esc(floatHref)}" ${o.buchungslink && !o.whatsapp ? 'target="_blank" rel="noopener"' : ""} class="sr-float-cta" aria-label="${floatLabel}">${floatIcon}</a>`;
      const floatStyle = `<style>.sr-float-cta{position:fixed;bottom:24px;right:24px;z-index:900;width:56px;height:56px;border-radius:50%;background:${floatBg};display:flex;align-items:center;justify-content:center;box-shadow:0 4px 16px rgba(0,0,0,.18);transition:transform .2s,box-shadow .2s,opacity .3s;text-decoration:none;opacity:0;pointer-events:none}.sr-float-cta.visible{opacity:1;pointer-events:auto}.sr-float-cta:hover{transform:scale(1.1);box-shadow:0 6px 24px rgba(0,0,0,.25)}@media(max-width:768px){.sr-float-cta{bottom:20px;right:16px;width:52px;height:52px}}</style>`;
      const floatScript = `<script>(function(){var b=document.querySelector('.sr-float-cta');if(b){var h=document.querySelector('.hero');window.addEventListener('scroll',function(){b.classList.toggle('visible',window.scrollY>(h?h.offsetHeight-100:300))},{passive:true})}})();</script>`;
      html = html.replace("</head>", floatStyle + "</head>");
      html = html.replace("</body>", floatBtn + floatScript + "\n</body>");
    }
  }

  // Serve-time Cleanup: Uebrig gebliebene Placeholder entfernen
  html = html.replace(/\{\{[A-Z_]+\}\}/g, "");
  html = html.replace(/<!-- (LEISTUNGEN|TRUST|ABLAUF|BEWERTUNGEN|FAQ|GALERIE|FAKTEN|PARTNER|KONTAKT_FORM|KONTAKT_INFOS|TEAM|ABOUT_FOTOS|MAPS|FOTO_BAND|CTA_BLOCK) -->/g, "");

  return new Response(html, {
    status: 200,
    headers: {"Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-cache, no-store, must-revalidate"},
  });
}

function notFoundPage(subdomain) {
  return `<!DOCTYPE html><html lang="de"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Website nicht gefunden</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:system-ui,sans-serif;background:#f8fafc;color:#1e293b;display:flex;align-items:center;justify-content:center;min-height:100vh;padding:24px}.box{text-align:center;max-width:480px}h1{font-size:5rem;font-weight:900;color:#e2e8f0;line-height:1}h2{font-size:1.5rem;font-weight:700;margin:16px 0 8px}p{color:#64748b;line-height:1.6}</style>
</head><body><div class="box"><h1>404</h1><h2>Website nicht gefunden</h2><p>Diese Website existiert noch nicht oder wird gerade erstellt.</p></div></body></html>`;
}

function offlinePage(firmenname) {
  return `<!DOCTYPE html><html lang="de"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${firmenname} &ndash; Nicht erreichbar</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:system-ui,sans-serif;background:#f8fafc;color:#1e293b;display:flex;align-items:center;justify-content:center;min-height:100vh;padding:24px}.box{text-align:center;max-width:480px}.icon{font-size:3rem;margin-bottom:16px}h2{font-size:1.5rem;font-weight:700;margin-bottom:8px}p{color:#64748b;line-height:1.6}</style>
</head><body><div class="box"><div class="icon">&#128683;</div><h2>${firmenname}</h2><p>Diese Website ist vorübergehend nicht erreichbar.<br>Bitte versuchen Sie es später erneut.</p></div></body></html>`;
}
