# Cancellation-Confirmation — Kuendigung bestaetigt

**Trigger:** Stripe-Webhook `customer.subscription.deleted` (Self-Service-Kuendigung im Portal oder Stripe Billing Portal oder Mail an support@ — alle Wege enden im selben Webhook)
**Absender:** info@instantpage.at
**Reply-To:** support@instantpage.at
**Versand:** Sofort nach Webhook-Eingang

---

## Variablen

`{{VORNAME}}`, `{{NACHNAME}}`, `{{FIRMENNAME}}`, `{{SITE_URL}}`, `{{PORTAL_URL}}`, `{{CANCELLATION_END_DATE}}`, `{{REACTIVATION_END_DATE}}`, `{{HARD_DELETE_DATE}}`, `{{EXPORT_URL}}`

**Datums-Logik:**
- `{{CANCELLATION_END_DATE}}` = Ende der bezahlten Periode (Stripe `current_period_end`) — bis dahin laeuft Website weiter
- `{{REACTIVATION_END_DATE}}` = `CANCELLATION_END_DATE + 30 Tage`
- `{{HARD_DELETE_DATE}}` = `CANCELLATION_END_DATE + 90 Tage`

---

## Subject

```
Kuendigung bestaetigt — {{FIRMENNAME}}
```

---

## Body (Plain)

```
Guten Tag {{VORNAME}} {{NACHNAME}},

wir bestaetigen die Beendigung Ihrer Mitgliedschaft bei instantpage.at.
Ihre Website {{SITE_URL}} bleibt bis {{CANCELLATION_END_DATE}} regulaer
online, danach wird sie pausiert.

Reaktivierung und Daten:

  - Bis {{REACTIVATION_END_DATE}}: Reaktivierung im Portal moeglich
  - Daten exportieren: {{EXPORT_URL}}
  - Endgueltige Loeschung am: {{HARD_DELETE_DATE}}

Bei Fragen erreichen Sie uns unter support@instantpage.at.

Mit freundlichen Gruessen
Ihr Instantpage.at-Team

---
Instantpage.at · support@instantpage.at
Impressum: instantpage.at/impressum · Datenschutz: instantpage.at/datenschutz
```

---

## Anmerkungen

- **Faktischer Eroeffnungssatz** ohne „Wir bedauern Ihre Entscheidung" o. ae. — Kuendigung ist Vertragsbeendigung, kein emotionales Ereignis.
- **Keine Win-Back-Aufforderung** und kein Feedback-Request — wuerde in einer Bestaetigungsmail aufdringlich wirken. Falls Feedback gewuenscht, gehoert es in den Cancellation-Flow im Portal (Optional-Frage vor Bestaetigung), nicht in die Mail.
- **3-Phasen-Logik kompakt** — Cancellation-End, Reaktivierung, Loeschung. Soft-Delete-Mittelphase wie in `trial-end-grace.md` nicht extra aufgelistet.
- **DSGVO-Konformitaet:** Loeschtermin transparent angekuendigt (Art. 5 + Art. 13), Export-Link prominent (Art. 20).
- **Cancellation-Final-Mail** (T-1 vor Hard-Delete) ist Live-Bau-Backlog — letzte Warnung vor endgueltiger Loeschung, gleicher Stil knapp.
