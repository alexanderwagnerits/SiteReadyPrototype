import { useState, useCallback, useRef, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = (process.env.REACT_APP_SUPABASE_URL && process.env.REACT_APP_SUPABASE_ANON_KEY)
  ? createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_ANON_KEY)
  : null;

/* ═══ DATA ═══ */
const BRANCHEN = [
  { value:"elektro",label:"Elektroinstallationen",leistungen:["Elektroinstallationen","Stoerungsbehebung & Reparatur","Smart Home Systeme","Photovoltaik & Speicher","Beleuchtungstechnik","Notdienst 24/7"],stil:"professional" },
  { value:"installateur",label:"Installateur / Heizung / Sanitaer",leistungen:["Heizungsinstallation & Wartung","Sanitaerinstallationen","Rohrreinigung","Badsanierung","Waermepumpen","Notdienst 24/7"],stil:"professional" },
  { value:"maler",label:"Malerei & Anstrich",leistungen:["Innenmalerei","Fassadenanstrich","Tapezierarbeiten","Lackierarbeiten","Schimmelbehandlung","Farbberatung"],stil:"modern" },
  { value:"tischler",label:"Tischlerei",leistungen:["Moebel nach Mass","Kuechenbau","Innenausbau","Fenster & Tueren","Reparaturen","Restaurierung"],stil:"traditional" },
  { value:"fliesenleger",label:"Fliesenleger",leistungen:["Fliesenverlegung","Badsanierung","Natursteinarbeiten","Terrassenplatten","Abdichtungen","Reparaturen"],stil:"modern" },
  { value:"schlosser",label:"Schlosserei / Metallbau",leistungen:["Stahl- & Metallbau","Gelaender & Zaeune","Tore & Tueren","Schweissarbeiten","Reparaturen","Sonderanfertigungen"],stil:"professional" },
  { value:"dachdecker",label:"Dachdecker / Spengler",leistungen:["Dachsanierung","Dachdaemmung","Flachdach","Dachrinnen & Spenglerarbeiten","Dachfenster","Notdienst"],stil:"traditional" },
  { value:"zimmerei",label:"Zimmerei",leistungen:["Dachstuehle & Holzbau","Carports & Terrassen","Aufstockungen","Holzfassaden","Sanierung & Altholz","Sonderanfertigungen"],stil:"traditional" },
  { value:"maurer",label:"Maurer / Baumeister",leistungen:["Rohbau & Mauerwerk","Zu- & Umbauten","Sanierung & Renovierung","Fassadenarbeiten","Estricharbeiten","Abbrucharbeiten"],stil:"professional" },
  { value:"bodenleger",label:"Bodenleger / Parkett",leistungen:["Parkettverlegung","Laminat & Vinyl","Schleifen & Versiegeln","Teppichboden","Reparaturen","Bodenberatung"],stil:"modern" },
  { value:"glaser",label:"Glaser",leistungen:["Glasreparaturen","Isolierglas","Spiegel & Glasmoebel","Duschwaende","Glasfassaden","Notdienst"],stil:"modern" },
  { value:"gaertner",label:"Gaertner / Landschaftsbau",leistungen:["Gartengestaltung","Pflasterarbeiten","Bepflanzung & Pflege","Bewaesserungssysteme","Zaunbau","Baumschnitt & Pflege"],stil:"modern" },
  { value:"klima",label:"Klimatechnik / Lueftung",leistungen:["Klimaanlagen Installation","Lueftungsanlagen","Wartung & Service","Waermepumpen","Kuehltechnik","Notdienst"],stil:"professional" },
  { value:"reinigung",label:"Reinigung / Gebaeudeservice",leistungen:["Gebaeudereinigung","Fensterreinigung","Grundreinigung","Teppichreinigung","Fassadenreinigung","Winterdienst"],stil:"modern" },
  { value:"sonstige",label:"Sonstige Handwerksbranche",leistungen:[],stil:"professional" },
];
const BUNDESLAENDER=[{value:"wien",label:"Wien"},{value:"noe",label:"Niederoesterreich"},{value:"ooe",label:"Oberoesterreich"},{value:"stmk",label:"Steiermark"},{value:"sbg",label:"Salzburg"},{value:"tirol",label:"Tirol"},{value:"ktn",label:"Kaernten"},{value:"vbg",label:"Vorarlberg"},{value:"bgld",label:"Burgenland"}];
const OEFFNUNGSZEITEN=[{value:"mo-fr-8-17",label:"Mo-Fr: 08:00-17:00"},{value:"mo-fr-7-16",label:"Mo-Fr: 07:00-16:00"},{value:"mo-fr-8-18",label:"Mo-Fr: 08:00-18:00"},{value:"mo-sa-8-17",label:"Mo-Sa: 08:00-17:00"},{value:"mo-sa-8-12",label:"Mo-Fr: 08:00-17:00, Sa: 08:00-12:00"},{value:"vereinbarung",label:"Nach Vereinbarung"},{value:"custom",label:"Eigene Zeiten eingeben"}];
const UNTERNEHMENSFORMEN=[{value:"eu",label:"Einzelunternehmen (e.U.)"},{value:"einzelunternehmen",label:"Einzelunternehmen (nicht eingetragen)"},{value:"gmbh",label:"GmbH"},{value:"og",label:"OG"},{value:"kg",label:"KG"},{value:"ag",label:"AG"},{value:"verein",label:"Verein"},{value:"gesnbr",label:"GesbR"}];
const STYLES_MAP={
  professional:{label:"Professionell & serioes",desc:"Klare Linien, gedaempfte Farben",primary:"#0f2b5b",accent:"#2563eb",accentSoft:"rgba(37,99,235,0.07)",bg:"#f8fafc",cardBg:"#fff",text:"#0f172a",textMuted:"#64748b",textLight:"#94a3b8",borderColor:"#e2e8f0",font:"'Inter',system-ui,sans-serif",radius:"6px",radiusLg:"10px",heroGradient:"linear-gradient(160deg,#0f2b5b 0%,#1e40af 50%,#2563eb 100%)",heroOverlay:"radial-gradient(circle at 70% 20%,rgba(255,255,255,0.08) 0%,transparent 60%)",shadow:"0 1px 3px rgba(15,43,91,0.06)",badgeBg:"#dbeafe",badgeText:"#1e40af"},
  modern:{label:"Modern & frisch",desc:"Helle Akzente, frische Farbpalette",primary:"#065f46",accent:"#10b981",accentSoft:"rgba(16,185,129,0.07)",bg:"#f0fdf4",cardBg:"#fff",text:"#052e16",textMuted:"#4b7c6a",textLight:"#86b5a1",borderColor:"#d1fae5",font:"'DM Sans',system-ui,sans-serif",radius:"12px",radiusLg:"16px",heroGradient:"linear-gradient(135deg,#065f46 0%,#047857 40%,#10b981 100%)",heroOverlay:"radial-gradient(ellipse at 80% 30%,rgba(255,255,255,0.12) 0%,transparent 50%)",shadow:"0 1px 3px rgba(6,95,70,0.06)",badgeBg:"#d1fae5",badgeText:"#065f46"},
  traditional:{label:"Bodenstaendig & vertraut",desc:"Warme Toene, solider Auftritt",primary:"#78350f",accent:"#d97706",accentSoft:"rgba(217,119,6,0.07)",bg:"#fffbeb",cardBg:"#fff",text:"#451a03",textMuted:"#92713a",textLight:"#b8a070",borderColor:"#fde68a",font:"'Source Serif 4',Georgia,serif",radius:"4px",radiusLg:"8px",heroGradient:"linear-gradient(160deg,#78350f 0%,#92400e 50%,#b45309 100%)",heroOverlay:"radial-gradient(circle at 30% 80%,rgba(255,255,255,0.06) 0%,transparent 50%)",shadow:"0 1px 3px rgba(120,53,15,0.06)",badgeBg:"#fef3c7",badgeText:"#92400e"},
};
const STEPS=[{id:"basics",title:"Grunddaten",num:"01"},{id:"services",title:"Leistungen",num:"02"},{id:"contact",title:"Kontakt",num:"03"},{id:"firma",title:"Unternehmen",num:"04"},{id:"style",title:"Design",num:"05"}];
const INIT={firmenname:"",branche:"",brancheLabel:"",brancheCustom:"",leistungen:[],extraLeistung:"",adresse:"",plz:"",ort:"",bundesland:"",telefon:"",email:"",uid:"",oeffnungszeiten:"",oeffnungszeitenCustom:"",einsatzgebiet:"",kurzbeschreibung:"",unternehmensform:"",firmenbuchnummer:"",gisazahl:"",firmenbuchgericht:"",geschaeftsfuehrer:"",vorstand:"",aufsichtsrat:"",zvr_zahl:"",vertretungsorgane:"",gesellschafter:"",unternehmensgegenstand:"",liquidation:"",kammer_berufsrecht:"",aufsichtsbehoerde:"",facebook:"",instagram:"",linkedin:"",tiktok:"",notdienst:false,fotos:false,stil:"professional"};

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
      <button className="lp-hamburger" onClick={()=>setMenuOpen(o=>!o)} aria-label="Menue" style={{color:T.dark}}>
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
            Fuer Handwerker in Oesterreich
          </div>
          <h1 style={{fontSize:"clamp(2.6rem,4.5vw,4rem)",fontWeight:800,lineHeight:1.0,letterSpacing:"-.05em",color:T.dark,marginBottom:20}}>Deine Website<br/>in <span style={{background:"linear-gradient(135deg,#1d4ed8,#3b82f6)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>Minuten.</span></h1>
          <p style={{fontSize:"1.1rem",color:T.textSub,lineHeight:1.75,maxWidth:440,marginBottom:36}}>Mit Impressum nach ECG, DSGVO und Google-Indexierung. Bestehende Website importieren oder 10 Fragen beantworten. Fertig.</p>
          <div style={{display:"flex",gap:12,marginBottom:52}}>
            <button onClick={onStart} style={{padding:"14px 30px",borderRadius:8,fontSize:".98rem",fontWeight:700,border:"none",cursor:"pointer",background:T.dark,color:"#fff",fontFamily:T.font,letterSpacing:"-.01em",boxShadow:"0 2px 16px rgba(0,0,0,.14)"}}>Jetzt Website erstellen &rarr;</button>
            <a href="#how" style={{padding:"14px 22px",borderRadius:8,fontSize:".98rem",fontWeight:600,textDecoration:"none",color:T.dark,border:`1.5px solid ${T.bg3}`,background:"#fff",display:"inline-flex",alignItems:"center"}}>So funktionierts</a>
          </div>
          <div className="lp-hero-stats" style={{display:"flex",gap:40,paddingTop:28,borderTop:`1px solid ${T.bg3}`}}>
            {[{end:10,suffix:" Min",label:"Bis zur fertigen Website"},{end:18,suffix:"\u20AC",label:"Pro Monat, alles inklusive"},{end:120,suffix:"k+",label:"Zielgruppe in Oesterreich"}].map((s,i)=><Counter key={i} {...s}/>)}
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
        <H2 s={{maxWidth:420}}>Keine gute Option fuer Handwerksbetriebe.</H2>
        <Sub s={{marginBottom:36,maxWidth:400}}>Jede bestehende Loesung hat einen entscheidenden Haken.</Sub>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {[{n:"Linktree / Komi",p:"Gratis–5€",i:"Kein Google-Ranking. Kein Impressum."},{n:"Wix / Jimdo",p:"17–25€/Mo",i:"Stunden bis Tage. Hohe Lernkurve."},{n:"Agentur / Freelancer",p:"ab 1.500€",i:"Wochen Wartezeit. Zu teuer."},{n:"Nur Social Media",p:"Gratis",i:"Kein Google. Abmahnrisiko."}].map((c,i)=><div key={i} style={{padding:"18px 22px",background:"#fff",borderRadius:10,border:"1px solid rgba(0,0,0,.07)",display:"flex",justifyContent:"space-between",alignItems:"center",gap:16}}><div><div style={{fontWeight:700,fontSize:".92rem",color:T.dark,marginBottom:3}}>{c.n}</div><div style={{fontSize:".84rem",color:T.red,fontWeight:500}}>{c.i}</div></div><span style={{fontSize:".75rem",fontFamily:T.mono,color:T.textMuted,flexShrink:0,background:"#f7f8fa",padding:"4px 10px",borderRadius:6}}>{c.p}</span></div>)}
        </div>
      </div>
      <div>
        <div style={{background:"linear-gradient(135deg,#eff4ff 0%,#f0fdf4 100%)",borderRadius:14,padding:"40px 36px",border:"1.5px solid rgba(37,99,235,.12)"}}>
          <div style={{display:"inline-block",background:T.accent,color:"#fff",fontSize:".68rem",fontWeight:700,padding:"5px 12px",borderRadius:6,marginBottom:18,letterSpacing:".04em"}}>Die Loesung</div>
          <h3 style={{fontSize:"2rem",fontWeight:800,color:T.dark,marginBottom:10,letterSpacing:"-.04em"}}>SiteReady.at</h3>
          <p style={{fontSize:"1rem",color:T.textSub,lineHeight:1.75,marginBottom:24}}>Kein Builder. Ein Service. Du beantwortest Fragen, wir liefern die fertige Website.</p>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:28}}>
            {["Live-Vorschau vor Kauf","Impressum ECG-konform","DSGVO automatisch","SEO & Google-Index","SSL inklusive","Kein Branding","Website-Import","Self-Service-Portal","Eigene Domain moeglich","Oesterreich-spezifisch"].map(l=><span key={l} style={{fontSize:".75rem",padding:"6px 13px",borderRadius:6,fontWeight:600,background:"#fff",color:T.green,border:"1px solid rgba(22,163,74,.15)"}}>{"\u2713"} {l}</span>)}
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
      <H2>Fuenf Schritte. Null Aufwand.</H2>
    </div>
    <div className="lp-steps-grid" style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:16}}>
      {[{n:"01",i:"\uD83D\uDCCB",t:"Fragebogen",d:"Bestehende Website importieren oder 10 Fragen zu Branche, Kontakt und Stil beantworten."},{n:"02",i:"\uD83D\uDC41\uFE0F",t:"Live-Vorschau",d:"Ihre Website entsteht live im Browser – sichtbar noch vor der Bezahlung."},{n:"03",i:"\uD83D\uDCB3",t:"Bezahlen",d:"Sicher per Karte, EPS oder PayPal. Danach laeuft alles vollautomatisch."},{n:"04",i:"\uD83D\uDE80",t:"Sofort live",d:"SSL aktiv. Ihre Website ist innerhalb von Minuten erreichbar und fuer Google sichtbar."},{n:"05",i:"\u2699\uFE0F",t:"Anpassen (optional)",d:"Im Self-Service-Portal: Logo, Fotos und Custom Domain jederzeit selbst hinzufuegen."}].map((s,i)=><div key={i} style={{padding:"28px 22px",background:i===4?"#fafafa":"#f7f8fa",borderRadius:12,position:"relative",overflow:"hidden",border:i===4?"1px dashed rgba(0,0,0,.08)":"none"}}>
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
      <H2 s={{maxWidth:500}}>Keine Designentscheidung. Nur ein Gefuehl.</H2>
      <Sub s={{maxWidth:460}}>Wie soll Ihr Betrieb wirken? SiteReady waehlt das passende Design automatisch.</Sub>
    </div>
    <div className="lp-variants-grid" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}}>
      {[{t:"Professionell & serioees",d:"Klare Linien, gedaempfte Farben, serifenlos",g:"linear-gradient(160deg,#0f2b5b,#2563eb)",sub:"Elektriker, Installateure, Baumeister"},{t:"Modern & frisch",d:"Helle Akzente, leichtes Layout, frische Farbpalette",g:"linear-gradient(135deg,#065f46,#10b981)",sub:"Maler, Fliesenleger, Gaertner"},{t:"Bodenstaendig & vertraut",d:"Warme Toene, kraeftige Schrift, solider Auftritt",g:"linear-gradient(160deg,#78350f,#b45309)",sub:"Tischler, Zimmerer, Dachdecker"}].map((v,i)=><div key={i} style={{borderRadius:12,overflow:"hidden",background:"#fff",border:"1px solid rgba(0,0,0,.07)"}}>
        <div style={{background:v.g,padding:"44px 28px",color:"#fff",position:"relative",overflow:"hidden"}}><div style={{position:"absolute",inset:0,background:"radial-gradient(circle at 80% 20%,rgba(255,255,255,.1),transparent 50%)"}}/><h3 style={{fontSize:"1.1rem",fontWeight:700,marginBottom:6,position:"relative"}}>{v.t}</h3><p style={{fontSize:".8rem",opacity:.75,position:"relative"}}>{v.d}</p></div>
        <div style={{padding:"18px 28px",borderTop:"1px solid rgba(0,0,0,.05)"}}><p style={{fontSize:".84rem",color:T.textSub}}>{v.sub}</p></div>
      </div>)}
    </div>
  </Sec>

  {/* PRICING */}
  <Sec id="preise">
    <div style={{marginBottom:64}}>
      <Label>Preise</Label>
      <H2>Ein Paket. Alles drin.</H2>
      <Sub s={{maxWidth:440}}>Kein Tarifwirrwarr. Voller Leistungsumfang. 12 Monate Mindestlaufzeit.</Sub>
    </div>
    <div className="lp-pricing-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,maxWidth:820,margin:"0 auto"}}>
      {/* Aktuelles Paket */}
      <div style={{background:"#fff",borderRadius:14,padding:"40px 32px",position:"relative",border:"2px solid rgba(37,99,235,.2)",boxShadow:"0 8px 40px rgba(37,99,235,.08)"}}>
        <span style={{position:"absolute",top:-13,left:"50%",transform:"translateX(-50%)",background:T.dark,color:"#fff",fontSize:".68rem",fontWeight:700,padding:"5px 16px",borderRadius:100,whiteSpace:"nowrap"}}>Aktuelles Angebot</span>
        <div style={{fontSize:".95rem",fontWeight:700,color:T.dark,marginBottom:2}}>SiteReady</div>
        <div style={{fontSize:".8rem",color:T.textMuted,marginBottom:16}}>Monatliches Abo</div>
        <div style={{fontSize:"2.8rem",fontWeight:800,color:T.dark,fontFamily:T.mono,lineHeight:1,letterSpacing:"-.04em",marginBottom:4}}>{"\u20AC"}18<span style={{fontSize:".95rem",fontWeight:500,color:T.textMuted,fontFamily:T.font}}>/Mo</span></div>
        <div style={{fontSize:".78rem",color:T.textMuted,marginBottom:28}}>12 Monate Mindestlaufzeit &middot; {"\u20AC"}216 / Jahr</div>
        <div style={{display:"flex",flexDirection:"column",gap:7,marginBottom:16}}>
          {["Subdomain sofort live","Kein Branding auf Ihrer Website","Impressum (ECG) - anwaltl. geprueft","DSGVO - anwaltl. geprueft","SEO & Google-Indexierung","Google Maps","Notdienst / 24h Badge","Analytics-Dashboard","Live-Vorschau vor Bezahlung","Website-Import (optional)","Branchenspezifische Fotos"].map(f=><div key={f} style={{display:"flex",alignItems:"center",gap:10,fontSize:".84rem",color:T.text}}><span style={{color:T.green,fontWeight:700,fontSize:".82rem"}}>{"\u2713"}</span>{f}</div>)}
        </div>
        <div style={{borderTop:`1px solid ${T.bg3}`,paddingTop:14,marginBottom:16}}>
          <div style={{fontSize:".7rem",fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:".1em",marginBottom:10}}>Self-Service-Portal (nach Kauf)</div>
          {["Logo hochladen (optional)","Eigene Fotos hochladen (optional)","Custom Domain verbinden (optional)"].map(f=><div key={f} style={{display:"flex",alignItems:"center",gap:10,fontSize:".84rem",color:T.textSub,marginBottom:7}}><span style={{color:T.accent,fontWeight:700,fontSize:".82rem"}}>{"\u2713"}</span>{f}</div>)}
        </div>
        <button onClick={onStart} style={{width:"100%",padding:14,borderRadius:8,fontSize:".92rem",fontWeight:700,cursor:"pointer",fontFamily:T.font,border:"none",background:T.dark,color:"#fff"}}>Jetzt starten</button>
      </div>
      {/* Coming Soon */}
      <div style={{background:"#fafafa",borderRadius:14,padding:"40px 32px",position:"relative",border:"1px solid rgba(124,58,237,.15)"}}>
        <span style={{position:"absolute",top:-13,left:"50%",transform:"translateX(-50%)",background:"linear-gradient(135deg,#7c3aed,#a855f7)",color:"#fff",fontSize:".68rem",fontWeight:700,padding:"5px 16px",borderRadius:100,whiteSpace:"nowrap",letterSpacing:".04em"}}>Coming Soon</span>
        <div style={{fontSize:".95rem",fontWeight:700,color:T.dark,marginBottom:2}}>SiteReady Premium</div>
        <div style={{fontSize:".8rem",color:T.textMuted,marginBottom:16}}>Alles aus Standard + mehr</div>
        <div style={{fontSize:"2.8rem",fontWeight:800,color:T.textMuted,fontFamily:T.mono,lineHeight:1,letterSpacing:"-.04em",marginBottom:4,filter:"blur(6px)",userSelect:"none"}}>{"\u20AC"}?<span style={{fontSize:".95rem",fontWeight:500,fontFamily:T.font}}>/Mo</span></div>
        <div style={{fontSize:".78rem",color:T.textMuted,marginBottom:28}}>Kommt 2026 &middot; Jetzt vormerken</div>
        <div style={{display:"flex",flexDirection:"column",gap:7,marginBottom:28}}>
          {["Alle Features aus Standard","Mehrsprachige Website (DE/EN)","Social Media Paket","Kalender & Buchungssystem","Erweiterte Analytics"].map(f=><div key={f} style={{display:"flex",alignItems:"center",gap:10,fontSize:".84rem",color:T.textMuted}}><span style={{color:"#a855f7",fontWeight:700,fontSize:".84rem"}}>{"\u23F3"}</span>{f}</div>)}
        </div>
        <button disabled style={{width:"100%",padding:14,borderRadius:8,fontSize:".92rem",fontWeight:700,cursor:"not-allowed",fontFamily:T.font,border:"1.5px solid rgba(124,58,237,.2)",background:"transparent",color:"#a855f7",opacity:.7}}>Benachrichtigung erhalten</button>
      </div>
    </div>
    <p style={{textAlign:"center",fontSize:".82rem",color:T.textMuted,maxWidth:500,margin:"28px auto 0",lineHeight:1.7}}>12 Monate Mindestlaufzeit. Kuendigbar nach Ablauf. Preise inkl. MwSt.</p>
  </Sec>

  {/* COMPARISON */}
  <Sec id="vergleich" alt>
    <div style={{marginBottom:48}}>
      <Label>Vergleich</Label>
      <H2>SiteReady vs. der Rest.</H2>
    </div>
    <div className="lp-compare" style={{borderRadius:14,overflow:"hidden",border:"1px solid rgba(0,0,0,.08)",background:"#fff"}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:".85rem"}}><thead><tr>{["Feature","SiteReady.at","Wix ADI","Jimdo","Linktree"].map((h,j)=><th key={h} style={{textAlign:"left",padding:"16px 22px",fontWeight:700,fontSize:".72rem",color:j===1?T.accent:T.textMuted,textTransform:"uppercase",letterSpacing:".1em",background:j===1?T.accentLight:"#f7f8fa",borderBottom:"1px solid rgba(0,0,0,.07)"}}>{h}</th>)}</tr></thead><tbody>{[["Zeit bis live","Minuten","30-60 Min","60+ Min","5 Min"],["Impressum ECG","\u2713 Auto","\u2717","\u2717","\u2717"],["DSGVO","\u2713 Auto","\u2717","\u2717","\u2717"],["Google-Index","\u2713 Auto","Manuell","Manuell","\u2717"],["Live-Vorschau","\u2713 Vor Bezahlung","Teilweise","\u2717","\u2717"],["Lernkurve","Keine","Mittel","Mittel","Gering"],["Anwaltl. geprueft","\u2713 Ja","\u2717","\u2717","\u2717"],["Einstiegspreis","Ab \u20AC18/Mo","\u20AC17/Mo","\u20AC11/Mo","Gratis/\u20AC5"]].map((row,i)=><tr key={i} style={{background:i%2===0?"#fff":"#fafafa"}}>{row.map((c,j)=><td key={j} style={{padding:"13px 22px",borderBottom:"1px solid rgba(0,0,0,.04)",color:j===0?T.dark:j===1?T.accent:T.textMuted,fontWeight:j<=1?600:400,background:j===1?"rgba(37,99,235,.02)":"transparent"}}>{c}</td>)}</tr>)}</tbody></table>
    </div>
  </Sec>

  {/* WHY NOW */}
  <Sec>
    <div style={{marginBottom:52}}>
      <Label>Warum jetzt</Label>
      <H2>Der perfekte Zeitpunkt.</H2>
    </div>
    <div className="lp-why-grid" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}}>
      {[{i:"\uD83D\uDCB0",t:"Vollautomatisch",d:"Von der Eingabe bis zur fertigen Website – kein manueller Schritt."},{i:"\u2696\uFE0F",t:"DSGVO-Bewusstsein",d:"Abmahnwellen haben das Thema gebracht."},{i:"\uD83D\uDCF1",t:"Link-in-Bio gesaettigt",d:"Loest das SEO-Problem nicht."},{i:"\uD83C\uDDE6\uD83C\uDDF9",t:"Markt unbesetzt",d:"ECG + DSGVO + SEO fuer AT."},{i:"\uD83C\uDF10",t:"Domain gesichert",d:"siteready.at reserviert."},{i:"\uD83D\uDE80",t:"Bootstrapped",d:"Break-even ab Tag 1 moeglich."}].map((c,i)=><div key={i} style={{background:"#f7f8fa",borderRadius:10,padding:"24px 22px"}}><div style={{fontSize:"1.3rem",marginBottom:12}}>{c.i}</div><h3 style={{fontSize:".92rem",fontWeight:700,color:T.dark,marginBottom:5}}>{c.t}</h3><p style={{fontSize:".82rem",color:T.textMuted,lineHeight:1.6}}>{c.d}</p></div>)}
    </div>
  </Sec>

  {/* CTA */}
  <section className="lp-cta-section" style={{padding:"120px 0",textAlign:"center",position:"relative",overflow:"hidden",background:T.dark}}>
    <div style={{position:"absolute",top:"-40%",left:"15%",width:600,height:600,borderRadius:"50%",background:"radial-gradient(circle,rgba(37,99,235,.18) 0%,transparent 70%)",pointerEvents:"none"}}/>
    <W s={{position:"relative",zIndex:1}}>
      <h2 style={{fontSize:"clamp(2.2rem,4.5vw,3.4rem)",fontWeight:800,lineHeight:1.05,letterSpacing:"-.04em",color:"#fff",marginBottom:18}}>Bereit fuer deine Website?</h2>
      <p style={{fontSize:"1.05rem",color:"rgba(255,255,255,.5)",marginBottom:40,maxWidth:420,margin:"0 auto 40px",lineHeight:1.7}}>10 Fragen. Wenige Minuten. Fertig.</p>
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
  const sub=data.firmenname?data.firmenname.toLowerCase().replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,""):"firmenname";
  const handleOrder=async()=>{
    setSaving(true);setSaveErr("");
    if(!supabase){setSaveErr("Konfigurationsfehler – bitte Administrator kontaktieren.");setSaving(false);return;}
    // 1. Bestellung in Supabase speichern (UUID client-seitig generieren)
    const orderId=crypto.randomUUID();
    const{error}=await supabase.from("orders").insert({
      id:orderId,
      firmenname:data.firmenname,branche:data.branche,branche_label:data.brancheLabel,
      kurzbeschreibung:data.kurzbeschreibung,bundesland:data.bundesland,
      leistungen:data.leistungen,extra_leistung:data.extraLeistung,notdienst:data.notdienst,
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
    const inserted={id:orderId};
    // 2. Stripe Checkout Session erstellen
    const resp=await fetch("/api/create-checkout",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({orderId:inserted.id,firmenname:data.firmenname,email:data.email})
    });
    const json=await resp.json();
    setSaving(false);
    if(json.error){setSaveErr("Zahlung: "+json.error);return;}
    // 3. E-Mail merken, zu Stripe weiterleiten
    if(data.email)localStorage.setItem("sr_pending_email",data.email);
    window.location.href=json.url;
  };
  const included=[
    {t:"Subdomain sofort live",d:`${sub}.siteready.at – sofort erreichbar.`},
    {t:"Texte individuell formuliert",d:"Passend zu Ihrer Branche und Ihrem Betrieb."},
    {t:"Impressum (ECG) inklusive",d:"Anwaltlich geprueft und eingebaut."},
    {t:"DSGVO inklusive",d:"Anwaltlich geprueft und eingebaut."},
    {t:"SEO & Google-Indexierung",d:"Ihre Website ist fuer Google sichtbar sobald sie live geschaltet wird."},
    ...(data.fotos?[{t:"Branchenfotos als Platzhalter",d:"Passende Fotos fuer Ihre Branche bereits eingebaut."}]:[]),
  ];
  const portal=[
    {t:"Logo hochladen",d:"Wird oben in der Navigation angezeigt."},
    {t:"Bilder hochladen",d:"Eigene Fotos ersetzen die Platzhalter auf Ihrer Website."},
    {t:"Daten jederzeit anpassen",d:"Adresse, Telefon, Leistungen – aenderbar wenn sich etwas aendert."},
    {t:"Custom Domain verbinden",d:"z.B. www.ihre-firma.at statt der Subdomain."},
  ];
  return(<div className="sp-page" style={{height:"100vh",background:"#fff",fontFamily:T.font,display:"flex",flexDirection:"column",overflow:"hidden"}}><style>{css}</style>
    {/* Top bar */}
    <div className="sp-topbar" style={{padding:"0 40px",borderBottom:`1px solid ${T.bg3}`,display:"flex",alignItems:"center",justifyContent:"space-between",height:60,flexShrink:0}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}><img src="/icon.png" alt="SR" style={{height:22}}/><span style={{fontSize:".95rem",fontWeight:800,color:T.dark,letterSpacing:"-.02em"}}>SiteReady</span></div>
      <button onClick={onBack} style={{padding:"8px 18px",border:`2px solid ${T.bg3}`,borderRadius:T.rSm,background:"#fff",color:T.text,cursor:"pointer",fontSize:".82rem",fontWeight:600,fontFamily:T.font}}>{"\u2190"} Zurueck zur Vorschau</button>
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
              <div style={{fontSize:".72rem",fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:".12em",marginBottom:10}}>Monatliches Abo – Inklusive</div>
              <div style={{display:"flex",alignItems:"baseline",gap:6}}>
                <span style={{fontSize:"2.6rem",fontWeight:800,color:T.dark,fontFamily:T.mono,letterSpacing:"-.04em",lineHeight:1}}>{"\u20AC"}18</span>
                <span style={{fontSize:".9rem",color:T.textMuted,fontWeight:500}}>/Monat</span>
              </div>
              <div style={{fontSize:".78rem",color:T.textMuted,marginTop:4}}>12 Monate Mindestlaufzeit &middot; {"\u20AC"}216 / Jahr</div>
            </div>
            {saved
              ?<div style={{display:"flex",alignItems:"center",gap:8,padding:"12px 20px",background:T.greenLight,borderRadius:T.rSm,border:"1px solid rgba(22,163,74,.2)"}}>
                <span style={{color:T.green,fontWeight:700,fontSize:".88rem"}}>{"\u2713"} Bestellung gespeichert</span>
              </div>
              :<button onClick={handleOrder} disabled={saving} style={{padding:"12px 24px",border:"none",borderRadius:T.rSm,background:saving?"#94a3b8":T.dark,color:"#fff",fontSize:".88rem",fontWeight:700,fontFamily:T.font,cursor:saving?"wait":"pointer",whiteSpace:"nowrap",transition:"background .2s"}}>
                {saving?"Wird gespeichert...":"Jetzt kaufen \u2192"}
              </button>}
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
function Field({label,value,onChange,placeholder,type="text",rows,hint}){const[f,setF]=useState(false);const base={width:"100%",padding:"13px 16px",border:f?`2px solid ${T.accent}`:`2px solid ${T.bg3}`,borderRadius:T.rSm,fontSize:14,fontFamily:T.font,background:T.white,color:T.dark,outline:"none",transition:"all .2s",boxShadow:f?`0 0 0 4px ${T.accentGlow}`:"none",boxSizing:"border-box"};return(<div style={{marginBottom:20}}><label style={{display:"block",marginBottom:7,fontSize:".78rem",fontWeight:700,color:f?T.accent:T.textSub,transition:"color .2s",letterSpacing:".03em"}}>{label}</label>{rows?<textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={rows} onFocus={()=>setF(true)} onBlur={()=>setF(false)} style={{...base,resize:"vertical",lineHeight:1.5}}/>:<input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} onFocus={()=>setF(true)} onBlur={()=>setF(false)} style={base}/>}{hint&&<div style={{marginTop:5,fontSize:".72rem",color:T.textMuted}}>{hint}</div>}</div>)}

function Dropdown({label,value,onChange,options,placeholder,hint}){const[f,setF]=useState(false);return(<div style={{marginBottom:20}}><label style={{display:"block",marginBottom:7,fontSize:".78rem",fontWeight:700,color:f?T.accent:T.textSub,letterSpacing:".03em"}}>{label}</label><select value={value} onChange={e=>onChange(e.target.value)} onFocus={()=>setF(true)} onBlur={()=>setF(false)} style={{width:"100%",padding:"13px 16px",border:f?`2px solid ${T.accent}`:`2px solid ${T.bg3}`,borderRadius:T.rSm,fontSize:14,fontFamily:T.font,background:T.white,color:value?T.dark:T.textMuted,outline:"none",transition:"all .2s",boxShadow:f?`0 0 0 4px ${T.accentGlow}`:"none",boxSizing:"border-box",cursor:"pointer",appearance:"none",backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M3 5l3 3 3-3' fill='none' stroke='%238b919e' stroke-width='1.5'/%3E%3C/svg%3E\")",backgroundRepeat:"no-repeat",backgroundPosition:"right 16px center"}}><option value="" disabled>{placeholder||"Bitte waehlen"}</option>{options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}</select>{hint&&<div style={{marginTop:5,fontSize:".72rem",color:T.textMuted}}>{hint}</div>}</div>)}

function Checklist({label,options,selected,onChange,hint}){const toggle=i=>{if(selected.includes(i))onChange(selected.filter(s=>s!==i));else onChange([...selected,i])};return(<div style={{marginBottom:20}}><label style={{display:"block",marginBottom:8,fontSize:".78rem",fontWeight:700,color:T.textSub,letterSpacing:".03em"}}>{label}</label><div style={{display:"flex",flexWrap:"wrap",gap:8}}>{options.map(o=>{const on=selected.includes(o);return(<button key={o} onClick={()=>toggle(o)} style={{padding:"10px 16px",borderRadius:T.rSm,border:on?`2px solid ${T.accent}`:`2px solid ${T.bg3}`,background:on?T.accentLight:T.white,color:on?T.accent:T.text,fontSize:13,fontWeight:on?600:400,cursor:"pointer",transition:"all .15s",display:"flex",alignItems:"center",gap:7,fontFamily:T.font}}><span style={{width:18,height:18,borderRadius:5,border:on?"none":`2px solid ${T.bg3}`,background:on?T.accent:T.white,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"#fff",flexShrink:0}}>{on?"\u2713":""}</span>{o}</button>)})}</div>{hint&&<div style={{marginTop:6,fontSize:".72rem",color:T.textMuted}}>{hint}</div>}</div>)}

function Toggle({label,checked,onChange,desc}){return(<label style={{display:"flex",alignItems:"center",gap:14,cursor:"pointer",padding:"16px 18px",borderRadius:T.rSm,border:`2px solid ${checked?"rgba(37,99,235,.15)":T.bg3}`,background:checked?T.accentLight:T.white,transition:"all .2s",marginBottom:20}}><div style={{width:42,height:24,borderRadius:12,background:checked?T.accent:T.bg3,transition:"background .2s",position:"relative",flexShrink:0}}><div style={{width:20,height:20,borderRadius:"50%",background:"#fff",position:"absolute",top:2,left:checked?20:2,transition:"left .2s",boxShadow:"0 1px 4px rgba(0,0,0,.15)"}}/></div><input type="checkbox" checked={checked} onChange={e=>onChange(e.target.checked)} style={{display:"none"}}/><div><span style={{fontSize:".88rem",fontWeight:600,color:T.dark}}>{label}</span>{desc&&<div style={{fontSize:".75rem",color:T.textMuted,marginTop:2}}>{desc}</div>}</div></label>)}

function StylePicker({value,onChange}){return(<div style={{display:"flex",flexDirection:"column",gap:12}}>{Object.entries(STYLES_MAP).map(([key,s])=>{const on=value===key;return(<button key={key} onClick={()=>onChange(key)} style={{display:"flex",alignItems:"center",gap:16,padding:"18px 20px",border:on?`2px solid ${T.accent}`:`2px solid ${T.bg3}`,borderRadius:T.r,background:on?T.accentLight:T.white,cursor:"pointer",textAlign:"left",transition:"all .25s",fontFamily:T.font,boxShadow:on?`0 0 0 4px ${T.accentGlow}`:"none"}}><div style={{width:52,height:52,borderRadius:12,background:s.heroGradient,flexShrink:0}}/><div style={{flex:1}}><div style={{fontWeight:700,fontSize:".95rem",color:T.dark,marginBottom:3}}>{s.label}</div><div style={{fontSize:".8rem",color:T.textMuted}}>{s.desc}</div></div>{on&&<div style={{width:28,height:28,borderRadius:"50%",background:T.accent,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,flexShrink:0}}>{"\u2713"}</div>}</button>)})}</div>)}

/* ═══ PREVIEW (unchanged) ═══ */
function Preview({d,compact}){const s=STYLES_MAP[d.stil]||STYLES_MAP.professional;const extraItems=d.extraLeistung?d.extraLeistung.split("\n").filter(l=>l.trim()):[];const allItems=[...(d.leistungen||[]),...extraItems];const hasContact=d.adresse||d.telefon||d.email;const px=compact?"20px":"28px";const adressFull=[d.adresse,[d.plz,d.ort].filter(Boolean).join(" ")].filter(Boolean).join(", ");const zeit=d.oeffnungszeiten==="custom"?d.oeffnungszeitenCustom:(OEFFNUNGSZEITEN.find(o=>o.value===d.oeffnungszeiten)?.label||"");return(<div style={{fontFamily:s.font,background:s.bg,color:s.text,minHeight:"100%",fontSize:"14px",lineHeight:1.65,overflowY:"auto",transition:"background 0.4s"}}><div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:`10px ${px}`,background:s.cardBg,borderBottom:`1px solid ${s.borderColor}`,position:"sticky",top:0,zIndex:10}}><div style={{fontWeight:700,fontSize:compact?"13px":"15px",color:s.primary}}>{d.firmenname||"Firmenname"}</div><div style={{display:"flex",gap:compact?"12px":"20px",fontSize:compact?"10px":"12px",color:s.textMuted}}><span>Leistungen</span><span>Ueber uns</span><span>Kontakt</span></div></div><div style={{background:s.heroGradient,position:"relative",overflow:"hidden",padding:compact?"32px 20px 28px":"48px 28px 44px",color:"#fff"}}><div style={{position:"absolute",inset:0,background:s.heroOverlay}}/><div style={{position:"relative",zIndex:1,display:"flex",gap:"20px",alignItems:"center"}}><div style={{flex:1}}>{d.notdienst&&<div style={{display:"inline-block",padding:"3px 10px",background:"rgba(255,255,255,0.18)",borderRadius:"20px",fontSize:"10px",fontWeight:600,letterSpacing:"0.05em",textTransform:"uppercase",marginBottom:"12px"}}>{"\u26A1"} 24h Notdienst</div>}<h1 style={{fontSize:compact?"20px":"26px",fontWeight:700,margin:"0 0 8px",letterSpacing:"-0.025em",lineHeight:1.15}}>{d.firmenname||"Ihr Firmenname"}</h1><p style={{margin:"0 0 4px",opacity:0.85,fontSize:compact?"12px":"14px",fontWeight:500}}>{(d.branche==="sonstige"?d.brancheCustom:d.brancheLabel)||"Ihre Branche"}{d.einsatzgebiet?` \u00B7 ${d.einsatzgebiet}`:""}</p>{d.kurzbeschreibung&&<p style={{margin:"12px 0 0",opacity:0.75,fontSize:compact?"11px":"13px",lineHeight:1.55}}>{d.kurzbeschreibung}</p>}{d.telefon&&<div style={{marginTop:"16px",display:"inline-flex",alignItems:"center",gap:"8px",background:"rgba(255,255,255,0.15)",borderRadius:s.radius,padding:"8px 16px",fontSize:"13px",fontWeight:600}}>{"\uD83D\uDCDE"} {d.telefon}</div>}</div>{d.fotos&&!compact&&<div style={{flex:1,minHeight:"160px",background:"rgba(255,255,255,0.1)",borderRadius:s.radius,border:"1.5px dashed rgba(255,255,255,0.3)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:6}}><span style={{fontSize:"2rem"}}>📷</span><span style={{fontSize:"10px",fontWeight:600,letterSpacing:".06em",textTransform:"uppercase",opacity:.6}}>Hero-Foto</span></div>}</div></div><div style={{padding:`24px ${px} 20px`}}><div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"14px"}}><h2 style={{fontSize:compact?"15px":"18px",fontWeight:700,color:s.primary,margin:0}}>Unsere Leistungen</h2><div style={{flex:1,height:"1px",background:s.borderColor}}/></div>{allItems.length>0?(<div style={{display:"grid",gridTemplateColumns:compact?"1fr":"1fr 1fr",gap:"8px"}}>{allItems.map((l,i)=>(<div key={i} style={{background:s.cardBg,border:`1px solid ${s.borderColor}`,borderRadius:s.radius,padding:"11px 13px",display:"flex",alignItems:"flex-start",gap:"10px",boxShadow:s.shadow,fontSize:"12px"}}><div style={{width:"20px",height:"20px",borderRadius:s.radius,background:s.accentSoft,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:"9px",color:s.accent,fontWeight:700}}>{String(i+1).padStart(2,"0")}</div><span style={{fontWeight:500}}>{l}</span></div>))}</div>):(<div style={{background:s.cardBg,border:`2px dashed ${s.borderColor}`,borderRadius:s.radiusLg,padding:"24px",textAlign:"center",color:s.textLight,fontSize:"12px"}}>Ihre Leistungen erscheinen hier</div>)}</div>{d.fotos&&<div style={{padding:`0 ${px} 12px`,display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px"}}>{[1,2].map(i=><div key={i} style={{height:compact?"80px":"110px",background:`linear-gradient(135deg,${s.accentSoft},${s.borderColor})`,borderRadius:s.radius,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4,border:`1px dashed ${s.borderColor}`}}><span style={{fontSize:"1.1rem"}}>📷</span><span style={{fontSize:"9px",color:s.textLight,fontWeight:600,textTransform:"uppercase",letterSpacing:".05em"}}>Foto {i}</span></div>)}</div>}<div style={{padding:`0 ${px} 24px`}}><div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"14px"}}><h2 style={{fontSize:compact?"15px":"18px",fontWeight:700,color:s.primary,margin:0}}>Ueber uns</h2><div style={{flex:1,height:"1px",background:s.borderColor}}/></div><div style={{background:s.cardBg,borderRadius:s.radiusLg,padding:"18px 20px",boxShadow:s.shadow,borderLeft:`3px solid ${s.accent}`}}><p style={{margin:0,color:s.textMuted,fontSize:"12px",lineHeight:1.7}}>{d.firmenname?`Dieser Text wird individuell fuer ${d.firmenname} generiert.`:"Hier entsteht Ihr individueller Text."}</p><div style={{marginTop:"10px",display:"inline-block",padding:"3px 9px",borderRadius:"20px",background:s.badgeBg,color:s.badgeText,fontSize:"9px",fontWeight:600}}>Wird nach Bestellung generiert</div></div>{!compact&&d.fotos&&<div style={{marginTop:10,height:70,background:`linear-gradient(135deg,${s.accentSoft},${s.borderColor})`,borderRadius:s.radius,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4,border:`1px dashed ${s.borderColor}`}}><span style={{fontSize:"1.1rem"}}>👤</span><span style={{fontSize:"9px",color:s.textLight,fontWeight:600,textTransform:"uppercase",letterSpacing:".05em"}}>Ihr Teamfoto</span></div>}</div>{hasContact&&(<div style={{margin:`0 ${px} 24px`,padding:"20px",background:s.cardBg,borderRadius:s.radiusLg,boxShadow:s.shadow,border:`1px solid ${s.borderColor}`}}><h2 style={{fontSize:compact?"15px":"18px",fontWeight:700,color:s.primary,margin:"0 0 14px"}}>Kontakt</h2><div style={{display:"grid",gridTemplateColumns:compact?"1fr":"1fr 1fr",gap:"8px"}}>{[{icon:"\uD83D\uDCCD",label:"Adresse",value:adressFull},{icon:"\uD83D\uDCDE",label:"Telefon",value:d.telefon},{icon:"\u2709\uFE0F",label:"E-Mail",value:d.email},{icon:"\uD83D\uDD50",label:"Oeffnungszeiten",value:zeit}].filter(x=>x.value).map((x,i)=>(<div key={i} style={{padding:"10px 12px",borderRadius:s.radius,background:s.accentSoft,fontSize:"11px"}}><div style={{fontSize:"9px",color:s.textMuted,textTransform:"uppercase",letterSpacing:"0.05em",fontWeight:600,marginBottom:"3px"}}>{x.icon} {x.label}</div><div style={{fontWeight:500,whiteSpace:"pre-line",lineHeight:1.5}}>{x.value}</div></div>))}</div></div>)}<div style={{background:s.primary,color:"#fff",padding:`20px ${px}`,fontSize:"10px"}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:"12px"}}><div><div style={{fontWeight:700,fontSize:"13px",marginBottom:"3px"}}>{d.firmenname||"Firmenname"}</div><div style={{opacity:0.7}}>{adressFull}</div></div><div style={{textAlign:"right",opacity:0.7}}>{d.telefon&&<div>{d.telefon}</div>}{d.email&&<div>{d.email}</div>}</div></div><div style={{borderTop:"1px solid rgba(255,255,255,0.15)",paddingTop:"10px",opacity:0.6,fontSize:"9px"}}>{(d.unternehmensform||d.firmenbuchnummer||d.uid)&&<div style={{marginBottom:5,lineHeight:1.6,opacity:.8}}>{d.unternehmensform&&<span>{d.unternehmensform} &nbsp;</span>}{d.uid&&<span>UID: {d.uid} &nbsp;</span>}{d.firmenbuchnummer&&<span>FN: {d.firmenbuchnummer} &nbsp;</span>}{d.firmenbuchgericht&&<span>{d.firmenbuchgericht} &nbsp;</span>}{d.gisazahl&&<span>GISA: {d.gisazahl}</span>}</div>}<div style={{display:"flex",justifyContent:"space-between"}}><span>Impressum | Datenschutz</span><span>SiteReady.at</span></div></div></div></div>)}

