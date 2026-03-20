# SiteReady.at - Projekt-Briefing

> Dieses Dokument ist die zentrale Referenz fuer den aktuellen Projektstand.
> Lies es IMMER zuerst, bevor du am Code arbeitest.
> Letzte Aktualisierung: 20. Maerz 2026

---

## 1. Was ist SiteReady?

SiteReady.at ist ein vollautomatischer Website-Service fuer Einzelunternehmer und Kleinstbetriebe in Oesterreich. Der Kunde beantwortet einen kurzen Fragebogen und erhaelt eine fertige, SEO-optimierte Mini-Website - inklusive Impressum (ECG) und DSGVO-Erklaerung.

**Kernversprechen:** Kein Builder. Kein Chat. Keine Entscheidungen. Nur 10 Fragen - fertig.

Es ist KEIN Website-Builder - es ist ein Website-Service. Der Nutzer trifft keine Design-Entscheidungen, er beantwortet nur Fragen.

**Wichtig fuer die Aussenkommunikation:** Keine Erwaehnung von KI, Tools oder Technologie-Stack gegenueber Endkunden. Der Service wirkt als Black Box - Eingabe rein, fertige Website raus.

---

## 2. Zielgruppe

**Primaer (MVP):** Handwerker in Oesterreich
- Elektriker, Installateure, Maler, Tischler, Fliesenleger, etc.
- Werden aktiv lokal auf Google gesucht ("Elektriker Wien 1020")
- Website-Inhalt einfach und vorhersehbar: Leistungen, Oeffnungszeiten, Kontakt, Notdienst
- Marktgroesse: ca. 120.000 aktive Gewerbebetriebe im Handwerk in Oesterreich

**Sekundaer (ab Phase 2):** Kosmetik, Coaches, Aerzte

---

## 3. Aktueller Stand des Prototyps

### Technologie
- **Framework:** React (Create React App) - Produktionsziel ist Nuxt.js, Prototyp laeuft auf React
- **Deployment:** Cloudflare Pages via GitHub Repo
- **Repo:** github.com/alexanderwagnerits/SiteReadyPrototype
- **Alles in einer Datei:** src/App.js (gesamte App)

### Projektstruktur
```
/
+-- package.json
+-- BRIEFING.md          (dieses Dokument)
+-- CLAUDE.md            (automatischer Kontext fuer Claude Code)
+-- public/
|   +-- index.html
|   +-- logo.png         (SiteReady Logo - Wortmarke)
|   +-- icon.png         (SiteReady Icon - SR Monogramm)
+-- src/
|   +-- index.js         (React Root)
|   +-- App.js           (GESAMTE APP)
+-- docs/                (Konzeptdokumente)
```

### App-Architektur (in App.js)

Die App hat 3 Screens, gesteuert durch State (page):

1. **LandingPage** (page === "landing")
   - Bitpanda-inspiriertes Premium-Design, heller Hintergrund
   - Split-Hero: Text links, Browser-Mockup rechts
   - Sektionen: Hero, Problem, How-it-works (5 Schritte), Design-Varianten, Pricing, Vergleich, Why-Now, CTA
   - Vollstaendig responsive (CSS Media Queries, Breakpoints 960px + 560px)
   - Button "Jetzt starten" -> page = "form"

2. **Questionnaire** (page === "form")
   - Links: Formular-Panel mit Schritt 0 (Website-Import) + Steps 1-4
   - Rechts: Live-Preview der generierten Kunden-Website
   - Mobile: Toggle zwischen Formular und Vorschau
   - Button "Website erstellen" -> page = "success"
   - Button "Zurueck" -> page = "landing"

3. **SuccessPage** (page === "success")
   - Bestelluebersicht VOR der Bezahlung (nicht nach)
   - Zeigt was im Paket enthalten ist + Preis + Kaufbutton (im Prototyp deaktiviert)
   - Self-Service-Portal Sektion mit optionalen Features nach dem Kauf
   - Passt auf einen Screen ohne Scrollen (height: 100vh)

---

## 4. Fragebogen-Flow (UMGESETZT)

