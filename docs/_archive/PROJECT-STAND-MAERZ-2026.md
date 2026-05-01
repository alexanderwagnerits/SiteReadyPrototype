> **ARCHIV — Snapshot der Supabase-Doku vom 26. März 2026.**
>
> Diese Doku ist überholt durch:
> - docs/LIVE-COMPLIANCE.md (Recht / Compliance)
> - docs/RECIPE-SYSTEM.md (Kundenseiten-Architektur)
> - docs/PRODUCT.md, docs/ARCHITECTURE.md (sobald aktualisiert)
> - Memory-Einträge project_production_refactor.md, project_recipe_system_v1.md
>
> Behalten als Referenz für historischen Stand und Inhalte die noch nicht migriert sind.
>
> **Bekannte Veraltungen:**
> - Brand: SiteReady → instantpage.at (geplant)
> - Pricing: 18 EUR → Starter 16/14 + Professional 29/25 (Memory feedback_preise_plan.md)
> - 3 Stile → Recipe-System v1 mit 4 Themes + 24 Recipes
> - 85 Branchen → 12 Berufsgruppen
> - Anwalt-Strategie: alles ohne Anwalt (siehe docs/LIVE-COMPLIANCE.md)

---

# SiteReady.at — Projektdokumentation

> Zentrale Referenz fuer den aktuellen Projektstand. Zuletzt aktualisiert: 26. Maerz 2026.

---

# PRODUKT & BUSINESS

## Was ist SiteReady?

SiteReady.at ist ein vollautomatischer Website-Service fuer Einzelunternehmer und Kleinstbetriebe in Oesterreich. Der Kunde beantwortet einen kurzen Fragebogen und erhaelt eine fertige, professionelle Website — inklusive Impressum (ECG-konform) und DSGVO-Erklaerung.

**Kernversprechen:** Kein Builder. Kein Chat. Keine Entscheidungen. Nur ein paar Fragen — fertig.

Es ist KEIN Website-Builder, sondern ein Website-Service. Der Nutzer trifft keine Design-Entscheidungen.

> Gegenueber Endkunden: Keine Erwaehnung von KI, Tools oder Technologie-Stack. Der Service wirkt als Black Box — Eingabe rein, fertige Website raus.

## Zielgruppe & Markt

**Primaer (MVP):** Handwerker in Oesterreich (Elektriker, Installateure, Maler, Tischler, Fliesenleger etc.)
- Werden aktiv lokal auf Google gesucht ("Elektriker Wien 1020")
- Marktgroesse: ca. 120.000 aktive Gewerbebetriebe im Handwerk in Oesterreich

**Sekundaer (ab Phase 2):** Kosmetik, Coaches, Aerzte

## Pricing & Abrechnung

| | Monatsabo | Jahresabo |
|---|---|---|
| Preis | EUR 18/Monat | EUR 183.60/Jahr (EUR 15.30/Monat) |
| Rabatt | – | 15% |
| Mindestlaufzeit | Monatlich kuendbar | 12 Monate |
| Trial | 7 Tage kostenlos | 7 Tage kostenlos |

**Abrechnung:** Stripe Subscription. Karte wird erst nach 7 Trial-Tagen belastet. Monatsabo jederzeit kuendbar. Jahresabo: 12 Monate Mindestlaufzeit, dann monatlich kuendbar.

**Trial-Logik:** Bei Stripe Checkout wird trial_period_days uebergeben (verbleibende Tage aus trial_expires_at, mind. 1). Status in orders: trial waehrend Testphase, live nach erster Zahlung.

**Leistungsumfang (alles inklusive):**
- Subdomain sofort live (Prototyp: sitereadyprototype.pages.dev/s/{firma}, Production: {firma}.siteready.at)
- Kein Branding auf der Kunden-Website
- Impressum (ECG) + DSGVO-Erklaerung
- SEO Meta-Tags + Schema.org Markup
- Live-Vorschau vor Bezahlung
- 3 automatische Design-Varianten
- Website-Import (Jina + Claude Haiku)
- Self-Service-Portal (Logo, Fotos, Daten, Domain, Support)
- Galerie aus hochgeladenen Fotos (bis zu 5, serve-time)
- Social Media Links im Footer

## Ruecktrittsrecht & Stornierung

- **14-Tage Ruecktrittsrecht** bei Online-Kauf gesetzlich vorgeschrieben (AT/EU)
- **Ausnahme moeglich** wenn Leistung sofort erbracht wird — mit Anwalt klaeren
- **Stripe erstattet Transaktionsgebuehren NICHT** bei Refunds
- **Verlust pro Stornierung:** ca. EUR 3.70 (Stripe-Gebuehr + Refund-Fee + API-Kosten)
- **TODO:** AGB-Klausel + Widerrufsbelehrung mit Anwalt ausarbeiten

