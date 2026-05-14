# Konkurrenz-Analyse — instantpage.at

> **Block A.2** aus `DESIGN-VISION.md`. 10 Konkurrenten visuell + funktional analysiert. Was machen sie besser / was muessen wir matchen / wo sind wir anders.

**Stand:** 2026-05-14 — `[SKELETON]` Erstanalyse aus Trainingswissen. Live-Sichtung + Screenshots durch Inhaber bei tatsaechlichem Bedarf (Block B/5 Marketing-Site, Block 7 Fragebogen-Magic-Moments).

---

## Verwendungs-Hinweis

**Wofuer:** Differentiator-Argumentation fuer Marketing-Site (`MARKETING.md` § 2.3), Cold-Outreach (`MARKETING.md` § 2.2), Anti-Patterns-Vermeidung in DESIGN-VISION Block 5/7.

**AT-KMU-Kalibrierung beachten** (Memory `feedback_at_vertrauensprodukt.md`): Vergleich erfolgt aus Sicht der **oesterreichischen KMU-Inhaber-Zielgruppe** (Handwerker, Friseur, Berater, Anwalt, Gastronom — siehe `project_berufsgruppen_refactor.md`). Was global hochwertig wirkt, ist nicht automatisch passend.

**UWG-Vorsicht:** Diese Analyse ist intern. Public-Vergleichs-Pages auf der Marketing-Site (z.B. „instantpage.at vs Wix") muessen UWG-konform formuliert sein (`LIVE-COMPLIANCE.md` § 15). Diese Doku liefert Faktenbasis, keine Marketing-Sprache.

---

## Konkurrenten-Auswahl

10 Anbieter in Reihenfolge der Relevanz fuer AT-KMU-Zielgruppe:

| # | Anbieter | Kategorie | Direkte Konkurrenz fuer AT-KMU |
|---|---|---|---|
| 1 | Wix (+ Wix ADI / Wix AI) | All-in-one Builder + AI | sehr hoch — ATV-Werbung, breite Praesenz |
| 2 | Jimdo (Dolphin AI) | DACH KMU-Builder mit AI | sehr hoch — DE-Anbieter, KMU-Fokus, AI-Onboarding |
| 3 | IONOS MyWebsite + Now | DACH Massmarkt-Builder | hoch — viele KMU haben IONOS-Hosting |
| 4 | GoDaddy Websites | Massmarkt-Builder | hoch — AT-TV-Werbung, oft als „erste Wahl" wahrgenommen |
| 5 | Hostinger Website Builder | Premium-discount + AI | mittel — sehr guenstig, AI-Marketing |
| 6 | Squarespace | Premium-Builder fuer Creator | mittel — gehoben, weniger fuer Handwerker |
| 7 | WordPress.com | Klassischer Builder + CMS | mittel — bekannte Marke, Komplexitaet hoch |
| 8 | Webflow | Designer-Builder | gering — Tech-affine Zielgruppe |
| 9 | Framer | Designer-Builder + AI | gering — Tech-affine Zielgruppe |
| 10 | Strikingly | KMU-Builder simpel | gering — eher international |

---

## 1. Wix (+ Wix ADI / Wix AI)

**URL:** https://wix.com (DE/AT) — https://wix.com/website/builder
**Zielgruppe:** Massmarkt KMU + Privatpersonen, weltweit. AT-TV-Werbung sehr praesent.
**Positionierung:** „Erstelle deine Website" — Allrounder, sehr breit.

**Stärken:**
- Riesiger Template-Katalog (800+), filterbar nach Branche
- Wix ADI (Artificial Design Intelligence) + Wix AI: AI-gestuetzter Bauer, beantwortet Fragen + generiert Site
- Sehr ausgereiftes Drag-and-Drop-Editor — voller Pixel-Control
- App-Marketplace fuer Erweiterungen (Booking, Shop, Restaurant)
- Mehrsprachig, AT-tauglich

**Schwächen / Lücken (fuer AT-KMU):**
- **Free-Plan hat Wix-Subdomain + Werbe-Banner** — wirkt unprofessionell
- **Performance schlecht** — Lighthouse oft < 50 mobile (Wix-eigene Inflater + Scripts)
- **Cookie-Banner Pflicht** — keine cookielose Default-Option
- **Komplexitaet ueberfordert KMU** — der Drag-and-Drop-Editor ist machtig aber zeitintensiv. „10 Minuten" sind unrealistisch — eher 5–10 Stunden bis Site steht.
- **Branchen-Stereotypen** — viele Templates sind generisch („Friseur 1" sieht aus wie alle anderen Friseur-Sites)
- **AI-Output generisch** — Wix AI generiert plausibel klingende, aber inhaltsleere Texte

**AI-Erwähnung:** Sehr laut beworben (Hero, Pricing-Hinweise). „Build a website with AI" ist Hauptbotschaft seit 2024.

**Pricing-Struktur (Stand Trainingswissen, vor Live verifizieren):**
- Free / Light (~10 €/Mo) / Core (~17 €/Mo) / Business (~29 €/Mo) / Business Elite (~159 €/Mo)
- 5 Plaene, Vergleichstabelle sehr lang

**Onboarding-Flow:** Wix ADI fragt 5–10 Fragen, generiert Site. ABER danach folgt 2–3 h Editor-Arbeit fuer Polish.

**Vibes / Tonalitaet:** Bunt, laut, Promo-stark. Marketing-Sprache hype-orientiert („Schoepfe deine Vision!").

**Was instantpage.at anders / besser macht:**
- **10-Minuten-Realitaet** statt 5-Stunden-Editor-Marathon
- **Banner-frei** als USP (keine Cookie-Banner-Pflicht auf Kunden-Seiten)
- **Berufsgruppen-spezifische Recipes** statt generischer Templates
- **AT-Vertrauensprodukt** — kein internationaler Massmarkt-Vibe
- **Performance ≥ Lighthouse 90** als harter Standard

---

## 2. Jimdo (Dolphin AI)

**URL:** https://jimdo.com (DE/AT)
**Zielgruppe:** DACH KMU, Selbststaendige, Solo-Unternehmer. Sehr aehnlich zu instantpage.at-Zielgruppe.
**Positionierung:** „Die ehrliche Website fuer dein Geschaeft" — DE-Sound, KMU-orientiert.

**Stärken:**
- **Dolphin AI** — interaktiver Fragebogen-Bauer (3-Minuten-Versprechen)
- DE-Hosted (DSGVO-Vertrauen)
- KMU-orientierte Pricing-Struktur
- Fokus auf Handwerk + Selbststaendige (echte AT-relevante Branchen-Templates)
- Jimdo Logo Creator mitintegriert

**Schwächen / Lücken (fuer AT-KMU):**
- **Templates wirken 2018er-Vibe** — sicher, aber visuell veraltet
- **Editor weiterhin sichtbar** — User muss in Bauen-Modus, nicht Self-Service-Portal
- **3-Minuten-Versprechen oft unrealistisch** — Realitaet 30+ Min
- **Foto-Bibliothek schmal** — Stock-Klischees auffaellig
- **Nicht-strenge Performance-Standards** — Pages oft Lighthouse 60–75
- **„Dolphin"-Branding** mit Logo abgekanzelt seit ~2023, AI-Versprechen leicht inkonsistent

**AI-Erwähnung:** Dolphin AI war frueher Hauptaufhaenger, ist heute weniger sichtbar. Eher als Onboarding-Feature, nicht als Marketing-Kern.

**Pricing-Struktur:**
- Free (Jimdo-Subdomain) / Start (~9 €/Mo) / Grow (~15 €/Mo) / Unlimited (~39 €/Mo) — Privat-Pakete
- Plus Jimdo Business-Tarife mit eigenen Plan-Strukturen

**Onboarding-Flow:** Dolphin fragt 3–4 Fragen (Branche, Zweck, Stil), generiert Vorschlag.

**Vibes / Tonalitaet:** Freundlich-ruhig, kein Hype. DE-KMU-Vibe — naehestes Pendant zu instantpage.at von dieser Liste.

**Was instantpage.at anders / besser macht:**
- **Frischere visuelle Qualitaet** (Recipes orientiert an cpg.at-Niveau, nicht 2018er-Templates)
- **AT-spezifisch** (UID-/Berufsgruppen-/Reglementierte-Berufe-Logik)
- **Self-Service-Portal statt Bau-Editor** (siehe `feedback_serve_time_maximum.md`)
- **Compliance-Pflichtfelder automatisiert** (Impressum, AVV als Pre-fertige Texte)

**Pendant-Risiko:** Jimdo ist Brand-Vibe-naehestes Konkurrenz-Modell. Differentiator muss visuell + funktional klar sein. „Wir sind wie Jimdo, aber..." ist gefaehrlich — eigene Position klar abzugrenzen.

---

## 3. IONOS MyWebsite + Now

**URL:** https://ionos.at — https://ionos.at/websites
**Zielgruppe:** DACH Massmarkt — Privatkunden + KMU, oft schon IONOS-Hosting-Kunden.
**Positionierung:** „Komplette Website-Loesung von IONOS" — Trust-Anker durch grossen Hosting-Anbieter.

**Stärken:**
- **Bundle mit Domain + Hosting + Mail** in einem Paket
- Bekannte Marke in DACH
- IONOS Sprechtag (Telefonsupport) als Trust-Signal
- DSGVO + Server in DE
- KMU-orientierte Templates

**Schwächen / Lücken (fuer AT-KMU):**
- **Sehr generische Templates** — wirkt nach 2015er-Hosting-Anbieter-Default
- **Editor klobig** — sehr funktional, wenig Magie
- **Pricing intransparent** — viele Zusatz-Buchungen
- **Customer-Loyalty-driven, nicht Product-driven** — viele User bleiben weil zu komplex zu wechseln, nicht weil das Produkt brilliant ist
- **Now (AI-Builder, separates Produkt)** ist neueres Angebot, aber UI noch unausgereift

**AI-Erwähnung:** „IONOS Now" als AI-getriebener Builder, separates Pricing, wenig Hauptbotschaft.

**Pricing-Struktur:**
- MyWebsite Now Starter (~1 €/Mo erstes Jahr, dann ~12 €/Mo)
- MyWebsite Now Premium (~9 €/Mo erstes Jahr, dann ~24 €/Mo)
- Lockvogel-Pricing (Erstjahr-Rabatt + steile Folge-Preise) — KMU-irritierend

**Onboarding-Flow:** Now fragt nach Branche + Layout-Preferenz, generiert Site.

**Vibes / Tonalitaet:** Hosting-Anbieter-Standard. Trust durch Marke, nicht durch Aesthetik.

**Was instantpage.at anders / besser macht:**
- **Transparentes Pricing** — kein Lockvogel-Modell
- **Premium-Visualitaet** — nicht 2015er-Default-Look
- **Performance + Compliance-Standards eingebaut** — kein Hosting-Addon-Wirrwarr
- **AT-Fokus statt DE-Erstmarkt**

---

## 4. GoDaddy Websites + AI

**URL:** https://godaddy.com (DE/AT)
**Zielgruppe:** Massmarkt KMU + Privat, AT-TV-Werbung mit „Beyonce" + KMU-Stories
**Positionierung:** „Mit GoDaddy kommst du online" — Vom Domain-Anbieter zum All-in-one.

**Stärken:**
- TV-Werbung in AT sehr stark — bekannte Marke
- Bundle mit Domain + Mail
- GoDaddy AI: kompletter Onboarding-Bauer
- Sehr KMU-tauglich (einfacher Editor)

**Schwächen / Lücken (fuer AT-KMU):**
- **US-First-Brand** — Marketing-Sprache wirkt manchmal uebertragen-uebersetzt
- **Pricing aggressiv mit Upsells** (Domain → Mail → SSL → SEO-Tool → eMail-Marketing)
- **Templates international generic** — wenig AT-spezifisch
- **„Build your dream"-Marketing-Sprache** — passt nicht zu AT-Vertrauensprodukt-Vibe
- **AI-Output generisch** — wie Wix, plausibel klingende Texte ohne Substanz

**AI-Erwähnung:** „GoDaddy Airo (AI)" — promint beworben seit 2024, AI als Onboarding-Begleiter.

**Pricing-Struktur:**
- Basic (~10 €/Mo) / Premium (~15 €/Mo) / Commerce (~20 €/Mo)

**Vibes / Tonalitaet:** International, Marketing-laut, „Champions"-Stil.

**Was instantpage.at anders / besser macht:**
- **AT-Brand-Vibe** statt US-Adaption
- **Transparente Pricing-Sprache** statt aggressives Upselling
- **Recipe-Differenzierung** statt Massmarkt-Templates

---

## 5. Hostinger Website Builder

**URL:** https://hostinger.com (DE)
**Zielgruppe:** Preis-sensible KMU + Indie + Hobbyisten weltweit.
**Positionierung:** „Sehr guenstige Komplett-Loesung" — Discount-Premium-Versprechen.

**Stärken:**
- **Sehr guenstig** (~3 €/Mo Erstpreis) — preislich sehr aggressiv
- Hostinger AI Website Builder (umfangreiches AI-Onboarding)
- Schnelle Performance (eigene Infra)
- DE/AT-Hosting (FRA-Servers)

**Schwächen / Lücken (fuer AT-KMU):**
- **Marken-Vertrauen niedrig in DACH** — Litauen-basiert, internationale Brand
- **Lockvogel-Pricing** — Erst-Rabatt sehr stark, Folgejahre teuer
- **AI-Output trifft die Standardklischees** — wenig branchen-spezifische Tiefe
- **Templates international generic**
- **Support v.a. ueber Chat in Englisch**

**AI-Erwähnung:** Sehr laut. „AI Website Builder" als Haupthebel seit 2024.

**Pricing-Struktur:**
- Premium / Business / Cloud (~3–10 €/Mo Erstpreis, ~8–25 €/Mo regulaer)
- Sehr volatile Discount-Aktionen

**Vibes / Tonalitaet:** Massmarkt-Discount, sehr klassisches SaaS-Marketing.

**Was instantpage.at anders / besser macht:**
- **AT-Vertrauen** statt internationaler Discount-Anbieter
- **Transparente Preise** statt Lockvogel-Modell
- **Recipe-spezifische Visualitaet** statt generischer Templates
- **DE/AT-Support** als Selbstverstaendlichkeit

---

## 6. Squarespace

**URL:** https://squarespace.com (englisch fuer DACH)
**Zielgruppe:** Creative-orientierte Selbststaendige, Fotografen, Kuenstler, kleine Boutique-Brands.
**Positionierung:** „Die schoene Website fuer Creator" — Premium-Aesthetik-Versprechen.

**Stärken:**
- **Sehr starke visuelle Qualitaet** der Templates
- Squarespace AI generiert Site + Texte
- Editorial-Vibe, gut fuer Kreative
- Mobile-First-Editor
- Premium-Brand-Wahrnehmung

**Schwächen / Lücken (fuer AT-KMU):**
- **Englisch-First** — DACH-Support eingeschraenkt, viele Funktions-Texte englisch
- **Sehr Creator-zentriert** — Handwerker, Anwaelte, Gastronome eher Fehlbesetzung
- **Pricing in USD** — Wechselkurs-Risiko, KMU-irritierend
- **Templates oft uebermaessig Photo-driven** — kleine Service-KMU ohne Top-Fotos verlieren

**AI-Erwähnung:** „Squarespace AI" als Hilfe-Tool im Editor — eher nebenbei, kein Hauptmarketing-Hebel.

**Pricing-Struktur:**
- Personal ($16/Mo) / Business ($23/Mo) / Commerce Basic ($28/Mo) / Commerce Advanced ($52/Mo)
- USD-Pricing

**Vibes / Tonalitaet:** Editorial-Premium, ruhig, designorientiert. AT-Vertrauensprodukt-Pendant teilweise — aber Zielgruppe ist anders.

**Was instantpage.at anders / besser macht:**
- **AT-Sprache + Pricing** statt USD/Englisch
- **Service-KMU-Branchen** (Handwerk/Recht/Gastro) statt Creator-Fokus
- **Recipe-Auto-Engine** statt selbst Template auswaehlen + customisieren

---

## 7. WordPress.com (gehostet)

**URL:** https://wordpress.com (DE)
**Zielgruppe:** Sehr breit — Blogger, Selbststaendige, Agenturen, Massmarkt-KMU.
**Positionierung:** „Die bekannteste Website-Plattform" — Trust durch Marken-Bekanntheit.

**Stärken:**
- **Riesige Plugin-Library** — alles erweiterbar
- **WordPress-Wissen weit verbreitet** — User finden Helfer
- AI-Features in Premium-Tarifen (eingeschraenkt)
- Bekannte Marke
- Multilingual

**Schwächen / Lücken (fuer AT-KMU):**
- **Sehr steile Lernkurve** — KMU brauchen Helfer
- **Block-Editor (Gutenberg)** ist machtig, aber ueberfordernd
- **Wartung-intensiv** — Plugin-Updates, Backups, Sicherheit
- **Generic Themes** — Top-Themes kostenpflichtig oder selbst kuratieren
- **Hosting-Plan + Theme + Plugins + Domain = komplexe Kosten-Rechnung**

**AI-Erwähmung:** WordPress.com AI Assistant — Hilfe-Tool im Editor, kein Marketing-Hebel.

**Pricing-Struktur:**
- Free / Personal (~4 €/Mo) / Premium (~8 €/Mo) / Business (~25 €/Mo) / Commerce (~45 €/Mo)

**Vibes / Tonalitaet:** Sehr generisch, „Software-Anbieter"-Vibe.

**Was instantpage.at anders / besser macht:**
- **10-Minuten-Onboarding** statt Lernkurve
- **Keine Plugin-Wartung** — alles serve-time orchestriert
- **Branche-spezifische Inhalte automatisch** statt leeres Theme
- **Compliance + Impressum eingebaut** statt zusaetzliches Plugin

---

## 8. Webflow

**URL:** https://webflow.com (englisch)
**Zielgruppe:** Designer, Agenturen, Tech-affine KMU.
**Positionierung:** „Visuelles Design + No-Code-Power" — gehoeniert.

**Stärken:**
- **Sehr machtiger Editor** (CSS-Designer-Niveau ohne Code)
- Editorial-Marketing-Site (siehe `benchmarks-plattform.md` #15)
- Showcase-Gallery extrem stark
- Profi-Resultate moeglich

**Schwächen / Lücken (fuer AT-KMU):**
- **Extreme Lernkurve** — KMU-Inhaber komplett ueberfordert
- **Englisch-First** — DACH-Support gering
- **Pricing kompliziert** (Workspace + Site-Plans separat)
- **Eher Designer-Tool als KMU-Tool**

**AI-Erwähnung:** Webflow AI Assistant in Premium, kein Hauptmarketing.

**Pricing-Struktur:**
- Site-Plans: Basic ($14/Mo) / CMS ($23/Mo) / Business ($39/Mo)
- Plus Workspace-Pricing oben drauf

**Vibes / Tonalitaet:** Designer-Editorial, sehr hochwertig.

**Was instantpage.at anders / besser macht:**
- **KMU-tauglich** statt Designer-Tool
- **Auto-Engine + Recipes** statt manuelles CSS-Design
- **AT-Sprache + Pricing-Klarheit**

---

## 9. Framer

**URL:** https://framer.com (englisch)
**Zielgruppe:** Designer, Agenturen, Tech-affine Creator.
**Positionierung:** „Design + AI fuer moderne Websites".

**Stärken:**
- **Sehr aktuelle AI-Features** — Framer AI generiert komplette Sites aus Prompt
- Editorial-Marketing-Site
- Templates-Gallery sehr aesthetisch
- Schneller Editor (Designer-Tool-Niveau)

**Schwächen / Lücken (fuer AT-KMU):**
- **Extreme Lernkurve** (wie Webflow)
- **Englisch-First**
- **Sehr Creator-/Designer-Vibe** — Handwerker total verloren

**AI-Erwähnung:** Sehr laut beworben. „Build with AI" Hauptbotschaft 2024.

**Pricing-Struktur:**
- Free / Mini ($5/Mo) / Basic ($15/Mo) / Pro ($30/Mo)

**Vibes / Tonalitaet:** Editorial-Tech, modern, hipper Designer-Vibe.

**Was instantpage.at anders / besser macht:**
- **KMU-Zielgruppe** statt Designer
- **AT-Vertrauensprodukt-Vibe** statt globales Designer-Tool
- **Branchen-Recipes** statt Generic-Templates

---

## 10. Strikingly

**URL:** https://strikingly.com (englisch, DE-Translation)
**Zielgruppe:** Solopreneure + sehr kleine KMU, weltweit.
**Positionierung:** „Easy Website Builder" — Simplicity-Versprechen.

**Stärken:**
- **Einfacher Single-Page-Builder** — KMU-tauglich
- Schnelles Onboarding
- Strikingly AI fuer Texte
- Mobile-optimiert

**Schwächen / Lücken (fuer AT-KMU):**
- **Sehr international fokussiert** — kein DACH-Schwerpunkt
- **Single-Page-Limit** in unteren Plaenen
- **Templates wirken 2017er-Vibe**
- **Marketing-Sprache leicht uebertrieben** („Million users worldwide")

**AI-Erwähnung:** Strikingly AI in Onboarding, eher nebenbei.

**Pricing-Struktur:**
- Free / Limited (~9 €/Mo) / Pro (~19 €/Mo) / VIP (~49 €/Mo)

**Vibes / Tonalitaet:** International, Massmarkt, leicht hype.

**Was instantpage.at anders / besser macht:**
- **AT-Fokus** statt internationaler Massmarkt
- **Frischere Visualitaet**
- **Recipe-System statt veraltete Templates**

---

## Aggregation — Differentiator-Bauchstein

**Was die meisten Konkurrenten gemeinsam haben (potenzielle Anti-Patterns):**
1. **Editor-zentriert** — Kunde wird Bauer, nicht User
2. **AI laut beworben** — „Build with AI" als Hauptbotschaft (Wix, GoDaddy, Hostinger, Framer)
3. **Generic Templates** — wenig branchen-spezifische Tiefe
4. **Performance schwach** — viele Builder produzieren langsame Sites
5. **Pricing-Tricks** — Lockvogel, Erstpreis-Discount, intransparente Upsells
6. **Englisch-/US-First** — DACH-Adaption oft halbherzig
7. **Mehrere Plaene mit unklarer Abgrenzung** — 4–5 Plaene mit verwirrender Feature-Matrix

**Wo instantpage.at potenziell anders ist (Differentiators):**
1. **„10 Minuten und fertig" — keine Editor-Sklaverei** (Memory `feedback_serve_time_maximum.md`)
2. **AI versteckt, Output sichtbar** — keine „AI"-Marketing-Lautstaerke, KI macht „die Arbeit" unsichtbar (Block A.3 Frage)
3. **Branchen-Recipes statt Templates** (Memory `feedback_branchen_defaults_struktur.md`)
4. **Performance ≥ 90 als Hard-Block** (`DESIGN-VISION.md` § 13.1)
5. **Transparentes 2-Plan-Pricing** (Memory `feedback_preise_plan.md`)
6. **AT-only Phase 1 + AT-Vertrauensprodukt-Vibe** (Memory `feedback_at_vertrauensprodukt.md`)
7. **Banner-frei + Compliance eingebaut** als USP (`LIVE-COMPLIANCE.md` § 1 #15c)
8. **Naheste Konkurrent ist Jimdo** — Brand-Vibe-Pendant, aber visuell aelter und ohne AT-Fokus

**Was wir matchen muessen (Tabellen-Mindeststandard):**
- AI-getriebenes Onboarding (Fragebogen mit Smart-Defaults)
- Branchen-Vielfalt (14 Berufsgruppen)
- Foto-Bibliothek (Unsplash + kuratiert)
- Self-Service-Reaktivierung + Datenexport
- Custom-Domain-Setup

**Was wir bewusst NICHT haben sollten (Anti-Patterns):**
- Drag-and-Drop-Editor (Memory `feedback_serve_time_maximum.md`)
- App-Marketplace / Plugin-System (Wartungs-Hoelle)
- Cookie-Banner-Default (LIVE-COMPLIANCE § 1 #15c)
- E-Commerce-Vollausbau (Phase 2, falls ueberhaupt)
- Mehrsprachigkeit Phase 1 (AT-only)
- 5-Plan-Pricing (Starter + Pro, Business als Teaser)

---

## Konkurrent-Mapping fuer Marketing

**Wer ist der direkte Konkurrent fuer welche Berufsgruppe?**

| Berufsgruppe | Hauptkonkurrent | Sekundaer |
|---|---|---|
| Handwerk | Jimdo, IONOS | Wix |
| Gastronomie | Wix, Jimdo | GoDaddy |
| Friseur / Kosmetik | Wix, Squarespace | Jimdo |
| Anwalt / Berater | WordPress.com, Squarespace | Jimdo |
| Steuerberater | WordPress.com | Jimdo |
| Gesundheit (Heilberufe) | WordPress.com | Jimdo (mit Branchen-Template) |
| Bildung | Wix, WordPress.com | Squarespace |

**Cold-Outreach-Hilfsmittel (MARKETING.md § 2.2):** Diese Mapping-Tabelle hilft beim Pre-Launch-Mail-Personalisierung pro Branche.

---

## Verbindung

- `DESIGN-VISION.md` Block A.2 — diese Doku
- `MARKETING.md` § 2.2 + § 2.3 — Konkurrent-Argumentation in Cold-Outreach + SEO
- `BRAND.md` § 7 — Defensive Wording bei Konkurrent-Naming (UWG)
- `LIVE-COMPLIANCE.md` § 15 — UWG-konforme Vergleichsaussagen
- `feedback_at_vertrauensprodukt.md` — Vergleichs-Filter
- `feedback_serve_time_maximum.md` — Differentiator „kein Editor"
