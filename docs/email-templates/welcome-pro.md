# Welcome Pro — Plan-Upgrade Starter → Professional

**Trigger:** Stripe-Webhook `customer.subscription.updated` mit `plan: starter → professional`
**Absender:** info@instantpage.at
**Reply-To:** support@instantpage.at
**Versand:** Sofort nach Webhook-Eingang

---

## Variablen

`{{ANREDE}}`, `{{FIRMENNAME}}`, `{{SITE_URL}}`, `{{PORTAL_URL}}`

---

## Subject

```
Professional-Plan aktiv fuer {{FIRMENNAME}}
```

(45 Zeichen. Sachlich, kein Marketing-Hype.)

---

## Body (Plain)

```
{{ANREDE}},

Sie sind jetzt auf dem Professional-Plan — vielen Dank fuer Ihr Vertrauen.

Was Sie ab sofort zusaetzlich nutzen koennen:

  - Eigene Domain (z. B. {{FIRMENNAME}}.at): Anleitung im Portal
  - Erweiterte Statistiken: Portal → Statistik
  - Mehr Foto-Speicher und Galerie-Sections
  - Prioritaets-Support innerhalb von 4 Stunden (Mo-Fr)

Zur eigenen Domain einrichten:
{{PORTAL_URL}}/domain

Wir richten die DNS-Konfiguration mit Ihnen gemeinsam ein — ein Mail
genuegt: support@instantpage.at

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

- **Feature-Liste konkret** statt vage „mehr Funktionen" — Kunde versteht sofort den Gegenwert fuer den Aufpreis.
- **DNS-Konfiguration als „wir machen das mit Ihnen"** — DNS ist die haeufigste Stuck-State-Stelle fuer KMU (siehe OPERATIONS § 8.3). Persoenliche Begleitung baut Vertrauen + reduziert Support-Tickets durch klare Erwartung.
- **„Prioritaets-Support innerhalb 4 Stunden"** muss im Pro-Plan-Feature-Vertrag (PRODUCT.md § 4) konsistent sein — Cross-Check beim Live-Bau.
- **Feature-Liste-Sync-Punkt:** Pro-Features sind in PRODUCT.md § 4 „Feature-Matrix pro Plan" definiert. Bei Aenderung dort: diese Mail mit-updaten (single source of truth bleibt PRODUCT.md, hier nur Marketing-Wording).
- **„Vielen Dank fuer Ihr Vertrauen"** — ein dezenter persoenlicher Moment, keine Marketing-Drueckerei. Aufpreis ist Trust-Signal, das verdient kurze Anerkennung.
