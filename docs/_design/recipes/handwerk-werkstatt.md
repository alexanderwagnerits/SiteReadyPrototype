# Recipe 1 — Handwerk · Werkstatt

> **Anker-Recipe #1** auf **Beta-Stil-Basis** (Linie ab 2026-05-11). Mockup: [`public/mockup-recipe-handwerk-werkstatt.html`](../../../public/mockup-recipe-handwerk-werkstatt.html). Persona im Mockup: Tischlerei Pichler · Steinakirchen am Forst · 3. Generation seit 1958.

**Stand:** 2026-05-11
**Status:** `[PHASE 1 FERTIG]` — Beta-Stil-Mockup vorhanden, gefaellt dem User („einfach und schlicht")

---

## Linie ab 2026-05-11

Recipe = **Beta-Template + Inhalte + Akzentfarbe + Section-Toggles**. Mehr nicht. Keine eigenen Polish-Patterns pro Branche (Verwurf der v2-Themes-Architektur — siehe `themes.md` Verworfen-Banner).

---

## Recipe-Identitaet

| Aspekt | Wert |
|---|---|
| Berufsgruppe | Handwerk |
| Look | Werkstatt |
| Stil-Klasse (Beta-Live) | `.stil-modern` (Plus Jakarta Sans / Space Grotesk) |
| Akzentfarbe | Bronze `#926f39` (warmer Holz-Ton, recipe-default — User-Wahl moeglich) |
| Heading-Font | Space Grotesk (Beta-Modern-Default) |
| Body-Font | Plus Jakarta Sans (Beta-Default) |

**Hinweis:** `.stil-rustikal` als separates Theme wird **nicht** eingefuehrt. Werkstatt-Look entsteht durch `.stil-modern` + warmer Akzent. Falls fuer einzelne Recipes ein Serif-Heading gewuenscht ist (Premium-Werkstaette), kann das ein Recipe-Variant innerhalb `.stil-modern` sein (Font-Override per Token).

---

## Section-Reihenfolge (Beta-Stahlbau-Stockmeister-Stil)

```
Nav (Sticky-Glass)
  ↓
Hero (Foto-BG mit dunklem Overlay, Eyebrow-Pill, H1, Lead, 2 CTAs, 2 Trust-Pills)
  ↓
Leistungen — 6 Cards im 3-Grid (Icon-Kreis + H3 + Description)
  ↓
Mid-Page-CTA-Block (Foto-BG, weisser Pill-CTA)
  ↓
Ablauf — 4 Schritte horizontal mit Pfeil-Folge
  ↓
Über — Grain-BG-Section, Text + Vorteile-Liste mit Check-Kreisen
  ↓
FAQ — 5 Fragen im 2-Spalten-Accordion
  ↓
Kontakt — Adresse / Tel / Mail / Öffnungszeiten + Map-iFrame + 3 Gut-zu-wissen-Infos + Form
  ↓
Footer (3-Spalten-Grid: Brand+Tel / Leistungen / Links)
  ↓
Float-CTA (Tel-Button rechts unten, mobile)
```

**Bewusst weggelassen** (kommt im Beta-Live auch nicht vor):
- Galerie-Section (im Live-Beta nicht im Template; Werkstuecke kommen ueber Leistungen-Cards oder spaeter optional)
- Bewertungen-Section (im Live-Beta nicht im Template; kann ueber CTA-Block o.ae. signalisiert werden)
- Stats-Block / Stempel (v2-Polish, verworfen)
- Team-Avatar-Grid (im Beta-Live nicht im Template)
- Pull-Quote (v2-Polish, verworfen)

---

## Recipe-Variation-Hebel

| Hebel | Quelle | Beispiel Pichler |
|---|---|---|
| Akzentfarbe (`--accent`) | Recipe-Default + ggf. User-Override | Bronze `#926f39` |
| Hero-Foto-URL | Kunden-Upload (im Live) bzw. Picsum (Mockup) | `picsum.photos/seed/pichler-werkstatt-hero` |
| Stil-Klasse | `.stil-klassisch / .stil-modern / .stil-elegant` | `.stil-modern` (Default fuer Handwerk-Modern und -Werkstatt) |
| Leistungen-Anzahl | aktuell 6 Cards Default | 6 |
| Section-Toggles | FAQ, Ablauf, CTA-Block — Branchen-Default | alle 3 an fuer Werkstatt |
| Inhalt | Onboarding-Form + ggf. Site-Import + KI-Generierung | Tischlerei-Pichler-Persona |

---

## Inhalts-Slots fuer Pichler (Mockup)

| Slot | Wert |
|---|---|
| Hero-Eyebrow | „Tischlerei Pichler, Mostviertel" (`hero-sub has-firma`) |
| Hero H1 | „Massivholz aus dem Mostviertel. Seit 1958." |
| Hero Lead | „Tische, Treppen und Möbel aus Eiche, Nussbaum oder Lärche. Holz aus drei Forstbetrieben in der Region." |
| Hero CTA-Primary | „Aufmaß anfragen" (Tel-Link) |
| Hero CTA-Secondary | „Leistungen ansehen" |
| Hero Trust-Pill 1 | „Tischler-Innung NÖ" |
| Hero Trust-Pill 2 | „Lehrbetrieb seit 1972" |
| Leistungen (6) | Massivholzmöbel · Innenausbau · Küchen nach Maß · Treppen aus Massivholz · Restaurierung · Reparaturen |
| Mid-CTA-Heading | „Aus Holz, das hält" |
| Mid-CTA-Lead | „Esstisch, Treppe oder Restaurierung — schicken Sie uns eine Skizze oder ein Foto." |
| Ablauf (4) | Anfrage · Aufmaß vor Ort · Festpreis · Lieferung & Montage |
| Über-H2 | „Über die Tischlerei" |
| Über-Text | Drei-Generationen-Story (Anton 1958 → Franz 1985 → Markus 2014), Holz aus 50 km Umkreis, 2 Jahre Trocknung |
| Über-Vorteile (5) | Generationen / Holz-Herkunft / Eigene Trocknung / Eigene Tischler-Montage / Lehrbetrieb |
| FAQ (5) | Einzelstücke? · Dauer? · Festpreis bindend? · Lieferung nach Wien? · Holz-Empfehlung? |
| Kontakt-Adresse | Hauptstraße 24, 3262 Steinakirchen am Forst |
| Kontakt-Tel | +43 7488 7234 |
| Kontakt-Mail | werkstatt@tischlerei-pichler.at |
| Öffnungszeiten | Mo–Fr 7:30–17:00 · Sa nach Vereinbarung |
| Footer-Tagline | „Tische, Treppen und Möbel aus Massivholz — Familienbetrieb in dritter Generation." |

---

## Live-Bau-Diff zum Beta-Template

**Minimal.** Beta-Template (`functions/templates/template.js`) kann das Recipe heute schon fast 1:1 rendern. Was zu pruefen / klein zu ergaenzen ist:

| Aspekt | Status | Live-Bau-Aufgabe |
|---|---|---|
| Stil-Klasse | `.stil-modern` existiert | ✅ nichts zu tun |
| Hero-Foto-BG mit Overlay | Beta hat das (`#sr-hero` style mit `linear-gradient + url(...)`) | ✅ nichts zu tun |
| 6 Leistungs-Cards | Beta-Template-Default | ✅ nichts zu tun |
| Ablauf 4 Schritte | Beta hat `.sr-ablauf-h` | ✅ nichts zu tun |
| Über mit `.sr-grain` + Vorteile-Liste | Beta-Default | ✅ nichts zu tun |
| FAQ Accordion 2-Spalten | Beta-Default | ✅ nichts zu tun |
| Kontakt + Google-Maps iFrame + Form | Beta-Default | ✅ nichts zu tun |
| Footer 3-Spalten | Beta-Default | ✅ nichts zu tun |
| Float-CTA Tel-Button | Beta-Default | ✅ nichts zu tun |
| Akzent-Override Bronze pro Tischlerei | Recipe-Default-Tabelle ergaenzen | **Recipe-Default-Akzent pro Berufsgruppe-Look definieren** — siehe `recipe-konfiguration.md` |
| Branchen-spezifische Trust-Pills | Heute nur generische Pills | **Branchen-Default-Trust-Pills definieren** (Innung pro Gewerk, Lehrbetrieb-Flag, Region) |
| Branchen-spezifische Leistungs-Defaults | Heute KI-generiert per Auftrag | **Branchen-Default-Leistungen pro Recipe definieren** als Fallback / Vorschlag |

**Konsequenz:** Phase-1-Recipes lassen sich praktisch ohne Template-Aenderung umsetzen. Hauptarbeit ist **Inhalts-Defaults pro Recipe** (Trust-Pills, Leistungs-Themen, FAQ-Themen, Ablauf-Vokabular).

---

## Reference-DNA-Check (aus `references/handwerk.md`)

- [x] **Foto-Sprache:** Werkstuecke-Detail im Hero-BG (Mockup: Picsum, Live: echte Kunden-Fotos)
- [x] **Typografie:** Space Grotesk + Plus Jakarta Sans (Beta-Modern) — fuer Werkstatt akzeptabel, kein Serif noetig
- [x] **Whitespace:** Beta-Default
- [x] **Trust-Signale:** Innung + Lehrbetrieb als Hero-Trust-Pills, Drei-Generationen-Story in Über-Section
- [x] **Mobile-Verhalten:** Beta-Default (Hamburger, sticky Float-CTA)
- [x] **Farb-Verwendung:** ein Akzent (Bronze) durchgaengig

**Verworfene Polish-Patterns (NICHT mehr benutzen):**
- ❌ Italic-Em-Akzente in Headings
- ❌ Rustikal-Stempel
- ❌ Photo-Frame (8px white border)
- ❌ Alternierende Leistungen mit grossem Foto
- ❌ Stats-Block mit erzaehlerischen Labels
- ❌ Bewertungen-Cards mit heterogenen Sternen
- ❌ Galerie mit Editorial-Captions

---

## Phase-2-Section-Specs-Ableitung

Sections, die Phase-2-Spec brauchen (aus diesem Recipe abgeleitet):

1. **Hero** — Eyebrow-Pill mit Firmenname/Ort, H1, Lead, 2 CTAs, 2 Trust-Pills. Foto-BG mit dunklem Overlay. (Beta-Template-Default — Spec dokumentiert)
2. **Leistungen-Card-Grid** — 3-spaltiges Grid, Icon-Kreis + H3 + Description. Branchen-Default fuer Anzahl + Themen. (Beta-Template-Default)
3. **Mid-CTA-Block** — Foto-BG mit schwarzem Overlay, weisser Pill-CTA. (Beta-Default)
4. **Ablauf-4-Schritte** — horizontale Pfeil-Folge mit Kreis-Nummern. (Beta-Default)
5. **Über mit Grain-BG + Vorteile-Liste** — Check-Kreis-Items, paragraph davor. (Beta-Default)
6. **FAQ-Accordion-2-Spalten** — Standard. (Beta-Default)
7. **Kontakt-Block** — Items + Map-iFrame + Trust-Infos + Form. (Beta-Default)
8. **Footer-3-Spalten** — Brand+Tel / Leistungen / Links. (Beta-Default)

→ Phase 2 ist eigentlich „**Dokumentation, was im Beta-Template bereits spec'd ist, plus Branchen-Default-Inhalts-Slots**". Keine neuen Patterns.

---

## Phase-3-Polish-Backlog

Beta-Template hat Animationen schon: `fade-up`, `stagger-children`, Hero-Pageload-Reveal, Hover-Pfeil-Slide, Ablauf-Steps-Reveal, Vorteile-Check-Pop. Was Phase-3 noch zu schliessen hat:

- Foto-Quality-Threshold fuer Hero-BG (wann gilt Foto als „akzeptabel"?)
- Branchen-spezifische Recipe-Inhalts-Defaults konkretisieren (16 Berufsgruppen × Looks → Default-Trust-Pills, Default-Leistungs-Themen, Default-FAQ-Themen)
- Lighthouse-Performance-Pass

---

## Verbindung zu anderen Dokumenten

- [`themes.md`](../themes.md) — **`[VERWORFEN 2026-05-11]`**, NICHT als Referenz
- [`recipe-konfiguration.md`](../recipe-konfiguration.md) — Spalte „Leistungen alternierend/kompakt" entfaellt; Stil-Klasse pro Recipe ist Beta-`.stil-klassisch / .stil-modern / .stil-elegant`
- [`references/handwerk.md`](../references/handwerk.md) — Reference-DNA bleibt gueltig
- [`functions/templates/template.js`](../../../functions/templates/template.js) — Beta-Live-Template, ist die Linie
- Live-Vergleichs-Sites: `https://sitereadyprototype.pages.dev/s/stahlbau-stockmeister` (Handwerk-naehe), `https://sitereadyprototype.pages.dev/s/bar-nachtschicht` (Gastro)

---

*Living Document. Bei Beta-Template-Aenderungen aktualisieren.*
