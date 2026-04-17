/* ═══ Merge: Import-Beschreibungen beibehalten, fehlende mit KI ergaenzen ═══ */
export function mergeDescriptions(imported, generated) {
  if (!imported || Object.keys(imported).length === 0) return generated || {};
  if (!generated) return imported;
  const merged = {...generated};
  for (const [key, val] of Object.entries(imported)) {
    if (val && val.trim()) merged[key] = val;
  }
  return merged;
}

/* ═══ Nav-Builder ═══ */
export function buildNav(o, pal, stil) {
  const tel = o.telefon || "";
  return `<style>
#sitenav{position:sticky;top:0;z-index:1000;background:var(--primary);transition:box-shadow .3s ease,background .3s ease}
#sitenav.scrolled{box-shadow:0 2px 24px rgba(0,0,0,.18)}
.nav-inner{max-width:1200px;margin:0 auto;padding:0 24px;height:80px;display:flex;align-items:center;justify-content:space-between;transition:height .3s ease}
#sitenav.scrolled .nav-inner{height:56px}
.nav-links{display:flex;align-items:center;gap:28px}
.nav-link{color:rgba(255,255,255,.85);text-decoration:none;font-size:.88rem;font-weight:500;transition:opacity .2s;display:inline-flex;align-items:center;min-height:44px;padding:0 4px}
.nav-link:hover{opacity:.7}
.nav-cta{background:var(--accent);color:#fff!important;padding:11px 22px;border-radius:${stil.btnR || stil.r};font-weight:700;font-size:.85rem;white-space:nowrap;transition:all .25s;display:inline-flex;align-items:center;min-height:44px}
.nav-cta:hover{opacity:.85!important}
.hbg{display:none;flex-direction:column;gap:5px;background:none;border:none;cursor:pointer;padding:8px;min-width:44px;min-height:44px;align-items:center;justify-content:center}
.hbg-bar{width:24px;height:2px;background:rgba(255,255,255,.9);border-radius:2px;transition:transform .3s ease,opacity .3s ease}
.hbg.open .hbg-bar:nth-child(1){transform:translateY(7px) rotate(45deg)}
.hbg.open .hbg-bar:nth-child(2){opacity:0}
.hbg.open .hbg-bar:nth-child(3){transform:translateY(-7px) rotate(-45deg)}
.mob-menu{position:fixed;top:68px;left:0;right:0;background:#fff;box-shadow:0 8px 32px rgba(0,0,0,.15);padding:8px 24px 20px;z-index:999;opacity:0;transform:translateY(-6px);pointer-events:none;transition:opacity .2s ease,transform .2s ease}
.mob-menu.open{opacity:1;transform:translateY(0);pointer-events:auto}
.mob-bd{position:fixed;inset:0;top:68px;background:rgba(0,0,0,.32);z-index:998;opacity:0;pointer-events:none;transition:opacity .2s ease}
.mob-bd.open{opacity:1;pointer-events:auto}
.mob-link{display:block;padding:14px 0;font-size:1rem;font-weight:600;color:var(--primary);text-decoration:none;border-bottom:1px solid #f1f5f9}
.mob-cta{display:block;margin-top:12px;background:var(--accent);color:#fff;text-align:center;padding:15px;border-radius:${stil.btnR || stil.r};font-weight:700;font-size:1rem;text-decoration:none}
@media(max-width:768px){.nav-links{display:none}.hbg{display:flex}}
</style>
<nav id="sitenav">
<div class="nav-inner">
<a href="#" id="site-nav-logo" class="nav-logo" style="font-weight:800;font-size:1.05rem;color:#fff;text-decoration:none;letter-spacing:-.02em">{{FIRMENNAME}}</a>
<div class="nav-links">
<a href="#leistungen" class="nav-link">Leistungen</a>
<a href="#ueber-uns" class="nav-link">Über uns</a>
<a href="#kontakt" class="nav-link">Kontakt</a>
${tel ? `<a href="{{TEL_HREF}}" class="nav-link nav-cta">{{TEL_DISPLAY}}</a>` : ""}
</div>
<button class="hbg" id="hbg" aria-label="Menu">
<span class="hbg-bar"></span><span class="hbg-bar"></span><span class="hbg-bar"></span>
</button>
</div>
<div class="mob-bd" id="mob-bd"></div>
<div class="mob-menu" id="mob-menu">
<a href="#leistungen" class="mob-link">Leistungen</a>
<a href="#ueber-uns" class="mob-link">Über uns</a>
<a href="#kontakt" class="mob-link">Kontakt</a>
${tel ? `<a href="{{TEL_HREF}}" class="mob-cta">{{TEL_DISPLAY}} &mdash; Jetzt anrufen</a>` : ""}
</div>
</nav>
<script>
(function(){
var nav=document.getElementById('sitenav');
var btn=document.getElementById('hbg');
var mob=document.getElementById('mob-menu');
var bd=document.getElementById('mob-bd');
var open=false;
function toggle(v){open=typeof v==='boolean'?v:!open;if(open){mob.classList.add('open');bd.classList.add('open');document.body.style.overflow='hidden';}else{mob.classList.remove('open');bd.classList.remove('open');document.body.style.overflow='';}btn.setAttribute('aria-expanded',open?'true':'false');if(open)btn.classList.add('open');else btn.classList.remove('open');}
btn.addEventListener('click',function(){toggle();});
bd.addEventListener('click',function(){toggle(false);});
document.querySelectorAll('.mob-link,.mob-cta').forEach(function(a){a.addEventListener('click',function(){toggle(false);});});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&open)toggle(false);});
var sc=false;window.addEventListener('scroll',function(){var s=window.scrollY>60;if(s!==sc){sc=s;if(s)nav.classList.add('scrolled');else nav.classList.remove('scrolled');}},{passive:true});
})();
</script>`;
}

