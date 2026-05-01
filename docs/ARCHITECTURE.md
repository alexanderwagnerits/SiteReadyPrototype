# Architektur — instantpage.at

> **Skeleton.** Wird befüllt aus `_archive/PROJECT-STAND-MAERZ-2026.md` + Memory `project_production_refactor.md` während Live-Bau.

**Stand:** 2026-05-01 (Skeleton)

---

## Status

`[SKELETON]` — Inhaltsverzeichnis steht. Wird in Phase 0 des Live-Bau befüllt mit aktuellem Stack und Setup.

---

## Inhalt (geplant)

1. Tech-Stack (Live-Produkt)
2. System-Architektur (Diagramm + Datenfluss)
3. Subprozessoren-Übersicht
4. Datenbank (Schema, RLS, Migrations)
5. Repo-Struktur + Routing + API-Endpoints + Conventions
6. Auth-Flow (Supabase + JWT)
7. Deployment-Pipeline (CI/CD, Wrangler, Staging)
8. Monitoring + Logging
9. Backup + Recovery
10. Security-Hardening

---

## 1. Tech-Stack (Live-Produkt)

`[OFFEN]` — final entschieden in Memory `project_production_refactor.md` "Code-Basis-Modernisierung":

| Layer | Technologie |
|---|---|
| Sprache | TypeScript strict |
| Framework | Next.js 15 (App Router) |
| Hosting | Cloudflare Pages via OpenNext.js |
| Datenbank | Supabase EU (Frankfurt), Pro-Plan |
| ORM | Drizzle |
| Validierung | Zod (Forms + API + DB) |
| UI | shadcn/ui + Tailwind CSS |
| Forms | React Hook Form + Zod-Resolver |
| Server-State | TanStack Query |
| Auth | Supabase Auth |
| Zahlung | Stripe (Live-Mode) + Customer Portal |
| KI | Anthropic Claude Sonnet 4.6 + Prompt Caching |
| Mailing | Resend / Postmark / Brevo (`[OFFEN]`) |
| Analytics | PostHog Cloud EU + Cloudflare Web Analytics (Kundenseiten) |
| Error-Monitoring | Sentry |
| Testing | Vitest (Unit) + Playwright (E2E) + Lighthouse-CI |

## 2. System-Architektur

`[OFFEN]` — Diagramm + Datenfluss zu erstellen.

Vorabskizze:

```
Browser (Kunde)
  ↓
Cloudflare Pages (Frontend Next.js)
  ↓
Cloudflare Functions (API Routes)
  ↓
Supabase (DB + Auth + Storage)
  ↔ Stripe (Zahlung)
  ↔ Anthropic (KI-Generierung)
  ↔ Resend (Mailing)
  ↔ Cloudflare R2 (Backups)
```

## 3. Subprozessoren-Übersicht

→ siehe `LIVE-COMPLIANCE.md` § 4 Subprozessoren.

## 4. Datenbank

`[OFFEN]` — vollständiges Schema im Live-Bau dokumentieren:

- `orders` (Kunden-Orders)
- `docs` (interne Doku — wird im Live-Bau abgeschafft, da ins Repo gewandert)
- `support_requests`
- `activity_log` + `error_logs`
- `order_snapshots` (geplant für Live, Memory `project_production_refactor.md`)
- weitere Tabellen aus Migrations (`migrations/`)

RLS-Policies für alle Tabellen aktiv (Memory `project_supabase_rls.md`). Im Live-Bau via Drizzle-Migrations versioniert.

## 5. Repo-Struktur (Live-Repo `instantpage`)

> Living-Spec — wird vor Phase 0 final fixiert. Bekannte offene Punkte als `[OFFEN]` markiert.

### 5.1 Verzeichnis-Tree

