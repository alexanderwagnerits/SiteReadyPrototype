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
| 3 | AI-Differentiator-Story | 2-3 Tage | `[OFFEN]` |
| **B** | **Design-Foundation Plattform** | ~3-4 Wochen | `[OFFEN]` |
| 4 | Plattform-Design-System | 1 Woche | `[OFFEN]` |
| 5 | Marketing-Site-Konzept | 3-4 Tage | `[OFFEN]` |
| 6 | Portal-Design-Sprache | 1 Woche | `[TEIL-SPEC'D]` — § 6.1–6.6 konkret, High-Level offen |
| 7 | Fragebogen-Magic-Moments | 1 Woche | `[OFFEN]` |
| **C** | **Recipe-System Visual** | ~5-6 Wochen | `[OFFEN]` |
| 8 | 3 Theme-Tokens final | 1 Woche | `[v2 ENTWURF]` (`_design/themes.md`) — 2 Klassisch-Mockups fehlen |
| 9 | 25 Section-Specs | 2 Wochen | `[1 von 25]` (hero.md) |
| 10 | 22 Recipe-Mockups | 4-6 Wochen (parallel) | `[3 von 24]` (anwalt-klassisch + beratung-modern + handwerk-werkstatt) |
| 11 | Mikro-Interaktionen Kunden-Websites | parallel zu Themes | `[OFFEN]` |
| 12 | Asset-/Photography-Strategie | 3-4 Tage | `[OFFEN]` |
| **D** | **Quality** | ~1 Woche | `[TEIL-SPEC'D]` |
| 13 | Quality-Standards messbar | 2 Tage | `[ENTWURF 2026-05-10]` — 7 Sub-Sections detailliert |
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

**Was fehlt:** Konkrete Specs fuer das Portal-Design. Prototyp hat funktionale Basis, visuell durchwachsen — Quellen: User-Feedback ("strukturell ja, visuell durchwachsen") + Polish-Audit Etappe 1 (28.04.2026, Commit `631c06a`).

**Outcome — High-Level:**
- **Information-Architecture:** Sidebar-Gruppen final (im Prototyp schon strukturiert, im Live ueberpruefen)
- **Form-Patterns:** kontextuelle Hilfe, Inline-Validation, Save-Indikatoren, Optimistic-Updates
- **Live-Preview-UX im Design-Tab:** wie genau soll das aussehen (Split-View? Modal? Slide-Over?)
- **Mobile-Portal-UX:** im Prototyp durchwachsen, fuer Live spec'n
- **Settings/Konto-Bereich-Design**

**Outcome — Polish-Specs (aus Prototyp-Audit, fuer Live-Bau bindend):**

#### 6.1 Standard-Card-Komponente `<PortalCard>`

Im Prototyp existieren ~3 verschiedene Header-Patterns (SectionHeader mit Border-Bottom, ad-hoc inline, Sub-Card-Patterns). Im Live-Bau **eine** Komponente:

```tsx
<PortalCard
  title="Grunddaten"
  sub="Firmenname und Kurzbeschreibung erscheinen oben auf Ihrer Website"
  action={<Button>Hinzufuegen</Button>}
>
  {children}
</PortalCard>
```

Alle Form-Sections, Upload-Sections, Listen-Sections nutzen diese Komponente.

#### 6.2 Card-Padding-Skala

**Im Live: einheitlich 24/28** (statt im Prototyp 20/24 fuer Upload-Cards vs. 24/28 fuer Form-Cards). 24px horizontal, 28px vertikal. Bringt visuelle Ruhe.

#### 6.3 Button Hover/Active-States

Alle interaktiven Elemente bekommen Feedback (im Prototyp viele Buttons funktional ohne Hover):

| Button-Typ | Hover | Active | Transition |
|---|---|---|---|
| Primary | `transform: translateY(-1px)` + `box-shadow: 0 4px 12px rgba(0,0,0,.08)` | `translateY(0)` | 150ms ease-out |
| Secondary | `background-color` 4 % dunkler | `background-color` 8 % dunkler | 150ms ease-out |
| Icon (×, Ersetzen, Hochladen) | `opacity: 1` (Default 0.7) + `background: rgba(0,0,0,.04)` | `background: rgba(0,0,0,.08)` | 120ms ease-out |
| Destructive | `background-color` 6 % dunkler + `box-shadow: 0 0 0 3px rgba(red,.1)` | wie Hover ohne Shadow | 150ms |

