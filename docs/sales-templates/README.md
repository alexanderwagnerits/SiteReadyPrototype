# Sales-Templates — Cold-Outreach Pre-Launch

**Stand:** 2026-05-16 — Erstdraft Eigenarbeit (Pivot 2026-05-15: Anwalts-Audit Trigger-basiert spaeter, siehe `LIVE-COMPLIANCE.md` § 18).

Mail-Templates fuer die 3 Erstziel-Sparten aus `MARKETING.md` § 2.2. Jede Mail ist auf eine Anker-Recipe-Demo verlinkt — Empfaenger sieht eine fertige Branchen-Website seiner Sparte beim Klick.

## Inhalt

| Sparte | Anker-Recipe | Template |
|---|---|---|
| Handwerk (Tischler) | `recipes/handwerk-werkstatt.md` | [`handwerk-tischler.md`](handwerk-tischler.md) |
| Beratung (Unternehmensberater) | `recipes/beratung-modern.md` | [`beratung-unternehmensberater.md`](beratung-unternehmensberater.md) |
| Recht (Rechtsanwalt) | `recipes/anwalt-klassisch.md` | [`recht-anwalt.md`](recht-anwalt.md) |

## Versand-Logik (zentral fuer alle 3 Sparten)

Sequenz pro Lead — maximal **3 Touchpoints** in 14 Tagen, danach Pause:

| Schritt | Kanal | Inhalt | Timing |
|---|---|---|---|
| 1 | LinkedIn-Connection-Request | Sachlicher 1-Liner, Bezug Branche + Region | Tag 0 |
| 2 | Personalisierte Mail an `info@` / `office@` / Inhaber-Adresse | Sparte-Template, individualisierter Opener | Tag 3 |
| 3 | Follow-up Mail | Nur wenn Demo-Link geklickt + keine Antwort (Tracking via UTM) | Tag 7 |
| 4 (opt.) | Telefon-Anruf | Bei warmen Leads (Demo-Click oder LinkedIn-Accept) | Tag 10–14 |

**Pause-Regel:** Nach Schritt 3 ohne Reaktion mindestens **90 Tage** keine erneute Ansprache (Quelle § 7 UWG: keine wiederholte Belaestigung nach impliziter Ablehnung).

**Opt-out-Erfassung:** Klick auf `opt-out@instantpage.at` im Footer triggert Eintrag in interne `suppression-list.csv` (Live: Resend-Suppression-Liste). Adresse danach **dauerhaft** gesperrt, sparten-uebergreifend.

## Personalisierung — Pflicht-Schritte vor Versand

Pro Mail mindestens **eine** sparte-spezifische Beobachtung am Anfang. Beispiele:

- **Tischler:** Bezug auf Werkstuecke-Galerie auf bestehender Site / fehlende Site / Spezialisierung (Massivholz/Kueche/Treppenbau)
- **Berater:** Bezug auf Fachgebiet (Strategie/Prozess/IT-Beratung) oder typisches Pain (Mandanten-Akquise-Site)
- **Anwalt:** Bezug auf Kanzlei-Schwerpunkt / fehlende oder unprofessionelle Site, NIE Heilversprechen-aehnliche Aussagen zur Mandanten-Akquise

**Auswahl-Filter vor Versand:**
- 1–20 Mitarbeiter
- Aktiv seit >1 Jahr (Insolvenz-Filter)
- Bestehende Web-Praesenz veraltet, fehlend oder unprofessionell
- Inhaber identifizierbar (Vorname Nachname im Mail-Adressat)

## UWG-Selbstcheck — Pflicht vor Versand jeder Mail

> Pivot 2026-05-15: Anwalts-Audit Trigger-basiert spaeter (`LIVE-COMPLIANCE.md` § 18). Bis dahin gelten diese Selbstcheck-Kriterien.

### § 7 UWG — Unzumutbare Belaestigung

- [ ] Empfaenger ist **Unternehmer** (WKO-Verzeichnis-Eintrag verifiziert)
- [ ] Mail-Adresse ist **oeffentlich gelistet** (WKO/FirmenABC/Firmen-Website Impressum)
- [ ] Geschaeftlicher Bezug ist im Opener klar (Branche / Region / Web-Praesenz-Beobachtung)
- [ ] Footer enthaelt: Absender-Identifikation (Wagner IT-Solutions e.U., FN, Adresse) + 1-Klick-Opt-out
- [ ] Maximal 3 Touchpoints in 14 Tagen, danach 90 Tage Pause
- [ ] Bei expliziter Ablehnung sofort Suppression-List

### DSGVO Art. 14 — Informations-Pflicht bei nicht direkt erhobenen Daten

- [ ] Mail-Footer nennt die **Quelle** der Daten (WKO-Firmenverzeichnis / FirmenABC)
- [ ] Link zur Datenschutzerklaerung mit Hinweis auf Art. 14
- [ ] Rechtsgrundlage genannt: berechtigtes Interesse (Art. 6 Abs. 1 lit. f DSGVO)
- [ ] Speicherdauer: bis Antwort oder 12 Monate nach Erstkontakt, danach Loeschung

### Voice (BRAND.md § 5)

- [ ] Sachlich-zugewandt, oesterreichische Hoeflichkeit
- [ ] Keine Drueckersprache („Jetzt!", „Nicht verpassen!", „Sichern Sie sich!")
- [ ] Keine verbotenen Begriffe (siehe `LIVE-COMPLIANCE.md` § 15: „guenstigster", „100 % rechtssicher", „beste", „garantiert")
- [ ] Keine Berufsgruppen-Listen-Aufzaehlung in Hauptbotschaft
- [ ] „Impressum und Datenschutz automatisch erstellt" statt „rechtliche Pflichten" oder „AT-Compliance integriert" (Wording-Update 2026-05-16, siehe `legal-drafts/marketing-agb-audit.md`)
- [ ] „Sie", durchgehend

## Tracking + KPIs

- **UTM-Parameter** pro Mail: `?utm_source=outreach&utm_medium=email&utm_campaign=<sparte>&utm_content=<welle>-<lead-id>`
- **Reply-To** zentral auf `office@instantpage.at` (nicht Inhaber-Privatadresse)
- **Demo-Click-Rate:** Ziel 15–25 %
- **Reply-Rate:** Ziel 5–10 %
- **Conversion zu Demo-Termin:** Ziel 8–15 %
- **Conversion Demo → zahlender Kunde:** Ziel 25–40 %

## Versand-Volumen Pre-Launch + Monat 1

- 50 Leads pro Sparte = 150 Leads total
- Wien + Niederoesterreich (siehe `MARKETING.md` § 2.2)
- 4–6 Wochen Vollfokus, 25–30 Leads/Woche manuelle Personalisierung

## Quellen

- Strategie: `MARKETING.md` § 2.2 (Direktansprache)
- Voice: `BRAND.md` § 5 + § 7
- UWG-Vorgaben: `LIVE-COMPLIANCE.md` § 15
- Anwalts-Audit-Trigger: `LIVE-COMPLIANCE.md` § 18 + `anwalt-briefing.md` Paket 5
- Lead-Quellen: WKO-Firmenverzeichnis (firmen.wko.at), FirmenABC (firmenabc.at)
