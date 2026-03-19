import { useState, useCallback, useRef } from "react";

const STYLES = {
  professional: {
    label: "Professionell & seriös", desc: "Klare Linien, gedämpfte Farben, serifenlose Schrift",
    primary: "#0f2b5b", accent: "#2563eb", accentSoft: "rgba(37,99,235,0.07)",
    bg: "#f8fafc", cardBg: "#ffffff", text: "#0f172a", textMuted: "#64748b", textLight: "#94a3b8",
    borderColor: "#e2e8f0", font: "'Inter', system-ui, sans-serif",
    radius: "6px", radiusLg: "10px",
    heroGradient: "linear-gradient(160deg, #0f2b5b 0%, #1e40af 50%, #2563eb 100%)",
    heroOverlay: "radial-gradient(circle at 70% 20%, rgba(255,255,255,0.08) 0%, transparent 60%)",
    shadow: "0 1px 3px rgba(15,43,91,0.06)", badgeBg: "#dbeafe", badgeText: "#1e40af",
  },
  modern: {
    label: "Modern & frisch", desc: "Helle Akzente, leichtes Layout, frische Farbpalette",
    primary: "#065f46", accent: "#10b981", accentSoft: "rgba(16,185,129,0.07)",
    bg: "#f0fdf4", cardBg: "#ffffff", text: "#052e16", textMuted: "#4b7c6a", textLight: "#86b5a1",
    borderColor: "#d1fae5", font: "'DM Sans', system-ui, sans-serif",
    radius: "12px", radiusLg: "16px",
    heroGradient: "linear-gradient(135deg, #065f46 0%, #047857 40%, #10b981 100%)",
    heroOverlay: "radial-gradient(ellipse at 80% 30%, rgba(255,255,255,0.12) 0%, transparent 50%)",
    shadow: "0 1px 3px rgba(6,95,70,0.06)", badgeBg: "#d1fae5", badgeText: "#065f46",
  },
  traditional: {
    label: "Bodenständig & vertraut", desc: "Warme Töne, kräftige Schrift, solider Auftritt",
    primary: "#78350f", accent: "#d97706", accentSoft: "rgba(217,119,6,0.07)",
    bg: "#fffbeb", cardBg: "#ffffff", text: "#451a03", textMuted: "#92713a", textLight: "#b8a070",
    borderColor: "#fde68a", font: "'Source Serif 4', Georgia, serif",
    radius: "4px", radiusLg: "8px",
    heroGradient: "linear-gradient(160deg, #78350f 0%, #92400e 50%, #b45309 100%)",
    heroOverlay: "radial-gradient(circle at 30% 80%, rgba(255,255,255,0.06) 0%, transparent 50%)",
    shadow: "0 1px 3px rgba(120,53,15,0.06)", badgeBg: "#fef3c7", badgeText: "#92400e",
  },
};

const STEPS = [
  { id: "basics", title: "Grunddaten", num: "01" },
  { id: "services", title: "Leistungen", num: "02" },
  { id: "contact", title: "Kontakt", num: "03" },
  { id: "style", title: "Design", num: "04" },
];

const INIT = { firmenname: "", branche: "", leistungen: "", adresse: "", plz_ort: "", telefon: "", email: "", uid: "", oeffnungszeiten: "", einsatzgebiet: "", kurzbeschreibung: "", notdienst: false, stil: "professional" };

