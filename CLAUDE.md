# SiteReady Prototyp - Projekt-Anweisungen

Lies IMMER zuerst docs/BRIEFING.md fuer den vollstaendigen Projektkontext.

## Regeln

- Keine Umlaute und keine Sonderzeichen im JavaScript-Code (ae/oe/ue/ss statt Umlaute, ASCII only in Strings)
- Immer npm run build testen bevor du committest
- Design-Tokens sind in der T-Variable in App.js definiert
- Das SiteReady-UI (Landing, Fragebogen, Success) hat ein helles Premium-Theme
- DM Sans als Primaer-Font, JetBrains Mono fuer Zahlen

## Was NICHT geaendert werden darf ohne Absprache

- Die Preview-Komponente (Kunden-Website-Vorschau) hat ein eigenes Design-System (STYLES_MAP)
- Die 3 Stil-Varianten (Professional/Modern/Traditional) und ihre Farbpaletten
- Die Datenstruktur von BRANCHEN, STYLES_MAP, INIT

## Aktuelle Aufgaben (aus BRIEFING.md Abschnitt 13)

1. Website-Import als optionalen Vorschritt (Schritt 0) im Fragebogen einbauen
2. Bild-Platzhalter in der Preview-Komponente einbauen (Header, Galerie, Team)
3. Landingpage aktualisieren (neue Features erwaehnen)

## Wichtige Dateien

- docs/BRIEFING.md - Vollstaendiges Projekt-Briefing mit Konzept, Flow, Design-Entscheidungen
- src/App.js - Gesamte App (Landing, Fragebogen, Preview, Success)
- public/logo.png - SiteReady Logo (Wortmarke)
- public/icon.png - SiteReady Icon (SR Monogramm)
