# SiteReady Prototyp - Projekt-Anweisungen

Fuer den vollstaendigen Projektkontext: Die Dokumentation ist im Admin-Portal unter
https://sitereadyprototype.pages.dev/admin?key=... → Tab "Dokumentation".
Sie kann auch direkt per API abgerufen werden:
GET https://brulvtqeazkgcxkimdve.supabase.co/rest/v1/docs?select=content
Header: apikey: sb_publishable_u1yaQuqOp0qNhJHdiOU7Tw_hzTr0-MG

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

## Wichtige Dateien

- src/App.js - Gesamte App (Landing, Fragebogen, Preview, Success)
- public/logo.png - SiteReady Logo (Wortmarke)
- public/icon.png - SiteReady Icon (SR Monogramm)
