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
    `${env.SUPABASE_URL}/rest/v1/orders?subdomain=eq.${encodeURIComponent(subdomain)}&select=*`,
    {headers: {"apikey": env.SUPABASE_SERVICE_KEY, "Authorization": `Bearer ${env.SUPABASE_SERVICE_KEY}`}}
  );
  if (!r.ok) return new Response("Fehler beim Laden", {status: 502});

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

  // Logo in Nav injizieren (ersetzt Firmenname-Text durch <img>)
  if (o.url_logo) {
    html = html.replace(
      /(<a[^>]*id="site-nav-logo"[^>]*>)[^<]*(<\/a>)/,
      `$1<img src="${o.url_logo}" alt="Logo" style="height:38px;width:auto;object-fit:contain;display:block;max-width:160px">$2`
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

  // Hero-Bild: Layout "full" (Hintergrund) oder "split" (Bild rechts)
  html = html.replace(/<section(?![^>]*id=)/i, '<section id="sr-hero"');
  const heroLayout = o.hero_layout || "split";
  if (o.url_hero) {
    if (heroLayout === "full") {
      const heroStyle = `<style>#sr-hero,#hero,section.hero{background:linear-gradient(rgba(0,0,0,.62),rgba(0,0,0,.50)),url('${o.url_hero}') center/cover no-repeat!important}` +
        `#sr-hero h1,#hero h1{text-shadow:0 3px 24px rgba(0,0,0,.6)}` +
        `#sr-hero .hero-sub,#sr-hero .hero-desc,#sr-hero .hero-badge{text-shadow:0 1px 10px rgba(0,0,0,.5)}` +
        `#sr-hero .hero-btns .btn{text-shadow:none}</style>`;
      html = html.replace('</head>', heroStyle + '</head>');
    } else {
      // Split: Bild rechts neben dem Text
      const heroImg = `<div class="hero-img" style="display:none"><img src="${o.url_hero}" alt="" style="width:100%;height:100%;object-fit:cover;object-position:center;display:block;border-radius:var(--rLg,8px)"/></div>`;
      const heroStyle = `<style>` +
        `@media(min-width:900px){` +
        `.hero-inner{display:grid!important;grid-template-columns:1fr 1fr;gap:40px;align-items:start}` +
        `.hero-badges,.hero h1,.hero-sub,.hero-desc,.hero-btns{grid-column:1}` +
        `.hero-img{display:block!important;grid-column:2;grid-row:2/span 9;aspect-ratio:4/3;overflow:hidden;border-radius:var(--rLg,8px)}` +
        `}</style>`;
      // Inject image at end of hero-inner
      html = html.replace('</div>\n</section>', heroImg + '</div>\n</section>');
      html = html.replace('</head>', heroStyle + '</head>');
    }
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

  // Leistungen-Fotos (max 4) — unter den Leistungs-Cards
  const leistFotos = [o.url_leist1, o.url_leist2, o.url_leist3, o.url_leist4].filter(Boolean);
  if (leistFotos.length > 0 && html.includes("<!-- LEIST_FOTOS -->")) {
    const items = leistFotos.map(url =>
      `<div style="overflow:hidden;border-radius:var(--rLg,8px);line-height:0;cursor:zoom-in">` +
      `<img class="sr-zoom" src="${url}" alt="" loading="lazy" style="width:100%;height:100%;object-fit:cover;display:block;aspect-ratio:4/3;transition:transform .3s" onmouseover="this.style.transform='scale(1.03)'" onmouseout="this.style.transform='none'">` +
      `</div>`
    ).join("");
    const cols = leistFotos.length <= 2 ? "1fr 1fr" : `repeat(${leistFotos.length},1fr)`;
    const grid = `<div class="sr-foto-grid" style="display:grid;grid-template-columns:${cols};gap:14px;margin-top:48px">${items}</div>`;
    html = html.replace("<!-- LEIST_FOTOS -->", grid);
  } else {
    html = html.replace("<!-- LEIST_FOTOS -->", "");
  }

  // Über-uns-Fotos (max 4) — unter dem Text in der dunklen Sektion
  const aboutFotos = [o.url_about1, o.url_about2, o.url_about3, o.url_about4].filter(Boolean);
  if (aboutFotos.length > 0 && html.includes("<!-- ABOUT_FOTOS -->")) {
    const items = aboutFotos.map(url =>
      `<div style="overflow:hidden;border-radius:var(--r,4px);line-height:0;cursor:zoom-in">` +
      `<img class="sr-zoom" src="${url}" alt="" loading="lazy" style="width:100%;height:100%;object-fit:cover;display:block;aspect-ratio:4/3;transition:transform .3s" onmouseover="this.style.transform='scale(1.03)'" onmouseout="this.style.transform='none'">` +
      `</div>`
    ).join("");
    const cols = aboutFotos.length <= 2 ? "1fr 1fr" : `repeat(${aboutFotos.length},1fr)`;
    const grid = `<div class="sr-foto-grid" style="display:grid;grid-template-columns:${cols};gap:12px;margin-top:32px">${items}</div>`;
    html = html.replace("<!-- ABOUT_FOTOS -->", grid);
  } else {
    html = html.replace("<!-- ABOUT_FOTOS -->", "");
  }

  // Legacy: alte Platzhalter entfernen falls noch vorhanden
  html = html.replace(/<!-- FOTO_BAND -->/g, "");
  html = html.replace(/<!-- GALERIE -->/g, "");

  // Kontaktformular in die Kontakt-Sektion injizieren (<!-- KONTAKT_FORM --> Platzhalter)
  if (html.includes("<!-- KONTAKT_FORM -->")) {
    const inlineForm = `<div class="k-form">` +
      `<h3>Schreiben Sie uns</h3>` +
      `<div id="sr-form-wrap">` +
      `<form id="sr-kf" onsubmit="document.getElementById('sr-form-wrap').style.display='none';document.getElementById('sr-form-ok').style.display='block';return false;">` +
      `<div class="k-form-row">` +
      `<div><label>Name *</label><input required type="text" placeholder="Ihr Name"></div>` +
      `<div><label>E-Mail *</label><input required type="email" placeholder="ihre@email.at"></div>` +
      `<div><label>Telefon</label><input type="tel" placeholder="+43 ..."></div>` +
      `</div>` +
      `<div class="k-form-field"><label>Nachricht *</label><textarea required rows="3" placeholder="Ihre Nachricht..."></textarea></div>` +
      `<button type="submit">Nachricht senden</button>` +
      `</form></div>` +
      `<div id="sr-form-ok" class="k-form-ok">` +
      `<div style="font-size:1.8rem;color:#16a34a">&#10003;</div>` +
      `<h4>Vielen Dank!</h4>` +
      `<p>Wir haben Ihre Nachricht erhalten und melden uns bald bei Ihnen.</p>` +
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
    const stilName = o.stil || "klassisch";
    const checkIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
    const cardStyleMap = {
      klassisch:  "border:1px solid var(--sep,#e2e8f0);padding:28px 26px;background:#fff;border-radius:8px;box-shadow:0 2px 12px rgba(0,0,0,.06);transition:transform .2s ease,box-shadow .2s ease",
      modern:     "border-radius:16px;box-shadow:0 4px 24px rgba(0,0,0,.07);padding:28px 26px;background:#fff;transition:transform .2s ease,box-shadow .2s ease",
      elegant:    "border:1px solid var(--sep,#e7e5e4);padding:32px 26px;background:#fff;border-radius:2px;transition:transform .2s ease,box-shadow .2s ease",
      custom:     "border:1px solid var(--sep,#e5e7eb);padding:28px 26px;background:#fff;border-radius:12px;box-shadow:0 2px 12px rgba(0,0,0,.06);transition:transform .2s ease,box-shadow .2s ease",
    };
    const iconStyleMap = {
      klassisch: "width:42px;height:42px;border-radius:8px;background:var(--accent);display:flex;align-items:center;justify-content:center;margin-bottom:18px;flex-shrink:0",
      modern:    "width:44px;height:44px;border-radius:50%;background:var(--accent);display:flex;align-items:center;justify-content:center;margin-bottom:18px;flex-shrink:0",
      elegant:   "width:32px;height:32px;border-radius:2px;background:var(--accent);display:flex;align-items:center;justify-content:center;margin-bottom:20px;flex-shrink:0;opacity:.85",
      custom:    "width:44px;height:44px;border-radius:10px;background:var(--accent);display:flex;align-items:center;justify-content:center;margin-bottom:18px;flex-shrink:0",
    };
    const cardStyle = cardStyleMap[stilName] || cardStyleMap.klassisch;
    const iconStyle = iconStyleMap[stilName] || iconStyleMap.klassisch;
    const cards = leistungenArr.map((l, i) => {
      const lCapitalized = l.charAt(0).toUpperCase() + l.slice(1);
      const desc = descMap[l] || descMap[lCapitalized] || "";
      return `<div style="${cardStyle}" onmouseover="this.style.transform='translateY(-3px)';this.style.boxShadow='0 8px 32px rgba(0,0,0,.10)'" onmouseout="this.style.transform='none';this.style.boxShadow='0 2px 12px rgba(0,0,0,.06)'">` +
        `<div style="${iconStyle}">${checkIcon}</div>` +
        `<h3 style="color:var(--primary,#0f2b5b);font-weight:800;margin:0 0 10px;font-size:1.08rem;letter-spacing:-.02em;line-height:1.3">${lCapitalized}</h3>` +
        (desc ? `<p style="color:var(--textMuted,#64748b);margin:0;font-size:.95rem;line-height:1.7">${desc}</p>` : `<p style="color:var(--textMuted,#64748b);margin:0;font-size:.95rem;line-height:1.7;opacity:.6">Professionelle Leistung f\u00fcr Ihre Bed\u00fcrfnisse.</p>`) +
        `</div>`;
    }).join("");
    const n = leistungenArr.length;
    const gridCols = n === 1 ? "1fr" : n <= 3 ? `repeat(${n},1fr)` : n === 4 ? "repeat(2,1fr)" : "repeat(3,1fr)";
    const grid = `<div class="sr-leist-grid" style="display:grid;grid-template-columns:${gridCols};gap:20px">${cards}</div>`;
    html = html.replace("<!-- LEISTUNGEN -->", grid);
  }

  // ── Serve-time Variablen-Ersetzung (Sofort-Updates ohne Re-Generierung) ──
  const tel = o.telefon || "";
  const telHref = tel ? "tel:" + tel.replace(/\s/g, "") : "";
  const adresseVoll = [o.adresse, [o.plz, o.ort].filter(Boolean).join(" ")].filter(Boolean).join(", ");
  const oezKey = o.oeffnungszeiten || "";
  const oezLabel = oezKey === "custom" ? (o.oeffnungszeiten_custom || "") : (OEZ_LABELS[oezKey] || oezKey || "Nach Vereinbarung");

  // Vorteile HTML aus text_vorteile JSON-Array aufbauen
  let vorteileHtml = "";
  if (Array.isArray(o.text_vorteile) && o.text_vorteile.length) {
    const stil = o.stil || "klassisch";
    if (stil === "modern") {
      vorteileHtml = o.text_vorteile.map(v =>
        `<div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:16px">` +
        `<div style="width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,.15);color:#fff;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:.85rem;font-weight:700">&#10003;</div>` +
        `<span style="padding-top:8px">${v}</span></div>`
      ).join("");
    } else if (stil === "elegant") {
      vorteileHtml = o.text_vorteile.map(v =>
        `<div style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,.1)">` +
        `<span style="color:rgba(255,255,255,.5);font-weight:300;margin-right:8px">&#8211;</span>${v}</div>`
      ).join("");
    } else {
      vorteileHtml = o.text_vorteile.map(v =>
        `<div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:12px">` +
        `<span style="color:rgba(255,255,255,.8);font-weight:700;flex-shrink:0">&#10003;</span><span>${v}</span></div>`
      ).join("");
    }
  }

  const vars = {
    "{{FIRMENNAME}}":       o.firmenname || "",
    "{{TEL_HREF}}":         telHref,
    "{{TEL_DISPLAY}}":      tel,
    "{{EMAIL}}":            o.email || "",
    "{{ADRESSE_VOLL}}":     adresseVoll,
    "{{PLZ_ORT}}":          [o.plz, o.ort].filter(Boolean).join(" "),
    "{{KURZBESCHREIBUNG}}": o.kurzbeschreibung || "",
    "{{OEFFNUNGSZEITEN}}":  oezLabel,
    "{{EINSATZGEBIET}}":    o.einsatzgebiet || "",
    "{{SOCIAL_ICONS}}":     buildSocialIcons(o),
    "{{UEBER_UNS_TEXT}}":   o.text_ueber_uns || "",
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

  // ── Serve-time Style Fixes ──
  const responsiveStyle = `<style>
.hero{min-height:100vh;min-height:100svh}
@media(max-width:640px){
.hero{justify-content:center}
.hero-inner{padding-top:24px!important;padding-bottom:24px!important}
.sr-foto-grid{grid-template-columns:1fr 1fr!important}
.sr-leist-grid{grid-template-columns:1fr!important}
.sr-leist-grid div p{font-size:.85rem!important;line-height:1.65!important}
.sr-leist-grid div h3{font-size:.92rem!important}
.kontakt-form-wrap{margin-bottom:24px}
}
</style>`;
  html = html.replace("</head>", responsiveStyle + "</head>");

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

function offlinePage(firmenname) {
  return `<!DOCTYPE html><html lang="de"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${firmenname} &ndash; Nicht erreichbar</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:system-ui,sans-serif;background:#f8fafc;color:#1e293b;display:flex;align-items:center;justify-content:center;min-height:100vh;padding:24px}.box{text-align:center;max-width:480px}.icon{font-size:3rem;margin-bottom:16px}h2{font-size:1.5rem;font-weight:700;margin-bottom:8px}p{color:#64748b;line-height:1.6}</style>
</head><body><div class="box"><div class="icon">&#128683;</div><h2>${firmenname}</h2><p>Diese Website ist vor\u00fcbergehend nicht erreichbar.<br>Bitte versuchen Sie es sp\u00e4ter erneut.</p></div></body></html>`;
}
