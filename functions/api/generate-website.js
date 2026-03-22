/* ═══ Nav-Builder ═══ */
function buildNav(o, pal, stil) {
  const tel = o.telefon || "";
  const telHref = tel ? `tel:${tel.replace(/\s/g,"")}` : "#kontakt";
  return `<style>
#sitenav{position:sticky;top:0;z-index:1000;transition:background .3s,box-shadow .3s}
#sitenav.scrolled{background:#fff;box-shadow:0 2px 20px rgba(0,0,0,.08)}
#sitenav.scrolled .nav-logo{color:var(--primary)!important}
#sitenav.scrolled .nav-link{color:var(--primary)!important}
#sitenav.scrolled .hbg-bar{background:var(--primary)!important}
.nav-inner{max-width:1200px;margin:0 auto;padding:0 24px;height:68px;display:flex;align-items:center;justify-content:space-between}
.nav-links{display:flex;align-items:center;gap:28px}
.nav-link{color:rgba(255,255,255,.85);text-decoration:none;font-size:.88rem;font-weight:500;transition:opacity .2s}
.nav-link:hover{opacity:.7}
.nav-cta{background:var(--accent);color:#fff!important;padding:9px 18px;border-radius:${stil.r};font-weight:700;font-size:.85rem;white-space:nowrap}
.nav-cta:hover{opacity:.85!important}
.hbg{display:none;flex-direction:column;gap:5px;background:none;border:none;cursor:pointer;padding:6px}
.hbg-bar{width:24px;height:2px;background:rgba(255,255,255,.9);border-radius:2px;transition:background .3s}
.mob-menu{display:none;position:fixed;top:68px;left:0;right:0;background:#fff;box-shadow:0 8px 32px rgba(0,0,0,.12);padding:16px 24px 24px;z-index:999}
.mob-link{display:block;padding:12px 0;font-size:1rem;font-weight:600;color:var(--primary);text-decoration:none;border-bottom:1px solid #f1f5f9}
.mob-cta{display:block;margin-top:16px;background:var(--accent);color:#fff;text-align:center;padding:14px;border-radius:${stil.r};font-weight:700;font-size:1rem;text-decoration:none}
@media(max-width:768px){.nav-links{display:none}.hbg{display:flex}}
</style>
<nav id="sitenav">
<div class="nav-inner">
<a href="#" class="nav-logo" style="font-weight:800;font-size:1.05rem;color:#fff;text-decoration:none;letter-spacing:-.02em">${o.firmenname}</a>
<div class="nav-links">
<a href="#leistungen" class="nav-link">Leistungen</a>
<a href="#ueber-uns" class="nav-link">\u00dcber uns</a>
<a href="#kontakt" class="nav-link">Kontakt</a>
${tel ? `<a href="${telHref}" class="nav-link nav-cta">${tel}</a>` : ""}
</div>
<button class="hbg" id="hbg" aria-label="Menu">
<span class="hbg-bar"></span><span class="hbg-bar"></span><span class="hbg-bar"></span>
</button>
</div>
<div class="mob-menu" id="mob-menu">
<a href="#leistungen" class="mob-link">Leistungen</a>
<a href="#ueber-uns" class="mob-link">\u00dcber uns</a>
<a href="#kontakt" class="mob-link">Kontakt</a>
${tel ? `<a href="${telHref}" class="mob-cta">${tel} &mdash; Jetzt anrufen</a>` : ""}
</div>
</nav>
<script>
(function(){
var nav=document.getElementById('sitenav');
var btn=document.getElementById('hbg');
var mob=document.getElementById('mob-menu');
var open=false;
btn.addEventListener('click',function(){open=!open;mob.style.display=open?'block':'none';});
window.addEventListener('scroll',function(){nav.classList.toggle('scrolled',window.scrollY>40);if(window.scrollY>40&&open){open=false;mob.style.display='none';}});
document.querySelectorAll('.mob-link,.mob-cta').forEach(function(a){a.addEventListener('click',function(){open=false;mob.style.display='none';});});
})();
</script>`;
}

