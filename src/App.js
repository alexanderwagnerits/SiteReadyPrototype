import { useState, useCallback, useRef, useEffect } from "react";

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
const STYLES_MAP={
  professional:{label:"Professionell & serioes",desc:"Klare Linien, gedaempfte Farben",primary:"#0f2b5b",accent:"#2563eb",accentSoft:"rgba(37,99,235,0.07)",bg:"#f8fafc",cardBg:"#fff",text:"#0f172a",textMuted:"#64748b",textLight:"#94a3b8",borderColor:"#e2e8f0",font:"'Inter',system-ui,sans-serif",radius:"6px",radiusLg:"10px",heroGradient:"linear-gradient(160deg,#0f2b5b 0%,#1e40af 50%,#2563eb 100%)",heroOverlay:"radial-gradient(circle at 70% 20%,rgba(255,255,255,0.08) 0%,transparent 60%)",shadow:"0 1px 3px rgba(15,43,91,0.06)",badgeBg:"#dbeafe",badgeText:"#1e40af"},
  modern:{label:"Modern & frisch",desc:"Helle Akzente, frische Farbpalette",primary:"#065f46",accent:"#10b981",accentSoft:"rgba(16,185,129,0.07)",bg:"#f0fdf4",cardBg:"#fff",text:"#052e16",textMuted:"#4b7c6a",textLight:"#86b5a1",borderColor:"#d1fae5",font:"'DM Sans',system-ui,sans-serif",radius:"12px",radiusLg:"16px",heroGradient:"linear-gradient(135deg,#065f46 0%,#047857 40%,#10b981 100%)",heroOverlay:"radial-gradient(ellipse at 80% 30%,rgba(255,255,255,0.12) 0%,transparent 50%)",shadow:"0 1px 3px rgba(6,95,70,0.06)",badgeBg:"#d1fae5",badgeText:"#065f46"},
  traditional:{label:"Bodenstaendig & vertraut",desc:"Warme Toene, solider Auftritt",primary:"#78350f",accent:"#d97706",accentSoft:"rgba(217,119,6,0.07)",bg:"#fffbeb",cardBg:"#fff",text:"#451a03",textMuted:"#92713a",textLight:"#b8a070",borderColor:"#fde68a",font:"'Source Serif 4',Georgia,serif",radius:"4px",radiusLg:"8px",heroGradient:"linear-gradient(160deg,#78350f 0%,#92400e 50%,#b45309 100%)",heroOverlay:"radial-gradient(circle at 30% 80%,rgba(255,255,255,0.06) 0%,transparent 50%)",shadow:"0 1px 3px rgba(120,53,15,0.06)",badgeBg:"#fef3c7",badgeText:"#92400e"},
};
const STEPS=[{id:"basics",title:"Grunddaten",num:"01"},{id:"services",title:"Leistungen",num:"02"},{id:"contact",title:"Kontakt",num:"03"},{id:"style",title:"Design",num:"04"}];
const INIT={firmenname:"",branche:"",brancheLabel:"",brancheCustom:"",leistungen:[],extraLeistung:"",adresse:"",plz:"",ort:"",bundesland:"",telefon:"",email:"",uid:"",oeffnungszeiten:"",oeffnungszeitenCustom:"",einsatzgebiet:"",kurzbeschreibung:"",notdienst:false,stil:"professional"};

/* ═══ TOKENS ═══ */
const T={bg:"#fafbfc",bg2:"#f0f2f5",bg3:"#e8ebf0",white:"#ffffff",dark:"#0c0e12",dark2:"#1a1d24",text:"#1a1d24",textSub:"#4b5162",textMuted:"#8b919e",accent:"#2563eb",accentLight:"#eff4ff",accentGlow:"rgba(37,99,235,0.12)",green:"#16a34a",greenLight:"#f0fdf4",greenGlow:"rgba(22,163,74,0.1)",red:"#dc2626",orange:"#ea580c",r:"14px",rSm:"10px",rLg:"22px",rXl:"28px",font:"'DM Sans',-apple-system,sans-serif",mono:"'JetBrains Mono',monospace",sh1:"0 1px 2px rgba(0,0,0,0.04)",sh2:"0 4px 24px rgba(0,0,0,0.06)",sh3:"0 16px 48px rgba(0,0,0,0.08)",sh4:"0 24px 80px rgba(0,0,0,0.1)"};

const css=`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400&family=JetBrains+Mono:wght@400;500&family=Inter:wght@400;500;600;700;800;900&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&display=swap');*{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}body{font-family:${T.font};color:${T.text};-webkit-font-smoothing:antialiased;background:${T.bg}}::selection{background:${T.accent};color:#fff}@keyframes fadeUp{from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:translateY(0)}}.anim{animation:fadeUp .8s cubic-bezier(.16,1,.3,1) both}.d1{animation-delay:.12s}.d2{animation-delay:.24s}.d3{animation-delay:.36s}.d4{animation-delay:.48s}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}`;

