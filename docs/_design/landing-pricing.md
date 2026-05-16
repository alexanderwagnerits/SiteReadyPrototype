# Pricing-Page Layout — Spec

**Stand:** 2026-05-16
**Quelle:** `PRODUCT.md` § 3 (Pricing + Plaene, Erweiterung 2026-05-16). User-Entscheidung: 3+3-Layout, Day-1-buchbar oben, Sonderloesungen unten.

## Layout-Skizze

```
+-----------------------------------------------------------+
|  Hero: "Die Website fuer oesterreichische KMU."           |
|                                                           |
|  Sub: "Self-Service ab 14 EUR/Mo. Oder wir bauen sie      |
|       fuer Sie. Was passt zu Ihnen?"                      |
+-----------------------------------------------------------+

REIHE 1 — DAY-1 BUCHBAR
+----------------+ +----------------+ +----------------+
|    Starter     | |  Professional  | | Einrichtungs-  |
|                | |                | |    Service     |
|  16 EUR/Mo     | |  29 EUR/Mo     | |                |
|  14 EUR jaehrl.| |  25 EUR jaehrl.| |  149 EUR       |
|                | |                | |  einmalig      |
|  Subdomain     | |  Eigene Domain | |  + Plan        |
|  KI-Texte      | |  AI-Sichtbark. | |                |
|  Impr+DSE auto | |  Stats+Report  | |  Wir bauen     |
|  Kein Cookie-  | |  Ohne instant- | |  mit Ihnen     |
|  Banner        | |  page-Branding | |  zusammen      |
|                | |                | |                |
|  [Starten]     | |  [Starten]     | |  [Buchen]      |
+----------------+ +----------------+ +----------------+

REIHE 2 — AUF ANFRAGE / COMING SOON
+----------------+ +----------------+ +----------------+
|    Business    | |  Custom-Sites  | |   Whitelabel   |
|                | |                | |  fuer Agenturen|
|  Coming Soon   | |  ab 990 EUR    | |                |
|                | |  + 79 EUR/Mo   | |  Volumen-      |
|  Multi-User,   | |                | |  Pauschale     |
|  SLA, Custom-  | |  Multipage,    | |                |
|  Branding      | |  individuell   | |  Co-Branded    |
|                | |  unter eigener | |  fuer KMU-     |
|                | |  Marke         | |  Endkunden     |
|                | |                | |                |
|  [Vormerken]   | |  [Anfragen]    | |  [Vormerken]   |
+----------------+ +----------------+ +----------------+

+-----------------------------------------------------------+
|  FAQ + Trust-Block + Newcomer-Rabatt-Hinweis             |
|  (20 % erstes Jahr fuer Starter/Pro)                      |
+-----------------------------------------------------------+
```

## Karten-Spec im Detail

### Starter (16 EUR / 14 EUR jaehrlich)

- Header: "Starter"
- Preis: gross 16 EUR/Mo, klein darunter "14 EUR/Mo bei Jahreszahlung"
- 5-6 Bullet-Features (kuerzeste, staerkste — aus Feature-Matrix § 4)
- CTA: "Starter starten"
- Footnote: "7 Tage gratis testen — kein Refund nach Trial-Ende"

### Professional (29 EUR / 25 EUR jaehrlich) — HIGHLIGHTED

- Header: "Professional" mit "Beliebteste Wahl"-Badge
- Preis: gross 29 EUR/Mo, klein darunter "25 EUR/Mo bei Jahreszahlung"
- 6-7 Bullet-Features mit Pro-spezifischen Plus-Bullets visuell hervorgehoben
- CTA: "Professional starten"
- Visuell-Highlight (Tannengruen-Akzentfarbe, leicht hervorgehoben)

### Einrichtungs-Service (149 EUR einmalig)

- Header: "Einrichtungs-Service" mit Sub "Add-on, fuer wen Self-Service zu viel ist"
- Preis: 149 EUR einmalig, klein darunter "+ Plan Ihrer Wahl"
- Bullet-Features:
  - Gemeinsamer Call (30-60 Min)
  - Foto-Auswahl-Beratung
  - Domain-Anbindung-Hilfe
  - Freigabe-Begleitung
- CTA: "Setup-Termin anfragen"
- Footnote: "Verfuegbarkeit nach Terminvereinbarung, typisch innerhalb 5 Werktagen"

### Business (Coming Soon)

