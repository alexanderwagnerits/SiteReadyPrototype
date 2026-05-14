# Email-Templates — Lifecycle-Mails

> Markdown-Drafts fuer alle Lifecycle-Mails der Plattform. Werden im Live-Bau in Resend-Templates ueberfuehrt (HTML + Plain) und ueber [`config/legal-values.ts`](../LIVE-COMPLIANCE.md) parametriert.

**Stand:** 2026-05-14 — `[SPEC-FERTIG]` 10 Templates spec'd (6 Lifecycle + 4 Phase-2). HTML-Templates fuer Resend werden im Live-Bau Phase 0 daraus abgeleitet.

---

## Inhalt

### Lifecycle (automatisiert)

| Template | Trigger | Absender | Reply-To |
|---|---|---|---|
| [welcome.md](welcome.md) | Site-Generation (`status = live`) | info@instantpage.at | support@instantpage.at |
| [trial-reminder.md](trial-reminder.md) | T+4 (T-3 vor Trial-Ende), einmalig | info@instantpage.at | support@instantpage.at |
| [trial-end-grace.md](trial-end-grace.md) | T+8 (Trial abgelaufen, Site pausiert) | info@instantpage.at | support@instantpage.at |
| [payment-failed.md](payment-failed.md) | Stripe-Webhook `invoice.payment_failed`, einmalig | rechnung@instantpage.at | rechnung@instantpage.at |
| [cancellation-confirmation.md](cancellation-confirmation.md) | Stripe-Webhook `customer.subscription.deleted` | info@instantpage.at | support@instantpage.at |
| [cancellation-final.md](cancellation-final.md) | Cron T-1 vor Hard-Delete (89 Tage nach Cancellation) | info@instantpage.at | support@instantpage.at |
| [support-confirmation.md](support-confirmation.md) | Support-Form-Submission (Auto-Reply) | support@instantpage.at | support@instantpage.at |
| [domain-setup.md](domain-setup.md) | Pro-Plan: Kunde traegt Custom-Domain im Portal ein | info@instantpage.at | support@instantpage.at |

### Manuell / On-Demand

| Template | Trigger | Absender | Reply-To |
|---|---|---|---|
| [datenpanne.md](datenpanne.md) | Manueller Versand nach DSB-Meldung (Art. 34 DSGVO, bei hohem Risiko) | datenschutz@instantpage.at | datenschutz@instantpage.at |
| [beta-cutover.md](beta-cutover.md) | Einmaliger Batch-Versand T-7 vor Live-Schaltung | info@instantpage.at | support@instantpage.at |

**Bewusst gestrichen:** Doppelter Trial-Reminder (Tag 7), Win-Back, Welcome-Pro — etablierte Anbieter (Stripe/Webflow/Squarespace) machen das nicht, im AT-Vertrauensprodukt-Kontext aufdringlich.

**Stripe-Default (kein eigenes Markdown-Template):** Payment-Confirmation / Rechnung wird automatisch von Stripe versendet (Hosted-Invoice mit AT-Custom-Fields, Tax-Exempt, KU-Klausel als Custom-Field). Stripe-Dashboard-Template-Konfig dokumentiert in [`OPERATIONS.md`](../OPERATIONS.md) § 2.

---

## Voice + Tone (Master)

Aus [`BRAND.md`](../BRAND.md) § 5.4:

> Lifecycle-Mails (Trial, Reminder, Cancellation): **freundlich, knapp, ohne Marketing-Drueckerei**.

**Voice-Standard (orientiert an Stripe / Webflow / Squarespace-Lifecycle-Mails):**

- **Sachlich-professionell.** Faktischer Eroeffnungssatz mit zentralem Fakt, keine Plauder-Phrasen („Wir lesen mit", „Das passiert haeufiger als man denkt").
- **Strukturiert.** 1–2 Saetze Kontext → Bullet-Liste mit Fakten/Optionen → ein klarer CTA → Sign-Off. Keine Fliesstext-Argumentation.
- **Anrede „Sie"** ausnahmslos (B2B-Standard AT).
- **Verboten:** „Premium", „Sofort!", „Verpassen Sie nicht!", „Sichern Sie sich!", Ausrufezeichen in Subjects, doppelte Aufforderungen.
- **Verboten (Compliance):** „rechtliche Pflichten", „Pflichtangaben" (siehe Memory `feedback_keine_rechtliche_pflichten.md`).
- **Subjects:** max. 55 Zeichen, sachlich, kein Klick-Bait, keine Ausrufezeichen.
- **Body:** max. 120 Worte, eine Hauptbotschaft, ein CTA.
- **Sign-Off:** „Mit freundlichen Gruessen / Ihr Instantpage.at-Team" — **immer Team-Signatur, nie Persona** (Konsistenz, skaliert mit Wachstum).

