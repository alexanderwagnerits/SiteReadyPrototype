const PALETTES = {
  elektro:{p:"#0c1d3d",a:"#f59e0b",bg:"#f8faff"}, installateur:{p:"#1a3050",a:"#dc2626",bg:"#f8fafc"},
  maler:{p:"#2c3e50",a:"#e67e22",bg:"#fffef9"}, tischler:{p:"#4a2c0a",a:"#d97706",bg:"#fefaf0"},
  fliesenleger:{p:"#0f3460",a:"#0891b2",bg:"#f0fdfe"}, schlosser:{p:"#1c1c2e",a:"#64748b",bg:"#f1f5f9"},
  dachdecker:{p:"#3b1f0a",a:"#b45309",bg:"#fff8f0"}, zimmerei:{p:"#1a3c28",a:"#a16207",bg:"#f7fdf0"},
  maurer:{p:"#2d2d2d",a:"#ea580c",bg:"#fafafa"}, bodenleger:{p:"#2d1b69",a:"#b45309",bg:"#fdf8ff"},
  glaser:{p:"#0c4a6e",a:"#0891b2",bg:"#f0f9ff"}, gaertner:{p:"#14532d",a:"#15803d",bg:"#f0fdf4"},
  klima:{p:"#0c2340",a:"#0284c7",bg:"#f0f9ff"}, reinigung:{p:"#0f2942",a:"#0ea5e9",bg:"#f8fbff"},
  sonstige:{p:"#1e293b",a:"#3b82f6",bg:"#f8fafc"},
};

function buildImpressumRows(o) {
  const uf = o.unternehmensform || "";
  const ufSuffix = {eu:"e.U.",gmbh:"GmbH",og:"OG",kg:"KG",ag:"AG"};
  const firmaVoll = o.firmenname + (ufSuffix[uf] ? ` ${ufSuffix[uf]}` : "");
  const sitz = [o.plz, o.ort].filter(Boolean).join(" ");
  const adresse = [o.adresse, sitz].filter(Boolean).join(", ");
  const rows = [];
  const add = (l, v) => { if (v && String(v).trim()) rows.push([l, String(v).trim()]); };

  add("Medieninhaber & Herausgeber", firmaVoll);

  if (uf === "einzelunternehmen") {
    add("Inhaber", o.firmenname); add("Anschrift", adresse);
    add("Unternehmensgegenstand", o.unternehmensgegenstand);
  } else if (uf === "eu") {
    add("Anschrift", adresse); add("Firmenbuchnummer", o.firmenbuchnummer);
    add("Firmenbuchgericht", o.firmenbuchgericht);
    if (o.liquidation) add("Hinweis", "Gesellschaft in Liquidation");
  } else if (uf === "gmbh") {
    add("Anschrift", adresse); add("Firmenbuchnummer", o.firmenbuchnummer);
    add("Firmenbuchgericht", o.firmenbuchgericht);
    add("Gesch\u00e4ftsf\u00fchrer", o.geschaeftsfuehrer);
    if (o.liquidation) add("Hinweis", "Gesellschaft in Liquidation");
  } else if (uf === "og" || uf === "kg") {
    add("Anschrift", adresse); add("Firmenbuchnummer", o.firmenbuchnummer);
    add("Firmenbuchgericht", o.firmenbuchgericht);
    if (o.liquidation) add("Hinweis", "Gesellschaft in Liquidation");
  } else if (uf === "ag") {
    add("Anschrift", adresse); add("Firmenbuchnummer", o.firmenbuchnummer);
    add("Firmenbuchgericht", o.firmenbuchgericht);
    add("Vorstand", o.vorstand); add("Aufsichtsrat", o.aufsichtsrat);
    if (o.liquidation) add("Hinweis", "Gesellschaft in Liquidation");
  } else if (uf === "verein") {
    add("Vereinsname", o.firmenname); add("Anschrift", adresse);
    add("ZVR-Zahl", o.zvr_zahl);
    add("Vertretungsbefugte Organe", o.vertretungsorgane);
  } else if (uf === "gesnbr") {
    add("Bezeichnung", o.firmenname); add("Anschrift", adresse);
    add("Unternehmensgegenstand", o.unternehmensgegenstand);
    add("Gesellschafter", o.gesellschafter);
  } else {
    add("Anschrift", adresse);
  }

  add("Telefon", o.telefon); add("E-Mail", o.email);
  add("UID-Nummer", o.uid_nummer); add("GISA-Zahl", o.gisazahl);
  if (o.aufsichtsbehoerde) {
    add("Aufsichtsbeh\u00f6rde", o.aufsichtsbehoerde);
  } else if (uf !== "verein" && uf !== "gesnbr") {
    add("Aufsichtsbeh\u00f6rde", "Zust\u00e4ndige Bezirksverwaltungsbeh\u00f6rde");
  }
  if (o.kammer_berufsrecht) {
    add("Kammer / Berufsrecht", o.kammer_berufsrecht);
  } else if (uf !== "verein" && uf !== "gesnbr" && uf !== "einzelunternehmen") {
    add("Mitglied der", "Wirtschaftskammer \u00d6sterreich");
    add("Berufsrecht", "Gewerbeordnung (www.ris.bka.gv.at)");
  }
  return {rows, firmaVoll, adresse};
}

