import { mergeDescriptions, buildNav, buildFooter, buildImpressum } from './builders.js';
import { normSocial } from './shared.js';

/* ═══ Design-Templates (synchron mit STYLES_MAP in App.js) ═══ */
const STIL = {
  klassisch: {
    p:"#094067", a:"#0369a1", bg:"#f4f7fa", s:"#d8eefe",
    font: "Inter",
    fontHeading: "Merriweather",
    url: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Merriweather:wght@400;700;900&display=swap",
    r: "4px", rLg: "6px", btnR: "4px",
    feel: "serioes, klar, vertrauenswuerdig, zeitlos, geschaeftlich professionell",
    heroDecor: "3 horizontale Accent-Linien oben rechts (position:absolute, top:48px, right:32px, width:48px/72px/36px, height:2px, background:var(--accent), opacity:.4, gestaffelt mit margin-bottom:8px).",
    cardStyle: "border:1px solid var(--sep); border-left:3px solid var(--accent); box-shadow:none; padding:28px 24px. Hover: transform:translateY(-3px), box-shadow:0 8px 24px rgba(0,0,0,.1).",
    ueberStyle: "Checkmark-Liste: Listenpunkte mit einem einfachen Haken (vor dem Text, Farbe var(--accent), font-weight:700). Sachlicher, direkter Ton.",
  },
  modern: {
    p:"#18181b", a:"#4f46e5", bg:"#fafafa", s:"#e4e4e7",
    font: "Plus Jakarta Sans",
    fontHeading: "Space Grotesk",
    url: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap",
    r: "12px", rLg: "16px", btnR: "100px",
    feel: "modern, dynamisch, frisch, mit Akzenten, einladend",
    heroDecor: "Grosser Hintergrund-Blob: position:absolute, width:480px, height:480px, border-radius:60% 40% 55% 45%, background:var(--accent), opacity:.1, top:-80px, right:-80px, filter:blur(64px), pointer-events:none.",
    cardStyle: "border-radius:16px; box-shadow:0 4px 24px rgba(0,0,0,.07); padding:32px 28px; overflow:hidden; border:none. Farbiger Top-Streifen: before-Element oder border-top:4px solid var(--accent). Hover: transform:translateY(-4px), box-shadow:0 12px 32px rgba(0,0,0,.1).",
    ueberStyle: "Kleine runde Icons (36px, background:var(--accent)22, color:var(--accent), border-radius:50%, display:inline-flex, align-items:center, justify-content:center) vor jedem Vorteilspunkt. Freundlicher, einladender Ton.",
  },
  elegant: {
    p:"#020826", a:"#7a6844", bg:"#f9f4ef", s:"#eaddcf",
    font: "Inter",
    fontHeading: "Cormorant Garamond",
    url: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Cormorant+Garamond:wght@400;500;600;700&display=swap",
    r: "2px", rLg: "4px", btnR: "2px",
    feel: "hochwertig, ruhig, minimalistisch, Premium, zurueckhaltend elegant, Serif-Headings",
    heroDecor: "Klassischer Akzent-Unterstrich direkt unter H1: display:block, width:80px, height:3px, background:var(--accent), margin:16px 0 24px.",
    cardStyle: "border:1px solid var(--sep); padding:28px 24px; box-shadow:none. Hover: background:#fafaf8, box-shadow:0 4px 16px rgba(0,0,0,.06).",
    ueberStyle: "Klassische Strich-Liste: Vorteilspunkte mit einem langen Gedankenstrich (–) in Akzentfarbe als Marker. Ruhiger, Premium-Ton mit viel Whitespace.",
  },
};

/* Custom-Fonts Mapping (fuer custom_font bei jedem Stil) */
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

