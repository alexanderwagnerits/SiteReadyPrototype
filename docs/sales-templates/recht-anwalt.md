# Cold-Outreach Template — Recht (Rechtsanwalt)

**Anker-Recipe:** `docs/_design/recipes/anwalt-klassisch.md`
**Demo-Link:** `https://demo.instantpage.at/kanzlei-bauer` (Anker-Mockup, vor Live-Schaltung)
**Status:** Erstdraft 2026-05-16 — Eigenarbeit, Anwalts-Audit Trigger-basiert spaeter (`anwalt-briefing.md` Paket 5)

> **Compliance-Warnung:** Empfaenger sind reglementierte Berufstraeger (RAO + § 45 RL-BA 2015). Werbe-laute Sprache, vergleichende Aussagen oder Heilversprechen-Aequivalente sind UWG-relevant — sowohl fuer den Versender (UWG-§ 7 + § 2) als auch fuer den Empfaenger (RL-BA 2015). Mail ist konservativ-foermlich zu halten, keine Akquise-Verkaufs-Sprache.

---

## Mail 1 — Erstkontakt (Tag 3 nach LinkedIn-Connect)

**Betreff-Optionen** (A/B):
- A: *Vorschlag fuer die Web-Praesenz Ihrer Kanzlei*
- B: *Kanzlei-Website ohne Agenturzyklus — kurzer Vorschlag*

**Anrede:** Sehr geehrter Herr Dr. `{{NACHNAME}}` / Sehr geehrte Frau Mag. `{{NACHNAME}}`

> Anrede-Hinweis: AT-Anwaelte fuehren meist „Mag." oder „Dr.". Titel ist Pflicht — bei Unsicherheit ueber das Rechtsanwaltsregister (rechtsanwaelte.at) abgleichen.

**Personalisierter Opener** (eine sachliche Beobachtung):

> Beispiel A — vorhandene Site sehr schlicht:
> Ihre Kanzlei-Site nennt Ihren Schwerpunkt `[Zivilrecht / Wirtschaftsrecht / Strafrecht / Erbrecht]` und die Kontaktdaten. Fuer Mandanten, die nach einer Spezialisierungs-Empfehlung suchen, ist die Site aktuell relativ knapp aufgestellt.

> Beispiel B — keine eigene Site, nur Rechtsanwaltsregister-Eintrag:
> Sie sind im oesterreichischen Rechtsanwaltsregister mit Sitz in `{{ORT}}` gelistet, eine eigene Web-Praesenz konnte ich nicht finden. Fuer einen Schwerpunkt `[X]` waere eine Auffindbarkeit ueber Google ein konkreter Akquise-Hebel.

**Kernabsatz:**

Ich baue mit InstantPage eine Plattform, die Kanzleien und Beratungsbetrieben eine fertige Website liefert — ohne Agenturzyklus, ohne Selbstbau. Der Ablauf: 10-Minuten-Fragebogen zu Stammdaten, Taetigkeitsbereichen und Kanzlei-Profil, danach steht die Seite mit Profil-Sektion, Schwerpunkt-Block, Kontaktformular und Impressum gemaess MedienG, ECG, RAO und DSGVO.

**Konformitaets-Hinweis** (wichtig fuer Anwalts-Empfaenger):

