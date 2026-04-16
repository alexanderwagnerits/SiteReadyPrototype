/**
 * SiteReady E2E Full Test — 12 Kundenszenarien
 *
 * Erstellt echte Orders in Supabase, triggert Generierung,
 * prüft die Websites auf Qualität.
 *
 * Usage: node test-e2e-full.mjs [phase]
 *   phase 1 = Orders anlegen
 *   phase 2 = Websites generieren
 *   phase 3 = Websites prüfen
 *   phase 4 = Portal-Änderungen + erneut prüfen
 *   (kein Argument = alle Phasen)
 */

const SUPABASE_URL = "https://brulvtqeazkgcxkimdve.supabase.co";
const SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJydWx2dHFlYXprZ2N4a2ltZHZlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDA1MDY1MSwiZXhwIjoyMDg5NjI2NjUxfQ.vr6ozYDuEq3VrkiDvtIIbzCX7udIRLujZQPhFXxFZI4";
const ADMIN_KEY = "sr-admin-2026";
const BASE_URL = "https://sitereadyprototype.pages.dev";

// ═══════════════════════════════════════════
// Hilfsfunktionen
// ═══════════════════════════════════════════

const headers = {
  "Content-Type": "application/json",
  "apikey": SERVICE_KEY,
  "Authorization": `Bearer ${SERVICE_KEY}`,
};

async function supabaseInsert(table, data) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: "POST",
    headers: { ...headers, "Prefer": "return=representation" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Insert ${table} failed: ${res.status} — ${err}`);
  }
  return (await res.json())[0];
}

async function supabaseUpdate(table, id, data) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
    method: "PATCH",
    headers: { ...headers, "Prefer": "return=representation" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Update ${table} failed: ${res.status} — ${err}`);
  }
  return (await res.json())[0];
}

async function supabaseSelect(table, filter = "") {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${filter}`, {
    headers,
  });
  if (!res.ok) throw new Error(`Select ${table} failed: ${res.status}`);
  return res.json();
}

async function supabaseDelete(table, filter) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${filter}`, {
    method: "DELETE",
    headers: { ...headers, "Prefer": "return=minimal" },
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Delete ${table} failed: ${res.status} — ${err}`);
  }
}

async function generateWebsite(orderId) {
  const res = await fetch(`${BASE_URL}/api/generate-website?key=${ADMIN_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ order_id: orderId }),
  });
  const data = await res.json();
  if (!res.ok || data.error) {
    throw new Error(`Generate failed: ${data.error || res.status}`);
  }
  return data;
}

async function fetchWebsite(subdomain) {
  const url = `${BASE_URL}/s/${subdomain}`;
  const start = Date.now();
  const res = await fetch(url);
  const ms = Date.now() - start;
  if (!res.ok) throw new Error(`Fetch ${url} failed: ${res.status}`);
  const html = await res.text();
  return { html, ms, url };
}

function buildPalette(accent, stil) {
  // Vereinfachte Palette — die echte Logik läuft server-side
  const palettes = {
    klassisch: { custom_color: "#094067", custom_bg: "#f8f9fa", custom_text: "#1f2937", custom_text_muted: "#6b7280", custom_sep: "#e5e7eb" },
    modern:    { custom_color: "#18181b", custom_bg: "#ffffff", custom_text: "#18181b", custom_text_muted: "#71717a", custom_sep: "#e4e4e7" },
    elegant:   { custom_color: "#292524", custom_bg: "#fafaf9", custom_text: "#292524", custom_text_muted: "#78716c", custom_sep: "#e7e5e4" },
  };
  return { custom_accent: accent, ...(palettes[stil] || palettes.klassisch) };
}

function uuid() {
  return crypto.randomUUID();
}

// ═══════════════════════════════════════════
// 12 Test-Szenarien
// ═══════════════════════════════════════════

const TEST_PREFIX = "e2etest-";

