# Pre-Live-Bau Gap-Analyse

**Stand:** 2026-05-16
**Zweck:** Systematischer Pass durch alle Live-Bau-relevanten Bereiche — was ist fertig, was ist offen-aber-spec'd, was ist kritisch-blockierend, was ist Restschuld.
**Trigger:** User-Frage „eh nichts vergessen bevor wir mit dem Bau anfangen?"

---

## Executive Summary

**Verdict: Bereit fuer Phase 0, sobald externe Pre-Setup-Items fallen.**

- Doku-Phase ist faktisch **~98 % durch** — alle strategischen Entscheidungen getroffen, alle Plattform-Rechtstexte als Volltext im Repo, Plan-Portfolio inklusive Sonderloesungen spec'd, Wording-Locks
- **3 externe Pre-Setup-Blocker bleiben** (Geschaeftskonto, sevDesk, Steuerberater) — alle in User-Hand mit 1-2 Wo Lead-Time
- **1 zeitkritischer Termin** in 4 Tagen (WKO-Markensprechtag 2026-05-20) — Vorbereitung steht
- **1 grosse Eigenarbeits-Schuld** vor Live-Schaltung (Branchen-Pflichtfeld-Matrix § 9, ~17 Std Recherche fuer ~35 reglementierte Branchen — Phase-3-Item, nicht Phase-0-Blocker)
- **Restschuld < 10 kleine UI-/Implementation-Detail-Items** — alle Phase-1/2-Bau-relevant, keine Spec-Luecken

---

## ✅ FERTIG (vollstaendig, keine offenen Spec-Punkte)

### Compliance & Recht

| Bereich | Status | Quelle |
|---|---|---|
| **AGB-Volltext B2B** (15 Klauseln + 3 Plan-Portfolio + Subsidiaer-Verweis Whitelabel) | komplett ausformuliert, Selbstcheck ohne offene FLAGs | `LIVE-COMPLIANCE.md` § 5 + `legal-drafts/agb-selbstcheck.md` |
| **DSE-Volltext** (12 Abschnitte, alle 10 Pflicht-Bausteine + Cold-Outreach-Verarbeitung + KI-Verarbeitung) | Erstdraft fertig | `legal-drafts/datenschutz-plattform.md` |
| **AVV-Volltext** (Vertragsparteien + § 1-3 besondere Bestimmungen + Anhaenge I-IV) | Erstdraft fertig, SCC-Hauptteil als Verweis (EU 2021/915) | `legal-drafts/avv-plattform.md` |
| **Impressum-Volltext** (mit Stammdaten Wagner IT-Solutions) | Erstdraft fertig | `legal-drafts/impressum-plattform.md` |
| **Marketing-AGB-Wording-Audit** | Lock auf „Impressum und Datenschutz automatisch erstellt" | `legal-drafts/marketing-agb-audit.md` |
| **DSFA-Vorpruefung** | dokumentiert, keine DSFA-Pflicht | `LIVE-COMPLIANCE.md` § 11.7 |
| **TOMs** | komplett spec'd | `LIVE-COMPLIANCE.md` § 11 |
| **Subprozessoren-Liste** (13 Anbieter mit DPA-URLs) | komplett, Sign-off-Reihenfolge Phase 0 | `LIVE-COMPLIANCE.md` § 4 |
| **AI-Act-Strategie** (Footer-Hinweis + Schema.org + Freigabe-Klick als Ausschlussgrund) | spec'd inkl. AGB-Klausel § 5 Abs. 6 | `LIVE-COMPLIANCE.md` § 13 + `legal-drafts/datenschutz-plattform.md` § 10 |
| **Compliance-Tier-Modell** (7 Tiers, Pivot 2026-05-15 Eigenarbeits-First) | aktiviert, Anwalt Trigger-basiert spaeter | `LIVE-COMPLIANCE.md` Pivot-Note + § 18 |
| **Cold-Outreach-Mail-Templates** (3 Sparten + UWG-Selbstcheck-Liste) | Erstdraft fertig | `sales-templates/` |
| **Newcomer-Rabatt-Mechanik** (Coupon + Aktionsrabatt-Ende-Mail) | spec'd, AGB § 9 Abs. 5 verankert | `MARKETING.md` § 3.1 + `email-templates/aktionsrabatt-ende.md` |
| **Anwalts-Briefing** (Geparkt, wiederverwendbar) | komplett mit 5 Liefer-Paketen | `anwalt-briefing.md` |

