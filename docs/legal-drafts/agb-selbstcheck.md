# AGB-Selbstcheck — 5 Eigenklauseln + Newcomer-Rabatt-Klausel

**Stand:** 2026-05-16
**Status:** Eigenarbeit nach Compliance-Pivot 2026-05-15 (`LIVE-COMPLIANCE.md` § 17 Phase C, § 18). Anwalts-Audit Trigger-basiert spaeter.
**Pruef-Objekt:** AGB-Skeleton in `LIVE-COMPLIANCE.md` § 5 (Volltext, B2B-only) — Fokus auf die 5 Eigenklauseln (§§ 1, 5, 6, 7, 8) plus § 9 Abs. 5 (Aktionsrabatte, Eigenklausel-Erweiterung 2026-05-15).
**Methodik:** Pro Klausel — Plausibilitaets-Check + AT-spezifische Risiken (B2B-AGB-Inhaltskontrolle nach § 879 Abs. 3 ABGB, UWG, MedienG, ECG) + Konsistenz mit DSE/AVV/BRAND/MARKETING + Empfehlungen + Anwalts-Flags.

> **Hinweis:** KSchG-Inhaltskontrolle ist NICHT anwendbar, weil B2B-only (§ 1 Abs. 2 AGB i.V.m. § 1 KSchG). Pruefung bleibt aber unter § 879 Abs. 3 ABGB (groebliche Benachteiligung) sowie § 864a ABGB (ungewoehnliche Klauseln).

---

## § 1 — Geltungsbereich, B2B-Beschraenkung (Eigenklausel)

### Ist-Stand
- Abs. 1: AGB-Geltung
- Abs. 2: ausschliesslich an Unternehmer im Sinne § 1 KSchG
- Abs. 3: Selbsterklaerungs-Mechanik, UID/GISA/FN optional
- Abs. 4: Haftung des Kunden bei Falschangabe
- Abs. 5: Vorrang vor Kunden-AGB

### Plausibilitaets-Check
**OK:**
- Klare B2B-Abgrenzung — keine versteckten Verbraucher-Falle
- UID nicht verlangt — schuetzt Kleinunternehmer (richtig, weil Eigen-Geschaeftsmodell selbst Kleinunternehmer ist und Konsistenz wichtig)
- Selbsterklaerung als Vertrags-Bestandteil (Beweis-Mechanik)

**Schwachstellen:**
- Abs. 4 „Falschangabe → Haftung Kunde": durchsetzbar, aber praktisch schwer pruefbar. Risiko: bewusst-falsche Selbsterklaerung durch Verbraucher → Vertrag rechtlich kippelig (KSchG-Schutz koennte greifen, wenn Selbsterklaerung erkennbar unrichtig)
- Abs. 5 (Vorrang vor Kunden-AGB) ist Standard, aber bei B2B mit groesseren Kunden (z.B. WKO-Verband o.ae.) muss ggf. individuelle Verhandlung moeglich bleiben → in Praxis selten relevant fuer KMU-Zielgruppe

### Konsistenz
- DSE § 1: Wagner IT-Solutions e.U. als Verantwortlicher — OK
- AVV Cover: Verantwortlicher = Kunde, Auftragsverarbeiter = Anbieter — OK
- Pricing-Page (PRODUCT.md): nirgendwo „auch fuer Privatpersonen" — OK
- MARKETING § 2.2: Outreach-Ziele sind Unternehmer (WKO-Eintraege) — OK

### Empfehlungen
1. **Hinweis-Box im Bestellprozess** mit prominenter Anzeige „Diese Plattform ist nur fuer Unternehmer" — verhindert KSchG-Anspruch via „ungewoehnliche Klausel" (§ 864a ABGB). Spec im Portal-Onboarding.
2. **UID-Eingabefeld als „optional, leer = Kleinunternehmer"** — UI-Logik macht den Sonderfall sichtbar, nicht versteckt.
3. **Falsch-Erklaerungs-Konsequenz** koennte ergaenzt werden um „sofortige ausserordentliche Kuendigung" — bisher nur „Haftung" benannt. Defensiver waere zusaetzliches Sonderkuendigungsrecht.

### Anwalts-Flags
- `[ANWALT-PRUEFUNG SPAETER]` Selbsterklaerungs-Beweiswirkung in der Praxis (OGH-Judikatur zu B2B-Selbsterklaerungen — Vorrang Inhalt vs Erscheinungsbild?)

### Status
**`[OK MIT MINOR-EMPFEHLUNGEN]`** — keine Bau-Blocker, UI-Hinweis-Box implementieren.

---

## § 5 — KI-generierte Inhalte (Eigenklausel)

### Ist-Stand
- Abs. 1: KI-Einsatz transparent
- Abs. 2: KI kann Fehler enthalten (Risiko-Hinweis)
- Abs. 3: Pruefpflicht Kunde + Haftungsausschluss Anbieter
- Abs. 4: Reglementierte Berufe — Eigenverantwortung
- Abs. 5: Aktive Freigabe-Klick mit Audit-Trail

