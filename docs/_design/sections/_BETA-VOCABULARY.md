# Beta-Vocabulary — Section-CSS-Klassen-Referenz

> **Stand:** 2026-05-12
> **Quelle der Wahrheit:** [`functions/templates/template.js`](../../../functions/templates/template.js) — Live-Beta-Template
> **Zweck:** Kompakte Referenz aller Beta-Section-Klassen mit HTML-Snippets + Stil-Overrides + Wann-nutzen. Jedes neue Recipe komponiert aus diesem Vokabular.

---

## Lese-Regeln

- **Verbindlich:** Klassen-Namen, Strukturen, responsive Breakpoints
- **Anpassbar:** Inline-Content (Text, Bilder, Links) — nicht die Klassen-Hierarchie
- **Stil-Klassen-Overrides** werden ueber `body.stil-klassisch / .stil-modern / .stil-elegant` angewandt — Section-Author muss nichts ueberschreiben
- Neue Klassen erfinden = **TABU**. Komposition statt Erfindung. Bei echter Luecke: Beta-Template erweitern, nicht inline-Override im Recipe

---

## Gemeinsame Section-Header-Klassen

Alle Sections nutzen dieselbe Header-Struktur:

```html
<div class="leist-head fade-up">  <!-- oder .ablauf-head, .bew-head, .faq-head, .kontakt-head, .galerie-head -->
  <div class="s-label">SCHWERPUNKTE</div>             <!-- oder .leist-label (alt-Variante) -->
  <h2 class="s-h2">Section-Headline.</h2>
  <p class="s-intro">Optionaler Intro-Text, max 540px breit.</p>
</div>
```

**CSS:**
- `.s-label` — Eyebrow, accent-color, uppercase, .72rem, letter-spacing .08em
- `.s-h2` — clamp(1.5rem, 3vw, 2.2rem), font-weight 800, primary-color
- `.s-intro` — .95rem, muted, max-width 540px

**Stil-Modern Overrides:**
- `.s-label` als pill mit `color-mix(accent 8%, transparent)` BG + border-radius 100px
- `.s-h2` clamp(2rem, 4.5vw, 3rem) — groesser

**Stil-Elegant Overrides:**
- `.s-label` font-weight 500, letter-spacing .14em (weiter)
- `.s-h2` clamp(1.8rem, 4vw, 2.8rem), font-weight 500, letter-spacing -.02em

---

## 1. Trust-Bar (`.trust`) — optional

Schmaler Streifen direkt nach Hero, BG=var(--bg), border-bottom. Zeigt Vertrauens-Signale (Mitgliedschaften, Zertifikate, Standorte).

```html
<section class="trust">
  <div class="w">
    <div class="trust-items">
      <div class="trust-item"><svg>...</svg><span>WKO-Mitglied</span></div>
      <div class="trust-item"><svg>...</svg><span>Seit 1998</span></div>
    </div>
  </div>
</section>
```

**Stil-Modern:** Pill-Karten mit Schatten (`background:#fff`, padding 8px 16px, border-radius 100px).
**Stil-Elegant:** Minimal, font-weight 500, .78rem, svg-opacity .7.

**Mobile:** Auto-wrap via `flex-wrap`.

**Alt-Variante: `.hero-trust-bar`** — innerhalb Hero statt eigene Section. Siehe [`hero.md`](hero.md).

**Wann nutzen:** wenn nicht im Hero integriert + Branche hat sichtbare Trust-Signale (Reglementierung, Mitgliedschaften).

---

## 2. Hero (`.hero`)

→ **Detail-Spec in [`hero.md`](hero.md)**. Hier nur Kurz-Referenz:

```html
<section class="hero sr-grain" id="sr-hero">
  <div class="hero-inner">
    <p class="hero-sub has-firma">...</p>
    <h1>...</h1>
    <span class="hero-accent-line"></span>     <!-- nur bei .stil-elegant sichtbar -->
    <p class="hero-desc">...</p>
    <div class="hero-btns">...</div>
    <div class="hero-trust">...</div>           <!-- optional Trust innerhalb Hero -->
  </div>
</section>
```

