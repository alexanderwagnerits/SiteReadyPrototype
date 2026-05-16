# Datenschutzerklaerung instantpage.at — Volltext

**Stand:** Erstdraft 2026-05-16 — Eigenarbeit auf Basis WKO-Checkliste DSGVO + WKO-Datenverarbeitung Webshop, ergaenzt um Plattform-spezifische Verarbeitungen.
**Status:** `[ENTWURF]` — vor Live-Schaltung: (a) Stammdaten-Platzhalter ersetzen, (b) RechtGPT-Plausibilitaets-Check fuer Klausel-Wordings, (c) Subprozessoren-Liste mit DPA-Sign-off-Datum aktualisieren.
**Quelle Skeleton:** `LIVE-COMPLIANCE.md` § 8 (10 Pflicht-Bausteine).

---

# Datenschutzerklaerung

**Letzte Aktualisierung:** [DATUM_LIVE]

Diese Datenschutzerklaerung informiert ueber die Verarbeitung personenbezogener Daten auf der Plattform instantpage.at gemaess Datenschutz-Grundverordnung (DSGVO) und Datenschutzgesetz (DSG).

## 1. Verantwortlicher

Verantwortlicher im Sinne der DSGVO ist:

**Wagner IT-Solutions e.U.**
Inhaber: Alexander Wagner
[Geschaeftsanschrift, PLZ, Ort, Oesterreich]
Firmenbuch: FN 609574h, Handelsgericht Wien
UID: [ATU...]
E-Mail: office@instantpage.at
Telefon: [Telefonnummer]

Der Verantwortliche betreibt die Plattform instantpage.at als Software-as-a-Service-Loesung zur Erstellung und zum Betrieb von Unternehmens-Websites fuer oesterreichische Unternehmer.

## 2. Kontakt fuer Datenschutzanfragen

Fuer Fragen zur Verarbeitung Ihrer Daten und zur Ausuebung Ihrer Betroffenenrechte:

**E-Mail:** datenschutz@instantpage.at

Eine bestellte Datenschutzbeauftragte besteht nicht — die Voraussetzungen des Art. 37 DSGVO sind nicht erfuellt (kein Kerngeschaeft mit umfangreicher regelmaessiger Beobachtung und keine umfangreiche Verarbeitung besonderer Datenkategorien).

## 3. Verarbeitungszwecke und Rechtsgrundlagen

Wir verarbeiten Ihre personenbezogenen Daten zu folgenden Zwecken und auf folgenden Rechtsgrundlagen:

### 3.1 Vertragsabwicklung (Plan-Buchung, Portal-Nutzung)

- **Zwecke:** Anlage und Verwaltung Ihres Plattform-Kontos, Bereitstellung der gebuchten Plan-Leistungen, Self-Service-Portal-Zugriff, Generierung Ihrer Website und der zugehoerigen Rechtstexte.
- **Rechtsgrundlage:** Art. 6 Abs. 1 lit. b DSGVO (Vertragserfuellung).
- **Daten:** Firmenwortlaut, Anschrift, Rechtsform, Firmenbuchnummer / GISA-Zahl, UID-Nummer, Inhaber-Name, Kontaktdaten (E-Mail, Telefon), bei reglementierten Berufen zusaetzlich Berufsbezeichnung, Kammer-Mitgliedschaft, Aufsichtsbehoerde.

### 3.2 Trial-Verwaltung (Vertragsanbahnung)

- **Zwecke:** 7-Tage-Testphase, technische Bereitstellung der Test-Subdomain, Trial-Reminder-Mails.
- **Rechtsgrundlage:** Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche Massnahmen).
- **Daten:** wie 3.1, zusaetzlich Trial-Start-/-Ende-Datum und Aktivierungsstatus.

### 3.3 Zahlungsabwicklung

- **Zwecke:** Abwicklung der Plan-Vergueteung, Rechnungsstellung, Erfuellung steuerrechtlicher Aufbewahrungspflichten.
- **Rechtsgrundlagen:** Art. 6 Abs. 1 lit. b DSGVO (Vertragserfuellung) und Art. 6 Abs. 1 lit. c DSGVO (rechtliche Verpflichtung — § 132 BAO, UGB § 212).
- **Daten:** Stripe-Kunden-ID, Rechnungsnummer, Rechnungsbetrag, Zahlungsmethoden-Token (keine vollstaendigen Zahlungsdaten — diese verbleiben bei Stripe), Rechnungs-Adresse, UID-Nummer.

