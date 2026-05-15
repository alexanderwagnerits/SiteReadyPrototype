# instantpage.at LIVE — Kostenrechnung für Business Case

## Kontext

instantpage.at ist ein Website-Service für österreichische KMU (Handwerker, Ärzte, Gastro etc.) — siehe `PRODUCT.md` § 1 + § 2.
Der Kunde beantwortet einen Fragebogen, die AI generiert eine fertige Website.
Optional wird eine bestehende Website oder ein Google Business Profil importiert.
Ein digitaler Betreuer (AI-Agent) überwacht und optimiert die Website laufend.

### Preise (unsere Einnahmen)
- Starter: €16/Mo monatlich, €14/Mo bei Jahreszahlung (€168/Jahr)
- Professional: €29/Mo monatlich, €25/Mo bei Jahreszahlung (€300/Jahr)
- Business: Teaser-Tier ohne fixen Preis (Kontakt-Lead)

### Tech-Stack
- Hosting: Cloudflare Pages + Workers
- Datenbank: Supabase (PostgreSQL, EU Frankfurt)
- AI: **Anthropic Claude Sonnet 4.6** für alle kundensichtbaren Texte (Quality-Bar, siehe `ARCHITECTURE.md` § 1.3) + **Haiku 4.5** für interne Pipeline-Schritte (Import-Extraktion, Web-Search-Synthese, Foto-Klassifizierung). Provider-agnostische Abstraktion via `lib/generate/client.ts` (`ARCHITECTURE.md` § 1.4 — Switch zu OpenAI/Gemini in 1-2 Tagen machbar).
- Bilder: Cloudflare Images (CDN, Resize, WebP/AVIF)
- Import: Firecrawl (Website-Crawling) + Google Places API (Business-Daten)
- Zahlung: Stripe
- Custom Domains: Cloudflare for SaaS (automatisches SSL)
- Kontaktformular: Resend (E-Mail-Zustellung)
- AI-Agents: Anthropic Managed Agents (Betreuer + SEO)

---

## 1. Einmalige Kosten pro Neukunde (Onboarding)

| Posten | Details | Kosten |
|--------|---------|--------|
| Firecrawl — Website crawlen | 3-5 Seiten à 1 Credit | ~€0.04-0.07 |
| Google Places API — Business-Daten | Advanced Details + 5-10 Fotos | ~€0.05 |
| Claude — Web Search (Bewertungen etc.) | Haiku (intern), max 2048 out, ~2 Searches à $0.01 | ~€0.02 |
| Claude — Import-Extraktion | Haiku (intern), ~15k in + ~5k out Tokens | ~€0.02 |
| Claude — Foto-Klassifizierung | Haiku Vision (intern), 5-10 Fotos gebatcht | ~€0.01 |
| Claude — Website-Texte generieren | **Sonnet (kundensichtbar)**, ~3k in + ~3k out Tokens | ~€0.05 |
| Cloudflare Images — Upload | 5-10 Bilder | ~€0.01 |
| **Gesamt API-Kosten einmalig** | | **~€0.20** |

Mit Prompt Caching (System-Prompt cached, -90% auf cached Input) + Haiku für interne Pipeline-Schritte: **~€0.15**.

> **Hinweis Modell-Wahl:** Sonnet bleibt fuer alle kundensichtbaren Texte (Haupt-Generierung, Headline, FAQ, Sektion-Regen) gesetzt — Quality-Bar (`ARCHITECTURE.md` § 1.3). Haiku nur fuer interne Pipeline-Schritte ohne End-Output. Per-Call-Cost-Tracking via `ai_calls`-Tabelle (`ARCHITECTURE.md` § 4.7) liefert echte Daten statt Schaetzung — nach ~50 Live-Sites wird re-evaluiert.

---

## 2. Laufende Kosten pro Kunde pro Monat

### Basis (jeder Kunde)