---

# WIE ES FUNKTIONIERT

## Status-Pipeline (vollautomatisch)

```
pending -> trial -> live
```

- **pending:** Fragebogen ausgefuellt + Account erstellt, start-build aufgerufen (Generierung laeuft im Hintergrund)
- **trial:** Website generiert, 7 Tage kostenlos nutzbar (trial_expires_at)
- **live:** Stripe Abo aktiv, erste Zahlung eingegangen (automatisch via stripe-webhook.js)
- **offline:** Admin schaltet Website manuell ab

## Automatisierungen

**Auto-Retry bei Generierung:**
start-build.js versucht die Website-Generierung. Bei Fehler wird automatisch ein 2. Versuch nach 5 Minuten gestartet (via ctx.waitUntil).

**Auto Quality-Check:**
generate-website.js prueft das generierte HTML automatisch nach der Generierung. Geprueft werden: Titel, Meta-Description, OG-Tags, H1, Viewport, Lang-Attribut, Kontaktformular, Impressum-Link, Telefon, E-Mail. Ergebnis: Score 0–100 in orders.quality_score, einzelne Issues in orders.quality_issues (jsonb). Im Admin Dashboard wird ein Alert angezeigt bei Score < 80.

**Auto-Resend Bestaetigungsmail:**
start-build.js prueft nach 10 Minuten ob die E-Mail-Adresse bestaetigt wurde. Falls nicht, wird die Bestaetigungsmail automatisch erneut gesendet (via Supabase Auth resend API).

## Fragebogen (Schritt 0–5)

**Schritt 0: Website-Import (optional)**
- URL-Eingabe -> direkter Fetch + Jina AI Fallback fuer JS-gerenderte Seiten
- Claude Haiku extrahiert: firmenname, telefon, email, adresse, plz, ort, unternehmensform, uid, firmenbuchnummer, kurzbeschreibung
- Felder werden automatisch vorausgefuellt, Kunde kann pruefen und korrigieren

**Schritt 1: Grunddaten** — Firmenname, Branche, Kurzbeschreibung, Bundesland

**Schritt 2: Leistungen** — Branchenspezifische Checklist + Freitext (Komma/Zeilenumbruch -> separate Cards)

**Schritt 3: Kontakt** — Adresse, Telefon, E-Mail, Oeffnungszeiten, Einsatzgebiet

**Schritt 4: Unternehmen** — Unternehmensform (e.U./GmbH/OG/KG/AG/Verein/GesbR), UID, Firmenbuch, GISA, rechtsformspezifische Felder fuer ECG-Impressum

**Schritt 5: Design** — Stilauswahl: Professionell / Modern / Bodenstaendig (wird pro Branche automatisch vorgeschlagen)

## Website-Generierung

**Modell:** claude-sonnet-4-6 (max_tokens: 8192)

**Was Claude generiert:**
- Vollstaendiges HTML mit kompaktem inline CSS
- Platzhalter: `<!-- NAV -->`, `<!-- FOOTER -->`, `<!-- MAPS -->`, `<!-- GALERIE -->`
- Sektionen: Hero, Leistungen-Grid, Ueber-uns, Kontakt
- Branchenspezifische Farbpalette + Stil
- SEO Meta-Tags, Schema.org JSON-LD, robots:noindex (Prototyp-Phase)

**Absolute Pflicht-Regeln fuer Claude:**
- Nur exakt die uebergebenen Leistungen zeigen (keine erfundenen hinzufuegen)
- Keine erfundenen Zahlen, Jahreszahlen oder Statistiken
- Exakt N Leistungs-Cards (nicht mehr, nicht weniger)

**Kosten:** ~EUR 0.12 pro Website (claude-sonnet-4-6, ~8.000 Tokens)

## Re-Generierung (ENTFERNT)

Der "Website neu generieren" Button wurde entfernt. Alle Inhalte (Leistungen, Fotos, Texte, Kontakt) werden serve-time aus der DB injiziert — eine Re-Generierung ist nicht mehr noetig.

- request-regen.js existiert noch auf dem Server, wird aber vom Portal nicht mehr aufgerufen
- Bei Text-/Design-Aenderungen wenden sich Kunden an den Support (48h Umsetzung)
- Kosten fuer Re-Generierungen: EUR 0 (entfaellt komplett)

## Bestaetigungsseite (/bestellung)

Nach Account-Erstellung wird die Bestaetigungsseite angezeigt (kein Redirect zu /portal).

