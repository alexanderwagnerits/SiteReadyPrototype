import { useState, useCallback, useRef, useEffect } from "react";

/* ═══ DATA (unchanged) ═══ */
const BRANCHEN = [
  { value: "elektro", label: "Elektroinstallationen", leistungen: ["Elektroinstallationen","Störungsbehebung & Reparatur","Smart Home Systeme","Photovoltaik & Speicher","Beleuchtungstechnik","Notdienst 24/7"], stil: "professional" },
  { value: "installateur", label: "Installateur / Heizung / Sanitär", leistungen: ["Heizungsinstallation & Wartung","Sanitärinstallationen","Rohrreinigung","Badsanierung","Wärmepumpen","Notdienst 24/7"], stil: "professional" },
  { value: "maler", label: "Malerei & Anstrich", leistungen: ["Innenmalerei","Fassadenanstrich","Tapezierarbeiten","Lackierarbeiten","Schimmelbehandlung","Farbberatung"], stil: "modern" },
  { value: "tischler", label: "Tischlerei", leistungen: ["Möbel nach Maß","Küchenbau","Innenausbau","Fenster & Türen","Reparaturen","Restaurierung"], stil: "traditional" },
  { value: "fliesenleger", label: "Fliesenleger", leistungen: ["Fliesenverlegung","Badsanierung","Natursteinarbeiten","Terrassenplatten","Abdichtungen","Reparaturen"], stil: "modern" },
  { value: "schlosser", label: "Schlosserei / Metallbau", leistungen: ["Stahl- & Metallbau","Geländer & Zäune","Tore & Türen","Schweißarbeiten","Reparaturen","Sonderanfertigungen"], stil: "professional" },
  { value: "dachdecker", label: "Dachdecker / Spengler", leistungen: ["Dachsanierung","Dachdämmung","Flachdach","Dachrinnen & Spenglerarbeiten","Dachfenster","Notdienst"], stil: "traditional" },
  { value: "zimmerei", label: "Zimmerei", leistungen: ["Dachstühle & Holzbau","Carports & Terrassen","Aufstockungen","Holzfassaden","Sanierung & Altholz","Sonderanfertigungen"], stil: "traditional" },
  { value: "maurer", label: "Maurer / Baumeister", leistungen: ["Rohbau & Mauerwerk","Zu- & Umbauten","Sanierung & Renovierung","Fassadenarbeiten","Estricharbeiten","Abbrucharbeiten"], stil: "professional" },
  { value: "bodenleger", label: "Bodenleger / Parkett", leistungen: ["Parkettverlegung","Laminat & Vinyl","Schleifen & Versiegeln","Teppichboden","Reparaturen","Bodenberatung"], stil: "modern" },
  { value: "glaser", label: "Glaser", leistungen: ["Glasreparaturen","Isolierglas","Spiegel & Glasmöbel","Duschwände","Glasfassaden","Notdienst"], stil: "modern" },
  { value: "gaertner", label: "Gärtner / Landschaftsbau", leistungen: ["Gartengestaltung","Pflasterarbeiten","Bepflanzung & Pflege","Bewässerungssysteme","Zaunbau","Baumschnitt & Pflege"], stil: "modern" },
  { value: "klima", label: "Klimatechnik / Lüftung", leistungen: ["Klimaanlagen Installation","Lüftungsanlagen","Wartung & Service","Wärmepumpen","Kühltechnik","Notdienst"], stil: "professional" },
  { value: "reinigung", label: "Reinigung / Gebäudeservice", leistungen: ["Gebäudereinigung","Fensterreinigung","Grundreinigung","Teppichreinigung","Fassadenreinigung","Winterdienst"], stil: "modern" },
  { value: "sonstige", label: "Sonstige Handwerksbranche", leistungen: [], stil: "professional" },
];
const BUNDESLAENDER = [{value:"wien",label:"Wien"},{value:"noe",label:"Niederösterreich"},{value:"ooe",label:"Oberösterreich"},{value:"stmk",label:"Steiermark"},{value:"sbg",label:"Salzburg"},{value:"tirol",label:"Tirol"},{value:"ktn",label:"Kärnten"},{value:"vbg",label:"Vorarlberg"},{value:"bgld",label:"Burgenland"}];
const OEFFNUNGSZEITEN = [{value:"mo-fr-8-17",label:"Mo–Fr: 08:00–17:00"},{value:"mo-fr-7-16",label:"Mo–Fr: 07:00–16:00"},{value:"mo-fr-8-18",label:"Mo–Fr: 08:00–18:00"},{value:"mo-sa-8-17",label:"Mo–Sa: 08:00–17:00"},{value:"mo-sa-8-12",label:"Mo–Fr: 08:00–17:00, Sa: 08:00–12:00"},{value:"vereinbarung",label:"Nach Vereinbarung"},{value:"custom",label:"Eigene Zeiten eingeben"}];
const STYLES_MAP = {
  professional: { label:"Professionell & seriös",desc:"Klare Linien, gedämpfte Farben",primary:"#0f2b5b",accent:"#2563eb",accentSoft:"rgba(37,99,235,0.07)",bg:"#f8fafc",cardBg:"#fff",text:"#0f172a",textMuted:"#64748b",textLight:"#94a3b8",borderColor:"#e2e8f0",font:"'Inter',system-ui,sans-serif",radius:"6px",radiusLg:"10px",heroGradient:"linear-gradient(160deg,#0f2b5b 0%,#1e40af 50%,#2563eb 100%)",heroOverlay:"radial-gradient(circle at 70% 20%,rgba(255,255,255,0.08) 0%,transparent 60%)",shadow:"0 1px 3px rgba(15,43,91,0.06)",badgeBg:"#dbeafe",badgeText:"#1e40af" },
  modern: { label:"Modern & frisch",desc:"Helle Akzente, frische Farbpalette",primary:"#065f46",accent:"#10b981",accentSoft:"rgba(16,185,129,0.07)",bg:"#f0fdf4",cardBg:"#fff",text:"#052e16",textMuted:"#4b7c6a",textLight:"#86b5a1",borderColor:"#d1fae5",font:"'DM Sans',system-ui,sans-serif",radius:"12px",radiusLg:"16px",heroGradient:"linear-gradient(135deg,#065f46 0%,#047857 40%,#10b981 100%)",heroOverlay:"radial-gradient(ellipse at 80% 30%,rgba(255,255,255,0.12) 0%,transparent 50%)",shadow:"0 1px 3px rgba(6,95,70,0.06)",badgeBg:"#d1fae5",badgeText:"#065f46" },
  traditional: { label:"Bodenständig & vertraut",desc:"Warme Töne, solider Auftritt",primary:"#78350f",accent:"#d97706",accentSoft:"rgba(217,119,6,0.07)",bg:"#fffbeb",cardBg:"#fff",text:"#451a03",textMuted:"#92713a",textLight:"#b8a070",borderColor:"#fde68a",font:"'Source Serif 4',Georgia,serif",radius:"4px",radiusLg:"8px",heroGradient:"linear-gradient(160deg,#78350f 0%,#92400e 50%,#b45309 100%)",heroOverlay:"radial-gradient(circle at 30% 80%,rgba(255,255,255,0.06) 0%,transparent 50%)",shadow:"0 1px 3px rgba(120,53,15,0.06)",badgeBg:"#fef3c7",badgeText:"#92400e" },
};
const STEPS=[{id:"basics",title:"Grunddaten",num:"01"},{id:"services",title:"Leistungen",num:"02"},{id:"contact",title:"Kontakt",num:"03"},{id:"style",title:"Design",num:"04"}];
const INIT={firmenname:"",branche:"",brancheLabel:"",brancheCustom:"",leistungen:[],extraLeistung:"",adresse:"",plz:"",ort:"",bundesland:"",telefon:"",email:"",uid:"",oeffnungszeiten:"",oeffnungszeitenCustom:"",einsatzgebiet:"",kurzbeschreibung:"",notdienst:false,stil:"professional"};

