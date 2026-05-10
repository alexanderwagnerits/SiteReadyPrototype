# Recipe-Konfiguration — 24 Recipes auf Beta-Template-Basis

> **Quelle der Wahrheit für Live-Bau Layer 3 (Recipes).** Jedes Recipe = Beta-Template-Stil + Layout + Section-Reihenfolge + Section-Toggles. **Keine neuen Sektionen erfunden** — nur Komposition aus bestehenden Beta-Bausteinen.

**Stand:** 2026-05-06
**Basis:** [`functions/templates/template.js`](../../functions/templates/template.js) (Beta-Template, produktiv)
**Theme-Tokens:** [`themes.md`](themes.md) (v2-Themes Klassisch/Edel/Rustikal)

---

## Beta-Template-Werkzeugkiste

### Stile (CSS-Klasse am `<body>`)
- `.stil-klassisch` — Merriweather Serif, Navy/Indigo (Default für klassische Dienstleister)
- `.stil-modern` — Space Grotesk Sans, Pill-Buttons, Blur-Blobs (Default für moderne Coaches/Studios)
- `.stil-elegant` — Cormorant Garamond, leichte Weights, Border-Cards (Default für Premium)
- `.stil-rustikal` — **NEU für v2** — Unna Serif, Burgund + Warmgold, Noise-Filter (Default für Werkstatt/Wirtshaus)
- `.stil-custom` — User-definierte Farben + Font

### Layouts (Datenfeld `o.layout`)
- **standard** — Hero, Leistungen, Über, Galerie, Bewertungen, Kontakt (bewährter Aufbau)
- **kompakt** — Hero, Leistungen-kompakt (3-Spalten), Über, Kontakt — kein Ablauf, kürzere Texte
- **ausführlich** — wie standard + FAQ + Fakten + CTA-Block + vertikaler Ablauf

### Section-Pool (alle in `template.js` vorhanden)

| Section | Klassen-Variante | Wann nutzen |
|---|---|---|
| Hero | `.hero` mit `.hero-trust-bar` (optional) | Pflicht |
| Leistungen-alternierend | `.leist-list` mit `.leist-item` (Bild-Text-Wechsel) | Standard für Berufsgruppen mit Foto-Material pro Leistung |
| Leistungen-kompakt | `.leist-more` (3-Spalten-Cards) | Wenn keine Fotos pro Leistung — z.B. Anwalt, Berater |
| Ablauf | `.ablauf-steps` (4 Steps horizontal) | Branchen mit klarem Prozess: Architekt, Berater, Coach |
| Über | `.ueber` mit `.ueber-vorteile` + optional `.ueber-stats` | Pflicht |
| Team (innerhalb Über) | `.team-grid` als Sub-Block | Wenn ≥2 Personen + Fotos |
| Galerie | `.galerie-grid` (3-Spalten 3:2) | Wenn ≥3 Foto-Material vorhanden |
| Bewertungen-Cards | `.bew-grid` mit `.bew-card` | Wenn ≥3 Bewertungen |
| Bewertungen-Quote | `.bew-quote` (1 großes Zitat mit Border-Left) | Wenn 1 starkes Zitat |
| Bewertungen-Liste | `.bew-list` mit `.bew-item` | Wenn 4-10 kürzere Stimmen |
| FAQ | `.faq` mit `.faq-item` | Layout=ausführlich Default |
| Kontakt-Standard | `.kontakt` mit Map + Form | Standard |
| Kontakt-Minimal | `.kontakt` ohne Form (nur Info + Map) | Wenn keine Anfragen erwünscht (Restaurant: Tel-Reservierung) |
| CTA-Block | `.cta-block` (Color-BG, Closing-Section) | Layout=ausführlich Default |
| Termin-CTA | `.termin-cta` (Buchungslink-Block) | Branchen mit Online-Termin |
| Sec-Fakten | `.sec-fakten` (Stats-Block) | Layout=ausführlich Default |
| Sec-Partner | `.sec-partner` (Logo-Strip) | Wenn Partner/Mitgliedschaften vorhanden |
| Footer | `<footer>` 4-spaltig | Pflicht |

