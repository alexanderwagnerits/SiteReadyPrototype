# Recipe-Konfiguration — 14 Berufsgruppen × 2-3 Looks

> **⚠️ STATUS 2026-05-12 (aktualisiert nach Mockup-Validierung):**
>
> **Was wirklich verworfen wurde** (v2-Themes-Entscheidung 2026-05-11, siehe `themes.md`):
> - Stil-Klasse `.stil-rustikal` — existiert nicht in Beta-Template. Rustikal-Look wird mit `.stil-klassisch` + warmer Akzentfarbe gebaut.
> - „Theme"-Spalte (Klassisch/Edel/Rustikal als v2-Theme-Familien) — konzeptionell ueberholt, bleibt als Look-Familie-Hint stehen bis Phase-2-Cleanup
> - Eigene Polish-Patterns pro Theme (Italic-Em, Stempel, Photo-Frame, Magazine-Heads) — verworfen
>
> **Was GUELTIG bleibt** (in Mockup-Bauphase 2026-05-11/12 bestaetigt):
> - Drei Beta-Stil-Klassen `.stil-klassisch` / `.stil-modern` / `.stil-elegant`
> - Spalte „Leistungen": alternierend `.leist-list` (mit Foto pro Item) **und** kompakt `.leist-more` (3-Card-Grid) — Beta hat beide produktiv
> - Spalte „Bewertungen": cards `.bew-grid` / quote `.bew-quote` / liste `.bew-list` — alle drei in Beta vorhanden
> - Section-Reihenfolgen pro Recipe (unten dokumentiert)
> - Berufsgruppen-Routing
>
> **`[TBD 2026-05-12]` Zeilen:** Recipes #6, #22, #29, #31 hatten `.stil-rustikal` — neue Stil-Klasse + Akzentfarbe wird bei jeweiligem Recipe-Bau entschieden. Recipe #1 ist gebaut (siehe Referenz-Mockup-Sub-Tabelle unten).
>
> **Phase-2-Cleanup (nach Section-Specs):** Theme-Spalte entfernen, alle Recipes auf Beta-Klassen-Vokabular ausrichten.
> **Recipe-Detail-Specs vorhanden:** [`recipes/handwerk-werkstatt.md`](recipes/handwerk-werkstatt.md) (Tischler-Pichler, Beta-Stil-basiert).

> **Quelle der Wahrheit für Live-Bau Layer 3 (Recipes).** Jedes Recipe = Beta-Template-Stil + Layout + Section-Reihenfolge + Section-Toggles + Branchen-Funktionen. **Keine neuen Sektionen erfunden** — nur Komposition aus bestehenden Beta-Bausteinen.

**Stand:** 2026-05-12
**Basis:** [`functions/templates/template.js`](../../functions/templates/template.js) (Beta-Template, produktiv)
**Section-CSS-Vokabular:** [`sections/_BETA-VOCABULARY.md`](sections/_BETA-VOCABULARY.md) — verbindliche Klassen-Referenz fuer alle Recipes
**Theme-Tokens:** ~~[`themes.md`](themes.md) (v2-Themes Klassisch/Edel/Rustikal)~~ **VERWORFEN 2026-05-11** — Beta-Stil-Klassen sind die einzige Linie
**Konsolidierungs-Logik:** 14 Berufsgruppen × 2-3 Looks = ~32 Recipes. **Look-Namen sind generisch** (visuelle Konzepte, nicht Sub-Branchen). Auto-Engine entscheidet anhand Bezeichnung, welches Theme/Akzentfarbe innerhalb des Looks rauskommt.

---

## Beta-Template-Werkzeugkiste

### Stile (CSS-Klasse am `<body>`)
- `.stil-klassisch` — Merriweather Serif, Navy/Indigo (Default für klassische Dienstleister)
- `.stil-modern` — Space Grotesk Sans, Pill-Buttons, Blur-Blobs (Default für moderne Coaches/Studios)
- `.stil-elegant` — Cormorant Garamond, leichte Weights, Border-Cards (Default für Premium)
- `.stil-rustikal` — Unna Serif, Burgund + Warmgold, Noise-Filter (Default für Werkstatt/Wirtshaus)
- `.stil-custom` — User-definierte Farben + Font

### Layouts (Datenfeld `o.layout`)
- **standard** — Hero, Leistungen, Über, Galerie, Bewertungen, Kontakt
- **kompakt** — Hero, Leistungen-kompakt (3-Spalten), Über, Kontakt — kein Ablauf, kürzere Texte
- **ausführlich** — wie standard + FAQ + Fakten + CTA-Block + vertikaler Ablauf