/* ═══ DESIGN TOKENS – SiteReady UI ═══ */
const T={black:"#0a0a0a",white:"#fafafa",g50:"#f7f7f8",g100:"#efefef",g200:"#dcdcdc",g300:"#bdbdbd",g400:"#989898",g500:"#7c7c7c",g600:"#656565",g700:"#525252",g800:"#3d3d3d",g900:"#292929",accent:"#1a73e8",accentLight:"#e8f0fe",accentDark:"#1557b0",green:"#0d9f4f",greenLight:"#e6f7ed",orange:"#e8710a",orangeLight:"#fef3e6",red:"#d93025",redLight:"#fde7e7",radius:"12px",rSm:"8px",rLg:"20px",font:"'DM Sans',-apple-system,BlinkMacSystemFont,sans-serif",mono:"'JetBrains Mono',monospace",shSm:"0 1px 3px rgba(0,0,0,0.06)",shMd:"0 4px 16px rgba(0,0,0,0.08)",shLg:"0 12px 40px rgba(0,0,0,0.1)"};

const css=`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=JetBrains+Mono:wght@400;500&family=Inter:wght@400;500;600;700;800;900&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&display=swap');*{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}body{font-family:${T.font};color:${T.g900};-webkit-font-smoothing:antialiased;background:${T.white}}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}.sr-fade{animation:fadeUp .6s cubic-bezier(.16,1,.3,1) both}.sr-d1{animation-delay:.1s}.sr-d2{animation-delay:.2s}.sr-d3{animation-delay:.3s}.sr-d4{animation-delay:.4s}`;

