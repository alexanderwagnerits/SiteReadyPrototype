import { useState, useCallback, useRef, useEffect } from "react";

/* ═══ DATA ═══ */
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

const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{font-family:'Inter',system-ui,sans-serif;color:#0f172a;-webkit-font-smoothing:antialiased}
`;

/* ═══ LANDING PAGE ═══ */
function LandingPage({ onStart }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h);
  }, []);

  const Section = ({children, bg, id, py}) => <section id={id} style={{padding: py||"80px 24px", background: bg||"#fff"}}><div style={{maxWidth:"1080px",margin:"0 auto"}}>{children}</div></section>;
  const SectionTitle = ({tag, title, sub}) => (
    <div style={{textAlign:"center",marginBottom:"48px"}}>
      {tag && <div style={{display:"inline-block",padding:"5px 14px",borderRadius:"20px",background:"#dbeafe",color:"#1e40af",fontSize:"12px",fontWeight:600,marginBottom:"14px"}}>{tag}</div>}
      <h2 style={{fontSize:"clamp(26px,4vw,38px)",fontWeight:800,letterSpacing:"-0.03em",lineHeight:1.15,marginBottom:"12px",color:"#0f172a"}}>{title}</h2>
      {sub && <p style={{fontSize:"16px",color:"#64748b",maxWidth:"560px",margin:"0 auto",lineHeight:1.6}}>{sub}</p>}
    </div>
  );

  return (
    <div style={{minHeight:"100vh",background:"#fff"}}>
      <style>{css}</style>

      {/* NAV */}
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,padding:"12px 24px",background: scrolled ? "rgba(255,255,255,0.95)" : "transparent",backdropFilter: scrolled ? "blur(12px)" : "none",borderBottom: scrolled ? "1px solid #e5e7eb" : "1px solid transparent",transition:"all 0.3s"}}>
        <div style={{maxWidth:"1080px",margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <img src="/logo.png" alt="SiteReady" style={{height:"28px"}} />
          <div style={{display:"flex",gap:"24px",alignItems:"center"}}>
            <a href="#features" style={{fontSize:"13px",color:"#64748b",textDecoration:"none",fontWeight:500}}>Features</a>
            <a href="#how" style={{fontSize:"13px",color:"#64748b",textDecoration:"none",fontWeight:500}}>So funktioniert's</a>
            <a href="#pricing" style={{fontSize:"13px",color:"#64748b",textDecoration:"none",fontWeight:500}}>Preise</a>
            <button onClick={onStart} style={{padding:"8px 18px",border:"none",borderRadius:"8px",background:"#0f172a",color:"#fff",fontSize:"13px",fontWeight:600,cursor:"pointer"}}>Jetzt starten</button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{padding:"140px 24px 100px",background:"linear-gradient(180deg,#f8fafc 0%,#eef2ff 50%,#fff 100%)",textAlign:"center",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:"-200px",right:"-200px",width:"600px",height:"600px",borderRadius:"50%",background:"radial-gradient(circle,rgba(37,99,235,0.06) 0%,transparent 70%)"}} />
        <div style={{position:"absolute",bottom:"-100px",left:"-100px",width:"400px",height:"400px",borderRadius:"50%",background:"radial-gradient(circle,rgba(99,102,241,0.05) 0%,transparent 70%)"}} />
        <div style={{position:"relative",zIndex:1,maxWidth:"720px",margin:"0 auto"}}>
          <div style={{display:"inline-block",padding:"5px 14px",borderRadius:"20px",background:"#dbeafe",color:"#1e40af",fontSize:"12px",fontWeight:600,marginBottom:"24px",letterSpacing:"0.02em"}}>Für Handwerker in Österreich 🇦🇹</div>
          <h1 style={{fontSize:"clamp(36px,6vw,60px)",fontWeight:900,lineHeight:1.05,letterSpacing:"-0.04em",marginBottom:"20px"}}>
            Ihre Website.<br /><span style={{background:"linear-gradient(135deg,#2563eb,#7c3aed)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>In wenigen Minuten.</span>
          </h1>
          <p style={{fontSize:"clamp(16px,2vw,20px)",color:"#64748b",lineHeight:1.6,marginBottom:"8px",maxWidth:"540px",margin:"0 auto 8px"}}>
            Branche wählen, Daten eingeben – fertige Website erhalten.
          </p>
          <p style={{fontSize:"15px",color:"#94a3b8",marginBottom:"36px"}}>Mit Impressum & DSGVO. Auffindbar bei Google. Ab € 18/Monat.</p>
          <div style={{display:"flex",gap:"12px",justifyContent:"center",flexWrap:"wrap"}}>
            <button onClick={onStart} style={{padding:"16px 32px",border:"none",borderRadius:"12px",background:"linear-gradient(135deg,#2563eb,#1d4ed8)",color:"#fff",fontSize:"17px",fontWeight:700,cursor:"pointer",boxShadow:"0 4px 20px rgba(37,99,235,0.35)",transition:"transform 0.2s"}} onMouseEnter={e=>e.target.style.transform="translateY(-2px)"} onMouseLeave={e=>e.target.style.transform=""}>Jetzt Website erstellen →</button>
            <a href="#how" style={{padding:"16px 24px",border:"1.5px solid #d1d5db",borderRadius:"12px",background:"#fff",color:"#374151",fontSize:"15px",fontWeight:600,cursor:"pointer",textDecoration:"none",display:"flex",alignItems:"center",gap:"6px"}}>So funktioniert's ↓</a>
          </div>
        </div>

        {/* Demo preview mockup */}
        <div style={{maxWidth:"900px",margin:"60px auto 0",borderRadius:"16px",overflow:"hidden",boxShadow:"0 20px 60px rgba(0,0,0,0.12)",border:"1px solid #e2e8f0"}}>
          <div style={{padding:"8px 16px",background:"#f9fafb",borderBottom:"1px solid #e5e7eb",display:"flex",alignItems:"center",gap:"8px"}}>
            <div style={{display:"flex",gap:"5px"}}>{["#ef4444","#eab308","#22c55e"].map((c,i)=><span key={i} style={{width:"8px",height:"8px",borderRadius:"50%",background:c}} />)}</div>
            <div style={{flex:1,background:"#fff",borderRadius:"4px",padding:"4px 12px",fontSize:"11px",color:"#9ca3af",border:"1px solid #e5e7eb"}}>elektro-mueller.siteready.at</div>
          </div>
          <div style={{background:"linear-gradient(160deg,#0f2b5b 0%,#1e40af 50%,#2563eb 100%)",padding:"40px 32px",color:"#fff",textAlign:"left"}}>
            <div style={{display:"inline-block",padding:"3px 10px",background:"rgba(255,255,255,0.18)",borderRadius:"20px",fontSize:"10px",fontWeight:600,letterSpacing:"0.05em",textTransform:"uppercase",marginBottom:"10px"}}>⚡ 24h Notdienst</div>
            <h2 style={{fontSize:"24px",fontWeight:700,marginBottom:"6px"}}>Elektro Müller GmbH</h2>
            <p style={{opacity:0.8,fontSize:"14px"}}>Elektroinstallationen · Wien & Umgebung</p>
            <div style={{marginTop:"16px",display:"inline-flex",alignItems:"center",gap:"8px",background:"rgba(255,255,255,0.15)",borderRadius:"6px",padding:"8px 16px",fontSize:"13px",fontWeight:600}}>📞 +43 1 234 56 78</div>
          </div>
          <div style={{padding:"24px 32px",background:"#f8fafc",display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"10px"}}>
            {["Elektroinstallationen","Smart Home","Photovoltaik"].map((l,i)=>(
              <div key={i} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:"6px",padding:"10px 12px",fontSize:"12px",fontWeight:500,display:"flex",alignItems:"center",gap:"8px"}}>
                <span style={{width:"18px",height:"18px",borderRadius:"4px",background:"rgba(37,99,235,0.07)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"9px",color:"#2563eb",fontWeight:700}}>{String(i+1).padStart(2,"0")}</span>{l}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <Section bg="#fff" id="problem">
        <SectionTitle tag="Das Problem" title="Handwerker haben online keine gute Option" sub="Zu teuer, zu kompliziert, zu aufwändig – oder rechtlich unsicher." />
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:"12px"}}>
          {[
            {n:"Nur Social Media",p:"Kein Google, Abmahnrisiko",c:"#fef2f2",t:"#991b1b"},
            {n:"Linktree & Co",p:"Keine Indexierung, kein Impressum",c:"#fef2f2",t:"#991b1b"},
            {n:"Wix / Jimdo",p:"Stunden bis Tage, Lernkurve",c:"#fffbeb",t:"#92400e"},
            {n:"Agentur",p:"€ 1.500–5.000+, Wochen",c:"#fffbeb",t:"#92400e"},
            {n:"SiteReady",p:"Minuten, ab € 18/Mo, alles inklusive",c:"#ecfdf5",t:"#065f46"},
          ].map((r,i)=>(
            <div key={i} style={{padding:"18px 20px",borderRadius:"12px",background:r.c,border:`1px solid ${r.c}`}}>
              <div style={{fontWeight:700,fontSize:"14px",color:r.t,marginBottom:"4px"}}>{r.n}</div>
              <div style={{fontSize:"12px",color:r.t,opacity:0.8}}>{r.p}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* HOW IT WORKS */}
      <Section bg="#f8fafc" id="how">
        <SectionTitle tag="So funktioniert's" title="In 4 Schritten zur fertigen Website" sub="Kein Baukasten. Keine Designentscheidungen. Nur Ihre Daten." />
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:"20px"}}>
          {[
            {n:"01",t:"Branche wählen",d:"Wählen Sie aus 15 Handwerksbranchen – Leistungen und Design werden automatisch vorgeschlagen.",i:"🔧"},
            {n:"02",t:"Daten eingeben",d:"Firmenname, Adresse, Kontakt – die meisten Felder sind Dropdowns. Minimales Tippen.",i:"✏️"},
            {n:"03",t:"Vorschau prüfen",d:"Ihre Website entsteht in Echtzeit. Drei Stilvarianten zur Auswahl. Alles vor der Bezahlung sichtbar.",i:"👁️"},
            {n:"04",t:"Online gehen",d:"Bezahlen und Ihre Website ist live – mit Impressum, DSGVO und Google-Indexierung.",i:"🚀"},
          ].map((s,i)=>(
            <div key={i} style={{background:"#fff",borderRadius:"16px",padding:"28px 24px",border:"1px solid #e5e7eb",boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}>
              <div style={{fontSize:"28px",marginBottom:"12px"}}>{s.i}</div>
              <div style={{fontSize:"11px",fontWeight:700,color:"#2563eb",letterSpacing:"0.05em",marginBottom:"6px"}}>{s.n}</div>
              <h3 style={{fontSize:"17px",fontWeight:700,marginBottom:"8px",color:"#0f172a"}}>{s.t}</h3>
              <p style={{fontSize:"13px",color:"#64748b",lineHeight:1.6}}>{s.d}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* FEATURES */}
      <Section bg="#fff" id="features">
        <SectionTitle tag="Alles inklusive" title="Was Sie bekommen" sub="Ein Paket, alles drin. Keine versteckten Kosten." />
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:"16px"}}>
          {[
            {i:"📋",t:"Impressum & DSGVO",d:"Anwaltlich geprüfte Vorlagen, automatisch mit Ihren Daten befüllt. Immer aktuell bei Gesetzesänderungen."},
            {i:"🔍",t:"Google-Indexierung",d:"Ihre Website wird automatisch bei Google angemeldet. Kunden finden Sie, wenn sie nach Ihrem Handwerk suchen."},
            {i:"🎨",t:"3 Design-Varianten",d:"Professionell, Modern oder Bodenständig – passend zu Ihrer Branche vorgeschlagen, mit einem Klick änderbar."},
            {i:"📱",t:"Mobilfreundlich",d:"Ihre Website sieht auf Handy, Tablet und Desktop perfekt aus. Über 60% der Suchanfragen kommen vom Handy."},
            {i:"🔒",t:"SSL & Sicherheit",d:"Automatisches SSL-Zertifikat, gehostet auf Cloudflare – schnell, sicher und zuverlässig."},
            {i:"🗺️",t:"Google Maps",d:"Ihr Standort wird automatisch auf einer Karte angezeigt. Kunden finden den Weg zu Ihnen."},
            {i:"⚡",t:"Notdienst-Badge",d:"Bieten Sie einen 24/7 Notdienst an? Das wird prominent auf Ihrer Website angezeigt."},
            {i:"📊",t:"Analytics-Dashboard",d:"Sehen Sie, wie oft Ihre Website besucht wird und woher die Besucher kommen."},
            {i:"🌐",t:"Eigene Subdomain",d:"Sofort live unter firmenname.siteready.at. Custom Domain optional über das Self-Service-Portal."},
          ].map((f,i)=>(
            <div key={i} style={{padding:"24px",borderRadius:"12px",border:"1px solid #e5e7eb",background:"#fff"}}>
              <div style={{fontSize:"24px",marginBottom:"10px"}}>{f.i}</div>
              <h3 style={{fontSize:"15px",fontWeight:700,marginBottom:"6px",color:"#0f172a"}}>{f.t}</h3>
              <p style={{fontSize:"13px",color:"#64748b",lineHeight:1.6}}>{f.d}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* DEMO WEBSITES */}
      <Section bg="#f8fafc" id="demos">
        <SectionTitle tag="Beispiele" title="So sieht das Ergebnis aus" sub="Drei Branchen, drei Stile – automatisch generiert." />
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:"20px"}}>
          {[
            {name:"Elektro Müller",branche:"Elektroinstallationen",ort:"Wien",stil:"professional",gradient:"linear-gradient(160deg,#0f2b5b,#2563eb)"},
            {name:"Malermeister Gruber",branche:"Malerei & Anstrich",ort:"Graz",stil:"modern",gradient:"linear-gradient(135deg,#065f46,#10b981)"},
            {name:"Tischlerei Berger",branche:"Tischlerei",ort:"Salzburg",stil:"traditional",gradient:"linear-gradient(160deg,#78350f,#b45309)"},
          ].map((d,i)=>(
            <div key={i} style={{borderRadius:"16px",overflow:"hidden",border:"1px solid #e5e7eb",boxShadow:"0 2px 8px rgba(0,0,0,0.04)",background:"#fff"}}>
              <div style={{background:d.gradient,padding:"28px 24px",color:"#fff"}}>
                <div style={{fontWeight:700,fontSize:"18px",marginBottom:"4px"}}>{d.name}</div>
                <div style={{opacity:0.8,fontSize:"13px"}}>{d.branche} · {d.ort}</div>
              </div>
              <div style={{padding:"16px 24px"}}>
                <div style={{display:"flex",gap:"6px",flexWrap:"wrap",marginBottom:"12px"}}>
                  {(BRANCHEN.find(b=>b.label===d.branche)?.leistungen||[]).slice(0,3).map((l,j)=>(
                    <span key={j} style={{padding:"4px 10px",borderRadius:"6px",background:"#f1f5f9",fontSize:"11px",color:"#475569",fontWeight:500}}>{l}</span>
                  ))}
                </div>
                <div style={{fontSize:"11px",color:"#94a3b8"}}>Stil: {STYLES_MAP[d.stil].label}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* PRICING */}
      <Section bg="#fff" id="pricing">
        <SectionTitle tag="Preise" title="Ein Paket. Alles drin." sub="Zwei Zahlungsvarianten – Sie wählen, was besser passt." />
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"20px",maxWidth:"700px",margin:"0 auto"}}>
          {[
            {t:"Variante A",sub:"Reines Abo",price:"€ 18",per:"/Monat",setup:"Keine Setup-Gebühr",year:"€ 216 / Jahr",highlight:true},
            {t:"Variante B",sub:"Setup + Abo",price:"€ 13",per:"/Monat",setup:"€ 149 einmalig",year:"1. Jahr: € 305, danach € 156/Jahr",highlight:false},
          ].map((p,i)=>(
            <div key={i} style={{padding:"32px 28px",borderRadius:"16px",border: p.highlight ? "2px solid #2563eb" : "2px solid #e5e7eb",background:"#fff",position:"relative",boxShadow: p.highlight ? "0 4px 20px rgba(37,99,235,0.12)" : "none"}}>
              {p.highlight && <div style={{position:"absolute",top:"-12px",left:"50%",transform:"translateX(-50%)",padding:"3px 14px",borderRadius:"20px",background:"#2563eb",color:"#fff",fontSize:"11px",fontWeight:600}}>Beliebt</div>}
              <div style={{fontSize:"13px",fontWeight:600,color:"#6b7280",marginBottom:"4px"}}>{p.t}</div>
              <div style={{fontSize:"11px",color:"#9ca3af",marginBottom:"16px"}}>{p.sub}</div>
              <div style={{display:"flex",alignItems:"baseline",gap:"2px",marginBottom:"4px"}}>
                <span style={{fontSize:"36px",fontWeight:800,color:"#0f172a"}}>{p.price}</span>
                <span style={{fontSize:"16px",color:"#64748b"}}>{p.per}</span>
              </div>
              <div style={{fontSize:"12px",color:"#64748b",marginBottom:"4px"}}>{p.setup}</div>
              <div style={{fontSize:"11px",color:"#94a3b8",marginBottom:"20px"}}>{p.year}</div>
              <button onClick={onStart} style={{width:"100%",padding:"12px",border:"none",borderRadius:"10px",background: p.highlight ? "#2563eb" : "#f1f5f9",color: p.highlight ? "#fff" : "#374151",fontSize:"14px",fontWeight:600,cursor:"pointer"}}>Jetzt starten</button>
              <div style={{marginTop:"16px",fontSize:"12px",color:"#64748b",lineHeight:1.7}}>
                ✓ Impressum & DSGVO<br/>✓ Google-Indexierung<br/>✓ 3 Designvarianten<br/>✓ Subdomain inklusive<br/>✓ SSL & Hosting<br/>✓ Analytics-Dashboard
              </div>
            </div>
          ))}
        </div>
        <p style={{textAlign:"center",fontSize:"13px",color:"#94a3b8",marginTop:"24px"}}>12 Monate Mindestlaufzeit. Custom Domain optional. Keine versteckten Kosten.</p>
      </Section>

      {/* FAQ */}
      <Section bg="#f8fafc" id="faq">
        <SectionTitle tag="FAQ" title="Häufige Fragen" />
        <div style={{maxWidth:"680px",margin:"0 auto",display:"flex",flexDirection:"column",gap:"12px"}}>
          {[
            {q:"Brauche ich eine eigene Domain?",a:"Nein. Ihre Website ist sofort unter firmenname.siteready.at erreichbar. Wenn Sie später eine eigene Domain möchten, finden Sie im Self-Service-Portal eine Schritt-für-Schritt-Anleitung."},
            {q:"Was passiert mit Impressum und DSGVO?",a:"Beides wird automatisch aus anwaltlich geprüften Vorlagen generiert und mit Ihren Daten befüllt. Bei Gesetzesänderungen werden alle Texte automatisch aktualisiert."},
            {q:"Kann ich meine Website nachträglich ändern?",a:"Ja. Im Self-Service-Portal können Sie Daten ändern, ein Logo hochladen und Fotos ergänzen. Die Texte werden bei Änderungen automatisch neu generiert."},
            {q:"Wie werde ich bei Google gefunden?",a:"Ihre Website wird automatisch bei Google angemeldet (Search Console). Die SEO-Grundlagen – Meta-Tags, Schema.org, saubere Struktur – sind automatisch integriert."},
            {q:"Was kostet mich das?",a:"Ab € 18 pro Monat, alles inklusive. Keine Setup-Gebühr bei Variante A. Alternativ € 149 einmalig + € 13/Monat (Variante B). 12 Monate Mindestlaufzeit."},
            {q:"Ist das ein Baukasten wie Wix?",a:"Nein. SiteReady ist ein Service, kein Tool. Sie geben Ihre Daten ein und bekommen eine fertige Website. Kein Drag-and-Drop, keine Designentscheidungen, kein Lernen."},
            {q:"Was passiert nach 12 Monaten?",a:"Ihr Abo verlängert sich automatisch. Sie können jederzeit zum Ende der Laufzeit kündigen."},
          ].map((f,i)=>(
            <details key={i} style={{background:"#fff",borderRadius:"12px",border:"1px solid #e5e7eb",overflow:"hidden"}}>
              <summary style={{padding:"18px 24px",fontSize:"15px",fontWeight:600,cursor:"pointer",color:"#0f172a",listStyle:"none",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                {f.q}<span style={{color:"#94a3b8",fontSize:"18px",flexShrink:0,marginLeft:"12px"}}>+</span>
              </summary>
              <div style={{padding:"0 24px 18px",fontSize:"14px",color:"#64748b",lineHeight:1.7}}>{f.a}</div>
            </details>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <section style={{padding:"80px 24px",background:"linear-gradient(160deg,#0f172a 0%,#1e293b 100%)",textAlign:"center",color:"#fff"}}>
        <div style={{maxWidth:"600px",margin:"0 auto"}}>
          <h2 style={{fontSize:"clamp(24px,4vw,36px)",fontWeight:800,marginBottom:"12px",letterSpacing:"-0.02em"}}>Bereit für Ihre Website?</h2>
          <p style={{fontSize:"16px",opacity:0.7,marginBottom:"28px",lineHeight:1.6}}>Branche wählen, Daten eingeben, fertig. In wenigen Minuten online – mit allem, was Sie brauchen.</p>
          <button onClick={onStart} style={{padding:"16px 36px",border:"none",borderRadius:"12px",background:"#fff",color:"#0f172a",fontSize:"17px",fontWeight:700,cursor:"pointer",boxShadow:"0 4px 16px rgba(0,0,0,0.2)"}}>Jetzt Website erstellen →</button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{padding:"32px 24px",background:"#0f172a",borderTop:"1px solid #1e293b"}}>
        <div style={{maxWidth:"1080px",margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"16px"}}>
          <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
            <img src="/icon.png" alt="SR" style={{height:"24px",filter:"invert(1)"}} />
            <span style={{fontSize:"14px",fontWeight:600,color:"#fff"}}>SiteReady.at</span>
          </div>
          <div style={{fontSize:"12px",color:"#64748b"}}>© 2026 SiteReady.at · Österreich · Prototyp</div>
        </div>
      </footer>
    </div>
  );
}

/* ═══ SHARED FORM COMPONENTS (same as v4) ═══ */
function Field({label,value,onChange,placeholder,type="text",rows,hint}){const[f,setF]=useState(false);const bdr=f?"1.5px solid #2563eb":"1.5px solid #e0e0e0";const sh=f?"0 0 0 3px rgba(37,99,235,0.08)":"none";const base={width:"100%",padding:"11px 14px",border:bdr,borderRadius:"10px",fontSize:"14px",fontFamily:"'Inter',system-ui,sans-serif",background:"#fff",color:"#111",outline:"none",transition:"border-color 0.2s, box-shadow 0.2s",boxShadow:sh,boxSizing:"border-box"};return(<div style={{marginBottom:"16px"}}><label style={{display:"block",marginBottom:"5px",fontSize:"12.5px",fontWeight:600,color:f?"#2563eb":"#6b7280",transition:"color 0.2s"}}>{label}</label>{rows?<textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={rows} onFocus={()=>setF(true)} onBlur={()=>setF(false)} style={{...base,resize:"vertical",lineHeight:1.5}}/>:<input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} onFocus={()=>setF(true)} onBlur={()=>setF(false)} style={base}/>}{hint&&<div style={{marginTop:"4px",fontSize:"11px",color:"#9ca3af"}}>{hint}</div>}</div>)}
function Dropdown({label,value,onChange,options,placeholder,hint}){const[f,setF]=useState(false);return(<div style={{marginBottom:"16px"}}><label style={{display:"block",marginBottom:"5px",fontSize:"12.5px",fontWeight:600,color:f?"#2563eb":"#6b7280"}}>{label}</label><select value={value} onChange={e=>onChange(e.target.value)} onFocus={()=>setF(true)} onBlur={()=>setF(false)} style={{width:"100%",padding:"11px 14px",border:f?"1.5px solid #2563eb":"1.5px solid #e0e0e0",borderRadius:"10px",fontSize:"14px",fontFamily:"'Inter',system-ui,sans-serif",background:"#fff",color:value?"#111":"#9ca3af",outline:"none",transition:"all 0.2s",boxShadow:f?"0 0 0 3px rgba(37,99,235,0.08)":"none",boxSizing:"border-box",cursor:"pointer",appearance:"none",backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M3 5l3 3 3-3' fill='none' stroke='%239ca3af' stroke-width='1.5'/%3E%3C/svg%3E\")",backgroundRepeat:"no-repeat",backgroundPosition:"right 14px center"}}><option value="" disabled>{placeholder||"Bitte wählen"}</option>{options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}</select>{hint&&<div style={{marginTop:"4px",fontSize:"11px",color:"#9ca3af"}}>{hint}</div>}</div>)}
function Checklist({label,options,selected,onChange,hint}){const toggle=i=>{if(selected.includes(i))onChange(selected.filter(s=>s!==i));else onChange([...selected,i])};return(<div style={{marginBottom:"16px"}}><label style={{display:"block",marginBottom:"8px",fontSize:"12.5px",fontWeight:600,color:"#6b7280"}}>{label}</label><div style={{display:"flex",flexWrap:"wrap",gap:"6px"}}>{options.map(o=>{const on=selected.includes(o);return(<button key={o} onClick={()=>toggle(o)} style={{padding:"8px 14px",borderRadius:"8px",border:on?"1.5px solid #2563eb":"1.5px solid #e0e0e0",background:on?"rgba(37,99,235,0.06)":"#fff",color:on?"#1d4ed8":"#374151",fontSize:"13px",fontWeight:on?600:400,cursor:"pointer",transition:"all 0.15s",display:"flex",alignItems:"center",gap:"6px"}}><span style={{width:"16px",height:"16px",borderRadius:"4px",border:on?"none":"1.5px solid #d1d5db",background:on?"#2563eb":"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"10px",color:"#fff",flexShrink:0}}>{on?"✓":""}</span>{o}</button>)})}</div>{hint&&<div style={{marginTop:"6px",fontSize:"11px",color:"#9ca3af"}}>{hint}</div>}</div>)}
function Toggle({label,checked,onChange,desc}){return(<label style={{display:"flex",alignItems:"center",gap:"10px",cursor:"pointer",padding:"12px 14px",borderRadius:"10px",border:"1.5px solid #e0e0e0",background:checked?"rgba(37,99,235,0.04)":"#fff",transition:"all 0.2s",marginBottom:"16px"}}><div style={{width:"38px",height:"22px",borderRadius:"11px",background:checked?"#2563eb":"#d1d5db",transition:"background 0.2s",position:"relative",flexShrink:0}}><div style={{width:"18px",height:"18px",borderRadius:"50%",background:"#fff",position:"absolute",top:"2px",left:checked?"18px":"2px",transition:"left 0.2s",boxShadow:"0 1px 3px rgba(0,0,0,0.15)"}}/></div><input type="checkbox" checked={checked} onChange={e=>onChange(e.target.checked)} style={{display:"none"}}/><div><span style={{fontSize:"13px",fontWeight:500,color:"#111"}}>{label}</span>{desc&&<div style={{fontSize:"11px",color:"#9ca3af"}}>{desc}</div>}</div></label>)}
function StylePicker({value,onChange}){return(<div style={{display:"flex",flexDirection:"column",gap:"10px"}}>{Object.entries(STYLES_MAP).map(([key,s])=>{const on=value===key;return(<button key={key} onClick={()=>onChange(key)} style={{display:"flex",alignItems:"center",gap:"14px",padding:"14px 16px",border:on?`2px solid ${s.accent}`:"2px solid #e5e7eb",borderRadius:"12px",background:on?`${s.accent}06`:"#fff",cursor:"pointer",textAlign:"left",transition:"all 0.25s"}}><div style={{width:"44px",height:"44px",borderRadius:"10px",background:s.heroGradient,flexShrink:0}}/><div style={{flex:1}}><div style={{fontWeight:600,fontSize:"14px",color:"#111",marginBottom:"2px"}}>{s.label}</div><div style={{fontSize:"12px",color:"#9ca3af"}}>{s.desc}</div></div>{on&&<div style={{width:"24px",height:"24px",borderRadius:"50%",background:s.accent,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"13px",fontWeight:700,flexShrink:0}}>✓</div>}</button>)})}</div>)}

/* ═══ PREVIEW (same as v4) ═══ */
function Preview({d,compact}){const s=STYLES_MAP[d.stil]||STYLES_MAP.professional;const extraItems=d.extraLeistung?d.extraLeistung.split("\n").filter(l=>l.trim()):[];const allItems=[...(d.leistungen||[]),...extraItems];const hasContact=d.adresse||d.telefon||d.email;const px=compact?"20px":"28px";const adressFull=[d.adresse,[d.plz,d.ort].filter(Boolean).join(" ")].filter(Boolean).join(", ");const zeit=d.oeffnungszeiten==="custom"?d.oeffnungszeitenCustom:(OEFFNUNGSZEITEN.find(o=>o.value===d.oeffnungszeiten)?.label||"");return(<div style={{fontFamily:s.font,background:s.bg,color:s.text,minHeight:"100%",fontSize:"14px",lineHeight:1.65,overflowY:"auto",transition:"background 0.4s"}}><div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:`10px ${px}`,background:s.cardBg,borderBottom:`1px solid ${s.borderColor}`,position:"sticky",top:0,zIndex:10}}><div style={{fontWeight:700,fontSize:compact?"13px":"15px",color:s.primary}}>{d.firmenname||"Firmenname"}</div><div style={{display:"flex",gap:compact?"12px":"20px",fontSize:compact?"10px":"12px",color:s.textMuted}}><span>Leistungen</span><span>Über uns</span><span>Kontakt</span></div></div><div style={{background:s.heroGradient,position:"relative",overflow:"hidden",padding:compact?"32px 20px 28px":"48px 28px 44px",color:"#fff"}}><div style={{position:"absolute",inset:0,background:s.heroOverlay}}/><div style={{position:"relative",zIndex:1}}>{d.notdienst&&<div style={{display:"inline-block",padding:"3px 10px",background:"rgba(255,255,255,0.18)",borderRadius:"20px",fontSize:"10px",fontWeight:600,letterSpacing:"0.05em",textTransform:"uppercase",marginBottom:"12px"}}>⚡ 24h Notdienst</div>}<h1 style={{fontSize:compact?"20px":"26px",fontWeight:700,margin:"0 0 8px",letterSpacing:"-0.025em",lineHeight:1.15}}>{d.firmenname||"Ihr Firmenname"}</h1><p style={{margin:"0 0 4px",opacity:0.85,fontSize:compact?"12px":"14px",fontWeight:500}}>{(d.branche==="sonstige"?d.brancheCustom:d.brancheLabel)||"Ihre Branche"}{d.einsatzgebiet?` · ${d.einsatzgebiet}`:""}</p>{d.kurzbeschreibung&&<p style={{margin:"12px 0 0",opacity:0.75,fontSize:compact?"11px":"13px",lineHeight:1.55}}>{d.kurzbeschreibung}</p>}{d.telefon&&<div style={{marginTop:"16px",display:"inline-flex",alignItems:"center",gap:"8px",background:"rgba(255,255,255,0.15)",borderRadius:s.radius,padding:"8px 16px",fontSize:"13px",fontWeight:600}}>📞 {d.telefon}</div>}</div></div><div style={{padding:`24px ${px} 20px`}}><div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"14px"}}><h2 style={{fontSize:compact?"15px":"18px",fontWeight:700,color:s.primary,margin:0}}>Unsere Leistungen</h2><div style={{flex:1,height:"1px",background:s.borderColor}}/></div>{allItems.length>0?(<div style={{display:"grid",gridTemplateColumns:compact?"1fr":"1fr 1fr",gap:"8px"}}>{allItems.map((l,i)=>(<div key={i} style={{background:s.cardBg,border:`1px solid ${s.borderColor}`,borderRadius:s.radius,padding:"11px 13px",display:"flex",alignItems:"flex-start",gap:"10px",boxShadow:s.shadow,fontSize:"12px"}}><div style={{width:"20px",height:"20px",borderRadius:s.radius,background:s.accentSoft,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:"9px",color:s.accent,fontWeight:700}}>{String(i+1).padStart(2,"0")}</div><span style={{fontWeight:500}}>{l}</span></div>))}</div>):(<div style={{background:s.cardBg,border:`2px dashed ${s.borderColor}`,borderRadius:s.radiusLg,padding:"24px",textAlign:"center",color:s.textLight,fontSize:"12px"}}>Ihre Leistungen erscheinen hier</div>)}</div><div style={{padding:`0 ${px} 24px`}}><div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"14px"}}><h2 style={{fontSize:compact?"15px":"18px",fontWeight:700,color:s.primary,margin:0}}>Über uns</h2><div style={{flex:1,height:"1px",background:s.borderColor}}/></div><div style={{background:s.cardBg,borderRadius:s.radiusLg,padding:"18px 20px",boxShadow:s.shadow,borderLeft:`3px solid ${s.accent}`}}><p style={{margin:0,color:s.textMuted,fontSize:"12px",lineHeight:1.7}}>{d.firmenname?`Dieser Text wird individuell für ${d.firmenname} generiert.`:"Hier entsteht Ihr individueller Über-uns-Text."}</p><div style={{marginTop:"10px",display:"inline-block",padding:"3px 9px",borderRadius:"20px",background:s.badgeBg,color:s.badgeText,fontSize:"9px",fontWeight:600}}>Wird nach Bestellung generiert</div></div></div>{hasContact&&(<div style={{margin:`0 ${px} 24px`,padding:"20px",background:s.cardBg,borderRadius:s.radiusLg,boxShadow:s.shadow,border:`1px solid ${s.borderColor}`}}><h2 style={{fontSize:compact?"15px":"18px",fontWeight:700,color:s.primary,margin:"0 0 14px"}}>Kontakt</h2><div style={{display:"grid",gridTemplateColumns:compact?"1fr":"1fr 1fr",gap:"8px"}}>{[{icon:"📍",label:"Adresse",value:adressFull},{icon:"📞",label:"Telefon",value:d.telefon},{icon:"✉️",label:"E-Mail",value:d.email},{icon:"🕐",label:"Öffnungszeiten",value:zeit}].filter(x=>x.value).map((x,i)=>(<div key={i} style={{padding:"10px 12px",borderRadius:s.radius,background:s.accentSoft,fontSize:"11px"}}><div style={{fontSize:"9px",color:s.textMuted,textTransform:"uppercase",letterSpacing:"0.05em",fontWeight:600,marginBottom:"3px"}}>{x.icon} {x.label}</div><div style={{fontWeight:500,whiteSpace:"pre-line",lineHeight:1.5}}>{x.value}</div></div>))}</div></div>)}<div style={{background:s.primary,color:"#fff",padding:`20px ${px}`,fontSize:"10px"}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:"12px"}}><div><div style={{fontWeight:700,fontSize:"13px",marginBottom:"3px"}}>{d.firmenname||"Firmenname"}</div><div style={{opacity:0.7}}>{adressFull}</div></div><div style={{textAlign:"right",opacity:0.7}}>{d.telefon&&<div>{d.telefon}</div>}{d.email&&<div>{d.email}</div>}</div></div><div style={{borderTop:"1px solid rgba(255,255,255,0.15)",paddingTop:"10px",display:"flex",justifyContent:"space-between",opacity:0.5,fontSize:"9px"}}><span>Impressum · Datenschutz</span><span>SiteReady.at</span></div></div></div>)}

/* ═══ SUCCESS ═══ */
function SuccessPage({data,onBack}){const sub=data.firmenname?data.firmenname.toLowerCase().replace(/\s+/g,"-").replace(/[^a-zäöüß0-9-]/g,""):"firmenname";return(<div style={{minHeight:"100vh",background:"linear-gradient(180deg,#f0fdf4,#ecfdf5)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"'Inter',system-ui,sans-serif",padding:"24px",textAlign:"center"}}><style>{css}</style><div style={{width:"64px",height:"64px",borderRadius:"50%",background:"linear-gradient(135deg,#059669,#10b981)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"28px",marginBottom:"20px",boxShadow:"0 8px 24px rgba(5,150,105,0.25)"}}>✓</div><h1 style={{fontSize:"28px",fontWeight:800,color:"#065f46",margin:"0 0 8px"}}>Ihre Website ist bereit!</h1><p style={{fontSize:"16px",color:"#4b7c6a",margin:"0 0 24px",maxWidth:"480px",lineHeight:1.6}}>In der Vollversion wäre Ihre Website jetzt live unter:</p><div style={{display:"inline-flex",alignItems:"center",gap:"8px",background:"#fff",border:"2px solid #d1fae5",borderRadius:"12px",padding:"12px 20px",marginBottom:"32px"}}><span style={{fontSize:"16px",fontWeight:600,color:"#065f46"}}>{sub}.siteready.at</span></div><div style={{maxWidth:"520px",width:"100%",textAlign:"left",marginBottom:"32px"}}><h3 style={{fontSize:"14px",fontWeight:700,color:"#065f46",marginBottom:"14px"}}>Was als nächstes passiert:</h3>{[{n:"1",t:"KI-Texte generiert",d:"Professionelle Texte für Ihren Betrieb.",ok:true},{n:"2",t:"Impressum & DSGVO",d:"Anwaltlich geprüfte Vorlagen.",ok:true},{n:"3",t:"Google-Indexierung",d:"Automatisch bei Google angemeldet.",ok:true},{n:"4",t:"Self-Service-Portal",d:"Daten ändern, Logo & Fotos hochladen, Rechnungen.",ok:false},{n:"5",t:"Custom Domain (optional)",d:"Eigene Domain verbinden – Anleitung im Portal.",ok:false}].map((s,i)=>(<div key={i} style={{display:"flex",gap:"12px",marginBottom:"10px",padding:"12px 14px",background:"#fff",borderRadius:"10px",border:"1px solid #d1fae5"}}><div style={{width:"28px",height:"28px",borderRadius:"50%",background:s.ok?"#10b981":"#e5e7eb",color:s.ok?"#fff":"#9ca3af",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"12px",fontWeight:700,flexShrink:0}}>{s.ok?"✓":s.n}</div><div><div style={{fontWeight:600,fontSize:"13px",color:"#111",marginBottom:"2px"}}>{s.t}</div><div style={{fontSize:"12px",color:"#6b7280"}}>{s.d}</div></div></div>))}</div><div style={{display:"flex",gap:"12px",flexWrap:"wrap",justifyContent:"center"}}><button onClick={onBack} style={{padding:"10px 20px",border:"1.5px solid #d1d5db",borderRadius:"8px",background:"#fff",color:"#374151",cursor:"pointer",fontSize:"13px",fontWeight:500}}>← Zurück</button></div></div>)}

/* ═══ QUESTIONNAIRE (same structure as v4) ═══ */
function Questionnaire({data,setData,onComplete,onBack}){const[step,setStep]=useState(0);const ref=useRef(null);const[isMobile]=useState(typeof window!=="undefined"&&window.innerWidth<768);const[showPreview,setShowPreview]=useState(false);const up=useCallback(k=>v=>setData(d=>({...d,[k]:v})),[setData]);const go=n=>{setStep(n);if(ref.current)ref.current.scrollTop=0};const pct=((step+1)/STEPS.length)*100;const selectedBranche=BRANCHEN.find(b=>b.value===data.branche);const brancheLeistungen=selectedBranche?selectedBranche.leistungen:[];const onBrancheChange=val=>{const b=BRANCHEN.find(x=>x.value===val);setData(d=>({...d,branche:val,brancheLabel:b?b.label:"",brancheCustom:"",stil:b?b.stil:d.stil,leistungen:[],extraLeistung:""}))};
const pages=[<><Field label="Firmenname" value={data.firmenname} onChange={up("firmenname")} placeholder="z.B. Elektro Müller GmbH"/><Dropdown label="Branche" value={data.branche} onChange={onBrancheChange} options={BRANCHEN} placeholder="Branche wählen" hint="Leistungen und Stil werden vorgeschlagen"/>{data.branche==="sonstige"&&<Field label="Ihre Branche" value={data.brancheCustom} onChange={up("brancheCustom")} placeholder="z.B. Spenglerei, Stuckateur, ..."/>}<Field label="Kurzbeschreibung" value={data.kurzbeschreibung} onChange={up("kurzbeschreibung")} placeholder="Seit 15 Jahren Ihr zuverlässiger Partner in Wien." rows={2} hint="Optional – 2–3 Sätze"/><Dropdown label="Bundesland" value={data.bundesland} onChange={v=>{up("bundesland")(v);const bl=BUNDESLAENDER.find(b=>b.value===v);up("einsatzgebiet")(bl?bl.label:"")}} options={BUNDESLAENDER} placeholder="Bundesland wählen"/></>,<>{brancheLeistungen.length>0?(<Checklist label="Leistungen auswählen" options={brancheLeistungen} selected={data.leistungen} onChange={up("leistungen")} hint="Wählen Sie die Leistungen, die Sie anbieten"/>):(<Field label="Ihre Leistungen (eine pro Zeile)" value={data.extraLeistung} onChange={up("extraLeistung")} placeholder={"Leistung 1\nLeistung 2\nLeistung 3"} rows={6} hint="3–6 Leistungen"/>)}{brancheLeistungen.length>0&&<Field label="Zusätzliche Leistung (optional)" value={data.extraLeistung} onChange={up("extraLeistung")} placeholder="z.B. Beratung, Planung, ..."/>}<Toggle label="24h Notdienst" checked={data.notdienst} onChange={up("notdienst")} desc="Wird prominent angezeigt"/></>,<><Field label="Straße & Hausnummer" value={data.adresse} onChange={up("adresse")} placeholder="Mariahilfer Straße 45/3"/><div style={{display:"grid",gridTemplateColumns:"120px 1fr",gap:"12px"}}><Field label="PLZ" value={data.plz} onChange={up("plz")} placeholder="1060"/><Field label="Ort" value={data.ort} onChange={up("ort")} placeholder="Wien"/></div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px"}}><Field label="Telefon" value={data.telefon} onChange={up("telefon")} placeholder="+43 1 234 56 78"/><Field label="E-Mail" value={data.email} onChange={up("email")} placeholder="office@firma.at" type="email"/></div><Field label="UID-Nummer" value={data.uid} onChange={up("uid")} placeholder="ATU12345678" hint="Für das Impressum (ECG)"/><Dropdown label="Öffnungszeiten" value={data.oeffnungszeiten} onChange={up("oeffnungszeiten")} options={OEFFNUNGSZEITEN} placeholder="Öffnungszeiten wählen"/>{data.oeffnungszeiten==="custom"&&<Field label="Ihre Öffnungszeiten" value={data.oeffnungszeitenCustom} onChange={up("oeffnungszeitenCustom")} placeholder={"Mo–Fr: 08:00–17:00\nSa: nach Vereinbarung"} rows={2}/>}</>,<><p style={{fontSize:"13px",color:"#6b7280",margin:"0 0 4px",lineHeight:1.6}}>Basierend auf Ihrer Branche empfehlen wir:</p><p style={{fontSize:"14px",fontWeight:600,color:"#111",margin:"0 0 14px"}}>{STYLES_MAP[data.stil]?.label||"Professionell & seriös"}</p><StylePicker value={data.stil} onChange={up("stil")}/></>];
const formPanel=(<div style={{display:"flex",flexDirection:"column",background:"#fff",borderRight:isMobile?"none":"1px solid #e5e7eb",height:isMobile?"auto":"100%",minHeight:isMobile?"100vh":"auto"}}><div style={{padding:"16px 20px 0"}}><div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"4px"}}><div style={{display:"flex",alignItems:"center",gap:"8px"}}><button onClick={onBack} style={{background:"none",border:"none",cursor:"pointer",fontSize:"16px",color:"#9ca3af",padding:"2px"}}>←</button><img src="/icon.png" alt="SR" style={{height:"22px"}}/><span style={{fontSize:"14px",fontWeight:700,color:"#111"}}>SiteReady</span></div>{isMobile&&<button onClick={()=>setShowPreview(!showPreview)} style={{fontSize:"11px",fontWeight:600,color:"#059669",background:"#ecfdf5",padding:"3px 8px",borderRadius:"6px",border:"none",cursor:"pointer"}}>{showPreview?"Formular":"Vorschau"}</button>}</div><div style={{display:"flex",alignItems:"center",gap:"10px",margin:"10px 0 12px"}}><div style={{flex:1,height:"4px",borderRadius:"2px",background:"#e5e7eb",overflow:"hidden"}}><div style={{height:"100%",borderRadius:"2px",background:"#2563eb",width:`${pct}%`,transition:"width 0.4s"}}/></div><span style={{fontSize:"11px",color:"#9ca3af",fontWeight:500}}>{step+1}/{STEPS.length}</span></div><div style={{display:"flex",gap:"2px"}}>{STEPS.map((s,i)=>(<button key={s.id} onClick={()=>go(i)} style={{flex:1,padding:"6px 2px 8px",border:"none",background:"transparent",cursor:"pointer",borderBottom:i===step?"2px solid #2563eb":"2px solid transparent"}}><div style={{fontSize:"9px",fontWeight:700,color:i===step?"#2563eb":"#d1d5db",letterSpacing:"0.04em"}}>{s.num}</div><div style={{fontSize:"11px",fontWeight:i===step?600:400,color:i===step?"#111":"#9ca3af"}}>{s.title}</div></button>))}</div></div><div ref={ref} style={{flex:1,overflowY:"auto",padding:"16px 20px"}}>{pages[step]}</div><div style={{padding:"12px 20px",borderTop:"1px solid #e5e7eb",display:"flex",justifyContent:"space-between"}}>{step>0?<button onClick={()=>go(step-1)} style={{padding:"9px 16px",border:"1.5px solid #d1d5db",borderRadius:"8px",background:"#fff",color:"#6b7280",cursor:"pointer",fontSize:"13px",fontWeight:500}}>← Zurück</button>:<div/>}{step<STEPS.length-1?<button onClick={()=>go(step+1)} style={{padding:"9px 20px",border:"none",borderRadius:"8px",background:"#2563eb",color:"#fff",cursor:"pointer",fontSize:"13px",fontWeight:600,boxShadow:"0 2px 8px rgba(37,99,235,0.25)"}}>Weiter →</button>:<button onClick={onComplete} style={{padding:"9px 20px",border:"none",borderRadius:"8px",background:"linear-gradient(135deg,#059669,#10b981)",color:"#fff",cursor:"pointer",fontSize:"13px",fontWeight:600,boxShadow:"0 2px 8px rgba(5,150,105,0.3)"}}>Website erstellen →</button>}</div></div>);
if(isMobile){if(showPreview)return<div style={{minHeight:"100vh"}}><div style={{padding:"8px 12px",background:"#fff",borderBottom:"1px solid #e5e7eb",display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:"12px",fontWeight:600}}>Vorschau</span><button onClick={()=>setShowPreview(false)} style={{fontSize:"12px",fontWeight:600,color:"#2563eb",background:"none",border:"none",cursor:"pointer"}}>← Formular</button></div><Preview d={data} compact/></div>;return formPanel}
return(<div style={{display:"grid",gridTemplateColumns:"420px 1fr",height:"100vh",overflow:"hidden"}}><style>{css}</style>{formPanel}<div style={{display:"flex",flexDirection:"column",overflow:"hidden",background:"#e8eaed"}}><div style={{padding:"8px 14px",background:"#f9fafb",borderBottom:"1px solid #e5e7eb",display:"flex",alignItems:"center",gap:"10px"}}><div style={{display:"flex",gap:"5px"}}>{["#ef4444","#eab308","#22c55e"].map((c,i)=><span key={i} style={{width:"10px",height:"10px",borderRadius:"50%",background:c}}/>)}</div><div style={{flex:1,background:"#fff",borderRadius:"6px",padding:"5px 12px",fontSize:"12px",color:"#9ca3af",display:"flex",alignItems:"center",gap:"6px",border:"1px solid #e5e7eb"}}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>{data.firmenname?`${data.firmenname.toLowerCase().replace(/\s+/g,"-").replace(/[^a-zäöüß0-9-]/g,"")}.siteready.at`:"firmenname.siteready.at"}</div><div style={{fontSize:"10px",fontWeight:700,background:"linear-gradient(135deg,#059669,#10b981)",color:"#fff",padding:"4px 10px",borderRadius:"6px",textTransform:"uppercase"}}>Live</div></div><div style={{flex:1,overflowY:"auto",background:"#fff",margin:"8px",borderRadius:"8px",boxShadow:"0 2px 12px rgba(0,0,0,0.08)"}}><Preview d={data}/></div></div></div>)}

/* ═══ APP ═══ */
export default function App(){const[page,setPage]=useState("landing");const[data,setData]=useState(INIT);if(page==="landing")return<LandingPage onStart={()=>setPage("form")}/>;if(page==="success")return<SuccessPage data={data} onBack={()=>setPage("form")}/>;return<Questionnaire data={data} setData={setData} onComplete={()=>setPage("success")} onBack={()=>setPage("landing")}/>}
