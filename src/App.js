import { useState, useCallback, useRef, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = (process.env.REACT_APP_SUPABASE_URL && process.env.REACT_APP_SUPABASE_ANON_KEY)
  ? createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_ANON_KEY)
  : null;

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
  {value:"handwerk",label:"Handwerk",icon:"🔨",desc:"Elektriker, Installateur, Tischler, Maler u.v.m."},
  {value:"kosmetik",label:"Kosmetik & K\u00f6rperpflege",icon:"\u2728",desc:"Kosmetik, Friseur, Massage, Nagelstudio u.v.m."},
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
const T={bg:"#fafbfc",bg2:"#f0f2f5",bg3:"#e8ebf0",white:"#ffffff",dark:"#0c0e12",dark2:"#1a1d24",text:"#1a1d24",textSub:"#4b5162",textMuted:"#8b919e",accent:"#2563eb",accentLight:"#eff4ff",accentGlow:"rgba(37,99,235,0.12)",green:"#16a34a",greenLight:"#f0fdf4",greenGlow:"rgba(22,163,74,0.1)",red:"#dc2626",orange:"#ea580c",r:"14px",rSm:"10px",rLg:"22px",rXl:"28px",font:"'DM Sans',-apple-system,sans-serif",mono:"'JetBrains Mono',monospace",sh1:"0 1px 2px rgba(0,0,0,0.04)",sh2:"0 4px 24px rgba(0,0,0,0.06)",sh3:"0 16px 48px rgba(0,0,0,0.08)",sh4:"0 24px 80px rgba(0,0,0,0.1)"};

const css=`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400&family=JetBrains+Mono:wght@400;500&family=Inter:wght@400;500;600;700;800;900&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&display=swap');*{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}body{font-family:${T.font};color:${T.text};-webkit-font-smoothing:antialiased;background:${T.bg}}::selection{background:${T.accent};color:#fff}@keyframes fadeUp{from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:translateY(0)}}.anim{animation:fadeUp .8s cubic-bezier(.16,1,.3,1) both}.d1{animation-delay:.12s}.d2{animation-delay:.24s}.d3{animation-delay:.36s}.d4{animation-delay:.48s}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
@media(max-width:960px){
  .lp-w{padding:0 28px!important}
  .lp-sec{padding:72px 0!important}
  .lp-hero-grid{grid-template-columns:1fr!important}
  .lp-hero-mock{display:none!important}
  .lp-hero-stats{gap:24px!important;flex-wrap:wrap}
  .lp-problem-grid{grid-template-columns:1fr!important;gap:48px!important}
  .lp-steps-grid{grid-template-columns:repeat(2,1fr)!important}
  .lp-variants-grid{grid-template-columns:1fr!important}
  .lp-pricing-grid{grid-template-columns:1fr!important;max-width:480px!important}
  .lp-why-grid{grid-template-columns:repeat(2,1fr)!important}
  .lp-compare{overflow-x:auto}
  .lp-nav-links{display:none!important}
}
@media(max-width:560px){
  .lp-w{padding:0 16px!important}
  .lp-sec{padding:56px 0!important}
  .lp-steps-grid{grid-template-columns:1fr!important}
  .lp-why-grid{grid-template-columns:1fr!important}
  .lp-hero-stats{display:none!important}
  .lp-pricing-grid{max-width:100%!important}
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
}
@media(max-width:960px){
  .ad-wrap{flex-direction:column!important;height:auto!important;min-height:calc(100vh - 56px)!important}
  .ad-sidebar{width:100%!important;display:flex!important;flex-direction:row!important;flex-wrap:wrap!important;padding:6px 8px!important;border-right:none!important;border-bottom:1px solid #e8ebf0!important;gap:2px!important}
  .ad-sidebar button{flex:1;width:auto!important;text-align:center!important;padding:8px 10px!important}
  .ad-status-sec{display:none!important}
  .ad-main{padding:16px!important}
  .sp-incl-grid{grid-template-columns:1fr!important}
}
@media(max-width:560px){
  .lp-footer-flex{flex-direction:column!important;gap:16px!important;text-align:center!important}
  .lp-cta-section{padding:72px 0!important}
  .pt-info-row{grid-template-columns:1fr!important}
  .pt-field-grid{grid-template-columns:1fr!important}
  .pt-tab-nav{width:100%!important;overflow-x:auto!important}
  .pt-addr-grid{grid-template-columns:1fr!important}
}
.lp-hamburger{display:none}
@keyframes slideDown{from{opacity:0;transform:translateY(-12px)}to{opacity:1;transform:translateY(0)}}
@media(max-width:960px){
  .lp-hamburger{display:flex!important;align-items:center;justify-content:center;width:40px;height:40px;border:none;background:transparent;cursor:pointer;border-radius:8px;padding:0;flex-shrink:0}
  .lp-mob-menu{display:block!important}
}`;

