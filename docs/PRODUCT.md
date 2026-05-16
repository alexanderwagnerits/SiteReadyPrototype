# Produkt-Spec — instantpage.at

> Living Document. Vision, Zielgruppe, Pricing, Plan-Features, Trial-Mechanik und Self-Service-Portal-Funktionen sind spec'd. Vor Live-Schaltung noch zu bestätigen: USt-Anzeige (Steuerberater-Termin) und Business-Plan-Definition (offen).

**Stand:** 2026-05-06

---

## Status

`[GRÖSSTENTEILS-FERTIG]` — Inhalte stehen. Offene Punkte:
- USt-Anzeige im Pricing (§3) — vom Steuerberater bestätigen
- Business-Plan-Features (§3) — bleibt Teaser bis Pro-Plan-Daten zeigen, was fehlt
- Re-Generation-Logik (§3.3) — am 2026-05-06 auf Serve-Time-Maximum umgestellt

---

## Inhalt (geplant)

1. Vision + Kernversprechen
2. Zielgruppe + Markt
3. Pricing + Pläne
4. Feature-Matrix pro Plan
5. Onboarding-Flow
6. Trial + Cancellation
7. Self-Service-Portal Funktionen
8. Markt-Positionierung
9. Roadmap (Public + Internal)
10. Produkt-Prinzipien

---

## 0. Produkt-Prinzipien (nicht verhandelbar)

### Status-Echtheit

Alle Status-Anzeigen im Portal müssen **echte Live-Werte** zeigen — niemals Platzhalter, "Coming Soon", oder vorgegaukelte Zustände.

Konkret betroffen:
- **Indexierung:** "Bei Google indexiert" nur wenn Google Search Console API das tatsächlich bestätigt
- **Custom Domain:** "Verbunden" nur wenn DNS auflöst + SSL aktiv
- **Live-Status:** "Online" nur wenn Health-Check < 5 Min alt erfolgreich
- **Mailing:** "Konfiguriert" nur wenn SPF/DKIM/DMARC validiert
- **Statistiken:** echte Zahlen aus Cloudflare Web Analytics, kein Demo-Content

**Why:** Vertrauensverlust bei KMU passiert sofort, wenn ein Status lügt. Lieber "Wird geprüft …" oder "Noch nicht verfügbar" als ein falsches "✓".

**How to apply:** Jedes Status-Feld im Portal muss eine identifizierbare Datenquelle haben. Bei UI-Reviews aktiv prüfen: woher kommt dieser Wert? Wenn die Antwort "Platzhalter" oder "Mock" lautet → entweder echt machen oder weglassen.

---

## 1. Vision + Kernversprechen

**Vision**
Eine moderne, branchengerechte Website ist Grundausstattung für jeden Betrieb. instantpage.at liefert sie als Service — vollständig konfiguriert, auf österreichische Standards abgestimmt, ohne Agentur-Aufwand.

**Kernversprechen**
> Sie sagen uns, wer Sie sind und was Sie machen. Wir liefern die Website, die zu Ihrer Branche passt — fertig konfiguriert, mit allen rechtlichen Pflichtangaben, sofort online.

**Was instantpage.at bewusst nicht ist**
- Kein Website-Builder. Sie treffen keine Design-Entscheidungen.
- Kein generisches Template-Tool. Jede Berufsgruppe bekommt eine eigene, kuratierte Vorlage.
- Kein Marketing-Vehikel für Tech-Stack. Die eingesetzte Technik bleibt im Hintergrund.

**Wie die Plattform funktioniert**
Branchenspezifische Vorlagen werden manuell kuratiert. Texte für Hero, Leistungen, FAQ und Kurzbeschreibung entstehen automatisiert auf Basis der Eingaben. Pflichtangaben (Impressum, Datenschutzerklärung) werden aus den Stammdaten vorbelegt.

**Tonalität gegenüber Endkunden**
Sachlich, ohne Tech- oder KI-Buzzwords. Wo die Plattform automatisiert arbeitet, wird das transparent gekennzeichnet — gemäß AI-Act-Disclosure-Pflicht ab August 2026.

## 2. Zielgruppe + Markt

**Zielgruppe**
Österreichische Klein- und Mittelbetriebe mit lokalem Geschäft — Betriebe, deren Website Information, Erreichbarkeit und Vertrauen vermitteln muss, ohne dass eigene Webentwicklungs-Ressourcen vorhanden sind.

**Unterstützte Berufsgruppen zum Live-Start (12)**

| Berufsgruppe | Beispielberufe |
|---|---|
| Handwerk | Elektriker, Installateur, Maler, Tischler, Fliesenleger |
| Gastro | Restaurant, Café, Bar, Bäckerei, Konditorei |
| Gesundheit | Arzt, Therapeut, Apotheke (mit Sonderbehandlung wegen RAO und Heilmittelwerbegesetz) |
| Dienstleistung | Coach, Berater, Trainer, Steuerberater, Anwalt |
| Bildung | Sprachschule, Trainer, Nachhilfe |
| Tourismus | Pension, Ferienwohnung, Reisedienstleister |
| Handel | Kleinhandel, Boutique, Fachgeschäft |
| Mobilität | KFZ-Werkstatt, Autohändler, Fahrschule |
| Agrar | Bauernhof, Imker, Direktvermarkter |
| Industrie | kleine Produktionsbetriebe, technische Dienstleister |
| Kosmetik | Friseur, Kosmetikstudio, Massage |
| Kultur | Künstler, Galerie, kleine Veranstalter |

Recipe-Mapping (Look-Optionen pro Berufsgruppe) in [`RECIPE-SYSTEM.md`](RECIPE-SYSTEM.md).

**Marktgröße Österreich**
Rund 190.000 Betriebe sind potenzielle Kunden — etwa 120.000 im Handwerk, 30.000 in der Gastronomie, 40.000 in den übrigen Berufsgruppen.

**Bewusst außerhalb des Fokus**
- Künstler-, DJ- und Influencer-Profile (Linktree- und Komi-Segment)
- Editorial-Magazine mit individuellem Design-Anspruch (Webflow-Segment)
- Konzerne und Enterprise-Kunden (Custom-Agentur-Segment)
- Privatseiten ohne gewerblichen Hintergrund

**Geografie**
Zum Live-Start ausschließlich Österreich. Erweiterung auf DACH und EU ist für eine spätere Ausbaustufe vorgesehen — siehe [`MIGRATION-PLAN.md`](MIGRATION-PLAN.md) § 8.5.

## 3. Pricing + Pläne

### 3.A Standard-Plaene (Self-Service, Day-1 buchbar)

| Plan | Monatlich | Jährlich (pro Monat) | Einmalpreis | Status |
|---|---|---|---|---|
| Starter | 16 EUR | 14 EUR | — | aktiv Day-1 |
| Professional | 29 EUR | 25 EUR | — | aktiv Day-1 |
| **Einrichtungs-Service** (Add-on zu Starter/Pro) | — | — | **149 EUR** | aktiv Day-1, siehe § 3.5 |