- **Material-Branchen** (Handwerk, Gastro, Tourismus, Agrar): Hero-BG-Photo via inline-style-Override (siehe Tischler-Mockup [`mockup-recipe-handwerk-werkstatt.html`](../../../public/mockup-recipe-handwerk-werkstatt.html) Zeile 741)
- **Text-Branchen** (Anwalt, Berater, Coach): Color-Hero ohne Foto (Default)

---

## 3. Leistungen (`.leist`)

**Zwei Varianten** — Recipe waehlt eine, abhaengig davon ob Branche Foto-Material pro Leistung hat:

### 3a. `.leist-list` — alternierend mit Foto

Fuer Branchen mit Foto-Material pro Leistung (Handwerk, Gastro, Agrar). Wechselt Foto-links/-rechts pro Item.

```html
<section class="leist" id="leistungen">
  <div class="w">
    <div class="leist-head fade-up">
      <div class="leist-label">Leistungen</div>
      <h2>Was wir tun</h2>
      <p class="leist-intro">...</p>
    </div>
    <div class="leist-list">
      <article class="leist-item fade-up">
        <div class="leist-item-img" style="background-image:url('...');background-size:cover;background-position:center"></div>
        <div class="leist-item-text">
          <h3>Leistung-Titel</h3>
          <p>Beschreibung 30-80 Worte.</p>
          <div class="leist-item-meta">
            <span>Detail-Info</span>
            <span class="leist-item-price">ab € 2.400</span>
          </div>
          <a href="#kontakt" class="leist-item-link">Anfrage senden →</a>
        </div>
      </article>
      <!-- weitere .leist-item — gerade Items haben automatisch direction:rtl (Bild rechts) -->
    </div>
  </div>
</section>
```

**CSS-Mechanismus:** `:nth-child(even)` setzt `direction:rtl` → Foto switcht rechts/links automatisch.

**Mobile:** `grid-template-columns:1fr!important` → vertikal gestapelt, direction:ltr.

### 3b. `.leist-more` — kompakt 3-Card-Grid

Fuer Branchen ohne Foto-Material pro Leistung (Anwalt, Berater, Coach). Ueber `.leist-more-item` Cards mit BG=var(--bg).

```html
<div class="leist-more">
  <div class="leist-more-item sr-fade">
    <h4>Leistung-Titel</h4>
    <p>Beschreibung 30-80 Worte.</p>
  </div>
  <!-- weitere ... -->
</div>
```

**Stil-Modern:** Cards mit border-radius 16px + shadow.
**Stil-Elegant:** Cards transparent + 1px-border + hover→accent-border.

**Mobile:** `grid-template-columns:1fr` → 1-spaltig.

**Anti-Pattern:** Niemals `.sr-leist-grid` mit Inline-Cards bauen (Beratungs-Mockup hatte das, wurde 2026-05-12 normalisiert).

---

## 4. Ablauf (`.ablauf`)

4-Step-Prozess, horizontal 4-Spalten-Grid, BG=weiss.

```html
<section class="ablauf sr-fade">
  <div class="w">
    <div class="ablauf-head fade-up">
      <div class="s-label">So arbeiten wir</div>
      <h2 class="s-h2">Vom Erstgespraech zum Abschluss.</h2>
    </div>
    <div class="ablauf-steps">
      <div class="ablauf-step">
        <span class="ablauf-num">01</span>
        <h4>Step-Titel</h4>
        <p>30-80 Worte Beschreibung.</p>
      </div>
      <!-- 3 weitere Steps -->
    </div>
  </div>
</section>
```

**`.ablauf-num`** — grosse Mono-Nummer, font-size 1.8rem, opacity .35, accent-color.

**Stil-Modern:** Cards mit gradient-stripe oben (4px) + gradient-Nummer.
**Stil-Elegant:** Cards transparent + border, Nummer font-size 2.4rem + font-weight 300 + opacity .25.