/* ═══ LANDING PAGE ═══ */
function LandingPage({onStart,onPortal}){
  const[scrolled,setScrolled]=useState(false);
  const[menuOpen,setMenuOpen]=useState(false);
  const[pricingYearly,setPricingYearly]=useState(true);
  useEffect(()=>{const h=()=>{setScrolled(window.scrollY>30);if(window.scrollY>30)setMenuOpen(false)};window.addEventListener("scroll",h);return()=>window.removeEventListener("scroll",h)},[]);
  const closeMenu=()=>setMenuOpen(false);
  const W=({children,s})=><div className="lp-w" style={{maxWidth:1200,margin:"0 auto",padding:"0 56px",...s}}>{children}</div>;
  const Sec=({children,id,alt,s})=><section id={id} className="lp-sec" style={{padding:"112px 0",background:alt?"#f7f8fa":"#fff",...s}}><W>{children}</W></section>;
  const Label=({children})=><div style={{fontSize:".72rem",fontWeight:700,color:T.accent,letterSpacing:".14em",textTransform:"uppercase",marginBottom:14}}>{children}</div>;
  const H2=({children,s})=><h2 style={{fontSize:"clamp(2rem,3.5vw,2.8rem)",fontWeight:800,lineHeight:1.06,letterSpacing:"-.04em",color:T.dark,marginBottom:16,...s}}>{children}</h2>;
  const Sub=({children,s})=><p style={{fontSize:"1.05rem",color:T.textSub,lineHeight:1.75,...s}}>{children}</p>;

  function Counter({end,suffix,label}){const[v,setV]=useState(0);const ref=useRef(null);useEffect(()=>{const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting){let s=0;const dur=1200;const step=()=>{s+=16;const p=Math.min(s/dur,1);const ease=1-Math.pow(1-p,3);setV(Math.round(end*ease));if(p<1)requestAnimationFrame(step)};step();obs.disconnect()}},{threshold:.3});if(ref.current)obs.observe(ref.current);return()=>obs.disconnect()},[end]);return<div ref={ref}><div style={{fontSize:"2rem",fontWeight:800,color:T.dark,fontFamily:T.mono,letterSpacing:"-.03em",lineHeight:1}}>{v}{suffix}</div><div style={{fontSize:".78rem",color:T.textMuted,marginTop:5,fontWeight:500}}>{label}</div></div>}

  return(<div style={{background:"#fff",color:T.text,overflowX:"hidden"}}><style>{css}</style>

  {/* NAV */}
  <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,background:scrolled?"rgba(255,255,255,.94)":"transparent",backdropFilter:scrolled?"blur(20px)":"none",WebkitBackdropFilter:scrolled?"blur(20px)":"none",borderBottom:scrolled?"1px solid rgba(0,0,0,.07)":"1px solid transparent",transition:"all .3s"}}>
    <div className="lp-w" style={{maxWidth:1200,margin:"0 auto",padding:"0 56px",display:"flex",alignItems:"center",justifyContent:"space-between",height:68}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}><img src="/icon.png" alt="SR" style={{height:22}}/><span style={{fontSize:"1rem",fontWeight:800,color:T.dark,letterSpacing:"-.02em"}}>SiteReady</span></div>
      <div className="lp-nav-links" style={{display:"flex",gap:32,alignItems:"center"}}>
        {[["#problem","Problem"],["#how","So gehts"],["#preise","Preise"],["#vergleich","Vergleich"]].map(([h,l])=><a key={h} href={h} style={{fontSize:".88rem",fontWeight:500,color:T.textSub,textDecoration:"none"}}>{l}</a>)}
        <button onClick={onPortal} style={{background:"transparent",color:T.textSub,padding:"10px 18px",borderRadius:8,fontWeight:600,fontSize:".85rem",border:"none",cursor:"pointer",fontFamily:T.font}}>Kunden-Portal</button>
        <button onClick={onStart} style={{background:T.dark,color:"#fff",padding:"10px 22px",borderRadius:8,fontWeight:700,fontSize:".88rem",border:"none",cursor:"pointer",fontFamily:T.font,letterSpacing:"-.01em"}}>Jetzt starten</button>
      </div>
      <button className="lp-hamburger" onClick={()=>setMenuOpen(o=>!o)} aria-label="Menü" style={{color:T.dark}}>
        {menuOpen
          ?<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          :<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>}
      </button>
    </div>
  </nav>
  {/* MOBILE MENU */}
  {menuOpen&&<div className="lp-mob-menu" style={{display:"none",position:"fixed",top:68,left:0,right:0,zIndex:99,background:"#fff",borderBottom:"1px solid rgba(0,0,0,.08)",boxShadow:"0 12px 40px rgba(0,0,0,.1)",animation:"slideDown .22s cubic-bezier(.16,1,.3,1)"}}>
    <div style={{padding:"16px 24px",display:"flex",flexDirection:"column",gap:2}}>
      {[["#problem","Problem"],["#how","So funktionierts"],["#preise","Preise"],["#vergleich","Vergleich"]].map(([h,l])=><a key={h} href={h} onClick={closeMenu} style={{fontSize:".95rem",fontWeight:500,color:T.dark,textDecoration:"none",padding:"12px 8px",borderBottom:"1px solid rgba(0,0,0,.05)"}}>{l}</a>)}
      <div style={{display:"flex",flexDirection:"column",gap:8,marginTop:12}}>
        <button onClick={()=>{closeMenu();onPortal();}} style={{padding:"12px",borderRadius:8,fontWeight:600,fontSize:".92rem",border:`1.5px solid ${T.bg3}`,background:"#fff",color:T.dark,cursor:"pointer",fontFamily:T.font}}>Kunden-Portal</button>
        <button onClick={()=>{closeMenu();onStart();}} style={{padding:"12px",borderRadius:8,fontWeight:700,fontSize:".92rem",border:"none",background:T.dark,color:"#fff",cursor:"pointer",fontFamily:T.font}}>Jetzt starten &rarr;</button>
      </div>
    </div>
  </div>}

  {/* HERO — Split Layout */}
  <section style={{minHeight:"100vh",display:"flex",alignItems:"center",paddingTop:68,background:"#fff",position:"relative",overflow:"hidden"}}>
    <div style={{position:"absolute",top:"-10%",right:"-8%",width:700,height:700,borderRadius:"50%",background:"radial-gradient(circle,rgba(37,99,235,.06) 0%,transparent 65%)",pointerEvents:"none"}}/>
    <W s={{position:"relative",zIndex:1,width:"100%"}}>
      <div className="lp-hero-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:72,alignItems:"center",padding:"60px 0 80px"}}>
        <div>
          <div style={{display:"inline-flex",alignItems:"center",gap:7,border:"1px solid rgba(37,99,235,.18)",color:T.accent,padding:"5px 13px",borderRadius:6,fontSize:".72rem",fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",marginBottom:28}}>
            <span style={{width:6,height:6,borderRadius:"50%",background:T.accent,animation:"pulse 2s infinite"}}/>
            Professionelle Websites für österreichische Kleinbetriebe
          </div>
          <h1 style={{fontSize:"clamp(2.6rem,4.5vw,4rem)",fontWeight:800,lineHeight:1.0,letterSpacing:"-.05em",color:T.dark,marginBottom:20}}>Deine Website<br/>in <span style={{background:"linear-gradient(135deg,#1d4ed8,#3b82f6)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>Minuten.</span></h1>
          <p style={{fontSize:"1.1rem",color:T.textSub,lineHeight:1.75,maxWidth:440,marginBottom:36}}>Mit Impressum nach ECG, DSGVO und Google-Indexierung. Bestehende Website importieren oder in 10 Minuten ausfüllen. Fertig.</p>
          <div style={{display:"flex",gap:12,marginBottom:52}}>
            <button onClick={onStart} style={{padding:"14px 30px",borderRadius:8,fontSize:".98rem",fontWeight:700,border:"none",cursor:"pointer",background:T.dark,color:"#fff",fontFamily:T.font,letterSpacing:"-.01em",boxShadow:"0 2px 16px rgba(0,0,0,.14)"}}>Jetzt Website erstellen &rarr;</button>
            <a href="#how" style={{padding:"14px 22px",borderRadius:8,fontSize:".98rem",fontWeight:600,textDecoration:"none",color:T.dark,border:`1.5px solid ${T.bg3}`,background:"#fff",display:"inline-flex",alignItems:"center"}}>So funktionierts</a>
          </div>
          <div className="lp-hero-stats" style={{display:"flex",gap:40,paddingTop:28,borderTop:`1px solid ${T.bg3}`}}>
            {[{end:10,suffix:" Min",label:"Bis zur fertigen Website"},{end:18,suffix:"\u20AC",label:"Pro Monat, alles inklusive"},{end:120,suffix:"k+",label:"Zielgruppe in Österreich"}].map((s,i)=><Counter key={i} {...s}/>)}
          </div>
        </div>
        <div className="lp-hero-mock" style={{position:"relative"}}>
          <div style={{background:"#fff",borderRadius:14,overflow:"hidden",boxShadow:"0 32px 72px rgba(0,0,0,.1),0 0 0 1px rgba(0,0,0,.06)"}}>
            <div style={{display:"flex",alignItems:"center",gap:6,padding:"12px 16px",background:"#f5f5f7",borderBottom:"1px solid rgba(0,0,0,.07)"}}>
              {["#ff5f57","#febc2e","#28c840"].map(c=><span key={c} style={{width:10,height:10,borderRadius:"50%",background:c}}/>)}
              <div style={{marginLeft:12,background:"#fff",borderRadius:6,padding:"5px 14px",fontSize:".73rem",fontFamily:T.mono,color:T.textMuted,flex:1,border:"1px solid rgba(0,0,0,.07)"}}>meier-elektrotechnik.siteready.at</div>
              <div style={{background:T.greenLight,color:T.green,fontSize:".62rem",fontWeight:700,padding:"3px 10px",borderRadius:5,textTransform:"uppercase",letterSpacing:".06em"}}>Live</div>
            </div>
            <div style={{background:"linear-gradient(160deg,#0f2b5b 0%,#1e40af 50%,#2563eb 100%)",padding:"36px 28px",color:"#fff",position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",inset:0,background:"radial-gradient(circle at 80% 20%,rgba(255,255,255,.08),transparent 60%)"}}/>
              <div style={{position:"relative",zIndex:1}}>
                <div style={{display:"inline-block",padding:"3px 10px",background:"rgba(255,255,255,.15)",borderRadius:20,fontSize:".65rem",fontWeight:600,letterSpacing:".04em",textTransform:"uppercase",marginBottom:10}}>{"\u26A1"} 24h Notdienst</div>
                <h2 style={{fontSize:"1.4rem",fontWeight:700,marginBottom:4}}>Meier Elektrotechnik</h2>
                <p style={{opacity:.8,fontSize:".88rem"}}>Elektroinstallationen &middot; Wien & Umgebung</p>
                <div style={{marginTop:14,display:"inline-flex",alignItems:"center",gap:7,background:"rgba(255,255,255,.12)",borderRadius:8,padding:"7px 14px",fontSize:".82rem",fontWeight:600,border:"1px solid rgba(255,255,255,.15)"}}>{"\uD83D\uDCDE"} +43 1 234 56 78</div>
              </div>
            </div>
            <div style={{padding:"18px 24px",display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
              {["Elektroinstallationen","Smart Home","Photovoltaik"].map((l,i)=><div key={i} style={{background:"#f7f8fa",borderRadius:8,padding:"12px",display:"flex",alignItems:"center",gap:8,border:"1px solid rgba(0,0,0,.05)"}}><div style={{width:22,height:22,borderRadius:6,background:T.accentLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:".6rem",color:T.accent,fontWeight:700,fontFamily:T.mono,flexShrink:0}}>{String(i+1).padStart(2,"0")}</div><span style={{fontSize:".76rem",fontWeight:500,color:T.text}}>{l}</span></div>)}
            </div>
          </div>
          {[{l:"SSL aktiv",i:"\uD83D\uDD12",top:"-5%",right:"-7%",d:"0s"},{l:"DSGVO + ECG",i:"\u2696\uFE0F",bottom:"6%",right:"-7%",d:"2s"}].map(b=><div key={b.l} style={{position:"absolute",padding:"10px 16px",background:"#fff",borderRadius:10,boxShadow:"0 8px 28px rgba(0,0,0,.1)",fontSize:".8rem",fontWeight:600,color:T.text,display:"flex",alignItems:"center",gap:8,animation:`float 5s ease-in-out ${b.d} infinite`,top:b.top,bottom:b.bottom,right:b.right,border:"1px solid rgba(0,0,0,.06)"}}><span style={{width:28,height:28,borderRadius:8,background:T.accentLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:".85rem"}}>{b.i}</span>{b.l}</div>)}
        </div>
      </div>
    </W>
  </section>

  {/* PROBLEM */}
  <Sec id="problem" alt>
    <div className="lp-problem-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:80,alignItems:"start"}}>
      <div>
        <Label>Das Problem</Label>
        <H2 s={{maxWidth:420}}>Handwerker wollen Kunden – nicht stundenlang Webdesign.</H2>
        <Sub s={{marginBottom:36,maxWidth:400}}>Wer hat schon Zeit fuer Builder, Agentur-Briefings und DSGVO-Texte?</Sub>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {[{e:"🕐",t:"Keine Zeit",d:"Der Alltag auf der Baustelle laesst keinen Raum fuer Webdesign."},{e:"💸",t:"Zu teuer",d:"Eine Agentur kostet \u20AC1.500\u20135.000 einmalig \u2013 zu viel fuer einen Kleinbetrieb."},{e:"😤",t:"Zu kompliziert",d:"Baukasten-Tools verlangen eigene Texte, eigenes Design und stundenlange Einarbeitung."},{e:"⚠️",t:"Rechtlich riskant",d:"Fehlendes Impressum oder DSGVO-Text kann teuer werden \u2013 wer soll das pruefen?"}].map((c,i)=><div key={i} style={{padding:"18px 22px",background:"#fff",borderRadius:10,border:"1px solid rgba(0,0,0,.07)",display:"flex",alignItems:"flex-start",gap:16}}><span style={{fontSize:"1.4rem",flexShrink:0,marginTop:1}}>{c.e}</span><div><div style={{fontWeight:700,fontSize:".92rem",color:T.dark,marginBottom:3}}>{c.t}</div><div style={{fontSize:".84rem",color:T.textMuted}}>{c.d}</div></div></div>)}
        </div>
      </div>
      <div>
        <div style={{background:"linear-gradient(135deg,#eff4ff 0%,#f0fdf4 100%)",borderRadius:14,padding:"40px 36px",border:"1.5px solid rgba(37,99,235,.12)"}}>
          <div style={{display:"inline-block",background:T.accent,color:"#fff",fontSize:".68rem",fontWeight:700,padding:"5px 12px",borderRadius:6,marginBottom:18,letterSpacing:".04em"}}>Die Lösung</div>
          <h3 style={{fontSize:"2rem",fontWeight:800,color:T.dark,marginBottom:10,letterSpacing:"-.04em"}}>SiteReady.at</h3>
          <p style={{fontSize:"1rem",color:T.textSub,lineHeight:1.75,marginBottom:24}}>Kein Builder. Ein Service. Du beantwortest Fragen, wir liefern die fertige Website.</p>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:28}}>
            {["Website fertig in Minuten","Live-Vorschau vor Kauf","Impressum ECG-konform","DSGVO automatisch","SSL inklusive","Kein Branding","Website-Import","Self-Service-Portal","Eigene Domain moeglich","Oesterreich-spezifisch"].map(l=><span key={l} style={{fontSize:".75rem",padding:"6px 13px",borderRadius:6,fontWeight:600,background:"#fff",color:T.green,border:"1px solid rgba(22,163,74,.15)"}}>{"\u2713"} {l}</span>)}
          </div>
          <button onClick={onStart} style={{padding:"12px 24px",borderRadius:8,fontSize:".92rem",fontWeight:700,border:"none",cursor:"pointer",background:T.dark,color:"#fff",fontFamily:T.font}}>Jetzt testen &rarr;</button>
        </div>
      </div>
    </div>
  </Sec>

  {/* HOW IT WORKS */}
  <Sec id="how">
    <div style={{marginBottom:64}}>
      <Label>So funktioniert's</Label>
      <H2>Fünf Schritte. Null Aufwand.</H2>
    </div>
    <div className="lp-steps-grid" style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:16}}>
      {[{n:"01",i:"\uD83D\uDCCB",t:"Fragebogen",d:"Bestehende Website importieren oder 10 Fragen zu Branche, Kontakt und Stil beantworten."},{n:"02",i:"\uD83D\uDC41\uFE0F",t:"Live-Vorschau",d:"Ihre Website entsteht live im Browser – sichtbar noch vor der Bezahlung."},{n:"03",i:"\uD83D\uDCB3",t:"Bezahlen",d:"Sicher per Karte, EPS oder PayPal. Danach läuft alles vollautomatisch."},{n:"04",i:"\uD83D\uDE80",t:"Sofort live",d:"SSL aktiv. Ihre Website ist innerhalb von Minuten erreichbar und für Google sichtbar."},{n:"05",i:"\u2699\uFE0F",t:"Anpassen (optional)",d:"Im Self-Service-Portal: Logo, Fotos und Custom Domain jederzeit selbst hinzufügen."}].map((s,i)=><div key={i} style={{padding:"28px 22px",background:i===4?"#fafafa":"#f7f8fa",borderRadius:12,position:"relative",overflow:"hidden",border:i===4?"1px dashed rgba(0,0,0,.08)":"none"}}>
        <div style={{fontFamily:T.mono,fontSize:"3rem",fontWeight:800,color:"rgba(0,0,0,.05)",position:"absolute",top:12,right:16,lineHeight:1,letterSpacing:"-.05em"}}>{s.n}</div>
        <div style={{width:42,height:42,borderRadius:10,background:i===4?T.bg3:T.accentLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.15rem",marginBottom:18}}>{s.i}</div>
        <h3 style={{fontSize:".95rem",fontWeight:700,color:i===4?T.textSub:T.dark,marginBottom:8}}>{s.t}</h3>
        <p style={{fontSize:".82rem",color:T.textMuted,lineHeight:1.65}}>{s.d}</p>
      </div>)}
    </div>
  </Sec>

  {/* DESIGN VARIANTS */}
  <Sec alt>
    <div style={{marginBottom:52}}>
      <Label>Automatisches Design</Label>
      <H2 s={{maxWidth:500}}>Keine Designentscheidung. Nur ein Gefühl.</H2>
      <Sub s={{maxWidth:460}}>Wie soll Ihr Betrieb wirken? SiteReady waehlt das passende Design automatisch.</Sub>
    </div>
    <div className="lp-variants-grid" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}}>
      {[{t:"Professionell & serioes",d:"Klare Linien, gedaempfte Farben, serifenlos",g:"linear-gradient(160deg,#0f2b5b,#2563eb)",sub:"Elektriker, Installateure, Baumeister"},{t:"Modern & frisch",d:"Helle Akzente, leichtes Layout, frische Farbpalette",g:"linear-gradient(135deg,#065f46,#10b981)",sub:"Maler, Fliesenleger, Gärtner"},{t:"Bodenständig & vertraut",d:"Warme Töne, kräftige Schrift, solider Auftritt",g:"linear-gradient(160deg,#78350f,#b45309)",sub:"Tischler, Zimmerer, Dachdecker"}].map((v,i)=><div key={i} style={{borderRadius:12,overflow:"hidden",background:"#fff",border:"1px solid rgba(0,0,0,.07)"}}>
        <div style={{background:v.g,padding:"44px 28px",color:"#fff",position:"relative",overflow:"hidden"}}><div style={{position:"absolute",inset:0,background:"radial-gradient(circle at 80% 20%,rgba(255,255,255,.1),transparent 50%)"}}/><h3 style={{fontSize:"1.1rem",fontWeight:700,marginBottom:6,position:"relative"}}>{v.t}</h3><p style={{fontSize:".8rem",opacity:.75,position:"relative"}}>{v.d}</p></div>
        <div style={{padding:"18px 28px",borderTop:"1px solid rgba(0,0,0,.05)"}}><p style={{fontSize:".84rem",color:T.textSub}}>{v.sub}</p></div>
      </div>)}
    </div>
  </Sec>

  {/* BRANCHEN TEMPLATES */}
  <Sec>
    <div style={{marginBottom:52}}>
      <Label>Branchen-Templates</Label>
      <H2 s={{maxWidth:520}}>Maßgeschneidert für Ihre Branche.</H2>
      <Sub s={{maxWidth:480}}>Jede Branche bekommt ein eigenes Design, vorbelegte Leistungen und passende Website-Texte – vollautomatisch.</Sub>
    </div>
    <div className="lp-branchen-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:20}}>
      <div style={{borderRadius:14,overflow:"hidden",background:"#fff",border:"1px solid rgba(0,0,0,.08)",boxShadow:"0 4px 24px rgba(0,0,0,.05)"}}>
        <div style={{background:"linear-gradient(160deg,#0f2b5b,#1e40af)",padding:"32px 28px",color:"#fff",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",inset:0,background:"radial-gradient(circle at 80% 20%,rgba(255,255,255,.08),transparent 50%)"}}/>
          <div style={{position:"relative",zIndex:1}}>
            <div style={{fontSize:"2rem",marginBottom:10}}>{"\uD83D\uDD28"}</div>
            <h3 style={{fontSize:"1.2rem",fontWeight:800,marginBottom:6,letterSpacing:"-.03em"}}>Handwerk</h3>
            <p style={{opacity:.75,fontSize:".84rem",lineHeight:1.6}}>Seriöses, professionelles Design. Vertrauensaufbau steht im Vordergrund.</p>
          </div>
        </div>
        <div style={{padding:"22px 28px"}}>
          <div style={{fontSize:".7rem",fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:".1em",marginBottom:12}}>Verfügbare Branchen</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
            {["Elektriker","Installateur","Maler","Tischler","Fliesenleger","Schlosser","Dachdecker","Zimmerei","Maurer","Gaertner","Klima & Lüftung","Reinigung"].map(b=><span key={b} style={{fontSize:".74rem",padding:"4px 10px",borderRadius:6,fontWeight:500,background:"#eff6ff",color:"#1e40af",border:"1px solid rgba(30,64,175,.1)"}}>{b}</span>)}
          </div>
        </div>
      </div>
      <div style={{borderRadius:14,overflow:"hidden",background:"#fff",border:"1px solid rgba(0,0,0,.08)",boxShadow:"0 4px 24px rgba(0,0,0,.05)"}}>
        <div style={{background:"linear-gradient(160deg,#831843,#be185d)",padding:"32px 28px",color:"#fff",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",inset:0,background:"radial-gradient(circle at 80% 20%,rgba(255,255,255,.08),transparent 50%)"}}/>
          <div style={{position:"relative",zIndex:1}}>
            <div style={{fontSize:"2rem",marginBottom:10}}>{"\u2728"}</div>
            <h3 style={{fontSize:"1.2rem",fontWeight:800,marginBottom:6,letterSpacing:"-.03em"}}>Kosmetik & Körperpflege</h3>
            <p style={{opacity:.75,fontSize:".84rem",lineHeight:1.6}}>Modernes, elegantes Design. Hochwertige Ausstrahlung und Vertrauenswirkung.</p>
          </div>
        </div>
        <div style={{padding:"22px 28px"}}>
          <div style={{fontSize:".7rem",fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:".1em",marginBottom:12}}>Verfügbare Branchen</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
            {["Kosmetikstudio","Friseursalon","Nagelstudio","Massage & Wellness","Tattoo & Piercing","Fuß- & Körperpflege","Permanent Make-up"].map(b=><span key={b} style={{fontSize:".74rem",padding:"4px 10px",borderRadius:6,fontWeight:500,background:"#fdf2f8",color:"#9d174d",border:"1px solid rgba(157,23,77,.1)"}}>{b}</span>)}
          </div>
        </div>
      </div>
    </div>
    <div style={{padding:"22px 28px",borderRadius:12,background:"linear-gradient(135deg,#f8faff,#f0fdf4)",border:"1px solid rgba(0,0,0,.07)",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:16}}>
      <div>
        <div style={{fontWeight:700,fontSize:".95rem",color:T.dark,marginBottom:4}}>Weitere Berufsgruppen in Planung</div>
        <div style={{fontSize:".83rem",color:T.textMuted,lineHeight:1.6}}>Gastronomie, Handel, Dienstleistungen und mehr kommen 2026.</div>
      </div>
      <button disabled style={{padding:"10px 20px",borderRadius:8,fontSize:".84rem",fontWeight:700,cursor:"not-allowed",fontFamily:T.font,background:T.dark,color:"#fff",border:"none",opacity:.85,whiteSpace:"nowrap"}}>Newsletter abonnieren &amp; informiert bleiben</button>
    </div>
  </Sec>

  {/* PRICING */}
  <Sec id="preise">
    <div style={{marginBottom:48}}>
      <Label>Preise</Label>
      <H2>Ein Paket. Alles drin.</H2>
      <Sub s={{maxWidth:440}}>Kein Tarifwirrwarr. 7 Tage kostenlos testen.</Sub>
    </div>
    <div className="lp-pricing-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,maxWidth:820,margin:"0 auto"}}>
      {/* Standard mit Toggle */}
      <div style={{background:"#fff",borderRadius:14,padding:"36px 28px",position:"relative",border:"2px solid rgba(37,99,235,.2)",boxShadow:"0 8px 40px rgba(37,99,235,.07)"}}>
        <span style={{position:"absolute",top:-13,left:"50%",transform:"translateX(-50%)",background:T.dark,color:"#fff",fontSize:".68rem",fontWeight:700,padding:"5px 16px",borderRadius:100,whiteSpace:"nowrap"}}>Aktuelles Angebot</span>
        {/* Toggle */}
        <div style={{display:"flex",background:T.bg2,borderRadius:10,padding:4,marginBottom:24,width:"100%",position:"relative"}}>
          <div style={{position:"absolute",top:4,bottom:4,left:pricingYearly?"calc(50% + 2px)":"4px",width:"calc(50% - 6px)",background:"#fff",borderRadius:7,boxShadow:"0 2px 8px rgba(0,0,0,0.10)",transition:"left .25s cubic-bezier(.4,0,.2,1)",pointerEvents:"none"}}/>
          {[["monthly","Monatlich"],["yearly","J\u00e4hrlich"]].map(([val,lbl])=>(
            <button key={val} onClick={()=>setPricingYearly(val==="yearly")} style={{flex:1,padding:"9px 0",border:"none",borderRadius:7,background:"transparent",fontFamily:T.font,fontWeight:700,fontSize:".82rem",color:pricingYearly===(val==="yearly")?T.dark:T.textSub,cursor:"pointer",transition:"color .25s",position:"relative",zIndex:1}}>
              {lbl}{val==="yearly"&&<span style={{marginLeft:6,fontSize:".65rem",fontWeight:700,color:T.accent,background:pricingYearly?"rgba(37,99,235,0.12)":T.accentLight,padding:"2px 7px",borderRadius:4,transition:"background .25s"}}>-15%</span>}
            </button>
          ))}
        </div>
        {/* Preis */}
        <div style={{display:"flex",alignItems:"baseline",gap:4,marginBottom:4}}>
          <span style={{fontSize:"2.8rem",fontWeight:800,color:T.dark,fontFamily:T.mono,lineHeight:1,letterSpacing:"-.04em"}}>{pricingYearly?"\u20AC15.30":"\u20AC18"}</span>
          <span style={{fontSize:".9rem",color:T.textMuted,fontWeight:500}}>/Monat</span>
        </div>
        {pricingYearly
          ?<><div style={{fontSize:".78rem",color:T.textMuted,marginBottom:6}}>{"\u20AC"}183.60 / Jahr &middot; statt {"\u20AC"}216</div>
            <div style={{display:"inline-flex",alignItems:"center",background:"#dcfce7",borderRadius:6,padding:"3px 10px",marginBottom:20}}><span style={{fontSize:".72rem",fontWeight:700,color:"#15803d"}}>Sie sparen {"\u20AC"}32.40 / Jahr</span></div></>
          :<div style={{fontSize:".78rem",color:T.textMuted,marginBottom:24}}>Monatlich kuendbar &middot; keine Bindung</div>}
        {/* Features */}
        <div style={{display:"flex",flexDirection:"column",gap:7,marginBottom:24}}>
          {["7 Tage kostenlos testen","Subdomain sofort live","Kein Branding","Impressum (ECG) inklusive","DSGVO inklusive","SEO & Google-Indexierung","Logo & Fotos hochladen","Self-Service-Portal"].map(f=><div key={f} style={{display:"flex",alignItems:"center",gap:10,fontSize:".84rem",color:T.text}}><span style={{color:T.green,fontWeight:700}}>{"\u2713"}</span>{f}</div>)}
        </div>
        <button onClick={onStart} style={{width:"100%",padding:13,borderRadius:8,fontSize:".9rem",fontWeight:700,cursor:"pointer",fontFamily:T.font,border:"none",background:T.dark,color:"#fff"}}>Kostenlos testen {"\u2192"}</button>
      </div>
      {/* Premium Coming Soon */}
      <div style={{background:"#fafafa",borderRadius:14,padding:"36px 28px",position:"relative",border:"1px solid rgba(124,58,237,.15)"}}>
        <span style={{position:"absolute",top:-13,left:"50%",transform:"translateX(-50%)",background:"linear-gradient(135deg,#7c3aed,#a855f7)",color:"#fff",fontSize:".68rem",fontWeight:700,padding:"5px 16px",borderRadius:100,whiteSpace:"nowrap",letterSpacing:".04em"}}>Coming Soon</span>
        <div style={{fontSize:".95rem",fontWeight:700,color:T.dark,marginBottom:2}}>SiteReady Premium</div>
        <div style={{fontSize:".8rem",color:T.textMuted,marginBottom:20}}>Alles aus Standard + mehr</div>
        <div style={{fontSize:"2.8rem",fontWeight:800,color:T.textMuted,fontFamily:T.mono,lineHeight:1,letterSpacing:"-.04em",marginBottom:4,filter:"blur(6px)",userSelect:"none"}}>{"\u20AC"}?<span style={{fontSize:".95rem",fontWeight:500,fontFamily:T.font}}>/Mo</span></div>
        <div style={{fontSize:".78rem",color:T.textMuted,marginBottom:24}}>Kommt 2026 &middot; Jetzt vormerken</div>
        <div style={{display:"flex",flexDirection:"column",gap:7,marginBottom:28}}>
          {["Alle Features aus Standard","Mehrsprachige Website (DE/EN)","Social Media Paket","Kalender & Buchungssystem","Erweiterte Analytics"].map(f=><div key={f} style={{display:"flex",alignItems:"center",gap:10,fontSize:".84rem",color:T.textMuted}}><span style={{color:"#a855f7",fontWeight:700}}>{"\u23F3"}</span>{f}</div>)}
        </div>
        <button disabled style={{width:"100%",padding:13,borderRadius:8,fontSize:".9rem",fontWeight:700,cursor:"not-allowed",fontFamily:T.font,border:"1.5px solid rgba(124,58,237,.3)",background:"rgba(124,58,237,.06)",color:"#7c3aed",opacity:.8}}>Newsletter abonnieren &amp; informiert bleiben</button>
      </div>
    </div>
    <p style={{textAlign:"center",fontSize:".82rem",color:T.textMuted,maxWidth:500,margin:"24px auto 0",lineHeight:1.7}}>7 Tage kostenlos &middot; Karte wird erst nach 7 Tagen belastet &middot; Preise inkl. MwSt.</p>
  </Sec>

  {/* COMPARISON */}
  <Sec id="vergleich" alt>
    <div style={{marginBottom:48}}>
      <Label>Vergleich</Label>
      <H2>SiteReady vs. der Rest.</H2>
    </div>
    <div className="lp-compare" style={{borderRadius:14,overflow:"hidden",border:"1px solid rgba(0,0,0,.08)",background:"#fff"}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:".85rem"}}><thead><tr>{["Feature","SiteReady.at","Webdesign Agentur","Wix","onepage.io"].map((h,j)=><th key={h} style={{textAlign:"left",padding:"16px 22px",fontWeight:700,fontSize:".72rem",color:j===1?T.accent:T.textMuted,textTransform:"uppercase",letterSpacing:".1em",background:j===1?T.accentLight:"#f7f8fa",borderBottom:"1px solid rgba(0,0,0,.07)"}}>{h}</th>)}</tr></thead><tbody>{[["Zeit bis live","Minuten","4\u20138 Wochen","Stunden","Stunden"],["Texte & Content","\u2713 KI erstellt","Briefing noetig","Selbst schreiben","Selbst schreiben"],["Impressum (ECG)","\u2713 Automatisch","Extra buchbar","\u2717","\u2717"],["DSGVO-Text","\u2713 Automatisch","Extra buchbar","\u2717","\u2717"],["Vorschau vor Kauf","\u2713 Ja","\u2717","Teilweise","\u2717"],["Fuer Handwerker","\u2713 Spezialisiert","Je nach Agentur","\u2717","\u2717"],["Preis","ab \u20AC18\u2009/Mo","\u20AC1.500\u2013\u20AC5.000\u00b9","ab \u20AC17\u2009/Mo","ab \u20AC9\u2009/Mo"]].map((row,i)=><tr key={i} style={{background:i%2===0?"#fff":"#fafafa"}}>{row.map((c,j)=><td key={j} style={{padding:"13px 22px",borderBottom:"1px solid rgba(0,0,0,.04)",color:j===0?T.dark:j===1?T.accent:T.textMuted,fontWeight:j<=1?600:400,background:j===1?"rgba(37,99,235,.02)":"transparent"}}>{c}</td>)}</tr>)}</tbody></table>
      <div style={{padding:"10px 22px",borderTop:"1px solid rgba(0,0,0,.05)",fontSize:".7rem",color:T.textMuted}}>¹ Einmalkosten, zzgl. optionalem Wartungsvertrag</div>
    </div>
  </Sec>

  {/* CTA */}
  <section className="lp-cta-section" style={{padding:"120px 0",textAlign:"center",position:"relative",overflow:"hidden",background:T.dark}}>
    <div style={{position:"absolute",top:"-40%",left:"15%",width:600,height:600,borderRadius:"50%",background:"radial-gradient(circle,rgba(37,99,235,.18) 0%,transparent 70%)",pointerEvents:"none"}}/>
    <W s={{position:"relative",zIndex:1}}>
      <h2 style={{fontSize:"clamp(2.2rem,4.5vw,3.4rem)",fontWeight:800,lineHeight:1.05,letterSpacing:"-.04em",color:"#fff",marginBottom:18}}>Bereit für deine Website?</h2>
      <p style={{fontSize:"1.05rem",color:"rgba(255,255,255,.5)",marginBottom:40,maxWidth:420,margin:"0 auto 40px",lineHeight:1.7}}>10 Minuten. Kein Aufwand. Fertig.</p>
      <button onClick={onStart} style={{background:"#fff",color:T.dark,padding:"16px 44px",borderRadius:8,fontSize:"1rem",fontWeight:800,border:"none",cursor:"pointer",fontFamily:T.font,letterSpacing:"-.01em"}}>Jetzt starten &rarr;</button>
    </W>
  </section>

  {/* FOOTER */}
  <footer style={{padding:"32px 0",borderTop:"1px solid rgba(0,0,0,.06)",background:"#fff"}}>
    <W><div className="lp-footer-flex" style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{display:"flex",alignItems:"center",gap:8}}><img src="/icon.png" alt="SR" style={{height:16,opacity:.35}}/><span style={{fontSize:".82rem",color:T.textMuted}}>&copy; 2026 SiteReady.at</span></div><div style={{display:"flex",gap:24}}>{["Impressum","Datenschutz","Kontakt"].map(l=><a key={l} href="#" style={{fontSize:".82rem",color:T.textMuted,textDecoration:"none"}}>{l}</a>)}</div></div></W>
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
  const pwErr=pwTouched&&pw.length>0&&pw.length<8?"Mindestens 8 Zeichen":"";
  const pw2Err=pw2Touched&&pw2&&pw!==pw2?"Passwoerter stimmen nicht ueberein":"";
  const regOk=vorname.trim().length>0&&nachname.trim().length>0&&pw.length>=8&&pw===pw2;
  const sub=data.firmenname?data.firmenname.toLowerCase().replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,""):"firmenname";
  const handleOrder=async()=>{
    if(!regOk){setSaveErr("Bitte alle Pflichtfelder ausf\u00fcllen.");return;}
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
      facebook:data.facebook||null,instagram:data.instagram||null,linkedin:data.linkedin||null,tiktok:data.tiktok||null
    });
    if(error){setSaveErr("Fehler: "+error.message);setSaving(false);return;}
    // 2. Website-Generierung starten (laeuft im Hintergrund, setzt status:trial nach Abschluss)
    const token=authData?.session?.access_token;
    if(token){
      await fetch("/api/start-build",{
        method:"POST",
        headers:{"Content-Type":"application/json","Authorization":`Bearer ${token}`},
        body:JSON.stringify({})
      });
    }
    setSaving(false);
    // 3. Direkt zum Portal weiterleiten
    window.location.href="/portal";
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
  return(<div className="sp-page" style={{minHeight:"100vh",background:"#fff",fontFamily:T.font,display:"flex",flexDirection:"column",overflow:"hidden"}}><style>{css}</style>
    {/* Top bar */}
    <div className="sp-topbar" style={{padding:"0 40px",borderBottom:`1px solid ${T.bg3}`,display:"flex",alignItems:"center",justifyContent:"space-between",height:60,flexShrink:0}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}><img src="/icon.png" alt="SR" style={{height:22}}/><span style={{fontSize:".95rem",fontWeight:800,color:T.dark,letterSpacing:"-.02em"}}>SiteReady</span></div>
      <button onClick={onBack} style={{padding:"8px 18px",border:`2px solid ${T.bg3}`,borderRadius:T.rSm,background:"#fff",color:T.text,cursor:"pointer",fontSize:".82rem",fontWeight:600,fontFamily:T.font}}>{"\u2190"} Zurück zur Vorschau</button>
    </div>
    {/* Content */}
    <div className="sp-content" style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",padding:"32px 40px",gap:24,maxWidth:1100,margin:"0 auto",width:"100%"}}>
      {/* Header */}
      <div className="sp-header" style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
        <div>
          <div style={{fontSize:".72rem",fontWeight:700,color:T.accent,letterSpacing:".14em",textTransform:"uppercase",marginBottom:8}}>Ihre Bestellung</div>
          <h1 style={{fontSize:"1.9rem",fontWeight:800,color:T.dark,margin:0,letterSpacing:"-.04em",lineHeight:1.05}}>Alles bereit – jetzt freischalten.</h1>
        </div>
        <div style={{display:"inline-flex",alignItems:"center",gap:10,background:T.bg,border:`1.5px solid rgba(22,163,74,.2)`,borderRadius:T.rSm,padding:"12px 20px",flexShrink:0}}>
          <div style={{width:7,height:7,borderRadius:"50%",background:T.green,boxShadow:"0 0 0 3px rgba(22,163,74,.15)"}}/>
          <span style={{fontSize:".9rem",fontWeight:700,color:T.dark,fontFamily:T.mono}}>{sub}.siteready.at</span>
          <span style={{fontSize:".65rem",fontWeight:700,color:T.green,background:T.greenLight,padding:"3px 8px",borderRadius:4,textTransform:"uppercase",letterSpacing:".06em"}}>Live</span>
        </div>
      </div>
      {/* 2 Karten */}
      <div className="sp-grid" style={{display:"grid",gridTemplateColumns:"3fr 2fr",gap:24}}>
        {/* Paket + Preis */}
        <div style={{background:"#fff",borderRadius:T.r,padding:"28px 32px",border:`2px solid rgba(37,99,235,.15)`,boxShadow:T.sh2}}>
          <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",marginBottom:20,paddingBottom:20,borderBottom:`1px solid ${T.bg3}`}}>
            <div>
              <div style={{fontSize:".72rem",fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:".12em",marginBottom:10}}>7 Tage kostenlos testen</div>
              <div style={{display:"flex",alignItems:"baseline",gap:6}}>
                <span style={{fontSize:"2.6rem",fontWeight:800,color:T.dark,fontFamily:T.mono,letterSpacing:"-.04em",lineHeight:1}}>{"\u20AC"}0</span>
                <span style={{fontSize:".9rem",color:T.textMuted,fontWeight:500}}>heute</span>
              </div>
              <div style={{fontSize:".78rem",color:T.textMuted,marginTop:4}}>Ab {"\u20AC"}15.30/Monat (jährl.) oder {"\u20AC"}18/Monat (monatl.) &middot; Karte erst nach 7 Tagen belastet</div>
            </div>
            {saved
              ?<div style={{display:"flex",alignItems:"center",gap:8,padding:"12px 20px",background:T.greenLight,borderRadius:T.rSm,border:"1px solid rgba(22,163,74,.2)"}}>
                <span style={{color:T.green,fontWeight:700,fontSize:".88rem"}}>{"\u2713"} Weiterleitung...</span>
              </div>
              :<button onClick={handleOrder} disabled={saving||!regOk} style={{padding:"12px 24px",border:"none",borderRadius:T.rSm,background:saving?"#94a3b8":!regOk?"#cbd5e1":T.dark,color:"#fff",fontSize:".88rem",fontWeight:700,fontFamily:T.font,cursor:saving?"wait":!regOk?"not-allowed":"pointer",whiteSpace:"nowrap",transition:"background .2s"}}>
                {saving?"Website wird erstellt...":"Kostenlos starten \u2192"}
              </button>}
          </div>
          {/* Registrierung */}
          <div style={{marginBottom:20}}>
            <div style={{fontSize:".72rem",fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:".1em",marginBottom:12}}>Account erstellen</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
              <div>
                <label style={{display:"block",marginBottom:5,fontSize:".78rem",fontWeight:700,color:T.textSub}}>Vorname <span style={{color:"#ef4444"}}>*</span></label>
                <input value={vorname} onChange={e=>setVorname(e.target.value)} placeholder="Alexander" style={{width:"100%",padding:"11px 14px",border:`1.5px solid ${T.bg3}`,borderRadius:T.rSm,fontSize:14,fontFamily:T.font,background:"#fff",color:T.dark,outline:"none",boxSizing:"border-box"}}/>
              </div>
              <div>
                <label style={{display:"block",marginBottom:5,fontSize:".78rem",fontWeight:700,color:T.textSub}}>Nachname <span style={{color:"#ef4444"}}>*</span></label>
                <input value={nachname} onChange={e=>setNachname(e.target.value)} placeholder="Wagner" style={{width:"100%",padding:"11px 14px",border:`1.5px solid ${T.bg3}`,borderRadius:T.rSm,fontSize:14,fontFamily:T.font,background:"#fff",color:T.dark,outline:"none",boxSizing:"border-box"}}/>
              </div>
            </div>
            <div style={{marginBottom:10}}>
              <label style={{display:"block",marginBottom:5,fontSize:".78rem",fontWeight:700,color:T.textSub}}>E-Mail</label>
              <div style={{padding:"11px 14px",border:`1.5px solid ${T.bg3}`,borderRadius:T.rSm,fontSize:14,background:"#f8fafc",color:T.textMuted,fontFamily:T.font}}>{data.email||"–"}</div>
            </div>
            <div style={{marginBottom:10}}>
              <label style={{display:"block",marginBottom:5,fontSize:".78rem",fontWeight:700,color:pwErr?"#ef4444":T.textSub}}>Passwort{" "}<span style={{color:"#ef4444"}}>*</span></label>
              <input type="password" value={pw} onChange={e=>setPw(e.target.value)} onBlur={()=>setPwTouched(true)} placeholder="Mindestens 8 Zeichen" style={{width:"100%",padding:"11px 14px",border:`1.5px solid ${pwErr?"#ef4444":T.bg3}`,borderRadius:T.rSm,fontSize:14,fontFamily:T.font,background:"#fff",color:T.dark,outline:"none",boxSizing:"border-box"}}/>
              {pwErr&&<div style={{marginTop:4,fontSize:".72rem",color:"#ef4444"}}>{pwErr}</div>}
            </div>
            <div>
              <label style={{display:"block",marginBottom:5,fontSize:".78rem",fontWeight:700,color:pw2Err?"#ef4444":T.textSub}}>Passwort bestätigen{" "}<span style={{color:"#ef4444"}}>*</span></label>
              <input type="password" value={pw2} onChange={e=>setPw2(e.target.value)} onBlur={()=>setPw2Touched(true)} placeholder="Passwort wiederholen" style={{width:"100%",padding:"11px 14px",border:`1.5px solid ${pw2Err?"#ef4444":T.bg3}`,borderRadius:T.rSm,fontSize:14,fontFamily:T.font,background:"#fff",color:T.dark,outline:"none",boxSizing:"border-box"}}/>
              {pw2Err&&<div style={{marginTop:4,fontSize:".72rem",color:"#ef4444"}}>{pw2Err}</div>}
            </div>
          </div>
          {saveErr&&<div style={{marginBottom:12,padding:"10px 14px",background:"#fef2f2",borderRadius:T.rSm,border:"1px solid #fecaca",fontSize:".78rem",color:"#dc2626"}}>{saveErr}</div>}
          <div className="sp-incl-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {included.map((s,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:T.bg,borderRadius:T.rSm,border:`1px solid ${T.bg3}`}}>
              <div style={{width:20,height:20,borderRadius:6,background:T.greenLight,color:T.green,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,flexShrink:0,border:"1px solid rgba(22,163,74,.15)"}}>{"\u2713"}</div>
              <span style={{fontWeight:600,fontSize:".82rem",color:T.dark}}>{s.t}</span>
            </div>)}
          </div>
          <div style={{marginTop:12,textAlign:"center",fontSize:".72rem",color:T.textMuted}}>Sichere Zahlung via Stripe &middot; Karte, EPS, PayPal</div>
        </div>
        {/* Portal */}
        <div style={{background:T.bg,borderRadius:T.r,padding:"28px 32px",border:`1px solid ${T.bg3}`}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:20}}>
            <div style={{fontSize:".72rem",fontWeight:700,color:T.accent,textTransform:"uppercase",letterSpacing:".1em"}}>Self-Service-Portal</div>
            <span style={{fontSize:".65rem",fontWeight:700,background:T.accentLight,color:T.accent,padding:"2px 8px",borderRadius:4,letterSpacing:".06em"}}>Nach Kauf</span>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {portal.map((s,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:"#fff",borderRadius:T.rSm,border:`1px solid ${T.bg3}`}}>
              <div style={{width:20,height:20,borderRadius:6,background:T.accentLight,color:T.accent,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,flexShrink:0,border:`1px solid rgba(37,99,235,.1)`}}>{"\u2192"}</div>
              <div style={{flex:1}}><span style={{fontWeight:600,fontSize:".82rem",color:T.dark}}>{s.t}</span><span style={{fontSize:".7rem",fontWeight:400,color:T.textMuted,marginLeft:6}}>optional</span></div>
            </div>)}
          </div>
        </div>
      </div>
    </div>
  </div>);
}

/* ═══ FORM COMPONENTS (unified light premium) ═══ */
function Field({label,value,onChange,placeholder,type="text",rows,hint,required}){const[f,setF]=useState(false);const[touched,setTouched]=useState(false);const err=required&&touched&&!value?.trim();const border=err?`2px solid #ef4444`:f?`2px solid ${T.accent}`:`2px solid ${T.bg3}`;const shadow=err?`0 0 0 4px rgba(239,68,68,.1)`:f?`0 0 0 4px ${T.accentGlow}`:"none";const base={width:"100%",padding:"13px 16px",border,borderRadius:T.rSm,fontSize:14,fontFamily:T.font,background:T.white,color:T.dark,outline:"none",transition:"all .2s",boxShadow:shadow,boxSizing:"border-box"};return(<div style={{marginBottom:20}}><label style={{display:"block",marginBottom:7,fontSize:".78rem",fontWeight:700,color:err?"#ef4444":f?T.accent:T.textSub,transition:"color .2s",letterSpacing:".03em"}}>{label}{required&&<span style={{color:"#ef4444",marginLeft:3}}>*</span>}</label>{rows?<textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={rows} onFocus={()=>setF(true)} onBlur={()=>{setF(false);setTouched(true);}} style={{...base,resize:"vertical",lineHeight:1.5}}/>:<input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} onFocus={()=>setF(true)} onBlur={()=>{setF(false);setTouched(true);}} style={base}/>}{err?<div style={{marginTop:4,fontSize:".72rem",color:"#ef4444"}}>Pflichtfeld</div>:hint&&<div style={{marginTop:5,fontSize:".72rem",color:T.textMuted}}>{hint}</div>}</div>)}

