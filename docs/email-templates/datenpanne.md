# Datenpanne — Information der Betroffenen (Art. 34 DSGVO)

**Trigger:** Manueller Versand durch den Inhaber, nachdem in der Erst-Bewertung ein **hohes Risiko** fuer die betroffenen Personen festgestellt wurde. Prozess: [`LIVE-COMPLIANCE.md`](../LIVE-COMPLIANCE.md) § 12.2.
**Absender:** datenschutz@instantpage.at
**Reply-To:** datenschutz@instantpage.at
**Versand:** Unverzueglich nach DSB-Meldung (Art. 34 Abs. 1 DSGVO). Parallel: Eintrag in `incidents.log`.

---

## Variablen

`{{VORNAME}}`, `{{NACHNAME}}`, `{{FIRMENNAME}}`, `{{VORFALL_DATUM}}`, `{{VORFALL_BESCHREIBUNG}}`, `{{BETROFFENE_DATEN}}`, `{{VORAUSSICHTLICHE_FOLGEN}}`, `{{MASSNAHMEN_PLATTFORM}}`, `{{EMPFEHLUNGEN_BETROFFENE}}`

**Inhaltliche Variablen sind vorfall-spezifisch** und werden vor jedem Versand manuell aus dem `incidents.log`-Eintrag uebernommen. Kein Auto-Versand.

---

## Subject

```
Wichtige Information zu einem Sicherheitsvorfall bei instantpage.at
```

(Defensiv-sachlich. Kein Wort wie „dringend" oder „Achtung" — das wirkt entweder als Spam-Trigger oder als Panik-Mache. „Wichtige Information" ist die uebliche Formulierung in DSGVO-Pflicht-Mitteilungen.)

---

## Body (Plain)

```
Guten Tag {{VORNAME}} {{NACHNAME}},

wir informieren Sie hiermit gemaess Art. 34 DSGVO ueber einen
Sicherheitsvorfall, der personenbezogene Daten Ihres Kontos bei
instantpage.at betrifft.

Was ist passiert:

  {{VORFALL_BESCHREIBUNG}}

Vorfall festgestellt am: {{VORFALL_DATUM}}

Betroffen sind folgende Datenkategorien Ihres Kontos:

  {{BETROFFENE_DATEN}}

Moegliche Folgen fuer Sie:

  {{VORAUSSICHTLICHE_FOLGEN}}

Was wir bereits unternommen haben:

  {{MASSNAHMEN_PLATTFORM}}

Was wir Ihnen empfehlen:

  {{EMPFEHLUNGEN_BETROFFENE}}

Der Vorfall wurde der oesterreichischen Datenschutzbehoerde
gemeldet. Sie koennen sich bei Fragen jederzeit an unseren
Datenschutz-Kontakt wenden:

  datenschutz@instantpage.at

Sie haben das Recht, Beschwerde bei der Datenschutzbehoerde
einzulegen (dsb.gv.at).

Wir bedauern den Vorfall und danken Ihnen fuer Ihr Verstaendnis.

Mit freundlichen Gruessen
Ihr Instantpage.at-Team

---
Instantpage.at · datenschutz@instantpage.at
Impressum: instantpage.at/impressum · Datenschutz: instantpage.at/datenschutz
```

---

## Anmerkungen

- **DSGVO Art. 34 Abs. 2 Pflichtinhalte abgedeckt:**
  - (a) Art der Verletzung beschreiben → `{{VORFALL_BESCHREIBUNG}}` + `{{BETROFFENE_DATEN}}`
  - (b) Name und Kontaktdaten des DSB → `datenschutz@instantpage.at` (Live-Bau: DSB ggf. externer Anwalt, siehe `LIVE-COMPLIANCE.md` § 18)
  - (c) Voraussichtliche Folgen → `{{VORAUSSICHTLICHE_FOLGEN}}`
  - (d) Ergriffene + vorgeschlagene Massnahmen → `{{MASSNAHMEN_PLATTFORM}}` + `{{EMPFEHLUNGEN_BETROFFENE}}`
- **Klare Sprache (Art. 34 Abs. 2):** keine juristischen Formulierungen, kein Tech-Jargon. Beschreibung soll fuer Laien verstaendlich sein.
- **Kein Re-Engagement, keine Marketing-Beimischung** — Pflicht-Mitteilung muss neutral bleiben.
- **Empfehlung-Bausteine** (vorfall-abhaengig, im `incidents.log`-Eintrag dokumentieren):
  - Passwort aendern (bei Login-Daten-Leak)
  - Auf verdaechtige Mails achten (bei E-Mail-Adress-Leak)
  - Bei Auffaelligkeiten Bank/Identitaets-Dienste informieren (bei sensiblen Daten)
- **Versand-Reihenfolge:** 1) Erst-Bewertung 24h → 2) DSB-Meldung 72h → 3) Diese Mail unverzueglich nach DSB-Meldung bei hohem Risiko. **Nicht** vor DSB-Meldung versenden — sonst koennte die Behoerden-Reaktion nicht mehr abgestimmt erfolgen.
- **Kunde als Verantwortlicher fuer Endnutzer-Daten:** Falls Endnutzer der Kunden-Website (Kontaktformular-Daten etc.) betroffen sind, ist der Kunde als Verantwortlicher in der Pflicht, **seine** Endnutzer zu informieren. Die Plattform unterstuetzt mit einer Vorlage (separate Mail-Variante `datenpanne-an-kunden.md`, falls im Live-Bau benoetigt), aber der Versand erfolgt durch den Kunden.
- **Anwalts-Audit-Punkt:** Formulierung vor Live-Schaltung von einem IT-Anwalt gegenlesen lassen (Block A). Insbesondere die exakte Pflichtinhalts-Abdeckung Art. 34 Abs. 2.
