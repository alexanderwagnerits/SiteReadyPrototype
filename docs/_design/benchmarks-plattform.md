# Benchmarks Plattform — instantpage.at

> **Block A.1** aus `DESIGN-VISION.md`. 15–20 Plattform-Referenzen fuer instantpage.at selbst (Marketing-Site + Portal + Docs). Customer-Site-Referenzen separat in `benchmarks-recipes.md`.

**Stand:** 2026-05-14 — `[SKELETON]` 16 Referenzen kuratiert mit Take-aways aus Trainingswissen + AT-KMU-Kalibrierung. Screenshots optional (siehe „Verwendungs-Hinweis"). Inhaber-Review jederzeit moeglich.

---

## Verwendungs-Hinweis

**Wofuer:** Visual-/UX-Kalibrierung fuer Block 4 (Design-System), Block 5 (Marketing-Site), Block 6 (Portal). Pro Referenz: was uebernehmen, was bewusst anders machen.

**AT-KMU-Kalibrierung beachten** (Memory `feedback_at_vertrauensprodukt.md`): die genannten Vorbilder sind alles globale Tech-Brands. Pattern uebernehmen ja — Brand-Vibe NICHT 1:1 (Stripe-Pink ist nicht AT-Vertrauensprodukt). Pro Referenz unten ein expliziter „AT-KMU-Kalibrierung"-Block.

**Quellen fuer weitere Refs:** Awwwards, Site Inspire, Land-book, Mobbin, Lapa Ninja, Httpster, One Page Love. Plus AT-Tech-Szene (cpg.at, runtastic-Brand-Archiv, anymore.at, dynatrace.com falls relevant).

---

## Format pro Referenz

```markdown
### N. <Name>
**URL:** https://...
**Pages of interest:** Marketing-Home / Pricing / Docs / Dashboard / ...
**Screenshot:** `<path>.png` `[TODO User]` oder Pinterest-Pin-Link
**Take-aways:**
1. ...
2. ...
3. ...
**Relevanz fuer instantpage.at:** Block 4 / 5 / 6 — was konkret uebernehmen
**AT-KMU-Kalibrierung:** wo Pattern nicht 1:1 passt
```

---

## Plattform-Referenzen (16 kuratiert)

| # | Name | Hauptaussage |
|---|---|---|
| 1 | Stripe | Editorial Typo-Hierarchie + Code-as-Hero |
| 2 | Linear | Editorial Manifest + Mikro-Interaktionen mit Substanz |
| 3 | Vercel | Minimale Dashboard-Sidebar, Docs-Layout |
| 4 | Anthropic | Warme Farben + Serif + ruhige Atmosphaere |
| 5 | Mercury | B2B-Trust ohne Lautstaerke, UI-Screenshots als Hero |
| 6 | Resend | Fokussierte Marketing-Site, disziplinierte Farb-Diet |
| 7 | Frame | Templates-Gallery + Live-Editor im Hero |
| 8 | Plain | Verlegerische Aesthetik, Marketing-Long-Scroll mit Atemraum |
| 9 | Notion | Editor-IA + Empty-States + Inline-Tooltips |
| 10 | Cal.com | Trust-Anker (Open-Source), Pricing-Klarheit, Live-Demo-Hero |
| 11 | Cabin Analytics | EU/Privacy-First + ruhige Anti-„Wow-SaaS"-Aesthetik |
| 12 | cpg.at | AT-Editorial-Anker, warme Brand, Fotografie als Treiber |
| 13 | Wise Business | B2B-Trust durch konkrete Zahlen, Use-Case-Pages, interaktives Pricing |
| 14 | DeepL | DACH-B2B mit ruhiger Brand, Live-Demo, 2-Saeulen-Pricing |
| 15 | Webflow | Konkurrent-Schau + Showcase-Gallery + Vergleichs-Pattern |
| 16 | Beehiiv | Editorial Self-Service-Onboarding, Sofort-Vorschau-Hero |

---

### 1. Stripe
**URL:** https://stripe.com — plus https://stripe.com/docs, https://dashboard.stripe.com (eingeloggt)
**Pages of interest:** Home, Pricing, Docs, Dashboard-Onboarding-Flow
**Screenshot:** `[TODO User]`
**Take-aways:**
1. **Editorial-typografisches Hierarchie-System.** Marketing-Headlines nutzen massive Display-Schriften (84px+), Body kompakt mit deutlicher Hierarchie. Drei klare Stufen statt 12.
2. **Code/Visualisierungen als Hero-Element.** Statt Stock-Fotos zeigt Stripe Live-Code-Schnipsel + Diagramme — Funktion als Aesthetik. Pendant fuer instantpage.at waere Live-Recipe-Generation-Preview.
3. **Footer als Sitemap.** 6–8 Spalten, jeder Bereich auffindbar. Vermeidet „Marketing-Footer mit nur Social-Icons".

**Relevanz:** Block 5 (Marketing-Site Typo-Skala + Hero-Konzept), Block 6 (Dashboard-Onboarding-Flow).
**AT-KMU-Kalibrierung:** Stripe-Sprache ist developer-targeted (englisch, technisch). instantpage.at-Zielgruppe ist nicht-technisch. Hierarchie + Polish uebernehmen, Sprache 100 % anders.

---

### 2. Linear
**URL:** https://linear.app
**Pages of interest:** Home, Method-Page, Pricing, Changelog
**Screenshot:** `[TODO User]`
**Take-aways:**
1. **Editorial-Marketing-Site mit Manifest-Charakter.** Lange Scroll-Page mit „Method"-Seite die wie ein Essay liest. Sachlich, ueberzeugend, keine Bullet-Point-Frenzy.
2. **Mikro-Interaktionen mit Substanz.** Keyboard-Shortcut-Animationen, in-Browser-Demo-Snippets. Bewegung dient der Funktion, nicht der Show.
3. **Sehr beschraenkte Farbpalette.** Schwarz/Weiss + 1 Akzentfarbe (Lila). Kein Gradient-Wirrwarr.

**Relevanz:** Block 5 (Editorial-Marketing-Vibe statt SaaS-Standard), Block 11 (Mikro-Interaktionen).
**AT-KMU-Kalibrierung:** Linear ist Product-Management-Tool fuer Tech-Teams — Marketing-Sprache ist „we believe X". Die Substanz uebernehmen, den Manifest-Stil nicht (zu Silicon-Valley-Vibe fuer AT-KMU).

---

### 3. Vercel
**URL:** https://vercel.com — plus https://vercel.com/dashboard (eingeloggt)
**Pages of interest:** Home, Pricing, Docs-Layout, Dashboard
**Screenshot:** `[TODO User]`
**Take-aways:**
1. **Dashboard-Sidebar minimal.** Sehr wenige Top-Level-Items, klare Hierarchie, keine Sidebar-Wuerfel-Gruppierung. Pendant fuer instantpage.at-Portal-Navigation pruefen.
2. **Dark-First-Design.** Marketing + Dashboard konsequent Dark-Mode-first. Strategie-Frage fuer instantpage.at: Dark-Mode als Default vermeiden (KMU erwartet Light), aber Dark-Toggle erwaegen.
3. **Docs-Struktur als Side-Nav + Inline-TOC.** Sehr scanbar, KMU-tauglich falls instantpage.at-Hilfe-Bereich aehnlich organisiert wird.

**Relevanz:** Block 6 (Portal-Sidebar-IA), Block 5 (Docs/Hilfe-Bereich).
**AT-KMU-Kalibrierung:** Vercel-Zielgruppe sind Frontend-Developer. KMU-Inhaber sind kein Dev-Publikum — Dark-Mode-Default vermeiden, Sprache simpler.

---

### 4. Anthropic (claude.com / anthropic.com)
**URL:** https://anthropic.com, https://claude.com
**Pages of interest:** Home, Pricing, Brand-Asset-Beispiele in Produkt-Pages
**Screenshot:** `[TODO User]`
**Take-aways:**
1. **Warme, ruhige Farbpalette.** Cream/Sand statt Stark-Weiss. Wirkt nicht „cold-tech" sondern editorial. Verbindung zum BRAND.md Tannengruen + warmen Sand-Tonen vorhanden.
2. **Typografie als Brand-Anker.** Serif-Display fuer Marketing-Headlines (Tiempos-aehnlich), Sans-Serif fuer Body. Editorial-Vibe ohne Old-School.
3. **Wenig Animation, viel Atmosphaere.** Statt JS-Tricks: gute Fotografie, raumgebende Layouts, Whitespace.

**Relevanz:** Block 4 (Plattform-Design-System Farben/Typo), Block 5 (Editorial-Marketing-Vibe).
**AT-KMU-Kalibrierung:** Anthropic richtet sich an Tech-affine, instantpage.at an Handwerker. Warm + editorial uebernehmen, Sprache + Beispiele 100 % auf AT-KMU.

---

### 5. Mercury
**URL:** https://mercury.com
**Pages of interest:** Home, Pricing, Vault-Page, Dashboard-Tour
**Screenshot:** `[TODO User]`
**Take-aways:**
1. **B2B-Trust durch Praezision, nicht durch Lautstaerke.** Sachliche Headlines („Banking for ambitious companies"), keine Wow-Sticker. AT-Vertrauensprodukt-Vibe matched stark.
2. **UI-Screenshots als Hero.** Statt abstrakter Illustrationen werden echte Dashboard-Ansichten gezeigt. Authentisch, zeigt Produkt-Substanz.
3. **Pricing-Page mit Vergleichs-Tabelle ohne Trick-Spalten.** Keine 5-Spalten-Comparison-Falle. 2–3 Plaene transparent.

**Relevanz:** Block 5 (Pricing-Page + B2B-Trust-Vibe), Block 6 (Dashboard-Look).
**AT-KMU-Kalibrierung:** Mercury ist B2B-Fintech (Banking) — Brand-Vibe sehr nah am AT-Vertrauensprodukt-Anspruch. Direkt naehestes Vorbild von dieser Liste.

---

### 6. Resend
**URL:** https://resend.com
**Pages of interest:** Home, Docs, Pricing
**Screenshot:** `[TODO User]`
**Take-aways:**
1. **Sehr fokussierte Marketing-Site.** 1 Hero, 1 Demo, 1 Pricing-Block. Kein Bullet-Feature-Festival. KMU-tauglich.
2. **Schwarz/Weiss + 1 Akzent (Pink-Magenta).** Sehr disziplinierte Farb-Diet. Pendant fuer instantpage.at: Tannengruen als einzige Akzentfarbe konsequent durchziehen.
3. **API-Doku als Aushaengeschild.** Code-Snippets sind selbst Marketing. Pendant: instantpage.at-Hilfe-Seiten koennten Live-Beispiele als Marketing-Hebel nutzen.

**Relevanz:** Block 5 (Marketing-Site-Fokus statt Featuritis), Block 4 (Farbdisziplin).
**AT-KMU-Kalibrierung:** Resend ist Developer-Tool (Mail-API). Fokus-Lehren uebernehmen, Sprache fuer KMU komplett anders. Pink-Magenta nicht uebernehmen.

---

### 7. Frame (framer.com)
**URL:** https://framer.com
**Pages of interest:** Home, Templates-Gallery, Pricing
**Screenshot:** `[TODO User]`
**Take-aways:**
1. **Showcase-Templates-Gallery als Konversions-Tool.** Hunderte Beispiel-Sites mit Filter (Branche/Stil). Konzeptionell exakt unsere § 3.2 Kunden-Showcase + Block 10 Recipe-Mockups.
2. **Sehr produkt-zentrierte Hero-Section.** Live-Editor-Demo direkt im Hero. Pendant fuer instantpage.at waere: Live-Fragebogen-Demo im Hero (statt nur Screenshot).
3. **Editorial Animation-Layer.** Cursor-Follows, Mikro-Stagger, Page-Transitions. Aber bewusst dezent, nicht uebertrieben.

**Relevanz:** Block 3 (AI-Differentiator-Story — Live-Demo-Konzept), Block 5 (Marketing-Site Hero), Block 10 (Recipe-Mockup-Gallery-UX).
**AT-KMU-Kalibrierung:** Framer richtet sich an Designer/Agenturen — sehr Editorial. KMU-Inhaber kann die Animations-Layer leicht ueberfordern. Showcase-Pattern und Hero-Demo-Idee uebernehmen, Animations-Dichte reduzieren.

---

### 8. Plain (plain.com)
**URL:** https://plain.com
**Pages of interest:** Home, Manifest-Section, Pricing
**Screenshot:** `[TODO User]`
**Take-aways:**
1. **Ruhige, fast „verlegerische" Aesthetik.** Customer-Support-Tool das aussieht wie ein literarisches Magazin. Anti-Drift gegen aggressive SaaS-Patterns.
2. **Lange Marketing-Page-Scrolls mit Atemraum.** Sektionen mit viel Whitespace, kein Hard-Sell. Vertraut-Wirken statt Konvertieren-Druecken.
3. **Sehr kleine Akzentfarbe.** Schwarz/Weiss + dezenter Akzent. Keine UX-Wow-Tricks.

**Relevanz:** Block 5 (Editorial-Marketing-Approach), Block 6 (Portal-Whitespace-Rhythmus).
**AT-KMU-Kalibrierung:** Plain richtet sich an Support-Teams in Tech-Companies. Aesthetik passt grossteils. Sprache anpassen.

---

### 9. Notion
**URL:** https://notion.so — plus eingeloggte Workspace-UI
**Pages of interest:** Home, Templates-Gallery, in-App Editor
**Screenshot:** `[TODO User]`
**Take-aways:**
1. **Editor-UI mit drei klaren Zonen.** Sidebar (Navigation) — Top-Bar (Breadcrumb + Actions) — Main (Content). Disziplinierte Information-Architecture, keine Sub-Sub-Navigation.
2. **Tooltips als Hilfe-Layer.** Inline-Help statt Modal-Walkthroughs. Sehr unaufdringlich, KMU-tauglich.
3. **Empty-States mit Charakter.** Statt grauer „Keine Daten" wird etwas Persoenliches gezeigt (kleine Illustration + sanfter Hint). Nicht uebertreiben, aber bewusst gestaltet.

**Relevanz:** Block 6 (Portal-IA + Empty-States), Block 7 (Onboarding-Tooltips Fragebogen).
**AT-KMU-Kalibrierung:** Notion-Zielgruppe ist Wissensarbeiter mit Editor-Erfahrung. KMU-Inhaber kennen vielleicht Word — Editor-Conventions moeglichst minimal halten.

---

### 10. Cal.com
**URL:** https://cal.com
**Pages of interest:** Home, Features-Page, Pricing, Open-Source-Sektion
**Screenshot:** `[TODO User]`
**Take-aways:**
1. **Open-Source-Anker als Trust-Signal.** „Open Source. Self-Hosted. Privacy-First." als Marketing-Hebel. Pendant fuer instantpage.at: „Made in Austria. DSGVO-konform aus dem Stand." (Memory `feedback_at_vertrauensprodukt.md`).
2. **Sehr klare Plan-Abgrenzung.** Free / Teams / Enterprise — keine Feature-Verschleierung. KMU-tauglich.
3. **Marketing-Site sehr produkt-zentriert.** Hero zeigt Booking-Widget live, keine abstrakten Stock-Bilder.

**Relevanz:** Block 5 (Trust-Signale + Pricing-Klarheit), Block 3 (AI-Differentiator-Story — Live-Demo-Patterns).
**AT-KMU-Kalibrierung:** Cal.com Marketing-Sprache ist immer noch Tech-flavored. Pattern uebernehmen (Trust-Anker, Plan-Klarheit), Sprache vereinfachen.

---

### 11. Cabin Analytics
**URL:** https://withcabin.com
**Pages of interest:** Home, Privacy-Page, Pricing
**Screenshot:** `[TODO User]`
**Take-aways:**
1. **EU/Privacy-First als Brand-Anker.** Direkt gegen Google Analytics positioniert. Sehr aehnlich zur instantpage.at-Strategie „Banner-frei als USP" (LIVE-COMPLIANCE § 1 #15c).
2. **Sehr ruhige Aesthetik.** Schwarz/Weiss + dezenter Akzent, viel Whitespace. Anti-„Wow-SaaS"-Vibe.
3. **Pricing transparent + ehrlich.** Inklusive „why" pro Tier. Keine Up-Sell-Tricks.

**Relevanz:** Block 5 (EU/AT-Privacy-Positionierung), Block 4 (ruhige Aesthetik-Anker).
**AT-KMU-Kalibrierung:** Cabin Zielgruppe sind Indie-Hackers + Bloggers. Aesthetik passt sehr gut zu AT-Vertrauensprodukt. Sprache mehr KMU-orientiert anpassen.

---

### 12. cpg.at
**URL:** https://cpg.at — plus Memory `project_design_references_live.md`
**Pages of interest:** Home, Magazin-Sektionen
**Screenshot:** `[TODO User]`
**Take-aways:**
1. **AT-Editorial-Brand mit selbstbewusster Sprache.** Wiener Gastronomie-/Lifestyle-Magazin. Vorbild fuer eine warme, kultivierte AT-Aesthetik ohne Tech-Vibe.
2. **Fotografie als Brand-Treiber.** Hochwertige redaktionelle Bilder, keine Stockfoto-Klischees. Verbindung zu Block 12 Asset-Strategie.
3. **Typografie Editorial.** Display-Serif fuer Headlines, klare Hierarchie. AT-Brand-Vorbild ohne globale Tech-Praesenz.

**Relevanz:** Block 4 (AT-passende Aesthetik-Anker), Block 5 (Editorial-Marketing-Vibe), Block 12 (Foto-Stil-Kalibrierung).
**AT-KMU-Kalibrierung:** cpg.at ist Magazin, kein SaaS-Builder — die Brand-Vibe ist passend, das UI-Layout nicht direkt uebernehmbar. Als Stil-Anker, nicht als Funktions-Anker nutzen.

---

### 13. Wise Business
**URL:** https://wise.com/business
**Pages of interest:** Business-Home, Pricing, Use-Cases
**Screenshot:** `[TODO User]`
**Take-aways:**
1. **B2B-Trust durch konkrete Zahlen.** „16 Mio. Kunden", „Vereinheitlichte Konten in 40 Waehrungen". Sachlich, ohne Marketing-Stempel. Pendant fuer instantpage.at: erst nach Showcase-Reife sinnvoll.
2. **Use-Case-Pages pro Kundentyp.** Statt einer Landing fuer alle: separate Pages fuer Freelancer / E-Commerce / NGO. Pendant: instantpage.at-Berufsgruppen-Pages (siehe MARKETING.md § 2.3 A).
3. **Pricing-Page mit Live-Rechner.** Statt statischer Tabelle eine interaktive Berechnung. Substanz vor Schaubild.

**Relevanz:** Block 5 (Marketing-Site Long-Tail-Pages, Trust-Signale, interaktive Pricing-Elemente).
**AT-KMU-Kalibrierung:** Wise ist B2C/B2B-Fintech, sehr international. Funktion (Berufsgruppen-Pages, Trust-Zahlen) klar uebernehmbar, Branding 100 % anders.

---

### 14. DeepL
**URL:** https://deepl.com
**Pages of interest:** Home (sowohl Personal als auch Pro), Pricing, Translator-UI
**Screenshot:** `[TODO User]`
**Take-aways:**
1. **DACH-B2B mit ruhiger Brand.** Deutsche Firma (Koeln). Marketing-Sprache sachlich-professionell, kein Hype. AT-relevanter Vibe-Nachbar als US-Vorbilder.
2. **Produkt-Demo direkt im Hero.** Live-Uebersetzungs-Widget statt Stock-Bild. Pendant: Live-Fragebogen-Demo im instantpage.at-Hero.
3. **Zwei-Saeulen-Pricing (Free + Pro).** Sehr klar, keine 4-Plan-Falle. Pendant: Starter + Professional (Business als Teaser, siehe `feedback_preise_plan.md`).

**Relevanz:** Block 5 (Marketing-Site Brand-Vibe, Pricing-Klarheit, Live-Demo-Hero), Block 3 (Live-Demo-Konzept).
**AT-KMU-Kalibrierung:** DeepL ist gut kalibriert auf DACH-Audience — naehestes Vorbild von dieser Liste neben Mercury.

---

### 15. Webflow (Marketing-Site, NICHT Builder)
**URL:** https://webflow.com
**Pages of interest:** Home, Pricing, Showcase, vs. WordPress-Comparison
**Screenshot:** `[TODO User]`
**Take-aways:**
1. **Direkter Konkurrent-Schau.** Wie verkauft sich ein No-Code-Tool an Designer + Marketer? Wir verkaufen an KMU-Inhaber — andere Zielgruppe, andere Sprache, aber Strukturen vergleichbar.
2. **Showcase-Gallery sehr prominent.** „Made in Webflow"-Pages = direkter Vorbild fuer § 3.2 Kunden-Showcase Strategie.
3. **Vergleichs-Seiten mit Konkurrenten** („Webflow vs. WordPress"). Defensive Pendant: instantpage.at koennte „Was unterscheidet uns von generischen Buildern?" subtiler machen (UWG-Vorsicht, kein direkter Namens-Vergleich).

**Relevanz:** Block 5 (Showcase + Vergleichs-Strategie), Block 2 (gehoert auch in Konkurrenz-Analyse — A.2).
**AT-KMU-Kalibrierung:** Webflow-Zielgruppe ist Designer/Marketer, instantpage.at-Zielgruppe ist Handwerker/Friseur/Berater. Funktionale Strukturen uebernehmen, Sprache + Beispiele 100 % anders.

---

### 16. Beehiiv
**URL:** https://beehiiv.com
**Pages of interest:** Home, Pricing, Onboarding-Demo
**Screenshot:** `[TODO User]`
**Take-aways:**
1. **Editorial Self-Service-Onboarding.** Newsletter-Plattform fuer Creator. Onboarding-Flow ist sehr durchdacht — Fragen step-by-step, sofortige Vorschau. Vorbild fuer Block 7 Fragebogen-Magic-Moments.
2. **Hero zeigt Sofort-Vorschau.** „So sieht dein Newsletter aus"-Mockup direkt im Hero. Vorbild fuer instantpage.at: Recipe-Preview-Mockup je nach Berufsgruppe.
3. **Pricing schmal aber fokussiert.** Free / Scale / Max — sehr klare Plan-Sprache.

**Relevanz:** Block 7 (Fragebogen-Magic), Block 5 (Hero-Konzept mit Live-Preview).
**AT-KMU-Kalibrierung:** Beehiiv-Zielgruppe sind Newsletter-Writer (US-/internationale Creator-Economy). Onboarding-Mechanik klar uebernehmbar, Brand-Vibe nicht.

---

## Take-aways uebergreifend (Pattern-Aggregation)

**Was die 8 gemeinsam haben — uebernehmbar:**
- 1 Akzentfarbe konsequent, kein Gradient-Wirrwarr
- Editorial-Headlines statt SaaS-Standard-Marketing-Stempel
- Wenige, scharfe Hierarchie-Stufen (4–5 Typo-Tiefen statt 12)
- UI-Screenshots / Live-Demos als Hero statt abstrakter Illustrationen
- Footer als Sitemap, nicht als Social-Icon-Sammlung
- Pricing transparent, max 3 Plaene, keine 5-Spalten-Vergleichstabellen

**Was NICHT uebernehmbar (AT-KMU-Kontext):**
- Developer-Sprache (kein Code-Snippet-Hero fuer KMU)
- Dark-Mode-Default (KMU erwartet Light)
- Manifest-/Essay-Marketing-Stil (zu Silicon-Valley)
- Bestimmte Akzentfarben (Stripe-Pink, Resend-Magenta) — Tannengruen aus BRAND.md
- Aggressive Mikro-Interaktionen (KMU-Inhaber wird abgelenkt)

---

## Optional — weitere Refs bei Bedarf

16 Refs decken die wichtigsten Patterns ab. Falls beim Block-B-Bau Lücken auffallen, weitere Kandidaten:

- **Ghost** — Editorial-Plattform mit Self-Service-Onboarding (Alternative zu Beehiiv)
- **Personio** — DE-B2B-KMU-Tool (HR), DACH-Pendant zu Mercury
- **Dynatrace** — AT-Tech-Brand (Enterprise-Software, börsenotiert), AT-internationaler Vibe
- **Pitch** — Editorial Presentation-Tool, Block-7-Magic-Moments-Inspiration
- **Komi.io** — Artist-Hub mit Recipe-aehnlicher Logik (siehe Memory `project_design_references_live.md`)

Verworfen (Brand-Mismatch oder zu spezifisch):
- Arc Browser (Brand-Vibe gut, aber Browser-Pattern nicht uebertragbar)
- vergleich.com / preisvergleich.at (Marktplatz-Modell, anderes Produkt)

---

## Verbindung

- `DESIGN-VISION.md` Block A.1 — diese Doku
- `BRAND.md` — Brand-Tokens (Tannengruen, Voice) als Filter fuer Take-aways
- `benchmarks-recipes.md` `[TODO]` — Customer-Site-Referenzen pro Berufsgruppe (Block A.1 zweite Haelfte)
- `feedback_at_vertrauensprodukt.md` — AT-KMU-Kalibrierungs-Filter
