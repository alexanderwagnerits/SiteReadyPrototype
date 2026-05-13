# Support-Confirmation — Eingangsbestaetigung

**Trigger:** Support-Anfrage ueber Kontakt-Form im Portal ODER per Mail an support@instantpage.at
**Absender:** support@instantpage.at
**Reply-To:** support@instantpage.at
**Versand:** Sofort nach Form-Submission (Auto-Reply)

---

## Variablen

`{{VORNAME}}`, `{{NACHNAME}}`

---

## Subject

```
Ihre Anfrage ist eingegangen
```

---

## Body (Plain)

```
Guten Tag {{VORNAME}} {{NACHNAME}},

Ihre Anfrage ist eingegangen und wird in der Regel innerhalb eines
Werktags bearbeitet (Mo–Fr, 09:00–17:00 Wien-Zeit).

Auf diese E-Mail koennen Sie direkt antworten, falls Sie ergaenzende
Informationen oder Anhaenge nachreichen moechten.

Mit freundlichen Gruessen
Ihr Instantpage.at-Team

---
Instantpage.at · support@instantpage.at
Impressum: instantpage.at/impressum · Datenschutz: instantpage.at/datenschutz
```

---

## Anmerkungen

- **Keine Ticket-ID** — fuer Solo-/Kleinteam-Operation Overengineering. Mail-Thread des Kunden uebernimmt die Zuordnung, kein paralleles Ticket-System noetig. Bei Skalierung (>50 Anfragen/Woche) Ticket-ID nachruesten.
- **Kein Anfrage-Text-Echo** — Kunde hat das Original in seinen gesendeten Mails, Echo waere redundant. Reduziert Mail-Laenge.
- **„Innerhalb eines Werktags"** statt „24 h" — klare Mo-Fr-Grenze. Wochenend-Anfragen werden Montag bearbeitet.
- **Kein „Bei Fragen erreichen Sie uns..."-Hinweis** — die Mail IST die Support-Antwort, eine Wiederholung des Support-Kanals waere redundant.
- **Kein „Vielen Dank fuer Ihre Nachricht"** — Floskel ohne Substanz, Stripe/Webflow-Pattern: faktischer Eroeffnungssatz.