### Produkt & Architektur

| Bereich | Status |
|---|---|
| **Pricing + Plan-Portfolio** (Starter/Pro/Einrichtungs-Service Day-1 + Business/Custom-Sites/Whitelabel auf Anfrage) | komplett spec'd `PRODUCT.md` § 3 |
| **DB-Schema** (Order + Activity-Log + AI-Calls + Live-Freigaben + Plan-Portfolio-Spalten) | komplett spec'd `ARCHITECTURE.md` § 4 |
| **Routing** (Wildcard-Subdomain via Middleware + Custom-Sites-R2-Static-Files-Bypass) | komplett spec'd § 5.2 |
| **Auth + Security** (Supabase Auth + 2FA + RLS + Rate-Limits) | komplett spec'd § 10 |
| **Provider-Portabilitaet** (callLLM() Abstraktion + ai_calls neutral) | komplett spec'd § 1.4 |
| **KI-Modell-Strategie** (Sonnet kundensichtbar + Haiku intern) | komplett spec'd § 1.3 |
| **Re-Generation-Logik** (manuelle Trigger + plan_type-Check fuer Custom-Sites) | komplett spec'd § 4.1 + AGB § 4 Abs. 5 |
| **Live-Schaltungs-Workflow** (Freigabe-Klick + Akzept-Checkbox + live_freigaben-Tabelle) | komplett spec'd `LIVE-COMPLIANCE.md` § 1 #24 + ARCHITECTURE § 4.7 |

### Recipes & Frontend

| Bereich | Status |
|---|---|
| **Recipe-System v1** (14 Berufsgruppen × 2-3 Looks = ~32 Recipes) | komplett spec'd `RECIPE-SYSTEM.md` + `_design/recipe-konfiguration.md` |
| **Beta-Template als Grundlage** (Architektur + Stil + Charakter) | gelockt 2026-05-11 |
| **3 Anker-Recipes** (Tischler / Beratung / Anwalt) | Detail-Specs in `_design/recipes/` |
| **Live-Bau-Backlog** (statt 9 weitere Recipe-Theory-Specs) | konsolidiert `_design/live-bau-backlog.md` |
| **Theme-Tokens** (Klassisch/Modern/Editorial/Custom auf Beta-Linie) | spec'd `_design/themes.md` |
| **Quality-Standards § 13** (Lighthouse ≥90, WCAG AA, Quality-Score-Schwellen) | spec'd `DESIGN-VISION.md` |
| **Reference-Library Skeleton** (Layer-0-Input fuer Skills + design-reviewer) | spec'd `_design/references/` |
| **Section-Vokabular** | komplett spec'd `_design/sections/_BETA-VOCABULARY.md` |

### Operations

