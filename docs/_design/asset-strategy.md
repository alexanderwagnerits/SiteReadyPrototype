# Asset- + Photography-Strategie — instantpage.at

> **Block C.12** aus `DESIGN-VISION.md`. Foto-Provider, Foto-Kuratierung, Icon-Set, Illustrations. Was wir verwenden, was wir verwerfen, mit welcher Quality-Bar.

**Stand:** 2026-05-14 — `[SPEC]` Tool-Defaults entschieden, Budget-Items als Trade-off-Optionen markiert (User-Entscheidung wo notwendig).

---

## 1. Stockfoto-Provider

### Entscheidung: Unsplash API als Default + Pexels als Fallback `[ENTSCHIEDEN 2026-05-14]`

**Pro Unsplash:**
- Lizenz: Unsplash License (sehr permissiv, kommerziell ohne Attribution-Pflicht)
- Free-API mit hoher Quote (50 Requests/h ohne Auth, 5.000/h mit Application)
- Sehr breite Bibliothek, gute Editorial-Qualitaet
- Search-API mit Filtern (Orientation, Color, Topic)

**Pro Pexels als Fallback:**
- Alternative Pool wenn Unsplash-Suche schwache Ergebnisse liefert
- Aehnliche Lizenz (kostenfrei kommerziell)
- Andere Foto-Aesthetik (etwas weniger Hipster-Stockfoto-Vibe)

**Verworfen:**
- **Lizenzierte Bibliothek** (Adobe Stock, iStock): ~30–80 € pro Bild, fuer 30+ Recipes × 5 Bilder = 4.500–12.000 € — Phase 1 nicht im Budget. Spaeter optional fuer Premium-Recipes.
- **Pixabay**: schwaechere Qualitaet, mehr Werbung-AI-generierter Bilder seit 2024

**Tooling-Setup (Live-Bau Phase 2):**
- `functions/api/photo-search.js` ruft Unsplash API auf, mit Pexels-Fallback bei < 5 Ergebnissen
- Subprozessor-Liste in `LIVE-COMPLIANCE.md` § 4 hat Unsplash bereits gelistet (`[URL] later Live`) — Pexels muss bei Aktivierung ergaenzt werden

---

## 2. Foto-Kuratierung pro Branche

**Frage:** blinder API-Call vs. manuelle Whitelist?

### Default-Workflow: Hybrid `[ENTSCHIEDEN 2026-05-14]`

**Whitelist pro Berufsgruppe** (14 Berufsgruppen, siehe `project_berufsgruppen_refactor.md`):
- 20–30 vorab kuratierte Foto-IDs pro Berufsgruppe in `config/photo-whitelist.json` (Live-Repo)
- Generierter Hero + Galerie-Defaults: zuerst aus Whitelist (deterministische Qualitaet)
- Erschoepfung der Whitelist (z.B. wenn 30+ Sites pro Berufsgruppe + viele Foto-Plaetze): Fallback auf Unsplash-Search mit Branchen-Keywords
- Kunde kann eigene Fotos hochladen (Standard-Workflow im Portal)

**Begruendung:**
- Blinder API-Call liefert oft Stockfoto-Klischees (lachende Geschaeftsleute mit Daumen hoch) — gegen `quality-standards.md` § 3 Anti-AI-Generic
- Manuelle Whitelist = Inhaber-Zeit-Investment, aber Quality-Garantie
- Hybrid skaliert: Erst 14 × 20 Fotos kuratieren (~5–7 Tage Inhaber-Zeit), dann iterativ erweitern

**Aufwand Pre-Launch:**
- Kuratierung Phase 1: 14 Berufsgruppen × 20 Bilder × 30 s Auswahl-Zeit = ~2,3 h pro Berufsgruppe, gesamt **~4–5 Arbeitstage**
- Pro Foto in Whitelist: ID + Branche + Use-Case-Tag (Hero / Galerie / About / Service-Card)

---

## 3. Quality-Bar fuer Fotos

| Kriterium | Mindest | Begruendung |
|---|---|---|
| Aufloesung | ≥ 1920 × 1080 px | Retina-tauglich auf Desktop, Mobile mit Lazy-Resize |
| Farbprofil | sRGB | Cross-Browser-Konsistenz |
| Komprimierung Live | max 250 KB pro Hero, max 120 KB pro Card | Lighthouse-LCP < 2.5 s (DESIGN-VISION § 13.1) |
| Aspect-Ratios | Hero 16:9 oder 21:9, Galerie 4:3 oder 3:2, About 1:1 | Recipe-Konsistenz |
| Stil | echte Szenen, keine Compositing-Tricks, kein „People-Looking-At-Camera" | Anti-Stockfoto-Klischee |
| Gesichter | dezent, nicht Hauptfokus (KMU-Inhaber sollte sich nicht von zu prominenten Fremdgesichtern bedraengt fuehlen) | Trust-Vibe |
| KI-generiert | NEIN — keine Midjourney/DALL-E/Stable-Diffusion-Bilder | AI-Act + Trust-Vibe + Hard-Block bei Plattformen wie Unsplash schon vorgefiltert |