### Branchen-Funktionen (laut RECIPE-SYSTEM.md § Branchen-Funktionen)

Diese sind **keine eigenen Sektionen**, sondern Felder/Komponenten innerhalb bestehender Sektionen:

- **Speisekarte** (Gastro) — Items innerhalb der Leistungen-Sektion mit Preis-Spalte (`.leist-item-price`)
- **Reservierung-Anfrage** (Gastro) — Form-Variante in Kontakt mit Datum + Personen-Anzahl statt Standard
- **Termin-Anfrage** (Praxis, Coach) — Form-Variante mit Wunschtermin-Picker
- **Notdienst-Banner** (Anwalt, Praxis-Notdienst) — Kleine rote Box im Kontakt mit 24/7-Tel
- **Buchungs-Anfrage** (Hotel) — Form mit Anreise + Abreise + Personen
- **Sprechzeiten-Block** (Praxis) — Wochentage-Liste in Kontakt
- **Universal-Highlight** (alle) — flexibler Content-Block für Edge-Cases

---

## Recipe-Konfigurations-Tabelle (24 Recipes)

| # | Recipe | Theme v2 | Stil (Beta) | Layout | Akzentfarbe-Default | Leistungen-Variante | Bewertungen-Variante | Optional aktiv |
|---|---|---|---|---|---|---|---|---|
| 1 | Handwerk-Werkstatt | Rustikal | rustikal | standard | Burgund `#7a3528` | alternierend | cards | Galerie ja, Trust ja |
| 2 | Handwerk-Bau | Klassisch | klassisch | standard | Navy `#0f2b5b` | alternierend | cards | Galerie ja, Ablauf ja, Sec-Partner ja |
| 3 | Handwerk-Modern | Klassisch | modern | standard | Indigo `#6366f1` | alternierend | cards | Galerie ja, Trust ja |
| 4 | Handwerk-Premium | Edel | elegant | standard | Old-Gold `#a87b3f` | alternierend | quote | Galerie ja |
| 5 | Gastro-Wirtshaus | Rustikal | rustikal | standard | Burgund `#7a3528` | alternierend (Speisekarte als Leistung) | quote | Galerie ja, Termin-CTA optional |
| 6 | Gastro-Casual | Klassisch | klassisch | kompakt | Terra `#c87356` | kompakt (Speisekarte als Leistung) | cards | Galerie ja |
| 7 | Gastro-Editorial | Edel | elegant | ausführlich | Petrol `#5b9bb3` | alternierend (Speisekarte als Leistung) | quote | Galerie ja, FAQ ja, kein Form |
| 8 | Gesundheit-Praxis | Klassisch | klassisch | kompakt | Medical-Blue `#0e7490` | kompakt | quote | Sprechzeiten-Block, Termin-Form |
| 9 | Dienstleistung-Klassisch | Klassisch | klassisch | kompakt | Navy `#0f2b5b` | kompakt | quote | Sec-Partner optional |
| 10 | Dienstleistung-Modern | Klassisch | modern | standard | Indigo `#6366f1` | alternierend | cards | Ablauf ja, Galerie optional |
| 11 | Dienstleistung-Premium | Edel | elegant | ausführlich | Anthrazit `#292524` | alternierend | quote | FAQ ja, CTA-Block ja |
| 12 | Bildung-Klassisch | Klassisch | klassisch | standard | Navy `#0f2b5b` | alternierend | cards | Sec-Partner ja, FAQ ja |
| 13 | Bildung-Modern | Klassisch | modern | standard | Tannengruen `#2d5d3f` | alternierend | cards | FAQ ja |
| 14 | Tourismus-Klassisch | siehe Anmerkung | klassisch ODER rustikal | ausführlich | Petrol/Old-Gold | alternierend | quote | Galerie ja, Sec-Fakten ja, Buchungs-Anfrage |
| 15 | Tourismus-Editorial-Premium | Edel | elegant | ausführlich | Old-Gold `#a08456` | alternierend | quote | Galerie ja (großes Foto-Material) |
| 16 | Handel-Klassisch | Klassisch | klassisch | standard | Navy `#0f2b5b` | alternierend | cards | Galerie ja |
| 17 | Handel-Boutique-Premium | Edel | elegant | standard | Old-Gold `#a87b3f` | alternierend | quote | Galerie ja, kein Form (nur Adresse) |
| 18 | Mobilitaet-Funktional | Klassisch | klassisch | kompakt | Navy `#0f2b5b` | kompakt | liste | Sec-Fakten ja |
| 19 | Agrar-Klassisch | Rustikal | rustikal | standard | Tannengruen `#3a4f2c` | alternierend | quote | Galerie ja |
| 20 | Agrar-Premium | siehe Anmerkung | elegant ODER rustikal | standard | Burgund/Anthrazit | alternierend | quote | Galerie ja |
| 21 | Industrie-Technisch | Klassisch | klassisch | standard | Navy `#0f2b5b` | alternierend | liste | Sec-Fakten ja, Sec-Partner ja |
| 22 | Kosmetik-Modern | Klassisch | modern | standard | Korallenrot `#e76e7e` | alternierend | cards | Galerie ja, Termin-CTA |
| 23 | Kosmetik-Premium | Edel | elegant | standard | Anthrazit-Gold `#665338` | alternierend | quote | Galerie ja |
| 24 | Kultur-Modern | Klassisch | modern | standard | Tannengruen `#2d5d3f` | alternierend | cards | Galerie ja, Sec-Fakten optional |
| 25 | Kultur-Editorial | Edel | elegant | ausführlich | Bronze `#8b6f47` | alternierend | quote | Galerie ja, FAQ ja |