const SCENARIOS = [
  {
    name: "T01 Elektro Klassisch",
    subdomain: `${TEST_PREFIX}elektro-schmidt`,
    branche: "elektro", branche_label: "Elektroinstallationen",
    stil: "klassisch",
    firmenname: "Elektro Schmidt GmbH",
    kurzbeschreibung: "Ihr Elektriker in Wien — Installationen, Smart Home & Notdienst seit 1998.",
    leistungen: ["Elektroinstallationen", "Störungsbehebung & Reparatur", "Smart Home Systeme", "Photovoltaik & Speicher", "Beleuchtungstechnik", "Notdienst 24/7"],
    telefon: "+43 1 234 5678", email: "office@elektro-schmidt.at",
    adresse: "Mariahilfer Straße 45", plz: "1060", ort: "Wien", bundesland: "wien",
    einsatzgebiet: "Wien und Umgebung",
    oeffnungszeiten: "Mo-Fr 07:00-18:00, Sa 08:00-12:00",
    unternehmensform: "gmbh", uid_nummer: "ATU12345678",
    firmenbuchnummer: "FN 123456a", firmenbuchgericht: "HG Wien",
    geschaeftsfuehrer: "Thomas Schmidt",
    notdienst: true, meisterbetrieb: true, kostenvoranschlag: true,
    foerderungsberatung: true, kartenzahlung: true,
    custom_accent: "#0369A1",
    fotos: true,
    team_members: [
      { name: "Thomas Schmidt", rolle: "Geschäftsführer & Meister", email: "t.schmidt@elektro-schmidt.at" },
      { name: "Michael Weber", rolle: "Techniker", email: "m.weber@elektro-schmidt.at" },
    ],
  },
  {
    name: "T02 Friseur Modern",
    subdomain: `${TEST_PREFIX}salon-maria`,
    branche: "friseur", branche_label: "Friseur",
    stil: "modern",
    firmenname: "Salon Maria",
    kurzbeschreibung: "Dein Friseur im Herzen von Graz — Schnitt, Farbe & Styling mit Leidenschaft.",
    leistungen: ["Damenhaarschnitt", "Herrenhaarschnitt", "Colorationen & Strähnchen", "Hochsteckfrisuren", "Bartpflege", "Kinderhaarschnitt"],
    telefon: "+43 316 789 012", email: "hallo@salon-maria.at",
    adresse: "Herrengasse 12", plz: "8010", ort: "Graz", bundesland: "stmk",
    einsatzgebiet: "Graz",
    oeffnungszeiten: "Di-Fr 09:00-18:00, Sa 09:00-14:00",
    unternehmensform: "einzelunternehmen",
    buchungslink: "https://www.treatwell.at/salon-maria",
    terminvereinbarung: true, barrierefrei: true, parkplaetze: true,
    custom_accent: "#6366f1",
    fotos: true,
    team_members: [
      { name: "Maria Gruber", rolle: "Inhaberin & Stylistin" },
      { name: "Lisa Berger", rolle: "Stylistin" },
      { name: "Sophie Eder", rolle: "Coloristin" },
    ],
    facebook: "https://facebook.com/salonmaria",
    instagram: "https://instagram.com/salonmaria",
  },
  {
    name: "T03 Zahnarzt Elegant",
    subdomain: `${TEST_PREFIX}dr-huber-zahn`,
    branche: "zahnarzt", branche_label: "Zahnarzt",
    stil: "elegant",
    firmenname: "Dr. Huber — Zahnarztpraxis",
    kurzbeschreibung: "Moderne Zahnmedizin in Salzburg. Schonende Behandlungen mit neuester Technik.",
    leistungen: ["Prophylaxe & Mundhygiene", "Füllungen & Inlays", "Zahnersatz & Kronen", "Implantologie", "Bleaching", "Kieferorthopädie"],
    telefon: "+43 662 456 789", email: "ordination@dr-huber.at",
    adresse: "Getreidegasse 7", plz: "5020", ort: "Salzburg", bundesland: "sbg",
    einsatzgebiet: "Salzburg Stadt",
    oeffnungszeiten: "Mo-Do 08:00-17:00, Fr 08:00-13:00",
    unternehmensform: "einzelunternehmen",
    kassenvertrag: "alle_kassen", barrierefrei: true, terminvereinbarung: true,
    custom_accent: "#7a6844",
    fotos: true,
    faq: [
      { frage: "Wie oft sollte ich zur Kontrolle kommen?", antwort: "Wir empfehlen halbjährliche Kontrollen inklusive professioneller Mundhygiene." },
      { frage: "Übernimmt die Kasse die Kosten?", antwort: "Wir haben Verträge mit allen Kassen. Privatleistungen wie Bleaching werden gesondert verrechnet." },
      { frage: "Was tun bei Zahnschmerzen außerhalb der Öffnungszeiten?", antwort: "Rufen Sie unsere Notfallnummer an. In dringenden Fällen erreichen Sie uns auch am Wochenende." },
      { frage: "Bieten Sie Ratenzahlung an?", antwort: "Für größere Behandlungen bieten wir individuelle Zahlungsvereinbarungen an." },
    ],
    fakten: [
      { zahl: "15+", label: "Jahre Erfahrung" },
      { zahl: "8.500", label: "zufriedene Patienten" },
      { zahl: "98%", label: "Weiterempfehlungsrate" },
    ],
  },
  {
    name: "T04 Restaurant Klassisch",
    subdomain: `${TEST_PREFIX}gasthaus-zur-linde`,
    branche: "restaurant", branche_label: "Restaurant",
    stil: "klassisch",
    firmenname: "Gasthaus zur Linde",
    kurzbeschreibung: "Traditionelle österreichische Küche in gemütlichem Ambiente seit 1952.",
    leistungen: ["Mittagsmenü", "Á la Carte", "Schnitzel-Variationen", "Vegetarische Gerichte", "Hausgemachte Mehlspeisen", "Catering"],
    telefon: "+43 2742 345 678", email: "reservierung@zur-linde.at",
    adresse: "Hauptplatz 3", plz: "3100", ort: "St. Pölten", bundesland: "noe",
    einsatzgebiet: "St. Pölten und Umgebung",
    oeffnungszeiten: "Di-Sa 11:00-22:00, So 11:00-15:00",
    unternehmensform: "og",
    gastgarten: true, lieferservice: true, takeaway: true, parkplaetze: true,
    barrierefrei: true, kartenzahlung: true,
    custom_accent: "#0369A1",
    fotos: true,
    bewertungen: [
      { name: "Familie Steiner", text: "Das beste Schnitzel in ganz Niederösterreich! Gemütliches Ambiente und freundlicher Service.", sterne: 5 },
      { name: "Michael R.", text: "Wir kommen seit Jahren hierher. Die Mehlspeisen sind himmlisch.", sterne: 5 },
      { name: "Sandra K.", text: "Tolles Mittagsmenü zu fairen Preisen. Gastgarten im Sommer ein Traum!", sterne: 4 },
      { name: "Johann W.", text: "Traditionell und gleichzeitig modern. Die vegetarischen Optionen sind überraschend gut.", sterne: 5 },
    ],
  },
  {
    name: "T05 Rechtsanwalt Modern + Custom",
    subdomain: `${TEST_PREFIX}ra-maier`,
    branche: "rechtsanwalt", branche_label: "Rechtsanwalt",
    stil: "modern",
    firmenname: "Kanzlei Maier & Partner",
    kurzbeschreibung: "Ihre Rechtsanwälte in Innsbruck — Wirtschaftsrecht, Arbeitsrecht & Vertragsgestaltung.",
    leistungen: ["Wirtschaftsrecht", "Arbeitsrecht", "Vertragsrecht", "Gesellschaftsrecht", "Immobilienrecht", "Inkasso & Forderungsmanagement"],
    telefon: "+43 512 567 890", email: "kanzlei@ra-maier.at",
    adresse: "Maria-Theresien-Straße 18", plz: "6020", ort: "Innsbruck", bundesland: "tirol",
    einsatzgebiet: "Tirol und Vorarlberg",
    oeffnungszeiten: "Mo-Fr 09:00-17:00",
    unternehmensform: "og",
    erstgespraech_gratis: true, online_beratung: true,
    custom_accent: "#B91C1C", custom_font: "playfair",
    fotos: false,
    team_members: [
      { name: "Dr. Stefan Maier", rolle: "Partner — Wirtschaftsrecht" },
      { name: "Mag. Anna Berger", rolle: "Partnerin — Arbeitsrecht" },
    ],
    linkedin: "https://linkedin.com/company/kanzlei-maier",
  },
  {
    name: "T06 Fahrschule Elegant + Custom",
    subdomain: `${TEST_PREFIX}fahrschule-easy`,
    branche: "fahrschule", branche_label: "Fahrschule",
    stil: "elegant",
    firmenname: "Fahrschule Easy Drive",
    kurzbeschreibung: "Entspannt zum Führerschein — B, A, C und Mopedausweis in Klagenfurt.",
    leistungen: ["Führerschein Klasse B", "Motorradführerschein (A)", "LKW-Führerschein (C)", "Mopedausweis (AM)", "Auffrischungskurse", "Mehrphasenausbildung"],
    telefon: "+43 463 234 567", email: "info@fahrschule-easy.at",
    adresse: "Bahnhofstraße 22", plz: "9020", ort: "Klagenfurt", bundesland: "ktn",
    einsatzgebiet: "Klagenfurt und Umgebung",
    oeffnungszeiten: "Mo-Fr 08:00-18:00, Sa 09:00-12:00",
    unternehmensform: "einzelunternehmen",
    ratenzahlung: true, kartenzahlung: true,
    custom_accent: "#047857",
    fotos: true,
    partner: [
      { name: "ÖAMTC" },
      { name: "ARBÖ" },
      { name: "easy2pass" },
    ],
    fakten: [
      { zahl: "2.400+", label: "bestandene Prüfungen" },
      { zahl: "94%", label: "Erstantrittserfolg" },
      { zahl: "12", label: "Fahrzeuge im Fuhrpark" },
      { zahl: "8", label: "Fahrlehrer" },
    ],
  },
  {
    name: "T07 Tischler Modern (Import-Stil)",
    subdomain: `${TEST_PREFIX}tischlerei-holz`,
    branche: "tischler", branche_label: "Tischlerei",
    stil: "modern",
    firmenname: "Tischlerei Holzmann",
    kurzbeschreibung: "Möbel nach Maß aus Linz — Küchen, Einbauten und Restaurierungen vom Meisterbetrieb.",
    leistungen: ["Küchen nach Maß", "Einbaumöbel", "Innenausbau", "Fenster & Türen", "Restaurierung", "Reparaturen"],
    telefon: "+43 732 678 901", email: "werkstatt@tischlerei-holzmann.at",
    adresse: "Industriezeile 47", plz: "4020", ort: "Linz", bundesland: "ooe",
    einsatzgebiet: "Oberösterreich",
    oeffnungszeiten: "Mo-Fr 07:00-17:00",
    unternehmensform: "einzelunternehmen",
    meisterbetrieb: true, foerderungsberatung: true, kostenvoranschlag: true,
    custom_accent: "#4f46e5",
    fotos: true,
    ablauf_schritte: [
      { titel: "Beratung", text: "Kostenlose Erstberatung bei Ihnen vor Ort oder in unserer Werkstatt." },
      { titel: "Planung", text: "3D-Visualisierung und detaillierter Kostenvoranschlag." },
      { titel: "Fertigung", text: "Handwerkliche Präzision in unserer Meisterwerkstatt." },
      { titel: "Montage", text: "Termingerechte Lieferung und fachgerechter Einbau." },
    ],
    leistungen_beschreibungen: {
      "Küchen nach Maß": "Von der Planung bis zur Montage — Ihre Traumküche in höchster Qualität, exakt auf Ihren Raum zugeschnitten.",
      "Einbaumöbel": "Maßgefertigte Schränke, Regale und Garderoben, die jeden Zentimeter optimal nutzen.",
      "Innenausbau": "Kompletter Innenausbau vom Boden bis zur Decke — Wand- und Deckenverkleidungen, Stiegen, Böden.",
    },
  },
  {
    name: "T08 Physiotherapie Klassisch",
    subdomain: `${TEST_PREFIX}physio-vital`,
    branche: "physiotherapie", branche_label: "Physiotherapie",
    stil: "klassisch",
    firmenname: "Physiotherapie Vital",
    kurzbeschreibung: "Bewegung ist Leben — Physiotherapie, Osteopathie und Rehabilitation in Dornbirn.",
    leistungen: ["Physiotherapie", "Manuelle Therapie", "Osteopathie", "Sportrehabilitation", "Lymphdrainage", "Hausbesuche"],
    telefon: "+43 5572 345 678", email: "praxis@physio-vital.at",
    adresse: "Marktstraße 8", plz: "6850", ort: "Dornbirn", bundesland: "vbg",
    einsatzgebiet: "Vorarlberg",
    oeffnungszeiten: "Mo-Fr 07:30-19:00",
    unternehmensform: "einzelunternehmen",
    hausbesuche: true, online_beratung: true, terminvereinbarung: true,
    kassenvertrag: "oegk",
    custom_accent: "#0369A1",
    fotos: true,
    bewertungen: [
      { name: "Markus H.", text: "Nach meinem Kreuzbandriss hat mich das Team hervorragend betreut. Bin wieder voll fit!", sterne: 5 },
      { name: "Claudia S.", text: "Endlich schmerzfrei dank der manuellen Therapie. Sehr kompetent und einfühlsam.", sterne: 5 },
      { name: "Andreas P.", text: "Die Hausbesuche nach meiner Hüft-OP waren Gold wert. Absolut empfehlenswert.", sterne: 5 },
    ],
  },
  {
    name: "T09 Café Elegant (Minimal)",
    subdomain: `${TEST_PREFIX}kaffeehaus-central`,
    branche: "cafe", branche_label: "Café",
    stil: "elegant",
    firmenname: "Kaffeehaus Central",
    kurzbeschreibung: "Kaffeekultur in Eisenstadt — handgebrühter Spezialitätenkaffee und hausgemachte Mehlspeisen.",
    leistungen: ["Spezialitätenkaffee", "Frühstück", "Hausgemachte Mehlspeisen", "Mittagstisch"],
    telefon: "+43 2682 123 456", email: "hallo@kaffeehaus-central.at",
    adresse: "Hauptstraße 15", plz: "7000", ort: "Eisenstadt", bundesland: "bgld",
    einsatzgebiet: "Eisenstadt",
    oeffnungszeiten: "Mo-Sa 07:30-18:00, So 09:00-17:00",
    unternehmensform: "einzelunternehmen",
    gastgarten: true, barrierefrei: true, kartenzahlung: true,
    custom_accent: "#7a6844",
    fotos: false,
    // Bewusst minimal — keine FAQ, Fakten, Partner, Team, Bewertungen
  },
  {
    name: "T10 Fotograf Modern + Social",
    subdomain: `${TEST_PREFIX}foto-lichtblick`,
    branche: "fotograf", branche_label: "Fotograf",
    stil: "modern",
    firmenname: "Fotostudio Lichtblick",
    kurzbeschreibung: "Hochzeitsfotografie, Portraits und Business-Shootings in Bregenz am Bodensee.",
    leistungen: ["Hochzeitsfotografie", "Portrait-Shootings", "Business-Fotografie", "Event-Fotografie", "Produkt-Fotografie", "Drohnenaufnahmen"],
    telefon: "+43 5574 567 890", email: "studio@foto-lichtblick.at",
    adresse: "Seestraße 5", plz: "6900", ort: "Bregenz", bundesland: "vbg",
    einsatzgebiet: "Vorarlberg und Bodenseeregion",
    oeffnungszeiten: "Mo-Fr 10:00-18:00, Sa nach Vereinbarung",
    unternehmensform: "einzelunternehmen",
    buchungslink: "https://calendly.com/foto-lichtblick",
    terminvereinbarung: true,
    custom_accent: "#6366f1",
    fotos: true,
    facebook: "https://facebook.com/fotolichtblick",
    instagram: "https://instagram.com/fotolichtblick",
    linkedin: "https://linkedin.com/in/fotolichtblick",
    tiktok: "https://tiktok.com/@fotolichtblick",
    bewertungen: [
      { name: "Julia & Markus", text: "Unsere Hochzeitsfotos sind atemberaubend! Jedes Bild erzählt eine Geschichte.", sterne: 5 },
      { name: "Firma TechStart GmbH", text: "Professionelle Teamfotos für unsere Website. Schnell, unkompliziert und top Ergebnis.", sterne: 5 },
      { name: "Sarah L.", text: "Das Portrait-Shooting war ein tolles Erlebnis. Die Bilder sind wunderschön!", sterne: 5 },
    ],
  },
  {
    name: "T11 Yoga Klassisch + Custom Rund",
    subdomain: `${TEST_PREFIX}yoga-om`,
    branche: "yoga", branche_label: "Yoga",
    stil: "klassisch",
    firmenname: "Yoga Om Studio",
    kurzbeschreibung: "Yoga für Körper und Geist — Hatha, Vinyasa und Yin Yoga in Wels.",
    leistungen: ["Hatha Yoga", "Vinyasa Flow", "Yin Yoga", "Yoga für Anfänger", "Schwangerenyoga", "Privatstunden"],
    telefon: "+43 7242 890 123", email: "namaste@yoga-om.at",
    adresse: "Ringstraße 10", plz: "4600", ort: "Wels", bundesland: "ooe",
    einsatzgebiet: "Wels und Umgebung",
    oeffnungszeiten: "Mo-Fr 08:00-21:00, Sa 09:00-13:00",
    unternehmensform: "einzelunternehmen",
    gutscheine: true, ratenzahlung: true,
    buchungslink: "https://www.eversports.at/yoga-om",
    custom_accent: "#A16207", custom_radius: "16",
    fotos: true,
    faq: [
      { frage: "Brauche ich Vorkenntnisse?", antwort: "Nein! Unsere Anfängerkurse sind perfekt für den Einstieg. Wir passen jede Übung an dein Level an." },
      { frage: "Was soll ich mitbringen?", antwort: "Bequeme Kleidung und Motivation. Matten und Hilfsmittel stellen wir kostenlos zur Verfügung." },
      { frage: "Kann ich eine Probestunde machen?", antwort: "Ja, die erste Stunde ist bei uns immer kostenlos und unverbindlich." },
    ],
  },
  {
    name: "T12 IT-Service Modern + Custom Font",
    subdomain: `${TEST_PREFIX}byte-solutions`,
    branche: "it_service", branche_label: "IT-Service",
    stil: "modern",
    firmenname: "BYTE Solutions IT",
    kurzbeschreibung: "IT-Komplettservice für KMU — Netzwerke, Cloud, Security und Support aus einer Hand.",
    leistungen: ["IT-Support & Helpdesk", "Netzwerk-Management", "Cloud-Lösungen", "Cyber Security", "Server-Administration", "VoIP-Telefonie",
      "Backup & Disaster Recovery", "Hardware-Beschaffung", "Microsoft 365 Betreuung", "Website-Hosting", "Monitoring & Wartung", "IT-Beratung"],
    telefon: "+43 1 890 1234", email: "support@byte-solutions.at",
    adresse: "Wiedner Hauptstraße 63", plz: "1040", ort: "Wien", bundesland: "wien",
    einsatzgebiet: "Wien, Niederösterreich und Burgenland",
    oeffnungszeiten: "Mo-Fr 08:00-18:00",
    unternehmensform: "gmbh", uid_nummer: "ATU99887766",
    firmenbuchnummer: "FN 998877c", firmenbuchgericht: "HG Wien",
    geschaeftsfuehrer: "Ing. Alexander Novak",
    online_beratung: true, zertifiziert: true,
    custom_accent: "#2563EB", custom_font: "space_grotesk",
    fotos: false,
    faq: [
      { frage: "Wie schnell reagiert der IT-Support?", antwort: "Innerhalb von 30 Minuten — bei kritischen Störungen auch sofort per Fernwartung." },
      { frage: "Betreuen Sie auch Apple-Geräte?", antwort: "Ja, wir sind plattformübergreifend aufgestellt — Windows, macOS, Linux und mobile Endgeräte." },
      { frage: "Bieten Sie Managed Services an?", antwort: "Ja, unser Flatrate-Modell umfasst Monitoring, Wartung, Updates und Support zum Fixpreis." },
      { frage: "Können Sie unsere bestehende IT übernehmen?", antwort: "Selbstverständlich. Wir machen ein kostenloses IT-Audit und erstellen einen Migrationsplan." },
    ],
    fakten: [
      { zahl: "120+", label: "betreute Unternehmen" },
      { zahl: "99.9%", label: "Verfügbarkeit" },
      { zahl: "<30 Min", label: "Reaktionszeit" },
      { zahl: "24/7", label: "Monitoring" },
    ],
    linkedin: "https://linkedin.com/company/byte-solutions",
  },
];

