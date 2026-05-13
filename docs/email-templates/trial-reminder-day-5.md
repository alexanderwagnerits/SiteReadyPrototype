# Trial-Reminder Tag 5 (T-2 vor Ende)

**Trigger:** Cron, T+5 nach Trial-Start (= 2 Tage vor Trial-Ende), nur an aktive Trials ohne hinterlegte Zahlungsmethode
**Absender:** info@instantpage.at
**Reply-To:** support@instantpage.at
**Versand:** Cron taeglich 09:00 Wien-Zeit
**Skip-Bedingungen:** Kunde hat Plan bereits gewaehlt (`subscriptions.status IN ('active', 'past_due')`) ODER Site wurde nicht angesehen seit Generierung (= wahrscheinlich abgesprungen, separate Win-Back-Logik)

---

## Variablen

`{{ANREDE}}`, `{{FIRMENNAME}}`, `{{SITE_URL}}`, `{{PORTAL_URL}}`, `{{TRIAL_END_DATE}}`

---

## Subject

```
Ihre Testphase laeuft in 2 Tagen ab
```

(38 Zeichen. Sachlich, kein Drueckerei-Vibe.)

---

## Body (Plain)

```
{{ANREDE}},

Ihre kostenlose Testphase fuer {{FIRMENNAME}} laeuft am {{TRIAL_END_DATE}} ab —
das sind noch 2 Tage.

Wenn Sie weiter machen wollen, hinterlegen Sie eine Zahlungsmethode im Portal.
Die Site bleibt dann ohne Unterbrechung online.

Plan-Uebersicht:
  - Starter: 16 €/Monat netto (oder 14 €/Monat im Jahresabo)
  - Professional: 29 €/Monat netto (oder 25 €/Monat im Jahresabo)

Plan waehlen: {{PORTAL_URL}}/abo

Sie sind sich noch nicht sicher? Antworten Sie auf diese Mail — wir koennen
auch verlaengern, wenn Sie noch Zeit brauchen.

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

- **„Wir koennen verlaengern"** ist KEIN offizielles Feature, sondern eine Support-Geste fuer Einzelfaelle (z. B. Kunde war im Urlaub). Im Support-Workflow vermerken, nicht selbst-bedienbar im Portal — sonst wird's missbraucht.
- **Plan-Preise mitschicken** statt „siehe Pricing-Page" — reduziert eine Klick-Reibung.
- **Sub-Conversion-Cleanup:** Falls Site nie angesehen wurde, Cron-Skip — andere Mail (siehe `win-back.md`-Logik fuer abandoned-Trials).
