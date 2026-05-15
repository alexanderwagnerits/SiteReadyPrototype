# Anwalts-Briefing — instantpage.at Tier-1-Foundation

> **Vorlage fuer den Erstkontakt + Erstgespraech mit dem IT-Anwalt.** Ziel ist eine einmalige Foundation aus AGB, AVV, Datenschutzerklaerung und Plattform-Impressum, die ueber einen Auto-Generator pro Kunde befuellt werden kann.
>
> **Status:** `[DRAFT 2026-05-15]` — wartet auf Anwalts-Auswahl + Erstgespraech.

---

## 1. Kontext

### Unternehmen
- **Wagner IT-Solutions e.U.**, FN 609574h (HG Wien), 1220 Wien
- Inhaber Alexander Wagner, gegruendet 03.08.2023
- WKO-Mitglied, Fachgruppe **UBIT**
- Versichert ueber UBIT-Rahmenvertrag (R+V Berufshaftpflicht 173 €/Jahr seit 2026-05-06)

### Produkt
- **instantpage.at** — SaaS-Website-Generator fuer oesterreichische KMU
- Kunde beantwortet Fragebogen → KI generiert Website auf Subdomain `firma.instantpage.at` (oder Custom-Domain im Pro-Plan)
- **Marktposition:** AT-only Phase 1, **B2B-only** mit Unternehmer-Selbsterklaerung
- **Pricing:** Starter €16/Mo (€14 Jahr) — Professional €29/Mo (€25 Jahr) — Trial 7 Tage Live-Schaltung erlaubt

### Technische Architektur (rechtsrelevant)
- **Hosting + Datenbank:** Cloudflare Pages/Workers + Supabase (EU Frankfurt, Postgres + Storage)
- **Mailing:** Resend (EU-Server, Auftragsverarbeiter)
- **Bezahlung:** Stripe (USA-Anbieter unter EU-U.S. Data Privacy Framework)
- **KI-Textgenerierung:** Anthropic API (USA-Anbieter unter DPF). Generiert nur Texte fuer die Website — **keine Endnutzer-Daten** an Anthropic.
- **Form-Submissions** auf Kundenseiten (Kontakt, Reservierung, Termin-Anfrage): **Pure-Forwarder-Architektur** — wir speichern die Inhalte NICHT in unserer DB, sondern leiten sie via Resend direkt an die Kunden-Mailbox weiter. Begruendung: minimaler AVV-Scope, weniger Risiko.

### Bereits aufgesetzt (Anwalt soll NICHT neu entscheiden)
- **B2B-Beschraenkung** im Bestellprozess via Unternehmer-Selbsterklaerung; UID **optional**, weil Kleinunternehmer/Vereine ohne UID nicht ausgeschlossen werden sollen
- **Cookie-Strategie:** Plattform `instantpage.at` mit Klaro-Banner (Marketing-Pixel + PostHog). Kundenseiten **banner-frei als USP** (cookielose Cloudflare Analytics, YouTube-nocookie, Maps via Two-Click).
- **Datenretention nach Kuendigung:** 30 Tage Reaktivierung + 60 Tage Soft-Delete + danach Hard-Delete (90 Tage total)
- **Haftungsbegrenzung** (Default-Wunsch): 12-Monats-Vergueutung als Cap
- **Kein Refund nach 7-Tage-Trial** (B2B-Standard wie Wix/Squarespace/Notion)

Vollstaendige Strategie-Entscheidungs-Tabelle: `docs/LIVE-COMPLIANCE.md` § 1.

---

## 2. Liefer-Pakete (4 Pakete)

### Paket 1 — AGB (B2B-only)

**Status:** Skeleton §§ 1–15 vollstaendig ausformuliert auf Basis WKO-Vorlagen (IT-Betreiberdienstleistungen + IT-Programmierdienstleistungen + IT-Software-Support B2B) + 5 Eigenklauseln. Vorlage: `docs/LIVE-COMPLIANCE.md` § 5.

**Auftrag an den Anwalt:**

