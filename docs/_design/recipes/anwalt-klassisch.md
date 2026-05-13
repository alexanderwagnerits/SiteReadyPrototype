# Recipe 12 — Recht & Finanz · Premium (Anwalt-Klassisch)

> **Anker-Recipe #3** auf **Beta-Stil-Basis** (Linie ab 2026-05-11). Mockup: [`public/mockup-recipe-anwalt-klassisch.html`](../../../public/mockup-recipe-anwalt-klassisch.html). Persona im Mockup: Lechner Rechtsanwaelte · 1010 Wien · Wirtschaftsrecht fuer Familienunternehmen seit 1998.

**Stand:** 2026-05-13
**Status:** `[PHASE 1 FERTIG]` — Beta-Stil-Mockup vorhanden, vollstaendig Beta-pure-Klassen (kein Architektur-Cleanup noetig). Alle 4 Content-Polish-Punkte umgesetzt 2026-05-13 (siehe „Bekannte Polish-Punkte" unten).

---

## Linie

Recipe = **Beta-Template + Inhalte + Akzentfarbe + Section-Toggles**. Anwalt ist eine **Text-Branche mit hoher Compliance-Last** (RAO § 12 Werberecht, anwaltliche Verschwiegenheit, RAK-Mitgliedschaft). Vertrauen entsteht ueber Substanz, Diskretion und Honorar-Klarheit.

Stil-Klasse `.stil-elegant` mit Cormorant Garamond Serif gibt klassische Anwaltskanzlei-Gravitas ohne in Editorial-Magazin-Vibe abzukippen.

---

## Recipe-Identitaet

| Aspekt | Wert |
|---|---|
| Berufsgruppe | Recht & Finanz |
| Look | Premium (Konfig-Name; user-facing „Anwalt-Klassisch") |
| Stil-Klasse (Beta-Live) | `.stil-elegant` (Cormorant Garamond fuer Headings, leichte Weights) |
| Akzentfarbe | Mahagoni `#7a553e` (Cognac-Braun, klassisch-konservativ, gravitas) |
| Heading-Font | Cormorant Garamond (Beta-Elegant-Default) |
| Body-Font | Plus Jakarta Sans (Beta-Default) |
| Hero-Pattern | **Color-Hero ohne Foto** (Text-Branche, Premium-Diskretion) |

**Naming-Inkonsistenz:** Konfig-Look-Name ist „Premium" (Edel-Stil-Familie), User-facing-Recipe-Name ist „Anwalt-Klassisch" (klassischer Anwalts-Vibe). Beide korrekt — Premium beschreibt Stil-Familie, Klassisch beschreibt Branchen-Genre. Filename `anwalt-klassisch.md` folgt User-facing-Naming.

---

## Section-Reihenfolge

```
Nav (Sticky-Glass)
  ↓
Hero (Color-Gradient-BG, Eyebrow-Pill mit Firma+Ort, H1, Accent-Line, Lead, 2 CTAs, 2 Trust-Pills)
  ↓
Leistungen — `.leist-more` 6 Cards (Wirtschaftsrecht / Vertragsrecht / Arbeitsrecht / Erbrecht / Streitbeilegung / Compliance)
  ↓
Bewertungen — `.bew-quote` 1 starkes Zitat (border-left in Mahagoni)
  ↓
Mid-Page-CTA-Block — `.cta-block` Color-only (Primary-BG, kein Foto — passt zu elegant-Diskretion)
  ↓
Ablauf — `.ablauf-steps` 4 Schritte (Erstgespraech → Mandat → Bearbeitung → Abschluss)
  ↓
Ueber — `.ueber sr-grain` Color-BG, Anwaeltin-Bio + Vorteile-Liste (5 Items)
  ↓
FAQ — `.faq` mit `.faq-list` 5 Fragen
  ↓
Kontakt — Adresse / Tel / Mail / Oeffnungszeiten + Map-iFrame + 3 „Gut zu wissen"-Infos + Form mit Rechtsgebiet-Select
  ↓
Footer (3-Spalten-Grid: Brand+Tel / Navigation / Kontakt)
  ↓
Float-CTA (Tel-Button rechts unten, mobile)
```

**Bewusst weggelassen** (Text-Branche + Premium-Diskretion):
- Hero-Foto-BG (Anwalt-Bild-Klischees: Bibliothek/Anzug/Globus → vermeiden)
- Galerie-Section (nichts zu zeigen)
- Bewertungen-Cards mit 3 Stimmen (1 starkes Quote ist diskreter, passt zu Anwalt-Premium)
- Team-Avatar-Grid (Solo-Hauptanwaeltin im Mockup; bei groesseren Kanzleien optional)
- Stats-Block (Recht-Branche misst sich nicht in Zahlen, „250 Mandate" wirkt unangemessen)

---

## Recipe-Variation-Hebel

| Hebel | Quelle | Beispiel Lechner |
|---|---|---|
| Akzentfarbe (`--accent`) | Recipe-Default; User-Override moeglich | Mahagoni `#7a553e` (alternativ Burgund, Anthrazit, Aubergine) |
| Stil-Klasse | `.stil-elegant` (Premium-Anwalt) oder `.stil-klassisch` (Corporate-Anwalt-Recipe #11) | `.stil-elegant` |
| Leistungen-Anzahl | Default 6 Cards | 6 (Rechtsgebiete) |
| Bewertungen-Variante | `.bew-quote` (1) Default fuer Recht-Premium; `.bew-grid` bei Volume-Reviews | 1 Quote |
| Section-Toggles | Sec-Fakten meistens aus, Termin-CTA optional | beide aus im Mockup |
| Form-Felder | Rechtsgebiet-Select Pflicht (statt generischer „Adresse"); Textarea mit Vertraulichkeits-Hinweis | implementiert |
| Inhalt | Onboarding + KI-Generierung mit Compliance-Filter | Lechner-Persona |

---

## Inhalts-Slots fuer Lechner (Mockup)

| Slot | Wert |
|---|---|
| Hero-Eyebrow | „Lechner Rechtsanwaelte · 1010 Wien" (`hero-sub has-firma`) |
| Hero H1 | „Wirtschaftsrecht fuer Familienunternehmen. Seit 1998." |
| Hero Lead | „Wirtschaftsrecht, Vertragsgestaltung und Erbrecht fuer oesterreichische KMU und Familienunternehmen. Klare Kommunikation, transparente Honorare, persoenliche Mandantenfuehrung." |
| Hero CTA-Primary | „Erstgespraech vereinbaren" |
| Hero CTA-Secondary | „Schwerpunkte ansehen" |
| Hero Trust-Pill 1 | „Mitgl. Rechtsanwaltskammer Wien" |
| Hero Trust-Pill 2 | „Seit 1998" |
| Leistungen (6) | Wirtschafts- & Gesellschaftsrecht · Vertragsrecht · Arbeitsrecht · Erbrecht & Nachfolge · Streitbeilegung · Compliance & Datenschutz |
| Bewertungs-Quote | „Frau Dr. Lechner hat unsere Uebergabe an die zweite Generation begleitet — von der Stiftungsgestaltung bis zum letzten Vertragsdetail. Was uns gefallen hat: jede Frage wurde ehrlich beantwortet, auch wenn die Antwort unbequem war." — Mag. Helmut R., Geschaeftsfuehrer Familienunternehmen Industriebedarf · Wien |
| Mid-CTA-Heading | „Ein Erstgespraech klaert mehr als jede Website." |
| Mid-CTA-Lead | „Telefonisch oder in der Kanzlei in der Wiener Innenstadt. Kostenfrei und vertraulich." |
| Ablauf (4) | Erstgespraech · Mandat & Honorar · Bearbeitung · Abschluss & Nachsorge |
| Ueber-H2 | „Dr. Anna Lechner." |
| Ueber-Text | Dr.-Anna-Lechner-Bio: 1998 gegruendet nach 8 Jahren bei Wiener Wirtschaftskanzlei. Schwerpunkt Wirtschaftsrecht fuer Familienunternehmen. Bewusst klein gehalten, keine Folienschlachten. Lehrt Gesellschaftsrecht an der WU Wien. |
| Ueber-Vorteile (5) | 25 Jahre Wirtschaftsrecht / Persoenliche Mandantenfuehrung / Festpreis oder RATG-Stundensatz / WU-Lektorin / RAK-Mitglied |
| FAQ (5) | Erstgespraech-Kosten? · Honorargestaltung? · Mandate ausserhalb Wien? · Vertraulichkeit? · Einmal-Mandat moeglich? |
| Kontakt-Adresse | Wollzeile 14, 1010 Wien |
| Kontakt-Tel | +43 1 533 24 80 |
| Kontakt-Mail | kanzlei@lechner-rechtsanwaelte.at |
| Oeffnungszeiten | Mo–Do 9:00–17:00 · Fr 9:00–13:00 · Termine nach Vereinbarung |
| Kontakt-Infos (3 Pills) | Erstgespraech unverbindlich + ohne Honorarpflicht · Anwaltliche Verschwiegenheit gesetzlich · Festpreis oder RATG-Stundensatz |
| Kontakt-Form-Felder | Name · Mail · Tel · Rechtsgebiet-Select (7 Optionen) · Anliegen-Textarea mit Vertraulichkeits-Hinweis |
| Footer-Tagline | „Wirtschaftsrecht, Vertragsgestaltung und Erbrecht fuer oesterreichische KMU und Familienunternehmen. Seit 1998." |

---

## Live-Bau-Diff zum Beta-Template

Minimal — Anwalt-Mockup ist die saubere Beta-pure-Referenz (alle `.leist-more`, `.faq-list`, `.ablauf-steps`, `.bew-quote` Beta-Klassen, kein `.sr-*` Custom).

| Aspekt | Status | Live-Bau-Aufgabe |
|---|---|---|
| Stil-Klasse `.stil-elegant` | Beta-Default | ✅ nichts zu tun |
| Cormorant Garamond Font-Load | Im Mockup `<link>` | **In Live-Template als optionaler Recipe-Font-Loader** |
| Bewertungen `.bew-quote` (1) | Beta-Default | ✅ nichts zu tun |
| Form-Felder Rechtsgebiet-Select | Recipe-spezifische Form-Variante | **Recipe-Form-Schema pro Berufsgruppe in Live: Anwalt = Rechtsgebiet-Select** |
| Anwalt-Compliance-Vorgaben | Wording im Mockup teilweise gepflegt (RAO-konform) | **JSON-LD `@type: LegalService` Pflicht** (im Mockup bereits) |
| Branchen-spezifische Trust-Pills | RAK-Wien + Seit-1998 generisch | **Defaults pro AT-Bundesland**: RAK-Wien / RAK-OOe / RAK-Steiermark etc. |

**Konsequenz:** Anwalt-Klassisch ist live-bau-ready. Hauptarbeit ist **Form-Schema pro Berufsgruppe** und **Compliance-Wording-Filter im KI-Prompt** (Verbot von „kostenlos", „Top-Anwalt", „Erfolgsversprechen").

---

## Compliance-Hinweise (kritisch)

**Reglementierte Branche.** [`LIVE-COMPLIANCE.md`](../../LIVE-COMPLIANCE.md) § 10 anwenden.

| Bereich | Anforderung | Status im Mockup |
|---|---|---|
| **RAO § 12 Werberecht** | Keine reisserische / vergleichende Werbung. Sachliche Angaben erlaubt. | ✅ defensive Sprache: „unverbindlich und ohne Honorarpflicht" statt „Erstgespraech kostenlos" (2026-05-12 Wording-Konsistenz-Cleanup) |
| **Anwaltliche Verschwiegenheit** | Gesetzlich vorgeschrieben (RAO § 9). Im Kontakt-Bereich explizit erwaehnen. | ✅ Kontakt-Info-Pill: „Anwaltliche Verschwiegenheit ist gesetzlich vorgeschrieben." |
| **RAK-Mitgliedschaft** | Pflichtangabe in Impressum + sichtbar in Site (Trust-Pill). | ✅ Hero-Trust-Pill + JSON-LD |
| **Honorar nach RATG** | Rechtsanwaltstarifgesetz-Referenz bei Stundensatz-Statement. | ✅ FAQ + Kontakt-Info: „Festpreis oder Stundensatz nach RATG" |
| **Quality-Score-Schwelle** | Recht & Finanz `≥ 85` ([DESIGN-VISION § 13.6](../../DESIGN-VISION.md)) | gilt fuer KI-generierte Inhalte im Live |
| **Anwalts-Audit-Punkt** | „Fuer Google optimiert" im About → vor Live durch Anwalt pruefen lassen (Garantie-Aussage-Risiko) | offen |

**Verbotene Wording-Patterns** (vom KI-Prompt zu filtern):
- „Top-Anwalt", „Bester Anwalt", „Garantierter Erfolg", „100 % Gewinn-Chance"
- „Erstgespraech kostenlos" (besser: „unverbindlich", „ohne Honorarpflicht")
- Vergleichende Aussagen ggue. anderen Kanzleien
- „Schnelle Mandatserledigung" (kann als Garantie ausgelegt werden)

---

## Polish-Tweaks (umgesetzt 2026-05-13)

Aus User-Critique 2026-05-12, am 2026-05-13 nachgezogen:

1. ✅ **Quote-H2** „Eine Uebergabe, sauber begleitet." → „Eine Uebergabe, praezise begleitet." (Handwerker-Vokabular „sauber" raus)
2. ✅ **Ueber-H2** „Die Kanzlei." → „Dr. Anna Lechner." (Person-Personalisierung)
3. ✅ **Ablauf-Step #4** „Drei Monate kostenlose Rueckfragen" → „Drei Monate inkludierte Rueckfragen" (RAO-defensiver, letzte „kostenlose"-Aussage raus)
4. ✅ **Hero-H1** „Rechtsberatung in der Wiener Innenstadt. Seit 1998." → „Wirtschaftsrecht fuer Familienunternehmen. Seit 1998." (Was+Wer+Wann statt Wo+Wann, Tourismus-Vibe raus)

→ Diese Punkte waren **Wording-Geschmack**, nicht Substanz. Production-Texte kommen via KI pro echtem Mandat-Kunden — Mockup-Wording dient als Form-Template.

---

## Reference-DNA-Check

- [x] **Hero-Sprache:** Color-Hero ohne Foto — passt zu Premium-Anwaltskanzlei (Vergleich: Cerha-Hempel, Schoenherr Sites haben editorial-text Heroes ohne generische Anwalts-Bilder)
- [x] **Typografie:** Cormorant Garamond Serif gibt klassische Gravitas, leichte Weights (500) vermeiden „heavy" Eindruck
- [x] **Whitespace:** Beta-Elegant-Default (sectionY 100px, generoes) — passt zu Premium-Diskretion
- [x] **Trust-Signale:** RAK-Mitgliedschaft + Seit-1998 als Hero-Pills (substanziell, nicht Marketing-Pillen); Anwaltliche Verschwiegenheit als Kontakt-Info-Anker
- [x] **Mobile-Verhalten:** Beta-Default
- [x] **Farb-Verwendung:** Ein Akzent (Mahagoni) durchgaengig, kein zweites Highlight

**Verworfene Polish-Patterns:** Siehe [`handwerk-werkstatt.md`](handwerk-werkstatt.md) Reference-DNA-Check.

---

## Phase-2-Section-Specs-Ableitung

Alle genutzten Sections sind in [`../sections/_BETA-VOCABULARY.md`](../sections/_BETA-VOCABULARY.md) dokumentiert.

**Anwalt-spezifische Form-Variante** (Rechtsgebiet-Select) ist **kein** neues Section-Pattern — bleibt innerhalb der `.k-form`-Klasse, nur Feld-Schema branchen-gefiltert. Live-Spec-Aufgabe: Form-Schema pro Berufsgruppe als Konfig (siehe Live-Bau-Diff).

---

## Phase-3-Polish-Backlog

- 4 Wording-Tweaks (siehe oben) als Mockup-Pflege, NICHT prio
- Anwalts-Audit der „Fuer Google optimiert"-Aussage in BRAND.md About-Text
- Live-Form-Schema pro Berufsgruppe als JSON-Konfig
- Branchen-spezifische KI-Prompt-Filter fuer verbotene Wording-Patterns

---

## Verbindung zu anderen Dokumenten

- [`../recipe-konfiguration.md`](../recipe-konfiguration.md) — Recipe #12 (Recht-Finanz-Premium) in Master-Tabelle
- [`../sections/_BETA-VOCABULARY.md`](../sections/_BETA-VOCABULARY.md) — CSS-Klassen-Referenz
- [`../sections/hero.md`](../sections/hero.md) — Hero-Detail-Spec
- [`../../LIVE-COMPLIANCE.md`](../../LIVE-COMPLIANCE.md) § 10 — Reglementierte Berufe + Anwalt-spezifische Pflichten
- [`../../DESIGN-VISION.md`](../../DESIGN-VISION.md) § 13.6 — Quality-Score-Schwelle ≥ 85 fuer Recht & Finanz
- [`functions/templates/template.js`](../../../functions/templates/template.js) — Beta-Live-Template

---

*Living Document. Bei Beta-Template-Aenderungen oder neuen RAO/Compliance-Vorgaben aktualisieren.*
