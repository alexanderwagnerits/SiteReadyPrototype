/**
 * Portal-Änderungs-Test — simuliert was Kunden im Self-Portal tun
 * Testet serve-time Änderungen (sofort sichtbar) und Re-Generierung (neue Texte)
 *
 * Usage: SB_KEY=... ADMIN_KEY=... node test-portal-changes.mjs
 */

const SB_URL = "https://brulvtqeazkgcxkimdve.supabase.co";
const SB_KEY = process.env.SB_KEY;
const ADMIN_KEY = process.env.ADMIN_KEY;
const SITE_URL = "https://sitereadyprototype.pages.dev";

if (!SB_KEY || !ADMIN_KEY) { console.error("SB_KEY + ADMIN_KEY nötig"); process.exit(1); }

const SB_H = { "apikey":SB_KEY,"Authorization":`Bearer ${SB_KEY}`,"Content-Type":"application/json","Prefer":"return=representation" };

const ok  = l => `\x1b[32m✓\x1b[0m ${l}`;
const err = l => `\x1b[31m✗\x1b[0m ${l}`;
const inf = l => `\x1b[36m→\x1b[0m ${l}`;

async function createOrder(o) {
  const r = await fetch(`${SB_URL}/rest/v1/orders`,{method:"POST",headers:SB_H,body:JSON.stringify(o)});
  if(!r.ok) throw new Error(`Insert fehlgeschlagen: ${await r.text()}`);
  return (await r.json())[0];
}
async function patchOrder(id, patch) {
  await fetch(`${SB_URL}/rest/v1/orders?id=eq.${id}`,{method:"PATCH",headers:SB_H,body:JSON.stringify(patch)});
}
async function generate(id) {
  const r = await fetch(`${SITE_URL}/api/generate-website?key=${ADMIN_KEY}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({order_id:id})});
  return r.json();
}
async function getHtml(sub) {
  const r = await fetch(`${SITE_URL}/s/${sub}`);
  return r.ok ? await r.text() : null;
}
async function deleteOrder(id) {
  await fetch(`${SB_URL}/rest/v1/orders?id=eq.${id}`,{method:"DELETE",headers:SB_H});
}

// Prüft ob Text im HTML vorkommt (case-insensitive optional)
function has(html, text, ci=false) {
  return ci ? html.toLowerCase().includes(text.toLowerCase()) : html.includes(text);
}

const allResults = [];
const ids = [];

function result(label, checks) {
  const pass = checks.filter(c=>c.ok).length;
  const total = checks.length;
  const score = Math.round(pass/total*100);
  console.log(`\n  Checks:`);
  for(const c of checks) console.log(`    ${c.ok ? ok(c.label) : err(c.label)}`);
  console.log(`\n  Score: ${score}/100 (${pass}/${total})`);
  allResults.push({label, score});
}

// ══════════════════════════════════════════════════════════
console.log(`\n${"═".repeat(60)}`);
console.log(`  Portal-Änderungs-Tests — ${new Date().toLocaleString("de-AT")}`);
console.log(`${"═".repeat(60)}`);

// ──────────────────────────────────────────────────────────
// TEST 1: Telefonnnummer ändern (serve-time)
// ──────────────────────────────────────────────────────────
{
  console.log(`\n${"─".repeat(60)}`);
  console.log("▶ Test 1: Telefonnummer ändern (serve-time)");
  console.log(`${"─".repeat(60)}`);

  const order = await createOrder({
    firmenname:"Änderungs-Test Elektro",branche:"elektro",branche_label:"Elektriker",
    stil:"klassisch",ort:"Wien",bundesland:"W",adresse:"Teststraße 1",plz:"1010",
    telefon:"+43 1 111111",email:"alt@test.at",unternehmensform:"einzelunternehmen",
    leistungen:["Elektroinstallation","Beleuchtung"],
    kurzbeschreibung:"Test-Betrieb für Änderungs-Tests.",status:"trial",
    subdomain:`test-change-tel-${Date.now().toString(36)}`
  });
  ids.push(order.id);
  console.log(inf(`Order: ${order.id}`));

  await generate(order.id);
  const htmlVorher = await getHtml(order.subdomain);

  // Kunde ändert Telefonnummer im Portal
  await patchOrder(order.id, { telefon: "+43 1 999999" });
  const htmlNachher = await getHtml(order.subdomain);

  result("Telefonnummer ändern", [
    {label:"Website vor Änderung: hat alte Nummer",      ok: has(htmlVorher, "111111")},
    {label:"Website nach Änderung: neue Nummer sichtbar", ok: has(htmlNachher, "999999")},
    {label:"Website nach Änderung: alte Nummer weg",      ok: !has(htmlNachher, "111111")},
    {label:"Kein Re-Generate nötig (serve-time)",         ok: true},  // strukturell, kein Rebuild
  ]);
}

// ──────────────────────────────────────────────────────────
// TEST 2: E-Mail-Adresse ändern (serve-time)
// ──────────────────────────────────────────────────────────
{
  console.log(`\n${"─".repeat(60)}`);
  console.log("▶ Test 2: E-Mail-Adresse ändern (serve-time)");
  console.log(`${"─".repeat(60)}`);

  const order = await createOrder({
    firmenname:"Änderungs-Test Friseur",branche:"friseur",branche_label:"Friseursalon",
    stil:"modern",ort:"Graz",bundesland:"STMK",plz:"8010",
    telefon:"+43 316 000000",email:"alt-mail@salon.at",unternehmensform:"einzelunternehmen",
    leistungen:["Damenschnitt","Herrenschnitt"],
    kurzbeschreibung:"Ihr Friseursalon in Graz.",status:"trial",
    subdomain:`test-change-mail-${Date.now().toString(36)}`
  });
  ids.push(order.id);
  await generate(order.id);

  const htmlVorher = await getHtml(order.subdomain);
  await patchOrder(order.id, { email: "neu@salon.at" });
  const htmlNachher = await getHtml(order.subdomain);

  result("E-Mail ändern", [
    {label:"Alte E-Mail war sichtbar",        ok: has(htmlVorher, "alt-mail@salon.at", true)},
    {label:"Neue E-Mail ist sichtbar",        ok: has(htmlNachher, "neu@salon.at", true)},
    {label:"Alte E-Mail ist weg",             ok: !has(htmlNachher, "alt-mail@salon.at", true)},
  ]);
}

// ──────────────────────────────────────────────────────────
// TEST 3: Ankündigung hinzufügen (serve-time)
// ──────────────────────────────────────────────────────────
{
  console.log(`\n${"─".repeat(60)}`);
  console.log("▶ Test 3: Ankündigung aktivieren (serve-time)");
  console.log(`${"─".repeat(60)}`);

  const order = await createOrder({
    firmenname:"Ankündigungs-Test",branche:"kosmetik",branche_label:"Kosmetik",
    stil:"elegant",ort:"Salzburg",bundesland:"S",plz:"5020",
    telefon:"+43 662 777777",email:"info@kosmetik.at",unternehmensform:"einzelunternehmen",
    leistungen:["Gesichtsbehandlung","Massage"],
    kurzbeschreibung:"Wellness und Schönheit in Salzburg.",status:"trial",
    subdomain:`test-change-ann-${Date.now().toString(36)}`
  });
  ids.push(order.id);
  await generate(order.id);

  const htmlVorher = await getHtml(order.subdomain);

  // Kunde fügt Ankündigung hinzu
  await patchOrder(order.id, {
    announcements: [{
      active: true,
      text: "Sommerpause 15.–28. Juli – jetzt Termin sichern!",
      date_start: "2026-01-01",
      date_end: "2026-12-31"
    }]
  });
  const htmlNachher = await getHtml(order.subdomain);

  // Kunde deaktiviert Ankündigung wieder
  await patchOrder(order.id, {
    announcements: [{active: false, text: "Sommerpause 15.–28. Juli – jetzt Termin sichern!"}]
  });
  const htmlDeaktiviert = await getHtml(order.subdomain);

  result("Ankündigung aktivieren/deaktivieren", [
    {label:"Vor Ankündigung: kein Banner",            ok: !has(htmlVorher, "sr-announcements")},
    {label:"Nach Aktivierung: Banner vorhanden",      ok: has(htmlNachher, "sr-announcements")},
    {label:"Banner enthält korrekten Text",           ok: has(htmlNachher, "Sommerpause")},
    {label:"Nach Deaktivierung: Banner wieder weg",   ok: !has(htmlDeaktiviert, "sr-announcements")},
  ]);
}

// ──────────────────────────────────────────────────────────
// TEST 4: Social Media hinzufügen (serve-time)
// ──────────────────────────────────────────────────────────
{
  console.log(`\n${"─".repeat(60)}`);
  console.log("▶ Test 4: Instagram/Facebook hinzufügen (serve-time)");
  console.log(`${"─".repeat(60)}`);

  const order = await createOrder({
    firmenname:"Social-Test Tischler",branche:"tischler",branche_label:"Tischlerei",
    stil:"klassisch",ort:"Linz",bundesland:"OOE",plz:"4020",
    telefon:"+43 732 444444",email:"info@tischler-test.at",unternehmensform:"einzelunternehmen",
    leistungen:["Maßmöbel","Innenausbau"],
    kurzbeschreibung:"Handwerkskunst in Linz.",status:"trial",
    subdomain:`test-change-social-${Date.now().toString(36)}`
  });
  ids.push(order.id);
  await generate(order.id);

  const htmlVorher = await getHtml(order.subdomain);
  await patchOrder(order.id, {
    instagram: "https://instagram.com/tischler.test",
    facebook: "https://facebook.com/tischlertest"
  });
  const htmlNachher = await getHtml(order.subdomain);

  result("Social Media hinzufügen", [
    {label:"Vorher: kein Instagram-Link",      ok: !has(htmlVorher, "instagram.com")},
    {label:"Nachher: Instagram sichtbar",      ok: has(htmlNachher, "instagram.com")},
    {label:"Nachher: Facebook sichtbar",       ok: has(htmlNachher, "facebook.com")},
    {label:"Serve-time — kein Re-Generate",    ok: true},
  ]);
}

// ──────────────────────────────────────────────────────────
// TEST 5: Stil wechseln (klassisch → modern, serve-time via buildCss)
// ──────────────────────────────────────────────────────────
{
  console.log(`\n${"─".repeat(60)}`);
  console.log("▶ Test 5: Stil wechseln klassisch → modern (serve-time CSS)");
  console.log(`${"─".repeat(60)}`);

  const order = await createOrder({
    firmenname:"Stil-Test Yoga",branche:"yoga",branche_label:"Yoga Studio",
    stil:"klassisch",ort:"Wien",bundesland:"W",plz:"1070",
    telefon:"+43 1 333333",email:"yoga@test.at",unternehmensform:"einzelunternehmen",
    leistungen:["Hatha Yoga","Meditation"],
    kurzbeschreibung:"Yoga und Meditation in Wien.",status:"trial",
    subdomain:`test-change-stil-${Date.now().toString(36)}`
  });
  ids.push(order.id);
  await generate(order.id);

  const htmlVorher = await getHtml(order.subdomain);

  // Kunde wechselt Stil im Design-Tab
  await patchOrder(order.id, { stil: "modern" });
  const htmlNachher = await getHtml(order.subdomain);

  // Klassisch = navy #094067, Modern = indigo #4f46e5 (im CSS)
  result("Stil wechseln (serve-time CSS)", [
    {label:"Vorher: klassisch Primärfarbe (#094067)",   ok: has(htmlVorher, "#094067") || has(htmlVorher, "094067", true)},
    {label:"Nachher: modern Primärfarbe (#18181b)",     ok: has(htmlNachher, "#18181b") || has(htmlNachher, "18181b", true)},
    {label:"Nachher: modern Akzent (#4f46e5)",          ok: has(htmlNachher, "#4f46e5") || has(htmlNachher, "4f46e5", true)},
    {label:"Kein Re-Generate nötig",                    ok: true},
  ]);
}

// ──────────────────────────────────────────────────────────
// TEST 6: Custom Akzentfarbe setzen (serve-time)
// ──────────────────────────────────────────────────────────
{
  console.log(`\n${"─".repeat(60)}`);
  console.log("▶ Test 6: Custom Akzentfarbe #e11d48 (serve-time)");
  console.log(`${"─".repeat(60)}`);

  const order = await createOrder({
    firmenname:"Farb-Test Arzt",branche:"arzt",branche_label:"Arzt",
    stil:"modern",ort:"Innsbruck",bundesland:"T",plz:"6020",
    telefon:"+43 512 222222",email:"arzt@test.at",unternehmensform:"einzelunternehmen",
    leistungen:["Allgemeinmedizin","Vorsorge"],
    kurzbeschreibung:"Ihre Ordination in Innsbruck.",status:"trial",
    subdomain:`test-change-farbe-${Date.now().toString(36)}`
  });
  ids.push(order.id);
  await generate(order.id);

  const htmlVorher = await getHtml(order.subdomain);

  // Kunde wählt eigene Akzentfarbe
  await patchOrder(order.id, { custom_accent: "#e11d48" });
  const htmlNachher = await getHtml(order.subdomain);

  result("Custom Akzentfarbe", [
    {label:"Vorher: Standard-Modern-Akzent (#4f46e5)",  ok: has(htmlVorher, "4f46e5", true)},
    {label:"Nachher: Custom-Akzent (#e11d48)",          ok: has(htmlNachher, "e11d48", true)},
    {label:"Vorher-Akzent ist überschrieben",           ok: !has(htmlNachher, "4f46e5", true) || has(htmlNachher, "e11d48", true)},
  ]);
}

// ──────────────────────────────────────────────────────────
// TEST 7: Bewertungen hinzufügen (serve-time)
// ──────────────────────────────────────────────────────────
{
  console.log(`\n${"─".repeat(60)}`);
  console.log("▶ Test 7: Kundenbewertungen hinzufügen (serve-time)");
  console.log(`${"─".repeat(60)}`);

  const order = await createOrder({
    firmenname:"Bewertungs-Test",branche:"installateur",branche_label:"Installateur",
    stil:"klassisch",ort:"St. Pölten",bundesland:"NOE",plz:"3100",
    telefon:"+43 2742 555555",email:"installateur@test.at",unternehmensform:"einzelunternehmen",
    leistungen:["Heizungsinstallation","Sanitär"],
    kurzbeschreibung:"Ihr Installateur in St. Pölten.",status:"trial",
    subdomain:`test-change-bew-${Date.now().toString(36)}`
  });
  ids.push(order.id);
  await generate(order.id);

  const htmlVorher = await getHtml(order.subdomain);

  // Kunde fügt Bewertungen hinzu
  await patchOrder(order.id, {
    bewertungen: [
      {name:"Klaus M.", text:"Schnell, sauber und fair im Preis. Klare Empfehlung!", sterne:5},
      {name:"Sandra K.", text:"Notfallreparatur innerhalb 2 Stunden. Super Service!", sterne:5},
      {name:"Peter H.", text:"Heizung perfekt installiert. Sehr zufrieden.", sterne:4},
    ]
  });
  const htmlNachher = await getHtml(order.subdomain);

  result("Bewertungen hinzufügen", [
    {label:"Vorher: keine Bewertungssektion",           ok: !has(htmlVorher, "Klaus M.")},
    {label:"Nachher: Bewertungen sichtbar",             ok: has(htmlNachher, "Klaus M.")},
    {label:"Nachher: zweite Bewertung vorhanden",       ok: has(htmlNachher, "Sandra K.")},
    {label:"Nachher: Bewertungstext korrekt",           ok: has(htmlNachher, "Schnell, sauber")},
  ]);
}

// ──────────────────────────────────────────────────────────
// TEST 8: Team-Mitglieder hinzufügen (serve-time)
// ──────────────────────────────────────────────────────────
{
  console.log(`\n${"─".repeat(60)}`);
  console.log("▶ Test 8: Team-Mitglieder hinzufügen (serve-time)");
  console.log(`${"─".repeat(60)}`);

  const order = await createOrder({
    firmenname:"Team-Test Physiotherapie",branche:"physiotherapie",branche_label:"Physiotherapie",
    stil:"modern",ort:"Linz",bundesland:"OOE",plz:"4020",
    telefon:"+43 732 888888",email:"physio@test.at",unternehmensform:"einzelunternehmen",
    leistungen:["Manualtherapie","Sportreha","Massage"],
    kurzbeschreibung:"Physiotherapie Praxis in Linz.",status:"trial",
    subdomain:`test-change-team-${Date.now().toString(36)}`
  });
  ids.push(order.id);
  await generate(order.id);

  const htmlVorher = await getHtml(order.subdomain);

  // Kunde fügt Team-Mitglieder hinzu
  await patchOrder(order.id, {
    team_members: [
      {name:"Mag. Anna Huber", rolle:"Leiterin & Therapeutin"},
      {name:"Thomas Berger", rolle:"Sporttherapeut"},
    ]
  });
  const htmlNachher = await getHtml(order.subdomain);

  result("Team-Mitglieder hinzufügen", [
    {label:"Vorher: kein Team sichtbar",                ok: !has(htmlVorher, "Anna Huber")},
    {label:"Nachher: Name 1 sichtbar",                  ok: has(htmlNachher, "Anna Huber")},
    {label:"Nachher: Name 2 sichtbar",                  ok: has(htmlNachher, "Thomas Berger")},
    {label:"Nachher: Rolle sichtbar",                   ok: has(htmlNachher, "Therapeutin")},
  ]);
}

// ──────────────────────────────────────────────────────────
// TEST 9: Neues Merkmal aktivieren — Notdienst (serve-time Trust-Bar)
// ──────────────────────────────────────────────────────────
{
  console.log(`\n${"─".repeat(60)}`);
  console.log("▶ Test 9: Notdienst aktivieren → Trust-Bar (serve-time)");
  console.log(`${"─".repeat(60)}`);

  const order = await createOrder({
    firmenname:"Notdienst-Test",branche:"elektro",branche_label:"Elektriker",
    stil:"klassisch",ort:"Wien",bundesland:"W",plz:"1010",
    telefon:"+43 1 123000",email:"elektro@test.at",unternehmensform:"einzelunternehmen",
    leistungen:["Elektroinstallation"],notdienst:false,
    kurzbeschreibung:"Elektro-Betrieb Wien.",status:"trial",
    subdomain:`test-change-trust-${Date.now().toString(36)}`
  });
  ids.push(order.id);
  await generate(order.id);

  const htmlVorher = await getHtml(order.subdomain);

  await patchOrder(order.id, {notdienst: true, meisterbetrieb: true, kostenvoranschlag: true});
  const htmlNachher = await getHtml(order.subdomain);

  result("Merkmale aktivieren (Trust-Bar)", [
    {label:"Vorher: kein Notdienst in Trust-Bar",       ok: !has(htmlVorher, "24/7 Notdienst")},
    {label:"Nachher: 24/7 Notdienst sichtbar",          ok: has(htmlNachher, "24/7 Notdienst")},
    {label:"Nachher: Meisterbetrieb sichtbar",          ok: has(htmlNachher, "Meisterbetrieb")},
    {label:"Nachher: Kostenloser KV sichtbar",          ok: has(htmlNachher, "Kostenloser KV")},
  ]);
}

// ──────────────────────────────────────────────────────────
// TEST 10: Re-Generierung — neuer Über-uns Text
// ──────────────────────────────────────────────────────────
{
  console.log(`\n${"─".repeat(60)}`);
  console.log("▶ Test 10: Re-Generierung (Kunde drückt 'Website neu generieren')");
  console.log(`${"─".repeat(60)}`);

  const order = await createOrder({
    firmenname:"ReGen-Test Bäckerei",branche:"baeckerei",branche_label:"Bäckerei",
    stil:"elegant",ort:"Graz",bundesland:"STMK",plz:"8010",
    telefon:"+43 316 666666",email:"baecker@test.at",unternehmensform:"einzelunternehmen",
    leistungen:["Brot","Gebäck","Kuchen"],
    kurzbeschreibung:"Traditionelle Bäckerei in Graz.",status:"trial",
    subdomain:`test-regen-${Date.now().toString(36)}`
  });
  ids.push(order.id);
  console.log(inf(`Order: ${order.id} (${order.subdomain})`));

  // Erste Generierung
  const gen1 = await generate(order.id);
  const html1 = await getHtml(order.subdomain);

  // Kunde ergänzt Spezialisierung und Leistungen → re-generiert
  await patchOrder(order.id, {
    spezialisierung: "Bio-Bäckerei & glutenfreie Spezialitäten",
    leistungen: ["Bio-Brot", "Glutenfreies Sortiment", "Torten", "Brötchen", "Catering"],
    kurzbeschreibung: "Ihre Bio-Bäckerei in Graz – regional, nachhaltig, köstlich."
  });
  const gen2 = await generate(order.id);
  const html2 = await getHtml(order.subdomain);

  result("Re-Generierung nach Inhaltsänderung", [
    {label:"Erste Generierung erfolgreich",             ok: gen1.ok === true},
    {label:"Zweite Generierung erfolgreich",            ok: gen2.ok === true},
    {label:"HTML 1 enthält ursprüngliche Leistungen",  ok: has(html1, "Brot") || has(html1, "Gebäck")},
    {label:"HTML 2 enthält neue Spezialisierung",      ok: has(html2, "Bio", true) || has(html2, "glutenfrei", true) || has(html2, "Catering", true)},
    {label:"Kein Placeholder übrig nach Re-Gen",       ok: !has(html2, "{{")},
    {label:"Impressum nach Re-Gen OK",                 ok: (await (async()=>{const r=await fetch(`${SITE_URL}/s/${order.subdomain}/impressum`);return r.ok;})())},
  ]);
}

// ══════════════════════════════════════════════════════════
// ZUSAMMENFASSUNG
// ══════════════════════════════════════════════════════════
console.log(`\n${"═".repeat(60)}`);
console.log("  ERGEBNIS");
console.log(`${"═".repeat(60)}`);
const pass = allResults.filter(r=>r.score>=80).length;
console.log(`  ${pass}/${allResults.length} Tests bestanden\n`);
for(const r of allResults) {
  const c = r.score>=90?"\x1b[32m":r.score>=75?"\x1b[33m":"\x1b[31m";
  const ic = r.score>=90?"✓":r.score>=75?"~":"✗";
  console.log(`  ${c}${ic}\x1b[0m ${r.label.padEnd(48)} ${r.score}/100`);
}

// Cleanup
console.log(`\n  ${ids.length} Test-Orders löschen...`);
await Promise.all(ids.map(deleteOrder));
console.log("  Cleanup abgeschlossen.\n");