function Dropdown({label,value,onChange,options,placeholder,hint,required}){const[f,setF]=useState(false);const[touched,setTouched]=useState(false);const err=required&&touched&&!value;const border=err?`2px solid #ef4444`:f?`2px solid ${T.accent}`:`2px solid ${T.bg3}`;const shadow=err?`0 0 0 4px rgba(239,68,68,.1)`:f?`0 0 0 4px ${T.accentGlow}`:"none";return(<div style={{marginBottom:20}}><label style={{display:"block",marginBottom:7,fontSize:".78rem",fontWeight:700,color:err?"#ef4444":f?T.accent:T.textSub,letterSpacing:".03em"}}>{label}{required&&<span style={{color:"#ef4444",marginLeft:3}}>*</span>}</label><select value={value} onChange={e=>onChange(e.target.value)} onFocus={()=>setF(true)} onBlur={()=>{setF(false);setTouched(true);}} style={{width:"100%",padding:"13px 16px",border,borderRadius:T.rSm,fontSize:14,fontFamily:T.font,background:T.white,color:value?T.dark:T.textMuted,outline:"none",transition:"all .2s",boxShadow:shadow,boxSizing:"border-box",cursor:"pointer",appearance:"none",backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M3 5l3 3 3-3' fill='none' stroke='%238b919e' stroke-width='1.5'/%3E%3C/svg%3E\")",backgroundRepeat:"no-repeat",backgroundPosition:"right 16px center"}}><option value="" disabled>{placeholder||"Bitte wählen"}</option>{options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}</select>{err?<div style={{marginTop:4,fontSize:".72rem",color:"#ef4444"}}>Pflichtfeld</div>:hint&&<div style={{marginTop:5,fontSize:".72rem",color:T.textMuted}}>{hint}</div>}</div>)}

function Checklist({label,options,selected,onChange,hint}){const toggle=i=>{if(selected.includes(i))onChange(selected.filter(s=>s!==i));else onChange([...selected,i])};return(<div style={{marginBottom:20}}><label style={{display:"block",marginBottom:8,fontSize:".78rem",fontWeight:700,color:T.textSub,letterSpacing:".03em"}}>{label}</label><div style={{display:"flex",flexWrap:"wrap",gap:8}}>{options.map(o=>{const on=selected.includes(o);return(<button key={o} onClick={()=>toggle(o)} style={{padding:"10px 16px",borderRadius:T.rSm,border:on?`2px solid ${T.accent}`:`2px solid ${T.bg3}`,background:on?T.accentLight:T.white,color:on?T.accent:T.text,fontSize:13,fontWeight:on?600:400,cursor:"pointer",transition:"all .15s",display:"flex",alignItems:"center",gap:7,fontFamily:T.font}}><span style={{width:18,height:18,borderRadius:5,border:on?"none":`2px solid ${T.bg3}`,background:on?T.accent:T.white,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"#fff",flexShrink:0}}>{on?"\u2713":""}</span>{o}</button>)})}</div>{hint&&<div style={{marginTop:6,fontSize:".72rem",color:T.textMuted}}>{hint}</div>}</div>)}

function Toggle({label,checked,onChange,desc}){return(<label style={{display:"flex",alignItems:"center",gap:14,cursor:"pointer",padding:"16px 18px",borderRadius:T.rSm,border:`2px solid ${checked?"rgba(37,99,235,.15)":T.bg3}`,background:checked?T.accentLight:T.white,transition:"all .2s",marginBottom:20}}><div style={{width:42,height:24,borderRadius:12,background:checked?T.accent:T.bg3,transition:"background .2s",position:"relative",flexShrink:0}}><div style={{width:20,height:20,borderRadius:"50%",background:"#fff",position:"absolute",top:2,left:checked?20:2,transition:"left .2s",boxShadow:"0 1px 4px rgba(0,0,0,.15)"}}/></div><input type="checkbox" checked={checked} onChange={e=>onChange(e.target.checked)} style={{display:"none"}}/><div><span style={{fontSize:".88rem",fontWeight:600,color:T.dark}}>{label}</span>{desc&&<div style={{fontSize:".75rem",color:T.textMuted,marginTop:2}}>{desc}</div>}</div></label>)}

function TagInput({label,value,onChange,placeholder,hint,max=8}){const[input,setInput]=useState("");const[f,setF]=useState(false);const tags=value?value.split("\n").filter(t=>t.trim()):[];const add=()=>{const v=input.trim();if(!v||tags.length>=max)return;onChange([...tags,v].join("\n"));setInput("");};const remove=i=>onChange(tags.filter((_,idx)=>idx!==i).join("\n"));const onKey=e=>{if(e.key==="Enter"){e.preventDefault();add();}};return(<div style={{marginBottom:20}}><label style={{display:"block",marginBottom:7,fontSize:".78rem",fontWeight:700,color:f?T.accent:T.textSub,letterSpacing:".03em"}}>{label}</label><div onFocus={()=>setF(true)} onBlur={()=>setF(false)} style={{border:f?`2px solid ${T.accent}`:`2px solid ${T.bg3}`,borderRadius:T.rSm,background:T.white,padding:"10px 12px",transition:"all .2s",boxShadow:f?`0 0 0 4px ${T.accentGlow}`:"none",minHeight:52}}>{tags.length>0&&<div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:8}}>{tags.map((t,i)=><span key={i} style={{display:"inline-flex",alignItems:"center",gap:5,padding:"4px 10px",background:T.accentLight,border:`1px solid rgba(37,99,235,.15)`,borderRadius:20,fontSize:"12px",fontWeight:600,color:T.accent}}>{t}<button onClick={()=>remove(i)} style={{display:"flex",alignItems:"center",justifyContent:"center",width:14,height:14,borderRadius:"50%",border:"none",background:"rgba(37,99,235,.15)",color:T.accent,cursor:"pointer",padding:0,fontSize:10,fontWeight:700,lineHeight:1}}>×</button></span>)}</div>}<input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={onKey} placeholder={tags.length===0?placeholder:"Weitere Leistung eingeben + Enter"} style={{border:"none",outline:"none",width:"100%",fontSize:14,fontFamily:T.font,color:T.dark,background:"transparent",padding:0}}/></div>{tags.length>=max&&<div style={{marginTop:4,fontSize:".72rem",color:T.textMuted}}>Maximum ({max}) erreicht</div>}{hint&&tags.length<max&&<div style={{marginTop:4,fontSize:".72rem",color:T.textMuted}}>{hint}</div>}</div>);}

function StylePicker({value,onChange}){return(<div style={{display:"flex",flexDirection:"column",gap:12}}>{Object.entries(STYLES_MAP).map(([key,s])=>{const on=value===key;return(<button key={key} onClick={()=>onChange(key)} style={{display:"flex",alignItems:"center",gap:16,padding:"18px 20px",border:on?`2px solid ${T.accent}`:`2px solid ${T.bg3}`,borderRadius:T.r,background:on?T.accentLight:T.white,cursor:"pointer",textAlign:"left",transition:"all .25s",fontFamily:T.font,boxShadow:on?`0 0 0 4px ${T.accentGlow}`:"none"}}><div style={{width:52,height:52,borderRadius:12,background:s.heroGradient,flexShrink:0}}/><div style={{flex:1}}><div style={{fontWeight:700,fontSize:".95rem",color:T.dark,marginBottom:3}}>{s.label}</div><div style={{fontSize:".8rem",color:T.textMuted}}>{s.desc}</div></div>{on&&<div style={{width:28,height:28,borderRadius:"50%",background:T.accent,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,flexShrink:0}}>{"\u2713"}</div>}</button>)})}</div>)}

/* ═══ PREVIEW (unchanged) ═══ */
function Preview({d,compact}){const s=STYLES_MAP[d.stil]||STYLES_MAP.professional;const extraItems=d.extraLeistung?d.extraLeistung.split("\n").filter(l=>l.trim()):[];const allItems=[...(d.leistungen||[]),...extraItems];const hasContact=d.adresse||d.telefon||d.email;const px=compact?"20px":"28px";const adressFull=[d.adresse,[d.plz,d.ort].filter(Boolean).join(" ")].filter(Boolean).join(", ");const zeit=d.oeffnungszeiten==="custom"?d.oeffnungszeitenCustom:(OEFFNUNGSZEITEN.find(o=>o.value===d.oeffnungszeiten)?.label||"");return(<div style={{fontFamily:s.font,background:s.bg,color:s.text,minHeight:"100%",fontSize:"14px",lineHeight:1.65,overflowY:"auto",transition:"background 0.4s"}}><div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:`10px ${px}`,background:s.cardBg,borderBottom:`1px solid ${s.borderColor}`,position:"sticky",top:0,zIndex:10}}><div style={{fontWeight:700,fontSize:compact?"13px":"15px",color:s.primary}}>{d.firmenname||"Firmenname"}</div><div style={{display:"flex",gap:compact?"12px":"20px",fontSize:"12px",color:s.textMuted}}><span>Leistungen</span><span>Über uns</span><span style={{padding:"4px 12px",borderRadius:"20px",background:s.primary,color:"#fff",fontWeight:600,fontSize:"10px"}}>Kontakt</span></div></div><div style={{background:s.heroGradient,position:"relative",overflow:"hidden",padding:compact?"32px 20px 28px":"48px 28px 44px",color:"#fff"}}><div style={{position:"absolute",inset:0,background:s.heroOverlay}}/><div style={{position:"relative",zIndex:1,display:"flex",gap:"20px",alignItems:"center"}}><div style={{flex:1}}><div style={{display:"flex",flexWrap:"wrap",gap:"6px",marginBottom:"12px"}}>{d.notdienst&&<div style={{display:"inline-block",padding:"3px 10px",background:"rgba(255,255,255,0.18)",borderRadius:"20px",fontSize:"10px",fontWeight:600,letterSpacing:"0.05em",textTransform:"uppercase"}}>⚡ 24h Notdienst</div>}{d.meisterbetrieb&&<div style={{display:"inline-block",padding:"3px 10px",background:"rgba(255,255,255,0.18)",borderRadius:"20px",fontSize:"10px",fontWeight:600,letterSpacing:"0.05em",textTransform:"uppercase"}}>🏆 Meisterbetrieb</div>}{d.kostenvoranschlag&&<div style={{display:"inline-block",padding:"3px 10px",background:"rgba(255,255,255,0.18)",borderRadius:"20px",fontSize:"10px",fontWeight:600,letterSpacing:"0.05em",textTransform:"uppercase"}}>✓ Kostenloser KV</div>}{d.hausbesuche&&<div style={{display:"inline-block",padding:"3px 10px",background:"rgba(255,255,255,0.18)",borderRadius:"20px",fontSize:"10px",fontWeight:600,letterSpacing:"0.05em",textTransform:"uppercase"}}>🏠 Hausbesuche</div>}{d.terminvereinbarung&&<div style={{display:"inline-block",padding:"3px 10px",background:"rgba(255,255,255,0.18)",borderRadius:"20px",fontSize:"10px",fontWeight:600,letterSpacing:"0.05em",textTransform:"uppercase"}}>📅 Nur mit Termin</div>}</div><h1 style={{fontSize:compact?"20px":"26px",fontWeight:700,margin:"0 0 8px",letterSpacing:"-0.025em",lineHeight:1.15}}>{d.firmenname||"Ihr Firmenname"}</h1><p style={{margin:"0 0 4px",opacity:0.85,fontSize:compact?"12px":"14px",fontWeight:500}}>{(d.branche==="sonstige"?d.brancheCustom:d.brancheLabel)||"Ihre Branche"}{d.einsatzgebiet?` \u00B7 ${d.einsatzgebiet}`:""}</p>{d.kurzbeschreibung&&<p style={{margin:"12px 0 0",opacity:0.75,fontSize:compact?"11px":"13px",lineHeight:1.55}}>{d.kurzbeschreibung}</p>}{d.telefon&&<div style={{marginTop:"16px",display:"inline-flex",alignItems:"center",gap:"8px",background:"rgba(255,255,255,0.15)",borderRadius:s.radius,padding:"8px 16px",fontSize:"13px",fontWeight:600}}>{"\uD83D\uDCDE"} {d.telefon}</div>}<div style={{marginTop:"14px",display:"inline-flex",gap:"8px",flexWrap:"wrap"}}><div style={{padding:"8px 18px",borderRadius:s.radius,background:"#fff",color:s.primary,fontSize:"12px",fontWeight:700,cursor:"pointer"}}>Jetzt kontaktieren</div><div style={{padding:"8px 18px",borderRadius:s.radius,background:"rgba(255,255,255,0.15)",color:"#fff",fontSize:"12px",fontWeight:600,border:"1px solid rgba(255,255,255,0.3)"}}>Leistungen</div>{d.buchungslink&&<div style={{padding:"8px 18px",borderRadius:s.radius,background:s.primary,color:"#fff",fontSize:"12px",fontWeight:700,cursor:"pointer",border:"1px solid rgba(255,255,255,0.3)"}}>Termin buchen</div>}</div></div>{}</div></div><div style={{padding:`24px ${px} 20px`}}><div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"14px"}}><h2 style={{fontSize:compact?"15px":"18px",fontWeight:700,color:s.primary,margin:0}}>Unsere Leistungen</h2><div style={{flex:1,height:"1px",background:s.borderColor}}/></div>{allItems.length>0?(<div style={{display:"grid",gridTemplateColumns:compact?"1fr":"1fr 1fr",gap:"8px"}}>{allItems.map((l,i)=>(<div key={i} style={{background:s.cardBg,border:`1px solid ${s.borderColor}`,borderRadius:s.radius,padding:"11px 13px",display:"flex",alignItems:"flex-start",gap:"10px",boxShadow:s.shadow,fontSize:"12px"}}><div style={{width:"20px",height:"20px",borderRadius:s.radius,background:s.accentSoft,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:"11px",color:s.accent,fontWeight:700}}>{String(i+1).padStart(2,"0")}</div><span style={{fontWeight:500}}>{l}</span></div>))}</div>):(<div style={{background:s.cardBg,border:`2px dashed ${s.borderColor}`,borderRadius:s.radiusLg,padding:"24px",textAlign:"center",color:s.textLight,fontSize:"12px"}}>Ihre Leistungen erscheinen hier</div>)}</div>{d.fotos&&<div style={{padding:`0 ${px} 12px`}}><div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"10px"}}><h2 style={{fontSize:compact?"13px":"16px",fontWeight:700,color:s.primary,margin:0}}>Ihre Fotos</h2><div style={{flex:1,height:"1px",background:s.borderColor}}/></div><div style={{display:"grid",gridTemplateColumns:compact?"1fr 1fr":"repeat(5,1fr)",gap:"6px"}}>{[1,2,3,4,5].map(i=><div key={i} style={{aspectRatio:"1",background:`linear-gradient(135deg,${s.accentSoft},${s.borderColor})`,borderRadius:s.radius,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:3,border:`1px dashed ${s.borderColor}`}}><span style={{fontSize:compact?"1rem":"1.1rem"}}>📷</span><span style={{fontSize:"11px",color:s.textLight,fontWeight:600,textTransform:"uppercase",letterSpacing:".05em"}}>Foto {i}</span></div>)}</div></div>}<div style={{padding:`0 ${px} 24px`}}><div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"14px"}}><h2 style={{fontSize:compact?"15px":"18px",fontWeight:700,color:s.primary,margin:0}}>Über uns</h2><div style={{flex:1,height:"1px",background:s.borderColor}}/></div><div style={{background:s.cardBg,borderRadius:s.radiusLg,padding:"18px 20px",boxShadow:s.shadow,borderLeft:`3px solid ${s.accent}`}}><p style={{margin:0,color:s.textMuted,fontSize:"12px",lineHeight:1.7}}>{d.firmenname?`Dieser Text wird individuell für ${d.firmenname} generiert.`:"Hier entsteht Ihr individueller Text."}</p><div style={{marginTop:"10px",display:"inline-block",padding:"3px 9px",borderRadius:"20px",background:s.badgeBg,color:s.badgeText,fontSize:"11px",fontWeight:600}}>Wird nach Bestellung generiert</div></div></div>{hasContact&&(<div style={{margin:`0 ${px} 24px`,padding:"20px",background:s.cardBg,borderRadius:s.radiusLg,boxShadow:s.shadow,border:`1px solid ${s.borderColor}`}}><h2 style={{fontSize:compact?"15px":"18px",fontWeight:700,color:s.primary,margin:"0 0 14px"}}>Kontakt</h2><div style={{display:"grid",gridTemplateColumns:compact?"1fr":"1fr 1fr",gap:"8px"}}>{[{icon:"\uD83D\uDCCD",label:"Adresse",value:adressFull},{icon:"\uD83D\uDCDE",label:"Telefon",value:d.telefon},{icon:"\u2709\uFE0F",label:"E-Mail",value:d.email},{icon:"\uD83D\uDD50",label:"Öffnungszeiten",value:zeit}].filter(x=>x.value).map((x,i)=>(<div key={i} style={{padding:"10px 12px",borderRadius:s.radius,background:s.accentSoft,fontSize:"11px"}}><div style={{fontSize:"11px",color:s.textMuted,textTransform:"uppercase",letterSpacing:"0.05em",fontWeight:600,marginBottom:"3px"}}>{x.icon} {x.label}</div><div style={{fontWeight:500,whiteSpace:"pre-line",lineHeight:1.5}}>{x.value}</div></div>))}</div></div>)}<div style={{background:s.primary,color:"#fff",padding:`20px ${px}`,fontSize:"12px"}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:"12px"}}><div><div style={{fontWeight:700,fontSize:"13px",marginBottom:"3px"}}>{d.firmenname||"Firmenname"}</div><div style={{opacity:0.7}}>{adressFull}</div></div><div style={{textAlign:"right",opacity:0.7}}>{d.telefon&&<div>{d.telefon}</div>}{d.email&&<div>{d.email}</div>}</div></div><div style={{borderTop:"1px solid rgba(255,255,255,0.15)",paddingTop:"10px",opacity:0.6,fontSize:"11px"}}>{(d.unternehmensform||d.firmenbuchnummer||d.uid)&&<div style={{marginBottom:5,lineHeight:1.6,opacity:.8}}>{d.unternehmensform&&<span>{d.unternehmensform} &nbsp;</span>}{d.uid&&<span>UID: {d.uid} &nbsp;</span>}{d.firmenbuchnummer&&<span>FN: {d.firmenbuchnummer} &nbsp;</span>}{d.firmenbuchgericht&&<span>{d.firmenbuchgericht} &nbsp;</span>}{d.gisazahl&&<span>GISA: {d.gisazahl}</span>}</div>}<div style={{display:"flex",justifyContent:"space-between"}}><span>Impressum | Datenschutz</span><span>SiteReady.at</span></div></div></div></div>)}

/* ═══ QUESTIONNAIRE (unified light premium) ═══ */
function Questionnaire({data,setData,onComplete,onBack}){
  const[step,setStep]=useState(0);const ref=useRef(null);const[isMobile]=useState(typeof window!=="undefined"&&window.innerWidth<768);const[showPreview,setShowPreview]=useState(false);const[showImport,setShowImport]=useState(true);const[showBerufsgruppe,setShowBerufsgruppe]=useState(false);const[importUrl,setImportUrl]=useState("");const[importLoading,setImportLoading]=useState(false);const[importErr,setImportErr]=useState("");const doImport=async()=>{if(!importUrl.trim())return;setImportLoading(true);setImportErr("");try{const r=await fetch("/api/import-website",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({url:importUrl})});const j=await r.json();if(j.error){setImportErr(j.error);setImportLoading(false);return;}const b=j.branche?BRANCHEN.find(x=>x.value===j.branche):null;const allLeistungen=Array.isArray(j.leistungen)?j.leistungen:[];setData(d=>({...d,firmenname:j.firmenname||d.firmenname,telefon:j.telefon||d.telefon,email:j.email||d.email,plz:j.plz||d.plz,ort:j.ort||d.ort,adresse:j.adresse||d.adresse,kurzbeschreibung:j.kurzbeschreibung||d.kurzbeschreibung,bundesland:j.bundesland||d.bundesland,unternehmensform:j.unternehmensform||d.unternehmensform,uid:j.uid||d.uid,firmenbuchnummer:j.firmenbuchnummer||d.firmenbuchnummer,gisazahl:j.gisazahl||d.gisazahl,firmenbuchgericht:j.firmenbuchgericht||d.firmenbuchgericht,facebook:j.facebook||d.facebook,instagram:j.instagram||d.instagram,linkedin:j.linkedin||d.linkedin,tiktok:j.tiktok||d.tiktok,...(b?{berufsgruppe:b.gruppe,branche:b.value,brancheLabel:b.label,stil:b.stil,leistungen:allLeistungen.length>0?allLeistungen:d.leistungen,extraLeistung:""}:{leistungen:allLeistungen.length>0?allLeistungen:d.leistungen})}));setImportLoading(false);setShowImport(false);setShowBerufsgruppe(true);}catch(e){setImportErr("Verbindungsfehler: "+e.message);setImportLoading(false);}};