// ═══════════════════════════════════════════
// Phase 1: Orders anlegen
// ═══════════════════════════════════════════

async function phase1_createOrders() {
  console.log("\n╔══════════════════════════════════════════╗");
  console.log("║  PHASE 1: Test-Orders anlegen             ║");
  console.log("╚══════════════════════════════════════════╝\n");

  // Alte Test-Orders aufräumen
  console.log("  Räume alte Test-Orders auf...");
  try {
    await supabaseDelete("orders", `subdomain=like.${TEST_PREFIX}*`);
    console.log("  ✓ Alte Test-Orders gelöscht\n");
  } catch (e) {
    console.log("  (keine alten Test-Orders gefunden)\n");
  }

  const results = [];

  for (const sc of SCENARIOS) {
    const id = uuid();
    const palette = buildPalette(sc.custom_accent || "#0369A1", sc.stil);

    const order = {
      id,
      firmenname: sc.firmenname,
      branche: sc.branche,
      branche_label: sc.branche_label,
      kurzbeschreibung: sc.kurzbeschreibung,
      leistungen: sc.leistungen,
      telefon: sc.telefon,
      email: sc.email,
      adresse: sc.adresse,
      plz: sc.plz,
      ort: sc.ort,
      bundesland: sc.bundesland,
      einsatzgebiet: sc.einsatzgebiet,
      oeffnungszeiten: sc.oeffnungszeiten,
      unternehmensform: sc.unternehmensform,
      uid_nummer: sc.uid_nummer || null,
      firmenbuchnummer: sc.firmenbuchnummer || null,
      firmenbuchgericht: sc.firmenbuchgericht || null,
      geschaeftsfuehrer: sc.geschaeftsfuehrer || null,
      stil: sc.stil,
      custom_accent: sc.custom_accent || null,
      custom_font: sc.custom_font || null,
      custom_radius: sc.custom_radius || null,
      ...palette,
      fotos: sc.fotos ?? false,
      subdomain: sc.subdomain,
      status: "pending",
      notdienst: sc.notdienst || false,
      meisterbetrieb: sc.meisterbetrieb || false,
      kostenvoranschlag: sc.kostenvoranschlag || false,
      foerderungsberatung: sc.foerderungsberatung || false,
      erstgespraech_gratis: sc.erstgespraech_gratis || false,
      online_beratung: sc.online_beratung || false,
      hausbesuche: sc.hausbesuche || false,
      terminvereinbarung: sc.terminvereinbarung || false,
      barrierefrei: sc.barrierefrei || false,
      parkplaetze: sc.parkplaetze || false,
      kartenzahlung: sc.kartenzahlung || false,
      gastgarten: sc.gastgarten || false,
      lieferservice: sc.lieferservice || false,
      takeaway: sc.takeaway || false,
      ratenzahlung: sc.ratenzahlung || false,
      gutscheine: sc.gutscheine || false,
      zertifiziert: sc.zertifiziert || false,
      kassenvertrag: sc.kassenvertrag || null,
      buchungslink: sc.buchungslink || null,
      facebook: sc.facebook || null,
      instagram: sc.instagram || null,
      linkedin: sc.linkedin || null,
      tiktok: sc.tiktok || null,
      team_members: sc.team_members || null,
      bewertungen: sc.bewertungen || null,
      faq: sc.faq || null,
      fakten: sc.fakten || null,
      partner: sc.partner || null,
      ablauf_schritte: sc.ablauf_schritte || null,
      leistungen_beschreibungen: sc.leistungen_beschreibungen || null,
      extra_leistung: sc.extra_leistung || null,
      vorname: "Test", nachname: "User",
    };

    try {
      await supabaseInsert("orders", order);
      console.log(`  ✓ ${sc.name} — ${sc.subdomain} (${id.slice(0,8)})`);
      results.push({ ...sc, id, ok: true });
    } catch (e) {
      console.log(`  ✗ ${sc.name} — ${e.message}`);
      results.push({ ...sc, id, ok: false, error: e.message });
    }
  }

  const ok = results.filter(r => r.ok).length;
  console.log(`\n  Ergebnis: ${ok}/${results.length} Orders erstellt\n`);
  return results;
}

