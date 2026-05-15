# Live-Bau-Backlog — Recipes auf Beta-Template

> **Stand:** 2026-05-15
> **Zweck:** Konsolidierte Inkremente fuer den Live-Bau. Alle 32 Recipes (siehe [`recipe-konfiguration.md`](recipe-konfiguration.md)) rendern grundsaetzlich auf dem Beta-Template ohne neue Sektionen. Hier steht **nur was zusaetzlich gebaut werden muss**.
>
> **Disziplin:** Statt 32 separate Recipe-Detail-Specs (~6.000 Zeilen Doppel-Doku zu pflegen) — ein konsolidiertes File. Detail-Specs nur fuer Compliance-strikte oder funktions-einzigartige Recipes (siehe Abschnitt 3).

---

## 1. Berufsgruppen-uebergreifende Inkremente

### 1.1 Form-Varianten (Live-Bau-Komponenten)

| Variante | Aktiv bei Berufsgruppe | Aenderung gegenueber Beta-Standard | Quelle |
|---|---|---|---|
| `termin-no-anliegen` | Gesundheit + reglementierte Rechtsberatung | Form OHNE Anliegen-Textfeld — nur Name/Tel/Mail/Wunschtermin/Zeitfenster | LIVE-COMPLIANCE § 10.3 (Art 9 DSGVO / Mandantengeheimnis) |
| `buchung` | Tourismus (Hotel/Pension/Berghuette/Apartments) | Form mit Anreise/Abreise/Personen-Feldern, evtl. Booking-Engine-Embed | recipe-konfiguration § Tourismus |
| `reservierung` | Gastro | Form mit Datum/Personen/Wunsch-Tisch | recipe-konfiguration § Gastro |
| `default` | alle anderen | Beta-Standard-Form (Name/Tel/Mail/Anliegen) | Beta-Template |

### 1.2 Kontakt-Block-Varianten

| Variante | Aktiv bei | Aenderung |
|---|---|---|
| `sprechzeiten-first` | Gesundheit | Sprechzeiten-Liste als erster sichtbarer Eintrag (vor Map) |
| `oeffnungszeiten-prominent` | Gastro / Tourismus / Handel | Oeffnungszeiten + Ruhetag prominent in Kontakt-Header |
| `default` | alle anderen | Beta-Standard-Kontakt (Adresse/Tel/Mail/Oeffnungszeiten + Map + Form) |

### 1.3 Branchen-spezifische KI-Prompt-Regeln

Bei Berufsgruppen mit Werbeverbot (LIVE-COMPLIANCE § 10.1) wird der KI-System-Prompt um defensive Regeln (§ 10.2) + Verbots-Wording-Liste erweitert. Speicherort im Live-Bau: `src/lib/generate/prompts/branchen-compliance.ts`.

