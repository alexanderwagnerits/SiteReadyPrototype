# Welcome — nach Site-Generation

**Trigger:** Nach erstem Login im Portal, nachdem die Site automatisch generiert wurde (= Trial-Start)
**Absender:** info@instantpage.at
**Reply-To:** support@instantpage.at
**Versand:** Sofort nach Site-Generation (Webhook nach `sites.status = 'live'`)
**Verzoegerung:** 5 Minuten Puffer fuer Site-Verfuegbarkeit

---

## Variablen

`{{ANREDE}}`, `{{FIRMENNAME}}`, `{{SUBDOMAIN}}`, `{{SITE_URL}}`, `{{PORTAL_URL}}`, `{{TRIAL_END_DATE}}`

---

## Subject

```
Ihre Website ist online: {{FIRMENNAME}}
```

(45 Zeichen bei Beispiel-Firmenname „Tischlerei Pichler". Direkt + sachlich.)

---

## Body (Plain)

```
{{ANREDE}},

Ihre Website ist fertig und seit eben unter {{SITE_URL}} erreichbar.

In den naechsten 7 Tagen koennen Sie alles in Ruhe testen — die Site ist
bereits oeffentlich, Inhalte koennen Sie jederzeit im Portal anpassen.
Ihre kostenlose Testphase endet am {{TRIAL_END_DATE}}. Danach waehlen Sie
den Plan, oder die Site wird pausiert (Daten bleiben 30 Tage erhalten).

Drei naechste Schritte (~10 Minuten):

  1. Site ansehen: {{SITE_URL}}
  2. Eigenes Logo + Fotos hochladen (Portal → Medien)
  3. Bewertungen ergaenzen falls vorhanden (Portal → Bewertungen)

Bei Fragen einfach auf diese Mail antworten — wir lesen mit.

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

- **Kein Promo-Drueckerei.** Trial-Endedatum wird genannt, aber nicht aggressiv.
- **„Pausiert" statt „geloescht"** — entspricht Phase-1-Grace-Period (30 Tage Reaktivierungsfenster, siehe LIVE-COMPLIANCE § 1 #9).
- **„Wir lesen mit"** statt automatisierter Hinweis — persoenlicher Touch fuer KMU-Zielgruppe.
- **3 Schritte** stehen im Body, weil Onboarding-Reibung in den ersten 24 h ueber Conversion entscheidet (vs „Erkunden Sie das Portal" — zu vage).