### Section-Pool

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
| Kontakt-Minimal | `.kontakt` ohne Form (nur Info + Map) | Wenn keine Anfragen erwünscht |
| CTA-Block | `.cta-block` (Color-BG, Closing-Section) | Layout=ausführlich Default |
| Termin-CTA | `.termin-cta` (Buchungslink-Block) | Branchen mit Online-Termin |
| Sec-Fakten | `.sec-fakten` (Stats-Block) | Layout=ausführlich Default |
| Sec-Partner | `.sec-partner` (Logo-Strip) | Wenn Partner/Mitgliedschaften vorhanden |
| Footer | `<footer>` 4-spaltig | Pflicht |

### Branchen-Funktionen

Diese sind **keine eigenen Sektionen**, sondern Felder/Komponenten innerhalb bestehender Sektionen:

- **Speisekarte** (Gastro) — Items innerhalb Leistungen mit Preis-Spalte
- **Reservierung-Anfrage** (Gastro) — Form-Variante mit Datum + Personen-Anzahl
- **Termin-Anfrage** (Praxis, Coach, Therapie) — Form-Variante mit Wunschtermin-Picker
- **Notdienst-Banner** (Anwalt, Praxis-Notdienst) — Kleine rote Box im Kontakt
- **Buchungs-Anfrage** (Hotel) — Form mit Anreise + Abreise + Personen
- **Sprechzeiten-Block** (Praxis) — Wochentage-Liste in Kontakt
- **Universal-Highlight** (alle) — flexibler Content-Block für Edge-Cases

---

## Aktuelle Referenz-Mockups (gebaut 2026-05-11/12)

Drei Recipes wurden als Mockups gebaut + validieren die Beta-Klassen-Linie als kanonische Recipe-Architektur. Diese Werte ueberschreiben die Haupt-Tabelle unten fuer die jeweilige Zeile bis Phase-2-Cleanup.

| Recipe-Zeile | Mockup-File | Berufsgruppe | Stil-Klasse | Akzentfarbe | Layout | Leistungen | Bewertungen | Galerie | Hero-Foto |
|---|---|---|---|---|---|---|---|---|---|
| **#1 Handwerk-Werkstatt** | [`public/mockup-recipe-handwerk-werkstatt.html`](../../public/mockup-recipe-handwerk-werkstatt.html) | Handwerk (Tischler-Pichler) | `.stil-modern` | Bronze `#926f39` | standard | alternierend `.leist-list` (4 items) | cards `.bew-grid` (3) | ja | ja |
| **#13 Beratung-Modern** | [`public/mockup-recipe-beratung-modern.html`](../../public/mockup-recipe-beratung-modern.html) | Beratung (Karner-Strategie) | `.stil-klassisch` | Tannengrün `#2d5d3f` | standard | kompakt `.leist-more` (6 cards)* | — | nein | nein (Color-Hero) |
| **#12 Recht-Finanz Premium** | [`public/mockup-recipe-anwalt-klassisch.html`](../../public/mockup-recipe-anwalt-klassisch.html) | Recht & Finanz (Lechner-Rechtsanwälte) | `.stil-elegant` | Mahagoni `#7a553e` | standard | kompakt `.leist-more` (6 cards) | quote `.bew-quote` (1) | nein | nein (Color-Hero) |

\* Beratung-Mockup nutzt aktuell `.sr-leist-grid` als Custom-Klasse — sollte auf Beta-`.leist-more` normalisiert werden bei naechster Mockup-Iteration (Architektur-Leak aus 2026-05-11, siehe Critique).

**Erkenntnisse aus diesen drei Mockups (orthogonal validiert):**
- Drei Stil-Klassen sind voll funktional und visuell unterscheidbar
- Section-Auswahl variiert branchen-logisch (Material-Branchen = Galerie + Bewertungen-Cards, Text-Branchen = Quote, kein-Galerie)
- Akzentfarbe + Stil-Klasse + Section-Auswahl = ausreichende Differenzierung (keine eigenen Polish-Patterns noetig)
- Beta-`.hero-split-img` fuer Material-Branchen Default empfohlen (Tischler-Verbesserungspunkt aus Critique)
- Anwalt-Mockup ist saubere Beta-Pure-Klassen-Referenz (`.leist-more`, `.faq-list`, `.ablauf-steps`, `.bew-quote`)

---

## Recipe-Konfigurations-Tabelle (14 Berufsgruppen × ~32 Recipes)