| Bereich | Status |
|---|---|
| **Email-Templates** (11 Lifecycle-/On-Demand-Templates) | Spec-fertig `email-templates/` |
| **Backup-Strategie** (Supabase Pro PITR + R2-Mirror, RPO/RTO gestuft) | komplett spec'd `OPERATIONS.md` § 6 |
| **Monitoring-Setup** (Cloudflare + UptimeRobot + Sentry + Twilio Critical-SMS) | komplett spec'd § 9 |
| **Incident-Response-Runbook** | komplett spec'd § 1 |
| **Notice-and-Takedown** (abuse@instantpage.at + 3-Werktage-Antwort, AGB § 7 Abs. 4) | spec'd § 4 + AGB |
| **Datenpannen-Meldeprozess** (Art 33/34 DSGVO) | spec'd § 5 |
| **Kunden-Onboarding-Playbook** (inkl. reglementierte Berufe + Stuck-State-Diagnose) | komplett spec'd § 8 |
| **Custom-Sites-Workflow** (Anfrage-zu-Live + Bauvertrags-Pflicht-Inhalte + Wartungs-Stunden-Monitoring) | spec'd § 8.6 |
| **Self-Check vierteljaehrlich** | spec'd § 7 |

### Brand & Marketing

| Bereich | Status |
|---|---|
| **Brand-Identitaet** (Voice, Tonalitaet, Anrede-Regeln, Slogans) | komplett `BRAND.md` |
| **Brand-Kit** (SVG/PNG-Logos, Favicon-Set, OG-Image, Brand-Guidelines-PDF) | komplett 2026-05-14 |
| **Wording-Lock** („Impressum und Datenschutz automatisch erstellt") | komplett 2026-05-16 |
| **Tagline-Lock** („Die Website fuer oesterreichische KMU. 10 Minuten Aufwand.") | komplett 2026-05-12 |
| **MARKETING Block-D Phase-1-Lock** (Newcomer-Rabatt + Multiplikator-Post-Live + Erstziel-Sparten Wien/NOE) | komplett 2026-05-15 |
| **Cold-Outreach-Templates** (3 Sparten + Versand-Logik 3 Touchpoints / 14 Tage / 90 Tage Pause) | komplett |
| **LinkedIn Company Page** | live |
| **WKO-Sprechtag-Vorbereitung** | komplett: Vollversion + 1-Pager-Cheatsheet + Brand-Alternativen-Plan-B |

---

## ⏳ OFFEN ABER PHASE-X-GEPLANT (kein Phase-0-Blocker)

### Phase 0 (Live-Repo + Stack-Setup, ~1 Woche, Woche 3)

| Aufgabe | Quelle |
|---|---|
| Neues Repo `instantpage` anlegen (Next.js 15 + TS + Tailwind + shadcn + Drizzle + Zod) | `MIGRATION-PLAN.md` § 3 |
| CI/CD + Lighthouse-CI + Wrangler.toml + Staging-Environment | § 3.3 |
| Doku komplett kopieren, `siteready.at` → `instantpage.at` | § 5 |
| Memory-Pfad-Migration unter neuem Project-Pfad | § 6.1 |
| `config/legal-values.ts` Single-Source-of-Truth Stammdaten anlegen | `LIVE-COMPLIANCE.md` Compliance-Strategie Tier 3 |
| Subagents anlegen: `compliance-reviewer` + `design-reviewer` + `quality-watchdog` | `MIGRATION-PLAN.md` § 6.2 + `project_dev_subagents_idea.md` |
| Accounts anlegen: Supabase Pro, Cloudflare for SaaS, Stripe Live, Resend, Sentry, PostHog Cloud EU | § 7 + `business-case-kosten.md` |
| DPA-Sign-off pro Anbieter (Reihenfolge: CF → Supabase → Stripe → Anthropic → Microsoft) | `LIVE-COMPLIANCE.md` § 4 |
| RechtGPT Starter-Subscription starten (~30 EUR, fuer Bau-Phase) | Compliance-Strategie Tier 1.5 |
| DNS instantpage.at (Wildcard + Mail-Records SPF/DKIM/DMARC) | § 7.1 + `MIGRATION-PLAN.md` § 7.1 |

### Phase 0.5 (Block B-D Design-Vision, Wochen 4-12)

| Aufgabe | Quelle |
|---|---|
| Block B Plattform-Design-System | `DESIGN-VISION.md` Block B (offene Items) |
| Mockups + Theme-Tokens entstehen direkt im Live-Repo | `MIGRATION-PLAN.md` § 8 Phase 0.5 |

### Phase 1 (Section-Library + Themes, ~6 Wochen)

| Aufgabe | Quelle |
|---|---|
| 4 Themes mit CSS-Tokens | `RECIPE-SYSTEM.md` |
| ~25 Section-Bausteine als Tailwind+shadcn-Components | `_design/sections/_BETA-VOCABULARY.md` |
| Branchen-Funktionen-Forms (Reservierung, Termin, Buchung) | LIVE-COMPLIANCE § 10 |

### Phase 2 (Recipes + Auto-Engine + Fragebogen, ~6 Wochen)

| Aufgabe | Quelle |
|---|---|
| 24+ Recipe-Configs | `_design/recipe-konfiguration.md` |
| Auto-Engine (Hero-Variante, Layout-Density, Section-Visibility, Logo-Farbe, Anrede-Detection) | `RECIPE-SYSTEM.md` |
| Fragebogen-Refactor (14 Berufsgruppen-Karten + Look-Karten) | `project_berufsgruppen_refactor.md` |
| Portal-Erweiterung (Design-Tab, Live-Preview) | `_design/portal-design.md` |
| **B2B-Pflicht-UX** (Hinweis-Box + UID-optional + Selbsterklaerungs-Checkbox) | `PRODUCT.md` § 5.1 |

### Phase 3 (Compliance + Operations, ~3 Wochen)

| Aufgabe | Quelle |
|---|---|
| **Branchen-Pflichtfeld-Matrix Detail-Recherche** (35 Branchen × ~30 Min = 17h, via parallel-Subagents in 1-2 Sitzungen) | `LIVE-COMPLIANCE.md` § 9 — **groesste Eigenarbeit-Schuld** |
| Defensive KI-Prompts fuer reglementierte Berufe | § 10.2 |
| Termin-Anfrage-Variante ohne Anliegen-Feld | § 10.3 |
| Disclaimer-Modal bei reglementierter Branche im Onboarding | § 10.4 |
| AI-Act Footer-Hinweis auf Kundensites + Schema.org-Marker | § 13 |
| Cookie-Banner Plattform (Klaro) | § 1 #15 |
| Mailing-Pipeline (Resend-Templates aus den 11 Markdown-Drafts) | `OPERATIONS.md` § 2 |
| Trial-Cleanup + Cancellation-Cleanup-Crons aktivieren | OPERATIONS § 8.3 |

### Phase 4 (Beta-Migration + Launch, ~1 Woche)

| Aufgabe | Quelle |
|---|---|
| Versicherung R+V abschliessen | `LIVE-COMPLIANCE.md` § 3 |
| Stripe Live-Verifikation abschliessen | wartet auf Geschaeftskonto-IBAN |
| Beta-Tester informieren + Promo-Codes | `email-templates/beta-cutover.md` |
| Beta-Daten loeschen + Beta-Domain abschalten | `MIGRATION-PLAN.md` § 4.3 |
| Markenanmeldung (sofern WKO-Termin freigibt) | `LIVE-COMPLIANCE.md` § 14 |
| Soft-Launch mit ersten 5-10 Kunden | § 8 Phase 4 |
| Stripe-Custom-Products anlegen: `INSTANT_SETUP_149`, `CUSTOM_HOSTING_79`, Coupon `NEWCOMER-20-FIRSTYEAR` | `PRODUCT.md` § 3 |
| Stripe-Invoice-Template mit AT-Pflichtangaben + Kleinunternehmer-Klausel | § 3.0 |

### Phase 5 (Stabilisierung, erste 3 Monate)

| Aufgabe | Quelle |
|---|---|
| Self-Check vierteljaehrlich | `LIVE-COMPLIANCE.md` § 19 |
| AI-Act Stichtag 2026-08-02 — Footer-Hinweis vorbereitet | § 13 |
| Monitoring der Anwalts-Trigger-Schwellen (30 Kunden, erste Abmahnung, etc.) | § 18 |
| Quartalsweise Backup-Restore-Drill | `OPERATIONS.md` § 6.3 |

---

## ⚠️ KRITISCHE EXTERN-BLOCKER (User-Hand)

| Blocker | Lead-Time | Status | Bemerkung |
|---|---|---|---|
| **Geschaeftskonto Erste Business** | erledigt | ✅ **EROEFFNET 2026-05-16** (IBAN AT84 2011 1857 5281 8000, BIC GIBAATWWXXX) | groesster Blocker gefallen — Stripe-Live-Verifikation kann jetzt starten |
| **sevDesk + MiracleSync Setup** | ~30 Min Setup | NICHT GESTARTET | Buchhaltung-Pipeline, vor Stripe-Live |
| **Steuerberater Mini-Termin** | 1 Termin (~100 EUR) | NICHT ANGEFRAGT | bestaetigt Stripe-AT-Konformitaet + sevDesk-Setup + Workflow Voucher-Finalisierung |
| **R+V Berufshaftpflicht** | online 3-5 Tage | entschieden 2026-05-06, nicht abgeschlossen | 173 EUR/Jahr Backstop, vor Live |
| **WKO-Markensprechtag** | Termin 2026-05-20 | gebucht, Vorbereitung steht | in 4 Tagen, Cheatsheet + Brand-Alternativen-Plan-B vorhanden |

---

## 🔧 KLEINE OFFENE PUNKTE / RESTSCHULD

Items, die spec'd sind, aber konkrete UI/OPS-Vorlagen brauchen vor erstem realen Anwendungsfall. Keine Phase-0-Blocker.

| Item | Wo | Status | Wann zwingend |
|---|---|---|---|
| **WKO-Fachgruppe-Eintrag verifizieren** (Impressum sagt aktuell `[VERMUTET UBIT]`) | `legal-drafts/impressum-plattform.md` | Vor Live | Phase 4 Cutover |
| **Bauvertrags-Vorlage Custom-Sites** als File-Skeleton in OPERATIONS § 8.6 erwaehnt | nicht angelegt | Vor erstem Custom-Auftrag | bei erster Anfrage |
| **Einzelvertrags-Vorlage Whitelabel-Agentur** | nicht angelegt, Anwalts-Pflicht laut AGB-Selbstcheck Nachtrag § 18 | Vor erster Whitelabel-Aktivierung | bei erster Vormerker-Anfrage |
| **AGB-Akzeptanz-Verfahren UX-Detail** (Modal vs PDF, beim Trial-Start vs ersten Login) | `LIVE-COMPLIANCE.md` § 12.6 — `[STUB]` | Vor Live | Phase 3 Compliance |
| **`incidents.log` File-Standort** spec'd, aber Pfad nicht festgelegt | LIVE-COMPLIANCE § 4 | Vor Phase 0 | Phase 0 |
| **Brand-Alternativen-Liste konkretisieren** falls WKO-Termin „beschreibend abgelehnt" prognostiziert | `brand-alternativen.md` Cluster-Vorschlaege | nur bei Aktivierung | nach 2026-05-20 |
| **Source-Files-Regelung im Bauvertrag** (Custom-Sites § 17 Abs. 8 — OPS-Vorlage erwaehnt) | OPERATIONS § 8.6 als Pflicht-Inhalt | Vor erstem Custom-Auftrag | bei erster Anfrage |
| **Quality-Score Auto-Re-Gen-Logik** Implementation | `PRODUCT.md` § 3.4 spec'd | Phase 1/2 Bau | vor Live |
| **Logo-monochrom-Weiss-Variante** im Brand-Kit | `BRAND.md` § 2.4 offen | Live-Schaltung optional | Phase 4 Cutover |
| **Manuelles Outreach-Lead-List Pre-Launch** (50 Leads/Sparte × 3 Sparten = 150 Leads) | `MARKETING.md` § 2.2 | Vor Soft-Launch | Phase 4 |
| **Beta-Tester-Liste** + Promo-Code-Schema fuer Cutover-Mail | `email-templates/beta-cutover.md` | Vor Cutover | Phase 4 |
| **Wartungs-Stunden-Tracking-UI im Admin** fuer Custom-Sites | OPERATIONS § 8.6 spec'd | Phase 2 wenn Custom-Sites-Pipeline live | bei erstem Custom-Auftrag |
| **Cron-Files Bau** (backup-mirror, health-monitor, quota-counter, dns-check) | OPERATIONS § 6.1 — als `[BAU im Live-Migration]` markiert | Phase 3 | Phase 3 |

---

## 🎯 PHASE-0-START-CHECKLISTE

Sobald Geschaeftskonto-IBAN vorliegt, koennen diese Items parallel zur Stripe-Verifikation gestartet werden:

### Tag 1
- [ ] Neues Repo `~/REPO/instantpage` mit `npx create-next-app@latest`
- [ ] Stack-Install (Drizzle + Zod + shadcn-init + Supabase + Wrangler + Vitest + Playwright)
- [ ] Doku-Migration `cp -r docs/ ../instantpage/` + Search-Replace
- [ ] Memory-Pfad anlegen unter `~/.claude/projects/-Users-alex-REPO-instantpage/memory/`
- [ ] feedback_*.md + project_*.md kopieren (mit Updates aus `MIGRATION-PLAN.md` § 6.5)
- [ ] `.claude/CLAUDE.md` Projekt-Anweisungen

### Tag 2
- [ ] `.claude/agents/compliance-reviewer.md` aus `project_dev_subagents_idea.md` Block 1
- [ ] `.claude/agents/design-reviewer.md` aus Block 5
- [ ] `.claude/agents/quality-watchdog.md` aus ebenda
- [ ] Erste Claude-Code-Session im neuen Repo — pruefen ob feedback inline geladen wird

### Tag 3-4 (Accounts)
- [ ] Supabase Pro Account anlegen — Project `instantpage-prod`
- [ ] Cloudflare Pages-Projekt anlegen + Cloudflare for SaaS (100 Hostnames frei)
- [ ] Cloudflare Images aktivieren
- [ ] Stripe Live-Mode beantragen (mit Geschaeftskonto-IBAN)
- [ ] Resend Account + Verify Domain instantpage.at
- [ ] PostHog Cloud EU Account
- [ ] Sentry Account
- [ ] Microsoft 365 / Google Workspace fuer Mail-Postfaecher (info@, support@, datenschutz@, abuse@, rechnung@, news@, opt-out@)
- [ ] RechtGPT Starter (~30 EUR)
- [ ] Twilio AT-Nummer fuer Critical-SMS (~5-10 EUR/Mo)

### Tag 4-5 (DPAs + Domain)
- [ ] DPA-Sign-off in Reihenfolge: CF → Supabase → Stripe → Anthropic → Microsoft
- [ ] Datum + Account-Beleg im internen `incidents.log` festhalten
- [ ] DNS Konfiguration instantpage.at:
  - Wildcard `*.instantpage.at` als CNAME auf Cloudflare Pages
  - Mail-Records SPF + DKIM + DMARC fuer Resend
  - Apex-Record auf Plattform-Landing

### Tag 5-7 (Initial-Code)
- [ ] `wrangler.toml` mit Env-Vars + Bindings + Cron-Triggers
- [ ] Drizzle-Schema-Migrationen aus `ARCHITECTURE.md` § 4
- [ ] Stripe-Customer-Setup-Code (tax_exempt, Custom Fields, Invoice-Template mit AT-Pflichtangaben + Kleinunternehmer-Klausel)
- [ ] `config/legal-values.ts` Single-Source-of-Truth mit Stammdaten
- [ ] CI/CD `.github/workflows/ci.yml` (ESLint + TypeScript-Check + Vitest + Playwright + Lighthouse-CI)
- [ ] Staging-Environment + PR-Preview-Deployments

**Ab Tag 7-10:** Phase 0.5 Block B-D Design-Vision im Live-Repo, parallel zu wartender Stripe-Verifikation.

---

## Restrisiko-Inventory (vor Live)

| Risiko | Wahrscheinlichkeit | Schaden | Mitigation |
|---|---|---|---|
| WKO-Sprechtag „InstantPage beschreibend abgelehnt" | mittel | Brand-Reset 1-2 Wochen + 150-500 EUR | Brand-Alternativen-Plan-B vorhanden, Wortbildmarke als Stretch-Loesung |
| Stripe-Verifikation laenger als 2 Wochen | niedrig-mittel | Live-Schaltung verzoegert | parallel Doku-/Marketing-Polish moeglich |
| AI-Act-Auslegung aendert sich vor 2026-08-02 | niedrig | Footer-Klausel + AGB § 5 Abs. 6 anpassen | Self-Check vierteljaehrlich, RTR-Newsletter abonniert |
| Schrems-III-Urteil (DPF-Wegfall) | niedrig in 12 Mo | DPAs muessen auf SCC umgestellt werden | Quartals-Check Subprozessoren-Status |
| Branchen-Pflichtfeld-Matrix unvollstaendig bei reglementierter-Berufe-Kunden | mittel-niedrig | Mitstoererhaftung-Risiko | 17h-Eigenarbeit Phase 3 vor Live, Versicherung als Backstop |
| Erste UWG-Abmahnung wegen Marketing-Wording | niedrig (durch Lock entschaerft) | 200-1.500 EUR + Wording-Aenderung | konservativer Lock 2026-05-16, Audit-Trail vorhanden |
| Custom-Site-Anfrage fuer reglementierten Beruf (Anwalt/Arzt) | mittel ab Live | Mitverantwortungs-Risiko | Bauvertrag-Vorlage mit Ablehnungs-Recht spec'd, AGB § 17 Abs. 4 ergaenzt |

**Versicherungs-Backstop:** R+V Berufshaftpflicht 173 EUR/Jahr deckt die meisten Klausel-Probleme bis zu den Haftungsgrenzen (siehe `LIVE-COMPLIANCE.md` § 3).

---

## Cross-Refs (alle relevanten Quellen)

- `LIVE-COMPLIANCE.md` — Compliance-Master, Tier-Modell, Aktionen, Trigger-Schwellen
- `MIGRATION-PLAN.md` — Phase-Plan, Repo-Setup, Memory-System-Uebernahme
- `PRODUCT.md` — Pricing, Plan-Portfolio, Trial, Portal-UX
- `ARCHITECTURE.md` — Tech-Stack, DB-Schema, Routing, Auth, Backup, Security
- `OPERATIONS.md` — Runbook, Email-Templates, Backup-Restore, Onboarding, Monitoring
- `BRAND.md` — Voice/Tone, Logo, Slogans
- `MARKETING.md` — Acquisition-Channels, Growth-Mechaniken
- `RECIPE-SYSTEM.md` — Kundenseiten-Architektur
- `business-case-kosten.md` — Wirtschaftlichkeit, Margen pro Plan
- `legal-drafts/` — Eigenarbeits-Volltexte aller Plattform-Rechtstexte
- `sales-templates/` — Cold-Outreach-Templates
- `email-templates/` — 11 Lifecycle-/On-Demand-Templates
- `_design/` — Design-Detail-Specs
- `anwalt-briefing.md` — geparkte Wiederverwendbar-Vorlage
- `wko-sprechtag-2026-05-20.md` + `wko-sprechtag-cheatsheet.md` + `brand-alternativen.md` — Marken-Anmeldung