### Schritt 0: Website-Import (optionaler Vorschritt - UMGESETZT)

Vor dem eigentlichen Fragebogen wird der Kunde gefragt:

**"Haben Sie schon eine Website, von der wir Ihre Informationen abrufen koennen?"**

- **Ja:** Kunde gibt URL ein. System extrahiert Daten und befuellt Formularfelder automatisch vor.
- **Nein / Ueberspringen:** Button "Ohne Import starten" -> normaler Fragebogen mit leeren Feldern.

**Wichtig:**
- Das ist KEIN separater Weg - optionaler Vorschritt der den normalen Fragebogen vorausfuellt
- Im Prototyp wird die Extraktion simuliert (setTimeout 2s, befuellt mit Elektriker-Beispieldaten)
- Der Kunde kann alle vorausgefuellten Felder frei aendern/korrigieren

### Schritt 1: Grunddaten
- Firmenname
- Branche (Dropdown mit 15 Handwerksbranchen)
- Kurzbeschreibung (optional, 2-3 Saetze)
- Bundesland

### Schritt 2: Leistungen
- Branchenspezifische Leistungen als Checklist
- Zusaetzliche Leistung (Freitext, optional)
- 24h Notdienst Toggle

### Schritt 3: Kontakt
- Strasse & Hausnummer
- PLZ + Ort
- Telefon + E-Mail
- UID-Nummer (fuer Impressum)
- Oeffnungszeiten (Dropdown + Custom)

### Schritt 4: Design
- Stilauswahl: "Wie soll Ihr Betrieb wirken?"
- 3 Varianten: Professionell, Modern, Bodenstaendig
- Wird pro Branche automatisch vorgeschlagen
- **Fotos-Toggle:** "Moechten Sie eigene Fotos auf Ihrer Website?" (UMGESETZT)
  - OFF: Keine Foto-Platzhalter in der Preview
  - ON: Hero-Foto, 2er-Galerie und Teamfoto als Platzhalter in der Preview sichtbar
- **Self-Service-Portal Hinweis:** Info-Box nach dem Toggle erklaert was nach dem Kauf selbst gemacht werden kann

---

## 5. Bilder-Konzept (UMGESETZT im Prototyp)

### Grundprinzip
Die Kunden-Website verwendet branchenspezifische **Stock-Fotos als Platzhalter**. Der Kunde kann nach der Bezahlung im Self-Service-Portal eigene Bilder hochladen.

### Foto-Toggle (Schritt 4)
- Kunde entscheidet ob er Fotos auf der Website haben moechte
- Preview zeigt/versteckt Platzhalter in Echtzeit basierend auf Toggle-Status
- Platzhalter passen sich dem gewaehlten Design-Stil an (Farben aus STYLES_MAP)

### Platzhalter-Positionen in der Preview
1. **Hero-Foto:** Rechts im Hero-Bereich (nur Desktop-Preview, nicht compact)
2. **2er-Galerie:** Zwischen Leistungen und Ueber-uns Sektion
3. **Teamfoto:** In der Ueber-uns Sektion (nur Desktop-Preview)

### Self-Service-Portal (nach Kauf - optional)
- Logo hochladen
- Eigene Fotos hochladen (ersetzt Platzhalter)
- Daten jederzeit anpassen (Adresse, Telefon, Leistungen)
- Custom Domain verbinden

---

## 6. Geschaeftsmodell

### Pricing (ENTSCHIEDEN: Variante A)
Variante B (Setup + Abo) wurde verworfen. Im MVP gilt:

| | SiteReady |
|---|---|
| Setup | Keine |
| Monatspreis | EUR 18 |
| Mindestlaufzeit | 12 Monate |
| 1. Jahr | EUR 216 |
| Ab 2. Jahr | EUR 216 |

Auf der Landingpage wird zusaetzlich eine **"SiteReady Premium" Coming-Soon-Card** gezeigt mit Phase-2-Features (Mehrsprachigkeit, Social Media, Kalender/Buchung, erweiterte Analytics). Kein Preis angegeben, Button deaktiviert.