/* ═══ Footer-Builder ═══ */
function buildFooter(o, pal, year, sub) {
  const adresse = [o.adresse, [o.plz, o.ort].filter(Boolean).join(" ")].filter(Boolean).join(", ");
  const tel = o.telefon || "";
  const telHref = tel ? `tel:${tel.replace(/\s/g,"")}` : "";
  return `<footer style="background:var(--primary);color:#fff;padding:56px 0 0;font-family:inherit">
<div style="max-width:1200px;margin:0 auto;padding:0 24px">
<div style="display:grid;grid-template-columns:2fr 1fr 1fr;gap:48px;padding-bottom:48px" class="ft-grid">
<div>
<div style="font-weight:800;font-size:1.05rem;margin-bottom:12px;letter-spacing:-.01em">${o.firmenname}</div>
<p style="opacity:.65;line-height:1.75;font-size:.85rem;margin-bottom:16px;max-width:280px">${o.kurzbeschreibung||""}</p>
${tel ? `<a href="${telHref}" style="color:#fff;font-weight:700;font-size:.9rem;text-decoration:none;opacity:.9">${tel}</a>` : ""}
</div>
<div>
<div style="font-weight:700;font-size:.72rem;text-transform:uppercase;letter-spacing:.1em;opacity:.45;margin-bottom:16px">Navigation</div>
<div style="display:flex;flex-direction:column;gap:10px">
<a href="#leistungen" style="color:rgba(255,255,255,.7);text-decoration:none;font-size:.88rem">Leistungen</a>
<a href="#ueber-uns" style="color:rgba(255,255,255,.7);text-decoration:none;font-size:.88rem">\u00dcber uns</a>
<a href="#kontakt" style="color:rgba(255,255,255,.7);text-decoration:none;font-size:.88rem">Kontakt</a>
<a href="/s/${sub}/impressum" style="color:rgba(255,255,255,.7);text-decoration:none;font-size:.88rem">Impressum</a>
<a href="/s/${sub}/datenschutz" style="color:rgba(255,255,255,.7);text-decoration:none;font-size:.88rem">Datenschutz</a>
</div>
</div>
<div>
<div style="font-weight:700;font-size:.72rem;text-transform:uppercase;letter-spacing:.1em;opacity:.45;margin-bottom:16px">Kontakt</div>
<div style="display:flex;flex-direction:column;gap:10px;font-size:.88rem;color:rgba(255,255,255,.7)">
${adresse ? `<span>${adresse}</span>` : ""}
${tel ? `<a href="${telHref}" style="color:rgba(255,255,255,.85);text-decoration:none;font-weight:600">${tel}</a>` : ""}
${o.email ? `<a href="mailto:${o.email}" style="color:rgba(255,255,255,.7);text-decoration:none">${o.email}</a>` : ""}
</div>
</div>
</div>
<div style="border-top:1px solid rgba(255,255,255,.1);padding:20px 0;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
<span style="opacity:.4;font-size:.78rem">&copy; ${year} ${o.firmenname}</span>
<div style="display:flex;gap:20px">
<a href="/s/${sub}/impressum" style="opacity:.4;font-size:.78rem;color:#fff;text-decoration:none">Impressum</a>
<a href="/s/${sub}/datenschutz" style="opacity:.4;font-size:.78rem;color:#fff;text-decoration:none">Datenschutz</a>
</div>
</div>
</div>
</footer>
<style>@media(max-width:768px){.ft-grid{grid-template-columns:1fr!important}}</style>`;
}

