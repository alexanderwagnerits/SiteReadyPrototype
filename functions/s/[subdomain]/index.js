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

  // Hero-Bild: erste Section bekommt id="sr-hero", dann CSS-Override mit Bild
  html = html.replace(/<section(?![^>]*id=)/i, '<section id="sr-hero"');
  if (o.url_hero) {
    const heroStyle = `<style>#sr-hero,#hero,section.hero{background:linear-gradient(rgba(0,0,0,.52),rgba(0,0,0,.42)),url('${o.url_hero}') center/cover no-repeat!important}</style>`;
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

  // Galerie serve-time injizieren (zwischen Ueber-uns und Kontakt via <!-- GALERIE -->, Fallback vor Footer)
  const fotoUrls = [o.url_foto1, o.url_foto2, o.url_foto3, o.url_foto4, o.url_foto5].filter(Boolean);
  if (fotoUrls.length > 0) {
    const items = fotoUrls.map(url =>
      `<div style="aspect-ratio:4/3;overflow:hidden;border-radius:8px;background:#e2e8f0">` +
      `<img src="${url}" alt="" loading="lazy" style="width:100%;height:100%;object-fit:cover;display:block;transition:transform .4s ease" onmouseover="this.style.transform='scale(1.04)'" onmouseout="this.style.transform='scale(1)'">` +
      `</div>`
    ).join("");
    const galleryHtml = `<section id="galerie" style="padding:80px 0;background:var(--bg,#f8fafc)">` +
      `<div style="max-width:1200px;margin:0 auto;padding:0 24px">` +
      `<div style="font-size:.72rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--accent);margin-bottom:8px">Einblicke</div>` +
      `<h2 style="font-size:clamp(1.4rem,3.5vw,2.2rem);font-weight:800;color:var(--primary);margin:0 0 32px">Bilder aus unserem Betrieb</h2>` +
      `<div class="sr-gallery-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:16px">${items}</div>` +
      `</div></section>` +
      `<style>@media(max-width:560px){.sr-gallery-grid{grid-template-columns:1fr 1fr!important}}</style>`;
    if (html.includes("<!-- GALERIE -->")) {
      html = html.replace(/<!-- GALERIE -->/g, galleryHtml);
    } else {
      html = html.replace(/<footer[\s>]/i, galleryHtml + "\n<footer ");
    }
  } else {
    html = html.replace(/<!-- GALERIE -->/g, "");
  }

  // Kontaktformular serve-time injizieren (vor Footer)
  const contactForm = `<section id="kontakt-formular" style="padding:80px 0;background:#fff">` +
    `<div style="max-width:640px;margin:0 auto;padding:0 24px">` +
    `<div style="font-size:.72rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--accent,#2563eb);margin-bottom:8px">Kontaktformular</div>` +
    `<h2 style="font-size:clamp(1.4rem,3.5vw,2.2rem);font-weight:800;color:var(--primary,#1e293b);margin:0 0 8px">Schreiben Sie uns</h2>` +
    `<p style="color:var(--textMuted,#64748b);margin:0 0 32px;font-size:.95rem">Wir melden uns schnellstmoeglich bei Ihnen zurueck.</p>` +
    `<div id="sr-form-wrap">` +
    `<form id="sr-kf" onsubmit="document.getElementById('sr-form-wrap').style.display='none';document.getElementById('sr-form-ok').style.display='block';return false;">` +
    `<div class="sr-fg2" style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px">` +
    `<div><label style="display:block;font-size:.78rem;font-weight:700;color:var(--primary,#1e293b);margin-bottom:6px">Name *</label>` +
    `<input required type="text" placeholder="Ihr Name" style="width:100%;padding:12px 14px;border:1.5px solid #e2e8f0;border-radius:8px;font-size:.9rem;font-family:inherit;background:#fff;color:inherit;outline:none;box-sizing:border-box" onfocus="this.style.borderColor='var(--accent,#2563eb)'" onblur="this.style.borderColor='#e2e8f0'"></div>` +
    `<div><label style="display:block;font-size:.78rem;font-weight:700;color:var(--primary,#1e293b);margin-bottom:6px">E-Mail *</label>` +
    `<input required type="email" placeholder="ihre@email.at" style="width:100%;padding:12px 14px;border:1.5px solid #e2e8f0;border-radius:8px;font-size:.9rem;font-family:inherit;background:#fff;color:inherit;outline:none;box-sizing:border-box" onfocus="this.style.borderColor='var(--accent,#2563eb)'" onblur="this.style.borderColor='#e2e8f0'"></div>` +
    `</div>` +
    `<div style="margin-bottom:16px"><label style="display:block;font-size:.78rem;font-weight:700;color:var(--primary,#1e293b);margin-bottom:6px">Telefon</label>` +
    `<input type="tel" placeholder="+43 ..." style="width:100%;padding:12px 14px;border:1.5px solid #e2e8f0;border-radius:8px;font-size:.9rem;font-family:inherit;background:#fff;color:inherit;outline:none;box-sizing:border-box" onfocus="this.style.borderColor='var(--accent,#2563eb)'" onblur="this.style.borderColor='#e2e8f0'"></div>` +
    `<div style="margin-bottom:24px"><label style="display:block;font-size:.78rem;font-weight:700;color:var(--primary,#1e293b);margin-bottom:6px">Nachricht *</label>` +
    `<textarea required rows="5" placeholder="Ihre Nachricht..." style="width:100%;padding:12px 14px;border:1.5px solid #e2e8f0;border-radius:8px;font-size:.9rem;font-family:inherit;background:#fff;color:inherit;outline:none;resize:vertical;box-sizing:border-box" onfocus="this.style.borderColor='var(--accent,#2563eb)'" onblur="this.style.borderColor='#e2e8f0'"></textarea></div>` +
    `<button type="submit" style="background:var(--accent,#2563eb);color:#fff;border:none;padding:14px 32px;border-radius:8px;font-size:.95rem;font-weight:700;cursor:pointer;font-family:inherit;width:100%;transition:opacity .2s" onmouseover="this.style.opacity='.85'" onmouseout="this.style.opacity='1'">Nachricht senden</button>` +
    `</form></div>` +
    `<div id="sr-form-ok" style="display:none;text-align:center;padding:48px 20px;background:#f0fdf4;border-radius:12px;border:1px solid #bbf7d0">` +
    `<div style="font-size:2.5rem;margin-bottom:12px">&#10003;</div>` +
    `<h3 style="font-size:1.3rem;font-weight:800;color:var(--primary,#1e293b);margin:0 0 8px">Vielen Dank!</h3>` +
    `<p style="color:#15803d;margin:0">Wir haben Ihre Nachricht erhalten und melden uns bald bei Ihnen.</p>` +
    `</div>` +
    `</div></section>` +
    `<style>@media(max-width:560px){.sr-fg2{grid-template-columns:1fr!important}}</style>`;
  if (html.includes('<footer')) {
    html = html.replace(/<footer[\s\n>]/i, contactForm + '\n<footer ');
  }

  // ── Leistungen Cards serve-time injizieren (<!-- LEISTUNGEN --> Platzhalter) ──
  if (html.includes("<!-- LEISTUNGEN -->")) {
    const leistungenArr = [...(o.leistungen || [])];
    if (o.extra_leistung?.trim()) {
      leistungenArr.push(...o.extra_leistung.split(/[,\n]+/).map(s => s.trim()).filter(Boolean));
    }
    const descMap = o.leistungen_beschreibungen || {};
    const stilName = o.stil || "professional";
    const cardStyleMap = {
      professional: "border-left:3px solid var(--accent);box-shadow:0 1px 8px rgba(0,0,0,.06);padding:28px 24px;background:#fff;border-radius:6px;transition:all .2s ease",
      modern:       "border-radius:16px;box-shadow:0 4px 24px rgba(0,0,0,.07);padding:32px 28px;overflow:hidden;border-top:4px solid var(--accent);background:#fff;transition:all .2s ease",
      traditional:  "border:1px solid var(--sep,#e2e8f0);border-top:3px solid var(--accent);padding:28px 24px;background:#fff;transition:all .2s ease;border-radius:4px",
    };
    const cardStyle = cardStyleMap[stilName] || cardStyleMap.professional;
    const emojis = ["\uD83D\uDD27","\u26A1","\uD83C\uDFE0","\uD83D\uDD29","\uD83D\uDEE0","\uD83D\uDCA7","\uD83D\uDD11","\uD83E\uDE9F","\uD83C\uDFA8","\uD83C\uDF3F","\u2744","\u2728","\uD83C\uDF1F","\uD83D\uDC8E","\uD83C\uDFC6"];
    const cards = leistungenArr.map((l, i) => {
      const desc = descMap[l] || "";
      return `<div style="${cardStyle}">` +
        `<div style="font-size:2rem;margin-bottom:12px">${emojis[i % emojis.length]}</div>` +
        `<h3 style="color:var(--primary);font-weight:700;margin:0 0 8px;font-size:1.05rem">${l}</h3>` +
        (desc ? `<p style="color:var(--textMuted,#64748b);margin:0;font-size:.9rem;line-height:1.6">${desc}</p>` : "") +
        `</div>`;
    }).join("");
    const grid = `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:24px">${cards}</div>`;
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
    const stil = o.stil || "professional";
    if (stil === "modern") {
      vorteileHtml = o.text_vorteile.map(v =>
        `<div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:16px">` +
        `<div style="width:36px;height:36px;border-radius:50%;background:var(--accent,#2563eb)22;color:var(--accent,#2563eb);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:.85rem;font-weight:700">&#10003;</div>` +
        `<span style="padding-top:8px">${v}</span></div>`
      ).join("");
    } else if (stil === "traditional") {
      vorteileHtml = o.text_vorteile.map(v =>
        `<div style="padding:10px 0;border-bottom:1px solid var(--sep,#e2e8f0)">` +
        `<span style="color:var(--accent);font-weight:700;margin-right:8px">&#8211;</span>${v}</div>`
      ).join("");
    } else {
      vorteileHtml = o.text_vorteile.map(v =>
        `<div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:12px">` +
        `<span style="color:var(--accent);font-weight:700;flex-shrink:0">&#10003;</span><span>${v}</span></div>`
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
