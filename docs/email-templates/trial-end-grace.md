# Trial-End — Site pausiert

**Trigger:** Cron, T+8 nach Trial-Start (Trial abgelaufen, kein Plan gewaehlt). Site wird pausiert, Reaktivierungsfrist (30 Tage) startet.
**Absender:** info@instantpage.at
**Reply-To:** support@instantpage.at
**Versand:** Cron 09:00 Wien-Zeit (kurz nach Pausierung 00:00)

---

## Variablen

`{{VORNAME}}`, `{{NACHNAME}}`, `{{FIRMENNAME}}`, `{{SITE_URL}}`, `{{PORTAL_URL}}`, `{{REACTIVATION_END_DATE}}`, `{{HARD_DELETE_DATE}}`, `{{EXPORT_URL}}`

---

## Subject

```
Ihre Testphase ist abgelaufen
```

---

## Body (Plain)

```
Guten Tag {{VORNAME}} {{NACHNAME}},

Ihre kostenlose Testphase ist abgelaufen, und die Website {{SITE_URL}}
wurde pausiert. Besucher sehen einen kurzen Hinweis statt der Inhalte.

Sie koennen die Website bis {{REACTIVATION_END_DATE}} jederzeit im
Portal reaktivieren — Ihre Daten bleiben in dieser Frist erhalten.

  Reaktivieren: {{PORTAL_URL}}/abo
  Daten exportieren: {{EXPORT_URL}}

Nach Ablauf der Reaktivierungsfrist werden die Daten archiviert und
spaetestens am {{HARD_DELETE_DATE}} endgueltig geloescht.

Bei Fragen erreichen Sie uns unter support@instantpage.at.

Mit freundlichen Gruessen
Ihr Instantpage.at-Team

---
Instantpage.at · support@instantpage.at
Impressum: instantpage.at/impressum · Datenschutz: instantpage.at/datenschutz
```

---

## Anmerkungen

- **Faktischer Eroeffnungssatz** ohne „Wir bedauern" o. ae. — Pausierung ist erwartetes Vertragsereignis, keine Verlust-Inszenierung.
- **3-Phasen-Logik kompakt** statt detaillierte Phasen-Tabelle: aktuelle Frist (Reaktivierung) + finaler Loeschtermin reichen. Soft-Delete-Mittelphase nicht extra aufgelistet — DSGVO-Transparenz erfuellt durch Reaktivierungs-Frist + Loeschtermin, Mittelphase ist Operations-Detail.
- **„Website pausiert"-Hinweis** auf der Subdomain muss in Live-Bau-Phase 1 implementiert sein (siehe LIVE-COMPLIANCE § 1 #9).
- **Export-Link prominent** — DSGVO Art. 20 (Recht auf Datenuebertragbarkeit).