| # | Berufsgruppe | Look | Theme | Stil-Klasse | Layout | Akzentfarbe | Leistungen | Bewertungen |
|---|---|---|---|---|---|---|---|---|
| 1 | **Handwerk** | Werkstatt | ~~Rustikal~~ → siehe Referenz-Mockup | `.stil-modern` | standard | Bronze `#926f39` | alternierend | cards |
| 2 | Handwerk | Modern | Klassisch | `.stil-modern` | standard | Indigo `#6366f1` | alternierend | cards |
| 3 | Handwerk | Premium | Edel | `.stil-elegant` | standard | Old-Gold `#a87b3f` | alternierend | quote |
| 4 | **Bau & Sanierung** | Klassisch | Klassisch | `.stil-klassisch` | standard | Navy `#0f2b5b` | alternierend | cards |
| 5 | Bau & Sanierung | Premium | Edel | `.stil-elegant` | standard | Anthrazit `#292524` | alternierend | quote |
| 6 | **Gastro** | Wirtshaus | `[TBD 2026-05-12]` | `[TBD]` (vermutl. `.stil-klassisch` + warmer Akzent) | standard | Burgund `#7a3528` | alternierend | quote |
| 7 | Gastro | Casual | Klassisch | `.stil-klassisch` | kompakt | Terra `#c87356` | kompakt | cards |
| 8 | Gastro | Editorial | Edel | `.stil-elegant` | ausführlich | Petrol `#5b9bb3` | alternierend | quote |
| 9 | **Gesundheit** | Praxis | Klassisch | `.stil-klassisch` | kompakt | Medical-Blue `#0e7490` | kompakt | quote |
| 10 | Gesundheit | Therapie | Klassisch | `.stil-klassisch` | standard | Warm-Sage `#7d9b76` | alternierend | cards |
| 11 | **Recht & Finanz** | Klassisch | Klassisch | `.stil-klassisch` | kompakt | Navy `#0f2b5b` | kompakt | quote |
| 12 | Recht & Finanz | Premium | Edel | `.stil-elegant` | ausführlich | Anthrazit `#292524` | alternierend | quote |
| 13 | **Beratung & Coaching** | Modern | Klassisch | `.stil-modern` | standard | Tannengrün `#2d5d3f` | alternierend | cards |
| 14 | Beratung & Coaching | Premium | Edel | `.stil-elegant` | ausführlich | Anthrazit-Gold `#665338` | alternierend | quote |
| 15 | **Architektur & Planung** | Klassisch | Klassisch | `.stil-klassisch` | standard | Anthrazit `#292524` | alternierend | quote |
| 16 | Architektur & Planung | Editorial | Edel | `.stil-elegant` | ausführlich | Anthrazit `#1a1a1a` | alternierend | quote |
| 17 | **IT & Digital** | Modern | Klassisch | `.stil-modern` | standard | Indigo `#6366f1` | alternierend | cards |
| 18 | IT & Digital | Premium | Edel | `.stil-elegant` | ausführlich | Petrol `#0e6b85` | alternierend | quote |
| 19 | **Bildung** | Klassisch | Klassisch | `.stil-klassisch` | standard | Navy `#0f2b5b` | alternierend | cards |
| 20 | Bildung | Modern | Klassisch | `.stil-modern` | standard | Tannengrün `#2d5d3f` | alternierend | cards |
| 21 | **Tourismus** | Klassisch | Klassisch | `.stil-klassisch` | ausführlich | Petrol `#5b9bb3` | alternierend | quote |
| 22 | Tourismus | Rustikal | `[TBD 2026-05-12]` | `[TBD]` (vermutl. `.stil-klassisch` + Old-Gold) | ausführlich | Old-Gold `#a08456` | alternierend | quote |
| 23 | Tourismus | Editorial-Premium | Edel | `.stil-elegant` | ausführlich | Old-Gold `#a87b3f` | alternierend | quote |
| 24 | **Handel** | Klassisch | Klassisch | `.stil-klassisch` | standard | Navy `#0f2b5b` | alternierend | cards |
| 25 | Handel | Boutique-Premium | Edel | `.stil-elegant` | standard | Old-Gold `#a87b3f` | alternierend | quote |
| 26 | **Mobilität** | Funktional | Klassisch | `.stil-klassisch` | kompakt | Navy `#0f2b5b` | kompakt | liste |
| 27 | Mobilität | Werkstatt | Klassisch | `.stil-klassisch` | standard | Stahlblau `#3b5d7a` | alternierend | cards |
| 28 | Mobilität | Showroom | Edel | `.stil-elegant` | standard | Anthrazit `#1a1a1a` | alternierend | quote |
| 29 | **Agrar** | Klassisch | `[TBD 2026-05-12]` | `[TBD]` (vermutl. `.stil-klassisch` + Tannengrün) | standard | Tannengrün `#3a4f2c` | alternierend | quote |
| 30 | Agrar | Editorial-Premium | Edel | `.stil-elegant` | standard | Anthrazit-Gold `#665338` | alternierend | quote |
| 31 | Agrar | Erlebnis-Premium | `[TBD 2026-05-12]` | `[TBD]` (vermutl. `.stil-elegant` oder `.stil-klassisch` + Burgund) | standard | Burgund `#7a3528` | alternierend | cards |
| 32 | **Industrie** | Technisch | Klassisch | `.stil-klassisch` | standard | Navy `#0f2b5b` | alternierend | liste |
| 33 | Industrie | Tech-Modern | Klassisch | `.stil-modern` | standard | Petrol `#0e6b85` | alternierend | cards |
| 34 | **Kosmetik** | Modern | Klassisch | `.stil-modern` | standard | Korallenrot `#e76e7e` | alternierend | cards |
| 35 | Kosmetik | Premium | Edel | `.stil-elegant` | standard | Anthrazit-Gold `#665338` | alternierend | quote |
| 36 | **Kultur** | Modern | Klassisch | `.stil-modern` | standard | Tannengrün `#2d5d3f` | alternierend | cards |
| 37 | Kultur | Editorial | Edel | `.stil-elegant` | ausführlich | Bronze `#8b6f47` | alternierend | quote |
| 38 | **Sport & Wellness** | Studio | Klassisch | `.stil-modern` | standard | Tannengrün `#2d5d3f` | alternierend | cards |
| 39 | Sport & Wellness | Premium | Edel | `.stil-elegant` | ausführlich | Anthrazit `#292524` | alternierend | quote |

