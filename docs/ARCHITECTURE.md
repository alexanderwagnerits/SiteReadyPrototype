# Architektur — instantpage.at

> **Living Document.** Tech-Stack, DB-Schema, Repo-Struktur, Routing, API, Auth, Deployment, Backup, Security spec'd. Detail-Audits in Phase 0.

**Stand:** 2026-05-14

---

## Status

`[GRÖSSTENTEILS-FERTIG 2026-05-06]` — Tech-Stack, DB-Schema, Repo-Struktur, Routing, API-Endpoints alle spec'd. Die zuvor offenen 10 Entscheidungen vor Phase 0 (§ 5.6) sind getroffen. Backup/Monitoring/Hardening verweisen auf `OPERATIONS.md`. Verbliebene Detail-Punkte werden in Phase 0 final fixiert (Code-Audit, Diagramm-Erstellung).

---

## Inhalt (geplant)

1. Tech-Stack (Live-Produkt) — inkl. § 1.3 KI-Modell-Strategie, § 1.4 Provider-Portabilitaet
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
| KI | Anthropic Claude Sonnet 4.6 (kundensichtbar) + Haiku 4.5 (interne Pipeline) + Prompt Caching | Provider-agnostische Abstraktion via `lib/generate/client.ts` (§ 1.4). Anthropic-Key aus Prototyp übernommen |
| **Transaktionale Mails** | **Resend** (`[ENTSCHIEDEN]` 2026-05-04) | siehe § 1.1 Mail-Welten-Trennung; Quelle: `LIVE-COMPLIANCE.md` § 1 #13 |
| **Bildverarbeitung** | **Cloudflare Images** ($5/Mon Basis + Usage) | Auto-Resize, WebP/AVIF, CDN-Delivery |
| **Lifecycle-Workflows** | **Trigger.dev oder Inngest** (gleich von Anfang) | Mail-Drip, Dunning, Long-Running Jobs |
| **Routine-Crons** | Cloudflare Cron Triggers (in wrangler.toml) | trial-cleanup, stuck-pending, health-monitor |
| Analytics Plattform | **Cloudflare Web Analytics** (Default, cookielos) + **PostHog Cloud EU** (Funnels, Session-Replay, Feature-Flags) (`[ENTSCHIEDEN]` 2026-05-04) | siehe `LIVE-COMPLIANCE.md` § 1 #15 + #15a |
| Analytics Kundenseiten | **Cloudflare Web Analytics** (cookielos, kein Banner) — Kunden-Dashboard im Portal (Pro-Feature) (`[ENTSCHIEDEN]` 2026-05-04) | siehe `LIVE-COMPLIANCE.md` § 1 #15a |
| Cookie-Consent Plattform | **Klaro** (Open Source, Self-Hosted, €0) — Cookiebot als Reserve (`[ENTSCHIEDEN]` 2026-05-04) | nur fuer Plattform-Domain; Kundenseiten Banner-frei. Siehe `LIVE-COMPLIANCE.md` § 1 #15b |
| Bot-Schutz Kontaktformulare | **Cloudflare Turnstile** (kein Cookie, kostenlos, DSGVO-konform) — NIE Google reCAPTCHA (`[ENTSCHIEDEN]` 2026-05-04) | siehe `LIVE-COMPLIANCE.md` § 1 #15c |
| Error-Monitoring | **Sentry-Free-Tier** (5k Events/Mo, EU-Server) Live; **Cloudflare Workers Logs** Beta (`[ENTSCHIEDEN]` 2026-05-04) | siehe `LIVE-COMPLIANCE.md` § 1 #14 |
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

### 1.2 Compliance-Architektur-Patterns

Verbindliche Patterns die im Live-Bau angewandt werden — Quelle der Wahrheit: `LIVE-COMPLIANCE.md` "Compliance-Strategie".

**Single-Source-of-Truth fuer rechtsrelevante Werte:** `config/legal-values.ts` enthaelt alle Konstanten die in mehreren Stellen (AGB, DSE, Mail-Templates, Code) auftauchen — z.B. `TRIAL_DAYS`, `REACTIVATION_DAYS`, `SOFT_DELETE_DAYS`, `HARD_DELETE_DAYS`, `RE_GEN_RATE_LIMIT_PER_30_DAYS`. AGB- und DSE-Templates rendern via Variablen `{{TRIAL_DAYS}}`. ESLint-Rule blockt Magic Numbers in legal-Kontext. Aenderung an einer Konstante propagiert automatisch in AGB/Mails/UI/Doku — keine Drift-Quelle.

