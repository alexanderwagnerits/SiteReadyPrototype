# Design-Vision-Phase — instantpage.at

> **Living Document.** Sammelt alle Visual-, UX-, Quality- und Differenzierungs-Specs, die fehlen, damit das Live-Produkt premium wirkt — und nicht nur "saubere Next.js-App mit shadcn-Defaults".

**Stand:** 2026-05-14
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
| 1 | Visuelle Benchmarks | 2-3 Tage | `[PLATTFORM-REFS KURATIERT 2026-05-14]` — 16 Refs mit Take-aways + AT-KMU-Kalibrierung; Customer-Refs noch offen |
| 2 | Kompetitive Tiefen-Analyse | 1 Woche | `[SKELETON 2026-05-14]` — 10 Konkurrenten analysiert, Aggregation + Differentiators dokumentiert |
| 3 | AI-Differentiator-Story | 2-3 Tage | `[ENTSCHEIDUNGS-OFFEN 2026-05-14]` — 3 Story-Optionen + AI-Act-Constraint + Magic-Moment-Sub-Frage spec'd |
| **B** | **Design-Foundation Plattform** | ~3-4 Wochen | `[OFFEN]` |
| 4 | Plattform-Design-System | 1 Woche | `[OFFEN]` |
| 5 | Marketing-Site-Konzept | 3-4 Tage | `[OFFEN]` |
| 6 | Portal-Design-Sprache | 1 Woche | `[TEIL-SPEC'D 2026-05-14]` — ausgelagert in `_design/portal-design.md`, 15 Sektionen incl. High-Level |
| 7 | Fragebogen-Magic-Moments | 1 Woche | `[OFFEN]` |
| **C** | **Recipe-System Visual** | ~5-6 Wochen | `[OFFEN]` |
| 8 | 3 Theme-Tokens final | 1 Woche | `[v2 ENTWURF]` (`_design/themes.md`) — 2 Klassisch-Mockups fehlen |
| 9 | 25 Section-Specs | 2 Wochen | `[1 von 25]` (hero.md) |
| 10 | 22 Recipe-Mockups | 4-6 Wochen (parallel) | `[3 von 24]` (anwalt-klassisch + beratung-modern + handwerk-werkstatt) |
| 11 | Mikro-Interaktionen Kunden-Websites | parallel zu Themes | `[SPEC 2026-05-14]` — Theme-Animations-DNA + Hover/Scroll-Reveal/Parallax-Entscheidungen, JS ≤ 80 KB gzip |
| 12 | Asset-/Photography-Strategie | 3-4 Tage | `[SPEC 2026-05-14]` — Unsplash+Pexels, Whitelist-Hybrid, Lucide-Icons, keine Illustrations; Foto-Sessions Budget-offen |
| **D** | **Quality** | ~1 Woche | `[TEIL-SPEC'D]` |
| 13 | Quality-Standards messbar | 2 Tage | `[FERTIG 2026-05-14]` — 10 Sub-Sections, ausgelagert in `_design/quality-standards.md` |
| 14 | Code-/Test-Quality-Standards | 2-3 Tage | `[SPEC 2026-05-14]` — Tool-Stack entschieden (Vitest/Playwright/Chromatic/Storybook/axe/Lighthouse-CI), WCAG-AA-Default |

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

**Format:** [`docs/_design/benchmarks-plattform.md`](_design/benchmarks-plattform.md) — `[KURATIERT 2026-05-14]` 16 Plattform-Refs mit Take-aways + AT-KMU-Kalibrierung. Customer-Site-Referenzen separat in `benchmarks-recipes.md` `[TODO]`.

---

### 2. Kompetitive Tiefen-Analyse

**Was fehlt:** Memory `project_marketing_skills_eval.md` ist nur Pointer, keine Analyse. Wir wissen nicht systematisch was Webflow/Squarespace/Framer/Wix-AI/Hostinger-AI/Jimdo wirklich besser machen.

