# Briefing fuer Claude Design — Marketing-Landing instantpage.at

**Stand:** 2026-05-05 — erste Test-Sitzung
**Ziel:** Live HTML-Mockup einer Marketing-Landing fuer instantpage.at, das danach via Handoff-Bundle an Claude Code geht.

---

## Wie dieses Briefing zu nutzen ist

**In claude.ai/design:**

1. Neues Projekt erstellen
2. **Codebase NICHT ingesten** (zu gross, frisst 70 % der Wochenquote)
3. **Diese Datei (.md) hochladen** als einzigen Kontext
4. Optional: 1-2 Referenz-Screenshots dazu (siehe § 9)
5. Prompt aus § 11 verwenden
6. Iterieren via Inline-Comments und Slidern (nicht Chat — sparsamer)
7. Export → "Send to Claude Code" → Bundle in Repo bringen

---

## 1. Was gebaut wird

Eine Marketing-Landing-Page fuer **instantpage.at** — die oeffentliche Verkaufsseite des SaaS-Produkts. Eine Seite, scrollbar, responsive (Mobile + Desktop). Gegen Ende ein Pricing-Block + CTA in den Fragebogen.

**Ziel der Seite:** Besucher (KMU-Inhaber) versteht in unter 10 Sekunden was instantpage.at ist + warum es fuer ihn passt + klickt auf "Website starten".

**Out-of-Scope:** Self-Service-Portal (das ist hinter dem Login), Kundenseiten-Templates (das ist Recipe-System).

---

## 2. Vision + Kernversprechen

**Vision:**
Eine moderne, branchengerechte Website ist Grundausstattung fuer jeden Betrieb. instantpage.at liefert sie als Service — vollstaendig konfiguriert, auf oesterreichische Standards abgestimmt, ohne Agentur-Aufwand.

**Kernversprechen (Hero-Headline-Material):**
> Sie sagen uns, wer Sie sind und was Sie machen. Wir liefern die Website, die zu Ihrer Branche passt — fertig konfiguriert, mit allen rechtlichen Pflichtangaben, sofort online.

**Was instantpage.at bewusst NICHT ist:**
- Kein Website-Builder. Sie treffen keine Design-Entscheidungen.
- Kein generisches Template-Tool. Jede Berufsgruppe bekommt eine eigene, kuratierte Vorlage.
- Kein Marketing-Vehikel fuer Tech-Stack. Die eingesetzte Technik bleibt im Hintergrund.

---

## 3. Zielgruppe

**Wer kauft das?** Oesterreichische Klein- und Mittelbetriebe mit lokalem Geschaeft. Inhaber sind oft 35-65, weder design-affin noch tech-affin, aber pragmatisch — sie wollen "fertig, korrekt, ohne sich einarbeiten".

**12 Berufsgruppen zum Live-Start:** Handwerk, Gastro, Gesundheit, Dienstleistung, Bildung, Tourismus, Handel, Mobilitaet, Agrar, Industrie, Kosmetik, Kultur.

**Markt:** ~190.000 Betriebe in AT (~120.000 Handwerk, ~30.000 Gastro, ~40.000 Rest).

**Bewusst AUSSERHALB:** Kuenstler-/DJ-/Influencer-Profile, Editorial-Magazine, Konzerne, Privatseiten.

---

## 4. Pricing (B2B, netto)

| Plan | Monatlich | Jaehrlich (pro Monat) | Status |
|---|---|---|---|
| **Starter** | 16 EUR | 14 EUR | aktiv |
| **Professional** | 29 EUR | 25 EUR | aktiv |
| **Business** | — | — | nur Teaser, "Coming Soon" |

Hinweis bei Preisen: "zzgl. 20 % USt".
Mindestlaufzeit Monatsabo: monatlich kuendbar. Jahresabo: 12 Monate, danach monatlich kuendbar.
**7 Tage Trial — Vollzugriff inkl. Live-Schaltung. Karte wird erst nach Trial-Ende belastet.**

---

## 5. Feature-Highlights pro Plan (fuer Pricing-Cards)

**Starter (16/14):**
- KI-Texte fuer deine Branche
- Impressum + Datenschutzerklaerung automatisch
- **Kein Cookie-Banner auf der Kundensite**
- Subdomain (firma.instantpage.at), SSL automatisch
- Kontaktformular mit Mail-Zustellung
- Self-Service-Portal mit Logo, Fotos, Bewertungen, Team, Galerie, FAQ
- Wissensdatenbank, Diagnose-Assistent, Support-Mail (24-48h)

