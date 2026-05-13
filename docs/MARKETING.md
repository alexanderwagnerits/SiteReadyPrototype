# Marketing + Growth — instantpage.at

> Acquisition-Strategie und Wachstums-Mechaniken fuer das Live-Produkt. Branding, Voice und Tonalitaet → `BRAND.md`. Pricing-Mechanik → `PRODUCT.md` § 3.

**Stand:** 2026-05-13 — `[SKELETON]` Growth-Mechaniken inhaltlich entschieden, Channels-Strategie noch offen.

---

## Inhalt

1. [Strategische Grundlage](#1-strategische-grundlage)
2. [Acquisition-Channels (Skeleton)](#2-acquisition-channels-skeleton)
3. [Growth-Mechaniken](#3-growth-mechaniken)
4. [Priorisierung + Timing](#4-priorisierung--timing)
5. [Anti-Patterns](#5-anti-patterns)
6. [Verbindung zu anderen Dokumenten](#6-verbindung-zu-anderen-dokumenten)

---

## 1. Strategische Grundlage

instantpage.at ist als **oesterreichisches Vertrauensprodukt** positioniert (B2B-KMU, AT-only Phase 1, lokale Naehe als Differentiator — siehe `BRAND.md` § 1 + Memory `feedback_at_vertrauensprodukt.md`). Daraus folgt fuer Marketing + Growth:

- **Trust schlaegt Reichweite.** Persoenliche Empfehlung, WKO/Innungs-Bezug, regionale Sichtbarkeit > breite Performance-Werbung.
- **Sachlich, nicht laut.** Keine MLM-/Affiliate-Vibes, keine "Verdiene X EUR pro Lead"-Kommunikation — kollidiert mit Brand-Ton (siehe `BRAND.md` § 5.2).
- **Multiplikatoren > Einzelkunden.** Steuerberater, Innungen, Branchen-Influencer empfehlen B2B2B effizienter als Endkunden-Mundpropaganda.
- **Geografische + branchen-konzentrierte Cluster.** Lieber 30 Friseure in Graz als 30 verstreute Berufe ueber AT — Showcase-Effekt, lokale Sichtbarkeit, einfacherer Vertrieb.

---

## 2. Acquisition-Channels (Skeleton)

> Channel-Details fuer Live-Bau spaeter zu spec'en. Hier nur Liste fuer Vollstaendigkeit.

| Channel | Status | Bemerkung |
|---|---|---|
| Organisch / SEO | `[OFFEN]` | KMU googelt nach "Webseite Friseur Wien" etc. Long-Tail-Strategie + Recipe-Showcase-Pages |
| LinkedIn (Company Page) | `[LIVE seit 2026-05-12]` | siehe Memory `project_session_2026-05-12_stand.md`. Strategie noch zu spec'en |
| WKO / Innungen | siehe § 3.4 | institutionelle Kooperation |
| Multiplikatoren | siehe § 3.3 | Partnerprogramm |
| Lokale Medien / Branchen-Magazine | `[OFFEN]` | Editorial-Erwaehnungen, kein Paid |
| Paid (Google Ads, Meta) | `[SPAETER]` | Erst wenn Conversion-Funnel validiert |

---

## 3. Growth-Mechaniken

Fuenf Mechaniken in Reihenfolge der Live-Prioritaet. Details + Aufwand pro Mechanik.

### 3.1 First-100-Gruendertarif `[LAUNCH-Day-1]`

**Mechanik:** Die ersten 100 zahlenden Kunden erhalten einen **Lifetime-Preis fixiert** (z. B. Starter 14 EUR/Monat dauerhaft, Professional 25 EUR/Monat dauerhaft — entspricht dem aktuellen Sub-Plan-Preis aus Memory `feedback_preise_plan.md`).

**Warum:** Schafft Pre-Launch-Hype, Loyalitaets-Anker, signalisiert Vertrauen in eigenes Produkt. In AT-Startup-Szene etablierter Hebel. Kunde-1-Geschichte spaeter als Marketing-Asset.

**Aufwand:** Null Tech-Bau — ein Stripe-Coupon `LIFETIME-FOUNDER` mit Cap=100. Landing-Page-Banner + Pricing-Hinweis.

**Risiko:** Bei stark steigenden Preisen spaeter ist die Marge auf die 100 ggf. duenn — Cap = 100 ist akzeptabler Verlust fuer den Trust-Hebel.

**Decision-Trigger:** Vor Live-Launch final festlegen, ob 100 oder 50 (kleinerer Cap = mehr Knappheits-Signal, weniger Lifetime-Belastung).

---

### 3.2 Kunden-Showcase `[LAUNCH-Day-1]`

**Mechanik:** Bestehende Kundenseiten auf instantpage.at-Landing prominent zeigen (Logo + Live-Link + Branche/Stadt). Kunde bekommt **Sichtbarkeit + Backlink** als Belohnung statt Cash/Rabatt.

**Warum:** Trust-Signal fuer Neukunden (echte Sites, echte AT-Unternehmen). Kostet uns nichts. Wirkt staerker als Testimonials, weil die Sites self-evident sind. SEO-Nebeneffekt (Backlinks vom Marketing-Site auf Kunden-Subdomains und ggf. umgekehrt).

**Aufwand:** Showcase-Section auf Landing (Marketing-Site-Konzept, `DESIGN-VISION.md` § 5). Opt-in-Checkbox im Kunden-Portal "Meine Seite darf als Referenz gezeigt werden".

**Compliance-Hinweis:** Opt-in dokumentieren (DSGVO + UWG). Auch ohne Showcase nutzbar — kein Lock-in.

---

### 3.3 Multiplikator-Partnerprogramm `[Monat 2–6]`

**Mechanik:** Steuerberater, IT-Berater, lokale Marketing-Agenturen, Branchen-Influencer bekommen einen **Partner-Code** und verdienen z. B. **20 % Lifetime-Provision** auf alle ueber sie vermittelten zahlenden Kunden — solange der Kunde aktiv ist.

**Warum:** Ein Steuerberater hat 20–50 KMU-Mandanten, seine Empfehlung wiegt fuer einen Handwerker mehr als die vom Nachbarn. Effizienter Hebel als Endkunden-Referral. AT-spezifisch: enge Steuerberater-Mandant-Beziehung, hohe Vertrauensbasis.

**Aufwand (Self-Built):** ~3–4 Tage Bau (Partner-Tabelle, Code-Tracking, Stripe-Webhook fuer Provision, Partner-Dashboard im Portal). Alternativ Drittanbieter wie Rewardful (~49 USD/Monat, Stripe-natives Tool) — aber externer Datenfluss kollidiert mit AT-Vertrauensprodukt-Vibe und LIVE-COMPLIANCE.md-Subprozessor-Logik. Self-Built bevorzugt.

**Provisions-Modell — Optionen:**
- 20 % Lifetime (klassisch, hoher Anreiz fuer Multiplikator, Marge-Belastung)
- 20 % erstes Jahr, danach 10 % (Marge-schonender, marktueblich)
- 1 Monat gratis pro vermitteltem Kunden + 50 EUR Einmalbonus ab 5 Vermittlungen (gemischt)

**Decision-Trigger:** Vor Programm-Launch festlegen. Empfehlung: 20 % erstes Jahr + 10 % Folgejahre.

**Anti-Missbrauch:**
- Partner muss verifiziertes Unternehmen sein (UID-Check, kein Privatkunde)
- Self-Referral blockieren (Partner kann sich nicht selbst vermitteln)
- Cooldown: Provision erst ab 1. bezahlter Rechnung des Kunden, nicht bei Signup

**Steuer-Aspekt:** Partner stellt Provisions-Rechnung an Wagner IT-Solutions e.U. — kein Eigenrechnungs-Modell. Steuerberater-Termin vor Programm-Launch klaeren (siehe Memory `project_pre_setup_status.md`).

---

### 3.4 WKO / Innungs-Kooperationen `[wenn Traction in Sparte]`

**Mechanik:** Direkter Vertriebsgespraech mit WKO-Sparten und Innungen (z. B. Tischler-Innung Wien, Friseur-Innung Steiermark, WKO-Sparte Gewerbe + Handwerk). instantpage.at wird als **offizieller Mitgliedervorteil** gelistet, Mitglieder bekommen z. B. **25 % Rabatt** im ersten Jahr.

**Warum:** Institutioneller Trust-Stempel ist in AT-KMU-Umfeld extrem wirksam — WKO-Logo neben Produkt = sofortige Glaubwuerdigkeit. Massenkommunikation an Mitglieder (Innungs-Newsletter, WKO-Magazin) ist im Mitgliedsvorteil enthalten.

**Aufwand:** Null Tech (Stripe-Coupon `WKO-TISCHLER-VIENNA-2026` etc.). Hoher Vertriebs-Aufwand — Innungs-Funktionaere ueberzeugen, Vorstandstermine, ggf. Probeprojekt.

**Trigger:** Erst anvisieren wenn **30–50 Referenzkunden in der Sparte** existieren (Showcase als Verhandlungsbasis). Sonst keine Glaubwuerdigkeit.

**Konkrete Sparten als Erstziel (Prioritaet):** Tischler/Schreiner, Friseure, Gastronomie/Kaffeehaeuser, Steuerberater (doppelter Effekt: Mitgliedervorteil + Multiplikator-Quelle).

---

### 3.5 Branchen-Bundle ("3-er-Gruppe") `[Phase 2]`

**Mechanik:** Wenn 3 Kunden aus derselben Berufsgruppe + Region gemeinsam buchen (z. B. drei Tischler aus Niederoesterreich), bekommen alle drei **30 % Rabatt im ersten Jahr** oder **3 Monate gratis**.

**Warum:** Nutzt WhatsApp-Gruppen, Innungs-Stammtische, lokale Unternehmer-Treffen — exakt die informellen AT-KMU-Kanaele. Funktioniert besonders im Handwerk und Gastronomie.

**Aufwand:** Mittel — Stripe-Coupon mit gekoppelter Aktivierungs-Logik ("3 Codes mussen innerhalb 30 Tagen eingeloest werden, sonst Rabatt verfaellt"). Self-Built ~1–2 Tage.

**Risiko:** Aktivierungs-Logik kann fuer Kunde unklar sein — UX-Spec noetig. Eher fuer Phase 2 wenn Grundprodukt steht.

---

### 3.6 Endkunden-Referral (Double-Sided) `[spaeter, optional]`

**Mechanik:** Bestandskunde generiert persoenlichen Empfehlungs-Link im Portal. Neukunde ueber den Link bekommt **1. Monat gratis**, Empfehler bekommt **1 Monat Guthaben** sobald Neukunde 1. Rechnung zahlt.

**Warum:** Standard-SaaS-Pattern (Dropbox/Webflow/Framer). Erwartungs-konform, niedrige Friktion.

**Aufwand:** ~3–4 Tage Bau (siehe Konversations-Notiz 2026-05-13). Self-Built bevorzugt aus AT-Vertrauensprodukt-Gruenden.

**Warum nicht zum Launch:** Multiplikator-Programm (§ 3.3) ist effizienter pro investierter Stunde. Endkunden-Referral lohnt sich erst bei klarem Signal "Kunden empfehlen ohnehin organisch" (Trigger: nach 20–50 zahlenden Kunden in Empfehlungs-Frequenz beobachten).

---

## 4. Priorisierung + Timing

| Phase | Aktion | Aufwand | Hebel |
|---|---|---|---|
| **Pre-Launch** | First-100-Gruendertarif (§ 3.1) anlegen | 1h | Pre-Launch-Hype |
| **Live-Day-1** | Kunden-Showcase (§ 3.2) auf Landing + Portal-Opt-in | 1 Tag (in DESIGN-VISION integriert) | Trust |
| **Monat 1–2** | Erste 10–30 Kunden gewinnen ueber Direktansprache + LinkedIn | hoch | Foundation |
| **Monat 2–6** | Multiplikator-Partnerprogramm (§ 3.3) bauen + launchen | 3–4 Tage Bau + laufender Vertrieb | mittelfristiger Wachstumsmotor |
| **Monat 6+** | WKO/Innungs-Kooperationen (§ 3.4) anvisieren | hoch Vertrieb, null Tech | institutioneller Trust |
| **Phase 2** | Branchen-Bundle (§ 3.5) + Endkunden-Referral (§ 3.6) | je 1–4 Tage Bau | Marge-Optimierung |

---

## 5. Anti-Patterns

Nicht tun — kollidiert mit Brand + AT-Vertrauensprodukt-Positionierung:

- **"Verdiene EUR X pro Lead"-Banner** auf Landing — MLM-Vibe, untergraebt Trust
- **Cashback an Endkunden** statt Plan-Rabatt/Guthaben — wirkt nach Affiliate-Spam
- **Aggressive Pop-Ups / Exit-Intents** im Marketing-Funnel — kollidiert mit "sachlich-zugewandt" Tonalitaet (`BRAND.md` § 5.4)
- **Provision verstecken** beim Multiplikator-Programm — DSGVO-/UWG-relevant, Transparenz-Pflicht
- **Berufsgruppen-Listen in Hauptbotschaften** (siehe Memory `feedback_marketing_zielgruppe_inklusiv.md`)
- **"Pflichtangaben" / "rechtliche Pflichten"** als Marketing-Hebel (siehe Memory `feedback_keine_rechtliche_pflichten.md`)

---

## 6. Verbindung zu anderen Dokumenten

- [`BRAND.md`](BRAND.md) — Voice & Tone, Slogans, verbotene Begriffe (UWG)
- [`PRODUCT.md`](PRODUCT.md) § 3 — Pricing-Grundlage fuer Rabatt-/Provisions-Mechaniken
- [`LIVE-COMPLIANCE.md`](LIVE-COMPLIANCE.md) — UWG, Werbung, Subprozessoren (bei Drittanbieter-Tools)
- [`DESIGN-VISION.md`](DESIGN-VISION.md) § 5 — Marketing-Site-Konzept (Showcase-Section)
- [`MIGRATION-PLAN.md`](MIGRATION-PLAN.md) — Phasen-Reihenfolge Live-Bau

---

## Verbindung zu Memory

- `feedback_at_vertrauensprodukt.md` — Brand-Positionierung als Grundlage
- `feedback_preise_plan.md` — Sub-Plan-Preise (Lifetime-Anker fuer § 3.1)
- `feedback_marketing_zielgruppe_inklusiv.md` — keine Berufsgruppen-Liste in Hauptbotschaften
- `feedback_keine_rechtliche_pflichten.md` — keine Compliance-Begriffe als Marketing-Hebel
- `project_session_2026-05-12_stand.md` — LinkedIn Company Page live
- `project_marketing_skills_eval.md` — marketing-skills.com Evaluation offen

---

## Offene Entscheidungen vor Live-Launch

- First-100 vs. First-50 Cap fuer Gruendertarif (§ 3.1)
- Multiplikator-Provisions-Modell — 20 % Lifetime vs. 20 % + 10 % Folgejahre (§ 3.3)
- Channel-Mix Live-Launch — wie viel LinkedIn / wie viel Direktansprache / wie viel SEO-Investition
- Marketing-Skills Evaluation (Memory `project_marketing_skills_eval.md`) — vor Marketing-Funnel-Bau noch durchfuehren
