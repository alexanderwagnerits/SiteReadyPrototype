# Trial-Reminder — T-3 vor Trial-Ende

**Trigger:** Cron, T+4 nach Trial-Start (= 3 Tage vor Trial-Ende), nur an aktive Trials ohne hinterlegte Zahlungsmethode
**Absender:** info@instantpage.at
**Reply-To:** support@instantpage.at
**Versand:** Cron taeglich 09:00 Wien-Zeit
**Skip-Bedingungen:** Plan bereits gewaehlt (`subscriptions.status IN ('active', 'past_due')`) ODER Site wurde nie angesehen seit Generierung (= abgesprungen)

**Anzahl:** Einmalig. Kein zweiter Reminder, kein Last-Day-Reminder — entspricht Stripe/Webflow/Squarespace-Standard und vermeidet Drueckerei-Vibe.

---

## Variablen

`{{VORNAME}}`, `{{NACHNAME}}`, `{{FIRMENNAME}}`, `{{SITE_URL}}`, `{{PORTAL_URL}}`, `{{TRIAL_END_DATE}}`

---

## Subject

```
Ihre Testphase endet in 3 Tagen
```

(31 Zeichen. Faktisch, keine Urgency-Emojis, keine Ausrufezeichen.)

---

## Body (Plain)

```
Guten Tag {{VORNAME}} {{NACHNAME}},

Ihre kostenlose Testphase fuer {{FIRMENNAME}} endet am {{TRIAL_END_DATE}}.

Wenn Sie die Website weiter nutzen moechten, waehlen Sie bitte einen
Plan im Portal — die Website bleibt dann unterbrechungsfrei online.

  Plan auswaehlen: {{PORTAL_URL}}/abo

Plan-Uebersicht:

  - Starter: 16 € pro Monat (14 € pro Monat im Jahresabo)
  - Professional: 29 € pro Monat (25 € pro Monat im Jahresabo)

Wenn keine Aktion erfolgt, wird die Website nach Ablauf der Testphase
automatisch pausiert. Ihre Daten bleiben 30 Tage erhalten und koennen
in dieser Frist jederzeit reaktiviert werden.

Bei Fragen erreichen Sie uns unter support@instantpage.at.

Mit freundlichen Gruessen
Ihr Instantpage.at-Team

---
Instantpage.at · support@instantpage.at
Impressum: instantpage.at/impressum · Datenschutz: instantpage.at/datenschutz
```

---

## Anmerkungen

- **T-3 Timing** entspricht PRODUCT.md § 3.1 — gibt 3 volle Werktage zur Reaktion. Stripe-Default ist 7 Tage, aber bei 7-Tage-Trial wirkt 7-Tage-Reminder zynisch.
- **Plan-Preise im Body** statt nur Pricing-Page-Link — Web-Agent-Recherche hat das als „eine Klick-Reibung weniger" bestaetigt, fuer Trial-Reminder gerechtfertigt. Drift-Risiko: bei Pricing-Aenderung muss diese Mail mit-aktualisiert werden (Live-Bau-Notiz).
- **Keine KU-Klausel in dieser Mail** — Kleinunternehmer-Hinweis gehoert auf die echte Rechnung (Stripe-Receipt-Template) sowie in AGB und Pricing-Page-Footnote, nicht in eine Trial-Reminder. Wuerde Lesefluss unnoetig stoeren.
- **„Keine Aktion erfolgt" / „automatisch pausiert"** — klare „Nichts-zu-tun"-Option. Reduziert Auto-Abo-Angst, baut Vertrauen.
- **Kein Last-Day-Reminder** (Tag 7) — etablierte SaaS-Standard ist ein Reminder. Doppelte Reminder werden im DACH-B2B-Segment als aufdringlich empfunden (Web-Recherche).
- **Pricing-Sync-Punkt:** Beim naechsten Pricing-Update in PRODUCT.md § 3 zwingend diese Mail mit-updaten (DRY-Verstoss bewusst akzeptiert).