| Posten | Annahme | Kosten/Mo |
|--------|---------|-----------|
| Stripe — Monatliche Abbuchung | 1.5% × €16 + €0.25 | €0.49 |
| Claude — Section-Regenerierung | ~3×/Mo, **Sonnet** (kundensichtbares HTML), 2048 out | €0.09 |
| Claude — FAQ generieren | ~1×/Mo, **Sonnet** (kundensichtbar), 1024 out | €0.02 |
| Cloudflare Images — Serving | ~500 Views × 5 Bilder | €0.00 |
| Hosting/Serving (Workers) | Serve-time Rendering, kein AI | €0.00 |
| Custom Domain (40% der Kunden, anteilig) | CF for SaaS | ~€0.01 |
| **Gesamt Basis** | | **€0.61** |

### Betreuer + SEO (läuft im Portal, kein externer Messenger)

| Posten | Annahme | Kosten/Mo |
|--------|---------|-----------|
| Cron-Check (einfacher Worker) | Wöchentlich: DB lesen, Places API bei Bedarf | ~€0.02 |
| Managed Agent — Betreuer | ~2 Sessions/Mo à 1-2 Min, nur bei Fund | €0.04 |
| Managed Agent — SEO | ~1 Session/Mo à 3-5 Min | €0.06 |
| **Gesamt Betreuer** | | **€0.12** |

### Zusammenfassung monatlich

| Variante | Kosten/Mo | Marge bei €16/Mo |
|----------|-----------|------------------|
| Ohne Betreuer | €0.61 | 96.2% |
| Mit Betreuer | €0.73 | 95.4% |

### Effekt Jahreszahlung (€14/Mo)

| Posten | Monatlich | Jährlich |
|--------|-----------|----------|
| Stripe-Kosten/Mo | €0.49 | €0.23 (€2.77 ÷ 12) |
| Gesamt mit Betreuer/Mo | €0.73 | €0.47 |
| Marge | 95.4% | 96.6% |

Jahreszahlung ist für uns günstiger — Stripe-Kosten fast halbiert.

---

## 3. Fixkosten Infrastruktur

| Service | Zweck | Kosten | Ab wann nötig |
|---------|-------|--------|---------------|
| Supabase Pro | DB, Auth, Storage (kein Auto-Pause) | €25/Mo | Tag 1 |
| Cloudflare Images | Bild-CDN, WebP/AVIF, Resize | €5/Mo + $1/100k Deliveries | Tag 1 |
| Google Workspace | info@ + support@ Mail | €6/Mo | Tag 1 |
| Domain siteready.at | Hauptdomain | €15/Jahr (~€1.25/Mo) | Tag 1 |
| Cloudflare Pages Pro | Mehr Builds, höhere Worker-Limits | €25/Mo | ~300-500 Kunden |
| Firecrawl Hobby | 3.000 Credits/Mo statt 500 | €19/Mo | >100 Neukunden/Mo |
| Firecrawl Standard | 100k Credits/Mo | €49/Mo | >600 Neukunden/Mo |
| Mail-Dienst (Resend) | Kontaktformular-Zustellung | €0 (Free: 3k/Mo) → €20/Mo | >1.000 Kunden |
| CF for SaaS Extra | Custom Domains über 100 | $0.10/Domain/Mo | >100 Custom Domains (~250 Kunden) |
| Supabase Team | Höhere Limits, Priority Support | €599/Mo | >5.000 Kunden |

**Minimum-Fixkosten ab Tag 1: ~€37/Mo**

---

## 4. Skalierungstabelle

| Kunden | Fixkosten/Mo | Variable/Mo (mit Betreuer) | Gesamt/Mo | Einnahmen/Mo (Starter €16) | Gewinn/Mo |
|--------|-------------|---------------------------|-----------|---------------------------|-----------|
| 10 | €37 | €7 | €44 | €160 | €116 |
| 50 | €37 | €37 | €74 | €800 | €726 |
| 100 | €37 | €73 | €110 | €1.600 | €1.490 |
| 250 | €62 | €183 | €245 | €4.000 | €3.755 |
| 500 | €81 | €365 | €446 | €8.000 | €7.554 |
| 1.000 | €101 | €730 | €831 | €16.000 | €15.169 |
| 2.500 | €161 | €1.825 | €1.986 | €40.000 | €38.014 |
| 5.000 | €271 | €3.650 | €3.921 | €80.000 | €76.079 |
| 10.000 | €970 | €7.300 | €8.270 | €160.000 | €151.730 |

