# Welcome — nach Site-Live-Schaltung

**Trigger:** Status-Uebergang `bereit → live` durch **Freigabe-Klick** des Kunden (LIVE-COMPLIANCE § 1 #24, PRODUCT.md § 7.1). Nicht mehr automatisch nach Generation — Site geht erst live wenn Kunde aktiv freigibt (Default-Button „Jetzt live schalten" oder nach Vorschau-Modus).
**Absender:** info@instantpage.at
**Reply-To:** support@instantpage.at
**Versand:** Sofort nach Status-Uebergang auf `live` (Webhook, 5 Min Puffer fuer Site-Verfuegbarkeit).

---

## Variablen

`{{VORNAME}}`, `{{NACHNAME}}`, `{{FIRMENNAME}}`, `{{SITE_URL}}`, `{{PORTAL_URL}}`, `{{TRIAL_END_DATE}}`

Anrede-Logik (Master, siehe README): default `Guten Tag {{VORNAME}} {{NACHNAME}}` — geschlechtsneutral, AT-tauglich, weniger steif als „Sehr geehrte/r".

---

## Subject

```
Ihre Website fuer {{FIRMENNAME}} ist online
```

(45 Zeichen mit Beispielfirmenname „Pichler". Faktisch, kein Werbe-Wording.)

---

## Body (Plain)

```
Guten Tag {{VORNAME}} {{NACHNAME}},

Ihre Website fuer {{FIRMENNAME}} ist eingerichtet und unter
{{SITE_URL}} erreichbar.

Ihre kostenlose Testphase laeuft bis {{TRIAL_END_DATE}}. In diesem
Zeitraum koennen Sie die Plattform unverbindlich pruefen, Inhalte
anpassen und alle Funktionen nutzen.

Empfohlene erste Schritte:

  1. Website oeffnen und Inhalte pruefen: {{SITE_URL}}
  2. Logo und eigene Fotos hochladen (Portal -> „Logo & Fotos")

Bei Fragen erreichen Sie uns unter support@instantpage.at.

Mit freundlichen Gruessen
Ihr Instantpage.at-Team

---
Instantpage.at · support@instantpage.at
Impressum: instantpage.at/impressum · Datenschutz: instantpage.at/datenschutz
```

---

## Anmerkungen

- **Anrede mit Schraegstrich** („geehrte/r") — AT-Standard fuer geschlechtsneutrale Form ohne explizites Geschlechts-Feld im Onboarding. Web-Agent-Empfehlung „Hallo {{VORNAME}}" widerspricht BRAND.md § 6.1 („Sie ausnahmslos").
- **„Logo & Fotos"** ist exakte Tab-Bezeichnung aus PRODUCT.md § 7.2 (kein erfundener Bereich).
- **Nur 2 Schritte** statt 3 — universeller (jeder Kunde will Logo + Fotos hochladen, aber „Bewertungen ergaenzen" frustriert Kunden ohne vorhandene Bewertungen).
- **Faktischer Eroeffnungssatz** statt „Vielen Dank fuer Ihre Anmeldung..." — Stripe/Webflow-Standard. Anerkennung passiert durch professionelle Bearbeitung, nicht durch Floskel.
- **Stripe-Pipeline:** Diese Mail kommt zusaetzlich zur automatischen Stripe-Trial-Mail (Card-Hold-Bestaetigung). Beide Mails sind erwartet.
- **Footer-Minimalismus:** Stripe/Webflow-Pattern — Brand-Name + Support-Mail + Impressum-/Datenschutz-Link statt vollstaendigem WKO-Impressum-Footer. Anbieterkennzeichnung (Firma, FN, Adresse, KU-Klausel) auf der verlinkten Impressum-Seite. **Anwalts-Audit-Punkt** vor Live-Schaltung: Link-Loesung ECG-§ 5-konform bestaetigen lassen (Common Practice bei AT-SaaS, aber formell pruefen).
- **Kein Newsletter-Hinweis** im Footer — instantpage.at hat aktuell keinen Newsletter-Funnel. Bei Newsletter-Launch spaeter ergaenzen.
