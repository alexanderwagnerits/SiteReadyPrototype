# Migration-Plan: Prototyp → Live-Produkt

> **Master-Dokument für den Live-Bau in neuer Umgebung.** Beschreibt Setup, Übernahme aus Prototyp, Reihenfolge und Erfolgskriterien.

**Stand:** 2026-05-01
**Ziel-Brand:** instantpage.at
**Ziel-Stack:** TypeScript + Next.js 15 (App Router) + Drizzle + Zod + shadcn/ui + Cloudflare Pages via OpenNext.js
**Übergang:** sauberer Schnitt, keine Daten-Migration (siehe Memory `project_production_refactor.md`)

---

## Inhalt

1. [Strategische Grundsätze](#1-strategische-grundsätze)
2. [Pre-Setup außerhalb Code (Lead-Time wichtig)](#2-pre-setup-außerhalb-code-lead-time-wichtig)
3. [Repo-Setup neue Umgebung](#3-repo-setup-neue-umgebung)
4. [Was aus Prototyp übernommen wird](#4-was-aus-prototyp-übernommen-wird)
5. [Doku-Übernahme](#5-doku-übernahme)
6. [Memory-System-Übernahme](#6-memory-system-übernahme)
7. [Tools, Skills, Subagents, MCP](#7-tools-skills-subagents-mcp)
8. [Bau-Phasen](#8-bau-phasen)
8.5. [Bau-Workflow + Block-Aufteilung](#85-bau-workflow--block-aufteilung)
9. [Erfolgs-Kriterien pro Phase](#9-erfolgs-kriterien-pro-phase)
10. [Beta → Live Cutover](#10-beta--live-cutover)
11. [Was wir wissen müssen bevor wir starten](#11-was-wir-wissen-müssen-bevor-wir-starten)

---

## 1. Strategische Grundsätze

| Grundsatz | Begründung |
|---|---|
| **Sauberer Schnitt** Beta → Live | Keine Daten-Migration, neuer Repo, neue DB, neuer Stripe-Account. Beta-Tester legen sich neu an mit Promo-Code. (Memory `project_production_refactor.md`) |
| **Brand-Wechsel** SiteReady → instantpage.at | Domain bereits gesichert, Logo vorhanden. Alle Marketing- und Public-Faces unter neuem Namen. |
| **Stack-Modernisierung** | CRA + Vanilla-JS war Prototyp-tauglich, ist für zahlendes Live-Produkt nicht angemessen. TypeScript + Next.js + Drizzle + Zod + shadcn/ui ist Industry-Standard 2026. |
| **AT-only Phase 1** | Keine OSS, keine Stripe-Tax-Komplikationen, kein FAGG-Detail-Schutz. DACH/EU als Phase 2. |
| **B2B-only** mit UID-Pflicht | Vereinfacht FAGG, vereinfacht USt, klare Zielgruppe. |
| **Compliance ohne Anwalt** | Phase-1-Live mit Eigenarbeit + offiziellen Quellen. Anwalt Trigger-basiert ab definierten Schwellen. Siehe `docs/LIVE-COMPLIANCE.md`. |
| **Recipe-System v1** als Kundenseiten-Architektur | Branchen-spezifische Looks statt generischer Stile. 12 Berufsgruppen × 1–4 Looks = 24 Recipes. Siehe `docs/RECIPE-SYSTEM.md`. |
| **Beta = nur Look & Feel** | Keine Live-Features im Prototyp nachbauen. (Memory `feedback_beta_fokus.md`) |
| **Live-Repo früh anlegen** (Woche 3, nicht Woche 13) | Stack ist komplett anders (TS+Next.js statt JS+CRA). Mockups + Design-Vision-Spec ab Block B direkt im Ziel-Repo entstehen lassen. Spart Umzug + nur ein Ort für Live-Arbeit. |
| **Prototyp ab Woche 3 = Wartungs-Modus** | Hier nur noch: Beta-Bugfixes (kritisch), Doku-Pflege bis Cutover, Prompt-Tuning gegen echte Beta-Daten. Keine neuen Features, kein Refactor, keine Section-Library — alles würde weggeworfen. |
| **Async-Bau via Cloud-Sessions + GitHub Actions** | Bau-Tokens laufen flat über Claude Max 5x ($100/Mon, hat User schon). User wird Reviewer + Spec-Autor, nicht Builder. Mehrere PRs parallel statt linear schreiben. Siehe § 8.5 Block-Aufteilung. |
| **Bau-Inkrement ~€100-200 total** | Subscription läuft sowieso, Domain auch. Nur Supabase Pro (€50-75) + Test-API-Tokens (€20-80) sind echtes Inkrement. |

---

## 2. Pre-Setup außerhalb Code (Lead-Time wichtig)

Diese Schritte VOR Code-Beginn anstoßen — manche brauchen 1–2 Wochen.

| Aktion | Lead-Time | Status |
|---|---|---|
| Versicherung sourcen (IT-Haftpflicht-Paket) — siehe `docs/LIVE-COMPLIANCE.md` § 3 | 1–2 Wochen | `[OFFEN]` |
| Markenrechts-Recherche instantpage.at | 1 Tag | `[OFFEN]` |
| Geschäftskonto + Buchhaltungssoftware (sevDesk o.ä.) | 1 Woche | `[OFFEN]` |
| Stripe Business-Verifikation für Live-Mode | 1–2 Wochen | `[OFFEN]` |
| Subprozessor-DPAs herunterladen + sichten | 1 Tag | `[OFFEN]` |
| Steuerberater zu Pricing-USt-Frage | 1 Termin | `[OFFEN]` |
| Cloudflare for SaaS Setup (Custom Hostnames) | 1 Tag | `[OFFEN]` |
| Mailing-Provider entscheiden (Resend/Postmark) + Account | 1 Tag | `[OFFEN]` |
| PostHog Cloud EU Account | 30 Min | `[OFFEN]` |
| Sentry Account | 30 Min | `[OFFEN]` |
| Domain-DNS Konfiguration instantpage.at | 1 Tag | `[OFFEN]` |
| WKO-Beratungstermin (Gewerbeordnung + AT-Spezifika) | 1 Termin | `[OFFEN]` |

---

## 3. Repo-Setup neue Umgebung

### 3.1 Neues Repo, nicht Branch

Begründung: Stack-Wechsel + Brand-Wechsel + saubere Git-History. Aktueller Prototyp-Repo bleibt als Referenz.

Vorschlag-Name: `instantpage` oder `instantpage-live`.

### 3.2 Initial-Stack

```bash
# Next.js 15 mit TypeScript + Tailwind + App Router
npx create-next-app@latest instantpage --typescript --tailwind --app --src-dir

# Cloudflare Pages via OpenNext.js
npm install -D @opennextjs/cloudflare wrangler

# Drizzle ORM für Supabase
npm install drizzle-orm postgres
npm install -D drizzle-kit

# Zod für Forms + API
npm install zod react-hook-form @hookform/resolvers

# shadcn/ui — initial setup
npx shadcn-ui@latest init

# TanStack Query für Server-State
npm install @tanstack/react-query

# Auth via Supabase
npm install @supabase/supabase-js @supabase/ssr

# Testing
npm install -D vitest @vitest/ui playwright
```

### 3.3 Initial-Konfigurations-Files

| Datei | Inhalt |
|---|---|
| `wrangler.toml` | Cloudflare Pages Config, Env-Vars, Routes, Cron-Triggers — versioniert |
| `.github/workflows/ci.yml` | GitHub Actions: ESLint + TypeScript-Check + Vitest + Playwright + Lighthouse-CI |
| `.github/workflows/deploy-staging.yml` | Auto-Deploy bei PR auf `staging`-Branch |
| `drizzle.config.ts` | Drizzle-Konfiguration für Supabase EU |
| `.claude/CLAUDE.md` | Projekt-Anweisungen (siehe Abschnitt 6) |
| `docs/` Ordner | aus Prototyp übernommen (siehe Abschnitt 5) |

### 3.4 Branch-Strategie

- `main` = Production (auto-deploy nach Live)
- `staging` = Pre-Production (auto-deploy nach Staging-Env)
- `feature/*` = Feature-Branches mit PR-Preview-Deployments

---

## 4. Was aus Prototyp übernommen wird

### 4.1 Übernehmen — Logik und Daten-Modell

| Aus Prototyp | Wohin im Live-Repo | Anmerkung |
|---|---|---|
| `src/data.js` `BRANCHEN`-Liste (~120 Einträge) | `src/lib/branchen.ts` (TypeScript) | Bleibt als interne Wissensbasis für Bezeichnung-Match (Memory `project_recipe_system_v1.md`) |
| `src/data.js` `BRANCHEN_GRUPPEN` | `src/lib/berufsgruppen.ts` | 12 Berufsgruppen für User-Wahl |
| `functions/_lib/generate.js` Generate-Logik + Prompts | `src/lib/generate/` | TypeScript-Migration, Prompt-Caching beibehalten |
| `functions/api/import-website.js` Import-Logik (Firecrawl + Jina + Claude) | `src/app/api/import/route.ts` | TypeScript-Migration |
| `functions/s/[subdomain]/legal.js` Impressum-Generator | `src/lib/legal/impressum.ts` | Erweitert um `BRANCHE_PFLICHT`-Map (siehe `docs/LIVE-COMPLIANCE.md` § 9) |
| Supabase RLS-Policies (alle 4 Tabellen) | `supabase/migrations/` | Versioniert via Drizzle-Migrations |
| Subprozessor-Setup (Anthropic, Cloudflare, Stripe-Test, Supabase) | gleiche Anbieter, neue Accounts | Stripe + Supabase neu, Anthropic-Key kann übernommen werden |
| Bildrechte-Modal-Logik | shadcn/ui Modal | UI neu, Logik gleich |
| Quality-Check-Logik | gleich | Score 0–100, Issues in DB |
| Hero-Headline-Pattern (Memory `project_hero_headline_pattern.md`) | gleich | H1 Kernbotschaft, Sub Firmenname |

### 4.2 Neu bauen

| Was | Begründung |
|---|---|
| Komplette UI mit shadcn/ui + Tailwind | CRA-Custom-Components ersetzt durch Industry-Standard |
| Section-Library (~25 Bausteine) | Recipe-System v1 — siehe `docs/RECIPE-SYSTEM.md` |
| 4 Themes (Klassisch, Modern, Editorial, Handwerklich) | Recipe-System v1 |
| 24 Recipes (Berufsgruppe × Look) | Recipe-System v1 |
| Auto-Engine (Hero-Variante, Layout-Density, Section-Visibility) | Recipe-System v1 |
| Fragebogen mit 12 Berufsgruppen-Karten | statt 160-Branchen-Dropdown |
| Mailing-Pipeline (Welcome, Trial, Cancel, Payment-Failed) | im Prototyp bewusst nicht gebaut |
| Stripe Live-Mode-Integration + Customer-Portal | Test-Mode → Live-Mode |
| Custom-Domain-Workflow (Cloudflare for SaaS) | Pro-Plan-Feature |
| Cloudflare Web Analytics auf Kunden-Websites | Pro-Plan-Feature |
| Scheduled Crons (stuck-pending, trial-cleanup, health-check) | im Prototyp manuell |
| AI-Act Footer-Hinweis auf Kunden-Websites | Stichtag 2.8.2026 |

### 4.3 NICHT übernehmen

| Was | Warum |
|---|---|
| Beta-Daten in Supabase | Sauberer Schnitt — DELETE alle Beta-Daten vor Live |
| Beta-Subdomain `sitereadyprototype.pages.dev` | Wird abgeschaltet (410 Gone oder Redirect-Hinweis) |
| Alte 3 Stile (klassisch/modern/elegant) | Ersetzt durch 4 Themes + 24 Recipes |
| Beta-Tester-Accounts | Tester legen sich auf Live neu an mit Promo-Code |
| Custom JS-Components | Ersetzt durch shadcn/ui |
| Vanilla-JS-Fragebogen-Code | Ersetzt durch React Hook Form + Zod |
| Supabase docs-Tabelle | Doku zieht ins Repo |
| Admin-Portal Doku-Tab | Wird abgeschaltet oder zeigt Repo-Datei |

---

## 5. Doku-Übernahme

Vollständige Doku-Struktur ins neue Repo übernehmen:

```
docs/
├── README.md                       # Doku-Index
├── PRODUCT.md                      # Produkt-Spec
├── ARCHITECTURE.md                 # Tech-Stack, DB, Deployment
├── RECIPE-SYSTEM.md                # Kundenseiten-Architektur
├── LIVE-COMPLIANCE.md              # Recht / Compliance
├── OPERATIONS.md                   # Runbook, Email-Templates, Support-FAQ
├── BRAND.md                        # Voice/Tone, Logo, Slogans
├── MIGRATION-PLAN.md               # Diese Datei (im Live-Repo umbenennen zu BUILD-PLAN.md o.ä.)
├── business-case-kosten.md         # Wirtschaftlichkeit
└── _archive/
    └── PROJECT-STAND-MAERZ-2026.md # Prototyp-Snapshot
```

**Beim Übergang anpassen:** alle `siteready.at` → `instantpage.at`, alle Stand-Daten aktualisieren, Code-Verweise auf neue Pfade umbiegen (z.B. `functions/...` → `src/app/api/...`).

---

## 6. Memory-System-Übernahme

Im neuen Repo wieder ein Memory-System aufbauen unter `~/.claude/projects/<neuer-repo-pfad>/memory/`. Welche Memorys mitnehmen:

### Übernehmen (1:1)

| Memory | Begründung |
|---|---|
| `user_device.md` | bleibt gültig |
| `feedback_speed.md` | Konvention |
| `feedback_umlaute.md` | Konvention |
| `feedback_design_skills.md` | Konvention |
| `feedback_serve_time_alles.md` | Konvention (sinngemäß auch in Next.js) |
| `feedback_kontaktformular_prototyp.md` | wird im Live anders, aber Kontext nützlich |
| `feedback_code_ist_wahrheit.md` | Konvention |
| `feedback_git_add_specific.md` | Konvention |
| `feedback_weniger_confirmations.md` | Konvention |
| `feedback_ux_mockups.md` | Konvention |
| `project_design_references_live.md` | bleibt relevant |
| `project_marketing_skills_eval.md` | Live-Marketing |
| `project_sales_agent_idea.md` | Live-Backlog |
| `project_dev_subagents_idea.md` | Live-Setup |

### Übernehmen mit Update

| Memory | Anpassung |
|---|---|
| `project_recipe_system_v1.md` | als `docs/RECIPE-SYSTEM.md` ins Repo promoviert, Memory bleibt als Quick-Reference |
| `project_production_refactor.md` | Großteil ist jetzt in `docs/MIGRATION-PLAN.md` + `docs/ARCHITECTURE.md` — Memory abspecken |
| `project_kundenseiten_roadmap_2026-04-17.md` | Status pro P0-Item aktualisieren |
| `project_live_compliance.md` | Pointer auf `docs/LIVE-COMPLIANCE.md` |
| `project_naechste_session_agenda.md` | überarbeiten für Live-Bau-Phase |

### NICHT übernehmen

| Memory | Warum |
|---|---|
| Alle `project_agenda_2026-04-*.md` | Session-Logs des Prototyps, im Live-Repo neue starten |
| `project_supabase_rls.md` | Wird durch neue Drizzle-Migrations dokumentiert |
| `project_hero_headline_pattern.md` | Wird Code-Doku im Live-Repo |
| `project_import_quellen_plan.md` | Veraltet bei Recipe-System |
| `project_stil_*` Memorys | Stile sind ersetzt durch Recipes/Themes |
| `project_todo_2026-04-15.md` | erledigt oder veraltet |
| `feedback_farben_serve_time.md` | Implementations-Detail des Prototyps |
| `feedback_section_design.md` | wird Code-Doku in Section-Library |
| `feedback_pricing_features.md` | wird Teil von `docs/PRODUCT.md` |
| `feedback_social_dezent.md` | wird Teil von `docs/BRAND.md` |
| `feedback_ci_build.md` | gilt nicht mehr (Next.js statt CRA) |
| `feedback_rate_limiting_live.md` | wird umgesetzt → kann dann gelöscht werden |
| `project_portal_*` Memorys | Portal wird neu gebaut |
| `project_berufsgruppen_refactor.md` | Wird umgesetzt — siehe `docs/RECIPE-SYSTEM.md` |

---

## 7. Tools, Skills, Subagents, MCP

### 7.1 MCP-Server (im neuen Repo einrichten)

| MCP | Zweck | Setup |
|---|---|---|
| Supabase MCP | direkter DB-Zugriff statt curl | <https://github.com/supabase-community/supabase-mcp> |
| Cloudflare MCP | Pages-Status, KV, Worker-Logs | <https://developers.cloudflare.com/agents/model-context-protocol/> |
| GitHub CLI (`gh`) | PRs, Issues, Releases | `brew install gh && gh auth login` |
| Stripe MCP (sobald Live) | Customer/Subscription-Inspektion | <https://stripe.com/docs/mcp> |

### 7.2 Custom Skills (im neuen Repo unter `.claude/skills/`)

| Skill | Trigger | Output |
|---|---|---|
| `kunde-debug <subdomain>` | täglich | Sammelt Order-Row, error_logs, activity_log, render-Status, missing fields |
| `section-toggle <name>` | bei neuer Section | Pflegt alle ~6 Stellen atomar (Schema, API, UI-Toggle, Tests, Doku) |
| `commit-helper` | vor Commit | Diff zeigen, richtige Files staging, Message generieren |
| `support-reply <subdomain>` | bei Support-Mail | Antwort-Entwurf aus Order-Daten + Logs |

### 7.2a Externe Design-/UI-Tools

| Tool | Zweck | Setup |
|---|---|---|
| `21st.dev Magic` | Animierte UI-Komponenten generieren (Hover-States, Page-Transitions, Mikro-Interaktionen) | <https://21st.dev> |
| `ui-ux-pro-max` Skill | Design-Intelligence (Styles, Farben, Fonts, UX-Guidelines) — siehe Memory `feedback_design_skills.md` | bereits installiert |
| `anthropic-web-frontend-design` Skill | Premium-Frontend-Code generieren (kein generisches AI-Aussehen) | bereits installiert |

### 7.3 Custom Subagents (im neuen Repo unter `.claude/agents/`)

| Subagent | Trigger | Was er prüft |
|---|---|---|
| `compliance-reviewer` | bei Code-Änderungen die Compliance-Bereiche betreffen | gegen `docs/LIVE-COMPLIANCE.md` |
| `siteready-reviewer` | vor jedem Commit | serve-time vs. baked, RLS-Lücken, Umlaute, hartcodierte Hex-Farben statt Tokens |
| `quality-watchdog` | nach jeder Test-Generierung | kaputte Links, leere Sections, Kontrast-Probleme, fehlende Pflicht-Section |
| `branchen-recherche` | bei neuer reglementierter Branche | Pflichtfeld-Eintrag mit Quellenangabe |

### 7.4 CLAUDE.md im neuen Repo

Erweitert gegenüber Prototyp um:

- Compliance-Pflicht (Trigger-basiert: `docs/LIVE-COMPLIANCE.md` lesen vor DSGVO-relevanten Code-Änderungen)
- TypeScript strict
- shadcn/ui bevorzugen statt Custom-Components
- Drizzle für DB-Zugriffe (kein curl mehr)
- Zod für API-Schemas
- Verweise auf alle Repo-Dokus

---

## 8. Bau-Phasen

### Phase -1 — Strategie + Block A Design-Vision (~2 Wochen, im Prototyp-Repo)

- Pre-Setup-Aktionen aus Abschnitt 2 anstoßen (Versicherung, Stripe, Marken-Recherche, Buchhaltung) — Lead-Time läuft im Hintergrund
- Strategie-Entscheidungen schärfen (18 offene Fragen `docs/LIVE-COMPLIANCE.md` § 1, Pricing-USt, Repo-Name, Promo-Code-Anzahl)
- `docs/DESIGN-VISION.md` Block A vollständig: Visuelle Benchmarks + Kompetitive Tiefen-Analyse + AI-Differentiator-Story

### Phase 0 — Live-Repo + Stack-Setup (~1 Woche, **Woche 3**)

- Neues Repo `instantpage` anlegen + Initial-Stack (Next.js 15 + TS + Tailwind + shadcn + Drizzle + Zod)
- CI/CD + Lighthouse-CI + Wrangler.toml + Staging-Environment
- Doku aus Prototyp-Repo komplett kopieren + alle `siteready.at` → `instantpage.at`
- Memory-System neu aufsetzen unter `~/.claude/projects/<neuer-pfad>/memory/` (Memory-Übernahme nach § 6)
- MCP + Skills + Subagents (siehe Abschnitt 7)
- **Ab jetzt:** Prototyp-Repo = Wartungs-Modus, gesamter Live-Bau drüben

### Phase 0.5 — Block B-D Design-Vision (~9 Wochen, **Woche 4-12, im Live-Repo**)

- Block B: Plattform-Design-System + Marketing-Konzept + Portal-Sprache + Fragebogen-Magic-Moments
- Block C: 4 Theme-Tokens + 25 Section-Specs + 22 Recipe-Mockups + Mikro-Interaktionen + Asset-Strategie
- Block D: Quality-Standards messbar + Code-/Test-Standards
- Mockups + Theme-Tokens entstehen direkt im Ziel-Repo (kein Umzug nötig)

### Phase 1 — Section-Library + Themes (~6 Wochen)

Aus `docs/RECIPE-SYSTEM.md`:
- 4 Themes mit allen CSS-Tokens (Fonts, Farben, Spacing, Borders, Animations)
- 25 Section-Bausteine (Hero-Varianten, Leistungen-Varianten, etc.) als Tailwind+shadcn-Components
- Branchen-Funktionen-Forms (Reservierung, Termin, Buchung, Standard-Kontakt)
- Universal-Highlight-Block für Edge-Case-Inhalte

### Phase 2 — Recipes + Auto-Engine + Fragebogen (~6 Wochen)

- 24 Recipe-Configs (welches Theme, welche Sections, welche Funktionen)
- Berufsgruppen → Look-Mapping
- Auto-Engine (Hero-Variante, Layout-Density, Section-Visibility, Logo-Farb-Extraktion, Anrede-Detection)
- Fragebogen-Refactor (12 Berufsgruppen-Karten + 1–4 Look-Karten + Berufsbezeichnung-Pflicht)
- Portal-Erweiterung (Design-Tab mit Look-Wechsel, Akzentfarbe, Anrede + Live-Preview)

### Phase 3 — Compliance + Operations (~3 Wochen)

- AGB / AVV / Datenschutz / Impressum aus `docs/LIVE-COMPLIANCE.md` finalisieren + im Footer einbinden
- Branchen-Pflichtfeld-Matrix in `legal.ts` einbauen
- Defensive KI-Prompts für reglementierte Berufe
- Termin-Anfrage-Variante ohne Anliegen-Feld
- AI-Act Footer-Hinweis auf Kunden-Websites
- UX-Schutzmechanismen (Pflicht-Checkboxen)
- Notice-and-Takedown-Setup (abuse@instantpage.at)
- Datenpannen-Plan
- TOMs-Dokumentation
- Trial-Cleanup + Cancellation-Cleanup-Crons aktivieren
- Mailing-Pipeline (Welcome, Trial, Cancel, Payment-Failed)
- PostHog + Sentry einbinden
- Cookie-Banner (nur Plattform, nicht Kundenseiten)

### Phase 4 — Beta-Migration + Launch (~1 Woche)

- Versicherung abschließen + Voraussetzungen erfüllen
- Stripe Live-Verifikation abschließen (Lead-Time aus Phase 0 berücksichtigen)
- Beta-Tester informieren + Promo-Codes versenden
- Beta-Daten in alter DB löschen
- Beta-Domain `sitereadyprototype.pages.dev` abschalten
- DNS instantpage.at finalisieren
- Markenanmeldung (sofern frei)
- Soft-Launch mit ersten 5–10 Kunden
- Public Launch

### Phase 5 — Stabilisierung (~erste 3 Monate)

- Self-Check vierteljährlich (siehe `docs/LIVE-COMPLIANCE.md` § 19)
- AI Act Stichtag 2.8.2026 vorbereiten
- Monitoring der Anwalt-Trigger-Schwellen
- Prompt-Versioning self-built
- Lifecycle-Workflows (Trigger.dev oder Inngest)
- Logs-Aggregation (Better Stack / Axiom)

**Total Phase -1 bis 4 — zwei Modi je nach Async-Aggressivität:**

| Modus | Wall-Clock | Annahme |
|---|---|---|
| **Aggressiv-Async** | **5-7 Wochen** | Cloud-Sessions konsequent, 4-5 PRs/Tag reviewen, Specs vorher fertig, wenig "ach anders" |
| **Pragmatisch** | **8-12 Wochen** | normales Tempo, Reviews, paar Iterationen, parallel andere Themen |
| **Solo ohne AI-Async** | **~30 Wochen** | klassische Vollzeit-Solo-Rechnung, Referenz |

```
PRAGMATISCH (8-12 Wochen):
Woche 1-2 : Phase -1 (Strategie + Block A Design-Vision) — Prototyp-Repo
Woche 3   : Phase 0  (Live-Repo Setup + Doku-Migration)
Woche 3-5 : Phase 0.5 (Block B-D Design-Vision) — Live-Repo
Woche 5-7 : Phase 1  (Section-Library + 4 Themes) — async-heavy
Woche 7-9 : Phase 2  (24 Recipes + Auto-Engine + Fragebogen + Portal)
Woche 9-10: Phase 3  (Compliance + Operations)
Woche 10  : Phase 4  (Cutover + Soft-Launch)
ab Woche 11: Phase 5 (Stabilisierung 3 Monate)
```

**Externe Lead-Times bleiben unabhängig vom Bau-Tempo:**
Stripe-Verifikation 1-2W, Versicherung 1-2W, DPA-Verträge 1W. Phase -1 anstoßen!

---

## 8.5. Bau-Workflow + Block-Aufteilung

### Async-Pattern

```
Doku/Specs (User + Claude Code lokal)
    ↓
"Bau Task X nach Spec Y, oeffne PR" — Auftrag an:
    ↓
┌────────────────────────────────────────────────┐
│ Cloud-Sessions   │ GitHub Actions  │ Lokal     │
│ claude.ai/code   │ scheduled jobs  │ tagsueber │
│ (ad-hoc Tasks)   │ (Routine)       │ (Review)  │
└────────────────────────────────────────────────┘
    ↓
PR landet → User reviewt → mergt oder gibt Feedback
    ↓
CI/CD deployt nach Staging → User testet → Production
```

### Welcher Workflow für was

| Aufgaben-Typ | Wo | Beispiel |
|---|---|---|
| Doku/Specs schärfen | lokal Claude Code | DESIGN-VISION-Blöcke iterieren |
| Recipe-Mockup nach Spec bauen | Cloud-Session async | "bau mockup-recipe-handwerk-bau.html nach Token-Set X" |
| Section-Component + Storybook + Tests | Cloud-Session async | "neue HeroFullbleed-Section + Stories + Visual-Snapshot" |
| Routine-Tasks | GitHub Actions scheduled | nightly Lighthouse-Check, Build-Health |
| Architektur-Entscheidungen | lokal (User im Loop) | "wie strukturieren wir die Auto-Engine?" |
| PR-Review | lokal (User als Reviewer) | morgens 3-5 PRs durchgehen |
| Compliance-Texte schreiben | lokal (rechtssensibel) | AGB-Klauseln formulieren |

### Block-Granularität

**Faustregel pro Block:** 2-8h Mensch-Äquivalent, ein PR mit ~200-800 Zeilen Diff.

- **Zu groß** ("ganze Section-Library"): Cloud-Session läuft sich tot, PR wird unreviewbar, kein Async-Vorteil
- **Zu klein** ("ein Button"): Overhead pro PR > Bau-Aufwand
- **Sweet Spot:** 1 Komponente mit Tests + Stories = 1 Block · 1 Recipe-Mockup = 1 Block · 1 API-Route mit Schema + Tests = 1 Block

### Block-Anzahl pro Phase

| Phase | Blöcke | Was zählt als 1 Block |
|---|---|---|
| **Phase 0** Setup | **~10** | Repo-Init, Drizzle, CI/CD, Wrangler, Auth-Pattern, Doku-Migration, Memory-Setup, CLAUDE.md, Smoke-Tests |
| **Phase 1** Section-Library + Themes | **~50-80** | 4 Theme-Token-Sets + 25 Sections × ~2 Varianten als Component+Story+Test + 5 Branchen-Forms + Universal-Highlight + Layout + Storybook |
| **Phase 2** Recipes + Engine + Fragebogen + Portal | **~40-60** | 24 Recipe-Configs als 8-12 Bündel + Auto-Engine-Module + Fragebogen-Refactor + Portal-Erweiterung + Generation-API |
| **Phase 3** Compliance + Ops | **~15-25** | Impressum-Generator + Branchen-Pflichtfeld-Matrix + Mailing-Templates + Sentry+PostHog + Crons + Cookie-Banner + AI-Act + Notice-Takedown |
| **Phase 4** Cutover | **~5-10** | DNS, Beta-Mail, Soft-Launch-Setup, Production-Smoke-Tests |
| **Total** | **~120-180 Blöcke** | über 5-12 Wochen Bau |

### Was das praktisch heißt

| Bauzeit | PRs/Woche | PRs/Tag (5 Tage) |
|---|---|---|
| 5-6 Wochen aggressiv | ~25-30 | **~5-6/Tag** |
| 8 Wochen pragmatisch | ~18 | **~3-4/Tag** |
| 10-12 Wochen entspannt | ~12-15 | **~3/Tag** |

**Engpass = User-Review-Kapazität, nicht Bau.** 3-5 PRs/Tag reviewen heißt:
- 10-20 Min pro PR durchschauen
- Manchmal Feedback geben → Re-Bau in nächster Cloud-Session
- 1-2h Reviews/Tag, plus 1-2h Architektur-Entscheidungen + neue Specs schreiben

→ **Effektiv 2-4h tägliche Bau-Beteiligung** statt 8h Coden.

### Parallelisierung

- **Phase 1 ist Goldgrube** — 25 Sections können fast komplett parallel gebaut werden, Storybook isoliert sie
- **Phase 2 hat Reihenfolge** — Auto-Engine braucht Section-Library, Recipes brauchen Auto-Engine, Portal braucht Recipes
- **Phase 3 läuft parallel zu Phase 2 Ende** — Compliance-Texte schreiben während Code-Bau weiter läuft

### Was vor Bau-Start unbedingt fertig sein muss

Sonst geht's NICHT so schnell — endloses "ach anders" verbrennt jeden Async-Vorteil:

- **Theme-Tokens** (Hex/Spacing/Easing) fertig — sonst bei jeder Section Re-Iteration
- **25 Section-Specs** als ~1-Pager fertig — sonst muss Claude raten
- **22 Recipe-Mockups** fertig — Component-Bauer schaut auf Mockup als Referenz
- **DB-Schema** in Drizzle-Migration fertig — kein Refactor mitten im Bau
- **AGB/AVV-Texte** fertig (Phase -1) — keine Wartezeit in Phase 3
- **Pricing/Trial/Cancellation** final entschieden — sonst Stripe-Integration zweimal
- **Acceptance-Criteria pro Block** in Spec-Schnipsel formulieren ("Definition of Done")

→ Das ist Phase -1 + 0.5 Design-Vision. Deshalb sind sie so wichtig — sie ermöglichen erst den Aggressiv-Async-Modus.

### Spec-Format pro Block

Pro Task ein kleines Markdown-Schnipsel das als Prompt für die Cloud-Session dient:

```markdown
## Task: <Was bauen>

### Acceptance Criteria
- [ ] Konkrete Anforderung 1
- [ ] Konkrete Anforderung 2
- [ ] Tests gruen
- [ ] Storybook-Story (falls Component)
- [ ] Lighthouse-Score > X (falls Page)

### Context
- Spec-Datei: docs/_design/sections/<name>.md
- Theme-Tokens: docs/_design/themes.md
- Verwandte Components: ...

### Output
- Branch: feature/<name>
- PR mit Beschreibung was gebaut wurde
```

Wird als Kurz-Briefing an Cloud-Session geschickt, Output kommt als PR.

---

## 9. Erfolgs-Kriterien pro Phase

### Phase 0
- Repo lebt, CI grün, Staging-Deploy funktioniert
- Pre-Setup-Aktionen alle in Bewegung (nicht alle abgeschlossen)

### Phase 1
- Section-Library mit allen 25 Bausteinen in Storybook visuell verifiziert
- Pro Theme alle Sections gerendert (4 Themes × 25 Sections = 100 Variationen)
- Lighthouse pro Section ≥ 90 Performance, ≥ 90 A11y

### Phase 2
- Alle 24 Recipes generieren funktionierende Demo-Sites
- Auto-Engine-Tests grün (Hero-Variante, Layout-Density, Section-Visibility)
- Fragebogen E2E-Test (Berufsgruppe → Look → Berufsbezeichnung → fertige Site) < 5 Min

### Phase 3
- Alle Compliance-Texte live im Footer
- Pflichtfeld-Matrix für ~35 reglementierte Branchen
- Mailing-Pipeline E2E-Test (Welcome → Trial-Ende → Cancel)
- Cron-Tests grün (stuck-pending, trial-cleanup)

### Phase 4
- Soft-Launch-Kunden zahlen erfolgreich via Stripe Live
- Erste Bewertung / Feedback-Loop läuft
- Versicherung aktiv, Stripe-Verifikation durch
- Beta-Cleanup dokumentiert abgeschlossen

### Phase 5
- 30+ aktive Kunden ohne kritische Bugs
- Erste Self-Check-Runde durchlaufen
- AI Act Stichtag 2.8.2026 ohne Hektik erreicht

---

## 10. Beta → Live Cutover

Konkrete Schritte am Cutover-Tag (Memory `project_production_refactor.md`):

1. **T-7 Tage:** Beta-Tester-Mail "Ab dem TT.MM.YYYY läuft instantpage.at — Promo-Code für X kostenlose Monate beigefügt. Beta-Domain wird abgedreht."
2. **T-1 Tag:** Final Soft-Launch-Test mit eigenem Test-Account auf Live-Domain
3. **T-0 (Cutover):**
   - DNS-Switch instantpage.at auf Live
   - Beta-Domain `sitereadyprototype.pages.dev` zeigt Migrations-Hinweis-Seite (410 Gone + "Wir sind umgezogen — instantpage.at")
   - DELETE alle Beta-Daten in alter Supabase-Instanz (oder ganzes Projekt löschen)
   - Beta-Stripe-Test-Mode kann eingestellt werden (keine Test-Subscriptions mehr)
4. **T+1:** Monitoring intensiv (Sentry, Health-Check, Cron-Logs)
5. **T+7:** Erste Lessons Learned + Backlog-Review

---

## 11. Was wir wissen müssen bevor wir starten

### Strategische Entscheidungen offen

→ siehe `docs/LIVE-COMPLIANCE.md` § 1 für die 18 offenen Strategie-Fragen.

Plus speziell für Migration:

| Frage | Entscheidung |
|---|---|
| Neuer Repo-Name | **`instantpage`** |
| Neue Supabase-Instanz oder gleiche mit neuem Schema? | **Neue Instanz** für sauberen Schnitt |
| Neuer Stripe-Account oder Test-Mode in Live umschalten? | **Neuer Account** für saubere Buchhaltung + Trennung von Test-Subscriptions |
| Anthropic API-Key übernehmen oder neu? | **Übernehmen** |
| Cloudflare-Account übernehmen? | **Ja**, neues Pages-Projekt im selben Account |
| Wann genau Cutover-Tag? | `[OFFEN]` abhängig von Phase 4 Fortschritt |
| Promo-Code für Beta-Tester: wie viele Monate kostenlos? | **Inhaber regelt persönlich** mit Beta-Testern (Freunde/Kollegen) — kein systematisches Promo-Code-System nötig |

### Stammdaten offen

→ siehe `docs/LIVE-COMPLIANCE.md` § 2.

### Technische Voraussetzungen offen

| Voraussetzung | Status |
|---|---|
| Node-Version (Next.js 15 braucht Node ≥ 18.18) | prüfen |
| Cloudflare-Account-Limits (Pages-Projekte, Custom Hostnames) | prüfen |
| Supabase-Plan (Pro nötig für Production) | `[OFFEN]` aktuell vermutlich Free |
| GitHub Actions Minutes-Limit | prüfen |
| Stripe Activation-Status | `[OFFEN]` |

---

## Verbindung zu anderen Dokumenten

- `docs/README.md` — Doku-Index
- `docs/LIVE-COMPLIANCE.md` — Recht / Compliance
- `docs/RECIPE-SYSTEM.md` — Kundenseiten-Architektur
- `docs/PRODUCT.md` — Produkt-Spec (Skeleton, wird befüllt)
- `docs/ARCHITECTURE.md` — Tech-Stack-Doku (Skeleton, wird befüllt)
- `docs/OPERATIONS.md` — Runbook + Email-Templates (Skeleton)
- `docs/BRAND.md` — Voice/Tone + Logo (Skeleton)
- `docs/_archive/PROJECT-STAND-MAERZ-2026.md` — Snapshot historischer Stand

## Verbindung zu Memory

- `project_production_refactor.md` — Großteil ist jetzt hier oder in `docs/ARCHITECTURE.md`
- `project_recipe_system_v1.md` — Quelle für `docs/RECIPE-SYSTEM.md`
- `project_kundenseiten_roadmap_2026-04-17.md` — Kundenseiten-Qualitäts-Items für Phase 1–3
- `project_live_compliance.md` — Pointer auf `docs/LIVE-COMPLIANCE.md`

---

*Living Document. Pflegen bis Cutover-Tag, danach archivieren in `docs/_archive/MIGRATION-PLAN.md`.*