/* ═══ Impressum-Builder (ECG-konform, rechtsformspezifisch) ═══ */
function buildImpressum(o, pal, year) {
  const uf = o.unternehmensform || "";
  const ufSuffix = {eu:"e.U.",gmbh:"GmbH",og:"OG",kg:"KG",ag:"AG"};
  const firmaVoll = o.firmenname + (ufSuffix[uf] ? ` ${ufSuffix[uf]}` : "");
  const sitz = [o.plz, o.ort].filter(Boolean).join(" ");
  const adresse = [o.adresse, sitz].filter(Boolean).join(", ");
  const rows = [];
  const add = (l, v) => { if (v && String(v).trim()) rows.push([l, String(v).trim()]); };

  add("Medieninhaber & Herausgeber", firmaVoll);

  if (uf === "einzelunternehmen") {
    add("Inhaber", o.firmenname); add("Anschrift", adresse);
    add("Unternehmensgegenstand", o.unternehmensgegenstand);
  } else if (uf === "eu") {
    add("Sitz", sitz); add("Firmenbuchnummer", o.firmenbuchnummer);
    add("Firmenbuchgericht", o.firmenbuchgericht);
    if (o.liquidation) add("Hinweis", "Gesellschaft in Liquidation");
  } else if (uf === "gmbh") {
    add("Sitz", sitz); add("Firmenbuchnummer", o.firmenbuchnummer);
    add("Firmenbuchgericht", o.firmenbuchgericht);
    add("Gesch\u00e4ftsf\u00fchrer", o.geschaeftsfuehrer);
    if (o.liquidation) add("Hinweis", "Gesellschaft in Liquidation");
  } else if (uf === "og" || uf === "kg") {
    add("Sitz", sitz); add("Firmenbuchnummer", o.firmenbuchnummer);
    add("Firmenbuchgericht", o.firmenbuchgericht);
    if (o.liquidation) add("Hinweis", "Gesellschaft in Liquidation");
  } else if (uf === "ag") {
    add("Sitz", sitz); add("Firmenbuchnummer", o.firmenbuchnummer);
    add("Firmenbuchgericht", o.firmenbuchgericht);
    add("Vorstand", o.vorstand); add("Aufsichtsrat", o.aufsichtsrat);
    if (o.liquidation) add("Hinweis", "Gesellschaft in Liquidation");
  } else if (uf === "verein") {
    add("Vereinsname", o.firmenname); add("Sitz", sitz);
    add("ZVR-Zahl", o.zvr_zahl);
    add("Vertretungsbefugte Organe", o.vertretungsorgane);
  } else if (uf === "gesnbr") {
    add("Bezeichnung", o.firmenname); add("Anschrift", adresse);
    add("Unternehmensgegenstand", o.unternehmensgegenstand);
    add("Gesellschafter", o.gesellschafter);
  } else {
    add("Anschrift", adresse);
  }

  add("Telefon", o.telefon); add("E-Mail", o.email);
  add("UID-Nummer", o.uid_nummer); add("GISA-Zahl", o.gisazahl);

  if (o.aufsichtsbehoerde) {
    add("Aufsichtsbeh\u00f6rde", o.aufsichtsbehoerde);
  } else if (uf !== "verein" && uf !== "gesnbr") {
    add("Aufsichtsbeh\u00f6rde", "Zust\u00e4ndige Bezirksverwaltungsbeh\u00f6rde");
  }
  if (o.kammer_berufsrecht) {
    add("Kammer / Berufsrecht", o.kammer_berufsrecht);
  } else if (uf !== "verein" && uf !== "gesnbr" && uf !== "einzelunternehmen") {
    add("Mitglied der", "Wirtschaftskammer \u00d6sterreich");
    add("Berufsrecht", "Gewerbeordnung (www.ris.bka.gv.at)");
  }

  const tRows = rows.map(([l,v]) =>
    `<tr><td style="padding:7px 20px 7px 0;font-weight:600;white-space:nowrap;vertical-align:top;color:${pal.p};font-size:.85rem">${l}</td><td style="padding:7px 0;color:#374151;font-size:.85rem">${v}</td></tr>`
  ).join("");

  const dsgvo = `Diese Website verwendet keine Cookies au\u00dfer technisch notwendigen. Es findet kein Tracking statt. Ihre personenbezogenen Daten werden ausschlie\u00dflich zur Bearbeitung Ihrer Anfragen genutzt und nicht an Dritte weitergegeben. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO. Verantwortlicher: ${firmaVoll}, ${adresse}.`;

  return `<section id="impressum" style="background:#f8fafc;padding:64px 0;border-top:2px solid ${pal.s}">
<div style="max-width:960px;margin:0 auto;padding:0 24px">
<h2 style="font-size:1.3rem;font-weight:800;color:${pal.p};margin-bottom:24px;letter-spacing:-.01em">Impressum</h2>
<table style="border-collapse:collapse;width:100%">${tRows}</table>
<div id="datenschutz" style="margin-top:48px;padding-top:40px;border-top:1px solid ${pal.s}">
<h3 style="font-size:1rem;font-weight:700;color:${pal.p};margin-bottom:12px">Datenschutzerkl\u00e4rung</h3>
<p style="font-size:.85rem;line-height:1.8;color:#4b5563;max-width:720px">${dsgvo}</p>
</div>
<p style="margin-top:32px;font-size:.78rem;color:#9ca3af">&copy; ${year} ${o.firmenname}</p>
</div></section>`;
}