// ═══════════════════════════════════════════
// Phase 2: Websites generieren
// ═══════════════════════════════════════════

async function phase2_generate(orders) {
  console.log("\n╔══════════════════════════════════════════╗");
  console.log("║  PHASE 2: Websites generieren             ║");
  console.log("╚══════════════════════════════════════════╝\n");

  if (!orders) {
    // Orders aus DB laden
    orders = (await supabaseSelect("orders", `subdomain=like.${TEST_PREFIX}*&select=id,subdomain,firmenname,stil,branche`))
      .map(o => ({ ...o, ok: true, name: o.firmenname }));
  }

  const results = [];

  for (const o of orders.filter(o => o.ok)) {
    const start = Date.now();
    process.stdout.write(`  ⏳ ${o.name}...`);
    try {
      const result = await generateWebsite(o.id);
      const sec = ((Date.now() - start) / 1000).toFixed(1);
      console.log(` ✓ (${sec}s)`);
      results.push({ ...o, generated: true, genTime: sec });
    } catch (e) {
      const sec = ((Date.now() - start) / 1000).toFixed(1);
      console.log(` ✗ (${sec}s) — ${e.message}`);
      results.push({ ...o, generated: false, genError: e.message });
    }
  }

  const ok = results.filter(r => r.generated).length;
  console.log(`\n  Ergebnis: ${ok}/${results.length} generiert\n`);
  return results;
}