### 3.4 Direktansprache (Cold Outreach) `[BEFRISTET — Pre-Launch + Monat 1-2]`

- **Zwecke:** Kontaktaufnahme zu Unternehmern, deren Kontaktdaten oeffentlich gelistet sind (WKO-Firmenverzeichnis firmen.wko.at, FirmenABC, oeffentliche Branchenverzeichnisse), zur Information ueber das Angebot der Plattform.
- **Rechtsgrundlage:** Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse — Vermarktung B2B-Software an oeffentlich identifizierbare Unternehmer; Interessen der betroffenen Person ueberwiegen nicht, da Verarbeitung minimal, oeffentlich zugaengliche Quellen und 1-Klick-Opt-out).
- **Daten:** Firmenname, Inhaber-Name, oeffentliche E-Mail-Adresse, Branche, Region, ggf. Web-Praesenz-Status. Nicht direkt erhoben — Quelle daher gemaess Art. 14 DSGVO im Mail-Footer offengelegt.
- **Speicherdauer:** 12 Monate nach Erstkontakt, danach Loeschung; bei Opt-out sofortige Aufnahme in Suppression-Liste mit dauerhafter Sperre.
- **Widerspruchsrecht:** jederzeit ueber opt-out@instantpage.at (1 Klick).

### 3.5 Newsletter (nur bei aktivem Opt-in)

- **Zwecke:** Versand von Produkt-Updates, Branchen-Tipps und neuen Funktionen.
- **Rechtsgrundlage:** Art. 6 Abs. 1 lit. a DSGVO (Einwilligung). Einwilligung kann jederzeit mit Wirkung fuer die Zukunft widerrufen werden (Abmelde-Link in jedem Newsletter).
- **Daten:** E-Mail-Adresse, Anrede, Firmenname, Anmelde-Datum, Opt-in-Beweis (Double-Opt-in-Logfile).

### 3.6 Produktverbesserung und Statistik

- **Zwecke:** Auswertung der Nutzung der Plattform zur Verbesserung der Funktionen, Identifikation technischer Fehler, Sicherstellung der Stabilitaet.
- **Rechtsgrundlage:** Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse — Produktentwicklung; Interessen der betroffenen Person ueberwiegen nicht, da Daten ueberwiegend aggregiert und pseudonymisiert verarbeitet werden).
- **Daten:** Pageviews, Referrer, Device-Klasse (aggregiert via Cloudflare Web Analytics, ohne Cookies, ohne IP-Speicherung); Portal-Aktivitaets-Logs (welche Funktion wurde benutzt, Zeitstempel).

### 3.7 Sicherheit und Bot-Schutz

- **Zwecke:** Abwehr von Angriffen, Schutz vor Bot-Submissions, technische Verfuegbarkeit.
- **Rechtsgrundlage:** Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse — Plattform-Sicherheit) und Art. 32 DSGVO (technisch-organisatorische Massnahmen).
- **Daten:** IP-Adressen in Webserver-Logs (Cloudflare-Standard-Logs 30 Tage), Bot-Schutz-Token (Cloudflare Turnstile, Token-basiert, ohne Cookies), Error-Events (Sentry, ohne PII).

### 3.8 Erfuellung gesetzlicher Pflichten

- **Zwecke:** Rechnungs-Aufbewahrung, Buchhaltungsbelege, Auskunfts- und Aufbewahrungspflichten gegenueber Behoerden.
- **Rechtsgrundlage:** Art. 6 Abs. 1 lit. c DSGVO (rechtliche Verpflichtung).
- **Daten:** Buchhaltungs- und Rechnungsdaten gemaess § 132 BAO und UGB § 212 (7 Jahre).

## 4. Datenkategorien im Ueberblick

Wir verarbeiten folgende Datenkategorien:

