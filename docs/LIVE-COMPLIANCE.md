# Live-Compliance — instantpage.at

> **Living Document.** Sammelt alle rechts- und compliance-relevanten Themen für den Übergang Prototyp → Live-Produkt. Nicht alle Punkte müssen sofort entschieden werden — offene Stellen sind als `[OFFEN]` markiert.

**Stand:** 2026-05-04
**Markt:** AT-only (Phase 1)
**Brand:** instantpage.at (Brand) — Wagner IT-Solutions e.U. (Rechtsträger, FN 609574h)
**Strategie:** siehe „Compliance-Strategie" unten
**Verbindung zu Memory:** ergänzt `project_production_refactor.md` + `project_recipe_system_v1.md` + `project_unternehmensdaten.md`. Diese Datei ist Quelle der Wahrheit für Rechtstexte und Compliance-Prozesse.

---

## Compliance-Strategie (Tier-Modell)

7-Schichten-Strategie damit das Live-Produkt rechtlich tragfaehig ist und bleibt. Jede Schicht hat eine Funktion — keine ersetzt eine andere.

| Tier | Was | Kosten | Funktion | Status |
|---|---|---|---|---|
| **1 — Anwalts-Foundation** (Pflicht Live-Day-1) | Anwalt einmalig fuer AGB/AVV/DSE/Impressum-Generator-Setup. Nicht selbst texten — Abmahnrisiko zu hoch. | €800–2.000 einmalig | Rechtsgrundlage haltbar — ohne das ist alles andere Sandburg | `[WARTET auf Beauftragung]` — Termin vor Stripe-Live planen, Briefing-Doku als Block A der Roadmap |
| **1.5 — RechtGPT Bau-Recherche** (Bau-Phase, optional) | KI-Rechtsrecherche auf RIS/Findok/EUR-Lex (rechtgpt.at, Starter-Plan). Nur waehrend Bau-Phase. Workflow: Claude sammelt Recherche-Anfragen in [`docs/_archive/rechtgpt-queries.md`](_archive/rechtgpt-queries.md), User paste in RechtGPT Web-UI, Antworten zurueck in `rechtgpt-answers.md`. Nach Bau kuendigen. **Nicht via API** (Enterprise ab 5 Lizenzen, Solo nicht tragbar). | ~€30 einmalig (1 Monat Starter) | Drafts mit AT-Quellenangaben unterlegen → Anwalts-Review (Tier 1) wird kuerzer + billiger | `[GEPLANT]` Phase B |
| **2 — Externe Spezialtools** | **Cookiebot** (~9 €/Mo) ODER **Klaro** (Open Source, €0) fuer Cookie-Consent. **Stripe** fuer PCI-DSS. **Resend** mit SPF/DKIM/DMARC fuer Mail-Reputation. **Cloudflare Turnstile** fuer Bot-Schutz statt reCAPTCHA. | €0–9/Mo | gelöste Spezialprobleme nicht selbst lösen | `[ENTSCHIEDEN]` Klaro fuer Plattform, Turnstile fuer Kundenseiten |
| **3 — Saubere Architektur** (Single-Source-of-Truth) | `config/legal-values.ts` als zentrale Quelle fuer rechtsrelevante Werte (TRIAL_DAYS, REACTIVATION_DAYS, CANCELLATION-Frist, etc.). AGB/DSE/Mail-Templates rendern via Variablen daraus. Code importiert aus Config. ESLint-Rule blockt Magic Numbers in legal-Kontext. | 0 (Eigenarbeit Live-Bau) | Drift verhindern by design — eine Aenderung propagiert automatisch | `[GEPLANT]` Phase 0 Live-Bau |
| **4 — `compliance-reviewer` Subagent** | Watchdog in jeder Dev-Session. Triggert automatisch bei Aenderungen an: Templates, legal.js, package.json (neue Deps), API-Calls zu externen Services, UI-Texten, DB-Schema, AGB/AVV/Mail-Templates. Cross-Reference-Check zwischen Code/Doku/Templates. Pattern-Detection fuer verbotene Begriffe und Magic Numbers. Cascade-Warnung. | 0 (~30 Min Setup) | catches dev-mistakes vor Commit, erinnert an Sync-Arbeit | `[GEPLANT]` Spec in `project_dev_subagents_idea.md`, Setup im Live-Bau |
| **5 — CHANGELOG mit `[LEGAL]`-Tag** | Major Compliance-Aenderungen markiert (Pricing, Trial-Dauer, Speicherdauer, neuer Provider, neue PII-Felder, Wording-Aenderungen in AGB). Format: `[LEGAL] TRIAL_DAYS 7→14 + AGB §3.2 + DSE §4 angepasst`. | 0 | Audit-Trail fuer Anwalts-Review + Beweismittel bei Streitfall | `[GEPLANT]` Live-Bau |
| **6 — Anwalts-Review jaehrlich** | 1× pro Jahr Anwalt drueberschauen — neue Gesetze (DSA-Updates, ePrivacy-Reform, Schrems-Folgen), neue Features, Aenderungen am Geschaeftsmodell. Compliance-Snapshot uebermitteln (CHANGELOG-Auszug). | €500–800/Jahr | Schutz gegen Gesetzes-Drift — Subagent kann das nicht | `[GEPLANT]` ab Live-Jahr 1 |
| **7 — Versicherung** | Phase 1: Berufshaftpflicht R+V (UBIT-Rahmenvertrag) `[ENTSCHIEDEN 2026-05-06]` — **173 €/Jahr**. Phase 2: Cyber + Rechtsschutz vertagt auf Trigger ≥50 Kunden / ≥30k ARR / Beinahe-Vorfall (siehe § 3.5) | 173 €/Jahr (Phase 1), Phase 2 später | finanzieller Backstop für Beratungs-/Software-Fehler. Cyber kommt mit Skalierung. | `[ENTSCHIEDEN, gestuft]` |

**Optional bei Skalierung (>500 Kunden):**
- Vanta/Drata fuer Soc2/ISO27001-Audit-Software (~€500–2.000/Mo) — fuer KMU-Bootstrapper aktuell Overkill
- iubenda/eRecht24 fuer Auto-Generated DSE (~€10–30/Mo) — Alternative zu Anwalts-Generator falls jaehrlicher Anwalt zu teuer wird
- Pen-Test (~€2–5k) — bei sensitiven Branchen (Heilberufe-Skalierung) relevant

