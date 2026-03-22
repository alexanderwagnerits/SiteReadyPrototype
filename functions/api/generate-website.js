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

  /* ─── System Prompt ─── */
  const system = `Du bist ein erstklassiger Web-Designer und Senior Frontend-Entwickler.
Generiere eine VOLLSTAENDIGE, professionelle, wunderschoene HTML-Website fuer einen oesterreichischen Handwerksbetrieb.

AUSGABE-REGEL: Antworte AUSSCHLIESSLICH mit reinem HTML-Code. Kein Markdown, keine Backticks, keine Erklaerungen. Beginne DIREKT mit <!DOCTYPE html> und ende mit </html>.

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

═══ SEITENSTRUKTUR (Reihenfolge einhalten) ═══

### NAV (sticky)
- position: sticky; top: 0; z-index: 1000
- Beim Scrollen: weiss + box-shadow (via JS scroll-event + CSS class)
- Desktop links: Logo = Firmenname (font-weight:800, color:var(--primary))
- Desktop rechts: Anker-Links (Leistungen, Ueber uns, Kontakt) + CTA-Button mit Telefon (background: var(--accent), weisse Schrift, border-radius)
- Mobile: nur Logo + Hamburger-Icon (3 Balken / X toggle)
- Mobile-Menue: volle Breite, slide-down, alle Links gestapelt + grosser Anruf-Button

### HERO (min-height: 100vh)
- Hintergrund: dramatischer Gradient aus var(--primary) mit CSS-Radial-Gradienten als Overlay fuer Tiefe
- Dekorative Elemente: 2-3 grosse halbtransparente Kreise/Rechtecke (opacity: 0.06-0.12, position:absolute) fuer visuelle Tiefe
- Zentrierter Content (max-width: 860px)
${o.notdienst ? "- NOTDIENST-BADGE ganz oben: animierter gruener Puls-Punkt + Text '24/7 Notdienst - Wir sind immer fuer Sie da' (background: rgba(255,255,255,0.12), border: 1px solid rgba(255,255,255,0.25))" : ""}
- H1: Firmenname (clamp(2.8rem, 6vw, 5.5rem), font-weight:900, weiss, letter-spacing:-0.03em)
- Subtitle: Branche + Einsatzgebiet (font-size: clamp(1rem, 2vw, 1.4rem), weiss, opacity:0.8)
- Kurzbeschreibung wenn vorhanden (max-width:560px, weiss, opacity:0.7, line-height:1.7)
- 2 CTA-Buttons (gap: 16px): Primaer = weiss mit Primaerfarbe-Text + Telefon, Sekundaer = transparent mit weissem Border
- Scroll-Indikator unten zentriert (animierter Pfeil oder chevron)

### LEISTUNGEN (background: white)
- Sektion-Header: Kleine Label-Zeile (font-size:.75rem, uppercase, letter-spacing:.15em, Akzentfarbe) + H2 (gross, bold) + kurze Subtitle
- Grid: repeat(auto-fill, minmax(280px, 1fr)) mit gap:24px
- Jede Card:
  * Grosses Icon-Emoji oder dekoratives CSS-Element oben (48px x 48px, background:var(--bg), border-radius:${stil.r})
  * Leistungsname als H3 (font-weight:700)
  * 1-saetzige Beschreibung (selbst verfassen, branchenspezifisch)
  * Card: background:var(--bg), border:1px solid var(--sep), padding:32px 28px, border-radius:${stil.rLg}
  * Hover: transform:translateY(-6px), box-shadow:0 20px 60px rgba(0,0,0,.1)

### UEBER UNS (background: var(--bg))
- Zweispaltig Desktop: Links Textcontent, Rechts visuelles Element
- Text links: Label + H2 + Beschreibung + 3-4 Key-Facts als Icon-Liste (✓ oder branchentypische Emojis)
- Rechts: Elegante Karte/Box mit Primaerfarbe als Hintergrund, weisser Text, 2-3 Zahlen/Fakten (z.B. "15+ Jahre Erfahrung", "500+ Projekte", "Kundenzufriedenheit 100%") - Zahlen SINNVOLL SCHAETZEN basierend auf Branche
- Mobile: stacked, Karte zuerst

### KONTAKT (background: white)
- Zweispaltig: Links Kontaktinfos, Rechts grosse Call-to-Action Karte
- Links: Adresse (mit Karten-Emoji), Telefon (als klickbarer grosser Link, tel:), E-Mail (mailto:), Oeffnungszeiten (strukturiert), Einsatzgebiet
- Rechts: Grosse Karte (background:linear-gradient aus Primaerfarbe, weiss), prominenter "Jetzt anrufen" Button, Kurz-Info
- Kein Kontaktformular (keine Server-seitige Verarbeitung noetig)

### FOOTER (background: var(--primary))
- Weisse Schrift
- Dreispaltig Desktop (Logo+Kurzbeschreibung | Navigation | Kontakt), Mobile: gestapelt
- Trennlinie
- Untere Zeile: Copyright + Impressum-Section + Datenschutz-Hinweis

IMPRESSUM (ECG-konform, alle vorhandenen Felder befuellen):
Medieninhaber & Herausgeber: [Firmenname][Unternehmensform]
Adresse, Tel, E-Mail, alle optionalen Felder die vorhanden sind
Mitglied der Wirtschaftskammer Oesterreich
Berufsrecht: Gewerbeordnung (www.ris.bka.gv.at)
Aufsichtsbehoerde: zust. Bezirksverwaltungsbehoerde

DATENSCHUTZ: Kurze DSGVO-Erklaerung (keine Cookies ausser technisch notwendige, kein Tracking, Kontaktdaten nur zur Kontaktaufnahme genutzt)`;

  /* ─── User Message ─── */
  const impressum = [
    o.unternehmensform ? `Unternehmensform: ${o.unternehmensform}` : null,
    o.uid_nummer       ? `UID-Nummer: ${o.uid_nummer}` : null,
    o.firmenbuchnummer ? `Firmenbuchnummer: ${o.firmenbuchnummer}${o.firmenbuchgericht ? `, ${o.firmenbuchgericht}` : ""}` : null,
    o.gisazahl         ? `GISA-Zahl: ${o.gisazahl}` : null,
  ].filter(Boolean).join("\n") || "(keine weiteren Angaben)";

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

IMPRESSUM-DATEN:
${impressum}

Copyright: © ${year} ${o.firmenname}`;

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
}