/* ═══ Footer-Builder ═══ */
export function buildFooter(o, pal, year, sub) {
  const tel      = o.telefon || "";
  const email    = o.email || "";
  const adresse  = [o.adresse, [o.plz, o.ort].filter(Boolean).join(" ")].filter(Boolean).join(", ");
  const hasSocials = !!(o.facebook || o.instagram || o.linkedin || o.tiktok);
  return `<footer style="background:var(--primary);color:#fff;padding:56px 0 0;font-family:inherit">
<div style="max-width:1200px;margin:0 auto;padding:0 24px">
<div style="display:grid;grid-template-columns:2fr 1fr 1fr;gap:48px;padding-bottom:48px" class="ft-grid">
<div>
<div style="font-weight:800;font-size:1.05rem;margin-bottom:12px;letter-spacing:-.01em">{{FIRMENNAME}}</div>
<p style="opacity:.65;line-height:1.75;font-size:.85rem;margin-bottom:16px;max-width:280px">{{KURZBESCHREIBUNG}}</p>
${tel ? `<a href="{{TEL_HREF}}" style="color:#fff;font-weight:700;font-size:.9rem;text-decoration:none;opacity:.9">{{TEL_DISPLAY}}</a>` : ""}
{{SOCIAL_ICONS}}
</div>
<div>
<div style="font-weight:700;font-size:.72rem;text-transform:uppercase;letter-spacing:.1em;opacity:.45;margin-bottom:16px">Navigation</div>
<div style="display:flex;flex-direction:column;gap:10px">
<a href="#leistungen" style="color:rgba(255,255,255,.7);text-decoration:none;font-size:.88rem">Leistungen</a>
<a href="#ueber-uns" style="color:rgba(255,255,255,.7);text-decoration:none;font-size:.88rem">Über uns</a>
<a href="#kontakt" style="color:rgba(255,255,255,.7);text-decoration:none;font-size:.88rem">Kontakt</a>
<a href="/s/${sub}/impressum" style="color:rgba(255,255,255,.7);text-decoration:none;font-size:.88rem">Impressum</a>
<a href="/s/${sub}/datenschutz" style="color:rgba(255,255,255,.7);text-decoration:none;font-size:.88rem">Datenschutz</a>
</div>
</div>
<div>
<div style="font-weight:700;font-size:.72rem;text-transform:uppercase;letter-spacing:.1em;opacity:.45;margin-bottom:16px">Kontakt</div>
<div style="display:flex;flex-direction:column;gap:10px;font-size:.88rem;color:rgba(255,255,255,.7)">
${adresse ? `<span>{{ADRESSE_VOLL}}</span>` : ""}
${tel     ? `<a href="{{TEL_HREF}}" style="color:rgba(255,255,255,.85);text-decoration:none;font-weight:600">{{TEL_DISPLAY}}</a>` : ""}
${email   ? `<a href="mailto:{{EMAIL}}" style="color:rgba(255,255,255,.7);text-decoration:none">{{EMAIL}}</a>` : ""}
</div>
</div>
</div>
<div style="border-top:1px solid rgba(255,255,255,.1);padding:20px 0;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
<span style="opacity:.4;font-size:.78rem">&copy; ${year} {{FIRMENNAME}}</span>
<div style="display:flex;gap:20px">
<a href="/s/${sub}/impressum" style="opacity:.4;font-size:.78rem;color:#fff;text-decoration:none">Impressum</a>
<a href="/s/${sub}/datenschutz" style="opacity:.4;font-size:.78rem;color:#fff;text-decoration:none">Datenschutz</a>
</div>
</div>
</div>
</footer>
<style>@media(max-width:900px){.ft-grid{grid-template-columns:1fr 1fr!important}}@media(max-width:540px){.ft-grid{grid-template-columns:1fr!important}}@media(max-width:768px){footer a{padding:8px 0!important;display:inline-block}footer .ft-grid>div>div[style*="flex-direction:column"] a{padding:10px 0!important}}</style>`;
}

