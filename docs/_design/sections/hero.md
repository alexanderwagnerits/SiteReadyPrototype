# Section-Spec — Hero

> **Erste Section auf jeder Recipe-Seite.** Eine Hero-Architektur (das Beta-Template), differenziert ueber Theme-Tokens + Recipe-Variablen pro Berufsgruppe. Aufgehaengt in [`DESIGN-VISION.md`](../../DESIGN-VISION.md) Block 9.

**Stand:** 2026-05-10
**Visual-Anker:** [`functions/templates/template.js`](../../../functions/templates/template.js) (Beta-Hero ist die einzige verbindliche Referenz — eigene Hero-Mockups verworfen, siehe Roadmap)
**Beta-Quelle:** [`functions/templates/template.js`](../../../functions/templates/template.js) Zeilen 122–212, 681–693

---

## Architektur-Prinzip

**Es gibt EINE Hero-Architektur** — die des Beta-Templates. Sie funktioniert seit Live, der User hat viel Zeit reingesteckt, sie ist robust ueber Stile + Branchen.

Was variiert pro Recipe:
- **Token-Overrides** ueber Theme-Klasse (`theme-klassisch / theme-edel / theme-rustikal`)
- **Recipe-Variablen** (Akzentfarbe, Heading-Font-Override, Spacing-Faktor)
- **Content-Stil** pro Branche (Eyebrow-Format, H1-Italic-Akzente, Lead-Tonalitaet)
- **Foto an/aus** (`.hero-split-img` als optionaler serve-time Hook)

Was **NICHT** variiert:
- Hero-Grundstruktur (Vollbild-Color-Hero, min-height 92vh, padding 120px 28px 60px)
- Klassen-Hierarchie (`.hero / .hero-inner / .hero-sub / .hero h1 / .hero-desc / .hero-btns`)
- Stagger-Reveal-Timing (Sub 0ms / H1 110ms / Accent-Line 220ms / Desc 330ms / Btns 440ms)
- Mobile-Verhalten (Beta-konform, Zeile 681–693 in template.js)

---

## Beta-Klassen-Hierarchie (verbindlich)

| Element | Klasse | Beta-Quelle |
|---|---|---|
| Container | `.hero` | template.js:176 |
| Inner-Wrapper | `.hero-inner` | template.js:177 |
| Eyebrow-Pill | `.hero-sub` (`+ .has-firma` falls Firma in Sub) | template.js:182–186 |
| Lokationszusatz im Eyebrow | `.hero-loc` | template.js:183 |
| H1 | `.hero h1` | template.js:178 |
| Akzent-Linie (Edel-only) | `.hero-accent-line` | template.js:179, 210 |
| Lead-Text | `.hero-desc` | template.js:188 |
| CTA-Container | `.hero-btns` | template.js:189 |
| Optionales Hero-Foto (serve-time) | `.hero-split-img` | template.js:128 (Reveal), serve-time injection |
| Trust-Bar (optional) | `.hero-trust-bar` + `.hero-trust-inner` | template.js:231–232 |
| Pageload-Reveal | `body.hero-play` (via 2× rAF) | template.js:122–128, 936 |

**Keine neuen Klassen.** Wenn ein Recipe etwas braucht, was es nicht gibt — pruefen ob es ueber bestehende Klassen + Token-Overrides loesbar ist. Falls nicht: hier diskutieren, dann ins Beta-Template aufnehmen, dann benutzen.

---

## Theme-Differenzierung (Tokens, kein Layout)

Pro Theme aendern sich nur Variablen + dezente decorative Effekte. Beta-Pattern dafuer existiert bereits ueber Body-Stil-Klassen (`.stil-modern`, `.stil-elegant`).

### Klassisch — Beta-Default (`body:not(.stil-modern):not(.stil-elegant)`)

| Aspekt | Wert |
|---|---|
| Background | `linear-gradient(150deg, --primary 0%, color-mix(--primary 65% + #000) 60%, color-mix(--primary 80% + --accent) 100%)` |
| Decorative | Concentric-Circles top-right (template.js:192–193) |
| Heading-Font | Merriweather (Beta-Default) — Recipe-Override DM Sans bei „modernen" Branchen erlaubt |
| H1-Style | font-weight 800, letter-spacing -0.04em |
| Akzent-Linie | display:none |
| Eyebrow | Pill mit Border + Pin-Icon (Default) |
| Italic-Akzent in H1 | NEIN (Klassisch ist Sans/Serif-Workhorse, keine Italic-Stunts) |

### Edel — Beta-`.stil-elegant` rebrandet

| Aspekt | Wert |
|---|---|
| Background | `linear-gradient(155deg, --primary 0%, color-mix(--primary 60% + #000) 100%)` (template.js:207) |
| Decorative | KEINE Circles, ruhige Farbflaeche |
| Heading-Font | Cormorant Garamond |
| H1-Style | font-weight 500, letter-spacing -0.02em, margin-bottom 0 |
| Akzent-Linie | sichtbar — 48×1px, opacity 0.55, var(--accent), margin 28px 0 (template.js:210) |
| Eyebrow | Border-only Pill, transparent Background, kleinere Letter-Spacing 0.04em (template.js:211) |
| Italic-Akzent in H1 | JA — Statement-Worte in `<em>`, Cormorant italic, Old-Gold-Akzent |

