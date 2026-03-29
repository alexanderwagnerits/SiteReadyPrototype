const STIL_CONFIG = {
  klassisch:    {p:"#0f2b5b",a:"#2563eb",bg:"#f8fafc",s:"#e2e8f0",font:"Inter",url:"https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap",r:"4px"},
  modern:       {p:"#0f172a",a:"#6366f1",bg:"#fafafa",s:"#f0f0f0",font:"Plus Jakarta Sans",url:"https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap",r:"12px"},
  elegant:      {p:"#292524",a:"#78716c",bg:"#fafaf9",s:"#e7e5e4",font:"Inter",url:"https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap",r:"2px"},
  custom:       {p:"#111111",a:"#2563eb",bg:"#fafafa",s:"#e5e7eb",font:"DM Sans",url:"https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap",r:"8px"},
  professional: {p:"#0f2b5b",a:"#2563eb",bg:"#f8fafc",s:"#e2e8f0",font:"Inter",url:"https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap",r:"4px"},
  traditional:  {p:"#292524",a:"#78716c",bg:"#fafaf9",s:"#e7e5e4",font:"Inter",url:"https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap",r:"2px"},
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

  // Berufsbezeichnung + Verleihungsstaat (§ 5 ECG Abs. 1 Z 9)
  if (o.berufsbezeichnung) {
    add("Berufsbezeichnung", o.berufsbezeichnung);
    add("Verleihungsstaat", o.verleihungsstaat || "\u00d6sterreich");
  }

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

function normSocial(v) {
  if (!v) return "";
  v = v.trim().replace(/\/+$/, "");
  if (v.startsWith("http")) return v;
  return "https://" + v;
}

function buildLegalNav(o, stil, subdomain) {
  const tel = o.telefon || "";
  const telDisplay = tel;
  const telHref = tel ? `tel:${tel.replace(/\\s/g,"")}` : "";
  const logoHtml = o.url_logo
    ? `<img src="${o.url_logo}" alt="${o.firmenname}" style="height:32px;max-width:150px;object-fit:contain">`
    : o.firmenname;
  return `<style>
#sitenav{position:sticky;top:0;z-index:1000;background:${stil.p}}
.nav-inner{max-width:1200px;margin:0 auto;padding:0 24px;height:68px;display:flex;align-items:center;justify-content:space-between}
.nav-links{display:flex;align-items:center;gap:28px}
.nav-link{color:rgba(255,255,255,.85);text-decoration:none;font-size:.88rem;font-weight:500;transition:opacity .2s}
.nav-link:hover{opacity:.7}
.nav-cta{background:${stil.a};color:#fff!important;padding:9px 18px;border-radius:${stil.r};font-weight:700;font-size:.85rem;white-space:nowrap}
.nav-cta:hover{opacity:.85!important}
.hbg{display:none;flex-direction:column;gap:5px;background:none;border:none;cursor:pointer;padding:6px}
.hbg-bar{width:24px;height:2px;background:rgba(255,255,255,.9);border-radius:2px}
.mob-menu{display:none;position:fixed;top:68px;left:0;right:0;background:#fff;box-shadow:0 8px 32px rgba(0,0,0,.12);padding:16px 24px 24px;z-index:999}
.mob-link{display:block;padding:12px 0;font-size:1rem;font-weight:600;color:${stil.p};text-decoration:none;border-bottom:1px solid #f1f5f9}
.mob-cta{display:block;margin-top:16px;background:${stil.a};color:#fff;text-align:center;padding:14px;border-radius:${stil.r};font-weight:700;font-size:1rem;text-decoration:none}
@media(max-width:768px){.nav-links{display:none}.hbg{display:flex}}
</style>
<nav id="sitenav">
<div class="nav-inner">
<a href="/s/${subdomain}" class="nav-logo" style="font-weight:800;font-size:1.05rem;color:#fff;text-decoration:none;letter-spacing:-.02em">${logoHtml}</a>
<div class="nav-links">
<a href="/s/${subdomain}#leistungen" class="nav-link">Leistungen</a>
<a href="/s/${subdomain}#ueber-uns" class="nav-link">\u00dcber uns</a>
<a href="/s/${subdomain}#kontakt" class="nav-link">Kontakt</a>
${tel ? `<a href="${telHref}" class="nav-link nav-cta">${telDisplay}</a>` : ""}
</div>
<button class="hbg" id="hbg" aria-label="Menu">
<span class="hbg-bar"></span><span class="hbg-bar"></span><span class="hbg-bar"></span>
</button>
</div>
<div class="mob-menu" id="mob-menu">
<a href="/s/${subdomain}#leistungen" class="mob-link">Leistungen</a>
<a href="/s/${subdomain}#ueber-uns" class="mob-link">\u00dcber uns</a>
<a href="/s/${subdomain}#kontakt" class="mob-link">Kontakt</a>
${tel ? `<a href="${telHref}" class="mob-cta">${telDisplay} \u2014 Jetzt anrufen</a>` : ""}
</div>
</nav>
<script>
(function(){
var btn=document.getElementById('hbg');
var mob=document.getElementById('mob-menu');
var open=false;
btn.addEventListener('click',function(){open=!open;mob.style.display=open?'block':'none';});
document.querySelectorAll('.mob-link,.mob-cta').forEach(function(a){a.addEventListener('click',function(){open=false;mob.style.display='none';});});
})();
</script>`;
}

function buildLegalFooter(o, stil, subdomain) {
  const year = new Date().getFullYear();
  const tel = o.telefon || "";
  const email = o.email || "";
  const adresse = [o.adresse, [o.plz, o.ort].filter(Boolean).join(" ")].filter(Boolean).join(", ");
  const socialSvgs = {
    facebook: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>`,
    instagram: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/></svg>`,
    linkedin: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>`,
    tiktok: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.77 0 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 1 0 5.55 6.29V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75c-.34 0-.68-.03-1.02-.06z"/></svg>`,
  };
  const socials = [];
  if (o.facebook) socials.push({name:"facebook",url:normSocial(o.facebook)});
  if (o.instagram) socials.push({name:"instagram",url:normSocial(o.instagram)});
  if (o.linkedin) socials.push({name:"linkedin",url:normSocial(o.linkedin)});
  if (o.tiktok) socials.push({name:"tiktok",url:normSocial(o.tiktok)});
  const socialIconsHtml = socials.length ? `<div style="display:flex;gap:10px;margin-top:12px">${socials.map(s => `<a href="${s.url}" target="_blank" rel="noopener" style="display:flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:${stil.r};border:1px solid rgba(255,255,255,.15);color:rgba(255,255,255,.7);text-decoration:none;transition:opacity .2s" aria-label="${s.name}">${socialSvgs[s.name] || s.name}</a>`).join("")}</div>` : "";
  return `<footer style="background:${stil.p};color:#fff;padding:56px 0 0;font-family:inherit">
<div style="max-width:1200px;margin:0 auto;padding:0 24px">
<div style="display:grid;grid-template-columns:2fr 1fr 1fr;gap:48px;padding-bottom:48px" class="ft-grid">
<div>
<div style="font-weight:800;font-size:1.05rem;margin-bottom:12px;letter-spacing:-.01em">${o.firmenname}</div>
<p style="opacity:.65;line-height:1.75;font-size:.85rem;margin-bottom:16px;max-width:280px">${o.kurzbeschreibung || ""}</p>
${tel ? `<a href="tel:${tel.replace(/\\s/g,"")}" style="color:#fff;font-weight:700;font-size:.9rem;text-decoration:none;opacity:.9">${tel}</a>` : ""}
${socialIconsHtml}
</div>
<div>
<div style="font-weight:700;font-size:.72rem;text-transform:uppercase;letter-spacing:.1em;opacity:.45;margin-bottom:16px">Navigation</div>
<div style="display:flex;flex-direction:column;gap:10px">
<a href="/s/${subdomain}#leistungen" style="color:rgba(255,255,255,.7);text-decoration:none;font-size:.88rem">Leistungen</a>
<a href="/s/${subdomain}#ueber-uns" style="color:rgba(255,255,255,.7);text-decoration:none;font-size:.88rem">\u00dcber uns</a>
<a href="/s/${subdomain}#kontakt" style="color:rgba(255,255,255,.7);text-decoration:none;font-size:.88rem">Kontakt</a>
<a href="/s/${subdomain}/impressum" style="color:rgba(255,255,255,.7);text-decoration:none;font-size:.88rem">Impressum</a>
<a href="/s/${subdomain}/datenschutz" style="color:rgba(255,255,255,.7);text-decoration:none;font-size:.88rem">Datenschutz</a>
</div>
</div>
<div>
<div style="font-weight:700;font-size:.72rem;text-transform:uppercase;letter-spacing:.1em;opacity:.45;margin-bottom:16px">Kontakt</div>
<div style="display:flex;flex-direction:column;gap:10px;font-size:.88rem;color:rgba(255,255,255,.7)">
${adresse ? `<span>${adresse}</span>` : ""}
${tel ? `<a href="tel:${tel.replace(/\\s/g,"")}" style="color:rgba(255,255,255,.85);text-decoration:none;font-weight:600">${tel}</a>` : ""}
${email ? `<a href="mailto:${email}" style="color:rgba(255,255,255,.7);text-decoration:none">${email}</a>` : ""}
</div>
</div>
</div>
<div style="border-top:1px solid rgba(255,255,255,.1);padding:20px 0;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
<span style="opacity:.4;font-size:.78rem">&copy; ${year} ${o.firmenname}</span>
<div style="display:flex;gap:20px">
<a href="/s/${subdomain}/impressum" style="opacity:.4;font-size:.78rem;color:#fff;text-decoration:none">Impressum</a>
<a href="/s/${subdomain}/datenschutz" style="opacity:.4;font-size:.78rem;color:#fff;text-decoration:none">Datenschutz</a>
</div>
</div>
</div>
</footer>
<style>@media(max-width:768px){.ft-grid{grid-template-columns:1fr!important}}</style>`;
}

function legalShell(o, stil, subdomain, title, content) {
  const navHtml = buildLegalNav(o, stil, subdomain);
  const footerHtml = buildLegalFooter(o, stil, subdomain);
  const fontFamily = `'${stil.font}',system-ui,-apple-system,sans-serif`;
  return `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>${title} &ndash; ${o.firmenname}</title>
<style>
@import url('${stil.url}');
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:${fontFamily};background:${stil.bg};color:#1f2937;line-height:1.6;-webkit-font-smoothing:antialiased}
.wrap{max-width:700px;margin:0 auto;padding:56px 28px 80px}
h1{font-size:1.4rem;font-weight:800;color:${stil.p};margin-bottom:6px;letter-spacing:-.02em}
.h1-sub{font-size:.82rem;color:#94a3b8;margin-bottom:40px}
table{width:100%;border-collapse:collapse;margin-bottom:0}
td{padding:9px 16px 9px 0;font-size:.9rem;vertical-align:top;border-bottom:1px solid ${stil.s}}
td:first-child{font-weight:600;color:${stil.p};width:200px;white-space:nowrap}
.section{margin:32px 0}
.section-title{font-size:.88rem;font-weight:700;color:${stil.p};margin-bottom:14px}
.card{background:#fff;border-radius:${stil.r};border:1px solid ${stil.s};padding:20px 24px;margin-bottom:12px}
.card-label{font-size:.7rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#94a3b8;margin-bottom:6px}
.card-title{font-size:.92rem;font-weight:700;color:${stil.p};margin-bottom:4px}
.card-body{font-size:.87rem;color:#475569;line-height:1.7}
.card-body a{color:${stil.a};text-decoration:none}
.card-body a:hover{text-decoration:underline}
.tag{display:inline-block;font-size:.72rem;font-weight:600;padding:2px 7px;border-radius:4px;margin-right:4px;margin-top:4px}
.tag-basis{background:#eff6ff;color:#1d4ed8}
.tag-drittland{background:#fff7ed;color:#c2410c}
.tag-dauer{background:#f0fdf4;color:#166534}
.rights-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:8px;margin-top:4px}
.right-item{background:#fff;border:1px solid ${stil.s};border-radius:${stil.r};padding:10px 14px;font-size:.83rem;color:#334155}
.right-item strong{display:block;font-weight:700;color:${stil.p};font-size:.8rem}
.disclaimer{background:#fffbeb;border:1px solid #fde68a;border-radius:${stil.r};padding:14px 18px;font-size:.8rem;color:#92400e;margin-top:40px;line-height:1.6}
.disclaimer strong{font-weight:700}
@media(max-width:640px){td:first-child{width:auto;white-space:normal}}
</style>
</head>
<body>
${navHtml}
<div class="wrap">
${content}
</div>
${footerHtml}
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
  const stil = STIL_CONFIG[o.stil] || STIL_CONFIG.klassisch;
  // Fuer custom: Farbe/Font aus Order uebernehmen
  if (o.stil === "custom") {
    if (o.custom_color) { stil.p = o.custom_color; stil.a = o.custom_color; }
  }

  let content, title;

  if (page === "impressum") {
    title = "Impressum";
    const {rows: irows, firmaVoll, adresse} = buildImpressumRows(o);
    const tRows = irows.map(([l,v]) => `<tr><td>${l}</td><td>${v}</td></tr>`).join("");
    content = `<h1>Impressum</h1>
<p class="h1-sub">Gem\u00e4\u00df &sect; 5 ECG (E-Commerce-Gesetz) und &sect; 25 MedienG</p>
<div class="card"><table>${tRows}</table></div>

<div class="section">
<div class="section-title">Online-Streitbeilegung</div>
<div class="card">
<div class="card-body">Die Europ\u00e4ische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:<br>
<a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener">ec.europa.eu/consumers/odr</a><br><br>
Wir sind nicht verpflichtet und nicht bereit, an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</div>
</div>
</div>

<div class="section">
<div class="section-title">Haftung f\u00fcr Links</div>
<div class="card">
<div class="card-body">Diese Website enth\u00e4lt Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. F\u00fcr die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf m\u00f6gliche Rechtsverst\u00f6\u00dfe \u00fcberpr\u00fcft. Rechtswidrige Inhalte waren nicht erkennbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.</div>
</div>
</div>

<div class="section">
<div class="section-title">Urheberrecht</div>
<div class="card">
<div class="card-body">Die Inhalte dieser Website unterliegen dem \u00f6sterreichischen Urheberrecht. Die Vervielf\u00e4ltigung, Bearbeitung, Verbreitung und jede Art der Verwertung au\u00dferhalb der Grenzen des Urheberrechtes bed\u00fcrfen der schriftlichen Zustimmung des Betreibers.</div>
</div>
</div>

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
<div class="card" style="margin-top:8px">
<div class="card-label">Datenbank &amp; Speicherung</div>
<div class="card-title">Supabase Inc.</div>
<div class="card-body">970 Toa Payoh North #07-04, Singapore 318992<br>
Website-Inhalte, Kontaktanfragen und Betriebsdaten werden in einer PostgreSQL-Datenbank bei Supabase gespeichert. Supabase verarbeitet Daten als Sub-Auftragsverarbeiter im Auftrag von Wagner IT-Solutions e.U.
<span class="tag tag-basis">Art. 6 Abs. 1 lit. b/f DSGVO</span>
<span class="tag tag-drittland">Hosting: AWS eu-central-1 (Frankfurt)</span>
<span class="tag tag-dauer">Speicherdauer: Vertragsdauer + gesetzliche Aufbewahrungsfrist</span><br>
<a href="https://supabase.com/privacy" target="_blank" rel="noopener">supabase.com/privacy</a></div>
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
<div class="card-label">Karteneinbettung</div>
<div class="card-title">Google Maps &mdash; Google LLC</div>
<div class="card-body">Diese Website bindet Google Maps zur Standortanzeige ein. Beim Laden der Karte wird Ihre IP-Adresse an Google-Server \u00fcbertragen. Google LLC, 1600 Amphitheatre Parkway, Mountain View, CA 94043, USA.
<span class="tag tag-basis">Art. 6 Abs. 1 lit. f DSGVO</span>
<span class="tag tag-drittland">Drittland USA &mdash; Standardvertragsklauseln</span><br>
<a href="https://policies.google.com/privacy" target="_blank" rel="noopener">policies.google.com/privacy</a></div>
</div>

<div class="card" style="margin-top:8px">
<div class="card-label">Kontaktformular</div>
<div class="card-title">Kontaktanfragen \u00fcber die Website</div>
<div class="card-body">Wenn Sie das Kontaktformular auf dieser Website nutzen, werden folgende Daten verarbeitet: Name, E-Mail-Adresse, Telefonnummer (optional) und Ihre Nachricht. Diese Daten werden in einer Datenbank bei Supabase (AWS eu-central-1, Frankfurt) gespeichert und ausschlie\u00dflich zur Bearbeitung Ihrer Anfrage verwendet. Es findet keine Weitergabe an Dritte statt.
<span class="tag tag-basis">Art. 6 Abs. 1 lit. b DSGVO</span>
<span class="tag tag-dauer">Speicherdauer: bis Anfrage abgeschlossen, danach gesetzliche Aufbewahrungsfrist (7 Jahre)</span></div>
</div>

<div class="card" style="margin-top:8px">
<div class="card-label">Kontaktaufnahme</div>
<div class="card-title">Telefon &amp; E-Mail</div>
<div class="card-body">Wenn Sie uns per Telefon oder E-Mail kontaktieren, verarbeiten wir Ihre Kontaktdaten und Ihr Anliegen ausschlie\u00dflich zur Bearbeitung Ihrer Anfrage. Es findet keine Weitergabe an Dritte statt.
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

  const html = legalShell(o, stil, subdomain, title, content);
  return new Response(html, {headers: {"Content-Type": "text/html; charset=utf-8"}});
}