### Plausibilitaets-Check
**OK:**
- Abs. 5 (Freigabe-Klick) ist die zentrale defensive Klausel — AI-Act § 13 „Kunden-Freigabe als Ausschlussgrund" aktiv genutzt (siehe `LIVE-COMPLIANCE.md` § 13 + § 1 #24)
- Abs. 4 (Reglementierte Berufe) sauber, ergaenzt durch defensive KI-Prompt-Regeln (§ 10.2)
- Transparenz-Pflicht aus DSGVO/AI-Act erfuellt durch Abs. 1

**Schwachstellen:**
- Abs. 3 Satz 2 (Haftungsausschluss): in B2B grundsaetzlich zulaessig, aber **muss** mit § 12 (Haftungsbegrenzung) konsistent sein. § 12 Abs. 4 nennt KI-Inhalte explizit als ausgeschlossen → **konsistent**
- KEIN expliziter Verweis auf AI Act 2026-08-02 in § 5 — die Pflicht zur Footer-Kennzeichnung (Art. 50 AI Act) wird in DSE § 10.4 + LIVE-COMPLIANCE § 13 geregelt, aber AGB sollte zumindest Verweis enthalten

### Konsistenz
- DSE § 10 (KI-Verarbeitung): vollstaendiger, ausfuehrlicher — OK, AGB-Klausel kann kompakt bleiben
- AVV Anhang I.7 (besondere Datenkategorien): Heilberufs-Daten ausgeschlossen — OK
- BRAND.md § 5.3: Voice darf keine „garantiert fehlerfrei"-Aussagen machen — OK, im Marketing eingehalten
- MARKETING.md: keine Heils-Versprechen — OK

### Empfehlungen
1. **Abs. 6 erweitern um AI-Act-Kennzeichnungs-Klarstellung:**
   > „(6) Der Anbieter ergaenzt die Website ab 02.08.2026 automatisch um den nach Art. 50 EU-AI-Act erforderlichen Hinweis, dass Texte unter Einsatz von KI-Systemen erstellt wurden. Der Kunde ist verpflichtet, diesen Hinweis zu belassen."
2. **Re-Generation-Trigger** (Branchenwechsel) sollte in § 5 oder § 4 explizit benannt sein — heute nur in `OPERATIONS.md` § 8

### Anwalts-Flags
- `[ANWALT-PRUEFUNG SPAETER]` Abs. 3 Haftungsausschluss vs § 879 Abs. 3 ABGB — „groebliche Benachteiligung" bei sehr fehlerhaften Generaten? (Verteidigungs-Linie: Pruefpflicht + Freigabe-Klick)
- `[ANWALT-PRUEFUNG SPAETER]` AI-Act Art. 50 — Wer haftet, wenn Footer-Hinweis fehlt? Aktuell impliziert AGB Anbieter-Pflicht, aber das ist nicht eindeutig.

### Status
**`[OK MIT MINOR-EMPFEHLUNGEN]`** — Abs. 6 zur AI-Act-Kennzeichnung ergaenzen vor Live.

---

## § 6 — Generierte Rechtstexte (Eigenklausel)

### Ist-Stand
- Abs. 1: automatisierte Generierung aus Kunden-Daten + Modulen
- Abs. 2: „Hilfestellung, ersetzen keine rechtliche Beratung"
- Abs. 3: Bei reglementierten Berufen + Art-9-Daten + Sonderpflichten: Pruefung durch fachkundige Stelle
- Abs. 4: DSE-Vorlage deckt nur Website-Besuch ab, nicht berufsspezifische Daten

### Plausibilitaets-Check
**OK:**
- Klare Abgrenzung „keine Rechtsberatung" — kein RAO-Verstoss
- Abs. 4 zentral wichtig: schliesst Patienten-/Mandanten-Daten-Verarbeitung explizit aus

