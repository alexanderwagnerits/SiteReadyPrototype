const STIL_CONFIG = {
  klassisch:    {p:"#094067",a:"#0369a1",bg:"#f4f7fa",s:"#d8eefe",t:"#1e293b",tm:"#475569",font:"Inter",url:"https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap",r:"4px"},
  modern:       {p:"#18181b",a:"#4f46e5",bg:"#fafafa",s:"#e4e4e7",t:"#18181b",tm:"#71717a",font:"Plus Jakarta Sans",url:"https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap",r:"12px"},
  elegant:      {p:"#020826",a:"#7a6844",bg:"#f9f4ef",s:"#eaddcf",t:"#2c2620",tm:"#6b6058",font:"Inter",fontHeading:"Cormorant Garamond",url:"https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Cormorant+Garamond:wght@400;500;600;700&display=swap",r:"2px"},
  custom:       {p:"#094067",a:"#0369a1",bg:"#f4f7fa",s:"#d8eefe",t:"#1e293b",tm:"#475569",font:"DM Sans",url:"https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap",r:"8px"},
  professional: {p:"#094067",a:"#0369a1",bg:"#f4f7fa",s:"#d8eefe",t:"#1e293b",tm:"#475569",font:"Inter",url:"https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap",r:"4px"},
  traditional:  {p:"#020826",a:"#7a6844",bg:"#f9f4ef",s:"#eaddcf",t:"#2c2620",tm:"#6b6058",font:"Inter",fontHeading:"Cormorant Garamond",url:"https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Cormorant+Garamond:wght@400;500;600;700&display=swap",r:"2px"},
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
    add("Geschäftsführer", o.geschaeftsfuehrer);
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
    add("Verleihungsstaat", o.verleihungsstaat || "Österreich");
  }

  if (o.aufsichtsbehoerde) {
    add("Aufsichtsbehörde", o.aufsichtsbehoerde);
  } else if (uf !== "verein" && uf !== "gesnbr") {
    add("Aufsichtsbehörde", "Zuständige Bezirksverwaltungsbehörde");
  }
  if (o.kammer_berufsrecht) {
    add("Kammer / Berufsrecht", o.kammer_berufsrecht);
  } else if (uf !== "verein" && uf !== "gesnbr" && uf !== "einzelunternehmen") {
    add("Mitglied der", "Wirtschaftskammer Österreich");
    add("Berufsrecht", "Gewerbeordnung (www.ris.bka.gv.at)");
  }
  return {rows, firmaVoll, adresse};
}

const { normSocial } = require("../../_lib/shared");

