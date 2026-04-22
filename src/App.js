import React, { useState, useCallback, useRef, useEffect } from "react";
import Cropper from "react-easy-crop";
import { supabase } from "./supabase";
import "./errors";
import {
  normalizeSocial,
  BRANCHEN, GRUPPEN_PALETTEN, BRANCHEN_ACCENTS,
  getBrancheFeatures, getBrancheGruppe,
  BUNDESLAENDER, OEFFNUNGSZEITEN, UNTERNEHMENSFORMEN,
  IMPRESSUM_REQUIRED, IMPRESSUM_LABELS, getMissingImpressumFields,
  STYLES_MAP, ACCENT_PRESETS,
  ensureContrast, contrastRatioVsWhite, buildPaletteFromAccent, suggestPalettesFromAccent,
  getCtaDefault,
  INIT,
} from "./data";
import { CTA, CTA_G, CTA_L, T, LP_FONT, css } from "./theme";
import Admin from "./pages/Admin";

/* ═══ LANDING PAGE ═══ */
function LandingPage({onStart,onPortal}){
  const[scrolled,setScrolled]=useState(false);
  const[menuOpen,setMenuOpen]=useState(false);
  const[pricingYearly,setPricingYearly]=useState(true);
  const[mockIdx,setMockIdx]=useState(0);
  const[faqOpen,setFaqOpen]=useState({});
  const[hovCard,setHovCard]=useState(null);
  const[showCompare,setShowCompare]=useState(false);
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

  const MOCKUPS=[
    {url:"meier-elektrotechnik.siteready.at",name:"Meier Elektrotechnik",sub:"Elektroinstallationen",region:"Wien & Umgebung",badge:"24h Notdienst",grad:"linear-gradient(160deg,#111111 0%,#1a1e24 50%,#2B2F36 100%)",items:["Elektroinstallationen","Smart Home","Photovoltaik"]},
    {url:"beauty-by-lisa.siteready.at",name:"Beauty by Lisa",sub:"Kosmetikstudio",region:"Graz",badge:"Online buchen",grad:"linear-gradient(160deg,#3a3f48 0%,#4a5060 50%,#5a6070 100%)",items:["Gesichtsbehandlungen","Waxing","Anti-Aging"]},
    {url:"holzbau-gruber.siteready.at",name:"Holzbau Gruber",sub:"Zimmerei & Holzbau",region:"Salzburg",badge:"Meisterbetrieb",grad:"linear-gradient(160deg,#2B2F36 0%,#3a3f48 50%,#4a5060 100%)",items:["Dachstühle","Carports","Holzfassaden"]}
  ];
  const mock=MOCKUPS[mockIdx];

  return(<div style={{background:T.bg,color:T.text,overflowX:"hidden",fontFamily:LP_FONT}}><style>{css}</style>

  {/* NAV */}
  <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,background:scrolled?"rgba(245,245,242,.96)":"transparent",backdropFilter:scrolled?"blur(20px)":"none",WebkitBackdropFilter:scrolled?"blur(20px)":"none",borderBottom:scrolled?"1px solid rgba(0,0,0,.07)":"1px solid transparent",transition:"all .3s"}}>
    <div className="lp-w" style={{maxWidth:1200,margin:"0 auto",padding:"0 56px",display:"flex",alignItems:"center",justifyContent:"space-between",height:80}}>
      <img src="/logo.png" alt="SiteReady" style={{height:56,filter:scrolled?"none":"brightness(0) invert(1)",transition:"filter .3s"}}/>
      <div className="lp-nav-links" style={{display:"flex",gap:32,alignItems:"center"}}>
        {[["#problem","Problem"],["#how","So funktionierts"],["#preise","Preise"],["#vergleich","Vergleich"]].map(([h,l])=><a key={h} href={h} style={{fontSize:".9rem",fontWeight:400,color:scrolled?T.textSub:"rgba(255,255,255,.7)",textDecoration:"none",transition:"color .3s",textUnderlineOffset:"4px",fontFamily:LP_FONT}} onMouseEnter={e=>{e.target.style.color=scrolled?T.dark:"#fff";e.target.style.textDecoration="underline"}} onMouseLeave={e=>{e.target.style.color=scrolled?T.textSub:"rgba(255,255,255,.7)";e.target.style.textDecoration="none"}}>{l}</a>)}
        <button onClick={onPortal} style={{background:"transparent",color:scrolled?T.textSub:"rgba(255,255,255,.7)",padding:"10px 18px",borderRadius:6,fontWeight:500,fontSize:".9rem",border:"none",cursor:"pointer",fontFamily:LP_FONT,minHeight:44,transition:"color .3s"}}>Kunden-Portal</button>
        <button onClick={onStart} className="lp-btn-cta" style={{background:scrolled?CTA:"#fff",color:scrolled?"#fff":T.dark,padding:"10px 24px",borderRadius:6,fontWeight:500,fontSize:".9rem",border:"none",cursor:"pointer",fontFamily:LP_FONT,minHeight:44,transition:"all .3s"}}>Jetzt starten</button>
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
        <button onClick={()=>{closeMenu();onPortal();}} style={{padding:"12px",borderRadius:8,fontWeight:600,fontSize:".92rem",border:`1.5px solid ${T.bg3}`,background:"#fff",color:T.textSub,cursor:"pointer",fontFamily:T.font,minHeight:44}}>Kunden-Portal</button>
        <button onClick={()=>{closeMenu();onStart();}} className="lp-btn-cta" style={{padding:"12px",borderRadius:8,fontWeight:700,fontSize:".92rem",border:"none",background:CTA,color:"#fff",cursor:"pointer",fontFamily:T.font,minHeight:44}}>Jetzt starten</button>
      </div>
    </div>
  </div>}

  {/* HERO - Full-width dark */}
  <section style={{background:T.dark,paddingTop:80,minHeight:"100dvh",position:"relative",overflow:"hidden",display:"flex",flexDirection:"column"}}>
    <div style={{position:"absolute",top:"-30%",right:"-15%",width:800,height:800,borderRadius:"50%",background:`radial-gradient(circle,rgba(24,95,165,.08) 0%,transparent 60%)`,pointerEvents:"none"}}/>
    <div style={{position:"absolute",bottom:"-20%",left:"-10%",width:600,height:600,borderRadius:"50%",background:"radial-gradient(circle,rgba(143,163,184,.06) 0%,transparent 60%)",pointerEvents:"none"}}/>
    <W s={{position:"relative",zIndex:1,width:"100%"}}>
      <div className="lp-hero-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:72,alignItems:"center",padding:"80px 0 0"}}>
        <div>
          <h1 style={{fontSize:"clamp(2.8rem,4.5vw,3.8rem)",fontWeight:300,lineHeight:1.1,letterSpacing:"-.03em",color:"#fff",marginBottom:24,opacity:0,animation:"fadeUp .7s cubic-bezier(.22,1,.36,1) .15s both"}}>Ihre Website.<br/>In <span style={{position:"relative",display:"inline-block"}}><span style={{position:"relative",zIndex:1,fontWeight:600}}>wenigen Minuten</span><span style={{position:"absolute",bottom:2,left:"-4%",right:"-4%",height:"30%",background:`linear-gradient(90deg,${CTA},rgba(24,95,165,.4))`,borderRadius:4,zIndex:0,opacity:.5,animation:"highlightGrow .8s cubic-bezier(.22,1,.36,1) .6s both"}}/></span>.</h1>
          <p style={{fontSize:"1.1rem",color:"rgba(255,255,255,.55)",lineHeight:1.7,maxWidth:440,marginBottom:40,opacity:0,animation:"fadeUp .7s cubic-bezier(.22,1,.36,1) .3s both"}}>Impressum nach ECG, DSGVO und SEO-Optimierung inklusive. Bestehende Website importieren oder in 10 Minuten ausfüllen. Fertig.</p>
          <div className="lp-hero-btns" style={{display:"flex",gap:12,marginBottom:28,opacity:0,animation:"fadeUp .7s cubic-bezier(.22,1,.36,1) .45s both"}}>
            <button onClick={onStart} className="lp-btn-cta" style={{padding:"16px 36px",borderRadius:6,fontSize:"1rem",fontWeight:500,border:"none",cursor:"pointer",background:CTA,color:"#fff",fontFamily:LP_FONT,minHeight:52,boxShadow:`0 4px 20px ${CTA_G}`}}>Jetzt starten</button>
            <a href="#how" style={{padding:"14px 24px",borderRadius:6,fontSize:".95rem",fontWeight:500,textDecoration:"none",color:"rgba(255,255,255,.7)",border:"1px solid rgba(255,255,255,.15)",display:"inline-flex",alignItems:"center",minHeight:44,fontFamily:LP_FONT}}>Mehr erfahren</a>
          </div>
          <div className="lp-hero-stats" style={{display:"inline-flex",gap:10,marginBottom:0,opacity:0,animation:"fadeUp .7s cubic-bezier(.22,1,.36,1) .6s both"}}>
            {[{v:"10 Min",l:"bis fertig"},{v:"ab 16€",l:"pro Monat"},{v:"70+",l:"Berufe"},{v:"120k+",l:"Zielgruppe"}].map((s,i)=><span key={i} style={{display:"inline-flex",alignItems:"center",gap:7,background:"rgba(255,255,255,.1)",border:"1px solid rgba(255,255,255,.12)",padding:"8px 18px",borderRadius:100,fontSize:".8rem",color:"rgba(255,255,255,.7)"}}><span style={{fontFamily:T.mono,fontWeight:700,color:"#fff"}}>{s.v}</span>{s.l}</span>)}
          </div>
        </div>
        <div className="lp-hero-mock" style={{position:"relative",marginBottom:-80}}>
          <div style={{background:"#fff",borderRadius:16,overflow:"hidden",boxShadow:"0 32px 72px rgba(0,0,0,.25)",border:"1px solid rgba(255,255,255,.1)"}}>
            <div style={{display:"flex",alignItems:"center",gap:6,padding:"12px 16px",background:"#f5f5f7",borderBottom:"1px solid rgba(0,0,0,.07)"}}>
              {["#ff5f57","#febc2e","#28c840"].map(c=><span key={c} style={{width:10,height:10,borderRadius:"50%",background:c}}/>)}
              <div style={{marginLeft:12,background:"#fff",borderRadius:6,padding:"5px 14px",fontSize:".75rem",fontFamily:T.mono,color:T.textMuted,flex:1,border:"1px solid rgba(0,0,0,.07)",transition:"all .3s"}}>{mock.url}</div>
              <div style={{background:T.greenLight,color:T.green,fontSize:".75rem",fontWeight:700,padding:"3px 10px",borderRadius:5,textTransform:"uppercase",letterSpacing:".06em"}}>Live</div>
            </div>
            <div style={{height:3,background:CTA,transition:"all .6s"}}/>
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
            {[0,1,2].map(i=><div key={i} style={{width:mockIdx===i?24:8,height:8,borderRadius:4,background:mockIdx===i?CTA:T.bg3,transition:"all .4s cubic-bezier(.22,1,.36,1)",cursor:"pointer"}} onClick={()=>setMockIdx(i)}/>)}
          </div>
        </div>
      </div>
    </W>
    {/* Trust Badges — inside Hero */}
    <div style={{marginTop:"auto",borderTop:"1px solid rgba(255,255,255,.06)",padding:"24px 0"}}>
      <W>
        <div className="lp-trust-bar" style={{display:"flex",justifyContent:"center",gap:32,flexWrap:"wrap",alignItems:"center"}}>
          {[{icon:<IconShield/>,text:"SSL verschlüsselt"},{icon:<IconScale/>,text:"DSGVO & ECG inklusive"},{icon:<IconSearch/>,text:"Google-optimiert"},{icon:<IconGlobe/>,text:"Österreich-spezifisch"}].map((t,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:8,color:"rgba(255,255,255,.4)",fontSize:".78rem",fontWeight:400}}><span style={{display:"flex",color:"rgba(255,255,255,.3)"}}>{React.cloneElement(t.icon,{width:"16",height:"16"})}</span>{t.text}</div>)}
        </div>
      </W>
    </div>
  </section>

  {/* PROBLEM + SOLUTION */}
  <section id="problem" className="lp-sec sr-reveal" style={{padding:"96px 0",background:"#fff",borderTop:`1px solid rgba(0,0,0,.04)`}}>
    <W>
      <div className="lp-problem-grid" style={{display:"grid",gridTemplateColumns:"5fr 7fr",gap:64,alignItems:"start"}}>
        <div>
          <div style={{fontSize:".75rem",fontWeight:500,color:CTA,letterSpacing:".1em",textTransform:"uppercase",marginBottom:12}}>Das Problem</div>
          <h2 style={{fontSize:"clamp(1.6rem,3vw,2.2rem)",fontWeight:600,lineHeight:1.3,letterSpacing:"-.02em",color:T.dark,marginBottom:40,maxWidth:420}}>Handwerker wollen Kunden {"–"} nicht stundenlang Webdesign.</h2>
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
              {["Website fertig in Minuten","Live-Vorschau vor Kauf","Impressum nach ECG","DSGVO automatisch","SSL inklusive","70+ Branchen","Website-Import","Self-Service-Portal","Eigene Domain möglich","Österreich-spezifisch"].map(l=><span key={l} style={{fontSize:".75rem",padding:"6px 13px",borderRadius:6,fontWeight:600,background:"rgba(255,255,255,.08)",color:T.accent,border:"1px solid rgba(255,255,255,.1)",display:"inline-flex",alignItems:"center",gap:4}}><IconCheck/>{l}</span>)}
            </div>
            {/* Before/After */}
            <div style={{background:"rgba(255,255,255,.04)",borderRadius:12,padding:"20px",marginBottom:28,border:"1px solid rgba(255,255,255,.08)"}}>
              <div className="lp-ba-grid" style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:16,alignItems:"center"}}>
                <div style={{textAlign:"center"}}>
                  <div style={{fontSize:".65rem",fontWeight:700,color:"rgba(255,255,255,.35)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:8}}>Vorher</div>
                  <div style={{background:"rgba(255,255,255,.05)",borderRadius:8,padding:"14px 12px",border:"1px dashed rgba(255,255,255,.1)"}}>
                    <div style={{fontSize:".75rem",color:"rgba(255,255,255,.3)",lineHeight:1.7}}>Keine Website{"\n"}Kein Impressum{"\n"}Nicht bei Google</div>
                  </div>
                </div>
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={CTA} strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  <span style={{fontSize:".65rem",fontWeight:700,color:CTA}}>10 Min</span>
                </div>
                <div style={{textAlign:"center"}}>
                  <div style={{fontSize:".65rem",fontWeight:700,color:CTA,textTransform:"uppercase",letterSpacing:".1em",marginBottom:8}}>Nachher</div>
                  <div style={{background:"rgba(24,95,165,.1)",borderRadius:8,padding:"14px 12px",border:"1px solid rgba(24,95,165,.2)"}}>
                    <div style={{fontSize:".75rem",color:"rgba(255,255,255,.7)",lineHeight:1.7,fontWeight:500}}>Profi-Website{"\n"}ECG + DSGVO{"\n"}Bei Google sichtbar</div>
                  </div>
                </div>
              </div>
            </div>
            <button onClick={onStart} className="lp-btn-cta" style={{padding:"12px 28px",borderRadius:6,fontSize:".88rem",fontWeight:500,border:"none",cursor:"pointer",background:CTA,color:"#fff",fontFamily:LP_FONT,minHeight:44,boxShadow:`0 4px 20px ${CTA_G}`}}>Jetzt testen</button>
          </div>
        </div>
      </div>
    </W>
  </section>

  {/* HOW IT WORKS - Timeline */}
  <section id="how" className="lp-sec sr-reveal" style={{padding:"96px 0",background:T.bg}}>
    <W>
      <div style={{marginBottom:64}}>
        <div style={{fontSize:".75rem",fontWeight:500,color:CTA,letterSpacing:".1em",textTransform:"uppercase",marginBottom:12}}>So funktionierts</div>
        <h2 style={{fontSize:"clamp(1.6rem,3vw,2.2rem)",fontWeight:600,lineHeight:1.3,letterSpacing:"-.02em",color:T.dark}}>Drei Schritte. Null Aufwand.</h2>
      </div>
      <div style={{position:"relative",paddingTop:24}}>
        <div className="lp-steps-line" style={{position:"absolute",top:44,left:"10%",right:"10%",height:2,background:CTA,opacity:.15}}/>
        <div className="lp-steps-grid" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:24,position:"relative",maxWidth:900,margin:"0 auto"}}>
          {[{n:"01",icon:<IconClipboard/>,t:"Ausfüllen",d:"Bestehende Website importieren oder kurzen Fragebogen beantworten. Dauert ca. 10 Minuten."},{n:"02",icon:<IconRocket/>,t:"Sofort live",d:"Ihre Website wird automatisch erstellt — mit Impressum, DSGVO und SSL. Sofort bei Google sichtbar."},{n:"03",icon:<IconGear/>,t:"Anpassen",d:"Im Self-Service-Portal: Logo, Fotos, Texte und Domain jederzeit selbst ändern."}].map((s,i)=><div key={i} style={{textAlign:"center",background:"#fff",borderRadius:12,padding:"36px 24px 32px",border:"1px solid rgba(0,0,0,.06)",boxShadow:"0 1px 3px rgba(0,0,0,.1)",transition:"transform .25s,box-shadow .25s",cursor:"default"}} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 4px 16px rgba(0,0,0,.08)"}} onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 1px 3px rgba(0,0,0,.1)"}}>
            <div style={{width:48,height:48,borderRadius:"50%",background:CTA_L,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",color:CTA,position:"relative",zIndex:1}}>
              <span style={{fontFamily:T.mono,fontSize:".85rem",fontWeight:600}}>{s.n}</span>
            </div>
            <div style={{display:"flex",justifyContent:"center",marginBottom:12,color:T.dark}}>{s.icon}</div>
            <h3 style={{fontSize:".95rem",fontWeight:600,color:T.dark,marginBottom:8}}>{s.t}</h3>
            <p style={{fontSize:".84rem",color:T.textMuted,lineHeight:1.65}}>{s.d}</p>
          </div>)}
        </div>
      </div>
    </W>
  </section>

  {/* ZWISCHEN-CTA */}
  <section className="sr-reveal" style={{padding:"48px 0",background:"#fff",borderTop:"1px solid rgba(0,0,0,.04)"}}>
    <W>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:20}}>
        <div>
          <div style={{fontSize:"1.2rem",fontWeight:800,color:T.dark,letterSpacing:"-.02em"}}>Überzeugt? Starten Sie jetzt kostenlos.</div>
          <div style={{fontSize:".88rem",color:T.textMuted,marginTop:4}}>7 Tage gratis testen — keine Kreditkarte nötig.</div>
        </div>
        <button onClick={onStart} className="lp-btn-cta" style={{padding:"12px 28px",borderRadius:6,fontSize:".9rem",fontWeight:500,border:"none",cursor:"pointer",background:CTA,color:"#fff",fontFamily:LP_FONT,minHeight:48,boxShadow:`0 4px 16px ${CTA_G}`}}>Jetzt Website erstellen</button>
      </div>
    </W>
  </section>

  {/* PRICING */}
  <section id="preise" className="lp-sec sr-reveal" style={{padding:"96px 0",background:"#fff",borderTop:"1px solid rgba(0,0,0,.04)"}}>
    <W>
      <div style={{marginBottom:48}}>
        <div style={{fontSize:".75rem",fontWeight:500,color:CTA,letterSpacing:".1em",textTransform:"uppercase",marginBottom:12}}>Preise</div>
        <h2 style={{fontSize:"clamp(1.6rem,3vw,2.2rem)",fontWeight:600,lineHeight:1.3,letterSpacing:"-.02em",color:T.dark,marginBottom:16}}>Transparent. Ohne Überraschungen.</h2>
        <p style={{fontSize:"1.05rem",color:T.textSub,lineHeight:1.75,maxWidth:480}}>7 Tage kostenlos testen. Jederzeit kündbar.</p>
      </div>
      {/* Monatlich/Jährlich Toggle */}
      <div style={{display:"flex",justifyContent:"center",marginBottom:32}}>
        <div style={{display:"flex",background:T.bg2,borderRadius:10,padding:4,position:"relative",maxWidth:280,width:"100%"}}>
          <div style={{position:"absolute",top:4,bottom:4,left:pricingYearly?"calc(50% + 2px)":"4px",width:"calc(50% - 6px)",background:"#fff",borderRadius:8,boxShadow:"0 2px 8px rgba(0,0,0,0.10)",transition:"left .25s cubic-bezier(.4,0,.2,1)",pointerEvents:"none"}}/>
          {[["monthly","Monatlich"],["yearly","Jährlich"]].map(([val,lbl])=>(
            <button key={val} onClick={()=>setPricingYearly(val==="yearly")} style={{flex:1,padding:"9px 0",border:"none",borderRadius:8,background:"transparent",fontFamily:T.font,fontWeight:700,fontSize:".82rem",color:pricingYearly===(val==="yearly")?T.dark:T.textMuted,cursor:"pointer",transition:"color .25s",position:"relative",zIndex:1,minHeight:44}}>
              {lbl}{val==="yearly"&&<span style={{marginLeft:6,fontSize:".75rem",fontWeight:700,color:CTA,background:"rgba(24,95,165,.08)",padding:"2px 7px",borderRadius:4}}>-12%</span>}
            </button>
          ))}
        </div>
      </div>
      {/* 3 Pricing Cards */}
      <div className="lp-pricing-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:20,maxWidth:1000}}>
        {/* Starter */}
        <div onMouseEnter={()=>setHovCard("st")} onMouseLeave={()=>setHovCard(null)} style={{background:"#fff",borderRadius:16,padding:"36px 28px",position:"relative",border:`1.5px solid ${T.bg3}`,boxShadow:hovCard==="st"?T.sh3:T.sh1,transform:hovCard==="st"?"translateY(-3px)":"none",transition:"transform .3s,box-shadow .3s"}}>
          <div style={{fontSize:".78rem",fontWeight:700,color:T.accent,letterSpacing:".06em",textTransform:"uppercase",marginBottom:6}}>Starter</div>
          <div style={{fontSize:".88rem",color:T.textMuted,marginBottom:20}}>Alles was Sie brauchen</div>
          <div style={{display:"flex",alignItems:"baseline",gap:4,marginBottom:4}}>
            <span style={{fontSize:"2.8rem",fontWeight:800,color:T.dark,fontFamily:T.mono,lineHeight:1,letterSpacing:"-.04em"}}>{pricingYearly?"€14":"€16"}</span>
            <span style={{fontSize:".85rem",color:T.textMuted,fontWeight:500}}>/Monat</span>
          </div>
          {pricingYearly
            ?<div style={{fontSize:".75rem",color:T.textMuted,marginBottom:24}}>{"€"}168 / Jahr &middot; statt {"€"}192</div>
            :<div style={{fontSize:".75rem",color:T.textMuted,marginBottom:24}}>Monatlich kündbar</div>}
          <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:28}}>
            {["Impressum + DSGVO automatisch","Website-Import in Sekunden","Google Maps & Kontaktformular","Digitale Visitenkarte (vCard)","SEO-optimiert für Google","Alles selbst änderbar — sofort live","Subdomain inklusive"].map(f=><div key={f} style={{display:"flex",alignItems:"center",gap:8,fontSize:".82rem",color:T.text}}><IconCheck/>{f}</div>)}
          </div>
          <button onClick={onStart} className="lp-btn-cta" style={{width:"100%",padding:14,borderRadius:6,fontSize:".88rem",fontWeight:500,cursor:"pointer",fontFamily:LP_FONT,border:"none",background:CTA,color:"#fff",minHeight:48,transition:"all .2s",boxShadow:`0 4px 16px ${CTA_G}`}}>Kostenlos testen</button>
        </div>
        {/* Professional */}
        <div onMouseEnter={()=>setHovCard("pr")} onMouseLeave={()=>setHovCard(null)} style={{background:"linear-gradient(180deg,rgba(24,95,165,.02) 0%,#fff 40%)",borderRadius:16,padding:"36px 28px",position:"relative",border:`2.5px solid ${CTA}`,boxShadow:hovCard==="pr"?`0 0 0 4px rgba(24,95,165,.08),${T.sh4}`:`0 0 0 4px rgba(24,95,165,.06),0 8px 32px rgba(0,0,0,0.10)`,transform:hovCard==="pr"?"translateY(-3px)":"translateY(-4px)",transition:"transform .3s,box-shadow .3s"}}>
          <span style={{position:"absolute",top:-13,left:28,background:CTA,color:"#fff",fontSize:".72rem",fontWeight:700,padding:"5px 14px",borderRadius:100,whiteSpace:"nowrap"}}>Empfohlen</span>
          <div style={{fontSize:".78rem",fontWeight:700,color:T.accent,letterSpacing:".06em",textTransform:"uppercase",marginBottom:6}}>Professional</div>
          <div style={{fontSize:".88rem",color:T.textMuted,marginBottom:20}}>Für etablierte Betriebe</div>
          <div style={{display:"flex",alignItems:"baseline",gap:4,marginBottom:4}}>
            <span style={{fontSize:"2.8rem",fontWeight:800,color:T.dark,fontFamily:T.mono,lineHeight:1,letterSpacing:"-.04em"}}>{pricingYearly?"€25":"€29"}</span>
            <span style={{fontSize:".85rem",color:T.textMuted,fontWeight:500}}>/Monat</span>
          </div>
          {pricingYearly
            ?<div style={{fontSize:".75rem",color:T.textMuted,marginBottom:24}}>{"€"}300 / Jahr &middot; statt {"€"}348</div>
            :<div style={{fontSize:".75rem",color:T.textMuted,marginBottom:24}}>Monatlich kündbar</div>}
          <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:28}}>
            {["Alles aus Starter","Eigene Domain (www.ihre-firma.at)","AI-Sichtbarkeit & Suchmaschinen-SEO","Besucher-Statistiken","Monatlicher Website-Report","Ohne SiteReady-Branding"].map((f,i)=><div key={f} style={{display:"flex",alignItems:"center",gap:8,fontSize:".82rem",color:i===0?T.textMuted:T.text,fontWeight:i===0?400:500}}>{i===0?<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.textMuted} strokeWidth="2" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>:<IconCheck/>}{f}</div>)}
          </div>
          <div style={{padding:"10px 14px",background:T.amberLight,borderRadius:T.rSm,border:`1px solid ${T.amberBorder}`,marginBottom:16,fontSize:".78rem",color:T.amberText,fontWeight:600,textAlign:"center"}}>Bald verfügbar</div>
          <button disabled style={{width:"100%",padding:14,borderRadius:10,fontSize:".92rem",fontWeight:700,cursor:"not-allowed",fontFamily:T.font,border:"none",background:T.bg3,color:T.textMuted,minHeight:48,opacity:.7}}>Bald verfügbar</button>
        </div>
        {/* Dritte Spalte: 3 kleine Karten gestapelt */}
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {/* Business */}
          <div style={{background:T.bg,borderRadius:12,padding:"20px 22px",border:`1.5px dashed ${T.bg3}`,flex:1,position:"relative"}}>
            <span style={{position:"absolute",top:-10,left:18,background:T.accent,color:"#fff",fontSize:".65rem",fontWeight:700,padding:"3px 10px",borderRadius:100,letterSpacing:".04em"}}>Coming Soon</span>
            <div style={{display:"flex",alignItems:"center",gap:14}}>
              <div style={{width:36,height:36,borderRadius:9,background:T.accentLight,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.accent} strokeWidth="2" strokeLinecap="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg></div>
              <div>
                <div style={{fontSize:".85rem",fontWeight:700,color:T.dark}}>Business</div>
                <div style={{fontSize:".72rem",color:T.textMuted,lineHeight:1.4}}>Alles aus Professional + Social Media Integration</div>
              </div>
            </div>
          </div>
          {/* Individuell */}
          <div style={{background:"#fff",borderRadius:12,padding:"20px 22px",border:`1px solid ${T.bg3}`,flex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:14}}>
              <div style={{width:36,height:36,borderRadius:9,background:T.accentLight,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.accent} strokeWidth="2" strokeLinecap="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg></div>
              <div>
                <div style={{fontSize:".85rem",fontWeight:700,color:T.dark}}>Individuell</div>
                <div style={{fontSize:".72rem",color:T.textMuted,lineHeight:1.4}}>Massgeschneiderte Website &middot; <span style={{fontWeight:600,color:T.accent}}>Auf Anfrage</span></div>
              </div>
            </div>
          </div>
          {/* Agentur */}
          <div style={{background:"#fff",borderRadius:12,padding:"20px 22px",border:`1px solid ${T.bg3}`,flex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:14}}>
              <div style={{width:36,height:36,borderRadius:9,background:T.accentLight,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.accent} strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
              <div>
                <div style={{fontSize:".85rem",fontWeight:700,color:T.dark}}>Agentur</div>
                <div style={{fontSize:".72rem",color:T.textMuted,lineHeight:1.4}}>Whitelabel für Agenturen &middot; <span style={{fontWeight:600,color:T.accent}}>Auf Anfrage</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p style={{fontSize:".78rem",color:T.textMuted,maxWidth:500,margin:"20px 0 0",lineHeight:1.7,textAlign:"center",marginLeft:"auto",marginRight:"auto"}}>7 Tage kostenlos &middot; Karte wird erst nach 7 Tagen belastet &middot; Alle Preise inkl. MwSt.</p>
      {/* Feature-Vergleich aufklappbar */}
      <div style={{textAlign:"center",marginTop:32}}>
        <button onClick={()=>setShowCompare(p=>!p)} style={{background:"none",border:`1.5px solid ${T.bg3}`,borderRadius:8,padding:"10px 24px",fontSize:".82rem",fontWeight:600,color:T.textSub,cursor:"pointer",fontFamily:LP_FONT,display:"inline-flex",alignItems:"center",gap:8,transition:"all .2s",minHeight:44}} onMouseEnter={e=>{e.currentTarget.style.borderColor=CTA;e.currentTarget.style.color=CTA}} onMouseLeave={e=>{e.currentTarget.style.borderColor=T.bg3;e.currentTarget.style.color=T.textSub}}>
          Alle Features vergleichen
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{transition:"transform .25s",transform:showCompare?"rotate(180deg)":"rotate(0)"}}><polyline points="6 9 12 15 18 9"/></svg>
        </button>
      </div>
      <div style={{maxHeight:showCompare?1200:0,overflow:"hidden",transition:"max-height .4s cubic-bezier(.22,1,.36,1)"}}>
        <div style={{maxWidth:700,margin:"32px auto 0"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:".82rem",fontFamily:LP_FONT}}>
            <thead>
              <tr style={{borderBottom:`2px solid ${T.bg3}`}}>
                <th style={{textAlign:"left",padding:"12px 16px",fontWeight:600,color:T.textMuted,fontSize:".72rem",letterSpacing:".06em",textTransform:"uppercase"}}>Feature</th>
                <th style={{textAlign:"center",padding:"12px 16px",fontWeight:700,color:T.dark,fontSize:".82rem"}}>Starter</th>
                <th style={{textAlign:"center",padding:"12px 16px",fontWeight:700,color:CTA,fontSize:".82rem"}}>Professional</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Website & Design",null,null],
                ["AI-generierte Website",true,true],
                ["3 Design-Stile + Firmenfarbe",true,true],
                ["Responsive Design",true,true],
                ["SSL-Zertifikat",true,true],
                ["Inhalte",null,null],
                ["Website-Import",true,true],
                ["Impressum + DSGVO automatisch",true,true],
                ["Kontaktformular",true,true],
                ["Self-Service-Portal",true,true],
                ["Logo & Fotos hochladen",true,true],
                ["FAQ, Team, Galerie, Partner",true,true],
                ["Hosting & Domain",null,null],
                ["Subdomain (firma.siteready.at)",true,true],
                ["Eigene Domain (www.firma.at)",false,true],
                ["Ohne SiteReady-Branding",false,true],
                ["SEO & Sichtbarkeit",null,null],
                ["Basis-SEO (Meta-Tags, Schema.org, Sitemap)",true,true],
                ["AI-Sichtbarkeit (ChatGPT, Perplexity & Co.)",false,true],
                ["Suchmaschinen-Indexierung",false,true],
                ["Besucher-Statistiken",false,true],
                ["Monatlicher Website-Report",false,true],
              ].map(([label,starter,pro],i)=>{
                const isGroup=starter===null;
                return <tr key={i} style={{borderBottom:`1px solid ${isGroup?"transparent":T.bg3}`,background:isGroup?"transparent":"#fff"}}>
                  <td style={{padding:isGroup?"20px 16px 8px 16px":"11px 16px",fontWeight:isGroup?700:400,color:isGroup?T.dark:T.text,fontSize:isGroup?".75rem":".82rem",letterSpacing:isGroup?".04em":"0",textTransform:isGroup?"uppercase":"none"}}>{label}</td>
                  {!isGroup&&<td style={{textAlign:"center",padding:"11px 16px"}}>{starter?<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.accent} strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>:<span style={{color:T.bg3,fontSize:"1.1rem"}}>—</span>}</td>}
                  {!isGroup&&<td style={{textAlign:"center",padding:"11px 16px"}}>{pro?<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={CTA} strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>:<span style={{color:T.bg3,fontSize:"1.1rem"}}>—</span>}</td>}
                  {isGroup&&<td colSpan={2}/>}
                </tr>;
              })}
            </tbody>
          </table>
        </div>
      </div>
    </W>
  </section>

  {/* WARUM SITEREADY */}
  <section id="vergleich" className="lp-sec sr-reveal" style={{padding:"96px 0",background:T.bg}}>
    <W>
      <div style={{marginBottom:56}}>
        <div style={{fontSize:".75rem",fontWeight:500,color:CTA,letterSpacing:".1em",textTransform:"uppercase",marginBottom:12}}>Warum SiteReady</div>
        <h2 style={{fontSize:"clamp(1.6rem,3vw,2.2rem)",fontWeight:600,lineHeight:1.3,letterSpacing:"-.02em",color:T.dark,maxWidth:520}}>Was uns von Baukästen und Agenturen unterscheidet.</h2>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}} className="lp-why-grid">
        {[
          {icon:<IconRocket/>,t:"Fertig in Minuten, nicht Wochen",d:"Keine Agentur-Termine, kein wochenlanges Warten. Sie füllen einen Fragebogen aus — Ihre Website ist sofort live."},
          {icon:<IconScale/>,t:"Impressum & Datenschutz inklusive",d:"Impressum nach ECG und DSGVO-Erklärung — automatisch und österreich-spezifisch erstellt. Keine Cookies, kein Cookie-Banner nötig."},
          {icon:<IconHammer/>,t:"Gemacht für Ihren Beruf",d:"Über 70 Branchen mit passenden Leistungen, Texten und Design. Kein generisches Template, sondern maßgeschneidert."},
          {icon:<IconSearch/>,t:"Sofort bei Google sichtbar",d:"SEO-Optimierung, Meta-Tags und Indexierung sind inklusive. Ihre Kunden finden Sie — nicht Ihren Mitbewerber."},
          {icon:<IconGear/>,t:"Alles selbst anpassen",d:"Logo, Fotos, Texte, Farben — ändern Sie alles jederzeit im Self-Service-Portal. Kein Techniker nötig."},
          {icon:<IconShield/>,t:"Keine versteckten Kosten",d:"SSL, Hosting, Updates, Support — alles inklusive. Ein Preis, keine Überraschungen. Monatlich kündbar."}
        ].map((c,i)=><div key={i} style={{background:"#fff",borderRadius:14,padding:"32px 28px",border:"1px solid rgba(0,0,0,.06)",boxShadow:T.sh1,display:"flex",gap:16,alignItems:"flex-start",transition:"transform .2s,box-shadow .2s",cursor:"default"}} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow=T.sh2}} onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow=T.sh1}}>
          <div style={{width:44,height:44,borderRadius:11,background:T.dark,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:"#fff"}}>{React.cloneElement(c.icon,{width:"20",height:"20"})}</div>
          <div>
            <div style={{fontSize:".95rem",fontWeight:700,color:T.dark,marginBottom:6}}>{c.t}</div>
            <div style={{fontSize:".84rem",color:T.textMuted,lineHeight:1.7}}>{c.d}</div>
          </div>
        </div>)}
      </div>
    </W>
  </section>

  {/* TESTIMONIALS */}
  <section className="lp-sec sr-reveal" style={{padding:"96px 0",background:"#fff",borderTop:"1px solid rgba(0,0,0,.04)"}}>
    <W>
      <div style={{marginBottom:52}}>
        <div style={{fontSize:".75rem",fontWeight:500,color:CTA,letterSpacing:".1em",textTransform:"uppercase",marginBottom:12}}>Kundenstimmen</div>
        <h2 style={{fontSize:"clamp(1.6rem,3vw,2.2rem)",fontWeight:600,lineHeight:1.3,letterSpacing:"-.02em",color:T.dark}}>Das sagen unsere Kunden.</h2>
      </div>
      <div className="lp-testi-stats" style={{display:"flex",gap:32,marginBottom:40,flexWrap:"wrap"}}>
        {[{v:"4.9/5",l:"Durchschnittsbewertung"},{v:"98%",l:"würden uns empfehlen"},{v:"<10 Min",l:"durchschnittliche Erstellzeit"}].map((s,i)=><div key={i} style={{display:"flex",alignItems:"baseline",gap:8}}><span style={{fontFamily:T.mono,fontSize:"1.4rem",fontWeight:800,color:T.dark}}>{s.v}</span><span style={{fontSize:".82rem",color:T.textMuted}}>{s.l}</span></div>)}
      </div>
      <div className="lp-testi-grid" style={{display:"grid",gridTemplateColumns:"1.3fr 1fr",gap:24,alignItems:"start"}}>
        <div onMouseEnter={()=>setHovCard("t1")} onMouseLeave={()=>setHovCard(null)} style={{background:"#fff",borderRadius:16,padding:"40px 36px",border:`1px solid ${T.bg3}`,boxShadow:hovCard==="t1"?T.sh3:T.sh2,transform:hovCard==="t1"?"translateY(-3px)":"none",transition:"transform .3s,box-shadow .3s"}}>
          <div style={{display:"flex",gap:4,marginBottom:20}}>{[1,2,3,4,5].map(s=><IconStar key={s}/>)}</div>
          <p style={{fontSize:"1.15rem",fontWeight:500,color:T.dark,lineHeight:1.7,marginBottom:16}}>Ich hab die Website in der Mittagspause ausgefüllt. Am nächsten Tag hat ein Kunde gesagt, er hat mich über Google gefunden. Das war der beste Business-Invest seit Jahren.</p>
          <div style={{display:"inline-flex",alignItems:"center",gap:6,background:`rgba(24,95,165,.06)`,border:`1px solid rgba(24,95,165,.12)`,borderRadius:6,padding:"6px 12px",fontSize:".75rem",fontWeight:700,color:CTA,marginBottom:20}}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>3 Neukunden im ersten Monat</div>
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            <div style={{width:48,height:48,borderRadius:"50%",background:"linear-gradient(135deg,#0f2b5b,#2563eb)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:".95rem"}}>TM</div>
            <div><div style={{fontWeight:700,fontSize:".92rem",color:T.dark}}>Thomas Meier</div><div style={{fontSize:".82rem",color:T.textMuted}}>Elektrotechnik, Wien</div></div>
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:24}}>
          <div onMouseEnter={()=>setHovCard("t2")} onMouseLeave={()=>setHovCard(null)} style={{background:"#fff",borderRadius:16,padding:"32px 32px",border:`1px solid ${T.bg3}`,boxShadow:hovCard==="t2"?T.sh2:T.sh1,transform:hovCard==="t2"?"translateY(-3px)":"none",transition:"transform .3s,box-shadow .3s"}}>
            <div style={{display:"flex",gap:4,marginBottom:14}}>{[1,2,3,4,5].map(s=><IconStar key={s}/>)}</div>
            <p style={{fontSize:".92rem",color:T.text,lineHeight:1.7,marginBottom:10}}>Endlich eine Lösung, die mitdenkt. Impressum, DSGVO – alles automatisch. Ich musste nichts selber schreiben.</p>
            <div style={{display:"inline-flex",alignItems:"center",gap:6,background:`rgba(24,95,165,.06)`,border:`1px solid rgba(24,95,165,.12)`,borderRadius:6,padding:"5px 10px",fontSize:".72rem",fontWeight:700,color:CTA,marginBottom:14}}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>Website in 8 Minuten fertig</div>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:36,height:36,borderRadius:"50%",background:"linear-gradient(135deg,#831843,#be185d)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:".78rem"}}>LK</div>
              <div><div style={{fontWeight:700,fontSize:".84rem",color:T.dark}}>Lisa Kogler</div><div style={{fontSize:".78rem",color:T.textMuted}}>Kosmetikstudio, Graz</div></div>
            </div>
          </div>
          <div onMouseEnter={()=>setHovCard("t3")} onMouseLeave={()=>setHovCard(null)} style={{background:"#fff",borderRadius:16,padding:"32px 32px",border:`1px solid ${T.bg3}`,boxShadow:hovCard==="t3"?T.sh2:T.sh1,transform:hovCard==="t3"?"translateY(-3px)":"none",transition:"transform .3s,box-shadow .3s"}}>
            <div style={{display:"flex",gap:4,marginBottom:14}}>{[1,2,3,4,5].map(s=><IconStar key={s}/>)}</div>
            <p style={{fontSize:".92rem",color:T.text,lineHeight:1.7,marginBottom:10}}>16 Euro im Monat statt 3.000 Euro an die Agentur. Und die Website sieht besser aus. Wahnsinn.</p>
            <div style={{display:"inline-flex",alignItems:"center",gap:6,background:`rgba(24,95,165,.06)`,border:`1px solid rgba(24,95,165,.12)`,borderRadius:6,padding:"5px 10px",fontSize:".72rem",fontWeight:700,color:CTA,marginBottom:14}}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>3.000 Euro gespart vs. Agentur</div>
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
          <div style={{fontSize:".75rem",fontWeight:500,color:CTA,letterSpacing:".1em",textTransform:"uppercase",marginBottom:12}}>FAQ</div>
          <h2 style={{fontSize:"clamp(1.6rem,3vw,2.2rem)",fontWeight:600,lineHeight:1.3,letterSpacing:"-.02em",color:T.dark,marginBottom:16}}>Häufige Fragen</h2>
          <p style={{fontSize:"1rem",color:T.textSub,lineHeight:1.7}}>Noch unsicher? Hier finden Sie Antworten auf die wichtigsten Fragen.</p>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:0}}>
          {[
            {q:"Wie lange dauert es, bis meine Website online ist?",a:"Nach dem Ausfüllen des Fragebogens (ca. 10 Minuten) ist Ihre Website sofort live. Impressum, DSGVO und SSL sind automatisch eingerichtet."},
            {q:"Brauche ich technische Vorkenntnisse?",a:"Nein. Sie beantworten einfache Fragen zu Ihrem Betrieb. SiteReady kümmert sich um Design, Texte, Impressum und alles Technische."},
            {q:"Was ist mit Impressum und DSGVO?",a:"Beides wird automatisch erstellt — Impressum nach ECG und Datenschutzerklärung nach DSGVO. Sie müssen sich um nichts kümmern."},
            {q:"Kann ich meine bestehende Website importieren?",a:"Ja. Geben Sie einfach die URL Ihrer aktuellen Website ein. SiteReady übernimmt Texte, Kontaktdaten und Leistungen automatisch."},
            {q:"Kann ich meine Website später ändern?",a:"Ja. Im Self-Service-Portal können Sie Logo, Fotos, Texte, Farben und Kontaktdaten jederzeit selbst ändern — ohne Techniker."},
            {q:"Was kostet SiteReady?",a:"Starter ab 16 Euro pro Monat (oder 14 Euro bei Jahreszahlung). Die ersten 7 Tage sind komplett kostenlos — keine Kreditkarte nötig."},
            {q:"Was passiert nach den 7 Tagen?",a:"Wenn Sie zufrieden sind, wählen Sie einen Plan. Wenn nicht, wird die Website automatisch offline genommen. Keine Kosten, kein Risiko."},
            {q:"Kann ich eine eigene Domain verwenden?",a:"Ja, im Professional-Plan. Sie erhalten zusätzlich eine kostenlose siteready.at-Subdomain die sofort funktioniert."},
            {q:"Was passiert, wenn ich kündige?",a:"Sie können monatlich kündigen. Nach der Kündigung wird Ihre Website am Ende des Abrechnungszeitraums offline genommen. Ihre Daten werden gelöscht."}
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
    <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,${CTA},transparent)`,opacity:.4}}/>
    <div style={{position:"absolute",top:"-40%",left:"15%",width:600,height:600,borderRadius:"50%",background:`radial-gradient(circle,rgba(24,95,165,.1) 0%,transparent 65%)`,pointerEvents:"none"}}/>
    <div style={{position:"absolute",bottom:"-30%",right:"10%",width:500,height:500,borderRadius:"50%",background:"radial-gradient(circle,rgba(143,163,184,.08) 0%,transparent 65%)",pointerEvents:"none"}}/>
    <W s={{position:"relative",zIndex:1}}>
      <div className="lp-cta-inner" style={{display:"grid",gridTemplateColumns:"1.4fr 1fr",gap:64,alignItems:"center"}}>
        <div>
          <h2 style={{fontSize:"clamp(2rem,4vw,2.8rem)",fontWeight:300,lineHeight:1.15,letterSpacing:"-.02em",color:"#fff",marginBottom:18}}>Bereit für <span style={{fontWeight:600}}>Ihre Website</span>?</h2>
          <p style={{fontSize:"1.05rem",color:"rgba(255,255,255,.5)",marginBottom:40,lineHeight:1.7}}>10 Minuten. Kein Aufwand. Fertig.</p>
          <button onClick={onStart} className="lp-btn-cta" style={{background:CTA,color:"#fff",padding:"16px 44px",borderRadius:6,fontSize:"1rem",fontWeight:500,border:"none",cursor:"pointer",fontFamily:LP_FONT,minHeight:52,boxShadow:`0 4px 24px ${CTA_G}`}}>Jetzt starten</button>
        </div>
        <div className="lp-cta-stats" style={{display:"flex",flexDirection:"column",gap:24}}>
          {[{v:"10",s:" Min",l:"bis zur fertigen Website"},{v:"16",s:" €",l:"pro Monat, alles inklusive"},{v:"120",s:"k+",l:"Zielgruppe in Österreich"}].map((s,i)=><div key={i} style={{display:"flex",alignItems:"baseline",gap:8}}>
            <span style={{fontFamily:T.mono,fontSize:"2.4rem",fontWeight:800,color:"#fff",letterSpacing:"-.03em",lineHeight:1}}>{s.v}<span style={{color:CTA}}>{s.s}</span></span>
            <span style={{fontSize:".85rem",color:"rgba(255,255,255,.4)"}}>{s.l}</span>
          </div>)}
        </div>
      </div>
    </W>
  </section>

  {/* FOOTER */}
  <footer style={{padding:"80px 0 48px",borderTop:`1px solid rgba(0,0,0,.06)`,background:T.bg}}>
    <W>
      <div className="lp-footer-top" style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:48,flexWrap:"wrap",gap:32}}>
        <div className="lp-footer-brand" style={{maxWidth:320}}>
          <img src="/logo.png" alt="SiteReady" style={{height:36,marginBottom:16}}/>
          <p style={{fontSize:".85rem",color:T.textMuted,lineHeight:1.7}}>Professionelle Websites für österreichische Kleinbetriebe. Impressum, DSGVO und SEO inklusive.</p>
        </div>
        <div className="lp-footer-cols" style={{display:"flex",gap:56}}>
          <div>
            <div style={{fontSize:".75rem",fontWeight:700,color:T.dark,textTransform:"uppercase",letterSpacing:".1em",marginBottom:14}}>Produkt</div>
            {[{l:"Fragebogen starten",a:onStart},{l:"Preise",a:()=>document.getElementById("preise")?.scrollIntoView({behavior:"smooth"})},{l:"Kunden-Portal",a:onPortal}].map(({l,a})=><button key={l} type="button" onClick={a} style={{display:"block",fontSize:".85rem",color:T.textMuted,textDecoration:"none",marginBottom:12,transition:"color .2s",border:"none",background:"none",padding:0,cursor:"pointer",fontFamily:"inherit",textAlign:"left"}} onMouseEnter={e=>e.target.style.color=T.dark} onMouseLeave={e=>e.target.style.color=T.textMuted}>{l}</button>)}
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
function SuccessPage({data,onBack,onPortal,orderInProgressRef}){
  const[saving,setSaving]=useState(false);
  const[saveErr,setSaveErr]=useState("");
  const[vorname,setVorname]=useState(data.vorname||"");
  const[nachname,setNachname]=useState(data.nachname||"");
  const[loginEmail,setLoginEmail]=useState(data.email||"");
  const[pw,setPw]=useState("");
  const[pw2,setPw2]=useState("");
  const[pwTouched,setPwTouched]=useState(false);
  const[pw2Touched,setPw2Touched]=useState(false);
  const[confirmed,setConfirmed]=useState(false);
  const[building,setBuilding]=useState(false);
  const[buildPhase,setBuildPhase]=useState(0);
  const[resending,setResending]=useState(false);
  const[resent,setResent]=useState(false);
  const[orderHtmlReady,setOrderHtmlReady]=useState(false);
  // Phasen-Animation waehrend Build (wird in handleOrder gestartet)
  useEffect(()=>{
    if(!building)return;
    const phases=[0,1,2,3];
    let idx=0;
    const iv=setInterval(()=>{
      idx++;
      if(idx>=phases.length){setBuildPhase(phases.length-1);clearInterval(iv);return;}
      setBuildPhase(phases[idx]);
    },4200);
    return()=>clearInterval(iv);
  },[building]);
  const[agbAccepted,setAgbAccepted]=useState(false);
  // Sobald confirmed: pollt /s/sub bis Build wirklich fertig (verhindert iFrame-404)
  useEffect(()=>{
    if(!confirmed)return;
    const sub=data.firmenname?data.firmenname.toLowerCase().replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,""):"firmenname";
    let stopped=false;
    const check=async()=>{try{const r=await fetch(`/s/${sub}`,{method:"HEAD"});return r.ok;}catch(_){return false;}};
    (async()=>{
      if(await check()){if(!stopped)setOrderHtmlReady(true);return;}
      const iv=setInterval(async()=>{
        if(stopped){clearInterval(iv);return;}
        if(await check()){clearInterval(iv);if(!stopped)setOrderHtmlReady(true);}
      },3000);
      // Nach 90s nicht mehr warten — iFrame trotzdem zeigen, evtl 404 aber besser als ewig blockieren
      setTimeout(()=>{clearInterval(iv);if(!stopped)setOrderHtmlReady(true);},90000);
    })();
    return()=>{stopped=true;};
  },[confirmed,data.firmenname]);
  const pwErr=pwTouched&&pw.length>0&&pw.length<8?"Mindestens 8 Zeichen":"";
  const pw2Err=pw2Touched&&pw2&&pw!==pw2?"Passwörter stimmen nicht überein":"";
  const emailValid=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginEmail);
  const regOk=vorname.trim().length>0&&nachname.trim().length>0&&emailValid&&pw.length>=8&&pw===pw2;
  const sub=data.firmenname?data.firmenname.toLowerCase().replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,""):"firmenname";
  const handleOrder=async()=>{
    if(!regOk){setSaveErr("Bitte alle Pflichtfelder ausfüllen.");return;}
    setSaving(true);setSaveErr("");
    if(!supabase){setSaveErr("Konfigurationsfehler – bitte Administrator kontaktieren.");setSaving(false);return;}
    // Snapshot der Daten BEVOR signUp den Auth-State aendert und die Seite wechselt
    const snap=JSON.parse(JSON.stringify(data));
    const snapSub=snap.firmenname?snap.firmenname.toLowerCase().replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,""):"firmenname";
    orderInProgressRef.current=true;
    const{data:authData,error:authErr}=await supabase.auth.signUp({email:loginEmail,password:pw,options:{data:{firmenname:snap.firmenname,vorname,nachname}}});
    if(authErr&&authErr.message!=="User already registered"){setSaveErr("Registrierung: "+authErr.message);setSaving(false);orderInProgressRef.current=false;return;}
    const userId=authData?.user?.id||null;
    const orderId=crypto.randomUUID();
    const{error}=await supabase.from("orders").insert({
      id:orderId,user_id:userId,vorname,nachname,
      firmenname:snap.firmenname,branche:snap.branche,branche_label:snap.brancheLabel,
      kurzbeschreibung:snap.kurzbeschreibung,bundesland:snap.bundesland,
      leistungen:snap.leistungen,extra_leistung:snap.extraLeistung,notdienst:snap.notdienst,meisterbetrieb:snap.meisterbetrieb,kostenvoranschlag:snap.kostenvoranschlag,buchungslink:snap.buchungslink||null,whatsapp:snap.whatsapp||null,hausbesuche:snap.hausbesuche,terminvereinbarung:snap.terminvereinbarung,foerderungsberatung:snap.foerderungsberatung,lieferservice:snap.lieferservice,barrierefrei:snap.barrierefrei,parkplaetze:snap.parkplaetze,kassenvertrag:snap.kassenvertrag||null,erstgespraech_gratis:snap.erstgespraech_gratis,online_beratung:snap.online_beratung,ratenzahlung:snap.ratenzahlung,fruehstueck:snap.fruehstueck||false,wlan:snap.wlan||false,haustiere:snap.haustiere||false,online_shop:snap.online_shop||false,
      adresse:snap.adresse,plz:snap.plz,ort:snap.ort,telefon:snap.telefon,email:snap.email,
      uid_nummer:snap.uid,oeffnungszeiten:snap.oeffnungszeiten,einsatzgebiet:snap.einsatzgebiet,
      unternehmensform:snap.unternehmensform,firmenbuchnummer:snap.firmenbuchnummer,gisazahl:snap.gisazahl,firmenbuchgericht:snap.firmenbuchgericht,
      geschaeftsfuehrer:snap.geschaeftsfuehrer,vorstand:snap.vorstand,aufsichtsrat:snap.aufsichtsrat,
      zvr_zahl:snap.zvr_zahl,vertretungsorgane:snap.vertretungsorgane,gesellschafter:snap.gesellschafter,
      unternehmensgegenstand:snap.unternehmensgegenstand,liquidation:snap.liquidation,
      kammer_berufsrecht:snap.kammer_berufsrecht,aufsichtsbehoerde:snap.aufsichtsbehoerde,
      stil:snap.stil,custom_accent:snap.accentColor||BRANCHEN_ACCENTS[snap.branche]||null,custom_font:snap.customFont||null,fotos:snap.fotos,subdomain:snapSub,status:"pending",
      ...buildPaletteFromAccent(ensureContrast(snap.accentColor||BRANCHEN_ACCENTS[snap.branche]||"#0369A1"),snap.stil),
      facebook:snap.facebook||null,instagram:snap.instagram||null,linkedin:snap.linkedin||null,tiktok:snap.tiktok||null,
      oeffnungszeiten_custom:snap.oeffnungszeitenCustom||null,
      ...(snap.importExtras?.spezialisierung?{spezialisierung:snap.importExtras.spezialisierung}:{}),
      ...(snap.importExtras?.gut_zu_wissen?{gut_zu_wissen:snap.importExtras.gut_zu_wissen}:{}),
      ...(snap.importExtras?.bewertungen?.length?{bewertungen:snap.importExtras.bewertungen,ai_generated:[...(snap.importExtras.bewertungen.length?["bewertungen"]:[])]}:{}),
      ...(snap.importExtras?.faq?.length?{faq:snap.importExtras.faq}:{}),
      ...(snap.importExtras?.fakten?.length?{fakten:snap.importExtras.fakten}:{}),
      ...(snap.importExtras?.partner?.length?{partner:snap.importExtras.partner}:{}),
      ...(snap.importExtras?.team?.length?{team_members:snap.importExtras.team}:{}),
      ...(snap.importExtras?.ablauf_schritte?.length?{ablauf_schritte:snap.importExtras.ablauf_schritte}:{}),
      ...(snap.importExtras?.leistungen_beschreibungen&&Object.keys(snap.importExtras.leistungen_beschreibungen).length?{leistungen_beschreibungen:snap.importExtras.leistungen_beschreibungen}:{}),
      ...(snap.importExtras?.sections_visible?{sections_visible:snap.importExtras.sections_visible}:{}),
      ...(snap.importExtras?.varianten_cache?{varianten_cache:snap.importExtras.varianten_cache}:{}),
      ...(snap.importExtras?.import_cost_eur?{import_cost_eur:snap.importExtras.import_cost_eur,import_tokens_in:snap.importExtras.import_tokens_in,import_tokens_out:snap.importExtras.import_tokens_out,firecrawl_credits:snap.importExtras.firecrawl_credits||0}:{}),
      website_ziel:null
    });
    if(error){try{await supabase.from("error_logs").insert({source:"order_insert_error",message:error.message});}catch(_){}setSaveErr("Fehler: "+error.message);setSaving(false);orderInProgressRef.current=false;return;}
    try{await supabase.from("error_logs").insert({source:"order_created",message:JSON.stringify({id:orderId,subdomain:snapSub})});}catch(_){}
    try{await fetch("/api/start-build",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({order_id:orderId})});}catch(e){console.error("start-build:",e);}
    /* Auto-Login nach signUp (kein E-Mail-Bestätigung nötig) */
    try{await supabase.auth.signInWithPassword({email:loginEmail,password:pw});}catch(_){}
    setSaving(false);
    localStorage.setItem("sr_pending_email",loginEmail);
    setBuildPhase(0);
    setBuilding(true);
    // Simulierter Phasen-Timer (~18s), parallel laeuft echter Build.
    // orderInProgressRef bleibt true bis Animation fertig — verhindert,
    // dass auth-listener vorzeitig zum Portal navigiert.
    setTimeout(()=>{setBuilding(false);setConfirmed(true);orderInProgressRef.current=false;},18000);
  };
  const resendEmail=async()=>{
    if(!supabase||resending)return;
    setResending(true);
    try{
      const{error}=await supabase.auth.resend({type:"signup",email:loginEmail});
      if(error){console.error("resendEmail:",error.message);setResending(false);return;}
      setResent(true);setTimeout(()=>setResent(false),5000);
    }catch(e){console.error("resendEmail:",e);}
    setResending(false);
  };
  /* Sidebar sections */
  const qSecs=[{l:"Start"},{l:"Grunddaten"},{l:"Leistungen"},{l:"Kontakt"},{l:"Impressum"},{l:"Design"},{l:"Fertig"}];
  const helpCol=<div className="q-split-right">
    <div className="q-split-title">Hilfe</div>
    <div style={{background:T.white,border:`1px solid ${T.bg3}`,borderRadius:T.r,padding:"18px 20px",boxShadow:T.sh1,marginBottom:14}}>
      <div style={{display:"flex",alignItems:"flex-start",gap:10}}>
        <div style={{width:32,height:32,borderRadius:8,background:T.accentLight,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.accent} strokeWidth="2" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22 6 12 13 2 6"/></svg></div>
        <div style={{flex:1}}>
          <div style={{fontSize:".82rem",fontWeight:700,color:T.dark,marginBottom:4}}>Keine E-Mail erhalten?</div>
          <div style={{fontSize:".75rem",color:T.textMuted,lineHeight:1.6,marginBottom:8}}>Prüfen Sie Ihren Spam-Ordner. Die E-Mail kann einige Minuten dauern.</div>
          <button onClick={resendEmail} disabled={resending} style={{background:"none",border:"none",color:T.accent,fontWeight:700,fontSize:".78rem",cursor:resending?"wait":"pointer",fontFamily:T.font,padding:0,textDecoration:"underline",textUnderlineOffset:"3px"}}>{resent?"Gesendet!":resending?"Wird gesendet...":"Bestätigungsmail erneut senden"}</button>
        </div>
      </div>
    </div>
    <div style={{background:T.white,border:`1px solid ${T.bg3}`,borderRadius:T.r,padding:"18px 20px",boxShadow:T.sh1,marginBottom:14}}>
      <div style={{display:"flex",alignItems:"flex-start",gap:10}}>
        <div style={{width:32,height:32,borderRadius:8,background:T.accentLight,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.accent} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div>
        <div style={{flex:1}}>
          <div style={{fontSize:".82rem",fontWeight:700,color:T.dark,marginBottom:4}}>Falsche E-Mail-Adresse?</div>
          <div style={{fontSize:".75rem",color:T.textMuted,lineHeight:1.6}}>Bitte registrieren Sie sich erneut mit der richtigen Adresse.</div>
        </div>
      </div>
    </div>
    <div style={{background:T.white,border:`1px solid ${T.bg3}`,borderRadius:T.r,padding:"18px 20px",boxShadow:T.sh1}}>
      <div style={{display:"flex",alignItems:"flex-start",gap:10}}>
        <div style={{width:32,height:32,borderRadius:8,background:T.accentLight,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.accent} strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg></div>
        <div style={{flex:1}}>
          <div style={{fontSize:".82rem",fontWeight:700,color:T.dark,marginBottom:4}}>Noch immer Probleme?</div>
          <div style={{fontSize:".75rem",color:T.textMuted,lineHeight:1.6}}>Kontaktieren Sie uns direkt:</div>
          <a href="mailto:support@siteready.at" style={{fontSize:".78rem",fontWeight:700,color:T.accent,textDecoration:"none",marginTop:4,display:"inline-block"}}>support@siteready.at</a>
        </div>
      </div>
    </div>
  </div>;

  return(<div className="q-layout"><style>{css+qCss}</style>
  {/* Sidebar */}
  <aside className="q-sb">
    <div className="q-sb-top">
      <img className="q-sb-logo" src="/logo.png" alt="SiteReady" onError={e=>{e.currentTarget.style.display="none"}}/>
      <div className="q-sb-site"><div className="q-sb-dot"/><div className="q-sb-url">{sub}.siteready.at</div></div>
    </div>
    <nav className="q-sb-nav">
      <div className="q-sb-grp">Website erstellen</div>
      {qSecs.map((s,i)=><button key={i} className="q-sb-ni q-done">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        {s.l}<span className="q-sb-done"/>
      </button>)}
      <div className="q-sb-grp" style={{marginTop:8}}>Account</div>
      <button className={`q-sb-ni${confirmed?" q-done":" q-active"}`}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        Account erstellen
        {confirmed?<span className="q-sb-done"/>:<span className="q-sb-comp"/>}
      </button>
    </nav>
    <div className="q-sb-progress"><div className="q-sb-bar-wrap"><div className="q-sb-bar-fill" style={{width:"100%"}}/></div><div className="q-sb-pct">100%</div></div>
  </aside>
  {/* Main */}
  <div className="q-main">
    {building?<>
      {/* Build-in-progress Screen mit Skeleton-Preview + Phasen */}
      {(()=>{
        const PHASEN=[
          {titel:"Betriebsdaten werden analysiert",sub:"Branche, Leistungen und Standort werden verarbeitet."},
          {titel:"Texte werden individuell formuliert",sub:"KI schreibt Über-Uns, Leistungen und Vorteile auf Ihren Betrieb zugeschnitten."},
          {titel:"Design wird angewendet",sub:"Farbpalette, Typografie und Layout werden zusammengestellt."},
          {titel:"Website wird veröffentlicht",sub:"Subdomain und SSL-Zertifikat werden aktiviert."},
        ];
        const currentStil=data.stil||"klassisch";
        const currentAccent=data.accentColor||BRANCHEN_ACCENTS[data.branche]||STYLES_MAP[currentStil]?.accent||"#0369A1";
        const currentPrimary=STYLES_MAP[currentStil]?.primary||"#094067";
        const stilBg=STYLES_MAP[currentStil]?.bg||"#f4f7fa";
        const heroFont=currentStil==="elegant"?"'Cormorant Garamond','Georgia',serif":"inherit";
        const heroWeight=currentStil==="elegant"?600:800;
        const btnR=currentStil==="modern"?100:currentStil==="elegant"?2:4;
        return<>
          <div className="q-mh">
            <div className="q-mh-bc">Website erstellen <span style={{opacity:.4}}>›</span> <b>Wird erstellt</b></div>
            <div className="q-mh-title">Ihre Website wird gerade erstellt</div>
            <div className="q-mh-sub">Das dauert etwa 15-20 Sekunden. Schauen Sie zu — oder machen Sie sich einen Kaffee.</div>
          </div>
          <div style={{margin:"16px 36px 0",padding:"12px 18px",background:T.white,border:`1px solid ${T.bg3}`,borderRadius:T.rSm,display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:T.accent,animation:"sb-blink 1.2s ease-in-out infinite",flexShrink:0}}/>
            <span style={{fontSize:".82rem",fontWeight:600,color:T.dark,fontFamily:T.mono}}>{sub}.siteready.at</span>
            <span style={{fontSize:".72rem",fontWeight:700,color:T.accent,background:T.accentLight,padding:"2px 8px",borderRadius:4,textTransform:"uppercase",letterSpacing:".06em"}}>Wird erstellt</span>
          </div>
          <div className="q-mh-line"/>
          <div className="q-mb" style={{maxWidth:900}}>
            <div style={{display:"grid",gridTemplateColumns:"minmax(0,1.3fr) minmax(0,1fr)",gap:24,alignItems:"start"}}>
              {/* Skeleton-Preview */}
              <div style={{background:"#fff",border:`1px solid ${T.bg3}`,borderRadius:T.r,overflow:"hidden",boxShadow:T.sh1}}>
                <div style={{background:"#f3f4f6",padding:"8px 12px",display:"flex",alignItems:"center",gap:6,borderBottom:`1px solid ${T.bg3}`}}>
                  <div style={{width:10,height:10,borderRadius:"50%",background:"#e5e7eb"}}/>
                  <div style={{width:10,height:10,borderRadius:"50%",background:"#e5e7eb"}}/>
                  <div style={{width:10,height:10,borderRadius:"50%",background:"#e5e7eb"}}/>
                  <div style={{marginLeft:12,background:"#fff",borderRadius:4,padding:"3px 10px",fontSize:".7rem",fontFamily:T.mono,color:T.textMuted,border:`1px solid ${T.bg3}`,flex:1,maxWidth:260}}>{sub}.siteready.at</div>
                </div>
                <div style={{background:stilBg,aspectRatio:"16/11",display:"flex",flexDirection:"column",overflow:"hidden",position:"relative"}}>
                  {/* Nav */}
                  <div style={{background:currentPrimary,height:36,display:"flex",alignItems:"center",padding:"0 18px",gap:14}}>
                    <div style={{height:10,width:80,background:"rgba(255,255,255,.9)",borderRadius:2,opacity:buildPhase>=1?1:.35,transition:"opacity .6s"}}/>
                    <div style={{flex:1}}/>
                    <div style={{height:6,width:40,background:"rgba(255,255,255,.4)",borderRadius:2}}/>
                    <div style={{height:6,width:52,background:"rgba(255,255,255,.4)",borderRadius:2}}/>
                    <div style={{height:6,width:36,background:"rgba(255,255,255,.4)",borderRadius:2}}/>
                  </div>
                  {/* Hero */}
                  <div style={{padding:"28px 32px 18px 32px",position:"relative"}}>
                    {currentStil==="modern"&&<div style={{position:"absolute",top:-40,right:-40,width:180,height:180,borderRadius:"50%",background:currentAccent,opacity:.08,filter:"blur(40px)"}}/>}
                    <div style={{fontFamily:heroFont,fontWeight:heroWeight,fontSize:26,color:currentPrimary,lineHeight:1.1,marginBottom:8,opacity:buildPhase>=1?1:.3,transition:"opacity .6s"}}>
                      {buildPhase>=1?(data.firmenname||"Ihr Betrieb"):<span style={{display:"inline-block",width:"65%",height:28,background:"#e5e7eb",borderRadius:3}}/>}
                    </div>
                    {currentStil==="elegant"&&buildPhase>=1&&<div style={{width:36,height:2,background:currentAccent,marginBottom:10}}/>}
                    <div style={{fontSize:12,color:"rgba(0,0,0,.55)",marginBottom:14,opacity:buildPhase>=1?1:.3,transition:"opacity .6s"}}>
                      {buildPhase>=1?(data.brancheLabel||data.branche||"Ihr Beruf")+(data.ort?" in "+data.ort:""):<span style={{display:"inline-block",width:"40%",height:12,background:"#e5e7eb",borderRadius:2}}/>}
                    </div>
                    <div style={{display:"inline-block",background:currentAccent,color:"#fff",fontSize:11,padding:"7px 16px",borderRadius:btnR,fontWeight:600,opacity:buildPhase>=2?1:.25,transition:"opacity .6s"}}>Termin vereinbaren</div>
                  </div>
                  {/* Leistungen */}
                  <div style={{padding:"0 32px 18px 32px",display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
                    {[0,1,2].map(i=>(
                      <div key={i} style={{background:"#fff",borderRadius:currentStil==="modern"?10:currentStil==="elegant"?2:4,padding:"10px 10px 12px 10px",border:currentStil==="modern"?"none":`1px solid ${currentStil==="elegant"?"#eaddcf":"#dce6ef"}`,boxShadow:currentStil==="modern"?"0 2px 6px rgba(0,0,0,.06)":"none",borderLeft:currentStil==="klassisch"?`2px solid ${currentAccent}`:undefined,borderTop:currentStil==="modern"?`2px solid ${currentAccent}`:undefined,minHeight:54,opacity:buildPhase>=2?1:.25,transition:"opacity .6s",transitionDelay:(i*120)+"ms"}}>
                        <div style={{height:4,width:"50%",background:currentAccent,opacity:.8,borderRadius:1,marginBottom:6}}/>
                        <div style={{height:3,width:"85%",background:"rgba(0,0,0,.14)",borderRadius:1,marginBottom:3}}/>
                        <div style={{height:3,width:"70%",background:"rgba(0,0,0,.14)",borderRadius:1}}/>
                      </div>
                    ))}
                  </div>
                  {/* Content-Block */}
                  <div style={{padding:"0 32px 20px 32px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,opacity:buildPhase>=3?1:.2,transition:"opacity .8s"}}>
                    <div style={{height:5,background:"rgba(0,0,0,.18)",borderRadius:1}}/>
                    <div style={{height:5,background:"rgba(0,0,0,.08)",borderRadius:1}}/>
                    <div style={{height:5,background:"rgba(0,0,0,.12)",borderRadius:1}}/>
                    <div style={{height:5,background:"rgba(0,0,0,.1)",borderRadius:1}}/>
                  </div>
                  {buildPhase>=3&&<div style={{position:"absolute",bottom:10,left:0,right:0,textAlign:"center",fontSize:11,fontWeight:700,color:T.green,letterSpacing:".08em",textTransform:"uppercase",opacity:.8}}>Seite wird veröffentlicht…</div>}
                </div>
              </div>
              {/* Phasen-Liste */}
              <div style={{background:"#fff",border:`1px solid ${T.bg3}`,borderRadius:T.r,padding:"22px 22px",boxShadow:T.sh1}}>
                <div style={{fontSize:".72rem",fontWeight:800,color:T.textMuted,textTransform:"uppercase",letterSpacing:".08em",marginBottom:16}}>Fortschritt</div>
                {PHASEN.map((p,i)=>{
                  const done=i<buildPhase;const active=i===buildPhase;
                  return<div key={i} style={{display:"flex",alignItems:"flex-start",gap:12,marginBottom:14,opacity:done||active?1:.4,transition:"opacity .3s"}}>
                    <div style={{width:22,height:22,borderRadius:"50%",flexShrink:0,background:done?T.green:active?"rgba(59,130,246,.08)":T.bg,border:`1.5px solid ${done?T.green:active?T.accent:T.bg3}`,display:"flex",alignItems:"center",justifyContent:"center",marginTop:1}}>
                      {done?<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                      :active?<div style={{width:8,height:8,borderRadius:"50%",background:T.accent,animation:"sb-blink 1.2s ease-in-out infinite"}}/>
                      :null}
                    </div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:".82rem",fontWeight:700,color:done||active?T.dark:T.textMuted,marginBottom:2}}>{p.titel}</div>
                      <div style={{fontSize:".74rem",color:T.textMuted,lineHeight:1.5}}>{p.sub}</div>
                    </div>
                  </div>;
                })}
                <div style={{height:1,background:T.bg3,margin:"16px 0 14px"}}/>
                <div style={{fontSize:".74rem",color:T.textMuted,lineHeight:1.6}}>Gleich können Sie im Portal Logo, Fotos und Texte anpassen.</div>
              </div>
            </div>
          </div>
        </>;
      })()}
    </>:confirmed?<>
      {/* Bestätigungsseite */}
      <div className="q-mh">
        <div className="q-mh-bc">Website erstellen <span style={{opacity:.4}}>›</span> <b>Account erstellt</b></div>
        <div className="q-mh-title">Account erstellt!</div>
        <div className="q-mh-sub">Nur noch Ihre E-Mail-Adresse bestätigen, dann können Sie sich einloggen.</div>
      </div>
      <div style={{margin:"16px 36px 0",padding:"12px 18px",background:T.white,border:`1px solid ${T.bg3}`,borderRadius:T.rSm,display:"flex",alignItems:"center",gap:12}}>
        <div style={{width:8,height:8,borderRadius:"50%",background:T.green,animation:"sb-blink 2.5s ease-in-out infinite",flexShrink:0}}/>
        <span style={{fontSize:".82rem",fontWeight:600,color:T.dark,fontFamily:T.mono}}>{sub}.siteready.at</span>
        <span style={{fontSize:".72rem",fontWeight:700,color:T.green,background:T.greenLight,padding:"2px 8px",borderRadius:4,textTransform:"uppercase",letterSpacing:".06em"}}>Live</span>
      </div>
      <div className="q-mh-line"/>
      <div className="q-mb" style={{maxWidth:1100}}>
        {/* Success card */}
        <div style={{background:T.white,border:`1px solid ${T.bg3}`,borderRadius:T.r,padding:"20px 24px",boxShadow:T.sh1,marginBottom:20,display:"flex",alignItems:"flex-start",gap:14}}>
          <div style={{width:48,height:48,borderRadius:12,background:T.greenLight,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,border:"1px solid rgba(22,163,74,.15)",boxShadow:`0 4px 16px ${T.greenGlow}`,animation:"fadeUp .5s cubic-bezier(.22,1,.36,1)"}}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={T.green} strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg></div>
          <div style={{flex:1}}>
            <div style={{fontSize:"1.05rem",fontWeight:800,color:T.dark,marginBottom:4}}>Ihre Website ist bereit!</div>
            <div style={{fontSize:".82rem",color:T.textMuted,lineHeight:1.6}}>Bestätigungs-E-Mail an <strong style={{color:T.dark}}>{loginEmail}</strong> gesendet. Im Portal können Sie Logo, Fotos und Texte anpassen.</div>
          </div>
        </div>
        {/* Live Preview iFrame */}
        <div style={{background:T.white,border:`1px solid ${T.bg3}`,borderRadius:T.r,overflow:"hidden",boxShadow:T.sh2,marginBottom:20}}>
          <div style={{background:"#f3f4f6",padding:"10px 16px",display:"flex",alignItems:"center",gap:10,borderBottom:`1px solid ${T.bg3}`}}>
            <div style={{display:"flex",gap:6}}>
              <div style={{width:11,height:11,borderRadius:"50%",background:"#e5e7eb"}}/>
              <div style={{width:11,height:11,borderRadius:"50%",background:"#e5e7eb"}}/>
              <div style={{width:11,height:11,borderRadius:"50%",background:"#e5e7eb"}}/>
            </div>
            <div style={{marginLeft:8,background:"#fff",borderRadius:6,padding:"5px 14px",fontSize:".78rem",fontFamily:T.mono,color:T.textMuted,border:`1px solid ${T.bg3}`,flex:1,maxWidth:420,display:"flex",alignItems:"center",gap:8}}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={T.green} strokeWidth="2.5" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
              {sub}.siteready.at
            </div>
            <a href={`/s/${sub}`} target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:6,padding:"6px 14px",border:`1.5px solid ${T.bg3}`,borderRadius:6,background:"#fff",fontSize:".75rem",fontWeight:700,color:T.dark,textDecoration:"none",fontFamily:T.font}}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              In neuem Tab öffnen
            </a>
          </div>
          {orderHtmlReady?<iframe src={`/s/${sub}`} title="Ihre Website" style={{display:"block",width:"100%",height:580,border:"none",background:"#fff"}} loading="lazy"/>:<div style={{height:580,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:14,background:"#fafafa"}}><div style={{width:36,height:36,border:`3px solid ${T.bg3}`,borderTopColor:T.dark,borderRadius:"50%",animation:"sb-rotate 1s linear infinite"}}/><div style={{fontSize:".88rem",color:T.textMuted,fontWeight:500}}>Letzte Schritte werden abgeschlossen…</div><div style={{fontSize:".75rem",color:T.textMuted}}>(Vorschau erscheint in wenigen Sekunden)</div></div>}
        </div>
        {/* Next steps */}
        <div className="q-split">
          <div style={{background:T.white,border:`1px solid ${T.bg3}`,borderRadius:T.r,padding:"20px 24px",boxShadow:T.sh1}}>
            <div style={{fontSize:".78rem",fontWeight:700,color:T.textSub,textTransform:"uppercase",letterSpacing:".06em",marginBottom:12}}>Nächste Schritte</div>
            {[{n:"1",t:"E-Mail-Adresse bestätigen",active:true},{n:"2",t:"Im Portal einloggen"},{n:"3",t:"Logo, Fotos und Texte anpassen"}].map(s=><div key={s.n} style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
              <div style={{width:24,height:24,borderRadius:"50%",background:s.active?T.greenLight:T.bg,color:s.active?T.green:T.textMuted,display:"flex",alignItems:"center",justifyContent:"center",fontSize:".72rem",fontWeight:800,flexShrink:0,border:`1px solid ${s.active?"rgba(22,163,74,.15)":T.bg3}`}}>{s.n}</div>
              <span style={{fontSize:".82rem",color:s.active?T.dark:T.textMuted,fontWeight:500}}>{s.t}</span>
            </div>)}
          </div>
          {helpCol}
        </div>
      </div>
      <div className="q-footer">
        <button className="q-btn-next" onClick={()=>onPortal?.()}>E-Mail bestätigt? Zum Portal <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg></button>
        <span style={{fontSize:".72rem",color:T.textMuted,marginLeft:"auto"}}>7 Tage kostenlos · Keine Kreditkarte nötig</span>
      </div>
    </>:<>
      {/* Registrierungsseite */}
      <div className="q-mh">
        <div className="q-mh-bc">Website erstellen <span style={{opacity:.4}}>›</span> <b>Account erstellen</b></div>
        <div className="q-mh-title">Ihre Website wird gerade erstellt!</div>
        <div className="q-mh-sub">Erstellen Sie jetzt Ihren Account, um die Website freizuschalten.</div>
      </div>
      <div style={{margin:"16px 36px 0",padding:"12px 18px",background:T.white,border:`1px solid ${T.bg3}`,borderRadius:T.rSm,display:"flex",alignItems:"center",gap:12}}>
        <div style={{width:8,height:8,borderRadius:"50%",background:T.green,animation:"sb-blink 2.5s ease-in-out infinite",flexShrink:0}}/>
        <span style={{fontSize:".82rem",fontWeight:600,color:T.dark,fontFamily:T.mono}}>{sub}.siteready.at</span>
        <span style={{fontSize:".72rem",fontWeight:600,color:T.green,background:T.greenLight,padding:"2px 8px",borderRadius:4}}>Wird erstellt...</span>
      </div>
      <div className="q-mh-line"/>
      <div className="q-mb" style={{maxWidth:900}}>
        <div className="q-split">
          <div>
            {/* Price card */}
            <div style={{background:T.white,border:`1px solid ${T.bg3}`,borderRadius:T.r,padding:"18px 22px",boxShadow:T.sh1,marginBottom:20,display:"flex",alignItems:"center",justifyContent:"space-between",gap:16,flexWrap:"wrap"}}>
              <div>
                <div style={{fontSize:".72rem",fontWeight:700,color:T.green,textTransform:"uppercase",letterSpacing:".06em",marginBottom:4}}>7 Tage kostenlos</div>
                <div style={{display:"flex",alignItems:"baseline",gap:6}}>
                  <span style={{fontSize:"2rem",fontWeight:800,color:T.dark,fontFamily:T.mono,letterSpacing:"-.04em",lineHeight:1}}>{"€"}0</span>
                  <span style={{fontSize:".82rem",color:T.textMuted}}>heute</span>
                </div>
              </div>
              <div style={{fontSize:".72rem",color:T.textMuted,textAlign:"right",lineHeight:1.6}}>Danach {"€"}15,30/Mon. (jährl.)<br/>oder {"€"}18/Mon. · Jederzeit kündbar</div>
            </div>
            {/* Form */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <Field label="Vorname" value={vorname} onChange={setVorname} placeholder="Alexander" required/>
              <Field label="Nachname" value={nachname} onChange={setNachname} placeholder="Wagner" required/>
            </div>
            <Field label="Login-E-Mail" value={loginEmail} onChange={setLoginEmail} placeholder="ihre@email.at" type="email" required validate={VALIDATORS.email}/>
            {data.email&&loginEmail!==data.email&&<div style={{marginTop:-14,marginBottom:14,fontSize:".75rem",color:T.textMuted}}>Website-Kontakt bleibt: {data.email}</div>}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <div style={{marginBottom:20}}><label style={{display:"block",marginBottom:7,fontSize:".8rem",fontWeight:700,color:pwErr?T.red:T.textSub,letterSpacing:".03em"}}>Passwort <span style={{color:T.red}}>*</span></label><input type="password" value={pw} onChange={e=>setPw(e.target.value)} onBlur={()=>setPwTouched(true)} placeholder="Mind. 8 Zeichen" style={{width:"100%",padding:"12px 14px",border:`2px solid ${pwErr?T.red:T.bg3}`,borderRadius:T.rSm,fontSize:".875rem",fontFamily:T.font,background:T.white,color:T.dark,outline:"none",minHeight:44,boxSizing:"border-box"}}/>{pwErr&&<div style={{marginTop:4,fontSize:".75rem",color:T.red}}>{pwErr}</div>}</div>
              <div style={{marginBottom:20}}><label style={{display:"block",marginBottom:7,fontSize:".8rem",fontWeight:700,color:pw2Err?T.red:T.textSub,letterSpacing:".03em"}}>Bestätigen <span style={{color:T.red}}>*</span></label><input type="password" value={pw2} onChange={e=>setPw2(e.target.value)} onBlur={()=>setPw2Touched(true)} placeholder="Wiederholen" style={{width:"100%",padding:"12px 14px",border:`2px solid ${pw2Err?T.red:T.bg3}`,borderRadius:T.rSm,fontSize:".875rem",fontFamily:T.font,background:T.white,color:T.dark,outline:"none",minHeight:44,boxSizing:"border-box"}}/>{pw2Err&&<div style={{marginTop:4,fontSize:".75rem",color:T.red}}>{pw2Err}</div>}</div>
            </div>
            <label style={{display:"flex",alignItems:"flex-start",gap:10,cursor:"pointer",padding:"12px 14px",background:T.bg,borderRadius:T.rSm,border:`1px solid ${agbAccepted?T.accent+"44":T.bg3}`,marginBottom:14}}>
              <input type="checkbox" checked={agbAccepted} onChange={e=>setAgbAccepted(e.target.checked)} style={{marginTop:2,accentColor:T.accent,width:18,height:18,flexShrink:0,cursor:"pointer"}}/>
              <span style={{fontSize:".78rem",color:T.textSub,lineHeight:1.5}}>Ich akzeptiere die <span style={{color:T.accent,textDecoration:"underline",cursor:"pointer"}}>AGB und Nutzungsbedingungen</span></span>
            </label>
            <div style={{padding:"10px 14px",background:T.accentLight,borderRadius:T.rSm,border:"1px solid rgba(143,163,184,.15)",fontSize:".75rem",color:T.accent,lineHeight:1.6}}>Nach der Registrierung erhalten Sie eine Bestätigungs-E-Mail. Bitte bestätigen Sie diese, um sich einloggen zu können.</div>
            {saveErr&&<div style={{marginTop:12,padding:"10px 14px",background:T.redLight,borderRadius:T.rSm,border:`1px solid ${T.redBorder}`,fontSize:".78rem",color:T.red}}>{saveErr}</div>}
          </div>
          {/* Right: Features */}
          <div className="q-split-right">
            <div className="q-split-title">Inklusive</div>
            {["Subdomain sofort live","Texte individuell von KI formuliert","Impressum nach ECG","DSGVO-Erklärung inklusive","SEO-Optimierung inklusive",data.fotos?"Branchenfotos als Platzhalter":null,"Self-Service-Portal","Logo & Fotos hochladen","Daten jederzeit anpassen","Custom Domain möglich","SSL-Zertifikat inklusive"].filter(Boolean).map((t,i,a)=><React.Fragment key={t}>
              {i===6&&<div style={{height:1,background:T.bg3,margin:"4px 0"}}/>}
              <div style={{display:"flex",alignItems:"center",gap:10,fontSize:".82rem",fontWeight:500,color:T.dark,padding:"6px 0"}}>
                <span style={{width:20,height:20,borderRadius:6,background:T.greenLight,color:T.green,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,flexShrink:0,border:"1px solid rgba(22,163,74,.15)"}}>{"✓"}</span>{t}
              </div>
            </React.Fragment>)}
          </div>
        </div>
      </div>
      <div className="q-footer">
        <button className="q-btn-next" onClick={handleOrder} disabled={saving||!regOk||!agbAccepted} style={{background:saving?T.bg3:(!regOk||!agbAccepted)?"#cbd5e1":T.dark}}>
          {saving?"Website wird erstellt...":"Account erstellen & freischalten"} <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
        <span style={{fontSize:".72rem",color:T.textMuted,marginLeft:"auto"}}>Keine Kreditkarte nötig · Sichere Zahlung via Stripe</span>
      </div>
    </>}
  </div>
  </div>);
}

/* ═══ FORM COMPONENTS (unified light premium) ═══ */
// Input-Validatoren (zentral — fuer Field.validate Prop)
// HelpTip: kleines "?"-Icon mit Hover/Click-Tooltip fuer Fachbegriffe
function HelpTip({text}){
  const[open,setOpen]=useState(false);
  return(<span style={{position:"relative",display:"inline-flex",verticalAlign:"middle",marginLeft:5}}>
    <button type="button" onClick={e=>{e.stopPropagation();setOpen(o=>!o);}} onMouseEnter={()=>setOpen(true)} onMouseLeave={()=>setOpen(false)} onBlur={()=>setOpen(false)} aria-label="Hilfe" style={{width:16,height:16,borderRadius:"50%",border:"none",background:"#e7e9e9",color:"#71717a",fontSize:11,fontWeight:700,cursor:"help",padding:0,display:"inline-flex",alignItems:"center",justifyContent:"center",fontFamily:"inherit"}}>?</button>
    {open&&<span role="tooltip" style={{position:"absolute",bottom:"calc(100% + 8px)",left:"50%",transform:"translateX(-50%)",background:"#18181b",color:"#fff",padding:"9px 12px",borderRadius:6,fontSize:".78rem",lineHeight:1.45,width:240,zIndex:70,boxShadow:"0 6px 20px rgba(0,0,0,.25)",fontWeight:400,whiteSpace:"normal",pointerEvents:"none"}}>{text}</span>}
  </span>);
}

// Zielgruppen-Wort pro Branche (Gaeste fuer Gastro, Patienten fuer Gesundheit, etc.)
const ZIELGRUPPE_WORT={
  restaurant:"Gäste",cafe:"Gäste",baeckerei:"Kunden",catering:"Gäste",bar:"Gäste",heuriger:"Gäste",imbiss:"Gäste",fleischerei:"Kunden",pizzeria:"Gäste",eissalon:"Gäste",vinothek:"Gäste",winzer:"Kunden",
  arzt:"Patienten",zahnarzt:"Patienten",physiotherapie:"Patienten",psychotherapie:"Klienten",tierarzt:"Patienten",ergotherapie:"Patienten",logopaedie:"Patienten",hebamme:"Patientinnen",heilmasseur:"Klienten",osteopath:"Patienten",heilpraktiker:"Klienten",energetiker:"Klienten",lebensberater:"Klienten",
  rechtsanwalt:"Mandanten",notar:"Mandanten",steuerberater:"Mandanten",finanzberater:"Klienten",unternehmensberater:"Klienten",
  fahrschule:"Fahrschüler",nachhilfe:"Schüler",musikschule:"Schüler",yoga:"Teilnehmer",tanzschule:"Teilnehmer",reitschule:"Reiter",schwimmschule:"Schwimmer",coach:"Klienten",trainer:"Teilnehmer",hundeschule:"Hundehalter",
  immobilien:"Klienten",hausverwaltung:"Eigentümer",versicherung:"Kunden",
};
const kundenWort=branche=>ZIELGRUPPE_WORT[branche]||"Kunden";

const VALIDATORS={
  tel:v=>!v||/^[+\d][+\d\s()\-./]{4,}$/.test(v.trim())?null:"Bitte gültige Telefonnummer (z. B. +43 1 234 56 78)",
  url:v=>!v||/^https?:\/\/[^\s]+\.[^\s]+/.test(v.trim())?null:"Bitte vollständigen Link eingeben (mit https://)",
  email:v=>!v||/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())?null:"Bitte gültige E-Mail-Adresse eingeben",
};

// Canvas-basierte Luminanz-Analyse fuer Logos — liefert 0 (schwarz) bis 1 (weiss)
// ueber die NICHT-transparenten Pixel. Null bei CORS-/Load-Fehler.
function analyzeImageLuminance(url){
  return new Promise(resolve=>{
    const img=new Image();
    img.crossOrigin="anonymous";
    img.onload=()=>{
      try{
        const canvas=document.createElement("canvas");
        const maxDim=64;
        const r=Math.min(maxDim/img.width,maxDim/img.height,1);
        canvas.width=Math.max(1,Math.round(img.width*r));
        canvas.height=Math.max(1,Math.round(img.height*r));
        const ctx=canvas.getContext("2d",{willReadFrequently:true});
        ctx.drawImage(img,0,0,canvas.width,canvas.height);
        const data=ctx.getImageData(0,0,canvas.width,canvas.height).data;
        let total=0,count=0;
        for(let i=0;i<data.length;i+=4){
          if(data[i+3]<40)continue; // transparent uebergehen
          const rs=data[i]/255,gs=data[i+1]/255,bs=data[i+2]/255;
          total+=0.2126*rs+0.7152*gs+0.0722*bs;
          count++;
        }
        resolve(count>0?total/count:0.5);
      }catch(_){resolve(null);}
    };
    img.onerror=()=>resolve(null);
    img.src=url;
  });
}

function hexLuminance(hex){
  if(!hex||!/^#[0-9A-Fa-f]{6}$/.test(hex))return 0.1;
  const r=parseInt(hex.slice(1,3),16)/255;
  const g=parseInt(hex.slice(3,5),16)/255;
  const b=parseInt(hex.slice(5,7),16)/255;
  return 0.2126*r+0.7152*g+0.0722*b;
}
function Field({label,value,onChange,placeholder,type="text",rows,hint,required,onBlur:onBlurProp,validate,help}){const[f,setF]=useState(false);const[touched,setTouched]=useState(false);const requiredErr=required&&touched&&!value?.trim();const validateErr=touched&&!requiredErr&&validate&&value?validate(value):null;const err=!!(requiredErr||validateErr);const errMsg=requiredErr?"Pflichtfeld":validateErr;const border=err?`2px solid ${T.red}`:f?`2px solid ${T.dark}`:`2px solid ${T.bg3}`;const shadow=err?`0 0 0 4px rgba(220,38,38,.1)`:f?`0 0 0 4px rgba(17,17,17,.06)`:"none";const base={width:"100%",padding:"12px 14px",border,borderRadius:T.rSm,fontSize:".92rem",fontFamily:T.font,background:T.white,color:T.dark,outline:"none",transition:"all .2s, border-color .2s",boxShadow:shadow,boxSizing:"border-box",minHeight:44};const handleBlur=()=>{setF(false);setTouched(true);if(onBlurProp)onBlurProp();};return(<div style={{marginBottom:20}}><label style={{display:"block",marginBottom:7,fontSize:".85rem",fontWeight:700,color:err?T.red:f?T.dark:T.textSub,transition:"color .2s",letterSpacing:".02em"}}>{label}{required&&<span style={{color:T.red,marginLeft:3}}>*</span>}{help&&<HelpTip text={help}/>}</label>{rows?<textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={rows} onFocus={()=>setF(true)} onBlur={handleBlur} style={{...base,resize:"vertical",lineHeight:1.5}}/>:<input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} onFocus={()=>setF(true)} onBlur={handleBlur} style={base}/>}{err?<div style={{marginTop:4,fontSize:".82rem",color:T.red}}>{errMsg}</div>:hint&&<div style={{marginTop:5,fontSize:".82rem",color:T.textMuted}}>{hint}</div>}</div>)}

function Dropdown({label,value,onChange,options,placeholder,hint,required}){const[f,setF]=useState(false);const[touched,setTouched]=useState(false);const err=required&&touched&&!value;const border=err?`2px solid ${T.red}`:f?`2px solid ${T.dark}`:`2px solid ${T.bg3}`;const shadow=err?`0 0 0 4px rgba(220,38,38,.1)`:f?`0 0 0 4px rgba(17,17,17,.06)`:"none";return(<div style={{marginBottom:20}}><label style={{display:"block",marginBottom:7,fontSize:".85rem",fontWeight:700,color:err?T.red:f?T.dark:T.textSub,letterSpacing:".02em"}}>{label}{required&&<span style={{color:T.red,marginLeft:3}}>*</span>}</label><select aria-label={label} value={value} onChange={e=>onChange(e.target.value)} onFocus={()=>setF(true)} onBlur={()=>{setF(false);setTouched(true);}} style={{width:"100%",padding:"12px 14px",border,borderRadius:T.rSm,fontSize:".92rem",fontFamily:T.font,background:T.white,color:value?T.dark:T.textMuted,outline:"none",transition:"all .2s, border-color .2s",boxShadow:shadow,boxSizing:"border-box",cursor:"pointer",appearance:"none",minHeight:44,backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M3 5l3 3 3-3' fill='none' stroke='%238b919e' stroke-width='1.5'/%3E%3C/svg%3E\")",backgroundRepeat:"no-repeat",backgroundPosition:"right 16px center"}}><option value="" disabled>{placeholder||"Bitte wählen"}</option>{options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}</select>{err?<div style={{marginTop:4,fontSize:".82rem",color:T.red}}>Pflichtfeld</div>:hint&&<div style={{marginTop:5,fontSize:".82rem",color:T.textMuted}}>{hint}</div>}</div>)}
function Combobox({label,value,onChange,options,placeholder,hint,required}){
  const[query,setQuery]=useState("");const[open,setOpen]=useState(false);const[touched,setTouched]=useState(false);const[hi,setHi]=useState(-1);const wrapRef=useRef(null);const inputRef=useRef(null);
  const selected=options.find(o=>o.value===value);
  const filtered=query?options.filter(o=>o.label.toLowerCase().includes(query.toLowerCase())):options;
  const err=required&&touched&&!value;
  const border=err?`2px solid ${T.red}`:open?`2px solid ${T.dark}`:`2px solid ${T.bg3}`;
  const shadow=err?`0 0 0 4px rgba(220,38,38,.1)`:open?`0 0 0 4px rgba(17,17,17,.06)`:"none";
  useEffect(()=>{const h=e=>{if(wrapRef.current&&!wrapRef.current.contains(e.target)){setOpen(false);setQuery("");setTouched(true);}};document.addEventListener("mousedown",h);return()=>document.removeEventListener("mousedown",h);},[]);
  useEffect(()=>{setHi(-1);},[query]);
  const pick=o=>{onChange(o.value);setQuery("");setOpen(false);setTouched(true);};
  const onKey=e=>{if(e.key==="ArrowDown"){e.preventDefault();if(filtered.length>0)setHi(h=>(h+1)%filtered.length);}else if(e.key==="ArrowUp"){e.preventDefault();if(filtered.length>0)setHi(h=>h<=0?filtered.length-1:h-1);}else if(e.key==="Enter"&&hi>=0&&filtered[hi]){e.preventDefault();pick(filtered[hi]);}else if(e.key==="Escape"){setOpen(false);setQuery("");inputRef.current?.blur();}};
  return(<div style={{marginBottom:20,position:"relative"}} ref={wrapRef}>
    <label style={{display:"block",marginBottom:7,fontSize:".8rem",fontWeight:700,color:err?T.red:open?T.dark:T.textSub,letterSpacing:".03em"}}>{label}{required&&<span style={{color:T.red,marginLeft:3}}>*</span>}</label>
    <div style={{position:"relative"}}>
      <input ref={inputRef} type="text" value={open?query:(selected?selected.label:"")} placeholder={placeholder||"Suchen..."} onChange={e=>{setQuery(e.target.value);if(!open)setOpen(true);}} onFocus={()=>{setOpen(true);}} onKeyDown={onKey} style={{width:"100%",padding:"12px 40px 12px 14px",border,borderRadius:T.rSm,fontSize:".875rem",fontFamily:T.font,background:T.white,color:T.dark,outline:"none",transition:"all .2s",boxShadow:shadow,boxSizing:"border-box",minHeight:44}} autoComplete="off"/>
      {value&&!open&&<button onClick={()=>{onChange("");setQuery("");setTimeout(()=>inputRef.current?.focus(),0);}} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:T.textMuted,fontSize:16,padding:4,lineHeight:1}}>&times;</button>}
      {!value&&<svg style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.textMuted} strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>}
    </div>
    {open&&<div style={{position:"absolute",top:"100%",left:0,right:0,zIndex:50,marginTop:4,background:T.white,border:`1.5px solid ${T.bg3}`,borderRadius:T.rSm,boxShadow:T.sh3,maxHeight:240,overflowY:"auto"}}>
      {filtered.length===0?<div style={{padding:"14px 16px",fontSize:".82rem",color:T.textMuted}}>Kein Ergebnis für „{query}"</div>
      :filtered.map((o,i)=><button key={o.value} onMouseDown={()=>pick(o)} onMouseEnter={()=>setHi(i)} style={{display:"block",width:"100%",padding:"11px 16px",border:"none",background:i===hi?T.bg:o.value===value?T.accentLight:"transparent",cursor:"pointer",textAlign:"left",fontFamily:T.font,fontSize:".85rem",color:o.value===value?T.dark:T.text,fontWeight:o.value===value?700:400,borderBottom:i<filtered.length-1?`1px solid ${T.bg}`:"none",transition:"background .1s"}}>{o.label}</button>)}
    </div>}
    {err?<div style={{marginTop:4,fontSize:".75rem",color:T.red}}>Pflichtfeld</div>:hint&&<div style={{marginTop:5,fontSize:".75rem",color:T.textMuted}}>{hint}</div>}
  </div>);
}

function Checklist({label,options,selected,onChange,hint}){const toggle=i=>{if(selected.includes(i))onChange(selected.filter(s=>s!==i));else onChange([...selected,i])};return(<div style={{marginBottom:20}}><label style={{display:"block",marginBottom:8,fontSize:".78rem",fontWeight:700,color:T.textSub,letterSpacing:".03em"}}>{label}</label><div style={{display:"flex",flexWrap:"wrap",gap:8}}>{options.map(o=>{const on=selected.includes(o);return(<button key={o} onClick={()=>toggle(o)} style={{padding:"10px 16px",borderRadius:T.rSm,border:on?`2px solid ${T.accent}`:`2px solid ${T.bg3}`,background:on?T.accentLight:T.white,color:on?T.accent:T.text,fontSize:13,fontWeight:on?600:400,cursor:"pointer",transition:"all .15s",display:"flex",alignItems:"center",gap:7,fontFamily:T.font}}><span style={{width:18,height:18,borderRadius:5,border:on?"none":`2px solid ${T.bg3}`,background:on?T.accent:T.white,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"#fff",flexShrink:0}}>{on?"✓":""}</span>{o}</button>)})}</div>{hint&&<div style={{marginTop:6,fontSize:".75rem",color:T.textMuted}}>{hint}</div>}</div>)}

function Toggle({label,checked,onChange,desc}){return(<label style={{display:"flex",alignItems:"center",gap:14,cursor:"pointer",padding:"16px 18px",borderRadius:T.rSm,border:`2px solid ${checked?"rgba(143,163,184,.25)":T.bg3}`,background:checked?T.accentLight:T.white,transition:"all .2s",marginBottom:20}}><div style={{width:42,height:24,borderRadius:12,background:checked?T.accent:T.bg3,transition:"background .2s",position:"relative",flexShrink:0}}><div style={{width:20,height:20,borderRadius:"50%",background:"#fff",position:"absolute",top:2,left:checked?20:2,transition:"left .2s",boxShadow:"0 1px 4px rgba(0,0,0,.15)"}}/></div><input type="checkbox" checked={checked} onChange={e=>onChange(e.target.checked)} style={{display:"none"}}/><div><span style={{fontSize:".92rem",fontWeight:600,color:T.dark}}>{label}</span>{desc&&<div style={{fontSize:".82rem",color:T.textMuted,marginTop:2}}>{desc}</div>}</div></label>)}

function TagInput({label,value,onChange,placeholder,hint,max=12}){const[input,setInput]=useState("");const[f,setF]=useState(false);const tags=value?value.split("\n").filter(t=>t.trim()):[];const add=()=>{const v=input.trim();if(!v||tags.length>=max)return;onChange([...tags,v].join("\n"));setInput("");};const remove=i=>onChange(tags.filter((_,idx)=>idx!==i).join("\n"));const onKey=e=>{if(e.key==="Enter"){e.preventDefault();add();}};return(<div style={{marginBottom:20}}><label style={{display:"block",marginBottom:7,fontSize:".78rem",fontWeight:700,color:f?T.accent:T.textSub,letterSpacing:".03em"}}>{label}</label><div onFocus={()=>setF(true)} onBlur={()=>setF(false)} style={{border:f?`2px solid ${T.accent}`:`2px solid ${T.bg3}`,borderRadius:T.rSm,background:T.white,padding:"10px 12px",transition:"all .2s",boxShadow:f?`0 0 0 4px ${T.accentGlow}`:"none",minHeight:52}}>{tags.length>0&&<div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:8}}>{tags.map((t,i)=><span key={i} style={{display:"inline-flex",alignItems:"center",gap:5,padding:"4px 10px",background:T.accentLight,border:`1px solid rgba(143,163,184,.2)`,borderRadius:20,fontSize:"12px",fontWeight:600,color:T.accent}}>{t}<button onClick={()=>remove(i)} style={{display:"flex",alignItems:"center",justifyContent:"center",width:14,height:14,borderRadius:"50%",border:"none",background:"rgba(143,163,184,.2)",color:T.accent,cursor:"pointer",padding:0,fontSize:10,fontWeight:700,lineHeight:1}}>×</button></span>)}</div>}<input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={onKey} placeholder={tags.length===0?placeholder:"Weitere Leistung eingeben + Enter"} style={{border:"none",outline:"none",width:"100%",fontSize:14,fontFamily:T.font,color:T.dark,background:"transparent",padding:0}}/></div>{tags.length>=max&&<div style={{marginTop:4,fontSize:".75rem",color:T.textMuted}}>Maximum ({max}) erreicht</div>}{hint&&tags.length<max&&<div style={{marginTop:4,fontSize:".75rem",color:T.textMuted}}>{hint}</div>}</div>);}

/* ═══ QUESTIONNAIRE (sidebar layout — matches portal) ═══ */
const qCss=`
.q-layout{display:flex;height:100dvh;overflow:hidden}
.q-sb{width:236px;background:#111;display:flex;flex-direction:column;flex-shrink:0;overflow:hidden}
.q-sb-top{padding:22px 18px 18px;border-bottom:1px solid rgba(255,255,255,.07)}
.q-sb-logo{height:24px;filter:brightness(0) invert(1);opacity:.88;display:block;margin-bottom:18px}
.q-sb-site{display:flex;align-items:center;gap:9px;padding:9px 12px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);border-radius:8px}
.q-sb-dot{width:7px;height:7px;border-radius:50%;background:${T.greenBright};flex-shrink:0;animation:sb-blink 2.5s ease-in-out infinite}
.q-sb-url{font-size:.78rem;font-weight:600;color:rgba(255,255,255,.5);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.q-sb-nav{padding:12px 10px;flex:1;overflow-y:auto;scrollbar-width:none}.q-sb-nav::-webkit-scrollbar{display:none}
.q-sb-grp{font-size:.64rem;font-weight:700;letter-spacing:.09em;text-transform:uppercase;color:rgba(255,255,255,.2);padding:14px 8px 5px}
.q-sb-ni{display:flex;align-items:center;gap:9px;padding:9px 10px;border-radius:8px;cursor:pointer;color:rgba(255,255,255,.45);font-size:.91rem;font-weight:500;transition:all .12s;user-select:none;background:transparent;border:none;width:100%;font-family:inherit;text-align:left}
.q-sb-ni:hover{background:rgba(255,255,255,.06);color:rgba(255,255,255,.8)}
.q-sb-ni.q-active{background:rgba(255,255,255,.09);color:#fff;font-weight:600}
.q-sb-ni.q-done{color:rgba(255,255,255,.55)}
.q-sb-ni.q-future{opacity:.35;cursor:default}
.q-sb-ni.q-future:hover{background:transparent;color:rgba(255,255,255,.45)}
.q-sb-ni svg{flex-shrink:0;opacity:.5;transition:opacity .12s}
.q-sb-ni.q-active svg,.q-sb-ni:hover svg{opacity:.85}
.q-sb-comp{width:6px;height:6px;border-radius:50%;background:${T.amber};margin-left:auto;flex-shrink:0}
.q-sb-done{width:6px;height:6px;border-radius:50%;background:${T.greenBright};margin-left:auto;flex-shrink:0;opacity:.7}
.q-sb-progress{padding:14px 18px;border-top:1px solid rgba(255,255,255,.07)}
.q-sb-bar-wrap{height:4px;background:rgba(255,255,255,.08);border-radius:100px;overflow:hidden}
.q-sb-bar-fill{height:100%;background:${T.greenBright};border-radius:100px;transition:width .4s ease}
.q-sb-pct{font-size:.68rem;font-weight:700;color:${T.greenBright};margin-top:5px}
.q-main{flex:1;display:flex;flex-direction:column;overflow:hidden;background:${T.bg}}
.q-mh{padding:28px 36px 0;flex-shrink:0}
.q-mh-bc{font-size:.76rem;color:${T.textMuted};margin-bottom:7px;display:flex;align-items:center;gap:5px}
.q-mh-bc b{color:${T.textSub}}
.q-mh-title{font-size:1.35rem;font-weight:800;color:${T.dark};letter-spacing:-.025em;line-height:1.2}
.q-mh-sub{font-size:.87rem;color:${T.textMuted};margin-top:3px}
.q-mh-line{height:1px;background:${T.bg3};margin:20px 36px 0;flex-shrink:0}
.q-mb{padding:24px 36px 32px;flex:1;overflow-y:auto;max-width:840px}
.q-section{display:none;flex-direction:column;flex:1;overflow:hidden}
.q-section.q-vis{display:flex;animation:q-in .35s cubic-bezier(.22,1,.36,1)}
@keyframes q-in{from{opacity:0;transform:translateY(16px);filter:blur(2px)}to{opacity:1;transform:translateY(0);filter:blur(0)}}
.q-footer{padding:16px 36px;border-top:1px solid ${T.bg3};background:${T.bg};flex-shrink:0;display:flex;align-items:center;gap:12px}
.q-split{display:grid;grid-template-columns:1fr 1fr;gap:0 40px;align-items:start}
.q-split-right{padding-left:24px;border-left:1px solid ${T.bg3}}
.q-split-title{font-size:.78rem;font-weight:700;color:${T.textSub};text-transform:uppercase;letter-spacing:.06em;margin-bottom:16px}
.q-content-card{background:${T.white};border:1px solid ${T.bg3};border-radius:${T.r};padding:28px;box-shadow:${T.sh1}}
.q-summary-table{text-align:left;padding:16px;background:${T.bg};border-radius:${T.rSm}}
.q-summary-row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid ${T.bg3};font-size:.82rem}
.q-summary-row:last-child{border-bottom:none}
.q-color-row{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px}
.q-color-dot{width:36px;height:36px;border-radius:50%;border:3px solid transparent;cursor:pointer;transition:all .2s;padding:0;background:none}
.q-color-dot:hover{transform:scale(1.12)}
.q-color-dot.q-sel{border-color:${T.dark};box-shadow:0 0 0 2px #fff,0 0 0 4px ${T.dark};transform:scale(1.1)}
.q-color-custom{display:flex;align-items:center;gap:12px;padding:12px 14px;background:${T.bg};border-radius:${T.rSm}}
.q-hex{font-family:${T.mono};font-size:.88rem;font-weight:500;color:${T.dark};background:${T.white};border:2px solid ${T.bg3};border-radius:${T.rSm};padding:8px 12px;width:110px;outline:none;transition:border-color .2s;text-transform:uppercase}
.q-hex:focus{border-color:${T.dark}}
.q-btn-next{display:inline-flex;align-items:center;gap:8px;padding:10px 22px;background:${T.dark};color:#fff;border:none;border-radius:${T.rSm};font-family:${T.font};font-size:.85rem;font-weight:700;cursor:pointer;transition:all .15s;min-height:44px}
.q-btn-next:hover{opacity:.88;transform:translateY(-1px);box-shadow:0 4px 16px rgba(0,0,0,.18)}
.q-btn-next:disabled{opacity:.35;cursor:not-allowed;transform:none!important;box-shadow:none!important}
.q-btn-back{padding:10px 16px;background:${T.white};color:${T.textSub};border:1.5px solid ${T.bg3};border-radius:${T.rSm};font-family:${T.font};font-size:.82rem;font-weight:600;cursor:pointer;transition:all .15s;min-height:44px}
.q-btn-back:hover{border-color:#ccc;color:${T.dark}}
.q-import-row{display:flex;gap:8px}
.q-import-input{flex:1;padding:10px 14px;border:2px solid ${T.bg3};border-radius:${T.rSm};font-size:.875rem;font-family:${T.font};background:${T.bg};color:${T.dark};outline:none;transition:border-color .2s}
.q-import-input:focus{border-color:${T.dark};box-shadow:0 0 0 3px rgba(17,17,17,.06)}
.q-import-input::placeholder{color:#b5b8c0}
.q-import-btn{padding:10px 20px;background:${T.dark};color:#fff;border:none;border-radius:${T.rSm};font-family:${T.font};font-size:.82rem;font-weight:700;cursor:pointer;transition:opacity .15s;white-space:nowrap}
.q-import-btn:hover{opacity:.88}
.q-import-btn:disabled{opacity:.4;cursor:not-allowed}
.q-mob-bar{display:none;padding:12px 20px;background:${T.white};border-bottom:1px solid ${T.bg3};flex-shrink:0;align-items:center;gap:12px}
.q-mob-step{font-size:.78rem;font-weight:600;color:${T.textSub};white-space:nowrap}
.q-mob-progress{flex:1;height:4px;background:${T.bg3};border-radius:100px;overflow:hidden}
.q-mob-fill{height:100%;background:${T.dark};border-radius:100px;transition:width .4s ease}
.q-mob-pct{font-size:.72rem;font-weight:700;color:${T.textMuted};font-family:${T.mono}}
@media(max-width:900px){.q-sb{display:none}.q-mob-bar{display:flex}.q-mb{max-width:100%}.q-split{grid-template-columns:1fr}.q-split-right{padding-left:0;border-left:none;padding-top:16px;border-top:1px solid ${T.bg3};margin-top:8px}.q-mh{padding:20px 20px 0}.q-mh-line{margin:16px 20px 0}.q-mb{padding:20px}.q-footer{padding:12px 20px}.q-color-row{gap:6px}.q-color-dot{width:30px;height:30px}}
@media(max-width:600px){.q-mh-title{font-size:1.1rem}.q-mh-sub{font-size:.8rem}.q-inline-2{grid-template-columns:1fr!important}.q-import-row{flex-direction:column}.q-summary-row{flex-direction:column;gap:2px}.q-summary-row span:last-child{text-align:left}.q-color-dot{width:28px;height:28px}.q-color-row{gap:5px}.q-hex{width:90px;font-size:.78rem}}
`;
function Questionnaire({data,setData,onComplete,onBack}){
  const SECS=[{id:"start",label:"Start",icon:<><circle cx="12" cy="12" r="10"/><polyline points="12 8 12 12 14 14"/></>},{id:"grunddaten",label:"Grunddaten",icon:<><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></>},{id:"leistungen",label:"Leistungen",icon:<><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></>},{id:"kontakt",label:"Kontakt",icon:<><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></>},{id:"impressum",label:"Impressum",icon:<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>},{id:"design",label:"Design",icon:<><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 011.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></>},{id:"fertig",label:"Fertig",icon:<polyline points="20 6 9 17 4 12"/>}];
  const[step,setStep]=useState(0);
  const[importUrl,setImportUrl]=useState("");const[importLoading,setImportLoading]=useState(false);const[importErr,setImportErr]=useState("");const[importConfirm,setImportConfirm]=useState(false);const[importResult,setImportResult]=useState(null);const[impressumConfirm,setImpressumConfirm]=useState(false);const[hexInput,setHexInput]=useState(data.accentColor?.toUpperCase()||"");const[showAccentPicker,setShowAccentPicker]=useState(!!data.accentColor);const[importPhase,setImportPhase]=useState("");
  const[importSeconds,setImportSeconds]=useState(0);
  const doImport=async()=>{if(!importUrl.trim())return;setImportLoading(true);setImportErr("");setImportSeconds(0);
    const isGoogle=/google\.(com|at|de|ch)\/(maps|place)|goo\.gl/i.test(importUrl);
    setImportPhase(isGoogle?"Google-Profil wird gelesen...":"Website wird gelesen...");
    const phases=isGoogle?[["Website wird gesucht...",8],["Inhalte werden analysiert...",20],["Daten werden extrahiert...",40],["Fast fertig...",65]]:[["Unterseiten werden durchsucht...",8],["Inhalte werden analysiert...",20],["Daten werden extrahiert...",40],["Fast fertig...",65]];
    const timers=phases.map(([p,s])=>setTimeout(()=>setImportPhase(p),s*1000));
    const tick=setInterval(()=>setImportSeconds(s=>s+1),1000);
    try{const ctrl=new AbortController();const timeout=setTimeout(()=>ctrl.abort(),120000);
    const r=await fetch("/api/import-website",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({url:importUrl}),signal:ctrl.signal});clearTimeout(timeout);
    const j=await r.json();if(j.error){setImportErr(j.error);setImportLoading(false);setImportPhase("");timers.forEach(clearTimeout);clearInterval(tick);return;}const b=j.branche?BRANCHEN.find(x=>x.value===j.branche):null;const allLeistungen=Array.isArray(j.leistungen)?j.leistungen:[];const hasBrandColor=!!j.brand_color;setData(d=>({...d,firmenname:j.firmenname||d.firmenname,telefon:j.telefon||d.telefon,email:j.email||d.email,plz:j.plz||d.plz,ort:j.ort||d.ort,adresse:j.adresse||d.adresse,kurzbeschreibung:j.kurzbeschreibung||d.kurzbeschreibung,bundesland:j.bundesland||d.bundesland,unternehmensform:j.unternehmensform||d.unternehmensform,uid:j.uid||d.uid,firmenbuchnummer:j.firmenbuchnummer||d.firmenbuchnummer,gisazahl:j.gisazahl||d.gisazahl,firmenbuchgericht:j.firmenbuchgericht||d.firmenbuchgericht,facebook:j.facebook||d.facebook,instagram:j.instagram||d.instagram,linkedin:j.linkedin||d.linkedin,tiktok:j.tiktok||d.tiktok,unternehmensgegenstand:j.unternehmensgegenstand||d.unternehmensgegenstand,kammer_berufsrecht:j.kammer_berufsrecht||d.kammer_berufsrecht,aufsichtsbehoerde:j.aufsichtsbehoerde||d.aufsichtsbehoerde,geschaeftsfuehrer:j.geschaeftsfuehrer||d.geschaeftsfuehrer,gesellschafter:j.gesellschafter||d.gesellschafter,vorstand:j.vorstand||d.vorstand,aufsichtsrat:j.aufsichtsrat||d.aufsichtsrat,zvr_zahl:j.zvr_zahl||d.zvr_zahl,vertretungsorgane:j.vertretungsorgane||d.vertretungsorgane,...(b?{branche:b.value,brancheLabel:b.label,stil:b.stil,leistungen:allLeistungen.length>0?allLeistungen:d.leistungen,extraLeistung:""}:{leistungen:allLeistungen.length>0?allLeistungen:d.leistungen}),oeffnungszeiten:j.oeffnungszeiten_import?"custom":d.oeffnungszeiten,oeffnungszeitenCustom:j.oeffnungszeiten_import||d.oeffnungszeitenCustom,whatsapp:j.whatsapp||d.whatsapp,buchungslink:j.buchungslink||d.buchungslink,...(j.merkmale||{}),...(hasBrandColor?{accentColor:ensureContrast(j.brand_color)}:{}),...(j.downloads?.length?{downloads:j.downloads}:{})}));const meta=j._meta||{};const extras={spezialisierung:j.spezialisierung||"",gut_zu_wissen:j.gut_zu_wissen||"",bewertungen:j.bewertungen||[],faq:j.faq||[],fakten:j.fakten||[],partner:j.partner||[],team:j.team||[],ablauf_schritte:j.ablauf_schritte||[],leistungen_beschreibungen:j.leistungen_beschreibungen||{},sections_visible:j.sections_visible||{},varianten_cache:j.varianten_cache||{},import_tokens_in:meta.import_tokens_in||0,import_tokens_out:meta.import_tokens_out||0,import_cost_eur:meta.import_cost_eur||0,firecrawl_credits:meta.firecrawl_credits||0};setData(d=>({...d,importExtras:extras}));setImportResult(j);setImportLoading(false);setImportPhase("");timers.forEach(clearTimeout);clearInterval(tick);
    }catch(e){timers.forEach(clearTimeout);clearInterval(tick);setImportPhase("");setImportLoading(false);if(e.name==="AbortError")setImportErr("Der Import hat zu lange gedauert. Die Website ist möglicherweise nicht erreichbar oder zu komplex. Sie können die Daten manuell eingeben oder uns unter support@siteready.at melden — wir schauen uns das Problem an.");else setImportErr("Verbindungsfehler — bitte versuchen Sie es erneut oder melden Sie das Problem unter support@siteready.at");}};
  const up=useCallback(k=>v=>setData(d=>({...d,[k]:v})),[setData]);
  const go=n=>{setStep(n);setTimeout(()=>{const sec=document.getElementById("q-sec-"+n);if(sec){const mb=sec.querySelector(".q-mb");if(mb)mb.scrollTop=0;const inp=sec.querySelector("input:not([type=checkbox]):not([type=color]),textarea,select");if(inp&&n>0)inp.focus()}},100)};
  const pct=step===0?0:Math.round((step/(SECS.length-1))*100);
  const selectedBranche=BRANCHEN.find(b=>b.value===data.branche);const brancheLeistungen=selectedBranche?selectedBranche.leistungen:[];
  const onBrancheChange=val=>{const b=BRANCHEN.find(x=>x.value===val);
    const hasLeistungen=data.leistungen?.length>0||data.extraLeistung?.trim();
    const sameB=data.branche===val;
    if(!sameB&&hasLeistungen&&!window.confirm("Branche wechseln? Ihre gewählten Leistungen werden zurückgesetzt.")){return;}
    setData(d=>{const gPal=b?GRUPPEN_PALETTEN[b.gruppe]||{}:{};
    return{...d,branche:val,brancheLabel:b?b.label:"",brancheCustom:"",stil:b?b.stil:d.stil,
      leistungen:sameB?d.leistungen:[],extraLeistung:sameB?d.extraLeistung:"",
      accentColor:"",
      ...(!sameB?gPal:{})};
  });if(!sameB){setHexInput("");}};
  const legalOk=(()=>{const u=data.unternehmensform;if(!u)return false;if(u==="einzelunternehmen"&&(!data.vorname?.trim()||!data.nachname?.trim()))return false;const needsFB=["eu","gmbh","og","kg","ag"].includes(u);if(needsFB&&(!data.firmenbuchnummer?.trim()||!data.firmenbuchgericht?.trim()))return false;if(u==="gmbh"&&!data.geschaeftsfuehrer?.trim())return false;if(u==="ag"&&!data.vorstand?.trim())return false;if(u==="verein"&&!data.zvr_zahl?.trim())return false;return true})();
  const sv1=!!(data.firmenname?.trim()&&data.branche&&data.bundesland&&data.kurzbeschreibung?.trim());
  const sv2=!!(data.leistungen?.length>0||data.extraLeistung?.trim());
  const sv3=!!(data.adresse?.trim()&&data.plz?.trim()&&data.ort?.trim()&&data.telefon?.trim()&&data.email?.trim()&&data.oeffnungszeiten);
  const sv4=legalOk&&impressumConfirm;
  const allValid=sv1&&sv2&&sv3&&sv4;
  const uf=data.unternehmensform;const hasFB=["eu","gmbh","og","kg","ag"].includes(uf);
  const hdr=(bc,title,sub)=><><div className="q-mh"><div className="q-mh-bc">Website erstellen <span style={{opacity:.4}}>{"›"}</span> <b>{bc}</b>{importResult&&<span style={{marginLeft:8,fontSize:".65rem",fontWeight:600,color:T.green,background:T.greenLight,padding:"2px 8px",borderRadius:100,verticalAlign:"middle"}}>importiert — bitte prüfen</span>}</div><div className="q-mh-title">{title}</div><div className="q-mh-sub">{sub}</div></div><div className="q-mh-line"/></>;
  const missingHint=(stepN)=>{const m=[];if(stepN===1){if(!data.firmenname?.trim())m.push("Firmenname");if(!data.branche)m.push("Branche");if(!data.bundesland)m.push("Bundesland");if(!data.kurzbeschreibung?.trim())m.push("Kurzbeschreibung");}else if(stepN===2){if(!(data.leistungen?.length>0||data.extraLeistung?.trim()))m.push("mind. 1 Leistung");}else if(stepN===3){if(!data.adresse?.trim())m.push("Adresse");if(!data.plz?.trim())m.push("PLZ");if(!data.ort?.trim())m.push("Ort");if(!data.telefon?.trim())m.push("Telefon");if(!data.email?.trim())m.push("E-Mail");if(!data.oeffnungszeiten)m.push("Öffnungszeiten");}else if(stepN===4){if(!legalOk)m.push("Impressum-Angaben");if(!impressumConfirm)m.push("Bestätigung");}return m;};
  const ftr=(back,next,label,disabled,style)=>{const missing=disabled?missingHint(step):[];return<div className="q-footer">{disabled&&missing.length>0&&<div style={{fontSize:".78rem",color:T.textMuted,marginBottom:8,textAlign:"center"}}>Bitte ausfüllen: {missing.join(", ")}</div>}{back&&<button className="q-btn-back" onClick={()=>go(step-1)}>Zurück</button>}<button className="q-btn-next" onClick={next} disabled={disabled} style={style}>{label} <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg></button></div>};
  const chevron=<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>;

  return(<div className="q-layout"><style>{css+qCss}</style>
  {/* Sidebar */}
  <aside className="q-sb">
    <div className="q-sb-top">
      <img className="q-sb-logo" src="/logo.png" alt="SiteReady" onError={e=>{e.currentTarget.style.display="none"}}/>
      <div className="q-sb-site"><div className="q-sb-dot"/><div className="q-sb-url">Website erstellen</div></div>
    </div>
    <nav className="q-sb-nav">
      <div className="q-sb-grp">Schritte</div>
      {SECS.map((s,i)=><button key={s.id} className={`q-sb-ni${i===step?" q-active":""}${i<step?" q-done":""}${i>step?" q-future":""}`} onClick={()=>{if(i<=step)go(i)}}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{s.icon}</svg>
        {s.label}
        {i<step&&<span className="q-sb-done"/>}
        {i===step&&i>0&&<span className="q-sb-comp"/>}
      </button>)}
    </nav>
    <div className="q-sb-progress"><div className="q-sb-bar-wrap"><div className="q-sb-bar-fill" style={{width:`${pct}%`}}/></div><div className="q-sb-pct">{pct}%</div></div>
  </aside>
  {/* Main */}
  <div className="q-main">
    {step>0&&step<SECS.length-1&&<div className="q-mob-bar"><span className="q-mob-step">Schritt {step} von 5 — {SECS[step].label}</span><div className="q-mob-progress"><div className="q-mob-fill" style={{width:`${pct}%`}}/></div><span className="q-mob-pct">{pct}%</span></div>}
    {/* 0: Start */}
    <div id="q-sec-0" className={`q-section${step===0?" q-vis":""}`}>
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"36px 20px",overflowY:"auto"}}>
        {importResult ? (()=>{
          const j=importResult;
          const formChecks=[
            j.firmenname&&["Firmenname",j.firmenname],
            j.branche&&["Branche",BRANCHEN.find(b=>b.value===j.branche)?.label||j.branche],
            j.leistungen?.length&&["Leistungen",j.leistungen.length+" erkannt"],
            (j.adresse||j.ort)&&["Adresse",[j.adresse,j.plz,j.ort].filter(Boolean).join(", ")],
            j.telefon&&["Telefon",j.telefon],
            j.email&&["E-Mail",j.email],
            j.oeffnungszeiten_import&&["Öffnungszeiten","erkannt"],
            (j.facebook||j.instagram||j.linkedin||j.tiktok)&&["Social Media",[j.facebook&&"Facebook",j.instagram&&"Instagram",j.linkedin&&"LinkedIn",j.tiktok&&"TikTok"].filter(Boolean).join(", ")],
            j.unternehmensform&&["Impressum-Daten","erkannt"],
            j.brand_color&&["Markenfarbe",j.brand_color],
          ].filter(Boolean);
          const portalChecks=[
            j.bewertungen?.length&&["Kundenbewertungen",j.bewertungen.length+" übernommen"],
            j.faq?.length&&["FAQ",j.faq.length+" Fragen"],
            j.fakten?.length&&["Zahlen & Fakten",j.fakten.length+" erkannt"],
            j.partner?.length&&["Partner & Zertifikate",j.partner.length+" erkannt"],
            j.team?.length&&["Team-Mitglieder",j.team.length+" erkannt"],
            j.whatsapp&&["WhatsApp",j.whatsapp],
            j.buchungslink&&["Online-Buchung","erkannt"],
            j.downloads?.length&&["Downloads",j.downloads.map(d=>d.label).join(", ")],
          ].filter(Boolean);
          const meta=j._meta||{};
          const CheckRow=({items,color})=>items.map(([label,value],i)=><div key={i} style={{display:"flex",alignItems:"center",gap:10,fontSize:".85rem"}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" style={{flexShrink:0}}><polyline points="20 6 9 17 4 12"/></svg>
            <span style={{fontWeight:600,color:T.dark,minWidth:120}}>{label}</span>
            <span style={{color:T.textMuted,fontSize:".82rem"}}>{value}</span>
          </div>);
          return <div style={{maxWidth:520,width:"100%",textAlign:"center"}}>
            <div style={{width:56,height:56,borderRadius:"50%",background:T.greenLight,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={T.green} strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <div style={{fontSize:"1.3rem",fontWeight:800,color:T.dark,letterSpacing:"-.02em",marginBottom:6}}>Website erfolgreich importiert</div>
            <div style={{fontSize:".85rem",color:T.textMuted,marginBottom:24}}>{meta.pages_read||"Mehrere"} Seiten gelesen{meta.duration_ms?` in ${Math.round(meta.duration_ms/1000)}s`:""}</div>
            {formChecks.length>0&&<div style={{textAlign:"left",background:"#fff",border:`1px solid ${T.bg3}`,borderRadius:T.r,padding:"16px 20px",marginBottom:12}}>
              <div style={{fontSize:".72rem",fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:".1em",marginBottom:12}}>Jetzt prüfen</div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}><CheckRow items={formChecks} color={T.green}/></div>
            </div>}
            {portalChecks.length>0&&<div style={{textAlign:"left",background:"#fff",border:`1px solid ${T.bg3}`,borderRadius:T.r,padding:"16px 20px",marginBottom:12}}>
              <div style={{fontSize:".72rem",fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:".1em",marginBottom:12}}>Zusätzlich übernommen <span style={{fontWeight:400,textTransform:"none",letterSpacing:0}}>— im Portal bearbeitbar</span></div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}><CheckRow items={portalChecks} color={T.accent}/></div>
            </div>}
            {formChecks.length===0&&portalChecks.length===0&&<div style={{background:"#fff",border:`1px solid ${T.bg3}`,borderRadius:T.r,padding:"20px",marginBottom:12,fontSize:".85rem",color:T.textMuted,textAlign:"center"}}>Keine Daten erkannt. Bitte geben Sie die Daten manuell ein.</div>}
            <div style={{fontSize:".82rem",color:T.textMuted,marginBottom:20,lineHeight:1.5}}>{formChecks.length>0?"Bitte prüfen Sie die Angaben in den nächsten Schritten.":"Bitte geben Sie Ihre Daten in den nächsten Schritten ein."}</div>
            <button className="q-btn-next" onClick={()=>go(1)} style={{width:"100%",justifyContent:"center",padding:"14px 28px",fontSize:".95rem"}}>{formChecks.length>0?"Angaben prüfen":"Weiter"} {chevron}</button>
          </div>;
        })()
        : <div style={{maxWidth:520,width:"100%",textAlign:"center"}}>
          <img src="/logo.png" alt="SiteReady" style={{height:32,marginBottom:24}} onError={e=>{e.currentTarget.style.display="none"}}/>
          <div style={{fontSize:"1.5rem",fontWeight:800,color:T.dark,letterSpacing:"-.03em",lineHeight:1.2,marginBottom:8}}>Ihre professionelle Website<br/>in wenigen Minuten.</div>
          <div style={{fontSize:".9rem",color:T.textMuted,marginBottom:40,lineHeight:1.5}}>Impressum nach ECG, DSGVO und SEO-Optimierung inklusive.</div>
          <div className="q-content-card" style={{textAlign:"left",marginBottom:24}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
              <div style={{width:32,height:32,borderRadius:8,background:T.accentLight,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.accent} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg></div>
              <div><div style={{fontSize:".88rem",fontWeight:700,color:T.dark}}>Bestehende Präsenz importieren</div><div style={{fontSize:".75rem",color:T.textMuted}}>Website oder Google Maps Eintrag liefern die besten Ergebnisse</div></div>
            </div>
            <div className="q-import-row">
              <input className="q-import-input" type="url" value={importUrl} onChange={e=>setImportUrl(e.target.value)} placeholder="https://www.ihre-website.at" onKeyDown={e=>{if(e.key==="Enter")e.preventDefault()}}/>
              <button className="q-import-btn" onClick={doImport} disabled={!importConfirm||importLoading}>{importLoading?"Importieren...":"Importieren"}</button>
            </div>
            {importLoading&&<div style={{marginTop:10,display:"flex",alignItems:"center",gap:12,padding:"12px 16px",background:T.bg,borderRadius:T.rSm,border:`1px solid ${T.bg3}`}}>
              <div style={{position:"relative",width:36,height:36,flexShrink:0}}>
                <svg width="36" height="36" viewBox="0 0 36 36" style={{transform:"rotate(-90deg)"}}>
                  <circle cx="18" cy="18" r="15" fill="none" stroke={T.bg3} strokeWidth="3"/>
                  <circle cx="18" cy="18" r="15" fill="none" stroke={T.accent} strokeWidth="3" strokeLinecap="round" strokeDasharray={2*Math.PI*15} strokeDashoffset={2*Math.PI*15*(1-Math.min(importSeconds/90,0.95))} style={{transition:"stroke-dashoffset 1s linear"}}/>
                </svg>
                <span style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:".65rem",fontWeight:700,color:T.dark,fontFamily:"'JetBrains Mono',monospace"}}>{importSeconds}s</span>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:2}}>
                <span style={{fontSize:".85rem",color:T.dark,fontWeight:600}}>{importPhase}</span>
                <span style={{fontSize:".72rem",color:T.textMuted}}>{/google\.(com|at|de|ch)\/(maps|place)|goo\.gl/i.test(importUrl)?"Google-Profil und verknüpfte Website werden analysiert":"Ihre Daten werden gründlich ausgelesen"}</span>
              </div>
            </div>}
            {importErr&&<div style={{marginTop:8,padding:"12px 14px",background:T.redLight,borderRadius:T.rSm,border:`1px solid ${T.redBorder}`,fontSize:".85rem",color:T.red,lineHeight:1.5}}>
              <div>{importErr.split("support@siteready.at").map((part,i,arr)=>i<arr.length-1?<span key={i}>{part}<a href="mailto:support@siteready.at?subject=Website-Import" style={{color:T.accent,fontWeight:700,textDecoration:"underline"}}>support@siteready.at</a></span>:<span key={i}>{part}</span>)}</div>
              <div style={{display:"flex",gap:8,marginTop:10}}>
                <button onClick={()=>{setImportErr("");doImport();}} style={{padding:"7px 16px",border:"none",borderRadius:T.rSm,background:T.red,color:"#fff",cursor:"pointer",fontSize:".82rem",fontWeight:700,fontFamily:T.font}}>Nochmal versuchen</button>
                <button onClick={()=>{setImportErr("");go(1);}} style={{padding:"7px 16px",border:`1.5px solid ${T.bg3}`,borderRadius:T.rSm,background:T.white,color:T.text,cursor:"pointer",fontSize:".82rem",fontWeight:600,fontFamily:T.font}}>Manuell eingeben</button>
              </div>
            </div>}
            <label style={{display:"flex",alignItems:"flex-start",gap:10,cursor:"pointer",padding:"10px 14px",background:T.bg,borderRadius:T.rSm,border:`1px solid ${importConfirm?T.accent+"44":T.bg3}`,marginTop:12}}>
              <input type="checkbox" checked={importConfirm} onChange={e=>setImportConfirm(e.target.checked)} style={{marginTop:2,accentColor:T.accent,width:18,height:18,flexShrink:0,cursor:"pointer"}}/>
              <span style={{fontSize:".72rem",color:T.textSub,lineHeight:1.5}}>Ich bestätige, dass ich berechtigt bin, die Daten dieser Website zu importieren.</span>
            </label>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:24,color:"#b5b8c0",fontSize:".82rem",fontWeight:500}}><div style={{flex:1,height:1,background:T.bg3}}/> oder <div style={{flex:1,height:1,background:T.bg3}}/></div>
          <button className="q-btn-next" onClick={()=>go(1)} style={{width:"100%",justifyContent:"center",padding:"14px 28px",fontSize:".95rem"}}>Ohne Import starten {chevron}</button>
          <div style={{marginTop:16,display:"flex",justifyContent:"center",gap:24,fontSize:".72rem",color:T.textMuted}}>
            <span style={{display:"flex",alignItems:"center",gap:4}}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> Fertig in unter 10 Min.</span>
            <span style={{display:"flex",alignItems:"center",gap:4}}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg> 7 Tage kostenlos</span>
            <span style={{display:"flex",alignItems:"center",gap:4}}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> DSGVO inklusive</span>
          </div>
        </div>}
      </div>
    </div>
    {/* 1: Grunddaten */}
    <div id="q-sec-1" className={`q-section${step===1?" q-vis":""}`}>
      {hdr("Grunddaten","Grunddaten","Erzählen Sie uns von Ihrem Unternehmen.")}
      <div className="q-mb">
        <Field label="Firmenname" value={data.firmenname} onChange={up("firmenname")} placeholder="z.B. Elektro Müller GmbH" required/>
        <Combobox label="Beruf / Branche" value={data.branche} onChange={onBrancheChange} options={BRANCHEN} placeholder="z.B. Elektriker, Friseur, ..." hint="Leistungen und Stil werden automatisch angepasst" required/>
        {data.branche&&data.branche!=="sonstige"&&getBrancheGruppe(data.branche)&&<div style={{marginTop:-12,marginBottom:16,fontSize:".78rem",color:T.textMuted}}>Berufsgruppe: <span style={{fontWeight:600,color:T.accent}}>{getBrancheGruppe(data.branche).label}</span></div>}
        {data.branche==="sonstige"&&<Field label="Ihr Beruf" value={data.brancheCustom} onChange={up("brancheCustom")} placeholder="z.B. Spenglerei, Beautysalon, ..."/>}
        <Field label="Kurzbeschreibung" value={data.kurzbeschreibung} onChange={up("kurzbeschreibung")} placeholder="Seit 15 Jahren Ihr zuverlässiger Partner." rows={2} hint="Erscheint oben auf Ihrer Website. Daraus erstellen wir automatisch Ihren Über-uns-Text und Ihre Vorteile." required/>
        <Dropdown label="Bundesland" value={data.bundesland} onChange={v=>{up("bundesland")(v);const bl=BUNDESLAENDER.find(b=>b.value===v);up("einsatzgebiet")(bl?bl.label:"")}} options={BUNDESLAENDER} placeholder="Bundesland wählen" required/>
      </div>
      {ftr(true,()=>go(2),"Weiter",!sv1)}
    </div>
    {/* 2: Leistungen */}
    <div id="q-sec-2" className={`q-section${step===2?" q-vis":""}`}>
      {hdr("Leistungen","Leistungen","Wählen Sie Ihre Leistungen. Diese erscheinen als Karten auf Ihrer Website.")}
      <div className="q-mb">
        {brancheLeistungen.length>0?<Checklist label="Leistungen auswählen" options={[...new Set([...brancheLeistungen,...(data.leistungen||[])])]} selected={data.leistungen} onChange={up("leistungen")} hint="Wählen Sie Ihre Leistungen"/>:<TagInput label="Ihre Leistungen" value={data.extraLeistung} onChange={up("extraLeistung")} placeholder="Leistung eingeben + Enter" hint="Leistung eingeben und Enter drücken – max. 12"/>}
        {brancheLeistungen.length>0&&<TagInput label="Zusätzliche Leistungen (optional)" value={data.extraLeistung} onChange={up("extraLeistung")} placeholder="z.B. Beratung, Planung, ..." hint="Leistung eingeben und Enter drücken"/>}
        <div style={{marginTop:16,padding:"12px 14px",background:T.accentLight,borderRadius:T.rSm,border:"1px solid rgba(143,163,184,.15)"}}><div style={{fontSize:".78rem",fontWeight:700,color:T.accent,marginBottom:3}}>KI generiert Leistungs-Beschreibungen</div><div style={{fontSize:".78rem",color:T.textSub,lineHeight:1.65}}>Für jede Leistung erstellen wir automatisch einen Beschreibungstext. Im Portal können Sie diese anpassen, Preise eintragen und Fotos pro Leistung zuordnen.</div></div>
      </div>
      {ftr(true,()=>go(3),"Weiter",!sv2)}
    </div>
    {/* 3: Standort & Kontakt */}
    <div id="q-sec-3" className={`q-section${step===3?" q-vis":""}`}>
      {hdr("Standort & Kontakt","Standort & Kontakt","Ihre Adresse und Erreichbarkeit auf der Website.")}
      <div className="q-mb" style={{maxWidth:900}}>
        <div className="q-split">
          <div>
            <Field label="Straße & Hausnummer" value={data.adresse} onChange={up("adresse")} placeholder="Mariahilfer Straße 45/3" required/>
            <div className="q-inline-2" style={{display:"grid",gridTemplateColumns:"120px 1fr",gap:12}}><Field label="PLZ" value={data.plz} onChange={up("plz")} placeholder="1060" required/><Field label="Ort" value={data.ort} onChange={up("ort")} placeholder="Wien" required/></div>
            <div className="q-inline-2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}><Field label="Telefon" value={data.telefon} onChange={up("telefon")} placeholder="+43 1 234 56 78" required validate={VALIDATORS.tel}/><Field label="E-Mail" value={data.email} onChange={up("email")} placeholder="office@firma.at" type="email" required validate={VALIDATORS.email}/></div>
            <Dropdown label="Öffnungszeiten" value={data.oeffnungszeiten} onChange={up("oeffnungszeiten")} options={OEFFNUNGSZEITEN} placeholder="Öffnungszeiten wählen" required/>
            {data.oeffnungszeiten==="custom"&&<Field label="Ihre Öffnungszeiten" value={data.oeffnungszeitenCustom} onChange={up("oeffnungszeitenCustom")} placeholder={"Mo-Fr: 08:00-17:00\nSa: nach Vereinbarung"} rows={2}/>}
          </div>
          <div className="q-split-right">
            <div className="q-split-title">Social Media <span style={{fontWeight:400,opacity:.6}}>(optional)</span></div>
            <Field label="Facebook" value={data.facebook} onChange={up("facebook")} onBlur={()=>up("facebook")(normalizeSocial("facebook",data.facebook))} placeholder="ihrefirma" hint="Benutzername oder Link"/>
            <Field label="Instagram" value={data.instagram} onChange={up("instagram")} onBlur={()=>up("instagram")(normalizeSocial("instagram",data.instagram))} placeholder="ihrefirma" hint="Benutzername oder Link"/>
            <Field label="LinkedIn" value={data.linkedin} onChange={up("linkedin")} onBlur={()=>up("linkedin")(normalizeSocial("linkedin",data.linkedin))} placeholder="ihrefirma" hint="Benutzername oder Link"/>
            <Field label="TikTok" value={data.tiktok} onChange={up("tiktok")} onBlur={()=>up("tiktok")(normalizeSocial("tiktok",data.tiktok))} placeholder="ihrefirma" hint="Benutzername oder Link"/>
          </div>
        </div>
      </div>
      {ftr(true,()=>go(4),"Weiter",!sv3)}
    </div>
    {/* 4: Impressum */}
    <div id="q-sec-4" className={`q-section${step===4?" q-vis":""}`}>
      {hdr("Impressum","Impressum","Gesetzlich vorgeschrieben (ECG). Wird automatisch als Unterseite erstellt.")}
      <div className="q-mb" style={{maxWidth:900}}>
        <div className="q-split">
          <div>
            <Dropdown label="Unternehmensform" value={uf} onChange={up("unternehmensform")} options={UNTERNEHMENSFORMEN} placeholder="Unternehmensform wählen" required/>
            {uf==="einzelunternehmen"&&<div className="q-inline-2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}><Field label="Vorname" value={data.vorname} onChange={up("vorname")} placeholder="Maria" required/><Field label="Nachname" value={data.nachname} onChange={up("nachname")} placeholder="Muster" required/></div>}
            {(uf==="einzelunternehmen"||uf==="gesnbr")&&<Field label="Unternehmensgegenstand" value={data.unternehmensgegenstand} onChange={up("unternehmensgegenstand")} placeholder="z.B. Elektroinstallation" hint="Optional"/>}
            {uf==="gesnbr"&&<Field label="Gesellschafter" value={data.gesellschafter} onChange={up("gesellschafter")} placeholder="Max Mustermann, Maria Musterfrau" hint="Empfohlen laut WKO"/>}
            {hasFB&&<div className="q-inline-2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}><Field label="Firmenbuchnr." value={data.firmenbuchnummer} onChange={up("firmenbuchnummer")} placeholder="FN 123456 a" required/><Field label="FB-Gericht" value={data.firmenbuchgericht} onChange={up("firmenbuchgericht")} placeholder="HG Wien" required/></div>}
            {uf==="gmbh"&&<Field label="Geschäftsführer" value={data.geschaeftsfuehrer} onChange={up("geschaeftsfuehrer")} placeholder="Vor- und Nachname" required/>}
            {uf==="ag"&&<><Field label="Vorstand" value={data.vorstand} onChange={up("vorstand")} placeholder="Vor- und Nachname" required/><Field label="Aufsichtsrat" value={data.aufsichtsrat} onChange={up("aufsichtsrat")} placeholder="Vor- und Nachname" hint="Optional"/></>}
            {uf==="verein"&&<><Field label="ZVR-Zahl" value={data.zvr_zahl} onChange={up("zvr_zahl")} placeholder="z.B. 123456789" required/><Field label="Vertretungsorgane" value={data.vertretungsorgane} onChange={up("vertretungsorgane")} placeholder="z.B. Obmann: Max Mustermann" rows={2}/></>}
            {hasFB&&<Toggle label="In Liquidation" checked={!!data.liquidation} onChange={v=>up("liquidation")(v?"in Liquidation":"")} desc="Nur wenn zutreffend"/>}
            <label style={{display:"flex",alignItems:"flex-start",gap:10,cursor:"pointer",padding:"12px 14px",background:T.bg,borderRadius:T.rSm,border:`1px solid ${impressumConfirm?T.accent+"44":T.bg3}`,marginTop:12}}>
              <input type="checkbox" checked={impressumConfirm} onChange={e=>setImpressumConfirm(e.target.checked)} style={{marginTop:2,accentColor:T.accent,width:18,height:18,flexShrink:0,cursor:"pointer"}}/>
              <span style={{fontSize:".78rem",color:T.textSub,lineHeight:1.5}}>Ich bestätige, dass die Angaben korrekt sind und als Impressum veröffentlicht werden.</span>
            </label>
          </div>
          <div className="q-split-right">
            <div className="q-split-title">Weitere Angaben <span style={{fontWeight:400,opacity:.6}}>(optional)</span></div>
            <Field label="UID-Nummer / ATU" value={data.uid} onChange={up("uid")} placeholder="ATU12345678"/>
            <Field label="GISA-Zahl" value={data.gisazahl} onChange={up("gisazahl")} placeholder="z.B. 12345678"/>
            <Field label="Aufsichtsbehörde" value={data.aufsichtsbehoerde} onChange={up("aufsichtsbehoerde")} placeholder="z.B. MA 63"/>
            <Field label="Kammer / Berufsrecht" value={data.kammer_berufsrecht} onChange={up("kammer_berufsrecht")} placeholder="z.B. WKO Wien"/>
            <div style={{marginTop:8,padding:"10px 12px",background:T.accentLight,borderRadius:T.rSm,border:"1px solid rgba(143,163,184,.15)"}}><div style={{fontSize:".72rem",color:T.textSub,lineHeight:1.6}}>Alle Angaben werden automatisch in Ihr Impressum nach ECG eingebaut.</div></div>
          </div>
        </div>
      </div>
      {ftr(true,()=>go(5),"Weiter",!sv4)}
    </div>
    {/* 5: Design — Stil + optionale Akzentfarbe */}
    <div id="q-sec-5" className={`q-section${step===5?" q-vis":""}`}>
      {hdr("Design","Design & Akzentfarbe","Wählen Sie einen Stil — die Akzentfarbe passt sich automatisch an Ihre Branche an.")}
      <div className="q-mb" style={{maxWidth:900}}>
        {(()=>{
          const STILE=[
            {value:"klassisch",label:"Klassisch",desc:"Seriös, klar strukturiert. Dezente Linien, kompaktes Layout.",color:"#094067",accent:"#0369a1",bg:"#f4f7fa"},
            {value:"modern",label:"Modern",desc:"Frisch, runde Formen. Schatten-Cards, Pill-Buttons.",color:"#18181b",accent:"#4f46e5",bg:"#fafafa"},
            {value:"elegant",label:"Elegant",desc:"Minimalistisch, Serif-Überschriften. Premium-Ausstrahlung.",color:"#020826",accent:"#7a6844",bg:"#f9f4ef"},
          ];
          const currentAccent=data.accentColor||BRANCHEN_ACCENTS[data.branche]||STYLES_MAP[data.stil]?.accent||"#0369A1";
          const showAccent=showAccentPicker;const setShowAccent=setShowAccentPicker;
          const renderThumb=(s)=>{
            const r=s.value==="modern"?10:s.value==="elegant"?2:4;
            const cardBorder=s.value==="modern"?"none":`1px solid ${s.value==="elegant"?"#eaddcf":"#dce6ef"}`;
            const cardShadow=s.value==="modern"?"0 2px 6px rgba(0,0,0,.06)":"none";
            const cardBorderLeft=s.value==="klassisch"?`2px solid ${s.accent}`:"none";
            const cardBorderTop=s.value==="modern"?`2px solid ${s.accent}`:"none";
            const heroFont=s.value==="elegant"?"'Cormorant Garamond','Georgia',serif":"inherit";
            const heroWeight=s.value==="elegant"?600:800;
            const btnR=s.value==="modern"?100:r;
            return(<div style={{width:"100%",aspectRatio:"4/2.6",borderRadius:r,overflow:"hidden",background:s.bg,border:`1px solid rgba(0,0,0,.08)`,position:"relative",marginBottom:12}}>
              {/* Nav */}
              <div style={{background:s.color,height:"18%",display:"flex",alignItems:"center",padding:"0 8px",gap:4}}>
                <div style={{width:10,height:4,background:"rgba(255,255,255,.85)",borderRadius:1}}/>
                <div style={{flex:1}}/>
                <div style={{width:18,height:3,background:"rgba(255,255,255,.4)",borderRadius:1}}/>
                <div style={{width:10,height:3,background:"rgba(255,255,255,.4)",borderRadius:1,marginLeft:3}}/>
              </div>
              {/* Hero */}
              <div style={{padding:"7px 9px 5px 9px",position:"relative"}}>
                {s.value==="modern"&&<div style={{position:"absolute",top:-8,right:-12,width:40,height:40,borderRadius:"50%",background:s.accent,opacity:.1,filter:"blur(8px)"}}/>}
                {s.value==="klassisch"&&<div style={{position:"absolute",top:6,right:7,display:"flex",flexDirection:"column",gap:2,alignItems:"flex-end"}}><div style={{width:16,height:1,background:s.accent,opacity:.5}}/><div style={{width:22,height:1,background:s.accent,opacity:.5}}/><div style={{width:12,height:1,background:s.accent,opacity:.5}}/></div>}
                <div style={{fontFamily:heroFont,fontWeight:heroWeight,fontSize:9,color:s.color,lineHeight:1.15,maxWidth:"75%"}}>Ihr Betrieb in Wien</div>
                {s.value==="elegant"&&<div style={{width:14,height:1.5,background:s.accent,marginTop:3}}/>}
                <div style={{fontSize:6,color:"rgba(0,0,0,.45)",marginTop:3,maxWidth:"80%",lineHeight:1.3}}>Professionelle Leistungen</div>
                <div style={{display:"inline-block",marginTop:4,background:s.accent,color:"#fff",fontSize:5,padding:"2.5px 6px",borderRadius:btnR,fontWeight:600}}>Termin</div>
              </div>
              {/* Cards */}
              <div style={{position:"absolute",bottom:6,left:9,right:9,display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:3}}>
                {[0,1,2].map(i=>(<div key={i} style={{height:15,background:"#fff",borderRadius:r,border:cardBorder,boxShadow:cardShadow,borderLeft:cardBorderLeft||cardBorder,borderTop:cardBorderTop||cardBorder,display:"flex",flexDirection:"column",gap:1.5,padding:"2px 3px",justifyContent:"center"}}>
                  <div style={{height:1.5,background:s.accent,width:"40%",borderRadius:.5,opacity:.8}}/>
                  <div style={{height:1,background:"rgba(0,0,0,.12)",width:"80%",borderRadius:.5}}/>
                </div>))}
              </div>
            </div>);
          };
          return<div>
            {/* Stil-Auswahl */}
            <div style={{fontSize:".72rem",fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:".1em",marginBottom:10}}>Stil</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:24}}>
              {STILE.map(s=>{
                const active=data.stil===s.value;
                return<button key={s.value} onClick={()=>up("stil")(s.value)} style={{padding:14,border:active?`2.5px solid ${T.dark}`:`1.5px solid ${T.bg3}`,borderRadius:T.rSm,background:active?T.white:"#fff",cursor:"pointer",textAlign:"left",fontFamily:T.font,transition:"all .15s",boxShadow:active?T.sh2:"none",position:"relative"}}>
                  {renderThumb(s)}
                  <div style={{fontSize:".92rem",fontWeight:800,color:T.dark,marginBottom:4}}>{s.label}</div>
                  <div style={{fontSize:".75rem",color:T.textMuted,lineHeight:1.55}}>{s.desc}</div>
                  {active&&<div style={{position:"absolute",top:10,right:10,width:20,height:20,borderRadius:"50%",background:T.dark,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800}}>{"✓"}</div>}
                </button>;
              })}
            </div>
            {/* Akzentfarbe — aufklappbar, optional */}
            <button onClick={()=>setShowAccent(!showAccent)} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 16px",border:`1.5px solid ${T.bg3}`,borderRadius:T.rSm,background:"#fff",cursor:"pointer",fontFamily:T.font,width:"100%",transition:"all .15s",marginBottom:showAccent?0:24}}>
              <div style={{width:22,height:22,borderRadius:6,background:currentAccent,flexShrink:0,border:"1px solid rgba(0,0,0,.1)"}}/>
              <div style={{flex:1,textAlign:"left"}}>
                <div style={{fontSize:".85rem",fontWeight:600,color:T.dark}}>Akzentfarbe anpassen</div>
                <div style={{fontSize:".72rem",color:T.textMuted}}>Buttons, Links und Highlights — aktuell: {ACCENT_PRESETS.find(p=>p.value===currentAccent)?.label||currentAccent}</div>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.textMuted} strokeWidth="2" strokeLinecap="round" style={{transform:showAccent?"rotate(180deg)":"none",transition:"transform .2s"}}><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            {showAccent&&<div style={{padding:"20px",border:`1.5px solid ${T.bg3}`,borderTop:"none",borderRadius:`0 0 ${T.rSm} ${T.rSm}`,background:T.bg,marginBottom:24}}>
              <div style={{fontSize:".72rem",fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:".1em",marginBottom:12}}>Farbe wählen</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:10,marginBottom:16}}>
                {ACCENT_PRESETS.map(p=>{const active=currentAccent===p.value;return<button key={p.value} onClick={()=>{up("accentColor")(p.value);setHexInput(p.value.toUpperCase())}} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 14px",border:active?`2px solid ${T.dark}`:`1.5px solid ${T.bg3}`,borderRadius:100,background:active?T.white:"#fff",cursor:"pointer",fontFamily:T.font,transition:"all .15s",boxShadow:active?"0 2px 8px rgba(0,0,0,.08)":"none"}} title={p.label}><div style={{width:18,height:18,borderRadius:"50%",background:p.value,flexShrink:0,border:"1px solid rgba(0,0,0,.1)"}}/><span style={{fontSize:".78rem",fontWeight:active?700:500,color:active?T.dark:T.textMuted}}>{p.label}</span></button>})}
              </div>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <input type="color" value={currentAccent} onChange={e=>{const v=ensureContrast(e.target.value);up("accentColor")(v);setHexInput(v.toUpperCase())}} style={{width:36,height:36,border:`2px solid ${T.bg3}`,borderRadius:T.rSm,cursor:"pointer",padding:0}}/>
                <input value={hexInput} maxLength={7} onChange={e=>{const v=e.target.value;setHexInput(v);if(/^#[0-9A-Fa-f]{6}$/.test(v)){up("accentColor")(ensureContrast(v))}}} placeholder="#000000" style={{width:90,padding:"6px 10px",border:`1.5px solid ${T.bg3}`,borderRadius:T.rSm,fontFamily:T.mono,fontSize:".82rem",fontWeight:600,color:T.dark}}/>
                <div style={{fontSize:".72rem",color:T.textMuted}}>Eigene Farbe</div>
              </div>
              {/* Kontrast-Info */}
              {(()=>{
                const userHex=/^#[0-9A-Fa-f]{6}$/.test(hexInput)?hexInput:currentAccent;
                const adjusted=ensureContrast(userHex);
                const wasDarkened=userHex.toLowerCase()!==adjusted.toLowerCase();
                const ratio=contrastRatioVsWhite(adjusted);
                const ratioOk=ratio>=4.5;
                return<div style={{marginTop:10,padding:"10px 12px",background:wasDarkened?"#fef3c7":ratioOk?T.greenLight:"#fef3c7",border:`1px solid ${wasDarkened?"#fcd34d":ratioOk?"rgba(22,163,74,.2)":"#fcd34d"}`,borderRadius:T.rSm,fontSize:".74rem",color:wasDarkened?"#78350f":ratioOk?T.green:"#78350f",lineHeight:1.55,display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontWeight:800,fontFamily:T.mono}}>{ratio.toFixed(2)}:1</span>
                  {wasDarkened?<span><strong>Angepasst</strong> — Ihre Farbe war zu hell und wurde für gute Lesbarkeit auf Weiß abgedunkelt.</span>
                  :ratioOk?<span><strong>Guter Kontrast</strong> — erfüllt WCAG AA (4.5:1) auf weißem Hintergrund.</span>
                  :<span><strong>Niedriger Kontrast</strong> — unter WCAG AA (4.5:1). Texte werden schwer lesbar.</span>}
                </div>;
              })()}
              {data.accentColor&&<button onClick={()=>{up("accentColor")("");}} style={{marginTop:12,padding:"6px 14px",border:`1.5px solid ${T.bg3}`,borderRadius:T.rSm,background:"#fff",color:T.textMuted,cursor:"pointer",fontSize:".78rem",fontWeight:500,fontFamily:T.font}}>Auf Branchenstandard zurücksetzen</button>}
            </div>}
            <div style={{padding:"12px 14px",background:T.accentLight,borderRadius:T.rSm,border:"1px solid rgba(143,163,184,.15)"}}><div style={{fontSize:".78rem",fontWeight:700,color:T.accent,marginBottom:3}}>Jederzeit änderbar</div><div style={{fontSize:".78rem",color:T.textSub,lineHeight:1.65}}>Stil und Akzentfarbe können Sie im Portal jederzeit anpassen. Für volle Kontrolle gibt es dort auch Einzelpicker für alle Farben.</div></div>
          </div>;
        })()}
      </div>
      {ftr(true,()=>go(6),"Weiter")}
    </div>
    {/* 6: Zusammenfassung */}
    <div id="q-sec-6" className={`q-section${step===6?" q-vis":""}`}>
      {hdr("Zusammenfassung","Alles bereit!","Prüfen Sie Ihre Angaben und erstellen Sie Ihre Website.")}
      <div className="q-mb">
        <div className="q-content-card">
          <div className="q-summary-table" style={{marginBottom:0}}>
            <div className="q-summary-row"><span style={{color:T.textMuted}}>Unternehmen</span><span style={{fontWeight:600,color:T.dark}}>{data.firmenname||"–"}</span></div>
            <div className="q-summary-row"><span style={{color:T.textMuted}}>Branche</span><span style={{fontWeight:600,color:T.dark}}>{data.brancheLabel||data.brancheCustom||"–"}</span></div>
            <div className="q-summary-row"><span style={{color:T.textMuted}}>Standort</span><span style={{fontWeight:600,color:T.dark}}>{data.plz&&data.ort?`${data.plz} ${data.ort}`:"–"}</span></div>
            <div className="q-summary-row"><span style={{color:T.textMuted}}>Leistungen</span><span style={{fontWeight:600,color:T.dark}}>{(data.leistungen?.length||0)+(data.extraLeistung?.split(",").filter(s=>s.trim()).length||0)} ausgewählt</span></div>
            <div className="q-summary-row"><span style={{color:T.textMuted}}>Kontakt</span><span style={{fontWeight:600,color:T.dark}}>{data.telefon||"–"}</span></div>
            <div className="q-summary-row"><span style={{color:T.textMuted}}>Impressum</span><span style={{fontWeight:600,color:T.dark}}>{uf?UNTERNEHMENSFORMEN.find(u=>u.value===uf)?.label||uf:"–"}{legalOk&&impressumConfirm?" – vollständig":""}</span></div>
            <div className="q-summary-row"><span style={{color:T.textMuted}}>Design</span><span style={{fontWeight:600,color:T.dark,display:"flex",alignItems:"center",gap:8}}>{STYLES_MAP[data.stil]?.label||"Klassisch"}<span style={{width:14,height:14,borderRadius:"50%",background:data.accentColor||BRANCHEN_ACCENTS[data.branche]||STYLES_MAP[data.stil]?.accent||"#0369A1",display:"inline-block",border:"1px solid rgba(0,0,0,.1)"}}/></span></div>
          </div>
        </div>
        <div style={{marginTop:20,padding:"14px 16px",background:T.accentLight,borderRadius:T.rSm,border:"1px solid rgba(143,163,184,.15)"}}>
          <div style={{fontSize:".78rem",fontWeight:700,color:T.accent,marginBottom:6}}>Nach der Erstellung verfeinern Sie im Portal:</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
            {["Logo hochladen","Fotos hinzufügen","Preise eintragen","Branchenfeatures","Eigene Domain","Ankündigungen"].map(t=><span key={t} style={{fontSize:".72rem",padding:"4px 10px",background:T.white,border:`1px solid ${T.bg3}`,borderRadius:100,color:T.textSub,fontWeight:500}}>{t}</span>)}
          </div>
        </div>
      </div>
      {ftr(true,onComplete,"Website erstellen lassen",!allValid,{background:T.green})}
    </div>
  </div>
  </div>);
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
    try{
      const{error}=await supabase.auth.resend({type:"signup",email});
      if(error){console.error("resendConfirmation:",error.message);setResendingConfirm(false);return;}
      setResentConfirm(true);setTimeout(()=>setResentConfirm(false),5000);
    }catch(e){console.error("resendConfirmation:",e);}
    setResendingConfirm(false);
  };

  const submitForgot=async()=>{if(!email){setErr("Bitte E-Mail eingeben.");return;}setLoading(true);setErr("");const{error}=await supabase.auth.resetPasswordForEmail(email,{redirectTo:window.location.origin+"/portal"});if(error)setErr(error.message);else setForgotDone(true);setLoading(false);};
  const submit=async()=>{
    if(!email.trim()){setErr("Bitte E-Mail eingeben.");return;}
    if(!pw.trim()){setErr("Bitte Passwort eingeben.");return;}
    if(!supabase)return;
    setLoading(true);setErr("");
    const{error}=await supabase.auth.signInWithPassword({email,password:pw});
    if(error){
      if(error.message==="Invalid login credentials"){setErr("E-Mail oder Passwort falsch.");setEmailNotConfirmed(false);}
      else if(error.message.toLowerCase().includes("email not confirmed")||error.message.toLowerCase().includes("not confirmed")){setErr("Bitte bestätigen Sie zuerst Ihre E-Mail-Adresse.");setEmailNotConfirmed(true);}
      else{setErr(error.message);setEmailNotConfirmed(false);}
    }
    setLoading(false);
  };

  return(<div style={{minHeight:"100vh",background:T.bg,fontFamily:T.font,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden"}}><style>{css}</style>
    {/* Dezentes Brand-Element: Gradient-Kreis oben rechts */}
    <div style={{position:"absolute",top:-120,right:-120,width:400,height:400,borderRadius:"50%",background:`radial-gradient(circle,${T.accentGlow} 0%,transparent 70%)`,pointerEvents:"none"}}/>
    <div style={{position:"absolute",bottom:-80,left:-80,width:240,height:240,borderRadius:"50%",background:`radial-gradient(circle,${T.accentGlow} 0%,transparent 70%)`,pointerEvents:"none"}}/>
    <div style={{maxWidth:400,width:"100%",padding:"0 24px",position:"relative",zIndex:1}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:40}}>
        <img src="/logo.png" alt="SiteReady" style={{height:36}}/>
      </div>
      {forgotDone?(<div><div style={{fontSize:"1.4rem",fontWeight:800,color:T.dark,marginBottom:12}}>{"✓"} E-Mail gesendet</div><p style={{color:T.textSub,fontSize:".9rem",lineHeight:1.6}}>Prüfen Sie Ihren Posteingang – Sie erhalten in Kürze einen Link zum Zurücksetzen Ihres Passworts.</p><button onClick={()=>{setForgotDone(false);setForgotPw(false);}} style={{marginTop:20,padding:"12px 20px",border:"none",borderRadius:T.rSm,background:T.dark,color:"#fff",cursor:"pointer",fontSize:".85rem",fontWeight:700,fontFamily:T.font}}>Zur Anmeldung</button></div>):forgotPw?(<div><div style={{fontSize:"1.2rem",fontWeight:800,color:T.dark,marginBottom:8}}>Passwort zurücksetzen</div><p style={{color:T.textSub,fontSize:".85rem",marginBottom:20}}>Geben Sie Ihre E-Mail-Adresse ein – wir senden Ihnen einen Link.</p><Field label="E-Mail-Adresse" value={email} onChange={setEmail} placeholder="ihre@email.at" type="email"/>{err&&<div style={{marginBottom:12,padding:"10px 14px",background:T.redLight,borderRadius:T.rSm,fontSize:".78rem",color:T.red}}>{err}</div>}<button onClick={submitForgot} disabled={loading} style={{width:"100%",padding:"14px",border:"none",borderRadius:T.rSm,background:loading?T.bg3:T.dark,color:"#fff",fontSize:".92rem",fontWeight:700,fontFamily:T.font,cursor:loading?"wait":"pointer",marginBottom:12}}>{loading?"...":"Link senden →"}</button><button onClick={()=>{setForgotPw(false);setErr("");}} style={{width:"100%",padding:"12px",border:`1.5px solid ${T.bg3}`,borderRadius:T.rSm,background:"transparent",color:T.textSub,fontSize:".85rem",fontWeight:600,fontFamily:T.font,cursor:"pointer"}}>Abbrechen</button></div>):(<div>
        <div style={{fontSize:".8rem",fontWeight:700,color:T.dark,marginBottom:8}}>Self-Service-Portal</div>
        <h2 style={{fontSize:"1.5rem",fontWeight:800,color:T.dark,margin:"0 0 24px",letterSpacing:"-.03em"}}>Anmelden</h2>
        <Field label="E-Mail-Adresse" value={email} onChange={setEmail} placeholder="ihre@email.at" type="email" validate={VALIDATORS.email}/>
        <Field label="Passwort" value={pw} onChange={setPw} placeholder="Ihr Passwort" type="password"/>
        <div style={{textAlign:"right",marginTop:-14,marginBottom:16}}><button onClick={()=>{setForgotPw(true);setErr("");}} style={{background:"none",border:"none",color:T.accent,fontSize:".8rem",cursor:"pointer",fontFamily:T.font,fontWeight:600}}>Passwort vergessen?</button></div>
        {err&&<div style={{marginBottom:12,padding:"10px 14px",background:T.redLight,borderRadius:T.rSm,fontSize:".78rem",color:T.red}}>
          {err}
          {emailNotConfirmed&&<div style={{marginTop:8}}>
            <span style={{color:T.amberText,fontSize:".75rem"}}>Prüfen Sie Ihren Posteingang und Spam-Ordner. </span>
            <button onClick={resendConfirmation} disabled={resendingConfirm} style={{background:"none",border:"none",color:T.accent,fontSize:".75rem",cursor:"pointer",fontFamily:T.font,fontWeight:700,padding:0,textDecoration:"underline"}}>
              {resentConfirm?"Gesendet!":resendingConfirm?"...":"Bestätigungsmail erneut senden"}
            </button>
          </div>}
        </div>}
        <button onClick={submit} disabled={loading} style={{width:"100%",padding:"14px",border:"none",borderRadius:T.rSm,background:loading?T.bg3:T.dark,color:"#fff",fontSize:".92rem",fontWeight:700,fontFamily:T.font,cursor:loading?"wait":"pointer",marginBottom:12,transition:"background .2s",boxShadow:loading?"none":T.sh2}}>
          {loading?"...":"Anmelden →"}
        </button>
        <button onClick={onBack} style={{width:"100%",padding:"12px",border:"none",borderRadius:T.rSm,background:"transparent",color:T.textMuted,fontSize:".82rem",fontWeight:500,fontFamily:T.font,cursor:"pointer"}}>
          {"←"} Zur Startseite
        </button>
        <div style={{marginTop:24,textAlign:"center",fontSize:".82rem",color:T.textMuted}}>Noch kein Account? <a href="/start" style={{color:T.dark,fontWeight:700,textDecoration:"none"}}>Jetzt Website erstellen</a></div>
      </div>)}
    </div>
  </div>);
}

/* ═══ CROP HELPERS ═══ */
const CROP_ASPECTS={hero:16/9,logo:0,leist1:1,leist2:1,leist3:1,leist4:1,foto1:3/2,foto2:3/2,foto3:3/2,foto4:3/2,foto5:3/2,about1:3/2,about2:3/2,about3:3/2,about4:3/2,about5:3/2,about6:3/2,about7:3/2,about8:3/2};
// Team photos use key like team_0, team_1 etc
const getCropAspect=(key)=>key.startsWith("team_")?1:(CROP_ASPECTS[key]??3/2);

async function cropImage(imageSrc,pixelCrop){
  const img=new Image();img.src=imageSrc;
  await new Promise((r,e)=>{img.onload=r;img.onerror=e;});
  const c=document.createElement("canvas");
  c.width=pixelCrop.width;c.height=pixelCrop.height;
  const ctx=c.getContext("2d");
  ctx.drawImage(img,pixelCrop.x,pixelCrop.y,pixelCrop.width,pixelCrop.height,0,0,pixelCrop.width,pixelCrop.height);
  return new Promise(r=>c.toBlob(r,"image/jpeg",0.92));
}

function CropModal({file,aspectKey,onConfirm,onCancel}){
  const[crop,setCrop]=useState({x:0,y:0});
  const[zoom,setZoom]=useState(1);
  const[croppedArea,setCroppedArea]=useState(null);
  const[imgSrc,setImgSrc]=useState(null);
  const aspect=getCropAspect(aspectKey);
  const isFree=aspect===0;

  useEffect(()=>{
    if(!file)return;
    const url=URL.createObjectURL(file);
    setImgSrc(url);
    return()=>URL.revokeObjectURL(url);
  },[file]);

  const onCropComplete=useCallback((_,area)=>setCroppedArea(area),[]);

  const handleConfirm=async()=>{
    if(!croppedArea||!imgSrc)return;
    const blob=await cropImage(imgSrc,croppedArea);
    onConfirm(blob);
  };

  if(!imgSrc)return null;
  return(<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.7)",zIndex:9999,display:"flex",flexDirection:"column"}} onClick={onCancel}>
    <div style={{flex:1,position:"relative",margin:"60px 24px 0"}} onClick={e=>e.stopPropagation()}>
      <Cropper image={imgSrc} crop={crop} zoom={zoom} aspect={isFree?undefined:aspect}
        onCropChange={setCrop} onZoomChange={setZoom} onCropComplete={onCropComplete}
        style={{containerStyle:{borderRadius:12}}}/>
    </div>
    <div style={{padding:"16px 24px 28px",display:"flex",alignItems:"center",justifyContent:"center",gap:12}} onClick={e=>e.stopPropagation()}>
      <div style={{flex:1,display:"flex",alignItems:"center",gap:10,maxWidth:240}}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.5)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
        <input type="range" min={1} max={3} step={0.05} value={zoom} onChange={e=>setZoom(Number(e.target.value))}
          style={{flex:1,accentColor:"#fff"}}/>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.5)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/><line x1="11" y1="8" x2="11" y2="14"/></svg>
      </div>
      <button onClick={onCancel} style={{padding:"10px 22px",border:"2px solid rgba(255,255,255,.3)",borderRadius:8,background:"transparent",color:"#fff",cursor:"pointer",fontSize:".85rem",fontWeight:600,fontFamily:"'DM Sans',system-ui,sans-serif"}}>Abbrechen</button>
      <button onClick={handleConfirm} style={{padding:"10px 22px",border:"none",borderRadius:8,background:"#fff",color:"#111",cursor:"pointer",fontSize:".85rem",fontWeight:700,fontFamily:"'DM Sans',system-ui,sans-serif"}}>Übernehmen</button>
    </div>
  </div>);
}

/* ═══ PORTAL DASHBOARD ═══ */
function Portal({session,onLogout}){
  const[page,setPage]=useState("overview");
  const[showErweitert,setShowErweitert]=useState(false);
  const PAGE_TAB={overview:"website",hero:"website",grunddaten:"website",leistungen:"website",kontakt:"website",ueberuns:"website",social:"website",design:"website",branchenfeatures:"website",medien:"website",faq:"website",fakten:"website",partner:"website",impressum:"extras",aktuelles:"extras",teilen:"extras",seo:"extras",domain:"extras",rechnungen:"konto",account:"konto",support:"konto",fotos:"website"};
  const tab=PAGE_TAB[page]||"website";
  const nav=p=>{setPage(p);setPtSbOpen(false);};
  const[order,setOrder]=useState(null);
  const originalOrderRef=useRef(null);
  const[saving,setSaving]=useState(false);
  const[lastSavedAt,setLastSavedAt]=useState(null);
  const[savedNowKey,setSavedNowKey]=useState(0);
  const[uploading,setUploading]=useState({});
  const[faqGenerating,setFaqGenerating]=useState(false);
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
  const[showPlanModal,setShowPlanModal]=useState(false);
  const[subscribing,setSubscribing]=useState(false);
  const[toastMsg,setToastMsg]=useState(null);
  const[deleting,setDeleting]=useState({});
  const[impressumConfirmOpen,setImpressumConfirmOpen]=useState(false);
  const[stilPreview,setStilPreview]=useState(null); // null = aktueller Stil, sonst Stil-Preview ohne Save
  const[stilPreviewFullscreen,setStilPreviewFullscreen]=useState(false);
  const[logoContrastIssue,setLogoContrastIssue]=useState(null); // null | "too-dark" | "too-light"
  // Logo-Kontrast-Check bei Stil/Nav-Farbe-Aenderung oder wenn Logo initial geladen wird.
  // Der Check im uploadBlob deckt nur den Moment des Uploads ab — hier fuer bestehende Logos.
  const logoUrlForCheck=order?.url_logo;
  const navHexForCheck=order?.custom_color;
  useEffect(()=>{
    if(!logoUrlForCheck){setLogoContrastIssue(null);return;}
    let cancelled=false;
    (async()=>{
      const logoL=await analyzeImageLuminance(logoUrlForCheck);
      if(cancelled||logoL===null)return;
      const navL=hexLuminance(navHexForCheck||"#0f1a2e");
      const ratio=(Math.max(logoL,navL)+0.05)/(Math.min(logoL,navL)+0.05);
      if(ratio<2.5)setLogoContrastIssue(logoL<0.35?"too-dark":"too-light");
      else setLogoContrastIssue(null);
    })();
    return()=>{cancelled=true;};
  },[logoUrlForCheck,navHexForCheck]);
  const[impressumChecked,setImpressumChecked]=useState(false);
  const[wizardOpen,setWizardOpen]=useState(()=>window.innerWidth>=768);
  const[ptSbOpen,setPtSbOpen]=useState(false);
  const[ptWizOpen,setPtWizOpen]=useState(false);
  // Welcome-Tour: zeigt sich beim allerersten Portal-Besuch (localStorage-Flag)
  const[welcomeOpen,setWelcomeOpen]=useState(()=>{try{return !localStorage.getItem("sr_welcome_seen");}catch(_){return false;}});
  const[welcomeStep,setWelcomeStep]=useState(0);
  const closeWelcome=()=>{try{localStorage.setItem("sr_welcome_seen","1");}catch(_){}setWelcomeOpen(false);};
  const[orderLoadError,setOrderLoadError]=useState(null);
  const[orderLoadAttempts,setOrderLoadAttempts]=useState(0);
  const toastTimer=useRef(null);
  const showToast=(msg)=>{if(toastTimer.current)clearTimeout(toastTimer.current);setToastMsg(msg);const isError=/fehl|error|nicht|problem/i.test(msg);toastTimer.current=setTimeout(()=>setToastMsg(null),isError?5000:2500);};
  const[confirmDel,setConfirmDel]=useState(null);
  const askDelete=(label,onConfirm)=>setConfirmDel({label,onConfirm});
  const[cropData,setCropData]=useState(null);
  const[dragOverAbout,setDragOverAbout]=useState(false);
  const[dragOverGalerie,setDragOverGalerie]=useState(false);

  useEffect(()=>{
    if(!supabase||!session?.user?.id)return;
    let stopped=false;
    const applyOrder=(row)=>{
      setOrder(row);
      originalOrderRef.current=JSON.parse(JSON.stringify(row));
      const urls={};
      const keys=["logo","hero","foto1","foto2","foto3","foto4","foto5","leist1","leist2","leist3","leist4","about1","about2","about3","about4","about5","about6","about7","about8","preisliste"];
      keys.forEach(k=>{const col="url_"+k;if(row[col])urls[k]=row[col]+(row[col].includes("?")?"&":"?")+"t="+Date.now();});
      setAssetUrls(urls);
    };
    const fetchOrder=async(attempt)=>{
      if(stopped)return;
      setOrderLoadAttempts(attempt);
      // 1. Primaer: per user_id (sollte nach RLS-Migration immer matchen)
      const res=await supabase.from("orders").select("*").eq("user_id",session.user.id).order("created_at",{ascending:false}).limit(1);
      if(stopped)return;
      if(res.data&&res.data.length>0){applyOrder(res.data[0]);setOrderLoadError(null);return true;}
      // 2. Fallback: per email (falls user_id-Spalte noch null ist)
      if(session.user.email){
        const r2=await supabase.from("orders").select("*").eq("email",session.user.email).order("created_at",{ascending:false}).limit(1);
        if(stopped)return;
        if(r2.data&&r2.data.length>0){applyOrder(r2.data[0]);setOrderLoadError(null);return true;}
      }
      // 3. Fehler merken (fuer Diagnose/Error-State)
      const err=res.error||{};
      setOrderLoadError({message:err.message||"Keine Bestellung gefunden",code:err.code||null,hint:err.hint||null});
      try{console.error("Portal load: keine Order gefunden",{attempt,userId:session.user.id,email:session.user.email,error:res.error});}catch(_){}
      return false;
    };
    (async()=>{
      // Initial + bis zu 4 Retries mit Backoff (2s, 4s, 8s, 15s) gegen Timing/Propagation
      for(let i=1;i<=5&&!stopped;i++){
        const ok=await fetchOrder(i);
        if(ok||stopped)return;
        if(i<5){await new Promise(r=>setTimeout(r,[2000,4000,8000,15000][i-1]));}
      }
    })();
    return()=>{stopped=true;};
  },[session]);

  const upOrder=k=>v=>setOrder(o=>({...o,[k]:v}));
  // Impressum-Felder werden NUR via saveImpressum() (Pflichtfeld-Check + Confirm) gespeichert,
  // NICHT via Auto-Save. dirty-Erkennung trennt: Auto-Save beachtet nur Nicht-Impressum-Felder,
  // damit der Timer nicht endlos feuert wenn Impressum ungespeichert ist.
  const IMPRESSUM_FIELDS=["unternehmensform","uid_nummer","firmenbuchnummer","firmenbuchgericht","gisazahl","geschaeftsfuehrer","vorstand","aufsichtsrat","zvr_zahl","vertretungsorgane","gesellschafter","vorname","nachname"];
  const isFieldDirty=(k)=>order&&originalOrderRef.current&&JSON.stringify(order[k])!==JSON.stringify(originalOrderRef.current[k]);
  const isImpressumDirty=order&&originalOrderRef.current&&IMPRESSUM_FIELDS.some(isFieldDirty);
  const isAutoSaveDirty=order&&originalOrderRef.current&&Object.keys(order).some(k=>!IMPRESSUM_FIELDS.includes(k)&&isFieldDirty(k));
  const isDirty=isAutoSaveDirty||isImpressumDirty;
  useEffect(()=>{const h=e=>{if(isDirty){e.preventDefault();e.returnValue="";}};window.addEventListener("beforeunload",h);return()=>window.removeEventListener("beforeunload",h);},[isDirty]);
  const[saveError,setSaveError]=useState(null);
  const saveAll=async(silent=false)=>{
    if(!order||!supabase)return;
    setSaving(true);
    setSaveError(null);
    const{error}=await supabase.from("orders").update({
      firmenname:order.firmenname,kurzbeschreibung:order.kurzbeschreibung,einsatzgebiet:order.einsatzgebiet,hero_headline:order.hero_headline||null,
      adresse:order.adresse,plz:order.plz,ort:order.ort,telefon:order.telefon,
      oeffnungszeiten:order.oeffnungszeiten,oeffnungszeiten_custom:order.oeffnungszeiten_custom,
      kontakt_formular:order.kontakt_formular||null,gut_zu_wissen:order.gut_zu_wissen||null,
      whatsapp:order.whatsapp||null,
      buchungslink:order.buchungslink||null,terminvereinbarung:order.terminvereinbarung,
      erstgespraech_gratis:order.erstgespraech_gratis,online_beratung:order.online_beratung,
      hausbesuche:order.hausbesuche,barrierefrei:order.barrierefrei,parkplaetze:order.parkplaetze,
      kartenzahlung:order.kartenzahlung,gastgarten:order.gastgarten,takeaway:order.takeaway,
      lieferservice:order.lieferservice,
      leistungen:order.leistungen,extra_leistung:order.extra_leistung,
      notdienst:order.notdienst,meisterbetrieb:order.meisterbetrieb,
      kostenvoranschlag:order.kostenvoranschlag,
      leistungen_beschreibungen:order.leistungen_beschreibungen||null,
      leistungen_preise:order.leistungen_preise||null,
      leistungen_fotos:order.leistungen_fotos||null,
      ablauf_schritte:order.ablauf_schritte||null,
      text_ueber_uns:order.text_ueber_uns||null,text_vorteile:order.text_vorteile||null,
      facebook:order.facebook||null,instagram:order.instagram||null,
      linkedin:order.linkedin||null,tiktok:order.tiktok||null,
      stil:order.stil,fotos:order.fotos,
      custom_color:order.custom_color||null,custom_accent:order.custom_accent||null,
      custom_bg:order.custom_bg||null,custom_text:order.custom_text||null,
      custom_text_muted:order.custom_text_muted||null,custom_sep:order.custom_sep||null,
      custom_font:order.custom_font||null,custom_radius:order.custom_radius||null,
      varianten_cache:order.varianten_cache||null,
      faq:order.faq||null,galerie:order.galerie||null,
      fakten:order.fakten||null,partner:order.partner||null,
      sections_visible:order.sections_visible||null,
      spezialisierung:order.spezialisierung||null,berufsregister_nr:order.berufsregister_nr||null,
      zertifiziert:order.zertifiziert,ratenzahlung:order.ratenzahlung,gutscheine:order.gutscheine,
      // Impressum-Felder bewusst ausgenommen: rechtlich sensibel, werden
      // nur via saveImpressum() (Pflichtfeld-Check + Confirm-Dialog) geschrieben.
      // unternehmensform, uid_nummer, firmenbuchnummer, firmenbuchgericht,
      // gisazahl, geschaeftsfuehrer, vorstand, aufsichtsrat, zvr_zahl,
      // vertretungsorgane, gesellschafter, vorname, nachname.
      cta_headline:order.cta_headline||null,cta_text:order.cta_text||null,
      foerderungsberatung:order.foerderungsberatung,kassenvertrag:order.kassenvertrag||null,
      team_members:order.team_members||null,announcements:order.announcements||null,
      unternehmensgegenstand:order.unternehmensgegenstand||null,liquidation:order.liquidation||null,
      kammer_berufsrecht:order.kammer_berufsrecht||null,aufsichtsbehoerde:order.aufsichtsbehoerde||null,
      foto_credit:order.foto_credit||null,foto_rights_confirmed:order.foto_rights_confirmed||false,
    }).eq("id",order.id);
    setSaving(false);
    if(error){
      setSaveError(error.message||"Unbekannter Fehler");
      if(!silent)showToast("Speichern fehlgeschlagen — bitte erneut versuchen");
      try{await supabase.from("error_logs").insert({source:"save_all_error",message:error.message});}catch(_){}
      return;
    }
    // Sync nur Nicht-Impressum-Felder — sonst waere Impressum nach Auto-Save
    // faelschlich "clean" (originalOrderRef == order), obwohl DB nicht gepatcht wurde.
    const synced={...originalOrderRef.current};
    Object.keys(order).forEach(k=>{
      if(!IMPRESSUM_FIELDS.includes(k))synced[k]=order[k]==null?order[k]:JSON.parse(JSON.stringify(order[k]));
    });
    originalOrderRef.current=synced;
    setLastSavedAt(Date.now());
    setSavedNowKey(k=>k+1);
    if(!silent)showToast("Gespeichert");
  };

  // Relative Zeit fuer Save-Indicator: "vor 5s" / "vor 1m" / "vor 3min"
  const[savedAgo,setSavedAgo]=useState("");
  useEffect(()=>{
    if(!lastSavedAt){setSavedAgo("");return;}
    const update=()=>{
      const diff=Math.floor((Date.now()-lastSavedAt)/1000);
      if(diff<3)setSavedAgo("Eben gespeichert");
      else if(diff<60)setSavedAgo(`Gespeichert vor ${diff}s`);
      else if(diff<3600)setSavedAgo(`Gespeichert vor ${Math.floor(diff/60)}min`);
      else setSavedAgo("Gespeichert");
    };
    update();
    const i=setInterval(update,5000);
    return ()=>clearInterval(i);
  },[lastSavedAt,savedNowKey]);

  // Auto-Save: bei Aenderungen debounced (1.5s Inaktivitaet) speichern
  // Ohne Toast (silent=true), damit kein Gespam. Manueller Save-Button bleibt erhalten.
  // Nutzt isAutoSaveDirty — Impressum-Felder triggern kein Auto-Save (rechtlich sensibel).
  useEffect(()=>{
    if(!order||!originalOrderRef.current||!supabase)return;
    if(!isAutoSaveDirty||saving)return;
    const t=setTimeout(()=>{saveAll(true);},1500);
    return ()=>clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[order,isAutoSaveDirty,saving,supabase]);

  const discardChanges=()=>{
    if(originalOrderRef.current)setOrder(JSON.parse(JSON.stringify(originalOrderRef.current)));
  };

  // Felder pro Portal-Section — fuer selektives Undo ("Diese Seite zuruecksetzen")
  const PAGE_FIELDS={
    hero:["firmenname","kurzbeschreibung","foto_credit","hero_headline","varianten_cache"],
    grunddaten:["firmenname","kurzbeschreibung","einsatzgebiet"],
    leistungen:["leistungen","extra_leistung","leistungen_beschreibungen","leistungen_preise","leistungen_fotos","cta_headline","cta_text"],
    ueberuns:["text_ueber_uns","text_vorteile","team_members","gut_zu_wissen","ablauf_schritte","bewertungen"],
    kontakt:["adresse","plz","ort","telefon","whatsapp","buchungslink","oeffnungszeiten","oeffnungszeiten_custom","kontakt_formular","terminvereinbarung","erstgespraech_gratis","online_beratung","hausbesuche","barrierefrei","parkplaetze","kartenzahlung","gastgarten","takeaway","lieferservice"],
    design:["stil","custom_color","custom_accent","custom_bg","custom_text","custom_text_muted","custom_sep","custom_font","custom_radius","varianten_cache"],
    faq:["faq"],
    fakten:["fakten"],
    partner:["partner"],
    social:["facebook","instagram","linkedin","tiktok"],
    branchenfeatures:["notdienst","meisterbetrieb","kostenvoranschlag","zertifiziert","kassenvertrag","spezialisierung","berufsregister_nr","foerderungsberatung","ratenzahlung","gutscheine"],
    impressum:["unternehmensform","vorname","nachname","firmenbuchnummer","firmenbuchgericht","uid_nummer","gisazahl","zvr_zahl","vertretungsorgane","geschaeftsfuehrer","vorstand","aufsichtsrat","gesellschafter","unternehmensgegenstand","liquidation","kammer_berufsrecht","aufsichtsbehoerde"],
    aktuelles:["announcements"],
  };
  // true wenn sich in der aktuellen Section etwas geaendert hat
  const sectionIsDirty=(()=>{
    if(!order||!originalOrderRef.current)return false;
    const fields=PAGE_FIELDS[page];
    if(!fields)return false;
    return fields.some(f=>JSON.stringify(order[f])!==JSON.stringify(originalOrderRef.current[f]));
  })();
  // Nur die Felder der aktuellen Section zuruecksetzen
  const revertSection=()=>{
    if(!originalOrderRef.current)return;
    const fields=PAGE_FIELDS[page];
    if(!fields)return;
    setOrder(o=>{
      const no={...o};
      fields.forEach(f=>{no[f]=originalOrderRef.current[f];});
      return no;
    });
    showToast("Seite zurückgesetzt");
  };

  const uploadBlob=async(key,blob)=>{
    if(!session?.user?.id){showToast("Nicht eingeloggt — bitte neu anmelden");return;}
    if(!supabase){showToast("Verbindungsfehler");return;}
    // Upload-Validierung: Max-Size + Whitelist
    const MAX_SIZE=10*1024*1024; // 10 MB
    const ALLOWED=["image/png","image/jpeg","image/jpg","image/webp","image/svg+xml","image/gif","application/pdf"];
    if(blob?.size>MAX_SIZE){showToast("Datei zu gross (max. 10 MB)");return;}
    if(blob?.type&&!ALLOWED.includes(blob.type)){showToast("Format nicht unterstützt (nur JPG/PNG/WebP/SVG/PDF)");return;}
    setUploading(u=>({...u,[key]:true}));
    try{
      // Format aus Blob-Type ableiten — Logos bleiben PNG/SVG/WebP (Transparenz!)
      // statt zwangsweise zu JPEG mit weissem Hintergrund konvertiert zu werden.
      const blobType=blob?.type||"image/jpeg";
      const extMap={"image/png":"png","image/svg+xml":"svg","image/webp":"webp","image/gif":"gif","application/pdf":"pdf"};
      const ext=extMap[blobType]||"jpg";
      const contentType=blobType||"image/jpeg";
      const path=`${session.user.id}/${key}.${ext}`;
      const{error}=await supabase.storage.from("customer-assets").upload(path,blob,{upsert:true,contentType});
      if(error){showToast("Upload fehlgeschlagen: "+error.message);setUploading(u=>({...u,[key]:false}));return;}
      const{data}=supabase.storage.from("customer-assets").getPublicUrl(path);
      // Cache-Buster muss auch in der DB-URL landen — sonst zeigt die Kunden-Website
      // das gecachte alte Bild, weil Supabase Storage bei upsert:true denselben Pfad
      // behaelt und die Public-URL daher identisch bleibt.
      const bustedUrl=data.publicUrl+"?v="+Date.now();
      setAssetUrls(u=>({...u,[key]:bustedUrl}));
      const colMap={logo:"url_logo",hero:"url_hero",foto1:"url_foto1",foto2:"url_foto2",foto3:"url_foto3",foto4:"url_foto4",foto5:"url_foto5",leist1:"url_leist1",leist2:"url_leist2",leist3:"url_leist3",leist4:"url_leist4",about1:"url_about1",about2:"url_about2",about3:"url_about3",about4:"url_about4",about5:"url_about5",about6:"url_about6",about7:"url_about7",about8:"url_about8",preisliste:"url_preisliste"};
      const col=colMap[key];
      // Partner-Logo: key = "ref_0", "ref_1" etc. → URL in partner Array + DB speichern
      if(key.startsWith("ref_")){
        const idx=parseInt(key.split("_")[1]);
        const arr=[...(order.partner||[])];
        if(arr[idx]){
          arr[idx]={...arr[idx],url_logo:bustedUrl};
          if(order?.id){
            const{error:upErr}=await supabase.from("orders").update({partner:arr}).eq("id",order.id);
            if(upErr){
              showToast("Logo gespeichert, aber DB-Update fehlgeschlagen");
              try{await supabase.from("error_logs").insert({source:"partner_logo_update_error",message:upErr.message});}catch(_){}
            }else{
              // Local State + originalOrderRef syncen damit kein false "Ungespeicherte Aenderungen"
              setOrder(o=>{const no={...o,partner:arr};if(originalOrderRef.current)originalOrderRef.current={...originalOrderRef.current,partner:arr};return no;});
            }
          }else{
            upOrder("partner")(arr);
          }
        }
      } else if(col&&order?.id){
        const updatePayload={[col]:bustedUrl};
        if(key==="hero"&&order.hero_is_placeholder) updatePayload.hero_is_placeholder=false;
        const{error:upErr}=await supabase.from("orders").update(updatePayload).eq("id",order.id);
        if(upErr){
          showToast("Bild gespeichert, aber URL-Update fehlgeschlagen");
          try{await supabase.from("error_logs").insert({source:"url_update_error",message:upErr.message});}catch(_){}
        }else{
          // Local order state + originalOrderRef mit neuer URL syncen
          setOrder(o=>{
            const no={...o,[col]:bustedUrl};
            if(key==="hero"&&o.hero_is_placeholder)no.hero_is_placeholder=false;
            if(originalOrderRef.current){
              originalOrderRef.current={...originalOrderRef.current,[col]:bustedUrl};
              if(key==="hero"&&originalOrderRef.current.hero_is_placeholder)originalOrderRef.current.hero_is_placeholder=false;
            }
            return no;
          });
        }
      }
      showToast(key==="logo"?"Logo hochgeladen!":key==="preisliste"?"Preisliste hochgeladen!":"Foto hochgeladen!");
      // Logo-Kontrast-Check: wenn Logo-Luminanz zu nah am Nav-Hintergrund liegt,
      // sichtbarkeitswarnung setzen. Nav nutzt order.custom_color (primary).
      if(key==="logo"){
        try{
          const logoL=await analyzeImageLuminance(bustedUrl);
          if(logoL!==null){
            const navHex=order?.custom_color||STYLES_MAP[order?.stil||"klassisch"]?.primary||"#0f1a2e";
            const navL=hexLuminance(navHex);
            // WCAG non-text contrast ratio
            const ratio=(Math.max(logoL,navL)+0.05)/(Math.min(logoL,navL)+0.05);
            if(ratio<2.5){
              setLogoContrastIssue(logoL<0.35?"too-dark":"too-light");
            }else{
              setLogoContrastIssue(null);
            }
          }
        }catch(_){setLogoContrastIssue(null);}
      }
    }catch(e){showToast("Fehler: "+e.message);}
    setUploading(u=>({...u,[key]:false}));
  };

  const upload=(key,file)=>{
    if(!file)return;
    // Logos + Preisliste + nicht-Bilder: direkt durchreichen (Logo behaelt PNG-
    // Transparenz und Original-Groesse — Crop zerstoert beides und erzwingt JPEG).
    // Partner-Logos (ref_*) auch, aus demselben Grund.
    const isLogo=key==="logo"||key.startsWith("ref_");
    if(key==="preisliste"||isLogo||!file.type.startsWith("image/")){
      uploadBlob(key,file);return;
    }
    // Andere Bilder: Crop-Dialog öffnen
    setCropData({key,file});
  };

  // Batch-Upload: verteilt mehrere Dateien auf freie Slots, ohne Crop-Dialog.
  const uploadBatch=async(files,candidateKeys)=>{
    if(!files||!files.length)return;
    const imageFiles=Array.from(files).filter(f=>f.type.startsWith("image/"));
    if(!imageFiles.length){showToast("Nur Bilddateien moeglich");return;}
    const freeKeys=candidateKeys.filter(k=>!assetUrls[k]);
    if(!freeKeys.length){showToast("Alle Slots belegt — bitte erst einen freigeben");return;}
    const pairs=imageFiles.slice(0,freeKeys.length).map((f,i)=>[freeKeys[i],f]);
    const skipped=imageFiles.length-pairs.length;
    for(const [k,f] of pairs){
      await uploadBlob(k,f);
    }
    if(skipped>0)showToast(`${pairs.length} hochgeladen, ${skipped} uebersprungen (keine freien Slots)`);
  };

  const deleteAsset=async(key)=>{
    if(!session?.user?.id||!supabase||!order?.id){showToast("Fehler — bitte neu anmelden");return;}
    setDeleting(d=>({...d,[key]:true}));
    try{
      const exts=["jpg","jpeg","png","webp","gif"];
      for(const ext of exts){
        await supabase.storage.from("customer-assets").remove([`${session.user.id}/${key}.${ext}`]).catch(()=>{});
      }
      const colMap={logo:"url_logo",hero:"url_hero",foto1:"url_foto1",foto2:"url_foto2",foto3:"url_foto3",foto4:"url_foto4",foto5:"url_foto5",leist1:"url_leist1",leist2:"url_leist2",leist3:"url_leist3",leist4:"url_leist4",about1:"url_about1",about2:"url_about2",about3:"url_about3",about4:"url_about4",about5:"url_about5",about6:"url_about6",about7:"url_about7",about8:"url_about8",preisliste:"url_preisliste"};
      const col=colMap[key];
      if(col){
        const delPayload={[col]:null};
        if(key==="hero") delPayload.hero_is_placeholder=false;
        const{error}=await supabase.from("orders").update(delPayload).eq("id",order.id);
        if(error)try{await supabase.from("error_logs").insert({source:"delete_url_error",message:error.message});}catch(_){}
        if(key==="hero") setOrder(o=>({...o,hero_is_placeholder:false}));
      }
      setAssetUrls(u=>{const n={...u};delete n[key];return n;});
      showToast("Bild gelöscht");
    }catch(e){showToast("Fehler beim Löschen: "+e.message);}
    setDeleting(d=>({...d,[key]:false}));
  };

  const subscribe=async(plan)=>{
    if(!order||!supabase)return;
    setSubscribing(true);
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

  const loadInvoices=async()=>{
    if(invoices!==null||!session?.user?.email)return;
    setInvoices("loading");
    const r=await fetch(`/api/get-invoices?email=${encodeURIComponent(session.user.email)}`);
    const j=await r.json();
    setInvoices(j.charges||[]);
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(()=>{if(page==="rechnungen")loadInvoices();},[page]);

  // Einmalig: CTA-Block mit branchenspezifischem Default befuellen, wenn Felder leer und noch nie angefasst
  useEffect(()=>{
    if(!order?.id||!order.branche||!supabase)return;
    const hasCta=order.cta_headline||order.cta_text;
    const ctaAiFlagged=(order.ai_generated||[]).includes("cta_block");
    if(hasCta||ctaAiFlagged)return;
    const def=getCtaDefault(order.branche);
    const newAi=[...(order.ai_generated||[]),"cta_block"];
    supabase.from("orders").update({cta_headline:def.h,cta_text:def.t,ai_generated:newAi}).eq("id",order.id).then(({error})=>{
      if(error)return;
      setOrder(o=>({...o,cta_headline:def.h,cta_text:def.t,ai_generated:newAi}));
      if(originalOrderRef.current)originalOrderRef.current={...originalOrderRef.current,cta_headline:def.h,cta_text:def.t,ai_generated:newAi};
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[order?.id]);

  const saveImpressum=async()=>{
    if(!order||!supabase)return;
    setSaving(true);
    await supabase.from("orders").update({
      unternehmensform:order.unternehmensform,uid_nummer:order.uid_nummer,
      firmenbuchnummer:order.firmenbuchnummer,firmenbuchgericht:order.firmenbuchgericht,
      gisazahl:order.gisazahl,geschaeftsfuehrer:order.geschaeftsfuehrer,
      vorstand:order.vorstand,aufsichtsrat:order.aufsichtsrat,
      zvr_zahl:order.zvr_zahl,vertretungsorgane:order.vertretungsorgane,
      gesellschafter:order.gesellschafter,vorname:order.vorname,nachname:order.nachname,
    }).eq("id",order.id);
    setSaving(false);
    originalOrderRef.current=JSON.parse(JSON.stringify(order));
    showToast("Impressum gespeichert");
  };

  const isAiGen=(field)=>Array.isArray(order?.ai_generated)&&(order.ai_generated.includes(field)||order.ai_generated.includes(field+"_poliert"));
  const SectionHeader=({label,desc,aiField,onRemove})=>(
    <div style={{marginBottom:desc?12:16,paddingBottom:desc?10:14,borderBottom:`1px solid ${T.bg3}`}}>
      {aiField&&isAiGen(aiField)&&<div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10,padding:"8px 12px",background:T.amberLight,borderRadius:T.rSm,border:`1px solid ${T.amberBorder}`}}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.amberText} strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
        <span style={{flex:1,fontSize:".78rem",fontWeight:600,color:T.amberText}}>Automatisch erstellt — bitte prüfen und bei Bedarf anpassen</span>
        {onRemove&&<button onClick={onRemove} style={{padding:"3px 10px",border:"1px solid #fca5a5",borderRadius:4,background:"#fff",color:"#ef4444",cursor:"pointer",fontSize:".72rem",fontWeight:600,fontFamily:T.font}}>Entfernen</button>}
      </div>}
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <div style={{fontSize:".92rem",fontWeight:700,color:T.dark}}>{label}</div>
      </div>
      {desc&&<div style={{fontSize:".85rem",color:T.textMuted,marginTop:7,lineHeight:1.55}}>{desc}</div>}
    </div>
  );

  // hasContent: true wenn Section genug Daten fuer Render hat (optional).
  // Bei fehlenden Daten zeigt der Toggle eine Warnung, selbst wenn "sichtbar" geschaltet.
  const VisibilityToggle=({field,labelOn,labelOff,hasContent,contentHint})=>{
    const visible=order?.sections_visible?.[field]!==false;
    // Wenn hasContent nicht uebergeben wird → kein Content-Check (z.B. cta_block ist immer renderbar)
    const noData=hasContent===false;
    const effectiveVisible=visible&&!noData;
    const bg=!visible?T.amberLight:noData?T.amberLight:T.bg;
    const border=!visible?T.amberBorder:noData?T.amberBorder:T.bg3;
    const color=!visible||noData?T.amberText:T.textSub;
    const subColor=!visible||noData?T.amberText:T.textMuted;
    let title,subtitle;
    if(!visible){title="Ausgeblendet";subtitle=labelOff;}
    else if(noData){title="Aktuell nicht sichtbar";subtitle=contentHint||"Noch keine Eintraege — sobald welche vorhanden sind, erscheint der Bereich.";}
    else {title="Wird auf der Website angezeigt";subtitle=labelOn;}
    return(
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,padding:"10px 14px",background:bg,border:`1.5px solid ${border}`,borderRadius:T.rSm,marginBottom:16}}>
      <div style={{fontSize:".82rem",color,lineHeight:1.4}}>
        <strong style={{fontWeight:700}}>{title}</strong>
        <span style={{marginLeft:8,color:subColor,fontSize:".78rem"}}>{subtitle}</span>
      </div>
      <button onClick={()=>{const sv={...(order?.sections_visible||{}),[field]:!visible};upOrder("sections_visible")(sv);}} aria-label={visible?"Bereich ausblenden":"Bereich anzeigen"} style={{width:42,height:24,borderRadius:12,background:effectiveVisible?T.accent:T.bg3,border:"none",cursor:"pointer",position:"relative",flexShrink:0,padding:0,opacity:noData?.6:1}}>
        <div style={{width:20,height:20,borderRadius:"50%",background:"#fff",position:"absolute",top:2,left:visible?20:2,transition:"left .2s",boxShadow:"0 1px 4px rgba(0,0,0,.15)"}}/>
      </button>
    </div>
  );};

  const InfoRow=({label,value})=>(
    <div className="pt-info-row" style={{display:"grid",gridTemplateColumns:"160px 1fr",padding:"11px 0",borderBottom:`1px solid ${T.bg3}`}}>
      <span style={{fontSize:".88rem",color:T.textMuted,fontWeight:500}}>{label}</span>
      <span style={{fontSize:".92rem",color:value?T.dark:T.textMuted,fontWeight:value?500:400}}>{value||"—"}</span>
    </div>
  );
  const ASSETS=[
    {key:"logo",label:"Logo",desc:"PNG mit transparentem Hintergrund empfohlen. Wird in der Navigation mit 64px Hoehe angezeigt."},
    {key:"foto1",label:"Foto 1",desc:""},
    {key:"foto2",label:"Foto 2",desc:""},
    {key:"foto3",label:"Foto 3",desc:""},
    {key:"foto4",label:"Foto 4",desc:""},
    {key:"foto5",label:"Foto 5",desc:""},
  ];

  const userInitials=(session?.user?.email||"??").slice(0,2).toUpperCase();
  const comp=order?{
    hero:!!(assetUrls.logo||assetUrls.hero),
    grunddaten:!!(order.firmenname&&order.kurzbeschreibung),
    branchenfeatures:!!(order.notdienst||order.meisterbetrieb||order.kostenvoranschlag||order.zertifiziert||order.kassenvertrag||order.spezialisierung),
    leistungen:!!(order.leistungen?.length>0),
    ueberuns:!!(order.text_ueber_uns),
    kontakt:!!(order.adresse&&order.telefon),
    social:!!(order.facebook||order.instagram||order.linkedin||order.tiktok),
    faq:!!order.faq?.some(f=>f.frage&&f.antwort),
    fakten:(order.fakten||[]).filter(f=>f&&f.zahl).length>=2,
    partner:!!order.partner?.some(p=>p&&p.name),
    design:true,
    medien:!!(assetUrls.logo||assetUrls.hero),
    impressum:(()=>{
      if(!order.unternehmensform)return false;
      const uf=order.unternehmensform;
      // Verein: ZVR-Zahl ist Pflicht
      if(uf==="verein")return !!(order.zvr_zahl&&order.vertretungsorgane);
      // Firmenbuch-Formen: Firmenbuchnummer Pflicht
      if(["eu","gmbh","og","kg","ag"].includes(uf))return !!(order.firmenbuchnummer&&order.firmenbuchgericht);
      // Einzelperson/andere: mindestens Vorname+Nachname
      return !!(order.vorname&&order.nachname);
    })(),
  }:{};
  // Wizard: Labels passen den Daten-Stand UND den Sichtbarkeits-Stand der Kunden-
  // Website wider. Default-sichtbare Bereiche (FAQ, Fakten, Partner, Galerie)
  // werden per sv.X === false explizit ausgeblendet.
  const aiTag="✨ ";
  const sv=order?.sections_visible||{};
  const isHidden=(key)=>sv[key]===false;
  // Section-Step Helper: zeigt abhaengig von Daten/Sichtbarkeit die richtige
  // Aktion. Gibt null zurueck wenn Section hidden und keine Daten da sind
  // (dann ist der Punkt irrelevant).
  const sectionStep=({visKey,page,hasData,labelDone,labelAdd,descDone,descAdd,isAi})=>{
    const hidden=isHidden(visKey);
    if(hasData&&hidden)return{
      label:labelDone+" — ausgeblendet",
      desc:`Sie haben Inhalte eingetragen, aber der Bereich wird auf der Website nicht angezeigt. Auf der Design-Seite wieder aktivieren.`,
      done:false,page:"design",warn:true};
    if(hasData)return{
      label:isAi?aiTag+labelDone:labelDone,
      desc:descDone,done:true,page};
    if(hidden)return null;
    return{label:labelAdd,desc:descAdd,done:false,page};
  };
  const wizardSteps=order?[
    {label:assetUrls.logo?"Logo prüfen":"Logo hochladen",
     desc:assetUrls.logo?"Ihr Logo wurde übernommen. Prüfen Sie ob es korrekt angezeigt wird.":"Ihr Firmenlogo erscheint oben links auf der Website. Idealerweise als PNG mit transparentem Hintergrund.",
     done:!!assetUrls.logo,page:"hero"},
    {label:order?.hero_is_placeholder?"Eigenes Titelbild hochladen":assetUrls.hero?"Titelbild prüfen":"Titelbild hochladen",
     desc:order?.hero_is_placeholder?"Wir haben ein Beispielfoto eingesetzt. Laden Sie ein eigenes Bild hoch für einen persönlicheren Auftritt.":assetUrls.hero?"Ihr Titelbild wurde übernommen. Prüfen Sie ob es gut aussieht.":"Das große Bild im Kopfbereich Ihrer Website. Am besten ein Foto von Ihrem Betrieb oder Ihrer Arbeit.",
     done:!!(assetUrls.hero&&!order?.hero_is_placeholder),page:"hero"},
    {label:"Firmenname & Beschreibung prüfen",
     desc:"Diese Texte stehen ganz oben auf Ihrer Website. Bitte prüfen und bei Bedarf anpassen.",
     done:!!(order.firmenname&&order.kurzbeschreibung),page:"hero"},
    {label:(order.notdienst||order.meisterbetrieb||order.kostenvoranschlag||order.zertifiziert||order.kassenvertrag||order.spezialisierung)?"Besonderheiten prüfen":"Besonderheiten angeben",
     desc:(order.notdienst||order.meisterbetrieb)?"Ihre Merkmale wurden übernommen. Prüfen Sie ob alles stimmt.":"Sind Sie Meisterbetrieb? Bieten Sie Notdienst oder kostenlosen Kostenvoranschlag? Diese Angaben erscheinen als Badges.",
     done:!!(order.notdienst||order.meisterbetrieb||order.kostenvoranschlag||order.zertifiziert||order.kassenvertrag||order.spezialisierung),page:"branchenfeatures"},
    {label:isAiGen("leistungen_beschreibungen")?aiTag+"Leistungstexte prüfen":"Leistungen prüfen",
     desc:isAiGen("leistungen_beschreibungen")?"Wir haben Beschreibungen für Ihre Leistungen erstellt. Bitte lesen Sie diese durch und passen Sie sie an. Sie können auch Preise und Fotos ergänzen.":"Ihre Leistungen werden als Karten auf der Website angezeigt. Prüfen Sie die Texte und ergänzen Sie Preise oder Fotos.",
     done:!!(order.leistungen?.length>0),page:"leistungen"},
    {label:isAiGen("text_ueber_uns")?aiTag+"Über-uns Text prüfen":"Über-uns Text prüfen",
     desc:isAiGen("text_ueber_uns")?"Der Vorstellungstext wurde automatisch erstellt. Lesen Sie ihn durch und machen Sie ihn persönlicher. Hier können Sie auch Ihr Team und Fotos hinzufügen.":"Über-uns Text und Vorteile prüfen. Hier können Sie auch Ihr Team und Fotos hinzufügen.",
     done:!!order.text_ueber_uns,page:"ueberuns"},
    {label:"Kontaktdaten prüfen",
     desc:"Adresse und Telefon erscheinen im Kontaktbereich und in Google Maps.",
     done:!!(order.adresse&&order.telefon),page:"kontakt"},
    {label:order.oeffnungszeiten||order.oeffnungszeiten_custom?"Öffnungszeiten prüfen":"Öffnungszeiten angeben",
     desc:"Wann sind Sie erreichbar? Erscheinen prominent im Kontaktbereich — entscheidend für Anrufe.",
     done:!!(order.oeffnungszeiten||order.oeffnungszeiten_custom),page:"kontakt"},
  ]:[];
  const wizardOptional=order?[
    {label:"Design anpassen",
     desc:"Stil, Farben und Schriftart nicht zufrieden? Hier können Sie alles ändern — sofort live.",
     done:!!(order.custom_color||order.custom_font||order.custom_accent),page:"design"},
    {label:(assetUrls.foto2||assetUrls.foto3)?"Betriebsfotos prüfen":"Betriebsfotos hochladen",
     desc:(assetUrls.foto2||assetUrls.foto3)?"Ihre Fotos sind auf der Website sichtbar.":"Professionelle Fotos sind der größte Hebel für mehr Anfragen.",
     done:!!(assetUrls.foto2||assetUrls.foto3),page:"ueberuns"},
    {label:order.team_members?.some(m=>m.name)?"Team prüfen":"Team vorstellen",
     desc:order.team_members?.some(m=>m.name)?"Teammitglieder wurden übernommen. Prüfen Sie Namen und Rollen.":"Zeigen Sie Ihr Team — das schafft Vertrauen.",
     done:!!(order.team_members?.some(m=>m.name)),page:"ueberuns"},
    {label:order.bewertungen?.some(b=>b.text)?(isAiGen("bewertungen")?aiTag+"Bewertungen prüfen":"Bewertungen prüfen"):"Kundenbewertungen hinzufügen",
     desc:order.bewertungen?.some(b=>b.text)?"Prüfen Sie die übernommenen Bewertungen.":"Echte Kundenstimmen steigern das Vertrauen.",
     done:!!(order.bewertungen?.some(b=>b.text)),page:"ueberuns"},
    (()=>{
      // FAQ braucht Frage UND Antwort — sonst auf Website nicht sichtbar
      const complete=!!order.faq?.some(f=>f.frage&&f.antwort);
      const incomplete=!!order.faq?.some(f=>(f.frage&&!f.antwort)||(!f.frage&&f.antwort));
      if(incomplete&&!complete)return{
        label:"FAQ — Antwort fehlt",
        desc:"Sie haben eine Frage ohne Antwort (oder umgekehrt). FAQs werden nur angezeigt wenn beides ausgefuellt ist.",
        done:false,page:"faq",warn:true};
      return sectionStep({visKey:"faq",page:"faq",
        hasData:complete,isAi:isAiGen("faq"),
        labelDone:"FAQ prüfen",labelAdd:"FAQ hinzufügen",
        descDone:incomplete?"Einige FAQs sind unvollstaendig und werden nicht angezeigt.":"Prüfen Sie die häufig gestellten Fragen.",
        descAdd:"Beantworten Sie häufige Kundenfragen direkt auf Ihrer Website."});
    })(),
    (()=>{
      // Zahlen & Fakten: Website zeigt erst ab 2 Eintraegen mit Zahl
      const validCount=(order.fakten||[]).filter(f=>f&&f.zahl).length;
      if(validCount===1){return{
        label:"Zahlen & Fakten — noch 1",
        desc:"Erst ab 2 Eintraegen wird die Section auf der Website gezeigt. Bitte einen weiteren hinzufuegen.",
        done:false,page:"fakten",warn:true};}
      return sectionStep({visKey:"fakten",page:"fakten",
        hasData:validCount>=2,
        labelDone:"Zahlen & Fakten prüfen",labelAdd:"Zahlen & Fakten hinzufügen",
        descDone:"Prüfen Sie die übernommenen Zahlen.",
        descAdd:`z.B. „15+ Jahre Erfahrung" – beeindruckt Besucher.`});
    })(),
    (()=>{
      const withLogo=!!order.partner?.some(p=>p.url_logo);
      const withNameNoLogo=!!order.partner?.some(p=>p.name&&!p.url_logo);
      if(withNameNoLogo&&!withLogo){return{
        label:"Referenzen — Logos fehlen",
        desc:"Sie haben Eintraege ohne Logo. Ohne Logo werden diese auf der Website nicht angezeigt.",
        done:false,page:"partner",warn:true};}
      return sectionStep({visKey:"partner",page:"partner",
        hasData:withLogo,
        labelDone:"Referenzen prüfen",labelAdd:"Referenzen hinzufügen",
        descDone:withNameNoLogo?"Einige Eintraege haben noch kein Logo und werden nicht angezeigt.":"Prüfen Sie Kunden, Partner und Zertifikate.",
        descAdd:"Kunden, Partner oder Zertifikate — mit Logo zeigen Sie, wer Ihnen vertraut."});
    })(),
    {label:(order.facebook||order.instagram||order.linkedin||order.tiktok)?"Social Media prüfen":"Social Media Profile angeben",
     desc:"Ihre Profile erscheinen als Icons auf der Website.",
     done:!!(order.facebook||order.instagram||order.linkedin||order.tiktok),page:"social"},
    {label:"Preise zu Leistungen ergänzen",
     desc:"Preisangaben helfen Kunden bei der Entscheidung.",
     done:!!(order.leistungen_preise&&Object.values(order.leistungen_preise||{}).some(v=>v)),page:"leistungen"},
    {label:"WhatsApp-Button aktivieren",
     desc:"Kunden können Sie direkt über WhatsApp kontaktieren.",
     done:!!order.whatsapp,page:"kontakt"},
  ].filter(Boolean):[];
  const wizardDoneCount=wizardSteps.filter(s=>s.done).length;
  const wizardTotal=wizardSteps.length;
  const wizardAllDone=wizardDoneCount>=wizardTotal&&wizardOptional.every(s=>s.done);
  const wizardCurrentIdx=wizardSteps.findIndex(s=>!s.done);
  // ── Varianten-Auswahl Komponente ──
  // Varianten-Hint: zeigt die automatisch berechnete Variante an
  const VariantenHint=({label,value})=>value?<div style={{display:"inline-flex",alignItems:"center",gap:6,padding:"5px 12px",background:T.bg2,borderRadius:T.rSm,fontSize:".72rem",color:T.textMuted,marginBottom:16}}>
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
    <span>{label}: <strong style={{color:T.dark,fontWeight:600}}>{value}</strong></span>
  </div>:null;


  const pageMeta={
    overview:{title:"Übersicht",sub:"Willkommen zurück"},
    hero:{title:"Titelbild & Kopfbereich",sub:"Logo, Firmenname, Kurzbeschreibung und Titelbild — der erste Eindruck Ihrer Website"},
    grunddaten:{title:"Grunddaten",sub:"Firmenname und Einsatzgebiet – erscheinen im Titelbereich und in der Google-Suche"},
    leistungen:{title:"Leistungen",sub:"Diese Leistungen erscheinen als Karten auf Ihrer Website – mit Beschreibung und Preis"},
    kontakt:{title:"Kontakt & Öffnungszeiten",sub:"Adresse, Telefon und Öffnungszeiten erscheinen im Kontaktbereich und in Google Maps"},
    ueberuns:{title:"Über uns",sub:"Erscheint im mittleren Bereich – Ihre Vorstellung, Vorteile, Team und Ablauf"},
    social:{title:"Social Media",sub:"Ihre Profile erscheinen als Icons im Footer Ihrer Website"},
    design:{title:"Design & Stil",sub:"Das visuelle Erscheinungsbild Ihrer Website – Farben und Typografie"},
    faq:{title:"Häufige Fragen",sub:"Fragen und Antworten, die auf Ihrer Website als aufklappbarer FAQ-Bereich erscheinen"},
    fakten:{title:"Zahlen",sub:"Erscheinen als Counter-Zeile auf der Website – z.B. Jahre Erfahrung oder Kundenzahl"},
    partner:{title:"Vertrauen & Referenzen",sub:"Erscheinen als Logo-Reihe im unteren Drittel – Kunden, Partner oder Zertifikate"},
    branchenfeatures:{title:"Besonderheiten",sub:"Was zeichnet Sie aus? Erscheinen als kleine Auszeichnungen (Badges) direkt unter dem Titelbild."},
    impressum:{title:"Unternehmen & Impressum",sub:"Rechtlich vorgeschriebene Pflichtangaben – direkt bearbeitbar, Änderungen erfordern Ihre Bestätigung"},
    aktuelles:{title:"Aktuelles",sub:"Kurzfristige Meldungen erscheinen als Banner ganz oben auf Ihrer Website"},
    medien:{title:"Fotos",sub:"Professionelle Fotos sind der größte Hebel für Anfragen – ideal mindestens 1 Titelbild"},
    teilen:{title:"Teilen & QR-Code",sub:"QR-Code, Visitenkarte und Firmen-Flyer für Ihre Website"},
    seo:{title:"SEO, Google & Domain",sub:"Suchmaschinenoptimierung und eigene Domain für Ihre Website"},
    rechnungen:{title:"Rechnungen",sub:"Ihre Zahlungsübersicht und Abonnement-Verwaltung"},
    account:{title:"Account",sub:"E-Mail-Adresse und Passwort Ihres Kundenkontos"},
    support:{title:"Support",sub:"Wir sind für Sie da – Antwort in der Regel innerhalb von 24 Stunden"},
  };
  const pm=pageMeta[page]||{title:page};
  const pCss=`
.pt-layout{display:flex;height:100vh;height:100dvh;overflow:hidden;font-family:'DM Sans',system-ui,sans-serif}
.pt-sb{width:236px;background:#111111;display:flex;flex-direction:column;flex-shrink:0;overflow:hidden}
.pt-sb-top{padding:22px 18px 18px;border-bottom:1px solid rgba(255,255,255,.07)}
.pt-sb-brand{margin-bottom:18px}
.pt-sb-logo{height:24px;filter:brightness(0) invert(1);opacity:.88;display:block}
.pt-sb-site{display:flex;align-items:center;gap:9px;padding:9px 12px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);border-radius:8px}
.pt-sb-dot{width:7px;height:7px;border-radius:50%;background:${T.greenBright};flex-shrink:0;animation:sb-blink 2.5s ease-in-out infinite}
@keyframes sb-blink{0%,100%{opacity:1}50%{opacity:.45}}
@keyframes sb-rotate{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
.pt-sb-url{font-size:.78rem;font-weight:600;color:rgba(255,255,255,.5);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pt-sb-nav{padding:12px 10px;flex:1;overflow-y:auto;scrollbar-width:none}
.pt-sb-nav::-webkit-scrollbar{display:none}
.pt-sb-grp{font-size:.64rem;font-weight:700;letter-spacing:.09em;text-transform:uppercase;color:rgba(255,255,255,.2);padding:14px 8px 5px}
.pt-ni{display:flex;align-items:center;gap:9px;padding:9px 10px;border-radius:8px;cursor:pointer;color:rgba(255,255,255,.45);font-size:.91rem;font-weight:500;transition:all .12s;user-select:none;background:transparent;border:none;width:100%;font-family:inherit;text-align:left}
.pt-ni:hover{background:rgba(255,255,255,.06);color:rgba(255,255,255,.8)}
.pt-ni.pactive{background:rgba(255,255,255,.09);color:#fff;font-weight:600}
.pt-ni svg{flex-shrink:0;opacity:.5;transition:opacity .12s}
.pt-ni.pactive svg,.pt-ni:hover svg{opacity:.85}
.pt-ni-ch{margin-left:auto;font-size:.7rem;color:rgba(255,255,255,.22);transition:transform .18s;line-height:1}
.pt-ni.popen .pt-ni-ch{transform:rotate(90deg)}
.pt-sub{overflow:hidden;max-height:0;transition:max-height .25s ease}
.pt-sub.popen{max-height:400px}
.pt-comp{width:6px;height:6px;border-radius:50%;background:${T.amber};margin-left:auto;flex-shrink:0}
.pt-done{width:6px;height:6px;border-radius:50%;background:${T.greenBright};margin-left:auto;flex-shrink:0;opacity:.7}
.pt-sb-foot{padding:12px 10px 14px;border-top:1px solid rgba(255,255,255,.07)}
.pt-sb-user{display:flex;align-items:center;gap:9px;padding:8px 10px;border-radius:8px;cursor:pointer;transition:background .12s;background:transparent;border:none;width:100%;font-family:inherit}
.pt-sb-user:hover{background:rgba(255,255,255,.05)}
.pt-sb-av{width:30px;height:30px;border-radius:50%;background:rgba(255,255,255,.1);border:1.5px solid rgba(255,255,255,.12);display:flex;align-items:center;justify-content:center;font-size:.68rem;font-weight:800;color:rgba(255,255,255,.72);flex-shrink:0}
.pt-sb-email{font-size:.8rem;color:rgba(255,255,255,.45);flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-align:left}
.pt-sb-out{color:rgba(255,255,255,.22);flex-shrink:0}
.pt-sb-user:hover .pt-sb-out{color:rgba(255,255,255,.55)}
.pt-main{flex:1;display:flex;flex-direction:column;overflow:hidden;background:#F5F5F2}
.pt-mh{padding:28px 36px 0;flex-shrink:0}
.pt-bc{font-size:.84rem;color:#505560;margin-bottom:7px;display:flex;align-items:center;gap:5px}
.pt-bc b{color:#4A4F5A}
.pt-mh-title{font-size:1.35rem;font-weight:800;color:#111111;letter-spacing:-.025em;line-height:1.2}
.pt-mh-sub{font-size:.9rem;color:#505560;margin-top:3px}
.pt-mh-line{height:1px;background:#E0E0DB;margin:20px 36px 0;flex-shrink:0}
.pt-mb{padding:20px 36px 32px;flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:16px}
.pt-hero-card{background:#fff;border-radius:12px;padding:24px 28px;border:1px solid #E0E0DB;box-shadow:0 1px 4px rgba(0,0,0,.06)}
.pt-hlive{display:inline-flex;align-items:center;gap:6px;font-size:.7rem;font-weight:700;color:${T.green};background:${T.greenLight};border:1px solid ${T.greenBorder};border-radius:100px;padding:4px 11px;margin-bottom:12px}
.pt-hlive-trial{color:#7c3aed;background:#f5f3ff;border-color:#ddd6fe}
.pt-hlive-trial .pt-hlive-dot{background:#7c3aed}
.pt-hlive-dot{width:5px;height:5px;border-radius:50%;background:${T.green};animation:sb-blink 2.5s ease-in-out infinite}
.pt-hurl{font-size:1.05rem;font-weight:700;color:#111111;letter-spacing:-.01em;margin-bottom:2px}
.pt-hurl em{color:#9ca3af;font-style:normal}
.pt-hhint{font-size:.85rem;color:#505560;margin-bottom:18px}
.pt-hbtns{display:flex;gap:8px;flex-wrap:wrap}
.pt-btn-w{display:inline-flex;align-items:center;gap:6px;padding:9px 17px;background:#111;color:#fff;border:none;border-radius:8px;font-size:.82rem;font-weight:700;cursor:pointer;font-family:inherit;transition:opacity .12s;text-decoration:none;letter-spacing:-.01em}
.pt-btn-w:hover{opacity:.88}
.pt-btn-gw{display:inline-flex;align-items:center;gap:6px;padding:9px 17px;background:#fff;color:#4A4F5A;border:1.5px solid #E0E0DB;border-radius:8px;font-size:.82rem;font-weight:600;cursor:pointer;font-family:inherit;transition:all .12s}
.pt-btn-gw:hover{background:#F5F5F2;border-color:#ccc}
.pt-ast{flex-shrink:0;border-left:1px solid #E0E0DB;background:#fff;display:flex;flex-direction:column;overflow:hidden;transition:width .25s ease}
.pt-ast.wiz-open{width:280px}
.pt-ast.wiz-closed{width:52px}
.pt-ast-h{padding:16px 16px 0;flex-shrink:0}
.pt-ast-title{font-size:.8rem;font-weight:800;color:#111;letter-spacing:-.01em;margin-bottom:2px}
.pt-ast-sub{font-size:.72rem;color:#6B7280;margin-bottom:14px}
.pt-ast-bar-wrap{height:6px;background:#E0E0DB;border-radius:100px;overflow:hidden;margin-bottom:4px}
.pt-ast-bar-fill{height:100%;border-radius:100px;background:${T.greenBright};transition:width .4s ease}
.pt-ast-pts{font-size:.68rem;font-weight:700;color:#16a34a;margin-bottom:14px}
.pt-ast-divider{height:1px;background:#E0E0DB;margin:0 0 8px}
.pt-ast-scroll{flex:1;overflow-y:auto;padding:8px 12px 20px;scrollbar-width:none;display:flex;flex-direction:column;gap:0}
.pt-ast-scroll::-webkit-scrollbar{display:none}
.pt-ast-item{display:flex;align-items:center;gap:10px;padding:9px 8px;border-radius:8px;cursor:pointer;border:none;background:transparent;width:100%;font-family:inherit;transition:background .1s;text-align:left}
.pt-ast-item:hover{background:#F5F5F2}
.pt-ast-ck{width:18px;height:18px;border-radius:50%;border:1.5px solid #D1D5DB;flex-shrink:0;display:flex;align-items:center;justify-content:center;transition:all .2s}
.pt-ast-ck.done{background:${T.greenBright};border-color:${T.greenBright}}
.pt-ast-ck.done svg{display:block}
.pt-ast-ck svg{display:none}
.pt-ast-ck.current{border-color:#111;background:#111;color:#fff}
.pt-ast-ck.current svg{display:none}
.pt-ast-label{font-size:.82rem;font-weight:500;color:#374151;flex:1;line-height:1.3}
.pt-ast-label.done{color:#9CA3AF;text-decoration:line-through}
.pt-ast-pts-badge{font-size:.68rem;font-weight:700;color:#6B7280;flex-shrink:0;padding:2px 6px;background:#F3F4F6;border-radius:100px}
.pt-ast-optional{font-size:.65rem;font-weight:600;color:#9CA3AF;flex-shrink:0;padding:2px 6px;background:#F9FAFB;border-radius:100px;border:1px solid #E5E7EB}
.pt-wiz-step{position:relative;padding-left:28px}
.pt-wiz-line{position:absolute;left:20px;top:28px;bottom:-4px;width:2px;border-radius:1px}
.pt-wiz-line.done{background:${T.greenBright}}
.pt-wiz-line.current{background:#111}
.pt-wiz-line.pending{background:#E0E0DB}
.pt-wiz-num{width:18px;height:18px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.65rem;font-weight:800;flex-shrink:0;line-height:1}
.pt-wiz-num.done{background:${T.greenBright};color:#fff}
.pt-wiz-num.current{background:#111;color:#fff}
.pt-wiz-num.pending{background:#F3F4F6;color:#9CA3AF;border:1.5px solid #E0E0DB}
.pt-wiz-curr{margin-top:6px;padding:10px 12px;background:#F9FAFB;border-radius:8px;border:1px solid #E0E0DB}
.pt-wiz-curr-desc{font-size:.78rem;color:#6B7280;line-height:1.5;margin-bottom:8px}
.pt-wiz-curr-btn{display:inline-flex;align-items:center;gap:4px;padding:6px 14px;background:#111;color:#fff;border:none;border-radius:6px;font-size:.78rem;font-weight:700;cursor:pointer;font-family:inherit}
.pt-wiz-curr-btn:hover{opacity:.85}
.pt-wiz-collapsed{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:8px;cursor:pointer;padding:8px 0}
.pt-wiz-collapsed:hover{background:#F5F5F2}
.pt-wiz-cbadge{writing-mode:vertical-rl;text-orientation:mixed;font-size:.72rem;font-weight:700;color:#6B7280;letter-spacing:.02em}
.pt-wiz-new{font-size:.6rem;font-weight:700;color:#7c3aed;background:#f5f3ff;padding:2px 6px;border-radius:4px;border:1px solid #ddd6fe;margin-left:auto;flex-shrink:0}
.pt-mob-topbar{display:none;align-items:center;gap:12px;padding:14px 16px;background:#111;flex-shrink:0;border-bottom:1px solid rgba(255,255,255,.06)}
.pt-mob-topbar img{height:22px;filter:brightness(0) invert(1);opacity:.9}
.pt-mob-hamburger{background:none;border:none;cursor:pointer;padding:8px;display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,.8);border-radius:8px;min-width:44px;min-height:44px;margin:-4px;transition:background .12s}
.pt-mob-hamburger:active{background:rgba(255,255,255,.1)}
.pt-mob-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:90}
.pt-mob-overlay.open{display:block}

/* Floating Wizard-Pill + Bottom-Sheet (Tablet & Mobile) */
.pt-wiz-pill{display:none;position:fixed;right:16px;bottom:16px;z-index:95;background:#111;color:#fff;border:none;border-radius:100px;padding:11px 18px;font-family:inherit;font-size:.82rem;font-weight:700;cursor:pointer;box-shadow:0 8px 28px rgba(0,0,0,.22);gap:10px;align-items:center;transition:transform .15s}
.pt-wiz-pill:active{transform:scale(.97)}
.pt-wiz-pill-ring{width:22px;height:22px;border-radius:50%;background:conic-gradient(${T.greenBright} calc(var(--p)*1%),rgba(255,255,255,.15) 0);display:flex;align-items:center;justify-content:center;flex-shrink:0}
.pt-wiz-pill-ring::after{content:"";width:16px;height:16px;border-radius:50%;background:#111}
.pt-wiz-pill-cnt{position:absolute;font-size:.6rem;font-weight:800;color:#fff;z-index:1}
.pt-wiz-sheet-bd{display:none;position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:98;opacity:0;transition:opacity .25s}
.pt-wiz-sheet-bd.open{display:block;opacity:1}
.pt-wiz-sheet{position:fixed;left:0;right:0;bottom:0;z-index:99;background:#fff;border-radius:18px 18px 0 0;max-height:78vh;display:flex;flex-direction:column;transform:translateY(100%);transition:transform .28s cubic-bezier(.22,1,.36,1);box-shadow:0 -12px 40px rgba(0,0,0,.18)}
.pt-wiz-sheet.open{transform:translateY(0)}
.pt-wiz-sheet-handle{padding:10px 0 6px;display:flex;justify-content:center;flex-shrink:0}
.pt-wiz-sheet-handle span{width:36px;height:4px;border-radius:100px;background:#E0E0DB}
.pt-wiz-sheet-h{padding:6px 20px 14px;border-bottom:1px solid #E0E0DB;flex-shrink:0}
.pt-wiz-sheet-h-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}
.pt-wiz-sheet-title{font-size:.92rem;font-weight:800;color:#111;letter-spacing:-.01em}
.pt-wiz-sheet-close{background:none;border:none;padding:6px;margin:-6px;cursor:pointer;color:#6B7280;border-radius:6px;display:flex;align-items:center;justify-content:center}
.pt-wiz-sheet-close:hover{background:#F5F5F2}
.pt-wiz-sheet-sub{font-size:.75rem;color:#6B7280;margin-bottom:8px}
.pt-wiz-sheet-bar{height:6px;background:#E0E0DB;border-radius:100px;overflow:hidden}
.pt-wiz-sheet-bar>div{height:100%;background:${T.greenBright};border-radius:100px;transition:width .4s ease}
.pt-wiz-sheet-body{flex:1;overflow-y:auto;padding:12px 16px 24px;-webkit-overflow-scrolling:touch}

@media(max-width:1023px){
  .pt-layout{flex-direction:column}
  .pt-sb{position:fixed;left:0;top:0;bottom:0;z-index:100;transform:translateX(-100%);transition:transform .25s ease;width:280px}
  .pt-sb.pt-sb-open{transform:translateX(0)}
  .pt-mob-topbar{display:flex}
  .pt-ast{display:none}
  .pt-wiz-pill{display:inline-flex}
  .pt-mh{padding:20px 20px 0}
  .pt-mh-line{margin:16px 20px 0}
  .pt-mb{padding:16px 20px 80px}
  .pt-hbtns{flex-wrap:wrap}
  /* Design-Bereich: 3-spaltige Grids auf 2, auf Mobile auf 1 */
  .pt-stil-grid,.pt-color-grid,.pt-font-grid{grid-template-columns:1fr 1fr !important}
}
@media(max-width:640px){
  .pt-stil-grid,.pt-color-grid,.pt-font-grid,.pt-addr-grid,.pt-logo-preview,.pt-impres-grid,.pt-fakten-grid,.pt-about-grid{grid-template-columns:1fr !important}
}

@media(max-width:767px){
  .pt-layout{flex-direction:column}
  .pt-sb{position:fixed;left:0;top:0;bottom:0;z-index:100;transform:translateX(-100%);transition:transform .25s ease}
  .pt-sb.pt-sb-open{transform:translateX(0)}
  .pt-mob-topbar{display:flex}
  .pt-mh{padding:16px 16px 0}
  .pt-mh-title{font-size:1.15rem}
  .pt-mh-sub{font-size:.82rem;margin-top:2px;line-height:1.5}
  .pt-bc{font-size:.76rem;margin-bottom:4px}
  .pt-mh-line{margin:12px 16px 0}
  .pt-mb{padding:14px 14px 40px;gap:12px;-webkit-overflow-scrolling:touch}
  .pt-mb>div{border-radius:10px!important;padding-left:16px!important;padding-right:16px!important}
  .pt-hero-card{padding:16px!important}
  .pt-hbtns{flex-direction:column}
  .pt-hbtns a,.pt-hbtns button{width:100%;justify-content:center}
  .pt-ast{display:none}
  .pt-hurl{font-size:.92rem!important;word-break:break-all}
  .pt-hhint{font-size:.78rem!important;line-height:1.5}
  .pt-trial-banner{flex-direction:column!important;padding:18px 16px!important;gap:12px!important;text-align:center}
  .pt-trial-banner button{width:100%}
  .pt-plan-modal>div{padding:24px 20px!important}
  .pt-support-info{flex-direction:column!important;gap:16px!important}
}
`;
  return(<div className="pt-layout"><style>{css+pCss}</style>
    {/* Mobile Topbar */}
    <div className="pt-mob-topbar">
      <button className="pt-mob-hamburger" onClick={()=>setPtSbOpen(true)} aria-label="Menü öffnen">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </button>
      <img src="/logo.png" alt="SiteReady" style={{flex:"0 0 auto"}} onError={e=>e.currentTarget.style.display="none"}/>
      <div style={{flex:1}}/>
      <div style={{display:"flex",alignItems:"center",gap:7,background:"rgba(255,255,255,.06)",padding:"5px 10px",borderRadius:100,border:"1px solid rgba(255,255,255,.08)"}}>
        <div style={{width:6,height:6,borderRadius:"50%",background:T.greenBright,animation:"sb-blink 2.5s ease-in-out infinite",flexShrink:0}}/>
        <span style={{fontSize:".72rem",fontWeight:600,color:"rgba(255,255,255,.5)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",maxWidth:150}}>{sub}.siteready.at</span>
      </div>
    </div>
    {/* Mobile Overlay */}
    <div className={`pt-mob-overlay${ptSbOpen?" open":""}`} onClick={()=>setPtSbOpen(false)}/>
    {/* Sidebar */}
    <aside className={`pt-sb${ptSbOpen?" pt-sb-open":""}`}>
      <div className="pt-sb-top">
        <div className="pt-sb-brand">
          <img className="pt-sb-logo" src="/logo.png" alt="SiteReady" onError={e=>e.currentTarget.style.display="none"}/>
        </div>
        <div className="pt-sb-site">
          <div className="pt-sb-dot"/>
          <div className="pt-sb-url">{sub}.siteready.at</div>
        </div>
      </div>
      <nav className="pt-sb-nav">
        <div className="pt-sb-grp">Meine Website</div>
        <button className={`pt-ni${page==="overview"?" pactive":""}`} onClick={()=>nav("overview")}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
          Übersicht
        </button>
        {[
          ["hero","Titelbild",`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`],
          ["branchenfeatures","Besonderheiten",`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>`],
          ["leistungen","Leistungen",`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>`],
          ["ueberuns","Über uns",`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`],
          ["kontakt","Kontakt",`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`],
          ["social","Social Media",`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>`],
          ["faq","Häufige Fragen",`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`],
          ["fakten","Zahlen",`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`],
          ["partner","Referenzen",`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`],
          ["design","Design",`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="13.5" cy="6.5" r="2.5"/><circle cx="19" cy="17" r="2.5"/><circle cx="6" cy="17" r="2.5"/><path d="M13.5 9C13.5 9 13 17 6 17"/><path d="M13.5 9C13.5 9 14 17 19 17"/></svg>`],
        ].map(([p,label,iconSvg])=>{
          const isRequired=["hero","branchenfeatures","leistungen","ueberuns","kontakt"].includes(p);
          const isDone=comp[p]===true;
          return(<button key={p} className={`pt-ni${page===p?" pactive":""}`} onClick={()=>nav(p)}>
            <span dangerouslySetInnerHTML={{__html:iconSvg}}/>
            {label}
            {isDone?<span className="pt-done"/>:isRequired?<span className="pt-comp" title="Pflicht – noch nicht ausgefüllt"/>:null}
          </button>);
        })}
        <div className="pt-sb-grp">Extras</div>
        <button className={`pt-ni${page==="aktuelles"?" pactive":""}`} onClick={()=>nav("aktuelles")}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>
          Aktuelles
        </button>
        <button className={`pt-ni${page==="teilen"?" pactive":""}`} onClick={()=>nav("teilen")}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
          Teilen & QR-Code
        </button>
        <button className={`pt-ni${page==="impressum"?" pactive":""}`} onClick={()=>nav("impressum")}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          Impressum
          {comp.impressum===true&&<span className="pt-done"/>}
        </button>
        <button className={`pt-ni${page==="seo"?" pactive":""}`} onClick={()=>nav("seo")}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          SEO, Google & Domain
        </button>
        <div className="pt-sb-grp">Konto</div>
        <button className={`pt-ni${page==="rechnungen"?" pactive":""}`} onClick={()=>nav("rechnungen")}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
          Rechnungen
        </button>
        <button className={`pt-ni${page==="account"?" pactive":""}`} onClick={()=>nav("account")}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          Account
        </button>
        <button className={`pt-ni${page==="support"?" pactive":""}`} onClick={()=>nav("support")}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          Support
        </button>
      </nav>
      <div className="pt-sb-foot">
        <button className="pt-sb-user" onClick={onLogout}>
          <div className="pt-sb-av">{userInitials}</div>
          <div className="pt-sb-email">{session?.user?.email}</div>
          <div className="pt-sb-out">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          </div>
        </button>
      </div>
    </aside>
    {/* Main */}
    <main className="pt-main">
      {!order&&orderLoadAttempts<5&&<div style={{padding:"40px 0"}}>
        {[1,2,3].map(i=><div key={i} style={{marginBottom:24}}>
          <div style={{height:14,width:i===1?"40%":"60%",background:T.bg3,borderRadius:6,marginBottom:12,animation:"pulse 1.5s ease-in-out infinite"}}/>
          <div style={{height:48,background:T.bg3,borderRadius:T.rSm,animation:"pulse 1.5s ease-in-out infinite"}}/>
        </div>)}
        <style>{`@keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}`}</style>
      </div>}
      {!order&&orderLoadAttempts>=5&&<div style={{padding:"40px 0",maxWidth:560}}>
        <div style={{background:"#fff",border:`1px solid ${T.bg3}`,borderRadius:T.r,padding:"28px 32px",boxShadow:T.sh1}}>
          <div style={{fontSize:"1.05rem",fontWeight:800,color:T.dark,marginBottom:8}}>Bestellung konnte nicht geladen werden</div>
          <div style={{fontSize:".85rem",color:T.textSub,lineHeight:1.6,marginBottom:16}}>
            Wir konnten keine Bestellung fuer <strong>{session?.user?.email}</strong> finden. Das kann passieren, wenn die Login-E-Mail von der Firmen-E-Mail im Fragebogen abweicht.
          </div>
          {orderLoadError?.message&&<div style={{fontSize:".75rem",color:T.textMuted,fontFamily:T.mono,background:T.bg,border:`1px solid ${T.bg3}`,borderRadius:T.rSm,padding:"10px 12px",marginBottom:16,wordBreak:"break-word"}}>
            {orderLoadError.message}{orderLoadError.code?` (${orderLoadError.code})`:""}
          </div>}
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            <button onClick={()=>window.location.reload()} style={{padding:"10px 20px",border:"none",borderRadius:T.rSm,background:T.dark,color:"#fff",fontWeight:700,fontSize:".85rem",fontFamily:T.font,cursor:"pointer"}}>Seite neu laden</button>
            <a href="mailto:support@siteready.at?subject=Portal%20zeigt%20keine%20Bestellung" style={{padding:"10px 20px",border:`1.5px solid ${T.bg3}`,borderRadius:T.rSm,background:"#fff",color:T.dark,fontWeight:700,fontSize:".85rem",fontFamily:T.font,cursor:"pointer",textDecoration:"none"}}>Support kontaktieren</a>
          </div>
        </div>
      </div>}
      {order&&order?.status!=="pending"&&<>
        <div className="pt-mh">
          {pm.bc&&<div className="pt-bc">{pm.bc} <b>›</b> {pm.title}</div>}
          <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:16,flexWrap:"wrap"}}>
            <div style={{flex:"1 1 auto",minWidth:0}}>
              <div className="pt-mh-title">{pm.title}</div>
              {pm.sub&&<div className="pt-mh-sub">{pm.sub}</div>}
            </div>
            <div style={{flex:"0 0 auto",display:"inline-flex",alignItems:"center",gap:8,marginTop:4,flexWrap:"wrap"}}>
              {/* Undo-Button pro Section */}
              {sectionIsDirty&&PAGE_FIELDS[page]&&<button onClick={()=>askDelete("Änderungen auf dieser Seite",revertSection)} title="Nur die Änderungen auf dieser Seite zurücksetzen" style={{display:"inline-flex",alignItems:"center",gap:6,padding:"6px 12px",background:"#fff",color:T.textSub,border:`1.5px solid ${T.bg3}`,borderRadius:100,cursor:"pointer",fontSize:".78rem",fontWeight:600,fontFamily:T.font,whiteSpace:"nowrap"}}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
                Seite zurücksetzen
              </button>}
              {/* Save-Indicator: zeigt gespeicherten Zustand oder "Speichert..." */}
              {order&&(saving||savedAgo)&&<div style={{display:"inline-flex",alignItems:"center",gap:7,fontSize:".78rem",fontWeight:600,color:saving?T.amber:T.green,padding:"6px 12px",background:saving?T.amberLight:T.greenLight,border:`1px solid ${saving?T.amberBorder:T.greenBorder}`,borderRadius:100,whiteSpace:"nowrap"}}>
                {saving?<>
                  <span style={{width:8,height:8,borderRadius:"50%",border:`2px solid ${T.amber}`,borderRightColor:"transparent",display:"inline-block",animation:"sb-rotate .8s linear infinite"}}/>Speichert...
                </>:<>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>{savedAgo}
                </>}
              </div>}
              {/* Preview-Link: immer erreichbar, auch wenn Kunde auf einer Unterseite ist */}
              {order&&sub&&<a href={`https://sitereadyprototype.pages.dev/s/${sub}`} target="_blank" rel="noreferrer" title="Ihre Website im neuen Tab öffnen" style={{display:"inline-flex",alignItems:"center",gap:7,fontSize:".78rem",fontWeight:700,color:"#fff",padding:"6px 14px",background:"#111",borderRadius:100,textDecoration:"none",whiteSpace:"nowrap"}}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                Website ansehen
              </a>}
            </div>
          </div>
        </div>
        <div className="pt-mh-line"/>
      </>}
      <div className="pt-mb">
      {isDirty&&(
        <div className="pt-save-bar" style={{position:"sticky",top:0,zIndex:10,display:"flex",flexDirection:"column",gap:saveError?8:0,
          padding:"12px 20px",background:saveError?"#991b1b":"#111",borderRadius:T.rSm,boxShadow:"0 4px 16px rgba(0,0,0,.15)",marginBottom:12}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:6,height:6,borderRadius:"50%",background:saveError?"#fca5a5":T.amber}}/>
              <span style={{fontSize:".88rem",fontWeight:600,color:"#fff"}}>{saveError?"Speichern fehlgeschlagen":"Ungespeicherte Änderungen"}</span>
            </div>
            <div style={{display:"flex",gap:8}}>
              <button onClick={discardChanges} style={{padding:"7px 16px",border:"1.5px solid rgba(255,255,255,.2)",borderRadius:T.rSm,background:"transparent",color:"rgba(255,255,255,.7)",cursor:"pointer",fontSize:".85rem",fontWeight:600,fontFamily:T.font}}>Verwerfen</button>
              <button onClick={saveAll} disabled={saving} style={{padding:"7px 20px",border:"none",borderRadius:T.rSm,background:"#fff",color:"#111",cursor:saving?"wait":"pointer",fontSize:".85rem",fontWeight:700,fontFamily:T.font}}>{saving?"Speichert...":saveError?"Erneut versuchen":"Speichern"}</button>
            </div>
          </div>
          {saveError&&<div style={{fontSize:".75rem",color:"rgba(255,255,255,.8)",lineHeight:1.5,paddingLeft:14}}>
            {saveError.length>180?saveError.slice(0,180)+"…":saveError}
            <span style={{opacity:.7,marginLeft:6}}>— Ihre Änderungen bleiben erhalten, bitte erneut klicken.</span>
          </div>}
        </div>
      )}
      {/* Trial-Banner */}
      {order?.status==="trial"&&(<div className="pt-trial-banner" style={{background:"linear-gradient(135deg,#7c3aed,#4f46e5)",borderRadius:T.r,padding:"20px 28px",marginBottom:20,display:"flex",alignItems:"center",justifyContent:"space-between",gap:16,flexWrap:"wrap"}}>
        <div>
          <div style={{fontWeight:800,fontSize:"1rem",color:"#fff",marginBottom:4}}>
            {trialDaysLeft>0?`Testphase: noch ${trialDaysLeft} Tag${trialDaysLeft===1?"":"e"}`:"Testphase abgelaufen"}
          </div>
          <div style={{fontSize:".82rem",color:"rgba(255,255,255,.75)"}}>Jetzt abonnieren – Karte wird erst nach der Testphase belastet.</div>
        </div>
        <button onClick={()=>setShowPlanModal(true)} style={{padding:"11px 24px",border:"2px solid rgba(255,255,255,.4)",borderRadius:T.rSm,background:"rgba(255,255,255,.15)",color:"#fff",cursor:"pointer",fontSize:".88rem",fontWeight:700,fontFamily:T.font,whiteSpace:"nowrap",backdropFilter:"blur(4px)",minHeight:44}}>
          Jetzt abonnieren {"→"}
        </button>
      </div>)}

      {/* Plan-Modal */}
      {showPlanModal&&(<div className="pt-plan-modal" style={{position:"fixed",inset:0,background:"rgba(0,0,0,.45)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999,padding:16}} onClick={()=>setShowPlanModal(false)}>
        <div style={{background:"#fff",borderRadius:T.r,padding:"36px 32px",maxWidth:480,width:"100%",boxShadow:"0 24px 64px rgba(0,0,0,.18)"}} onClick={e=>e.stopPropagation()}>
          <div style={{fontSize:"1.2rem",fontWeight:800,color:T.dark,marginBottom:6}}>Plan wählen</div>
          <div style={{fontSize:".85rem",color:T.textSub,marginBottom:28}}>Karte wird erst nach der Testphase belastet. Jederzeit kündbar.</div>
          <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:24}}>
            <button onClick={()=>subscribe("monthly")} disabled={subscribing} style={{padding:"18px 20px",border:`2px solid ${T.bg3}`,borderRadius:T.r,background:"#fff",cursor:subscribing?"wait":"pointer",textAlign:"left",fontFamily:T.font,transition:"border-color .2s"}}>
              <div style={{fontWeight:700,fontSize:".95rem",color:T.dark}}>Monatlich</div>
              <div style={{fontSize:"1.5rem",fontWeight:800,color:T.accent,fontFamily:T.mono,margin:"4px 0"}}>{"€"}18<span style={{fontSize:".85rem",fontWeight:500,color:T.textMuted}}>/Monat</span></div>
              <div style={{fontSize:".76rem",color:T.textMuted}}>Monatlich kündbar</div>
            </button>
            <button onClick={()=>subscribe("yearly")} disabled={subscribing} style={{padding:"18px 20px",border:`2px solid ${T.accent}`,borderRadius:T.r,background:T.accentLight,cursor:subscribing?"wait":"pointer",textAlign:"left",fontFamily:T.font,position:"relative"}}>
              <div style={{position:"absolute",top:-10,right:16,background:T.accent,color:"#fff",fontSize:".65rem",fontWeight:700,padding:"3px 10px",borderRadius:100,letterSpacing:".06em"}}>SPARE 12%</div>
              <div style={{fontWeight:700,fontSize:".95rem",color:T.dark}}>{"Jährlich"}</div>
              <div style={{fontSize:"1.5rem",fontWeight:800,color:T.accent,fontFamily:T.mono,margin:"4px 0"}}>{"€"}168<span style={{fontSize:".85rem",fontWeight:500,color:T.textMuted}}>/Jahr</span></div>
              <div style={{fontSize:".76rem",color:T.textMuted}}>{"€"}14/Monat &middot; Laufzeit 12 Monate</div>
            </button>
          </div>
          <button onClick={()=>setShowPlanModal(false)} style={{width:"100%",padding:"11px",border:`2px solid ${T.bg3}`,borderRadius:T.rSm,background:"#fff",color:T.textSub,cursor:"pointer",fontSize:".85rem",fontWeight:600,fontFamily:T.font}}>Abbrechen</button>
        </div>
      </div>)}

      {/* Toast */}
      {toastMsg&&<div className="pt-toast" style={{position:"fixed",bottom:28,right:28,zIndex:9999,background:T.dark,color:"#fff",padding:"12px 20px",borderRadius:T.rSm,fontSize:".85rem",fontWeight:600,fontFamily:T.font,boxShadow:"0 8px 32px rgba(0,0,0,.22)",display:"flex",alignItems:"center",gap:8,pointerEvents:"none"}}><span style={{color:T.greenBright}}>&#10003;</span>{toastMsg}</div>}
      {/* Bild-Crop */}
      {cropData&&<CropModal file={cropData.file} aspectKey={cropData.key}
        onCancel={()=>setCropData(null)}
        onConfirm={blob=>{const cb=cropData.onCrop;setCropData(null);cb?cb(blob):uploadBlob(cropData.key,blob);}}/>}
      {/* Lösch-Bestätigung */}
      {confirmDel&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.45)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999,padding:24}} onClick={()=>setConfirmDel(null)} onKeyDown={e=>{if(e.key==="Escape")setConfirmDel(null)}}>
        <div style={{background:"#fff",borderRadius:T.r,padding:"28px 28px 20px",maxWidth:380,width:"100%",boxShadow:"0 24px 64px rgba(0,0,0,.18)"}} onClick={e=>e.stopPropagation()}>
          <div style={{fontSize:".95rem",fontWeight:700,color:T.dark,marginBottom:6}}>{confirmDel.label} entfernen?</div>
          <div style={{fontSize:".82rem",color:T.textSub,marginBottom:20,lineHeight:1.5}}>Dieser Eintrag wird entfernt. Sie können ihn danach neu anlegen.</div>
          <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
            <button ref={el=>el&&el.focus()} onClick={()=>setConfirmDel(null)} style={{padding:"8px 18px",border:`1.5px solid ${T.bg3}`,borderRadius:T.rSm,background:"#fff",color:T.textSub,cursor:"pointer",fontSize:".82rem",fontWeight:600,fontFamily:T.font}}>Abbrechen</button>
            <button onClick={()=>{confirmDel.onConfirm();setConfirmDel(null);}} style={{padding:"8px 18px",border:"none",borderRadius:T.rSm,background:"#ef4444",color:"#fff",cursor:"pointer",fontSize:".82rem",fontWeight:700,fontFamily:T.font}}>Entfernen</button>
          </div>
        </div>
      </div>}
      {/* Build-Screen: status===pending (Generierung laeuft) */}
      {order?.status==="pending"&&<BuildScreen session={session} setOrder={setOrder}/>}


      {/* Übersicht-Seite */}
      {page==="overview"&&order&&order.status!=="pending"&&(<>
        <div className="pt-hero-card">
          <div className={`pt-hlive${order.status==="trial"?" pt-hlive-trial":""}`}><div className="pt-hlive-dot"/>{order.status==="trial"?"Testphase":"Live"}</div>
          <div className="pt-hurl"><em>https://</em>{sub}.siteready.at</div>
          <div className="pt-hhint">Ihre Website ist öffentlich erreichbar &middot; Änderungen sind sofort sichtbar{order.generated_at&&<> &middot; Erstellt am {new Date(order.generated_at).toLocaleDateString("de-AT",{day:"2-digit",month:"2-digit",year:"numeric"})}</>}</div>
          <div className="pt-hbtns">
            <a href={`https://sitereadyprototype.pages.dev/s/${sub}`} target="_blank" rel="noreferrer" className="pt-btn-w">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              Website öffnen
            </a>
            <button className="pt-btn-gw" onClick={()=>{navigator.clipboard.writeText(`https://sitereadyprototype.pages.dev/s/${sub}`);showToast("Link kopiert!");}}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              Link kopieren
            </button>
            <button className="pt-btn-gw" onClick={()=>nav("teilen")}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
              QR-Code & Teilen
            </button>
          </div>
        </div>
        {/* "Jetzt dran" — prominenter naechster Pflicht-Schritt */}
        {wizardCurrentIdx>=0&&!wizardAllDone&&(()=>{
          const step=wizardSteps[wizardCurrentIdx];
          if(!step)return null;
          return(<div style={{background:"#fff",borderRadius:T.r,border:`2px solid ${T.accent}`,padding:"22px 26px",boxShadow:"0 2px 12px rgba(143,163,184,.12)",display:"flex",alignItems:"center",gap:18,flexWrap:"wrap"}}>
            <div style={{width:48,height:48,borderRadius:"50%",background:T.accent,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:"1.05rem",fontWeight:800}}>{wizardCurrentIdx+1}</div>
            <div style={{flex:"1 1 240px",minWidth:0}}>
              <div style={{fontSize:".68rem",fontWeight:700,color:T.accent,textTransform:"uppercase",letterSpacing:".1em",marginBottom:4}}>Jetzt dran &middot; Schritt {wizardCurrentIdx+1} von {wizardTotal}</div>
              <div style={{fontSize:"1.02rem",fontWeight:700,color:T.dark,marginBottom:3,letterSpacing:"-.01em"}}>{step.label}</div>
              {step.desc&&<div style={{fontSize:".85rem",color:T.textMuted,lineHeight:1.5}}>{step.desc}</div>}
            </div>
            <button onClick={()=>nav(step.page)} style={{padding:"12px 24px",background:T.accent,color:"#fff",border:"none",borderRadius:T.rSm,cursor:"pointer",fontSize:".9rem",fontWeight:700,fontFamily:T.font,display:"inline-flex",alignItems:"center",gap:8,flexShrink:0,transition:"transform .15s,box-shadow .15s"}} onMouseDown={e=>e.currentTarget.style.transform="scale(.98)"} onMouseUp={e=>e.currentTarget.style.transform=""} onMouseLeave={e=>e.currentTarget.style.transform=""}>Ausfüllen <span style={{fontSize:"1.1em"}}>{"→"}</span></button>
          </div>);
        })()}
        {(()=>{
          const hasPL=getBrancheFeatures(order?.branche).includes("preisliste");
          const tips=[
            {label:"Logo hochladen",done:!!assetUrls.logo,page:"hero",hint:"Wird in der Navigation Ihrer Website angezeigt"},
            {label:"Titelbild hochladen",done:!!(assetUrls.hero),page:"hero",hint:"Das grosse Bild oben auf Ihrer Website"},
            {label:"Unternehmensbeschreibung prüfen",done:!!order.text_ueber_uns,page:"ueberuns",hint:"KI-generierten Text anpassen oder personalisieren"},
            {label:"Preise zu Leistungen hinzufügen",done:!!(order.leistungen_preise&&Object.keys(order.leistungen_preise).length>0),page:"leistungen",hint:"Preise direkt auf den Leistungskarten anzeigen"},
            ...(hasPL?[{label:"Preisliste hochladen",done:!!assetUrls.preisliste,page:"leistungen",hint:"Als PDF – wird als Download auf der Website angeboten"}]:[]),
            {label:"Eigene Domain verbinden",done:false,page:"seo",hint:"z.B. www.ihre-firma.at statt der Subdomain",optional:true},
          ];
          const open=tips.filter(t=>!t.done&&!t.optional);
          if(open.length===0)return(<div style={{background:"#fff",borderRadius:T.r,border:`1px solid ${T.bg3}`,padding:"18px 24px",display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:32,height:32,borderRadius:"50%",background:T.greenLight,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:T.green,fontWeight:700}}>{"✓"}</div>
            <div><div style={{fontSize:".88rem",fontWeight:700,color:T.green}}>Ihre Website ist vollständig eingerichtet!</div><div style={{fontSize:".78rem",color:T.textMuted,marginTop:2}}>Sie können jederzeit weitere Anpassungen vornehmen.</div></div>
          </div>);
          const shown=open.slice(0,3);
          const optionalTip=tips.find(t=>t.optional&&!t.done);
          return(<div style={{background:"#fff",borderRadius:T.r,border:`1px solid ${T.bg3}`,padding:"18px 24px"}}>
            <div style={{fontSize:".78rem",fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:".1em",marginBottom:12}}>Tipps zur Verbesserung</div>
            <div style={{display:"flex",flexDirection:"column",gap:4}}>
              {shown.map((tip,i)=>(
                <div key={i} onClick={()=>nav(tip.page)} onMouseOver={e=>e.currentTarget.style.background=T.bg} onMouseOut={e=>e.currentTarget.style.background="transparent"} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 10px",borderRadius:T.rSm,cursor:"pointer",transition:"background .12s"}}>
                  <div style={{width:6,height:6,borderRadius:"50%",background:T.accent,flexShrink:0}}/>
                  <div style={{flex:1}}><div style={{fontSize:".875rem",fontWeight:600,color:T.dark}}>{tip.label}</div><div style={{fontSize:".75rem",color:T.textMuted,marginTop:1}}>{tip.hint}</div></div>
                  <span style={{fontSize:".75rem",color:T.accent,fontWeight:700,flexShrink:0}}>{"→"}</span>
                </div>
              ))}
              {optionalTip&&<div onClick={()=>nav(optionalTip.page)} onMouseOver={e=>e.currentTarget.style.background=T.bg} onMouseOut={e=>e.currentTarget.style.background="transparent"} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 10px",borderRadius:T.rSm,cursor:"pointer",transition:"background .12s",marginTop:4,paddingTop:12,borderTop:`1px solid ${T.bg3}`}}>
                <div style={{flex:1}}><div style={{fontSize:".8rem",color:T.textMuted}}>{optionalTip.label} <span style={{fontSize:".72rem",background:T.bg,padding:"1px 7px",borderRadius:100,marginLeft:4}}>Optional</span></div></div>
                <span style={{fontSize:".75rem",color:T.textMuted,fontWeight:700,flexShrink:0}}>{"→"}</span>
              </div>}
            </div>
          </div>);
        })()}
        <div style={{background:"#fff",borderRadius:T.r,border:`1px solid ${T.bg3}`,padding:"18px 24px",display:"flex",alignItems:"center",gap:16,opacity:.7}}>
          <div style={{width:38,height:38,borderRadius:T.rSm,background:T.bg2,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.accent} strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </div>
          <div style={{flex:1}}>
            <div style={{fontSize:".85rem",fontWeight:700,color:T.dark,marginBottom:2}}>FAQ & häufige Fragen</div>
            <div style={{fontSize:".78rem",color:T.textMuted,lineHeight:1.5}}>Antworten auf häufige Fragen zu Ihrer Website – bald verfügbar</div>
          </div>
          <div style={{fontSize:".72rem",fontWeight:700,color:T.accent,background:T.accentLight,padding:"3px 9px",borderRadius:100,flexShrink:0,border:`1px solid rgba(143,163,184,.2)`}}>Bald</div>
        </div>
      </>)}

      {/* Tab: Website & Extras (Inhalte-Unterseiten) */}
      {(tab==="website"||tab==="extras")&&page!=="overview"&&(!order?(orderLoadAttempts<5?<div style={{background:"#fff",borderRadius:T.r,padding:"28px 32px",border:`1px solid ${T.bg3}`,color:T.textMuted,fontSize:".9rem"}}>Bestellung wird geladen...</div>:null):<>
        {/* Aktuelles / News */}
        {page==="aktuelles"&&<div style={{background:"#fff",borderRadius:T.r,padding:"24px 28px",border:`1px solid ${T.bg3}`,boxShadow:T.sh2}}>
          <SectionHeader label="Aktuelles" desc="Kurzfristige Infos wie Betriebsurlaub, Aktionen oder News — erscheint als Banner auf Ihrer Website."/>
          {(order.announcements||[]).length<1&&<button onClick={async()=>{
            const a=[{text:"",active:false,date_start:"",date_end:"",id:Date.now()}];
            await supabase.from("orders").update({announcements:a}).eq("id",order.id);
            setOrder(o=>({...o,announcements:a}));
          }} style={{padding:"8px 16px",border:`1.5px solid ${T.bg3}`,borderRadius:T.rSm,background:"#fff",color:T.textMuted,cursor:"pointer",fontSize:".8rem",fontWeight:600,fontFamily:T.font,minHeight:36,transition:"all .15s",marginBottom:12}}>+ Hinzufügen</button>}
          {(order.announcements||[]).length===0?(<div style={{padding:"24px 16px",textAlign:"center",background:T.bg,borderRadius:T.rSm,border:`1px dashed ${T.bg3}`}}>
            <div style={{fontSize:".85rem",color:T.textMuted,marginBottom:4}}>Keine Meldungen</div>
            <div style={{fontSize:".8rem",color:T.textMuted}}>Aktionen, Urlaub oder News — erscheint als Banner auf Ihrer Website.</div>
          </div>):(
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {(order.announcements||[]).map((ann,i)=>{const saveAnn=async(a)=>{const{error}=await supabase.from("orders").update({announcements:a}).eq("id",order.id);if(error){showToast("Speichern fehlgeschlagen: "+error.message);try{await supabase.from("error_logs").insert({source:"announcements_save_error",message:error.message});}catch(_){}return;}if(originalOrderRef.current)originalOrderRef.current={...originalOrderRef.current,announcements:a};showToast("Gespeichert");};return<div key={ann.id||i} style={{border:`1.5px solid ${ann.active?T.accent+"33":T.bg3}`,borderRadius:T.rSm,padding:"14px 16px",background:ann.active?"#fff":T.bg}}>
              <div style={{marginBottom:10}}>
                <div style={{fontSize:".65rem",fontWeight:700,textTransform:"uppercase",letterSpacing:".08em",color:T.textMuted,marginBottom:4}}>Text</div>
                <input value={ann.text} placeholder="z.B. Betriebsurlaub 1.–15. August" onChange={e=>{const a=[...(order.announcements||[])];a[i]={...a[i],text:e.target.value};setOrder(o=>({...o,announcements:a}));}} onBlur={()=>{const a=[...(order.announcements||[])];saveAnn(a);}} style={{width:"100%",padding:"8px 12px",border:`1.5px solid ${T.bg3}`,borderRadius:T.rSm,fontSize:".85rem",fontFamily:T.font,color:T.dark,outline:"none",minHeight:40,boxSizing:"border-box"}}/>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
                <div>
                  <div style={{fontSize:".65rem",fontWeight:700,textTransform:"uppercase",letterSpacing:".08em",color:T.textMuted,marginBottom:4}}>Anzeigen ab</div>
                  <input type="date" value={ann.date_start||""} onChange={e=>{const a=[...(order.announcements||[])];a[i]={...a[i],date_start:e.target.value};setOrder(o=>({...o,announcements:a}));saveAnn(a);}} style={{width:"100%",padding:"8px 10px",border:`1.5px solid ${T.bg3}`,borderRadius:T.rSm,fontSize:".82rem",fontFamily:T.font,color:T.textMuted,outline:"none",minHeight:40,boxSizing:"border-box"}}/>
                </div>
                <div>
                  <div style={{fontSize:".65rem",fontWeight:700,textTransform:"uppercase",letterSpacing:".08em",color:T.textMuted,marginBottom:4}}>Anzeigen bis</div>
                  <input type="date" value={ann.date_end||ann.date||""} onChange={e=>{const a=[...(order.announcements||[])];a[i]={...a[i],date_end:e.target.value};setOrder(o=>({...o,announcements:a}));saveAnn(a);}} style={{width:"100%",padding:"8px 10px",border:`1.5px solid ${T.bg3}`,borderRadius:T.rSm,fontSize:".82rem",fontFamily:T.font,color:T.textMuted,outline:"none",minHeight:40,boxSizing:"border-box"}}/>
                </div>
              </div>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",fontSize:".8rem",color:ann.active?T.green:T.textMuted,fontWeight:600}}>
                  <div style={{width:36,height:20,borderRadius:10,background:ann.active?T.green:T.bg3,position:"relative",transition:"background .2s",cursor:"pointer"}} onClick={()=>{const a=[...(order.announcements||[])];a[i]={...a[i],active:!a[i].active};setOrder(o=>({...o,announcements:a}));saveAnn(a);}}>
                    <div style={{width:16,height:16,borderRadius:"50%",background:"#fff",position:"absolute",top:2,left:ann.active?18:2,transition:"left .2s",boxShadow:"0 1px 3px rgba(0,0,0,.15)"}}/>
                  </div>
                  {ann.active?"Sichtbar":"Ausgeblendet"}
                </label>
                <button onClick={async()=>{await supabase.from("orders").update({announcements:[]}).eq("id",order.id);setOrder(o=>({...o,announcements:[]}));}} style={{padding:"6px 10px",border:`1.5px solid #fca5a5`,borderRadius:T.rSm,background:"#fff",color:T.red,cursor:"pointer",fontSize:".78rem",fontWeight:700,fontFamily:T.font,minHeight:32}}>Entfernen</button>
              </div>
            </div>})}
          </div>)}
        </div>}
        {page==="grunddaten"&&<div style={{background:"#fff",borderRadius:T.r,padding:"24px 28px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1}}>
          <SectionHeader label="Grunddaten" desc="Firmenname und Kurzbeschreibung erscheinen oben auf Ihrer Website und in Google-Suchergebnissen."/>
          <Field label="Firmenname" value={order.firmenname||""} onChange={upOrder("firmenname")} placeholder="Firmenname" required/>
          <Field label="Kurzbeschreibung" value={order.kurzbeschreibung||""} onChange={upOrder("kurzbeschreibung")} placeholder="Kurze Beschreibung" rows={2} required/>
          <Field label="Einsatzgebiet" value={order.einsatzgebiet||""} onChange={upOrder("einsatzgebiet")} placeholder="Wien & Umgebung" help="Die Region, in der Sie tätig sind. Wird unter dem Firmennamen angezeigt und hilft Google, Sie bei lokalen Suchanfragen zu finden."/>
        </div>}
        {/* Hero page — combined Logo + Hero uploads + Grunddaten fields */}
        {page==="hero"&&<>
          {/* Hero-Headline — der grosse Satz oben auf der Website */}
          <div style={{background:"#fff",borderRadius:T.r,padding:"20px 24px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1,marginBottom:16}}>
            <SectionHeader label="Hero-Überschrift" desc="Der große Satz ganz oben auf Ihrer Website. Meist ein Slogan oder Kernversprechen — nicht der Firmenname (der erscheint automatisch klein darunter)." aiField="hero_headline"/>
            <Field label="Überschrift" value={order.hero_headline||""} onChange={upOrder("hero_headline")} placeholder={(ZIELGRUPPE_WORT[order.branche]?`Ihr ${ZIELGRUPPE_WORT[order.branche].replace(/en$|e$/,"")}-Versprechen`:"z. B. Ihr zuverlässiger Partner seit 1990")} rows={2} hint="Leer lassen, dann wird der Firmenname als Überschrift verwendet." help="5-8 Wörter Kernbotschaft der Website. Typische Struktur: 'Nutzen + Branche + Zeit/Ort' — z.B. 'Frische Wurstwaren seit 1962' oder 'Zuverlässige Elektrik in Wien'."/>
            <button onClick={async()=>{
              if(!session)return;
              showToast("Neue Überschrift wird generiert...");
              try{
                const res=await fetch("/api/generate-headline",{method:"POST",headers:{"Content-Type":"application/json","Authorization":`Bearer ${session.access_token}`},body:JSON.stringify({order_id:order.id})});
                const data=await res.json();
                if(data.hero_headline){upOrder("hero_headline")(data.hero_headline);showToast("Vorschlag übernommen");}
                else showToast("Fehler: "+(data.error||"unbekannt"));
              }catch(e){showToast("Fehler: "+e.message);}
            }} style={{marginTop:4,padding:"8px 14px",border:`1.5px dashed ${T.bg3}`,borderRadius:T.rSm,background:"none",color:T.accent,cursor:"pointer",fontSize:".82rem",fontWeight:600,fontFamily:T.font,display:"inline-flex",alignItems:"center",gap:6}}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
              ✨ Neuen Vorschlag generieren
            </button>
          </div>
          {/* Hero-Layout Auswahl */}
          <div style={{background:"#fff",borderRadius:T.r,padding:"20px 24px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1,marginBottom:16}}>
            <div style={{fontWeight:700,fontSize:".82rem",color:T.dark,marginBottom:4}}>Hero-Layout</div>
            <div style={{fontSize:".75rem",color:T.textMuted,marginBottom:14}}>Bestimmt wie der Kopfbereich Ihrer Website aussieht</div>
            <div style={{display:"flex",gap:10}}>
              {[
                {v:"fullscreen",l:"Vollbild",d:"Bild als Hintergrund mit Text-Overlay"},
                {v:"split",l:"Geteilt",d:"Text links, Bild rechts"},
                {v:"minimal",l:"Ohne Bild",d:"Nur Text, zentriert"},
              ].map(o=>{const active=(order?.varianten_cache?.hero||"fullscreen")===o.v;return<button key={o.v} onClick={()=>{const vc={...(order.varianten_cache||{}),hero:o.v};upOrder("varianten_cache")(vc);}} style={{flex:1,padding:"14px 12px",border:active?`2px solid ${T.accent}`:`2px solid ${T.bg3}`,borderRadius:T.rSm,background:active?T.accentLight:"#fff",cursor:"pointer",textAlign:"left",fontFamily:T.font,transition:"all .15s"}}>
                <div style={{fontWeight:700,fontSize:".82rem",color:active?T.accent:T.dark,marginBottom:2}}>{o.l}</div>
                <div style={{fontSize:".7rem",color:T.textMuted,lineHeight:1.4}}>{o.d}</div>
              </button>})}
            </div>
          </div>
          {/* Logo upload */}
          {(()=>{const a=ASSETS[0];const url=assetUrls[a.key];const busy=uploading[a.key];return(
          <div style={{background:"#fff",borderRadius:T.r,padding:"20px 24px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1}}>
            <div className="pt-upload-hdr" style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
              <div>
                <div style={{fontWeight:700,fontSize:".9rem",color:T.dark,marginBottom:2}}>Logo</div>
                <div style={{fontSize:".78rem",color:T.textMuted}}>{a.desc}</div>
              </div>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <label style={{padding:"9px 18px",border:`2px solid ${T.bg3}`,borderRadius:T.rSm,background:busy?T.bg:"#fff",color:T.textSub,cursor:busy?"wait":"pointer",fontSize:".82rem",fontWeight:600,fontFamily:T.font,whiteSpace:"nowrap"}}>
                  {busy?"Lädt...":url?"Ersetzen":"Hochladen"}
                  <input type="file" accept="image/*" style={{display:"none"}} disabled={busy} onChange={e=>{if(e.target.files[0])upload(a.key,e.target.files[0]);}}/>
                </label>
                {url&&<button onClick={()=>askDelete(a.label||"Bild",()=>deleteAsset(a.key))} disabled={deleting[a.key]} title="Bild entfernen" style={{padding:"9px 12px",border:"2px solid #fca5a5",borderRadius:T.rSm,background:"#fff",color:"#ef4444",cursor:deleting[a.key]?"wait":"pointer",fontSize:".82rem",fontWeight:700,fontFamily:T.font}}>{deleting[a.key]?"...":"×"}</button>}
              </div>
            </div>
            {url&&(<div style={{marginBottom:12}}>
              <div style={{fontSize:".68rem",fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:".08em",marginBottom:6}}>Vorschau</div>
              <div className="pt-logo-preview" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <div>
                  <div style={{fontSize:".68rem",color:T.textMuted,marginBottom:4}}>Navigation (dunkel)</div>
                  <div style={{background:order?.custom_color||"#0f172a",borderRadius:T.rSm,padding:"10px 16px",display:"flex",alignItems:"center"}}>
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
              {logoContrastIssue&&<div style={{marginTop:10,padding:"12px 14px",background:"#fef3c7",border:"1px solid #fcd34d",borderRadius:T.rSm}}>
                <div style={{display:"flex",alignItems:"flex-start",gap:10}}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#92400e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0,marginTop:1}}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                  <div style={{flex:1}}>
                    <div style={{fontSize:".82rem",fontWeight:700,color:"#78350f",marginBottom:3}}>Logo schwer sichtbar auf der Navigation</div>
                    <div style={{fontSize:".78rem",color:"#78350f",lineHeight:1.55}}>{logoContrastIssue==="too-dark"?"Ihr Logo ist dunkel und verschwindet auf dem dunklen Navigationshintergrund (siehe linke Vorschau).":"Ihr Logo ist sehr hell und geht auf dem hellen Hintergrund unter."} Bitte laden Sie eine Version mit ausreichendem Kontrast hoch — die meisten Designer liefern Logo-Varianten für helle UND dunkle Hintergründe.</div>
                  </div>
                </div>
              </div>}
            </div>)}
            {!url&&(<div style={{background:T.bg,borderRadius:T.rSm,padding:"28px 16px",textAlign:"center",marginBottom:4}}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={T.bg3} strokeWidth="1.5" style={{marginBottom:8}}><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
              <div style={{fontSize:".78rem",color:T.textMuted}}>Noch kein Logo hochgeladen</div>
            </div>)}
            <div style={{fontSize:".8rem",color:T.textMuted,marginTop:8,lineHeight:1.6}}>
              <strong style={{color:T.dark}}>Wichtig:</strong> Ihr Logo wird auf einem dunklen Hintergrund angezeigt. Am besten funktioniert ein PNG mit transparentem Hintergrund (mind. 400 {"×"} 150 px).
              <br/>Hat Ihr Logo einen farbigen Hintergrund? Entfernen Sie ihn kostenlos: <a href="https://www.remove.bg/de" target="_blank" rel="noopener noreferrer" style={{color:T.accent,fontWeight:600}}>remove.bg</a>
            </div>
          </div>
          );})()}
          {/* Hero-Bild upload */}
          {(()=>{const url=assetUrls["hero"];const busy=uploading["hero"];const isPlaceholder=!!order?.hero_is_placeholder;return(
          <div style={{background:"#fff",borderRadius:T.r,padding:"20px 24px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1}}>
            <div className="pt-upload-hdr" style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:url?16:0}}>
              <div>
                <div style={{fontWeight:700,fontSize:".9rem",color:T.dark,marginBottom:2}}>Titelbild {isPlaceholder?<span style={{fontSize:".65rem",fontWeight:600,padding:"2px 8px",borderRadius:100,background:T.amberLight,color:T.amberText,marginLeft:6,verticalAlign:"middle"}}>Beispielfoto</span>:<span style={{fontSize:".75rem",fontWeight:500,color:T.textMuted}}>(optional)</span>}</div>
                <div style={{fontSize:".78rem",color:T.textMuted}}>{isPlaceholder?"Laden Sie ein eigenes Foto hoch für einen persönlicheren Auftritt":"Hintergrundbild für den oberen Bereich der Website"}</div>
              </div>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <label style={{padding:"9px 18px",border:`2px solid ${T.bg3}`,borderRadius:T.rSm,background:busy?T.bg:"#fff",color:T.textSub,cursor:busy?"wait":"pointer",fontSize:".82rem",fontWeight:600,fontFamily:T.font,whiteSpace:"nowrap"}}>
                  {busy?"Lädt...":url?"Ersetzen":"Hochladen"}
                  <input type="file" accept="image/*" style={{display:"none"}} disabled={busy} onChange={e=>{if(e.target.files[0])upload("hero",e.target.files[0]);}}/>
                </label>
                {url&&<button onClick={()=>askDelete("Titelbild",()=>deleteAsset("hero"))} disabled={deleting["hero"]} title="Titelbild entfernen" style={{padding:"9px 12px",border:"2px solid #fca5a5",borderRadius:T.rSm,background:"#fff",color:"#ef4444",cursor:deleting["hero"]?"wait":"pointer",fontSize:".82rem",fontWeight:700,fontFamily:T.font}}>{deleting["hero"]?"...":"×"}</button>}
              </div>
            </div>
            {url&&<>
            <div style={{borderRadius:T.rSm,overflow:"hidden",height:100,background:"#000",position:"relative"}}>
              <img src={url} alt="Hero" style={{width:"100%",height:"100%",objectFit:"cover",opacity:.8}}/>
            </div>
            </>}
            {!url&&<div style={{background:T.bg,borderRadius:T.rSm,padding:"20px 16px",textAlign:"center",marginTop:12}}>
              <div style={{fontSize:".78rem",color:T.textMuted}}>Noch kein Titelbild hochgeladen – Farbverlauf bleibt aktiv</div>
            </div>}
            <div style={{fontSize:".78rem",color:T.textMuted,marginTop:8,lineHeight:1.6}}>Empfohlen: JPG, mind. 1920 &times; 1080 px &middot; Querformat &middot; Ohne Textüberlagerungen (Bild wird automatisch mit Farbverlauf abgedunkelt)</div>
            {url&&!isPlaceholder&&<>
              <div style={{marginTop:14,padding:"12px 14px",borderRadius:T.rSm,background:T.bg,border:`1px solid ${T.bg3}`}}>
                <div style={{fontSize:".72rem",fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:".08em",marginBottom:6}}>Urheberrecht</div>
                <label style={{display:"flex",alignItems:"flex-start",gap:10,cursor:"pointer",marginBottom:10}}>
                  <input type="checkbox" checked={!!order.foto_rights_confirmed} onChange={e=>upOrder("foto_rights_confirmed")(e.target.checked)} style={{marginTop:2,flexShrink:0}}/>
                  <span style={{fontSize:".78rem",color:T.textSub,lineHeight:1.5}}>Ich bestätige, die Nutzungsrechte für dieses Foto zu besitzen oder eine entsprechende Lizenz zu haben.</span>
                </label>
                <div>
                  <label style={{display:"block",fontSize:".78rem",fontWeight:600,color:T.dark,marginBottom:4}}>Bildnachweis <span style={{fontWeight:400,color:T.textMuted}}>(optional)</span></label>
                  <input type="text" value={order.foto_credit||""} onChange={e=>upOrder("foto_credit")(e.target.value)} placeholder="z. B. Foto: Max Mustermann | unsplash.com/@beispiel" style={{width:"100%",padding:"8px 12px",border:`1px solid ${T.bg3}`,borderRadius:T.rSm,fontSize:".82rem",fontFamily:T.font,color:T.dark,background:"#fff",outline:"none"}}/>
                  <div style={{fontSize:".72rem",color:T.textMuted,marginTop:4}}>Wird im Impressum Ihrer Website unter „Bildnachweis" angezeigt.</div>
                </div>
              </div>
            </>}
          </div>
          );})()}
          {/* Grunddaten fields */}
          <div style={{background:"#fff",borderRadius:T.r,padding:"24px 28px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1}}>
            <SectionHeader label="Firmenname & Beschreibung" desc="Firmenname und Kurzbeschreibung erscheinen oben auf Ihrer Website und in Google-Suchergebnissen."/>
            <Field label="Firmenname" value={order.firmenname||""} onChange={upOrder("firmenname")} placeholder="Firmenname" required/>
            <Field label="Kurzbeschreibung" value={order.kurzbeschreibung||""} onChange={upOrder("kurzbeschreibung")} placeholder="Kurze Beschreibung" rows={2} required/>
            <Field label="Einsatzgebiet" value={order.einsatzgebiet||""} onChange={upOrder("einsatzgebiet")} placeholder="Wien & Umgebung" help="Die Region, in der Sie tätig sind. Wird unter dem Firmennamen angezeigt und hilft Google, Sie bei lokalen Suchanfragen zu finden."/>
          </div>
        </>}
        {page==="impressum"&&<div style={{background:"#fff",borderRadius:T.r,padding:"24px 28px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1}}>
          <SectionHeader label="Unternehmen & Impressum"            desc="Rechtlich vorgeschriebene Pflichtangaben für Ihre Website. Pflichtfelder sind mit * markiert."/>
          {(()=>{const uf=order.unternehmensform;const hasFB=["eu","gmbh","og","kg","ag"].includes(uf);
          const required=(IMPRESSUM_REQUIRED[uf]||[]);
          const req=k=>required.includes(k);
          const missing=getMissingImpressumFields(order);
          return<>
            <Dropdown label="Unternehmensform" value={uf||""} onChange={upOrder("unternehmensform")} options={UNTERNEHMENSFORMEN} placeholder="Unternehmensform wählen" required/>
            {uf==="einzelunternehmen"&&<div className="pt-impres-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <Field label="Vorname Inhaber" value={order.vorname||""} onChange={upOrder("vorname")} placeholder="Maria" required={req("vorname")}/>
              <Field label="Nachname Inhaber" value={order.nachname||""} onChange={upOrder("nachname")} placeholder="Muster" required={req("nachname")}/>
            </div>}
            {uf==="gesnbr"&&<Field label="Gesellschafter" value={order.gesellschafter||""} onChange={upOrder("gesellschafter")} placeholder="Max Mustermann, Maria Musterfrau" hint="Pflicht laut WKO" required={req("gesellschafter")}/>}
            {hasFB&&<div className="pt-impres-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <Field label="Firmenbuchnummer" value={order.firmenbuchnummer||""} onChange={upOrder("firmenbuchnummer")} placeholder="FN 123456a" help="Die Firmenbuchnummer finden Sie im Firmenbuchauszug. Format z.B. FN 123456a. Pflicht für GmbH, AG, OG, KG und e.U." required={req("firmenbuchnummer")}/>
              <Field label="Firmenbuchgericht" value={order.firmenbuchgericht||""} onChange={upOrder("firmenbuchgericht")} placeholder="HG Wien" required={req("firmenbuchgericht")}/>
            </div>}
            {uf==="gmbh"&&<Field label="Geschäftsführer" value={order.geschaeftsfuehrer||""} onChange={upOrder("geschaeftsfuehrer")} placeholder="Vor- und Nachname" hint="Für das Impressum" required={req("geschaeftsfuehrer")}/>}
            {(uf==="og"||uf==="kg")&&<Field label="Gesellschafter" value={order.gesellschafter||""} onChange={upOrder("gesellschafter")} placeholder="Max Mustermann, Maria Musterfrau" hint="Persönlich haftende Gesellschafter — Pflicht" required={req("gesellschafter")}/>}
            {uf==="ag"&&<><Field label="Vorstand" value={order.vorstand||""} onChange={upOrder("vorstand")} placeholder="Vor- und Nachname" required={req("vorstand")}/><Field label="Aufsichtsrat" value={order.aufsichtsrat||""} onChange={upOrder("aufsichtsrat")} placeholder="Vor- und Nachname" hint="Optional"/></>}
            {uf==="verein"&&<><Field label="ZVR-Zahl" value={order.zvr_zahl||""} onChange={upOrder("zvr_zahl")} placeholder="z.B. 123456789" help="Die ZVR-Zahl (Zentrales Vereinsregister) wird vom BMI vergeben. Online nachschlagen: vereinsregister.at" required={req("zvr_zahl")}/><Field label="Vertretungsbefugte Organe" value={order.vertretungsorgane||""} onChange={upOrder("vertretungsorgane")} placeholder="z.B. Obmann: Max Mustermann" rows={2} help="Personen die den Verein rechtlich vertreten (z.B. Obmann, Kassier, Schriftführer) mit Namen." required={req("vertretungsorgane")}/></>}
            <Field label="UID-Nummer" value={order.uid_nummer||""} onChange={upOrder("uid_nummer")} placeholder="ATU12345678" hint="Optional" help="Die UID-Nummer (Umsatzsteuer-Identifikation) beginnt mit ATU gefolgt von 8 Ziffern. Nur falls Sie umsatzsteuerpflichtig sind."/>
            <Field label="GISA-Zahl" value={order.gisazahl||""} onChange={upOrder("gisazahl")} placeholder="GISA 12345678" hint="Optional" help="Die GISA-Zahl ist Ihre Gewerberegister-Nummer. Sie steht im Gewerbeschein. Format z.B. GISA 12345678."/>
            {missing.length>0&&<div style={{marginTop:16,padding:"12px 14px",background:"#fef3c7",border:"1px solid #fcd34d",borderRadius:T.rSm}}>
              <div style={{fontSize:".82rem",fontWeight:700,color:"#78350f",marginBottom:4}}>Pflichtfelder fehlen</div>
              <div style={{fontSize:".78rem",color:"#78350f",lineHeight:1.55}}>Folgende Angaben fehlen noch: <strong>{missing.map(m=>m.label).join(", ")}</strong>. Erst nach Ausfüllen kann das Impressum gespeichert werden.</div>
            </div>}
            {isImpressumDirty&&missing.length===0&&<div style={{marginTop:16,padding:"10px 14px",background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:T.rSm,fontSize:".78rem",color:"#1e40af",lineHeight:1.5}}>Sie haben ungespeicherte Impressum-Änderungen. Auto-Save ist für diese Felder deaktiviert — bitte explizit speichern.</div>}
            <div style={{marginTop:16}}>
              <button onClick={()=>setImpressumConfirmOpen(true)} disabled={saving||missing.length>0} title={missing.length>0?"Pflichtfelder ausfuellen":""} style={{padding:"9px 18px",border:"none",borderRadius:T.rSm,background:missing.length>0?"#ccc":T.dark,color:"#fff",cursor:missing.length>0?"not-allowed":"pointer",fontSize:".85rem",fontWeight:700,fontFamily:T.font}}>{saving?"Speichert...":"Impressum speichern"}</button>
            </div>
          </>;})()}
          {impressumConfirmOpen&&(()=>{const missing=getMissingImpressumFields(order);const required=(IMPRESSUM_REQUIRED[order.unternehmensform]||[]);return<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.45)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999,padding:24}} onClick={()=>{setImpressumConfirmOpen(false);setImpressumChecked(false);}}>
            <div style={{background:"#fff",borderRadius:T.r,padding:"32px 28px",maxWidth:480,width:"100%",boxShadow:"0 24px 64px rgba(0,0,0,.18)"}} onClick={e=>e.stopPropagation()}>
              <div style={{fontSize:"1.05rem",fontWeight:800,color:T.dark,marginBottom:8}}>Impressum bestätigen</div>
              <p style={{fontSize:".85rem",color:T.textSub,lineHeight:1.6,margin:"0 0 16px"}}>Falsche Impressum-Angaben können Abmahnungen nach sich ziehen. Bitte Angaben final prüfen:</p>
              {required.length>0&&<div style={{marginBottom:18,padding:"12px 14px",background:T.bg,borderRadius:T.rSm,border:`1px solid ${T.bg3}`}}>
                <div style={{fontSize:".72rem",fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:".08em",marginBottom:8}}>Pflichtfelder</div>
                {required.map(k=>{const filled=!missing.find(m=>m.key===k);return<div key={k} style={{display:"flex",alignItems:"center",gap:8,padding:"3px 0",fontSize:".82rem",color:filled?T.dark:"#78350f"}}>
                  <span style={{width:16,height:16,borderRadius:"50%",background:filled?"#10b981":"#fef3c7",color:"#fff",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:".6rem",flexShrink:0,border:filled?"none":"1px solid #fcd34d"}}>{filled?"✓":"!"}</span>
                  <span>{IMPRESSUM_LABELS[k]||k}</span>
                </div>;})}
              </div>}
              <label style={{display:"flex",alignItems:"flex-start",gap:10,cursor:"pointer",marginBottom:24}}>
                <input type="checkbox" checked={impressumChecked} onChange={e=>setImpressumChecked(e.target.checked)} style={{marginTop:3,flexShrink:0,width:16,height:16,cursor:"pointer"}}/>
                <span style={{fontSize:".85rem",color:T.dark,lineHeight:1.5}}>Ich bestätige, dass alle Angaben korrekt sind und ich rechtlich verantwortlich bin.</span>
              </label>
              <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
                <button onClick={()=>{setImpressumConfirmOpen(false);setImpressumChecked(false);}} style={{padding:"9px 18px",border:`2px solid ${T.bg3}`,borderRadius:T.rSm,background:"#fff",color:T.textSub,cursor:"pointer",fontSize:".85rem",fontWeight:600,fontFamily:T.font}}>Abbrechen</button>
                <button disabled={!impressumChecked||missing.length>0} onClick={()=>{saveImpressum();setImpressumConfirmOpen(false);setImpressumChecked(false);}} style={{padding:"9px 18px",border:"none",borderRadius:T.rSm,background:(impressumChecked&&missing.length===0)?T.dark:"#ccc",color:"#fff",cursor:(impressumChecked&&missing.length===0)?"pointer":"default",fontSize:".85rem",fontWeight:700,fontFamily:T.font}}>Speichern</button>
              </div>
            </div>
          </div>;})()}
        </div>}
        {page==="kontakt"&&<>
          {/* Kontakt-Variante */}
          <div style={{background:"#fff",borderRadius:T.r,padding:"20px 24px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1,marginBottom:16}}>
            <VariantenHint label="Kontakt-Variante" value={order?.varianten_cache?.kontakt}/>
          </div>
          <div style={{background:"#fff",borderRadius:T.r,padding:"24px 28px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1}}>
            <SectionHeader label="Adresse & Kontakt" desc="Ihre Adresse und Telefonnummer werden auf der Website angezeigt und sind über Google Maps auffindbar."/>
            <Field label="Straße & Hausnummer" value={order.adresse||""} onChange={upOrder("adresse")} placeholder="Hauptstrasse 1" hint="Wird auf der Website und für Google Maps verwendet" required/>
            <div className="pt-addr-grid" style={{display:"grid",gridTemplateColumns:"100px 1fr 1fr",gap:12}}>
              <Field label="PLZ" value={order.plz||""} onChange={upOrder("plz")} placeholder="1010"/>
              <Field label="Ort" value={order.ort||""} onChange={upOrder("ort")} placeholder="Wien"/>
              <Field label="Telefon" value={order.telefon||""} onChange={upOrder("telefon")} placeholder="+43 1 234 56 78" hint="Wird als klickbarer Anruf-Button angezeigt" validate={VALIDATORS.tel} required/>
            </div>
            <Field label="WhatsApp-Nummer" value={order.whatsapp||""} onChange={upOrder("whatsapp")} placeholder="+43 664 123 45 67" hint="Wenn ausgefüllt, erscheint ein WhatsApp-Button auf Ihrer Website. Leer lassen = kein Button." validate={VALIDATORS.tel}/>
            <div style={{paddingTop:16,borderTop:`1px solid ${T.bg3}`,marginTop:8}}>
              <div style={{fontSize:".72rem",fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:".1em",marginBottom:4}}>Schwebender Kontakt-Button</div>
              <div style={{fontSize:".75rem",color:T.textMuted,marginBottom:10,lineHeight:1.5}}>Runder Button unten rechts auf Ihrer Website. Verwendet WhatsApp → Buchungslink → Telefon in dieser Reihenfolge.</div>
              <VisibilityToggle field="sticky_cta" labelOn="Schwebender Button erscheint auf Ihrer Website" labelOff="Schwebender Button wird nicht angezeigt" hasContent={!!(order.telefon||order.whatsapp||order.buchungslink)} contentHint="Telefon, WhatsApp oder Buchungslink ausfüllen — einer davon ist die Ziel-Aktion des Buttons."/>
            </div>
          </div>
          <div style={{background:"#fff",borderRadius:T.r,padding:"24px 28px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1}}>
            <SectionHeader label="Öffnungszeiten & Formular" desc="Öffnungszeiten, Hinweise und Kontaktformular-Einstellungen."/>
            <Dropdown label="Öffnungszeiten" value={order.oeffnungszeiten||""} onChange={upOrder("oeffnungszeiten")} options={OEFFNUNGSZEITEN} placeholder="Öffnungszeiten wählen"/>
            {order.oeffnungszeiten==="custom"&&<Field label="Eigene Öffnungszeiten" value={order.oeffnungszeiten_custom||""} onChange={upOrder("oeffnungszeiten_custom")} placeholder={"Mo-Fr: 08:00-17:00"} rows={2}/>}
            {isAiGen("gut_zu_wissen")&&order.gut_zu_wissen&&<div style={{display:"flex",alignItems:"center",gap:8,marginTop:12,marginBottom:4,padding:"8px 12px",background:T.amberLight,borderRadius:T.rSm,border:`1px solid ${T.amberBorder}`}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.amberText} strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
              <span style={{flex:1,fontSize:".78rem",fontWeight:600,color:T.amberText}}>Automatisch erstellt — bitte prüfen</span>
              <button onClick={async()=>{await supabase.from("orders").update({gut_zu_wissen:null,ai_generated:(order.ai_generated||[]).filter(f=>f!=="gut_zu_wissen")}).eq("id",order.id);setOrder(o=>({...o,gut_zu_wissen:null,ai_generated:(o.ai_generated||[]).filter(f=>f!=="gut_zu_wissen")}));showToast("Hinweise entfernt");}} style={{padding:"3px 10px",border:"1px solid #fca5a5",borderRadius:4,background:"#fff",color:"#ef4444",cursor:"pointer",fontSize:".72rem",fontWeight:600,fontFamily:T.font}}>Entfernen</button>
            </div>}
            <Field label="Gut zu wissen" value={order.gut_zu_wissen||""} onChange={upOrder("gut_zu_wissen")} placeholder="z.B. Annahmeschluss 30 Min vor Ende" rows={3} hint="Jede Zeile wird als eigener Hinweis auf Ihrer Website angezeigt (max. 5). Für permanente Infos wie Hygienehinweise, Anfahrt etc."/>
            <Dropdown label="Kontaktformular" value={order.kontakt_formular||"auto"} onChange={upOrder("kontakt_formular")} options={[{value:"auto",label:"Automatisch (je nach Branche)"},{value:"standard",label:"Standard — Name, E-Mail, Nachricht"},{value:"termin",label:"Terminanfrage — mit Wunschtermin & Uhrzeit"},{value:"angebot",label:"Angebotsanfrage — mit Adresse & Beschreibung"},{value:"reservierung",label:"Reservierung — mit Datum, Uhrzeit & Personen"}]} hint="Bestimmt welche Felder Ihr Kontaktformular auf der Website hat"/>
          </div>
          <div style={{background:"#fff",borderRadius:T.r,padding:"24px 28px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1}}>
            <SectionHeader label="Erreichbarkeit & Vor Ort" desc="Zusätzliche Angaben zu Terminvereinbarung, Barrierefreiheit und mehr."/>
            {(()=>{const ft=getBrancheFeatures(order.branche);return<>
            <Field label="Online-Buchungslink" value={order.buchungslink||""} onChange={upOrder("buchungslink")} placeholder="z.B. https://booksy.com/..." hint="Calendly, Booksy, Treatwell – erscheint als eigener Bereich auf der Website" validate={VALIDATORS.url}/>
            <Toggle label="Nur nach Terminvereinbarung" checked={!!order.terminvereinbarung} onChange={upOrder("terminvereinbarung")} desc="Kein Walk-in — nur mit Termin"/>
            <Toggle label="Erstgespräch gratis" checked={!!order.erstgespraech_gratis} onChange={upOrder("erstgespraech_gratis")} desc="Kostenloses Erstgespräch anbieten"/>
            <Toggle label="Online-Beratung" checked={!!order.online_beratung} onChange={upOrder("online_beratung")} desc="Beratung per Videoanruf möglich"/>
            <Toggle label="Hausbesuche" checked={!!order.hausbesuche} onChange={upOrder("hausbesuche")} desc="Ich komme auch zu Ihnen nach Hause"/>
            <div style={{margin:"20px 0 10px",paddingTop:16,borderTop:`1px solid ${T.bg3}`,fontSize:".72rem",fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:".1em"}}>Vor Ort</div>
            <Toggle label="Barrierefrei" checked={!!order.barrierefrei} onChange={upOrder("barrierefrei")} desc="Rollstuhlgerecht zugänglich"/>
            <Toggle label="Parkplätze vorhanden" checked={!!order.parkplaetze} onChange={upOrder("parkplaetze")} desc="Eigene Parkplätze für Kunden"/>
            <Toggle label="Kartenzahlung" checked={!!order.kartenzahlung} onChange={upOrder("kartenzahlung")} desc="Bankomat- oder Kreditkarte"/>
            {ft.includes("gastgarten")&&<Toggle label="Gastgarten / Terrasse" checked={!!order.gastgarten} onChange={upOrder("gastgarten")} desc="Sitzplätze im Freien"/>}
            {ft.includes("takeaway")&&<Toggle label="Take-away / Abholung" checked={!!order.takeaway} onChange={upOrder("takeaway")} desc="Speisen zum Mitnehmen"/>}
            {ft.includes("lieferservice")&&<Toggle label="Lieferservice" checked={!!order.lieferservice} onChange={upOrder("lieferservice")} desc="Lieferung direkt zu Ihnen"/>}
            </>;})()}
          </div>
        </>}
        {page==="leistungen"&&<><div style={{background:"#fff",borderRadius:T.r,padding:"24px 28px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1}}>
          <SectionHeader label="Leistungen" desc="Ihre Leistungen werden mit Bild, Beschreibung und Preis auf der Website angezeigt. Detaillierte Angaben führen zu mehr Anfragen." aiField="leistungen_beschreibungen"/>
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
                  <textarea value={(order.leistungen_beschreibungen||{})[l]||""} onChange={e=>{const m={...(order.leistungen_beschreibungen||{})};m[l]=e.target.value;upOrder("leistungen_beschreibungen")(m);}} onBlur={async(e)=>{const m={...(order.leistungen_beschreibungen||{})};m[l]=e.target.value;if(supabase&&order?.id)await supabase.from("orders").update({leistungen_beschreibungen:m}).eq("id",order.id);}} placeholder="Kurze Beschreibung (optional)" rows={2} style={{width:"100%",padding:"9px 12px",border:"none",borderBottom:`1px solid ${T.bg3}`,resize:"none",fontSize:".82rem",fontFamily:T.font,background:"#fafafa",color:T.dark,outline:"none",boxSizing:"border-box",lineHeight:1.5}}/>
                  <input value={(order.leistungen_preise||{})[l]||""} onChange={e=>{const m={...(order.leistungen_preise||{})};m[l]=e.target.value;upOrder("leistungen_preise")(m);}} onBlur={async(e)=>{const m={...(order.leistungen_preise||{})};m[l]=e.target.value;if(supabase&&order?.id)await supabase.from("orders").update({leistungen_preise:m}).eq("id",order.id);}} placeholder={"Preis (z.B. ab €80) – optional"} style={{width:"100%",padding:"8px 12px",border:"none",borderBottom:`1px solid ${T.bg3}`,fontSize:".82rem",fontFamily:T.font,background:"#fff",color:T.dark,outline:"none",boxSizing:"border-box"}}/>
                  <div style={{padding:"8px 12px",display:"flex",alignItems:"center",gap:10}}>
                    {(order.leistungen_fotos||{})[l]?(<>
                      <img src={(order.leistungen_fotos||{})[l]} alt="" style={{width:52,height:38,objectFit:"cover",borderRadius:4,border:`1px solid ${T.bg3}`}}/>
                      <span style={{flex:1,fontSize:".78rem",color:T.green,fontWeight:600}}>Foto zugewiesen</span>
                      <button onClick={async()=>{const m={...(order.leistungen_fotos||{})};delete m[l];await supabase.from("orders").update({leistungen_fotos:m}).eq("id",order.id);setOrder(o=>({...o,leistungen_fotos:m}));showToast("Foto entfernt");}} style={{padding:"4px 10px",border:`1px solid #fca5a5`,borderRadius:4,background:"#fff",color:"#ef4444",cursor:"pointer",fontSize:".72rem",fontWeight:600,fontFamily:T.font}}>Entfernen</button>
                    </>):(<label style={{display:"flex",alignItems:"center",gap:6,padding:"4px 12px",border:`1.5px dashed ${T.bg3}`,borderRadius:4,cursor:"pointer",fontSize:".78rem",fontWeight:600,color:T.textSub,flex:1,justifyContent:"center"}}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                      Foto hinzufügen
                      <input type="file" accept="image/*" style={{display:"none"}} onChange={e=>{const file=e.target.files?.[0];if(!file)return;const leistName=l;const idx=i;setCropData({key:`leist${idx+1}`,file,onCrop:async(blob)=>{const path=`${session.user.id}/leistfoto_${idx}.jpg`;const{error:upErr}=await supabase.storage.from("customer-assets").upload(path,blob,{upsert:true,contentType:"image/jpeg"});if(upErr){showToast("Upload fehlgeschlagen");return;}const{data}=supabase.storage.from("customer-assets").getPublicUrl(path);const m={...(order.leistungen_fotos||{})};m[leistName]=data.publicUrl;await supabase.from("orders").update({leistungen_fotos:m}).eq("id",order.id);setOrder(o=>({...o,leistungen_fotos:m}));showToast("Foto hochgeladen!");}});}}/>
                    </label>)}
                  </div>
                </div>
              ))}
            </div>}
            <div style={{marginBottom:16}}>
              <div style={{fontSize:".72rem",fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:".1em",marginBottom:10}}>{"Zusätzliche Leistungen"}</div>
              {(order.extra_leistung?.split("\n")||[]).map((item,i,arr)=>(
                <div key={i} style={{marginBottom:8,background:"#fff",border:`1px solid ${T.bg3}`,borderRadius:T.rSm,overflow:"hidden"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,padding:"8px 12px",borderBottom:`1px solid ${T.bg3}`}}>
                    <input value={item} onChange={e=>{const a=[...(order.extra_leistung?.split("\n")||[])];a[i]=e.target.value;upOrder("extra_leistung")(a.join("\n"));}} placeholder="Name der Leistung" style={{flex:1,padding:"4px 0",border:"none",fontSize:".88rem",fontWeight:700,fontFamily:T.font,background:"transparent",color:T.dark,outline:"none"}}/>
                    <button onClick={()=>askDelete("Leistung",()=>{const a=[...(order.extra_leistung?.split("\n")||[])];upOrder("extra_leistung")(a.filter((_,j)=>j!==i).join("\n"));})} style={{width:24,height:24,border:"1.5px solid #fca5a5",borderRadius:4,background:"#fff",color:"#ef4444",cursor:"pointer",fontSize:".82rem",fontWeight:700,fontFamily:T.font,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{"×"}</button>
                  </div>
                  <textarea value={(order.leistungen_beschreibungen||{})[item]||""} onChange={e=>{const m={...(order.leistungen_beschreibungen||{})};m[item]=e.target.value;upOrder("leistungen_beschreibungen")(m);}} onBlur={async(e)=>{const m={...(order.leistungen_beschreibungen||{})};m[item]=e.target.value;if(supabase&&order?.id)await supabase.from("orders").update({leistungen_beschreibungen:m}).eq("id",order.id);}} placeholder="Kurze Beschreibung (optional)" rows={2} style={{width:"100%",padding:"9px 12px",border:"none",borderBottom:`1px solid ${T.bg3}`,resize:"none",fontSize:".82rem",fontFamily:T.font,background:"#fafafa",color:T.dark,outline:"none",boxSizing:"border-box",lineHeight:1.5}}/>
                  <input value={(order.leistungen_preise||{})[item]||""} onChange={e=>{const m={...(order.leistungen_preise||{})};m[item]=e.target.value;upOrder("leistungen_preise")(m);}} onBlur={async(e)=>{const m={...(order.leistungen_preise||{})};m[item]=e.target.value;if(supabase&&order?.id)await supabase.from("orders").update({leistungen_preise:m}).eq("id",order.id);}} placeholder={"Preis (z.B. ab €80) – optional"} style={{width:"100%",padding:"8px 12px",border:"none",borderBottom:`1px solid ${T.bg3}`,fontSize:".82rem",fontFamily:T.font,background:"#fff",color:T.dark,outline:"none",boxSizing:"border-box"}}/>
                  <div style={{padding:"8px 12px",display:"flex",alignItems:"center",gap:10}}>
                    {(order.leistungen_fotos||{})[item]?(<>
                      <img src={(order.leistungen_fotos||{})[item]} alt="" style={{width:52,height:38,objectFit:"cover",borderRadius:4,border:`1px solid ${T.bg3}`}}/>
                      <span style={{flex:1,fontSize:".78rem",color:T.green,fontWeight:600}}>Foto zugewiesen</span>
                      <button onClick={async()=>{const m={...(order.leistungen_fotos||{})};delete m[item];await supabase.from("orders").update({leistungen_fotos:m}).eq("id",order.id);setOrder(o=>({...o,leistungen_fotos:m}));showToast("Foto entfernt");}} style={{padding:"4px 10px",border:`1px solid #fca5a5`,borderRadius:4,background:"#fff",color:"#ef4444",cursor:"pointer",fontSize:".72rem",fontWeight:600,fontFamily:T.font}}>Entfernen</button>
                    </>):(<label style={{display:"flex",alignItems:"center",gap:6,padding:"4px 12px",border:`1.5px dashed ${T.bg3}`,borderRadius:4,cursor:"pointer",fontSize:".78rem",fontWeight:600,color:T.textSub,flex:1,justifyContent:"center"}}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                      Foto hinzufügen
                      <input type="file" accept="image/*" style={{display:"none"}} onChange={e=>{const file=e.target.files?.[0];if(!file)return;const leistName=item;const idx2=(order.leistungen||[]).length+i;setCropData({key:`leist${idx2+1}`,file,onCrop:async(blob)=>{const path=`${session.user.id}/leistfoto_${idx2}.jpg`;const{error:upErr}=await supabase.storage.from("customer-assets").upload(path,blob,{upsert:true,contentType:"image/jpeg"});if(upErr){showToast("Upload fehlgeschlagen");return;}const{data}=supabase.storage.from("customer-assets").getPublicUrl(path);const m={...(order.leistungen_fotos||{})};m[leistName]=data.publicUrl;await supabase.from("orders").update({leistungen_fotos:m}).eq("id",order.id);setOrder(o=>({...o,leistungen_fotos:m}));showToast("Foto hochgeladen!");}});}}/>
                    </label>)}
                  </div>
                </div>
              ))}
              <button onClick={()=>{const a=[...(order.extra_leistung?.split("\n")||[])];upOrder("extra_leistung")([...a,""].join("\n"));}} style={{marginTop:4,padding:"8px 16px",border:`2px dashed ${T.bg3}`,borderRadius:T.rSm,background:"#fff",color:T.textSub,cursor:"pointer",fontSize:".8rem",fontWeight:600,fontFamily:T.font,width:"100%"}}>{"+ Leistung hinzufügen"}</button>
            </div>
            {/* Downloads (PDFs, Preislisten etc.) */}
            <div style={{marginBottom:16}}>
              <div style={{fontSize:".72rem",fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:".1em",marginBottom:4}}>Downloads</div>
              <div style={{fontSize:".75rem",color:T.textMuted,marginBottom:12}}>Verlinken Sie Dokumente wie Speisekarte, Preisliste oder Broschüre. Erscheint unter den Leistungen.</div>
              {(order.downloads||[]).map((dl,i)=>(
                <div key={i} style={{display:"flex",gap:8,marginBottom:8,alignItems:"center"}}>
                  <input value={dl.label||""} onChange={e=>{const arr=[...(order.downloads||[])];arr[i]={...arr[i],label:e.target.value};upOrder("downloads")(arr);}} placeholder="Bezeichnung (z.B. Speisekarte)" style={{flex:1,padding:"8px 12px",border:`1.5px solid ${T.bg3}`,borderRadius:T.rSm,fontSize:".82rem",fontFamily:T.font,color:T.dark,background:"#fff"}}/>
                  <input value={dl.url||""} onChange={e=>{const arr=[...(order.downloads||[])];arr[i]={...arr[i],url:e.target.value};upOrder("downloads")(arr);}} placeholder="Link (https://...)" style={{flex:2,padding:"8px 12px",border:`1.5px solid ${T.bg3}`,borderRadius:T.rSm,fontSize:".82rem",fontFamily:T.font,color:T.dark,background:"#fff"}}/>
                  <button onClick={()=>{const arr=[...(order.downloads||[])].filter((_,j)=>j!==i);upOrder("downloads")(arr.length?arr:null);}} style={{width:28,height:28,border:"1.5px solid #fca5a5",borderRadius:4,background:"#fff",color:"#ef4444",cursor:"pointer",fontSize:".82rem",fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{"×"}</button>
                </div>
              ))}
              {(order.downloads||[]).length<3&&<button onClick={()=>{const arr=[...(order.downloads||[]),{label:"",url:""}];upOrder("downloads")(arr);}} style={{padding:"8px 16px",border:`2px dashed ${T.bg3}`,borderRadius:T.rSm,background:"#fff",color:T.textSub,cursor:"pointer",fontSize:".8rem",fontWeight:600,fontFamily:T.font,width:"100%"}}>{"+ Download hinzufügen"}</button>}
            </div>
        </div>
        <div style={{background:"#fff",borderRadius:T.r,padding:"24px 28px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1,marginTop:16}}>
          <SectionHeader label="CTA-Block" desc="Aufruf zum Handeln — erscheint auf der Website direkt nach den Leistungen." aiField="cta_block" onRemove={async()=>{const newAi=(order.ai_generated||[]).filter(f=>f!=="cta_block");await supabase.from("orders").update({cta_headline:null,cta_text:null,ai_generated:newAi}).eq("id",order.id);setOrder(o=>({...o,cta_headline:"",cta_text:"",ai_generated:newAi}));if(originalOrderRef.current)originalOrderRef.current={...originalOrderRef.current,cta_headline:"",cta_text:"",ai_generated:newAi};showToast("CTA-Text entfernt");}}/>
          <VisibilityToggle field="cta_block" labelOn="CTA-Block erscheint auf Ihrer Website" labelOff="CTA-Block wird nicht angezeigt"/>
          {(()=>{const def=getCtaDefault(order.branche);return(
          <div style={{opacity:order.sections_visible?.cta_block===false?0.55:1,transition:"opacity .2s"}}>
            <Field label="Headline" value={order.cta_headline||""} onChange={upOrder("cta_headline")} placeholder={def.h}/>
            <Field label="Text" value={order.cta_text||""} onChange={upOrder("cta_text")} placeholder={def.t}/>
          </div>
          );})()}
        </div>
        </>}
        {page==="ueberuns"&&<div style={{background:"#fff",borderRadius:T.r,padding:"20px 24px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1,marginBottom:16}}>
            <VariantenHint label="Team-Variante" value={order?.varianten_cache?.team}/>
        </div>}
        {page==="ueberuns"&&<div style={{background:"#fff",borderRadius:T.r,padding:"24px 28px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1}}>
          <SectionHeader label="Über uns & Vorteile" desc="Ihr persönlicher Vorstellungstext und Ihre Stärken. Der Text wurde automatisch erstellt — Sie können ihn jederzeit anpassen." aiField="text_ueber_uns"/>
          <Field label={"Über uns"} value={order.text_ueber_uns||""} onChange={upOrder("text_ueber_uns")} rows={3} hint={"Kurzer Vorstellungstext im Über-uns Bereich"} required/>
          <div style={{marginBottom:4,marginTop:4,fontSize:".78rem",fontWeight:700,color:T.textSub,letterSpacing:".03em"}}>{"Vorteile (werden als Liste angezeigt)"}</div>
          {isAiGen("text_vorteile")&&(order.text_vorteile||[]).some(v=>v)&&<div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8,padding:"8px 12px",background:T.amberLight,borderRadius:T.rSm,border:`1px solid ${T.amberBorder}`}}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.amberText} strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg><span style={{fontSize:".78rem",fontWeight:600,color:T.amberText}}>Automatisch erstellt — bitte prüfen</span></div>}
          {[0,1,2,3].map(i=>{const ph=["z.B. Über 10 Jahre Erfahrung","z.B. Persönliche Beratung","z.B. Faire Preise","z.B. Flexible Termine"][i];return<Field key={i} label={`Vorteil ${i+1}`} value={(order.text_vorteile||[])[i]||""} onChange={val=>{const a=[...(order.text_vorteile||["","","",""])];a[i]=val;upOrder("text_vorteile")(a);}} placeholder={ph}/>})}
        </div>}
        {page==="ueberuns"&&<div style={{background:"#fff",borderRadius:T.r,padding:"24px 28px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1,marginTop:16}}>
          <SectionHeader label="Team" desc="Stellen Sie Ihr Team vor — Name, Rolle und optional ein Foto. Erscheint auf der Website im Über-uns-Bereich."/>
          {!(order.team_members||[]).length&&<div style={{padding:"16px 0 8px",fontSize:".82rem",color:T.textMuted,textAlign:"center"}}>Noch keine Teammitglieder hinzugefügt.</div>}
          {(order.team_members||[]).map((m,i)=>(
            <div key={i} style={{marginBottom:10,background:"#fff",border:`1px solid ${T.bg3}`,borderRadius:T.rSm,overflow:"hidden"}}>
              <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px"}}>
                {m.foto?(<img src={m.foto} alt="" style={{width:40,height:40,borderRadius:"50%",objectFit:"cover",border:`1px solid ${T.bg3}`}}/>):(<div style={{width:40,height:40,borderRadius:"50%",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.textMuted} strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>)}
                <div style={{flex:1}}>
                  <input value={m.name||""} onChange={e=>{const a=[...(order.team_members||[])];a[i]={...a[i],name:e.target.value};upOrder("team_members")(a);}} placeholder="Name" style={{width:"100%",padding:"3px 0",border:"none",fontSize:".88rem",fontWeight:700,fontFamily:T.font,background:"transparent",color:T.dark,outline:"none"}}/>
                  <input value={m.rolle||""} onChange={e=>{const a=[...(order.team_members||[])];a[i]={...a[i],rolle:e.target.value};upOrder("team_members")(a);}} placeholder="Rolle (z.B. Geschäftsführer)" style={{width:"100%",padding:"2px 0",border:"none",fontSize:".78rem",fontFamily:T.font,background:"transparent",color:T.textMuted,outline:"none"}}/>
                  <input value={m.email||""} onChange={e=>{const a=[...(order.team_members||[])];a[i]={...a[i],email:e.target.value};upOrder("team_members")(a);}} placeholder="E-Mail (optional)" style={{width:"100%",padding:"2px 0",border:"none",fontSize:".72rem",fontFamily:T.font,background:"transparent",color:T.textMuted,outline:"none"}}/>
                </div>
                <label style={{padding:"5px 10px",border:`1.5px dashed ${T.bg3}`,borderRadius:4,cursor:"pointer",fontSize:".72rem",fontWeight:600,color:T.textSub,flexShrink:0}}>
                  {m.foto?"Ändern":"Foto"}
                  <input type="file" accept="image/*" style={{display:"none"}} onChange={e=>{const file=e.target.files?.[0];if(!file)return;const idx=i;setCropData({key:`team_${idx}`,file,onCrop:async(blob)=>{const path=`${session.user.id}/team_${idx}.jpg`;const{error:upErr}=await supabase.storage.from("customer-assets").upload(path,blob,{upsert:true,contentType:"image/jpeg"});if(upErr){showToast("Upload fehlgeschlagen");return;}const{data}=supabase.storage.from("customer-assets").getPublicUrl(path);const a=[...(order.team_members||[])];a[idx]={...a[idx],foto:data.publicUrl};await supabase.from("orders").update({team_members:a}).eq("id",order.id);setOrder(o=>({...o,team_members:a}));showToast("Foto hochgeladen!");}});}}/>
                </label>
                <button onClick={()=>askDelete("Teammitglied",()=>{const a=[...(order.team_members||[])].filter((_,j)=>j!==i);upOrder("team_members")(a);})} style={{width:24,height:24,border:"1.5px solid #fca5a5",borderRadius:4,background:"#fff",color:"#ef4444",cursor:"pointer",fontSize:".82rem",fontWeight:700,fontFamily:T.font,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{"×"}</button>
              </div>
            </div>
          ))}
          <button onClick={()=>{const a=[...(order.team_members||[]),{name:"",rolle:"",foto:""}];upOrder("team_members")(a);}} style={{marginTop:4,padding:"8px 16px",border:`2px dashed ${T.bg3}`,borderRadius:T.rSm,background:"#fff",color:T.textSub,cursor:"pointer",fontSize:".8rem",fontWeight:600,fontFamily:T.font,width:"100%"}}>{"+ Teammitglied hinzufügen"}</button>
        </div>}
        {page==="ueberuns"&&<div style={{background:"#fff",borderRadius:T.r,padding:"24px 28px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1,marginTop:16}}>
          <SectionHeader label="Ablauf" desc="Zeigen Sie in 3–5 Schritten wie die Zusammenarbeit mit Ihnen abläuft. Mindestens 2 Schritte mit Titel, sonst wird die Section nicht angezeigt." aiField="ablauf_schritte" onRemove={async()=>{await supabase.from("orders").update({ablauf_schritte:null,ai_generated:(order.ai_generated||[]).filter(f=>f!=="ablauf_schritte")}).eq("id",order.id);setOrder(o=>({...o,ablauf_schritte:null,ai_generated:(o.ai_generated||[]).filter(f=>f!=="ablauf_schritte")}));showToast("Ablauf entfernt");}}/>
          <VisibilityToggle field="ablauf" labelOn="Ablauf erscheint auf Ihrer Website" labelOff="Ablauf wird nicht angezeigt" hasContent={(order.ablauf_schritte||[]).filter(s=>s&&s.titel).length>=2} contentHint="Mindestens 2 Ablauf-Schritte mit Titel nötig."/>
          <div style={{opacity:order.sections_visible?.ablauf===false?0.55:1,transition:"opacity .2s"}}>
          {(()=>{const validCount=(order.ablauf_schritte||[]).filter(s=>s&&s.titel).length;return validCount===1&&<div style={{padding:"10px 14px",background:T.amberLight,borderRadius:T.rSm,marginBottom:12,fontSize:".78rem",color:T.amberText,display:"flex",alignItems:"flex-start",gap:8}}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.amberText} strokeWidth="2" style={{flexShrink:0,marginTop:2}}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <div>Sie haben nur 1 Schritt — der Ablauf wird erst ab 2 Schritten auf der Website angezeigt.</div>
          </div>})()}
          {!(order.ablauf_schritte||[]).length&&<div style={{padding:"16px 0 8px",fontSize:".82rem",color:T.textMuted,textAlign:"center"}}>Noch keine Ablaufschritte hinzugefügt.</div>}
          {(order.ablauf_schritte||[]).map((s,i)=>(
            <div key={i} style={{marginBottom:10,background:"#fff",border:`1px solid ${T.bg3}`,borderRadius:T.rSm,overflow:"hidden"}}>
              <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderBottom:`1px solid ${T.bg3}`}}>
                <div style={{width:28,height:28,borderRadius:"50%",background:T.accent,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:".78rem",flexShrink:0}}>{i+1}</div>
                <input value={s.titel||""} onChange={e=>{const a=[...(order.ablauf_schritte||[])];a[i]={...a[i],titel:e.target.value};upOrder("ablauf_schritte")(a);}} placeholder="Schritt-Titel (z.B. Erstgespräch)" style={{flex:1,padding:"3px 0",border:"none",fontSize:".88rem",fontWeight:700,fontFamily:T.font,background:"transparent",color:T.dark,outline:"none"}}/>
                <button onClick={()=>askDelete("Ablaufschritt",()=>{const a=[...(order.ablauf_schritte||[])].filter((_,j)=>j!==i);upOrder("ablauf_schritte")(a);})} style={{width:24,height:24,border:"1.5px solid #fca5a5",borderRadius:4,background:"#fff",color:"#ef4444",cursor:"pointer",fontSize:".82rem",fontWeight:700,fontFamily:T.font,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{"×"}</button>
              </div>
              <input value={s.text||""} onChange={e=>{const a=[...(order.ablauf_schritte||[])];a[i]={...a[i],text:e.target.value};upOrder("ablauf_schritte")(a);}} placeholder="Kurze Beschreibung (optional)" style={{width:"100%",padding:"8px 12px",border:"none",fontSize:".82rem",fontFamily:T.font,background:"#fafafa",color:T.dark,outline:"none",boxSizing:"border-box"}}/>
            </div>
          ))}
          {(order.ablauf_schritte||[]).length<5&&<button onClick={()=>{const a=[...(order.ablauf_schritte||[]),{titel:"",text:""}];upOrder("ablauf_schritte")(a);}} style={{marginTop:4,padding:"8px 16px",border:`2px dashed ${T.bg3}`,borderRadius:T.rSm,background:"#fff",color:T.textSub,cursor:"pointer",fontSize:".8rem",fontWeight:600,fontFamily:T.font,width:"100%"}}>{"+ Schritt hinzufügen"}</button>}
          </div>
        </div>}
        {page==="ueberuns"&&<div style={{background:"#fff",borderRadius:T.r,padding:"24px 28px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1,marginTop:16}}>
          <VariantenHint label="Bewertungen-Variante" value={order?.varianten_cache?.bewertungen}/>
          <SectionHeader label="Kundenbewertungen" desc="Zeigen Sie echte Kundenstimmen auf Ihrer Website. Diese erscheinen als eigener Bereich zwischen Über uns und Kontakt." aiField="bewertungen" onRemove={async()=>{await supabase.from("orders").update({bewertungen:null,ai_generated:(order.ai_generated||[]).filter(f=>f!=="bewertungen")}).eq("id",order.id);setOrder(o=>({...o,bewertungen:null,ai_generated:(o.ai_generated||[]).filter(f=>f!=="bewertungen")}));showToast("Bewertungen entfernt");}}/>
          {!(order.bewertungen||[]).length&&<div style={{padding:"16px 0 8px",fontSize:".82rem",color:T.textMuted,textAlign:"center"}}>Noch keine Bewertungen hinzugefügt.</div>}
          {(order.bewertungen||[]).map((b,i)=>(
            <div key={i} style={{marginBottom:10,background:"#fff",border:`1px solid ${T.bg3}`,borderRadius:T.rSm,overflow:"hidden"}}>
              <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderBottom:`1px solid ${T.bg3}`}}>
                <input value={b.name||""} onChange={e=>{const a=[...(order.bewertungen||[])];a[i]={...a[i],name:e.target.value};upOrder("bewertungen")(a);}} placeholder="Name des Kunden" style={{flex:1,padding:"3px 0",border:"none",fontSize:".88rem",fontWeight:700,fontFamily:T.font,background:"transparent",color:T.dark,outline:"none"}}/>
                <div style={{display:"flex",gap:2}}>{[1,2,3,4,5].map(s=><button key={s} onClick={()=>{const a=[...(order.bewertungen||[])];a[i]={...a[i],sterne:s};upOrder("bewertungen")(a);}} style={{background:"none",border:"none",cursor:"pointer",padding:1,fontSize:"1rem",color:(b.sterne||0)>=s?T.accent:T.bg3}}>&#9733;</button>)}</div>
                <button onClick={()=>askDelete("Bewertung",()=>{const a=[...(order.bewertungen||[])].filter((_,j)=>j!==i);upOrder("bewertungen")(a);})} style={{width:24,height:24,border:"1.5px solid #fca5a5",borderRadius:4,background:"#fff",color:"#ef4444",cursor:"pointer",fontSize:".82rem",fontWeight:700,fontFamily:T.font,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{"×"}</button>
              </div>
              <textarea value={b.text||""} onChange={e=>{const a=[...(order.bewertungen||[])];a[i]={...a[i],text:e.target.value};upOrder("bewertungen")(a);}} placeholder="Was sagt der Kunde über Sie?" rows={2} style={{width:"100%",padding:"9px 12px",border:"none",resize:"none",fontSize:".82rem",fontFamily:T.font,background:"#fafafa",color:T.dark,outline:"none",boxSizing:"border-box",lineHeight:1.5}}/>
            </div>
          ))}
          {(order.bewertungen||[]).length<6&&<button onClick={()=>{const a=[...(order.bewertungen||[]),{name:"",text:"",sterne:5}];upOrder("bewertungen")(a);}} style={{marginTop:4,padding:"8px 16px",border:`2px dashed ${T.bg3}`,borderRadius:T.rSm,background:"#fff",color:T.textSub,cursor:"pointer",fontSize:".8rem",fontWeight:600,fontFamily:T.font,width:"100%"}}>{"+ Bewertung hinzufügen"}</button>}
        </div>}
        {/* ── FAQ Seite ── */}
        {page==="faq"&&<div style={{background:"#fff",borderRadius:T.r,padding:"24px 28px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1}}>
          <SectionHeader label="Häufige Fragen" desc={`Fragen und Antworten, die Ihre ${kundenWort(order.branche)} häufig stellen. Erscheint als aufklappbarer Bereich auf Ihrer Website.`} aiField="faq"/>
          <VisibilityToggle field="faq" labelOn="FAQ erscheint auf Ihrer Website" labelOff="FAQ wird nicht angezeigt" hasContent={(order.faq||[]).some(f=>f&&f.frage&&f.antwort)} contentHint="Mindestens eine vollständige Frage + Antwort nötig."/>
          <div style={{opacity:order.sections_visible?.faq===false?0.55:1,transition:"opacity .2s"}}>
          {(()=>{const incompleteCount=(order.faq||[]).filter(f=>(f.frage&&!f.antwort)||(!f.frage&&f.antwort)).length;return incompleteCount>0&&<div style={{padding:"10px 14px",background:T.amberLight,borderRadius:T.rSm,marginBottom:12,fontSize:".78rem",color:T.amberText,display:"flex",alignItems:"flex-start",gap:8}}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.amberText} strokeWidth="2" style={{flexShrink:0,marginTop:2}}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <div>{incompleteCount===1?"1 Eintrag hat":`${incompleteCount} Eintraege haben`} Frage oder Antwort leer — wird auf der Website nicht angezeigt.</div>
          </div>})()}
          {(order.faq||[]).map((f,i)=>{const incomplete=(f.frage&&!f.antwort)||(!f.frage&&f.antwort);return<div key={i} className="pt-faq-row" style={{display:"grid",gridTemplateColumns:"1fr auto",gap:8,alignItems:"start",marginTop:i?12:0,padding:incomplete?"8px":0,border:incomplete?`1.5px solid ${T.amberBorder}`:"none",borderRadius:incomplete?T.rSm:0,background:incomplete?T.amberLight:"transparent"}}>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              <input value={f.frage||""} onChange={e=>{const arr=[...(order.faq||[])];arr[i]={...arr[i],frage:e.target.value};upOrder("faq")(arr);}} placeholder="Frage" style={{padding:"8px 12px",border:`1.5px solid ${T.bg3}`,borderRadius:T.rSm,fontSize:".82rem",fontFamily:T.font,fontWeight:600}}/>
              <textarea value={f.antwort||""} onChange={e=>{const arr=[...(order.faq||[])];arr[i]={...arr[i],antwort:e.target.value};upOrder("faq")(arr);}} placeholder="Antwort" rows={2} style={{padding:"8px 12px",border:`1.5px solid ${T.bg3}`,borderRadius:T.rSm,fontSize:".82rem",fontFamily:T.font,resize:"vertical"}}/>
            </div>
            <button onClick={()=>askDelete("Frage",()=>{const arr=[...(order.faq||[])];arr.splice(i,1);upOrder("faq")(arr);})} style={{marginTop:8,width:24,height:24,border:"1.5px solid #fca5a5",borderRadius:4,background:"#fff",color:"#ef4444",cursor:"pointer",fontSize:".82rem",fontWeight:700,fontFamily:T.font,display:"flex",alignItems:"center",justifyContent:"center"}}>{"×"}</button>
          </div>})}
          {!(order.faq||[]).length&&<div style={{padding:"28px 20px",margin:"8px 0",background:T.bg,borderRadius:T.rSm,textAlign:"center"}}>
            <div style={{fontSize:"1.8rem",marginBottom:8}}>❓</div>
            <div style={{fontSize:".92rem",fontWeight:700,color:T.dark,marginBottom:4}}>Noch keine Fragen</div>
            <div style={{fontSize:".82rem",color:T.textMuted,lineHeight:1.5,maxWidth:340,margin:"0 auto"}}>Beantworten Sie die Fragen, die Ihre {kundenWort(order.branche)} immer wieder stellen — spart Telefonate und bringt Vertrauen.</div>
          </div>}
          <div style={{display:"flex",gap:8,marginTop:12}}>
            <button onClick={()=>{const arr=[...(order.faq||[]),{frage:"",antwort:""}];upOrder("faq")(arr);}} style={{flex:1,padding:"8px 14px",border:`1.5px dashed ${T.bg3}`,borderRadius:T.rSm,background:"none",color:T.accent,cursor:"pointer",fontSize:".78rem",fontWeight:600,fontFamily:T.font}}>+ Frage hinzufügen</button>
            <button disabled={faqGenerating} onClick={async()=>{
              setFaqGenerating(true);
              try{
                const res=await fetch("/api/generate-faq",{method:"POST",headers:{"Content-Type":"application/json","Authorization":`Bearer ${session?.access_token||""}`},body:JSON.stringify({order_id:order.id})});
                const data=await res.json();
                if(data.faq){upOrder("faq")(data.faq);showToast("FAQ generiert");}
                else{showToast("Fehler: "+(data.error||"Unbekannt"));}
              }catch{showToast("Fehler bei der Generierung");}
              setFaqGenerating(false);
            }} style={{padding:"8px 16px",border:"none",borderRadius:T.rSm,background:faqGenerating?T.bg3:T.dark,color:"#fff",cursor:faqGenerating?"wait":"pointer",fontSize:".78rem",fontWeight:700,fontFamily:T.font,whiteSpace:"nowrap"}}>{faqGenerating?"Generiert...":"Automatisch generieren"}</button>
          </div>
          </div>
        </div>}

        {/* ── Zahlen & Fakten Seite ── */}
        {page==="fakten"&&<div style={{background:"#fff",borderRadius:T.r,padding:"24px 28px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1}}>
          <SectionHeader label="Zahlen & Fakten" desc="Beeindruckende Zahlen über Ihren Betrieb. Mindestens 2 Eintraege, maximal 4."/>
          <VisibilityToggle field="fakten" labelOn="Zahlen & Fakten erscheinen auf Ihrer Website" labelOff="Zahlen & Fakten werden nicht angezeigt" hasContent={(order.fakten||[]).filter(f=>f&&f.zahl).length>=2} contentHint="Mindestens 2 Einträge mit Zahl nötig."/>
          <div style={{opacity:order.sections_visible?.fakten===false?0.55:1,transition:"opacity .2s"}}>
          {(()=>{const validCount=(order.fakten||[]).filter(f=>f&&f.zahl).length;return validCount===1&&<div style={{padding:"10px 14px",background:T.amberLight,borderRadius:T.rSm,marginBottom:12,fontSize:".78rem",color:T.amberText,display:"flex",alignItems:"flex-start",gap:8}}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.amberText} strokeWidth="2" style={{flexShrink:0,marginTop:2}}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <div>Sie haben nur 1 Fakt — die Section wird erst ab 2 Eintraegen auf der Website angezeigt.</div>
          </div>})()}
          <div className="pt-fakten-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {(order.fakten||[]).map((f,i)=><div key={i} style={{display:"flex",gap:8,alignItems:"center",padding:"10px 12px",background:T.bg,borderRadius:T.rSm}}>
              <input value={f.zahl||""} onChange={e=>{const arr=[...(order.fakten||[])];arr[i]={...arr[i],zahl:e.target.value};upOrder("fakten")(arr);}} placeholder="15+" style={{width:60,padding:"6px 8px",border:`1.5px solid ${T.bg3}`,borderRadius:T.rSm,fontSize:".88rem",fontFamily:T.mono,fontWeight:700,textAlign:"center",background:"#fff"}}/>
              <input value={f.label||""} onChange={e=>{const arr=[...(order.fakten||[])];arr[i]={...arr[i],label:e.target.value};upOrder("fakten")(arr);}} placeholder="Jahre Erfahrung" style={{flex:1,padding:"6px 8px",border:`1.5px solid ${T.bg3}`,borderRadius:T.rSm,fontSize:".82rem",fontFamily:T.font,background:"#fff"}}/>
              <button onClick={()=>askDelete("Fakt",()=>{const arr=[...(order.fakten||[])];arr.splice(i,1);upOrder("fakten")(arr);})} style={{width:24,height:24,border:"1.5px solid #fca5a5",borderRadius:4,background:"#fff",color:"#ef4444",cursor:"pointer",fontSize:".82rem",fontWeight:700,fontFamily:T.font,display:"flex",alignItems:"center",justifyContent:"center"}}>{"×"}</button>
            </div>)}
          </div>
          {!(order.fakten||[]).length&&<div style={{padding:"28px 20px",margin:"8px 0",background:T.bg,borderRadius:T.rSm,textAlign:"center"}}>
            <div style={{fontSize:"1.8rem",marginBottom:8}}>📊</div>
            <div style={{fontSize:".92rem",fontWeight:700,color:T.dark,marginBottom:4}}>Noch keine Zahlen</div>
            <div style={{fontSize:".82rem",color:T.textMuted,lineHeight:1.5,maxWidth:340,margin:"0 auto"}}>Beeindruckende Zahlen schaffen Vertrauen — z.B. „25 Jahre Erfahrung" oder „500 zufriedene Kunden". Mindestens 2 Einträge werden angezeigt.</div>
          </div>}
          {(order.fakten||[]).length<4&&<button onClick={()=>{const arr=[...(order.fakten||[]),{zahl:"",label:""}];upOrder("fakten")(arr);}} style={{marginTop:8,padding:"8px 14px",border:`1.5px dashed ${T.bg3}`,borderRadius:T.rSm,background:"none",color:T.accent,cursor:"pointer",fontSize:".78rem",fontWeight:600,fontFamily:T.font,width:"100%"}}>+ Fakt hinzufügen {(order.fakten||[]).length>0?`(${(order.fakten||[]).length}/4)`:""}</button>}
          </div>
        </div>}

        {/* ── Partner & Zertifikate Seite ── */}
        {page==="partner"&&<div style={{background:"#fff",borderRadius:T.r,padding:"24px 28px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1}}>
          <SectionHeader label="Vertrauen & Referenzen" desc="Kunden, Partner, Zertifikate oder Verbände — alles was Vertrauen schafft. Logo und Link sind optional."/>
          <VisibilityToggle field="partner" labelOn="Referenzen erscheinen auf Ihrer Website" labelOff="Referenzen werden nicht angezeigt" hasContent={(order.partner||[]).some(p=>p&&(p.url_logo||p.name))} contentHint="Mindestens ein Referenz-Eintrag (Logo oder Name) nötig."/>
          <div style={{opacity:order.sections_visible?.partner===false?0.55:1,transition:"opacity .2s"}}>
          {(order.partner||[]).map((p,i)=>(<div key={i} style={{marginTop:i?10:0,display:"flex",gap:12,padding:"12px 14px",border:`1.5px solid ${T.bg3}`,borderRadius:T.rSm,background:T.bg,alignItems:"center"}}>
            {/* Logo-Vorschau oder Upload (optional) */}
            <div style={{width:56,height:56,borderRadius:T.rSm,border:`1.5px dashed ${T.bg3}`,background:"#fff",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,overflow:"hidden",cursor:"pointer",position:"relative"}} onClick={()=>document.getElementById(`ref-upload-${i}`)?.click()} title={p.url_logo?"Logo ersetzen":"Logo hochladen (optional)"}>
              {p.url_logo
                ? <img src={p.url_logo} alt="" style={{width:"100%",height:"100%",objectFit:"contain",padding:4}}/>
                : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T.textMuted} strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>}
              <input id={`ref-upload-${i}`} type="file" accept="image/*" style={{display:"none"}} onChange={e=>{if(e.target.files?.[0])upload(`ref_${i}`,e.target.files[0]);}}/>
            </div>
            <div style={{flex:1,display:"flex",flexDirection:"column",gap:6}}>
              <input value={p.name||""} onChange={e=>{const arr=[...(order.partner||[])];arr[i]={...arr[i],name:e.target.value};upOrder("partner")(arr);}} placeholder="z.B. Red Bull, WKO, TÜV, Ärztekammer" style={{padding:"7px 10px",border:`1.5px solid ${T.bg3}`,borderRadius:T.rSm,fontSize:".82rem",fontFamily:T.font,background:"#fff"}}/>
              <input value={p.link||""} onChange={e=>{const arr=[...(order.partner||[])];arr[i]={...arr[i],link:e.target.value};upOrder("partner")(arr);}} placeholder="Link (optional, z.B. https://...)" style={{padding:"6px 10px",border:`1.5px solid ${T.bg3}`,borderRadius:T.rSm,fontSize:".76rem",fontFamily:T.font,background:"#fff",color:T.textSub}}/>
              {uploading[`ref_${i}`]&&<div style={{fontSize:".72rem",color:T.accent}}>Logo wird hochgeladen...</div>}
            </div>
            <button onClick={()=>askDelete("Eintrag",()=>{const arr=[...(order.partner||[])];arr.splice(i,1);upOrder("partner")(arr);})} style={{width:24,height:24,border:"1.5px solid #fca5a5",borderRadius:4,background:"#fff",color:"#ef4444",cursor:"pointer",fontSize:".82rem",fontWeight:700,fontFamily:T.font,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{"×"}</button>
          </div>))}
          {!(order.partner||[]).length&&<div style={{padding:"28px 20px",margin:"8px 0",background:T.bg,borderRadius:T.rSm,textAlign:"center"}}>
            <div style={{fontSize:"1.8rem",marginBottom:8}}>🤝</div>
            <div style={{fontSize:".92rem",fontWeight:700,color:T.dark,marginBottom:4}}>Noch keine Einträge</div>
            <div style={{fontSize:".82rem",color:T.textMuted,lineHeight:1.5,maxWidth:340,margin:"0 auto"}}>Zeigen Sie, wer Ihnen vertraut — Kunden, Partner oder Zertifizierungen. Einträge mit Logo erscheinen besonders prominent.</div>
          </div>}
          <button onClick={()=>{const arr=[...(order.partner||[]),{name:""}];upOrder("partner")(arr);}} style={{marginTop:10,padding:"10px 14px",border:`1.5px dashed ${T.bg3}`,borderRadius:T.rSm,background:"none",color:T.accent,cursor:"pointer",fontSize:".82rem",fontWeight:600,fontFamily:T.font,width:"100%"}}>+ Eintrag hinzufügen</button>
          <div style={{fontSize:".72rem",color:T.textMuted,marginTop:10,lineHeight:1.5}}>Einträge mit Logo erscheinen als Logo-Grid. Einträge ohne Logo werden als dezente Text-Zeile darunter angezeigt.</div>
          </div>
        </div>}

        {page==="design"&&(()=>{
          const s=STYLES_MAP[order.stil||"klassisch"]||STYLES_MAP.klassisch;
          const dv=(k,fallback)=>order[k]||fallback;
          const FONT_OPTIONS=[
            {value:"",label:"Standard (vom Stil)"},{value:"dm_sans",label:"DM Sans"},{value:"inter",label:"Inter"},{value:"outfit",label:"Outfit"},{value:"poppins",label:"Poppins"},{value:"montserrat",label:"Montserrat"},{value:"raleway",label:"Raleway"},{value:"open_sans",label:"Open Sans"},{value:"lato",label:"Lato"},{value:"roboto",label:"Roboto"},{value:"nunito",label:"Nunito"},{value:"work_sans",label:"Work Sans"},{value:"manrope",label:"Manrope"},{value:"space_grotesk",label:"Space Grotesk"},{value:"plus_jakarta",label:"Plus Jakarta Sans"},{value:"rubik",label:"Rubik"},{value:"source_serif",label:"Source Serif (Serif)"},{value:"playfair",label:"Playfair Display (Serif)"},{value:"lora",label:"Lora (Serif)"},{value:"merriweather",label:"Merriweather (Serif)"},{value:"dm_serif",label:"DM Serif Display (Serif)"},
          ];
          const RADIUS_OPTIONS=[{value:"",label:"Standard (vom Stil)"},{value:"0px",label:"Eckig (0px)"},{value:"4px",label:"Leicht gerundet (4px)"},{value:"8px",label:"Gerundet (8px)"},{value:"12px",label:"Stark gerundet (12px)"},{value:"16px",label:"Sehr rund (16px)"}];
          const brGruppe=(()=>{const br=BRANCHEN.find(x=>x.value===order.branche);return br?br.gruppe:null})();
          const PALETTES=[
            {name:"Standard",desc:"Branchenfarben",colors:brGruppe&&GRUPPEN_PALETTEN[brGruppe]?GRUPPEN_PALETTEN[brGruppe]:{custom_color:null,custom_accent:null,custom_bg:null,custom_text:null,custom_text_muted:null,custom_sep:null}},
            {name:"Werkstatt",desc:"Gold auf Hellgrau",colors:GRUPPEN_PALETTEN.handwerk},
            {name:"Atelier",desc:"Peach + Waldgrün",colors:GRUPPEN_PALETTEN.kosmetik},
            {name:"Tafel",desc:"Sienna + Bordeaux",colors:GRUPPEN_PALETTEN.gastro},
            {name:"Praxis",desc:"Teal + Petrol",colors:GRUPPEN_PALETTEN.gesundheit},
            {name:"Kanzlei",desc:"Olive-Gold + Dunkelgrün",colors:GRUPPEN_PALETTEN.dienstleistung},
            {name:"Campus",desc:"Indigo + Nachtblau",colors:GRUPPEN_PALETTEN.bildung},
          ];
          const applyPalette=(p)=>{Object.entries(p.colors).forEach(([k,v])=>upOrder(k)(v));};
          const hasCustom=order.custom_color||order.custom_accent||order.custom_bg||order.custom_text||order.custom_text_muted||order.custom_sep||order.custom_font||order.custom_radius;
          const ColorPicker=({label,hint,field,fallback})=>(
            <div>
              <label style={{display:"block",fontSize:".85rem",fontWeight:700,color:T.textSub,marginBottom:8}}>{label}</label>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <input type="color" value={dv(field,fallback)} onChange={e=>upOrder(field)(e.target.value)} style={{width:40,height:40,border:`2px solid ${T.bg3}`,borderRadius:T.rSm,cursor:"pointer",padding:2}}/>
                <div style={{flex:1}}>
                  <input value={dv(field,fallback)} maxLength={7} onChange={e=>{const v=e.target.value;if(/^#[0-9A-Fa-f]{0,6}$/.test(v))upOrder(field)(v.length===7?v:v);}} style={{fontSize:".82rem",fontWeight:600,color:T.dark,fontFamily:T.mono,border:`1.5px solid ${T.bg3}`,borderRadius:T.rSm,padding:"4px 8px",width:90,background:T.white}}/>
                  <div style={{fontSize:".78rem",color:T.textMuted,marginTop:2}}>{hint}</div>
                </div>
              </div>
            </div>
          );
          const currentAccent=order.custom_accent||BRANCHEN_ACCENTS[order.branche]||s.accent;
          return<div style={{display:"flex",flexDirection:"column",gap:16}}>
          <div style={{background:"#fff",borderRadius:T.r,padding:"24px 28px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1}}>
            <SectionHeader label="Design & Farben" desc="Stil und Akzentfarbe sind unabhängig — ändern Sie eins, ohne das andere zu verlieren."/>

              {/* Stil & Vorschau als ein zusammenhaengender Block — Stil-Cards oben,
                  Live-Preview darunter in kompaktem Browser-Chrome-Rahmen. */}
              <div style={{marginBottom:28}}>
                <div style={{fontSize:".72rem",fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:".1em",marginBottom:12}}>Stil & Vorschau</div>

                {/* Aufgewertete Stil-Cards mit Mini-Mockup (Farbe + Aa-Sample + Akzentlinie) */}
                <div className="pt-stil-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:14}}>
                  {Object.entries(STYLES_MAP).map(([key,st])=>{
                    const active=order.stil===key;
                    const previewing=stilPreview===key;
                    const stilFont=key==="modern"?"'Plus Jakarta Sans',system-ui,sans-serif":key==="elegant"?"'Cormorant Garamond',Georgia,serif":"'Merriweather',Georgia,serif";
                    const aaWeight=key==="elegant"?500:700;
                    return<button key={key} onClick={()=>setStilPreview(key)} aria-pressed={previewing||active} style={{padding:0,border:active?`2px solid ${T.dark}`:previewing?`2px solid ${T.accent}`:`1.5px solid ${T.bg3}`,borderRadius:T.rSm,background:"#fff",cursor:"pointer",fontFamily:T.font,transition:"all .2s",boxShadow:active||previewing?"0 4px 14px rgba(0,0,0,.06)":"none",position:"relative",overflow:"hidden"}}>
                      {/* Mini-Mockup: Gradient-Streifen + Aa-Sample + Akzent-Linie */}
                      <div style={{height:72,background:st.heroGradient,position:"relative",display:"flex",alignItems:"center",justifyContent:"center"}}>
                        <div style={{fontFamily:stilFont,fontSize:34,fontWeight:aaWeight,color:"#fff",letterSpacing:key==="modern"?"-.02em":key==="elegant"?"-.01em":"0",lineHeight:1}}>Aa</div>
                        <div style={{position:"absolute",bottom:10,left:"50%",transform:"translateX(-50%)",width:key==="elegant"?24:key==="modern"?36:28,height:key==="elegant"?1:key==="modern"?3:2,background:st.accent,opacity:key==="elegant"?.7:1,borderRadius:key==="modern"?100:0}}/>
                      </div>
                      <div style={{padding:"12px 14px 14px",textAlign:"left"}}>
                        <div style={{fontSize:".85rem",fontWeight:700,color:T.dark,marginBottom:2}}>{st.label}</div>
                        <div style={{fontSize:".72rem",color:T.textMuted,lineHeight:1.45}}>{st.desc}</div>
                      </div>
                      {active&&<div style={{position:"absolute",top:8,right:8,width:20,height:20,borderRadius:"50%",background:T.dark,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,boxShadow:"0 2px 6px rgba(0,0,0,.3)"}}>{"✓"}</div>}
                    </button>
                  })}
                </div>

                {/* Live-Preview mit Browser-Chrome-Rahmen und Fullscreen-Button */}
                <div style={{position:"relative",borderRadius:T.rSm,overflow:"hidden",border:`1px solid ${T.bg3}`,background:"#fff",boxShadow:"0 2px 8px rgba(0,0,0,.04)"}}>
                  {/* Browser-Chrome */}
                  <div style={{height:28,background:"#f5f5f2",borderBottom:`1px solid ${T.bg3}`,display:"flex",alignItems:"center",padding:"0 10px",gap:6,position:"relative"}}>
                    <div style={{display:"flex",gap:5}}>
                      <div style={{width:8,height:8,borderRadius:"50%",background:"#E87356"}}/>
                      <div style={{width:8,height:8,borderRadius:"50%",background:"#E8BC56"}}/>
                      <div style={{width:8,height:8,borderRadius:"50%",background:"#6DB176"}}/>
                    </div>
                    <div style={{position:"absolute",left:"50%",transform:"translateX(-50%)",fontSize:".68rem",color:T.textMuted,fontFamily:T.mono,maxWidth:"60%",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{sub}.siteready.at — {STYLES_MAP[stilPreview||order.stil]?.label}</div>
                    <button onClick={()=>setStilPreviewFullscreen(true)} aria-label="Vollbild-Vorschau oeffnen" title="Vollbild" style={{position:"absolute",right:6,top:4,background:"none",border:"none",padding:"3px 6px",cursor:"pointer",color:T.textMuted,borderRadius:3,display:"flex",alignItems:"center"}} onMouseOver={e=>e.currentTarget.style.background="rgba(0,0,0,.06)"} onMouseOut={e=>e.currentTarget.style.background="none"}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
                    </button>
                  </div>
                  {/* iframe */}
                  <div style={{height:340,background:"#fff"}}>
                    <iframe
                      key={(stilPreview||order.stil)+"|"+sub}
                      src={`/s/${sub}?preview=${stilPreview||order.stil||"klassisch"}`}
                      title="Stil-Vorschau"
                      style={{width:"100%",height:"100%",border:"none",display:"block"}}
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* Action-Bar: nur sichtbar wenn Preview von aktuellem Stil abweicht */}
                {stilPreview&&stilPreview!==order.stil&&<div style={{marginTop:10,padding:"10px 14px",background:T.amberLight,border:`1px solid ${T.amberBorder}`,borderRadius:T.rSm,display:"flex",alignItems:"center",justifyContent:"space-between",gap:10,flexWrap:"wrap"}}>
                  <div style={{fontSize:".78rem",color:"#78350f"}}>Vorschau: <strong>{STYLES_MAP[stilPreview]?.label}</strong> — noch nicht übernommen</div>
                  <div style={{display:"flex",gap:6}}>
                    <button onClick={()=>setStilPreview(null)} style={{padding:"7px 14px",border:`1.5px solid ${T.bg3}`,borderRadius:T.rSm,background:"#fff",color:T.textSub,cursor:"pointer",fontSize:".78rem",fontWeight:600,fontFamily:T.font}}>Zurücksetzen</button>
                    <button onClick={()=>{const key=stilPreview;upOrder("stil")(key);const acc=order.custom_accent||BRANCHEN_ACCENTS[order.branche]||"#0369A1";const pal=buildPaletteFromAccent(ensureContrast(acc),key);Object.entries(pal).forEach(([k,v])=>upOrder(k)(v));setStilPreview(null);showToast("Stil übernommen");}} style={{padding:"7px 16px",border:"none",borderRadius:T.rSm,background:T.dark,color:"#fff",cursor:"pointer",fontSize:".78rem",fontWeight:700,fontFamily:T.font}}>Übernehmen</button>
                  </div>
                </div>}
              </div>

              {/* Fullscreen-Overlay fuer Preview */}
              {stilPreviewFullscreen&&<div onClick={()=>setStilPreviewFullscreen(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.72)",zIndex:9998,display:"flex",alignItems:"center",justifyContent:"center",padding:32}}>
                <div onClick={e=>e.stopPropagation()} style={{width:"100%",height:"100%",maxWidth:1400,background:"#fff",borderRadius:T.rSm,overflow:"hidden",position:"relative",boxShadow:"0 40px 120px rgba(0,0,0,.5)"}}>
                  <div style={{height:32,background:"#f5f5f2",borderBottom:`1px solid ${T.bg3}`,display:"flex",alignItems:"center",padding:"0 12px",gap:8,position:"relative"}}>
                    <div style={{display:"flex",gap:6}}>
                      <div style={{width:10,height:10,borderRadius:"50%",background:"#E87356"}}/>
                      <div style={{width:10,height:10,borderRadius:"50%",background:"#E8BC56"}}/>
                      <div style={{width:10,height:10,borderRadius:"50%",background:"#6DB176"}}/>
                    </div>
                    <div style={{position:"absolute",left:"50%",transform:"translateX(-50%)",fontSize:".78rem",color:T.textSub,fontFamily:T.mono}}>{sub}.siteready.at — {STYLES_MAP[stilPreview||order.stil]?.label}</div>
                    <button onClick={()=>setStilPreviewFullscreen(false)} aria-label="Vollbild schliessen" style={{position:"absolute",right:8,background:"none",border:"none",padding:6,cursor:"pointer",color:T.textSub,borderRadius:4,display:"flex"}} onMouseOver={e=>e.currentTarget.style.background="rgba(0,0,0,.06)"} onMouseOut={e=>e.currentTarget.style.background="none"}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                  </div>
                  <iframe
                    key={"fs|"+(stilPreview||order.stil)+"|"+sub}
                    src={`/s/${sub}?preview=${stilPreview||order.stil||"klassisch"}`}
                    title="Stil-Vorschau (Vollbild)"
                    style={{width:"100%",height:"calc(100% - 32px)",border:"none",display:"block"}}
                  />
                </div>
              </div>}

              {/* Akzentfarbe */}
              <div style={{marginBottom:24}}>
                <div style={{fontSize:".72rem",fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:".1em",marginBottom:10}}>Akzentfarbe</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:12}}>
                  {ACCENT_PRESETS.map(p=>{const active=currentAccent===p.value;return<button key={p.value} onClick={()=>{upOrder("custom_accent")(p.value);const pal=buildPaletteFromAccent(p.value,order.stil||"klassisch");Object.entries(pal).forEach(([k,v])=>upOrder(k)(v));}} style={{display:"flex",alignItems:"center",gap:7,padding:"7px 13px",border:active?`2px solid ${T.dark}`:`1.5px solid ${T.bg3}`,borderRadius:100,background:active?T.white:"#fff",cursor:"pointer",fontFamily:T.font,transition:"all .15s"}} title={p.label}><div style={{width:16,height:16,borderRadius:"50%",background:p.value,border:"1px solid rgba(0,0,0,.1)"}}/><span style={{fontSize:".76rem",fontWeight:active?700:500,color:active?T.dark:T.textMuted}}>{p.label}</span></button>})}
                </div>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <input type="color" value={currentAccent} onChange={e=>{const v=ensureContrast(e.target.value);upOrder("custom_accent")(v);const pal=buildPaletteFromAccent(v,order.stil||"klassisch");Object.entries(pal).forEach(([k,vv])=>upOrder(k)(vv));}} style={{width:36,height:36,border:`2px solid ${T.bg3}`,borderRadius:T.rSm,cursor:"pointer",padding:0}}/>
                  <input value={currentAccent} maxLength={7} onChange={e=>{const v=e.target.value;if(/^#[0-9A-Fa-f]{6}$/.test(v)){const safe=ensureContrast(v);upOrder("custom_accent")(safe);const pal=buildPaletteFromAccent(safe,order.stil||"klassisch");Object.entries(pal).forEach(([k,vv])=>upOrder(k)(vv));}}} style={{width:90,padding:"5px 8px",border:`1.5px solid ${T.bg3}`,borderRadius:T.rSm,fontFamily:T.mono,fontSize:".82rem",fontWeight:600,color:T.dark}}/>
                  <div style={{fontSize:".72rem",color:T.textMuted}}>Eigene Farbe (Palette passt sich automatisch an)</div>
                </div>
                {/* Kontrast-Info */}
                {(()=>{
                  const ratio=contrastRatioVsWhite(currentAccent);
                  const ratioOk=ratio>=4.5;
                  return<div style={{marginTop:10,padding:"8px 12px",background:ratioOk?T.greenLight:"#fef3c7",border:`1px solid ${ratioOk?"rgba(22,163,74,.2)":"#fcd34d"}`,borderRadius:T.rSm,fontSize:".74rem",color:ratioOk?T.green:"#78350f",display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontWeight:800,fontFamily:T.mono}}>{ratio.toFixed(2)}:1</span>
                    {ratioOk?<span>Guter Kontrast auf Weiß (WCAG AA)</span>:<span>Kontrast unter WCAG AA 4.5:1 — Texte werden schwer lesbar</span>}
                  </div>;
                })()}
              </div>

              {/* Vorschlaege zur Akzentfarbe */}
              {(()=>{
                const suggestions=suggestPalettesFromAccent(currentAccent,order.stil||"klassisch");
                return<div style={{marginBottom:24}}>
                  <div style={{fontSize:".72rem",fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:".1em",marginBottom:10}}>Vorschläge zu Ihrer Akzentfarbe</div>
                  <div style={{fontSize:".74rem",color:T.textMuted,marginBottom:10,lineHeight:1.5}}>Automatisch harmonisch abgestimmt — ein Klick übernimmt Hintergrund, Primary und Trennlinien.</div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:8}}>
                    {suggestions.map((p,i)=>{const pc=p.colors;const matches=order.custom_color===pc.custom_color&&order.custom_bg===pc.custom_bg;return<button key={i} onClick={()=>{Object.entries(pc).forEach(([k,v])=>upOrder(k)(v));}} style={{padding:"12px",border:`2px solid ${matches?T.dark:T.bg3}`,borderRadius:T.rSm,background:matches?T.bg:"#fff",cursor:"pointer",textAlign:"left",fontFamily:T.font,transition:"all .15s"}}>
                      <div style={{display:"flex",gap:0,marginBottom:10,borderRadius:4,overflow:"hidden",height:28,border:"1px solid rgba(0,0,0,.08)"}}>
                        <div style={{flex:1.5,background:pc.custom_color}}/>
                        <div style={{flex:1,background:pc.custom_accent}}/>
                        <div style={{flex:2,background:pc.custom_bg}}/>
                        <div style={{flex:.5,background:pc.custom_sep}}/>
                      </div>
                      <div style={{fontSize:".82rem",fontWeight:700,color:T.dark}}>{p.name}</div>
                      <div style={{fontSize:".7rem",color:T.textMuted,marginTop:2}}>{p.desc}</div>
                    </button>})}
                  </div>
                </div>;
              })()}

              {/* Paletten */}
              <div style={{marginBottom:20}}>
                <div style={{fontSize:".72rem",fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:".1em",marginBottom:10}}>Farbstimmung</div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:8}}>
                  {PALETTES.map((p,i)=>{const pc=p.colors;const isActive=i===0?!hasCustom:false;return(
                    <button key={i} onClick={()=>applyPalette(p)} style={{padding:"12px",border:`2px solid ${isActive?T.dark:T.bg3}`,borderRadius:T.rSm,background:isActive?T.bg:"#fff",cursor:"pointer",textAlign:"left",fontFamily:T.font,transition:"border-color .15s"}}>
                      <div style={{display:"flex",gap:4,marginBottom:8}}>
                        {[pc.custom_color||s.primary,pc.custom_accent||s.accent,pc.custom_bg||s.bg,pc.custom_text||"#1f2937"].map((c,j)=>c&&<div key={j} style={{width:16,height:16,borderRadius:4,background:c,border:"1px solid rgba(0,0,0,.1)"}}/>)}
                      </div>
                      <div style={{fontSize:".82rem",fontWeight:700,color:T.dark}}>{p.name}</div>
                      <div style={{fontSize:".72rem",color:T.textMuted}}>{p.desc}</div>
                    </button>
                  );})}
                </div>
              </div>

              {/* Erweitert aufklappbar */}
              <button onClick={()=>setShowErweitert(!showErweitert)} style={{display:"flex",alignItems:"center",gap:8,padding:"10px 0",border:"none",background:"none",cursor:"pointer",fontFamily:T.font,color:T.textMuted,fontSize:".82rem",fontWeight:600}}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{transform:showErweitert?"rotate(180deg)":"none",transition:"transform .2s"}}><polyline points="6 9 12 15 18 9"/></svg>
                Erweitert — alle Farben, Schrift und Ecken einzeln
              </button>
              {showErweitert&&<div style={{marginTop:8}}>
                <div className="pt-color-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16,marginBottom:20}}>
                  <ColorPicker label="Primärfarbe" hint="Navigation, Überschriften, Über-uns" field="custom_color" fallback={s.primary}/>
                  <ColorPicker label="Akzentfarbe" hint="Buttons, Links, Highlights" field="custom_accent" fallback={s.accent}/>
                  <ColorPicker label="Hintergrund" hint="Seitenhintergrund" field="custom_bg" fallback={s.bg}/>
                  <ColorPicker label="Textfarbe" hint="Haupttext" field="custom_text" fallback={s.text||"#1f2937"}/>
                  <ColorPicker label="Sekundärtext" hint="Hints, Labels" field="custom_text_muted" fallback={s.textMuted||"#64748b"}/>
                  <ColorPicker label="Trennlinien" hint="Borders, Rahmen" field="custom_sep" fallback={s.borderColor||"#e2e8f0"}/>
                </div>
                <div className="pt-font-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
                  <Dropdown label="Schriftart" value={order.custom_font||""} onChange={upOrder("custom_font")} options={FONT_OPTIONS} placeholder="Standard (vom Stil)"/>
                  <Dropdown label="Ecken" value={order.custom_radius||""} onChange={upOrder("custom_radius")} options={RADIUS_OPTIONS} placeholder="Standard (vom Stil)"/>
                </div>
                {hasCustom&&<button onClick={()=>{["custom_color","custom_accent","custom_bg","custom_text","custom_text_muted","custom_sep","custom_font","custom_radius"].forEach(k=>upOrder(k)(null));}} style={{padding:"8px 16px",border:`1.5px solid ${T.bg3}`,borderRadius:T.rSm,background:"#fff",color:T.textMuted,cursor:"pointer",fontSize:".82rem",fontWeight:600,fontFamily:T.font}}>Alles auf Standard zurücksetzen</button>}
              </div>}
          </div>

        </div>;})()}
        {page==="branchenfeatures"&&(()=>{const ft=getBrancheFeatures(order.branche);return<>
          <div style={{background:"#fff",borderRadius:T.r,padding:"24px 28px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1}}>
            <SectionHeader label="Vertrauen & Qualität" desc="Spezialisierung, Meisterbetrieb, Notdienst und mehr — erscheinen als Badges auf Ihrer Website."/>
            <Field label="Spezialisierung / Fachgebiet" value={order.spezialisierung||""} onChange={upOrder("spezialisierung")} placeholder="z.B. Allgemeinmedizin, Strafrecht, Hochzeitsfotografie" hint="Wird oben auf der Website angezeigt — leer lassen wenn nicht zutreffend"/>
            <Field label="Berufsregister-Nr." value={order.berufsregister_nr||""} onChange={upOrder("berufsregister_nr")} placeholder="z.B. ÖÄK-Nr. für Ärzte, GISA-Zahl für Gewerbe" hint="Nur ausfüllen wenn vorhanden"/>
            {ft.includes("meisterbetrieb")&&<Toggle label="Meisterbetrieb" checked={!!order.meisterbetrieb} onChange={upOrder("meisterbetrieb")} desc="Zeigt ein Meisterbetrieb-Badge"/>}
            {ft.includes("notdienst")&&<Toggle label="24h Notdienst" checked={!!order.notdienst} onChange={upOrder("notdienst")} desc="Wird prominent auf Ihrer Website angezeigt"/>}
            {ft.includes("kassenvertrag")&&<Dropdown label="Kassenvertrag" value={order.kassenvertrag||""} onChange={upOrder("kassenvertrag")} options={[{value:"alle_kassen",label:"Alle Kassen"},{value:"oegk",label:"ÖGK"},{value:"bvaeb",label:"BVAEB"},{value:"svs",label:"SVS"},{value:"wahlarzt",label:"Wahlarzt / Wahltherapeut"},{value:"privat",label:"Nur Privat"}]} placeholder="Kassenvertrag wählen" hint="Wichtig für Patienten"/>}
            <Toggle label="Zertifiziert / geprüft" checked={!!order.zertifiziert} onChange={upOrder("zertifiziert")} desc="z.B. TÜV, ISO, WKO-Qualitätszeichen"/>
          </div>
          <div style={{background:"#fff",borderRadius:T.r,padding:"24px 28px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1}}>
            <SectionHeader label="Angebot & Preis" desc="Kostenvoranschlag, Ratenzahlung und Gutscheine."/>
            {ft.includes("kostenvoranschlag")&&<Toggle label="Kostenloser Kostenvoranschlag" checked={!!order.kostenvoranschlag} onChange={upOrder("kostenvoranschlag")} desc="Wird als Vertrauens-Badge angezeigt"/>}
            <Toggle label="Ratenzahlung möglich" checked={!!order.ratenzahlung} onChange={upOrder("ratenzahlung")} desc="Zahlung in Raten anbieten"/>
            {ft.includes("foerderungsberatung")&&<Toggle label="Förderungsberatung" checked={!!order.foerderungsberatung} onChange={upOrder("foerderungsberatung")} desc="Beratung zu Förderungen (Sanierungsbonus etc.)"/>}
            <Toggle label="Gutscheine erhältlich" checked={!!order.gutscheine} onChange={upOrder("gutscheine")} desc="Geschenkgutscheine zum Kaufen"/>
            <div style={{padding:"10px 14px",background:T.bg,borderRadius:T.rSm,fontSize:".78rem",color:T.textMuted,marginTop:8}}>Preisliste (PDF) können Sie unter <button onClick={()=>nav("leistungen")} style={{color:T.accent,fontWeight:600,background:"none",border:"none",cursor:"pointer",fontFamily:T.font,fontSize:".78rem",padding:0,textDecoration:"underline"}}>Leistungen</button> hochladen.</div>
          </div>
          {(ft.includes("fruehstueck")||ft.includes("wlan")||ft.includes("haustiere"))&&<div style={{background:"#fff",borderRadius:T.r,padding:"24px 28px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1}}>
            <SectionHeader label="Tourismus-Angebote" desc="Was bieten Sie Gästen? Wird als Badges angezeigt."/>
            {ft.includes("fruehstueck")&&<Toggle label="Frühstück inklusive" checked={!!order.fruehstueck} onChange={upOrder("fruehstueck")} desc="Zeigt Frühstücks-Badge"/>}
            {ft.includes("wlan")&&<Toggle label="WLAN kostenlos" checked={!!order.wlan} onChange={upOrder("wlan")} desc="Wichtig für Geschäftsreisende"/>}
            {ft.includes("haustiere")&&<Toggle label="Haustiere willkommen" checked={!!order.haustiere} onChange={upOrder("haustiere")} desc="Für Reisende mit Hund"/>}
          </div>}
          {ft.includes("online_shop")&&<div style={{background:"#fff",borderRadius:T.r,padding:"24px 28px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1}}>
            <SectionHeader label="Verkauf" desc="Online-Shop oder andere Verkaufsoptionen."/>
            <Toggle label="Online-Shop verfügbar" checked={!!order.online_shop} onChange={upOrder("online_shop")} desc="Kunden können online bestellen/reservieren"/>
          </div>}
        </>})()}
        {page==="social"&&<div style={{background:"#fff",borderRadius:T.r,padding:"24px 28px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1}}>
          <SectionHeader label="Social Media" desc="Ihre Profile erscheinen als Icons im Footer. Nur ausfüllen was Sie aktiv nutzen."/>
          <Field label="Facebook" value={order.facebook||""} onChange={upOrder("facebook")} onBlur={()=>upOrder("facebook")(normalizeSocial("facebook",order.facebook))} placeholder="ihrefirma" hint="Benutzername oder Link"/>
          <Field label="Instagram" value={order.instagram||""} onChange={upOrder("instagram")} onBlur={()=>upOrder("instagram")(normalizeSocial("instagram",order.instagram))} placeholder="ihrefirma" hint="Benutzername oder Link"/>
          <Field label="LinkedIn" value={order.linkedin||""} onChange={upOrder("linkedin")} onBlur={()=>upOrder("linkedin")(normalizeSocial("linkedin",order.linkedin))} placeholder="ihrefirma" hint="Benutzername oder Link"/>
          <Field label="TikTok" value={order.tiktok||""} onChange={upOrder("tiktok")} onBlur={()=>upOrder("tiktok")(normalizeSocial("tiktok",order.tiktok))} placeholder="ihrefirma" hint="Benutzername oder Link"/>
        </div>}

      </>)}

      {/* Tab: Rechnungen */}
      {(tab==="konto"&&page==="rechnungen")&&(<div style={{background:"#fff",borderRadius:T.r,padding:"28px 32px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1}}>
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
        {invoices==="loading"&&(()=>{const B=({w,h=14,r=6})=><div style={{width:w,height:h,borderRadius:r,background:`linear-gradient(90deg,${T.bg3} 25%,${T.bg2} 50%,${T.bg3} 75%)`,backgroundSize:"200% 100%",animation:"shimmer 1.5s ease-in-out infinite"}}/>;return<div style={{display:"flex",flexDirection:"column",gap:8}}>{[0,1,2].map(i=><div key={i} style={{display:"flex",alignItems:"center",gap:16,padding:"14px 16px",border:`1px solid ${T.bg3}`,borderRadius:T.rSm,background:T.bg}}><div style={{flex:1}}><B w={180} h={13}/><div style={{height:6}}/><B w={80} h={11}/></div><B w={60} h={14}/><B w={56} h={22} r={4}/></div>)}</div>;})()}
        {Array.isArray(invoices)&&invoices.length===0&&<div style={{color:T.textMuted,fontSize:".9rem"}}>Noch keine Zahlungen vorhanden.</div>}
        {Array.isArray(invoices)&&invoices.length>0&&(<div style={{display:"flex",flexDirection:"column",gap:8}}>
          {invoices.map(c=>{
            const date=new Date(c.created*1000).toLocaleDateString("de-AT",{day:"2-digit",month:"2-digit",year:"numeric"});
            const amount=(c.amount/100).toFixed(2).replace(".",",");
            const statusColor=c.status==="succeeded"?T.green:T.amber;
            const statusLabel=c.status==="succeeded"?"Bezahlt":"Ausstehend";
            return(<div key={c.id} className="pt-rechnung-item" style={{display:"flex",alignItems:"center",gap:16,padding:"14px 16px",border:`1px solid ${T.bg3}`,borderRadius:T.rSm,background:T.bg}}>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:".88rem",color:T.dark}}>{c.description||"Starter"}</div>
                <div style={{fontSize:".8rem",color:T.textMuted,marginTop:2}}>{date}</div>
              </div>
              <div style={{fontWeight:700,fontFamily:T.mono,fontSize:".95rem",color:T.dark}}>{"€"}{amount}</div>
              <div style={{padding:"4px 10px",borderRadius:4,background:`${statusColor}18`,color:statusColor,fontSize:".75rem",fontWeight:700}}>{statusLabel}</div>
              {c.receipt_url&&<a href={c.receipt_url} target="_blank" rel="noreferrer" style={{padding:"6px 14px",border:`2px solid ${T.bg3}`,borderRadius:T.rSm,color:T.textSub,fontSize:".8rem",fontWeight:600,textDecoration:"none",background:"#fff"}}>Beleg</a>}
            </div>);
          })}
        </div>)}
      </div>)}

      {/* Tab: Support */}
      {(tab==="konto"&&page==="support")&&(<div style={{display:"flex",flexDirection:"column",gap:16}}>
        <div className="pt-support-info" style={{background:T.accentLight,borderRadius:T.r,padding:"24px 28px",border:`1px solid rgba(143,163,184,.15)`,display:"flex",gap:32,flexWrap:"wrap"}}>
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
            <div style={{padding:"14px 18px",background:T.greenLight,borderRadius:T.rSm,border:"1px solid rgba(22,163,74,.2)",color:T.green,fontWeight:700}}>{"✓"} Nachricht gesendet</div>
            <p style={{color:T.textSub,fontSize:".88rem",margin:0}}>Wir melden uns innerhalb von 48 Stunden bei Ihnen.</p>
            <button onClick={()=>setSupportSent(false)} style={{padding:"9px 18px",border:`2px solid ${T.bg3}`,borderRadius:T.rSm,background:"#fff",color:T.textSub,cursor:"pointer",fontSize:".82rem",fontWeight:600,fontFamily:T.font}}>Neue Nachricht</button>
          </div>):(<>
            <Dropdown label="Betreff" value={supportSubject} onChange={setSupportSubject} options={[
              {value:"Technisches Problem",label:"Technisches Problem"},
              {value:"Aenderungswunsch",label:"Änderungswunsch"},
              {value:"Frage zur Rechnung",label:"Frage zur Rechnung"},
              {value:"Custom Domain",label:"Custom Domain"},
              {value:"Kuendigung",label:"Kündigung"},
              {value:"Sonstiges",label:"Sonstiges"},
            ]} placeholder="Betreff wählen"/>
            <Field label="Ihre Nachricht" value={supportMsg} onChange={setSupportMsg} placeholder="Beschreiben Sie Ihr Anliegen..." rows={4}/>
            {supportErr&&<div style={{marginBottom:12,padding:"10px 14px",background:T.redLight,borderRadius:T.rSm,fontSize:".78rem",color:T.red}}>{supportErr}</div>}
            <button onClick={async()=>{
              if(!supportMsg.trim()||!supabase)return;
              setSupportSending(true);setSupportErr("");
              const{error}=await supabase.from("support_requests").insert({email:session?.user?.email,subject:supportSubject||"Allgemeine Anfrage",message:supportMsg});
              setSupportSending(false);
              if(error)setSupportErr("Fehler: "+error.message);
              else{setSupportSent(true);setSupportSubject("");setSupportMsg("");}
            }} disabled={supportSending||!supportMsg.trim()} style={{padding:"12px 24px",border:"none",borderRadius:T.rSm,background:(supportSending||!supportMsg.trim())?T.bg3:T.dark,color:"#fff",fontSize:".88rem",fontWeight:700,fontFamily:T.font,cursor:(supportSending||!supportMsg.trim())?"not-allowed":"pointer"}}>
              {supportSending?"Wird gesendet...":"Nachricht senden →"}
            </button>
          </>)}
        </div>
        <div style={{background:"#fff",borderRadius:T.r,padding:"24px 28px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1}}>
          <div style={{fontSize:".8rem",fontWeight:700,color:T.dark,marginBottom:16}}>{"Häufige Fragen"}</div>
          {[
            {q:"Wie lange dauert es bis meine Website online ist?",a:"Direkt nach dem Formular starten wir die Generierung – Ihre Website ist meist innerhalb weniger Minuten als Vorschau erreichbar. Sie erhalten eine E-Mail sobald alles live ist."},
            {q:"Kann ich den Text auf meiner Website selbst ändern?",a:"Ja – im Portal können Sie jederzeit Adresse, Telefon, Leistungen und mehr anpassen."},
            {q:"Was passiert nach der Testphase?",a:"Nach 7 Tagen wird Ihre hinterlegte Karte belastet – beim Monatsabo monatlich kündbar, beim Jahresabo nach 12 Monaten. Sie erhalten vorher eine Erinnerung per E-Mail."},
            {q:"Kann ich mein Logo und Fotos hochladen?",a:"Ja, Logo und Titelbild laden Sie unter 'Header & Hero' hoch. Weitere Fotos können Sie unter 'Über uns' hinzufügen — Betriebsfotos, Team, Arbeitsproben. Fotos zu einzelnen Leistungen direkt unter 'Leistungen'."},
            {q:"Wie verbinde ich meine eigene Domain?",a:"Die noetigen DNS-Eintraege finden Sie unter 'SEO, Google & Domain'. Danach einmal kurz Bescheid geben und wir schalten die Domain frei."},
          ].map((f,i)=><details key={i} style={{borderBottom:`1px solid ${T.bg3}`,padding:"14px 0"}}>
            <summary style={{cursor:"pointer",fontWeight:600,fontSize:".88rem",color:T.dark,listStyle:"none",display:"flex",justifyContent:"space-between",alignItems:"center",userSelect:"none"}}>
              {f.q}<span style={{color:T.textMuted,fontSize:"1.1rem",marginLeft:12,flexShrink:0}}>+</span>
            </summary>
            <p style={{margin:"10px 0 0",fontSize:".84rem",color:T.textSub,lineHeight:1.7}}>{f.a}</p>
          </details>)}
        </div>
      </div>)}

      {/* Tab: Account */}
      {(tab==="konto"&&page==="account")&&(<div style={{display:"flex",flexDirection:"column",gap:16}}>
        <div style={{background:"#fff",borderRadius:T.r,padding:"24px 28px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1}}>
          <div style={{fontSize:".8rem",fontWeight:700,color:T.dark,marginBottom:16}}>Account-Daten</div>
          <InfoRow label="E-Mail-Adresse" value={session?.user?.email}/>
          <InfoRow label="Mitglied seit" value={session?.user?.created_at?new Date(session.user.created_at).toLocaleDateString("de-AT",{day:"2-digit",month:"2-digit",year:"numeric"}):""}/>
        </div>
        <div style={{background:"#fff",borderRadius:T.r,padding:"24px 28px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1}}>
          <div style={{fontSize:".8rem",fontWeight:700,color:T.dark,marginBottom:16}}>Abonnement</div>
          {[{l:"Paket",v:"Starter"},{l:"Preis",v:order?.subscription_plan==="yearly"?"€168 / Jahr (€14/Monat)":"€16 / Monat"},{l:"Laufzeit",v:order?.subscription_plan==="yearly"?"12 Monate, dann monatlich":"Monatlich kündbar"},...(order?.created_at?[{l:"Gestartet am",v:new Date(order.created_at).toLocaleDateString("de-AT",{day:"2-digit",month:"long",year:"numeric"})}]:[]),...(order?.created_at&&order?.subscription_plan==="yearly"?[{l:"Mindestende",v:new Date(new Date(order.created_at).setFullYear(new Date(order.created_at).getFullYear()+1)).toLocaleDateString("de-AT",{day:"2-digit",month:"long",year:"numeric"})}]:[])].map(({l,v})=>(
            <div key={l} className="pt-info-row" style={{display:"grid",gridTemplateColumns:"160px 1fr",padding:"9px 0",borderBottom:`1px solid ${T.bg3}`}}>
              <span style={{fontSize:".78rem",color:T.textMuted,fontWeight:600}}>{l}</span>
              <span style={{fontSize:".88rem",color:T.dark}}>{v}</span>
            </div>))}
        </div>
        <div style={{display:"flex",flexWrap:"wrap",gap:16}}>
          <div style={{background:"#fff",borderRadius:T.r,padding:"24px 28px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1,flex:"1 1 280px"}}>
            <div style={{fontSize:".72rem",fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:".1em",marginBottom:16}}>{"Passwort ändern"}</div>
            <Field label="Neues Passwort" value={newPw} onChange={setNewPw} placeholder="Mindestens 8 Zeichen" type="password"/>
            <Field label="Passwort bestätigen" value={newPw2} onChange={setNewPw2} placeholder="Passwort wiederholen" type="password"/>
            {pwErr&&<div style={{marginBottom:12,padding:"10px 14px",background:T.redLight,borderRadius:T.rSm,fontSize:".78rem",color:T.red}}>{pwErr}</div>}
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <button onClick={async()=>{
                if(!newPw||newPw!==newPw2){setPwErr("Passwörter stimmen nicht überein.");return;}
                if(newPw.length<8){setPwErr("Mindestens 8 Zeichen.");return;}
                setPwSaving(true);setPwErr("");
                const{error}=await supabase.auth.updateUser({password:newPw});
                setPwSaving(false);
                if(error)setPwErr(error.message);
                else{setPwSaved(true);setNewPw("");setNewPw2("");setTimeout(()=>setPwSaved(false),3000);}
              }} disabled={pwSaving} style={{padding:"12px 24px",border:"none",borderRadius:T.rSm,background:pwSaving?T.bg3:T.dark,color:"#fff",fontSize:".88rem",fontWeight:700,fontFamily:T.font,cursor:pwSaving?"wait":"pointer"}}>
                {pwSaving?"...":"Passwort speichern"}
              </button>
              {pwSaved&&<span style={{color:T.green,fontWeight:600,fontSize:".85rem"}}>{"✓"} Gespeichert</span>}
            </div>
          </div>
          <div style={{background:"#fff",borderRadius:T.r,padding:"24px 28px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1,flex:"1 1 280px"}}>
            <div style={{fontSize:".72rem",fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:".1em",marginBottom:16}}>{"E-Mail-Adresse ändern"}</div>
            {emailSent
              ?<div style={{display:"flex",flexDirection:"column",gap:12}}>
                <div style={{padding:"14px 18px",background:T.greenLight,borderRadius:T.rSm,border:"1px solid rgba(22,163,74,.2)",color:T.green,fontWeight:700,fontSize:".88rem"}}>{"✓ Bestätigungslink gesendet"}</div>
                <p style={{color:T.textSub,fontSize:".84rem",margin:0,lineHeight:1.6}}>{"Bitte prüfen Sie Ihren Posteingang und klicken Sie auf den Bestätigungslink um die neue E-Mail-Adresse zu aktivieren."}</p>
                <button onClick={()=>setEmailSent(false)} style={{padding:"8px 16px",border:`2px solid ${T.bg3}`,borderRadius:T.rSm,background:"#fff",color:T.textSub,cursor:"pointer",fontSize:".82rem",fontWeight:600,fontFamily:T.font,alignSelf:"flex-start"}}>Neue Anfrage</button>
              </div>
              :<>
                <Field label="Neue E-Mail-Adresse" value={newEmail} onChange={setNewEmail} placeholder="neue@email.at" type="email" validate={VALIDATORS.email}/>
                {emailErr&&<div style={{marginBottom:12,padding:"10px 14px",background:T.redLight,borderRadius:T.rSm,fontSize:".78rem",color:T.red}}>{emailErr}</div>}
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
          <p style={{fontSize:".85rem",color:T.textSub,lineHeight:1.7,margin:"0 0 14px"}}>Für eine Kündigung schreiben Sie bitte an <strong>support@siteready.at</strong>.{order?.subscription_plan==="yearly"?" Bitte beachten Sie die Mindestlaufzeit von 12 Monaten.":" Das Monatsabo ist jederzeit kündbar."}</p>
        </div>
      </div>)}

      {/* Tab: Medien */}
      {/* Tab: Marketing */}
      {(tab==="extras"&&page==="teilen")&&(<div style={{display:"flex",flexDirection:"column",gap:16}}>
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
        {/* Firmen-Flyer PDF */}
        {(()=>{const flyerQrUrl=`https://api.qrserver.com/v1/create-qr-code/?size=400x400&format=png&data=${encodeURIComponent(`https://sitereadyprototype.pages.dev/s/${sub}`)}`;return(
        <div style={{background:"#fff",borderRadius:T.r,padding:"24px 28px",border:`1px solid ${T.bg3}`,boxShadow:T.sh2}}>
          <div style={{fontSize:".8rem",fontWeight:700,color:T.dark,marginBottom:16}}>Firmen-Flyer (PDF)</div>
          <div style={{display:"flex",gap:24,alignItems:"flex-start",flexWrap:"wrap"}}>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:10,flexShrink:0}}>
              <div style={{width:140,height:140,borderRadius:T.rSm,border:`1px solid ${T.bg3}`,overflow:"hidden",background:T.bg}}>
                <img src={flyerQrUrl} alt="QR-Code" style={{width:"100%",height:"100%",display:"block"}}/>
              </div>
              <button onClick={async()=>{try{const r=await fetch(flyerQrUrl);const b=await r.blob();const u=URL.createObjectURL(b);const a=document.createElement("a");a.href=u;a.download=`${sub}-qr.png`;a.click();URL.revokeObjectURL(u);}catch(e){window.open(flyerQrUrl,"_blank");}}} style={{padding:"7px 14px",border:`2px solid ${T.bg3}`,borderRadius:T.rSm,background:"#fff",color:T.textSub,cursor:"pointer",fontSize:".75rem",fontWeight:600,fontFamily:T.font,width:"100%",textAlign:"center"}}>QR herunterladen</button>
            </div>
            <div style={{flex:1,minWidth:200}}>
              <p style={{fontSize:".85rem",color:T.textSub,lineHeight:1.6,margin:"0 0 14px"}}>Professioneller One-Pager im Design Ihrer Website — für Kunden, Pinnwände und als E-Mail-Beilage.</p>
          <button onClick={()=>{const s=STYLES_MAP[order.stil]||STYLES_MAP.klassisch;const websiteUrl=`https://sitereadyprototype.pages.dev/s/${sub}`;const qr=`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(websiteUrl)}`;const leistungen=[...(order.leistungen||[]),...(order.extra_leistung?order.extra_leistung.split("\n").map(x=>x.trim()).filter(Boolean):[])];const logoHtml=assetUrls.logo?`<img src="${assetUrls.logo}" alt="Logo" style="height:56px;max-width:200px;object-fit:contain;"/>`:``;const oezLabel=({"mo-fr-8-17":"Mo–Fr 8–17 Uhr","mo-fr-7-16":"Mo–Fr 7–16 Uhr","mo-fr-8-18":"Mo–Fr 8–18 Uhr","mo-sa-8-17":"Mo–Sa 8–17 Uhr","mo-sa-8-12":"Mo–Sa 8–12 Uhr","vereinbarung":"Nach Vereinbarung"})[order.oeffnungszeiten]||order.oeffnungszeiten||"";const htmlContent=`<!DOCTYPE html><html><head><meta charset="utf-8"><title>${order.firmenname||"Firmen-Flyer"}</title><link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700;800&family=Source+Serif+4:wght@400;600;700&display=swap" rel="stylesheet"><style>@page{size:A4;margin:0;}body{font-family:${s.font};color:${s.text};margin:0;padding:0;line-height:1.5;-webkit-print-color-adjust:exact;print-color-adjust:exact;}*{box-sizing:border-box;}.hero{background:${s.heroGradient};color:#fff;padding:48px 40px 40px;position:relative;overflow:hidden;}.hero::before{content:'';position:absolute;inset:0;background:${s.heroOverlay};}.hero-content{position:relative;z-index:1;}.hero h1{font-size:32px;font-weight:800;margin:0 0 8px;letter-spacing:-.02em;line-height:1.15;}.hero p{font-size:15px;opacity:.8;margin:0;max-width:400px;line-height:1.6;}.hero-logo{margin-bottom:20px;}.body{padding:36px 40px 28px;}.section-title{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:${s.accent};margin:0 0 14px;padding-bottom:8px;border-bottom:2px solid ${s.borderColor};}.leistungen{display:grid;grid-template-columns:1fr 1fr;gap:6px 28px;margin-bottom:32px;}.leistung{font-size:13px;padding:4px 0;display:flex;align-items:center;gap:8px;}.check{color:${s.accent};font-weight:700;font-size:14px;}.contact-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px 28px;margin-bottom:32px;}.contact-label{font-weight:700;color:${s.textMuted};font-size:10px;text-transform:uppercase;letter-spacing:.06em;margin-bottom:2px;}.contact-value{font-size:13px;font-weight:500;color:${s.text};}.footer{display:flex;align-items:center;justify-content:space-between;padding:24px 40px;background:${s.bg};border-top:2px solid ${s.borderColor};}.qr-section{display:flex;align-items:center;gap:14px;}.qr-text{font-size:12px;color:${s.textMuted};}.qr-text strong{display:block;color:${s.text};font-size:13px;margin-bottom:2px;}.branding{font-size:10px;color:${s.textLight};}</style></head><body><div class="hero"><div class="hero-content">${logoHtml?`<div class="hero-logo">${logoHtml}</div>`:""}<h1>${order.firmenname||""}</h1>${order.kurzbeschreibung?`<p>${order.kurzbeschreibung}</p>`:""}</div></div><div class="body">${leistungen.length?`<div class="section-title">Unsere Leistungen</div><div class="leistungen">${leistungen.map(l=>`<div class="leistung"><span class="check">✓</span>${l}</div>`).join("")}</div>`:""}<div class="section-title">Kontakt</div><div class="contact-grid">${order.adresse?`<div><div class="contact-label">Adresse</div><div class="contact-value">${order.adresse}${order.plz||order.ort?", "+[order.plz,order.ort].filter(Boolean).join(" "):""}</div></div>`:""} ${order.telefon?`<div><div class="contact-label">Telefon</div><div class="contact-value">${order.telefon}</div></div>`:""} ${order.email?`<div><div class="contact-label">E-Mail</div><div class="contact-value">${order.email}</div></div>`:""} ${oezLabel?`<div><div class="contact-label">Öffnungszeiten</div><div class="contact-value">${oezLabel}</div></div>`:""} ${order.einsatzgebiet?`<div><div class="contact-label">Einsatzgebiet</div><div class="contact-value">${order.einsatzgebiet}</div></div>`:""}</div></div><div class="footer"><div class="qr-section"><img src="${qr}" alt="QR" style="width:72px;height:72px;border-radius:${s.radius};"/><div class="qr-text"><strong>Besuchen Sie uns online</strong>${sub}.siteready.at</div></div><div class="branding">Erstellt mit SiteReady.at</div></div></body></html>`;const iframe=document.createElement("iframe");iframe.style.cssText="position:fixed;top:-9999px;left:-9999px;width:794px;height:1123px;";document.body.appendChild(iframe);iframe.contentDocument.write(htmlContent);iframe.contentDocument.close();iframe.onload=()=>{setTimeout(()=>{iframe.contentWindow.print();setTimeout(()=>document.body.removeChild(iframe),1000);},500);};}} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 20px",background:T.dark,color:"#fff",border:"none",borderRadius:T.rSm,cursor:"pointer",fontFamily:T.font,fontSize:".82rem",fontWeight:700}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            PDF erstellen &amp; herunterladen
          </button>
            </div>
          </div>
        </div>);})()}
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

      {page==="medien"&&(<div style={{display:"flex",flexDirection:"column",gap:16}}>
        {/* Logo */}
        {(()=>{const a=ASSETS[0];const url=assetUrls[a.key];const busy=uploading[a.key];return(
          <div style={{background:"#fff",borderRadius:T.r,padding:"20px 24px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1}}>
            <div className="pt-upload-hdr" style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
              <div>
                <div style={{fontWeight:700,fontSize:".9rem",color:T.dark,marginBottom:2}}>Logo</div>
                <div style={{fontSize:".78rem",color:T.textMuted}}>{a.desc}</div>
              </div>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <label style={{padding:"9px 18px",border:`2px solid ${T.bg3}`,borderRadius:T.rSm,background:busy?T.bg:"#fff",color:T.textSub,cursor:busy?"wait":"pointer",fontSize:".82rem",fontWeight:600,fontFamily:T.font,whiteSpace:"nowrap"}}>
                  {busy?"Lädt...":url?"Ersetzen":"Hochladen"}
                  <input type="file" accept="image/*" style={{display:"none"}} disabled={busy} onChange={e=>{if(e.target.files[0])upload(a.key,e.target.files[0]);}}/>
                </label>
                {url&&<button onClick={()=>askDelete(a.label||"Bild",()=>deleteAsset(a.key))} disabled={deleting[a.key]} title="Bild entfernen" style={{padding:"9px 12px",border:"2px solid #fca5a5",borderRadius:T.rSm,background:"#fff",color:"#ef4444",cursor:deleting[a.key]?"wait":"pointer",fontSize:".82rem",fontWeight:700,fontFamily:T.font}}>{deleting[a.key]?"...":"×"}</button>}
              </div>
            </div>
            {url&&(<div style={{marginBottom:12}}>
              <div style={{fontSize:".68rem",fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:".08em",marginBottom:6}}>Vorschau</div>
              <div className="pt-logo-preview" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <div>
                  <div style={{fontSize:".68rem",color:T.textMuted,marginBottom:4}}>Navigation (dunkel)</div>
                  <div style={{background:order?.custom_color||"#0f172a",borderRadius:T.rSm,padding:"10px 16px",display:"flex",alignItems:"center"}}>
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
              {logoContrastIssue&&<div style={{marginTop:10,padding:"12px 14px",background:"#fef3c7",border:"1px solid #fcd34d",borderRadius:T.rSm}}>
                <div style={{display:"flex",alignItems:"flex-start",gap:10}}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#92400e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0,marginTop:1}}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                  <div style={{flex:1}}>
                    <div style={{fontSize:".82rem",fontWeight:700,color:"#78350f",marginBottom:3}}>Logo schwer sichtbar auf der Navigation</div>
                    <div style={{fontSize:".78rem",color:"#78350f",lineHeight:1.55}}>{logoContrastIssue==="too-dark"?"Ihr Logo ist dunkel und verschwindet auf dem dunklen Navigationshintergrund (siehe linke Vorschau).":"Ihr Logo ist sehr hell und geht auf dem hellen Hintergrund unter."} Bitte laden Sie eine Version mit ausreichendem Kontrast hoch — die meisten Designer liefern Logo-Varianten für helle UND dunkle Hintergründe.</div>
                  </div>
                </div>
              </div>}
            </div>)}
            {!url&&(<div style={{background:T.bg,borderRadius:T.rSm,padding:"28px 16px",textAlign:"center",marginBottom:4}}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={T.bg3} strokeWidth="1.5" style={{marginBottom:8}}><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
              <div style={{fontSize:".78rem",color:T.textMuted}}>Noch kein Logo hochgeladen</div>
            </div>)}
            <div style={{fontSize:".8rem",color:T.textMuted,marginTop:8,lineHeight:1.6}}>
              <strong style={{color:T.dark}}>Wichtig:</strong> Ihr Logo wird auf einem dunklen Hintergrund angezeigt. Am besten funktioniert ein PNG mit transparentem Hintergrund (mind. 400 {"×"} 150 px).
              <br/>Hat Ihr Logo einen farbigen Hintergrund? Entfernen Sie ihn kostenlos: <a href="https://www.remove.bg/de" target="_blank" rel="noopener noreferrer" style={{color:T.accent,fontWeight:600}}>remove.bg</a>
            </div>
          </div>
        );})()}
        {/* Hero-Bild */}
        {(()=>{const url=assetUrls["hero"];const busy=uploading["hero"];const isPlaceholder=!!order?.hero_is_placeholder;return(
          <div style={{background:"#fff",borderRadius:T.r,padding:"20px 24px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1}}>
            <div className="pt-upload-hdr" style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:url?16:0}}>
              <div>
                <div style={{fontWeight:700,fontSize:".9rem",color:T.dark,marginBottom:2}}>Titelbild {isPlaceholder?<span style={{fontSize:".65rem",fontWeight:600,padding:"2px 8px",borderRadius:100,background:T.amberLight,color:T.amberText,marginLeft:6,verticalAlign:"middle"}}>Beispielfoto</span>:<span style={{fontSize:".75rem",fontWeight:500,color:T.textMuted}}>(optional)</span>}</div>
                <div style={{fontSize:".78rem",color:T.textMuted}}>{isPlaceholder?"Laden Sie ein eigenes Foto hoch für einen persönlicheren Auftritt":"Hintergrundbild für den oberen Bereich der Website"}</div>
              </div>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <label style={{padding:"9px 18px",border:`2px solid ${T.bg3}`,borderRadius:T.rSm,background:busy?T.bg:"#fff",color:T.textSub,cursor:busy?"wait":"pointer",fontSize:".82rem",fontWeight:600,fontFamily:T.font,whiteSpace:"nowrap"}}>
                  {busy?"Lädt...":url?"Ersetzen":"Hochladen"}
                  <input type="file" accept="image/*" style={{display:"none"}} disabled={busy} onChange={e=>{if(e.target.files[0])upload("hero",e.target.files[0]);}}/>
                </label>
                {url&&<button onClick={()=>askDelete("Titelbild",()=>deleteAsset("hero"))} disabled={deleting["hero"]} title="Titelbild entfernen" style={{padding:"9px 12px",border:"2px solid #fca5a5",borderRadius:T.rSm,background:"#fff",color:"#ef4444",cursor:deleting["hero"]?"wait":"pointer",fontSize:".82rem",fontWeight:700,fontFamily:T.font}}>{deleting["hero"]?"...":"×"}</button>}
              </div>
            </div>
            {url&&<>
            <div style={{borderRadius:T.rSm,overflow:"hidden",height:100,background:"#000",position:"relative"}}>
              <img src={url} alt="Hero" style={{width:"100%",height:"100%",objectFit:"cover",opacity:.8}}/>
            </div>
            </>}
            {!url&&<div style={{background:T.bg,borderRadius:T.rSm,padding:"20px 16px",textAlign:"center",marginTop:12}}>
              <div style={{fontSize:".78rem",color:T.textMuted}}>Noch kein Titelbild hochgeladen – Farbverlauf bleibt aktiv</div>
            </div>}
            <div style={{fontSize:".78rem",color:T.textMuted,marginTop:8,lineHeight:1.6}}>Empfohlen: JPG, mind. 1920 &times; 1080 px &middot; Querformat &middot; Ohne Textüberlagerungen (Bild wird automatisch mit Farbverlauf abgedunkelt)</div>
          </div>
        );})()}
        {/* Leistungen-Fotos: jetzt im Leistungen-Editor pro Card */}
        <div style={{background:"#fff",borderRadius:T.r,padding:"16px 24px",border:`1px solid ${T.bg3}`,display:"flex",alignItems:"center",gap:12}}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.accent} strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
          <div style={{fontSize:".82rem",color:T.textSub,lineHeight:1.5}}>Leistungsfotos können Sie direkt im <span style={{fontWeight:700,color:T.accent,cursor:"pointer"}} onClick={()=>nav("leistungen")}>Leistungen-Editor</span> pro Leistung zuordnen.</div>
        </div>
        {/* Über-uns-Fotos */}
        {(()=>{const keys=["about1","about2","about3","about4","about5","about6","about7","about8"];const freeCount=keys.filter(k=>!assetUrls[k]).length;return(
        <div
          style={{background:"#fff",borderRadius:T.r,padding:"20px 24px",border:`1px solid ${dragOverAbout?T.accent:T.bg3}`,boxShadow:T.sh1,transition:"border-color .15s",position:"relative"}}
          onDragOver={e=>{e.preventDefault();if(!dragOverAbout)setDragOverAbout(true);}}
          onDragLeave={e=>{if(!e.currentTarget.contains(e.relatedTarget))setDragOverAbout(false);}}
          onDrop={e=>{e.preventDefault();setDragOverAbout(false);if(e.dataTransfer.files?.length)uploadBatch(e.dataTransfer.files,keys);}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4,gap:12,flexWrap:"wrap"}}>
            <div>
              <div style={{fontSize:".8rem",fontWeight:700,color:T.dark,marginBottom:4}}>Über-uns-Fotos <span style={{fontWeight:400,color:T.textMuted}}>(optional)</span></div>
              <div style={{fontSize:".82rem",color:T.textSub}}>Zeigen Sie Ihren Betrieb — Team, Werkstatt, Atmosphäre, Referenzen. Bis zu 8 Fotos.</div>
            </div>
            {freeCount>0&&<label style={{padding:"8px 14px",border:`1.5px solid ${T.accent}`,borderRadius:T.rSm,background:T.accentLight,color:T.accent,cursor:"pointer",fontSize:".76rem",fontWeight:700,fontFamily:T.font,whiteSpace:"nowrap",display:"inline-flex",alignItems:"center",gap:6}}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
              Mehrere auswählen
              <input type="file" accept="image/*" multiple style={{display:"none"}} onChange={e=>{if(e.target.files?.length)uploadBatch(e.target.files,keys);e.target.value="";}}/>
            </label>}
          </div>
          <div style={{fontSize:".74rem",color:T.textMuted,marginTop:8,marginBottom:16,padding:"8px 12px",background:T.bg,borderRadius:T.rSm,border:`1px dashed ${T.bg3}`}}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{verticalAlign:"-2px",marginRight:6,opacity:.6}}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              Tipp: Sie können mehrere Fotos gleichzeitig hierher ziehen — sie werden automatisch auf freie Plätze verteilt.
          </div>
          <div className="pt-about-grid" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,pointerEvents:dragOverAbout?"none":"auto"}}>
            {keys.map(k=>{const url=assetUrls[k];const busy=uploading[k];return(
              <div key={k} style={{display:"flex",flexDirection:"column",gap:6}}>
                <div style={{aspectRatio:"3/2",borderRadius:T.rSm,background:url?"#000":T.bg,border:`1.5px dashed ${url?"transparent":T.bg3}`,overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  {url?<img src={url} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T.textMuted} strokeWidth="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>}
                </div>
                <div style={{display:"flex",gap:4}}>
                  <label style={{flex:1,textAlign:"center",padding:"6px 0",border:`1.5px solid ${T.bg3}`,borderRadius:T.rSm,background:busy?T.bg:"#fff",color:T.textSub,cursor:busy?"wait":"pointer",fontSize:".72rem",fontWeight:600,fontFamily:T.font}}>
                    {busy?"...":url?"Ersetzen":"Hochladen"}
                    <input type="file" accept="image/*" style={{display:"none"}} disabled={busy} onChange={e=>{if(e.target.files[0])upload(k,e.target.files[0]);}}/>
                  </label>
                  {url&&<button onClick={()=>askDelete("Bild",()=>deleteAsset(k))} disabled={deleting[k]} title="Bild entfernen" style={{padding:"6px 8px",border:"1.5px solid #fca5a5",borderRadius:T.rSm,background:"#fff",color:"#ef4444",cursor:deleting[k]?"wait":"pointer",fontSize:".72rem",fontWeight:700,fontFamily:T.font}}>{deleting[k]?"...":"×"}</button>}
                </div>
              </div>
            );})}
          </div>
          {dragOverAbout&&<div style={{position:"absolute",inset:0,background:"rgba(143,163,184,.12)",borderRadius:T.r,display:"flex",alignItems:"center",justifyContent:"center",pointerEvents:"none",border:`2.5px dashed ${T.accent}`}}>
            <div style={{fontSize:".95rem",fontWeight:800,color:T.accent,background:"#fff",padding:"10px 20px",borderRadius:T.rSm,boxShadow:T.sh2}}>Fotos hier ablegen ({freeCount} {freeCount===1?"freier Platz":"freie Plätze"})</div>
          </div>}
        </div>);})()}
        <div style={{padding:"14px 16px",background:T.accentLight,borderRadius:T.rSm,border:`1px solid rgba(143,163,184,.15)`,fontSize:".78rem",color:T.textSub}}>
          Empfohlen: JPG oder PNG, mindestens 1200px breit, max. 5 MB pro Foto.
        </div>
        {/* Preisliste */}
        {getBrancheFeatures(order?.branche).includes("preisliste")&&(()=>{const url=assetUrls.preisliste;const busy=uploading.preisliste;return(
          <div style={{background:"#fff",borderRadius:T.r,padding:"20px 24px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1}}>
            <div className="pt-upload-hdr" style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:url?16:0}}>
              <div>
                <div style={{fontWeight:700,fontSize:".9rem",color:T.dark,marginBottom:2}}>Preisliste <span style={{fontSize:".75rem",fontWeight:500,color:T.textMuted}}>(optional)</span></div>
                <div style={{fontSize:".78rem",color:T.textMuted}}>PDF oder Bild Ihrer Preisliste — wird auf der Website als Download angeboten</div>
              </div>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <label style={{padding:"9px 18px",border:`2px solid ${T.bg3}`,borderRadius:T.rSm,background:busy?T.bg:"#fff",color:T.textSub,cursor:busy?"wait":"pointer",fontSize:".82rem",fontWeight:600,fontFamily:T.font,whiteSpace:"nowrap"}}>
                  {busy?"Lädt...":url?"Ersetzen":"Hochladen"}
                  <input type="file" accept="image/*,.pdf" style={{display:"none"}} disabled={busy} onChange={e=>{if(e.target.files[0])upload("preisliste",e.target.files[0]);}}/>
                </label>
                {url&&<button onClick={()=>askDelete("Preisliste",()=>deleteAsset("preisliste"))} disabled={deleting.preisliste} title="Preisliste entfernen" style={{padding:"9px 12px",border:"2px solid #fca5a5",borderRadius:T.rSm,background:"#fff",color:"#ef4444",cursor:deleting.preisliste?"wait":"pointer",fontSize:".82rem",fontWeight:700,fontFamily:T.font}}>{deleting.preisliste?"...":"×"}</button>}
              </div>
            </div>
            {url&&<div style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",background:T.greenLight,borderRadius:T.rSm,border:`1px solid rgba(22,163,74,.15)`}}>
              <span style={{fontSize:"1.1rem"}}>📄</span>
              <div style={{flex:1}}>
                <div style={{fontWeight:600,fontSize:".82rem",color:T.green}}>Preisliste hochgeladen</div>
                <div style={{fontSize:".75rem",color:T.textMuted,marginTop:2}}>Wird auf Ihrer Website als „Preisliste ansehen"-Button angezeigt</div>
              </div>
              <a href={url} target="_blank" rel="noreferrer" style={{padding:"6px 14px",background:T.accent,color:"#fff",borderRadius:T.rSm,fontSize:".78rem",fontWeight:700,textDecoration:"none",fontFamily:T.font}}>Ansehen</a>
            </div>}
            {!url&&<div style={{background:T.bg,borderRadius:T.rSm,padding:"20px 16px",textAlign:"center",marginTop:12}}>
              <div style={{fontSize:"1.6rem",marginBottom:4}}>📄</div>
              <div style={{fontSize:".78rem",color:T.textMuted}}>Noch keine Preisliste hochgeladen</div>
            </div>}
          </div>
        );})()}
        {/* Fotogalerie */}
        {(()=>{const items=Array.isArray(order?.galerie)?order.galerie.filter(g=>g&&g.url):[];const maxItems=12;const canAdd=items.length<maxItems;const uploadGalerie=async(files)=>{
          if(!session?.user?.id||!supabase){showToast("Nicht eingeloggt");return;}
          const imageFiles=Array.from(files).filter(f=>f.type.startsWith("image/"));
          if(!imageFiles.length){showToast("Nur Bilddateien möglich");return;}
          const free=maxItems-items.length;
          const toUpload=imageFiles.slice(0,free);
          const skipped=imageFiles.length-toUpload.length;
          setUploading(u=>({...u,galerie:true}));
          try{
            const newItems=[...items];
            for(const file of toUpload){
              const ts=Date.now()+Math.floor(Math.random()*1000);
              const extMap={"image/png":"png","image/webp":"webp","image/gif":"gif"};
              const ext=extMap[file.type]||"jpg";
              const path=`${session.user.id}/galerie_${ts}.${ext}`;
              const{error}=await supabase.storage.from("customer-assets").upload(path,file,{upsert:false,contentType:file.type||"image/jpeg"});
              if(error){showToast("Upload fehlgeschlagen: "+error.message);continue;}
              const{data}=supabase.storage.from("customer-assets").getPublicUrl(path);
              newItems.push({url:data.publicUrl+"?v="+ts,path});
            }
            await supabase.from("orders").update({galerie:newItems}).eq("id",order.id);
            setOrder(o=>({...o,galerie:newItems}));
            if(originalOrderRef.current)originalOrderRef.current={...originalOrderRef.current,galerie:newItems};
            showToast(skipped>0?`${toUpload.length} hochgeladen, ${skipped} übersprungen (max ${maxItems})`:`${toUpload.length} Foto${toUpload.length===1?"":"s"} hochgeladen`);
          }catch(e){showToast("Fehler: "+e.message);}
          setUploading(u=>({...u,galerie:false}));
        };
        const deleteGalerieItem=async(idx)=>{
          const item=items[idx];if(!item)return;
          askDelete("Foto",async()=>{
            const newItems=items.filter((_,i)=>i!==idx);
            if(item.path){try{await supabase.storage.from("customer-assets").remove([item.path]);}catch(_){}}
            await supabase.from("orders").update({galerie:newItems}).eq("id",order.id);
            setOrder(o=>({...o,galerie:newItems}));
            if(originalOrderRef.current)originalOrderRef.current={...originalOrderRef.current,galerie:newItems};
            showToast("Foto entfernt");
          });
        };
        return(
          <div
            style={{background:"#fff",borderRadius:T.r,padding:"20px 24px",border:`1px solid ${dragOverGalerie?T.accent:T.bg3}`,boxShadow:T.sh1,transition:"border-color .15s",position:"relative"}}
            onDragOver={canAdd?e=>{e.preventDefault();if(!dragOverGalerie)setDragOverGalerie(true);}:undefined}
            onDragLeave={canAdd?e=>{if(!e.currentTarget.contains(e.relatedTarget))setDragOverGalerie(false);}:undefined}
            onDrop={canAdd?e=>{e.preventDefault();setDragOverGalerie(false);if(e.dataTransfer.files?.length)uploadGalerie(e.dataTransfer.files);}:undefined}>
            <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:12,marginBottom:4,flexWrap:"wrap"}}>
              <div>
                <div style={{fontWeight:700,fontSize:".9rem",color:T.dark,marginBottom:2}}>Fotogalerie <span style={{fontSize:".75rem",fontWeight:500,color:T.textMuted}}>(optional)</span></div>
                <div style={{fontSize:".78rem",color:T.textMuted}}>Eigener Galerie-Bereich auf der Website. Bis zu {maxItems} Fotos.</div>
              </div>
              {canAdd&&<label style={{padding:"8px 14px",border:`1.5px solid ${T.accent}`,borderRadius:T.rSm,background:T.accentLight,color:T.accent,cursor:uploading.galerie?"wait":"pointer",fontSize:".76rem",fontWeight:700,fontFamily:T.font,whiteSpace:"nowrap",display:"inline-flex",alignItems:"center",gap:6}}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
                {uploading.galerie?"Lädt...":"Fotos hinzufügen"}
                <input type="file" accept="image/*" multiple disabled={uploading.galerie} style={{display:"none"}} onChange={e=>{if(e.target.files?.length){uploadGalerie(e.target.files);e.target.value="";}}}/>
              </label>}
            </div>
            <div style={{marginTop:16}}/>
            <VisibilityToggle field="galerie" labelOn="Galerie erscheint auf Ihrer Website" labelOff="Galerie wird nicht angezeigt" hasContent={(order.galerie||[]).filter(g=>g&&g.url).length>0} contentHint="Mindestens ein Foto in der Galerie nötig."/>
            <div style={{opacity:order.sections_visible?.galerie===false?0.55:1,transition:"opacity .2s"}}>
              {items.length>0?<>
                <div style={{fontSize:".74rem",color:T.textMuted,marginBottom:8}}>{items.length} / {maxItems} {items.length===1?"Foto":"Fotos"}</div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
                  {items.map((g,i)=><div key={i} style={{aspectRatio:"3/2",borderRadius:T.rSm,overflow:"hidden",background:"#000",position:"relative"}}>
                    <img src={g.url} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                    <button onClick={()=>deleteGalerieItem(i)} title="Foto entfernen" style={{position:"absolute",top:6,right:6,width:24,height:24,border:"none",borderRadius:"50%",background:"rgba(0,0,0,.6)",color:"#fff",cursor:"pointer",fontSize:".82rem",fontWeight:700,fontFamily:T.font,display:"flex",alignItems:"center",justifyContent:"center",padding:0}}>{"×"}</button>
                  </div>)}
                </div>
              </>:<div style={{padding:"28px 20px",background:T.bg,borderRadius:T.rSm,textAlign:"center"}}>
                <div style={{fontSize:"1.8rem",marginBottom:8}}>📷</div>
                <div style={{fontSize:".92rem",fontWeight:700,color:T.dark,marginBottom:4}}>Noch keine Fotos</div>
                <div style={{fontSize:".82rem",color:T.textMuted,lineHeight:1.5,maxWidth:340,margin:"0 auto"}}>Klicken Sie oben auf „Fotos hinzufügen" oder ziehen Sie Bilder direkt hierher.</div>
              </div>}
            </div>
            {dragOverGalerie&&<div style={{position:"absolute",inset:0,background:"rgba(143,163,184,.12)",borderRadius:T.r,display:"flex",alignItems:"center",justifyContent:"center",pointerEvents:"none",border:`2.5px dashed ${T.accent}`}}>
              <div style={{fontSize:".9rem",fontWeight:700,color:T.accent,background:"#fff",padding:"10px 16px",borderRadius:T.rSm}}>Hier loslassen zum Hochladen</div>
            </div>}
          </div>
        );})()}
      </div>)}

      {/* Tab: Domain */}
      {page==="seo"&&order?.status==="trial"&&(<div style={{background:"#fff",borderRadius:T.r,padding:"40px 32px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1,textAlign:"center"}}>
        <div style={{fontSize:"1.2rem",marginBottom:16,color:T.textMuted}}>⚿</div>
        <h2 style={{fontSize:"1.1rem",fontWeight:800,color:T.dark,margin:"0 0 8px"}}>SEO & Google ab aktivem Abo</h2>
        <p style={{fontSize:".88rem",color:T.textSub,lineHeight:1.65,marginBottom:20,maxWidth:340,margin:"0 auto 20px"}}>Google-Indexierung und SEO-Einstellungen sind nach dem Abo-Abschluss aktiv.</p>
        <button onClick={()=>setShowPlanModal(true)} style={{padding:"11px 24px",border:"none",borderRadius:T.rSm,background:T.accent,color:"#fff",cursor:"pointer",fontSize:".88rem",fontWeight:700,fontFamily:T.font}}>Jetzt abonnieren {"→"}</button>
      </div>)}
      {page==="seo"&&order?.status!=="trial"&&(<div style={{display:"flex",flexDirection:"column",gap:16}}>
        <div style={{background:"#fff",borderRadius:T.r,padding:"24px 28px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1}}>
          <div style={{fontSize:".8rem",fontWeight:700,color:T.dark,marginBottom:12}}>Google Indexierung</div>
          {order?.status==="live"
            ?<div style={{display:"flex",alignItems:"center",gap:12,padding:"14px 18px",background:T.greenLight,borderRadius:T.rSm,border:`1px solid rgba(22,163,74,.2)`}}>
              <span style={{fontSize:"1rem",color:T.green,fontWeight:800}}>✓</span>
              <div><div style={{fontWeight:700,color:T.green,fontSize:".9rem"}}>Ihre Website ist für Google sichtbar</div><div style={{fontSize:".82rem",color:T.textSub,marginTop:3}}>Google kann Ihre Website unter <strong>{sub}.siteready.at</strong> indexieren und in den Suchergebnissen anzeigen.</div></div>
            </div>
            :<div style={{display:"flex",alignItems:"center",gap:12,padding:"14px 18px",background:T.amberLight,borderRadius:T.rSm,border:"1px solid #fcd34d"}}>
              <span style={{fontSize:"1rem",color:T.amberText,fontWeight:800}}>⏳</span>
              <div><div style={{fontWeight:700,color:T.amberText,fontSize:".9rem"}}>Indexierung aktiv nach Livegang</div><div style={{fontSize:".82rem",color:"#78350f",marginTop:3}}>Sobald Ihre Website live geschaltet wird, entfernen wir die noindex-Markierung und Google kann Ihre Website finden.</div></div>
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
              <div style={{fontSize:".82rem",color:T.textMuted,marginTop:2}}>{order.quality_score>=90?"Ihre Website ist optimal aufgestellt.":"Mit wenigen Schritten können Sie den Score verbessern."}</div>
            </div>
          </div>
          {order.quality_score<95&&<div style={{display:"flex",flexDirection:"column",gap:8}}>
            {!assetUrls.logo&&<div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:T.bg,borderRadius:T.rSm,border:`1px solid ${T.bg3}`}}>
              <span style={{fontSize:".8rem",color:"#d97706",fontWeight:700,flexShrink:0}}>+10</span>
              <span style={{fontSize:".82rem",color:T.dark}}>Logo hochladen</span>
              <button onClick={()=>nav("hero")} style={{marginLeft:"auto",fontSize:".78rem",color:T.accent,background:"none",border:"none",cursor:"pointer",fontFamily:T.font,fontWeight:600}}>Jetzt {"→"}</button>
            </div>}
            {!(assetUrls.foto1||assetUrls.foto2||assetUrls.foto3)&&<div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:T.bg,borderRadius:T.rSm,border:`1px solid ${T.bg3}`}}>
              <span style={{fontSize:".8rem",color:"#d97706",fontWeight:700,flexShrink:0}}>+10</span>
              <span style={{fontSize:".82rem",color:T.dark}}>Fotos hochladen</span>
              <button onClick={()=>nav("hero")} style={{marginLeft:"auto",fontSize:".78rem",color:T.accent,background:"none",border:"none",cursor:"pointer",fontFamily:T.font,fontWeight:600}}>Jetzt {"→"}</button>
            </div>}
            {!order.telefon&&<div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:T.bg,borderRadius:T.rSm,border:`1px solid ${T.bg3}`}}>
              <span style={{fontSize:".8rem",color:"#d97706",fontWeight:700,flexShrink:0}}>+5</span>
              <span style={{fontSize:".82rem",color:T.dark}}>Telefonnummer ergänzen</span>
              <button onClick={()=>nav("kontakt")} style={{marginLeft:"auto",fontSize:".78rem",color:T.accent,background:"none",border:"none",cursor:"pointer",fontFamily:T.font,fontWeight:600}}>Jetzt {"→"}</button>
            </div>}
            {!order.kurzbeschreibung&&<div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:T.bg,borderRadius:T.rSm,border:`1px solid ${T.bg3}`}}>
              <span style={{fontSize:".8rem",color:"#d97706",fontWeight:700,flexShrink:0}}>+5</span>
              <span style={{fontSize:".82rem",color:T.dark}}>Kurzbeschreibung hinzufügen</span>
              <button onClick={()=>nav("hero")} style={{marginLeft:"auto",fontSize:".78rem",color:T.accent,background:"none",border:"none",cursor:"pointer",fontFamily:T.font,fontWeight:600}}>Jetzt {"→"}</button>
            </div>}
          </div>}
        </div>}
        {/* Eigene Domain */}
        <div style={{background:"#fff",borderRadius:T.r,padding:"24px 28px",border:`1px solid ${T.bg3}`,boxShadow:T.sh1}}>
          <div style={{fontSize:".8rem",fontWeight:700,color:T.dark,marginBottom:10}}>Eigene Domain verbinden</div>
          <p style={{fontSize:".88rem",color:T.textSub,lineHeight:1.7,marginBottom:16}}>
            Aktuell ist Ihre Website unter <strong>{sub}.siteready.at</strong> erreichbar. Mit einer eigenen Domain (z.B. <strong>www.{sub}.at</strong>) erscheint Ihre Website noch professioneller.
          </p>
          <div style={{marginBottom:16}}>
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
      </div>
    </main>
    {!wizardAllDone&&order&&<aside className={`pt-ast ${wizardOpen?"wiz-open":"wiz-closed"}`}>
      {wizardOpen?<>
      <div className="pt-ast-h">
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div className="pt-ast-title">Einrichtungsassistent</div>
          <button onClick={()=>setWizardOpen(false)} style={{background:"none",border:"none",cursor:"pointer",color:"#9CA3AF",padding:4,display:"flex"}} title="Einklappen">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
        </div>
        <div className="pt-ast-sub">{wizardDoneCount} von {wizardTotal} erledigt</div>
        <div className="pt-ast-bar-wrap"><div className="pt-ast-bar-fill" style={{width:`${Math.round(wizardDoneCount/wizardTotal*100)}%`}}/></div>
      </div>
      <div className="pt-ast-divider"/>
      <div className="pt-ast-scroll">
        {wizardSteps.map((step,idx)=>{
          const isCurrent=idx===wizardCurrentIdx;
          const isLast=idx===wizardSteps.length-1;
          return(<div key={idx} className="pt-wiz-step">
            {!isLast&&<div className={`pt-wiz-line ${step.done?"done":isCurrent?"current":"pending"}`}/>}
            <button className="pt-ast-item" onClick={()=>nav(step.page)} style={{paddingLeft:0}}>
              <div className={`pt-wiz-num ${step.done?"done":isCurrent?"current":"pending"}`}>
                {step.done?<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>:<span>{idx+1}</span>}
              </div>
              <span style={{fontSize:".82rem",fontWeight:isCurrent?700:500,color:step.done?"#9CA3AF":isCurrent?"#111":"#6B7280"}}>{step.label}</span>
            </button>
            {isCurrent&&<div className="pt-wiz-curr">
              <div className="pt-wiz-curr-desc">{step.desc}</div>
              <button className="pt-wiz-curr-btn" onClick={()=>nav(step.page)}>Jetzt ausfüllen {"→"}</button>
            </div>}
          </div>);
        })}
        {wizardOptional.length>0&&<>
          <div style={{fontSize:".68rem",fontWeight:700,color:"#9CA3AF",textTransform:"uppercase",letterSpacing:".08em",padding:"14px 0 6px"}}>Optional</div>
          {wizardOptional.map((item,idx)=>{
            const needsReview=!item.done&&item.label.includes("prüfen")&&!item.warn;
            return <div key={idx}>
              <button className="pt-ast-item" onClick={()=>nav(item.page)} style={{paddingLeft:0}}>
                <div className={`pt-ast-ck${item.done?" done":""}`} style={item.warn?{background:T.amberLight,borderColor:T.amberBorder}:undefined}>
                  {item.warn
                    ?<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={T.amberText} strokeWidth="3"><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    :<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                </div>
                <span className={`pt-ast-label${item.done?" done":""}`} style={item.warn?{color:T.amberText,fontWeight:600}:undefined}>{item.label}</span>
                {needsReview&&<span style={{fontSize:".6rem",padding:"1px 6px",borderRadius:100,background:T.amberLight,color:T.amberText,fontWeight:600,marginLeft:4,flexShrink:0}}>prüfen</span>}
              </button>
              {(needsReview||item.warn)&&item.desc&&<div style={{paddingLeft:28,marginTop:-4,marginBottom:8,fontSize:".75rem",color:item.warn?T.amberText:T.textMuted,lineHeight:1.5}}>{item.desc}</div>}
            </div>;
          })}
        </>}
      </div>
      </>:<div className="pt-wiz-collapsed" onClick={()=>setWizardOpen(true)} title="Assistent öffnen">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
        <div style={{width:28,height:28,borderRadius:"50%",background:T.greenBright,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          <span style={{fontSize:".7rem",fontWeight:800,color:"#fff"}}>{wizardDoneCount}</span>
        </div>
        <div className="pt-wiz-cbadge">{wizardDoneCount} von {wizardTotal}</div>
      </div>}
    </aside>}
    {/* Floating Progress-Pill + Bottom-Sheet (Tablet & Mobile) */}
    {!wizardAllDone&&order&&<>
      <button className="pt-wiz-pill" onClick={()=>setPtWizOpen(true)} aria-label="Einrichtungsassistent öffnen" style={{"--p":Math.round(wizardDoneCount/wizardTotal*100)}}>
        <span className="pt-wiz-pill-ring"><span className="pt-wiz-pill-cnt">{wizardDoneCount}</span></span>
        <span>{wizardDoneCount}/{wizardTotal} erledigt</span>
      </button>
      <div className={`pt-wiz-sheet-bd${ptWizOpen?" open":""}`} onClick={()=>setPtWizOpen(false)}/>
      <div className={`pt-wiz-sheet${ptWizOpen?" open":""}`} role="dialog" aria-label="Einrichtungsassistent">
        <div className="pt-wiz-sheet-handle" onClick={()=>setPtWizOpen(false)}><span/></div>
        <div className="pt-wiz-sheet-h">
          <div className="pt-wiz-sheet-h-top">
            <div className="pt-wiz-sheet-title">Einrichtungsassistent</div>
            <button className="pt-wiz-sheet-close" onClick={()=>setPtWizOpen(false)} aria-label="Schließen">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div className="pt-wiz-sheet-sub">{wizardDoneCount} von {wizardTotal} Pflichtschritten erledigt</div>
          <div className="pt-wiz-sheet-bar"><div style={{width:`${Math.round(wizardDoneCount/wizardTotal*100)}%`}}/></div>
        </div>
        <div className="pt-wiz-sheet-body">
          {wizardSteps.map((step,idx)=>{
            const isCurrent=idx===wizardCurrentIdx;
            const isLast=idx===wizardSteps.length-1;
            return(<div key={idx} className="pt-wiz-step">
              {!isLast&&<div className={`pt-wiz-line ${step.done?"done":isCurrent?"current":"pending"}`}/>}
              <button className="pt-ast-item" onClick={()=>{setPtWizOpen(false);nav(step.page);}} style={{paddingLeft:0}}>
                <div className={`pt-wiz-num ${step.done?"done":isCurrent?"current":"pending"}`}>
                  {step.done?<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>:<span>{idx+1}</span>}
                </div>
                <span style={{fontSize:".88rem",fontWeight:isCurrent?700:500,color:step.done?"#9CA3AF":isCurrent?"#111":"#6B7280"}}>{step.label}</span>
              </button>
              {isCurrent&&<div className="pt-wiz-curr">
                <div className="pt-wiz-curr-desc">{step.desc}</div>
                <button className="pt-wiz-curr-btn" onClick={()=>{setPtWizOpen(false);nav(step.page);}}>Jetzt ausfüllen {"→"}</button>
              </div>}
            </div>);
          })}
          {wizardOptional.length>0&&<>
            <div style={{fontSize:".7rem",fontWeight:700,color:"#9CA3AF",textTransform:"uppercase",letterSpacing:".08em",padding:"18px 0 8px"}}>Optional</div>
            {wizardOptional.map((item,idx)=>{
              const needsReview=!item.done&&item.label.includes("prüfen")&&!item.warn;
              return <div key={idx}>
                <button className="pt-ast-item" onClick={()=>{setPtWizOpen(false);nav(item.page);}} style={{paddingLeft:0}}>
                  <div className={`pt-ast-ck${item.done?" done":""}`} style={item.warn?{background:T.amberLight,borderColor:T.amberBorder}:undefined}>
                    {item.warn
                      ?<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={T.amberText} strokeWidth="3"><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                      :<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                  </div>
                  <span className={`pt-ast-label${item.done?" done":""}`} style={item.warn?{color:T.amberText,fontWeight:600}:undefined}>{item.label}</span>
                  {needsReview&&<span style={{fontSize:".62rem",padding:"1px 6px",borderRadius:100,background:T.amberLight,color:T.amberText,fontWeight:600,marginLeft:4,flexShrink:0}}>prüfen</span>}
                </button>
                {(needsReview||item.warn)&&item.desc&&<div style={{paddingLeft:28,marginTop:-4,marginBottom:10,fontSize:".78rem",color:item.warn?T.amberText:T.textMuted,lineHeight:1.5}}>{item.desc}</div>}
              </div>;
            })}
          </>}
        </div>
      </div>
    </>}
    {/* Welcome-Tour beim ersten Besuch */}
    {welcomeOpen&&order&&(()=>{
      const slides=[
        {emoji:"👋",title:"Willkommen in Ihrem Portal",desc:"Hier pflegen Sie alle Inhalte Ihrer Website. Jede Änderung ist sofort live.",hint:"Links die Navigation, rechts Ihr Fortschritt."},
        {emoji:"✏️",title:"So bearbeiten Sie Ihre Website",desc:"Klicken Sie links auf einen Bereich wie Titelbild oder Leistungen. Alle Änderungen speichern sich automatisch.",hint:"Der orangene Punkt zeigt, wo noch Pflicht-Angaben fehlen."},
        {emoji:"🚀",title:"Einrichtungsassistent hilft",desc:"Rechts sehen Sie, was noch zu tun ist. Die Karte Jetzt dran auf der Übersicht zeigt immer Ihren nächsten Schritt.",hint:"Schritt für Schritt zur fertigen Website."},
      ];
      const s=slides[welcomeStep];
      const isLast=welcomeStep===slides.length-1;
      return(<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.55)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:20,animation:"srfadein .25s ease"}}>
        <style>{`@keyframes srfadein{from{opacity:0}to{opacity:1}}`}</style>
        <div style={{background:"#fff",borderRadius:16,padding:"32px 32px 24px",maxWidth:460,width:"100%",boxShadow:"0 20px 60px rgba(0,0,0,.3)",position:"relative"}}>
          <button onClick={closeWelcome} aria-label="Schließen" style={{position:"absolute",top:14,right:14,background:"none",border:"none",cursor:"pointer",color:T.textMuted,padding:6,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
          <div style={{fontSize:"3rem",lineHeight:1,marginBottom:18,textAlign:"center"}}>{s.emoji}</div>
          <h2 style={{fontSize:"1.4rem",fontWeight:800,color:T.dark,margin:"0 0 10px",letterSpacing:"-.02em",textAlign:"center"}}>{s.title}</h2>
          <p style={{fontSize:".95rem",color:T.textSub,lineHeight:1.6,margin:"0 0 10px",textAlign:"center"}}>{s.desc}</p>
          <div style={{fontSize:".82rem",color:T.textMuted,textAlign:"center",marginBottom:24,fontStyle:"italic"}}>{s.hint}</div>
          {/* Dots */}
          <div style={{display:"flex",justifyContent:"center",gap:7,marginBottom:22}}>
            {slides.map((_,i)=><div key={i} style={{width:i===welcomeStep?20:7,height:7,borderRadius:100,background:i===welcomeStep?T.accent:T.bg3,transition:"width .25s"}}/>)}
          </div>
          <div style={{display:"flex",gap:10}}>
            {welcomeStep>0&&<button onClick={()=>setWelcomeStep(welcomeStep-1)} style={{flex:"0 0 auto",padding:"11px 18px",border:`1.5px solid ${T.bg3}`,borderRadius:T.rSm,background:"#fff",color:T.textSub,cursor:"pointer",fontSize:".88rem",fontWeight:600,fontFamily:T.font}}>Zurück</button>}
            <button onClick={closeWelcome} style={{flex:"0 0 auto",padding:"11px 14px",border:"none",background:"none",color:T.textMuted,cursor:"pointer",fontSize:".82rem",fontFamily:T.font}}>Überspringen</button>
            <div style={{flex:1}}/>
            <button onClick={()=>isLast?closeWelcome():setWelcomeStep(welcomeStep+1)} style={{padding:"11px 22px",border:"none",borderRadius:T.rSm,background:T.accent,color:"#fff",cursor:"pointer",fontSize:".9rem",fontWeight:700,fontFamily:T.font,display:"inline-flex",alignItems:"center",gap:8}}>{isLast?"Los geht's":"Weiter"} <span>{"→"}</span></button>
          </div>
        </div>
      </div>);
    })()}
  </div>);
}

/* ═══ BUILD SCREEN (eigene Komponente wg. React Hooks Regeln) ═══ */
function BuildScreen({session,setOrder}){
  const BUILD_PHASES=[
    {icon:"📋",label:"Daten werden analysiert",sub:"Branche, Leistungen & Kontaktdaten",dur:6},
    {icon:"✍️",label:"Texte werden geschrieben",sub:"Über uns, Leistungsbeschreibungen & SEO",dur:18},
    {icon:"🎨",label:"Design wird angewendet",sub:"Farben, Schriften & Layout",dur:12},
    {icon:"🖼️",label:"Medien werden eingebaut",sub:"Logo, Fotos & Icons",dur:8},
    {icon:"🔍",label:"Qualitätsprüfung",sub:"Performance, SEO & Rechtliches",dur:10},
    {icon:"✅",label:"Website wird veröffentlicht",sub:"DNS & SSL-Zertifikat",dur:6}
  ];
  const totalDur=BUILD_PHASES.reduce((s,p)=>s+p.dur,0);
  const [buildElapsed,setBuildElapsed]=useState(0);
  const buildRef=useRef(null);
  useEffect(()=>{
    buildRef.current=setInterval(()=>setBuildElapsed(e=>e+1),1000);
    return()=>clearInterval(buildRef.current);
  },[]);
  const[buildError,setBuildError]=useState(null);
  useEffect(()=>{
    if(buildElapsed>0&&buildElapsed%5===0){
      (async()=>{
        const{data}=await supabase.from("orders").select("*").eq("user_id",session.user.id).order("created_at",{ascending:false}).limit(1);
        if(data&&data[0]){
          if(data[0].status!=="pending"){setOrder(data[0]);return;}
          if(data[0].last_error)setBuildError(data[0].last_error);
        }
      })();
    }
  },[buildElapsed]); // eslint-disable-line react-hooks/exhaustive-deps
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
          {done&&<div style={{fontSize:".75rem",color:T.green,fontWeight:700}}>{"✓"}</div>}
          {active&&<div style={{width:12,height:12,borderRadius:"50%",border:`2px solid ${T.accent}`,borderTopColor:"transparent",animation:"spin 1s linear infinite"}}/>}
        </div>);
      })}
    </div>
    {/* Fehler-Anzeige */}
    {buildError&&<div style={{marginTop:24,padding:"16px 20px",background:T.redLight,border:"1px solid #fca5a5",borderRadius:T.rSm,textAlign:"center"}}>
      <div style={{fontWeight:700,color:T.red,fontSize:".88rem",marginBottom:6}}>Fehler bei der Generierung</div>
      <div style={{fontSize:".8rem",color:"#7f1d1d",lineHeight:1.5,marginBottom:12}}>{buildError}</div>
      <button onClick={async()=>{setBuildError(null);setBuildElapsed(0);try{const{data}=await supabase.from("orders").select("id").eq("user_id",session.user.id).order("created_at",{ascending:false}).limit(1);if(data?.[0])await fetch("/api/start-build",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({order_id:data[0].id})});}catch(_){}}} style={{padding:"10px 20px",background:"#dc2626",color:"#fff",border:"none",borderRadius:T.rSm,cursor:"pointer",fontWeight:700,fontSize:".82rem",fontFamily:T.font}}>Erneut versuchen</button>
    </div>}
    {/* Timeout-Hinweis */}
    {!buildError&&buildElapsed>180&&<div style={{marginTop:24,padding:"16px 20px",background:"#fffbeb",border:"1px solid #fcd34d",borderRadius:T.rSm,textAlign:"center"}}>
      <div style={{fontWeight:700,color:T.amberText,fontSize:".85rem",marginBottom:4}}>Das dauert länger als erwartet</div>
      <div style={{fontSize:".78rem",color:"#78350f",lineHeight:1.5,marginBottom:12}}>Die Generierung läuft normalerweise 1-2 Minuten. Falls sie hängt, kannst du sie neu starten — dein Fortschritt bleibt gespeichert.</div>
      <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap"}}>
        <button onClick={async()=>{setBuildElapsed(0);try{const{data}=await supabase.from("orders").select("id").eq("user_id",session.user.id).order("created_at",{ascending:false}).limit(1);if(data?.[0])await fetch("/api/start-build",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({order_id:data[0].id})});}catch(_){}}} style={{padding:"8px 18px",background:T.amberText,color:"#fff",border:"none",borderRadius:T.rSm,cursor:"pointer",fontWeight:700,fontSize:".82rem",fontFamily:T.font}}>Erneut generieren</button>
        <button onClick={()=>window.location.reload()} style={{padding:"8px 18px",background:"#fff",color:T.amberText,border:`1.5px solid ${T.amberText}`,borderRadius:T.rSm,cursor:"pointer",fontWeight:700,fontSize:".82rem",fontFamily:T.font}}>Seite neu laden</button>
      </div>
    </div>}
    <p style={{textAlign:"center",fontSize:".75rem",color:T.textMuted,marginTop:24}}>Status wird automatisch aktualisiert</p>
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
  const orderInProgressRef=useRef(false);
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
      if(session&&!orderInProgressRef.current){setPageRaw("portal");navigate("portal");}
      else if(session&&orderInProgressRef.current){
        // Warte bis Build-Animation fertig (~18s), dann wechseln
        const wait=setInterval(()=>{if(!orderInProgressRef.current){clearInterval(wait);setPageRaw("portal");navigate("portal");}},200);
        setTimeout(()=>clearInterval(wait),25000);
      }
    });
    return()=>{subscription.unsubscribe();window.removeEventListener("popstate",onPop);};
  },[]);

  if(page==="portal")return session?<Portal session={session} onLogout={()=>{supabase.auth.signOut();setSession(null);setPage("landing")}}/>:<PortalLogin onBack={()=>setPage("landing")}/>;
  if(page==="portal-login")return<PortalLogin onBack={()=>setPage("landing")}/>;

  // Admin Dashboard (key-geschützt)
  const adminKey=process.env.REACT_APP_ADMIN_KEY;
  const urlKey=new URLSearchParams(window.location.search).get("key");
  if(window.location.pathname==="/admin"&&adminKey&&urlKey===adminKey)return<Admin adminKey={adminKey}/>;

  if(paymentStatus==="success"){
    const pendingEmail=localStorage.getItem("sr_pending_email")||"";
    return(
    <div style={{minHeight:"100vh",background:"#fff",fontFamily:T.font,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:0,textAlign:"center",padding:"0 24px"}}><style>{css}</style>
      <div style={{width:72,height:72,borderRadius:"50%",background:T.greenLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"2rem",marginBottom:24,border:"2px solid rgba(22,163,74,.2)"}}>{"✓"}</div>
      <h1 style={{fontSize:"2rem",fontWeight:800,color:T.dark,margin:"0 0 12px",letterSpacing:"-.03em"}}>Zahlung erfolgreich!</h1>
      <p style={{color:T.textSub,fontSize:".95rem",lineHeight:1.7,maxWidth:440,margin:"0 0 20px"}}>Vielen Dank für Ihre Bestellung. Wir erstellen Ihre Website und melden uns in Kürze.</p>
      {pendingEmail&&<div style={{display:"flex",alignItems:"flex-start",gap:10,background:"#fefce8",border:`1px solid ${T.amberBorder}`,borderRadius:T.rSm,padding:"12px 16px",marginBottom:24,maxWidth:400,textAlign:"left"}}>
        <span style={{fontSize:"1rem",flexShrink:0}}>✉️</span>
        <span style={{fontSize:".82rem",color:T.amberText,lineHeight:1.6}}>Bitte bestätigen Sie Ihre E-Mail-Adresse (<strong>{pendingEmail}</strong>) – wir haben Ihnen einen Bestätigungslink gesendet. Erst danach ist der Portal-Login möglich.</span>
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
  if(page==="success"){if(!data.firmenname){setPage("form");return null;}return<SuccessPage data={data} onBack={()=>setPage("form")} onPortal={()=>setPage("portal-login")} orderInProgressRef={orderInProgressRef}/>;};
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