function legalShell(o, pal, subdomain, title, content) {
  const year = new Date().getFullYear();
  const tel = o.telefon || "";
  const telHref = tel ? `tel:${tel.replace(/\s/g,"")}` : "";
  return `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>${title} &ndash; ${o.firmenname}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:system-ui,-apple-system,sans-serif;background:#f8fafc;color:#1e293b;line-height:1.6}
.topbar{background:${pal.p};padding:16px 24px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px}
.topbar a{color:rgba(255,255,255,.8);text-decoration:none;font-size:.85rem}
.topbar-logo{color:#fff;font-weight:800;font-size:1rem;text-decoration:none}
.topbar-links{display:flex;gap:20px;align-items:center}
.wrap{max-width:800px;margin:0 auto;padding:48px 24px 80px}
h1{font-size:1.6rem;font-weight:800;color:${pal.p};margin-bottom:8px}
.h1-sub{font-size:.9rem;color:#94a3b8;margin-bottom:32px;padding-bottom:20px;border-bottom:2px solid ${pal.a}}
table{width:100%;border-collapse:collapse;margin-bottom:0}
td{padding:9px 16px 9px 0;font-size:.9rem;vertical-align:top;border-bottom:1px solid #e8edf2}
td:first-child{font-weight:600;color:${pal.p};width:200px;white-space:nowrap}
.section{margin:32px 0}
.section-title{font-size:1rem;font-weight:700;color:${pal.p};margin-bottom:12px;display:flex;align-items:center;gap:8px}
.section-title::after{content:"";flex:1;height:1px;background:#e2e8f0}
.card{background:#fff;border-radius:8px;border:1px solid #e2e8f0;padding:20px 24px;margin-bottom:12px}
.card-label{font-size:.7rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#94a3b8;margin-bottom:6px}
.card-title{font-size:.92rem;font-weight:700;color:${pal.p};margin-bottom:4px}
.card-body{font-size:.87rem;color:#475569;line-height:1.7}
.card-body a{color:${pal.a};text-decoration:none}
.card-body a:hover{text-decoration:underline}
.badge-siteready{display:inline-flex;align-items:center;gap:5px;background:${pal.p}12;color:${pal.p};font-size:.7rem;font-weight:700;padding:2px 8px;border-radius:20px;margin-bottom:8px}
.badge-siteready svg{width:10px;height:10px;fill:currentColor}
.tag{display:inline-block;font-size:.72rem;font-weight:600;padding:2px 7px;border-radius:4px;margin-right:4px;margin-top:4px}
.tag-basis{background:#eff6ff;color:#1d4ed8}
.tag-drittland{background:#fff7ed;color:#c2410c}
.tag-dauer{background:#f0fdf4;color:#166534}
.rights-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:8px;margin-top:4px}
.right-item{background:#fff;border:1px solid #e2e8f0;border-radius:6px;padding:10px 14px;font-size:.83rem;color:#334155}
.right-item strong{display:block;font-weight:700;color:${pal.p};font-size:.8rem}
.disclaimer{background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:14px 18px;font-size:.8rem;color:#92400e;margin-top:40px;line-height:1.6}
.disclaimer strong{font-weight:700}
.footer-bar{background:${pal.p};color:rgba(255,255,255,.5);text-align:center;padding:16px;font-size:.78rem;margin-top:48px}
.footer-bar a{color:rgba(255,255,255,.5);text-decoration:none;margin:0 12px}
</style>
</head>
<body>
<div class="topbar">
<a href="/s/${subdomain}" class="topbar-logo">${o.firmenname}</a>
<div class="topbar-links">
<a href="/s/${subdomain}">&larr; Zur\u00fcck zur Website</a>
${tel ? `<a href="${telHref}" style="color:#fff;font-weight:700">${tel}</a>` : ""}
</div>
</div>
<div class="wrap">
${content}
</div>
<div class="footer-bar">
&copy; ${year} ${o.firmenname} &nbsp;&mdash;&nbsp;
<a href="/s/${subdomain}/impressum">Impressum</a>
<a href="/s/${subdomain}/datenschutz">Datenschutz</a>
</div>
</body>
</html>`;
}