function buildLegalNav(o, stil, subdomain) {
  const tel = o.telefon || "";
  const telDisplay = tel;
  const telHref = tel ? `tel:${tel.replace(/\s/g,"")}` : "";
  const logoHtml = o.url_logo
    ? `<img src="${o.url_logo}" alt="${o.firmenname}" style="height:64px;width:auto;object-fit:contain;display:block;max-width:240px">`
    : o.firmenname;
  return `<style>
#sitenav{position:sticky;top:0;z-index:1000;background:${stil.p}}
.nav-inner{max-width:1200px;margin:0 auto;padding:0 24px;height:80px;display:flex;align-items:center;justify-content:space-between}
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
<a href="/s/${subdomain}#ueber-uns" class="nav-link">Über uns</a>
<a href="/s/${subdomain}#kontakt" class="nav-link">Kontakt</a>
${tel ? `<a href="${telHref}" class="nav-link nav-cta">${telDisplay}</a>` : ""}
</div>
<button class="hbg" id="hbg" aria-label="Menu">
<span class="hbg-bar"></span><span class="hbg-bar"></span><span class="hbg-bar"></span>
</button>
</div>
<div class="mob-menu" id="mob-menu">
<a href="/s/${subdomain}#leistungen" class="mob-link">Leistungen</a>
<a href="/s/${subdomain}#ueber-uns" class="mob-link">Über uns</a>
<a href="/s/${subdomain}#kontakt" class="mob-link">Kontakt</a>
${tel ? `<a href="${telHref}" class="mob-cta">${telDisplay} \u2014 Jetzt anrufen</a>` : ""}
</div>
</nav>
<script>
(function(){
var btn=document.getElementById('hbg');
var mob=document.getElementById('mob-menu');
var open=false;
function toggle(v){open=typeof v==='boolean'?v:!open;mob.style.display=open?'block':'none';btn.setAttribute('aria-expanded',open?'true':'false');}
btn.addEventListener('click',function(){toggle();});
document.querySelectorAll('.mob-link,.mob-cta').forEach(function(a){a.addEventListener('click',function(){toggle(false);});});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&open)toggle(false);});
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
${tel ? `<a href="tel:${tel.replace(/\s/g,"")}" style="color:#fff;font-weight:700;font-size:.9rem;text-decoration:none;opacity:.9">${tel}</a>` : ""}
${socialIconsHtml}
</div>
<div>
<div style="font-weight:700;font-size:.72rem;text-transform:uppercase;letter-spacing:.1em;opacity:.45;margin-bottom:16px">Navigation</div>
<div style="display:flex;flex-direction:column;gap:10px">
<a href="/s/${subdomain}#leistungen" style="color:rgba(255,255,255,.7);text-decoration:none;font-size:.88rem">Leistungen</a>
<a href="/s/${subdomain}#ueber-uns" style="color:rgba(255,255,255,.7);text-decoration:none;font-size:.88rem">Über uns</a>
<a href="/s/${subdomain}#kontakt" style="color:rgba(255,255,255,.7);text-decoration:none;font-size:.88rem">Kontakt</a>
<a href="/s/${subdomain}/impressum" style="color:rgba(255,255,255,.7);text-decoration:none;font-size:.88rem">Impressum</a>
<a href="/s/${subdomain}/datenschutz" style="color:rgba(255,255,255,.7);text-decoration:none;font-size:.88rem">Datenschutz</a>
</div>
</div>
<div>
<div style="font-weight:700;font-size:.72rem;text-transform:uppercase;letter-spacing:.1em;opacity:.45;margin-bottom:16px">Kontakt</div>
<div style="display:flex;flex-direction:column;gap:10px;font-size:.88rem;color:rgba(255,255,255,.7)">
${adresse ? `<span>${adresse}</span>` : ""}
${tel ? `<a href="tel:${tel.replace(/\s/g,"")}" style="color:rgba(255,255,255,.85);text-decoration:none;font-weight:600">${tel}</a>` : ""}
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
  const headingFont = stil.fontHeading ? `'${stil.fontHeading}',Georgia,serif` : fontFamily;
  const headingWeight = stil.fontHeading ? "500" : "700";
  const textColor = stil.t || "#374151";
  const textMuted = stil.tm || "#4b5563";
  const isElegant = !!(stil.fontHeading);
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
body{font-family:${fontFamily};background:#fff;color:${textColor};line-height:1.75;-webkit-font-smoothing:antialiased${isElegant ? ";letter-spacing:-.01em" : ""}}
.wrap{max-width:680px;margin:0 auto;padding:64px 28px 96px}
h1{font-family:${headingFont};font-size:${isElegant ? "1.8rem" : "1.6rem"};font-weight:${headingWeight};color:${stil.p};margin-bottom:4px;letter-spacing:-.02em}
.h1-sub{font-size:.82rem;color:${textMuted};margin-bottom:48px;font-weight:400}
h2{font-family:${headingFont};font-size:${isElegant ? "1.05rem" : ".95rem"};font-weight:${isElegant ? "500" : "700"};color:${stil.p};margin:48px 0 16px;padding-top:32px;border-top:1px solid ${stil.s}}
h2:first-of-type{border-top:none;margin-top:0;padding-top:0}
h3{font-size:.88rem;font-weight:600;color:${textColor};margin:24px 0 8px}
p,li{font-size:.88rem;color:${textMuted}}
a{color:${stil.p};text-decoration:underline;text-decoration-color:${stil.s};text-underline-offset:2px;transition:text-decoration-color .2s}
a:hover{text-decoration-color:${stil.p}}
table{width:100%;border-collapse:collapse;margin:16px 0}
td{padding:10px 16px 10px 0;font-size:.88rem;vertical-align:top;border-bottom:1px solid ${stil.s}}
td:first-child{font-weight:600;color:${stil.p};width:200px;white-space:nowrap}
ul{list-style:none;padding:0}
ul li{padding:4px 0;position:relative;padding-left:16px}
ul li::before{content:'\\2013';position:absolute;left:0;color:${textMuted}}
.meta{font-size:.78rem;color:${textMuted};margin-top:6px;line-height:1.6}
.note{margin-top:56px;padding-top:24px;border-top:1px solid ${stil.s};font-size:.8rem;color:${textMuted};line-height:1.7}
@media(max-width:640px){td:first-child{width:auto;white-space:normal}td{display:block;padding:4px 0}td:first-child{padding-top:12px;border-bottom:none}}
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
  const baseStil = STIL_CONFIG[o.stil] || STIL_CONFIG.klassisch;
  const stil = {...baseStil};
  // Custom-Overrides anwenden (gleiche Logik wie index.js)
  if (o.custom_color) stil.p = o.custom_color;
  if (o.custom_accent) stil.a = o.custom_accent;
  if (o.custom_bg) stil.bg = o.custom_bg;
  if (o.custom_sep) stil.s = o.custom_sep;
  if (o.custom_font) {
    const FONTS={dm_sans:"DM Sans",inter:"Inter",outfit:"Outfit",poppins:"Poppins",montserrat:"Montserrat",raleway:"Raleway",open_sans:"Open Sans",lato:"Lato",roboto:"Roboto",nunito:"Nunito",work_sans:"Work Sans",manrope:"Manrope",space_grotesk:"Space Grotesk",plus_jakarta:"Plus Jakarta Sans",rubik:"Rubik",source_serif:"Source Serif 4",playfair:"Playfair Display",lora:"Lora",merriweather:"Merriweather",dm_serif:"DM Serif Display"};
    const FURLS={dm_sans:"https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap",inter:"https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap",outfit:"https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap",poppins:"https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap",montserrat:"https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap",raleway:"https://fonts.googleapis.com/css2?family=Raleway:wght@400;500;600;700;800&display=swap",open_sans:"https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700;800&display=swap",lato:"https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&display=swap",roboto:"https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap",nunito:"https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap",work_sans:"https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;500;600;700;800&display=swap",manrope:"https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap",space_grotesk:"https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap",plus_jakarta:"https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap",rubik:"https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;600;700&display=swap",source_serif:"https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&display=swap",playfair:"https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&display=swap",lora:"https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&display=swap",merriweather:"https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700;900&display=swap",dm_serif:"https://fonts.googleapis.com/css2?family=DM+Serif+Display&display=swap"};
    if (FONTS[o.custom_font]) stil.font = FONTS[o.custom_font];
    if (FURLS[o.custom_font]) stil.url = FURLS[o.custom_font];
  }
  if (o.custom_radius) { const rm={"0":"0px","2":"2px","4":"4px","8":"8px","12":"12px","16":"16px"}; stil.r = rm[o.custom_radius] || o.custom_radius; }

  let content, title;

  if (page === "impressum") {
    title = "Impressum";
    const {rows: irows, firmaVoll, adresse} = buildImpressumRows(o);
    const tRows = irows.map(([l,v]) => `<tr><td>${l}</td><td>${v}</td></tr>`).join("");
    content = `<h1>Impressum</h1>
<p class="h1-sub">Angaben gemäß § 5 ECG und § 25 MedienG</p>

<table>${tRows}</table>

<h2>Online-Streitbeilegung</h2>
<p>Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung bereit: <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener">ec.europa.eu/consumers/odr</a></p>
<p>Wir sind nicht verpflichtet und nicht bereit, an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>

<h2>Haftung für Links</h2>
<p>Diese Website enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren nicht erkennbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.</p>

<h2>Urheberrecht</h2>
<p>Die Inhalte dieser Website unterliegen dem österreichischen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des Betreibers.</p>

${o.foto_credit ? `<h2>Bildnachweis</h2>
<p>${o.foto_credit.replace(/</g,"&lt;").replace(/>/g,"&gt;")}</p>` : ""}

<p class="note">Dieses Impressum wurde auf Basis der angegebenen Unternehmensdaten erstellt. Bitte prüfen Sie die Richtigkeit aller Informationen.</p>`;
  } else {
    title = "Datenschutzerklärung";
    const ufSuffix = {eu:"e.U.",gmbh:"GmbH",og:"OG",kg:"KG",ag:"AG"};
    const uf = o.unternehmensform || "";
    const firmaVoll = o.firmenname + (ufSuffix[uf] ? ` ${ufSuffix[uf]}` : "");
    const adresse = [o.adresse, [o.plz, o.ort].filter(Boolean).join(" ")].filter(Boolean).join(", ");

    content = `<h1>Datenschutzerklärung</h1>
<p class="h1-sub">Gemäß DSGVO (EU 2016/679) und TKG 2021</p>

<h2>Verantwortlicher</h2>
<p><strong>${firmaVoll}</strong><br>
${adresse}${o.email ? `<br>${o.email}` : ""}${o.telefon ? `<br>${o.telefon}` : ""}</p>

<h2>Auftragsverarbeiter</h2>

<h3>Website-Erstellung und Betrieb</h3>
<p>Wagner IT-Solutions e.U. (SiteReady), Operngasse 17/23, 1040 Wien. SiteReady erstellt und betreibt diese Website im Auftrag des Verantwortlichen auf Grundlage eines Auftragsverarbeitungsvertrags gemäß Art. 28 DSGVO.</p>

<h3>Hosting und Auslieferung</h3>
<p>Cloudflare Inc., 101 Townsend St, San Francisco, CA 94107, USA. Diese Website wird über das Cloudflare-CDN ausgeliefert. Dabei werden Zugriffsdaten (IP-Adresse, Zeitstempel, aufgerufene Seite, Browser) verarbeitet. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO. Drittlandtransfer USA auf Basis von Standardvertragsklauseln. Speicherdauer: bis 30 Tage. Weitere Informationen: <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener">cloudflare.com/privacypolicy</a></p>

<h3>Datenbank und Speicherung</h3>
<p>Supabase Inc. Website-Inhalte, Kontaktanfragen und Betriebsdaten werden in einer PostgreSQL-Datenbank bei Supabase gespeichert (Serverstandort: AWS eu-central-1, Frankfurt). Supabase verarbeitet Daten als Sub-Auftragsverarbeiter im Auftrag von Wagner IT-Solutions e.U. Rechtsgrundlage: Art. 6 Abs. 1 lit. b und f DSGVO. Speicherdauer: Vertragsdauer zuzüglich gesetzlicher Aufbewahrungsfrist. Weitere Informationen: <a href="https://supabase.com/privacy" target="_blank" rel="noopener">supabase.com/privacy</a></p>

<h2>Datenverarbeitungen</h2>

<h3>Webschriften (Google Fonts)</h3>
<p>Diese Website lädt Schriftarten von Google Fonts. Dabei wird Ihre IP-Adresse an Server von Google LLC, 1600 Amphitheatre Parkway, Mountain View, CA 94043, USA übertragen. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO. Drittlandtransfer USA auf Basis von Standardvertragsklauseln. Weitere Informationen: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">policies.google.com/privacy</a></p>

<h3>Karteneinbettung (Google Maps)</h3>
<p>Diese Website bindet Google Maps zur Standortanzeige ein. Beim Laden der Karte wird Ihre IP-Adresse an Server von Google LLC übertragen. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO. Drittlandtransfer USA auf Basis von Standardvertragsklauseln. Weitere Informationen: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">policies.google.com/privacy</a></p>

<h3>Kontaktformular</h3>
<p>Bei Nutzung des Kontaktformulars werden Name, E-Mail-Adresse, Telefonnummer (optional) und Ihre Nachricht verarbeitet. Die Daten werden in einer Datenbank bei Supabase (AWS eu-central-1, Frankfurt) gespeichert und ausschließlich zur Bearbeitung Ihrer Anfrage verwendet. Eine Weitergabe an Dritte findet nicht statt. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO. Speicherdauer: bis zur Erledigung der Anfrage, danach gesetzliche Aufbewahrungsfrist von 7 Jahren.</p>

<h3>Kontakt per Telefon und E-Mail</h3>
<p>Bei Kontaktaufnahme per Telefon oder E-Mail verarbeiten wir Ihre Kontaktdaten und Ihr Anliegen ausschließlich zur Bearbeitung Ihrer Anfrage. Eine Weitergabe an Dritte findet nicht statt. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO. Speicherdauer: bis zur Erledigung der Anfrage, danach gesetzliche Aufbewahrungsfrist von 7 Jahren.</p>

<h3>Cookies und Tracking</h3>
<p>Diese Website verwendet keine Cookies und keine Analyse- oder Werbe-Tools. Es werden keine Nutzerprofile erstellt.</p>

<h2>Ihre Rechte</h2>
<p>Sie haben gegenüber dem Verantwortlichen folgende Rechte hinsichtlich Ihrer personenbezogenen Daten:</p>
<ul>
<li>Auskunft über Ihre gespeicherten Daten (Art. 15 DSGVO)</li>
<li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
<li>Löschung Ihrer Daten (Art. 17 DSGVO)</li>
<li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
<li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
<li>Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</li>
</ul>
<p>Beschwerden können Sie bei der österreichischen Datenschutzbehörde einreichen: Barichgasse 40\u201342, 1030 Wien \u2014 <a href="https://www.dsb.gv.at" target="_blank" rel="noopener">dsb.gv.at</a></p>

<h2>Kontakt bei Datenschutzfragen</h2>
<p>Bei Fragen zum Datenschutz wenden Sie sich direkt an den Verantwortlichen: ${o.email ? `<a href="mailto:${o.email}">${o.email}</a>` : firmaVoll}${o.telefon ? ` \u2014 ${o.telefon}` : ""}</p>

<p class="note">Diese Datenschutzerklärung wurde auf Basis der eingesetzten Dienste und technischen Parameter erstellt. Für eine rechtsverbindliche Prüfung empfehlen wir die Kontrolle durch einen Datenschutzexperten.</p>`;
  }

  const html = legalShell(o, stil, subdomain, title, content);
  return new Response(html, {headers: {"Content-Type": "text/html; charset=utf-8"}});
}