/* Kontrast-Check: zu helle Farben abdunkeln (WCAG AA 4.5:1 auf weiss) */
function ensureContrast(hex, minRatio) {
  if (!hex || !/^#[0-9a-fA-F]{6}$/i.test(hex)) return hex;
  minRatio = minRatio || 4.5;
  const lum = (c) => { const v = parseInt(c, 16) / 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  const L = (h) => { return 0.2126 * lum(h.slice(1, 3)) + 0.7152 * lum(h.slice(3, 5)) + 0.0722 * lum(h.slice(5, 7)); };
  const ratio = (l1, l2) => (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  let color = hex;
  for (let i = 0; i < 20; i++) {
    if (ratio(1, L(color)) >= minRatio) return color;
    const r = Math.max(0, parseInt(color.slice(1, 3), 16) - 10);
    const g = Math.max(0, parseInt(color.slice(3, 5), 16) - 10);
    const b = Math.max(0, parseInt(color.slice(5, 7), 16) - 10);
    color = "#" + [r, g, b].map(v => v.toString(16).padStart(2, "0")).join("");
  }
  return color;
}

function buildCustomStil(o) {
  const p = ensureContrast(o.custom_color || "#094067", 3.0);
  const a = ensureContrast(o.custom_accent || p); // Accent 4.5:1, Primary 3.0:1
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

  /* Konfiguration — Basis-Stil aus STIL-Map, custom_* Felder mergen bei jedem Stil */
  const basStil = STIL[o.stil] || STIL.klassisch;
  const hasCustomColors = o.custom_color || o.custom_accent;
  const stil = hasCustomColors ? { ...basStil, ...buildCustomStil(o) } : basStil;
  const pal  = { p: stil.p, a: stil.a, bg: stil.bg, s: stil.s };
  const sub  = o.subdomain || (o.firmenname || "firma").toLowerCase().replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,"");
  // Hero-Label: kuerzere, natuerlichere Variante fuer Hero/Meta/Footer. Dropdown-Label bleibt "Installateur / Heizung / Sanitaer".
  const HERO_LABELS = {
    installateur: "Installateur", fliesenleger: "Fliesenleger", schlosser: "Schlossereibetrieb",
    dachdecker: "Dachdeckerei", maurer: "Baumeister", bodenleger: "Bodenleger",
    gaertner: "Gärtnerei", klima: "Klimatechnik", reinigung: "Reinigungsservice",
    kfz: "KFZ-Werkstatt", aufsperrdienst: "Schlüsseldienst", hafner: "Hafner",
    raumausstatter: "Raumausstatter", goldschmied: "Goldschmied", schneider: "Schneiderei",
    erdbau: "Erdbau",
    restaurant: "Restaurant", cafe: "Café", bar: "Bar", heuriger: "Heuriger",
    imbiss: "Imbiss", catering: "Catering",
    baeckerei: "Bäckerei", fleischerei: "Fleischerei", winzer: "Weingut",
    arzt: "Ordination", lebensberater: "Lebensberater",
    energetiker: "Energetiker", diaetologe: "Diätologie",
    pension: "Pension", ferienwohnung: "Ferienwohnung",
    steuerberater: "Steuerberatung", rechtsanwalt: "Rechtsanwaltskanzlei",
    umzug: "Umzug", eventplanung: "Eventplanung", fotograf: "Fotograf",
    florist: "Blumenladen", architekt: "Architekturbüro", it_service: "IT-Service",
    werbeagentur: "Werbeagentur", finanzberater: "Finanzberatung",
    innenarchitekt: "Innenarchitektur", textilreinigung: "Textilreinigung",
    dolmetscher: "Übersetzungsbüro", druckerei: "Druckerei",
    sicherheitsdienst: "Sicherheitsdienst",
    musikschule: "Musikschule", trainer: "Personal Trainer", yoga: "Yogastudio",
    hundeschule: "Hundeschule", reitschule: "Reitstall", coach: "Coach",
    nachhilfe: "Nachhilfe", hundesalon: "Hundesalon",
    permanent_makeup: "Permanent Make-up", tattoo: "Tattoo-Studio",
    // Neue Kategorien
    wellness_hotel: "Wellness-Hotel", urlaubambauernhof: "Urlaub am Bauernhof",
    almhuette: "Almhütte",
    modeboutique: "Modeboutique", schuhladen: "Schuhgeschäft",
    moebelhaus: "Einrichtungshaus", sportgeschaeft: "Sportfachgeschäft",
    elektronikhandel: "Elektronikhandel", bioladen: "Bioladen",
    antiquitaeten: "Antiquitätenhandel", fahrradhandel: "Fahrradhaus",
    spielwaren: "Spielwarengeschäft",
    taxi: "Taxi-Service", limousine: "Limousinen-Service",
    spedition: "Spedition", kurierdienst: "Kurierdienst",
    pannendienst: "Pannendienst", busunternehmen: "Busunternehmen",
    imker: "Imkerei", hofladen: "Hofladen", obstbauer: "Obstgut",
    brennerei: "Destillerie", baumschule: "Baumschule",
    galerie: "Kunstgalerie", kuenstler: "Atelier",
    musiker: "Musiker", theater: "Theater",
    // Fachaerzte
    dermatologe: "Dermatologie", gynaekologe: "Gynäkologie",
    orthopaede: "Orthopädie", hno: "HNO-Ordination",
    augenarzt: "Augenarzt", kinderarzt: "Kinderarzt",
    internist: "Internist", chiropraktiker: "Chiropraktik",
    // Neue Kosmetik
    barbershop: "Barbershop", spa: "Day-Spa",
    // Neue Gastro
    pizzeria: "Pizzeria", eissalon: "Eissalon", vinothek: "Vinothek",
    // Neue Dienstleistung
    webdesigner: "Webdesign-Studio", hochzeitsplaner: "Hochzeitsplanung",
    hausbetreuung: "Hausbetreuung", personenbetreuung: "24h-Betreuung",
    kinderbetreuung: "Kinderbetreuung",
    // Neue Bildung
    sprachschule: "Sprachschule", fitnessstudio: "Fitnessstudio",
    ballettschule: "Ballettschule", kampfsport: "Kampfsportschule",
    skilehrer: "Skischule", bergfuehrer: "Bergführer",
    kochschule: "Kochschule",
    // Neue Handwerk
    steinmetz: "Steinmetzbetrieb", uhrmacher: "Uhrmacher",
    stuckateur: "Stuckateurbetrieb",
    // Erweiterungen 2026-04-27 (Beta-Feedback)
    werbetechnik: "Werbetechnik", schmiede: "Schmiede", reparaturservice: "Reparaturservice",
    brauerei: "Brauerei", kaeserei: "Käserei",
    skateshop: "Skateshop", musikhandel: "Musikfachhandel", schreibwaren: "Schreibwaren",
    tierhandel: "Zoofachhandel", souvenirladen: "Souvenirladen",
    maschinenbau: "Maschinenbau", anlagenbau: "Anlagenbau", metallverarbeitung: "Metallverarbeitung",
  };
  const heroLabel = o.spezialisierung || HERO_LABELS[o.branche] || o.branche_label || o.branche || "Betrieb";
  const betriebstyp = heroLabel;

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
  if (o.fruehstueck) trustItems.push("Frühstück inklusive");
  if (o.wlan) trustItems.push("WLAN kostenlos");
  if (o.haustiere) trustItems.push("Haustiere willkommen");
  if (o.online_shop) trustItems.push("Online-Shop");
  if (leistungen.length >= 3) trustItems.push(`${leistungen.length} Leistungsbereiche`);
  const oezLabel = o.oeffnungszeiten_custom || ({"mo-fr-8-17":"Mo–Fr 8–17 Uhr","mo-fr-7-16":"Mo–Fr 7–16 Uhr","mo-fr-8-18":"Mo–Fr 8–18 Uhr","mo-sa-8-17":"Mo–Sa 8–17 Uhr","mo-sa-8-12":"Mo–Sa 8–12 Uhr","vereinbarung":"Nach Vereinbarung"}[o.oeffnungszeiten]) || "Nach Vereinbarung";
  if (trustItems.length < 4) trustItems.push(oezLabel);
  const trustBar = trustItems.slice(0, 4).join("  ·  ");

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
  // Branchen-Default-CTAs (werden genutzt wenn keine Feature-CTAs zutreffen)
  const BRANCHEN_CTA = {
    // Gesundheit — immer "Termin"
    arzt: "Termin vereinbaren", zahnarzt: "Termin vereinbaren", tierarzt: "Termin vereinbaren",
    physiotherapie: "Termin vereinbaren", psychotherapie: "Termin vereinbaren",
    ergotherapie: "Termin vereinbaren", logopaedie: "Termin vereinbaren",
    hebamme: "Termin vereinbaren", diaetologe: "Termin vereinbaren",
    heilmasseur: "Termin vereinbaren", osteopath: "Termin vereinbaren",
    energetiker: "Termin vereinbaren", optiker: "Termin vereinbaren",
    hoerakustiker: "Termin vereinbaren", lebensberater: "Termin vereinbaren",
    zahntechnik: "Anfrage stellen", apotheke: "Anfrage stellen",
    // Kosmetik — "Termin buchen"
    friseur: "Termin buchen", kosmetik: "Termin buchen", nagel: "Termin buchen",
    massage: "Termin buchen", fusspflege: "Termin buchen",
    permanent_makeup: "Termin buchen", tattoo: "Termin anfragen",
    hundesalon: "Termin buchen",
    // Gastro
    restaurant: "Tisch reservieren", cafe: "Tisch reservieren", bar: "Tisch reservieren",
    heuriger: "Tisch reservieren", imbiss: "Bestellung anfragen",
    catering: "Angebot anfragen", baeckerei: "Vorbestellen",
    fleischerei: "Vorbestellen", winzer: "Verkostung anfragen",
    // Dienstleistung mit Erstgespraech-Fokus
    rechtsanwalt: "Erstberatung anfragen", notar: "Termin vereinbaren",
    steuerberater: "Erstgespräch anfragen", unternehmensberater: "Erstgespräch anfragen",
    finanzberater: "Erstgespräch anfragen", versicherung: "Beratung anfragen",
    coach: "Erstgespräch anfragen",
    // Dienstleistung mit Anfrage-Fokus
    fotograf: "Termin anfragen", florist: "Anfrage stellen",
    immobilien: "Beratung anfragen", hausverwaltung: "Angebot anfragen",
    umzug: "Angebot anfragen", eventplanung: "Anfrage stellen",
    architekt: "Erstgespräch anfragen", innenarchitekt: "Erstgespräch anfragen",
    it_service: "Angebot anfragen", werbeagentur: "Briefing anfragen",
    bestattung: "Kontakt aufnehmen", reisebuero: "Beratung anfragen",
    textilreinigung: "Anfrage stellen", dolmetscher: "Angebot anfragen",
    druckerei: "Angebot anfragen", sicherheitsdienst: "Angebot anfragen",
    // Bildung — Anmeldung/Probestunde
    fahrschule: "Jetzt anmelden", nachhilfe: "Probestunde anfragen",
    musikschule: "Probestunde anfragen", trainer: "Probetraining anfragen",
    yoga: "Probestunde buchen", hundeschule: "Kurs anfragen",
    tanzschule: "Kurs anfragen", reitschule: "Probestunde anfragen",
    schwimmschule: "Kurs anfragen", sprachschule: "Kurs anfragen",
    fitnessstudio: "Probetraining buchen", ballettschule: "Probestunde anfragen",
    kampfsport: "Probetraining buchen", skilehrer: "Kurs buchen",
    bergfuehrer: "Tour anfragen", kochschule: "Kurs buchen",
    // Handwerk ohne Notdienst/KV
    maler: "Angebot anfordern", tischler: "Anfrage stellen",
    bodenleger: "Angebot anfordern", goldschmied: "Beratung anfragen",
    schneider: "Termin vereinbaren", raumausstatter: "Beratung anfragen",
    fahrradwerkstatt: "Service anfragen", rauchfangkehrer: "Termin vereinbaren",
    steinmetz: "Beratung anfragen", uhrmacher: "Anfrage stellen",
    stuckateur: "Angebot anfordern",
    // Handwerk Defaults (Fallback wenn kein notdienst/KV aktiv)
    elektro: "Angebot anfordern", installateur: "Angebot anfordern",
    fliesenleger: "Angebot anfordern", schlosser: "Anfrage stellen",
    dachdecker: "Angebot anfordern", zimmerei: "Angebot anfordern",
    maurer: "Angebot anfordern", glaser: "Anfrage stellen",
    gaertner: "Angebot anfordern", klima: "Angebot anfordern",
    reinigung: "Angebot anfordern", kfz: "Termin vereinbaren",
    aufsperrdienst: "Jetzt anrufen", hafner: "Beratung anfragen",
    schaedlingsbekaempfung: "Einsatz anfragen", erdbau: "Angebot anfordern",
    // Neue Gesundheit
    dermatologe: "Termin vereinbaren", gynaekologe: "Termin vereinbaren",
    orthopaede: "Termin vereinbaren", hno: "Termin vereinbaren",
    augenarzt: "Termin vereinbaren", kinderarzt: "Termin vereinbaren",
    internist: "Termin vereinbaren", chiropraktiker: "Termin vereinbaren",
    // Kosmetik neu
    barbershop: "Termin buchen", spa: "Termin buchen",
    // Gastro neu
    pizzeria: "Tisch reservieren", eissalon: "Anfrage stellen",
    vinothek: "Verkostung anfragen",
    // Dienstleistung neu
    webdesigner: "Angebot anfragen", hochzeitsplaner: "Erstgespräch anfragen",
    hausbetreuung: "Angebot anfordern", personenbetreuung: "Beratung anfragen",
    kinderbetreuung: "Kennenlerntermin buchen",
    // Tourismus
    hotel: "Jetzt buchen", pension: "Jetzt buchen",
    ferienwohnung: "Jetzt buchen", urlaubambauernhof: "Jetzt buchen",
    campingplatz: "Platz anfragen", wellness_hotel: "Jetzt buchen",
    almhuette: "Anfrage stellen",
    // Handel
    modeboutique: "Sortiment ansehen", schuhladen: "Sortiment ansehen",
    buchhandlung: "Kontakt aufnehmen", moebelhaus: "Beratung anfragen",
    sportgeschaeft: "Beratung anfragen", elektronikhandel: "Beratung anfragen",
    bioladen: "Sortiment ansehen", trachten: "Beratung anfragen",
    antiquitaeten: "Anfrage stellen", fahrradhandel: "Probefahrt anfragen",
    spielwaren: "Sortiment ansehen",
    // Mobilitaet
    taxi: "Jetzt anrufen", limousine: "Fahrt anfragen",
    spedition: "Angebot anfragen", kurierdienst: "Lieferung buchen",
    pannendienst: "Jetzt anrufen", busunternehmen: "Angebot anfragen",
    // Agrar
    imker: "Sortiment ansehen", hofladen: "Kontakt aufnehmen",
    obstbauer: "Kontakt aufnehmen", brennerei: "Verkostung anfragen",
    baumschule: "Beratung anfragen",
    // Kultur
    galerie: "Ausstellung besuchen", kuenstler: "Anfrage stellen",
    musiker: "Booking anfragen", theater: "Tickets sichern",
    // Erweiterungen 2026-04-27
    werbetechnik: "Angebot anfragen", schmiede: "Anfrage stellen", reparaturservice: "Reparatur anfragen",
    brauerei: "Verkostung anfragen", kaeserei: "Sortiment ansehen",
    skateshop: "Sortiment ansehen", musikhandel: "Beratung anfragen", schreibwaren: "Sortiment ansehen",
    tierhandel: "Sortiment ansehen", souvenirladen: "Sortiment ansehen",
    maschinenbau: "Anfrage stellen", anlagenbau: "Beratung anfragen", metallverarbeitung: "Angebot anfragen",
  };
  // CTA-Label und Href sauber entkoppelt:
  // - Buchungslink → "Termin buchen" + externer Link (einziger Fall mit "buchen")
  // - Notdienst → "Notdienst anrufen" + tel:
  // - Sonst → branchen- oder kontextspezifisches Label, Ziel ist Kontaktformular (#kontakt)
  // "Termin buchen" wird NIE mit tel:-Href ausgespielt (Beta-Feedback Lea: Label/Ziel-Mismatch).
  const branchenCtaRaw = BRANCHEN_CTA[o.branche] || "Jetzt kontaktieren";
  // "Termin buchen" → "Termin anfragen" wenn kein echter Buchungslink hinterlegt ist
  const branchenCtaSafe = branchenCtaRaw.replace(/\bbuchen\b/i, "anfragen");
  const ctaPrimary = o.buchungslink ? "Termin buchen"
    : o.notdienst ? "Notdienst anrufen"
    : o.kostenvoranschlag ? "Kostenlosen KV anfordern"
    : o.erstgespraech_gratis ? "Gratis Erstgespräch"
    : branchenCtaSafe;
  const ctaPrimaryHref = o.buchungslink ? o.buchungslink
    : o.notdienst && o.telefon ? "{{TEL_HREF}}"
    : "#kontakt";
  const ctaSecondary = "Leistungen ansehen";

  /* ─── Meta ─── */
  const metaTitle = `${o.firmenname} – ${heroLabel} in ${o.ort || o.bundesland || "Österreich"}`;
  const metaDesc  = (o.kurzbeschreibung || `${heroLabel} in ${o.ort || "Österreich"} – Jetzt Kontakt aufnehmen!`).slice(0, 155);
  const siteUrl   = `https://sitereadyprototype.pages.dev/s/${sub}`;

  /* Trust-Leiste wird serve-time injiziert (<!-- TRUST --> Placeholder) */


  /* ─── Preisliste HTML ─── prominenter CTA-Button mit PDF-Icon */
  const preislisteHtml = preislisteUrl ? `<a href="${preislisteUrl}" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:10px;margin-top:32px;padding:14px 26px;background:var(--accent);color:#fff;border-radius:6px;font-family:var(--font);font-weight:700;font-size:.95rem;letter-spacing:.02em;text-decoration:none;box-shadow:0 4px 14px rgba(0,0,0,.12);transition:transform .15s,box-shadow .15s" onmouseover="this.style.transform='translateY(-1px)';this.style.boxShadow='0 6px 18px rgba(0,0,0,.18)'" onmouseout="this.style.transform='';this.style.boxShadow='0 4px 14px rgba(0,0,0,.12)'"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><polyline points="9 15 12 12 15 15"/></svg><span>Komplette Preisliste als PDF</span></a>` : "";

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

  /* ═══ TEXT-GENERIERUNG via Claude (NUR Texte, kein HTML) ═══ */

  // Importierte Daten als Kontext sammeln
  const importContext = [];
  const hasImportedText = !!o.text_ueber_uns;
  const hasImportedFaq = Array.isArray(o.faq) && o.faq.length > 0;
  const hasImportedAblauf = Array.isArray(o.ablauf_schritte) && o.ablauf_schritte.length >= 2;
  const hasImportedGzw = !!o.gut_zu_wissen;
  if (o.spezialisierung) importContext.push(`SPEZIALISIERUNG: ${o.spezialisierung}`);
  if (hasImportedText) importContext.push(`BESTEHENDER UEBER-UNS-TEXT (sprachlich polieren, Inhalt BEIBEHALTEN, nicht komplett neu schreiben):\n${o.text_ueber_uns}`);
  if (hasImportedGzw) importContext.push(`BESTEHENDE KUNDENHINWEISE (UEBERNEHMEN, nur sprachlich glaetten): ${o.gut_zu_wissen}`);
  if (o.leistungen_beschreibungen && Object.keys(o.leistungen_beschreibungen).length > 0) {
    importContext.push(`BESTEHENDE LEISTUNGSBESCHREIBUNGEN (kuerzen und optimieren, Inhalt beibehalten):\n${Object.entries(o.leistungen_beschreibungen).map(([k,v])=>`- ${k}: ${v}`).join("\n")}`);
  }
  if (hasImportedFaq) importContext.push(`BESTEHENDE FAQ (UEBERNEHMEN, nur sprachlich optimieren):\n${o.faq.map(f=>`- ${f.frage} → ${f.antwort}`).join("\n")}`);
  if (hasImportedAblauf) importContext.push(`BESTEHENDE ABLAUF-SCHRITTE (UEBERNEHMEN):\n${o.ablauf_schritte.map((s,i)=>`${i+1}. ${s.titel}: ${s.text||""}`).join("\n")}`);
  // Bewertungen als Kontext (damit KI authentischere Texte schreiben kann)
  if (Array.isArray(o.bewertungen) && o.bewertungen.length > 0) {
    importContext.push(`KUNDENBEWERTUNGEN (nutze diese als Inspiration fuer authentische Texte):\n${o.bewertungen.slice(0,3).map(b=>`"${b.text}" — ${b.name}`).join("\n")}`);
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
  if (o.fruehstueck) merkmaleText.push("Frühstück inklusive");
  if (o.wlan) merkmaleText.push("WLAN kostenlos");
  if (o.haustiere) merkmaleText.push("Haustiere willkommen");
  if (o.online_shop) merkmaleText.push("Online-Shop");
  if (merkmaleText.length > 0) importContext.push(`BESONDERHEITEN (BINDEND — diese Fakten NICHT widersprechen in FAQ/gut_zu_wissen/Texten): ${merkmaleText.join(", ")}`);

  // Team als Kontext
  const teamArr = Array.isArray(o.team_members) ? o.team_members : [];
  if (teamArr.length > 0) importContext.push(`TEAM: ${teamArr.map(t => `${t.name} (${t.rolle||""})`).join(", ")}`);

  // Stil-Anweisung fuer den Textstil
  const stilAnweisung = {
    klassisch: "Serioes, vertrauenswuerdig, bodenstaendig. Klare Sprache ohne Schnörkel. Betone Zuverlaessigkeit und Tradition.",
    modern: "Dynamisch und direkt. Kurze, praegnante Saetze. Betone konkretes Vorgehen und Kundenerlebnis statt abstrakter Versprechen.",
    elegant: "Zurueckhaltend, exklusiv, weniger ist mehr. Schlanke Formulierungen, gehobener Ton. Betone Qualitaet und Anspruch.",
  }[o.stil] || "Professionell und authentisch. Passe den Ton an die Branche an.";

  // Branchengruppe fuer sprachlichen Kontext
  const brGruppe = {
    elektro:"handwerk",installateur:"handwerk",maler:"handwerk",tischler:"handwerk",fliesenleger:"handwerk",schlosser:"handwerk",dachdecker:"handwerk",zimmerei:"handwerk",maurer:"handwerk",bodenleger:"handwerk",glaser:"handwerk",gaertner:"handwerk",klima:"handwerk",reinigung:"handwerk",kfz:"handwerk",aufsperrdienst:"handwerk",hafner:"handwerk",raumausstatter:"handwerk",goldschmied:"handwerk",schneider:"handwerk",rauchfangkehrer:"handwerk",schaedlingsbekaempfung:"handwerk",fahrradwerkstatt:"handwerk",erdbau:"handwerk",steinmetz:"handwerk",uhrmacher:"handwerk",stuckateur:"handwerk",
    friseur:"kosmetik",kosmetik:"kosmetik",nagel:"kosmetik",massage:"kosmetik",tattoo:"kosmetik",fusspflege:"kosmetik",permanent_makeup:"kosmetik",hundesalon:"kosmetik",barbershop:"kosmetik",spa:"kosmetik",
    restaurant:"gastro",cafe:"gastro",baeckerei:"gastro",catering:"gastro",bar:"gastro",heuriger:"gastro",imbiss:"gastro",fleischerei:"gastro",winzer:"gastro",pizzeria:"gastro",eissalon:"gastro",vinothek:"gastro",
    arzt:"gesundheit",zahnarzt:"gesundheit",physiotherapie:"gesundheit",psychotherapie:"gesundheit",tierarzt:"gesundheit",apotheke:"gesundheit",optiker:"gesundheit",ergotherapie:"gesundheit",logopaedie:"gesundheit",energetiker:"gesundheit",hebamme:"gesundheit",diaetologe:"gesundheit",hoerakustiker:"gesundheit",zahntechnik:"gesundheit",heilmasseur:"gesundheit",osteopath:"gesundheit",lebensberater:"gesundheit",dermatologe:"gesundheit",gynaekologe:"gesundheit",orthopaede:"gesundheit",hno:"gesundheit",augenarzt:"gesundheit",kinderarzt:"gesundheit",internist:"gesundheit",chiropraktiker:"gesundheit",
    steuerberater:"dienstleistung",rechtsanwalt:"dienstleistung",fotograf:"dienstleistung",versicherung:"dienstleistung",immobilien:"dienstleistung",hausverwaltung:"dienstleistung",umzug:"dienstleistung",eventplanung:"dienstleistung",florist:"dienstleistung",architekt:"dienstleistung",it_service:"dienstleistung",werbeagentur:"dienstleistung",bestattung:"dienstleistung",notar:"dienstleistung",finanzberater:"dienstleistung",reisebuero:"dienstleistung",innenarchitekt:"dienstleistung",textilreinigung:"dienstleistung",unternehmensberater:"dienstleistung",dolmetscher:"dienstleistung",druckerei:"dienstleistung",sicherheitsdienst:"dienstleistung",webdesigner:"dienstleistung",hochzeitsplaner:"dienstleistung",hausbetreuung:"dienstleistung",personenbetreuung:"dienstleistung",kinderbetreuung:"dienstleistung",
    fahrschule:"bildung",nachhilfe:"bildung",musikschule:"bildung",trainer:"bildung",yoga:"bildung",hundeschule:"bildung",tanzschule:"bildung",reitschule:"bildung",schwimmschule:"bildung",coach:"bildung",sprachschule:"bildung",fitnessstudio:"bildung",ballettschule:"bildung",kampfsport:"bildung",skilehrer:"bildung",bergfuehrer:"bildung",kochschule:"bildung",
    hotel:"tourismus",pension:"tourismus",ferienwohnung:"tourismus",urlaubambauernhof:"tourismus",campingplatz:"tourismus",wellness_hotel:"tourismus",almhuette:"tourismus",
    modeboutique:"handel",schuhladen:"handel",buchhandlung:"handel",moebelhaus:"handel",sportgeschaeft:"handel",elektronikhandel:"handel",bioladen:"handel",trachten:"handel",antiquitaeten:"handel",fahrradhandel:"handel",spielwaren:"handel",
    taxi:"mobilitaet",limousine:"mobilitaet",spedition:"mobilitaet",kurierdienst:"mobilitaet",pannendienst:"mobilitaet",busunternehmen:"mobilitaet",
    imker:"agrar",hofladen:"agrar",obstbauer:"agrar",brennerei:"agrar",baumschule:"agrar",
    galerie:"kultur",kuenstler:"kultur",musiker:"kultur",theater:"kultur",
  }[o.branche] || "";
  const branchenSpezifisch = {
    // Handwerk
    elektro: "Technisch prazise, sicherheitsbewusst. Betone Fachkenntnis bei Stark- und Schwachstrom. Keine uebertriebene Werbesprache.",
    installateur: "Pragmatisch. Spreche Probleme beim Namen (tropfender Hahn, kalte Heizung). Betone Schnelligkeit, Foerder-Know-how und konkrete Reaktionszeit.",
    maler: "Ruhig, handwerklich. Betone Sauberkeit, saubere Kanten, staubarmes Arbeiten. Farbberatung als Service, nicht als Verkauf.",
    tischler: "Wertig, handwerklich, stolz aufs Material. Betone Massanfertigung und regionales Holz. Details wie Verbindungen, Oberflaechen.",
    dachdecker: "Zuverlaessig, wetterfest. Betone Dichtheit, Sturmsicherheit, Lebensdauer. Fachbegriffe wie Unterspannbahn, First, Kehle ok.",
    kfz: "Direkt, technisch kompetent. Keine Angstrhetorik, sondern Loesung. Betone Pickerl-Termine, faire Diagnose.",
    // Kosmetik
    friseur: "Einladend, persoenlich, leicht modisch. Vermeide Uebertriebenheit. Betone individuelles Eingehen auf den Kopf, nicht auf Trends.",
    kosmetik: "Ruhig, pflegend, nicht Schoenheitsindustrie-Hype. Betone Hauttypberatung, saubere Produkte, Wohlbefinden.",
    massage: "Entspannt, koerperlich ehrlich. Betone spuerbare Entspannung und fachliche Griffe, nicht esoterische Versprechen.",
    // Gastro
    restaurant: "Warm, appetitanregend. Betone frische Zutaten, Kueche, Atmosphaere. Vermeide Werbesprache ('kulinarische Highlights' vermeiden).",
    cafe: "Gemuetlich, einladend. Spreche ueber Kaffee, hausgemachten Kuchen, Atmosphaere. Nicht zu gestelzt.",
    baeckerei: "Handwerklich, ehrlich. Betone frisches Backen am Morgen, regionale Zutaten. Vermeide Floskeln wie 'mit Liebe'.",
    // Gesundheit
    arzt: "Sachlich, vertrauensvoll, ohne Pathos. Nimm Patienten ernst ohne belehrend zu sein. Betone Termintreue und Diskretion.",
    zahnarzt: "Beruhigend, aufklaerend. Viele Menschen haben Zahnarzt-Angst — sprich das indirekt an. Betone schmerzarme Behandlung und moderne Technik.",
    physiotherapie: "Aktivierend, kompetent. Betone Befundung, individueller Therapieplan, aktive Mitarbeit. Keine Wunderheilungs-Versprechen.",
    apotheke: "Vertrauensvoll, beratend. Betone persoenliche Beratung und Verfuegbarkeit, weniger die Produkte selbst.",
    // Dienstleistung
    steuerberater: "Sachlich, strukturiert, diskret. Betone Fristeneinhaltung, Gestaltungsspielraum, langfristige Begleitung. Kein Finanzlatein.",
    rechtsanwalt: "Praezise, klar, diskret. Zeige Fachgebiete ohne zu fachlich zu werden. Betone Erreichbarkeit und realistische Einschaetzungen.",
    fotograf: "Persoenlich, bildstark. Betone Vorgespraech, Lockerheit beim Shooting, schnelle Lieferung. Keine Kunstfloskeln.",
    immobilien: "Seriös, marktkundig, ehrlich. Betone regionale Kenntnis, realistische Preiseinschaetzung, sauberen Ablauf.",
    architekt: "Konzeptionell, ruhig, im Dienst des Projekts. Betone Zuhoerer-Qualitaet, nicht Egotrip. Spreche ueber Kosten, Zeitplan, Genehmigung.",
    // Bildung
    fahrschule: "Locker, geduldig, praxisnah. Betone Fahrpraxis, gute Pruefungsquote, moderne Fahrzeuge. Keine Panikmache.",
  };
  const gruppenSprache = {
    handwerk: "Direkt und ehrlich. Handwerker reden nicht um den heissen Brei. Betone Qualitaet der Arbeit, nicht Marketing-Floskeln.",
    kosmetik: "Einladend und persoenlich. Schaffe eine Wohlfuehl-Atmosphaere schon im Text. Betone das Erlebnis.",
    gastro: "Warm und genussvoll. Mach Lust auf den Besuch. Betone Atmosphaere, Qualitaet der Zutaten, Gastfreundschaft.",
    gesundheit: "Einfuehlsam und sachlich. Nimm Patienten ernst. Betone konkrete Erfahrung (Jahre, Spezialisierung) und Termintreue.",
    dienstleistung: "Sachlich und konkret. Zeige Expertise durch Spezifika (Beispiel-Auftraege, Jahre, Branchen-Know-how) statt durch Adjektive. Betone konkreten Kunden-Nutzen.",
    bildung: "Motivierend und unterstuetzend. Mach Lust aufs Lernen. Betone Fortschritt und persoenliche Entwicklung.",
    tourismus: "Einladend, gastfreundlich, regional verankert. Mach Lust auf einen Aufenthalt. Betone Atmosphaere, Lage, Ausstattung.",
    handel: "Einladend, kundennah, produktbewusst. Betone Sortiment, Beratung, Qualitaet — nicht Preiskampf.",
    mobilitaet: "Zuverlaessig, puenktlich, serviceorientiert. Betone Erreichbarkeit, faire Preise, sauberen Ablauf.",
    agrar: "Bodenstaendig, ehrlich, regional. Betone Herkunft, Qualitaet der Produkte, Handwerk. Keine Marketing-Phrasen.",
    kultur: "Kreativ, persoenlich, mit Haltung. Betone Kunstwerke, Stil, Entstehungsprozess — nicht Selbstdarstellung.",
  };
  const branchenSprache = branchenSpezifisch[o.branche] || gruppenSprache[brGruppe] || "";

  // System-Prompt: stabile Regeln + JSON-Format. Wird via Prompt Caching wiederverwendet.
  const systemPrompt = `Du generierst Website-Texte für österreichische Betriebe. Antworte NUR mit validem JSON, keine Erklärungen.

WICHTIG: Verwende IMMER echte deutsche Umlaute (ä, ö, ü, ß) in allen Texten. NIEMALS ae, oe, ue Umschreibungen.

ALLGEMEINE REGELN:
- Österreichisches Deutsch, formelle Ansprache ("Sie"). Verwende österreichische Begriffe (z.B. "Jänner", "heuer", "Ordination" statt "Praxis").
- Warm, professionell, KEINE Superlative ("beste", "führend", "Marktführer", "Nr. 1"), KEINE erfundenen Zahlen/Jahre.

VERBOTENE WÖRTER/PHRASEN (KI-Sprech, Marketing-Bullshit):
- "innovativ", "Innovation", "innovativ zu sein"
- "mit Leidenschaft", "Leidenschaft für...", "leidenschaftlich"
- "ganzheitlich", "ganzheitlicher Ansatz"
- "maßgeschneidert", "individuell zugeschnitten", "perfekt abgestimmt"
- "auf Augenhöhe", "partnerschaftlich"
- "mit Herzblut", "mit Herz"
- "höchste Qualität", "höchste Ansprüche"
- "Ihr Partner für...", "Ihr zuverlässiger Partner"
- "Qualität steht bei uns an erster Stelle"
- "Wir freuen uns auf Ihre Anfrage" (als CTA)
- "aus einer Hand", "Rundum-Service"
- "kompetent und zuverlässig" (als Phrase)
- "langjährige Erfahrung" OHNE konkrete Jahresangabe
- "Ihr Wohlbefinden ist uns wichtig", "Sie stehen im Mittelpunkt"
- "Vertrauen Sie auf...", "Setzen Sie auf..."
- "transparent" als Marketing-Wort ("transparente Kalkulation", "transparente Abwicklung")
- "skalierbar", "flexibel skalierbar"
- "professionell" als Werbe-Adjektiv über sich selbst
- "lösungsorientiert", "ergebnisorientiert", "praxisorientiert"
- "umfassend" als leeres Adjektiv ("umfassende Betreuung", "umfassendes Service")
- "klarer Fokus auf...", "im Mittelpunkt steht..."
- "ohne Überraschungen", "keine bösen Überraschungen"
- "verlässlich" + "zuverlässig" wenn beides im selben Text vorkommt
- "individuell" als generischer Füller ("individuelle Beratung", "individuelle Lösung")

STIL-VERBOTE (Anti-Pattern, machen Texte sofort als KI erkennbar):

1. KEINE Adjektiv-Trios mit synonymen Wörtern.
   SCHLECHT: "strukturiert, transparent und termingerecht umgesetzt"
   SCHLECHT: "funktionierende Systeme, verlässliche Betreuung und ehrliche Beratung"
   GUT: konkrete Aussage statt Adjektiv-Suppe — "Festpreis vorab. Keine Stundenabrechnung."
   Maximal 2 Adjektive nebeneinander, und nur mit konkretem Substantiv.

2. KEIN Passiv in Leistungsbeschreibungen — aktive Verben mit "wir" oder klarem Subjekt.
   SCHLECHT: "Technische Störungen werden rasch identifiziert und behoben."
   SCHLECHT: "Ihre Daten werden regelmäßig gesichert."
   GUT: "Wir beheben Störungen am selben Werktag."
   GUT: "Tägliches Backup auf 3 Standorten, eines davon offline."

3. KONKRETE Zahlen/Spezifika statt schwammige Adjektive.
   SCHLECHT: "rasch", "kurzfristig", "in der Regel innerhalb kurzer Zeit", "vielfältige Auswahl"
   GUT: "innerhalb von 4 Stunden", "noch am selben Werktag", "über 80 Cocktails"
   Wenn keine konkrete Zahl bekannt: lieber Eigenschaft des Vorgehens nennen statt Tempo-Adjektiv.

4. HERO-SUBLINE darf KEIN Branchenbuch-Eintrag sein.
   SCHLECHT (Branchenbuch-Pattern "X, Y sowie Z"): "IT-Dienstleistungen, EDV-Beratung sowie Handel mit Hard- und Software."
   SCHLECHT: "Friseur und Barbier mit Färbe-, Schneide- und Stylingservice in Wien."
   GUT: Charakter-Versprechen oder konkrete Differenzierung.
   Beispiel IT: "IT-Betreuung für Wiener Kanzleien und Praxen — Reaktion innerhalb 1 Stunde."
   Beispiel Friseur: "Klassisches Barbershop-Handwerk in der Margaretenstraße, seit 2018."

5. KEINE Tautologien (zwei synonyme Begriffe im selben Satz).
   SCHLECHT: "Stabile Netzwerke und zuverlässige Server-Infrastruktur."
   SCHLECHT: "Saubere Verarbeitung und ordentliche Ausführung."
   Ein Versprechen pro Satz reicht.

6. KEINE Werbe-Adjektive über sich selbst.
   SCHLECHT: "professionelle Beratung", "kompetente Betreuung", "qualifiziertes Team"
   GUT: konkrete Qualifikation — "Meisterbetrieb seit 1989", "Team aus 4 Tischlern, 2 mit Restaurator-Ausbildung", "ISO-9001-zertifiziert".
   Regel: Wer schreibt "wir sind kompetent", überzeugt damit niemanden. Wer schreibt "Marco war 8 Jahre Bartender im Sacher", schon.

REGELN für spezifische Felder:
- Leistungsbeschreibungen: MAXIMAL 15 Wörter pro Leistung. 1 kurzer, konkreter Satz. Kundenperspektive.
- Vorteile: Nutze ECHTE Besonderheiten (Merkmale, Team, Spezialisierung) statt generische Phrasen. 3-6 Wörter pro Punkt. Müssen sich voneinander unterscheiden.
- kontakt_cta: Branchenspezifisch, nicht generisch. Konkrete Handlungsaufforderung (z.B. "Termin vereinbaren", nicht "Kontakt aufnehmen").

WICHTIG — BESONDERHEITEN als Fakten:
Wenn im User-Prompt "BESONDERHEITEN" gelistet sind, sind das BINDENDE FAKTEN über den Betrieb. Du darfst ihnen in FAQ-Antworten und gut_zu_wissen NIEMALS widersprechen.
- "Haustiere willkommen" → FAQ/gut_zu_wissen zu Haustieren muss POSITIV sein.
- "Frühstück inklusive" → NICHT "optional dazubuchen" oder "auf Anfrage".
- "WLAN kostenlos" → NICHT "gegen Aufpreis".
- "Online-Shop" → erwähne den Shop, nicht "nur vor Ort".
Nutze die BESONDERHEITEN aktiv als Verkaufsargumente in Vorteilen und Texten.

JSON-FORMAT (nur diese Felder, keine zusätzlichen):
{
  "hero_headline": "Kernbotschaft für den Hero — 4-8 Wörter, Nutzen/Versprechen, KEIN Firmenname, KEIN Branchen-Generic wie 'Ihr Experte für...'. Beispiele: 'Frische Wurstwaren seit 1962', 'Ihre Gesundheit in guten Händen', 'Zuverlässig. Schnell. Persönlich.'",
  "leistungen_beschreibungen": {"<Leistungsname>":"[2 kurze Sätze, max 25 Wörter]"},
  "text_ueber_uns": "4-5 Sätze über den Betrieb. Konkret, authentisch, nicht austauschbar.",
  "text_vorteile": ["Vorteil 1","Vorteil 2","Vorteil 3","Vorteil 4","Vorteil 5"],
  "leistungen_intro": "1 kurzer Einleitungssatz für die Leistungen-Sektion",
  "kontakt_cta_headline": "Kurze, branchenspezifische Headline",
  "kontakt_cta_text": "1-2 Sätze, konkrete Motivation zur Kontaktaufnahme",
  "ablauf_schritte": [{"titel":"Schritt 1","text":"Kurze Beschreibung"}],
  "gut_zu_wissen": "Hinweis 1\\nHinweis 2\\nHinweis 3",
  "faq": [{"frage":"Häufige Frage?","antwort":"Antwort in 1-2 Sätzen"}]
}

REGELN für faq:
- 4-5 branchenspezifische Fragen die Kunden TATSÄCHLICH stellen.
- Antworten: 1-2 kurze, hilfreiche Sätze. Konkret, nicht ausweichend.

VERBOTENE FAQ-Fragen (zu austauschbar, bei jedem Betrieb gleich):
- "Welche Zahlungsarten akzeptieren Sie?" / "Kann man mit Karte zahlen?"
- "Wie kann ich einen Termin vereinbaren?" / "Wie buche ich?"
- "Wie lange dauert [Leistung]?" / "Wie lange dauert ein Termin?"
- "Bieten Sie [X] an?" wenn X bereits in LEISTUNGEN steht.
- "Was kostet [Leistung]?" — wenn Preise nicht angegeben sind. Stattdessen: transparente Preisspanne oder konkreten Unterschiedsfaktor nennen.
- Fragen die durch ÖFFNUNGSZEITEN, ADRESSE oder LEISTUNGEN direkt beantwortet sind.
- Generische Höflichkeits-Fragen ("Muss ich einen Termin vereinbaren?" bei einem Friseur der online buchbar ist).

GUTE FAQ-Fragen sind branchen-/betriebsspezifisch und beantworten Dinge,
die ein Neukunde WIRKLICH vor Besuch/Anruf wissen will — z.B. Spezialfaelle,
Voraussetzungen, was man mitbringen muss, was nicht geht.

- Beispiele pro Branche:
  - Elektriker: "Wie schnell sind Sie bei einem Notfall vor Ort?" → "In der Regel innerhalb von 30-60 Minuten. Unser Notdienst ist rund um die Uhr erreichbar."
  - Installateur: "Übernehmen Sie Förderanträge für Wärmepumpen?" → "Ja, wir unterstützen Sie bei der Antragstellung für Bundes- und Landesförderungen."
  - Zahnarzt: "Arbeiten Sie mit allen Kassen zusammen?" → "Ja, wir haben Verträge mit allen österreichischen Sozialversicherungsträgern."
  - Arzt: "Brauche ich einen Termin?" → "Ja, bitte vereinbaren Sie telefonisch oder online einen Termin. Akutfälle werden dazwischen behandelt."
  - Physiotherapie: "Übernimmt die Kasse die Kosten?" → "Bei ärztlicher Verordnung übernimmt die Kasse einen Teil. Den Rest verrechnen wir privat."
  - Friseur: "Kann ich kurzfristig einen Termin bekommen?" → "Oft ja — rufen Sie einfach an oder buchen Sie online. Wir finden meist einen Platz."
  - Restaurant: "Kann ich einen Tisch reservieren?" → "Ja, gerne — telefonisch oder online. Für größere Gruppen bitte rechtzeitig melden."
  - Cafe: "Haben Sie glutenfreie oder vegane Optionen?" → "Ja, wir haben täglich mehrere vegane und glutenfreie Auswahl, auf Anfrage auch Sonderwünsche."
  - Steuerberater: "Wann sollte ich den ersten Termin vereinbaren?" → "Spätestens im ersten Geschäftsjahr. Je früher, desto mehr Gestaltungsspielraum haben Sie."
  - Rechtsanwalt: "Was kostet ein Erstgespräch?" → "Das Erstgespräch dauert 30 Minuten und kostet [Betrag]. Wir besprechen offen, ob wir Ihnen helfen können."
  - Fotograf: "Wann bekomme ich die Bilder?" → "Innerhalb von 2-3 Wochen erhalten Sie die fertig bearbeiteten Bilder per Online-Galerie."
  - Immobilienmakler: "Was kostet die Maklerprovision?" → "Gesetzlich geregelt: max. 3% plus USt. vom Kaufpreis. Details klären wir im Erstgespräch."
  - Bar: "Ab welchem Alter darf ich rein?" → "Ab 18 Jahren mit gültigem Ausweis. Bei großen Gruppen empfehlen wir eine Reservierung."
  - Spa/Massage: "Was sollte ich zur Behandlung mitbringen?" → "Nichts — Bademantel, Handtücher und Hausschuhe stellen wir. Bitte 15 Min vorher da sein."
  - Hundesalon: "Wie lange dauert ein Groomingtermin?" → "Je nach Rasse und Fellzustand 1-3 Stunden. Wir melden uns wenn Ihr Hund abholbereit ist."
  - IT-Service: "Wie schnell reagiert ihr bei einem Ausfall?" → "SLA-Kunden innerhalb 1h, alle anderen werktags am selben Tag. Remote-Unterstützung ist meist sofort möglich."
  - Tischler: "Wie lange dauert eine Maßanfertigung?" → "Küche: 6-8 Wochen nach Aufmaß. Einzelmöbel: 3-5 Wochen. Liefertermin steht mit KV fest."
  - Dachdecker: "Kommen Sie auch für kleine Reparaturen?" → "Ja, wir reparieren auch einzelne Ziegel oder Dachrinnen — Mindestauftrag nach Anfrage."

REGELN für ablauf_schritte:
- 3-4 branchenspezifische Schritte die zeigen wie die Zusammenarbeit abläuft.
- Titel: 2-4 Wörter. Text: 1 kurzer Satz, max 10 Wörter.
- Müssen zum konkreten Betrieb passen, nicht generisch.
- Beispiele pro Branche:
  - Arzt: Termin vereinbaren → Erstgespräch → Untersuchung → Befund & Therapie.
  - Zahnarzt: Termin buchen → Untersuchung → Behandlungsplan → Durchführung.
  - Handwerker: Anfrage schildern → Besichtigung & KV → Terminvereinbarung → Umsetzung.
  - Installateur: Anruf/Anfrage → Vor-Ort-Termin → Kostenvoranschlag → Montage.
  - Physiotherapie: Erstgespräch → Befunderhebung → Therapieplan → Behandlung.
  - Friseur: Termin buchen → Beratung → Behandlung → Styling & Pflege-Tipps.
  - Fotograf: Kennenlernen → Location-Planung → Shooting → Bildauswahl & Lieferung.
  - Anwalt: Erstberatung → Aktenstudium → Strategie → Umsetzung.
  - Architekt: Erstgespräch → Entwurf → Einreichung → Bauleitung.
  - Steuerberater: Unterlagen → Prüfung → Besprechung → Einreichung.
  - Restaurant: Reservierung → Ankunft → Empfehlungen vom Küchenchef → Genuss.

REGELN für gut_zu_wissen:
- 2-3 branchentypische permanente Hinweise für Kunden, getrennt durch Zeilenumbruch.
- Nur relevante, konkrete Infos. Keine Marketing-Floskeln.
- Beispiele pro Branche:
  - Arzt: "Bitte e-Card mitbringen\\nAnnahmeschluss 30 Min vor Ordinationsende."
  - Zahnarzt: "Bitte e-Card und Befunde mitbringen\\nBei Verhinderung mindestens 24h vorher absagen."
  - Physiotherapie: "Bitte Überweisung und e-Card mitbringen\\nBequeme Kleidung empfohlen."
  - Friseur: "Termine können bis 24h vorher kostenlos storniert werden\\nKartenzahlung möglich."
  - Restaurant: "Reservierung empfohlen\\nBitte Allergien vorab bekannt geben."
  - Installateur: "Notdienst auch am Wochenende erreichbar\\nKostenvoranschlag immer vor Beginn der Arbeiten."
  - Fotograf: "Anzahlung bei Buchung\\nFinale Bildauswahl 2-3 Wochen nach Shooting."
  - Anwalt: "Erstgespräch nach Terminvereinbarung\\nBitte relevante Unterlagen mitbringen."
  - Steuerberater: "Jahresabschluss-Unterlagen bis Ende März einreichen\\nBelege bitte chronologisch geordnet."`;

  // User-Prompt: dynamische Kundendaten. Nicht gecacht.
  const userPrompt = `BETRIEB: ${o.firmenname}
BRANCHE: ${o.branche_label || o.branche}
ORT: ${[o.ort, o.bundesland ? `(${o.bundesland.toUpperCase()})` : ""].filter(Boolean).join(" ") || "Österreich"}
EINSATZGEBIET: ${o.einsatzgebiet || o.ort || ""}
BESCHREIBUNG: ${o.kurzbeschreibung || ""}
LEISTUNGEN: ${leistungen.join(", ")}
DESIGN-STIL: ${o.stil || "klassisch"}
${importContext.length > 0 ? "\n" + importContext.join("\n") + "\n" : ""}
TONALITÄT: ${stilAnweisung}
${branchenSprache ? `BRANCHENSPRACHE: ${branchenSprache}` : ""}

SPEZIFISCH für diesen Auftrag:
- ${o.ort ? `Regionaler Bezug: Erwähne "${o.ort}" im Über-uns-Text und in der Kontakt-CTA. Der Betrieb ist lokal verankert.` : "Kein spezifischer Ort angegeben — bleibe allgemein."}
- ${hasImportedText ? "Bestehender Über-uns-Text: Inhalt BEIBEHALTEN, nur sprachlich polieren und auf 4-5 Sätze kürzen. NICHT komplett neu schreiben." : "Über-uns-Text: Konkret und spezifisch für DIESEN Betrieb. Was macht ihn besonders? Ort, Geschichte, Spezialisierung einbauen."}
- ${hasImportedFaq ? "Bestehende FAQ: ÜBERNEHMEN und nur sprachlich glätten." : "FAQ: 4-5 Fragen die ECHTE Kunden dieser Branche stellen würden. Konkrete, hilfreiche Antworten."}
- ${hasImportedAblauf ? "Bestehende Ablauf-Schritte: ÜBERNEHMEN, nur sprachlich optimieren." : "Ablauf: 3-4 Schritte die zum KONKRETEN Betrieb passen."}
- ${hasImportedGzw ? "Bestehende Kundenhinweise: ÜBERNEHMEN." : "Gut-zu-wissen: 2-3 praxisrelevante Hinweise für Kunden."}
- ${o.ort ? `kontakt_cta: "in ${o.ort}" einbauen.` : ""}

LEISTUNGEN für leistungen_beschreibungen Keys: ${JSON.stringify(leistungen)}`;

  const aiRes = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 8192,
      thinking: { type: "enabled", budget_tokens: 2000 },
      system: [
        { type: "text", text: systemPrompt, cache_control: { type: "ephemeral" } },
      ],
      messages: [{role: "user", content: userPrompt}],
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
  const tokCacheWrite = usage.cache_creation_input_tokens || 0;
  const tokCacheRead = usage.cache_read_input_tokens || 0;
  // Sonnet 4.6: Input $3/M, Cache-Write $3.75/M (+25%), Cache-Read $0.30/M (-90%), Output $15/M.
  const costEur = Math.round(((tokIn * 3 + tokCacheWrite * 3.75 + tokCacheRead * 0.30 + tokOut * 15) / 1000000) * 0.92 * 10000) / 10000;

  // Mit Extended Thinking enthaelt content[] zuerst einen thinking-Block, dann text.
  let rawText = aiData.content?.find(c => c.type === "text")?.text || "{}";
  rawText = rawText.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();

  let texts = {};
  try { texts = JSON.parse(rawText); } catch(parseErr) {
    console.error("JSON-Parse der Claude-Antwort fehlgeschlagen:", parseErr.message, "rawText:", rawText.slice(0, 500));
    texts = { leistungen_beschreibungen: {}, text_ueber_uns: "", text_vorteile: [], leistungen_intro: "", kontakt_cta_headline: "Kontaktieren Sie uns", kontakt_cta_text: "Wir freuen uns auf Ihre Anfrage." };
  }

  /* ═══ TEMPLATE BEFUELLEN ═══ */
  const { buildTemplate } = await import("../templates/template.js");

  // Hero-Headline: User-Override > Claude-Generierung > leer (Fallback = Firmenname im Template)
  const heroHeadline = (o.hero_headline && o.hero_headline.trim()) || texts.hero_headline || "";

  // firmenname und kurzbeschreibung als Placeholder ans Template uebergeben —
  // damit greifen Portal-Aenderungen serve-time, ohne Re-Generate. einsatzgebiet
  // und brancheLabel bleiben baked (aendern sich praktisch nie nachtraeglich).
  let html = buildTemplate({
    firmenname: "{{FIRMENNAME}}",
    brancheLabel: heroLabel,
    einsatzgebiet: o.einsatzgebiet || o.bundesland || "Österreich",
    kurzbeschreibung: "{{KURZBESCHREIBUNG}}",
    heroHeadline,
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

  /* ─── Schema.org JSON-LD (LocalBusiness + Services + FAQPage + AggregateRating) ─── */
  const sameAs = [o.facebook, o.instagram, o.linkedin, o.tiktok].filter(Boolean).map(normSocial);
  const businessId = `${siteUrl}#business`;

  // OpeningHoursSpecification strukturiert aus Preset-Key oder Custom-String
  const OEZ_STRUCT = {
    "mo-fr-8-17": [{dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday"], opens: "08:00", closes: "17:00"}],
    "mo-fr-7-16": [{dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday"], opens: "07:00", closes: "16:00"}],
    "mo-fr-8-18": [{dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday"], opens: "08:00", closes: "18:00"}],
    "mo-sa-8-17": [{dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"], opens: "08:00", closes: "17:00"}],
    "mo-sa-8-12": [{dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"], opens: "08:00", closes: "12:00"}],
  };
  const openingSpec = OEZ_STRUCT[o.oeffnungszeiten] || null;

  // LocalBusiness Core
  const localBusiness = {
    "@type": "LocalBusiness",
    "@id": businessId,
    "name": o.firmenname,
    "description": metaDesc,
    "url": siteUrl,
    "address": { "@type": "PostalAddress", ...(o.adresse ? {"streetAddress": o.adresse} : {}), ...(o.plz ? {"postalCode": o.plz} : {}), ...(o.ort ? {"addressLocality": o.ort} : {}), "addressCountry": "AT" },
    ...(o.telefon ? {"telephone": "{{TEL_DISPLAY}}"} : {}),
    ...(o.email ? {"email": "{{EMAIL}}"} : {}),
    ...(o.url_logo ? {"logo": o.url_logo} : {}),
    ...(o.url_hero ? {"image": o.url_hero} : {}),
    ...(o.einsatzgebiet || o.ort ? {"areaServed": o.einsatzgebiet || o.ort} : {}),
    ...(openingSpec
      ? {"openingHoursSpecification": openingSpec.map(s => ({"@type":"OpeningHoursSpecification", ...s}))}
      : (oez && oez !== "Nach Vereinbarung" ? {"openingHours": oez} : {})),
    ...(sameAs.length ? {"sameAs": sameAs} : {}),
  };

  // AggregateRating (nur wenn ≥ 2 Bewertungen mit Sterne > 0)
  const ratedBewertungen = Array.isArray(o.bewertungen) ? o.bewertungen.filter(b => b && b.sterne > 0) : [];
  if (ratedBewertungen.length >= 2) {
    const avg = ratedBewertungen.reduce((s, b) => s + (parseInt(b.sterne) || 0), 0) / ratedBewertungen.length;
    localBusiness.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": Math.round(avg * 10) / 10,
      "reviewCount": ratedBewertungen.length,
      "bestRating": 5,
      "worstRating": 1,
    };
  }

  // Service Schema pro Leistung
  const serviceEntities = leistungen.map((l, i) => ({
    "@type": "Service",
    "@id": `${siteUrl}#service-${i + 1}`,
    "name": l,
    ...(texts.leistungen_beschreibungen?.[l] || o.leistungen_beschreibungen?.[l]
      ? {"description": (texts.leistungen_beschreibungen?.[l] || o.leistungen_beschreibungen?.[l]).slice(0, 200)}
      : {}),
    "provider": {"@id": businessId},
    ...(o.einsatzgebiet || o.ort ? {"areaServed": o.einsatzgebiet || o.ort} : {}),
  }));
  if (serviceEntities.length > 0) {
    localBusiness.makesOffer = serviceEntities.map(s => ({"@type": "Offer", "itemOffered": {"@id": s["@id"]}}));
  }

  // FAQPage Schema (aus Import oder Claude-Output)
  const faqForSchema = hasImportedFaq ? (o.faq || []) : (texts.faq || []);
  const graphEntities = [localBusiness, ...serviceEntities];
  if (Array.isArray(faqForSchema) && faqForSchema.length >= 2) {
    graphEntities.push({
      "@type": "FAQPage",
      "@id": `${siteUrl}#faq`,
      "mainEntity": faqForSchema.slice(0, 10).map(f => ({
        "@type": "Question",
        "name": String(f.frage || "").slice(0, 300),
        "acceptedAnswer": {"@type": "Answer", "text": String(f.antwort || "").slice(0, 1000)},
      })),
    });
  }

  const schema = {"@context": "https://schema.org", "@graph": graphEntities};
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
        osteopath:"photo-1576091160550-2173dba999ef",
        lebensberater:"photo-1573497620053-ea5300f94f21",
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
        unternehmensberater:"photo-1497366216548-37526070297c",dolmetscher:"photo-1434030216411-0b793f4b4173",
        druckerei:"photo-1562654501-a0ccc0fc3fb1",sicherheitsdienst:"photo-1557597774-9d273605dfa9",
        // Bildung
        fahrschule:"photo-1449965408869-eaa3f722e40d",nachhilfe:"photo-1427504494785-3a9ca7044f45",
        musikschule:"photo-1511379938547-c1f69419868d",trainer:"photo-1534438327276-14e5300c3a48",
        yoga:"photo-1545205597-3d9d02c29597",hundeschule:"photo-1587300003388-59208cc962cb",
        tanzschule:"photo-1504609813442-a8924e83f76e",reitschule:"photo-1553284965-83fd3e82fa5a",
        schwimmschule:"photo-1519315901367-f34ff9154487",
        coach:"photo-1552581234-26160f608093",
        // Handwerk (neue)
        fahrradwerkstatt:"photo-1571068316344-75bc76f77890",erdbau:"photo-1504307651254-35680f356dfd",
        // Gastro (neue)
        winzer:"photo-1506377247377-2a5b3b417ebb",
        // Erweiterungen 2026-04-27 (Beta-Feedback)
        werbetechnik:"photo-1567527415038-c80aa3b58a8b",schmiede:"photo-1504328345606-18bbc8c9d7d1",
        reparaturservice:"photo-1581092446327-9b52bd1570c2",
        brauerei:"photo-1571613914409-bd3045b54880",kaeserei:"photo-1452195100486-9cc805987862",
        skateshop:"photo-1531565637446-32307b194362",musikhandel:"photo-1511379938547-c1f69419868d",
        schreibwaren:"photo-1497019220340-65aa1b8ec33a",tierhandel:"photo-1583511655802-41f361389c64",
        souvenirladen:"photo-1481437156560-3205f6a55735",
        maschinenbau:"photo-1565043589221-1a6fd9ae45c7",anlagenbau:"photo-1581094271901-8022df4466f9",
        metallverarbeitung:"photo-1504328345606-18bbc8c9d7d1",
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
  // Hero: id-Check (class="hero sr-grain" matcht den alten class="hero" Substring nicht)
  const hasHero = html.includes('id="sr-hero"');
  const hasLeist = html.includes('id="leistungen"');
  const hasKontakt = html.includes('id="kontakt"');
  const hasNav = html.includes('id="sitenav"');
  const hasFooter = html.includes('<footer');
  if (!hasHero) qIssues.push({type:"missing_section", section:"hero"});
  if (!hasLeist) qIssues.push({type:"missing_section", section:"leistungen"});
  if (!hasKontakt) qIssues.push({type:"missing_section", section:"kontakt"});
  if (!hasNav) qIssues.push({type:"missing_section", section:"nav"});
  if (!hasFooter) qIssues.push({type:"missing_section", section:"footer"});

  // 4. Score berechnen
  const criticalMissing = qIssues.filter(i => i.type === "missing_section").length;
  const qualityScore = Math.max(0, 100 - (criticalMissing * 20) - (unknownPlaceholders.length * 5));

  /* ─── Varianten-Cache berechnen ─── */
  const { berechneVarianten } = await import("./varianten.js");
  const fotoMap = o.leistungen_fotos || {};
  const leistMitFoto = leistungen.map(l => ({foto: !!(fotoMap[l] || fotoMap[l.charAt(0).toUpperCase() + l.slice(1)])}));
  // Importierte Daten bevorzugen — Claude überschreibt keine bestehenden Customer-Daten
  const ablaufFinal = hasImportedAblauf ? (o.ablauf_schritte || []) : (texts.ablauf_schritte || []);
  const faqFinal = hasImportedFaq ? (o.faq || []) : (texts.faq || []);
  // Bestehende Hero-Wahl des Kunden beibehalten (Portal-Override)
  const existingHero = o.varianten_cache?.hero;
  const variantenCache = berechneVarianten({
    hero_image: o.url_hero || null,
    hero_override: existingHero || null,
    stil: o.stil || "klassisch",
    branche: o.branche || "",
    leistungen: leistMitFoto,
    ablauf: ablaufFinal,
    bewertungen: o.bewertungen || [],
    team: o.team_members || [],
    faq: faqFinal,
    galerie: o.galerie || [],
    partner: o.partner || [],
    adresse: o.adresse,
    plz: o.plz,
  });

  /* ─── In Supabase speichern ─── */
  // Kern-Felder (muessen existieren)
  const savePayload = {
    website_html: html, subdomain: sub, status: o.status === "live" ? "live" : "trial",
    tokens_in: tokIn, tokens_out: tokOut, cost_eur: costEur, last_error: null,
    // Hero-Headline: User-Edit behalten, sonst Claude-Generierung uebernehmen
    ...(!o.hero_headline && texts.hero_headline ? {hero_headline: texts.hero_headline} : {}),
    // Ueber-uns: KI-polierte Version speichern (Prompt nutzt Import als Grundlage)
    ...(texts.text_ueber_uns ? {text_ueber_uns: texts.text_ueber_uns} : {}),
    ...(texts.text_vorteile ? {text_vorteile: texts.text_vorteile} : {}),
    // Leistungsbeschreibungen: Import-Daten beibehalten, nur fehlende durch KI ergaenzen
    ...(texts.leistungen_beschreibungen ? {leistungen_beschreibungen: mergeDescriptions(o.leistungen_beschreibungen, texts.leistungen_beschreibungen)} : {}),
    // Ablauf/FAQ/GzW: KI-Version NUR wenn keine Import-Daten vorhanden
    ...(!hasImportedAblauf && texts.ablauf_schritte?.length ? {ablauf_schritte: texts.ablauf_schritte} : {}),
    ...(!hasImportedGzw && texts.gut_zu_wissen ? {gut_zu_wissen: texts.gut_zu_wissen} : {}),
    ...(!hasImportedFaq && texts.faq?.length ? {faq: texts.faq} : {}),
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
        varianten_cache: variantenCache,
        ai_generated: [hasImportedText?"text_ueber_uns_poliert":"text_ueber_uns","text_vorteile","kontakt_cta",...(!o.leistungen_beschreibungen||!Object.keys(o.leistungen_beschreibungen).length?["leistungen_beschreibungen"]:[]),...(!hasImportedAblauf?["ablauf_schritte"]:[]),...(!hasImportedGzw?["gut_zu_wissen"]:[]),...(!hasImportedFaq&&texts.faq?.length?["faq"]:[]),...(!o.hero_headline&&texts.hero_headline?["hero_headline"]:[])],
      }),
    });
  } catch(_) { /* Spalten existieren evtl. noch nicht — kein Blocker */ }

  await log.timeEnd("generate", order_id, "generate_done");
  return {ok: true, subdomain: sub, status: "live"};
}

