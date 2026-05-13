# Trial-End — Grace-Period startet

**Trigger:** Cron, T+8 nach Trial-Start (Trial ist abgelaufen, kein Plan gewaehlt) — Site wird pausiert, Grace-Period (30 Tage Reaktivierung) startet
**Absender:** info@instantpage.at
**Reply-To:** support@instantpage.at
**Versand:** Cron 09:00 Wien-Zeit (kurz nach Pausierung 00:00)

---

## Variablen

`{{ANREDE}}`, `{{FIRMENNAME}}`, `{{SITE_URL}}`, `{{PORTAL_URL}}`, `{{REACTIVATION_END_DATE}}`, `{{HARD_DELETE_DATE}}`, `{{EXPORT_URL}}`

---

## Subject

```
{{FIRMENNAME}}: Site pausiert — 30 Tage Reaktivierung
```

(48 Zeichen mit Beispiel-Firmenname „Pichler". Faktisch.)

---

## Body (Plain)

```
{{ANREDE}},

Ihre kostenlose Testphase ist abgelaufen, und wir haben die Site
{{SITE_URL}} heute pausiert. Besucher sehen eine kurze
„Site pausiert"-Notiz statt der eigentlichen Inhalte.

Was jetzt gilt:

  - Bis {{REACTIVATION_END_DATE}}: Reaktivierung jederzeit moeglich,
    Daten bleiben erhalten. Plan waehlen → Site sofort wieder online.

  - Ab {{REACTIVATION_END_DATE}}: Soft-Delete. Site und Daten werden
    archiviert, Reaktivierung nur noch ueber Support moeglich.

  - Ab {{HARD_DELETE_DATE}}: endgueltige Loeschung. Subdomain wird frei.

Reaktivieren: {{PORTAL_URL}}/abo
Daten exportieren: {{EXPORT_URL}}

Falls die Pausierung nicht beabsichtigt war oder Sie noch unsicher sind:
alexander@wagner-its.com

Beste Gruesse
Alexander Wagner
Wagner IT-Solutions e.U.

---
{{FIRMENNAME}}-Site (pausiert): {{SITE_URL}}
Portal: {{PORTAL_URL}}

Wagner IT-Solutions e.U. · FN 609574h · 1220 Wien · instantpage.at
Sie erhalten diese E-Mail als aktiver Kunde von instantpage.at.
Abmelden von Lifecycle-Mails ist nicht moeglich (Vertragsbestandteil).
Newsletter abmelden: news@instantpage.at
```

---

## Anmerkungen

- **3-Phasen-Klarheit** (Reaktivierung / Soft-Delete / Hard-Delete) wichtig fuer DSGVO-Transparenz UND Kunden-Vertrauen. Datums-Variablen werden serve-time aufgeloest.
- **„Heute pausiert"** statt „bereits seit X" — fuer Cron-Sicherheit (falls Mail nicht punktgenau lief).
- **Export-Link** prominent — DSGVO Art. 20 Recht auf Datenuebertragbarkeit. Self-Service-Export ist Pflicht, nicht nur „auf Anfrage".
- **„Site pausiert"-Notiz auf der Subdomain** muss in der Phase-1-Bauliste enthalten sein (siehe LIVE-COMPLIANCE § 1 #9).
