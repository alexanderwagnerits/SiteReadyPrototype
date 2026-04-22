// Seed-Script: Legt eine komplette Bar-Test-Order in Supabase an
// und triggert die Website-Generierung auf der Live-URL.
//
// Aufruf:
//   SUPABASE_SERVICE_KEY=xxx node scripts/seed-test-bar.js
//
// Optional:
//   SUPABASE_URL=https://brulvtqeazkgcxkimdve.supabase.co   (default)
//   SITE_URL=https://sitereadyprototype.pages.dev           (default)
//   SUBDOMAIN=bar-nachtschicht                              (default)

const crypto = require("crypto");

const SUPABASE_URL = process.env.SUPABASE_URL || "https://brulvtqeazkgcxkimdve.supabase.co";
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const SITE_URL = process.env.SITE_URL || "https://sitereadyprototype.pages.dev";
const SUBDOMAIN = process.env.SUBDOMAIN || "bar-nachtschicht";

if (!SERVICE_KEY) {
  console.error("FEHLER: SUPABASE_SERVICE_KEY env-Variable fehlt.");
  process.exit(1);
}

const H = {
  "apikey": SERVICE_KEY,
  "Authorization": `Bearer ${SERVICE_KEY}`,
  "Content-Type": "application/json",
};

async function sbFetch(path, opts = {}) {
  const r = await fetch(`${SUPABASE_URL}${path}`, { ...opts, headers: { ...H, ...(opts.headers || {}) } });
  if (!r.ok) {
    const t = await r.text();
    throw new Error(`Supabase ${path} ${r.status}: ${t}`);
  }
  return r;
}

// ── Bar-Daten ──────────────────────────────────────────────────────────
const accent = "#c9a961"; // warmes Gold
const stil = "elegant";

