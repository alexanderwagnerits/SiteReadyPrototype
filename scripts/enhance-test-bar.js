// Erweitert die Test-Bar:
//   1) Logo (SVG) hochladen + verknüpfen (url_logo)
//   2) Preisliste als PDF hochladen + verknüpfen (url_preisliste)
//   3) Team entfernen (team_members = [])
//   4) Build neu ausloesen
//
// Aufruf:
//   SUPABASE_SERVICE_KEY=xxx node scripts/enhance-test-bar.js

const SUPABASE_URL = process.env.SUPABASE_URL || "https://brulvtqeazkgcxkimdve.supabase.co";
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const SITE_URL = process.env.SITE_URL || "https://sitereadyprototype.pages.dev";
const SUBDOMAIN = process.env.SUBDOMAIN || "bar-nachtschicht";

if (!SERVICE_KEY) {
  console.error("FEHLER: SUPABASE_SERVICE_KEY env-Variable fehlt.");
  process.exit(1);
}

const H = { "apikey": SERVICE_KEY, "Authorization": `Bearer ${SERVICE_KEY}` };

// ── 1) Logo (SVG — Wortmarke mit Mond, HELL fuer dunkle Navigation) ───
function buildLogoSvg() {
  const gold = "#c9a961";
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 140" width="560" height="140">
  <style>
    .word { font-family: "Playfair Display", "Times New Roman", serif; font-weight: 700; letter-spacing: 2.5px; fill: #ffffff; }
    .sub  { font-family: "Helvetica Neue", Arial, sans-serif; font-weight: 500; letter-spacing: 7px; fill: ${gold}; }
  </style>
  <!-- Mond (Sichel) in Gold mit Sternen -->
  <g transform="translate(42,70)">
    <path d="M -18 -22 A 24 24 0 1 0 -18 22 A 18 18 0 1 1 -18 -22 Z" fill="${gold}"/>
    <circle cx="22" cy="-18" r="1.8" fill="${gold}"/>
    <circle cx="30" cy="-6"  r="1.3" fill="${gold}"/>
    <circle cx="26" cy="8"   r="1"   fill="${gold}"/>
  </g>
  <!-- Wortmarke -->
  <text x="96" y="72" class="word" font-size="40">BAR NACHTSCHICHT</text>
  <text x="98" y="102" class="sub" font-size="11">COCKTAILS &#183; WIEN &#183; SEIT 2017</text>
</svg>`;
}

// ── 2) PDF-Generator (pure JS) ─────────────────────────────────────────
function enc(s) {
  const map = { "ä": "\\344", "ö": "\\366", "ü": "\\374", "Ä": "\\304", "Ö": "\\326", "Ü": "\\334", "ß": "\\337", "€": "\\200", "–": "-" };
  return s.replace(/[äöüÄÖÜß€–]/g, c => map[c]).replace(/([()\\])/g, "\\$1");
}

const bar = [
  { h: "BAR NACHTSCHICHT", s: "GETRÄNKEKARTE" },
  { cat: "SIGNATURE COCKTAILS" },
  { l: "Nachtschicht Negroni",      d: "Tanqueray, Campari, Cinzano Rosso, Orangenöl",           p: "13,00" },
  { l: "Margaretenstraße Sour",     d: "Bourbon, Zitronensaft, Eiweiß, Angostura Bitters",        p: "12,50" },
  { l: "Goldener Wiener",           d: "Gin, Holunder, Gurke, Tonic Fever-Tree",                  p: "12,00" },
  { l: "Smoky Old Fashioned",       d: "Rauchiger Bourbon, Demerara Zucker, Orange Peel",         p: "14,00" },
  { cat: "KLASSIKER" },
  { l: "Negroni",                   d: "Gin, Campari, Vermouth Rosso",                            p: "11,00" },
  { l: "Whiskey Sour",              d: "Bourbon, Zitronensaft, Zuckersirup, Eiweiß",              p: "11,00" },
  { l: "Aperol Spritz",             d: "Aperol, Prosecco, Soda, Orange",                          p: "9,50" },
  { l: "Gin Tonic",                 d: "Tanqueray oder Hendrick's, Fever-Tree Tonic",             p: "11,00" },
  { l: "Espresso Martini",          d: "Wodka, Kahlua, frischer Espresso",                        p: "12,00" },
  { l: "Moscow Mule",               d: "Wodka, Limette, Ginger Beer",                             p: "10,50" },
  { cat: "ALKOHOLFREI (MOCKTAILS)" },
  { l: "Virgin Mojito",             d: "Limette, Minze, Rohrzucker, Soda",                        p: "7,50" },
  { l: "Seedlip Garden & Tonic",    d: "Seedlip Garden 108, Fever-Tree Mediterranean",            p: "9,00" },
  { l: "Berry Smash",               d: "Gemischte Beeren, Basilikum, Zitrone, Ginger Ale",        p: "7,50" },
  { cat: "WEINE GLAS 0,125L" },
  { l: "Grüner Veltliner",          d: "Weingut Loimer, Kamptal",                                 p: "6,50" },
  { l: "Riesling",                  d: "Weingut Schloss Gobelsburg, Kamptal",                     p: "7,00" },
  { l: "Zweigelt",                  d: "Weingut Pittnauer, Burgenland",                           p: "7,50" },
  { l: "Crémant Rosé",              d: "Szigeti, Burgenland",                                     p: "8,50" },
  { cat: "BIERE" },
  { l: "Ottakringer Helles 0,3L",   d: "vom Fass",                                                p: "4,20" },
  { l: "Stiegl Pils 0,5L",          d: "Flasche",                                                 p: "4,80" },
  { l: "Brewdog Punk IPA",          d: "Flasche 0,33L",                                           p: "5,50" },
  { cat: "SOFTS" },
  { l: "Fever-Tree Tonic",          d: "200ml",                                                   p: "4,20" },
  { l: "Almdudler / Spezi / Cola",  d: "0,33L",                                                   p: "3,80" },
  { l: "Mineralwasser Vöslauer",    d: "prickelnd oder still",                                    p: "3,50" },
  { footer: "Alle Preise in EUR inkl. USt. · Happy Hour Mi & Do 18–20 Uhr: Signature Cocktails zum halben Preis · hallo@bar-nachtschicht.at" }
];

function buildContent() {
  const lines = [];
  lines.push("BT");
  let y = 800;
  for (const item of bar) {
    if (item.h) {
      lines.push(`/F2 22 Tf 1 0 0 1 60 ${y} Tm (${enc(item.h)}) Tj`);
      y -= 22;
      lines.push(`/F1 11 Tf 1 0 0 1 60 ${y} Tm 0.4 0.4 0.4 rg (${enc(item.s)}) Tj 0 0 0 rg`);
      y -= 28;
    } else if (item.cat) {
      y -= 6;
      lines.push(`/F2 10 Tf 1 0 0 1 60 ${y} Tm 0.55 0.42 0.19 rg (${enc(item.cat)}) Tj 0 0 0 rg`);
      y -= 16;
    } else if (item.footer) {
      y -= 20;
      lines.push(`/F1 7.5 Tf 1 0 0 1 60 ${y} Tm 0.5 0.5 0.5 rg (${enc(item.footer)}) Tj 0 0 0 rg`);
    } else {
      lines.push(`/F2 10 Tf 1 0 0 1 60 ${y} Tm (${enc(item.l)}) Tj`);
      lines.push(`/F1 10 Tf 1 0 0 1 490 ${y} Tm (EUR ${enc(item.p)}) Tj`);
      y -= 12;
      lines.push(`/F1 8.5 Tf 1 0 0 1 60 ${y} Tm 0.45 0.45 0.45 rg (${enc(item.d)}) Tj 0 0 0 rg`);
      y -= 14;
    }
  }
  lines.push("ET");
  return lines.join("\n");
}

function buildPdf() {
  const content = buildContent();
  const objs = [];
  objs.push("<</Type/Catalog/Pages 2 0 R>>");
  objs.push("<</Type/Pages/Count 1/Kids[3 0 R]>>");
  objs.push("<</Type/Page/Parent 2 0 R/MediaBox[0 0 595 842]/Contents 4 0 R/Resources<</Font<</F1 5 0 R/F2 6 0 R>>>>>>");
  objs.push(`<</Length ${Buffer.byteLength(content, "latin1")}>>\nstream\n${content}\nendstream`);
  objs.push("<</Type/Font/Subtype/Type1/BaseFont/Helvetica/Encoding/WinAnsiEncoding>>");
  objs.push("<</Type/Font/Subtype/Type1/BaseFont/Helvetica-Bold/Encoding/WinAnsiEncoding>>");

  let pdf = "%PDF-1.4\n%\xe2\xe3\xcf\xd3\n";
  const offsets = [];
  for (let i = 0; i < objs.length; i++) {
    offsets.push(Buffer.byteLength(pdf, "latin1"));
    pdf += `${i + 1} 0 obj\n${objs[i]}\nendobj\n`;
  }
  const xrefStart = Buffer.byteLength(pdf, "latin1");
  pdf += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n`;
  for (const off of offsets) pdf += `${String(off).padStart(10, "0")} 00000 n \n`;
  pdf += `trailer\n<</Size ${objs.length + 1}/Root 1 0 R>>\nstartxref\n${xrefStart}\n%%EOF`;
  return Buffer.from(pdf, "latin1");
}

async function uploadToStorage(path, buffer, contentType) {
  const r = await fetch(`${SUPABASE_URL}/storage/v1/object/customer-assets/${path}`, {
    method: "POST",
    headers: { ...H, "Content-Type": contentType, "x-upsert": "true" },
    body: buffer,
  });
  if (!r.ok) throw new Error(`Storage upload ${path}: ${r.status} ${await r.text()}`);
  const ts = Date.now();
  return `${SUPABASE_URL}/storage/v1/object/public/customer-assets/${path}?v=${ts}`;
}

// ── Main ───────────────────────────────────────────────────────────────
(async () => {
  // Order finden
  const orderRes = await fetch(`${SUPABASE_URL}/rest/v1/orders?subdomain=eq.${encodeURIComponent(SUBDOMAIN)}&select=id,user_id`, { headers: H });
  const orders = await orderRes.json();
  if (!orders.length) { console.error(`FEHLER: Order "${SUBDOMAIN}" nicht gefunden.`); process.exit(1); }
  const { id, user_id } = orders[0];
  const ownerDir = user_id || "_testdata";
  console.log(`→ Order gefunden: ${id}`);

  // 1) Logo hochladen
  const logoSvg = Buffer.from(buildLogoSvg(), "utf8");
  const logoUrl = await uploadToStorage(`${ownerDir}/logo.svg`, logoSvg, "image/svg+xml");
  console.log(`  ✓ Logo hochgeladen: ${logoUrl}`);

  // 2) PDF generieren + hochladen
  const pdfBuffer = buildPdf();
  console.log(`  · PDF: ${pdfBuffer.length} bytes`);
  const pdfUrl = await uploadToStorage(`${ownerDir}/preisliste.pdf`, pdfBuffer, "application/pdf");
  console.log(`  ✓ PDF hochgeladen:  ${pdfUrl}`);

  // 3) Order patchen (Logo, Preisliste, Team leeren, gut_zu_wissen als String mit \n,
  //    Ueber-uns-Text ohne Teamnamen)
  const patch = {
    url_logo: logoUrl,
    url_preisliste: pdfUrl,
    team_members: [],
    gut_zu_wissen: [
      "Happy Hour: Mi & Do 18–20 Uhr (Signature-Drinks zum halben Preis)",
      "Wir akzeptieren alle gaengigen Karten + Apple/Google Pay",
      "Barrierefreier Zugang ueber den Seiteneingang in der Stolberggasse",
    ].join("\n"),
    text_ueber_uns: "Die Nachtschicht liegt im Herzen Wiens und setzt auf handverlesene Spirituosen und handwerklich zubereitete Drinks. Seit 2017 servieren wir ueber 80 Cocktails — von zeitlosen Klassikern bis zu Kreationen, die es nur hier gibt. Am Wochenende verwandelt sich die Bar mit wechselnden DJs in eine Buehne fuer Deep House, Nu Disco und Soul — bis in die fruehen Morgenstunden. Wer Wien nach Einbruch der Dunkelheit erleben moechte, findet in der Nachtschicht einen Ort mit Substanz.",
  };
  const patchRes = await fetch(`${SUPABASE_URL}/rest/v1/orders?id=eq.${id}`, {
    method: "PATCH",
    headers: { ...H, "Content-Type": "application/json", "Prefer": "return=minimal" },
    body: JSON.stringify(patch),
  });
  if (!patchRes.ok) { console.error(`Order-Update fehlgeschlagen: ${await patchRes.text()}`); process.exit(1); }
  console.log(`  ✓ Order aktualisiert: url_logo, url_preisliste gesetzt, team_members geleert`);

  // 4) Build neu ausloesen
  const buildRes = await fetch(`${SITE_URL}/api/start-build`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ order_id: id }),
  });
  console.log(`  → Build neu ausgeloest:`, await buildRes.json().catch(() => ({})));

  console.log(`\n⏳ Neu-Generierung laeuft (~20–40s)…`);
  console.log(`   Live:       ${SITE_URL}/s/${SUBDOMAIN}`);
  console.log(`   Logo:       ${logoUrl}`);
  console.log(`   Preisliste: ${pdfUrl}\n`);
})().catch(e => { console.error("FEHLER:", e.message); process.exit(1); });