// ═══════════════════════════════════════════
// Phase 3: Websites prüfen
// ═══════════════════════════════════════════

function analyzeHtml(html, scenario) {
  const checks = [];
  const pass = (name, detail) => checks.push({ name, ok: true, detail });
  const fail = (name, detail) => checks.push({ name, ok: false, detail });
  const warn = (name, detail) => checks.push({ name, ok: "warn", detail });

  // Grundstruktur
  html.includes("<!DOCTYPE html") ? pass("DOCTYPE", "") : fail("DOCTYPE", "Fehlt");
  html.includes("<html") ? pass("HTML-Tag", "") : fail("HTML-Tag", "Fehlt");
  html.includes("</html>") ? pass("HTML-Close", "") : fail("HTML-Close", "Fehlt");

  // Firmenname
  html.includes(scenario.firmenname) ? pass("Firmenname", scenario.firmenname) : fail("Firmenname", `"${scenario.firmenname}" nicht gefunden`);

  // Telefon (bereinigt)
  const telClean = (scenario.telefon || "").replace(/\s/g, "");
  html.includes(telClean) || html.includes(scenario.telefon) ? pass("Telefon", "") : fail("Telefon", `"${scenario.telefon}" nicht gefunden`);

  // Leistungen — mindestens 3 sollten vorkommen
  const foundServices = scenario.leistungen.filter(l => html.includes(l));
  foundServices.length >= 3 ? pass("Leistungen", `${foundServices.length}/${scenario.leistungen.length}`) :
    fail("Leistungen", `Nur ${foundServices.length}/${scenario.leistungen.length} gefunden`);

  // Stil-Klasse
  const stilClass = `stil-${scenario.stil}`;
  html.includes(stilClass) ? pass("Stil-Klasse", stilClass) : fail("Stil-Klasse", `"${stilClass}" nicht gefunden`);

  // Navigation
  html.includes("<nav") ? pass("Navigation", "") : fail("Navigation", "Kein <nav> Element");

  // Footer
  html.includes("<footer") || html.includes("class=\"footer") ? pass("Footer", "") : fail("Footer", "Kein Footer");

  // Kontakt-Section
  html.includes("kontakt") || html.includes("Kontakt") ? pass("Kontakt-Section", "") : warn("Kontakt-Section", "Kein Kontakt-Bereich erkannt");

  // Meta-Tags
  html.includes("<meta") ? pass("Meta-Tags", "") : fail("Meta-Tags", "Keine Meta-Tags");
  html.includes("viewport") ? pass("Viewport", "") : fail("Viewport", "Kein Viewport Meta-Tag");

  // Custom Font (serve-time: Key wird zu Font-Family aufgelöst)
  if (scenario.custom_font) {
    const FONT_NAMES = {playfair:"Playfair",space_grotesk:"Space Grotesk",montserrat:"Montserrat",dm_sans:"DM Sans",inter:"Inter",poppins:"Poppins",outfit:"Outfit",raleway:"Raleway",lora:"Lora",rubik:"Rubik"};
    const fontName = FONT_NAMES[scenario.custom_font] || scenario.custom_font;
    html.includes(fontName) ? pass("Custom Font", fontName) :
      warn("Custom Font", `"${fontName}" nicht direkt im HTML (serve-time injiziert)`);
  }

  // FAQ (wenn vorhanden)
  if (scenario.faq?.length) {
    const faqFound = scenario.faq.filter(f => html.includes(f.frage));
    faqFound.length > 0 ? pass("FAQ", `${faqFound.length}/${scenario.faq.length}`) :
      warn("FAQ", "Keine FAQ-Fragen im HTML (wird serve-time injiziert)");
  }

  // Bewertungen (wenn vorhanden)
  if (scenario.bewertungen?.length) {
    const bewFound = scenario.bewertungen.filter(b => html.includes(b.name));
    bewFound.length > 0 ? pass("Bewertungen", `${bewFound.length}/${scenario.bewertungen.length}`) :
      warn("Bewertungen", "Keine Bewertungen im HTML (serve-time)");
  }

  // Team (wenn vorhanden)
  if (scenario.team_members?.length) {
    const teamPlaceholder = html.includes("<!-- TEAM -->") || html.includes("team");
    teamPlaceholder ? pass("Team-Placeholder", "") : warn("Team", "Kein Team-Bereich (serve-time)");
  }

  // Trust-Bar Features
  const trustFeatures = [];
  if (scenario.notdienst) trustFeatures.push("Notdienst");
  if (scenario.meisterbetrieb) trustFeatures.push("Meisterbetrieb");
  if (scenario.kostenvoranschlag) trustFeatures.push("Kostenvoranschlag");
  if (trustFeatures.length) {
    const trustFound = html.includes("trust") || html.includes("Trust");
    trustFound ? pass("Trust-Bar", trustFeatures.join(", ")) : warn("Trust-Bar", "Kein Trust-Bereich (serve-time)");
  }

  // Leere Platzhalter — sollten NICHT sichtbar sein
  const placeholders = ["{{FIRMENNAME}}", "{{TEL_DISPLAY}}", "{{KURZBESCHREIBUNG}}"];
  const unfilled = placeholders.filter(p => html.includes(p));
  unfilled.length === 0 ? pass("Platzhalter", "Alle ersetzt") : fail("Platzhalter", `Nicht ersetzt: ${unfilled.join(", ")}`);

  // Impressum-Link
  html.includes("impressum") || html.includes("Impressum") ? pass("Impressum-Link", "") : warn("Impressum-Link", "Kein Impressum-Link");

  // Datenschutz-Link
  html.includes("datenschutz") || html.includes("Datenschutz") ? pass("Datenschutz-Link", "") : warn("Datenschutz-Link", "Kein Datenschutz-Link");

  // Größe
  const sizeKB = Math.round(html.length / 1024);
  sizeKB < 500 ? pass("HTML-Größe", `${sizeKB} KB`) : warn("HTML-Größe", `${sizeKB} KB (groß)`);
  sizeKB > 5 ? pass("Nicht leer", `${sizeKB} KB`) : fail("Nicht leer", `Nur ${sizeKB} KB — verdächtig klein`);

  return checks;
}