/* ═══ LANDING PAGE ═══ */
function LandingPage({onStart}){
  const[scrolled,setScrolled]=useState(false);
  useEffect(()=>{const h=()=>setScrolled(window.scrollY>20);window.addEventListener("scroll",h);return()=>window.removeEventListener("scroll",h)},[]);
  const Box=({children,style})=><div style={{maxWidth:1140,margin:"0 auto",padding:"0 24px",...style}}>{children}</div>;
  const Sec=({children,alt,id,style})=><section id={id} style={{padding:"100px 0",background:alt?T.g50:T.white,...style}}><Box>{children}</Box></section>;
  const Over=({children})=><div style={{fontSize:".78rem",fontWeight:600,textTransform:"uppercase",letterSpacing:".1em",color:T.accent,marginBottom:12}}>{children}</div>;
  const ST=({children,style})=><h2 style={{fontSize:"clamp(1.8rem,4vw,2.4rem)",fontWeight:700,lineHeight:1.15,letterSpacing:"-.02em",color:T.black,marginBottom:16,...style}}>{children}</h2>;
  const SD=({children,style})=><p style={{fontSize:"1.05rem",color:T.g600,lineHeight:1.7,maxWidth:600,...style}}>{children}</p>;

  return(<div style={{minHeight:"100vh",background:T.white}}><style>{css}</style>

  {/* NAV */}
  <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,background:scrolled?"rgba(250,250,250,.85)":"transparent",backdropFilter:scrolled?"blur(20px)":"none",WebkitBackdropFilter:scrolled?"blur(20px)":"none",borderBottom:scrolled?`1px solid ${T.g100}`:"1px solid transparent",boxShadow:scrolled?T.shSm:"none",transition:"all .3s"}}>
    <div style={{maxWidth:1140,margin:"0 auto",padding:"0 24px",display:"flex",alignItems:"center",justifyContent:"space-between",height:64}}>
      <img src="/logo.png" alt="SiteReady" style={{height:28,opacity:.92}}/>
      <div style={{display:"flex",gap:32,alignItems:"center"}}>
        {[["#problem","Problem"],["#how","So funktioniert's"],["#preise","Preise"],["#vergleich","Vergleich"]].map(([h,l])=><a key={h} href={h} style={{fontSize:".9rem",fontWeight:500,color:T.g600,textDecoration:"none"}}>{l}</a>)}
        <button onClick={onStart} style={{background:T.black,color:T.white,padding:"8px 20px",borderRadius:8,fontWeight:600,fontSize:".85rem",border:"none",cursor:"pointer",fontFamily:T.font}}>Jetzt starten →</button>
      </div>
    </div>
  </nav>

  {/* HERO */}
  <section style={{minHeight:"100vh",display:"flex",alignItems:"center",paddingTop:64,position:"relative",overflow:"hidden"}}>
    <div style={{position:"absolute",top:-200,right:-200,width:600,height:600,borderRadius:"50%",background:"radial-gradient(circle,rgba(26,115,232,.06) 0%,transparent 70%)",pointerEvents:"none"}}/>
    <div style={{position:"absolute",bottom:-100,left:-150,width:400,height:400,borderRadius:"50%",background:"radial-gradient(circle,rgba(13,159,79,.04) 0%,transparent 70%)",pointerEvents:"none"}}/>
    <Box><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:80,alignItems:"center",position:"relative",zIndex:1}}>
      <div className="sr-fade">
        <div style={{display:"inline-flex",alignItems:"center",gap:8,background:T.greenLight,color:T.green,padding:"6px 14px",borderRadius:100,fontSize:".8rem",fontWeight:600,marginBottom:24}}><span style={{width:6,height:6,borderRadius:"50%",background:T.green,animation:"pulse 2s infinite"}}/>Jetzt in Österreich</div>
        <h1 style={{fontSize:"clamp(2.4rem,5vw,3.4rem)",fontWeight:700,lineHeight:1.1,letterSpacing:"-.03em",color:T.black,marginBottom:20}}>Deine Website in<br/><span style={{background:"linear-gradient(135deg,#1a73e8,#4dabf5)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>Minuten.</span><br/>Mit Impressum & DSGVO.</h1>
        <p style={{fontSize:"1.15rem",color:T.g600,lineHeight:1.7,marginBottom:36,maxWidth:480}}>SiteReady erstellt für dein Handwerksunternehmen eine fertige Website – inklusive Impressum nach ECG, DSGVO-Erklärung und Google-Indexierung. Du beantwortest nur 10 Fragen. Vorschau vor der Bezahlung.</p>
        <div style={{display:"flex",gap:14,marginBottom:40}}>
          <button onClick={onStart} style={{display:"inline-flex",alignItems:"center",gap:8,padding:"14px 28px",borderRadius:10,fontSize:".95rem",fontWeight:600,border:"none",cursor:"pointer",background:T.black,color:T.white,boxShadow:"0 2px 8px rgba(0,0,0,.15)",fontFamily:T.font}}>Website erstellen →</button>
          <a href="#how" style={{display:"inline-flex",alignItems:"center",gap:8,padding:"14px 28px",borderRadius:10,fontSize:".95rem",fontWeight:600,textDecoration:"none",background:T.white,color:T.black,border:`1.5px solid ${T.g200}`}}>So funktioniert's</a>
        </div>
        <div style={{display:"flex",gap:32,paddingTop:8,borderTop:`1px solid ${T.g100}`}}>
          {[["Minuten","Time-to-live"],["Ab €18","pro Monat"],["120k+","Zielgruppe AT"]].map(([v,l])=><div key={l}><span style={{fontSize:"1.5rem",fontWeight:700,color:T.black,fontFamily:T.mono}}>{v}</span><br/><span style={{fontSize:".78rem",color:T.g500}}>{l}</span></div>)}
        </div>
      </div>
      {/* Mockup */}
      <div className="sr-fade sr-d2" style={{position:"relative"}}>
        <div style={{background:T.white,border:`1px solid ${T.g200}`,borderRadius:T.rLg,boxShadow:T.shLg,overflow:"hidden",transform:"perspective(1000px) rotateY(-3deg) rotateX(2deg)",transition:"transform .5s"}}>
          <div style={{display:"flex",alignItems:"center",gap:6,padding:"12px 16px",background:T.g50,borderBottom:`1px solid ${T.g100}`}}>
            {["#ff5f57","#febc2e","#28c840"].map(c=><span key={c} style={{width:10,height:10,borderRadius:"50%",background:c}}/>)}
            <div style={{marginLeft:12,background:T.white,borderRadius:6,padding:"4px 14px",fontSize:".75rem",fontFamily:T.mono,color:T.g500,flex:1}}>meier-elektrotechnik.siteready.at</div>
          </div>
          <div style={{padding:24}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}><span style={{fontWeight:700,fontSize:"1rem",color:T.black}}>⚡ Meier Elektrotechnik</span><div style={{display:"flex",gap:16}}>{[1,2,3].map(i=><span key={i} style={{width:40,height:4,borderRadius:2,background:T.g200}}/>)}</div></div>
            <div style={{background:`linear-gradient(135deg,${T.g50},${T.accentLight})`,borderRadius:T.radius,padding:"32px 24px",marginBottom:20,textAlign:"center"}}>
              <h3 style={{fontSize:"1.1rem",fontWeight:700,marginBottom:8,color:T.black}}>Ihr Elektriker in Wien 1020</h3>
              <p style={{fontSize:".75rem",color:T.g500,marginBottom:12}}>Fachgerechte Elektroinstallationen &amp; 24h Notdienst</p>
              <span style={{display:"inline-block",padding:"6px 20px",background:T.accent,color:"white",borderRadius:6,fontSize:".7rem",fontWeight:600}}>Jetzt anrufen</span>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
              {[["🔧","Installationen"],["🏠","Smart Home"],["🚨","24h Notdienst"]].map(([ic,tx])=><div key={tx} style={{background:T.g50,borderRadius:T.rSm,padding:"14px 10px",textAlign:"center"}}><div style={{fontSize:"1.4rem",marginBottom:6}}>{ic}</div><div style={{fontSize:".65rem",color:T.g600,fontWeight:500}}>{tx}</div></div>)}
            </div>
          </div>
        </div>
        {[{l:"SSL aktiv",i:"🔒",bg:T.greenLight,top:"20%",right:-30,d:"0s"},{l:"Google indexiert",i:"📈",bg:T.accentLight,bottom:"20%",left:-30,d:"1.5s"},{l:"DSGVO + ECG",i:"⚖️",bg:T.orangeLight,top:"55%",right:-20,d:"3s"}].map(b=><div key={b.l} style={{position:"absolute",padding:"10px 16px",background:T.white,borderRadius:T.radius,boxShadow:T.shLg,fontSize:".78rem",fontWeight:600,display:"flex",alignItems:"center",gap:8,animation:`float 4s ease-in-out ${b.d} infinite`,top:b.top,bottom:b.bottom,left:b.left,right:b.right}}><span style={{width:28,height:28,borderRadius:8,background:b.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:".9rem"}}>{b.i}</span>{b.l}</div>)}
      </div>
    </div></Box>
  </section>

  {/* PROBLEM */}
  <Sec alt id="problem">
    <Over>Das Problem</Over><ST>Keine gute Option für<br/>österreichische Kleinbetriebe.</ST><SD style={{marginBottom:48}}>Jede bestehende Lösung hat einen entscheidenden Haken – zu teuer, zu aufwändig, oder ohne Impressum und Google-Sichtbarkeit.</SD>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:60,alignItems:"start"}}>
      <div>
        {[{n:"Linktree / Komi.io",p:"Gratis–€5/Mo",issue:"Kein Google, kein Impressum",chips:[["Kein SEO","r"],["Kein ECG","r"]]},{n:"Wix / Onepage.io",p:"€17–25/Mo",issue:"Zu aufwändig, Stunden bis Tage",chips:[["SEO manuell","o"],["Impressum manuell","o"]]},{n:"Agentur / Freelancer",p:"€1.500–5.000+",issue:"Zu teuer, Wochen bis Monate",chips:[["Teuer","r"],["Langsam","o"]]},{n:"Nur Social Media",p:"Gratis",issue:"Kein Google, Abmahnrisiko",chips:[["Kein SEO","r"],["Kein Impressum","r"]]}].map((c,i)=><div key={i} style={{padding:24,borderRadius:T.radius,border:`1px solid ${T.g100}`,background:T.white,marginBottom:14}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{fontWeight:600,fontSize:".95rem",color:T.black}}>{c.n}</span><span style={{fontFamily:T.mono,fontSize:".8rem",color:T.g500}}>{c.p}</span></div><div style={{fontSize:".85rem",color:T.red,fontWeight:500}}>{c.issue}</div><div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:10}}>{c.chips.map(([l,t])=><span key={l} style={{fontSize:".7rem",padding:"3px 10px",borderRadius:100,fontWeight:500,background:t==="r"?T.redLight:T.orangeLight,color:t==="r"?T.red:T.orange}}>{l}</span>)}</div></div>)}
      </div>
      <div style={{padding:28,borderRadius:T.radius,border:`2px solid ${T.accent}`,background:`linear-gradient(135deg,${T.accentLight},${T.white})`,position:"relative"}}>
        <span style={{position:"absolute",top:-12,right:20,background:T.accent,color:"white",fontSize:".7rem",fontWeight:700,padding:"4px 12px",borderRadius:100}}>Die Lösung</span>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{fontWeight:600,fontSize:"1.1rem",color:T.accent}}>SiteReady.at</span><span style={{fontFamily:T.mono,fontSize:".8rem",color:T.g500}}>Ab €18/Mo</span></div>
        <div style={{fontSize:".85rem",color:T.green,fontWeight:600}}>Fertig in wenigen Minuten – ohne Haken.</div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:16}}>{["SEO automatisch","Impressum (ECG)","DSGVO automatisch","Google-Indexierung","Live-Vorschau","SSL inklusive"].map(l=><span key={l} style={{fontSize:".7rem",padding:"3px 10px",borderRadius:100,fontWeight:500,background:T.greenLight,color:T.green}}>{l}</span>)}</div>
        <p style={{marginTop:20,fontSize:".88rem",color:T.g600,lineHeight:1.7}}>SiteReady ist kein Website-Builder – es ist ein <strong>Website-Service</strong>. Du beantwortest Fragen, wir liefern die fertige Website.</p>
      </div>
    </div>
  </Sec>

  {/* HOW IT WORKS */}
  <Sec id="how">
    <div style={{textAlign:"center"}}><Over>So funktioniert's</Over><ST style={{margin:"0 auto"}}>Von Null zur fertigen Website. Vollautomatisch.</ST><SD style={{margin:"0 auto"}}>Kein Builder. Kein Chat. Keine Entscheidungen. Nur 10 Fragen – fertig.</SD></div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:20,marginTop:56}}>
      {[{n:"01",i:"📋",bg:T.accentLight,t:"Fragebogen beantworten",d:"Firmenname, Branche, Leistungen, Kontaktdaten \u2013 8 bis 10 Fragen. Inkl. Stilauswahl."},{n:"02",i:"👁️",bg:T.accentLight,t:"Live-Vorschau prüfen",d:"Deine Website entsteht in Echtzeit im Browser – noch vor der Bezahlung. Ohne KI-Kosten, rein clientseitig."},{n:"03",i:"💳",bg:T.greenLight,t:"Bezahlen & loslegen",d:"Stripe Checkout (EPS, Karte, PayPal). Erst dann läuft die KI-Generierung – professionelle Texte, SEO, Rechtstexte."},{n:"04",i:"🔍",bg:T.greenLight,t:"Online & bei Google",d:"Hosting auf Cloudflare, SSL automatisch, Google-Indexierung über Search Console API. Sofort erreichbar."}].map((s,i)=><div key={i} style={{padding:"36px 28px",borderRadius:T.rLg,background:T.white,border:`1px solid ${T.g100}`,position:"relative",overflow:"hidden"}}><span style={{fontFamily:T.mono,fontSize:"3rem",fontWeight:700,color:T.g100,position:"absolute",top:16,right:20,lineHeight:1}}>{s.n}</span><div style={{width:44,height:44,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.2rem",marginBottom:16,background:s.bg}}>{s.i}</div><h3 style={{fontSize:"1.1rem",fontWeight:700,marginBottom:8,color:T.black}}>{s.t}</h3><p style={{fontSize:".88rem",color:T.g600,lineHeight:1.65}}>{s.d}</p></div>)}
    </div>
  </Sec>

  {/* DESIGN VARIANTS */}
  <Sec alt>
    <div style={{textAlign:"center"}}><Over>Automatisches Design</Over><ST>Keine Designentscheidung. Nur ein Gefühl.</ST><SD style={{margin:"0 auto"}}>SiteReady fragt: „Wie soll Ihr Betrieb wirken?" – und baut das passende Design automatisch.</SD></div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:24,marginTop:48}}>
      {[
        {t:"Professionell & seriös",d:"Klare Linien, gedämpfte Farben, serifenlose Schrift",gradient:"linear-gradient(160deg,#0f2b5b,#2563eb)",text:"Für Elektriker, Installateure, Baumeister"},
        {t:"Modern & frisch",d:"Helle Akzente, leichtes Layout, frische Farbpalette",gradient:"linear-gradient(135deg,#065f46,#10b981)",text:"Für Maler, Fliesenleger, Gärtner"},
        {t:"Bodenständig & vertraut",d:"Warme Töne, kräftige Schrift, solider Auftritt",gradient:"linear-gradient(160deg,#78350f,#b45309)",text:"Für Tischler, Zimmerer, Dachdecker"},
      ].map((v,i)=><div key={i} style={{borderRadius:T.rLg,overflow:"hidden",border:`1px solid ${T.g200}`,background:T.white}}>
        <div style={{background:v.gradient,padding:"32px 24px",color:"#fff"}}>
          <h3 style={{fontSize:"1.1rem",fontWeight:700,marginBottom:6}}>{v.t}</h3>
          <p style={{fontSize:".8rem",opacity:.8}}>{v.d}</p>
        </div>
        <div style={{padding:"16px 24px"}}>
          <p style={{fontSize:".82rem",color:T.g600,lineHeight:1.6}}>{v.text}</p>
        </div>
      </div>)}
    </div>
    <p style={{textAlign:"center",marginTop:24,fontSize:".85rem",color:T.g500}}>Die Auswahl wird pro Branche intelligent vorgeschlagen und kann optional geändert werden.</p>
  </Sec>

  {/* PRICING */}
  <Sec id="preise">
    <div style={{textAlign:"center"}}><Over>Preise</Over><ST>Ein Paket. Alles drin.</ST><SD style={{margin:"0 auto"}}>Keine Tarifauswahl, keine abgespeckte Version. Du bekommst alles, was du brauchst.</SD></div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,maxWidth:800,margin:"56px auto 0"}}>
      {[
        {name:"Variante A",sub:"Reines Abo",setup:"Keine",monthly:"€18",yr1:"€216",yr2:"€216",highlight:true},
        {name:"Variante B",sub:"Setup + Abo",setup:"€149 einmalig",monthly:"€13",yr1:"€305",yr2:"€156",highlight:false},
      ].map((pl,i)=><div key={i} style={{padding:"40px 32px",borderRadius:T.rLg,background:T.white,position:"relative",border:pl.highlight?`2px solid ${T.accent}`:`1px solid ${T.g200}`,boxShadow:pl.highlight?T.shMd:"none"}}>
        {pl.highlight&&<span style={{position:"absolute",top:-12,left:"50%",transform:"translateX(-50%)",background:T.accent,color:"white",fontSize:".7rem",fontWeight:700,padding:"4px 16px",borderRadius:100,whiteSpace:"nowrap"}}>Wird evaluiert</span>}
        <div style={{fontSize:"1rem",fontWeight:600,color:T.g600,marginBottom:4}}>{pl.name}</div>
        <div style={{fontSize:".82rem",color:T.g500,marginBottom:12}}>{pl.sub}</div>
        {pl.setup!=="Keine"&&<div style={{fontSize:".85rem",color:T.g700,marginBottom:4}}>Setup: <strong>{pl.setup}</strong></div>}
        <div style={{fontSize:"2.8rem",fontWeight:700,color:T.black,fontFamily:T.mono,lineHeight:1}}>{pl.monthly} <span style={{fontSize:"1rem",fontWeight:500,color:T.g500}}>/ Monat</span></div>
        <div style={{fontSize:".82rem",color:T.g500,marginTop:8,marginBottom:20}}>1. Jahr: {pl.yr1} · Ab 2. Jahr: {pl.yr2}</div>
        <ul style={{listStyle:"none",marginBottom:28}}>
          {[[1,"Subdomain sofort live"],[1,"Kein SiteReady-Branding"],[1,"Impressum (ECG) – anwaltl. geprüft"],[1,"DSGVO-Erklärung – anwaltl. geprüft"],[1,"SEO & Google-Indexierung"],[1,"Google Maps Einbettung"],[1,"Notdienst / 24h Badge"],[1,"Analytics-Dashboard"],[1,"Live-Vorschau vor Bezahlung"]].map(([ok,tx])=><li key={tx} style={{padding:"6px 0",fontSize:".85rem",color:T.g700,display:"flex",alignItems:"center",gap:10}}><span style={{color:T.green,fontWeight:700,fontSize:".9rem"}}>✓</span>{tx}</li>)}
        </ul>
        <button onClick={onStart} style={{width:"100%",padding:14,borderRadius:10,fontSize:".92rem",fontWeight:600,cursor:"pointer",fontFamily:T.font,background:pl.highlight?T.black:T.white,color:pl.highlight?T.white:T.black,border:pl.highlight?"none":`1.5px solid ${T.g200}`}}>Jetzt starten</button>
      </div>)}
    </div>
    <div style={{textAlign:"center",marginTop:32,maxWidth:640,margin:"32px auto 0"}}>
      <p style={{fontSize:".85rem",color:T.g600,lineHeight:1.7,marginBottom:8}}>Beide Varianten enthalten den <strong>vollen Leistungsumfang</strong>. 12 Monate Mindestlaufzeit.</p>
      <p style={{fontSize:".82rem",color:T.g500,lineHeight:1.7}}>Custom Domain optional über Self-Service-Portal (DNS-Anleitung inklusive) oder als Einrichtungshilfe für einmalig €100. Die endgültige Preisstruktur wird nach der Pilotphase validiert.</p>
    </div>
  </Sec>

  {/* COMPARISON */}
  <Sec alt id="vergleich">
    <div style={{textAlign:"center"}}><Over>Vergleich</Over><ST>SiteReady vs. der Rest.</ST></div>
    <div style={{overflowX:"auto",marginTop:48,borderRadius:T.rLg,border:`1px solid ${T.g100}`}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:".85rem"}}><thead><tr>{["Feature","SiteReady.at","Wix ADI","Jimdo","Linktree"].map((h,i)=><th key={h} style={{textAlign:"left",padding:"16px 20px",fontWeight:600,fontSize:".8rem",color:i===1?T.accent:T.g500,textTransform:"uppercase",letterSpacing:".06em",background:i===1?T.accentLight:T.g50,borderBottom:`1px solid ${T.g100}`,width:i===0?180:undefined}}>{h}</th>)}</tr></thead><tbody>{[["Zeit bis live","Minuten","30–60 Min","60+ Min","5 Min"],["Impressum ECG","✓ Auto","✗","✗","✗"],["DSGVO","✓ Auto","✗","✗","✗"],["Google-Index","✓ Auto","Manuell","Manuell","✗"],["Live-Vorschau","✓ Vor Bezahlung","Teilweise","✗","✗"],["Lernkurve","Keine","Mittel","Mittel","Gering"],["Anwaltl. geprüft","✓ Impressum+DSGVO","✗","✗","✗"],["Einstiegspreis","Ab €18/Mo","€17/Mo","€11/Mo","Gratis/€5"]].map((row,i)=><tr key={i}>{row.map((c,j)=><td key={j} style={{padding:"14px 20px",borderBottom:i<7?`1px solid ${T.g50}`:"none",color:j===0?T.g800:j===1?T.accentDark:T.g700,fontWeight:j<=1?600:400,background:j===1?"rgba(26,115,232,.03)":"transparent"}}>{c}</td>)}</tr>)}</tbody></table>
    </div>
  </Sec>

  {/* TECH */}
  <Sec>
    <div style={{textAlign:"center"}}><Over>Technologie</Over><ST>Bewährter Tech-Stack.</ST></div>
    <div style={{display:"flex",flexWrap:"wrap",gap:14,justifyContent:"center",marginTop:48}}>
      {[["⚡","Nuxt.js"],["🗄️","Supabase (EU-Frankfurt)"],["🤖","Claude API"],["💳","Stripe"],["☁️","Cloudflare Pages"],["🔍","Google Search Console"]].map(([i,n])=><div key={n} style={{display:"flex",alignItems:"center",gap:10,padding:"14px 24px",borderRadius:100,background:T.white,border:`1px solid ${T.g100}`,fontSize:".88rem",fontWeight:500,color:T.g700}}><span style={{fontSize:"1.2rem"}}>{i}</span>{n}</div>)}
    </div>
  </Sec>

  {/* WHY NOW */}
  <Sec alt>
    <div style={{textAlign:"center"}}><Over>Warum jetzt</Over><ST>Der perfekte Zeitpunkt.</ST></div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20,marginTop:48}}>
      {[{i:"💰",t:"KI-Kosten sinken",d:"Erstmals kosteneffizient skalierbar."},{i:"⚖️",t:"DSGVO-Bewusstsein wächst",d:"Abmahnwellen 2023–2025 haben das Thema gebracht."},{i:"📱",t:"Link-in-Bio gesättigt",d:"Linktree & Co. lösen das SEO-Problem nicht."},{i:"🇦🇹",t:"Markt unbesetzt",d:"Kein Anbieter kombiniert ECG + DSGVO + SEO für AT."},{i:"🌐",t:"Domain gesichert",d:"siteready.at ist reserviert."},{i:"🚀",t:"Bootstrapped",d:"Aufbau neben bestehender Tätigkeit – kein Gründergehalt nötig, Break-even ab Tag 1."}].map((c,i)=><div key={i} style={{padding:28,borderRadius:T.radius,background:T.white,border:`1px solid ${T.g100}`}}><div style={{fontSize:"1.5rem",marginBottom:14}}>{c.i}</div><h3 style={{fontSize:"1rem",fontWeight:700,marginBottom:8,color:T.black}}>{c.t}</h3><p style={{fontSize:".85rem",color:T.g600,lineHeight:1.6}}>{c.d}</p></div>)}
    </div>
  </Sec>

  {/* CTA */}
  <section style={{padding:"100px 0",textAlign:"center",background:T.black,color:T.white,position:"relative",overflow:"hidden"}}>
    <div style={{position:"absolute",top:"-40%",left:"-10%",width:"50%",height:"180%",borderRadius:"50%",background:"radial-gradient(circle,rgba(26,115,232,.15) 0%,transparent 70%)"}}/>
    <Box style={{position:"relative",zIndex:1}}>
      <h2 style={{fontSize:"clamp(2rem,4vw,2.6rem)",fontWeight:700,lineHeight:1.15,marginBottom:18}}>Bereit für deine Website?</h2>
      <p style={{fontSize:"1.1rem",color:"rgba(255,255,255,.6)",marginBottom:36,maxWidth:500,margin:"0 auto 36px"}}>10 Fragen. Wenige Minuten. Fertig. Mit Impressum, DSGVO und Google – ab €18 pro Monat.</p>
      <button onClick={onStart} style={{background:T.white,color:T.black,padding:"16px 36px",borderRadius:10,fontSize:"1rem",fontWeight:700,border:"none",cursor:"pointer",fontFamily:T.font}}>Jetzt Website erstellen →</button>
    </Box>
  </section>

  {/* FOOTER */}
  <footer style={{padding:"48px 0 32px",borderTop:`1px solid ${T.g100}`,background:T.g50}}>
    <Box><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{fontSize:".82rem",color:T.g500}}>© 2026 SiteReady.at · Österreich</div><div style={{display:"flex",gap:24}}>{["Impressum","Datenschutz","Kontakt"].map(l=><a key={l} href="#" style={{fontSize:".82rem",color:T.g500,textDecoration:"none"}}>{l}</a>)}</div></div></Box>
  </footer>
  </div>);
}

