# Recipe-System v1 — Live-Architektur Kundenwebsites

> **Quelle der Wahrheit für die Kundenwebsite-Architektur im Live-Produkt.** Promoviert aus Memory `project_recipe_system_v1.md` (Final entschieden 2026-04-29).

**Stand:** 2026-05-04

---

## Status

Final entschieden 2026-04-29 in einer durchgehenden Architektur-Diskussion. Ersetzt den "5 Stile + 12 Charakter-Layer"-Ansatz aus früheren Plänen.

Diese Doku ist Grundlage für Phase 1 + 2 des Live-Bau (siehe `MIGRATION-PLAN.md`).

---

## Kern-Idee

**Heute (Prototyp):** 1 Template + 3 Stile als CSS-Klassen. Tischler sieht aus wie Arzt im selben Stil, nur Texte und Farben anders.

**Live:** Branchen-spezifische, kuratiert designte Recipes. Tischler sieht aus wie Tischler-Werkstatt, Restaurant wie Magazin, Arzt wie Praxis. User wählt Berufsgruppe + Look — System komponiert aus Section-Library + Theme das Recipe.

---

## Vision

> "Sag uns wer du bist und was du machst. Wir bauen die Website, die zu deiner Branche passt — automatisch."

Konkurrenz (Webflow/Wix) lässt User aus 200 Templates wählen → überfordert KMU. instantpage.at wählt automatisch passendes Recipe → KMU-tauglich. Output ist branchen-spezifisch und premium-tauglich.

---

## Architektur-Layer

```
Layer 1 — Themes (4)
  Klassisch · Modern · Editorial · Handwerklich
  Pro Theme: Fonts, Farben, Spacing-Skala, Border-Sprache, Foto-Filter,
  Animation-Charakter

Layer 2 — Section-Library (~25 Bausteine)
  Jede Section in mehreren Varianten:
  - Hero: text-led / photo-led / split / asymmetric / fullbleed / with-stamp
  - Leistungen: grid / list / Roman-numbered / accordion / Speisekarte-style
  - Über-uns: split / magazine-2col / with-signature / with-pull-quote
  - Galerie: symmetric-grid / asymmetric-magazine / masonry / lightbox
  - Bewertungen: cards / single-pull-quote / list / dual-column
  - Team: cards-3 / cards-with-photos / single-feature
  - Kontakt: with-form / with-map-form / minimal-info
  - FAQ: hairline-list / accordion / solid-borders
  - Branchen-Funktionen: Reservierung-Form / Termin-Anfrage / Buchung-Anfrage
    / Notdienst-Banner / Speisekarte / Kollektion / Zertifizierungen-Block
    / Universal-Highlight (flexibler Content-Block für Edge-Cases)

Layer 3 — Recipes (~24)
  Pro Berufsgruppe + Look-Variante = 1 Recipe
  Recipe = (Theme + Section-Liste + Section-Props + branchen-spezifische Funktionen)

Layer 4 — Auto-Engine (Lookups + Decisions)
  Berufsgruppe + Look → Recipe (deterministisch)
  Foto-Verfügbarkeit → Hero-Variante
  Content-Menge → Layout-Density
  Daten-Vollständigkeit → Section-Visibility
  Logo → Akzentfarbe-Vorschlag
  Bezeichnung → BRANCHEN-Liste-Match → Default-Leistungen + Stockfotos
  Anrede: Import > Branchen-Default
  Branchen-Features: pro Berufsgruppe vordefiniert

Layer 5 — Portal-Anpassungen (für ~20% der User die was ändern wollen)
  Logo + Fotos hochladen
  Inhalte editieren (pro Section-Tab)
  Design-Tab: Look wechseln, Akzentfarbe, Anrede mit Live-Preview
  Section-Toggles
```

---

## Datenmodell (orders-Tabelle)