**Total: 14 Berufsgruppen × ~2-3 Looks = 39 Recipe-Zeilen** (≈32 visuell unterscheidbare Outcomes — Sub-Varianten zählen als eigene Zeilen wenn Auto-Engine zwischen Themes wechselt).

---

## Sub-Varianten — Auto-Engine entscheidet anhand Bezeichnung

Bei manchen Looks wechselt das **Theme + Akzentfarbe** je nach Sub-Branche. Look-Namen bleiben generisch ("Klassisch", "Editorial-Premium" etc.); Auto-Engine löst auf basierend auf `o.bezeichnung` + ggf. PLZ.

| Recipe | Look | Sub-Variante | `look_variante` | Effektives Theme + Akzentfarbe | Auto-Engine-Trigger (Bezeichnung enthält) |
|---|---|---|---|---|---|
| 21 | Tourismus-Klassisch | Stadt-Hotel | `tourismus-stadt` | Klassisch + Petrol `#5b9bb3` | Hotel, City, Stadthotel, Pension + Stadt-PLZ (Wien/Graz/Salzburg/Innsbruck/Linz) |
| 22 | Tourismus-Rustikal | Berghütte | `tourismus-berg` | Rustikal + Old-Gold `#a08456` | Hütte, Almhütte, Berghof, Berggasthaus, Schutzhaus, Alm + ländliche PLZ |
| 30 | Agrar-Editorial-Premium | Wein/Edelbrenner | `agrar-wein` | Edel + Anthrazit-Gold `#665338` | Weingut, Winzer, Edelbrennerei, Brennerei, Destillerie, Wein |
| 31 | Agrar-Erlebnis-Premium | Bio-Hof Premium | `agrar-biohof` | Rustikal + Burgund `#7a3528` | Bio-Hof, Hofladen, Bauernhof, Biohof, Demeter |
| 10 | Gesundheit-Therapie | Tierarzt | `gesundheit-tier` | Klassisch + Warm-Sage `#7d9b76` | Tierarzt, Veterinär, Tierklinik, Tierheilpraktiker |
| 10 | Gesundheit-Therapie | Physio/Massage | `gesundheit-physio` | Klassisch + Warm-Sage `#7d9b76` | Physio, Massage, Osteopathie, Heilpraktiker, Therapie |
| 13 | Beratung-Modern | Strategy/Berater | `beratung-strategie` | Klassisch-Modern + Tannengrün | Beratung, Berater, Consulting, Strategie, Coach |
| 13 | Beratung-Modern | Trainer/Mentor | `beratung-trainer` | Klassisch-Modern + Tannengrün (heller) | Trainer, Mentor, Speaker, Workshop |
| 27 | Mobilität-Werkstatt | KFZ | `mobil-kfz` | Klassisch + Stahlblau | KFZ, Werkstatt, Reifen, Service |
| 28 | Mobilität-Showroom | Autohaus | `mobil-autohaus` | Edel + Anthrazit | Autohaus, Auto, Verkauf, Vertrieb (Auto/KFZ-Kontext) |