/* ═══ Impressum-Builder (ECG-konform, rechtsformspezifisch) ═══ */
export function buildImpressum(o, pal, year) {
  const uf = o.unternehmensform || "";
  const ufSuffix = {eu:"e.U.",gmbh:"GmbH",og:"OG",kg:"KG",ag:"AG"};
  const firmaVoll = o.firmenname + (ufSuffix[uf] ? ` ${ufSuffix[uf]}` : "");
  const sitz = [o.plz, o.ort].filter(Boolean).join(" ");
  const adresse = [o.adresse, sitz].filter(Boolean).join(", ");
  const rows = [];
  const add = (l, v) => { if (v && String(v).trim()) rows.push([l, String(v).trim()]); };

  add("Medieninhaber & Herausgeber", firmaVoll);

  if (uf === "einzelunternehmen") {
    const inhaberName = [o.vorname, o.nachname].filter(Boolean).join(" ") || o.firmenname;
    add("Inhaber", inhaberName); add("Anschrift", adresse);
    add("Unternehmensgegenstand", o.unternehmensgegenstand);
  } else if (uf === "eu") {
    add("Sitz", sitz); add("Firmenbuchnummer", o.firmenbuchnummer);
    add("Firmenbuchgericht", o.firmenbuchgericht);
    if (o.liquidation) add("Hinweis", "Gesellschaft in Liquidation");
  } else if (uf === "gmbh") {
    add("Sitz", sitz); add("Firmenbuchnummer", o.firmenbuchnummer);
    add("Firmenbuchgericht", o.firmenbuchgericht);
    add("Geschäftsführer", o.geschaeftsfuehrer);
    if (o.liquidation) add("Hinweis", "Gesellschaft in Liquidation");
  } else if (uf === "og" || uf === "kg") {
    add("Sitz", sitz); add("Firmenbuchnummer", o.firmenbuchnummer);
    add("Firmenbuchgericht", o.firmenbuchgericht);
    if (o.liquidation) add("Hinweis", "Gesellschaft in Liquidation");
  } else if (uf === "ag") {
    add("Sitz", sitz); add("Firmenbuchnummer", o.firmenbuchnummer);
    add("Firmenbuchgericht", o.firmenbuchgericht);
    add("Vorstand", o.vorstand); add("Aufsichtsrat", o.aufsichtsrat);
    if (o.liquidation) add("Hinweis", "Gesellschaft in Liquidation");
  } else if (uf === "verein") {
    add("Vereinsname", o.firmenname); add("Sitz", sitz);
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

  const tRows = rows.map(([l,v]) =>
    `<tr><td style="padding:7px 20px 7px 0;font-weight:600;white-space:nowrap;vertical-align:top;color:var(--primary);font-size:.85rem">${l}</td><td style="padding:7px 0;color:#374151;font-size:.85rem">${v}</td></tr>`
  ).join("");

  const dsgvo = `Diese Website verwendet keine Cookies außer technisch notwendigen. Es findet kein Tracking statt. Ihre personenbezogenen Daten werden ausschließlich zur Bearbeitung Ihrer Anfragen genutzt und nicht an Dritte weitergegeben. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO. Verantwortlicher: ${firmaVoll}, ${adresse}.`;

  return `<section id="impressum" style="background:#f8fafc;padding:64px 0;border-top:2px solid var(--sep)">
<div style="max-width:960px;margin:0 auto;padding:0 24px">
<h2 style="font-size:1.3rem;font-weight:800;color:var(--primary);margin-bottom:24px;letter-spacing:-.01em">Impressum</h2>
<table style="border-collapse:collapse;width:100%">${tRows}</table>
<div id="datenschutz" style="margin-top:48px;padding-top:40px;border-top:1px solid var(--sep)">
<h3 style="font-size:1rem;font-weight:700;color:var(--primary);margin-bottom:12px">Datenschutzerklärung</h3>
<p style="font-size:.85rem;line-height:1.8;color:#4b5563;max-width:720px">${dsgvo}</p>
</div>
<p style="margin-top:32px;font-size:.78rem;color:#9ca3af">&copy; ${year} ${o.firmenname}</p>
</div></section>`;
}