**On-the-fly-Optimierung (Live-Bau Phase 0, siehe `ARCHITECTURE.md` § 4.8):**
- Sharp-Resize auf 3 Breakpoints (1920 / 1280 / 720 px)
- WebP + AVIF mit JPEG-Fallback
- Lazy-Loading via `loading="lazy"` ausser Hero (LCP-kritisch)

---

## 4. Eigene Foto-Sessions fuer Top-Recipes (Budget-Trade-off)

**Frage:** lohnt sich eine eigene Foto-Session fuer die Top-3 Recipes (Anwalt-Klassisch, Handwerk-Werkstatt, Gastro-Editorial)?

**Trade-off:**

| Option | Aufwand | Vorteil | Risiko |
|---|---|---|---|
| **A: Kein eigenes Shooting Phase 1** | 0 € | Schnell, Foto-Whitelist reicht | Recipes sehen Stockfoto-y aus, weniger differenziert von Wix/Jimdo |
| **B: 1 Pro-Foto-Session fuer 3 Anker-Recipes** | ~1.500–3.000 € (Fotograf + Location-Mieten + Modelle) | Showcase-Qualitaet, Marketing-Asset, „echtes AT" | Budget-Belastung, Logistik-Aufwand |
| **C: Inhaber-Foto-Session mit guter Kamera** | ~200–500 € (Equipment-Miete falls noetig) | Authentisches AT, gratis ueber Whitelist hinaus | Qualitaet-Risiko, Zeit-Aufwand Inhaber |

**Entscheidungs-Hinweis:** Option A fuer Pre-Launch, Option B oder C nach 50+ Kunden (wenn Conversion-Lift messbar). User entscheidet — `[ENTSCHEIDUNGS-OFFEN]`.

**Wo es einen echten Differentiator-Hebel gibt:** Showcase-Sektion auf Marketing-Site (`MARKETING.md` § 3.2). Echte AT-Kundenseiten sind starke Trust-Signale — Option B liefert ggf. das Visual-Material fuer den Showcase, aber nur wenn keine echten Kunden-Sites verfuegbar.

---

## 5. Icon-Set

### Entscheidung: Lucide `[ENTSCHIEDEN 2026-05-14]`

**Pro Lucide:**
- Standard-Set in Tailwind-/shadcn-Stack (siehe `MIGRATION-PLAN.md` § 3.2 Initial-Stack)
- ~1.500+ Icons, sehr breit
- Konsistente Stroke-Width (Standard 1.5px, anpassbar)
- Open-Source MIT-Lizenz
- Aktive Pflege (Fork von Feather Icons + ueberholt)

**Verworfen:**
- **Phosphor**: schoene Multi-Weight-Variante, aber weniger weit verbreitet. Wechsel-Pain in shadcn-Komponenten.
- **Heroicons**: kleiner Set (~300), Tailwind-Standard ja, aber Lucide hat bessere Breite.
- **Eigenes Icon-Set**: fuer KMU-Builder unverhaeltnismaessig, zumal Lucide breit genug ist.

**Konventionen:**
- Default-Size 20px im Body, 16px in Sidebar/Buttons, 24px in Empty-States, 32px in Diagnostik/Hero-Akzent
- Default-Stroke 1.5px, in Akzentfarbe wenn auf Akzent-Background
- Lucide-React-Import: `import { IconName } from "lucide-react"`

---

## 6. Illustration-Style

### Entscheidung: keine Custom-Illustrationen Phase 1 `[ENTSCHIEDEN 2026-05-14]`

**Begruendung:**
- KMU-Sites kommen meist ohne Illustrationen aus — Fotos + Icons reichen
- Custom-Illustrationen waeren Inhaber-Zeit-Investment (Illustrator-Brief + Iterationen + Lizenz)
- Generic-Illustrations (unDraw, Storyset) wirken AI-Generic — gegen `quality-standards.md` § 3 Anti-AI-Generic
- Plattform-Marketing-Site kann Punktuell dezente Mini-Illustrationen ergaenzen (siehe Block B.5), aber kein Brand-System aufbauen

**Wenn doch jemals noetig:**
- Custom-Illustrator-Brief mit AT-Vibe-Anker (cpg.at-Style — siehe `_design/benchmarks-plattform.md` #12)
- Konsistente Farb-Palette: max 3 Farben aus BRAND.md Palette
- SVG-Format mit dezenter Stroke, kein Cartoonen-Vibe

---

## 7. Connection

- `ARCHITECTURE.md` § 4.8 — Storage Bucket `customer-assets` + Sharp-Resize
- `LIVE-COMPLIANCE.md` § 4 — Subprozessor Unsplash (gelistet, DPA-URL)
- `BRAND.md` § 9 — visuelle Sprache Plattform
- `_design/quality-standards.md` § 1 + § 3 — Performance-Limits + Anti-AI-Generic-Regeln
- `_design/recipe-konfiguration.md` — Recipe-Konfig pro Berufsgruppe
- `MARKETING.md` § 3.2 — Kunden-Showcase (Foto-Asset-Quelle alternativ)
- `MIGRATION-PLAN.md` § 3.2 — Initial-Stack (shadcn/Tailwind = Lucide-Standard)