```
instantpage/
├── src/
│   ├── middleware.ts                 # Wildcard-Subdomain-Routing (siehe 5.2)
│   │
│   ├── app/                          # Next.js 15 App Router
│   │   ├── (marketing)/              # instantpage.at + www.instantpage.at
│   │   │   ├── page.tsx              # Landing
│   │   │   ├── pricing/page.tsx
│   │   │   ├── vergleich/page.tsx    # vs. Webflow/Wix (siehe production_refactor)
│   │   │   ├── changelog/page.tsx
│   │   │   ├── hilfe/page.tsx        # Knowledge-Base
│   │   │   └── layout.tsx
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   ├── reset/page.tsx
│   │   │   └── layout.tsx
│   │   ├── (portal)/                 # Self-Service-Portal
│   │   │   ├── portal/page.tsx
│   │   │   ├── portal/inhalte/       # Content-Tabs (Sections-Toggles, Texte)
│   │   │   ├── portal/design/        # Look-Wechsel, Akzentfarbe, Anrede
│   │   │   ├── portal/medien/        # Logo, Hero, Galerie
│   │   │   ├── portal/seo/
│   │   │   ├── portal/domain/        # Custom-Domain-Setup (Pro)
│   │   │   ├── portal/rechnungen/
│   │   │   ├── portal/konto/
│   │   │   ├── portal/support/
│   │   │   └── layout.tsx
│   │   ├── start/                    # Fragebogen
│   │   │   ├── page.tsx
│   │   │   └── layout.tsx
│   │   ├── bestellung/page.tsx
│   │   ├── admin/                    # Admin-Dashboard
│   │   │   ├── page.tsx
│   │   │   ├── sites/
│   │   │   ├── support/
│   │   │   ├── finanzen/
│   │   │   └── system/
│   │   ├── sites/[subdomain]/        # INTERN — Wildcard-Rewrite-Target (siehe 5.2)
│   │   │   ├── page.tsx              # Kunden-Website Recipe-Render
│   │   │   ├── impressum/page.tsx
│   │   │   ├── datenschutz/page.tsx
│   │   │   ├── sitemap.xml/route.ts
│   │   │   ├── robots.txt/route.ts
│   │   │   ├── llms.txt/route.ts
│   │   │   └── layout.tsx            # ohne Plattform-Header
│   │   ├── api/                      # Route Handlers (siehe 5.3)
│   │   └── layout.tsx                # Root
│   │
│   ├── components/                   # UI nur (kein State, keine Pure-Logic)
│   │   ├── ui/                       # shadcn/ui primitives
│   │   ├── platform/                 # Plattform-eigene UI
│   │   │   ├── PortalCard.tsx
│   │   │   ├── AdminTable.tsx
│   │   │   ├── BetaFeedbackModal.tsx
│   │   │   └── …
│   │   ├── marketing/                # Landing-Bausteine
│   │   ├── fragebogen/               # Fragebogen-Schritte als Components
│   │   ├── sections/                 # Section-Library Kunden-Websites (~25)
│   │   │   ├── hero/
│   │   │   ├── leistungen/
│   │   │   ├── ueber-uns/
│   │   │   ├── galerie/
│   │   │   ├── bewertungen/
│   │   │   ├── team/
│   │   │   ├── kontakt/
│   │   │   ├── faq/
│   │   │   ├── branchen-funktionen/  # Reservierung, Termin, Buchung, Notdienst, Standard-Kontakt
│   │   │   └── universal-highlight/
│   │   └── theme-provider.tsx
│   │
│   ├── recipes/                      # 24 Recipe-Configs (Section-Komposition + Theme + Funktionen)
│   │   ├── handwerk-werkstatt.ts
│   │   ├── handwerk-bau.ts
│   │   ├── …
│   │   └── index.ts                  # Recipe-Registry + Lookup
│   │
│   ├── themes/                       # 4 Theme-Token-Sets als TS
│   │   ├── klassisch.ts
│   │   ├── modern.ts
│   │   ├── editorial.ts
│   │   ├── handwerklich.ts
│   │   └── tokens.css                # CSS-Variables generiert aus TS-Tokens
│   │
│   ├── lib/                          # Pure Logic — testbar ohne React
│   │   ├── generate/                 # Anthropic-Calls + Prompts + Quality-Check
│   │   │   ├── prompt.ts
│   │   │   ├── client.ts
│   │   │   ├── quality-check.ts
│   │   │   └── cache.ts              # Prompt-Caching-Helper
│   │   ├── auto-engine/              # Auto-Decisions (RECIPE-SYSTEM § Auto-Engine)
│   │   │   ├── hero-variant.ts       # aus Foto-Verfügbarkeit
│   │   │   ├── layout-density.ts
│   │   │   ├── section-visibility.ts
│   │   │   ├── logo-color.ts         # Akzentfarbe aus Logo extrahieren
│   │   │   ├── anrede-detection.ts   # Import-Text → Sie/Du
│   │   │   └── bezeichnung-match.ts  # → BRANCHEN-Lookup
│   │   ├── branchen.ts               # ~160 Branchen + Lookups
│   │   ├── berufsgruppen.ts          # 12 Berufsgruppen + Look-Mapping
│   │   ├── legal/                    # Impressum-Generator + Pflichtfeld-Matrix
│   │   │   ├── impressum.ts
│   │   │   ├── datenschutz.ts
│   │   │   ├── pflichtfelder.ts      # BRANCHE_PFLICHT (LIVE-COMPLIANCE § 9)
│   │   │   └── reglementiert.ts      # reglementierte Berufe Sonderbehandlung
│   │   ├── import/                   # Firecrawl + Jina-Fallback + Claude-Extraktion
│   │   ├── stripe/                   # Stripe-Client + Webhook-Handler + Plan-Mapping
│   │   ├── mailing/                  # `[OFFEN]` Provider Resend/Postmark/Brevo
│   │   │   ├── client.ts
│   │   │   └── templates/            # 9 Lifecycle-Templates (OPERATIONS § 2)
│   │   ├── images/                   # `[OFFEN]` Cloudflare Images vs Supabase Storage
│   │   ├── analytics/                # PostHog + Cloudflare Web Analytics
│   │   ├── seo/                      # Schema.org, Meta-Tags, llms.txt, Sitemap
│   │   └── utils/                    # esc(), slugify(), …
│   │
│   ├── db/                           # Drizzle ORM
│   │   ├── schema.ts                 # Komplettes Schema (orders, users, activity_log, …)
│   │   ├── client.ts                 # Drizzle-Instance
│   │   └── queries/                  # wiederverwendbare Queries
│   │
│   ├── auth/                         # Supabase Auth Helpers
│   │   ├── server.ts                 # Server-Client (cookies)
│   │   ├── client.ts                 # Browser-Client
│   │   └── middleware.ts             # Session-Refresh — gemerged mit src/middleware.ts (siehe 5.2)
│   │
│   ├── schemas/                      # Zod Schemas (geteilt Form ↔ API ↔ DB)
│   │   ├── order.ts
│   │   ├── import.ts
│   │   ├── impressum.ts
│   │   └── …
│   │
│   ├── hooks/                        # React Hooks
│   │   ├── useOrder.ts
│   │   ├── useLivePreview.ts
│   │   ├── useSubdomain.ts
│   │   └── …
│   │
│   └── config/                       # Env-Validation (Zod), Konstanten
│       ├── env.ts                    # validierte Env-Vars
│       ├── reserved-subdomains.ts    # www, admin, api, portal, … blocken
│       └── constants.ts
│
├── docs/                             # 1:1 aus Prototyp übernommen + siteready→instantpage
│   ├── README.md
│   ├── BUILD-LOG.md                  # MIGRATION-PLAN.md umbenannt
│   ├── ARCHITECTURE.md
│   ├── PRODUCT.md
│   ├── BRAND.md
│   ├── OPERATIONS.md
│   ├── LIVE-COMPLIANCE.md
│   ├── RECIPE-SYSTEM.md
│   ├── DESIGN-VISION.md
│   ├── _design/                      # Design-Vision-Output
│   │   ├── design-system.md
│   │   ├── themes.md
│   │   ├── benchmarks-plattform.md
│   │   ├── benchmarks-recipes.md
│   │   ├── competitive-analysis.md
│   │   ├── quality-standards.md
│   │   ├── sections/                 # Spec pro Section-Baustein
│   │   └── recipes/                  # Spec pro Recipe
│   └── _archive/
│
├── tests/
│   ├── e2e/                          # Playwright
│   │   ├── fragebogen.spec.ts
│   │   ├── portal.spec.ts
│   │   └── kundenseite.spec.ts
│   ├── unit/                         # Vitest (kann auch direkt neben Sources liegen — `[OFFEN]` Convention)
│   └── fixtures/
│
├── .storybook/                       # Storybook für Section-Library
│   ├── main.ts
│   └── preview.ts
│
├── supabase/
│   └── migrations/                   # Drizzle-generierte Migrations versioniert
│
├── .github/workflows/
│   ├── ci.yml                        # Lint + Type + Vitest + Playwright
│   ├── deploy-staging.yml
│   ├── lighthouse.yml                # Lighthouse-CI als Hard-Gate (A11y < 90 blockt)
│   └── nightly.yml                   # scheduled jobs (Block-Workflow § 8.5 MIGRATION-PLAN)
│
├── public/                           # Statische Assets
│   ├── logo.svg
│   ├── icons/
│   ├── og-default.png
│   └── mockups/                      # 24 Recipe-Mockups (Phase 0.5 Output)
│
├── scripts/                          # DB-Seed, Backups, Migration-Helper
│
├── CLAUDE.md                         # Projekt-Anweisungen (erweitert vs. Prototyp)
├── wrangler.toml                     # Cloudflare Pages + Bindings + Cron-Triggers
├── drizzle.config.ts
├── next.config.ts
├── tailwind.config.ts
├── components.json                   # shadcn/ui Registry-Config
├── tsconfig.json
├── vitest.config.ts
├── playwright.config.ts
├── package.json
└── .env.example
```

