# SiteReady Prototyp - Projekt-Anweisungen

Fuer den vollstaendigen Projektkontext: Die Dokumentation ist im Admin-Portal unter
https://sitereadyprototype.pages.dev/admin?key=... → Tab "Dokumentation".
Sie kann auch direkt per API abgerufen werden:
GET https://brulvtqeazkgcxkimdve.supabase.co/rest/v1/docs?select=content
Header: apikey: sb_publishable_u1yaQuqOp0qNhJHdiOU7Tw_hzTr0-MG

## Regeln

- Keine Umlaute im Code (Variablen, Funktionen, Keys).
In deutschen UI-Texten und Kommentaren sind Umlaute
(ä, ö, ü, ß) erlaubt und erwuenscht.
- Immer npm run build testen bevor du committest
- Design-Tokens sind in der T-Variable in App.js definiert
- Das SiteReady-UI (Landing, Fragebogen, Success) hat ein helles Premium-Theme
- DM Sans als Primaer-Font, JetBrains Mono fuer Zahlen
- Jedes Design muss responsive sein
- Keine Emojis auf der Kunden-Website (Templates, Preview)

## Template-System

Claude generiert NUR Texte (JSON), nicht HTML. Feste HTML/CSS-Templates werden befuellt.

### 4 Design-Stile
- **klassisch**: Navy #0f2b5b, Inter, 4px radius, border-left Cards
- **modern**: Indigo #6366f1, Plus Jakarta Sans, 12px radius, 100px pill buttons, shadow Cards
- **elegant**: Anthrazit #292524, Inter, 2px radius, thin-border Cards, font-weight 300
- **custom**: User-Farbe + Font (20 Google Fonts), 8px radius

### Unified Template (template.js)
Ein einziges Template fuer alle Stile. Der Stil wird per CSS-Klasse am `<body>` gesteuert:
```
<body class="stil-modern">
```
Stil-Wechsel ist serve-time (kein Re-Generate noetig).

### 3 Layouts
- **standard**: Bewaehrter Aufbau mit allen Basis-Sections
- **kompakt**: Weniger Text, kompakte Leistungen, kein Ablauf
- **ausfuehrlich**: FAQ, Zahlen & Fakten, CTA-Block, vertikaler Ablauf

Layout wird per `o.layout` Feld gesteuert und serve-time angewendet.

### Placeholder-System
- HTML-Kommentare: `<!-- NAV -->`, `<!-- FOOTER -->`, `<!-- LEISTUNGEN -->`, `<!-- MAPS -->` etc.
- Neue Section-Placeholders: `<!-- FAQ -->`, `<!-- GALERIE -->`, `<!-- FAKTEN -->`, `<!-- CTA_BLOCK -->`, `<!-- PARTNER -->`
- Doppel-Klammern: `{{FIRMENNAME}}`, `{{TEL_DISPLAY}}`, `{{UEBER_UNS_TEXT}}` etc.
- Serve-time Ersetzung in index.js

## Was NICHT geaendert werden darf ohne Absprache

- Die 4 Stil-Varianten (Klassisch/Modern/Elegant/Custom) und ihre Farbpaletten
- Die Datenstruktur von BRANCHEN, STYLES_MAP, INIT
- Die Placeholder-Struktur in den Templates (<!-- NAV --> etc.)

## Wichtige Dateien

### Frontend
- src/App.js - Gesamte App (Landing, Fragebogen, Preview, Success)
- public/logo.png - SiteReady Logo (Wortmarke)
- public/icon.png - SiteReady Icon (SR Monogramm)

### Template (Kunden-Website)
- functions/templates/template.js - Unified Template (alle 3 Stile per CSS-Klasse)

### Backend (Cloudflare Functions)
- functions/api/generate-website.js - Text-Generierung + Template-Befuellung + Nav/Footer Builder
- functions/s/[subdomain]/index.js - Serve-time Injections (Fotos, Maps, Cards, Formular)
- functions/s/[subdomain]/legal.js - Legal-Seiten Shell (nutzt gleiche Nav/Footer wie Hauptseite)
- functions/s/[subdomain]/impressum.js - Impressum Endpoint
- functions/s/[subdomain]/datenschutz.js - Datenschutz Endpoint
