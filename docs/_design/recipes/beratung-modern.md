# Recipe 13 — Beratung & Coaching · Modern

> **Anker-Recipe #2** auf **Beta-Stil-Basis** (Linie ab 2026-05-11). Mockup: [`public/mockup-recipe-beratung-modern.html`](../../../public/mockup-recipe-beratung-modern.html). Persona im Mockup: Karner Strategie · Linz · Strategie und Sparring fuer oberoesterreichische Familienunternehmen seit 2018.

**Stand:** 2026-05-12
**Status:** `[PHASE 1 FERTIG]` — Beta-Stil-Mockup vorhanden, Beta-Klassen-Normalisierung 2026-05-12 durch (`.sr-leist-grid` → `.leist-more`, `.sr-faq-grid` → `.faq-list`, `.sr-ablauf-h` → `.ablauf-steps`).

---

## Linie

Recipe = **Beta-Template + Inhalte + Akzentfarbe + Section-Toggles**. Keine eigenen Polish-Patterns. Beratung ist eine **Text-Branche** — kein Hero-Foto, keine Galerie, keine Bewertungen-Cards. Vertrauen entsteht ueber Person, Methodik und Honorar-Transparenz.

---

## Recipe-Identitaet

| Aspekt | Wert |
|---|---|
| Berufsgruppe | Beratung & Coaching |
| Look | Modern |
| Stil-Klasse (Beta-Live) | `.stil-klassisch` (Merriweather Serif fuer Headings, sans-serif Body) |
| Akzentfarbe | Tannengruen `#2d5d3f` (warm-edel, signalisiert Wachstum + Stabilitaet) |
| Heading-Font | Merriweather (Beta-Klassisch-Default) |
| Body-Font | Plus Jakarta Sans (Beta-Default) |
| Hero-Pattern | **Color-Hero ohne Foto** (Text-Branche; Person verkauft sich, kein Bild noetig) |

**Naming-Hinweis:** „Modern" im Recipe-Look-Namen bezieht sich auf das Beratungs-Genre (moderner KMU-Berater), nicht auf die Beta-Stil-Klasse. Stil-Klasse ist `.stil-klassisch`.

---

## Section-Reihenfolge

```
Nav (Sticky-Glass)
  ↓
Hero (Color-BG, Eyebrow-Pill mit Firma+Ort, H1, Lead, 2 CTAs, 2 Trust-Pills)
  ↓
Leistungen — `.leist-more` 6 Cards im 3-Grid (h4 + p, Beta-pure)
  ↓
Mid-Page-CTA-Block (`.sec-cta-block` mit Foto-BG + dunklem Overlay)
  ↓
Ablauf — `.ablauf-steps` 4 Schritte (Kennenlernen → Analyse → Workshop → Begleitung)
  ↓
Ueber — `.ueber sr-grain` Color-BG-Section, Berater-Bio + Vorteile-Liste (5 Items)
  ↓
FAQ — `.faq` mit `.faq-list` 5 Fragen
  ↓
Kontakt — Adresse / Tel / Mail / Oeffnungszeiten + Map-iFrame + 3 „Gut zu wissen"-Infos + Form
  ↓
Footer (3-Spalten-Grid: Brand+Tel / Navigation / Kontakt)
  ↓
Float-CTA (Tel-Button rechts unten, mobile)
```

**Bewusst weggelassen** (Beratung ist Text-Branche):
- Hero-Foto-BG (kein Werkstuecke-Visual, Berater-Foto waere generisches Stockfoto)
- Galerie-Section (nichts zu zeigen — keine sichtbaren Werke)
- Bewertungen-Cards / -Quote (Mockup hat keine; im Live evtl. 1 Quote nachruesten, wenn echtes Testimonial vorhanden)
- Team-Avatar-Grid (Solo-Berater im Mockup)
- Stats-Block / Sec-Fakten (im Mockup nicht; bei groesseren Beratungen optional)

---

## Recipe-Variation-Hebel

| Hebel | Quelle | Beispiel Karner |
|---|---|---|
| Akzentfarbe (`--accent`) | Recipe-Default + User-Override moeglich | Tannengruen `#2d5d3f` |
| Stil-Klasse | `.stil-klassisch` (Modern-Beratung) oder `.stil-modern` (Tech-Beratung) | `.stil-klassisch` |
| Leistungen-Anzahl | Default 6 Cards | 6 (Strategie-Workshop, Nachfolge, Wachstum, Audit, Pricing, Sparring) |
| Section-Toggles | Bewertungen-Quote optional, Sec-Fakten optional | beide aus im Mockup |
| Hero-Foto | optional inline-Override; **NICHT empfohlen** fuer Beratung | aus |
| Mid-CTA-Foto | optional; falls genutzt, sollte es relevant sein (Buero, Workshop-Setting) | Karner-Hero-Foto-Stub (im Live: relevantes Bild oder Color-Block) |
| Inhalt | Onboarding-Form + ggf. Site-Import + KI-Generierung | Stefan-Karner-Persona |