### 5.2 Routing — Wildcard-Subdomains via Middleware

**Live-Setup:** Kunden-Websites laufen auf `<subdomain>.instantpage.at` (Wildcard) + Custom Domains für Pro-Plan (`www.firma.at` via Cloudflare for SaaS).

**Implementation Next.js 15:** kein File-System-Routing — sondern Middleware-Rewrite.

```
Request: mueller.instantpage.at/
  → middleware liest host: "mueller.instantpage.at"
  → extrahiert subdomain: "mueller"
  → rewrite intern zu: /sites/mueller
  → app/sites/[subdomain]/page.tsx rendert mit subdomain="mueller"

Request: www.firma.at/  (Pro Custom Domain)
  → middleware checkt host gegen DB-Lookup (Custom Hostnames)
  → findet order.subdomain = "mueller"
  → rewrite intern zu: /sites/mueller

Request: instantpage.at/start
  → middleware: keine Subdomain → durchlassen → app/start/page.tsx

Request: admin.instantpage.at/
  → middleware: "admin" ist in reserved-subdomains.ts → 404 oder Redirect
```

**Reservierte Subdomains** (in `src/config/reserved-subdomains.ts`): `www`, `admin`, `api`, `portal`, `start`, `login`, `app`, `mail`, `support`, `help`, `staging`, `dev`, `test`, `bestellung`. Beim Order-Anlegen blocken.

