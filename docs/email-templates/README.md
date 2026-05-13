# Email-Templates — Lifecycle-Mails

> Markdown-Drafts fuer alle Lifecycle-Mails der Plattform. Werden im Live-Bau in Resend-Templates ueberfuehrt (HTML + Plain) und ueber [`config/legal-values.ts`](../LIVE-COMPLIANCE.md) parametriert.

**Stand:** 2026-05-13 — `[SPEC-FERTIG]` 8 Anker-Templates spec'd. HTML-Templates fuer Resend werden im Live-Bau Phase 0 daraus abgeleitet.

---

## Inhalt

| Template | Trigger | Absender | Status |
|---|---|---|---|
| [welcome.md](welcome.md) | Nach Site-Generation (erster Login) | info@instantpage.at | Draft |
| [trial-reminder-day-5.md](trial-reminder-day-5.md) | T+5 nach Trial-Start (T-2 vor Ende) | info@instantpage.at | Draft |
| [trial-reminder-day-7.md](trial-reminder-day-7.md) | T+7 letzter Tag vor Stripe-Aktivierung | info@instantpage.at | Draft |
| [trial-end-grace.md](trial-end-grace.md) | Nach Trial-Ende ohne Plan (Grace startet) | info@instantpage.at | Draft |
| [stripe-payment-failed.md](stripe-payment-failed.md) | Stripe-Webhook `invoice.payment_failed` | rechnung@instantpage.at | Draft |
| [win-back.md](win-back.md) | T+14 nach Cancellation (Reaktivierungs-Versuch) | info@instantpage.at | Draft |
| [support-confirmation.md](support-confirmation.md) | Bei Support-Anfrage ueber Kontaktform | support@instantpage.at | Draft |
| [welcome-pro.md](welcome-pro.md) | Plan-Upgrade Starter → Professional | info@instantpage.at | Draft |

---

## Voice + Tone (Master)

Aus [`BRAND.md`](../BRAND.md) § 5.4:

> Lifecycle-Mails (Trial, Reminder, Cancellation): **freundlich, knapp, ohne Marketing-Drueckerei**.

Konkret:
- Anrede **„Sie"** ausnahmslos (B2B-Standard AT)
- **Kein** „Premium", „Sofort!", „Verpassen Sie nicht!", „Sichern Sie sich!"
- **Kein** „rechtliche Pflichten", „Pflichtangaben" (siehe Memory `feedback_keine_rechtliche_pflichten.md`)
- Subjects: max. 50 Zeichen, sachlich, kein Klick-Bait
- Body: max. 100 Worte (Welcome 150), eine Hauptbotschaft, ein CTA
- Schluss: oesterreichische Hoeflichkeit („Beste Gruesse"), Vorname Inhaber

**Wording-Marker (Master, in allen Templates konsistent):**
- Pricing: „16 €/Monat" (Starter), „29 €/Monat" (Professional) — netto (B2B-Standard)
- Trial: „kostenlose Testphase" (nicht „Trial", KMU-Sprache)
- Cancellation: „beendet" (nicht „gekuendigt" — weniger formal)
- Plan-Wahl: „Plan waehlen" (nicht „Upgrade", „aktivieren")

---

## Variablen-Konvention

Doppel-geschweifte Klammern, wie das bestehende Template-System ([`functions/templates/template.js`](../../functions/templates/template.js)):

**Master-Variablen** (in mehreren Templates):