| Feld | Typ | Quelle |
|---|---|---|
| `berufsgruppe` | text (1 von 12) | User-Wahl im Fragebogen |
| `berufsbezeichnung` | text Freitext | User-Eingabe — Display auf Website |
| `look` | text (1 von 1–4 pro Berufsgruppe) | User-Wahl im Fragebogen |
| `recipe` | text (auto-derived aus berufsgruppe + look) | System, im Portal überschreibbar |
| `accent_color` | hex | Logo-Extraktion-Vorschlag, User-editierbar |
| `anrede` | text ('sie' / 'du') | Import oder Branchen-Default, Portal-überschreibbar |
| `branche` | text (FALLBACK — alte BRANCHEN-Liste-Lookup) | Aus berufsbezeichnung-Match — nur für Inhalts-Defaults |

**Kann WEGFALLEN** vs heute: `stil` (klassisch/modern/elegant) — wird durch `look` ersetzt.

---

## Onboarding-Flow (Fragebogen)

```
1. Berufsgruppe wählen — 12 Karten
   [Handwerk]  [Gastro]  [Gesundheit]  [Dienstleistung]
   [Bildung]   [Tourismus]  [Handel]  [Mobilität]
   [Agrar]     [Industrie]  [Kosmetik]  [Kultur]

2. Look wählen — 1–4 Karten je nach Berufsgruppe
   Schematische Karten-Darstellung (kein echtes Mockup-Screenshot)
   Beispiel Handwerk:
     Werkstatt rustikal | Modern frisch | Premium edel | Bau klassisch
   Bei Berufsgruppen mit nur 1 Look: Confirmation-Karte
   ("Für deine Branche passt dieser Look")

3. Berufsbezeichnung — Pflicht-Freitext
   "Wie willst du heißen?" z.B. "Tischlerei Steiner — Möbel nach Maß"

4. Akzentfarbe wählen
   5 Vorschläge passend zum gewählten Look + Custom-Picker

5. Firmendaten (Name, Adresse, Telefon)

6. Impressum-Pflichtfelder (Unternehmensform, UID, Firmenbuch, Kammer etc.)
   Branchenabhängig — siehe LIVE-COMPLIANCE.md § 9 Branchen-Pflichtfeld-Matrix

7. Leistungen (Defaults aus Berufsbezeichnung-Match auf BRANCHEN-Liste)

8. Kurzbeschreibung / Über-uns

9. Branchen-Features (per Berufsgruppe vordefiniert)
   - Handwerk: Notdienst, Meisterbetrieb, Kostenvoranschlag, Förderungen
   - Gastro: Gastgarten, Take-away, Lieferservice
   - Gesundheit: Kassenvertrag, Notdienst
   - Tourismus: Frühstück, WLAN, Haustiere
   - Handel: Online-Shop
   - etc.

→ Generierung mit Auto-Decisions
→ Portal: Logo + Fotos hochladen, weitere Anpassungen
```

**Was sich gegenüber heute ändert (Fragebogen):**

- 160-Branchen-Dropdown → 12 Berufsgruppen-Karten
- Stil-Karten (3 abstrakt) → Look-Karten (1–4 branchen-spezifisch)
- Berufsbezeichnung-Pflichtfeld neu
- Hero-Label kommt aus User-Bezeichnung statt HERO_LABELS-Map (134 Einträge können gelöscht werden)
- Sonst identisch (Akzentfarbe, Firmendaten, Impressum, Leistungen, Kurzbeschreibung, Branchen-Features alles wie heute)
- Logo + Fotos bleiben im Portal (wie heute)

---

## Berufsgruppen → Looks → Recipes (Mapping)

| Berufsgruppe | Look-Optionen | Anzahl |
|---|---|---|
| Handwerk | Werkstatt / Bau / Modern / Premium | 4 |
| Gastro | Wirtshaus / Casual / Editorial | 3 |
| Gesundheit | Praxis (1 Look — Confirmation) | 1 |
| Dienstleistung | Klassisch / Modern / Premium | 3 |
| Bildung | Klassisch / Modern | 2 |
| Tourismus | Klassisch / Editorial-Premium | 2 |
| Handel | Klassisch / Boutique-Premium | 2 |
| Mobilität | Funktional (1 Look) | 1 |
| Agrar | Klassisch / Premium | 2 |
| Industrie | Technisch (1 Look) | 1 |
| Kosmetik | Modern / Premium | 2 |
| Kultur | Modern / Editorial | 2 |
| **Total** | | **24 Recipes** |

