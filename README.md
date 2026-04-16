# SiteReady Prototyp

AI-generierte Websites für KMU. Kunde fuellt Fragebogen aus → Claude generiert Texte → fertige Website unter `firma.siteready.at`.

## Stack

- **Frontend:** React (Create React App) — [src/App.js](src/App.js)
- **Backend:** Cloudflare Pages Functions — [functions/](functions/)
- **DB:** Supabase (EU Frankfurt)
- **AI:** Claude API (Text-Generierung)
- **Import:** Firecrawl + WebSearch + Jina (Fallback)

## Setup

```bash
npm install
npm run dev          # Frontend auf http://localhost:3000
```

Env-Vars (in Cloudflare Dashboard konfiguriert, nicht im Repo):
- `ANTHROPIC_API_KEY`
- `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`
- `FIRECRAWL_KEY`
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- `ADMIN_SECRET`

## Scripts

| Befehl | Zweck |
|--------|-------|
| `npm run dev` | React Dev-Server |
| `npm run build` | Production Build |
| `npm run format` | Prettier auf src/ + functions/ anwenden |
| `npm run format:check` | Formatierung pruefen (kein Write) |
| `npm run lint` | ESLint auf src/ |
| `npm run test:e2e` | Playwright Tests (headless) |
| `npm run test:e2e:ui` | Playwright Tests (UI Mode) |

## Deployment

Auto-Deploy via Cloudflare Pages bei Push auf `main`. Keine manuellen Schritte noetig.

## Projekt-Struktur

```
src/                    Frontend (React)
functions/api/          Backend Endpoints
functions/templates/    HTML-Template fuer Kunden-Websites
functions/s/            Serve-time Logic pro Kunden-Subdomain
tests/                  Playwright E2E Tests
migrations/             Supabase SQL Migrationen
docs/                   Business-Docs + Design-Mockups (nicht deployt)
scripts/legacy-tests/   Aeltere Node-basierte Test-Scripts
```

## Projektkontext

Vollstaendige Doku im Admin-Portal: https://sitereadyprototype.pages.dev/admin → Tab "Dokumentation".

Regeln fuer Code-Aenderungen siehe [CLAUDE.md](CLAUDE.md).