### Leistungsumfang (alles inklusive)
- Subdomain (firmenname.siteready.at) sofort live
- Kein Branding auf der Kunden-Website
- Impressum (ECG) - anwaltlich geprueft
- DSGVO-Erklaerung - anwaltlich geprueft
- SEO Meta-Tags + Schema.org Markup
- Google Search Console Indexierung
- Google Maps Einbettung
- Notdienst/24h Badge
- Analytics-Dashboard
- Live-Vorschau vor Bezahlung
- 3 automatische Design-Varianten
- Branchenspezifische Fotos als Platzhalter (wenn Fotos-Toggle aktiv)
- Website-Import (optionaler Vorschritt im Fragebogen)

### Produktions-Flow
1. Fragebogen (optional: Website-Import als Vorschritt)
2. Stilauswahl + Fotos-Toggle + Live-Vorschau (rein clientseitig, keine Kosten)
3. Bestelluebersicht (SuccessPage) - Kunde sieht Paket + Preis vor Bezahlung
4. Bezahlung (Karte, EPS, PayPal)
5. Account-Erstellung
6. Design-Template laden
7. Texte automatisch generieren - ERST NACH BEZAHLUNG
8. Rechtstexte (anwaltl. gepruefte Vorlagen + Kundendaten)
9. Stock-Fotos zuweisen (branchenspezifisch, wenn Fotos aktiv)
10. Speicherung (EU-Server)
11. Hosting + SSL
12. Google-Indexierung automatisch
13. Website online (firmenname.siteready.at)

---

## 7. Tech-Stack (Ziel-Architektur)

| Komponente | Technologie |
|---|---|
| Frontend | Nuxt.js (Ziel), aktuell React-Prototyp |
| Datenbank & Auth | Supabase (PostgreSQL, EU-Server Frankfurt) |
| Bezahlung | Stripe (EPS, Karte, PayPal) |
| Text-Generierung | Intern - nicht kommunizieren |
| Hosting & CDN | Cloudflare Pages |
| Indexierung | Google Search Console API |
| Stock-Fotos | Unsplash API oder eigene Sammlung (zu evaluieren) |

**Hinweis:** Der Tech-Stack ist intern. Gegenueber Endkunden werden keine Tool- oder Technologie-Namen kommuniziert.

---

## 8. Design-System

### SiteReady UI (Landing, Fragebogen-Shell, Success)
- Helles Premium-Theme (NICHT Dark) - inspiriert an Bitpanda-Stil
- Font: DM Sans (Primaer), JetBrains Mono (Zahlen/Code)
- Split-Layouts statt zentrierter Bloecke
- Kein Dot-Grid, keine Glow-Animationen
- Subtile float-Animation nur bei Badges
- Responsive: CSS Media Queries in `css` Konstante
  - Breakpoint 960px: Grids stapeln, Nav-Links ausblenden, Mockup ausblenden
  - Breakpoint 560px: Noch kompakteres Layout, Stats ausblenden
- CSS-Klassen-Konvention: `lp-*` fuer LandingPage, `sp-*` fuer SuccessPage

### LandingPage-Sektionen
- **Hero:** 2-Spalten (Text links, Browser-Mockup rechts), Klasse `lp-hero-grid`
- **Problem:** 2-Spalten (4 Problem-Karten links, Loesung rechts), Klasse `lp-problem-grid`
- **So funktioniert's:** 5 Schritte (Fragebogen, Vorschau, Bezahlen, Live, Portal optional), Klasse `lp-steps-grid`
- **Design-Varianten:** 3-Spalten, Klasse `lp-variants-grid`
- **Pricing:** 2-Spalten (Aktuelles Angebot + Coming Soon Premium), Klasse `lp-pricing-grid`
- **Vergleich:** Tabelle mit overflow-x scroll auf Mobile, Klasse `lp-compare`
- **Warum jetzt:** 3-Spalten, Klasse `lp-why-grid`

### Kunden-Website-Preview (NICHT aendern ohne Absprache)
- Hat eigenes, unabhaengiges Design-System (STYLES_MAP)
- 3 Varianten: Professional (Blau), Modern (Gruen), Traditional (Warm)
- Jede Variante hat eigene Farben, Fonts, Border-Radii
- Foto-Platzhalter passen sich dem jeweiligen Stil an