/* ═══ LANDING PAGE ═══ */
function LandingPage({onStart}){
  const[scrolled,setScrolled]=useState(false);
  useEffect(()=>{const h=()=>setScrolled(window.scrollY>30);window.addEventListener("scroll",h);return()=>window.removeEventListener("scroll",h)},[]);
  const W=({children,s})=><div style={{maxWidth:1200,margin:"0 auto",padding:"0 40px",...s}}>{children}</div>;
  const Sec=({children,id,alt,s})=><section id={id} style={{padding:"140px 0",background:alt?T.bg2:T.bg,...s}}><W>{children}</W></section>;
  const Tag=({children})=><div style={{display:"inline-flex",alignItems:"center",gap:8,background:T.accentLight,color:T.accent,padding:"7px 18px",borderRadius:100,fontSize:".72rem",fontWeight:700,letterSpacing:".12em",textTransform:"uppercase",marginBottom:20,border:"1px solid rgba(37,99,235,.12)"}}>{children}</div>;
  const H2=({children,s})=><h2 style={{fontSize:"clamp(2.2rem,5vw,3.2rem)",fontWeight:800,lineHeight:1.08,letterSpacing:"-.035em",color:T.dark,marginBottom:20,...s}}>{children}</h2>;
  const Sub=({children,s})=><p style={{fontSize:"1.15rem",color:T.textSub,lineHeight:1.7,maxWidth:540,...s}}>{children}</p>;
  const Glow=({color,top,left,right,bottom,size})=><div style={{position:"absolute",top,left,right,bottom,width:size||500,height:size||500,borderRadius:"50%",background:`radial-gradient(circle,${color} 0%,transparent 70%)`,pointerEvents:"none",filter:"blur(40px)"}}/>;

  /* Animated counter */
  function Counter({end,suffix,label}){const[v,setV]=useState(0);const ref=useRef(null);useEffect(()=>{const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting){let s=0;const dur=1200;const step=()=>{s+=16;const p=Math.min(s/dur,1);const ease=1-Math.pow(1-p,3);setV(Math.round(end*ease));if(p<1)requestAnimationFrame(step)};step();obs.disconnect()}},{threshold:.3});if(ref.current)obs.observe(ref.current);return()=>obs.disconnect()},[end]);return<div ref={ref} style={{textAlign:"center"}}><div style={{fontSize:"2.4rem",fontWeight:800,color:T.dark,fontFamily:T.mono,letterSpacing:"-.03em",lineHeight:1}}>{v}{suffix}</div><div style={{fontSize:".78rem",color:T.textMuted,marginTop:6,fontWeight:500}}>{label}</div></div>}

  return(<div style={{background:T.bg,color:T.text,overflowX:"hidden"}}><style>{css}</style>

  {/* NAV */}
  <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,background:scrolled?"rgba(250,251,252,.88)":"transparent",backdropFilter:scrolled?"blur(24px) saturate(180%)":"none",WebkitBackdropFilter:scrolled?"blur(24px) saturate(180%)":"none",borderBottom:scrolled?"1px solid rgba(0,0,0,.06)":"1px solid transparent",transition:"all .4s cubic-bezier(.4,0,.2,1)"}}>
    <div style={{maxWidth:1200,margin:"0 auto",padding:"0 40px",display:"flex",alignItems:"center",justifyContent:"space-between",height:72}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}><img src="/icon.png" alt="SR" style={{height:26}}/><span style={{fontSize:"1.1rem",fontWeight:800,color:T.dark,letterSpacing:"-.02em"}}>SiteReady</span></div>
      <div style={{display:"flex",gap:36,alignItems:"center"}}>
        {[["#problem","Problem"],["#how","Wie es geht"],["#preise","Preise"],["#vergleich","Vergleich"]].map(([h,l])=><a key={h} href={h} style={{fontSize:".88rem",fontWeight:500,color:T.textSub,textDecoration:"none"}}>{l}</a>)}
        <button onClick={onStart} style={{background:T.dark,color:"#fff",padding:"11px 26px",borderRadius:T.rSm,fontWeight:700,fontSize:".88rem",border:"none",cursor:"pointer",fontFamily:T.font,boxShadow:"0 2px 12px rgba(0,0,0,.15)",transition:"all .2s"}}>Jetzt starten</button>
      </div>
    </div>
  </nav>

  {/* HERO */}
  <section style={{minHeight:"100vh",display:"flex",alignItems:"center",paddingTop:72,position:"relative",overflow:"hidden",background:"linear-gradient(170deg,#fafbfc 0%,#eff4ff 40%,#fafbfc 100%)"}}>
    <Glow color="rgba(37,99,235,.07)" top="-20%" right="-10%" size={800}/>
    <Glow color="rgba(22,163,74,.04)" bottom="-15%" left="-5%" size={600}/>
    {/* Dot grid pattern */}
    <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(circle,rgba(0,0,0,.04) 1px,transparent 1px)",backgroundSize:"32px 32px",pointerEvents:"none"}}/>
    <W s={{position:"relative",zIndex:1}}>
      <div style={{textAlign:"center",maxWidth:820,margin:"0 auto"}}>
        <div><Tag><span style={{width:6,height:6,borderRadius:"50%",background:T.accent,animation:"pulse 2s infinite"}}/>Fuer Handwerker in Oesterreich</Tag></div>
        <h1 style={{fontSize:"clamp(3rem,7vw,5rem)",fontWeight:800,lineHeight:1.02,letterSpacing:"-.05em",color:T.dark,marginBottom:28}}>Deine Website<br/>in <span style={{background:"linear-gradient(135deg,#2563eb 0%,#3b82f6 40%,#16a34a 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>Minuten.</span></h1>
        <p style={{fontSize:"clamp(1.1rem,2vw,1.35rem)",color:T.textSub,lineHeight:1.65,maxWidth:580,margin:"0 auto 44px"}}>Mit Impressum nach ECG, DSGVO und Google-Indexierung. 10 Fragen beantworten. Live-Vorschau pruefen. Fertig.</p>
        <div style={{display:"flex",gap:16,justifyContent:"center",marginBottom:64}}>
          <button onClick={onStart} style={{padding:"18px 40px",borderRadius:T.r,fontSize:"1.05rem",fontWeight:700,border:"none",cursor:"pointer",background:T.dark,color:"#fff",fontFamily:T.font,boxShadow:"0 4px 24px rgba(0,0,0,.18)",transition:"all .3s",letterSpacing:"-.01em"}}>Jetzt Website erstellen &rarr;</button>
          <a href="#how" style={{padding:"18px 32px",borderRadius:T.r,fontSize:"1.05rem",fontWeight:600,textDecoration:"none",color:T.dark,border:`2px solid ${T.bg3}`,background:T.white,transition:"all .3s"}}>So funktioniert's</a>
        </div>
        {/* Bento Stats */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:1,background:T.bg3,borderRadius:T.rLg,overflow:"hidden",maxWidth:520,margin:"0 auto",boxShadow:T.sh2}}>
          {[{end:10,suffix:" Min",label:"Bis zur fertigen Website"},{end:18,suffix:"\u20AC",label:"Pro Monat, alles inklusive"},{end:120,suffix:"k+",label:"Zielgruppe in Oesterreich"}].map((s,i)=><div key={i} style={{background:T.white,padding:"28px 20px"}}><Counter {...s}/></div>)}
        </div>
      </div>
      {/* Hero Mockup below */}
      <div style={{marginTop:80,position:"relative",maxWidth:900,margin:"80px auto 0"}}>
        <div style={{background:T.white,borderRadius:T.rXl,overflow:"hidden",boxShadow:`${T.sh4}, 0 0 0 1px rgba(0,0,0,.04)`,border:"1px solid rgba(0,0,0,.06)"}}>
          <div style={{display:"flex",alignItems:"center",gap:6,padding:"14px 20px",background:T.bg,borderBottom:"1px solid rgba(0,0,0,.06)"}}>
            {["#ff5f57","#febc2e","#28c840"].map(c=><span key={c} style={{width:10,height:10,borderRadius:"50%",background:c}}/>)}
            <div style={{marginLeft:14,background:T.white,borderRadius:8,padding:"6px 16px",fontSize:".75rem",fontFamily:T.mono,color:T.textMuted,flex:1,border:"1px solid rgba(0,0,0,.06)"}}>meier-elektrotechnik.siteready.at</div>
            <div style={{background:T.greenLight,color:T.green,fontSize:".65rem",fontWeight:700,padding:"4px 12px",borderRadius:6,textTransform:"uppercase",letterSpacing:".06em"}}>Live</div>
          </div>
          <div style={{background:"linear-gradient(160deg,#0f2b5b 0%,#1e40af 50%,#2563eb 100%)",padding:"52px 40px",color:"#fff",textAlign:"left",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",inset:0,background:"radial-gradient(circle at 80% 20%,rgba(255,255,255,.08),transparent 60%)"}}/>
            <div style={{position:"relative",zIndex:1,display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
              <div>
                <div style={{display:"inline-block",padding:"4px 12px",background:"rgba(255,255,255,.15)",borderRadius:20,fontSize:".7rem",fontWeight:600,letterSpacing:".04em",textTransform:"uppercase",marginBottom:14,backdropFilter:"blur(8px)"}}>&#9889; 24h Notdienst</div>
                <h2 style={{fontSize:"1.6rem",fontWeight:700,marginBottom:6}}>Meier Elektrotechnik</h2>
                <p style={{opacity:.8,fontSize:".95rem"}}>Elektroinstallationen &middot; Wien & Umgebung</p>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:8,background:"rgba(255,255,255,.12)",borderRadius:10,padding:"10px 20px",fontSize:".88rem",fontWeight:600,backdropFilter:"blur(8px)",border:"1px solid rgba(255,255,255,.15)"}}>&#128222; +43 1 234 56 78</div>
            </div>
          </div>
          <div style={{padding:"28px 40px",display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
            {["Elektroinstallationen","Smart Home","Photovoltaik"].map((l,i)=><div key={i} style={{background:T.bg,borderRadius:T.rSm,padding:"16px",display:"flex",alignItems:"center",gap:10,border:"1px solid rgba(0,0,0,.04)"}}><div style={{width:28,height:28,borderRadius:8,background:T.accentLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:".7rem",color:T.accent,fontWeight:700,fontFamily:T.mono}}>{String(i+1).padStart(2,"0")}</div><span style={{fontSize:".85rem",fontWeight:500,color:T.text}}>{l}</span></div>)}
          </div>
        </div>
        {/* Floating badges */}
        {[{l:"SSL aktiv",i:"\uD83D\uDD12",top:"-5%",right:"-3%",d:"0s"},{l:"Google indexiert",i:"\uD83D\uDCC8",bottom:"10%",left:"-4%",d:"1.5s"},{l:"DSGVO + ECG",i:"\u2696\uFE0F",top:"40%",right:"-5%",d:"3s"}].map(b=><div key={b.l} style={{position:"absolute",padding:"12px 18px",background:T.white,borderRadius:T.r,boxShadow:T.sh3,fontSize:".82rem",fontWeight:600,color:T.text,display:"flex",alignItems:"center",gap:10,animation:`float 5s ease-in-out ${b.d} infinite`,top:b.top,bottom:b.bottom,left:b.left,right:b.right,border:"1px solid rgba(0,0,0,.04)"}}><span style={{width:32,height:32,borderRadius:10,background:T.accentLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:".95rem"}}>{b.i}</span>{b.l}</div>)}
      </div>
    </W>
  </section>

  {/* TRUSTED BY / SOCIAL PROOF */}
  <div style={{padding:"48px 0",borderBottom:"1px solid rgba(0,0,0,.04)",background:T.white}}>
    <W><div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:48,opacity:.4}}>
      {["Nuxt.js","Supabase","Stripe","Cloudflare","Claude API"].map(n=><span key={n} style={{fontSize:".95rem",fontWeight:700,color:T.dark,letterSpacing:"-.01em"}}>{n}</span>)}
    </div></W>
  </div>

  {/* PROBLEM */}
  <Sec id="problem" alt>
    <div style={{textAlign:"center",marginBottom:64}}><Tag>Das Problem</Tag><H2 s={{maxWidth:700,margin:"0 auto 16px"}}>Handwerker haben online keine gute Option.</H2><Sub s={{margin:"0 auto",textAlign:"center"}}>Zu teuer, zu kompliziert, nicht rechtssicher. Oder alles zusammen.</Sub></div>
    {/* Bento grid */}
    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
      {[{n:"Linktree / Komi",issue:"Kein Google-Ranking. Kein Impressum.",tags:["Kein SEO","Kein ECG"],bg:"#fef2f2",bc:"#fecaca"},{n:"Wix / Jimdo",issue:"Stunden bis Tage. Hohe Lernkurve.",tags:["SEO manuell","Aufwaendig"],bg:"#fffbeb",bc:"#fed7aa"},{n:"Agentur",issue:"Ab 1.500 Euro. Wochen Wartezeit.",tags:["Teuer","Langsam"],bg:"#fef2f2",bc:"#fecaca"}].map((c,i)=><div key={i} className={`anim d${i+1}`} style={{background:T.white,borderRadius:T.rLg,padding:"28px 24px",border:"1px solid rgba(0,0,0,.06)",boxShadow:T.sh1}}><div style={{fontWeight:700,fontSize:"1rem",color:T.dark,marginBottom:8}}>{c.n}</div><div style={{fontSize:".88rem",color:T.red,fontWeight:500,marginBottom:12}}>{c.issue}</div><div style={{display:"flex",gap:6}}>{c.tags.map(t=><span key={t} style={{fontSize:".68rem",padding:"4px 12px",borderRadius:100,fontWeight:600,background:c.bg,color:T.red,border:`1px solid ${c.bc}`}}>{t}</span>)}</div></div>)}
    </div>
    {/* Solution card spanning full width */}
    <div style={{marginTop:16,background:"linear-gradient(135deg,#eff4ff,#f0fdf4)",borderRadius:T.rXl,padding:"44px 40px",border:"2px solid rgba(37,99,235,.15)",position:"relative",overflow:"hidden",boxShadow:"0 8px 40px rgba(37,99,235,.08)"}}>
      <Glow color="rgba(37,99,235,.06)" top="-50%" right="-20%" size={500}/>
      <div style={{position:"relative",zIndex:1,display:"grid",gridTemplateColumns:"1fr 1fr",gap:40,alignItems:"center"}}>
        <div>
          <div style={{display:"inline-block",background:T.accent,color:"#fff",fontSize:".68rem",fontWeight:700,padding:"5px 14px",borderRadius:100,marginBottom:16}}>Die Loesung</div>
          <h3 style={{fontSize:"1.8rem",fontWeight:800,color:T.dark,marginBottom:10,letterSpacing:"-.02em"}}>SiteReady.at</h3>
          <p style={{fontSize:"1.05rem",color:T.textSub,lineHeight:1.7,marginBottom:20}}>Kein Builder. Ein Service. Du beantwortest Fragen, wir liefern die fertige Website.</p>
          <button onClick={onStart} style={{padding:"14px 28px",borderRadius:T.rSm,fontSize:".92rem",fontWeight:700,border:"none",cursor:"pointer",background:T.dark,color:"#fff",fontFamily:T.font,boxShadow:"0 4px 16px rgba(0,0,0,.12)"}}>Jetzt testen &rarr;</button>
        </div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{["SEO automatisch","Impressum (ECG)","DSGVO automatisch","Google-Indexierung","Live-Vorschau","SSL inklusive","Kein Branding","Analytics"].map(l=><span key={l} style={{fontSize:".78rem",padding:"8px 16px",borderRadius:T.rSm,fontWeight:600,background:T.white,color:T.green,border:"1px solid rgba(22,163,74,.12)",boxShadow:T.sh1}}>{"\u2713"} {l}</span>)}</div>
      </div>
    </div>
  </Sec>

  {/* HOW IT WORKS */}
  <Sec id="how">
    <div style={{textAlign:"center",marginBottom:72}}><Tag>So funktioniert's</Tag><H2>Vier Schritte. Null Aufwand.</H2></div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:2,background:T.bg3,borderRadius:T.rXl,overflow:"hidden",boxShadow:T.sh2}}>
      {[{n:"01",i:"\uD83D\uDCCB",t:"Fragebogen",d:"8-10 Fragen. Branche, Daten, Stilauswahl."},{n:"02",i:"\uD83D\uDC41\uFE0F",t:"Live-Vorschau",d:"Im Browser, vor der Bezahlung. Keine KI-Kosten."},{n:"03",i:"\uD83D\uDCB3",t:"Bezahlen",d:"Stripe Checkout. KI-Generierung laeuft automatisch."},{n:"04",i:"\uD83D\uDE80",t:"Online",d:"Cloudflare, SSL, Google-Indexierung. Sofort live."}].map((s,i)=><div key={i} style={{background:T.white,padding:"44px 28px",textAlign:"center",position:"relative"}}>
        <div style={{fontFamily:T.mono,fontSize:".7rem",fontWeight:700,color:T.accent,letterSpacing:".15em",marginBottom:16}}>{s.n}</div>
        <div style={{width:56,height:56,borderRadius:16,background:T.accentLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.5rem",margin:"0 auto 18px"}}>{s.i}</div>
        <h3 style={{fontSize:"1.05rem",fontWeight:700,color:T.dark,marginBottom:8}}>{s.t}</h3>
        <p style={{fontSize:".85rem",color:T.textMuted,lineHeight:1.6}}>{s.d}</p>
        {i<3&&<div style={{position:"absolute",top:"50%",right:0,transform:"translate(50%,-50%)",width:24,height:24,borderRadius:"50%",background:T.bg3,display:"flex",alignItems:"center",justifyContent:"center",fontSize:".7rem",color:T.textMuted,zIndex:2}}>&rarr;</div>}
      </div>)}
    </div>
  </Sec>

  {/* DESIGN VARIANTS */}
  <Sec alt>
    <div style={{textAlign:"center",marginBottom:64}}><Tag>Automatisches Design</Tag><H2>Keine Entscheidung. Nur ein Gefuehl.</H2><Sub s={{margin:"0 auto",textAlign:"center"}}>Wie soll Ihr Betrieb wirken?</Sub></div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20}}>
      {[{t:"Professionell",d:"Klare Linien, gedaempfte Farben, serifenlos",g:"linear-gradient(160deg,#0f2b5b,#2563eb)",sub:"Elektriker, Installateure, Baumeister"},{t:"Modern & frisch",d:"Helle Akzente, leichtes Layout, frisch",g:"linear-gradient(135deg,#065f46,#10b981)",sub:"Maler, Fliesenleger, Gaertner"},{t:"Bodenstaendig",d:"Warme Toene, kraeftige Schrift, solide",g:"linear-gradient(160deg,#78350f,#b45309)",sub:"Tischler, Zimmerer, Dachdecker"}].map((v,i)=><div key={i} className={`anim d${i+1}`} style={{borderRadius:T.rLg,overflow:"hidden",background:T.white,border:"1px solid rgba(0,0,0,.06)",boxShadow:T.sh2,transition:"transform .3s,box-shadow .3s",cursor:"default"}}>
        <div style={{background:v.g,padding:"48px 28px",color:"#fff",position:"relative",overflow:"hidden"}}><div style={{position:"absolute",inset:0,background:"radial-gradient(circle at 80% 20%,rgba(255,255,255,.1),transparent 50%)"}}/><h3 style={{fontSize:"1.2rem",fontWeight:700,marginBottom:6,position:"relative"}}>{v.t}</h3><p style={{fontSize:".82rem",opacity:.75,position:"relative"}}>{v.d}</p></div>
        <div style={{padding:"20px 28px"}}><p style={{fontSize:".85rem",color:T.textSub}}>{v.sub}</p></div>
      </div>)}
    </div>
  </Sec>

  {/* PRICING */}
  <Sec id="preise">
    <div style={{textAlign:"center",marginBottom:72}}><Tag>Preise</Tag><H2>Ein Paket. Alles drin.</H2><Sub s={{margin:"0 auto",textAlign:"center"}}>Keine Tarifauswahl. Voller Leistungsumfang. Wird aktuell evaluiert.</Sub></div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,maxWidth:840,margin:"0 auto"}}>
      {[{name:"Variante A",sub:"Reines Abo",setup:null,mo:"\u20AC18",yr1:"\u20AC216",yr2:"\u20AC216",hl:true},{name:"Variante B",sub:"Setup + Abo",setup:"\u20AC149 einmalig",mo:"\u20AC13",yr1:"\u20AC305",yr2:"\u20AC156",hl:false}].map((p,i)=><div key={i} className={`anim d${i+1}`} style={{background:T.white,borderRadius:T.rXl,padding:"44px 36px",position:"relative",border:p.hl?"2px solid rgba(37,99,235,.2)":"1px solid rgba(0,0,0,.06)",boxShadow:p.hl?"0 8px 40px rgba(37,99,235,.08)":T.sh2}}>
        {p.hl&&<span style={{position:"absolute",top:-13,left:"50%",transform:"translateX(-50%)",background:"linear-gradient(135deg,#2563eb,#3b82f6)",color:"#fff",fontSize:".68rem",fontWeight:700,padding:"6px 18px",borderRadius:100,whiteSpace:"nowrap",boxShadow:"0 4px 16px rgba(37,99,235,.2)"}}>Wird evaluiert</span>}
        <div style={{fontSize:".92rem",fontWeight:600,color:T.textSub,marginBottom:4}}>{p.name}</div>
        <div style={{fontSize:".78rem",color:T.textMuted,marginBottom:16}}>{p.sub}</div>
        {p.setup&&<div style={{fontSize:".88rem",color:T.text,marginBottom:8}}>Setup: <strong>{p.setup}</strong></div>}
        <div style={{fontSize:"3rem",fontWeight:800,color:T.dark,fontFamily:T.mono,lineHeight:1,letterSpacing:"-.04em"}}>{p.mo}<span style={{fontSize:"1rem",fontWeight:500,color:T.textMuted,fontFamily:T.font}}> / Monat</span></div>
        <div style={{fontSize:".78rem",color:T.textMuted,marginTop:10,marginBottom:28}}>1. Jahr: {p.yr1} &middot; Ab 2. Jahr: {p.yr2}</div>
        <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:32}}>
          {["Subdomain sofort live","Kein SiteReady-Branding","Impressum (ECG) - anwaltl. geprueft","DSGVO - anwaltl. geprueft","SEO & Google-Indexierung","Google Maps","Notdienst / 24h Badge","Analytics-Dashboard","Live-Vorschau vor Bezahlung"].map(f=><div key={f} style={{display:"flex",alignItems:"center",gap:10,fontSize:".85rem",color:T.text}}><div style={{width:20,height:20,borderRadius:6,background:T.greenLight,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{color:T.green,fontSize:".7rem",fontWeight:700}}>{"\u2713"}</span></div>{f}</div>)}
        </div>
        <button onClick={onStart} style={{width:"100%",padding:16,borderRadius:T.rSm,fontSize:".95rem",fontWeight:700,cursor:"pointer",fontFamily:T.font,border:"none",transition:"all .25s",background:p.hl?T.dark:"transparent",color:p.hl?"#fff":T.dark,boxShadow:p.hl?"0 4px 20px rgba(0,0,0,.12)":"none",...(!p.hl?{border:`2px solid ${T.bg3}`}:{})}}>Jetzt starten</button>
      </div>)}
    </div>
    <p style={{textAlign:"center",marginTop:36,fontSize:".82rem",color:T.textMuted,maxWidth:560,margin:"36px auto 0",lineHeight:1.7}}>Beide Varianten: voller Leistungsumfang. 12 Monate Mindestlaufzeit. Custom Domain optional (Phase 2).</p>
  </Sec>

  {/* COMPARISON */}
  <Sec id="vergleich" alt>
    <div style={{textAlign:"center",marginBottom:56}}><Tag>Vergleich</Tag><H2>SiteReady vs. der Rest.</H2></div>
    <div style={{borderRadius:T.rXl,overflow:"hidden",border:"1px solid rgba(0,0,0,.06)",boxShadow:T.sh2,background:T.white}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:".85rem"}}><thead><tr>{["Feature","SiteReady.at","Wix ADI","Jimdo","Linktree"].map((h,j)=><th key={h} style={{textAlign:"left",padding:"18px 22px",fontWeight:700,fontSize:".73rem",color:j===1?T.accent:T.textMuted,textTransform:"uppercase",letterSpacing:".1em",background:j===1?T.accentLight:T.bg,borderBottom:"1px solid rgba(0,0,0,.06)"}}>{h}</th>)}</tr></thead><tbody>{[["Zeit bis live","Minuten","30-60 Min","60+ Min","5 Min"],["Impressum ECG","\u2713 Auto","\u2717","\u2717","\u2717"],["DSGVO","\u2713 Auto","\u2717","\u2717","\u2717"],["Google-Index","\u2713 Auto","Manuell","Manuell","\u2717"],["Live-Vorschau","\u2713 Vor Bezahlung","Teilweise","\u2717","\u2717"],["Lernkurve","Keine","Mittel","Mittel","Gering"],["Anwaltl. geprueft","\u2713 Ja","\u2717","\u2717","\u2717"],["Einstiegspreis","Ab \u20AC18/Mo","\u20AC17/Mo","\u20AC11/Mo","Gratis/\u20AC5"]].map((row,i)=><tr key={i} style={{background:i%2===0?T.white:T.bg}}>{row.map((c,j)=><td key={j} style={{padding:"15px 22px",borderBottom:"1px solid rgba(0,0,0,.03)",color:j===0?T.dark:j===1?T.accent:T.textMuted,fontWeight:j<=1?600:400,background:j===1?"rgba(37,99,235,.03)":"transparent"}}>{c}</td>)}</tr>)}</tbody></table>
    </div>
  </Sec>

  {/* WHY NOW */}
  <Sec>
    <div style={{textAlign:"center",marginBottom:56}}><Tag>Warum jetzt</Tag><H2>Der perfekte Zeitpunkt.</H2></div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}}>
      {[{i:"\uD83D\uDCB0",t:"KI-Kosten sinken",d:"Erstmals kosteneffizient skalierbar."},{i:"\u2696\uFE0F",t:"DSGVO-Bewusstsein",d:"Abmahnwellen haben das Thema gebracht."},{i:"\uD83D\uDCF1",t:"Link-in-Bio gesaettigt",d:"Loest das SEO-Problem nicht."},{i:"\uD83C\uDDE6\uD83C\uDDF9",t:"Markt unbesetzt",d:"ECG + DSGVO + SEO fuer AT."},{i:"\uD83C\uDF10",t:"Domain gesichert",d:"siteready.at reserviert."},{i:"\uD83D\uDE80",t:"Bootstrapped",d:"Break-even ab Tag 1 moeglich."}].map((c,i)=><div key={i} style={{background:T.white,borderRadius:T.rLg,padding:"28px 24px",border:"1px solid rgba(0,0,0,.04)",boxShadow:T.sh1}}><div style={{fontSize:"1.4rem",marginBottom:14}}>{c.i}</div><h3 style={{fontSize:".95rem",fontWeight:700,color:T.dark,marginBottom:6}}>{c.t}</h3><p style={{fontSize:".82rem",color:T.textMuted,lineHeight:1.6}}>{c.d}</p></div>)}
    </div>
  </Sec>

  {/* CTA */}
  <section style={{padding:"140px 0",textAlign:"center",position:"relative",overflow:"hidden",background:T.dark}}>
    <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(circle,rgba(255,255,255,.03) 1px,transparent 1px)",backgroundSize:"28px 28px"}}/>
    <Glow color="rgba(37,99,235,.15)" top="-30%" left="20%" size={600}/>
    <Glow color="rgba(22,163,74,.08)" bottom="-30%" right="20%" size={500}/>
    <W s={{position:"relative",zIndex:1}}>
      <h2 style={{fontSize:"clamp(2.4rem,5vw,3.6rem)",fontWeight:800,lineHeight:1.06,letterSpacing:"-.04em",color:"#fff",marginBottom:24}}>Bereit fuer deine Website?</h2>
      <p style={{fontSize:"1.15rem",color:"rgba(255,255,255,.5)",marginBottom:44,maxWidth:480,margin:"0 auto 44px",lineHeight:1.6}}>10 Fragen. Wenige Minuten. Fertig.</p>
      <button onClick={onStart} style={{background:"#fff",color:T.dark,padding:"20px 48px",borderRadius:T.r,fontSize:"1.1rem",fontWeight:800,border:"none",cursor:"pointer",fontFamily:T.font,boxShadow:"0 4px 30px rgba(255,255,255,.1)",letterSpacing:"-.01em"}}>Jetzt starten &rarr;</button>
    </W>
  </section>

  {/* FOOTER */}
  <footer style={{padding:"40px 0",borderTop:"1px solid rgba(0,0,0,.04)",background:T.bg}}>
    <W><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{display:"flex",alignItems:"center",gap:8}}><img src="/icon.png" alt="SR" style={{height:18,opacity:.4}}/><span style={{fontSize:".82rem",color:T.textMuted}}>&copy; 2026 SiteReady.at</span></div><div style={{display:"flex",gap:24}}>{["Impressum","Datenschutz","Kontakt"].map(l=><a key={l} href="#" style={{fontSize:".82rem",color:T.textMuted,textDecoration:"none"}}>{l}</a>)}</div></div></W>
  </footer>
  </div>);
}

