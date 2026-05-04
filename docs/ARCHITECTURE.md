# Architektur — instantpage.at

> **Skeleton.** Wird befüllt aus `_archive/PROJECT-STAND-MAERZ-2026.md` + Memory `project_production_refactor.md` während Live-Bau.

**Stand:** 2026-05-04 (Skeleton)

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

| Layer | Technologie | Notiz |
|---|---|---|
| Sprache | TypeScript strict | |
| Framework | Next.js 15 (App Router) | |
| Hosting | Cloudflare Pages via OpenNext.js | OpenNext-Adapter Standard 2026 |
| Datenbank | Supabase EU (Frankfurt), Pro-Plan | neue Instanz für Live (separater Schnitt zu Prototyp) |
| ORM | Drizzle | |
| Validierung | Zod (Forms + API + DB) | |
| UI | shadcn/ui + Tailwind CSS | |
| Forms | Server Actions (intern) + React Hook Form + Zod | externe Calls/Webhooks/Cron via Route Handlers |
| Server-State | TanStack Query | |
| Auth | Supabase Auth | |
| Zahlung | Stripe (Live-Mode, neuer Account) + Customer Portal | Test-Mode Prototyp bleibt getrennt |
| KI | Anthropic Claude Sonnet 4.6 + Prompt Caching | Anthropic-Key aus Prototyp übernommen |
| **Transaktionale Mails** | Resend (Default — Status `[OFFEN]`) | siehe § 1.1 Mail-Welten-Trennung; Status: `LIVE-COMPLIANCE.md` § 1 #13 |
| **Bildverarbeitung** | **Cloudflare Images** ($5/Mon Basis + Usage) | Auto-Resize, WebP/AVIF, CDN-Delivery |
| **Lifecycle-Workflows** | **Trigger.dev oder Inngest** (gleich von Anfang) | Mail-Drip, Dunning, Long-Running Jobs |
| **Routine-Crons** | Cloudflare Cron Triggers (in wrangler.toml) | trial-cleanup, stuck-pending, health-monitor |
| Analytics | PostHog Cloud EU + Cloudflare Web Analytics (Kundenseiten) | Provider `[OFFEN]` — `LIVE-COMPLIANCE.md` § 1 #15 |
| Error-Monitoring | Sentry (Default) | Provider `[OFFEN]` — `LIVE-COMPLIANCE.md` § 1 #14 |
| Testing | Vitest (Unit) + Playwright (E2E) + Lighthouse-CI | |

### 1.1 Mail-Welten-Trennung

Drei verschiedene Mail-Quellen — jede für ihren Zweck:

| Mail-Typ | Wer schickt | Wofür |
|---|---|---|
| **Persönliche Mails** | Microsoft 365 Exchange (alex@wagner-its.com / support@instantpage.at) | Support-Antworten, persönlicher Posteingang |
| **Rechnungen + Payment-Receipts** | Stripe automatisch | "Zahlung über X € eingegangen", Failed-Payment-Reminder |
| **Lifecycle-Mails** (Welcome, Trial-Reminder, Cancellation, Domain-Setup, Password-Reset) | **Resend** | siehe OPERATIONS.md § 2 Email-Templates |

**Warum nicht Microsoft 365 für Lifecycle-Mails:** kein Templating, schlechte Bulk-Deliverability, kein Bounce-Tracking, persönliches Postfach soll persönlich bleiben.

**SPF / DKIM / DMARC:** Resend liefert DNS-Records — werden in Phase 0 eingerichtet, bevor erste Live-Mail rausgeht. Sonst Spam-Risiko.

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

Vollständiges Schema aus Prototyp-Bestand. Live wird via Drizzle-Migrations versioniert in `supabase/migrations/`. RLS-Policies für alle Tabellen aktiv.

### 4.1 Tabelle `orders` (Kerntabelle)

Die zentrale Order-Tabelle hält Firmendaten + Content + Status + Subscription pro Kunden-Website.

**Identität + Auth:**
- `id` uuid (client-generiert), `user_id` (FK auth.users), `email`, `vorname`, `nachname`

**Firmen-Stammdaten:**
- `firmenname`, `branche`, `branche_label`, `kurzbeschreibung`, `bundesland`, `einsatzgebiet`
- `adresse`, `plz`, `ort`, `telefon`
- `oeffnungszeiten`, `oeffnungszeiten_custom`

