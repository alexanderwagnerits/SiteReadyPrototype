# Brand Guide — instantpage.at

> **Skeleton.** Wird befüllt während Phase 0 + 1 des Live-Bau.

**Stand:** 2026-05-04 (Skeleton)

---

## Status

`[SKELETON]` — Inhaltsverzeichnis steht. Brand-Wechsel SiteReady → instantpage.at wird in Phase 0 vollzogen, Voice-&-Tone-Regeln entstehen aus Memory-Konventionen.

---

## Inhalt (geplant)

1. Brand-Identität
2. Logo + Wortmarke
3. Farbpalette (Plattform vs. Kundenseiten)
4. Typografie
5. Voice & Tone
6. Anrede-Regeln
7. Slogans + Marketing-Texte
8. Verbotene Begriffe (UWG)
9. Visuelle Sprache (Plattform-UI)

---

## 1. Brand-Identität

`[OFFEN]` — Brand-Wechsel:

- **Alt:** SiteReady (Prototyp)
- **Neu:** instantpage.at (Live)
- **Rechtsträger:** Wagner IT Services e.U. (`[OFFEN]` final bestätigen)

Brand-Wechsel-Begründung in Memory `project_production_refactor.md` "Operative Live-Vorbereitung — Brand".

## 2. Logo + Wortmarke

`[OFFEN]` — Logo-Dateien:

- Aktuell: `public/logo.png` (SiteReady Wortmarke), `public/icon.png` (SiteReady Icon SR)
- Live: instantpage.at-Logo bereits vorhanden laut Memory `project_production_refactor.md` ("Logo + Domain bereits vorhanden")
- Beta-Bewertung: 3,86/5 — Memory-Notiz "okay, kein Iteration-Aufwand"

Logo-Verwendung-Regeln: `[OFFEN]` — Mindestabstand, Mindest-Größe, Hintergrund-Kontrast, monochrom-Versionen.

## 3. Farbpalette

`[OFFEN]` — zwei getrennte Welten:

### Plattform (instantpage.at)

`[OFFEN]` — wird in Phase 0 mit shadcn/ui-Theme definiert.

### Kundenseiten

→ siehe `RECIPE-SYSTEM.md` "Theme-Zuordnung pro Look" für Theme-Tokens. Pro Theme eigene Farbpalette + Akzentfarbe-Picker.

## 4. Typografie

### Plattform (instantpage.at)

Aktueller Prototyp (CLAUDE.md): DM Sans als Primär-Font, JetBrains Mono für Zahlen.
Live: `[OFFEN]` ggf. mit Stack-Modernisierung neu evaluieren.

### Kundenseiten

→ siehe `RECIPE-SYSTEM.md` Theme-Definitionen — pro Theme eigene Font-Wahl.

## 5. Voice & Tone

`[SKELETON]` — Konventionen aus Memorys:

| Konvention | Quelle | Anwendung |
|---|---|---|
| KMU-Sprache | Memory `feedback_portal_design.md` | keine Tech-Jargon, konkrete Beispiele |
| Sie (Default) | Memory `project_recipe_system_v1.md` | außer Branche legt Du nahe (Yoga, Coach, Tattoo) |
| Echte Umlaute | CLAUDE.md global | nicht ae/oe/ue, nicht Unicode-Escapes |
| Gegenüber Endkunden: keine Erwähnung KI | `_archive/PROJECT-STAND-MAERZ-2026.md` | Service wirkt als Black Box |

`[OFFEN]` — vollständiger Voice-&-Tone-Guide mit Do/Don't-Beispielen.

## 6. Anrede-Regeln

`[SKELETON]` — Pyramide laut `RECIPE-SYSTEM.md`:

1. Wenn Website importiert: aus Import-Text erkennen (Claude-Detection)
2. Sonst: Branchen-Default (Anwalt/Arzt/Steuerberater → Sie. Yoga/Coach/Tattoo → Du. Rest → Sie als sicherer AT-Standard)
3. Im Portal jederzeit überschreibbar (löst Re-Generation aus)

## 7. Slogans + Marketing-Texte

`[OFFEN]` — Vorabskizze defensive Slogans (siehe `LIVE-COMPLIANCE.md` § 15):

- "Premium-Website für österreichische KMU — KI-generiert, professionell, branchen-tauglich"
- "Marketing-Website ohne Agentur. Speziell für Handwerker, Gastronomen, Berater, Praxen."
- "Wir bauen Ihre Website. Sie bleiben Inhaber."
- "Schneller online. Professionell betrieben. Transparent abgerechnet."

## 8. Verbotene Begriffe (UWG)

→ vollständig in `LIVE-COMPLIANCE.md` § 15.

Kurzliste:

- "rechtssicher", "100% DSGVO-konform", "abmahnsicher", "garantiert"
- "die beste Plattform" (nicht belegbarer Superlativ)
- Vergleichende Aussagen ggü. Mitbewerbern ohne sachliche Grundlage

## 9. Visuelle Sprache (Plattform-UI)

`[OFFEN]` — entsteht mit shadcn/ui-Theme in Phase 0. Sollte konsistent zu Logo + Voice sein.

Memory `project_design_references_live.md` verweist auf cpg.at + Komi als Editorial-Referenzen — relevant für Kunden-Themes, weniger für Plattform-UI selbst.

---

## Verbindung zu anderen Dokumenten

- `RECIPE-SYSTEM.md` — Theme-Tokens für Kundenseiten
- `LIVE-COMPLIANCE.md` — verbotene Slogans, AGB-Klauseln zu Werbeaussagen
- `PRODUCT.md` — Marketing-Sprache pro Plan

## Verbindung zu Memory

- `project_design_references_live.md` — Editorial-Referenzen
- `feedback_portal_design.md` — KMU-Sprache
- `feedback_social_dezent.md` — dezente Marketing-Tonalität