function Preview({ d }) {
  const s = STYLES[d.stil] || STYLES.professional;
  const items = d.leistungen ? d.leistungen.split("\n").filter(l => l.trim()) : [];
  const hasContact = d.adresse || d.telefon || d.email;
  return (
    <div style={{ fontFamily: s.font, background: s.bg, color: s.text, minHeight: "100%", fontSize: "14px", lineHeight: 1.65, overflowY: "auto", transition: "background 0.4s" }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&display=swap" rel="stylesheet" />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 28px", background: s.cardBg, borderBottom: `1px solid ${s.borderColor}`, position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ fontWeight: 700, fontSize: "15px", color: s.primary }}>{d.firmenname || "Firmenname"}</div>
        <div style={{ display: "flex", gap: "20px", fontSize: "12px", color: s.textMuted }}><span>Leistungen</span><span>Über uns</span><span>Kontakt</span></div>
      </div>
      <div style={{ background: s.heroGradient, position: "relative", overflow: "hidden", padding: "48px 28px 44px", color: "#fff" }}>
        <div style={{ position: "absolute", inset: 0, background: s.heroOverlay }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: "420px" }}>
          {d.notdienst && <div style={{ display: "inline-block", padding: "3px 10px", background: "rgba(255,255,255,0.18)", borderRadius: "20px", fontSize: "10px", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "12px" }}>⚡ 24h Notdienst</div>}
          <h1 style={{ fontSize: "26px", fontWeight: 700, margin: "0 0 8px", letterSpacing: "-0.025em", lineHeight: 1.15 }}>{d.firmenname || "Ihr Firmenname"}</h1>
          <p style={{ margin: "0 0 4px", opacity: 0.85, fontSize: "14px", fontWeight: 500 }}>{d.branche || "Ihre Branche"}{d.einsatzgebiet ? ` · ${d.einsatzgebiet}` : ""}</p>
          {d.kurzbeschreibung && <p style={{ margin: "12px 0 0", opacity: 0.75, fontSize: "13px", lineHeight: 1.55 }}>{d.kurzbeschreibung}</p>}
          {d.telefon && <div style={{ marginTop: "20px", display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.15)", borderRadius: s.radius, padding: "8px 16px", fontSize: "13px", fontWeight: 600 }}>📞 {d.telefon}</div>}
        </div>
      </div>
      <div style={{ padding: "32px 28px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}><h2 style={{ fontSize: "18px", fontWeight: 700, color: s.primary, margin: 0 }}>Unsere Leistungen</h2><div style={{ flex: 1, height: "1px", background: s.borderColor }} /></div>
        {items.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            {items.map((l, i) => (
              <div key={i} style={{ background: s.cardBg, border: `1px solid ${s.borderColor}`, borderRadius: s.radius, padding: "12px 14px", display: "flex", alignItems: "flex-start", gap: "10px", boxShadow: s.shadow, fontSize: "12.5px" }}>
                <div style={{ width: "22px", height: "22px", borderRadius: s.radius, background: s.accentSoft, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "10px", color: s.accent, fontWeight: 700 }}>{String(i+1).padStart(2,"0")}</div>
                <span style={{ fontWeight: 500 }}>{l.trim()}</span>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ background: s.cardBg, border: `2px dashed ${s.borderColor}`, borderRadius: s.radiusLg, padding: "28px", textAlign: "center", color: s.textLight, fontSize: "13px" }}><div style={{ fontSize: "24px", marginBottom: "6px", opacity: 0.5 }}>⚡</div>Ihre Leistungen erscheinen hier</div>
        )}
      </div>
      <div style={{ padding: "0 28px 28px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}><h2 style={{ fontSize: "18px", fontWeight: 700, color: s.primary, margin: 0 }}>Über uns</h2><div style={{ flex: 1, height: "1px", background: s.borderColor }} /></div>
        <div style={{ background: s.cardBg, borderRadius: s.radiusLg, padding: "20px 22px", boxShadow: s.shadow, borderLeft: `3px solid ${s.accent}` }}>
          <p style={{ margin: 0, color: s.textMuted, fontSize: "13px", lineHeight: 1.7 }}>{d.firmenname ? `Dieser Text wird nach der Bestellung individuell für ${d.firmenname} generiert – professionell formuliert mit KI, basierend auf Ihren Angaben.` : "Hier entsteht nach der Bestellung Ihr individueller Über-uns-Text."}</p>
          <div style={{ marginTop: "12px", display: "inline-block", padding: "4px 10px", borderRadius: "20px", background: s.badgeBg, color: s.badgeText, fontSize: "10px", fontWeight: 600 }}>Wird nach Bestellung generiert</div>
        </div>
      </div>
      {hasContact && (
        <div style={{ margin: "0 28px 28px", padding: "24px", background: s.cardBg, borderRadius: s.radiusLg, boxShadow: s.shadow, border: `1px solid ${s.borderColor}` }}>
          <h2 style={{ fontSize: "18px", fontWeight: 700, color: s.primary, margin: "0 0 16px" }}>Kontakt & Anfahrt</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            {[{icon:"📍",label:"Adresse",value:[d.adresse,d.plz_ort].filter(Boolean).join(", ")},{icon:"📞",label:"Telefon",value:d.telefon},{icon:"✉️",label:"E-Mail",value:d.email},{icon:"🕐",label:"Öffnungszeiten",value:d.oeffnungszeiten}].filter(x=>x.value).map((x,i)=>(
              <div key={i} style={{ padding: "12px 14px", borderRadius: s.radius, background: s.accentSoft, fontSize: "12px" }}>
                <div style={{ fontSize: "10px", color: s.textMuted, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600, marginBottom: "4px" }}>{x.icon} {x.label}</div>
                <div style={{ fontWeight: 500, whiteSpace: "pre-line", lineHeight: 1.5 }}>{x.value}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: "14px", borderRadius: s.radius, background: `${s.primary}08`, border: `1px dashed ${s.borderColor}`, height: "80px", display: "flex", alignItems: "center", justifyContent: "center", color: s.textLight, fontSize: "12px" }}>Google Maps wird hier eingebettet</div>
        </div>
      )}
      <div style={{ padding: "0 28px 20px", display: "flex", gap: "8px" }}>
        {["Impressum (ECG)","DSGVO-Erklärung"].map((t,i)=>(
          <div key={i} style={{ flex: 1, padding: "10px 14px", borderRadius: s.radius, background: s.cardBg, border: `1px solid ${s.borderColor}`, fontSize: "11px", color: s.textMuted, textAlign: "center" }}>
            <div style={{ fontWeight: 600, marginBottom: "2px", color: s.text }}>{t}</div>Wird automatisch generiert
          </div>
        ))}
      </div>
      <div style={{ background: s.primary, color: "#fff", padding: "24px 28px", fontSize: "11px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
          <div><div style={{ fontWeight: 700, fontSize: "14px", marginBottom: "4px" }}>{d.firmenname || "Firmenname"}</div><div style={{ opacity: 0.7, lineHeight: 1.5 }}>{d.adresse && <div>{d.adresse}</div>}{d.plz_ort && <div>{d.plz_ort}</div>}</div></div>
          <div style={{ textAlign: "right", opacity: 0.7, lineHeight: 1.5 }}>{d.telefon && <div>{d.telefon}</div>}{d.email && <div>{d.email}</div>}</div>
        </div>
        {d.uid && <div style={{ opacity: 0.5, marginBottom: "8px" }}>UID: {d.uid}</div>}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: "12px", display: "flex", justifyContent: "space-between", opacity: 0.5, fontSize: "10px" }}><span>Impressum · Datenschutzerklärung</span><span>Erstellt mit SiteReady.at</span></div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type="text", rows, hint }) {
  const [f, setF] = useState(false);
  const bdr = f ? "1.5px solid #2563eb" : "1.5px solid var(--color-border-tertiary)";
  const sh = f ? "0 0 0 3px rgba(37,99,235,0.08)" : "none";
  const base = { width:"100%", padding:"11px 14px", border:bdr, borderRadius:"10px", fontSize:"14px", fontFamily:"inherit", background:"var(--color-background-primary)", color:"var(--color-text-primary)", outline:"none", transition:"border-color 0.2s, box-shadow 0.2s", boxShadow:sh, boxSizing:"border-box" };
  return (
    <div style={{ marginBottom: "16px" }}>
      <label style={{ display:"block", marginBottom:"5px", fontSize:"12.5px", fontWeight:600, color: f ? "#2563eb" : "var(--color-text-secondary)", transition:"color 0.2s" }}>{label}</label>
      {rows ? <textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={rows} onFocus={()=>setF(true)} onBlur={()=>setF(false)} style={{...base, resize:"vertical", lineHeight:1.5}} />
        : <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} onFocus={()=>setF(true)} onBlur={()=>setF(false)} style={base} />}
      {hint && <div style={{ marginTop:"4px", fontSize:"11px", color:"var(--color-text-tertiary)" }}>{hint}</div>}
    </div>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <label style={{ display:"flex", alignItems:"center", gap:"10px", cursor:"pointer", padding:"12px 14px", borderRadius:"10px", border:"1.5px solid var(--color-border-tertiary)", background: checked ? "rgba(37,99,235,0.04)" : "var(--color-background-primary)", transition:"all 0.2s", marginBottom:"16px" }}>
      <div style={{ width:"38px", height:"22px", borderRadius:"11px", background: checked ? "#2563eb" : "var(--color-border-secondary)", transition:"background 0.2s", position:"relative", flexShrink:0 }}>
        <div style={{ width:"18px", height:"18px", borderRadius:"50%", background:"#fff", position:"absolute", top:"2px", left: checked ? "18px" : "2px", transition:"left 0.2s", boxShadow:"0 1px 3px rgba(0,0,0,0.15)" }} />
      </div>
      <input type="checkbox" checked={checked} onChange={e=>onChange(e.target.checked)} style={{ display:"none" }} />
      <span style={{ fontSize:"13px", fontWeight:500, color:"var(--color-text-primary)" }}>{label}</span>
    </label>
  );
}

function StylePicker({ value, onChange }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
      {Object.entries(STYLES).map(([key,s])=>{
        const on = value === key;
        return (
          <button key={key} onClick={()=>onChange(key)} style={{ display:"flex", alignItems:"center", gap:"14px", padding:"14px 16px", border: on ? `2px solid ${s.accent}` : "2px solid var(--color-border-tertiary)", borderRadius:"12px", background: on ? `${s.accent}06` : "var(--color-background-primary)", cursor:"pointer", textAlign:"left", transition:"all 0.25s", boxShadow: on ? `0 0 0 3px ${s.accent}12` : "none" }}>
            <div style={{ width:"44px", height:"44px", borderRadius:"10px", background:s.heroGradient, flexShrink:0, transition:"box-shadow 0.3s", boxShadow: on ? `0 4px 12px ${s.primary}30` : "none" }} />
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:600, fontSize:"14px", color:"var(--color-text-primary)", marginBottom:"2px" }}>{s.label}</div>
              <div style={{ fontSize:"12px", color:"var(--color-text-tertiary)", lineHeight:1.4 }}>{s.desc}</div>
            </div>
            {on && <div style={{ width:"24px", height:"24px", borderRadius:"50%", background:s.accent, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"13px", fontWeight:700, flexShrink:0 }}>✓</div>}
          </button>
        );
      })}
    </div>
  );
}

export default function App() {
  const [data, setData] = useState(INIT);
  const [step, setStep] = useState(0);
  const ref = useRef(null);
  const up = useCallback(k => v => setData(d => ({...d, [k]: v})), []);
  const go = n => { setStep(n); if(ref.current) ref.current.scrollTop=0; };
  const filled = Object.entries(data).filter(([k,v]) => k!=="stil" && k!=="notdienst" && v).length;
  const pct = ((step+1)/STEPS.length)*100;

  const pages = [
    <><Field label="Firmenname" value={data.firmenname} onChange={up("firmenname")} placeholder="z.B. Elektro Müller GmbH" /><Field label="Branche / Berufsgruppe" value={data.branche} onChange={up("branche")} placeholder="z.B. Elektroinstallationen" /><Field label="Kurzbeschreibung" value={data.kurzbeschreibung} onChange={up("kurzbeschreibung")} placeholder="Seit 15 Jahren Ihr zuverlässiger Partner für Elektroinstallationen in Wien und Umgebung." rows={2} hint="2–3 Sätze über Ihren Betrieb" /><Field label="Einsatzgebiet" value={data.einsatzgebiet} onChange={up("einsatzgebiet")} placeholder="z.B. Wien & Niederösterreich" /></>,
    <><Field label="Leistungen" value={data.leistungen} onChange={up("leistungen")} placeholder={"Elektroinstallationen\nStörungsbehebung & Reparatur\nSmart Home Systeme\nPhotovoltaik & Speicher\nNotdienst 24/7"} rows={6} hint="Eine Leistung pro Zeile – erscheinen als Kacheln auf Ihrer Website" /><Toggle label="24h Notdienst anbieten" checked={data.notdienst} onChange={up("notdienst")} /></>,
    <><Field label="Straße & Hausnummer" value={data.adresse} onChange={up("adresse")} placeholder="Mariahilfer Straße 45/3" /><Field label="PLZ & Ort" value={data.plz_ort} onChange={up("plz_ort")} placeholder="1060 Wien" /><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px"}}><Field label="Telefon" value={data.telefon} onChange={up("telefon")} placeholder="+43 1 234 56 78" /><Field label="E-Mail" value={data.email} onChange={up("email")} placeholder="office@firma.at" type="email" /></div><Field label="UID-Nummer" value={data.uid} onChange={up("uid")} placeholder="ATU12345678" hint="Für das Impressum (ECG) erforderlich" /><Field label="Öffnungszeiten" value={data.oeffnungszeiten} onChange={up("oeffnungszeiten")} placeholder={"Mo–Fr: 08:00–17:00\nSa: nach Vereinbarung"} rows={2} /></>,
    <><p style={{fontSize:"13px",color:"var(--color-text-secondary)",margin:"0 0 14px",lineHeight:1.6}}>Wählen Sie den Stil, der zu Ihrem Betrieb passt. Die Vorschau rechts aktualisiert sich sofort.</p><StylePicker value={data.stil} onChange={up("stil")} /></>,
  ];

  return (
    <div style={{ display:"grid", gridTemplateColumns:"420px 1fr", height:"88vh", maxHeight:"760px", borderRadius:"16px", overflow:"hidden", border:"1px solid var(--color-border-tertiary)", boxShadow:"0 8px 32px rgba(0,0,0,0.08)" }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&display=swap" rel="stylesheet" />

      <div style={{ display:"flex", flexDirection:"column", background:"var(--color-background-primary)", borderRight:"1px solid var(--color-border-tertiary)" }}>
        <div style={{ padding:"20px 24px 0" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"4px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
              <div style={{ width:"28px", height:"28px", borderRadius:"8px", background:"linear-gradient(135deg, #2563eb, #1d4ed8)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:"13px", fontWeight:700 }}>S</div>
              <span style={{ fontSize:"15px", fontWeight:700, color:"var(--color-text-primary)" }}>SiteReady</span>
            </div>
            <div style={{ fontSize:"11px", fontWeight:600, color:"#2563eb", background:"rgba(37,99,235,0.08)", padding:"3px 8px", borderRadius:"6px" }}>{filled} Felder</div>
          </div>
          <p style={{ margin:"6px 0 16px", fontSize:"13px", color:"var(--color-text-tertiary)" }}>Füllen Sie die Felder aus – Ihre Website entsteht live.</p>
          <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"16px" }}>
            <div style={{ flex:1, height:"4px", borderRadius:"2px", background:"var(--color-border-tertiary)", overflow:"hidden" }}><div style={{ height:"100%", borderRadius:"2px", background:"#2563eb", width:`${pct}%`, transition:"width 0.4s ease" }} /></div>
            <span style={{ fontSize:"11px", color:"var(--color-text-tertiary)", fontWeight:500 }}>{step+1}/{STEPS.length}</span>
          </div>
          <div style={{ display:"flex", gap:"2px" }}>
            {STEPS.map((s,i)=>(
              <button key={s.id} onClick={()=>go(i)} style={{ flex:1, padding:"8px 2px 10px", border:"none", background:"transparent", cursor:"pointer", borderBottom: i===step ? "2px solid #2563eb" : "2px solid transparent", transition:"all 0.2s" }}>
                <div style={{ fontSize:"10px", fontWeight:700, color: i===step ? "#2563eb" : "var(--color-text-tertiary)", letterSpacing:"0.04em" }}>{s.num}</div>
                <div style={{ fontSize:"11.5px", fontWeight: i===step ? 600 : 400, color: i===step ? "var(--color-text-primary)" : "var(--color-text-tertiary)" }}>{s.title}</div>
              </button>
            ))}
          </div>
        </div>
        <div ref={ref} style={{ flex:1, overflowY:"auto", padding:"20px 24px" }}>{pages[step]}</div>
        <div style={{ padding:"14px 24px", borderTop:"1px solid var(--color-border-tertiary)", display:"flex", justifyContent:"space-between" }}>
          {step > 0 ? <button onClick={()=>go(step-1)} style={{ padding:"9px 18px", border:"1.5px solid var(--color-border-secondary)", borderRadius:"8px", background:"var(--color-background-primary)", color:"var(--color-text-secondary)", cursor:"pointer", fontSize:"13px", fontWeight:500 }}>← Zurück</button> : <div/>}
          {step < STEPS.length-1
            ? <button onClick={()=>go(step+1)} style={{ padding:"9px 22px", border:"none", borderRadius:"8px", background:"#2563eb", color:"#fff", cursor:"pointer", fontSize:"13px", fontWeight:600, boxShadow:"0 2px 8px rgba(37,99,235,0.25)" }}>Weiter →</button>
            : <button onClick={()=>alert("In der fertigen Version öffnet sich hier Stripe Checkout.\n\nPrototyp – noch keine Bezahlung.")} style={{ padding:"9px 22px", border:"none", borderRadius:"8px", background:"linear-gradient(135deg, #059669, #10b981)", color:"#fff", cursor:"pointer", fontSize:"13px", fontWeight:600, boxShadow:"0 2px 8px rgba(5,150,105,0.3)" }}>Website erstellen →</button>}
        </div>
      </div>

      <div style={{ display:"flex", flexDirection:"column", overflow:"hidden", background:"#e8eaed" }}>
        <div style={{ padding:"8px 14px", background:"var(--color-background-secondary)", borderBottom:"1px solid var(--color-border-tertiary)", display:"flex", alignItems:"center", gap:"10px" }}>
          <div style={{ display:"flex", gap:"5px" }}>{["#ef4444","#eab308","#22c55e"].map((col,i)=><span key={i} style={{ width:"10px", height:"10px", borderRadius:"50%", background:col }} />)}</div>
          <div style={{ flex:1, background:"var(--color-background-primary)", borderRadius:"6px", padding:"5px 12px", fontSize:"12px", color:"var(--color-text-tertiary)", display:"flex", alignItems:"center", gap:"6px", border:"1px solid var(--color-border-tertiary)" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
            {data.firmenname ? `${data.firmenname.toLowerCase().replace(/\s+/g,"-").replace(/[^a-zäöüß0-9-]/g,"")}.siteready.at` : "firmenname.siteready.at"}
          </div>
          <div style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.03em", background:"linear-gradient(135deg, #059669, #10b981)", color:"#fff", padding:"4px 10px", borderRadius:"6px", textTransform:"uppercase" }}>Live</div>
        </div>
        <div style={{ flex:1, overflowY:"auto", background:"#fff", margin:"8px", borderRadius:"8px", boxShadow:"0 2px 12px rgba(0,0,0,0.08)" }}>
          <Preview d={data} />
        </div>
      </div>
    </div>
  );
}