**Mobile:** 2-Spalten unter 768px, 1-Spalte unter 480px.

**Wann nutzen:** Branchen mit klarem Prozess (Berater, Coach, Anwalt, Architekt). Layout=ausfuehrlich Default.

**Anti-Pattern:** Niemals `.sr-ablauf-h` mit Inline-Steps (Beratungs-Mockup hatte das, normalisiert 2026-05-12).

---

## 5. Über uns (`.ueber`)

Dunkle Section, BG=var(--primary), Color-Bruch im Layout, Bio + Vorteile-Bullets + optional Stats.

```html
<section class="ueber sr-grain" id="ueber-uns">
  <div class="w">
    <div class="ueber-grid ueber-single">      <!-- .ueber-single = 1-Spalte, max 680px, zentriert -->
      <div class="fade-up">
        <div class="sec-label">Ueber uns</div>
        <h2>Wer hinter X steht</h2>
        <p class="ueber-text">Bio 80-250 Worte.</p>
        <ul class="ueber-vorteile">
          <li>Vorteil 1</li>
          <li>Vorteil 2</li>
          <!-- 3-8 Items -->
        </ul>
      </div>
    </div>
    <div class="ueber-stats">                  <!-- optional -->
      <div class="ueber-stat">
        <div class="ueber-stat-num" data-val="14" data-suffix="+">0</div>
        <div class="ueber-stat-label">Jahre</div>
      </div>
      <!-- 3 weitere -->
    </div>
  </div>
</section>
```

**Vorteile-CSS Default (Stil-Klassisch):** Bullet via `::before` als kleines accent-Quadrat.
**Stil-Modern:** Checkmarks `\2713` in runden BG-Kreisen, gap 14px.
**Stil-Elegant:** Dash-Separatoren `\2013` + obere/untere Border-Linien zwischen Items.

**Stats-Animation:** `.ueber-stat-num[data-val]` zaehlt beim Scroll-in von 0 hoch (cubic ease-out, 1200ms).

**Layout-Variante:** `.ueber-grid` ohne `.ueber-single` = 2-Spalten-Grid (Text-links + Image/Photo rechts) — selten genutzt, momentan keine Mockup-Referenz.

**Wann nutzen:** Pflicht in jedem Recipe (mindestens als `.ueber-single`).

---

## 6. Team (`.team`)

Standalone 3-Spalten-Grid mit Avataren, Namen, Rollen. BG=var(--bg).

```html
<section class="team">
  <div class="w">
    <div class="team-head">
      <div class="s-label">Team</div>
      <h2 class="s-h2">Wer Sie betreut.</h2>
    </div>
    <div class="team-grid">
      <div class="team-member">
        <img class="team-avatar" src="..." alt="...">
        <!-- ODER -->
        <div class="team-avatar-placeholder">AB</div>
        <div class="team-name">Anna Beispiel</div>
        <div class="team-role">Senior Beraterin</div>
      </div>
      <!-- 2-3 weitere -->
    </div>
  </div>
</section>
```

**Stil-Modern:** Card-style mit Padding + Shadow.
**Stil-Elegant:** Avatare mit `filter: grayscale(.8) saturate(.5)` — bei hover zu farbig.

**Mobile:** 2-Spalten unter 768px, 1-Spalte unter 480px.

**Wann nutzen:** Wenn ≥2 Personen mit Fotos sichtbar gemacht werden sollen. Sonst `.ueber-single` (Solo-Bio).

---

## 7. Galerie (`.galerie`)

3-Spalten-Grid mit Bildern, optional Captions, click-zoom via `.sr-zoom`-Klasse.

```html
<section class="galerie">
  <div class="w">
    <div class="galerie-head">
      <div class="s-label">Werkstuecke</div>
      <h2 class="s-h2">Was wir gebaut haben.</h2>
    </div>
    <div class="galerie-grid">
      <figure class="galerie-item">
        <img class="sr-zoom" src="..." alt="...">
        <figcaption>...</figcaption>           <!-- optional -->
      </figure>
      <!-- 3-9 weitere -->
    </div>
  </div>
</section>
```