Recipe-Naming-Pattern: `{berufsgruppe}-{look}` z.B. `handwerk-werkstatt`, `gastro-editorial`, `gesundheit-praxis`.

---

## Theme-Zuordnung pro Look

| Look | Theme |
|---|---|
| Werkstatt (Handwerk) | Handwerklich |
| Bau (Handwerk) | Klassisch |
| Modern (Handwerk) | Modern |
| Premium (Handwerk) | Editorial |
| Wirtshaus (Gastro) | Klassisch (warm) |
| Casual (Gastro) | Modern (warm) |
| Editorial (Gastro) | Editorial |
| Praxis (Gesundheit) | Klassisch (medical) |
| Klassisch (Dienstleistung) | Klassisch |
| Modern (Dienstleistung) | Modern |
| Premium (Dienstleistung) | Editorial |
| Editorial-Premium (Tourismus) | Editorial |
| Boutique-Premium (Handel) | Editorial |
| Funktional (Mobilität) | Klassisch |
| Premium (Agrar) | Editorial (warm) |
| Technisch (Industrie) | Klassisch (technisch) |
| Modern (Kosmetik) | Modern (warm) |
| Premium (Kosmetik) | Editorial |
| Editorial (Kultur) | Editorial |

---

## System-Lookups & Auto-Decisions (vollständig)

### Visuelles

1. **Recipe = (Berufsgruppe, Look)** — deterministisch aus User-Wahl
2. **Theme** — pro Recipe definiert (siehe Tabelle oben)
3. **Hero-Variante** — aus Foto-Verfügbarkeit:
   - Hero-Foto da → photo-led oder fullbleed
   - Logo da, kein Hero-Foto → split mit Logo
   - Nichts da → text-led mit Trust-Bar
4. **Layout-Density** — aus Content-Menge:
   - 3 Leistungen → Grid 3-spaltig
   - 6 Leistungen → Grid 3×2
   - 8+ Leistungen → Accordion
5. **Section-Visibility** — aus gefüllten Daten:
   - Team-Fotos vorhanden → Team-Section sichtbar
   - Galerie-Fotos vorhanden → Galerie-Section
   - Bewertungen vorhanden → Bewertungen-Section
   - Sonst Section weg
6. **Akzentfarbe-Vorschlag** — aus Logo-Hauptfarbe (Kontrast-Check)

### Inhalt

7. **Default-Leistungen** — aus Berufsbezeichnung → BRANCHEN-Liste-Match (interne 160er-Liste bleibt als Wissensbasis)
8. **Stockfotos** — aus Berufsbezeichnung → BRANCHEN-Liste-Match
9. **Hero-Sub-Headline-Vorschlag** — aus Berufsbezeichnung + Ort

### Sprache

10. **Anrede** — Pyramide:
    1. Wenn Website importiert: aus Import-Text erkennen (Claude erkennt Sie/Du)
    2. Sonst: Branchen-Default (Anwalt/Arzt/Steuerberater → Sie. Yoga/Coach/Tattoo → Du. Rest → Sie als sicherer AT-Standard)
    3. Im Portal jederzeit überschreibbar (löst Re-Generation der Texte aus, mit Warnung)

---

## Branchen-Funktionen (in Section-Library)

Phase 1 Live: erweiterte Kontaktformulare statt echter Buchungs-Systeme.