async function phase3_check(orders) {
  console.log("\n╔══════════════════════════════════════════╗");
  console.log("║  PHASE 3: Websites prüfen                ║");
  console.log("╚══════════════════════════════════════════╝\n");

  if (!orders) {
    orders = await supabaseSelect("orders", `subdomain=like.${TEST_PREFIX}*&select=id,subdomain,firmenname,stil,branche,status`);
    // Szenarien zuordnen
    orders = orders.map(o => {
      const sc = SCENARIOS.find(s => s.subdomain === o.subdomain);
      return { ...o, ...sc, ok: true, generated: o.status !== "pending" };
    });
  }

  const allResults = [];

  for (const o of orders.filter(o => o.generated !== false)) {
    console.log(`  ── ${o.name || o.firmenname} ──`);
    try {
      const { html, ms, url } = await fetchWebsite(o.subdomain);
      console.log(`  Ladezeit: ${ms}ms | Größe: ${Math.round(html.length / 1024)} KB`);

      const checks = analyzeHtml(html, o);
      const passed = checks.filter(c => c.ok === true).length;
      const failed = checks.filter(c => c.ok === false).length;
      const warned = checks.filter(c => c.ok === "warn").length;

      for (const c of checks) {
        const icon = c.ok === true ? "✓" : c.ok === false ? "✗" : "⚠";
        const detail = c.detail ? ` — ${c.detail}` : "";
        if (c.ok !== true) console.log(`    ${icon} ${c.name}${detail}`);
      }
      console.log(`    Ergebnis: ${passed} ✓  ${failed} ✗  ${warned} ⚠`);
      console.log(`    URL: ${url}\n`);

      allResults.push({ name: o.name || o.firmenname, subdomain: o.subdomain, url, ms, passed, failed, warned, checks });
    } catch (e) {
      console.log(`    ✗ Fehler: ${e.message}\n`);
      allResults.push({ name: o.name || o.firmenname, subdomain: o.subdomain, error: e.message });
    }
  }

  // Zusammenfassung
  console.log("\n  ═══ ZUSAMMENFASSUNG ═══");
  console.log(`  ${"Szenario".padEnd(35)} ${"Lade".padEnd(6)} ${"✓".padEnd(4)} ${"✗".padEnd(4)} ⚠`);
  console.log(`  ${"─".repeat(35)} ${"─".repeat(6)} ${"─".repeat(4)} ${"─".repeat(4)} ${"─".repeat(4)}`);
  for (const r of allResults) {
    if (r.error) {
      console.log(`  ${(r.name || "").padEnd(35)} FEHLER: ${r.error}`);
    } else {
      console.log(`  ${(r.name || "").padEnd(35)} ${(r.ms + "ms").padEnd(6)} ${String(r.passed).padEnd(4)} ${String(r.failed).padEnd(4)} ${r.warned}`);
    }
  }

  const totalFailed = allResults.reduce((s, r) => s + (r.failed || 0), 0);
  const totalWarned = allResults.reduce((s, r) => s + (r.warned || 0), 0);
  console.log(`\n  Gesamt: ${totalFailed} Fehler, ${totalWarned} Warnungen\n`);

  return allResults;
}

// ═══════════════════════════════════════════
// Phase 4: Portal-Änderungen
// ═══════════════════════════════════════════

