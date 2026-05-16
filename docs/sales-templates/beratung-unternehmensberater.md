# Cold-Outreach Template — Beratung (Unternehmensberater)

**Anker-Recipe:** `docs/_design/recipes/beratung-modern.md`
**Demo-Link:** `https://demo.instantpage.at/beratung-loeffler` (Anker-Mockup, vor Live-Schaltung)
**Status:** Erstdraft 2026-05-16 — Eigenarbeit, Anwalts-Audit Trigger-basiert spaeter (`anwalt-briefing.md` Paket 5)

---

## Mail 1 — Erstkontakt (Tag 3 nach LinkedIn-Connect)

**Betreff-Optionen** (A/B):
- A: *Eine Website fuer `{{FIRMA}}` ohne Agenturschleife*
- B: *Web-Praesenz-Vorschlag fuer Ihre Beratung (Wien/NOE)*

**Anrede:** Sehr geehrter Herr `{{NACHNAME}}` / Sehr geehrte Frau `{{NACHNAME}}`,

**Personalisierter Opener** (eine Beobachtung):

> Beispiel A — vorhandene Site generisch:
> Ihre Webseite zeigt Ihren Schwerpunkt `[Strategie / Organisationsentwicklung / IT-Beratung]` zwar im Titel, der Rest wirkt aber wie eine Standard-Vorlage — Kontaktformular, drei Leistungs-Kacheln, Stockfoto. Fuer einen Berater, der sich ueber Profil und Mandanten-Erfahrung verkauft, ist das eher Bremse als Verkaufshilfe.

> Beispiel B — keine eigene Site, nur LinkedIn:
> Sie sind auf LinkedIn sehr praesent und referenzieren dort einige Projekte aus `[Branche/Bereich]` — eine eigene Web-Praesenz konnte ich nicht finden. Fuer Mandanten, die nach „`{{FIRMA}}`" googeln, ist LinkedIn allein eine relativ schmale Landing.

**Kernabsatz:**

Ich baue mit InstantPage eine Plattform, die Beratern und Dienstleistern eine fertige Website liefert — ohne Agenturzyklus, ohne Website-Builder. Kein „bauen Sie sich selbst" — sondern ein 10-Minuten-Fragebogen zu Schwerpunkten, Referenzen und Anrede, danach steht die Seite mit Leistungs-Sektion, Referenz-Block, Kontakt-Formular und allen AT-Pflichtangaben.

**Demo-Verweis:**

Eine Demo fuer einen Berater finden Sie hier — die Seite zeigt den Editorial-modernen Stil, den InstantPage fuer Beratungs-Sparten liefert: [demo.instantpage.at/beratung-loeffler](https://demo.instantpage.at/beratung-loeffler?utm_source=outreach&utm_medium=email&utm_campaign=beratung&utm_content=mail1-`{{LEAD_ID}}`)

**Soft-CTA:**

Falls Sie ohnehin gerade ueber Ihre Web-Praesenz nachdenken — 15 Minuten Telefonat reichen, um zu klaeren ob InstantPage zu Ihrer Situation passt. Ein Antwort-Wort mit Wunsch-Zeitfenster genuegt.

Mit freundlichen Gruessen
Alexander Wagner
Wagner IT-Solutions e.U.

---

## Mail 2 — Follow-up (Tag 7, nur bei Demo-Click ohne Antwort)

**Betreff:** *Re: `{{BETREFF_MAIL1}}` — kurzer Nachzug*

Sehr geehrter Herr `{{NACHNAME}}` / Sehr geehrte Frau `{{NACHNAME}}`,

mir ist aufgefallen, dass Sie sich die Demo `[demo.instantpage.at/beratung-loeffler]` letzte Woche kurz angesehen haben — falls Fragen aufgekommen sind, drei Punkte zur Einordnung:

1. **Eigene Domain** moeglich (Professional-Plan 29 EUR/Monat netto) — Ihre bestehende Domain laeuft weiter, wir migrieren das im Setup.
2. **Inhaltliche Anpassung** uebernehmen Sie im Portal in 2-3 Minuten — keine Tech-Skills noetig, kein Drag-and-Drop.
3. **Datenschutz + Impressum** werden automatisch befuellt aus Ihren Stammdaten — keine separate Erstellung noetig.

Falls das nicht zu Ihrer aktuellen Situation passt, ein kurzes „nein, danke" reicht und Sie hoeren nichts mehr von mir.

Mit freundlichen Gruessen
Alexander Wagner

---

## Footer (verpflichtend in Mail 1 + Mail 2)

```
---
Wagner IT-Solutions e.U.
FN 609574h, HG Wien
1220 Wien, Oesterreich
alexander@wagner-its.com

Diese Mail erhalten Sie aufgrund Ihres oeffentlichen Eintrags im WKO-Firmenverzeichnis
(firmen.wko.at). Rechtsgrundlage: berechtigtes Interesse (Art. 6 Abs. 1 lit. f DSGVO).
Speicherdauer: 12 Monate nach Erstkontakt, danach Loeschung.

Keine weitere Kontaktaufnahme: opt-out@instantpage.at (1 Klick genuegt)
Datenschutz: instantpage.at/datenschutz
```

---

## Personalisierungs-Checkliste vor Versand

- [ ] `{{FIRMA}}` und `{{NACHNAME}}` korrekt aus WKO/LinkedIn
- [ ] Mindestens 1 konkrete Beobachtung im Opener (Schwerpunkt / Site-Status / LinkedIn-Aktivitaet)
- [ ] Demo-Link mit individueller `{{LEAD_ID}}` als UTM-Parameter
- [ ] WKO-Eintrag oder FirmenABC-Eintrag verifiziert
- [ ] Beratungs-Fachgebiet konkret benannt (nicht generisch „Berater")
- [ ] UWG-Selbstcheck aus `README.md` durchlaufen

## Voice-Notiz

- Sachlich, KMU-Berater-Sprache (etwas mehr Substanz als Handwerk, weniger Hoeflichkeits-Floskel)
- „Sie" durchgehend (Beratungs-Default laut BRAND.md § 6)
- Demo-Link statt Feature-Auflistung
- Mail 2 darf 3 konkrete Vorteile listen — aber nicht als Bullet-Drueckersprache
- Anrede: „Herr/Frau Nachname" — bei akademischen Titeln im LinkedIn-Profil (Dr./Mag.) Titel mitverwenden