Rechtliche **Pruefung** des bestehenden Drafts auf:

- **Wirksamkeit der 5 Eigenklauseln**:
  - § 5 **KI-generierte Inhalte** — Haftungsausschluss fuer sachliche Ungenauigkeiten, branchenrechtlich problematische Aussagen
  - § 6 **Generierte Rechtstexte** (Impressum-/DSE-Vorlagen) — Hilfestellung, kein Ersatz fuer Rechtsberatung
  - § 7 **Bildrechte und Inhaltsfreigabe** — Freistellungsklausel
  - § 8 **Betreiber-Klausel** — Kunde ist Medieninhaber (MedienG), Diensteanbieter (§ 5 ECG), Verantwortlicher (Art 4 Z 7 DSGVO)
  - § 1 Abs 3 **B2B-Beschraenkung via Unternehmer-Selbsterklaerung** mit optionaler UID — haelt das gegen Konsumentenschutz-Argumente (Falscherklaerung des Bestellers)?
- **Klauselverbots-Pruefung** nach § 879 ABGB (auch im B2B-Bereich beachtlich)
- **Haftungsbegrenzung** (§ 12 Abs 3): 12-Monats-Vergueutung als Cap — durchsetzbar?
- **AGB-Aenderungsklausel** (§ 14): 6-Wochen-Frist + Schweigen = Annahme — wirksam im B2B?
- **Ergaenzungen** wo Klauseln zu Konsumentenschutz-Lasten kippen koennten
- **Wording-Optimierung** wo Drafts unklar oder mehrdeutig

### Paket 2 — AVV (Auftragsverarbeitungsvertrag)

**Status:** Hauptteil = **EU-Standardvertragsklauseln** nach Durchfuehrungsbeschluss (EU) 2021/915, Module Controller-Prozessor (Klauseln 1–10), wortgleich uebernommen. Anhaenge I (Beschreibung der Verarbeitung), III (Subprozessor-Liste) und IV (Datenkategorien-Liste) sind detailliert drafted. Vorlage: `docs/LIVE-COMPLIANCE.md` § 6.

**Auftrag an den Anwalt:**

- **Inhaltliche Pruefung Anhang I** — passt die Beschreibung zur tatsaechlichen Architektur?
- **Pure-Forwarder-Architektur** (Anhang IV, Tabelle Endnutzer-Daten) — bestaetigen oder anpassen, ob das tatsaechlich **keine eigene Verarbeitung** der Form-Submissions auf Kundenseiten ist (wir bekommen die Daten nie in unsere DB; Resend ist reiner Mail-Versender)
- **Subprozessor-Widerspruchsfrist** 30 Tage + Sonderkuendigungsrecht bei berechtigtem Widerspruch — angemessen?
- **Anhang II (TOMs)** — Pruefung der vorhandenen TOMs-Beschreibung (`docs/LIVE-COMPLIANCE.md` § 11) auf Vollstaendigkeit gemaess Art 32 DSGVO
- **AVV-Akzeptanz-Verfahren:** Separater PDF-Download + Akzept-Klick beim ersten Login — formal ausreichend?

### Paket 3 — Plattform-Datenschutzerklaerung

**Status:** 10 Pflicht-Bausteine spec'd (`docs/LIVE-COMPLIANCE.md` § 8), Volltext fehlt noch.

**Auftrag an den Anwalt:**

- **Ausformulierung** der DSE aus den 10 Pflicht-Bausteinen
- **KI-Verarbeitungs-Hinweis** (Anthropic, USA, DPF) korrekt formulieren
- **Cookie-Klausel** mit Klaro-Banner-Integration:
  - Marketing-Pixel + PostHog Session-Replay → Einwilligung
  - Funktionale Cookies → ohne Banner gemaess § 165 Abs 3 TKG