**Anmerkungen:**
- Tourismus-Klassisch: Stadt-Hotel = Klassisch, Berghütte = Rustikal — pro Recipe vom Auto-Engine entschieden anhand Standort/Beschreibung.
- Agrar-Premium: Wein/Edelbrenner = Edel, Bio-Hof = Rustikal — pro Recipe entschieden anhand Beschreibung.

---

## Section-Reihenfolgen pro Recipe (Abweichungen vom Layout-Default)

Die meisten Recipes folgen dem Layout-Default. Hier nur die Abweichungen, die die **Reihenfolge** ändern:

### Anwalt (Recipe 9 — Dienstleistung-Klassisch)
```
Hero (mit Trust-Bar: RAK Wien, ÖRAK)
  → Leistungen-kompakt (Rechtsgebiete als 6 Items)
  → Über + Team innerhalb (Anwälte mit Bezeichnung)
  → CTA-Block (Erstgespräch kostenlos)
  → Bewertungen-quote (1 Zitat reicht für Trust)
  → FAQ
  → Kontakt mit Form + Notdienst-Banner
  → Footer
```
**Was abweicht vom Layout-default**: CTA-Block VOR Bewertungen, Notdienst-Banner als Branchen-Funktion.

### Restaurant-Editorial (Recipe 7)
```
Hero (Magazine-Display)
  → Leistungen-alternierend mit Speisekarte-Items (Gänge mit Preisen)
  → Über (Story-fokussiert mit Foto)
  → Galerie (groß, viel Foto-Material)
  → Bewertungen-quote (Hauben-Auszeichnung als Source)
  → Kontakt-minimal (Tel + Adresse + Map, KEIN Form)
  → Reservierung-Anfrage als alternativer Form-Block
  → Footer (oft ohne CTA-Block)
```
**Was abweicht**: Galerie früher (Foto-Heavy), kein Standard-Form, branchen-spezifische Reservierung-Anfrage.

### Tischlerei-Werkstatt (Recipe 1)
```
Hero (mit Trust-Bar: Innung, Mitgliedschaften)
  → Leistungen-alternierend (mit Foto pro Leistung)
  → Über + Team innerhalb (Werkstatt-Story)
  → Galerie (Werkstücke mit Tag pro Branche)
  → Bewertungen-cards
  → Kontakt mit Map + Form
  → Footer
```
**Was abweicht**: Standard-Layout, keine Reihenfolge-Anpassung nötig — Theme-Tokens (Rustikal: Burgund, Unna) machen den Werkstatt-Look.

