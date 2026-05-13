# Payment-Failed — Zahlung fehlgeschlagen

**Trigger:** Stripe-Webhook `invoice.payment_failed`
**Absender:** rechnung@instantpage.at
**Reply-To:** rechnung@instantpage.at
**Versand:** Sofort nach Webhook-Eingang
**Anzahl:** Einmalig — kein Retry-Spam. Stripe Smart Retries laufen automatisch im Hintergrund (4 Versuche ueber 3 Wochen). Bei finalem Fehlschlag separate Mail vor Pausierung (Live-Bau-Backlog).

---

## Variablen

`{{VORNAME}}`, `{{NACHNAME}}`, `{{BETRAG}}`, `{{PLAN_NAME}}`, `{{STRIPE_PORTAL_URL}}`

---

## Subject

```
Zahlung fehlgeschlagen
```

---

## Body (Plain)

```
Guten Tag {{VORNAME}} {{NACHNAME}},

die Abbuchung fuer Ihre instantpage.at-Mitgliedschaft konnte nicht
durchgefuehrt werden ({{BETRAG}}, Plan {{PLAN_NAME}}).

Bitte aktualisieren Sie Ihre Zahlungsmethode, damit Ihre Website
ohne Unterbrechung online bleibt:

  Zahlungsmethode aktualisieren: {{STRIPE_PORTAL_URL}}

Wir versuchen die Abbuchung in den kommenden Tagen automatisch erneut.
Sollten alle Versuche fehlschlagen, wird die Website pausiert; Ihre
Daten bleiben dann 30 Tage erhalten.

Bei Fragen erreichen Sie uns unter rechnung@instantpage.at.

Mit freundlichen Gruessen
Ihr Instantpage.at-Team

---
Instantpage.at · rechnung@instantpage.at
Impressum: instantpage.at/impressum · Datenschutz: instantpage.at/datenschutz
```

---

## Anmerkungen

- **Eine Mail, kein Retry-Sequenz** — Stripe Smart Retries laufen unsichtbar weiter, der Kunde bekommt also nicht 4x dieselbe Mahnung. Etablierter Standard (Stripe-Best-Practice, Web-Recherche bestaetigt).
- **Keine Ursachen-Aufzaehlung** („abgelaufene Karte oder unzureichende Deckung") — Kunde weiss das selber. Nur Aufforderung zur Aktion.
- **{{BETRAG}} statt {{BETRAG_BRUTTO}}** — bei Kleinunternehmer kein Brutto/Netto-Split, „16 €" reicht.
- **Reply-To rechnung@** — Rechnungsthemen gebuendelt, nicht im allgemeinen Support-Postfach.
- **Anwalts-Audit-Punkt:** Wording „pausieren" (vs „kuendigen") — FAGG-relevant, AGB sollte das so abbilden.