**Inhalte:**
- Hinweis: E-Mail-Adresse bestaetigen, Spam-Ordner pruefen
- Info: Bestaetigungsmail wird nach 10 Min automatisch erneut gesendet (Auto-Resend)
- Buttons: "Zum Login" + "Erneut senden"

**Hintergrund:** Website-Generierung startet sofort via order_id (kein Auth-Token noetig, da nach Erstregistrierung noch kein Token verfuegbar).

## Serve-time Injection

Bei jedem Aufruf von /s/{subdomain} werden Inhalte live aus Supabase injiziert — kein Re-Deploy noetig:

- **Logo:** url_logo -> img-Tag in Nav
- **Galerie:** `<!-- GALERIE -->` -> Grid aus url_foto1–5 (zwischen Ueber-uns und Kontakt)
- **Maps:** `<!-- MAPS -->` -> Google Maps iframe
- **Variablen:** {{FIRMENNAME}}, {{TEL_HREF}}, {{EMAIL}}, {{ADRESSE_VOLL}}, {{OEFFNUNGSZEITEN}}, {{SOCIAL_ICONS}} u.a.
- **Social Icons:** Facebook, Instagram, LinkedIn, TikTok (nur wenn URL hinterlegt)
- **Cache-Control:** public, max-age=60

## Impressum & Datenschutz

- Endpoint: /s/{subdomain}/impressum (und /datenschutz)
- Wird **bei jedem Request frisch aus DB generiert** — kein gespeichertes Template
- ECG-konform, rechtsformspezifisch (e.U./GmbH/OG/KG/AG/Verein/GesbR)
- DSGVO Art.13, Google Fonts SCCs, Cloudflare SCCs

## Kunden-Portal (Self-Service)

**Onboarding-Flow nach Kauf:**
1. Status = paid -> Onboarding-Screen: Fotos hochladen (optional), dann "Website erstellen" klicken
2. Status = in_arbeit -> Ladescreen mit "Status aktualisieren" Button
3. Status = live -> Portal mit allen Tabs freigeschaltet

**Portal-Tabs (Reihenfolge):**
- **Meine Website:** Website-Status (Live-Anzeige, URL, HTTP-Status), Grunddaten, Unternehmen & Impressum (read-only, "Aenderung anfragen"), Kontakt & Adresse, Leistungen (Reihenfolge + Beschreibungen + Zusaetzliche Leistungen), Website-Texte (Ueber uns + Vorteile), Design & Stil (read-only, "Aenderung anfragen"), Social Media
- **Logo & Fotos:** Logo-Upload (Vorschau dunkel+hell), Hero-Bild, bis zu 5 Betriebsfotos (sofort sichtbar, serve-time)
- **SEO & Google:** Google-Indexierungsstatus, Custom Domain & Google Hinweis, Seitenaufrufe & Reichweite (Coming Soon)
- **Custom Domain:** DNS-Anleitung (CNAME)
- **Rechnungen:** Stripe Zahlungshistorie
- **Mein Account:** Account-Daten (E-Mail, Mitglied seit), Abonnement-Details (Paket, Preis, Laufzeit, Gestartet am, Mindestende), Passwort aendern, E-Mail-Adresse aendern, Kuendigung
- **Support:** Haeufige Fragen + Support-Formular

**Unternehmen & Impressum:** Read-only im Self-Service. Aenderungen werden ueber Support angefragt (48h Umsetzung, da rechtlich relevant).

**Design & Stil:** Read-only im Self-Service. Aenderungen werden ueber Support angefragt (48h Umsetzung, komplettes Redesign).

**Statistiken-Tab:** Wurde entfernt. Inhalte verteilt auf: Website-Status -> Meine Website, Abonnement -> Mein Account, Seitenaufrufe -> SEO & Google.

**PortalLogin:**
- "Email not confirmed" Fehler wird abgefangen und als deutsche Meldung angezeigt
- "Bestätigungsmail erneut senden" Button direkt in der Fehlermeldung integriert

> Alle Inhalte (Fotos, Leistungen, Texte, Kontakt) erscheinen sofort ohne Re-Generierung (serve-time).

---

# TECHNISCHE ARCHITEKTUR

## Tech Stack