| Funktion | Form-Felder | Aktion |
|---|---|---|
| Reservierung (Restaurant) | Datum, Personen, Uhrzeit, Anlass, Kontakt | Email an Restaurant mit Bestätigen/Ablehnen-Hinweis |
| Termin-Anfrage (Arzt, Anwalt, etc.) | Wunschtermin, **Anliegen kurz**, Kontakt | Email an Praxis/Kanzlei |
| Buchungs-Anfrage (Hotel, Pension) | Anreise, Abreise, Personen, Wünsche | Email an Hotel |
| Notdienst (Handwerk) | Telefon, Adresse, Problem | Direkter Anruf-Button + Email |
| Standard-Kontakt | Name, Email, Nachricht | Email an Betrieb |

### WICHTIG für reglementierte Berufe

**Bei Berufsgruppe Gesundheit + reglementierten Rechtsberatungs-Branchen** muss eine Variante "Termin-Anfrage **ohne Anliegen-Feld**" existieren. Sonst entstehen:

- Bei Heilberufen: Gesundheitsdaten (Art 9 DSGVO besondere Kategorie)
- Bei Rechtsberatung: Mandantengeheimnis (§ 9 RAO / § 37 NO / § 91 WTBG)

→ siehe `LIVE-COMPLIANCE.md` § 10 Reglementierte Berufe — Sonderbehandlung

**Phase 2/3 später:** Echte Buchungs-Tools entweder einbinden (Quandoo, Doctolib, Booking.com) ODER selbst bauen mit Slot-Verwaltung. Heute zu komplex (Datenschutz, Account-Anlage nicht voll automatisierbar).

---

## Portal — Design-Tab

Ein Tab im Portal für alle Design-Anpassungen mit Live-Preview:

```
Design
├── Look wechseln (Karten wie im Fragebogen — alle Looks der Berufsgruppe)
├── Akzentfarbe ändern (Vorschläge passend zum aktuellen Look + Custom)
├── Anrede umstellen (Sie / Du / Locker — löst Re-Generation aus)
└── Section-Toggles (heute schon — bleibt)
```

Live-Preview rechts daneben — User klickt, sieht direkt was sich ändert.

---

## Stress-Tests (10 Risiken durchgegangen)

### Gelöst

1. **Bezeichnung-Match-Qualität** — Bezeichnung beeinflusst nur Inhalts-Defaults (Leistungen, Stockfotos), NICHT Visual. Visual kommt aus User-Wahl (Berufsgruppe + Look). Kein Match-Risiko fürs Visuelle.
2. **Default-Theme-Wahl** — Theme ist Recipe-Eigenschaft, nicht Berufsgruppen-Eigenschaft. Goldschmied wählt "Premium-Look" → bekommt Editorial-Theme.
3. **Berufsgruppe-vs-Bezeichnung-Konflikt** — User wählt Berufsgruppe explizit, Bezeichnung ist nur Display + Inhalts-Lookup. Kein Konflikt möglich.
4. **Stil-Wahl-UX-Inkonsistenz** — bei 1-Look-Berufsgruppen wird Confirmation gezeigt statt 3 leere Karten.
5. **BRANCHEN-Liste-Pflege** — bleibt als interne Wissensbasis, weiter wie heute pflegbar.
6. **Goldschmied vs Erdbau** — beide Handwerk, aber unterschiedliche Looks (Premium vs Bau). User-Wahl differenziert.
7. **Restaurant Editorial vs Wirtshaus** — drei Looks pro Gastro (Wirtshaus/Casual/Editorial) — User-Wahl differenziert.
8. **Section-Library-Skalierung** — 25 Bausteine, einmal exzellent gebaut, alle Recipes profitieren. Bug-Fix = 1 Stelle.
9. **Bundle-Size pro Recipe** — Next.js dynamic imports per Recipe.
10. **Performance / Time-to-First-Site** — Auto-Detections (Logo-Farbe, Anrede, Bezeichnung-Match) parallel zur Text-Generierung. Kein zusätzlicher Latenz-Block.

### Akzeptierte Trade-offs

- **Multi-Standort-Support** = später. 1 Adresse pro Order. Zielgruppe hat selten Filialen.
- **Echte Buchungs-Tools (Slot-Management)** = Phase 2/3. Phase 1 reichen erweiterte Kontaktformulare.
- **Multi-Language** = Phase 2 (Tourismus DE+EN).
- **Multi-Page** = Phase 2 (separate About-Page, Galerie-Page).