**Recipe-System (Live, neu vs. Prototyp):**
- `berufsgruppe` text (1 von 12) — User-Wahl
- `berufsbezeichnung` text Freitext — Display-Text
- `look` text (1 von 1-4 pro Berufsgruppe) — User-Wahl
- `recipe` text (auto-derived aus berufsgruppe+look)
- `accent_color` hex
- `anrede` text ('sie' / 'du')
- `branche` bleibt als Fallback-Lookup für Inhalts-Defaults

**Style-Felder (aus Prototyp, in Live ggf. via `recipe` ersetzt — `[OFFEN]` Mapping):**
- `stil` ('klassisch' / 'modern' / 'elegant') — wird durch `look` ersetzt
- `custom_color`, `custom_accent`, `custom_bg`, `custom_sep`, `custom_font`, `custom_radius`

**Leistungen:**
- `leistungen` text[] — Liste ausgewählter Leistungen
- `extra_leistung` text — Freitext, Komma/Zeilenumbruch wird zu Cards
- `leistungen_beschreibungen` jsonb — Map `{leistungsname: beschreibung}`
- `leistungen_fotos` jsonb — Map `{leistungsname: url}` Pro-Service-Bilder
- `leistungen_fotos_credits` jsonb — Bildrechte pro Foto

**Service-Badges + Features:**
- `notdienst`, `meisterbetrieb`, `kostenvoranschlag` boolean
- `buchungslink`, `hausbesuche`, `terminvereinbarung`

**Content-Sections (alle als jsonb-Arrays/Maps):**
- `team` jsonb — `[{name, titel, bio, foto_url, foto_credit}]`
- `bewertungen` jsonb — `[{name, sterne, text}]`
- `faq` jsonb — `[{frage, antwort}]`
- `galerie` jsonb — `[{url, caption, credit}]`
- `partner` jsonb — `[{name, url_logo}]`
- `fakten` jsonb — Key-Facts-Block
- `sections_visible` jsonb — `{faq, galerie, fakten, partner, …}` Toggle-System
- `varianten_cache` jsonb — Section-Varianten-Auswahl gecacht

**Impressum-Pflichtfelder (rechtsformabhängig):**
- `unternehmensform` ('e.U.' / 'GmbH' / 'OG' / 'KG' / 'AG' / 'Verein' / 'GesbR' / 'Einzelunternehmen')
- `uid_nummer`, `firmenbuchnummer`, `firmenbuchgericht`, `gisazahl`
- `geschaeftsfuehrer`, `vorstand`, `aufsichtsrat` (für GmbH/AG)
- `zvr_zahl`, `gesellschafter` (für Verein/GesbR)
- `unternehmensgegenstand`, `liquidation`
- `kammer_berufsrecht`, `aufsichtsbehoerde`
- `iban_owner`, `iban_iban`

**Social Media:**
- `facebook`, `instagram`, `linkedin`, `tiktok`

**Subdomain + Status:**
- `subdomain` text UNIQUE — URL-Slug
- `status` ('pending' / 'in_arbeit' / 'trial' / 'live' / 'offline')
- `notiz` text — interne Admin-Notiz
- `last_error` text — letzter API-Fehler

**Storage-URLs:**
- `url_logo`, `url_foto1`-`url_foto5` — Supabase Storage URLs
- `fotos` boolean — hat Bilder hochgeladen
- `rechte_bestaetigt_at`, `rechte_bestaetigt_ip` — Bildrechte-Audit

**Generierung:**
- `website_html` text — generiertes HTML
- `tokens_in`, `tokens_out`, `cost_eur` — Anthropic Cost-Tracking
- `quality_score` int (0-100) — Auto Quality-Check Score
- `quality_issues` jsonb — Array Quality-Issue-Strings

**Re-Generation:**
- `regen_requested` boolean
- `last_regen_at`, `prev_regen_at` timestamptz
- Rate-Limit: max 2x pro 30 Tage (Prototyp-Logik, `[OFFEN]` für Live)

**Import (Firecrawl):**
- `firecrawl_credits` int
- `import_cost_eur`, `import_tokens_in`, `import_tokens_out`

