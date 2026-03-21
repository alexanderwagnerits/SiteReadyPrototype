# SiteReady.at - Projekt-Briefing

> Dieses Dokument ist die zentrale Referenz fuer den aktuellen Projektstand.
> Lies es IMMER zuerst, bevor du am Code arbeitest.
> Letzte Aktualisierung: 21. Maerz 2026

---

## 1. Was ist SiteReady?

SiteReady.at ist ein vollautomatischer Website-Service fuer Einzelunternehmer und Kleinstbetriebe in Oesterreich. Der Kunde beantwortet einen kurzen Fragebogen und erhaelt eine fertige, SEO-optimierte Mini-Website - inklusive Impressum (ECG) und DSGVO-Erklaerung.

**Kernversprechen:** Kein Builder. Kein Chat. Keine Entscheidungen. Nur ein paar Fragen - fertig.

Es ist KEIN Website-Builder - es ist ein Website-Service. Der Nutzer trifft keine Design-Entscheidungen, er beantwortet nur Fragen.

**Wichtig fuer die Aussenkommunikation:** Keine Erwaehnung von KI, Tools oder Technologie-Stack gegenueber Endkunden. Der Service wirkt als Black Box - Eingabe rein, fertige Website raus.

---

## 2. Zielgruppe

**Primaer (MVP):** Handwerker in Oesterreich
- Elektriker, Installateure, Maler, Tischler, Fliesenleger, etc.
- Werden aktiv lokal auf Google gesucht ("Elektriker Wien 1020")
- Website-Inhalt einfach und vorhersehbar: Leistungen, Oeffnungszeiten, Kontakt, Notdienst
- Marktgroesse: ca. 120.000 aktive Gewerbebetriebe im Handwerk in Oesterreich

**Sekundaer (ab Phase 2):** Kosmetik, Coaches, Aerzte

---

## 3. Aktueller Stand des Prototyps

### Technologie
- **Framework:** React (Create React App) - Produktionsziel ist Nuxt.js, Prototyp laeuft auf React
- **Deployment:** Cloudflare Pages via GitHub Repo (automatisch bei Push auf main)
- **Repo:** github.com/alexanderwagnerits/SiteReadyPrototype
- **Live-URL:** https://sitereadyprototype.pages.dev
- **Admin-URL:** https://sitereadyprototype.pages.dev/admin?key=[REACT_APP_ADMIN_KEY]
- **Alles in einer Datei:** src/App.js (gesamte App inkl. aller Komponenten)

### Projektstruktur
```
/
+-- package.json
+-- .env.local              (lokale Env Vars - nicht im Git)
+-- public/
|   +-- index.html
|   +-- logo.png            (SiteReady Logo - Wortmarke)
|   +-- icon.png            (SiteReady Icon - SR Monogramm)
|   +-- _redirects          (Cloudflare SPA Routing: /* /index.html 200)
+-- src/
|   +-- index.js            (React Root)
|   +-- App.js              (GESAMTE APP - alle Komponenten)
+-- functions/
|   +-- api/
|       +-- import-website.js      (KI Website-Import via Claude)
|       +-- create-checkout.js     (Stripe Checkout Session)
|       +-- get-invoices.js        (Stripe Rechnungen)
|       +-- stripe-webhook.js      (Stripe Payment Confirmation)
|       +-- admin-data.js          (Admin: alle Orders + Tickets laden)
|       +-- admin-update.js        (Admin: Order/Ticket Status aendern)
|       +-- admin-system.js        (Admin: API Health Monitoring)
+-- docs/
|   +-- BRIEFING.md         (dieses Dokument)
```

### App-Routen (URL Routing via window.history.pushState)
| URL | Seite |
|---|---|
| `/` | LandingPage |
| `/start` | Questionnaire (Fragebogen) |
| `/bestellung` | SuccessPage (Bestelluebersicht) |
| `/login` | PortalLogin |
| `/portal` | Self-Service-Portal |
| `/admin?key=...` | Admin Dashboard |

---