/* ═══ SUCCESS (unified design) ═══ */
function SuccessPage({data,onBack}){
  const sub=data.firmenname?data.firmenname.toLowerCase().replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,""):"firmenname";
  return(<div style={{minHeight:"100vh",background:"linear-gradient(170deg,#fafbfc 0%,#f0fdf4 50%,#fafbfc 100%)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:T.font,padding:40,textAlign:"center",position:"relative",overflow:"hidden"}}><style>{css}</style>
    <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(circle,rgba(0,0,0,.02) 1px,transparent 1px)",backgroundSize:"28px 28px",pointerEvents:"none"}}/>
    <div style={{position:"relative",zIndex:1}}>
      <div style={{width:80,height:80,borderRadius:"50%",background:"linear-gradient(135deg,#16a34a,#22c55e)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:36,margin:"0 auto 28px",boxShadow:"0 12px 40px rgba(22,163,74,.2)",color:"#fff"}}>{"\u2713"}</div>
      <h1 style={{fontSize:"2.2rem",fontWeight:800,color:T.dark,margin:"0 0 12px",letterSpacing:"-.03em"}}>Website bereit!</h1>
      <p style={{fontSize:"1.05rem",color:T.textSub,margin:"0 0 32px",maxWidth:460,lineHeight:1.6}}>In der Vollversion waere Ihre Website jetzt live unter:</p>
      <div style={{display:"inline-flex",alignItems:"center",gap:10,background:T.white,border:"2px solid rgba(22,163,74,.15)",borderRadius:T.r,padding:"16px 28px",marginBottom:40,boxShadow:T.sh2}}><span style={{fontSize:"1rem",fontWeight:700,color:T.green,fontFamily:T.mono}}>{sub}.siteready.at</span></div>
      <div style={{maxWidth:520,width:"100%",textAlign:"left",marginBottom:40}}>
        <h3 style={{fontSize:".78rem",fontWeight:700,color:T.dark,marginBottom:16,textTransform:"uppercase",letterSpacing:".12em"}}>Naechste Schritte</h3>
        {[{t:"KI-Texte generiert",d:"Professionelle Texte fuer Ihren Betrieb.",ok:true},{t:"Impressum & DSGVO",d:"Anwaltlich gepruefte Vorlagen.",ok:true},{t:"Google-Indexierung",d:"Automatisch angemeldet.",ok:true},{t:"Self-Service-Portal",d:"Daten aendern, Logo, Rechnungen.",ok:false},{t:"Custom Domain",d:"Eigene Domain verbinden.",ok:false}].map((s,i)=><div key={i} style={{display:"flex",gap:14,marginBottom:10,padding:"16px 18px",background:T.white,borderRadius:T.rSm,border:"1px solid rgba(0,0,0,.04)",boxShadow:T.sh1}}><div style={{width:32,height:32,borderRadius:"50%",background:s.ok?T.greenLight:T.bg2,color:s.ok?T.green:T.textMuted,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,flexShrink:0,border:`1px solid ${s.ok?"rgba(22,163,74,.12)":"rgba(0,0,0,.04)"}`}}>{s.ok?"\u2713":(i+1)}</div><div><div style={{fontWeight:600,fontSize:".88rem",color:T.dark,marginBottom:2}}>{s.t}</div><div style={{fontSize:".8rem",color:T.textMuted}}>{s.d}</div></div></div>)}
      </div>
      <button onClick={onBack} style={{padding:"14px 28px",border:"2px solid rgba(0,0,0,.08)",borderRadius:T.rSm,background:T.white,color:T.text,cursor:"pointer",fontSize:".88rem",fontWeight:600,fontFamily:T.font,boxShadow:T.sh1}}>{"\u2190"} Zurueck</button>
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
function Preview({d,compact}){const s=STYLES_MAP[d.stil]||STYLES_MAP.professional;const extraItems=d.extraLeistung?d.extraLeistung.split("\n").filter(l=>l.trim()):[];const allItems=[...(d.leistungen||[]),...extraItems];const hasContact=d.adresse||d.telefon||d.email;const px=compact?"20px":"28px";const adressFull=[d.adresse,[d.plz,d.ort].filter(Boolean).join(" ")].filter(Boolean).join(", ");const zeit=d.oeffnungszeiten==="custom"?d.oeffnungszeitenCustom:(OEFFNUNGSZEITEN.find(o=>o.value===d.oeffnungszeiten)?.label||"");return(<div style={{fontFamily:s.font,background:s.bg,color:s.text,minHeight:"100%",fontSize:"14px",lineHeight:1.65,overflowY:"auto",transition:"background 0.4s"}}><div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:`10px ${px}`,background:s.cardBg,borderBottom:`1px solid ${s.borderColor}`,position:"sticky",top:0,zIndex:10}}><div style={{fontWeight:700,fontSize:compact?"13px":"15px",color:s.primary}}>{d.firmenname||"Firmenname"}</div><div style={{display:"flex",gap:compact?"12px":"20px",fontSize:compact?"10px":"12px",color:s.textMuted}}><span>Leistungen</span><span>Ueber uns</span><span>Kontakt</span></div></div><div style={{background:s.heroGradient,position:"relative",overflow:"hidden",padding:compact?"32px 20px 28px":"48px 28px 44px",color:"#fff"}}><div style={{position:"absolute",inset:0,background:s.heroOverlay}}/><div style={{position:"relative",zIndex:1}}>{d.notdienst&&<div style={{display:"inline-block",padding:"3px 10px",background:"rgba(255,255,255,0.18)",borderRadius:"20px",fontSize:"10px",fontWeight:600,letterSpacing:"0.05em",textTransform:"uppercase",marginBottom:"12px"}}>{"\u26A1"} 24h Notdienst</div>}<h1 style={{fontSize:compact?"20px":"26px",fontWeight:700,margin:"0 0 8px",letterSpacing:"-0.025em",lineHeight:1.15}}>{d.firmenname||"Ihr Firmenname"}</h1><p style={{margin:"0 0 4px",opacity:0.85,fontSize:compact?"12px":"14px",fontWeight:500}}>{(d.branche==="sonstige"?d.brancheCustom:d.brancheLabel)||"Ihre Branche"}{d.einsatzgebiet?` \u00B7 ${d.einsatzgebiet}`:""}</p>{d.kurzbeschreibung&&<p style={{margin:"12px 0 0",opacity:0.75,fontSize:compact?"11px":"13px",lineHeight:1.55}}>{d.kurzbeschreibung}</p>}{d.telefon&&<div style={{marginTop:"16px",display:"inline-flex",alignItems:"center",gap:"8px",background:"rgba(255,255,255,0.15)",borderRadius:s.radius,padding:"8px 16px",fontSize:"13px",fontWeight:600}}>{"\uD83D\uDCDE"} {d.telefon}</div>}</div></div><div style={{padding:`24px ${px} 20px`}}><div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"14px"}}><h2 style={{fontSize:compact?"15px":"18px",fontWeight:700,color:s.primary,margin:0}}>Unsere Leistungen</h2><div style={{flex:1,height:"1px",background:s.borderColor}}/></div>{allItems.length>0?(<div style={{display:"grid",gridTemplateColumns:compact?"1fr":"1fr 1fr",gap:"8px"}}>{allItems.map((l,i)=>(<div key={i} style={{background:s.cardBg,border:`1px solid ${s.borderColor}`,borderRadius:s.radius,padding:"11px 13px",display:"flex",alignItems:"flex-start",gap:"10px",boxShadow:s.shadow,fontSize:"12px"}}><div style={{width:"20px",height:"20px",borderRadius:s.radius,background:s.accentSoft,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:"9px",color:s.accent,fontWeight:700}}>{String(i+1).padStart(2,"0")}</div><span style={{fontWeight:500}}>{l}</span></div>))}</div>):(<div style={{background:s.cardBg,border:`2px dashed ${s.borderColor}`,borderRadius:s.radiusLg,padding:"24px",textAlign:"center",color:s.textLight,fontSize:"12px"}}>Ihre Leistungen erscheinen hier</div>)}</div><div style={{padding:`0 ${px} 24px`}}><div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"14px"}}><h2 style={{fontSize:compact?"15px":"18px",fontWeight:700,color:s.primary,margin:0}}>Ueber uns</h2><div style={{flex:1,height:"1px",background:s.borderColor}}/></div><div style={{background:s.cardBg,borderRadius:s.radiusLg,padding:"18px 20px",boxShadow:s.shadow,borderLeft:`3px solid ${s.accent}`}}><p style={{margin:0,color:s.textMuted,fontSize:"12px",lineHeight:1.7}}>{d.firmenname?`Dieser Text wird individuell fuer ${d.firmenname} generiert.`:"Hier entsteht Ihr individueller Text."}</p><div style={{marginTop:"10px",display:"inline-block",padding:"3px 9px",borderRadius:"20px",background:s.badgeBg,color:s.badgeText,fontSize:"9px",fontWeight:600}}>Wird nach Bestellung generiert</div></div></div>{hasContact&&(<div style={{margin:`0 ${px} 24px`,padding:"20px",background:s.cardBg,borderRadius:s.radiusLg,boxShadow:s.shadow,border:`1px solid ${s.borderColor}`}}><h2 style={{fontSize:compact?"15px":"18px",fontWeight:700,color:s.primary,margin:"0 0 14px"}}>Kontakt</h2><div style={{display:"grid",gridTemplateColumns:compact?"1fr":"1fr 1fr",gap:"8px"}}>{[{icon:"\uD83D\uDCCD",label:"Adresse",value:adressFull},{icon:"\uD83D\uDCDE",label:"Telefon",value:d.telefon},{icon:"\u2709\uFE0F",label:"E-Mail",value:d.email},{icon:"\uD83D\uDD50",label:"Oeffnungszeiten",value:zeit}].filter(x=>x.value).map((x,i)=>(<div key={i} style={{padding:"10px 12px",borderRadius:s.radius,background:s.accentSoft,fontSize:"11px"}}><div style={{fontSize:"9px",color:s.textMuted,textTransform:"uppercase",letterSpacing:"0.05em",fontWeight:600,marginBottom:"3px"}}>{x.icon} {x.label}</div><div style={{fontWeight:500,whiteSpace:"pre-line",lineHeight:1.5}}>{x.value}</div></div>))}</div></div>)}<div style={{background:s.primary,color:"#fff",padding:`20px ${px}`,fontSize:"10px"}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:"12px"}}><div><div style={{fontWeight:700,fontSize:"13px",marginBottom:"3px"}}>{d.firmenname||"Firmenname"}</div><div style={{opacity:0.7}}>{adressFull}</div></div><div style={{textAlign:"right",opacity:0.7}}>{d.telefon&&<div>{d.telefon}</div>}{d.email&&<div>{d.email}</div>}</div></div><div style={{borderTop:"1px solid rgba(255,255,255,0.15)",paddingTop:"10px",display:"flex",justifyContent:"space-between",opacity:0.5,fontSize:"9px"}}><span>Impressum | Datenschutz</span><span>SiteReady.at</span></div></div></div>)}