**Professional (29/25) — alles aus Starter, plus:**
- **Eigene Domain** (www.firma.at) inkl. Setup-Anleitung
- **AI-Sichtbarkeit** (llms.txt fuer ChatGPT/Perplexity, IndexNow fuer Bing)
- **Besucher-Statistiken** (cookielos)
- **Monatlicher Website-Report**
- **Ohne instantpage-Branding**

**Business — Teaser-Karte mit "Coming Soon" oder "Auf Anfrage", keine Features anzeigen.**

---

## 6. Sections (Vorschlag — Claude Design darf abweichen mit Begruendung)

1. **Hero** — Kernversprechen + CTA "Website starten" + visueller Anker (Mockup eines Endkunden-Sites? Oder abstraktes Visual?)
2. **Wie es funktioniert** — 3 Schritte: Sie sagen uns wer Sie sind → Wir liefern → Sie sind online
3. **Fuer wen** — die 12 Berufsgruppen mit kleinem Beispiel-Mockup je Gruppe (oder Icons)
4. **Was drin ist** — Feature-Highlights ueber Plaene hinweg (rechtssicher, branchenspezifisch, eigene Domain optional)
5. **Beispiele** — 3-4 echte Recipe-Looks gezeigt (Handwerk, Gastro, Gesundheit, Dienstleistung)
6. **Pricing** — die 3 Cards aus § 4
7. **FAQ** — 6-8 typische Fragen (Wie schnell? Was wenn ich kuendige? Brauche ich Vorkenntnisse? Eigene Domain? AGB? etc.)
8. **Trust / Footer** — Impressum-Link, Datenschutz, Kontakt, Rechtsform-Hinweis (Wagner IT-Solutions e.U., FN 609574h)

---

## 7. Voice & Tone (kritisch — bitte beachten)

- **Sachlich, nuechtern.** Kein Marketing-Slang, kein Hype.
- **"Sie"-Anrede** als Default (B2B, oesterreichischer Standard).
- **KEIN KI-/AI-Buzzword** im Vordergrund. Wir sagen "automatisch", "fertig konfiguriert", "auf Knopfdruck" — nicht "KI-Builder", "AI-powered", "smart".
- **Echte deutsche Umlaute** (ae, oe, ue, ss) — nicht ae/oe/ue, nicht Unicode-Escapes.
- **Konkret, keine leeren Versprechen.** Lieber "Impressum + Datenschutzerklaerung automatisch" als "Rechtssicher in Sekunden".
- **Oesterreichischer Bezug betonen** — "fuer oesterreichische KMU", "AT-Standards", "WKO-konform".

---

## 8. VERBOTENE Begriffe (UWG-Risiko)

Diese Worte duerfen **NIRGENDWO** auf der Landing erscheinen:

- "rechtssicher", "100 % DSGVO-konform", "abmahnsicher", "garantiert"
- "die beste Plattform" (nicht-belegbarer Superlativ)
- Vergleichende Aussagen gegen Mitbewerber ohne sachliche Grundlage
- "fehlerfrei", "perfekt", "immer aktuell"

**Defensive Alternativen:**
- statt "rechtssicher" → "mit allen rechtlichen Pflichtangaben"
- statt "DSGVO-konform" → "Impressum + Datenschutzerklaerung automatisch"
- statt "garantiert" → "fertig konfiguriert"

---

## 9. Slogan-Vorschlaege (defensive Wording)

Eine dieser drei als Hero-Headline + 1-2 als Sub-Headline-Ideen:

- "Premium-Website fuer oesterreichische KMU — fertig konfiguriert, branchen-tauglich"
- "Marketing-Website ohne Agentur. Speziell fuer Handwerker, Gastronomen, Berater, Praxen."
- "Wir bauen Ihre Website. Sie bleiben Inhaber."
- "Schneller online. Professionell betrieben. Transparent abgerechnet."

---

## 10. Visuelle Referenzen + Design-Foundation

**Plattform-Style-Inspiration (instantpage.at selbst — das ist die Marketing-Landing):**
- **Linear (linear.app)** — minimalistisch, viel Whitespace, dunkle Akzente, klare Typo-Hierarchie
- **Stripe (stripe.com)** — Trust durch Klarheit, Pricing-Cards-Design, Sub-Headlines pro Section
- **Vercel (vercel.com)** — Greenfield-Tech-Look, schnelle Lade-Wahrnehmung
- **Anthropic (anthropic.com)** — gediegen, ruhig, Serif-Akzente moeglich

**Wichtig:** Diese Referenzen sind fuer die **Marketing-Plattform-Aesthetik**, NICHT fuer die generierten Kundenseiten (die folgen dem Recipe-System mit eigenen Themes pro Berufsgruppe — nicht relevant fuer dieses Briefing).