## 4. App-Architektur (Komponenten in App.js)

### 4.1 LandingPage
- Bitpanda-inspiriertes Premium-Design, heller Hintergrund
- Split-Hero: Text links, Browser-Mockup rechts
- Feature-Badges: Live-Vorschau, Impressum ECG, DSGVO, SEO, SSL, Self-Service-Portal, etc.
- Sektionen: Hero, Problem, How-it-works (5 Schritte), Design-Varianten, Pricing, Vergleich, Why-Now, CTA
- Vollstaendig responsive (CSS Media Queries, Breakpoints 960px + 560px)
- Button "Jetzt starten" -> /start, Button "Portal" -> /login

### 4.2 Questionnaire (Fragebogen)
Links: Formular mit Website-Import + 5 Schritte. Rechts: Live-Preview der Kunden-Website.

**Schritt 0: Website-Import (optional)**
- Kunde gibt bestehende Website-URL ein
- System ladt Seite via direkten Fetch + Jina AI Fallback
- Claude AI (claude-haiku) extrahiert strukturierte Daten
- Befuellt alle Felder automatisch vor (inkl. Unternehmensform, UID, Bundesland)
- Zwei Hinweis-Boxen: Datenschutz + "Daten pruefen"
- Button "Ohne Import starten" ueberspringt diesen Schritt

**Schritt 1: Grunddaten (01)**
- Firmenname
- Branche (Dropdown mit Handwerksbranchen)
- Kurzbeschreibung (optional)
- Bundesland (setzt Einsatzgebiet automatisch)

**Schritt 2: Leistungen (02)**
- Branchenspezifische Leistungen als Checklist
- Freitext fuer zusaetzliche Leistungen
- 24h Notdienst Toggle

**Schritt 3: Kontakt (03)**
- Strasse & Hausnummer, PLZ, Ort
- Telefon, E-Mail
- Oeffnungszeiten (Dropdown + Custom)

**Schritt 4: Unternehmen (04)** ← NEU
- Unternehmensform (Dropdown: e.U., GmbH, OG, KG, AG, Verein, GesbR, etc.)
- UID-Nummer / ATU (optional)
- Firmenbuchnummer (optional)
- Firmenbuchgericht (optional)
- GISA-Zahl (optional)
- Hinweis: alle Felder werden automatisch ins Impressum eingebaut (ECG-konform)

**Schritt 5: Design (05)**
- Stilauswahl: Professionell / Modern / Bodenstaendig
- Wird pro Branche automatisch vorgeschlagen
- Fotos-Toggle: eigene Fotos nach Kauf hochladbar

### 4.3 Preview (Kunden-Website Vorschau)
- Wird in Echtzeit aus den Formular-Daten gerendert
- Eigenes Design-System (STYLES_MAP) - NICHT aendern ohne Absprache
- 3 Varianten: Professional (Blau), Modern (Gruen), Traditional (Warm)
- Foto-Platzhalter (Hero, Galerie, Teamfoto) wenn Fotos-Toggle aktiv
- **Impressum-Footer:** zeigt Unternehmensform, UID, Firmenbuchnummer, GISA wenn vorhanden

### 4.4 SuccessPage (Bestelluebersicht VOR Bezahlung)
- Zeigt Paket, Preis (EUR 18/Monat), enthaltene Features
- Button "Jetzt kaufen" -> speichert Order in Supabase -> Stripe Checkout
- Email wird in localStorage gespeichert fuer Post-Payment Account-Erstellung
- "Zurueck zur Vorschau" Button

### 4.5 PortalLogin
- Tabs: Anmelden / Registrieren
- Supabase Auth (signInWithPassword / signUp)
- Email wird bei Registrierung aus localStorage vorausgefuellt (nach Zahlung)
- **Passwort vergessen:** vollstaendiger Flow mit Reset-Link via E-Mail
- Nach Login -> automatisch /portal

### 4.6 Portal (Self-Service-Portal)
6 Tabs:

