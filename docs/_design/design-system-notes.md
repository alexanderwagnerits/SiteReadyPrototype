# Notes-Text fuer Claude Design "Set up your design system"

Diese Datei enthaelt den fertigen Text fuer das **"Any other notes?"**-Feld im Setup. 1:1 reinkopieren.

---

## Felder im Setup-Formular

| Feld | Was reinkommt |
|---|---|
| **Company name and blurb** | `instantpage.at — fertig konfigurierte KMU-Websites als Service fuer oesterreichische Klein- und Mittelbetriebe. B2B-SaaS, kein Website-Builder.` |
| **Link code on GitHub** | leer lassen — Live-Stack existiert noch nicht, Prototyp-Code waere irrefuehrend |
| **Link code from your computer** | Ordner `docs/_design/system-preview/` draggen — enthaelt `tokens.css` + `index.html` (visueller Showcase). Claude Design parsed beide |
| **Upload .fig file** | leer (haben wir keinen) |
| **Add fonts, logos and assets** | `public/logo.png` + `public/icon.png` hochladen. Fonts NICHT als Datei — sind Google Fonts (DM Sans, JetBrains Mono), in den Notes erwaehnt |
| **Any other notes?** | siehe Block unten — komplett kopieren |

---

## Text fuer "Any other notes?" (kopieren)

```
BRAND
- Name: instantpage.at
- Rechtstraeger: Wagner IT-Solutions e.U. (FN 609574h, HG Wien, Oesterreich)
- Markt: ausschliesslich Oesterreich (Phase 1), spaeter DACH/EU
- Geschaeftsmodell: B2B-SaaS — KMU bestellen, bekommen fertige Website als Service.
  Es ist KEIN Website-Builder. Kunden treffen keine Design-Entscheidungen.

ZIELGRUPPE
- Oesterreichische KMU-Inhaber (35-65), lokale Betriebe.
- 12 Berufsgruppen: Handwerk, Gastro, Gesundheit, Dienstleistung, Bildung,
  Tourismus, Handel, Mobilitaet, Agrar, Industrie, Kosmetik, Kultur.
- Weder design-affin noch tech-affin. Pragmatisch, wollen "fertig + korrekt".

VOICE & TONE
- Sachlich, nuechtern. Kein Marketing-Slang, kein Hype.
- Sie-Anrede als Default (B2B, oesterreichischer Standard).
- Echte deutsche Umlaute (ae, oe, ue, ss). Nicht ae/oe/ue. Nicht Unicode-Escapes.
- KEIN KI-/AI-Buzzword im Vordergrund. Worte wie "automatisch",
  "fertig konfiguriert", "auf Knopfdruck" — nicht "KI-Builder", "AI-powered", "smart".
- Konkret statt blumig. Lieber "Impressum + Datenschutzerklaerung automatisch"
  als "Rechtssicher in Sekunden".
- Oesterreichischer Bezug: "fuer oesterreichische KMU", "AT-Standards", "WKO-konform".

VERBOTENE BEGRIFFE (UWG-Risiko, NIE verwenden)
- "rechtssicher", "100 % DSGVO-konform", "abmahnsicher", "garantiert"
- "die beste Plattform" (nicht-belegbare Superlative)
- vergleichende Aussagen gegen Mitbewerber ohne sachliche Grundlage
- "fehlerfrei", "perfekt", "immer aktuell"

DEFENSIVE ALTERNATIVEN
- statt "rechtssicher" → "mit allen rechtlichen Pflichtangaben"
- statt "DSGVO-konform" → "Impressum + Datenschutzerklaerung automatisch"
- statt "garantiert" → "fertig konfiguriert"

VISUELLE HALTUNG
- Plattform-Aesthetik orientiert an Linear, Stripe, Vercel, Anthropic — minimalistisch,
  viel Whitespace, klare Typo-Hierarchie, Trust durch Klarheit.
- Vermeiden: Glassmorphism, Neumorphism, Brutalism, Web3-Gradient,
  knalliges SaaS-Lila, generische "AI-Builder-Aesthetik" mit Sterne-Icons.
- Vermeiden: Stock-Photo-Hero mit laechelnden Menschen — wirkt SaaS-generisch.
- Tendenz Farbpalette: ruhig, neutral (Anthrazit + Cremeweiss) mit EINER
  dezenten Akzentfarbe. Vorschlaege: Tannengruen, Burgundy, dezenter Indigo,
  Olive-Gold. Keine Pastelle, kein Knallpink.

TYPOGRAPHIE
- Primaer: DM Sans (Google Fonts)
- Mono fuer Zahlen/Code: JetBrains Mono (Google Fonts)
- Hierarchie: 4-5 Stufen statt vieler Mikro-Steps
- Kein Serif-Titel als Default — kann optional als Editorial-Akzent eingesetzt werden,
  ist aber nicht Pflicht

SPACING + SHAPES
- 8-Punkt-Grid fuer Spacing
- Border-Radien moderat: 8-12px (nicht voll abgerundet, nicht eckig)
- Schatten sparsam — eher Borders + leichte Hintergrundfarben fuer Tiefe
- Keine grossen Card-Shadows ueberall (typisches "Claude-Aesthetic"-Antimuster)

LAYOUT-PRINZIPIEN
- Mobile-First responsive
- Generoeser Whitespace, ruhige Komposition
- Pricing-Cards: 3 nebeneinander, "Empfohlen"-Badge auf mittlerer Karte erlaubt
- CTAs eindeutig, ein primaerer pro Section maximal

ABGRENZUNG
- Plattform (instantpage.at-Marketing-Site + Self-Service-Portal) hat
  EIGENE Aesthetik — orientiert an Linear/Stripe.
- Kunden-Websites (das Endprodukt) folgen einem separaten Recipe-System
  mit eigenen Themes pro Berufsgruppe — NICHT relevant fuer dieses Design System.

WAS DAS DESIGN SYSTEM ABDECKEN SOLL
- Marketing-Landing instantpage.at (erste Aufgabe)
- Self-Service-Portal-Komponenten (kommt spaeter)
- Pricing-Vergleichsseite
- Pitch-Decks und One-Pager fuer Sales/Anwalt
- Wissensdatenbank-Layout

WAS DAS DESIGN SYSTEM NICHT ABDECKT
- Kundenseiten-Templates (Recipe-System, eigene Logik)
- E-Mail-Templates (separates System)
- AI-generierte Endkunden-Inhalte
```
