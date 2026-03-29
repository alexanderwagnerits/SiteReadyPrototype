/* ═══ Nav-Builder ═══ */
function buildNav(o, pal, stil) {
  const tel = o.telefon || "";
  return `<style>
#sitenav{position:sticky;top:0;z-index:1000;background:var(--primary);transition:background .3s,box-shadow .3s}
#sitenav.scrolled{background:#fff;box-shadow:0 2px 20px rgba(0,0,0,.08)}
#sitenav.scrolled .nav-logo{color:var(--primary)!important}
#sitenav.scrolled .nav-link{color:var(--primary)!important}
#sitenav.scrolled .hbg-bar{background:var(--primary)!important}
.nav-inner{max-width:1200px;margin:0 auto;padding:0 24px;height:68px;display:flex;align-items:center;justify-content:space-between}
.nav-links{display:flex;align-items:center;gap:28px}
.nav-link{color:rgba(255,255,255,.85);text-decoration:none;font-size:.88rem;font-weight:500;transition:opacity .2s}
.nav-link:hover{opacity:.7}
.nav-cta{background:var(--accent);color:#fff!important;padding:9px 18px;border-radius:${stil.r};font-weight:700;font-size:.85rem;white-space:nowrap}
.nav-cta:hover{opacity:.85!important}
.hbg{display:none;flex-direction:column;gap:5px;background:none;border:none;cursor:pointer;padding:6px}
.hbg-bar{width:24px;height:2px;background:rgba(255,255,255,.9);border-radius:2px;transition:background .3s}
.mob-menu{display:none;position:fixed;top:68px;left:0;right:0;background:#fff;box-shadow:0 8px 32px rgba(0,0,0,.12);padding:16px 24px 24px;z-index:999}
.mob-link{display:block;padding:12px 0;font-size:1rem;font-weight:600;color:var(--primary);text-decoration:none;border-bottom:1px solid #f1f5f9}
.mob-cta{display:block;margin-top:16px;background:var(--accent);color:#fff;text-align:center;padding:14px;border-radius:${stil.r};font-weight:700;font-size:1rem;text-decoration:none}
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
btn.addEventListener('click',function(){open=!open;mob.style.display=open?'block':'none';});
window.addEventListener('scroll',function(){nav.classList.toggle('scrolled',window.scrollY>40);if(window.scrollY>40&&open){open=false;mob.style.display='none';}});
document.querySelectorAll('.mob-link,.mob-cta').forEach(function(a){a.addEventListener('click',function(){open=false;mob.style.display='none';});});
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
<style>@media(max-width:768px){.ft-grid{grid-template-columns:1fr!important}}</style>`;
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
    add("Inhaber", o.firmenname); add("Anschrift", adresse);
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
    p:"#292524", a:"#78716c", bg:"#fafaf9", s:"#e7e5e4",
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
  const c = o.custom_color || "#2563eb";
  const fk = o.custom_font || "dm_sans";
  const fontFamily = CUSTOM_FONT_FAMILIES[fk] || CUSTOM_FONT_FAMILIES.dm_sans;
  const fontName = fontFamily.split(",")[0].replace(/'/g,"");
  return {
    p: c, a: c, bg: "#fafafa", s: "#e5e7eb",
    font: fontName,
    url: CUSTOM_FONT_URLS[fk] || CUSTOM_FONT_URLS.dm_sans,
    r: "8px", rLg: "12px", btnR: "8px",
    feel: "individuell, passend zum eigenen Branding, professionell",
    heroDecor: "Dezenter Gradient-Overlay mit der Primaerfarbe.",
    cardStyle: "border:1px solid var(--sep); border-radius:8px; padding:28px 24px; box-shadow:0 1px 3px rgba(0,0,0,.05). Hover: transform:translateY(-3px), box-shadow:0 8px 24px rgba(0,0,0,.08).",
    ueberStyle: "Checkmark-Liste mit Haken in Akzentfarbe. Professioneller, klarer Ton.",
  };
}

export async function onRequestPost({request, env}) {
  try {
  const url = new URL(request.url);
  const key = url.searchParams.get("key");
  if (!key || key !== env.ADMIN_SECRET) {
    return Response.json({error: "Unauthorized"}, {status: 401});
  }

  let body;
  try { body = await request.json(); } catch(e) {
    return Response.json({error: "Invalid JSON"}, {status: 400});
  }
  const {order_id} = body;
  if (!order_id) return Response.json({error: "order_id required"}, {status: 400});

  /* Bestellung laden */
  const r = await fetch(
    `${env.SUPABASE_URL}/rest/v1/orders?id=eq.${order_id}&select=*`,
    {headers: {"apikey": env.SUPABASE_SERVICE_KEY, "Authorization": `Bearer ${env.SUPABASE_SERVICE_KEY}`}}
  );
  const rows = await r.json();
  if (!rows.length) return Response.json({error: "Order not found"}, {status: 404});
  const o = rows[0];

  /* Konfiguration */
  const stil = o.stil === "custom" ? buildCustomStil(o) : (STIL[o.stil] || STIL.klassisch);
  const pal  = { p: stil.p, a: stil.a, bg: stil.bg, s: stil.s };
  const sub  = o.subdomain || (o.firmenname || "firma").toLowerCase().replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,"");
  const betriebstyp = o.branche_label || "Betrieb";

  const leistungen = [...(o.leistungen || [])];
  if (o.extra_leistung?.trim()) {
    const extras = o.extra_leistung.split(/[,\n]+/).map(s => s.trim()).filter(Boolean);
    leistungen.push(...extras);
  }
  const oez = o.oeffnungszeiten_custom || o.oeffnungszeiten || "Nach Vereinbarung";
  const year = new Date().getFullYear();
  const impressumHtml = buildImpressum(o, pal, year);
  const navHtml      = buildNav(o, pal, stil);
  const footerHtml   = buildFooter(o, pal, year, sub);

  /* ─── Trust-Bar Items (nur echte Daten) ─── */
  const trustItems = [];
  if (o.notdienst) trustItems.push("\uD83D\uDEA8 24/7 Notdienst");
  if (o.meisterbetrieb) trustItems.push("\uD83C\uDFC6 Meisterbetrieb");
  trustItems.push(`\uD83D\uDCCD ${o.einsatzgebiet || o.bundesland || "Oesterreich"}`);
  if (o.kostenvoranschlag) trustItems.push("✔ Kostenloser Kostenvoranschlag");
  if (leistungen.length >= 3) trustItems.push(`✔ ${leistungen.length} Leistungsbereiche`);
  const oezLabel = o.oeffnungszeiten_custom || ({"mo-fr-8-17":"Mo–Fr 8–17 Uhr","mo-fr-7-16":"Mo–Fr 7–16 Uhr","mo-fr-8-18":"Mo–Fr 8–18 Uhr","mo-sa-8-17":"Mo–Sa 8–17 Uhr","mo-sa-8-12":"Mo–Sa 8–12 Uhr","vereinbarung":"Nach Vereinbarung"}[o.oeffnungszeiten]) || "Nach Vereinbarung";
  if (trustItems.length < 4) trustItems.push(`🕐 ${oezLabel}`);
  const trustBar = trustItems.slice(0, 4).join("  ·  ");

  /* ─── Feature-Badges (fuer Hero + Info-Sektion) ─── */
  const badges = [];
  if (o.notdienst) badges.push("⚡ 24/7 Notdienst");
  if (o.meisterbetrieb) badges.push("🏆 Meisterbetrieb");
  if (o.kostenvoranschlag) badges.push("✓ Kostenloser Kostenvoranschlag");
  if (o.foerderungsberatung) badges.push("💰 Förderungsberatung");
  if (o.hausbesuche) badges.push("🏠 Hausbesuche möglich");
  if (o.terminvereinbarung) badges.push("📅 Nur mit Termin");
  if (o.lieferservice) badges.push("🚚 Lieferservice");
  if (o.barrierefrei) badges.push("♿ Barrierefrei");
  if (o.parkplaetze) badges.push("🅿 Parkplätze vorhanden");
  if (o.erstgespraech_gratis) badges.push("🤝 Erstgespräch gratis");
  if (o.online_beratung) badges.push("💻 Online-Beratung möglich");
  if (o.ratenzahlung) badges.push("📋 Ratenzahlung möglich");
  const kassenLabel = o.kassenvertrag === "alle_kassen" ? "Alle Kassen" : o.kassenvertrag === "wahlarzt" ? "Wahlarzt / Wahltherapeut" : o.kassenvertrag === "privat" ? "Nur Privat" : o.kassenvertrag === "oegk" ? "ÖGK" : o.kassenvertrag === "bvaeb" ? "BVAEB" : o.kassenvertrag === "svs" ? "SVS" : null;
  if (kassenLabel) badges.push(`🏥 ${kassenLabel}`);

  /* ─── Logo URL ─── */
  const logoUrl = o.url_logo || null;
  const preislisteUrl = o.url_preisliste || null;

  /* ─── Social Media ─── */
  const socials = [];
  if (o.facebook) socials.push({name:"Facebook",url:normSocial(o.facebook)});
  if (o.instagram) socials.push({name:"Instagram",url:normSocial(o.instagram)});
  if (o.linkedin) socials.push({name:"LinkedIn",url:normSocial(o.linkedin)});
  if (o.tiktok) socials.push({name:"TikTok",url:normSocial(o.tiktok)});

  /* ─── System Prompt ─── */
  const system = `Du bist ein erstklassiger Web-Designer und Senior Frontend-Entwickler.
Generiere eine VOLLSTAENDIGE, professionelle, wunderschoene HTML-Website fuer einen oesterreichischen ${betriebstyp}.

AUSGABE-REGEL: Antworte AUSSCHLIESSLICH mit reinem HTML-Code. Kein Markdown, keine Backticks, keine Erklaerungen. Beginne DIREKT mit <!DOCTYPE html> und ende mit </html>.
KOMPAKTHEIT: CSS und HTML kompakt (keine Kommentare, kurze Klassennamen). Striktes Token-Budget.
KEINE ERFUNDENEN FAKTEN – ABSOLUTE PFLICHT: Keine erfundenen Zahlen, Jahreszahlen, Kundenzahlen, Erfahrungsjahre oder Statistiken. Nur echte, uebergebene Kundendaten verwenden. Verstoss ist inakzeptabel.
LEISTUNGEN – PFLICHT: Setze <!-- LEISTUNGEN --> als Platzhalter fuer das Cards-Grid (keine Cards selbst generieren – werden automatisch injiziert). Beschreibe alle ${leistungen.length} Leistungen im SR-DATEN-BLOCK mit je 1 konkreten Satz.
META: <meta name="robots" content="noindex,nofollow"> im <head> einbauen.
STRUKTUR: Nav und Footer werden automatisch injiziert. Generiere NUR: <!DOCTYPE html>, <html>, <head> (CSS+Fonts), <body> mit den Sektionen HERO, LEISTUNGEN, UEBER-UNS, KONTAKT${o.buchungslink ? ", TERMIN-CTA" : ""}. Setze <!-- NAV --> direkt nach <body> und <!-- FOOTER --> nach dem letzten Abschnitt. Setze <!-- GALERIE --> als eigene Zeile ZWISCHEN den Sektionen UEBER-UNS und KONTAKT (die Galerie wird automatisch eingefuegt wenn Fotos vorhanden sind).

═══ DESIGN-VORGABEN ═══
Primaerfarbe:  ${pal.p}
Akzentfarbe:   ${pal.a}
Hintergrund:   ${pal.bg}
Trennfarbe:    ${pal.s}
Schriftart:    ${stil.font}
Border-Radius: ${stil.r} (klein), ${stil.rLg} (gross)
Button-Radius: ${stil.btnR || stil.r}
Feeling:       ${stil.feel}
Stil-Dekoration Hero: ${stil.heroDecor}
Stil-Cards:    ${stil.cardStyle}
Stil-Ueber-Uns: ${stil.ueberStyle}

CSS Custom Properties im :root: --primary, --accent, --bg, --sep, --text, --textMuted, --white

═══ RESPONSIVE – NICHT VERHANDELBAR ═══
- Mobile-First. Jede Sektion funktioniert perfekt auf 320px bis 1400px.
- Breakpoints: 640px (Mobile→Tablet), 900px (Tablet→Desktop)
- Zweispaltige Layouts: auf Mobile immer einspaltig (grid-template-columns:1fr)
- Schriftgroessen mit clamp(): H1 clamp(2.2rem,6vw,4.5rem), H2 clamp(1.4rem,3.5vw,2.2rem)
- Padding Sektionen: Desktop 96px 0, Mobile 64px 0
- Grid Cards: auto-fill minmax(260px,1fr) – kollabiert korrekt auf Mobile
- Kein horizontales Scrollen auf irgendeiner Breite
- Touch-freundliche Tap-Targets: min. 44px Hoehe auf interaktiven Elementen
- Alle @media-Queries in einem gebundelten <style>-Block am Ende des <head>

═══ TECHNISCHE ANFORDERUNGEN ═══
- Valides HTML5 (nav, main, section, footer, article, address)
- Google Fonts @import im <style>-Tag: ${stil.url}
- CSS Grid und Flexbox fuer Layouts
- html { scroll-behavior: smooth; }
- Hover-Transitions: transition: all 0.2s ease
- Meta-Tags: charset, viewport, description, og:title
- Keine externen Ressourcen ausser Google Fonts

═══ QUALITAETSSTANDARDS ═══
- Starke visuelle Hierarchie durch Schriftgroessen und Gewichte
- Conversion-optimiert: Telefonnummer mind. 3x sichtbar (nav, hero, kontakt)
- Leistungs-Beschreibungen SELBST VERFASSEN (1 Satz, branchenspezifisch, konkret)
- Professionell und fertig wirkend – nicht wie ein Template

═══ SEITENSTRUKTUR ═══

HERO: min-height:100vh; background: radial-gradient(ellipse at top right, ${pal.a}18 0%, transparent 55%), linear-gradient(150deg, ${pal.p} 0%, ${pal.p}ee 100%).
${badges.length ? `FEATURE-BADGES im Hero: Zeige diese Badges als kleine Pill-Elemente (display:inline-flex, gap:6px, flex-wrap:wrap) direkt UEBER dem H1:\n${badges.map(b=>`  • ${b}`).join("\n")}\nStil: padding:5px 14px, background:rgba(255,255,255,.15), border-radius:${stil.btnR || stil.r}, font-size:.78rem, font-weight:600, color:#fff, letter-spacing:.03em.` : ""}
Dekorations-Element: ${stil.heroDecor}
${logoUrl ? `LOGO: Zeige <!-- LOGO --> als Platzhalter UEBER den Feature-Badges. Wird automatisch mit <img> ersetzt. Groesse: height:48px, max-width:200px, object-fit:contain.` : ""}
H1: Firmenname, clamp(2.2rem,6vw,4.5rem), font-weight:900, color:#fff, line-height:1.1, letter-spacing:-.02em.
Subtitle: Branche + Einsatzgebiet, color:rgba(255,255,255,.75), clamp(.95rem,2.5vw,1.2rem).
TRUST-BAR: Direkt nach Subtitle – flex-row, gap:24px, flex-wrap:wrap – die Punkte aus den uebergebenen TRUST-ITEMS anzeigen (opacity:.85, font-size:.85rem, color:#fff). Exakt diese Texte verwenden, nichts hinzuerfinden.
2 CTA-Buttons: Primaer (background:var(--accent), border-radius:${stil.btnR || stil.r}, Anrufen, href="{{TEL_HREF}}") + Ghost (border:2px solid rgba(255,255,255,.5), color:#fff, border-radius:${stil.btnR || stil.r}, href="#leistungen")${o.buchungslink ? ` + Termin-Button (background:#fff, color:var(--accent), border-radius:${stil.btnR || stil.r}, href="${o.buchungslink}", target="_blank", "Termin buchen")` : ""}. Mobile: alle Buttons 100% Breite, gestapelt.

LEISTUNGEN: background:#fff. Section-Label: kleine Oberschrift ("Unser Leistungsangebot", font-size:.72rem, font-weight:700, letter-spacing:.1em, text-transform:uppercase, color:var(--accent)). H2 in Primaerfarbe. Setze <!-- LEISTUNGEN --> als Platzhalter direkt nach der H2 (keine Cards generieren – werden automatisch eingefuegt).
${preislisteUrl ? `PREISLISTE-BUTTON: Unter den Leistungen einen Button anzeigen: "📄 Preisliste ansehen" als <a href="${preislisteUrl}" target="_blank"> mit background:var(--bg), border:1px solid var(--sep), border-radius:${stil.btnR || stil.r}, padding:12px 24px, font-weight:700, color:var(--primary), margin-top:24px, display:inline-flex, align-items:center, gap:8px.` : ""}

UEBER UNS: background:var(--bg). Zweispaltig desktop (3fr 2fr), einspaltig mobile.
Links: Section-Label + H2 + <p>{{UEBER_UNS_TEXT}}</p> (Platzhalter – nicht ersetzen) + <div>{{VORTEILE}}</div> (Platzhalter – nicht ersetzen, wird automatisch befuellt).
Rechts: Karte (background:var(--primary), color:#fff, border-radius:${stil.rLg}, padding:32px 28px) mit: Oeffnungszeiten-Block, Einsatzgebiet-Zeile, Telefon als grosser weisser Link.

KONTAKT: background:#fff. Zweispaltig desktop (1fr 1fr), einspaltig mobile.
Links: H2, Adressblock ({{ADRESSE_VOLL}}), Telefon als grosser klickbarer Link ({{TEL_HREF}}/{{TEL_DISPLAY}}, font-size:1.5rem, font-weight:800, color:var(--accent)), E-Mail-Link, Oeffnungszeiten.${socials.length ? `\nSocial Media Links: ${socials.map(s=>`${s.name} (${s.url})`).join(", ")} – als Icon-Buttons in einer Reihe, font-size:.85rem, gap:12px.` : ""}
Rechts: CTA-Karte (background:var(--primary), border-radius:${stil.rLg}, padding:36px 32px, color:#fff): kurzer Aufruf-Satz + grosser Anruf-Button (background:var(--accent), border-radius:${stil.btnR || stil.r}).
<!-- MAPS --> Platzhalter nach den Kontaktinfos.

${o.buchungslink ? `TERMIN-CTA SEKTION: Eigene Sektion NACH Kontakt (VOR <!-- FOOTER -->). background:var(--primary), padding:64px 0, text-align:center, color:#fff.
H2: "Jetzt Termin buchen", font-weight:800, margin-bottom:12px.
Kurzer Text: "Buchen Sie bequem online – rund um die Uhr."
Grosser CTA-Button: <a href="${o.buchungslink}" target="_blank"> mit background:var(--accent), color:#fff, padding:16px 36px, border-radius:${stil.btnR || stil.r}, font-size:1.1rem, font-weight:800.` : ""}

${o.telefon ? `STICKY MOBILE CTA: Fixer Anruf-Button am unteren Bildschirmrand. Nur auf Mobile sichtbar (@media(max-width:640px){display:flex} sonst display:none). position:fixed; bottom:0; left:0; right:0; z-index:900; background:var(--accent); color:#fff; padding:16px 24px; font-weight:800; font-size:1rem; text-align:center; text-decoration:none; display:none. Inhalt: "📞 Jetzt anrufen – {{TEL_DISPLAY}}" als <a href="{{TEL_HREF}}">. body bekommt padding-bottom:64px auf Mobile damit Inhalt nicht verdeckt wird.` : ""}

SR-DATEN-BLOCK – ABSOLUT PFLICHT: Fuge diesen Block DIREKT nach <!-- NAV --> (vor der ersten Section) ein, ausgefuellt mit echten KI-generierten Texten. EXAKT dieses Format:
<script type="application/json" id="sr-data">{"leistungen_beschreibungen":{${leistungen.map(l=>`"${l}":"[1 konkreter Satz]"`).join(",")}},"text_ueber_uns":"[4-5 Saetze zum Betrieb: Was macht den Betrieb aus? Welche Werte? Was koennen Kunden erwarten? Nur echte Daten, keine Zahlen/Jahre erfinden.]","text_vorteile":["[Vorteil 1]","[Vorteil 2]","[Vorteil 3]","[Vorteil 4]","[Vorteil 5]"]}</script>
Ersetze [1 konkreter Satz] usw. mit echtem branchenspezifischem Inhalt. Keine Zahlen/Jahre/Kunden erfinden.`;

  /* ─── User Message ─── */
  const user = `Erstelle die Website fuer diesen Betrieb:

FIRMA:         ${o.firmenname}
BRANCHE:       ${o.branche_label || o.branche}
EINSATZGEBIET: ${o.einsatzgebiet || o.bundesland || "Oesterreich"}
BESCHREIBUNG:  ${o.kurzbeschreibung || `Ihr ${o.branche_label || "Betrieb"} in ${o.ort || "Oesterreich"}`}

LEISTUNGEN (${leistungen.length}):
${leistungen.map((l, i) => `${i + 1}. ${l}`).join("\n")}

KONTAKT:
Adresse:         ${[o.adresse, o.plz, o.ort].filter(Boolean).join(", ") || "Auf Anfrage"}
Telefon:         ${o.telefon || ""}
E-Mail:          ${o.email || ""}
Oeffnungszeiten: ${oezLabel}

FEATURES & BADGES:
${badges.length ? badges.map(b => `• ${b}`).join("\n") : "Keine besonderen Features."}
${kassenLabel ? `\nKASSENVERTRAG: ${kassenLabel} – PROMINENT in der Kontakt-Sektion anzeigen (wichtig fuer Patienten).` : ""}
${o.buchungslink ? `\nBUCHUNGSLINK: ${o.buchungslink} – Als eigene CTA-Sektion VOR dem Footer + Button im Hero.` : ""}
${preislisteUrl ? `\nPREISLISTE: ${preislisteUrl} – "Preisliste ansehen"-Button unter den Leistungen.` : ""}
${logoUrl ? `\nLOGO: Setze <!-- LOGO --> im Hero ueber den Badges. Wird automatisch ersetzt.` : ""}

TRUST-ITEMS (exakt diese Punkte im Trust-Bar verwenden, nichts aendern):
${trustBar}

SOCIAL MEDIA:
${socials.length ? socials.map(s => `• ${s.name}: ${s.url}`).join("\n") : "Keine Social-Media-Links."}

FOTOS: Nein – keine Bildplaetze oder Platzhalter generieren. Eine Foto-Galerie wird automatisch eingefuegt falls Fotos vorhanden sind.

STIL-FEELING: ${stil.feel}

STRUKTUR-PFLICHT (Kommentare exakt so setzen):
- <!-- NAV --> direkt nach <body>
- <!-- MAPS --> im Kontakt-Abschnitt nach den Kontaktinfos (nur wenn Adresse vorhanden)
- <!-- FOOTER --> nach dem Kontakt-Abschnitt

VARIABLEN-PFLICHT (nur diese Platzhalter verwenden, KEINE echten Daten einsetzen):
{{TEL_HREF}} · {{TEL_DISPLAY}} · {{EMAIL}} · {{ADRESSE_VOLL}} · {{UEBER_UNS_TEXT}} · {{VORTEILE}} · <!-- LEISTUNGEN -->`;


  /* ─── Claude API Call ─── */
  const aiRes = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 12000,
      system,
      messages: [{role: "user", content: user}],
    }),
  });

  if (!aiRes.ok) {
    const err = await aiRes.json().catch(() => ({}));
    const errMsg = "Claude API Fehler: " + (err.error?.message || `HTTP ${aiRes.status}`);
    await fetch(`${env.SUPABASE_URL}/rest/v1/orders?id=eq.${order_id}`, {
      method: "PATCH",
      headers: {"Content-Type":"application/json","apikey":env.SUPABASE_SERVICE_KEY,"Authorization":`Bearer ${env.SUPABASE_SERVICE_KEY}`,"Prefer":"return=minimal"},
      body: JSON.stringify({last_error: errMsg}),
    });
    try{await fetch(`${env.SUPABASE_URL}/rest/v1/support_requests`,{method:"POST",headers:{"Content-Type":"application/json","apikey":env.SUPABASE_SERVICE_KEY,"Authorization":`Bearer ${env.SUPABASE_SERVICE_KEY}`},body:JSON.stringify({email:"system@siteready.at",subject:"[Auto] Website-Generierung fehlgeschlagen",message:`Order: ${order_id}\nFirma: ${o.firmenname}\nFehler: ${errMsg}`,status:"offen"})});}catch(_){}
    return Response.json({error: errMsg}, {status: 500});
  }

  const aiData = await aiRes.json();
  const usage = aiData.usage || {};
  const tokIn = usage.input_tokens || 0;
  const tokOut = usage.output_tokens || 0;
  // Sonnet $3/1M in + $15/1M out, ~0.92 EUR/USD
  const costEur = Math.round(((tokIn * 3 + tokOut * 15) / 1000000) * 0.92 * 10000) / 10000;
  let html = aiData.content?.[0]?.text || "";

  // Markdown-Backticks entfernen falls Claude sie dennoch ausgibt
  html = html.replace(/^```html\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();

  // SR-DATEN-BLOCK extrahieren und aus HTML entfernen
  let srData = null;
  const srDataMatch = html.match(/<script[^>]*type="application\/json"[^>]*id="sr-data"[^>]*>([\s\S]*?)<\/script>/i);
  if (srDataMatch) {
    try { srData = JSON.parse(srDataMatch[1].trim()); } catch(_) {}
    html = html.replace(srDataMatch[0], "");
  }

  // Nav + Footer injizieren (Impressum/Datenschutz auf eigenen Unterseiten)
  html = html.includes("<!-- NAV -->")
    ? html.replace("<!-- NAV -->", navHtml)
    : html.replace(/<body[^>]*>/i, m => m + "\n" + navHtml);

  html = html.includes("<!-- FOOTER -->")
    ? html.replace("<!-- FOOTER -->", footerHtml)
    : html.replace(/<\/body>/i, footerHtml + "\n</body>");

  // Impressum-Placeholder entfernen
  html = html.replace("<!-- IMPRESSUM -->", "");

  // Logo injizieren
  if (logoUrl) {
    const logoImg = `<img src="${logoUrl}" alt="${o.firmenname}" style="height:48px;max-width:200px;object-fit:contain;display:block;margin-bottom:16px"/>`;
    html = html.includes("<!-- LOGO -->") ? html.replace("<!-- LOGO -->", logoImg) : html;
    // Nav-Logo ersetzen: Text durch Bild
    html = html.replace(
      /(<a[^>]*id="site-nav-logo"[^>]*>)[^<]*(<\/a>)/i,
      `$1<img src="${logoUrl}" alt="${o.firmenname}" style="height:32px;max-width:150px;object-fit:contain"/>$2`
    );
  } else {
    html = html.replace("<!-- LOGO -->", "");
  }

  // ── Tel:-Links korrigieren (Claude generiert manchmal falsche Nummern) ──
  if (o.telefon) {
    const telNorm = o.telefon.replace(/\s/g, "");
    html = html.replace(/href="tel:[^"]*"/gi, `href="tel:${telNorm}"`);
    html = html.replace(/href='tel:[^']*'/gi, `href='tel:${telNorm}'`);
  }

  // ── Google Maps injizieren (<!-- MAPS --> Placeholder) ──
  if (o.adresse || o.ort) {
    const mapsQuery = encodeURIComponent([o.adresse, o.plz, o.ort].filter(Boolean).join(", ") + ", Österreich");
    const mapsHtml = `<div style="margin-top:24px;border-radius:12px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,.10)">
<iframe src="https://maps.google.com/maps?q=${mapsQuery}&output=embed&hl=de&z=15" width="100%" height="280" style="border:0;display:block" allowfullscreen loading="lazy" title="Standort ${o.firmenname}"></iframe>
</div>`;
    html = html.includes("<!-- MAPS -->")
      ? html.replace("<!-- MAPS -->", mapsHtml)
      : html.replace(/<\/section>\s*(<section[^>]*id="kontakt"|<section[^>]*class="[^"]*kontakt)/i, mapsHtml + "\n</section>\n$1");
  } else {
    html = html.replace("<!-- MAPS -->", "");
  }

  // ── <title> + Meta-Tags programmatisch ueberschreiben ──
  const metaTitle = `${o.firmenname} \u2013 ${o.branche_label || o.branche} in ${o.ort || o.bundesland || "\u00d6sterreich"}`;
  const metaDesc  = (o.kurzbeschreibung || `${o.branche_label || "Ihr Betrieb"} in ${o.ort || "\u00d6sterreich"} \u2013 Jetzt Kontakt aufnehmen!`).slice(0, 155);
  const siteUrl   = `https://sitereadyprototype.pages.dev/s/${sub}`;
  html = html.replace(/<title>[^<]*<\/title>/i, `<title>${metaTitle}</title>`);
  html = html.replace(/<meta\s+name=["']description["'][^>]*>/i, "");
  html = html.replace(/<meta\s+property=["']og:title["'][^>]*>/i, "");
  html = html.replace(/<meta\s+property=["']og:description["'][^>]*>/i, "");
  html = html.replace(/<meta\s+property=["']og:url["'][^>]*>/i, "");
  html = html.replace("</head>", `<meta name="description" content="${metaDesc}">
<meta property="og:title" content="${metaTitle}">
<meta property="og:description" content="${metaDesc}">
<meta property="og:type" content="website">
<meta property="og:url" content="${siteUrl}">
<link rel="canonical" href="${siteUrl}">
</head>`);

  // ── Schema.org JSON-LD (LocalBusiness) ──
  const schemaAddress = {
    "@type": "PostalAddress",
    ...(o.adresse ? {"streetAddress":   o.adresse} : {}),
    ...(o.plz     ? {"postalCode":       o.plz}     : {}),
    ...(o.ort     ? {"addressLocality":  o.ort}     : {}),
    "addressCountry": "AT",
  };
  const sameAs = [o.facebook, o.instagram, o.linkedin, o.tiktok].filter(Boolean).map(normSocial);
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": o.firmenname,
    "description": metaDesc,
    "url": siteUrl,
    "address": schemaAddress,
    ...(o.telefon ? {"telephone": o.telefon} : {}),
    ...(o.email   ? {"email":     o.email}   : {}),
    ...(o.ort     ? {"areaServed": o.ort}    : {}),
    ...(sameAs.length ? {"sameAs": sameAs}   : {}),
  };
  html = html.replace("</head>", `<script type="application/ld+json">${JSON.stringify(schema)}</script>\n</head>`);

  // ── Nav Scroll-Spy (aktiver Link hervorgehoben) ──
  const scrollSpy = `<script>(function(){
var links=document.querySelectorAll('.nav-link[href^="#"]');
var secs=[].map.call(links,function(l){return document.querySelector(l.getAttribute('href'))}).filter(Boolean);
function upd(){var sy=window.scrollY+100;var cur=secs.reduce(function(a,s){return s.offsetTop<=sy?s:a},secs[0]);links.forEach(function(l){var act=cur&&'#'+cur.id===l.getAttribute('href');l.style.opacity=act?'1':'';l.style.fontWeight=act?'700':'';});}
window.addEventListener('scroll',upd,{passive:true});upd();
})();</script>`;
  html = html.replace("</body>", scrollSpy + "\n</body>");

  // ── Floating Call-Button (Mobile) ──
  if (o.telefon) {
    const telHrefFloat = `tel:${o.telefon.replace(/\s/g,"")}`;
    const floatBtn = `<a href="${telHrefFloat}" id="float-call" aria-label="Jetzt anrufen" style="display:none;position:fixed;bottom:24px;right:20px;z-index:9999;background:${pal.a};color:#fff;width:56px;height:56px;border-radius:50%;align-items:center;justify-content:center;box-shadow:0 4px 20px rgba(0,0,0,.25);text-decoration:none;font-size:1.4rem;transition:transform .2s">📞</a>
<script>(function(){var b=document.getElementById('float-call');function s(){b.style.display=window.innerWidth<=768?'flex':'none';}s();window.addEventListener('resize',s);})();</script>`;
    html = html.replace("</body>", floatBtn + "\n</body>");
  }

  /* ─── Auto Quality-Check ─── */
  let qualityScore = 0;
  const qualityIssues = [];
  try {
    const htmlLen = html.length;
    const hasNav = /<nav[\s>]/i.test(html) || /id="sitenav"/i.test(html);
    const hasHero = /min-height:\s*100vh/i.test(html) || /class="[^"]*hero/i.test(html) || /<section[^>]*id="sr-hero"/i.test(html);
    const hasLeistungen = /leistung/i.test(html) || /<!-- LEISTUNGEN -->/i.test(html);
    const hasFooter = /<footer[\s>]/i.test(html);
    const hasImpressum = /impressum/i.test(html);
    const hasDatenschutz = /datenschutz/i.test(html);
    const hasCssVars = /--primary/i.test(html) && /--accent/i.test(html);
    const hasFirmenname = o.firmenname && html.includes(o.firmenname);
    const hasKontakt = /kontakt/i.test(html);
    const title = (html.match(/<title[^>]*>([^<]*)<\/title>/i) || [])[1] || "";
    const desc = (html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i) || [])[1] || "";
    const hasPhone = /tel:/i.test(html);
    const hasEmail = /mailto:/i.test(html);
    const h1Count = (html.match(/<h1[\s>]/gi) || []).length;
    // Kritische Checks (bestimmen ob Retry noetig)
    const hasNavCss = /\.nav-inner|#sitenav|\.nav-link/i.test(html);
    const hasResponsive = /@media/i.test(html);
    const checks = [
      // Kern-Struktur (70 Punkte) — fehlt eins davon, Score < 60 → Retry
      {ok: htmlLen > 5000,    w: 15, fail: "HTML zu kurz (" + htmlLen + " Bytes)"},
      {ok: hasHero,           w: 15, fail: "Hero-Section fehlt"},
      {ok: hasLeistungen,     w: 15, fail: "Leistungen-Section fehlt"},
      {ok: hasFirmenname,     w: 10, fail: "Firmenname nicht im HTML"},
      {ok: hasKontakt,        w: 15, fail: "Kontakt-Section fehlt"},
      // Design-Qualitaet (30 Punkte) — wichtig fuer gutes Aussehen
      {ok: hasCssVars,        w: 5,  fail: "CSS-Variablen fehlen (Design kaputt)"},
      {ok: hasNav,            w: 5,  fail: "Navigation nicht im HTML (wird injiziert, aber CSS fehlt evtl.)"},
      {ok: hasNavCss,         w: 5,  fail: "Navigation-CSS fehlt (Menue sieht kaputt aus)"},
      {ok: hasFooter,         w: 3,  fail: "Footer fehlt"},
      {ok: hasImpressum,      w: 4,  fail: "Impressum-Link fehlt"},
      {ok: hasDatenschutz,    w: 3,  fail: "Datenschutz-Link fehlt"},
      {ok: hasResponsive,     w: 5,  fail: "Keine @media Queries (nicht responsive)"},
    ];
    const maxScore = checks.reduce((a, c) => a + c.w, 0);
    const gotScore = checks.reduce((a, c) => a + (c.ok ? c.w : 0), 0);
    qualityScore = Math.round((gotScore / maxScore) * 100);
    checks.filter(c => !c.ok).forEach(c => qualityIssues.push(c.fail));
    // Bonus-Punkte (nicht kritisch, erhoehen den Score)
    if (title && title.length >= 30) qualityScore = Math.min(100, qualityScore + 0);
    if (hasPhone) qualityScore = Math.min(100, qualityScore + 0);
  } catch(_) { qualityScore = 0; }

  /* ─── Auto-Retry wenn nicht perfekt (max 1x) — besseren Versuch behalten ─── */
  const firstScore = qualityScore;
  const firstHtml = html;
  const firstIssues = [...qualityIssues];
  if (qualityScore < 100 && !body._retry) {
    try {
      const retryRes = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 12000,
          system,
          messages: [{role: "user", content: user + "\n\nWICHTIG: Der erste Versuch hatte Qualitaetsprobleme: " + qualityIssues.join(", ") + ". Bitte stelle sicher dass ALLE Sektionen (Nav, Hero, Leistungen, Kontakt, Footer) vorhanden sind und der HTML-Code vollstaendig ist."}],
        }),
      });
      if (retryRes.ok) {
        const retryData = await retryRes.json();
        let retryHtml = retryData.content?.[0]?.text || "";
        retryHtml = retryHtml.replace(/^```html\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();
        if (retryHtml.length > 3000) {
          // Nav + Footer injizieren
          retryHtml = retryHtml.includes("<!-- NAV -->") ? retryHtml.replace("<!-- NAV -->", navHtml) : retryHtml.replace(/<body[^>]*>/i, m => m + "\n" + navHtml);
          retryHtml = retryHtml.includes("<!-- FOOTER -->") ? retryHtml.replace("<!-- FOOTER -->", footerHtml) : retryHtml.replace(/<\/body>/i, footerHtml + "\n</body>");
          retryHtml = retryHtml.replace("<!-- IMPRESSUM -->", "");
          if (o.telefon) { const tn=o.telefon.replace(/\s/g,""); retryHtml=retryHtml.replace(/href="tel:[^"]*"/gi,`href="tel:${tn}"`); }
          // Score berechnen
          const rLen=retryHtml.length;const rNav=/<nav[\s>]/i.test(retryHtml)||/sitenav/i.test(retryHtml);const rHero=/min-height:\s*100vh/i.test(retryHtml)||/hero/i.test(retryHtml);const rLeis=/leistung/i.test(retryHtml);const rFoot=/<footer[\s>]/i.test(retryHtml);const rImp=/impressum/i.test(retryHtml);const rDat=/datenschutz/i.test(retryHtml);const rCss=/--primary/i.test(retryHtml)&&/--accent/i.test(retryHtml);const rFn=o.firmenname&&retryHtml.includes(o.firmenname);const rKon=/kontakt/i.test(retryHtml);const rNavCss=/\.nav-inner|#sitenav|\.nav-link/i.test(retryHtml);const rResp=/@media/i.test(retryHtml);
          const rc=[{ok:rLen>5000,w:15},{ok:rHero,w:15},{ok:rLeis,w:15},{ok:rFn,w:10},{ok:rKon,w:15},{ok:rCss,w:5},{ok:rNav,w:5},{ok:rNavCss,w:5},{ok:rFoot,w:3},{ok:rImp,w:4},{ok:rDat,w:3},{ok:rResp,w:5}];
          const rMax=rc.reduce((a,c)=>a+c.w,0);const rGot=rc.reduce((a,c)=>a+(c.ok?c.w:0),0);
          const retryScore=Math.round((rGot/rMax)*100);
          // Besseren Versuch behalten
          if (retryScore >= firstScore) {
            html = retryHtml;
            qualityScore = retryScore;
            qualityIssues.length = 0;
            rc.filter(c => !c.ok).forEach(c => qualityIssues.push(c.fail || "Check fehlgeschlagen"));
          } else {
            // Erster Versuch war besser — zuruecksetzen
            html = firstHtml;
            qualityScore = firstScore;
            qualityIssues.length = 0;
            firstIssues.forEach(i => qualityIssues.push(i));
          }
        }
      }
    } catch(_) { /* Retry fehlgeschlagen, Original behalten */ }
  }

  // Auto Support-Ticket wenn Quality-Score nicht perfekt
  if (qualityScore < 100) {
    try{await fetch(`${env.SUPABASE_URL}/rest/v1/support_requests`,{method:"POST",headers:{"Content-Type":"application/json","apikey":env.SUPABASE_SERVICE_KEY,"Authorization":`Bearer ${env.SUPABASE_SERVICE_KEY}`},body:JSON.stringify({email:"system@siteready.at",subject:"[Auto] Website Quality-Score nicht perfekt",message:`Order: ${order_id}\nFirma: ${o.firmenname}\nScore: ${qualityScore}/100\nProbleme: ${qualityIssues.join(", ")}`,status:"offen"})});}catch(_){}
  }

  /* ─── In Supabase speichern + Status setzen ─── */
  const save = await fetch(
    `${env.SUPABASE_URL}/rest/v1/orders?id=eq.${order_id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "apikey": env.SUPABASE_SERVICE_KEY,
        "Authorization": `Bearer ${env.SUPABASE_SERVICE_KEY}`,
        "Prefer": "return=minimal",
      },
      body: JSON.stringify({
        website_html: html, subdomain: sub, status: "trial",
        tokens_in: tokIn, tokens_out: tokOut, cost_eur: costEur, last_error: null,
        quality_score: qualityScore,
        quality_issues: qualityIssues.length ? qualityIssues : null,
        ...(srData?.text_ueber_uns ? {text_ueber_uns: srData.text_ueber_uns} : {}),
        ...(srData?.text_vorteile  ? {text_vorteile:  srData.text_vorteile}  : {}),
        ...(srData?.leistungen_beschreibungen ? {leistungen_beschreibungen: srData.leistungen_beschreibungen} : {}),
      }),
    }
  );

  return Response.json({ok: save.ok, subdomain: sub, status: "live", quality_score: qualityScore});
  } catch(e) {
    try {
      await fetch(`${env.SUPABASE_URL}/rest/v1/orders?id=eq.${order_id}`, {
        method: "PATCH",
        headers: {"Content-Type":"application/json","apikey":env.SUPABASE_SERVICE_KEY,"Authorization":`Bearer ${env.SUPABASE_SERVICE_KEY}`,"Prefer":"return=minimal"},
        body: JSON.stringify({last_error: "Interner Fehler: " + e.message}),
      });
    } catch(_) {}
    return Response.json({error: "Interner Fehler: " + e.message}, {status: 500});
  }
}