**Meine Website**
- Abschnitte: Grunddaten, Unternehmen & Impressum, Kontakt & Adresse, Leistungen, Design
- Jeder Abschnitt einzeln editierbar (Bearbeiten/Speichern/Abbrechen)
- Daten werden aus Supabase `orders` Tabelle geladen (nach Email des eingeloggten Users)

**Logo & Fotos**
- 5 Upload-Slots: Logo, Hero-Foto, Galerie Foto 1, Galerie Foto 2, Teamfoto
- Upload zu Supabase Storage (Bucket: customer-assets, Ordner: user-id/)
- Bereits hochgeladene Bilder werden beim Laden automatisch angezeigt
- Max 5 MB, JPG/PNG/WebP/GIF

**Custom Domain**
- DNS-Informationen (CNAME/A-Record) fuer eigene Domain
- Erklaerung wie Domain verbunden wird

**Rechnungen**
- Stripe Zahlungshistorie via /api/get-invoices
- Beleg-Links direkt zu Stripe

**Support**
- FAQ (5 haeufige Fragen, aufklappbar)
- Support-Formular speichert in Supabase `support_requests` Tabelle
- E-Mail + Betreff + Nachricht

**Mein Account**
- E-Mail-Adresse anzeigen
- Passwort aendern (supabase.auth.updateUser)
- Kuendigungsinfo

### 4.7 Post-Payment Flow
Nach Stripe-Weiterleitung mit `?payment=success`:
- Gruener Check-Screen mit Danke-Nachricht
- **Zwei Buttons:** "Jetzt Konto erstellen" + "Bereits registriert? Anmelden"
- Email aus localStorage vorausgefuellt
- Bei Abbruch (`?payment=canceled`): Hinweis mit Zurueck-Button

### 4.8 Admin Dashboard
Erreichbar unter `/admin?key=[REACT_APP_ADMIN_KEY]` (nur fuer Alexander Wagner).

**Tab: Bestellungen**
- Tabelle aller Orders mit Filter (Alle / Neu / Bezahlt / In Arbeit / Review / Live)
- Status per Ein-Klick zur naechsten Stufe aendern
- Detail-Drawer rechts: alle Kundendaten, alle Status-Optionen, interne Notiz

**Tab: Entwicklung (Kanban)**
- 4 Spalten: Bezahlt / In Arbeit / Review / Live
- Order-Karten mit "Weiter"-Button zum naechsten Status
- Klick auf Karte oeffnet Detail-Drawer

**Tab: Health**
- Alle Orders mit URL-Check (fetch no-cors)
- HTTP-Status + SSL-Status pro Website
- "Pruefen" pro Zeile, "Alle pruefen" Button

**Tab: Support**
- Alle Support-Anfragen aus dem Kunden-Portal
- Status: Offen / Beantwortet
- "Als beantwortet markieren" Button

**Tab: APIs (Monitoring)**
- Automatischer Check beim Tab-Oeffnen
- Auto-Refresh alle 60 Sekunden
- Zeitstempel des letzten Checks
- Checks: Supabase (DB + Latenz), Stripe (API + Modus), Anthropic (Claude API)
- Environment Variables Uebersicht (alle 7 benoetigten Vars, gruen/rot)

---

## 5. Datenbank (Supabase)

### Projekt
- **URL:** https://brulvtqeazkgcxkimdve.supabase.co
- **Region:** EU Frankfurt
- **RLS:** aktiv auf allen Tabellen

### Tabelle: orders
Wird beim Klick auf "Jetzt kaufen" in der SuccessPage angelegt.