/* ═══ Branchenspezifische Farbpaletten ═══ */
const PALETTES = {
  elektro:      {p:"#0c1d3d", a:"#f59e0b", bg:"#f8faff", s:"#e2e8f0"},
  installateur: {p:"#1a3050", a:"#dc2626", bg:"#f8fafc", s:"#e2e8f0"},
  maler:        {p:"#2c3e50", a:"#e67e22", bg:"#fffef9", s:"#f0e6d3"},
  tischler:     {p:"#4a2c0a", a:"#d97706", bg:"#fefaf0", s:"#fde68a"},
  fliesenleger: {p:"#0f3460", a:"#0891b2", bg:"#f0fdfe", s:"#cffafe"},
  schlosser:    {p:"#1c1c2e", a:"#64748b", bg:"#f1f5f9", s:"#e2e8f0"},
  dachdecker:   {p:"#3b1f0a", a:"#b45309", bg:"#fff8f0", s:"#fde68a"},
  zimmerei:     {p:"#1a3c28", a:"#a16207", bg:"#f7fdf0", s:"#d1fae5"},
  maurer:       {p:"#2d2d2d", a:"#ea580c", bg:"#fafafa", s:"#e5e7eb"},
  bodenleger:   {p:"#2d1b69", a:"#b45309", bg:"#fdf8ff", s:"#e9d5ff"},
  glaser:       {p:"#0c4a6e", a:"#0891b2", bg:"#f0f9ff", s:"#bae6fd"},
  gaertner:     {p:"#14532d", a:"#15803d", bg:"#f0fdf4", s:"#bbf7d0"},
  klima:        {p:"#0c2340", a:"#0284c7", bg:"#f0f9ff", s:"#bae6fd"},
  reinigung:    {p:"#0f2942", a:"#0ea5e9", bg:"#f8fbff", s:"#bae6fd"},
  sonstige:     {p:"#1e293b", a:"#3b82f6", bg:"#f8fafc", s:"#dbeafe"},
};

const STIL = {
  professional: {
    font: "Inter",
    url: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap",
    r: "6px", rLg: "12px",
    feel: "serioes, klar, vertrauenswuerdig, geschaeftlich professionell",
  },
  modern: {
    font: "DM Sans",
    url: "https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800&display=swap",
    r: "14px", rLg: "24px",
    feel: "modern, frisch, dynamisch, leicht, einladend",
  },
  traditional: {
    font: "Source Serif 4",
    url: "https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700;8..60,800&display=swap",
    r: "4px", rLg: "8px",
    feel: "bodenstaendig, erfahren, vertrauenswuerdig, handwerklich solide",
  },
};

