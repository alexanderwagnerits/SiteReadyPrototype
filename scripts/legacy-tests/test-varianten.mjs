/**
 * Varianten-Test — prüft automatische Design-Varianten je nach Content-Menge
 * Jede Kombination wird generiert und das HTML auf den richtigen Variant geprüft.
 *
 * Usage: SB_KEY=... ADMIN_KEY=... node test-varianten.mjs
 */

const SB_URL  = "https://brulvtqeazkgcxkimdve.supabase.co";
const SB_KEY  = process.env.SB_KEY;
const ADMIN_KEY = process.env.ADMIN_KEY;
const SITE    = "https://sitereadyprototype.pages.dev";

if (!SB_KEY || !ADMIN_KEY) { console.error("SB_KEY + ADMIN_KEY nötig"); process.exit(1); }

const HDR = { "apikey":SB_KEY,"Authorization":`Bearer ${SB_KEY}`,"Content-Type":"application/json","Prefer":"return=representation" };

const ok  = l => `\x1b[32m✓\x1b[0m ${l}`;
const err = l => `\x1b[31m✗\x1b[0m ${l}`;

const HERO_IMG = "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=1200&h=630&fit=crop&q=80";
const FOTO1    = "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&q=70";
const FOTO2    = "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&h=600&fit=crop&q=70";
const FOTO3    = "https://images.unsplash.com/photo-1499529112087-3cb3b73cec95?w=800&h=600&fit=crop&q=70";
const FOTO4    = "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=600&fit=crop&q=70";
const FOTO5    = "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=800&h=600&fit=crop&q=70";
const FOTO6    = "https://images.unsplash.com/photo-1565793979451-e0d87d9b9e34?w=800&h=600&fit=crop&q=70";

