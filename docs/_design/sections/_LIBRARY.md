# Section-Library — frühe Mockup-Studie (NICHT mehr Source of Truth)

> ⚠️ **Status 2026-05-06: Diese Doku war eine zu komplexe Erst-Ableitung. Source of Truth für den Live-Bau ist jetzt [`../recipe-konfiguration.md`](../recipe-konfiguration.md)** — eine pragmatische Recipe-Tabelle auf Beta-Template-Basis (`functions/templates/template.js`). Die hier dokumentierten "branchen-spezifischen Sektionen" (Werkstücke-Tabelle, Vorher-Nachher-Slider, Material-Strip, Generationen-Liste, Hero-Sigel, Gewerbeschein-Box) wurden verworfen — zu komplex für SiteReady-Generator-Geist (KMU pflegt Daten im Portal).
>
> Die Doku bleibt als Studien-Referenz: zeigt was aus Mockup-Experimenten kam, nicht was produziert wird.

> **Stand:** 2026-05-06
> **Status:** Studie / verworfene Vorgänger-Doku. Aktiv: [`../recipe-konfiguration.md`](../recipe-konfiguration.md)

## Wie diese Library entsteht

Statt 25 Sektionen abstrakt zu spec'n, leiten wir sie reverse-engineering aus konkreten Recipes ab. Pro Recipe-Mockup notieren wir:
- Welche Sektionen werden verwendet?
- In welcher Reihenfolge?
- Welche Layout-Variante pro Sektion?
- Welche Sektionen sind branchen-spezifisch?

Daraus ergibt sich die Library: **gemeinsame Bausteine** (in mehreren Varianten) + **branchen-spezifische Bausteine** (für 1-3 Branchen relevant).

## Pilot-Recipes Sektion-Reihenfolgen

### Architekt-Klassisch (`mockup-themes-v2.html` — Variante "Klassisch")
```
Hero (text-led + Trust-Bar)
  → Leistungen (Layout: alternating Bild-Text)
  → Pull-Quote (zwischen Sektionen, dezent in Klassisch)
  → Ablauf (4 Steps horizontal)
  → Über (Color-BG) + Team innerhalb
  → Galerie (3-Grid mit Hover-Overlay)
  → Bewertungen (3 Cards)
  → FAQ
  → Kontakt (Info + Map + Features-Grid + Form)
  → CTA-Block
  → Footer
```

### Anwalt-Klassisch (`mockup-recipe-anwalt-klassisch.html`)
```
Hero (text-led + Trust-Bar mit RAK)
  → Rechtsgebiete (Layout: Kompakt-Grid 3×2 Hairline-Borders) ⭐ branchen-spezifisches Layout
  → Über (Color-BG) + Team innerhalb (3 Anwälte)
  → Honorar-Transparenz (Layout: 3-Card Pricing) ⭐ branchen-spezifisch
  → Stimmen (Layout: GROSS-Quote, 1 Zitat statt Cards) ⭐ Layout-Variante
  → FAQ
  → Kontakt (Info + Form + NOTFALL-BOX) ⭐ branchen-spezifisch
  → CTA-Block
  → Footer
```

### Tischlerei-Rustikal (`mockup-recipe-tischlerei-rustikal.html`) — anti-AI-Pass
```
Hero (Vater-Sohn-Story-Layout, Sigel-Element rechts statt Trust-Bar)
  → Material-Strip (Holzarten als horizontaler Strip) ⭐ branchen-spezifisch
  → Werkstücke (Tabellen-Layout mit Maß + Holz + Preis) ⭐ branchen-spezifisch
  → Vorher-Nachher (Slider mit Divider-Line, 3-Card-Grid) ⭐ branchen-spezifisch
  → Story (Vater-Sohn-Foto + langer Text + Pull-Quote) ⭐ Layout-Variante
  → Generationen-Liste (statt 3-Card-Team-Grid) ⭐ Layout-Variante
  → Kontakt (Werkstatt + Zeiten + Gewerbeschein-Box) ⭐ branchen-spezifisch
  → Footer (kein CTA-Block — Werkstätten haben Termin-Anruf statt Web-CTA)
```

### Restaurant-Edel (`mockup-recipe-restaurant-edel.html`)
```
Hero (Magazine-Style mit Display-Italic, asymmetrische Heads)
  → Speisen-Karte (Gänge mit Preisen, Menü-Layout) ⭐ branchen-spezifisch
  → Über (Story-Format, narrativ) ⭐ Layout-Variante
  → Magazine-Galerie (Asymmetric 12-Grid mit Span-Variation) ⭐ Layout-Variante
  → Reservierung-CTA (Telefon prominent, kein Form) ⭐ branchen-spezifisch
  → Stimme (1 GROSS-Quote, Magazine-Pull) ⭐ Layout-Variante
  → Adresse + Öffnungszeiten (kein Form, nur Info + Map) ⭐ Layout-Variante
  → Footer (kein CTA-Block!)
```

