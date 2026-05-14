# Beta-Cutover — Ankuendigung Live-Schaltung

**Trigger:** Einmaliger Versand an alle Beta-Tester kurz vor dem Cutover Beta → Live (siehe `docs/MIGRATION-PLAN.md` Phase 0). Zeitpunkt: ca. T-7 vor Live-Schaltung.
**Absender:** info@instantpage.at
**Reply-To:** support@instantpage.at
**Versand:** Manueller Batch-Versand aus Resend-Dashboard

---

## Variablen

`{{VORNAME}}`, `{{NACHNAME}}`, `{{FIRMENNAME}}`, `{{BETA_SUBDOMAIN_URL}}`, `{{CUTOVER_DATE}}`, `{{LIVE_PORTAL_URL}}`, `{{GRUENDERTARIF_LINK}}`

**Hinweise zu Variablen:**
- `{{BETA_SUBDOMAIN_URL}}` = bestehende Beta-Subdomain (`*.pages.dev`)
- `{{CUTOVER_DATE}}` = Datum der Live-Schaltung
- `{{LIVE_PORTAL_URL}}` = `https://instantpage.at/portal` (Live-Portal nach Cutover)
- `{{GRUENDERTARIF_LINK}}` = Link zum First-100-Gruendertarif-Angebot (`MARKETING.md` § 3.1)

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

Wenn Sie instantpage.at weiter nutzen moechten, gibt es zwei Wege:

  1. Gruendertarif (First-100): vergueguenstigter Live-Tarif fuer
     die ersten 100 Live-Kunden — dauerhaft reduziert.
     {{GRUENDERTARIF_LINK}}

  2. Regulaerer Start: kostenlose 7-Tage-Testphase auf der Live-
     Plattform, anschliessend regulaerer Tarif ab 16 EUR netto / Monat.
     {{LIVE_PORTAL_URL}}

In beiden Faellen koennen Sie Ihre Inhalte und Daten beim
Onboarding wieder einspielen — wir helfen gerne dabei.

Bei Fragen erreichen Sie uns unter support@instantpage.at.

Mit freundlichen Gruessen
Ihr Instantpage.at-Team

---
Instantpage.at · support@instantpage.at
Impressum: instantpage.at/impressum · Datenschutz: instantpage.at/datenschutz
```

---

## Anmerkungen

- **Beta-Daten nicht automatisch migriert** — entspricht `LIVE-COMPLIANCE.md` § 12.3 („Beta-Tester-Cleanup: DELETE alle Beta-Daten + Subdomains") und der Beta→Live-Migration-Strategie in `MIGRATION-PLAN.md`. Beta lief auf separater Pages-Infra ohne Stripe/Auth; ein Daten-Carry-Over wuerde mehr Risiko (Konsistenz, DSGVO-Verantwortlichkeit) als Nutzen schaffen.
- **Gruendertarif als positiver Anker** — verbindet die Cutover-Information mit einem Angebot (siehe `MARKETING.md` § 3.1 First-100-Gruendertarif). Verkauft sich nicht als „Sonderkonditionen weil Sie Beta-Tester waren", sondern als allgemeines Launch-Programm, dass Beta-Tester einfach zuerst sehen.
- **Sachliche Eroeffnung** — „vielen Dank fuer Beta-Teilnahme" als kurzes Acknowledgement, nicht als Lobhudelei.
- **Kein automatischer Konto-Carry-Over** — Beta-Tester muessen sich auf Live regulaer registrieren (Stripe-Zahlung etc.). Mail macht das transparent, statt es zu verschleiern.
- **Datenexport-Hinweis** — DSGVO Art. 20 (Recht auf Datenuebertragbarkeit) gilt auch fuer Beta-Daten. Export-Funktion muss in der Beta-Endphase weiterhin erreichbar sein.
- **§ 7 UWG-Grenze:** Diese Mail enthaelt einen Werbe-Bestandteil (Gruendertarif-Link). Da Beta-Tester den Versand im Rahmen der Beta-Teilnahme zugestimmt haben (siehe Beta-AGB), ist das gedeckt. **Anwalts-Audit-Punkt (Block A)**: Beta-AGB-Klausel vor Versand auf UWG-Konformitaet pruefen lassen.
- **Versand-Kanal:** Resend-Batch oder Mailmerge aus Dashboard. Versand-Liste manuell zusammengestellt aus Beta-Kunden-Tabelle.
- **Nicht automatisierbar** — eine einmalige Mail. Kein Cron-Trigger noetig.