**Kernprinzip:** Tier 1 + 6 (Anwalt) ist die echte Sicherheit. Tier 3 + 4 (Architektur + Subagent) verhindert Drift im Alltag. Tier 2 (Tools) loest Spezialprobleme. Tier 5 (CHANGELOG) ist die Bruecke zwischen Daily-Dev und Anwalts-Review. Tier 7 (Versicherung) ist der finanzielle Backstop.

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
| 1 | B2B oder B2C? | B2B-only / B2C zusätzlich | **B2B-only mit Unternehmer-Selbsterklaerung im Bestellformular** ("Ich bestelle als Unternehmer im Rahmen meiner gewerblichen Taetigkeit"). Pflichtfelder: Firmenname + Anschrift. **UID optional** (Kleinunternehmer/Soloselbstaendige/Vereine ohne UID nicht ausschliessen) | `[ENTSCHIEDEN]` 2026-05-04 (revidiert) |
| 2 | Markt | AT-only / DACH / EU | AT-only Phase 1 | `[ENTSCHIEDEN]` |
| 3 | Heilberufe (Ärzte etc.) in Phase 1? | ja mit Sonderbehandlung / nein / nur ausgewählte | **ja mit Sonderbehandlung** | `[ENTSCHIEDEN]` 2026-05-04 |
| 4 | Rechtsberatung (Anwälte, Notare, StB) in Phase 1? | ja mit Sonderbehandlung / nein | **ja mit Sonderbehandlung** | `[ENTSCHIEDEN]` 2026-05-04 |
| 5 | Trial-Setup | nur Vorschau ohne Live-Schaltung / Live-Schaltung erlaubt / kein Trial | **Live-Schaltung erlaubt** (Wow-Moment ist Verkaufsargument) | `[ENTSCHIEDEN]` |
| 6 | Trial-Dauer | 7 / 14 / 30 Tage | **7 Tage** (wie Prototyp) | `[ENTSCHIEDEN]` |
| 7 | Mindestvertragslaufzeit | keine / monatlich / jährlich | **Monatsabo monatlich kündbar / Jahresabo 12 Monate** | `[ENTSCHIEDEN]` |
| 8 | Kündigungsfrist | sofort / Monatsende / 30 Tage | **Monatsende** | `[ENTSCHIEDEN]` 2026-05-04 |
| 9 | Datenretention nach Kündigung | 30 / 60 / 90 Tage Grace, dann Auto-Delete | **30 Tage Reaktivierung + 60 Tage Soft-Delete + danach Hard-Delete** (90 Tage total) | `[ENTSCHIEDEN]` |
| 10 | Haftungsbegrenzung | 12-Monats-Vergütung / fixer Cap (z.B. €5.000) / pro Schadensfall | **12-Monats-Vergütung** | `[ENTSCHIEDEN]` 2026-05-04 |
| 11 | Refund-Policy | 14 Tage Widerruf trotz B2B / pro-rata bei Mid-Period / kein Refund | **Kein Refund nach 7-Tage-Trial** — Trial schuetzt vor Blind-Kauf, danach Vertrag bindend (B2B-Standard wie Wix/Squarespace/Notion). Monatsabo: jederzeit zum Monatsende kuendbar, kein Refund fuer angefangenen Monat. Jahresabo: laeuft 12 Monate durch, kein vorzeitiger Refund. AGB-Wording: *"Nach Ablauf der 7-tägigen kostenlosen Testphase und Erteilung des Bezahlauftrags ist der Vertrag bindend. Ein Widerrufsrecht nach FAGG besteht für Unternehmer nicht."* | `[ENTSCHIEDEN]` 2026-05-04 |
| 12 | Custom-Domain-Verantwortung | DNS allein Kunde / DNS-Setup-Hilfe inkludiert | **DNS allein Kunde** + ausfuehrliche Anleitung (Doku + Video) im Portal. Spaeter optional: Einrichtungsservice als Addon buchbar | `[ENTSCHIEDEN]` 2026-05-04 |
| 13 | Mailing-Provider | Resend / Postmark / Brevo | **Resend** (günstig + EU-Server) | `[ENTSCHIEDEN]` 2026-05-04 |
| 14 | Error-Monitoring | Sentry / Axiom / nichts | **Beta: nur Cloudflare Workers Logs** (kostenlos, schon da). **Live: Sentry-Free-Tier** (5k Events/Monat, EU-Server). Sentry ist Production-grade seit 2012, kein Beta-Tool. | `[ENTSCHIEDEN]` 2026-05-04 |
| 15 | Analytics-Provider Plattform | Cloudflare Web Analytics / Plausible EU / PostHog Cloud EU / nichts | **Cloudflare Web Analytics** (kostenlos, cookielos, kein Banner noetig, schon im Stack). PostHog optional spaeter wenn Conversion-Funnels gebraucht. | `[ENTSCHIEDEN]` 2026-05-04 |
| 15a | Analytics-Provider Kundenseiten | Cloudflare / Plausible / Self-hosted | **Cloudflare Web Analytics** auch fuer Kundenseiten (kostenlos egal wieviele Sites, pro Hostname trennbar). **Kunden-Dashboard im Portal Pflicht** ("Statistiken"-Tab pro Kundensite via CF Analytics API: Pageviews, Top-Quellen, Top-Pages, Devices). | `[ENTSCHIEDEN]` 2026-05-04 |
| 15b | Cookie-Banner Plattform instantpage.at | benoetigt / vermeidbar | **Banner JA** — Plattform akzeptiert Cookies, weil Marketing-Pixel (Meta + Google Ads) + PostHog (Funnel-Tracking, Session-Replay) eingesetzt werden. Tool: **Cookiebot** (ab ~9 €/Monat, Auto-Scan + Compliance-Reports + Marktfuehrer-Vertrauen). Maps Standard-iframe auf Kontakt-Seite ok. | `[ENTSCHIEDEN]` 2026-05-04 |
| 15c | Cookie-Banner Kundenseiten | mit Banner / banner-frei als USP | **Banner-frei als USP** — *"Ihre Website ohne nervigen Cookie-Banner, DSGVO-konform aus dem Stand"* als Verkaufsargument vs. Wix/Jimdo. Konkret: Maps via **Two-Click-Loesung** ("Karte laden"), YouTube via **youtube-nocookie.com**, Cloudflare Analytics (cookielos). Tracking-Pixel fuer Kunden spaeter optional als **Pro-Addon** ("Erweiterte Tracking-Integration"). | `[ENTSCHIEDEN]` 2026-05-04 |
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
| Vollständiger Firmenwortlaut (laut Firmenbuch) | **Wagner IT-Solutions e.U.** | `[FIXIERT]` 2026-05-04 |
| Inhaber (natuerliche Person) | Alexander Wagner, geb. 26.07.2002 | `[FIXIERT]` 2026-05-04 |
| Firmenbuchnummer | **FN 609574h** | `[FIXIERT]` 2026-05-04 |
| Firmenbuchgericht | **HG Wien** | `[FIXIERT]` 2026-05-04 |
| Firmenbuch-Eintragungsdatum | 03.08.2023 (e.U.) | `[FIXIERT]` 2026-05-04 |
| Gewerbeberechtigung — Entstehung | 07.12.2021 (frueher als FB-Eintragung — relevant fuer Gruender-Bonus-Eligibility) | `[FIXIERT]` 2026-05-04 |
| Rechtsform | Einzelunternehmer | `[FIXIERT]` 2026-05-04 |
| UID-Nummer | **Keine** — Kleinunternehmerregelung (§ 6 Abs 1 Z 27 UStG, Umsatzgrenze 2026 = 55.000 €). Im Impressum/auf Rechnungen entsprechender Hinweis: *„Kleinunternehmer im Sinne des § 6 Abs 1 Z 27 UStG, daher keine USt ausgewiesen."* | `[FIXIERT]` 2026-05-04 |
| Steuernummer (intern) | 12 731/8368 (Finanzamt Wien) — nicht im Impressum noetig | `[FIXIERT]` 2026-05-04 |
| GISA-Zahl | **34399071** (Behoerde: Magistrat der Stadt Wien) | `[FIXIERT]` 2026-05-04 |
| GLN (GISA) | 9110033875474 | `[FIXIERT]` 2026-05-04 |
| GLN (Bank/GS1) | 9110031531662 | `[FIXIERT]` 2026-05-04 — abweichend zur GISA-GLN, beide valide |
| Geschäftsanschrift (Straße, PLZ, Ort) | **Adelheid-Popp-Gasse 14/1/36, 1220 Wien, Österreich** | `[FIXIERT]` 2026-05-04 |
| Bundesland | **Wien** | `[FIXIERT]` 2026-05-04 |
| Gewerbewortlaut (exakte Bezeichnung) | **Dienstleistungen in der automatischen Datenverarbeitung und Informationstechnik** (freies Gewerbe) | `[FIXIERT]` 2026-05-04 |
| Geschäftszweig (Firmenbuch) | IT Dienstleister, IT Beratung | `[FIXIERT]` 2026-05-04 |
| Aufsichtsbehörde nach GewO | **Magistrat der Stadt Wien** (laut GISA-Auszug, zentrale Gewerbebehoerde Wien) | `[FIXIERT]` 2026-05-04 |
| WKO-Fachgruppe | Vermutlich **Fachgruppe Unternehmensberatung, Buchhaltung und Informationstechnologie (UBIT) Wien** — passt zum UBIT-Versicherungs-Rahmenvertrag | `[VERMUTET]` — User kann sich aktuell nicht im WKO-Login anmelden, final via WKO-Mitgliedsbeitrags-Vorschreibung oder direkter WKO-Anfrage verifizieren |
| Rechtsvorschriften (Verweis im Impressum) | www.ris.bka.gv.at — GewO 1994, ECG, MedienG | `[FIXIERT]` 2026-05-04 |
| Bankverbindung (IBAN) | **AT88 2011 1843 5211 6200**, BIC **GIBAATWWXXX**, Erste Bank | `[FIXIERT]` 2026-05-04 |
| Telefon (geschäftlich) | **+43 676 5040088** | `[FIXIERT]` 2026-05-04 |
| Mail (User/Inhaber) | alexander@wagner-its.com | `[FIXIERT]` 2026-05-04 |
| Kontakt-Mail allgemein | **info@instantpage.at** | `[FIXIERT]` 2026-05-04 |
| Kontakt-Mail Rechnung | **rechnung@instantpage.at** | `[FIXIERT]` 2026-05-04 |
| Kontakt-Mail Newsletter | **news@instantpage.at** | `[FIXIERT]` 2026-05-04 |
| Kontakt-Mail Support | **support@instantpage.at** | `[FIXIERT]` 2026-05-04 |
| Kontakt-Mail Datenschutz | **datenschutz@instantpage.at** | `[FIXIERT]` 2026-05-04 |
| Kontakt-Mail Abuse | **abuse@instantpage.at** | `[FIXIERT]` 2026-05-04 |

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