**Schwachstellen — und das ist der wichtigste Punkt im gesamten Selbstcheck:**
- **MARKETING-AGB-DISKREPANZ-RISIKO:** Marketing kommuniziert „AT-Compliance integriert", „mit Impressum und Datenschutz", „Pflichtangaben automatisch" (BRAND.md § 7.0 About, § 7.3 Sub-Headlines). AGB § 6 Abs. 2 sagt „Hilfestellung, ersetzen keine rechtliche Beratung". Diese Spannung kann bei Streit als Irrefuehrung (§ 2 UWG) gelesen werden — „Kunde durfte sich auf Compliance verlassen, war aber Eigenverantwortung".
- Defensiv-Empfehlung: Marketing-Voice ist bereits konservativ kalibriert (siehe `feedback_keine_rechtliche_pflichten.md`: „rechtliche Pflichten" tabu in Marketing) — aber „AT-Compliance integriert" ist Grenzbereich. **Pruefen ob „AT-Compliance integriert" → „AT-Pflichtfelder vorausgefuellt" robuster ist.**

### Konsistenz
- DSE § 10.2 (Aktive Freigabe): konsistent mit AGB § 6 Abs. 2 (Pruefpflicht)
- AVV Anhang I.7 (besondere Datenkategorien NICHT umfasst): konsistent mit AGB § 6 Abs. 4
- BRAND.md § 8.1 Verbotene Begriffe + LIVE-COMPLIANCE § 15: „100 % rechtssicher" verboten — OK
- MARKETING.md: hat sich bereits an konservativer Linie ausgerichtet (Anti-Patterns § 5)

### Empfehlungen
1. **Marketing-Wording-Audit:** Pruefen, ob „AT-Compliance integriert" durch „AT-Pflichtfelder vorausgefuellt" oder „mit Impressum und Datenschutz" durchgaengig ersetzt werden sollte. Trade-off: Marketing-Wirkung vs UWG-Defensivitaet. **User-Entscheidung erforderlich.**
2. **Onboarding-Disclaimer-Modal** bei Branchenwahl reglementierter Beruf — sichtbarer Hinweis, dass Vorlage in dieser Branche besonders sorgfaeltige Pruefung verlangt. Bereits in `LIVE-COMPLIANCE.md` § 10.4 spec'd — sicherstellen, dass Live-Implementation das vor Generation triggert.
3. **Abs. 3 schaerfen:** „durch eine fachkundige Stelle" koennte praeziser sein — z.B. „durch einen Rechtsanwalt oder eine berufsstaendische Beratungsstelle (Kammer, Innung)". Verstaendlicher fuer Laien-KMU.

### Anwalts-Flags
- `[ANWALT-PRUEFUNG WICHTIG]` § 6 Abs. 2 vs. Marketing-Voice — § 2 UWG-Pruefung der Aussagen „AT-Compliance integriert" / „Pflichtangaben automatisch"
- `[ANWALT-PRUEFUNG SPAETER]` Abs. 4 Patienten-/Mandanten-Daten-Ausschluss als ausreichende Haftungsbegrenzung bei Heilberufs-Kunden?

### Status
**`[FLAG — MARKETING-AGB-PRUEFUNG VOR LIVE]`** — Marketing-Wording-Audit ist der erste Anwalts-Audit-Punkt nach Trigger-Schwelle (siehe `anwalt-briefing.md` Paket 1 + 5).

---

## § 7 — Bildrechte und Inhaltsfreigabe (Eigenklausel)

### Ist-Stand
- Abs. 1: Kunde garantiert Nutzungsrechte
- Abs. 2: Freistellung Anbieter von Drittansprueche
- Abs. 3: Anbieter darf bei begruendetem Hinweis Inhalte entfernen/sperren

### Plausibilitaets-Check
**OK:**
- Standard-B2B-Klausel — wirkt
- Abs. 3 ist Notice-and-Takedown-Mechanik (§ 16 ECG, DSA Art. 14)

**Schwachstellen:**
- KEIN Verweis auf abuse@instantpage.at-Prozess — Kunde weiss nicht, wie er selbst gegen Drittinhalte reklamieren wuerde
- KEINE Klausel zu AI-generierten Bildern (z.B. Stable Diffusion / GPT-4o): aktuell Plattform setzt nur eigene Foto-Uploads + Stockfotos via Unsplash ein → nicht akut. Aber Phase 2 (AI-Bilder im Generator) wuerde Klausel erfordern (Trainings-Daten-Risiken, Recht des „Trainings-Modells")

### Konsistenz
- LIVE-COMPLIANCE § 12.1 (Notice-and-Takedown): vollstaendiger Prozess dokumentiert — konsistent
- AVV Anhang I.6 (Bild-Daten): explizit als Datenkategorie mit Speicherort — konsistent
- DSE § 4 (Datenkategorien): „Bild-Daten" implizit in Plattform-Stammdaten — OK

### Empfehlungen
1. **Abs. 4 hinzufuegen:** „Hinweise auf Rechtsverletzungen sind an abuse@instantpage.at zu richten und werden gemaess Notice-and-Takedown-Verfahren (§ 16 ECG) bearbeitet."
2. **Phase-2-Flag (AI-Bilder):** Wenn Bild-Generierungs-Modul eingefuehrt wird, AGB-Anpassung mit Klausel zur Trainings-Daten-Verantwortlichkeit + Lizenz-Status.

### Anwalts-Flags
- `[ANWALT-PRUEFUNG SPAETER]` Abs. 2 Freistellungs-Klausel — Reichweite (auch Prozess-Kosten? Anwaltskosten?) explizit fassen

### Status
**`[OK MIT MINOR-EMPFEHLUNGEN]`** — Abs. 4 (abuse-Prozess) ergaenzen vor Live.

---

## § 8 — Verantwortlichkeit fuer die Website (Betreiber-Klausel)

### Ist-Stand
- Abs. 1: Kunde = Medieninhaber + Diensteanbieter + DSGVO-Verantwortlicher
- Abs. 2: Anbieter erbringt nur Hosting-/Generierungs-/Bereitstellungs-Leistungen (§ 16 ECG Provider-Privileg)
- Abs. 3: Endnutzer-Daten-Verarbeitung im Auftrag (AVV)

### Plausibilitaets-Check
**OK — beste Klausel im Set:**
- Klare Rollen-Trennung Medieninhaber / DSGVO-Verantwortlicher / Auftragsverarbeiter
- § 16 ECG-Provider-Privileg sauber referenziert
- AVV-Verweis konsistent

**Keine Schwachstellen identifiziert.**

### Konsistenz
- DSE § 1 + § 2: Verantwortlicher = Anbieter fuer Plattform-Verarbeitungen — OK
- AVV Cover + § 2: Verantwortlicher = Kunde fuer Endnutzer-Verarbeitungen — OK
- Pricing/Marketing: keine Aussagen, die Anbieter zum Medieninhaber machen wuerden — OK

### Empfehlungen
**Keine** — Klausel ist textuell sehr sauber.

### Anwalts-Flags
- `[ANWALT-PRUEFUNG SPAETER]` Klarstellung bei Custom-Domain (Kunde verwendet eigene Domain): aendert sich an Medieninhaber-Rolle nichts, sollte aber ggf. in einer Anmerkung explizit erwaehnt werden

### Status
**`[OK]`** — keine Aenderung empfohlen.

---

## § 9 Abs. 5 — Aktionsrabatte (Eigenklausel-Erweiterung 2026-05-15)

### Ist-Stand
- Aktionsrabatt nur im aktiv beworbenen Zeitraum
- Nach Ablauf: regulaerer Tarif, keine gesonderte Mitteilung
- Anbieter darf Aktion jederzeit beenden
- Bestandskunden: Rabatt fuer Restlaufzeit gesichert

### Plausibilitaets-Check
**OK:**
- Bestandskunden-Schutz „behalten Rabatt fuer Restlaufzeit" mildert UWG-Bedenken
- Klar formuliert, kein FOMO-Vibe

**Schwachstellen:**
- „ohne gesonderte Kuendigung oder Mitteilung": rechtlich zulaessig wenn im AGB transparent, aber **UX-Pflichtschuldigkeit**: eine 7-14-Tage-Erinnerungs-Mail vor Tarif-Wechsel ist nicht juristisch zwingend, aber stark empfehlenswert (Trust + Vermeidung „Dark-Pattern"-Vorwurf)
- Newcomer-Rabatt 20% = relevanter Preisunterschied (16 → 19.20 EUR oder 29 → 34.80 EUR) — aufmerksame Kunden werden den Sprung bemerken, weniger aufmerksame sich beschweren

### Konsistenz
- MARKETING.md § 3.1 Newcomer-Rabatt: konsistent (Coupon `NEWCOMER-20-FIRSTYEAR`, kein Cap, Inhaber-getriggertes Ende)
- BRAND.md § 7.4 CTA-Wording: keine Drueckersprache — OK
- email-templates/welcome.md: Trigger nach Freigabe-Klick OK; **Erinnerungs-Mail vor Rabatt-Ende fehlt noch als Template** — siehe Empfehlung
- Stripe-Coupon-Logik: `NEWCOMER-20-FIRSTYEAR` bei Newcomer aktiv, Ende nach 12 Monaten automatisch

### Empfehlungen
1. **Neues Email-Template:** `email-templates/aktionsrabatt-ende.md` — 14 Tage vor Ablauf, transparente Mitteilung „Ihr Newcomer-Rabatt endet am [DATUM], danach gilt [REGULAERER_PREIS]". Nicht im AGB verpflichtend, aber Trust-Hebel.
2. **AGB-Wording schaerfen:** „ohne gesonderte Mitteilung" durch „Der Anbieter informiert den Kunden 14 Tage vor Ablauf des Rabattzeitraums per E-Mail" ersetzen wuerde Anti-Dark-Pattern-Argument staerken — Trade-off: Anbieter ist dann auch dazu verpflichtet, was OPS-Aufwand bedeutet (aber via Stripe-Webhook + Resend automatisierbar). **`[OFFEN — User-Entscheidung]`** ob AGB-Wording umgeschrieben werden soll. Email-Template ist erstellt (siehe oben), der Versand kann faktisch erfolgen, AGB-Text bleibt aktuell „ohne gesonderte Mitteilung".
3. **Pricing-Page-Transparenz:** Rabatt-Mechanik klar darstellen — bisher unklar, ob auf Pricing-Page explizit „20% nur erstes Jahr" steht.

### Anwalts-Flags
- `[ANWALT-PRUEFUNG WICHTIG]` § 2 UWG: ist der „Nach Ablauf automatisch regulaerer Tarif" als „dark pattern" oder „intransparent" angreifbar? Bestaerkt durch Bestandskunden-Schutz + ggf. Erinnerungs-Mail wahrscheinlich nicht — aber expliziter Audit-Punkt in `anwalt-briefing.md` Paket 5.

### Status
**`[FLAG — ERINNERUNGS-MAIL VOR LIVE]`** — neues Email-Template `aktionsrabatt-ende.md` + ggf. AGB-Wording-Schaerfung.

---

## Quer-Themen — Konsistenz ueber alle Eigenklauseln

### Aktivitaetenprotokoll
AGB § 5 Abs. 5 (Freigabe-Klick), § 1.5 LIVE-COMPLIANCE (Aktivitaetenprotokoll), DSE § 8 (Auskunfts-Recht) + AVV Anhang IV.3 (Activity-Logs) alle verweisen auf das Aktivitaetenprotokoll. Architektur in `ARCHITECTURE.md` § 4.7 (`live_freigaben`-Tabelle) — **konsistent**.

### Reglementierte Berufe (mehrere § 5, § 6, § 10 LIVE-COMPLIANCE)
- AGB § 5 Abs. 4, § 6 Abs. 3, § 6 Abs. 4 — alle defensiv formuliert
- Onboarding-Disclaimer-Modal (LIVE-COMPLIANCE § 10.4) muss vor Generation triggern — Live-Implementations-Item
- Termin-Anfrage-no-Anliegen-Default (LIVE-COMPLIANCE § 10.3) — Live-Implementations-Item

### Anrede + Anrede-Override (AGB § 5 ↔ BRAND.md § 6 ↔ OPERATIONS § 8)
- Re-Generation bei Anrede-Wechsel — heute spec'd in OPERATIONS, NICHT in AGB. Sollte irgendwo als „Re-Generation-Trigger fuer Texte ist Anrede-/Branchenwechsel" expliziert sein. Aktuell impliziert.
- **Empfehlung:** AGB § 4 (Pflichten Kunde) Abs. 5 ergaenzen: „Wesentliche aenderungen an Stammdaten (Branche, Anrede) koennen eine Neu-Generation der Texte ausloesen. Der Anbieter weist im Portal vor dem Wechsel darauf hin."

---

## Zusammenfassung

| Klausel | Status | Top-Aktion vor Live |
|---|---|---|
| § 1 B2B-Beschraenkung | `[OK MIT MINOR-EMPFEHLUNGEN]` | UI-Hinweis-Box im Bestellprozess |
| § 5 KI-Inhalte | `[OK MIT MINOR-EMPFEHLUNGEN]` | Abs. 6 AI-Act-Kennzeichnung ergaenzen |
| § 6 Generierte Rechtstexte | **`[AUDIT-DRAFT 2026-05-16, User-Entscheidung offen]`** | Marketing-Wording-Audit in [`marketing-agb-audit.md`](marketing-agb-audit.md) — Option B (empfohlen): „integriert" → „vorausgefuellt"/„inkludiert" |
| § 7 Bildrechte | `[OK MIT MINOR-EMPFEHLUNGEN]` | Abs. 4 abuse-Prozess ergaenzen |
| § 8 Betreiber-Klausel | `[OK]` | keine Aenderung |
| § 9 Abs. 5 Aktionsrabatte | `[FLAG ERLEDIGT 2026-05-16]` | Email-Template [`aktionsrabatt-ende.md`](../email-templates/aktionsrabatt-ende.md) erstellt (14-Tage-Erinnerung vor Rabatt-Ende) |
| Quer: Re-Gen-Trigger | `[FLAG ERLEDIGT 2026-05-16]` | § 4 Abs. 5 ergaenzt (Re-Generation-Trigger bei Branchen-/Anrede-Wechsel mit Portal-Warnung) |
| § 16 Einrichtungs-Service (Plan-Portfolio-Erweiterung) | `[OK MIT MINOR-EMPFEHLUNG]` | Preis-Variable aus AGB rausziehen (siehe Nachtrag-Block) |
| § 17 Custom-Sites (Plan-Portfolio-Erweiterung) | **`[FLAG — 4 EMPFEHLUNGEN]`** | Form / Mitverantwortung / Preis-Variable / Source-Files (siehe Nachtrag-Block) |
| § 18 Whitelabel-Verweis (Plan-Portfolio-Erweiterung) | `[OK MIT MINOR-EMPFEHLUNG]` | Einzelvertrags-Zeitpunkt + Vorrang-Regel (siehe Nachtrag-Block) |

### Restrisiko-Einschaetzung
Vergleichbar mit `LIVE-COMPLIANCE.md` § 18 — ohne Anwalt vor Live etwa **20 % Restrisiko** in den Eigenklauseln. Hauptrisiko liegt in § 6 (Marketing-AGB-Diskrepanz), nicht in der AGB selbst — defensive Wording-Anpassung im Marketing reduziert das Risiko deutlich.

Versicherungs-Backstop (R+V Berufshaftpflicht 173 EUR/Jahr) deckt finanzielle Folgen einzelner Klausel-Probleme bis zu den Haftungsgrenzen — siehe `LIVE-COMPLIANCE.md` § 3.

### Anwalts-Audit-Trigger fuer dieses Memo
- 30+ zahlende Kunden (`LIVE-COMPLIANCE.md` § 18)
- Erste UWG- oder DSGVO-Abmahnung
- Aufnahme AI-Bilder-Generator (Phase 2)
- Aufnahme Patienten-/Mandanten-Daten-Modul

Die FLAG-markierten Punkte werden bei Anwalts-Audit als priorisierte Pruefliste uebergeben (vorbereitet in `anwalt-briefing.md` Paket 1 + 5).

---

## Nachtrag 2026-05-16 — Eigenklauseln §§ 16, 17, 18 (Plan-Portfolio-Erweiterung)

> **Status:** Selbstcheck-Pass durchgegangen 2026-05-16.

### § 16 — Einrichtungs-Service (Werkleistung, 149 EUR)

**Ist-Stand:**
- Abs. 1-3: Werkleistung, Leistungsumfang, Nicht-Bestandteile klar abgegrenzt
- Abs. 4: 149 EUR netto, Vorab-Zahlung via Stripe, Kleinunternehmer-Hinweis
- Abs. 5: Abnahme durch Freigabe-Klick = keine Erstattung
- Abs. 6: nur in Kombination mit Subscription, Trial gilt nur fuer Subscription-Teil
- Abs. 7: Verfuegbarkeit nach Terminvereinbarung

**Plausibilitaets-Check:**

✅ Werkleistungs-Definition sauber abgegrenzt von SaaS-Subscription
✅ Freigabe-Klick-Mechanik konsistent mit § 5 Abs. 5 (Aktivitaetsprotokoll)
✅ Trial-Mechanik-Bypass fuer Werkleistung B2B-zulaessig
✅ Verfuegbarkeit-Klausel schuetzt vor Volumen-Druck (keine harte SLA-Verpflichtung)

**Schwachstellen:**
- **Preis im AGB-Volltext (Abs. 4):** 149 EUR steht direkt im Klausel-Text — bei Preis-Aenderung muss AGB ueber § 14 (Anpassung) re-akzeptiert werden. Aufwaendig. **Empfehlung:** Klausel umformulieren auf „im jeweils aktiv beworbenen Preis (Pricing-Page)" + Hinweis dass der Preis im Bestellprozess transparent angezeigt wird. Reduziert AGB-Update-Pflicht.
- Form-Anforderung Terminvereinbarung nicht spezifiziert — derzeit „nach Terminvereinbarung" als Soft-Klausel. Bei E-Mail-only-Vereinbarung ok.

**Konsistenz:**
- DSE § 3.1: keine separate DSE-Behandlung des Setup-Service noetig (Daten = Plattform-Stammdaten)
- AVV: keine Anhang-IV-Aenderung
- BRAND.md § 7: Setup-Service-Karte als Pricing-Element konsistent zu Voice „Wir bauen Ihre Website"
- email-templates: aktionsrabatt-ende.md NICHT betroffen (Newcomer-Rabatt gilt nur fuer Subscription, nicht Setup-Service)

**Status:** **`[OK MIT MINOR-EMPFEHLUNG]`** — Preis-Variable aus AGB-Volltext rausziehen, Verweis auf Pricing-Page.

---

### § 17 — Custom-Sites Sonderleistungen (Werkvertrag, ab 990 EUR + 79 EUR/Mo)

**Ist-Stand:**
- Abs. 1: Werkvertrag §§ 1165 ff. ABGB
- Abs. 2: Einzelvereinbarung Preis ab 990 EUR + Umfang + Lieferzeit
- Abs. 3: schriftliche Abnahme vor Live-Schaltung, Audit-Trail
- Abs. 4: reglementierte Berufe — Kunden-Verantwortung
- Abs. 5 lit. a-d: Custom Hosting & Care 79 EUR/Mo Leistungsumfang (Infrastruktur, Monitoring, 1 Std Wartung kein Carry-over, Priority-Support 24h)
- Abs. 6: Nicht-inkludiert + 70 EUR/Std-Verrechnung
- Abs. 7: Custom-Site unter eigener Marke
- Abs. 8: Beendigung-Mechanik + keine Quelldateien-Pflicht

**Plausibilitaets-Check:**

✅ Werkvertrag-Verweis (§§ 1165 ff. ABGB) korrekt — Custom-Bau ist klassische Werkleistung
✅ Schriftliche Abnahme = B2B-konform durchsetzbar, E-Mail-Form reicht
✅ Custom-Site-Branding (Abs. 7) konsistent mit Brand-Strategie
✅ Hosting & Care 79 EUR/Mo mit Wartungs-Mechanik = Industry-Standard fuer Web-Agentur-Hosting
✅ 70 EUR/Std-Aufpreis fuer Mehrbedarf transparent

**Schwachstellen — drei davon mit Handlungs-Bedarf:**

1. **Abs. 2 Form-Anforderung fehlt:** „Einzelvereinbarung Preis und Umfang" — keine Form gefordert. **Empfehlung:** „schriftlich oder in Textform" ergaenzen, um muendliche Auftrags-Drift zu vermeiden.

2. **Abs. 4 reglementierte Berufe — Mitverantwortungs-Defensive duenn:** Wagner IT-Solutions ist als Bau-Leistender mitverantwortlich (§ 2 + § 16 UWG), wenn Custom-Site fuer einen Anwalt/Arzt UWG-relevante Werbung enthaelt. Abs. 4 schiebt die Verantwortung dem Kunden zu, schuetzt aber nicht vor Gehilfen-Haftung. **Empfehlung:** Zusatz „Der Anbieter erbringt keine berufsrechtliche Beratung; die Beurteilung der berufsrechtlichen Zulaessigkeit obliegt allein dem Kunden, gegebenenfalls unter Beiziehung einer fachkundigen Stelle (Kammer, Innung, Rechtsanwalt). Der Anbieter ist berechtigt, die Erstellung einer Custom-Site abzulehnen, wenn Anhaltspunkte fuer berufsrechtliche Verstoesse erkennbar werden." Gibt Wagner IT-Solutions ein Ablehnungs-Recht ohne Vertragsbruch.

3. **Abs. 5 lit. c — Wartungs-Carry-over:** „nicht in Anspruch genommene Stunden verfallen am Monatsende ohne Uebertragung in den Folgemonat" — koennte als „groebliche Benachteiligung" (§ 879 Abs. 3 ABGB) gelesen werden, wenn 12 Monate keine Wartung in Anspruch genommen wird und Kunde dann auf Anfrage „verbrauchte Stunden" geltend macht. **Verteidigungs-Linie:** Wartungs-Bereitschaft hat eigenen Wert (Infrastruktur-Vorhalt, Priority-Support-Slot), unabhaengig von tatsaechlicher Inanspruchnahme. **Empfehlung:** im OPS-Workflow aktiv kommunizieren — wenn Kunde 3 Monate keine Wartung nutzt, Mail „Sie haben dieses Quartal keine Wartung in Anspruch genommen — soll ich auf etwas blicken?" Reduziert Beschwerde-Risiko + zeigt Wert der Bereitschaft.

4. **Abs. 6 70-EUR-Stundensatz im AGB-Volltext:** wie bei § 16 Abs. 4 — Preis-Drift-Risiko. **Empfehlung:** „zum jeweils aktuellen Standard-Stundensatz des Anbieters, der dem Kunden vor Beauftragung mitgeteilt wird".

5. **Abs. 8 keine Quelldateien-Uebergabe** koennte als „ungewoehnliche Klausel" (§ 864a ABGB) angegriffen werden. Kunde der 990+ EUR fuer Custom-Bau zahlt erwartet emotional ggf. Source-Files. **Verteidigungs-Linie:** im AT-Werkvertrags-Recht gehen Source-Files nicht ohne explizite Vereinbarung an den Werkbesteller (analog Bauvertrag: Architekt liefert Bauwerk, nicht Plaene). **Empfehlung:** in jedem Custom-Site-Einzelvertrag explizit klarstellen — entweder „Source-Files bleiben Eigentum Anbieter" oder „Uebergabe auf Anfrage gegen Aufpreis X EUR". Anti-Drift in den OPS-Vorlagen.

**Konsistenz:**
- AVV Anhang IV: pro Custom-Site muss Annex erstellt werden (Datenkategorien individuell). Konsistent mit AVV § 1 Abs. 1 (Anhaenge als Bestandteil).
- DSE: keine generelle Aenderung, individuelle DSE pro Custom-Site (Kunden-eigene DSE auf der Custom-Site)
- BRAND.md § 5: Voice-Spannung — Custom-Sites = Wagner IT-Solutions als Agentur, nicht instantpage-Brand. AGB § 17 spricht „Anbieter" — formal korrekt, weil Wagner IT-Solutions e.U. der Vertragspartner ist. Brand-Trennung lebt im Marketing, nicht im AGB.

**Anwalts-Flags (zwei wichtige):**
- `[ANWALT-PRUEFUNG WICHTIG]` Abs. 4 Reglementierte-Berufe-Mitverantwortung — vor erstem Custom-Bau fuer Anwalt/Arzt/Apotheke Anwalts-Audit dringend
- `[ANWALT-PRUEFUNG WICHTIG]` Abs. 5 lit. c Wartungs-Carry-over — bei Trigger-Schwelle 30 zahlende Kunden formale Pruefung

**Status:** **`[FLAG — 4 EMPFEHLUNGEN VOR LIVE]`** — Abs. 2 (Form), Abs. 4 (Mitverantwortung), Abs. 6 (Preis-Variable), Abs. 8 (Source-Files-Klarstellung in OPS-Vorlage) ergaenzen.

---

### § 18 — Whitelabel-Agentur-Verweis (Subsidiaer-Klausel)

**Ist-Stand:**
- Whitelabel-Programme nur ueber Einzelvertrag
- Standard-AGB subsidiaer
- AVV-Drei-Parteien-Konstellation im Einzelvertrag

**Plausibilitaets-Check:**

✅ Pauschal-Verweis fuer Phase 1 OK (kein aktives Whitelabel-Geschaeft)
✅ AVV-Verweis korrekt — Drei-Parteien-Konstellation braucht explizite Einzelvertrags-Regelung

**Schwachstellen:**

1. **Wann muss der Einzelvertrag geschlossen werden?** Aktuell nicht im AGB klargestellt. **Empfehlung:** Zusatz „Der Einzelvertrag ist VOR Aktivierung der ersten Whitelabel-Site abzuschliessen. Ohne wirksamen Einzelvertrag und gesonderten AVV stehen Whitelabel-Funktionen nicht zur Verfuegung." Schliesst Lue Lue („wir aktivieren mal, Vertrag kommt spaeter").
2. **Wie verhaelt sich Standard-AGB zu Einzelvertrag bei Widerspruch?** Aktuell „subsidiaer". Klar genug, aber bei langen Einzelvertraegen kann „subsidiaer" zu Auslegungs-Streit fuehren. **Empfehlung:** „Bei Widersprueche zwischen Standard-AGB und Whitelabel-Einzelvertrag haben die Bestimmungen des Einzelvertrags Vorrang."