**Stil-Elegant:** Bilder `filter:saturate(.8) contrast(.95)` — bei hover voll.

**Lightbox:** `.sr-zoom` aktiviert die globale Lightbox (mit Navigation, Swipe, Esc).

**Mobile:** 2-Spalten unter 768px.

**Wann nutzen:** Material-Branchen mit ≥3 Foto-Material (Handwerk, Gastro, Tourismus). NICHT bei text-fokussierten Branchen (Anwalt, Berater).

---

## 8. Bewertungen (`.bew`)

**Drei Varianten** — Recipe waehlt eine abhaengig von Bewertungs-Volume und -Charakter:

### 8a. `.bew-grid` — 3 Cards

Mehrere Stimmen als visuell gewichtete Cards.

```html
<section class="bew">
  <div class="w">
    <div class="bew-head fade-up">
      <div class="s-label">Bewertungen</div>
      <h2 class="s-h2">Was Kunden sagen.</h2>
      <div class="bew-rating">                <!-- optional Rating-Bar -->
        <span class="bew-rating-num">4.8</span>
        <div class="bew-rating-bar"><div class="bew-rating-fill" style="width:96%"></div></div>
        <span>von 5,0 (47 Bewertungen)</span>
      </div>
    </div>
    <div class="bew-grid">
      <div class="bew-card">
        <p class="bew-text">"Zitat 15-60 Worte."</p>
        <div class="bew-author">
          <div class="bew-avatar">AB</div>
          <div>
            <div class="bew-name">Anna B.</div>
            <div class="bew-meta">Wien · Mai 2026</div>
          </div>
        </div>
      </div>
      <!-- 2 weitere -->
    </div>
  </div>
</section>
```

**Stil-Modern:** Gradient-Border (purple/indigo) per `::before`-Pseudo + mask-composite.
**Stil-Elegant:** Cards transparent + border + hover→accent-border.

**Wann nutzen:** Branchen mit Volume-Reviews (Handwerk, Gastro). Volumen ≥3.

### 8b. `.bew-quote` — 1 starkes Zitat

Ein einziges, prominentes Quote mit border-left in accent. Max-width 640px.

```html
<div class="bew-quote">
  <p class="bew-quote-text">"Laengeres Quote 15-60 Worte mit Substanz, kein Stock-Klischee."</p>
  <div class="bew-quote-author">
    <div class="bew-quote-name">Mag. Helmut R.</div>
    <div class="bew-quote-meta">Geschaeftsfuehrer, Familienunternehmen · Wien</div>
  </div>
</div>
```

**Wann nutzen:** Text-Branchen ohne Volume-Reviews aber mit 1 starken Testimonial (Anwalt, Berater, Coach). Diskreter, premium-vibe.

### 8c. `.bew-list` — Liste mit Author-Side

Mehrere kuerzere Stimmen kompakter als Cards.

```html
<div class="bew-list">
  <div class="bew-item">
    <div>
      <p class="bew-text">"Kuerzeres Quote."</p>
    </div>
    <div class="bew-author-side">
      <div class="bew-name">Anna B.</div>
      <div class="bew-meta">Wien</div>
    </div>
  </div>
  <!-- 4-10 weitere -->
</div>
```

**Wann nutzen:** Industrie, Mobilitaet — wenn 4-10 kuerzere Stimmen sinnvoll sind.

---

## 9. FAQ (`.faq`)

Akkordeon, BG=weiss, Layout 2-Spalten (Head + List) ab 900px.

```html
<section class="faq sr-fade">
  <div class="w">
    <div class="faq-layout">
      <div class="faq-head fade-up">
        <div class="s-label">FAQ</div>
        <h2 class="s-h2">Haeufige Fragen.</h2>
      </div>
      <div class="faq-list">
        <div class="faq-item">
          <button class="faq-q" aria-expanded="false">
            <span>Frage-Text (5-15 Worte)</span>
            <span class="faq-toggle">+</span>
          </button>
          <div class="faq-a">
            <p>Antwort 30-120 Worte.</p>
          </div>
        </div>
        <!-- 4-6 weitere -->
      </div>
    </div>
  </div>
</section>
```