| Kategorie | Beispiele | Verarbeitungszweck (Verweis) |
|---|---|---|
| Plattform-Stammdaten | Firmenwortlaut, Anschrift, Rechtsform, FN, UID, GISA | 3.1, 3.3, 3.8 |
| Kontaktdaten | E-Mail, Telefon, Inhaber-Name | 3.1, 3.2, 3.5 |
| Zahlungs-Metadaten | Stripe-Kunden-ID, Rechnungsnummer, Betrag | 3.3, 3.8 |
| Trial-Daten | Test-Start, Test-Ende, Aktivierungsstatus | 3.2 |
| Newsletter-Daten | E-Mail, Opt-in-Beweis, Abmelde-Datum | 3.5 |
| Portal-Aktivitaets-Logs | Aufgerufene Funktion, Zeitstempel, IP | 3.6, 3.7 |
| Outreach-Lead-Daten | Firmenname, oeffentliche E-Mail, Branche | 3.4 |
| Technische Logs | IP, User-Agent, Referrer (aggregiert) | 3.6, 3.7 |

**Besondere Datenkategorien (Art. 9 DSGVO)** werden auf der Plattform nicht verarbeitet. Falls Sie als Kunde Heilberufsdaten verarbeiten, erfolgt dies ausserhalb unserer Plattform — die generierte Website ist nicht fuer die Verarbeitung von Gesundheitsdaten oder Mandantendaten konzipiert (siehe AGB § 6 Abs. 4).

## 5. Empfaenger und Subprozessoren

Zur Erbringung unserer Leistungen setzen wir folgende Auftragsverarbeiter und Subprozessoren ein. Mit allen ist ein Auftragsverarbeitungsvertrag (AVV) bzw. Data Processing Agreement (DPA) abgeschlossen.

| Anbieter | Funktion | Sitz | Drittland-Bezug |
|---|---|---|---|
| Cloudflare | DNS, CDN, Hosting (Pages), Speicherung (R2), Custom Hostnames, Web Analytics | USA mit EU-Servern | ja (EU-U.S. DPF) |
| Supabase | Datenbank, Storage, Authentifizierung | Frankfurt (EU) | nein |
| Stripe | Zahlungsabwicklung | Irland (EU-Hauptsitz) und USA | ja (EU-U.S. DPF) |
| Anthropic | KI-Sprachmodell (Claude) fuer Text-Generierung und Import-Klassifizierung | USA | ja (EU-U.S. DPF) |
| Microsoft 365 | E-Mail-Postfaecher, Office-Tools | EU und USA | ja (EU-U.S. DPF) |
| Resend | Transaktionale E-Mails (Welcome, Trial-Reminder, Forwarder fuer Kundenseiten) | USA mit EU-Servern | ja (EU-U.S. DPF) |
| PostHog Cloud EU | Product Analytics, Session Replay | EU | nein |
| Sentry | Error-Monitoring | USA | ja (EU-U.S. DPF) |
| Cloudflare Turnstile | Bot-Schutz auf Formularen (token-basiert, ohne Cookies) | USA mit EU-Servern | ja (EU-U.S. DPF) |
| Klaro (Open Source, self-hosted) | Cookie-Banner-Logik fuer instantpage.at | self-hosted auf Cloudflare | nein |
| easyname.at | Domain-Registrierung | Oesterreich | nein |
| Google Places API | Business-Daten-Import bei Onboarding | USA | ja (EU-U.S. DPF) |
| Unsplash | Stockfotos via API | USA | ja (EU-U.S. DPF) |
| remove.bg | Logo-Freistellung (Bildverarbeitung) | Deutschland | nein |

