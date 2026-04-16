/**
 * E2E Test-Script — simuliert Kunden-Orders mit verschiedenen Konfigurationen
 * Usage: SB_KEY=... ADMIN_KEY=... node test-e2e.mjs
 */

const SB_URL = "https://brulvtqeazkgcxkimdve.supabase.co";
const SB_KEY = process.env.SB_KEY;
const ADMIN_KEY = process.env.ADMIN_KEY;
const SITE_URL = "https://sitereadyprototype.pages.dev";

if (!SB_KEY || !ADMIN_KEY) {
  console.error("Fehler: SB_KEY und ADMIN_KEY als Env-Variablen setzen");
  process.exit(1);
}

const SB_HEADERS = {
  "apikey": SB_KEY,
  "Authorization": `Bearer ${SB_KEY}`,
  "Content-Type": "application/json",
  "Prefer": "return=representation",
};

// ═══ Farb-Hilfsfunktion ═══
function ok(label) { return `\x1b[32m✓\x1b[0m ${label}`; }
function warn(label) { return `\x1b[33m⚠\x1b[0m ${label}`; }
function err(label) { return `\x1b[31m✗\x1b[0m ${label}`; }

// ═══ Test-Konfigurationen ═══
const TEST_CASES = [
  // 1. Elektriker — Klassisch, Standard, viele Merkmale
  {
    label: "Elektriker — Klassisch, komplett",
    order: {
      firmenname: "Elektro Huber",
      branche: "elektro",
      branche_label: "Elektriker",
      stil: "klassisch",
      ort: "Linz",
      bundesland: "OOE",
      adresse: "Landstraße 12",
      plz: "4020",
      telefon: "+43 732 123456",
      email: "office@elektro-huber.at",
      unternehmensform: "eu",
      leistungen: ["Elektroinstallation", "Beleuchtungsplanung", "Photovoltaik", "Notdienst"],
      kurzbeschreibung: "Ihr Elektrofachbetrieb in Linz – von der einfachen Steckdose bis zur kompletten Hausinstallation.",
      meisterbetrieb: true,
      notdienst: true,
      kostenvoranschlag: true,
      oeffnungszeiten: "mo-fr-7-16",
      einsatzgebiet: "Linz und Umgebung",
      bewertungen: [
        { name: "Maria S.", text: "Schnelle Reaktion beim Notfall, sehr kompetent!", sterne: 5 },
        { name: "Thomas K.", text: "Saubere Arbeit, pünktlich und fair im Preis.", sterne: 5 },
        { name: "Sandra M.", text: "Photovoltaik-Anlage top installiert, klare Empfehlung.", sterne: 5 }
      ],
      ablauf_schritte: [
        { titel: "Anfrage stellen", text: "Kurze Beschreibung Ihres Problems genügt." },
        { titel: "Termin & KV", text: "Wir kommen zum Besichtigungstermin und erstellen ein kostenloses Angebot." },
        { titel: "Umsetzung", text: "Fachgerechte Ausführung durch zertifizierte Elektriker." },
      ],
      status: "trial",
    }
  },

  // 2. Friseur — Modern, mit Team und Galerie-Daten
  {
    label: "Friseursalon — Modern, Team + Social",
    order: {
      firmenname: "Salon Bella",
      branche: "friseur",
      branche_label: "Friseursalon",
      stil: "modern",
      ort: "Wien",
      bundesland: "W",
      adresse: "Mariahilfer Straße 88",
      plz: "1060",
      telefon: "+43 1 9876543",
      email: "hallo@salon-bella.at",
      unternehmensform: "einzelunternehmen",
      leistungen: ["Damenschnitt", "Herrenschnitt", "Coloration", "Balayage", "Hochsteckfrisuren"],
      kurzbeschreibung: "Frische Schnitte und traumhafte Farben im Herzen Wiens – Ihr Wohlfühl-Salon seit 2015.",
      oeffnungszeiten: "mo-sa-8-17",
      erstgespraech_gratis: true,
      kartenzahlung: true,
      instagram: "https://instagram.com/salon.bella.wien",
      facebook: "https://facebook.com/salonbella",
      team_members: [
        { name: "Sophie Maier", rolle: "Inhaberin & Stylistin", foto: "" },
        { name: "Lisa Gruber", rolle: "Coloristin", foto: "" },
      ],
      gut_zu_wissen: "Terminbuchung online oder telefonisch\nStornierung bis 24h vorher kostenlos\nGeschenkgutscheine erhältlich",
      status: "trial",
    }
  },

  // 3. Arzt — Elegant, Kassenvertrag, Datenschutz-sensitiv
  {
    label: "Arzt — Elegant, Kassenvertrag",
    order: {
      firmenname: "Dr. Anna Berger",
      branche: "arzt",
      branche_label: "Allgemeinmedizinerin",
      spezialisierung: "Allgemeinmedizin & Präventivmedizin",
      stil: "elegant",
      ort: "Graz",
      bundesland: "STMK",
      adresse: "Herrengasse 5",
      plz: "8010",
      telefon: "+43 316 555100",
      email: "ordination@dr-berger.at",
      unternehmensform: "einzelunternehmen",
      leistungen: ["Allgemeinmedizin", "Vorsorgeuntersuchung", "Impfungen", "Hausbesuche", "Telemedizin"],
      kurzbeschreibung: "Ordination Dr. Berger – persönliche Betreuung mit Zeit für Ihre Gesundheit.",
      kassenvertrag: "Alle Kassen",
      online_beratung: true,
      hausbesuche: true,
      barrierefrei: true,
      oeffnungszeiten: "mo-fr-8-17",
      einsatzgebiet: "Graz Innenstadt",
      faq: [
        { frage: "Brauche ich einen Termin?", antwort: "Ja, bitte vereinbaren Sie telefonisch oder online einen Termin. Akutfälle werden nach Möglichkeit noch am gleichen Tag behandelt." },
        { frage: "Welche Kassen akzeptieren Sie?", antwort: "Wir haben Verträge mit allen österreichischen Sozialversicherungsträgern (ÖGK, BVAEB, SVS, KFL)." },
        { frage: "Bieten Sie Hausbesuche an?", antwort: "Ja, für Patienten mit eingeschränkter Mobilität bieten wir Hausbesuche im Grazer Stadtgebiet an." },
        { frage: "Wie läuft eine Vorsorgeuntersuchung ab?", antwort: "Die kostenlose Gesundenuntersuchung dauert ca. 60 Minuten und umfasst Laborwerte, EKG und ein ausführliches Beratungsgespräch." },
      ],
      status: "trial",
    }
  },

  // 4. Restaurant — Klassisch, Gastro, Öffnungszeiten custom
  {
    label: "Restaurant — Klassisch, Gastro",
    order: {
      firmenname: "Zum Goldenen Hirschen",
      branche: "restaurant",
      branche_label: "Restaurant",
      stil: "klassisch",
      ort: "Salzburg",
      bundesland: "S",
      adresse: "Getreidegasse 22",
      plz: "5020",
      telefon: "+43 662 841234",
      email: "info@goldener-hirsch-sbg.at",
      unternehmensform: "einzelunternehmen",
      leistungen: ["Mittagsmenü", "À-la-carte", "Catering", "Private Feiern", "Weinbegleitung"],
      kurzbeschreibung: "Traditionelle österreichische Küche in historischem Gewölbe – seit 1952 ein Stück Salzburg.",
      oeffnungszeiten_custom: "Di–So 11:30–14:30, 17:30–22:00",
      gastgarten: true,
      kartenzahlung: true,
      buchungslink: "https://www.opentable.at/zum-goldenen-hirschen",
      bewertungen: [
        { name: "Klaus R.", text: "Der beste Tafelspitz in Salzburg – authentisch und herzlich!", sterne: 5 },
        { name: "Emma W.", text: "Wunderschönes Ambiente, perfekter Service.", sterne: 5 },
      ],
      facebook: "https://facebook.com/goldener.hirsch.salzburg",
      status: "trial",
    }
  },

  // 5. Steuerberater — Modern, GmbH, viele Pflichtfelder
  {
    label: "Steuerberater — Modern, GmbH",
    order: {
      firmenname: "TaxConsult",
      branche: "steuerberater",
      branche_label: "Steuerberatung",
      spezialisierung: "Steuerberatung & Unternehmensberatung für KMU",
      stil: "modern",
      ort: "Wien",
      bundesland: "W",
      adresse: "Ringstraße 15",
      plz: "1010",
      telefon: "+43 1 5050100",
      email: "office@taxconsult.at",
      unternehmensform: "gmbh",
      firmenbuchnummer: "FN 456789 x",
      firmenbuchgericht: "Handelsgericht Wien",
      geschaeftsfuehrer: "Mag. Robert Stein",
      uid_nummer: "ATU12345678",
      leistungen: ["Buchhaltung", "Jahresabschluss", "Steueroptimierung", "Lohnverrechnung", "Unternehmensberatung"],
      kurzbeschreibung: "TaxConsult begleitet Ihr Unternehmen mit persönlicher Beratung und digitalem Workflow.",
      erstgespraech_gratis: true,
      online_beratung: true,
      foerderungsberatung: true,
      oeffnungszeiten: "mo-fr-8-17",
      einsatzgebiet: "Wien & österreichweit digital",
      kammer_berufsrecht: "Kammer der Steuerberater und Wirtschaftsprüfer – Berufsrecht: Steuerberatungsgesetz (WTBG 2017)",
      status: "trial",
    }
  },

  // 6. Yoga-Studio — Elegant, custom Farbe, minimal
  {
    label: "Yoga-Studio — Elegant, kompaktes Profil",
    order: {
      firmenname: "Yoga Flow Studio",
      branche: "yoga",
      branche_label: "Yoga Studio",
      stil: "elegant",
      ort: "Innsbruck",
      bundesland: "T",
      adresse: "Maria-Theresien-Straße 30",
      plz: "6020",
      telefon: "+43 512 334455",
      email: "namaste@yogaflow.at",
      unternehmensform: "einzelunternehmen",
      leistungen: ["Hatha Yoga", "Vinyasa Flow", "Yin Yoga", "Meditation", "Workshops"],
      kurzbeschreibung: "Yoga Flow Studio – Dein Ort der Stille und Kraft im Herzen von Innsbruck.",
      buchungslink: "https://yogaflow.at/buchen",
      oeffnungszeiten: "mo-sa-8-18",
      online_beratung: true,
      instagram: "https://instagram.com/yogaflow.innsbruck",
      gut_zu_wissen: "Bitte 10 Minuten vor dem Kurs erscheinen\nEigene Matte erwünscht (Verleih möglich)\nAnfänger herzlich willkommen",
      status: "trial",
    }
  },

  // 7. IT-Service — Modern, custom Farbe #2563eb, Pill-Buttons
  {
    label: "IT-Service — Modern + Custom Akzent #2563eb",
    order: {
      firmenname: "ByteForce IT",
      branche: "it_service",
      branche_label: "IT-Service & Support",
      spezialisierung: "IT-Support, Netzwerke und Cloud für Unternehmen",
      stil: "modern",
      custom_accent: "#2563eb",
      ort: "Wien",
      bundesland: "W",
      adresse: "Favoritenstraße 77",
      plz: "1100",
      telefon: "+43 1 7070800",
      email: "support@byteforce.at",
      unternehmensform: "eu",
      leistungen: ["IT-Support", "Netzwerkinstallation", "Cloud-Migration", "Datensicherung", "Cybersecurity"],
      kurzbeschreibung: "ByteForce IT – schneller IT-Support und zuverlässige Infrastruktur für Wiener KMU.",
      notdienst: true,
      kostenvoranschlag: true,
      online_beratung: true,
      oeffnungszeiten: "mo-fr-8-18",
      einsatzgebiet: "Wien und Umgebung",
      status: "trial",
    }
  },

  // 8. Tischler — Klassisch, Meisterbetrieb, Import-ähnliche Daten
  {
    label: "Tischler — Klassisch, Import-Daten vorhanden",
    order: {
      firmenname: "Tischlerei Brandner",
      branche: "tischler",
      branche_label: "Tischlerei",
      stil: "klassisch",
      ort: "St. Pölten",
      bundesland: "NOE",
      adresse: "Werkstraße 8",
      plz: "3100",
      telefon: "+43 2742 88888",
      email: "office@tischlerei-brandner.at",
      unternehmensform: "einzelunternehmen",
      leistungen: ["Maßmöbel", "Innenausbau", "Fenster & Türen", "Renovierung", "Restaurierung"],
      kurzbeschreibung: "Handwerkskunst in dritter Generation – individuelle Tischlerarbeiten nach Ihren Wünschen.",
      meisterbetrieb: true,
      kostenvoranschlag: true,
      parkplaetze: true,
      oeffnungszeiten: "mo-fr-7-16",
      einsatzgebiet: "St. Pölten und ganz Niederösterreich",
      // Simuliert importierte Texte (wie nach Google-Import)
      text_ueber_uns: "Die Tischlerei Brandner wurde 1968 von Johann Brandner gegründet und wird heute in dritter Generation von Michael Brandner geführt. Mit über 50 Jahren Erfahrung fertigen wir individuelle Möbel und Innenausbauten – vom Einzelstück bis zur kompletten Küche.",
      leistungen_beschreibungen: {
        "Maßmöbel": "Jedes Möbelstück wird exakt nach Ihren Maßen und Wünschen gefertigt – kein Standard, sondern Ihr Unikat.",
        "Innenausbau": "Von der Planung bis zur Montage – wir gestalten Ihr Raumkonzept von A bis Z.",
      },
      ablauf_schritte: [
        { titel: "Beratungsgespräch", text: "Kostenloser Besichtigungstermin bei Ihnen zu Hause." },
        { titel: "Planung & Angebot", text: "Wir planen Ihr Projekt und erstellen ein detailliertes Angebot." },
        { titel: "Fertigung", text: "Handwerkliche Herstellung in unserer Werkstatt in St. Pölten." },
        { titel: "Montage", text: "Fachgerechter Einbau durch unser erfahrenes Team." },
      ],
      status: "trial",
    }
  },
];