**Fallback:** Bei mehrdeutigen Triggern wählt Auto-Engine die jeweils erste Variante. User kann im Portal überschreiben (Stil-Wechsel serve-time, kein Re-Gen nötig).

---

## Berufsgruppen-Routing (Bezeichnung → Berufsgruppe)

Welche Bezeichnung gehört zu welcher Berufsgruppe? Wichtig für Auto-Engine + Onboarding-UX (User tippt Bezeichnung und kriegt Berufsgruppe-Vorschlag).

| Berufsgruppe | Typische Bezeichnungen |
|---|---|
| Handwerk | Tischler, Schreiner, Schmied, Schlosser, Schneider, Elektriker, Installateur, Solartechnik, Smart-Home, Goldschmied, Buchbinder, Restaurator, Polsterer, Glaser, Maler, Bodenleger |
| Bau & Sanierung | Baumeister, Maurer, Dachdecker, Sanierung, Trockenbau, Bauunternehmen, Hochbau, Tiefbau, Stuckateur, Fliesenleger |
| Gastro | Restaurant, Wirtshaus, Beisl, Heuriger, Café, Pizzeria, Bistro, Bar, Lokal, Hauben-Restaurant, Catering, Imbiss |
| Gesundheit | Hausarzt, Zahnarzt, Allgemeinmediziner, Praxis, Klinik, Tierarzt, Physiotherapie, Massage, Osteopathie, Heilpraktiker, Logopäde, Therapie |
| Recht & Finanz | Anwalt, Rechtsanwalt, Notar, Steuerberater, Wirtschaftsprüfer, Versicherungsmakler, Versicherung, Vermögensberater, Finanzberater |
| Beratung & Coaching | Unternehmensberater, Berater, Coach, Mentor, Trainer, Speaker, Strategieberatung, Consulting, Workshop |
| Architektur & Planung | Architekt, Architektur, Innenarchitekt, Ingenieurbüro, Statik, Vermessung, Tragwerksplanung, Bauplanung |
| IT & Digital | IT-Dienstleister, Webdesign, Webagentur, Software-Entwickler, Marketingagentur, Online-Agentur, Programmierer, Studio (Digital) |
| Bildung | Schule, Akademie, Kurszentrum, Sprachschule, Volksschule, Privat-Schule, Online-Kurse, Lernzentrum, Nachhilfe |
| Tourismus | Hotel, Pension, Stadthotel, Boutique-Hotel, Berghütte, Almhütte, Berghof, Schutzhaus, Frühstückspension, Apartments, Ferienwohnung |
| Handel | Buchhandel, Fachgeschäft, Apotheke, Modegeschäft, Boutique, Schmuckgeschäft, Optiker, Floristik, Spezialitäten-Laden |
| Mobilität | Spedition, Taxi, Logistik, KFZ-Werkstatt, Autohaus, Reifenhandel, Karosserie, Auto-Verkauf, Fahrschule |
| Agrar | Bauernhof, Landwirtschaft, Hofladen, Bio-Hof, Imker, Imkerei, Käserei, Weingut, Winzer, Edelbrennerei, Destillerie, Demeter, Forstbetrieb |
| Industrie | Maschinenbau, Industrie, Fertigung, Produktion, B2B-Hersteller, Anlagenbau, Zulieferer, Werkzeugbau |
| Kosmetik | Friseur, Friseursalon, Nageldesign, Kosmetikstudio, Beauty-Studio, Wimpernverlängerung, Permanent Make-up |
| Kultur | Galerie, Museum, Theater, Atelier, Künstler, Fotograf, Filmemacher, Designer, Musiker, Kultureinrichtung |
| Sport & Wellness | Yoga-Studio, Fitness-Studio, Personal Trainer, Wellness, Spa, Sportverein, Pilates, CrossFit, Reitstall, Tennisclub |

**Auto-Engine-Logik im Onboarding:**
1. User tippt Bezeichnung als Freitext.
2. Engine schlägt Berufsgruppe vor (1-2 Vorschläge).
3. User bestätigt oder wählt anders.
4. Engine schlägt Look vor (basierend auf Bezeichnung-Sub-Trigger).
5. User bestätigt oder wechselt — alle Looks der Berufsgruppe als Karten sichtbar.

---

## Section-Reihenfolgen pro Recipe (Abweichungen vom Layout-Default)

Die meisten Recipes folgen dem Layout-Default. Hier nur die Abweichungen mit besonderer Reihenfolge oder Branchen-Funktion.