#### 6.4 Progress-Visualisierung Einrichtungsassistent

Prototyp: reine Liste mit ✓/●. Live: **Mini-Donut „X/Y Pflicht"** prominent oben + Liste darunter. SVG-Donut, animierter Stroke-Dasharray bei Aenderung (300ms ease).

#### 6.5 Mikro-Animationen

| Trigger | Animation | Timing |
|---|---|---|
| Tab-Wechsel (Sidebar-Klick → Tab-Inhalt) | Fade-in + 4px Slide-up | 200ms ease-out |
| Card-Insert (neue Leistung/Bewertung/Galerie-Item) | Slide-down + Fade-in, max-height 0 → auto | 220ms ease-out |
| Toast erscheinen | Slide-up von unten + Fade-in | 180ms ease-out (enter), 250ms ease-in (exit nach 3s) |
| Save-Indikator | Pulse-Animation auf Save-Icon (scale 1 → 1.1 → 1) | 400ms ease-in-out |
| Stil-Wechsel im Design-Tab | Cross-fade zwischen Preview-iframes | 300ms ease |

Alle anderen Default-Transitions: 150ms ease-out (Standard fuer Hover, Color, Background).

#### 6.6 Typographie-Skala

Prototyp nutzt 12+ Stufen (0.65/0.68/0.72/0.74/0.78/0.8/0.82/0.85/0.88/0.9/0.92/.95/1rem). Live: **5 Stufen** mit klarer Hierarchie:

| Token | Wert | Use |
|---|---|---|
| `text-xs` | 0.75rem (12px) | Meta, Captions, Badges |
| `text-sm` | 0.875rem (14px) | Sub-Texte, Form-Hints |
| `text-base` | 1rem (16px) | Body, Form-Inputs |
| `text-lg` | 1.125rem (18px) | Card-Titles, Section-Sub-Heads |
| `text-xl` | 1.375rem (22px) | Section-Heads |

(Headlines `text-2xl` 1.75rem und groesser bleiben dem Marketing-Site vorbehalten — Block 5.)

**Connection:** baut auf Block 4 Plattform-Design-System.

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

### 13. Quality-Standards messbar `[ENTWURF 2026-05-10]`

**Beschluss 2026-05-10:** Solo-Bau ohne externen Designer = strenge messbare Quality-Gates Pflicht. Wird vom `design-reviewer` Subagent enforced.

#### 13.1 Performance (Lighthouse Mobile)

| Metrik | Mindest | Ziel | Messmethode |
|---|---|---|---|
| Performance-Score | ≥ 85 | ≥ 90 | Lighthouse-CI (real-mobile-throttle, 4G) |
| FCP (First Contentful Paint) | < 2.0s | < 1.8s | Lighthouse |
| LCP (Largest Contentful Paint) | < 3.0s | < 2.5s | Lighthouse |
| CLS (Cumulative Layout Shift) | < 0.15 | < 0.1 | Lighthouse |
| TBT (Total Blocking Time) | < 250ms | < 200ms | Lighthouse |
| Accessibility-Score | ≥ 90 | ≥ 95 | Lighthouse |
| Best Practices | ≥ 95 | 100 | Lighthouse |
| SEO | ≥ 95 | 100 | Lighthouse |

**Hard-Block:** Recipes mit Performance < 85 oder Accessibility < 90 dürfen nicht produktiv geschaltet werden.

#### 13.2 Accessibility (WCAG AA)

| Bereich | Regel |
|---|---|
| Color-Contrast | Body-Text ≥ 4.5:1, Large-Text (≥ 24px) ≥ 3.0:1 |
| Touch-Targets | Mobile ≥ 44px × 44px (interaktive Elemente) |
| Heading-Hierarchie | Strikt: H1 → H2 → H3 (kein H1 → H3 ohne H2) |
| ARIA | Icon-only-Buttons brauchen `aria-label`. Form-Inputs immer `<label>`. |
| Alt-Text | Alle `<img>` mit aussagekräftigem `alt`-Attribut, dekorative mit `alt=""`. |
| Focus-Visible | Sichtbare Fokus-Ringe, nicht ausgeblendet |
| Reduced-Motion | `prefers-reduced-motion` respektiert (Animationen aus) |