---

## 5. Upgrade-Trigger

| Trigger | Schwelle | Aktion | Mehrkosten |
|---------|----------|--------|------------|
| Go-Live | Tag 1 | Supabase Pro + CF Images + Google Workspace | +€37/Mo |
| Traffic steigt | ~300-500 Kunden | Cloudflare Pages Pro | +€25/Mo |
| Viele Neukunden/Mo | >100 Imports/Mo | Firecrawl Hobby | +€19/Mo |
| Custom Domains | >100 Domains (~250 Kunden) | CF for SaaS Extra | +$0.10/Domain/Mo |
| Kontaktformulare | >1.000 Kunden | Resend Paid | +€20/Mo |
| Hohe Neukunden | >600 Imports/Mo | Firecrawl Standard | +€30/Mo (ersetzt Hobby) |
| Google Places Guthaben aufgebraucht | >4.000 Imports/Mo | Kein Free Credit mehr | +~$0.05/Import |
| Anthropic Tier | Automatisch ab $40 Spend | Höhere Rate Limits | €0 (gleiche Preise) |
| DB-Limits | >5.000 Kunden | Supabase Team | +€574/Mo |

---

## 6. API-Preise Referenz

| Service | Preismodell |
|---------|-------------|
| Claude Sonnet 4.6 | Input $3/MTok, Output $15/MTok, Cached Input $0.30/MTok |
| Claude Web Search | $0.01 pro Request |
| Anthropic Managed Agents | Token-Preise + $0.08/h Session-Runtime |
| Google Places API | Advanced Details $0.02/Req, Photos $0.007/Foto, $200/Mo Gratis-Guthaben |
| Firecrawl | Free: 500 Credits/Mo, Hobby: 3k für $19, Standard: 100k für $49 |
| Cloudflare Images | $5/Mo Basis + $1/100k Image Deliveries |
| Cloudflare for SaaS | 100 Custom Hostnames frei (Pro Plan), dann $0.10/Hostname/Mo |
| Stripe (EU-Karten) | 1.5% + €0.25 pro Transaktion |
| Resend (E-Mail) | 3.000/Mo frei, dann €20/Mo für 50.000/Mo |
| WhatsApp Business API | Nicht genutzt (Betreuer läuft im Portal) |

---

## 7. Kern-Erkenntnisse

1. **Stripe ist der größte variable Kostenblock** — €0.49/Mo bei monatlicher Zahlung. Alle AI-Kosten zusammen (Generierung, Import, Betreuer, SEO) sind günstiger als eine Stripe-Transaktion.

2. **Break-Even: 3 Kunden** decken die Fixkosten (€37 ÷ ~€15 Marge).

3. **Bruttomarge bleibt >95%** auf jeder Skalierungsstufe, weil Fixkosten sublinear wachsen.

4. **Jahreszahlung bevorzugen** — Stripe-Kosten halbieren sich, Marge steigt auf 96.6%.

5. **Größter Kosten-Sprung** kommt erst bei >5.000 Kunden (Supabase Team €599/Mo). Bis dahin wächst die Infrastruktur sanft mit.

6. **AI-Kosten sind vernachlässigbar** — der digitale Betreuer kostet €0.12/Mo/Kunde. Das ist das Feature das uns von Wix/Squarespace unterscheidet, und es kostet fast nichts.

---

## Aufgabe

Bitte erstelle daraus:
1. Eine übersichtliche Kostenrechnung mit allen Zahlen
2. Szenarien für 100, 500, 1.000 und 5.000 Kunden
3. Break-Even-Analyse
4. Jahresprojektion (Monat für Monat bei angenommenem Wachstum)
5. Vergleich monatliche vs. jährliche Zahlung
6. Visualisierung der Margenentwicklung
