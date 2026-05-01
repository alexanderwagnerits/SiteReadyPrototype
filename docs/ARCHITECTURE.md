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
5. API-Endpoints (Next.js App Router)
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

## 5. API-Endpoints

`[OFFEN]` — nach Migration auf Next.js App Router neu strukturieren:

```
src/app/api/
├── import/route.ts          (= functions/api/import-website.js)
├── generate/route.ts        (= functions/api/generate-website.js)
├── start-build/route.ts     (= functions/api/start-build.js)
├── stripe-webhook/route.ts  (= functions/api/stripe-webhook.js)
├── billing-portal/route.ts  (= functions/api/billing-portal.js)
├── admin/[...]/route.ts
└── cron/[...]/route.ts      (für Scheduled Tasks)
```

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
