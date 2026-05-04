# Design-Vision-Phase — instantpage.at

> **Living Document.** Sammelt alle Visual-, UX-, Quality- und Differenzierungs-Specs, die fehlen, damit das Live-Produkt premium wirkt — und nicht nur "saubere Next.js-App mit shadcn-Defaults".

**Stand:** 2026-05-04
**Phase:** vor Phase 0 (Code-Setup) im `MIGRATION-PLAN.md`

---

## Warum diese Doku

`MIGRATION-PLAN.md` beschreibt **wie wir technisch sauber neu aufsetzen**.
`RECIPE-SYSTEM.md` beschreibt **welche Architektur die Kundenseiten haben**.
`LIVE-COMPLIANCE.md` beschreibt **was rechtlich nötig ist**.

Was **nirgends** beschrieben ist: **wie das Ergebnis tatsächlich premium wird** — visuell, in der Interaktion, im Qualitätsanspruch, in der Differenzierung gegenüber Wix/Squarespace/Webflow.

Diese Doku schließt die Lücke. Sie wird vor Phase 0 (Code-Setup) abgearbeitet — sonst läuft Phase 1 (Section-Library) ins Blaue.

**Geschätzter Gesamt-Aufwand:** 10-12 Wochen Solo, parallelisierbar mit Pre-Setup-Aktionen aus `MIGRATION-PLAN.md` § 2.

---

## Inhalt

| # | Block | Aufwand | Status |
|---|---|---|---|
| **A** | **Vision & Benchmarks** (Voraussetzung) | ~2 Wochen | `[OFFEN]` |
| 1 | Visuelle Benchmarks | 2-3 Tage | `[OFFEN]` |
| 2 | Kompetitive Tiefen-Analyse | 1 Woche | `[OFFEN]` |
| 3 | AI-Differentiator-Story | 2-3 Tage | `[OFFEN]` |
| **B** | **Design-Foundation Plattform** | ~3-4 Wochen | `[OFFEN]` |
| 4 | Plattform-Design-System | 1 Woche | `[OFFEN]` |
| 5 | Marketing-Site-Konzept | 3-4 Tage | `[OFFEN]` |
| 6 | Portal-Design-Sprache | 1 Woche | `[OFFEN]` |
| 7 | Fragebogen-Magic-Moments | 1 Woche | `[OFFEN]` |
| **C** | **Recipe-System Visual** | ~5-6 Wochen | `[OFFEN]` |
| 8 | 4 Theme-Tokens final | 1 Woche | `[OFFEN]` |
| 9 | 25 Section-Specs | 2 Wochen | `[OFFEN]` |
| 10 | 22 Recipe-Mockups | 4-6 Wochen (parallel) | `[OFFEN]` (2 von 24 da) |
| 11 | Mikro-Interaktionen Kunden-Websites | parallel zu Themes | `[OFFEN]` |
| 12 | Asset-/Photography-Strategie | 3-4 Tage | `[OFFEN]` |
| **D** | **Quality** | ~1 Woche | `[OFFEN]` |
| 13 | Quality-Standards messbar | 2 Tage | `[OFFEN]` |
| 14 | Code-/Test-Quality-Standards | 2-3 Tage | `[OFFEN]` |

---

## Block A — Vision & Benchmarks (Voraussetzung)

### 1. Visuelle Benchmarks

**Was fehlt:** keine systematische Sammlung von Plattform- und Customer-Site-Referenzen.
Memory `project_design_references_live.md` nennt nur cpg.at + Komi (für Customer-Themes).

**Outcome:**
- 15-20 **Plattform-Referenzen** (für instantpage.at selbst): Stripe? Linear? Vercel? Frame? Notion? Anthropic-Brand? Mit klaren Take-aways pro Referenz.
- 30+ **Customer-Site-Referenzen** pro Theme/Berufsgruppe, in Pinterest-Board oder Notion-Gallery
- Pro Referenz: Screenshot + 3 Take-aways + warum relevant

**Quellen:** Awwwards, Site Inspire, Land-book, Mobbin, Lapa Ninja, Httpster, One Page Love

**Format:** `docs/_design/benchmarks-plattform.md` + `docs/_design/benchmarks-recipes.md` (oder externes Pinterest)