### Praxis (Recipe 8)
```
Hero (mit Trust-Bar: Ärztekammer)
  → Sprechzeiten-Block (eigene Variante in Kontakt-Block, oben)
  → Leistungen-kompakt (Behandlungen als 6 Cards)
  → Über + Team innerhalb (Ärzte mit Spezialisierungen)
  → Bewertungen-quote
  → FAQ
  → Kontakt mit Termin-Form (statt Standard-Form)
  → Footer
```
**Was abweicht**: Sprechzeiten ganz oben, Termin-Form statt Standard-Form.

---

## Datenmodell-Bridge (Backend-Hinweis)

Im `orders`-Datensatz braucht's pro Recipe die Felder, die [`RECIPE-SYSTEM.md` § Datenmodell](../RECIPE-SYSTEM.md) bereits spec'd hat:

```ts
{
  berufsgruppe: 'handwerk' | 'gastro' | ...;
  bezeichnung: string;       // Freitext "Tischlerei", "Anwaltskanzlei", "Ristorante"
  look_variante: 'werkstatt' | 'casual' | 'modern' | 'premium' | ...;
  stil: 'klassisch' | 'modern' | 'elegant' | 'rustikal' | 'custom';
  layout: 'standard' | 'kompakt' | 'ausfuehrlich';
  primary: string;           // Hex
  accent: string;            // Hex
  section_toggles: {         // optional, sonst Default aus Recipe
    trust?: boolean;
    galerie?: boolean;
    team?: boolean;
    bewertungen?: boolean;
    faq?: boolean;
    sec_fakten?: boolean;
    sec_partner?: boolean;
    cta_block?: boolean;
    termin_cta?: boolean;
  };
  bewertungen_variante: 'cards' | 'quote' | 'liste';
  leistungen_variante: 'alternierend' | 'kompakt';
  branchen_funktionen: {
    speisekarte?: boolean;
    reservierung?: boolean;
    termin_anfrage?: boolean;
    notdienst_banner?: boolean;
    sprechzeiten?: boolean;
    buchung?: boolean;
  };
}
```

Auto-Engine (Layer 4) füllt diese Felder aus Berufsgruppe + Bezeichnung + Look-Wahl mit der **Recipe-Konfigurations-Tabelle** als Lookup.

---

## Was NICHT in dieser Tabelle steht (= nicht im MVP)

Aus den ersten Mockup-Studien sind diese **Custom-Sektionen verworfen** worden, da sie nicht aus wenigen Datenfeldern befüllbar sind:

- ❌ Werkstücke-Tabelle mit Maßen × Holzart × Preis (zu viele Pflicht-Felder)
- ❌ Vorher-Nachher-Slider mit Divider-Line (komplexes Foto-Pairing)
- ❌ Material-Strip mit Eigenschaften × Herkunft (zu spezifisch)
- ❌ Generationen-Liste mit Bio + Lebensdaten (Story-Schreiben überfordert KMU)
- ❌ Hero-Sigel mit Curve-Text (Custom-SVG pro Kunden)
- ❌ Honorar-Pricing-Tier-Cards (3 detailbeschriebene Varianten — Anwalts-spezifisch, schwer zu pflegen)

Diese Studien liegen im `public/_archive/` als Referenz, sind aber **nicht produktions-relevant**.

---

## Verbindung zu anderen Dokumenten

- [`themes.md`](themes.md) — Theme-Tokens (Layer 1)
- [`../RECIPE-SYSTEM.md`](../RECIPE-SYSTEM.md) — Recipe-System-Architektur (Layer 1+2+3 + Datenmodell)
- [`../../functions/templates/template.js`](../../functions/templates/template.js) — Beta-Template (Section-Pool)
- [`../../public/mockup-themes-v2.html`](../../public/mockup-themes-v2.html) — Theme-Switcher-Anker
- [`sections/_LIBRARY.md`](sections/_LIBRARY.md) — **Frühe Studie**, jetzt durch diese Konfigurations-Tabelle ersetzt. Die dort dokumentierten "branchen-spezifischen Sektionen" wurden teilweise verworfen (siehe Abschnitt oben).

---

*Living Document. Bei jeder Recipe-Anpassung hier ergänzen.*
