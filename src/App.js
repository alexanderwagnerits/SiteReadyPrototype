import React, { useState, useCallback, useRef, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = (process.env.REACT_APP_SUPABASE_URL && process.env.REACT_APP_SUPABASE_ANON_KEY)
  ? createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_ANON_KEY)
  : null;

/* ═══ ERROR LOGGING ═══ */
let lastAutoTicket=0;
const logErrorToSupabase=async(error,source="js")=>{
  if(!supabase)return;
  try{
    const ua=navigator.userAgent||"";
    const url=window.location.href;
    const msg=String(error?.message||error||"Unknown error").slice(0,2000);
    const userEmail=supabase.auth?.getUser?((await supabase.auth.getUser())?.data?.user?.email||null):null;
    await supabase.from("error_logs").insert({
      message:msg,
      stack:String(error?.stack||"").slice(0,4000),
      source,
      url,
      user_agent:ua.slice(0,500),
      user_email:userEmail,
      created_at:new Date().toISOString()
    });
    // Auto Support-Ticket bei kritischen Fehlern (alle Besucher, max 1x pro 5 Min)
    if(source!=="test"&&Date.now()-lastAutoTicket>1800000){
      lastAutoTicket=Date.now();
      const ticketEmail=userEmail||"anonymous@siteready.at";
      await supabase.from("support_requests").insert({
        email:ticketEmail,
        subject:"[Auto] Frontend-Fehler",
        message:`Automatisch erkannter Fehler:\n\n${msg}\n\nSeite: ${url}\nBrowser: ${ua.slice(0,200)}`,
        status:"offen"
      });
    }
  }catch(e){/* silent */}
};
window.addEventListener("error",(ev)=>{logErrorToSupabase(ev.error||ev.message,"window.onerror");});
window.addEventListener("unhandledrejection",(ev)=>{logErrorToSupabase(ev.reason,"unhandledrejection");});

/* ═══ DATA ═══ */
const BRANCHEN = [
  // Handwerk
  { value:"elektro",         gruppe:"handwerk", label:"Elektroinstallationen",            leistungen:["Elektroinstallationen","Störungsbehebung & Reparatur","Smart Home Systeme","Photovoltaik & Speicher","Beleuchtungstechnik","Notdienst 24/7"],stil:"professional" },
  { value:"installateur",    gruppe:"handwerk", label:"Installateur / Heizung / Sanitär", leistungen:["Heizungsinstallation & Wartung","Sanitärinstallationen","Rohrreinigung","Badsanierung","Wärmepumpen","Notdienst 24/7"],stil:"professional" },
  { value:"maler",           gruppe:"handwerk", label:"Malerei & Anstrich",                leistungen:["Innenmalerei","Fassadenanstrich","Tapezierarbeiten","Lackierarbeiten","Schimmelbehandlung","Farbberatung"],stil:"modern" },
  { value:"tischler",        gruppe:"handwerk", label:"Tischlerei",                        leistungen:["Möbel nach Maß","Küchenbau","Innenausbau","Fenster & Türen","Reparaturen","Restaurierung"],stil:"traditional" },
  { value:"fliesenleger",    gruppe:"handwerk", label:"Fliesenleger",                      leistungen:["Fliesenverlegung","Badsanierung","Natursteinarbeiten","Terrassenplatten","Abdichtungen","Reparaturen"],stil:"modern" },
  { value:"schlosser",       gruppe:"handwerk", label:"Schlosserei / Metallbau",           leistungen:["Stahl- & Metallbau","Geländer & Zäune","Tore & Türen","Schweißarbeiten","Reparaturen","Sonderanfertigungen"],stil:"professional" },
  { value:"dachdecker",      gruppe:"handwerk", label:"Dachdecker / Spengler",             leistungen:["Dachsanierung","Dachdämmung","Flachdach","Dachrinnen & Spenglerarbeiten","Dachfenster","Notdienst"],stil:"traditional" },
  { value:"zimmerei",        gruppe:"handwerk", label:"Zimmerei",                          leistungen:["Dachstühle & Holzbau","Carports & Terrassen","Aufstockungen","Holzfassaden","Sanierung & Altholz","Sonderanfertigungen"],stil:"traditional" },
  { value:"maurer",          gruppe:"handwerk", label:"Maurer / Baumeister",               leistungen:["Rohbau & Mauerwerk","Zu- & Umbauten","Sanierung & Renovierung","Fassadenarbeiten","Estricharbeiten","Abbrucharbeiten"],stil:"professional" },
  { value:"bodenleger",      gruppe:"handwerk", label:"Bodenleger / Parkett",              leistungen:["Parkettverlegung","Laminat & Vinyl","Schleifen & Versiegeln","Teppichboden","Reparaturen","Bodenberatung"],stil:"modern" },
  { value:"glaser",          gruppe:"handwerk", label:"Glaser",                            leistungen:["Glasreparaturen","Isolierglas","Spiegel & Glasmöbel","Duschwände","Glasfassaden","Notdienst"],stil:"modern" },
  { value:"gaertner",        gruppe:"handwerk", label:"Gärtner / Landschaftsbau",         leistungen:["Gartengestaltung","Pflasterarbeiten","Bepflanzung & Pflege","Bewässerungssysteme","Zaunbau","Baumschnitt & Pflege"],stil:"modern" },
  { value:"klima",           gruppe:"handwerk", label:"Klimatechnik / Lüftung",           leistungen:["Klimaanlagen Installation","Lüftungsanlagen","Wartung & Service","Wärmepumpen","Kühltechnik","Notdienst"],stil:"professional" },
  { value:"reinigung",       gruppe:"handwerk", label:"Reinigung / Gebäudeservice",       leistungen:["Gebäudereinigung","Fensterreinigung","Grundreinigung","Teppichreinigung","Fassadenreinigung","Winterdienst"],stil:"modern" },
  { value:"sonstige",        gruppe:"handwerk", label:"Sonstige Handwerksbranche",         leistungen:[],stil:"professional" },
  // Kosmetik & Körperpflege
  { value:"kosmetik",        gruppe:"kosmetik", label:"Kosmetikstudio",                    leistungen:["Gesichtsbehandlungen","Körperpflege & Peeling","Waxing & Haarentfernung","Anti-Aging-Behandlungen","Augenbrauen & Wimpern","Beratung & Pflegeroutine"],stil:"modern" },
  { value:"friseur",         gruppe:"kosmetik", label:"Friseursalon",                      leistungen:["Haarschnitt Damen & Herren","Färben & Strähnchen","Hochzeitsstyling","Haarbehandlungen","Kinder-Haarschnitt","Bartpflege"],stil:"modern" },
  { value:"nagel",           gruppe:"kosmetik", label:"Nagelstudio",                       leistungen:["Gel-Nägel & Shellac","Nagelverlängerung","Nail Art & Design","Nagelreparatur","Fußpflege & Nagellack","Beratung"],stil:"modern" },
  { value:"massage",         gruppe:"kosmetik", label:"Massage & Wellness",                leistungen:["Klassische Massage","Sportmassage","Entspannungsmassage","Hot-Stone-Massage","Triggerpunkt-Therapie","Lymphdrainage"],stil:"modern" },
  { value:"tattoo",          gruppe:"kosmetik", label:"Tattoo & Piercing",                 leistungen:["Custom Tattoos","Cover-ups & Korrekturen","Piercing","Beratung & Design","Pflege & Nachsorge","Laser-Entfernung"],stil:"professional" },
  { value:"fusspflege",      gruppe:"kosmetik", label:"Fuß- & Körperpflege",             leistungen:["Medizinische Fußpflege","Nagelpflege & Korrektur","Hornhautentfernung","Fußpeeling & Entspannungsbad","Gels & Lack","Beratung"],stil:"professional" },
  { value:"permanent_makeup",gruppe:"kosmetik", label:"Permanent Make-up & Wimpern",       leistungen:["Microblading","Permanent Make-up Lippen","Wimpernverlängerung","Wimpernlifting","Augenbrauen-Styling","Touch-up & Nachbehandlung"],stil:"modern" },
  { value:"sonstige_kosmetik",gruppe:"kosmetik",label:"Sonstige Kosmetik & Körperpflege", leistungen:[],stil:"modern" },
];
const BERUFSGRUPPEN=[
  {value:"handwerk",label:"Handwerk",icon:`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,desc:"Elektriker, Installateur, Tischler, Maler u.v.m."},
  {value:"kosmetik",label:"Kosmetik & Körperpflege",icon:`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/></svg>`,desc:"Kosmetik, Friseur, Massage, Nagelstudio u.v.m."},
];
const KOSMETIK_SET=new Set(["kosmetik","friseur","nagel","massage","tattoo","fusspflege","permanent_makeup","sonstige_kosmetik"]);
const getBrancheGruppe=b=>KOSMETIK_SET.has(b)?"kosmetik":"handwerk";
const GRUPPE_BADGE={handwerk:{icon:"\uD83D\uDD28",label:"Handwerk",c:"#92400e",bg:"#fef3c7"},kosmetik:{icon:"\u2728",label:"Kosmetik",c:"#831843",bg:"#fdf2f8"}};
const BUNDESLAENDER=[{value:"wien",label:"Wien"},{value:"noe",label:"Niederösterreich"},{value:"ooe",label:"Oberösterreich"},{value:"stmk",label:"Steiermark"},{value:"sbg",label:"Salzburg"},{value:"tirol",label:"Tirol"},{value:"ktn",label:"Kärnten"},{value:"vbg",label:"Vorarlberg"},{value:"bgld",label:"Burgenland"}];
const OEFFNUNGSZEITEN=[{value:"mo-fr-8-17",label:"Mo-Fr: 08:00-17:00"},{value:"mo-fr-7-16",label:"Mo-Fr: 07:00-16:00"},{value:"mo-fr-8-18",label:"Mo-Fr: 08:00-18:00"},{value:"mo-sa-8-17",label:"Mo-Sa: 08:00-17:00"},{value:"mo-sa-8-12",label:"Mo-Fr: 08:00-17:00, Sa: 08:00-12:00"},{value:"vereinbarung",label:"Nach Vereinbarung"},{value:"custom",label:"Eigene Zeiten eingeben"}];
const UNTERNEHMENSFORMEN=[{value:"eu",label:"Einzelunternehmen (e.U.)"},{value:"einzelunternehmen",label:"Einzelunternehmen (nicht eingetragen)"},{value:"gmbh",label:"GmbH"},{value:"og",label:"OG"},{value:"kg",label:"KG"},{value:"ag",label:"AG"},{value:"verein",label:"Verein"},{value:"gesnbr",label:"GesbR"}];
const STYLES_MAP={
  professional:{label:"Professionell & serioes",desc:"Klare Linien, gedämpfte Farben",primary:"#0f2b5b",accent:"#2563eb",accentSoft:"rgba(37,99,235,0.07)",bg:"#f8fafc",cardBg:"#fff",text:"#0f172a",textMuted:"#64748b",textLight:"#94a3b8",borderColor:"#e2e8f0",font:"'Inter',system-ui,sans-serif",radius:"6px",radiusLg:"10px",heroGradient:"linear-gradient(160deg,#0f2b5b 0%,#1e40af 50%,#2563eb 100%)",heroOverlay:"radial-gradient(circle at 70% 20%,rgba(255,255,255,0.08) 0%,transparent 60%)",shadow:"0 1px 3px rgba(15,43,91,0.06)",badgeBg:"#dbeafe",badgeText:"#1e40af"},
  modern:{label:"Modern & frisch",desc:"Helle Akzente, frische Farbpalette",primary:"#065f46",accent:"#10b981",accentSoft:"rgba(16,185,129,0.07)",bg:"#f0fdf4",cardBg:"#fff",text:"#052e16",textMuted:"#4b7c6a",textLight:"#86b5a1",borderColor:"#d1fae5",font:"'DM Sans',system-ui,sans-serif",radius:"12px",radiusLg:"16px",heroGradient:"linear-gradient(135deg,#065f46 0%,#047857 40%,#10b981 100%)",heroOverlay:"radial-gradient(ellipse at 80% 30%,rgba(255,255,255,0.12) 0%,transparent 50%)",shadow:"0 1px 3px rgba(6,95,70,0.06)",badgeBg:"#d1fae5",badgeText:"#065f46"},
  traditional:{label:"Bodenständig & vertraut",desc:"Warme Töne, solider Auftritt",primary:"#78350f",accent:"#d97706",accentSoft:"rgba(217,119,6,0.07)",bg:"#fffbeb",cardBg:"#fff",text:"#451a03",textMuted:"#92713a",textLight:"#b8a070",borderColor:"#fde68a",font:"'Source Serif 4',Georgia,serif",radius:"4px",radiusLg:"8px",heroGradient:"linear-gradient(160deg,#78350f 0%,#92400e 50%,#b45309 100%)",heroOverlay:"radial-gradient(circle at 30% 80%,rgba(255,255,255,0.06) 0%,transparent 50%)",shadow:"0 1px 3px rgba(120,53,15,0.06)",badgeBg:"#fef3c7",badgeText:"#92400e"},
};
const STEPS=[{id:"basics",title:"Grunddaten",num:"01"},{id:"services",title:"Leistungen",num:"02"},{id:"contact",title:"Kontakt",num:"03"},{id:"firma",title:"Unternehmen",num:"04"},{id:"style",title:"Design",num:"05"}];
const INIT={berufsgruppe:"",firmenname:"",branche:"",brancheLabel:"",brancheCustom:"",leistungen:[],extraLeistung:"",adresse:"",plz:"",ort:"",bundesland:"",telefon:"",email:"",uid:"",oeffnungszeiten:"",oeffnungszeitenCustom:"",einsatzgebiet:"",kurzbeschreibung:"",unternehmensform:"",firmenbuchnummer:"",gisazahl:"",firmenbuchgericht:"",geschaeftsfuehrer:"",vorstand:"",aufsichtsrat:"",zvr_zahl:"",vertretungsorgane:"",gesellschafter:"",unternehmensgegenstand:"",liquidation:"",kammer_berufsrecht:"",aufsichtsbehoerde:"",facebook:"",instagram:"",linkedin:"",tiktok:"",notdienst:false,meisterbetrieb:false,kostenvoranschlag:false,buchungslink:"",hausbesuche:false,terminvereinbarung:false,fotos:true,stil:"professional"};

/* ═══ TOKENS ═══ */
const T={bg:"#F5F5F2",bg2:"#EEEEE9",bg3:"#E0E0DB",white:"#ffffff",dark:"#111111",dark2:"#2B2F36",text:"#2B2F36",textSub:"#4A4F5A",textMuted:"#6B7280",accent:"#8FA3B8",accentLight:"rgba(143,163,184,0.1)",accentGlow:"rgba(143,163,184,0.15)",cta:"#111111",ctaLight:"rgba(17,17,17,0.06)",green:"#16a34a",greenLight:"#f0fdf4",greenGlow:"rgba(22,163,74,0.1)",red:"#dc2626",orange:"#ea580c",r:"12px",rSm:"8px",rLg:"16px",rXl:"20px",font:"'DM Sans',-apple-system,sans-serif",mono:"'JetBrains Mono',monospace",sh1:"0 1px 2px rgba(0,0,0,0.04)",sh2:"0 4px 24px rgba(0,0,0,0.06)",sh3:"0 16px 48px rgba(0,0,0,0.08)",sh4:"0 24px 80px rgba(0,0,0,0.12)"};

const css=`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400&family=JetBrains+Mono:wght@400;500&family=Inter:wght@400;500;600;700;800;900&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&display=swap');*{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}body{font-family:${T.font};color:${T.text};-webkit-font-smoothing:antialiased;background:${T.bg}}::selection{background:${T.dark};color:#fff}
@keyframes fadeUp{from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
@keyframes slideDown{from{opacity:0;transform:translateY(-12px)}to{opacity:1;transform:translateY(0)}}
@keyframes mockFade{0%{opacity:0;transform:scale(.97)}10%{opacity:1;transform:scale(1)}90%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(.97)}}
.sr-reveal{opacity:0;transform:translateY(32px);transition:opacity .6s cubic-bezier(.22,1,.36,1),transform .6s cubic-bezier(.22,1,.36,1)}.sr-reveal.sr-visible{opacity:1;transform:translateY(0)}
.lp-hamburger{display:none}
@media(max-width:960px){
  .lp-w{padding:0 28px!important}
  .lp-sec{padding:72px 0!important}
  .lp-hero-grid{grid-template-columns:1fr!important}
  .lp-hero-mock{display:none!important}
  .lp-hero-stats{flex-wrap:wrap}
  .lp-problem-grid{grid-template-columns:1fr!important;gap:48px!important}
  .lp-steps-line{display:none!important}
  .lp-steps-grid{grid-template-columns:repeat(2,1fr)!important;gap:32px!important}
  .lp-variants-grid{grid-template-columns:1fr!important}
  .lp-variants-grid>div{transform:none!important}
  .lp-pricing-grid{grid-template-columns:1fr!important;max-width:480px!important}
  .lp-why-grid{grid-template-columns:repeat(2,1fr)!important}
  .lp-compare{overflow-x:auto}
  .lp-nav-links{display:none!important}
  .lp-testi-grid{grid-template-columns:1fr!important}
  .lp-faq-grid{grid-template-columns:1fr!important}
  .lp-faq-sticky{position:static!important}
  .lp-cta-inner{grid-template-columns:1fr!important;text-align:center}
  .lp-cta-stats{flex-direction:row!important;justify-content:center!important;gap:32px!important}
  .lp-branchen-card{grid-template-columns:1fr!important}
  .lp-footer-cols{gap:32px!important}
  .lp-hamburger{display:flex!important;align-items:center;justify-content:center;width:44px;height:44px;border:none;background:transparent;cursor:pointer;border-radius:8px;padding:0;flex-shrink:0}
  .lp-mob-menu{display:block!important}
}
@media(max-width:560px){
  .lp-w{padding:0 16px!important}
  .lp-sec{padding:56px 0!important}
  .lp-steps-grid{grid-template-columns:1fr!important}
  .lp-why-grid{grid-template-columns:1fr!important}
  .lp-hero-btns{flex-direction:column!important}
  .lp-hero-btns a,.lp-hero-btns button{width:100%!important;text-align:center!important;justify-content:center!important}
  .lp-hero-stats{display:inline-flex!important;gap:8px!important}
  .lp-hero-stats>span{padding:6px 12px!important;font-size:.72rem!important}
  .lp-trust-bar{gap:16px!important}
  .lp-trust-bar>div{font-size:.78rem!important}
  .lp-pricing-grid{max-width:100%!important}
  .lp-pricing-grid>div{padding:28px 20px!important}
  .lp-footer-flex{flex-direction:column!important;gap:16px!important;text-align:center!important;align-items:center!important}
  .lp-footer-cols{flex-direction:column!important;gap:32px!important;text-align:center!important;align-items:center!important}
  .lp-footer-cols>div{gap:8px!important;align-items:center!important;display:flex!important;flex-direction:column!important}
  .lp-cta-section{padding:56px 0!important}
  .lp-cta-stats{flex-direction:column!important;gap:16px!important}
  .lp-cta-stats>div{justify-content:center!important}
  .lp-cta-inner h2{font-size:clamp(1.6rem,6vw,2.2rem)!important}
  .lp-compare table th:nth-child(n+4),.lp-compare table td:nth-child(n+4){display:none!important}
  .lp-compare table{font-size:.8rem!important}
  .lp-compare table th,.lp-compare table td{padding:10px 12px!important}
  .lp-compare{position:relative}
  .lp-branchen-card{grid-template-columns:1fr!important}
  footer{padding:48px 0 32px!important}
  .pt-topbar{padding:0 16px!important}
  .pt-email{display:none!important}
  .pt-sub-bar{padding-bottom:8px!important}
}
@media(max-width:960px){
  .sp-topbar{padding:0 20px!important}
  .sp-content{padding:24px 20px!important}
  .sp-header{flex-direction:column!important;align-items:flex-start!important;gap:14px!important}
  .sp-grid{grid-template-columns:1fr!important}
  .sp-page{height:auto!important;overflow:auto!important;min-height:100vh}
}
@media(max-width:560px){
  .sp-content{padding:16px!important}
  .sp-card{padding:20px 16px!important}
  .sp-name-grid{grid-template-columns:1fr!important}
  .sp-price-row{flex-direction:column!important;align-items:stretch!important}
  .sp-price-row button{width:100%!important}
}
@media(max-width:960px){
  .ad-wrap{flex-direction:column!important;height:auto!important;min-height:calc(100vh - 56px)!important}
  .ad-sidebar{width:100%!important;display:flex!important;flex-direction:row!important;flex-wrap:wrap!important;padding:6px 8px!important;border-right:none!important;border-bottom:1px solid #e8ebf0!important;gap:2px!important}
  .ad-sidebar button{flex:1;width:auto!important;text-align:center!important;padding:8px 10px!important}
  .ad-status-sec{display:none!important}
  .ad-main{padding:16px!important}
  .sp-incl-grid{grid-template-columns:1fr!important}
  .sp-name-grid{grid-template-columns:1fr!important}
}
@media(max-width:560px){
  .pt-info-row{grid-template-columns:1fr!important}
  .pt-field-grid{grid-template-columns:1fr!important}
  .pt-tab-nav{width:100%!important;overflow-x:auto!important}
  .pt-addr-grid{grid-template-columns:1fr!important}
  .pt-photo-grid{grid-template-columns:repeat(3,1fr)!important}
}`;

/* ═══ LANDING PAGE ═══ */
function LandingPage({onStart,onPortal}){
  const[scrolled,setScrolled]=useState(false);
  const[menuOpen,setMenuOpen]=useState(false);
  const[pricingYearly,setPricingYearly]=useState(true);
  const[mockIdx,setMockIdx]=useState(0);
  const[faqOpen,setFaqOpen]=useState({});
  const[hovCard,setHovCard]=useState(null);
  useEffect(()=>{const h=()=>{setScrolled(window.scrollY>30);if(window.scrollY>30)setMenuOpen(false)};window.addEventListener("scroll",h);return()=>window.removeEventListener("scroll",h)},[]);
  useEffect(()=>{const iv=setInterval(()=>setMockIdx(p=>(p+1)%3),4000);return()=>clearInterval(iv)},[]);
  useEffect(()=>{const els=document.querySelectorAll(".sr-reveal");const obs=new IntersectionObserver((entries)=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("sr-visible");obs.unobserve(e.target)}})},{threshold:.15});els.forEach(el=>obs.observe(el));return()=>obs.disconnect()},[]);
  const closeMenu=()=>setMenuOpen(false);
  const W=({children,s})=><div className="lp-w" style={{maxWidth:1200,margin:"0 auto",padding:"0 56px",...s}}>{children}</div>;
  const toggleFaq=(i)=>setFaqOpen(p=>({...p,[i]:!p[i]}));

  /* SVG Icons */
  const IconCheck=()=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.accent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
  const IconClock=()=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
  const IconMoney=()=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>;
  const IconWarning=()=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
  const IconPuzzle=()=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.235 1.233-.706 1.704l-1.611 1.611a.98.98 0 01-.837.276c-.47-.07-.802-.48-.968-.925a2.501 2.501 0 10-3.214 3.214c.446.166.855.497.925.968a.979.979 0 01-.276.837l-1.61 1.61a2.404 2.404 0 01-1.705.707 2.402 2.402 0 01-1.704-.706l-1.568-1.568a1.026 1.026 0 00-.877-.29c-.493.074-.84.504-1.02.968a2.5 2.5 0 11-3.237-3.237c.464-.18.894-.527.967-1.02a1.026 1.026 0 00-.289-.877l-1.568-1.568A2.402 2.402 0 011.998 12c0-.617.236-1.234.706-1.704L4.315 8.685a.98.98 0 01.837-.276c.47.07.802.48.968.925a2.501 2.501 0 103.214-3.214c-.446-.166-.855-.497-.925-.968a.979.979 0 01.276-.837l1.61-1.61a2.404 2.404 0 011.705-.707c.618 0 1.234.236 1.704.706l1.568 1.568c.23.23.556.338.877.29.493-.074.84-.504 1.02-.968a2.5 2.5 0 113.237 3.237c-.464.18-.894.527-.967 1.02z"/></svg>;
  const IconClipboard=()=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>;
  const IconEye=()=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
  const IconCreditCard=()=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>;
  const IconRocket=()=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>;
  const IconGear=()=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>;
  const IconLock=()=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>;
  const IconScale=()=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M16 3l5 5-5 5"/><path d="M21 8H9"/><path d="M8 21l-5-5 5-5"/><path d="M3 16h12"/></svg>;
  const IconSearch=()=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
  const IconShield=()=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
  const IconGlobe=()=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>;
  const IconChevron=({open})=><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{transition:"transform .25s",transform:open?"rotate(180deg)":"rotate(0deg)"}}><polyline points="6 9 12 15 18 9"/></svg>;
  const IconStar=()=><svg width="22" height="22" viewBox="0 0 24 24" fill="#C8952E" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>;
  const IconHammer=()=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 12l-8.5 8.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 010-3L12 9"/><path d="M17.64 15L22 10.64"/><path d="M20.91 11.7l-1.25-1.25c-.6-.6-.93-1.4-.93-2.25V6.5a.5.5 0 00-.5-.5H16.5c-.85 0-1.65-.33-2.25-.93l-1.25-1.25"/><path d="M13.09 2.01a3 3 0 012.12.88l3.9 3.9a3 3 0 01.88 2.12"/></svg>;
  const IconSparkles=()=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z"/></svg>;

  const MOCKUPS=[
    {url:"meier-elektrotechnik.siteready.at",name:"Meier Elektrotechnik",sub:"Elektroinstallationen",region:"Wien & Umgebung",badge:"24h Notdienst",grad:"linear-gradient(160deg,#111111 0%,#1a1e24 50%,#2B2F36 100%)",items:["Elektroinstallationen","Smart Home","Photovoltaik"]},
    {url:"beauty-by-lisa.siteready.at",name:"Beauty by Lisa",sub:"Kosmetikstudio",region:"Graz",badge:"Online buchen",grad:"linear-gradient(160deg,#3a3f48 0%,#4a5060 50%,#5a6070 100%)",items:["Gesichtsbehandlungen","Waxing","Anti-Aging"]},
    {url:"holzbau-gruber.siteready.at",name:"Holzbau Gruber",sub:"Zimmerei & Holzbau",region:"Salzburg",badge:"Meisterbetrieb",grad:"linear-gradient(160deg,#2B2F36 0%,#3a3f48 50%,#4a5060 100%)",items:["Dachstühle","Carports","Holzfassaden"]}
  ];
  const mock=MOCKUPS[mockIdx];

  return(<div style={{background:T.bg,color:T.text,overflowX:"hidden"}}><style>{css}</style>

  {/* NAV */}
  <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,background:scrolled?"rgba(245,245,242,.96)":"transparent",backdropFilter:scrolled?"blur(20px)":"none",WebkitBackdropFilter:scrolled?"blur(20px)":"none",borderBottom:scrolled?"1px solid rgba(0,0,0,.07)":"1px solid transparent",transition:"all .3s"}}>
    <div className="lp-w" style={{maxWidth:1200,margin:"0 auto",padding:"0 56px",display:"flex",alignItems:"center",justifyContent:"space-between",height:80}}>
      <img src="/logo.png" alt="SiteReady" style={{height:56,filter:scrolled?"none":"brightness(0) invert(1)",transition:"filter .3s"}}/>
      <div className="lp-nav-links" style={{display:"flex",gap:32,alignItems:"center"}}>
        {[["#problem","Problem"],["#how","So gehts"],["#preise","Preise"],["#vergleich","Vergleich"]].map(([h,l])=><a key={h} href={h} style={{fontSize:"1rem",fontWeight:500,color:scrolled?T.textSub:"rgba(255,255,255,.7)",textDecoration:"none",transition:"color .3s",textUnderlineOffset:"4px"}} onMouseEnter={e=>{e.target.style.color=scrolled?T.dark:"#fff";e.target.style.textDecoration="underline"}} onMouseLeave={e=>{e.target.style.color=scrolled?T.textSub:"rgba(255,255,255,.7)";e.target.style.textDecoration="none"}}>{l}</a>)}
        <button onClick={onPortal} style={{background:"transparent",color:scrolled?T.textSub:"rgba(255,255,255,.7)",padding:"10px 18px",borderRadius:8,fontWeight:600,fontSize:"1rem",border:"none",cursor:"pointer",fontFamily:T.font,minHeight:44,transition:"color .3s"}}>Kunden-Portal</button>
        <button onClick={onStart} style={{background:scrolled?T.dark:"#fff",color:scrolled?"#fff":T.dark,padding:"12px 26px",borderRadius:8,fontWeight:700,fontSize:"1rem",border:"none",cursor:"pointer",fontFamily:T.font,letterSpacing:"-.01em",minHeight:44,transition:"all .3s"}}>Jetzt starten</button>
      </div>
      <button className="lp-hamburger" onClick={()=>setMenuOpen(o=>!o)} aria-label="Menü" style={{color:scrolled?T.dark:"#fff"}}>
        {menuOpen
          ?<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          :<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>}
      </button>
    </div>
  </nav>
  {/* MOBILE MENU */}
  {menuOpen&&<div className="lp-mob-menu" style={{display:"none",position:"fixed",top:80,left:0,right:0,zIndex:99,background:"#fff",borderBottom:"1px solid rgba(0,0,0,.08)",boxShadow:"0 12px 40px rgba(0,0,0,.1)",animation:"slideDown .22s cubic-bezier(.16,1,.3,1)"}}>
    <div style={{padding:"16px 24px",display:"flex",flexDirection:"column",gap:2}}>
      {[["#problem","Problem"],["#how","So funktionierts"],["#preise","Preise"],["#vergleich","Vergleich"]].map(([h,l])=><a key={h} href={h} onClick={closeMenu} style={{fontSize:".95rem",fontWeight:500,color:T.dark,textDecoration:"none",padding:"12px 8px",borderBottom:"1px solid rgba(0,0,0,.05)",minHeight:44,display:"flex",alignItems:"center"}}>{l}</a>)}
      <div style={{display:"flex",flexDirection:"column",gap:8,marginTop:12}}>
        <button onClick={()=>{closeMenu();onPortal();}} style={{padding:"12px",borderRadius:8,fontWeight:600,fontSize:".92rem",border:`1.5px solid ${T.bg3}`,background:"#fff",color:T.dark,cursor:"pointer",fontFamily:T.font,minHeight:44}}>Kunden-Portal</button>
        <button onClick={()=>{closeMenu();onStart();}} style={{padding:"12px",borderRadius:8,fontWeight:700,fontSize:".92rem",border:"none",background:"#fff",color:T.dark,cursor:"pointer",fontFamily:T.font,minHeight:44}}>Jetzt starten</button>
      </div>
    </div>
  </div>}

  {/* HERO - Full-width dark */}
  <section style={{background:T.dark,paddingTop:80,minHeight:"100dvh",position:"relative",overflow:"hidden",display:"flex",flexDirection:"column"}}>
    <div style={{position:"absolute",top:"-20%",right:"-10%",width:700,height:700,borderRadius:"50%",background:"radial-gradient(circle,rgba(143,163,184,.12) 0%,transparent 65%)",pointerEvents:"none"}}/>
    <W s={{position:"relative",zIndex:1,width:"100%"}}>
      <div className="lp-hero-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:72,alignItems:"center",padding:"80px 0 0"}}>
        <div>
          <h1 style={{fontSize:"clamp(3.5rem,5.5vw,5.5rem)",fontWeight:800,lineHeight:.95,letterSpacing:"-.05em",color:"#fff",marginBottom:24}}>Deine Website.<br/>In Minuten.</h1>
          <p style={{fontSize:"1.1rem",color:"rgba(255,255,255,.55)",lineHeight:1.7,maxWidth:440,marginBottom:40}}>Impressum nach ECG, DSGVO und Google-Indexierung inklusive. Bestehende Website importieren oder in 10 Minuten ausfüllen. Fertig.</p>
          <div className="lp-hero-btns" style={{display:"flex",gap:12,marginBottom:28}}>
            <button onClick={onStart} style={{padding:"18px 40px",borderRadius:10,fontSize:"1.08rem",fontWeight:700,border:"none",cursor:"pointer",background:"#fff",color:T.dark,fontFamily:T.font,letterSpacing:"-.01em",minHeight:52,boxShadow:"0 4px 20px rgba(0,0,0,.15)"}}>Jetzt Website erstellen</button>
            <a href="#how" style={{padding:"16px 24px",borderRadius:8,fontSize:"1rem",fontWeight:600,textDecoration:"none",color:"rgba(255,255,255,.7)",border:"1.5px solid rgba(255,255,255,.15)",display:"inline-flex",alignItems:"center",minHeight:44}}>So funktionierts</a>
          </div>
          <div className="lp-hero-stats" style={{display:"inline-flex",gap:10,marginBottom:0}}>
            {[{v:"10 Min",l:"bis fertig"},{v:"ab 18\u20AC",l:"pro Monat"},{v:"120k+",l:"Zielgruppe"}].map((s,i)=><span key={i} style={{display:"inline-flex",alignItems:"center",gap:7,background:"rgba(255,255,255,.1)",border:"1px solid rgba(255,255,255,.12)",padding:"8px 18px",borderRadius:100,fontSize:".8rem",color:"rgba(255,255,255,.7)"}}><span style={{fontFamily:T.mono,fontWeight:700,color:"#fff"}}>{s.v}</span>{s.l}</span>)}
          </div>
        </div>
        <div className="lp-hero-mock" style={{position:"relative",marginBottom:-80}}>
          <div style={{background:"#fff",borderRadius:16,overflow:"hidden",boxShadow:"0 32px 72px rgba(0,0,0,.25)",border:"1px solid rgba(255,255,255,.1)"}}>
            <div style={{display:"flex",alignItems:"center",gap:6,padding:"12px 16px",background:"#f5f5f7",borderBottom:"1px solid rgba(0,0,0,.07)"}}>
              {["#ff5f57","#febc2e","#28c840"].map(c=><span key={c} style={{width:10,height:10,borderRadius:"50%",background:c}}/>)}
              <div style={{marginLeft:12,background:"#fff",borderRadius:6,padding:"5px 14px",fontSize:".75rem",fontFamily:T.mono,color:T.textMuted,flex:1,border:"1px solid rgba(0,0,0,.07)",transition:"all .3s"}}>{mock.url}</div>
              <div style={{background:T.greenLight,color:T.green,fontSize:".75rem",fontWeight:700,padding:"3px 10px",borderRadius:5,textTransform:"uppercase",letterSpacing:".06em"}}>Live</div>
            </div>
            <div style={{height:3,background:T.accent,transition:"all .6s"}}/>
            <div style={{background:mock.grad,padding:"36px 28px",color:"#fff",position:"relative",overflow:"hidden",transition:"background .6s"}}>
              <div style={{position:"absolute",inset:0,background:"radial-gradient(circle at 80% 20%,rgba(255,255,255,.08),transparent 60%)"}}/>
              <div style={{position:"relative",zIndex:1}}>
                <div style={{display:"inline-block",padding:"3px 10px",background:"rgba(255,255,255,.15)",borderRadius:20,fontSize:".75rem",fontWeight:600,letterSpacing:".04em",textTransform:"uppercase",marginBottom:10}}>{mock.badge}</div>
                <h2 style={{fontSize:"1.4rem",fontWeight:700,marginBottom:4}}>{mock.name}</h2>
                <p style={{opacity:.8,fontSize:".88rem"}}>{mock.sub} &middot; {mock.region}</p>
              </div>
            </div>
            <div style={{padding:"18px 24px",display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
              {mock.items.map((l,i)=><div key={i} style={{background:"#f7f8fa",borderRadius:8,padding:"12px",display:"flex",alignItems:"center",gap:8,border:"1px solid rgba(0,0,0,.05)"}}><div style={{width:22,height:22,borderRadius:6,background:T.accentLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:".75rem",color:T.accent,fontWeight:700,fontFamily:T.mono,flexShrink:0}}>{String(i+1).padStart(2,"0")}</div><span style={{fontSize:".76rem",fontWeight:500,color:T.text}}>{l}</span></div>)}
            </div>
          </div>
          <div style={{position:"absolute",padding:"10px 16px",background:"#fff",borderRadius:10,boxShadow:"0 8px 28px rgba(0,0,0,.12)",fontSize:".8rem",fontWeight:600,color:T.text,display:"flex",alignItems:"center",gap:8,animation:"float 5s ease-in-out 0s infinite",top:"-5%",right:"-7%",border:"1px solid rgba(0,0,0,.06)"}}><span style={{color:T.accent,display:"flex"}}><IconLock/></span>SSL aktiv</div>
          <div style={{position:"absolute",padding:"10px 16px",background:"#fff",borderRadius:10,boxShadow:"0 8px 28px rgba(0,0,0,.12)",fontSize:".8rem",fontWeight:600,color:T.text,display:"flex",alignItems:"center",gap:8,animation:"float 5s ease-in-out 2s infinite",bottom:"12%",right:"-7%",border:"1px solid rgba(0,0,0,.06)"}}><span style={{color:T.accent,display:"flex"}}><IconScale/></span>DSGVO + ECG</div>
          <div style={{display:"flex",justifyContent:"center",gap:6,marginTop:16}}>
            {[0,1,2].map(i=><div key={i} style={{width:mockIdx===i?24:8,height:8,borderRadius:4,background:mockIdx===i?T.accent:T.bg3,transition:"all .4s cubic-bezier(.22,1,.36,1)",cursor:"pointer"}} onClick={()=>setMockIdx(i)}/>)}
          </div>
        </div>
      </div>
    </W>
    {/* Trust Badges — inside Hero */}
    <div style={{marginTop:"auto",borderTop:"1px solid rgba(255,255,255,.06)",padding:"24px 0"}}>
      <W>
        <div className="lp-trust-bar" style={{display:"flex",justifyContent:"center",gap:36,flexWrap:"wrap",alignItems:"center"}}>
          {[{icon:<IconShield/>,text:"SSL verschlüsselt"},{icon:<IconScale/>,text:"DSGVO & ECG konform"},{icon:<IconSearch/>,text:"Google-optimiert"},{icon:<IconGlobe/>,text:"Österreich-spezifisch"}].map((t,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:8,color:"rgba(255,255,255,.45)",fontSize:".82rem",fontWeight:500}}><span style={{display:"flex",color:T.accent,opacity:.6}}>{React.cloneElement(t.icon,{width:"18",height:"18"})}</span>{t.text}</div>)}
        </div>
      </W>
    </div>
  </section>

  {/* PROBLEM + SOLUTION */}
  <section id="problem" className="lp-sec sr-reveal" style={{padding:"96px 0",background:"#fff",borderTop:`1px solid rgba(0,0,0,.04)`}}>
    <W>
      <div className="lp-problem-grid" style={{display:"grid",gridTemplateColumns:"5fr 7fr",gap:64,alignItems:"start"}}>
        <div>
          <div style={{fontSize:".75rem",fontWeight:700,color:T.accent,letterSpacing:".14em",textTransform:"uppercase",marginBottom:14}}>Das Problem</div>
          <h2 style={{fontSize:"clamp(2rem,3.5vw,2.8rem)",fontWeight:800,lineHeight:1.2,letterSpacing:"-.04em",color:T.dark,marginBottom:40,maxWidth:420}}>Handwerker wollen Kunden {"–"} nicht stundenlang Webdesign.</h2>
        <div style={{position:"relative",paddingLeft:32}}>
          <div style={{position:"absolute",left:11,top:8,bottom:8,width:2,background:T.bg3}}/>
          {[{n:"01",icon:<IconClock/>,t:"Keine Zeit",d:"Der Alltag auf der Baustelle lässt keinen Raum für Webdesign."},{n:"02",icon:<IconMoney/>,t:"Zu teuer",d:"Eine Agentur kostet 1.500-5.000 Euro einmalig."},{n:"03",icon:<IconPuzzle/>,t:"Zu kompliziert",d:"Baukasten-Tools verlangen eigene Texte und Design."},{n:"04",icon:<IconWarning/>,t:"Rechtlich riskant",d:"Fehlendes Impressum oder DSGVO kann teuer werden."}].map((c,i)=><div key={i} style={{display:"flex",alignItems:"flex-start",gap:16,marginBottom:i<3?32:0,position:"relative"}}>
            <div style={{position:"absolute",left:-32,top:4,width:24,height:24,borderRadius:"50%",background:"#fff",border:`1.5px solid ${T.bg3}`,display:"flex",alignItems:"center",justifyContent:"center",zIndex:1}}><span style={{fontFamily:T.mono,fontSize:".75rem",fontWeight:700,color:T.dark}}>{c.n}</span></div>
            <div><div style={{fontWeight:700,fontSize:".95rem",color:T.dark,marginBottom:4}}>{c.t}</div><div style={{fontSize:".84rem",color:T.textMuted,lineHeight:1.6}}>{c.d}</div></div>
          </div>)}
        </div>
        </div>
        <div style={{background:T.dark,borderRadius:16,padding:"48px 40px",color:"#fff",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:"-20%",right:"-10%",width:300,height:300,borderRadius:"50%",background:"radial-gradient(circle,rgba(143,163,184,.15) 0%,transparent 70%)",pointerEvents:"none"}}/>
          <div style={{position:"relative",zIndex:1}}>
            <div style={{display:"inline-block",background:T.accent,color:"#fff",fontSize:".75rem",fontWeight:700,padding:"5px 12px",borderRadius:6,marginBottom:20,letterSpacing:".04em"}}>Die Lösung</div>
            <h3 style={{fontSize:"2rem",fontWeight:800,marginBottom:12,letterSpacing:"-.04em"}}>SiteReady.at</h3>
            <p style={{fontSize:"1rem",color:"rgba(255,255,255,.6)",lineHeight:1.75,marginBottom:28}}>Kein Builder. Ein Service. Du beantwortest Fragen, wir liefern die fertige Website.</p>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:32}}>
              {["Website fertig in Minuten","Live-Vorschau vor Kauf","Impressum ECG-konform","DSGVO automatisch","SSL inklusive","Kein Branding","Website-Import","Self-Service-Portal","Eigene Domain möglich","Österreich-spezifisch"].map(l=><span key={l} style={{fontSize:".75rem",padding:"6px 13px",borderRadius:6,fontWeight:600,background:"rgba(255,255,255,.08)",color:T.accent,border:"1px solid rgba(255,255,255,.1)",display:"inline-flex",alignItems:"center",gap:4}}><IconCheck/>{l}</span>)}
            </div>
            <button onClick={onStart} style={{padding:"14px 28px",borderRadius:8,fontSize:".92rem",fontWeight:700,border:"none",cursor:"pointer",background:"#fff",color:T.dark,fontFamily:T.font,minHeight:44,boxShadow:"0 4px 20px rgba(0,0,0,.15)"}}>Jetzt testen</button>
          </div>
        </div>
      </div>
    </W>
  </section>

  {/* HOW IT WORKS - Timeline */}
  <section id="how" className="lp-sec sr-reveal" style={{padding:"96px 0",background:T.bg}}>
    <W>
      <div style={{marginBottom:64}}>
        <div style={{fontSize:".75rem",fontWeight:700,color:T.accent,letterSpacing:".14em",textTransform:"uppercase",marginBottom:14}}>So funktionierts</div>
        <h2 style={{fontSize:"clamp(2rem,3.5vw,2.8rem)",fontWeight:800,lineHeight:1.2,letterSpacing:"-.04em",color:T.dark}}>Fünf Schritte. Null Aufwand.</h2>
      </div>
      <div style={{position:"relative",paddingTop:24}}>
        <div className="lp-steps-line" style={{position:"absolute",top:44,left:"5%",right:"5%",height:2,background:T.accent,opacity:.3}}/>
        <div className="lp-steps-grid" style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:16,position:"relative"}}>
          {[{n:"01",icon:<IconClipboard/>,t:"Fragebogen",d:"Bestehende Website importieren oder 10 Fragen beantworten."},{n:"02",icon:<IconEye/>,t:"Live-Vorschau",d:"Website entsteht live im Browser – sichtbar vor der Bezahlung."},{n:"03",icon:<IconCreditCard/>,t:"Bezahlen",d:"Sicher per Karte, EPS oder PayPal. Danach läuft alles automatisch."},{n:"04",icon:<IconRocket/>,t:"Sofort live",d:"SSL aktiv. Website in Minuten erreichbar und für Google sichtbar."},{n:"05",icon:<IconGear/>,t:"Anpassen",d:"Im Self-Service-Portal: Logo, Fotos und Domain jederzeit ändern."}].map((s,i)=><div key={i} style={{textAlign:"center",background:"#fff",borderRadius:T.r,padding:"28px 16px 24px",border:"1px solid rgba(0,0,0,.06)",boxShadow:T.sh1,transition:"transform .25s,box-shadow .25s",cursor:"default"}} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow=T.sh2}} onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow=T.sh1}}>
            <div style={{width:56,height:56,borderRadius:"50%",background:i===4?"transparent":T.dark,border:i===4?`2px dashed ${T.textMuted}`:"none",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",color:i===4?T.textMuted:"#fff",position:"relative",zIndex:1}}>
              <span style={{fontFamily:T.mono,fontSize:".9rem",fontWeight:700}}>{s.n}</span>
            </div>
            <div style={{display:"flex",justifyContent:"center",marginBottom:12,color:i===4?T.textMuted:T.dark}}>{s.icon}</div>
            <h3 style={{fontSize:".95rem",fontWeight:700,color:i===4?T.textMuted:T.dark,marginBottom:8}}>{s.t}</h3>
            <p style={{fontSize:".82rem",color:T.textMuted,lineHeight:1.65}}>{s.d}</p>
          </div>)}
        </div>
      </div>
    </W>
  </section>

  {/* DESIGN VARIANTS */}
  <section className="lp-sec sr-reveal" style={{padding:"96px 0",background:"#fff",borderTop:"1px solid rgba(0,0,0,.04)"}}>
    <W>
      <div style={{marginBottom:52}}>
        <div style={{fontSize:".75rem",fontWeight:700,color:T.accent,letterSpacing:".14em",textTransform:"uppercase",marginBottom:14}}>Automatisches Design</div>
        <h2 style={{fontSize:"clamp(2rem,3.5vw,2.8rem)",fontWeight:800,lineHeight:1.2,letterSpacing:"-.04em",color:T.dark,marginBottom:16,maxWidth:500}}>Keine Designentscheidung. Nur ein Gefühl.</h2>
        <p style={{fontSize:"1.05rem",color:T.textSub,lineHeight:1.75,maxWidth:460}}>Wie soll Ihr Betrieb wirken? SiteReady wählt das passende Design automatisch.</p>
      </div>
      <div className="lp-variants-grid" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20,alignItems:"end"}}>
        {[{t:"Professionell & seriös",d:"Klare Linien, gedämpfte Farben, serifenlos",sub:"Elektriker, Installateure, Baumeister",lift:0,bg:T.dark,accent:"rgba(143,163,184,.3)"},{t:"Modern & frisch",d:"Helle Akzente, leichtes Layout, frische Palette",sub:"Maler, Fliesenleger, Gärtner",lift:-16,bg:"#1a1e24",accent:"rgba(143,163,184,.15)"},{t:"Bodenständig & vertraut",d:"Warme Töne, kräftige Schrift, solider Auftritt",sub:"Tischler, Zimmerer, Dachdecker",lift:0,bg:"#3a3d44",accent:"rgba(143,163,184,.25)"}].map((v,i)=>{const[vHov,setVHov]=React.useState(false);return <div key={i} onMouseEnter={()=>setVHov(true)} onMouseLeave={()=>setVHov(false)} style={{borderRadius:16,overflow:"hidden",background:"#fff",border:"1px solid rgba(0,0,0,.07)",transform:`translateY(${v.lift+(vHov?-3:0)}px)`,boxShadow:vHov?T.sh4:i===1?T.sh3:T.sh2,transition:"transform .3s,box-shadow .3s"}}>
          <div style={{background:v.bg,padding:i===1?"68px 32px":"60px 32px",color:"#fff",position:"relative",overflow:"hidden"}}><div style={{position:"absolute",inset:0,background:`radial-gradient(circle at 80% 20%,${v.accent},transparent 60%)`}}/><div style={{position:"relative"}}><div style={{fontSize:".75rem",fontWeight:600,color:T.accent,textTransform:"uppercase",letterSpacing:".1em",marginBottom:12}}>{v.sub}</div><h3 style={{fontSize:"1.25rem",fontWeight:800,marginBottom:8}}>{v.t}</h3><p style={{fontSize:".85rem",opacity:.6,lineHeight:1.6}}>{v.d}</p></div></div>
          <div style={{padding:"20px 32px"}}><div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:8,height:8,borderRadius:"50%",background:T.accent}}/><p style={{fontSize:".84rem",color:T.textSub,fontWeight:500}}>Automatisch zugewiesen</p></div></div>
        </div>})}
      </div>
    </W>
  </section>

  {/* BRANCHEN - Single card with two halves */}
  <section className="lp-sec sr-reveal" style={{padding:"96px 0 64px",background:T.bg}}>
    <W>
      <div style={{marginBottom:52}}>
        <div style={{fontSize:".75rem",fontWeight:700,color:T.accent,letterSpacing:".14em",textTransform:"uppercase",marginBottom:14}}>Branchen-Templates</div>
        <h2 style={{fontSize:"clamp(2rem,3.5vw,2.8rem)",fontWeight:800,lineHeight:1.2,letterSpacing:"-.04em",color:T.dark,marginBottom:16,maxWidth:520}}>Maßgeschneidert für Ihre Branche.</h2>
        <p style={{fontSize:"1.05rem",color:T.textSub,lineHeight:1.75,maxWidth:480}}>Jede Branche bekommt ein eigenes Design, vorbelegte Leistungen und passende Texte – vollautomatisch.</p>
      </div>
      <div className="lp-branchen-card" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
        <div onMouseEnter={()=>setHovCard("hw")} onMouseLeave={()=>setHovCard(null)} style={{borderRadius:16,overflow:"hidden",border:"1px solid rgba(0,0,0,.08)",boxShadow:hovCard==="hw"?T.sh4:T.sh2,background:"#fff",transition:"transform .3s,box-shadow .3s",transform:hovCard==="hw"?"translateY(-3px)":"none"}}>
          <div style={{background:T.dark,padding:"36px 32px",color:"#fff",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",inset:0,background:"radial-gradient(circle at 80% 20%,rgba(143,163,184,.12),transparent 60%)"}}/>
            <div style={{position:"relative",zIndex:1,display:"flex",alignItems:"center",gap:14}}>
              <div style={{width:44,height:44,borderRadius:12,background:"rgba(143,163,184,.15)",display:"flex",alignItems:"center",justifyContent:"center"}}><IconHammer/></div>
              <div><h3 style={{fontSize:"1.2rem",fontWeight:800,letterSpacing:"-.03em"}}>Handwerk</h3><p style={{color:T.accent,fontSize:".82rem",marginTop:3}}>Seriöses, professionelles Design</p></div>
            </div>
          </div>
          <div style={{padding:"24px 32px"}}>
            <div style={{fontSize:".75rem",fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:".1em",marginBottom:14}}>Verfügbare Branchen</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
              {["Elektriker","Installateur","Maler","Tischler","Fliesenleger","Schlosser","Dachdecker","Zimmerei","Maurer","Gärtner","Klima & Lüftung","Reinigung"].map(b=><span key={b} style={{fontSize:".75rem",padding:"5px 12px",borderRadius:8,fontWeight:500,background:T.bg,color:T.secondary,border:"1px solid rgba(0,0,0,.06)"}}>{b}</span>)}
            </div>
          </div>
        </div>
        <div onMouseEnter={()=>setHovCard("ko")} onMouseLeave={()=>setHovCard(null)} style={{borderRadius:16,overflow:"hidden",border:"1px solid rgba(0,0,0,.08)",boxShadow:hovCard==="ko"?T.sh4:T.sh2,background:"#fff",transition:"transform .3s,box-shadow .3s",transform:hovCard==="ko"?"translateY(-3px)":"none"}}>
          <div style={{background:"#4A5060",padding:"36px 32px",color:"#fff",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",inset:0,background:"radial-gradient(circle at 80% 20%,rgba(143,163,184,.12),transparent 60%)"}}/>
            <div style={{position:"relative",zIndex:1,display:"flex",alignItems:"center",gap:14}}>
              <div style={{width:44,height:44,borderRadius:12,background:"rgba(255,255,255,.12)",display:"flex",alignItems:"center",justifyContent:"center"}}><IconSparkles/></div>
              <div><h3 style={{fontSize:"1.2rem",fontWeight:800,letterSpacing:"-.03em"}}>Kosmetik & Körperpflege</h3><p style={{color:"rgba(255,255,255,.65)",fontSize:".82rem",marginTop:3}}>Modernes, elegantes Design</p></div>
            </div>
          </div>
          <div style={{padding:"24px 32px"}}>
            <div style={{fontSize:".75rem",fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:".1em",marginBottom:14}}>Verfügbare Branchen</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
              {["Kosmetikstudio","Friseursalon","Nagelstudio","Massage & Wellness","Tattoo & Piercing","Fußpflege","Permanent Make-up"].map(b=><span key={b} style={{fontSize:".76rem",padding:"5px 12px",borderRadius:8,fontWeight:500,background:T.bg,color:T.secondary,border:"1px solid rgba(0,0,0,.06)"}}>{b}</span>)}
            </div>
          </div>
        </div>
      </div>
      <div style={{marginTop:20,padding:"20px 28px",borderRadius:12,background:T.bg,border:"1px solid rgba(0,0,0,.06)",borderLeft:`3px solid ${T.accent}`,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:16}}>
        <div>
          <div style={{fontWeight:700,fontSize:".92rem",color:T.dark,marginBottom:2}}>Weitere Berufsgruppen in Planung</div>
          <div style={{fontSize:".82rem",color:T.textMuted}}>Gastronomie, Handel, Dienstleistungen und mehr kommen 2026.</div>
        </div>
        <button disabled style={{padding:"10px 20px",borderRadius:8,fontSize:".84rem",fontWeight:700,cursor:"not-allowed",fontFamily:T.font,background:T.dark,color:"#fff",border:"none",opacity:.85,whiteSpace:"nowrap",minHeight:44}}>Bald verfügbar</button>
      </div>
    </W>
  </section>

  {/* PRICING - 60/40 split */}
  <section id="preise" className="lp-sec sr-reveal" style={{padding:"96px 0",background:"#fff",borderTop:"1px solid rgba(0,0,0,.04)"}}>
    <W>
      <div style={{marginBottom:48}}>
        <div style={{fontSize:".75rem",fontWeight:700,color:T.accent,letterSpacing:".14em",textTransform:"uppercase",marginBottom:14}}>Preise</div>
        <h2 style={{fontSize:"clamp(2rem,3.5vw,2.8rem)",fontWeight:800,lineHeight:1.2,letterSpacing:"-.04em",color:T.dark,marginBottom:16}}>Ein Paket. Alles drin.</h2>
        <p style={{fontSize:"1.05rem",color:T.textSub,lineHeight:1.75,maxWidth:440}}>Kein Tarifwirrwarr. 7 Tage kostenlos testen.</p>
      </div>
      <div className="lp-pricing-grid" style={{display:"grid",gridTemplateColumns:"3fr 2fr",gap:24,maxWidth:900}}>
        {/* Standard */}
        <div onMouseEnter={()=>setHovCard("pr")} onMouseLeave={()=>setHovCard(null)} style={{background:"#fff",borderRadius:16,padding:"40px 32px",position:"relative",border:`2.5px solid ${T.dark}`,boxShadow:hovCard==="pr"?T.sh4:"0 8px 32px rgba(0,0,0,0.10)",transform:hovCard==="pr"?"translateY(-3px)":"none",transition:"transform .3s,box-shadow .3s"}}>
          <span style={{position:"absolute",top:-13,left:32,background:T.dark,color:"#fff",fontSize:".75rem",fontWeight:700,padding:"5px 16px",borderRadius:100,whiteSpace:"nowrap"}}>Aktuelles Angebot</span>
          <div style={{display:"flex",background:T.bg2,borderRadius:10,padding:4,marginBottom:28,maxWidth:280,position:"relative"}}>
            <div style={{position:"absolute",top:4,bottom:4,left:pricingYearly?"calc(50% + 2px)":"4px",width:"calc(50% - 6px)",background:"#fff",borderRadius:7,boxShadow:"0 2px 8px rgba(0,0,0,0.10)",transition:"left .25s cubic-bezier(.4,0,.2,1)",pointerEvents:"none"}}/>
            {[["monthly","Monatlich"],["yearly","Jährlich"]].map(([val,lbl])=>(
              <button key={val} onClick={()=>setPricingYearly(val==="yearly")} style={{flex:1,padding:"9px 0",border:"none",borderRadius:7,background:"transparent",fontFamily:T.font,fontWeight:700,fontSize:".82rem",color:pricingYearly===(val==="yearly")?T.dark:T.textMuted,cursor:"pointer",transition:"color .25s",position:"relative",zIndex:1,minHeight:44}}>
                {lbl}{val==="yearly"&&<span style={{marginLeft:6,fontSize:".75rem",fontWeight:700,color:T.accent,background:T.accentLight,padding:"2px 7px",borderRadius:4}}>-15%</span>}
              </button>
            ))}
          </div>
          <div style={{display:"flex",alignItems:"baseline",gap:4,marginBottom:4}}>
            <span style={{fontSize:"3.2rem",fontWeight:800,color:T.dark,fontFamily:T.mono,lineHeight:1,letterSpacing:"-.04em"}}>{pricingYearly?"\u20AC15.30":"\u20AC18"}</span>
            <span style={{fontSize:".9rem",color:T.textMuted,fontWeight:500}}>/Monat</span>
          </div>
          {pricingYearly
            ?<><div style={{fontSize:".78rem",color:T.textMuted,marginBottom:6}}>{"\u20AC"}183.60 / Jahr &middot; statt {"\u20AC"}216</div>
              <div style={{display:"inline-flex",alignItems:"center",background:T.accentLight,borderRadius:6,padding:"3px 10px",marginBottom:24}}><span style={{fontSize:".75rem",fontWeight:700,color:T.accent}}>Sie sparen {"\u20AC"}32.40 / Jahr</span></div></>
            :<div style={{fontSize:".78rem",color:T.textMuted,marginBottom:24}}>Monatlich kündbar &middot; keine Bindung</div>}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:28}}>
            {["7 Tage kostenlos testen","Subdomain sofort live","Kein Branding","Impressum (ECG) inklusive","DSGVO inklusive","SEO & Google-Indexierung","Logo & Fotos hochladen","Self-Service-Portal"].map(f=><div key={f} style={{display:"flex",alignItems:"center",gap:8,fontSize:".84rem",color:T.text}}><IconCheck/>{f}</div>)}
          </div>
          <button onClick={onStart} style={{width:"100%",padding:16,borderRadius:10,fontSize:"1rem",fontWeight:700,cursor:"pointer",fontFamily:T.font,border:"none",background:T.dark,color:"#fff",minHeight:48}}>Kostenlos testen</button>
        </div>
        {/* Premium Coming Soon */}
        <div style={{background:T.bg,borderRadius:16,padding:"40px 28px",position:"relative",border:`1.5px dashed ${T.bg3}`}}>
          <span style={{position:"absolute",top:-13,left:28,background:T.accent,color:"#fff",fontSize:".75rem",fontWeight:700,padding:"5px 16px",borderRadius:100,whiteSpace:"nowrap",letterSpacing:".04em"}}>Coming Soon</span>
          <div style={{fontSize:".95rem",fontWeight:700,color:T.dark,marginBottom:2}}>SiteReady Premium</div>
          <div style={{fontSize:".8rem",color:T.textMuted,marginBottom:20}}>Alles aus Standard + mehr</div>
          <div style={{fontSize:"2.8rem",fontWeight:800,color:T.textMuted,fontFamily:T.mono,lineHeight:1,letterSpacing:"-.04em",marginBottom:4,filter:"blur(6px)",userSelect:"none"}}>{"\u20AC"}?<span style={{fontSize:".95rem",fontWeight:500,fontFamily:T.font}}>/Mo</span></div>
          <div style={{fontSize:".78rem",color:T.textMuted,marginBottom:24}}>Kommt 2026 &middot; Jetzt vormerken</div>
          <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:28}}>
            {["Alle Features aus Standard","Mehrsprachige Website (DE/EN)","Social Media Paket","Kalender & Buchungssystem","Erweiterte Analytics"].map(f=><div key={f} style={{display:"flex",alignItems:"center",gap:10,fontSize:".84rem",color:T.textMuted}}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.accent} strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>{f}</div>)}
          </div>
          <button disabled style={{width:"100%",padding:14,borderRadius:8,fontSize:".9rem",fontWeight:700,cursor:"not-allowed",fontFamily:T.font,border:`1.5px solid ${T.bg3}`,background:T.bg,color:T.textMuted,opacity:.8,minHeight:44}}>Vormerken</button>
        </div>
      </div>
      <p style={{fontSize:".82rem",color:T.textMuted,maxWidth:500,margin:"24px 0 0",lineHeight:1.7}}>7 Tage kostenlos &middot; Karte wird erst nach 7 Tagen belastet &middot; Preise inkl. MwSt.</p>
    </W>
  </section>

  {/* COMPARISON */}
  <section id="vergleich" className="lp-sec sr-reveal" style={{padding:"96px 0",background:T.bg}}>
    <W>
      <div style={{marginBottom:48}}>
        <div style={{fontSize:".75rem",fontWeight:700,color:T.accent,letterSpacing:".14em",textTransform:"uppercase",marginBottom:14}}>Vergleich</div>
        <h2 style={{fontSize:"clamp(2rem,3.5vw,2.8rem)",fontWeight:800,lineHeight:1.2,letterSpacing:"-.04em",color:T.dark}}>SiteReady vs. der Rest.</h2>
      </div>
      <div className="lp-compare" style={{borderRadius:T.r,overflow:"hidden",background:"#fff",boxShadow:T.sh2}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:".85rem"}}><thead><tr>{["Feature","SiteReady.at","Webdesign Agentur","Wix","onepage.ai"].map((h,j)=><th key={h} style={{textAlign:"left",padding:"16px 22px",fontWeight:700,fontSize:".75rem",color:j===1?T.accent:T.textMuted,textTransform:"uppercase",letterSpacing:".1em",background:j===1?"rgba(143,163,184,.08)":"#fff",borderBottom:"1px solid rgba(0,0,0,.06)"}}>{h}</th>)}</tr></thead><tbody>{[["Zeit bis live","Minuten","4-8 Wochen","Stunden","Stunden"],["Texte & Content","KI erstellt","Briefing nötig","Selbst schreiben","Selbst schreiben"],["Impressum (ECG)","Automatisch","Extra buchbar","Nein","Nein"],["DSGVO-Text","Automatisch","Extra buchbar","Nein","Nein"],["Vorschau vor Kauf","Ja","Nein","Teilweise","Nein"],["Für Handwerker","Spezialisiert","Je nach Agentur","Nein","Nein"],["Preis","ab 18 Euro/Mo","1.500-5.000 Euro","ab 17 Euro/Mo","ab 19,90 Euro/Mo"]].map((row,i)=><tr key={i} style={{background:i%2===0?"transparent":"rgba(0,0,0,.015)"}}>{row.map((c,j)=><td key={j} style={{padding:"13px 22px",borderBottom:"1px solid rgba(0,0,0,.05)",color:j===0?T.dark:j===1?T.accent:T.textMuted,fontWeight:j<=1?600:400,background:j===1?"rgba(143,163,184,.04)":"transparent"}}>{j===1&&i<6?<span style={{display:"inline-flex",alignItems:"center",gap:6}}><IconCheck/>{c}</span>:c}</td>)}</tr>)}</tbody></table>
        <div style={{padding:"10px 22px",borderTop:"1px solid rgba(0,0,0,.05)",fontSize:".7rem",color:T.textMuted}}>Agentur: Einmalkosten, zzgl. optionalem Wartungsvertrag</div>
      </div>
    </W>
  </section>

  {/* TESTIMONIALS */}
  <section className="lp-sec sr-reveal" style={{padding:"96px 0",background:"#fff",borderTop:"1px solid rgba(0,0,0,.04)"}}>
    <W>
      <div style={{marginBottom:52}}>
        <div style={{fontSize:".75rem",fontWeight:700,color:T.accent,letterSpacing:".14em",textTransform:"uppercase",marginBottom:14}}>Kundenstimmen</div>
        <h2 style={{fontSize:"clamp(2rem,3.5vw,2.8rem)",fontWeight:800,lineHeight:1.2,letterSpacing:"-.04em",color:T.dark}}>Das sagen unsere Kunden.</h2>
      </div>
      <div className="lp-testi-grid" style={{display:"grid",gridTemplateColumns:"1.3fr 1fr",gap:24,alignItems:"start"}}>
        <div onMouseEnter={()=>setHovCard("t1")} onMouseLeave={()=>setHovCard(null)} style={{background:"#fff",borderRadius:16,padding:"40px 36px",border:`1px solid ${T.bg3}`,boxShadow:hovCard==="t1"?T.sh3:T.sh2,transform:hovCard==="t1"?"translateY(-3px)":"none",transition:"transform .3s,box-shadow .3s"}}>
          <div style={{display:"flex",gap:4,marginBottom:20}}>{[1,2,3,4,5].map(s=><IconStar key={s}/>)}</div>
          <p style={{fontSize:"1.15rem",fontWeight:500,color:T.dark,lineHeight:1.7,marginBottom:28}}>Ich hab die Website in der Mittagspause ausgefüllt. Am nächsten Tag hat ein Kunde gesagt, er hat mich über Google gefunden. Das war der beste Business-Invest seit Jahren.</p>
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            <div style={{width:48,height:48,borderRadius:"50%",background:"linear-gradient(135deg,#0f2b5b,#2563eb)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:".95rem"}}>TM</div>
            <div><div style={{fontWeight:700,fontSize:".92rem",color:T.dark}}>Thomas Meier</div><div style={{fontSize:".82rem",color:T.textMuted}}>Elektrotechnik, Wien</div></div>
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:24}}>
          <div onMouseEnter={()=>setHovCard("t2")} onMouseLeave={()=>setHovCard(null)} style={{background:"#fff",borderRadius:16,padding:"32px 32px",border:`1px solid ${T.bg3}`,boxShadow:hovCard==="t2"?T.sh2:T.sh1,transform:hovCard==="t2"?"translateY(-3px)":"none",transition:"transform .3s,box-shadow .3s"}}>
            <div style={{display:"flex",gap:4,marginBottom:14}}>{[1,2,3,4,5].map(s=><IconStar key={s}/>)}</div>
            <p style={{fontSize:".92rem",color:T.text,lineHeight:1.7,marginBottom:18}}>Endlich eine Lösung, die mitdenkt. Impressum, DSGVO – alles automatisch. Ich musste nichts selber schreiben.</p>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:36,height:36,borderRadius:"50%",background:"linear-gradient(135deg,#831843,#be185d)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:".78rem"}}>LK</div>
              <div><div style={{fontWeight:700,fontSize:".84rem",color:T.dark}}>Lisa Kogler</div><div style={{fontSize:".78rem",color:T.textMuted}}>Kosmetikstudio, Graz</div></div>
            </div>
          </div>
          <div onMouseEnter={()=>setHovCard("t3")} onMouseLeave={()=>setHovCard(null)} style={{background:"#fff",borderRadius:16,padding:"32px 32px",border:`1px solid ${T.bg3}`,boxShadow:hovCard==="t3"?T.sh2:T.sh1,transform:hovCard==="t3"?"translateY(-3px)":"none",transition:"transform .3s,box-shadow .3s"}}>
            <div style={{display:"flex",gap:4,marginBottom:14}}>{[1,2,3,4,5].map(s=><IconStar key={s}/>)}</div>
            <p style={{fontSize:".92rem",color:T.text,lineHeight:1.7,marginBottom:18}}>18 Euro im Monat statt 3.000 Euro an die Agentur. Und die Website sieht besser aus. Wahnsinn.</p>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:36,height:36,borderRadius:"50%",background:"linear-gradient(135deg,#78350f,#b45309)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:".78rem"}}>MG</div>
              <div><div style={{fontWeight:700,fontSize:".84rem",color:T.dark}}>Martin Gruber</div><div style={{fontSize:".78rem",color:T.textMuted}}>Zimmerei, Salzburg</div></div>
            </div>
          </div>
        </div>
      </div>
    </W>
  </section>

  {/* FAQ - Two column */}
  <section className="lp-sec sr-reveal" style={{padding:"96px 0",background:T.bg}}>
    <W>
      <div className="lp-faq-grid" style={{display:"grid",gridTemplateColumns:"1fr 1.5fr",gap:64,alignItems:"start"}}>
        <div className="lp-faq-sticky" style={{position:"sticky",top:100}}>
          <div style={{fontSize:".75rem",fontWeight:700,color:T.accent,letterSpacing:".14em",textTransform:"uppercase",marginBottom:14}}>FAQ</div>
          <h2 style={{fontSize:"clamp(2rem,3.5vw,2.8rem)",fontWeight:800,lineHeight:1.2,letterSpacing:"-.04em",color:T.dark,marginBottom:16}}>Häufige Fragen</h2>
          <p style={{fontSize:"1rem",color:T.textSub,lineHeight:1.7}}>Noch unsicher? Hier finden Sie Antworten auf die wichtigsten Fragen.</p>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:0}}>
          {[
            {q:"Wie lange dauert es, bis meine Website online ist?",a:"Nach dem Ausfüllen des Fragebogens (ca. 10 Minuten) ist Ihre Website sofort als Vorschau sichtbar. Nach der Bezahlung geht sie innerhalb von Minuten live."},
            {q:"Brauche ich technische Vorkenntnisse?",a:"Nein, überhaupt nicht. Sie beantworten einfache Fragen zu Ihrem Betrieb. SiteReady kümmert sich um Design, Texte, Impressum und alles Technische."},
            {q:"Was ist mit Impressum und DSGVO?",a:"Beides wird automatisch generiert – rechtlich konform nach österreichischem ECG und DSGVO. Sie müssen sich um nichts kümmern."},
            {q:"Kann ich meine Website später ändern?",a:"Ja. Im Self-Service-Portal können Sie Logo, Fotos, Texte und Kontaktdaten jederzeit selbst ändern."},
            {q:"Was kostet SiteReady?",a:"Ab 18 Euro pro Monat (oder 15,30 Euro bei Jahreszahlung). Die ersten 7 Tage sind kostenlos. Keine versteckten Kosten."},
            {q:"Kann ich eine eigene Domain verwenden?",a:"Ja. Sie erhalten eine kostenlose siteready.at-Subdomain und können jederzeit eine eigene Domain verbinden."},
            {q:"Was passiert, wenn ich kündige?",a:"Sie können monatlich kündigen. Nach der Kündigung wird Ihre Website am Ende des Abrechnungszeitraums offline genommen."}
          ].map((item,i)=><div key={i} style={{borderBottom:"1px solid rgba(0,0,0,.07)"}}>
            <button onClick={()=>toggleFaq(i)} style={{width:"100%",padding:"20px 0",display:"flex",justifyContent:"space-between",alignItems:"center",background:"none",border:"none",cursor:"pointer",fontFamily:T.font,textAlign:"left",minHeight:44,gap:16}}>
              <span style={{fontSize:".95rem",fontWeight:600,color:T.dark}}>{item.q}</span>
              <span style={{flexShrink:0,color:T.textMuted}}><IconChevron open={!!faqOpen[i]}/></span>
            </button>
            <div style={{maxHeight:faqOpen[i]?300:0,overflow:"hidden",transition:"max-height .3s cubic-bezier(.22,1,.36,1)"}}>
              <p style={{fontSize:".88rem",color:T.textMuted,lineHeight:1.7,paddingBottom:20}}>{item.a}</p>
            </div>
          </div>)}
        </div>
      </div>
    </W>
  </section>

  {/* CTA - Asymmetric dark */}
  <section className="lp-cta-section" style={{padding:"120px 0",position:"relative",overflow:"hidden",background:T.dark}}>
    <div style={{position:"absolute",top:"-40%",left:"15%",width:600,height:600,borderRadius:"50%",background:"radial-gradient(circle,rgba(143,163,184,.12) 0%,transparent 70%)",pointerEvents:"none"}}/>
    <W s={{position:"relative",zIndex:1}}>
      <div className="lp-cta-inner" style={{display:"grid",gridTemplateColumns:"1.4fr 1fr",gap:64,alignItems:"center"}}>
        <div>
          <h2 style={{fontSize:"clamp(2.2rem,4.5vw,3.4rem)",fontWeight:800,lineHeight:1.05,letterSpacing:"-.04em",color:"#fff",marginBottom:18}}>Bereit für deine Website?</h2>
          <p style={{fontSize:"1.05rem",color:"rgba(255,255,255,.5)",marginBottom:40,lineHeight:1.7}}>10 Minuten. Kein Aufwand. Fertig.</p>
          <button onClick={onStart} style={{background:"#fff",color:T.dark,padding:"20px 52px",borderRadius:10,fontSize:"1.1rem",fontWeight:800,border:"none",cursor:"pointer",fontFamily:T.font,letterSpacing:"-.01em",minHeight:56,boxShadow:"0 4px 20px rgba(0,0,0,.15)"}}>Jetzt starten</button>
        </div>
        <div className="lp-cta-stats" style={{display:"flex",flexDirection:"column",gap:24}}>
          {[{v:"10",s:" Min",l:"bis zur fertigen Website"},{v:"18",s:" \u20AC",l:"pro Monat, alles inklusive"},{v:"120",s:"k+",l:"Zielgruppe in Österreich"}].map((s,i)=><div key={i} style={{display:"flex",alignItems:"baseline",gap:8}}>
            <span style={{fontFamily:T.mono,fontSize:"2.4rem",fontWeight:800,color:"#fff",letterSpacing:"-.03em",lineHeight:1}}>{s.v}<span style={{color:T.accent}}>{s.s}</span></span>
            <span style={{fontSize:".85rem",color:"rgba(255,255,255,.4)"}}>{s.l}</span>
          </div>)}
        </div>
      </div>
    </W>
  </section>

  {/* FOOTER */}
  <footer style={{padding:"80px 0 48px",borderTop:`1px solid rgba(0,0,0,.06)`,background:T.bg}}>
    <W>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:48,flexWrap:"wrap",gap:32}}>
        <div style={{maxWidth:320}}>
          <img src="/logo.png" alt="SiteReady" style={{height:36,marginBottom:16}}/>
          <p style={{fontSize:".85rem",color:T.textMuted,lineHeight:1.7}}>Professionelle Websites für österreichische Kleinbetriebe. Impressum, DSGVO und SEO inklusive.</p>
        </div>
        <div className="lp-footer-cols" style={{display:"flex",gap:56}}>
          <div>
            <div style={{fontSize:".75rem",fontWeight:700,color:T.dark,textTransform:"uppercase",letterSpacing:".1em",marginBottom:14}}>Produkt</div>
            {["Fragebogen starten","Preise","Branchen","Kunden-Portal"].map(l=><a key={l} href="#" style={{display:"block",fontSize:".85rem",color:T.textMuted,textDecoration:"none",marginBottom:12,transition:"color .2s"}} onMouseEnter={e=>e.target.style.color=T.dark} onMouseLeave={e=>e.target.style.color=T.textMuted}>{l}</a>)}
          </div>
          <div>
            <div style={{fontSize:".75rem",fontWeight:700,color:T.dark,textTransform:"uppercase",letterSpacing:".1em",marginBottom:14}}>Rechtliches</div>
            {["Impressum","Datenschutz","AGB"].map(l=><a key={l} href="#" style={{display:"block",fontSize:".85rem",color:T.textMuted,textDecoration:"none",marginBottom:12,transition:"color .2s"}} onMouseEnter={e=>e.target.style.color=T.dark} onMouseLeave={e=>e.target.style.color=T.textMuted}>{l}</a>)}
          </div>
          <div>
            <div style={{fontSize:".75rem",fontWeight:700,color:T.dark,textTransform:"uppercase",letterSpacing:".1em",marginBottom:14}}>Kontakt</div>
            <a href="mailto:info@siteready.at" style={{display:"block",fontSize:".85rem",color:T.textMuted,textDecoration:"none",marginBottom:10}}>info@siteready.at</a>
            <span style={{fontSize:".85rem",color:T.textMuted}}>Wien, Österreich</span>
          </div>
        </div>
      </div>
      <div className="lp-footer-flex" style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:24,borderTop:`1px solid rgba(0,0,0,.06)`}}>
        <span style={{fontSize:".8rem",color:T.textMuted}}>&copy; 2026 SiteReady.at &middot; Wagner IT-Solutions e.U.</span>
        <span style={{fontSize:".8rem",color:T.textMuted}}>Made with care in Austria</span>
      </div>
    </W>
  </footer>
  </div>);
}

/* ═══ SUCCESS ═══ */
function SuccessPage({data,onBack}){
  const[saving,setSaving]=useState(false);
  const[saved,setSaved]=useState(false);
  const[saveErr,setSaveErr]=useState("");
  const[vorname,setVorname]=useState("");
  const[nachname,setNachname]=useState("");
  const[pw,setPw]=useState("");
  const[pw2,setPw2]=useState("");
  const[pwTouched,setPwTouched]=useState(false);
  const[pw2Touched,setPw2Touched]=useState(false);
  const[confirmed,setConfirmed]=useState(false);
  const[resending,setResending]=useState(false);
  const[resent,setResent]=useState(false);
  const[agbAccepted,setAgbAccepted]=useState(false);
  const pwErr=pwTouched&&pw.length>0&&pw.length<8?"Mindestens 8 Zeichen":"";
  const pw2Err=pw2Touched&&pw2&&pw!==pw2?"Passwoerter stimmen nicht ueberein":"";
  const regOk=vorname.trim().length>0&&nachname.trim().length>0&&pw.length>=8&&pw===pw2;
  const sub=data.firmenname?data.firmenname.toLowerCase().replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,""):"firmenname";
  const handleOrder=async()=>{
    if(!regOk){setSaveErr("Bitte alle Pflichtfelder ausfüllen.");return;}
    setSaving(true);setSaveErr("");
    if(!supabase){setSaveErr("Konfigurationsfehler – bitte Administrator kontaktieren.");setSaving(false);return;}
    // 0. Account erstellen
    const{data:authData,error:authErr}=await supabase.auth.signUp({email:data.email,password:pw,options:{data:{firmenname:data.firmenname,vorname,nachname}}});
    if(authErr&&authErr.message!=="User already registered"){setSaveErr("Registrierung: "+authErr.message);setSaving(false);return;}
    const userId=authData?.user?.id||null;
    // 1. Bestellung in Supabase speichern (UUID client-seitig generieren)
    const orderId=crypto.randomUUID();
    const{error}=await supabase.from("orders").insert({
      id:orderId,user_id:userId,vorname,nachname,
      firmenname:data.firmenname,branche:data.branche,branche_label:data.brancheLabel,berufsgruppe:data.berufsgruppe,
      kurzbeschreibung:data.kurzbeschreibung,bundesland:data.bundesland,
      leistungen:data.leistungen,extra_leistung:data.extraLeistung,notdienst:data.notdienst,meisterbetrieb:data.meisterbetrieb,kostenvoranschlag:data.kostenvoranschlag,buchungslink:data.buchungslink||null,hausbesuche:data.hausbesuche,terminvereinbarung:data.terminvereinbarung,
      adresse:data.adresse,plz:data.plz,ort:data.ort,telefon:data.telefon,email:data.email,
      uid_nummer:data.uid,oeffnungszeiten:data.oeffnungszeiten,einsatzgebiet:data.einsatzgebiet,
      unternehmensform:data.unternehmensform,firmenbuchnummer:data.firmenbuchnummer,gisazahl:data.gisazahl,firmenbuchgericht:data.firmenbuchgericht,
      geschaeftsfuehrer:data.geschaeftsfuehrer,vorstand:data.vorstand,aufsichtsrat:data.aufsichtsrat,
      zvr_zahl:data.zvr_zahl,vertretungsorgane:data.vertretungsorgane,gesellschafter:data.gesellschafter,
      unternehmensgegenstand:data.unternehmensgegenstand,liquidation:data.liquidation,
      kammer_berufsrecht:data.kammer_berufsrecht,aufsichtsbehoerde:data.aufsichtsbehoerde,
      stil:data.stil,fotos:data.fotos,subdomain:sub,status:"pending",
      facebook:data.facebook||null,instagram:data.instagram||null,linkedin:data.linkedin||null,tiktok:data.tiktok||null,
      website_ziel:null
    });
    if(error){setSaveErr("Fehler: "+error.message);setSaving(false);return;}
    // 2. Website-Generierung starten (mit Service-Key statt User-Token)
    try{
      await fetch("/api/start-build",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({order_id:orderId})
      });
    }catch(_){}
    setSaving(false);
    // 3. Bestaetigungsseite zeigen statt sofortigem Redirect
    localStorage.setItem("sr_pending_email",data.email);
    setConfirmed(true);
  };
  const resendEmail=async()=>{
    if(!supabase||resending)return;
    setResending(true);
    await supabase.auth.resend({type:"signup",email:data.email});
    setResending(false);setResent(true);
    setTimeout(()=>setResent(false),5000);
  };
  const included=[
    {t:"Subdomain sofort live",d:`${sub}.siteready.at – sofort erreichbar.`},
    {t:"Texte individuell formuliert",d:"Passend zu Ihrer Branche und Ihrem Betrieb."},
    {t:"Impressum (ECG) inklusive",d:"Anwaltlich geprüft und eingebaut."},
    {t:"DSGVO inklusive",d:"Anwaltlich geprüft und eingebaut."},
    {t:"SEO & Google-Indexierung",d:"Ihre Website ist für Google sichtbar sobald sie live geschaltet wird."},
    ...(data.fotos?[{t:"Branchenfotos als Platzhalter",d:"Passende Fotos für Ihre Branche bereits eingebaut."}]:[]),
  ];
  const portal=[
    {t:"Logo hochladen",d:"Wird oben in der Navigation angezeigt."},
    {t:"Bilder hochladen",d:"Eigene Fotos ersetzen die Platzhalter auf Ihrer Website."},
    {t:"Daten jederzeit anpassen",d:"Adresse, Telefon, Leistungen – änderbar wenn sich etwas ändert."},
    {t:"Custom Domain verbinden",d:"z.B. www.ihre-firma.at statt der Subdomain."},
  ];
  /* Bestaetigungsseite nach Account-Erstellung */
  if(confirmed)return(<div style={{minHeight:"100vh",background:T.bg,fontFamily:T.font,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",padding:"0 24px"}}><style>{css}</style>
    <div style={{maxWidth:480,width:"100%",textAlign:"center"}}>
      <div style={{width:72,height:72,borderRadius:"50%",background:T.greenLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"2rem",margin:"0 auto 24px",border:"2px solid rgba(22,163,74,.2)"}}>{"\u2713"}</div>
      <h1 style={{fontSize:"1.8rem",fontWeight:800,color:T.dark,margin:"0 0 8px",letterSpacing:"-.03em"}}>Account erstellt!</h1>
      <p style={{color:T.textSub,fontSize:".95rem",lineHeight:1.7,margin:"0 0 24px"}}>Wir haben eine Bestätigungs-E-Mail an <strong>{data.email}</strong> gesendet. Bitte bestätigen Sie Ihre E-Mail-Adresse, um sich einloggen zu können.</p>
      {/* Hinweis-Box */}
      <div style={{display:"flex",alignItems:"flex-start",gap:10,background:"#fefce8",border:"1px solid #fde68a",borderRadius:T.rSm,padding:"14px 16px",marginBottom:12,textAlign:"left"}}>
        <span style={{width:20,height:20,borderRadius:6,background:"#fde68a",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:".75rem",fontWeight:700,color:"#92400e",flexShrink:0}}>{"\u2709"}</span>
        <div style={{fontSize:".82rem",color:"#92400e",lineHeight:1.6}}>
          <strong>Prüfen Sie auch Ihren Spam-Ordner.</strong> Die E-Mail kann einige Minuten dauern. Falls nach 10 Minuten nichts ankommt, senden wir automatisch eine neue.
        </div>
      </div>
      {/* Website-Generierung Info */}
      <div style={{display:"flex",alignItems:"flex-start",gap:10,background:T.accentLight,border:`1px solid rgba(143,163,184,.15)`,borderRadius:T.rSm,padding:"14px 16px",marginBottom:24,textAlign:"left"}}>
        <span style={{width:20,height:20,borderRadius:6,background:T.accentLight,display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:".75rem",fontWeight:700,color:T.accent,flexShrink:0}}>{"\u2192"}</span>
        <div style={{fontSize:".82rem",color:T.accent,lineHeight:1.6}}>
          <strong>Ihre Website wird gerade erstellt</strong> und ist in wenigen Minuten unter <strong>{sub}.siteready.at</strong> erreichbar. Sie können den Fortschritt nach dem Login im Portal verfolgen.
        </div>
      </div>
      {/* Buttons */}
      <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:20}}>
        <button onClick={()=>{window.location.href="/portal";}} style={{padding:"14px 32px",border:"none",borderRadius:T.rSm,background:T.dark,color:"#fff",fontSize:".95rem",fontWeight:700,fontFamily:T.font,cursor:"pointer",boxShadow:"0 2px 16px rgba(0,0,0,.12)"}}>
          E-Mail bestätigt? Zum Portal &rarr;
        </button>
        <button onClick={resendEmail} disabled={resending} style={{padding:"10px 20px",border:`1.5px solid ${T.bg3}`,borderRadius:T.rSm,background:"#fff",color:T.textSub,fontSize:".82rem",fontWeight:600,fontFamily:T.font,cursor:resending?"wait":"pointer"}}>
          {resent?"Erneut gesendet!":resending?"Wird gesendet...":"Keine E-Mail erhalten? Erneut senden"}
        </button>
      </div>
      <div style={{fontSize:".75rem",color:T.textMuted,lineHeight:1.6}}>
        7 Tage kostenlos testen &middot; Keine Kreditkarte erforderlich
      </div>
    </div>
  </div>);

  return(<div className="sp-page" style={{minHeight:"100vh",background:T.bg,fontFamily:T.font,display:"flex",flexDirection:"column",overflow:"hidden"}}><style>{css}</style>
    {/* Top bar */}
    <div className="sp-topbar" style={{padding:"0 40px",borderBottom:`1px solid ${T.bg3}`,display:"flex",alignItems:"center",justifyContent:"space-between",height:72,flexShrink:0}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}><img src="/logo.png" alt="SiteReady" style={{height:36}}/></div>
      <button onClick={onBack} style={{padding:"8px 18px",border:`1.5px solid ${T.bg3}`,borderRadius:T.rSm,background:"transparent",color:T.text,cursor:"pointer",fontSize:".82rem",fontWeight:600,fontFamily:T.font}}>{"\u2190"} Zurück zur Vorschau</button>
    </div>
    {/* Content */}
    <div className="sp-content" style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",padding:"32px 40px",gap:24,maxWidth:1100,margin:"0 auto",width:"100%"}}>
      {/* Header */}
      <div className="sp-header" style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
        <div>
          <div style={{fontSize:".8rem",fontWeight:700,color:T.dark,marginBottom:8}}>Ihre Bestellung</div>
          <h1 style={{fontSize:"1.9rem",fontWeight:800,color:T.dark,margin:0,letterSpacing:"-.04em",lineHeight:1.05}}>Alles bereit – jetzt freischalten.</h1>
        </div>
        <div style={{display:"inline-flex",alignItems:"center",gap:10,background:T.bg,border:`1.5px solid rgba(22,163,74,.2)`,borderRadius:T.rSm,padding:"12px 20px",flexShrink:0}}>
          <div style={{width:7,height:7,borderRadius:"50%",background:T.green,boxShadow:"0 0 0 3px rgba(22,163,74,.15)"}}/>
          <span style={{fontSize:".9rem",fontWeight:700,color:T.dark,fontFamily:T.mono}}>{sub}.siteready.at</span>
          <span style={{fontSize:".75rem",fontWeight:700,color:T.green,background:T.greenLight,padding:"3px 8px",borderRadius:4,textTransform:"uppercase",letterSpacing:".06em"}}>Live</span>
        </div>
      </div>
      {/* 2 Karten */}
      <div className="sp-grid" style={{display:"grid",gridTemplateColumns:"3fr 2fr",gap:24}}>
        {/* Paket + Preis */}
        <div className="sp-card" style={{background:"#fff",borderRadius:T.r,padding:"28px 32px",border:`2px solid ${T.bg3}`,boxShadow:T.sh2}}>
          <div className="sp-price-row" style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",marginBottom:20,paddingBottom:20,borderBottom:`1px solid ${T.bg3}`,flexWrap:"wrap",gap:12}}>
            <div>
              <div style={{fontSize:".8rem",fontWeight:700,color:T.dark,marginBottom:10}}>7 Tage kostenlos testen</div>
              <div style={{display:"flex",alignItems:"baseline",gap:6}}>
                <span style={{fontSize:"2.6rem",fontWeight:800,color:T.dark,fontFamily:T.mono,letterSpacing:"-.04em",lineHeight:1}}>{"\u20AC"}0</span>
                <span style={{fontSize:".9rem",color:T.textMuted,fontWeight:500}}>heute</span>
              </div>
              <div style={{fontSize:".78rem",color:T.textMuted,marginTop:4}}>Ab {"\u20AC"}15.30/Monat (jährl.) oder {"\u20AC"}18/Monat (monatl.) &middot; Karte erst nach 7 Tagen belastet</div>
            </div>
            <label style={{display:"flex",alignItems:"flex-start",gap:10,cursor:"pointer",padding:"14px 16px",background:T.bg,borderRadius:T.rSm,border:`1px solid ${agbAccepted?T.accent+"44":T.bg3}`,marginBottom:16,marginTop:16}}>
              <input type="checkbox" checked={agbAccepted} onChange={e=>setAgbAccepted(e.target.checked)} style={{marginTop:2,accentColor:T.accent,width:18,height:18,flexShrink:0,cursor:"pointer"}}/>
              <span style={{fontSize:".82rem",color:T.textSub,lineHeight:1.6}}>Ich akzeptiere die <a href="#" onClick={e=>e.stopPropagation()} style={{color:T.accent,textDecoration:"underline"}}>AGB und Nutzungsbedingungen</a></span>
            </label>
            {saved
              ?<div style={{display:"flex",alignItems:"center",gap:8,padding:"12px 20px",background:T.greenLight,borderRadius:T.rSm,border:"1px solid rgba(22,163,74,.2)"}}>
                <span style={{color:T.green,fontWeight:700,fontSize:".88rem"}}>{"\u2713"} Weiterleitung...</span>
              </div>
              :<button onClick={handleOrder} disabled={saving||!regOk||!agbAccepted} style={{padding:"12px 24px",border:"none",borderRadius:T.rSm,background:saving?T.bg3:(!regOk||!agbAccepted)?"#cbd5e1":T.dark,color:"#fff",fontSize:".88rem",fontWeight:700,fontFamily:T.font,cursor:saving?"wait":(!regOk||!agbAccepted)?"not-allowed":"pointer",whiteSpace:"nowrap",transition:"background .2s"}}>
                {saving?"Website wird erstellt...":"Kostenlos starten \u2192"}
              </button>}
          </div>
          {/* Registrierung */}
          <div style={{marginBottom:20}}>
            <div style={{fontSize:".8rem",fontWeight:700,color:T.dark,marginBottom:12}}>Account erstellen</div>
            <div className="sp-name-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
              <div>
                <label style={{display:"block",marginBottom:5,fontSize:".8rem",fontWeight:700,color:T.textSub}}>Vorname <span style={{color:T.red}}>*</span></label>
                <input value={vorname} onChange={e=>setVorname(e.target.value)} placeholder="Alexander" style={{width:"100%",padding:"11px 14px",border:`1.5px solid ${T.bg3}`,borderRadius:T.rSm,fontSize:".875rem",fontFamily:T.font,background:"#fff",color:T.dark,outline:"none",boxSizing:"border-box",minHeight:44}}/>
              </div>
              <div>
                <label style={{display:"block",marginBottom:5,fontSize:".8rem",fontWeight:700,color:T.textSub}}>Nachname <span style={{color:T.red}}>*</span></label>
                <input value={nachname} onChange={e=>setNachname(e.target.value)} placeholder="Wagner" style={{width:"100%",padding:"11px 14px",border:`1.5px solid ${T.bg3}`,borderRadius:T.rSm,fontSize:".875rem",fontFamily:T.font,background:"#fff",color:T.dark,outline:"none",boxSizing:"border-box",minHeight:44}}/>
              </div>
            </div>
            <div style={{marginBottom:10}}>
              <label style={{display:"block",marginBottom:5,fontSize:".8rem",fontWeight:700,color:T.textSub}}>E-Mail</label>
              <div style={{padding:"11px 14px",border:`1.5px solid ${T.bg3}`,borderRadius:T.rSm,fontSize:".875rem",background:"#f8fafc",color:T.textMuted,fontFamily:T.font,minHeight:44,boxSizing:"border-box"}}>{data.email||"–"}</div>
            </div>
            <div style={{marginBottom:10}}>
              <label style={{display:"block",marginBottom:5,fontSize:".8rem",fontWeight:700,color:pwErr?T.red:T.textSub}}>Passwort{" "}<span style={{color:T.red}}>*</span></label>
              <input type="password" value={pw} onChange={e=>setPw(e.target.value)} onBlur={()=>setPwTouched(true)} placeholder="Mindestens 8 Zeichen" style={{width:"100%",padding:"11px 14px",border:`1.5px solid ${pwErr?T.red:T.bg3}`,borderRadius:T.rSm,fontSize:".875rem",fontFamily:T.font,background:"#fff",color:T.dark,outline:"none",boxSizing:"border-box",minHeight:44}}/>
              {pwErr&&<div style={{marginTop:4,fontSize:".75rem",color:T.red}}>{pwErr}</div>}
            </div>
            <div>
              <label style={{display:"block",marginBottom:5,fontSize:".8rem",fontWeight:700,color:pw2Err?T.red:T.textSub}}>Passwort bestätigen{" "}<span style={{color:T.red}}>*</span></label>
              <input type="password" value={pw2} onChange={e=>setPw2(e.target.value)} onBlur={()=>setPw2Touched(true)} placeholder="Passwort wiederholen" style={{width:"100%",padding:"11px 14px",border:`1.5px solid ${pw2Err?T.red:T.bg3}`,borderRadius:T.rSm,fontSize:".875rem",fontFamily:T.font,background:"#fff",color:T.dark,outline:"none",boxSizing:"border-box",minHeight:44}}/>
              {pw2Err&&<div style={{marginTop:4,fontSize:".75rem",color:T.red}}>{pw2Err}</div>}
            </div>
          </div>
          {saveErr&&<div style={{marginBottom:12,padding:"10px 14px",background:"#fef2f2",borderRadius:T.rSm,border:"1px solid #fecaca",fontSize:".78rem",color:"#dc2626"}}>{saveErr}</div>}
          <div className="sp-incl-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {included.map((s,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:T.bg,borderRadius:T.rSm,border:`1px solid ${T.bg3}`}}>
              <div style={{width:20,height:20,borderRadius:6,background:T.greenLight,color:T.green,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,flexShrink:0,border:"1px solid rgba(22,163,74,.15)"}}>{"\u2713"}</div>
              <span style={{fontWeight:600,fontSize:".82rem",color:T.dark}}>{s.t}</span>
            </div>)}
          </div>
          <div style={{marginTop:12,textAlign:"center",fontSize:".75rem",color:T.textMuted}}>Sichere Zahlung via Stripe &middot; Karte, EPS, PayPal</div>
        </div>
        {/* Portal */}
        <div className="sp-card" style={{background:T.bg,borderRadius:T.r,padding:"28px 32px",border:`1px solid ${T.bg3}`}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:20}}>
            <div style={{fontSize:".8rem",fontWeight:700,color:T.dark}}>Self-Service-Portal</div>
            <span style={{fontSize:".75rem",fontWeight:700,background:T.accentLight,color:T.accent,padding:"2px 8px",borderRadius:4,letterSpacing:".06em"}}>Nach Kauf</span>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {portal.map((s,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:"#fff",borderRadius:T.rSm,border:`1px solid ${T.bg3}`}}>
              <div style={{width:20,height:20,borderRadius:6,background:T.accentLight,color:T.accent,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,flexShrink:0,border:`1px solid rgba(143,163,184,.15)`}}>{"\u2192"}</div>
              <div style={{flex:1}}><span style={{fontWeight:600,fontSize:".82rem",color:T.dark}}>{s.t}</span><span style={{fontSize:".75rem",fontWeight:400,color:T.textMuted,marginLeft:6}}>optional</span></div>
            </div>)}
          </div>
        </div>
      </div>
    </div>
  </div>);
}

/* ═══ FORM COMPONENTS (unified light premium) ═══ */
function Field({label,value,onChange,placeholder,type="text",rows,hint,required}){const[f,setF]=useState(false);const[touched,setTouched]=useState(false);const err=required&&touched&&!value?.trim();const border=err?`2px solid ${T.red}`:f?`2px solid ${T.dark}`:`2px solid ${T.bg3}`;const shadow=err?`0 0 0 4px rgba(220,38,38,.1)`:f?`0 0 0 4px rgba(17,17,17,.06)`:"none";const base={width:"100%",padding:"12px 14px",border,borderRadius:T.rSm,fontSize:".875rem",fontFamily:T.font,background:T.white,color:T.dark,outline:"none",transition:"all .2s, border-color .2s",boxShadow:shadow,boxSizing:"border-box",minHeight:44};return(<div style={{marginBottom:20}}><label style={{display:"block",marginBottom:7,fontSize:".8rem",fontWeight:700,color:err?T.red:f?T.dark:T.textSub,transition:"color .2s",letterSpacing:".03em"}}>{label}{required&&<span style={{color:T.red,marginLeft:3}}>*</span>}</label>{rows?<textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={rows} onFocus={()=>setF(true)} onBlur={()=>{setF(false);setTouched(true);}} style={{...base,resize:"vertical",lineHeight:1.5}}/>:<input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} onFocus={()=>setF(true)} onBlur={()=>{setF(false);setTouched(true);}} style={base}/>}{err?<div style={{marginTop:4,fontSize:".75rem",color:T.red}}>Pflichtfeld</div>:hint&&<div style={{marginTop:5,fontSize:".75rem",color:T.textMuted}}>{hint}</div>}</div>)}

function Dropdown({label,value,onChange,options,placeholder,hint,required}){const[f,setF]=useState(false);const[touched,setTouched]=useState(false);const err=required&&touched&&!value;const border=err?`2px solid ${T.red}`:f?`2px solid ${T.dark}`:`2px solid ${T.bg3}`;const shadow=err?`0 0 0 4px rgba(220,38,38,.1)`:f?`0 0 0 4px rgba(17,17,17,.06)`:"none";return(<div style={{marginBottom:20}}><label style={{display:"block",marginBottom:7,fontSize:".8rem",fontWeight:700,color:err?T.red:f?T.dark:T.textSub,letterSpacing:".03em"}}>{label}{required&&<span style={{color:T.red,marginLeft:3}}>*</span>}</label><select value={value} onChange={e=>onChange(e.target.value)} onFocus={()=>setF(true)} onBlur={()=>{setF(false);setTouched(true);}} style={{width:"100%",padding:"12px 14px",border,borderRadius:T.rSm,fontSize:".875rem",fontFamily:T.font,background:T.white,color:value?T.dark:T.textMuted,outline:"none",transition:"all .2s, border-color .2s",boxShadow:shadow,boxSizing:"border-box",cursor:"pointer",appearance:"none",minHeight:44,backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M3 5l3 3 3-3' fill='none' stroke='%238b919e' stroke-width='1.5'/%3E%3C/svg%3E\")",backgroundRepeat:"no-repeat",backgroundPosition:"right 16px center"}}><option value="" disabled>{placeholder||"Bitte wählen"}</option>{options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}</select>{err?<div style={{marginTop:4,fontSize:".75rem",color:T.red}}>Pflichtfeld</div>:hint&&<div style={{marginTop:5,fontSize:".75rem",color:T.textMuted}}>{hint}</div>}</div>)}

function Checklist({label,options,selected,onChange,hint}){const toggle=i=>{if(selected.includes(i))onChange(selected.filter(s=>s!==i));else onChange([...selected,i])};return(<div style={{marginBottom:20}}><label style={{display:"block",marginBottom:8,fontSize:".78rem",fontWeight:700,color:T.textSub,letterSpacing:".03em"}}>{label}</label><div style={{display:"flex",flexWrap:"wrap",gap:8}}>{options.map(o=>{const on=selected.includes(o);return(<button key={o} onClick={()=>toggle(o)} style={{padding:"10px 16px",borderRadius:T.rSm,border:on?`2px solid ${T.accent}`:`2px solid ${T.bg3}`,background:on?T.accentLight:T.white,color:on?T.accent:T.text,fontSize:13,fontWeight:on?600:400,cursor:"pointer",transition:"all .15s",display:"flex",alignItems:"center",gap:7,fontFamily:T.font}}><span style={{width:18,height:18,borderRadius:5,border:on?"none":`2px solid ${T.bg3}`,background:on?T.accent:T.white,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"#fff",flexShrink:0}}>{on?"\u2713":""}</span>{o}</button>)})}</div>{hint&&<div style={{marginTop:6,fontSize:".75rem",color:T.textMuted}}>{hint}</div>}</div>)}

function Toggle({label,checked,onChange,desc}){return(<label style={{display:"flex",alignItems:"center",gap:14,cursor:"pointer",padding:"16px 18px",borderRadius:T.rSm,border:`2px solid ${checked?"rgba(143,163,184,.25)":T.bg3}`,background:checked?T.accentLight:T.white,transition:"all .2s",marginBottom:20}}><div style={{width:42,height:24,borderRadius:12,background:checked?T.accent:T.bg3,transition:"background .2s",position:"relative",flexShrink:0}}><div style={{width:20,height:20,borderRadius:"50%",background:"#fff",position:"absolute",top:2,left:checked?20:2,transition:"left .2s",boxShadow:"0 1px 4px rgba(0,0,0,.15)"}}/></div><input type="checkbox" checked={checked} onChange={e=>onChange(e.target.checked)} style={{display:"none"}}/><div><span style={{fontSize:".88rem",fontWeight:600,color:T.dark}}>{label}</span>{desc&&<div style={{fontSize:".75rem",color:T.textMuted,marginTop:2}}>{desc}</div>}</div></label>)}

function TagInput({label,value,onChange,placeholder,hint,max=12}){const[input,setInput]=useState("");const[f,setF]=useState(false);const tags=value?value.split("\n").filter(t=>t.trim()):[];const add=()=>{const v=input.trim();if(!v||tags.length>=max)return;onChange([...tags,v].join("\n"));setInput("");};const remove=i=>onChange(tags.filter((_,idx)=>idx!==i).join("\n"));const onKey=e=>{if(e.key==="Enter"){e.preventDefault();add();}};return(<div style={{marginBottom:20}}><label style={{display:"block",marginBottom:7,fontSize:".78rem",fontWeight:700,color:f?T.accent:T.textSub,letterSpacing:".03em"}}>{label}</label><div onFocus={()=>setF(true)} onBlur={()=>setF(false)} style={{border:f?`2px solid ${T.accent}`:`2px solid ${T.bg3}`,borderRadius:T.rSm,background:T.white,padding:"10px 12px",transition:"all .2s",boxShadow:f?`0 0 0 4px ${T.accentGlow}`:"none",minHeight:52}}>{tags.length>0&&<div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:8}}>{tags.map((t,i)=><span key={i} style={{display:"inline-flex",alignItems:"center",gap:5,padding:"4px 10px",background:T.accentLight,border:`1px solid rgba(143,163,184,.2)`,borderRadius:20,fontSize:"12px",fontWeight:600,color:T.accent}}>{t}<button onClick={()=>remove(i)} style={{display:"flex",alignItems:"center",justifyContent:"center",width:14,height:14,borderRadius:"50%",border:"none",background:"rgba(143,163,184,.2)",color:T.accent,cursor:"pointer",padding:0,fontSize:10,fontWeight:700,lineHeight:1}}>×</button></span>)}</div>}<input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={onKey} placeholder={tags.length===0?placeholder:"Weitere Leistung eingeben + Enter"} style={{border:"none",outline:"none",width:"100%",fontSize:14,fontFamily:T.font,color:T.dark,background:"transparent",padding:0}}/></div>{tags.length>=max&&<div style={{marginTop:4,fontSize:".75rem",color:T.textMuted}}>Maximum ({max}) erreicht</div>}{hint&&tags.length<max&&<div style={{marginTop:4,fontSize:".75rem",color:T.textMuted}}>{hint}</div>}</div>);}

function StylePicker({value,onChange}){return(<div style={{display:"flex",flexDirection:"column",gap:12}}>{Object.entries(STYLES_MAP).map(([key,s])=>{const on=value===key;return(<button key={key} onClick={()=>onChange(key)} style={{display:"flex",alignItems:"center",gap:16,padding:"18px 20px",border:on?`2px solid ${T.accent}`:`2px solid ${T.bg3}`,borderRadius:T.r,background:on?T.accentLight:T.white,cursor:"pointer",textAlign:"left",transition:"all .25s",fontFamily:T.font,boxShadow:on?`0 0 0 4px ${T.accentGlow}`:"none"}}><div style={{width:52,height:52,borderRadius:12,background:s.heroGradient,flexShrink:0}}/><div style={{flex:1}}><div style={{fontWeight:700,fontSize:".95rem",color:T.dark,marginBottom:3}}>{s.label}</div><div style={{fontSize:".8rem",color:T.textMuted}}>{s.desc}</div></div>{on&&<div style={{width:28,height:28,borderRadius:"50%",background:T.accent,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,flexShrink:0}}>{"\u2713"}</div>}</button>)})}</div>)}

/* ═══ PREVIEW (unchanged) ═══ */
function Preview({d,compact}){const s=STYLES_MAP[d.stil]||STYLES_MAP.professional;const extraItems=d.extraLeistung?d.extraLeistung.split("\n").filter(l=>l.trim()):[];const allItems=[...(d.leistungen||[]),...extraItems];const hasContact=d.adresse||d.telefon||d.email;const px=compact?"20px":"28px";const adressFull=[d.adresse,[d.plz,d.ort].filter(Boolean).join(" ")].filter(Boolean).join(", ");const zeit=d.oeffnungszeiten==="custom"?d.oeffnungszeitenCustom:(OEFFNUNGSZEITEN.find(o=>o.value===d.oeffnungszeiten)?.label||"");return(<div style={{fontFamily:s.font,background:s.bg,color:s.text,minHeight:"100%",fontSize:"14px",lineHeight:1.65,overflowY:"auto",transition:"background 0.4s"}}><div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:`10px ${px}`,background:s.cardBg,borderBottom:`1px solid ${s.borderColor}`,position:"sticky",top:0,zIndex:10}}><div style={{fontWeight:700,fontSize:compact?"13px":"15px",color:s.primary}}>{d.firmenname||"Firmenname"}</div><div style={{display:"flex",gap:compact?"12px":"20px",fontSize:"12px",color:s.textMuted}}><span>Leistungen</span><span>Über uns</span><span style={{padding:"4px 12px",borderRadius:"20px",background:s.primary,color:"#fff",fontWeight:600,fontSize:"10px"}}>Kontakt</span></div></div><div style={{background:s.heroGradient,position:"relative",overflow:"hidden",padding:compact?"32px 20px 28px":"48px 28px 44px",color:"#fff"}}><div style={{position:"absolute",inset:0,background:s.heroOverlay}}/><div style={{position:"relative",zIndex:1,display:"flex",gap:"20px",alignItems:"center"}}><div style={{flex:1}}><div style={{display:"flex",flexWrap:"wrap",gap:"6px",marginBottom:"12px"}}>{d.notdienst&&<div style={{display:"inline-block",padding:"3px 10px",background:"rgba(255,255,255,0.18)",borderRadius:"20px",fontSize:"10px",fontWeight:600,letterSpacing:"0.05em",textTransform:"uppercase"}}>⚡ 24h Notdienst</div>}{d.meisterbetrieb&&<div style={{display:"inline-block",padding:"3px 10px",background:"rgba(255,255,255,0.18)",borderRadius:"20px",fontSize:"10px",fontWeight:600,letterSpacing:"0.05em",textTransform:"uppercase"}}>🏆 Meisterbetrieb</div>}{d.kostenvoranschlag&&<div style={{display:"inline-block",padding:"3px 10px",background:"rgba(255,255,255,0.18)",borderRadius:"20px",fontSize:"10px",fontWeight:600,letterSpacing:"0.05em",textTransform:"uppercase"}}>✓ Kostenloser KV</div>}{d.hausbesuche&&<div style={{display:"inline-block",padding:"3px 10px",background:"rgba(255,255,255,0.18)",borderRadius:"20px",fontSize:"10px",fontWeight:600,letterSpacing:"0.05em",textTransform:"uppercase"}}>🏠 Hausbesuche</div>}{d.terminvereinbarung&&<div style={{display:"inline-block",padding:"3px 10px",background:"rgba(255,255,255,0.18)",borderRadius:"20px",fontSize:"10px",fontWeight:600,letterSpacing:"0.05em",textTransform:"uppercase"}}>📅 Nur mit Termin</div>}</div><h1 style={{fontSize:compact?"20px":"26px",fontWeight:700,margin:"0 0 8px",letterSpacing:"-0.025em",lineHeight:1.15}}>{d.firmenname||"Ihr Firmenname"}</h1><p style={{margin:"0 0 4px",opacity:0.85,fontSize:compact?"12px":"14px",fontWeight:500}}>{(d.branche==="sonstige"?d.brancheCustom:d.brancheLabel)||"Ihre Branche"}{d.einsatzgebiet?` \u00B7 ${d.einsatzgebiet}`:""}</p>{d.kurzbeschreibung&&<p style={{margin:"12px 0 0",opacity:0.75,fontSize:compact?"11px":"13px",lineHeight:1.55}}>{d.kurzbeschreibung}</p>}{d.telefon&&<div style={{marginTop:"16px",display:"inline-flex",alignItems:"center",gap:"8px",background:"rgba(255,255,255,0.15)",borderRadius:s.radius,padding:"8px 16px",fontSize:"13px",fontWeight:600}}>{"\uD83D\uDCDE"} {d.telefon}</div>}<div style={{marginTop:"14px",display:"inline-flex",gap:"8px",flexWrap:"wrap"}}><div style={{padding:"8px 18px",borderRadius:s.radius,background:"#fff",color:s.primary,fontSize:"12px",fontWeight:700,cursor:"pointer"}}>Jetzt kontaktieren</div><div style={{padding:"8px 18px",borderRadius:s.radius,background:"rgba(255,255,255,0.15)",color:"#fff",fontSize:"12px",fontWeight:600,border:"1px solid rgba(255,255,255,0.3)"}}>Leistungen</div>{d.buchungslink&&<div style={{padding:"8px 18px",borderRadius:s.radius,background:s.primary,color:"#fff",fontSize:"12px",fontWeight:700,cursor:"pointer",border:"1px solid rgba(255,255,255,0.3)"}}>Termin buchen</div>}</div></div>{}</div></div><div style={{padding:`24px ${px} 20px`}}><div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"14px"}}><h2 style={{fontSize:compact?"15px":"18px",fontWeight:700,color:s.primary,margin:0}}>Unsere Leistungen</h2><div style={{flex:1,height:"1px",background:s.borderColor}}/></div>{allItems.length>0?(<div style={{display:"grid",gridTemplateColumns:compact?"1fr":"1fr 1fr",gap:"8px"}}>{allItems.map((l,i)=>(<div key={i} style={{background:s.cardBg,border:`1px solid ${s.borderColor}`,borderRadius:s.radius,padding:"11px 13px",display:"flex",alignItems:"flex-start",gap:"10px",boxShadow:s.shadow,fontSize:"12px"}}><div style={{width:"20px",height:"20px",borderRadius:s.radius,background:s.accentSoft,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:"11px",color:s.accent,fontWeight:700}}>{String(i+1).padStart(2,"0")}</div><span style={{fontWeight:500}}>{l}</span></div>))}</div>):(<div style={{background:s.cardBg,border:`2px dashed ${s.borderColor}`,borderRadius:s.radiusLg,padding:"24px",textAlign:"center",color:s.textLight,fontSize:"12px"}}>Ihre Leistungen erscheinen hier</div>)}</div>{d.fotos&&<div style={{padding:`0 ${px} 12px`}}><div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"10px"}}><h2 style={{fontSize:compact?"13px":"16px",fontWeight:700,color:s.primary,margin:0}}>Ihre Fotos</h2><div style={{flex:1,height:"1px",background:s.borderColor}}/></div><div style={{display:"grid",gridTemplateColumns:compact?"1fr 1fr":"repeat(5,1fr)",gap:"6px"}}>{[1,2,3,4,5].map(i=><div key={i} style={{aspectRatio:"1",background:`linear-gradient(135deg,${s.accentSoft},${s.borderColor})`,borderRadius:s.radius,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:3,border:`1px dashed ${s.borderColor}`}}><span style={{fontSize:compact?"1rem":"1.1rem"}}>📷</span><span style={{fontSize:"11px",color:s.textLight,fontWeight:600,textTransform:"uppercase",letterSpacing:".05em"}}>Foto {i}</span></div>)}</div></div>}<div style={{padding:`0 ${px} 24px`}}><div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"14px"}}><h2 style={{fontSize:compact?"15px":"18px",fontWeight:700,color:s.primary,margin:0}}>Über uns</h2><div style={{flex:1,height:"1px",background:s.borderColor}}/></div><div style={{background:s.cardBg,borderRadius:s.radiusLg,padding:"18px 20px",boxShadow:s.shadow,borderLeft:`3px solid ${s.accent}`}}><p style={{margin:0,color:s.textMuted,fontSize:"12px",lineHeight:1.7}}>{d.firmenname?`Dieser Text wird individuell für ${d.firmenname} generiert.`:"Hier entsteht Ihr individueller Text."}</p><div style={{marginTop:"10px",display:"inline-block",padding:"3px 9px",borderRadius:"20px",background:s.badgeBg,color:s.badgeText,fontSize:"11px",fontWeight:600}}>Wird nach Bestellung generiert</div></div></div>{hasContact&&(<div style={{margin:`0 ${px} 24px`,padding:"20px",background:s.cardBg,borderRadius:s.radiusLg,boxShadow:s.shadow,border:`1px solid ${s.borderColor}`}}><h2 style={{fontSize:compact?"15px":"18px",fontWeight:700,color:s.primary,margin:"0 0 14px"}}>Kontakt</h2><div style={{display:"grid",gridTemplateColumns:compact?"1fr":"1fr 1fr",gap:"8px"}}>{[{icon:"\uD83D\uDCCD",label:"Adresse",value:adressFull},{icon:"\uD83D\uDCDE",label:"Telefon",value:d.telefon},{icon:"\u2709\uFE0F",label:"E-Mail",value:d.email},{icon:"\uD83D\uDD50",label:"Öffnungszeiten",value:zeit}].filter(x=>x.value).map((x,i)=>(<div key={i} style={{padding:"10px 12px",borderRadius:s.radius,background:s.accentSoft,fontSize:"11px"}}><div style={{fontSize:"11px",color:s.textMuted,textTransform:"uppercase",letterSpacing:"0.05em",fontWeight:600,marginBottom:"3px"}}>{x.icon} {x.label}</div><div style={{fontWeight:500,whiteSpace:"pre-line",lineHeight:1.5}}>{x.value}</div></div>))}</div></div>)}<div style={{background:s.primary,color:"#fff",padding:`20px ${px}`,fontSize:"12px"}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:"12px"}}><div><div style={{fontWeight:700,fontSize:"13px",marginBottom:"3px"}}>{d.firmenname||"Firmenname"}</div><div style={{opacity:0.7}}>{adressFull}</div></div><div style={{textAlign:"right",opacity:0.7}}>{d.telefon&&<div>{d.telefon}</div>}{d.email&&<div>{d.email}</div>}</div></div><div style={{borderTop:"1px solid rgba(255,255,255,0.15)",paddingTop:"10px",opacity:0.6,fontSize:"11px"}}>{(d.unternehmensform||d.firmenbuchnummer||d.uid)&&<div style={{marginBottom:5,lineHeight:1.6,opacity:.8}}>{d.unternehmensform&&<span>{d.unternehmensform} &nbsp;</span>}{d.uid&&<span>UID: {d.uid} &nbsp;</span>}{d.firmenbuchnummer&&<span>FN: {d.firmenbuchnummer} &nbsp;</span>}{d.firmenbuchgericht&&<span>{d.firmenbuchgericht} &nbsp;</span>}{d.gisazahl&&<span>GISA: {d.gisazahl}</span>}</div>}<div style={{display:"flex",justifyContent:"space-between"}}><span>Impressum | Datenschutz</span><span>SiteReady.at</span></div></div></div></div>)}

/* ═══ QUESTIONNAIRE (unified light premium) ═══ */
function Questionnaire({data,setData,onComplete,onBack}){
  const[step,setStep]=useState(0);const ref=useRef(null);const[isMobile]=useState(typeof window!=="undefined"&&window.innerWidth<768);const[showPreview,setShowPreview]=useState(false);const[showImport,setShowImport]=useState(true);const[showBerufsgruppe,setShowBerufsgruppe]=useState(false);const[importUrl,setImportUrl]=useState("");const[importLoading,setImportLoading]=useState(false);const[importErr,setImportErr]=useState("");const[importConfirm,setImportConfirm]=useState(false);const[impressumConfirm,setImpressumConfirm]=useState(false);const doImport=async()=>{if(!importUrl.trim())return;setImportLoading(true);setImportErr("");try{const r=await fetch("/api/import-website",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({url:importUrl})});const j=await r.json();if(j.error){setImportErr(j.error);setImportLoading(false);return;}const b=j.branche?BRANCHEN.find(x=>x.value===j.branche):null;const allLeistungen=Array.isArray(j.leistungen)?j.leistungen:[];setData(d=>({...d,firmenname:j.firmenname||d.firmenname,telefon:j.telefon||d.telefon,email:j.email||d.email,plz:j.plz||d.plz,ort:j.ort||d.ort,adresse:j.adresse||d.adresse,kurzbeschreibung:j.kurzbeschreibung||d.kurzbeschreibung,bundesland:j.bundesland||d.bundesland,unternehmensform:j.unternehmensform||d.unternehmensform,uid:j.uid||d.uid,firmenbuchnummer:j.firmenbuchnummer||d.firmenbuchnummer,gisazahl:j.gisazahl||d.gisazahl,firmenbuchgericht:j.firmenbuchgericht||d.firmenbuchgericht,facebook:j.facebook||d.facebook,instagram:j.instagram||d.instagram,linkedin:j.linkedin||d.linkedin,tiktok:j.tiktok||d.tiktok,...(b?{berufsgruppe:b.gruppe,branche:b.value,brancheLabel:b.label,stil:b.stil,leistungen:allLeistungen.length>0?allLeistungen:d.leistungen,extraLeistung:""}:{leistungen:allLeistungen.length>0?allLeistungen:d.leistungen})}));setImportLoading(false);setShowImport(false);setShowBerufsgruppe(true);}catch(e){setImportErr("Verbindungsfehler: "+e.message);setImportLoading(false);}};
const up=useCallback(k=>v=>setData(d=>({...d,[k]:v})),[setData]);const go=n=>{setStep(n);if(ref.current)ref.current.scrollTop=0;if(isMobile&&n===STEPS.length-1)setShowPreview(true);};const pct=((step+1)/STEPS.length)*100;const selectedBranche=BRANCHEN.find(b=>b.value===data.branche);const brancheLeistungen=selectedBranche?selectedBranche.leistungen:[];const onBrancheChange=val=>{const b=BRANCHEN.find(x=>x.value===val);setData(d=>({...d,branche:val,brancheLabel:b?b.label:"",brancheCustom:"",stil:b?b.stil:d.stil,leistungen:[],extraLeistung:""}))};const onBerufsgruppChange=val=>{setData(d=>({...d,berufsgruppe:val,branche:"",brancheLabel:"",brancheCustom:"",leistungen:[],extraLeistung:""}));};
  const filteredBranchen=data.berufsgruppe?BRANCHEN.filter(b=>b.gruppe===data.berufsgruppe):BRANCHEN;
  const legalOk=(()=>{const uf=data.unternehmensform;if(!uf)return false;const needsFB=["eu","gmbh","og","kg","ag"].includes(uf);if(needsFB&&(!data.firmenbuchnummer?.trim()||!data.firmenbuchgericht?.trim()))return false;if(uf==="gmbh"&&!data.geschaeftsfuehrer?.trim())return false;if(uf==="ag"&&!data.vorstand?.trim())return false;if(uf==="verein"&&!data.zvr_zahl?.trim())return false;return true;})();
  const stepValid=[!!(data.firmenname?.trim()&&data.branche&&data.bundesland),!!(data.leistungen?.length>0||data.extraLeistung?.trim()),!!(data.adresse?.trim()&&data.plz?.trim()&&data.ort?.trim()&&data.telefon?.trim()&&data.email?.trim()&&data.oeffnungszeiten),legalOk&&impressumConfirm,true];
  const pages=[<>
    <Field label="Firmenname" value={data.firmenname} onChange={up("firmenname")} placeholder="z.B. Elektro Müller GmbH" required/>
    <Dropdown label="Branche" value={data.branche} onChange={onBrancheChange} options={filteredBranchen} placeholder="Branche wählen" hint="Leistungen und Stil werden vorgeschlagen" required/>
    {(data.branche==="sonstige"||data.branche==="sonstige_kosmetik")&&<Field label="Ihre Branche" value={data.brancheCustom} onChange={up("brancheCustom")} placeholder={data.berufsgruppe==="kosmetik"?"z.B. Beautysalon, Spa, ...":"z.B. Spenglerei, Stuckateur, ..."}/>}
    <Field label="Kurzbeschreibung" value={data.kurzbeschreibung} onChange={up("kurzbeschreibung")} placeholder="Seit 15 Jahren Ihr zuverlässiger Partner." rows={2} hint="Optional"/>
    <Dropdown label="Bundesland" value={data.bundesland} onChange={v=>{up("bundesland")(v);const bl=BUNDESLAENDER.find(b=>b.value===v);up("einsatzgebiet")(bl?bl.label:"")}} options={BUNDESLAENDER} placeholder="Bundesland wählen" required/>
  </>,<>{brancheLeistungen.length>0?(<Checklist label="Leistungen auswählen" options={[...new Set([...brancheLeistungen,...(data.leistungen||[])])]} selected={data.leistungen} onChange={up("leistungen")} hint="Wählen Sie Ihre Leistungen"/>):(<TagInput label="Ihre Leistungen" value={data.extraLeistung} onChange={up("extraLeistung")} placeholder="Leistung eingeben + Enter" hint="Leistung eingeben und Enter drücken – max. 12"/>)}{brancheLeistungen.length>0&&<TagInput label="Zusätzliche Leistungen (optional)" value={data.extraLeistung} onChange={up("extraLeistung")} placeholder="z.B. Beratung, Planung, ..." hint="Leistung eingeben und Enter drücken"/>}{data.berufsgruppe==="handwerk"&&<><Toggle label="24h Notdienst" checked={data.notdienst} onChange={up("notdienst")} desc="Wird prominent angezeigt"/><Toggle label="Meisterbetrieb" checked={data.meisterbetrieb} onChange={up("meisterbetrieb")} desc="Zeigt ein Meisterbetrieb-Badge auf Ihrer Website"/><Toggle label="Kostenloser Kostenvoranschlag" checked={data.kostenvoranschlag} onChange={up("kostenvoranschlag")} desc="Wird als Vertrauens-Badge angezeigt"/></>}
{data.berufsgruppe==="kosmetik"&&<><Field label="Online-Buchungslink" value={data.buchungslink} onChange={up("buchungslink")} placeholder="z.B. https://booksy.com/..." hint="Calendly, Booksy, Treatwell – optional"/><Toggle label="Hausbesuche" checked={data.hausbesuche} onChange={up("hausbesuche")} desc="Ich komme auch zu Ihnen nach Hause"/><Toggle label="Nur nach Terminvereinbarung" checked={data.terminvereinbarung} onChange={up("terminvereinbarung")} desc="Kein Walk-in – nur mit Termin"/></>}</>,<><Field label="Straße & Hausnummer" value={data.adresse} onChange={up("adresse")} placeholder="Mariahilfer Straße 45/3" required/><div style={{display:"grid",gridTemplateColumns:"120px 1fr",gap:12}}><Field label="PLZ" value={data.plz} onChange={up("plz")} placeholder="1060" required/><Field label="Ort" value={data.ort} onChange={up("ort")} placeholder="Wien" required/></div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}><Field label="Telefon" value={data.telefon} onChange={up("telefon")} placeholder="+43 1 234 56 78" required/><Field label="E-Mail" value={data.email} onChange={up("email")} placeholder="office@firma.at" type="email" required/></div><Dropdown label="Öffnungszeiten" value={data.oeffnungszeiten} onChange={up("oeffnungszeiten")} options={OEFFNUNGSZEITEN} placeholder="Öffnungszeiten wählen" required/>{data.oeffnungszeiten==="custom"&&<Field label="Ihre Öffnungszeiten" value={data.oeffnungszeitenCustom} onChange={up("oeffnungszeitenCustom")} placeholder={"Mo-Fr: 08:00-17:00\nSa: nach Vereinbarung"} rows={2}/>}<div style={{marginTop:8,paddingTop:16,borderTop:`1px solid ${T.bg3}`}}><div style={{fontSize:".78rem",fontWeight:700,color:T.textSub,textTransform:"uppercase",letterSpacing:".06em",marginBottom:12}}>Social Media <span style={{fontWeight:400,opacity:.6}}>(optional)</span></div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}><Field label="Facebook" value={data.facebook} onChange={up("facebook")} placeholder="facebook.com/ihrefirma"/><Field label="Instagram" value={data.instagram} onChange={up("instagram")} placeholder="instagram.com/ihrefirma"/><Field label="LinkedIn" value={data.linkedin} onChange={up("linkedin")} placeholder="linkedin.com/company/..."/><Field label="TikTok" value={data.tiktok} onChange={up("tiktok")} placeholder="tiktok.com/@ihrefirma"/></div></div></>,<>{(()=>{const uf=data.unternehmensform;const hasFB=["eu","gmbh","og","kg","ag"].includes(uf);return(<><Dropdown label="Unternehmensform" value={uf} onChange={up("unternehmensform")} options={UNTERNEHMENSFORMEN} placeholder="Unternehmensform wählen" hint="Für das Impressum (ECG)" required/>
{(uf==="einzelunternehmen"||uf==="gesnbr")&&<Field label="Unternehmensgegenstand" value={data.unternehmensgegenstand} onChange={up("unternehmensgegenstand")} placeholder="z.B. Elektroinstallation und -handel" hint="Optional"/>}
{uf==="gesnbr"&&<Field label="Gesellschafter" value={data.gesellschafter} onChange={up("gesellschafter")} placeholder="Max Mustermann, Maria Musterfrau" hint="Empfohlen laut WKO"/>}
{hasFB&&<div className="pt-field-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}><Field label="Firmenbuchnummer" value={data.firmenbuchnummer} onChange={up("firmenbuchnummer")} placeholder="FN 123456 a" required/><Field label="Firmenbuchgericht" value={data.firmenbuchgericht} onChange={up("firmenbuchgericht")} placeholder="HG Wien" required/></div>}
{uf==="gmbh"&&<Field label="Geschäftsführer" value={data.geschaeftsfuehrer} onChange={up("geschaeftsfuehrer")} placeholder="Vor- und Nachname" hint="Für das Impressum" required/>}
{uf==="ag"&&<><Field label="Vorstand" value={data.vorstand} onChange={up("vorstand")} placeholder="Vor- und Nachname" required/><Field label="Aufsichtsrat" value={data.aufsichtsrat} onChange={up("aufsichtsrat")} placeholder="Vor- und Nachname" hint="Optional"/></>}
{uf==="verein"&&<><Field label="ZVR-Zahl" value={data.zvr_zahl} onChange={up("zvr_zahl")} placeholder="z.B. 123456789" required/><Field label="Vertretungsbefugte Organe" value={data.vertretungsorgane} onChange={up("vertretungsorgane")} placeholder="z.B. Obmann: Max Mustermann" rows={2}/></>}
{hasFB&&<Toggle label="Gesellschaft in Liquidation" checked={!!data.liquidation} onChange={v=>up("liquidation")(v?"in Liquidation":"")} desc="Nur wenn zutreffend"/>}
<div className="pt-field-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}><Field label="UID-Nummer / ATU" value={data.uid} onChange={up("uid")} placeholder="ATU12345678" hint="Optional"/><Field label="GISA-Zahl" value={data.gisazahl} onChange={up("gisazahl")} placeholder="z.B. 12345678" hint="Optional"/></div>
<div className="pt-field-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}><Field label="Aufsichtsbehörde" value={data.aufsichtsbehoerde} onChange={up("aufsichtsbehoerde")} placeholder="z.B. MA 63" hint="Optional"/><Field label="Kammer / Berufsrecht" value={data.kammer_berufsrecht} onChange={up("kammer_berufsrecht")} placeholder="z.B. WKO Wien" hint="Optional"/></div>
<div style={{marginTop:8,padding:"12px 14px",background:T.accentLight,borderRadius:T.rSm,border:`1px solid rgba(143,163,184,.15)`}}><div style={{fontSize:".78rem",color:T.accent,lineHeight:1.65}}>Diese Angaben werden automatisch in Ihr Impressum eingebaut (ECG-konform).<br/>Unterstützte Rechtsformen: e.U., Einzelunternehmen, GmbH, OG, KG, AG, Verein, GesbR. Bei anderen Rechtsformen bitte vorab Kontakt aufnehmen.</div></div><label style={{display:"flex",alignItems:"flex-start",gap:10,cursor:"pointer",padding:"14px 16px",background:T.bg,borderRadius:T.rSm,border:`1px solid ${impressumConfirm?T.accent+"44":T.bg3}`,marginBottom:16,marginTop:16}}><input type="checkbox" checked={impressumConfirm} onChange={e=>setImpressumConfirm(e.target.checked)} style={{marginTop:2,accentColor:T.accent,width:18,height:18,flexShrink:0,cursor:"pointer"}}/><span style={{fontSize:".82rem",color:T.textSub,lineHeight:1.6}}>Ich bestätige, dass die angegebenen Unternehmensdaten korrekt sind. Das Impressum wird auf Basis dieser Angaben erstellt.</span></label></>);})()}</>,<><p style={{fontSize:".88rem",color:T.textSub,margin:"0 0 6px",lineHeight:1.6}}>Basierend auf Ihrer Branche empfehlen wir:</p><p style={{fontSize:"1rem",fontWeight:700,color:T.dark,margin:"0 0 16px"}}>{STYLES_MAP[data.stil]?.label||"Professionell"}</p><StylePicker value={data.stil} onChange={up("stil")}/><div style={{marginTop:20,padding:"14px 16px",background:T.accentLight,borderRadius:T.rSm,border:`1px solid rgba(143,163,184,.15)`}}><div style={{fontSize:".78rem",fontWeight:700,color:T.accent,marginBottom:6}}>Nach dem Kauf – Self-Service-Portal</div><div style={{fontSize:".82rem",color:T.textSub,lineHeight:1.7}}>Logo hochladen &middot; Eigene Fotos hochladen &middot; Custom Domain verbinden – alles selbst, jederzeit.</div></div></>];

  const formPanel=(<div style={{display:"flex",flexDirection:"column",background:T.bg,borderRight:isMobile?"none":`1px solid ${T.bg3}`,height:isMobile?"100dvh":"100%",overflowY:"hidden",fontFamily:T.font}}>
    <div style={{padding:"20px 24px 0"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}><button onClick={onBack} style={{background:"none",border:"none",cursor:"pointer",fontSize:16,color:T.textMuted,padding:2}}>{"\u2190"}</button><img src="/logo.png" alt="SiteReady" style={{height:36}}/></div>
        {isMobile&&<button onClick={()=>setShowPreview(!showPreview)} style={{fontSize:".75rem",fontWeight:600,color:T.accent,background:T.accentLight,padding:"5px 12px",borderRadius:6,border:"none",cursor:"pointer",fontFamily:T.font}}>{showPreview?"Formular":"Vorschau"}</button>}
      </div>
      {!showImport&&!showBerufsgruppe&&<><div style={{display:"flex",alignItems:"center",gap:10,margin:"14px 0 16px"}}><div style={{flex:1,height:4,borderRadius:2,background:T.bg3,overflow:"hidden"}}><div style={{height:"100%",borderRadius:2,background:T.dark,width:`${pct}%`,transition:"width .4s"}}/></div><span style={{fontSize:".75rem",color:T.textMuted,fontWeight:600,fontFamily:T.mono}}>{step+1}/{STEPS.length}</span></div>
      <div style={{display:"flex",gap:2,background:T.bg3,borderRadius:T.rSm,padding:3}}>
        {STEPS.map((s,i)=>{const done=i<step&&stepValid[i];const cur=i===step;return(<button key={s.id} onClick={()=>go(i)} style={{flex:1,padding:"9px 4px",border:"none",background:cur?T.white:"transparent",cursor:"pointer",borderRadius:cur?8:0,fontFamily:T.font,transition:"all .2s",boxShadow:cur?T.sh1:"none"}}><div style={{fontSize:".75rem",fontWeight:700,color:done?T.accent:cur?T.dark:T.textMuted,letterSpacing:".08em",marginBottom:2}}>{done?"\u2713":s.num}</div><div style={{fontSize:".78rem",fontWeight:cur?700:500,color:cur?T.dark:done?T.accent:T.textMuted}}>{s.title}</div></button>);})}
      </div></>}
    </div>
    <div ref={ref} style={{flex:1,overflowY:"auto",padding:"20px 24px"}}>{showImport?(<div><div style={{display:"inline-flex",alignItems:"center",gap:6,background:T.accentLight,color:T.accent,padding:"5px 14px",borderRadius:100,fontSize:".75rem",fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",marginBottom:18}}>Optionaler Vorschritt</div><h2 style={{fontSize:"1.2rem",fontWeight:800,color:T.dark,marginBottom:10,letterSpacing:"-.02em"}}>Haben Sie schon eine Website?</h2><p style={{fontSize:".88rem",color:T.textSub,lineHeight:1.65,marginBottom:24}}>Wir importieren Ihre Daten automatisch – Sie prüfen und korrigieren nur noch.</p><Field label="Ihre aktuelle Website-URL" value={importUrl} onChange={setImportUrl} placeholder="https://ihre-website.at" hint="Bitte nur Ihre eigene Website angeben"/><div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:16}}><div style={{display:"flex",alignItems:"flex-start",gap:8,padding:"10px 12px",background:"#fefce8",borderRadius:T.rSm,border:"1px solid #fde68a"}}><span style={{fontSize:".8rem",flexShrink:0,fontWeight:700,color:"#92400e"}}>!</span><span style={{fontSize:".78rem",color:"#92400e",lineHeight:1.6}}><strong>Nur Ihre eigene Website:</strong> Bitte geben Sie ausschließlich eine Website an, für die Sie berechtigt sind. Das Importieren fremder Daten ist aus Datenschutzgründen nicht erlaubt.</span></div><div style={{display:"flex",alignItems:"flex-start",gap:8,padding:"10px 12px",background:T.accentLight,borderRadius:T.rSm,border:`1px solid rgba(143,163,184,.15)`}}><span style={{fontSize:".8rem",flexShrink:0,fontWeight:700,color:T.accent}}>i</span><span style={{fontSize:".78rem",color:T.accent,lineHeight:1.6}}><strong>Bitte Daten prüfen:</strong> Die importierten Informationen werden automatisch erkannt und können unvollständig sein. Im nächsten Schritt können Sie alles korrigieren und ergänzen.</span></div></div>{importErr&&<div style={{marginBottom:12,padding:"10px 14px",background:"#fef2f2",borderRadius:T.rSm,border:"1px solid #fecaca",fontSize:".78rem",color:T.red}}>{importErr}</div>}{importLoading?(<div style={{display:"flex",alignItems:"center",gap:12,padding:"16px 20px",background:T.accentLight,borderRadius:T.rSm,border:`1px solid rgba(143,163,184,.15)`,marginBottom:12}}><div style={{width:18,height:18,borderRadius:"50%",border:`2.5px solid ${T.accent}`,borderTopColor:"transparent",animation:"spin 1s linear infinite",flexShrink:0}}/><span style={{fontSize:".88rem",color:T.accent,fontWeight:600}}>Website wird analysiert...</span></div>):(<><label style={{display:"flex",alignItems:"flex-start",gap:10,cursor:"pointer",padding:"14px 16px",background:T.bg,borderRadius:T.rSm,border:`1px solid ${importConfirm?T.accent+"44":T.bg3}`,marginBottom:16,marginTop:16}}><input type="checkbox" checked={importConfirm} onChange={e=>setImportConfirm(e.target.checked)} style={{marginTop:2,accentColor:T.accent,width:18,height:18,flexShrink:0,cursor:"pointer"}}/><span style={{fontSize:".82rem",color:T.textSub,lineHeight:1.6}}>Ich bestätige, dass ich berechtigt bin, die Daten dieser Website zu importieren.</span></label><button onClick={doImport} disabled={!importConfirm} style={{width:"100%",padding:"14px",border:"none",borderRadius:T.rSm,background:importConfirm?T.dark:"#cbd5e1",color:"#fff",cursor:importConfirm?"pointer":"not-allowed",fontSize:".92rem",fontWeight:700,fontFamily:T.font,boxShadow:importConfirm?"0 2px 12px rgba(0,0,0,.12)":"none",marginBottom:12}}>Daten importieren &rarr;</button></>)}</div>):showBerufsgruppe?(<div>
  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:20}}>{[1,2].map(s=><React.Fragment key={s}>{s>1&&<div style={{flex:1,height:2,background:T.bg3,borderRadius:1}}/>}<div style={{width:28,height:28,borderRadius:"50%",background:s===1?T.dark:T.bg3,color:s===1?"#fff":T.textMuted,display:"flex",alignItems:"center",justifyContent:"center",fontSize:".75rem",fontWeight:700,flexShrink:0}}>{s}</div></React.Fragment>)}</div>
  <h2 style={{fontSize:"1.2rem",fontWeight:800,color:T.dark,marginBottom:10,letterSpacing:"-.02em"}}>Was beschreibt Ihren Betrieb?</h2>
  <p style={{fontSize:".88rem",color:T.textSub,lineHeight:1.65,marginBottom:16}}>Wir passen Design, Leistungen und Website-Texte automatisch an Ihre Branche an.</p>
  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
    {BERUFSGRUPPEN.map(g=>{const on=data.berufsgruppe===g.value;return(<button key={g.value} onClick={()=>onBerufsgruppChange(g.value)} style={{padding:"20px 16px",border:on?`2px solid ${T.accent}`:`1.5px solid ${T.bg3}`,borderRadius:T.r,background:on?T.accentLight:"#fff",cursor:"pointer",textAlign:"left",fontFamily:T.font,transition:"all .2s",boxShadow:on?`0 0 0 4px ${T.accentGlow}`:"none"}}>
      <div style={{marginBottom:8,color:on?T.accent:T.textMuted}} dangerouslySetInnerHTML={{__html:g.icon}}/>
      <div style={{fontWeight:700,fontSize:".9rem",color:T.dark,marginBottom:4}}>{g.label}</div>
      <div style={{fontSize:".75rem",color:T.textMuted,lineHeight:1.5}}>{g.desc}</div>
      {on&&<div style={{marginTop:10,display:"inline-flex",alignItems:"center",gap:4,background:T.dark,color:"#fff",borderRadius:20,padding:"4px 12px",fontSize:".75rem",fontWeight:700}}>{"\u2713 Ausgewählt"}</div>}
    </button>);})}
  </div>
  <div style={{padding:"10px 14px",background:T.bg,borderRadius:T.rSm,border:`1px solid ${T.bg3}`,fontSize:".8rem",color:T.textMuted,lineHeight:1.6}}>Aktuell verfügbar: <strong style={{color:T.text}}>Handwerk</strong> & <strong style={{color:T.text}}>Kosmetik & Körperpflege</strong> &ndash; Weitere Berufsgruppen folgen bald.</div>
</div>):pages[step]}</div>
    <div style={{padding:"16px 24px",borderTop:`1px solid ${T.bg3}`,display:"flex",justifyContent:showImport?"flex-end":"space-between",background:"rgba(255,255,255,.92)",backdropFilter:"blur(8px)",WebkitBackdropFilter:"blur(8px)",boxShadow:"0 -2px 12px rgba(0,0,0,.04)"}}>
      {showImport?(<button onClick={()=>{setShowImport(false);setShowBerufsgruppe(true);}} style={{padding:"12px 20px",border:`1.5px solid ${T.bg3}`,borderRadius:10,background:"transparent",color:T.textSub,cursor:"pointer",fontSize:".85rem",fontWeight:600,fontFamily:T.font}}>Ohne Import starten</button>):showBerufsgruppe?(<><button onClick={()=>{setShowBerufsgruppe(false);setShowImport(true);}} style={{padding:"12px 20px",border:`1.5px solid ${T.bg3}`,borderRadius:10,background:"transparent",color:T.textSub,cursor:"pointer",fontSize:".85rem",fontWeight:600,fontFamily:T.font}}>{"\u2190"} Zurück</button><button onClick={()=>{if(data.berufsgruppe)setShowBerufsgruppe(false);}} disabled={!data.berufsgruppe} style={{padding:"12px 24px",border:"none",borderRadius:10,background:data.berufsgruppe?T.dark:"#cbd5e1",color:"#fff",cursor:data.berufsgruppe?"pointer":"not-allowed",fontSize:".85rem",fontWeight:700,fontFamily:T.font,boxShadow:data.berufsgruppe?"0 2px 12px rgba(0,0,0,.12)":"none"}}>Weiter &rarr;</button></>):(<>{step>0?<button onClick={()=>go(step-1)} style={{padding:"12px 20px",border:`1.5px solid ${T.bg3}`,borderRadius:10,background:"transparent",color:T.textSub,cursor:"pointer",fontSize:".85rem",fontWeight:600,fontFamily:T.font}}>{"\u2190"} Zurück</button>:<div/>}{step<STEPS.length-1?<button onClick={()=>go(step+1)} disabled={!stepValid[step]} style={{padding:"12px 24px",border:"none",borderRadius:10,background:stepValid[step]?T.dark:"#cbd5e1",color:"#fff",cursor:stepValid[step]?"pointer":"not-allowed",fontSize:".85rem",fontWeight:700,fontFamily:T.font,boxShadow:stepValid[step]?"0 2px 12px rgba(0,0,0,.12)":"none",transition:"background .2s"}}>Weiter &rarr;</button>:<button onClick={onComplete} disabled={!stepValid.every(v=>v)} style={{padding:"12px 24px",border:"none",borderRadius:10,background:stepValid.every(v=>v)?T.dark:"#cbd5e1",color:"#fff",cursor:stepValid.every(v=>v)?"pointer":"not-allowed",fontSize:".85rem",fontWeight:700,fontFamily:T.font,boxShadow:stepValid.every(v=>v)?"0 2px 12px rgba(0,0,0,.12)":"none",transition:"background .2s"}}>Website erstellen &rarr;</button>}</>)}
    </div>
  </div>);

  if(isMobile){if(showPreview)return<div style={{minHeight:"100vh",background:T.bg}}><div style={{padding:"10px 14px",background:T.white,borderBottom:`1px solid ${T.bg3}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:".82rem",fontWeight:700,color:T.dark}}>Vorschau</span><button onClick={()=>setShowPreview(false)} style={{fontSize:".82rem",fontWeight:600,color:T.accent,background:"none",border:"none",cursor:"pointer",fontFamily:T.font}}>{"\u2190"} Formular</button></div><Preview d={data} compact/></div>;return formPanel}

  return(<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",height:"100vh",overflow:"hidden"}}><style>{css}</style>{formPanel}<div style={{display:"flex",flexDirection:"column",overflow:"hidden",background:T.bg2}}>
    <div style={{padding:"12px 18px",background:T.white,borderBottom:`1px solid ${T.bg3}`,display:"flex",alignItems:"center",gap:10}}>
      <div style={{display:"flex",gap:5}}>{["#ff5f57","#febc2e","#28c840"].map(c=><span key={c} style={{width:10,height:10,borderRadius:"50%",background:c}}/>)}</div>
      <div style={{flex:1,background:T.bg,borderRadius:8,padding:"7px 16px",fontSize:".78rem",color:T.textMuted,display:"flex",alignItems:"center",gap:6,border:`1px solid ${T.bg3}`,fontFamily:T.mono}}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>{data.firmenname?`${data.firmenname.toLowerCase().replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,"")}.siteready.at`:"firmenname.siteready.at"}</div>
      <div style={{background:"#fef9c3",color:"#92400e",fontSize:".75rem",fontWeight:700,padding:"5px 12px",borderRadius:6,textTransform:"uppercase",fontFamily:T.font,letterSpacing:".06em"}}>Vorschau</div>
    </div>
    <div style={{padding:"5px 18px",background:"#fafafa",borderBottom:`1px solid ${T.bg3}`,fontSize:".75rem",color:T.textMuted,textAlign:"center"}}>Stilvorschau &ndash; Ihre fertige Website wird professioneller gestaltet und mit individuellem Text geliefert.</div>
    <div style={{flex:1,overflowY:"auto",background:T.white,margin:10,borderRadius:T.rSm,boxShadow:T.sh3,border:"1px solid rgba(0,0,0,.04)"}}><Preview d={data}/></div>
  </div></div>);
}

/* ═══ PORTAL LOGIN ═══ */
function PortalLogin({onBack}){
  const[email,setEmail]=useState(()=>localStorage.getItem("sr_pending_email")||"");
  const[pw,setPw]=useState("");
  const[loading,setLoading]=useState(false);
  const[err,setErr]=useState("");
  const[forgotPw,setForgotPw]=useState(false);
  const[forgotDone,setForgotDone]=useState(false);
  const[emailNotConfirmed,setEmailNotConfirmed]=useState(false);
  const[resendingConfirm,setResendingConfirm]=useState(false);
  const[resentConfirm,setResentConfirm]=useState(false);

  const resendConfirmation=async()=>{
    if(!email||!supabase||resendingConfirm)return;
    setResendingConfirm(true);
    await supabase.auth.resend({type:"signup",email});
    setResendingConfirm(false);setResentConfirm(true);
    setTimeout(()=>setResentConfirm(false),5000);
  };

  const submitForgot=async()=>{if(!email){setErr("Bitte E-Mail eingeben.");return;}setLoading(true);setErr("");const{error}=await supabase.auth.resetPasswordForEmail(email,{redirectTo:window.location.origin+"/portal"});if(error)setErr(error.message);else setForgotDone(true);setLoading(false);};
  const submit=async()=>{
    if(!email.trim()||!pw.trim()||!supabase)return;
    setLoading(true);setErr("");
    const{error}=await supabase.auth.signInWithPassword({email,password:pw});
    if(error){
      if(error.message==="Invalid login credentials"){setErr("E-Mail oder Passwort falsch.");setEmailNotConfirmed(false);}
      else if(error.message.toLowerCase().includes("email not confirmed")||error.message.toLowerCase().includes("not confirmed")){setErr("Bitte bestätigen Sie zuerst Ihre E-Mail-Adresse.");setEmailNotConfirmed(true);}
      else{setErr(error.message);setEmailNotConfirmed(false);}
    }
    setLoading(false);
  };

  return(<div style={{minHeight:"100vh",background:T.bg,fontFamily:T.font,display:"flex",alignItems:"center",justifyContent:"center"}}><style>{css}</style>
    <div style={{maxWidth:400,width:"100%",padding:"0 24px"}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:40}}>
        <img src="/logo.png" alt="SiteReady" style={{height:36}}/>
      </div>
      {forgotDone?(<div><div style={{fontSize:"1.4rem",fontWeight:800,color:T.dark,marginBottom:12}}>{"\u2713"} E-Mail gesendet</div><p style={{color:T.textSub,fontSize:".9rem",lineHeight:1.6}}>Prüfen Sie Ihren Posteingang – Sie erhalten in Kürze einen Link zum Zurücksetzen Ihres Passworts.</p><button onClick={()=>{setForgotDone(false);setForgotPw(false);}} style={{marginTop:20,padding:"12px 20px",border:"none",borderRadius:T.rSm,background:T.dark,color:"#fff",cursor:"pointer",fontSize:".85rem",fontWeight:700,fontFamily:T.font}}>Zur Anmeldung</button></div>):forgotPw?(<div><div style={{fontSize:"1.2rem",fontWeight:800,color:T.dark,marginBottom:8}}>Passwort zurücksetzen</div><p style={{color:T.textSub,fontSize:".85rem",marginBottom:20}}>Geben Sie Ihre E-Mail-Adresse ein – wir senden Ihnen einen Link.</p><Field label="E-Mail-Adresse" value={email} onChange={setEmail} placeholder="ihre@email.at" type="email"/>{err&&<div style={{marginBottom:12,padding:"10px 14px",background:"#fef2f2",borderRadius:T.rSm,fontSize:".78rem",color:T.red}}>{err}</div>}<button onClick={submitForgot} disabled={loading} style={{width:"100%",padding:"14px",border:"none",borderRadius:T.rSm,background:loading?T.bg3:T.dark,color:"#fff",fontSize:".92rem",fontWeight:700,fontFamily:T.font,cursor:loading?"wait":"pointer",marginBottom:12}}>{loading?"...":"Link senden \u2192"}</button><button onClick={()=>{setForgotPw(false);setErr("");}} style={{width:"100%",padding:"12px",border:`1.5px solid ${T.bg3}`,borderRadius:T.rSm,background:"transparent",color:T.textSub,fontSize:".85rem",fontWeight:600,fontFamily:T.font,cursor:"pointer"}}>Abbrechen</button></div>):(<div>
        <div style={{fontSize:".8rem",fontWeight:700,color:T.dark,marginBottom:8}}>Self-Service-Portal</div>
        <h2 style={{fontSize:"1.5rem",fontWeight:800,color:T.dark,margin:"0 0 24px",letterSpacing:"-.03em"}}>Anmelden</h2>
        <Field label="E-Mail-Adresse" value={email} onChange={setEmail} placeholder="ihre@email.at" type="email"/>
        <Field label="Passwort" value={pw} onChange={setPw} placeholder="Ihr Passwort" type="password"/>
        <div style={{textAlign:"right",marginTop:-14,marginBottom:16}}><button onClick={()=>{setForgotPw(true);setErr("");}} style={{background:"none",border:"none",color:T.accent,fontSize:".8rem",cursor:"pointer",fontFamily:T.font,fontWeight:600}}>Passwort vergessen?</button></div>
        {err&&<div style={{marginBottom:12,padding:"10px 14px",background:"#fef2f2",borderRadius:T.rSm,fontSize:".78rem",color:T.red}}>
          {err}
          {emailNotConfirmed&&<div style={{marginTop:8}}>
            <span style={{color:"#92400e",fontSize:".75rem"}}>Prüfen Sie Ihren Posteingang und Spam-Ordner. </span>
            <button onClick={resendConfirmation} disabled={resendingConfirm} style={{background:"none",border:"none",color:T.accent,fontSize:".75rem",cursor:"pointer",fontFamily:T.font,fontWeight:700,padding:0,textDecoration:"underline"}}>
              {resentConfirm?"Gesendet!":resendingConfirm?"...":"Bestätigungsmail erneut senden"}
            </button>
          </div>}
        </div>}
        <button onClick={submit} disabled={loading} style={{width:"100%",padding:"14px",border:"none",borderRadius:T.rSm,background:loading?T.bg3:T.dark,color:"#fff",fontSize:".92rem",fontWeight:700,fontFamily:T.font,cursor:loading?"wait":"pointer",marginBottom:12,transition:"background .2s"}}>
          {loading?"...":"Anmelden \u2192"}
        </button>
        <button onClick={onBack} style={{width:"100%",padding:"12px",border:`1.5px solid ${T.bg3}`,borderRadius:T.rSm,background:"transparent",color:T.textSub,fontSize:".85rem",fontWeight:600,fontFamily:T.font,cursor:"pointer"}}>
          {"\u2190"} Zur Startseite
        </button>
      </div>)}
    </div>
  </div>);
}

/* ═══ PORTAL DASHBOARD ═══ */
function Portal({session,onLogout}){
  const[tab,setTab]=useState("website");
  const[order,setOrder]=useState(null);
  const[editSection,setEditSection]=useState(null);
  const[saving,setSaving]=useState(false);
  const[saved,setSaved]=useState(false);
  const[uploading,setUploading]=useState({});
  const[assetUrls,setAssetUrls]=useState({});
  const[invoices,setInvoices]=useState(null);
  const[supportSubject,setSupportSubject]=useState("");
  const[supportMsg,setSupportMsg]=useState("");
  const[supportSending,setSupportSending]=useState(false);
  const[supportSent,setSupportSent]=useState(false);
  const[supportErr,setSupportErr]=useState("");
  const[newPw,setNewPw]=useState("");
  const[newPw2,setNewPw2]=useState("");
  const[pwSaving,setPwSaving]=useState(false);
  const[pwSaved,setPwSaved]=useState(false);
  const[pwErr,setPwErr]=useState("");
  const[newEmail,setNewEmail]=useState("");
  const[emailSaving,setEmailSaving]=useState(false);
  const[emailSent,setEmailSent]=useState(false);
  const[emailErr,setEmailErr]=useState("");
  const[onboardSaving,setOnboardSaving]=useState(false);
  const[showPlanModal,setShowPlanModal]=useState(false);
  const[subscribing,setSubscribing]=useState(false);
  const[toastMsg,setToastMsg]=useState(null);
  const[gUrl,setGUrl]=useState("");
  const[gSaved,setGSaved]=useState(false);
  const[deleting,setDeleting]=useState({});
  const showToast=(msg)=>{setToastMsg(msg);setTimeout(()=>setToastMsg(null),2500);};

  useEffect(()=>{
    if(!supabase||!session?.user?.email)return;
    supabase.from("orders").select("*").eq("email",session.user.email).order("created_at",{ascending:false}).limit(1)
      .then(({data})=>{if(data&&data.length>0){
        setOrder(data[0]);
        if(data[0].google_maps_url){setGUrl(data[0].google_maps_url);setGSaved(true);}
        // Assets aus url_* Spalten laden (keine HEAD-Requests noetig)
        const o=data[0];const urls={};
        if(o.url_logo)urls.logo=o.url_logo+"?t="+Date.now();
        if(o.url_hero)urls.hero=o.url_hero+"?t="+Date.now();
        if(o.url_foto1)urls.foto1=o.url_foto1+"?t="+Date.now();
        if(o.url_foto2)urls.foto2=o.url_foto2+"?t="+Date.now();
        if(o.url_foto3)urls.foto3=o.url_foto3+"?t="+Date.now();
        if(o.url_foto4)urls.foto4=o.url_foto4+"?t="+Date.now();
        if(o.url_foto5)urls.foto5=o.url_foto5+"?t="+Date.now();
        setAssetUrls(urls);
      }});
  },[session]);

  const upOrder=k=>v=>setOrder(o=>({...o,[k]:v}));

  const save=async()=>{
    if(!order||!supabase)return;
    setSaving(true);setSaved(false);
    await supabase.from("orders").update({
      firmenname:order.firmenname,adresse:order.adresse,plz:order.plz,ort:order.ort,
      telefon:order.telefon,leistungen:order.leistungen,extra_leistung:order.extra_leistung,
      notdienst:order.notdienst,meisterbetrieb:order.meisterbetrieb,kostenvoranschlag:order.kostenvoranschlag,buchungslink:order.buchungslink||null,hausbesuche:order.hausbesuche,terminvereinbarung:order.terminvereinbarung,kurzbeschreibung:order.kurzbeschreibung,
      oeffnungszeiten:order.oeffnungszeiten,oeffnungszeiten_custom:order.oeffnungszeiten_custom,
      einsatzgebiet:order.einsatzgebiet,uid_nummer:order.uid_nummer,
      unternehmensform:order.unternehmensform,firmenbuchnummer:order.firmenbuchnummer,firmenbuchgericht:order.firmenbuchgericht,gisazahl:order.gisazahl,
      facebook:order.facebook||null,instagram:order.instagram||null,linkedin:order.linkedin||null,tiktok:order.tiktok||null,
      stil:order.stil,fotos:order.fotos,
      text_ueber_uns:order.text_ueber_uns||null,
      text_vorteile:order.text_vorteile||null,
      leistungen_beschreibungen:order.leistungen_beschreibungen||null,
    }).eq("id",order.id);
    setSaving(false);setSaved(true);setTimeout(()=>setSaved(false),3000);
  };

  const upload=async(key,file)=>{
    if(!file){showToast("Keine Datei ausgewählt");return;}
    if(!session?.user?.id){showToast("Nicht eingeloggt — bitte neu anmelden");return;}
    if(!supabase){showToast("Verbindungsfehler");return;}
    setUploading(u=>({...u,[key]:true}));
    try{
      const ext=file.name.split(".").pop().toLowerCase();
      const path=`${session.user.id}/${key}.${ext}`;
      const{error}=await supabase.storage.from("customer-assets").upload(path,file,{upsert:true});
      if(error){showToast("Upload fehlgeschlagen: "+error.message);setUploading(u=>({...u,[key]:false}));return;}
      const{data}=supabase.storage.from("customer-assets").getPublicUrl(path);
      setAssetUrls(u=>({...u,[key]:data.publicUrl+"?t="+Date.now()}));
      const colMap={logo:"url_logo",hero:"url_hero",foto1:"url_foto1",foto2:"url_foto2",foto3:"url_foto3",foto4:"url_foto4",foto5:"url_foto5"};
      const col=colMap[key];
      if(col&&order?.id){const{error:upErr}=await supabase.from("orders").update({[col]:data.publicUrl}).eq("id",order.id);if(upErr)console.error("URL-Update:",upErr.message);}
      showToast(key==="logo"?"Logo hochgeladen!":"Foto hochgeladen!");
    }catch(e){showToast("Fehler: "+e.message);}
    setUploading(u=>({...u,[key]:false}));
  };

  const deleteAsset=async(key)=>{
    if(!session?.user?.id||!supabase||!order?.id){showToast("Fehler — bitte neu anmelden");return;}
    setDeleting(d=>({...d,[key]:true}));
    try{
      const exts=["jpg","jpeg","png","webp","gif"];
      for(const ext of exts){
        await supabase.storage.from("customer-assets").remove([`${session.user.id}/${key}.${ext}`]).catch(()=>{});
      }
      const colMap={logo:"url_logo",hero:"url_hero",foto1:"url_foto1",foto2:"url_foto2",foto3:"url_foto3",foto4:"url_foto4",foto5:"url_foto5"};
      const col=colMap[key];
      if(col){const{error}=await supabase.from("orders").update({[col]:null}).eq("id",order.id);if(error)console.error("Delete URL-Update:",error.message);}
      setAssetUrls(u=>{const n={...u};delete n[key];return n;});
      showToast("Bild gelöscht");
    }catch(e){showToast("Fehler beim Löschen: "+e.message);}
    setDeleting(d=>({...d,[key]:false}));
  };

  const startBuild=async(withFotos)=>{
    if(!supabase||!session)return;
    setOnboardSaving(true);
    const{data:{session:s}}=await supabase.auth.getSession();
    const token=s?.access_token;
    try{
      const r=await fetch("/api/start-build",{
        method:"POST",
        headers:{"Content-Type":"application/json","Authorization":`Bearer ${token}`},
        body:JSON.stringify({fotos:withFotos}),
      });
      const j=await r.json();
      if(j.ok||r.ok)setOrder(o=>({...o,fotos:withFotos,regen_requested:false,status:"in_arbeit"}));
    }catch(_){}
    setOnboardSaving(false);
  };

  const subscribe=async(plan)=>{
    if(!order||!supabase)return;
    setSubscribing(true);
    const{data:{session:s}}=await supabase.auth.getSession();
    const resp=await fetch("/api/create-checkout",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({orderId:order.id,firmenname:order.firmenname,email:order.email,plan,trial_expires_at:order.trial_expires_at})
    });
    const json=await resp.json();
    if(json.url)window.location.href=json.url;
    else setSubscribing(false);
  };

  const trialDaysLeft=order?.trial_expires_at
    ?Math.max(0,Math.ceil((new Date(order.trial_expires_at)-Date.now())/(1000*60*60*24)))
    :0;

  const sub=order?.subdomain||"ihre-firma";
  const TABS=[
    {id:"website",label:"Website",icon:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>`},
    {id:"medien",label:"Medien",icon:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>`},
    {id:"marketing",label:"Teilen",icon:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>`},
    {id:"seo",label:"SEO",icon:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`},
    {id:"domain",label:"Domain",icon:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`},
    {id:"rechnungen",label:"Rechnungen",icon:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>`},
    {id:"account",label:"Account",icon:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`},
    {id:"support",label:"Support",icon:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`},
  ];

  const loadInvoices=async()=>{
    if(invoices!==null||!session?.user?.email)return;
    setInvoices("loading");
    const r=await fetch(`/api/get-invoices?email=${encodeURIComponent(session.user.email)}`);
    const j=await r.json();
    setInvoices(j.charges||[]);
  };
  useEffect(()=>{if(tab==="rechnungen")loadInvoices();},[tab]);

  const saveSection=async(section)=>{
    if(!order||!supabase)return;
    setSaving(true);setSaved(false);
    const fields={
      grunddaten:{firmenname:order.firmenname,kurzbeschreibung:order.kurzbeschreibung,einsatzgebiet:order.einsatzgebiet},
      kontakt:{adresse:order.adresse,plz:order.plz,ort:order.ort,telefon:order.telefon,oeffnungszeiten:order.oeffnungszeiten,oeffnungszeiten_custom:order.oeffnungszeiten_custom},
      leistungen:{leistungen:order.leistungen,extra_leistung:order.extra_leistung,notdienst:order.notdienst,meisterbetrieb:order.meisterbetrieb,kostenvoranschlag:order.kostenvoranschlag,buchungslink:order.buchungslink||null,hausbesuche:order.hausbesuche,terminvereinbarung:order.terminvereinbarung,leistungen_beschreibungen:order.leistungen_beschreibungen||null},
      texte:{text_ueber_uns:order.text_ueber_uns||null,text_vorteile:order.text_vorteile||null},
      design:{stil:order.stil,fotos:order.fotos},
      social:{facebook:order.facebook,instagram:order.instagram,linkedin:order.linkedin,tiktok:order.tiktok},
    };
    await supabase.from("orders").update(fields[section]||{}).eq("id",order.id);
    setSaving(false);setSaved(section);setTimeout(()=>setSaved(false),3000);
    setEditSection(null);
  };

  const SectionHeader=({id,label,badge})=>(
    <div style={{marginBottom:16,paddingBottom:14,borderBottom:`1px solid ${T.bg3}`}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{fontSize:".8rem",fontWeight:700,color:T.dark}}>{label}</div>
          {badge==="instant"&&<span style={{fontSize:".65rem",fontWeight:600,color:T.green,background:T.greenLight,padding:"2px 8px",borderRadius:100}}>Live</span>}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          {saved===id&&<span style={{color:T.green,fontSize:".8rem",fontWeight:600}}>{"\u2713"} Gespeichert</span>}
          {editSection===id
            ?<><button onClick={()=>setEditSection(null)} style={{padding:"7px 14px",border:`1.5px solid ${T.bg3}`,borderRadius:T.rSm,background:"#fff",color:T.textMuted,cursor:"pointer",fontSize:".8rem",fontWeight:600,fontFamily:T.font,minHeight:36,transition:"all .15s"}}>Abbrechen</button>
              <button onClick={()=>saveSection(id)} disabled={saving} style={{padding:"7px 18px",border:"none",borderRadius:T.rSm,background:T.dark,color:"#fff",cursor:"pointer",fontSize:".8rem",fontWeight:700,fontFamily:T.font,minHeight:36,transition:"all .15s"}}>{saving?"Speichert...":"Speichern"}</button></>
            :<button onClick={()=>setEditSection(id)} style={{padding:"7px 16px",border:`1.5px solid ${T.bg3}`,borderRadius:T.rSm,background:"#fff",color:T.textMuted,cursor:"pointer",fontSize:".8rem",fontWeight:600,fontFamily:T.font,minHeight:36,transition:"all .15s"}}
              onMouseOver={e=>{e.currentTarget.style.borderColor=T.dark;e.currentTarget.style.color=T.dark;}}
              onMouseOut={e=>{e.currentTarget.style.borderColor=T.bg3;e.currentTarget.style.color=T.textMuted;}}>Bearbeiten</button>}
        </div>
      </div>
    </div>
  );

  const InfoRow=({label,value})=>(
    <div className="pt-info-row" style={{display:"grid",gridTemplateColumns:"160px 1fr",padding:"10px 0",borderBottom:`1px solid ${T.bg3}`}}>
      <span style={{fontSize:".8rem",color:T.textMuted,fontWeight:500}}>{label}</span>
      <span style={{fontSize:".875rem",color:value?T.dark:T.textMuted,fontWeight:value?500:400}}>{value||"\u2014"}</span>
    </div>
  );
  const ASSETS=[
    {key:"logo",label:"Logo",desc:"Wird in der Navigation angezeigt – am besten quadratisch oder Querformat"},
    {key:"foto1",label:"Foto 1",desc:""},
    {key:"foto2",label:"Foto 2",desc:""},
    {key:"foto3",label:"Foto 3",desc:""},
    {key:"foto4",label:"Foto 4",desc:""},
    {key:"foto5",label:"Foto 5",desc:""},
  ];

  return(<div style={{minHeight:"100vh",background:T.bg,fontFamily:T.font,display:"flex",flexDirection:"column"}}><style>{css}</style>
    {/* Topbar */}
    <div className="pt-topbar" style={{background:"#fff",borderBottom:`1px solid ${T.bg3}`,padding:"0 32px",flexShrink:0}}>
      <div style={{height:64,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:16}}>
          <img src="/logo.png" alt="SiteReady" style={{height:32}}/>
          <div style={{width:1,height:24,background:T.bg3}}/>
          <span className="pt-sub-bar" style={{fontSize:".8rem",color:T.textMuted,fontFamily:T.mono}}>{sub}.siteready.at</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <span className="pt-email" style={{fontSize:".8rem",color:T.textMuted}}>{session?.user?.email}</span>
          <button onClick={onLogout} style={{padding:"7px 14px",border:`1.5px solid ${T.bg3}`,borderRadius:8,background:"transparent",color:T.textMuted,cursor:"pointer",fontSize:".8rem",fontWeight:600,fontFamily:T.font,minHeight:36,transition:"all .15s"}}
            onMouseOver={e=>{e.currentTarget.style.borderColor=T.dark;e.currentTarget.style.color=T.dark;}}
            onMouseOut={e=>{e.currentTarget.style.borderColor=T.bg3;e.currentTarget.style.color=T.textMuted;}}>Logout</button>
        </div>
      </div>
    </div>
    {/* Content */}
    <div style={{maxWidth:880,width:"100%",margin:"0 auto",padding:"32px 24px",flex:1}}>
      <div style={{marginBottom:8}}>
        <h1 style={{fontSize:"1.5rem",fontWeight:800,color:T.dark,margin:"0 0 24px",letterSpacing:"-.02em"}}>{order?.firmenname||"Willkommen"}</h1>
      </div>
      {/* Trial-Banner */}
      {order?.status==="trial"&&(<div style={{background:"linear-gradient(135deg,#7c3aed,#4f46e5)",borderRadius:T.r,padding:"20px 28px",marginBottom:20,display:"flex",alignItems:"center",justifyContent:"space-between",gap:16,flexWrap:"wrap"}}>
        <div>
          <div style={{fontWeight:800,fontSize:"1rem",color:"#fff",marginBottom:4}}>
            {trialDaysLeft>0?`Testphase: noch ${trialDaysLeft} Tag${trialDaysLeft===1?"":"e"}`:"Testphase abgelaufen"}
          </div>
          <div style={{fontSize:".82rem",color:"rgba(255,255,255,.75)"}}>Jetzt abonnieren – Karte wird erst nach der Testphase belastet.</div>
        </div>
        <button onClick={()=>setShowPlanModal(true)} style={{padding:"11px 24px",border:"2px solid rgba(255,255,255,.4)",borderRadius:T.rSm,background:"rgba(255,255,255,.15)",color:"#fff",cursor:"pointer",fontSize:".88rem",fontWeight:700,fontFamily:T.font,whiteSpace:"nowrap",backdropFilter:"blur(4px)",minHeight:44}}>
          Jetzt abonnieren \u2192
        </button>
      </div>)}

      {/* Plan-Modal */}
      {showPlanModal&&(<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.45)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999,padding:24}} onClick={()=>setShowPlanModal(false)}>
        <div style={{background:"#fff",borderRadius:T.r,padding:"36px 32px",maxWidth:480,width:"100%",boxShadow:"0 24px 64px rgba(0,0,0,.18)"}} onClick={e=>e.stopPropagation()}>
          <div style={{fontSize:"1.2rem",fontWeight:800,color:T.dark,marginBottom:6}}>Plan waehlen</div>
          <div style={{fontSize:".85rem",color:T.textSub,marginBottom:28}}>Karte wird erst nach der Testphase belastet. Jederzeit kuendbar.</div>
          <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:24}}>
            <button onClick={()=>subscribe("monthly")} disabled={subscribing} style={{padding:"18px 20px",border:`2px solid ${T.bg3}`,borderRadius:T.r,background:"#fff",cursor:subscribing?"wait":"pointer",textAlign:"left",fontFamily:T.font,transition:"border-color .2s"}}>
              <div style={{fontWeight:700,fontSize:".95rem",color:T.dark}}>Monatlich</div>
              <div style={{fontSize:"1.5rem",fontWeight:800,color:T.accent,fontFamily:T.mono,margin:"4px 0"}}>{"\u20AC"}18<span style={{fontSize:".85rem",fontWeight:500,color:T.textMuted}}>/Monat</span></div>
              <div style={{fontSize:".76rem",color:T.textMuted}}>Monatlich kündbar</div>
            </button>
            <button onClick={()=>subscribe("yearly")} disabled={subscribing} style={{padding:"18px 20px",border:`2px solid ${T.accent}`,borderRadius:T.r,background:T.accentLight,cursor:subscribing?"wait":"pointer",textAlign:"left",fontFamily:T.font,position:"relative"}}>
              <div style={{position:"absolute",top:-10,right:16,background:T.accent,color:"#fff",fontSize:".65rem",fontWeight:700,padding:"3px 10px",borderRadius:100,letterSpacing:".06em"}}>15% RABATT</div>
              <div style={{fontWeight:700,fontSize:".95rem",color:T.dark}}>{"Jährlich"}</div>
              <div style={{fontSize:"1.5rem",fontWeight:800,color:T.accent,fontFamily:T.mono,margin:"4px 0"}}>{"\u20AC"}183.60<span style={{fontSize:".85rem",fontWeight:500,color:T.textMuted}}>/Jahr</span></div>
              <div style={{fontSize:".76rem",color:T.textMuted}}>{"\u20AC"}15.30/Monat &middot; Laufzeit 12 Monate</div>
            </button>
          </div>
          <button onClick={()=>setShowPlanModal(false)} style={{width:"100%",padding:"11px",border:`2px solid ${T.bg3}`,borderRadius:T.rSm,background:"#fff",color:T.textSub,cursor:"pointer",fontSize:".85rem",fontWeight:600,fontFamily:T.font}}>Abbrechen</button>
        </div>
      </div>)}

      {/* Toast */}
      {toastMsg&&<div style={{position:"fixed",bottom:28,right:28,zIndex:9999,background:T.dark,color:"#fff",padding:"12px 20px",borderRadius:T.rSm,fontSize:".85rem",fontWeight:600,fontFamily:T.font,boxShadow:"0 8px 32px rgba(0,0,0,.22)",display:"flex",alignItems:"center",gap:8,pointerEvents:"none"}}><span style={{color:"#4ade80"}}>&#10003;</span>{toastMsg}</div>}
      {/* Build-Screen: status===pending (Generierung laeuft) */}
      {order?.status==="pending"&&<BuildScreen session={session} setOrder={setOrder}/>}

      {/* Tab Nav */}
      {order?.status!=="pending"&&<div className="pt-tab-nav" style={{display:"flex",gap:4,background:T.bg2,borderRadius:T.r,padding:4,marginBottom:28,width:"fit-content",flexWrap:"nowrap"}}>
        {TABS.map(t=>{const active=tab===t.id;return(<button key={t.id} onClick={()=>setTab(t.id)} style={{padding:"8px 16px",border:"none",background:active?"#fff":"transparent",cursor:"pointer",borderRadius:T.rSm,fontFamily:T.font,fontWeight:active?700:500,fontSize:".8rem",color:active?T.dark:T.textMuted,boxShadow:active?T.sh2:"none",transition:"all .2s",whiteSpace:"nowrap",flexShrink:0,display:"flex",alignItems:"center",gap:6,minHeight:40}} dangerouslySetInnerHTML={{__html:(t.icon||"")+`<span>${t.label}</span>`}}/>);})}
      </div>}

      {/* Tab: Website */}
      {tab==="website"&&(!order?<div style={{background:"#fff",borderRadius:T.r,padding:"28px 32px",border:`1px solid ${T.bg3}`,color:T.textMuted,fontSize:".9rem"}}>Bestellung wird geladen...</div>:<div style={{display:"flex",flexDirection:"column",gap:16}}>
        {/* Website Status */}
        <div style={{background:"#fff",borderRadius:T.r,padding:"24px 28px",border:`1px solid ${T.bg3}`,boxShadow:T.sh2}}>
          <div style={{fontSize:".8rem",fontWeight:700,color:T.dark,marginBottom:16}}>Website Status</div>
          {order?(<>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:18}}>
              <div style={{width:12,height:12,borderRadius:"50%",background:order.status==="live"?T.green:"#f59e0b",boxShadow:`0 0 0 4px ${order.status==="live"?"rgba(22,163,74,.15)":"rgba(245,158,11,.15)"}`}}/>
              <span style={{fontWeight:700,fontSize:".95rem",color:order.status==="live"?T.green:"#f59e0b"}}>{order.status==="live"?"Live – Ihre Website ist erreichbar":"In Bearbeitung"}</span>
            </div>
            {[{l:"Website-URL",v:`https://sitereadyprototype.pages.dev/s/${sub}`,link:true},{l:"Visitenkarte",v:`https://sitereadyprototype.pages.dev/s/${sub}/vcard`,link:true},{l:"Status",v:STATUS_LABELS[order.status]||order.status}].map(({l,v,link})=>(
              <div key={l} className="pt-info-row" style={{display:"grid",gridTemplateColumns:"160px 1fr",padding:"9px 0",borderBottom:`1px solid ${T.bg3}`}}>
                <span style={{fontSize:".78rem",color:T.textMuted,fontWeight:600}}>{l}</span>
                {link?<a href={v} target="_blank" rel="noreferrer" style={{fontSize:".88rem",color:T.accent,textDecoration:"none"}}>{v}</a>:<span style={{fontSize:".88rem",color:T.dark}}>{v}</span>}
              </div>))}
          </>):<div style={{color:T.textMuted,fontSize:".88rem"}}>Bestellung wird geladen...</div>}
        </div>
        {/* Aktuelles / News */}
        <div style={{background:"#fff",borderRadius:T.r,padding:"24px 28px",border:`1px solid ${T.bg3}`,boxShadow:T.sh2}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
            <div style={{fontSize:".8rem",fontWeight:700,color:T.dark}}>Aktuelles</div>
            {(order.announcements||[]).length<3&&<button onClick={async()=>{
              const a=[...(order.announcements||[]),{text:"",active:true,date:"",id:Date.now()}];
              await supabase.from("orders").update({announcements:a}).eq("id",order.id);
              setOrder(o=>({...o,announcements:a}));
            }} style={{padding:"6px 14px",border:`1.5px solid ${T.bg3}`,borderRadius:T.rSm,background:"#fff",color:T.textMuted,cursor:"pointer",fontSize:".8rem",fontWeight:600,fontFamily:T.font,minHeight:36,transition:"all .15s"}}>+ Hinzufügen</button>}
          </div>
          {(order.announcements||[]).length===0?(<div style={{padding:"24px 16px",textAlign:"center",background:T.bg,borderRadius:T.rSm,border:`1px dashed ${T.bg3}`}}>
            <div style={{fontSize:".85rem",color:T.textMuted,marginBottom:4}}>Keine Meldungen</div>
            <div style={{fontSize:".8rem",color:T.textMuted}}>Aktionen, Urlaub oder News — erscheint als Banner auf Ihrer Website.</div>
          </div>):(
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {(order.announcements||[]).map((ann,i)=><div key={ann.id||i} style={{border:`1.5px solid ${ann.active?T.accent+"33":T.bg3}`,borderRadius:T.rSm,padding:"14px 16px",background:ann.active?"#fff":T.bg}}>
              <div style={{display:"flex",gap:8,marginBottom:10}}>
                <input value={ann.text} placeholder="z.B. Betriebsurlaub 1.–15. August" onChange={e=>{const a=[...(order.announcements||[])];a[i]={...a[i],text:e.target.value};setOrder(o=>({...o,announcements:a}));}} style={{flex:1,padding:"8px 12px",border:`1.5px solid ${T.bg3}`,borderRadius:T.rSm,fontSize:".85rem",fontFamily:T.font,color:T.dark,outline:"none",minHeight:40}}/>
                <input type="date" value={ann.date||""} onChange={e=>{const a=[...(order.announcements||[])];a[i]={...a[i],date:e.target.value};setOrder(o=>({...o,announcements:a}));}} style={{padding:"8px 10px",border:`1.5px solid ${T.bg3}`,borderRadius:T.rSm,fontSize:".8rem",fontFamily:T.font,color:T.textMuted,outline:"none",minHeight:40,width:140}}/>
              </div>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",fontSize:".8rem",color:ann.active?T.green:T.textMuted,fontWeight:600}}>
                  <div style={{width:36,height:20,borderRadius:10,background:ann.active?T.green:T.bg3,position:"relative",transition:"background .2s",cursor:"pointer"}} onClick={()=>{const a=[...(order.announcements||[])];a[i]={...a[i],active:!a[i].active};setOrder(o=>({...o,announcements:a}));}}>
                    <div style={{width:16,height:16,borderRadius:"50%",background:"#fff",position:"absolute",top:2,left:ann.active?18:2,transition:"left .2s",boxShadow:"0 1px 3px rgba(0,0,0,.15)"}}/>
                  </div>
                  {ann.active?"Sichtbar":"Ausgeblendet"}
                </label>
                <div style={{display:"flex",gap:6}}>
                  <button onClick={async()=>{const a=[...(order.announcements||[])];await supabase.from("orders").update({announcements:a}).eq("id",order.id);setToastMsg("Gespeichert");}} style={{padding:"6px 12px",border:"none",borderRadius:T.rSm,background:T.dark,color:"#fff",cursor:"pointer",fontSize:".78rem",fontWeight:700,fontFamily:T.font,minHeight:32}}>Speichern</button>
                  <button onClick={async()=>{const a=(order.announcements||[]).filter((_,idx)=>idx!==i);await supabase.from("orders").update({announcements:a}).eq("id",order.id);setOrder(o=>({...o,announcements:a}));}} style={{padding:"6px 10px",border:`1.5px solid #fca5a5`,borderRadius:T.rSm,background:"#fff",color:T.red,cursor:"pointer",fontSize:".78rem",fontWeight:700,fontFamily:T.font,minHeight:32}}>{"\u00d7"}</button>
                </div>
              </div>
            </div>)}
          </div>)}
        </div>
        {/* Onboarding-Checkliste */}
        {(()=>{const checks=[{label:"Website erstellt",done:!!order.website_html},{label:"Logo hochgeladen",done:!!assetUrls.logo,tab:"medien"},{label:"Kontakt vollständig",done:!!(order.telefon&&order.adresse),tab:"website"},{label:"Foto hochgeladen",done:!!(assetUrls.foto1||assetUrls.foto2||assetUrls.foto3),tab:"medien"}];const done=checks.filter(c=>c.done).length;if(done===checks.length)return null;return(<div style={{background:"#fff",borderRadius:T.r,padding:"0",border:`1px solid ${T.bg3}`,boxShadow:T.sh2,overflow:"hidden"}}><div style={{height:3,background:T.bg3}}><div style={{height:"100%",background:T.accent,borderRadius:"0 2px 2px 0",width:`${(done/checks.length)*100}%`,transition:"width .4s ease"}}/></div><div style={{padding:"18px 24px"}}><div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}><div style={{fontSize:".75rem",fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:".1em"}}>Erste Schritte</div><div style={{fontSize:".75rem",color:T.textSub,fontWeight:600}}>{done}/{checks.length}</div></div><div style={{display:"flex",flexDirection:"column",gap:6}}>{checks.map((c,i)=><div key={i} onClick={c.tab&&!c.done?()=>setTab(c.tab):undefined} style={{display:"flex",alignItems:"center",gap:10,padding:"5px 0",cursor:c.tab&&!c.done?"pointer":"default"}}><div style={{width:18,height:18,borderRadius:"50%",background:c.done?"#16a34a":"#e2e8f0",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:".65rem",fontWeight:800,flexShrink:0}}>{c.done?"\u2713":""}</div><span style={{fontSize:".875rem",color:c.done?T.textMuted:T.dark,flex:1}}>{c.label}</span>{c.tab&&!c.done&&<span style={{fontSize:".75rem",color:T.accent,fontWeight:700}}>\u2192</span>}</div>)}</div></div></div>);})()}
        {/* Grunddaten */}
        <div style={{background:"#fff",borderRadius:T.r,padding:"24px 28px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1}}>
          <SectionHeader id="grunddaten" label="Grunddaten" badge="instant"/>
          {editSection==="grunddaten"?(<>
            <Field label="Firmenname" value={order.firmenname||""} onChange={upOrder("firmenname")} placeholder="Firmenname"/>
            <Field label="Kurzbeschreibung" value={order.kurzbeschreibung||""} onChange={upOrder("kurzbeschreibung")} placeholder="Kurze Beschreibung" rows={2}/>
            <Field label="Einsatzgebiet" value={order.einsatzgebiet||""} onChange={upOrder("einsatzgebiet")} placeholder="Wien & Umgebung"/>
          </>):(<>
            <InfoRow label="Firmenname" value={order.firmenname}/>
            <InfoRow label="Beschreibung" value={order.kurzbeschreibung}/>
            <InfoRow label="Einsatzgebiet" value={order.einsatzgebiet}/>
          </>)}
        </div>
        {/* Firmenbuch & Impressum */}
        <div style={{background:"#fff",borderRadius:T.r,padding:"24px 28px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16,paddingBottom:12,borderBottom:`1px solid ${T.bg3}`}}>
            <div style={{fontSize:".8rem",fontWeight:700,color:T.dark}}>Unternehmen & Impressum</div>
            <button onClick={()=>setTab("support")} style={{padding:"6px 16px",border:`2px solid ${T.bg3}`,borderRadius:T.rSm,background:"#fff",color:T.textSub,cursor:"pointer",fontSize:".78rem",fontWeight:600,fontFamily:T.font}}>Aenderung anfragen</button>
          </div>
          <InfoRow label="Unternehmensform" value={UNTERNEHMENSFORMEN.find(u=>u.value===order.unternehmensform)?.label||order.unternehmensform}/>
          <InfoRow label="UID-Nummer" value={order.uid_nummer}/>
          <InfoRow label="Firmenbuchnummer" value={order.firmenbuchnummer}/>
          <InfoRow label="Firmenbuchgericht" value={order.firmenbuchgericht}/>
          <InfoRow label="GISA-Zahl" value={order.gisazahl}/>
          <div style={{marginTop:10,fontSize:".75rem",color:T.textMuted,lineHeight:1.6}}>
            Impressum-Daten sind rechtlich relevant. Aenderungen werden von uns geprueft und innerhalb von 48h umgesetzt.
          </div>
        </div>
        {/* Kontakt */}
        <div style={{background:"#fff",borderRadius:T.r,padding:"24px 28px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1}}>
          <SectionHeader id="kontakt" label="Kontakt & Adresse" badge="instant"/>
          {editSection==="kontakt"?(<>
            <Field label="Straße & Hausnummer" value={order.adresse||""} onChange={upOrder("adresse")} placeholder="Hauptstrasse 1"/>
            <div className="pt-addr-grid" style={{display:"grid",gridTemplateColumns:"100px 1fr 1fr",gap:12}}>
              <Field label="PLZ" value={order.plz||""} onChange={upOrder("plz")} placeholder="1010"/>
              <Field label="Ort" value={order.ort||""} onChange={upOrder("ort")} placeholder="Wien"/>
              <Field label="Telefon" value={order.telefon||""} onChange={upOrder("telefon")} placeholder="+43 1 234 56 78"/>
            </div>
            <Dropdown label="Oeffnungszeiten" value={order.oeffnungszeiten||""} onChange={upOrder("oeffnungszeiten")} options={OEFFNUNGSZEITEN} placeholder="Oeffnungszeiten wählen"/>
            {order.oeffnungszeiten==="custom"&&<Field label="Eigene Oeffnungszeiten" value={order.oeffnungszeiten_custom||""} onChange={upOrder("oeffnungszeiten_custom")} placeholder={"Mo-Fr: 08:00-17:00"} rows={2}/>}
          </>):(<>
            <InfoRow label="Adresse" value={[order.adresse,[order.plz,order.ort].filter(Boolean).join(" ")].filter(Boolean).join(", ")}/>
            <InfoRow label="Telefon" value={order.telefon}/>
            <InfoRow label="Oeffnungszeiten" value={order.oeffnungszeiten==="custom"?order.oeffnungszeiten_custom:(OEFFNUNGSZEITEN.find(o=>o.value===order.oeffnungszeiten)?.label)}/>
          </>)}
        </div>
        {/* Leistungen */}
        <div style={{background:"#fff",borderRadius:T.r,padding:"24px 28px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1}}>
          <SectionHeader id="leistungen" label="Leistungen" badge="instant"/>
          {editSection==="leistungen"?(<>
            {(order.leistungen||[]).length>0&&<div style={{marginBottom:20}}>
              <div style={{fontSize:".72rem",fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:".1em",marginBottom:10}}>{"Reihenfolge & Beschreibung"}</div>
              {(order.leistungen||[]).map((l,i,arr)=>(
                <div key={l} style={{marginBottom:8,background:"#fff",border:`1px solid ${T.bg3}`,borderLeft:`3px solid ${T.accent}`,borderRadius:T.rSm,overflow:"hidden"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 12px",borderBottom:`1px solid ${T.bg3}`}}>
                    <span style={{flex:1,fontSize:".88rem",fontWeight:700,color:T.dark}}>{l}</span>
                    <div style={{display:"flex",gap:4}}>
                      <button onClick={()=>{if(i>0){const a=[...arr];[a[i-1],a[i]]=[a[i],a[i-1]];upOrder("leistungen")(a);}}} disabled={i===0} style={{width:24,height:24,border:`1px solid ${T.bg3}`,borderRadius:4,background:i===0?T.bg:"#fff",cursor:i===0?"default":"pointer",color:i===0?T.bg3:T.textSub,fontSize:".7rem",fontFamily:T.font,display:"flex",alignItems:"center",justifyContent:"center"}}>&#9650;</button>
                      <button onClick={()=>{if(i<arr.length-1){const a=[...arr];[a[i],a[i+1]]=[a[i+1],a[i]];upOrder("leistungen")(a);}}} disabled={i===arr.length-1} style={{width:24,height:24,border:`1px solid ${T.bg3}`,borderRadius:4,background:i===arr.length-1?T.bg:"#fff",cursor:i===arr.length-1?"default":"pointer",color:i===arr.length-1?T.bg3:T.textSub,fontSize:".7rem",fontFamily:T.font,display:"flex",alignItems:"center",justifyContent:"center"}}>&#9660;</button>
                    </div>
                  </div>
                  <textarea value={(order.leistungen_beschreibungen||{})[l]||""} onChange={e=>{const m={...(order.leistungen_beschreibungen||{})};m[l]=e.target.value;upOrder("leistungen_beschreibungen")(m);}} placeholder="Kurze Beschreibung (optional)" rows={2} style={{width:"100%",padding:"9px 12px",border:"none",resize:"none",fontSize:".82rem",fontFamily:T.font,background:"#fafafa",color:T.dark,outline:"none",boxSizing:"border-box",lineHeight:1.5}}/>
                </div>
              ))}
            </div>}
            <div style={{marginBottom:16}}>
              <div style={{fontSize:".72rem",fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:".1em",marginBottom:10}}>{"Zusätzliche Leistungen"}</div>
              {(order.extra_leistung?.split("\n")||[]).map((item,i,arr)=>(
                <div key={i} style={{marginBottom:8,background:"#fff",border:`1px solid ${T.bg3}`,borderRadius:T.rSm,overflow:"hidden"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,padding:"8px 12px",borderBottom:`1px solid ${T.bg3}`}}>
                    <input value={item} onChange={e=>{const a=[...(order.extra_leistung?.split("\n")||[])];a[i]=e.target.value;upOrder("extra_leistung")(a.join("\n"));}} placeholder="Name der Leistung" style={{flex:1,padding:"4px 0",border:"none",fontSize:".88rem",fontWeight:700,fontFamily:T.font,background:"transparent",color:T.dark,outline:"none"}}/>
                    <button onClick={()=>{const a=[...(order.extra_leistung?.split("\n")||[])];upOrder("extra_leistung")(a.filter((_,j)=>j!==i).join("\n"));}} style={{width:24,height:24,border:"1.5px solid #fca5a5",borderRadius:4,background:"#fff",color:"#ef4444",cursor:"pointer",fontSize:".82rem",fontWeight:700,fontFamily:T.font,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{"\u00d7"}</button>
                  </div>
                  <textarea value={(order.leistungen_beschreibungen||{})[item]||""} onChange={e=>{const m={...(order.leistungen_beschreibungen||{})};m[item]=e.target.value;upOrder("leistungen_beschreibungen")(m);}} placeholder="Kurze Beschreibung (optional)" rows={2} style={{width:"100%",padding:"9px 12px",border:"none",resize:"none",fontSize:".82rem",fontFamily:T.font,background:"#fafafa",color:T.dark,outline:"none",boxSizing:"border-box",lineHeight:1.5}}/>
                </div>
              ))}
              <button onClick={()=>{const a=[...(order.extra_leistung?.split("\n")||[])];upOrder("extra_leistung")([...a,""].join("\n"));}} style={{marginTop:4,padding:"8px 16px",border:`2px dashed ${T.bg3}`,borderRadius:T.rSm,background:"#fff",color:T.textSub,cursor:"pointer",fontSize:".8rem",fontWeight:600,fontFamily:T.font,width:"100%"}}>{"+ Leistung hinzufügen"}</button>
            </div>
            {BRANCHEN.find(b=>b.value===order?.branche)?.gruppe==="handwerk"&&<><Toggle label="24h Notdienst" checked={!!order.notdienst} onChange={upOrder("notdienst")} desc="Wird prominent angezeigt"/><Toggle label="Meisterbetrieb" checked={!!order.meisterbetrieb} onChange={upOrder("meisterbetrieb")} desc="Meisterbetrieb-Badge"/><Toggle label="Kostenloser Kostenvoranschlag" checked={!!order.kostenvoranschlag} onChange={upOrder("kostenvoranschlag")} desc="Vertrauens-Badge"/></>}
            {BRANCHEN.find(b=>b.value===order?.branche)?.gruppe==="kosmetik"&&<><Field label="Online-Buchungslink" value={order.buchungslink||""} onChange={upOrder("buchungslink")} placeholder="https://booksy.com/..." hint="Optional"/><Toggle label="Hausbesuche" checked={!!order.hausbesuche} onChange={upOrder("hausbesuche")} desc="Ich komme auch zu Ihnen"/><Toggle label="Nur nach Terminvereinbarung" checked={!!order.terminvereinbarung} onChange={upOrder("terminvereinbarung")} desc="Kein Walk-in"/></>}
          </>):(<>
            {(order.leistungen||[]).map((l,i)=><InfoRow key={i} label={i===0?"Leistungen":""} value={l}/>)}
            {order.extra_leistung?.split("\n").filter(s=>s.trim()).map((l,i)=><InfoRow key={i} label={i===0?"Zusatz":""} value={l}/>)}
            {BRANCHEN.find(b=>b.value===order?.branche)?.gruppe==="handwerk"&&<><InfoRow label="24h Notdienst" value={order.notdienst?"Ja":"Nein"}/><InfoRow label="Meisterbetrieb" value={order.meisterbetrieb?"Ja":"Nein"}/><InfoRow label="Kostenloser KV" value={order.kostenvoranschlag?"Ja":"Nein"}/></>}
            {BRANCHEN.find(b=>b.value===order?.branche)?.gruppe==="kosmetik"&&<><InfoRow label="Buchungslink" value={order.buchungslink||"\u2014"}/><InfoRow label="Hausbesuche" value={order.hausbesuche?"Ja":"Nein"}/><InfoRow label="Nur mit Termin" value={order.terminvereinbarung?"Ja":"Nein"}/></>}
          </>)}
        </div>
        {/* Website-Texte */}
        <div style={{background:"#fff",borderRadius:T.r,padding:"24px 28px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1}}>
          <SectionHeader id="texte" label="Website-Texte" badge="instant"/>
          {editSection==="texte"?(<>
            <Field label={"Über uns"} value={order.text_ueber_uns||""} onChange={upOrder("text_ueber_uns")} rows={3} hint={"Kurzer Vorstellungstext im Über-uns Bereich"}/>
            <div style={{marginBottom:4,marginTop:4,fontSize:".78rem",fontWeight:700,color:T.textSub,letterSpacing:".03em"}}>{"Vorteile (werden als Liste angezeigt)"}</div>
            {[0,1,2,3].map(i=><Field key={i} label={`Vorteil ${i+1}`} value={(order.text_vorteile||[])[i]||""} onChange={val=>{const a=[...(order.text_vorteile||["","","",""])];a[i]=val;upOrder("text_vorteile")(a);}}/>)}
          </>):order.text_ueber_uns!=null?(<>
            <InfoRow label={"Über uns"} value={order.text_ueber_uns||"\u2014"}/>
            <InfoRow label="Vorteile" value={Array.isArray(order.text_vorteile)?order.text_vorteile.filter(Boolean).join(" \u00b7 "):"\u2014"}/>
          </>):(
            <div style={{padding:"14px 16px",background:T.bg,borderRadius:T.rSm,fontSize:".82rem",color:T.textMuted,lineHeight:1.6}}>
              Texte werden automatisch bei der Website-Generierung erstellt und koennen danach hier bearbeitet werden.
            </div>
          )}
        </div>
        {/* Design */}
        <div style={{background:"#fff",borderRadius:T.r,padding:"24px 28px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16,paddingBottom:12,borderBottom:`1px solid ${T.bg3}`}}>
            <div style={{fontSize:".72rem",fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:".1em"}}>Design & Stil</div>
            <button onClick={()=>setTab("support")} style={{padding:"6px 16px",border:`2px solid ${T.bg3}`,borderRadius:T.rSm,background:"#fff",color:T.textSub,cursor:"pointer",fontSize:".78rem",fontWeight:600,fontFamily:T.font}}>Aenderung anfragen</button>
          </div>
          <InfoRow label="Stil" value={STYLES_MAP[order.stil||"professional"]?.label}/>
          <div style={{marginTop:10,fontSize:".75rem",color:T.textMuted,lineHeight:1.6}}>
            Ein Design-Wechsel ist ein komplettes Redesign Ihrer Website. Schreiben Sie uns kurz ueber den Support-Tab – wir setzen das für Sie um.
          </div>
        </div>
        {/* Social Media */}
        <div style={{background:"#fff",borderRadius:T.r,padding:"24px 28px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1}}>
          <SectionHeader id="social" label="Social Media" badge="instant"/>
          {editSection==="social"?(<>
            <Field label="Facebook" value={order.facebook||""} onChange={upOrder("facebook")} placeholder="https://facebook.com/..." hint="Optional"/>
            <Field label="Instagram" value={order.instagram||""} onChange={upOrder("instagram")} placeholder="https://instagram.com/..." hint="Optional"/>
            <Field label="LinkedIn" value={order.linkedin||""} onChange={upOrder("linkedin")} placeholder="https://linkedin.com/..." hint="Optional"/>
            <Field label="TikTok" value={order.tiktok||""} onChange={upOrder("tiktok")} placeholder="https://tiktok.com/..." hint="Optional"/>
          </>):(<>
            <InfoRow label="Facebook" value={order.facebook}/>
            <InfoRow label="Instagram" value={order.instagram}/>
            <InfoRow label="LinkedIn" value={order.linkedin}/>
            <InfoRow label="TikTok" value={order.tiktok}/>
          </>)}
        </div>

      </div>)}

      {/* Tab: Rechnungen */}
      {tab==="rechnungen"&&(<div style={{background:"#fff",borderRadius:T.r,padding:"28px 32px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
          <div style={{fontSize:".8rem",fontWeight:700,color:T.dark}}>Ihre Rechnungen</div>
          {order?.stripe_customer_id&&<button onClick={async()=>{
            try{
              const r=await fetch(`/api/billing-portal?customer_id=${order.stripe_customer_id}&return_url=${encodeURIComponent(window.location.href)}`);
              const j=await r.json();
              if(j.url)window.location.href=j.url;
            }catch(e){}
          }} style={{padding:"8px 16px",border:"none",borderRadius:T.rSm,background:T.accent,color:"#fff",cursor:"pointer",fontSize:".8rem",fontWeight:700,fontFamily:T.font}}>Zahlungsdaten verwalten</button>}
        </div>
        {invoices==="loading"&&<div style={{color:T.textMuted,fontSize:".9rem"}}>Wird geladen...</div>}
        {Array.isArray(invoices)&&invoices.length===0&&<div style={{color:T.textMuted,fontSize:".9rem"}}>Noch keine Zahlungen vorhanden.</div>}
        {Array.isArray(invoices)&&invoices.length>0&&(<div style={{display:"flex",flexDirection:"column",gap:8}}>
          {invoices.map(c=>{
            const date=new Date(c.created*1000).toLocaleDateString("de-AT",{day:"2-digit",month:"2-digit",year:"numeric"});
            const amount=(c.amount/100).toFixed(2).replace(".",",");
            const statusColor=c.status==="succeeded"?T.green:"#f59e0b";
            const statusLabel=c.status==="succeeded"?"Bezahlt":"Ausstehend";
            return(<div key={c.id} style={{display:"flex",alignItems:"center",gap:16,padding:"14px 16px",border:`1px solid ${T.bg3}`,borderRadius:T.rSm,background:T.bg}}>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:".88rem",color:T.dark}}>{c.description||"SiteReady Standard"}</div>
                <div style={{fontSize:".8rem",color:T.textMuted,marginTop:2}}>{date}</div>
              </div>
              <div style={{fontWeight:700,fontFamily:T.mono,fontSize:".95rem",color:T.dark}}>{"\u20AC"}{amount}</div>
              <div style={{padding:"4px 10px",borderRadius:4,background:`${statusColor}18`,color:statusColor,fontSize:".75rem",fontWeight:700}}>{statusLabel}</div>
              {c.receipt_url&&<a href={c.receipt_url} target="_blank" rel="noreferrer" style={{padding:"6px 14px",border:`2px solid ${T.bg3}`,borderRadius:T.rSm,color:T.textSub,fontSize:".8rem",fontWeight:600,textDecoration:"none",background:"#fff"}}>Beleg</a>}
            </div>);
          })}
        </div>)}
      </div>)}

      {/* Tab: Support */}
      {tab==="support"&&(<div style={{display:"flex",flexDirection:"column",gap:16}}>
        <div style={{background:T.accentLight,borderRadius:T.r,padding:"24px 28px",border:`1px solid rgba(143,163,184,.15)`,display:"flex",gap:32,flexWrap:"wrap"}}>
          <div>
            <div style={{fontSize:".75rem",fontWeight:700,color:T.accent,textTransform:"uppercase",letterSpacing:".08em",marginBottom:8}}>E-Mail Support</div>
            <a href="mailto:support@siteready.at" style={{fontSize:".95rem",fontWeight:700,color:T.dark,textDecoration:"none"}}>support@siteready.at</a>
            <div style={{fontSize:".78rem",color:T.textSub,marginTop:3}}>Antwort innerhalb von 48 Stunden</div>
          </div>
          <div>
            <div style={{fontSize:".75rem",fontWeight:700,color:T.accent,textTransform:"uppercase",letterSpacing:".08em",marginBottom:8}}>Geschäftszeiten</div>
            <div style={{fontSize:".88rem",fontWeight:600,color:T.dark}}>Mo – Fr, 09:00 – 17:00</div>
            <div style={{fontSize:".78rem",color:T.textSub,marginTop:3}}>Österreichische Feiertage ausgenommen</div>
          </div>
        </div>
        <div style={{background:"#fff",borderRadius:T.r,padding:"24px 28px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1}}>
          <div style={{fontSize:".8rem",fontWeight:700,color:T.dark,marginBottom:16}}>Nachricht senden</div>
          {supportSent?(<div style={{display:"flex",flexDirection:"column",alignItems:"flex-start",gap:12}}>
            <div style={{padding:"14px 18px",background:T.greenLight,borderRadius:T.rSm,border:"1px solid rgba(22,163,74,.2)",color:T.green,fontWeight:700}}>{"\u2713"} Nachricht gesendet</div>
            <p style={{color:T.textSub,fontSize:".88rem",margin:0}}>Wir melden uns innerhalb von 48 Stunden bei Ihnen.</p>
            <button onClick={()=>setSupportSent(false)} style={{padding:"9px 18px",border:`2px solid ${T.bg3}`,borderRadius:T.rSm,background:"#fff",color:T.textSub,cursor:"pointer",fontSize:".82rem",fontWeight:600,fontFamily:T.font}}>Neue Nachricht</button>
          </div>):(<>
            <Dropdown label="Betreff" value={supportSubject} onChange={setSupportSubject} options={[
              {value:"Technisches Problem",label:"Technisches Problem"},
              {value:"Aenderungswunsch",label:"Aenderungswunsch"},
              {value:"Frage zur Rechnung",label:"Frage zur Rechnung"},
              {value:"Custom Domain",label:"Custom Domain"},
              {value:"Kuendigung",label:"Kuendigung"},
              {value:"Sonstiges",label:"Sonstiges"},
            ]} placeholder="Betreff waehlen"/>
            <Field label="Ihre Nachricht" value={supportMsg} onChange={setSupportMsg} placeholder="Beschreiben Sie Ihr Anliegen..." rows={4}/>
            {supportErr&&<div style={{marginBottom:12,padding:"10px 14px",background:"#fef2f2",borderRadius:T.rSm,fontSize:".78rem",color:"#dc2626"}}>{supportErr}</div>}
            <button onClick={async()=>{
              if(!supportMsg.trim()||!supabase)return;
              setSupportSending(true);setSupportErr("");
              const{error}=await supabase.from("support_requests").insert({email:session?.user?.email,subject:supportSubject||"Allgemeine Anfrage",message:supportMsg});
              setSupportSending(false);
              if(error)setSupportErr("Fehler: "+error.message);
              else{setSupportSent(true);setSupportSubject("");setSupportMsg("");}
            }} disabled={supportSending||!supportMsg.trim()} style={{padding:"12px 24px",border:"none",borderRadius:T.rSm,background:(supportSending||!supportMsg.trim())?T.bg3:T.dark,color:"#fff",fontSize:".88rem",fontWeight:700,fontFamily:T.font,cursor:(supportSending||!supportMsg.trim())?"not-allowed":"pointer"}}>
              {supportSending?"Wird gesendet...":"Nachricht senden \u2192"}
            </button>
          </>)}
        </div>
        <div style={{background:"#fff",borderRadius:T.r,padding:"24px 28px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1}}>
          <div style={{fontSize:".8rem",fontWeight:700,color:T.dark,marginBottom:16}}>{"Häufige Fragen"}</div>
          {[
            {q:"Wie lange dauert es bis meine Website online ist?",a:"Direkt nach dem Formular starten wir die Generierung – Ihre Website ist meist innerhalb weniger Minuten als Vorschau erreichbar. Sie erhalten eine E-Mail sobald alles live ist."},
            {q:"Kann ich den Text auf meiner Website selbst aendern?",a:"Ja – im Self-Service-Portal koennen Sie jederzeit Adresse, Telefon, Leistungen und mehr anpassen."},
            {q:"Was passiert nach der Testphase?",a:"Nach 7 Tagen wird Ihre hinterlegte Karte belastet – beim Monatsabo monatlich kuendbar, beim Jahresabo nach 12 Monaten. Sie erhalten vorher eine Erinnerung per E-Mail."},
            {q:"Kann ich mein Logo und Fotos hochladen?",a:"Ja, im Tab 'Logo & Fotos' koennen Sie Ihr Logo sowie bis zu 5 eigene Fotos hochladen – Betriebsfotos, Team, Arbeitsproben, Atmosphaere. Sie entscheiden was passt."},
            {q:"Wie verbinde ich meine eigene Domain?",a:"Die noetigen DNS-Eintraege finden Sie im Tab 'Custom Domain'. Danach einmal kurz Bescheid geben und wir schalten die Domain frei."},
          ].map((f,i)=><details key={i} style={{borderBottom:`1px solid ${T.bg3}`,padding:"14px 0"}}>
            <summary style={{cursor:"pointer",fontWeight:600,fontSize:".88rem",color:T.dark,listStyle:"none",display:"flex",justifyContent:"space-between",alignItems:"center",userSelect:"none"}}>
              {f.q}<span style={{color:T.textMuted,fontSize:"1.1rem",marginLeft:12,flexShrink:0}}>+</span>
            </summary>
            <p style={{margin:"10px 0 0",fontSize:".84rem",color:T.textSub,lineHeight:1.7}}>{f.a}</p>
          </details>)}
        </div>
      </div>)}

      {/* Tab: Account */}
      {tab==="account"&&(<div style={{display:"flex",flexDirection:"column",gap:16}}>
        <div style={{background:"#fff",borderRadius:T.r,padding:"24px 28px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1}}>
          <div style={{fontSize:".8rem",fontWeight:700,color:T.dark,marginBottom:16}}>Account-Daten</div>
          <InfoRow label="E-Mail-Adresse" value={session?.user?.email}/>
          <InfoRow label="Mitglied seit" value={session?.user?.created_at?new Date(session.user.created_at).toLocaleDateString("de-AT",{day:"2-digit",month:"2-digit",year:"numeric"}):""}/>
        </div>
        <div style={{background:"#fff",borderRadius:T.r,padding:"24px 28px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1}}>
          <div style={{fontSize:".8rem",fontWeight:700,color:T.dark,marginBottom:16}}>Abonnement</div>
          {[{l:"Paket",v:"SiteReady Standard"},{l:"Preis",v:order?.subscription_plan==="yearly"?"\u20AC183.60 / Jahr (\u20AC15.30/Monat)":"\u20AC18 / Monat"},{l:"Laufzeit",v:order?.subscription_plan==="yearly"?"12 Monate, dann monatlich":"Monatlich kündbar"},...(order?.created_at?[{l:"Gestartet am",v:new Date(order.created_at).toLocaleDateString("de-AT",{day:"2-digit",month:"long",year:"numeric"})}]:[]),...(order?.created_at&&order?.subscription_plan==="yearly"?[{l:"Mindestende",v:new Date(new Date(order.created_at).setFullYear(new Date(order.created_at).getFullYear()+1)).toLocaleDateString("de-AT",{day:"2-digit",month:"long",year:"numeric"})}]:[])].map(({l,v})=>(
            <div key={l} className="pt-info-row" style={{display:"grid",gridTemplateColumns:"160px 1fr",padding:"9px 0",borderBottom:`1px solid ${T.bg3}`}}>
              <span style={{fontSize:".78rem",color:T.textMuted,fontWeight:600}}>{l}</span>
              <span style={{fontSize:".88rem",color:T.dark}}>{v}</span>
            </div>))}
        </div>
        <div style={{display:"flex",flexWrap:"wrap",gap:16}}>
          <div style={{background:"#fff",borderRadius:T.r,padding:"24px 28px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1,flex:"1 1 280px"}}>
            <div style={{fontSize:".72rem",fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:".1em",marginBottom:16}}>{"Passwort ändern"}</div>
            <Field label="Neues Passwort" value={newPw} onChange={setNewPw} placeholder="Mindestens 6 Zeichen" type="password"/>
            <Field label="Passwort bestätigen" value={newPw2} onChange={setNewPw2} placeholder="Passwort wiederholen" type="password"/>
            {pwErr&&<div style={{marginBottom:12,padding:"10px 14px",background:"#fef2f2",borderRadius:T.rSm,fontSize:".78rem",color:"#dc2626"}}>{pwErr}</div>}
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <button onClick={async()=>{
                if(!newPw||newPw!==newPw2){setPwErr("Passwoerter stimmen nicht ueberein.");return;}
                if(newPw.length<6){setPwErr("Mindestens 6 Zeichen.");return;}
                setPwSaving(true);setPwErr("");
                const{error}=await supabase.auth.updateUser({password:newPw});
                setPwSaving(false);
                if(error)setPwErr(error.message);
                else{setPwSaved(true);setNewPw("");setNewPw2("");setTimeout(()=>setPwSaved(false),3000);}
              }} disabled={pwSaving} style={{padding:"12px 24px",border:"none",borderRadius:T.rSm,background:pwSaving?T.bg3:T.dark,color:"#fff",fontSize:".88rem",fontWeight:700,fontFamily:T.font,cursor:pwSaving?"wait":"pointer"}}>
                {pwSaving?"...":"Passwort speichern"}
              </button>
              {pwSaved&&<span style={{color:T.green,fontWeight:600,fontSize:".85rem"}}>{"\u2713"} Gespeichert</span>}
            </div>
          </div>
          <div style={{background:"#fff",borderRadius:T.r,padding:"24px 28px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1,flex:"1 1 280px"}}>
            <div style={{fontSize:".72rem",fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:".1em",marginBottom:16}}>{"E-Mail-Adresse ändern"}</div>
            {emailSent
              ?<div style={{display:"flex",flexDirection:"column",gap:12}}>
                <div style={{padding:"14px 18px",background:T.greenLight,borderRadius:T.rSm,border:"1px solid rgba(22,163,74,.2)",color:T.green,fontWeight:700,fontSize:".88rem"}}>{"\u2713 Bestätigungslink gesendet"}</div>
                <p style={{color:T.textSub,fontSize:".84rem",margin:0,lineHeight:1.6}}>{"Bitte prüfen Sie Ihren Posteingang und klicken Sie auf den Bestätigungslink um die neue E-Mail-Adresse zu aktivieren."}</p>
                <button onClick={()=>setEmailSent(false)} style={{padding:"8px 16px",border:`2px solid ${T.bg3}`,borderRadius:T.rSm,background:"#fff",color:T.textSub,cursor:"pointer",fontSize:".82rem",fontWeight:600,fontFamily:T.font,alignSelf:"flex-start"}}>Neue Anfrage</button>
              </div>
              :<>
                <Field label="Neue E-Mail-Adresse" value={newEmail} onChange={setNewEmail} placeholder="neue@email.at" type="email"/>
                {emailErr&&<div style={{marginBottom:12,padding:"10px 14px",background:"#fef2f2",borderRadius:T.rSm,fontSize:".78rem",color:"#dc2626"}}>{emailErr}</div>}
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <button onClick={async()=>{
                    if(!newEmail||!newEmail.includes("@")){setEmailErr("Bitte gültige E-Mail eingeben.");return;}
                    setEmailSaving(true);setEmailErr("");
                    const{error}=await supabase.auth.updateUser({email:newEmail});
                    setEmailSaving(false);
                    if(error)setEmailErr(error.message);
                    else{setEmailSent(true);setNewEmail("");}
                  }} disabled={emailSaving} style={{padding:"12px 24px",border:"none",borderRadius:T.rSm,background:emailSaving?T.bg3:T.dark,color:"#fff",fontSize:".88rem",fontWeight:700,fontFamily:T.font,cursor:emailSaving?"wait":"pointer"}}>
                    {emailSaving?"...":"Bestätigungslink senden"}
                  </button>
                </div>
              </>
            }
          </div>
        </div>
        <div style={{background:"#fff",borderRadius:T.r,padding:"24px 28px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1}}>
          <div style={{fontSize:".72rem",fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:".1em",marginBottom:8}}>Kündigung</div>
          <p style={{fontSize:".85rem",color:T.textSub,lineHeight:1.7,margin:"0 0 14px"}}>Für eine Kündigung schreiben Sie bitte an <strong>support@siteready.at</strong>.{order?.subscription_plan==="yearly"?" Bitte beachten Sie die Mindestlaufzeit von 12 Monaten.":" Das Monatsabo ist jederzeit kuendbar."}</p>
        </div>
      </div>)}

      {/* Tab: Medien */}
      {/* Tab: Marketing */}
      {tab==="marketing"&&(<div style={{display:"flex",flexDirection:"column",gap:16}}>
        {/* Digitale Visitenkarte */}
        {(()=>{const vcardUrl=`https://sitereadyprototype.pages.dev/s/${sub}/vcard`;const qrUrl=`https://api.qrserver.com/v1/create-qr-code/?size=400x400&format=png&data=${encodeURIComponent(vcardUrl)}`;return(
        <div style={{background:"#fff",borderRadius:T.r,padding:"24px 28px",border:`1px solid ${T.bg3}`,boxShadow:T.sh2}}>
          <div style={{fontSize:".8rem",fontWeight:700,color:T.dark,marginBottom:16}}>Digitale Visitenkarte</div>
          <div style={{display:"flex",gap:24,alignItems:"flex-start",flexWrap:"wrap"}}>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:10,flexShrink:0}}>
              <div style={{width:140,height:140,borderRadius:T.rSm,border:`1px solid ${T.bg3}`,overflow:"hidden",background:T.bg}}>
                <img src={qrUrl} alt="QR-Code" style={{width:"100%",height:"100%",display:"block"}}/>
              </div>
              <button onClick={async()=>{try{const r=await fetch(qrUrl);const b=await r.blob();const u=URL.createObjectURL(b);const a=document.createElement("a");a.href=u;a.download=`${sub}-qr.png`;a.click();URL.revokeObjectURL(u);}catch(e){window.open(qrUrl,"_blank");}}} style={{padding:"7px 14px",border:`2px solid ${T.bg3}`,borderRadius:T.rSm,background:"#fff",color:T.textSub,cursor:"pointer",fontSize:".75rem",fontWeight:600,fontFamily:T.font,width:"100%",textAlign:"center"}}>QR herunterladen</button>
            </div>
            <div style={{flex:1,minWidth:200}}>
              <p style={{fontSize:".85rem",color:T.textSub,lineHeight:1.6,margin:"0 0 14px"}}>Teilen Sie Ihre Visitenkarte per WhatsApp, SMS oder drucken Sie den QR-Code auf Flyer und Firmenauto.</p>
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:14,background:T.bg,borderRadius:T.rSm,padding:"8px 12px",border:`1px solid ${T.bg3}`}}>
                <span style={{fontSize:".78rem",color:T.accent,fontFamily:T.mono,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{vcardUrl.replace("https://","")}</span>
                <button onClick={()=>{navigator.clipboard.writeText(vcardUrl);setToastMsg("Link kopiert!");}} style={{padding:"4px 10px",border:`1.5px solid ${T.bg3}`,borderRadius:6,background:"#fff",color:T.textSub,cursor:"pointer",fontSize:".75rem",fontWeight:600,fontFamily:T.font,flexShrink:0}}>Kopieren</button>
              </div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                <a href={vcardUrl} target="_blank" rel="noreferrer" style={{padding:"9px 16px",background:T.accent,color:"#fff",borderRadius:T.rSm,fontSize:".8rem",fontWeight:700,textDecoration:"none",fontFamily:T.font}}>Vorschau</a>
                <button onClick={()=>{if(navigator.share){navigator.share({title:order.firmenname||"Visitenkarte",url:vcardUrl});}else{navigator.clipboard.writeText(vcardUrl);setToastMsg("Link kopiert!");}}} style={{padding:"9px 16px",border:`2px solid ${T.bg3}`,borderRadius:T.rSm,background:"#fff",color:T.textSub,cursor:"pointer",fontSize:".8rem",fontWeight:700,fontFamily:T.font}}>Teilen</button>
              </div>
            </div>
          </div>
        </div>);})()}
        {/* Firmen-Flyer PDF — verschoben vor Website teilen */}
        <div style={{background:"#fff",borderRadius:T.r,padding:"24px 28px",border:`1px solid ${T.bg3}`,boxShadow:T.sh2}}>
          <div style={{fontSize:".8rem",fontWeight:700,color:T.dark,marginBottom:8}}>Firmen-Flyer (PDF)</div>
          <p style={{fontSize:".82rem",color:T.textSub,lineHeight:1.6,margin:"0 0 16px"}}>Professioneller One-Pager im Design Ihrer Website — für Kunden, Pinnwände und als E-Mail-Beilage.</p>
          <button onClick={()=>{const s=STYLES_MAP[order.stil]||STYLES_MAP.professional;const websiteUrl=`https://sitereadyprototype.pages.dev/s/${sub}`;const qr=`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(websiteUrl)}`;const leistungen=[...(order.leistungen||[]),...(order.extra_leistung?order.extra_leistung.split("\n").map(x=>x.trim()).filter(Boolean):[])];const logoHtml=assetUrls.logo?`<img src="${assetUrls.logo}" alt="Logo" style="height:56px;max-width:200px;object-fit:contain;"/>`:``;const oezLabel=({"mo-fr-8-17":"Mo\u2013Fr 8\u201317 Uhr","mo-fr-7-16":"Mo\u2013Fr 7\u201316 Uhr","mo-fr-8-18":"Mo\u2013Fr 8\u201318 Uhr","mo-sa-8-17":"Mo\u2013Sa 8\u201317 Uhr","mo-sa-8-12":"Mo\u2013Sa 8\u201312 Uhr","vereinbarung":"Nach Vereinbarung"})[order.oeffnungszeiten]||order.oeffnungszeiten||"";const htmlContent=`<!DOCTYPE html><html><head><meta charset="utf-8"><title>${order.firmenname||"Firmen-Flyer"}</title><link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700;800&family=Source+Serif+4:wght@400;600;700&display=swap" rel="stylesheet"><style>@page{size:A4;margin:0;}body{font-family:${s.font};color:${s.text};margin:0;padding:0;line-height:1.5;-webkit-print-color-adjust:exact;print-color-adjust:exact;}*{box-sizing:border-box;}.hero{background:${s.heroGradient};color:#fff;padding:48px 40px 40px;position:relative;overflow:hidden;}.hero::before{content:'';position:absolute;inset:0;background:${s.heroOverlay};}.hero-content{position:relative;z-index:1;}.hero h1{font-size:32px;font-weight:800;margin:0 0 8px;letter-spacing:-.02em;line-height:1.15;}.hero p{font-size:15px;opacity:.8;margin:0;max-width:400px;line-height:1.6;}.hero-logo{margin-bottom:20px;}.body{padding:36px 40px 28px;}.section-title{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:${s.accent};margin:0 0 14px;padding-bottom:8px;border-bottom:2px solid ${s.borderColor};}.leistungen{display:grid;grid-template-columns:1fr 1fr;gap:6px 28px;margin-bottom:32px;}.leistung{font-size:13px;padding:4px 0;display:flex;align-items:center;gap:8px;}.check{color:${s.accent};font-weight:700;font-size:14px;}.contact-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px 28px;margin-bottom:32px;}.contact-label{font-weight:700;color:${s.textMuted};font-size:10px;text-transform:uppercase;letter-spacing:.06em;margin-bottom:2px;}.contact-value{font-size:13px;font-weight:500;color:${s.text};}.footer{display:flex;align-items:center;justify-content:space-between;padding:24px 40px;background:${s.bg};border-top:2px solid ${s.borderColor};}.qr-section{display:flex;align-items:center;gap:14px;}.qr-text{font-size:12px;color:${s.textMuted};}.qr-text strong{display:block;color:${s.text};font-size:13px;margin-bottom:2px;}.branding{font-size:10px;color:${s.textLight};}</style></head><body><div class="hero"><div class="hero-content">${logoHtml?`<div class="hero-logo">${logoHtml}</div>`:""}<h1>${order.firmenname||""}</h1>${order.kurzbeschreibung?`<p>${order.kurzbeschreibung}</p>`:""}</div></div><div class="body">${leistungen.length?`<div class="section-title">Unsere Leistungen</div><div class="leistungen">${leistungen.map(l=>`<div class="leistung"><span class="check">\u2713</span>${l}</div>`).join("")}</div>`:""}<div class="section-title">Kontakt</div><div class="contact-grid">${order.adresse?`<div><div class="contact-label">Adresse</div><div class="contact-value">${order.adresse}${order.plz||order.ort?", "+[order.plz,order.ort].filter(Boolean).join(" "):""}</div></div>`:""} ${order.telefon?`<div><div class="contact-label">Telefon</div><div class="contact-value">${order.telefon}</div></div>`:""} ${order.email?`<div><div class="contact-label">E-Mail</div><div class="contact-value">${order.email}</div></div>`:""} ${oezLabel?`<div><div class="contact-label">\u00D6ffnungszeiten</div><div class="contact-value">${oezLabel}</div></div>`:""} ${order.einsatzgebiet?`<div><div class="contact-label">Einsatzgebiet</div><div class="contact-value">${order.einsatzgebiet}</div></div>`:""}</div></div><div class="footer"><div class="qr-section"><img src="${qr}" alt="QR" style="width:72px;height:72px;border-radius:${s.radius};"/><div class="qr-text"><strong>Besuchen Sie uns online</strong>${sub}.siteready.at</div></div><div class="branding">Erstellt mit SiteReady.at</div></div></body></html>`;const iframe=document.createElement("iframe");iframe.style.cssText="position:fixed;top:-9999px;left:-9999px;width:794px;height:1123px;";document.body.appendChild(iframe);iframe.contentDocument.write(htmlContent);iframe.contentDocument.close();iframe.onload=()=>{setTimeout(()=>{iframe.contentWindow.print();setTimeout(()=>document.body.removeChild(iframe),1000);},500);};}} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 20px",background:T.dark,color:"#fff",border:"none",borderRadius:T.rSm,cursor:"pointer",fontFamily:T.font,fontSize:".82rem",fontWeight:700}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            PDF erstellen &amp; herunterladen
          </button>
        </div>
        {/* Website teilen */}
        <div style={{background:"#fff",borderRadius:T.r,padding:"24px 28px",border:`1px solid ${T.bg3}`,boxShadow:T.sh2}}>
          <div style={{fontSize:".8rem",fontWeight:700,color:T.dark,marginBottom:16}}>Website teilen</div>
          <p style={{fontSize:".82rem",color:T.textSub,lineHeight:1.6,margin:"0 0 16px"}}>Teilen Sie Ihre Website mit Kunden, Partnern und auf Social Media.</p>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            <button onClick={()=>{const url=`https://sitereadyprototype.pages.dev/s/${sub}`;const text=`Schauen Sie sich unsere neue Website an: ${url}`;window.open(`https://wa.me/?text=${encodeURIComponent(text)}`,"_blank");}} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 16px",background:"#dcfce7",border:"1.5px solid #bbf7d0",borderRadius:T.rSm,cursor:"pointer",fontFamily:T.font,fontSize:".82rem",fontWeight:600,color:"#16a34a",textAlign:"left"}}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#16a34a"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
              Per WhatsApp teilen
            </button>
            <button onClick={()=>{const url=`https://sitereadyprototype.pages.dev/s/${sub}`;const subject=encodeURIComponent(`${order.firmenname||"Meine"} Website`);const body=encodeURIComponent(`Schauen Sie sich unsere neue Website an:\n\n${url}\n\nWir freuen uns auf Ihre Anfrage!`);window.open(`mailto:?subject=${subject}&body=${body}`);}} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 16px",background:T.bg,border:`1.5px solid ${T.bg3}`,borderRadius:T.rSm,cursor:"pointer",fontFamily:T.font,fontSize:".82rem",fontWeight:600,color:T.textSub,textAlign:"left"}}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              Per E-Mail teilen
            </button>
            <button onClick={()=>{navigator.clipboard.writeText(`https://sitereadyprototype.pages.dev/s/${sub}`);setToastMsg("Link kopiert!");}} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 16px",background:T.bg,border:`1.5px solid ${T.bg3}`,borderRadius:T.rSm,cursor:"pointer",fontFamily:T.font,fontSize:".82rem",fontWeight:600,color:T.textSub,textAlign:"left"}}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
              Link kopieren
            </button>
          </div>
        </div>
      </div>)}

      {tab==="medien"&&(<div style={{display:"flex",flexDirection:"column",gap:16}}>
        {/* Logo */}
        {(()=>{const a=ASSETS[0];const url=assetUrls[a.key];const busy=uploading[a.key];return(
          <div style={{background:"#fff",borderRadius:T.r,padding:"20px 24px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
              <div>
                <div style={{fontWeight:700,fontSize:".9rem",color:T.dark,marginBottom:2}}>Logo</div>
                <div style={{fontSize:".78rem",color:T.textMuted}}>{a.desc}</div>
              </div>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <label style={{padding:"9px 18px",border:`2px solid ${T.bg3}`,borderRadius:T.rSm,background:busy?T.bg:"#fff",color:T.textSub,cursor:busy?"wait":"pointer",fontSize:".82rem",fontWeight:600,fontFamily:T.font,whiteSpace:"nowrap"}}>
                  {busy?"Lädt...":url?"Ersetzen":"Hochladen"}
                  <input type="file" accept="image/*" style={{display:"none"}} disabled={busy} onChange={e=>{if(e.target.files[0])upload(a.key,e.target.files[0]);}}/>
                </label>
                {url&&<button onClick={()=>deleteAsset(a.key)} disabled={deleting[a.key]} style={{padding:"9px 12px",border:"2px solid #fca5a5",borderRadius:T.rSm,background:"#fff",color:"#ef4444",cursor:deleting[a.key]?"wait":"pointer",fontSize:".82rem",fontWeight:700,fontFamily:T.font}}>{deleting[a.key]?"...":"\u00d7"}</button>}
              </div>
            </div>
            {url&&(<div style={{marginBottom:12}}>
              <div style={{fontSize:".68rem",fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:".08em",marginBottom:6}}>Vorschau</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <div>
                  <div style={{fontSize:".68rem",color:T.textMuted,marginBottom:4}}>Navigation (dunkel)</div>
                  <div style={{background:"#0f172a",borderRadius:T.rSm,padding:"10px 16px",display:"flex",alignItems:"center"}}>
                    <img src={url} alt="Logo" style={{height:36,maxWidth:140,objectFit:"contain",display:"block"}}/>
                  </div>
                </div>
                <div>
                  <div style={{fontSize:".68rem",color:T.textMuted,marginBottom:4}}>Hell (Briefkopf etc.)</div>
                  <div style={{background:"#fff",borderRadius:T.rSm,padding:"10px 16px",display:"flex",alignItems:"center",border:`1px solid ${T.bg3}`}}>
                    <img src={url} alt="Logo" style={{height:36,maxWidth:140,objectFit:"contain",display:"block"}}/>
                  </div>
                </div>
              </div>
            </div>)}
            {!url&&(<div style={{background:T.bg,borderRadius:T.rSm,padding:"28px 16px",textAlign:"center",marginBottom:4}}>
              <div style={{fontSize:"1.8rem",marginBottom:6}}>"—"</div>
              <div style={{fontSize:".78rem",color:T.textMuted}}>Noch kein Logo hochgeladen</div>
            </div>)}
            <div style={{fontSize:".8rem",color:T.textMuted,marginTop:8,lineHeight:1.6}}>
              <strong style={{color:T.dark}}>Wichtig:</strong> Ihr Logo wird auf einem dunklen Hintergrund angezeigt. Am besten funktioniert ein PNG mit transparentem Hintergrund (mind. 400 {"\u00d7"} 150 px).
              <br/>Hat Ihr Logo einen farbigen Hintergrund? Entfernen Sie ihn kostenlos: <a href="https://www.remove.bg/de" target="_blank" rel="noopener noreferrer" style={{color:T.accent,fontWeight:600}}>remove.bg</a>
            </div>
          </div>
        );})()}
        {/* Hero-Bild */}
        {(()=>{const url=assetUrls["hero"];const busy=uploading["hero"];return(
          <div style={{background:"#fff",borderRadius:T.r,padding:"20px 24px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:url?16:0}}>
              <div>
                <div style={{fontWeight:700,fontSize:".9rem",color:T.dark,marginBottom:2}}>Hero-Bild <span style={{fontSize:".75rem",fontWeight:500,color:T.textMuted}}>(optional)</span></div>
                <div style={{fontSize:".78rem",color:T.textMuted}}>Hintergrundbild fuer den oberen Bereich der Website</div>
              </div>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <label style={{padding:"9px 18px",border:`2px solid ${T.bg3}`,borderRadius:T.rSm,background:busy?T.bg:"#fff",color:T.textSub,cursor:busy?"wait":"pointer",fontSize:".82rem",fontWeight:600,fontFamily:T.font,whiteSpace:"nowrap"}}>
                  {busy?"Lädt...":url?"Ersetzen":"Hochladen"}
                  <input type="file" accept="image/*" style={{display:"none"}} disabled={busy} onChange={e=>{if(e.target.files[0])upload("hero",e.target.files[0]);}}/>
                </label>
                {url&&<button onClick={()=>deleteAsset("hero")} disabled={deleting["hero"]} style={{padding:"9px 12px",border:"2px solid #fca5a5",borderRadius:T.rSm,background:"#fff",color:"#ef4444",cursor:deleting["hero"]?"wait":"pointer",fontSize:".82rem",fontWeight:700,fontFamily:T.font}}>{deleting["hero"]?"...":"\u00d7"}</button>}
              </div>
            </div>
            {url&&<div style={{borderRadius:T.rSm,overflow:"hidden",height:120,background:"#000",position:"relative"}}>
              <img src={url} alt="Hero" style={{width:"100%",height:"100%",objectFit:"cover",opacity:.8}}/>
              <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <span style={{color:"#fff",fontWeight:700,fontSize:".78rem",background:"rgba(0,0,0,.45)",padding:"4px 10px",borderRadius:4}}>Vorschau</span>
              </div>
            </div>}
            {!url&&<div style={{background:T.bg,borderRadius:T.rSm,padding:"20px 16px",textAlign:"center",marginTop:12}}>
              <div style={{fontSize:"1.6rem",marginBottom:4}}>"—"</div>
              <div style={{fontSize:".78rem",color:T.textMuted}}>Noch kein Hero-Bild hochgeladen – Farbverlauf bleibt aktiv</div>
            </div>}
            <div style={{fontSize:".8rem",color:T.textMuted,marginTop:8}}>Empfohlen: JPG, mind. 1920 &times; 1080 px. Das Bild wird mit einem dunklen Overlay versehen sodass der Text gut lesbar bleibt.</div>
          </div>
        );})()}
        {/* Fotos */}
        <div style={{background:"#fff",borderRadius:T.r,padding:"20px 24px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1}}>
          <div style={{fontSize:".8rem",fontWeight:700,color:T.dark,marginBottom:4}}>Ihre Fotos</div>
          <div style={{fontSize:".82rem",color:T.textSub,marginBottom:16}}>Laden Sie bis zu 5 Fotos hoch – Betriebsfotos, Team, Arbeitsproben, Atmosphäre. Sie entscheiden was passt.</div>
          <div className="pt-photo-grid" style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10}}>
            {ASSETS.slice(1).map(a=>{const url=assetUrls[a.key];const busy=uploading[a.key];return(
              <div key={a.key} style={{display:"flex",flexDirection:"column",gap:6}}>
                <div style={{aspectRatio:"1",borderRadius:T.rSm,background:url?"#000":T.bg,border:`1.5px dashed ${url?"transparent":T.bg3}`,overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
                  {url?<img src={url} alt={a.label} style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T.textMuted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg><span style={{fontSize:".72rem",color:T.textMuted,fontWeight:500}}>Foto</span></div>}
                </div>
                <div style={{display:"flex",gap:4}}>
                  <label style={{flex:1,display:"block",textAlign:"center",padding:"7px 0",border:`1.5px solid ${T.bg3}`,borderRadius:T.rSm,background:busy?T.bg:"#fff",color:T.textSub,cursor:busy?"wait":"pointer",fontSize:".75rem",fontWeight:600,fontFamily:T.font,minHeight:36,lineHeight:"22px"}}>
                    {busy?"Lädt...":url?"Ersetzen":"Hochladen"}
                    <input type="file" accept="image/*" style={{display:"none"}} disabled={busy} onChange={e=>{if(e.target.files[0])upload(a.key,e.target.files[0]);}}/>
                  </label>
                  {url&&<button onClick={()=>deleteAsset(a.key)} disabled={deleting[a.key]} style={{padding:"7px 8px",border:`1.5px solid #fca5a5`,borderRadius:T.rSm,background:"#fff",color:"#ef4444",cursor:deleting[a.key]?"wait":"pointer",fontSize:".75rem",fontWeight:700,fontFamily:T.font,minHeight:36}}>{deleting[a.key]?"...":"\u00d7"}</button>}
                </div>
              </div>
            );})}
          </div>
        </div>
        <div style={{padding:"14px 16px",background:T.accentLight,borderRadius:T.rSm,border:`1px solid rgba(143,163,184,.15)`,fontSize:".78rem",color:T.textSub}}>
          Empfohlen: JPG oder PNG, mindestens 1200px breit, max. 5 MB pro Foto.
        </div>
      </div>)}

      {/* Tab: Domain */}
      {tab==="seo"&&order?.status==="trial"&&(<div style={{background:"#fff",borderRadius:T.r,padding:"40px 32px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1,textAlign:"center"}}>
        <div style={{fontSize:"1.2rem",marginBottom:16,color:T.textMuted}}>⚿</div>
        <h2 style={{fontSize:"1.1rem",fontWeight:800,color:T.dark,margin:"0 0 8px"}}>SEO & Google ab aktivem Abo</h2>
        <p style={{fontSize:".88rem",color:T.textSub,lineHeight:1.65,marginBottom:20,maxWidth:340,margin:"0 auto 20px"}}>Google-Indexierung und SEO-Einstellungen sind nach dem Abo-Abschluss aktiv.</p>
        <button onClick={()=>setShowPlanModal(true)} style={{padding:"11px 24px",border:"none",borderRadius:T.rSm,background:T.accent,color:"#fff",cursor:"pointer",fontSize:".88rem",fontWeight:700,fontFamily:T.font}}>{"Jetzt abonnieren \u2192"}</button>
      </div>)}
      {tab==="seo"&&order?.status!=="trial"&&(<div style={{display:"flex",flexDirection:"column",gap:16}}>
        <div style={{background:"#fff",borderRadius:T.r,padding:"24px 28px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1}}>
          <div style={{fontSize:".8rem",fontWeight:700,color:T.dark,marginBottom:12}}>Google Indexierung</div>
          {order?.status==="live"
            ?<div style={{display:"flex",alignItems:"center",gap:12,padding:"14px 18px",background:T.greenLight,borderRadius:T.rSm,border:`1px solid rgba(22,163,74,.2)`}}>
              <span style={{fontSize:"1rem",color:T.green,fontWeight:800}}>✓</span>
              <div><div style={{fontWeight:700,color:T.green,fontSize:".9rem"}}>Ihre Website ist für Google sichtbar</div><div style={{fontSize:".82rem",color:T.textSub,marginTop:3}}>Google kann Ihre Website unter <strong>{sub}.siteready.at</strong> indexieren und in den Suchergebnissen anzeigen.</div></div>
            </div>
            :<div style={{display:"flex",alignItems:"center",gap:12,padding:"14px 18px",background:"#fef3c7",borderRadius:T.rSm,border:"1px solid #fcd34d"}}>
              <span style={{fontSize:"1rem",color:"#92400e",fontWeight:800}}>⏳</span>
              <div><div style={{fontWeight:700,color:"#92400e",fontSize:".9rem"}}>Indexierung aktiv nach Livegang</div><div style={{fontSize:".82rem",color:"#78350f",marginTop:3}}>Sobald Ihre Website live geschaltet wird, entfernen wir die noindex-Markierung und Google kann Ihre Website finden.</div></div>
            </div>
          }
        </div>
        {/* Website-Qualitaet */}
        {order?.quality_score!==null&&order?.quality_score!==undefined&&<div style={{background:"#fff",borderRadius:T.r,padding:"24px 28px",border:`1px solid ${T.bg3}`,boxShadow:T.sh2}}>
          <div style={{fontSize:".8rem",fontWeight:700,color:T.dark,marginBottom:16}}>Website-Qualität</div>
          <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:16}}>
            <div style={{width:56,height:56,borderRadius:"50%",background:order.quality_score>=80?T.greenLight:"#fef3c7",border:`2px solid ${order.quality_score>=80?"rgba(22,163,74,.2)":"#fcd34d"}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <span style={{fontSize:"1.1rem",fontWeight:800,fontFamily:T.mono,color:order.quality_score>=80?T.green:"#d97706"}}>{order.quality_score}</span>
            </div>
            <div>
              <div style={{fontSize:".9rem",fontWeight:700,color:T.dark}}>{order.quality_score>=90?"Ausgezeichnet":order.quality_score>=80?"Gut":"Verbesserungspotenzial"}</div>
              <div style={{fontSize:".82rem",color:T.textMuted,marginTop:2}}>{order.quality_score>=90?"Ihre Website ist optimal aufgestellt.":"Mit wenigen Schritten koennen Sie den Score verbessern."}</div>
            </div>
          </div>
          {order.quality_score<95&&<div style={{display:"flex",flexDirection:"column",gap:8}}>
            {!assetUrls.logo&&<div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:T.bg,borderRadius:T.rSm,border:`1px solid ${T.bg3}`}}>
              <span style={{fontSize:".8rem",color:"#d97706",fontWeight:700,flexShrink:0}}>+10</span>
              <span style={{fontSize:".82rem",color:T.dark}}>Logo hochladen</span>
              <button onClick={()=>setTab("medien")} style={{marginLeft:"auto",fontSize:".78rem",color:T.accent,background:"none",border:"none",cursor:"pointer",fontFamily:T.font,fontWeight:600}}>Jetzt {"\u2192"}</button>
            </div>}
            {!(assetUrls.foto1||assetUrls.foto2||assetUrls.foto3)&&<div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:T.bg,borderRadius:T.rSm,border:`1px solid ${T.bg3}`}}>
              <span style={{fontSize:".8rem",color:"#d97706",fontWeight:700,flexShrink:0}}>+10</span>
              <span style={{fontSize:".82rem",color:T.dark}}>Fotos hochladen</span>
              <button onClick={()=>setTab("medien")} style={{marginLeft:"auto",fontSize:".78rem",color:T.accent,background:"none",border:"none",cursor:"pointer",fontFamily:T.font,fontWeight:600}}>Jetzt {"\u2192"}</button>
            </div>}
            {!order.telefon&&<div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:T.bg,borderRadius:T.rSm,border:`1px solid ${T.bg3}`}}>
              <span style={{fontSize:".8rem",color:"#d97706",fontWeight:700,flexShrink:0}}>+5</span>
              <span style={{fontSize:".82rem",color:T.dark}}>Telefonnummer ergänzen</span>
              <button onClick={()=>{setTab("website");setEditSection("kontakt");}} style={{marginLeft:"auto",fontSize:".78rem",color:T.accent,background:"none",border:"none",cursor:"pointer",fontFamily:T.font,fontWeight:600}}>Jetzt {"\u2192"}</button>
            </div>}
            {!order.kurzbeschreibung&&<div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:T.bg,borderRadius:T.rSm,border:`1px solid ${T.bg3}`}}>
              <span style={{fontSize:".8rem",color:"#d97706",fontWeight:700,flexShrink:0}}>+5</span>
              <span style={{fontSize:".82rem",color:T.dark}}>Kurzbeschreibung hinzufügen</span>
              <button onClick={()=>{setTab("website");setEditSection("grunddaten");}} style={{marginLeft:"auto",fontSize:".78rem",color:T.accent,background:"none",border:"none",cursor:"pointer",fontFamily:T.font,fontWeight:600}}>Jetzt {"\u2192"}</button>
            </div>}
          </div>}
        </div>}
        <div style={{background:"#fff",borderRadius:T.r,padding:"24px 28px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1}}>
          <div style={{fontSize:".78rem",fontWeight:700,color:T.dark,marginBottom:8}}>Custom Domain & Google</div>
          <p style={{fontSize:".82rem",color:T.textSub,lineHeight:1.7,margin:0}}>Wenn Sie eine eigene Domain verbinden, kümmern wir uns auch um die Google-Indexierung für Ihre Domain. Schreiben Sie uns nach der DNS-Umstellung an <strong>support@siteready.at</strong>.</p>
        </div>
        {/* Seitenaufrufe Coming Soon */}
        <div style={{background:"#fff",borderRadius:T.r,padding:"24px 28px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
            <div style={{fontSize:".8rem",fontWeight:700,color:T.dark}}>Seitenaufrufe & Reichweite</div>
            <span style={{fontSize:".65rem",fontWeight:700,background:"linear-gradient(135deg,#7c3aed,#a855f7)",color:"#fff",padding:"3px 10px",borderRadius:4,letterSpacing:".06em"}}>Coming Soon</span>
          </div>
          <div style={{padding:"32px 20px",textAlign:"center",background:T.bg,borderRadius:T.rSm,border:`1px dashed ${T.bg3}`}}>
            <div style={{fontSize:"2rem",marginBottom:10}}>"—"</div>
            <div style={{fontSize:".9rem",fontWeight:700,color:T.dark,marginBottom:6}}>Analytics wird gerade vorbereitet</div>
            <div style={{fontSize:".82rem",color:T.textMuted,lineHeight:1.7,maxWidth:340,margin:"0 auto"}}>Seitenaufrufe, Besucher und Google-Klicks werden in einem zukuenftigen Update freigeschaltet.</div>
          </div>
        </div>
      </div>)}
      {tab==="domain"&&order?.status==="trial"&&(<div style={{background:"#fff",borderRadius:T.r,padding:"40px 32px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1,textAlign:"center"}}>
        <div style={{fontSize:"1.2rem",marginBottom:16,color:T.textMuted}}>⚿</div>
        <h2 style={{fontSize:"1.1rem",fontWeight:800,color:T.dark,margin:"0 0 8px"}}>Custom Domain ab aktivem Abo</h2>
        <p style={{fontSize:".88rem",color:T.textSub,lineHeight:1.65,marginBottom:20,maxWidth:340,margin:"0 auto 20px"}}>Verbinden Sie Ihre eigene Domain nachdem Sie ein Abo abgeschlossen haben.</p>
        <button onClick={()=>setShowPlanModal(true)} style={{padding:"11px 24px",border:"none",borderRadius:T.rSm,background:T.accent,color:"#fff",cursor:"pointer",fontSize:".88rem",fontWeight:700,fontFamily:T.font}}>Jetzt abonnieren \u2192</button>
      </div>)}
      {tab==="domain"&&order?.status!=="trial"&&(<div style={{background:"#fff",borderRadius:T.r,padding:"28px 32px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1}}>
        <div style={{fontSize:".8rem",fontWeight:700,color:T.dark,marginBottom:10}}>Custom Domain verbinden</div>
        <h2 style={{fontSize:"1.2rem",fontWeight:800,color:T.dark,margin:"0 0 8px"}}>Eigene Domain statt Subdomain</h2>
        <p style={{fontSize:".88rem",color:T.textSub,lineHeight:1.7,marginBottom:24}}>
          Aktuell ist Ihre Website unter <strong>{sub}.siteready.at</strong> erreichbar. Mit einer eigenen Domain (z.B. <strong>www.{sub}.at</strong>) erscheint Ihre Website noch professioneller.
        </p>
        <div style={{marginBottom:24}}>
          <div style={{fontSize:".82rem",fontWeight:700,color:T.dark,marginBottom:10}}>DNS-Einträge bei Ihrem Domain-Anbieter setzen:</div>
          <div style={{borderRadius:T.rSm,overflow:"hidden",border:`1px solid ${T.bg3}`}}>
            <div style={{display:"grid",gridTemplateColumns:"80px 100px 1fr",background:T.bg,padding:"10px 16px",fontSize:".75rem",fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:".06em",gap:16}}>
              <span>Typ</span><span>Name</span><span>Wert</span>
            </div>
            {[
              {typ:"CNAME",name:"www",wert:"sitereadyprototype.pages.dev"},
              {typ:"CNAME",name:"@",wert:"sitereadyprototype.pages.dev"},
            ].map((r,i)=><div key={i} style={{display:"grid",gridTemplateColumns:"80px 100px 1fr",padding:"12px 16px",fontSize:".84rem",gap:16,borderTop:`1px solid ${T.bg3}`,fontFamily:T.mono}}>
              <span style={{color:T.accent,fontWeight:700}}>{r.typ}</span>
              <span style={{color:T.dark}}>{r.name}</span>
              <span style={{color:T.textSub}}>{r.wert}</span>
            </div>)}
          </div>
        </div>
        <div style={{padding:"16px 20px",background:T.accentLight,borderRadius:T.rSm,border:`1px solid rgba(143,163,184,.15)`}}>
          <div style={{fontSize:".82rem",fontWeight:700,color:T.accent,marginBottom:4}}>Nach der DNS-Aenderung</div>
          <div style={{fontSize:".82rem",color:T.textSub,lineHeight:1.7}}>DNS-Änderungen dauern bis zu 48 Stunden. Sobald alles aktiv ist, schreiben Sie uns an <strong>support@siteready.at</strong> – wir schalten Ihre Domain frei.</div>
        </div>
      </div>)}
    </div>
  </div>);
}

/* ═══ MARKDOWN RENDERER (fuer Doku-Tab) ═══ */
function fmtInline(s){
  return s
    .replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>")
    .replace(/\*(.+?)\*/g,"<em>$1</em>")
    .replace(/`([^`]+)`/g,'<code style="background:#f1f5f9;padding:1px 5px;border-radius:3px;font-family:monospace;font-size:.85em">$1</code>');
}
function slugify(s){return"sec-"+s.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");}
function renderMd(md){
  if(!md)return'<p style="color:#94a3b8;font-style:italic">Kein Inhalt. Bearbeiten um Text hinzuzufuegen.</p>';
  const esc=s=>s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  const lines=md.split("\n");
  let html="";let inUl=false;
  for(const line of lines){
    if(line.startsWith("# ")){if(inUl){html+="</ul>";inUl=false;}html+=`<h1 style="font-size:1.4rem;font-weight:800;color:#0f172a;margin:28px 0 10px;padding-bottom:8px;border-bottom:2px solid #e2e8f0">${fmtInline(esc(line.slice(2)))}</h1>`;}
    else if(line.startsWith("## ")){if(inUl){html+="</ul>";inUl=false;}const _h2t=line.slice(3);html+=`<h2 id="${slugify(_h2t)}" style="font-size:1.05rem;font-weight:700;color:#0f172a;margin:20px 0 8px;padding-top:8px">${fmtInline(esc(_h2t))}</h2>`;}
    else if(line.startsWith("### ")){if(inUl){html+="</ul>";inUl=false;}html+=`<h3 style="font-size:.92rem;font-weight:700;color:#334155;margin:14px 0 6px">${fmtInline(esc(line.slice(4)))}</h3>`;}
    else if(line.match(/^[-*] /)){if(!inUl){html+='<ul style="margin:6px 0;padding-left:20px">';inUl=true;}html+=`<li style="margin:3px 0;color:#334155;font-size:.87rem;line-height:1.55">${fmtInline(esc(line.slice(2)))}</li>`;}
    else if(line.match(/^\d+\. /)){if(!inUl){html+='<ul style="margin:6px 0;padding-left:20px;list-style:decimal">';inUl=true;}html+=`<li style="margin:3px 0;color:#334155;font-size:.87rem;line-height:1.55">${fmtInline(esc(line.replace(/^\d+\. /,"")))}</li>`;}
    else if(line.trim()===""){if(inUl){html+="</ul>";inUl=false;}html+="<div style='height:6px'></div>";}
    else{if(inUl){html+="</ul>";inUl=false;}html+=`<p style="margin:3px 0;color:#334155;font-size:.87rem;line-height:1.6">${fmtInline(esc(line))}</p>`;}
  }
  if(inUl)html+="</ul>";
  return html;
}

/* ═══ BUILD SCREEN (eigene Komponente wg. React Hooks Regeln) ═══ */
function BuildScreen({session,setOrder}){
  const BUILD_PHASES=[
    {icon:"\uD83D\uDCCB",label:"Daten werden analysiert",sub:"Branche, Leistungen & Kontaktdaten",dur:6},
    {icon:"\u270D\uFE0F",label:"Texte werden geschrieben",sub:"\u00DCber uns, Leistungsbeschreibungen & SEO",dur:18},
    {icon:"\uD83C\uDFA8",label:"Design wird angewendet",sub:"Farben, Schriften & Layout",dur:12},
    {icon:"\uD83D\uDDBC\uFE0F",label:"Medien werden eingebaut",sub:"Logo, Fotos & Icons",dur:8},
    {icon:"\uD83D\uDD0D",label:"Qualit\u00E4tspr\u00FCfung",sub:"Performance, SEO & Rechtliches",dur:10},
    {icon:"\u2705",label:"Website wird ver\u00F6ffentlicht",sub:"DNS & SSL-Zertifikat",dur:6}
  ];
  const totalDur=BUILD_PHASES.reduce((s,p)=>s+p.dur,0);
  const [buildElapsed,setBuildElapsed]=useState(0);
  const buildRef=useRef(null);
  useEffect(()=>{
    buildRef.current=setInterval(()=>setBuildElapsed(e=>e+1),1000);
    return()=>clearInterval(buildRef.current);
  },[]);
  useEffect(()=>{
    if(buildElapsed>0&&buildElapsed%5===0){
      (async()=>{
        const{data}=await supabase.from("orders").select("*").eq("email",session.user.email).order("created_at",{ascending:false}).limit(1);
        if(data&&data[0]&&data[0].status!=="pending")setOrder(data[0]);
      })();
    }
  },[buildElapsed]);
  let acc=0;let activeIdx=0;
  for(let i=0;i<BUILD_PHASES.length;i++){acc+=BUILD_PHASES[i].dur;if(buildElapsed<acc){activeIdx=i;break;}if(i===BUILD_PHASES.length-1)activeIdx=i;}
  const progressPct=Math.min((buildElapsed/totalDur)*100,95);
  return(<div style={{background:"#fff",borderRadius:T.r,padding:"48px 36px",border:`1px solid ${T.bg3}`,boxShadow:T.sh2,marginBottom:28}}>
    <div style={{textAlign:"center",marginBottom:32}}>
      <div style={{fontSize:"2.2rem",marginBottom:12}}>{BUILD_PHASES[activeIdx].icon}</div>
      <h2 style={{fontSize:"1.2rem",fontWeight:800,color:T.dark,margin:"0 0 6px"}}>{BUILD_PHASES[activeIdx].label}</h2>
      <p style={{fontSize:".85rem",color:T.textSub,margin:0}}>{BUILD_PHASES[activeIdx].sub}</p>
    </div>
    <div style={{background:T.bg3,borderRadius:100,height:8,overflow:"hidden",marginBottom:28,maxWidth:480,margin:"0 auto 28px"}}>
      <div style={{height:"100%",borderRadius:100,background:`linear-gradient(90deg, ${T.accent}, #6366f1)`,width:`${progressPct}%`,transition:"width 1s ease"}}/>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(130px, 1fr))",gap:8,maxWidth:600,margin:"0 auto"}}>
      {BUILD_PHASES.map((p,i)=>{
        const done=i<activeIdx;const active=i===activeIdx;
        return(<div key={i} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,padding:"10px 6px",borderRadius:T.rSm,background:active?`${T.accent}08`:"transparent",border:active?`1px solid ${T.accent}22`:"1px solid transparent",transition:"all .3s"}}>
          <div style={{fontSize:"1.1rem",opacity:done||active?1:.35,filter:done?"grayscale(0)":active?"grayscale(0)":"grayscale(1)"}}>{p.icon}</div>
          <div style={{fontSize:".75rem",fontWeight:active?700:500,color:done?T.green:active?T.accent:T.textMuted,textAlign:"center",lineHeight:1.3}}>{p.label.replace("werden ","")}</div>
          {done&&<div style={{fontSize:".75rem",color:T.green,fontWeight:700}}>{"\u2713"}</div>}
          {active&&<div style={{width:12,height:12,borderRadius:"50%",border:`2px solid ${T.accent}`,borderTopColor:"transparent",animation:"spin 1s linear infinite"}}/>}
        </div>);
      })}
    </div>
    <p style={{textAlign:"center",fontSize:".75rem",color:T.textMuted,marginTop:24}}>Status wird automatisch aktualisiert</p>
  </div>);
}

/* ═══ ADMIN DASHBOARD ═══ */
const STATUS_LABELS={pending:"Eingang",in_arbeit:"In Generierung",trial:"Testphase",live:"Live",offline:"Offline"};
const STATUS_COLORS={pending:"#f59e0b",in_arbeit:"#3b82f6",trial:"#8b5cf6",live:"#16a34a",offline:"#64748b"};
const STATUS_FLOW=["pending","in_arbeit","trial","live"];

function StatusBadge({status}){const c=STATUS_COLORS[status]||T.textMuted;return(<span style={{display:"inline-block",padding:"3px 10px",borderRadius:4,background:c+"22",color:c,fontSize:".72rem",fontWeight:700,letterSpacing:".06em",textTransform:"uppercase"}}>{STATUS_LABELS[status]||status}</span>);}

const DESKTOP_ONLY_TABS=["support","system","kosten","arch-system","arch-flows","docs"];

function Admin({adminKey}){
  const[tab,setTab]=useState("start");
  const[isMobile]=useState(typeof window!=="undefined"&&window.innerWidth<768);
  const[orders,setOrders]=useState([]);
  const[tickets,setTickets]=useState([]);
  const[filter,setFilter]=useState("alle");
  const[sel,setSel]=useState(null);
  const[health,setHealth]=useState({});
  const[healthCountdown,setHealthCountdown]=useState(60);
  const[loading,setLoading]=useState(true);
  const[sysStatus,setSysStatus]=useState(null);
  const[sysLoading,setSysLoading]=useState(false);
  const[extStatus,setExtStatus]=useState({anthropic:null,cloudflare:null,supabase:null});
  const[notiz,setNotiz]=useState({});
  const[notizSaved,setNotizSaved]=useState({});
  const[genLoading,setGenLoading]=useState({});
  const[genMsg,setGenMsg]=useState({});
  const[search,setSearch]=useState("");
  const[healthTime,setHealthTime]=useState({});
  const[healthMs,setHealthMs]=useState({});
  const[healthFilter,setHealthFilter]=useState("alle");
  const[zahlungFilter,setZahlungFilter]=useState("alle");
  const[copied,setCopied]=useState(null);
  const[deleteConfirm,setDeleteConfirm]=useState(null);
  const[regenConfirm,setRegenConfirm]=useState(null);
  const[offlineConfirm,setOfflineConfirm]=useState(null);
  const[orderLogs,setOrderLogs]=useState({});
  const[logsLoading,setLogsLoading]=useState({});
  const[showProzess,setShowProzess]=useState(false);
  const[siteConfig,setSiteConfig]=useState({});
  const[showStatusOverride,setShowStatusOverride]=useState(false);
  const[ticketFormOpen,setTicketFormOpen]=useState(false);
  const[ticketForm,setTicketForm]=useState({email:"",subject:"",message:""});
  const[ticketSaving,setTicketSaving]=useState(false);
  const[editKunde,setEditKunde]=useState(null);
  const[docs,setDocs]=useState([]);
  const[docsLoading,setDocsLoading]=useState(false);
  const[selDocId,setSelDocId]=useState(null);
  const[docEditing,setDocEditing]=useState(false);
  const[docEditTitle,setDocEditTitle]=useState("");
  const[docEditContent,setDocEditContent]=useState("");
  const[docSaving,setDocSaving]=useState(false);
  /* Diagnose State */
  const[diagReport,setDiagReport]=useState(null);
  const[diagRunning,setDiagRunning]=useState(false);
  /* Error Logs */
  const[errorLogs,setErrorLogs]=useState([]);
  const[errorLogsLoading,setErrorLogsLoading]=useState(false);
  const fetchErrorLogs=async()=>{
    if(!supabase)return;
    setErrorLogsLoading(true);
    try{
      const{data}=await supabase.from("error_logs").select("*").order("created_at",{ascending:false}).limit(50);
      if(data)setErrorLogs(data);
    }catch(e){/* silent */}
    setErrorLogsLoading(false);
  };
  const clearErrorLogs=async()=>{
    if(!supabase)return;
    await supabase.from("error_logs").delete().neq("id","00000000-0000-0000-0000-000000000000");
    setErrorLogs([]);
  };

  useEffect(()=>{load();checkSystem();},[]);

  const load=async()=>{
    setLoading(true);
    const r=await fetch(`/api/admin-data?key=${adminKey}`);
    const j=await r.json();
    if(j.orders){setOrders(j.orders);const n={};j.orders.forEach(o=>{n[o.id]=o.notiz||""});setNotiz(n);}
    if(j.tickets)setTickets(j.tickets);
    setLoading(false);
  };

  const updateOrder=async(id,fields)=>{
    await fetch(`/api/admin-update?key=${adminKey}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id,...fields})});
    setOrders(os=>os.map(o=>o.id===id?{...o,...fields}:o));
    setSel(s=>s?.id===id?{...s,...fields}:s);
  };

  const deleteOrder=async(id)=>{
    await fetch(`/api/admin-delete?key=${adminKey}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id})});
    setOrders(os=>os.filter(o=>o.id!==id));
    setDeleteConfirm(null);
    setSel(null);
  };

  const createTicket=async()=>{
    if(!ticketForm.email||!ticketForm.message)return;
    setTicketSaving(true);
    await supabase.from("support_requests").insert({email:ticketForm.email,subject:ticketForm.subject||"Admin-Ticket",message:ticketForm.message,status:"offen"});
    setTicketSaving(false);setTicketFormOpen(false);
    const sub=ticketForm.subject||"Admin-Ticket";const em=ticketForm.email;
    setTicketForm({email:"",subject:"",message:""});
    load();
    const relOrd=orders.find(o=>o.email&&em&&o.email.toLowerCase()===em.toLowerCase());
    if(relOrd)logActivity(relOrd.id,"ticket_created",{subject:sub});
  };
  const updateTicket=async(id,fields)=>{
    await fetch(`/api/admin-update?key=${adminKey}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id,table:"support_requests",...fields})});
    setTickets(ts=>ts.map(t=>t.id===id?{...t,...fields}:t));
    if(fields.status==="beantwortet"){
      const t=tickets.find(tt=>tt.id===id);
      if(t){const relOrd=orders.find(o=>o.email&&t.email&&o.email.toLowerCase()===t.email.toLowerCase());if(relOrd)logActivity(relOrd.id,"ticket_answered",{subject:t.subject});}
    }
  };

  const loadLogs=async(orderId)=>{
    if(!orderId||!adminKey)return;
    setLogsLoading(l=>({...l,[orderId]:true}));
    try{const r=await fetch(`/api/log-activity?key=${adminKey}&order_id=${orderId}`);const data=await r.json();setOrderLogs(l=>({...l,[orderId]:Array.isArray(data)?data:[]}));}catch(e){}
    setLogsLoading(l=>({...l,[orderId]:false}));
  };

  const logActivity=async(orderId,action,details,actor)=>{
    if(!orderId||!adminKey)return;
    try{
      await fetch(`/api/log-activity?key=${adminKey}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({order_id:orderId,action,details:details||null,actor:actor||"admin"})});
      loadLogs(orderId);
    }catch(e){}
  };

  const saveNotiz=async(id)=>{
    await updateOrder(id,{notiz:notiz[id]});
    setNotizSaved(s=>({...s,[id]:true}));
    setTimeout(()=>setNotizSaved(s=>({...s,[id]:false})),2000);
  };

  const nextStatus=s=>{const i=STATUS_FLOW.indexOf(s);return i<STATUS_FLOW.length-1?STATUS_FLOW[i+1]:s;};

  const generateWebsite=async(id)=>{
    setGenLoading(g=>({...g,[id]:true}));
    setGenMsg(m=>({...m,[id]:""}));
    try{
      const r=await fetch(`/api/generate-website?key=${adminKey}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({order_id:id})});
      const j=await r.json();
      if(j.ok){
        const wasFirst=!orders.find(o=>o.id===id)?.website_html;
        setGenMsg(m=>({...m,[id]:"Website erstellt! Status: live"}));
        await load();
        setSel(s=>s?.id===id?{...s,status:"live",subdomain:j.subdomain}:s);
        logActivity(id,wasFirst?"website_generated":"website_regenerated");
      } else {
        setGenMsg(m=>({...m,[id]:"Fehler: "+(j.error||"Unbekannt")}));
      }
    }catch(e){
      setGenMsg(m=>({...m,[id]:"Netzwerkfehler: "+e.message}));
    }
    setGenLoading(g=>({...g,[id]:false}));
  };

  const exportCSV=()=>{
    const headers=["ID","Datum","Firma","E-Mail","Branche","Status","PLZ","Ort","Telefon","Unternehmensform","UID","Subdomain"];
    const rows=filtered.map(o=>[o.id,fmtDate(o.created_at),o.firmenname||"",o.email||"",o.branche_label||o.branche||"",STATUS_LABELS[o.status]||o.status||"",o.plz||"",o.ort||"",o.telefon||"",o.unternehmensform||"",o.uid_nummer||"",o.subdomain||""]);
    const csv=[headers,...rows].map(r=>r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(",")).join("\n");
    const blob=new Blob(["\uFEFF"+csv],{type:"text/csv;charset=utf-8;"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");a.href=url;a.download=`siteready-bestellungen-${new Date().toISOString().slice(0,10)}.csv`;a.click();URL.revokeObjectURL(url);
  };

  const healthTicketSent=useRef({});
  const checkHealth=async(order)=>{
    const url=`https://sitereadyprototype.pages.dev/s/${order.subdomain||"test"}`;
    setHealth(h=>({...h,[order.id]:"checking"}));
    const t0=Date.now();
    try{await fetch(url,{mode:"no-cors",signal:AbortSignal.timeout(5000)});const ms=Date.now()-t0;setHealth(h=>({...h,[order.id]:"ok"}));setHealthMs(m=>({...m,[order.id]:ms}));delete healthTicketSent.current[order.id];}
    catch(e){
      const ms=Date.now()-t0;setHealth(h=>({...h,[order.id]:"error"}));setHealthMs(m=>({...m,[order.id]:ms}));
      // Auto-Ticket erstellen (max 1x pro Website pro Session)
      if(supabase&&!healthTicketSent.current[order.id]){
        healthTicketSent.current[order.id]=true;
        try{await supabase.from("support_requests").insert({email:"system@siteready.at",subject:`[Auto] Website nicht erreichbar: ${order.firmenname||order.subdomain}`,message:`${order.subdomain}.siteready.at ist nicht erreichbar.\n\nOrder: ${order.id}\nFirma: ${order.firmenname||"unbekannt"}\nStatus: ${order.status}`,status:"offen"});}catch(_){}
      }
    }
    setHealthTime(t=>({...t,[order.id]:new Date()}));
  };

  const filtered=orders.filter(o=>filter==="alle"||o.status===filter);
  const fmtDate=s=>s?new Date(s).toLocaleDateString("de-AT",{day:"2-digit",month:"2-digit",year:"numeric"}):"";
  const[sysLastCheck,setSysLastCheck]=useState(null);
  const sysTicketSent=useRef({});
  const checkSystem=async()=>{
    setSysLoading(true);
    const r=await fetch(`/api/admin-system?key=${adminKey}`);
    const j=await r.json();
    setSysStatus(j);setSysLastCheck(new Date());setSysLoading(false);
    // Auto-Ticket bei API-Ausfall (max 1x pro API pro Session)
    if(supabase&&j){
      for(const[k,v] of Object.entries(j)){
        if(k==="envvars"||k==="anthropic")continue;
        if(v&&v.ok===false&&!sysTicketSent.current[k]){
          sysTicketSent.current[k]=true;
          try{await supabase.from("support_requests").insert({email:"system@siteready.at",subject:`[Auto] API nicht erreichbar: ${k}`,message:`Die ${k} API antwortet mit einem Fehler.\n\n${v.error||"Unbekannter Fehler"}\n\nZeitpunkt: ${new Date().toISOString()}`,status:"offen"});}catch(_){}
        }
        if(v&&v.ok===true)delete sysTicketSent.current[k];
      }
    }
  };
  const fetchExtStatus=async()=>{
    try{
      const r=await fetch(`/api/ext-status?key=${adminKey}`);
      const j=await r.json();
      setExtStatus({
        anthropic:j.anthropic||false,
        cloudflare:j.cloudflare||false,
        supabase:j.supabase||false,
        stripe:j.stripe||false,
      });
    }catch(e){setExtStatus({anthropic:false,cloudflare:false,supabase:false,stripe:false});}
  };
  useEffect(()=>{if(tab==="system"){checkSystem();fetchExtStatus();fetchErrorLogs();const iv=setInterval(()=>{checkSystem();fetchExtStatus();fetchErrorLogs();},60000);return()=>clearInterval(iv);}},[tab]);
  useEffect(()=>{
    if(tab==="sites"){
      const run=()=>{orders.filter(o=>o.subdomain&&["live","trial"].includes(o.status)).forEach(o=>checkHealth(o));setHealthCountdown(60);};
      run();
      const iv=setInterval(run,60000);
      const cd=setInterval(()=>setHealthCountdown(c=>c>0?c-1:0),1000);
      return()=>{clearInterval(iv);clearInterval(cd);};
    }
  },[tab]);
  useEffect(()=>{if(tab==="docs")loadDocs();},[tab]);
  useEffect(()=>{setEditKunde(null);setDiagReport(null);},[sel]);
  useEffect(()=>{if(sel?.id)loadLogs(sel.id);},[sel?.id]);

  const loadDocs=async()=>{
    setDocsLoading(true);
    const r=await fetch(`/api/admin-docs?key=${adminKey}`);
    const j=await r.json();
    if(Array.isArray(j)){setDocs(j);if(j.length&&!selDocId)setSelDocId(j[0].id);}
    setDocsLoading(false);
  };
  const saveDoc=async()=>{
    setDocSaving(true);
    const id=docs[0]?.id;
    if(!id){setDocSaving(false);return;}
    const body={id,title:docEditTitle,content:docEditContent};
    await fetch(`/api/admin-docs?key=${adminKey}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
    setDocs(ds=>ds.map(d=>d.id===id?{...d,...body}:d));
    setDocEditing(false);setDocSaving(false);
  };
  const newDoc=()=>{
    setSelDocId(null);setDocEditTitle("Neue Sektion");setDocEditContent("");setDocEditing(true);
  };
  const deleteDoc=async(id)=>{
    if(!window.confirm("Sektion loeschen?"))return;
    await fetch(`/api/admin-docs?key=${adminKey}`,{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({id})});
    const remaining=docs.filter(d=>d.id!==id);
    setDocs(remaining);
    setSelDocId(remaining.length?remaining[0].id:null);
    setDocEditing(false);
  };
  const exportMD=()=>{
    const content=docs[0]?.content||"";
    const a=document.createElement("a");
    a.href=URL.createObjectURL(new Blob([content],{type:"text/markdown"}));
    a.download="siteready-dokumentation.md";a.click();
  };
  const exportPDF=()=>{
    const w=window.open("","_blank");
    w.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>SiteReady Dokumentation</title><style>body{font-family:system-ui,sans-serif;max-width:800px;margin:40px auto;padding:0 32px;color:#1e293b}h1{font-size:1.4rem;font-weight:800;margin:32px 0 10px;padding-bottom:8px;border-bottom:2px solid #e2e8f0}h2{font-size:1.05rem;font-weight:700;margin:20px 0 8px}h3{font-size:.92rem;font-weight:700;margin:14px 0 6px;color:#334155}p,li{font-size:.9rem;line-height:1.6;color:#334155;margin:3px 0}ul,ol{padding-left:20px;margin:6px 0}code{background:#f1f5f9;padding:1px 4px;border-radius:3px;font-family:monospace;font-size:.85em}@media print{body{margin:20px auto}}</style></head><body>${renderMd(docs[0]?.content||"")}</body></html>`);
    w.document.close();setTimeout(()=>w.print(),300);
  };
  const printTabHTML=(id,title)=>{
    const el=document.getElementById(id);
    if(!el)return;
    const w=window.open("","_blank");
    w.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>SiteReady – ${title}</title><style>*{box-sizing:border-box}body{font-family:system-ui,sans-serif;max-width:960px;margin:32px auto;padding:0 24px;color:#1e293b;font-size:.82rem}h1,h2{font-weight:800;color:#1e293b}button{display:none!important}@media print{body{margin:16px auto}}</style></head><body>${el.innerHTML}</body></html>`);
    w.document.close();setTimeout(()=>w.print(),400);
  };
  /* ═══ DIAGNOSE LOGIC ═══ */
  const diagnoseOrder=async(order)=>{
    setDiagRunning(true);setDiagReport(null);
    const issues=[];
    const info=[];
    /* Status-Analyse */
    const ageMin=Math.round((Date.now()-new Date(order.created_at).getTime())/60000);
    const ageStr=ageMin<60?`${ageMin} Min`:`${Math.round(ageMin/60)}h ${ageMin%60}m`;
    info.push({label:"Erstellt vor",value:ageStr});
    info.push({label:"Status",value:STATUS_LABELS[order.status]||order.status});
    if(order.status==="pending"&&ageMin>5)issues.push({severity:"error",msg:`Status "pending" seit ${ageStr} – Website-Generierung hat vermutlich nie gestartet`});
    if(order.status==="in_arbeit"&&ageMin>30)issues.push({severity:"error",msg:`Generierung laeuft seit ${ageStr} – haengt vermutlich`});
    /* Daten-Vollstaendigkeit */
    if(!order.email)issues.push({severity:"error",msg:"Keine E-Mail-Adresse – Kunde nicht kontaktierbar"});
    if(!order.firmenname)issues.push({severity:"warn",msg:"Kein Firmenname eingetragen"});
    if(!order.telefon)issues.push({severity:"warn",msg:"Keine Telefonnummer"});
    if(!order.adresse&&!order.plz)issues.push({severity:"warn",msg:"Keine Adresse/PLZ"});
    if(!order.leistungen||order.leistungen.length===0)issues.push({severity:"warn",msg:"Keine Leistungen ausgewaehlt"});
    /* Website-Status */
    if(order.subdomain&&["live","trial"].includes(order.status)){
      info.push({label:"URL",value:`${order.subdomain}.siteready.at`});
      try{
        const t0=Date.now();
        const r=await fetch(`https://sitereadyprototype.pages.dev/s/${order.subdomain}`,{signal:AbortSignal.timeout(5000)});
        const ms=Date.now()-t0;
        info.push({label:"Ladezeit",value:`${ms}ms`});
        if(!r.ok)issues.push({severity:"error",msg:`Website antwortet mit HTTP ${r.status}`});
      }catch(e){issues.push({severity:"error",msg:"Website nicht erreichbar: "+e.message});}
    }else if(order.status==="live"&&!order.subdomain){
      issues.push({severity:"error",msg:"Status 'live' aber keine Subdomain – Website kann nicht aufgerufen werden"});
    }
    /* Zahlung */
    if(order.status==="live"&&!order.stripe_customer_id)issues.push({severity:"warn",msg:"Live aber kein Stripe-Kunde verknuepft"});
    if(order.stripe_customer_id&&["pending","in_arbeit"].includes(order.status)&&ageMin>120)issues.push({severity:"error",msg:"Bezahlt aber Website noch nicht generiert"});
    /* Trial */
    if(order.status==="trial"){
      const exp=order.trial_expires_at||(order.created_at?new Date(new Date(order.created_at).getTime()+7*24*60*60*1000).toISOString():null);
      const tl=exp?Math.ceil((new Date(exp)-Date.now())/(1000*60*60*24)):999;
      info.push({label:"Trial",value:tl>0?`${tl} Tage verbleibend`:"Abgelaufen"});
      if(tl<=0)issues.push({severity:"error",msg:"Trial abgelaufen"});
      else if(tl<=2)issues.push({severity:"warn",msg:`Trial laeuft in ${tl} Tag(en) ab`});
    }
    /* Activity Logs */
    const logs=orderLogs[order.id]||[];
    info.push({label:"Aktivitaeten",value:logs.length>0?`${logs.length} Eintraege`:"Keine Logs"});
    if(logs.length===0&&ageMin>5)issues.push({severity:"warn",msg:"Keine Activity-Logs vorhanden – kein Prozess-Schritt wurde protokolliert"});
    /* Quality Score */
    if(order.quality_score!==null&&order.quality_score!==undefined){
      info.push({label:"Quality-Score",value:`${order.quality_score}/100`});
      if(order.quality_score<80)issues.push({severity:"warn",msg:`Quality-Score ${order.quality_score}/100 – Website pruefen`});
      if(order.quality_issues&&Array.isArray(order.quality_issues)&&order.quality_issues.length>0)
        issues.push({severity:"warn",msg:`Qualitaetsprobleme: ${order.quality_issues.join(", ")}`});
    }
    /* Fehler */
    if(order.last_error)issues.push({severity:"error",msg:`Letzter Fehler: ${order.last_error}`});
    /* Ergebnis */
    if(issues.length===0)issues.push({severity:"ok",msg:"Keine Probleme erkannt"});
    setDiagReport({issues,info});
    setDiagRunning(false);
  };

  const analyzeWebsite=async(order)=>{
    const url=`https://sitereadyprototype.pages.dev/s/${order.subdomain}`;
    const checks={seo:[],inhalt:[],technik:[],accessibility:[]};
    let html="";let loadMs=0;let httpOk=false;
    try{
      const t0=Date.now();
      const r=await fetch(url);
      loadMs=Date.now()-t0;
      httpOk=r.ok;
      html=await r.text();
    }catch(e){
      checks.technik.push({label:"Website erreichbar",ok:false,detail:"Nicht erreichbar: "+e.message,severity:"error"});
      return{order,checks,score:0,loadMs:0,httpOk:false};
    }
    const doc=new DOMParser().parseFromString(html,"text/html");
    /* SEO */
    const title=doc.querySelector("title")?.textContent||"";
    checks.seo.push({label:"Titel vorhanden",ok:!!title,detail:title?`"${title.slice(0,60)}" (${title.length} Zeichen)`:"Kein <title> gefunden",severity:title?"ok":"error"});
    if(title)checks.seo.push({label:"Titel-Laenge optimal (50-60 Z.)",ok:title.length>=50&&title.length<=60,detail:`${title.length} Zeichen`,severity:title.length>=40&&title.length<=65?"ok":"warn"});
    const desc=doc.querySelector('meta[name="description"]')?.getAttribute("content")||"";
    checks.seo.push({label:"Meta-Description vorhanden",ok:!!desc,detail:desc?`${desc.length} Zeichen`:"Keine Description",severity:desc?"ok":"error"});
    if(desc)checks.seo.push({label:"Description-Laenge (120-155 Z.)",ok:desc.length>=120&&desc.length<=155,detail:`${desc.length} Zeichen`,severity:desc.length>=100&&desc.length<=160?"ok":"warn"});
    const ogTitle=doc.querySelector('meta[property="og:title"]');
    checks.seo.push({label:"OG-Tags vorhanden",ok:!!ogTitle,detail:ogTitle?"og:title gesetzt":"Keine Open Graph Tags",severity:ogTitle?"ok":"warn"});
    const h1s=doc.querySelectorAll("h1");
    checks.seo.push({label:"Genau eine H1-Ueberschrift",ok:h1s.length===1,detail:`${h1s.length} H1-Tag(s) gefunden`,severity:h1s.length===1?"ok":h1s.length===0?"error":"warn"});
    const imgs=doc.querySelectorAll("img");
    const imgsNoAlt=[...imgs].filter(i=>!i.getAttribute("alt"));
    checks.seo.push({label:"Bilder mit Alt-Text",ok:imgsNoAlt.length===0,detail:imgs.length===0?"Keine Bilder":`${imgs.length-imgsNoAlt.length}/${imgs.length} haben Alt-Text`,severity:imgsNoAlt.length===0?"ok":"warn"});
    /* Inhalt */
    const hasPhone=html.includes("tel:")||/\+?\d[\d\s\-\/]{6,}/.test(html);
    checks.inhalt.push({label:"Telefonnummer vorhanden",ok:hasPhone,detail:hasPhone?"Gefunden":"Keine Telefonnummer erkannt",severity:hasPhone?"ok":"warn"});
    const hasEmail=html.includes("mailto:")||/[\w.-]+@[\w.-]+\.\w{2,}/.test(html);
    checks.inhalt.push({label:"E-Mail-Adresse vorhanden",ok:hasEmail,detail:hasEmail?"Gefunden":"Keine E-Mail erkannt",severity:hasEmail?"ok":"warn"});
    const hasAddr=/\d{4}\s+\w/.test(html)||html.toLowerCase().includes("adresse");
    checks.inhalt.push({label:"Adresse vorhanden",ok:hasAddr,detail:hasAddr?"Gefunden":"Keine Adresse erkannt",severity:hasAddr?"ok":"warn"});
    const hasForm=doc.querySelector("form")!==null;
    checks.inhalt.push({label:"Kontaktformular vorhanden",ok:hasForm,detail:hasForm?"Formular gefunden":"Kein Formular",severity:hasForm?"ok":"error"});
    const hasImpressum=html.includes("/legal")||html.toLowerCase().includes("impressum");
    checks.inhalt.push({label:"Impressum-Link vorhanden",ok:hasImpressum,detail:hasImpressum?"Verlinkt":"Kein Impressum-Link gefunden",severity:hasImpressum?"ok":"error"});
    const hasDatenschutz=html.includes("/legal")||html.toLowerCase().includes("datenschutz");
    checks.inhalt.push({label:"Datenschutz-Link vorhanden",ok:hasDatenschutz,detail:hasDatenschutz?"Verlinkt":"Kein Datenschutz-Link gefunden",severity:hasDatenschutz?"ok":"error"});
    const sections=doc.querySelectorAll("section, [id]");
    checks.inhalt.push({label:"Sektionen strukturiert",ok:sections.length>=3,detail:`${sections.length} Sektionen/IDs gefunden`,severity:sections.length>=3?"ok":"warn"});
    /* Technik */
    checks.technik.push({label:"Website erreichbar",ok:httpOk,detail:httpOk?`HTTP OK`:"HTTP-Fehler",severity:httpOk?"ok":"error"});
    checks.technik.push({label:"Ladezeit unter 2 Sekunden",ok:loadMs<2000,detail:`${loadMs}ms`,severity:loadMs<1000?"ok":loadMs<2000?"warn":"error"});
    const viewport=doc.querySelector('meta[name="viewport"]');
    checks.technik.push({label:"Viewport-Meta gesetzt",ok:!!viewport,detail:viewport?"Vorhanden":"Fehlt — nicht mobile-optimiert",severity:viewport?"ok":"error"});
    const charset=doc.querySelector('meta[charset]')||html.includes("charset=");
    checks.technik.push({label:"Charset definiert",ok:!!charset,detail:charset?"UTF-8":"Kein Charset",severity:charset?"ok":"warn"});
    const brokenImgs=[...imgs].filter(i=>{const s=i.getAttribute("src");return !s||s==="undefined"||s==="null";});
    checks.technik.push({label:"Keine kaputten Bild-URLs",ok:brokenImgs.length===0,detail:brokenImgs.length===0?"Alle Quellen OK":`${brokenImgs.length} kaputte Bild-URL(s)`,severity:brokenImgs.length===0?"ok":"error"});
    const https=url.startsWith("https");
    checks.technik.push({label:"HTTPS aktiv",ok:https,detail:https?"Ja":"Kein HTTPS",severity:https?"ok":"error"});
    /* Accessibility */
    const lang=doc.documentElement.getAttribute("lang");
    checks.accessibility.push({label:"Lang-Attribut gesetzt",ok:!!lang,detail:lang?`lang="${lang}"`:"Fehlt — Screenreader-Problem",severity:lang?"ok":"warn"});
    const headings=[...doc.querySelectorAll("h1,h2,h3,h4,h5,h6")];
    const headingOrder=headings.every((h,i)=>{if(i===0)return true;const prev=parseInt(headings[i-1].tagName[1]);const cur=parseInt(h.tagName[1]);return cur<=prev+1;});
    checks.accessibility.push({label:"Heading-Hierarchie logisch",ok:headingOrder,detail:headingOrder?"Korrekte Reihenfolge":"Spruenge in der Ueberschrift-Hierarchie",severity:headingOrder?"ok":"warn"});
    const links=doc.querySelectorAll("a");
    const emptyLinks=[...links].filter(a=>!a.textContent.trim()&&!a.getAttribute("aria-label")&&!a.querySelector("img"));
    checks.accessibility.push({label:"Links mit Text/Label",ok:emptyLinks.length===0,detail:emptyLinks.length===0?"Alle Links haben Text":`${emptyLinks.length} Link(s) ohne Text`,severity:emptyLinks.length===0?"ok":"warn"});
    const btns=doc.querySelectorAll("button,input[type='submit']");
    const emptyBtns=[...btns].filter(b=>!b.textContent.trim()&&!b.getAttribute("aria-label"));
    checks.accessibility.push({label:"Buttons mit Text/Label",ok:emptyBtns.length===0,detail:emptyBtns.length===0?"Alle Buttons haben Text":`${emptyBtns.length} Button(s) ohne Text`,severity:emptyBtns.length===0?"ok":"warn"});
    /* Score berechnen */
    const allChecks=[...checks.seo,...checks.inhalt,...checks.technik,...checks.accessibility];
    const total=allChecks.length;
    const passed=allChecks.filter(c=>c.ok).length;
    const score=Math.round((passed/total)*100);
    return{order,checks,score,loadMs,httpOk};
  };

  const stuckOrders=orders.filter(o=>o.status==="pending"&&Date.now()-new Date(o.created_at).getTime()>2*60*60*1000);
  const regenBadge=stuckOrders.length||null;
  const alerts=[];
  if(sysStatus?.anthropic?.billing)alerts.push({type:"error",msg:"Claude Guthaben aufgebraucht – keine Generierung möglich!",tab:"system"});
  else if(sysStatus?.anthropic&&!sysStatus.anthropic.ok)alerts.push({type:"warn",msg:"Anthropic API nicht erreichbar"+(sysStatus.anthropic.error?" – "+sysStatus.anthropic.error:""),tab:"system"});
  if(stuckOrders.length)alerts.push({type:"warn",msg:`${stuckOrders.length} Bestellung${stuckOrders.length>1?"en":""} seit >2h in Generierung – bitte pruefen`,tab:"sites"});
  /* Daten-Check Alerts */
  const expiredTrials=orders.filter(o=>{if(o.status!=="trial")return false;const exp=o.trial_expires_at||(o.created_at?new Date(new Date(o.created_at).getTime()+7*24*60*60*1000).toISOString():null);return exp&&new Date(exp)<new Date();});
  if(expiredTrials.length)alerts.push({type:"warn",msg:`${expiredTrials.length} Trial${expiredTrials.length>1?"s":""} abgelaufen`,tab:"sites"});
  const liveNoSub=orders.filter(o=>o.status==="live"&&!o.subdomain);
  if(liveNoSub.length)alerts.push({type:"error",msg:`${liveNoSub.length} Live-Website${liveNoSub.length>1?"s":""} ohne Subdomain`,tab:"sites"});
  const failedOrders=orders.filter(o=>o.last_error);
  if(failedOrders.length)alerts.push({type:"error",msg:`${failedOrders.length} Bestellung${failedOrders.length>1?"en":""} mit Fehler`,tab:"sites"});
  const lowQuality=orders.filter(o=>o.quality_score!==null&&o.quality_score!==undefined&&o.quality_score<80);
  if(lowQuality.length)alerts.push({type:"warn",msg:`${lowQuality.length} Website${lowQuality.length>1?"s":""} mit Quality-Score unter 80`,action:()=>{setTab("sites");if(lowQuality.length===1)setSel(lowQuality[0]);}});
  const TABS=[
    {id:"start",label:"Start",section:"ADMIN"},
    {id:"sites",label:"Sites",badge:regenBadge},
    {id:"finanzen",label:"Finanzen"},
    {id:"support",label:"Support",badge:tickets.filter(t=>t.status==="offen").length||null},
    {id:"system",label:"System"},
    {id:"arch-system",label:"System-Architektur",section:"DOKUMENTATION"},
    {id:"arch-flows",label:"Flows"},
    {id:"docs",label:"Dokumentation"},
  ];

  return(<div style={{minHeight:"100vh",background:T.bg,fontFamily:T.font}}><style>{css}</style>
    {/* Topbar */}
    <div style={{background:"#0c0e12",padding:"0 32px",height:56,display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <img src="/icon.png" alt="SR" style={{height:20,filter:"brightness(0) invert(1)",opacity:.7}}/>
        <span style={{fontSize:".88rem",fontWeight:800,color:"#fff",letterSpacing:"-.02em"}}>SiteReady</span>
        <span style={{fontSize:".75rem",fontWeight:700,color:"#f59e0b",background:"rgba(245,158,11,.15)",padding:"3px 10px",borderRadius:4,letterSpacing:".08em"}}>ADMIN</span>
      </div>
      <button onClick={load} style={{padding:"6px 16px",border:"1px solid rgba(255,255,255,.15)",borderRadius:T.rSm,background:"transparent",color:"rgba(255,255,255,.6)",cursor:"pointer",fontSize:".78rem",fontWeight:600,fontFamily:T.font,minHeight:36}}>Aktualisieren</button>
    </div>

    <div className="ad-wrap" style={{display:"flex",height:"calc(100vh - 56px)"}}>
      {/* Sidebar */}
      <div className="ad-sidebar" style={{width:200,background:"#fff",borderRight:`1px solid ${T.bg3}`,padding:"16px 0",flexShrink:0}}>
        {TABS.map(t=><div key={t.id}>
          {t.section&&<div style={{padding:"16px 20px 4px",fontSize:".75rem",fontWeight:800,color:T.textMuted,textTransform:"uppercase",letterSpacing:".12em"}}>{t.section}</div>}
          <button onClick={()=>setTab(t.id)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%",padding:"10px 20px",border:"none",background:tab===t.id?T.accentLight:"transparent",color:tab===t.id?T.accent:T.textSub,textAlign:"left",cursor:"pointer",fontSize:".85rem",fontWeight:tab===t.id?700:500,fontFamily:T.font,borderLeft:tab===t.id?`3px solid ${T.accent}`:"3px solid transparent"}}>
            <span>{t.label}</span>
            {t.badge&&<span style={{background:"#dc2626",color:"#fff",borderRadius:10,padding:"0 6px",fontSize:".75rem",fontWeight:700,lineHeight:"18px",minWidth:18,textAlign:"center"}}>{t.badge}</span>}
          </button>
        </div>)}
      </div>

      {/* Main */}
      <div className="ad-main" style={{flex:1,overflowY:"auto",padding:28,position:"relative"}}>
        {loading&&<div style={{textAlign:"center",padding:60,color:T.textMuted}}>Wird geladen...</div>}
        {isMobile&&DESKTOP_ONLY_TABS.includes(tab)&&<div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16,padding:"60px 24px",textAlign:"center"}}><div style={{fontSize:"1.4rem",fontWeight:800,color:T.textMuted}}>Desktop</div><div style={{fontWeight:700,fontSize:"1.1rem",color:T.dark}}>Desktop erforderlich</div><div style={{color:T.textMuted,fontSize:".88rem",maxWidth:280,lineHeight:1.6}}>Dieser Bereich ist fuer die Nutzung am Desktop optimiert. Bitte oeffne das Admin-Portal auf einem groesseren Bildschirm.</div></div>}
        {(!isMobile||!DESKTOP_ONLY_TABS.includes(tab))&&<>
        {!loading&&alerts.length>0&&<div style={{marginBottom:20,display:"flex",flexDirection:"column",gap:6}}>
          {alerts.map((a,i)=><div key={i} onClick={a.action?a.action:a.tab?()=>setTab(a.tab):undefined} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",borderRadius:T.rSm,background:a.type==="error"?"#fef2f2":a.type==="warn"?"#fefce8":"#eff6ff",border:`1px solid ${a.type==="error"?"#fecaca":a.type==="warn"?"#fde68a":"#bfdbfe"}`,cursor:(a.action||a.tab)?"pointer":"default"}}>
            <span style={{display:"inline-block",width:8,height:8,borderRadius:"50%",flexShrink:0,background:a.type==="error"?"#dc2626":a.type==="warn"?"#f59e0b":"#3b82f6"}}/>
            <span style={{fontSize:".82rem",fontWeight:600,color:a.type==="error"?"#dc2626":a.type==="warn"?"#92400e":"#1e40af",flex:1}}>{a.msg}</span>
            {a.tab&&<span style={{fontSize:".75rem",color:T.textMuted,whiteSpace:"nowrap"}}>Details &rarr;</span>}
          </div>)}
        </div>}

        {/* Tab: Start */}
        {!loading&&tab==="start"&&(()=>{
          const liveN=orders.filter(o=>o.status==="live").length;
          const trialN=orders.filter(o=>o.status==="trial").length;
          const mrrMonthly=orders.filter(o=>o.status==="live"&&o.subscription_plan!=="yearly").length*18;
          const mrrYearly=orders.filter(o=>o.status==="live"&&o.subscription_plan==="yearly").length*(183.6/12);
          const mrr=Math.round((mrrMonthly+mrrYearly)*100)/100;
          const openTickets=tickets.filter(t=>t.status==="offen");
          const expiringTrials=orders.filter(o=>o.status==="trial").map(o=>{const exp=o.trial_expires_at||(o.created_at?new Date(new Date(o.created_at).getTime()+7*24*60*60*1000).toISOString():null);return{...o,tl:exp?Math.ceil((new Date(exp)-Date.now())/(1000*60*60*24)):999};}).filter(o=>o.tl<=7).sort((a,b)=>a.tl-b.tl);
          const totalCost=orders.reduce((a,o)=>a+(o.cost_eur||0),0);
          return(<div style={{display:"flex",flexDirection:"column",gap:16}}>
            {/* KPI Cards */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
              {[
                {l:"Live-Kunden",v:liveN,s:`\u20AC${mrr} MRR`,c:T.green,a:()=>setTab("sites")},
                {l:"Trials aktiv",v:trialN,s:expiringTrials.filter(o=>o.tl<=4).length>0?`${expiringTrials.filter(o=>o.tl<=4).length} laufen in \u22644d ab`:"Alle noch frisch",c:"#7c3aed",a:()=>{setTab("sites");setFilter("trial");}},
                {l:"Offene Tickets",v:openTickets.length,s:openTickets.length===0?"Alles beantwortet":"Bitte pruefen",c:openTickets.length>0?T.red:T.textMuted,a:()=>setTab("support")},
                {l:"KI-Kosten",v:`\u20AC${totalCost.toFixed(2)}`,s:"kumuliert",c:T.orange,a:()=>setTab("kosten")},
              ].map((k,i)=>(
                <div key={i} onClick={k.a} style={{background:"#fff",borderRadius:T.r,padding:"18px 20px",border:`1px solid ${T.bg3}`,boxShadow:T.sh2,cursor:"pointer",transition:"box-shadow .15s"}} onMouseOver={e=>e.currentTarget.style.boxShadow=T.sh3} onMouseOut={e=>e.currentTarget.style.boxShadow=T.sh2}>
                  <div style={{fontSize:".8rem",fontWeight:700,color:T.dark,marginBottom:8}}>{k.l}</div>
                  <div style={{fontSize:"1.8rem",fontWeight:800,color:k.c,fontFamily:T.mono,letterSpacing:"-.03em",lineHeight:1}}>{k.v}</div>
                  <div style={{fontSize:".75rem",color:T.textMuted,marginTop:5}}>{k.s}</div>
                </div>
              ))}
            </div>
            {/* Trials ablaufend + Offene Tickets */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              <div style={{background:"#fff",borderRadius:T.r,padding:"18px 20px",border:`1px solid ${T.bg3}`,boxShadow:T.sh2}}>
                <div style={{fontSize:".8rem",fontWeight:700,color:T.dark,marginBottom:12}}>Trials ablaufend (7 Tage)</div>
                {expiringTrials.length===0
                  ?<div style={{color:T.textMuted,fontSize:".82rem",padding:"12px 0"}}>{"Kein Trial läuft in 7 Tagen ab."}</div>
                  :<div style={{display:"flex",flexDirection:"column",gap:0}}>
                    {expiringTrials.map((o,i)=>{const tc=o.tl<=2?"#dc2626":o.tl<=4?"#d97706":T.green;return(<div key={o.id} onClick={()=>setSel(o)} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:i<expiringTrials.length-1?`1px solid ${T.bg3}`:"none",cursor:"pointer"}}>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontWeight:700,fontSize:".85rem",color:T.dark,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{o.firmenname||"\u2014"}</div>
                        <div style={{fontSize:".75rem",color:T.textMuted}}>{o.email}</div>
                      </div>
                      <span style={{padding:"2px 8px",borderRadius:4,background:tc+"22",color:tc,fontWeight:700,fontSize:".75rem",flexShrink:0}}>{o.tl>0?`${o.tl}d`:"Abgelaufen"}</span>
                    </div>);})}
                  </div>
                }
              </div>
              <div style={{background:"#fff",borderRadius:T.r,padding:"18px 20px",border:`1px solid ${T.bg3}`,boxShadow:T.sh2}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
                  <div style={{fontSize:".8rem",fontWeight:700,color:T.dark}}>Offene Support-Anfragen</div>
                  {openTickets.length>0&&<button onClick={()=>setTab("support")} style={{padding:"3px 10px",border:`1px solid ${T.bg3}`,borderRadius:T.rSm,background:"#fff",color:T.textSub,cursor:"pointer",fontSize:".75rem",fontWeight:600,fontFamily:T.font}}>Alle ansehen</button>}
                </div>
                {openTickets.length===0
                  ?<div style={{color:T.textMuted,fontSize:".82rem",padding:"12px 0"}}>Keine offenen Anfragen.</div>
                  :<div style={{display:"flex",flexDirection:"column",gap:0}}>
                    {openTickets.slice(0,5).map((t,i)=><div key={t.id} onClick={()=>setTab("support")} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"8px 0",borderBottom:i<Math.min(openTickets.length,5)-1?`1px solid ${T.bg3}`:"none",cursor:"pointer"}}>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontWeight:600,fontSize:".84rem",color:T.dark,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.subject||"Allgemein"}</div>
                        <div style={{fontSize:".75rem",color:T.textMuted}}>{t.email} &middot; {fmtDate(t.created_at)}</div>
                      </div>
                    </div>)}
                  </div>
                }
              </div>
            </div>
            {/* Pipeline */}
            <div style={{background:"#fff",borderRadius:T.r,padding:"18px 20px",border:`1px solid ${T.bg3}`,boxShadow:T.sh2}}>
              <div style={{fontSize:".8rem",fontWeight:700,color:T.dark,marginBottom:12}}>Status-Pipeline</div>
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                {STATUS_FLOW.map(s=>{const n=orders.filter(o=>o.status===s).length;const pct=orders.length?Math.round((n/orders.length)*100):0;return(<div key={s} onClick={()=>{setTab("bestellungen");setFilter(s);}} style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}}>
                  <span style={{width:8,height:8,borderRadius:"50%",background:STATUS_COLORS[s],flexShrink:0,display:"inline-block"}}/>
                  <span style={{fontSize:".8rem",color:T.dark,width:80}}>{STATUS_LABELS[s]}</span>
                  <div style={{flex:1,height:6,background:T.bg3,borderRadius:3,overflow:"hidden"}}>
                    <div style={{width:`${pct}%`,height:"100%",background:STATUS_COLORS[s],borderRadius:3,transition:"width .4s"}}/>
                  </div>
                  <span style={{fontSize:".75rem",fontWeight:700,color:T.textMuted,fontFamily:T.mono,width:24,textAlign:"right"}}>{n}</span>
                </div>);})}
              </div>
            </div>
          </div>);
        })()}

        {/* Tab: Sites */}
        {!loading&&tab==="sites"&&(()=>{
          const ALL_STATUS=["pending","in_arbeit","trial","live","offline"];
          const sf=(search?orders.filter(o=>[o.firmenname,o.email,o.branche_label,o.subdomain].some(v=>v&&v.toLowerCase().includes(search.toLowerCase()))):orders).filter(o=>filter==="alle"||o.status===filter).filter(o=>{
            if(healthFilter==="alle")return true;
            const hasFailed=!!o.last_error;
            const h=health[o.id];
            const hs=o.status==="offline"?"deakt":hasFailed?"fehler":["pending","in_arbeit"].includes(o.status)?"aufbau":h==="ok"?"ok":h==="error"?"err":"unbekannt";
            return healthFilter===hs;
          }).filter(o=>{
            if(zahlungFilter==="alle")return true;
            if(zahlungFilter==="trial")return o.status==="trial"&&!o.stripe_customer_id;
            if(zahlungFilter==="kein_abo")return !o.stripe_customer_id&&!["pending","in_arbeit","trial"].includes(o.status);
            if(zahlungFilter==="pending_z")return ["pending","in_arbeit"].includes(o.status);
            return o.subscription_status===zahlungFilter;
          });
          const ddStyle={padding:"6px 10px",border:`2px solid ${T.bg3}`,borderRadius:T.rSm,fontSize:".78rem",fontFamily:T.font,background:"#fff",color:T.dark,cursor:"pointer",outline:"none"};
          return(<div>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:20,flexWrap:"wrap"}}>
              <h2 style={{fontSize:"1.2rem",fontWeight:800,color:T.dark,margin:0,marginRight:"auto"}}>Sites</h2>
              <div style={{position:"relative"}}>
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Suchen..." style={{padding:"7px 30px 7px 12px",border:`2px solid ${T.bg3}`,borderRadius:T.rSm,fontSize:".82rem",fontFamily:T.font,outline:"none",width:160,background:"#fff"}}/>
                {search&&<button onClick={()=>setSearch("")} style={{position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:T.textMuted,fontSize:"1rem",lineHeight:1,padding:0}}>&times;</button>}
              </div>
              <select value={filter} onChange={e=>setFilter(e.target.value)} style={ddStyle}>
                {["alle",...ALL_STATUS].map(s=>{const cnt=s==="alle"?orders.length:orders.filter(o=>o.status===s).length;return <option key={s} value={s}>{s==="alle"?"Alle Stati":STATUS_LABELS[s]} ({cnt})</option>;})}
              </select>
              <select value={healthFilter} onChange={e=>setHealthFilter(e.target.value)} style={ddStyle}>
                {[{v:"alle",l:"Health: Alle"},{v:"ok",l:"\u2713 Erreichbar"},{v:"err",l:"\u2717 Nicht erreichbar"},{v:"fehler",l:"\u26a0 Fehler"},{v:"aufbau",l:"\u23f3 Aufbau"},{v:"deakt",l:"\u25cb Deaktiviert"}].map(({v,l})=><option key={v} value={v}>{l}</option>)}
              </select>
              <select value={zahlungFilter} onChange={e=>setZahlungFilter(e.target.value)} style={ddStyle}>
                {[{v:"alle",l:"Zahlung: Alle"},{v:"active",l:"\u2713 Aktiv"},{v:"past_due",l:"\u26a0 Offen"},{v:"canceled",l:"Gekündigt"},{v:"trial",l:"Trial"},{v:"kein_abo",l:"Kein Abo"}].map(({v,l})=><option key={v} value={v}>{l}</option>)}
              </select>
              <button onClick={exportCSV} disabled={orders.length===0} style={{padding:"7px 12px",border:`2px solid ${T.bg3}`,borderRadius:T.rSm,background:"#fff",color:T.textSub,cursor:"pointer",fontSize:".75rem",fontWeight:600,fontFamily:T.font,display:"flex",alignItems:"center",gap:4,opacity:orders.length===0?.5:1}}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>CSV
              </button>
            </div>
            {/* Legende */}
            <div style={{display:"flex",gap:16,flexWrap:"wrap",marginBottom:20,alignItems:"flex-start"}}>
              <div>
                <div style={{fontSize:".75rem",fontWeight:700,color:T.dark,marginBottom:5}}>Prozess</div>
                <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                  {["pending","in_arbeit","trial","live","offline"].map(s=>{const c=STATUS_COLORS[s];return(<span key={s} style={{padding:"2px 7px",borderRadius:4,background:c+"18",color:c,fontWeight:700,fontSize:".75rem",border:`1px solid ${c}33`}}>{STATUS_LABELS[s]}</span>);})}
                </div>
              </div>
              <div>
                <div style={{fontSize:".75rem",fontWeight:700,color:T.dark,marginBottom:5}}>Health</div>
                <div style={{display:"flex",gap:5,flexWrap:"wrap",alignItems:"center"}}>
                  {[{label:"\u23f3 Wird aufgebaut",c:T.bg3},{label:"\u2713 Erreichbar",c:T.green},{label:"\u2717 Nicht erreichbar",c:"#dc2626"},{label:"\u26a0 Fehler",c:"#d97706"},{label:"\u25cb Deaktiviert",c:"#64748b"}].map(({label,c})=>(
                    <span key={label} style={{padding:"2px 7px",borderRadius:4,background:c+"18",color:c,fontWeight:700,fontSize:".75rem",border:`1px solid ${c}33`}}>{label}</span>
                  ))}
                </div>
              </div>
              <div>
                <div style={{fontSize:".75rem",fontWeight:700,color:T.dark,marginBottom:5}}>Zahlung</div>
                <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                  {[{label:"\u2713 Aktiv",c:T.green},{label:"\u26a0 Offen",c:"#d97706"},{label:"\u25cb Gekündigt",c:"#64748b"},{label:"Trial",c:"#8b5cf6"},{label:"Kein Abo",c:T.textMuted}].map(({label,c})=>(
                    <span key={label} style={{padding:"2px 7px",borderRadius:4,background:c+"18",color:c,fontWeight:700,fontSize:".75rem",border:`1px solid ${c}33`}}>{label}</span>
                  ))}
                </div>
              </div>
            </div>
            {sf.length===0?<div style={{color:T.textMuted,padding:40,textAlign:"center"}}>Keine Ergebnisse.</div>:
            <div style={{background:"#fff",borderRadius:T.r,border:`1px solid ${T.bg3}`,overflow:"hidden",boxShadow:T.sh2}}>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead><tr style={{background:T.bg}}>{["Firma","Prozess","Health","Zahlung","URL",""].map(h=>{
                  if(h==="Health"){const r=8,circ=2*Math.PI*r,pct=healthCountdown/60,dash=circ*pct;return <th key={h} style={{padding:"10px 14px",textAlign:"left",fontSize:".78rem",fontWeight:700,color:T.textMuted,letterSpacing:".04em",textTransform:"uppercase",borderBottom:`1px solid ${T.bg3}`}}><span style={{display:"inline-flex",alignItems:"center",gap:5}}>Health<svg width={18} height={18} style={{display:"block"}}><circle cx={9} cy={9} r={r} fill="none" stroke={T.bg3} strokeWidth={2}/><circle cx={9} cy={9} r={r} fill="none" stroke={T.accent} strokeWidth={2} strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" transform="rotate(-90 9 9)"/><text x={9} y={9} textAnchor="middle" dominantBaseline="central" fontSize={5} fill={T.textMuted} fontFamily="JetBrains Mono,monospace">{healthCountdown}</text></svg></span></th>;}
                  return <th key={h} style={{padding:"10px 14px",textAlign:"left",fontSize:".78rem",fontWeight:700,color:T.textMuted,letterSpacing:".04em",textTransform:"uppercase",borderBottom:`1px solid ${T.bg3}`}}>{h}</th>;
                })}</tr></thead>
                <tbody>{sf.map((o,i)=>{
                  const _exp=o.trial_expires_at||(o.created_at?new Date(new Date(o.created_at).getTime()+7*24*60*60*1000).toISOString():null);
                  const tl=o.status==="trial"&&_exp?Math.ceil((new Date(_exp)-Date.now())/(1000*60*60*24)):null;
                  const tc=tl===null?null:tl<=2?"#dc2626":tl<=4?"#d97706":T.green;
                  const h=health[o.id];
                  const url=o.subdomain?`sitereadyprototype.pages.dev/s/${o.subdomain}`:null;
                  const ageMin=(Date.now()-new Date(o.created_at).getTime())/(1000*60);
                  const isStuckPending=o.status==="pending"&&ageMin>120;
                  const isStuckGen=o.status==="in_arbeit"&&ageMin>15;
                  const hasFailed=!!o.last_error;
                  // Prozess
                  const procStatus=o.status;
                  const procColor=STATUS_COLORS[procStatus]||T.textMuted;
                  const procLabel=STATUS_LABELS[procStatus]||procStatus;
                  // Health
                  const healthState=o.status==="offline"?"deakt":hasFailed?"fehler":["pending","in_arbeit"].includes(o.status)?"aufbau":h==="checking"?"checking":h==="ok"?"ok":h==="error"?"err":"unbekannt";
                  const healthMap={aufbau:{label:"\u23f3 Wird aufgebaut",c:T.bg3},checking:{label:"...",c:T.textMuted},ok:{label:"\u2713 Erreichbar",c:T.green},err:{label:"\u2717 Nicht erreichbar",c:"#dc2626"},fehler:{label:"\u26a0 Fehler",c:"#d97706"},deakt:{label:"\u25cb Deaktiviert",c:"#64748b"},unbekannt:{label:"\u2014",c:T.textMuted}};
                  const hv=healthMap[healthState];
                  const rowBg=healthState==="err"||healthState==="fehler"?"#fef2f2":isStuckPending||isStuckGen?"#fffbeb":i%2===0?"#fff":"#fafbfc";
                  return(<tr key={o.id} style={{borderBottom:`1px solid ${T.bg3}`,background:rowBg}}>
                    <td style={{padding:"11px 14px",fontWeight:700,fontSize:".85rem",color:T.accent,cursor:"pointer",whiteSpace:"nowrap",textDecoration:"underline",textDecorationColor:T.accent+"55"}} onClick={()=>setSel(o)}>{o.firmenname||"\u2014"}</td>
                    <td style={{padding:"11px 14px",whiteSpace:"nowrap"}}>
                      <div style={{display:"flex",alignItems:"center",gap:6}}>
                        <span style={{padding:"3px 8px",borderRadius:4,background:procColor+"18",color:procColor,fontWeight:700,fontSize:".75rem",border:`1px solid ${procColor}33`}}>{procLabel}</span>
                        {tl!==null&&<span style={{padding:"2px 6px",borderRadius:4,background:tc+"22",color:tc,fontWeight:700,fontSize:".75rem"}}>{tl>0?`${tl}d`:"Abgelaufen"}</span>}
                      </div>
                    </td>
                    <td style={{padding:"11px 14px",whiteSpace:"nowrap"}}>
                      <span style={{padding:"3px 8px",borderRadius:4,background:hv.c+"18",color:hv.c,fontWeight:700,fontSize:".75rem",border:`1px solid ${hv.c}33`}}>{hv.label}</span>
                      {hasFailed&&<span title={o.last_error} style={{marginLeft:4,fontSize:".75rem",cursor:"help",color:"#d97706"}}>ℹ</span>}
                    </td>
                    <td style={{padding:"11px 14px",whiteSpace:"nowrap"}}>
                      {(()=>{
                        const s=o.subscription_status;
                        if(!o.stripe_customer_id){
                          if(o.status==="trial")return <span style={{padding:"3px 8px",borderRadius:4,background:"#8b5cf618",color:"#8b5cf6",fontWeight:700,fontSize:".75rem",border:"1px solid #8b5cf633"}}>Trial</span>;
                          if(["pending","in_arbeit"].includes(o.status))return <span style={{fontSize:".75rem",color:T.textMuted}}>—</span>;
                          return <span style={{padding:"3px 8px",borderRadius:4,background:T.textMuted+"18",color:T.textMuted,fontWeight:700,fontSize:".75rem",border:`1px solid ${T.textMuted}33`}}>Kein Abo</span>;
                        }
                        const zMap={active:{label:"\u2713 Aktiv",c:T.green},past_due:{label:"\u26a0 Offen",c:"#d97706"},canceled:{label:"\u25cb Gekündigt",c:"#64748b"}};
                        const zv=zMap[s]||{label:"Unbekannt",c:T.textMuted};
                        return <span style={{padding:"3px 8px",borderRadius:4,background:zv.c+"18",color:zv.c,fontWeight:700,fontSize:".75rem",border:`1px solid ${zv.c}33`}}>{zv.label}</span>;
                      })()}
                    </td>
                    <td style={{padding:"11px 14px",fontSize:".75rem",fontFamily:T.mono,maxWidth:180}}>
                      {url?<a href={`https://${url}`} target="_blank" rel="noopener noreferrer" style={{color:T.accent,textDecoration:"none",display:"block",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{url}</a>:<span style={{color:T.textMuted}}>—</span>}
                    </td>
                    <td style={{padding:"11px 14px",textAlign:"right",whiteSpace:"nowrap"}}>
                      {(isStuckPending||isStuckGen||hasFailed)&&<button onClick={()=>generateWebsite(o.id)} disabled={genLoading[o.id]} style={{padding:"4px 10px",border:"none",borderRadius:T.rSm,background:genLoading[o.id]?T.bg3:hasFailed?"#dc2626":"#f59e0b",color:"#fff",cursor:"pointer",fontSize:".75rem",fontWeight:700,fontFamily:T.font,marginRight:6}}>{genLoading[o.id]?"...":hasFailed?"Retry":"Generieren"}</button>}
                      <button onClick={()=>setSel(o)} style={{padding:"4px 10px",border:`1px solid ${T.bg3}`,borderRadius:T.rSm,background:"#fff",color:T.textSub,cursor:"pointer",fontSize:".75rem",fontWeight:600,fontFamily:T.font}}>Detail</button>
                    </td>
                  </tr>);
                })}</tbody>
              </table>
            </div>}
          </div>);
        })()}

        {/* Tab: Support */}
        {!loading&&tab==="support"&&(<div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
            <h2 style={{fontSize:"1.2rem",fontWeight:800,color:T.dark,margin:0}}>Support-Anfragen</h2>
            <button onClick={()=>setTicketFormOpen(o=>!o)} style={{padding:"7px 14px",border:`2px solid ${T.bg3}`,borderRadius:T.rSm,background:ticketFormOpen?T.dark:"#fff",color:ticketFormOpen?"#fff":T.textSub,cursor:"pointer",fontSize:".78rem",fontWeight:600,fontFamily:T.font}}>+ Ticket erstellen</button>
          </div>
          {ticketFormOpen&&<div style={{marginBottom:16,padding:"16px 20px",background:"#fff",borderRadius:T.r,border:`1px solid ${T.bg3}`,boxShadow:T.sh2}}>
            <div style={{fontSize:".8rem",fontWeight:700,color:T.dark,marginBottom:12}}>Manuelles Ticket</div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              <div style={{display:"grid",gridTemplateColumns:"100px 1fr",alignItems:"center",gap:8}}>
                <label style={{fontSize:".82rem",fontWeight:600,color:T.textMuted}}>Kunde</label>
                <select value={ticketForm.email} onChange={e=>setTicketForm(f=>({...f,email:e.target.value}))} style={{padding:"7px 10px",border:`2px solid ${T.bg3}`,borderRadius:T.rSm,fontSize:".82rem",fontFamily:T.font,outline:"none",background:"#fff"}}>
                  <option value="">Kunde auswaehlen...</option>
                  {orders.filter(o=>o.email).sort((a,b)=>(a.firmenname||"").localeCompare(b.firmenname||"")).map(o=><option key={o.id} value={o.email}>{o.firmenname||o.email} ({o.email})</option>)}
                </select>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"100px 1fr",alignItems:"center",gap:8}}>
                <label style={{fontSize:".82rem",fontWeight:600,color:T.textMuted}}>Betreff</label>
                <input value={ticketForm.subject} onChange={e=>setTicketForm(f=>({...f,subject:e.target.value}))} placeholder="z.B. Telefonat 25.03." style={{padding:"7px 10px",border:`2px solid ${T.bg3}`,borderRadius:T.rSm,fontSize:".82rem",fontFamily:T.font,outline:"none",background:"#fff"}}/>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"100px 1fr",alignItems:"flex-start",gap:8}}>
                <label style={{fontSize:".82rem",fontWeight:600,color:T.textMuted,paddingTop:8}}>Nachricht</label>
                <textarea value={ticketForm.message} onChange={e=>setTicketForm(f=>({...f,message:e.target.value}))} placeholder="Was wurde besprochen / gemeldet?" rows={3} style={{padding:"7px 10px",border:`2px solid ${T.bg3}`,borderRadius:T.rSm,fontSize:".82rem",fontFamily:T.font,outline:"none",background:"#fff",resize:"vertical",boxSizing:"border-box"}}/>
              </div>
              <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
                <button onClick={()=>{setTicketFormOpen(false);setTicketForm({email:"",subject:"",message:""}); }} style={{padding:"7px 14px",border:`2px solid ${T.bg3}`,borderRadius:T.rSm,background:"#fff",color:T.textSub,cursor:"pointer",fontSize:".78rem",fontWeight:600,fontFamily:T.font}}>Abbrechen</button>
                <button onClick={createTicket} disabled={ticketSaving||!ticketForm.email||!ticketForm.message} style={{padding:"7px 14px",border:"none",borderRadius:T.rSm,background:ticketSaving||!ticketForm.email||!ticketForm.message?T.bg3:T.dark,color:"#fff",cursor:"pointer",fontSize:".78rem",fontWeight:700,fontFamily:T.font}}>{ticketSaving?"Speichert...":"Ticket erstellen"}</button>
              </div>
            </div>
          </div>}
          {tickets.length===0?<div style={{color:T.textMuted,padding:40,textAlign:"center"}}>Keine Support-Anfragen.</div>:
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {tickets.map(t=>{
              const tOrder=orders.find(o=>o.email&&t.email&&o.email.toLowerCase()===t.email.toLowerCase());
              return(<div key={t.id} style={{background:"#fff",borderRadius:T.r,padding:"18px 22px",border:`1px solid ${t.status==="offen"?T.bg3:T.bg3}`,boxShadow:T.sh2}}>
                <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:8,gap:8}}>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:4}}>
                      <span style={{fontWeight:700,fontSize:".9rem",color:T.dark}}>{t.subject||"Allgemein"}</span>
                      {tOrder&&<button onClick={()=>{setSel(tOrder);setTab("sites");}} style={{padding:"2px 9px",border:`1px solid ${T.accent}33`,borderRadius:20,background:T.accentLight,color:T.accent,fontSize:".75rem",fontWeight:700,fontFamily:T.font,cursor:"pointer"}}>{tOrder.firmenname||t.email}</button>}
                    </div>
                    <span style={{fontSize:".75rem",color:T.textMuted}}>{t.email} &middot; {fmtDate(t.created_at)}</span>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
                    <span style={{padding:"3px 10px",borderRadius:4,background:t.status==="offen"?"#fef3c7":"#f0fdf4",color:t.status==="offen"?"#92400e":T.green,fontSize:".75rem",fontWeight:700}}>{t.status==="offen"?"Offen":"Beantwortet"}</span>
                    {t.status==="offen"&&<button onClick={()=>updateTicket(t.id,{status:"beantwortet"})} style={{padding:"4px 12px",border:`2px solid ${T.bg3}`,borderRadius:T.rSm,background:"#fff",color:T.textSub,cursor:"pointer",fontSize:".75rem",fontWeight:600,fontFamily:T.font}}>Beantwortet</button>}
                  </div>
                </div>
                <p style={{margin:0,fontSize:".85rem",color:T.textSub,lineHeight:1.65,background:T.bg,padding:"12px 14px",borderRadius:T.rSm}}>{t.message}</p>
              </div>);
            })}
          </div>}
        </div>)}
        {/* Tab: System */}
        {!loading&&tab==="system"&&(<div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
            <div>
              <h2 style={{fontSize:"1.2rem",fontWeight:800,color:T.dark,margin:"0 0 4px"}}>System</h2>
              {sysLastCheck&&<div style={{fontSize:".75rem",color:T.textMuted}}>APIs zuletzt geprüft: {sysLastCheck.toLocaleTimeString("de-AT")} &middot; Auto-Refresh 60s</div>}
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              {sysLoading&&<div style={{width:14,height:14,borderRadius:"50%",border:`2px solid ${T.accent}`,borderTopColor:"transparent",animation:"spin 1s linear infinite"}}/>}
              <button onClick={checkSystem} disabled={sysLoading} style={{padding:"7px 16px",border:`2px solid ${T.bg3}`,borderRadius:T.rSm,background:"#fff",color:T.textSub,cursor:sysLoading?"wait":"pointer",fontSize:".78rem",fontWeight:600,fontFamily:T.font}}>APIs prüfen</button>
            </div>
          </div>
          {/* Aktionen */}
          {stuckOrders.length>0&&<div style={{marginBottom:24}}>
            <div style={{fontSize:".8rem",fontWeight:700,color:T.dark,marginBottom:10}}>Aktionen erforderlich</div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {stuckOrders.map(o=><div key={o.id} style={{background:"#fff",borderRadius:T.r,padding:"14px 18px",border:"1px solid #fde68a",boxShadow:T.sh2,display:"flex",alignItems:"center",gap:14}}>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:".88rem",color:T.dark,cursor:"pointer"}} onClick={()=>setSel(o)}>{o.firmenname||"\u2014"}</div>
                  <div style={{fontSize:".75rem",color:"#92400e",marginTop:2}}>Bezahlt seit {fmtDate(o.created_at)} – Website noch nicht generiert</div>
                </div>
                <button onClick={()=>generateWebsite(o.id)} disabled={genLoading[o.id]} style={{padding:"6px 14px",border:"none",borderRadius:T.rSm,background:genLoading[o.id]?T.bg3:T.dark,color:"#fff",cursor:genLoading[o.id]?"wait":"pointer",fontSize:".78rem",fontWeight:700,fontFamily:T.font,flexShrink:0}}>
                  {genLoading[o.id]?"Generiert...":"Website generieren"}
                </button>
                {genMsg[o.id]&&<div style={{fontSize:".75rem",color:genMsg[o.id].startsWith("Fehler")||genMsg[o.id].startsWith("Netzwerk")?T.red:T.green}}>{genMsg[o.id]}</div>}
              </div>)}
            </div>
          </div>}
          {/* Services & Status */}
          {(()=>{
            const extInd=k=>extStatus[k]?.status?.indicator;
            const extLoading=k=>extStatus[k]===null;
            const extLabel=k=>{const st=extStatus[k];if(st===null)return null;if(st===false)return{label:"Nicht erreichbar",color:T.textMuted,bg:"rgba(0,0,0,.04)"};const i=extInd(k);return i==="none"?{label:"Betriebsbereit",color:T.green,bg:T.greenLight}:i==="minor"?{label:"Kleinere Stoerung",color:"#d97706",bg:"#fef3c7"}:{label:"Stoerung / Ausfall",color:T.red,bg:"#fef2f2"};};
            const services=[
              {key:"supabase",label:"Supabase",desc:"Datenbank & Auth",href:"https://status.supabase.com",
                intOk:sysStatus?.supabase?.ok,intLabel:sysStatus?.supabase?.latency?`${sysStatus.supabase.latency}ms`:sysStatus?.supabase?.ok?"OK":null,intErr:sysStatus?.supabase?.error},
              {key:"stripe",label:"Stripe",desc:"Zahlungsabwicklung",href:"https://www.stripestatus.com",
                intOk:sysStatus?.stripe?.ok,intLabel:sysStatus?.stripe?.livemode===false?"Testmodus":sysStatus?.stripe?.livemode===true?"Live":sysStatus?.stripe?.ok?"OK":null,intErr:sysStatus?.stripe?.error},
              {key:"anthropic",label:"Anthropic (Claude)",desc:"KI-Generierung",href:"https://status.anthropic.com",
                intOk:sysStatus?.anthropic?.ok&&!sysStatus?.anthropic?.billing,intLabel:sysStatus?.anthropic?.billing?"Billing-Problem":sysStatus?.anthropic?.ok?"API Key OK":null,intErr:sysStatus?.anthropic?.billing?"Guthaben aufgebraucht":sysStatus?.anthropic?.error},
              {key:"cloudflare",label:"Cloudflare",desc:"Hosting & CDN",href:"https://www.cloudflarestatus.com",
                intOk:null,intLabel:null,intErr:null},
            ];
            const StatusRow=({dotColor,text,detail,err,loading,href})=>(
              <div style={{display:"flex",alignItems:"center",gap:6,marginTop:6}}>
                {loading?<div style={{width:7,height:7,borderRadius:"50%",border:`2px solid ${T.accent}`,borderTopColor:"transparent",animation:"spin 1s linear infinite",flexShrink:0}}/>
                  :<div style={{width:7,height:7,borderRadius:"50%",background:dotColor,flexShrink:0}}/>}
                <span style={{fontSize:".75rem",color:T.textMuted}}>{text}</span>
                {detail&&<span style={{fontSize:".75rem",fontWeight:600,color:err?T.red:dotColor,marginLeft:2}}>{detail}</span>}
                {href&&<a href={href} target="_blank" rel="noreferrer" style={{fontSize:".75rem",color:T.accent,fontWeight:600,textDecoration:"none",marginLeft:"auto"}}>{"Status \u2192"}</a>}
              </div>
            );
            return(<div style={{marginBottom:24}}>
              <div style={{fontSize:".8rem",fontWeight:700,color:T.dark,marginBottom:10}}>{"Services & Status"}</div>
              {(!sysStatus&&sysLoading)&&<div style={{color:T.textMuted,padding:"24px",textAlign:"center",background:"#fff",borderRadius:T.r,border:`1px solid ${T.bg3}`,marginBottom:8}}>{"Verbindungen werden geprueft..."}</div>}
              <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10}}>
                {services.map(({key,label,desc,href,intOk,intLabel,intErr})=>{
                  const ext=extLabel(key);
                  const extDot=ext===null?T.textMuted:ext.color;
                  const intDot=intOk===null?null:intOk?T.green:T.red;
                  const hasInternal=intOk!==null;
                  const cardBorder=intOk===false||(!extLoading(key)&&extStatus[key]!==false&&extInd(key)&&extInd(key)!=="none")?"#fecaca":intOk===true&&(ext===null||ext.color===T.green)?"rgba(22,163,74,.15)":T.bg3;
                  return(<div key={key} style={{background:"#fff",borderRadius:T.r,border:`1px solid ${cardBorder}`,padding:"14px 16px",boxShadow:T.sh2}}>
                    <div style={{fontWeight:700,fontSize:".88rem",color:T.dark}}>{label}</div>
                    <div style={{fontSize:".75rem",color:T.textMuted,marginBottom:4}}>{desc}</div>
                    {hasInternal&&<StatusRow
                      dotColor={intDot||T.textMuted}
                      text={"API-Verbindung"}
                      detail={intLabel}
                      err={!!intErr}
                      loading={!sysStatus&&sysLoading}
                    />}
                    <StatusRow
                      dotColor={extDot}
                      text={"Service-Status"}
                      detail={ext?.label}
                      err={ext?.color===T.red}
                      loading={extLoading(key)}
                      href={href}
                    />
                  </div>);
                })}
              </div>
            </div>);
          })()}
          {/* Letzte Generierungsfehler */}
          {(()=>{
            const errOrders=orders.filter(o=>o.last_error).sort((a,b)=>new Date(b.created_at)-new Date(a.created_at)).slice(0,5);
            if(!errOrders.length)return null;
            return(<div style={{marginBottom:24}}>
              <div style={{fontSize:".8rem",fontWeight:700,color:T.dark,marginBottom:10}}>{"Letzte Generierungsfehler"}</div>
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                {errOrders.map(o=><div key={o.id} style={{background:"#fff",borderRadius:T.rSm,border:"1px solid #fecaca",padding:"10px 14px",display:"flex",gap:12,alignItems:"flex-start",cursor:"pointer"}} onClick={()=>setSel(o)}>
                  <span style={{fontSize:".8rem",fontWeight:700,color:T.dark,flexShrink:0}}>{o.firmenname||"\u2014"}</span>
                  <span style={{fontSize:".75rem",color:T.red,flex:1,fontFamily:T.mono,lineHeight:1.4}}>{o.last_error}</span>
                  <span style={{fontSize:".75rem",color:T.textMuted,flexShrink:0}}>{fmtDate(o.created_at)}</span>
                </div>)}
              </div>
            </div>);
          })()}
          {/* Env Vars */}
          {sysStatus&&<div>
            <div style={{fontSize:".8rem",fontWeight:700,color:T.dark,marginBottom:10}}>Environment Variables</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {Object.entries(sysStatus.envvars||{}).map(([k,v])=><div key={k} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 12px",borderRadius:T.rSm,background:v?T.greenLight:"#fef2f2",border:`1px solid ${v?"rgba(22,163,74,.15)":"rgba(220,38,38,.1)"}`}}>
                <span style={{fontSize:".75rem",color:v?T.green:T.red,fontWeight:700}}>{v?"\u2713":"\u2717"}</span>
                <span style={{fontSize:".78rem",fontFamily:T.mono,color:T.dark}}>{k}</span>
              </div>)}
            </div>
          </div>}
          {/* Error Logs */}
          <div style={{marginTop:24}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{fontSize:".8rem",fontWeight:700,color:T.dark}}>Frontend-Fehler</div>
                {errorLogs.length>0&&<span style={{background:T.red,color:"#fff",fontSize:".75rem",fontWeight:700,padding:"2px 8px",borderRadius:100}}>{errorLogs.length}</span>}
              </div>
              <div style={{display:"flex",gap:6}}>
                {errorLogs.length>0&&<button onClick={clearErrorLogs} style={{padding:"5px 12px",border:`2px solid #fecaca`,borderRadius:T.rSm,background:"#fff",color:T.red,cursor:"pointer",fontSize:".75rem",fontWeight:600,fontFamily:T.font}}>Alle löschen</button>}
                <button onClick={fetchErrorLogs} disabled={errorLogsLoading} style={{padding:"5px 12px",border:`2px solid ${T.bg3}`,borderRadius:T.rSm,background:"#fff",color:T.textSub,cursor:errorLogsLoading?"wait":"pointer",fontSize:".75rem",fontWeight:600,fontFamily:T.font}}>Aktualisieren</button>
              </div>
            </div>
            {errorLogs.length===0?(<div style={{background:"#fff",borderRadius:T.r,border:`1px solid ${T.bg3}`,padding:"24px",textAlign:"center"}}>
              <div style={{fontSize:".85rem",color:T.green,fontWeight:600}}>{"\u2713"} Keine Fehler</div>
              <div style={{fontSize:".75rem",color:T.textMuted,marginTop:4}}>Frontend läuft fehlerfrei</div>
            </div>):(<div style={{display:"flex",flexDirection:"column",gap:6,maxHeight:400,overflowY:"auto"}}>
              {errorLogs.map((e,i)=><div key={e.id||i} style={{background:"#fff",borderRadius:T.rSm,border:"1px solid #fecaca",padding:"12px 14px"}}>
                <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:10,marginBottom:6}}>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <span style={{background:e.source==="unhandledrejection"?"#fef3c7":"#fef2f2",color:e.source==="unhandledrejection"?"#92400e":"#991b1b",fontSize:".75rem",fontWeight:700,padding:"2px 6px",borderRadius:4,textTransform:"uppercase"}}>{e.source==="unhandledrejection"?"Promise":e.source==="window.onerror"?"JS":"Error"}</span>
                    {e.user_email&&<span style={{fontSize:".75rem",color:T.accent,fontWeight:600}}>{e.user_email}</span>}
                  </div>
                  <span style={{fontSize:".75rem",color:T.textMuted,flexShrink:0}}>{new Date(e.created_at).toLocaleString("de-AT",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"})}</span>
                </div>
                <div style={{fontSize:".8rem",color:T.red,fontWeight:600,fontFamily:T.mono,lineHeight:1.4,marginBottom:e.stack?6:0,wordBreak:"break-word"}}>{e.message}</div>
                {e.stack&&<details style={{margin:0}}><summary style={{fontSize:".75rem",color:T.textMuted,cursor:"pointer",fontFamily:T.font}}>Stack-Trace</summary><pre style={{fontSize:".75rem",color:T.textSub,fontFamily:T.mono,margin:"6px 0 0",lineHeight:1.5,whiteSpace:"pre-wrap",wordBreak:"break-all",maxHeight:150,overflow:"auto"}}>{e.stack}</pre></details>}
                <div style={{fontSize:".75rem",color:T.textMuted,marginTop:4}}>{e.url}</div>
              </div>)}
            </div>)}
          </div>
        </div>)}

        {/* Tab: Finanzen */}
        {!loading&&tab==="finanzen"&&(()=>{
          const now=new Date();
          const activeOrders=orders.filter(o=>o.subscription_status==="active");
          const pastDueN=orders.filter(o=>o.subscription_status==="past_due").length;
          const trialN=orders.filter(o=>o.status==="trial").length;
          const mrr=activeOrders.reduce((a,o)=>a+(o.subscription_plan==="yearly"?183.6/12:18),0);
          const totalCostEur=orders.reduce((a,o)=>a+(o.cost_eur||0),0);
          const months6=Array.from({length:6},(_,i)=>{const d=new Date(now.getFullYear(),now.getMonth()-5+i,1);return{label:d.toLocaleDateString("de-AT",{month:"short",year:"2-digit"}),key:`${d.getFullYear()}-${d.getMonth()}`};});
          const mData=months6.map(m=>({...m,count:orders.filter(o=>{if(!o.created_at)return false;const d=new Date(o.created_at);return`${d.getFullYear()}-${d.getMonth()}`===m.key;}).length}));
          const maxC=Math.max(1,...mData.map(m=>m.count));
          const stripeFee=Math.round((mrr*0.014+activeOrders.length*0.25)*100)/100;
          const claudeCostMo=totalCostEur/Math.max(1,now.getMonth());
          const ausgaben=Math.round((stripeFee+claudeCostMo)*100)/100;
          const netto=Math.round((mrr-ausgaben)*100)/100;
          return(<div>
            <div style={{marginBottom:24}}>
              <h2 style={{margin:"0 0 4px",fontSize:"1.2rem",fontWeight:800,color:T.dark}}>Finanzen</h2>
              <p style={{margin:0,fontSize:".82rem",color:T.textMuted}}>{"Einnahmen, Ausgaben und Abo-Status im Überblick"}</p>
            </div>
            {/* Top KPIs: Einnahmen | Ausgaben | Netto */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16,marginBottom:24}}>
              <div style={{background:"#fff",borderRadius:T.r,padding:"20px 24px",border:`1px solid ${T.bg3}`,boxShadow:T.sh2}}>
                <div style={{fontSize:".8rem",fontWeight:700,color:T.dark,marginBottom:8}}>Einnahmen (MRR)</div>
                <div style={{fontSize:"2rem",fontWeight:800,color:T.green,fontFamily:T.mono,letterSpacing:"-.03em",lineHeight:1}}>{"\u20AC"}{mrr.toFixed(2)}</div>
                <div style={{marginTop:10,display:"flex",gap:12,flexWrap:"wrap"}}>
                  <span style={{fontSize:".75rem",color:T.textMuted}}><span style={{fontWeight:700,color:T.green}}>{activeOrders.length}</span> aktive Abos</span>
                  {trialN>0&&<span style={{fontSize:".75rem",color:T.textMuted}}><span style={{fontWeight:700,color:"#8b5cf6"}}>{trialN}</span> in Trial</span>}
                  {pastDueN>0&&<span style={{fontSize:".75rem",color:"#d97706",fontWeight:700}}>{"\u26a0"} {pastDueN} Zahlung offen</span>}
                </div>
              </div>
              <div style={{background:"#fff",borderRadius:T.r,padding:"20px 24px",border:`1px solid ${T.bg3}`,boxShadow:T.sh2}}>
                <div style={{fontSize:".8rem",fontWeight:700,color:T.dark,marginBottom:8}}>Ausgaben / Mo</div>
                <div style={{fontSize:"2rem",fontWeight:800,color:"#dc2626",fontFamily:T.mono,letterSpacing:"-.03em",lineHeight:1}}>{"\u20AC"}{ausgaben.toFixed(2)}</div>
                <div style={{marginTop:10,display:"flex",flexDirection:"column",gap:3}}>
                  {[["Stripe",`\u20AC${stripeFee.toFixed(2)}`],["Claude API",`\u20AC${claudeCostMo.toFixed(3)}`],["Cloudflare / Supabase","\u20AC0"]].map(([l,v])=>(
                    <div key={l} style={{display:"flex",justifyContent:"space-between",fontSize:".75rem",color:T.textMuted}}>
                      <span>{l}</span><span style={{fontFamily:T.mono,fontWeight:600,color:T.dark}}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{background:"#fff",borderRadius:T.r,padding:"20px 24px",border:`2px solid ${netto>=0?T.green+"44":"#fca5a5"}`,boxShadow:T.sh2}}>
                <div style={{fontSize:".8rem",fontWeight:700,color:T.dark,marginBottom:8}}>Netto / Mo</div>
                <div style={{fontSize:"2rem",fontWeight:800,color:netto>=0?T.green:"#dc2626",fontFamily:T.mono,letterSpacing:"-.03em",lineHeight:1}}>{"\u20AC"}{netto.toFixed(2)}</div>
                <div style={{marginTop:10,fontSize:".75rem",color:T.textMuted}}>nach Stripe-Geb. + API-Kosten</div>
              </div>
            </div>
            {/* Unterer Bereich: Bestellungen Chart + Abo-Status */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              {/* Bestellungen Chart */}
              <div style={{background:"#fff",borderRadius:T.r,padding:"22px 24px",border:`1px solid ${T.bg3}`,boxShadow:T.sh2}}>
                <div style={{fontSize:".78rem",fontWeight:700,color:T.dark,marginBottom:18}}>Neue Bestellungen &mdash; letzte 6 Monate</div>
                <svg viewBox="0 0 340 170" style={{width:"100%",overflow:"visible"}}>
                  <line x1="0" y1="148" x2="340" y2="148" stroke={T.bg3} strokeWidth="1"/>
                  {mData.map((m,i)=>{const bW=38,gap=18,x=i*(bW+gap)+10,maxH=120,bH=m.count===0?2:Math.max(8,Math.round((m.count/maxC)*maxH)),y=148-bH;return(<g key={i}>
                    <rect x={x} y={y} width={bW} height={bH} rx={5} fill={m.count>0?T.accent:"#e8ebf0"} opacity={m.count>0?.85:1}/>
                    {m.count>0&&<text x={x+bW/2} y={y-7} textAnchor="middle" fontSize="11" fontWeight="700" fill={T.accent} fontFamily={T.mono}>{m.count}</text>}
                    <text x={x+bW/2} y={163} textAnchor="middle" fontSize="10" fill={T.textMuted}>{m.label}</text>
                  </g>);})}
                </svg>
              </div>
              {/* Abo-Status + Claude Details */}
              <div style={{display:"flex",flexDirection:"column",gap:16}}>
                <div style={{background:"#fff",borderRadius:T.r,padding:"20px 24px",border:`1px solid ${T.bg3}`,boxShadow:T.sh2}}>
                  <div style={{fontSize:".8rem",fontWeight:700,color:T.dark,marginBottom:12}}>Abo-Status</div>
                  {[{label:"Aktiv",val:activeOrders.length,c:T.green},{label:"Trial",val:trialN,c:"#8b5cf6"},{label:"Zahlung offen",val:pastDueN,c:"#d97706"},{label:"Kein Abo",val:orders.filter(o=>!o.stripe_customer_id).length,c:T.textMuted}].map(({label,val,c})=>(
                    <div key={label} style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                      <div style={{flex:1,height:6,borderRadius:3,background:T.bg3,overflow:"hidden"}}>
                        <div style={{width:`${Math.round((val/Math.max(1,orders.length))*100)}%`,height:"100%",background:c,borderRadius:3}}/>
                      </div>
                      <span style={{fontSize:".75rem",color:T.textMuted,minWidth:90}}>{label}</span>
                      <span style={{fontSize:".75rem",fontWeight:700,color:c,fontFamily:T.mono,minWidth:20,textAlign:"right"}}>{val}</span>
                    </div>
                  ))}
                </div>
                <div style={{background:"#fff",borderRadius:T.r,padding:"20px 24px",border:`1px solid ${T.bg3}`,boxShadow:T.sh2}}>
                  <div style={{display:"flex",alignItems:"baseline",justifyContent:"space-between",marginBottom:10}}>
                    <div style={{fontSize:".8rem",fontWeight:700,color:T.dark}}>Claude API</div>
                    <span style={{fontSize:".75rem",color:T.textMuted}}>{orders.filter(o=>o.tokens_in>0).length}/{orders.length} getrackt</span>
                  </div>
                  {totalCostEur>0?[
                    ["Kumuliert gesamt",`\u20AC${totalCostEur.toFixed(4)}`],
                    ["Input-Tokens",orders.reduce((a,o)=>a+(o.tokens_in||0),0).toLocaleString("de-AT")],
                    ["Output-Tokens",orders.reduce((a,o)=>a+(o.tokens_out||0),0).toLocaleString("de-AT")],
                  ].map(([l,v])=>(
                    <div key={l} style={{display:"flex",justifyContent:"space-between",fontSize:".78rem",padding:"5px 0",borderBottom:`1px solid ${T.bg3}`}}>
                      <span style={{color:T.textMuted}}>{l}</span>
                      <span style={{fontFamily:T.mono,fontWeight:700,color:T.dark}}>{v}</span>
                    </div>
                  )):<div style={{fontSize:".78rem",color:T.textMuted}}>Noch keine Daten</div>}
                </div>
              </div>
            </div>
          </div>);
        })()}

        {/* Tab: System-Architektur */}
        {!loading&&tab==="arch-system"&&(()=>{
          const chip=(label,sub,color)=>(<span style={{display:"inline-flex",alignItems:"center",gap:5,padding:"3px 8px",borderRadius:20,background:color+"14",border:`1px solid ${color}28`,fontSize:".75rem",fontWeight:600,color:T.dark,margin:"2px 3px",whiteSpace:"nowrap"}}><span style={{width:5,height:5,borderRadius:"50%",background:color,flexShrink:0}}/>{label}{sub&&<span style={{fontSize:".75rem",color:T.textMuted,fontWeight:400}}>· {sub}</span>}</span>);
          const layer=(title,color,children,note)=>(<div style={{padding:"7px 12px",marginBottom:3,background:color+"07",borderLeft:`3px solid ${color}`,borderRadius:`0 ${T.rSm} ${T.rSm} 0`}}><div style={{display:"flex",alignItems:"baseline",flexWrap:"wrap",gap:0}}><span style={{fontSize:".75rem",fontWeight:800,color,marginRight:8,flexShrink:0}}>{title}</span><span style={{display:"inline"}}>{children}</span></div>{note&&<div style={{marginTop:3,fontSize:".75rem",color,opacity:.65,fontStyle:"italic"}}>{note}</div>}</div>);
          const arr=<div style={{textAlign:"center",color:T.bg3,fontSize:".75rem",margin:"1px 0",lineHeight:1}}>↓</div>;
          return(<div id="arch-system-print">
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}><h2 style={{fontSize:"1.1rem",fontWeight:800,color:T.dark,margin:0}}>System-Architektur</h2><button onClick={()=>printTabHTML("arch-system-print","System-Architektur")} style={{padding:"5px 12px",border:`1px solid ${T.bg3}`,borderRadius:T.rSm,background:"#fff",color:T.textSub,cursor:"pointer",fontSize:".75rem",fontWeight:700,fontFamily:T.font}}>PDF</button></div>
            {layer("Entwicklung & Deploy","#6366f1",<>{chip("Entwickler","VS Code · Git","#6366f1")}{chip("GitHub","main branch","#6366f1")}{chip("Cloudflare Pages CI/CD","push → build → deploy","#6366f1")}</>,"git push main → automatischer Build & Deploy ~1 Min.")}
            {arr}{layer("Nutzer","#64748b",<>{chip("Neukunde","Landingpage · Formular · Stripe","#64748b")}{chip("Bestandskunde","Portal-Login","#64748b")}{chip("Admin","/admin?key=...","#64748b")}</>)}
            {arr}{layer("Cloudflare Pages (Edge/CDN)","#f97316",<>{chip("React SPA","/ · Landing + Formular","#f97316")}{chip("Admin Dashboard","/admin?key=...","#f97316")}{chip("Edge Functions","/api/* · 12 Endpoints","#f97316")}{chip("Website Serving","/s/[subdomain]","#f97316")}{chip("Legal Serving","/s/[subdomain]/impressum","#f97316")}</>,  "SSL automatisch · CDN weltweit · robots.txt: /s/* noindex (Prototyp)")}
            {arr}{layer("Supabase","#2563eb",<>{chip("PostgreSQL","orders · docs · support_requests","#2563eb")}{chip("Storage","Logo · Fotos pro Kunde","#2563eb")}{chip("Auth","Portal-Login · JWT","#2563eb")}</>)}
            {arr}{layer("Externe APIs","#8b5cf6",<>{chip("Claude Sonnet","Website-Generierung","#8b5cf6")}{chip("Claude Haiku","Website-Import","#0891b2")}{chip("Stripe","Checkout · Webhooks","#16a34a")}{chip("Jina AI","Website-Import Reader","#6366f1")}{chip("Google Fonts","DM Sans · Inter","#f59e0b")}</>)}
            {arr}{layer("DNS & Domains",T.bg3,<>{chip("Cloudflare DNS","siteready.at",T.bg3)}{chip("Prototyp","sitereadyprototype.pages.dev/s/{firma}",T.bg3)}{chip("Produktion (geplant)","{firma}.siteready.at",T.bg3)}</>)}
            <div style={{marginTop:10,padding:"7px 11px",background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:T.rSm,fontSize:".75rem",color:"#1e40af",lineHeight:1.7}}><strong>Serve-time:</strong> Logo, Fotos, Galerie, Kontaktdaten live aus Supabase – kein Re-Deploy. <strong>Impressum/Datenschutz:</strong> legal.js frisch aus DB bei jedem Request.</div>
          </div>);
        })()}

        {/* Tab: Flows */}
        {!loading&&tab==="arch-flows"&&(()=>{
          const ftitle=(icon,label)=>(<div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14,paddingBottom:10,borderBottom:`1px solid ${T.bg3}`}}><span style={{fontSize:"1rem"}}>{icon}</span><span style={{fontSize:".85rem",fontWeight:800,color:T.dark}}>{label}</span></div>);
          const fnode=(icon,label,sub,color,optional)=>(<div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,flex:"1 1 90px",minWidth:80,maxWidth:140}}><div style={{width:38,height:38,borderRadius:"50%",background:color+"18",border:`2px solid ${color}33`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1rem"}}>{icon}</div><div style={{fontSize:".75rem",fontWeight:700,color:T.dark,textAlign:"center",lineHeight:1.3}}>{label}</div>{sub&&<div style={{fontSize:".75rem",color:T.textMuted,textAlign:"center",lineHeight:1.3}}>{sub}</div>}{optional&&<span style={{fontSize:".75rem",fontWeight:700,color:T.textMuted,background:T.bg3,padding:"1px 5px",borderRadius:3}}>Optional</span>}</div>);
          const farrow=<div style={{color:T.textMuted,fontSize:"1rem",alignSelf:"center",flexShrink:0,paddingBottom:16}}>→</div>;
          const fphase=(label,color,children)=>(<div style={{marginBottom:14}}><div style={{fontSize:".75rem",fontWeight:800,color,marginBottom:8,paddingLeft:2}}>{label}</div><div style={{display:"flex",alignItems:"flex-start",gap:4,flexWrap:"wrap"}}>{children}</div></div>);
          return(<div id="arch-flows-print">
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",margin:"0 0 4px"}}><h2 style={{fontSize:"1.1rem",fontWeight:800,color:T.dark,margin:0}}>Flows</h2><button onClick={()=>printTabHTML("arch-flows-print","Flows")} style={{padding:"5px 12px",border:`1px solid ${T.bg3}`,borderRadius:T.rSm,background:"#fff",color:T.textSub,cursor:"pointer",fontSize:".75rem",fontWeight:700,fontFamily:T.font}}>PDF</button></div>
            <div style={{background:T.bg,borderRadius:T.rSm,padding:"16px 18px",border:`1px solid ${T.bg3}`,marginBottom:16}}>
              {ftitle("🧑","Kunden-Flow")}
              {fphase("Phase 0 – Entdeckung","#64748b",<>{fnode("🌐","Landingpage","siteready.at besuchen","#64748b")}{farrow}{fnode("💡","Features & Preis","7 Tage kostenlos · ab 18 Euro/Mo","#64748b")}{farrow}{fnode("🚀","Jetzt starten","CTA-Button klicken","#64748b")}</>)}
              {fphase("Phase 1 – Website-Import (optional)","#0891b2",<>{fnode("🔗","URL eingeben","Bestandswebsite","#0891b2")}{farrow}{fnode("📥","Jina scraping","Content laden","#0891b2")}{farrow}{fnode("🤖","Claude Haiku","Daten extrahieren","#0891b2")}{farrow}{fnode("✏️","Vorbefuellt","Wizard vorausgefuellt","#0891b2",true)}</>)}
              {fphase("Phase 2 – Fragebogen (5 Schritte)","#2563eb",<>{fnode("🏗️","Branche & Stil","Professional/Modern/Traditional","#2563eb")}{farrow}{fnode("🏢","Unternehmen","Name · Adresse · Kontakt","#2563eb")}{farrow}{fnode("⚙️","Leistungen","Auswahl + Freitext","#2563eb")}{farrow}{fnode("🎯","Extras","Social · Buchungslink","#2563eb")}{farrow}{fnode("📸","Bilder","Logo · Hero · Fotos","#2563eb")}</>)}
              {fphase("Phase 3 – Preview & Start","#16a34a",<>{fnode("👀","Preview","Website-Vorschau","#16a34a")}{farrow}{fnode("📝","Account erstellen","Name · Passwort","#16a34a")}{farrow}{fnode("🚀","Kostenlos starten","Order → start-build → pending","#16a34a")}</>)}
              {fphase("Phase 4 – Generierung & Trial","#8b5cf6",<>{fnode("⚙️","Wird erstellt","status: pending · ~30-60 Sek.","#8b5cf6")}{farrow}{fnode("🤖","Claude Sonnet","claude-sonnet-4-6","#8b5cf6")}{farrow}{fnode("🔧","Post-Processing","Nav · Footer · Meta · Schema.org","#8b5cf6")}{farrow}{fnode("🔬","Testphase","status: trial · 7 Tage","#8b5cf6")}</>)}
              {fphase("Phase 4 → Abo abgeschlossen","#16a34a",<>{fnode("💳","Plan waehlen","18 Euro/Mo oder 183.60 Euro/Jahr","#16a34a")}{farrow}{fnode("🔗","Stripe Subscription","Trial-Tage berechnet · Karte hinterlegt","#16a34a")}{farrow}{fnode("✅","Tag 8","erste Abbuchung · invoice.paid","#16a34a")}{farrow}{fnode("🌍","Live","status: live","#16a34a")}</>)}
              {fphase("Phase 4 → Kein Abo nach 7 Tagen","#ef4444",<>{fnode("⏰","Trial abgelaufen","trial_expires_at ueberschritten","#ef4444")}{farrow}{fnode("🗑️","Auto-Loeschung","trial-cleanup.js · taeglich","#ef4444")}{farrow}{fnode("💀","Alles geloescht","User · Storage · Order","#ef4444")}</>)}
              {fphase("Phase 5 – Website live","#059669",<>{fnode("🔗","Subdomain","/s/{subdomain}","#059669")}{farrow}{fnode("🖼️","Fotos","serve-time Injection","#059669")}{farrow}{fnode("📄","Impressum","ECG \u00a75 \u00b7 DSGVO auto","#059669")}{farrow}{fnode("🔍","noindex","bis Production Go-Live","#059669")}</>)}
              {fphase("Phase 5b – Production Go-Live (geplant)","#0f766e",<>{fnode("🏠","Domain eingeben","im Kunden-Portal","#0f766e",true)}{farrow}{fnode("☁️","Cloudflare","Custom Domain API","#0f766e",true)}{farrow}{fnode("🔧","DNS setzen","CNAME beim Registrar","#0f766e",true)}{farrow}{fnode("🔒","SSL auto","Cloudflare Zertifikat","#0f766e",true)}{farrow}{fnode("🔓","noindex → index","Subdomain freigeben","#0f766e",true)}{farrow}{fnode("📈","GSC","Google Search Console","#0f766e",true)}</>)}
              {fphase("Phase 6 – Betrieb & Support","#f59e0b",<>{fnode("🔄","Leistungen aendern","Self-Service im Portal","#f59e0b")}{farrow}{fnode("⚡","Rate-Limit","2x pro 30 Tage","#f59e0b")}{farrow}{fnode("🤖","Sektion neu","Sonnet · direkt live","#f59e0b")}{farrow}{fnode("🎫","Support","Ticket-Formular","#f59e0b")}{farrow}{fnode("📸","Fotos updaten","serve-time · kein Rebuild","#f59e0b")}</>)}
              {fphase("Phase 7 – Ende des Abos",T.bg3,<>{fnode("❌","Kuendigung","Monatsabo: jederzeit · Jahresabo: nach 12 Mo",T.bg3)}{farrow}{fnode("🚫","Offline","subscription.deleted → status: offline",T.bg3)}{farrow}{fnode("🗑️","Daten loeschen","auf Wunsch",T.bg3,true)}</>)}
              <div style={{padding:"7px 10px",background:"#fef3c7",border:"1px solid #fde68a",borderRadius:T.rSm,fontSize:".75rem",color:"#92400e"}}>Phase 1 optional (nur wenn Bestandswebsite vorhanden) · Phase 5 noindex bis Production · Phase 7 erst nach Go-Live relevant.</div>
            </div>
            <div style={{fontSize:".8rem",fontWeight:700,color:T.dark,marginBottom:10}}>Technische Flows</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <div style={{background:T.bg,borderRadius:T.rSm,padding:"16px 18px",border:`1px solid ${T.bg3}`}}>
                {ftitle("🚀","Registrierung & Trial-Start")}
                {fphase("Formular","#3b82f6",<>{fnode("⚛️","React SPA","Wizard · 5 Schritte","#3b82f6")}{farrow}{fnode("👤","Account erstellen","Supabase Auth signUp","#2563eb")}{farrow}{fnode("💾","Supabase","INSERT orders · pending","#2563eb")}</>)}
                {fphase("Generierung starten","#8b5cf6",<>{fnode("🚀","start-build.js","JWT Auth · trial_expires_at +7d","#8b5cf6")}{farrow}{fnode("⚙️","generate-website","ctx.waitUntil · im Hintergrund","#f97316")}{farrow}{fnode("🔬","status: trial","nach Generierung","#8b5cf6")}</>)}
                {ftitle("💳","Abo-Abschluss (innerhalb Trial)")}
                {fphase("Plan waehlen","#16a34a",<>{fnode("🏠","Trial-Banner","Portal · Countdown","#16a34a")}{farrow}{fnode("💳","create-checkout","/api · plan · trial_days_left","#f97316")}</>)}
                {fphase("Stripe Subscription","#16a34a",<>{fnode("🔗","Checkout Session","mode:subscription · trial_period_days","#16a34a")}{farrow}{fnode("✅","Karte hinterlegt","Abbuchung erst Tag 8","#16a34a")}{farrow}{fnode("📨","Webhook","invoice.payment_succeeded","#f97316")}</>)}
                {fphase("Verarbeitung","#f97316",<>{fnode("🔐","Signatur","HMAC-SHA256 · 5 Min.","#f97316")}{farrow}{fnode("💾","stripe_customer_id","checkout.completed · PATCH","#2563eb")}{farrow}{fnode("🌍","status: live","invoice.paid · PATCH","#2563eb")}</>)}
              </div>
              <div style={{background:T.bg,borderRadius:T.rSm,padding:"16px 18px",border:`1px solid ${T.bg3}`}}>
                {ftitle("🤖","Website-Generierung")}
                {fphase("Trigger","#0891b2",<>{fnode("📝","Nach Registrierung","automatisch · kein Klick noetig","#0891b2")}{farrow}{fnode("🚀","start-build.js","trial_expires_at · +7 Tage","#0891b2")}{farrow}{fnode("⚙️","ctx.waitUntil","generate-website im HG","#f97316")}</>)}
                {fphase("Vorbereitung","#2563eb",<>{fnode("📖","Order laden","alle Kundendaten","#2563eb")}{farrow}{fnode("🎨","Stil + Palette","STYLES_MAP · Branche","#8b5cf6")}{farrow}{fnode("📝","System-Prompt","Regeln · Seitenstruktur","#8b5cf6")}</>)}
                {fphase("KI-Generierung","#8b5cf6",<>{fnode("🤖","Claude API","claude-sonnet-4-6","#8b5cf6")}{farrow}{fnode("🔧","Post-Processing","Nav · Footer · Maps","#f97316")}{farrow}{fnode("📍","Meta + Schema","robots:noindex · JSON-LD","#f97316")}</>)}
                {fphase("Abschluss","#059669",<>{fnode("🔬","status: trial","website_html gespeichert","#059669")}{farrow}{fnode("💰","Kosten","tokens_in/out · cost_eur","#2563eb")}</>)}
              </div>
              <div style={{background:T.bg,borderRadius:T.rSm,padding:"16px 18px",border:`1px solid ${T.bg3}`,gridColumn:"1 / -1"}}>
                {ftitle("🌍","Auslieferung (/s/[subdomain])")}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24}}>
                  <div>
                    <div style={{fontSize:".8rem",fontWeight:800,color:T.dark,marginBottom:10}}>Website – index.js</div>
                    {fphase("Request","#64748b",<>{fnode("🌐","GET /s/{sub}","Browser oder Bot","#64748b")}{farrow}{fnode("💾","Supabase","order laden","#2563eb")}{farrow}{fnode("✅","Status-Check","200 · 404 · 503","#f97316")}</>)}
                    {fphase("Injection","#f97316",<>{fnode("🖼️","Logo + Fotos","site-nav-logo · slots","#f97316")}{farrow}{fnode("🗄️","Galerie","GALERIE-Tag → Grid","#f97316")}{farrow}{fnode("📤","Response","Cache: max-age=60","#64748b")}</>)}
                  </div>
                  <div>
                    <div style={{fontSize:".8rem",fontWeight:800,color:T.dark,marginBottom:10}}>Impressum/Datenschutz – legal.js</div>
                    {fphase("Request","#64748b",<>{fnode("📋","GET /impressum","Link aus Footer","#64748b")}{farrow}{fnode("💾","Supabase","order by subdomain","#2563eb")}</>)}
                    {fphase("Aufbau","#2563eb",<>{fnode("⚖️","Impressum","ECG \u00a75 · Rechtsform","#2563eb")}{farrow}{fnode("🔒","Datenschutz","DSGVO Art.13","#2563eb")}{farrow}{fnode("📤","Response","immer frisch aus DB","#64748b")}</>)}
                  </div>
                </div>
              </div>
            </div>
          </div>);
        })()}

        {/* Tab: Dokumentation */}
        {tab==="docs"&&(<div style={{display:"flex",gap:0,height:"calc(100vh - 160px)",minHeight:400}}>
          {/* Linke Spalte: Inhaltsverzeichnis */}
          <div style={{width:220,flexShrink:0,borderRight:`1px solid ${T.bg3}`,overflowY:"auto",background:"#fafbfc"}}>
            <div style={{padding:"14px 12px 8px",borderBottom:`1px solid ${T.bg3}`}}>
              <span style={{fontSize:".8rem",fontWeight:800,color:T.dark}}>Inhalt</span>
            </div>
            {docsLoading
              ?<div style={{padding:20,textAlign:"center",color:T.textMuted,fontSize:".78rem"}}>Laden...</div>
              :<div style={{padding:"6px 0"}}>
                {(docs[0]?.content||"").split("\n").filter(l=>l.startsWith("## ")).map((l,i)=>{
                  const title=l.slice(3);
                  const id=slugify(title);
                  return <div key={i} onClick={()=>{const el=document.getElementById(id);if(el)el.scrollIntoView({behavior:"smooth",block:"start"});}} style={{padding:"8px 14px",cursor:"pointer",fontSize:".8rem",fontWeight:500,color:T.textSub,lineHeight:1.4,userSelect:"none"}}>{title}</div>;
                })}
              </div>
            }
          </div>
          {/* Rechte Spalte: Dokument */}
          <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
            <div style={{padding:"14px 24px",borderBottom:`1px solid ${T.bg3}`,display:"flex",alignItems:"center",gap:10,background:"#fff",flexShrink:0}}>
              <h2 style={{margin:0,fontSize:"1rem",fontWeight:800,color:T.dark,flex:1}}>SiteReady Dokumentation</h2>
              <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
                {!docEditing&&<>
                  <button onClick={exportMD} style={{padding:"5px 12px",border:`1px solid ${T.bg3}`,borderRadius:T.rSm,background:"#fff",color:T.textSub,cursor:"pointer",fontSize:".75rem",fontWeight:700,fontFamily:T.font}}>MD</button>
                  <button onClick={exportPDF} style={{padding:"5px 12px",border:`1px solid ${T.bg3}`,borderRadius:T.rSm,background:"#fff",color:T.textSub,cursor:"pointer",fontSize:".75rem",fontWeight:700,fontFamily:T.font}}>PDF</button>
                  <button onClick={()=>{const d=docs[0];if(d){setDocEditTitle(d.title);setDocEditContent(d.content||"");setDocEditing(true);}}} style={{padding:"5px 14px",border:"none",borderRadius:T.rSm,background:T.dark,color:"#fff",cursor:"pointer",fontSize:".78rem",fontWeight:700,fontFamily:T.font}}>Bearbeiten</button>
                </>}
                {docEditing&&<>
                  <button onClick={()=>setDocEditing(false)} style={{padding:"5px 12px",border:`1px solid ${T.bg3}`,borderRadius:T.rSm,background:"#fff",color:T.textSub,cursor:"pointer",fontSize:".78rem",fontWeight:600,fontFamily:T.font}}>Abbrechen</button>
                  <button onClick={saveDoc} disabled={docSaving} style={{padding:"5px 14px",border:"none",borderRadius:T.rSm,background:T.accent,color:"#fff",cursor:docSaving?"wait":"pointer",fontSize:".78rem",fontWeight:700,fontFamily:T.font}}>{docSaving?"Speichert...":"Speichern"}</button>
                </>}
              </div>
            </div>
            {docEditing
              ?<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",flex:1,minHeight:0}}>
                <textarea value={docEditContent} onChange={e=>setDocEditContent(e.target.value)} placeholder={"# Titel\n\n## Abschnitt\n\nText hier..."} style={{padding:"20px 24px",border:"none",borderRight:`1px solid ${T.bg3}`,resize:"none",fontFamily:"monospace",fontSize:".83rem",lineHeight:1.65,outline:"none",color:T.dark,background:"#fafbfc"}}/>
                <div style={{padding:"20px 24px",overflowY:"auto"}} dangerouslySetInnerHTML={{__html:renderMd(docEditContent)}}/>
              </div>
              :<div style={{padding:"24px 32px",flex:1,overflowY:"auto"}}>
                <div dangerouslySetInnerHTML={{__html:renderMd(docs[0]?.content||"")}}/>
              </div>
            }
          </div>
        </div>)}
      </>}
      </div>

      {/* Detail Drawer */}
      {sel&&(()=>{
        const selAgeMin=(Date.now()-new Date(sel.created_at).getTime())/(1000*60);
        const selStuckPending=sel.status==="pending"&&selAgeMin>120;
        const selStuckGen=sel.status==="in_arbeit"&&selAgeMin>15;
        const selHasFailed=!!sel.last_error;
        const selHealth=health[sel.id];
        const selHealthMap={checking:{label:"...",c:T.textMuted},ok:{label:"\u2713 Erreichbar",c:T.green},error:{label:"\u2717 Nicht erreichbar",c:"#dc2626"}};
        const selHInfo=selHealth&&selHealthMap[selHealth];
        const selMs=healthMs[sel.id];
        const selCheckedAt=healthTime[sel.id];
        const copyVal=(key,val)=>{navigator.clipboard?.writeText(val||"");setCopied(key);setTimeout(()=>setCopied(k=>k===key?null:k),1500);};
        const CopyBtn=({k,v})=>v?<button onClick={()=>copyVal(k,v)} title="Kopieren" style={{background:"none",border:"none",cursor:"pointer",padding:"2px 4px",color:copied===k?T.green:T.textMuted,fontSize:".75rem",lineHeight:1,flexShrink:0}}>{copied===k?"\u2713":"\u29c9"}</button>:null;
        const relTime=(iso)=>{if(!iso)return"";const m=Math.floor((Date.now()-new Date(iso).getTime())/60000);const h=Math.floor(m/60);const d=Math.floor(h/24);if(m<1)return"gerade";if(m<60)return`vor ${m} Min`;if(h<24)return`vor ${h} Std`;if(d<7)return`vor ${d}d`;return new Date(iso).toLocaleDateString("de-AT",{day:"2-digit",month:"2-digit"});};
        const logLabel=(action,details)=>{const d=details||{};switch(action){case"website_generated":return"Website erstmals generiert";case"website_regenerated":return"Website neu generiert";case"status_changed":return`Status: ${STATUS_LABELS[d.from]||d.from} \u2192 ${STATUS_LABELS[d.to]||d.to}`;case"offline":return"Offline genommen";case"online":return"Wieder online gesetzt";case"subdomain_changed":return`Subdomain: ${d.from} \u2192 ${d.to}`;case"stil_changed":return`Stil: ${d.from} \u2192 ${d.to}`;case"trial_extended":return`Trial +${d.days} Tage verlaengert`;case"ticket_created":return`Ticket erstellt: ${d.subject||""}`;case"ticket_answered":return`Ticket beantwortet: ${d.subject||""}`;case"checkout_completed":return`Checkout: ${d.plan||"monatlich"}`;case"payment_succeeded":return d.promoted_to_live?"Zahlung \u2192 Live geschaltet":"Zahlung erfolgreich";case"payment_failed":return"Zahlung fehlgeschlagen";case"subscription_canceled":return"Abo beendet";case"subscription_updated":return`Abo-Status: ${d.status||""}`;default:return action;}};
        const logIcon=(action)=>({"website_generated":"\u2728","website_regenerated":"\u21bb","status_changed":"\u21aa","offline":"\u23f8","online":"\u25b6","subdomain_changed":"\u270f","stil_changed":"\u25a3","trial_extended":"\u23e9","ticket_created":"\u2709","ticket_answered":"\u2713","checkout_completed":"\u2714","payment_succeeded":"\u2714","payment_failed":"\u26a0","subscription_canceled":"\u2716","subscription_updated":"\u21ba"}[action]||"\u25cf");
        return(<div onClick={e=>{if(e.target===e.currentTarget)setSel(null);}} style={{position:"fixed",inset:0,zIndex:2000,background:"rgba(0,0,0,.35)",display:"flex",alignItems:"center",justifyContent:"center",padding:"2.5vh 2.5vw"}}>
        <div style={{background:"#fff",borderRadius:14,width:"95vw",maxWidth:1600,maxHeight:"95vh",display:"flex",flexDirection:"column",boxShadow:"0 24px 80px rgba(0,0,0,.2)",overflowY:"auto"}}>
          {/* Modal Header */}
          <div style={{padding:"16px 24px",borderBottom:`1px solid ${T.bg3}`,display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,background:"#fff",zIndex:1,borderRadius:"12px 12px 0 0"}}>
            <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
              <h3 style={{margin:0,fontSize:"1.1rem",fontWeight:800,color:T.dark}}>{sel.firmenname||"—"}</h3>
              <StatusBadge status={sel.status}/>
              {selHInfo&&<span style={{padding:"2px 8px",borderRadius:20,background:selHInfo.c+"18",color:selHInfo.c,fontSize:".75rem",fontWeight:700}}>{selHInfo.label}</span>}
              {(selStuckPending||selStuckGen)&&<span style={{padding:"2px 8px",borderRadius:20,background:"#fff7ed",color:"#92400e",fontSize:".75rem",fontWeight:700}}>&#9888; {selStuckPending?"Eingang >2h":"Generierung >15min"}</span>}
              {selHasFailed&&<span style={{padding:"2px 8px",borderRadius:20,background:"#fef2f2",color:"#991b1b",fontSize:".75rem",fontWeight:700}}>&#9888; Fehler</span>}
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              {(selStuckPending||selStuckGen||selHasFailed)&&<button onClick={()=>generateWebsite(sel.id)} disabled={genLoading[sel.id]} style={{padding:"6px 14px",border:"none",borderRadius:T.rSm,background:genLoading[sel.id]?T.bg3:selHasFailed?"#dc2626":"#f59e0b",color:"#fff",cursor:"pointer",fontSize:".78rem",fontWeight:700,fontFamily:T.font}}>{genLoading[sel.id]?"...":selHasFailed?"Retry":"Neu starten"}</button>}
              <button onClick={()=>setSel(null)} style={{background:"none",border:"none",fontSize:"1.4rem",cursor:"pointer",color:T.textMuted,padding:"4px 8px",lineHeight:1}}>&times;</button>
            </div>
          </div>
          {selHasFailed&&<div style={{margin:"0 24px",marginTop:12,padding:"10px 14px",background:"#fef2f2",border:"1px solid #fecaca",borderRadius:T.rSm,fontSize:".78rem",color:"#991b1b",lineHeight:1.5,wordBreak:"break-word",display:"flex",alignItems:"flex-start",gap:12,justifyContent:"space-between"}}>
            <span style={{fontFamily:T.mono}}><strong style={{fontFamily:T.font}}>Letzter Fehler: </strong>{sel.last_error}</span>
            <button onClick={()=>updateOrder(sel.id,{last_error:null}).then(()=>setSel(s=>({...s,last_error:null})))} style={{flexShrink:0,padding:"3px 10px",border:"1px solid #fecaca",borderRadius:T.rSm,background:"#fff",color:"#991b1b",cursor:"pointer",fontSize:".75rem",fontWeight:700,fontFamily:T.font,whiteSpace:"nowrap"}}>&#10003; Abgehakt</button>
          </div>}
          {/* Diagnose-Panel */}
          {diagReport&&<div style={{margin:"12px 24px 0",padding:"18px 24px",background:T.bg,borderRadius:T.rSm,border:`1px solid ${T.bg3}`}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
              <div style={{fontSize:".8rem",fontWeight:700,color:T.dark}}>Diagnose</div>
              <button onClick={()=>setDiagReport(null)} style={{background:"none",border:"none",cursor:"pointer",color:T.textMuted,fontSize:".85rem",lineHeight:1}}>&times;</button>
            </div>
            <div style={{display:"flex",gap:24,marginBottom:diagReport.issues.some(i=>i.severity!=="ok")?10:0}}>
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {diagReport.info.map((i,idx)=><div key={idx} style={{fontSize:".75rem"}}><span style={{color:T.textMuted}}>{i.label}: </span><strong style={{color:T.dark}}>{i.value}</strong></div>)}
              </div>
            </div>
            {diagReport.issues.map((i,idx)=>{const c=i.severity==="ok"?T.green:i.severity==="warn"?"#d97706":"#dc2626";return(
              <div key={idx} style={{display:"flex",alignItems:"flex-start",gap:8,padding:"5px 0",borderTop:idx>0?`1px solid ${T.bg3}`:"none"}}>
                <span style={{width:7,height:7,borderRadius:"50%",background:c,flexShrink:0,marginTop:5}}/>
                <span style={{fontSize:".8rem",color:i.severity==="ok"?T.green:T.dark,fontWeight:i.severity==="error"?600:400}}>{i.msg}</span>
              </div>
            );})}
          </div>}
          {/* Drei Spalten */}
          <div style={{display:"grid",gridTemplateColumns:"2fr 2fr 1.5fr",gap:0,minHeight:400}}>
            {/* Linke Spalte: Kundendaten */}
            <div style={{padding:"24px 28px",borderRight:`1px solid ${T.bg3}`,overflowY:"auto"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
                <div style={{fontSize:".8rem",fontWeight:700,color:T.dark}}>Kundendaten</div>
                {!editKunde
                  ?<button onClick={()=>setEditKunde({firmenname:sel.firmenname||"",email:sel.email||"",telefon:sel.telefon||"",adresse:sel.adresse||"",plz:sel.plz||"",ort:sel.ort||""})} style={{background:"none",border:"none",cursor:"pointer",padding:4,color:T.textMuted,fontSize:".85rem",lineHeight:1}} title="Bearbeiten">{"\u270f"}</button>
                  :<div style={{display:"flex",gap:6}}>
                    <button onClick={async()=>{await updateOrder(sel.id,editKunde);setEditKunde(null);}} style={{padding:"3px 10px",border:"none",borderRadius:T.rSm,background:T.accent,color:"#fff",cursor:"pointer",fontSize:".75rem",fontWeight:700,fontFamily:T.font}}>Speichern</button>
                    <button onClick={()=>setEditKunde(null)} style={{padding:"3px 10px",border:`1px solid ${T.bg3}`,borderRadius:T.rSm,background:"#fff",color:T.textSub,cursor:"pointer",fontSize:".75rem",fontWeight:600,fontFamily:T.font}}>Abbrechen</button>
                  </div>
                }
              </div>
              {editKunde
                ?<div style={{display:"flex",flexDirection:"column",gap:8}}>
                    {[["Firmenname","firmenname"],["E-Mail","email"],["Telefon","telefon"],["Adresse","adresse"],["PLZ","plz"],["Ort","ort"]].map(([l,k])=><div key={k} style={{display:"grid",gridTemplateColumns:"100px 1fr",alignItems:"center",gap:8,fontSize:".83rem"}}>
                      <span style={{color:T.textMuted,fontWeight:600}}>{l}</span>
                      <input value={editKunde[k]} onChange={e=>setEditKunde(ev=>({...ev,[k]:e.target.value}))} style={{padding:"6px 10px",border:`2px solid ${T.bg3}`,borderRadius:T.rSm,fontSize:".82rem",fontFamily:T.font,outline:"none",background:"#fff",width:"100%",boxSizing:"border-box"}}/>
                    </div>)}
                  <div style={{marginTop:10,padding:"8px 10px",borderRadius:T.rSm,background:"#eff6ff",border:"1px solid #bfdbfe",fontSize:".75rem",color:"#1e40af",lineHeight:1.6}}>
                    <strong>E-Mail, Telefon, Adresse:</strong> sofort live (serve-time).<br/>
                    <strong>Subdomain:</strong> URL ändert sich sofort &ndash; danach Website neu generieren.
                  </div>
                  </div>
                :<div style={{display:"flex",flexDirection:"column",gap:0}}>
                  {(()=>{const gb=GRUPPE_BADGE[getBrancheGruppe(sel.branche)];return(<div style={{display:"grid",gridTemplateColumns:"110px 1fr",padding:"9px 0",borderBottom:`1px solid ${T.bg3}`,fontSize:".83rem"}}><span style={{color:T.textMuted,fontWeight:500}}>Berufsgruppe</span><span style={{display:"inline-flex",alignItems:"center",gap:5}}><span style={{padding:"1px 8px",borderRadius:20,background:gb.bg,color:gb.c,fontSize:".75rem",fontWeight:700}}>{gb.icon} {gb.label}</span></span></div>);})()}
                  {(()=>{
                    const _selExp=sel.trial_expires_at||(sel.created_at?new Date(new Date(sel.created_at).getTime()+7*24*60*60*1000).toISOString():null);
                    const trialLeft=sel.status==="trial"&&_selExp?Math.ceil((new Date(_selExp)-Date.now())/(1000*60*60*24)):null;
                    const planLabel=sel.subscription_plan==="yearly"?"\u20AC183.60 / Jahr":sel.subscription_plan==="monthly"?"\u20AC18 / Monat":null;
                    const zMap={active:{label:"\u2713 Aktiv",c:T.green},past_due:{label:"\u26a0 Zahlung offen",c:"#d97706"},canceled:{label:"\u25cb Gekündigt",c:"#64748b"}};
                    const zv=sel.stripe_customer_id?(zMap[sel.subscription_status]||{label:"Unbekannt",c:T.textMuted}):null;
                    let zahlungContent;
                    const extendTrial=(days)=>{const base=sel.trial_expires_at?new Date(sel.trial_expires_at):new Date();base.setDate(base.getDate()+days);const iso=base.toISOString();updateOrder(sel.id,{trial_expires_at:iso});setSel(s=>({...s,trial_expires_at:iso}));logActivity(sel.id,"trial_extended",{days});};
                    if(sel.status==="trial"){
                      zahlungContent=<span style={{display:"inline-flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                        <span style={{padding:"2px 8px",borderRadius:4,background:"#8b5cf622",color:"#8b5cf6",fontWeight:700,fontSize:".75rem"}}>Testphase</span>
                        <span style={{fontSize:".78rem",color:trialLeft!==null&&trialLeft<=2?"#dc2626":"#6b7280",fontWeight:600}}>{trialLeft!==null?(trialLeft>0?`${trialLeft} Tag(e) verbleibend`:"Abgelaufen"):"—"}</span>
                        {planLabel&&<span style={{fontSize:".75rem",color:T.textMuted}}>{planLabel}</span>}
                        <button onClick={()=>extendTrial(7)} style={{padding:"1px 7px",border:`1px solid #8b5cf6`,borderRadius:4,background:"#fff",color:"#8b5cf6",cursor:"pointer",fontSize:".75rem",fontWeight:700,fontFamily:T.font}}>+7d</button>
                        <button onClick={()=>extendTrial(14)} style={{padding:"1px 7px",border:`1px solid #8b5cf6`,borderRadius:4,background:"#fff",color:"#8b5cf6",cursor:"pointer",fontSize:".75rem",fontWeight:700,fontFamily:T.font}}>+14d</button>
                      </span>;
                    } else if(zv){
                      zahlungContent=<span style={{display:"inline-flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                        <span style={{padding:"2px 8px",borderRadius:4,background:zv.c+"22",color:zv.c,fontWeight:700,fontSize:".75rem"}}>{zv.label}</span>
                        {planLabel&&<span style={{fontSize:".75rem",color:T.textMuted}}>{planLabel}</span>}
                        {sel.stripe_customer_id&&<span style={{fontSize:".75rem",color:T.textMuted,fontFamily:T.mono}}>{sel.stripe_customer_id}</span>}
                      </span>;
                    } else {
                      zahlungContent=<span style={{fontSize:".78rem",color:T.textMuted}}>{["pending","in_arbeit"].includes(sel.status)?"—":"Kein Abo"}</span>;
                    }
                    return(<div style={{display:"grid",gridTemplateColumns:"110px 1fr",padding:"9px 0",borderBottom:`1px solid ${T.bg3}`,fontSize:".83rem"}}>
                      <span style={{color:T.textMuted,fontWeight:600}}>Zahlung</span>
                      {zahlungContent}
                    </div>);
                  })()}
                  {[["E-Mail",sel.email],["Branche",sel.branche_label],["Telefon",sel.telefon],["Adresse",[sel.adresse,[sel.plz,sel.ort].filter(Boolean).join(" ")].filter(Boolean).join(", ")],["UID",sel.uid_nummer],["Rechtsform",sel.unternehmensform],["Firmenbuch",sel.firmenbuchnummer],["GISA",sel.gisazahl],["Fotos",sel.fotos?"Ja":"Nein"],["Bestellt",fmtDate(sel.created_at)]].map(([l,v])=>v?<div key={l} style={{display:"grid",gridTemplateColumns:"110px 1fr",padding:"9px 0",borderBottom:`1px solid ${T.bg3}`,fontSize:".83rem"}}>
                    <span style={{color:T.textMuted,fontWeight:600}}>{l}</span>
                    <span style={{display:"flex",alignItems:"center",gap:4,color:T.dark}}>
                      <span>{v}</span>
                      {(l==="E-Mail"||l==="Subdomain")&&<CopyBtn k={l} v={v}/>}
                    </span>
                  </div>:null)}
                </div>
              }
            </div>
            {/* Mittlere Spalte: Aktionen */}
            {(()=>{
              const cardTitle=(label)=><div style={{fontSize:".8rem",fontWeight:700,color:T.dark,marginBottom:10}}>{label}</div>;
              const card=(children)=><div style={{padding:"16px",background:T.bg,borderRadius:T.rSm,border:`1px solid ${T.bg3}`}}>{children}</div>;
              const secStyle={padding:"14px 16px",background:T.bg,borderRadius:T.rSm,border:`1px solid ${T.bg3}`};
              return(<div style={{padding:"24px 28px",display:"flex",flexDirection:"column",gap:12,borderRight:`1px solid ${T.bg3}`,overflowY:"auto"}}>
                {/* Links */}
                {sel.subdomain&&<div style={secStyle}>
                  {cardTitle("Links")}
                  <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                    <a href={`https://sitereadyprototype.pages.dev/s/${sel.subdomain}`} target="_blank" rel="noopener noreferrer" style={{padding:"8px 16px",background:T.accent,color:"#fff",borderRadius:T.rSm,fontSize:".8rem",fontWeight:700,textDecoration:"none",fontFamily:T.font}}>Website {"\u2197"}</a>
                    <a href={`https://sitereadyprototype.pages.dev/s/${sel.subdomain}/vcard`} target="_blank" rel="noopener noreferrer" style={{padding:"8px 12px",border:`2px solid ${T.bg3}`,borderRadius:T.rSm,background:"#fff",color:T.textSub,fontSize:".78rem",fontWeight:600,textDecoration:"none",fontFamily:T.font}}>Vcard {"\u2197"}</a>
                    {sel.stripe_customer_id&&<a href={`https://dashboard.stripe.com/customers/${sel.stripe_customer_id}`} target="_blank" rel="noopener noreferrer" style={{padding:"8px 12px",border:`2px solid ${T.bg3}`,borderRadius:T.rSm,background:"#fff",color:T.textSub,fontSize:".78rem",fontWeight:600,textDecoration:"none",fontFamily:T.font}}>Stripe {"\u2197"}</a>}
                  </div>
                </div>}
                {/* Health-Check */}
                <div style={secStyle}>
                  {cardTitle("Health-Check")}
                  <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                    {selHInfo
                      ?<span style={{color:selHInfo.c,fontWeight:700,fontSize:".85rem"}}>{selHInfo.label}{selMs?<span style={{fontWeight:400,color:T.textMuted,fontFamily:T.mono,fontSize:".78rem"}}> &middot; {selMs}ms</span>:null}</span>
                      :<span style={{fontSize:".82rem",color:T.textMuted}}>Noch nicht geprueft</span>}
                    <button onClick={()=>checkHealth(sel)} style={{padding:"5px 12px",border:`1px solid ${T.bg3}`,borderRadius:T.rSm,background:"#fff",color:T.textSub,cursor:"pointer",fontSize:".75rem",fontWeight:600,fontFamily:T.font}}>Jetzt pruefen</button>
                  </div>
                  {selCheckedAt&&<div style={{fontSize:".75rem",color:T.textMuted,marginTop:4}}>Letzter Check: {selCheckedAt.toLocaleTimeString("de-AT")}</div>}
                  {sel.quality_score!==null&&sel.quality_score!==undefined&&<div style={{marginTop:8}}>
                    <div style={{fontSize:".78rem"}}><span style={{color:T.textMuted}}>Quality Score: </span><span style={{fontWeight:700,color:sel.quality_score>=80?T.green:"#d97706"}}>{sel.quality_score}/100</span></div>
                    {sel.quality_score<100&&<div style={{marginTop:6,display:"flex",flexDirection:"column",gap:3}}>
                      {!sel.url_logo&&<div style={{fontSize:".75rem",color:"#d97706"}}>+ Logo hochladen wuerde Score erhoehen</div>}
                      {!(sel.url_foto1||sel.url_foto2||sel.url_foto3)&&<div style={{fontSize:".75rem",color:"#d97706"}}>+ Fotos hochladen fuer besseren Score</div>}
                      {!sel.telefon&&<div style={{fontSize:".75rem",color:"#d97706"}}>+ Telefonnummer fehlt</div>}
                      {!sel.kurzbeschreibung&&<div style={{fontSize:".75rem",color:"#d97706"}}>+ Kurzbeschreibung fehlt</div>}
                      {(!sel.leistungen||sel.leistungen.length<3)&&<div style={{fontSize:".75rem",color:"#d97706"}}>+ Mindestens 3 Leistungen empfohlen</div>}
                    </div>}
                  </div>}
                </div>
                {/* --- AKTIONEN --- */}
                <div style={secStyle}>
                {cardTitle("Aktionen")}
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {/* Generieren */}
                  <div>
                    {sel.website_html
                      ?regenConfirm===sel.id
                        ?<button onClick={()=>setRegenConfirm(null)} style={{padding:"8px 16px",border:`2px solid ${T.bg3}`,borderRadius:T.rSm,background:"#fff",color:T.textSub,cursor:"pointer",fontSize:".82rem",fontWeight:700,fontFamily:T.font}}>Abbrechen</button>
                        :<button onClick={()=>setRegenConfirm(sel.id)} disabled={genLoading[sel.id]} style={{padding:"8px 16px",border:"none",borderRadius:T.rSm,background:genLoading[sel.id]?T.bg3:T.dark,color:"#fff",cursor:genLoading[sel.id]?"wait":"pointer",fontSize:".82rem",fontWeight:700,fontFamily:T.font}}>{genLoading[sel.id]?"Generiert (ca. 30s)...":"Website neu generieren"}</button>
                      :<button onClick={()=>generateWebsite(sel.id)} disabled={genLoading[sel.id]} style={{padding:"8px 16px",border:"none",borderRadius:T.rSm,background:genLoading[sel.id]?T.bg3:T.dark,color:"#fff",cursor:genLoading[sel.id]?"wait":"pointer",fontSize:".82rem",fontWeight:700,fontFamily:T.font}}>{genLoading[sel.id]?"Generiert (ca. 30s)...":`\u2728 Website generieren`}</button>}
                  </div>
                  {regenConfirm===sel.id&&<div style={{background:"#fff7ed",border:"1px solid #fed7aa",borderRadius:T.rSm,padding:"12px 14px"}}>
                    <div style={{fontSize:".78rem",fontWeight:700,color:"#92400e",marginBottom:8}}>Bestehende Website wird ueberschrieben.</div>
                    <button onClick={()=>{setRegenConfirm(null);generateWebsite(sel.id);}} style={{padding:"7px 14px",border:"none",borderRadius:T.rSm,background:T.dark,color:"#fff",cursor:"pointer",fontSize:".78rem",fontWeight:700,fontFamily:T.font}}>Bestaetigen: Neu generieren</button>
                  </div>}
                  {genMsg[sel.id]&&<div style={{fontSize:".78rem",color:genMsg[sel.id].startsWith("Fehler")||genMsg[sel.id].startsWith("Netzwerk")?T.red:T.green,fontWeight:600}}>{genMsg[sel.id]}</div>}
                  {/* Diagnose */}
                  <button onClick={()=>diagnoseOrder(sel)} disabled={diagRunning} style={{padding:"8px 16px",border:`2px solid ${T.bg3}`,borderRadius:T.rSm,background:diagReport?"#fff":T.bg,color:T.textSub,cursor:diagRunning?"wait":"pointer",fontSize:".82rem",fontWeight:600,fontFamily:T.font,alignSelf:"flex-start"}}>{diagRunning?"Diagnose laeuft...":diagReport?"Erneut pruefen":"Diagnose starten"}</button>
                  {sel.website_html&&<button onClick={()=>{const w=window.open("","_blank");if(w){w.document.open();w.document.write(sel.website_html);w.document.close();}}} style={{padding:"8px 16px",border:`2px solid ${T.bg3}`,borderRadius:T.rSm,background:"#fff",color:T.textSub,cursor:"pointer",fontSize:".82rem",fontWeight:600,fontFamily:T.font,alignSelf:"flex-start"}}>HTML anzeigen</button>}
                  <div style={{display:"flex",gap:8}}>
                    {sel.status==="offline"
                      ?<button onClick={()=>{updateOrder(sel.id,{status:"live"});logActivity(sel.id,"online");}} style={{flex:1,padding:"8px 16px",border:"2px solid #16a34a",borderRadius:T.rSm,background:"#fff",color:"#16a34a",cursor:"pointer",fontSize:".82rem",fontWeight:700,fontFamily:T.font}}>Wieder online</button>
                      :<>
                        {offlineConfirm===sel.id
                          ?<button onClick={()=>setOfflineConfirm(null)} style={{flex:1,padding:"8px 16px",border:"2px solid #94a3b8",borderRadius:T.rSm,background:"#fff",color:"#64748b",cursor:"pointer",fontSize:".82rem",fontWeight:700,fontFamily:T.font}}>Abbrechen</button>
                          :<button onClick={()=>sel.website_html&&setOfflineConfirm(sel.id)} disabled={!sel.website_html} style={{flex:1,padding:"8px 16px",border:"2px solid #64748b",borderRadius:T.rSm,background:"#fff",color:sel.website_html?"#64748b":"#cbd5e1",cursor:sel.website_html?"pointer":"default",fontSize:".82rem",fontWeight:700,fontFamily:T.font}}>Offline nehmen</button>}
                      </>}
                    {deleteConfirm===sel.id
                      ?<button onClick={()=>setDeleteConfirm(null)} style={{flex:1,padding:"8px 16px",border:"2px solid #94a3b8",borderRadius:T.rSm,background:"#fff",color:"#64748b",cursor:"pointer",fontSize:".82rem",fontWeight:700,fontFamily:T.font}}>Abbrechen</button>
                      :<button onClick={()=>setDeleteConfirm(sel.id)} style={{flex:1,padding:"8px 16px",border:"2px solid #ef4444",borderRadius:T.rSm,background:"#fff",color:"#ef4444",cursor:"pointer",fontSize:".82rem",fontWeight:700,fontFamily:T.font}}>Kunden loeschen</button>}
                  </div>
                </div>
                {offlineConfirm===sel.id&&<div style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:T.rSm,padding:"12px 14px"}}>
                  <div style={{fontSize:".78rem",color:"#475569",marginBottom:8}}>Website wird fuer Besucher nicht mehr erreichbar sein.</div>
                  <button onClick={()=>{updateOrder(sel.id,{status:"offline"});setOfflineConfirm(null);logActivity(sel.id,"offline");}} style={{padding:"7px 14px",border:"none",borderRadius:T.rSm,background:"#64748b",color:"#fff",cursor:"pointer",fontSize:".78rem",fontWeight:700,fontFamily:T.font}}>Bestaetigen: Offline nehmen</button>
                </div>}
                {deleteConfirm===sel.id&&<div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:T.rSm,padding:"12px 14px"}}>
                  <div style={{fontSize:".75rem",color:"#991b1b",marginBottom:8,lineHeight:1.6}}><strong>Achtung – unwiderruflich:</strong> Es werden geloescht: Bestellung, Auth-Account, alle hochgeladenen Fotos und Support-Anfragen des Kunden.</div>
                  <div style={{fontSize:".78rem",fontWeight:700,color:"#991b1b",marginBottom:8}}>Zur Bestaetigung "LOESCHEN" eintippen:</div>
                  <div style={{display:"flex",gap:6}}>
                    <input id="del-confirm-input" autoFocus placeholder="LOESCHEN" style={{flex:1,padding:"7px 10px",border:"2px solid #fca5a5",borderRadius:T.rSm,fontSize:".82rem",fontFamily:"monospace",outline:"none",background:"#fff"}}/>
                    <button onClick={()=>{const v=document.getElementById("del-confirm-input")?.value||"";if(v==="LOESCHEN")deleteOrder(sel.id);}} style={{padding:"7px 14px",border:"none",borderRadius:T.rSm,background:"#ef4444",color:"#fff",cursor:"pointer",fontSize:".78rem",fontWeight:700,fontFamily:T.font}}>Loeschen</button>
                  </div>
                </div>}
                </div>{/* Ende Aktionen secStyle */}
                {/* Subdomain & Stil */}
                {(()=>{
                  const sc=siteConfig[sel.id]||{subdomain:sel.subdomain||"",stil:sel.stil||"professional",editing:false};
                  const editing=!!sc.editing;
                  const setsc=v=>setSiteConfig(c=>({...c,[sel.id]:{...sc,...v}}));
                  const dirty=sc.subdomain!==(sel.subdomain||"")||sc.stil!==(sel.stil||"professional");
                  const save=async()=>{
                    const oldSub=sel.subdomain||"";const oldStil=sel.stil||"professional";
                    await updateOrder(sel.id,{subdomain:sc.subdomain,stil:sc.stil});
                    setSel(s=>({...s,subdomain:sc.subdomain,stil:sc.stil}));setsc({editing:false});
                    if(sc.subdomain!==oldSub)logActivity(sel.id,"subdomain_changed",{from:oldSub,to:sc.subdomain});
                    if(sc.stil!==oldStil)logActivity(sel.id,"stil_changed",{from:oldStil,to:sc.stil});
                  };
                  const cancel=()=>setsc({subdomain:sel.subdomain||"",stil:sel.stil||"professional",editing:false});
                  return(<div style={{...secStyle,borderStyle:"dashed"}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                      <div style={{fontSize:".8rem",fontWeight:700,color:T.dark}}>Subdomain & Stil</div>
                      {!editing&&<button onClick={()=>setsc({editing:true})} title="Bearbeiten" style={{background:"none",border:"none",cursor:"pointer",padding:"2px 5px",color:T.textMuted,fontSize:".85rem",lineHeight:1}}>{"\u270f"}</button>}
                    </div>
                    {!editing
                      ?<div style={{display:"flex",flexDirection:"column",gap:4}}>
                          <div style={{fontSize:".8rem"}}><span style={{color:T.textMuted}}>Subdomain: </span><span style={{fontFamily:T.mono,color:T.dark}}>{sel.subdomain||"\u2014"}</span></div>
                          <div style={{fontSize:".8rem"}}><span style={{color:T.textMuted}}>Stil: </span><span style={{color:T.dark}}>{STYLES_MAP[sel.stil||"professional"]?.label||sel.stil||"Professional"}</span></div>
                        </div>
                      :<div style={{display:"flex",flexDirection:"column",gap:6}}>
                          <input value={sc.subdomain} onChange={e=>setsc({subdomain:e.target.value})} placeholder="Subdomain" style={{padding:"6px 10px",border:`2px solid ${T.bg3}`,borderRadius:T.rSm,fontSize:".82rem",fontFamily:T.mono,outline:"none",background:"#fff",width:"100%",boxSizing:"border-box"}}/>
                          <select value={sc.stil} onChange={e=>setsc({stil:e.target.value})} style={{padding:"6px 10px",border:`2px solid ${T.bg3}`,borderRadius:T.rSm,fontSize:".82rem",fontFamily:T.font,outline:"none",background:"#fff"}}>
                            {Object.entries(STYLES_MAP).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
                          </select>
                          <div style={{display:"flex",gap:6}}>
                            <button onClick={cancel} style={{flex:1,padding:"6px",border:`1px solid ${T.bg3}`,borderRadius:T.rSm,background:"#fff",color:T.textSub,cursor:"pointer",fontSize:".75rem",fontWeight:700,fontFamily:T.font}}>Abbrechen</button>
                            <button onClick={save} disabled={!dirty} style={{flex:1,padding:"6px",border:"none",borderRadius:T.rSm,background:dirty?T.dark:"#e2e8f0",color:dirty?"#fff":T.bg3,cursor:dirty?"pointer":"default",fontSize:".75rem",fontWeight:700,fontFamily:T.font}}>Speichern</button>
                          </div>
                          <div style={{fontSize:".75rem",color:"#92400e"}}>Danach Website neu generieren</div>
                        </div>
                    }
                  </div>);
                })()}
                {/* Notfall: Status setzen */}
                <div style={{padding:"12px 16px",background:T.bg,borderRadius:T.rSm,border:`1px solid ${T.bg3}`}}>
                  <button onClick={()=>setShowStatusOverride(s=>!s)} style={{background:"none",border:"none",cursor:"pointer",padding:0,fontFamily:T.font,display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%"}}>
                    <span style={{fontSize:".8rem",fontWeight:700,color:T.textMuted}}>Notfall: Status setzen</span>
                    <span style={{fontSize:".75rem",color:T.textMuted,transition:"transform .2s",display:"inline-block",transform:showStatusOverride?"rotate(180deg)":"rotate(0deg)"}}>{"\u25bc"}</span>
                  </button>
                  {showStatusOverride&&<div style={{marginTop:10,display:"flex",flexWrap:"wrap",gap:6}}>
                    {[{s:"pending",label:"Eingang"},{s:"in_arbeit",label:"In Generierung"},{s:"trial",label:"Testphase"},{s:"live",label:"Live"},{s:"offline",label:"Offline"}].map(({s,label})=>(
                      <button key={s} onClick={sel.status!==s?()=>{const prev=sel.status;updateOrder(sel.id,{status:s});logActivity(sel.id,"status_changed",{from:prev,to:s});}:undefined} disabled={sel.status===s} style={{padding:"5px 10px",border:`2px solid ${sel.status===s?STATUS_COLORS[s]||T.accent:T.bg3}`,borderRadius:T.rSm,background:sel.status===s?(STATUS_COLORS[s]||T.accent)+"18":"#fff",color:sel.status===s?STATUS_COLORS[s]||T.accent:T.textSub,cursor:sel.status===s?"default":"pointer",fontSize:".75rem",fontWeight:700,fontFamily:T.font}}>{label}{sel.status===s?` \u2713`:""}</button>
                    ))}
                  </div>}
                </div>
              </div>);
            })()}
            {/* Rechte Spalte: Notiz, Tickets */}
            <div style={{padding:"24px 28px",overflowY:"auto",display:"flex",flexDirection:"column",gap:16}}>
              {/* Interne Notiz */}
              <div>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
                  <div style={{fontSize:".8rem",fontWeight:700,color:T.dark}}>Interne Notiz</div>
                  <button onClick={()=>saveNotiz(sel.id)} title="Speichern" style={{background:"none",border:"none",cursor:"pointer",padding:4,color:notizSaved[sel.id]?T.green:T.textMuted,fontSize:".85rem",lineHeight:1}}>
                    {notizSaved[sel.id]?"\u2713":"\u270f"}
                  </button>
                </div>
                <textarea value={notiz[sel.id]||""} onChange={e=>setNotiz(n=>({...n,[sel.id]:e.target.value}))} placeholder="Notiz hinzufuegen..." rows={5} style={{width:"100%",padding:"10px 12px",border:`2px solid ${T.bg3}`,borderRadius:T.rSm,fontSize:".82rem",fontFamily:T.font,resize:"vertical",boxSizing:"border-box",outline:"none",background:"#fff"}}/>
              </div>
              {/* Support-Tickets */}
              {(()=>{
                const selTickets=tickets.filter(t=>t.email&&sel.email&&t.email.toLowerCase()===sel.email.toLowerCase());
                return(<div>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                    <div style={{fontSize:".8rem",fontWeight:700,color:T.dark}}>Support-Tickets{selTickets.length>0?` (${selTickets.length})`:""}</div>
                    <button onClick={()=>{setTicketForm(f=>({...f,email:sel.email||""}));setTicketFormOpen(true);setTab("support");setSel(null);}} style={{background:"none",border:"none",cursor:"pointer",fontSize:".75rem",color:T.accent,fontWeight:700,fontFamily:T.font,padding:0}}>+ Neu</button>
                  </div>
                  {selTickets.length===0
                    ?<div style={{fontSize:".8rem",color:T.textMuted,padding:"8px 0"}}>Noch keine Tickets.</div>
                    :<div style={{display:"flex",flexDirection:"column",gap:6,maxHeight:200,overflowY:"auto"}}>
                      {selTickets.map(t=><div key={t.id} style={{padding:"10px 12px",background:T.bg,borderRadius:T.rSm,border:`1px solid ${t.status==="offen"?"#fde68a":T.bg3}`}}>
                        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:3,gap:6}}>
                          <span style={{fontWeight:700,fontSize:".78rem",color:T.dark,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.subject||"Allgemein"}</span>
                          <span style={{padding:"1px 7px",borderRadius:4,background:t.status==="offen"?"#fef3c7":"#f0fdf4",color:t.status==="offen"?"#92400e":T.green,fontSize:".75rem",fontWeight:700,flexShrink:0}}>{t.status==="offen"?"Offen":"Erledigt"}</span>
                        </div>
                        <div style={{fontSize:".75rem",color:T.textMuted}}>{fmtDate(t.created_at)}</div>
                        {t.status==="offen"&&<button onClick={()=>updateTicket(t.id,{status:"beantwortet"}).then(()=>setTickets(ts=>ts.map(x=>x.id===t.id?{...x,status:"beantwortet"}:x)))} style={{marginTop:4,padding:"3px 10px",border:`1px solid ${T.bg3}`,borderRadius:T.rSm,background:"#fff",color:T.textSub,cursor:"pointer",fontSize:".75rem",fontWeight:600,fontFamily:T.font}}>Beantwortet</button>}
                      </div>)}
                    </div>
                  }
                </div>);
              })()}
              {/* Aktivitaetslog */}
              <div>
                <div style={{fontSize:".8rem",fontWeight:700,color:T.dark,marginBottom:8}}>Aktivitaetslog</div>
                {logsLoading[sel.id]
                  ?<div style={{fontSize:".8rem",color:T.textMuted}}>Laedt...</div>
                  :(orderLogs[sel.id]||[]).length===0
                    ?<div style={{fontSize:".8rem",color:T.textMuted}}>Noch keine Aktivitaeten.</div>
                    :<div style={{display:"flex",flexDirection:"column",gap:4,maxHeight:220,overflowY:"auto"}}>
                        {(orderLogs[sel.id]||[]).map(log=>(
                          <div key={log.id} style={{display:"flex",alignItems:"flex-start",gap:8,padding:"7px 10px",background:T.bg,borderRadius:T.rSm,border:`1px solid ${T.bg3}`}}>
                            <span style={{fontSize:".8rem",flexShrink:0,minWidth:16,textAlign:"center"}}>{logIcon(log.action)}</span>
                            <div style={{flex:1,minWidth:0}}>
                              <div style={{fontSize:".77rem",color:T.dark,fontWeight:600,lineHeight:1.3}}>{logLabel(log.action,log.details)}</div>
                              {log.actor==="system"&&<div style={{fontSize:".75rem",color:T.textMuted}}>via Stripe</div>}
                            </div>
                            <div style={{fontSize:".75rem",color:T.textMuted,flexShrink:0,whiteSpace:"nowrap",paddingTop:1}}>{relTime(log.created_at)}</div>
                          </div>
                        ))}
                      </div>
                }
              </div>
              {/* Backup (Platzhalter) */}
              <div style={{padding:"12px 14px",background:T.bg,borderRadius:T.rSm,border:`1px dashed ${T.bg3}`}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <div style={{fontSize:".8rem",fontWeight:700,color:T.dark}}>Backup</div>
                  <span style={{padding:"2px 8px",borderRadius:20,background:"#f1f5f9",color:T.textMuted,fontSize:".75rem",fontWeight:700}}>Kommt bald</span>
                </div>
                <div style={{marginTop:6,fontSize:".78rem",color:T.textMuted,lineHeight:1.5}}>Website-Backups und Wiederherstellung.</div>
              </div>
            </div>
          </div>
          {/* Prozess-Details aufklappbar */}
          <div style={{borderTop:`1px solid ${T.bg3}`,flexShrink:0}}>
            <button onClick={()=>setShowProzess(p=>!p)} style={{width:"100%",padding:"14px 28px",background:showProzess?T.bg:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",fontSize:".88rem",fontWeight:700,color:T.dark,fontFamily:T.font}}>
              <span>Technische Details &amp; Prozess-Timeline</span>
              <span style={{transition:"transform .2s",display:"inline-block",transform:showProzess?"rotate(180deg)":"rotate(0deg)"}}>&#9660;</span>
            </button>
            {showProzess&&(()=>{
              const st=sel.status;
              const idx=st==="offline"?STATUS_FLOW.length-1:STATUS_FLOW.indexOf(st);
              const hasHtml=!!sel.website_html;
              const trialExpiry=sel.trial_expires_at?new Date(sel.trial_expires_at):null;
              const trialDaysLeft=trialExpiry?Math.max(0,Math.ceil((trialExpiry-Date.now())/(1000*60*60*24))):null;
              const genDurationSec=sel.generated_at&&sel.created_at?Math.round((new Date(sel.generated_at)-new Date(sel.created_at))/1000):null;
              const steps=[
                {key:"pending",label:"Schritt 1 – Eingang",icon:"📋",detail:"Fragebogen ausgefuellt, Account erstellt, Auftrag eingegangen.",meta:[["Erstellt",fmtDate(sel.created_at)],["Branche",sel.branche_label],["Stil",sel.stil],["Fotos",sel.fotos?"Ja":"Nein"]]},
                {key:"in_arbeit",label:"Schritt 2 – KI-Generierung",icon:"⚙️",detail:hasHtml?"Website wurde erfolgreich generiert.":st==="in_arbeit"?"Generierung laeuft gerade...":"Noch nicht gestartet.",meta:[hasHtml&&["Modell","claude-sonnet-4-6"],hasHtml&&["Tokens In",(sel.tokens_in||0).toLocaleString("de-AT")],hasHtml&&["Tokens Out",(sel.tokens_out||0).toLocaleString("de-AT")],hasHtml&&["Kosten",`\u20AC${(sel.cost_eur||0).toFixed(4)}`],hasHtml&&["HTML-Groesse",`${Math.round((sel.website_html||"").length/1024)} KB`],genDurationSec&&["Dauer",`${genDurationSec}s`]].filter(Boolean),error:sel.last_error||null},
                {key:"trial",label:"Schritt 3 – Testphase",icon:"🔬",detail:st==="trial"?`Website aktiv. Kunde hat${trialDaysLeft!==null?` noch ${trialDaysLeft} Tag${trialDaysLeft===1?"":"e"}`:""} um ein Abo abzuschliessen.`:st==="live"||st==="offline"?"Testphase abgeschlossen – Abo aktiv.":"Noch nicht erreicht.",meta:[["Trial bis",trialExpiry?trialExpiry.toLocaleDateString("de-AT",{day:"2-digit",month:"long",year:"numeric"}):"—"],["Subdomain",sel.subdomain||"—"],["Plan",sel.subscription_plan||"—"]]},
                {key:"live",label:"Schritt 4 – Abo & Live",icon:"🚀",detail:"Stripe-Abo aktiv. Erste Zahlung eingegangen. Website oeffentlich erreichbar.",meta:[["Abo-Plan",sel.subscription_plan==="yearly"?"Jährlich (\u20AC183.60)":sel.subscription_plan==="monthly"?"Monatlich (\u20AC18)":"—"],["Stripe Customer",sel.stripe_customer_id||"—"],["Status",st==="live"?"Online":st==="offline"?"Offline":"Ausstehend"],["Subdomain",sel.subdomain?`${sel.subdomain}.siteready.at`:"—"]]},
              ];
              const futureSteps=[
                {num:5,label:"Subdomain indexieren",icon:"🔍",optional:false,detail:"noindex-Tag entfernen – Google kann die Website auf der siteready.at-Subdomain indexieren. Wird nach Abschluss der Prototyp-Phase aktiviert."},
                {num:6,label:"Custom Domain Onboarding",icon:"🌐",optional:true,detail:"Kundeneigene Domain (z.B. firma.at) via CNAME/A-Record auf siteready.at zeigen lassen. SSL wird automatisch von Cloudflare ausgestellt."},
                {num:7,label:"Custom Domain indexieren",icon:"📈",optional:true,detail:"noindex auf der Custom Domain entfernen. Google Search Console einreichen. Dauert typisch 1–4 Wochen bis zur vollstaendigen Indexierung."},
                {num:8,label:"Subdomain aus Google entfernen",icon:"🧹",optional:true,detail:"Sobald die Custom Domain indexiert ist: noindex auf der Subdomain wieder aktivieren (oder 301-Redirect setzen). Verhindert Duplicate-Content-Penaltys."},
              ];
              return(<div style={{padding:"0 28px 28px"}}>
                {steps.map((step,i)=>{
                  const done=STATUS_FLOW.indexOf(step.key)<=idx;
                  const current=step.key===st;
                  const pending=STATUS_FLOW.indexOf(step.key)>idx;
                  const hasErr=!!step.error&&!done;
                  const lineColor=done?T.green:hasErr?"#ef4444":current?"#f59e0b":"#e2e8f0";
                  const dotBg=done?T.green:hasErr?"#ef4444":current?"#f59e0b":"#e2e8f0";
                  const dotColor=done||current||hasErr?"#fff":T.textMuted;
                  return(<div key={step.key} style={{display:"flex",gap:16,paddingBottom:24}}>
                    <div style={{display:"flex",flexDirection:"column",alignItems:"center",flexShrink:0}}>
                      <div style={{width:32,height:32,borderRadius:"50%",background:dotBg,color:dotColor,display:"flex",alignItems:"center",justifyContent:"center",fontSize:".85rem",fontWeight:700,flexShrink:0}}>{done?"✓":current?"●":i+1}</div>
                      <div style={{width:2,flex:1,minHeight:24,background:lineColor,marginTop:4}}/>
                    </div>
                    <div style={{flex:1,paddingTop:4}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                        <span style={{fontSize:".88rem",fontWeight:700,color:pending?T.textMuted:T.dark}}>{step.icon} {step.label}</span>
                        {current&&<span style={{background:"#fef3c7",color:"#92400e",fontSize:".75rem",fontWeight:700,padding:"2px 6px",borderRadius:4}}>Aktuell</span>}
                      </div>
                      <div style={{fontSize:".78rem",color:T.textMuted,marginBottom:step.error?6:8,lineHeight:1.5}}>{step.detail}</div>
                      {step.error&&<div style={{marginBottom:8,padding:"8px 12px",background:"#fef2f2",border:"1px solid #fecaca",borderRadius:T.rSm,fontSize:".75rem",color:"#991b1b",fontFamily:T.mono,lineHeight:1.5,wordBreak:"break-word"}}>{step.error}</div>}
                      {(!pending||current)&&<div style={{background:T.bg,border:`1px solid ${T.bg3}`,borderRadius:T.rSm,padding:"8px 12px",display:"flex",flexDirection:"column",gap:4}}>
                        {step.meta.map(([l,v])=><div key={l} style={{display:"flex",gap:12,fontSize:".75rem"}}>
                          <span style={{color:T.textMuted,fontWeight:600,minWidth:120,flexShrink:0}}>{l}</span>
                          <span style={{color:T.dark,fontFamily:l.includes("Token")||l.includes("Kosten")||l.includes("URL")||l.includes("Subdomain")?T.mono:"inherit"}}>{v}</span>
                        </div>)}
                      </div>}
                    </div>
                  </div>);
                })}
                {futureSteps.map((step,i)=>(
                  <div key={step.num} style={{display:"flex",gap:16,paddingBottom:i<futureSteps.length-1?24:0,opacity:.5}}>
                    <div style={{display:"flex",flexDirection:"column",alignItems:"center",flexShrink:0}}>
                      <div style={{width:32,height:32,borderRadius:"50%",background:"#e2e8f0",color:T.textMuted,display:"flex",alignItems:"center",justifyContent:"center",fontSize:".85rem",fontWeight:700,flexShrink:0}}>{step.num}</div>
                      {i<futureSteps.length-1&&<div style={{width:2,flex:1,minHeight:24,background:"#e2e8f0",marginTop:4}}/>}
                    </div>
                    <div style={{flex:1,paddingTop:4}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                        <span style={{fontSize:".88rem",fontWeight:700,color:T.textMuted}}>{step.icon} {step.label}</span>
                        {step.optional&&<span style={{background:T.bg3,color:T.textMuted,fontSize:".75rem",fontWeight:700,padding:"2px 6px",borderRadius:4}}>Optional</span>}
                        <span style={{background:"#fef3c7",color:"#92400e",fontSize:".75rem",fontWeight:700,padding:"2px 6px",borderRadius:4}}>Prototyp</span>
                      </div>
                      <div style={{fontSize:".78rem",color:T.textMuted,lineHeight:1.5}}>{step.detail}</div>
                    </div>
                  </div>
                ))}
              </div>);
            })()}
          </div>
        </div>
      </div>);
      })()}
    </div>
  </div>);
}

/* ═══ APP ═══ */
const ROUTES={"/":"landing","/start":"form","/bestellung":"success","/login":"portal-login","/portal":"portal"};
const PATHS=Object.fromEntries(Object.entries(ROUTES).map(([k,v])=>[v,k]));

function navigate(page,replace=false){
  const path=PATHS[page]||"/";
  replace?window.history.replaceState({},"",path):window.history.pushState({},"",path);
}

export default function App(){
  const initPage=()=>{
    const path=window.location.pathname;
    if(path==="/admin")return"admin-check";
    return ROUTES[path]||"notfound";
  };
  const[page,setPageRaw]=useState(initPage);
  const[data,setData]=useState(INIT);
  const[session,setSession]=useState(null);
  const[paymentStatus,setPaymentStatus]=useState(null);

  const setPage=p=>{setPageRaw(p);navigate(p);};

  useEffect(()=>{
    // Browser Zurück/Vor
    const onPop=()=>setPageRaw(ROUTES[window.location.pathname]||"notfound");
    window.addEventListener("popstate",onPop);
    // Stripe Redirect abfangen
    const p=new URLSearchParams(window.location.search);
    if(p.get("payment")==="success"){setPaymentStatus("success");window.history.replaceState({},"","/");}
    if(p.get("payment")==="canceled"){setPaymentStatus("canceled");window.history.replaceState({},"","/");}
    // Supabase Auth
    if(!supabase)return()=>window.removeEventListener("popstate",onPop);
    supabase.auth.getSession().then(({data:{session}})=>{
      setSession(session);
      if(session){setPageRaw("portal");navigate("portal",true);}
    });
    const{data:{subscription}}=supabase.auth.onAuthStateChange((_,session)=>{
      setSession(session);
      if(session){setPageRaw("portal");navigate("portal");}
    });
    return()=>{subscription.unsubscribe();window.removeEventListener("popstate",onPop);};
  },[]);

  if(page==="portal"&&session)return<Portal session={session} onLogout={()=>{supabase.auth.signOut();setSession(null);setPage("landing")}}/>;
  if(page==="portal-login")return<PortalLogin onBack={()=>setPage("landing")}/>;

  // Admin Dashboard (key-geschützt)
  const adminKey=process.env.REACT_APP_ADMIN_KEY;
  const urlKey=new URLSearchParams(window.location.search).get("key");
  if(window.location.pathname==="/admin"&&adminKey&&urlKey===adminKey)return<Admin adminKey={adminKey}/>;

  if(paymentStatus==="success"){
    const pendingEmail=localStorage.getItem("sr_pending_email")||"";
    return(
    <div style={{minHeight:"100vh",background:"#fff",fontFamily:T.font,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:0,textAlign:"center",padding:"0 24px"}}><style>{css}</style>
      <div style={{width:72,height:72,borderRadius:"50%",background:T.greenLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"2rem",marginBottom:24,border:"2px solid rgba(22,163,74,.2)"}}>{"\u2713"}</div>
      <h1 style={{fontSize:"2rem",fontWeight:800,color:T.dark,margin:"0 0 12px",letterSpacing:"-.03em"}}>Zahlung erfolgreich!</h1>
      <p style={{color:T.textSub,fontSize:".95rem",lineHeight:1.7,maxWidth:440,margin:"0 0 20px"}}>Vielen Dank für Ihre Bestellung. Wir erstellen Ihre Website und melden uns in Kürze.</p>
      {pendingEmail&&<div style={{display:"flex",alignItems:"flex-start",gap:10,background:"#fefce8",border:"1px solid #fde68a",borderRadius:T.rSm,padding:"12px 16px",marginBottom:24,maxWidth:400,textAlign:"left"}}>
        <span style={{fontSize:"1rem",flexShrink:0}}>✉️</span>
        <span style={{fontSize:".82rem",color:"#92400e",lineHeight:1.6}}>Bitte bestätigen Sie Ihre E-Mail-Adresse (<strong>{pendingEmail}</strong>) – wir haben Ihnen einen Bestätigungslink gesendet. Erst danach ist der Portal-Login möglich.</span>
      </div>}
      <div style={{display:"flex",flexDirection:"column",gap:10,width:"100%",maxWidth:320}}>
        <button onClick={()=>{localStorage.removeItem("sr_pending_email");setPage("portal-login");}} style={{padding:"14px 32px",border:"none",borderRadius:T.rSm,background:T.dark,color:"#fff",fontSize:".95rem",fontWeight:700,fontFamily:T.font,cursor:"pointer",boxShadow:"0 2px 16px rgba(0,0,0,.12)"}}>
          Zum Portal &rarr;
        </button>
      </div>
    </div>
  );};

  if(paymentStatus==="canceled")return(
    <div style={{minHeight:"100vh",background:"#fff",fontFamily:T.font,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:16,textAlign:"center",padding:"0 24px"}}><style>{css}</style>
      <div style={{fontSize:"1.4rem",fontWeight:800,color:T.dark}}>Zahlung abgebrochen</div>
      <p style={{color:T.textSub,fontSize:".9rem",maxWidth:380}}>Ihre Bestellung wurde noch nicht abgeschlossen. Sie können es jederzeit erneut versuchen.</p>
      <button onClick={()=>setPaymentStatus(null)} style={{padding:"12px 24px",border:"none",borderRadius:T.rSm,background:T.dark,color:"#fff",fontSize:".88rem",fontWeight:700,fontFamily:T.font,cursor:"pointer"}}>Zurück zur Startseite</button>
    </div>
  );

  if(page==="landing")return<LandingPage onStart={()=>setPage("form")} onPortal={()=>setPage("portal-login")}/>;
  if(page==="success")return<SuccessPage data={data} onBack={()=>setPage("form")}/>;
  if(page==="notfound")return(
    <div style={{minHeight:"100vh",background:"#fff",fontFamily:T.font,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",padding:"0 24px"}}><style>{css}</style>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:48}}>
        <img src="/icon.png" alt="SR" style={{height:22,opacity:.4}}/>
        <span style={{fontSize:".95rem",fontWeight:800,color:T.dark,opacity:.4}}>SiteReady</span>
      </div>
      <div style={{fontSize:"7rem",fontWeight:800,color:T.bg3,fontFamily:T.mono,lineHeight:1,letterSpacing:"-.06em",marginBottom:8}}>404</div>
      <h1 style={{fontSize:"1.6rem",fontWeight:800,color:T.dark,margin:"0 0 12px",letterSpacing:"-.03em"}}>Seite nicht gefunden</h1>
      <p style={{color:T.textSub,fontSize:".95rem",lineHeight:1.7,maxWidth:380,margin:"0 0 36px"}}>Die aufgerufene Seite existiert nicht oder wurde verschoben.</p>
      <button onClick={()=>{window.history.replaceState({},"","/");setPageRaw("landing");}} style={{padding:"13px 32px",border:"none",borderRadius:T.rSm,background:T.dark,color:"#fff",fontSize:".92rem",fontWeight:700,fontFamily:T.font,cursor:"pointer",boxShadow:"0 2px 16px rgba(0,0,0,.1)"}}>Zur Startseite &rarr;</button>
    </div>
  );
  return<Questionnaire data={data} setData={setData} onComplete={()=>setPage("success")} onBack={()=>setPage("landing")}/>;
}