- **Drittlandsuebermittlungen** (Stripe, Anthropic, Resend, Cloudflare) — Wording fuer DPF-Anbieter
- **Beta-Phase-Hinweis** falls separates Wording fuer die Uebergangsphase noetig (Beta laeuft heute, Live-Cutover steht an)
- **Datenkategorien mit Speicherdauer** pro Kategorie — die Tabelle aus Anhang IV des AVV ist konsolidierungsfaehig in die DSE

### Paket 4 — Plattform-Impressum

**Status:** Skeleton mit Variablen-Platzhaltern drafted (`docs/LIVE-COMPLIANCE.md` § 7).

**Auftrag an den Anwalt:**

- **Vollstaendigkeits-Pruefung** gemaess § 24 MedienG + § 5 ECG + § 14 UGB
- **Gewerbeberechtigungs-Wortlaut** korrekt — exakte Bezeichnung „Dienstleistung in der automatischen Datenverarbeitung und Informationstechnik" (UBIT)
- **ODR-Hinweis** (Online-Streitbeilegung) — Klausel-Wirksamkeit trotz B2B-Klarstellung
- **Aufsichtsbehoerde** — Bezirkshauptmannschaft / Magistrat Wien als zustaendige Stelle

---

## 3. Lieferformat-Anforderung

Wir bauen einen **Auto-Generator**, der pro Kunde Impressum + DSE-Variante befuellt (Stammdaten + branchen-spezifische Pflichtangaben). Damit das funktioniert:

**Bevorzugt:** Word-Templates mit klar markierten Variablen-Platzhaltern im Format `{{FIRMENNAME}}`, `{{ADRESSE}}`, `{{UID}}`, `{{KAMMER}}`, `{{TRIAL_DAYS}}` etc. — wir parsen diese und ersetzen sie zur Laufzeit aus zentralen Konfigurations-Werten (`config/legal-values.ts`). Eine Liste der benoetigten Platzhalter liefern wir vor Bauphase.

**Alternativ:** Klausel-Bausteine in modularer Form (eine Datei pro § / Anhang), mit Variablen wie oben.

**Nicht ausreichend:** Finale PDFs ohne Variablen — die koennen wir nicht in den Generator einbauen.

---

## 4. Strategische Fragen — User entscheidet im Termin