**Outcome:** 10 Konkurrenten visuell + funktional auseinandergenommen:
- Onboarding-Flow durchklicken + screenshotten
- Generierte Output-Qualität vergleichen (3 Branchen pro Anbieter)
- Pricing-Page-Strategien
- Mikro-Interaktionen + Wow-Patterns
- Was machen wir BESSER, was MÜSSEN wir matchen

**Format:** [`docs/_design/competitive-analysis.md`](_design/competitive-analysis.md) — `[SKELETON 2026-05-14]` 10 Konkurrenten (Wix, Jimdo, IONOS, GoDaddy, Hostinger, Squarespace, WordPress.com, Webflow, Framer, Strikingly) mit Staerken/Schwaechen/AI-Erwaehnung/Pricing/Vibes. Aggregation: Anti-Patterns + 8 Differentiators + Konkurrent-Mapping pro Berufsgruppe.

---

### 3. AI-Differentiator-Story

**Was fehlt:** Beta-Strategie war "KI nicht erwähnen". Für Live nicht spec'd. Wix-AI / Hostinger-AI machen lautes AI-Marketing (siehe `_design/competitive-analysis.md`) — wo positionieren wir uns?

**Outcome:**
- Story-Linie: wie kommunizieren wir die Magie
- Magic-Moment-Konzept (erste Generierung visuell konzipiert)
- Welche AI-Features sichtbar (Live-Generierung in Bestellseite?), welche unsichtbar (Auto-Engine)
- Verbindung zu `BRAND.md` Voice & Tone

#### 3.1 Drei Story-Optionen `[ENTSCHEIDUNGS-OFFEN 2026-05-14]`

