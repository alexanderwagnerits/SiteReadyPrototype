# Mikro-Interaktionen Customer-Websites — instantpage.at

> **Block C.11** aus `DESIGN-VISION.md`. Hover, Scroll-Reveals, Logo-Animationen, Hero-Parallax, SVG/Lottie pro Theme. Was dezent uebernommen wird, was bewusst weggelassen.

**Stand:** 2026-05-14 — `[SPEC]` Theme-Charakteristika gesetzt, Reduced-Motion verbindlich. Konkrete Easing-Kurven + Performance-Budget pro Theme.

---

## 1. Animation-Philosophie

**Grundsatz:** Animation **dient** dem Inhalt, sie ist kein Inhalt. Auf KMU-Websites schadet Show-Off mehr als sie nuetzt — Besucher haben ein Ziel (Kontakt, Info, Termin), Animation soll sie zum Ziel **fuehren**, nicht ablenken.

**Drei Hebel die Animation legitim einsetzen:**
1. **Hierarchie verstaerken** (z.B. Hover auf interaktive Elemente)
2. **Kontext zeigen** (z.B. Scroll-Reveal als Aufmerksamkeits-Hinweis bei langen Seiten)
3. **State-Wechsel kommunizieren** (z.B. Form-Submission-Feedback)

**Was wir bewusst NICHT machen** (Anti-Patterns):
- Cursor-Follow-Effekte (Linear-Vibe, fuer KMU ueberzogen)
- Aufwendige Lottie-Loader auf Hero (Performance-Killer)
- Auto-Scroll-Slides ohne User-Trigger
- 3D-Tilt-Cards (Hipster-Tech-Vibe, nicht AT-KMU)
- Parallax-Backgrounds auf Mobile (Layout-Sprung-Risiko)
- Page-Loader-Spinner bei Static-Sites

**Connection:** baut auf `quality-standards.md` § 3 (Anti-AI-Generic-Patterns) + `BRAND.md` § 9 (visuelle Sprache).

---

## 2. Reduced-Motion (verbindlich, themen-uebergreifend)

`@media (prefers-reduced-motion: reduce)`:
- Alle Transform-/Translate-/Scale-Animationen deaktiviert
- Opacity-Wechsel bleibt (kein Layout-Sprung)
- Page-Transitions instant (`transition: none`)
- Scroll-Reveals: Content erscheint direkt sichtbar (kein Fade-in)
- Parallax: deaktiviert (Bild bleibt statisch)
- Hover-Hebungen: deaktiviert, nur Farbwechsel bleibt

**Tooling:** axe-core pruft `prefers-reduced-motion`-Honorierung in CI (siehe `quality-standards.md` § 2).

---

## 3. Theme-Charakteristika (Animations-DNA pro Theme)

| Theme | Animation-Charakter | Easing-Default | Hover-Hebung |
|---|---|---|---|
| **Klassisch** | sachlich-funktional, minimaler Aufschlag | `cubic-bezier(0.4, 0, 0.2, 1)` (Material-Standard) | 1–2 px Translate, 0.04 Shadow |
| **Edel** | ruhig-editorial, slow + smooth | `cubic-bezier(0.25, 0.46, 0.45, 0.94)` (ease-out-quad, sanft) | 0–1 px Translate, dezenter Color-Shift |
| **Rustikal** | warm-physisch, hapticher Touch | `cubic-bezier(0.34, 1.56, 0.64, 1)` (back-out, leicht ueberschwingend) | 2–3 px Translate, leichter Scale 1.02 |

**Duration-Defaults pro Theme:**
- Klassisch: 150 ms (Hover) / 220 ms (Reveal)
- Edel: 220 ms (Hover) / 320 ms (Reveal) — bewusst langsamer fuer Editorial-Vibe
- Rustikal: 180 ms (Hover) / 240 ms (Reveal)

---

## 4. Hover-Patterns

### 4.1 Service-Cards / Leistungen

| Theme | Hover-Animation |
|---|---|
| Klassisch | `translateY(-2px)` + `box-shadow: 0 4px 12px rgba(0,0,0,.06)` |
| Edel | `border-color` Akzentfarbe + 1 px hellere Surface | keine Translate |
| Rustikal | `translateY(-3px)` + leichter `scale(1.02)` + Schatten | Backout-Easing |

### 4.2 Buttons

Alle Themes: Hover-Color-Wechsel + leichte Shadow (analog Portal-Buttons in `portal-design.md` § 7, aber etwas dezenter weil Customer-Site).

### 4.3 Navigation

| Theme | Hover-Animation |
|---|---|
| Klassisch | Akzentfarbe-Underline (1 px), 150 ms |
| Edel | Akzentfarbe-Underline mit `transform-origin: left` Slide-in, 220 ms |
| Rustikal | Akzentfarbe-Background-Pill mit Soft-Corners, 180 ms |

### 4.4 Galerie-Bilder

Alle Themes: `transform: scale(1.04)` + Overlay 8 % Schwarz, 240 ms. Reduced-Motion: nur Overlay.

---

## 5. Scroll-Reveal-Patterns

### Entscheidung: dezenter Scroll-Reveal pro Theme `[ENTSCHIEDEN 2026-05-14]`

**Begruendung:**
- Kompletter Verzicht waere fuer Hero-Sub und CTA-Bloecke ein verschenkter Hinweis-Hebel
- Aggressives Reveal (200 px Slide-Up, 1 s Duration) ist Marketing-Site-Anti-Pattern fuer KMU
- Defensive Variante: 12–16 px Slide + Fade, 240–320 ms, einmalig

**Pro Theme:**