**Tooling:** axe-core in Vitest + Playwright. Pre-Commit-Hook + CI-Gate.

#### 13.3 Visual-Polish (design-reviewer Subagent)

| Bereich | Regel |
|---|---|
| Token-Konsistenz | Keine Hard-Coded Hex außerhalb `themes.md`. Spacing nur via Spacing-Tokens. |
| Section-Komposition | Nur Sections aus `recipe-konfiguration.md` Section-Pool. Keine erfundenen Sektionen. |
| Anti-AI-Generic | Keine Pink-Lila-Gradient-BGs. Keine Stockfoto-Klischees. Keine 3+ Akzentfarben gleichzeitig. Verbotene Floskeln in `references/<berufsgruppe>.md`. |
| Mobile-Verhalten | Galerie horizontaler Scroll-Snap statt Grid. Hero ≤ 100vh. Tabellen scroll-fähig. |
| Reference-DNA-Match | Recipe muss zur Berufsgruppe-Visual-DNA passen (`references/<berufsgruppe>.md`) |
| Whitespace-Rhythmus | Section-Padding Tokens-konform, kein "eng-gepacktes" Layout |

#### 13.4 Content-Density (KI-Output-Qualität)

Min/Max-Werte pro Section. Verletzung triggert Re-Generation oder leeres Feld bleibt sichtbar im Portal als TODO.

| Section | Min Wortzahl | Max Wortzahl | Bemerkung |
|---|---|---|---|
| Hero-H1 | 3 | 12 | Kernbotschaft, kein Firmenname |
| Hero-Sub | 12 | 30 | 80–160 Zeichen |
| Leistungen-Item-Titel | 1 | 5 | |
| Leistungen-Item-Text | 30 | 80 | Pro Item |
| Über | 80 | 250 | Pro Absatz, max 2 Absätze |
| Bewertungen-Quote | 15 | 60 | Pro Zitat |
| FAQ-Frage | 5 | 15 | |
| FAQ-Antwort | 30 | 120 | |
| CTA-Block-Headline | 3 | 8 | |

**Hard-Block:** Hero-H1 leer = Recipe nicht produktiv schaltbar.

#### 13.5 Quality-Score (KI-Generation)

Bestehender `quality_score` 0–100 im Prototyp wird auf Live übernommen mit definierten Schwellen:

| Score | Verhalten |
|---|---|
| ≥ 80 | Recipe produktiv schalten — alles OK |
| 70–79 | Soft-Warning, Admin-Review wenn ≥ 3 Fälle pro Tag |
| 50–69 | Auto-Retry mit angepasstem Prompt (max 2 Retries) |
| < 50 | Hard-Block, Admin-Alarm + Onboarding-Recovery-Email |

#### 13.6 Branchen-spezifische Profile

Manche Berufsgruppen brauchen strengere Schwellen:

| Berufsgruppe | Score-Min | Begründung |
|---|---|---|
| Recht & Finanz | ≥ 85 | Reglementiert, Wording kritisch (siehe LIVE-COMPLIANCE § 10) |
| Gesundheit (Medical) | ≥ 85 | Heilberufe, kein Heilversprechen |
| Architektur & Planung | ≥ 80 | Premium-Anspruch |
| Bestattung *(Phase 2)* | ≥ 85 | Sensitiver Tonalitäts-Bereich |
| Sonstige | ≥ 70 | Default |

#### 13.7 Pflicht-Checks vor Live-Recipe-Release

Pro neuem oder geändertem Recipe vor produktiver Schaltung:

1. ✅ Lighthouse mobile ≥ 90 in 4 Kategorien
2. ✅ Accessibility WCAG AA via axe-core
3. ✅ design-reviewer-Subagent PASS
4. ✅ Cross-Browser-Test (Safari + Chrome + Firefox)
5. ✅ Beta-Test mit ≥ 3 echten Kunden der Berufsgruppe (oder Test-Sites)
6. ✅ Reference-Library-File für Berufsgruppe existiert + ist gefüllt
7. ✅ Skill-Prompt + Reference-Set-Input nachvollziehbar (in PR oder Code-Kommentar)

**Format-Detail:** `docs/_design/quality-standards.md` *(separates Detail-File optional, wenn § 13 zu lang wird)*

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