```ts
// config/legal-values.ts (Beispiel)
export const LEGAL = {
  TRIAL_DAYS: 7,
  REACTIVATION_DAYS: 30,
  SOFT_DELETE_DAYS: 60,
  HARD_DELETE_DAYS: 90,
  RE_GEN_RATE_LIMIT_PER_30_DAYS: 3,
  CANCELLATION_NOTICE: "Monatsende",
  REFUND_POLICY: "kein Refund nach Trial",
  CUSTOMER_DATA_RETENTION_YEARS: 7, // UGB § 212
  STRIPE_RECEIPT_RETENTION_YEARS: 7, // UGB + BAO § 132
  NEWSLETTER_OPT_IN_PROOF_RETENTION_YEARS: 3, // UWG-Verjaehrung AT
} as const;
```

**Pure-Forwarder-Pattern fuer Form-Submissions auf Kundenseiten:** Alle Form-Submissions (Kontakt, Reservierung, Termin) auf `*.instantpage.at` laufen als Pure Forwarder ueber Resend direkt an die vom Kunden hinterlegte Mailbox. Kein Write in unsere DB. Kein Speichern der Inhalte. Cloudflare Function validiert Turnstile-Token, ruft Resend API auf, returnt Status. Server-Log nur Status (success/fail), keine Inhalte. Hybrid-Variante mit Portal-Inbox als Quartal-Update geplant (siehe `PRODUCT.md` § 9). Quelle: `LIVE-COMPLIANCE.md` § 6 Anhang IV.

```
Endnutzer fuellt Formular aus
  ↓
Cloudflare Function (form-submit.ts)
  ↓
[Turnstile-Token validieren]
  ↓
Resend API → kunden-mail@kunde.at
  ↓
Server-Log: nur Status, keine Inhalte
```

**Cookie-Banner-Verteilung:** `app/(platform)/**` mit Klaro-Banner-Snippet. `app/(customer-sites)/**` ohne Banner — als USP. Implementiert durch separate Layout-Files; Banner-Component nicht in shared Components.

**Bot-Schutz:** Cloudflare Turnstile als React-Component fuer alle Public-Forms (Plattform + Kundenseiten). NIE Google reCAPTCHA. Turnstile ist cookielos und triggert keinen Banner-Bedarf.

**`compliance-reviewer` Subagent:** lokales `.claude/agents/compliance-reviewer.md` File mit Trigger-/Rules-Spec aus Memory `project_dev_subagents_idea.md`. Wird automatisch von Claude konsultiert bei Aenderungen an Templates, legal.ts, package.json, externen API-Calls, UI-Texten, DB-Schema. Pattern-Detection + Cross-Reference-Check + Cascade-Warnung. Setup in Phase 0 direkt nach Repo-Init.

### 1.3 KI-Modell-Strategie

> **Leitprinzip:** Beste Qualitaet fuer alle kundensichtbaren Texte. Pragmatismus fuer interne Pipeline-Schritte. Modell-Auswahl pro Endpoint dokumentiert — nicht ad-hoc beim Coden.

**Quality-Bar (kundensichtbar = nicht verhandelbar):** Alle Inhalte, die auf einer Kunden-Website als Text erscheinen, werden mit dem **staerksten aktuell verfuegbaren Sonnet** generiert (Stand 2026-05: `claude-sonnet-4-6`). Trade-off Geschwindigkeit/Kosten wird zugunsten Qualitaet entschieden — der Kunde sieht das Ergebnis, nicht den Token-Preis. Haiku ist fuer Kunden-Output **nicht zulaessig**, auch nicht bei „nur ein Satz"-Endpoints wie der Hero-Headline (das ist die erste Zeile, die ein Besucher liest).

| Endpoint | Modell | Begruendung |
|---|---|---|
| `generate/route.ts` (Haupt-Texte) | **Sonnet** | Kunden-sichtbar, Hauptqualitaetstreiber |
| `generate/headline/route.ts` | **Sonnet** | Hero-H1, praegt First-Impression der Site |
| `generate/faq/route.ts` | **Sonnet** | Direkt auf Website, SEO-relevant |
| `request-regen/route.ts` (Sektion-HTML) | **Sonnet** | HTML + Text fuer Live-Site |
| `import/route.ts` — Extraktion | **Haiku** | Interner Parsing-Step, kein End-Output |
| `import/route.ts` — Web-Search-Synthese | **Haiku** | Interne Datenakquise |
| Foto-Klassifizierung (Vision) | **Haiku Vision** | Interne Klassifikation, kein End-Output |

**Regel:** Eine Modell-Wahl gegen diese Tabelle erfordert explizite Begruendung in der PR-Beschreibung + Update dieser Tabelle. Aenderungen an dieser Policy konsultieren den `compliance-reviewer` Subagent.

### 1.4 Provider-Portabilitaet (Architektur-Prinzip)

> **Wir setzen heute auf Anthropic, designen aber so, dass ein Provider-Wechsel (OpenAI, Gemini, andere) in 1-2 Tagen machbar bleibt — kein Re-Architecting.**