| Spalte | Typ | Beschreibung |
|---|---|---|
| id | uuid | Client-seitig generiert (crypto.randomUUID()) |
| firmenname | text | |
| branche | text | Branche-Key |
| branche_label | text | Lesbarer Branche-Name |
| kurzbeschreibung | text | |
| bundesland | text | Bundesland-Key |
| leistungen | text[] | Array der Leistungen |
| extra_leistung | text | Zusatzleistungen (Freitext) |
| notdienst | boolean | 24h Notdienst |
| adresse | text | Strasse & Hausnummer |
| plz | text | |
| ort | text | |
| telefon | text | |
| email | text | Kunden-Email |
| uid_nummer | text | UID/ATU |
| unternehmensform | text | z.B. "gmbh", "eu" |
| firmenbuchnummer | text | z.B. "FN 123456 a" |
| gisazahl | text | GISA-Zahl |
| firmenbuchgericht | text | z.B. "HG Wien" |
| oeffnungszeiten | text | Dropdown-Key |
| oeffnungszeiten_custom | text | Freitext wenn custom |
| einsatzgebiet | text | z.B. "Wien & Umgebung" |
| stil | text | "professional"/"modern"/"traditional" |
| fotos | boolean | Fotos gewuenscht |
| subdomain | text | z.B. "mueller-gmbh" |
| status | text | pending/paid/in_arbeit/review/live |
| notiz | text | Interne Admin-Notiz |
| created_at | timestamptz | |

**RLS Policies:**
- INSERT: anon (anonyme Inserts erlaubt)
- SELECT: authenticated (eingeloggte User sehen eigene Orders via email-Filter)
- UPDATE: authenticated

### Tabelle: support_requests
Wird beim Support-Formular im Portal gespeichert.

| Spalte | Typ | Beschreibung |
|---|---|---|
| id | uuid | auto-generiert |
| email | text | Kunden-Email |
| subject | text | Betreff |
| message | text | Nachricht |
| status | text | "offen" / "beantwortet" |
| created_at | timestamptz | |

### Storage: customer-assets
- **Bucket:** customer-assets (public)
- **Struktur:** `{user-id}/{key}.{ext}` (z.B. `abc123/logo.png`)
- **Keys:** logo, hero, foto1, foto2, team
- **Max Groesse:** 5 MB
- **Formate:** JPG, PNG, WebP, GIF
- **RLS:** authenticated Upload in eigenen Ordner, public Read

### Status-Pipeline (orders.status)
```
pending -> paid -> in_arbeit -> review -> live
```
- `pending`: Bestellung angelegt, noch nicht bezahlt
- `paid`: Stripe Webhook hat Zahlung bestaetigt
- `in_arbeit`: Website wird gebaut (Admin setzt manuell)
- `review`: Website fertig, wird intern geprueft (Admin setzt manuell)
- `live`: Website ist live (Admin setzt manuell)

---

## 6. Cloudflare Pages Functions (Backend API)

Alle Functions liegen in `functions/api/` und sind unter `/api/...` erreichbar.