| Berufsgruppe | Quelle Werberecht | Verbots-Wording-Liste |
|---|---|---|
| Gesundheit | AeG § 53 / ZAeG § 35 / MTD-G / HebG / HMG / TAerzteG | recipe-konfiguration § Gesundheit |
| Recht & Finanz | RAO § 12 / NO § 5 / WTBG § 70 | recipe-konfiguration § Recht & Finanz |
| Architektur | ZTG § 30 | (zu definieren beim Recipe-Bau #15/#16) |
| Apotheke (Handel-Sub) | ApoG § 8a / AMG | (zu definieren beim Recipe-Bau Sub-Bezeichnung) |
| alle anderen | — | n/a (Standard-Prompt) |

### 1.4 Quality-Score-Schwelle pro Berufsgruppe

| Berufsgruppe | Schwelle | Verhalten |
|---|---|---|
| Gesundheit | ≥ 85 | Bei < 85 Auto-Re-Gen, bei < 70 Admin-Alarm |
| Recht & Finanz | ≥ 85 | dito |
| alle anderen | ≥ 70 (Default) | wie heute (PRODUCT.md § 3.4) |

### 1.5 Disclaimer-Modal im Onboarding

Aktiv bei Berufsgruppe Gesundheit + Recht & Finanz. **Pflicht vor Vertragsabschluss.** Wording aus LIVE-COMPLIANCE § 10.4.

### 1.6 Impressum-Pflichtfelder pro Branche

`BRANCHE_PFLICHT`-Map in `functions/s/[subdomain]/legal.js` erweitern auf ~35 reglementierte Branchen. Quelle: LIVE-COMPLIANCE § 9 Branchen-Pflichtfeld-Matrix. **Recherche-Aufwand:** ~17 Std Eigenarbeit (oder via parallel-Subagents in 1 Sitzung vor Live).

### 1.7 Recipe-Defaults als TypeScript-Maps

Aus `recipe-konfiguration.md` § Branchen-Inhalts-Defaults exportieren — Speicherort `src/lib/recipes/defaults.ts`:

- `RECIPE_TRUST_PILLS` — pro Berufsgruppe-Look 2-3 Default-Pills
- `RECIPE_LEISTUNGEN_THEMEN` — 6 Default-Themen pro Berufsgruppe (KI-Prompt-Seed, nicht fixe Texte)
- `RECIPE_FAQ_THEMEN` — 5 Default-Themen
- `RECIPE_ABLAUF_STEPS` — 4 Default-Steps (wo Layout `ausfuehrlich`)
- `RECIPE_AKZENTFARBEN` — Hex-Code pro Recipe (User kann pro Kunde ueberschreiben)
- `RECIPE_STIL_KLASSE` — `.stil-klassisch` / `.stil-modern` / `.stil-elegant` pro Recipe
- `RECIPE_LAYOUT` — `standard` / `kompakt` / `ausfuehrlich` pro Recipe
- `RECIPE_BRANCHEN_FUNKTIONEN` — Flag-Map pro Recipe (`speisekarte`, `reservierung`, `buchung`, `termin_anfrage_no_anliegen`, `sprechzeiten`, `notdienst_banner`)

---

## 2. Recipe-spezifische Inkremente (kompakt)

Die meisten Recipes brauchen **kein eigenes Inkrement** — Beta-Template + Recipe-Defaults-Maps + ggf. Branchen-Funktions-Flag reichen. Hier nur Recipes mit nicht-trivialem Live-Bau-Aufwand:

| # | Recipe | Inkrement (ueber 1.1-1.7 hinaus) |
|---|---|---|
| 4 | Bau-Klassisch | Konzessions-Trust-Pill-Validierung (Baumeister konzessioniert?) |
| 6/7/8 | Gastro alle | `speisekarte`-Funktion = Leistungen-Section-Variante mit Preis-Spalte (Beta-Vocabulary-Erweiterung) |
| 8 | Gastro-Editorial | LMSVG-Allergen-Kennzeichnung-Hinweis im Portal (Onboarding-Tipp) |
| 9 | Gesundheit-Praxis | siehe Detail-Spec [`recipes/gesundheit-praxis.md`](recipes/gesundheit-praxis.md) |
| 10 | Gesundheit-Therapie | dieselben Compliance-Patterns wie #9, aber `.bew-grid` (Cards) erlaubt da Therapeut-Patient-Beziehung weniger sensibel als Hausarzt |
| 11 | Recht-Klassisch | siehe Detail-Spec [`recipes/anwalt-klassisch.md`](recipes/anwalt-klassisch.md) — Honorar-Transparenz-Section + Notfall-Hotline-Box |
| 13 | Beratung-Modern | siehe Detail-Spec [`recipes/beratung-modern.md`](recipes/beratung-modern.md) — Color-only-Hero ohne Foto |
| 20 | Bildung-Fahrschule (Sub) | Fahrschulgesetz pruefen ob reglementiert (Werbe-Beschraenkung?) |
| 21/22/23 | Tourismus alle | `buchung`-Funktion = Form-Variante mit Anreise/Abreise/Personen + optional Booking-Engine-Embed |
| 24-Sub | Apotheke (Handel-Sub) | **Compliance-strikt** wie Gesundheit — eigene Recipe-Auspraegung pruefen oder Sub-Bezeichnung mit Compliance-Flag |
| 30 | Agrar-Editorial-Wein | Heuriger-Konzession + Weinetiketten-Pflichtangaben (Onboarding-Tipp) |
| 32/33 | Industrie | ISO-Zertifikate als Trust-Pill-Validierung (Optional-Field im Onboarding) |
| 38/39 | Sport & Wellness | bei Wellness-Sub: Heilmasseur (HMG) Sonderbehandlung wie Gesundheit |

Fuer alle hier nicht gelisteten Recipes (~20): **keine Inkremente noetig** ueber 1.1-1.7 hinaus. Sie rendern auf Beta-Template + Recipe-Defaults.

---

## 3. Detail-Specs — Wann lohnen sie sich

**Detail-Spec** (eigenes File in `recipes/`) sinnvoll wenn:
- Recipe ist **Compliance-strikt** (eigenes Werberecht, Disclaimer-Pflicht)
- Recipe fuehrt **einzigartige Branchen-Funktion** ein (speisekarte, buchung, termin-no-anliegen)
- **Mockup-HTML** wird gebaut (Phase 1 Anker oder spaetere Erweiterung)
- Recipe hat **eigene Section-Reihenfolge** die signifikant von Beta-Default abweicht

**Nur Backlog-Zeile** reicht wenn:
- Recipe ist „Look-Variation" eines bestehenden Patterns (z.B. #2 Handwerk-Modern als Indigo-Variante von #1)
- Compliance ist Standard / WKO-Mitgliedschaft

**Vorhandene Detail-Specs:**

| File | Recipe | Grund |
|---|---|---|
| [`recipes/handwerk-werkstatt.md`](recipes/handwerk-werkstatt.md) | #1 | Anker-Recipe Phase 1 + Mockup |
| [`recipes/beratung-modern.md`](recipes/beratung-modern.md) | #13 | Anker-Recipe Phase 1 + Mockup + Color-only-Hero-Pattern |
| [`recipes/anwalt-klassisch.md`](recipes/anwalt-klassisch.md) | #11 | Anker-Recipe Phase 1 + Compliance-strikt (RAO) + Mockup |
| [`recipes/gesundheit-praxis.md`](recipes/gesundheit-praxis.md) | #9 | Compliance-strikt (Aerztegesetz) + `termin-no-anliegen`-Pattern-Anchor |

**Folge-Kandidaten** (in Reihenfolge der Wichtigkeit):

1. **Gastro-Editorial #8** — Hauben-Niveau + speisekarte-Funktion + LMSVG-Compliance (einzigartige Branchen-Funktion)
2. **Tourismus-Stadt-Hotel #21** — buchung-Funktion + Tourismusabgabe (einzigartige Branchen-Funktion)
3. **Apotheke-Sub (Handel #24)** — Compliance-strikt (ApoG + AMG)
4. **Gesundheit-Therapie #10** — Compliance-Nuance vs. Praxis (Cards erlaubt, andere FAQ-Themen)

**Nicht weiter Detail-Specs schreiben fuer:** alle anderen 24 Recipes — der Backlog oben + recipe-konfiguration.md + Defaults-Maps reichen.

---

## 4. Phase-1-Anker-Mockups (HTML, bestehend)

- [`public/mockup-recipe-handwerk-werkstatt.html`](../../public/mockup-recipe-handwerk-werkstatt.html) — Tischlerei Pichler (#1)
- [`public/mockup-recipe-beratung-modern.html`](../../public/mockup-recipe-beratung-modern.html) — Karner Strategie (#13)
- [`public/mockup-recipe-anwalt-klassisch.html`](../../public/mockup-recipe-anwalt-klassisch.html) — Lechner Rechtsanwaelte (#11)

Naechste Mockup-Erweiterung sinnvoll: Gastro-Editorial (#8) oder Gesundheit-Praxis (#9 — Spec liegt vor, nur Mockup fehlt).

---

## 5. Verbindung zu anderen Dokumenten

- [`recipe-konfiguration.md`](recipe-konfiguration.md) — Recipe-Master-Tabelle + Branchen-Inhalts-Defaults pro Berufsgruppe
- [`sections/_BETA-VOCABULARY.md`](sections/_BETA-VOCABULARY.md) — alle Section-CSS-Klassen mit HTML-Snippets
- [`sections/hero.md`](sections/hero.md) — Hero-Section-Detail-Spec
- [`themes.md`](themes.md) — Theme-Tokens (`[VERWORFEN 2026-05-11]`, nicht als Referenz)
- [`../LIVE-COMPLIANCE.md`](../LIVE-COMPLIANCE.md) § 9 Branchen-Pflichtfeld-Matrix + § 10 Reglementierte Berufe
- [`../ARCHITECTURE.md`](../ARCHITECTURE.md) § 1.3 KI-Modell-Strategie + § 5.1 Repo-Tree (Live-Bau-Speicherorte)
- [`../MIGRATION-PLAN.md`](../MIGRATION-PLAN.md) — Live-Bau Phasen
- [`../../functions/templates/template.js`](../../functions/templates/template.js) — Beta-Live-Template (Quelle der Wahrheit)

---

*Living Document. Bei neuem Recipe-Detail-Spec hier den Eintrag in Abschnitt 3 ergaenzen. Bei berufsgruppen-uebergreifender Aenderung Abschnitt 1 anpassen.*