### Rustikal — neuer Stil auf Beta-Architektur

| Aspekt | Wert |
|---|---|
| Background | wie Klassisch-Default Gradient, aber mit Burgund-Primary + Noise-SVG-Overlay (`.sr-grain` Pattern aus Beta:139) |
| Decorative | Noise-Overlay statt Circles |
| Heading-Font | Unna (text-serif sturdy) |
| H1-Style | font-weight 700, letter-spacing -0.005em |
| Akzent-Linie | display:none (wie Klassisch) |
| Eyebrow | Pill wie Klassisch + zusaetzlich erlaubte Stempel-Optik via Bracket-Zeichen im Text |
| Italic-Akzent in H1 | JA — Marken-Name oder Hand-Geschriebenes in `<em>`, Unna italic, Warmgold-Akzent |

---

## Recipe-Variablen (pro Berufsgruppe)

Pro Recipe-Render gesetzt aus `recipe-konfiguration.md`:

| Variable | Quelle | Wirkung |
|---|---|---|
| `--primary` | Logo-Extraktion + User-Wahl | Hero-Gradient + Eyebrow-Akzent |
| `--accent` | Recipe-Default oder vom Primary abgeleitet | Buttons + Akzent-Linie (Edel) |
| Heading-Font-Override | Recipe-Konfig (z.B. „bildung-modern: DM Sans" obwohl Theme=Klassisch) | nur fuer H1 + H2 |
| Spacing-Faktor | Branchen-Default (0.85 kompakt / 1.0 / 1.15 luftig) | hero-inner-padding |
| Eyebrow-Format | Branchen-Default | siehe Tabelle unten |
| H1-Italic-Worte | Branchen-Default | nur Edel + Rustikal |
| Foto an/aus | Recipe-Konfig | aktiviert `.hero-split-img` Hook |

### Eyebrow-Format pro Branche (Beispiele)

| Berufsgruppe | Eyebrow-Format-Vorlage |
|---|---|
| Recht / Steuer / Notar | „{Stadt} · {Berufsbezeichnung}" — sachlich |
| Coaching / Beratung | „{Berufsbezeichnung} · seit {Jahr}" — Erfahrung-fokussiert |
| Architektur / Design | „{Stadt} — seit {Jahr}" — editorial-knapp |
| Handwerk-Werkstatt | „{Stadt} · {Jahr} · {Generation}. Generation" — Stempel-Optik |
| Gastro-Wirtshaus | „{Region} · seit {Jahr}" — historisch |
| Medical / Praxis | „{Fachgebiet} in {Stadt}" — funktional |

### H1-Italic-Akzente pro Berufsgruppe (nur Edel + Rustikal)

| Berufsgruppe | Italic-Worte (Beispiel) |
|---|---|
| Architekt-Premium (Edel) | „Architektur als *stille Buehne* fuer das Leben." |
| Restaurant-Editorial (Edel) | „Wirtshaus *neu gedacht* — Klassiker mit Handschrift." |
| Werkstatt (Rustikal) | „*Tischlerei Bauer* — handgemachte Moebel aus heimischen Hoelzern." |
| Bauernhof (Rustikal) | „Vom Hof Bauer — *frisch, fair, von hier*." |
| Wirtshaus (Rustikal) | „Beim *Wirt z'Raach* — Wirtshauskueche seit 1923." |

---

## Foto-Variante (`.hero-split-img`)

Beta-Template hat den Foto-Hook bereits — `.hero-split-img` Klasse, serve-time injection. Im Mockup-Anker und im Live-Bau:

**Wann Foto-an:**
- Branche profitiert von Atmosphaere oder Personenbezug (Coach, Architekt, Werkstatt, Wirtshaus, Hotel, Bauernhof)
- Kunde hat brauchbares Hero-Foto **oder** Stockfoto-Whitelist greift

**Wann Foto-aus:**
- Branche bewusst foto-frei (Anwalt, Notar, Steuerberater, Versicherungsmakler)
- Foto-Quality-Score zu niedrig
- User-Praeferenz im Portal

**Layout-Verhalten:** Foto erscheint als rechte Spalte im `.hero-inner` (Grid 1fr 1fr Desktop, vertikaler Stack Mobile). Es entsteht **kein neues Layout** — `.hero` bleibt Vollbild-Color-Gradient, das Foto sitzt drin.

**Theme-spezifische Foto-Behandlung:**
- Klassisch: `filter:saturate(.95) contrast(1.02)`, aspect-ratio 4/3, Architektur-Linien-Pattern als dezenter Overlay
- Edel: `filter:saturate(.85) contrast(1.02)`, aspect-ratio 3/4 portrait, kein Pattern
- Rustikal: `filter:saturate(.92) contrast(1.04) sepia(.06)`, aspect-ratio 4/3, weisser 8px Frame + warmer Shadow

---

## States

### Empty

Recipe-Engine garantiert: keine leere Hero. Fallbacks aus Recipe-Konfig.

### Loading

Hero ist server-rendered. Bilder `loading="eager"` + `fetchpriority="high"`.

### Error

Foto-Load-Fehler → `.hero-split-img` verschwindet via JS-Fallback, Hero bleibt funktional als reine Text-Variante.

### Hover

CTA-Hover wie Beta — `translateY(-1px)` + leichter Schatten. Foto KEIN Hover.

### Active

Touch: kein Hover, sofort Active-Feedback.

---

## Mikro-Interaktionen

**Pageload-Reveal (Beta 1:1):**
- `.hero-sub` 0ms / `.hero h1` 110ms / `.hero-accent-line` 220ms / `.hero-desc` 330ms / `.hero-btns` 440ms / `.hero-split-img` 180ms
- Trigger: `body.hero-play` via 2× requestAnimationFrame (template.js:936)
- Transition `.75s cubic-bezier(.22,1,.36,1)` opacity + translateY 14px → 0
- `prefers-reduced-motion: reduce` → alle Reveals deaktiviert (template.js:129)

**Scroll:**
- KEIN Parallax
- KEIN Sticky-Hero
- Optional Scroll-Indicator pro Recipe (default off)

---

## Mobile-Verhalten (Beta 1:1, template.js:681–693)

```
@media(max-width:880px){
  .hero{min-height:78svh;align-items:center}
  .hero-inner{padding:52px 24px 44px}
  .hero h1{font-size:clamp(2.1rem,9vw,2.8rem);letter-spacing:-.03em;margin-bottom:14px}
  .hero-sub{display:block;background:transparent!important;border:none!important;
            border-radius:0!important;padding:0!important;font-size:.7rem;
            font-weight:700;letter-spacing:.1em;color:rgba(255,255,255,.55);
            margin-bottom:14px;white-space:nowrap;
            overflow:hidden;text-overflow:ellipsis}
  .hero-sub .hero-loc{display:none}
  .hero-desc{font-size:.88rem;margin-bottom:28px;max-width:100%;
             display:-webkit-box;-webkit-line-clamp:3;
             -webkit-box-orient:vertical;overflow:hidden}
  .hero-btns{flex-direction:column;gap:10px}
  .hero-btns .btn{width:100%;text-align:center}
}
```

Stil-spezifische Mobile-Overrides:
- Modern: `padding:40px 24px 40px`, H1 clamp(2.4rem, 10vw, 3.6rem)
- Elegant/Edel: `padding:40px 24px 44px`, H1 clamp(2.2rem, 9vw, 3.2rem)

---

## Quality-Checks (vor Recipe-Release)

Aus `DESIGN-VISION.md` § 13.7 abgeleitet, Hero-spezifisch:

- [ ] H1 Lesbarkeit: Kontrast ≥ 4.5:1 in allen Theme × Recipe-Akzent-Kombis
- [ ] Optional Foto: Aufloesung min. 1920×1280 Desktop, 1080×720 Mobile
- [ ] LCP: < 2.5s mobile (Foto eager + fetchpriority)
- [ ] CLS: < 0.05 — `.hero-split-img` mit width/height oder aspect-ratio
- [ ] Touch-Targets ≥ 48px (CTA-Buttons via Beta `.btn` Klasse)
- [ ] Reduced-Motion: Reveals deaktiviert
- [ ] Reveal spielt sauber (2× rAF Pattern in template.js:936 unveraendert lassen)
- [ ] H1 max-width: kein Zeilenumbruch nach 2 Worten (Beta `max-width:720px`)

---

## Offene Punkte

1. **Italic-Engine-Decision** (Edel + Rustikal): Wie setzt die KI semantisch `<em>` in H1? Heuristik (Marken-Name immer italic) oder Free-Text-Markup? — siehe themes.md offene Punkte #6
2. **Rustikal als neue Stil-Klasse:** im Beta-Template existiert `.stil-rustikal` noch nicht — Live-Bau ergaenzt `.stil-rustikal` analog zu `.stil-modern` / `.stil-elegant`. Bis dahin Mockup-only.
3. **Foto-Quality-Score-Threshold**: bei welchem Wert `.hero-split-img` aussetzen? — Engine-Decision

---

## Verbindung zu anderen Dokumenten

- [`DESIGN-VISION.md`](../../DESIGN-VISION.md) Block 9 — Anchor
- [`themes.md`](../themes.md) — Theme-Token-Quelle
- [`recipe-konfiguration.md`](../recipe-konfiguration.md) — Recipe-Variablen pro Berufsgruppe
- [`functions/templates/template.js`](../../../functions/templates/template.js) — Beta-Hero-Implementierung (verbindlich)
- [`references/handwerk.md`](../references/handwerk.md) — Layer-0-Referenzen Hero-Patterns

---

*Living Document. Pflegen bei Hero-Aenderungen — die zugleich am Beta-Template gemacht werden.*