**JS-Handler:** Vorhanden in Beta-Template (Zeile 1013-1024), reagiert auf Click auf `.faq-q`. Toggle `.faq-a.open` + Wechsel `.faq-toggle` Text `+`/`−`.

**Stil-Modern:** `.faq-toggle` mit accent-tinted BG.
**Stil-Elegant:** `.faq-q` font-weight 500, `.faq-toggle` transparent + border.

**Wann nutzen:** Layout=ausfuehrlich Default. Branchen mit haeufigen Fragen vor Mandat (Anwalt, Berater, Architekt). Standard 4-6 Q&A.

**Anti-Pattern:** Niemals `.sr-faq-grid` mit Inline-Buttons (Beratungs-Mockup hatte das, normalisiert 2026-05-12).

---

## 10. Kontakt (`.kontakt`)

Komplexeste Section. Komposition aus 4 Sub-Blocks: Info-Items, Map, Infos-Pills, Form.

```html
<section class="kontakt" id="kontakt">
  <div class="w">
    <div class="kontakt-head">
      <div class="s-label">Kontakt</div>
      <h2 class="s-h2">So erreichen Sie uns.</h2>
    </div>
    <div class="kontakt-grid">                <!-- 2-Spalten ab 900px -->
      <div class="fade-up">
        <div class="kontakt-item">
          <div class="kontakt-item-label">Adresse</div>
          <div class="kontakt-item-value">Wollzeile 14, 1010 Wien</div>
        </div>
        <div class="kontakt-item">
          <div class="kontakt-item-label">Telefon</div>
          <a href="tel:+43..." class="kontakt-tel">+43 ...</a>
        </div>
        <div class="kontakt-item">
          <div class="kontakt-item-label">E-Mail</div>
          <a href="mailto:..." class="kontakt-email">...</a>
        </div>
        <div class="kontakt-item">
          <div class="kontakt-item-label">Oeffnungszeiten</div>
          <div class="kontakt-item-value">Mo–Fr 9:00–17:00</div>
        </div>
        <div class="kontakt-social">         <!-- optional -->
          <a href="..."><svg>...</svg></a>
        </div>
      </div>
      <div class="fade-up">
        <div class="kontakt-map">           <!-- Google-Maps iframe -->
          <iframe src="https://maps.google.com/maps?q=..." loading="lazy" title="Standort"></iframe>
        </div>
      </div>
    </div>
    <div class="kontakt-infos">              <!-- optional 3-Pill-Grid mit Hinweisen -->
      <div class="kontakt-info-item">
        <div class="kontakt-info-icon"><svg>...</svg></div>
        <span>Hinweis-Text</span>
      </div>
      <!-- 2 weitere -->
    </div>
    <div class="kontakt-form-wrap">          <!-- optional Form -->
      <div class="k-form">
        <h3>Anfrage senden</h3>
        <form>...</form>
      </div>
    </div>
  </div>
</section>
```

**Form-Felder (`.k-form`)** — Beta hat default-Schema (Name, E-Mail, Telefon, Adresse, Anliegen-Textarea). **Pro Branche anpassen:**

- Anwalt: „Rechtsgebiet"-Select statt „Adresse"
- Praxis: „Wunschtermin"-Datepicker
- Gastro: „Datum + Personen-Anzahl"
- Default: behalten

**Stil-Modern:** Form-Inputs border 2px + radius 12px, Button als Pill mit Glow.
**Stil-Elegant:** Form-Inputs border 1px + .85rem, Label uppercase letter-spacing .12em, Button BG=primary statt accent.

**Wann nutzen:** Pflicht in jedem Recipe.

---

## 11. CTA-Block (`.cta-block`)