Das Template ist konservativ gestaltet (Stil „Klassisch", kein werbe-lauter Editorial-Look). Texte werden sachlich-foermlich generiert, kein Heilversprechen-Vokabular, keine vergleichenden Aussagen — die Werbevorschriften des § 45 RL-BA 2015 sind im Generator als Defensiv-Regel hinterlegt. Sie pruefen die generierten Texte vor Live-Schaltung und geben sie aktiv frei.

**Demo-Verweis:**

Eine Demo fuer eine fiktive Kanzlei finden Sie hier — sie zeigt den Stil und Aufbau, in dem InstantPage Anwaltsseiten liefert: [demo.instantpage.at/kanzlei-bauer](https://demo.instantpage.at/kanzlei-bauer?utm_source=outreach&utm_medium=email&utm_campaign=recht&utm_content=mail1-`{{LEAD_ID}}`)

**Soft-CTA:**

Falls das fuer Ihre Kanzlei relevant ist, koennen wir kurz telefonieren oder Sie schreiben mir per Mail zurueck. Ein Wunsch-Zeitfenster genuegt.

Mit freundlichen Gruessen
Alexander Wagner
Wagner IT-Solutions e.U.

---

## Mail 2 — Follow-up (Tag 7, nur bei Demo-Click ohne Antwort)

**Betreff:** *Re: `{{BETREFF_MAIL1}}` — Nachzug zu Ihrer Demo-Ansicht*

Sehr geehrter Herr Dr. `{{NACHNAME}}` / Sehr geehrte Frau Mag. `{{NACHNAME}}`,

Sie haben sich die Demo `[demo.instantpage.at/kanzlei-bauer]` letzte Woche kurz angesehen — falls Fragen aufkamen, drei sachliche Punkte:

1. **Werbevorschriften** (§ 45 RL-BA 2015) sind im Text-Generator als Defensiv-Regel hinterlegt: keine vergleichenden Aussagen, keine reklamehaft-marktschreierischen Formulierungen, keine ungesicherten Erfolgsaussagen. Die generierten Texte werden vor Veroeffentlichung von Ihnen aktiv freigegeben.

2. **Impressum + Datenschutz** werden automatisch befuellt — inklusive Kammer-Verweis (RAK `[Bundesland]`), Disziplinarbehoerde, Berufsbezeichnung gemaess § 5 ECG. Die Kammer-Mitgliedschaft wird im Portal hinterlegt.

3. **Preis:** 29 EUR/Monat netto (Professional mit eigener Domain) — ohne Bindung, monatlich kuendbar.

Falls das nicht zu Ihrer Situation passt, reicht ein kurzes Wort — Sie hoeren danach nichts mehr von mir.

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

Diese Mail erhalten Sie aufgrund Ihres oeffentlichen Eintrags im oesterreichischen
Rechtsanwaltsregister (rechtsanwaelte.at) und im WKO-Firmenverzeichnis.
Rechtsgrundlage: berechtigtes Interesse (Art. 6 Abs. 1 lit. f DSGVO).
Speicherdauer: 12 Monate nach Erstkontakt, danach Loeschung.

Keine weitere Kontaktaufnahme: opt-out@instantpage.at (1 Klick genuegt)
Datenschutz: instantpage.at/datenschutz
```

---

## Personalisierungs-Checkliste vor Versand

- [ ] Titel + Nachname korrekt (Dr./Mag./Mag. iur. — ueber rechtsanwaelte.at verifizieren)
- [ ] Schwerpunkt aus Kanzlei-Site oder RAK-Eintrag konkret benannt
- [ ] Sitz korrekt (Bundesland, ggf. Bezirk)
- [ ] Demo-Link mit individueller `{{LEAD_ID}}` als UTM-Parameter
- [ ] Kammer-Eintrag im Rechtsanwaltsregister verifiziert
- [ ] **Kein** werbe-lauter Opener — sachlich-foermlich
- [ ] **Kein** Vergleich („besser als…", „professioneller als…")
- [ ] **Kein** Erfolgsversprechen („mehr Mandanten", „bessere Akquise") — nur Beobachtungen, keine Garantien
- [ ] UWG-Selbstcheck aus `README.md` durchlaufen

## Voice-Notiz

- Sachlich-foermlich, deutlich konservativer als Tischler/Berater
- Titel-Anrede zwingend („Dr.", „Mag.")
- „Sie" durchgehend (Anwalts-Default laut BRAND.md § 6, ohnehin nicht verhandelbar)
- Konformitaets-Hinweis in Mail 1 ist Trust-Hebel — Anwaelte denken sofort an § 45 RL-BA, wenn sie ein Marketing-Tool angeboten bekommen
- Keine Drueckersprache, keine Bullet-Drueckersprache, kein Demo-Termin-Push
- „Stil Klassisch" / „konservativ gestaltet" sind im Vokabular der Zielgruppe Trust-Signale