/* ═══ QUESTIONNAIRE (unified light premium) ═══ */
function Questionnaire({data,setData,onComplete,onBack}){
  const[step,setStep]=useState(0);const ref=useRef(null);const[isMobile]=useState(typeof window!=="undefined"&&window.innerWidth<768);const[showPreview,setShowPreview]=useState(false);const[showImport,setShowImport]=useState(true);const[importUrl,setImportUrl]=useState("");const[importLoading,setImportLoading]=useState(false);const[importErr,setImportErr]=useState("");const doImport=async()=>{if(!importUrl.trim())return;setImportLoading(true);setImportErr("");try{const r=await fetch("/api/import-website",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({url:importUrl})});const j=await r.json();if(j.error){setImportErr(j.error);setImportLoading(false);return;}const b=j.branche?BRANCHEN.find(x=>x.value===j.branche):null;const allLeistungen=Array.isArray(j.leistungen)?j.leistungen:[];setData(d=>({...d,firmenname:j.firmenname||d.firmenname,telefon:j.telefon||d.telefon,email:j.email||d.email,plz:j.plz||d.plz,ort:j.ort||d.ort,adresse:j.adresse||d.adresse,kurzbeschreibung:j.kurzbeschreibung||d.kurzbeschreibung,bundesland:j.bundesland||d.bundesland,unternehmensform:j.unternehmensform||d.unternehmensform,uid:j.uid||d.uid,firmenbuchnummer:j.firmenbuchnummer||d.firmenbuchnummer,gisazahl:j.gisazahl||d.gisazahl,firmenbuchgericht:j.firmenbuchgericht||d.firmenbuchgericht,facebook:j.facebook||d.facebook,instagram:j.instagram||d.instagram,linkedin:j.linkedin||d.linkedin,tiktok:j.tiktok||d.tiktok,...(b?{branche:b.value,brancheLabel:b.label,stil:b.stil,leistungen:allLeistungen.length>0?allLeistungen:d.leistungen,extraLeistung:""}:{leistungen:allLeistungen.length>0?allLeistungen:d.leistungen})}));setImportLoading(false);setShowImport(false);}catch(e){setImportErr("Verbindungsfehler: "+e.message);setImportLoading(false);}};