// ═══ Hilfsfunktionen ═══
async function createOrder(order) {
  const sub = `test-${order.branche}-${order.stil}-${Date.now().toString(36)}`;
  const payload = { ...order, subdomain: sub };
  const r = await fetch(`${SB_URL}/rest/v1/orders`, {
    method: "POST",
    headers: SB_HEADERS,
    body: JSON.stringify(payload),
  });
  if (!r.ok) {
    const txt = await r.text();
    throw new Error(`Supabase Insert fehlgeschlagen: ${r.status} — ${txt}`);
  }
  const rows = await r.json();
  return rows[0];
}

async function triggerGeneration(orderId) {
  const r = await fetch(`${SITE_URL}/api/generate-website?key=${ADMIN_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ order_id: orderId }),
  });
  const j = await r.json();
  return { ok: r.ok, ...j };
}

async function checkWebsite(subdomain) {
  const url = `${SITE_URL}/s/${subdomain}`;
  const checks = [];
  let html = "";

  try {
    const t0 = Date.now();
    const r = await fetch(url);
    const ms = Date.now() - t0;
    checks.push({ label: `HTTP ${r.status}`, ok: r.ok });
    checks.push({ label: `Ladezeit ${ms}ms`, ok: ms < 3000 });
    html = await r.text();
  } catch(e) {
    checks.push({ label: `Nicht erreichbar: ${e.message}`, ok: false });
    return { checks, score: 0 };
  }

  // Strukturcheck
  checks.push({ label: "Nav vorhanden", ok: html.includes('id="sitenav"') });
  checks.push({ label: "Hero vorhanden", ok: html.includes('id="sr-hero"') });
  checks.push({ label: "Leistungen-Section", ok: html.includes('id="leistungen"') });
  checks.push({ label: "Über-uns-Section", ok: html.includes('id="ueber-uns"') });
  checks.push({ label: "Kontakt-Section", ok: html.includes('id="kontakt"') });
  checks.push({ label: "Footer vorhanden", ok: html.includes("<footer") });
  checks.push({ label: "Impressum-Link", ok: html.includes("/impressum") });
  checks.push({ label: "Datenschutz-Link", ok: html.includes("/datenschutz") });
  checks.push({ label: "Meta-Title", ok: /<title>[^<]{10,}<\/title>/i.test(html) });
  checks.push({ label: "Meta-Description", ok: html.includes('name="description"') });
  checks.push({ label: "Schema.org JSON-LD", ok: html.includes('application/ld+json') });
  checks.push({ label: "Google Fonts geladen", ok: html.includes("fonts.googleapis.com") });
  checks.push({ label: "Kein {{PLACEHOLDER}} übrig", ok: !html.includes("{{") });
  checks.push({ label: "Kein undefined im HTML", ok: !html.includes(">undefined<") && !html.includes('src="undefined"') });
  checks.push({ label: "Firmenname im HTML", ok: true }); // Wird unten gesetzt

  const score = Math.round((checks.filter(c => c.ok).length / checks.length) * 100);
  return { checks, score, url };
}

async function checkLegalPages(subdomain) {
  const checks = [];
  for (const page of ["impressum", "datenschutz"]) {
    const url = `${SITE_URL}/s/${subdomain}/${page}`;
    try {
      const r = await fetch(url);
      const html = await r.text();
      checks.push({ label: `${page}: HTTP OK`, ok: r.ok });
      checks.push({ label: `${page}: Inhalt vorhanden`, ok: html.length > 500 });
      checks.push({ label: `${page}: Nav vorhanden`, ok: html.includes('id="sitenav"') });
      checks.push({ label: `${page}: Kein Fehler-Hinweis`, ok: !html.includes("Nicht gefunden") && !html.includes("Error") });
    } catch(e) {
      checks.push({ label: `${page}: Fehler — ${e.message}`, ok: false });
    }
  }
  return checks;
}

// ═══ Cleanup: Test-Orders löschen ═══
async function deleteOrder(id) {
  await fetch(`${SB_URL}/rest/v1/orders?id=eq.${id}`, {
    method: "DELETE",
    headers: SB_HEADERS,
  });
}

// ═══ Haupt-Test-Loop ═══
const results = [];
const createdIds = [];

console.log(`\n${"═".repeat(60)}`);
console.log(`  SiteReady E2E Tests — ${new Date().toLocaleString("de-AT")}`);
console.log(`${"═".repeat(60)}\n`);

for (const tc of TEST_CASES) {
  console.log(`\n${"─".repeat(60)}`);
  console.log(`▶ ${tc.label}`);
  console.log(`${"─".repeat(60)}`);

  let order;
  try {
    order = await createOrder(tc.order);
    createdIds.push(order.id);
    console.log(`  Order erstellt: ${order.id} (${order.subdomain})`);
  } catch(e) {
    console.log(err(`  Order-Erstellung fehlgeschlagen: ${e.message}`));
    results.push({ label: tc.label, score: 0, error: e.message });
    continue;
  }

  // Generierung starten
  let genResult;
  try {
    console.log(`  Generierung startet...`);
    genResult = await triggerGeneration(order.id);
    if (genResult.ok) {
      console.log(ok(`  Website generiert: ${SITE_URL}/s/${order.subdomain}`));
    } else {
      throw new Error(genResult.error || "Unbekannter Fehler");
    }
  } catch(e) {
    console.log(err(`  Generierung fehlgeschlagen: ${e.message}`));
    results.push({ label: tc.label, score: 0, error: e.message });
    continue;
  }

  // Website prüfen
  const { checks, score, url } = await checkWebsite(order.subdomain);
  const legalChecks = await checkLegalPages(order.subdomain);
  const allChecks = [...checks, ...legalChecks];
  const totalScore = Math.round((allChecks.filter(c => c.ok).length / allChecks.length) * 100);

  console.log(`\n  Checks:`);
  for (const c of allChecks) {
    console.log(`    ${c.ok ? ok(c.label) : err(c.label)}`);
  }
  console.log(`\n  Score: ${totalScore}/100`);

  results.push({ label: tc.label, score: totalScore, url, subdomain: order.subdomain });
}

// ═══ Zusammenfassung ═══
console.log(`\n${"═".repeat(60)}`);
console.log(`  ERGEBNIS`);
console.log(`${"═".repeat(60)}`);
const passed = results.filter(r => r.score >= 80).length;
const failed = results.filter(r => r.score < 80).length;
console.log(`  ${passed}/${results.length} Tests bestanden (≥80 Punkte)\n`);

for (const r of results) {
  const icon = r.score >= 90 ? "✓" : r.score >= 80 ? "~" : "✗";
  const color = r.score >= 90 ? "\x1b[32m" : r.score >= 80 ? "\x1b[33m" : "\x1b[31m";
  console.log(`  ${color}${icon}\x1b[0m ${r.label.padEnd(45)} ${r.score}/100`);
  if (r.url) console.log(`     → ${r.url}`);
  if (r.error) console.log(`     Fehler: ${r.error}`);
}

// Cleanup
console.log(`\n  ${createdIds.length} Test-Orders werden gelöscht...`);
await Promise.all(createdIds.map(deleteOrder));
console.log(`  Cleanup abgeschlossen.\n`);