Closing-Section vor Footer, dunkler BG=primary, zentrierter Call-to-Action.

```html
<section class="cta-block sr-fade">
  <div class="w cta-block-inner">
    <h2>Schluss-Headline (3-8 Worte).</h2>
    <p>Sub-Statement.</p>
    <a href="#kontakt" class="btn btn-accent">Termin vereinbaren</a>
  </div>
</section>
```

**`.cta-block .btn-accent`** wird gewhitewashed (BG=#fff, color=primary).

**Stil-Modern:** BG=gradient(accent, accent-indigo) + blur-blob `::before`.
**Stil-Elegant:** h2 font-weight 500, p font-size .85rem + opacity .5.

**Wann nutzen:** Layout=ausfuehrlich Default. Konversions-Verstaerker am Seitenende.

**Alt-Variante: `.sec-cta-block`** — mit Hintergrundbild + dark-overlay (siehe Tischler/Beratung Mid-CTA). Inline-style-Override fuer Recipes mit prominentem visuellen CTA-Anker.

---

## 12. Termin-CTA (`.termin-cta`)

Spezieller CTA-Block fuer Branchen mit Online-Termin-Buchung. Variante von `.cta-block`.

```html
<section class="termin-cta">
  <div class="w">
    <h2>Termin online buchen</h2>
    <p>...</p>
    <a href="..." class="btn btn-accent">Zum Buchungs-Tool</a>
  </div>
</section>
```

**Stil-Modern:** BG=accent (statt primary).

**Wann nutzen:** Praxis, Coach, Therapie, Friseur — Branchen mit Termin-Booking-Tool.

---

## 13. Sec-Fakten (`.sec-fakten`)

Stats-Block ausserhalb der Ueber-Section. BG=var(--bg), padding 64px.

```html
<section class="sec-fakten">
  <div class="w">
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:32px">
      <div class="ueber-stat">
        <div class="ueber-stat-num" data-val="500" data-suffix="+">0</div>
        <div class="ueber-stat-label">Projekte</div>
      </div>
      <!-- 3 weitere -->
    </div>
  </div>
</section>
```

Nutzt `.ueber-stat`-Klassen (geteilt mit Ueber-Section).

**Wann nutzen:** Layout=ausfuehrlich Default. Branchen mit beziffer­baren Erfolgs-Indikatoren.

---

## 14. Sec-Partner (`.sec-partner`)

Logo-Strip fuer Partner/Mitgliedschaften. BG=weiss, border-top.

```html
<section class="sec-partner">
  <div class="w">
    <div class="s-label">Partner</div>
    <div style="display:flex;gap:32px;flex-wrap:wrap;align-items:center;justify-content:center">
      <img class="sr-partner-hover" src="..." alt="Partner-1" style="height:40px;opacity:.5">
      <!-- weitere Logos -->
    </div>
  </div>
</section>
```

**Hover:** `.sr-partner-hover` setzt opacity:1 + filter:none.

**Wann nutzen:** B2B-Branchen mit etablierten Partnerschaften (Industrie, IT, Beratung). Eher optional.

---

## Footer

```html
<footer style="background:var(--primary);color:#fff;padding:56px 0 0">
  <div style="max-width:1200px;margin:0 auto;padding:0 24px">
    <div class="ft-grid" style="display:grid;grid-template-columns:2fr 1fr 1fr;gap:48px;padding-bottom:48px">
      <div>
        <div style="font-weight:800;font-size:1.05rem;margin-bottom:12px">Firmenname</div>
        <p style="opacity:.65;line-height:1.75;font-size:.85rem">Tagline-Description.</p>
        <a href="tel:..." style="color:#fff;font-weight:700;font-size:.9rem">+43 ...</a>
      </div>
      <div>
        <div style="opacity:.45">Navigation</div>
        <a href="#leistungen">Leistungen</a>
        <a href="#ueber-uns">Ueber uns</a>
        <a href="#kontakt">Kontakt</a>
        <a href="/s/.../impressum">Impressum</a>
        <a href="/s/.../datenschutz">Datenschutz</a>
      </div>
      <div>
        <div style="opacity:.45">Kontakt</div>
        <span>Adresse</span>
        <a href="tel:...">+43 ...</a>
        <a href="mailto:...">...@...</a>
      </div>
    </div>
    <div style="border-top:1px solid rgba(255,255,255,.1);padding:20px 0;display:flex;justify-content:space-between">
      <span style="opacity:.4;font-size:.78rem">&copy; 2026 Firmenname</span>
      <div style="display:flex;gap:20px">
        <a href="/.../impressum">Impressum</a>
        <a href="/.../datenschutz">Datenschutz</a>
      </div>
    </div>
  </div>
</footer>
```

**Mobile:** `.ft-grid` wird 2-spaltig unter 900px, 1-spaltig unter 540px.

**Wann nutzen:** Pflicht in jedem Recipe. Impressum + Datenschutz Pflicht-Links (AT-Compliance).

---

## Section-Reihenfolge — Pflicht-Pattern

Jedes Recipe folgt diesem Skelett (Toggles via Layout-Variante):

```
1. Hero                       Pflicht
2. (Trust-Bar)                optional, wenn nicht in Hero integriert
3. Leistungen                 Pflicht — Variante 3a oder 3b
4. (Mid-CTA / sec-cta-block)  optional — meistens nach Leistungen, Color-Anker
5. (Galerie)                  optional — Material-Branchen
6. (Bewertungen)              optional — Variante 8a, 8b oder 8c
7. (Ablauf)                   optional — Branchen mit Prozess
8. Ueber uns                  Pflicht
9. (Team)                     optional — wenn ≥2 Personen
10. (Sec-Fakten)              optional — Layout=ausfuehrlich
11. (FAQ)                     optional — Layout=ausfuehrlich
12. Kontakt                   Pflicht
13. (Sec-Partner)             optional — B2B-Branchen
14. (CTA-Block / Termin-CTA)  optional — Layout=ausfuehrlich
15. Footer                    Pflicht
```

**Recipe-spezifische Abweichungen** dokumentiert in [`recipe-konfiguration.md`](../recipe-konfiguration.md) („Section-Reihenfolgen pro Recipe").

---

## Reference-Mockups

Gebaut + validiert (Stand 2026-05-12):

| Mockup | Stil-Klasse | Leistungen | Bewertungen | Section-Pattern |
|---|---|---|---|---|
| [Tischler-Pichler](../../../public/mockup-recipe-handwerk-werkstatt.html) | `.stil-modern` | `.leist-list` (4 alternierend) | `.bew-grid` (3 cards) | Hero+Foto / Leist / CTA / Galerie / Ablauf / Bew / Ueber / FAQ / Kontakt / Footer |
| [Karner-Strategie](../../../public/mockup-recipe-beratung-modern.html) | `.stil-klassisch` | `.leist-more` (6 cards) | — | Hero / Leist / CTA / Ablauf / Ueber / FAQ / Kontakt / Footer |
| [Lechner-Rechtsanwaelte](../../../public/mockup-recipe-anwalt-klassisch.html) | `.stil-elegant` | `.leist-more` (6 cards) | `.bew-quote` (1) | Hero / Leist / Bew-Quote / CTA / Ablauf / Ueber / FAQ / Kontakt / Footer |

Alle drei nutzen ausschliesslich Beta-pure-Klassen — keine `.sr-*` Custom-Klassen-Erfindungen.

---

## Cross-References

- [`hero.md`](hero.md) — Hero detail-Spec
- [`../recipe-konfiguration.md`](../recipe-konfiguration.md) — Recipe-Tabelle mit Section-Reihenfolgen
- [`../../DESIGN-VISION.md`](../../DESIGN-VISION.md) § 9 — Section-Library-Block in Roadmap
- [`functions/templates/template.js`](../../../functions/templates/template.js) — Live-Beta-Template (single source of truth fuer CSS-Klassen)