export async function buildLegalPage(subdomain, page, env) {
  if (!subdomain) return new Response("Not Found", {status: 404});

  const r = await fetch(
    `${env.SUPABASE_URL}/rest/v1/orders?subdomain=eq.${encodeURIComponent(subdomain)}&select=*`,
    {headers: {"apikey": env.SUPABASE_SERVICE_KEY, "Authorization": `Bearer ${env.SUPABASE_SERVICE_KEY}`}}
  );
  if (!r.ok) return new Response("Fehler", {status: 502});
  const rows = await r.json();
  if (!rows.length) return new Response("Nicht gefunden", {status: 404});

  const o = rows[0];
  const pal = PALETTES[o.branche] || PALETTES.sonstige;

  let content, title;

  if (page === "impressum") {
    title = "Impressum";
    const {rows: irows, firmaVoll, adresse} = buildImpressumRows(o);
    const tRows = irows.map(([l,v]) => `<tr><td>${l}</td><td>${v}</td></tr>`).join("");
    content = `<h1>Impressum</h1>
<p class="h1-sub">Gem\u00e4\u00df &sect; 5 ECG (E-Commerce-Gesetz) und &sect; 25 MedienG</p>
<div class="card"><table>${tRows}</table></div>
<div class="disclaimer"><strong>Hinweis:</strong> Dieses Impressum wurde automatisch auf Basis Ihrer Angaben erstellt. Bitte pr\u00fcfen Sie die Richtigkeit aller Informationen.</div>`;
  } else {
    title = "Datenschutzerkl\u00e4rung";
    const ufSuffix = {eu:"e.U.",gmbh:"GmbH",og:"OG",kg:"KG",ag:"AG"};
    const uf = o.unternehmensform || "";
    const firmaVoll = o.firmenname + (ufSuffix[uf] ? ` ${ufSuffix[uf]}` : "");
    const adresse = [o.adresse, [o.plz, o.ort].filter(Boolean).join(" ")].filter(Boolean).join(", ");

    content = `<h1>Datenschutzerkl\u00e4rung</h1>
<p class="h1-sub">Gem\u00e4\u00df DSGVO (EU 2016/679) und TKG 2021</p>

<div class="section">
<div class="section-title">Verantwortlicher</div>
<div class="card">
<div class="card-body">
<strong style="color:#1e293b">${firmaVoll}</strong><br>
${adresse}${o.email ? `<br><a href="mailto:${o.email}">${o.email}</a>` : ""}${o.telefon ? `<br>${o.telefon}` : ""}
</div>
</div>
</div>

<div class="section">
<div class="section-title">Auftragsverarbeiter</div>
<div class="card">
<div class="card-label">Website-Erstellung &amp; Betrieb</div>
<div class="card-title">Wagner IT-Solutions e.U. (SiteReady)</div>
<div class="card-body">Operngasse 17/23, 1040 Wien &nbsp;&mdash;&nbsp; office@wagner-its.at<br>
SiteReady erstellt und betreibt diese Website im Auftrag des Verantwortlichen. Grundlage: Auftragsverarbeitungsvertrag gem. Art. 28 DSGVO.</div>
</div>
<div class="card" style="margin-top:8px">
<div class="card-label">Hosting &amp; Auslieferung</div>
<div class="card-title">Cloudflare Pages &mdash; Cloudflare Inc.</div>
<div class="card-body">101 Townsend St, San Francisco, CA 94107, USA<br>
Diese Website wird \u00fcber das globale CDN von Cloudflare ausgeliefert. Dabei werden Zugriffsdaten (IP-Adresse, Zeitstempel, aufgerufene Seite, Browser) in Cloudflare-Rechenzentren verarbeitet.
<span class="tag tag-basis">Art. 6 Abs. 1 lit. f DSGVO</span>
<span class="tag tag-drittland">Drittland USA &mdash; Standardvertragsklauseln</span>
<span class="tag tag-dauer">Speicherdauer: bis 30 Tage</span><br>
<a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener">cloudflare.com/privacypolicy</a></div>
</div>
</div>

<div class="section">
<div class="section-title">Datenverarbeitungen</div>

<div class="card">
<div class="card-label">Webschriften</div>
<div class="card-title">Google Fonts &mdash; Google LLC</div>
<div class="card-body">Diese Website l\u00e4dt Schriftarten von Google Fonts. Dabei wird Ihre IP-Adresse beim Seitenaufruf an Google-Server \u00fcbertragen. Google LLC, 1600 Amphitheatre Parkway, Mountain View, CA 94043, USA.
<span class="tag tag-basis">Art. 6 Abs. 1 lit. f DSGVO</span>
<span class="tag tag-drittland">Drittland USA &mdash; Standardvertragsklauseln</span><br>
<a href="https://policies.google.com/privacy" target="_blank" rel="noopener">policies.google.com/privacy</a></div>
</div>

<div class="card" style="margin-top:8px">
<div class="card-label">Kontaktaufnahme</div>
<div class="card-title">Telefon &amp; E-Mail</div>
<div class="card-body">Wenn Sie uns kontaktieren, verarbeiten wir Name, Kontaktdaten und Ihr Anliegen ausschlie\u00dflich zur Bearbeitung Ihrer Anfrage. Es findet keine Weitergabe an Dritte statt.
<span class="tag tag-basis">Art. 6 Abs. 1 lit. b DSGVO</span>
<span class="tag tag-dauer">Speicherdauer: bis Anfrage abgeschlossen, danach gesetzliche Aufbewahrungsfrist (7 Jahre)</span></div>
</div>

<div class="card" style="margin-top:8px">
<div class="card-label">Cookies &amp; Tracking</div>
<div class="card-title">Keine Cookies, kein Tracking</div>
<div class="card-body">Diese Website verwendet keine Cookies und keine Analyse- oder Werbe-Tools. Es werden keine Nutzerprofile erstellt.</div>
</div>
</div>

<div class="section">
<div class="section-title">Ihre Rechte</div>
<div class="rights-grid">
<div class="right-item"><strong>Auskunft</strong>Art. 15 DSGVO</div>
<div class="right-item"><strong>Berichtigung</strong>Art. 16 DSGVO</div>
<div class="right-item"><strong>L\u00f6schung</strong>Art. 17 DSGVO</div>
<div class="right-item"><strong>Einschr\u00e4nkung</strong>Art. 18 DSGVO</div>
<div class="right-item"><strong>Daten\u00fcbertragbarkeit</strong>Art. 20 DSGVO</div>
<div class="right-item"><strong>Widerspruch</strong>Art. 21 DSGVO</div>
</div>
<div class="card" style="margin-top:12px">
<div class="card-body">Beschwerden k\u00f6nnen Sie bei der \u00f6sterreichischen Datenschutzbeh\u00f6rde einreichen:<br>
<a href="https://www.dsb.gv.at" target="_blank" rel="noopener">dsb.gv.at</a> &nbsp;&mdash;&nbsp; Barichgasse 40&ndash;42, 1030 Wien</div>
</div>
</div>

<div class="section">
<div class="section-title">Kontakt Datenschutz</div>
<div class="card">
<div class="card-body">Bei Fragen zum Datenschutz wenden Sie sich direkt an den Verantwortlichen:<br>
${o.email ? `<a href="mailto:${o.email}">${o.email}</a>` : firmaVoll}${o.telefon ? ` &nbsp;&mdash;&nbsp; ${o.telefon}` : ""}</div>
</div>
</div>

<div class="disclaimer"><strong>Hinweis:</strong> Diese Datenschutzerkl\u00e4rung wurde automatisch auf Basis technischer Parameter erstellt. F\u00fcr eine rechtsverbindliche Pr\u00fcfung empfehlen wir die Kontrolle durch einen Datenschutzexperten.</div>`;
  }

  const html = legalShell(o, pal, subdomain, title, content);
  return new Response(html, {headers: {"Content-Type": "text/html; charset=utf-8"}});
}