---

## 9. Was NICHT im MVP ist

Folgendes ist auf Phase 2 oder spaeter verschoben:
- Self-Service-Portal als eigene App (MVP: nur als Hinweis kommuniziert)
- Custom Domain (nur Subdomain im MVP - aber im Portal ankuendigen)
- Gestaffelte Pakete (nur SiteReady Standard im MVP)
- Mehrsprachigkeit
- Weitere Branchen-Templates
- Social Media Paket
- Kalender-Buchung, Newsletter
- Expansion nach DE/CH
- Echte KI-basierte Website-Extraktion (im Prototyp simuliert)
- Echte Stock-Foto-Integration (im Prototyp Platzhalter)

**Leitprinzip:** Jedes Feature wird nur aufgenommen, wenn es vollautomatisch funktioniert und keinen zusaetzlichen Support erfordert.

---

## 10. Bekannte Probleme / Technische Schulden

1. Gesamte App in einer Datei (App.js) - sollte in Komponenten aufgeteilt werden
2. React statt Nuxt.js - Prototyp laeuft auf CRA, Ziel ist Nuxt.js
3. Keine Umlaute im JS-Code - wegen Build-Problemen ae/oe/ue verwenden
4. Inline Styles gemischt mit CSS-Klassen (Media Queries) - kein CSS-Framework
5. Kein State Management - einfacher useState
6. Keine Tests
7. SuccessPage nicht vollstaendig responsive (height:100vh kann auf kleinen Screens problematisch sein)

---

## 11. Offene Fragen

### Business
- Endgueltige Preisstruktur nach Pilotphase
- Kuendigungshandling nach 12 Monaten
- Support-Modell (E-Mail, 48h Antwortzeit)
- Zeitplan fuer Self-Service-Portal (Phase 2)

### Technik
- Laufende Wartung, Updates, Sicherheitsluecken
- Qualitaetssicherung der generierten Texte
- Stock-Foto-Quelle (Unsplash API vs. eigene Sammlung vs. generiert)
- Website-Import: Welche Technologie fuer Extraktion? (Scraping, API, automatisch)

### Rechtlich
- Impressum/DSGVO-Templates mit Anwalt erarbeiten
- Haftungsrahmen in AGB
- Lizenzierung der Stock-Fotos klaeren

---

## 12. Go-to-Market

1. Pilotphase: 10-20 Kunden aus persoenlichem Netzwerk
2. Skalierung auf 100: Kaltakquise, Kooperationen (WKO), digitale Kampagnen
3. Foerderungen: aws, WKO, EU-Fonds (EFRE)

---

## 13. Naechste Schritte (Prototyp)

1. ~~Website-Import Vorschritt im Fragebogen einbauen (Schritt 0)~~ ERLEDIGT
2. ~~Bild-Platzhalter in der Preview-Komponente einbauen~~ ERLEDIGT
3. ~~Landingpage aktualisieren (neue Features, Bitpanda-Design)~~ ERLEDIGT
4. ~~Pricing auf Variante A reduzieren + Coming Soon Card~~ ERLEDIGT
5. ~~SuccessPage als Bestelluebersicht vor Bezahlung umbauen~~ ERLEDIGT
6. ~~Responsive Design umsetzen~~ ERLEDIGT
7. MVP mit echten Testbetrieben validieren
8. Bezahlung (Stripe) integrieren
9. Echte Text-Generierung nach Bezahlung implementieren
10. Self-Service-Portal (Phase 2) planen

---

## 14. Referenz-Dokumente

- SiteReady_Pitch_v9.docx - Aktuelles Pitch-Dokument
- SiteReady_Architektur.pdf - Technischer Architektur-Flow
- SiteReady_Logos.zip - Logo-Assets

---

*Bei Widerspruechen zwischen diesem Dokument und dem Code gilt dieses Dokument als aktueller Stand der Planung. Der Code muss entsprechend angepasst werden.*