Eine immer aktuelle Subprozessoren-Liste finden Sie auf [instantpage.at/subprozessoren](https://instantpage.at/subprozessoren). Bei Beauftragung neuer Subprozessoren werden Sie informiert und haben binnen 30 Tagen Widerspruchsrecht (siehe AVV-Anhang III).

## 6. Drittlandsuebermittlung

Einige Subprozessoren haben ihren Sitz in den USA oder verarbeiten Daten auch in den USA. Diese Uebermittlungen erfolgen auf Grundlage des EU-U.S. Data Privacy Framework (DPF, Angemessenheitsbeschluss der Europaeischen Kommission vom 10. Juli 2023, Beschluss (EU) 2023/1795). Alle eingesetzten US-Anbieter sind nach dem DPF zertifiziert.

Wir pruefen quartalsweise den Zertifizierungs-Status der eingesetzten US-Anbieter und ueberwachen Aenderungen am Angemessenheitsbeschluss (Schrems-III-Risiko-Monitoring).

## 7. Speicherdauer

Wir speichern Ihre Daten nur so lange, wie es fuer die jeweiligen Zwecke erforderlich ist und keine gesetzlichen Aufbewahrungspflichten entgegenstehen:

| Datenkategorie | Speicherdauer | Quelle |
|---|---|---|
| Plattform-Stammdaten (Firmenwortlaut, FN, UID etc.) | Vertragsdauer + 7 Jahre | UGB § 212 (Geschaeftsbriefe) |
| Zahlungs-Metadaten (Stripe-Belege, Rechnungen) | 7 Jahre nach Vertragsende | UGB § 212, BAO § 132 |
| Login- und Auth-Sessions | bis Logout + 30 Tage Refresh-Token | technische Notwendigkeit |
| Portal-Activity-Logs | 12 Monate, danach Anonymisierung | berechtigtes Interesse, Schutz vor Missbrauch |
| Error-Logs (Sentry) | 90 Tage | technische Notwendigkeit |
| Cloudflare-Webserver-Logs | 30 Tage | Cloudflare-Standard |
| Cloudflare Web Analytics (instantpage.at) | 30 Tage, aggregiert, kein PII | Cloudflare-Standard |
| Newsletter-Anmeldung | bis Abmeldung + 3 Jahre | UWG-Verjaehrung Belaestigungsklage AT |
| Outreach-Lead-Daten | 12 Monate nach Erstkontakt | berechtigtes Interesse, danach Loeschung |
| Support-Mails | 12 Monate, bei Geschaeftsvorfall 7 Jahre | UGB § 212 |
| Beta-Feedback-Daten (sofern noch vorhanden) | bis Beta-Ende, danach Loeschung | siehe Beta-Migration |
| Datenbank-Backups (Supabase Standard) | 7 Tage rueckwirkend | Supabase Pro Standard |
| Eigene pg_dump Backups auf R2 | 90 Tage | RPO/RTO-Konzept |

Nach Vertragsende werden Plattform-Daten und die zugehoerige Website fuer insgesamt 90 Tage in einem Grace-Status aufbewahrt (30 Tage Reaktivierung + 60 Tage Soft-Delete). Danach werden personenbezogene Daten endgueltig geloescht, soweit keine gesetzlichen Aufbewahrungspflichten entgegenstehen.

## 8. Ihre Rechte (Betroffenenrechte)

Sie haben das Recht:

- **Auskunft** ueber die Sie betreffenden personenbezogenen Daten zu erhalten (Art. 15 DSGVO).
- **Berichtigung** unrichtiger oder unvollstaendiger Daten zu verlangen (Art. 16 DSGVO).
- **Loeschung** Ihrer Daten zu verlangen, sofern keine gesetzlichen Aufbewahrungspflichten oder ueberwiegenden berechtigten Interessen entgegenstehen (Art. 17 DSGVO).
- **Einschraenkung** der Verarbeitung zu verlangen (Art. 18 DSGVO).
- **Datenuebertragbarkeit** in einem strukturierten, gaengigen Format (Art. 20 DSGVO) — fuer Plattform-Stammdaten und von Ihnen eingestellte Inhalte direkt ueber den Self-Service-Datenexport im Portal.
- **Widerspruch** gegen Verarbeitungen, die auf berechtigtem Interesse beruhen (Art. 21 DSGVO) — insbesondere gegen Direktansprache (Cold Outreach).
- **Widerruf** erteilter Einwilligungen mit Wirkung fuer die Zukunft (Art. 7 Abs. 3 DSGVO).
- **Beschwerde** bei der Aufsichtsbehoerde einzureichen. In Oesterreich: **Oesterreichische Datenschutzbehoerde**, Barichgasse 40-42, 1030 Wien, dsb@dsb.gv.at.

**Anfragen richten Sie bitte an datenschutz@instantpage.at.** Wir beantworten Anfragen innerhalb eines Monats nach Eingang (Art. 12 Abs. 3 DSGVO). Zur Identifikation kann ein Identitaetsnachweis erforderlich sein.

## 9. Cookies und vergleichbare Technologien

### 9.1 Plattform instantpage.at

Wir setzen auf der Plattform-Website folgende Cookies und Technologien ein:

**Funktional notwendige Cookies (ohne Einwilligungspflicht gemaess § 165 Abs. 3 TKG):**
- **Auth-Session-Cookie** — speichert Ihren Login-Status (Supabase Auth, Session-Token).
- **Refresh-Token-Cookie** — automatische Verlaengerung der Session (30 Tage).
- **CSRF-Token** — Schutz vor Cross-Site-Request-Forgery-Angriffen.

**Tracking-Cookies (mit Einwilligung ueber Cookie-Banner):**
- **PostHog Session Replay** — Session-Aufzeichnungen zur UX-Verbesserung, IP-Anonymisierung aktiv.
- **Meta-Pixel / Google-Ads-Pixel** (sofern Paid-Acquisition aktiviert ist) — Conversion-Tracking. Diese Pixel werden nur nach Ihrer aktiven Einwilligung im Cookie-Banner geladen.

Das Cookie-Banner laeuft auf Basis der Open-Source-Loesung Klaro, self-hosted auf Cloudflare. Es werden keine Banner-Daten an Drittanbieter uebermittelt. Ihre Einwilligungs- und Ablehnungs-Entscheidungen koennen Sie jederzeit ueber den Footer-Link „Cookie-Einstellungen" aendern.

**Cloudflare Web Analytics** ist Cookie-frei und arbeitet ohne PII auf aggregierter Ebene — kein Banner-Trigger.

### 9.2 Kundenseiten (`*.instantpage.at` Subdomains)

Auf den von unseren Kunden betriebenen Websites unter `*.instantpage.at` werden **keine Tracking-Cookies** eingesetzt. Es laeufen ausschliesslich funktional notwendige Mechanismen (Cloudflare Turnstile als Bot-Schutz auf Formularen, token-basiert ohne Cookies). Kundenseiten sind damit banner-frei.

Verantwortlicher fuer die Datenverarbeitung auf einer Kundenseite ist der jeweilige Kunde (siehe AGB § 8). Fuer die Datenverarbeitung in Kontakt- und Reservierungsformularen gilt die Datenschutzerklaerung der jeweiligen Kunden-Website.

## 10. KI-Verarbeitung und automatisierte Entscheidungen

### 10.1 Einsatz von KI bei der Text-Generierung

Bei der Erstellung Ihrer Website werden Texte (Ueber-uns-Beschreibung, Leistungs-Texte, Hero-Section, FAQ) unter Einsatz des KI-Sprachmodells Claude (Anbieter: **Anthropic PBC, San Francisco, USA**) generiert. Diese Verarbeitung umfasst:

- die von Ihnen im Fragebogen eingegebenen Stammdaten und Beschreibungen (Firmenwortlaut, Branche, Schwerpunkte etc.),
- ggf. importierte Inhalte einer von Ihnen angegebenen bestehenden Website,
- branchen-spezifische Konfigurations-Hinweise unsererseits (z.B. defensive Formulierungs-Regeln bei reglementierten Berufen — siehe AGB § 5 Abs. 4).

Die Verarbeitung erfolgt ueber die kommerzielle API von Anthropic. Anthropic verarbeitet API-Inputs **nicht** zum Modell-Training und speichert sie gemaess kommerziellen Vertragsbedingungen nur fuer den Verarbeitungs-Zeitraum (Standard 30 Tage Operational Logs, danach Loeschung).

**Drittland:** Anthropic verarbeitet Daten in den USA. Uebermittlung erfolgt auf Grundlage EU-U.S. Data Privacy Framework (siehe Abschnitt 6).

**Rechtsgrundlage:** Art. 6 Abs. 1 lit. b DSGVO (Vertragserfuellung — Text-Generierung ist Kern-Leistung der Plattform).

### 10.2 Aktive Freigabe vor Veroeffentlichung

Die generierten Inhalte werden Ihnen vor der Veroeffentlichung im Portal zur Pruefung angezeigt. Eine Veroeffentlichung erfolgt erst nach **aktiver Bestaetigung durch Sie** ueber einen Freigabe-Klick (AGB § 5 Abs. 5). Sie tragen damit die letzte inhaltliche Verantwortung fuer die veroeffentlichten Texte.

### 10.3 Keine automatisierte Entscheidung im Sinne Art. 22 DSGVO

Es findet **keine automatisierte Entscheidung** mit rechtlicher Wirkung oder vergleichbar erheblicher Beeintraechtigung statt. Die KI-gestuetzte Text-Generierung ist eine inhaltliche Hilfestellung, keine Entscheidung ueber Sie. Es findet **kein Profiling** im Sinne von Art. 4 Z 4 DSGVO statt.

### 10.4 AI Act 2026 — Kennzeichnungspflicht

Ab 02.08.2026 (Inkrafttreten Art. 50 EU-AI-Act) wird auf Ihrer generierten Website ein Hinweis ergaenzt, dass Texte unter Einsatz von KI-Systemen automatisch erstellt wurden. Dieser Hinweis erscheint im Footer Ihrer Website.

## 11. Sicherheit der Verarbeitung

Wir setzen technische und organisatorische Massnahmen gemaess Art. 32 DSGVO ein, insbesondere:

- TLS-Verschluesselung auf allen Verbindungen (HTTPS)
- Verschluesselte Speicherung von Passwoertern (Argon2 via Supabase Auth)
- Datenbank-Verschluesselung at-rest (Supabase Pro)
- Backup-Verfahren mit RPO/RTO gestuft nach Plan-Klasse
- Zugriffsbeschraenkungen nach Need-to-Know
- Audit-Logging fuer administrative Aktionen
- Quartalsweise interne Sicherheits-Reviews

Eine vollstaendige Beschreibung der technisch-organisatorischen Massnahmen ist in AVV-Anhang II hinterlegt.

## 12. Aenderungen dieser Datenschutzerklaerung

Diese Datenschutzerklaerung wird bei aenderungen der Verarbeitungstaetigkeiten, neuen Subprozessoren oder rechtlichen Anpassungen aktualisiert. Die jeweils aktuelle Version ist unter [instantpage.at/datenschutz](https://instantpage.at/datenschutz) abrufbar; das Datum der letzten Aktualisierung steht am Anfang dieser Erklaerung.

Wesentliche aenderungen (insbesondere neue Verarbeitungszwecke oder Drittland-Konstellationen) teilen wir Ihnen aktiv per E-Mail mit.

---

## Aenderungs-Log

| Datum | aenderung | Autor |
|---|---|---|
| 2026-05-16 | Erstdraft als Eigenarbeit nach Compliance-Pivot 2026-05-15 | Eigenarbeit |

## Selbstcheck-Liste vor Live-Schaltung

- [ ] Stammdaten-Platzhalter ([Geschaeftsanschrift], [ATU...], [Telefonnummer], [DATUM_LIVE]) ersetzt
- [ ] Subprozessoren-Liste mit DPA-Sign-off-Datum aktualisiert (`LIVE-COMPLIANCE.md` § 4)
- [ ] Plausibilitaets-Check ueber RechtGPT (insbesondere KI-Abschnitt 10 und Outreach-Abschnitt 3.4)
- [ ] Konsistenz mit AVV (Anhang IV Datenkategorien), AGB (§ 13 Datenschutz, § 5/6 KI-Klauseln), Impressum (Stammdaten)
- [ ] Datum „Letzte Aktualisierung" auf Live-Datum gesetzt
- [ ] URL `instantpage.at/subprozessoren` ist auch live ausgespielt (statische Seite mit aktueller Liste)
- [ ] URL `instantpage.at/datenschutz` ist im Footer der Plattform-Site verlinkt
- [ ] Cookie-Banner-Setup (Klaro) deckt die in Abschnitt 9.1 genannten Cookies ab
- [ ] Datenschutz-Mailbox `datenschutz@instantpage.at` ist eingerichtet und ueberwacht
- [ ] Opt-out-Mailbox `opt-out@instantpage.at` ist eingerichtet und triggert Suppression-Liste

## Anwalts-Audit-Trigger (spaeter, gemaess `LIVE-COMPLIANCE.md` § 18)

Diese Sektionen sind im Pivot 2026-05-15 als Eigenarbeit ausgefuehrt; bei einem der folgenden Trigger an einen IT-Anwalt zur formalen Pruefung uebergeben:

- 30+ zahlende Kunden erreicht
- erste Abmahnung oder Aufsichtsbehoerden-Anfrage
- AI-Act-Stichtag 2026-08-02 (Abschnitt 10.4 kann dann anpassungsbeduerftig sein)
- aenderung der Subprozessoren-Liste mit Drittland-Folgen (z.B. Schrems-III-Urteil)
- Aufnahme neuer Verarbeitungs-Zwecke (z.B. eigene Portal-Inbox fuer Form-Submissions)