**Warum jetzt schon design'en:** Single-Vendor-Lock-in auf den teuersten Cost-Block (KI-Generierung) ist ein strategisches Risiko — Anthropic kann Preise erhoehen, ein neuer Provider kann disruptiv besser werden, oder Compliance kann eine zweite Quelle erzwingen. Die Kapselung ist heute billig (1-2 zusaetzliche Files), nachtraeglich teuer (6 Endpoints umbauen).

**Was Provider-spezifisch ist und gekapselt sein muss:**

- **Prompt Caching** (`cache_control`) — Anthropic-only. Kapselung in `lib/generate/cache.ts`. Bei Wechsel-Provider No-Op; nominaler Listenpreis muss neu kalkuliert werden.
- **Extended Thinking** (`thinking`-Parameter) — Anthropic-only. Kapselung in `lib/generate/client.ts`. Bei Wechsel-Provider weglassen oder gegen Provider-Equivalent (o1-style Reasoning) tauschen.
- **System-Prompt + Tool-Format** — leichte Format-Unterschiede zwischen Providern.

**Was die Abstraktion liefern muss:**

- **`lib/generate/client.ts` als Provider-agnostische Funktion** — Signatur: `callLLM({ provider, model, system, messages, maxTokens, cacheable, thinking })` mit internem Switch je Provider. Default: `provider = 'anthropic'`. Alle 6 Endpoints rufen ausschliesslich `callLLM()`, **nie** `fetch("https://api.anthropic.com/...")` direkt.
- **`lib/generate/pricing.ts`** — Preis-Tabellen je Provider+Modell. Update via Migration, nicht hardcoded an Call-Sites.
- **`ai_calls`-Tabelle Provider-neutral** — Spalten siehe § 4.7. Kein `anthropic_tokens_in` o.ae., sondern `provider` + `model` + `tokens_in/out/cached`.
- **ENV-Keys generisch** — `LLM_PROVIDER` (`anthropic` / `openai` / `gemini`) + `<PROVIDER>_API_KEY` Pattern. Default-Wert + Fallback bei fehlendem Key explizit.

**Wann re-evaluieren wir Provider?**

- **Heute:** Anthropic. Caching-Vorteil (cached Input zu ~€0.30/MTok statt €3) macht Sonnet bei unserem statischen ~9K-Token-System-Prompt-Pattern wahrscheinlich konkurrenzlos guenstig.
- **Trigger fuer Re-Eval:** (1) Anthropic-Preiserhoehung >30%, (2) ein neues Modell mit deutlich besserer Qualitaet bei vergleichbarem Preis, (3) Provider-Resilienz wird zum Compliance-Thema (Single-Point-of-Failure), (4) AT/EU-Compliance-Anforderung an Datenresidenz, die Anthropic nicht erfuellt.

**Verbindliche Memory-Referenz:** `feedback_llm_provider_portability.md` — Architektur-Disziplin gilt fuer jeden neuen LLM-Endpoint.

## 2. System-Architektur

Textuelles Architektur-Diagramm (Mermaid-Diagramm in Phase 0 ergänzen):

```
                          ┌─────────────────────┐
                          │   instantpage.at    │  ← Plattform (Marketing + Portal)
                          │  (Cloudflare Pages) │
                          └──────────┬──────────┘
                                     │
                ┌────────────────────┼────────────────────┐
                │                    │                    │
        ┌───────▼─────────┐  ┌───────▼─────────┐ ┌───────▼─────────┐
        │  *.instantpage  │  │   Custom-Domain │ │   Auth + Portal │
        │  (Wildcard      │  │   (Pro-Plan,    │ │   (Supabase     │
        │   Subdomain)    │  │    CF for SaaS) │ │    Auth + JWT)  │
        └────────┬────────┘  └────────┬────────┘ └────────┬────────┘
                 │                    │                    │
                 └─────────┬──────────┴────────────────────┘
                           │ (Middleware-Rewrite)
                  ┌────────▼────────┐
                  │  Render-Pipeline│
                  │  Beta: template │  ← Heute (Beta-Stand)
                  │  Live: Sections │  ← Live-Bau (Phase 1+)
                  └────────┬────────┘
                           │
              ┌────────────┴───────────────┐
              ▼                            ▼
    ┌──────────────────┐         ┌──────────────────┐
    │  Supabase (EU)   │         │  Anthropic API   │
    │  Postgres + RLS  │         │  (Text-Gen)      │
    │  Storage         │         └──────────────────┘
    └──────────────────┘
              │
              ▼
    ┌──────────────────┐
    │  Cloudflare R2   │  ← Backup-Mirror (siehe OPERATIONS § 6)
    │  Backup-Storage  │
    └──────────────────┘
```