const up=useCallback(k=>v=>setData(d=>({...d,[k]:v})),[setData]);const go=n=>{setStep(n);if(ref.current)ref.current.scrollTop=0;if(isMobile&&n===STEPS.length-1)setShowPreview(true);};const pct=((step+1)/STEPS.length)*100;const selectedBranche=BRANCHEN.find(b=>b.value===data.branche);const brancheLeistungen=selectedBranche?selectedBranche.leistungen:[];const onBrancheChange=val=>{const b=BRANCHEN.find(x=>x.value===val);setData(d=>({...d,branche:val,brancheLabel:b?b.label:"",brancheCustom:"",stil:b?b.stil:d.stil,leistungen:[],extraLeistung:""}))};const onBerufsgruppChange=val=>{setData(d=>({...d,berufsgruppe:val,branche:"",brancheLabel:"",brancheCustom:"",leistungen:[],extraLeistung:""}));};
  const filteredBranchen=data.berufsgruppe?BRANCHEN.filter(b=>b.gruppe===data.berufsgruppe):BRANCHEN;
  const legalOk=(()=>{const uf=data.unternehmensform;if(!uf)return false;const needsFB=["eu","gmbh","og","kg","ag"].includes(uf);if(needsFB&&(!data.firmenbuchnummer?.trim()||!data.firmenbuchgericht?.trim()))return false;if(uf==="gmbh"&&!data.geschaeftsfuehrer?.trim())return false;if(uf==="ag"&&!data.vorstand?.trim())return false;if(uf==="verein"&&!data.zvr_zahl?.trim())return false;return true;})();
  const stepValid=[!!(data.firmenname?.trim()&&data.branche&&data.bundesland),!!(data.leistungen?.length>0||data.extraLeistung?.trim()),!!(data.adresse?.trim()&&data.plz?.trim()&&data.ort?.trim()&&data.telefon?.trim()&&data.email?.trim()&&data.oeffnungszeiten),legalOk,true];
  const pages=[<>
    <Field label="Firmenname" value={data.firmenname} onChange={up("firmenname")} placeholder="z.B. Elektro Müller GmbH" required/>
    <Dropdown label="Branche" value={data.branche} onChange={onBrancheChange} options={filteredBranchen} placeholder="Branche wählen" hint="Leistungen und Stil werden vorgeschlagen" required/>
    {(data.branche==="sonstige"||data.branche==="sonstige_kosmetik")&&<Field label="Ihre Branche" value={data.brancheCustom} onChange={up("brancheCustom")} placeholder={data.berufsgruppe==="kosmetik"?"z.B. Beautysalon, Spa, ...":"z.B. Spenglerei, Stuckateur, ..."}/>}
    <Field label="Kurzbeschreibung" value={data.kurzbeschreibung} onChange={up("kurzbeschreibung")} placeholder="Seit 15 Jahren Ihr zuverlässiger Partner." rows={2} hint="Optional"/>
    <Dropdown label="Bundesland" value={data.bundesland} onChange={v=>{up("bundesland")(v);const bl=BUNDESLAENDER.find(b=>b.value===v);up("einsatzgebiet")(bl?bl.label:"")}} options={BUNDESLAENDER} placeholder="Bundesland wählen" required/>
  </>,<>{brancheLeistungen.length>0?(<Checklist label="Leistungen auswählen" options={[...new Set([...brancheLeistungen,...(data.leistungen||[])])]} selected={data.leistungen} onChange={up("leistungen")} hint="Wählen Sie Ihre Leistungen"/>):(<TagInput label="Ihre Leistungen" value={data.extraLeistung} onChange={up("extraLeistung")} placeholder="Leistung eingeben + Enter" hint="Leistung eingeben und Enter drücken – max. 8"/>)}{brancheLeistungen.length>0&&<TagInput label="Zusätzliche Leistungen (optional)" value={data.extraLeistung} onChange={up("extraLeistung")} placeholder="z.B. Beratung, Planung, ..." hint="Leistung eingeben und Enter drücken"/>}{data.berufsgruppe==="handwerk"&&<><Toggle label="24h Notdienst" checked={data.notdienst} onChange={up("notdienst")} desc="Wird prominent angezeigt"/><Toggle label="Meisterbetrieb" checked={data.meisterbetrieb} onChange={up("meisterbetrieb")} desc="Zeigt ein Meisterbetrieb-Badge auf Ihrer Website"/><Toggle label="Kostenloser Kostenvoranschlag" checked={data.kostenvoranschlag} onChange={up("kostenvoranschlag")} desc="Wird als Vertrauens-Badge angezeigt"/></>}
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
<div style={{marginTop:8,padding:"12px 14px",background:T.accentLight,borderRadius:T.rSm,border:`1px solid rgba(37,99,235,.12)`}}><div style={{fontSize:".78rem",color:T.accent,lineHeight:1.65}}>Diese Angaben werden automatisch in Ihr Impressum eingebaut (ECG-konform).<br/>Unterstützte Rechtsformen: e.U., Einzelunternehmen, GmbH, OG, KG, AG, Verein, GesbR. Bei anderen Rechtsformen bitte vorab Kontakt aufnehmen.</div></div></>);})()}</>,<><p style={{fontSize:".88rem",color:T.textSub,margin:"0 0 6px",lineHeight:1.6}}>Basierend auf Ihrer Branche empfehlen wir:</p><p style={{fontSize:"1rem",fontWeight:700,color:T.dark,margin:"0 0 16px"}}>{STYLES_MAP[data.stil]?.label||"Professionell"}</p><StylePicker value={data.stil} onChange={up("stil")}/><div style={{marginTop:20,padding:"14px 16px",background:T.accentLight,borderRadius:T.rSm,border:`1px solid rgba(37,99,235,.12)`}}><div style={{fontSize:".78rem",fontWeight:700,color:T.accent,marginBottom:6}}>Nach dem Kauf – Self-Service-Portal</div><div style={{fontSize:".82rem",color:T.textSub,lineHeight:1.7}}>Logo hochladen &middot; Eigene Fotos hochladen &middot; Custom Domain verbinden – alles selbst, jederzeit.</div></div></>];

  const formPanel=(<div style={{display:"flex",flexDirection:"column",background:T.bg,borderRight:isMobile?"none":`1px solid ${T.bg3}`,height:isMobile?"100dvh":"100%",overflowY:"hidden",fontFamily:T.font}}>
    <div style={{padding:"20px 24px 0"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}><button onClick={onBack} style={{background:"none",border:"none",cursor:"pointer",fontSize:16,color:T.textMuted,padding:2}}>{"\u2190"}</button><img src="/icon.png" alt="SR" style={{height:22}}/><span style={{fontSize:".95rem",fontWeight:800,color:T.dark}}>SiteReady</span></div>
        {isMobile&&<button onClick={()=>setShowPreview(!showPreview)} style={{fontSize:".75rem",fontWeight:600,color:T.accent,background:T.accentLight,padding:"5px 12px",borderRadius:6,border:"none",cursor:"pointer",fontFamily:T.font}}>{showPreview?"Formular":"Vorschau"}</button>}
      </div>
      {!showImport&&!showBerufsgruppe&&<><div style={{display:"flex",alignItems:"center",gap:10,margin:"14px 0 16px"}}><div style={{flex:1,height:4,borderRadius:2,background:T.bg3,overflow:"hidden"}}><div style={{height:"100%",borderRadius:2,background:`linear-gradient(90deg,${T.accent},#60a5fa)`,width:`${pct}%`,transition:"width .4s"}}/></div><span style={{fontSize:".72rem",color:T.textMuted,fontWeight:600,fontFamily:T.mono}}>{step+1}/{STEPS.length}</span></div>
      <div style={{display:"flex",gap:2,background:T.bg3,borderRadius:T.rSm,padding:3}}>
        {STEPS.map((s,i)=>{const done=i<step&&stepValid[i];const cur=i===step;return(<button key={s.id} onClick={()=>go(i)} style={{flex:1,padding:"9px 4px",border:"none",background:cur?T.white:"transparent",cursor:"pointer",borderRadius:cur?8:0,fontFamily:T.font,transition:"all .2s",boxShadow:cur?T.sh1:"none"}}><div style={{fontSize:".62rem",fontWeight:700,color:done?"#16a34a":cur?T.accent:T.textMuted,letterSpacing:".08em",marginBottom:2}}>{done?"\u2713":s.num}</div><div style={{fontSize:".78rem",fontWeight:cur?700:500,color:cur?T.dark:done?"#16a34a":T.textMuted}}>{s.title}</div></button>);})}
      </div></>}
    </div>
    <div ref={ref} style={{flex:1,overflowY:"auto",padding:"20px 24px"}}>{showImport?(<div><div style={{display:"inline-flex",alignItems:"center",gap:6,background:T.accentLight,color:T.accent,padding:"5px 14px",borderRadius:100,fontSize:".65rem",fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",marginBottom:18}}>Optionaler Vorschritt</div><h2 style={{fontSize:"1.2rem",fontWeight:800,color:T.dark,marginBottom:10,letterSpacing:"-.02em"}}>Haben Sie schon eine Website?</h2><p style={{fontSize:".88rem",color:T.textSub,lineHeight:1.65,marginBottom:24}}>Wir importieren Ihre Daten automatisch – Sie prüfen und korrigieren nur noch.</p><Field label="Ihre aktuelle Website-URL" value={importUrl} onChange={setImportUrl} placeholder="https://ihre-website.at" hint="Bitte nur Ihre eigene Website angeben"/><div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:16}}><div style={{display:"flex",alignItems:"flex-start",gap:8,padding:"10px 12px",background:"#fefce8",borderRadius:T.rSm,border:"1px solid #fde68a"}}><span style={{fontSize:"13px",flexShrink:0}}>⚠️</span><span style={{fontSize:".78rem",color:"#92400e",lineHeight:1.6}}><strong>Nur Ihre eigene Website:</strong> Bitte geben Sie ausschließlich eine Website an, für die Sie berechtigt sind. Das Importieren fremder Daten ist aus Datenschutzgründen nicht erlaubt.</span></div><div style={{display:"flex",alignItems:"flex-start",gap:8,padding:"10px 12px",background:T.accentLight,borderRadius:T.rSm,border:`1px solid rgba(37,99,235,.12)`}}><span style={{fontSize:"13px",flexShrink:0}}>ℹ️</span><span style={{fontSize:".78rem",color:T.accent,lineHeight:1.6}}><strong>Bitte Daten prüfen:</strong> Die importierten Informationen werden automatisch erkannt und können unvollständig sein. Im nächsten Schritt können Sie alles korrigieren und ergänzen.</span></div></div>{importErr&&<div style={{marginBottom:12,padding:"10px 14px",background:"#fef2f2",borderRadius:T.rSm,border:"1px solid #fecaca",fontSize:".78rem",color:"#dc2626"}}>{importErr}</div>}{importLoading?(<div style={{display:"flex",alignItems:"center",gap:12,padding:"16px 20px",background:T.accentLight,borderRadius:T.rSm,border:`1px solid rgba(37,99,235,.12)`,marginBottom:12}}><div style={{width:18,height:18,borderRadius:"50%",border:`2.5px solid ${T.accent}`,borderTopColor:"transparent",animation:"spin 1s linear infinite",flexShrink:0}}/><span style={{fontSize:".88rem",color:T.accent,fontWeight:600}}>Website wird analysiert...</span></div>):(<button onClick={doImport} style={{width:"100%",padding:"14px",border:"none",borderRadius:T.rSm,background:T.dark,color:"#fff",cursor:"pointer",fontSize:".92rem",fontWeight:700,fontFamily:T.font,boxShadow:"0 2px 12px rgba(0,0,0,.12)",marginBottom:12}}>Daten importieren &rarr;</button>)}</div>):showBerufsgruppe?(<div>
  <div style={{display:"inline-flex",alignItems:"center",gap:6,background:T.accentLight,color:T.accent,padding:"5px 14px",borderRadius:100,fontSize:".65rem",fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",marginBottom:18}}>Schritt 1 von 2</div>
  <h2 style={{fontSize:"1.2rem",fontWeight:800,color:T.dark,marginBottom:10,letterSpacing:"-.02em"}}>Was beschreibt Ihren Betrieb?</h2>
  <p style={{fontSize:".88rem",color:T.textSub,lineHeight:1.65,marginBottom:16}}>Wir passen Design, Leistungen und Website-Texte automatisch an Ihre Branche an.</p>
  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
    {BERUFSGRUPPEN.map(g=>{const on=data.berufsgruppe===g.value;return(<button key={g.value} onClick={()=>onBerufsgruppChange(g.value)} style={{padding:"20px 16px",border:on?`2px solid ${T.accent}`:`1.5px solid ${T.bg3}`,borderRadius:T.r,background:on?T.accentLight:"#fff",cursor:"pointer",textAlign:"left",fontFamily:T.font,transition:"all .2s",boxShadow:on?`0 0 0 4px ${T.accentGlow}`:"none"}}>
      <div style={{fontSize:"1.8rem",marginBottom:8}}>{g.icon}</div>
      <div style={{fontWeight:700,fontSize:".9rem",color:T.dark,marginBottom:4}}>{g.label}</div>
      <div style={{fontSize:".75rem",color:T.textMuted,lineHeight:1.5}}>{g.desc}</div>
      {on&&<div style={{marginTop:10,display:"inline-flex",alignItems:"center",gap:4,background:T.accent,color:"#fff",borderRadius:20,padding:"2px 10px",fontSize:".65rem",fontWeight:700}}>{"\u2713 Ausgewaehlt"}</div>}
    </button>);})}
  </div>
  <div style={{padding:"10px 14px",background:T.bg,borderRadius:T.rSm,border:`1px solid ${T.bg3}`,fontSize:".74rem",color:T.textMuted,lineHeight:1.6}}>Aktuell verfügbar: <strong style={{color:T.text}}>Handwerk</strong> & <strong style={{color:T.text}}>Kosmetik & Körperpflege</strong> &ndash; Weitere Berufsgruppen folgen bald.</div>
</div>):pages[step]}</div>
    <div style={{padding:"16px 24px",borderTop:`1px solid ${T.bg3}`,display:"flex",justifyContent:showImport?"flex-end":"space-between",background:T.white}}>
      {showImport?(<button onClick={()=>{setShowImport(false);setShowBerufsgruppe(true);}} style={{padding:"12px 20px",border:`2px solid ${T.bg3}`,borderRadius:T.rSm,background:T.white,color:T.textSub,cursor:"pointer",fontSize:".85rem",fontWeight:600,fontFamily:T.font}}>Ohne Import starten</button>):showBerufsgruppe?(<><button onClick={()=>{setShowBerufsgruppe(false);setShowImport(true);}} style={{padding:"12px 20px",border:`2px solid ${T.bg3}`,borderRadius:T.rSm,background:T.white,color:T.textSub,cursor:"pointer",fontSize:".85rem",fontWeight:600,fontFamily:T.font}}>{"\u2190"} Zurück</button><button onClick={()=>{if(data.berufsgruppe)setShowBerufsgruppe(false);}} disabled={!data.berufsgruppe} style={{padding:"12px 24px",border:"none",borderRadius:T.rSm,background:data.berufsgruppe?T.dark:"#cbd5e1",color:"#fff",cursor:data.berufsgruppe?"pointer":"not-allowed",fontSize:".85rem",fontWeight:700,fontFamily:T.font,boxShadow:data.berufsgruppe?"0 2px 12px rgba(0,0,0,.12)":"none"}}>Weiter &rarr;</button></>):(<>{step>0?<button onClick={()=>go(step-1)} style={{padding:"12px 20px",border:`2px solid ${T.bg3}`,borderRadius:T.rSm,background:T.white,color:T.textSub,cursor:"pointer",fontSize:".85rem",fontWeight:600,fontFamily:T.font}}>{"\u2190"} Zurück</button>:<div/>}{step<STEPS.length-1?<button onClick={()=>go(step+1)} disabled={!stepValid[step]} style={{padding:"12px 24px",border:"none",borderRadius:T.rSm,background:stepValid[step]?T.dark:"#cbd5e1",color:"#fff",cursor:stepValid[step]?"pointer":"not-allowed",fontSize:".85rem",fontWeight:700,fontFamily:T.font,boxShadow:stepValid[step]?"0 2px 12px rgba(0,0,0,.12)":"none",transition:"background .2s"}}>Weiter &rarr;</button>:<button onClick={onComplete} disabled={!stepValid.every(v=>v)} style={{padding:"12px 24px",border:"none",borderRadius:T.rSm,background:stepValid.every(v=>v)?"linear-gradient(135deg,#16a34a,#22c55e)":"#cbd5e1",color:"#fff",cursor:stepValid.every(v=>v)?"pointer":"not-allowed",fontSize:".85rem",fontWeight:700,fontFamily:T.font,boxShadow:stepValid.every(v=>v)?"0 2px 12px rgba(22,163,74,.2)":"none",transition:"background .2s"}}>Website erstellen &rarr;</button>}</>)}
    </div>
  </div>);

  if(isMobile){if(showPreview)return<div style={{minHeight:"100vh",background:T.bg}}><div style={{padding:"10px 14px",background:T.white,borderBottom:`1px solid ${T.bg3}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:".82rem",fontWeight:700,color:T.dark}}>Vorschau</span><button onClick={()=>setShowPreview(false)} style={{fontSize:".82rem",fontWeight:600,color:T.accent,background:"none",border:"none",cursor:"pointer",fontFamily:T.font}}>{"\u2190"} Formular</button></div><Preview d={data} compact/></div>;return formPanel}

  return(<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",height:"100vh",overflow:"hidden"}}><style>{css}</style>{formPanel}<div style={{display:"flex",flexDirection:"column",overflow:"hidden",background:T.bg2}}>
    <div style={{padding:"12px 18px",background:T.white,borderBottom:`1px solid ${T.bg3}`,display:"flex",alignItems:"center",gap:10}}>
      <div style={{display:"flex",gap:5}}>{["#ff5f57","#febc2e","#28c840"].map(c=><span key={c} style={{width:10,height:10,borderRadius:"50%",background:c}}/>)}</div>
      <div style={{flex:1,background:T.bg,borderRadius:8,padding:"7px 16px",fontSize:".78rem",color:T.textMuted,display:"flex",alignItems:"center",gap:6,border:`1px solid ${T.bg3}`,fontFamily:T.mono}}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>{data.firmenname?`${data.firmenname.toLowerCase().replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,"")}.siteready.at`:"firmenname.siteready.at"}</div>
      <div style={{background:"#fef9c3",color:"#92400e",fontSize:".65rem",fontWeight:700,padding:"5px 12px",borderRadius:6,textTransform:"uppercase",fontFamily:T.font,letterSpacing:".06em"}}>Vorschau</div>
    </div>
    <div style={{padding:"5px 18px",background:"#fafafa",borderBottom:`1px solid ${T.bg3}`,fontSize:".69rem",color:T.textMuted,textAlign:"center"}}>Stilvorschau &ndash; Ihre fertige Website wird professioneller gestaltet und mit individuellem Text geliefert.</div>
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

  const submitForgot=async()=>{if(!email){setErr("Bitte E-Mail eingeben.");return;}setLoading(true);setErr("");const{error}=await supabase.auth.resetPasswordForEmail(email,{redirectTo:window.location.origin+"/portal"});if(error)setErr(error.message);else setForgotDone(true);setLoading(false);};
  const submit=async()=>{
    if(!email.trim()||!pw.trim()||!supabase)return;
    setLoading(true);setErr("");
    const{error}=await supabase.auth.signInWithPassword({email,password:pw});
    if(error)setErr(error.message==="Invalid login credentials"?"E-Mail oder Passwort falsch.":error.message);
    setLoading(false);
  };

  return(<div style={{minHeight:"100vh",background:"#fff",fontFamily:T.font,display:"flex",alignItems:"center",justifyContent:"center"}}><style>{css}</style>
    <div style={{maxWidth:400,width:"100%",padding:"0 24px"}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:40}}>
        <img src="/icon.png" alt="SR" style={{height:22}}/><span style={{fontSize:".95rem",fontWeight:800,color:T.dark}}>SiteReady</span>
      </div>
      {forgotDone?(<div><div style={{fontSize:"1.4rem",fontWeight:800,color:T.dark,marginBottom:12}}>{"\u2713"} E-Mail gesendet</div><p style={{color:T.textSub,fontSize:".9rem",lineHeight:1.6}}>Prüfen Sie Ihren Posteingang – Sie erhalten in Kürze einen Link zum Zurücksetzen Ihres Passworts.</p><button onClick={()=>{setForgotDone(false);setForgotPw(false);}} style={{marginTop:20,padding:"12px 20px",border:"none",borderRadius:T.rSm,background:T.dark,color:"#fff",cursor:"pointer",fontSize:".85rem",fontWeight:700,fontFamily:T.font}}>Zur Anmeldung</button></div>):forgotPw?(<div><div style={{fontSize:"1.2rem",fontWeight:800,color:T.dark,marginBottom:8}}>Passwort zurücksetzen</div><p style={{color:T.textSub,fontSize:".85rem",marginBottom:20}}>Geben Sie Ihre E-Mail-Adresse ein – wir senden Ihnen einen Link.</p><Field label="E-Mail-Adresse" value={email} onChange={setEmail} placeholder="ihre@email.at" type="email"/>{err&&<div style={{marginBottom:12,padding:"10px 14px",background:"#fef2f2",borderRadius:T.rSm,fontSize:".78rem",color:"#dc2626"}}>{err}</div>}<button onClick={submitForgot} disabled={loading} style={{width:"100%",padding:"14px",border:"none",borderRadius:T.rSm,background:loading?"#94a3b8":T.dark,color:"#fff",fontSize:".92rem",fontWeight:700,fontFamily:T.font,cursor:loading?"wait":"pointer",marginBottom:12}}>{loading?"...":"Link senden \u2192"}</button><button onClick={()=>{setForgotPw(false);setErr("");}} style={{width:"100%",padding:"12px",border:`2px solid ${T.bg3}`,borderRadius:T.rSm,background:"#fff",color:T.textSub,fontSize:".85rem",fontWeight:600,fontFamily:T.font,cursor:"pointer"}}>Abbrechen</button></div>):(<div>
        <div style={{fontSize:".72rem",fontWeight:700,color:T.accent,letterSpacing:".14em",textTransform:"uppercase",marginBottom:8}}>Self-Service-Portal</div>
        <h2 style={{fontSize:"1.5rem",fontWeight:800,color:T.dark,margin:"0 0 24px",letterSpacing:"-.03em"}}>Anmelden</h2>
        <Field label="E-Mail-Adresse" value={email} onChange={setEmail} placeholder="ihre@email.at" type="email"/>
        <Field label="Passwort" value={pw} onChange={setPw} placeholder="Ihr Passwort" type="password"/>
        <div style={{textAlign:"right",marginTop:-14,marginBottom:16}}><button onClick={()=>{setForgotPw(true);setErr("");}} style={{background:"none",border:"none",color:T.accent,fontSize:".78rem",cursor:"pointer",fontFamily:T.font,fontWeight:600}}>Passwort vergessen?</button></div>
        {err&&<div style={{marginBottom:12,padding:"10px 14px",background:"#fef2f2",borderRadius:T.rSm,fontSize:".78rem",color:"#dc2626"}}>{err}</div>}
        <button onClick={submit} disabled={loading} style={{width:"100%",padding:"14px",border:"none",borderRadius:T.rSm,background:loading?"#94a3b8":T.dark,color:"#fff",fontSize:".92rem",fontWeight:700,fontFamily:T.font,cursor:loading?"wait":"pointer",marginBottom:12,transition:"background .2s"}}>
          {loading?"...":"Anmelden \u2192"}
        </button>
        <button onClick={onBack} style={{width:"100%",padding:"12px",border:`2px solid ${T.bg3}`,borderRadius:T.rSm,background:"#fff",color:T.textSub,fontSize:".85rem",fontWeight:600,fontFamily:T.font,cursor:"pointer"}}>
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
  const[regenSent,setRegenSent]=useState(null);
  const[regenLoading,setRegenLoading]=useState(null);
  const[regenErr,setRegenErr]=useState(null);
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
  const[deleting,setDeleting]=useState({});
  const showToast=(msg)=>{setToastMsg(msg);setTimeout(()=>setToastMsg(null),2500);};

  useEffect(()=>{
    if(!supabase||!session?.user?.email)return;
    supabase.from("orders").select("*").eq("email",session.user.email).order("created_at",{ascending:false}).limit(1)
      .then(({data})=>{if(data&&data.length>0)setOrder(data[0]);});
    // Existierende Assets laden
    const uid=session.user.id;
    const keys=["logo","hero","foto1","foto2","foto3","foto4","foto5"];
    const exts=["jpg","jpeg","png","webp","gif"];
    keys.forEach(async key=>{
      for(const ext of exts){
        const path=`${uid}/${key}.${ext}`;
        const{data}=supabase.storage.from("customer-assets").getPublicUrl(path);
        if(data?.publicUrl){
          try{
            const r=await fetch(data.publicUrl,{method:"HEAD"});
            if(r.ok){setAssetUrls(u=>({...u,[key]:data.publicUrl+"?t="+Date.now()}));break;}
          }catch(_){}
        }
      }
    });
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
    if(!file||!session?.user?.id||!supabase)return;
    setUploading(u=>({...u,[key]:true}));
    const ext=file.name.split(".").pop();
    const path=`${session.user.id}/${key}.${ext}`;
    const{error}=await supabase.storage.from("customer-assets").upload(path,file,{upsert:true});
    if(!error){
      const{data}=supabase.storage.from("customer-assets").getPublicUrl(path);
      setAssetUrls(u=>({...u,[key]:data.publicUrl+"?t="+Date.now()}));
      // URL in orders-Tabelle speichern (für Serve-time Injection)
      const colMap={logo:"url_logo",hero:"url_hero",foto1:"url_foto1",foto2:"url_foto2",foto3:"url_foto3",foto4:"url_foto4",foto5:"url_foto5"};
      const col=colMap[key];
      if(col&&order?.id)supabase.from("orders").update({[col]:data.publicUrl}).eq("id",order.id).then(()=>{});
    }
    setUploading(u=>({...u,[key]:false}));
  };

  const deleteAsset=async(key)=>{
    if(!session?.user?.id||!supabase||!order?.id)return;
    setDeleting(d=>({...d,[key]:true}));
    const exts=["jpg","jpeg","png","webp","gif"];
    for(const ext of exts){
      await supabase.storage.from("customer-assets").remove([`${session.user.id}/${key}.${ext}`]).catch(()=>{});
    }
    const colMap={logo:"url_logo",hero:"url_hero",foto1:"url_foto1",foto2:"url_foto2",foto3:"url_foto3",foto4:"url_foto4",foto5:"url_foto5"};
    const col=colMap[key];
    if(col)await supabase.from("orders").update({[col]:null}).eq("id",order.id);
    setAssetUrls(u=>{const n={...u};delete n[key];return n;});
    setDeleting(d=>({...d,[key]:false}));
    showToast("Bild gel\u00f6scht");
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
  const TABS=[{id:"website",label:"Meine Website"},{id:"analytics",label:"Statistiken"},{id:"medien",label:"Logo & Fotos"},{id:"seo",label:"SEO & Google"},{id:"domain",label:"Custom Domain"},{id:"rechnungen",label:"Rechnungen"},{id:"support",label:"Support"},{id:"account",label:"Mein Account"}];

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
      firmenbuch:{uid_nummer:order.uid_nummer,unternehmensform:order.unternehmensform,firmenbuchnummer:order.firmenbuchnummer,gisazahl:order.gisazahl,firmenbuchgericht:order.firmenbuchgericht},
      leistungen:{leistungen:order.leistungen,extra_leistung:order.extra_leistung,notdienst:order.notdienst,meisterbetrieb:order.meisterbetrieb,kostenvoranschlag:order.kostenvoranschlag,buchungslink:order.buchungslink||null,hausbesuche:order.hausbesuche,terminvereinbarung:order.terminvereinbarung,text_ueber_uns:order.text_ueber_uns||null,text_vorteile:order.text_vorteile||null,leistungen_beschreibungen:order.leistungen_beschreibungen||null},
      design:{stil:order.stil,fotos:order.fotos},
      social:{facebook:order.facebook,instagram:order.instagram,linkedin:order.linkedin,tiktok:order.tiktok},
    };
    await supabase.from("orders").update(fields[section]||{}).eq("id",order.id);
    setSaving(false);setSaved(section);setTimeout(()=>setSaved(false),3000);
    setEditSection(null);
  };

  const requestRegen=async(section)=>{
    if(!order||!supabase||!session)return;
    setRegenLoading(section);setRegenErr(null);setEditSection(null);
    const fields={
      leistungen:{leistungen:order.leistungen,extra_leistung:order.extra_leistung,notdienst:order.notdienst,meisterbetrieb:order.meisterbetrieb,kostenvoranschlag:order.kostenvoranschlag,buchungslink:order.buchungslink||null,hausbesuche:order.hausbesuche,terminvereinbarung:order.terminvereinbarung,text_ueber_uns:order.text_ueber_uns||null,text_vorteile:order.text_vorteile||null,leistungen_beschreibungen:order.leistungen_beschreibungen||null},
      design:{stil:order.stil,fotos:order.fotos},
    };
    try{
      const r=await fetch("/api/request-regen",{
        method:"POST",
        headers:{"Content-Type":"application/json","Authorization":`Bearer ${session.access_token}`},
        body:JSON.stringify({section,data:fields[section]}),
      });
      const j=await r.json();
      if(r.status===429){
        const nextDate=new Date(j.next_available).toLocaleDateString("de-AT",{day:"2-digit",month:"long",year:"numeric"});
        setRegenErr(`Limit erreicht. Nächste Neugenierung möglich ab ${nextDate}.`);
      } else if(!r.ok||!j.ok){
        setRegenErr("Fehler: "+(j.error||"Unbekannt"));
      } else {
        const{data:updated}=await supabase.from("orders").select("*").eq("id",order.id).limit(1);
        if(updated?.[0])setOrder(updated[0]);
        setRegenSent(section);setTimeout(()=>setRegenSent(null),5000);
      }
    }catch(e){
      setRegenErr("Netzwerkfehler: "+e.message);
    }
    setRegenLoading(null);
  };

  const regenUsed=order?[order.last_regen_at,order.prev_regen_at].filter(Boolean).filter(d=>new Date(d).getTime()>Date.now()-30*24*60*60*1000).length:0;
  const regenLeft=Math.max(0,2-regenUsed);
  const nextRegenDate=regenLeft===0&&order?(()=>{const dates=[order.last_regen_at,order.prev_regen_at].filter(Boolean).map(d=>new Date(d).getTime()).filter(t=>t>Date.now()-30*24*60*60*1000).sort((a,b)=>a-b);return dates[0]?new Date(dates[0]+30*24*60*60*1000):null;})():null;

  const SectionHeader=({id,label,badge})=>(
    <div style={{marginBottom:16,paddingBottom:12,borderBottom:`1px solid ${T.bg3}`}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{fontSize:".72rem",fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:".1em"}}>{label}</div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
        {saved===id&&<span style={{color:T.green,fontSize:".78rem",fontWeight:600}}>{"\u2713"} Gespeichert</span>}
        {regenSent===id&&<span style={{color:T.green,fontSize:".78rem",fontWeight:600}}>{"\u2713"} Website wird neu erstellt</span>}
        {regenLoading===id
          ?<span style={{color:"#d97706",fontSize:".78rem",fontWeight:600}}>Website wird erstellt...</span>
          :editSection===id
            ?badge==="regen"
              ?<><button onClick={()=>setEditSection(null)} style={{padding:"6px 14px",border:`2px solid ${T.bg3}`,borderRadius:T.rSm,background:"#fff",color:T.textSub,cursor:"pointer",fontSize:".78rem",fontWeight:600,fontFamily:T.font}}>Abbrechen</button>
                <button onClick={()=>requestRegen(id)} disabled={regenLeft===0} style={{padding:"6px 16px",border:"none",borderRadius:T.rSm,background:regenLeft===0?"#94a3b8":"#d97706",color:"#fff",cursor:regenLeft===0?"not-allowed":"pointer",fontSize:".78rem",fontWeight:700,fontFamily:T.font}}>{"\u21BB"} Jetzt neu generieren</button></>
              :<><button onClick={()=>setEditSection(null)} style={{padding:"6px 14px",border:`2px solid ${T.bg3}`,borderRadius:T.rSm,background:"#fff",color:T.textSub,cursor:"pointer",fontSize:".78rem",fontWeight:600,fontFamily:T.font}}>Abbrechen</button>
                <button onClick={()=>saveSection(id)} disabled={saving} style={{padding:"6px 16px",border:"none",borderRadius:T.rSm,background:T.dark,color:"#fff",cursor:"pointer",fontSize:".78rem",fontWeight:700,fontFamily:T.font}}>{saving?"...":"Speichern"}</button></>
            :<button onClick={()=>setEditSection(id)} style={{padding:"6px 16px",border:`2px solid ${T.bg3}`,borderRadius:T.rSm,background:"#fff",color:T.textSub,cursor:"pointer",fontSize:".78rem",fontWeight:600,fontFamily:T.font}}>Bearbeiten</button>}
        </div>
      </div>
      {badge==="instant"&&<div style={{fontSize:".75rem",color:"#16a34a",marginTop:6}}>{"✓"} Änderungen werden sofort auf Ihrer Website sichtbar – kein Warten.</div>}
      {badge==="regen"&&<div style={{fontSize:".75rem",color:regenLeft>0?"#d97706":"#dc2626",marginTop:6}}>
        {regenLeft>0
          ?`\u21BB ${regenLeft} von 2 Website-Neugestaltungen dieses Monats verfügbar. Änderungen werden automatisch übernommen, das kann einen Moment dauern.`
          :`\u26A0 Limit erreicht. Nächste Neugestaltung möglich ab ${nextRegenDate?nextRegenDate.toLocaleDateString("de-AT",{day:"2-digit",month:"long",year:"numeric"}):"bald"}.`}
      </div>}
      {regenErr&&<div style={{fontSize:".78rem",color:"#dc2626",marginTop:6,fontWeight:600}}>{"\u26A0"} {regenErr}</div>}
    </div>
  );

  const InfoRow=({label,value})=>(
    <div className="pt-info-row" style={{display:"grid",gridTemplateColumns:"160px 1fr",padding:"9px 0",borderBottom:`1px solid ${T.bg3}`}}>
      <span style={{fontSize:".78rem",color:T.textMuted,fontWeight:600,paddingTop:1}}>{label}</span>
      <span style={{fontSize:".88rem",color:value?T.dark:T.textMuted}}>{value||"—"}</span>
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
    <div style={{background:"#fff",borderBottom:`1px solid ${T.bg3}`,padding:"0 32px",height:60,display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <img src="/icon.png" alt="SR" style={{height:22}}/>
        <span style={{fontSize:".95rem",fontWeight:800,color:T.dark}}>SiteReady</span>
        <span style={{fontSize:".75rem",color:T.textMuted,background:T.bg,border:`1px solid ${T.bg3}`,padding:"3px 10px",borderRadius:4,fontFamily:T.mono}}>{sub}.siteready.at</span>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:16}}>
        <span style={{fontSize:".82rem",color:T.textSub}}>{session?.user?.email}</span>
        <button onClick={onLogout} style={{padding:"8px 16px",border:`2px solid ${T.bg3}`,borderRadius:T.rSm,background:"#fff",color:T.textSub,cursor:"pointer",fontSize:".82rem",fontWeight:600,fontFamily:T.font}}>Logout</button>
      </div>
    </div>
    {/* Content */}
    <div style={{maxWidth:860,width:"100%",margin:"0 auto",padding:"32px 24px",flex:1}}>
      <div style={{marginBottom:4}}>
        <div style={{fontSize:".72rem",fontWeight:700,color:T.accent,letterSpacing:".14em",textTransform:"uppercase",marginBottom:6}}>Self-Service-Portal</div>
        <h1 style={{fontSize:"1.6rem",fontWeight:800,color:T.dark,margin:"0 0 24px",letterSpacing:"-.03em"}}>Willkommen{order?.firmenname?", "+order.firmenname:""}</h1>
      </div>
      {/* Trial-Banner */}
      {order?.status==="trial"&&(<div style={{background:"linear-gradient(135deg,#7c3aed,#4f46e5)",borderRadius:T.r,padding:"20px 28px",marginBottom:20,display:"flex",alignItems:"center",justifyContent:"space-between",gap:16,flexWrap:"wrap"}}>
        <div>
          <div style={{fontWeight:800,fontSize:"1rem",color:"#fff",marginBottom:4}}>
            {trialDaysLeft>0?`Testphase: noch ${trialDaysLeft} Tag${trialDaysLeft===1?"":"e"}`:"Testphase abgelaufen"}
          </div>
          <div style={{fontSize:".82rem",color:"rgba(255,255,255,.75)"}}>Jetzt abonnieren – Karte wird erst nach der Testphase belastet.</div>
        </div>
        <button onClick={()=>setShowPlanModal(true)} style={{padding:"11px 24px",border:"2px solid rgba(255,255,255,.4)",borderRadius:T.rSm,background:"rgba(255,255,255,.15)",color:"#fff",cursor:"pointer",fontSize:".88rem",fontWeight:700,fontFamily:T.font,whiteSpace:"nowrap",backdropFilter:"blur(4px)"}}>
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
              <div style={{fontSize:".76rem",color:T.textMuted}}>Monatlich kuendbar</div>
            </button>
            <button onClick={()=>subscribe("yearly")} disabled={subscribing} style={{padding:"18px 20px",border:`2px solid ${T.accent}`,borderRadius:T.r,background:T.accentLight,cursor:subscribing?"wait":"pointer",textAlign:"left",fontFamily:T.font,position:"relative"}}>
              <div style={{position:"absolute",top:-10,right:16,background:T.accent,color:"#fff",fontSize:".65rem",fontWeight:700,padding:"3px 10px",borderRadius:100,letterSpacing:".06em"}}>15% RABATT</div>
              <div style={{fontWeight:700,fontSize:".95rem",color:T.dark}}>J\u00e4hrlich</div>
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
      {order?.status==="pending"&&(<div style={{background:"#fff",borderRadius:T.r,padding:"48px 36px",border:`1px solid ${T.bg3}`,boxShadow:T.sh2,marginBottom:28,textAlign:"center"}}>
        <div style={{width:56,height:56,borderRadius:"50%",border:`3px solid ${T.accent}`,borderTopColor:"transparent",animation:"spin 1s linear infinite",margin:"0 auto 24px"}}/>
        <h2 style={{fontSize:"1.2rem",fontWeight:800,color:T.dark,margin:"0 0 10px"}}>Ihre Website wird erstellt</h2>
        <p style={{fontSize:".88rem",color:T.textSub,lineHeight:1.65,margin:"0 0 28px"}}>Die KI generiert gerade Ihre individuelle Website. Das dauert ca. 30\u201360 Sekunden.</p>
        <button onClick={async()=>{
          const{data}=await supabase.from("orders").select("*").eq("email",session.user.email).order("created_at",{ascending:false}).limit(1);
          if(data&&data[0])setOrder(data[0]);
        }} style={{padding:"11px 24px",border:`2px solid ${T.bg3}`,borderRadius:T.rSm,background:"#fff",color:T.textSub,cursor:"pointer",fontSize:".85rem",fontWeight:600,fontFamily:T.font}}>Status aktualisieren</button>
      </div>)}

      {/* Tab Nav */}
      {order?.status!=="pending"&&<div className="pt-tab-nav" style={{display:"flex",gap:2,background:T.bg3,borderRadius:T.rSm,padding:3,marginBottom:28,width:"fit-content"}}>
        {TABS.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{padding:"9px 20px",border:"none",background:tab===t.id?T.white:"transparent",cursor:"pointer",borderRadius:8,fontFamily:T.font,fontWeight:tab===t.id?700:500,fontSize:".85rem",color:tab===t.id?T.dark:T.textMuted,boxShadow:tab===t.id?T.sh1:"none",transition:"all .2s"}}>{t.label}</button>)}
      </div>}

      {/* Globaler Website-Aktualisieren-Button */}
      {order?.status&&order.status!=="pending"&&(
        <div style={{background:"#fff",borderRadius:T.r,padding:"14px 20px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1,display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20,gap:12,flexWrap:"wrap"}}>
          <div>
            <div style={{fontWeight:700,fontSize:".85rem",color:T.dark}}>Website neu generieren</div>
            <div style={{fontSize:".75rem",color:T.textMuted,marginTop:2}}>Fuer Aenderungen an Texten, Design oder Leistungen. Fotos erscheinen automatisch.</div>
          </div>
          {order.status==="trial"
            ?<div style={{display:"flex",alignItems:"center",gap:8,fontSize:".82rem",color:"#8b5cf6",fontWeight:600,flexShrink:0}}>
              <span>&#128274;</span> Neu-Generierung ab aktivem Abo
              <button onClick={()=>setShowPlanModal(true)} style={{padding:"6px 14px",border:"none",borderRadius:T.rSm,background:T.accent,color:"#fff",cursor:"pointer",fontSize:".78rem",fontWeight:700,fontFamily:T.font}}>Abonnieren</button>
            </div>
            :<button onClick={async()=>{
              if(!supabase||!session)return;
              const{data:{session:s}}=await supabase.auth.getSession();
              const token=s?.access_token;
              await fetch("/api/start-build",{method:"POST",headers:{"Content-Type":"application/json","Authorization":`Bearer ${token}`},body:JSON.stringify({})});
              setOrder(o=>({...o,status:"pending",regen_requested:false}));
            }} style={{padding:"10px 20px",border:"none",borderRadius:T.rSm,background:T.dark,color:"#fff",cursor:"pointer",fontSize:".85rem",fontWeight:700,fontFamily:T.font,flexShrink:0}}>{"Website aktualisieren \u2192"}</button>
          }
        </div>
      )}

      {/* Tab: Website */}
      {tab==="website"&&(!order?<div style={{background:"#fff",borderRadius:T.r,padding:"28px 32px",border:`1px solid ${T.bg3}`,color:T.textMuted,fontSize:".9rem"}}>Bestellung wird geladen...</div>:<div style={{display:"flex",flexDirection:"column",gap:16}}>
        {/* Website URL Card */}
        {order.website_html&&order.subdomain&&<div style={{background:"linear-gradient(135deg,#f0f9ff,#e0f2fe)",borderRadius:T.r,padding:"18px 24px",border:"1px solid #bae6fd",boxShadow:T.sh1,display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:".65rem",fontWeight:700,color:"#0369a1",textTransform:"uppercase",letterSpacing:".1em",marginBottom:3}}>Ihre Website ist online</div>
            <div style={{fontSize:".88rem",fontFamily:T.mono,color:T.dark,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{sub}.siteready.at</div>
          </div>
          <div style={{display:"flex",gap:8,flexShrink:0}}>
            <button onClick={()=>{navigator.clipboard.writeText(`https://${sub}.siteready.at`);showToast("URL kopiert!");}} style={{padding:"8px 14px",border:"2px solid #bae6fd",borderRadius:T.rSm,background:"#fff",color:"#0369a1",cursor:"pointer",fontSize:".78rem",fontWeight:700,fontFamily:T.font}}>Kopieren</button>
            <a href={`https://sitereadyprototype.pages.dev/s/${order.subdomain}`} target="_blank" rel="noopener noreferrer" style={{padding:"8px 16px",border:"none",borderRadius:T.rSm,background:"#0ea5e9",color:"#fff",fontSize:".78rem",fontWeight:700,fontFamily:T.font,textDecoration:"none",display:"inline-flex",alignItems:"center",gap:4}}>{"Website \u00f6ffnen \u2192"}</a>
          </div>
        </div>}
        {/* Onboarding-Checkliste */}
        {(()=>{const checks=[{label:"Website erstellt",done:!!order.website_html},{label:"Logo hochgeladen",done:!!assetUrls.logo,tab:"medien"},{label:"Kontakt vollst\u00e4ndig",done:!!(order.telefon&&order.adresse),tab:"website"},{label:"Foto hochgeladen",done:!!(assetUrls.foto1||assetUrls.foto2||assetUrls.foto3),tab:"medien"}];const done=checks.filter(c=>c.done).length;if(done===checks.length)return null;return(<div style={{background:"#fff",borderRadius:T.r,padding:"18px 24px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1}}><div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}><div style={{fontSize:".72rem",fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:".1em"}}>Erste Schritte</div><div style={{fontSize:".72rem",color:T.textSub,fontWeight:600}}>{done}/{checks.length}</div></div><div style={{display:"flex",flexDirection:"column",gap:6}}>{checks.map((c,i)=><div key={i} onClick={c.tab&&!c.done?()=>setTab(c.tab):undefined} style={{display:"flex",alignItems:"center",gap:10,padding:"5px 0",cursor:c.tab&&!c.done?"pointer":"default"}}><div style={{width:18,height:18,borderRadius:"50%",background:c.done?"#16a34a":"#e2e8f0",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:".65rem",fontWeight:800,flexShrink:0}}>{c.done?"\u2713":""}</div><span style={{fontSize:".84rem",color:c.done?T.textMuted:T.dark,flex:1}}>{c.label}</span>{c.tab&&!c.done&&<span style={{fontSize:".72rem",color:T.accent,fontWeight:700}}>\u2192</span>}</div>)}</div></div>);})()}
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
          <SectionHeader id="firmenbuch" label="Unternehmen & Impressum" badge="instant"/>
          {editSection==="firmenbuch"?(<>
            <Dropdown label="Unternehmensform" value={order.unternehmensform||""} onChange={upOrder("unternehmensform")} options={UNTERNEHMENSFORMEN} placeholder="Unternehmensform wählen"/>
            <div className="pt-field-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <Field label="UID-Nummer / ATU" value={order.uid_nummer||""} onChange={upOrder("uid_nummer")} placeholder="ATU12345678" hint="Optional"/>
              <Field label="Firmenbuchnummer" value={order.firmenbuchnummer||""} onChange={upOrder("firmenbuchnummer")} placeholder="FN 123456 a" hint="Optional"/>
            </div>
            <div className="pt-field-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <Field label="Firmenbuchgericht" value={order.firmenbuchgericht||""} onChange={upOrder("firmenbuchgericht")} placeholder="z.B. HG Wien" hint="Optional"/>
              <Field label="GISA-Zahl" value={order.gisazahl||""} onChange={upOrder("gisazahl")} placeholder="z.B. 12345678" hint="Optional"/>
            </div>
          </>):(<>
            <InfoRow label="Unternehmensform" value={UNTERNEHMENSFORMEN.find(u=>u.value===order.unternehmensform)?.label||order.unternehmensform}/>
            <InfoRow label="UID-Nummer" value={order.uid_nummer}/>
            <InfoRow label="Firmenbuchnummer" value={order.firmenbuchnummer}/>
            <InfoRow label="Firmenbuchgericht" value={order.firmenbuchgericht}/>
            <InfoRow label="GISA-Zahl" value={order.gisazahl}/>
          </>)}
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
        {/* Leistungen & Texte */}
        <div style={{background:"#fff",borderRadius:T.r,padding:"24px 28px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1}}>
          <SectionHeader id="leistungen" label="Leistungen & Texte" badge="instant"/>
          {editSection==="leistungen"?(<>
            {(()=>{const bl=BRANCHEN.find(b=>b.value===order.branche);return bl
              ?<Checklist label={bl.label} options={bl.leistungen} selected={order.leistungen||[]} onChange={upOrder("leistungen")} hint="Aktive Leistungen"/>
              :<Field label="Leistungen (eine pro Zeile)" value={(order.leistungen||[]).join("\n")} onChange={v=>upOrder("leistungen")(v.split("\n").filter(l=>l.trim()))} rows={4}/>;})()}
            {(order.leistungen||[]).length>1&&<div style={{marginBottom:20}}><label style={{display:"block",marginBottom:8,fontSize:".78rem",fontWeight:700,color:T.textSub,letterSpacing:".03em"}}>Reihenfolge</label>{(order.leistungen||[]).map((l,i)=><div key={l} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",borderBottom:`1px solid ${T.bg3}`}}><span style={{flex:1,fontSize:".84rem",color:T.dark}}>{l}</span><button onClick={()=>{if(i>0){const a=[...order.leistungen];[a[i-1],a[i]]=[a[i],a[i-1]];upOrder("leistungen")(a);}}} disabled={i===0} style={{width:26,height:26,border:`1px solid ${T.bg3}`,borderRadius:4,background:"#fff",cursor:i===0?"default":"pointer",color:i===0?T.bg3:T.textSub,fontFamily:T.font}}>&#9650;</button><button onClick={()=>{if(i<(order.leistungen||[]).length-1){const a=[...order.leistungen];[a[i],a[i+1]]=[a[i+1],a[i]];upOrder("leistungen")(a);}}} disabled={i===(order.leistungen||[]).length-1} style={{width:26,height:26,border:`1px solid ${T.bg3}`,borderRadius:4,background:"#fff",cursor:i===(order.leistungen||[]).length-1?"default":"pointer",color:i===(order.leistungen||[]).length-1?T.bg3:T.textSub,fontFamily:T.font}}>&#9660;</button></div>)}</div>}
            <Field label="Zus\u00e4tzliche Leistung" value={order.extra_leistung||""} onChange={upOrder("extra_leistung")} placeholder="z.B. Beratung..."/>
            {BRANCHEN.find(b=>b.value===order?.branche)?.gruppe==="handwerk"&&<><Toggle label="24h Notdienst" checked={!!order.notdienst} onChange={upOrder("notdienst")} desc="Wird prominent angezeigt"/><Toggle label="Meisterbetrieb" checked={!!order.meisterbetrieb} onChange={upOrder("meisterbetrieb")} desc="Meisterbetrieb-Badge"/><Toggle label="Kostenloser Kostenvoranschlag" checked={!!order.kostenvoranschlag} onChange={upOrder("kostenvoranschlag")} desc="Vertrauens-Badge"/></>}
            {BRANCHEN.find(b=>b.value===order?.branche)?.gruppe==="kosmetik"&&<><Field label="Online-Buchungslink" value={order.buchungslink||""} onChange={upOrder("buchungslink")} placeholder="https://booksy.com/..." hint="Optional"/><Toggle label="Hausbesuche" checked={!!order.hausbesuche} onChange={upOrder("hausbesuche")} desc="Ich komme auch zu Ihnen"/><Toggle label="Nur nach Terminvereinbarung" checked={!!order.terminvereinbarung} onChange={upOrder("terminvereinbarung")} desc="Kein Walk-in"/></>}
            {order.text_ueber_uns!=null&&<><div style={{margin:"20px 0 16px",paddingTop:20,borderTop:`1px solid ${T.bg3}`}}><div style={{fontSize:".72rem",fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:".1em",marginBottom:12}}>KI-Texte bearbeiten</div></div><Field label="\u00dcber uns \u2013 Text" value={order.text_ueber_uns||""} onChange={upOrder("text_ueber_uns")} rows={3} hint="Kurze Beschreibung im \u00dcber-uns Abschnitt"/><div style={{marginBottom:8,fontSize:".78rem",fontWeight:700,color:T.textSub,letterSpacing:".03em"}}>Vorteile</div>{(order.text_vorteile||["","","",""]).map((v,i)=>(<Field key={i} label={`Vorteil ${i+1}`} value={v||""} onChange={val=>{const a=[...(order.text_vorteile||["","","",""])];a[i]=val;upOrder("text_vorteile")(a);}}/>))}{(()=>{const ls=[...(order.leistungen||[]),...(order.extra_leistung?.split(/[,\n]+/).map(s=>s.trim()).filter(Boolean)||[])];return ls.length>0?(<><div style={{marginBottom:8,fontSize:".78rem",fontWeight:700,color:T.textSub,letterSpacing:".03em"}}>Leistungs-Beschreibungen</div>{ls.map(l=><Field key={l} label={l} value={(order.leistungen_beschreibungen||{})[l]||""} onChange={val=>{const m={...(order.leistungen_beschreibungen||{})};m[l]=val;upOrder("leistungen_beschreibungen")(m);}} rows={2} hint="1 Satz"/>)}</>):null;})()}</>}
          </>):(<>
            {(order.leistungen||[]).map((l,i)=><InfoRow key={i} label={i===0?"Leistungen":""} value={l}/>)}
            {order.extra_leistung&&<InfoRow label="Zusatz" value={order.extra_leistung}/>}
            {BRANCHEN.find(b=>b.value===order?.branche)?.gruppe==="handwerk"&&<><InfoRow label="24h Notdienst" value={order.notdienst?"Ja":"Nein"}/><InfoRow label="Meisterbetrieb" value={order.meisterbetrieb?"Ja":"Nein"}/><InfoRow label="Kostenloser KV" value={order.kostenvoranschlag?"Ja":"Nein"}/></>}
            {BRANCHEN.find(b=>b.value===order?.branche)?.gruppe==="kosmetik"&&<><InfoRow label="Buchungslink" value={order.buchungslink||"\u2014"}/><InfoRow label="Hausbesuche" value={order.hausbesuche?"Ja":"Nein"}/><InfoRow label="Nur mit Termin" value={order.terminvereinbarung?"Ja":"Nein"}/></>}
            {order.text_ueber_uns!=null&&<InfoRow label="KI-Texte" value={`\u00dcber-uns + ${Array.isArray(order.text_vorteile)?order.text_vorteile.filter(Boolean).length:0} Vorteile + ${Object.keys(order.leistungen_beschreibungen||{}).length} Beschreibungen`}/>}
          </>)}
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

        {/* Neugenierung-Hinweis */}
        {order.regen_requested&&<div style={{padding:"14px 18px",background:"#fef3c7",borderRadius:T.r,border:"1px solid #fcd34d",display:"flex",alignItems:"flex-start",gap:12}}>
          <span style={{fontSize:"1.2rem",flexShrink:0}}>{"\u21BB"}</span>
          <div>
            <div style={{fontWeight:700,color:"#92400e",fontSize:".88rem",marginBottom:3}}>Aenderungsanfrage gesendet</div>
            <div style={{fontSize:".82rem",color:"#78350f",lineHeight:1.5}}>Ihr Änderungswunsch wurde erfasst. Wir generieren Ihre Website innerhalb von 24h neu und schalten sie danach live.</div>
          </div>
        </div>}
      </div>)}

      {/* Tab: Rechnungen */}
      {tab==="rechnungen"&&(<div style={{background:"#fff",borderRadius:T.r,padding:"28px 32px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1}}>
        <div style={{fontSize:".72rem",fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:".1em",marginBottom:20}}>Ihre Rechnungen</div>
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
                <div style={{fontSize:".75rem",color:T.textMuted,marginTop:2}}>{date}</div>
              </div>
              <div style={{fontWeight:700,fontFamily:T.mono,fontSize:".95rem",color:T.dark}}>{"\u20AC"}{amount}</div>
              <div style={{padding:"4px 10px",borderRadius:4,background:`${statusColor}18`,color:statusColor,fontSize:".72rem",fontWeight:700}}>{statusLabel}</div>
              {c.receipt_url&&<a href={c.receipt_url} target="_blank" rel="noreferrer" style={{padding:"6px 14px",border:`2px solid ${T.bg3}`,borderRadius:T.rSm,color:T.textSub,fontSize:".78rem",fontWeight:600,textDecoration:"none",background:"#fff"}}>Beleg</a>}
            </div>);
          })}
        </div>)}
      </div>)}

      {/* Tab: Support */}
      {tab==="support"&&(<div style={{display:"flex",flexDirection:"column",gap:16}}>
        <div style={{background:T.accentLight,borderRadius:T.r,padding:"24px 28px",border:`1px solid rgba(37,99,235,.12)`,display:"flex",gap:32,flexWrap:"wrap"}}>
          <div>
            <div style={{fontSize:".72rem",fontWeight:700,color:T.accent,textTransform:"uppercase",letterSpacing:".1em",marginBottom:6}}>E-Mail Support</div>
            <a href="mailto:support@siteready.at" style={{fontSize:".95rem",fontWeight:700,color:T.dark,textDecoration:"none"}}>support@siteready.at</a>
            <div style={{fontSize:".78rem",color:T.textSub,marginTop:3}}>Antwort innerhalb von 48 Stunden</div>
          </div>
          <div>
            <div style={{fontSize:".72rem",fontWeight:700,color:T.accent,textTransform:"uppercase",letterSpacing:".1em",marginBottom:6}}>Geschäftszeiten</div>
            <div style={{fontSize:".88rem",fontWeight:600,color:T.dark}}>Mo – Fr, 09:00 – 17:00</div>
            <div style={{fontSize:".78rem",color:T.textSub,marginTop:3}}>Österreichische Feiertage ausgenommen</div>
          </div>
        </div>
        <div style={{background:"#fff",borderRadius:T.r,padding:"24px 28px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1}}>
          <div style={{fontSize:".72rem",fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:".1em",marginBottom:16}}>Nachricht senden</div>
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
            }} disabled={supportSending||!supportMsg.trim()} style={{padding:"12px 24px",border:"none",borderRadius:T.rSm,background:(supportSending||!supportMsg.trim())?"#94a3b8":T.dark,color:"#fff",fontSize:".88rem",fontWeight:700,fontFamily:T.font,cursor:(supportSending||!supportMsg.trim())?"not-allowed":"pointer"}}>
              {supportSending?"Wird gesendet...":"Nachricht senden \u2192"}
            </button>
          </>)}
        </div>
        <div style={{background:"#fff",borderRadius:T.r,padding:"24px 28px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1}}>
          <div style={{fontSize:".72rem",fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:".1em",marginBottom:16}}>{"H\u00e4ufige Fragen"}</div>
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
          <div style={{fontSize:".72rem",fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:".1em",marginBottom:16}}>Account-Daten</div>
          <InfoRow label="E-Mail-Adresse" value={session?.user?.email}/>
          <InfoRow label="Mitglied seit" value={session?.user?.created_at?new Date(session.user.created_at).toLocaleDateString("de-AT",{day:"2-digit",month:"2-digit",year:"numeric"}):""}/>
          <InfoRow label="Abonnement" value={`SiteReady Standard \u2013 ${order?.subscription_plan==="yearly"?"\u20AC183.60 / Jahr":"\u20AC18 / Monat"}`}/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          <div style={{background:"#fff",borderRadius:T.r,padding:"24px 28px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1}}>
            <div style={{fontSize:".72rem",fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:".1em",marginBottom:16}}>{"Passwort \u00e4ndern"}</div>
            <Field label="Neues Passwort" value={newPw} onChange={setNewPw} placeholder="Mindestens 6 Zeichen" type="password"/>
            <Field label="Passwort best\u00e4tigen" value={newPw2} onChange={setNewPw2} placeholder="Passwort wiederholen" type="password"/>
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
              }} disabled={pwSaving} style={{padding:"12px 24px",border:"none",borderRadius:T.rSm,background:pwSaving?"#94a3b8":T.dark,color:"#fff",fontSize:".88rem",fontWeight:700,fontFamily:T.font,cursor:pwSaving?"wait":"pointer"}}>
                {pwSaving?"...":"Passwort speichern"}
              </button>
              {pwSaved&&<span style={{color:T.green,fontWeight:600,fontSize:".85rem"}}>{"\u2713"} Gespeichert</span>}
            </div>
          </div>
          <div style={{background:"#fff",borderRadius:T.r,padding:"24px 28px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1}}>
            <div style={{fontSize:".72rem",fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:".1em",marginBottom:16}}>{"E-Mail-Adresse \u00e4ndern"}</div>
            {emailSent
              ?<div style={{display:"flex",flexDirection:"column",gap:12}}>
                <div style={{padding:"14px 18px",background:T.greenLight,borderRadius:T.rSm,border:"1px solid rgba(22,163,74,.2)",color:T.green,fontWeight:700,fontSize:".88rem"}}>{"\u2713"} Best\u00e4tigungslink gesendet</div>
                <p style={{color:T.textSub,fontSize:".84rem",margin:0,lineHeight:1.6}}>Bitte pr\u00fcfen Sie Ihren Posteingang und klicken Sie auf den Best\u00e4tigungslink um die neue E-Mail-Adresse zu aktivieren.</p>
                <button onClick={()=>setEmailSent(false)} style={{padding:"8px 16px",border:`2px solid ${T.bg3}`,borderRadius:T.rSm,background:"#fff",color:T.textSub,cursor:"pointer",fontSize:".82rem",fontWeight:600,fontFamily:T.font,alignSelf:"flex-start"}}>Neue Anfrage</button>
              </div>
              :<>
                <Field label="Neue E-Mail-Adresse" value={newEmail} onChange={setNewEmail} placeholder="neue@email.at" type="email"/>
                {emailErr&&<div style={{marginBottom:12,padding:"10px 14px",background:"#fef2f2",borderRadius:T.rSm,fontSize:".78rem",color:"#dc2626"}}>{emailErr}</div>}
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <button onClick={async()=>{
                    if(!newEmail||!newEmail.includes("@")){setEmailErr("Bitte g\u00fcltige E-Mail eingeben.");return;}
                    setEmailSaving(true);setEmailErr("");
                    const{error}=await supabase.auth.updateUser({email:newEmail});
                    setEmailSaving(false);
                    if(error)setEmailErr(error.message);
                    else{setEmailSent(true);setNewEmail("");}
                  }} disabled={emailSaving} style={{padding:"12px 24px",border:"none",borderRadius:T.rSm,background:emailSaving?"#94a3b8":T.dark,color:"#fff",fontSize:".88rem",fontWeight:700,fontFamily:T.font,cursor:emailSaving?"wait":"pointer"}}>
                    {emailSaving?"...":"Best\u00e4tigungslink senden"}
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

      {/* Tab: Analytics */}
      {tab==="analytics"&&(<div style={{display:"flex",flexDirection:"column",gap:16}}>
        {/* Website Status */}
        <div style={{background:"#fff",borderRadius:T.r,padding:"24px 28px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1}}>
          <div style={{fontSize:".72rem",fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:".1em",marginBottom:16}}>Website Status</div>
          {order?(<>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:18}}>
              <div style={{width:12,height:12,borderRadius:"50%",background:order.status==="live"?T.green:"#f59e0b",boxShadow:`0 0 0 4px ${order.status==="live"?"rgba(22,163,74,.15)":"rgba(245,158,11,.15)"}`}}/>
              <span style={{fontWeight:700,fontSize:".95rem",color:order.status==="live"?T.green:"#f59e0b"}}>{order.status==="live"?"Live \u2013 Ihre Website ist erreichbar":"In Bearbeitung"}</span>
            </div>
            {[{l:"Website-URL",v:`https://sitereadyprototype.pages.dev/s/${sub}`,link:true},{l:"SSL-Zertifikat",v:"Aktiv \u2713"},{l:"Status",v:STATUS_LABELS[order.status]||order.status},{l:"Bestellt am",v:order.created_at?new Date(order.created_at).toLocaleDateString("de-AT",{day:"2-digit",month:"long",year:"numeric"}):""}].map(({l,v,link})=>(
              <div key={l} className="pt-info-row" style={{display:"grid",gridTemplateColumns:"160px 1fr",padding:"9px 0",borderBottom:`1px solid ${T.bg3}`}}>
                <span style={{fontSize:".78rem",color:T.textMuted,fontWeight:600}}>{l}</span>
                {link?<a href={v} target="_blank" rel="noreferrer" style={{fontSize:".88rem",color:T.accent,textDecoration:"none"}}>{v}</a>:<span style={{fontSize:".88rem",color:T.dark}}>{v}</span>}
              </div>))}
          </>):<div style={{color:T.textMuted,fontSize:".88rem"}}>Bestellung wird geladen...</div>}
        </div>
        {/* Abo */}
        <div style={{background:"#fff",borderRadius:T.r,padding:"24px 28px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1}}>
          <div style={{fontSize:".72rem",fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:".1em",marginBottom:16}}>Abonnement</div>
          {[{l:"Paket",v:"SiteReady Standard"},{l:"Preis",v:order?.subscription_plan==="yearly"?"\u20AC183.60 / Jahr (\u20AC15.30/Monat)":"\u20AC18 / Monat"},{l:"Laufzeit",v:order?.subscription_plan==="yearly"?"12 Monate, dann monatlich":"Monatlich kuendbar"},...(order?.created_at?[{l:"Gestartet am",v:new Date(order.created_at).toLocaleDateString("de-AT",{day:"2-digit",month:"long",year:"numeric"})}]:[]),...(order?.created_at&&order?.subscription_plan==="yearly"?[{l:"Mindestende",v:new Date(new Date(order.created_at).setFullYear(new Date(order.created_at).getFullYear()+1)).toLocaleDateString("de-AT",{day:"2-digit",month:"long",year:"numeric"})}]:[])].map(({l,v})=>(
            <div key={l} className="pt-info-row" style={{display:"grid",gridTemplateColumns:"160px 1fr",padding:"9px 0",borderBottom:`1px solid ${T.bg3}`}}>
              <span style={{fontSize:".78rem",color:T.textMuted,fontWeight:600}}>{l}</span>
              <span style={{fontSize:".88rem",color:T.dark}}>{v}</span>
            </div>))}
        </div>
        {/* Seitenaufrufe Coming Soon */}
        <div style={{background:"#fff",borderRadius:T.r,padding:"24px 28px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
            <div style={{fontSize:".72rem",fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:".1em"}}>Seitenaufrufe & Reichweite</div>
            <span style={{fontSize:".65rem",fontWeight:700,background:"linear-gradient(135deg,#7c3aed,#a855f7)",color:"#fff",padding:"3px 10px",borderRadius:4,letterSpacing:".06em"}}>Coming Soon</span>
          </div>
          <div style={{padding:"32px 20px",textAlign:"center",background:T.bg,borderRadius:T.rSm,border:`1px dashed ${T.bg3}`}}>
            <div style={{fontSize:"2rem",marginBottom:10}}>📊</div>
            <div style={{fontSize:".9rem",fontWeight:700,color:T.dark,marginBottom:6}}>Analytics wird gerade vorbereitet</div>
            <div style={{fontSize:".82rem",color:T.textMuted,lineHeight:1.7,maxWidth:340,margin:"0 auto"}}>Seitenaufrufe, Besucher und Google-Klicks werden in einem zukünftigen Update freigeschaltet.</div>
          </div>
        </div>
      </div>)}

      {/* Tab: Medien */}
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
                  {busy?"L\u00e4dt...":url?"Ersetzen":"Hochladen"}
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
              <div style={{fontSize:"1.8rem",marginBottom:6}}>{"🏷️"}</div>
              <div style={{fontSize:".78rem",color:T.textMuted}}>Noch kein Logo hochgeladen</div>
            </div>)}
            <div style={{fontSize:".73rem",color:T.textMuted,marginTop:4}}>
              {"Empfohlen: PNG mit transparentem Hintergrund, mind. 400 \u00d7 150 px – damit das Logo auf dem dunklen Nav-Hintergrund sauber aussieht."}
            </div>
          </div>
        );})()}
        {/* Hero-Bild */}
        {(()=>{const url=assetUrls["hero"];const busy=uploading["hero"];return(
          <div style={{background:"#fff",borderRadius:T.r,padding:"20px 24px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:url?16:0}}>
              <div>
                <div style={{fontWeight:700,fontSize:".9rem",color:T.dark,marginBottom:2}}>Hero-Bild <span style={{fontSize:".72rem",fontWeight:500,color:T.textMuted}}>(optional)</span></div>
                <div style={{fontSize:".78rem",color:T.textMuted}}>Hintergrundbild fuer den oberen Bereich der Website</div>
              </div>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <label style={{padding:"9px 18px",border:`2px solid ${T.bg3}`,borderRadius:T.rSm,background:busy?T.bg:"#fff",color:T.textSub,cursor:busy?"wait":"pointer",fontSize:".82rem",fontWeight:600,fontFamily:T.font,whiteSpace:"nowrap"}}>
                  {busy?"L\u00e4dt...":url?"Ersetzen":"Hochladen"}
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
              <div style={{fontSize:"1.6rem",marginBottom:4}}>{"🌄"}</div>
              <div style={{fontSize:".78rem",color:T.textMuted}}>Noch kein Hero-Bild hochgeladen – Farbverlauf bleibt aktiv</div>
            </div>}
            <div style={{fontSize:".73rem",color:T.textMuted,marginTop:8}}>Empfohlen: JPG, mind. 1920 &times; 1080 px. Das Bild wird mit einem dunklen Overlay versehen sodass der Text gut lesbar bleibt.</div>
          </div>
        );})()}
        {/* Fotos */}
        <div style={{background:"#fff",borderRadius:T.r,padding:"20px 24px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1}}>
          <div style={{fontSize:".72rem",fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:".1em",marginBottom:4}}>Ihre Fotos</div>
          <div style={{fontSize:".82rem",color:T.textSub,marginBottom:16}}>Laden Sie bis zu 5 Fotos hoch – Betriebsfotos, Team, Arbeitsproben, Atmosphäre. Sie entscheiden was passt.</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10}}>
            {ASSETS.slice(1).map(a=>{const url=assetUrls[a.key];const busy=uploading[a.key];return(
              <div key={a.key} style={{display:"flex",flexDirection:"column",gap:6}}>
                <div style={{aspectRatio:"1",borderRadius:T.rSm,background:url?"#000":T.bg,border:`1.5px dashed ${url?"transparent":T.bg3}`,overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
                  {url?<img src={url} alt={a.label} style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<span style={{fontSize:"1.6rem"}}>📷</span>}
                </div>
                <div style={{display:"flex",gap:4}}>
                  <label style={{flex:1,display:"block",textAlign:"center",padding:"7px 0",border:`1.5px solid ${T.bg3}`,borderRadius:T.rSm,background:busy?T.bg:"#fff",color:T.textSub,cursor:busy?"wait":"pointer",fontSize:".72rem",fontWeight:600,fontFamily:T.font}}>
                    {busy?"L\u00e4dt...":url?"Ersetzen":"Hochladen"}
                    <input type="file" accept="image/*" style={{display:"none"}} disabled={busy} onChange={e=>{if(e.target.files[0])upload(a.key,e.target.files[0]);}}/>
                  </label>
                  {url&&<button onClick={()=>deleteAsset(a.key)} disabled={deleting[a.key]} style={{padding:"7px 8px",border:`1.5px solid #fca5a5`,borderRadius:T.rSm,background:"#fff",color:"#ef4444",cursor:deleting[a.key]?"wait":"pointer",fontSize:".72rem",fontWeight:700,fontFamily:T.font}}>{deleting[a.key]?"...":"\u00d7"}</button>}
                </div>
              </div>
            );})}
          </div>
        </div>
        <div style={{padding:"14px 16px",background:T.accentLight,borderRadius:T.rSm,border:`1px solid rgba(37,99,235,.12)`,fontSize:".78rem",color:T.textSub}}>
          Empfohlen: JPG oder PNG, mindestens 1200px breit, max. 5 MB pro Foto.
        </div>
      </div>)}

      {/* Tab: Domain */}
      {tab==="seo"&&order?.status==="trial"&&(<div style={{background:"#fff",borderRadius:T.r,padding:"40px 32px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1,textAlign:"center"}}>
        <div style={{fontSize:"2rem",marginBottom:16}}>&#128274;</div>
        <h2 style={{fontSize:"1.1rem",fontWeight:800,color:T.dark,margin:"0 0 8px"}}>SEO & Google ab aktivem Abo</h2>
        <p style={{fontSize:".88rem",color:T.textSub,lineHeight:1.65,marginBottom:20,maxWidth:340,margin:"0 auto 20px"}}>Google-Indexierung und SEO-Einstellungen sind nach dem Abo-Abschluss aktiv.</p>
        <button onClick={()=>setShowPlanModal(true)} style={{padding:"11px 24px",border:"none",borderRadius:T.rSm,background:T.accent,color:"#fff",cursor:"pointer",fontSize:".88rem",fontWeight:700,fontFamily:T.font}}>{"Jetzt abonnieren \u2192"}</button>
      </div>)}
      {tab==="seo"&&order?.status!=="trial"&&(<div style={{display:"flex",flexDirection:"column",gap:16}}>
        <div style={{background:"#fff",borderRadius:T.r,padding:"24px 28px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1}}>
          <div style={{fontSize:".72rem",fontWeight:700,color:T.accent,textTransform:"uppercase",letterSpacing:".12em",marginBottom:12}}>Google Indexierung</div>
          {order?.status==="live"
            ?<div style={{display:"flex",alignItems:"center",gap:12,padding:"14px 18px",background:T.greenLight,borderRadius:T.rSm,border:`1px solid rgba(22,163,74,.2)`}}>
              <span style={{fontSize:"1.4rem"}}>✓</span>
              <div><div style={{fontWeight:700,color:T.green,fontSize:".9rem"}}>Ihre Website ist für Google sichtbar</div><div style={{fontSize:".82rem",color:T.textSub,marginTop:3}}>Google kann Ihre Website unter <strong>{sub}.siteready.at</strong> indexieren und in den Suchergebnissen anzeigen.</div></div>
            </div>
            :<div style={{display:"flex",alignItems:"center",gap:12,padding:"14px 18px",background:"#fef3c7",borderRadius:T.rSm,border:"1px solid #fcd34d"}}>
              <span style={{fontSize:"1.4rem"}}>⏳</span>
              <div><div style={{fontWeight:700,color:"#92400e",fontSize:".9rem"}}>Indexierung aktiv nach Livegang</div><div style={{fontSize:".82rem",color:"#78350f",marginTop:3}}>Sobald Ihre Website live geschaltet wird, entfernen wir die noindex-Markierung und Google kann Ihre Website finden.</div></div>
            </div>
          }
        </div>
        <div style={{background:"#fff",borderRadius:T.r,padding:"24px 28px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1}}>
          <div style={{fontSize:".78rem",fontWeight:700,color:T.dark,marginBottom:8}}>Custom Domain & Google</div>
          <p style={{fontSize:".82rem",color:T.textSub,lineHeight:1.7,margin:0}}>Wenn Sie eine eigene Domain verbinden, kümmern wir uns auch um die Google-Indexierung für Ihre Domain. Schreiben Sie uns nach der DNS-Umstellung an <strong>support@siteready.at</strong>.</p>
        </div>
      </div>)}
      {tab==="domain"&&order?.status==="trial"&&(<div style={{background:"#fff",borderRadius:T.r,padding:"40px 32px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1,textAlign:"center"}}>
        <div style={{fontSize:"2rem",marginBottom:16}}>🔒</div>
        <h2 style={{fontSize:"1.1rem",fontWeight:800,color:T.dark,margin:"0 0 8px"}}>Custom Domain ab aktivem Abo</h2>
        <p style={{fontSize:".88rem",color:T.textSub,lineHeight:1.65,marginBottom:20,maxWidth:340,margin:"0 auto 20px"}}>Verbinden Sie Ihre eigene Domain nachdem Sie ein Abo abgeschlossen haben.</p>
        <button onClick={()=>setShowPlanModal(true)} style={{padding:"11px 24px",border:"none",borderRadius:T.rSm,background:T.accent,color:"#fff",cursor:"pointer",fontSize:".88rem",fontWeight:700,fontFamily:T.font}}>Jetzt abonnieren \u2192</button>
      </div>)}
      {tab==="domain"&&order?.status!=="trial"&&(<div style={{background:"#fff",borderRadius:T.r,padding:"28px 32px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1}}>
        <div style={{fontSize:".72rem",fontWeight:700,color:T.accent,textTransform:"uppercase",letterSpacing:".12em",marginBottom:10}}>Custom Domain verbinden</div>
        <h2 style={{fontSize:"1.2rem",fontWeight:800,color:T.dark,margin:"0 0 8px"}}>Eigene Domain statt Subdomain</h2>
        <p style={{fontSize:".88rem",color:T.textSub,lineHeight:1.7,marginBottom:24}}>
          Aktuell ist Ihre Website unter <strong>{sub}.siteready.at</strong> erreichbar. Mit einer eigenen Domain (z.B. <strong>www.{sub}.at</strong>) erscheint Ihre Website noch professioneller.
        </p>
        <div style={{marginBottom:24}}>
          <div style={{fontSize:".82rem",fontWeight:700,color:T.dark,marginBottom:10}}>DNS-Einträge bei Ihrem Domain-Anbieter setzen:</div>
          <div style={{borderRadius:T.rSm,overflow:"hidden",border:`1px solid ${T.bg3}`}}>
            <div style={{display:"grid",gridTemplateColumns:"80px 100px 1fr",background:T.bg,padding:"10px 16px",fontSize:".72rem",fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:".08em",gap:16}}>
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
        <div style={{padding:"16px 20px",background:T.accentLight,borderRadius:T.rSm,border:`1px solid rgba(37,99,235,.12)`}}>
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

/* ═══ ADMIN DASHBOARD ═══ */
const STATUS_LABELS={pending:"Wird erstellt",trial:"Testphase",live:"Live",offline:"Offline"};
const STATUS_COLORS={pending:"#f59e0b",trial:"#8b5cf6",live:"#16a34a",offline:"#64748b"};
const STATUS_FLOW=["pending","trial","live"];

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
  const[loading,setLoading]=useState(true);
  const[sysStatus,setSysStatus]=useState(null);
  const[sysLoading,setSysLoading]=useState(false);
  const[notiz,setNotiz]=useState({});
  const[notizSaved,setNotizSaved]=useState({});
  const[genLoading,setGenLoading]=useState({});
  const[genMsg,setGenMsg]=useState({});
  const[view,setView]=useState("tabelle");
  const[search,setSearch]=useState("");
  const[healthTime,setHealthTime]=useState({});
  const[healthFilter,setHealthFilter]=useState("alle");
  const[deleteConfirm,setDeleteConfirm]=useState(null);
  const[regenConfirm,setRegenConfirm]=useState(null);
  const[showProzess,setShowProzess]=useState(false);
  const[editKunde,setEditKunde]=useState(null);
  const[docs,setDocs]=useState([]);
  const[docsLoading,setDocsLoading]=useState(false);
  const[selDocId,setSelDocId]=useState(null);
  const[docEditing,setDocEditing]=useState(false);
  const[docEditTitle,setDocEditTitle]=useState("");
  const[docEditContent,setDocEditContent]=useState("");
  const[docSaving,setDocSaving]=useState(false);

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

  const updateTicket=async(id,fields)=>{
    await fetch(`/api/admin-update?key=${adminKey}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id,table:"support_requests",...fields})});
    setTickets(ts=>ts.map(t=>t.id===id?{...t,...fields}:t));
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
        setGenMsg(m=>({...m,[id]:"Website erstellt! Status: live"}));
        await load();
        setSel(s=>s?.id===id?{...s,status:"live",subdomain:j.subdomain}:s);
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

  const checkHealth=async(order)=>{
    const url=`https://sitereadyprototype.pages.dev/s/${order.subdomain||"test"}`;
    setHealth(h=>({...h,[order.id]:"checking"}));
    try{await fetch(url,{mode:"no-cors",signal:AbortSignal.timeout(5000)});setHealth(h=>({...h,[order.id]:"ok"}));}
    catch(e){setHealth(h=>({...h,[order.id]:"error"}));}
    setHealthTime(t=>({...t,[order.id]:new Date()}));
  };

  const filtered=orders.filter(o=>filter==="alle"||o.status===filter);
  const fmtDate=s=>s?new Date(s).toLocaleDateString("de-AT",{day:"2-digit",month:"2-digit",year:"numeric"}):"";
  const[sysLastCheck,setSysLastCheck]=useState(null);
  const checkSystem=async()=>{setSysLoading(true);const r=await fetch(`/api/admin-system?key=${adminKey}`);const j=await r.json();setSysStatus(j);setSysLastCheck(new Date());setSysLoading(false);};
  useEffect(()=>{if(tab==="system"){checkSystem();const iv=setInterval(checkSystem,60000);return()=>clearInterval(iv);}},[tab]);
  useEffect(()=>{if(tab==="health")orders.filter(o=>o.subdomain&&["live","offline"].includes(o.status)).forEach(o=>checkHealth(o));},[tab]);
  useEffect(()=>{if(tab==="docs")loadDocs();},[tab]);
  useEffect(()=>{setEditKunde(null);},[sel]);

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
  const stuckOrders=orders.filter(o=>o.status==="pending"&&Date.now()-new Date(o.created_at).getTime()>2*60*60*1000);
  const regenBadge=stuckOrders.length||null;
  const alerts=[];
  if(sysStatus?.anthropic?.billing)alerts.push({type:"error",msg:"Claude Guthaben aufgebraucht \u2013 keine Generierung möglich!",tab:"system"});
  else if(sysStatus?.anthropic&&!sysStatus.anthropic.ok)alerts.push({type:"warn",msg:"Anthropic API nicht erreichbar"+(sysStatus.anthropic.error?" \u2013 "+sysStatus.anthropic.error:""),tab:"system"});
  if(stuckOrders.length)alerts.push({type:"warn",msg:`${stuckOrders.length} Bestellung${stuckOrders.length>1?"en":""} seit >2h in Generierung \u2013 bitte pruefen`,tab:"system"});
  const TABS=[
    {id:"start",label:"Start",section:"ADMIN"},
    {id:"bestellungen",label:"Bestellungen"},
    {id:"health",label:"Website Health"},
    {id:"support",label:"Support"},
    {id:"system",label:"System",badge:regenBadge},
    {id:"kosten",label:"Kosten"},
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
        <span style={{fontSize:".72rem",fontWeight:700,color:"#f59e0b",background:"rgba(245,158,11,.15)",padding:"3px 10px",borderRadius:4,letterSpacing:".08em"}}>ADMIN</span>
      </div>
      <button onClick={load} style={{padding:"6px 16px",border:"1px solid rgba(255,255,255,.15)",borderRadius:T.rSm,background:"transparent",color:"rgba(255,255,255,.6)",cursor:"pointer",fontSize:".78rem",fontWeight:600,fontFamily:T.font}}>Aktualisieren</button>
    </div>

    <div className="ad-wrap" style={{display:"flex",height:"calc(100vh - 56px)"}}>
      {/* Sidebar */}
      <div className="ad-sidebar" style={{width:200,background:"#fff",borderRight:`1px solid ${T.bg3}`,padding:"16px 0",flexShrink:0}}>
        {TABS.map(t=><div key={t.id}>
          {t.section&&<div style={{padding:"16px 20px 4px",fontSize:".6rem",fontWeight:800,color:T.textMuted,textTransform:"uppercase",letterSpacing:".12em"}}>{t.section}</div>}
          <button onClick={()=>setTab(t.id)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%",padding:"10px 20px",border:"none",background:tab===t.id?T.accentLight:"transparent",color:tab===t.id?T.accent:T.textSub,textAlign:"left",cursor:"pointer",fontSize:".85rem",fontWeight:tab===t.id?700:500,fontFamily:T.font,borderLeft:tab===t.id?`3px solid ${T.accent}`:"3px solid transparent"}}>
            <span>{t.label}</span>
            {t.badge&&<span style={{background:"#dc2626",color:"#fff",borderRadius:10,padding:"0 6px",fontSize:".65rem",fontWeight:700,lineHeight:"18px",minWidth:18,textAlign:"center"}}>{t.badge}</span>}
          </button>
        </div>)}
      </div>

      {/* Main */}
      <div className="ad-main" style={{flex:1,overflowY:"auto",padding:28,position:"relative"}}>
        {loading&&<div style={{textAlign:"center",padding:60,color:T.textMuted}}>Wird geladen...</div>}
        {isMobile&&DESKTOP_ONLY_TABS.includes(tab)&&<div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16,padding:"60px 24px",textAlign:"center"}}><div style={{fontSize:"2.5rem"}}>🖥️</div><div style={{fontWeight:700,fontSize:"1.1rem",color:T.dark}}>Desktop erforderlich</div><div style={{color:T.textMuted,fontSize:".88rem",maxWidth:280,lineHeight:1.6}}>Dieser Bereich ist fuer die Nutzung am Desktop optimiert. Bitte oeffne das Admin-Portal auf einem groesseren Bildschirm.</div></div>}
        {(!isMobile||!DESKTOP_ONLY_TABS.includes(tab))&&<>
        {!loading&&alerts.length>0&&<div style={{marginBottom:20,display:"flex",flexDirection:"column",gap:6}}>
          {alerts.map((a,i)=><div key={i} onClick={a.tab?()=>setTab(a.tab):undefined} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",borderRadius:T.rSm,background:a.type==="error"?"#fef2f2":a.type==="warn"?"#fefce8":"#eff6ff",border:`1px solid ${a.type==="error"?"#fecaca":a.type==="warn"?"#fde68a":"#bfdbfe"}`,cursor:a.tab?"pointer":"default"}}>
            <span style={{display:"inline-block",width:8,height:8,borderRadius:"50%",flexShrink:0,background:a.type==="error"?"#dc2626":a.type==="warn"?"#f59e0b":"#3b82f6"}}/>
            <span style={{fontSize:".82rem",fontWeight:600,color:a.type==="error"?"#dc2626":a.type==="warn"?"#92400e":"#1e40af",flex:1}}>{a.msg}</span>
            {a.tab&&<span style={{fontSize:".72rem",color:T.textMuted,whiteSpace:"nowrap"}}>Details &rarr;</span>}
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
                {l:"Live-Kunden",v:liveN,s:`\u20AC${mrr} MRR`,c:T.green,a:()=>setTab("health")},
                {l:"Trials aktiv",v:trialN,s:expiringTrials.filter(o=>o.tl<=3).length>0?`${expiringTrials.filter(o=>o.tl<=3).length} laufen in \u22643d ab`:"Alle noch frisch",c:"#7c3aed",a:()=>{setTab("bestellungen");setFilter("trial");}},
                {l:"Offene Tickets",v:openTickets.length,s:openTickets.length===0?"Alles beantwortet":"Bitte pruefen",c:openTickets.length>0?T.red:T.textMuted,a:()=>setTab("support")},
                {l:"KI-Kosten",v:`\u20AC${totalCost.toFixed(2)}`,s:"kumuliert",c:T.orange,a:()=>setTab("kosten")},
              ].map((k,i)=>(
                <div key={i} onClick={k.a} style={{background:"#fff",borderRadius:T.r,padding:"18px 20px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1,cursor:"pointer",transition:"box-shadow .15s"}} onMouseOver={e=>e.currentTarget.style.boxShadow=T.sh2} onMouseOut={e=>e.currentTarget.style.boxShadow=T.sh1}>
                  <div style={{fontSize:".65rem",fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:".1em",marginBottom:8}}>{k.l}</div>
                  <div style={{fontSize:"1.8rem",fontWeight:800,color:k.c,fontFamily:T.mono,letterSpacing:"-.03em",lineHeight:1}}>{k.v}</div>
                  <div style={{fontSize:".72rem",color:T.textMuted,marginTop:5}}>{k.s}</div>
                </div>
              ))}
            </div>
            {/* Trials ablaufend + Offene Tickets */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              <div style={{background:"#fff",borderRadius:T.r,padding:"18px 20px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1}}>
                <div style={{fontSize:".72rem",fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:".1em",marginBottom:12}}>Trials ablaufend (7 Tage)</div>
                {expiringTrials.length===0
                  ?<div style={{color:T.textMuted,fontSize:".82rem",padding:"12px 0"}}>Kein Trial l\u00e4uft in 7 Tagen ab.</div>
                  :<div style={{display:"flex",flexDirection:"column",gap:0}}>
                    {expiringTrials.map((o,i)=>{const tc=o.tl<=1?"#dc2626":o.tl<=3?"#d97706":T.green;return(<div key={o.id} onClick={()=>setSel(o)} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:i<expiringTrials.length-1?`1px solid ${T.bg3}`:"none",cursor:"pointer"}}>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontWeight:700,fontSize:".85rem",color:T.dark,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{o.firmenname||"\u2014"}</div>
                        <div style={{fontSize:".72rem",color:T.textMuted}}>{o.email}</div>
                      </div>
                      <span style={{padding:"2px 8px",borderRadius:4,background:tc+"22",color:tc,fontWeight:700,fontSize:".75rem",flexShrink:0}}>{o.tl>0?`${o.tl}d`:"Abgelaufen"}</span>
                    </div>);})}
                  </div>
                }
              </div>
              <div style={{background:"#fff",borderRadius:T.r,padding:"18px 20px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
                  <div style={{fontSize:".72rem",fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:".1em"}}>Offene Support-Anfragen</div>
                  {openTickets.length>0&&<button onClick={()=>setTab("support")} style={{padding:"3px 10px",border:`1px solid ${T.bg3}`,borderRadius:T.rSm,background:"#fff",color:T.textSub,cursor:"pointer",fontSize:".72rem",fontWeight:600,fontFamily:T.font}}>Alle ansehen</button>}
                </div>
                {openTickets.length===0
                  ?<div style={{color:T.textMuted,fontSize:".82rem",padding:"12px 0"}}>Keine offenen Anfragen.</div>
                  :<div style={{display:"flex",flexDirection:"column",gap:0}}>
                    {openTickets.slice(0,5).map((t,i)=><div key={t.id} onClick={()=>setTab("support")} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"8px 0",borderBottom:i<Math.min(openTickets.length,5)-1?`1px solid ${T.bg3}`:"none",cursor:"pointer"}}>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontWeight:600,fontSize:".84rem",color:T.dark,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.subject||"Allgemein"}</div>
                        <div style={{fontSize:".72rem",color:T.textMuted}}>{t.email} &middot; {fmtDate(t.created_at)}</div>
                      </div>
                    </div>)}
                  </div>
                }
              </div>
            </div>
            {/* Pipeline */}
            <div style={{background:"#fff",borderRadius:T.r,padding:"18px 20px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1}}>
              <div style={{fontSize:".72rem",fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:".1em",marginBottom:12}}>Status-Pipeline</div>
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

        {/* Tab: Bestellungen */}
        {!loading&&tab==="bestellungen"&&(()=>{
          const BESTELL_STATUS=["pending","trial"];
          const baseOrders=orders.filter(o=>BESTELL_STATUS.includes(o.status));
          const sf=(search?baseOrders.filter(o=>[o.firmenname,o.email,o.branche_label,o.subdomain].some(v=>v&&v.toLowerCase().includes(search.toLowerCase()))):baseOrders).filter(o=>filter==="alle"||o.status===filter);
          return(<div>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8,flexWrap:"wrap"}}>
              <h2 style={{fontSize:"1.2rem",fontWeight:800,color:T.dark,margin:0,marginRight:"auto"}}>Bestellungen</h2>
              <div style={{position:"relative"}}>
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Suchen..." style={{padding:"7px 30px 7px 12px",border:`2px solid ${T.bg3}`,borderRadius:T.rSm,fontSize:".82rem",fontFamily:T.font,outline:"none",width:200,background:"#fff"}}/>
                {search&&<button onClick={()=>setSearch("")} style={{position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:T.textMuted,fontSize:"1rem",lineHeight:1,padding:0}}>&times;</button>}
              </div>
              {filter!=="alle"&&<div style={{display:"flex",alignItems:"center",gap:4,padding:"5px 10px",background:STATUS_COLORS[filter]+"15",border:`1px solid ${STATUS_COLORS[filter]}33`,borderRadius:T.rSm}}>
                <span style={{fontSize:".72rem",fontWeight:700,color:STATUS_COLORS[filter]}}>{STATUS_LABELS[filter]}</span>
                <button onClick={()=>setFilter("alle")} style={{background:"none",border:"none",cursor:"pointer",color:STATUS_COLORS[filter],fontSize:"1rem",lineHeight:1,padding:"0 0 0 2px",fontWeight:700}}>&times;</button>
              </div>}
              <div style={{display:"flex",border:`2px solid ${T.bg3}`,borderRadius:T.rSm,overflow:"hidden"}}>
                {["kanban","tabelle"].map(v=><button key={v} onClick={()=>setView(v)} style={{padding:"6px 14px",border:"none",background:view===v?T.dark:"#fff",color:view===v?"#fff":T.textSub,cursor:"pointer",fontSize:".78rem",fontWeight:600,fontFamily:T.font}}>{v==="kanban"?"Kanban":"Tabelle"}</button>)}
              </div>
              <button onClick={exportCSV} disabled={orders.length===0} style={{padding:"7px 14px",border:`2px solid ${T.bg3}`,borderRadius:T.rSm,background:"#fff",color:T.textSub,cursor:"pointer",fontSize:".78rem",fontWeight:600,fontFamily:T.font,display:"flex",alignItems:"center",gap:5,opacity:orders.length===0?.5:1}}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>CSV
              </button>
            </div>
            <div style={{fontSize:".72rem",color:T.textMuted,marginBottom:16}}>Zeigt Bestellungen in Bearbeitung. Live & Offline Websites sind unter <button onClick={()=>setTab("health")} style={{background:"none",border:"none",cursor:"pointer",color:T.accent,fontSize:".72rem",fontWeight:700,padding:0,fontFamily:T.font}}>Website Health</button> sichtbar.</div>
            {view==="kanban"&&<div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,alignItems:"start"}}>
              {BESTELL_STATUS.map(s=>{const cols=sf.filter(o=>o.status===s);return(<div key={s}>
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10}}>
                  <div style={{width:8,height:8,borderRadius:"50%",background:STATUS_COLORS[s],flexShrink:0}}/>
                  <span style={{fontSize:".72rem",fontWeight:700,color:T.textSub,textTransform:"uppercase",letterSpacing:".08em"}}>{STATUS_LABELS[s]}</span>
                  <span style={{fontSize:".68rem",color:T.textMuted,background:T.bg3,borderRadius:10,padding:"1px 6px"}}>{cols.length}</span>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  {cols.map(o=><div key={o.id} style={{background:"#fff",borderRadius:T.rSm,padding:"12px 14px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1,cursor:"pointer"}} onClick={()=>setSel(o)}>
                    <div style={{fontWeight:700,fontSize:".85rem",color:T.dark,marginBottom:2}}>{o.firmenname||"—"}</div>
                    <div style={{fontSize:".72rem",color:T.textMuted}}>{fmtDate(o.created_at)}</div>
                  </div>)}
                </div>
              </div>);})}
            </div>}
            {view==="tabelle"&&(sf.length===0?<div style={{color:T.textMuted,padding:40,textAlign:"center"}}>Keine Ergebnisse.</div>:
            <div style={{background:"#fff",borderRadius:T.r,border:`1px solid ${T.bg3}`,overflow:"hidden",boxShadow:T.sh1}}>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead><tr style={{background:T.bg}}>{["Datum","Firma","Status","Trial"].map(h=><th key={h} style={{padding:"11px 16px",textAlign:"left",fontSize:".68rem",fontWeight:700,color:T.textMuted,letterSpacing:".08em",textTransform:"uppercase",borderBottom:`1px solid ${T.bg3}`}}>{h}</th>)}</tr></thead>
                <tbody>{sf.map((o,i)=>{const _exp=o.trial_expires_at||(o.created_at?new Date(new Date(o.created_at).getTime()+7*24*60*60*1000).toISOString():null);const tl=o.status==="trial"&&_exp?Math.ceil((new Date(_exp)-Date.now())/(1000*60*60*24)):null;const tc=tl===null?null:tl<=1?"#dc2626":tl<=3?"#d97706":T.green;return(<tr key={o.id} style={{borderBottom:`1px solid ${T.bg3}`,background:i%2===0?"#fff":"#fafbfc",cursor:"pointer"}} onClick={()=>setSel(o)}>
                  <td style={{padding:"12px 16px",fontSize:".82rem",color:T.textMuted,whiteSpace:"nowrap"}}>{fmtDate(o.created_at)}</td>
                  <td style={{padding:"12px 16px",fontWeight:700,fontSize:".88rem",color:T.dark}}>{o.firmenname||"—"}</td>
                  <td style={{padding:"12px 16px"}}><StatusBadge status={o.status}/></td>
                  <td style={{padding:"12px 16px"}}>{tl!==null?<span style={{padding:"2px 8px",borderRadius:4,background:tc+"22",color:tc,fontWeight:700,fontSize:".75rem"}}>{tl>0?`${tl} Tag${tl===1?"":"e"}`:"Abgelaufen"}</span>:<span style={{color:T.textMuted,fontSize:".82rem"}}>—</span>}</td>
                </tr>);})}</tbody>
              </table>
            </div>)}
          </div>);
        })()}

        {/* Tab: Support */}
        {!loading&&tab==="support"&&(<div>
          <h2 style={{fontSize:"1.2rem",fontWeight:800,color:T.dark,margin:"0 0 20px"}}>Support-Anfragen</h2>
          {tickets.length===0?<div style={{color:T.textMuted,padding:40,textAlign:"center"}}>Keine Support-Anfragen.</div>:
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {tickets.map(t=><div key={t.id} style={{background:"#fff",borderRadius:T.r,padding:"18px 22px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1}}>
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:8}}>
                <div>
                  <span style={{fontWeight:700,fontSize:".9rem",color:T.dark}}>{t.subject||"Allgemein"}</span>
                  <span style={{fontSize:".78rem",color:T.textMuted,marginLeft:10}}>{t.email} &middot; {fmtDate(t.created_at)}</span>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{padding:"3px 10px",borderRadius:4,background:t.status==="offen"?"#fef3c7":"#f0fdf4",color:t.status==="offen"?"#92400e":T.green,fontSize:".72rem",fontWeight:700}}>{t.status==="offen"?"Offen":"Beantwortet"}</span>
                  {t.status==="offen"&&<button onClick={()=>updateTicket(t.id,{status:"beantwortet"})} style={{padding:"4px 12px",border:`2px solid ${T.bg3}`,borderRadius:T.rSm,background:"#fff",color:T.textSub,cursor:"pointer",fontSize:".75rem",fontWeight:600,fontFamily:T.font}}>Als beantwortet markieren</button>}
                </div>
              </div>
              <p style={{margin:0,fontSize:".85rem",color:T.textSub,lineHeight:1.65,background:T.bg,padding:"12px 14px",borderRadius:T.rSm}}>{t.message}</p>
            </div>)}
          </div>}
        </div>)}
        {/* Tab: System */}
        {!loading&&tab==="system"&&(<div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
            <div>
              <h2 style={{fontSize:"1.2rem",fontWeight:800,color:T.dark,margin:"0 0 4px"}}>System</h2>
              {sysLastCheck&&<div style={{fontSize:".72rem",color:T.textMuted}}>APIs zuletzt geprüft: {sysLastCheck.toLocaleTimeString("de-AT")} &middot; Auto-Refresh 60s</div>}
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              {sysLoading&&<div style={{width:14,height:14,borderRadius:"50%",border:`2px solid ${T.accent}`,borderTopColor:"transparent",animation:"spin 1s linear infinite"}}/>}
              <button onClick={checkSystem} disabled={sysLoading} style={{padding:"7px 16px",border:`2px solid ${T.bg3}`,borderRadius:T.rSm,background:"#fff",color:T.textSub,cursor:sysLoading?"wait":"pointer",fontSize:".78rem",fontWeight:600,fontFamily:T.font}}>APIs prüfen</button>
            </div>
          </div>
          {/* Aktionen */}
          {stuckOrders.length>0&&<div style={{marginBottom:24}}>
            <div style={{fontSize:".68rem",fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:".1em",marginBottom:10}}>Aktionen erforderlich</div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {stuckOrders.map(o=><div key={o.id} style={{background:"#fff",borderRadius:T.r,padding:"14px 18px",border:"1px solid #fde68a",boxShadow:T.sh1,display:"flex",alignItems:"center",gap:14}}>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:".88rem",color:T.dark,cursor:"pointer"}} onClick={()=>setSel(o)}>{o.firmenname||"\u2014"}</div>
                  <div style={{fontSize:".75rem",color:"#92400e",marginTop:2}}>Bezahlt seit {fmtDate(o.created_at)} \u2013 Website noch nicht generiert</div>
                </div>
                <button onClick={()=>generateWebsite(o.id)} disabled={genLoading[o.id]} style={{padding:"6px 14px",border:"none",borderRadius:T.rSm,background:genLoading[o.id]?"#94a3b8":T.dark,color:"#fff",cursor:genLoading[o.id]?"wait":"pointer",fontSize:".78rem",fontWeight:700,fontFamily:T.font,flexShrink:0}}>
                  {genLoading[o.id]?"Generiert...":"Website generieren"}
                </button>
                {genMsg[o.id]&&<div style={{fontSize:".72rem",color:genMsg[o.id].startsWith("Fehler")||genMsg[o.id].startsWith("Netzwerk")?T.red:T.green}}>{genMsg[o.id]}</div>}
              </div>)}
            </div>
          </div>}
          {/* API Status */}
          {(!sysStatus&&sysLoading)&&<div style={{color:T.textMuted,padding:"40px",textAlign:"center",background:"#fff",borderRadius:T.r,border:`1px solid ${T.bg3}`,marginBottom:16}}>Verbindungen werden geprüft...</div>}
          {sysStatus&&<div style={{marginBottom:24}}>
            <div style={{fontSize:".68rem",fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:".1em",marginBottom:10}}>API-Status</div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {[
                {key:"supabase",label:"Supabase",desc:"Datenbank & Auth",detail:sysStatus.supabase?.latency?`${sysStatus.supabase.latency}ms`:""},
                {key:"stripe",label:"Stripe",desc:"Zahlungsabwicklung",detail:sysStatus.stripe?.livemode===false?"Testmodus":sysStatus.stripe?.livemode===true?"Live":""},
                {key:"anthropic",label:"Anthropic (Claude)",desc:"KI-Generierung",detail:sysStatus.anthropic?.billing?"Guthaben aufgebraucht!":""},
              ].map(({key,label,desc,detail})=>{
                const s=sysStatus[key];const ok=s?.ok;
                const isBilling=key==="anthropic"&&s?.billing;
                return(<div key={key} style={{background:"#fff",borderRadius:T.r,padding:"14px 18px",border:`1px solid ${isBilling?"#fecaca":ok?"rgba(22,163,74,.2)":T.bg3}`,boxShadow:T.sh1,display:"flex",alignItems:"center",gap:14}}>
                  <div style={{width:8,height:8,borderRadius:"50%",background:isBilling?"#dc2626":ok?T.green:T.red,boxShadow:`0 0 0 3px ${isBilling?"rgba(220,38,38,.15)":ok?"rgba(22,163,74,.15)":"rgba(220,38,38,.15)"}`,flexShrink:0}}/>
                  <div style={{flex:1}}>
                    <span style={{fontWeight:700,fontSize:".88rem",color:T.dark}}>{label}</span>
                    <span style={{fontSize:".78rem",color:T.textMuted,marginLeft:8}}>{desc}</span>
                    {detail&&<span style={{fontSize:".75rem",marginLeft:8,color:isBilling?"#dc2626":T.accent,fontWeight:600}}>{detail}</span>}
                    {s?.error&&!isBilling&&<div style={{fontSize:".72rem",color:T.red,marginTop:2}}>{s.error}</div>}
                  </div>
                  <span style={{fontSize:".78rem",fontWeight:700,color:ok?T.green:T.red}}>{ok?"OK":"Fehler"}</span>
                </div>);
              })}
            </div>
          </div>}
          {/* Env Vars */}
          {sysStatus&&<div>
            <div style={{fontSize:".68rem",fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:".1em",marginBottom:10}}>Environment Variables</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {Object.entries(sysStatus.envvars||{}).map(([k,v])=><div key={k} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 12px",borderRadius:T.rSm,background:v?T.greenLight:"#fef2f2",border:`1px solid ${v?"rgba(22,163,74,.15)":"rgba(220,38,38,.1)"}`}}>
                <span style={{fontSize:".72rem",color:v?T.green:T.red,fontWeight:700}}>{v?"\u2713":"\u2717"}</span>
                <span style={{fontSize:".78rem",fontFamily:T.mono,color:T.dark}}>{k}</span>
              </div>)}
            </div>
          </div>}
        </div>)}
        {/* Tab: Health */}
        {!loading&&tab==="health"&&(<div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16,flexWrap:"wrap",gap:10}}>
            <div>
              <h2 style={{fontSize:"1.2rem",fontWeight:800,color:T.dark,margin:"0 0 3px"}}>Website Health</h2>
              <div style={{fontSize:".72rem",color:T.textMuted}}>Live & Offline Websites – werden beim Oeffnen automatisch geprueft</div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{display:"flex",border:`2px solid ${T.bg3}`,borderRadius:T.rSm,overflow:"hidden"}}>
                {["alle","fehler"].map(f=><button key={f} onClick={()=>setHealthFilter(f)} style={{padding:"6px 12px",border:"none",background:healthFilter===f?T.dark:"#fff",color:healthFilter===f?"#fff":T.textSub,cursor:"pointer",fontSize:".75rem",fontWeight:600,fontFamily:T.font}}>{f==="alle"?"Alle":"Nur Fehler"}</button>)}
              </div>
              <button onClick={()=>orders.filter(o=>o.subdomain&&["live","offline"].includes(o.status)).forEach(o=>checkHealth(o))} style={{padding:"7px 14px",border:"none",borderRadius:T.rSm,background:T.dark,color:"#fff",cursor:"pointer",fontSize:".78rem",fontWeight:700,fontFamily:T.font}}>Alle prüfen</button>
            </div>
          </div>
          {(()=>{
            const rows=orders.filter(o=>o.subdomain&&["live","offline"].includes(o.status)).filter(o=>healthFilter==="fehler"?health[o.id]==="error":true);
            return rows.length===0?<div style={{padding:40,textAlign:"center",color:T.textMuted}}>{healthFilter==="fehler"?"Keine Fehler gefunden.":"Keine Websites mit Subdomain."}</div>:
            <div style={{background:"#fff",borderRadius:T.r,border:`1px solid ${T.bg3}`,overflow:"hidden",boxShadow:T.sh1}}>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead><tr style={{background:T.bg}}>{["Firma","URL","Status","HTTP","SSL","Gepr\u00fcft",""].map(h=><th key={h} style={{padding:"10px 14px",textAlign:"left",fontSize:".65rem",fontWeight:700,color:T.textMuted,letterSpacing:".08em",textTransform:"uppercase",borderBottom:`1px solid ${T.bg3}`}}>{h}</th>)}</tr></thead>
                <tbody>{rows.map((o,i)=>{
                  const h=health[o.id];const ht=healthTime[o.id];
                  const url=`sitereadyprototype.pages.dev/s/${o.subdomain}`;
                  return(<tr key={o.id} style={{borderBottom:`1px solid ${T.bg3}`,background:h==="error"?"#fef2f2":i%2===0?"#fff":"#fafbfc"}}>
                    <td style={{padding:"10px 14px",fontWeight:700,fontSize:".85rem",color:T.dark,cursor:"pointer"}} onClick={()=>setSel(o)}>{o.firmenname||"—"}</td>
                    <td style={{padding:"10px 14px",fontSize:".78rem",fontFamily:T.mono}}>
                      <a href={`https://${url}`} target="_blank" rel="noopener noreferrer" style={{color:T.accent,textDecoration:"none"}}>{url}</a>
                    </td>
                    <td style={{padding:"10px 14px"}}><StatusBadge status={o.status}/></td>
                    <td style={{padding:"10px 14px"}}>{h==="checking"?<span style={{color:T.textMuted,fontSize:".75rem"}}>...</span>:h==="ok"?<span style={{color:T.green,fontWeight:700,fontSize:".75rem"}}>{"\u2713"} OK</span>:h==="error"?<span style={{color:T.red,fontWeight:700,fontSize:".75rem"}}>{"\u2717"} Fehler</span>:<span style={{color:T.textMuted,fontSize:".75rem"}}>—</span>}</td>
                    <td style={{padding:"10px 14px"}}>{h==="ok"?<span style={{color:T.green,fontWeight:700,fontSize:".75rem"}}>{"\u2713"} HTTPS</span>:h==="error"?<span style={{color:T.red,fontWeight:700,fontSize:".75rem"}}>{"\u2717"} —</span>:<span style={{color:T.textMuted,fontSize:".75rem"}}>—</span>}</td>
                    <td style={{padding:"10px 14px",fontSize:".72rem",color:T.textMuted}}>{ht?ht.toLocaleTimeString("de-AT",{hour:"2-digit",minute:"2-digit"}):"—"}</td>
                    <td style={{padding:"10px 14px",textAlign:"right"}}><button onClick={()=>checkHealth(o)} style={{padding:"4px 10px",border:`2px solid ${T.bg3}`,borderRadius:T.rSm,background:"#fff",color:T.textSub,cursor:"pointer",fontSize:".72rem",fontWeight:600,fontFamily:T.font}}>Prüfen</button></td>
                  </tr>);
                })}</tbody>
              </table>
            </div>;
          })()}
        </div>)}

        {/* Tab: Kosten */}
        {!loading&&tab==="kosten"&&(()=>{
          const now=new Date();
          const months6=Array.from({length:6},(_,i)=>{const d=new Date(now.getFullYear(),now.getMonth()-5+i,1);return{label:d.toLocaleDateString("de-AT",{month:"short",year:"2-digit"}),key:`${d.getFullYear()}-${d.getMonth()}`};});
          const mData=months6.map(m=>({...m,count:orders.filter(o=>{if(!o.created_at)return false;const d=new Date(o.created_at);return`${d.getFullYear()}-${d.getMonth()}`===m.key;}).length}));
          const maxC=Math.max(1,...mData.map(m=>m.count));
          const liveN=orders.filter(o=>o.status==="live").length;
          const paidN=orders.filter(o=>o.status!=="pending").length;
          const mrr=liveN*18;
          const stripeFee=Math.round((mrr*0.014+paidN*0.25)*100)/100;
          const netto=Math.round((mrr-stripeFee)*100)/100;
          const sCounts=STATUS_FLOW.map(s=>({s,label:STATUS_LABELS[s],value:orders.filter(o=>o.status===s).length,color:STATUS_COLORS[s]})).filter(d=>d.value>0);
          const tot=Math.max(1,orders.length);
          const p2c=(cx,cy,r,deg)=>{const a=(deg-90)*Math.PI/180;return{x:cx+r*Math.cos(a),y:cy+r*Math.sin(a)};};
          const arc=(cx,cy,iR,oR,s,e)=>{if(e-s>=359.99)e=359.98;const l=e-s>180?1:0;const p1=p2c(cx,cy,oR,s),p2=p2c(cx,cy,oR,e),p3=p2c(cx,cy,iR,e),p4=p2c(cx,cy,iR,s);return`M${p1.x.toFixed(1)},${p1.y.toFixed(1)} A${oR},${oR} 0 ${l} 1 ${p2.x.toFixed(1)},${p2.y.toFixed(1)} L${p3.x.toFixed(1)},${p3.y.toFixed(1)} A${iR},${iR} 0 ${l} 0 ${p4.x.toFixed(1)},${p4.y.toFixed(1)} Z`;};
          let sa=0;const slices=sCounts.map(d=>{const a=(d.value/tot)*360;const sl={...d,sa,ea:sa+a};sa+=a;return sl;});
          return(<div>
            <h2 style={{fontSize:"1.2rem",fontWeight:800,color:T.dark,marginBottom:20}}>Kosten & Auslastung</h2>
            {/* KPI Cards */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
              {[{label:"MRR (brutto)",val:`\u20AC${mrr}`,sub:`${liveN} aktive Kunden`,c:T.green},{label:"Stripe-Gebühren",val:`\u20AC${stripeFee.toFixed(2)}`,sub:"1,4% + \u20AC0,25/Tx",c:T.orange},{label:"Netto-MRR",val:`\u20AC${netto}`,sub:"nach Transaktionsgeb.",c:T.accent},{label:"Bestellungen",val:orders.length,sub:`${paidN} bezahlt`,c:T.dark}].map((k,i)=>(
                <div key={i} style={{background:"#fff",borderRadius:T.r,padding:"18px 20px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1}}>
                  <div style={{fontSize:".68rem",fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:".1em",marginBottom:8}}>{k.label}</div>
                  <div style={{fontSize:"1.7rem",fontWeight:800,color:k.c,fontFamily:T.mono,letterSpacing:"-.03em",lineHeight:1}}>{k.val}</div>
                  <div style={{fontSize:".73rem",color:T.textMuted,marginTop:5}}>{k.sub}</div>
                </div>))}
            </div>
            {/* Charts */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
              {/* Bar Chart */}
              <div style={{background:"#fff",borderRadius:T.r,padding:"22px 24px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1}}>
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
              {/* Donut Chart */}
              <div style={{background:"#fff",borderRadius:T.r,padding:"22px 24px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1}}>
                <div style={{fontSize:".78rem",fontWeight:700,color:T.dark,marginBottom:18}}>Pipeline Auslastung</div>
                <div style={{display:"flex",alignItems:"center",gap:24}}>
                  <svg viewBox="0 0 200 200" style={{width:150,flexShrink:0}}>
                    {slices.length>0?slices.map((sl,i)=><path key={i} d={arc(100,100,52,80,sl.sa,sl.ea)} fill={sl.color} opacity=".9"/>):<circle cx={100} cy={100} r={80} fill="#e8ebf0"/>}
                    <circle cx={100} cy={100} r={52} fill="#fff"/>
                    <text x={100} y={94} textAnchor="middle" fontSize="24" fontWeight="800" fill={T.dark} fontFamily={T.mono}>{orders.length}</text>
                    <text x={100} y={112} textAnchor="middle" fontSize="10" fill={T.textMuted}>gesamt</text>
                  </svg>
                  <div style={{display:"flex",flexDirection:"column",gap:8,flex:1}}>
                    {sCounts.length>0?sCounts.map(d=>(
                      <div key={d.s} style={{display:"flex",alignItems:"center",gap:8}}>
                        <span style={{width:10,height:10,borderRadius:"50%",background:d.color,flexShrink:0,display:"inline-block"}}/>
                        <span style={{fontSize:".8rem",color:T.dark,flex:1}}>{d.label}</span>
                        <span style={{fontSize:".8rem",fontWeight:700,color:d.color,fontFamily:T.mono}}>{d.value}</span>
                      </div>)):<span style={{fontSize:".82rem",color:T.textMuted}}>Keine Daten</span>}
                  </div>
                </div>
              </div>
            </div>
            {/* Claude Echtkosten */}
            {(()=>{
              const totalCostEur=orders.reduce((a,o)=>a+(o.cost_eur||0),0);
              const totalTokIn=orders.reduce((a,o)=>a+(o.tokens_in||0),0);
              const totalTokOut=orders.reduce((a,o)=>a+(o.tokens_out||0),0);
              const withData=orders.filter(o=>o.tokens_in>0).length;
              return(<div style={{background:"#fff",borderRadius:T.r,padding:"20px 24px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1,marginBottom:16}}>
                <div style={{display:"flex",alignItems:"baseline",justifyContent:"space-between",marginBottom:12}}>
                  <div style={{fontSize:".78rem",fontWeight:700,color:T.dark}}>Claude API \u2013 gemessene Kosten (Sonnet)</div>
                  <span style={{fontSize:".72rem",color:T.textMuted}}>{withData}/{orders.length} Generierungen getrackt</span>
                </div>
                {totalCostEur>0?(
                  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
                    {[{l:"Gesamt kumuliert",v:`\u20AC${totalCostEur.toFixed(4)}`,c:T.orange},{l:"Input-Tokens",v:totalTokIn.toLocaleString("de-AT"),c:T.accent},{l:"Output-Tokens",v:totalTokOut.toLocaleString("de-AT"),c:T.accent}].map((k,i)=>(
                      <div key={i} style={{padding:"14px 16px",background:T.bg,borderRadius:T.rSm,border:`1px solid ${T.bg3}`}}>
                        <div style={{fontSize:".65rem",fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:".1em",marginBottom:6}}>{k.l}</div>
                        <div style={{fontSize:"1.2rem",fontWeight:800,color:k.c,fontFamily:T.mono}}>{k.v}</div>
                      </div>))}
                  </div>
                ):<div style={{fontSize:".82rem",color:T.textMuted}}>Noch keine Token-Daten \u2013 werden ab der nächsten Generierung erfasst.</div>}
              </div>);
            })()}
            {/* Kostentabelle */}
            <div style={{background:"#fff",borderRadius:T.r,padding:"20px 24px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1}}>
              <div style={{fontSize:".68rem",fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:".1em",marginBottom:14}}>Monatliche Kostenbasis</div>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:".84rem"}}>
                <thead><tr>{["Posten","Kosten/Mo"].map(h=><th key={h} style={{textAlign:"left",padding:"8px 14px",fontSize:".68rem",fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:".08em",borderBottom:`1px solid ${T.bg3}`}}>{h}</th>)}</tr></thead>
                <tbody>
                  {[{p:"Cloudflare Pages",k:"\u20AC0"},{p:"Supabase",k:"\u20AC0"},{p:"Stripe",k:`\u20AC${stripeFee.toFixed(2)}`},{p:"Anthropic Claude",k:`\u20AC${(orders.reduce((a,o)=>a+(o.cost_eur||0),0)/Math.max(1,new Date().getMonth())).toFixed(3)}`},{p:"Domain siteready.at",k:"~\u20AC0,83"}].map((r,i)=>(
                    <tr key={i} style={{background:i%2===0?"#fff":"#fafbfc"}}>
                      <td style={{padding:"10px 14px",fontWeight:600,color:T.dark}}>{r.p}</td>
                      <td style={{padding:"10px 14px",fontWeight:700,color:T.dark,fontFamily:T.mono}}>{r.k}</td>
                    </tr>))}
                  <tr style={{background:T.bg,borderTop:`2px solid ${T.bg3}`}}>
                    <td style={{padding:"12px 14px",fontWeight:800,color:T.dark}}>Gesamt</td>
                    <td style={{padding:"12px 14px",fontWeight:800,color:T.dark,fontFamily:T.mono}}>{"\u20AC"}{(0.83+stripeFee).toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>);
        })()}



        {/* Tab: System-Architektur */}
        {!loading&&tab==="arch-system"&&(()=>{
          const chip=(label,sub,color)=>(<span style={{display:"inline-flex",alignItems:"center",gap:5,padding:"3px 8px",borderRadius:20,background:color+"14",border:`1px solid ${color}28`,fontSize:".69rem",fontWeight:600,color:T.dark,margin:"2px 3px",whiteSpace:"nowrap"}}><span style={{width:5,height:5,borderRadius:"50%",background:color,flexShrink:0}}/>{label}{sub&&<span style={{fontSize:".6rem",color:T.textMuted,fontWeight:400}}>· {sub}</span>}</span>);
          const layer=(title,color,children,note)=>(<div style={{padding:"7px 12px",marginBottom:3,background:color+"07",borderLeft:`3px solid ${color}`,borderRadius:`0 ${T.rSm} ${T.rSm} 0`}}><div style={{display:"flex",alignItems:"baseline",flexWrap:"wrap",gap:0}}><span style={{fontSize:".6rem",fontWeight:800,color,textTransform:"uppercase",letterSpacing:".1em",marginRight:8,flexShrink:0}}>{title}</span><span style={{display:"inline"}}>{children}</span></div>{note&&<div style={{marginTop:3,fontSize:".61rem",color,opacity:.65,fontStyle:"italic"}}>{note}</div>}</div>);
          const arr=<div style={{textAlign:"center",color:T.bg3,fontSize:".7rem",margin:"1px 0",lineHeight:1}}>↓</div>;
          return(<div id="arch-system-print">
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}><h2 style={{fontSize:"1.1rem",fontWeight:800,color:T.dark,margin:0}}>System-Architektur</h2><button onClick={()=>printTabHTML("arch-system-print","System-Architektur")} style={{padding:"5px 12px",border:`1px solid ${T.bg3}`,borderRadius:T.rSm,background:"#fff",color:T.textSub,cursor:"pointer",fontSize:".72rem",fontWeight:700,fontFamily:T.font}}>PDF</button></div>
            {layer("Entwicklung & Deploy","#6366f1",<>{chip("Entwickler","VS Code · Git","#6366f1")}{chip("GitHub","main branch","#6366f1")}{chip("Cloudflare Pages CI/CD","push → build → deploy","#6366f1")}</>,"git push main → automatischer Build & Deploy ~1 Min.")}
            {arr}{layer("Nutzer","#64748b",<>{chip("Neukunde","Landingpage · Formular · Stripe","#64748b")}{chip("Bestandskunde","Portal-Login","#64748b")}{chip("Admin","/admin?key=...","#64748b")}</>)}
            {arr}{layer("Cloudflare Pages (Edge/CDN)","#f97316",<>{chip("React SPA","/ · Landing + Formular","#f97316")}{chip("Admin Dashboard","/admin?key=...","#f97316")}{chip("Edge Functions","/api/* · 12 Endpoints","#f97316")}{chip("Website Serving","/s/[subdomain]","#f97316")}{chip("Legal Serving","/s/[subdomain]/impressum","#f97316")}</>,  "SSL automatisch · CDN weltweit · robots.txt: /s/* noindex (Prototyp)")}
            {arr}{layer("Supabase","#2563eb",<>{chip("PostgreSQL","orders · docs · support_requests","#2563eb")}{chip("Storage","Logo · Fotos pro Kunde","#2563eb")}{chip("Auth","Portal-Login · JWT","#2563eb")}</>)}
            {arr}{layer("Externe APIs","#8b5cf6",<>{chip("Claude Sonnet","Website-Generierung","#8b5cf6")}{chip("Claude Haiku","Website-Import","#0891b2")}{chip("Stripe","Checkout · Webhooks","#16a34a")}{chip("Jina AI","Website-Import Reader","#6366f1")}{chip("Google Fonts","DM Sans · Inter","#f59e0b")}</>)}
            {arr}{layer("DNS & Domains","#94a3b8",<>{chip("Cloudflare DNS","siteready.at","#94a3b8")}{chip("Prototyp","sitereadyprototype.pages.dev/s/{firma}","#94a3b8")}{chip("Produktion (geplant)","{firma}.siteready.at","#94a3b8")}</>)}
            <div style={{marginTop:10,padding:"7px 11px",background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:T.rSm,fontSize:".69rem",color:"#1e40af",lineHeight:1.7}}><strong>Serve-time:</strong> Logo, Fotos, Galerie, Kontaktdaten live aus Supabase – kein Re-Deploy. <strong>Impressum/Datenschutz:</strong> legal.js frisch aus DB bei jedem Request.</div>
          </div>);
        })()}

        {/* Tab: Flows */}
        {!loading&&tab==="arch-flows"&&(()=>{
          const ftitle=(icon,label)=>(<div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14,paddingBottom:10,borderBottom:`1px solid ${T.bg3}`}}><span style={{fontSize:"1rem"}}>{icon}</span><span style={{fontSize:".85rem",fontWeight:800,color:T.dark}}>{label}</span></div>);
          const fnode=(icon,label,sub,color,optional)=>(<div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,flex:"1 1 90px",minWidth:80,maxWidth:140}}><div style={{width:38,height:38,borderRadius:"50%",background:color+"18",border:`2px solid ${color}33`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1rem"}}>{icon}</div><div style={{fontSize:".7rem",fontWeight:700,color:T.dark,textAlign:"center",lineHeight:1.3}}>{label}</div>{sub&&<div style={{fontSize:".62rem",color:T.textMuted,textAlign:"center",lineHeight:1.3}}>{sub}</div>}{optional&&<span style={{fontSize:".58rem",fontWeight:700,color:T.textMuted,background:T.bg3,padding:"1px 5px",borderRadius:3}}>Optional</span>}</div>);
          const farrow=<div style={{color:T.textMuted,fontSize:"1rem",alignSelf:"center",flexShrink:0,paddingBottom:16}}>→</div>;
          const fphase=(label,color,children)=>(<div style={{marginBottom:14}}><div style={{fontSize:".62rem",fontWeight:800,color,textTransform:"uppercase",letterSpacing:".1em",marginBottom:8,paddingLeft:2}}>{label}</div><div style={{display:"flex",alignItems:"flex-start",gap:4,flexWrap:"wrap"}}>{children}</div></div>);
          return(<div id="arch-flows-print">
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",margin:"0 0 4px"}}><h2 style={{fontSize:"1.1rem",fontWeight:800,color:T.dark,margin:0}}>Flows</h2><button onClick={()=>printTabHTML("arch-flows-print","Flows")} style={{padding:"5px 12px",border:`1px solid ${T.bg3}`,borderRadius:T.rSm,background:"#fff",color:T.textSub,cursor:"pointer",fontSize:".72rem",fontWeight:700,fontFamily:T.font}}>PDF</button></div>
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
              {fphase("Phase 7 – Ende des Abos","#94a3b8",<>{fnode("❌","Kuendigung","Monatsabo: jederzeit · Jahresabo: nach 12 Mo","#94a3b8")}{farrow}{fnode("🚫","Offline","subscription.deleted → status: offline","#94a3b8")}{farrow}{fnode("🗑️","Daten loeschen","auf Wunsch","#94a3b8",true)}</>)}
              <div style={{padding:"7px 10px",background:"#fef3c7",border:"1px solid #fde68a",borderRadius:T.rSm,fontSize:".7rem",color:"#92400e"}}>Phase 1 optional (nur wenn Bestandswebsite vorhanden) · Phase 5 noindex bis Production · Phase 7 erst nach Go-Live relevant.</div>
            </div>
            <div style={{fontSize:".72rem",fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:".1em",marginBottom:10}}>Technische Flows</div>
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
                    <div style={{fontSize:".63rem",fontWeight:800,color:T.textMuted,textTransform:"uppercase",letterSpacing:".08em",marginBottom:10}}>Website – index.js</div>
                    {fphase("Request","#64748b",<>{fnode("🌐","GET /s/{sub}","Browser oder Bot","#64748b")}{farrow}{fnode("💾","Supabase","order laden","#2563eb")}{farrow}{fnode("✅","Status-Check","200 · 404 · 503","#f97316")}</>)}
                    {fphase("Injection","#f97316",<>{fnode("🖼️","Logo + Fotos","site-nav-logo · slots","#f97316")}{farrow}{fnode("🗄️","Galerie","GALERIE-Tag → Grid","#f97316")}{farrow}{fnode("📤","Response","Cache: max-age=60","#64748b")}</>)}
                  </div>
                  <div>
                    <div style={{fontSize:".63rem",fontWeight:800,color:T.textMuted,textTransform:"uppercase",letterSpacing:".08em",marginBottom:10}}>Impressum/Datenschutz – legal.js</div>
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
              <span style={{fontSize:".7rem",fontWeight:800,color:T.textMuted,textTransform:"uppercase",letterSpacing:".1em"}}>Inhalt</span>
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
                  <button onClick={exportMD} style={{padding:"5px 12px",border:`1px solid ${T.bg3}`,borderRadius:T.rSm,background:"#fff",color:T.textSub,cursor:"pointer",fontSize:".72rem",fontWeight:700,fontFamily:T.font}}>MD</button>
                  <button onClick={exportPDF} style={{padding:"5px 12px",border:`1px solid ${T.bg3}`,borderRadius:T.rSm,background:"#fff",color:T.textSub,cursor:"pointer",fontSize:".72rem",fontWeight:700,fontFamily:T.font}}>PDF</button>
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
      {sel&&(<div onClick={e=>{if(e.target===e.currentTarget)setSel(null);}} style={{position:"fixed",inset:0,zIndex:2000,background:"rgba(0,0,0,.45)",display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
        <div style={{background:"#fff",borderRadius:12,width:"100%",maxWidth:980,maxHeight:"90vh",overflowY:"auto",boxShadow:"0 24px 80px rgba(0,0,0,.2)"}}>
          {/* Modal Header */}
          <div style={{padding:"20px 28px",borderBottom:`1px solid ${T.bg3}`,display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,background:"#fff",zIndex:1,borderRadius:"12px 12px 0 0"}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <h3 style={{margin:0,fontSize:"1.1rem",fontWeight:800,color:T.dark}}>{sel.firmenname||"—"}</h3>
              <StatusBadge status={sel.status}/>
            </div>
            <button onClick={()=>setSel(null)} style={{background:"none",border:"none",fontSize:"1.4rem",cursor:"pointer",color:T.textMuted,padding:"4px 8px",lineHeight:1}}>&times;</button>
          </div>
          {/* Zwei Spalten */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:0}}>
            {/* Linke Spalte: Infos */}
            <div style={{padding:28,borderRight:`1px solid ${T.bg3}`}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
                <div style={{fontSize:".72rem",fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:".08em"}}>Kundendaten</div>
                {!editKunde
                  ?<button onClick={()=>setEditKunde({email:sel.email||"",telefon:sel.telefon||"",adresse:sel.adresse||"",plz:sel.plz||"",ort:sel.ort||"",subdomain:sel.subdomain||""})} style={{background:"none",border:"none",cursor:"pointer",padding:4,color:T.textMuted,fontSize:".85rem",lineHeight:1}} title="Bearbeiten">✏️</button>
                  :<div style={{display:"flex",gap:6}}>
                    <button onClick={async()=>{await updateOrder(sel.id,editKunde);setEditKunde(null);}} style={{padding:"3px 10px",border:"none",borderRadius:T.rSm,background:T.accent,color:"#fff",cursor:"pointer",fontSize:".72rem",fontWeight:700,fontFamily:T.font}}>Speichern</button>
                    <button onClick={()=>setEditKunde(null)} style={{padding:"3px 10px",border:`1px solid ${T.bg3}`,borderRadius:T.rSm,background:"#fff",color:T.textSub,cursor:"pointer",fontSize:".72rem",fontWeight:600,fontFamily:T.font}}>Abbrechen</button>
                  </div>
                }
              </div>
              {editKunde
                ?<div style={{display:"flex",flexDirection:"column",gap:8}}>
                    {[["E-Mail","email"],["Telefon","telefon"],["Adresse","adresse"],["PLZ","plz"],["Ort","ort"],["Subdomain","subdomain"]].map(([l,k])=><div key={k} style={{display:"grid",gridTemplateColumns:"100px 1fr",alignItems:"center",gap:8,fontSize:".83rem"}}>
                      <span style={{color:T.textMuted,fontWeight:600}}>{l}</span>
                      <input value={editKunde[k]} onChange={e=>setEditKunde(ev=>({...ev,[k]:e.target.value}))} style={{padding:"6px 10px",border:`2px solid ${T.bg3}`,borderRadius:T.rSm,fontSize:".82rem",fontFamily:T.font,outline:"none",background:"#fff",width:"100%",boxSizing:"border-box"}}/>
                    </div>)}
                  <div style={{marginTop:10,padding:"8px 10px",borderRadius:T.rSm,background:"#eff6ff",border:"1px solid #bfdbfe",fontSize:".72rem",color:"#1e40af",lineHeight:1.6}}>
                    <strong>E-Mail, Telefon, Adresse:</strong> sofort live (serve-time).<br/>
                    <strong>Subdomain:</strong> URL ändert sich sofort &ndash; danach Website neu generieren.
                  </div>
                  </div>
                :<div style={{display:"flex",flexDirection:"column",gap:0}}>
                  {(()=>{const gb=GRUPPE_BADGE[getBrancheGruppe(sel.branche)];return(<div style={{display:"grid",gridTemplateColumns:"130px 1fr",padding:"8px 0",borderBottom:`1px solid ${T.bg3}`,fontSize:".83rem"}}><span style={{color:T.textMuted,fontWeight:500}}>Berufsgruppe</span><span style={{display:"inline-flex",alignItems:"center",gap:5}}><span style={{padding:"1px 8px",borderRadius:20,background:gb.bg,color:gb.c,fontSize:".72rem",fontWeight:700}}>{gb.icon} {gb.label}</span></span></div>);})()}
                  {(()=>{
                    const planLabel=sel.subscription_plan==="yearly"?"\u20AC183.60 / Jahr":sel.subscription_plan==="monthly"?"\u20AC18 / Monat":null;
                    const planColor=sel.subscription_plan==="yearly"?T.green:sel.subscription_plan==="monthly"?T.accent:null;
                    const _selExp=sel.trial_expires_at||(sel.created_at?new Date(new Date(sel.created_at).getTime()+7*24*60*60*1000).toISOString():null);const trialLeft=sel.status==="trial"&&_selExp?Math.ceil((new Date(_selExp)-Date.now())/(1000*60*60*24)):null;
                    return(<>
                      {planLabel&&<div style={{display:"grid",gridTemplateColumns:"130px 1fr",padding:"8px 0",borderBottom:`1px solid ${T.bg3}`,fontSize:".83rem"}}>
                        <span style={{color:T.textMuted,fontWeight:600}}>Abo-Plan</span>
                        <span style={{display:"inline-flex",alignItems:"center",gap:6}}>
                          <span style={{padding:"2px 8px",borderRadius:4,background:planColor+"22",color:planColor,fontWeight:700,fontSize:".75rem"}}>{planLabel}</span>
                          {sel.stripe_customer_id&&<span style={{fontSize:".7rem",color:T.textMuted,fontFamily:T.mono}}>{sel.stripe_customer_id}</span>}
                        </span>
                      </div>}
                      {trialLeft!==null&&sel.status==="trial"&&<div style={{display:"grid",gridTemplateColumns:"130px 1fr",padding:"8px 0",borderBottom:`1px solid ${T.bg3}`,fontSize:".83rem"}}>
                        <span style={{color:T.textMuted,fontWeight:600}}>Trial</span>
                        <span style={{color:trialLeft>0?T.dark:T.red,fontWeight:600}}>{trialLeft>0?`${trialLeft} Tag(e) verbleibend`:"Abgelaufen"}</span>
                      </div>}
                    </>);
                  })()}
                  {[["E-Mail",sel.email],["Branche",sel.branche_label],["Telefon",sel.telefon],["Adresse",[sel.adresse,[sel.plz,sel.ort].filter(Boolean).join(" ")].filter(Boolean).join(", ")],["UID",sel.uid_nummer],["Unternehmensform",sel.unternehmensform],["Firmenbuch",sel.firmenbuchnummer],["GISA",sel.gisazahl],["Stil",sel.stil],["Fotos",sel.fotos?"Ja":"Nein"],["Subdomain",sel.subdomain],["Bestellt",fmtDate(sel.created_at)]].map(([l,v])=>v?<div key={l} style={{display:"grid",gridTemplateColumns:"130px 1fr",padding:"8px 0",borderBottom:`1px solid ${T.bg3}`,fontSize:".83rem"}}>
                    <span style={{color:T.textMuted,fontWeight:600}}>{l}</span><span style={{color:T.dark}}>{v}</span>
                  </div>:null)}
                </div>
              }
            </div>
            {/* Rechte Spalte: Website-Aktionen */}
            <div style={{padding:28}}>
              {/* Website */}
              <div style={{padding:"14px",background:T.bg,borderRadius:T.rSm,border:`1px solid ${T.bg3}`}}>
                <div style={{fontSize:".72rem",fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:".08em",marginBottom:10}}>Website</div>
                {sel.website_html&&sel.subdomain&&<a href={`https://sitereadyprototype.pages.dev/s/${sel.subdomain}`} target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:6,fontSize:".82rem",color:T.green,fontWeight:600,marginBottom:12,textDecoration:"none"}}>&#128279; /s/{sel.subdomain}</a>}
                <div>
                  {sel.website_html
                    ?regenConfirm===sel.id
                      ?<button onClick={()=>setRegenConfirm(null)} style={{padding:"8px 16px",border:`2px solid ${T.bg3}`,borderRadius:T.rSm,background:"#fff",color:T.textSub,cursor:"pointer",fontSize:".82rem",fontWeight:700,fontFamily:T.font}}>Abbrechen</button>
                      :<button onClick={()=>setRegenConfirm(sel.id)} disabled={genLoading[sel.id]} style={{padding:"8px 16px",border:"none",borderRadius:T.rSm,background:genLoading[sel.id]?"#94a3b8":T.dark,color:"#fff",cursor:genLoading[sel.id]?"wait":"pointer",fontSize:".82rem",fontWeight:700,fontFamily:T.font,transition:"background .2s"}}>{genLoading[sel.id]?"Generiert (ca. 30s)...":"Website neu generieren"}</button>
                    :<button onClick={()=>generateWebsite(sel.id)} disabled={genLoading[sel.id]} style={{padding:"8px 16px",border:"none",borderRadius:T.rSm,background:genLoading[sel.id]?"#94a3b8":T.dark,color:"#fff",cursor:genLoading[sel.id]?"wait":"pointer",fontSize:".82rem",fontWeight:700,fontFamily:T.font,transition:"background .2s"}}>{genLoading[sel.id]?"Generiert (ca. 30s)...":"\u2728 Website generieren"}</button>
                  }
                </div>
                {regenConfirm===sel.id&&<div style={{marginTop:8,background:"#fff7ed",border:"1px solid #fed7aa",borderRadius:T.rSm,padding:"12px 14px"}}>
                  <div style={{fontSize:".78rem",fontWeight:700,color:"#92400e",marginBottom:8}}>Bestehende Website wird überschrieben. "NEU" eintippen:</div>
                  <div style={{display:"flex",gap:6}}>
                    <input id="regen-confirm-input" autoFocus placeholder="NEU" style={{flex:1,padding:"7px 10px",border:"2px solid #fdba74",borderRadius:T.rSm,fontSize:".82rem",fontFamily:"monospace",outline:"none",background:"#fff"}}/>
                    <button onClick={()=>{const v=document.getElementById("regen-confirm-input")?.value||"";if(v==="NEU"){setRegenConfirm(null);generateWebsite(sel.id);}}} style={{padding:"7px 14px",border:"none",borderRadius:T.rSm,background:T.dark,color:"#fff",cursor:"pointer",fontSize:".78rem",fontWeight:700,fontFamily:T.font}}>Generieren</button>
                  </div>
                </div>}
                {genMsg[sel.id]&&<div style={{marginTop:8,fontSize:".78rem",color:genMsg[sel.id].startsWith("Fehler")||genMsg[sel.id].startsWith("Netzwerk")?T.red:T.green,fontWeight:600}}>{genMsg[sel.id]}</div>}
                {(()=>{const ready=sel.status==="review"&&!!sel.website_html;return(<button onClick={ready?()=>updateOrder(sel.id,{status:"live"}):undefined} disabled={!ready} style={{marginTop:8,padding:"10px 16px",border:"none",borderRadius:T.rSm,background:ready?T.green:"#e2e8f0",color:ready?"#fff":"#94a3b8",cursor:ready?"pointer":"default",fontSize:".85rem",fontWeight:700,fontFamily:T.font,width:"100%",transition:"background .2s"}}>&#128640; {sel.status==="live"?"Bereits live":ready?"Live setzen":"Live setzen (noch nicht bereit)"}</button>);})()}
                <div style={{display:"flex",gap:8,marginTop:8}}>
                  {sel.status==="offline"
                    ?<button onClick={()=>updateOrder(sel.id,{status:"live"})} style={{flex:1,padding:"7px 12px",border:"2px solid #16a34a",borderRadius:T.rSm,background:"#fff",color:"#16a34a",cursor:"pointer",fontSize:".78rem",fontWeight:700,fontFamily:T.font}}>&#128994; Wieder online</button>
                    :<button onClick={()=>updateOrder(sel.id,{status:"offline"})} disabled={!sel.website_html} style={{flex:1,padding:"7px 12px",border:"2px solid #64748b",borderRadius:T.rSm,background:"#fff",color:sel.website_html?"#64748b":"#cbd5e1",cursor:sel.website_html?"pointer":"default",fontSize:".78rem",fontWeight:700,fontFamily:T.font}}>&#128683; Offline nehmen</button>
                  }
                  {deleteConfirm===sel.id
                    ?<button onClick={()=>setDeleteConfirm(null)} style={{flex:1,padding:"7px 12px",border:"2px solid #94a3b8",borderRadius:T.rSm,background:"#fff",color:"#64748b",cursor:"pointer",fontSize:".78rem",fontWeight:700,fontFamily:T.font}}>Abbrechen</button>
                    :<button onClick={()=>setDeleteConfirm(sel.id)} style={{flex:1,padding:"7px 12px",border:"2px solid #ef4444",borderRadius:T.rSm,background:"#fff",color:"#ef4444",cursor:"pointer",fontSize:".78rem",fontWeight:700,fontFamily:T.font}}>&#128465; Kunden löschen</button>
                  }
                </div>
                {deleteConfirm===sel.id&&<div style={{marginTop:8,background:"#fef2f2",border:"1px solid #fecaca",borderRadius:T.rSm,padding:"12px 14px"}}>
                  <div style={{fontSize:".75rem",color:"#991b1b",marginBottom:8,lineHeight:1.6}}><strong>Achtung – unwiderruflich:</strong> Es werden gelöscht: Bestellung, Auth-Account, alle hochgeladenen Fotos und Support-Anfragen des Kunden.</div>
                  <div style={{fontSize:".78rem",fontWeight:700,color:"#991b1b",marginBottom:8}}>Zur Bestätigung "LÖSCHEN" eintippen:</div>
                  <div style={{display:"flex",gap:6}}>
                    <input id="del-confirm-input" autoFocus placeholder="LÖSCHEN" style={{flex:1,padding:"7px 10px",border:"2px solid #fca5a5",borderRadius:T.rSm,fontSize:".82rem",fontFamily:"monospace",outline:"none",background:"#fff"}}/>
                    <button onClick={()=>{const v=document.getElementById("del-confirm-input")?.value||"";if(v==="LÖSCHEN")deleteOrder(sel.id);}} style={{padding:"7px 14px",border:"none",borderRadius:T.rSm,background:"#ef4444",color:"#fff",cursor:"pointer",fontSize:".78rem",fontWeight:700,fontFamily:T.font}}>Löschen</button>
                  </div>
                </div>}
              </div>
              {/* Interne Notiz */}
              <div style={{marginTop:16,padding:"14px",background:T.bg,borderRadius:T.rSm,border:`1px solid ${T.bg3}`}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                  <div style={{fontSize:".72rem",fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:".08em"}}>Interne Notiz</div>
                  <button onClick={()=>saveNotiz(sel.id)} title="Speichern" style={{background:"none",border:"none",cursor:"pointer",padding:4,color:notizSaved[sel.id]?T.green:T.textMuted,fontSize:"1rem",lineHeight:1}}>
                    {notizSaved[sel.id]?"✓":"✏️"}
                  </button>
                </div>
                <textarea value={notiz[sel.id]||""} onChange={e=>setNotiz(n=>({...n,[sel.id]:e.target.value}))} placeholder="Notiz hinzufügen..." rows={3} style={{width:"100%",padding:"10px 12px",border:`2px solid ${T.bg3}`,borderRadius:T.rSm,fontSize:".82rem",fontFamily:T.font,resize:"vertical",boxSizing:"border-box",outline:"none",background:"#fff"}}/>
              </div>
            </div>
          </div>
          {/* Prozess-Details aufklappbar */}
          <div style={{borderTop:`1px solid ${T.bg3}`}}>
            <button onClick={()=>setShowProzess(p=>!p)} style={{width:"100%",padding:"12px 28px",background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",fontSize:".82rem",fontWeight:700,color:T.textMuted,fontFamily:T.font}}>
              <span>&#128269; Technische Details &amp; Prozess-Timeline</span>
              <span style={{transition:"transform .2s",display:"inline-block",transform:showProzess?"rotate(180deg)":"rotate(0deg)"}}>&#9660;</span>
            </button>
            {showProzess&&(()=>{
              const st=sel.status;
              const idx=STATUS_FLOW.indexOf(st);
              const hasHtml=!!sel.website_html;
              const trialExpiry=sel.trial_expires_at?new Date(sel.trial_expires_at):null;
              const trialDaysLeft=trialExpiry?Math.max(0,Math.ceil((trialExpiry-Date.now())/(1000*60*60*24))):null;
              const steps=[
                {key:"pending",label:"Schritt 1 \u2013 Formular & Generierung",icon:"📋",detail:`Fragebogen ausgefuellt, Account erstellt, Website-Generierung automatisch gestartet.`,meta:[["Erstellt",fmtDate(sel.created_at)],["Branche",sel.branche_label],["Stil",sel.stil],["Fotos",sel.fotos?"Ja":"Nein"],hasHtml&&["Modell","claude-sonnet-4-6"],hasHtml&&["Tokens In",(sel.tokens_in||0).toLocaleString("de-AT")],hasHtml&&["Tokens Out",(sel.tokens_out||0).toLocaleString("de-AT")],hasHtml&&["Kosten",`\u20AC${(sel.cost_eur||0).toFixed(4)}`],hasHtml&&["HTML-Groesse",`${Math.round((sel.website_html||"").length/1024)} KB`]].filter(Boolean),error:sel.last_error||null},
                {key:"trial",label:"Schritt 2 \u2013 Testphase",icon:"🔬",detail:st==="trial"?`Website aktiv. Kunde hat${trialDaysLeft!==null?` noch ${trialDaysLeft} Tag${trialDaysLeft===1?"":"e"}`:""} um ein Abo abzuschliessen.`:st==="live"||st==="offline"?"Testphase abgeschlossen \u2013 Abo aktiv.":"Noch nicht erreicht.",meta:[["Trial bis",trialExpiry?trialExpiry.toLocaleDateString("de-AT",{day:"2-digit",month:"long",year:"numeric"}):"—"],["Subdomain",sel.subdomain||"—"],["Plan",sel.subscription_plan||"—"]]},
                {key:"live",label:"Schritt 3 \u2013 Abo & Live",icon:"🚀",detail:"Stripe-Abo aktiv. Erste Zahlung eingegangen. Website oeffentlich erreichbar.",meta:[["Abo-Plan",sel.subscription_plan==="yearly"?"J\u00e4hrlich (\u20AC183.60)":sel.subscription_plan==="monthly"?"Monatlich (\u20AC18)":"—"],["Stripe Customer",sel.stripe_customer_id||"—"],["Status",st==="live"?"Online":st==="offline"?"Offline":"Ausstehend"],["Subdomain",sel.subdomain?`${sel.subdomain}.siteready.at`:"—"]]},
              ];
              const futureSteps=[
                {num:6,label:"Subdomain indexieren",icon:"🔍",optional:false,detail:"noindex-Tag entfernen – Google kann die Website auf der siteready.at-Subdomain indexieren. Wird nach Abschluss der Prototyp-Phase aktiviert."},
                {num:7,label:"Custom Domain Onboarding",icon:"🌐",optional:true,detail:"Kundeneigene Domain (z.B. firma.at) via CNAME/A-Record auf siteready.at zeigen lassen. SSL wird automatisch von Cloudflare ausgestellt."},
                {num:8,label:"Custom Domain indexieren",icon:"📈",optional:true,detail:"noindex auf der Custom Domain entfernen. Google Search Console einreichen. Dauert typisch 1–4 Wochen bis zur vollständigen Indexierung."},
                {num:9,label:"Subdomain aus Google entfernen",icon:"🧹",optional:true,detail:"Sobald die Custom Domain indexiert ist: noindex auf der Subdomain wieder aktivieren (oder 301-Redirect setzen). Verhindert Duplicate-Content-Penaltys."},
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
                        {current&&<span style={{background:"#fef3c7",color:"#92400e",fontSize:".65rem",fontWeight:700,padding:"2px 6px",borderRadius:4,textTransform:"uppercase"}}>Aktuell</span>}
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
                        {step.optional&&<span style={{background:T.bg3,color:T.textMuted,fontSize:".65rem",fontWeight:700,padding:"2px 6px",borderRadius:4}}>Optional</span>}
                        <span style={{background:"#fef3c7",color:"#92400e",fontSize:".65rem",fontWeight:700,padding:"2px 6px",borderRadius:4}}>Prototyp</span>
                      </div>
                      <div style={{fontSize:".78rem",color:T.textMuted,lineHeight:1.5}}>{step.detail}</div>
                    </div>
                  </div>
                ))}
              </div>);
            })()}
          </div>
        </div>
      </div>)}
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
