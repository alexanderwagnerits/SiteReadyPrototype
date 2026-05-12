# Brand Guide — instantpage.at

> Markenrichtlinie fuer das Live-Produkt unter instantpage.at. Verbindlich fuer alle Marketing-Outputs, Plattform-UI, Sales-Material und externe Kommunikation.

**Stand:** 2026-05-05 — `[FERTIG]`. Alle Brand-Entscheidungen getroffen. Live-Logo eingebunden. Asset-Set vor Live-Schaltung noch zu vervollstaendigen (siehe § 2.4).

---

## Inhalt

1. [Brand-Identitaet](#1-brand-identitaet)
2. [Logo + Wortmarke](#2-logo--wortmarke)
3. [Farbpalette](#3-farbpalette)
4. [Typografie](#4-typografie)
5. [Voice & Tone](#5-voice--tone)
6. [Anrede-Regeln](#6-anrede-regeln)
7. [Slogans + Marketing-Texte](#7-slogans--marketing-texte)
8. [Verbotene Begriffe (UWG)](#8-verbotene-begriffe-uwg)
9. [Visuelle Sprache (Plattform-UI)](#9-visuelle-sprache-plattform-ui)

---

## 1. Brand-Identitaet

**Name:** instantpage.at
**Rechtstraeger:** Wagner IT-Solutions e.U. (FN 609574h, HG Wien, gegruendet 03.08.2023)
**Sitz:** 1220 Wien, Oesterreich
**Inhaber:** Alexander Wagner

**Brand-Wechsel-Hintergrund:**
Der Beta-Prototyp lief unter "SiteReady" (Domain `sitereadyprototype.pages.dev`). Mit dem Live-Bau erfolgt sauberer Schnitt: neue Brand **instantpage.at**, neue Domain (bereits gesichert), neuer Repo, keine Daten-Migration. Beta-Tester werden per Mail informiert + bekommen Promo-Code fuer Live-Plattform.

**Markenkern:**
> Wir liefern Websites als Service — fertig konfiguriert, branchen-tauglich, mit allen rechtlichen Pflichtangaben. Kein Builder, keine Design-Entscheidungen fuer den Kunden.

**Brand-Versprechen in einem Satz:**
> Sie sagen uns, wer Sie sind und was Sie machen. Wir liefern die Website, die zu Ihrer Branche passt.

**Was die Brand bewusst NICHT ist:**
- Kein Website-Builder (keine Drag-and-Drop-UI)
- Kein generisches Template-Tool (jede Berufsgruppe hat eigene kuratierte Vorlage)
- Kein Marketing-Vehikel fuer Tech-Stack (KI/AI bleibt Black Box)
- Keine Editorial-Plattform fuer Kuenstler/Influencer (Linktree/Komi-Segment ausgenommen)

---

## 2. Logo + Wortmarke

### 2.1 Assets

| Asset | Pfad / Status |
|---|---|
| **Live-Logo (kombiniert iP + Wortmarke)** | [`public/instantpage-logo.png`](../public/instantpage-logo.png) — schwarz auf transparent, ~1200×300 px |
| Icon-Only "iP" Monogramm | `[FEHLT]` — fuer Favicon, Mobile-Burger, Social-Sharing produzieren |
| SVG-Version Wortmarke | `[FEHLT]` — fuer skalierbare Verwendung (Header, Print) produzieren |
| Monochrom weiss (fuer dunkle Hintergruende) | `[FEHLT]` — produzieren |
| Beta-Altbestand | `[ENTFERNT]` 2026-05-05 — `public/logo.png` + `public/icon.png` (SiteReady) sind raus, Live-Logo ist Source-of-Truth |

### 2.2 Brand-Schreibweise

**Pflicht:** "instantpage.at" — **alles klein**, ".at"-Suffix gehoert zur Wortmarke.

| Form | Erlaubt | Verwendung |
|---|---|---|
| `instantpage.at` | ✓ Default | alle Marketing-/UI-/Mail-Texte |
| `instantpage` | ✓ ausnahmsweise | wenn TLD aus Kontext klar (z.B. "Im instantpage-Portal...") |
| `Instantpage` | ✗ | nie |
| `Instant Page` | ✗ | nie |
| `INSTANTPAGE.AT` | ✗ | nie (auch nicht in Headlines) |
| `iP` (Monogramm allein) | ✓ nur als Logo-Element | nicht im Fliesstext |

### 2.3 Verwendungsregeln

| Regel | Wert |
|---|---|
| Mindest-Schutzabstand zu anderen Elementen | 1× Hoehe des "i"-Buchstabens rundherum |
| Mindest-Hoehe Wortmarke (Screen) | 24 px |
| Mindest-Hoehe Monogramm-Only (Screen) | 32 px |
| Mindest-Hoehe Wortmarke (Print) | 8 mm |
| Hintergrund-Kontrast | min. 4.5:1 (WCAG AA) |
| Monochrom-Versionen | schwarz auf hell (default), weiss auf dunkel |
| Nicht erlaubt | drehen, verzerren, Effekte (Schatten, Outline, Glow), in Bildmotive ohne Schutzflaeche einbetten, Farbverlaeufe, Akzentfarbe einfaerben |

### 2.4 Asset-To-Do (vor Live-Schaltung)

- `[OFFEN]` SVG-Version Wortmarke + Monogramm (skalierbar fuer Header)
- `[OFFEN]` Icon-Only "iP" als separates PNG (mehrere Groessen: 32, 64, 128, 256, 512)
- `[OFFEN]` Favicon-Set (16, 32, 48, 96, 192, 512 + favicon.ico)
- `[OFFEN]` Apple-Touch-Icon 180×180
- `[OFFEN]` Open-Graph-Image 1200×630 (mit Wortmarke + Slogan)
- `[OFFEN]` Monochrom-weiss-Versionen
- `[ERLEDIGT 2026-05-05]` Beta-Logos `public/logo.png` + `public/icon.png` entfernt

---

## 3. Farbpalette

### 3.1 Plattform (instantpage.at — Marketing + Portal)

`[ENTSCHIEDEN]` 2026-05-05 — Greenfield-Set aus `docs/_design/system-preview/tokens.css`. Sehr ruhig, neutral, Anthrazit/Cremeweiss-Basis mit *einer* dezenten Akzentfarbe. Keine Pastelle, kein Knallpink, kein Web3-Gradient.

| Token | Hex | Verwendung |
|---|---|---|
| `--color-bg` | `#FAFAF7` | Page-Background, leicht warm |
| `--color-surface` | `#FFFFFF` | Cards, Modals, primaere Flaechen |
| `--color-surface-muted` | `#F4F2EE` | Subtle Sections, alternate Background |
| `--color-border` | `#E8E5DF` | Hairline-Borders |
| `--color-text` | `#1A1A1A` | Primaer-Text, hoher Kontrast |
| `--color-text-muted` | `#5C5C5C` | Sub-Headlines, Body |
| `--color-text-subtle` | `#8A8A8A` | Captions, Hints |
| `--color-accent` | `#2D4A3E` | **Tannengruen** — primaer-CTA, Highlights `[ENTSCHIEDEN]` |
| `--color-accent-hover` | `#1F362C` | Hover-State Akzent |
| `--color-accent-soft` | `#E8EDE9` | Subtle Backgrounds, Tags |
| `--color-success` | `#2E7D5C` | Erfolgsmeldungen |
| `--color-warning` | `#B8730A` | Warnhinweise |
| `--color-error` | `#B83A3A` | Fehlermeldungen |
| `--color-info` | `#3A6FB8` | Info-Hinweise |

**Akzent-Entscheidung 2026-05-05:** **Tannengruen `#2D4A3E`** — defensiv, Trust-Konnotation, AT-Bezug, kein generischer SaaS-Lila.

Verworfene Alternativen (dokumentiert fuer spaetere Re-Evaluation): Burgundy `#7A2E3F` (gediegen-editorial), Dezenter Indigo `#3D4A7A` (Stripe-aehnlich), Olive-Gold `#8A7A2E` (kanzlei-warm).

→ Phase 0 Live-Bau: shadcn/ui-Theme darauf abbilden.

### 3.2 Kundenseiten

→ siehe [`RECIPE-SYSTEM.md`](RECIPE-SYSTEM.md) "Theme-Tokens pro Look". Pro Recipe eigene Palette + benutzerwaehlbarer Akzent. **Strikt getrennt** von Plattform-Palette — Kundenseiten duerfen NIE wie die Plattform aussehen.

---

## 4. Typografie

### 4.1 Plattform (instantpage.at)

**Primaer:** **Poppins** (Google Fonts) `[ENTSCHIEDEN 2026-05-12]` — runder, freundlicher-zugaenglicher Geometric-Sans, KMU-tauglich. Ersetzt frueheren DM-Sans-Vorschlag (2026-05-05), der zu „technisch-neutral" wirkte.
**Mono fuer Zahlen / Code / Preise:** JetBrains Mono (Google Fonts).
**Kein Editorial-Serif** `[ENTSCHIEDEN]` 2026-05-05 — konsequent sans-serif. Vermeidet Kollision mit „kein generisches Claude-Aesthetic"-Anti-Pattern.

**Implikation:** Alle Plattform-Touchpoints (Marketing-Website, LinkedIn-Banner, OG-Images, Visitenkarten, Pitch-Decks) auf Poppins umstellen. Kunden-Recipe-Sites behalten ihre eigene Recipe-Font-Wahl (Plus Jakarta Sans / Space Grotesk / Cormorant Garamond etc., siehe `RECIPE-SYSTEM.md`).

**Type Scale (5 Stufen):**

| Stufe | px / rem | Verwendung |
|---|---|---|
| display | 56 / 3.5 | Hero-Headlines |
| h1 | 40 / 2.5 | Section-Headlines |
| h2 | 28 / 1.75 | Sub-Sections |
| h3 | 20 / 1.25 | Card-Titles |
| body | 16 / 1 | Fliesstext |
| small | 14 / 0.875 | Captions, Footer-Texte |

**Weights:** Regular 400, Medium 500, Semibold 600, Bold 700 (sparsam).
**Line-Heights:** tight 1.15 (Display/H1), snug 1.35 (H2/H3), normal 1.55 (Body).

### 4.2 Kundenseiten

→ siehe [`RECIPE-SYSTEM.md`](RECIPE-SYSTEM.md) — pro Recipe eigene Font-Wahl (Inter, Plus Jakarta Sans, etc.). 20 Google Fonts im Custom-Pool (laut CLAUDE.md).

---

## 5. Voice & Tone

### 5.1 Grundhaltung

Sachlich, nuechtern, oesterreichisch. Trust durch Klarheit, nicht durch Marketing-Hype. Wir sprechen mit KMU-Inhabern (35-65 Jahre), die weder design- noch tech-affin sind und pragmatische Loesungen wollen.

### 5.2 Konventionen

| Konvention | Regel | Quelle |
|---|---|---|
| **Anrede gegenueber Plattform-Kunden** | "Sie" — ausnahmslos auf Marketing-Site, im Portal, in Mails | B2B-Standard AT |
| **Anrede gegenueber Endkunden auf generierten Sites** | Pyramide (siehe § 6) — Sie / Du je nach Branche und Import-Detection | RECIPE-SYSTEM |
| **Echte Umlaute** | ae, oe, ue, ss — nicht Unicode-Escapes, nicht ae/oe/ue | CLAUDE.md global |
| **Code/UI-Identifier** | nur ASCII (Variablen, Keys, URL-Slugs) — Umlaute nur in deutschen UI-Texten und Kommentaren | CLAUDE.md projekt |
| **KI-Erwaehnung** | gegenueber Endkunden (Kundensite-Besucher) wird KI nicht erwaehnt — Service wirkt als Black Box. Gegenueber Plattform-Kunden (KMU im Portal) Transparenz wo AI-Act-relevant | `_archive/PROJECT-STAND-MAERZ-2026.md` + AI-Act 2.8.2026 |
| **AI-Act-Kennzeichnung** | Footer-Hinweis auf Kundensites ab 02.08.2026: "Texte automatisiert erstellt" oder aehnlich | LIVE-COMPLIANCE § 13 |

### 5.3 Do / Don't

| Do | Don't |
|---|---|
| "Impressum + Datenschutzerklaerung automatisch" | "100 % rechtssicher" |
| "fertig konfiguriert" | "garantiert fehlerfrei" |
| "in wenigen Minuten startklar" | "in 5 Minuten online" (Versprechen) |
| "speziell fuer oesterreichische KMU" | "die beste Plattform Oesterreichs" |
| "automatisch", "auf Knopfdruck", "ohne Agentur" | "KI-Builder", "AI-powered", "smart" |
| "Wir liefern Ihre Website" | "Erstellen Sie Ihre Website" (impliziert Builder-Selbstbau) |
| "Branchengerecht", "kuratiert" | "fuer alle Berufe" (zu generisch) |
| "Sie bleiben Inhaber" | "Sie haben volle Kontrolle" (impliziert Builder) |
| "transparent abgerechnet" | "guenstigster Anbieter" (vergleichend, UWG) |
| "auf oesterreichische Standards abgestimmt" | "europaweit fuehrend" |

### 5.4 Tonalitaet pro Touchpoint

| Touchpoint | Ton |
|---|---|
| Marketing-Landing | sachlich-zugewandt, ruhig, Trust durch Klarheit |
| Pricing-Page | nuechtern, faktisch, Vergleichstabelle ohne Hype |
| Self-Service-Portal | KMU-Sprache (kein Tech-Jargon), kontextuelle Hilfestellung, Diagnose-orientiert |
| Lifecycle-Mails (Trial, Reminder, Cancellation) | freundlich, knapp, ohne Marketing-Drueckerei |
| Support-Mails | persoenlich, loesungsorientiert, oesterreichische Hoeflichkeit |
| Wissensdatenbank | praktisch, screenshots, KMU-tauglich |
| Generierte Endkunden-Inhalte | branchengerecht (Anwalt foermlich, Yoga-Studio nahbar) |

→ vollstaendige Lifecycle-Mail-Templates in `OPERATIONS.md` § 2 (kommt nach BRAND).

---

## 6. Anrede-Regeln

### 6.1 Gegenueber Plattform-Kunden (instantpage.at)

**Immer "Sie".** Marketing-Landing, Pricing, Portal-UI, Mails, Support. Keine Ausnahmen. B2B-Standard in AT.

### 6.2 Gegenueber Endkunden auf generierten Kundensites

**Pyramide** (Quelle: RECIPE-SYSTEM Anrede-Logik):

1. **Wenn Website importiert wurde:** aus Import-Text erkennen (Claude detektiert Sie/Du)
2. **Sonst Branchen-Default:**
   - **Sie:** Anwalt, Notar, Steuerberater, Arzt, Zahnarzt, Apotheke, Versicherungsmakler, Architekt, Banken, Handwerker (foermlich), Industrie
   - **Du:** Yoga-Studio, Coach, Personal Trainer, Tattoo-Studio, Friseur (junges Segment), kreative Kuenstler
   - **Sie als Default fuer Rest** (sicherer AT-Standard) — wenn Branche nicht eindeutig zuordenbar
3. **Im Portal jederzeit ueberschreibbar** vom KMU-Inhaber (loest Re-Generation aus, Warnung "Texte werden neu generiert")

### 6.3 Anrede-Override-Mechanik

Im Portal-Settings kann der Inhaber wechseln:
- "Sie" (foermlich)
- "Du" (locker)

Aenderung loest **automatische Re-Generation** der Texte aus (PRODUCT § 3.3). Warnung vorher: *"Texte werden neu generiert — vorhandene Anpassungen gehen verloren."*

---

## 7. Slogans + Marketing-Texte

### 7.0 Universal-Tagline + About (Cross-Channel) `[LOCK 2026-05-12]`

**Verwendung:** Single-Source-of-Truth fuer alle Cross-Channel-Auftritte (LinkedIn, X-Bio, OG-Tags, Google Business Profile, Visitenkarten, Pitch-Slide-Footer). Brand-Voice ist Editorial-ruhig (passt zu Recipe-Mockup-Sprache „Massivholz aus dem Mostviertel. Seit 1958.").

**Tagline (≤120 chars, primaer):**

> Die Website fuer oesterreichische KMU. 10 Minuten Aufwand.

**About / Beschreibung (≤300 chars, LinkedIn About, Google Business, OG-Description):**

> Die fertige Website fuer oesterreichische KMU.
>
> Statt Wochen mit der Agentur oder Abenden vor dem Baukasten: 10 Minuten Fragebogen, fertig konfigurierte Webseite. KI-gestuetzte Texte, AT-Compliance integriert, fuer Google optimiert.

**Design-Entscheidungen:**

- **„KMU"** (nicht „KMUs") — formell, Plural ist im Begriff enthalten
- **„10 Minuten Aufwand"** statt „in 10 Minuten online" — Aufwand-Framing trifft den realen Zeitschmerz, UWG-safer als Garantie-Zeitversprechen (Zeit-bis-live ist DNS-abhaengig)
- **„KI-gestuetzte Texte"** drin — als Mechanismus-Erklaerung (warum 10 Min realistisch sind), nicht als Tagline-Buzzword
- **„AT-Compliance integriert"** — knapp, B2B-tauglich. KMU-naehere Variante „mit Impressum und Datenschutz" als Fallback fuer laengere Texte / nicht-Tech-Audiences
- **„Fuer Google optimiert"** (verwendet) statt „SEO-optimiert" — KMU-verstaendlicher als Buzzword „SEO". Marketing-Variante zulaessig, **Anwalts-Audit-Punkt fuer Live-Launch:** „optimiert" Grenzbereich UWG (kann als Garantie-Aussage gelesen werden), Defensiv-Alternative waere „fuer Google vorbereitet". Final-Entscheidung im Anwalts-Block A der Roadmap.
- **Keine Berufsgruppen-Liste** in Hauptbotschaft — wuerde Exklusivitaet implizieren bei 14 Berufsgruppen × 2-3 Looks = ~32 Recipes (siehe Memory `feedback_marketing_zielgruppe_inklusiv.md`)
- **„Made in Vienna"** verworfen — AT-Anker bereits ueber „oesterreichische KMU" gesetzt, redundant; signature-style Trailer schwaecht das About-Statement
- **Niemals** „rechtliche Pflichten" / „Pflichtangaben" im Marketing — buerokratischer Nag-Vibe (siehe Memory `feedback_keine_rechtliche_pflichten.md`)

**Konflikt zu § 7.2 (Hero-Headline):** Die alte Hero-Headline „Premium-Website. Fertig konfiguriert. Sofort online." klingt nach dem Tagline-Lock 2026-05-12 Werbe-laut + „Premium" ist Mismatch zur Pricing-Realitaet (16-29 €/Mo). Vor Live-Launch entscheiden: ersetzen durch substanziellere Hero-Headline oder bewusst hero-only-Variante.

### 7.1 Slogan-Pool (defensive Wording, UWG-konform)

Aus LIVE-COMPLIANCE § 15 + erweitert:

| # | Slogan | Verwendung |
|---|---|---|
| 1 | **Premium-Website fuer oesterreichische KMU — fertig konfiguriert, branchen-tauglich** | Marketing-Hero (Default-Vorschlag) |
| 2 | **Marketing-Website ohne Agentur. Speziell fuer Handwerker, Gastronomen, Berater, Praxen.** | Hero-Alternative, klares Zielgruppen-Statement |
| 3 | **Wir bauen Ihre Website. Sie bleiben Inhaber.** | Trust-Block, Anti-Builder-Positionierung |
| 4 | **Schneller online. Professionell betrieben. Transparent abgerechnet.** | Sub-Hero, drei Versprechen |
| 5 | **Branchengerecht. AT-Compliance integriert. Sofort online.** | Pricing-Page-Header *(2026-05-12: „rechtliche Pflichtangaben" durch „AT-Compliance" ersetzt — siehe `feedback_keine_rechtliche_pflichten.md`)* |
| 6 | **Kein Website-Builder. Eine fertige Website.** | Anti-Vergleich zu Wix/Jimdo |
| 7 | **Fuer Betriebe, die ihre Zeit mit dem Geschaeft verbringen — nicht mit Webdesign.** | Mid-Funnel, Pain-Point-Adressierung |

**Pool-Status:** alle 7 Slogans freigegeben `[ENTSCHIEDEN]` 2026-05-05 — pro Touchpoint wird im jeweiligen Bau-Schritt ausgewaehlt.

### 7.2 Hero-Headline `[KONFLIKT 2026-05-12 — vor Live-Launch ueberdenken]`

> **Hinweis:** Diese Headline wurde 2026-05-05 entschieden, steht aber im Konflikt mit der Editorial-Voice aus § 7.0 (Lock 2026-05-12). „Premium" ist Mismatch zur Pricing-Realitaet (16–29 €/Mo) + Werbe-laut. Vor Live-Launch ersetzen oder als bewusste Hero-only-Variante behalten.

**Primaer (`[KONFLIKT]`):** **"Premium-Website. Fertig konfiguriert. Sofort online."** — drei Versprechen in drei kurzen Phrasen, klare Hierarchie, gut zu setzen.

Verworfene Alternativen (dokumentiert): "Ihre Website. Wir liefern. Sie bleiben Inhaber." / "Branchengerechte Websites fuer oesterreichische KMU."

### 7.3 Sub-Headlines (Sekundaer-Statement unter Hero)

> **Hinweis 2026-05-12:** Sub-Headline 1 enthielt „mit allen rechtlichen Pflichtangaben" — im Marketing tabu (siehe `feedback_keine_rechtliche_pflichten.md`). Ersetzt durch „AT-Compliance integriert". Sub-Headline 3 enthaelt Berufsgruppen-Liste — siehe Hinweis unten zu inklusiver Hauptbotschaft.

- "Sie sagen uns, wer Sie sind und was Sie machen. Wir liefern die Website, die zu Ihrer Branche passt — AT-Compliance integriert."
- "Kein Website-Builder. Kein Drag-and-Drop. Eine fertige Website fuer Ihren Betrieb."
- "Speziell fuer Handwerk, Gastro, Praxen, Dienstleister — 14 Berufsgruppen, jede mit eigener kuratierter Vorlage." *(Berufsgruppen-Liste OK in Sub-Headlines mit „u.a."-Charakter, NICHT in Tagline/About — siehe `feedback_marketing_zielgruppe_inklusiv.md`)*

### 7.4 CTA-Wording

| Verwendung | CTA-Text |
|---|---|
| Primaer-CTA Hero | "Website starten" |
| Sekundaer-CTA Hero | "Beispiele ansehen" |
| Pricing Starter | "Starter starten" |
| Pricing Professional | "Professional starten" |
| Pricing Business (Teaser) | "Vormerken" |
| Trial-Reminder-Mail | "Jetzt aktivieren" |
| Cancellation-Win-Back | "Reaktivieren" |

**Was zu vermeiden:** "Jetzt kaufen!", "Sichern Sie sich!", "Nicht verpassen!" — Drueckersprache widerspricht der Brand-Tonalitaet.

---

## 8. Verbotene Begriffe (UWG)

→ vollstaendige Master-Liste in [`LIVE-COMPLIANCE.md` § 15](LIVE-COMPLIANCE.md#15-uwg--werbeaussagen--slogans).

### 8.1 Verbotene Begriffe (Kurzliste)

| Begriff | Warum verboten |
|---|---|
| "rechtssicher" | Garantieaussage nicht haltbar — Kunde bleibt Verantwortlicher |
| "100 % DSGVO-konform" | dto. |
| "abmahnsicher" | dto. |
| "garantiert" (im Compliance-Kontext) | dto. |
| "die beste Plattform" | nicht belegbarer Superlativ |
| "fehlerfrei", "perfekt", "immer aktuell" | nicht haltbare Absolutaussagen |
| Vergleichende Aussagen ggü. Mitbewerbern (Wix, Jimdo, Herold) | UWG § 2 Abs 4 ohne sachliche Grundlage |

### 8.2 Defensive Alternativen

> **Wichtig 2026-05-12:** „rechtliche Pflichten" / „Pflichtangaben" sind **nur** als juristische Defensiv-Sprache (UWG-Audit, AGB/DSE/Impressum-Kontext) verwendbar — **NIEMALS** als Marketing-Hauptbotschaft (Tagline, About, Hero, Pricing-Page). Siehe Memory `feedback_keine_rechtliche_pflichten.md`. Marketing-Alternative: „AT-Compliance integriert" / „mit Impressum und Datenschutz".

| Statt | Besser |
|---|---|
| "rechtssicher" | „wir unterstuetzen Sie bei der Erfuellung Ihrer rechtlichen Pflichten" / „mit allen rechtlichen Pflichtangaben" *(nur juristische Defensiv-Sprache, nicht Marketing — Marketing-Variante: „AT-Compliance integriert")* |
| "DSGVO-konform" | "DSGVO-orientiert" / "Impressum + Datenschutzerklaerung automatisch" / "mit Hilfestellungen zur DSGVO-Umsetzung" |
| "100 % Sicher" | "professionell verschluesselt" / "auf Industriestandard abgesichert" |
| "die beste" | "speziell fuer oesterreichische KMU entwickelt" |
| "garantiert in 5 Minuten" | "in wenigen Minuten startklar" |
| "fehlerfrei" | "qualitaetsgeprueft" / "mit automatischer Quality-Pruefung" |

### 8.3 Audit-Pflicht

Bei jeder neuen Marketing-Veroeffentlichung pruefen:
- Landing-Page-Texte
- Pricing-Texte + Pro-Plan-Beschreibung
- Lead-Magnete (Sichtbarkeits-Check etc.)
- Mail-Templates
- Social-Media-Posts (sofern aktiv)
- Sales-Decks

Verantwortlich: `compliance-reviewer` Subagent (geplant, Memory `project_dev_subagents_idea.md`).

---

## 9. Visuelle Sprache (Plattform-UI)

### 9.1 Aesthetic-Haltung

**Orientierung:** Linear, Stripe, Vercel, Anthropic — minimalistisch, viel Whitespace, klare Typo-Hierarchie, Trust durch Klarheit. Editorial-Komposition, nicht Card-Grid-Standard.

**Strikt vermeiden** (Memory `feedback_claude_design_verworfen.md`):
- Glassmorphism, Neumorphism, Brutalism
- Web3-Gradient, knalliges SaaS-Lila
- "AI-Builder-Aesthetic" mit Sterne-Icons / Sparkles
- Stock-Photo-Hero mit laechelnden Menschen
- Grosse Card-Shadows ueberall
- Symmetrische "zentrierter Titel + zentrierter Button"-Heros
- Generische 3-Spalten-Card-Grids als Default-Section-Pattern
- Serif-Headlines als Default

### 9.2 Komponenten-Konventionen `[PHASE 0 LIVE-BAU]`

| Komponente | Konvention |
|---|---|
| Buttons | 8-12 px Radius, primaer = Akzent-Background, sekundaer = Border-only |
| Cards | Hairline-Borders + Background-Wechsel statt Shadows. Maximal eine Card mit Shadow pro Section |
| Inputs | Borders, kein Hintergrund. Focus-State via Akzent-Border |
| Tabs / Nav | Underline-Indicator, kein Background-Pill |
| Modals | Subtle Shadow, generoeses Padding (32-48 px) |
| Pricing-Cards | Hairline-Border, "Empfohlen"-Badge auf mittlerer Karte erlaubt |

→ Detail-Spec entsteht in Phase 0 mit shadcn/ui-Theme. Visuelle Foundation in [`docs/_design/system-preview/`](_design/system-preview/).

### 9.3 Layout-Prinzipien

- Mobile-First responsive
- Generoeser Whitespace, ruhige Komposition
- Maximal 1 primaerer CTA pro Section
- Vertikaler Rhythmus durch konsistentes Section-Padding
- Asymmetrische Heros bevorzugt
- Editorial-Hierarchie via Typo, nicht via Boxen

### 9.4 Customer-Sites Abgrenzung

Die generierten Kundensites haben **eigene visuelle Sprache pro Recipe** (siehe `RECIPE-SYSTEM.md`). Plattform-Aesthetik ist strikt davon getrennt — Kundensites sollen wie individuelle KMU-Websites wirken, nicht wie SaaS-Templates.

---

## Verbindung zu anderen Dokumenten

- [`RECIPE-SYSTEM.md`](RECIPE-SYSTEM.md) — Theme-Tokens fuer Kundenseiten, Anrede-Pyramide-Source
- [`LIVE-COMPLIANCE.md`](LIVE-COMPLIANCE.md) — UWG-Master-Liste § 15, AI-Act § 13
- [`PRODUCT.md`](PRODUCT.md) — Vision, Pricing-Texte, Tonalitaets-Vorgabe gegenueber Endkunden
- [`DESIGN-VISION.md`](DESIGN-VISION.md) — Marketing-Site-Wireframes, Plattform-Design-System-Detail
- [`OPERATIONS.md`](OPERATIONS.md) — Lifecycle-Mail-Templates (Voice in Mails)
- [`docs/_design/system-preview/`](_design/system-preview/) — Token-Implementierung CSS + HTML-Showcase

## Verbindung zu Memory

- `project_design_references_live.md` — Editorial-Referenzen cpg.at + Komi (fuer Customer-Themes)
- `feedback_portal_design.md` — KMU-Sprache, kein Tech-Jargon
- `feedback_social_dezent.md` — dezente Marketing-Tonalitaet, Mobile-Burger
- `feedback_claude_design_verworfen.md` — Aesthetic-Anti-Patterns
- `project_unternehmensdaten.md` — Stammdaten Wagner IT-Solutions e.U.
- `project_production_refactor.md` — Brand-Wechsel SiteReady → instantpage.at, neuer Repo-Stack

---

## Getroffene Entscheidungen 2026-05-05

| # | Punkt | Entscheidung |
|---|---|---|
| 1 | Akzentfarbe Plattform | **Tannengruen `#2D4A3E`** (siehe § 3.1) |
| 2 | Hero-Headline | **"Premium-Website. Fertig konfiguriert. Sofort online."** (siehe § 7.2) |
| 3 | Slogan-Pool | alle 7 Vorschlaege freigegeben, Auswahl pro Touchpoint im Bau (siehe § 7.1) |
| 4 | Editorial-Serif | **kein Serif** — konsequent sans-serif (siehe § 4.1) |
| 5 | Live-Logo | vorhanden, eingebunden, dokumentiert (siehe § 2.1) |

## Offen — vor Live-Schaltung erledigen (kein BRAND-Blocker)

- Logo-Asset-Set vervollstaendigen: SVG, Icon-Only "iP", Favicon-Set, Apple-Touch-Icon, OG-Image, monochrom-weiss-Versionen (Liste in § 2.4)

**Status BRAND.md:** `[FERTIG]` — bereit als Foundation fuer DESIGN-VISION-Detail, Marketing-Bau und Sales-Material.
