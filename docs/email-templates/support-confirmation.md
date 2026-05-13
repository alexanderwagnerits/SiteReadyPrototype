# Support-Confirmation — Bestaetigung bei Anfrage

**Trigger:** Kunde sendet Anfrage ueber Kontakt-Form im Portal ODER per Mail an support@instantpage.at
**Absender:** support@instantpage.at
**Reply-To:** support@instantpage.at
**Versand:** Sofort nach Form-Submission (Auto-Reply)

---

## Variablen

`{{ANREDE}}`, `{{TICKET_ID}}`, `{{ANFRAGE_BETREFF}}`, `{{ANFRAGE_TEXT}}`

---

## Subject

```
Ihre Anfrage ist bei uns: #{{TICKET_ID}}
```

(40 Zeichen. Ticket-ID gibt Tracking-Klarheit.)

---

## Body (Plain)

```
{{ANREDE}},

vielen Dank fuer Ihre Nachricht — wir haben sie erhalten und melden uns
in der Regel innerhalb eines Werktags zurueck (Mo-Fr, 09:00–17:00 Wien).

Ihre Anfrage zur Referenz:

  Ticket: #{{TICKET_ID}}
  Betreff: {{ANFRAGE_BETREFF}}

> {{ANFRAGE_TEXT}}

Falls Sie ergaenzende Informationen oder einen Screenshot nachreichen
moechten — antworten Sie einfach auf diese Mail. Die Ticket-ID bleibt
erhalten.

Beste Gruesse
Alexander Wagner
Wagner IT-Solutions e.U.

---
Support: support@instantpage.at
Portal: instantpage.at/portal

Wagner IT-Solutions e.U. · FN 609574h · 1220 Wien · instantpage.at
Diese E-Mail wurde automatisch versendet — Antworten landen im Support-Postfach.
```

---

## Anmerkungen

- **Antwort-Erwartung „innerhalb eines Werktags"** — realistisch fuer Solo-Operation. Nicht „innerhalb 24 h" (impliziert 7-Tage-Service), sondern „Werktag" (klare Mo-Fr-Grenze). Wochenend-Anfragen werden Montag bearbeitet.
- **Ticket-ID** Format z.B. `IPT-2026-0517` (Year + Sequence) oder einfach Stripe-aehnliche Random-IDs `tkt_a1b2c3d4` — Live-Bau-Entscheidung. Wichtig: konsistent ueber alle Touchpoints.
- **Anfrage-Text im Quote** — Kunde sieht was er geschrieben hat, kann ggf. nachschaerfen.
- **Footer-Variante** weicht ab vom Master: „Diese E-Mail wurde automatisch versendet" als Hinweis-Klarheit, weil Auto-Reply.
- **Kein** Marketing-Cross-Sell („Haben Sie schon unseren Pro-Plan gesehen?") — Support-Mail ist Support-Mail. Vertrauen schaedigend.