**Konsistenz:**
- ARCHITECTURE.md § 4: `agency_id`-Spalte vorbereitet, Phase-2-Aktivierung
- PRODUCT.md § 3.7: „Co-Branded Light"-Mechanik definiert, Pricing-Modell auf Anfrage
- AVV-Volltext: aktuell Zweiparteien-Konstruktion (Kunde-Anbieter), Whitelabel braucht Drei-Parteien-Annex — Phase-2-Spec

**Anwalts-Flag:**
- `[ANWALT-PRUEFUNG WICHTIG]` Vor erster Whitelabel-Aktivierung: Einzelvertrags-Muster + Drei-Parteien-AVV ist Anwalts-Pflicht (Pivot 2026-05-15 erlaubt Eigenarbeit nur fuer Standard-Themen, Whitelabel-Konstruktion ist juristisch komplex genug fuer 2-4h Anwalts-Zeit)

**Status:** **`[OK MIT MINOR-EMPFEHLUNGEN]`** — Zeitpunkt-Klarstellung + Vorrang-Regel ergaenzen.

---

### Zusammenfassung Nachtrag

| Klausel | Status | Top-Aktion vor Live |
|---|---|---|
| § 16 Einrichtungs-Service | `[OK MIT MINOR-EMPFEHLUNG]` | Preis-Variable aus AGB-Volltext rausziehen |
| § 17 Custom-Sites | **`[FLAG — 4 EMPFEHLUNGEN]`** | Abs. 2 Form / Abs. 4 Mitverantwortung / Abs. 6 Preis-Variable / Abs. 8 Source-Files-OPS |
| § 18 Whitelabel-Verweis | `[OK MIT MINOR-EMPFEHLUNG]` | Einzelvertrags-Zeitpunkt + Vorrang-Regel |

### Restrisiko-Update

Vergleichbar mit `LIVE-COMPLIANCE.md` § 18 — ohne Anwalt vor Live etwa **20-25 % Restrisiko** in den Eigenklauseln. Plan-Portfolio-Erweiterung erhoeht das Risiko leicht (3 neue Klauseln), aber Werkvertrag-Pattern ist gut etabliert.

**Wichtigste neue Anwalts-Audit-Trigger:**
- Erster Custom-Site-Auftrag fuer reglementierten Beruf (Anwalt/Arzt/Apotheke)
- Erste Whitelabel-Aktivierung (Einzelvertrags-Muster + Drei-Parteien-AVV)
- 30+ zahlende Kunden (Standard-Trigger fuer Gesamt-Audit)

---

## Aenderungs-Log

| Datum | aenderung | Autor |
|---|---|---|
| 2026-05-16 | Erstdraft Selbstcheck-Pass durch 6 Eigenklauseln + Quer-Themen | Eigenarbeit |
| 2026-05-16 | Nachtrag-Block fuer neue Klauseln §§ 16, 17, 18 (Plan-Portfolio-Erweiterung, Selbstcheck ausstehend) | Eigenarbeit |
