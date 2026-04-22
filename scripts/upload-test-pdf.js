// Generiert eine Barkarte als PDF, lädt sie in Supabase Storage
// und verknüpft sie mit der Test-Bar-Order (url_preisliste).
//
// Aufruf:
//   SUPABASE_SERVICE_KEY=xxx node scripts/upload-test-pdf.js

const crypto = require("crypto");

const SUPABASE_URL = process.env.SUPABASE_URL || "https://brulvtqeazkgcxkimdve.supabase.co";
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const SITE_URL = process.env.SITE_URL || "https://sitereadyprototype.pages.dev";
const SUBDOMAIN = process.env.SUBDOMAIN || "bar-nachtschicht";

if (!SERVICE_KEY) {
  console.error("FEHLER: SUPABASE_SERVICE_KEY env-Variable fehlt.");
  process.exit(1);
}

// ── PDF generieren (pure JS, keine Library) ────────────────────────────
// Minimales PDF 1.4 mit einer A4-Seite, Helvetica, mehrere Text-Bloecke.
// WinAnsi encoding — ae/oe/ue/ss als \344 \366 \374 \337 (PDF octal escapes).
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

// Content-Stream bauen
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
      // Linie simulieren via langer Unterstrich — oder weglassen
    } else if (item.cat) {
      y -= 6;
      lines.push(`/F2 10 Tf 1 0 0 1 60 ${y} Tm 0.55 0.42 0.19 rg (${enc(item.cat)}) Tj 0 0 0 rg`);
      y -= 16;
    } else if (item.footer) {
      y -= 20;
      lines.push(`/F1 7.5 Tf 1 0 0 1 60 ${y} Tm 0.5 0.5 0.5 rg (${enc(item.footer)}) Tj 0 0 0 rg`);
    } else {
      // Zeile: Name (links) ... Preis (rechts), Beschreibung (links, kleiner)
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
  for (const off of offsets) {
    pdf += `${String(off).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<</Size ${objs.length + 1}/Root 1 0 R>>\nstartxref\n${xrefStart}\n%%EOF`;
  return Buffer.from(pdf, "latin1");
}

const pdfBuffer = buildPdf();
console.log(`✓ PDF generiert (${pdfBuffer.length} bytes)`);

// ── Upload ──────────────────────────────────────────────────────────────
const H = { "apikey": SERVICE_KEY, "Authorization": `Bearer ${SERVICE_KEY}` };

(async () => {
  // 1) Order lookup fuer Storage-Pfad (user_id)
  const orderRes = await fetch(`${SUPABASE_URL}/rest/v1/orders?subdomain=eq.${encodeURIComponent(SUBDOMAIN)}&select=id,user_id`, { headers: H });
  const orders = await orderRes.json();
  if (!orders.length) {
    console.error(`FEHLER: Order mit subdomain="${SUBDOMAIN}" nicht gefunden.`);
    process.exit(1);
  }
  const { id, user_id } = orders[0];
  // Ohne user_id legen wir unter "_testdata/" ab
  const ownerId = user_id || "_testdata";
  const ts = Date.now();
  const path = `${ownerId}/preisliste.pdf`;
  console.log(`→ Lade PDF nach customer-assets/${path}`);

  // 2) Upload via Storage REST (upsert)
  const uploadRes = await fetch(`${SUPABASE_URL}/storage/v1/object/customer-assets/${path}`, {
    method: "POST",
    headers: { ...H, "Content-Type": "application/pdf", "x-upsert": "true" },
    body: pdfBuffer,
  });
  if (!uploadRes.ok) {
    const t = await uploadRes.text();
    console.error(`  ✗ Upload fehlgeschlagen (${uploadRes.status}):`, t);
    process.exit(1);
  }
  const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/customer-assets/${path}?v=${ts}`;
  console.log(`  ✓ hochgeladen: ${publicUrl}`);

  // 3) Order updaten (url_preisliste)
  const patchRes = await fetch(`${SUPABASE_URL}/rest/v1/orders?id=eq.${id}`, {
    method: "PATCH",
    headers: { ...H, "Content-Type": "application/json", "Prefer": "return=minimal" },
    body: JSON.stringify({ url_preisliste: publicUrl }),
  });
  if (!patchRes.ok) {
    const t = await patchRes.text();
    console.error(`  ✗ Order-Update fehlgeschlagen (${patchRes.status}):`, t);
    process.exit(1);
  }
  console.log(`  ✓ Order url_preisliste aktualisiert`);

  // 4) Build neu ausloesen (damit Template den Preisliste-Button einbaut)
  const buildRes = await fetch(`${SITE_URL}/api/start-build`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ order_id: id }),
  });
  const buildJson = await buildRes.json().catch(() => ({}));
  console.log(`  → Build neu ausgeloest:`, buildJson);

  console.log(`\n⏳ Claude generiert neu (~20–40s)…`);
  console.log(`   Live:      ${SITE_URL}/s/${SUBDOMAIN}`);
  console.log(`   PDF direkt: ${publicUrl}\n`);
})().catch(e => {
  console.error("FEHLER:", e.message);
  process.exit(1);
});