const up=useCallback(k=>v=>setData(d=>({...d,[k]:v})),[setData]);const go=n=>{setStep(n);if(ref.current)ref.current.scrollTop=0};const pct=((step+1)/STEPS.length)*100;const selectedBranche=BRANCHEN.find(b=>b.value===data.branche);const brancheLeistungen=selectedBranche?selectedBranche.leistungen:[];const onBrancheChange=val=>{const b=BRANCHEN.find(x=>x.value===val);setData(d=>({...d,branche:val,brancheLabel:b?b.label:"",brancheCustom:"",stil:b?b.stil:d.stil,leistungen:[],extraLeistung:""}))};
  const pages=[<><Field label="Firmenname" value={data.firmenname} onChange={up("firmenname")} placeholder="z.B. Elektro Mueller GmbH"/><Dropdown label="Branche" value={data.branche} onChange={onBrancheChange} options={BRANCHEN} placeholder="Branche waehlen" hint="Leistungen und Stil werden vorgeschlagen"/>{data.branche==="sonstige"&&<Field label="Ihre Branche" value={data.brancheCustom} onChange={up("brancheCustom")} placeholder="z.B. Spenglerei, Stuckateur, ..."/>}<Field label="Kurzbeschreibung" value={data.kurzbeschreibung} onChange={up("kurzbeschreibung")} placeholder="Seit 15 Jahren Ihr zuverlaessiger Partner." rows={2} hint="Optional"/><Dropdown label="Bundesland" value={data.bundesland} onChange={v=>{up("bundesland")(v);const bl=BUNDESLAENDER.find(b=>b.value===v);up("einsatzgebiet")(bl?bl.label:"")}} options={BUNDESLAENDER} placeholder="Bundesland waehlen"/></>,<>{brancheLeistungen.length>0?(<Checklist label="Leistungen auswaehlen" options={[...new Set([...brancheLeistungen,...(data.leistungen||[])])]} selected={data.leistungen} onChange={up("leistungen")} hint="Waehlen Sie Ihre Leistungen"/>):(<Field label="Ihre Leistungen (eine pro Zeile)" value={data.extraLeistung} onChange={up("extraLeistung")} placeholder={"Leistung 1\nLeistung 2\nLeistung 3"} rows={6} hint="3-6 Leistungen"/>)}{brancheLeistungen.length>0&&<Field label="Zusaetzliche Leistung (optional)" value={data.extraLeistung} onChange={up("extraLeistung")} placeholder="z.B. Beratung, Planung, ..."/>}<Toggle label="24h Notdienst" checked={data.notdienst} onChange={up("notdienst")} desc="Wird prominent angezeigt"/></>,<><Field label="Strasse & Hausnummer" value={data.adresse} onChange={up("adresse")} placeholder="Mariahilfer Strasse 45/3"/><div style={{display:"grid",gridTemplateColumns:"120px 1fr",gap:12}}><Field label="PLZ" value={data.plz} onChange={up("plz")} placeholder="1060"/><Field label="Ort" value={data.ort} onChange={up("ort")} placeholder="Wien"/></div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}><Field label="Telefon" value={data.telefon} onChange={up("telefon")} placeholder="+43 1 234 56 78"/><Field label="E-Mail" value={data.email} onChange={up("email")} placeholder="office@firma.at" type="email"/></div><Dropdown label="Oeffnungszeiten" value={data.oeffnungszeiten} onChange={up("oeffnungszeiten")} options={OEFFNUNGSZEITEN} placeholder="Oeffnungszeiten waehlen"/>{data.oeffnungszeiten==="custom"&&<Field label="Ihre Oeffnungszeiten" value={data.oeffnungszeitenCustom} onChange={up("oeffnungszeitenCustom")} placeholder={"Mo-Fr: 08:00-17:00\nSa: nach Vereinbarung"} rows={2}/>}<div style={{marginTop:8,paddingTop:16,borderTop:`1px solid ${T.bg3}`}}><div style={{fontSize:".78rem",fontWeight:700,color:T.textSub,textTransform:"uppercase",letterSpacing:".06em",marginBottom:12}}>Social Media <span style={{fontWeight:400,opacity:.6}}>(optional)</span></div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}><Field label="Facebook" value={data.facebook} onChange={up("facebook")} placeholder="facebook.com/ihrefirma"/><Field label="Instagram" value={data.instagram} onChange={up("instagram")} placeholder="instagram.com/ihrefirma"/><Field label="LinkedIn" value={data.linkedin} onChange={up("linkedin")} placeholder="linkedin.com/company/..."/><Field label="TikTok" value={data.tiktok} onChange={up("tiktok")} placeholder="tiktok.com/@ihrefirma"/></div></div></>,<>{(()=>{const uf=data.unternehmensform;const hasFB=["eu","gmbh","og","kg","ag"].includes(uf);return(<><Dropdown label="Unternehmensform" value={uf} onChange={up("unternehmensform")} options={UNTERNEHMENSFORMEN} placeholder="Unternehmensform waehlen" hint="Fuer das Impressum (ECG)"/>
{(uf==="einzelunternehmen"||uf==="gesnbr")&&<Field label="Unternehmensgegenstand" value={data.unternehmensgegenstand} onChange={up("unternehmensgegenstand")} placeholder="z.B. Elektroinstallation und -handel" hint="Optional"/>}
{uf==="gesnbr"&&<Field label="Gesellschafter" value={data.gesellschafter} onChange={up("gesellschafter")} placeholder="Max Mustermann, Maria Musterfrau" hint="Empfohlen laut WKO"/>}
{hasFB&&<div className="pt-field-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}><Field label="Firmenbuchnummer" value={data.firmenbuchnummer} onChange={up("firmenbuchnummer")} placeholder="FN 123456 a"/><Field label="Firmenbuchgericht" value={data.firmenbuchgericht} onChange={up("firmenbuchgericht")} placeholder="HG Wien"/></div>}
{uf==="gmbh"&&<Field label="Geschaeftsfuehrer" value={data.geschaeftsfuehrer} onChange={up("geschaeftsfuehrer")} placeholder="Vor- und Nachname" hint="Fuer das Impressum"/>}
{uf==="ag"&&<><Field label="Vorstand" value={data.vorstand} onChange={up("vorstand")} placeholder="Vor- und Nachname"/><Field label="Aufsichtsrat" value={data.aufsichtsrat} onChange={up("aufsichtsrat")} placeholder="Vor- und Nachname" hint="Optional"/></>}
{uf==="verein"&&<><Field label="ZVR-Zahl" value={data.zvr_zahl} onChange={up("zvr_zahl")} placeholder="z.B. 123456789"/><Field label="Vertretungsbefugte Organe" value={data.vertretungsorgane} onChange={up("vertretungsorgane")} placeholder="z.B. Obmann: Max Mustermann" rows={2}/></>}
{hasFB&&<Toggle label="Gesellschaft in Liquidation" checked={!!data.liquidation} onChange={v=>up("liquidation")(v?"in Liquidation":"")} desc="Nur wenn zutreffend"/>}
<div className="pt-field-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}><Field label="UID-Nummer / ATU" value={data.uid} onChange={up("uid")} placeholder="ATU12345678" hint="Optional"/><Field label="GISA-Zahl" value={data.gisazahl} onChange={up("gisazahl")} placeholder="z.B. 12345678" hint="Optional"/></div>
<div className="pt-field-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}><Field label="Aufsichtsbehoerde" value={data.aufsichtsbehoerde} onChange={up("aufsichtsbehoerde")} placeholder="z.B. MA 63" hint="Optional"/><Field label="Kammer / Berufsrecht" value={data.kammer_berufsrecht} onChange={up("kammer_berufsrecht")} placeholder="z.B. WKO Wien" hint="Optional"/></div>
<div style={{marginTop:8,padding:"12px 14px",background:T.accentLight,borderRadius:T.rSm,border:`1px solid rgba(37,99,235,.12)`}}><div style={{fontSize:".78rem",color:T.accent,lineHeight:1.65}}>Diese Angaben werden automatisch in Ihr Impressum eingebaut (ECG-konform).<br/>Unterstuetzte Rechtsformen: e.U., Einzelunternehmen, GmbH, OG, KG, AG, Verein, GesbR. Bei anderen Rechtsformen bitte vorab Kontakt aufnehmen.</div></div></>);})()}</>,<><p style={{fontSize:".88rem",color:T.textSub,margin:"0 0 6px",lineHeight:1.6}}>Basierend auf Ihrer Branche empfehlen wir:</p><p style={{fontSize:"1rem",fontWeight:700,color:T.dark,margin:"0 0 16px"}}>{STYLES_MAP[data.stil]?.label||"Professionell"}</p><StylePicker value={data.stil} onChange={up("stil")}/><div style={{marginTop:20}}><Toggle label="Moechten Sie eigene Fotos auf Ihrer Website?" checked={data.fotos} onChange={up("fotos")} desc="Teamfoto und Arbeitsfotos – nach Bestellung in Ihrem Portal hochladbar"/><div style={{marginTop:8,padding:"10px 12px",background:"#fffbeb",borderRadius:T.rSm,border:"1px solid #fcd34d",fontSize:".78rem",color:"#92400e"}}>⚠️ Diese Einstellung beeinflusst die Website-Struktur und kann nach der Erstellung nicht mehr geaendert werden. Logo-Upload ist immer moeglich.</div></div><div style={{marginTop:20,padding:"14px 16px",background:T.accentLight,borderRadius:T.rSm,border:`1px solid rgba(37,99,235,.12)`}}><div style={{fontSize:".78rem",fontWeight:700,color:T.accent,marginBottom:6}}>Nach dem Kauf – Self-Service-Portal</div><div style={{fontSize:".82rem",color:T.textSub,lineHeight:1.7}}>Logo hochladen &middot; Eigene Fotos hochladen &middot; Custom Domain verbinden – alles selbst, jederzeit.</div></div></>];

  const formPanel=(<div style={{display:"flex",flexDirection:"column",background:T.bg,borderRight:isMobile?"none":`1px solid ${T.bg3}`,height:isMobile?"100vh":"100%",overflow:isMobile?"hidden":"visible",fontFamily:T.font}}>
    <div style={{padding:"20px 24px 0"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}><button onClick={onBack} style={{background:"none",border:"none",cursor:"pointer",fontSize:16,color:T.textMuted,padding:2}}>{"\u2190"}</button><img src="/icon.png" alt="SR" style={{height:22}}/><span style={{fontSize:".95rem",fontWeight:800,color:T.dark}}>SiteReady</span></div>
        {isMobile&&<button onClick={()=>setShowPreview(!showPreview)} style={{fontSize:".75rem",fontWeight:600,color:T.accent,background:T.accentLight,padding:"5px 12px",borderRadius:6,border:"none",cursor:"pointer",fontFamily:T.font}}>{showPreview?"Formular":"Vorschau"}</button>}
      </div>
      {!showImport&&<><div style={{display:"flex",alignItems:"center",gap:10,margin:"14px 0 16px"}}><div style={{flex:1,height:4,borderRadius:2,background:T.bg3,overflow:"hidden"}}><div style={{height:"100%",borderRadius:2,background:`linear-gradient(90deg,${T.accent},#60a5fa)`,width:`${pct}%`,transition:"width .4s"}}/></div><span style={{fontSize:".72rem",color:T.textMuted,fontWeight:600,fontFamily:T.mono}}>{step+1}/{STEPS.length}</span></div>
      <div style={{display:"flex",gap:2,background:T.bg3,borderRadius:T.rSm,padding:3}}>
        {STEPS.map((s,i)=><button key={s.id} onClick={()=>go(i)} style={{flex:1,padding:"9px 4px",border:"none",background:i===step?T.white:"transparent",cursor:"pointer",borderRadius:i===step?8:0,fontFamily:T.font,transition:"all .2s",boxShadow:i===step?T.sh1:"none"}}><div style={{fontSize:".62rem",fontWeight:700,color:i===step?T.accent:T.textMuted,letterSpacing:".08em",marginBottom:2}}>{s.num}</div><div style={{fontSize:".78rem",fontWeight:i===step?700:500,color:i===step?T.dark:T.textMuted}}>{s.title}</div></button>)}
      </div></>}
    </div>
    <div ref={ref} style={{flex:1,overflowY:"auto",padding:"20px 24px"}}>{showImport?(<div><div style={{display:"inline-flex",alignItems:"center",gap:6,background:T.accentLight,color:T.accent,padding:"5px 14px",borderRadius:100,fontSize:".65rem",fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",marginBottom:18}}>Optionaler Vorschritt</div><h2 style={{fontSize:"1.2rem",fontWeight:800,color:T.dark,marginBottom:10,letterSpacing:"-.02em"}}>Haben Sie schon eine Website?</h2><p style={{fontSize:".88rem",color:T.textSub,lineHeight:1.65,marginBottom:24}}>Wir importieren Ihre Daten automatisch – Sie pruefen und korrigieren nur noch.</p><Field label="Ihre aktuelle Website-URL" value={importUrl} onChange={setImportUrl} placeholder="https://ihre-website.at" hint="Bitte nur Ihre eigene Website angeben"/><div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:16}}><div style={{display:"flex",alignItems:"flex-start",gap:8,padding:"10px 12px",background:"#fefce8",borderRadius:T.rSm,border:"1px solid #fde68a"}}><span style={{fontSize:"13px",flexShrink:0}}>⚠️</span><span style={{fontSize:".78rem",color:"#92400e",lineHeight:1.6}}><strong>Nur Ihre eigene Website:</strong> Bitte geben Sie ausschliesslich eine Website an, fuer die Sie berechtigt sind. Das Importieren fremder Daten ist aus Datenschutzgruenden nicht erlaubt.</span></div><div style={{display:"flex",alignItems:"flex-start",gap:8,padding:"10px 12px",background:T.accentLight,borderRadius:T.rSm,border:`1px solid rgba(37,99,235,.12)`}}><span style={{fontSize:"13px",flexShrink:0}}>ℹ️</span><span style={{fontSize:".78rem",color:T.accent,lineHeight:1.6}}><strong>Bitte Daten pruefen:</strong> Die importierten Informationen werden automatisch erkannt und koennen unvollstaendig sein. Im naechsten Schritt koennen Sie alles korrigieren und ergaenzen.</span></div></div>{importErr&&<div style={{marginBottom:12,padding:"10px 14px",background:"#fef2f2",borderRadius:T.rSm,border:"1px solid #fecaca",fontSize:".78rem",color:"#dc2626"}}>{importErr}</div>}{importLoading?(<div style={{display:"flex",alignItems:"center",gap:12,padding:"16px 20px",background:T.accentLight,borderRadius:T.rSm,border:`1px solid rgba(37,99,235,.12)`,marginBottom:12}}><div style={{width:18,height:18,borderRadius:"50%",border:`2.5px solid ${T.accent}`,borderTopColor:"transparent",animation:"spin 1s linear infinite",flexShrink:0}}/><span style={{fontSize:".88rem",color:T.accent,fontWeight:600}}>Website wird analysiert...</span></div>):(<button onClick={doImport} style={{width:"100%",padding:"14px",border:"none",borderRadius:T.rSm,background:T.dark,color:"#fff",cursor:"pointer",fontSize:".92rem",fontWeight:700,fontFamily:T.font,boxShadow:"0 2px 12px rgba(0,0,0,.12)",marginBottom:12}}>Daten importieren &rarr;</button>)}</div>):pages[step]}</div>
    <div style={{padding:"16px 24px",borderTop:`1px solid ${T.bg3}`,display:"flex",justifyContent:showImport?"flex-end":"space-between",background:T.white}}>
      {showImport?(<button onClick={()=>setShowImport(false)} style={{padding:"12px 20px",border:`2px solid ${T.bg3}`,borderRadius:T.rSm,background:T.white,color:T.textSub,cursor:"pointer",fontSize:".85rem",fontWeight:600,fontFamily:T.font}}>Ohne Import starten</button>):(<>{step>0?<button onClick={()=>go(step-1)} style={{padding:"12px 20px",border:`2px solid ${T.bg3}`,borderRadius:T.rSm,background:T.white,color:T.textSub,cursor:"pointer",fontSize:".85rem",fontWeight:600,fontFamily:T.font}}>{"\u2190"} Zurueck</button>:<div/>}{step<STEPS.length-1?<button onClick={()=>go(step+1)} style={{padding:"12px 24px",border:"none",borderRadius:T.rSm,background:T.dark,color:"#fff",cursor:"pointer",fontSize:".85rem",fontWeight:700,fontFamily:T.font,boxShadow:"0 2px 12px rgba(0,0,0,.12)"}}>Weiter &rarr;</button>:<button onClick={onComplete} style={{padding:"12px 24px",border:"none",borderRadius:T.rSm,background:"linear-gradient(135deg,#16a34a,#22c55e)",color:"#fff",cursor:"pointer",fontSize:".85rem",fontWeight:700,fontFamily:T.font,boxShadow:"0 2px 12px rgba(22,163,74,.2)"}}>Website erstellen &rarr;</button>}</>)}
    </div>
  </div>);

  if(isMobile){if(showPreview)return<div style={{minHeight:"100vh",background:T.bg}}><div style={{padding:"10px 14px",background:T.white,borderBottom:`1px solid ${T.bg3}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:".82rem",fontWeight:700,color:T.dark}}>Vorschau</span><button onClick={()=>setShowPreview(false)} style={{fontSize:".82rem",fontWeight:600,color:T.accent,background:"none",border:"none",cursor:"pointer",fontFamily:T.font}}>{"\u2190"} Formular</button></div><Preview d={data} compact/></div>;return formPanel}

  return(<div style={{display:"grid",gridTemplateColumns:"460px 1fr",height:"100vh",overflow:"hidden"}}><style>{css}</style>{formPanel}<div style={{display:"flex",flexDirection:"column",overflow:"hidden",background:T.bg2}}>
    <div style={{padding:"12px 18px",background:T.white,borderBottom:`1px solid ${T.bg3}`,display:"flex",alignItems:"center",gap:10}}>
      <div style={{display:"flex",gap:5}}>{["#ff5f57","#febc2e","#28c840"].map(c=><span key={c} style={{width:10,height:10,borderRadius:"50%",background:c}}/>)}</div>
      <div style={{flex:1,background:T.bg,borderRadius:8,padding:"7px 16px",fontSize:".78rem",color:T.textMuted,display:"flex",alignItems:"center",gap:6,border:`1px solid ${T.bg3}`,fontFamily:T.mono}}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>{data.firmenname?`${data.firmenname.toLowerCase().replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,"")}.siteready.at`:"firmenname.siteready.at"}</div>
      <div style={{background:T.greenLight,color:T.green,fontSize:".65rem",fontWeight:700,padding:"5px 12px",borderRadius:6,textTransform:"uppercase",fontFamily:T.font,letterSpacing:".06em"}}>Live</div>
    </div>
    <div style={{flex:1,overflowY:"auto",background:T.white,margin:10,borderRadius:T.rSm,boxShadow:T.sh3,border:"1px solid rgba(0,0,0,.04)"}}><Preview d={data}/></div>
  </div></div>);
}

/* ═══ PORTAL LOGIN ═══ */
function PortalLogin({onBack}){
  const[mode,setMode]=useState(()=>localStorage.getItem("sr_pending_email")?"register":"login");
  const[email,setEmail]=useState(()=>localStorage.getItem("sr_pending_email")||"");
  const[pw,setPw]=useState("");
  const[pw2,setPw2]=useState("");
  const[loading,setLoading]=useState(false);
  const[err,setErr]=useState("");
  const[done,setDone]=useState(false);
  const[forgotPw,setForgotPw]=useState(false);const[forgotDone,setForgotDone]=useState(false);

  const submitForgot=async()=>{if(!email){setErr("Bitte E-Mail eingeben.");return;}setLoading(true);setErr("");const{error}=await supabase.auth.resetPasswordForEmail(email,{redirectTo:window.location.origin+"/portal"});if(error)setErr(error.message);else setForgotDone(true);setLoading(false);};
  const submit=async()=>{
    if(!email.trim()||!pw.trim()||!supabase)return;
    if(mode==="register"&&pw!==pw2){setErr("Passwoerter stimmen nicht ueberein.");return;}
    setLoading(true);setErr("");
    if(mode==="login"){
      const{error}=await supabase.auth.signInWithPassword({email,password:pw});
      if(error)setErr(error.message==="Invalid login credentials"?"E-Mail oder Passwort falsch.":error.message);
    } else {
      const{error}=await supabase.auth.signUp({email,password:pw});
      if(error)setErr(error.message);else setDone(true);
    }
    setLoading(false);
  };

  return(<div style={{minHeight:"100vh",background:"#fff",fontFamily:T.font,display:"flex",alignItems:"center",justifyContent:"center"}}><style>{css}</style>
    <div style={{maxWidth:400,width:"100%",padding:"0 24px"}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:40}}>
        <img src="/icon.png" alt="SR" style={{height:22}}/><span style={{fontSize:".95rem",fontWeight:800,color:T.dark}}>SiteReady</span>
      </div>
      {forgotDone?(<div><div style={{fontSize:"1.4rem",fontWeight:800,color:T.dark,marginBottom:12}}>{"\u2713"} E-Mail gesendet</div><p style={{color:T.textSub,fontSize:".9rem",lineHeight:1.6}}>Pruefen Sie Ihren Posteingang – Sie erhalten in Kuerze einen Link zum Zuruecksetzen Ihres Passworts.</p><button onClick={()=>{setForgotDone(false);setForgotPw(false);}} style={{marginTop:20,padding:"12px 20px",border:"none",borderRadius:T.rSm,background:T.dark,color:"#fff",cursor:"pointer",fontSize:".85rem",fontWeight:700,fontFamily:T.font}}>Zur Anmeldung</button></div>):forgotPw?(<div><div style={{fontSize:"1.2rem",fontWeight:800,color:T.dark,marginBottom:8}}>Passwort zuruecksetzen</div><p style={{color:T.textSub,fontSize:".85rem",marginBottom:20}}>Geben Sie Ihre E-Mail-Adresse ein – wir senden Ihnen einen Link.</p><Field label="E-Mail-Adresse" value={email} onChange={setEmail} placeholder="ihre@email.at" type="email"/>{err&&<div style={{marginBottom:12,padding:"10px 14px",background:"#fef2f2",borderRadius:T.rSm,fontSize:".78rem",color:"#dc2626"}}>{err}</div>}<button onClick={submitForgot} disabled={loading} style={{width:"100%",padding:"14px",border:"none",borderRadius:T.rSm,background:loading?"#94a3b8":T.dark,color:"#fff",fontSize:".92rem",fontWeight:700,fontFamily:T.font,cursor:loading?"wait":"pointer",marginBottom:12}}>{loading?"...":"Link senden \u2192"}</button><button onClick={()=>{setForgotPw(false);setErr("");}} style={{width:"100%",padding:"12px",border:`2px solid ${T.bg3}`,borderRadius:T.rSm,background:"#fff",color:T.textSub,fontSize:".85rem",fontWeight:600,fontFamily:T.font,cursor:"pointer"}}>Abbrechen</button></div>):(done?(<div>
        <div style={{fontSize:"1.4rem",fontWeight:800,color:T.dark,marginBottom:12}}>{"\u2713"} Konto erstellt</div>
        <p style={{color:T.textSub,fontSize:".9rem",lineHeight:1.6}}>Bitte bestaetigen Sie Ihre E-Mail-Adresse – danach koennen Sie sich anmelden.</p>
        <button onClick={()=>{setDone(false);setMode("login");}} style={{marginTop:20,padding:"12px 20px",border:"none",borderRadius:T.rSm,background:T.dark,color:"#fff",cursor:"pointer",fontSize:".85rem",fontWeight:700,fontFamily:T.font}}>Zur Anmeldung</button>
      </div>):(<div>
        <div style={{fontSize:".72rem",fontWeight:700,color:T.accent,letterSpacing:".14em",textTransform:"uppercase",marginBottom:8}}>Self-Service-Portal</div>
        {/* Mode Tabs */}
        <div style={{display:"flex",gap:2,background:T.bg3,borderRadius:T.rSm,padding:3,marginBottom:24}}>
          {[{id:"login",label:"Anmelden"},{id:"register",label:"Registrieren"}].map(m=>(
            <button key={m.id} onClick={()=>{setMode(m.id);setErr("");}} style={{flex:1,padding:"9px",border:"none",background:mode===m.id?T.white:"transparent",cursor:"pointer",borderRadius:8,fontFamily:T.font,fontWeight:mode===m.id?700:500,fontSize:".85rem",color:mode===m.id?T.dark:T.textMuted,boxShadow:mode===m.id?T.sh1:"none",transition:"all .2s"}}>{m.label}</button>
          ))}
        </div>
        <Field label="E-Mail-Adresse" value={email} onChange={setEmail} placeholder="ihre@email.at" type="email"/>
        <Field label="Passwort" value={pw} onChange={setPw} placeholder={mode==="register"?"Mindestens 6 Zeichen":"Ihr Passwort"} type="password"/>
        {mode==="login"&&!forgotPw&&<div style={{textAlign:"right",marginTop:-14,marginBottom:16}}><button onClick={()=>{setForgotPw(true);setErr("");}} style={{background:"none",border:"none",color:T.accent,fontSize:".78rem",cursor:"pointer",fontFamily:T.font,fontWeight:600}}>Passwort vergessen?</button></div>}
        {mode==="register"&&<Field label="Passwort wiederholen" value={pw2} onChange={setPw2} placeholder="Passwort bestaetigen" type="password"/>}
        {err&&<div style={{marginBottom:12,padding:"10px 14px",background:"#fef2f2",borderRadius:T.rSm,fontSize:".78rem",color:"#dc2626"}}>{err}</div>}
        <button onClick={submit} disabled={loading} style={{width:"100%",padding:"14px",border:"none",borderRadius:T.rSm,background:loading?"#94a3b8":T.dark,color:"#fff",fontSize:".92rem",fontWeight:700,fontFamily:T.font,cursor:loading?"wait":"pointer",marginBottom:12,transition:"background .2s"}}>
          {loading?"...":(mode==="login"?"Anmelden \u2192":"Konto erstellen \u2192")}
        </button>
        <button onClick={onBack} style={{width:"100%",padding:"12px",border:`2px solid ${T.bg3}`,borderRadius:T.rSm,background:"#fff",color:T.textSub,fontSize:".85rem",fontWeight:600,fontFamily:T.font,cursor:"pointer"}}>
          {"\u2190"} Zur Startseite
        </button>
      </div>))}
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

  useEffect(()=>{
    if(!supabase||!session?.user?.email)return;
    supabase.from("orders").select("*").eq("email",session.user.email).order("created_at",{ascending:false}).limit(1)
      .then(({data})=>{if(data&&data.length>0)setOrder(data[0]);});
    // Existierende Assets laden
    const uid=session.user.id;
    const keys=["logo","hero","foto1","foto2","team"];
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
      notdienst:order.notdienst,kurzbeschreibung:order.kurzbeschreibung,
      oeffnungszeiten:order.oeffnungszeiten,oeffnungszeiten_custom:order.oeffnungszeiten_custom,
      einsatzgebiet:order.einsatzgebiet,uid_nummer:order.uid_nummer,stil:order.stil,fotos:order.fotos
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
      // URL in orders-Tabelle speichern (fuer Serve-time Injection)
      const colMap={logo:"url_logo",hero:"url_hero",foto1:"url_foto1",foto2:"url_foto2",team:"url_team"};
      const col=colMap[key];
      if(col&&order?.id)supabase.from("orders").update({[col]:data.publicUrl}).eq("id",order.id).then(()=>{});
    }
    setUploading(u=>({...u,[key]:false}));
  };

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
      leistungen:{leistungen:order.leistungen,extra_leistung:order.extra_leistung,notdienst:order.notdienst},
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
      leistungen:{leistungen:order.leistungen,extra_leistung:order.extra_leistung,notdienst:order.notdienst},
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
        setRegenErr(`Limit erreicht. Naechste Neugenierung moeglich ab ${nextDate}.`);
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
      {badge==="instant"&&<div style={{fontSize:".75rem",color:"#16a34a",marginTop:6}}>{"✓"} Aenderungen werden sofort auf Ihrer Website sichtbar – kein Warten.</div>}
      {badge==="regen"&&<div style={{fontSize:".75rem",color:regenLeft>0?"#d97706":"#dc2626",marginTop:6}}>
        {regenLeft>0
          ?`\u21BB ${regenLeft} von 2 Website-Neugestaltungen dieses Monats verfuegbar. Aenderungen werden in ca. 30 Sekunden automatisch uebernommen.`
          :`\u26A0 Limit erreicht. Naechste Neugestaltung moeglich ab ${nextRegenDate?nextRegenDate.toLocaleDateString("de-AT",{day:"2-digit",month:"long",year:"numeric"}):"bald"}.`}
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
    {key:"logo",label:"Logo",desc:"Wird in der Navigation angezeigt"},
    {key:"hero",label:"Hero-Foto",desc:"Grosses Bild oben auf der Website"},
    {key:"foto1",label:"Galerie Foto 1",desc:"Erscheint zwischen den Leistungen"},
    {key:"foto2",label:"Galerie Foto 2",desc:"Erscheint neben Foto 1"},
    {key:"team",label:"Teamfoto",desc:"Wird in der 'Ueber uns' Sektion angezeigt"},
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
      {/* Tab Nav */}
      <div className="pt-tab-nav" style={{display:"flex",gap:2,background:T.bg3,borderRadius:T.rSm,padding:3,marginBottom:28,width:"fit-content"}}>
        {TABS.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{padding:"9px 20px",border:"none",background:tab===t.id?T.white:"transparent",cursor:"pointer",borderRadius:8,fontFamily:T.font,fontWeight:tab===t.id?700:500,fontSize:".85rem",color:tab===t.id?T.dark:T.textMuted,boxShadow:tab===t.id?T.sh1:"none",transition:"all .2s"}}>{t.label}</button>)}
      </div>

      {/* Tab: Website */}
      {tab==="website"&&(!order?<div style={{background:"#fff",borderRadius:T.r,padding:"28px 32px",border:`1px solid ${T.bg3}`,color:T.textMuted,fontSize:".9rem"}}>Bestellung wird geladen...</div>:<div style={{display:"flex",flexDirection:"column",gap:16}}>
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
            <Dropdown label="Unternehmensform" value={order.unternehmensform||""} onChange={upOrder("unternehmensform")} options={UNTERNEHMENSFORMEN} placeholder="Unternehmensform waehlen"/>
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
            <Field label="Strasse & Hausnummer" value={order.adresse||""} onChange={upOrder("adresse")} placeholder="Hauptstrasse 1"/>
            <div className="pt-addr-grid" style={{display:"grid",gridTemplateColumns:"100px 1fr 1fr",gap:12}}>
              <Field label="PLZ" value={order.plz||""} onChange={upOrder("plz")} placeholder="1010"/>
              <Field label="Ort" value={order.ort||""} onChange={upOrder("ort")} placeholder="Wien"/>
              <Field label="Telefon" value={order.telefon||""} onChange={upOrder("telefon")} placeholder="+43 1 234 56 78"/>
            </div>
            <Dropdown label="Oeffnungszeiten" value={order.oeffnungszeiten||""} onChange={upOrder("oeffnungszeiten")} options={OEFFNUNGSZEITEN} placeholder="Oeffnungszeiten waehlen"/>
            {order.oeffnungszeiten==="custom"&&<Field label="Eigene Oeffnungszeiten" value={order.oeffnungszeiten_custom||""} onChange={upOrder("oeffnungszeiten_custom")} placeholder={"Mo-Fr: 08:00-17:00"} rows={2}/>}
          </>):(<>
            <InfoRow label="Adresse" value={[order.adresse,[order.plz,order.ort].filter(Boolean).join(" ")].filter(Boolean).join(", ")}/>
            <InfoRow label="Telefon" value={order.telefon}/>
            <InfoRow label="Oeffnungszeiten" value={order.oeffnungszeiten==="custom"?order.oeffnungszeiten_custom:(OEFFNUNGSZEITEN.find(o=>o.value===order.oeffnungszeiten)?.label)}/>
          </>)}
        </div>
        {/* Leistungen */}
        <div style={{background:"#fff",borderRadius:T.r,padding:"24px 28px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1}}>
          <SectionHeader id="leistungen" label="Leistungen" badge="regen"/>
          {editSection==="leistungen"?(<>
            {(()=>{const bl=BRANCHEN.find(b=>b.value===order.branche);return bl
              ?<Checklist label={bl.label} options={bl.leistungen} selected={order.leistungen||[]} onChange={upOrder("leistungen")} hint="Aktive Leistungen"/>
              :<Field label="Leistungen (eine pro Zeile)" value={(order.leistungen||[]).join("\n")} onChange={v=>upOrder("leistungen")(v.split("\n").filter(l=>l.trim()))} rows={4}/>;})()}
            <Field label="Zusaetzliche Leistung" value={order.extra_leistung||""} onChange={upOrder("extra_leistung")} placeholder="z.B. Beratung..."/>
            <Toggle label="24h Notdienst" checked={!!order.notdienst} onChange={upOrder("notdienst")} desc="Wird prominent angezeigt"/>
          </>):(<>
            {(order.leistungen||[]).map((l,i)=><InfoRow key={i} label={i===0?"Leistungen":""} value={l}/>)}
            {order.extra_leistung&&<InfoRow label="Zusatz" value={order.extra_leistung}/>}
            <InfoRow label="24h Notdienst" value={order.notdienst?"Ja":"Nein"}/>
          </>)}
        </div>
        {/* Design */}
        <div style={{background:"#fff",borderRadius:T.r,padding:"24px 28px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1}}>
          <SectionHeader id="design" label="Design" badge="regen"/>
          {editSection==="design"?(<>
            <StylePicker value={order.stil||"professional"} onChange={upOrder("stil")}/>
            <div style={{marginTop:16}}><Toggle label="Fotos auf der Website" checked={!!order.fotos} onChange={upOrder("fotos")} desc="Hero-Foto, Galerie, Teamfoto"/></div>
          </>):(<>
            <InfoRow label="Stil" value={STYLES_MAP[order.stil||"professional"]?.label}/>
            <InfoRow label="Fotos" value={order.fotos?"Ja, mit Fotos":"Nein, ohne Fotos"}/>
          </>)}
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
            <div style={{fontSize:".82rem",color:"#78350f",lineHeight:1.5}}>Ihr Aenderungswunsch wurde erfasst. Wir generieren Ihre Website innerhalb von 24h neu und schalten sie danach live.</div>
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
            <div style={{fontSize:".72rem",fontWeight:700,color:T.accent,textTransform:"uppercase",letterSpacing:".1em",marginBottom:6}}>Geschaeftszeiten</div>
            <div style={{fontSize:".88rem",fontWeight:600,color:T.dark}}>Mo – Fr, 09:00 – 17:00</div>
            <div style={{fontSize:".78rem",color:T.textSub,marginTop:3}}>Oesterreichische Feiertage ausgenommen</div>
          </div>
        </div>
        <div style={{background:"#fff",borderRadius:T.r,padding:"24px 28px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1}}>
          <div style={{fontSize:".72rem",fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:".1em",marginBottom:16}}>Haeufige Fragen</div>
          {[
            {q:"Wie lange dauert es bis meine Website online ist?",a:"Nach der Bezahlung richten wir Ihre Website innerhalb von 24 Stunden ein. Sie erhalten eine E-Mail sobald alles live ist."},
            {q:"Kann ich den Text auf meiner Website selbst aendern?",a:"Ja – im Self-Service-Portal koennen Sie jederzeit Adresse, Telefon, Leistungen und mehr anpassen."},
            {q:"Was passiert nach 12 Monaten?",a:"Das Abo verlaengert sich automatisch monatlich zum selben Preis. Eine Kuendigung ist jederzeit moeglich."},
            {q:"Kann ich mein Logo hochladen?",a:"Ja, im Tab 'Logo & Fotos' koennen Sie Ihr Logo sowie Hero-Foto, Galerie und Teamfoto hochladen."},
            {q:"Wie verbinde ich meine eigene Domain?",a:"Die noetigen DNS-Eintraege finden Sie im Tab 'Custom Domain'. Danach einmal kurz Bescheid geben und wir schalten die Domain frei."},
          ].map((f,i)=><details key={i} style={{borderBottom:`1px solid ${T.bg3}`,padding:"14px 0"}}>
            <summary style={{cursor:"pointer",fontWeight:600,fontSize:".88rem",color:T.dark,listStyle:"none",display:"flex",justifyContent:"space-between",alignItems:"center",userSelect:"none"}}>
              {f.q}<span style={{color:T.textMuted,fontSize:"1.1rem",marginLeft:12,flexShrink:0}}>+</span>
            </summary>
            <p style={{margin:"10px 0 0",fontSize:".84rem",color:T.textSub,lineHeight:1.7}}>{f.a}</p>
          </details>)}
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
      </div>)}

      {/* Tab: Account */}
      {tab==="account"&&(<div style={{display:"flex",flexDirection:"column",gap:16}}>
        <div style={{background:"#fff",borderRadius:T.r,padding:"24px 28px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1}}>
          <div style={{fontSize:".72rem",fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:".1em",marginBottom:16}}>Account-Daten</div>
          <InfoRow label="E-Mail-Adresse" value={session?.user?.email}/>
          <InfoRow label="Mitglied seit" value={session?.user?.created_at?new Date(session.user.created_at).toLocaleDateString("de-AT",{day:"2-digit",month:"2-digit",year:"numeric"}):""}/>
          <InfoRow label="Abonnement" value="SiteReady Standard \u2013 \u20AC18 / Monat"/>
        </div>
        <div style={{background:"#fff",borderRadius:T.r,padding:"24px 28px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1}}>
          <div style={{fontSize:".72rem",fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:".1em",marginBottom:16}}>Passwort aendern</div>
          <Field label="Neues Passwort" value={newPw} onChange={setNewPw} placeholder="Mindestens 6 Zeichen" type="password"/>
          <Field label="Passwort bestaetigen" value={newPw2} onChange={setNewPw2} placeholder="Passwort wiederholen" type="password"/>
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
          <div style={{fontSize:".72rem",fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:".1em",marginBottom:8}}>Kuendigung</div>
          <p style={{fontSize:".85rem",color:T.textSub,lineHeight:1.7,margin:"0 0 14px"}}>Fuer eine Kuendigung schreiben Sie bitte an <strong>support@siteready.at</strong>. Bitte beachten Sie die Mindestlaufzeit von 12 Monaten.</p>
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
          {[{l:"Paket",v:"SiteReady Standard"},{l:"Preis",v:"\u20AC18 / Monat"},{l:"Mindestlaufzeit",v:"12 Monate"},...(order?.created_at?[{l:"Gestartet am",v:new Date(order.created_at).toLocaleDateString("de-AT",{day:"2-digit",month:"long",year:"numeric"})},{l:"Mindestende",v:new Date(new Date(order.created_at).setFullYear(new Date(order.created_at).getFullYear()+1)).toLocaleDateString("de-AT",{day:"2-digit",month:"long",year:"numeric"})}]:[])].map(({l,v})=>(
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
            <div style={{fontSize:".82rem",color:T.textMuted,lineHeight:1.7,maxWidth:340,margin:"0 auto"}}>Seitenaufrufe, Besucher und Google-Klicks werden in einem zukuenftigen Update freigeschaltet.</div>
          </div>
        </div>
      </div>)}

      {/* Tab: Medien */}
      {tab==="medien"&&(<div style={{display:"flex",flexDirection:"column",gap:16}}>
        {ASSETS.map(a=>{
          const url=assetUrls[a.key];
          const busy=uploading[a.key];
          return(<div key={a.key} style={{background:"#fff",borderRadius:T.r,padding:"20px 24px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1,display:"flex",alignItems:"center",gap:20}}>
            <div style={{width:72,height:72,borderRadius:T.rSm,background:url?"#000":T.bg,border:`1.5px dashed ${T.bg3}`,overflow:"hidden",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
              {url?<img src={url} alt={a.label} style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<span style={{fontSize:"1.4rem"}}>📷</span>}
            </div>
            <div style={{flex:1}}>
              <div style={{fontWeight:700,fontSize:".9rem",color:T.dark,marginBottom:2}}>{a.label}</div>
              <div style={{fontSize:".78rem",color:T.textMuted}}>{a.desc}</div>
            </div>
            <label style={{padding:"9px 18px",border:`2px solid ${T.bg3}`,borderRadius:T.rSm,background:busy?T.bg:"#fff",color:T.textSub,cursor:busy?"wait":"pointer",fontSize:".82rem",fontWeight:600,fontFamily:T.font,whiteSpace:"nowrap"}}>
              {busy?"Laedt...":url?"Ersetzen":"Hochladen"}
              <input type="file" accept="image/*" style={{display:"none"}} disabled={busy} onChange={e=>{if(e.target.files[0])upload(a.key,e.target.files[0]);}}/>
            </label>
          </div>);
        })}
        <div style={{padding:"14px 16px",background:T.accentLight,borderRadius:T.rSm,border:`1px solid rgba(37,99,235,.12)`,fontSize:".78rem",color:T.textSub}}>
          Empfohlen: JPG oder PNG, mindestens 1200px breit, max. 5 MB.
        </div>
      </div>)}

      {/* Tab: Domain */}
      {tab==="seo"&&(<div style={{display:"flex",flexDirection:"column",gap:16}}>
        <div style={{background:"#fff",borderRadius:T.r,padding:"24px 28px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1}}>
          <div style={{fontSize:".72rem",fontWeight:700,color:T.accent,textTransform:"uppercase",letterSpacing:".12em",marginBottom:12}}>Google Indexierung</div>
          {order?.status==="live"
            ?<div style={{display:"flex",alignItems:"center",gap:12,padding:"14px 18px",background:T.greenLight,borderRadius:T.rSm,border:`1px solid rgba(22,163,74,.2)`}}>
              <span style={{fontSize:"1.4rem"}}>✓</span>
              <div><div style={{fontWeight:700,color:T.green,fontSize:".9rem"}}>Ihre Website ist fuer Google sichtbar</div><div style={{fontSize:".82rem",color:T.textSub,marginTop:3}}>Google kann Ihre Website unter <strong>{sub}.siteready.at</strong> indexieren und in den Suchergebnissen anzeigen.</div></div>
            </div>
            :<div style={{display:"flex",alignItems:"center",gap:12,padding:"14px 18px",background:"#fef3c7",borderRadius:T.rSm,border:"1px solid #fcd34d"}}>
              <span style={{fontSize:"1.4rem"}}>⏳</span>
              <div><div style={{fontWeight:700,color:"#92400e",fontSize:".9rem"}}>Indexierung aktiv nach Livegang</div><div style={{fontSize:".82rem",color:"#78350f",marginTop:3}}>Sobald Ihre Website live geschaltet wird, entfernen wir die noindex-Markierung und Google kann Ihre Website finden.</div></div>
            </div>
          }
        </div>
        <div style={{background:"#fff",borderRadius:T.r,padding:"24px 28px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1}}>
          <div style={{fontSize:".78rem",fontWeight:700,color:T.dark,marginBottom:8}}>Custom Domain & Google</div>
          <p style={{fontSize:".82rem",color:T.textSub,lineHeight:1.7,margin:0}}>Wenn Sie eine eigene Domain verbinden, kuemmern wir uns auch um die Google-Indexierung fuer Ihre Domain. Schreiben Sie uns nach der DNS-Umstellung an <strong>support@siteready.at</strong>.</p>
        </div>
      </div>)}
      {tab==="domain"&&(<div style={{background:"#fff",borderRadius:T.r,padding:"28px 32px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1}}>
        <div style={{fontSize:".72rem",fontWeight:700,color:T.accent,textTransform:"uppercase",letterSpacing:".12em",marginBottom:10}}>Custom Domain verbinden</div>
        <h2 style={{fontSize:"1.2rem",fontWeight:800,color:T.dark,margin:"0 0 8px"}}>Eigene Domain statt Subdomain</h2>
        <p style={{fontSize:".88rem",color:T.textSub,lineHeight:1.7,marginBottom:24}}>
          Aktuell ist Ihre Website unter <strong>{sub}.siteready.at</strong> erreichbar. Mit einer eigenen Domain (z.B. <strong>www.{sub}.at</strong>) erscheint Ihre Website noch professioneller.
        </p>
        <div style={{marginBottom:24}}>
          <div style={{fontSize:".82rem",fontWeight:700,color:T.dark,marginBottom:10}}>DNS-Eintraege bei Ihrem Domain-Anbieter setzen:</div>
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
          <div style={{fontSize:".82rem",color:T.textSub,lineHeight:1.7}}>DNS-Aenderungen dauern bis zu 48 Stunden. Sobald alles aktiv ist, schreiben Sie uns an <strong>support@siteready.at</strong> – wir schalten Ihre Domain frei.</div>
        </div>
      </div>)}
    </div>
  </div>);
}

/* ═══ ADMIN DASHBOARD ═══ */
const STATUS_LABELS={pending:"Neu",paid:"Bezahlt",in_arbeit:"In Arbeit",review:"Review",live:"Live"};
const STATUS_COLORS={pending:"#f59e0b",paid:"#3b82f6",in_arbeit:"#8b5cf6",review:"#f97316",live:"#16a34a"};
const STATUS_FLOW=["pending","paid","in_arbeit","review","live"];

function StatusBadge({status}){const c=STATUS_COLORS[status]||T.textMuted;return(<span style={{display:"inline-block",padding:"3px 10px",borderRadius:4,background:c+"22",color:c,fontSize:".72rem",fontWeight:700,letterSpacing:".06em",textTransform:"uppercase"}}>{STATUS_LABELS[status]||status}</span>);}

function Admin({adminKey}){
  const[tab,setTab]=useState("bestellungen");
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

  useEffect(()=>{load();},[]);

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
        setGenMsg(m=>({...m,[id]:"Website erstellt! Status: review"}));
        await fetch(`/api/admin-update?key=${adminKey}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id,regen_requested:false})});
        await load();
        setSel(s=>s?.id===id?{...s,status:"review",subdomain:j.subdomain,regen_requested:false}:s);
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
  };

  const filtered=orders.filter(o=>filter==="alle"||o.status===filter);
  const fmtDate=s=>s?new Date(s).toLocaleDateString("de-AT",{day:"2-digit",month:"2-digit",year:"numeric"}):"";
  const[sysLastCheck,setSysLastCheck]=useState(null);
  const checkSystem=async()=>{setSysLoading(true);const r=await fetch(`/api/admin-system?key=${adminKey}`);const j=await r.json();setSysStatus(j);setSysLastCheck(new Date());setSysLoading(false);};
  useEffect(()=>{if(tab==="apis"){checkSystem();const iv=setInterval(checkSystem,60000);return()=>clearInterval(iv);}},[tab]);
  const TABS=[{id:"bestellungen",label:"Bestellungen"},{id:"entwicklung",label:"Entwicklung"},{id:"health",label:"Health"},{id:"support",label:"Support"},{id:"apis",label:"APIs"},{id:"kosten",label:"Kosten"}];

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
        {TABS.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{display:"block",width:"100%",padding:"11px 20px",border:"none",background:tab===t.id?T.accentLight:"transparent",color:tab===t.id?T.accent:T.textSub,textAlign:"left",cursor:"pointer",fontSize:".85rem",fontWeight:tab===t.id?700:500,fontFamily:T.font,borderLeft:tab===t.id?`3px solid ${T.accent}`:"3px solid transparent"}}>{t.label}</button>)}
        <div className="ad-status-sec" style={{margin:"20px 16px 8px",paddingTop:20,borderTop:`1px solid ${T.bg3}`}}>
          <div style={{fontSize:".68rem",color:T.textMuted,fontWeight:700,letterSpacing:".08em",marginBottom:8}}>STATUS</div>
          {["alle",...STATUS_FLOW].map(s=>{const c=orders.filter(o=>s==="alle"||o.status===s).length;return(<button key={s} onClick={()=>{setFilter(s);setTab("bestellungen");}} style={{display:"flex",justifyContent:"space-between",width:"100%",padding:"7px 4px",border:"none",background:"transparent",color:filter===s&&tab==="bestellungen"?T.accent:T.textMuted,cursor:"pointer",fontSize:".78rem",fontWeight:filter===s&&tab==="bestellungen"?700:400,fontFamily:T.font}}>
            <span>{s==="alle"?"Alle":STATUS_LABELS[s]}</span><span style={{background:T.bg3,borderRadius:10,padding:"1px 7px",fontSize:".7rem"}}>{c}</span>
          </button>);})}
        </div>
      </div>

      {/* Main */}
      <div className="ad-main" style={{flex:1,overflowY:"auto",padding:28,position:"relative"}}>
        {loading&&<div style={{textAlign:"center",padding:60,color:T.textMuted}}>Wird geladen...</div>}

        {/* Tab: Bestellungen */}
        {!loading&&tab==="bestellungen"&&(<div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
            <h2 style={{fontSize:"1.2rem",fontWeight:800,color:T.dark,margin:0}}>Bestellungen {filter!=="alle"&&`(${STATUS_LABELS[filter]})`}</h2>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <span style={{fontSize:".82rem",color:T.textMuted}}>{filtered.length} Eintraege</span>
              <button onClick={exportCSV} disabled={filtered.length===0} style={{padding:"7px 16px",border:`2px solid ${T.bg3}`,borderRadius:T.rSm,background:"#fff",color:T.textSub,cursor:filtered.length===0?"not-allowed":"pointer",fontSize:".78rem",fontWeight:600,fontFamily:T.font,display:"flex",alignItems:"center",gap:6,opacity:filtered.length===0?.5:1}}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                CSV exportieren
              </button>
            </div>
          </div>
          {filtered.length===0?<div style={{color:T.textMuted,padding:40,textAlign:"center"}}>Keine Bestellungen.</div>:
          <div style={{background:"#fff",borderRadius:T.r,border:`1px solid ${T.bg3}`,overflow:"hidden",boxShadow:T.sh1}}>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead><tr style={{background:T.bg}}>{["Datum","Firma","Deployment","Status",""].map(h=><th key={h} style={{padding:"11px 16px",textAlign:"left",fontSize:".68rem",fontWeight:700,color:T.textMuted,letterSpacing:".08em",textTransform:"uppercase",borderBottom:`1px solid ${T.bg3}`}}>{h}</th>)}</tr></thead>
              <tbody>{filtered.map((o,i)=>{
                const built=["in_arbeit","review","live"].includes(o.status);
                const reviewed=["review","live"].includes(o.status);
                const isLive=o.status==="live";
                const DEPLOY_CHECKS=[
                  {l:"Website",ok:built},{l:"SSL",ok:built},{l:"Impressum",ok:built},{l:"DSGVO",ok:built},
                  {l:"robots.txt",ok:built},{l:"sitemap.xml",ok:built},{l:"Google",ok:reviewed},{l:"Domain",ok:isLive}
                ];
                const done=DEPLOY_CHECKS.filter(c=>c.ok).length;
                return(<tr key={o.id} style={{borderBottom:`1px solid ${T.bg3}`,background:i%2===0?"#fff":"#fafbfc",cursor:"pointer"}} onClick={()=>setSel(o)}>
                  <td style={{padding:"12px 16px",fontSize:".82rem",color:T.textMuted,whiteSpace:"nowrap"}}>{fmtDate(o.created_at)}</td>
                  <td style={{padding:"12px 16px",fontWeight:700,fontSize:".88rem",color:T.dark}}>{o.firmenname||"—"}{o.regen_requested&&<span title="Neugenierung angefragt" style={{marginLeft:8,fontSize:".65rem",fontWeight:700,color:"#d97706",background:"#fef3c7",padding:"2px 6px",borderRadius:4}}>{"\u21BB"}</span>}</td>
                  <td style={{padding:"12px 16px"}}>
                    <div style={{display:"flex",alignItems:"center",gap:7}}>
                      <div style={{display:"flex",gap:3}}>
                        {DEPLOY_CHECKS.map((c,j)=><span key={j} title={c.l} style={{display:"inline-block",width:8,height:8,borderRadius:"50%",background:c.ok?T.green:T.bg3,transition:"background .2s"}}/>)}
                      </div>
                      <span style={{fontSize:".72rem",color:done===8?T.green:T.textMuted,fontFamily:T.mono,fontWeight:700}}>{done}/8</span>
                    </div>
                  </td>
                  <td style={{padding:"12px 16px"}}><StatusBadge status={o.status}/></td>
                  <td style={{padding:"12px 16px",textAlign:"right"}}>
                    {o.status!=="live"&&<button onClick={e=>{e.stopPropagation();updateOrder(o.id,{status:nextStatus(o.status)});}} style={{padding:"5px 12px",border:`2px solid ${T.bg3}`,borderRadius:T.rSm,background:"#fff",color:T.textSub,cursor:"pointer",fontSize:".75rem",fontWeight:600,fontFamily:T.font}}>{STATUS_LABELS[nextStatus(o.status)]} &rarr;</button>}
                  </td>
                </tr>);
              })}</tbody>
            </table>
          </div>}
        </div>)}

        {/* Tab: Entwicklung (Kanban) */}
        {!loading&&tab==="entwicklung"&&(<div>
          <h2 style={{fontSize:"1.2rem",fontWeight:800,color:T.dark,margin:"0 0 20px"}}>Entwicklung</h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,alignItems:"start"}}>
            {["paid","in_arbeit","review","live"].map(s=><div key={s}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:STATUS_COLORS[s]}}/>
                <span style={{fontSize:".78rem",fontWeight:700,color:T.textSub,textTransform:"uppercase",letterSpacing:".08em"}}>{STATUS_LABELS[s]}</span>
                <span style={{fontSize:".72rem",color:T.textMuted,background:T.bg3,borderRadius:10,padding:"1px 7px"}}>{orders.filter(o=>o.status===s).length}</span>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {orders.filter(o=>o.status===s).map(o=><div key={o.id} style={{background:"#fff",borderRadius:T.rSm,padding:"14px 16px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1,cursor:"pointer"}} onClick={()=>setSel(o)}>
                  <div style={{fontWeight:700,fontSize:".88rem",color:T.dark,marginBottom:4}}>{o.firmenname||"—"}</div>
                  <div style={{fontSize:".75rem",color:T.textMuted,marginBottom:10}}>{fmtDate(o.created_at)}</div>
                  {s!=="live"&&<button onClick={e=>{e.stopPropagation();updateOrder(o.id,{status:nextStatus(s)});}} style={{width:"100%",padding:"6px",border:`2px solid ${T.bg3}`,borderRadius:T.rSm,background:T.bg,color:T.textSub,cursor:"pointer",fontSize:".75rem",fontWeight:600,fontFamily:T.font}}>{STATUS_LABELS[nextStatus(s)]} &rarr;</button>}
                </div>)}
              </div>
            </div>)}
          </div>
        </div>)}

        {/* Tab: Health */}
        {!loading&&tab==="health"&&(<div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
            <h2 style={{fontSize:"1.2rem",fontWeight:800,color:T.dark,margin:0}}>Website & SSL Health</h2>
            <button onClick={()=>orders.forEach(o=>checkHealth(o))} style={{padding:"8px 18px",border:"none",borderRadius:T.rSm,background:T.dark,color:"#fff",cursor:"pointer",fontSize:".82rem",fontWeight:700,fontFamily:T.font}}>Alle pruefen</button>
          </div>
          <div style={{background:"#fff",borderRadius:T.r,border:`1px solid ${T.bg3}`,overflow:"hidden",boxShadow:T.sh1}}>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead><tr style={{background:T.bg}}>{["Firma","URL","Status","HTTP","SSL",""].map(h=><th key={h} style={{padding:"11px 16px",textAlign:"left",fontSize:".68rem",fontWeight:700,color:T.textMuted,letterSpacing:".08em",textTransform:"uppercase",borderBottom:`1px solid ${T.bg3}`}}>{h}</th>)}</tr></thead>
              <tbody>{orders.map((o,i)=>{
                const url=`${o.subdomain||"—"}.siteready.at`;
                const h=health[o.id];
                return(<tr key={o.id} style={{borderBottom:`1px solid ${T.bg3}`,background:i%2===0?"#fff":"#fafbfc"}}>
                  <td style={{padding:"12px 16px",fontWeight:700,fontSize:".88rem",color:T.dark}}>{o.firmenname||"—"}</td>
                  <td style={{padding:"12px 16px",fontSize:".82rem",color:T.accent,fontFamily:T.mono}}>{url}</td>
                  <td style={{padding:"12px 16px"}}><StatusBadge status={o.status}/></td>
                  <td style={{padding:"12px 16px"}}>{h==="checking"?<span style={{color:T.textMuted,fontSize:".78rem"}}>...</span>:h==="ok"?<span style={{color:T.green,fontWeight:700,fontSize:".78rem"}}>{"\u2713"} OK</span>:h==="error"?<span style={{color:T.red,fontWeight:700,fontSize:".78rem"}}>{"\u2717"} Fehler</span>:<span style={{color:T.textMuted,fontSize:".78rem"}}>—</span>}</td>
                  <td style={{padding:"12px 16px"}}>{h==="ok"?<span style={{color:T.green,fontWeight:700,fontSize:".78rem"}}>{"\u2713"} HTTPS</span>:h==="error"?<span style={{color:T.red,fontWeight:700,fontSize:".78rem"}}>{"\u2717"} —</span>:<span style={{color:T.textMuted,fontSize:".78rem"}}>—</span>}</td>
                  <td style={{padding:"12px 16px",textAlign:"right"}}><button onClick={()=>checkHealth(o)} style={{padding:"5px 12px",border:`2px solid ${T.bg3}`,borderRadius:T.rSm,background:"#fff",color:T.textSub,cursor:"pointer",fontSize:".75rem",fontWeight:600,fontFamily:T.font}}>Pruefen</button></td>
                </tr>);
              })}</tbody>
            </table>
          </div>
        </div>)}

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
        {/* Tab: APIs */}
        {!loading&&tab==="apis"&&(<div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
            <div>
              <h2 style={{fontSize:"1.2rem",fontWeight:800,color:T.dark,margin:"0 0 4px"}}>API & Umgebungsstatus</h2>
              {sysLastCheck&&<div style={{fontSize:".72rem",color:T.textMuted}}>Zuletzt geprueft: {sysLastCheck.toLocaleTimeString("de-AT")} &middot; Auto-Refresh alle 60s</div>}
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              {sysLoading&&<div style={{width:14,height:14,borderRadius:"50%",border:`2px solid ${T.accent}`,borderTopColor:"transparent",animation:"spin 1s linear infinite"}}/>}
              <button onClick={checkSystem} disabled={sysLoading} style={{padding:"8px 18px",border:`2px solid ${T.bg3}`,borderRadius:T.rSm,background:"#fff",color:T.textSub,cursor:sysLoading?"wait":"pointer",fontSize:".82rem",fontWeight:600,fontFamily:T.font}}>Jetzt pruefen</button>
            </div>
          </div>
          {!sysStatus&&sysLoading&&<div style={{color:T.textMuted,padding:"40px",textAlign:"center",background:"#fff",borderRadius:T.r,border:`1px solid ${T.bg3}`}}>Verbindungen werden geprueft...</div>}
          {sysStatus&&<div style={{display:"flex",flexDirection:"column",gap:16}}>
            {/* API Karten */}
            {[
              {key:"supabase",label:"Supabase",icon:"🗄️",desc:"Datenbank & Auth",detail:sysStatus.supabase?.latency?`Latenz: ${sysStatus.supabase.latency}ms`:""},
              {key:"stripe",label:"Stripe",icon:"💳",desc:"Zahlungsabwicklung",detail:sysStatus.stripe?.livemode===false?"Testmodus aktiv":sysStatus.stripe?.livemode===true?"Live-Modus":""},
              {key:"anthropic",label:"Anthropic (Claude)",icon:"🤖",desc:"KI Website-Import","key":"anthropic"},
            ].map(({key,label,icon,desc,detail})=>{
              const s=sysStatus[key];
              const ok=s?.ok;
              return(<div key={key} style={{background:"#fff",borderRadius:T.r,padding:"20px 24px",border:`1px solid ${ok?'rgba(22,163,74,.2)':T.bg3}`,boxShadow:T.sh1,display:"flex",alignItems:"center",gap:16}}>
                <div style={{width:44,height:44,borderRadius:10,background:ok?"#f0fdf4":"#fef2f2",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.2rem",flexShrink:0}}>{icon}</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:".95rem",color:T.dark,marginBottom:2}}>{label}</div>
                  <div style={{fontSize:".78rem",color:T.textMuted}}>{desc}{detail&&<span style={{marginLeft:8,color:T.accent}}>{detail}</span>}</div>
                  {s?.error&&<div style={{fontSize:".75rem",color:T.red,marginTop:4}}>{s.error}</div>}
                </div>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <div style={{width:10,height:10,borderRadius:"50%",background:ok?T.green:T.red,boxShadow:`0 0 0 3px ${ok?"rgba(22,163,74,.15)":"rgba(220,38,38,.15)"}`}}/>
                  <span style={{fontSize:".82rem",fontWeight:700,color:ok?T.green:T.red}}>{ok?"Verbunden":"Fehler"}</span>
                </div>
              </div>);
            })}
            {/* Env Vars */}
            <div style={{background:"#fff",borderRadius:T.r,padding:"20px 24px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1}}>
              <div style={{fontSize:".72rem",fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:".1em",marginBottom:14}}>Environment Variables</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {Object.entries(sysStatus.envvars||{}).map(([k,v])=><div key={k} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 12px",borderRadius:T.rSm,background:v?T.greenLight:"#fef2f2",border:`1px solid ${v?"rgba(22,163,74,.15)":"rgba(220,38,38,.1)"}`}}>
                  <span style={{fontSize:".72rem",color:v?T.green:T.red,fontWeight:700}}>{v?"\u2713":"\u2717"}</span>
                  <span style={{fontSize:".78rem",fontFamily:T.mono,color:T.dark}}>{k}</span>
                </div>)}
              </div>
            </div>
          </div>}
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
              {[{label:"MRR (brutto)",val:`\u20AC${mrr}`,sub:`${liveN} aktive Kunden`,c:T.green},{label:"Stripe-Gebuehren",val:`\u20AC${stripeFee.toFixed(2)}`,sub:"1,4% + \u20AC0,25/Tx",c:T.orange},{label:"Netto-MRR",val:`\u20AC${netto}`,sub:"nach Transaktionsgeb.",c:T.accent},{label:"Bestellungen",val:orders.length,sub:`${paidN} bezahlt`,c:T.dark}].map((k,i)=>(
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
            {/* Kostentabelle */}
            <div style={{background:"#fff",borderRadius:T.r,padding:"20px 24px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1}}>
              <div style={{fontSize:".68rem",fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:".1em",marginBottom:14}}>Monatliche Kostenbasis (Schaetzung)</div>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:".84rem"}}>
                <thead><tr>{["Posten","Art","Kosten/Mo","Hinweis"].map(h=><th key={h} style={{textAlign:"left",padding:"8px 14px",fontSize:".68rem",fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:".08em",borderBottom:`1px solid ${T.bg3}`}}>{h}</th>)}</tr></thead>
                <tbody>
                  {[{p:"Cloudflare Pages",a:"Hosting & Functions",k:"\u20AC0",s:"Free Tier",ok:true},{p:"Supabase",a:"Datenbank & Auth & Storage",k:"\u20AC0",s:"Free (500 MB)",ok:true},{p:"Stripe",a:"Zahlungsabwicklung",k:`\u20AC${stripeFee.toFixed(2)}`,s:"1,4% + \u20AC0,25/Transaktion",ok:true},{p:"Anthropic Claude",a:"Website-Import KI",k:"~\u20AC0,001",s:"Pro Import-Vorgang",ok:true},{p:"Domain siteready.at",a:"Jaehrliche Registrierung",k:"~\u20AC0,83",s:"~\u20AC10 / Jahr",ok:true}].map((r,i)=>(
                    <tr key={i} style={{background:i%2===0?"#fff":"#fafbfc"}}>
                      <td style={{padding:"10px 14px",fontWeight:600,color:T.dark}}>{r.p}</td>
                      <td style={{padding:"10px 14px",color:T.textSub,fontSize:".82rem"}}>{r.a}</td>
                      <td style={{padding:"10px 14px",fontWeight:700,color:T.dark,fontFamily:T.mono}}>{r.k}</td>
                      <td style={{padding:"10px 14px"}}><span style={{fontSize:".72rem",padding:"3px 9px",borderRadius:4,background:r.ok?T.greenLight:"#fef2f2",color:r.ok?T.green:T.red,fontWeight:700}}>{r.s}</span></td>
                    </tr>))}
                  <tr style={{background:T.bg,borderTop:`2px solid ${T.bg3}`}}>
                    <td colSpan={2} style={{padding:"12px 14px",fontWeight:800,color:T.dark}}>Gesamt variable Kosten</td>
                    <td style={{padding:"12px 14px",fontWeight:800,color:T.dark,fontFamily:T.mono}}>{"\u20AC"}{(0.83+stripeFee).toFixed(2)}</td>
                    <td style={{padding:"12px 14px"}}><span style={{fontSize:".72rem",padding:"3px 9px",borderRadius:4,background:T.accentLight,color:T.accent,fontWeight:700}}>Netto-MRR: {"\u20AC"}{netto}</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>);
        })()}
      </div>

      {/* Detail Drawer */}
      {sel&&(<div style={{width:380,background:"#fff",borderLeft:`1px solid ${T.bg3}`,overflowY:"auto",padding:24,flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
          <h3 style={{margin:0,fontSize:"1rem",fontWeight:800,color:T.dark}}>{sel.firmenname||"—"}</h3>
          <button onClick={()=>setSel(null)} style={{background:"none",border:"none",fontSize:"1.2rem",cursor:"pointer",color:T.textMuted,padding:4}}>&times;</button>
        </div>
        <StatusBadge status={sel.status}/>
        {sel.regen_requested&&<div style={{display:"flex",alignItems:"flex-start",gap:10,marginTop:10,padding:"10px 14px",background:"#fef3c7",borderRadius:T.rSm,border:"1px solid #fcd34d"}}>
          <span style={{fontSize:"1rem",flexShrink:0}}>{"\u21BB"}</span>
          <div>
            <div style={{fontWeight:700,color:"#92400e",fontSize:".78rem"}}>Neugenierung angefragt</div>
            <div style={{fontSize:".72rem",color:"#78350f"}}>Kunde hat Aenderungen eingereicht</div>
          </div>
        </div>}
        <div style={{marginTop:16,display:"flex",gap:6,flexWrap:"wrap"}}>
          {STATUS_FLOW.filter(s=>s!==sel.status).map(s=><button key={s} onClick={()=>updateOrder(sel.id,{status:s})} style={{padding:"4px 12px",border:`2px solid ${STATUS_COLORS[s]}33`,borderRadius:T.rSm,background:STATUS_COLORS[s]+"11",color:STATUS_COLORS[s],cursor:"pointer",fontSize:".72rem",fontWeight:700,fontFamily:T.font}}>{STATUS_LABELS[s]}</button>)}
        </div>
        <div style={{marginTop:20,display:"flex",flexDirection:"column",gap:6}}>
          {[["E-Mail",sel.email],["Branche",sel.branche_label],["Telefon",sel.telefon],["Adresse",[sel.adresse,[sel.plz,sel.ort].filter(Boolean).join(" ")].filter(Boolean).join(", ")],["UID",sel.uid_nummer],["Unternehmensform",sel.unternehmensform],["Firmenbuch",sel.firmenbuchnummer],["GISA",sel.gisazahl],["Stil",sel.stil],["Fotos",sel.fotos?"Ja":"Nein"],["Subdomain",sel.subdomain],["Bestellt",fmtDate(sel.created_at)]].map(([l,v])=>v?<div key={l} style={{display:"grid",gridTemplateColumns:"110px 1fr",padding:"7px 0",borderBottom:`1px solid ${T.bg3}`,fontSize:".82rem"}}>
            <span style={{color:T.textMuted,fontWeight:600}}>{l}</span><span style={{color:T.dark}}>{v}</span>
          </div>:null)}
        </div>
        {sel.leistungen?.length>0&&<div style={{marginTop:12}}>
          <div style={{fontSize:".72rem",fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:".08em",marginBottom:6}}>Leistungen</div>
          {sel.leistungen.map((l,i)=><div key={i} style={{fontSize:".82rem",color:T.dark,padding:"4px 0",borderBottom:`1px solid ${T.bg3}`}}>{l}</div>)}
        </div>}
        {/* Deployment Checkliste */}
        <div style={{marginTop:16}}>
          <div style={{fontSize:".72rem",fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:".08em",marginBottom:8}}>Deployment-Status</div>
          {(()=>{
            const s=sel.status;
            const built=["in_arbeit","review","live"].includes(s);
            const reviewed=["review","live"].includes(s);
            const live=s==="live";
            const checks=[
              {l:"Website erstellt",ok:built,warn:!built&&s==="paid"},
              {l:"SSL-Zertifikat",ok:built},
              {l:"Impressum (ECG)",ok:built},
              {l:"DSGVO-Erklaerung",ok:built},
              {l:"robots.txt",ok:built},
              {l:"sitemap.xml",ok:built},
              {l:"Google-Indexierung",ok:live,warn:reviewed&&!live},
              {l:"Domain aktiv",ok:live},
            ];
            return checks.map(({l,ok,warn})=>{
              const color=ok?T.green:warn?"#f59e0b":T.textMuted;
              const icon=ok?"\u2713":warn?"\u23F3":"\u2013";
              const bg=ok?T.greenLight:warn?"#fef3c7":T.bg;
              return(<div key={l} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"6px 10px",borderRadius:T.rSm,background:bg,marginBottom:3}}>
                <span style={{fontSize:".78rem",color:T.dark}}>{l}</span>
                <span style={{fontSize:".78rem",fontWeight:700,color,fontFamily:T.mono}}>{icon}</span>
              </div>);
            });
          })()}
        </div>
        {/* Regen-Kontingent */}
        <div style={{marginTop:14,padding:"14px",background:T.bg,borderRadius:T.rSm,border:`1px solid ${T.bg3}`}}>
          <div style={{fontSize:".72rem",fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:".08em",marginBottom:8}}>Neugenierungen (30 Tage)</div>
          {(()=>{
            const ago30=Date.now()-30*24*60*60*1000;
            const dates=[sel.last_regen_at,sel.prev_regen_at].filter(Boolean).map(d=>new Date(d));
            const recent=dates.filter(d=>d.getTime()>ago30);
            const used=recent.length;
            const nextFree=used>=2?new Date(recent.sort((a,b)=>a-b)[0].getTime()+30*24*60*60*1000):null;
            return(<>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                {[0,1].map(i=><div key={i} style={{width:12,height:12,borderRadius:"50%",background:i<used?"#d97706":"#e2e8f0"}}/>)}
                <span style={{fontSize:".78rem",color:T.dark,fontWeight:600}}>{used}/2 verwendet</span>
                {nextFree&&<span style={{fontSize:".72rem",color:T.textMuted}}>Slot frei ab {nextFree.toLocaleDateString("de-AT",{day:"2-digit",month:"2-digit",year:"numeric"})}</span>}
              </div>
              {dates.map((d,i)=><div key={i} style={{fontSize:".72rem",color:T.textMuted,padding:"2px 0"}}>{i===0?"Zuletzt":"Davor"}: {d.toLocaleDateString("de-AT",{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"})}</div>)}
            </>);
          })()}
        </div>
        {/* Website generieren */}
        <div style={{marginTop:14,padding:"14px",background:T.bg,borderRadius:T.rSm,border:`1px solid ${T.bg3}`}}>
          <div style={{fontSize:".72rem",fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:".08em",marginBottom:8}}>Website</div>
          {sel.website_html&&sel.subdomain&&<a href={`https://sitereadyprototype.pages.dev/s/${sel.subdomain}`} target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:6,fontSize:".82rem",color:T.green,fontWeight:600,marginBottom:10,textDecoration:"none"}}>
            {"\uD83D\uDD17"} /s/{sel.subdomain}
          </a>}
          <div>
            <button onClick={()=>generateWebsite(sel.id)} disabled={genLoading[sel.id]} style={{padding:"8px 16px",border:"none",borderRadius:T.rSm,background:genLoading[sel.id]?"#94a3b8":T.dark,color:"#fff",cursor:genLoading[sel.id]?"wait":"pointer",fontSize:".82rem",fontWeight:700,fontFamily:T.font,transition:"background .2s"}}>
              {genLoading[sel.id]?"Generiert (ca. 30s)...":sel.website_html?"Website neu generieren":"\u2728 Website generieren"}
            </button>
          </div>
          {genMsg[sel.id]&&<div style={{marginTop:8,fontSize:".78rem",color:genMsg[sel.id].startsWith("Fehler")||genMsg[sel.id].startsWith("Netzwerk")?T.red:T.green,fontWeight:600}}>{genMsg[sel.id]}</div>}
          {(()=>{const ready=sel.status==="review"&&!!sel.website_html;return(<button onClick={ready?()=>updateOrder(sel.id,{status:"live"}):undefined} disabled={!ready} style={{marginTop:8,padding:"8px 16px",border:"none",borderRadius:T.rSm,background:ready?T.green:"#e2e8f0",color:ready?"#fff":"#94a3b8",cursor:ready?"pointer":"default",fontSize:".82rem",fontWeight:700,fontFamily:T.font,width:"100%",transition:"background .2s"}}>
            {"\uD83D\uDE80"} {sel.status==="live"?"Bereits live":ready?"Live setzen":"Live setzen (noch nicht bereit)"}
          </button>);})()}
        </div>
        <div style={{marginTop:14}}>
          <div style={{fontSize:".72rem",fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:".08em",marginBottom:6}}>Interne Notiz</div>
          <textarea value={notiz[sel.id]||""} onChange={e=>setNotiz(n=>({...n,[sel.id]:e.target.value}))} placeholder="Notiz hinzufuegen..." rows={3} style={{width:"100%",padding:"10px 12px",border:`2px solid ${T.bg3}`,borderRadius:T.rSm,fontSize:".82rem",fontFamily:T.font,resize:"vertical",boxSizing:"border-box",outline:"none"}}/>
          <button onClick={()=>saveNotiz(sel.id)} style={{marginTop:6,padding:"7px 16px",border:"none",borderRadius:T.rSm,background:T.dark,color:"#fff",cursor:"pointer",fontSize:".78rem",fontWeight:700,fontFamily:T.font}}>
            {notizSaved[sel.id]?"\u2713 Gespeichert":"Notiz speichern"}
          </button>
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
    // Browser Zurueck/Vor
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

  // Admin Dashboard (key-geschuetzt)
  const adminKey=process.env.REACT_APP_ADMIN_KEY;
  const urlKey=new URLSearchParams(window.location.search).get("key");
  if(window.location.pathname==="/admin"&&adminKey&&urlKey===adminKey)return<Admin adminKey={adminKey}/>;

  if(paymentStatus==="success"){
    const pendingEmail=localStorage.getItem("sr_pending_email")||"";
    return(
    <div style={{minHeight:"100vh",background:"#fff",fontFamily:T.font,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:0,textAlign:"center",padding:"0 24px"}}><style>{css}</style>
      <div style={{width:72,height:72,borderRadius:"50%",background:T.greenLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"2rem",marginBottom:24,border:"2px solid rgba(22,163,74,.2)"}}>{"\u2713"}</div>
      <h1 style={{fontSize:"2rem",fontWeight:800,color:T.dark,margin:"0 0 12px",letterSpacing:"-.03em"}}>Zahlung erfolgreich!</h1>
      <p style={{color:T.textSub,fontSize:".95rem",lineHeight:1.7,maxWidth:440,margin:"0 0 8px"}}>Vielen Dank fuer Ihre Bestellung. Erstellen Sie jetzt Ihr Portal-Konto, um Logo, Fotos und Daten jederzeit selbst anzupassen.</p>
      {pendingEmail&&<div style={{background:T.bg,border:`1px solid ${T.bg3}`,borderRadius:T.rSm,padding:"12px 20px",marginBottom:24,fontSize:".88rem",color:T.textSub}}>
        Empfohlene E-Mail: <strong style={{color:T.dark}}>{pendingEmail}</strong>
      </div>}
      <div style={{display:"flex",flexDirection:"column",gap:10,width:"100%",maxWidth:320}}>
        <button onClick={()=>{localStorage.removeItem("sr_pending_email");setPage("portal-login");}} style={{padding:"14px 32px",border:"none",borderRadius:T.rSm,background:T.dark,color:"#fff",fontSize:".95rem",fontWeight:700,fontFamily:T.font,cursor:"pointer",boxShadow:"0 2px 16px rgba(0,0,0,.12)"}}>
          Jetzt Konto erstellen &rarr;
        </button>
        <button onClick={()=>{localStorage.removeItem("sr_pending_email");setPage("portal-login");}} style={{padding:"12px 32px",border:`2px solid ${T.bg3}`,borderRadius:T.rSm,background:"#fff",color:T.textSub,fontSize:".88rem",fontWeight:600,fontFamily:T.font,cursor:"pointer"}}>
          Bereits registriert? Anmelden
        </button>
      </div>
    </div>
  );};

  if(paymentStatus==="canceled")return(
    <div style={{minHeight:"100vh",background:"#fff",fontFamily:T.font,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:16,textAlign:"center",padding:"0 24px"}}><style>{css}</style>
      <div style={{fontSize:"1.4rem",fontWeight:800,color:T.dark}}>Zahlung abgebrochen</div>
      <p style={{color:T.textSub,fontSize:".9rem",maxWidth:380}}>Ihre Bestellung wurde noch nicht abgeschlossen. Sie koennen es jederzeit erneut versuchen.</p>
      <button onClick={()=>setPaymentStatus(null)} style={{padding:"12px 24px",border:"none",borderRadius:T.rSm,background:T.dark,color:"#fff",fontSize:".88rem",fontWeight:700,fontFamily:T.font,cursor:"pointer"}}>Zurueck zur Startseite</button>
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