---

### 2. Kompetitive Tiefen-Analyse

**Was fehlt:** Memory `project_marketing_skills_eval.md` ist nur Pointer, keine Analyse. Wir wissen nicht systematisch was Webflow/Squarespace/Framer/Wix-AI/Hostinger-AI/Jimdo wirklich besser machen.

**Outcome:** 10 Konkurrenten visuell + funktional auseinandergenommen:
- Onboarding-Flow durchklicken + screenshotten
- Generierte Output-Qualität vergleichen (3 Branchen pro Anbieter)
- Pricing-Page-Strategien
- Mikro-Interaktionen + Wow-Patterns
- Was machen wir BESSER, was MÜSSEN wir matchen

**Format:** `docs/_design/competitive-analysis.md`

---

### 3. AI-Differentiator-Story

**Was fehlt:** Beta-Strategie war "KI nicht erwähnen". Für Live nicht spec'd. Wix-AI / Hostinger-AI machen lautes AI-Marketing — wo positionieren wir uns?

**Outcome:**
- Story-Linie: wie kommunizieren wir die Magie ohne "KI-Builder" zu sagen
- Magic-Moment-Konzept (erste Generierung visuell konzipiert)
- Welche AI-Features sichtbar (Live-Generierung in Bestellseite?), welche unsichtbar (Auto-Engine)
- Verbindung zu `BRAND.md` Voice & Tone

---

## Block B — Design-Foundation Plattform

### 4. Plattform-Design-System

**Was fehlt:** keine konkreten Design-Tokens für instantpage.at selbst. Heute im Prototyp `const T = {...}` in App.js — ad-hoc.

**Outcome:**
- **Tokens:** Farben (Brand + Semantic + Neutral-Skala), Typo-Skala (4-5 Stufen statt 13 wie heute), Spacing-Skala (8-Punkt-Grid), Radien, Schatten, Z-Index, Animation-Easings + Durations
- **Component-Conventions:** shadcn als Basis, eigene Variants definiert
- **Motion-Spec:** Page-Transitions, Stagger-Patterns, Easing-Curves, Reduced-Motion-Verhalten
- **Empty-/Loading-/Error-State-Standards** pro Komponente
- **Information-Density-Entscheidungen:** wo dicht (Tabellen, Admin), wo luftig (Marketing, Onboarding)

**Format:** `docs/_design/design-system.md` + Storybook-Stories später

---

### 5. Marketing-Site-Konzept

**Was fehlt:** wie sieht instantpage.at-Landing aus? Hero, Demo, Pricing, Trust, FAQ, Footer.

**Outcome:**
- Wireframes für Landing + Pricing + Vergleichsseite (vs. Webflow/Wix laut Memory `project_production_refactor.md`)
- Hero-Konzept entschieden (statisch / Live-Demo / Video / interaktiver Mini-Fragebogen)
- Demo-Flow-Konzept
- Testimonial-/Social-Proof-Strategie (wann + wo + welche Form)

**Quellen:** Block A.1 Plattform-Benchmarks

---

### 6. Portal-Design-Sprache

**Was fehlt:** Memory `project_portal_polish_offen.md` listet die Schwächen — keine Lösung dokumentiert.

**Outcome:**
- **Information-Architecture:** Sidebar-Gruppen final (heute schon angefangen, durchdenken)
- **Card-Patterns:** Eine `<PortalCard>`-Komponente standardisiert (heute 3 verschiedene Header-Patterns)
- **Form-Patterns:** kontextuelle Hilfe, Inline-Validation, Save-Indikatoren, Optimistic-Updates
- **Live-Preview-UX im Design-Tab:** wie genau soll das aussehen (Split-View? Modal? Slide-Over?)
- **Mobile-Portal-UX:** heute durchwachsen, für Live spec'n
- **Settings/Konto-Bereich-Design**

**Connection:** baut auf Block 4 Plattform-Design-System

---

### 7. Fragebogen-Magic-Moments

**Was fehlt:** Heute 7 Schritte sequentiell. Funktional, nicht magisch. Wo unterscheiden wir uns von Wix-AI?