const order = {
  id: crypto.randomUUID(),
  user_id: null,
  status: "pending",
  subdomain: SUBDOMAIN,

  // Kontaktperson (fiktiv)
  vorname: "Sophie",
  nachname: "Bauer",

  // Firma
  firmenname: "Bar Nachtschicht",
  branche: "bar",
  branche_label: "Bar / Lounge",
  kurzbeschreibung: "Klassische Cocktailbar im Herzen Wiens mit handverlesenen Spirituosen, Live-DJs am Wochenende und stilvoller Atmosphaere bis in die frueen Morgenstunden.",
  bundesland: "Wien",

  // Leistungen (aus BRANCHEN.bar + eigene)
  leistungen: ["Cocktails & Drinks", "Events & Partys", "DJ & Live-Musik", "Private Feiern", "Afterwork", "Catering"],
  leistungen_beschreibungen: {
    "Cocktails & Drinks": "Ueber 80 Cocktails auf unserer Karte — von Klassikern bis zu hauseigenen Kreationen. Unsere Bartender beraten dich gern persoenlich.",
    "Events & Partys": "Themenabende, Album-Release-Partys, Tasting-Events. Folge uns auf Instagram fuer das aktuelle Programm.",
    "DJ & Live-Musik": "Jeden Freitag & Samstag ab 22 Uhr wechselnde DJs — Deep House, Nu Disco, Funk & Soul.",
    "Private Feiern": "Geburtstag, Firmenevent oder Junggesellenabschied? Wir richten die Bar nach deinen Wuenschen her — ab 20 Personen exklusiv.",
    "Afterwork": "Happy Hour Mittwoch & Donnerstag 18–20 Uhr. Ausgewaehlte Signature-Drinks zum halben Preis.",
    "Catering": "Mobile Cocktailbar fuer dein Event. Wir kommen mit Equipment, Bartendern und allem was es braucht."
  },
  leistungen_preise: {
    "Cocktails & Drinks": "ab EUR 11",
    "Private Feiern": "auf Anfrage",
    "Catering": "ab EUR 450 Grundpauschale"
  },

  // Merkmale
  notdienst: false, meisterbetrieb: false, kostenvoranschlag: false,
  hausbesuche: false, terminvereinbarung: false, foerderungsberatung: false,
  lieferservice: false, barrierefrei: true, parkplaetze: false,
  erstgespraech_gratis: false, online_beratung: false, ratenzahlung: false,
  fruehstueck: false, wlan: true, haustiere: false, online_shop: false,

  // Adresse & Kontakt
  adresse: "Margaretenstrasse 83",
  plz: "1050",
  ort: "Wien",
  telefon: "+43 1 585 67 89",
  email: "hallo@bar-nachtschicht.at",

  // Unternehmensdaten (Pflicht fuer Impressum)
  uid_nummer: "ATU12345678",
  unternehmensform: "Einzelunternehmen",
  kammer_berufsrecht: "Mitglied der WKO Wien, Fachgruppe Gastronomie",
  aufsichtsbehoerde: "Magistratisches Bezirksamt fuer den 5. Bezirk",

  // Oeffnungszeiten (Bar-typisch: abends, Wochenende spaet)
  oeffnungszeiten: "Mi–Do 18:00–01:00, Fr–Sa 18:00–03:00, So–Di geschlossen",
  oeffnungszeiten_custom: {
    mo: { closed: true },
    di: { closed: true },
    mi: { open: "18:00", close: "01:00" },
    do: { open: "18:00", close: "01:00" },
    fr: { open: "18:00", close: "03:00" },
    sa: { open: "18:00", close: "03:00" },
    so: { closed: true }
  },

  // Design
  stil,
  custom_accent: accent,
  custom_font: null,

  // Social
  instagram: "https://instagram.com/bar_nachtschicht",
  facebook: "https://facebook.com/bar.nachtschicht",
  linkedin: null,
  tiktok: null,

  // Galerie (Unsplash — free license, bar themes)
  galerie: [
    { url: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1600&q=80" },
    { url: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=1600&q=80" },
    { url: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=1600&q=80" },
    { url: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=1600&q=80" },
    { url: "https://images.unsplash.com/photo-1546171753-97d7676e4602?w=1600&q=80" },
    { url: "https://images.unsplash.com/photo-1567696911980-2eed69a46042?w=1600&q=80" },
    { url: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=1600&q=80" },
    { url: "https://images.unsplash.com/photo-1558645836-e44122a743ee?w=1600&q=80" }
  ],

  // Team
  team_members: [
    { name: "Sophie Bauer", rolle: "Inhaberin & Head Bartender", foto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80" },
    { name: "Marco Gruber", rolle: "Bar-Manager", foto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80" },
    { name: "Lisa Hofer", rolle: "Bartenderin", foto: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&q=80" }
  ],

  // FAQ
  faq: [
    { frage: "Kann ich einen Tisch reservieren?", antwort: "Ja — telefonisch unter +43 1 585 67 89 oder per DM auf Instagram. Ab 4 Personen empfehlen wir eine Reservierung, besonders am Wochenende." },
    { frage: "Gibt es einen Dresscode?", antwort: "Nein, zieh an was dich gut fuehlen laesst. Wir bitten nur um sportliche Eleganz — keine Trainingsanzuege oder Badelatschen." },
    { frage: "Habt ihr alkoholfreie Cocktails?", antwort: "Klar. Ueber 15 Mocktails stehen auf unserer Karte, von fruchtig bis kraeuterbetont. Unsere Bartender kreieren auch gern etwas Eigenes fuer dich." },
    { frage: "Kann ich die Bar fuer eine private Feier buchen?", antwort: "Ja, ab 20 Personen exklusiv. Schreib uns eine Mail an hallo@bar-nachtschicht.at mit Datum, Gaestezahl und Wunschvorstellung — wir melden uns innerhalb von 48 Stunden." },
    { frage: "Gibt es Parkmoeglichkeiten?", antwort: "Die Margaretenstrasse hat Kurzparkzone. Die Garage Schoenbrunner Strasse (2 Min zu Fuss) ist durchgehend geoeffnet." },
    { frage: "Ab welchem Alter darf ich bei euch rein?", antwort: "Ab 18 Jahren. Bitte halte einen gueltigen Lichtbildausweis bereit — wir kontrollieren konsequent." }
  ],

  // Zahlen & Fakten
  fakten: [
    { zahl: "80+", label: "Cocktails auf der Karte" },
    { zahl: "9", label: "Jahre in der Margaretenstrasse" },
    { zahl: "4.8", label: "Sterne auf Google (312 Bewertungen)" },
    { zahl: "50+", label: "Private Events pro Jahr" }
  ],

  // Bewertungen
  bewertungen: [
    { autor: "Julia K.", text: "Beste Gin-Auswahl in Wien. Marco weiss wirklich was er tut — hab gelernt was der Unterschied zwischen London Dry und New Western ist.", sterne: 5 },
    { autor: "Daniel R.", text: "Perfekt fuer Dates. Dunkel, stimmungsvoll, nicht zu laut. Die Negroni Variation war aussergewoehnlich gut.", sterne: 5 },
    { autor: "Sarah M.", text: "Hab hier meinen 30er gefeiert — das Team hat sich extrem bemueht, Sophie war persoenlich da und hat mitgemixt. Unvergesslich.", sterne: 5 }
  ],

  // Gut zu wissen
  gut_zu_wissen: [
    "Happy Hour: Mi & Do 18–20 Uhr (Signature-Drinks zum halben Preis)",
    "Wir akzeptieren alle gaengigen Karten + Apple/Google Pay",
    "Barrierefreier Zugang ueber den Seiteneingang in der Stolberggasse"
  ],

  // Auto-Generated markers (damit Portal zeigt was editierbar ist)
  ai_generated: ["bewertungen"],

  website_ziel: null,
  regen_requested: false,
};

// Palette (elegant style) — Spaltennamen laut src/data.js:buildPaletteFromAccent
Object.assign(order, {
  custom_color: "#2a1810",
  custom_bg: "#f9f4ef",
  custom_sep: "#eaddcf",
  custom_text: "#2c2620",
  custom_text_muted: "#6b6058",
});

// ── Ausfuehren ─────────────────────────────────────────────────────────
(async () => {
  console.log(`\n→ Seede Test-Bar "${order.firmenname}" als Subdomain "/${SUBDOMAIN}"`);

  // 1) Alte Order mit gleicher Subdomain entfernen (idempotent)
  try {
    await sbFetch(`/rest/v1/orders?subdomain=eq.${encodeURIComponent(SUBDOMAIN)}`, { method: "DELETE" });
    console.log("  ✓ Alte Order mit gleicher Subdomain entfernt (falls vorhanden)");
  } catch (e) {
    console.warn("  ! Konnte alte Order nicht loeschen:", e.message);
  }

  // 2) Neue Order einfuegen
  const insertRes = await sbFetch("/rest/v1/orders", {
    method: "POST",
    headers: { "Prefer": "return=representation" },
    body: JSON.stringify(order),
  });
  const inserted = await insertRes.json();
  const id = inserted[0]?.id || order.id;
  console.log(`  ✓ Order in Supabase angelegt (id: ${id})`);

  // 3) Build triggern
  console.log(`→ Triggere /api/start-build auf ${SITE_URL}`);
  const buildRes = await fetch(`${SITE_URL}/api/start-build`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ order_id: id }),
  });
  const buildJson = await buildRes.json().catch(() => ({}));
  if (!buildRes.ok) {
    console.error(`  ✗ start-build Fehler (${buildRes.status}):`, buildJson);
    process.exit(1);
  }
  console.log("  ✓ Build gestartet:", buildJson);

  console.log("\n⏳ Claude generiert jetzt im Hintergrund (~20–40s)…");
  console.log(`   Live:  ${SITE_URL}/s/${SUBDOMAIN}`);
  console.log(`   Admin: ${SITE_URL}/admin  (Order "${order.firmenname}")`);
  console.log("\nTipp: PDF-Preisliste spaeter im Portal unter einer Leistung hochladen.\n");
})().catch(e => {
  console.error("FEHLER:", e.message);
  process.exit(1);
});
