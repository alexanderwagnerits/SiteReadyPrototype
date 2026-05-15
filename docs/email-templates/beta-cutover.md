# Beta-Cutover — Ankuendigung Live-Schaltung

**Trigger:** Einmaliger Versand an alle Beta-Tester kurz vor dem Cutover Beta → Live (siehe `docs/MIGRATION-PLAN.md` Phase 0). Zeitpunkt: ca. T-7 vor Live-Schaltung.
**Absender:** info@instantpage.at
**Reply-To:** support@instantpage.at
**Versand:** Manueller Batch-Versand aus Resend-Dashboard

---

## Variablen

`{{VORNAME}}`, `{{NACHNAME}}`, `{{FIRMENNAME}}`, `{{BETA_SUBDOMAIN_URL}}`, `{{CUTOVER_DATE}}`, `{{LIVE_PORTAL_URL}}`, `{{NEWCOMER_COUPON_HINT}}`

**Hinweise zu Variablen:**
- `{{BETA_SUBDOMAIN_URL}}` = bestehende Beta-Subdomain (`*.pages.dev`)
- `{{CUTOVER_DATE}}` = Datum der Live-Schaltung
- `{{LIVE_PORTAL_URL}}` = `https://instantpage.at/portal` (Live-Portal nach Cutover)
- `{{NEWCOMER_COUPON_HINT}}` = optionaler Hinweis-Satz auf laufende Newcomer-Rabatt-Aktion (siehe `MARKETING.md` § 3.1). Befuellung nur wenn Aktion zum Cutover-Zeitpunkt aktiv ist — sonst leer-String.

---

## Subject

```
Beta endet am {{CUTOVER_DATE}} — Ihre Optionen
```

---

## Body (Plain)

```
Guten Tag {{VORNAME}} {{NACHNAME}},

vielen Dank, dass Sie waehrend der Beta-Phase Teil von
instantpage.at waren. Am {{CUTOVER_DATE}} schalten wir die
Plattform offiziell live unter instantpage.at.

Was das fuer Sie bedeutet:

  - Die Beta-Subdomain {{BETA_SUBDOMAIN_URL}} wird am
    {{CUTOVER_DATE}} abgeschaltet.
  - Beta-Daten werden nicht automatisch in das Live-System
    uebernommen. Wir starten technisch auf einer neuen Basis.
  - Sie koennen Ihre Beta-Inhalte bis {{CUTOVER_DATE}} herunterladen.

Wenn Sie instantpage.at weiter nutzen moechten, ist der Einstieg
einfach:

  - Kostenlose 7-Tage-Testphase auf der Live-Plattform.
  - Anschliessend regulaerer Tarif ab 16 EUR / Monat
    (Kleinunternehmerregelung — kein USt-Ausweis).
  {{NEWCOMER_COUPON_HINT}}

Sie koennen Ihre Inhalte und Daten beim Onboarding wieder
einspielen — wir helfen gerne dabei.

  {{LIVE_PORTAL_URL}}

Bei Fragen erreichen Sie uns unter support@instantpage.at.

Mit freundlichen Gruessen
Ihr Instantpage.at-Team

---
Instantpage.at · support@instantpage.at
Impressum: instantpage.at/impressum · Datenschutz: instantpage.at/datenschutz
```

**Beispiel-Befuellung `{{NEWCOMER_COUPON_HINT}}`** (wenn Aktion zum Cutover aktiv):

```
  - Aktuell laeuft unsere Markterprobungs-Aktion: 20 % Rabatt auf
    das erste Jahr fuer Neukunden.
```

Wenn Aktion bereits beendet ist → Variable leer setzen, der Block verschwindet rueckstandsfrei.

---

## Anmerkungen

- **Beta-Daten nicht automatisch migriert** — entspricht `LIVE-COMPLIANCE.md` § 12.3 („Beta-Tester-Cleanup: DELETE alle Beta-Daten + Subdomains") und der Beta→Live-Migration-Strategie in `MIGRATION-PLAN.md`. Beta lief auf separater Pages-Infra ohne Stripe/Auth; ein Daten-Carry-Over wuerde mehr Risiko (Konsistenz, DSGVO-Verantwortlichkeit) als Nutzen schaffen.
- **Newcomer-Rabatt als sachlicher Hinweis** — Mail verbindet die Cutover-Information mit dem laufenden Markt-Welcome-Rabatt (siehe `MARKETING.md` § 3.1). Wird nicht als „Sonderkonditionen weil Sie Beta-Tester waren" verkauft, sondern als allgemeine Aktion die Beta-Tester wie Neukunden auch nutzen koennen. Konsistent mit Anti-Patterns § 5 (keine FOMO-Mechanik, kein Knappheits-Theater).
- **Sachliche Eroeffnung** — „vielen Dank fuer Beta-Teilnahme" als kurzes Acknowledgement, nicht als Lobhudelei.
- **Kein automatischer Konto-Carry-Over** — Beta-Tester muessen sich auf Live regulaer registrieren (Stripe-Zahlung etc.). Mail macht das transparent, statt es zu verschleiern.
- **Datenexport-Hinweis** — DSGVO Art. 20 (Recht auf Datenuebertragbarkeit) gilt auch fuer Beta-Daten. Export-Funktion muss in der Beta-Endphase weiterhin erreichbar sein.
- **§ 7 UWG-Grenze:** Diese Mail enthaelt einen Werbe-Bestandteil (Newcomer-Rabatt-Hinweis, falls Aktion aktiv). Da Beta-Tester den Versand im Rahmen der Beta-Teilnahme zugestimmt haben (siehe Beta-AGB), ist das gedeckt. **Anwalts-Audit-Punkt (Block A)**: Beta-AGB-Klausel vor Versand auf UWG-Konformitaet pruefen lassen.
- **Versand-Kanal:** Resend-Batch oder Mailmerge aus Dashboard. Versand-Liste manuell zusammengestellt aus Beta-Kunden-Tabelle.
- **Nicht automatisierbar** — eine einmalige Mail. Kein Cron-Trigger noetig.