| Variable | Beispielwert | Quelle |
|---|---|---|
| `{{FIRMENNAME}}` | Tischlerei Pichler | `kunden.firmenname` |
| `{{INHABER_VORNAME}}` | Alexander | `kunden.inhaber_vorname` (Fallback: leer) |
| `{{INHABER_NACHNAME}}` | Wagner | `kunden.inhaber_nachname` |
| `{{SUBDOMAIN}}` | tischlerei-pichler | `kunden.subdomain` |
| `{{SITE_URL}}` | https://tischlerei-pichler.instantpage.at | abgeleitet |
| `{{PORTAL_URL}}` | https://instantpage.at/portal | konstant |
| `{{PLAN_NAME}}` | Starter / Professional | `subscriptions.plan` |
| `{{BETRAG_NETTO}}` | 16,00 € | `invoices.amount_net` |
| `{{TRIAL_END_DATE}}` | 20. Mai 2026 | `subscriptions.trial_end` (AT-Format) |
| `{{REACTIVATION_END_DATE}}` | 19. Juni 2026 | `cancellation_at + 30d` |
| `{{HARD_DELETE_DATE}}` | 18. August 2026 | `cancellation_at + 90d` |
| `{{STRIPE_PORTAL_URL}}` | https://billing.stripe.com/... | Stripe Customer-Portal |
| `{{EXPORT_URL}}` | https://instantpage.at/portal/export | konstant |

**Anrede-Logik:**

```
{{ANREDE}} =
  if INHABER_VORNAME && INHABER_NACHNAME → "Sehr geehrte/r {{INHABER_VORNAME}} {{INHABER_NACHNAME}}"
  elif INHABER_NACHNAME → "Sehr geehrte/r Herr/Frau {{INHABER_NACHNAME}}"
  else → "Guten Tag"
```

Geschlechts-Anrede „geehrter/geehrte" wird nicht aufgeloest (kein Geschlecht-Feld im Onboarding). Defensiv „Sehr geehrte/r" als geschlechtsneutrale Form, wie in AT-Behoerdenbriefen ueblich.

---

## Footer (Master, in allen Templates identisch)

```
---
{{FIRMENNAME}}-Site: {{SITE_URL}}
Portal: {{PORTAL_URL}}

Wagner IT-Solutions e.U. · FN 609574h · 1220 Wien · instantpage.at
Sie erhalten diese E-Mail als aktiver Kunde von instantpage.at.
Abmelden von Lifecycle-Mails ist nicht moeglich (Vertragsbestandteil).
Newsletter abmelden: news@instantpage.at
```

**Begruendung „Abmelden nicht moeglich":** Lifecycle-Mails sind Vertragsbestandteil (Trial-Ende-Hinweis, Rechnung, Cancellation-Bestaetigung) — keine Werbung im Sinne des § 7 UWG, daher kein Opt-Out-Pflicht. Newsletter ist separat (`news@instantpage.at`) und Opt-In-pflichtig.

---

## Provider-Setup (Live-Bau)

- **Resend** (`[ENTSCHIEDEN 2026-05-04]`, siehe LIVE-COMPLIANCE § 1 #13)
- SPF / DKIM / DMARC fuer `instantpage.at`
- Absender-Domain `instantpage.at` (nicht `noreply@`, fuer bessere Zustellbarkeit + persoenlicher Vibe)
- Reply-To je Template (info@ / support@ / rechnung@ je nach Kontext)
- Plain-Text-Variante zusaetzlich zu HTML (Spam-Filter-Hygiene)

---

## Compliance-Hinweise

- **DSGVO Art. 13:** Lifecycle-Mails sind keine Marketing — keine Einwilligung noetig, aber Hinweis im AGB
- **§ 7 UWG:** keine Werbung in transaktionalen Mails — Win-Back ist Grenzbereich (siehe `win-back.md`-Hinweis)
- **§ 109 TKG:** Newsletter-Mails (separates Opt-In) **nicht** in dieser Lifecycle-Sammlung
- **Anwalt-Audit-Punkt:** Win-Back-Mail-Texte vor Live-Schaltung pruefen (Grenze transaktional vs Werbung)

---

## Verbindung zu anderen Dokumenten

- [`OPERATIONS.md`](../OPERATIONS.md) § 2 — Trigger-Tabelle, Provider-Setup
- [`BRAND.md`](../BRAND.md) § 5.4 — Voice-Definition
- [`LIVE-COMPLIANCE.md`](../LIVE-COMPLIANCE.md) § 1 #13 — Resend-Entscheidung, § 1 #6 — Trial-Dauer, § 1 #9 — Grace-Period
- [`PRODUCT.md`](../PRODUCT.md) § 3.1 — Trial-Setup, § 3.2 — Cancellation/Grace