| # | Option | Pro | Contra |
|---|---|---|---|
| 1 | **KI komplett unsichtbar** — Beta-Strategie fortsetzen. KI nirgends erwähnt, Marketing-Story = „10 Minuten und fertig" | Brand-konsistent mit AT-Vertrauensprodukt (Memory `feedback_at_vertrauensprodukt.md`). Differentiator zu Wix/GoDaddy/Hostinger maximal. Kunde fragt sich nicht „macht KI Fehler in meinem Text?" | Kunde könnte spaeter enttaeuscht sein wenn er erfaehrt es ist KI (Trust-Risiko bei Bekanntwerden). „Was steckt drin?"-Frage offen. |
| 2 | **KI als Funktion, nicht als Hype** — KI dort erwaehnt wo es Substanz traegt (z.B. „Texte intelligent vorgeschlagen", „passende Fotos automatisch"), aber NICHT als Brand-Anker im Hero | Transparenz ohne Hype. AI-Act-konforme Default-Kennzeichnung wirkt natuerlich. Trust-Risiko niedrig weil ehrlich. | Position zwischen den Stuehlen — nicht so klar wie Option 1 oder 3. Wording-Disziplin noetig (kein Auto-Drift in „KI-Builder"-Sprache). |
| 3 | **KI als sichtbarer Magic-Moment** — Live-Generation im Onboarding-Flow als Wow-Effekt zeigen, aber im Marketing-Hero nicht damit werben | „Show, don't tell" — Kunde erlebt es selbst statt es zu glauben. Conversions-Hebel im Onboarding. | Magic-Moment-UI ist Bau-Aufwand (Stream-Generation, Optimistic-Render). Risiko: Kunde sieht Generation-Glitches in Echtzeit. |

**AI-Act-Constraint (Stichtag 2026-08-02, siehe `LIVE-COMPLIANCE.md` § 13):**
KI-generierte Inhalte muessen gekennzeichnet werden — unabhaengig welche Option gewaehlt. Konkret:
- Generierte Texte (Hero, Leistungen, Ueber-Uns, FAQ): dezenter Hinweis im Portal („Vorschlag der Plattform — bitte pruefen und freigeben") + Footer-Disclosure auf Kunden-Seite optional
- Generierte Bilder (falls Phase 2): IPTC/EXIF-Markierung
- Auto-Engine-Entscheidungen (Recipe-Wahl, Hero-Variante): NICHT kennzeichnungspflichtig (das ist Software-Auto-Engine, nicht KI-Content im AI-Act-Sinn)

**Anwalts-Audit-Punkt (Block A):** AI-Act-Auslegung für Quality-Check + Kunden-Freigabe als Ausschlussgrund pruefen lassen (`LIVE-COMPLIANCE.md` § 13 „Auslegung — Quality-Check + Kunden-Freigabe als Ausschlussgrund").

#### 3.2 Magic-Moment-Konzept (unabhaengige Sub-Frage)

Egal welche Story-Option oben gewaehlt: Wo erlebt der Kunde den ersten „Wow-Moment"?
- **Variante A:** Fragebogen-Letzte-Frage → Site direkt vor Kunden-Augen generiert (Stream-Render)
- **Variante B:** Fragebogen abgeschickt → „Wir bauen Ihre Website..."-Screen 30–60s → fertige Site
- **Variante C:** Kunde wartet pasive auf E-Mail mit Site-Link (heutige Beta-Variante)

Variante A ist Frame-/Beehiiv-Vorbild (Memory `_design/benchmarks-plattform.md`), Variante B ist Wix/Squarespace-Standard, Variante C ist Beta-Status. Entscheidung haengt von Option 1/2/3 oben ab — bei Option 3 zwingend Variante A.

#### 3.3 Verbindung

- `BRAND.md` § 5 Voice & Tone — Story-Wording muss konsistent sein
- `LIVE-COMPLIANCE.md` § 13 — AI-Act-Pflichten
- `_design/competitive-analysis.md` — Konkurrenz-Aggregation Punkt „AI versteckt, Output sichtbar"
- `MARKETING.md` § 2 Channel-Strategie — Marketing-Hero-Wording haengt von Story-Option ab

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

### 6. Portal-Design-Sprache `[TEIL-SPEC'D 2026-05-14]`

**Was fehlt:** Konkrete Specs fuer das Portal-Design. Prototyp hat funktionale Basis, visuell durchwachsen — Quellen: User-Feedback ("strukturell ja, visuell durchwachsen") + Polish-Audit Etappe 1 (28.04.2026, Commit `631c06a`).

**Detail-Spec:** [`docs/_design/portal-design.md`](_design/portal-design.md) — 15 Sektionen.

**Kern-Inhalt:**
- **High-Level** (§§ 2–4 in `portal-design.md`): Sidebar-IA + Visuals, Form-Patterns (kontextuelle Hilfe, Inline-Validation, Hybrid-Save, Optimistic-Updates), Live-Preview-UX (3 Optionen Split-View / Modal / Slide-Over mit Trade-offs)
- **Polish-Specs aus Prototyp-Audit** (§§ 5–10): `<PortalCard>`-Komponente, Padding-Skala 24/28, Button-States, Donut-Progress, Mikro-Animationen, 5-stufige Typo-Skala
- **Mobile + Konto + Empty-States** (§§ 11–14): Hamburger statt Bottom-Tab-Bar, schmale Single-Column-Forms fuer Konto, dezente Empty-States ohne Witz-Versuche
- **Diagnostik-Button** „Etwas funktioniert nicht?" (§ 14) verbunden mit OPERATIONS § 1

**Connection:** baut auf Block 4 Plattform-Design-System; verbunden mit `PRODUCT.md` § 7 (funktionale Tabs), `BRAND.md` § 9 (visuelle Sprache), `_design/quality-standards.md` (Performance/A11y).

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

### 8. 3 Theme-Tokens final

**Was fehlt:** ~~`RECIPE-SYSTEM.md` nennt 4 Themes (Klassisch, Modern, Editorial, Handwerklich) nur in Worten. Keine Hex/Spacing/Easing-Werte.~~

**Status v2 (2026-05-05):** Theme-Architektur reduziert auf **3 Themes** — Klassisch / Edel / Rustikal. Modern wurde in Klassisch integriert (per Recipe-Akzent + Spacing-Override). Editorial → Edel umbenannt (KMU-verstaendlicher), Handwerklich → Rustikal umbenannt + Scope erweitert (Werkstatt + Wirtshaus + Bauernhof + Berghuette).

**Outcome pro Theme:** Konkrete Werte für
- Farben (Primary, Accent, Surface, Text, Border — mit Light/Dark wenn relevant)
- Fonts (Heading + Body + Mono falls relevant)
- Spacing-Skala
- Border-Sprache (Hairlines? Solid? Bottom-Only?)
- Foto-Filter (Saturation, Grain, Aspect-Ratios, Crop-Strategien)
- Animation-Charakter (subtle vs. expressive)

**Format:** [`docs/_design/themes.md`](_design/themes.md) — `[v2 ENTWURF]` 2026-05-05. Tokens komplett, Recipe-Mapping fuer 24 Recipes drin. Klassisch-Mockup fehlt noch (mind. 2 Mockups Anwalt-streng + Coach-luftig zur Spacing-Override-Validierung).

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

### 11. Mikro-Interaktionen Kunden-Websites `[SPEC 2026-05-14]`

**Detail-Spec:** [`docs/_design/customer-microinteractions.md`](_design/customer-microinteractions.md) — 11 Sektionen.

**Kern-Entscheidungen:**
- **Animation-Charakter pro Theme** (Klassisch sachlich / Edel ruhig-editorial / Rustikal warm-physisch) mit konkreten Easings + Durations
- **Hover-Patterns** pro Theme spec'd fuer Cards, Buttons, Navigation, Galerie
- **Scroll-Reveal** ja, aber dezent (12–16 px Slide, 240–320 ms, Stagger 60–80 ms) — Hero/Galerie/Standorte/Footer kein Reveal
- **Logo-Animation:** NEIN (statisch, nur dezenter Hover-Opacity-Wechsel)
- **Hero-Parallax:** Klassisch NEIN, Edel JA-sehr-dezent (≤ 30 px), Rustikal NEIN — Mobile immer NEIN
- **SVG ja, Lottie nein** (Bundle-Size, Komplexitaet)
- **Page-Transitions:** keine (Static-MPA, Browser-Native-Behavior)
- **Reduced-Motion verbindlich** — alle Transform-Animationen deaktiviert, Opacity bleibt
- **Performance-Budget:** JS ≤ 80 KB gzip, CSS ≤ 30 KB gzip, 60 fps — Mikro-Interaktionen primaer CSS-only

**Connection:** baut auf `_design/themes.md` (Easings als Tokens), parallel zu Block 8 Themes.

---

### 12. Asset-/Photography-Strategie `[SPEC 2026-05-14]`

**Detail-Spec:** [`docs/_design/asset-strategy.md`](_design/asset-strategy.md) — 7 Sektionen.

**Entscheidungen:**
- **Stockfoto-Provider:** Unsplash API als Default + Pexels als Fallback (lizenzierte Bibliotheken verworfen, AI-Bilder verboten)
- **Foto-Kuratierung:** Hybrid — manuelle Whitelist (20–30 IDs pro Berufsgruppe, ~5 Tage Inhaber-Aufwand) + API-Fallback bei Erschoepfung
- **Quality-Bar:** ≥ 1920 × 1080 px, sRGB, max 250 KB Hero / 120 KB Card, keine Compositing-Tricks
- **Icon-Set:** Lucide (shadcn-Standard, 1.500+ Icons, MIT-Lizenz)
- **Illustrationen:** Phase 1 nein (KMU-typisch ohne, Generic-Illustrations sind Anti-AI-Generic-Risk)

**Entscheidungs-offen** (Budget-Frage): eigene Foto-Sessions fuer Top-3-Anker-Recipes — 3 Optionen in `asset-strategy.md` § 4.

---

## Block D — Quality

### 13. Quality-Standards messbar `[FERTIG 2026-05-14]`

**Beschluss 2026-05-10:** Solo-Bau ohne externen Designer = strenge messbare Quality-Gates Pflicht. Wird vom `design-reviewer` Subagent enforced.

**Detail-Spec:** [`docs/_design/quality-standards.md`](_design/quality-standards.md) — 10 Sektionen final spec'd (Performance/Accessibility/Visual-Polish/Content-Density/Quality-Score/Branchen-Profile/Pflicht-Checks/Eskalations-Pfad/Review-Cadence/Connections).

**Kern-Schwellen** (Hard-Block-relevant):
- Performance ≥ 85 (Mobile, 4G), Accessibility ≥ 90 (Lighthouse + axe-core)
- WCAG AA als Default, kein AAA-Zwang fuer Recht/Medical (Begruendung in `quality-standards.md` § 2)
- Quality-Score ≥ 70 Default, ≥ 85 fuer Recht/Medical/Bestattung (Branchen-Profile § 6)
- Content-Density: 14 Sections mit Min/Max-Wortzahlen, Hero-H1-leer = Hard-Block (§ 4)
- 7 Pflicht-Checks pro Recipe vor Release (§ 7)

**Neue Sub-Sections gegenueber Entwurf 2026-05-10:**
- § 8 Eskalations-Pfad fuer temporaere Underperformance (Tabelle Performance-/Accessibility-Faelle + Frist + Verantwortlichkeit)
- § 9 Review-Cadence quartalsweise (gekoppelt an `OPERATIONS.md` § 7 Self-Check)
- § 4 Content-Density auf 14 Sections erweitert (vorher 9)

---

### 14. Code-/Test-Quality-Standards `[SPEC 2026-05-14]`

**Was fehlt:** ESLint-Config, Storybook-Setup, Visual-Regression nicht in `ARCHITECTURE.md`.

#### 14.1 Linting + Formatting

**ESLint** (TypeScript strict):
- `typescript-eslint` (strict-Preset)
- `eslint-plugin-react`
- `eslint-plugin-react-hooks`
- `eslint-plugin-jsx-a11y` — Accessibility-Checks im Editor
- `eslint-plugin-import` — Import-Order + Cycle-Detection

**Prettier** als Default-Formatter, ESLint nutzt `eslint-config-prettier` um Konflikte zu vermeiden.

**TypeScript:** `strict: true` + `noUncheckedIndexedAccess: true` + `noImplicitOverride: true`. Keine `any`-Verwendungen — Build-Fail bei `any`-Auftauchen ausserhalb Tests.

**Pre-Commit-Hook:** `lint-staged` mit ESLint + Prettier + Type-Check auf geaenderten Files.

#### 14.2 Testing-Strategie

**Unit-Tests — Vitest** (Memory `project_production_refactor.md` `[ENTSCHIEDEN 2026-05-06]`):
- Test-Files neben Source: `<file>.test.ts` (Standard, Vitest-nativ)
- Zentral nur Integration-Tests in `tests/integration/`

**E2E-Tests — Playwright:**
- 3 kritische Flows als Hard-Block vor jedem Deploy:
  1. Onboarding (Bestellung → Trial-Site live)
  2. Cancellation (Self-Service → Webhook → Mail)
  3. Custom-Domain-Setup (DNS-Eintrag → Verifikation)
- Browser-Coverage: Chromium (Desktop + Mobile), WebKit (Safari), Firefox

**Accessibility-Tests — axe-core:**
- `vitest-axe` fuer Component-Tests in Vitest
- `@axe-core/playwright` fuer E2E-Pages
- Hard-Block: kein WCAG-AA-Violation in CI

#### 14.3 Visual-Regression — Chromatic

**Entscheidung 2026-05-14:** Chromatic (storybook-natives Tool) — `[ENTSCHIEDEN]`

**Begruendung:**
- Storybook ist ohnehin gesetzt (siehe 14.4) → Chromatic ist nahtlos integriert
- Percy ist Browser-basiert, weniger geeignet fuer isolierte Component-Snapshots
- Chromatic Free-Tier (5.000 Snapshots/Mo) reicht fuer Pre-Launch + Erstmonate
- Bei Skalierung Standard-Plan ~$149/Mo (35.000 Snapshots) — vertretbar

**Setup:**
- Snapshot pro Story automatisch bei jedem PR
- Visual-Diff-Review im Chromatic-Dashboard
- Bei Skalierungs-Druck: Selective-Snapshots (nur geaenderte Stories) als Cost-Optimization

#### 14.4 Storybook — Section-Library

**Storybook 8.x mit Vite-Builder** — essenziell fuer isolierte Entwicklung der 25 Sections (DESIGN-VISION Block 9):

- Pro Section eine `.stories.tsx`-Datei mit Variant-Showcases (Empty / Loading / Default / Edge-Cases)
- Pro Theme einen Story-Wrapper (Klassisch / Edel / Rustikal) — visuell verifizierbar
- Storybook auch fuer Marketing-Site- und Portal-Components
- Deploy via Chromatic-CI auf eigene Subdomain (`storybook.instantpage.at` intern, nicht oeffentlich)

#### 14.5 Performance-Tests — Lighthouse-CI

**Lighthouse-CI** in GitHub Actions:
- Pro PR Performance-Check auf 3 Sample-Recipes (Klassisch + Edel + Rustikal)
- Budget-Werte aus DESIGN-VISION § 13.1 (Performance ≥ 85, A11y ≥ 90)
- Hard-Block: Lighthouse-Score < 85 verhindert Deploy

#### 14.6 WCAG-Level-Entscheidung

**WCAG AA als Default fuer Plattform + Kunden-Sites** — `[ENTSCHIEDEN 2026-05-14]`

**AAA NICHT zwingend** auch fuer Recht/Medical:
- AAA ist Web-Standard fuer hoch-sensitive Bereiche (Behoerden, Banken), nicht Pflicht fuer kommerzielles SaaS
- AT-Behindertengleichstellungs-Gesetz (BGStG) verlangt „angemessene Vorkehrungen" — AA ist marktueblich
- Bei Recht/Medical: AA-konform plus erhoehte Content-Density-Schwellen (DESIGN-VISION § 13.6)
- Bei Anwalts-Briefing (Block A) klaeren ob spezifische Branchen-Vorschriften AAA verlangen — Default bleibt AA

**Wenn AAA spaeter doch notwendig:** punktuell pro Section, nicht als globaler Standard.

#### 14.7 CI/CD-Pipeline-Gates

Reihenfolge pro PR (Hard-Blocks):

1. Type-Check (`tsc --noEmit`)
2. Lint (ESLint + Prettier)
3. Unit-Tests (Vitest) — Coverage ≥ 70 %
4. Build (Next.js)
5. Storybook-Build + Chromatic-Snapshot-Diff
6. E2E-Tests (Playwright auf Vercel-Preview)
7. Lighthouse-CI auf 3 Sample-Recipes
8. axe-core-Scan auf Marketing-Pages + Sample-Recipe

Geplante CI-Laufzeit: ≤ 8 Min ohne Cache, ≤ 4 Min mit Cache.

#### 14.8 Connection

- `ARCHITECTURE.md` § 7 Deployment-Pipeline — wird durch 14.7 ergaenzt
- `ARCHITECTURE.md` § 10 Security-Hardening — wird durch 14.1/14.2 ergaenzt
- DESIGN-VISION § 13.1 Performance + 13.2 Accessibility — Schwellen fuer 14.5 + axe-Scans

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