/* ═══ QUESTIONNAIRE (unified light premium) ═══ */
function Questionnaire({data,setData,onComplete,onBack}){
  const[step,setStep]=useState(0);const ref=useRef(null);const[isMobile]=useState(typeof window!=="undefined"&&window.innerWidth<768);const[showPreview,setShowPreview]=useState(false);const up=useCallback(k=>v=>setData(d=>({...d,[k]:v})),[setData]);const go=n=>{setStep(n);if(ref.current)ref.current.scrollTop=0};const pct=((step+1)/STEPS.length)*100;const selectedBranche=BRANCHEN.find(b=>b.value===data.branche);const brancheLeistungen=selectedBranche?selectedBranche.leistungen:[];const onBrancheChange=val=>{const b=BRANCHEN.find(x=>x.value===val);setData(d=>({...d,branche:val,brancheLabel:b?b.label:"",brancheCustom:"",stil:b?b.stil:d.stil,leistungen:[],extraLeistung:""}))};
  const pages=[<><Field label="Firmenname" value={data.firmenname} onChange={up("firmenname")} placeholder="z.B. Elektro Mueller GmbH"/><Dropdown label="Branche" value={data.branche} onChange={onBrancheChange} options={BRANCHEN} placeholder="Branche waehlen" hint="Leistungen und Stil werden vorgeschlagen"/>{data.branche==="sonstige"&&<Field label="Ihre Branche" value={data.brancheCustom} onChange={up("brancheCustom")} placeholder="z.B. Spenglerei, Stuckateur, ..."/>}<Field label="Kurzbeschreibung" value={data.kurzbeschreibung} onChange={up("kurzbeschreibung")} placeholder="Seit 15 Jahren Ihr zuverlaessiger Partner." rows={2} hint="Optional"/><Dropdown label="Bundesland" value={data.bundesland} onChange={v=>{up("bundesland")(v);const bl=BUNDESLAENDER.find(b=>b.value===v);up("einsatzgebiet")(bl?bl.label:"")}} options={BUNDESLAENDER} placeholder="Bundesland waehlen"/></>,<>{brancheLeistungen.length>0?(<Checklist label="Leistungen auswaehlen" options={brancheLeistungen} selected={data.leistungen} onChange={up("leistungen")} hint="Waehlen Sie Ihre Leistungen"/>):(<Field label="Ihre Leistungen (eine pro Zeile)" value={data.extraLeistung} onChange={up("extraLeistung")} placeholder={"Leistung 1\nLeistung 2\nLeistung 3"} rows={6} hint="3-6 Leistungen"/>)}{brancheLeistungen.length>0&&<Field label="Zusaetzliche Leistung (optional)" value={data.extraLeistung} onChange={up("extraLeistung")} placeholder="z.B. Beratung, Planung, ..."/>}<Toggle label="24h Notdienst" checked={data.notdienst} onChange={up("notdienst")} desc="Wird prominent angezeigt"/></>,<><Field label="Strasse & Hausnummer" value={data.adresse} onChange={up("adresse")} placeholder="Mariahilfer Strasse 45/3"/><div style={{display:"grid",gridTemplateColumns:"120px 1fr",gap:12}}><Field label="PLZ" value={data.plz} onChange={up("plz")} placeholder="1060"/><Field label="Ort" value={data.ort} onChange={up("ort")} placeholder="Wien"/></div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}><Field label="Telefon" value={data.telefon} onChange={up("telefon")} placeholder="+43 1 234 56 78"/><Field label="E-Mail" value={data.email} onChange={up("email")} placeholder="office@firma.at" type="email"/></div><Field label="UID-Nummer" value={data.uid} onChange={up("uid")} placeholder="ATU12345678" hint="Fuer das Impressum (ECG)"/><Dropdown label="Oeffnungszeiten" value={data.oeffnungszeiten} onChange={up("oeffnungszeiten")} options={OEFFNUNGSZEITEN} placeholder="Oeffnungszeiten waehlen"/>{data.oeffnungszeiten==="custom"&&<Field label="Ihre Oeffnungszeiten" value={data.oeffnungszeitenCustom} onChange={up("oeffnungszeitenCustom")} placeholder={"Mo-Fr: 08:00-17:00\nSa: nach Vereinbarung"} rows={2}/>}</>,<><p style={{fontSize:".88rem",color:T.textSub,margin:"0 0 6px",lineHeight:1.6}}>Basierend auf Ihrer Branche empfehlen wir:</p><p style={{fontSize:"1rem",fontWeight:700,color:T.dark,margin:"0 0 16px"}}>{STYLES_MAP[data.stil]?.label||"Professionell"}</p><StylePicker value={data.stil} onChange={up("stil")}/></>];

  const formPanel=(<div style={{display:"flex",flexDirection:"column",background:T.bg,borderRight:isMobile?"none":`1px solid ${T.bg3}`,height:isMobile?"auto":"100%",minHeight:isMobile?"100vh":"auto",fontFamily:T.font}}>
    <div style={{padding:"20px 24px 0"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}><button onClick={onBack} style={{background:"none",border:"none",cursor:"pointer",fontSize:16,color:T.textMuted,padding:2}}>{"\u2190"}</button><img src="/icon.png" alt="SR" style={{height:22}}/><span style={{fontSize:".95rem",fontWeight:800,color:T.dark}}>SiteReady</span></div>
        {isMobile&&<button onClick={()=>setShowPreview(!showPreview)} style={{fontSize:".75rem",fontWeight:600,color:T.accent,background:T.accentLight,padding:"5px 12px",borderRadius:6,border:"none",cursor:"pointer",fontFamily:T.font}}>{showPreview?"Formular":"Vorschau"}</button>}
      </div>
      <div style={{display:"flex",alignItems:"center",gap:10,margin:"14px 0 16px"}}><div style={{flex:1,height:4,borderRadius:2,background:T.bg3,overflow:"hidden"}}><div style={{height:"100%",borderRadius:2,background:`linear-gradient(90deg,${T.accent},#60a5fa)`,width:`${pct}%`,transition:"width .4s"}}/></div><span style={{fontSize:".72rem",color:T.textMuted,fontWeight:600,fontFamily:T.mono}}>{step+1}/{STEPS.length}</span></div>
      <div style={{display:"flex",gap:2,background:T.bg3,borderRadius:T.rSm,padding:3}}>
        {STEPS.map((s,i)=><button key={s.id} onClick={()=>go(i)} style={{flex:1,padding:"9px 4px",border:"none",background:i===step?T.white:"transparent",cursor:"pointer",borderRadius:i===step?8:0,fontFamily:T.font,transition:"all .2s",boxShadow:i===step?T.sh1:"none"}}><div style={{fontSize:".62rem",fontWeight:700,color:i===step?T.accent:T.textMuted,letterSpacing:".08em",marginBottom:2}}>{s.num}</div><div style={{fontSize:".78rem",fontWeight:i===step?700:500,color:i===step?T.dark:T.textMuted}}>{s.title}</div></button>)}
      </div>
    </div>
    <div ref={ref} style={{flex:1,overflowY:"auto",padding:"20px 24px"}}>{pages[step]}</div>
    <div style={{padding:"16px 24px",borderTop:`1px solid ${T.bg3}`,display:"flex",justifyContent:"space-between",background:T.white}}>
      {step>0?<button onClick={()=>go(step-1)} style={{padding:"12px 20px",border:`2px solid ${T.bg3}`,borderRadius:T.rSm,background:T.white,color:T.textSub,cursor:"pointer",fontSize:".85rem",fontWeight:600,fontFamily:T.font}}>{"\u2190"} Zurueck</button>:<div/>}
      {step<STEPS.length-1?<button onClick={()=>go(step+1)} style={{padding:"12px 24px",border:"none",borderRadius:T.rSm,background:T.dark,color:"#fff",cursor:"pointer",fontSize:".85rem",fontWeight:700,fontFamily:T.font,boxShadow:"0 2px 12px rgba(0,0,0,.12)"}}>Weiter &rarr;</button>:<button onClick={onComplete} style={{padding:"12px 24px",border:"none",borderRadius:T.rSm,background:"linear-gradient(135deg,#16a34a,#22c55e)",color:"#fff",cursor:"pointer",fontSize:".85rem",fontWeight:700,fontFamily:T.font,boxShadow:"0 2px 12px rgba(22,163,74,.2)"}}>Website erstellen &rarr;</button>}
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

/* ═══ APP ═══ */
export default function App(){const[page,setPage]=useState("landing");const[data,setData]=useState(INIT);if(page==="landing")return<LandingPage onStart={()=>setPage("form")}/>;if(page==="success")return<SuccessPage data={data} onBack={()=>setPage("form")}/>;return<Questionnaire data={data} setData={setData} onComplete={()=>setPage("success")} onBack={()=>setPage("landing")}/>}