Eigenständiger Rahmenvertrag, separat zu beantragen. **Tarif noch nicht eingeholt** `[VERTAGT 2026-05-06]` — siehe § 3.5 oben (Re-Evaluation bei Trigger ≥ 50 Live-Kunden / ≥ 30k ARR / Beinahe-Vorfall). Inkludiert laut WKO-Beschreibung:

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
| Aon-Beratungstermin durchgeführt (2026-05-06) | `[ERLEDIGT]` |
| **Berufshaftpflicht R+V abschließen — 173 €/Jahr** | `[ENTSCHIEDEN, geht in Abschluss]` |
| Cyber-Versicherung | `[VERTAGT]` — siehe § 3.5 unten |
| Berufsrechtsschutz | `[VERTAGT]` — siehe § 3.5 unten |
| Voraussetzungen für Berufshaftpflicht erfüllen + dokumentieren | `[GRÖSSTENTEILS GEDECKT 2026-05-06]` — 2FA: `ARCHITECTURE.md` § 10 · Backups: `OPERATIONS.md` § 6 · Datenpannen-Meldeprozess: § 12.2 hier · Verarbeitungsverzeichnis Art 30 + AGB + AVV: warten auf Anwalts-Beauftragung (Block A) |

### 3.5 Versicherungs-Strategie gestuft

**Phase 1 — Beta + erste Live-Kunden (jetzt):**
- ✅ Berufshaftpflicht R+V via UBIT-Rahmenvertrag — **173 €/Jahr** (Solo-e.U. < 350k Umsatz)
- Versicherungssumme: 2,5 Mio. € (laut Tarifblatt)
- Deckt: Vermögensschäden bei Kunden durch Beratungs-/Software-Fehler

**Phase 2 — Re-Evaluation-Trigger für Cyber + Rechtsschutz:**

Die teureren Bausteine (Cyber, Rechtsschutz) werden NICHT sofort abgeschlossen. **Re-Evaluation bei Erreichen eines der folgenden Trigger-Punkte:**

| Trigger | Schwellwert | Begründung |
|---|---|---|
| Aktive Live-Kunden | **≥ 50** | Ab dieser Größe gibt's genug PII-Verarbeitung in der DB, dass Cyber sich rechnet |
| Jahresumsatz (ARR) | **≥ 30.000 €** | Versicherung ~5–10% des ARR ist normaler KMU-Schwellwert |
| Erster Beinahe-Vorfall | beim Eintreten | Phishing-Versuch, kompromittierter Login, DDoS-Welle, Datenpanne (auch ohne meldepflichtige Folgen) |
| Erste rechtliche Streitigkeit | beim Eintreten | Mahnschreiben, Notice-and-Takedown-Eskalation, Marken-/Urheberrechts-Drohbrief |
| Vertraglicher Druck | beim Eintreten | Größerer Kunde fordert Versicherungsnachweis im Onboarding (typisch ab Mittelstand-Kunden) |

**Re-Evaluation-Pfad:** Bei jedem vierteljährlichen Self-Check (siehe OPERATIONS.md § 7) prüfen ob Trigger erreicht. Wenn ja → erneut Aon kontaktieren (Martin Zainzinger, +43 5 7800-528) und Cyber-Tarifblatt anfordern.

**Risiko-Hinweis Phase 1:** Ohne Cyber-Versicherung trägt der Inhaber DSGVO-Bußgelder + Drittschäden bei Datenpanne **persönlich**. Mitigation in dieser Phase: kleine Kundenzahl, minimaler PII-Umfang, robuste Backup-Strategie (siehe OPERATIONS.md § 6), Notice-and-Takedown-Prozess (siehe LIVE-COMPLIANCE § 12.1).

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
| Klaro (Cookie-Consent Plattform) | Cookie-Banner-Logik fuer instantpage.at, Self-Hosted, keine Daten an Drittanbieter | (selbst gehostet auf Cloudflare) | Open Source — kein DPA noetig (keine Datenuebermittlung an KIPROTECT). Lizenz/Quelle: <https://klaro.org> | `[OK]` keine externe Datenuebermittlung |
| Cloudflare Turnstile (Bot-Schutz Kontaktformulare Kundenseiten) | Bot-Verifikation ohne Cookies, Token-basiert | USA (mit EU-Servern) | gedeckt durch Cloudflare Customer DPA (s.o.) | `[URL]` Teil der Cloudflare-Services |
| Cookiebot (Reserve, falls Klaro-Wartung zu aufwendig wird) | Cookie-Consent Auto-Scan + Compliance-Reports | Daenemark (EU) | <https://www.cookiebot.com/de/data-processing-agreement/> | `[OPTIONAL]` nur falls Klaro abgeloest wird |

