# Win-Back — Reaktivierungs-Versuch nach Cancellation

**Trigger:** Cron, T+14 nach Cancellation (Mitte der 30-Tage-Grace-Period — fruehe Reue-Phase ist vorbei, finale Verlust-Angst noch nicht eingesetzt)
**Absender:** info@instantpage.at
**Reply-To:** alexander@wagner-its.com
**Versand:** Cron taeglich 10:00 Wien-Zeit
**Skip-Bedingungen:** Bereits reaktiviert (`subscriptions.status = 'active'`) ODER Kunde hat „bitte nicht mehr kontaktieren" gewaehlt (Self-Service-Opt-Out im Cancellation-Flow)

---

## Variablen

`{{ANREDE}}`, `{{FIRMENNAME}}`, `{{SITE_URL}}`, `{{PORTAL_URL}}`, `{{REACTIVATION_END_DATE}}`

---

## Subject

```
{{FIRMENNAME}}: noch 16 Tage Reaktivierungsfenster
```

(45 Zeichen. Faktisch, kein „Wir vermissen Sie!"-Drueckerei-Vibe.)

---

## Body (Plain)

```
{{ANREDE}},

vor 2 Wochen haben Sie Ihre instantpage.at-Mitgliedschaft beendet.
Die Site fuer {{FIRMENNAME}} ist seitdem pausiert, Ihre Daten bleiben
aber noch bis {{REACTIVATION_END_DATE}} erhalten.

Falls Sie es sich noch anders ueberlegen: ein Klick im Portal — Site ist
sofort wieder online, mit allen Inhalten wie zuvor.

Reaktivieren: {{PORTAL_URL}}/abo

Falls Sie uns Feedback geben moegen, warum Sie pausiert haben — antworten
Sie einfach auf diese Mail. Hilft uns, das Produkt besser zu machen.

Falls Sie keine weiteren Reaktivierungs-Mails moegen: einfach kurz
antworten mit „bitte nicht mehr". Wir respektieren das.

Beste Gruesse
Alexander Wagner
Wagner IT-Solutions e.U.

---
{{FIRMENNAME}}-Site (pausiert): {{SITE_URL}}
Portal: {{PORTAL_URL}}

Wagner IT-Solutions e.U. · FN 609574h · 1220 Wien · instantpage.at
Sie erhalten diese E-Mail aufgrund Ihrer pausierten Mitgliedschaft.
Reaktivierungs-Mails koennen abbestellt werden — siehe oben.
Newsletter abmelden: news@instantpage.at
```

---

## Anmerkungen

- **Anwalt-Audit-Punkt (kritisch):** Win-Back ist Grenzbereich § 7 UWG. Argumentation pro „transaktional, nicht Werbung": Mail informiert ueber **bestehende Vertragsoption** (Reaktivierungsfenster ist Vertragsbestandteil aus AGB). Argumentation pro „Werbung" und damit Opt-In-pflichtig: Reaktivierungs-Aufforderung **vermarktet das fortgesetzte Produkt**. Empfehlung: **mit Opt-Out** ausliefern (oben im Cancellation-Flow Self-Service-Opt-Out, in der Mail erneut anbietbar) — defensiv UWG-konform, im Zweifel mit Anwalt absprechen.
- **Footer-Variante** weicht ab vom Master: explizit „Reaktivierungs-Mails koennen abbestellt werden" — passt zum Grenzbereich-Charakter.
- **Genau eine Win-Back-Mail** im 30-Tage-Fenster. Keine Mehrfach-Bedraengung — das schadet dem Vertrauen mehr als es Conversion bringt.
- **„Bitte nicht mehr"-Opt-Out** ist persoenlich (Mail-Reply statt Form) — bewusst, weil Form-Opt-Out in dem Volumen ueberdesigned waere.
- **Sub-Conversion-Cleanup:** Bei „bitte nicht mehr"-Reply automatisch in `kunden.no_winback = true` setzen — Cron skippt dann.
