# Portal-Design — instantpage.at

> **Block B.6** aus `DESIGN-VISION.md`. Visual- + UX-Specs fuer das Self-Service-Portal. Funktionale Tab-Struktur in `PRODUCT.md` § 7, hier die Design-Sprache.

**Stand:** 2026-05-14 — `[TEIL-SPEC'D]` Polish-Specs aus Prototyp-Audit (§§ 5–10) konkret und Live-bindend. High-Level (§§ 2–4) als Skeleton mit Entscheidungs-Grundlage. Finalisierung im Live-Bau Phase 0.5.

---

## 1. Grundhaltung

Quelle: Memory `feedback_portal_design.md` + `feedback_serve_time_maximum.md` + Prototyp-Polish-Audit Etappe 1 (2026-04-28, Commit `631c06a`).

**Leitsaetze:**

- **Self-Service-Portal, kein Editor.** Kunde bearbeitet Inhalte + Konfiguration, nicht Layout/CSS. Drag-and-Drop bleibt Wix/Squarespace-Domaene.
- **KMU-Sprache, keine SaaS-Floskeln.** „Meine Website" statt „Project", „Leistungen" statt „Services", „Mein Account" statt „Workspace".
- **Hybrid-Save** (Memory `feedback_portal_design.md`): Auto-Save bei Toggles/Sliders/Color-Picker, Save-Button bei Forms.
- **Serve-Time-Maximum** (Memory `feedback_serve_time_maximum.md`): Look, Akzentfarbe, Anrede, Bezeichnung wirken sofort ohne Re-Generation.
- **Nav-Reihenfolge spiegelt Website-Reihenfolge** (Memory `feedback_portal_design.md`): Sidebar-Items in der Reihenfolge wie Sections auf der Kunden-Website.

---

## 2. Information-Architecture (Sidebar-Gruppen)

Quelle: `PRODUCT.md` § 7.2 — die funktionale IA ist dort spec'd. Hier visuelle Praezisierung.

**Drei Sidebar-Gruppen** mit dezenter Group-Label-Hierarchie:

```
Inhalte meiner Website        ← Group-Label, klein, dezent (12px, neutral-600)
  Meine Website                 ← Tab-Item, 14px, klar lesbar
  Leistungen
  Texte
  Bewertungen
  Galerie
  Team
  FAQ
  Logo & Fotos
  Section-Toggles

Einstellungen                 ← Group-Label
  Design
  Unternehmen & Impressum
  SEO & Google
  Custom Domain (Pro)
  Statistiken (Pro)

Konto                         ← Group-Label
  Mein Account
  Rechnungen
  Support
```

**Sidebar-Visuals:**
- Aktiver Tab: Akzentfarbe-Background (8 % Opacity) + leichter Left-Border 2px (Akzent)
- Hover: Background 4 % Opacity
- Pro-Plan-only-Tabs (Custom Domain, Statistiken): kleines „Pro"-Badge rechts vom Label, dezent

**Verantwortlichkeit:** IA ist im Prototyp schon strukturiert + funktional. Im Live nur Sidebar-Visuals nachziehen (§§ 5–10 unten).

---

## 3. Form-Patterns

**Kontextuelle Hilfe:**
- Inline-Hint unter Form-Label (12px, neutral-600), nicht als Tooltip/Modal
- Bei komplexen Feldern (z.B. UID-Format, Berufsbezeichnung) zusaetzlich „?"-Icon mit Hover-Tooltip
- KEINE Walkthrough-Modal-Tours bei First-Login (Memory `feedback_portal_design.md`: KMU-Sprache, keine Floskeln)

**Inline-Validation:**
- Validate **on-blur**, nicht on-keypress (keine Live-Frust-Markierung)
- Fehler-State: rote Border + Inline-Message unter Feld (rot, 13px)
- Success-State: keine gruene Markierung bei Pflichtfeldern (uebertrieben), nur bei explizit positiver Aktion (z.B. Domain-Verifikation gelungen)

**Save-Indikatoren:**
- Hybrid-Save (Memory `feedback_portal_design.md`):
  - Toggle / Slider / Color-Picker: Auto-Save, Toast nach 800 ms wenn keine weitere Aktion
  - Form mit Text-Inputs: expliziter „Speichern"-Button