---

## Inhalts-Slots fuer Karner (Mockup)

| Slot | Wert |
|---|---|
| Hero-Eyebrow | „Karner Strategie · Linz" (`hero-sub has-firma`) |
| Hero H1 | „Strategie fuer Familienunternehmen." |
| Hero Lead | „Wachstum, Nachfolge, Konsolidierung — wir begleiten KMU-Inhaber in den Entscheidungen, die selten zweimal kommen. Erstgespraech kostenlos." |
| Hero CTA-Primary | „Erstgespraech vereinbaren" |
| Hero CTA-Secondary | „Leistungen ansehen" |
| Hero Trust-Pill 1 | „WKO Unternehmensberater" |
| Hero Trust-Pill 2 | „Erstgespraech kostenlos" |
| Leistungen (6) | Strategie-Workshop · Nachfolge-Begleitung · Wachstums-Strategie · Geschaeftsmodell-Audit · Pricing-Beratung · Sparring-Termin |
| Mid-CTA-Heading | „Eine Frage, eine Stunde, ein klarer Blick" |
| Mid-CTA-Lead | „Erstgespraech kostenlos — telefonisch oder in Linz. Wir sagen ehrlich, ob wir Ihnen helfen koennen." |
| Ablauf (4) | Kennenlernen · Analyse-Phase · Workshop · Begleitung |
| Ueber-H2 | „Wer hinter Karner Strategie steht" |
| Ueber-Text | Stefan-Karner-Bio: 14 Jahre CFO im mittelstaendischen Industriebetrieb, davon 6 in GL. 2018 Beratung gegruendet. Solo, kein Junior-Team. Spricht KMU-Inhaber an, die zwischen Steuerberater + Bank niemanden fuer Strategie haben. |
| Ueber-Vorteile (5) | 14 Jahre CFO-Erfahrung / Einzelberater (kein Junior-Team) / Fokus 20–200 MA / Honorartransparenz / WKO-zertifiziert + Mediator |
| FAQ (5) | Honorare? · Unternehmensgroessen? · Unterschied zu Grossberatung? · Vertraulichkeit? · Online? |
| Kontakt-Adresse | Landstrasse 47, 4020 Linz |
| Kontakt-Tel | +43 732 944 213 |
| Kontakt-Mail | office@karner-strategie.at |
| Oeffnungszeiten | Mo–Fr 9:00–17:00 · Termine nach Vereinbarung |
| Kontakt-Infos (3 Pills) | Erstgespraech kostenfrei + unverbindlich · NDA-Standard · Festpreis pro Modul |
| Footer-Tagline | „Strategie und Sparring fuer oberoesterreichische Familienunternehmen — seit 2018." |

---

## Live-Bau-Diff zum Beta-Template

Minimal. Alle Sections sind Beta-pure-Klassen (nach Normalisierung 2026-05-12).

| Aspekt | Status | Live-Bau-Aufgabe |
|---|---|---|
| Stil-Klasse `.stil-klassisch` | Beta-Default | ✅ nichts zu tun |
| Hero ohne Foto (Color-only) | Beta-Default | ✅ nichts zu tun |
| Leistungen `.leist-more` 6 Cards | Beta-Default | ✅ nichts zu tun |
| Ablauf `.ablauf-steps` 4 Steps | Beta-Default | ✅ nichts zu tun |
| Ueber mit `.sr-grain` + Vorteile-Liste | Beta-Default | ✅ nichts zu tun |
| FAQ `.faq` + `.faq-list` Accordion | Beta-Default | ✅ nichts zu tun |
| Kontakt mit Map + Form | Beta-Default | ✅ nichts zu tun |
| Footer 3-Spalten | Beta-Default | ✅ nichts zu tun |
| Mid-CTA `.sec-cta-block` mit Foto-BG | inline-Override im Mockup | **Im Live evaluieren ob Foto-BG passt — bei Beratung evtl. besser Color-only oder relevantes Workshop-Foto** |
| Tannengruen-Akzent als Recipe-Default | Recipe-Konfig hat Wert | ✅ definiert |
| Branchen-spezifische Trust-Pills | Generisch („WKO Unternehmensberater", „Erstgespraech kostenlos") | **Defaults pro Sub-Variante**: Strategy-Berater vs Trainer-Mentor (siehe `recipe-konfiguration.md` Sub-Varianten-Tabelle) |