export async function onRequestPost({request, env}) {
  try {
  const url = new URL(request.url);
  const key = url.searchParams.get("key");
  if (!key || key !== env.ADMIN_SECRET) {
    return Response.json({error: "Unauthorized"}, {status: 401});
  }

  let body;
  try { body = await request.json(); } catch(e) {
    return Response.json({error: "Invalid JSON"}, {status: 400});
  }
  const {order_id} = body;
  if (!order_id) return Response.json({error: "order_id required"}, {status: 400});

  /* Bestellung laden */
  const r = await fetch(
    `${env.SUPABASE_URL}/rest/v1/orders?id=eq.${order_id}&select=*`,
    {headers: {"apikey": env.SUPABASE_SERVICE_KEY, "Authorization": `Bearer ${env.SUPABASE_SERVICE_KEY}`}}
  );
  const rows = await r.json();
  if (!rows.length) return Response.json({error: "Order not found"}, {status: 404});
  const o = rows[0];

  /* Konfiguration */
  const pal  = PALETTES[o.branche] || PALETTES.sonstige;
  const stil = STIL[o.stil]        || STIL.professional;
  const sub  = o.subdomain || (o.firmenname || "firma").toLowerCase().replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,"");

  const leistungen = [...(o.leistungen || [])];
  if (o.extra_leistung?.trim()) leistungen.push(o.extra_leistung.trim());
  const oez = o.oeffnungszeiten_custom || o.oeffnungszeiten || "Nach Vereinbarung";
  const year = new Date().getFullYear();
  const impressumHtml = buildImpressum(o, pal, year);
  const navHtml      = buildNav(o, pal, stil);
  const footerHtml   = buildFooter(o, pal, year, sub);

  /* ─── System Prompt ─── */
  const system = `Du bist ein erstklassiger Web-Designer und Senior Frontend-Entwickler.
Generiere eine VOLLSTAENDIGE, professionelle, wunderschoene HTML-Website fuer einen oesterreichischen Handwerksbetrieb.

AUSGABE-REGEL: Antworte AUSSCHLIESSLICH mit reinem HTML-Code. Kein Markdown, keine Backticks, keine Erklaerungen. Beginne DIREKT mit <!DOCTYPE html> und ende mit </html>.
KOMPAKTHEIT: CSS und HTML kompakt (keine Kommentare, kurze Klassennamen). Striktes Token-Budget.
KEINE ERFUNDENEN FAKTEN: Keine erfundenen Zahlen, Statistiken oder Behauptungen. Nur echte Kundendaten.
META: <meta name="robots" content="noindex,nofollow"> im <head> einbauen.
STRUKTUR: Nav und Footer werden automatisch injiziert. Generiere NUR: <!DOCTYPE html>, <html>, <head> (CSS+Fonts), <body> mit den Sektionen HERO, LEISTUNGEN, UEBER-UNS, KONTAKT. Setze <!-- NAV --> direkt nach <body> und <!-- FOOTER --> nach dem Kontakt-Abschnitt. Kein eigener Nav, kein eigener Footer, kein Impressum.

═══ DESIGN-VORGABEN ═══
Primaerfarbe:  ${pal.p}
Akzentfarbe:   ${pal.a}
Hintergrund:   ${pal.bg}
Trennfarbe:    ${pal.s}
Schriftart:    ${stil.font}
Border-Radius: ${stil.r} (small), ${stil.rLg} (large)
Feeling:       ${stil.feel}

CSS Custom Properties im :root definieren:
--primary, --accent, --bg, --sep, --text, --textMuted, --white

═══ TECHNISCHE ANFORDERUNGEN ═══
- Valides HTML5 mit semantischen Tags (nav, main, section, footer, article, address)
- Google Fonts @import im <style>-Tag: ${stil.url}
- Vollstaendig RESPONSIVE (Mobile-First, Breakpoints: 640px, 900px, 1200px)
- CSS Grid und Flexbox fuer Layouts
- html { scroll-behavior: smooth; }
- Hamburger-Navigation fuer Mobile (inline <script>, max. 15 Zeilen)
- Hover-Transitions: transition: all 0.2s ease auf interaktiven Elementen
- Meta-Tags: charset, viewport, description, og:title
- Performant: keine externen Ressourcen ausser Google Fonts

═══ QUALITAETSSTANDARDS ═══
- Grosszuegiger Whitespace: Sektionen haben padding: 96px 0 (Desktop), 64px 0 (Mobile)
- Starke visuelle Hierarchie durch Schriftgroessen und Gewichte
- Conversion-optimiert: Telefonnummer mind. 3x sichtbar (nav, hero, kontakt)
- Keine generischen Placeholder-Texte wie [Firmenname] - echte Daten einsetzen
- Beschreibungstexte pro Leistung SELBER VERFASSEN (1 Satz, branchenspezifisch)
- Professionell und fertig wirkend - nicht wie ein Template

═══ SEITENSTRUKTUR ═══

HERO: min-height:100vh, background:var(--primary) mit Gradient-Overlay.${o.notdienst ? " NOTDIENST-BADGE: gruener Puls-Punkt + '24/7 Notdienst' (rgba-Hintergrund)." : ""} H1 Firmenname (clamp(2.8rem,6vw,5rem), weiss, font-weight:900). Subtitle Branche+Einsatzgebiet (weiss, opacity:.8). 2 CTA-Buttons. Scroll-Indikator.

LEISTUNGEN: weisser Hintergrund. Grid auto-fill minmax(260px,1fr). Cards mit Emoji-Icon, H3, 1 Satz Beschreibung (selbst verfassen!), Hover-Lift.

UEBER UNS: var(--bg) Hintergrund. Zweispaltig: Text+Vorteile links (3-4 Punkte warum dieser Betrieb), rechts dekorative Karte (var(--primary), weiss) mit Leistungsueberblick oder Kontaktaufruf. KEINE erfundenen Zahlen oder Statistiken.

KONTAKT: weiss. Zweispaltig: Kontaktinfos (tel: Link, mailto:) links, CTA-Karte rechts. Kein Formular.

KONTAKT: weiss. Zweispaltig: Kontaktinfos (tel: Link, mailto:) links, CTA-Karte rechts. Kein Formular.`;

  /* ─── User Message ─── */
  const user = `Erstelle die Website fuer diesen Betrieb:

FIRMA:         ${o.firmenname}
BRANCHE:       ${o.branche_label || o.branche}
EINSATZGEBIET: ${o.einsatzgebiet || o.bundesland || "Oesterreich"}
BESCHREIBUNG:  ${o.kurzbeschreibung || `Ihr zuverlaessiger ${o.branche_label || "Handwerks"}-Betrieb in ${o.ort || "Oesterreich"}`}

LEISTUNGEN (${leistungen.length}):
${leistungen.map((l, i) => `${i + 1}. ${l}`).join("\n")}

KONTAKT:
Adresse:        ${[o.adresse, o.plz, o.ort].filter(Boolean).join(", ") || "Auf Anfrage"}
Telefon:        ${o.telefon || ""}
E-Mail:         ${o.email || ""}
Oeffnungszeiten: ${oez}

NOTDIENST:    ${o.notdienst ? "JA - 24/7 Notdienst - SEHR PROMINENT darstellen!" : "Nein"}
FOTOS:        ${o.fotos ? "Ja - Bildplaetze als gestaltete farbige Platzhalter-Bloecke (CSS background-color + passendem Emoji zentriert, KEINE img-Tags)" : "Nein - Keine Bildplaetze einbauen"}
STIL-GEFUEHL: ${stil.feel}

STRUKTUR-PFLICHT: Setze exakt diese Kommentare als Platzhalter:
- <!-- NAV --> direkt nach <body>
- <!-- FOOTER --> nach dem Kontakt-Abschnitt
- <!-- IMPRESSUM --> nach <!-- FOOTER -->
Nav, Footer und Impressum werden automatisch befuellt. Keinen eigenen Nav/Footer/Impressum schreiben.`;

  /* ─── Claude API Call ─── */
  const aiRes = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 8192,
      system,
      messages: [{role: "user", content: user}],
    }),
  });

  if (!aiRes.ok) {
    const err = await aiRes.json().catch(() => ({}));
    return Response.json({error: "KI-Fehler: " + (err.error?.message || aiRes.status)}, {status: 500});
  }

  const aiData = await aiRes.json();
  let html = aiData.content?.[0]?.text || "";

  // Markdown-Backticks entfernen falls Claude sie dennoch ausgibt
  html = html.replace(/^```html\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();

  // Nav + Footer injizieren (Impressum/Datenschutz auf eigenen Unterseiten)
  html = html.includes("<!-- NAV -->")
    ? html.replace("<!-- NAV -->", navHtml)
    : html.replace(/<body[^>]*>/i, m => m + "\n" + navHtml);

  html = html.includes("<!-- FOOTER -->")
    ? html.replace("<!-- FOOTER -->", footerHtml)
    : html.replace(/<\/body>/i, footerHtml + "\n</body>");

  // Eventuelle Impressum-Placeholder entfernen (Impressum ist jetzt auf /s/[sub]/impressum)
  html = html.replace("<!-- IMPRESSUM -->", "");

  /* ─── In Supabase speichern + Status setzen ─── */
  const save = await fetch(
    `${env.SUPABASE_URL}/rest/v1/orders?id=eq.${order_id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "apikey": env.SUPABASE_SERVICE_KEY,
        "Authorization": `Bearer ${env.SUPABASE_SERVICE_KEY}`,
        "Prefer": "return=minimal",
      },
      body: JSON.stringify({website_html: html, subdomain: sub, status: "review"}),
    }
  );

  return Response.json({ok: save.ok, subdomain: sub, status: "review"});
  } catch(e) {
    return Response.json({error: "Interner Fehler: " + e.message}, {status: 500});
  }
}