| Schicht | Technologie |
|---|---|
| Frontend | React (Create React App) — alles in src/App.js |
| Hosting | Cloudflare Pages (automatisches Deploy via GitHub Push) |
| Backend | Cloudflare Pages Functions (functions/api/*.js) |
| Datenbank | Supabase PostgreSQL |
| Auth | Supabase Auth |
| Storage | Supabase Storage (Bucket: customer-assets) |
| Zahlung | Stripe Checkout + Webhooks |
| KI Generierung | claude-sonnet-4-6 |
| KI Import | claude-haiku-4-5-20251001 |
| DNS | Cloudflare |

**Repository:** github.com/alexanderwagnerits/SiteReadyPrototype
**Live-URL:** https://sitereadyprototype.pages.dev
**Admin-URL:** https://sitereadyprototype.pages.dev/admin?key=[ADMIN_KEY]

## Projektstruktur

```
/
+-- src/App.js                        (GESAMTE APP ~2400 Zeilen)
+-- public/
|   +-- logo.png                      (SiteReady Wortmarke)
|   +-- icon.png                      (SR Monogramm)
+-- functions/
|   +-- api/
|       +-- import-website.js         (Jina + Claude Haiku)
|       +-- create-checkout.js        (Stripe Checkout Session)
|       +-- get-invoices.js           (Stripe Rechnungshistorie)
|       +-- stripe-webhook.js         (Payment -> status: paid)
|       +-- start-build.js            (Kunde startet Bau)
|       +-- generate-website.js       (Claude -> HTML -> status: live)
|       +-- request-regen.js          (Leistungen neu generieren)
|       +-- admin-data.js             (Admin: alle Orders + Tickets)
|       +-- admin-update.js           (Admin: Felder bearbeiten)
|       +-- admin-delete.js           (Admin: Order + Storage loeschen)
|       +-- admin-system.js           (Admin: Health Check)
|       +-- admin-docs.js             (Admin: Dokumentation CRUD)
|       +-- log-activity.js           (Admin: Aktivitaetslog GET/POST)
|       +-- billing-portal.js         (Stripe Billing Portal Session)
|   +-- s/
|       +-- [subdomain]/index.js      (Kunden-Website serve-time)
|       +-- [subdomain]/legal.js      (Impressum + Datenschutz)
|       +-- [subdomain]/impressum.js  (Redirect -> legal.js)
|       +-- [subdomain]/datenschutz.js(Redirect -> legal.js)
```

## App-Routen

| URL | Seite |
|---|---|
| / | LandingPage |
| /start | Fragebogen + Live-Preview |
| /bestellung | Bestaetigungsseite (nach Account-Erstellung) |
| /login | PortalLogin (mit "Email not confirmed" Behandlung) |
| /portal | Self-Service-Portal |
| /admin?key=... | Admin Dashboard |
| /s/{subdomain} | Kunden-Website (serve-time) |
| /s/{subdomain}/impressum | Impressum + Datenschutz |

## API Endpoints

| Endpoint | Auth | Beschreibung |
|---|---|---|
| POST /api/import-website | – | Jina + Haiku: Daten aus bestehender Website |
| POST /api/create-checkout | – | Stripe Checkout Session |
| GET /api/get-invoices | – | Stripe Zahlungshistorie per Email |
| POST /api/stripe-webhook | Stripe-Signatur | Payment -> status: paid |
| POST /api/start-build | Supabase JWT ODER order_id im Body | Bau starten + generate im HG (order_id Fallback fuer Erstregistrierung ohne Token) |
| POST /api/generate-website | ADMIN_SECRET | Claude HTML -> status: live |
| POST /api/request-regen | Supabase JWT | NICHT MEHR GENUTZT — Re-Generierung aus Portal entfernt |
| GET /api/admin-data | ADMIN_SECRET | Alle Orders + Support-Tickets |
| POST /api/admin-update | ADMIN_SECRET | Felder aktualisieren |
| POST /api/admin-delete | ADMIN_SECRET | Order + User + Storage loeschen |
| GET /api/admin-system | ADMIN_SECRET | API Health + Env Vars |
| GET/POST/DELETE /api/admin-docs | ADMIN_SECRET | Dokumentation CRUD |
| GET/POST /api/log-activity | ADMIN_SECRET | Aktivitaetslog lesen/schreiben |
| POST /api/billing-portal | ADMIN_SECRET | Stripe Billing Portal Session |

## Datenbank (Supabase)

**Projekt-URL:** https://brulvtqeazkgcxkimdve.supabase.co

### Tabelle: orders (Kerntabelle)

| Spalte | Beschreibung |
|---|---|
| id | UUID (client-seitig generiert) |
| user_id | Supabase Auth User ID |
| firmenname, vorname, nachname | Basisdaten |
| branche, branche_label | Branche-Key + Anzeigename |
| kurzbeschreibung | Hero + Footer + Meta-Description |
| bundesland, einsatzgebiet | Standort |
| leistungen | text[] — ausgewaehlte Leistungen |
| extra_leistung | Freitext (Komma/Zeilenumbruch -> separate Cards) |
| notdienst, meisterbetrieb, kostenvoranschlag | Service-Badges |
| buchungslink, hausbesuche, terminvereinbarung | Service-Features |
| adresse, plz, ort, telefon, email | Kontaktdaten |
| oeffnungszeiten, oeffnungszeiten_custom | Oeffnungszeiten |
| unternehmensform | e.U./GmbH/OG/KG/AG/Verein/GesbR/Einzelunternehmen |
| uid_nummer, firmenbuchnummer, firmenbuchgericht, gisazahl | Firmenbuch |
| geschaeftsfuehrer, vorstand, aufsichtsrat | Fuer GmbH/AG |
| zvr_zahl, gesellschafter | Fuer Verein/GesbR |
| unternehmensgegenstand, liquidation | Sonderfaelle |
| kammer_berufsrecht, aufsichtsbehoerde | Berufsrecht |
| facebook, instagram, linkedin, tiktok | Social Media |
| stil | "professional" / "modern" / "traditional" |
| subdomain | URL-Slug (z.B. mueller-gmbh) |
| status | pending / paid / in_arbeit / live / offline |
| notiz | Interne Admin-Notiz |
| url_logo, url_foto1–url_foto5 | Supabase Storage URLs |
| website_html | Generiertes HTML |
| tokens_in, tokens_out, cost_eur | Claude Kosten-Tracking |
| last_error | Letzter API-Fehler |
| regen_requested, last_regen_at, prev_regen_at | Re-Generierung Tracking |
| trial_expires_at | Ablaufdatum der Testphase (Fallback: created_at + 7 Tage) |
| subscription_plan | "monthly" oder "yearly" |
| leistungen_beschreibungen | jsonb — Map {leistungsname: beschreibung} fuer Leistungs-Cards |
| quality_score | Auto Quality-Check Score 0–100 |
| quality_issues | jsonb — Array von Quality-Issue-Strings |
| created_at | Bestelldatum |

### Tabelle: support_requests
Kunden-Anfragen: id, email, subject, message, status (offen/beantwortet), created_at

### Tabelle: activity_log
Aktivitaetslog pro Kunde. Felder:
- id (UUID), order_id (FK -> orders, CASCADE), action (text), details (jsonb), actor (text, default: admin), created_at (timestamptz)
- Index auf (order_id, created_at DESC)
- Geloggte Aktionen: website_generated, website_regenerated, offline, online, status_changed, subdomain_changed, stil_changed, trial_extended, checkout_completed, payment_succeeded, payment_failed, subscription_canceled
- actor: "admin" (Portal) oder "system" (Stripe Webhook)

### Tabelle: docs
Editierbare Projektdokumentation: id, title, content (Markdown), sort_order, updated_at

## Supabase Storage

**Bucket:** customer-assets (public)

| Datei | Pfad | Beschreibung |
|---|---|---|
| Logo | {user-id}/logo.{ext} | PNG empfohlen (transparent, 400x150px+) |
| Hero-Foto | {user-id}/foto1.{ext} | Erstes Betriebsfoto |
| Fotos 2–5 | {user-id}/foto2–5.{ext} | Weitere Betriebsfotos |

- Max. 5 MB pro Datei, JPG/PNG/WebP/GIF
- RLS: authenticated Upload in eigenen Ordner, public Read
- Fotos erscheinen sofort (serve-time), kein Re-Deploy noetig

## Environment Variables (Cloudflare Pages)

| Variable | Beschreibung |
|---|---|
| REACT_APP_SUPABASE_URL | Supabase URL (in React-Bundle) |
| REACT_APP_SUPABASE_ANON_KEY | Supabase Anon Key |
| REACT_APP_ADMIN_KEY | Admin Dashboard URL-Key |
| SUPABASE_URL | Supabase URL (Functions, serverseitig) |
| SUPABASE_SERVICE_KEY | Service Key — bypasses RLS |
| STRIPE_SECRET_KEY | Stripe Secret Key |
| STRIPE_WEBHOOK_SECRET | Stripe Webhook Signing Secret |
| ANTHROPIC_API_KEY | Claude API Key |
| ADMIN_SECRET | Admin Key (gleich wie REACT_APP_ADMIN_KEY) |
| SITE_URL | Live-URL fuer Stripe Redirects |

## Design-System

**SiteReady UI (Landing, Fragebogen, Portal, Admin):**
- Helles Premium-Theme, Font: DM Sans, Zahlen: JetBrains Mono
- Design-Tokens in `const T = {...}` in App.js

**Kunden-Website (NICHT aendern ohne Absprache):**
- Eigenes Design-System: STYLES_MAP Konstante
- 3 Varianten: Professional (Navy/Gold), Modern (Lila/Petrol), Traditional (Warm/Braun)

**Geschuetzte Konstanten (NICHT aendern ohne Absprache):**
- BRANCHEN — Branchenliste mit Leistungen + Stil-Vorschlag
- STYLES_MAP — 3 Design-Varianten der Kunden-Website
- INIT — Initialer Formular-Zustand
- PALETTES — Branchenspezifische Farbpaletten fuer Claude

## KI-Modelle

| Einsatz | Modell | Kosten |
|---|---|---|
| Website-Generierung | claude-sonnet-4-6 | ~EUR 0.12/Website |
| Website-Import Extraktion | claude-haiku-4-5-20251001 | ~EUR 0.001/Import |
| Entwicklungs-Tool | claude-sonnet-4-6 (Claude Code) | – |

> TODO Live-Launch: Evaluieren ob claude-opus-4-6 fuer Generierung bessere Qualitaet liefert.

---

# ADMIN & OPERATIONS

## Admin Dashboard

Erreichbar unter /admin?key=[ADMIN_KEY]

**Tab-Reihenfolge:** Start — Sites — Support — Finanzen — System — Dokumentation

| Tab | Inhalt |
|---|---|
| Start | KPI-Karten, Alerts, ablaufende Trials, Fehler-Queue, Schnellzugriff |
| Sites | Alle Kunden-Websites mit Filter/Suche/CSV-Export |
| Support | Kunden-Anfragen mit Kunden-Badge, manuelle Ticket-Erstellung |
| Finanzen | MRR, Stripe-Gebuehren, Token-Verbrauch, Charts |
| System | API Health, Env Vars, externe Service-Status (Anthropic/Cloudflare/Supabase/Stripe) |
| Dokumentation | Editierbares Markdown-Wiki, Export als MD + PDF |

### Sites-Tab
- **Filter-Toolbar:** 3 Dropdowns (Status / Health / Zahlung) + Suchfeld + CSV-Export, alles in einer Zeile
- **Tabelle:** Firma, Status-Badge, Health-Badge, Zahlung, Branche, Stil, Erstellt-Datum, Detail-Button
- **Legende:** Farbige Status-Erklaerung unter der Toolbar

### Detail-Modal (3-Spalten-Layout, 95vw/95vh Fullscreen)

**Spalte 1 — Kundendaten:**
- Bearbeitungsformular mit Pencil-Icon: Firmenname, E-Mail, Telefon, Adresse, PLZ, Ort
- Weitere Infos (read-only): Branche, Rechtsform, Stripe-ID

**Spalte 2 — Website-Management:**
- **Website-Link:** Volle URL mit Copy-Button
- **Health-Check:** Status + Antwortzeit (ms) + "Jetzt pruefen" Button + letzte Check-Zeit + Quality Score
- **Aktionen:** Website generieren/neu generieren, Diagnose, HTML anzeigen, Offline/Online, Kunden loeschen — einheitliches Button-Layout
- **Subdomain & Stil:** Editierbar mit Pencil-Icon, Neugenerierungs-Warnung, Dirty-Check + Speichern/Abbrechen
- **Notfall: Status setzen** (aufklappbar): Manueller Status-Override auf beliebigen Status

**Spalte 3 — Kommunikation & History:**
- **Interne Notiz:** Textarea mit Speichern-Icon
- **Support-Tickets:** Liste der Kunden-Tickets mit Status-Badge, "+ Neu" Button (max 200px scroll)
- **Aktivitaetslog:** Chronologische Liste aller kritischen Aenderungen (Icon + Label + Zeitstempel), Daten aus activity_log Tabelle (max 220px scroll)
- **Backup:** Platzhalter-Card ("Kommt bald")

**Prozess-Timeline (aufklappbar, unten):**
- Full-Width unter den 3 Spalten, Modal scrollt wenn Timeline offen
- Status-Flow, Stripe-Daten, Generierungskosten, Trial-Verlaengerung (+7d/+14d)

**Diagnose-Button:** In der mittleren Spalte (nicht mehr im Modal-Header)

### Admin-Alerts (Start-Tab)
- Abgelaufene Trials (trial_expires_at ueberschritten)
- Live-Orders ohne Subdomain
- Orders mit Fehlern (last_error gesetzt)
- Orders mit Quality Score < 80

### Bestaetigungen (vereinheitlicht)
- **Klick-Bestaetigung:** Offline nehmen, Website neu generieren (Warnung + Bestaetigen-Button)
- **Texteingabe:** Nur "Kunden loeschen" ("LOESCHEN" eintippen, da unwiderruflich)

### Support-Tab
- Ticket-Liste mit Kunden-Badge (klickbar, oeffnet Detail-Modal)
- "+ Ticket erstellen" mit Kunden-Dropdown (nicht Freitext)
- Status: offen / beantwortet

### Aktivitaetslog
- Supabase-Tabelle: activity_log
- CF Function: /api/log-activity (GET zum Laden, POST zum Schreiben)
- Wird automatisch geloggt bei: Website generiert, offline/online, Status-Aenderung, Subdomain/Stil geaendert, Trial verlaengert
- Stripe Webhook loggt: checkout_completed, payment_succeeded, payment_failed, subscription_canceled
- Anzeige: Icon + Label + relative Zeit ("vor 5 Min", "vor 2 Std"), "via Stripe" bei System-Events

---

# AUSBLICK

## Technische Schulden

1. Gesamte App in einer Datei (App.js, ~2400 Zeilen) — sollte aufgeteilt werden
2. React CRA statt Nuxt.js — Prototyp, Ziel ist Nuxt.js fuer Production
3. Keine Umlaute im JS-Code (ae/oe/ue/ss wegen Cloudflare-Build-Encoding)
4. Inline Styles, kein CSS-Framework
5. Kein State Management (einfacher useState)
6. Keine Tests
7. Admin Key wird in React-Bundle gebacken (nicht ideal fuer Production)
8. Health Check via fetch no-cors kann keine genauen HTTP-Status-Codes lesen
9. noindex auf allen Kunden-Websites aktiv (Prototyp-Phase)
10. Stripe Webhook Signatur-Verifikation deaktiviert (Code vorhanden, nur STRIPE_WEBHOOK_SECRET setzen)

## Live-Launch Checklist

**Technisch:**
- [ ] Stripe Webhook Signatur aktivieren (STRIPE_WEBHOOK_SECRET setzen)
- [ ] noindex-Tag entfernen (TODO-Kommentar in index.js vorhanden)
- [ ] siteready.at Wildcard-Subdomain auf Cloudflare einrichten
- [ ] E-Mail-Bestaetigung nach Kauf
- [ ] Custom Domain Cloudflare API Automation
- [ ] Google Search Console API Integration
- [ ] Sitemap.xml Endpoint
- [ ] Model-Upgrade evaluieren: claude-opus-4-6 fuer Generierung?
- [ ] App.js in Komponenten aufteilen (Nuxt.js Migration)

**Business:**
- [ ] AGB + Widerrufsbelehrung mit Anwalt fertigstellen
- [ ] 10–20 Pilot-Kunden aus persoenlichem Netzwerk
- [ ] Preisstruktur nach Pilotphase evaluieren
- [ ] Support-Prozess definieren (48h Antwortzeit via support@siteready.at)
- [ ] Kuendigungshandling nach 12 Monaten definieren
- [ ] Foerderungen pruefen: aws, WKO, EU-Fonds (EFRE)

## Go-to-Market

1. **Pilotphase:** 10–20 Kunden aus persoenlichem Netzwerk
2. **Skalierung auf 100:** Kaltakquise, WKO-Kooperationen, digitale Kampagnen
3. **Foerderungen:** aws, WKO, EU-Fonds (EFRE)

---
## Infos fuer Live Projekt
(Nicht jetzt, jetzt ist ja nur prototyp) diese infos sollen dann vielleicht in die Claude.md geschrieben werden?

1. ganze umgebung muss sicher vor angriffen, ausfallsicher (redundant) und performant aufgebaut sein
2.  die beste sprache/model muss fuer live umsetzung verwendet werden, damit wir das best moegliche ergebnis bekommen koennen.
3. mobiles design hat immer und ueberall prioritaet
4. das jetzige design kommt dem live produkt schon sehr aehnlich. soll aber trotzdem mit einem besseren model (opus 4.6? andere js.?)fuer ein besseres design angepasst werden
5. umlaute von grund auf verhindern dass die falsch angezeigt werden
6. Infrastruktur-Sicherheit & Ausfallsicherheit:
   - Cloudflare Pro: WAF, DDoS-Schutz, Rate Limiting, SSL
   - Supabase: Row Level Security, taegliche Backups,
     Service Key nur serverseitig
   - Stripe: PCI DSS zertifiziert, Webhook-Signaturpruefung
   - Admin Dashboard: serverseitige Auth
     (Key nicht mehr im React-Bundle)
   - Kunden-Websites am Cloudflare Edge gecacht
     (Kurze DB-Ausfaelle nicht sichtbar)
   - Regelmaessige manuelle DB-Exports als Notfall-Backup
   - Spaeter: Read Replicas oder Cloudflare KV als Fallback

7. Security TODO vor Go-Live:
   - Security Audit durch externe Firma
   - Stripe Webhook Signatur aktivieren
   - Admin Key aus React-Bundle entfernen
   - Backup-Konzept dokumentieren
   - Notfallplan bei Ausfall
   - DSGVO-Loeschkonzept
   - DPA abschließen mit Serviceanbietern (Superbase,            Cloudflare,..)
8. in der live umgebng soll niergends ein falschger status fuer irghendwas angezeigt werden wie zb (indexierung live, custoom domain verbunden, usw...) alle statusfelder muessen live sein
9. Upgrades fuer das Live-Produkt:
   Code:
   - TypeScript statt JavaScript (weniger Bugs)
   - Tailwind CSS statt Inline CSS (wartbarer, responsive)
   - App.js aufteilen in Komponenten (nicht 1 Datei mit 2200 Zeilen)
   - Vite oder Next.js statt Create React App (schneller, moderner)
   KI-Modelle:
   - Claude Code Entwicklung: opusplan als Standard 
     (Opus plant Architektur, Sonnet schreibt Code)
   - API Website-Generierung: immer neuestes Sonnet 
     (ca. EUR 0.12 pro Website)
   - API Website-Import: Haiku (ca. EUR 0.001)
   - Opus nur fuer Prompt-Entwicklung, nicht Ausfuehrung
   - Regel: Opus entwickelt den Prompt, Sonnet fuehrt ihn aus
   Nicht aendern:
   - Cloudflare Pages + Workers bleibt
   - Supabase bleibt (oder Cloudflare, spaeter entscheiden)
   - Stripe bleibt
10. Environments
    Lokal (Dev):
    - Eigener Laptop, localhost
    - Entwicklung und erste Tests

    Staging:
    - Cloudflare Pages: staging Branch → eigene URL
    - Supabase: eigenes Projekt (Free Plan, EUR 0)
    - Stripe: Test-Modus (sk_test_...)
    - Letzte Pruefung vor Live

    Production:
    - Cloudflare Pages: main Branch → siteready.at
    - Supabase: eigenes Projekt (Pro Plan, EUR 25/Mo)
    - Stripe: Live-Modus (sk_live_...)
    - Echte Kunden
11. SEO
Das Live-Produkt muss eine vollstaendige SEO- und SEA-Strategie 
enthalten: Alle generierten Websites muessen automatisch mit 
bestmoeglicher lokaler Suchmaschinenoptimierung ausgeliefert 
werden (Meta-Tags, Schema.org, Keywords, Indexierung, 
Ladezeit, Mobile-First) - ohne manuellen Eingriff.
12. sicherheit
- admin portal nur mit account, mfa und URL mit key
- user müssen auch MFA machen? notwendig?
13 umlaute
Keine Umlaute im Code (Variablen, Funktionen, Keys).
In deutschen UI-Texten und Kommentaren sind Umlaute 
(ä, ö, ü, ß) erlaubt und erwuenscht.
14. Datenschutz
In deiner Datenschutzerklaerung fuer siteready.at musst du alle Auftragsverarbeiter nennen:
Supabase (Datenbank, Auth, Storage)
Cloudflare (CDN, DNS, Hosting)
Stripe (Zahlungsabwicklung)
Anthropic (KI-Textgenerierung via Claude API)
Jina AI (Website-Import)
Microsoft 365 (E-Mail)
15. Support (Live-Produkt)
Phase 1:
- FAQ-Seite im Portal
- Support-Formular (erstellt Ticket in Supabase)
- Antwort per E-Mail innerhalb 48h
- richtiges monitoring (fehler check, seo check, accessibility + benachricitung)
Spaeter:
- KI-Support-Bot (Claude Haiku, ca. EUR 0.001/Antwort)
- Bot bekommt FAQ + Doku als Kontext
- Kann nicht helfen → Ticket erstellen

16. PLugins?
Playwright — Browser-Automatisierung, Screenshots, Testing
Context7 — Aktuelle Library-Dokumentation abrufen
Supabase — Datenbank-Zugriff direkt aus Claude
Frontend Design — Hochwertige UI-Komponenten generieren
UI/UX Pro Max — Design-Intelligence (Styles, Farben, Fonts, UX-Guidelines)
21st.dev Magic — Animierte UI-Komponenten

---
*Bei Widerspruechen zwischen diesem Dokument und dem Code gilt der Code als Referenz.*