### 3.B Sonderloesungen (auf Anfrage / Coming Soon)

| Angebot | Preis | Status |
|---|---|---|
| Business-Plan | — | Coming Soon (Vormerken), Trigger ≥10 Pro-Kunden-Wuensche |
| **Custom-Sites** (Multipage, eigene Marke, individuell gebaut) | **ab 990 EUR einmalig + 79 EUR/Mo Custom Hosting & Care** | auf Anfrage, siehe § 3.6 |
| **Whitelabel-Agentur-Programm** (Co-Branded fuer Marketing-Agenturen mit Endkunden) | Volumen-Pauschale auf Einzelvertrag | auf Anfrage, siehe § 3.7 |

(Alle Preise ohne USt-Ausweis — Kleinunternehmerregelung)

**USt-Behandlung — Kleinunternehmerregelung:** Wagner IT-Solutions e.U. ist Kleinunternehmer (§ 6 Abs 1 Z 27 UStG, Umsatzgrenze 2026 = 55.000 €) — siehe `LIVE-COMPLIANCE.md` § 2. Daraus folgt:

- **Anzeige im Pricing:** "16 € pro Monat" (kein USt-Hinweis, da keine USt ausgewiesen wird)
- **Pflicht-Hinweis** auf Rechnungen + AGB + Pricing-Footnote: *"Kleinunternehmer im Sinne des § 6 Abs 1 Z 27 UStG, daher keine Umsatzsteuer ausgewiesen."*
- **Stripe-Tax NICHT aktivieren** in Phase 0 — keine USt-Berechnung pro Kunden-Land nötig solange Kleinunternehmer
- **B2B-EU-Reverse-Charge** entfällt (keine USt → kein Reverse-Charge-Mechanismus)

**Schwellwert-Überwachung** (Phase 5 Stabilisierung):
- Bei ARR-Schwelle ~45.000 € (Frühwarnstufe) → Steuerberater-Termin: "ab wann auf USt-Pflicht wechseln, freiwillig optieren?"
- Bei realem Erreichen 55.000 € (Vorjahres-Umsatz) → automatischer Wechsel auf USt-Pflicht ab Folgejahr, Stripe-Tax aktivieren, Pricing-Anzeige umstellen auf "netto + USt"
- Migrations-Pfad für bestehende Kunden: AGB-Update mit Vorlauf, neue Pricing-Page-Variante

**Mindestlaufzeit Monatsabo:** monatlich kündbar.
**Mindestlaufzeit Jahresabo:** 12 Monate, danach monatlich kündbar.
**Kein Refund nach Trial-Ende:** Trial bietet Vollzugriff zur Prüfung. Nach Trial-Ende keine Erstattung — siehe `LIVE-COMPLIANCE.md` § 1 #11.
**Custom-Domain-Kosten** (Pro): Cloudflare for SaaS gibt 100 Hostnames gratis, ab 101: $0.10/Hostname/Monat. In Pro-Pricing eingerechnet.

**Business-Plan:** bleibt Teaser bis Pro-Plan-Daten zeigen, welche Features fehlen. Trigger für Definition: ≥10 Pro-Kunden mit konkreten Wünschen ODER vertraglicher Druck (größerer Kunde fragt nach SLA / Multi-User / Custom-Branding).

**Markterprobungs-Aktion (Newcomer-Rabatt):** 20 % Rabatt auf das erste Jahr für Neukunden, die während der Aktionsphase signen. Laufzeit Inhaber-getriggert. Stripe-Coupon `NEWCOMER-20-FIRSTYEAR`, `duration: repeating, duration_in_months: 12`. Mechanik und Brand-Begründung in [`MARKETING.md`](MARKETING.md) § 3.1. AGB-Klausel-Hinweis in `LIVE-COMPLIANCE.md` § 5 (§ 9 Abs 5).

> ⚠️ **Pricing-Inkonsistenz Beta vs Spec** — `[TODO Phase 0]`: Beta-Code `create-checkout.js:20` verwendet `1800 cents = 18 €/Mo` und `18360 cents = 183.60 €/Jahr (15,30 €/Mo)`. PRODUCT.md spezifiziert 16 €/14 €. Im Live-Bau mit den hier dokumentierten Werten synchronisieren.

---

## 3.0 Zahlungs- und Rechnungs-Pipeline

> **Architektur-Entscheidung 2026-05-08.** AT-Solo-e.U. mit Kleinunternehmerregelung. Stripe = Source of Truth für Ausgangsrechnungen, sevDesk + MiracleSync = automatische Buchhaltung. Sync-Test 2026-05-08 erfolgreich verifiziert (siehe Risiko-Tabelle unten).

### Stack-Übersicht

```
┌─────────────────────────────────────────────────────────┐
│  Kunde                                                   │
│       ↓ Karte hinterlegen                                │
│  Stripe Checkout (mode=subscription, trial 7 Tage)      │
│       ↓ trial endet → Auto-Charge                       │
│  Stripe Invoice (PDF, AT-Custom-Fields, Tax-Exempt)     │
│       ↓ Auto-Email an Kunden                             │
│  Stripe-Auszahlung wöchentlich → Erste Bank             │
│       ↓                                                  │
│  MiracleSync (sevDesk-Marketplace) — automatisch        │
│       ↓ pollt Stripe alle ~24h                          │
│  sevDesk: Stripe als virtuelles Bankkonto, Charges =    │
│  Bewegungen, Invoice-PDF mitgespiegelt als Voucher,     │
│  Stripe-Gebühr als separater Aufwandsbeleg              │
│       ↓ Self-Service                                     │
│  FinanzOnline ESt-Erklärung 1x/Jahr                     │
└─────────────────────────────────────────────────────────┘
```

### Tool-Stack + Kosten (monatlich)

> **Kostenzuordnung:** sevDesk + Geschäftskonto + Steuerberater sind Fixkosten der Selbstständigkeit Wagner IT-Solutions (alle Tätigkeitsfelder, nicht SiteReady-spezifisch). Marginale SiteReady-Kosten = nur Stripe + MiracleSync.