**Wording-Marker (Master, in allen Templates konsistent):**
- Pricing: „16 € / Monat netto" (Starter), „29 € / Monat netto" (Professional) — netto-Auszeichnung B2B-Standard
- Trial: „kostenlose Testphase" (nicht „Trial", KMU-Sprache)
- Cancellation: „beendet" (nicht „gekuendigt" — neutraler, weniger formal)
- Plan-Wahl: „Plan auswaehlen" (nicht „Upgrade", „aktivieren")
- Reaktivierung: „Reaktivierungsfrist" (klar terminiert) statt „Grace-Period" (Fachjargon)

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

**Anrede-Logik (Master, in allen Templates konsistent):**

```
{{ANREDE}} =
  if VORNAME && NACHNAME → "Guten Tag {{VORNAME}} {{NACHNAME}}"
  elif VORNAME           → "Guten Tag {{VORNAME}}"
  elif NACHNAME          → "Guten Tag {{NACHNAME}}"
  else                   → "Guten Tag"
```

**Begruendung „Guten Tag" statt „Sehr geehrte/r":**
- „Sehr geehrte/r" mit Schraegstrich ist AT-Behoerden-Bürokratie-Sound, wirkt in B2B-Lifecycle-Mails steif.
- „Guten Tag" ist neutral-professionell, geschlechtsneutral ohne Schraegstrich-Kruecke, B2B-AT-tauglich.
- Sie-Form bleibt unveraendert erhalten (BRAND.md § 6.1 Lock).
- Fallback-Kaskade verhindert peinliche Konstrukte wie „Guten Tag  ," bei fehlenden DB-Feldern.

**Onboarding-Implikation:** Vorname + Nachname sollten Pflichtfelder im Bestellformular sein (entspricht aktuellem Beta-Onboarding `src/data.js`). Bei Import-Migration aus Beta ggf. Backfill noetig.

---

## Email-Adressen (Master-Konvention)

**Quelle der Wahrheit:** [`LIVE-COMPLIANCE.md`](../LIVE-COMPLIANCE.md) § 1 (Mail-Adressen).

| Adresse | Verwendung | Reply-To |
|---|---|---|
| `info@instantpage.at` | Lifecycle (Welcome, Trial, Win-Back, Welcome-Pro) | `support@instantpage.at` |
| `rechnung@instantpage.at` | Stripe-Webhooks (Payment-Failed, Payment-Confirmation, Invoices) | `rechnung@instantpage.at` |
| `support@instantpage.at` | Auto-Reply Support-Form, Support-Antworten | `support@instantpage.at` |
| `news@instantpage.at` | Newsletter (separates Opt-In, NICHT in dieser Sammlung) | `news@instantpage.at` |
| `datenschutz@instantpage.at` | DSGVO-Anfragen, Datenpannen-Benachrichtigung | `datenschutz@instantpage.at` |

**Niemals** als Absender verwenden: `alexander@wagner-its.com` (private Inhaber-Mail), `noreply@*` (untergraebt Vertrauen + Spam-Filter-negativ).

---

## Footer (Master, in allen Templates identisch)

```
---
{{FIRMENNAME}}-Website: {{SITE_URL}}
Portal: {{PORTAL_URL}}

Wagner IT-Solutions e.U. · FN 609574h · 1220 Wien · instantpage.at
Sie erhalten diese E-Mail im Rahmen Ihrer Mitgliedschaft bei instantpage.at.
Lifecycle-Mails sind Vertragsbestandteil und nicht abbestellbar.
Newsletter abbestellen: news@instantpage.at
```

**Begruendung „nicht abbestellbar":** Lifecycle-Mails sind Vertragsbestandteil (Trial-Ende-Hinweis, Rechnung, Cancellation-Bestaetigung) — keine Werbung im Sinne des § 7 UWG, daher keine Opt-Out-Pflicht. Newsletter ist separat (`news@instantpage.at`) und Opt-In-pflichtig.

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