**DNS:** Wildcard `*.instantpage.at` als CNAME auf Cloudflare Pages — Cloudflare Universal SSL deckt Wildcard automatisch ab. Setup in Phase 0.

**Lokale Entwicklung:** Chrome unterstützt `<sub>.localhost:3000` out-of-the-box — keine `/etc/hosts`-Manipulation nötig.

### 5.3 API-Endpoints

```
src/app/api/
├── import/route.ts                   (= functions/api/import-website.js)
├── generate/route.ts                 (= functions/api/generate-website.js)
├── start-build/route.ts              (= functions/api/start-build.js)
├── stripe-webhook/route.ts           (= functions/api/stripe-webhook.js)
├── billing-portal/route.ts           (= functions/api/billing-portal.js)
├── checkout/route.ts                 (= functions/api/create-checkout.js)
├── invoices/route.ts                 (= functions/api/get-invoices.js)
├── admin/
│   ├── data/route.ts
│   ├── update/route.ts
│   ├── delete/route.ts
│   ├── system/route.ts
│   └── log-activity/route.ts
└── cron/
    ├── stuck-pending/route.ts        # `[OFFEN]` siehe production_refactor
    ├── trial-cleanup/route.ts
    └── health-check/route.ts
```

`[OFFEN]` — **Server Actions vs. Route Handlers:** Next.js 15 hat beide. Forms könnten via Server Actions mehr typsicher und ohne `route.ts`-Boilerplate gehen. Entscheidung: Default Route Handlers (für externe Calls + Webhooks), Forms wo möglich Server Actions. Pattern in Phase 0 fixieren.

### 5.4 Component-Organisation

| Bereich | Pattern |
|---|---|
| `components/ui/` | shadcn-Primitives, ungetestet, eine Datei pro Komponente |
| `components/sections/<name>/` | Pro Section ein Ordner mit Varianten (`HeroTextLed.tsx`, `HeroPhotoLed.tsx`) + `index.ts` für Re-Exports + Storybook-Story (`*.stories.tsx`) |
| `components/platform/` | Eigene Platform-UI (PortalCard, AdminTable) — Storybook-fähig |
| `components/marketing/` | Landing-Bausteine, eher Page-spezifisch |
| `components/fragebogen/` | Fragebogen-Schritte als Components |

`[OFFEN]` — **Atomic-Design vs. Feature-Based:** Empfehlung Feature-Based (sections/themes/marketing/portal) wie hier. Atomic ist für SaaS oft over-engineered.

### 5.5 Konventionen

- **Server-Components default**, `"use client"` nur wo nötig (Forms, Hooks, Live-Preview, Browser-APIs)
- **Pure Logic in `lib/`**, niemals React-Imports — testbar ohne Browser
- **Zod-Schemas in `schemas/`** geteilt zwischen Form (RHF), API-Validation (Route Handler) und DB-Insert (Drizzle)
- **Drizzle-Migrations versioniert** in `supabase/migrations/`, gegen Live-DB nur via Migration-Skript
- **Storybook-Story für jede Section + Platform-Component** — ist Reviewbasis im Async-PR-Workflow
- **Tests:** Vitest neben Source (`<file>.test.ts`) oder zentral in `tests/unit/` — Convention vor Phase 1 wählen `[OFFEN]`

