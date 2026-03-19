# SiteReady.at – Prototyp

Fragebogen mit Live-Vorschau für den SiteReady Website-Generator.

## Lokal starten

```bash
npm install
npm run dev
```

Öffne http://localhost:3000

## Auf Cloudflare Pages deployen

### Schritt 1: Repository auf GitHub erstellen

1. Gehe auf https://github.com/new
2. Repository-Name: `siteready-prototype`
3. Visibility: **Private** (oder Public, wie du willst)
4. Klicke auf "Create repository"

### Schritt 2: Code hochladen

Im Terminal (im Projektordner):

```bash
git init
git add .
git commit -m "Initial prototype"
git branch -M main
git remote add origin https://github.com/DEIN_USERNAME/siteready-prototype.git
git push -u origin main
```

### Schritt 3: Cloudflare Pages verbinden

1. Gehe auf https://dash.cloudflare.com → **Workers & Pages** → **Create**
2. Wähle **Pages** → **Connect to Git**
3. Verbinde deinen GitHub-Account (falls noch nicht geschehen)
4. Wähle das Repository `siteready-prototype`
5. Build-Einstellungen:
   - **Framework preset**: Create React App
   - **Build command**: `npm run build`
   - **Build output directory**: `build`
6. Klicke auf **Save and Deploy**

Nach ca. 1–2 Minuten ist dein Prototyp live unter:
`siteready-prototype.pages.dev`

### Schritt 4 (optional): Custom Domain

Wenn du willst, kannst du unter Cloudflare Pages → Custom Domains
z.B. `prototyp.siteready.at` hinzufügen.

## Was ist das?

Ein interaktiver Prototyp des SiteReady-Fragebogens mit Live-Website-Vorschau.
Drei Design-Varianten (Professionell, Modern, Bodenständig), Echtzeit-Aktualisierung
der Vorschau während der Eingabe. Kein Backend, keine Datenbank – rein clientseitig.
