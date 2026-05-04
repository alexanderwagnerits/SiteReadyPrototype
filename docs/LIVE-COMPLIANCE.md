# Live-Compliance — instantpage.at

> **Living Document.** Sammelt alle rechts- und compliance-relevanten Themen für den Übergang Prototyp → Live-Produkt. Nicht alle Punkte müssen sofort entschieden werden — offene Stellen sind als `[OFFEN]` markiert.

**Stand:** 2026-05-04
**Markt:** AT-only (Phase 1)
**Brand:** instantpage.at (Brand) — Wagner IT Services e.U. (Rechtsträger)
**Strategie:** 100% Eigenarbeit für Phase-1-Live, Anwalt Trigger-basiert ab definierten Schwellen
**Verbindung zu Memory:** ergänzt `project_production_refactor.md` + `project_recipe_system_v1.md`. Diese Datei ist Quelle der Wahrheit für Rechtstexte und Compliance-Prozesse.

---

## Inhalt

1. [Strategie-Entscheidungen](#1-strategie-entscheidungen)
2. [Stammdaten](#2-stammdaten)
3. [Versicherung](#3-versicherung)
4. [Subprozessoren](#4-subprozessoren)
5. [AGB-Skeleton (B2B-only)](#5-agb-skeleton-b2b-only)
6. [AVV — Auftragsverarbeitungsvertrag](#6-avv--auftragsverarbeitungsvertrag)
7. [Plattform-Impressum (instantpage.at)](#7-plattform-impressum-instantpageat)
8. [Plattform-Datenschutzerklärung](#8-plattform-datenschutzerklärung)
9. [Branchen-Pflichtfeld-Matrix](#9-branchen-pflichtfeld-matrix)
10. [Reglementierte Berufe — Sonderbehandlung](#10-reglementierte-berufe--sonderbehandlung)
11. [TOMs — Technisch-organisatorische Maßnahmen](#11-toms--technisch-organisatorische-maßnahmen)
12. [Operative Prozesse](#12-operative-prozesse)
13. [AI Act 2.8.2026](#13-ai-act-282026)
14. [Markenrecht](#14-markenrecht)
15. [UWG — Werbeaussagen + Slogans](#15-uwg--werbeaussagen--slogans)
16. [Beta → Live Migration](#16-beta--live-migration)
17. [Roadmap (Phase A–D)](#17-roadmap-phase-ad)
18. [Anwalt-Trigger-Schwellen](#18-anwalt-trigger-schwellen)
19. [Self-Check vierteljährlich](#19-self-check-vierteljährlich)
20. [Quellenverzeichnis](#20-quellenverzeichnis)

---

## 1. Strategie-Entscheidungen

Status-Marker:
- `[ENTSCHIEDEN]` — getroffen, Begründung dokumentiert
- `[OFFEN]` — noch zu klären, Default-Empfehlung markiert
- `[BLOCKER]` — muss vor Live-Schaltung entschieden sein

| # | Frage | Optionen | Default-Empfehlung | Status |
|---|---|---|---|---|
| 1 | B2B oder B2C? | B2B-only mit UID-Pflicht / B2C zusätzlich | B2B-only | `[ENTSCHIEDEN]` Memory: `project_production_refactor.md` |
| 2 | Markt | AT-only / DACH / EU | AT-only Phase 1 | `[ENTSCHIEDEN]` |
| 3 | Heilberufe (Ärzte etc.) in Phase 1? | ja mit Sonderbehandlung / nein / nur ausgewählte | ja mit Sonderbehandlung | `[OFFEN]` |
| 4 | Rechtsberatung (Anwälte, Notare, StB) in Phase 1? | ja mit Sonderbehandlung / nein | ja mit Sonderbehandlung | `[OFFEN]` |
| 5 | Trial-Setup | nur Vorschau ohne Live-Schaltung / Live-Schaltung erlaubt / kein Trial | **Live-Schaltung erlaubt** (Wow-Moment ist Verkaufsargument) | `[ENTSCHIEDEN]` |
| 6 | Trial-Dauer | 7 / 14 / 30 Tage | **7 Tage** (wie Prototyp) | `[ENTSCHIEDEN]` |
| 7 | Mindestvertragslaufzeit | keine / monatlich / jährlich | **Monatsabo monatlich kündbar / Jahresabo 12 Monate** | `[ENTSCHIEDEN]` |
| 8 | Kündigungsfrist | sofort / Monatsende / 30 Tage | Monatsende | `[OFFEN]` |
| 9 | Datenretention nach Kündigung | 30 / 60 / 90 Tage Grace, dann Auto-Delete | **30 Tage Reaktivierung + 60 Tage Soft-Delete + danach Hard-Delete** (90 Tage total) | `[ENTSCHIEDEN]` |
| 10 | Haftungsbegrenzung | 12-Monats-Vergütung / fixer Cap (z.B. €5.000) / pro Schadensfall | 12-Monats-Vergütung | `[OFFEN]` |
| 11 | Refund-Policy | 14 Tage Widerruf trotz B2B / pro-rata bei Mid-Period / kein Refund | pro-rata bei Mid-Period | `[OFFEN]` |
| 12 | Custom-Domain-Verantwortung | DNS allein Kunde / DNS-Setup-Hilfe inkludiert | DNS allein Kunde | `[OFFEN]` |
| 13 | Mailing-Provider | Resend / Postmark / Brevo | **Resend** (günstig + EU-Server) | `[OFFEN]` |
| 14 | Error-Monitoring | Sentry / Axiom / nichts | Sentry | `[OFFEN]` |
| 15 | Analytics-Provider Plattform | PostHog Cloud EU / Plausible EU / nichts | PostHog Cloud EU | `[OFFEN]` |
| 16 | Pricing-Anzeige | inkl. 20% USt / netto + USt | **netto + USt** (B2B-Standard) | `[ENTSCHIEDEN]` |
| 19 | DSGVO-Datenexport (Art. 15) Format | PDF / JSON+CSV / kombiniert | **PDF reicht** | `[ENTSCHIEDEN]` |
| 20 | AVV-Akzeptanz-Verfahren | im AGB-Text / separater PDF-Download + Klick / SaaS-Standard | **Separater PDF-Download + Akzept-Klick** beim ersten Login (SaaS-Standard) | `[ENTSCHIEDEN]` |
| 21 | Daten-Offboarding-Service nach Kündigung | HTML-Backup-ZIP / nur DSGVO-Pflicht-Export | **Nur DSGVO-Pflicht-Export** — kein zusätzlicher Service | `[ENTSCHIEDEN]` |
| 22 | Re-Generation Live-Trigger | siehe `PRODUCT.md` § 3.3 | Bezeichnung+Anrede auto-Re-Gen, Look/Akzentfarbe nicht. Manueller Button max 3x/30 Tage. | `[ENTSCHIEDEN]` |
| 23 | Quality-Score Schwellenwerte | siehe `PRODUCT.md` § 3.4 | <70 Auto-Re-Gen, 70-85 Admin-Alarm, >85 OK | `[ENTSCHIEDEN]` |
| 17 | Anwalt für Schluss-Sichtung bei Trigger | ja, ~5h ~1.750€ / nein, nur bei Vorfall | ja bei Trigger | `[ENTSCHIEDEN]` |
| 18 | Versicherung | nur VSH / IT-Haftpflicht-Paket (VSH+Cyber) | IT-Haftpflicht-Paket | `[ENTSCHIEDEN]` |

---

## 2. Stammdaten

Pflichtdaten zum Befüllen — Voraussetzung für Impressum, AGB, AVV, Datenschutzerklärung.

| Feld | Wert | Status |
|---|---|---|
| Vollständiger Firmenwortlaut (laut Firmenbuch) | `[OFFEN]` z.B. "Wagner IT Services e.U." | `[BLOCKER]` |
| Firmenbuchnummer | `[OFFEN]` "FN ..." | `[BLOCKER]` |
| Firmenbuchgericht | `[OFFEN]` z.B. "HG Wien" | `[BLOCKER]` |
| UID-Nummer | `[OFFEN]` "ATU..." | `[BLOCKER]` |
| GISA-Zahl | `[OFFEN]` | `[BLOCKER]` |
| Geschäftsanschrift (Straße, PLZ, Ort) | `[OFFEN]` | `[BLOCKER]` |
| Bundesland | `[OFFEN]` | `[BLOCKER]` |
| Gewerbeberechtigung (exakte Bezeichnung) | `[OFFEN]` z.B. "Dienstleistung in der automatischen Datenverarbeitung und Informationstechnik" | `[BLOCKER]` |
| Aufsichtsbehörde | `[OFFEN]` (zuständige BH oder Magistrat nach Sitz) | `[BLOCKER]` |
| WKO-Fachgruppe | `[OFFEN]` (UBIT? Information & Consulting?) | `[BLOCKER]` |
| Bankverbindung (IBAN) | `[OFFEN]` | für Rechnungen |
| Kontakt-Mail allgemein | `[OFFEN]` z.B. office@instantpage.at | |
| Kontakt-Mail Datenschutz | `[OFFEN]` z.B. datenschutz@instantpage.at | empfohlen separat |
| Kontakt-Mail Abuse | `[OFFEN]` z.B. abuse@instantpage.at | Pflicht für ECG/DSA |
| Kontakt-Mail Support | `[OFFEN]` z.B. support@instantpage.at | |
| Telefon (geschäftlich) | `[OFFEN]` | Pflicht ECG |

---

## 3. Versicherung

### Bedarf — IT-Haftpflicht-Paket

Bei e.U. mit Privathaftung ist die einzige nicht-verhandelbare Position. Kombi-Paket aus Berufshaftpflicht + Cyber.

| Baustein | Warum | Empfohlene Deckung |
|---|---|---|
| Vermögensschaden-Haftpflicht (VSH) | Software-/Beratungsfehler bei Kunde | 1 Mio. € |
| Cyber-Drittschäden | Endkunden-Daten leaken | 500k–1 Mio. € |
| Cyber-Eigenschäden | Forensik, Wiederherstellung, Lösegeld | 100k–250k € |
| DSGVO-Bußgelder (soweit versicherbar) | Behörden-Verfahren | je nach Anbieter |
| Datenschutzrechtsschutz | Anwaltskosten DSGVO-Verfahren | inkludiert |
| Betriebshaftpflicht (oft inkludiert) | klassische Personen-/Sachschäden | Standard |

### Gewählter Bezugsweg — WKO/UBIT-Rahmenverträge `[ENTSCHIEDEN]`

Über den Fachverband UBIT (Unternehmensberatung, Buchhaltung, IT) der WKO bestehen Rahmenverträge mit deutlich günstigeren Konditionen als Direktangebote am AT-Markt. Voraussetzung: UBIT-Mitgliedschaft (über WKO-Pflichtmitgliedschaft Fachgruppe IT typisch automatisch).

**Onlineantrag:** [ubit-aon.at](https://ubit-aon.at) — Vertrieb über Aon Austria GmbH (Versicherungsmakler)

**Schadenfälle:** Martin Zainzinger, +43 5 7800-528

#### Baustein 1 — Haftpflicht + Berufsrechtsschutz (R+V Versicherung AG)

Quellenbeleg: `docs/_archive/UBIT-Tarifblatt-Haftpflicht-2026.pdf` (gültig ab 01.01.2026)

- **Versicherungssumme:** 2.511.981 €
- **Standardprämie** (inkl. Vsteuer):
  - Umsatz bis 350.000 €/Jahr: **150,59 €/Jahr**
  - Umsatz 350.000–500.000 €/Jahr: **200,70 €/Jahr**
- **Optionen** (Zuschläge werden einzeln auf die Grundprämie addiert, nicht summiert):
  - Entfall Selbstbehalt Berufshaftpflicht: +15%
  - Garantierte Jahreshöchstentschädigung 2,51 Mio. €: +100% auf Gesamtprämie
  - Einschluss Umweltsanierungskosten: +20%
  - Geltungsbereich weltweit (exkl. USA/CA/AU): +20%
  - Einschluss Outdoortraining (Sublimit 1.125.100 €): +181,20 € fix
  - Sachverständigen-Haftpflicht (gerichtlich beeidet): +100%
  - CMC-Rabatt (Certified Management Consultant): −20%
- **Erwarteter Endpreis** (Solo-e.U. < 350k Umsatz, ohne SB, mit Jahreshöchst): **~346 €/Jahr**

#### Baustein 2 — Cyberversicherung (über Aon Austria)

Eigenständiger Rahmenvertrag, separat zu beantragen. **Tarif noch nicht eingeholt** (`[OFFEN]`). Inkludiert laut WKO-Beschreibung:

- 24/7-Krisenhotline (Rechts-/PR-Beratung, IT-Forensiker)
- Datenschutzverletzungen, Verletzungen Geheimhaltungspflichten
- Netzwerksicherheits-Vorfälle (Malware, DDoS, Ransomware)
- Phishing, Hackerpressungen, Betrug durch Dritte

Konkrete Deckungssummen, Prämien, Eigen-/Drittschäden-Aufteilung und DSGVO-Bußgeld-Klausel sind beim Aon-Kontakt zu erfragen.

### Fallback-Anbieter (falls UBIT-Rahmenvertrag nicht greift)

Falls die UBIT-Police aus inhaltlichen Gründen nicht ausreicht (offene Frage: Deckung für KI-generierte Inhalte einer SaaS-Plattform), zurück auf Direktangebote:

- Helvetia
- UNIQA
- Wiener Städtische
- Generali
- Allianz

Erwartungswert Direktangebot: **1.500–2.500 €/Jahr** (Faktor 5–10 teurer als UBIT-Rahmenvertrag).

### Voraussetzungen die der Versicherer wahrscheinlich verlangt

- 2FA für eigene Logins (Cloudflare, Supabase, Stripe, Anthropic, Domains)
- Regelmäßige Backups (dokumentiert)
- Aktuelle Software-Versionen (Dependencies)
- Schriftliche AGB
- Schriftlicher AVV mit Kunden
- Verarbeitungsverzeichnis Art 30
- Datenpannen-Meldeprozess

### Aktionen

| Aktion | Status |
|---|---|
| UBIT-Mitgliedschaft / Fachgruppe verifizieren (WKO-Login Stammdaten) | `[OFFEN]` |
| Cyber-Tarifblatt von Aon anfordern (Martin Zainzinger, +43 5 7800-528) | `[OFFEN]` |
| Bei Aon explizit fragen: Deckung für KI-generierte Inhalte einer SaaS-Plattform? Drittland-Datenflüsse? Voraussetzung Eigen-AGB akzeptiert? | `[OFFEN]` |
| Onlineantrag Haftpflicht + Cyber via [ubit-aon.at](https://ubit-aon.at) | `[OFFEN]` |
| Police abschließen vor Live-Schaltung | `[BLOCKER]` |
| Voraussetzungen erfüllen + dokumentieren | `[OFFEN]` |

---

## 4. Subprozessoren

Liste aller Drittdienste mit Datenverarbeitung. Pflicht: jeder mit DPA, in AVV-Anhang III gelistet, auf Subprozessor-Seite (instantpage.at/subprozessoren) öffentlich.

DPA-Status-Marker:
- `[OFFEN]` — DPA noch nicht recherchiert
- `[URL]` — DPA-URL recherchiert, Sign-off via Account-Settings ausstehend
- `[SIGNIERT]` — Sign-off durch, Beleg im Account/Mail dokumentiert

| Anbieter | Funktion | Sitz | DPA-URL / Quelle | Status |
|---|---|---|---|---|
| Cloudflare | DNS, CDN, Pages, R2, Custom Hostnames, Web Analytics | USA (mit EU-Servern) | <https://www.cloudflare.com/cloudflare-customer-dpa/> | `[URL]` Sign-off via Account-Settings → Privacy |
| Supabase | Datenbank, Storage, Auth | Frankfurt (EU) | <https://supabase.com/legal/dpa> | `[URL]` Sign-off via Dashboard → Org → Legal |
| Stripe | Zahlungsabwicklung | Irland (EU-Hauptsitz) + USA | <https://stripe.com/legal/dpa> | `[URL]` automatisch Teil der Stripe Services Agreement |
| Anthropic | Claude API (Textgenerierung, Import-Klassifizierung) | USA | <https://privacy.claude.com/en/articles/7996862-how-do-i-view-and-sign-your-data-processing-addendum-dpa> + Sample-PDF: [`docs/_archive/dpa/Anthropic-DPA-Sample.pdf`](_archive/dpa/Anthropic-DPA-Sample.pdf) | `[URL]` Sign-off via Console → Settings (DPA in Commercial Terms inkludiert) |
| Microsoft 365 | E-Mail, Office | EU/USA | <https://www.microsoft.com/licensing/docs/view/Microsoft-Products-and-Services-Data-Protection-Addendum-DPA> | `[URL]` automatisch Teil der Online Services Terms |
| easyname.at | Domain-Registrierung | Österreich | im AGB enthalten: <https://www.easyname.at/agb> | `[URL]` Akzept beim Account-Anlegen |
| Resend (Mailing) | Transaktionale E-Mails | USA + EU | <https://resend.com/legal/dpa> | `[URL]` Sign-off via Account erst wenn entschieden (siehe § 1 #13) |
| PostHog Cloud EU | Product Analytics + Session Replay | EU | <https://posthog.com/dpa> | `[URL]` Sign-off via Account erst wenn entschieden (§ 1 #15) |
| Sentry | Error-Monitoring | USA | <https://sentry.io/legal/dpa/> | `[URL]` Sign-off via Account erst wenn entschieden (§ 1 #14) |
| remove.bg (Logo-Freistellung) | Bildverarbeitung | Deutschland | <https://www.remove.bg/de/agb> (DPA in AGB) | `[URL]` later Live |
| Unsplash | Stockfotos via API | USA | <https://unsplash.com/data-protection-addendum> | `[URL]` later Live |
| Google Places API | Business-Daten Import | USA | <https://cloud.google.com/terms/data-processing-addendum> | `[URL]` later Live |

**Drittland-Hinweis:** USA-Anbieter laufen aktuell unter EU-U.S. Data Privacy Framework. Status in Quartals-Self-Check prüfen — Schrems-III-Risiko nicht ausgeschlossen.

**Sign-off-Reihenfolge fuer Phase 0:** Cloudflare → Supabase → Stripe → Anthropic → Microsoft. Jeder DPA mit Datum + Account-Beleg im internen `incidents.log` festhalten. Bei Account-Anlegen vor Live-Schaltung mit erfassen.

---

## 5. AGB-Skeleton (B2B-only)

> **Defensiv formuliert. Kombiniert WKO-Vorlagen IT-Betreiberdienstleistungen B2B + IT-Programmierdienstleistungen B2B + IT-Software-Support B2B + 5 Eigenklauseln (Betreiber, KI, Vorlagen, Bildrechte, B2B-Beschränkung). Stammdaten in `[Klammern]` einsetzen.**

### § 1 Geltungsbereich, B2B-Beschränkung

(1) Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Verträge zwischen `[FIRMENWORTLAUT]` (im Folgenden "Anbieter") und dem Kunden über die Nutzung der Plattform instantpage.at und der damit verbundenen Leistungen.

(2) Das Angebot richtet sich ausschließlich an Unternehmer im Sinne des § 1 KSchG. Verbraucherverträge sind ausgeschlossen.

(3) Der Kunde bestätigt mit Vertragsabschluss, im Rahmen seiner unternehmerischen Tätigkeit zu handeln und im Bestellprozess seine UID-Nummer, GISA-Zahl oder Firmenbuchnummer wahrheitsgemäß angegeben zu haben.

(4) Bei Falschangabe der Unternehmer-Eigenschaft haftet der Kunde für sämtliche daraus entstehenden Folgen, einschließlich entgangener Steuervorteile und zusätzlicher Verpflichtungen.

(5) Allgemeine Geschäftsbedingungen des Kunden gelten nicht, auch wenn der Anbieter ihnen nicht ausdrücklich widerspricht.

### § 2 Vertragsschluss

(1) Die Darstellung der Leistungen auf der Website stellt kein bindendes Angebot dar.

(2) Der Vertrag kommt zustande, sobald der Kunde im Bestellprozess die kostenpflichtige Bestellung durch Klick auf den entsprechend gekennzeichneten Button bestätigt und der Anbieter die Annahme durch Bereitstellung der Plattform-Zugänge bestätigt.

(3) Der Kunde erhält eine Vertragsbestätigung in Textform an die angegebene E-Mail-Adresse.

### § 3 Leistungsumfang

(1) Der Anbieter stellt eine technische Plattform zur Verfügung, die folgende Leistungen umfasst:

a) **Generierung** einer Website auf Basis der vom Kunden bereitgestellten Daten unter Einsatz von KI-Sprachmodellen
b) **Hosting** der generierten Website unter einer Subdomain (firma.instantpage.at) oder bei höherem Plan unter einer vom Kunden bereitgestellten eigenen Domain
c) **Self-Service-Portal** zur Bearbeitung von Inhalten, Bildern und Konfigurationen
d) **Generierte Vorlagen** für Impressum und Datenschutzerklärung auf Basis der vom Kunden eingegebenen Daten
e) **Generierte SEO-Elemente** (Schema.org, Meta-Tags, Sitemap)

(2) Der konkrete Leistungsumfang richtet sich nach dem vom Kunden gebuchten Plan (Starter, Professional). Plan-spezifische Funktionen sind in der jeweiligen Plan-Beschreibung auf der Website transparent ausgewiesen.

(3) Der Anbieter behält sich Änderungen am Leistungsumfang vor, sofern sie für den Kunden zumutbar sind und den Vertragszweck nicht wesentlich beeinträchtigen.

### § 4 Pflichten und Mitwirkung des Kunden

(1) Der Kunde ist verpflichtet, alle für die Leistungserbringung erforderlichen Daten vollständig und wahrheitsgemäß bereitzustellen, insbesondere:

a) Firmenwortlaut, Adresse, Kontaktdaten
b) Rechtsform und impressumsrelevante Pflichtangaben
c) UID-Nummer, GISA-Zahl, Firmenbuchnummer (sofern vorhanden)
d) bei reglementierten Berufen: Berufsbezeichnung, zuständige Kammer, Aufsichtsbehörde

(2) Der Kunde sichert zu, dass alle bereitgestellten Inhalte (Texte, Bilder, Logos, Daten) frei von Rechten Dritter sind oder er die erforderlichen Nutzungsrechte besitzt.

(3) Der Kunde ist verpflichtet, sämtliche generierten und vom Kunden eingestellten Inhalte vor Veröffentlichung der Website zu prüfen und aktiv freizugeben. Mit der Veröffentlichung erklärt der Kunde, die Inhalte geprüft zu haben und übernimmt für diese die alleinige Verantwortung.

(4) Der Kunde sichert seine Zugangsdaten ab, aktiviert Zwei-Faktor-Authentifizierung sofern angeboten und meldet Sicherheitsvorfälle unverzüglich.

### § 5 KI-generierte Inhalte (Eigenklausel)

(1) Texte, Beschreibungen und Vorschläge auf der generierten Website werden unter Einsatz von KI-Sprachmodellen erstellt.

(2) Trotz sorgfältiger Konfiguration können KI-generierte Inhalte sachliche Ungenauigkeiten, missverständliche Formulierungen oder branchenrechtlich problematische Aussagen enthalten.

(3) Der Kunde ist verpflichtet, alle generierten Inhalte vor Veröffentlichung selbst zu prüfen und gegebenenfalls anzupassen. Der Anbieter übernimmt keine Haftung für die inhaltliche Richtigkeit, Vollständigkeit oder rechtliche Zulässigkeit der generierten Texte.

(4) Bei reglementierten Berufen (insbesondere Heilberufe, Rechts- und Wirtschaftsberatung) hat der Kunde die berufsrechtlichen Werbevorschriften eigenverantwortlich zu beachten und Texte entsprechend anzupassen.

### § 6 Generierte Rechtstexte (Eigenklausel)

(1) Die vom Anbieter bereitgestellten Vorlagen für Impressum und Datenschutzerklärung werden auf Basis der vom Kunden eingegebenen Daten und der vom Kunden aktivierten Plattform-Module automatisiert generiert.

(2) Diese Vorlagen sind Hilfestellungen und ersetzen keine rechtliche Beratung. Die Vollständigkeit und Richtigkeit der Pflichtangaben für die jeweilige Branche, Rechtsform und Datenverarbeitung verantwortet der Kunde.

(3) Bei reglementierten Berufen, besonderen Datenkategorien (Art 9 DSGVO) oder branchenspezifischen Sonderpflichten ist die Vorlage ggf. unzureichend. Der Kunde hat in diesen Fällen die Vorlage durch eine fachkundige Stelle prüfen zu lassen.

(4) Die generierte Datenschutzerklärung deckt ausschließlich die Datenverarbeitung im Rahmen des Website-Besuchs ab. Die Verarbeitung von Patientendaten, Mandantendaten oder sonstigen berufsspezifischen Daten ist nicht Gegenstand der Vorlage und durch den Kunden separat zu regeln.

### § 7 Bildrechte und Inhaltsfreigabe (Eigenklausel)

(1) Der Kunde garantiert, dass er für alle hochgeladenen Inhalte (Bilder, Logos, Texte, Videos) über die erforderlichen Nutzungsrechte verfügt und keine Rechte Dritter verletzt.

(2) Der Kunde stellt den Anbieter von sämtlichen Ansprüchen Dritter frei, die wegen einer Rechtsverletzung durch vom Kunden eingestellte Inhalte gegen den Anbieter erhoben werden.

(3) Der Anbieter ist berechtigt, Inhalte bei begründetem Hinweis auf Rechtsverletzungen oder Verstöße gegen geltendes Recht zu entfernen oder die betroffene Website vorübergehend zu sperren.

### § 8 Verantwortlichkeit für die Website (Betreiber-Klausel)

(1) Der Kunde ist Medieninhaber im Sinne des MedienG, Diensteanbieter im Sinne des § 5 ECG und datenschutzrechtlich Verantwortlicher gemäß Art 4 Z 7 DSGVO seiner über die Plattform bereitgestellten Website.

(2) Der Anbieter erbringt ausschließlich technische Hosting-, Generierungs- und Bereitstellungsleistungen im Sinne des § 16 ECG.

(3) Für die rechtmäßige Verarbeitung personenbezogener Daten von Endnutzern (Kontaktanfragen, Reservierungen, Bewertungen etc.) ist der Kunde verantwortlich. Die technische Verarbeitung dieser Daten durch den Anbieter erfolgt im Auftrag des Kunden auf Grundlage des separat abgeschlossenen Auftragsverarbeitungsvertrags (AVV).

### § 9 Vergütung, Zahlungsbedingungen

(1) Die Vergütung richtet sich nach dem vom Kunden gewählten Plan. Preise verstehen sich `[OFFEN: netto zzgl. USt / brutto inkl. USt]`.

(2) Die Vergütung ist im Voraus für den jeweiligen Abrechnungszeitraum fällig (monatlich oder jährlich, je nach Plan).

(3) Die Abwicklung erfolgt über den Zahlungsdienstleister Stripe. Der Kunde stimmt den Zahlungsbedingungen von Stripe gesondert zu.

(4) Bei Zahlungsverzug ist der Anbieter berechtigt, die Leistungserbringung auszusetzen und die betroffene Website nach vorheriger Mahnung zu sperren. Verzugszinsen nach § 456 UGB.

### § 10 Vertragslaufzeit, Kündigung

(1) Der Vertrag wird auf unbestimmte Zeit geschlossen. `[OFFEN: Mindestlaufzeit?]`

(2) Bei monatlicher Abrechnung kann der Vertrag mit Wirkung zum Ende des laufenden Abrechnungsmonats gekündigt werden. Bei jährlicher Abrechnung mit Wirkung zum Ende der laufenden Jahresperiode.

(3) Die Kündigung erfolgt in Textform über die Self-Service-Funktion im Portal oder per E-Mail an support@instantpage.at.

(4) Das Recht zur außerordentlichen Kündigung aus wichtigem Grund bleibt unberührt. Wichtige Gründe für den Anbieter sind insbesondere wiederholte Verstöße gegen diese AGB, rechtswidrige Inhalte, Zahlungsverzug nach Mahnung.

### § 11 Datenrückgabe und Löschung bei Vertragsende

(1) Innerhalb der Vertragslaufzeit kann der Kunde seine Daten jederzeit über das Self-Service-Portal exportieren.

(2) Nach Vertragsende werden die Kundendaten und die zugehörige Website für `[OFFEN: 30/60/90 Tage]` in einem Grace-Status aufbewahrt. In diesem Zeitraum kann der Kunde seine Daten exportieren oder den Vertrag wieder aktivieren.

(3) Nach Ablauf des Grace-Zeitraums werden alle personenbezogenen Daten des Kunden und seiner Endnutzer endgültig gelöscht, sofern keine gesetzlichen Aufbewahrungspflichten entgegenstehen (insbesondere § 132 BAO).

(4) Die Subdomain wird nach Ablauf des Grace-Zeitraums freigegeben und kann vom Anbieter neu vergeben werden.

### § 12 Haftung, Haftungsbegrenzung

(1) Der Anbieter haftet unbeschränkt für Vorsatz und grobe Fahrlässigkeit, für Schäden aus der Verletzung des Lebens, des Körpers oder der Gesundheit sowie nach den zwingenden Bestimmungen des Produkthaftungsgesetzes.

(2) Bei leichter Fahrlässigkeit haftet der Anbieter nur bei Verletzung wesentlicher Vertragspflichten und nur in Höhe des bei Vertragsschluss vorhersehbaren, vertragstypischen Schadens.

(3) Die Haftung des Anbieters ist insgesamt der Höhe nach begrenzt auf die vom Kunden in den letzten 12 Monaten vor dem schadensauslösenden Ereignis tatsächlich gezahlte Vergütung.

(4) Der Anbieter haftet nicht für Schäden aus inhaltlichen Fehlern KI-generierter Texte, aus unvollständigen Pflichtangaben in generierten Vorlagen, aus Rechtsverletzungen durch vom Kunden eingestellte Inhalte oder aus Verstößen des Kunden gegen berufsrechtliche Werbevorschriften.

(5) Eine darüberhinausgehende Haftung ist ausgeschlossen.

### § 13 Datenschutz, AVV

(1) Der Anbieter verarbeitet personenbezogene Daten des Kunden zur Vertragserfüllung gemäß der Datenschutzerklärung auf instantpage.at/datenschutz.

(2) Soweit der Anbieter im Rahmen der Plattform-Nutzung personenbezogene Daten von Endnutzern des Kunden verarbeitet (Kontaktanfragen, Reservierungen etc.), erfolgt dies im Auftrag des Kunden. Der dafür erforderliche Auftragsverarbeitungsvertrag (AVV) gemäß Art 28 DSGVO ist Bestandteil dieses Vertrags und wird dem Kunden vor Abschluss zur Verfügung gestellt.

### § 14 Anpassung dieser AGB

(1) Der Anbieter ist berechtigt, diese AGB anzupassen, sofern dies aufgrund geänderter rechtlicher Rahmenbedingungen, neuer technischer Entwicklungen oder zur Anpassung an Marktbedingungen erforderlich ist.

(2) Änderungen werden dem Kunden mindestens 6 Wochen vor Inkrafttreten in Textform mitgeteilt. Widerspricht der Kunde nicht innerhalb dieser Frist, gelten die Änderungen als angenommen. Auf diese Folge wird der Kunde in der Mitteilung gesondert hingewiesen.

(3) Bei einer Änderung steht dem Kunden ein außerordentliches Kündigungsrecht zum Inkrafttretenstag zu.

(4) Wesentliche Änderungen am Vertragskern (Hauptleistung, Vergütung) bedürfen der ausdrücklichen Zustimmung des Kunden.

### § 15 Schlussbestimmungen

(1) Es gilt österreichisches Recht unter Ausschluss der Verweisungsnormen und des UN-Kaufrechts.

(2) Erfüllungsort und Gerichtsstand für alle Streitigkeiten aus diesem Vertrag ist `[OFFEN: Sitz des Anbieters]`.

(3) Sollten einzelne Bestimmungen unwirksam sein, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt. An die Stelle der unwirksamen Bestimmung tritt die gesetzlich zulässige Regelung, die dem wirtschaftlichen Zweck am nächsten kommt.

(4) Änderungen und Ergänzungen dieses Vertrags bedürfen der Textform.

---

## 6. AVV — Auftragsverarbeitungsvertrag

### Aufbau

**Hauptteil** = EU-Standardvertragsklauseln nach Durchführungsbeschluss (EU) 2021/915, Module Controller-Prozessor (Klauseln 1–10), wortgleich übernommen. Quelle: <https://eur-lex.europa.eu/legal-content/DE/TXT/HTML/?uri=CELEX:32021D0915>

**Anhänge** = individuell befüllt (siehe unten).

### Anhang I — Beschreibung der Verarbeitung

| Punkt | Inhalt |
|---|---|
| **Verantwortlicher** | Der Kunde (Inhaber der Website) |
| **Auftragsverarbeiter** | `[FIRMENWORTLAUT]` |
| **Gegenstand der Verarbeitung** | Hosting der Website, Speicherung von Endnutzer-Anfragen (Kontaktformular, Reservierungen, Bewertungen), Bereitstellung von Statistik-Daten (sofern Pro-Plan), Versand transaktionaler E-Mails an Endnutzer |
| **Art der Verarbeitung** | Erheben, Speichern, Übermitteln, Anzeigen, Löschen |
| **Zweck der Verarbeitung** | Betrieb der Website des Verantwortlichen, Zustellung von Anfragen, statistische Auswertung, technische Sicherheit |
| **Dauer der Verarbeitung** | Für die Vertragslaufzeit zzgl. Grace-Zeitraum (`[OFFEN: 30/60/90 Tage]`). Logs nach 30 Tagen anonymisiert. |
| **Kategorien betroffener Personen** | Endnutzer der Kunden-Website (Kontaktanfragen, Bewerter, Reservierungen) |
| **Kategorien personenbezogener Daten** | Kontaktdaten (Name, E-Mail, Telefon), Inhalt der Anfrage, IP-Adresse (technisch nötig), bei Reservierungen: Datum/Personenzahl/Anliegen, bei Bewertungen: Name + Bewertungstext |
| **Besondere Datenkategorien** | NICHT umfasst. Bei Heilberufen ist die Eingabe von Gesundheitsdaten in Termin-Anfragen vertraglich ausgeschlossen. Verstöße liegen außerhalb der Auftragsverarbeitung. |

### Anhang II — Technisch-organisatorische Maßnahmen

Siehe [Abschnitt 11 — TOMs](#11-toms--technisch-organisatorische-maßnahmen).

### Anhang III — Subprozessoren

Siehe [Abschnitt 4 — Subprozessoren](#4-subprozessoren).

Aktualisierungen werden auf instantpage.at/subprozessoren öffentlich gemacht. Der Verantwortliche kann der Beauftragung neuer Subprozessoren binnen 30 Tagen widersprechen; bei berechtigtem Widerspruch besteht ein Sonderkündigungsrecht.

### Anhang IV — Datenkategorien-Liste

| Datenkategorie | Quelle | Verarbeitung | Speicherort | Speicherdauer |
|---|---|---|---|---|
| Kontaktanfragen | Endnutzer-Eingabe Kontaktformular | Speicherung + Mailweiterleitung | Supabase EU + Resend | `[OFFEN]` z.B. 12 Monate |
| Reservierungs-/Termin-Anfragen | Endnutzer-Eingabe Reservierungs-Form | wie oben | wie oben | wie oben |
| Bewertungen | Endnutzer-Eingabe Bewertungs-Form | Speicherung + Anzeige | Supabase EU | bis Widerruf |
| Hochgeladene Bilder mit Personenabbildungen | Kunde lädt hoch | Speicherung + Auslieferung | Supabase Storage / Cloudflare R2 | bis Vertragsende + Grace |
| IP-Adressen (Webserver-Log) | Webserver | Anonymisierung nach 30 Tagen | Cloudflare Logs | 30 Tage |
| Bestellte Produkte (Webshop später) | n/a Phase 1 | n/a | n/a | n/a |

---

## 7. Plattform-Impressum (instantpage.at)

> Skeleton zum Befüllen mit Stammdaten aus Abschnitt 2.

```
Impressum

Medieninhaber, Herausgeber und Diensteanbieter:
[FIRMENWORTLAUT]
[Geschäftsanschrift, PLZ, Ort, Österreich]

Telefon: [Telefonnummer]
E-Mail: [office@instantpage.at]

Unternehmensgegenstand: Bereitstellung einer Software-as-a-Service-Plattform zur
Erstellung und zum Betrieb von Unternehmens-Websites

UID-Nummer: [ATU...]
GISA-Zahl: [...]
Firmenbuchnummer: [FN ...] (sofern eingetragen)
Firmenbuchgericht: [HG/LG ...]

Gewerbeberechtigung: [exakte Bezeichnung laut Gewerbeschein,
z.B. "Dienstleistung in der automatischen Datenverarbeitung und Informationstechnik"]

Aufsichtsbehörde: [zuständige BH oder Magistrat]

Mitglied der Wirtschaftskammer Österreich,
Fachgruppe [UBIT / Information & Consulting / ...]

Anwendbare gewerberechtliche Vorschriften:
Gewerbeordnung (www.ris.bka.gv.at)

Berufsbezeichnung: [Inhaber-Name]

Kontakt für Datenschutzanfragen: datenschutz@instantpage.at
Kontakt für Missbrauchsmeldungen: abuse@instantpage.at

Online-Streitbeilegung:
Verbraucher haben die Möglichkeit, Beschwerden an die Online-Streitbeilegungsplattform
der EU zu richten: https://ec.europa.eu/consumers/odr
(Hinweis: Wir richten unser Angebot ausschließlich an Unternehmer; eine Verpflichtung
zur Teilnahme an einem Streitbeilegungsverfahren besteht nicht.)
```

---

## 8. Plattform-Datenschutzerklärung

> Skeleton zum Befüllen — vollständig ausformuliert vor Live-Schaltung. Quelle: WKO-Checkliste DSGVO + WKO-Datenverarbeitung Webshop.

### Pflicht-Bausteine (kurz)

1. **Verantwortlicher:** `[FIRMENWORTLAUT]` mit Stammdaten
2. **Kontakt für Datenschutzanfragen:** datenschutz@instantpage.at
3. **Verarbeitungszwecke + Rechtsgrundlagen:**
   - Vertragsabwicklung (Art 6 Abs 1 lit b)
   - Zahlungsabwicklung (Art 6 Abs 1 lit b + lit c)
   - Newsletter sofern aktiviert (Art 6 Abs 1 lit a)
   - Statistik / Produktverbesserung (Art 6 Abs 1 lit f)
   - Trial-Verwaltung (Art 6 Abs 1 lit b — Vertragsanbahnung)
4. **Datenkategorien:** Account, Stripe-Kunden-ID, Kommunikation, Nutzungsdaten
5. **Empfänger / Subprozessoren:** Liste mit Drittland-Hinweis (siehe Abschnitt 4)
6. **Speicherdauer:** pro Kategorie konkret (`[OFFEN]`: definieren)
7. **Drittlandübermittlung:** USA-Anbieter unter EU-U.S. Data Privacy Framework
8. **Betroffenenrechte:** Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit, Widerspruch, Beschwerde bei DSB
9. **Cookies:** Plattform-Cookies (Auth, Session) — keine Tracking-Cookies; falls PostHog Session Replay → Banner mit Einwilligung
10. **AI-Verarbeitung:** Hinweis dass Anthropic-API für Textgenerierung eingesetzt wird, mit Drittland-Bezug

---

## 9. Branchen-Pflichtfeld-Matrix

> **Code-Anbindung:** Erweitert [src/data.js](../src/data.js) `BRANCHEN`-Array um `reglementiert: true|false` Flag und [functions/s/[subdomain]/legal.js](../functions/s/[subdomain]/legal.js) um `BRANCHE_PFLICHT`-Map. Bestehende `BRANCHEN_KAMMER`-Map (8 Berufe) wird erweitert auf ~35 reglementierte Branchen.

### Status

`[OFFEN]` Detail-Recherche pro Branche steht aus. Aufwand: ~30 Min/Branche × 35 = 17 Stunden Eigenarbeit oder per parallelen Subagents in 1 Sitzung.

### Berufsgruppen-Übersicht (Recipe-System v1)

| Berufsgruppe | Reglementierungs-Häufigkeit | Sonderbehandlung nötig? |
|---|---|---|
| Handwerk | gering (meist nur GISA + Wirtschaftskammer) | nein |
| Gastronomie | gering | nein |
| Gesundheit | **hoch** (fast alle ~25 Branchen reglementiert) | **ja** — siehe Abschnitt 10 |
| Dienstleistung | **mittel** (Anwälte, Notare, StB, Architekten, Finanzberater, Versicherungsmakler, Bestattung, Sicherheitsdienst, Hausverwaltung, Immobilien) | **ja** — siehe Abschnitt 10 |
| Bildung | gering (außer Fahrschule teilreglementiert) | nein |
| Tourismus | gering | nein |
| Handel | gering (außer Apotheke ist reglementiert, gehört aber zu Gesundheit) | nein |
| Mobilität | gering (außer Taxi/Mietwagen GISA-Pflicht) | nein |
| Agrar | gering (Direktvermarktung mit Sondervorschriften) | nein |
| Industrie | gering | nein |
| Kosmetik | gering (Permanent Make-up + Tattoo mit Hygieneverordnung) | nein |
| Kultur | gering | nein |

### Pflichtfelder-Schema

```js
const BRANCHE_PFLICHT = {
  // Beispiel — vollständige Map siehe nach Recherche
  arzt: {
    berufsbezeichnung_default: 'Arzt für Allgemeinmedizin / Facharzt für ...',
    kammer_default: 'Ärztekammer für [Bundesland]',
    aufsicht_default: 'Bezirksverwaltungsbehörde / Landesbehörde',
    berufsrecht: 'Ärztegesetz 1998 (ÄrzteG), www.ris.bka.gv.at',
    werbeverbot_quelle: '§ 53 ÄrzteG',
  },
  rechtsanwalt: {
    berufsbezeichnung_default: 'Rechtsanwalt',
    kammer_default: 'Rechtsanwaltskammer [Bundesland]',
    aufsicht_default: 'Disziplinarrat der Rechtsanwaltskammer',
    berufsrecht: 'Rechtsanwaltsordnung (RAO), www.ris.bka.gv.at',
    werbeverbot_quelle: '§ 45 RL-BA 2015',
  },
  // ... weitere ~33 Branchen siehe Detail-Recherche
};
```

### Bereits implementiert in `legal.js`

- `BRANCHEN_KAMMER` mit 8 Berufen (arzt, zahnarzt, tierarzt, apotheke, rechtsanwalt, notar, steuerberater, architekt)
- `addRequired`-Helper mit Pflichtfeld-Tracking
- Berufsbezeichnung + Verleihungsstaat (§ 5 ECG Abs 1 Z 9)
- Pflichtfeld-Logik pro Unternehmensform (einzelunternehmen, e.U., GmbH, OG, KG, AG, Verein, GesnbR)

### Noch zu implementieren

- `reglementiert: true|false` Flag im `BRANCHEN`-Array in [src/data.js](../src/data.js)
- `BRANCHE_PFLICHT` Detail-Map in [legal.js](../functions/s/[subdomain]/legal.js) — ~30 weitere Einträge
- Disziplinarbehörde-Feld im Datenmodell (`disziplinarbehoerde`)
- Portal-Warnung bei Branchen-Wahl auf reglementiertes Gewerbe

---

## 10. Reglementierte Berufe — Sonderbehandlung

> Wenn Heilberufe und Rechtsberatung in Phase 1 zugelassen sind (siehe Strategie-Entscheidung 3+4), brauchen sie zwingend diese drei Schutzschichten.

### 10.1 Werbeverbote pro Berufsrecht

| Berufsgruppe | Quelle | Was verboten ist |
|---|---|---|
| Ärzte | § 53 Ärztegesetz | reklamehaft-marktschreierische Werbung, Vergleich mit anderen Ärzten, Heilversprechen |
| Zahnärzte | § 35 Zahnärztegesetz | sinngemäß wie ÄrzteG |
| Apotheker | § 8a Apothekengesetz + AMG | Heilversprechen, irreführende Werbung |
| Rechtsanwälte | § 45 RL-BA 2015 | nicht sachliche, vergleichende, marktschreierische Werbung |
| Notare | § 5 Notariatsordnung | öffentliche Anpreisung |
| Steuerberater | § 70 WTBG | übertriebene Eigenwerbung |
| Architekten | § 30 ZTG | reklamehafte Werbung |
| Heilmasseur, Hebamme, Physiotherapeuten | MTD-Gesetz / HebG / HMG | berufsspezifische Werbe-Beschränkungen |
| Finanzdienstleister | WAG, BoerseG | irreführende Renditeversprechen |

### 10.2 Defensive KI-Prompt-Regeln

In den Generierungs-Prompts ([functions/_lib/generate.js](../functions/_lib/generate.js)) muss bei reglementierten Berufen ein zusätzlicher System-Block aktiv sein:

```
Bei Berufsgruppe Gesundheit oder Berufen aus Rechts-/Wirtschaftsberatung:
- Keine Superlative ("die besten", "Nr. 1", "Spitzen-...")
- Keine Heilversprechen oder Erfolgsgarantien
- Keine vergleichenden Aussagen gegenüber anderen Berufsausübenden
- Sachlicher, zurückhaltender Tonfall
- Fokus auf Leistungsbeschreibung, nicht auf werbliche Anpreisung
```

### 10.3 Termin-Anfrage ohne Anliegen-Feld

Recipe-System v1 plant Section "Termin-Anfrage" mit Feldern: Wunschtermin, **Anliegen kurz**, Kontakt.

→ Bei Berufsgruppe Gesundheit + reglementierten Rechtsberatungs-Branchen muss eine **Variante ohne "Anliegen kurz"** existieren. Sonst entstehen:
- Bei Heilberufen: Gesundheitsdaten (Art 9 DSGVO besondere Kategorie)
- Bei Rechtsberatung: Mandantengeheimnis (§ 9 RAO / § 37 NO / § 91 WTBG)

Beides ist mit Standard-AVV nicht abdeckbar und wäre unzulässige Verarbeitung.

### 10.4 Disclaimer im Portal + AGB

Bei Onboarding mit reglementiertem Beruf zeigt das Portal:

> "Diese Plattform ist eine Marketing-Website. Sie ersetzt keine Praxis-, Kanzlei- oder Patientenverwaltungs-Software. Patientendaten, Mandantendaten und sonstige berufsspezifische Datenverarbeitung verbleiben außerhalb dieser Plattform."

Plus AGB-Klausel in § 6 Abs 4 (siehe oben).

---

## 11. TOMs — Technisch-organisatorische Maßnahmen

> Anhang II zum AVV. Konkrete Beschreibung des Sicherheits-Setups.

### 11.1 Vertraulichkeit

| Maßnahme | Status | Beschreibung |
|---|---|---|
| Zugangskontrolle | aktiv | Supabase Auth mit verschlüsselten Passwörtern (bcrypt), JWT-basierte Sessions |
| Zwei-Faktor-Authentifizierung | `[OFFEN]` Plattform 2FA aktivierbar | Pflicht für Admin-Accounts, Empfehlung für Kunden |
| Row-Level-Security (RLS) | aktiv | Supabase RLS auf allen 4 Tabellen (Memory: `project_supabase_rls.md`) |
| Verschlüsselung in Transit | aktiv | TLS 1.3 für alle Verbindungen (Cloudflare-erzwungen) |
| Verschlüsselung at Rest | aktiv | Supabase + Cloudflare R2 server-side AES-256 |
| Pseudonymisierung | teilweise | Subdomain-IDs als Stellvertreter für Firma-Identität in Logs |

### 11.2 Integrität

| Maßnahme | Status |
|---|---|
| Eingabevalidierung | `[OFFEN]` Pre-Beta gefordert (Memory: `project_production_refactor.md`) |
| Schema-Validierung an API-Grenzen (Zod) | `[OFFEN]` Live-Plan (Stack-Modernisierung) |
| Audit-Logs | aktiv | activity_log + error_logs in Supabase |

### 11.3 Verfügbarkeit

| Maßnahme | Status |
|---|---|
| Backups Datenbank | `[OFFEN]` Cloudflare R2 täglich, 90 Tage Retention (Live-Plan) |
| Backups Storage | `[OFFEN]` wöchentlich Sync zu R2 |
| Restore-Tests | `[OFFEN]` alle 3 Monate in Staging |
| DDoS-Schutz | aktiv | Cloudflare WAF |
| Rate-Limiting | `[OFFEN]` Live-Plan (Cloudflare WAF Rules) |

### 11.4 Belastbarkeit + Wiederherstellbarkeit

| Maßnahme | Status |
|---|---|
| Disaster-Recovery-Plan | `[OFFEN]` zu dokumentieren |
| RTO (Recovery Time Objective) | `[OFFEN]` Ziel: <4h |
| RPO (Recovery Point Objective) | `[OFFEN]` Ziel: <24h |

### 11.5 Verfahren regelmäßiger Überprüfung

| Maßnahme | Frequenz |
|---|---|
| Self-Check vierteljährlich (siehe Abschnitt 19) | quartalsweise |
| Penetration-Test extern | optional ab 100 Kunden |
| Backup-Restore-Test | quartalsweise |

### 11.6 Auftragskontrolle

- Kein Auftragsverarbeiter wird ohne dokumentierten Subprozessor-Status eingesetzt
- Subprozessor-Liste auf instantpage.at/subprozessoren öffentlich
- DPA mit allen Subprozessoren (siehe Abschnitt 4)

### 11.7 DSFA — Datenschutz-Folgenabschätzung (Art 35 DSGVO)

> Vorprüfung dokumentiert 2026-05-04 nach WKO-Methodik. Geprüft gegen drei Quellen: White List (BGBl II 108/2018), Black List (DSB-Verordnung 278/2018), 9 EDSA-WP248-Kriterien (Hohes Risiko ab 2 erfüllten Kriterien).

#### Pruefergebnis pro Verarbeitungstaetigkeit

##### A) Kunden-Stammdaten (Name, E-Mail, IBAN, Stripe-Subscription)

| Pruefung | Ergebnis |
|---|---|
| White List BGBl II 108/2018 | **Greift** — "Kundenverwaltung, Rechnungswesen, Buchführung" |
| EDSA-WP248-Kriterien | 0 von 9 erfüllt |
| Black List DSB-VO 278/2018 | nicht anwendbar |

**→ Keine DSFA noetig.** White-List-Ausnahme ausreichend.

##### B) KI-Textgenerierung (Anthropic-API) fuer Kundenwebsites

Verarbeitete Daten: Firmen-Stammdaten (B2B, kein Personenbezug ueber Inhaber-Vorname/Nachname/E-Mail hinaus), Berufsbezeichnung, Branche. Output: deskriptive Texte ueber das Unternehmen.

| EDSA-Kriterium (WP248) | Erfuellt? | Begruendung |
|---|---|---|
| 1 Bewertung/Einstufung Personen | nein | Beschreibung Firma, kein Personen-Profiling |
| 2 Automatisierte Entscheidung mit Rechtswirkung | nein | Output ist Marketing-Text, keine rechtliche Entscheidung |
| 3 Systematische Ueberwachung | nein | — |
| 4 Vertrauliche / hochpersoenliche Daten | nein | B2B-Stammdaten, keine Art-9-Kategorien |
| 5 Datenverarbeitung in grossem Umfang | nein | pro Verarbeitung kleine Datenmenge, einmalig pro Kunde |
| 6 Datensatzabgleich/-zusammenfuehrung | nein | — |
| 7 Schutzbeduerftige Personen | nein | Adressat sind B2B-Unternehmer |
| 8 Innovative Technologie | **ja** | KI-API ist neuartige Verarbeitung |
| 9 Verwehrung Rechte/Dienste | nein | — |

**1 von 9 Kriterien erfuellt → keine DSFA-Pflicht** (Schwelle 2+).

**→ Keine vollstaendige DSFA noetig.** Diese schriftliche Vorpruefung als Dokumentation ausreichend.

##### C) Hosting Endkundenseiten + Kontaktformular-Daten (Cloudflare Pages)

Verarbeitete Daten: Endkunden-Eingaben aus Kontaktformularen der Kunden-Websites (Name, E-Mail, Nachricht). Web-Logs Cloudflare-seitig (IP-pseudonymisiert).

| EDSA-Kriterium | Erfuellt? | Begruendung |
|---|---|---|
| 4 Vertraulich / hochpersoenlich | nein | Standard-Kontaktformular-Felder |
| 5 Grosser Umfang | nein | Anfangs klein, lineare Skalierung mit Kundenanzahl, kein zentrales Profiling |
| 7 Schutzbeduerftige | nein | — |
| 8 Innovative Technologie | nein | Standard-Web-Hosting |
| restliche | nein | — |

**0 von 9 Kriterien erfuellt → keine DSFA-Pflicht.**

**→ Keine DSFA noetig.** Hosting ist Standard-Web-Verarbeitung.

#### Gesamtergebnis

Fuer alle drei Verarbeitungstaetigkeiten von instantpage.at ist **keine vollstaendige DSFA nach Art 35 DSGVO erforderlich**. Diese Doku-Sektion gilt als Dokumentation der Vorpruefung und wird als Anhang zum Verarbeitungsverzeichnis Art 30 gefuehrt.

**Re-Evaluation noetig wenn:**
- Personenanzahl deutlich zunimmt (Kriterium 5 "grosser Umfang") — Schwellenwert: Re-Pruefung bei >1.000 zahlenden Kunden
- Neue Verarbeitungstaetigkeit hinzukommt (z.B. Profiling der Endkunden, Newsletter-Tracking, Behavioral Analytics)
- KI-Generierung um Personen-bezogene Aussagen erweitert wird (z.B. AI-Mitarbeiter-Texte)
- Sensible Branchen-Daten (Gesundheit, Strafregister) ins Spiel kommen
- DSB ihre Black List BGBl II 278/2018 erweitert

**Hinweis:** Die White-List-Ausnahme entbindet nur von der DSFA — alle anderen DSGVO-Pflichten (Verarbeitungsverzeichnis Art 30, AVV mit Subprozessoren, Informationspflichten Art 13/14, Betroffenenrechte) bleiben unberuehrt.

---

## 12. Operative Prozesse

### 12.1 Notice-and-Takedown (§ 16 ECG, DSA)

| Schritt | Verantwortlich | SLA |
|---|---|---|
| Eingang Meldung an abuse@instantpage.at | E-Mail-System | sofort |
| Sichtung + Erst-Bewertung | Inhaber | innerhalb 24h |
| Bei begründetem Verdacht: Inhalt sperren (Status `suspended`) | Inhaber | innerhalb 24h |
| Information an Kunden mit Frist zur Stellungnahme (7 Tage) | Inhaber | innerhalb 24h |
| Endgültige Entscheidung (Wiederherstellung oder dauerhafte Entfernung) | Inhaber | innerhalb 14 Tage |
| Dokumentation des Vorgangs | Inhaber | parallel |

**Adresse:** abuse@instantpage.at
**Formular:** instantpage.at/meldung (`[OFFEN]` Setup)

### 12.2 Datenpannen-Meldeprozess (Art 33/34 DSGVO)

| Schritt | Frist |
|---|---|
| Erkennung der Datenpanne | sofort |
| Erst-Bewertung der Risiko-Lage für Betroffene | binnen 24h |
| Bei Risiko: Meldung an DSB (dsb.gv.at, Online-Formular) | binnen 72h |
| Bei hohem Risiko zusätzlich: Information der Betroffenen | unverzüglich |
| Dokumentation in `incidents.log` | parallel |
| Information der betroffenen Kunden (als Verantwortliche) | parallel zur DSB-Meldung |

**Vorlage** für interne Bewertungs-Checkliste:
- Welche Daten betroffen?
- Wie viele Betroffene?
- Risiko für Betroffene? (z.B. Identitätsdiebstahl, Diskriminierung)
- Eingrenzungs-Maßnahmen?
- Kommunikation an Betroffene nötig?

### 12.3 Trial- und Cancellation-Cleanup

| Prozess | Trigger | Aktion |
|---|---|---|
| Trial-Cleanup | Cron täglich, `trial_expires_at < now()` | Status auf `expired`, dann nach 30 Tagen DELETE |
| Cancellation Phase 1 (Reaktivierung) | nach Kündigung, 30 Tage | Subdomain bleibt online mit "pausiert"-Hinweis, Daten erhalten, Self-Service-Reaktivierung möglich |
| Cancellation Phase 2 (Soft-Delete) | T+30 nach Kündigung, weitere 60 Tage | Subdomain offline, `deleted_at` gesetzt, Reaktivierung nur via Support |
| Cancellation Phase 3 (Hard-Delete) | T+90 nach Kündigung | DELETE Order + Storage + Auth-User, Subdomain-Recycling |
| Subdomain-Recycling | nach Hard-Delete | Subdomain freigeben |
| Beta-Tester-Cleanup | einmalig vor Live-Schaltung | DELETE alle Beta-Daten + Subdomains |

→ Bestehende Endpoints: `functions/api/trial-cleanup.js` (existiert, braucht Cron-Trigger laut Memory). Live: erweitern um 3-Phasen-Cancellation-Cleanup.

### 12.4 DSGVO-Auskunftsrecht (Art. 15) + Recht auf Löschung (Art. 17)

**Auskunftsrecht (Art. 15):**
- Self-Service-Button im Portal: "Meine Daten herunterladen"
- Format: **PDF** (alle gespeicherten Daten zum Order, lesbar zusammengefasst)
- Frist: max 30 Tage, in Praxis sofort
- Activity-Log-Eintrag: `dsgvo_export_requested`

**Recht auf Löschung (Art. 17):**
- Self-Service-Button im Portal: "Account löschen" (nicht zu prominent platzieren)
- Sofortige Bestätigungs-Mail mit 14 Tage Widerruf-Möglichkeit
- Nach 14 Tagen Hard-Delete-Cascade (orders + Storage + Auth)
- Activity-Log-Eintrag: `dsgvo_delete_requested` + nach Ausführung `dsgvo_delete_executed` mit Hash-Bestätigung
- Außerhalb des normalen Cancellation-Flows (Cancellation = Subscription-Ende, Löschung = Daten-Vernichtung)

### 12.5 AVV-Akzeptanz-Verfahren

- **Beim ersten Login** wird AVV als Modal eingeblendet (nach Account-Erstellung, vor Portal-Zugriff)
- AVV wird als **PDF-Download** angeboten (statisch generiert mit Kunden-Stammdaten als Anhang I)
- Akzept-Klick: Pflicht-Checkbox + "Akzeptieren"-Button
- Activity-Log-Eintrag: `consent_recorded` mit `details: {document: 'avv', version: 'v1.0', timestamp, ip_hash}`
- Bei AVV-Update: alle Kunden müssen erneut akzeptieren beim nächsten Login

### 12.6 AGB-Akzeptanz-Verfahren `[OFFEN]`

> Stub — UX-Detail vor Live-Schaltung ausspezifizieren. Voraussichtlich analog zu § 12.5 AVV-Akzeptanz, mit folgenden offenen Punkten:

- **Akzept-Zeitpunkt:** Beim Trial-Start (Account-Erstellung) oder beim ersten Login? — vermutlich beim Trial-Start, sonst ist Trial-Nutzung ohne AGB-Bindung.
- **Darstellung:** AGB-Volltext im Modal scrollbar oder PDF-Download wie AVV?
- **Activity-Log-Eintrag:** `consent_recorded` mit `details: {document: 'agb', version: 'vX.Y', timestamp, ip_hash}`
- **Bei AGB-Update:** alle Kunden müssen erneut akzeptieren — Sperrung des Portal-Zugriffs bis Akzept oder soft-Banner?
- **Bildrechten-Bestätigung:** ist eigener Akzept-Flow pro Bild-Upload (siehe AGB-Klausel § 7 in Abschnitt 5), nicht im AGB-Modal.

---

## 13. AI Act 2.8.2026

### Stichtag

**2.8.2026** = Geltungsbeginn der Transparenzpflichten nach Art 50 AI Act (VO 2024/1689). Heute ist 2026-05-04 → noch ~3 Monate.

### Pflichten für instantpage.at

| Pflicht | Umsetzung |
|---|---|
| Art 50 Abs 2 — Kennzeichnung KI-generierter Inhalte | Default-Footer auf jeder Kunden-Website: "Inhalte mit KI-Unterstützung erstellt — instantpage.at" |
| Art 50 Abs 4 — Kennzeichnung in maschinenlesbarer Form | Schema.org-Marker oder Meta-Tag in HTML |
| Art 50 Abs 1 — Information der Endnutzer (Chatbot etc.) | Phase 1 N/A (kein Chatbot) — relevant wenn Managed Agent eingeführt |
| Art 4 — KI-Kompetenz beim Anbieter | Selbststudium + Dokumentation, RTR-Servicestelle als Quelle |

### Auslegung — Quality-Check + Kunden-Freigabe als Ausschlussgrund

Laut WKO-Auslegung der Kennzeichnungspflicht (siehe `Kennzeichnungspflicht für KI-Inhalte` in § 20) entfällt die Art-50-Kennzeichnungspflicht für Texte, **wenn jemand im Betrieb den Text sichtet und freigibt**. Der bestehende SiteReady-Workflow (Quality-Score-Schwelle + verpflichtende Kunden-Freigabe vor Veröffentlichung) erfüllt diese Voraussetzung.

**Konsequenz:** Der Footer-Hinweis bleibt als defensive Maßnahme (Transparenz gegenüber Endnutzern, Marketing-Vorteil), aber nicht zwingend rechtlich gefordert. Bei Streitfall stützt sich die Argumentation auf den dokumentierten Freigabeprozess (Memory: `project_recipe_system_v1.md`).

**WKO-Wording-Empfehlung als Fallback:** „Dieser Text wurde mit Unterstützung von KI erstellt." — kurz, ausreichend, barrierearm.

### Quellen

- AI Act Originaltext: <https://eur-lex.europa.eu/legal-content/DE/TXT/HTML/?uri=CELEX:32024R1689>
- WKO AI Act Übersicht: <https://www.wko.at/digitalisierung/ai-act-eu>
- WKO Kennzeichnungspflicht KI-Inhalte: <https://www.wko.at/oe/gewerbe-handwerk/kennzeichnungspflicht-fuer-ki-inhalte>
- WKO KI-Guidelines-Vorlage: <https://musterformulare.wko.at/digitalisierung/ki-guidelines>
- RTR KI-Servicestelle: <https://www.rtr.at/rtr/service/ki-servicestelle/ai-act/ki-kompetenz.de.html>

### Aktionen

| Aktion | Frist |
|---|---|
| Footer-Hinweis auf Kundenseiten implementieren | bis 2026-08-02 |
| AI-Kennzeichnung in AVV-Anhang I dokumentiert | bis Live |
| Schema.org-Marker für AI-Generated-Content | bis 2026-08-02 |
| KI-Kompetenz-Dokumentation (eigenes Wissen) | laufend |

---

## 14. Markenrecht

### Status

`[OFFEN]` Markenrechtsrecherche für "instantpage.at" und "InstantPage" als Wortmarke.

### Strategischer Rahmen

instantpage.at ist als **oesterreichisches Vertrauensprodukt** positioniert (Memory `feedback_at_vertrauensprodukt.md`). Markenrecht-Pruefung folgt diesem Fokus:

- **Primaere Pruefung: Oesterreichisches Patentamt** — AT-Markenschutz ist Phase-1-Bedarf
- **Sekundaer: EUIPO** — wichtig wegen Vorrang von EU-Marken bei Konflikt mit AT-Anmeldung, aber kein Schutzziel in Phase 1
- **Verwechslungsgefahr** wird am oesterreichischen Durchschnittskonsumenten gemessen — internationale Marken die in AT nicht aktiv vermarktet werden, sind weniger kritisch
- **Anmeldungs-Strategie:** AT-Wortmarke ~280 € fuer Phase 1, EU-Marke ~850 € erst zu Beginn von Phase 2 (DACH/EU)

### Vorab-Recherche-Stand 2026-05-04

Web-Recherche ueber Justia/USPTO und WIPO — keine direkte EUIPO/Patentamt-Abfrage moeglich (CAPTCHA, JS-SPA).

| Treffer | Inhaber | Quelle | Branchen-Konflikt |
|---|---|---|---|
| **INSTANTPAGE** US 4072262 | GO DADDY OPERATING COMPANY, LLC | USPTO | hoch — "Software fuer Erstellen, Posten, Pflegen von Websites" identische Branche |
| **INSTAPAGE** US 5339935 | Instapage, Inc. | USPTO | mittel — Landing-Page-Software, klanglich aehnlich |
| **instantpage.dev** | unbekannt, Konkurrenz-Domain aktiv | Web | niedrig — Domain-/SEO-Konflikt, kein Markenschutz nachweisbar |
| **instant.page** | Open-Source-Projekt (Performance-Trick) | github.com | niedrig — anderer Use-Case |

**Bewertung im AT-only-Kontext:**
- GoDaddy/Instapage sind in AT nicht im B2B-KMU-Segment aktiv vermarktet → Verwechslungsgefahr beim AT-Durchschnittskonsumenten gering, aber nicht null
- AT-Patentamt-Direkt-Abfrage steht aus

### Was zu prüfen ist

| Quelle | Was | Prioritaet |
|---|---|---|
| Österreichisches Patentamt — Markenregister | <https://see-ip.patentamt.at/> Wortmarke "instantpage" / "instant page" / "instapage" in Klassen 9, 35, 38, 42 | **hoch** |
| EUIPO — EU-Markenregister (TMView/eSearch plus) | <https://www.tmdn.org/tmview/> + <https://euipo.europa.eu/eSearch/> dieselbe Recherche EU-weit | hoch |
| WIPO Madrid Monitor — internationale Marken | <https://www3.wipo.int/madrid/monitor/> | mittel |
| Domain-Konflikte | instantpage.com (GoDaddy), instantpage.de, instantpage.eu, instantpage.dev — Inhaber identifizieren | mittel |
| Sound-Ähnlichkeiten | "Instapage", "InstaPage", "Instant Page", "InstaPay" (verwechselbar?) | hoch |

### Aufwand und Optionen

- **Selbstrecherche AT-Patentamt:** ~30 Min, kostenlos — primaere Pflicht
- **WKO-Markenberatung:** kostenlos fuer Mitglieder, gibt qualifizierte Einschaetzung — Termin angefragt 2026-05-04
- **Markenanwalt:** 200–500 €, falls Konflikt-Risiko nach WKO-Beratung weiter unklar

### Konsequenzen

- **Wenn AT-frei:** AT-Wortmarken-Anmeldung ~280 € (10 Jahre Schutz). EU-Anmeldung erst zu Phase-2-Beginn (DACH/EU)
- **Wenn AT-belegt:** Brand-Wechsel zwingend — Marketing-Investment in `instantpage.at` einstellen, oesterreichisch klingende Brand-Alternativen brainstormen
- **Wenn EU-Konflikt aber AT-frei:** Anwalt-Konsultation zu Verwechslungsgefahr-Risiko in AT (~500 €). AT-Anmeldung kann dennoch moeglich sein wenn EU-Marken-Inhaber nicht in AT taetig ist und keine Widerspruchsfrist nutzt.

### Aktionen

| Aktion | Status |
|---|---|
| AT-Patentamt SEE-IP Browser-Recherche | `[OFFEN]` |
| EUIPO eSearch plus Browser-Recherche | `[OFFEN]` |
| WKO-Markenberatung Termin (Mail raus 2026-05-04) | `[OFFEN]` |
| Bei freiem Stand: AT-Wortmarke anmelden | `[BLOCKER]` vor erstem Marketing-Spend |
| Bei Konflikt: Brand-Alternativen-Workshop | bei Trigger |

---

## 15. UWG — Werbeaussagen + Slogans

### Verbotene Begriffe (UWG-Risiko + Versicherer-Voraussetzungs-Risiko)

| Begriff | Warum verboten |
|---|---|
| "rechtssicher" | Garantieaussage die nicht haltbar ist (Kunde bleibt Verantwortlicher) |
| "100% DSGVO-konform" | dito |
| "abmahnsicher" | dito |
| "garantiert" (im Compliance-Kontext) | dito |
| "die beste Plattform" | nicht belegbarer Superlativ |
| Vergleichende Aussagen ggü. Mitbewerbern (Wix, Jimdo, Herold) ohne sachliche Grundlage | UWG § 2 Abs 4 |

### Defensive Formulierungen

| Statt | Besser |
|---|---|
| "rechtssicher" | "wir unterstützen Sie bei der Erfüllung Ihrer rechtlichen Pflichten" |
| "DSGVO-konform" | "DSGVO-orientiert", "mit Hilfestellungen zur DSGVO-Umsetzung" |
| "100% Sicher" | "professionell verschlüsselt", "auf Industriestandard abgesichert" |
| "die beste" | "speziell für österreichische KMU entwickelt" |
| "garantiert in 5 Minuten" | "in wenigen Minuten startklar" |

### Slogans für Landing Page (Vorschläge defensiv)

- "Premium-Website für österreichische KMU — KI-generiert, professionell, branchen-tauglich"
- "Marketing-Website ohne Agentur. Speziell für Handwerker, Gastronomen, Berater, Praxen."
- "Wir bauen Ihre Website. Sie bleiben Inhaber."
- "Schneller online. Professionell betrieben. Transparent abrechnet."

### Aktionen

- Bestehende Landing-Page-Slogans auditieren
- Pricing-Texte auditieren
- Pro-Plan-Beschreibung auditieren
- "Sichtbarkeits-Check"-Lead-Magnet (geplant) defensiv formulieren

---

## 16. Beta → Live Migration

### Entschiedene Strategie (Memory: `project_production_refactor.md`)

**Sauberer Schnitt** — keine Daten-Migration. Beta-Domain (sitereadyprototype.pages.dev) wird abgedreht, Beta-Tester legen sich auf Live (instantpage.at) neu an.

### Konsequenzen für Compliance

| Punkt | Aktion |
|---|---|
| Beta-Tester-Daten in alter DB | DSGVO Art 17: löschen nach Zweck-Wegfall — DELETE alle Beta-Daten |
| Beta-Tester informieren | E-Mail mit Hinweis auf Domain-Wechsel + Promo-Code für Live + Hinweis auf Datenlöschung |
| Beta-Subdomain | nach Abdrehen: 410 Gone oder Redirect-Hinweis-Seite |
| Beta-Logs | nach 30 Tagen automatisch gelöscht |

### Aktionen vor Live-Schaltung

- E-Mail an alle Beta-Tester (Vorlage erstellen)
- DELETE-Skript für Beta-DB-Daten
- DNS-Wechsel sitereadyprototype → 410-Status oder Redirect

---

## 17. Roadmap (Phase A–D)

### Phase A — Vor Stack-Modernisierung (~3 Tage Eigenarbeit)

Parallel zu laufender Beta. Vorbereitung der Compliance-Grundlagen.

- Markenrechts-Recherche instantpage.at
- Versicherungs-Sourcing starten (Makler-Termin)
- Beta-DB Aufräumstrategie definieren
- Subprozessor-DPAs herunterladen + sichten (Anthropic, Stripe, Cloudflare, Supabase)
- Code-Audit Cookie-Domain-Scope
- Strategie-Entscheidungen (Abschnitt 1) durchgehen + festlegen
- Stammdaten (Abschnitt 2) zusammenstellen

### Phase B — Während Stack-Modernisierung (~10 Tage parallel)

In TypeScript/Next.js-Rebuild integrieren. Memory: `project_production_refactor.md` Abschnitt "Code-Basis-Modernisierung".

- AGB-Skeleton aus 3 WKO-Vorlagen kombiniert finalisieren (2 Tage)
- AVV auf EU-SCC-Basis befüllen (1 Tag)
- Plattform-Datenschutzerklärung mit allen Subprozessoren (1 Tag)
- Plattform-Impressum (0,5 Tag)
- Branchen-Pflichtfeld-Matrix Detail-Recherche (2 Tage / 4h via Subagents)
- Defensive KI-Prompts für reglementierte Berufe (1 Tag)
- Termin-Anfrage-Variante ohne Anliegen-Feld (0,5 Tag)
- Disclaimer-Block + AGB-Klauseln für reglementierte Berufe (0,5 Tag)
- AI Act Footer-Hinweis auf Kundenseiten (0,5 Tag)
- Verarbeitungsverzeichnis Art 30 (1 Tag)

### Phase C — Vor Live-Schaltung (~3 Tage Eigenarbeit)

- UX-Schutzmechanismen (Pflicht-Checkboxen) (1 Tag)
- Notice-and-Takedown-Prozess + abuse@ einrichten (0,5 Tag)
- Datenpannen-Plan dokumentieren (0,5 Tag)
- TOMs-Dokumentation mit konkretem Setup (1 Tag)
- Trial-Cleanup + Cancellation-Cleanup-Crons aktivieren (0 Tage neue Arbeit)
- Versicherung abschließen + Voraussetzungen erfüllen
- Stripe Live-Verifikation abschließen (1–2 Wochen Lead-Time einplanen)
- Beta-Tester informieren + Beta-Daten löschen
- Markenanmeldung (sofern frei)

### Phase D — Erste Wochen Live (laufend)

- Self-Check vierteljährlich (siehe Abschnitt 19)
- AI Act Stichtag 2.8.2026 im Kalender
- Monitoring der Trigger-Schwellen (siehe Abschnitt 18)
- Datenpannen-Übung intern (Probelauf)

---

## 18. Anwalt-Trigger-Schwellen

> Bei einem dieser Ereignisse: Anwalt-Stunden buchen. Realistisch in den ersten 12 Monaten 0–2.000 € statt 9.450 € upfront.

| Trigger | Aktion | Geschätzte Anwalts-Stunden |
|---|---|---|
| 30 zahlende Kunden | AGB+AVV Schluss-Sichtung | 5h, ~1.750 € |
| 1.000 € MRR | komplette Audit | 8h, ~2.800 € |
| Erste Reklamation/Abmahnung | sofortige Beratung | 2–5h, ~700–1.750 € |
| Erster reglementierter Heilberuf-Kunde mit Sondersituation | Vorlagen-Spezial-Check | 2h, ~700 € |
| Datenpanne | DSB-Verfahren-Beratung | 5h, ~1.750 € |
| Geschäftsmodell-Änderung (B2C, neue Drittländer, neue Branchen) | Re-Audit | 5h, ~1.750 € |
| AI Act Stichtag 2.8.2026 vorbereiten | optionale Vorab-Sichtung | 2h, ~700 € |

### Wo das Restrisiko bei "ohne Anwalt" liegt

| Stelle | Realistisches Risiko | Mitigation ohne Anwalt |
|---|---|---|
| Eigene Haftungsbegrenzung in AGB hält nicht | 5–10% Klauseln werden im Streit gekippt | nahe an WKO-Mustern bleiben + VSH-Fallback |
| Reglementierter Beruf-Kunde verwendet Texte die § 53 ÄrzteG verletzen | UWG-Abmahnung an Kunden, Regress an dich | defensive Default-Prompts + Disclaimer + Inhaltsfreigabe-Pflicht in AGB |
| Branchen-Pflichtfeld-Matrix hat Lücke | Mitstörerhaftung bei betroffenen Kunden | Self-Check vierteljährlich + WKO-Newsletter abonnieren |

Kombiniert: ~20% Restrisiko. Mit IT-Haftpflicht-Paket gedeckt für die wirtschaftliche Dimension.

---

## 19. Self-Check vierteljährlich

> Eigene Checkliste, ~2h pro Quartal. Per `/schedule`-Trigger automatisierbar (Background-Agent prüft + meldet Auffälligkeiten).

### Checkliste

- [ ] Subprozessor-Liste aktuell? (neuer Cloud-Service angebunden?)
- [ ] Verarbeitungsverzeichnis aktuell? (neue Datenkategorie?)
- [ ] DPAs der Subprozessoren noch gültig? (Stand prüfen, evtl. Updates)
- [ ] WKO-Vorlagen aktualisiert? (Gesetzesänderung?) — Quelle: <https://www.wko.at/agb>
- [ ] DSB-Pressemitteilungen geprüft? — Quelle: <https://www.dsb.gv.at/news.html>
- [ ] AI-Act-Stichtage im Blick? — nächster: 2.8.2026
- [ ] EU-U.S. Data Privacy Framework noch gültig? — Schrems-III-Status
- [ ] Kunden-Wachstum gegen Anwalt-Trigger geprüft? (siehe Abschnitt 18)
- [ ] Backup-Restore-Test durchgeführt? (in Staging)
- [ ] Versicherungs-Voraussetzungen weiterhin erfüllt? (2FA, Backups, etc.)
- [ ] Notice-and-Takedown-Reaktionszeiten eingehalten?
- [ ] Datenpannen-Vorfälle dokumentiert + reflektiert?
- [ ] Branchen-Pflichtfeld-Matrix für neue Branchen ergänzt?

### Quartalsweise Aktion

Self-Check-Ergebnis als Memory-Eintrag oder im internen `incidents.log` festhalten.

---

## 20. Quellenverzeichnis

### EU-Originaltexte

- DSGVO: <https://eur-lex.europa.eu/legal-content/DE/TXT/HTML/?uri=CELEX:32016R0679>
- EU-SCC Art 28: <https://eur-lex.europa.eu/legal-content/DE/TXT/HTML/?uri=CELEX:32021D0915>
- AI Act: <https://eur-lex.europa.eu/legal-content/DE/TXT/HTML/?uri=CELEX:32024R1689>
- DSA: <https://eur-lex.europa.eu/legal-content/DE/TXT/HTML/?uri=CELEX:32022R2065>

### WKO-Materialien (autoritativ AT)

#### Themen-Übersichten

- AGB-Übersicht: <https://www.wko.at/agb>
- IT-Betreiberdienstleistungen B2B AGB: <https://www.wko.at/oe/agb/agb-it-betreiberdienstleistungen-b2b.pdf>
- IT-Programmierdienstleistungen B2B AGB: <https://www.wko.at/oe/agb/agb-it-programmierdienstleistungen-b2b.pdf>
- IT-Software-Support B2B AGB: <https://www.wko.at/oe/agb/agb-software-support-b2b.pdf>
- Impressum-Übersicht: <https://www.wko.at/internetrecht/website-impressum>
- Impressum-Broschüre PDF: <https://www.wko.at/oe/internetrecht/das-korrekte-website-impressum.pdf>
- ECG-Tool: <https://firmen.wko.at/Web/ECGHint.aspx>
- Datenschutzerklärung-Checkliste: <https://www.wko.at/internetrecht/datenschutzerklaerung-checkliste-infopflichten-dsgvo-tkg-we>
- Datenverarbeitung Webshop/Website: <https://www.wko.at/internetrecht/datenverarbeitung-webshop-website>
- AI Act Übersicht: <https://www.wko.at/digitalisierung/ai-act-eu>
- AI Act Kennzeichnungspflicht ab 08/2026: <https://www.wko.at/oe/gewerbe-handwerk/kennzeichnungspflicht-fuer-ki-inhalte>
- DSA Provider-Verpflichtungen: <https://www.wko.at/internetrecht/digital-services-act-verpflichtungen-provider>
- Barrierefreiheits-Gesetz (BaFG) E-Commerce: <https://www.wko.at/internetrecht/barrierefreiheitsgesetz-e-commerce>
- DSGVO Übersicht: <https://www.wko.at/datenschutz/uebersicht>
- Pflichten des Verantwortlichen: <https://www.wko.at/datenschutz/eu-dsgvo-pflichten-verantwortliche>

#### DSFA — Datenschutz-Folgenabschätzung

- Ablaufplan DSFA: <https://www.wko.at/datenschutz/eu-dsgvo-ablaufplan-folgenabschaetzung>
- DSFA und vorherige Konsultation: <https://www.wko.at/datenschutz/eu-dsgvo-datenschutz-folgenabschaetzung-konsultation>
- DSFA-Ausnahmen für IT-Dienstleister (BGBl II 108/2018): <https://www.wko.at/oe/information-consulting/unternehmensberatung-buchhaltung-informationstechnologie/it-dienstleistung/ausnahmen-datenschutz-folgenabschaetzung>

#### Drittland-Datenverkehr

- Prüfschema internationaler Datenverkehr: <https://www.wko.at/datenschutz/eu-dsgvo-pruefschema-internationaler-datenverkehr>
- Internationaler Datenverkehr EU-USA: <https://www.wko.at/datenschutz/internationaler-datenverkehr-eu-usa>

#### Datenpannen (Art 33/34 DSGVO)

- Themen-Seite Meldung Datenschutzverletzungen: <https://www.wko.at/datenschutz/eu-dsgvo-meldung-von-datenschutzverletzungen>
- Muster Behörden-Meldung (PDF): <https://www.wko.at/vlbg/gewerbe-handwerk/personenberatung-betreuung/eu-dsgvo-databreachnotification-behoerde.pdf>
- Muster Benachrichtigung Betroffene: <https://www.wko.at/datenschutz/eu-dsgvo-data-breach-notification-betroffene>

#### Sicherheit (TOMs)

- Leitfaden technische und organisatorische Maßnahmen: <https://www.wko.at/oe/it-sicherheit/leitfaden-massnahmen-dsgvo-1.pdf>

#### WKO-Musterformulare (DOCX zum Befüllen)

Lokale Kopien im Repo: [`docs/_archive/wko-muster/`](_archive/wko-muster/) — siehe README dort fuer Inventarliste + Aktualisierungs-Hinweise.

- Hub Musterformulare: <https://musterformulare.wko.at/>
- Hub Muster + Vorlagen: <https://www.wko.at/wko-muster-vorlagen>
- AVV-Mustervertrag (DE+EN) — lokal: [`AVV-Mustervertrag-DE.docx`](_archive/wko-muster/AVV-Mustervertrag-DE.docx) / [`-EN.docx`](_archive/wko-muster/AVV-Mustervertrag-EN.docx) / [`-DE.pdf`](_archive/wko-muster/AVV-Mustervertrag-DE.pdf), Quelle <https://wko.at/service/wirtschaftsrecht-gewerberecht/eu-dsgvo-mustervertrag-auftragsverarbeitung.html>
- Data Breach Notification Behörde — lokal: [`DataBreach-Behoerde.pdf`](_archive/wko-muster/DataBreach-Behoerde.pdf)
- Data Breach Notification Betroffene — Quelle <https://www.wko.at/datenschutz/eu-dsgvo-data-breach-notification-betroffene> (DOCX manuell laden, siehe README)
- Verarbeitungsverzeichnis Art 30 Verantwortliche — Quelle <https://www.wko.at/datenschutz/eu-dsgvo-verarbeitungsverzeichnis-verantwortliche-muster> (DOCX manuell laden)
- Verarbeitungsverzeichnis Art 30 Auftragsverarbeiter — Quelle <https://www.wko.at/datenschutz/eu-dsgvo-verarbeitungsverzeichnis-auftragsverarbeiter-muster> (DOCX manuell laden)
- Dokumentationsvorlage Betroffenenrechte: <https://www.wko.at/datenschutz/eu-dsgvo-dokumentation-betroffenenrechte-muster>
- Datenschutzerklärung Mitarbeiter (Muster): <https://www.wko.at/datenschutz/dsgvo-datenschutzerklaerung-mitarbeiter-muster>
- KI-Guidelines-Vorlage Unternehmen: <https://musterformulare.wko.at/digitalisierung/ki-guidelines>

### Behörden + Kammern

- DSB Datenschutzbehörde: <https://www.dsb.gv.at/>
- RIS — Bundesrecht: <https://www.ris.bka.gv.at/>
- RTR KI-Servicestelle: <https://www.rtr.at/rtr/service/ki-servicestelle/ai-act/ki-kompetenz.de.html>
- Sozialministeriumservice (BaFG-Vollzug): <https://www.sozialministeriumservice.gv.at/>
- Österreichisches Patentamt (Marken): <https://see-ip.patentamt.at/>
- EUIPO (EU-Marken): <https://www.tmdn.org/tmview/>
- FMA: <https://www.fma.gv.at/>

### Berufsrecht-Quellen für reglementierte Berufe

- Ärztekammer Österreich: <https://www.aerztekammer.at/>
- Zahnärztekammer: <https://www.zahnaerztekammer.at/>
- Tierärztekammer: <https://www.tieraerztekammer.at/>
- Apothekerkammer: <https://www.apothekerkammer.at/>
- Rechtsanwaltskammer: <https://www.rechtsanwaelte.at/>
- Notariatskammer: <https://www.notar.at/>
- Kammer der Steuerberater und Wirtschaftsprüfer: <https://www.ksw.or.at/>
- Bundeskammer der Ziviltechnikerinnen: <https://www.arching.at/>
- Hebammen-Gremium: <https://www.hebammen.at/>

---

## Anhang — Verbindung zu anderen Repo-Dokumenten

- [docs/business-case-kosten.md](business-case-kosten.md) — Wirtschaftlichkeit
- [docs/_archive/Fragen_Anwaeltin_Instantpage.xlsx](_archive/Fragen_Anwaeltin_Instantpage.xlsx) — vor "ohne Anwalt"-Entscheidung erstellte Fragen-Sammlung; Inhalte können als Inspiration dienen
- [docs/mockups/](mockups/) — Stil-Mockups
- [CLAUDE.md](../CLAUDE.md) — Projekt-Anweisungen
- [src/data.js](../src/data.js) — Branchen-Datenmodell (BRANCHEN, BRANCHEN_GRUPPEN)
- [functions/s/[subdomain]/legal.js](../functions/s/[subdomain]/legal.js) — Impressum-Generator (BRANCHEN_KAMMER, addRequired)
- [functions/_lib/generate.js](../functions/_lib/generate.js) — Text-Generierung (Prompt-Anpassungen für reglementierte Berufe)

## Anhang — Verbindung zu Memory

- `project_production_refactor.md` — Live-Roadmap (Stack, Operations, Hardening, Marketing)
- `project_recipe_system_v1.md` — Kundenseiten-Architektur final
- `project_kundenseiten_roadmap_2026-04-17.md` — Kundenseiten-Qualitäts-Roadmap
- `project_design_references_live.md` — Editorial-Theme-Referenzen
- `project_supabase_rls.md` — RLS-Status (Stand April 2026 für alle 4 Tabellen aktiv)
- `feedback_rate_limiting_live.md` — Rate-Limiting erst Live (CF WAF)
- `feedback_beta_fokus.md` — Beta = nur Look & Feel mit Freunden, keine Live-Features

---

*Ende Living Document. Stand 2026-05-04. Weiterentwickeln wann immer Strategie-Entscheidung getroffen, Stammdatum geklärt, neue Subprozessor angebunden, Branche reglementiert recherchiert, Anwalt-Trigger erreicht.*