**Drittland-Hinweis:** USA-Anbieter laufen aktuell unter EU-U.S. Data Privacy Framework. Status in Quartals-Self-Check prüfen — Schrems-III-Risiko nicht ausgeschlossen.

**Sign-off-Reihenfolge fuer Phase 0:** Cloudflare → Supabase → Stripe → Anthropic → Microsoft. Jeder DPA mit Datum + Account-Beleg im internen `incidents.log` festhalten. Bei Account-Anlegen vor Live-Schaltung mit erfassen.

---

## 5. AGB-Skeleton (B2B-only)

> **Defensiv formuliert. Kombiniert WKO-Vorlagen IT-Betreiberdienstleistungen B2B + IT-Programmierdienstleistungen B2B + IT-Software-Support B2B + 5 Eigenklauseln (Betreiber, KI, Vorlagen, Bildrechte, B2B-Beschränkung). Stammdaten in `[Klammern]` einsetzen.**

### § 1 Geltungsbereich, B2B-Beschränkung

(1) Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Verträge zwischen `[FIRMENWORTLAUT]` (im Folgenden "Anbieter") und dem Kunden über die Nutzung der Plattform instantpage.at und der damit verbundenen Leistungen.

(2) Das Angebot richtet sich ausschließlich an Unternehmer im Sinne des § 1 KSchG. Verbraucherverträge sind ausgeschlossen.

(3) Der Kunde bestätigt mit Vertragsabschluss durch ausdrückliche Selbsterklärung, im Rahmen seiner unternehmerischen Tätigkeit zu handeln, und gibt seinen Firmenwortlaut sowie die Geschäftsanschrift wahrheitsgemäß an. Eine UID-Nummer, GISA-Zahl oder Firmenbuchnummer ist optional anzugeben, sofern vorhanden — eine Verpflichtung zur Angabe besteht insbesondere bei Kleinunternehmern, Soloselbstständigen oder gewerblich tätigen Vereinen ohne UID-Nummer nicht.

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

(1) Die Vergütung richtet sich nach dem vom Kunden gewählten Plan. Preise verstehen sich netto zzgl. gesetzlicher Umsatzsteuer.

(2) Die Vergütung ist im Voraus für den jeweiligen Abrechnungszeitraum fällig (monatlich oder jährlich, je nach Plan).

(3) Die Abwicklung erfolgt über den Zahlungsdienstleister Stripe. Der Kunde stimmt den Zahlungsbedingungen von Stripe gesondert zu.

(4) Bei Zahlungsverzug ist der Anbieter berechtigt, die Leistungserbringung auszusetzen und die betroffene Website nach vorheriger Mahnung zu sperren. Verzugszinsen nach § 456 UGB.

(5) Aktionsrabatte (z. B. Markterprobungs-Rabatt für Neukunden) gelten ausschließlich für den im Bestellzeitpunkt aktiv beworbenen und vertraglich vereinbarten Zeitraum. Nach Ablauf dieses Zeitraums gilt automatisch der reguläre Tarif gemäß Plan, ohne dass es einer gesonderten Kündigung oder Mitteilung bedarf. Der Anbieter behält sich vor, Aktionsrabatte für Neukunden jederzeit einzustellen; Bestandskunden behalten den bei Vertragsabschluss vereinbarten Rabatt für dessen Restlaufzeit.

### § 10 Vertragslaufzeit, Kündigung

(1) Der Vertrag wird auf unbestimmte Zeit geschlossen. Eine Mindestvertragslaufzeit besteht nicht; die Kündigungsmöglichkeiten richten sich nach der gewählten Abrechnungsperiode (Abs. 2).

(2) Bei monatlicher Abrechnung kann der Vertrag mit Wirkung zum Ende des laufenden Abrechnungsmonats gekündigt werden. Bei jährlicher Abrechnung mit Wirkung zum Ende der laufenden Jahresperiode.

(3) Die Kündigung erfolgt in Textform über die Self-Service-Funktion im Portal oder per E-Mail an support@instantpage.at.

(4) Das Recht zur außerordentlichen Kündigung aus wichtigem Grund bleibt unberührt. Wichtige Gründe für den Anbieter sind insbesondere wiederholte Verstöße gegen diese AGB, rechtswidrige Inhalte, Zahlungsverzug nach Mahnung.

### § 11 Datenrückgabe und Löschung bei Vertragsende

(1) Innerhalb der Vertragslaufzeit kann der Kunde seine Daten jederzeit über das Self-Service-Portal exportieren.

(2) Nach Vertragsende werden die Kundendaten und die zugehörige Website für insgesamt 90 Tage in einem Grace-Status aufbewahrt. In den ersten 30 Tagen kann der Kunde den Vertrag wieder aktivieren oder seine Daten exportieren; in den anschließenden 60 Tagen ist nur noch der Datenexport möglich (Soft-Delete).

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

(2) Erfüllungsort und ausschließlicher Gerichtsstand für alle Streitigkeiten aus diesem Vertrag ist der Sitz des Anbieters in Wien.

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
| **Dauer der Verarbeitung** | Für die Vertragslaufzeit zzgl. Grace-Zeitraum (90 Tage: 30 Tage Reaktivierung + 60 Tage Soft-Delete). Logs nach 30 Tagen anonymisiert. |
| **Kategorien betroffener Personen** | Endnutzer der Kunden-Website (Kontaktanfragen, Bewerter, Reservierungen) |
| **Kategorien personenbezogener Daten** | Kontaktdaten (Name, E-Mail, Telefon), Inhalt der Anfrage, IP-Adresse (technisch nötig), bei Reservierungen: Datum/Personenzahl/Anliegen, bei Bewertungen: Name + Bewertungstext |
| **Besondere Datenkategorien** | NICHT umfasst. Bei Heilberufen ist die Eingabe von Gesundheitsdaten in Termin-Anfragen vertraglich ausgeschlossen. Verstöße liegen außerhalb der Auftragsverarbeitung. |

### Anhang II — Technisch-organisatorische Maßnahmen