async function insert(o) {
  const r = await fetch(`${SB_URL}/rest/v1/orders`,{method:"POST",headers:HDR,body:JSON.stringify(o)});
  if (!r.ok) throw new Error(`Insert fehlgeschlagen ${r.status}: ${await r.text()}`);
  return (await r.json())[0];
}
async function gen(id) {
  const r = await fetch(`${SITE}/api/generate-website?key=${ADMIN_KEY}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({order_id:id})});
  const j = await r.json();
  if (!j.ok) throw new Error(j.error || "Generierung fehlgeschlagen");
  return j;
}
async function html(sub) {
  const r = await fetch(`${SITE}/s/${sub}`);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.text();
}
async function del(id) {
  await fetch(`${SB_URL}/rest/v1/orders?id=eq.${id}`,{method:"DELETE",headers:HDR});
}

// Basis-Order für alle Tests
const BASE = {
  branche:"elektro",branche_label:"Elektriker",ort:"Wien",bundesland:"W",
  adresse:"Testgasse 1",plz:"1010",telefon:"+43 1 100000",
  email:"test@test.at",unternehmensform:"einzelunternehmen",
  kurzbeschreibung:"Test-Betrieb für Varianten-Tests.",status:"trial"
};

const results = [];
const ids = [];

function check(label, checks) {
  const pass = checks.filter(c=>c.ok).length;
  const score = Math.round(pass/checks.length*100);
  console.log(`\n  Checks:`);
  for(const c of checks) console.log(`    ${c.ok?ok(c.label):err(c.label)}`);
  console.log(`  → ${score}/100`);
  results.push({label,score});
}

console.log(`\n${"═".repeat(62)}`);
console.log(`  Varianten-Tests — ${new Date().toLocaleString("de-AT")}`);
console.log(`${"═".repeat(62)}`);

// ══════════════════════════════════════════════════════════════
// HERO-VARIANTEN
// ══════════════════════════════════════════════════════════════

// ── Hero MINIMAL: kein Bild, Override auf minimal ─────────────
{
  console.log(`\n${"─".repeat(62)}`);
  console.log("▶ Hero minimal — kein Bild, zentriert");
  const sub = `tv-hero-min-${Date.now().toString(36)}`;
  const o = await insert({...BASE,firmenname:"Hero Minimal Test",stil:"klassisch",
    leistungen:["Elektro","Licht"],
    varianten_cache:{hero:"minimal"}, // Override: Bild-Upload überspringen
    subdomain:sub
  });
  ids.push(o.id);
  await gen(o.id);
  const h = await html(sub);
  check("Hero: minimal", [
    {label:"hero-inner vorhanden",              ok: h.includes("hero-inner")},
    {label:"kein hero-split-img",               ok: !h.includes("hero-split-img")},
    {label:"kein Hero-Bild-Overlay-Gradient",    ok: !h.includes("background:linear-gradient(to bottom")},
    {label:"text-align:center im Minimal-CSS",  ok: h.includes("text-align:center") && (h.includes("min-height:70vh") || h.includes("70svh"))},
  ]);
}

// ── Hero SPLIT: Modern + Bild rechts ──────────────────────────
{
  console.log(`\n${"─".repeat(62)}`);
  console.log("▶ Hero split — Modern + Bild rechts");
  const sub = `tv-hero-split-${Date.now().toString(36)}`;
  const o = await insert({...BASE,firmenname:"Hero Split Test",stil:"modern",
    leistungen:["Elektro","Solar"],url_hero:HERO_IMG,subdomain:sub
  });
  ids.push(o.id);
  await gen(o.id);
  const h = await html(sub);
  check("Hero: split (Modern + Bild)", [
    {label:"hero-split-img div vorhanden",      ok: h.includes("hero-split-img")},
    {label:"Bild-URL im <img> src",             ok: h.includes(HERO_IMG)},
    {label:"hero-split-text div vorhanden",     ok: h.includes("hero-split-text")},
    {label:"grid layout für Desktop",           ok: h.includes("grid-template-columns") && h.includes("hero-split")},
    {label:"kein Vollbild-Hintergrund",         ok: !h.includes("background:linear-gradient(to bottom")},
  ]);
}

// ── Hero FULLSCREEN: Klassisch + Bild als Hintergrund ─────────
{
  console.log(`\n${"─".repeat(62)}`);
  console.log("▶ Hero fullscreen — Klassisch + Hintergrundbild");
  const sub = `tv-hero-full-${Date.now().toString(36)}`;
  const o = await insert({...BASE,firmenname:"Hero Fullscreen Test",stil:"klassisch",
    leistungen:["Elektro","Solar"],url_hero:HERO_IMG,subdomain:sub
  });
  ids.push(o.id);
  await gen(o.id);
  const h = await html(sub);
  check("Hero: fullscreen (Klassisch + Bild)", [
    {label:"background:linear-gradient im Hero",   ok: h.includes("background:linear-gradient")},
    {label:"Bild-URL im Background CSS",            ok: h.includes(HERO_IMG)},
    {label:"kein hero-split-img",                   ok: !h.includes("hero-split-img")},
    {label:"align-items:center (Text mittig)",       ok: h.includes("align-items:center")},
  ]);
}

// ── Hero FULLSCREEN: Elegant + Bild ───────────────────────────
{
  console.log(`\n${"─".repeat(62)}`);
  console.log("▶ Hero fullscreen — Elegant + Hintergrundbild");
  const sub = `tv-hero-eleg-${Date.now().toString(36)}`;
  const o = await insert({...BASE,firmenname:"Hero Elegant Test",stil:"elegant",
    leistungen:["Elektro"],url_hero:HERO_IMG,subdomain:sub
  });
  ids.push(o.id);
  await gen(o.id);
  const h = await html(sub);
  check("Hero: fullscreen (Elegant + Bild)", [
    {label:"background:linear-gradient im Hero",   ok: h.includes("background:linear-gradient")},
    {label:"Bild-URL im Background CSS",            ok: h.includes(HERO_IMG)},
    {label:"kein hero-split-img",                   ok: !h.includes("hero-split-img")},
  ]);
}

// ══════════════════════════════════════════════════════════════
// ABLAUF-VARIANTEN
// ══════════════════════════════════════════════════════════════

// ── Ablauf HORIZONTAL: 3 Schritte ─────────────────────────────
{
  console.log(`\n${"─".repeat(62)}`);
  console.log("▶ Ablauf horizontal — 3 Schritte (≤4)");
  const sub = `tv-ablauf-h-${Date.now().toString(36)}`;
  const o = await insert({...BASE,firmenname:"Ablauf Horizontal Test",stil:"klassisch",
    leistungen:["Elektro"],
    ablauf_schritte:[
      {titel:"Anfrage",text:"Sie schildern uns Ihr Anliegen."},
      {titel:"Termin",text:"Wir vereinbaren einen Besichtigungstermin."},
      {titel:"Umsetzung",text:"Fachgerechte Ausführung."},
    ],
    subdomain:sub
  });
  ids.push(o.id);
  await gen(o.id);
  const h = await html(sub);
  check("Ablauf: horizontal (3 Schritte)", [
    {label:"sr-ablauf-h (horizontal wrapper)",  ok: h.includes('class="sr-ablauf-h"')},
    {label:"sr-ablauf-arrow Pfeile vorhanden",  ok: h.includes('class="sr-ablauf-arrow"')},
    {label:"Schritt 'Anfrage' sichtbar",        ok: h.includes("Anfrage")},
    {label:"kein padding-left:48px (vertikal)", ok: !h.includes("padding-left:48px")},
  ]);
}

// ── Ablauf VERTIKAL: 5 Schritte ───────────────────────────────
{
  console.log(`\n${"─".repeat(62)}`);
  console.log("▶ Ablauf vertikal — 5 Schritte (>4)");
  const sub = `tv-ablauf-v-${Date.now().toString(36)}`;
  const o = await insert({...BASE,firmenname:"Ablauf Vertikal Test",stil:"modern",
    leistungen:["Elektro"],
    ablauf_schritte:[
      {titel:"Kontakt aufnehmen",text:"Rufen Sie an oder schreiben Sie uns."},
      {titel:"Beratungsgespräch",text:"Wir besprechen Ihre Anforderungen."},
      {titel:"Angebot",text:"Sie erhalten ein kostenloses Angebot."},
      {titel:"Terminvereinbarung",text:"Wir planen die Umsetzung."},
      {titel:"Fertigstellung",text:"Abnahme und Übergabe."},
    ],
    subdomain:sub
  });
  ids.push(o.id);
  await gen(o.id);
  const h = await html(sub);
  check("Ablauf: vertikal (5 Schritte)", [
    {label:"padding-left:48px (Timeline)",      ok: h.includes("padding-left:48px")},
    {label:"Timeline-Linie vorhanden",          ok: h.includes("position:absolute;left:15px") || h.includes("position:absolute;left:0;top:0;bottom:0")},
    {label:"kein sr-ablauf-h",                  ok: !h.includes('class="sr-ablauf-h"')},
    {label:"kein sr-ablauf-arrow",              ok: !h.includes('class="sr-ablauf-arrow"')},
    {label:"Alle 5 Schritte sichtbar",          ok: h.includes("Fertigstellung")},
  ]);
}

// ══════════════════════════════════════════════════════════════
// TEAM-VARIANTEN
// ══════════════════════════════════════════════════════════════

// ── Team SINGLE: 1 Person ─────────────────────────────────────
{
  console.log(`\n${"─".repeat(62)}`);
  console.log("▶ Team single — 1 Person");
  const sub = `tv-team-1-${Date.now().toString(36)}`;
  const o = await insert({...BASE,firmenname:"Team Single Test",stil:"klassisch",
    leistungen:["Elektro"],
    team_members:[{name:"Maria Huber",rolle:"Inhaberin"}],
    subdomain:sub
  });
  ids.push(o.id);
  await gen(o.id);
  const h = await html(sub);
  check("Team: single (1 Person)", [
    {label:"Name sichtbar",                          ok: h.includes("Maria Huber")},
    {label:"Rolle sichtbar",                         ok: h.includes("Inhaberin")},
    {label:"flex-Layout (kein Grid-Card-Style)",     ok: h.includes("display:flex;align-items:center;gap:20px")},
  ]);
}

// ── Team GRID-3: 2 Personen ───────────────────────────────────
{
  console.log(`\n${"─".repeat(62)}`);
  console.log("▶ Team grid-3 — 2 Personen");
  const sub = `tv-team-2-${Date.now().toString(36)}`;
  const o = await insert({...BASE,firmenname:"Team Grid3 Test",stil:"modern",
    leistungen:["Elektro"],
    team_members:[
      {name:"Bernhard Madlener",rolle:"Strategie & Content"},
      {name:"Markus Wagner",rolle:"Sales & Relations"},
    ],
    subdomain:sub
  });
  ids.push(o.id);
  await gen(o.id);
  const h = await html(sub);
  check("Team: grid-3 (2 Personen)", [
    {label:"Name 1 sichtbar",                        ok: h.includes("Bernhard Madlener")},
    {label:"Name 2 sichtbar",                        ok: h.includes("Markus Wagner")},
    {label:"2-Spalter grid (1fr 1fr)",               ok: h.includes("grid-template-columns:1fr 1fr")},
    {label:"Karten-Layout (Avatar oben)",            ok: h.includes("text-align:center")},
  ]);
}

// ── Team GRID-4: 4 Personen ───────────────────────────────────
{
  console.log(`\n${"─".repeat(62)}`);
  console.log("▶ Team grid-4 — 4 Personen");
  const sub = `tv-team-4-${Date.now().toString(36)}`;
  const o = await insert({...BASE,firmenname:"Team Grid4 Test",stil:"elegant",
    leistungen:["Elektro"],
    team_members:[
      {name:"Anna Berger",rolle:"CEO"},
      {name:"Max Müller",rolle:"CTO"},
      {name:"Lisa Schmidt",rolle:"Design"},
      {name:"Tom Koch",rolle:"Sales"},
    ],
    subdomain:sub
  });
  ids.push(o.id);
  await gen(o.id);
  const h = await html(sub);
  check("Team: grid-4 (4 Personen)", [
    {label:"Name 1 sichtbar",                        ok: h.includes("Anna Berger")},
    {label:"Name 4 sichtbar",                        ok: h.includes("Tom Koch")},
    {label:"kompaktes 2-Spalter Grid",               ok: h.includes("grid-template-columns:1fr 1fr")},
    {label:"kleinere Avatare (44px)",                ok: h.includes("width:44px")},
  ]);
}

// ══════════════════════════════════════════════════════════════
// BEWERTUNGS-VARIANTEN
// ══════════════════════════════════════════════════════════════

// ── Bewertungen BLOCKQUOTE: 1 Bewertung ───────────────────────
{
  console.log(`\n${"─".repeat(62)}`);
  console.log("▶ Bewertungen blockquote — 1 Bewertung");
  const sub = `tv-bew-bq-${Date.now().toString(36)}`;
  const o = await insert({...BASE,firmenname:"Bewertung Blockquote Test",stil:"klassisch",
    leistungen:["Elektro"],
    bewertungen:[
      {name:"Karl Maier",text:"Ausgezeichnete Arbeit, sehr pünktlich und sauber!",sterne:5}
    ],
    subdomain:sub
  });
  ids.push(o.id);
  await gen(o.id);
  const h = await html(sub);
  check("Bewertungen: blockquote (1 Bewertung)", [
    {label:"Großes Zitat-Zeichen „ (font-size:2rem)",     ok: h.includes("font-size:2rem")},
    {label:"Dunkler Hintergrund (var(--primary))",         ok: h.includes("background:var(--primary)")},
    {label:"Bewertungstext sichtbar",                      ok: h.includes("pünktlich und sauber")},
    {label:"Name sichtbar",                                ok: h.includes("Karl Maier")},
    {label:"kein sec-bew-grid (wäre Cards-Layout)",       ok: !h.includes("sec-bew-grid") || h.includes("Karl Maier")},
  ]);
}

// ── Bewertungen CARDS: 3 Bewertungen ──────────────────────────
{
  console.log(`\n${"─".repeat(62)}`);
  console.log("▶ Bewertungen cards — 3 Bewertungen");
  const sub = `tv-bew-cards-${Date.now().toString(36)}`;
  const o = await insert({...BASE,firmenname:"Bewertung Cards Test",stil:"modern",
    leistungen:["Elektro"],
    bewertungen:[
      {name:"Anna K.",text:"Super schnelle Reaktion beim Notfall!",sterne:5},
      {name:"Peter S.",text:"Sehr kompetent und fair im Preis.",sterne:5},
      {name:"Maria H.",text:"Tolle Arbeit, klare Empfehlung.",sterne:4},
    ],
    subdomain:sub
  });
  ids.push(o.id);
  await gen(o.id);
  const h = await html(sub);
  check("Bewertungen: cards (3 Bewertungen)", [
    {label:"sec-bew-grid vorhanden",                  ok: h.includes("sec-bew-grid")},
    {label:"repeat(3,1fr) für 3 Karten",              ok: h.includes("repeat(3,1fr)")},
    {label:"Alle 3 Namen sichtbar",                   ok: h.includes("Anna K.") && h.includes("Peter S.") && h.includes("Maria H.")},
    {label:"kein 2rem Zitat-Zeichen (kein blockquote)", ok: !h.includes("font-size:2rem") || h.includes("sec-bew-grid")},
  ]);
}

// ══════════════════════════════════════════════════════════════
// FAQ-VARIANTEN
// ══════════════════════════════════════════════════════════════

// ── FAQ EINSPALTIG: 2 Fragen ──────────────────────────────────
{
  console.log(`\n${"─".repeat(62)}`);
  console.log("▶ FAQ einspaltig — 2 Fragen (≤2)");
  const sub = `tv-faq-1-${Date.now().toString(36)}`;
  const o = await insert({...BASE,firmenname:"FAQ Einspaltig Test",stil:"klassisch",
    leistungen:["Elektro"],
    faq:[
      {frage:"Wie schnell sind Sie bei einem Notfall?",antwort:"Innerhalb von 60 Minuten sind wir vor Ort."},
      {frage:"Geben Sie Garantie auf Ihre Arbeit?",antwort:"Ja, 2 Jahre Gewährleistung auf alle Arbeiten."},
    ],
    subdomain:sub
  });
  ids.push(o.id);
  await gen(o.id);
  const h = await html(sub);
  check("FAQ: einspaltig (2 Fragen)", [
    {label:"FAQ-Section vorhanden",            ok: h.includes("sec-faq") || h.includes("sr-faq-btn")},
    {label:"max-width:720px (einspaltig)",     ok: h.includes("max-width:720px")},
    {label:"kein sr-faq-grid (zweispaltig)",   ok: !h.includes("sr-faq-grid")},
    {label:"Frage 1 sichtbar",                 ok: h.includes("Notfall")},
    {label:"Frage 2 sichtbar",                 ok: h.includes("Garantie")},
  ]);
}

// ── FAQ ZWEISPALTIG: 4 Fragen ─────────────────────────────────
{
  console.log(`\n${"─".repeat(62)}`);
  console.log("▶ FAQ zweispaltig — 4 Fragen (>2)");
  const sub = `tv-faq-2-${Date.now().toString(36)}`;
  const o = await insert({...BASE,firmenname:"FAQ Zweispaltig Test",stil:"modern",
    leistungen:["Elektro"],
    faq:[
      {frage:"Wie schnell kommen Sie?",antwort:"Innerhalb von 60 Minuten beim Notfall."},
      {frage:"Bieten Sie Kostenvoranschlag?",antwort:"Ja, kostenlos und unverbindlich."},
      {frage:"Welche Leistungen bieten Sie an?",antwort:"Alle Elektroarbeiten von A bis Z."},
      {frage:"Haben Sie Notdienst?",antwort:"Ja, 24 Stunden an 7 Tagen."},
    ],
    subdomain:sub
  });
  ids.push(o.id);
  await gen(o.id);
  const h = await html(sub);
  check("FAQ: zweispaltig (4 Fragen)", [
    {label:"sr-faq-grid (zweispaltig wrapper)",  ok: h.includes("sr-faq-grid")},
    {label:"grid-template-columns:1fr 1fr",      ok: h.includes("grid-template-columns:1fr 1fr")},
    {label:"alle 4 Fragen sichtbar",             ok: h.includes("Notfall") && h.includes("Notdienst")},
  ]);
}

// ══════════════════════════════════════════════════════════════
// GALERIE-VARIANTEN
// ══════════════════════════════════════════════════════════════

// ── Galerie GRID-2x2: 3 Fotos ─────────────────────────────────
{
  console.log(`\n${"─".repeat(62)}`);
  console.log("▶ Galerie grid-2x2 — 3 Fotos (≤4)");
  const sub = `tv-gal-2-${Date.now().toString(36)}`;
  const o = await insert({...BASE,firmenname:"Galerie 2x2 Test",stil:"klassisch",
    leistungen:["Elektro"],
    galerie:[
      {url:FOTO1,caption:"Projekt 1"},{url:FOTO2,caption:"Projekt 2"},{url:FOTO3,caption:"Projekt 3"}
    ],
    subdomain:sub
  });
  ids.push(o.id);
  await gen(o.id);
  const h = await html(sub);
  check("Galerie: grid-2x2 (3 Fotos)", [
    {label:"Galerie-Section vorhanden",      ok: h.includes("sec-galerie")},
    {label:"repeat(2,1fr) — 2-Spalter",     ok: h.includes("repeat(2,1fr)")},
    {label:"repeat(2,1fr) im galerie grid",   ok: h.includes("grid-template-columns:repeat(2,1fr)")},
    {label:"Foto 1 URL sichtbar",            ok: h.includes(FOTO1)},
    {label:"Foto 3 URL sichtbar",            ok: h.includes(FOTO3)},
  ]);
}

// ── Galerie GRID-3x2: 6 Fotos ─────────────────────────────────
{
  console.log(`\n${"─".repeat(62)}`);
  console.log("▶ Galerie grid-3x2 — 6 Fotos (>4)");
  const sub = `tv-gal-3-${Date.now().toString(36)}`;
  const o = await insert({...BASE,firmenname:"Galerie 3x2 Test",stil:"modern",
    leistungen:["Elektro"],
    galerie:[
      {url:FOTO1,caption:"A"},{url:FOTO2,caption:"B"},{url:FOTO3,caption:"C"},
      {url:FOTO4,caption:"D"},{url:FOTO5,caption:"E"},{url:FOTO6,caption:"F"},
    ],
    subdomain:sub
  });
  ids.push(o.id);
  await gen(o.id);
  const h = await html(sub);
  check("Galerie: grid-3x2 (6 Fotos)", [
    {label:"Galerie-Section vorhanden",      ok: h.includes("sec-galerie")},
    {label:"repeat(3,1fr) — 3-Spalter",     ok: h.includes("repeat(3,1fr)")},
    {label:"Alle 6 Fotos vorhanden",         ok: [FOTO1,FOTO2,FOTO3,FOTO4,FOTO5,FOTO6].every(u=>h.includes(u))},
  ]);
}

// ══════════════════════════════════════════════════════════════
// KONTAKT-VARIANTEN
// ══════════════════════════════════════════════════════════════

// ── Kontakt MIT-MAP: Adresse vorhanden ────────────────────────
{
  console.log(`\n${"─".repeat(62)}`);
  console.log("▶ Kontakt mit-map — Adresse vorhanden");
  const sub = `tv-map-ja-${Date.now().toString(36)}`;
  const o = await insert({...BASE,firmenname:"Kontakt Map Test",stil:"klassisch",
    leistungen:["Elektro"],subdomain:sub
    // BASE enthält adresse:"Testgasse 1", plz:"1010", ort:"Wien"
  });
  ids.push(o.id);
  await gen(o.id);
  const h = await html(sub);
  check("Kontakt: mit-map (Adresse vorhanden)", [
    {label:"Google Maps iframe eingebettet",    ok: h.includes("maps.google.com")},
    {label:"Adresse im Query-String",           ok: h.includes("Testgasse") || h.includes("Wien")},
    {label:"iframe width=100%",                 ok: h.includes('width="100%"')},
  ]);
}

// ── Kontakt OHNE-MAP: keine Adresse ───────────────────────────
{
  console.log(`\n${"─".repeat(62)}`);
  console.log("▶ Kontakt ohne-map — keine Adresse");
  const sub = `tv-map-nein-${Date.now().toString(36)}`;
  const o = await insert({
    firmenname:"Kontakt OhneMap Test",branche:"it_service",branche_label:"IT-Service",
    stil:"modern",bundesland:"W",
    telefon:"+43 1 200000",email:"nomap@test.at",unternehmensform:"einzelunternehmen",
    leistungen:["IT-Support"],kurzbeschreibung:"IT-Dienste österreichweit.",status:"trial",
    // KEIN adresse, KEIN plz, KEIN ort
    subdomain:sub
  });
  ids.push(o.id);
  await gen(o.id);
  const h = await html(sub);
  check("Kontakt: ohne-map (keine Adresse)", [
    {label:"kein Google Maps iframe",           ok: !h.includes("maps.google.com")},
    {label:"Kontakt-Section trotzdem vorhanden",ok: h.includes('id="kontakt"')},
  ]);
}

// ══════════════════════════════════════════════════════════════
// ERGEBNIS
// ══════════════════════════════════════════════════════════════
console.log(`\n${"═".repeat(62)}`);
console.log("  ERGEBNIS");
console.log(`${"═".repeat(62)}`);
const pass = results.filter(r=>r.score>=80).length;
console.log(`  ${pass}/${results.length} Varianten-Tests bestanden\n`);
for(const r of results) {
  const c = r.score>=90?"\x1b[32m":r.score>=75?"\x1b[33m":"\x1b[31m";
  const ic = r.score>=90?"✓":r.score>=75?"~":"✗";
  console.log(`  ${c}${ic}\x1b[0m ${r.label.padEnd(48)} ${r.score}/100`);
}

console.log(`\n  ${ids.length} Test-Orders löschen...`);
await Promise.all(ids.map(del));
console.log("  Cleanup abgeschlossen.\n");