**Subscription (Stripe):**
- `stripe_customer_id`, `subscription_id`
- `subscription_status` ('active' / 'canceled')
- `subscription_plan` ('monthly' / 'yearly')
- `trial_expires_at` timestamptz

**Hero-Headline (Live-Feature, Memory `project_hero_headline_pattern.md`):**
- `hero_headline` text — Claude-generierte Kernbotschaft (H1)

**Timestamps:**
- `created_at`, `updated_at` timestamptz

### 4.2 Tabelle `activity_log`

Audit-Trail aller Order-Änderungen.

| Spalte | Typ | Notiz |
|---|---|---|
| `id` | uuid | PK |
| `order_id` | uuid | FK → orders, CASCADE |
| `action` | text | siehe Action-Liste in OPERATIONS.md § 1.5 |
| `details` | jsonb | strukturierte Zusatzinfo |
| `actor` | text | 'admin' / 'system' / 'user' |
| `created_at` | timestamptz | indexiert (order_id, created_at DESC) |

### 4.3 Tabelle `support_requests`

| Spalte | Typ | Notiz |
|---|---|---|
| `id` | uuid | PK |
| `email` | text | Anfrage-Absender |
| `subject`, `message` | text | Inhalt |
| `status` | text | 'offen' / 'in_bearbeitung' / 'beantwortet' |
| `order_id` | uuid? | FK optional (verknüpfen falls bekannt) |
| `created_at` | timestamptz | |

### 4.4 Tabelle `error_logs`

Strukturiertes Error-Logging. **Live ggf. durch Sentry ersetzen** (`[OFFEN]` — Entscheidung in Phase 0).

| Spalte | Typ |
|---|---|
| `id` uuid PK | `type` text | `message` text | `stack` text | `context` jsonb | `created_at` timestamptz |

### 4.5 Tabelle `beta_feedback` (Beta-Phase-spezifisch)

`[OFFEN]` — wird im Live-Bau abgeschafft (Beta-Phase nur).

### 4.6 Tabelle `docs` (Prototyp-spezifisch)

Wird im Live-Bau **abgeschafft** — Doku ist im Repo (siehe `docs/`).

### 4.7 Geplante neue Tabellen für Live

- **`order_snapshots`** — Pre-Regen-Snapshot der orders-Row (jsonb), Auto-Delete nach 30 Tagen via pg_cron. Memory `project_production_refactor.md`. Admin-only RLS.
- **`subprocessor_dpas`** — Tracking welcher Auftragsverarbeiter wann DPA unterzeichnet hat (LIVE-COMPLIANCE § 4)
- **`ai_calls`** — Prompt-Versioning self-built: prompt_hash, model, tokens, cost, latency, quality_score, order_id (Memory `project_production_refactor.md`)
- **`abuse_reports`** — Notice-and-Takedown-Inbox (LIVE-COMPLIANCE § 12.1)

### 4.8 Storage Bucket: `customer-assets`

```
customer-assets/                   # public Bucket
├── {user_id}/logo.{ext}           # PNG empfohlen
├── {user_id}/foto1.{ext}          # Hero-Foto
├── {user_id}/foto2-5.{ext}        # Galerie-Slots
├── {user_id}/galerie/{n}.{ext}    # erweiterte Galerie
├── {user_id}/team/{name}.{ext}    # Team-Fotos
└── {user_id}/leistungen/{slug}.{ext}  # Pro-Service-Bilder
```

- Max 5 MB pro Datei, JPG/PNG/WebP/GIF
- RLS: authenticated Upload in eigenen Ordner, public Read
- Trial-Cleanup löscht User-Verzeichnis bei Trial-Ablauf

### 4.9 RLS-Strategie

- **`orders`:** `auth.uid() = user_id` für SELECT/UPDATE/DELETE; INSERT bei Self-Registration nur für eigenen `user_id`
- **`activity_log`:** SELECT für `auth.uid() = order.user_id`; INSERT nur via Service-Key (server-side)
- **`support_requests`:** SELECT für eigene; INSERT von beliebigen authenticated
- **`error_logs`:** Admin-only
- **Storage:** RLS pro User-Ordner

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