**Datenfluss Onboarding → Live-Site:**
1. User registriert sich → Supabase Auth → `orders.user_id` gesetzt
2. Pre-Purchase-Fragebogen sammelt: berufsgruppe, bezeichnung, look_variante, kontaktdaten
3. Stripe Checkout → Webhook → `status = paid`
4. User klickt "Website erstellen" → `/api/start-build`
5. Auto-Engine (Layer 4) leitet Recipe ab (siehe `recipe-konfiguration.md`)
6. Anthropic generiert Texte mit Placeholders (`{{FIRMENNAME}}`, `{anrede_pron}` etc.)
7. Quality-Check → Score, bei < 70 Auto-Re-Gen, bei < 70 zweimal Admin-Alarm
8. `status = live` → Subdomain `firma.instantpage.at` aktiv
9. Portal-Edits werden serve-time eingespielt (siehe `OPERATIONS.md` § 8.4)

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

**Style-Felder** — Live-Bau erweitert das Beta-Schema additiv (siehe `recipe-konfiguration.md` § Datenmodell-Bridge):
- `stil` bleibt (klassisch/modern/elegant/rustikal/custom)
- `layout` neu (standard/kompakt/ausfuehrlich)
- `look_variante` neu (pro Berufsgruppe vordefiniert)
- `section_toggles` jsonb neu
- `bewertungen_variante` (cards/quote/liste)
- `leistungen_variante` (alternierend/kompakt)
- `branchen_funktionen` jsonb (Speisekarte/Reservierung/Termin-Anfrage/Notdienst-Banner/Sprechzeiten/Buchung)

**Aus Prototyp:**
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
- `tokens_in`, `tokens_out`, `cost_eur` — Aggregiertes KI-Cost-Tracking für die Order-Hauptgenerierung. Per-Call-Granularität (Headline, FAQ, Regen, Import-Calls, Foto-Klassifizierung) in `ai_calls` (§ 4.7). Provider-neutral — siehe § 1.4.
- `quality_score` int (0-100) — Auto Quality-Check Score
- `quality_issues` jsonb — Array Quality-Issue-Strings

**Re-Generation:**
- `regen_requested` boolean
- `last_regen_at`, `prev_regen_at` timestamptz
- Rate-Limit: max **3x pro 30 Tage** (Live, siehe `PRODUCT.md` § 3.3 — Prototyp hatte 2x)

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

Strukturiertes Error-Logging. **Live: beides nutzen** `[ENTSCHIEDEN 2026-05-06]`:
- `error_logs` (Postgres): App-Fehler aus Cron-Jobs, Build-Pipeline, Webhook-Verarbeitung — strukturiert mit order_id, retention 90 Tage
- **Sentry**: Worker-Errors + Frontend-Errors (Stack-Traces, Breadcrumbs, Session-Replay) — siehe `OPERATIONS.md` § 9.2

| Spalte | Typ |
|---|---|
| `id` uuid PK | `type` text | `message` text | `stack` text | `context` jsonb | `created_at` timestamptz |

### 4.5 Tabelle `beta_feedback` (Beta-Phase-spezifisch)

`[ENTSCHIEDEN: in Live entfernt]` — Beta-Phase-only. Migrations-Skript bei Cutover entfernt Tabelle.

### 4.6 Tabelle `docs` (Prototyp-spezifisch)

Wird im Live-Bau **abgeschafft** — Doku ist im Repo (siehe `docs/`).

### 4.7 Geplante neue Tabellen für Live

- **`order_snapshots`** — Pre-Regen-Snapshot der orders-Row (jsonb), Auto-Delete nach 30 Tagen via pg_cron. Memory `project_production_refactor.md`. Admin-only RLS.
- **`subprocessor_dpas`** — Tracking welcher Auftragsverarbeiter wann DPA unterzeichnet hat (LIVE-COMPLIANCE § 4)
- **`ai_calls`** — Provider-neutrales Per-Call-Log fuer ALLE LLM-Aufrufe (Memory `project_production_refactor.md`, § 1.3 + § 1.4):
  - `id` UUID PK
  - `order_id` FK → orders (nullable: Import vor Order-Anlage erlaubt)
  - `endpoint` text — z.B. `generate.main`, `generate.headline`, `generate.faq`, `regen.section`, `import.extract`, `import.websearch`, `photo.classify`
  - `provider` text — `anthropic` / `openai` / `gemini` (Provider-Portabilitaet § 1.4)
  - `model` text — z.B. `claude-sonnet-4-6`, `claude-haiku-4-5`
  - `prompt_hash` text — SHA256 fuer Prompt-Versioning (Drift-Detection)
  - `tokens_in`, `tokens_out`, `tokens_cached_write`, `tokens_cached_read` int
  - `cost_eur` numeric(10,6) — berechnet via `lib/generate/pricing.ts`
  - `latency_ms` int
  - `quality_score` int nullable — wo Quality-Check laeuft (Haupt-Generate)
  - `error` text nullable — bei Fehler
  - `created_at` timestamptz
  - Admin-only RLS. Index auf `order_id` + `endpoint`. Retention 90 Tage (pg_cron Auto-Delete).
  - **Pflicht:** JEDER Aufruf via `callLLM()` schreibt eine Row — Kostenkontrolle und Provider-Vergleichbarkeit haengen daran.