| Komponente | Funktion | Kosten | Zuordnung |
|---|---|---|---|
| **Stripe** | Payments + Invoices (Source of Truth) + Customer Portal | Transaktionsgebühren ~0,8 % SEPA / 1,4 % Karte | SiteReady |
| **MiracleSync** Stripe→sevDesk | Auto-Sync Charges + Belege + Gebühren-Buchung. Stripe als virtuelles Bankkonto in sevDesk. Skaliert mit Zahlungen/Mo | Jahresabo netto: 11 € (≤50) / 19 € (≤500) / 29 € (≤1.000) / 49 € (≤3.000) — brutto ca. +19 %. Was genau als „1 Zahlung" zählt (Charges, Fees, Refunds, Retries) ist beim Anbieter nicht klar dokumentiert — nach Live im sevDesk-Counter beobachten, Tier-Sprung-Differenz ~10 €/Mo | SiteReady |
| **sevDesk Buchhaltung** | E/A-Rechnung + Belegerfassung + Online-Banking + EÜR/GuV + DATEV-Export für die gesamte e.U. | ~25 €/Mo netto regulär (~30 € brutto). Aktion: 70 % Rabatt erste 6 Mo bei 12-Mo-Vertrag → ~7,50 € netto / ~9 € brutto | Wagner IT-Solutions (allgemein) |
| **Erste Bank Geschäftskonto** | Stripe-Auszahlungs-Ziel + sevDesk-Banking-Verknüpfung | ~7 €/Mo (Erste Business basic) | Wagner IT-Solutions (allgemein) |
| **FinanzOnline** | ESt-Erklärung self-service | 0 € | Wagner IT-Solutions (allgemein) |
| **Steuerberater** | 1× initial-Setup-Check + 1× bei USt-Wechsel. Aufwand sinkt durch sevDesk-Vorbereitung + DATEV-Export | ~100–200 €/Jahr | Wagner IT-Solutions (allgemein) |

**Marginale SiteReady-Software-Kosten:** Stripe-Gebühren + MiracleSync. Bei 50 Kunden ≈ 13 €/Mo brutto MiracleSync, bei 500 ≈ 23 €/Mo. sevDesk + Bank + Steuerberater wären für die Selbstständigkeit ohnehin nötig.

### Phase 1 — Live-Day-1 Setup (~2–4h Code-Aufwand)

**Ziel:** Stripe-Hosted-Invoices mit AT-Pflichtangaben statt der aktuellen Beta-Receipts.

**Code-Änderungen:**

`functions/api/create-checkout.js` erweitern:
- `customer_creation: "always"` setzen (Customer wird vor Subscription erstellt)
- Beim `checkout.session.completed`-Webhook: Customer-Update mit `tax_exempt: "exempt"`

