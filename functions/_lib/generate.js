/* ═══ Nav-Builder ═══ */
function buildNav(o, pal, stil) {
  const tel = o.telefon || "";
  return `<style>
#sitenav{position:sticky;top:0;z-index:1000;background:var(--primary);transition:box-shadow .3s ease,background .3s ease}
#sitenav.scrolled{box-shadow:0 2px 24px rgba(0,0,0,.18)}
.nav-inner{max-width:1200px;margin:0 auto;padding:0 24px;height:80px;display:flex;align-items:center;justify-content:space-between;transition:height .3s ease}
#sitenav.scrolled .nav-inner{height:56px}
.nav-links{display:flex;align-items:center;gap:28px}
.nav-link{color:rgba(255,255,255,.85);text-decoration:none;font-size:.88rem;font-weight:500;transition:opacity .2s}
.nav-link:hover{opacity:.7}
.nav-cta{background:var(--accent);color:#fff!important;padding:9px 18px;border-radius:${stil.btnR || stil.r};font-weight:700;font-size:.85rem;white-space:nowrap;transition:all .25s}
.nav-cta:hover{opacity:.85!important}
.hbg{display:none;flex-direction:column;gap:5px;background:none;border:none;cursor:pointer;padding:6px}
.hbg-bar{width:24px;height:2px;background:rgba(255,255,255,.9);border-radius:2px;transition:transform .3s ease,opacity .3s ease}
.hbg.open .hbg-bar:nth-child(1){transform:translateY(7px) rotate(45deg)}
.hbg.open .hbg-bar:nth-child(2){opacity:0}
.hbg.open .hbg-bar:nth-child(3){transform:translateY(-7px) rotate(-45deg)}
.mob-menu{display:none;position:fixed;top:68px;left:0;right:0;background:#fff;box-shadow:0 8px 32px rgba(0,0,0,.12);padding:16px 24px 24px;z-index:999}
.mob-link{display:block;padding:12px 0;font-size:1rem;font-weight:600;color:var(--primary);text-decoration:none;border-bottom:1px solid #f1f5f9}
.mob-cta{display:block;margin-top:16px;background:var(--accent);color:#fff;text-align:center;padding:14px;border-radius:${stil.btnR || stil.r};font-weight:700;font-size:1rem;text-decoration:none}
@media(max-width:768px){.nav-links{display:none}.hbg{display:flex}}
</style>
<nav id="sitenav">
<div class="nav-inner">
<a href="#" id="site-nav-logo" class="nav-logo" style="font-weight:800;font-size:1.05rem;color:#fff;text-decoration:none;letter-spacing:-.02em">{{FIRMENNAME}}</a>
<div class="nav-links">
<a href="#leistungen" class="nav-link">Leistungen</a>
<a href="#ueber-uns" class="nav-link">\u00dcber uns</a>
<a href="#kontakt" class="nav-link">Kontakt</a>
${tel ? `<a href="{{TEL_HREF}}" class="nav-link nav-cta">{{TEL_DISPLAY}}</a>` : ""}
</div>
<button class="hbg" id="hbg" aria-label="Menu">
<span class="hbg-bar"></span><span class="hbg-bar"></span><span class="hbg-bar"></span>
</button>
</div>
<div class="mob-menu" id="mob-menu">
<a href="#leistungen" class="mob-link">Leistungen</a>
<a href="#ueber-uns" class="mob-link">\u00dcber uns</a>
<a href="#kontakt" class="mob-link">Kontakt</a>
${tel ? `<a href="{{TEL_HREF}}" class="mob-cta">{{TEL_DISPLAY}} &mdash; Jetzt anrufen</a>` : ""}
</div>
</nav>
<script>
(function(){
var nav=document.getElementById('sitenav');
var btn=document.getElementById('hbg');
var mob=document.getElementById('mob-menu');
var open=false;
btn.addEventListener('click',function(){open=!open;mob.style.display=open?'block':'none';if(open)btn.classList.add('open');else btn.classList.remove('open');});
document.querySelectorAll('.mob-link,.mob-cta').forEach(function(a){a.addEventListener('click',function(){open=false;mob.style.display='none';btn.classList.remove('open');});});
var sc=false;window.addEventListener('scroll',function(){var s=window.scrollY>60;if(s!==sc){sc=s;if(s)nav.classList.add('scrolled');else nav.classList.remove('scrolled');}},{passive:true});
})();
</script>`;
}

/* ═══ Footer-Builder ═══ */
function normSocial(v) {
  if (!v) return "";
  v = v.trim().replace(/\/+$/, "");
  if (v.startsWith("http")) return v;
  return "https://" + v;
}