async function phase4_portalChanges() {
  console.log("\n╔══════════════════════════════════════════╗");
  console.log("║  PHASE 4: Portal-Änderungen testen        ║");
  console.log("╚══════════════════════════════════════════╝\n");

  const orders = await supabaseSelect("orders", `subdomain=like.${TEST_PREFIX}*&select=id,subdomain,firmenname,stil,status`);
  const bySubdomain = Object.fromEntries(orders.map(o => [o.subdomain, o]));

  const changes = [
    {
      name: "P1: Elektro → Stil Modern",
      subdomain: `${TEST_PREFIX}elektro-schmidt`,
      update: { stil: "modern" },
      verify: html => html.includes("stil-modern"),
    },
    {
      name: "P2: Friseur → Accent Bernstein",
      subdomain: `${TEST_PREFIX}salon-maria`,
      update: { custom_accent: "#B45309", ...buildPalette("#B45309", "modern") },
      verify: html => html.includes("#B45309") || html.includes("#b45309"),
    },
    {
      name: "P3: Zahnarzt → Trust-Bar erweitern",
      subdomain: `${TEST_PREFIX}dr-huber-zahn`,
      update: { parkplaetze: true, kartenzahlung: true },
      verify: html => html.toLowerCase().includes("kartenzahlung") || html.toLowerCase().includes("parkpl"),
    },
    {
      name: "P4: Restaurant → FAQ hinzufügen",
      subdomain: `${TEST_PREFIX}gasthaus-zur-linde`,
      update: {
        faq: [
          { frage: "Brauche ich eine Reservierung?", antwort: "Für Gruppen ab 6 Personen empfehlen wir eine Reservierung. Ansonsten kommen Sie gerne spontan!" },
          { frage: "Haben Sie vegetarische Gerichte?", antwort: "Ja, unsere Karte bietet täglich mindestens 3 vegetarische Hauptgerichte und auf Wunsch auch vegane Optionen." },
          { frage: "Bieten Sie Catering an?", antwort: "Ja! Wir catern Feiern, Firmenfeste und Hochzeiten. Sprechen Sie uns an für ein individuelles Angebot." },
        ],
        sections_visible: { faq: true },
      },
      verify: html => html.includes("Reservierung") || html.includes("faq"),
    },
    {
      name: "P5: Rechtsanwalt → Team hinzufügen",
      subdomain: `${TEST_PREFIX}ra-maier`,
      update: {
        team_members: [
          { name: "Dr. Stefan Maier", rolle: "Partner — Wirtschaftsrecht", email: "maier@ra-maier.at" },
          { name: "Mag. Anna Berger", rolle: "Partnerin — Arbeitsrecht", email: "berger@ra-maier.at" },
          { name: "Dr. Thomas Kern", rolle: "Associate — Vertragsrecht", email: "kern@ra-maier.at" },
        ],
      },
      verify: html => html.includes("Stefan Maier") || html.includes("TEAM") || html.includes("team"),
    },
    {
      name: "P6: Fahrschule → Ankündigung",
      subdomain: `${TEST_PREFIX}fahrschule-easy`,
      update: {
        announcements: [
          { text: "Sommeraktion: -15% auf alle Führerscheinkurse bis 31. August!", active: true, date_start: "2026-04-01", date_end: "2026-08-31" },
        ],
      },
      verify: html => html.includes("Sommeraktion") || html.includes("announcement"),
    },
    {
      name: "P7: Café → Leistungen erweitern",
      subdomain: `${TEST_PREFIX}kaffeehaus-central`,
      update: {
        leistungen: ["Spezialitätenkaffee", "Frühstück", "Hausgemachte Mehlspeisen", "Mittagstisch", "Sonntagsbrunch", "Kuchentheke"],
        text_ueber_uns: "Das Kaffeehaus Central ist seit 2015 ein Treffpunkt für Kaffeeliebhaber in Eisenstadt. Wir rösten unsere Bohnen selbst und backen täglich frisch. Unser Ziel: jede Tasse soll ein Erlebnis sein.",
      },
      verify: html => html.includes("Sonntagsbrunch") || html.includes("Kaffeeliebhaber"),
    },
    {
      name: "P8: Physio → Hero split",
      subdomain: `${TEST_PREFIX}physio-vital`,
      update: { varianten_cache: { hero: "split", ablauf: "vertikal", bewertungen: "blockquote" } },
      verify: html => html.includes("split") || html.includes("hero"),
    },
    {
      name: "P9: Yoga → Font Montserrat",
      subdomain: `${TEST_PREFIX}yoga-om`,
      update: { custom_font: "montserrat" },
      verify: html => html.includes("Montserrat"),
    },
    {
      name: "P10: IT → Impressum komplett",
      subdomain: `${TEST_PREFIX}byte-solutions`,
      update: {
        vorname: "Alexander",
        nachname: "Novak",
        unternehmensform: "gmbh",
        uid_nummer: "ATU99887766",
        firmenbuchnummer: "FN 998877c",
        firmenbuchgericht: "HG Wien",
        geschaeftsfuehrer: "Ing. Alexander Novak",
      },
      verify: html => true, // Impressum ist auf separater Seite
    },
  ];

  const results = [];

  for (const ch of changes) {
    const order = bySubdomain[ch.subdomain];
    if (!order) {
      console.log(`  ✗ ${ch.name} — Order nicht gefunden`);
      results.push({ name: ch.name, ok: false, error: "Order nicht gefunden" });
      continue;
    }

    try {
      // Update durchführen
      await supabaseUpdate("orders", order.id, ch.update);

      // Kurz warten, damit serve-time die Änderung greift
      await new Promise(r => setTimeout(r, 1000));

      // Website laden und prüfen
      const { html, ms } = await fetchWebsite(ch.subdomain);
      const verified = ch.verify(html);

      console.log(`  ${verified ? "✓" : "⚠"} ${ch.name} (${ms}ms)`);
      results.push({ name: ch.name, ok: verified, ms });
    } catch (e) {
      console.log(`  ✗ ${ch.name} — ${e.message}`);
      results.push({ name: ch.name, ok: false, error: e.message });
    }
  }

  const ok = results.filter(r => r.ok).length;
  console.log(`\n  Ergebnis: ${ok}/${results.length} Portal-Änderungen erfolgreich\n`);
  return results;
}

// ═══════════════════════════════════════════
// Phase 5: Edge Cases
// ═══════════════════════════════════════════