### 5.6 Offene Entscheidungen vor Phase 0

| # | Entscheidung | Optionen | Beeinflusst |
|---|---|---|---|
| 1 | OpenNext.js Cloudflare-Adapter Setup | Pages-Functions vs. Workers vs. OpenNext-Layer | wrangler.toml + Build-Pipeline |
| 2 | Server Actions Default für Forms | Pure Route Handlers / Server Actions / Mix | API-Verzeichnis-Struktur |
| 3 | Mailing-Provider | Resend / Postmark / Brevo | `lib/mailing/` Implementierung |
| 4 | Bildverarbeitung | Cloudflare Images vs. Supabase Storage + Sharp | `lib/images/` |
| 5 | Cron-Mechanismus | Cloudflare Cron Triggers vs. Supabase pg_cron vs. Trigger.dev/Inngest | wrangler.toml + `app/api/cron/` |
| 6 | Vitest-Tests neben Source vs. zentral | `<file>.test.ts` vs. `tests/unit/` | nichts kritisches, aber konsistent halten |
| 7 | shadcn-Registry-Config (components.json) Detail | Default vs. erweitertes Setup mit Theme-Provider | `components/ui/` Setup |
| 8 | DB-Schema Detail | aktuelles `orders` 1:1 vs. mit Recipe-System-Spalten erweitern | `db/schema.ts` |
| 9 | Auth-Cookie-Domain-Scope | Single-Domain vs. Wildcard | Middleware + Auth-Helpers |
| 10 | Storage-Bucket-Struktur | aktuell `customer-assets/{user-id}/...` — bleibt? | Storage-Helpers |

→ Alle 10 vor Phase 0 klären, dann ist die Struktur final.

## 6. Auth-Flow

`[OFFEN]` — Supabase Auth + JWT-Validation. Cookie-Domain-Scope kritisch (siehe `LIVE-COMPLIANCE.md` § 2.3).

## 7. Deployment-Pipeline

`[OFFEN]` — Memory `project_production_refactor.md` "GitHub Actions CI/CD" + "wrangler.toml" + "Staging-Environment":

- `main` → Production Auto-Deploy
- `staging` → Staging Auto-Deploy
- `feature/*` → PR Preview-Deployment
- Lighthouse-CI als Hard-Gate (A11y < 90 blockt)
- Tests + ESLint + TypeScript-Check als Pre-Merge

## 8. Monitoring + Logging

`[OFFEN]` — Sentry (Errors) + PostHog (Funnel + Replay) + Better Stack/Axiom (Logs) + Cloudflare Logs.

## 9. Backup + Recovery

`[OFFEN]` — Memory `project_production_refactor.md` "Backup & Recovery":

- Supabase Pro tägliche Backups (7 Tage)
- pg_dump → Cloudflare R2 (90 Tage Retention)
- Wöchentlich Storage-Sync zu R2
- Restore-Test alle 3 Monate in Staging

## 10. Security-Hardening

`[OFFEN]` — Memory `project_production_refactor.md` "Sicherheits-Hardening":

- URL-Escaping in allen Endpoints
- Auth-Check mit JWT-Validation (alle Endpoints)
- Subdomain-Kollisions-Handling
- Portal-Validation parität zu Fragebogen-Validation
- Cookie-Domain-Scope (siehe `LIVE-COMPLIANCE.md`)
- Rate-Limiting (Cloudflare WAF Rules)
- 2FA-Pflicht für Admin-Accounts (Inhaber + spätere Mitarbeiter — non-negotiable)
- 2FA optional für Kunden-Accounts (Opt-in im Portal). KMU-Akzeptanz für Pflicht-2FA zu niedrig, aber bei sensiblen Branchen (Anwalt, Arzt) prominent empfehlen. Login schickt bei deaktiviertem 2FA periodisch sanften Hinweis.

---

## Verbindung zu anderen Dokumenten

- `MIGRATION-PLAN.md` — Bau-Reihenfolge
- `LIVE-COMPLIANCE.md` — Subprozessoren, TOMs, Sicherheits-Anforderungen
- `RECIPE-SYSTEM.md` — Code-Architektur für Kundenwebsites
- `OPERATIONS.md` — Runbook bei Incidents

## Verbindung zu Memory

- `project_production_refactor.md` — Hauptquelle für alle Architektur-Entscheidungen
- `project_supabase_rls.md` — RLS-Status