### /api/import-website (POST)
KI-gestuetzte Website-Daten-Extraktion.
- Laedt Seite direkt via fetch (Browser User-Agent)
- Fallback: Jina AI Reader (https://r.jina.ai/) fuer JS-gerenderte Seiten
- Schickt ersten 4000 Zeichen an Claude (claude-haiku-4-5-20251001)
- Claude extrahiert: firmenname, telefon, email, plz, ort, adresse, kurzbeschreibung, bundesland, unternehmensform, uid, firmenbuchnummer, firmenbuchgericht, gisazahl
- Env Vars: `ANTHROPIC_API_KEY`

### /api/create-checkout (POST)
Erstellt Stripe Checkout Session.
- Parameter: orderId, firmenname, email
- Erstellt Session mit 1 Monat EUR 18 (mode: payment)
- metadata[order_id] fuer Webhook-Zuordnung
- success_url + cancel_url mit payment-Status-Param
- Env Vars: `STRIPE_SECRET_KEY`, `SITE_URL`

### /api/get-invoices (GET)
Ladet Stripe Zahlungshistorie fuer einen Kunden.
- Parameter: email (Query-String)
- Sucht Stripe Customer by Email, gibt Charges zurueck
- Env Vars: `STRIPE_SECRET_KEY`

### /api/stripe-webhook (POST)
Empfaengt Stripe Webhooks.
- Event: `checkout.session.completed`
- Liest order_id aus session.metadata
- Setzt orders.status = "paid" in Supabase
- Signatur-Verifikation optional (HMAC-SHA256)
- Env Vars: `STRIPE_WEBHOOK_SECRET` (optional), `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`

### /api/admin-data (GET)
Laedt alle Orders und Support-Tickets fuer Admin Dashboard.
- Parameter: key (Query-String, muss ADMIN_SECRET entsprechen)
- Nutzt Supabase Service Key (bypasses RLS)
- Env Vars: `ADMIN_SECRET`, `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`

### /api/admin-update (POST)
Aktualisiert Order oder Support-Ticket.
- Body: {id, table (optional, default "orders"), ...fields}
- Parameter: key (Query-String)
- Env Vars: `ADMIN_SECRET`, `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`

### /api/admin-system (GET)
API Health Check fuer Admin Monitoring.
- Prueft: Supabase (SELECT mit Latenz), Stripe (balance endpoint), Anthropic (models endpoint)
- Prueft alle Environment Variables auf Vorhandensein
- Parameter: key (Query-String)
- Env Vars: alle relevanten Keys

---

## 7. Environment Variables

### Cloudflare Pages (Produktion)
| Variable | Beschreibung |
|---|---|
| `REACT_APP_SUPABASE_URL` | Supabase Projekt-URL |
| `REACT_APP_SUPABASE_ANON_KEY` | Supabase Publishable Key (fuer React App) |
| `SUPABASE_URL` | Supabase Projekt-URL (fuer Functions) |
| `SUPABASE_SERVICE_KEY` | Supabase Secret Key (bypasses RLS) |
| `STRIPE_SECRET_KEY` | Stripe Secret Key (sk_test_... oder sk_live_...) |
| `STRIPE_WEBHOOK_SECRET` | Stripe Webhook Signing Secret (whsec_...) |
| `ANTHROPIC_API_KEY` | Claude API Key |
| `ADMIN_SECRET` | Admin Dashboard Key (gleicher Wert wie REACT_APP_ADMIN_KEY) |
| `REACT_APP_ADMIN_KEY` | Admin URL-Key (wird in React-Bundle gebacken) |
| `SITE_URL` | Vollstaendige Live-URL (fuer Stripe Redirects) |

### Lokal (.env.local - nicht im Git)
Gleiche Variablen wie oben, zusaetzlich:
- `REACT_APP_PUBLISHABLE_KEY` (Stripe PK fuer lokale Tests, falls benoetigt)

---

## 8. Geschaeftsmodell

### Pricing (ENTSCHIEDEN: Variante A)
| | SiteReady Standard |
|---|---|
| Setup | Keine |
| Monatspreis | EUR 18 |
| Mindestlaufzeit | 12 Monate |
| 1. Jahr | EUR 216 |
| Ab 2. Jahr | EUR 216 |

Auf der Landingpage wird zusaetzlich eine **"SiteReady Premium" Coming-Soon-Card** gezeigt mit Phase-2-Features. Kein Preis angegeben, Button deaktiviert.

### Leistungsumfang (alles inklusive)
- Subdomain (firmenname.siteready.at) sofort live
- Kein Branding auf der Kunden-Website
- Impressum (ECG) - anwaltlich geprueft, ECG-konform
- DSGVO-Erklaerung - anwaltlich geprueft
- SEO Meta-Tags + Schema.org Markup
- Google Search Console Indexierung
- Notdienst/24h Badge
- Live-Vorschau vor Bezahlung
- 3 automatische Design-Varianten
- Website-Import (KI-gestuetzt)
- Self-Service-Portal (Logo, Fotos, Daten, Domain)

---

## 9. Design-System

### SiteReady UI (Landing, Fragebogen-Shell, Success, Portal)
- Helles Premium-Theme (NICHT Dark)
- Font: DM Sans (Primaer), JetBrains Mono (Zahlen/Code)
- Design-Tokens in `const T = {...}` in App.js
- Split-Layouts statt zentrierter Bloecke
- Responsive: CSS Media Queries in `css` Konstante
  - Breakpoint 960px: Grids stapeln
  - Breakpoint 560px: Kompaktes Mobile-Layout
- CSS-Klassen-Konvention: `lp-*` fuer LandingPage, `sp-*` fuer SuccessPage

### Kunden-Website-Preview (NICHT aendern ohne Absprache)
- Eigenes Design-System: `STYLES_MAP` Konstante
- 3 Varianten: Professional (Blau), Modern (Gruen), Traditional (Warm)
- Jede Variante hat eigene Farben, Fonts, Border-Radii, Schatten
- Foto-Platzhalter passen sich dem Stil an
- Impressum-Footer zeigt rechtliche Daten wenn vorhanden

### Konstanten (NICHT aendern ohne Absprache)
- `BRANCHEN`: Branchenliste mit Leistungen und Stil-Vorschlag
- `STYLES_MAP`: 3 Design-Varianten der Kunden-Website
- `INIT`: Initialer Formular-Zustand
- `BUNDESLAENDER`: Oesterreichische Bundeslaender
- `UNTERNEHMENSFORMEN`: Oesterreichische Rechtsformen
- `OEFFNUNGSZEITEN`: Vordefinierte Oeffnungszeiten-Optionen

---

## 10. Bekannte Probleme / Technische Schulden

1. Gesamte App in einer Datei (App.js ~1000+ Zeilen) - sollte in Komponenten aufgeteilt werden
2. React statt Nuxt.js - Prototyp laeuft auf CRA, Ziel ist Nuxt.js
3. Keine Umlaute im JS-Code - wegen Build-Problemen ae/oe/ue/ss verwenden (ASCII only in Strings)
4. Inline Styles gemischt mit CSS-Klassen - kein CSS-Framework
5. Kein State Management - einfacher useState
6. Keine Tests
7. Stripe Webhook Signaturpruefung aktuell optional (Fallback ohne Verifikation)
8. Admin Dashboard Key wird in React-Bundle gebacken (nicht ideal fuer Production)
9. Health Check via fetch no-cors kann keine genauen HTTP-Status-Codes lesen

---

## 11. Offene Punkte / Naechste Schritte

### Sofort
- Anthropic Credits aufgeladen (done) - Import-Funktion testen
- Stripe Webhook testen mit echter Zahlung (Testkarte 4242 4242 4242 4242)

### Kurzfristig
- Subdomain-Aktivierung: generierte Subdomain muss tatsaechlich eingerichtet werden
- Echte Text-Generierung nach Bezahlung implementieren
- E-Mail-Bestaetigung nach Kauf (Supabase Auth oder eigener SMTP)
- Impressum/DSGVO-Templates mit Anwalt erarbeiten

### Mittelfristig
- 10-20 Pilot-Kunden akquirieren
- Qualitaetssicherung der KI-Extraktion verbessern
- Stock-Foto-Integration (Unsplash API oder eigene Sammlung)
- Custom Domain tatsaechlich aktivieren (Cloudflare DNS API)
- Nuxt.js Migration planen

### Business
- Endgueltige Preisstruktur nach Pilotphase evaluieren
- Kuendigungshandling nach 12 Monaten definieren
- Support-Prozess definieren (48h Antwortzeit via support@siteready.at)

---

## 12. Go-to-Market

1. Pilotphase: 10-20 Kunden aus persoenlichem Netzwerk
2. Skalierung auf 100: Kaltakquise, Kooperationen (WKO), digitale Kampagnen
3. Foerderungen: aws, WKO, EU-Fonds (EFRE)

---

## 13. Referenz-Dokumente

- SiteReady_Pitch_v9.docx - Aktuelles Pitch-Dokument
- SiteReady_Architektur.pdf - Technischer Architektur-Flow
- SiteReady_Logos.zip - Logo-Assets

---

*Bei Widerspruechen zwischen diesem Dokument und dem Code gilt der Code als aktueller Stand. Dieses Dokument beschreibt die Intention und den Kontext.*