**Konsequenz:** Beratung-Modern ist live-bau-ready ohne Template-Aenderung. Hauptarbeit ist **Branchen-Default-Inhalte** (Leistungs-Themen, FAQ-Themen, Ablauf-Vokabular) als KI-Prompt-Seed.

---

## Compliance-Hinweise

- **Reglementierung:** WKO-Unternehmensberatung ist freier Beruf, aber WKO-Mitgliedschaft Pflicht. Trust-Pill „WKO Unternehmensberater" ist substanziell, nicht dekorativ.
- **Werbung:** Kein besonderes Werberecht wie Anwalt (RAO § 12). „Erstgespraech kostenlos" ist UWG-konform, solange sachlich.
- **Honorar-Transparenz:** Bei Beratung wichtig — Festpreis-Statements + Stundensatz-Angaben sind Vertrauens-Anker. Im Mockup als FAQ #1 explizit.
- **DSGVO:** Standard. Kontaktformular-Submission, AVV nur bei Verarbeiter-Beziehung.
- **Vertraulichkeit / NDA:** Branchen-Standard erwaehnt in Kontakt-Infos + FAQ #4. Optional als Trust-Pill.

---

## Reference-DNA-Check

- [x] **Hero-Sprache:** Color-Hero ohne Foto — passt zu Person-fokussierter Beratung (Vergleich: cpg.at, McKinsey-Sites haben editorial-text-erste Heroes)
- [x] **Typografie:** Merriweather Serif fuer Headings signalisiert Substanz + Tradition (passt zu Familienunternehmen-Audience)
- [x] **Whitespace:** Beta-Klassisch-Default (sectionY 80px) — ruhig, lese-freundlich
- [x] **Trust-Signale:** WKO-Mitgliedschaft + Honorar-Hinweis in Hero-Trust-Pills; CFO-Hintergrund + WKO-Zertifizierung in Ueber-Vorteilen
- [x] **Mobile-Verhalten:** Beta-Default (Hamburger, sticky Float-CTA)
- [x] **Farb-Verwendung:** Ein Akzent (Tannengruen) durchgaengig, kein zweites Highlight

**Verworfene Polish-Patterns:** Siehe [`handwerk-werkstatt.md`](handwerk-werkstatt.md) Reference-DNA-Check (gleiche Negativ-Liste).

**Architektur-Leak fixed 2026-05-12:** Mockup hatte initial `.sr-leist-grid`, `.sr-ablauf-h`, `.sr-faq-grid` als Custom-Klassen mit Inline-Cards/Buttons. Normalisiert auf Beta-pure `.leist-more`, `.ablauf-steps`, `.faq-list`. Dead-Code-JS-Listener auf alten Klassen verbleiben (harmlos).

---

## Phase-2-Section-Specs-Ableitung

Alle genutzten Sections sind in [`../sections/_BETA-VOCABULARY.md`](../sections/_BETA-VOCABULARY.md) dokumentiert. Keine Recipe-spezifischen Section-Patterns.

---

## Phase-3-Polish-Backlog

- Mid-CTA-Foto-Strategie pruefen: aktueller Picsum-Stub waere im Live durch echtes Bild oder Color-Block zu ersetzen. Empfehlung: bei Beratung **kein Foto** im Mid-CTA, statt dessen Color-`.cta-block` mit Tannengruen.
- Sub-Varianten konkretisieren: „Strategy/Berater" (Karner-Stil) vs „Trainer/Mentor" (auf Workshops/Speaker-Audience zugeschnitten, hellere Tannen-Variante).
- Optional: Sec-Fakten-Block (Stats: „47 Mandate", „6 Jahre", „durchschn. ROI") wenn Berater entsprechende Zahlen hat.

---

## Verbindung zu anderen Dokumenten

- [`../recipe-konfiguration.md`](../recipe-konfiguration.md) — Recipe #13 in Master-Tabelle, plus Sub-Varianten Strategy vs Trainer
- [`../sections/_BETA-VOCABULARY.md`](../sections/_BETA-VOCABULARY.md) — CSS-Klassen-Referenz
- [`../sections/hero.md`](../sections/hero.md) — Hero-Detail-Spec
- [`../references/`](../references/) — Reference-Library, Beratung-File noch zu erstellen
- [`functions/templates/template.js`](../../../functions/templates/template.js) — Beta-Live-Template
- Live-Vergleichs-Site: `https://sitereadyprototype.pages.dev/s/stahlbau-stockmeister` (Beratungs-aehnliche Section-Struktur)

---

*Living Document. Bei Beta-Template-Aenderungen oder neuen Sub-Varianten aktualisieren.*