- Save-in-progress: Button mit Spinner + „Wird gespeichert..."
- Save-erfolgt: Toast unten rechts mit Akzentfarbe, 2 s Auto-Dismiss

**Optimistic Updates:**
- UI aendert sich sofort, Server-Response asynchron
- Bei Server-Error: Rollback + Inline-Fehler-Toast (rot)
- Funktioniert fuer Toggles, Sliders, Sort-Reorder. Nicht fuer File-Uploads (zu unsicher).

**Required-Field-Markierung:**
- Asterisk * neben Label bei Pflichtfeldern
- Sammel-Hint oben „* = Pflichtfeld" statt pro Feld erklaeren
- Nach Submit alle leeren Pflichtfelder gleichzeitig markieren (kein „first-error-only")

---

## 4. Live-Preview-UX (Design-Tab)

**Frage:** wie soll die Live-Preview im Design-Tab aussehen, wenn Kunde Look-/Akzentfarbe-/Anrede-Wechsel vornimmt?

**Drei Optionen mit Trade-offs:**

| Option | Beschreibung | Pro | Contra |
|---|---|---|---|
| **A: Split-View** | Form links 50 %, iframe rechts 50 % | Sofort sichtbare Wirkung. Standard fuer Designer-Tools (Webflow). | Mobile-Portal scheitert (kein Platz fuer Split). Halbe Form-Breite kann eng werden. |
| **B: Modal-Overlay** | Klick „Vorschau" → Full-Screen-Modal mit Site | Mobile-tauglich. Form bleibt voll breit. | Zusaetzlicher Klick fuer jede Aenderung. Iteration langsamer. |
| **C: Slide-Over** | Form voll breit, Preview als Slide-Over von rechts (~70 %) | Mobile via Bottom-Sheet. Iteration fluessig. | Form ist teilweise verdeckt, kein direkter Side-by-Side. |

**Default-Empfehlung (Live-Repo-Bauentscheidung):** **Option C (Slide-Over)** auf Desktop, **Option B (Modal)** auf Mobile. Begruendung: Form-Breite-Erhalt + Mobile-Konsistenz. ABER: ist Bauentscheidung — Inhaber kann ueberstimmen.

**Live-Preview-Inhalt:**
- iframe auf eigene Test-Subdomain (`preview.instantpage.at/<id>?token=<jwt>`)
- Alle Aenderungen serve-time (CSS-Klasse / Token / Placeholder-Replacement)
- Optional: „Vorschau anwenden" / „Verwerfen" fuer Test-Klicks vor Commit — `[ENTSCHEIDUNGS-OFFEN]` falls Bestaetigungs-Pattern noetig (Inhaber-Bauentscheidung)

---

## 5. Standard-Card-Komponente `<PortalCard>`

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

**Anatomy:**
- Header: Title (16px medium) + Sub (13px neutral-600) + Action (rechts)
- Body: Children mit Padding (siehe § 6)
- Border: 1px neutral-200, Radius 12px
- Shadow: keine Default-Shadow (flache Card). Optional `<PortalCard variant="elevated">` mit 0 2px 8px rgba(0,0,0,.04) — selten verwendet (z.B. fuer hervorgehobene Empfehlungen).

---

## 6. Card-Padding-Skala

**Im Live: einheitlich 24/28** (statt im Prototyp 20/24 fuer Upload-Cards vs. 24/28 fuer Form-Cards). 24px horizontal, 28px vertikal. Bringt visuelle Ruhe.

**Sub-Card-Padding** (Cards in Cards, z.B. List-Items): 16/20.

**Mobile-Padding** (≤ 640px): 20/24 (Card-Standard) und 12/16 (Sub-Card).

---

## 7. Button Hover/Active-States

Alle interaktiven Elemente bekommen Feedback (im Prototyp viele Buttons funktional ohne Hover):

| Button-Typ | Hover | Active | Transition |
|---|---|---|---|
| Primary | `transform: translateY(-1px)` + `box-shadow: 0 4px 12px rgba(0,0,0,.08)` | `translateY(0)` | 150ms ease-out |
| Secondary | `background-color` 4 % dunkler | `background-color` 8 % dunkler | 150ms ease-out |
| Icon (×, Ersetzen, Hochladen) | `opacity: 1` (Default 0.7) + `background: rgba(0,0,0,.04)` | `background: rgba(0,0,0,.08)` | 120ms ease-out |
| Destructive | `background-color` 6 % dunkler + `box-shadow: 0 0 0 3px rgba(red,.1)` | wie Hover ohne Shadow | 150ms |

**Disabled-States:**
- `opacity: 0.5` + `cursor: not-allowed`
- Bei Hover: keine Veraenderung

**Focus-Visible (Keyboard-Nav):**
- 2px Outline in Akzentfarbe, 2px Offset
- NICHT `outline: none` (WCAG-Verletzung, siehe `quality-standards.md` § 2)

---

## 8. Progress-Visualisierung Einrichtungsassistent

Prototyp: reine Liste mit ✓/●. Live: **Mini-Donut „X/Y Pflicht"** prominent oben + Liste darunter.

**Donut-Spec:**
- SVG, 48px × 48px, Stroke 6px
- Stroke-Color: Akzentfarbe (gefuellt) + neutral-200 (Rest)
- Animation: animierter `stroke-dasharray` bei Aenderung, 300ms ease
- Center-Text: „3/8" (12px medium, neutral-800)

**Liste darunter:**
- Pflicht-Items zuerst (mit ✓ oder ●), dann optionale Items dezent (neutral-500)
- Bei Klick auf Listen-Item: Sprung in entsprechenden Tab

---

## 9. Mikro-Animationen

| Trigger | Animation | Timing |
|---|---|---|
| Tab-Wechsel (Sidebar-Klick → Tab-Inhalt) | Fade-in + 4px Slide-up | 200ms ease-out |
| Card-Insert (neue Leistung/Bewertung/Galerie-Item) | Slide-down + Fade-in, max-height 0 → auto | 220ms ease-out |
| Toast erscheinen | Slide-up von unten + Fade-in | 180ms ease-out (enter), 250ms ease-in (exit nach 3s) |
| Save-Indikator | Pulse-Animation auf Save-Icon (scale 1 → 1.1 → 1) | 400ms ease-in-out |
| Stil-Wechsel im Design-Tab | Cross-fade zwischen Preview-iframes | 300ms ease |
| Modal/Slide-Over oeffnen | Slide + Fade, Backdrop fade-in | 240ms ease-out |
| Donut-Progress-Aenderung | stroke-dasharray Animation | 300ms ease |

**Default-Transition fuer alles andere:** 150ms ease-out (Hover, Color, Background).

**Reduced-Motion:** alle Animationen via `@media (prefers-reduced-motion: reduce)` deaktivieren, nur Opacity-Wechsel beibehalten (kein Layout-Sprung).

---

## 10. Typographie-Skala

Prototyp nutzt 12+ Stufen (0.65/0.68/0.72/0.74/0.78/0.8/0.82/0.85/0.88/0.9/0.92/.95/1rem). Live: **5 Stufen** mit klarer Hierarchie:

| Token | Wert | Use |
|---|---|---|
| `text-xs` | 0.75rem (12px) | Meta, Captions, Badges, Hint-Texte unter Form-Labels |
| `text-sm` | 0.875rem (14px) | Sub-Texte, Form-Hints, Sidebar-Items |
| `text-base` | 1rem (16px) | Body, Form-Inputs, Card-Sub |
| `text-lg` | 1.125rem (18px) | Card-Titles, Section-Sub-Heads |
| `text-xl` | 1.375rem (22px) | Section-Heads (Tab-Hauptueberschrift) |

(Headlines `text-2xl` 1.75rem und groesser bleiben dem Marketing-Site vorbehalten — Block 5.)

**Font-Weights:**
- 400 (regular) — Body
- 500 (medium) — Card-Titles, Section-Heads, aktive Sidebar-Items
- 600 (semibold) — selten, fuer Akzent-Hervorhebung in Bullet-Listen

---

## 11. Mobile-Portal-UX

**Sidebar:**
- Auf Mobile: Hamburger-Menue links oben → Slide-Over Sidebar von links (75 % Viewport-Breite)
- Backdrop fade-in beim Oeffnen
- Klick auf Tab-Item: Sidebar schliesst sich, Tab-Content laedt

**Forms:**
- Touch-Targets ≥ 44px × 44px (WCAG, siehe `quality-standards.md` § 2)
- Date-Picker + Color-Picker: native iOS/Android-Sheets statt Custom-Widgets (UX-Konsistenz)
- File-Upload: native System-Picker mit Multi-Upload-Support

**Live-Preview-UX:** Modal-Overlay (Option B in § 4) — kein Slide-Over auf Mobile.

**Bottom-Tab-Bar (verworfen):**
- Pruefkriterium: KMU-Inhaber nutzen Portal hauptsaechlich am Desktop fuer Setup, Mobile fuer Quick-Checks
- Bottom-Bar haette die Sidebar-Gruppen-Hierarchie unterbrochen
- Stattdessen: Hamburger ist klar genug, weniger Komplexitaet

---

## 12. Settings/Konto-Bereich-Design

**Tab-Struktur** (Konto-Gruppe in Sidebar):
- Mein Account
- Rechnungen
- Support

**Layout pro Konto-Tab:** Single-Column-Form, max 600px breit, zentriert. Anders als Inhalts-Tabs (full-width).

**Begruendung:** Konto-Daten sind weniger frequentiert + brauchen weniger Side-by-Side-Editing. Schmale Form-Breite reduziert visuelle Last.

**Spezifika:**
- **Mein Account:** Avatar oben, dann Form-Fields (Email/Passwort/2FA) untereinander
- **Rechnungen:** Tabelle mit historischen Stripe-Rechnungen + Button „Rechnungs-Portal oeffnen" (Stripe Customer Portal)
- **Support:** FAQ-Suche + Support-Formular + „Etwas funktioniert nicht?"-Diagnostik-Button

---

## 13. Empty-States

Pro Tab mit User-erweiterbaren Inhalten (Leistungen, Bewertungen, Galerie, Team, FAQ):

**Format:**
- Dezente Illustration (max 80px × 80px) oder Icon (Lucide-Set, 32px)
- Headline: „Noch keine [Items]" (16px medium)
- Sub: 1-Satz-Begruendung warum es wichtig ist (13px neutral-600)
- Primary-Button: „Erste [Item] hinzufuegen"

**Anti-Pattern (verboten):**
- „You haven't created any X yet" (Englisch)
- Empty-State mit 5+ Bullet-Points
- Lustig-sein-wollende Texte („Hier ist's noch leer wie in einer Schreibstube ohne Tinte" — Memory `feedback_serve_time_maximum.md` Voice-Lock)

---

## 14. Diagnostik-Button „Etwas funktioniert nicht?"

Im Support-Tab (siehe `PRODUCT.md` § 7.8). Dezent unter den Support-Formularen.

**Funktion:** Klick erzeugt Bug-Report-Ticket inkl. Account-Context (subdomain, plan, last-action), das vom Inhaber bearbeitet wird.

**Visual:**
- Sekundaer-Button (nicht Primary-CTA)
- Icon: `<AlertCircle>` (Lucide) links vom Text
- Click-Feedback: „Diagnostik gestartet..." Toast, dann nach 2s „Wir melden uns binnen 24h"

---

## 15. Connection

- `PRODUCT.md` § 7 — funktionale Portal-Tabs (Quelle der Wahrheit)
- `BRAND.md` § 9 — visuelle Sprache Plattform-UI (Tannengruen, Component-Conventions)
- `_design/quality-standards.md` — Performance/A11y-Schwellen
- `DESIGN-VISION.md` § 4 — Plattform-Design-System (Tokens, Component-Conventions)
- `DESIGN-VISION.md` § 14 — Code-Quality-Standards (Storybook fuer Portal-Components)
- `feedback_portal_design.md` — Nav-Reihenfolge, KMU-Sprache, Hybrid-Save
- `feedback_serve_time_maximum.md` — Serve-Time-Wechsel-Felder
