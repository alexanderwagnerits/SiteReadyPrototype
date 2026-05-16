# Aktionsrabatt-Ende — Erinnerung 14 Tage vor Ablauf

**Trigger:** Cron, 14 Tage vor Ablauf des Newcomer-Rabatts (`coupon NEWCOMER-20-FIRSTYEAR`, `duration: repeating, duration_in_months: 12`). Stripe-Webhook `customer.subscription.updated` oder Cron-Check ueber `subscription.discount.end`-Datum.
**Absender:** info@instantpage.at
**Reply-To:** support@instantpage.at
**Versand:** Cron taeglich 09:00 Wien-Zeit
**Skip-Bedingungen:** Subscription bereits gekuendigt ODER Rabatt-Coupon bereits abgelaufen ODER Kunde hat anderen Coupon

**Anzahl:** Einmalig. Kein zweiter Reminder, kein Last-Day-Reminder — analog Trial-Reminder, vermeidet Drueckerei-Vibe.

**Zweck:** Anti-Dark-Pattern-Defensiv-Mechanik fuer AGB § 9 Abs. 5 (`LIVE-COMPLIANCE.md` § 5). Reduziert Beschwerde-Risiko bei automatischem Wechsel auf regulaeren Tarif + UWG-Defensivitaet (siehe `legal-drafts/agb-selbstcheck.md` Nachtrag § 9 Abs. 5).

---

## Variablen

`{{VORNAME}}`, `{{NACHNAME}}`, `{{FIRMENNAME}}`, `{{PORTAL_URL}}`, `{{PLAN_NAME}}` (z.B. „Starter", „Professional"), `{{RABATT_END_DATE}}` (z.B. „14.08.2027"), `{{AKTUELLER_PREIS}}` (z.B. „12,80 EUR/Mo"), `{{REGULAERER_PREIS}}` (z.B. „16 EUR/Mo"), `{{ABRECHNUNGSPERIODE}}` (z.B. „monatlich" / „jaehrlich")

---

## Subject

```
Ihr Newcomer-Rabatt endet in 14 Tagen
```

(38 Zeichen. Faktisch, keine Urgency-Emojis, keine Ausrufezeichen.)

---

## Body (Plain)

```
Guten Tag {{VORNAME}} {{NACHNAME}},

vor knapp einem Jahr haben Sie {{FIRMENNAME}} bei uns gestartet — mit
dem Newcomer-Rabatt von 20 % auf das erste Jahr.

Dieser Rabatt endet am {{RABATT_END_DATE}}.

Ab der naechsten Abrechnung gilt der regulaere Tarif:

  Plan: {{PLAN_NAME}} ({{ABRECHNUNGSPERIODE}})
  Bisher: {{AKTUELLER_PREIS}}
  Ab {{RABATT_END_DATE}}: {{REGULAERER_PREIS}}

Sie muessen nichts unternehmen — Ihre Website laeuft normal weiter, die
Abbuchung erfolgt automatisch ueber Stripe.

Falls Sie Ihren Plan wechseln oder kuendigen moechten, koennen Sie das
jederzeit selbststaendig im Portal tun:

  Plan verwalten: {{PORTAL_URL}}/abo

Bei Fragen erreichen Sie uns unter support@instantpage.at.

Mit freundlichen Gruessen
Ihr Instantpage.at-Team

---
Instantpage.at · support@instantpage.at
Impressum: instantpage.at/impressum · Datenschutz: instantpage.at/datenschutz
```

---

## Anmerkungen

- **14-Tage-Timing** ist defensiv-fair: Kunde hat genug Zeit fuer Plan-Wechsel-Entscheidung oder Kuendigung zum Monatsende. Kuerzer (z.B. 7 Tage) wuerde als knapp empfunden, laenger (z.B. 30 Tage) verliert sich im Posteingang.
- **„Sie muessen nichts unternehmen"** ist zentral — Anti-Dark-Pattern, baut Vertrauen, reduziert Kuendigungs-Reflex. Stripe macht das automatisch, transparent kommunizieren statt verstecken.
- **Konkrete Preis-Differenz im Body** statt nur „regulaerer Tarif" — Kunde sieht die Zahl, kann nicht ueberrascht werden. Web-Recherche bestaetigt: explizite Preis-Nennung ist Trust-Signal, kein Conversion-Killer.
- **Self-Service-Portal-Link statt Support-Call** — KMU-tauglich, kein Sales-Anruf-Druck.
- **Kein Re-Activation-Offer** wie „Plan wechseln und 10 % sparen" — wuerde Newcomer-Rabatt-Mechanik unterlaufen + Drueckerei-Vibe + UWG-Risiko (verstecktes Lock-in nach Aktion ist genau der Grund warum Lifetime-Lock-Programme verworfen wurden, siehe `MARKETING.md` § 5 Anti-Patterns).
- **Pricing-Sync-Punkt:** Beim naechsten Pricing-Update in `PRODUCT.md` § 3 zwingend diese Mail mit-updaten (Variablen-System dynamisch, aber Logik der Mail bleibt gleich).
- **Aktivitaetsprotokoll:** Versand dieser Mail wird in `activity_log` mit `event_type='aktionsrabatt_reminder_sent'` festgehalten — fuer ggf. Beweis-Pflicht bei Beschwerden.

## Compliance-Verbindung

- `LIVE-COMPLIANCE.md` § 5 AGB § 9 Abs. 5 — Aktionsrabatt-Klausel + transparente End-Mitteilung
- `LIVE-COMPLIANCE.md` § 1 #11 — Kein Refund nach Trial-Ende-Logik (greift hier nicht, aber konsistent)
- `legal-drafts/agb-selbstcheck.md` Nachtrag § 9 Abs. 5 — defensiv gegen „dark-pattern"-Vorwurf bei UWG-Audit
- `MARKETING.md` § 3.1 Newcomer-Rabatt + § 5 Anti-Patterns — keine FOMO, kein Lifetime-Lock
- `OPERATIONS.md` § 2 Email-Templates — neue Eintrag in Lifecycle-Mail-Liste

## Stripe-Mechanik (technische Notiz fuer Live-Bau)

- Stripe-Coupon `NEWCOMER-20-FIRSTYEAR` mit `duration: repeating, duration_in_months: 12`
- 14 Tage vor Coupon-Ablauf: Cron-Check ueber `subscription.discount` (Stripe-API: `customer.subscriptions.list`, Discount-Objekt enthaelt `end`)
- Alternative: Stripe-Webhook `coupon.discount.changed` (falls vorhanden) → bei `discount.end` < now + 14 days Trigger
- Mail-Trigger via Resend, Variablen aus DB + Stripe-Subscription-API gerendert
