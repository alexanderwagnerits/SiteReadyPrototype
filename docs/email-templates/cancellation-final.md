# Cancellation-Final — letzte Warnung vor Loeschung

**Trigger:** Cron, T-1 vor `{{HARD_DELETE_DATE}}` (89 Tage nach Cancellation, 1 Tag vor endgueltiger Loeschung). Nur versenden, wenn der Kunde im Grace-Zeitraum nicht reaktiviert hat.
**Absender:** info@instantpage.at
**Reply-To:** support@instantpage.at
**Versand:** Cron 09:00 Wien-Zeit

---

## Variablen

`{{VORNAME}}`, `{{NACHNAME}}`, `{{FIRMENNAME}}`, `{{HARD_DELETE_DATE}}`, `{{EXPORT_URL}}`

---

## Subject

```
Letzte Erinnerung: Daten-Export bis {{HARD_DELETE_DATE}}
```

(Beispiel mit Datum „18. August 2026" → 54 Zeichen. Sachlich, kein Klick-Bait.)

---

## Body (Plain)

```
Guten Tag {{VORNAME}} {{NACHNAME}},

am {{HARD_DELETE_DATE}} werden die Daten Ihrer Website fuer
{{FIRMENNAME}} endgueltig geloescht. Eine Reaktivierung ist nach
diesem Termin nicht mehr moeglich.

Bis dahin koennen Sie Ihre Daten noch herunterladen:

  Daten exportieren: {{EXPORT_URL}}

Diese Mail erhalten Sie automatisch als letzte Erinnerung. Sollten
Sie keinen Export benoetigen, ist keine weitere Aktion erforderlich.

Bei Fragen erreichen Sie uns unter support@instantpage.at.

Mit freundlichen Gruessen
Ihr Instantpage.at-Team

---
Instantpage.at · support@instantpage.at
Impressum: instantpage.at/impressum · Datenschutz: instantpage.at/datenschutz
```

---

## Anmerkungen

- **DSGVO Art. 5 + Art. 13:** transparente Vorab-Information zum Loeschtermin. Diese Mail erfuellt zusammen mit `cancellation-confirmation.md` (T+0) und `trial-end-grace.md` (bei Trial) die Hinweispflicht.
- **DSGVO Art. 20:** Export-Link prominent (Recht auf Datenuebertragbarkeit). Wenn der Kunde bis hierher nichts exportiert hat, ist das die letzte Chance.
- **„Keine weitere Aktion erforderlich"** — bewusster Hinweis. Stripe/Webflow vermeiden hier Re-Engagement-Druck; Cancellation war eine Vertragsentscheidung des Kunden.
- **Keine Reaktivierungs-Option mehr nennen** — Reaktivierung ist nach 30 Tagen (siehe `cancellation-confirmation.md`) ohnehin nicht mehr Self-Service moeglich, und in der letzten Phase nicht mehr beworben. Wer reaktivieren will, kontaktiert ohnehin den Support.
- **Versand-Bedingung:** Nur wenn `subscriptions.status = canceled` UND keine Reaktivierung im Grace-Zeitraum. Reaktivierte Konten loeschen das Cancellation-Flag und triggern diese Mail nicht.