## Erkenntnisse — Bausteine + Varianten

### Universelle Sektionen (alle 3 Recipes)
| Sektion | Pflicht | Varianten gesehen |
|---|---|---|
| **Nav** | ✓ | identisch (Brand + Links) |
| **Hero** | ✓ | text-led (Anwalt, Architekt), Magazine-Display (Restaurant) |
| **Hero-Trust-Bar** | optional | mit Mitgliedschaften (Architekt, Anwalt) |
| **Footer** | ✓ | 4-spaltig (Architekt, Anwalt), 3-spaltig editorial (Restaurant) |

### Häufige Sektionen (2 von 3 Recipes)
| Sektion | Recipes | Varianten gesehen |
|---|---|---|
| **Über/Story** | alle | Color-BG mit Vorteilsliste (Architekt, Anwalt), Story-Format zentriert (Restaurant) |
| **Team** | Architekt, Anwalt | innerhalb der Über-Sektion, 3-Avatar-Grid |
| **Galerie** | Architekt, Restaurant | 3-Grid-einfach (Architekt), Magazine-Asymmetric 12-Spalten (Restaurant) |
| **Stimmen/Bewertungen** | alle | 3-Card-Grid (Architekt), 1 großes Quote (Anwalt + Restaurant) |
| **FAQ** | Architekt, Anwalt | identisch (Layout 280px+1fr, details/summary) |
| **Kontakt** | alle | Info+Map+Form+Features (Architekt), Info+Form+Notfall (Anwalt), Info+Map nur (Restaurant) |
| **CTA-Block** | Architekt, Anwalt | identisch ("Sie haben ein Vorhaben/Anliegen?") |

### Branchen-spezifische Sektionen
| Sektion | Recipe | Beschreibung |
|---|---|---|
| **Rechtsgebiete** | Anwalt | 3×2 Kompakt-Grid mit Hairline-Borders, Nummerierung, Mehr-Erfahren-Link |
| **Honorar-Transparenz** | Anwalt | 3 Pricing-Cards (Stundenhonorar / Pauschal / Erstgespräch), eine featured-dunkel |
| **Notfall-Box** | Anwalt (innerhalb Kontakt) | Rote Box mit 24/7-Hotline, Pulse-Dot, separater Tel-Nummer |
| **Speisen-Karte** | Restaurant | Gänge mit römischen Numerals, Items mit Beschreibung + Tags + Preis, Editorial-Note |
| **Reservierung-CTA** | Restaurant | Vollbild-Color-Sektion, Telefon-Nummer als gigantisch-italic, kein Formular |
| **Öffnungszeiten-Liste** | Restaurant + Tischlerei (innerhalb Kontakt) | DT/DD-Liste mit "geschlossen" italic in accent-color |
| **Ablauf/Phasen** | Architekt | 4 Steps horizontal mit Mono-Numbers |
| **Leistungen alternierend** | Architekt | Bild-Text alternierend (even = direction:rtl) |
| **Material-Strip** | Tischlerei | Horizontaler Strip mit Material-Eigenschaften + Herkunft (Hand-Schrift-Akzent) |
| **Werkstücke-Tabelle** | Tischlerei | Tabellen-Layout: Nummer · Name + Beschreibung · Maße + Holz · Preis-italic |
| **Vorher-Nachher-Karten** | Tischlerei | 3-Card-Grid mit Image-Split + Divider-Line + Vorher/Nachher-Labels + Card-Frame |
| **Story-mit-Pull-Quote** | Tischlerei | 2-Spalten Foto + Text mit eingebettetem Quote-Block, narrativ |
| **Generationen-Liste** | Tischlerei | Liste statt Card-Grid: Roman-Number · Bio · Mono-Meta. Für Mehrgenerationen-Betriebe |
| **Hero-Sigel** | Tischlerei | Großes rundes Stempel-Element mit Curve-Text statt Trust-Bar — für Traditions­betriebe |
| **Generations-Strip im Hero** | Tischlerei | 3 Spalten mit Jahr + Name + Rolle statt Trust-Bar |
| **Gewerbeschein-Box** | Tischlerei | Mini-Tabelle mit Firmenbuch/UID/Gewerbe/Innung — typisch österreichisch |

### Layout-Varianten pro Sektion (was wir bisher kennen)

**Hero**
- A: text-led mit Trust-Bar (Architekt, Anwalt)
- B: Magazine-Display Italic (Restaurant)
- (offen) C: photo-led / split / fullbleed laut DESIGN-VISION.md