- **`abuse_reports`** — Notice-and-Takedown-Inbox (LIVE-COMPLIANCE § 12.1)
- **`live_freigaben`** (LIVE-COMPLIANCE § 1 #24 + § 5 AGB-§ 5 Abs 5 + § 13 AI-Act-Auslegung) — Audit-Trail des Live-Schaltungs-Freigabe-Klicks pro Kunde:
  - `id` UUID PK
  - `order_id` FK → orders (UNIQUE — eine Freigabe pro Order; bei Re-Aktivierung nach Cancellation neue Row)
  - `freigegeben_at` timestamptz NOT NULL — Zeitpunkt des Klicks
  - `weg` enum NOT NULL — `sofort_live` (Default-Button) oder `nach_vorschau` (Secondary-Button)
  - `vorschau_dauer_sek` int nullable — bei `weg = nach_vorschau`: Sekunden zwischen `status = bereit` und Freigabe-Klick. Sonst NULL.
  - `ip` inet NOT NULL — IP zum Zeitpunkt des Klicks (DSGVO Art 6 Abs 1 lit b Vertragsbeweis)
  - `agb_version` text NOT NULL — Version der AGB die der Kunde akzeptiert hat (z.B. „2026-08-01")
  - `ai_disclosure_text` text NOT NULL — exakter Wortlaut der Akzept-Checkbox die der Kunde angeklickt hat (Audit gegen spaetere AGB-Wording-Aenderungen)
  - `user_agent` text — Browser-/Device-Info (forensischer Wert bei Streit)
  - `created_at` timestamptz DEFAULT now()
  - Admin-only RLS, Kunde sieht eigene Freigabe-Historie als read-only im Portal-Tab „Mein Account"
  - **Pflicht-Insert:** Jeder Statusuebergang `bereit → live` schreibt eine Row. Ohne Row-Insert kein Statuswechsel (Constraint via DB-Trigger oder Application-Layer)
  - Retention: unbegrenzt (Beweismittel — wird bei Hard-Delete des Kunden mitgeloescht, vorher anonymisiert: IP + User-Agent → NULL, Rest bleibt fuer 7 Jahre fuer steuerrechtliche Aufbewahrungsfrist § 132 BAO)
- **`partners`** (Multiplikator-Programm, MARKETING § 3.3) — Spec 2026-05-14:
  - `id` UUID PK
  - `name`, `company`, `uid` (Pflicht — Anti-Missbrauch: keine Privat-Partner), `email`, `phone`
  - `code` (eindeutig, z.B. `STB-LECHNER-2026`), `active` boolean
  - `provision_model` enum (`lifetime_20` / `first_year_20_then_10` / `mixed_credit`)
  - `created_at`, `terms_accepted_at`, `payout_method` (z.B. „Provisions-Rechnung an Wagner IT-Solutions e.U.")
  - Admin-only RLS, partner sieht eigene Daten via separates Partner-Portal (`partners.instantpage.at` `[BAU Phase 2]`)
- **`partner_referrals`** (MARKETING § 3.3) — Spec 2026-05-14:
  - `id` UUID PK
  - `partner_id` FK → `partners.id`
  - `order_id` FK → `orders.id` (vermittelter Kunde)
  - `signup_date`, `first_paid_date` (NULL bis erste Zahlung — Cooldown-Schutz)
  - `status` enum (`pending` / `eligible` / `paid` / `void`)
  - `void_reason` text (z.B. „self-referral", „cancellation in trial")
  - Trigger: bei Stripe-Webhook `invoice.payment_succeeded` → Status auf `eligible`, dann Webhook fuer Provisions-Abrechnung
  - Admin-only RLS, Partner sieht eigene Referrals via Partner-Portal
- **`partner_provisions`** (MARKETING § 3.3) — Spec 2026-05-14:
  - `id` UUID PK
  - `partner_id` FK
  - `referral_id` FK
  - `billing_period_start`, `billing_period_end` (Monatsabrechnung)
  - `amount_net` (Euro), `vat` (0 oder 20 %, je nach Partner-Status)
  - `paid_at` (NULL bis Auszahlung)
  - `invoice_url` (Link zur Provisions-Rechnung vom Partner)
  - Admin-only RLS

**Anti-Missbrauch-Constraints fuer Partner-Tabellen:**
- Unique-Index auf `partners.uid` — keine doppelten Partner-Accounts mit gleicher UID
- Trigger: bei `partner_referrals` Insert pruefen ob `order.email` und `partners.email` identisch → automatisch `void` mit Reason „self-referral"
- Cooldown: `partner_provisions` nur erzeugen wenn `first_paid_date` > 7 Tage (Trial-Cancellation-Schutz)

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
│   │   ├── generate/                 # Provider-agnostische LLM-Calls + Prompts + Quality-Check (§ 1.3 + § 1.4)
│   │   │   ├── prompt.ts
│   │   │   ├── client.ts             # callLLM() Abstraktion — einziger Call-Site zu allen Providern
│   │   │   ├── cache.ts              # Prompt-Caching-Helper (Anthropic; bei anderen Providern No-Op)
│   │   │   ├── pricing.ts            # Preis-Tabelle je Provider+Modell — Quelle für cost_eur in ai_calls
│   │   │   └── quality-check.ts
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
│   │   ├── mailing/                  # Resend (entschieden 2026-05-04)
│   │   │   ├── client.ts
│   │   │   └── templates/            # 9 Lifecycle-Templates (OPERATIONS § 2)
│   │   ├── images/                   # `[ENTSCHIEDEN 2026-05-06]` Supabase Storage + Sharp-Resize on-the-fly
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
│   ├── unit/                         # `[ENTSCHIEDEN 2026-05-06]` Vitest neben Source: `<file>.test.ts` (Standard, Vitest-nativ). Zentral nur Integration-Tests.
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
│                                     # Firecrawl + Jina-Fallback + Haiku Extraktion (intern, § 1.3)
├── generate/
│   ├── route.ts                      (= functions/api/generate-website.js)
│   │                                 # Sonnet (kundensichtbar, § 1.3)
│   ├── headline/route.ts             (= functions/api/generate-headline.js)
│   │                                 # Hero-Headline-Pattern, Sonnet (Hero-H1, kein Haiku)
│   └── faq/route.ts                  (= functions/api/generate-faq.js)
│                                     # 5 branchenspez. FAQs als JSON, Sonnet
├── start-build/route.ts              (= functions/api/start-build.js)
│                                     # initialisiert Generierung, setzt trial_expires_at
├── request-regen/route.ts            (= functions/api/request-regen.js)
│                                     # Partial-Regen Leistungen (Sonnet), Rate-Limit 3x/30 Tage
│                                     # `[ENTSCHIEDEN 2026-05-06]` Live nutzt Recipe-System für Auto-Engine-Lookup
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

`[ENTSCHIEDEN 2026-05-06]` — **Server Actions vs. Route Handlers:** Default **Route Handlers** für externe Calls (Stripe-Webhooks, Anthropic, Cron-Endpoints, Public-API). **Server Actions** für interne Forms (Onboarding, Portal-Edits) — typsicher, ohne `route.ts`-Boilerplate, mit Zod-Validation in actions.ts. Pattern in Phase 0 final-fixiert.

`[ENTSCHIEDEN 2026-05-06]` — **Re-Generation-Logik Live (Serve-Time-Maximum):** Re-Gen nur in 2 Fällen: (1) initiale Generierung beim Onboarding, (2) manueller "Neu generieren"-Button mit Rate-Limit 3x/30 Tage. Alles andere serve-time via Placeholder (`{{FIRMENNAME}}`, `{{BEZEICHNUNG}}`, `{anrede_pron|Sie/du}`) und Recipe-Konfig-Lookup für Look/Stil/Layout. Detail in `OPERATIONS.md` § 8.4 + `PRODUCT.md` § 3.3. Berufsgruppe nach Onboarding read-only.

### 5.4 Component-Organisation

| Bereich | Pattern |
|---|---|
| `components/ui/` | shadcn-Primitives, ungetestet, eine Datei pro Komponente |
| `components/sections/<name>/` | Pro Section ein Ordner mit Varianten (`HeroTextLed.tsx`, `HeroPhotoLed.tsx`) + `index.ts` für Re-Exports + Storybook-Story (`*.stories.tsx`) |
| `components/platform/` | Eigene Platform-UI (PortalCard, AdminTable) — Storybook-fähig |
| `components/marketing/` | Landing-Bausteine, eher Page-spezifisch |
| `components/fragebogen/` | Fragebogen-Schritte als Components |

`[ENTSCHIEDEN 2026-05-06]` — **Feature-Based Component-Organisation:** sections/themes/marketing/portal. Atomic-Design ist für SaaS over-engineered.

### 5.5 Konventionen

- **Server-Components default**, `"use client"` nur wo nötig (Forms, Hooks, Live-Preview, Browser-APIs)
- **Pure Logic in `lib/`**, niemals React-Imports — testbar ohne Browser
- **Zod-Schemas in `schemas/`** geteilt zwischen Form (RHF), API-Validation (Route Handler) und DB-Insert (Drizzle)
- **Drizzle-Migrations versioniert** in `supabase/migrations/`, gegen Live-DB nur via Migration-Skript
- **Storybook-Story für jede Section + Platform-Component** — ist Reviewbasis im Async-PR-Workflow
- **Tests:** Vitest neben Source (`<file>.test.ts`) `[ENTSCHIEDEN 2026-05-06]`. Zentral nur für Integration-Tests in `tests/integration/`.

### 5.6 Entscheidungen vor Phase 0 (alle getroffen 2026-05-06)

| # | Entscheidung | Gewählt | Begründung |
|---|---|---|---|
| 1 | OpenNext.js Cloudflare-Adapter Setup | **OpenNext-Layer** (`@opennextjs/cloudflare`) | sauberster Migrations-Pfad, Standard-Next.js-Code unverändert, Pages-Functions automatisch generiert |
| 2 | Server Actions vs. Route Handlers | **Mix:** Server Actions für interne Forms, Route Handlers für externe Calls/Webhooks/Cron | siehe § 5.3 |
| 3 | Mailing-Provider | **Resend** `[ENTSCHIEDEN 2026-05-04]` | EU-Hosting verfügbar, gute DSGVO-Doku, Resend-Webhooks für Bounce-Tracking |
| 4 | Bildverarbeitung | **Supabase Storage + Sharp on-the-fly Resize** | Konsistenz mit Backup-Strategy (R2-Mirror), keine pro-Bild-Kosten wie bei Cloudflare Images, Sharp im Worker performant genug |
| 5 | Cron-Mechanismus | **Cloudflare Cron Triggers** (in `wrangler.toml`) | direkt im Stack, kein Drittanbieter, Cron-Definition im Code versioniert |
| 6 | Vitest-Tests | **neben Source** (`<file>.test.ts`) | Vitest-nativ, näher am Code, Refactor-sicher. `tests/integration/` zentral für E2E |
| 7 | shadcn-Registry-Config | **Default Setup mit Theme-Provider** | nötig für 3 v2-Themes (Klassisch/Edel/Rustikal) + Stil-Toggle |
| 8 | DB-Schema Detail | **aktuelles `orders` additiv erweitern** | Recipe-System-Spalten (look_variante, layout, section_toggles, branchen_funktionen) hinzufügen — keine destruktiven Migrationen |
| 9 | Auth-Cookie-Domain-Scope | **Wildcard** (`.instantpage.at`) für Plattform + Subdomains. Custom-Domains bekommen eigenen Auth-Flow (separate Cookie pro Domain) | Subdomain-Hopping-Auth nötig (Portal → Vorschau-Subdomain), aber Custom-Domains sind eigenständige Sites |
| 10 | Storage-Bucket-Struktur | **bleibt** (`customer-assets/{user-id}/...`) | bewährt, RLS funktioniert, Backup-Sync trivial |

→ Alle 10 entschieden 2026-05-06. Code-Audit-Punkte (Auth-Cookie-Scope-Verifikation in Phase 0) bleiben als TODO.

## 6. Auth-Flow

**Stack:** Supabase Auth (E-Mail/Passwort + Magic-Link) + JWT-Validation + RLS in Postgres.

**Cookie-Domain-Scope** `[ENTSCHIEDEN]` — **Wildcard `.instantpage.at`** für Plattform-Subdomains (Portal, Marketing-Site, Kunden-Subdomains für Live-Preview). **Custom-Domains** (Pro-Plan) bekommen eigenen Auth-Flow mit separater Cookie pro Domain — sind eigenständige Sites ohne Portal-Funktion.

**Code-Audit-Punkt Phase 0:** Cookie-`SameSite` + `Secure` + `HttpOnly` flags verifizieren, CSRF-Schutz für Server Actions, Session-Refresh-Mechanismus (siehe `LIVE-COMPLIANCE.md` § 17 Roadmap, Phase A).

**Login-Flow:**
1. User-Login → Supabase Auth → JWT in Cookie (`.instantpage.at` Wildcard, HttpOnly, Secure, SameSite=Lax)
2. Middleware validiert JWT bei jedem Request, refresht Token wenn < 5 Min Restzeit
3. RLS in Postgres prüft `auth.uid() = user_id` für alle Tabellen-Zugriffe
4. Bei Subdomain-Hopping (Portal → kunde.instantpage.at Live-Preview): selbe Cookie wird mitgegeben, RLS validiert Eigentümerschaft
5. Logout → Cookie löschen + Supabase-Session beenden

**Admin-Auth:** separater Login via `/admin?key=...` aktuell im Beta. Live: 2FA-Pflicht (siehe § 10).

## 7. Deployment-Pipeline

`[ENTSCHIEDEN 2026-05-06]`:

| Branch | Ziel | Trigger |
|---|---|---|
| `main` | **Production** auf Cloudflare Pages | Auto-Deploy nach Merge, **manueller Approval-Schritt** vor Production-Push (siehe `OPERATIONS.md` § 9.5 Pflicht-Checks) |
| `staging` | **Staging-Umgebung** | Auto-Deploy bei Push |
| `feature/*` | **PR Preview-Deployment** | Auto pro PR |

**Pre-Merge-Gates (GitHub Actions):**
- ESLint (zero warnings)
- TypeScript-Check (strict mode)
- Vitest (alle Tests grün)
- Playwright (Smoke-Test grün)
- Lighthouse-CI als **Hard-Gate**: A11y < 90 blockt Merge, Performance < 80 Warning

**Pre-Production-Gates** (siehe `OPERATIONS.md` § 9.5):
1. Build-Test grün
2. Smoke-Test grün
3. Migrations-Diff geprüft (keine destruktiven DB-Änderungen)
4. Manueller Approval (kein Auto-Deploy aus `main`)
5. Rollback-Plan (vorherige Version-ID notiert)

## 8. Monitoring + Logging

→ Vollständige Spec in `OPERATIONS.md` § 9. Hier nur Tool-Stack-Übersicht:

- **Sentry** — Worker + Frontend Errors (Stack-Traces, Breadcrumbs, Session-Replay)
- **PostHog Cloud EU** — Product-Analytics (Funnel, Session Replay), DSGVO-konform
- **Cloudflare Workers Logs** + **Logpush nach R2** (30 Tage Retention)
- **Activity-Log** (Postgres-Tabelle) — App-Events mit User-ID, 12 Monate Retention
- **UptimeRobot** Free-Tier + **Cloudflare Health-Check** für Uptime
- **Twilio SMS** (~5–10 €/Mo) für Critical-Alerts
- **Resend Bounce-Webhook** für E-Mail-Versand-Health

## 9. Backup + Recovery

→ Vollständige Spec in `OPERATIONS.md` § 6. Kurz-Übersicht:

- **Supabase Pro** PITR 7 Tage + Daily-Backup → R2-Mirror (30 Tage rolling)
- **Wochen-Snapshots** R2 (12 Wochen) + **Monats-Snapshots** R2 (12 Monate)
- **Storage-Sync** Logos/Fotos täglich nach R2 (30 Tage rolling)
- **Code-Repo:** GitHub eigene Backups + lokales `git clone`
- **Restore-Drill** quartalsweise (Daily-Backup → Staging) + jährlich (Wochen + Storage)
- **RPO** 1h (Pro/Business) / 24h (Trial), **RTO** 4h (Standard) / 2h (Business)

## 10. Security-Hardening

`[SPEZIFIZIERT 2026-05-06]` — wird in Phase 0 + Phase 3 implementiert:

| Bereich | Maßnahme |
|---|---|
| **URL-Escaping** | alle User-Input-Pfade serverside escapen, kein direktes Echo in HTML/SQL |
| **Auth-Check** | JWT-Validation in Middleware für alle `/api/`-Endpoints außer öffentliche (Webhooks, Public-API) |
| **CSRF-Schutz** | Next.js Server Actions haben built-in CSRF, Route Handlers brauchen explizit Token-Check |
| **Subdomain-Kollisionen** | Reserve-Liste (admin, portal, app, api, www, mail, etc.) + Auto-Suffix bei Konflikt |
| **Portal-Validation** | Zod-Schema parität zu Fragebogen-Validation (eigene `lib/validation/`) |
| **Cookie-Domain-Scope** | siehe § 6 + `LIVE-COMPLIANCE.md` § 17 Phase-A-Code-Audit |
| **Rate-Limiting** | Cloudflare WAF Rules (Login 5x/Min, Build-Endpoint 3x/30 Tage, Generate-API 10x/Tag pro User) |
| **2FA Admin-Accounts** | **Pflicht** für Inhaber + spätere Mitarbeiter (non-negotiable). TOTP via Supabase Auth Factor-Plugin |
| **2FA Kunden-Accounts** | **Opt-in** im Portal. KMU-Akzeptanz für Pflicht-2FA zu niedrig. Bei sensiblen Branchen (Anwalt, Arzt) prominent empfehlen. Periodischer sanfter Login-Hinweis. |
| **Dependency-Audit** | `npm audit` + Dependabot in GitHub Actions, Critical-Findings blocken Merge |
| **Secret-Management** | nur Cloudflare Workers Secrets (`wrangler secret put`), nie in `.env`-Dateien committen |

---

## Verbindung zu anderen Dokumenten

- `MIGRATION-PLAN.md` — Bau-Reihenfolge
- `LIVE-COMPLIANCE.md` — Subprozessoren, TOMs, Sicherheits-Anforderungen
- `RECIPE-SYSTEM.md` — Code-Architektur für Kundenwebsites
- `OPERATIONS.md` — Runbook bei Incidents

## Verbindung zu Memory

- `project_production_refactor.md` — Hauptquelle für alle Architektur-Entscheidungen
- `project_supabase_rls.md` — RLS-Status
