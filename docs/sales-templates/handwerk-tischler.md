# Cold-Outreach Template — Handwerk (Tischler/Schreiner)

**Anker-Recipe:** `docs/_design/recipes/handwerk-werkstatt.md`
**Demo-Link:** `https://demo.instantpage.at/tischlerei-pichler` (Anker-Mockup, vor Live-Schaltung)
**Status:** Erstdraft 2026-05-16 — Eigenarbeit, Anwalts-Audit Trigger-basiert spaeter (`anwalt-briefing.md` Paket 5)

---

## Mail 1 — Erstkontakt (Tag 3 nach LinkedIn-Connect)

**Betreff-Optionen** (A/B):
- A: *Eine Webseite fuer {{FIRMA}} — fertig in 10 Minuten Aufwand*
- B: *Website-Vorschlag fuer Ihre Tischlerei aus Wien/NOE*

**Anrede:** Sehr geehrter Herr `{{NACHNAME}}` / Sehr geehrte Frau `{{NACHNAME}}`,

**Personalisierter Opener** (eine Beobachtung — vor Versand individuell zu schreiben):

> Beispiel A — vorhandene Site veraltet:
> Ihre Werkstatt-Site zeigt schoene Massivholz-Stuecke, der letzte Eintrag stammt aber aus 2021. Fuer einen Betrieb mit Spezialisierung auf `[Massivholz / Treppenbau / Kueche]` waere eine aktuelle Web-Praesenz wahrscheinlich ein konkreter Hebel.

> Beispiel B — gar keine Site:
> Ich habe Ihre Tischlerei ueber das WKO-Firmenverzeichnis gefunden — eine eigene Web-Praesenz konnte ich bisher nicht entdecken. Fuer einen Betrieb mit `[X Mitarbeitern / Spezialisierung Y]` ist das ein Thema, das sich ueber Auftragslage und Lehrlings-Akquise zunehmend bemerkbar macht.

**Kernabsatz:**

Ich baue mit InstantPage eine Plattform, die Tischlereien und Werkstaetten eine fertige Website liefert — ohne Agentur, ohne Baukasten. Kein Drag-and-Drop, sondern ein 10-Minuten-Fragebogen, danach steht die Seite mit Werkstuecke-Galerie, Anfrage-Formular und allen Pflichtangaben.

**Demo-Verweis:**

Eine Demo fuer eine fiktive Werkstatt im Mostviertel finden Sie hier — die Seite zeigt, wie eine Tischler-Site bei InstantPage aussieht: [demo.instantpage.at/tischlerei-pichler](https://demo.instantpage.at/tischlerei-pichler?utm_source=outreach&utm_medium=email&utm_campaign=handwerk&utm_content=mail1-`{{LEAD_ID}}`)

**Soft-CTA:**

Wenn das fuer Ihre Tischlerei interessant klingt, reichen ein paar Minuten am Telefon, um zu klaeren ob das fuer Sie passt. Antworten Sie gerne auf diese Mail mit einem Wunsch-Zeitfenster.

Mit freundlichen Gruessen
Alexander Wagner
Wagner IT-Solutions e.U.

---

## Mail 2 — Follow-up (Tag 7, nur bei Demo-Click ohne Antwort)

**Betreff:** *Re: `{{BETREFF_MAIL1}}` — kurzer Nachzug*

Sehr geehrter Herr `{{NACHNAME}}` / Sehr geehrte Frau `{{NACHNAME}}`,

mir ist aufgefallen, dass Sie die Demo `[demo.instantpage.at/tischlerei-pichler]` letzte Woche kurz angesehen haben — falls Fragen aufgekommen sind, ein kurzer Punkt zur Einordnung:

InstantPage liefert **eine fertige Website** (kein Baukasten zum Selbstbauen) — Sie geben uns einmal Stammdaten und Werkstuecke ein, danach laeuft die Seite mit Hosting, Domain, Impressum, Datenschutz und Anfrage-Formular. Aktualisierungen koennen Sie selbst im Portal vornehmen, oder wir machen das fuer Sie.

Preis: 16 EUR/Monat (Starter) oder 29 EUR/Monat (Professional mit eigener Domain) — netto, ohne Bindung.

Falls das nicht zu Ihrer aktuellen Situation passt, ist das genauso ok — ein kurzes „nein, danke" reicht und Sie hoeren nichts mehr von mir.

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

- [ ] `{{FIRMA}}` und `{{NACHNAME}}` korrekt aus WKO-Verzeichnis
- [ ] Mindestens 1 konkrete Beobachtung im Opener (Spezialisierung / Site-Stand / Bundesland)
- [ ] Demo-Link mit individueller `{{LEAD_ID}}` als UTM-Parameter
- [ ] WKO-Eintrag verifiziert (= oeffentlich gelistet)
- [ ] Inhaber identifiziert (kein generisches `info@` wenn vermeidbar)
- [ ] UWG-Selbstcheck aus `README.md` durchlaufen

## Voice-Notiz

- Sachlich, oesterreichische Hoeflichkeit, keine Drueckersprache
- „Sie" durchgehend (Handwerker-Default laut BRAND.md § 6)
- Kein „KI-Builder", „AI-powered", „smart" — Begriffe aus BRAND.md § 5.3 Don't-Liste
- Demo-Link statt langer Feature-Aufzaehlung — „eine Demo sagt mehr"
- Soft-CTA, keine Termin-Erzwingung