`functions/api/stripe-webhook.js` erweitern (in `checkout.session.completed`):
```js
// Customer als Kleinunternehmer markieren
await fetch(`https://api.stripe.com/v1/customers/${customerId}`, {
  method: "POST",
  headers: { "Authorization": `Bearer ${env.STRIPE_SECRET_KEY}`, "Content-Type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({ "tax_exempt": "exempt" })
});
```

`functions/api/get-invoices.js` umstellen:
- Statt `charges?customer=...` → `invoices?customer=...&limit=20`
- Statt `receipt_url` → `invoice_pdf` + `hosted_invoice_url`

**Stripe Dashboard Setup (manuell, einmalig):**

1. **Settings → Customer Portal**: aktivieren (für Plan-Wechsel/Kündigung)
2. **Settings → Tax**: keine Aktivierung, da Kleinunternehmer
3. **Settings → Invoice Template** (Default-Template):
   - **Custom Fields** (4 max, je name 40 Zeichen / value 140 Zeichen):
     - `Firmenbuch`: `FN 609574h, HG Wien`
     - `Gewerbe`: `GISA 34399071`
     - `Bankverbindung`: `IBAN AT88 2011 1843 5211 6200 (Erste Bank)`
     - `Aufsicht`: `Magistrat der Stadt Wien (GewO 1994)`
   - **Footer (Free Text)**:
     ```
     Kleinunternehmer im Sinne des § 6 Abs 1 Z 27 UStG, daher keine
     Umsatzsteuer ausgewiesen. Berufsrechtliche Vorschriften: GewO 1994,
     ECG, MedienG (www.ris.bka.gv.at). Verbraucher haben kein Widerrufsrecht
     (B2B-only). info@instantpage.at | datenschutz@instantpage.at
     ```
   - **Logo**: instantpage-Logo
   - **PDF Page Size**: A4
4. **Invoice Numbering**: fortlaufende Sequenz (Stripe-Default `INV-XXXX`) — AT-konform

**Test-Plan vor Go-Live:**
1. Test-Customer mit AT-Adresse anlegen
2. Test-Subscription starten
3. Test-Charge auslösen (Stripe Test-Mode)
4. PDF-Invoice prüfen — alle 4 Custom Fields + Footer sichtbar?
5. Steuerberater-Mini-Termin (~100 €): "ist das so AT-konform?"

### Phase 2 — Buchhaltungs-Auto-Sync via MiracleSync (kein Code-Aufwand)

**Entscheidung 2026-05-08:** sevDesk + MiracleSync ersetzt die ursprünglich geplante Code-Bridge zu everbill. Begründung: Sync-Test verifizierte saubere Architektur (Stripe als virtuelles Bankkonto in sevDesk, Charges als Bewegungen, Invoice-PDFs als Vouchers, Stripe-Gebühren als separate Aufwandsbelege) — **alles ohne eigene Code-Bridge.**

**Was MiracleSync übernimmt (verifiziert 2026-05-08, alle Edge-Cases getestet):**

| Stripe-Objekt | sevDesk-Objekt | Notiz |
|---|---|---|
| Customer | Contact | inkl. AT-Adresse, ohne UID (Kleinunternehmer) |
| Invoice (paid) | Voucher mit PDF-Anhang, Status `1000` (erfasst) | Description = Stripe-Invoice-Nummer |
| Invoice (open, Zahlung fehlt) | Voucher mit PDF-Anhang, Status `100` (Entwurf), payDate=None | Edge-Case Failed Payment — bleibt als Entwurf liegen |
| Charge (Zahlung) | CheckAccountTransaction auf "Stripe by MiracleSync" | "Payment - Invoice: ..." pro Charge |
| Stripe-Gebühr | CheckAccountTransaction (negativ) | "Fee - Stripe processing fees" pro Charge einzeln |
| Refund | CheckAccountTransaction (negativ) | "Refund - RefundId: re_..." — kein separater Gutschrift-Voucher, ursprünglicher Voucher bleibt unverändert |
| Plan-Wechsel mit Pro-Rata | Voucher mit `billing_reason=subscription_update` + Bank-TX | nur die Differenz (z. B. 12,99 € statt 16/29 €) |

**Setup-Schritte (~30 Min, kein Code):**

1. sevDesk-Account anlegen → Tarif "Buchhaltung" wählen (12-Mo-Vertrag, 70 % Rabatt erste 6 Mo)
2. **Stammdaten** in sevDesk:
   - Unternehmen: Wagner IT-Solutions e.U., FN 609574h, GISA 34399071, 1220 Wien
   - **Kleinunternehmer-Setting aktivieren** (`smallSettlement: 1`) → 0 % USt auf allen Belegen
   - **Kontenrahmen SKRAT** (Österreich) auswählen
3. **MiracleSync** im sevDesk-Marketplace aktivieren → Stripe-API-Key (Live, read-only ausreichend für Sync) hinterlegen
4. Erste Bank Geschäftskonto via PSD2-Banking-Schnittstelle in sevDesk verknüpfen → Stripe-Auszahlungen werden zugeordnet
5. Test-Sync mit 1–2 Live-Charges → prüfen: Voucher angelegt, PDF angehängt, Beträge stimmen, 0 % USt
6. Steuerberater-Mini-Termin (~100 €): smallSettlement-Setup + SKRAT-Kontenzuordnung bestätigen lassen, Workflow für USt-Wechsel-Schwelle abklären

**Manueller Aufwand danach:** ~5 Min/Mo (Sync-Status prüfen, Sonderfälle wie Refunds bestätigen). Quartals-EÜR via sevDesk-Export → FinanzOnline.

**Edge-Cases-Tests 2026-05-08 (alle verifiziert):**
- ✅ Refund: CheckAccountTransaction `-16 €` "Refund - RefundId" auf Stripe-CheckAccount, ursprünglicher Voucher bleibt unverändert (Storno-Logik via Banking, nicht Gutschrift-Voucher).
- ✅ Plan-Wechsel mit Pro-Rata: Stripe-Invoice mit `billing_reason=subscription_update` und Differenzbetrag wird korrekt als Voucher + Bank-TX gespiegelt.
- ⚠️ Failed Payment: Voucher wird als **Entwurf** (`status=100`, `payDate=None`) angelegt, KEINE Bank-TX (kein Geld geflossen). **Workflow-Implikation**: Bei Monats-/Quartalsabschluss Entwurfs-Vouchers sichten — entweder löschen (Karte definitiv tot) oder finalisieren (nachträglich gezahlt). Steuerberater-Workflow im Mini-Termin klären.

### Risiken (klar dokumentieren)

| # | Risiko | Mitigation |
|---|---|---|
| 1 | Stripe-Custom-Fields knapp (max 4) | Footer für Rest-Pflichtangaben — getestet |
| 2 | Stripe-Rechnungsnummern-Sequenz nicht änderbar | Beim ersten Setup final fixieren, dokumentieren bei Tool-Wechsel |
| 3 | MiracleSync-Drittanbieter-Abhängigkeit | Plugin pollt nur Stripe-Daten — bei Ausfall Stripe-Export → manueller sevDesk-Import möglich. Stripe bleibt Source of Truth. |
| 4 | Stripe versendet E-Mails (nicht sevDesk) | Im Support: bei "keine Rechnung erhalten" zuerst Stripe Dashboard prüfen |
| 5 | Stripe-Invoice-Layout nicht 100% AT-Standard | Steuerberater-Mini-Termin vor Go-Live für Bestätigung |
| 6 | Failed-Payment-Vouchers liegen als Entwurf (Status 100) | Monatlicher Sichtungs-Workflow im sevDesk: Entwürfe finalisieren oder löschen. Steuerberater im Mini-Termin abstimmen. |
| 7 | sevDesk-Buchungen Status `1000` ("erfasst", nicht final) | Steuerberater-Workflow klären: monatlich vs quartalsweise finalisieren |

### Steuerberater-Touchpoints

- **1× initial vor Live-Schaltung** (~30 Min, ~100 €): Setup-Check, AT-Konformität der Stripe-Invoice
- **1× bei USt-Wechsel** (ARR ≥ 45.000 €): Migrations-Plan, Stripe-Tax aktivieren
- **Ad-hoc** bei Spezialfragen

**Bewusst kein Steuerberater-Vollservice** — Self-Service via FinanzOnline reicht. Steuerberater nur für Spezialfragen + jährlichen Sanity-Check.

## 3.1 Trial-Setup

- **Trial-Dauer:** 7 Tage (wie Prototyp)
- **Trial-Start:** ab **Freigabe-Klick / Live-Schaltung** (nicht ab Generation oder Bestellung). Während Vorschau-Modus läuft Trial noch nicht.
- **Trial-Modus:** Vollzugriff inkl. Live-Schaltung der Subdomain — Wow-Moment ist Verkaufsargument
- **Live-Schaltungs-Workflow** (LIVE-COMPLIANCE § 1 #24): Nach Generation Kundenwahl zwischen „Jetzt live schalten" (Default) und „Erst prüfen" (Vorschau-Modus). Beide Wege erfordern Akzept-Checkbox + Freigabe-Klick.
- **Karten-Belastung:** Stripe `trial_period_days` — Karte wird erst nach Trial-Ende belastet. Bei Vorschau-Modus wird `trial_period_days` erst ab Freigabe-Klick gestartet (Stripe-Webhook `customer.subscription.trial_will_end` triggert dann erst).
- **Trial-Reminder:** T-3 Tage vor Trial-Ende (Lifecycle-Mail, OPERATIONS § 2)

## 3.2 Cancellation + Datenretention

| Phase | Dauer | Was passiert |
|---|---|---|
| **Reaktivierung** | 30 Tage | Subdomain bleibt erreichbar (mit Hinweis "Site pausiert"), Daten + Bilder vollständig erhalten, Reaktivierung mit einem Klick im Portal |
| **Soft-Delete** | weitere 60 Tage | Subdomain offline, Daten in DB markiert als deleted_at, kein Self-Service-Zugriff. Reaktivierung nur via Support-Anfrage. |
| **Endgültige Löschung** | nach 90 Tagen total | Hard-Delete inkl. Storage. Activity-Log-Eintrag mit Hash-Bestätigung. |

**Konsistent in:**
- AGB-Klausel "Vertragsende" innerhalb [`LIVE-COMPLIANCE.md` § 5 AGB-Skeleton](LIVE-COMPLIANCE.md#5-agb-skeleton-b2b-only)
- Datenschutzerklärung § Speicherdauer
- Stripe-Webhook `customer.subscription.deleted` triggert Phase 1

## 3.3 Re-Generation-Logik

**Architektur-Prinzip 2026-05-06: Serve-Time-Maximum.** Re-Generierung kostet Anthropic-Tokens und ist langsam — was serve-time ersetzt werden kann, wird serve-time ersetzt. Re-Gen bleibt **nur** für 2 Fälle. Detail in `OPERATIONS.md` § 8.4 + Memory `feedback_serve_time_maximum.md`.

| Auslöser | Mechanismus | UX |
|---|---|---|
| Berufsbezeichnung geändert ("Tischlerei" → "Möbelmanufaktur") | **serve-time** via `{{BEZEICHNUNG}}`-Placeholder | sofortige Vorschau, kein Re-Gen, keine Warnung |
| Anrede gewechselt (Sie ↔ Du) | **serve-time** via Anrede-Platzhalter (`{anrede_pron|Sie/du}` etc.) | sofortige Vorschau, kein Re-Gen, keine Warnung |
| Firmenname geändert | **serve-time** via `{{FIRMENNAME}}`-Placeholder | sofortige Vorschau, kein Re-Gen |
| Look gewechselt (Recipe innerhalb gleicher Berufsgruppe) | **serve-time** via Recipe-Konfig-Lookup (CSS-Klasse + Akzentfarbe + Layout + Section-Reihenfolge + Toggles) | sofortige Vorschau, Texte bleiben |
| Akzentfarbe geändert | **serve-time** (CSS-Token) | sofortige Vorschau |
| Logo getauscht | **serve-time** (Image-Replace) | sofortige Vorschau |
| Foto / Bewertung / Leistung-Beschreibung geändert | **serve-time** (DB-Read + HTML-Inject) | sofortige Vorschau |
| **Berufsgruppe-Wechsel** | **NICHT möglich** im Portal — Berufsgruppe nach Onboarding read-only. Korrektur via Support-Anfrage → Admin macht Site-Reset oder neue Site mit Daten-Übernahme. | Hinweis im Portal-Tab "Unternehmen": "Branchen-Änderung über Support" |
| Manueller "Neu generieren"-Button | **Re-Gen** (User-Trigger, Anrede + Inhalts-Tonfall komplett neu) | Rate-Limit: 3x pro 30 Tage. Warnung: "vorhandene Anpassungen gehen verloren" |
| Initiale Generierung beim Onboarding | **Re-Gen** (System-Trigger) | Build-Status-Anzeige |

**Voraussetzung Live-Bau:** Generierungs-Prompts in `functions/_lib/generate.js` müssen Placeholder konsequent verwenden — nie Klartext-Firmennamen oder fest-Anrede in Claude-Output. Aufwand ~2–3 Tage Prompt-Engineering + Replacement-Code + Migrations-Cron für bestehende Beta-Sites.

**Snapshot vor jedem Re-Gen:** automatisch in `order_snapshots`, Auto-Delete nach 30 Tagen.

## 3.4 Quality-Score-Schwellenwerte

Auto Quality-Check nach jeder Generierung — Score 0-100 (Title, Meta-Description, OG-Tags, H1, Viewport, Lang, Kontaktformular, Impressum-Link, Telefon, Email).

| Score | Reaktion |
|---|---|
| **< 70** | Auto-Re-Gen (System versucht es nochmal, max 1x), bei zweitem Fail Admin-Alarm |
| **70-85** | Admin-Alarm im Dashboard, Site bleibt sichtbar, Kunde merkt nichts |
| **> 85** | OK, kein Eingriff |

→ siehe `LIVE-COMPLIANCE.md` § 1 Strategie-Entscheidungen für weitere offene Punkte.

## 3.5 Einrichtungs-Service (149 EUR einmalig)

> **Status `[ENTSCHIEDEN 2026-05-16]` — Day-1 Live-Angebot.** Add-on zu Starter oder Professional, getrennte einmalige Werkleistung.

### Was es ist

Wir richten die Website gemeinsam mit dem Kunden ein, statt dass der Kunde den Self-Service-Fragebogen alleine durchgeht. Adressiert das „weiss-nicht-Lager" — KMU-Inhaber, die Tech-Reibung scheuen, aber mit Hilfe gerne ins Self-Service-Portal kommen.

### Was drin ist (Scope-Grenze)

- 30-60 Min Kunden-Call zur gemeinsamen Fragebogen-Befuellung
- Foto-Auswahl-Beratung (max 10-15 Fotos aus Kunden-Material oder Stock)
- Domain-Anbindung-Hilfe (DNS-Konfiguration auf Cloudflare-Pages-Zielsetzung)
- Freigabe-Klick-Begleitung vor Live-Schaltung

### Was NICHT drin ist

- Custom-Texte schreiben (KI-Generator wird normal verwendet)
- Foto-Beschaffung (Auswahl OK, aber keine professionellen Fotos organisieren)
- Logo-Erstellung
- Inhaltliche Pflege nach Live-Schaltung (kein Wartungs-Versprechen)

### Lifecycle-Mechanik

- **Stripe-One-Time-Product** `INSTANT_SETUP_149` separat zur Subscription
- **Trial-Mechanik:** Setup-Service ist Werkleistung — nicht refundierbar nach Erbringung. 7-Tage-Trial gilt nur fuer den Subscription-Teil (Starter/Pro) ab Freigabe-Klick
- **Volumen:** keine harte UI-Kappung Phase 1 („Verfuegbarkeit nach Terminvereinbarung, typisch 5 Werktage Vorlauf"). Re-Eval bei systematisch >5 Anfragen/Woche

### Workflow (Inhaber-Side)

1. Kunde bucht Setup-Service auf Pricing-Page (Stripe-Checkout zahlt 149 EUR sofort)
2. Inhaber bekommt Webhook + Mail-Trigger („Neuer Setup-Termin")
3. Inhaber kontaktiert Kunde via Mail mit 3 Terminvorschlaegen (vorgenerierte Vorlage)
4. Call: Inhaber + Kunde fuellen Onboarding-Fragebogen gemeinsam aus → Plattform-Generator laeuft normal
5. Kunde bekommt Plattform-Portal-Zugang fuer Eigen-Pflege ab Freigabe-Klick
6. Trial-Phase startet erst ab Freigabe-Klick (vgl. `LIVE-COMPLIANCE.md` § 1 #24)

### AGB-Verortung

Werkvertrag-Klausel in `LIVE-COMPLIANCE.md` § 5 AGB § 16 (neu nach Erweiterung 2026-05-16).

## 3.6 Custom-Sites — Professional Services (ab 990 EUR + 79 EUR/Mo)

> **Status `[ENTSCHIEDEN 2026-05-16]` — auf Anfrage, Day-1 Angebot.** Custom-Bau-Werkleistung von Wagner IT-Solutions, Hosting auf instantpage-Infrastruktur unter eigener Marke des Kunden.

### Was es ist

Individuelle Site, die der Inhaber speziell baut — unabhaengig von Standard-Recipes und Plattform-Generator. Anwendungsfall: Multipage-Sites, Custom-Sections (Werkstuecke-Tabellen, Vorher-Nachher-Slider), Member-Bereiche, E-Commerce-Anbindung, branchen-spezifische Funktionen ohne Plattform-Standard-Tauglichkeit. Geliefert als statische Site oder mit Backend-Anbindung, wie es das Projekt verlangt.

Referenz-Beispiel: **cpg.at** als erste Custom-Site einpflegbar sobald Live-Plattform steht.

### Was drin ist (Bau-Werkleistung 990 EUR+)

- Custom-Bau nach Kunden-Spec (HTML/CSS/JS, ggf. Backend-Anbindung)
- Iteratives Mockup → Freigabe → Live-Schaltung
- Domain-Anbindung
- Plattform-Hosting-Setup (Cloudflare-Pages-Routing auf Custom-Assets)
- AVV-Anhang-IV-Annex pro Custom-Site (Datenkategorien individuell)

### Hosting & Care (79 EUR/Mo, eigener Tarif)

**Drin:**
- Plattform-Infrastruktur (Cloudflare Pages, SSL, DNS, Backups)
- Uptime-Monitoring + Sicherheits-Updates auf Plattform-Ebene
- **1 Stunde Wartung/Monat** inkludiert: Bug-Fixes, kleine Text-/Bild-Wechsel, kleine Layout-Justierungen. Kein Carry-over zwischen Monaten
- Priority-Support 24h-Antwortzeit

**Nicht drin (separate Verrechnung 70 EUR/Std netto):**
- Groessere Redesigns, neue Features
- Browser-Kompatibilitaets-Sweeps ueber den 1-Std-Rahmen hinaus
- Code-Aenderungen am Custom-Build

**Bei systematisch >2 Std/Monat Wartungs-Bedarf:** optionales Wartungs-Paket (49-79 EUR/Mo zusaetzlich, je nach Umfang) wird vorgeschlagen.

### Brand-Kommunikation

Custom-Sites laufen technisch auf instantpage-Infrastruktur, **erscheinen aber unter der eigenen Marke des Kunden** — kein „Powered by instantpage"-Footer. instantpage ist Hosting-Provider, im Admin-Center fuer Inhaber + Kunde sichtbar, **fuer Endkunden der Custom-Site unsichtbar**.

### Reglementierte Berufe bei Custom-Sites

Werbeverbote (§ 45 RL-BA 2015, § 53 ÄrzteG etc.) gelten bei Custom-Bau weiter. Wagner IT-Solutions ist als Bau-Leistender mit-verantwortlich.

**Defensiv-Mechanik:**
- Kunde nimmt Site vor Live-Schaltung schriftlich ab (Werkvertrag-Abnahme, nicht nur Freigabe-Klick)
- Defensive Texte werden vom Kunden bereitgestellt oder gemeinsam formuliert — keine KI-Generierung mit Re-Gen-Trigger
- Kunde verantwortet Werbevorschriften-Einhaltung explizit (AGB-Klausel)

### Workflow

1. Anfrage via Kontakt-Mail oder Pricing-Page-Formular
2. Inhaber bewertet Scope + Aufwand-Schaetzung, sendet Angebot mit Fix-Preis ab 990 EUR
3. Auftragsbestaetigung + Anzahlung (z.B. 50 %) ueber Stripe-Custom-Invoice
4. Bau-Phase: iteratives Mockup → Kunden-Feedback → Iteration
5. Schriftliche Abnahme durch Kunde vor Live-Schaltung
6. Live-Schaltung + Custom-Hosting-Subscription startet (79 EUR/Mo)
7. Wartungs-Stunden werden im `activity_log` getrackt

### AGB-Verortung

Werkvertrag-Klausel in `LIVE-COMPLIANCE.md` § 5 AGB § 17 (neu nach Erweiterung 2026-05-16).

## 3.7 Whitelabel-Agentur-Programm (auf Anfrage, Phase 2-Vorbereitung)

> **Status `[VORBEREITUNG 2026-05-16]` — Vormerk-Form Day-1, Spec-Sprint ab 5 ernsthaften Anfragen.** Co-Branded-Light fuer Marketing-Agenturen mit eigenen KMU-Endkunden.

### Was es ist

Marketing-Agentur betreut ihre KMU-Endkunden mit instantpage-Sites unter eigener Marke. instantpage liefert Infrastruktur + Admin-Center, Agentur uebernimmt Endkunden-Beziehung.

### Was die Agentur bekommt (Co-Branded Light, Phase 2)

- **Eigenes Admin-Center auf instantpage.at/agentur** — Liste aller betreuten Sites, schnelles Wechseln, Sammel-Login
- **Sub-Konten fuer Mitarbeiter** der Agentur (optional)
- **Eine Sammel-Rechnung pro Monat** statt 1 Rechnung pro Site — Stripe-Customer = Agentur, jede Site = Subscription-Item
- **Volumen-Pauschale** (Preis-Modell wird nach 5+ Vormerker-Interviews finalisiert — bewusst offen kommuniziert als „Vorzugspreis fuer Erst-Agenturen")
- **Direkte Site-Anlage** ohne Trial-Phase (Agentur weiss was sie tut)

### Was auf den Endkunden-Sites passiert

- URL: `kunde.instantpage.at` oder eigene Domain `www.kunde.at`
- **Footer-Vermerk:** „Webseite betreut durch [Agentur-Logo] [Agentur-Name]" statt „Powered by instantpage"
- Endkunde sieht instantpage-Brand nicht in der UI
- Endkunden-Portal-Zugang: optional, je nach Agentur-Modell

### Was es NICHT ist (Phase 3-Stretch)

- Keine eigene Subdomain `sites.agentur.at`
- Kein Agentur-Logo im Admin-UI (instantpage-Brand bleibt im Admin sichtbar)
- Keine Custom-Domain auf Agentur-Ebene fuer alle Endkunden

### Compliance-Konstellation

- **Agentur = DSGVO-Verantwortlicher** fuer Endkunden-Daten
- **Wagner IT-Solutions = Auftragsverarbeiter** ueber Agentur (Sub-Auftragsverhaeltnis)
- AVV mit Agentur statt mit jedem einzelnen Endkunden — drei-Parteien-Vertrag (Endkunde-Agentur-Wagner) wird vor Phase-2-Aktivierung anwaltlich gepruelt
- **Insolvenz-Szenario:** Bei Agentur-Insolvenz — Endkunden-Sites laufen 90 Tage Grace, Inhaber bietet Direkt-Uebernahme an. Detail-Mechanik mit Anwalt vor Aktivierung

### Vormerk-Form Day-1

Pricing-Page-Karte „Whitelabel-Agentur-Programm" mit Mail-Formular: „Tragen Sie sich ein — wir entwickeln gerade Konditionen, Erst-Agenturen bekommen Vorzugspreis fuer 12 Monate."

### Architektonische Vorbereitung in Phase 0

- DB-Spalte `orders.agency_id` nullable angelegt (kein Funktions-Code, nur Schema-Vorhalt)
- Spec-Sprint ab 5+ ernsthaften Anfragen
- AGB-Klausel kommt erst bei Phase-2-Aktivierung (keine Standard-AGB-Klausel jetzt — Whitelabel laeuft ueber Einzelvertrag pro Agentur)

### AGB-Verortung

Whitelabel-Programme werden im Einzelvertrag mit der jeweiligen Agentur geregelt — keine eigene Standard-AGB-Klausel. Verweis-Hinweis in `LIVE-COMPLIANCE.md` § 5 AGB § 1 oder § 17.

---

## 4. Feature-Matrix pro Plan

Gruppierung nach Wert-Kategorien (Memory `feedback_pricing_features.md`: stärkste Features zeigen, keine Selbstverständlichkeiten wie "responsive" oder "Logo-Upload").

| Bereich | Starter (16 € / 14 € jährlich) | Professional (29 € / 25 € jährlich) | Custom-Sites (ab 990 € + 79 €/Mo) |
|---|---|---|---|
| **Inhalte** | KI-Texte für deine Branche, branchenspezifische Leistungen, FAQ-Automatik | identisch | individuelle Inhalte, Multipage, Custom-Sections — nicht KI-generiert |
| **Rechtssicherheit** | Impressum + Datenschutzerklärung automatisch, Bildrechte-Workflow, kein Cookie-Banner auf der Kundensite | identisch | Custom-Impressum + Custom-DSE (Kunde verantwortet), schriftliche Abnahme vor Live |
| **Sichtbarkeit** | Google-Maps eingebunden, Schema.org, Sitemap, mobile-optimiert | + AI-Sichtbarkeit (llms.txt für ChatGPT/Perplexity), IndexNow für Bing/Yandex | individuell konfigurierbar |
| **Domain** | Subdomain (firma.instantpage.at), SSL automatisch | + eigene Domain (www.firma.at) inkl. Setup-Anleitung | eigene Domain Standard, eigene Marke (kein instantpage-Branding) |
| **Erreichbarkeit** | Kontaktformular mit Mail-Zustellung | identisch | Custom-Formulare nach Anforderung |
| **Kontrolle** | Self-Service-Portal mit Logo, Fotos, Bewertungen, Team, Galerie und FAQ | + Besucher-Statistiken (cookielos), monatlicher Website-Report, ohne instantpage-Branding | Admin-Center fuer Hosting + Monitoring, inhaltliche Pflege durch Anbieter |
| **Wartung** | Plattform-Updates, kein Code-Eingriff noetig | identisch | **1 Std/Monat inkludiert** (Bug-Fixes, kleine Aenderungen); Mehrbedarf 70 EUR/Std |
| **Hilfe** | Wissensdatenbank, Diagnose-Assistent, Support-Mail (24–48h Antwort) | identisch | Priority-Support 24h-Antwort |

**Add-On Einrichtungs-Service (149 EUR einmalig):** kombinierbar mit Starter oder Professional — gemeinsame Befuellung des Onboarding-Fragebogens, Foto-Beratung, Domain-Anbindung-Hilfe, Freigabe-Begleitung. Siehe § 3.5.

**Business-Plan** = Coming Soon, **Whitelabel-Agentur** = auf Anfrage (Einzelvertrag, siehe § 3.7).

## 5. Pre-Purchase-Onboarding (Fragebogen)

→ Vollständige Spezifikation in [`RECIPE-SYSTEM.md`](RECIPE-SYSTEM.md) Abschnitt "Onboarding-Flow". Diese Doku verweist nur, hält keine eigene Beschreibung — Drift-Schutz.

## 6. Trial + Cancellation

Strategie-Entscheidungen aus [`LIVE-COMPLIANCE.md` § 1](LIVE-COMPLIANCE.md#1-strategie-entscheidungen):

- **Trial-Setup:** Live-Schaltung erlaubt (Wow-Moment als Verkaufsargument) — `[ENTSCHIEDEN]` #5
- **Trial-Dauer:** 7 Tage — `[ENTSCHIEDEN]` #6
- **Mindestvertragslaufzeit:** Monatsabo monatlich kündbar / Jahresabo 12 Monate — `[ENTSCHIEDEN]` #7
- **Datenretention nach Kündigung:** 30 Tage Reaktivierung + 60 Tage Soft-Delete + danach Hard-Delete (90 Tage total) — `[ENTSCHIEDEN]` #9

## 7. Self-Service-Portal Funktionen

Aus Prototyp-Bestand + Live-Erweiterungen. Tab-Reihenfolge folgt Website-Reihenfolge (Memory `feedback_portal_design.md`).

### 7.1 Post-Purchase Status-Flow

Status-Maschine **nach** abgeschlossenem Kauf (Pre-Purchase-Fragebogen siehe § 5):

1. `status = paid` → Onboarding-Screen: Fotos hochladen (optional), "Website erstellen" klicken
2. `status = in_arbeit` → Build-Screen mit "Status aktualisieren"
3. `status = bereit` → **Freigabe-Karte** mit Vorschau + Akzept-Checkbox („Mir ist bewusst, dass die Texte KI-generiert wurden und ich die Verantwortung für die Inhalte übernehme."). Zwei Buttons: **„Jetzt live schalten"** (Primary, Default-Fokus, erfüllt Brand-Versprechen) oder **„Erst prüfen"** (Secondary, öffnet Vorschau-Modus). Beide Wege erfordern aktivierte Checkbox.
4. **Vorschau-Modus:** Subdomain rendert mit `?preview=1`-Flag, NoIndex-Header, sichtbarer Vorschau-Banner („Diese Site ist noch nicht öffentlich. [Jetzt live schalten]"). Kunde kann beliebig lange prüfen + editieren.
5. `status = live` → Portal mit allen Tabs freigeschaltet. Subdomain öffentlich indexierbar. **Trial-Zähler startet erst hier** (siehe § 3.1).
6. Pflicht-Bestätigungen beim ersten Login: AGB + AVV ([`LIVE-COMPLIANCE.md` § 1](LIVE-COMPLIANCE.md#1-strategie-entscheidungen) #20) + Bildrechte ([`LIVE-COMPLIANCE.md` § 5](LIVE-COMPLIANCE.md#5-agb-skeleton-b2b-only) AGB-§ 7)
7. Freigabe-Klick wird dokumentiert in `live_freigaben`-Tabelle (`ARCHITECTURE.md` § 4.7) — Timestamp, IP, AGB-Version, AI-Disclosure-Text. Audit-Trail für AI-Act § 13 + AGB § 5 Abs 5.

**Re-Generation während Vorschau:** Beliebig oft möglich, kein Freigabe-Klick-Reset (die Freigabe bezieht sich auf das Konzept „KI-Inhalte gehen live", nicht auf jede einzelne Generation). Erste Freigabe = Live-Schaltung = endgültiger Zustands-Übergang.

### 7.2 Portal-Tabs (Sidebar-Gruppen)

**Gruppe "Inhalte meiner Website":**

| Tab | Funktionen |
|---|---|
| **Meine Website** | Status-Anzeige (Live-URL, HTTP-Status), Grunddaten (Firmenname, Branche, Kurzbeschreibung), Kontakt + Adresse, Öffnungszeiten, Social Media |
| **Leistungen** | Reihenfolge sortierbar, Beschreibungen pro Card, Pro-Service-Bilder mit Bildrechten-Bestätigung, "Zusätzliche Leistungen" Freitext |
| **Texte** | Über uns, Vorteile, Hero-Headline (auto-generiert, editierbar), Hero-Subline |
| **Bewertungen** | jsonb-Array CRUD: Name, Sterne, Text |
| **Galerie** | Multi-Upload mit Caption + Credit pro Bild, Anordnung |
| **Team** | jsonb-Array CRUD: Name, Titel, Bio, Foto, Foto-Credit |
| **FAQ** | jsonb-Array CRUD: Frage, Antwort. Alternativ: Auto-Generierung via `/api/generate-faq` (5 branchenspez.) |
| **Logo & Fotos** | Logo-Upload (Vorschau dunkel+hell), Hero-Bild, bis zu 5 Betriebsfotos. Bildrechten-Modal blockt bis Checkbox aktiviert. Audit-Trail mit IP. |
| **Section-Toggles** | sections_visible jsonb-Toggles: FAQ, Galerie, Fakten, Partner, Team an/aus |

**Gruppe "Einstellungen":**

| Tab | Funktionen |
|---|---|
| **Design** | Look wechseln (Recipe-Auswahl, **serve-time**), Akzentfarbe ändern (Vorschläge + Custom Picker, **serve-time**), Anrede umstellen (Sie/Du, **serve-time** via Platzhalter), Bezeichnung anpassen (**serve-time** via Placeholder), Live-Preview rechts daneben |
| **Unternehmen & Impressum** | Read-only — Änderungen via Support (48h, da rechtlich relevant). Pflichtfelder rechtsformabhängig: Unternehmensform, UID, FB-Nummer, GISA, Kammer, etc. **Berufsgruppe nach Onboarding read-only** (Tonfall + Recipe nicht änderbar via Self-Service — Korrektur über Support, Admin macht Site-Reset). |
| **SEO & Google** | Indexierungs-Status (echt aus Search Console API — siehe Status-Echtheit-Prinzip), llms.txt-Status, robots.txt-Vorschau |
| **Custom Domain** (Pro) | DNS-Anleitung CNAME-Setup, Domain-Verifikations-Status (pending → verifying → active), 301-Redirect von Subdomain |
| **Statistiken** (Pro) | Cloudflare Web Analytics: Besucher, Geräte, Referrer (cookieless, kein Banner) |

**Gruppe "Konto":**

| Tab | Funktionen |
|---|---|
| **Mein Account** | Email, Mitglied seit, Passwort ändern, Email-Adresse ändern, 2FA-Opt-in (Live, ARCHITECTURE § 10) |
| **Rechnungen** | Stripe-Zahlungshistorie + Billing-Portal-Link (Plan ändern, Pause, Kündigung) |
| **Beta-Feedback** | Nur Beta-Phase, in Live entfernt |
| **Support** | FAQ + Support-Formular, "Etwas funktioniert nicht?"-Diagnostik (siehe OPERATIONS § 1) |

### 7.3 Live-Preview-Engine

Bei jeder Design-Änderung im Design-Tab:
- Section rendert direkt rechts daneben
- **Alle Änderungen serve-time** (CSS-Klasse / Token / Placeholder-Replacement) — keine Re-Gen-Warnung mehr
- Stil-/Look-/Anrede-/Bezeichnungs-Wechsel: sofortige Vorschau ohne Token-Verbrauch
- Optional: "Vorschau anwenden" / "Verwerfen" für Test-Klicks vor Commit

### 7.4 Save-Pattern

- **Hybrid-Save:** Auto-Save bei Toggles + Sliders + Color-Picker; Save-Button bei Forms (Memory `feedback_portal_design.md`)
- Save-Indikator (Toast oder Inline-Status)
- Optimistic Updates wo möglich
- Undo pro Card (`[OFFEN]` Phase 2 Portal-Erweiterung)

### 7.5 Read-only-Bereiche (Änderung via Support)

- **Unternehmen & Impressum** — rechtlich kritisch, 48h Umsetzung via Support-Ticket
- **Berufsgruppe** — nach Onboarding nicht änderbar (Tonfall + Recipe). Korrektur via Support → Admin-Aktion `admin_berufsgruppe_reset` (Site-Reset oder Daten-Übernahme in neue Site)
- **Subdomain** — nicht änderbar nach Live-Schaltung (Redirects + SEO-Folgen)
- **Plan-Wechsel** — nur via Stripe Billing Portal

### 7.6 Mobile-Portal

- Hamburger-Menü ab Tablet-Breite
- Card-Layout 1-spaltig auf Mobile
- Touch-optimierte Targets (min 44×44px)
- File-Upload via Camera-Capture-Hint

### 7.7 Empty-States

Pro Tab eigener Empty-State mit klarem CTA:
- "Noch keine Bewertungen — füge die erste hinzu"
- "Noch kein Logo — Upload bringt 30% mehr Conversion" etc.

### 7.8 Diagnostik-Button "Etwas funktioniert nicht?"

In jedem Tab unten: Auto-Check (Logo lädt? Mail eingestellt? Domain konfiguriert?) → konkrete Lösungs-Anleitung statt nur Fehlermeldung. Memory `project_production_refactor.md` "Customer-Support Layer 2".

## 8. Markt-Positionierung

→ siehe `RECIPE-SYSTEM.md` "Markt-Positionierung".

## 9. Roadmap

**Public Roadmap** (mit Voting/Featurebase): **kein Public Roadmap zum Live-Start**. KMU-Zielgruppe nutzt Voting-Tools selten — Aufwand vs. Nutzen unverhältnismäßig (siehe Memory `project_production_refactor.md` „Public Roadmap & Feedback-Loop"). Erst bei 500+ Kunden überlegen.

**Public Changelog** unter `instantpage.at/changelog`:
- Quartalsweise Major-Releases mit klarem Thema (z.B. Q1: „Termin-Integration", Q2: „AI-Schreibassistent", Q3: „Pro-Plan launched", Q4: „Berufsgruppen-Refactor")
- Dazwischen Bugfixes und kleine Verbesserungen kontinuierlich, ohne großen Marketing-Push
- Eintragsformat in KMU-Sprache, nicht technisch

**Geparkte Quartal-Updates (Backlog):**
- **Portal-Inbox + Anfragen-Dashboard** — heute: Kontakt-/Reservierungs-/Termin-Formulare laufen als Pure Forwarder direkt an Kunden-Mailbox (siehe LIVE-COMPLIANCE.md Anhang IV). Quartal-Update: optionale Hybrid-Variante mit Portal-Inbox (Backup, Anfragen-Übersicht, Statistik, Spam-Filter). Nicht Live-Day-1-Pflicht.

**Kommunikation pro Major-Release:**
- Vor Release: Newsletter-Teaser („Nächste Woche kommt …")
- Bei Release: Changelog-Eintrag + Newsletter + In-App-Banner + ggf. Tutorial-Video

**Internal Roadmap:** in [`MIGRATION-PLAN.md`](MIGRATION-PLAN.md) (Phasen 0–4) und Memory `project_production_refactor.md`. Nicht öffentlich.

---

## Verbindung zu anderen Dokumenten

- `MIGRATION-PLAN.md` — wann welche Phase
- `RECIPE-SYSTEM.md` — Architektur Kundenwebsites
- `LIVE-COMPLIANCE.md` — rechtliche Constraints für Pricing, Trial, Cancellation
- `BRAND.md` — Voice & Tone für Marketing-Texte
- `business-case-kosten.md` — Wirtschaftlichkeit pro Plan
