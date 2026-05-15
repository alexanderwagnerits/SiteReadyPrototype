# Recipe 9 — Gesundheit · Praxis

> **Phase-4-Recipe** auf **Beta-Stil-Basis** (Linie ab 2026-05-11). Persona-Skizze: Ordination Dr. Bauer · 2102 Bisamberg · Allgemeinmedizin · Lehrpraxis seit 2008.

**Stand:** 2026-05-15
**Status:** `[PHASE 4 SPEC]` — Spec-only, Mockup-HTML nicht gebaut. Compliance-strikt (Aerztegesetz § 53, LIVE-COMPLIANCE § 10).

---

## Linie

Recipe = **Beta-Template + Inhalte + Akzentfarbe + Section-Toggles + Compliance-Guardrails**. Gesundheit-Praxis ist eine **Vertrauens-Branche unter strikter Werberestriktion** — der Look ist klinisch-zurueckhaltend, keine reklamehafte Sprache, keine Vergleiche, keine Heilversprechen.

---

## Recipe-Identitaet

| Aspekt | Wert |
|---|---|
| Berufsgruppe | Gesundheit |
| Look | Praxis (klinisch-vertrauensvoll) |
| Sub-Bezeichnungen | Hausarzt, Zahnarzt, Tierarzt, Klinik (Therapie-Berufe → Recipe #10, separat) |
| Stil-Klasse (Beta-Live) | `.stil-klassisch` (Merriweather Serif fuer Headings, Plus Jakarta Sans Body) |
| Akzentfarbe | Medical-Blue `#1e4d7a` (Recipe-Default — User kann pro Kunde ueberschreiben) |
| Heading-Font | Merriweather (Beta-Klassisch-Default) |
| Body-Font | Plus Jakarta Sans (Beta-Default) |
| Hero-Pattern | Color-Hero ohne Foto (Standard) ODER Foto-BG mit dunklem Overlay bei Ordinations-Raum-Foto. Stockfotos von Stethoskopen / weissen Kitteln explizit weglassen — generisch + werblich. |

---

## Section-Reihenfolge (Layout `standard`, Gesundheit-Praxis-Abweichung)

```
Nav (Sticky-Glass)
  ↓
Hero (Eyebrow „Ordination · Ort", H1, Lead, 2 CTAs, 2-3 Trust-Pills)
  ↓
Leistungen — `.leist-more` 6 Cards im 3-Grid (Behandlungs-Themen, sachlich)
  ↓
Ueber — `.ueber sr-grain` Color-BG, Arzt-Bio + Vorteile-Liste (5 Items)
       Team innerhalb (sofern Mehr-Arzt-Praxis) — Beta-Default-Avatar-Grid
  ↓
Bewertungen — `.bew-quote` 1 starkes Zitat (statt Cards — Patient-Vielfalt nicht inszenieren)
  ↓
FAQ — `.faq` mit `.faq-list` 5 Fragen
  ↓
Kontakt — Adresse / Tel / Mail / **Sprechzeiten prominent** + Map-iFrame + Termin-Form **ohne Anliegen-Feld**
  ↓
Footer (3-Spalten-Grid: Brand+Tel / Navigation / Kontakt + Aerztekammer-Hinweis)
  ↓
Float-CTA (Tel-Button rechts unten, mobile — bei Gesundheit Tel statt Web-Form prominenter)
```

**Bewusst weggelassen:**
- Galerie-Section (Behandlungsraum-Fotos sind selten ueberzeugend; Stockfotos verboten)
- Bewertungen-Cards mit Avataren (zu nahe an Patient-Inszenierung — `.bew-quote` mit 1 Zitat ohne Foto ist erlaubt)
- Mid-CTA-Block (Gesundheit ist keine Buchungs-Branche im Marketing-Sinn — sachlich bleiben)
- Stats-Block (Patienten-Zahlen werblich → vermeiden; Quality-Score ≥ 85 verlangt sachlichen Ton)

---

## Recipe-Variation-Hebel

| Hebel | Quelle | Beispiel Dr. Bauer |
|---|---|---|
| Akzentfarbe (`--accent`) | Recipe-Default Medical-Blue, User-Override moeglich | Medical-Blue `#1e4d7a` |
| Stil-Klasse | `.stil-klassisch` (Praxis-Default) — bei Zahnarzt evtl. `.stil-modern` mit kuehlerer Akzentfarbe | `.stil-klassisch` |
| Leistungen-Anzahl | Default 6 Cards (Hausarzt-Schnitt) — Zahnarzt eher 6 (Vorsorge/Konservierend/Prophylaxe/Implantologie/Aesthetik/Notdienst) | 6 |
| Bewertungen | `.bew-quote` Default — `.bew-grid` nur wenn echte Multi-Zitate vorhanden und Patient-Einwilligungen dokumentiert | quote |
| Team-Block | aktivieren nur bei Mehr-Arzt-Praxis (Solo-Praxis: Team aus, Ueber-Text fokussiert auf Person) | aktiv (Dr. Bauer + Assistenzaerztin) |
| Hero-Foto | optional, default aus. Wenn aktiv: Ordinations-Raum (Empfang/Wartezimmer), KEINE Stockfotos | aus |
| Notdienst-Banner | nur aktivieren wenn echter 24/7-Notdienst (z.B. Zahnarzt-Wochenende, Tierarzt-Notdienst); kein „Bereitschaft" als Notdienst verkaufen | aus |
| Inhalt | Onboarding-Form + ggf. Site-Import + KI-Generierung (defensive Prompt-Regeln aktiv) | Dr.-Bauer-Persona |

---

## Inhalts-Slots fuer Dr. Bauer (Spec-Vorlage)

| Slot | Wert |
|---|---|
| Hero-Eyebrow | „Ordination Dr. Bauer · Bisamberg" (`hero-sub has-firma`) |
| Hero H1 | „Hausarztpraxis im Weinviertel." |
| Hero Lead | „Allgemeinmedizin fuer Familien zwischen Korneuburg und Stockerau. Vorsorge, Akut-Behandlung, Mutter-Kind-Pass." |
| Hero CTA-Primary | „Termin anfragen" (Anker zur Form) — alternativ Tel-Anker bei Telefon-Praefenz |
| Hero CTA-Secondary | „Sprechzeiten ansehen" |
| Hero Trust-Pill 1 | „Aerztekammer Niederoesterreich" |
| Hero Trust-Pill 2 | „Kassenarzt OEGK" |
| Hero Trust-Pill 3 (optional) | „Lehrpraxis" |
| Leistungen (6) | Vorsorge-Untersuchungen · Akutbehandlung · Impfungen · Mutter-Kind-Pass · Wundversorgung · Kassen-Routinen / Rezept-Verlaengerungen |
| Ueber-H2 | „Ueber die Ordination" |
| Ueber-Text | „Seit 2008 fuehre ich die Hausarztpraxis in Bisamberg. Schwerpunkt sind Familien und chronische Erkrankungen — Diabetes, Bluthochdruck, Schilddruese. Die Ordination ist als Lehrpraxis anerkannt: junge Aerzte und Aerztinnen absolvieren hier einen Teil ihrer Ausbildung." (sachlich, keine Superlative) |
| Ueber-Vorteile (5) | 18 Jahre Hausarztmedizin · Lehrpraxis (anerkannt) · 2 Kassen-Vertraege · Eigene Wundversorgung · Hausbesuche im Praxisumkreis |
| Bewertungen-Quote (1) | „Die Wartezeiten sind kurz, das Team kennt jeden Patienten beim Namen, und Dr. Bauer nimmt sich Zeit." — anonymisiert oder mit ausdruecklicher Patient-Einwilligung |
| FAQ (5) | Kassenarzt oder Wahlarzt? · Termin online anfragen? · Akut-Termine ohne Voranmeldung? · Hausbesuche moeglich? · Telefonkonsultation / Online-Beratung? |
| Kontakt-Adresse | Hauptstrasse 12, 2102 Bisamberg |
| Kontakt-Tel | +43 2262 91 23 |
| Kontakt-Mail | ordination@dr-bauer.at |
| Sprechzeiten | Mo, Di, Do: 8:00–12:00 + 15:00–18:00 · Mi, Fr: 8:00–12:00 · Sa, So: geschlossen · Akut-Termine 7:30–8:00 ohne Voranmeldung |
| Kontakt-Infos (3 Pills) | Akut-Termine ohne Voranmeldung 7:30–8:00 · Hausbesuche im Umkreis 15 km · Aerztlicher Notdienst NOe 141 |
| Termin-Form-Felder (Pflicht-Variante) | Name · Telefon · E-Mail · Wunschtermin (Tag) · Wunsch-Zeitfenster (Vor-/Nachmittag) — **KEIN Anliegen-Feld** (LIVE-COMPLIANCE § 10.3) |
| Footer-Tagline | „Hausarzt-Ordination Dr. Bauer · Bisamberg · Lehrpraxis seit 2008" |
| Footer-Aerztekammer-Hinweis | „Mitglied der Aerztekammer Niederoesterreich · Impressum + Datenschutz im Footer-Link" |

---

## Live-Bau-Diff zum Beta-Template

| Aspekt | Status | Live-Bau-Aufgabe |
|---|---|---|
| Stil-Klasse `.stil-klassisch` | Beta-Default | ✅ nichts zu tun |
| Hero ohne Foto (Color-only) | Beta-Default | ✅ nichts zu tun |
| Leistungen `.leist-more` 6 Cards | Beta-Default | ✅ nichts zu tun |
| Ueber mit `.sr-grain` + Vorteile-Liste | Beta-Default | ✅ nichts zu tun |
| Bewertungen `.bew-quote` 1 Zitat | Beta-Default | ✅ nichts zu tun |
| FAQ `.faq` + `.faq-list` Accordion | Beta-Default | ✅ nichts zu tun |
| Footer 3-Spalten | Beta-Default | ✅ nichts zu tun |
| Float-CTA Tel-Button | Beta-Default | ✅ nichts zu tun |
| **Sprechzeiten-Block prominent in Kontakt** | Beta hat Oeffnungszeiten-Slot, aber bei Gesundheit prominenter | **Live-Bau:** Kontakt-Block-Variante mit Sprechzeiten als erster sichtbarer Eintrag (vor Map) |
| **Termin-Form ohne Anliegen-Feld** | Beta-Form hat ein Anliegen-Textfeld | **Live-Bau Pflicht:** branchen-funktion `termin_anfrage_no_anliegen: true` rendert Form-Variante OHNE Anliegen-Feld (Art 9 DSGVO, LIVE-COMPLIANCE § 10.3) |
| **Disclaimer-Modal im Onboarding** | nicht im Beta-Template | **Live-Bau Pflicht:** beim Onboarding bei Berufsgruppe „Gesundheit" → Disclaimer-Modal mit Wording aus LIVE-COMPLIANCE § 10.4 vor Vertragsabschluss |
| **KI-Prompt mit § 10.2-Regeln + erweiterte Wording-Liste** | nicht im Beta | **Live-Bau Pflicht:** System-Prompt erweitern bei Berufsgruppe „Gesundheit" (siehe `recipe-konfiguration.md` § Gesundheit „Verbotene Wording") |
| **Quality-Score-Schwelle ≥ 85** | aktuell ≥ 70 Default | **Live-Bau Pflicht:** branchen-spezifische Schwelle pro Recipe konfigurierbar — Gesundheit / Recht & Finanz auf 85 |
| **Impressum-Pflichtfelder** | Generator vorhanden, Branchen-Pflicht-Matrix vorbereitet | **Live-Bau:** Kammer-Mitgliedschaft (Aerztekammer-Land) + Diplom-/Facharzt-Bezeichnung als Pflichtfelder bei Berufsgruppe „Gesundheit" (LIVE-COMPLIANCE § 9 + § 10.4) |
| Medical-Blue-Akzent als Recipe-Default | recipe-konfiguration hat Wert | ✅ definiert |