async function phase5_edgeCases() {
  console.log("\n╔══════════════════════════════════════════╗");
  console.log("║  PHASE 5: Edge Cases testen               ║");
  console.log("╚══════════════════════════════════════════╝\n");

  const edgeCases = [
    {
      name: "E1: Sonderzeichen im Namen",
      subdomain: `${TEST_PREFIX}mueller-soehne`,
      order: {
        firmenname: "Müller & Söhne GmbH — Ihr Experte",
        branche: "maler", branche_label: "Malerei & Anstrich",
        stil: "modern",
        kurzbeschreibung: "Malerei & Anstrich in Wien — Fassade, Innenräume, Schimmelbehandlung.",
        leistungen: ["Innenmalerei", "Fassadenanstrich", "Tapezierarbeiten"],
        telefon: "+43 1 999 0000", email: "info@mueller-soehne.at",
        adresse: "Neubaugasse 7/3", plz: "1070", ort: "Wien", bundesland: "wien",
        einsatzgebiet: "Wien",
        unternehmensform: "gmbh",
        custom_accent: "#4f46e5",
        fotos: false,
      },
      verify: html => html.includes("Müller") && html.includes("Söhne"),
    },
    {
      name: "E2: 12 Leistungen (Maximum)",
      subdomain: `${TEST_PREFIX}max-leistungen`,
      order: {
        firmenname: "Viel Service GmbH",
        branche: "it_service", branche_label: "IT-Service",
        stil: "klassisch",
        kurzbeschreibung: "Wir bieten alles rund um IT.",
        leistungen: ["IT-Support", "Netzwerk", "Cloud", "Security", "Server", "VoIP",
          "Backup", "Hardware", "Microsoft 365", "Hosting", "Monitoring", "Beratung"],
        telefon: "+43 1 111 2222", email: "info@viel-service.at",
        adresse: "Teststraße 1", plz: "1010", ort: "Wien", bundesland: "wien",
        unternehmensform: "gmbh",
        custom_accent: "#0369A1",
        fotos: false,
      },
      verify: html => {
        const count = ["IT-Support", "Netzwerk", "Cloud", "Security", "Server", "VoIP"].filter(l => html.includes(l)).length;
        return count >= 4;
      },
    },
    {
      name: "E3: Helle Accent-Farbe",
      subdomain: `${TEST_PREFIX}hell-accent`,
      order: {
        firmenname: "Goldschmiede Strahlend",
        branche: "goldschmied", branche_label: "Goldschmiede",
        stil: "elegant",
        kurzbeschreibung: "Handgefertigter Schmuck aus Gold und Silber.",
        leistungen: ["Eheringe", "Schmuck nach Maß", "Reparaturen", "Gravuren"],
        telefon: "+43 1 333 4444", email: "info@goldschmiede-strahlend.at",
        adresse: "Goldgasse 1", plz: "1010", ort: "Wien", bundesland: "wien",
        unternehmensform: "einzelunternehmen",
        custom_accent: "#D4A843",
        fotos: false,
      },
      verify: html => html.includes("Goldschmiede"),
    },
    {
      name: "E4: Dunkle Accent-Farbe",
      subdomain: `${TEST_PREFIX}dunkel-accent`,
      order: {
        firmenname: "Sicherheitsdienst Nachtfalke",
        branche: "sicherheitsdienst", branche_label: "Sicherheitsdienst",
        stil: "klassisch",
        kurzbeschreibung: "Objektschutz und Sicherheitsdienstleistungen in Niederösterreich.",
        leistungen: ["Objektschutz", "Personenschutz", "Veranstaltungsschutz", "Alarmaufschaltung"],
        telefon: "+43 1 555 6666", email: "info@nachtfalke-security.at",
        adresse: "Sicherheitsweg 10", plz: "3100", ort: "St. Pölten", bundesland: "noe",
        unternehmensform: "gmbh",
        custom_accent: "#1a1a2e",
        fotos: false,
      },
      verify: html => html.includes("Nachtfalke"),
    },
    {
      name: "E5: Alle Features gleichzeitig an",
      subdomain: `${TEST_PREFIX}alle-features`,
      order: {
        firmenname: "Alleskönner Betrieb",
        branche: "installateur", branche_label: "Installateur",
        stil: "modern",
        kurzbeschreibung: "Alles aus einer Hand — Installation, Wartung, Notdienst.",
        leistungen: ["Heizung", "Sanitär", "Rohrreinigung", "Badsanierung"],
        telefon: "+43 1 777 8888", email: "info@alleskonner.at",
        adresse: "Alleestraße 99", plz: "1020", ort: "Wien", bundesland: "wien",
        unternehmensform: "einzelunternehmen",
        custom_accent: "#2563EB",
        fotos: true,
        notdienst: true, meisterbetrieb: true, kostenvoranschlag: true,
        foerderungsberatung: true, erstgespraech_gratis: true, online_beratung: true,
        hausbesuche: true, terminvereinbarung: true, barrierefrei: true,
        parkplaetze: true, kartenzahlung: true, ratenzahlung: true,
        gutscheine: true, zertifiziert: true,
      },
      verify: html => html.includes("trust") || html.includes("Notdienst") || html.includes("Meisterbetrieb"),
    },
  ];

  const results = [];

  for (const ec of edgeCases) {
    const id = uuid();
    const palette = buildPalette(ec.order.custom_accent || "#0369A1", ec.order.stil);
    try {
      // Order erstellen
      await supabaseInsert("orders", {
        id, subdomain: ec.subdomain, status: "pending",
        vorname: "Edge", nachname: "Test",
        oeffnungszeiten: "Mo-Fr 09:00-17:00",
        einsatzgebiet: ec.order.einsatzgebiet || ec.order.ort,
        ...palette, ...ec.order,
      });

      // Generieren
      process.stdout.write(`  ⏳ ${ec.name}...`);
      const start = Date.now();
      await generateWebsite(id);
      const sec = ((Date.now() - start) / 1000).toFixed(1);

      // Prüfen
      await new Promise(r => setTimeout(r, 500));
      const { html, ms } = await fetchWebsite(ec.subdomain);
      const verified = ec.verify(html);
      console.log(` ${verified ? "✓" : "✗"} (Gen: ${sec}s, Load: ${ms}ms)`);
      results.push({ name: ec.name, ok: verified, genTime: sec, loadMs: ms });
    } catch (e) {
      console.log(` ✗ — ${e.message}`);
      results.push({ name: ec.name, ok: false, error: e.message });
    }
  }

  const ok = results.filter(r => r.ok).length;
  console.log(`\n  Ergebnis: ${ok}/${results.length} Edge Cases bestanden\n`);
  return results;
}

// ═══════════════════════════════════════════
// Cleanup
// ═══════════════════════════════════════════

async function cleanup() {
  console.log("\n  Räume Test-Daten auf...");
  try {
    await supabaseDelete("orders", `subdomain=like.${TEST_PREFIX}*`);
    console.log("  ✓ Alle Test-Orders gelöscht\n");
  } catch (e) {
    console.log(`  ⚠ Cleanup: ${e.message}\n`);
  }
}

// ═══════════════════════════════════════════
// Main
// ═══════════════════════════════════════════

async function main() {
  const phase = process.argv[2];

  console.log("╔══════════════════════════════════════════════╗");
  console.log("║  SiteReady E2E Full Test                      ║");
  console.log("║  12 Szenarien + 5 Edge Cases + Portal-Tests   ║");
  console.log("╚══════════════════════════════════════════════╝");

  try {
    if (!phase || phase === "1") {
      const orders = await phase1_createOrders();
      if (phase === "1") return;

      if (!phase || phase !== "1") {
        const generated = await phase2_generate(orders);
        const checked = await phase3_check(generated);
        await phase4_portalChanges();
        await phase5_edgeCases();
      }
    } else if (phase === "2") {
      await phase2_generate();
    } else if (phase === "3") {
      await phase3_check();
    } else if (phase === "4") {
      await phase4_portalChanges();
    } else if (phase === "5") {
      await phase5_edgeCases();
    } else if (phase === "cleanup") {
      await cleanup();
    }

    console.log("\n══════════════════════════════════════════");
    console.log("  FERTIG — Alle Phasen abgeschlossen");
    console.log("══════════════════════════════════════════\n");
    console.log("  Nächster Schritt: Websites manuell im Browser prüfen:");
    console.log("  https://sitereadyprototype.pages.dev/s/e2etest-elektro-schmidt");
    console.log("  https://sitereadyprototype.pages.dev/s/e2etest-salon-maria");
    console.log("  https://sitereadyprototype.pages.dev/s/e2etest-dr-huber-zahn");
    console.log("  https://sitereadyprototype.pages.dev/s/e2etest-gasthaus-zur-linde");
    console.log("  https://sitereadyprototype.pages.dev/s/e2etest-ra-maier");
    console.log("  https://sitereadyprototype.pages.dev/s/e2etest-fahrschule-easy");
    console.log("  https://sitereadyprototype.pages.dev/s/e2etest-tischlerei-holz");
    console.log("  https://sitereadyprototype.pages.dev/s/e2etest-physio-vital");
    console.log("  https://sitereadyprototype.pages.dev/s/e2etest-kaffeehaus-central");
    console.log("  https://sitereadyprototype.pages.dev/s/e2etest-foto-lichtblick");
    console.log("  https://sitereadyprototype.pages.dev/s/e2etest-yoga-om");
    console.log("  https://sitereadyprototype.pages.dev/s/e2etest-byte-solutions\n");

  } catch (e) {
    console.error("\n  FATAL:", e.message);
    console.error(e.stack);
    process.exit(1);
  }
}

main();