### Recht & Finanz — Klassisch (Recipe 11)
```
Hero (Trust-Bar: RAK Wien, ÖRAK, Kammer)
  → Leistungen-kompakt (Rechtsgebiete als 6 Items)
  → Über + Team innerhalb (mit Bezeichnung Dr./Mag.)
  → CTA-Block (Erstgespräch kostenlos)
  → Bewertungen-quote
  → FAQ
  → Kontakt mit Form + Notdienst-Banner
  → Footer
```
**Abweicht**: CTA-Block VOR Bewertungen, Notdienst-Banner als Branchen-Funktion.

### Beratung-Modern (Recipe 13)
```
Hero (mit Trust-Bar: Mitgliedschaften, Zertifikate)
  → Über (Berater-Story + Methodik, früh!)
  → Leistungen-alternierend (Beratungs-Pakete)
  → Ablauf-Steps (Kennenlernen → Diagnose → Workshop → Begleitung)
  → Bewertungen-cards (Kunden-Zitate)
  → Sec-Fakten (z.B. Kunden, Branchen, Jahre)
  → CTA-Block (Erstgespräch)
  → Kontakt mit Form
  → Footer
```
**Abweicht**: Über sehr früh (Berater-Person trägt Recipe — direkter Bezug zum Beta-Tester-Feedback "Berater fand keine passende Kategorie"), Ablauf-Steps prominent, Sec-Fakten + CTA-Block als Konversions-Verstärker.

### Architektur — Editorial (Recipe 16)
```
Hero (Magazine-Display, Editorial-Foto Projekt)
  → Galerie (Projekte als Hauptattraktion, früh!)
  → Über (Architektur-Philosophie, Editorial)
  → Leistungen-alternierend (Leistungsphasen mit Foto)
  → Bewertungen-quote
  → Sec-Fakten (Projekte, Auszeichnungen)
  → FAQ (Honorar, Phasen, Zeitrahmen)
  → Kontakt-Standard mit Form + Map
  → Footer
```
**Abweicht**: Galerie sehr früh (Projekt-Portfolio trägt Architekt-Recipe), Editorial-Sprache.

### Gastro — Editorial (Recipe 8)
```
Hero (Magazine-Display)
  → Leistungen-alternierend mit Speisekarte-Items
  → Über (Story-fokussiert)
  → Galerie (Foto-Heavy)
  → Bewertungen-quote (Hauben, Falstaff)
  → Kontakt-minimal (kein Form)
  → Reservierung-Anfrage als alternativer Form-Block
  → Footer
```
**Abweicht**: Galerie früh, kein Standard-Form, branchen-spezifische Reservierung.

### Handwerk — Werkstatt (Recipe 1)
```
Hero (Trust-Bar: Innung, Mitgliedschaften)
  → Leistungen-alternierend (mit Foto pro Leistung)
  → Über + Team innerhalb (Werkstatt-Story)
  → Galerie (Werkstücke)
  → Bewertungen-cards
  → Kontakt mit Form + Map
  → Footer
```
**Abweicht**: Standard-Layout, Theme-Tokens (Rustikal-Burgund-Unna) machen den Werkstatt-Look.

### Gesundheit — Praxis (Recipe 9)
```
Hero (Trust-Bar: Ärztekammer)
  → Sprechzeiten-Block (in Kontakt-Block, oben prominent)
  → Leistungen-kompakt (Behandlungen als 6 Cards)
  → Über + Team innerhalb (Ärzte mit Spezialisierungen)
  → Bewertungen-quote
  → FAQ
  → Kontakt mit Termin-Form + Sprechzeiten
  → Footer
```
**Abweicht**: Sprechzeiten ganz oben, Termin-Form statt Standard.

### Gesundheit — Therapie (Recipe 10)
```
Hero (warm-rustikale Foto-Sprache, Bezugnehmer "Wir behandeln dich")
  → Über (Therapeut-Person + Methode)
  → Leistungen-alternierend (Behandlungen mit Foto)
  → Galerie (Praxis-Räume warm-einladend)
  → Bewertungen-cards (Patient-Stimmen)
  → FAQ (Erstbehandlung, Kosten, Dauer)
  → Kontakt mit Termin-Form + Sprechzeiten + Map
  → Footer
```
**Abweicht**: Layout=standard (statt kompakt-Praxis), Bewertungen-cards (Community-Vielfalt), Foto-Sprache wärmer.

### Tourismus — Stadt-Hotel (Recipe 21, Sub `tourismus-stadt`)
```
Hero (Sterne-Klassifikation, Tourismusverband)
  → Leistungen-alternierend (Zimmer-Kategorien als Items mit Foto + Preis-Hinweis)
  → Sec-Fakten (Zimmer-Anzahl, Frühstück-Bewertung, Zentrums-Distanz)
  → Über (Haus-Story + Lage)
  → Galerie (Zimmer + Lobby + Umgebung)
  → Bewertungen-quote (Booking/HolidayCheck-Score)
  → FAQ (Check-in, Parkplatz, Haustiere, Frühstück)
  → Kontakt mit Buchungs-Anfrage + Map
  → Footer
```
**Abweicht**: Sec-Fakten früh für Konversions-Trust, Buchungs-Anfrage statt Standard-Form, FAQ Default an, Bewertungen-quote weil Booking-Score Single-Source.