Vollständige Endpoint-Liste aus Prototyp-Bestand + Live-Ergänzungen:

```
src/app/api/
├── import/route.ts                   (= functions/api/import-website.js)
│                                     # Firecrawl + Jina-Fallback + Claude Haiku Extraktion
├── generate/
│   ├── route.ts                      (= functions/api/generate-website.js)
│   ├── headline/route.ts             (= functions/api/generate-headline.js)
│   │                                 # Hero-Headline-Pattern, separater Call
│   └── faq/route.ts                  (= functions/api/generate-faq.js)
│                                     # 5 branchenspez. FAQs als JSON
├── start-build/route.ts              (= functions/api/start-build.js)
│                                     # initialisiert Generierung, setzt trial_expires_at
├── request-regen/route.ts            (= functions/api/request-regen.js)
│                                     # Partial-Regen Leistungen, Rate-Limit 2x/30 Tage
│                                     # `[OFFEN]` ob Live mit Recipe-System gleich bleibt
├── checkout/route.ts                 (= functions/api/create-checkout.js)
├── billing-portal/route.ts           (= functions/api/billing-portal.js)
├── invoices/route.ts                 (= functions/api/get-invoices.js)
├── stripe-webhook/route.ts           (= functions/api/stripe-webhook.js)
│                                     # checkout.session.completed, invoice.payment_succeeded,
│                                     # invoice.payment_failed, customer.subscription.deleted
├── admin/
│   ├── data/route.ts                 (= admin-data.js)
│   ├── update/route.ts               (= admin-update.js)
│   ├── delete/route.ts               (= admin-delete.js, Cascade User+Storage+Logs)
│   ├── system/route.ts               (= admin-system.js, Health-Check)
│   ├── ext-status/route.ts           (= ext-status.js, externe Status-Pages)
│   └── log-activity/route.ts         (= log-activity.js, GET+POST)
├── cron/
│   ├── stuck-pending/route.ts        # CF Cron, alle 5 Min
│   ├── trial-cleanup/route.ts        # CF Cron, täglich 03:00 UTC, Cascade
│   └── health-monitor/route.ts       # CF Cron, alle 15 Min, HEAD-Probe + Auto-Tickets
└── webhooks/
    ├── abuse/route.ts                # Notice-and-Takedown-Inbox (Live-NEW)
    └── support/route.ts              # ggf. eingehende Support-Mails von Helpdesk
```

**Endpoints für Kunden-Websites** (unter `app/sites/[subdomain]/`):

```
app/sites/[subdomain]/
├── page.tsx                          # Recipe-Render Hauptseite
├── impressum/page.tsx
├── datenschutz/page.tsx
├── legal/page.tsx                    # Vollständige Rechts-Seite (impressum + datenschutz)
├── sitemap.xml/route.ts              # Sitemap pro Kunden-Site
├── robots.txt/route.ts               # mit AI-Crawler-Erlaubnis
├── llms.txt/route.ts                 # AI-Sichtbarkeit (Pro-Plan)
├── vcard/route.ts                    # vCard-Download (Kontakt)
└── vcard-contact/route.ts            # QR-Code-vCard
```

`[OFFEN]` — **Server Actions vs. Route Handlers:** Next.js 15 hat beide. Forms könnten via Server Actions typsicher und ohne `route.ts`-Boilerplate. Entscheidung: Default Route Handlers (für externe Calls + Webhooks + Crons), Forms wo möglich Server Actions. Pattern in Phase 0 fixieren.

`[OFFEN]` — **Re-Generation-Logik Live:** Prototyp hat `request-regen` mit Rate-Limit 2x/30 Tage + Partial-Regen (nur Leistungen). Mit Recipe-System: Re-Gen-Trigger? Bei Berufsbezeichnung-Änderung? Look-Wechsel? Anrede-Wechsel?

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

`[OFFEN]` — Supabase Auth + JWT-Validation. Cookie-Domain-Scope kritisch (Code-Audit als Phase-A-Aktion in [`LIVE-COMPLIANCE.md` § 17 Roadmap](LIVE-COMPLIANCE.md#17-roadmap-phase-ad), zugehörige Strategie-Frage [§ 5.6 #9](#56-offene-entscheidungen-vor-phase-0)).

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