- Header: "Business"
- Preis-Box: "Coming Soon" statt Preis
- Subtext: "Mehrere User, SLA, Custom-Branding — Trigger fuer Definition: 10+ Pro-Kunden mit Wuenschen"
- CTA: "Vormerken" → Mail-Form
- Visuell zurueckhaltend (graue Karte)

### Custom-Sites (ab 990 EUR + 79 EUR/Mo)

- Header: "Custom-Sites"
- Sub: "Wir bauen Ihre Website individuell"
- Preis-Box: "ab 990 EUR einmalig + 79 EUR/Mo Hosting & Care"
- Bullet-Features:
  - Multipage, Custom-Sections
  - Unter Ihrer eigenen Marke
  - 1 Std Wartung/Monat inkludiert
  - Priority-Support 24h
- CTA: "Sonderloesung anfragen" → Mail mit Projekt-Skizze-Feld
- Footnote: "Beispiel-Referenz: cpg.at" (nach Live mit Live-Link)

### Whitelabel-Agentur

- Header: "Whitelabel-Agentur-Programm"
- Sub: "Fuer Marketing-Agenturen mit eigenen KMU-Kunden"
- Preis-Box: "Volumen-Pauschale auf Einzelvertrag"
- Bullet-Features:
  - Eigenes Admin-Center
  - Sammel-Billing fuer alle Sites
  - Co-Branded (Ihr Logo im Footer)
  - Vorzugspreise fuer Erst-Agenturen (12 Mo)
- CTA: "Vormerken" → Mail-Form mit Agentur-Profil-Feld
- Visuell zurueckhaltend (graue Karte, klar als „in Vorbereitung")

## Mobile-Layout

- Reihe 1: Karten stacken vertikal in Reihenfolge Professional → Starter → Einrichtungs-Service (Pro oben fuer Default-Wahl)
- Reihe 2: gleich stacken, Custom-Sites → Business → Whitelabel
- "Beliebteste Wahl"-Badge bleibt auch Mobile auf Professional

## Brand-Konsistenz

- Voice gemaess `BRAND.md` § 5: sachlich-zugewandt, „Sie" durchgehend, keine Drueckersprache
- Akzentfarbe Tannengruen fuer Professional-Highlight + Custom-Sites-Header
- Keine Vergleiche („besser als Wix"), keine UWG-Trigger-Begriffe (siehe `LIVE-COMPLIANCE.md` § 15)
- Anti-Pattern-Liste: kein FOMO-Countdown, keine Lifetime-Preis-Locks (siehe `MARKETING.md` § 5)

## Verlinkungen

- Starter/Professional → `/checkout?plan=starter|professional`
- Einrichtungs-Service → `/checkout?addon=setup_149` + Plan-Wahl-Modal
- Business → `/vormerken?plan=business`
- Custom-Sites → `mailto:office@instantpage.at?subject=Anfrage Custom-Site` mit Body-Template
- Whitelabel → `/vormerken?programm=whitelabel`

## Trust-Block (unter Karten)

- "Speziell fuer oesterreichische KMU"
- "Impressum und Datenschutz automatisch erstellt"
- "Kleinunternehmer im Sinne des § 6 Abs. 1 Z 27 UStG — keine Umsatzsteuer"
- "Newcomer-Rabatt: 20 % auf das erste Jahr — gilt fuer Starter + Professional"

## Newcomer-Rabatt-Banner

Optional als Stripe ueber dem Pricing-Block: "20 % Newcomer-Rabatt fuer das erste Jahr — gilt fuer Neukunden, Aktion laeuft." Klar, ohne Countdown, ohne Drueckersprache (siehe `MARKETING.md` § 5 Anti-Patterns).

## Implementation-Hinweise

- React-Komponenten mit `pricing-card.tsx` als Template
- Sticky Mobile-CTA fuer Professional-Karte
- A11y: ARIA-Labels fuer Coming-Soon vs Day-1-Karten
- Lighthouse-Mobile-Score >= 90 (Quality-Standards `DESIGN-VISION.md` § 13)

## Cross-Refs

- `PRODUCT.md` § 3 — Pricing-Mechanik + Plan-Definitionen
- `BRAND.md` § 7 + § 8 — Voice + Verbotene Begriffe
- `MARKETING.md` § 3 + § 5 — Growth-Mechaniken + Anti-Patterns
- `LIVE-COMPLIANCE.md` § 5 AGB §§ 16+17 — Werkvertrag-Klauseln Einrichtungs-Service + Custom-Sites
- `ARCHITECTURE.md` § 4 — DB-Schema (plan_type, agency_id, custom_assets_path)