**Leistungen**
- A: alternierend Bild-Text (Architekt)
- B: Kompakt-Grid 3×2 mit Hairlines (Anwalt — als "Rechtsgebiete" branchen-übersetzt)
- C: Gänge mit Preisen Editorial (Restaurant — als "Speisen-Karte" branchen-übersetzt)
- (offen) D: vorher-nachher (für Handwerk geplant)

**Über**
- A: Color-BG 2-Spalten + Vorteilsliste + Stats (Architekt, Anwalt)
- B: Story-Format zentriert + Pull-Quote-Mark + Signatur (Restaurant)

**Galerie**
- A: 3-Grid einfach mit Hover-Overlay (Architekt)
- B: Magazine 12-Spalten Asymmetric (Restaurant)
- (offen) C: Masonry / Slider

**Stimmen/Bewertungen**
- A: 3 Card-Grid mit Avatar+Quote (Architekt)
- B: 1 großes Quote mit Border-Left + Rating-Bar (Anwalt)
- C: 1 großes Magazine-Pull-Quote zentriert + Source-Tag (Restaurant)
- D: Eingebettet in Story-Sektion (Tischlerei) — kein eigener Block, sondern Pull-Quote im Fließtext

**Hero**
- A: text-led mit Trust-Bar (Architekt, Anwalt)
- B: Magazine-Display Italic (Restaurant)
- C: Vater-Sohn-Story mit Generations-Strip + Sigel (Tischlerei) — für Traditionsbetriebe

**Team**
- A: 3-Avatar-Grid mit Initials (Architekt, Anwalt) — innerhalb Über-Sektion
- B: Liste statt Grid mit Jahres-Marken + Bio + Meta (Tischlerei) — für Mehrgenerationen
- C: Story-Foto im Über-Format (Tischlerei alternativ)

**Kontakt**
- A: Info + Map + Features-Grid + Form (Architekt)
- B: Info + Form + branchen-spezifische Box (Anwalt mit Notfall)
- C: Info + Map + Öffnungszeiten-Liste, KEINE Form (Restaurant)

## Was das für den Live-Bau heißt

**Section-Library im Backend = Component-Library** mit:
1. Universelle Sektionen (Hero, Über, Kontakt, Footer) — pflichtteil aller Recipes
2. Häufige Sektionen (Team, Galerie, Stimmen, FAQ, CTA-Block) — opt-in pro Recipe
3. Branchen-spezifische Sektionen (Rechtsgebiete, Honorar, Notfall, Speisen-Karte, Reservierung, Phasen-Ablauf, Werkstücke, Sprechzeiten, Zimmer-Karten, etc.) — pro Berufsgruppe ihr eigenes Set

**Pro Sektion: Layout-Varianten als Props** — z.B. `<Stimmen variant="cards|quote|magazine-pull" rating-position="header|footer|none" />`

**Recipe-Definition** (Backend-Datenstruktur):
```ts
type Recipe = {
  berufsgruppe: 'anwalt' | 'restaurant' | 'architekt' | ...;
  theme: 'klassisch' | 'edel' | 'rustikal';
  sections: Array<{
    type: SectionType;          // hero | leistungen | rechtsgebiete | speisen-karte | ...
    variant?: string;            // layout-variant innerhalb der Sektion
    props?: Record<string, any>; // z.B. { showRating: true, showSocial: false }
  }>;
};
```

## Offene Recipes (21 von 24 noch nicht gemockt)

Hochpriorisiert für nächste Pilot-Erweiterung:
- **handwerk-werkstatt** (Tischler/Schmied) — bringt Vorher-Nachher-Galerie, Werkstück-Detail-Sektion
- **gesundheit-praxis** (Arzt/Zahnarzt) — bringt Sprechzeiten-Box, Behandlungs-Karten, evtl. Termin-Buchung
- **handwerk-bau** (Baumeister) — bringt Referenz-Projekte, Leistungs-Spektrum, Bauphasen

Mit diesen 6 Recipes (3 + 3) hätten wir einen guten Querschnitt der 12 Berufsgruppen und können die Section-Library auf ~12-15 Bausteine konkretisieren.

## Verbindung zu anderen Dokumenten

- [`themes.md`](../themes.md) — Theme-Tokens (Layer 1)
- [`../../RECIPE-SYSTEM.md`](../../RECIPE-SYSTEM.md) — Recipe-System-Architektur (Layer 1+2+3)
- [`../../DESIGN-VISION.md`](../../DESIGN-VISION.md) Block 9+10 — Spec-Anforderungen Section-Library + Recipe-Mockups
- `public/mockup-themes-v2.html` — Architekt-Klassisch (mit Edel + Rustikal Switcher)
- `public/mockup-recipe-anwalt-klassisch.html` — Anwalt-Klassisch
- `public/mockup-recipe-restaurant-edel.html` — Restaurant-Edel

---

*Living Document. Bei jedem neuen Recipe-Mockup hier ergänzen.*