---

## Bau-Plan im Live-Repo

→ Verbindliche Phasen-Numerierung und Zeitplanung steht in [`MIGRATION-PLAN.md` § 8](MIGRATION-PLAN.md). Recipe-System-Bauteile dort als Phase 1 (Section-Library + Themes) und Phase 2 (Recipes + Auto-Engine + Fragebogen-Refactor + Portal-Erweiterung).

---

## Offene Implementierungs-Details

1. **Wie genau sehen die schematischen Look-Karten aus?** — Heute "Stil-Vorschau" ist Hero-Ausschnitt. Live: vereinfachte Schematik mit Theme-Colors + Layout-Andeutung. Design-Aufgabe.
2. **Übergang Berufsbezeichnung-Edit im Portal** — wenn User Bezeichnung ändert, soll BRANCHEN-Lookup neu laufen → Default-Leistungen ändern? Mit Warnung? UX-Entscheidung beim Portal-Bau.
3. **Recipe-Override im Portal** — User kann Look wechseln. Was wenn er Look außerhalb seiner Berufsgruppe wählen will (z.B. Tischler will Editorial-Restaurant-Look)? Empfehlung: nur Looks der eigenen Berufsgruppe — sonst Beratungs-Aufgabe.
4. **Performance bei 1000+ Kunden** — Cache-Strategie pro Recipe, CDN-Edge-Caching. Standard-Patterns.

---

## Markt-Positionierung (unverändert)

instantpage.at bedient: österreichische KMU mit echtem Geschäft (Restaurants, Handwerker, Berater, Praxen, Kreative mit Portfolio).

**Bewusst NICHT bedient:**

- Artist-/DJ-/Influencer-Profil-Hubs (Linktree/Komi-Territory)
- Editorial-Magazine mit Custom-Design-Anspruch (Webflow-Territory)
- Enterprise / Konzerne (Custom-Agentur-Territory)

**Why:** Versuch alles zu sein verwässert das Kernprodukt. Bessere Fokussierung verkauft sich besser und hält Wartung beherrschbar.

---

## Kritische Erfolgsfaktoren

1. **Section-Library-Qualität** — wenn die 25 Bausteine nur OK sind, sehen alle Recipes nur OK aus. Investition lohnt sich nur bei Premium-Niveau pro Section.
2. **Theme-Tokens-Konsistenz** — Editorial-Theme muss überall gleich angefasst werden. Token-Drift = Inkonsistenz.
3. **Berufsgruppen-Karten-UX** — User muss sich klar zuordnen können. Beispiele auf Karten ("Handwerk: Tischler, Installateur, ..."). Mit Suche-Funktion ergänzen wenn nötig.
4. **Look-Vorschau-Karten-Qualität** — User entscheidet visuell. Karten müssen echten Eindruck vermitteln, nicht abstrakt sein.

---

## Verbindung zu anderen Dokumenten

- `LIVE-COMPLIANCE.md` — Branchen-Pflichtfeld-Matrix + reglementierte Berufe Sonderbehandlung
- `MIGRATION-PLAN.md` — Bau-Reihenfolge im Live-Repo
- `PRODUCT.md` — Plan-Gating (welche Features pro Plan)
- `BRAND.md` — Theme-Tokens, Voice-Tone

## Verbindung zu Memory

- `project_recipe_system_v1.md` — Original-Memory (kann nach Live-Bau gelöscht werden, da hier promoviert)
- `project_design_references_live.md` — cpg.at + Komi als Editorial-Referenz
- `project_kundenseiten_roadmap_2026-04-17.md` — Kundenseiten-Qualitäts-Items
- `feedback_section_design.md` — Implementierungs-Konventionen

---

*Living Document. Pflegen während Live-Bau. Bei Architektur-Änderungen Memory-Original synchron halten.*