### Tourismus — Berghütte (Recipe 22, Sub `tourismus-berg`)
```
Hero (großes Berg-Foto, Alpenverein-Trust)
  → Über (Hütten-Geschichte + Höhenmeter + Bewirtschaftungs-Saison)
  → Leistungen-alternierend (Übernachtung / Speisen / Touren)
  → Sec-Fakten (Höhenmeter, Schlafplätze, Saison-Monate)
  → Galerie (Hütte + Aussicht + Wege)
  → Bewertungen-quote
  → FAQ (Reservierung, Schlafsack, Saison)
  → Kontakt mit Buchungs-Anfrage + Tel-prominent
  → Footer
```
**Abweicht**: Über vor Leistungen (Hütten-Story trägt), Tel im Kontakt prominenter als Form, Saison-Hinweise in Sec-Fakten Pflicht.

### Mobilität — Werkstatt (Recipe 27, Sub `mobil-kfz`)
```
Hero (Trust-Bar: Marken-Zertifikate, Innungs-Logo)
  → Leistungen-alternierend (Service / Reparatur / §57a / Reifen)
  → Über + Team (Mechaniker, Werkstatt-Foto)
  → Galerie (optional, Werkstatt-Bilder)
  → Bewertungen-cards
  → Kontakt mit Termin-Form (Wunschtermin) + Map + Notdienst-Tel
  → Footer
```
**Abweicht**: Termin-Form Pflicht, Notdienst-Tel im Kontakt.

### Agrar — Klassisch (Recipe 29)
```
Hero (Foto-Heavy Hof + Trust-Bar: Bio-Austria/AMA-Gütesiegel)
  → Leistungen-alternierend (Hofladen / Lieferdienst / Selbstbedienung / Kurse)
  → Über (Familie + Hof-Geschichte)
  → Galerie (Tiere + Felder + Hofladen)
  → Bewertungen-cards
  → Kontakt mit Hofladen-Öffnungszeiten + Form + Map
  → Footer
```
**Abweicht**: Layout=standard, Hofladen-Öffnungszeiten prominent.

### Agrar — Editorial-Premium (Recipe 30, Sub `agrar-wein`)
```
Hero (Magazine-Display, Editorial-Foto Reben/Fässer + Trust-Bar: DAC, Falstaff)
  → Über (Generationen-/Lagen-Story)
  → Leistungen-alternierend (Sortiment Linien/Cuvées ohne Preis)
  → Galerie (Lagen + Keller + Verkostungsraum)
  → Bewertungen-quote (Falstaff/Vinaria-Punktung)
  → Sec-Fakten (Hektar, gegründet, Sorten-Anzahl)
  → FAQ (Verkostung, Versand, Heuriger)
  → Kontakt-Standard mit Map + Form
  → Footer
```
**Abweicht**: Über sehr früh (Editorial-Story trägt Premium), Sec-Fakten spät, kein Termin-CTA-Block.

### Agrar — Erlebnis-Premium (Recipe 31, Sub `agrar-biohof`)
```
Hero (Foto-Heavy Hof/Tiere + Trust-Bar: Bio-Austria/Demeter-Logo)
  → Leistungen-alternierend (Hofladen / SB / Lieferung / Erlebnis)
  → Über (Familie + Werte + Tier-/Boden-Praxis)
  → Galerie (Tiere + Felder + Hofladen)
  → Sec-Fakten (Hektar, Tiere, Bio-Zertifizierung)
  → Bewertungen-cards
  → Kontakt mit Hofladen-Öffnungszeiten + Form + Map
  → Footer
```
**Abweicht**: Bewertungen-cards (Community-Vielfalt statt Single-Quote), Hofladen-Öffnungszeiten prominent.

### Sport & Wellness — Studio (Recipe 38)
```
Hero (große Action-Foto, Trust-Bar: Verband/Zertifikate)
  → Leistungen-alternierend (Kurse / Personal Training / Mitgliedschaft)
  → Über + Team (Trainer)
  → Sec-Fakten (Kurse pro Woche, Mitglieder, Jahre)
  → Galerie (Studio + Action)
  → Bewertungen-cards
  → CTA-Block (Probetraining)
  → FAQ (Mitgliedschaft, Kündigung, Probetraining)
  → Kontakt mit Termin-Form + Map
  → Footer
```
**Abweicht**: Sec-Fakten als Konversions-Verstärker, CTA-Block für Probetraining.