/* ═══ SUCCESS (restyled) ═══ */
function SuccessPage({data,onBack}){
  const sub=data.firmenname?data.firmenname.toLowerCase().replace(/\s+/g,"-").replace(/[^a-zäöüß0-9-]/g,""):"firmenname";
  return(<div style={{minHeight:"100vh",background:`linear-gradient(180deg,${T.greenLight},#ecfdf5)`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:T.font,padding:24,textAlign:"center"}}><style>{css}</style>
    <div className="sr-fade" style={{width:64,height:64,borderRadius:"50%",background:`linear-gradient(135deg,${T.green},#10b981)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,marginBottom:20,boxShadow:"0 8px 24px rgba(13,159,79,.25)",color:"#fff"}}>✓</div>
    <h1 className="sr-fade sr-d1" style={{fontSize:28,fontWeight:700,color:"#065f46",margin:"0 0 8px"}}>Ihre Website ist bereit!</h1>
    <p className="sr-fade sr-d2" style={{fontSize:16,color:"#4b7c6a",margin:"0 0 24px",maxWidth:480,lineHeight:1.6}}>In der Vollversion wäre Ihre Website jetzt live unter:</p>
    <div className="sr-fade sr-d3" style={{display:"inline-flex",alignItems:"center",gap:8,background:T.white,border:"2px solid #d1fae5",borderRadius:T.radius,padding:"12px 20px",marginBottom:32}}><span style={{fontSize:16,fontWeight:600,color:"#065f46",fontFamily:T.mono}}>{sub}.siteready.at</span></div>
    <div className="sr-fade sr-d4" style={{maxWidth:520,width:"100%",textAlign:"left",marginBottom:32}}>
      <h3 style={{fontSize:14,fontWeight:700,color:"#065f46",marginBottom:14}}>Was als nächstes passiert:</h3>
      {[{n:"1",t:"KI-Texte generiert",d:"Professionelle Texte für Ihren Betrieb.",ok:true},{n:"2",t:"Impressum & DSGVO",d:"Anwaltlich geprüfte Vorlagen.",ok:true},{n:"3",t:"Google-Indexierung",d:"Automatisch bei Google angemeldet.",ok:true},{n:"4",t:"Self-Service-Portal",d:"Daten ändern, Logo hochladen, Rechnungen.",ok:false},{n:"5",t:"Custom Domain",d:"Eigene Domain verbinden.",ok:false}].map((s,i)=><div key={i} style={{display:"flex",gap:12,marginBottom:10,padding:"12px 14px",background:T.white,borderRadius:T.rSm,border:"1px solid #d1fae5"}}><div style={{width:28,height:28,borderRadius:"50%",background:s.ok?"#10b981":"#e5e7eb",color:s.ok?"#fff":"#9ca3af",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,flexShrink:0}}>{s.ok?"✓":s.n}</div><div><div style={{fontWeight:600,fontSize:13,color:T.black,marginBottom:2}}>{s.t}</div><div style={{fontSize:12,color:T.g500}}>{s.d}</div></div></div>)}
    </div>
    <button onClick={onBack} style={{padding:"10px 20px",border:`1.5px solid ${T.g200}`,borderRadius:T.rSm,background:T.white,color:T.g700,cursor:"pointer",fontSize:13,fontWeight:500,fontFamily:T.font}}>← Zurück</button>
  </div>);
}

/* ═══ FORM COMPONENTS (restyled) ═══ */
function Field({label,value,onChange,placeholder,type="text",rows,hint}){const[f,setF]=useState(false);const bdr=f?`1.5px solid ${T.accent}`:`1.5px solid ${T.g200}`;const sh=f?"0 0 0 3px rgba(26,115,232,.08)":"none";const base={width:"100%",padding:"11px 14px",border:bdr,borderRadius:T.rSm,fontSize:14,fontFamily:T.font,background:"#fff",color:T.black,outline:"none",transition:"border-color .2s,box-shadow .2s",boxShadow:sh,boxSizing:"border-box"};return(<div style={{marginBottom:16}}><label style={{display:"block",marginBottom:5,fontSize:"12.5px",fontWeight:600,color:f?T.accent:T.g500,transition:"color .2s"}}>{label}</label>{rows?<textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={rows} onFocus={()=>setF(true)} onBlur={()=>setF(false)} style={{...base,resize:"vertical",lineHeight:1.5}}/>:<input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} onFocus={()=>setF(true)} onBlur={()=>setF(false)} style={base}/>}{hint&&<div style={{marginTop:4,fontSize:11,color:T.g400}}>{hint}</div>}</div>)}

function Dropdown({label,value,onChange,options,placeholder,hint}){const[f,setF]=useState(false);return(<div style={{marginBottom:16}}><label style={{display:"block",marginBottom:5,fontSize:"12.5px",fontWeight:600,color:f?T.accent:T.g500}}>{label}</label><select value={value} onChange={e=>onChange(e.target.value)} onFocus={()=>setF(true)} onBlur={()=>setF(false)} style={{width:"100%",padding:"11px 14px",border:f?`1.5px solid ${T.accent}`:`1.5px solid ${T.g200}`,borderRadius:T.rSm,fontSize:14,fontFamily:T.font,background:"#fff",color:value?T.black:T.g400,outline:"none",transition:"all .2s",boxShadow:f?"0 0 0 3px rgba(26,115,232,.08)":"none",boxSizing:"border-box",cursor:"pointer",appearance:"none",backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M3 5l3 3 3-3' fill='none' stroke='%239ca3af' stroke-width='1.5'/%3E%3C/svg%3E\")",backgroundRepeat:"no-repeat",backgroundPosition:"right 14px center"}}><option value="" disabled>{placeholder||"Bitte wählen"}</option>{options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}</select>{hint&&<div style={{marginTop:4,fontSize:11,color:T.g400}}>{hint}</div>}</div>)}

function Checklist({label,options,selected,onChange,hint}){const toggle=i=>{if(selected.includes(i))onChange(selected.filter(s=>s!==i));else onChange([...selected,i])};return(<div style={{marginBottom:16}}><label style={{display:"block",marginBottom:8,fontSize:"12.5px",fontWeight:600,color:T.g500}}>{label}</label><div style={{display:"flex",flexWrap:"wrap",gap:6}}>{options.map(o=>{const on=selected.includes(o);return(<button key={o} onClick={()=>toggle(o)} style={{padding:"8px 14px",borderRadius:T.rSm,border:on?`1.5px solid ${T.accent}`:`1.5px solid ${T.g200}`,background:on?T.accentLight:"#fff",color:on?T.accentDark:T.g700,fontSize:13,fontWeight:on?600:400,cursor:"pointer",transition:"all .15s",display:"flex",alignItems:"center",gap:6,fontFamily:T.font}}><span style={{width:16,height:16,borderRadius:4,border:on?"none":`1.5px solid ${T.g300}`,background:on?T.accent:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"#fff",flexShrink:0}}>{on?"✓":""}</span>{o}</button>)})}</div>{hint&&<div style={{marginTop:6,fontSize:11,color:T.g400}}>{hint}</div>}</div>)}

function Toggle({label,checked,onChange,desc}){return(<label style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer",padding:"12px 14px",borderRadius:T.rSm,border:`1.5px solid ${T.g200}`,background:checked?T.accentLight:"#fff",transition:"all .2s",marginBottom:16}}><div style={{width:38,height:22,borderRadius:11,background:checked?T.accent:T.g300,transition:"background .2s",position:"relative",flexShrink:0}}><div style={{width:18,height:18,borderRadius:"50%",background:"#fff",position:"absolute",top:2,left:checked?18:2,transition:"left .2s",boxShadow:"0 1px 3px rgba(0,0,0,.15)"}}/></div><input type="checkbox" checked={checked} onChange={e=>onChange(e.target.checked)} style={{display:"none"}}/><div><span style={{fontSize:13,fontWeight:500,color:T.black}}>{label}</span>{desc&&<div style={{fontSize:11,color:T.g400}}>{desc}</div>}</div></label>)}

function StylePicker({value,onChange}){return(<div style={{display:"flex",flexDirection:"column",gap:10}}>{Object.entries(STYLES_MAP).map(([key,s])=>{const on=value===key;return(<button key={key} onClick={()=>onChange(key)} style={{display:"flex",alignItems:"center",gap:14,padding:"14px 16px",border:on?`2px solid ${T.accent}`:`2px solid ${T.g200}`,borderRadius:T.radius,background:on?T.accentLight:"#fff",cursor:"pointer",textAlign:"left",transition:"all .25s",fontFamily:T.font}}><div style={{width:44,height:44,borderRadius:10,background:s.heroGradient,flexShrink:0}}/><div style={{flex:1}}><div style={{fontWeight:600,fontSize:14,color:T.black,marginBottom:2}}>{s.label}</div><div style={{fontSize:12,color:T.g400}}>{s.desc}</div></div>{on&&<div style={{width:24,height:24,borderRadius:"50%",background:T.accent,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,flexShrink:0}}>✓</div>}</button>)})}</div>)}

/* ═══ PREVIEW (unchanged – customer website) ═══ */
function Preview({d,compact}){const s=STYLES_MAP[d.stil]||STYLES_MAP.professional;const extraItems=d.extraLeistung?d.extraLeistung.split("\n").filter(l=>l.trim()):[];const allItems=[...(d.leistungen||[]),...extraItems];const hasContact=d.adresse||d.telefon||d.email;const px=compact?"20px":"28px";const adressFull=[d.adresse,[d.plz,d.ort].filter(Boolean).join(" ")].filter(Boolean).join(", ");const zeit=d.oeffnungszeiten==="custom"?d.oeffnungszeitenCustom:(OEFFNUNGSZEITEN.find(o=>o.value===d.oeffnungszeiten)?.label||"");return(<div style={{fontFamily:s.font,background:s.bg,color:s.text,minHeight:"100%",fontSize:"14px",lineHeight:1.65,overflowY:"auto",transition:"background 0.4s"}}><div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:`10px ${px}`,background:s.cardBg,borderBottom:`1px solid ${s.borderColor}`,position:"sticky",top:0,zIndex:10}}><div style={{fontWeight:700,fontSize:compact?"13px":"15px",color:s.primary}}>{d.firmenname||"Firmenname"}</div><div style={{display:"flex",gap:compact?"12px":"20px",fontSize:compact?"10px":"12px",color:s.textMuted}}><span>Leistungen</span><span>Über uns</span><span>Kontakt</span></div></div><div style={{background:s.heroGradient,position:"relative",overflow:"hidden",padding:compact?"32px 20px 28px":"48px 28px 44px",color:"#fff"}}><div style={{position:"absolute",inset:0,background:s.heroOverlay}}/><div style={{position:"relative",zIndex:1}}>{d.notdienst&&<div style={{display:"inline-block",padding:"3px 10px",background:"rgba(255,255,255,0.18)",borderRadius:"20px",fontSize:"10px",fontWeight:600,letterSpacing:"0.05em",textTransform:"uppercase",marginBottom:"12px"}}>⚡ 24h Notdienst</div>}<h1 style={{fontSize:compact?"20px":"26px",fontWeight:700,margin:"0 0 8px",letterSpacing:"-0.025em",lineHeight:1.15}}>{d.firmenname||"Ihr Firmenname"}</h1><p style={{margin:"0 0 4px",opacity:0.85,fontSize:compact?"12px":"14px",fontWeight:500}}>{(d.branche==="sonstige"?d.brancheCustom:d.brancheLabel)||"Ihre Branche"}{d.einsatzgebiet?` · ${d.einsatzgebiet}`:""}</p>{d.kurzbeschreibung&&<p style={{margin:"12px 0 0",opacity:0.75,fontSize:compact?"11px":"13px",lineHeight:1.55}}>{d.kurzbeschreibung}</p>}{d.telefon&&<div style={{marginTop:"16px",display:"inline-flex",alignItems:"center",gap:"8px",background:"rgba(255,255,255,0.15)",borderRadius:s.radius,padding:"8px 16px",fontSize:"13px",fontWeight:600}}>📞 {d.telefon}</div>}</div></div><div style={{padding:`24px ${px} 20px`}}><div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"14px"}}><h2 style={{fontSize:compact?"15px":"18px",fontWeight:700,color:s.primary,margin:0}}>Unsere Leistungen</h2><div style={{flex:1,height:"1px",background:s.borderColor}}/></div>{allItems.length>0?(<div style={{display:"grid",gridTemplateColumns:compact?"1fr":"1fr 1fr",gap:"8px"}}>{allItems.map((l,i)=>(<div key={i} style={{background:s.cardBg,border:`1px solid ${s.borderColor}`,borderRadius:s.radius,padding:"11px 13px",display:"flex",alignItems:"flex-start",gap:"10px",boxShadow:s.shadow,fontSize:"12px"}}><div style={{width:"20px",height:"20px",borderRadius:s.radius,background:s.accentSoft,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:"9px",color:s.accent,fontWeight:700}}>{String(i+1).padStart(2,"0")}</div><span style={{fontWeight:500}}>{l}</span></div>))}</div>):(<div style={{background:s.cardBg,border:`2px dashed ${s.borderColor}`,borderRadius:s.radiusLg,padding:"24px",textAlign:"center",color:s.textLight,fontSize:"12px"}}>Ihre Leistungen erscheinen hier</div>)}</div><div style={{padding:`0 ${px} 24px`}}><div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"14px"}}><h2 style={{fontSize:compact?"15px":"18px",fontWeight:700,color:s.primary,margin:0}}>Über uns</h2><div style={{flex:1,height:"1px",background:s.borderColor}}/></div><div style={{background:s.cardBg,borderRadius:s.radiusLg,padding:"18px 20px",boxShadow:s.shadow,borderLeft:`3px solid ${s.accent}`}}><p style={{margin:0,color:s.textMuted,fontSize:"12px",lineHeight:1.7}}>{d.firmenname?`Dieser Text wird individuell für ${d.firmenname} generiert.`:"Hier entsteht Ihr individueller Über-uns-Text."}</p><div style={{marginTop:"10px",display:"inline-block",padding:"3px 9px",borderRadius:"20px",background:s.badgeBg,color:s.badgeText,fontSize:"9px",fontWeight:600}}>Wird nach Bestellung generiert</div></div></div>{hasContact&&(<div style={{margin:`0 ${px} 24px`,padding:"20px",background:s.cardBg,borderRadius:s.radiusLg,boxShadow:s.shadow,border:`1px solid ${s.borderColor}`}}><h2 style={{fontSize:compact?"15px":"18px",fontWeight:700,color:s.primary,margin:"0 0 14px"}}>Kontakt</h2><div style={{display:"grid",gridTemplateColumns:compact?"1fr":"1fr 1fr",gap:"8px"}}>{[{icon:"📍",label:"Adresse",value:adressFull},{icon:"📞",label:"Telefon",value:d.telefon},{icon:"✉️",label:"E-Mail",value:d.email},{icon:"🕐",label:"Öffnungszeiten",value:zeit}].filter(x=>x.value).map((x,i)=>(<div key={i} style={{padding:"10px 12px",borderRadius:s.radius,background:s.accentSoft,fontSize:"11px"}}><div style={{fontSize:"9px",color:s.textMuted,textTransform:"uppercase",letterSpacing:"0.05em",fontWeight:600,marginBottom:"3px"}}>{x.icon} {x.label}</div><div style={{fontWeight:500,whiteSpace:"pre-line",lineHeight:1.5}}>{x.value}</div></div>))}</div></div>)}<div style={{background:s.primary,color:"#fff",padding:`20px ${px}`,fontSize:"10px"}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:"12px"}}><div><div style={{fontWeight:700,fontSize:"13px",marginBottom:"3px"}}>{d.firmenname||"Firmenname"}</div><div style={{opacity:0.7}}>{adressFull}</div></div><div style={{textAlign:"right",opacity:0.7}}>{d.telefon&&<div>{d.telefon}</div>}{d.email&&<div>{d.email}</div>}</div></div><div style={{borderTop:"1px solid rgba(255,255,255,0.15)",paddingTop:"10px",display:"flex",justifyContent:"space-between",opacity:0.5,fontSize:"9px"}}><span>Impressum · Datenschutz</span><span>SiteReady.at</span></div></div></div>)}

/* ═══ QUESTIONNAIRE (restyled UI, same logic) ═══ */
function Questionnaire({data,setData,onComplete,onBack}){
  const[step,setStep]=useState(0);const ref=useRef(null);const[isMobile]=useState(typeof window!=="undefined"&&window.innerWidth<768);const[showPreview,setShowPreview]=useState(false);const up=useCallback(k=>v=>setData(d=>({...d,[k]:v})),[setData]);const go=n=>{setStep(n);if(ref.current)ref.current.scrollTop=0};const pct=((step+1)/STEPS.length)*100;const selectedBranche=BRANCHEN.find(b=>b.value===data.branche);const brancheLeistungen=selectedBranche?selectedBranche.leistungen:[];const onBrancheChange=val=>{const b=BRANCHEN.find(x=>x.value===val);setData(d=>({...d,branche:val,brancheLabel:b?b.label:"",brancheCustom:"",stil:b?b.stil:d.stil,leistungen:[],extraLeistung:""}))};
  const pages=[<><Field label="Firmenname" value={data.firmenname} onChange={up("firmenname")} placeholder="z.B. Elektro Müller GmbH"/><Dropdown label="Branche" value={data.branche} onChange={onBrancheChange} options={BRANCHEN} placeholder="Branche wählen" hint="Leistungen und Stil werden vorgeschlagen"/>{data.branche==="sonstige"&&<Field label="Ihre Branche" value={data.brancheCustom} onChange={up("brancheCustom")} placeholder="z.B. Spenglerei, Stuckateur, ..."/>}<Field label="Kurzbeschreibung" value={data.kurzbeschreibung} onChange={up("kurzbeschreibung")} placeholder="Seit 15 Jahren Ihr zuverlässiger Partner in Wien." rows={2} hint="Optional – 2–3 Sätze"/><Dropdown label="Bundesland" value={data.bundesland} onChange={v=>{up("bundesland")(v);const bl=BUNDESLAENDER.find(b=>b.value===v);up("einsatzgebiet")(bl?bl.label:"")}} options={BUNDESLAENDER} placeholder="Bundesland wählen"/></>,<>{brancheLeistungen.length>0?(<Checklist label="Leistungen auswählen" options={brancheLeistungen} selected={data.leistungen} onChange={up("leistungen")} hint="Wählen Sie die Leistungen, die Sie anbieten"/>):(<Field label="Ihre Leistungen (eine pro Zeile)" value={data.extraLeistung} onChange={up("extraLeistung")} placeholder={"Leistung 1\nLeistung 2\nLeistung 3"} rows={6} hint="3–6 Leistungen"/>)}{brancheLeistungen.length>0&&<Field label="Zusätzliche Leistung (optional)" value={data.extraLeistung} onChange={up("extraLeistung")} placeholder="z.B. Beratung, Planung, ..."/>}<Toggle label="24h Notdienst" checked={data.notdienst} onChange={up("notdienst")} desc="Wird prominent angezeigt"/></>,<><Field label="Straße & Hausnummer" value={data.adresse} onChange={up("adresse")} placeholder="Mariahilfer Straße 45/3"/><div style={{display:"grid",gridTemplateColumns:"120px 1fr",gap:12}}><Field label="PLZ" value={data.plz} onChange={up("plz")} placeholder="1060"/><Field label="Ort" value={data.ort} onChange={up("ort")} placeholder="Wien"/></div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}><Field label="Telefon" value={data.telefon} onChange={up("telefon")} placeholder="+43 1 234 56 78"/><Field label="E-Mail" value={data.email} onChange={up("email")} placeholder="office@firma.at" type="email"/></div><Field label="UID-Nummer" value={data.uid} onChange={up("uid")} placeholder="ATU12345678" hint="Für das Impressum (ECG)"/><Dropdown label="Öffnungszeiten" value={data.oeffnungszeiten} onChange={up("oeffnungszeiten")} options={OEFFNUNGSZEITEN} placeholder="Öffnungszeiten wählen"/>{data.oeffnungszeiten==="custom"&&<Field label="Ihre Öffnungszeiten" value={data.oeffnungszeitenCustom} onChange={up("oeffnungszeitenCustom")} placeholder={"Mo–Fr: 08:00–17:00\nSa: nach Vereinbarung"} rows={2}/>}</>,<><p style={{fontSize:13,color:T.g500,margin:"0 0 4px",lineHeight:1.6}}>Basierend auf Ihrer Branche empfehlen wir:</p><p style={{fontSize:14,fontWeight:600,color:T.black,margin:"0 0 14px"}}>{STYLES_MAP[data.stil]?.label||"Professionell & seriös"}</p><StylePicker value={data.stil} onChange={up("stil")}/></>];

  const formPanel=(<div style={{display:"flex",flexDirection:"column",background:T.white,borderRight:isMobile?"none":`1px solid ${T.g100}`,height:isMobile?"auto":"100%",minHeight:isMobile?"100vh":"auto",fontFamily:T.font}}>
    <div style={{padding:"16px 20px 0"}}><div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}><div style={{display:"flex",alignItems:"center",gap:8}}><button onClick={onBack} style={{background:"none",border:"none",cursor:"pointer",fontSize:16,color:T.g400,padding:2}}>←</button><img src="/icon.png" alt="SR" style={{height:22}}/><span style={{fontSize:14,fontWeight:700,color:T.black}}>SiteReady</span></div>{isMobile&&<button onClick={()=>setShowPreview(!showPreview)} style={{fontSize:11,fontWeight:600,color:T.accent,background:T.accentLight,padding:"3px 8px",borderRadius:6,border:"none",cursor:"pointer",fontFamily:T.font}}>{showPreview?"Formular":"Vorschau"}</button>}</div>
    <div style={{display:"flex",alignItems:"center",gap:10,margin:"10px 0 12px"}}><div style={{flex:1,height:4,borderRadius:2,background:T.g100,overflow:"hidden"}}><div style={{height:"100%",borderRadius:2,background:T.accent,width:`${pct}%`,transition:"width .4s"}}/></div><span style={{fontSize:11,color:T.g400,fontWeight:500}}>{step+1}/{STEPS.length}</span></div>
    <div style={{display:"flex",gap:2}}>{STEPS.map((s,i)=><button key={s.id} onClick={()=>go(i)} style={{flex:1,padding:"6px 2px 8px",border:"none",background:"transparent",cursor:"pointer",borderBottom:i===step?`2px solid ${T.accent}`:"2px solid transparent",fontFamily:T.font}}><div style={{fontSize:9,fontWeight:700,color:i===step?T.accent:T.g300,letterSpacing:".04em"}}>{s.num}</div><div style={{fontSize:11,fontWeight:i===step?600:400,color:i===step?T.black:T.g400}}>{s.title}</div></button>)}</div></div>
    <div ref={ref} style={{flex:1,overflowY:"auto",padding:"16px 20px"}}>{pages[step]}</div>
    <div style={{padding:"12px 20px",borderTop:`1px solid ${T.g100}`,display:"flex",justifyContent:"space-between"}}>{step>0?<button onClick={()=>go(step-1)} style={{padding:"9px 16px",border:`1.5px solid ${T.g200}`,borderRadius:T.rSm,background:T.white,color:T.g500,cursor:"pointer",fontSize:13,fontWeight:500,fontFamily:T.font}}>← Zurück</button>:<div/>}{step<STEPS.length-1?<button onClick={()=>go(step+1)} style={{padding:"9px 20px",border:"none",borderRadius:T.rSm,background:T.black,color:T.white,cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:T.font,boxShadow:"0 2px 8px rgba(0,0,0,.15)"}}>Weiter →</button>:<button onClick={onComplete} style={{padding:"9px 20px",border:"none",borderRadius:T.rSm,background:`linear-gradient(135deg,${T.green},#10b981)`,color:T.white,cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:T.font,boxShadow:"0 2px 8px rgba(13,159,79,.3)"}}>Website erstellen →</button>}</div>
  </div>);

  if(isMobile){if(showPreview)return<div style={{minHeight:"100vh"}}><div style={{padding:"8px 12px",background:T.white,borderBottom:`1px solid ${T.g100}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:12,fontWeight:600,fontFamily:T.font}}>Vorschau</span><button onClick={()=>setShowPreview(false)} style={{fontSize:12,fontWeight:600,color:T.accent,background:"none",border:"none",cursor:"pointer",fontFamily:T.font}}>← Formular</button></div><Preview d={data} compact/></div>;return formPanel}

  return(<div style={{display:"grid",gridTemplateColumns:"420px 1fr",height:"100vh",overflow:"hidden"}}><style>{css}</style>{formPanel}<div style={{display:"flex",flexDirection:"column",overflow:"hidden",background:T.g100}}>
    <div style={{padding:"8px 14px",background:T.g50,borderBottom:`1px solid ${T.g100}`,display:"flex",alignItems:"center",gap:10}}>
      <div style={{display:"flex",gap:5}}>{["#ff5f57","#febc2e","#28c840"].map(c=><span key={c} style={{width:10,height:10,borderRadius:"50%",background:c}}/>)}</div>
      <div style={{flex:1,background:T.white,borderRadius:6,padding:"5px 12px",fontSize:12,color:T.g400,display:"flex",alignItems:"center",gap:6,border:`1px solid ${T.g200}`,fontFamily:T.mono}}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>{data.firmenname?`${data.firmenname.toLowerCase().replace(/\s+/g,"-").replace(/[^a-zäöüß0-9-]/g,"")}.siteready.at`:"firmenname.siteready.at"}</div>
      <div style={{fontSize:10,fontWeight:700,background:`linear-gradient(135deg,${T.green},#10b981)`,color:T.white,padding:"4px 10px",borderRadius:6,textTransform:"uppercase",fontFamily:T.font}}>Live</div>
    </div>
    <div style={{flex:1,overflowY:"auto",background:"#fff",margin:8,borderRadius:T.rSm,boxShadow:T.shMd}}><Preview d={data}/></div>
  </div></div>);
}

/* ═══ APP ═══ */
export default function App(){const[page,setPage]=useState("landing");const[data,setData]=useState(INIT);if(page==="landing")return<LandingPage onStart={()=>setPage("form")}/>;if(page==="success")return<SuccessPage data={data} onBack={()=>setPage("form")}/>;return<Questionnaire data={data} setData={setData} onComplete={()=>setPage("success")} onBack={()=>setPage("landing")}/>}
