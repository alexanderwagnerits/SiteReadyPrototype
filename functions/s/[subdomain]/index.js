function esc(text) {
  if (!text) return "";
  return String(text).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");
}

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
  return `<div style="display:flex;gap:12px;margin-top:16px">${socials.map(s=>`<a href="${s.url}" target="_blank" rel="noopener noreferrer" aria-label="${s.label}" class="sr-social-icon" style="display:flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:50%;background:rgba(255,255,255,.12);color:#fff;text-decoration:none;transition:background .2s">${s.icon}</a>`).join("")}</div>`;
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
    `${env.SUPABASE_URL}/rest/v1/orders?subdomain=eq.${encodeURIComponent(subdomain)}&select=*`,
    {headers: {"apikey": env.SUPABASE_SERVICE_KEY, "Authorization": `Bearer ${env.SUPABASE_SERVICE_KEY}`}}
  );
  if (!r.ok) {
    // DB-Fehler loggen
    try {
      const { createLogger } = await import("../../_lib/log.js");
      const log = createLogger(env);
      await log.error("serve", {message: `DB-Fehler ${r.status} fuer /${subdomain}`, url: `/s/${subdomain}`});
    } catch(_) {}
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

  // ── Stil + Section-Varianten lesen (frueh, damit alle Abschnitte darauf zugreifen koennen) ──
  const stilName = o.stil || "klassisch";
  const isModern = stilName === "modern";
  const isElegant = stilName === "elegant";
  const heroVariante = o.hero_variante || "standard";
  const bewertungenVariante = o.bewertungen_variante || "karten";
  const ueberVariante = o.ueber_variante || "standard";
  const kontaktVariante = o.kontakt_variante || "standard";

  // Trust-Leiste serve-time (live updates bei Feature-Aenderungen)
  if (html.includes("<!-- TRUST -->")) {
    const tIcon = (svg) => `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${svg}</svg>`;
    const trustItems = [];
    if (o.notdienst) trustItems.push({l:"24/7 Notdienst",i:tIcon(`<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>`)});
    if (o.meisterbetrieb) trustItems.push({l:"Meisterbetrieb",i:tIcon(`<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>`)});
    if (o.kostenvoranschlag) trustItems.push({l:"Kostenloser KV",i:tIcon(`<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><polyline points="9 15 11 17 15 13"/>`)});
    if (o.foerderungsberatung) trustItems.push({l:"F\u00f6rderungsberatung",i:tIcon(`<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>`)});
    if (o.erstgespraech_gratis) trustItems.push({l:"Erstgespr\u00e4ch gratis",i:tIcon(`<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>`)});
    if (o.ratenzahlung) trustItems.push({l:"Ratenzahlung",i:tIcon(`<rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>`)});
    if (o.zertifiziert) trustItems.push({l:"Zertifiziert",i:tIcon(`<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>`)});
    if (o.gutscheine) trustItems.push({l:"Gutscheine",i:tIcon(`<path d="M20 12v10H4V12"/><path d="M2 7h20v5H2z"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>`)});
    const kassenLabel = o.kassenvertrag === "alle_kassen" ? "Alle Kassen" : o.kassenvertrag === "wahlarzt" ? "Wahlarzt" : o.kassenvertrag === "privat" ? "Privat" : o.kassenvertrag === "oegk" ? "\u00d6GK" : o.kassenvertrag === "bvaeb" ? "BVAEB" : o.kassenvertrag === "svs" ? "SVS" : null;
    if (kassenLabel) trustItems.push({l:kassenLabel,i:tIcon(`<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>`)});
    if (o.barrierefrei) trustItems.push({l:"Barrierefrei",i:tIcon(`<circle cx="12" cy="4" r="2"/><path d="M12 6v6l4 4"/><path d="M8 12l-2 6h12"/>`)});
    if (o.terminvereinbarung) trustItems.push({l:"Online-Termin",i:tIcon(`<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>`)});
    if (o.kartenzahlung) trustItems.push({l:"Kartenzahlung",i:tIcon(`<rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>`)});
    if (o.parkplaetze) trustItems.push({l:"Parkpl\u00e4tze",i:tIcon(`<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/>`)});
    if (o.gastgarten) trustItems.push({l:"Gastgarten",i:tIcon(`<circle cx="12" cy="12" r="10"/><path d="M8 12l2 2 4-4"/>`)});
    if (o.takeaway) trustItems.push({l:"Take-away",i:tIcon(`<path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z"/>`)});
    if (o.lieferservice) trustItems.push({l:"Lieferservice",i:tIcon(`<rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>`)});
    if (trustItems.length > 0) {
      const items = trustItems.map(t => `<div class="trust-item">${t.i}<span>${t.l}</span></div>`).join("");
      html = html.replace("<!-- TRUST -->", `<div class="trust"><div class="w"><div class="trust-items">${items}</div></div></div>`);
    } else {
      html = html.replace("<!-- TRUST -->", "");
    }
  }

  // Logo in Nav injizieren (ersetzt Firmenname-Text durch <img>)
  if (o.url_logo) {
    html = html.replace(
      /(<a[^>]*id="site-nav-logo"[^>]*>)[\s\S]*?(<\/a>)/,
      `$1<img src="${o.url_logo}" alt="Logo" style="height:64px;width:auto;object-fit:contain;display:block;max-width:240px">$2`
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
      const annText = validAnn.map(a => a.text).join(" \u00b7 ");
      const annHtml = `<div id="sr-announcements" style="display:inline-flex;align-items:center;background:var(--accent,#2563eb);color:#fff;padding:9px 20px;border-radius:100px;font-size:.8rem;font-weight:600;line-height:1.4;margin-bottom:20px;box-shadow:0 2px 12px rgba(0,0,0,.2)">` +
        `<span style="opacity:.9">${annText}</span>` +
        `</div>`;
      // Vor die Badges im Hero einfuegen
      if (html.includes('<div class="hero-badges">')) {
        html = html.replace('<div class="hero-badges">', annHtml + '\n<div class="hero-badges">');
      } else {
        html = html.replace(/<body[^>]*>/i, m => m + "\n" + annHtml);
      }
    }
  }

  // Hero-Bild + Variante: standard (full/split je nach hero_layout), split (immer Bild rechts), minimal (kein Bild)
  html = html.replace(/<section(?![^>]*id=)/i, '<section id="sr-hero"');
  const heroLayout = o.hero_layout || "split";

  // Stil-spezifische Werte fuer Hero-Varianten
  const heroImgR = isModern ? "16px" : isElegant ? "2px" : "var(--rLg,8px)";
  const heroMinH1Weight = isElegant ? "300" : "800";

  if (heroVariante === "minimal") {
    // Minimal: Kein Bild, zentriert, reduziert
    const minimalStyle = `<style>
.hero{min-height:70vh!important;min-height:70svh!important;justify-content:center;text-align:center}
.hero-inner{display:flex!important;flex-direction:column;align-items:center}
.hero h1{font-size:clamp(2.5rem,6vw,4rem)!important;max-width:100%;font-weight:${heroMinH1Weight}!important}
.hero-desc{text-align:center;max-width:480px}
.hero-btns{justify-content:center}
.hero-sub{margin-bottom:16px}
.hero-accent-line{display:block!important;width:48px;height:${isElegant ? "1px" : "2px"};background:var(--accent);margin:16px auto 24px;opacity:.6}
</style>`;
    html = html.replace("</head>", minimalStyle + "</head>");
  } else if (heroVariante === "split" || (heroVariante === "standard" && heroLayout !== "full")) {
    // Split: Bild rechts neben dem Text
    if (o.url_hero) {
      const heroStyle = `<style>` +
        `.hero-split-img{display:none}` +
        `@media(min-width:900px){` +
        `.hero-inner{display:grid!important;grid-template-columns:1fr 1fr;gap:48px;align-items:center;padding-top:80px!important;padding-bottom:80px!important}` +
        `.hero-split-text{grid-column:1}` +
        `.hero-split-img{display:block!important;grid-column:2;border-radius:${heroImgR};overflow:hidden}` +
        `.hero-split-img img{width:100%;display:block;border-radius:${heroImgR}}` +
        `.hero h1{font-size:clamp(2.2rem,4vw,3.2rem)!important}` +
        `}</style>`;
      // Alle Text-Kinder von hero-inner in einen Wrapper wrappen
      html = html.replace(
        /(<div class="hero-inner">)([\s\S]*?)(<\/div>\s*<\/section>)/,
        `$1<div class="hero-split-text">$2</div><div class="hero-split-img"><img src="${o.url_hero}" alt="" style="width:100%;display:block"/></div>$3`
      );
      html = html.replace('</head>', heroStyle + '</head>');
    }
  } else if (o.url_hero) {
    // Standard + full: Hintergrundbild
    const heroStyle = `<style>#sr-hero,#hero,section.hero{background:linear-gradient(rgba(0,0,0,.62),rgba(0,0,0,.50)),url('${o.url_hero}') center/cover no-repeat!important}` +
      `#sr-hero h1,#hero h1{text-shadow:0 3px 24px rgba(0,0,0,.6)}` +
      `#sr-hero .hero-sub,#sr-hero .hero-desc,#sr-hero .hero-badge{text-shadow:0 1px 10px rgba(0,0,0,.5)}` +
      `#sr-hero .hero-btns .btn{text-shadow:none}</style>`;
    html = html.replace('</head>', heroStyle + '</head>');
  }

  // Maps-Placeholder serve-time ersetzen (falls Claude einen Platzhalter generiert hat)
  if (o.adresse || o.ort) {
    const mapsQuery = encodeURIComponent([o.adresse, o.plz, o.ort].filter(Boolean).join(", ") + ", \u00d6sterreich");
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

  // ── Ueber-uns-Variante serve-time anwenden ──
  if (ueberVariante === "story") {
    // Story: Gruendergeschichte mit Zitat-Stil
    const hasRightCol = teamMembers.length > 0 || [o.url_about1,o.url_about2,o.url_about3,o.url_about4].some(Boolean);
    const storyStyle = `<style>
${hasRightCol ? `.ueber-grid{grid-template-columns:1fr 1fr!important;gap:48px!important;align-items:center}` : `.ueber-grid{display:block!important}`}
.ueber .ueber-vorteile{display:none}
.ueber-text{font-size:1.05rem!important;opacity:.8!important;line-height:1.85!important}
</style>`;
    html = html.replace("</head>", storyStyle + "</head>");
  } else if (ueberVariante === "team-fokus" && teamMembers.length > 0) {
    // Nur wenn Team-Members vorhanden, sonst bleibt Standard
    // Team-Fokus: Team prominent oben, Text kompakt zentriert
    const teamFokusAvatarR = isModern ? "50%" : isElegant ? "4px" : "50%";
    const teamFokusNameW = isElegant ? "600" : "700";
    const teamGrid = teamMembers.slice(0, 6).map(m => {
      const hasImg = !!m.foto;
      const avatar = hasImg
        ? `<img src="${m.foto}" alt="${m.name}" style="width:72px;height:72px;border-radius:${teamFokusAvatarR};object-fit:cover;border:3px solid rgba(255,255,255,.12)">`
        : `<div style="width:72px;height:72px;border-radius:${teamFokusAvatarR};background:rgba(255,255,255,.1);display:flex;align-items:center;justify-content:center;border:3px solid rgba(255,255,255,.08)"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.5)" stroke-width="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>`;
      return `<div style="text-align:center"><div style="margin:0 auto 8px">${avatar}</div><div style="font-size:.85rem;font-weight:${teamFokusNameW};color:#fff">${m.name}</div>${m.rolle ? `<div style="font-size:.75rem;opacity:.5">${m.rolle}</div>` : ""}</div>`;
    }).join("");
    const teamCols = Math.min(teamMembers.length, 4);
    const teamFokusStyle = `<style>
.ueber{text-align:center}
.ueber-grid{display:block!important}
.ueber-text{max-width:520px;margin:0 auto 32px!important;font-size:1rem!important}
.ueber .ueber-vorteile{display:flex;justify-content:center;gap:24px;flex-wrap:wrap}
</style>`;
    html = html.replace("</head>", teamFokusStyle + "</head>");
    // Team-Grid vor den Vorteilen einfuegen
    const teamGridHtml = `<div class="sr-team-fokus" style="display:grid;grid-template-columns:repeat(${teamCols},1fr);gap:20px;max-width:480px;margin:0 auto 32px">${teamGrid}</div>`;
    html = html.replace("{{VORTEILE}}", teamGridHtml + "{{VORTEILE}}");
  }
  // Standard: keine Aenderung noetig

  // ── Layout-Feld lesen (bestimmt Section-Varianten) ──
  const layout = o.layout || "standard";

  // Stil-spezifische Label-Variante
  const sectionLabel = (text) => {
    if (isElegant) return `<div style="font-size:.65rem;font-weight:500;letter-spacing:.16em;text-transform:uppercase;color:var(--accent);margin-bottom:14px">${text}</div>`;
    if (isModern) return `<div style="display:inline-flex;align-items:center;font-size:.7rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--accent);margin-bottom:14px;background:color-mix(in srgb,var(--accent) 8%,transparent);padding:6px 14px;border-radius:100px">${text}</div>`;
    return `<div style="display:inline-flex;align-items:center;font-size:.68rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--accent);margin-bottom:14px;background:color-mix(in srgb,var(--accent) 10%,transparent);padding:5px 14px;border-radius:100px;border:1px solid color-mix(in srgb,var(--accent) 20%,transparent)">${text}</div>`;
  };
  const sectionH2 = (text) => {
    if (isElegant) return `<h2 style="font-size:clamp(1.3rem,3vw,1.8rem);font-weight:300;color:var(--primary);letter-spacing:-.02em">${text}</h2>`;
    return `<h2 style="font-size:clamp(1.4rem,3vw,2rem);font-weight:800;color:var(--primary);letter-spacing:-.03em">${text}</h2>`;
  };

  // Ablauf-Section — "So laeuft es ab" zwischen Leistungen und Ueber uns
  const ablaufSteps = Array.isArray(o.ablauf_schritte) ? o.ablauf_schritte.filter(s => s && s.titel) : [];
  const showAblauf = layout !== "kompakt" && ablaufSteps.length >= 2;
  if (showAblauf && html.includes("<!-- ABLAUF -->")) {
    let ablaufContent;
    // Stil-spezifische Varianten
    const circleR = isModern ? "50%" : isElegant ? "2px" : "50%";
    const circleSize = isElegant ? "28px" : "40px";
    const circleFontSize = isElegant ? ".72rem" : ".92rem";
    const circleFontWeight = isElegant ? "500" : "800";
    const titleWeight = isElegant ? "600" : "700";

    if (layout === "ausfuehrlich") {
      // Vertical Timeline
      const vSteps = ablaufSteps.slice(0, 5).map((s, i) =>
        `<div style="margin-bottom:28px;position:relative;padding-left:48px">` +
        `<div style="position:absolute;left:0;top:0;width:32px;height:32px;border-radius:${circleR};background:var(--accent);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:${circleFontWeight};font-size:.82rem;z-index:1">${i + 1}</div>` +
        `<div style="font-weight:${titleWeight};font-size:.95rem;color:var(--primary);margin-bottom:4px">${s.titel}</div>` +
        (s.text ? `<div style="font-size:.85rem;color:var(--textMuted,#64748b);line-height:1.7">${s.text}</div>` : "") +
        `</div>`
      ).join("");
      ablaufContent = `<div style="position:relative;max-width:560px"><div style="position:absolute;left:15px;top:0;bottom:0;width:${isElegant ? "1px" : "2px"};background:var(--sep,#e2e8f0)"></div>${vSteps}</div>`;
    } else {
      // Standard: Horizontal
      const hSteps = ablaufSteps.slice(0, 5).map((s, i) =>
        `<div style="flex:1;text-align:center;min-width:140px">` +
        `<div style="width:${circleSize};height:${circleSize};border-radius:${circleR};background:var(--accent);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:${circleFontWeight};font-size:${circleFontSize};margin:0 auto 12px">${i + 1}</div>` +
        `<div style="font-weight:${titleWeight};font-size:.95rem;color:var(--primary);margin-bottom:6px">${s.titel}</div>` +
        (s.text ? `<div style="font-size:.82rem;color:var(--textMuted,#64748b);line-height:1.6">${s.text}</div>` : "") +
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

    if (bewertungenVariante === "highlight") {
      // Highlight: Erste Bewertung gross, Rest als kleine Karten
      const main = bewertungen[0];
      const rest = bewertungen.slice(1, 5);
      const mainStars = makeStars(main);
      const highlight = `<div style="background:var(--primary);color:#fff;border-radius:${bewCardR};padding:36px;margin-bottom:20px;text-align:center">` +
        `<div style="font-size:2rem;margin-bottom:12px;opacity:.3">\u201c</div>` +
        `<div style="font-size:1rem;font-weight:${isElegant ? "400" : "500"};line-height:1.8;max-width:520px;margin:0 auto;opacity:.9">${esc(main.text)}</div>` +
        `<div style="margin-top:16px;font-size:.82rem;font-weight:${bewNameWeight};opacity:.7">${esc(main.name) || "Kunde"}</div>` +
        (mainStars ? `<div style="margin-top:8px;display:flex;justify-content:center;gap:2px">${mainStars}</div>` : "") +
        `</div>`;
      const restCards = rest.map(b => {
        const stars = makeStars(b);
        return `<div style="background:#fff;${bewCardBorder};border-radius:${bewCardR};padding:20px;display:flex;flex-direction:column;gap:8px">` +
          (stars ? `<div style="display:flex;gap:2px">${stars}</div>` : "") +
          `<p style="font-size:.88rem;color:var(--text);line-height:1.7;margin:0;flex:1;font-style:italic">\u201e${esc(b.text)}\u201c</p>` +
          `<div style="font-size:.78rem;font-weight:${bewNameWeight};color:var(--primary)">${esc(b.name) || "Kunde"}</div></div>`;
      }).join("");
      const restCols = rest.length <= 2 ? `repeat(${rest.length},1fr)` : "repeat(3,1fr)";
      bewContent = highlight + (rest.length > 0 ? `<div class="sec-bew-grid" style="display:grid;grid-template-columns:${restCols};gap:16px">${restCards}</div>` : "");

    } else if (bewertungenVariante === "liste") {
      // Liste: Kompakt untereinander mit Avatar-Initialen
      const listItems = bewertungen.slice(0, 6).map(b => {
        const initials = esc((b.name || "K").split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase());
        const stars = makeStars(b);
        return `<div style="display:grid;grid-template-columns:auto 1fr;gap:16px;padding:20px 0;border-bottom:1px solid var(--sep);align-items:start">` +
          `<div style="width:42px;height:42px;border-radius:${isElegant ? "2px" : "50%"};background:var(--primary);color:#fff;display:flex;align-items:center;justify-content:center;font-size:.72rem;font-weight:${bewNameWeight};flex-shrink:0">${initials}</div>` +
          `<div>` +
          `<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">` +
          `<span style="font-size:.85rem;font-weight:${bewNameWeight};color:var(--primary)">${esc(b.name) || "Kunde"}</span>` +
          (stars ? `<span style="display:flex;gap:1px">${stars}</span>` : "") +
          `</div>` +
          `<div style="font-size:.88rem;color:var(--textMuted);line-height:1.7;font-style:italic">\u201e${esc(b.text)}\u201c</div>` +
          `</div></div>`;
      }).join("");
      bewContent = `<div style="max-width:640px">${listItems}</div>`;

    } else {
      // Karten (Standard): Grid nebeneinander
      const cards = bewertungen.slice(0, 6).map(b => {
        const stars = makeStars(b);
        return `<div style="background:#fff;${bewCardBorder};border-radius:${bewCardR};padding:24px;display:flex;flex-direction:column;gap:12px">` +
          (stars ? `<div style="display:flex;gap:2px">${stars}</div>` : "") +
          `<p style="font-size:.92rem;color:var(--text);line-height:1.7;margin:0;flex:1">\u201e${esc(b.text)}\u201c</p>` +
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
    html = html.replace("<!-- KONTAKT_INFOS -->", `<div style="margin-top:32px;padding-top:28px;border-top:1px solid var(--sep)">${infoHtml}</div>`);
  } else {
    html = html.replace("<!-- KONTAKT_INFOS -->", "");
  }

  // ── Kontakt-Variante serve-time anwenden ──
  const kontaktCardR = isModern ? "16px" : isElegant ? "2px" : "var(--rLg,8px)";
  const kontaktCardBorder = isModern ? "border:none;box-shadow:0 2px 12px rgba(0,0,0,.06)" : "border:1px solid var(--sep)";
  if (kontaktVariante === "karte-gross") {
    // Karte-Gross: Karte oben volle Breite, dann Info + Formular
    const kgStyle = `<style>
.kontakt-grid{display:flex!important;flex-direction:column-reverse;gap:24px}
.kontakt-grid>div:last-child iframe{height:240px!important;border-radius:${kontaktCardR}}
@media(min-width:900px){.kontakt-grid{gap:32px}}
</style>`;
    html = html.replace("</head>", kgStyle + "</head>");
  } else if (kontaktVariante === "kompakt") {
    // Kompakt: Alles als Cards, kein Formular
    const kompaktStyle = `<style>
.kontakt-grid{display:block!important}
.kontakt .kontakt-grid>div:first-child{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.kontakt .kontakt-grid>div:first-child>.kontakt-item{background:#fff;${kontaktCardBorder};border-radius:${kontaktCardR};padding:20px;text-align:center}
.kontakt .kontakt-grid>div:first-child>.kontakt-item .kontakt-item-label{margin-bottom:6px}
.kontakt .kontakt-form-wrap{display:none}
.kontakt h2{text-align:center;margin-bottom:24px}
</style>`;
    html = html.replace("</head>", kompaktStyle + "</head>");
  }
  // Standard: keine Aenderung noetig

  // Legacy: alte Platzhalter entfernen falls noch vorhanden
  html = html.replace(/<!-- FOTO_BAND -->/g, "");

  // ── Neue Sections serve-time (Layout-abhaengig) ──

  // CTA-Zwischenblock — Auflockerer zwischen Leistungen und Ablauf
  if (layout === "ausfuehrlich" && html.includes("<!-- CTA_BLOCK -->")) {
    const ctaBtnR = isModern ? "100px" : "var(--r)";
    const ctaBtnShadow = isModern ? ";box-shadow:0 4px 16px rgba(0,0,0,.15)" : "";
    const ctaH2Weight = isElegant ? "300" : "800";
    const ctaPOpacity = isElegant ? ".5" : ".7";
    const ctaBlock = `<section class="sec-cta-block sr-fade" style="padding:80px 0;background:var(--accent);color:#fff;text-align:center"><div class="w"><h2 style="font-size:clamp(1.3rem,3vw,1.8rem);font-weight:${ctaH2Weight};margin-bottom:8px;color:#fff">Bereit für Ihr Projekt?</h2><p style="font-size:.9rem;opacity:${ctaPOpacity};margin-bottom:24px">Wir beraten Sie gerne \u2014 kostenlos und unverbindlich.</p><a href="#kontakt" class="btn" style="background:#fff;color:var(--accent);font-weight:700;border-radius:${ctaBtnR};padding:14px 36px;font-size:.95rem;text-decoration:none;display:inline-block${ctaBtnShadow}">Jetzt Kontakt aufnehmen</a></div></section>`;
    html = html.replace("<!-- CTA_BLOCK -->", ctaBlock);
  } else {
    html = html.replace("<!-- CTA_BLOCK -->", "");
  }

  // FAQ — Haeufig gestellte Fragen
  const faqItems = Array.isArray(o.faq) ? o.faq.filter(f => f && f.frage && f.antwort) : [];
  const showFaq = (o.sections_visible && o.sections_visible.faq) || (layout === "ausfuehrlich" && faqItems.length > 0);
  if (showFaq && faqItems.length > 0 && html.includes("<!-- FAQ -->")) {
    const items = faqItems.slice(0, 8).map((f, i) =>
      `<div style="border-bottom:1px solid var(--sep)">` +
      `<button onclick="var a=this.nextElementSibling;var open=a.style.maxHeight!=='0px';a.style.maxHeight=open?'0px':a.scrollHeight+'px';a.style.paddingBottom=open?'0':'16px';this.querySelector('span:last-child').textContent=open?'+':'\\u2212'" style="width:100%;display:flex;justify-content:space-between;align-items:center;padding:18px 0;background:none;border:none;cursor:pointer;font-family:var(--font);font-size:.95rem;font-weight:700;color:var(--primary);text-align:left;line-height:1.5"><span style="flex:1">${f.frage}</span><span style="font-size:1.2rem;color:var(--accent);font-weight:300;margin-left:16px;flex-shrink:0">+</span></button>` +
      `<div style="max-height:0;overflow:hidden;transition:max-height .3s ease,padding-bottom .3s ease;padding-bottom:0">` +
      `<p style="font-size:.88rem;color:var(--textMuted);line-height:1.8;margin:0;padding-right:32px">${f.antwort || ""}</p>` +
      `</div></div>`
    ).join("");
    const faqToggleWeight = isElegant ? "600" : "700";
    const faqToggleSize = isElegant ? ".9rem" : ".95rem";
    const section = `<section class="sec-faq sr-fade" style="padding:100px 0;background:#fff"><div class="w"><div style="margin-bottom:40px">${sectionLabel("FAQ")}${sectionH2("Häufig gestellte Fragen")}</div><div style="max-width:720px">${items.replace(/font-weight:700;/g, `font-weight:${faqToggleWeight};`).replace(/font-size:\.95rem;/g, `font-size:${faqToggleSize};`)}</div></div></section>`;
    html = html.replace("<!-- FAQ -->", section);
  } else {
    html = html.replace("<!-- FAQ -->", "");
  }

  // Galerie — Foto-Grid mit Lightbox
  const galerieItems = Array.isArray(o.galerie) ? o.galerie.filter(g => g && g.url) : [];
  const showGalerie = (o.sections_visible && o.sections_visible.galerie) || galerieItems.length > 0;
  if (showGalerie && galerieItems.length > 0 && html.includes("<!-- GALERIE -->")) {
    const cols = galerieItems.length <= 2 ? "1fr 1fr" : galerieItems.length <= 4 ? "repeat(2,1fr)" : "repeat(3,1fr)";
    const photos = galerieItems.slice(0, 12).map(g =>
      `<div style="overflow:hidden;border-radius:var(--rLg);line-height:0;cursor:zoom-in;aspect-ratio:4/3">` +
      `<img class="sr-zoom sr-img-hover" src="${g.url}" alt="${g.caption || ""}" loading="lazy" style="width:100%;height:100%;object-fit:cover;display:block;transition:transform .3s">` +
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
  const showFakten = (o.sections_visible && o.sections_visible.fakten) || (layout === "ausfuehrlich" && faktenItems.length > 0);
  if (showFakten && faktenItems.length >= 2 && html.includes("<!-- FAKTEN -->")) {
    const cols = `repeat(${Math.min(faktenItems.length, 4)},1fr)`;
    const faktenFontWeight = isElegant ? "300" : "800";
    const faktenFontSize = isElegant ? "clamp(1.4rem,3.5vw,2rem)" : "clamp(1.6rem,4vw,2.4rem)";
    const items = faktenItems.slice(0, 4).map(f =>
      `<div style="text-align:center;padding:20px"><div style="font-size:${faktenFontSize};font-weight:${faktenFontWeight};color:var(--accent);letter-spacing:-.03em;line-height:1">${f.zahl}</div><div style="font-size:.85rem;color:var(--textMuted);margin-top:6px">${f.label}</div></div>`
    ).join("");
    const section = `<section class="sec-fakten sr-fade" style="padding:80px 0;background:var(--bg)"><div class="w"><div style="display:grid;grid-template-columns:${cols};gap:16px">${items}</div></div></section>`;
    html = html.replace("<!-- FAKTEN -->", section);
  } else {
    html = html.replace("<!-- FAKTEN -->", "");
  }

  // Partner & Zertifikate — Logo-Leiste
  const partnerItems = Array.isArray(o.partner) ? o.partner.filter(p => p && (p.url_logo || p.name)) : [];
  const showPartner = (o.sections_visible && o.sections_visible.partner) || partnerItems.length > 0;
  if (showPartner && partnerItems.length > 0 && html.includes("<!-- PARTNER -->")) {
    const logos = partnerItems.slice(0, 8).map(p => {
      if (p.url_logo) {
        return `<div style="display:flex;align-items:center;justify-content:center;padding:12px 20px"><img src="${p.url_logo}" alt="${p.name || "Partner"}" loading="lazy" style="height:40px;width:auto;object-fit:contain;opacity:.7;filter:grayscale(30%);transition:opacity .2s,filter .2s" class="sr-partner-hover"></div>`;
      }
      return `<div style="display:flex;align-items:center;justify-content:center;padding:12px 24px;background:var(--bg);border:1px solid var(--sep);border-radius:var(--r);font-size:.75rem;font-weight:600;color:var(--textMuted)">${p.name}</div>`;
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
        `<div><label>Datum</label><input type="date"></div>` +
        `<div><label>Uhrzeit</label><input type="time"></div>` +
        `<div><label>Personen</label><input type="number" min="1" max="50" placeholder="2"></div>` +
        `</div>`;
      msgLabel = "Anmerkungen";
      msgPlaceholder = "z.B. Allergien, Kinderhochstuhl, besondere Wünsche...";
      btnText = "Reservierung anfragen";
      okText = "Wir haben Ihre Reservierungsanfrage erhalten und bestätigen diese so rasch wie möglich.";
    } else if (termin) {
      headline = "Termin anfragen";
      extraFields =
        `<div class="k-form-row k-form-row-2">` +
        `<div><label>Wunschtermin</label><input type="date"></div>` +
        `<div><label>Bevorzugte Uhrzeit</label><select style="width:100%;padding:11px 14px;border:1.5px solid var(--sep);border-radius:var(--r);font-size:.88rem;font-family:var(--font);background:#fff;color:var(--text);box-sizing:border-box;min-height:44px">` +
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
        `<div class="k-form-field"><label>Adresse / Einsatzort</label><input type="text" placeholder="Straße, PLZ Ort"></div>`;
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
      `<div><label>Name *</label><input required aria-required="true" type="text" placeholder="Ihr Name"></div>` +
      `<div><label>E-Mail *</label><input required aria-required="true" type="email" placeholder="ihre@email.at"></div>` +
      `<div><label>Telefon</label><input type="tel" placeholder="+43 ..."></div>` +
      `</div>` +
      extraFields +
      `<div class="k-form-field"><label>${msgLabel} *</label><textarea required aria-required="true" rows="${msgRows}" placeholder="${msgPlaceholder}"></textarea></div>` +
      `<button type="submit">${btnText}</button>` +
      `</form></div>` +
      `<div id="sr-form-ok" class="k-form-ok">` +
      `<div style="font-size:1.8rem;color:#16a34a">&#10003;</div>` +
      `<h4>Vielen Dank!</h4>` +
      `<p>${okText}</p>` +
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
      klassisch:  "border:1px solid var(--sep,#e2e8f0);background:#fff;border-radius:8px;box-shadow:0 2px 12px rgba(0,0,0,.06);transition:transform .2s ease,box-shadow .2s ease;overflow:hidden",
      modern:     "border-radius:16px;box-shadow:0 4px 24px rgba(0,0,0,.07);background:#fff;transition:transform .2s ease,box-shadow .2s ease;overflow:hidden",
      elegant:    "border:1px solid var(--sep,#e7e5e4);background:#fff;border-radius:2px;transition:transform .2s ease,box-shadow .2s ease;overflow:hidden",
      custom:     "border:1px solid var(--sep,#e5e7eb);background:#fff;border-radius:12px;box-shadow:0 2px 12px rgba(0,0,0,.06);transition:transform .2s ease,box-shadow .2s ease;overflow:hidden",
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
        (desc ? `<p style="color:var(--textMuted,#64748b);margin:0;font-size:.95rem;line-height:1.7">${desc}</p>` : `<p style="color:var(--textMuted,#64748b);margin:0;font-size:.95rem;line-height:1.7;opacity:.6">Professionelle Leistung f\u00fcr Ihre Bed\u00fcrfnisse.</p>`) +
        (preis ? `<div style="margin-top:14px;padding-top:12px;border-top:1px solid rgba(0,0,0,.06);font-size:.92rem;font-weight:700;color:var(--accent,#6366f1)">${preis}</div>` : "") +
        `</div></div>`;
    }).join("");
    const n = leistungenArr.length;
    const useCompact = layout === "kompakt" && n > 7;

    let grid;
    if (useCompact) {
      // Kompakt: Nur Icon + Name, kein Text
      const compactCards = leistungenArr.map((l, i) => {
        const lCap = esc(l.charAt(0).toUpperCase() + l.slice(1));
        return `<div class="sr-fade sr-card-hover" style="${cardStyle};text-align:center;padding:16px">` +
          `<div style="${iconStyle};margin:0 auto 8px">${checkIcon}</div>` +
          `<div style="font-size:.85rem;font-weight:700;color:var(--primary)">${lCap}</div>` +
          `</div>`;
      }).join("");
      grid = `<div class="sr-leist-grid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px">${compactCards}</div>`;
    } else if (layout === "ausfuehrlich") {
      // Ausfuehrlich: Liste mit voller Breite
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
.sr-card-hover{transition:transform .25s cubic-bezier(.22,1,.36,1),box-shadow .25s cubic-bezier(.22,1,.36,1)}
.sr-card-hover:hover{transform:translateY(-3px);box-shadow:0 8px 32px rgba(0,0,0,.10)}
.sr-img-hover{transition:transform .3s}
.sr-img-hover:hover{transform:scale(1.03)}
.sr-partner-hover{transition:opacity .2s,filter .2s}
.sr-partner-hover:hover{opacity:1!important;filter:none!important}
.sr-social-icon:hover{background:rgba(255,255,255,.25)!important}
.hero{min-height:100vh;min-height:100svh}
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
.sec-faq,.sec-galerie{padding:64px 0!important}
.sec-fakten,.sec-cta-block{padding:48px 0!important}
}
@media(max-width:640px){
.hero{justify-content:center}
.hero-inner{padding-top:24px!important;padding-bottom:24px!important}
.sr-foto-grid{grid-template-columns:1fr 1fr!important}
.sr-leist-grid{grid-template-columns:1fr!important}
.sr-leist-grid div p{font-size:.85rem!important;line-height:1.65!important}
.sr-leist-grid div h3{font-size:.92rem!important}
.kontakt-form-wrap{margin-bottom:24px}
/* Fakten: 2col → 1col bei ganz schmal */
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
  html = html.replace(/class="stil-\w+"/, `class="stil-${currentStil}"`);

  // ── Stil-Farben serve-time IMMER anwenden (damit Änderungen sofort greifen) ──
  const STIL_COLORS = {
    klassisch: {p:"#094067",a:"#0369a1",bg:"#fffffe",s:"#d8eefe",t:"#094067",tm:"#5f6c7b"},
    modern:    {p:"#18181b",a:"#4f46e5",bg:"#fafafa",s:"#e4e4e7",t:"#18181b",tm:"#71717a"},
    elegant:   {p:"#020826",a:"#7a6844",bg:"#f9f4ef",s:"#eaddcf",t:"#020826",tm:"#716040"},
  };
  const stilColors = STIL_COLORS[currentStil] || STIL_COLORS.klassisch;

  // Custom-Felder ueberschreiben Stil-Defaults (User hat Vorrang)
  const customDesign = [
    `--primary:${o.custom_color || stilColors.p}`,
    `--accent:${o.custom_accent || stilColors.a}`,
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

  let fontImport = "";
  if (o.custom_font && FONT_URLS[o.custom_font]) {
    fontImport = `@import url('${FONT_URLS[o.custom_font]}');`;
    customDesign.push(`--font:${FONT_FAMILIES[o.custom_font]}`);
  }

  const overrideStyle = `<style>${fontImport}:root{${customDesign.join(";")}}</style>`;
  html = html.replace("</head>", overrideStyle + "</head>");

  // ── WhatsApp Floating Button ──
  if (o.whatsapp) {
    const waNum = o.whatsapp.replace(/[\s\-\/()]/g, "").replace(/^0/, "+43");
    const waLink = `https://wa.me/${waNum.replace("+", "")}`;
    const waBtn = `<a href="${waLink}" target="_blank" rel="noopener" aria-label="WhatsApp" style="position:fixed;bottom:24px;right:24px;z-index:900;width:56px;height:56px;border-radius:50%;background:#25D366;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 16px rgba(0,0,0,.18);transition:transform .2s,box-shadow .2s;text-decoration:none" onmouseover="this.style.transform='scale(1.1)';this.style.boxShadow='0 6px 24px rgba(0,0,0,.25)'" onmouseout="this.style.transform='scale(1)';this.style.boxShadow='0 4px 16px rgba(0,0,0,.18)'"><svg width="28" height="28" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg></a>`;
    html = html.replace("</body>", waBtn + "\n</body>");
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
</head><body><div class="box"><div class="icon">&#128683;</div><h2>${firmenname}</h2><p>Diese Website ist vor\u00fcbergehend nicht erreichbar.<br>Bitte versuchen Sie es sp\u00e4ter erneut.</p></div></body></html>`;
}