**Design-Tokens (Vorschlag, du darfst abweichen):**
- **Font Primaer:** DM Sans (aktuell im Prototyp)
- **Font Mono fuer Zahlen/Code:** JetBrains Mono
- **Plattform-Farben:** noch offen — bitte 2-3 Varianten vorschlagen. Tendenz: ruhig, neutral, mit einer Akzentfarbe. Kein knalliges SaaS-Lila, kein Web3-Gradient. Eher Anthrazit + Cremeweiss + dezenter Akzent (z.B. Tannengruen, Burgundy, oder dezenter Indigo).
- **Spacing:** 8-Punkt-Grid
- **Radien:** moderat (8-12px)
- **Schatten:** sparsam, eher Borders + leichte Hintergrundfarben fuer Tiefe

**Was zu vermeiden:**
- Generische "Claude-Aesthetic" mit Serifs + Card-Layouts ueberall — wir wollen wiedererkennbar instantpage.at
- Glassmorphism, Brutalism, Neumorphism — alles Trendiges, nichts Klassisches
- Stock-Photo-Hero mit laechelnden Menschen — wirkt SaaS-generisch

---

## 11. Prompt fuer Claude Design (zum Reinpasten)

```
Baue eine Marketing-Landing-Page fuer instantpage.at — ein oesterreichisches
SaaS, das KMU-Websites als Service liefert (kein Website-Builder).

Kontext: siehe angehaengte Datei landing-claude-design-brief.md

Anforderungen:
- Eine scrollbare Landing, responsive (Mobile + Desktop)
- Sections gemaess § 6 des Briefings
- Voice & Tone gemaess § 7 strikt einhalten
- Verbotene Begriffe gemaess § 8 NICHT verwenden
- Plattform-Aesthetik orientiert an Linear/Stripe/Vercel (§ 10)
- Sub-Headline-Wording aus den Slogan-Vorschlaegen § 9
- Pricing-Cards exakt mit Werten aus § 4 + Features aus § 5

Liefere:
1. Erstmal nur Hero + Wie-es-funktioniert + Pricing-Cards
   (drei Sections, mehr nicht — wir iterieren danach)
2. Plus 2-3 Vorschlaege fuer Plattform-Akzentfarben mit
   Anwendungsbeispielen am Hero-CTA-Button
3. Auf Deutsch (echte Umlaute, kein ae/oe/ue)

Keine Codebase noetig — alles steht im Briefing.
```

---

## 12. Erwartetes Output + Handoff

**Was Claude Design liefern soll:**
- Live HTML-Prototyp (Hero + Wie-es-funktioniert + Pricing fuer Iteration 1)
- 2-3 Farbvarianten visuell sichtbar
- Klare Sub-Komponenten (Buttons, Cards, Section-Header)

**Was DU dann machst:**
- Iteration via Inline-Comments + Slidern (nicht Chat — Token-arm)
- Wenn zufrieden: "Send to Claude Code" → Handoff-Bundle exportieren
- Bundle ins Repo legen unter `docs/_design/handoffs/landing-iteration-1/`
- Mir Bescheid geben — ich integriere in Production-Stack

**Was ICH dann mache:**
- Bundle lesen (component-tree, design-tokens, layout-spec)
- Production-Code im Live-Stack bauen (Next.js/TypeScript laut MIGRATION-PLAN)
- Mit existierender Brand + Compliance abgleichen
- Build-Test + Deploy-Vorbereitung

---

## 13. Was bewusst NICHT in diesem Briefing steht

- Konkrete Hex-Codes (du sollst Vorschlaege bekommen)
- Konkrete Section-Reihenfolge in Stein gemeisselt (§ 6 ist Vorschlag)
- Customer-Site-Beispiele (Recipe-System — nicht Teil dieser Landing-Aufgabe)
- Self-Service-Portal-Design (separates Briefing spaeter)

---

## Quellen im Repo (nicht ins Briefing aufnehmen, fuer dich zur Verifikation)

- Vision/Kernversprechen: `docs/PRODUCT.md` § 1
- Zielgruppe: `docs/PRODUCT.md` § 2
- Pricing: `docs/PRODUCT.md` § 3-4
- Voice & Tone, Slogans, verbotene Begriffe: `docs/BRAND.md` § 5, 7, 8
- Marketing-Site-Konzept-Outcome: `docs/DESIGN-VISION.md` § 5
- UWG-Liste komplett: `docs/LIVE-COMPLIANCE.md` § 15