| Theme | Slide-Distanz | Duration | Stagger zwischen Items |
|---|---|---|---|
| Klassisch | 12 px | 240 ms | 60 ms |
| Edel | 16 px | 320 ms | 80 ms |
| Rustikal | 14 px | 260 ms | 70 ms |

**Welche Sections bekommen Scroll-Reveal:**
- Hero (initial sichtbar — kein Reveal, sofort da)
- Leistungen-Cards: Stagger-Reveal pro Card
- Ueber-Section: Fade-in beim Scroll
- Bewertungen-Quotes: Stagger-Reveal
- FAQ-Items: Fade-in pro Accordion-Item
- CTA-Block: Slide-Up beim Scroll

**KEINE Scroll-Reveal:**
- Galerie-Bilder (sollen sofort wahrnehmbar sein)
- Standorte/Karte (Funktional)
- Footer

**Trigger:** `IntersectionObserver` mit `threshold: 0.15` (15 % im Viewport).

---

## 6. Logo-Animationen

### Entscheidung: statisches Logo `[ENTSCHIEDEN 2026-05-14]`

**Begruendung:**
- Logo-Animation ist klassischer „Schoolbook"-Effekt aus 2010–2018 Designtools
- KMU-Logo ist Identitaet, nicht Effekt-Element
- Performance-Budget (siehe § 8) wuerde unter Logo-Animationen leiden
- Reduced-Motion-Audit haette zusaetzliche Komplexitaet

**Ausnahme:** Logo im Header bekommt minimalen Hover-Effekt (`opacity: 0.9` mit Pointer-Cursor — Click-Affordance fuer Home-Link).

---

## 7. Hero-Parallax

### Entscheidung: pro Theme differenziert `[ENTSCHIEDEN 2026-05-14]`

| Theme | Parallax | Begruendung |
|---|---|---|
| Klassisch | **NEIN** | sachlich-funktional, Parallax ist Editorial-Hipster-Vibe |
| Edel | **JA, sehr dezent** (≤ 30 px Translate beim Scroll) | Editorial-Vibe passt, aber subtil |
| Rustikal | **NEIN** | Werkstatt/Wirtshaus-Vibe ist physisch, nicht filmisch |

**Implementierung Edel:** CSS-only via `transform: translateY(calc(var(--scroll) * 0.15))`, kein JS-Heavy-Listener. Reduced-Motion: deaktiviert.

**Mobile:** Parallax komplett deaktiviert (Layout-Sprung-Risiko + Performance).

---

## 8. SVG / Lottie

### Entscheidung: SVG ja, Lottie nein `[ENTSCHIEDEN 2026-05-14]`

**SVG:**
- Icons (Lucide-Set, siehe `asset-strategy.md` § 5)
- Custom-Akzent-Elemente (Theme-spezifische Trennlinien, Section-Breaker) — gering dosiert
- Inline-SVG fuer kleine Decoration (Bullet-Points im Theme Edel z.B. mit Custom-Bullet)

**Lottie verworfen:**
- Bundle-Size-Belastung (lottie-web ~250 KB)
- Komplexitaet fuer KMU-Use-Case nicht gerechtfertigt
- Animationen sollen via CSS/SVG-Animation gemacht werden
- Reduced-Motion-Audit komplizierter

**SVG-Animationen wenn dann:** CSS-Animations (transform/opacity) auf SVG-Elements, nicht SMIL.

---

## 9. Performance-Budget pro Recipe

| Metrik | Mindest | Ziel | Quelle |
|---|---|---|---|
| Lighthouse Performance (mobile) | ≥ 85 | ≥ 90 | `quality-standards.md` § 1 |
| LCP | < 3.0 s | < 2.5 s | `quality-standards.md` § 1 |
| TBT | < 250 ms | < 200 ms | `quality-standards.md` § 1 |
| JS-Bundle (initial) | ≤ 80 KB gzip | ≤ 50 KB gzip | spezifisch C.11 |
| CSS-Bundle (initial) | ≤ 30 KB gzip | ≤ 20 KB gzip | spezifisch C.11 |
| Animation-Frame-Budget | 60 fps | 60 fps | RAF-Throttle, kein 30-fps-Fallback |

**JS-Reduktion-Strategie:**
- Mikro-Interaktionen primaer **CSS-only** (kein JS noetig fuer Hover, Scroll-Reveal mit Intersection-Observer ist marginal)
- Kein jQuery, kein Animation-Lib (kein anime.js, GSAP, Framer-Motion fuer Customer-Sites)
- IntersectionObserver ist nativ + ~0 Bytes

---

## 10. Page-Transitions

### Entscheidung: keine Page-Transitions `[ENTSCHIEDEN 2026-05-14]`

**Begruendung:**
- Static-MPA-Pages (Next.js statisch generiert) — keine SPA-Navigation-Animation gewuenscht
- Browser-Native-Behavior beibehalten (Back-Button-Verhalten, Scroll-Restore)
- Page-Transitions sind Editorial-Tech-Bubble-Vibe, fuer KMU irrelevant

**Ausnahme:** Anchor-Scroll innerhalb einer Page (z.B. „Zu den Leistungen") — smooth-scroll via CSS `scroll-behavior: smooth`, Reduced-Motion respektiert es nativ.

---

## 11. Connection

- `_design/themes.md` — Theme-Tokens (Easings/Durations als Tokens)
- `_design/quality-standards.md` § 1 + § 2 + § 3 — Performance + Reduced-Motion + Anti-AI-Generic
- `_design/asset-strategy.md` § 5 — Lucide-Icons (SVG)
- `_design/portal-design.md` § 9 — Mikro-Animationen Plattform-Portal (analog aber etwas anders, weil Portal Tool-Vibe statt Editorial)
- `BRAND.md` § 9 — visuelle Sprache
- `DESIGN-VISION.md` § 11 — Pointer hierher