---

## Datenmodell-Bridge (Backend-Hinweis)

Im `orders`-Datensatz braucht's pro Recipe diese Felder:

```ts
{
  berufsgruppe:
    | 'handwerk' | 'bau' | 'gastro' | 'gesundheit'
    | 'recht-finanz' | 'beratung' | 'architektur' | 'it-digital'
    | 'bildung' | 'tourismus' | 'handel' | 'mobilitaet'
    | 'agrar' | 'industrie' | 'kosmetik' | 'kultur'
    | 'sport-wellness';

  bezeichnung: string;       // Freitext "Tischlerei", "Anwaltskanzlei", "Almhütte"

  look:
    | 'werkstatt' | 'modern' | 'premium' | 'klassisch'
    | 'wirtshaus' | 'casual' | 'editorial' | 'praxis' | 'therapie'
    | 'editorial-premium' | 'erlebnis-premium' | 'rustikal'
    | 'boutique-premium' | 'funktional' | 'showroom'
    | 'technisch' | 'tech-modern' | 'studio';

  // Sub-Variante für Edge-Cases — Auto-Engine setzt, User kann überschreiben
  look_variante:
    | 'tourismus-stadt' | 'tourismus-berg'
    | 'agrar-wein' | 'agrar-biohof'
    | 'gesundheit-tier' | 'gesundheit-physio'
    | 'beratung-strategie' | 'beratung-trainer'
    | 'mobil-kfz' | 'mobil-autohaus'
    | string | null;

  stil: 'klassisch' | 'modern' | 'elegant' | 'rustikal' | 'custom';
  layout: 'standard' | 'kompakt' | 'ausfuehrlich';
  primary: string;           // Hex
  accent: string;            // Hex

  section_toggles: {
    trust?: boolean;
    galerie?: boolean;
    team?: boolean;
    bewertungen?: boolean;
    faq?: boolean;
    sec_fakten?: boolean;
    sec_partner?: boolean;
    cta_block?: boolean;
    termin_cta?: boolean;
    sprechzeiten?: boolean;
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

Auto-Engine (Layer 4) füllt diese Felder aus `berufsgruppe + bezeichnung + look` mit der **Recipe-Konfigurations-Tabelle** als Lookup.

---

## Was NICHT in dieser Tabelle steht (= nicht im MVP)

Aus den ersten Mockup-Studien sind diese **Custom-Sektionen verworfen** worden:

- ❌ Werkstücke-Tabelle mit Maßen × Holzart × Preis
- ❌ Vorher-Nachher-Slider mit Divider-Line
- ❌ Material-Strip mit Eigenschaften × Herkunft
- ❌ Generationen-Liste mit Bio + Lebensdaten
- ❌ Hero-Sigel mit Curve-Text (Custom-SVG)
- ❌ Honorar-Pricing-Tier-Cards

Diese liegen in `public/_archive/` als Referenz, sind **nicht produktions-relevant**.

---

## Geplant für Phase 2 / Post-Launch

| Feature | Trigger | Aufwand |
|---|---|---|
| **Bestattung als 15. Berufsgruppe** | echter Beta-Tester aus Branche fragt | ~30 Min Recipe-Spec + 2 Looks (Klassisch/Modern) |
| **Agrar 4. Look "Gourmet-Manufaktur"** | Käserei/Edelmanufaktur-Anfrage | analoger zur Editorial-Premium-Logik |

---

## Verbindung zu anderen Dokumenten

- [`themes.md`](themes.md) — Theme-Tokens (Layer 1)
- [`../RECIPE-SYSTEM.md`](../RECIPE-SYSTEM.md) — Recipe-System-Architektur (Layer 1+2+3 + Datenmodell)
- [`../../functions/templates/template.js`](../../functions/templates/template.js) — Beta-Template (Section-Pool)
- [`../../public/mockup-themes-v2.html`](../../public/mockup-themes-v2.html) — Theme-Switcher-Anker
- [`../../public/mockup-recipe-edge-cases.html`](../../public/mockup-recipe-edge-cases.html) — Edge-Cases-Übersicht
- [`references/`](references/) — Kuratierte Top-Referenzen pro Berufsgruppe (Layer 0 für Design-Skills)
- [`sections/_LIBRARY.md`](sections/_LIBRARY.md) — Frühe Studie, durch diese Konfigurations-Tabelle ersetzt.

---

*Living Document. Bei jeder Recipe-Anpassung hier ergänzen.*