**Konsequenz:** Gesundheit-Praxis braucht **5 Live-Bau-Aufgaben**, alle bereits in LIVE-COMPLIANCE + recipe-konfiguration spec'd — keine neuen Patterns, nur saubere Umsetzung der Compliance-Guardrails.

---

## Compliance-Hinweise (strikt)

> **Quelle:** `docs/LIVE-COMPLIANCE.md` § 10 Reglementierte Berufe + § 9 Branchen-Pflichtfeld-Matrix. Recipe-Konfig: `recipe-konfiguration.md` § Gesundheit (#9, #10).

- **Aerztegesetz § 53** (Aerzte) — verboten: reklamehaft-marktschreierische Werbung, **Heilversprechen** jeder Art, vergleichende Aussagen gegen andere Aerzte
- **Zahnaerztegesetz § 35** sinngemaess fuer Zahnaerzte (Sub-Bezeichnung)
- **TAerzteG** sinngemaess fuer Tieraerzte (Sub-Bezeichnung)
- **Disclaimer-Pflicht** vor Vertragsabschluss (LIVE-COMPLIANCE § 10.4 Wording)
- **AGB § 6 Abs 4** verweist auf reglementierte Berufe — Anwalt prueft die Klausel im Tier-1-Foundation-Mandat
- **Termin-Anfrage OHNE Anliegen-Feld** (Art 9 DSGVO — Gesundheitsdaten waeren besondere Datenkategorie ausserhalb AVV-Scope)
- **Impressum-Pflichtangaben:** Kammer-Mitgliedschaft (Aerztekammer-Bundesland) + Diplom-/Facharzt-Bezeichnung + Aufsichtsbehoerde
- **Quality-Score ≥ 85** bei Generierung — bei Score 70–85 Admin-Alarm, bei <70 Auto-Re-Gen
- **Verbotene Wording (KI-Prompt-Filter):** „beste Praxis" / „bester Arzt" / „Spitzen-" / „Nr. 1" / „die besten" / „garantierte Heilung" / „100 % Erfolgsquote" / „klinisch erwiesen" ohne Quelle / vergleichende Aussagen / Werbung mit Patienten-Befunden ohne Einwilligung

---

## Reference-DNA-Check

- [x] **Hero-Sprache:** Color-Hero ohne Foto bevorzugt — Stockfotos von weissen Kitteln / Stethoskopen sind generisch + werblich und werden vermieden
- [x] **Typografie:** Merriweather Serif fuer Headings signalisiert Sachlichkeit + Tradition — passt zu Vertrauens-Branche
- [x] **Whitespace:** Beta-Klassisch-Default (sectionY 80px) — ruhig, lesefreundlich, nicht klinisch-steril
- [x] **Trust-Signale:** Aerztekammer-Mitgliedschaft + Kassenarzt-Status + Lehrpraxis als sachliche, ueberpruefbare Pills (NICHT „bester Hausarzt", „seit 18 Jahren erfolgreich" etc.)
- [x] **Mobile-Verhalten:** Beta-Default — Tel-Float-CTA ist bei Gesundheit besonders relevant (Akut-Anrufe)
- [x] **Farb-Verwendung:** Ein Akzent (Medical-Blue) durchgaengig, kein zweites Highlight — Sachlichkeit unterstuetzt

**Verworfene Polish-Patterns:** siehe [`handwerk-werkstatt.md`](handwerk-werkstatt.md) Reference-DNA-Check (gleiche Negativ-Liste). Zusaetzlich Gesundheit-spezifisch verboten:
- ❌ Pulse-Dot bei „Akut-Termine verfuegbar"-Badges (gaukelt Verfuegbarkeit vor)
- ❌ Patienten-Avatar-Bilder als Bewertungen-Cards (Inszenierungs-Risiko)
- ❌ Stats-Block „2.300 zufriedene Patienten" (werblich + nicht ueberpruefbar)
- ❌ Roter Akzent / Warn-Farben in Notdienst-Banner ausserhalb echter 24/7-Verfuegbarkeit

---

## Phase-2-Section-Specs-Ableitung

Alle genutzten Sections sind in [`../sections/_BETA-VOCABULARY.md`](../sections/_BETA-VOCABULARY.md) dokumentiert. **Zwei Recipe-spezifische Section-Varianten** noch nicht im Vokabular und im Live-Bau zu ergaenzen:

1. **Kontakt-Block mit Sprechzeiten prominent** — Variante des Kontakt-Blocks mit Sprechzeiten als erstes Element vor Map. Im Live-Bau `kontakt_variant: "sprechzeiten-first"`.
2. **Termin-Form ohne Anliegen-Feld** — Form-Variante (Wunschtermin + Zeitfenster, kein freies Anliegen-Textfeld). Im Live-Bau `form_variant: "termin-no-anliegen"`. **Pflicht** fuer Berufsgruppe Gesundheit (und Rechtsberatung, siehe LIVE-COMPLIANCE § 10.3).

Beide Varianten sind nicht recipe-spezifisch sondern **berufsgruppen-uebergreifend** (Gesundheit + Rechtsberatung). Sie gehoeren ins Beta-Vocabulary als zusaetzliche Section-Modifier.

---

## Phase-3-Polish-Backlog

- **Hero-Foto-Strategie:** Empfehlung Color-only Default. Wenn Foto: dokumentieren welche Motive funktionieren (Ordinations-Raum / Empfang / Behandlungsraum mit ruhiger Foto-Sprache) und welche verboten sind (Stockfotos, Patienten-Inszenierung, weiss-steril)
- **Sub-Bezeichnungs-Defaults konkretisieren:** Hausarzt (dieses Recipe), Zahnarzt (Leistungen-Themen anders), Tierarzt (anderes Vokabular: Heimtier/Pferd/Nutztier), Klinik (Mehr-Arzt-Setup, Team-Block prominent)
- **Anonymisierung-Workflow Patient-Bewertungen:** Portal-Hinweis fuer Kunden, wie Bewertungen rechtssicher eingeholt + dargestellt werden (Patient-Einwilligung dokumentiert, Klarnamen optional)

---

## Verbindung zu anderen Dokumenten

- [`../recipe-konfiguration.md`](../recipe-konfiguration.md) — Recipe #9 in Master-Tabelle + Gesundheit-Block `[GEFUELLT, Compliance strikt]`
- [`../sections/_BETA-VOCABULARY.md`](../sections/_BETA-VOCABULARY.md) — CSS-Klassen-Referenz aller Sections
- [`../sections/hero.md`](../sections/hero.md) — Hero-Detail-Spec
- [`../../LIVE-COMPLIANCE.md`](../../LIVE-COMPLIANCE.md) § 10 — Reglementierte Berufe Sonderbehandlung + § 10.3 Termin-Anfrage ohne Anliegen-Feld + § 10.4 Disclaimer
- [`../../LIVE-COMPLIANCE.md`](../../LIVE-COMPLIANCE.md) § 9 — Branchen-Pflichtfeld-Matrix (Impressum-Generator)
- [`../references/`](../references/) — Reference-Library, Gesundheit-File noch zu erstellen
- [`functions/templates/template.js`](../../../functions/templates/template.js) — Beta-Live-Template
- Anker-Recipe-Vergleich: [`anwalt-klassisch.md`](anwalt-klassisch.md) — auch Compliance-strikt (RAO § 12), aehnliches Wording-Pattern

---

*Living Document. Bei Aenderung der Aerztegesetz-Vorgaben oder LIVE-COMPLIANCE § 10 aktualisieren.*