Siehe [Abschnitt 11 — TOMs](#11-toms--technisch-organisatorische-maßnahmen).

### Anhang III — Subprozessoren

Siehe [Abschnitt 4 — Subprozessoren](#4-subprozessoren).

Aktualisierungen werden auf instantpage.at/subprozessoren öffentlich gemacht. Der Verantwortliche kann der Beauftragung neuer Subprozessoren binnen 30 Tagen widersprechen; bei berechtigtem Widerspruch besteht ein Sonderkündigungsrecht.

### Anhang IV — Datenkategorien-Liste

**Architektur-Hinweis:** Alle Form-Submissions auf Kundenseiten (Kontakt-, Reservierungs-, Termin-Anfragen) laufen als **Pure Forwarder** ueber Resend direkt an die vom Kunden hinterlegte Mailbox. instantpage.at speichert die Inhalte dieser Submissions NICHT in der eigenen DB. Eine Portal-Inbox mit eigener Speicherung ist als Quartal-Update fuer einen spaeteren Release vorgesehen (siehe PRODUCT.md § 9).

#### Endnutzer-Daten (auf Kundenseiten)

| Datenkategorie | Quelle | Verarbeitung | Speicherort | Speicherdauer (instantpage.at) |
|---|---|---|---|---|
| Kontaktanfragen | Endnutzer-Eingabe Kontaktformular | Pure Forwarder via Resend an Kunden-Mailbox | nicht gespeichert | wir speichern nichts — Resend-Mail-Logs ~30 Tage (Subprozessor); Kunde verantwortlich fuer Postfach-Retention |
| Reservierungs-Anfragen | Endnutzer-Eingabe Reservierungsform | wie oben | nicht gespeichert | wie oben |
| Termin-Anfragen | Endnutzer-Eingabe Terminform | wie oben | nicht gespeichert | wie oben |
| Bewertungen | Endnutzer-Eingabe Bewertungsform (oder vom Kunden manuell eingetragen) | Speicherung + oeffentliche Anzeige auf Kundensite | Supabase EU | bis Widerruf durch Endnutzer oder Vertragsende des Kunden + 90 Tage Grace |
| Bilder mit Personenabbildungen | Kunde laedt hoch (Team-Fotos, Mitarbeiter, etc.) | Speicherung + Auslieferung | Supabase Storage + Cloudflare R2 | bis Vertragsende + 90 Tage Grace (siehe PRODUCT.md § 3.2) |
| IP-Adressen (Kundensite-Webserver-Log) | Webserver | Cloudflare-Standard-Logs, nicht ausgewertet | Cloudflare Logs | 30 Tage (Cloudflare-Standard) |
| Bot-Schutz-Token (Turnstile) | Cloudflare Turnstile bei Form-Submit | Token-Validierung, kein Cookie | nicht gespeichert | n/a |

#### Kunden-Daten (Plattform-Konto auf instantpage.at)

| Datenkategorie | Quelle | Verarbeitung | Speicherort | Speicherdauer |
|---|---|---|---|---|
| Plattform-Stammdaten (Firmenwortlaut, Anschrift, Rechtsform, FN, UID) | Bestellprozess + Portal-Eingabe | Vertragsabwicklung + Impressum-Generierung | Supabase EU | Vertragsdauer + **7 Jahre** (UGB § 212 Geschaeftsbriefe) |
| Login-/Auth-Sessions | Supabase Auth | Session-Token, Refresh-Token | Supabase EU | bis Logout + 30 Tage Refresh-Token |
| Stripe-Zahlungsbelege (Token, Rechnungs-IDs) | Stripe-Webhook | Buchhaltung + Rechnungserstellung | Supabase EU + Stripe | **7 Jahre** nach Vertragsende (UGB § 212 + BAO § 132) |
| Plattform-Activity-Logs (wer aenderte was, IP) | Portal-Aktionen | Audit-Trail | Supabase EU | 12 Monate, danach Anonymisierung |
| Error-Logs (Sentry-Events, server-side) | Code-Errors | Debugging | Sentry (Live) / Cloudflare Workers Logs (Beta) | 30 Tage Beta / 90 Tage Live |
| Cloudflare Web Analytics (instantpage.at) | Webserver | Pageviews, Referrer, Devices — aggregiert | Cloudflare | 30 Tage (CF-Standard), kein PII |
| Newsletter-Anmeldung (news@-Liste) | Opt-in im Portal/Landing | Mailing via Resend, Opt-in-Beweis archiviert | Supabase EU | bis Abmeldung + **3 Jahre** (UWG-Verjaehrung Belaestigungsklage AT, Beweissicherung) |
| Beta-Feedback-Daten | Beta-Tester-Eingaben | Produktentwicklung | Supabase EU | bis Beta-Ende — danach geloescht (siehe § 16 Beta-Migration) |
| Support-Mails | E-Mail-Anfragen an support@ | Kundensupport | Mail-Postfach + ggf. Helpdesk | 12 Monate, bei Geschaeftsvorfall 7 Jahre UGB |

#### Backup-Aufbewahrung

| Backup-Typ | Aufbewahrung | Speicherort |
|---|---|---|
| Supabase taegliche DB-Backups | 7 Tage rueckwirkend (Supabase Pro Standard) | Supabase EU |
| Eigene pg_dump → R2 | 90 Tage Retention | Cloudflare R2 EU |
| Storage-Sync zu R2 | 90 Tage Retention | Cloudflare R2 EU |

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
6. **Speicherdauer:** pro Kategorie konkret — siehe Anhang IV (oben)
7. **Drittlandübermittlung:** USA-Anbieter unter EU-U.S. Data Privacy Framework
8. **Betroffenenrechte:** Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit, Widerspruch, Beschwerde bei DSB
9. **Cookies:** Plattform-Cookies (Auth, Session) sind funktional und ohne Banner-Pflicht (§ 165 Abs 3 TKG). Tracking-Cookies (PostHog Session Replay, Meta-/Google-Ads-Pixel) werden eingesetzt — Einwilligung erfolgt ueber Cookie-Banner (Klaro Open Source als Default, Cookiebot als Reserve-Option). Siehe § 1 #15b. Auf Kundenseiten (`*.instantpage.at`) sind keine Tracking-Cookies aktiv — Banner-frei als USP (siehe § 1 #15c).
10. **AI-Verarbeitung:** Hinweis dass Anthropic-API für Textgenerierung eingesetzt wird, mit Drittland-Bezug

---

## 9. Branchen-Pflichtfeld-Matrix

> **Code-Anbindung:** Erweitert [src/data.js](../src/data.js) `BRANCHEN`-Array um `reglementiert: true|false` Flag und [functions/s/[subdomain]/legal.js](../functions/s/[subdomain]/legal.js) um `BRANCHE_PFLICHT`-Map. Bestehende `BRANCHEN_KAMMER`-Map (8 Berufe) wird erweitert auf ~35 reglementierte Branchen.

### Status

`[GROSSE EIGENARBEIT — Phase A]` Detail-Recherche pro Branche steht aus. Aufwand: ~30 Min/Branche × 35 = 17 Stunden Eigenarbeit oder per parallelen Subagents in 1 Sitzung. **Plan**: gebündelt vor Live-Schaltung in 1–2 Sitzungen via parallel-Subagents, Quelle: WKO-Branchen-Datenbank + RIS für Berufsrecht-Verweise. Output: erweiterte `BRANCHEN_KAMMER`-Map in `legal.js`.

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
| Zwei-Faktor-Authentifizierung | `[SPEZIFIZIERT 2026-05-06]` | Pflicht für Admin-Accounts (Inhaber + Mitarbeiter), Opt-in für Kunden — siehe `ARCHITECTURE.md` § 10 |
| Row-Level-Security (RLS) | aktiv | Supabase RLS auf allen 4 Tabellen (Memory: `project_supabase_rls.md`) |
| Verschlüsselung in Transit | aktiv | TLS 1.3 für alle Verbindungen (Cloudflare-erzwungen) |
| Verschlüsselung at Rest | aktiv | Supabase + Cloudflare R2 server-side AES-256 |
| Pseudonymisierung | teilweise | Subdomain-IDs als Stellvertreter für Firma-Identität in Logs |

### 11.2 Integrität

| Maßnahme | Status |
|---|---|
| Eingabevalidierung | `[SPEZIFIZIERT 2026-05-06]` URL-Escaping + Zod-Schema-Validation an allen Endpoints — `ARCHITECTURE.md` § 10 |
| Schema-Validierung an API-Grenzen (Zod) | `[SPEZIFIZIERT 2026-05-06]` Zod in `lib/validation/` mit Parität zwischen Fragebogen + Portal — `ARCHITECTURE.md` § 5.5 + § 10 |
| Audit-Logs | aktiv | activity_log + error_logs in Supabase, 12 Monate Retention DSGVO-konform |

### 11.3 Verfügbarkeit

| Maßnahme | Status |
|---|---|
| Backups Datenbank | `[SPEZIFIZIERT 2026-05-06]` Supabase Pro PITR 7 Tage + Daily-Backup → R2-Mirror 30/12W/12M — siehe `OPERATIONS.md` § 6.1 |
| Backups Storage | `[SPEZIFIZIERT 2026-05-06]` täglicher Object-Sync nach R2, 30 Tage rolling — `OPERATIONS.md` § 6.1 |
| Restore-Tests | `[SPEZIFIZIERT 2026-05-06]` quartalsweise (DB) + jährlich (Wochen-Snapshot + Storage) — `OPERATIONS.md` § 6.3 |
| DDoS-Schutz | aktiv | Cloudflare WAF |
| Rate-Limiting | `[SPEZIFIZIERT 2026-05-06]` Cloudflare WAF Rules — Login 5x/Min, Build-Endpoint 3x/30 Tage, Generate-API 10x/Tag — `ARCHITECTURE.md` § 10 |

### 11.4 Belastbarkeit + Wiederherstellbarkeit

| Maßnahme | Status |
|---|---|
| Disaster-Recovery-Plan | `[SPEZIFIZIERT 2026-05-06]` Restore-Anleitung + Verantwortlichkeits-Matrix in `OPERATIONS.md` § 6.2 + § 6.5 |
| RTO (Recovery Time Objective) | `[ENTSCHIEDEN 2026-05-06]` 4h Standard, 2h Business — `OPERATIONS.md` § 6.4 |
| RPO (Recovery Point Objective) | `[ENTSCHIEDEN 2026-05-06]` 1h für Pro/Business (PITR), 24h für Trial (Daily-Backup) — `OPERATIONS.md` § 6.4 |

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
**Formular:** instantpage.at/meldung `[BAU in Phase 3]` — Live-Bau-Aufgabe, einfaches öffentliches Formular mit Felder: Meldung-Typ, beanstandete URL, Kontakt-E-Mail, Beschreibung, Beweise-Upload. Auto-E-Mail an abuse@instantpage.at + Eintrag in neue Tabelle `abuse_reports` (`ARCHITECTURE.md` § 4.7).

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
- Self-Service-Button im Portal: "Meine Daten herunterladen" (Konto-Tab → „Mein Account")
- Format: **PDF** (alle gespeicherten Daten zum Order, lesbar zusammengefasst)
- Frist: max 30 Tage, in Praxis sofort
- Activity-Log-Eintrag: `dsgvo_export_requested`

**PDF-Struktur (Spec 2026-05-14):**

| Seite | Inhalt |
|---|---|
| 1 — Deckblatt | Logo instantpage.at, Titel „Datenauskunft gemäß Art. 15 DSGVO", Stammdaten des Anbieters (Wagner IT-Solutions e.U., FN 609574h, 1220 Wien), Erstellt am, Order-ID |
| 2 — Vertragsdaten | Plan, Trial-Start, Trial-Ende, Subscription-Status, Subscription-Start, naechste Rechnung |
| 3 — Stammdaten | Firmenname, Inhaber Vor-/Nachname, Anschrift, UID, GISA, FN, Kammer, Berufsbezeichnung — alle Pflichtfelder aus § 4 Anhang IV |
| 4 — Website-Inhalte | Aktueller Inhalt aller bearbeiteten Tabs (Leistungen, Texte, Bewertungen, Galerie-Bildunterschriften, Team, FAQ) — strukturiert |
| 5 — Endnutzer-Daten | Zaehlung der gespeicherten Kontaktformular-Eingaenge (keine Inhalts-Wiedergabe — Endnutzer sind Verantwortliche fuer **ihre** eigenen Daten, hier nur Meta-Zaehlung) |
| 6 — Subprozessoren | Aktuelle Subprozessoren-Liste (§ 4 dieses Dokuments) — Anhang |
| 7 — Activity-Log | Last 90 Tage Activity-Log-Eintraege (Action-Type, Datum, Detail-Summary), aelter nur auf Anfrage |
| 8 — Hinweise | Recht auf Berichtigung (Art. 16) / Loeschung (Art. 17) / Einschraenkung (Art. 18) / Beschwerde bei DSB (dsb.gv.at) |

**Generierungs-Workflow:**
- PDF wird serve-time aus DB generiert (keine Vorberechnung)
- Tool: `@react-pdf/renderer` oder `pdf-lib` (Server-Side in Cloudflare Worker)
- Bei grossen Galerien: nur Caption + Credit, nicht Bilddateien selbst (Bilddateien separat im Storage Bucket abrufbar via Portal-Galerie)
- Sprache: Deutsch (AT)
- Versanddatei-Name: `instantpage-datenauskunft-{order-id}-{YYYYMMDD}.pdf`

**Edge-Cases:**
- Mehrere Orders pro User: 1 PDF pro Order (User loadet selbst, je nachdem welche Site er auskoppeln moechte)
- Geloeschter Account (Hard-Delete schon ausgefuehrt): kein Export moeglich, Mail-Hinweis mit Bestaetigung der Loeschung

**Recht auf Löschung (Art. 17):**
- Self-Service-Button im Portal: "Account löschen" (nicht zu prominent platzieren)
- Sofortige Bestätigungs-Mail mit 14 Tage Karenz-Frist (User kann den Lösch-Wunsch innerhalb dieser Zeit zurueckziehen — keine Verwechslung mit FAGG-Widerruf, der bei B2B nicht greift)
- Nach 14 Tagen Hard-Delete-Cascade (orders + Storage + Auth)
- Activity-Log-Eintrag: `dsgvo_delete_requested` + nach Ausführung `dsgvo_delete_executed` mit Hash-Bestätigung
- Außerhalb des normalen Cancellation-Flows (Cancellation = Subscription-Ende, Löschung = Daten-Vernichtung)

### 12.5 AVV-Akzeptanz-Verfahren

- **Beim ersten Login** wird AVV als Modal eingeblendet (nach Account-Erstellung, vor Portal-Zugriff)
- AVV wird als **PDF-Download** angeboten (statisch generiert mit Kunden-Stammdaten als Anhang I)
- Akzept-Klick: Pflicht-Checkbox + "Akzeptieren"-Button
- Activity-Log-Eintrag: `consent_recorded` mit `details: {document: 'avv', version: 'v1.0', timestamp, ip_hash}`
- Bei AVV-Update: alle Kunden müssen erneut akzeptieren beim nächsten Login

### 12.6 AGB-Akzeptanz-Verfahren `[WARTET auf Anwalt — Block A]`

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

`[WARTET auf WKO-Markensprechtag 2026-05-20]` Markenrechtsrecherche für "instantpage.at" und "InstantPage" als Wortmarke.

### Strategischer Rahmen

instantpage.at ist als **oesterreichisches Vertrauensprodukt** positioniert (Memory `feedback_at_vertrauensprodukt.md`). Markenrecht-Pruefung folgt diesem Fokus:

- **Primaere Pruefung: Oesterreichisches Patentamt** — AT-Markenschutz ist Phase-1-Bedarf
- **Sekundaer: EUIPO** — wichtig wegen Vorrang von EU-Marken bei Konflikt mit AT-Anmeldung, aber kein Schutzziel in Phase 1
- **Verwechslungsgefahr** wird am oesterreichischen Durchschnittskonsumenten gemessen — internationale Marken die in AT nicht aktiv vermarktet werden, sind weniger kritisch
- **Anmeldungs-Strategie:** AT-Wortmarke ab **294 €** (Online, inkl. 3 Klassen, seit Juli 2024 angepasst — laut WKO-Auskunft 2026-05-04) fuer Phase 1, EU-Marke ab 850 € erst zu Beginn von Phase 2 (DACH/EU)

### Recherche-Stand 2026-05-04 (manuell verifiziert)

Direkte DB-Abfrage durch User im Browser durchgefuehrt — TMview, EUIPO eSearch plus, WIPO Global Brand Database. CLI-Recherche (Whois, LinkedIn, Hersteller-Sites) ergaenzend.

#### Markentreffer

| Treffer | Inhaber | Office | Status | Branchen-Konflikt |
|---|---|---|---|---|
| **INSTANTPAGE** Reg. 4072262 (Klasse 042, registriert 2011-12-13) | GO DADDY OPERATING COMPANY, LLC | USPTO | **Eingetragen** | mittel-hoch in USA — in AT nicht in Kraft |
| **INSTANTPAGE** Reg. 75826561 (Klasse 9, angemeldet 1999-10-19) | INFOLIO, INC. | USPTO | **Beendet** | irrelevant — Marke nicht mehr in Kraft |
| **INSTAPAGE** Reg. 5339935 | Instapage, Inc. | USPTO | Eingetragen | mittel in USA — in AT nicht in Kraft, klanglich aehnlich |
| **EU-Marke (EUIPO)** | — | EUIPO | — | **0 Treffer** (eSearch plus, manuell verifiziert) |
| **AT-Marke** | — | Patentamt AT (via TMview) | — | **0 Treffer** (TMview deckt AT-Patentamt ab) |
| **DE-Marke** | — | DPMA (via TMview) | — | **0 Treffer** (TMview deckt DPMA ab) |
| **IR-/Madrid-Marke** | — | WIPO | — | **0 Treffer** (Global Brand DB, MARK_ALL,HOL:instantpage) |

#### Domain-Konflikte (Whois 2026-05-04)

| Domain | Inhaber | Status | Bewertung |
|---|---|---|---|
| **instantpage.at** | Wagner IT-Solutions e.U. (Alexander Wagner) | gesichert seit 2026-03-25 | ✅ Eigene Domain — Domain-Recht ist gesichert, ersetzt aber kein Markenrecht |
| **instantpage.com** | GoDaddy.com LLC, ueber Atom.com gelistet (Domain-Marketplace, NS1/2.atom.com) | parked / zum Verkauf | mittel — Inhaber GoDaddy ist auch INSTANTPAGE-Markeninhaber. SEO-Konflikt + theoretisch fuer GoDaddy reaktivierbar |
| **instantpage.de** | privat / Nameshift.com (Niederlande, Domain-Broker) | parked / zum Verkauf, last change 2025-09-07 | niedrig — kein aktiver Konkurrent, aber kaufbar |
| **instantpage.eu** | NOT DISCLOSED (EURid Privacy) | unbekannt | niedrig–mittel |
| **instantpage.dev** | InstantPage™ (Hongkong, ~11–50 MA, "Partnership", IT Services), aktive SaaS-Plattform | **AKTIV** — Premium Website / Funnel / E-Commerce Builder mit AI, Hashtags #HongKong #StartupHK | **hoch** — identische Branche und identischer Markenname mit ™-Symbol; LinkedIn: linkedin.com/company/instantpage-dev |
| **instant.page** | Open-Source-Projekt (Performance-Trick) | aktiv | niedrig — anderer Use-Case (JS-Bibliothek), nicht-kommerziell |

#### Bewertung im AT-only-Kontext

- **Keine eingetragene Marke "instantpage" in AT, EU, DE oder international** — Verwechslungsgefahr-Widerspruch aus diesen Aemtern faellt damit weg. Eintrag in Aemtern manuell verifiziert (TMview, eSearch plus, Global Brand DB). Restrisiko: Sound-Aehnlichkeitsrecherche ("instant page" mit Leerzeichen, "instapage", "instantpages") wurde nur teilweise durchlaufen — Patentamt-Pre-Check oder Markensprechtag-Profi koennte zusaetzliche Aehnlichkeitstreffer aufdecken.
- **GoDaddy (US INSTANTPAGE 4072262)** und **Instapage Inc. (US INSTAPAGE 5339935)** sind aktive US-Marken, beide aber in AT nicht aktiv vermarktet → Verwechslungsgefahr fuer AT-Durchschnittskonsumenten gering, Widerspruchsrecht im AT-Verfahren ohne EU-/IR-Anmeldung nicht gegeben.
- **instantpage.dev (Hongkong)** ist aktives SaaS-Konkurrenzprodukt in identischer Branche, nutzt ™-Symbol — aber **keine eingetragene Marke** (weder US, EU, IR). Das ™ ist unverbindlich; rechtlicher Schutz nur durch Eintragung. Im AT-Anmeldeverfahren kein Widerspruchsrecht. UWG-Klagerisiko bleibt theoretisch, aber HK-Anbieter ohne DACH-Auftritt → niedrig.
- **Beschreibend-Risiko (jetzt das Hauptrisiko):** Patentamt prueft eigenstaendig, ob "InstantPage" / "Instant Page" unterscheidungskraeftig ist oder als beschreibend ("sofortige Seite" fuer Website-erstellende Software) abgelehnt wird. Diese Beurteilung kann nicht im Voraus garantiert werden — Markensprechtag oder Anwalt-Vorab-Einschaetzung empfohlen. Plan B bei Ablehnung: Wortbild-Marke mit Logo, oder Brand-Wechsel.

#### Risiko-Einschaetzung (nach manueller DB-Verifikation)

| Szenario | Wahrscheinlichkeit | Konsequenz |
|---|---|---|
| AT-Patentamt akzeptiert Unterscheidungskraft → Eintragung als Wortmarke | mittel-hoch | beste Outcome — ~294 € + 10 J Schutz |
| AT-Patentamt verneint Unterscheidungskraft (beschreibend) | mittel | Wortbild-Marke mit Logo als Plan B (294 € erneut) |
| Widerspruch durch eingetragene EU-/AT-/IR-Marke | **sehr niedrig** | nicht zu erwarten — keine Treffer in Aemtern |
| Sound-Aehnlichkeitstreffer (instapage, instant page) loesen Widerspruch aus | niedrig-mittel | Pre-Check beim Patentamt empfehlenswert (kostenpflichtig) |
| UWG-Klage durch instantpage.dev bei Marktexpansion | niedrig | HK-Anbieter, derzeit kein DACH-Auftritt — Brand-Investment-Risiko ueber Zeit |

### Was zu prüfen ist

Recherche-Datenbanken (kostenlos, Quelle: WKO-Marken-Beratung 2026-05-04):

| Quelle | Was | Prioritaet |
|---|---|---|
| Österreichisches Patentamt — see-ip | <https://see-ip.patentamt.at/de> Wortmarke "instantpage" / "instant page" / "instapage" in Klassen 9, 35, 38, 42 | **hoch** |
| EUIPO — TMview (alle teilnehmenden Markenämter) | <https://www.tmdn.org/tmview/> dieselbe Recherche EU-weit | hoch |
| EUIPO — eSearch plus (auch Bild-Verfügbarkeit) | <https://euipo.europa.eu/eSearch/> | hoch |
| WIPO — Global Brand Database (national + international) | <https://branddb.wipo.int/> | mittel |
| WIPO Madrid Monitor — IR-Marken | <https://www3.wipo.int/madrid/monitor/> | mittel |
| Deutsches Patentamt — DPMAregister | <https://register.dpma.de/DPMAregister/marke/einsteiger> | mittel — DACH-Vorab-Check |
| Nizza-Klassifizierungstool EUIPO | <http://euipo.europa.eu/ec2/> Hilfstool fuer Waren-/Dienstleistungs-Klassen | hoch — fuer Anmeldung selbst |
| Domain-Konflikte | instantpage.com (GoDaddy), instantpage.de, instantpage.eu, instantpage.dev — Inhaber identifizieren | mittel |
| Sound-Ähnlichkeiten | "Instapage", "InstaPage", "Instant Page", "InstaPay" (verwechselbar?) | hoch |

### Aufwand und Optionen

- **Selbstrecherche** (oben gelistete Datenbanken): ~30–60 Min, kostenlos — primaere Pflicht vor jeder Anmeldung
- **WKO-Markensprechtag:** **kostenlos fuer Gruender:innen** (sonst 49 €), Online-Buchung bei WKO — fuer Marke/Markenpositionierung/Designschutz. Empfohlen vor Anmeldung. Termin: <https://outlook.office.com/book/WKOMarkensprechtag@wkonline.onmicrosoft.com/>
- **Pre Check / 24h-Aehnlichkeitsrecherche** beim AT-Patentamt: optional, kostenpflichtig — vom Patentamt-Infoblatt MA empfohlen vor Anmeldung
- **Markenanwalt / Patentanwalt:** 200–500 €, optional fuer Anmeldung selbst oder bei unklarem Konflikt-Risiko nach Sprechtag
  - OOe Rechtsanwaltskammer (Suche "gewerbl. Rechtsschutz, Immaterialguerrecht" / "Marke"): <https://ooerak.at/anwalt>
  - Oesterreichische Patentanwaltskammer: <https://www.oepak.at/>
- **Foerderung:** "Bleib Einzigartig" vom AT-Patentamt — Foerderprogramm fuer Markeneintragungen / Design / Patent. Pruefen ob Gruender-/KMU-foerderbar.

### Kostenrechner

- EUIPO-Marke: <https://euipo.europa.eu/ohimportal/de/fees-and-payments>
- WIPO-Marke (international): <https://madrid.wipo.int/feecalcapp/>

### Konsequenzen

- **Wenn AT-frei:** AT-Wortmarken-Anmeldung ab 294 € (Online, 3 Klassen, 10 Jahre Schutz, Erneuerung 700 €). EU-Anmeldung erst zu Phase-2-Beginn (DACH/EU)
- **Wenn AT-belegt:** Brand-Wechsel zwingend — Marketing-Investment in `instantpage.at` einstellen, oesterreichisch klingende Brand-Alternativen brainstormen
- **Wenn EU-Konflikt aber AT-frei:** Anwalt-Konsultation zu Verwechslungsgefahr-Risiko in AT (~500 €). AT-Anmeldung kann dennoch moeglich sein wenn EU-Marken-Inhaber nicht in AT taetig ist und keine Widerspruchsfrist nutzt.

### Aktionen

| Aktion | Status |
|---|---|
| WKO-Markenberatung — Anfrage raus 2026-05-04 | `[ERLEDIGT]` Antwort eingelangt mit Recherche-Datenbanken, Sprechtag-Buchungslink, aktualisierten Gebuehren (294 € online), Foerder-Hinweis |
| Vorab-Recherche Justia/USPTO + Whois aller instantpage-Domains + LinkedIn instantpage.dev | `[ERLEDIGT]` 2026-05-04 — Befunde dokumentiert |
| **TMview Browser-Recherche** (deckt AT-Patentamt + DPMA + EUIPO ab) | `[ERLEDIGT]` 2026-05-04 — nur 2 USPTO-Treffer (1 eingetragen, 1 beendet); keine AT/EU/DE-Treffer |
| **EUIPO eSearch plus Browser-Recherche** | `[ERLEDIGT]` 2026-05-04 — 0 Treffer (Trade marks, Designs, Owners, Representatives) |
| **WIPO Global Brand Database** (deckt Madrid IR + nationale Quellen) | `[ERLEDIGT]` 2026-05-04 — 0 Treffer fuer instantpage |
| AT see-ip direkt zur Vollstaendigkeit (Doppelpruefung) | `[OPTIONAL]` — TMview deckt AT-Patentamt bereits ab, see-ip-Direktcheck fuer 100 % Sicherheit |
| Sound-/Aehnlichkeitsrecherche ("instant page", "instapage", "instantpages") | `[WARTET auf Markensprechtag 2026-05-20]` — vom WKO-Berater durchführen lassen |
| **WKO-Markensprechtag** | `[GEBUCHT]` Termin 2026-05-20 (gebucht 2026-05-04). Hauptthemen: Schutzfaehigkeit „InstantPage", Wortmarke vs. Wortbildmarke, Klassenwahl, AT vs. EU-Strategie |
| Nizza-Klassen festlegen (EUIPO-Tool ec2) | `[WARTET auf Markensprechtag 2026-05-20]` — Vorschlag aus Recherche: Klasse 42 (Software/Hosting), ggf. 35 (Werbung/Marketing-Dienstleistungen) |
| Brand-Alternativen-Liste vorbereiten (Backup) | `[OPTIONAL]` — nur falls Sprechtag/Patentamt Unterscheidungskraft verneint |
| Wortbild-Marke (mit Logo-Element) als Plan B | `[BACKUP]` — falls Wortmarke wegen Beschreibend-Risiko abgelehnt wird |
| **AT-Wortmarke anmelden** | `[BEREIT]` Recherche-Stand erlaubt Anmeldung — empfohlene Reihenfolge: Sprechtag → ggf. Pre-Check → Anmeldung |
| Foerderung "Bleib Einzigartig" auf Eligibility pruefen | `[WARTET auf Markensprechtag 2026-05-20]` — beim WKO-Termin gleich mit klären |

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
