# Handwerk — Reference-Set

> **Status:** `[BEISPIEL]` als Format-Vorlage. 13 weitere Files in dieser Tiefe analog füllen wenn jeweilige Berufsgruppe-Recipe gebaut wird.

**Sub-Branchen:** Tischler, Schreiner, Schmied, Schlosser, Schneider, Elektriker, Installateur, Solartechnik, Smart-Home, Goldschmied, Buchbinder, Restaurator, Polsterer, Glaser, Maler, Bodenleger.

**Looks:** Werkstatt (Rustikal, Recipe 1) / Modern (Klassisch-Modern, Recipe 2) / Premium (Edel, Recipe 3).

---

## Top-Referenzen — Look "Werkstatt" (Rustikal)

| # | URL | Was hier richtig ist |
|---|---|---|
| 1 | komi-shop.com (Beispiel-Schmied) | Großformatige Werkstücke-Fotos, Editorial-Story, ehrliche Materialität |
| 2 | tischlereiwagner.at | Klare Hierarchie, Werkstatt-Fotos zeigen Hände-am-Werk, regionaler Bezug |
| 3 | atelier-koreneff.com | Burgund-Akzent, Serif-Typo, Whitespace lässt Werkstücke wirken |
| 4 | schmiedevoeltzer.de | Trust-Signale (Innung, Generationen) prominent, Foto-Galerie als Hauptattraktion |
| 5 | tischler-schaefer.com | Mobile-Verhalten exzellent, Touch-Targets großzügig, Galerie scrollt smooth |

## Top-Referenzen — Look "Modern" (Klassisch-Modern)

| # | URL | Was hier richtig ist |
|---|---|---|
| 1 | smarthome-installateur-musterfirma.at | Tech-Look mit Indigo-Akzent, Iconografie schlicht, Kompetenz statt Stockfoto-Klischee |
| 2 | solar-pioneer.eu | Sec-Fakten als Hero-Element (kWh installiert), Mission-driven |
| 3 | electric-installer-modern.com | Pill-Buttons + Blur-Backgrounds machen "modern" ohne aufdringlich |

## Top-Referenzen — Look "Premium" (Edel)

| # | URL | Was hier richtig ist |
|---|---|---|
| 1 | goldschmied-thaler.at | Cormorant-Garamond, Anthrazit-Gold, Editorial-Story der Goldschmiede-Tradition |
| 2 | restaurator-mueller.de | Premium über Whitespace, nicht über Goldfolie |
| 3 | designer-tischlerei.com | Magazine-Display Hero, Projekte als Hauptattraktion |

---

## Visual-DNA (was alle Top-Referenzen teilen)

- **Foto-Sprache**: Hände-am-Werk, Werkstücke-Detail, Werkstatt-Atmosphäre. **Nicht** Stockfoto-lächelnde-Tischler-mit-Hammer.
- **Typografie**: Werkstatt = Serif (Unna/Merriweather), Modern = Sans (Space Grotesk/DM Sans), Premium = Cormorant Garamond.
- **Whitespace**: großzügig — Premium-Niveau braucht Atmen-Räume zwischen Sections.
- **Trust-Signale**: Innung, Generationen-Tradition, Mitgliedschaften als Hero-Trust-Bar; Auszeichnungen (Staatspreis, Handwerk-Award) als Sec-Partner-Logo-Strip.
- **Mobile-Verhalten**: Galerie als horizontaler Scroll-Snap (statt 3-Spalten-Grid). Hero-Foto darf 100vh füllen mit klarer H1.
- **Farb-Verwendung**: ein Akzent durchgängig (Burgund/Indigo/Anthrazit-Gold), nie 3+ Akzente vermischen.

## Negativ-Beispiele (anti-pattern)

| Was vermeiden | Warum |
|---|---|
| Stockfoto "Frau mit Klemmbrett" als Hero | Generic, austauschbar, kein Werkstatt-Bezug |
| Generic-AI-Gradient-BGs (Pink-Lila-Verlauf) | Wirkt nach Lovable/Canva-Output, nicht nach Handwerksmeister |
| 3 Akzentfarben gleichzeitig (Blau + Orange + Gelb) | Klassischer Wix-Template-Look, nicht Premium |
| "Wir sind Ihre Experten für Tischlerei" als H1 | Generic-Floskel, ersetzt keine Story |
| Karussell mit 8+ Fotos im Hero | Zerstört Hierarchie, Mobile-Performance-Killer |
| Comic-Sans-Anmutung-Schrift im Werkstatt-Look | Bricht das Premium-Versprechen |
| Stock-Icon-Set (FontAwesome) für Leistungen | Zu generisch — Branchen-Icons besser custom oder gar keine |

## Look-Mapping pro Recipe

| Recipe | Sub-Branche-Beispiel | Reference-DNA |
|---|---|---|
| 1 Werkstatt | Tischlerei, Schmied, Buchbinder, Restaurator, Polsterer | atelier-koreneff.com, schmiedevoeltzer.de — Material-fokussiert, Werkstücke-Galerie als Hauptattraktion |
| 2 Modern | Elektriker, Installateur, Solartechnik, Smart-Home | smarthome-installateur-musterfirma.at — Tech-modern, Sec-Fakten prominent |
| 3 Premium | Goldschmied, Designer-Tischler, Restaurator-Premium | goldschmied-thaler.at — Editorial, Premium-Whitespace, Auszeichnungen-Logo-Strip |

## Skill-Prompt-Vorlage (für späteren Recipe-Bau)

```
Designe ein Hero + Leistungen-Section für Recipe 1 Handwerk-Werkstatt.

Theme-Tokens: Rustikal aus themes.md (Unna Serif, Burgund #7a3528, Tannengrün #2d5d3f, Noise-Filter-Hintergrund).

Style-DNA: siehe handwerk.md Visual-DNA. Material-fokussiert, Werkstücke-Detail-Fotos, Hände-am-Werk. KEIN Stockfoto-Klischee. Editorial-Whitespace.

Anti-Pattern: keine Generic-AI-Gradient-BGs, keine 3+ Akzentfarben, keine Stock-Icon-Sets, keine "Wir sind Ihre Experten"-Floskeln.

Section-Toggles: Trust-Bar an, Galerie an, Bewertungen-cards.

Mobile: Hero 100vh, Galerie als horizontaler Scroll-Snap.
```

---

*Living Document. Bei jedem neuen Top-Beispiel hier ergänzen + design-reviewer informieren.*