**Outcome:**
- UX-Konzept inkl. Animationen zwischen Schritten
- Progress-Visualization (heute reine Textual)
- Live-Preview während Eingabe? Smart-Defaults aus Webrecherche?
- Animation beim Recipe-Match (Berufsgruppe → Look)
- Erfolgs-Erlebnis nach erster Generierung (Konfetti? Sanfter Reveal?)

---

## Block C — Recipe-System Visual

### 8. 4 Theme-Tokens final

**Was fehlt:** `RECIPE-SYSTEM.md` nennt 4 Themes (Klassisch, Modern, Editorial, Handwerklich) nur in Worten. Keine Hex/Spacing/Easing-Werte.

**Outcome pro Theme:** Konkrete Werte für
- Farben (Primary, Accent, Surface, Text, Border — mit Light/Dark wenn relevant)
- Fonts (Heading + Body + Mono falls relevant)
- Spacing-Skala
- Border-Sprache (Hairlines? Solid? Bottom-Only?)
- Foto-Filter (Saturation, Grain, Aspect-Ratios, Crop-Strategien)
- Animation-Charakter (subtle vs. expressive)

**Format:** `docs/_design/themes.md`

---

### 9. 25 Section-Specs

**Was fehlt:** `RECIPE-SYSTEM.md` listet 25 Bausteine als Namen-Liste. Keine Visual-Specs.

**Outcome pro Section:**
- Layout-Varianten (z.B. Hero: text-led / photo-led / split / fullbleed → konkret skizziert)
- States (Empty, Loading, Error, Hover, Active)
- Mikro-Interaktionen (Hover, Reveal, Scroll-Effekt)
- Mobile-Verhalten
- Token-Mapping pro Theme

**Format:** `docs/_design/sections/<name>.md` (25 Files)

---

### 10. 22 Recipe-Mockups

**Was fehlt:** 24 Recipes geplant, nur 2 mockup-fertig (handwerk-werkstatt + gastro-editorial — siehe Memory `project_stile_4_5_design_spec.md`).

**Outcome:** 22 weitere HTML-Mockups oder Figma-Designs:

**Hochpriorisiert:** handwerk-bau, handwerk-modern, handwerk-premium, gastro-wirtshaus, gastro-casual, gesundheit-praxis, dienstleistung-klassisch, dienstleistung-modern, dienstleistung-premium

**Mittelpriorisiert:** bildung-klassisch, bildung-modern, tourismus-klassisch, tourismus-editorial-premium, handel-klassisch, handel-boutique-premium, kosmetik-modern, kosmetik-premium

**Niedrigpriorisiert:** mobilitaet-funktional, agrar-klassisch, agrar-premium, industrie-technisch, kultur-modern, kultur-editorial

**Format:** `public/mockup-recipe-<name>.html` (HTML-Pattern wie heute)

---

### 11. Mikro-Interaktionen Kunden-Websites

**Was fehlt:** Hover-States, Scroll-Reveals, Page-Transitions nicht spec'd.

**Outcome:**
- Hover-Patterns pro Theme (subtle vs. expressive)
- Scroll-Reveal-Patterns (oder bewusst weglassen?)
- Logo-Animationen (Fade? Slide? Statisch?)
- Hero-Parallax — ja/nein pro Theme
- SVG-/Lottie-Einsatz definieren
- Performance-Budget pro Recipe (Lighthouse-Ziel: > 95?)
- Reduced-Motion-Verhalten

**Connection:** parallel zu Block 8 Themes

---

### 12. Asset-/Photography-Strategie

**Was fehlt:** Memory `project_production_refactor.md` nennt Unsplash für Live, aber nicht final entschieden.

**Outcome:**
- Stockfoto-Provider final: Unsplash API vs. Pexels vs. lizenzierte Bibliothek (Adobe, iStock)
- Foto-Kuratierung pro Branche (manuelle Whitelist statt blinder API-Call?)
- Quality-Bar definieren (Mindest-Auflösung, Stil-Konsistenz)
- Eigene Foto-Sessions für Hero-Looks der Top-Recipes? (Budget-Frage)
- Icon-Set: Lucide / Phosphor / Heroicons / eigenes
- Illustration-Style (falls überhaupt — viele KMU-Sites kommen ohne aus)

---

## Block D — Quality

### 13. Quality-Standards messbar