function buildFooter(o, pal, year, sub) {
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
<a href="#ueber-uns" style="color:rgba(255,255,255,.7);text-decoration:none;font-size:.88rem">\u00dcber uns</a>
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
<style>@media(max-width:900px){.ft-grid{grid-template-columns:1fr 1fr!important}}@media(max-width:540px){.ft-grid{grid-template-columns:1fr!important}}</style>`;
}

/* ═══ Impressum-Builder (ECG-konform, rechtsformspezifisch) ═══ */
function buildImpressum(o, pal, year) {
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
    add("Gesch\u00e4ftsf\u00fchrer", o.geschaeftsfuehrer);
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

  const tRows = rows.map(([l,v]) =>
    `<tr><td style="padding:7px 20px 7px 0;font-weight:600;white-space:nowrap;vertical-align:top;color:${pal.p};font-size:.85rem">${l}</td><td style="padding:7px 0;color:#374151;font-size:.85rem">${v}</td></tr>`
  ).join("");

  const dsgvo = `Diese Website verwendet keine Cookies au\u00dfer technisch notwendigen. Es findet kein Tracking statt. Ihre personenbezogenen Daten werden ausschlie\u00dflich zur Bearbeitung Ihrer Anfragen genutzt und nicht an Dritte weitergegeben. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO. Verantwortlicher: ${firmaVoll}, ${adresse}.`;

  return `<section id="impressum" style="background:#f8fafc;padding:64px 0;border-top:2px solid ${pal.s}">
<div style="max-width:960px;margin:0 auto;padding:0 24px">
<h2 style="font-size:1.3rem;font-weight:800;color:${pal.p};margin-bottom:24px;letter-spacing:-.01em">Impressum</h2>
<table style="border-collapse:collapse;width:100%">${tRows}</table>
<div id="datenschutz" style="margin-top:48px;padding-top:40px;border-top:1px solid ${pal.s}">
<h3 style="font-size:1rem;font-weight:700;color:${pal.p};margin-bottom:12px">Datenschutzerkl\u00e4rung</h3>
<p style="font-size:.85rem;line-height:1.8;color:#4b5563;max-width:720px">${dsgvo}</p>
</div>
<p style="margin-top:32px;font-size:.78rem;color:#9ca3af">&copy; ${year} ${o.firmenname}</p>
</div></section>`;
}

/* ═══ Design-Templates (synchron mit STYLES_MAP in App.js) ═══ */
const STIL = {
  klassisch: {
    p:"#0f2b5b", a:"#2563eb", bg:"#f8fafc", s:"#e2e8f0",
    font: "Inter",
    url: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap",
    r: "4px", rLg: "6px", btnR: "4px",
    feel: "serioes, klar, vertrauenswuerdig, zeitlos, geschaeftlich professionell",
    heroDecor: "3 horizontale Accent-Linien oben rechts (position:absolute, top:48px, right:32px, width:48px/72px/36px, height:2px, background:var(--accent), opacity:.4, gestaffelt mit margin-bottom:8px).",
    cardStyle: "border:1px solid var(--sep); border-left:3px solid var(--accent); box-shadow:none; padding:28px 24px. Hover: transform:translateY(-3px), box-shadow:0 8px 24px rgba(0,0,0,.1).",
    ueberStyle: "Checkmark-Liste: Listenpunkte mit einem einfachen Haken (vor dem Text, Farbe var(--accent), font-weight:700). Sachlicher, direkter Ton.",
  },
  modern: {
    p:"#0f172a", a:"#6366f1", bg:"#fafafa", s:"#f0f0f0",
    font: "Plus Jakarta Sans",
    url: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap",
    r: "12px", rLg: "16px", btnR: "100px",
    feel: "modern, dynamisch, frisch, mit Akzenten, einladend",
    heroDecor: "Grosser Hintergrund-Blob: position:absolute, width:480px, height:480px, border-radius:60% 40% 55% 45%, background:var(--accent), opacity:.1, top:-80px, right:-80px, filter:blur(64px), pointer-events:none.",
    cardStyle: "border-radius:16px; box-shadow:0 4px 24px rgba(0,0,0,.07); padding:32px 28px; overflow:hidden; border:none. Farbiger Top-Streifen: before-Element oder border-top:4px solid var(--accent). Hover: transform:translateY(-4px), box-shadow:0 12px 32px rgba(0,0,0,.1).",
    ueberStyle: "Kleine runde Icons (36px, background:var(--accent)22, color:var(--accent), border-radius:50%, display:inline-flex, align-items:center, justify-content:center) vor jedem Vorteilspunkt. Freundlicher, einladender Ton.",
  },
  elegant: {
    p:"#292524", a:"#57534e", bg:"#fafaf9", s:"#e7e5e4",
    font: "Inter",
    url: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap",
    r: "2px", rLg: "4px", btnR: "2px",
    feel: "hochwertig, ruhig, minimalistisch, Premium, zurueckhaltend elegant",
    heroDecor: "Klassischer Akzent-Unterstrich direkt unter H1: display:block, width:80px, height:3px, background:var(--accent), margin:16px 0 24px.",
    cardStyle: "border:1px solid var(--sep); padding:28px 24px; box-shadow:none. Hover: background:#fafaf8, box-shadow:0 4px 16px rgba(0,0,0,.06).",
    ueberStyle: "Klassische Strich-Liste: Vorteilspunkte mit einem langen Gedankenstrich (–) in Akzentfarbe als Marker. Ruhiger, Premium-Ton mit viel Whitespace.",
  },
};

/* Custom-Fonts Mapping (fuer stil=custom) */
const CUSTOM_FONT_URLS = {
  dm_sans:"https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap",
  inter:"https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap",
  outfit:"https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap",
  poppins:"https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap",
  montserrat:"https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap",
  raleway:"https://fonts.googleapis.com/css2?family=Raleway:wght@400;500;600;700;800&display=swap",
  open_sans:"https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700;800&display=swap",
  lato:"https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&display=swap",
  roboto:"https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap",
  nunito:"https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap",
  work_sans:"https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;500;600;700;800&display=swap",
  manrope:"https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap",
  space_grotesk:"https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap",
  plus_jakarta:"https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap",
  rubik:"https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;600;700&display=swap",
  source_serif:"https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&display=swap",
  playfair:"https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&display=swap",
  lora:"https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&display=swap",
  merriweather:"https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700;900&display=swap",
  dm_serif:"https://fonts.googleapis.com/css2?family=DM+Serif+Display&display=swap",
};
const CUSTOM_FONT_FAMILIES = {
  dm_sans:"'DM Sans',sans-serif",inter:"'Inter',sans-serif",outfit:"'Outfit',sans-serif",poppins:"'Poppins',sans-serif",montserrat:"'Montserrat',sans-serif",raleway:"'Raleway',sans-serif",open_sans:"'Open Sans',sans-serif",lato:"'Lato',sans-serif",roboto:"'Roboto',sans-serif",nunito:"'Nunito',sans-serif",work_sans:"'Work Sans',sans-serif",manrope:"'Manrope',sans-serif",space_grotesk:"'Space Grotesk',sans-serif",plus_jakarta:"'Plus Jakarta Sans',sans-serif",rubik:"'Rubik',sans-serif",source_serif:"'Source Serif 4',Georgia,serif",playfair:"'Playfair Display',Georgia,serif",lora:"'Lora',Georgia,serif",merriweather:"'Merriweather',Georgia,serif",dm_serif:"'DM Serif Display',Georgia,serif",
};

function buildCustomStil(o) {
  const p = o.custom_color || "#2563eb";
  const a = o.custom_accent || p; // Accent = eigene Farbe oder Primary als Fallback
  const bg = o.custom_bg || "#fafafa";
  const s = o.custom_sep || "#e5e7eb";
  const fk = o.custom_font || "dm_sans";
  const fontFamily = CUSTOM_FONT_FAMILIES[fk] || CUSTOM_FONT_FAMILIES.dm_sans;
  const fontName = fontFamily.split(",")[0].replace(/'/g,"");
  // Radius aus Portal-Einstellung oder Standard
  const radiusMap = {"0":"0px","2":"2px","4":"4px","8":"8px","12":"12px","16":"16px"};
  const r = radiusMap[o.custom_radius] || "8px";
  const rLg = parseInt(r) >= 8 ? (parseInt(r) + 4) + "px" : r;
  const btnR = parseInt(r) >= 12 ? "100px" : r; // Ab 12px Pill-Buttons
  return {
    p, a, bg, s,
    font: fontName,
    url: CUSTOM_FONT_URLS[fk] || CUSTOM_FONT_URLS.dm_sans,
    r, rLg, btnR,
    feel: "individuell, passend zum eigenen Branding, professionell",
    heroDecor: "Dezenter Gradient-Overlay mit der Primaerfarbe.",
    cardStyle: `border:1px solid var(--sep); border-radius:${rLg}; padding:28px 24px; box-shadow:0 1px 3px rgba(0,0,0,.05). Hover: transform:translateY(-3px), box-shadow:0 8px 24px rgba(0,0,0,.08).`,
    ueberStyle: "Checkmark-Liste mit Haken in Akzentfarbe. Professioneller, klarer Ton.",
  };
}

/* Exportierte Core-Funktion fuer direkten Aufruf (z.B. aus start-build.js) */
export async function generateWebsite(order_id, env) {
  const { createLogger } = await import("./log.js");
  const log = createLogger(env);
  log.time("generate");

  /* Bestellung laden */
  const r = await fetch(
    `${env.SUPABASE_URL}/rest/v1/orders?id=eq.${order_id}&select=*`,
    {headers: {"apikey": env.SUPABASE_SERVICE_KEY, "Authorization": `Bearer ${env.SUPABASE_SERVICE_KEY}`}}
  );
  const rows = await r.json();
  if (!rows.length) throw new Error("Order not found");
  const o = rows[0];
  await log.info(order_id, "generate_start", {firmenname: o.firmenname, stil: o.stil, branche: o.branche});

  /* Konfiguration */
  const stil = o.stil === "custom" ? buildCustomStil(o) : (STIL[o.stil] || STIL.klassisch);
  const pal  = { p: stil.p, a: stil.a, bg: stil.bg, s: stil.s };
  const sub  = o.subdomain || (o.firmenname || "firma").toLowerCase().replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,"");
  const betriebstyp = o.branche_label || "Betrieb";

  const rawLeistungen = [...(o.leistungen || [])];
  if (o.extra_leistung?.trim()) {
    const extras = o.extra_leistung.split(/[,\n]+/).map(s => s.trim()).filter(Boolean);
    rawLeistungen.push(...extras);
  }
  // Leistungsnamen kapitalisieren (erster Buchstabe gross)
  const leistungen = rawLeistungen.map(l => l.charAt(0).toUpperCase() + l.slice(1));
  const oez = o.oeffnungszeiten_custom || o.oeffnungszeiten || "Nach Vereinbarung";
  const year = new Date().getFullYear();
  const impressumHtml = buildImpressum(o, pal, year);
  const navHtml      = buildNav(o, pal, stil);
  const footerHtml   = buildFooter(o, pal, year, sub);

  /* ─── Trust-Bar Items (nur echte Daten, keine Emojis) ─── */
  const trustItems = [];
  if (o.notdienst) trustItems.push("24/7 Notdienst");
  if (o.meisterbetrieb) trustItems.push("Meisterbetrieb");
  trustItems.push(o.einsatzgebiet || o.bundesland || "Oesterreich");
  if (o.kostenvoranschlag) trustItems.push("Kostenloser Kostenvoranschlag");
  if (leistungen.length >= 3) trustItems.push(`${leistungen.length} Leistungsbereiche`);
  const oezLabel = o.oeffnungszeiten_custom || ({"mo-fr-8-17":"Mo\u2013Fr 8\u201317 Uhr","mo-fr-7-16":"Mo\u2013Fr 7\u201316 Uhr","mo-fr-8-18":"Mo\u2013Fr 8\u201318 Uhr","mo-sa-8-17":"Mo\u2013Sa 8\u201317 Uhr","mo-sa-8-12":"Mo\u2013Sa 8\u201312 Uhr","vereinbarung":"Nach Vereinbarung"}[o.oeffnungszeiten]) || "Nach Vereinbarung";
  if (trustItems.length < 4) trustItems.push(oezLabel);
  const trustBar = trustItems.slice(0, 4).join("  \u00b7  ");

  /* Trust-Leiste + Kontakt-Infos werden serve-time injiziert */


  /* ─── Logo URL ─── */
  const logoUrl = o.url_logo || null;
  const preislisteUrl = o.url_preisliste || null;

  /* ─── Social Media ─── */
  const socials = [];
  if (o.facebook) socials.push({name:"Facebook",url:normSocial(o.facebook)});
  if (o.instagram) socials.push({name:"Instagram",url:normSocial(o.instagram)});
  if (o.linkedin) socials.push({name:"LinkedIn",url:normSocial(o.linkedin)});
  if (o.tiktok) socials.push({name:"TikTok",url:normSocial(o.tiktok)});

  /* ─── CTA-Texte ─── */
  const ctaPrimary = o.buchungslink ? "Termin buchen" : o.notdienst ? "Notdienst anrufen" : o.kostenvoranschlag ? "Kostenlosen KV anfordern" : o.erstgespraech_gratis ? "Gratis Erstgespräch" : "Jetzt kontaktieren";
  const ctaPrimaryHref = o.buchungslink || (o.telefon ? "{{TEL_HREF}}" : "#kontakt");
  const ctaSecondary = "Leistungen ansehen";

  /* ─── Meta ─── */
  const metaTitle = `${o.firmenname} \u2013 ${o.spezialisierung || o.branche_label || o.branche} in ${o.ort || o.bundesland || "\u00d6sterreich"}`;
  const metaDesc  = (o.kurzbeschreibung || `${o.branche_label || "Ihr Betrieb"} in ${o.ort || "\u00d6sterreich"} \u2013 Jetzt Kontakt aufnehmen!`).slice(0, 155);
  const siteUrl   = `https://sitereadyprototype.pages.dev/s/${sub}`;

  /* Trust-Leiste wird serve-time injiziert (<!-- TRUST --> Placeholder) */


  /* ─── Preisliste HTML ─── */
  const preislisteHtml = preislisteUrl ? `<a href="${preislisteUrl}" target="_blank" class="btn" style="margin-top:24px;background:var(--bg);color:var(--primary);border:1px solid var(--sep)">Preisliste ansehen</a>` : "";

  /* ─── Social HTML fuer Kontakt ─── */
  const socialSvgs = {
    facebook: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>`,
    instagram: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/></svg>`,
    linkedin: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>`,
    tiktok: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.77 0 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 1 0 5.55 6.29V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75c-.34 0-.68-.03-1.02-.06z"/></svg>`,
  };
  const socialHtml = socials.length ? `<div class="kontakt-social">${socials.map(s => `<a href="${s.url}" target="_blank" rel="noopener" aria-label="${s.name}">${socialSvgs[s.name.toLowerCase()] || s.name}</a>`).join("")}</div>` : "";

  /* ─── Buchungslink CTA Sektion ─── */
  const buchungslinkHtml = o.buchungslink ? `<section class="sec termin-cta"><div class="wrap"><h2>Jetzt Termin buchen</h2><p>Buchen Sie bequem online &ndash; rund um die Uhr.</p><a href="${o.buchungslink}" target="_blank" class="btn btn-accent" style="font-size:1rem;padding:16px 36px">Termin buchen</a></div></section>` : "";

  /* ─── Sticky CTA HTML ─── */
  const stickyCtaHtml = o.telefon ? `<a href="${o.buchungslink || "{{TEL_HREF}}"}">${o.buchungslink ? "Termin buchen" : "Jetzt anrufen \u2013 {{TEL_DISPLAY}}"}</a>` : "";

  /* ═══ TEXT-GENERIERUNG via Claude (NUR Texte, kein HTML) ═══ */

  // Importierte Daten als Kontext sammeln
  const importContext = [];
  if (o.spezialisierung) importContext.push(`SPEZIALISIERUNG: ${o.spezialisierung}`);
  if (o.text_ueber_uns) importContext.push(`BESTEHENDER UEBER-UNS-TEXT (als Grundlage verwenden, Stil anpassen):\n${o.text_ueber_uns}`);
  if (o.gut_zu_wissen) importContext.push(`BESTEHENDE KUNDENHINWEISE (uebernehmen wenn sinnvoll): ${o.gut_zu_wissen}`);
  if (o.leistungen_beschreibungen && Object.keys(o.leistungen_beschreibungen).length > 0) {
    importContext.push(`BESTEHENDE LEISTUNGSBESCHREIBUNGEN (als Basis verwenden):\n${Object.entries(o.leistungen_beschreibungen).map(([k,v])=>`- ${k}: ${v}`).join("\n")}`);
  }

  // Merkmale als Kontext
  const merkmaleText = [];
  if (o.meisterbetrieb) merkmaleText.push("Meisterbetrieb");
  if (o.barrierefrei) merkmaleText.push("Barrierefreier Zugang");
  if (o.parkplaetze) merkmaleText.push("Kundenparkplätze");
  if (o.notdienst) merkmaleText.push("24/7 Notdienst");
  if (o.erstgespraech_gratis) merkmaleText.push("Gratis Erstgespräch");
  if (o.online_beratung) merkmaleText.push("Online-Beratung möglich");
  if (o.hausbesuche) merkmaleText.push("Hausbesuche möglich");
  if (o.kostenvoranschlag) merkmaleText.push("Kostenloser Kostenvoranschlag");
  if (o.foerderungsberatung) merkmaleText.push("Förderungsberatung");
  if (o.kartenzahlung) merkmaleText.push("Kartenzahlung");
  if (o.kassenvertrag) merkmaleText.push(`Kassenvertrag: ${o.kassenvertrag}`);
  if (o.gastgarten) merkmaleText.push("Gastgarten");
  if (o.takeaway) merkmaleText.push("Take-away");
  if (o.lieferservice) merkmaleText.push("Lieferservice");
  if (merkmaleText.length > 0) importContext.push(`BESONDERHEITEN: ${merkmaleText.join(", ")}`);

  // Team als Kontext
  const teamArr = Array.isArray(o.team) ? o.team : [];
  if (teamArr.length > 0) importContext.push(`TEAM: ${teamArr.map(t => `${t.name} (${t.rolle||""})`).join(", ")}`);

  // Stil-Anweisung fuer den Textstil
  const stilAnweisung = {
    klassisch: "Serioes, vertrauenswuerdig, bodenstaendig. Klare Sprache ohne Schnörkel. Betone Zuverlaessigkeit und Tradition.",
    modern: "Dynamisch, frisch, auf Augenhoehe. Kurze, praegnante Saetze. Betone Innovation und Kundenerlebnis.",
    elegant: "Zurueckhaltend, exklusiv, weniger ist mehr. Schlanke Formulierungen, gehobener Ton. Betone Qualitaet und Anspruch.",
    custom: "Professionell und authentisch. Passe den Ton an die Branche an.",
  }[o.stil] || stilAnweisung.custom;

  const textPrompt = `Generiere Website-Texte fuer einen oesterreichischen Betrieb. Antworte NUR mit validem JSON, keine Erklaerungen.

BETRIEB: ${o.firmenname}
BRANCHE: ${o.branche_label || o.branche}
ORT: ${o.ort || o.bundesland || "Oesterreich"}
BESCHREIBUNG: ${o.kurzbeschreibung || ""}
LEISTUNGEN: ${leistungen.join(", ")}
DESIGN-STIL: ${o.stil || "klassisch"}
${importContext.length > 0 ? "\n" + importContext.join("\n") + "\n" : ""}
TONALITAET: ${stilAnweisung}

REGELN:
- Oesterreichisches Deutsch, formelle Ansprache ("Sie")
- Warm, professionell, KEINE Superlative ("beste", "fuehrend"), KEINE erfundenen Zahlen/Jahre
- Wenn ein bestehender Ueber-uns-Text vorhanden ist: Nutze ihn als inhaltliche Grundlage, passe ihn stilistisch an und kuerze ihn. NICHTS dazuerfinden.
- Wenn bestehende Leistungsbeschreibungen vorhanden sind: Kuerze und optimiere sie fuer die Website.
- Leistungsbeschreibungen: MAXIMAL 15 Woerter pro Leistung. 1 kurzer, konkreter Satz. Kundenperspektive ("Sie erhalten...", "Wir kuemmern uns um...").
- Vorteile: Nutze echte Besonderheiten des Betriebs (Merkmale, Team, Spezialisierung) statt generische Phrasen. 3-6 Woerter pro Punkt.
- Vorteile MUESSEN sich voneinander unterscheiden. Keine Wiederholungen, keine Synonyme.
- kontakt_cta: Branchenspezifisch, nicht generisch. Ein Arzt sagt "Vereinbaren Sie Ihren Termin", ein Installateur "Schildern Sie uns Ihr Anliegen".

JSON-FORMAT:
{
  "leistungen_beschreibungen": {"${leistungen.join('":"[2 kurze Saetze, max 25 Woerter]","')}":"[2 kurze Saetze, max 25 Woerter]"},
  "text_ueber_uns": "4-5 Saetze ueber den Betrieb. Konkret, authentisch, nicht austauschbar.",
  "text_vorteile": ["Vorteil 1","Vorteil 2","Vorteil 3","Vorteil 4","Vorteil 5"],
  "leistungen_intro": "1 kurzer Einleitungssatz fuer die Leistungen-Sektion",
  "kontakt_cta_headline": "Kurze, branchenspezifische Headline",
  "kontakt_cta_text": "1-2 Saetze, konkrete Motivation zur Kontaktaufnahme",
  "ablauf_schritte": [{"titel":"Schritt 1","text":"Kurze Beschreibung"},{"titel":"Schritt 2","text":"Kurze Beschreibung"},{"titel":"Schritt 3","text":"Kurze Beschreibung"}],
  "gut_zu_wissen": "Hinweis 1\nHinweis 2\nHinweis 3"${(o.layout === "ausfuehrlich") ? `,
  "faq": [{"frage":"Haeufige Frage 1?","antwort":"Antwort in 1-2 Saetzen"},{"frage":"Haeufige Frage 2?","antwort":"Antwort in 1-2 Saetzen"},{"frage":"Haeufige Frage 3?","antwort":"Antwort in 1-2 Saetzen"},{"frage":"Haeufige Frage 4?","antwort":"Antwort in 1-2 Saetzen"}]` : ""}
}
${(o.layout === "ausfuehrlich") ? `
REGELN fuer faq:
- 4-5 branchenspezifische Fragen die Kunden TATSAECHLICH stellen
- Antworten: 1-2 kurze, hilfreiche Saetze. Konkret, nicht ausweichend.
- Wenn bestehende FAQ importiert wurden, verwende diese als Grundlage.
- Beispiel Elektriker: "Wie schnell sind Sie bei einem Notfall vor Ort?" - "In der Regel innerhalb von 30-60 Minuten. Unser Notdienst ist rund um die Uhr erreichbar."
- Beispiel Zahnarzt: "Arbeiten Sie mit Kassen zusammen?" - "Ja, wir haben Vertraege mit allen oesterreichischen Sozialversicherungstraegern."
` : ""}
REGELN fuer ablauf_schritte:
- 3-4 branchenspezifische Schritte die zeigen wie die Zusammenarbeit ablaeuft
- Titel: 2-4 Woerter. Text: 1 kurzer Satz, max 10 Woerter
- Muessen zum konkreten Betrieb passen, nicht generisch
- Beispiel Arzt: Termin vereinbaren → Erstgespraech → Untersuchung → Befund & Therapie
- Beispiel Handwerker: Anfrage schildern → Besichtigung & KV → Terminvereinbarung → Umsetzung

REGELN fuer gut_zu_wissen:
- 2-3 branchentypische permanente Hinweise fuer Kunden, getrennt durch Zeilenumbruch
- Wenn bestehende Hinweise importiert wurden, uebernimm diese.
- Nur relevante, konkrete Infos. Keine Marketing-Floskeln.
- Beispiel Arzt: Bitte e-Card mitbringen\nAnnahmeschluss 30 Min vor Ordinationsende
- Beispiel Friseur: Termine koennen bis 24h vorher kostenlos storniert werden`;

  const aiRes = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      messages: [{role: "user", content: textPrompt}],
    }),
  });

  if (!aiRes.ok) {
    const err = await aiRes.json().catch(() => ({}));
    const errMsg = "Claude API Fehler: " + (err.error?.message || `HTTP ${aiRes.status}`);
    await log.error("generate", {message: errMsg, url: "api.anthropic.com"});
    await fetch(`${env.SUPABASE_URL}/rest/v1/orders?id=eq.${order_id}`, {
      method: "PATCH",
      headers: {"Content-Type":"application/json","apikey":env.SUPABASE_SERVICE_KEY,"Authorization":`Bearer ${env.SUPABASE_SERVICE_KEY}`,"Prefer":"return=minimal"},
      body: JSON.stringify({last_error: errMsg}),
    });
    throw new Error(errMsg);
  }

  const aiData = await aiRes.json();
  const usage = aiData.usage || {};
  const tokIn = usage.input_tokens || 0;
  const tokOut = usage.output_tokens || 0;
  const costEur = Math.round(((tokIn * 3 + tokOut * 15) / 1000000) * 0.92 * 10000) / 10000;

  let rawText = aiData.content?.[0]?.text || "{}";
  rawText = rawText.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();

  let texts = {};
  try { texts = JSON.parse(rawText); } catch(_) {
    // Fallback: leere Texte
    texts = { leistungen_beschreibungen: {}, text_ueber_uns: "", text_vorteile: [], leistungen_intro: "", kontakt_cta_headline: "Kontaktieren Sie uns", kontakt_cta_text: "Wir freuen uns auf Ihre Anfrage." };
  }

  /* ═══ TEMPLATE BEFUELLEN ═══ */
  const { buildTemplate } = await import("../templates/template.js");

  let html = buildTemplate({
    firmenname: o.firmenname,
    brancheLabel: o.spezialisierung || o.branche_label || o.branche,
    einsatzgebiet: o.einsatzgebiet || o.bundesland || "\u00d6sterreich",
    kurzbeschreibung: o.kurzbeschreibung || "",
    ctaPrimary,
    ctaPrimaryHref,
    ctaSecondary,
    leistungenIntro: texts.leistungen_intro || "",
    preislisteHtml,
    ueberUnsText: "{{UEBER_UNS_TEXT}}",
    vorteileHtml: "{{VORTEILE}}",
    oeffnungszeiten: oezLabel,
    adresseVoll: "{{ADRESSE_VOLL}}",
    telDisplay: "{{TEL_DISPLAY}}",
    telHref: "{{TEL_HREF}}",
    email: "{{EMAIL}}",
    socialHtml,
    buchungslinkHtml,
    stickyCtaHtml,
    metaTitle,
    metaDesc,
    siteUrl,
    fontUrl: stil.url,
    fontFamily: stil.font ? `'${stil.font}',system-ui,-apple-system,sans-serif` : null,
    primary: pal.p,
    accent: pal.a,
    bg: pal.bg,
    sep: pal.s,
    kontaktCtaHeadline: texts.kontakt_cta_headline || "Kontaktieren Sie uns",
    kontaktCtaText: texts.kontakt_cta_text || "Wir freuen uns auf Ihre Anfrage.",
    borderRadius: stil.r || null,
    borderRadiusLg: stil.rLg || null,
    stil: o.stil || "klassisch",
  });

  /* ─── Nav + Footer injizieren ─── */
  html = html.replace("<!-- NAV -->", navHtml);
  html = html.replace("<!-- FOOTER -->", footerHtml);

  /* ─── Logo in Nav injizieren ─── */
  if (logoUrl) {
    html = html.replace(
      /(<a[^>]*id="site-nav-logo"[^>]*>)[^<]*(<\/a>)/i,
      `$1<img src="${logoUrl}" alt="${o.firmenname}" style="height:64px;width:auto;object-fit:contain;display:block;max-width:240px"/>$2`
    );
  }

  /* ─── Schema.org JSON-LD ─── */
  const sameAs = [o.facebook, o.instagram, o.linkedin, o.tiktok].filter(Boolean).map(normSocial);
  const schema = {
    "@context": "https://schema.org", "@type": "LocalBusiness",
    "name": o.firmenname, "description": metaDesc, "url": siteUrl,
    "address": { "@type": "PostalAddress", ...(o.adresse ? {"streetAddress": o.adresse} : {}), ...(o.plz ? {"postalCode": o.plz} : {}), ...(o.ort ? {"addressLocality": o.ort} : {}), "addressCountry": "AT" },
    ...(o.telefon ? {"telephone": o.telefon} : {}),
    ...(o.email ? {"email": o.email} : {}),
    ...(o.url_hero ? {"image": o.url_hero} : {}),
    ...(o.einsatzgebiet || o.ort ? {"areaServed": o.einsatzgebiet || o.ort} : {}),
    ...(oez && oez !== "Nach Vereinbarung" ? {"openingHours": oez} : {}),
    ...(sameAs.length ? {"sameAs": sameAs} : {}),
  };
  html = html.replace("</head>", `<script type="application/ld+json">${JSON.stringify(schema)}</script>\n</head>`);

  /* ─── Scroll-Spy ─── */
  html = html.replace("</body>", `<script>(function(){var ls=document.querySelectorAll('.nav-link[href^="#"]');var ss=[].map.call(ls,function(l){return document.querySelector(l.getAttribute('href'))}).filter(Boolean);function u(){var y=window.scrollY+100;var c=ss.reduce(function(a,s){return s.offsetTop<=y?s:a},ss[0]);ls.forEach(function(l){var a=c&&'#'+c.id===l.getAttribute('href');l.style.opacity=a?'1':'';l.style.fontWeight=a?'700':'';});}window.addEventListener('scroll',u,{passive:true});u();})();</script>\n</body>`);

  /* ─── Stockfoto als Platzhalter (wenn kein Hero-Bild vorhanden) ─── */
  let heroIsPlaceholder = false;
  if (!o.url_hero) {
    try {
      // Kuratierte Unsplash-Bild-IDs pro Branche (dauerhaft verfügbar, kein API-Key nötig)
      // Format: https://images.unsplash.com/photo-{ID}?w=1200&h=630&fit=crop&q=80
      const stockPhotos = {
        // Handwerk
        elektro:"photo-1621905252507-b35492cc74b4",installateur:"photo-1585704032915-c3400ca199e7",
        maler:"photo-1562259949-e8e7689d7828",tischler:"photo-1504148455328-c376907d081c",
        fliesenleger:"photo-1584622650111-993a426fbf0a",schlosser:"photo-1504328345606-18bbc8c9d7d1",
        dachdecker:"photo-1632759145351-1d5922f1063e",zimmerei:"photo-1516475429286-ed1b0a53e43e",
        maurer:"photo-1504307651254-35680f356dfd",bodenleger:"photo-1558618666-fcd25c85f82e",
        glaser:"photo-1596394723269-e15e948b3dfa",gaertner:"photo-1585320806297-9794b3e4eeae",
        klima:"photo-1631545806609-22dbc23f7307",reinigung:"photo-1581578731548-c64695cc6952",
        kfz:"photo-1487754180451-c456f719a1fc",aufsperrdienst:"photo-1558618666-fcd25c85f82e",
        hafner:"photo-1567767292278-a4f21aa2d36e",raumausstatter:"photo-1618221195710-dd6b41faaea6",
        goldschmied:"photo-1515562141589-9d879cb26e05",schneider:"photo-1558171813-4c088753af8f",
        rauchfangkehrer:"photo-1513694203232-719a280e022f",schaedlingsbekaempfung:"photo-1585435557343-3985ac245e7a",
        // Kosmetik
        friseur:"photo-1560066984-138dadb4c035",kosmetik:"photo-1570172619644-dfd03ed5d881",
        nagel:"photo-1604654894610-df63bc536371",tattoo:"photo-1598371839696-5c5bb1c12015",
        fusspflege:"photo-1519823551278-64ac92734fb1",permanent_makeup:"photo-1522337360788-8b13dee7a37e",
        hundesalon:"photo-1516734212186-a967f81ad0d7",massage:"photo-1544161515-4ab6ce6db874",
        // Gastro
        restaurant:"photo-1517248135467-4c7edcad34c4",cafe:"photo-1554118811-1e0d58224f24",
        baeckerei:"photo-1509440159596-0249088772ff",bar:"photo-1572116469696-31de0f17cc34",
        heuriger:"photo-1506377247377-2a5b3b417ebb",imbiss:"photo-1565299624946-b28f40a0ae38",
        catering:"photo-1555244162-803834f70033",fleischerei:"photo-1551028150-64b9f398f678",
        // Gesundheit
        arzt:"photo-1631217868264-e5b90bb7e133",zahnarzt:"photo-1629909613654-28e377c37b09",
        physiotherapie:"photo-1571019613454-1cb2f99b2d8b",tierarzt:"photo-1628009368231-7bb7cfcb0def",
        apotheke:"photo-1585435557343-3985ac245e7a",optiker:"photo-1574258495973-f010dfbb5371",
        psychotherapie:"photo-1573497620053-ea5300f94f21",ergotherapie:"photo-1576091160550-2173dba999ef",
        logopaedie:"photo-1576091160399-112ba8d25d1d",energetiker:"photo-1545205597-3d9d02c29597",
        hebamme:"photo-1493894473891-10fc1e5dbd22",diaetologe:"photo-1490645935967-10de6ba17061",
        hoerakustiker:"photo-1559757175-5700dde675bc",zahntechnik:"photo-1606811841689-23dfddce3e95",
        heilmasseur:"photo-1519823551278-64ac92734fb1",
        // Dienstleistung
        steuerberater:"photo-1497366216548-37526070297c",rechtsanwalt:"photo-1589829545856-d10d557cf95f",
        versicherung:"photo-1450101499163-c8848e968838",immobilien:"photo-1560518883-ce09059eeffa",
        hausverwaltung:"photo-1486406146926-c627a92ad1ab",umzug:"photo-1600518464441-9154a4dea21b",
        eventplanung:"photo-1492684223066-81342ee5ff30",fotograf:"photo-1554048612-b6a482bc67e5",
        florist:"photo-1487530811176-3780de880c2d",architekt:"photo-1503387762-592deb58ef4e",
        it_service:"photo-1518770660439-4636190af475",werbeagentur:"photo-1542744094-3a31f272c490",
        bestattung:"photo-1501621667575-af81f1f0bacc",notar:"photo-1507679799987-c73b1c7e2b48",
        finanzberater:"photo-1554224155-6726b3ff858f",reisebuero:"photo-1488646953014-85cb44e25828",
        innenarchitekt:"photo-1618221195710-dd6b41faaea6",textilreinigung:"photo-1545173168-9f1947eebb7f",
        // Bildung
        fahrschule:"photo-1449965408869-eaa3f722e40d",nachhilfe:"photo-1427504494785-3a9ca7044f45",
        musikschule:"photo-1511379938547-c1f69419868d",trainer:"photo-1534438327276-14e5300c3a48",
        yoga:"photo-1545205597-3d9d02c29597",hundeschule:"photo-1587300003388-59208cc962cb",
        tanzschule:"photo-1504609813442-a8924e83f76e",reitschule:"photo-1553284965-83fd3e82fa5a",
        schwimmschule:"photo-1519315901367-f34ff9154487",
      };
      const branche = (o.branche || "").toLowerCase();
      const photoId = stockPhotos[branche] || "photo-1497366216548-37526070297c"; // Fallback: modernes Büro
      const imgUrl = `https://images.unsplash.com/${photoId}?w=1200&h=630&fit=crop&q=80`;
      const imgRes = await fetch(imgUrl, {signal: AbortSignal.timeout(8000)});
      if (imgRes.ok && imgRes.headers.get("content-type")?.startsWith("image/")) {
        const imgBlob = await imgRes.arrayBuffer();
        const storagePath = `placeholders/${o.id}/hero.jpg`;
        const uploadRes = await fetch(
          `${env.SUPABASE_URL}/storage/v1/object/customer-assets/${storagePath}`,
          {
            method: "POST",
            headers: {
              "apikey": env.SUPABASE_SERVICE_KEY,
              "Authorization": `Bearer ${env.SUPABASE_SERVICE_KEY}`,
              "Content-Type": "image/jpeg",
              "x-upsert": "true",
            },
            body: imgBlob,
          }
        );
        if (uploadRes.ok) {
          const publicUrl = `${env.SUPABASE_URL}/storage/v1/object/public/customer-assets/${storagePath}`;
          await fetch(`${env.SUPABASE_URL}/rest/v1/orders?id=eq.${order_id}`, {
            method: "PATCH",
            headers: {"Content-Type":"application/json","apikey":env.SUPABASE_SERVICE_KEY,"Authorization":`Bearer ${env.SUPABASE_SERVICE_KEY}`,"Prefer":"return=minimal"},
            body: JSON.stringify({url_hero: publicUrl, hero_is_placeholder: true}),
          });
          o.url_hero = publicUrl;
          heroIsPlaceholder = true;
        }
      }
    } catch(e) {
      // Stockfoto ist optional — kein Blocker wenn es fehlschlägt
    }
  }

  /* ─── Qualitaets-Check + Auto-Fix ─── */
  const qIssues = [];
  let qFixed = 0;

  // 1. Serve-time Placeholders zaehlen (NICHT entfernen — werden von index.js gebraucht)
  const serveTimePlaceholders = new Set(["{{FIRMENNAME}}","{{TEL_HREF}}","{{TEL_DISPLAY}}","{{EMAIL}}","{{ADRESSE_VOLL}}","{{PLZ_ORT}}","{{KURZBESCHREIBUNG}}","{{OEFFNUNGSZEITEN}}","{{EINSATZGEBIET}}","{{SOCIAL_ICONS}}","{{UEBER_UNS_TEXT}}","{{VORTEILE}}","{{OG_IMAGE}}"]);
  const allPlaceholders = html.match(/\{\{[A-Z_]+\}\}/g) || [];
  const unknownPlaceholders = allPlaceholders.filter(p => !serveTimePlaceholders.has(p));
  if (unknownPlaceholders.length > 0) {
    for (const ph of unknownPlaceholders) {
      html = html.split(ph).join("");
      qFixed++;
    }
    qIssues.push({type:"unknown_placeholder_removed", count:unknownPlaceholders.length, items:[...new Set(unknownPlaceholders)]});
  }

  // 2. Uebrig gebliebene HTML-Kommentar-Placeholder entfernen (NUR die, die NICHT serve-time gebraucht werden)
  // Serve-time Placeholders MUESSEN bleiben: LEISTUNGEN, BEWERTUNGEN, FAQ, GALERIE, FAKTEN, PARTNER, KONTAKT_FORM, KONTAKT_INFOS, TEAM, ABOUT_FOTOS, MAPS, TRUST, ABLAUF, CTA_BLOCK, LEIST_FOTOS
  const safeToRemove = html.match(/<!-- (FOTO_BAND) -->/g) || [];
  if (safeToRemove.length > 0) {
    for (const cp of safeToRemove) {
      html = html.replace(cp, "");
      qFixed++;
    }
    qIssues.push({type:"legacy_placeholder_removed", count:safeToRemove.length});
  }

  // 3. Pruefen ob kritische Sections vorhanden sind
  const hasHero = html.includes('class="hero"');
  const hasLeist = html.includes('id="leistungen"');
  const hasKontakt = html.includes('id="kontakt"');
  const hasNav = html.includes('id="sitenav"');
  const hasFooter = html.includes('class="sr-footer"') || html.includes('class="footer"');
  if (!hasHero) qIssues.push({type:"missing_section", section:"hero"});
  if (!hasLeist) qIssues.push({type:"missing_section", section:"leistungen"});
  if (!hasKontakt) qIssues.push({type:"missing_section", section:"kontakt"});
  if (!hasNav) qIssues.push({type:"missing_section", section:"nav"});
  if (!hasFooter) qIssues.push({type:"missing_section", section:"footer"});

  // 4. Score berechnen
  const criticalMissing = qIssues.filter(i => i.type === "missing_section").length;
  const qualityScore = Math.max(0, 100 - (criticalMissing * 20) - (unknownPlaceholders.length * 5));

  /* ─── In Supabase speichern ─── */
  // Kern-Felder (muessen existieren)
  const savePayload = {
    website_html: html, subdomain: sub, status: o.status === "live" ? "live" : "trial",
    tokens_in: tokIn, tokens_out: tokOut, cost_eur: costEur, last_error: null,
    ...(texts.text_ueber_uns ? {text_ueber_uns: texts.text_ueber_uns} : {}),
    ...(texts.text_vorteile ? {text_vorteile: texts.text_vorteile} : {}),
    ...(texts.leistungen_beschreibungen ? {leistungen_beschreibungen: texts.leistungen_beschreibungen} : {}),
    ...(!o.ablauf_schritte?.length && texts.ablauf_schritte?.length ? {ablauf_schritte: texts.ablauf_schritte} : {}),
    ...(!o.gut_zu_wissen && texts.gut_zu_wissen ? {gut_zu_wissen: texts.gut_zu_wissen} : {}),
    ...(!o.faq?.length && texts.faq?.length ? {faq: texts.faq} : {}),
  };

  const save = await fetch(
    `${env.SUPABASE_URL}/rest/v1/orders?id=eq.${order_id}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "apikey": env.SUPABASE_SERVICE_KEY, "Authorization": `Bearer ${env.SUPABASE_SERVICE_KEY}`, "Prefer": "return=minimal" },
      body: JSON.stringify(savePayload),
    }
  );

  if (!save.ok) {
    const saveErr = await save.text().catch(() => "");
    await log.error("generate", {message: "Speichern fehlgeschlagen: " + (saveErr || `HTTP ${save.status}`)});
    throw new Error("Speichern fehlgeschlagen: " + (saveErr || `HTTP ${save.status}`));
  }

  // Optionale Felder separat speichern (Spalten existieren evtl. noch nicht)
  try {
    await fetch(`${env.SUPABASE_URL}/rest/v1/orders?id=eq.${order_id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "apikey": env.SUPABASE_SERVICE_KEY, "Authorization": `Bearer ${env.SUPABASE_SERVICE_KEY}`, "Prefer": "return=minimal" },
      body: JSON.stringify({
        quality_score: qualityScore, quality_issues: qIssues.length > 0 ? qIssues : null, quality_fixed: qFixed || null,
        ai_generated: ["text_ueber_uns","text_vorteile","leistungen_beschreibungen",...(!o.ablauf_schritte?.length?["ablauf_schritte"]:[]),...(!o.gut_zu_wissen?["gut_zu_wissen"]:[]),...(!o.faq?.length&&texts.faq?.length?["faq"]:[])],
      }),
    });
  } catch(_) { /* Spalten existieren evtl. noch nicht — kein Blocker */ }

  await log.timeEnd("generate", order_id, "generate_done");
  return {ok: true, subdomain: sub, status: "live"};
}