| Frage | Optionen | Pro / Contra |
|---|---|---|
| **Honorar-Modell** | Soft-Cap-Pauschale €800–2.000 fuer Komplett-Paket vs. Stundenhonorar (~€200/h × geschaetzt 5–10h) | Pauschale planbarer, aber bei reiner Pruefung+Korrekturen evtl. ueberzahlt. Stundenhonorar fairer fuer beide Seiten, aber Risiko nach oben. |
| **Granularitaet** | Komplett-Paket (AGB+AVV+DSE+Impressum) jetzt vs. nur AGB+AVV jetzt, DSE+Impressum spaeter | Komplett ist gebuendelt + spart Doppel-Onboarding. Modular spart Cash falls Budget knapp + DSE kann auf erste Live-Erkenntnisse warten. |
| **Reglementierte Berufe** (Heilberufe, RA, StB) | Anwalt liefert Sonderklauseln in Phase 1 vs. erst bei skalierender Heilberufe-Nutzung | Phase 1: abgesichert vor Live. Spaeter: Cash sparen, Risiko geringer wenn anfangs wenige Heilberufe. |
| **Jaehrliches Review (Tier 6)** | Gleicher Anwalt jaehrlich Review (€500–800/Jahr) oder ad-hoc | Gleicher Anwalt kennt Stand → kuerzer + billiger. Ad-hoc flexibler, aber neuer Anwalt muss eingearbeitet werden. |
| **Schluss-Sichtung vor Stripe-Live** | Anwalt unterzeichnet Foundation vor Live-Day-1 als Letzte-Sichtung | Bereits ja entschieden (`docs/LIVE-COMPLIANCE.md` § 1 #17), aber Termin-Timing klaeren — soll dasselbe Mandat enthalten? |

---

## 5. Anwalts-Profil — Auswahlkriterien

- **AT-Anwalt** mit RAK-Wien-Berechtigung (Erfuellungsort + Gerichtsstand Wien, siehe AGB § 15)
- Schwerpunkt **IT-Recht + DSGVO + SaaS**
- Erfahrung mit **AGB-Pruefung B2B** (nicht nur B2C-Standard)
- **Auto-Generator-/Templating-Erfahrung** — versteht Variablen-System
- Idealerweise **Erfahrung mit KI-Anwendungen** (KI-Klausel-Wirksamkeit, EU AI Act)
- **Erreichbar via E-Mail / Video** (keine reinen Praesenz-Anwaelte)

**Recherche-Pfad:** RAK-Wien Anwaltssuche → Filter „IT-Recht" + „Datenschutz" → Webseiten-Sichtung Mandanten-Profil (SaaS-Referenzen?). 3–5 Kandidaten anfragen, 1–2 fuer Erstgespraech buchen.

---

## 6. Was bewusst NICHT im Anwalts-Auftrag liegt

| Tier | Was | Begruendung |
|---|---|---|
| 3 | `config/legal-values.ts` als Single-Source-of-Truth (TRIAL_DAYS, REACTIVATION_DAYS etc.) | reine Eigenarbeit Phase 0 |
| 4 | `compliance-reviewer` Subagent | reine Eigenarbeit Live-Bau |
| 5 | CHANGELOG mit `[LEGAL]`-Tag | reine Eigenarbeit Live-Bau |
| — | **Branchen-Pflichtfeld-Recherche** (~35 Branchen) | Recherche-Schicht via WKO + RIS in Eigenarbeit, Anwalt nur fuer Spitzen einsetzen |
| — | **Reglementierte Berufe Werbeverbote** (`docs/LIVE-COMPLIANCE.md` § 10) | Defensive KI-Prompt-Regeln + Disclaimer bereits spec'd — Anwalt nur fuer AGB-Sonderklauseln falls noetig |
| — | **EU AI Act 2.8.2026** (`docs/LIVE-COMPLIANCE.md` § 13) | Self-Assessment + Risiko-Klasse limitiert; separater Anwalts-Check zum Stichtag |
| — | **Markenrecht „InstantPage"** | WKO-Markensprechtag 20.05.2026 separat (`docs/LIVE-COMPLIANCE.md` § 14) |

---

## 7. Verweise auf Quell-Specs (alles liegt im Repo)

| Was | Quelle |
|---|---|
| Strategie-Entscheidungen (23 Punkte) | `docs/LIVE-COMPLIANCE.md` § 1 |
| Stammdaten Wagner IT-Solutions | `docs/LIVE-COMPLIANCE.md` § 2 |
| Subprozessor-Liste | `docs/LIVE-COMPLIANCE.md` § 4 |
| **AGB-Skeleton §§ 1–15** | `docs/LIVE-COMPLIANCE.md` § 5 |
| **AVV + Anhaenge I/III/IV** | `docs/LIVE-COMPLIANCE.md` § 6 |
| **Plattform-Impressum-Skeleton** | `docs/LIVE-COMPLIANCE.md` § 7 |
| **DSE-Pflicht-Bausteine** | `docs/LIVE-COMPLIANCE.md` § 8 |
| Branchen-Pflichtfeld-Matrix | `docs/LIVE-COMPLIANCE.md` § 9 |
| Reglementierte Berufe Sonderbehandlung | `docs/LIVE-COMPLIANCE.md` § 10 |
| **TOMs (Anhang II AVV)** | `docs/LIVE-COMPLIANCE.md` § 11 |
| Tier-Modell + Anwalts-Rolle | `docs/LIVE-COMPLIANCE.md` Compliance-Strategie ganz oben |
| Architektur (Pure-Forwarder etc.) | `docs/ARCHITECTURE.md` § 1.2 |

**Hinweis fuer Anwalts-Onboarding:** Wir koennen die relevanten Sektionen aus `LIVE-COMPLIANCE.md` als PDF-Export liefern, falls Markdown nicht praktisch ist.