**Was fehlt:** `quality_score` 0-100 existiert im Prototyp, aber Schwellenwerte nicht dokumentiert. "Premium-tauglich" ist Bauchgefühl.

**Outcome:**
- Konkrete Schwellenwerte pro Quality-Check definiert
- Was triggert Re-Generation, was triggert Admin-Review?
- Branchen-spezifische Quality-Profile (Anwalt strenger als Friseur)
- Prompt-Templates strukturiert dokumentiert (aktuell verstreut)
- A/B-Test-Framework für Prompts (Memory `project_production_refactor.md` "Prompt-Versioning")

**Format:** `docs/_design/quality-standards.md`

---

### 14. Code-/Test-Quality-Standards

**Was fehlt:** ESLint-Config, Storybook-Setup, Visual-Regression nicht in `ARCHITECTURE.md`.

**Outcome:**
- ESLint + Prettier-Config explizit (TypeScript strict)
- Storybook-Setup für Section-Library (essenziell für isolierte Entwicklung der 25 Sections)
- Visual-Regression: Percy / Chromatic Entscheidung
- Accessibility-Tests automatisiert (axe-core in Vitest + Playwright)
- Performance-Tests pro Recipe (Lighthouse-CI Budget-Werte konkret)
- WCAG-Level-Entscheidung (AA als Default, AAA für reglementierte Branchen?)

**Connection:** ergänzt `ARCHITECTURE.md` § 10 Security-Hardening + § 7 Deployment-Pipeline

---

## Reihenfolge-Empfehlung

```
Woche  1- 2: Block A im Prototyp-Repo (Benchmarks + Konkurrenz + AI-Story)
                → reine Markdown-Arbeit, kein Code, kein Repo-Setup nötig
Woche      3: ─── Live-Repo `instantpage` anlegen (MIGRATION-PLAN Phase 0) ───
                → Doku-Migration + Memory-System neu + Stack-Skelett
Woche  4- 7: Block B im Live-Repo parallel zu Block 8 (Themes)
                → Plattform-Design-System + Marketing + Portal + Fragebogen
                → gleichzeitig 4 Theme-Tokens final
Woche  5-10: Block 9 + Block 10 parallel im Live-Repo
                → 25 Section-Specs als Vorlage
                → 22 Recipe-Mockups (Skills: ui-ux-pro-max + anthropic-web-frontend-design)
Woche  7- 8: Block 11 + 12 (Mikro-Interaktionen + Assets)
Woche 10-12: Block D (Quality-Standards)
```

**Kritische Abhängigkeiten:**
- Block 4 (Design-System) blockiert Block 6 + 7 + Code-Phase 1
- Block 8 (Themes) blockiert Block 9 (Sections) blockiert Block 10 (Recipes)
- Block A (Benchmarks) sollte vor allen anderen abgeschlossen sein
- Block A bleibt im Prototyp-Repo (reine Markdown), ab Block B alles im Live-Repo (Mockups gehören gleich an den Zielort)

---

## Verbindung zu anderen Dokumenten

- `MIGRATION-PLAN.md` — diese Phase eingehängt zwischen Doku-Phase und Phase 0 (Code-Setup)
- `RECIPE-SYSTEM.md` — wird durch Block 8/9/10 visuell konkretisiert
- `BRAND.md` — wird durch Block 1 + 3 + 4 befüllt
- `PRODUCT.md` — wird durch Block 5 + 7 ergänzt
- `ARCHITECTURE.md` — wird durch Block 14 ergänzt

## Verbindung zu Memory

- `project_design_references_live.md` — Startpunkt für Block 1
- `project_marketing_skills_eval.md` — Startpunkt für Block 2
- `project_stile_4_5_design_spec.md` — 2 von 24 Recipe-Mockups bereits da (Block 10)
- `project_portal_polish_offen.md` — Vorarbeit für Block 6
- `feedback_design_skills.md` — ui-ux-pro-max + anthropic-web-frontend-design Skills für Block 10 nutzen
- `feedback_ux_mockups.md` — HTML-Mockups als bewährtes UX-Format für alle Visual-Blöcke

---

*Living Document. Pflegen während Design-Vision-Phase. Status pro Block aktualisieren wenn abgearbeitet.*
