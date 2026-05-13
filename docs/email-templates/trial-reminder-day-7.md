# Trial-Reminder Tag 7 (letzter Tag)

**Trigger:** Cron, T+7 nach Trial-Start (= letzter Trial-Tag, vor Mitternacht-Pausierung)
**Absender:** info@instantpage.at
**Reply-To:** support@instantpage.at
**Versand:** Cron 10:00 Wien-Zeit am Tag des Ablaufs
**Skip-Bedingungen:** Kunde hat Zahlungsmethode hinterlegt UND Plan gewaehlt (`subscriptions.status = 'active'`)

---

## Variablen

`{{ANREDE}}`, `{{FIRMENNAME}}`, `{{SITE_URL}}`, `{{PORTAL_URL}}`

---

## Subject

```
Heute laeuft Ihre Testphase ab
```

(31 Zeichen. Faktisch, kein Ausrufezeichen.)

---

## Body (Plain)

```
{{ANREDE}},

Ihre kostenlose Testphase fuer {{FIRMENNAME}} laeuft heute ab.

Falls Sie weitermachen wollen, waehlen Sie noch heute einen Plan
im Portal — die Site bleibt dann nahtlos online.

Plan waehlen: {{PORTAL_URL}}/abo

Falls Sie nicht weitermachen wollen, ist nichts zu tun. Wir pausieren
die Site morgen frueh automatisch. Ihre Daten bleiben 30 Tage erhalten,
falls Sie es sich nochmal anders ueberlegen.

Bei Fragen melden Sie sich gerne bei mir persoenlich:
alexander@wagner-its.com

Beste Gruesse
Alexander Wagner
Wagner IT-Solutions e.U.

---
{{FIRMENNAME}}-Site: {{SITE_URL}}
Portal: {{PORTAL_URL}}

Wagner IT-Solutions e.U. · FN 609574h · 1220 Wien · instantpage.at
Sie erhalten diese E-Mail als aktiver Kunde von instantpage.at.
Abmelden von Lifecycle-Mails ist nicht moeglich (Vertragsbestandteil).
Newsletter abmelden: news@instantpage.at
```

---

## Anmerkungen

- **„Heute" im Subject ohne Datum** — Datum ist Mail-Empfangsdatum, Mehrdeutigkeit unwahrscheinlich.
- **„Nichts zu tun"-Option** explizit nennen — viele User haben Angst vor versteckten Auto-Abos. Klare Aussage „wir pausieren automatisch" baut Vertrauen.
- **Persoenliche E-Mail-Adresse** (alexander@wagner-its.com) — bei Trial-Ende-Reibung ist persoenlicher Kontakt wichtiger als Support-Funnel.
- **Kein** Pricing-Wiederholung wie in Tag-5-Mail — User hat Pricing-Page schon gesehen, Wiederholung wirkt verzweifelt.
