# Recipe-Themes — Visual-Tokens v2  `[VERWORFEN 2026-05-11]`

> **⚠️ DIESE DOKU IST VERWORFEN.** Der v2-Themes-Ansatz (Klassisch / Edel / Rustikal mit eigenen Polish-Patterns wie Italic-Em, Stempel, Photo-Frame, alternierende Leistungen, asymmetric Heads) hat sich nicht bewaehrt. Vergleich am 2026-05-11 zwischen v2-Polish-Mockup und Beta-Live-Kopie mit Tischlerei-Inhalten: User-Entscheidung **Beta-Stil ist die einzige Linie** („sieht halt einfacher und schlichter aus"). Diese Datei bleibt als Historie. Aktuelle Linie: Beta-Template (`functions/templates/template.js`) + Recipe-spezifische Inhalte + Akzent. Siehe `feedback_beta_template_grundlage.md` und `project_recipe_themes_v2.md`. Mockups verworfen unter `public/_archive/`.

---

**Stand (Pre-Verwurf):** 2026-05-06
**Status:** ~~v2 — verbindliche Theme-Architektur~~ **VERWORFEN 2026-05-11**

> **Architektur-Entscheidung 2026-05-06 (ueberholt):** Beta-Template (`functions/templates/template.js`) ist die **Grundlage** für alle 3 v2-Themes. Architektur (Vollbild-Color-Hero, Sektions-Sprache, Animationen) bleibt; v2-Themes definieren nur **Tokens** (Farben, Fonts, Spacing) + stil-spezifische Variationen — wie heute schon `.stil-klassisch / .stil-modern / .stil-elegant`. Mockups, die das Magazine-Layout (Edel) oder Noise-Filter (Rustikal) als alleinige Welt aufgemacht haben, sind verworfen. Vergleichs-Mockup: `public/_archive/mockup-themes-v2.html`.

---

## Aenderungs-Log gegenueber RECIPE-SYSTEM.md v1

| Was | Vorher | Jetzt |
|---|---|---|
| Theme-Anzahl | 4 (Klassisch / Modern / Editorial / Handwerklich) | **3** (Klassisch / Edel / Rustikal) |
| Modern-Theme | eigenes Theme | aufgegangen in **Klassisch** ueber Recipe-Akzent + Spacing-Override |
| Editorial-Theme | eigener Name | umbenannt zu **Edel** (KMU-verstaendlicher) |
| Handwerklich-Theme | nur Werkstatt | umbenannt zu **Rustikal**, Scope erweitert: Werkstatt + Wirtshaus + Bauernhof + Berghuette |
| Beta-Stil "elegant" | eigener Stil | weg — Premium-Anwalt geht in Klassisch, Premium-Restaurant in Edel |

→ [`RECIPE-SYSTEM.md`](../RECIPE-SYSTEM.md) Theme-Mapping wird auf dieser Basis aktualisiert.

---

## Vorbemerkung — Zwei Welten, getrennt

[`design-system-notes.md`](design-system-notes.md) + [`system-preview/tokens.css`](system-preview/tokens.css) definieren das **Plattform-Design-System** (instantpage.at-Marketing-Site + Portal). Diese Doku definiert die **Recipe-Themes** (Endkunden-Websites). Tokens werden NICHT geteilt — Plattform = Linear/Stripe-Sachlich, Recipes = branchenspezifisch + premium-tauglich.

Verbindlich aus [`BRAND.md`](../BRAND.md) § 9.4.

---

## Was ein Theme spec'd

Pro Theme ein vollstaendiges Token-Set:

| Bereich | Werte |
|---|---|
| Identitaet | Charakter, Zielgruppe, Inspiration, Mockup-Anker |
| Farben | Surface, Surface-Alt, Surface-Inverted, Text, Text-Muted, Accent (+ -Variant), Border |
| Typografie | Heading-Font, Body-Font, Mono, 7-Stufen-Skala, Letter-Spacing, Line-Height |
| Spacing | Container-Max, Section-Y (Desktop + Mobile), Card-Padding |
| Borders + Shapes | Radius-Skala, Border-Weights, Schatten-System |
| Foto-Behandlung | Filter-Stack, Aspect-Ratios |
| Animation | Easing, Duration-Range, Charakter |
| Recipe-Overrides | Was pro Recipe variabel ist |

---

## Naming-Konvention

CSS-Custom-Properties an `:root`. Im Live-Bau pro Recipe ein Theme-Klassen-Wrapper:

```css
.theme-klassisch { --surface: #ffffff; --accent: #1f3a6e; ... }
.theme-edel      { --surface: #f4f2ef; --accent: #5b9bb3; ... }
.theme-rustikal  { --surface: #f5f1e8; --accent: #7a3528; ... }
```

**Konstanten ueber alle Themes (verbindlich):**

```css
--reading-max:  65ch;     /* Body-Lesbarkeit */
--touch-min:    44px;     /* iOS HIG Mindestgroesse */
--motion-fast:  150ms;
--motion-mid:   250ms;
--motion-slow:  400ms;
```

---

## Theme 1 — Klassisch

### Identitaet

**Workhorse-Theme.** Sachlich, sauber, professionell. Sans-Serif, Hairline-Borders, neutrale Farbpalette. Anpassbar von "stricter Anwalts-Look" bis "lebendiger Coach-Look" durch Recipe-Akzent + Spacing-Override.

**Inspiration:** Linear, Stripe-Docs, Notion-Marketing, Vercel-Marketing.

**Anker:** [`public/mockup-themes-v2.html`](../../public/mockup-themes-v2.html) (Switcher → "Klassisch"). Architektur vom Beta-Template `.stil-klassisch` übernommen, Heading-Font Merriweather (vom Beta), Tokens leicht aktualisiert. **Frage offen 2026-05-06:** Merriweather-Serif vs. DM-Sans — Beta hat Merriweather, themes.md v2 hatte DM Sans angedacht; Default jetzt Merriweather (Beta-Konsistenz), Wechsel auf DM Sans wäre 1-Token-Override.

**Zielgruppe:** Anwalt, Notar, Steuerberater, Arzt, Versicherungsmakler, alle klassischen Dienstleister, moderne Coaches/Berater, klassischer Handel, Bildung (klassisch + modern), Industrie, Mobilitaet, Kosmetik-modern, Kultur-modern, Bau-Handwerk, Modern-Handwerk, Gastro-Casual, Gesundheit-Praxis.

### Farben

| Token | Wert | Use |
|---|---|---|
| `--surface` | `#ffffff` | Body |
| `--surface-alt` | `#f7f7f5` | Section-Wechsel, Card-Hintergrund |
| `--surface-inverted` | `#0e1320` | Dark-Sections (CTA, Footer) |
| `--text` | `#0e1320` | Body, Headlines |
| `--text-muted` | `#5a6378` | Sub-Texte |
| `--accent` | `#1f3a6e` | Default Primary (Navy — recipe-ueberschreibbar) |
| `--accent-hover` | `#2b4d8b` | Hover Primary |
| `--accent-soft` | `#e8edf5` | Tags, Badges-Subtle |
| `--border` | `#e6e6e0` | Hairlines |
| `--border-strong` | `#0e1320` | seltene starke Trenner |

**Recipe-Override:** `--accent` wird pro Recipe gesetzt (Logo-Extraktion + User-Wahl). Default oben ist Navy-Trust. Coach kann Terra werden, Bildung-modern Tannengruen, Kosmetik-modern Korallenrot, etc.

### Typografie

```css
--font-heading: 'DM Sans', system-ui, sans-serif;
--font-body:    'DM Sans', system-ui, sans-serif;
--font-mono:    'JetBrains Mono', monospace;
```

Sans-only — Klassisch ist das einzige der 3 Themes ohne Serif. Damit klare Abgrenzung gegenueber Edel (Display-Serif) und Rustikal (Sturdy-Serif).

| Token | Desktop | Mobile | Use |
|---|---|---|---|
| `--text-xs` | 13 / 1.5 | 12 / 1.5 | Captions, Meta |
| `--text-sm` | 15 / 1.55 | 14 / 1.55 | Form-Hints, Sub-Body |
| `--text-base` | 17 / 1.65 | 16 / 1.65 | Body |
| `--text-lg` | 21 / 1.5 | 19 / 1.5 | Section-Sub, Hero-Lead |
| `--text-xl` | 30 / 1.25 | 24 / 1.25 | Section-Heads |
| `--text-2xl` | 48 / 1.1 | 34 / 1.15 | H1, Hero |
| `--text-3xl` | 72 / 1.05 | 44 / 1.1 | grosser Hero (sparsam) |

**Letter-Spacing:** Headings `-0.02em`, Overlines `+0.16em uppercase`, Body `0`.

### Spacing

```css
--container-max:    1200px;
--container-pad:    32px;     /* Mobile 24px */
--section-y:        120px;
--section-y-mobile: 72px;
--card-pad-x:       28px;
--card-pad-y:       32px;
```

**Recipe-Override:** Spacing-Skala kann pro Recipe um Faktor `0.85` (kompakt: Anwalt) oder `1.15` (luftig: Coach) variieren. Auto-Decision aus Branchen-Default-Tabelle.

### Borders + Shapes

| Token | Wert |
|---|---|
| `--radius-sm` | 6px |
| `--radius-md` | 8px |
| `--radius-lg` | 12px |
| `--border-w` | 1px |

**Schatten sparsam** — nur auf Hover-Lift, sonst keine.

```css
--shadow-hover: 0 4px 16px rgba(14, 19, 32, 0.08);
```

### Foto-Behandlung

```
filter:        saturate(0.95) contrast(1.02)
aspect-ratio:  4/3 (Hero), 1/1 (Team), 16/9 (Galerie)
```

Subtile Saturation. Stockfoto-Whitelist branchengerecht (Anwalt: nuechtern, Coach: lebendig). Kein Grayscale-Default.

### Animation

```css
--ease-default:   cubic-bezier(0.16, 1, 0.3, 1);
--motion-default: 220ms;
```

**Charakter:** subtle. Hover = `translateY(-1px)` + Shadow-Fade. Stagger NUR fuer Card-Listen (40ms-Versatz). Keine Parallax. `prefers-reduced-motion` respektieren.

### Recipe-Overrides

- `--accent` (Primary) — pro Recipe ueber Logo-Extraktion + User-Wahl
- Spacing-Faktor (0.85 kompakt / 1.0 default / 1.15 luftig) — pro Recipe-Branchen-Default
- Heading-Schriftgrosse (Faktor 0.9–1.1) — pro Recipe
- Hero-Variante (text-led / split / photo-led) — Auto-Decision aus Foto-Verfuegbarkeit

---

## Theme 2 — Edel

### Identitaet

**Magazine-Premium.** Display-Serif italic, generoes, narrativ, ruhige Farbe. Italic-Akzente fuer Statement-Worte. Asymmetrische Layouts. Cremepapier statt Weiss. Keine Rundungen — Editorial-Disziplin.

**Inspiration:** cpg.at, The Gentlewoman, Kinfolk, Komi.

**Anker:** [`public/mockup-themes-v2.html`](../../public/mockup-themes-v2.html) (Switcher → "Edel"). Architektur vom Beta-Template `.stil-elegant` übernommen, umbenannt zu Edel. Heading-Font Cormorant Garamond (vom Beta) statt Playfair Display — Cormorant wirkt dezenter, passt für Premium-KMU. Akzent Old-Gold `#a87b3f` als Default, recipe-überschreibbar (siehe Beispiele unten). Magazine-Mockup `_archive/mockup-stil-editorial-light.html` (Restaurant Mira) verworfen.

**Zielgruppe:** Premium-Restaurants, Boutique-Hotels, Premium-Tourismus, Premium-Handel (Boutique), Premium-Kosmetik, Premium-Agrar (Weingueter, Edelbrenner), Kultur-Editorial, Premium-Handwerk (Goldschmied), Premium-Dienstleistung (Architekt-Premium, Designagentur).

### Farben

| Token | Wert | Use |
|---|---|---|
| `--surface` | `#f4f2ef` | Body — Cremepapier |
| `--surface-alt` | `#ebe7df` | Section-Wechsel |
| `--surface-inverted` | `#1a1a1a` | Dark-Sections (Hero + Footer haeufig) |
| `--text` | `#2a2a2a` | Body |
| `--text-muted` | `#7a7a7a` | Sub-Texte |
| `--accent` | `#5b9bb3` | Petrol — Default (recipe-ueberschreibbar) |
| `--accent-soft` | `#7eb3c7` | heller Variant fuer Dark-Sections |
| `--border` | `#d8d2c8` | Hairlines |
| `--border-dark` | `rgba(255, 255, 255, 0.12)` | Hairlines auf Dark |

**Recipe-Override Beispiele:**
- Restaurant Editorial → Petrol `#5b9bb3` (Default)
- Wein/Edelbrenner → Burgund `#7a2c2c`
- Boutique-Hotel → Old-Gold `#a08456`
- Kultur-Editorial → Bronze `#8b6f47`
- Goldschmied → Anthrazit-Gold `#665338`

### Typografie

```css
--font-heading: 'Playfair Display', 'GT Sectra', Georgia, serif;
--font-body:    'DM Sans', system-ui, sans-serif;
--font-mono:    'JetBrains Mono', monospace;
```

Display-Serif **mit Italic-Stunts** ist Edel-Markenzeichen. Italic fuer Akzent-Worte (`<em>`), Heavy 900 fuer betonte Worte (`<strong>`).

| Token | Desktop | Mobile | Use |
|---|---|---|---|
| `--text-xs` | 11 / 1.5 | 11 / 1.5 | Overlines (uppercase, letter-spacing 0.22em) |
| `--text-sm` | 14 / 1.6 | 13 / 1.6 | Captions, Meta |
| `--text-base` | 17 / 1.65 | 16 / 1.65 | Body |
| `--text-lg` | 21 / 1.5 | 19 / 1.5 | Pull-Quotes, Hero-Sub |
| `--text-xl` | 38 / 1.15 | 28 / 1.2 | Section-Heads |
| `--text-2xl` | 68 / 1.05 | 42 / 1.1 | H2 |
| `--text-3xl` | 112 / 1 | 64 / 1 | Hero-Statement (Display-Italic) |

**Letter-Spacing:** Headings `-0.012em`, Overlines `+0.22em`.

### Spacing

```css
--container-max:    1280px;
--container-pad:    40px;
--section-y:        160px;
--section-y-mobile: 90px;
--card-pad-x:       40px;
--card-pad-y:       48px;
```

Edel = die luftigste Skala. 160px Section-Spacing bewusst — gibt der Italic-Display-Headline Buehne.

### Borders + Shapes

| Token | Wert |
|---|---|
| `--radius-sm` | 0px |
| `--radius-md` | 0px |
| `--radius-lg` | 0px |
| `--border-w` | 1px |

**Keine Schatten.** Tiefe entsteht durch Surface-Wechsel + Hairlines, nicht durch Schatten.

### Foto-Behandlung

```
filter (default):  saturate(0.85) contrast(1.02)
filter (team):     saturate(0.85) grayscale(0.18)
aspect-ratio:      3/4 (Hero portrait), 4/5 (Team), Magazine-Asymmetrie 12-spaltig (Galerie)
```

Bewusst leicht entsaettigt — wirkt redaktionell. Magazine-Galerie statt Symmetric-Grid.

### Animation

```css
--ease-default:   cubic-bezier(0.16, 1, 0.3, 1);
--motion-default: 350ms;
--motion-slow:    600ms;
```

**Charakter:** expressive, slow. Speise-Liste-Hover = `padding-left: 12px` + 350ms. Cross-Fade zwischen Sections. Pull-Quote-Reveal mit Scroll-Stagger. Italic-Akzente animieren NICHT (statisch lesbarer).

### Recipe-Overrides

- `--accent` — pro Recipe (Beispiele oben)
- Heading-Font Alternativen erlaubt: GT Sectra, Cormorant Garamond, Frank Ruhl Libre — wenn Playfair zu generisch wirkt
- `--surface` Tinten-Varianten: bei sehr dunklen Recipes auf `#1a1a1a` invertierbar (volle Dark-Site)

---

## Theme 3 — Rustikal

### Identitaet

**Warm-handgemacht.** Sturdy-Serif italic, Cremehintergrund, Burgund + Warmgold, Noise-Filter, oesterreichisch-traditionell. Italic-Akzente fuer Marken-Namen + Hand-Geschriebenes.

**Inspiration:** historische Wirtshaus-Schilder, Werkstatt-Visitenkarten, oesterreichische Verlags-Druckwerke.

**Anker:** [`public/mockup-themes-v2.html`](../../public/mockup-themes-v2.html) (Switcher → "Rustikal"). Architektur vom Beta-Template (Vollbild-Color-Hero, Sektions-Sprache) übernommen, neue Stil-Variation eingeführt: Unna-Serif Headings, Burgund-Primary, Warmgold-Akzent in Italic-Stunts (`<em>` in H1/H2), dezenter Noise-Filter im Hero + CTA-Block. Voll-eigenständiges Werkstatt-Mockup `_archive/mockup-stil-handwerklich.html` verworfen.

**Zielgruppe:** Handwerk-Werkstatt (Tischler, Schmied, Schuster, Drechsler), Gastro-Wirtshaus, Agrar-Klassisch (Bauernhof, Imker, kleine Brauerei), Tourismus-Klassisch wenn rural (Berghuette, Almhuette, Pension am Land — pro Recipe pruefen).

### Farben

| Token | Wert | Use |
|---|---|---|
| `--surface` | `#f5f1e8` | Body — Cream |
| `--surface-alt` | `#ede5d4` | Section-Wechsel |
| `--surface-inverted` | `#2c241a` | Dark-Sections, Footer |
| `--text` | `#2c241a` | Body |
| `--text-muted` | `#6b5d4a` | Sub-Texte |
| `--accent` | `#7a3528` | Burgund — Primary |
| `--accent-warm` | `#c9904a` | Warmgold — Secondary, fuer Italic-Akzente |
| `--border` | `#c9bba3` | Hairlines |
| `--border-strong` | `#2c241a` | Foto-Frames, Section-Trenner |

**Recipe-Override-Range:** `--accent` darf in warm-erdiges Spektrum variieren — Tannengruen `#3a4f2c` (Bauernhof), Burgund `#7a3528` (Werkstatt-Default), Anthrazit-Holz `#3a342b` (Berghuette). Kein vibrantes Rosa/Tuerkis erlaubt.

### Typografie

```css
--font-heading: 'Unna', Georgia, serif;
--font-body:    'Inter', system-ui, sans-serif;
--font-mono:    'JetBrains Mono', monospace;
```

Unna ist sturdy text-serif mit warmem Charakter, italic stark gestaltet. Italic-Akzente in Headings (`<em>`) fuer Marken-Namen oder hand-Geschriebenes.

| Token | Desktop | Mobile | Use |
|---|---|---|---|
| `--text-xs` | 12 / 1.5 | 11 / 1.5 | Captions, Meta |
| `--text-sm` | 14 / 1.6 | 13 / 1.6 | Form-Hints |
| `--text-base` | 17 / 1.7 | 16 / 1.7 | Body |
| `--text-lg` | 22 / 1.5 | 20 / 1.5 | Pull-Quotes, Hero-Sub |
| `--text-xl` | 32 / 1.2 | 26 / 1.25 | Section-Heads |
| `--text-2xl` | 56 / 1.1 | 38 / 1.15 | H1, Hero |
| `--text-3xl` | 84 / 1.05 | 52 / 1.1 | Hero-Statement (italic-Anteil) |

**Letter-Spacing:** Headings `-0.005em` (Unna vertraegt wenig), Italic-Akzente neutral.

### Spacing

```css
--container-max:    1180px;
--container-pad:    32px;
--section-y:        110px;
--section-y-mobile: 72px;
--card-pad-x:       32px;
--card-pad-y:       36px;
```

Mittlere Skala — luftiger als Klassisch, kompakter als Edel.

### Borders + Shapes

| Token | Wert |
|---|---|
| `--radius-sm` | 0px |
| `--radius-md` | 0px |
| `--radius-lg` | 4px |
| `--border-w` | 1px |
| `--border-w-2` | 1.5px |

**Schatten sparsam** — nur fuer Foto-Frames (subtiler dunkler Schatten, "als wenn das Foto auf Holz liegt").

```css
--shadow-frame: 0 6px 24px rgba(44, 36, 26, 0.18);
```

### Foto-Behandlung

```
filter:         saturate(0.92) contrast(1.04) sepia(0.06)
aspect-ratio:   3/4 (Werkzeug-Detail), 4/3 (Werkstatt-Wide), 1/1 (Team Portrait)
overlay:        body-level Noise-SVG (siehe Mockup) fuer Papier-Anmutung
```

Leicht warmer Sepia-Touch — wirkt "echte Werkstatt-Foto" statt Stock.

### Animation

```css
--ease-default:   cubic-bezier(0.22, 1, 0.36, 1);
--motion-default: 280ms;
```

**Charakter:** mid-tempo, ruhig. Hero-Reveal = fade-up + leichter Slide. Italic-Akzente in Headings reveal mit kurzem Slide-In nach H1. Keine Parallax.

### Recipe-Overrides

- `--accent` — innerhalb erdiges Farbspektrum (siehe oben)
- Italic-Anteil in Hero-Headline — pro Recipe (Werkstatt: Marken-Name italic, Wirtshaus: Speisen-Namen italic, Bauernhof: "vom Hof" italic)
- Noise-Intensitaet — pro Recipe (Werkstatt strong, Wirtshaus mid, Berghuette mild)

---

## Recipe-Mapping (24 Recipes → 3 Themes)

| Berufsgruppe | Look | Theme | Anmerkung |
|---|---|---|---|
| Handwerk | Werkstatt | **Rustikal** | Mockup-Anker vorhanden |
| Handwerk | Bau | Klassisch | Industrie-naehe, navy Akzent |
| Handwerk | Modern | Klassisch | vibrant Akzent (Indigo o.ae.), luftiges Spacing |
| Handwerk | Premium | **Edel** | z.B. Goldschmied |
| Gastro | Wirtshaus | **Rustikal** | warm-traditionell |
| Gastro | Casual | Klassisch | warmer Akzent (Terra, Old-Gold) |
| Gastro | Editorial | **Edel** | Mockup-Anker vorhanden |
| Gesundheit | Praxis | Klassisch | medical-blue Akzent, kompakt |
| Dienstleistung | Klassisch | Klassisch | navy/anthrazit, kompakt |
| Dienstleistung | Modern | Klassisch | vibrant Akzent, luftig |
| Dienstleistung | Premium | **Edel** | z.B. Architekt-Premium |
| Bildung | Klassisch | Klassisch | navy/anthrazit |
| Bildung | Modern | Klassisch | vibrant Akzent |
| Tourismus | Klassisch | siehe Anmerkung | Stadt-Hotel = Klassisch / Berghuette = **Rustikal** — pro Recipe pruefen |
| Tourismus | Editorial-Premium | **Edel** | Boutique-Hotel |
| Handel | Klassisch | Klassisch | |
| Handel | Boutique-Premium | **Edel** | |
| Mobilitaet | Funktional | Klassisch | technisch + neutral |
| Agrar | Klassisch | **Rustikal** | Bauernhof, Imker |
| Agrar | Premium | siehe Anmerkung | Wein/Edelbrenner = **Edel** / Bio-Hof-Premium = **Rustikal** — pro Recipe pruefen |
| Industrie | Technisch | Klassisch | |
| Kosmetik | Modern | Klassisch | vibrant Akzent (Rose, Korallenrot) |
| Kosmetik | Premium | **Edel** | |
| Kultur | Modern | Klassisch | vibrant Akzent |
| Kultur | Editorial | **Edel** | |

**Verteilung:**
- **Klassisch** ≈ 14 Recipes (Workhorse — von Anwalt bis Coach)
- **Edel** ≈ 8 Recipes (alle Premium/Editorial-Looks)
- **Rustikal** ≈ 3 Recipes + 2 ambigue Faelle (Tourismus-Klassisch, Agrar-Premium)

---

## Mockup-Status

| Theme | Mockup | Datei |
|---|---|---|
| **3-Theme-Switcher v2** | `[VORHANDEN]` | [`public/mockup-themes-v2.html`](../../public/mockup-themes-v2.html) — Switcher Klassisch/Edel/Rustikal auf Beta-Template-Basis |
| Klassisch v2 (im Switcher) | `[VORHANDEN]` | siehe oben — Demo Bauer Architektur |
| Edel v2 (im Switcher) | `[VORHANDEN]` | siehe oben |
| Rustikal v2 (im Switcher) | `[VORHANDEN]` | siehe oben |

**Verworfene v2-Studien** (waren zu weit weg vom Beta-Template-Charakter): `_archive/mockup-stil-editorial-light.html`, `_archive/mockup-stil-handwerklich.html`, `_archive/mockup-stile-vergleich.html`. Bleiben als Referenz, dürfen ignoriert werden.

**Polish-Pass 2026-05-06** — Mockup ist fertig als Token/Stil-Anschauung. Theme-spezifische Verfeinerungen:
- **Klassisch**: Merriweather Serif, Navy + Indigo, Hairline-Cards, Pattern-Overlays (Architektur-Linien-Grid auf Bild-Slots), JetBrains Mono Tabular für Stats
- **Edel**: Cormorant Garamond, asymmetrische Section-Heads (200px-Eyebrow-Spalte + 1fr-Headline), Magazine-Pull-Quote-Sektion zwischen Leistungen und Ablauf, Display-Italic-Numbers in Stats und Leistungs-Items, Old-Gold Akzentlinien
- **Rustikal**: Unna Serif Italic, Burgund + Warmgold, "Wien · 2008 · 17 Jahre"-Stempel bei Über-Stats, Photo-Frame-Style (8px white border + warm shadow) für Galerie + Team-Avatare, italic-Akzent "*Bauer*" Architektur in Nav + Footer, sichtbarer Noise-Filter im Hero + CTA
- Galerie nutzt Picsum-Bilder als Foto-Placeholder (Live-Bau: echte Kunden-Fotos)

**Live-Bau-Bridge:** Diese Mockup-CSS-Variationen müssen ins `template.js` übersetzt werden — zusätzliche Stil-Klassen `.stil-edel` (ersetzt/ergänzt `.stil-elegant`) und `.stil-rustikal` (neu). Klassen-Namen sind bereits Beta-konform (.leist-list, .galerie-grid, .faq-list etc.).

**Theme-Anker:** [`public/mockup-themes-v2.html`](../../public/mockup-themes-v2.html) — Switcher Klassisch/Edel/Rustikal mit Demo Bauer Architektur. Validiert die 3 Theme-Token-Sets visuell.

**Recipe-Konfiguration für Live-Bau:** [`recipe-konfiguration.md`](recipe-konfiguration.md) — pragmatische Tabelle für 24 Recipes (alle 12 Berufsgruppen × Look-Varianten) auf Beta-Template-Basis. Kein Custom-Mockup pro Recipe — sondern Komposition aus bestehenden Beta-CSS-Klassen (`.leist-list/.leist-item` vs `.leist-more`, `.bew-grid` vs `.bew-quote` vs `.bew-list`, etc.) plus Section-Reihenfolge + Stil-Default + Akzentfarbe pro Recipe.

**Verworfene Mockup-Studien** (in `public/_archive/`): Recipe-Mockups die eigene Sektionen erfunden haben (Werkstücke-Tabelle, Vorher-Nachher-Slider, Hero-Sigel etc.) — nicht SiteReady-Generator-tauglich.

---

## Offene Punkte (vor Live-Bau zu klaeren)

1. **Klassisch-Mockup v2** — bestehendes Template-`stil-klassisch` als Basis, Spacing-Override-System (0.85 / 1.15) validieren. **Frage offen 2026-05-06:** Merriweather Serif (heute) vs. DM Sans (themes.md v2) — User-Bias DM Sans, aber nicht final
2. **Tourismus-Klassisch** — pro Recipe entscheiden Klassisch vs. Rustikal (Stadt-Hotel vs. Berghuette)
3. **Agrar-Premium** — pro Recipe entscheiden Edel vs. Rustikal (Wein vs. Bio-Hof)
4. **Section-Library** wie reagiert auf 3 Themes — Block 9 in DESIGN-VISION.md
5. **Beta-Live-Daten** zu Stil-Verteilung (Datenluecke, Supabase-Query bei Bedarf)
6. **Markennamen-Italic-Konvention** in Edel + Rustikal — wie wird `<em>` semantisch in Generated-Content gesetzt? Engine-Decision

---

## Verbindung zu anderen Dokumenten

- [`DESIGN-VISION.md`](../DESIGN-VISION.md) Block 8 — Anchor-Doku
- [`RECIPE-SYSTEM.md`](../RECIPE-SYSTEM.md) — Theme-Mapping wird auf Basis dieser Doku aktualisiert
- [`BRAND.md`](../BRAND.md) § 9.4 — Plattform vs. Kundenseiten Abgrenzung
- [`design-system-notes.md`](design-system-notes.md) — Plattform-Tokens (NICHT teilen)

---

*Living Document. Pflegen bei Theme-Aenderungen.*
