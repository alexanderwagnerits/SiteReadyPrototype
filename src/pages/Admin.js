import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../supabase";
import { T, CTA, css } from "../theme";
import { STYLES_MAP } from "../data";

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
const STATUS_LABELS={pending:"Eingang",in_arbeit:"In Generierung",trial:"Testphase",live:"Live",offline:"Offline"};
const STATUS_COLORS={pending:T.amber,in_arbeit:"#3b82f6",trial:"#8b5cf6",live:T.green,offline:"#64748b"};
const STATUS_FLOW=["pending","in_arbeit","trial","live"];

function StatusBadge({status}){const c=STATUS_COLORS[status]||T.textMuted;return(<span style={{display:"inline-block",padding:"3px 10px",borderRadius:4,background:c+"22",color:c,fontSize:".72rem",fontWeight:700,letterSpacing:".06em",textTransform:"uppercase"}}>{STATUS_LABELS[status]||status}</span>);}

const DESKTOP_ONLY_TABS=["finanzen","support","system","arch-system","arch-flows","docs"];

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
        api_keys:j.api_keys||{},
      });
    }catch(e){setExtStatus({anthropic:false,cloudflare:false,supabase:false,stripe:false,api_keys:{}});}
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
        issues.push({severity:"warn",msg:`Qualitaetsprobleme: ${order.quality_issues.map(i=>i.section?`${i.type}:${i.section}`:i.type||"?").join(", ")}`});
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
  if(sysStatus?.anthropic?.billing)alerts.push({type:"error",msg:"Anthropic Guthaben leer — keine Generierung oder Imports möglich",tab:"system",href:"https://console.anthropic.com/settings/plans",hrefLabel:"Credits aufladen"});
  else if(sysStatus?.anthropic&&!sysStatus.anthropic.ok)alerts.push({type:"warn",msg:"Anthropic API nicht erreichbar"+(sysStatus.anthropic.error?" — "+sysStatus.anthropic.error:""),tab:"system"});
  if(stuckOrders.length)alerts.push({type:"warn",msg:`${stuckOrders.length} Bestellung${stuckOrders.length>1?"en":""} seit >2h in Generierung – bitte pruefen`,tab:"sites"});
  if(extStatus?.api_keys&&!extStatus.api_keys.firecrawl)alerts.push({type:"warn",msg:"Firecrawl API Key fehlt — Website-Import funktioniert nur eingeschränkt (kein JS-Rendering)",tab:"system"});
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
    {id:"start",label:"Dashboard",icon:`<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>`,section:"ADMIN"},
    {id:"sites",label:"Kunden",icon:`<rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>`,badge:regenBadge},
    {id:"finanzen",label:"Finanzen",icon:`<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>`},
    {id:"support",label:"Support",icon:`<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>`,badge:tickets.filter(t=>t.status==="offen").length||null},
    {id:"system",label:"System",icon:`<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>`},
    {id:"arch-system",label:"Architektur",icon:`<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>`,section:"DOKUMENTATION"},
    {id:"arch-flows",label:"Flows",icon:`<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>`},
    {id:"docs",label:"Dokumentation",icon:`<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>`},
  ];

  return(<div style={{minHeight:"100vh",background:T.bg,fontFamily:T.font}}><style>{css}</style>
    <div className="ad-wrap" style={{display:"flex",height:"100vh"}}>
      {/* Sidebar — gleicher Stil wie Kunden-Portal */}
      <div className="ad-sidebar" style={{width:236,background:T.dark,display:"flex",flexDirection:"column",flexShrink:0,overflow:"hidden"}}>
        <div style={{padding:"22px 18px 18px",borderBottom:"1px solid rgba(255,255,255,.07)"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
            <img src="/logo.png" alt="SiteReady" style={{height:24,filter:"brightness(0) invert(1)",opacity:.88}} onError={e=>{e.currentTarget.style.display="none"}}/>
            <span style={{fontSize:".7rem",fontWeight:700,color:"#f59e0b",background:"rgba(245,158,11,.12)",padding:"3px 8px",borderRadius:4,letterSpacing:".08em"}}>ADMIN</span>
          </div>
          <button onClick={load} style={{display:"flex",alignItems:"center",gap:8,width:"100%",padding:"9px 12px",background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.08)",borderRadius:8,color:"rgba(255,255,255,.5)",cursor:"pointer",fontSize:".8rem",fontWeight:600,fontFamily:T.font}}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
            Aktualisieren
          </button>
        </div>
        <nav style={{padding:"12px 10px",flex:1,overflowY:"auto"}}>
          {TABS.map(t=><div key={t.id}>
            {t.section&&<div style={{fontSize:".64rem",fontWeight:700,letterSpacing:".09em",textTransform:"uppercase",color:"rgba(255,255,255,.2)",padding:"14px 8px 5px"}}>{t.section}</div>}
            <button onClick={()=>setTab(t.id)} className={`pt-ni${tab===t.id?" active":""}`} style={{display:"flex",alignItems:"center",gap:9,padding:"9px 10px",borderRadius:8,cursor:"pointer",color:tab===t.id?"#fff":"rgba(255,255,255,.45)",fontSize:".91rem",fontWeight:tab===t.id?600:500,background:tab===t.id?"rgba(255,255,255,.09)":"transparent",border:"none",width:"100%",fontFamily:"inherit",textAlign:"left",transition:"all .12s"}}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0,opacity:tab===t.id?.85:.5}} dangerouslySetInnerHTML={{__html:t.icon}}/>
              <span style={{flex:1}}>{t.label}</span>
              {t.badge&&<span style={{background:"#dc2626",color:"#fff",borderRadius:10,padding:"0 6px",fontSize:".72rem",fontWeight:700,lineHeight:"18px",minWidth:18,textAlign:"center"}}>{t.badge}</span>}
            </button>
          </div>)}
        </nav>
        <div style={{padding:"12px 10px 14px",borderTop:"1px solid rgba(255,255,255,.07)"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px",fontSize:".78rem",color:"rgba(255,255,255,.3)"}}>
            <span style={{width:7,height:7,borderRadius:"50%",background:orders.length>0?"#4ade80":"#f59e0b",flexShrink:0}}/>
            {orders.length} Sites &middot; {orders.filter(o=>o.status==="live").length} Live
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="ad-main" style={{flex:1,overflowY:"auto",padding:28,position:"relative"}}>
        {loading&&(()=>{const B=({w,h=14,r=6,mb=0})=><div style={{width:w,height:h,borderRadius:r,background:`linear-gradient(90deg,${T.bg3} 25%,${T.bg2} 50%,${T.bg3} 75%)`,backgroundSize:"200% 100%",animation:"shimmer 1.5s ease-in-out infinite",marginBottom:mb}}/>;return<div style={{display:"flex",flexDirection:"column",gap:16}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>{[0,1,2,3].map(i=><div key={i} style={{background:"#fff",borderRadius:T.r,padding:"16px 20px",border:`1px solid ${T.bg3}`}}><B w={80} h={12} mb={8}/><B w={60} h={28} mb={5}/><B w={100} h={11}/></div>)}</div>
          <div style={{background:"#fff",borderRadius:T.r,border:`1px solid ${T.bg3}`,boxShadow:T.sh2,overflow:"hidden"}}><div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 2fr 1fr",gap:0,padding:"12px 14px",background:T.bg,borderBottom:`1px solid ${T.bg3}`}}>{[80,60,50,60,100,60].map((w,i)=><B key={i} w={w} h={11}/>)}</div>{[0,1,2,3,4].map(i=><div key={i} style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 2fr 1fr",gap:0,padding:"13px 14px",borderBottom:`1px solid ${T.bg3}`}}>{[120,70,50,70,130,60].map((w,j)=><B key={j} w={w} h={12}/>)}</div>)}</div>
        </div>;})()}
        {isMobile&&DESKTOP_ONLY_TABS.includes(tab)&&<div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16,padding:"60px 24px",textAlign:"center"}}><div style={{fontSize:"1.4rem",fontWeight:800,color:T.textMuted}}>Desktop</div><div style={{fontWeight:700,fontSize:"1.1rem",color:T.dark}}>Desktop erforderlich</div><div style={{color:T.textMuted,fontSize:".88rem",maxWidth:280,lineHeight:1.6}}>Dieser Bereich ist fuer die Nutzung am Desktop optimiert. Bitte oeffne das Admin-Portal auf einem groesseren Bildschirm.</div></div>}
        {(!isMobile||!DESKTOP_ONLY_TABS.includes(tab))&&<>
        {!loading&&alerts.length>0&&<div style={{marginBottom:20,display:"flex",flexDirection:"column",gap:6}}>
          {alerts.map((a,i)=><div key={i} onClick={a.action?a.action:a.tab?()=>setTab(a.tab):undefined} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",borderRadius:T.rSm,background:a.type==="error"?"#fef2f2":a.type==="warn"?"#fefce8":"#eff6ff",border:`1px solid ${a.type==="error"?"#fecaca":a.type==="warn"?"#fde68a":"#bfdbfe"}`,cursor:(a.action||a.tab)?"pointer":"default"}}>
            <span style={{display:"inline-block",width:8,height:8,borderRadius:"50%",flexShrink:0,background:a.type==="error"?"#dc2626":a.type==="warn"?"#f59e0b":"#3b82f6"}}/>
            <span style={{fontSize:".82rem",fontWeight:600,color:a.type==="error"?"#dc2626":a.type==="warn"?"#92400e":"#1e40af",flex:1}}>{a.msg}</span>
            {a.href&&<a href={a.href} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()} style={{fontSize:".75rem",fontWeight:700,color:CTA,textDecoration:"none",whiteSpace:"nowrap",padding:"3px 10px",borderRadius:6,background:"rgba(24,95,165,.08)"}}>{a.hrefLabel||"Öffnen"} &rarr;</a>}
            {!a.href&&a.tab&&<span style={{fontSize:".75rem",color:T.textMuted,whiteSpace:"nowrap"}}>Details &rarr;</span>}
          </div>)}
        </div>}

        {/* Tab: Start */}
        {!loading&&tab==="start"&&(()=>{
          const liveN=orders.filter(o=>o.status==="live").length;
          const trialN=orders.filter(o=>o.status==="trial").length;
          const activeOrders=orders.filter(o=>o.subscription_status==="active");
          const mrr=activeOrders.reduce((a,o)=>a+(o.subscription_plan==="yearly"?183.6/12:18),0);
          const pastDueN=orders.filter(o=>o.subscription_status==="past_due").length;
          const openTickets=tickets.filter(t=>t.status==="offen");
          const failedOrders=orders.filter(o=>o.last_error).sort((a,b)=>new Date(b.created_at)-new Date(a.created_at));
          const sysOk=[sysStatus?.supabase?.ok,sysStatus?.stripe?.ok,sysStatus?.anthropic?.ok&&!sysStatus?.anthropic?.billing,extStatus?.api_keys?.firecrawl].filter(v=>v===true).length;
          const sysTotal=sysStatus?4+(extStatus?.api_keys!==undefined?1:0):0;
          const sysBilling=sysStatus?.anthropic?.billing;
          /* Attention items — nur was Aktion braucht */
          const attentionItems=[];
          if(sysBilling)attentionItems.push({msg:"Anthropic Guthaben leer — keine Generierung möglich",action:()=>window.open("https://console.anthropic.com/settings/plans","_blank"),btn:"Credits aufladen"});
          if(sysTotal>0&&sysOk<sysTotal&&!sysBilling)attentionItems.push({msg:`${sysTotal-sysOk} Service${sysTotal-sysOk>1?"s":""} nicht erreichbar`,action:()=>setTab("system"),btn:"System prüfen"});
          if(pastDueN>0)attentionItems.push({msg:`${pastDueN} Kunde${pastDueN>1?"n":""} mit offener Zahlung`,action:()=>{setTab("sites");setFilter("alle");},btn:"Ansehen"});
          if(openTickets.length>0)attentionItems.push({msg:`${openTickets.length} offene${openTickets.length>1?" Support-Anfragen":" Support-Anfrage"}`,action:()=>setTab("support"),btn:"Beantworten"});
          const hasIssues=attentionItems.length>0||failedOrders.length>0;
          return(<div style={{display:"flex",flexDirection:"column",gap:20}}>
            <h2 style={{fontSize:"1.1rem",fontWeight:800,color:T.dark,margin:0}}>Dashboard</h2>

            {/* Attention Box — nur wenn es Probleme gibt */}
            {hasIssues?<div style={{background:"#fff",borderRadius:T.r,border:`1px solid ${T.bg3}`,padding:"16px 20px"}}>
              <div style={{fontSize:".72rem",fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",color:T.textMuted,marginBottom:12}}>Braucht Aufmerksamkeit</div>
              {attentionItems.map((a,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderTop:i?`1px solid ${T.bg3}`:"none"}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:T.red,flexShrink:0}}/>
                <span style={{fontSize:".82rem",color:T.dark,flex:1}}>{a.msg}</span>
                <button onClick={a.action} style={{padding:"6px 14px",border:`1.5px solid ${T.bg3}`,borderRadius:T.rSm,background:"#fff",color:T.textSub,cursor:"pointer",fontSize:".75rem",fontWeight:700,fontFamily:T.font,flexShrink:0}}>{a.btn}</button>
              </div>)}
              {/* Fehler mit Details */}
              {failedOrders.map((o,i)=><div key={o.id} style={{padding:"10px 0",borderTop:(attentionItems.length>0||i>0)?`1px solid ${T.bg3}`:"none"}}>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <div style={{width:8,height:8,borderRadius:"50%",background:T.amber,flexShrink:0}}/>
                  <span style={{fontSize:".82rem",fontWeight:600,color:T.dark,flex:1,cursor:"pointer"}} onClick={()=>setSel(o)}>{o.firmenname||"—"}</span>
                  <span style={{fontSize:".72rem",color:T.textMuted}}>{fmtDate(o.created_at)}</span>
                  <button onClick={()=>setSel(o)} style={{padding:"6px 14px",border:`1.5px solid ${T.bg3}`,borderRadius:T.rSm,background:"#fff",color:T.textSub,cursor:"pointer",fontSize:".75rem",fontWeight:700,fontFamily:T.font,flexShrink:0}}>Details</button>
                </div>
                <div style={{marginTop:4,marginLeft:20,fontSize:".75rem",color:T.red,fontFamily:T.mono,lineHeight:1.5,maxHeight:40,overflow:"hidden",textOverflow:"ellipsis"}}>{o.last_error}</div>
              </div>)}
            </div>
            :<div style={{background:"#fff",borderRadius:T.r,border:`1px solid ${T.bg3}`,padding:"20px",textAlign:"center"}}>
              <div style={{fontSize:".85rem",color:T.textSub}}>Alles in Ordnung — keine Aktion nötig</div>
            </div>}

            {/* KPI Row — neutral, monochrom */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
              {[
                {l:"Kunden",v:liveN,s:`${trialN} in Trial`,a:()=>setTab("sites")},
                {l:"MRR",v:`€${mrr.toFixed(0)}`,s:`${activeOrders.length} Abos`,a:()=>setTab("finanzen")},
                {l:"Support",v:openTickets.length,s:openTickets.length===0?"Keine offenen":"Offen",a:()=>setTab("support")},
                {l:"System",v:sysTotal>0?`${sysOk}/${sysTotal}`:"—",s:sysTotal>0&&sysOk===sysTotal?"Alle OK":"Prüfen",a:()=>setTab("system")},
              ].map((k,i)=><div key={i} onClick={k.a} style={{background:"#fff",borderRadius:T.r,padding:"16px 20px",border:`1px solid ${T.bg3}`,cursor:"pointer"}}>
                <div style={{fontSize:".72rem",fontWeight:600,color:T.textMuted,marginBottom:6}}>{k.l}</div>
                <div style={{fontSize:"1.5rem",fontWeight:800,color:T.dark,fontFamily:T.mono,letterSpacing:"-.03em",lineHeight:1}}>{k.v}</div>
                <div style={{fontSize:".72rem",color:T.textMuted,marginTop:4}}>{k.s}</div>
              </div>)}
            </div>

            {/* Pipeline */}
            <div style={{background:"#fff",borderRadius:T.r,border:`1px solid ${T.bg3}`,padding:"16px 20px"}}>
              <div style={{fontSize:".78rem",fontWeight:700,color:T.dark,marginBottom:12}}>Pipeline</div>
              {STATUS_FLOW.map(s=>{const n=orders.filter(o=>o.status===s).length;const pct=orders.length?Math.round((n/orders.length)*100):0;return(<div key={s} onClick={()=>{setTab("sites");setFilter(s);}} style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer",padding:"4px 0"}}>
                  <span style={{fontSize:".78rem",color:T.textSub,width:80}}>{STATUS_LABELS[s]}</span>
                  <div style={{flex:1,height:6,background:T.bg3,borderRadius:3,overflow:"hidden"}}>
                    <div style={{width:`${pct}%`,height:"100%",background:T.dark,borderRadius:3,transition:"width .4s"}}/>
                  </div>
                  <span style={{fontSize:".75rem",fontWeight:700,color:T.dark,fontFamily:T.mono,width:24,textAlign:"right"}}>{n}</span>
                </div>);})}
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
                {[{v:"alle",l:"Health: Alle"},{v:"ok",l:"✓ Erreichbar"},{v:"err",l:"✗ Nicht erreichbar"},{v:"fehler",l:"⚠ Fehler"},{v:"aufbau",l:"⏳ Aufbau"},{v:"deakt",l:"○ Deaktiviert"}].map(({v,l})=><option key={v} value={v}>{l}</option>)}
              </select>
              <select value={zahlungFilter} onChange={e=>setZahlungFilter(e.target.value)} style={ddStyle}>
                {[{v:"alle",l:"Zahlung: Alle"},{v:"active",l:"✓ Aktiv"},{v:"past_due",l:"⚠ Offen"},{v:"canceled",l:"Gekündigt"},{v:"trial",l:"Trial"},{v:"kein_abo",l:"Kein Abo"}].map(({v,l})=><option key={v} value={v}>{l}</option>)}
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
                  {[{label:"⏳ Wird aufgebaut",c:T.bg3},{label:"✓ Erreichbar",c:T.green},{label:"✗ Nicht erreichbar",c:"#dc2626"},{label:"⚠ Fehler",c:"#d97706"},{label:"○ Deaktiviert",c:"#64748b"}].map(({label,c})=>(
                    <span key={label} style={{padding:"2px 7px",borderRadius:4,background:c+"18",color:c,fontWeight:700,fontSize:".75rem",border:`1px solid ${c}33`}}>{label}</span>
                  ))}
                </div>
              </div>
              <div>
                <div style={{fontSize:".75rem",fontWeight:700,color:T.dark,marginBottom:5}}>Zahlung</div>
                <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                  {[{label:"✓ Aktiv",c:T.green},{label:"⚠ Offen",c:"#d97706"},{label:"○ Gekündigt",c:"#64748b"},{label:"Trial",c:"#8b5cf6"},{label:"Kein Abo",c:T.textMuted}].map(({label,c})=>(
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
                  const healthMap={aufbau:{label:"⏳ Wird aufgebaut",c:T.bg3},checking:{label:"...",c:T.textMuted},ok:{label:"✓ Erreichbar",c:T.green},err:{label:"✗ Nicht erreichbar",c:"#dc2626"},fehler:{label:"⚠ Fehler",c:"#d97706"},deakt:{label:"○ Deaktiviert",c:"#64748b"},unbekannt:{label:"—",c:T.textMuted}};
                  const hv=healthMap[healthState];
                  const rowBg=healthState==="err"||healthState==="fehler"?"#fef2f2":isStuckPending||isStuckGen?"#fffbeb":i%2===0?"#fff":"#fafbfc";
                  return(<tr key={o.id} style={{borderBottom:`1px solid ${T.bg3}`,background:rowBg}}>
                    <td style={{padding:"11px 14px",fontWeight:700,fontSize:".85rem",color:T.accent,cursor:"pointer",whiteSpace:"nowrap",textDecoration:"underline",textDecorationColor:T.accent+"55"}} onClick={()=>setSel(o)}>{o.firmenname||"—"}</td>
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
                        const zMap={active:{label:"✓ Aktiv",c:T.green},past_due:{label:"⚠ Offen",c:"#d97706"},canceled:{label:"○ Gekündigt",c:"#64748b"}};
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
              return(<div key={t.id} style={{background:"#fff",borderRadius:T.r,padding:"18px 22px",border:`1px solid ${t.status==="offen"?T.amberBorder:T.bg3}`,boxShadow:T.sh2}}>
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
        {/* Tab: System & Kosten */}
        {!loading&&tab==="system"&&(()=>{
          const extInd=k=>extStatus[k]?.status?.indicator;
          const isBilling=sysStatus?.anthropic?.billing;
          const rl=sysStatus?.anthropic?.rate_limits;
          const tokUsedPct=rl?Math.round((1-parseInt(rl.tokens_remaining||0)/Math.max(1,parseInt(rl.tokens_limit||1)))*100):null;
          const fcCredits=orders.reduce((a,o)=>a+(o.firecrawl_credits||0),0);
          const fcPct=Math.round(fcCredits/500*100);
          const envVars=sysStatus?.envvars||{};
          const envOk=Object.values(envVars).filter(Boolean).length;
          const envTotal=Object.keys(envVars).length;
          const errOrders=orders.filter(o=>o.last_error).sort((a,b)=>new Date(b.created_at)-new Date(a.created_at)).slice(0,5);
          const totalTokIn=orders.reduce((a,o)=>a+(o.tokens_in||0)+(o.import_tokens_in||0),0);
          const totalTokOut=orders.reduce((a,o)=>a+(o.tokens_out||0)+(o.import_tokens_out||0),0);
          /* Helpers */
          const SvcDot=({ok})=><div style={{width:8,height:8,borderRadius:"50%",background:ok===false?T.red:ok===true?T.dark:T.bg3,flexShrink:0}}/>;
          const SvcRow=({label,desc,ok,detail,href})=>(
            <div style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:`1px solid ${T.bg3}`}}>
              <SvcDot ok={ok}/>
              <div style={{flex:1,minWidth:0}}>
                <span style={{fontSize:".85rem",fontWeight:600,color:T.dark}}>{label}</span>
                <span style={{fontSize:".75rem",color:T.textMuted,marginLeft:8}}>{desc}</span>
              </div>
              {detail&&<span style={{fontSize:".78rem",fontFamily:T.mono,fontWeight:600,color:ok===false?T.red:T.textSub}}>{detail}</span>}
              {href&&<a href={href} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()} style={{fontSize:".72rem",color:T.textMuted,textDecoration:"none",flexShrink:0}}>Status &rarr;</a>}
            </div>
          );
          const Bar=({pct,warn,crit})=>{const c=pct>=crit?T.red:pct>=warn?T.amber:T.dark;return<div style={{height:6,borderRadius:3,background:T.bg3,overflow:"hidden",flex:1}}><div style={{width:`${Math.min(100,pct)}%`,height:"100%",borderRadius:3,background:c,transition:"width .4s"}}/></div>;};
          return(<div>
          {/* Header */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24}}>
            <div>
              <h2 style={{fontSize:"1.1rem",fontWeight:800,color:T.dark,margin:0}}>System</h2>
              {sysLastCheck&&<div style={{fontSize:".75rem",color:T.textMuted,marginTop:2}}>Zuletzt geprüft {sysLastCheck.toLocaleTimeString("de-AT")} · Auto-Refresh 60s</div>}
            </div>
            <button onClick={()=>{checkSystem();fetchExtStatus();}} disabled={sysLoading} style={{padding:"8px 16px",border:`1.5px solid ${T.bg3}`,borderRadius:T.rSm,background:"#fff",color:T.textSub,cursor:sysLoading?"wait":"pointer",fontSize:".78rem",fontWeight:600,fontFamily:T.font,display:"flex",alignItems:"center",gap:6}}>
              {sysLoading&&<div style={{width:12,height:12,borderRadius:"50%",border:`2px solid ${T.textMuted}`,borderTopColor:"transparent",animation:"spin 1s linear infinite"}}/>}
              Prüfen
            </button>
          </div>

          {/* Alert-Bereich: Nur sichtbar wenn es Probleme gibt */}
          {(isBilling||stuckOrders.length>0)&&<div style={{marginBottom:24,display:"flex",flexDirection:"column",gap:8}}>
            {isBilling&&<div style={{padding:"12px 16px",background:T.redLight,border:`1px solid ${T.redBorder}`,borderRadius:T.rSm,display:"flex",alignItems:"center",gap:12}}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.red} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <span style={{fontSize:".82rem",fontWeight:600,color:T.red,flex:1}}>Anthropic Guthaben leer — keine Generierung möglich</span>
              <a href="https://console.anthropic.com/settings/plans" target="_blank" rel="noreferrer" style={{padding:"6px 14px",borderRadius:T.rSm,background:T.dark,color:"#fff",fontSize:".75rem",fontWeight:700,textDecoration:"none",flexShrink:0}}>Credits aufladen</a>
            </div>}
            {stuckOrders.map(o=><div key={o.id} style={{padding:"12px 16px",background:T.amberLight,border:`1px solid ${T.amberBorder}`,borderRadius:T.rSm,display:"flex",alignItems:"center",gap:12}}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.amber} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span style={{fontSize:".82rem",color:T.amberText,flex:1}}><strong style={{color:T.dark,cursor:"pointer"}} onClick={()=>setSel(o)}>{o.firmenname||"—"}</strong> — seit {fmtDate(o.created_at)} in Generierung</span>
              <button onClick={()=>generateWebsite(o.id)} disabled={genLoading[o.id]} style={{padding:"6px 14px",border:"none",borderRadius:T.rSm,background:T.dark,color:"#fff",cursor:genLoading[o.id]?"wait":"pointer",fontSize:".75rem",fontWeight:700,fontFamily:T.font,flexShrink:0}}>{genLoading[o.id]?"...":"Generieren"}</button>
            </div>)}
          </div>}

          {/* Services */}
          <div style={{background:"#fff",borderRadius:T.r,border:`1px solid ${T.bg3}`,padding:"4px 20px",marginBottom:24}}>
            {(!sysStatus&&sysLoading)?<div style={{padding:"24px 0",textAlign:"center",color:T.textMuted,fontSize:".82rem"}}>Verbindungen werden geprüft...</div>
            :(!sysStatus&&!sysLoading)?<div style={{padding:"24px 0",textAlign:"center"}}><div style={{color:T.textMuted,fontSize:".82rem",marginBottom:8}}>System-Check fehlgeschlagen</div><button onClick={()=>{checkSystem();fetchExtStatus();}} style={{padding:"6px 14px",border:`1.5px solid ${T.bg3}`,borderRadius:T.rSm,background:"#fff",color:T.textSub,cursor:"pointer",fontSize:".78rem",fontWeight:600,fontFamily:T.font}}>Erneut prüfen</button></div>
            :<>
              <SvcRow label="Supabase" desc="Datenbank & Auth" ok={sysStatus?.supabase?.ok} detail={sysStatus?.supabase?.latency?`${sysStatus.supabase.latency}ms`:""} href="https://status.supabase.com"/>
              <SvcRow label="Stripe" desc="Zahlungen" ok={sysStatus?.stripe?.ok} detail={sysStatus?.stripe?.livemode===false?"Testmodus":"Live"} href="https://www.stripestatus.com"/>
              <SvcRow label="Anthropic" desc="KI-Generierung" ok={sysStatus?.anthropic?.ok&&!isBilling} detail={isBilling?"Guthaben leer":sysStatus?.anthropic?.tier?`Tier ${sysStatus.anthropic.tier}`:""} href="https://console.anthropic.com"/>
              <SvcRow label="Cloudflare" desc="Hosting & CDN" ok={extStatus?.cloudflare?extInd("cloudflare")==="none":null} href="https://www.cloudflarestatus.com"/>
              <SvcRow label="Firecrawl" desc="Website-Import" ok={extStatus?.api_keys?.firecrawl===true} detail={extStatus?.api_keys?.firecrawl?"Key gesetzt":"Kein Key"} href="https://www.firecrawl.dev"/>
            </>}
          </div>

          {/* API-Kontingente */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:24}}>
            {/* Anthropic */}
            <div style={{background:"#fff",borderRadius:T.r,border:`1px solid ${isBilling?T.redBorder:T.bg3}`,padding:"20px"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
                <span style={{fontSize:".85rem",fontWeight:700,color:T.dark}}>Anthropic</span>
                {sysStatus?.anthropic?.tier&&<span style={{fontSize:".72rem",fontWeight:700,color:T.textMuted,background:T.bg,padding:"2px 8px",borderRadius:4}}>Tier {sysStatus.anthropic.tier}</span>}
              </div>
              {rl&&<div style={{marginBottom:16}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                  <span style={{fontSize:".75rem",color:T.textMuted,width:80}}>Tokens/Min</span>
                  <Bar pct={tokUsedPct||0} warn={70} crit={90}/>
                  <span style={{fontSize:".75rem",fontFamily:T.mono,fontWeight:600,color:T.textSub,width:40,textAlign:"right"}}>{tokUsedPct}%</span>
                </div>
                <div style={{display:"flex",gap:16,fontSize:".72rem",color:T.textMuted}}>
                  <span>{parseInt(rl.tokens_remaining||0).toLocaleString("de-AT")} von {parseInt(rl.tokens_limit||0).toLocaleString("de-AT")} frei</span>
                  <span>{rl.requests_remaining}/{rl.requests_limit} Requests frei</span>
                </div>
              </div>}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"4px 16px",fontSize:".75rem",marginBottom:12}}>
                <span style={{color:T.textMuted}}>Tokens IN</span><span style={{fontFamily:T.mono,fontWeight:600,color:T.textSub,textAlign:"right"}}>{totalTokIn.toLocaleString("de-AT")}</span>
                <span style={{color:T.textMuted}}>Tokens OUT</span><span style={{fontFamily:T.mono,fontWeight:600,color:T.textSub,textAlign:"right"}}>{totalTokOut.toLocaleString("de-AT")}</span>
              </div>
              <a href="https://console.anthropic.com/settings/plans" target="_blank" rel="noreferrer" style={{fontSize:".75rem",color:T.textMuted,textDecoration:"none"}}>console.anthropic.com &rarr;</a>
            </div>
            {/* Firecrawl */}
            <div style={{background:"#fff",borderRadius:T.r,border:`1px solid ${T.bg3}`,padding:"20px"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
                <span style={{fontSize:".85rem",fontWeight:700,color:T.dark}}>Firecrawl</span>
                <span style={{fontSize:".72rem",fontWeight:700,color:T.textMuted,background:T.bg,padding:"2px 8px",borderRadius:4}}>Free Tier</span>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                <span style={{fontSize:".75rem",color:T.textMuted,width:80}}>Credits</span>
                <Bar pct={fcPct} warn={50} crit={80}/>
                <span style={{fontSize:".75rem",fontFamily:T.mono,fontWeight:600,color:T.textSub,width:60,textAlign:"right"}}>{fcCredits}/500</span>
              </div>
              <div style={{fontSize:".72rem",color:T.textMuted,marginBottom:12}}>{500-fcCredits} übrig · 500/Monat</div>
              <a href="https://www.firecrawl.dev/app" target="_blank" rel="noreferrer" style={{fontSize:".75rem",color:T.textMuted,textDecoration:"none"}}>firecrawl.dev &rarr;</a>
            </div>
          </div>

          {/* Konfiguration */}
          {envTotal>0&&<div style={{marginBottom:24}}>
            <details style={{margin:0}}>
              <summary style={{cursor:"pointer",fontSize:".78rem",fontWeight:600,color:T.textSub,display:"flex",alignItems:"center",gap:8,padding:"8px 0",listStyle:"none"}}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
                Konfiguration — {envOk}/{envTotal} Env Vars {envOk===envTotal?"gesetzt":""}
                {envOk<envTotal&&<span style={{color:T.red,fontWeight:700}}>{envTotal-envOk} fehlen</span>}
              </summary>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,padding:"8px 0 0 20px"}}>
                {Object.entries(envVars).map(([k,v])=><div key={k} style={{display:"flex",alignItems:"center",gap:6,padding:"6px 10px",borderRadius:T.rSm,background:v?"#fff":T.redLight,border:`1px solid ${v?T.bg3:T.redBorder}`}}>
                  <span style={{fontSize:".72rem",color:v?T.dark:T.red,fontWeight:700}}>{v?"✓":"✗"}</span>
                  <span style={{fontSize:".75rem",fontFamily:T.mono,color:T.dark}}>{k}</span>
                </div>)}
              </div>
            </details>
          </div>}

          {/* Fehler — nur wenn vorhanden */}
          {(errOrders.length>0||errorLogs.length>0)&&<div>
            <div style={{fontSize:".78rem",fontWeight:700,color:T.dark,marginBottom:8}}>Generierungsfehler</div>
            {errOrders.map(o=><div key={o.id} style={{padding:"12px 16px",border:`1px solid ${T.redBorder}`,borderRadius:T.rSm,cursor:"pointer",marginBottom:6,background:"#fff"}} onClick={()=>setSel(o)}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
                <span style={{fontSize:".82rem",fontWeight:700,color:T.dark}}>{o.firmenname||"—"}</span>
                <span style={{fontSize:".72rem",color:T.textMuted,marginLeft:"auto"}}>{fmtDate(o.created_at)}</span>
              </div>
              <div style={{fontSize:".75rem",color:T.red,fontFamily:T.mono,lineHeight:1.5,wordBreak:"break-word"}}>{o.last_error}</div>
              {o.branche_label&&<div style={{fontSize:".72rem",color:T.textMuted,marginTop:4}}>{o.branche_label} · {o.subdomain||"kein Subdomain"}</div>}
            </div>)}
            {errorLogs.length>0&&<details style={{marginTop:8}}>
              <summary style={{cursor:"pointer",fontSize:".75rem",fontWeight:600,color:T.textMuted,listStyle:"none",display:"flex",alignItems:"center",gap:6}}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
                {errorLogs.length} Log-Einträge
                <div style={{marginLeft:"auto",display:"flex",gap:6}}>
                  <button onClick={e=>{e.preventDefault();clearErrorLogs();}} style={{padding:"4px 10px",border:`1px solid ${T.redBorder}`,borderRadius:T.rSm,background:"#fff",color:T.red,cursor:"pointer",fontSize:".72rem",fontWeight:600,fontFamily:T.font}}>Löschen</button>
                </div>
              </summary>
              <div style={{display:"flex",flexDirection:"column",gap:4,maxHeight:240,overflowY:"auto",marginTop:8}}>
                {errorLogs.map((e,i)=><div key={e.id||i} style={{background:"#fff",borderRadius:T.rSm,border:`1px solid ${T.bg3}`,padding:"8px 12px",fontSize:".75rem"}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
                    <span style={{fontSize:".68rem",fontWeight:700,color:T.textMuted,textTransform:"uppercase"}}>{({"unhandledrejection":"Promise","window.onerror":"JS","generate":"Generate","start-build":"Build","import":"Import","serve":"Serve"})[e.source]||e.source||"Error"}</span>
                    <span style={{fontSize:".72rem",color:T.textMuted,marginLeft:"auto"}}>{new Date(e.created_at).toLocaleString("de-AT",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"})}</span>
                  </div>
                  <div style={{color:T.red,fontFamily:T.mono,lineHeight:1.4,wordBreak:"break-word"}}>{e.message}</div>
                </div>)}
              </div>
            </details>}
          </div>}
        </div>);
        })()}

        {/* Tab: Finanzen */}
        {!loading&&tab==="finanzen"&&(()=>{
          const now=new Date();
          const activeOrders=orders.filter(o=>o.subscription_status==="active");
          const pastDueN=orders.filter(o=>o.subscription_status==="past_due").length;
          const trialN=orders.filter(o=>o.status==="trial").length;
          const mrr=activeOrders.reduce((a,o)=>a+(o.subscription_plan==="yearly"?183.6/12:18),0);
          const totalGenCost=orders.reduce((a,o)=>a+(o.cost_eur||0),0);
          const totalImportCost=orders.reduce((a,o)=>a+(o.import_cost_eur||0),0);
          const totalApiCost=totalGenCost+totalImportCost;
          const tracked=orders.filter(o=>o.tokens_in>0).length;
          const avgCostPerSite=tracked>0?totalApiCost/tracked:0;
          const stripeFee=Math.round((mrr*0.014+activeOrders.length*0.25)*100)/100;
          const monthN=Math.max(1,now.getMonth()||1);
          const apiCostMo=totalApiCost/monthN;
          const ausgaben=Math.round((stripeFee+apiCostMo)*100)/100;
          const netto=Math.round((mrr-ausgaben)*100)/100;
          const marge=mrr>0?Math.round((netto/mrr)*100):0;
          const months6=Array.from({length:6},(_,i)=>{const d=new Date(now.getFullYear(),now.getMonth()-5+i,1);return{label:d.toLocaleDateString("de-AT",{month:"short"}),key:`${d.getFullYear()}-${d.getMonth()}`};});
          const mData=months6.map(m=>({...m,count:orders.filter(o=>{if(!o.created_at)return false;const d=new Date(o.created_at);return`${d.getFullYear()}-${d.getMonth()}`===m.key;}).length}));
          const maxC=Math.max(1,...mData.map(m=>m.count));
          const Row=({label,value,bold,sub})=><div style={{display:"flex",justifyContent:"space-between",padding:`${sub?"3px":"6px"} 0`,borderBottom:`1px solid ${T.bg3}`}}>
            <span style={{fontSize:sub?".72rem":".78rem",color:sub?T.textMuted:T.textSub,paddingLeft:sub?12:0}}>{label}</span>
            <span style={{fontSize:sub?".72rem":".78rem",fontFamily:T.mono,fontWeight:bold?800:600,color:bold?T.dark:T.textSub}}>{value}</span>
          </div>;
          return(<div>
            <h2 style={{fontSize:"1.1rem",fontWeight:800,color:T.dark,margin:"0 0 24px"}}>Finanzen</h2>

            {/* KPI Row */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:24}}>
              {[
                {l:"MRR",v:`€${mrr.toFixed(0)}`,s:`${activeOrders.length} Abos`,warn:false},
                {l:"Ausgaben/Mo",v:`€${ausgaben.toFixed(2)}`,s:"Stripe + API",warn:false},
                {l:"Netto/Mo",v:`€${netto.toFixed(2)}`,s:`${marge}% Marge`,warn:netto<0},
                {l:"∅ Kosten/Website",v:`€${avgCostPerSite.toFixed(3)}`,s:`${tracked} getrackt`,warn:avgCostPerSite>0.15},
              ].map(k=><div key={k.l} style={{background:"#fff",borderRadius:T.r,padding:"16px 20px",border:`1px solid ${k.warn?T.redBorder:T.bg3}`}}>
                <div style={{fontSize:".75rem",fontWeight:600,color:T.textMuted,marginBottom:6}}>{k.l}</div>
                <div style={{fontSize:"1.5rem",fontWeight:800,color:k.warn?T.red:T.dark,fontFamily:T.mono,letterSpacing:"-.03em",lineHeight:1}}>{k.v}</div>
                <div style={{fontSize:".72rem",color:T.textMuted,marginTop:4}}>{k.s}</div>
              </div>)}
            </div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:24}}>
              {/* Einnahmen */}
              <div style={{background:"#fff",borderRadius:T.r,border:`1px solid ${T.bg3}`,padding:"20px"}}>
                <div style={{fontSize:".85rem",fontWeight:700,color:T.dark,marginBottom:12}}>Einnahmen</div>
                <Row label="MRR (monatlich wiederkehrend)" value={`€${mrr.toFixed(2)}`} bold/>
                <Row label="Aktive Abos" value={activeOrders.length} sub/>
                <Row label="davon Jahresabos" value={activeOrders.filter(o=>o.subscription_plan==="yearly").length} sub/>
                {trialN>0&&<Row label="In Trial" value={trialN} sub/>}
                {pastDueN>0&&<Row label="Zahlung offen" value={pastDueN} sub/>}
                <div style={{marginTop:12,padding:"10px 12px",background:T.bg,borderRadius:T.rSm,fontSize:".72rem",color:T.textMuted}}>
                  ARR (hochgerechnet): €{(mrr*12).toFixed(0)} · LTV bei 12 Mo: €{(activeOrders.length>0?(mrr/activeOrders.length)*12:0).toFixed(0)}/Kunde
                </div>
              </div>

              {/* Ausgaben */}
              <div style={{background:"#fff",borderRadius:T.r,border:`1px solid ${T.bg3}`,padding:"20px"}}>
                <div style={{fontSize:".85rem",fontWeight:700,color:T.dark,marginBottom:12}}>Ausgaben</div>
                <Row label="Gesamt / Monat" value={`€${ausgaben.toFixed(2)}`} bold/>
                <Row label="Stripe (1.4% + €0.25/Txn)" value={`€${stripeFee.toFixed(2)}`} sub/>
                <Row label="Claude API (∅/Monat)" value={`€${apiCostMo.toFixed(3)}`} sub/>
                <Row label="Cloudflare / Supabase" value="€0 (Free)" sub/>
                <div style={{marginTop:12}}>
                  <div style={{fontSize:".78rem",fontWeight:700,color:T.dark,marginBottom:8}}>API-Kosten kumuliert</div>
                  <Row label="Generierung" value={`€${totalGenCost.toFixed(4)}`} sub/>
                  {totalImportCost>0&&<Row label="Import" value={`€${totalImportCost.toFixed(4)}`} sub/>}
                  <Row label="Gesamt" value={`€${totalApiCost.toFixed(4)}`}/>
                  {tracked>0&&<Row label="∅ pro Website" value={`€${avgCostPerSite.toFixed(4)}`} sub/>}
                </div>
              </div>
            </div>

            {/* Chart + Abo-Status */}
            <div style={{display:"grid",gridTemplateColumns:"1.5fr 1fr",gap:16}}>
              <div style={{background:"#fff",borderRadius:T.r,border:`1px solid ${T.bg3}`,padding:"20px"}}>
                <div style={{fontSize:".78rem",fontWeight:700,color:T.dark,marginBottom:16}}>Neue Kunden — letzte 6 Monate</div>
                <svg viewBox="0 0 340 150" style={{width:"100%",overflow:"visible"}}>
                  <line x1="0" y1="130" x2="340" y2="130" stroke={T.bg3} strokeWidth="1"/>
                  {mData.map((m,i)=>{const bW=38,gap=18,x=i*(bW+gap)+10,maxH=100,bH=m.count===0?2:Math.max(6,Math.round((m.count/maxC)*maxH)),y=130-bH;return(<g key={i}>
                    <rect x={x} y={y} width={bW} height={bH} rx={4} fill={m.count>0?T.dark:T.bg3}/>
                    {m.count>0&&<text x={x+bW/2} y={y-6} textAnchor="middle" fontSize="11" fontWeight="700" fill={T.dark} fontFamily={T.mono}>{m.count}</text>}
                    <text x={x+bW/2} y={145} textAnchor="middle" fontSize="10" fill={T.textMuted}>{m.label}</text>
                  </g>);})}
                </svg>
              </div>
              <div style={{background:"#fff",borderRadius:T.r,border:`1px solid ${T.bg3}`,padding:"20px"}}>
                <div style={{fontSize:".78rem",fontWeight:700,color:T.dark,marginBottom:12}}>Verteilung</div>
                {[
                  {label:"Aktiv",val:activeOrders.length},
                  {label:"Trial",val:trialN},
                  {label:"Zahlung offen",val:pastDueN},
                  {label:"Kein Abo",val:orders.filter(o=>!o.stripe_customer_id).length},
                ].map(({label,val})=><div key={label} style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                  <div style={{flex:1,height:6,borderRadius:3,background:T.bg3,overflow:"hidden"}}>
                    <div style={{width:`${Math.round((val/Math.max(1,orders.length))*100)}%`,height:"100%",background:T.dark,borderRadius:3}}/>
                  </div>
                  <span style={{fontSize:".75rem",color:T.textMuted,minWidth:88}}>{label}</span>
                  <span style={{fontSize:".75rem",fontWeight:700,color:T.dark,fontFamily:T.mono,minWidth:20,textAlign:"right"}}>{val}</span>
                </div>)}
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
              {fphase("Phase 0 – Entdeckung","#64748b",<>{fnode("🌐","Landingpage","siteready.at besuchen","#64748b")}{farrow}{fnode("💡","Features & Preis","7 Tage kostenlos · ab 16 Euro/Mo","#64748b")}{farrow}{fnode("🚀","Jetzt starten","CTA-Button klicken","#64748b")}</>)}
              {fphase("Phase 1 – Website-Import (optional)","#0891b2",<>{fnode("🔗","URL eingeben","Bestandswebsite","#0891b2")}{farrow}{fnode("📥","Jina scraping","Content laden","#0891b2")}{farrow}{fnode("🤖","Claude Haiku","Daten extrahieren","#0891b2")}{farrow}{fnode("✏️","Vorbefuellt","Wizard vorausgefuellt","#0891b2",true)}</>)}
              {fphase("Phase 2 – Fragebogen (5 Schritte)","#2563eb",<>{fnode("🏗️","Branche & Stil","Klassisch/Modern/Elegant/Custom","#2563eb")}{farrow}{fnode("🏢","Unternehmen","Name · Adresse · Kontakt","#2563eb")}{farrow}{fnode("⚙️","Leistungen","Auswahl + Freitext","#2563eb")}{farrow}{fnode("🎯","Extras","Social · Buchungslink","#2563eb")}{farrow}{fnode("📸","Bilder","Logo · Hero · Fotos","#2563eb")}</>)}
              {fphase("Phase 3 – Preview & Start","#16a34a",<>{fnode("👀","Preview","Website-Vorschau","#16a34a")}{farrow}{fnode("📝","Account erstellen","Name · Passwort","#16a34a")}{farrow}{fnode("🚀","Kostenlos starten","Order → start-build → pending","#16a34a")}</>)}
              {fphase("Phase 4 – Generierung & Trial","#8b5cf6",<>{fnode("⚙️","Wird erstellt","status: pending · ~30-60 Sek.","#8b5cf6")}{farrow}{fnode("🤖","Claude Sonnet","claude-sonnet-4-6","#8b5cf6")}{farrow}{fnode("🔧","Post-Processing","Nav · Footer · Meta · Schema.org","#8b5cf6")}{farrow}{fnode("🔬","Testphase","status: trial · 7 Tage","#8b5cf6")}</>)}
              {fphase("Phase 4 → Abo abgeschlossen","#16a34a",<>{fnode("💳","Plan waehlen","16 Euro/Mo oder 168 Euro/Jahr","#16a34a")}{farrow}{fnode("🔗","Stripe Subscription","Trial-Tage berechnet · Karte hinterlegt","#16a34a")}{farrow}{fnode("✅","Tag 8","erste Abbuchung · invoice.paid","#16a34a")}{farrow}{fnode("🌍","Live","status: live","#16a34a")}</>)}
              {fphase("Phase 4 → Kein Abo nach 7 Tagen","#ef4444",<>{fnode("⏰","Trial abgelaufen","trial_expires_at ueberschritten","#ef4444")}{farrow}{fnode("🗑️","Auto-Loeschung","trial-cleanup.js · taeglich","#ef4444")}{farrow}{fnode("💀","Alles geloescht","User · Storage · Order","#ef4444")}</>)}
              {fphase("Phase 5 – Website live","#059669",<>{fnode("🔗","Subdomain","/s/{subdomain}","#059669")}{farrow}{fnode("🖼️","Fotos","serve-time Injection","#059669")}{farrow}{fnode("📄","Impressum","ECG §5 · DSGVO auto","#059669")}{farrow}{fnode("🔍","noindex","bis Production Go-Live","#059669")}</>)}
              {fphase("Phase 5b – Production Go-Live (geplant)","#0f766e",<>{fnode("🏠","Domain eingeben","im Kunden-Portal","#0f766e",true)}{farrow}{fnode("☁️","Cloudflare","Custom Domain API","#0f766e",true)}{farrow}{fnode("🔧","DNS setzen","CNAME beim Registrar","#0f766e",true)}{farrow}{fnode("🔒","SSL auto","Cloudflare Zertifikat","#0f766e",true)}{farrow}{fnode("🔓","noindex → index","Subdomain freigeben","#0f766e",true)}{farrow}{fnode("📈","GSC","Google Search Console","#0f766e",true)}</>)}
              {fphase("Phase 6 – Betrieb & Support","#f59e0b",<>{fnode("🔄","Leistungen aendern","Self-Service im Portal","#f59e0b")}{farrow}{fnode("⚡","Rate-Limit","2x pro 30 Tage","#f59e0b")}{farrow}{fnode("🤖","Sektion neu","Sonnet · direkt live","#f59e0b")}{farrow}{fnode("🎫","Support","Ticket-Formular","#f59e0b")}{farrow}{fnode("📸","Fotos updaten","serve-time · kein Rebuild","#f59e0b")}</>)}
              {fphase("Phase 7 – Ende des Abos",T.bg3,<>{fnode("❌","Kuendigung","Monatsabo: jederzeit · Jahresabo: nach 12 Mo",T.bg3)}{farrow}{fnode("🚫","Offline","subscription.deleted → status: offline",T.bg3)}{farrow}{fnode("🗑️","Daten loeschen","auf Wunsch",T.bg3,true)}</>)}
              <div style={{padding:"7px 10px",background:T.amberLight,border:`1px solid ${T.amberBorder}`,borderRadius:T.rSm,fontSize:".75rem",color:T.amberText}}>Phase 1 optional (nur wenn Bestandswebsite vorhanden) · Phase 5 noindex bis Production · Phase 7 erst nach Go-Live relevant.</div>
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
                    {fphase("Aufbau","#2563eb",<>{fnode("⚖️","Impressum","ECG §5 · Rechtsform","#2563eb")}{farrow}{fnode("🔒","Datenschutz","DSGVO Art.13","#2563eb")}{farrow}{fnode("📤","Response","immer frisch aus DB","#64748b")}</>)}
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
        const selHealthMap={checking:{label:"...",c:T.textMuted},ok:{label:"✓ Erreichbar",c:T.green},error:{label:"✗ Nicht erreichbar",c:"#dc2626"}};
        const selHInfo=selHealth&&selHealthMap[selHealth];
        const selMs=healthMs[sel.id];
        const selCheckedAt=healthTime[sel.id];
        const copyVal=(key,val)=>{navigator.clipboard?.writeText(val||"");setCopied(key);setTimeout(()=>setCopied(k=>k===key?null:k),1500);};
        const CopyBtn=({k,v})=>v?<button onClick={()=>copyVal(k,v)} title="Kopieren" style={{background:"none",border:"none",cursor:"pointer",padding:"2px 4px",color:copied===k?T.green:T.textMuted,fontSize:".75rem",lineHeight:1,flexShrink:0}}>{copied===k?"✓":"⧉"}</button>:null;
        const relTime=(iso)=>{if(!iso)return"";const m=Math.floor((Date.now()-new Date(iso).getTime())/60000);const h=Math.floor(m/60);const d=Math.floor(h/24);if(m<1)return"gerade";if(m<60)return`vor ${m} Min`;if(h<24)return`vor ${h} Std`;if(d<7)return`vor ${d}d`;return new Date(iso).toLocaleDateString("de-AT",{day:"2-digit",month:"2-digit"});};
        const logLabel=(action,details)=>{const d=typeof details==="string"?JSON.parse(details||"{}"):details||{};switch(action){case"website_generated":return"Website erstmals generiert";case"website_regenerated":return"Website neu generiert";case"build_started":return`Build gestartet (${d.source||"?"})`;case"build_success":return`Build erfolgreich${d.attempt>1?" (2. Versuch)":""}`;case"build_failed":return`Build fehlgeschlagen: ${d.message||""}`;case"generate_start":return`Generierung gestartet (${d.stil||"?"})`;case"generate_done":return`Generierung fertig${d.duration_ms?` (${(d.duration_ms/1000).toFixed(1)}s)`:""}`;case"status_changed":return`Status: ${STATUS_LABELS[d.from]||d.from} → ${STATUS_LABELS[d.to]||d.to}`;case"offline":return"Offline genommen";case"online":return"Wieder online gesetzt";case"subdomain_changed":return`Subdomain: ${d.from} → ${d.to}`;case"stil_changed":return`Stil: ${d.from} → ${d.to}`;case"trial_extended":return`Trial +${d.days} Tage verlaengert`;case"ticket_created":return`Ticket erstellt: ${d.subject||""}`;case"ticket_answered":return`Ticket beantwortet: ${d.subject||""}`;case"checkout_completed":return`Checkout: ${d.plan||"monatlich"}`;case"payment_succeeded":return d.promoted_to_live?"Zahlung → Live geschaltet":"Zahlung erfolgreich";case"payment_failed":return"Zahlung fehlgeschlagen";case"subscription_canceled":return"Abo beendet";case"subscription_updated":return`Abo-Status: ${d.status||""}`;default:return action;}};
        const logIcon=(action)=>({"website_generated":"✨","website_regenerated":"↻","build_started":"▶","build_success":"✅","build_failed":"❌","generate_start":"⚙","generate_done":"✨","status_changed":"↪","offline":"⏸","online":"▶","subdomain_changed":"✏","stil_changed":"▣","trial_extended":"⏩","ticket_created":"✉","ticket_answered":"✓","checkout_completed":"✔","payment_succeeded":"✔","payment_failed":"⚠","subscription_canceled":"✖","subscription_updated":"↺"}[action]||"●");
        return(<div onClick={e=>{if(e.target===e.currentTarget)setSel(null);}} style={{position:"fixed",inset:0,zIndex:2000,background:"rgba(0,0,0,.35)",display:"flex",alignItems:"center",justifyContent:"center",padding:"2.5vh 2.5vw"}}>
        <div style={{background:"#fff",borderRadius:14,width:"95vw",maxWidth:1600,maxHeight:"95vh",display:"flex",flexDirection:"column",boxShadow:"0 24px 80px rgba(0,0,0,.2)",overflowY:"auto"}}>
          {/* Modal Header */}
          <div style={{padding:"16px 24px",borderBottom:`1px solid ${T.bg3}`,display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,background:"#fff",zIndex:1,borderRadius:"12px 12px 0 0"}}>
            <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
              <h3 style={{margin:0,fontSize:"1.1rem",fontWeight:800,color:T.dark}}>{sel.firmenname||"—"}</h3>
              <StatusBadge status={sel.status}/>
              {selHInfo&&<span style={{padding:"2px 8px",borderRadius:20,background:selHInfo.c+"18",color:selHInfo.c,fontSize:".75rem",fontWeight:700}}>{selHInfo.label}</span>}
              {(selStuckPending||selStuckGen)&&<span style={{padding:"2px 8px",borderRadius:20,background:"#fff7ed",color:T.amberText,fontSize:".75rem",fontWeight:700}}>&#9888; {selStuckPending?"Eingang >2h":"Generierung >15min"}</span>}
              {selHasFailed&&<span style={{padding:"2px 8px",borderRadius:20,background:T.redLight,color:"#991b1b",fontSize:".75rem",fontWeight:700}}>&#9888; Fehler</span>}
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              {(selStuckPending||selStuckGen||selHasFailed)&&<button onClick={()=>generateWebsite(sel.id)} disabled={genLoading[sel.id]} style={{padding:"6px 14px",border:"none",borderRadius:T.rSm,background:genLoading[sel.id]?T.bg3:selHasFailed?"#dc2626":"#f59e0b",color:"#fff",cursor:"pointer",fontSize:".78rem",fontWeight:700,fontFamily:T.font}}>{genLoading[sel.id]?"...":selHasFailed?"Retry":"Neu starten"}</button>}
              <button onClick={()=>setSel(null)} style={{background:"none",border:"none",fontSize:"1.4rem",cursor:"pointer",color:T.textMuted,padding:"4px 8px",lineHeight:1}}>&times;</button>
            </div>
          </div>
          {selHasFailed&&<div style={{margin:"0 24px",marginTop:12,padding:"10px 14px",background:T.redLight,border:`1px solid ${T.redBorder}`,borderRadius:T.rSm,fontSize:".78rem",color:"#991b1b",lineHeight:1.5,wordBreak:"break-word",display:"flex",alignItems:"flex-start",gap:12,justifyContent:"space-between"}}>
            <span style={{fontFamily:T.mono}}><strong style={{fontFamily:T.font}}>Letzter Fehler: </strong>{sel.last_error}</span>
            <button onClick={()=>updateOrder(sel.id,{last_error:null}).then(()=>setSel(s=>({...s,last_error:null})))} style={{flexShrink:0,padding:"3px 10px",border:`1px solid ${T.redBorder}`,borderRadius:T.rSm,background:"#fff",color:"#991b1b",cursor:"pointer",fontSize:".75rem",fontWeight:700,fontFamily:T.font,whiteSpace:"nowrap"}}>&#10003; Abgehakt</button>
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
                  ?<button onClick={()=>setEditKunde({firmenname:sel.firmenname||"",email:sel.email||"",telefon:sel.telefon||"",adresse:sel.adresse||"",plz:sel.plz||"",ort:sel.ort||""})} style={{background:"none",border:"none",cursor:"pointer",padding:4,color:T.textMuted,fontSize:".85rem",lineHeight:1}} title="Bearbeiten">{"✏"}</button>
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
                  {sel.branche_label&&<div style={{display:"grid",gridTemplateColumns:"110px 1fr",padding:"9px 0",borderBottom:`1px solid ${T.bg3}`,fontSize:".83rem"}}><span style={{color:T.textMuted,fontWeight:500}}>Branche</span><span style={{fontWeight:600}}>{sel.branche_label}</span></div>}
                  {(()=>{
                    const _selExp=sel.trial_expires_at||(sel.created_at?new Date(new Date(sel.created_at).getTime()+7*24*60*60*1000).toISOString():null);
                    const trialLeft=sel.status==="trial"&&_selExp?Math.ceil((new Date(_selExp)-Date.now())/(1000*60*60*24)):null;
                    const planLabel=sel.subscription_plan==="yearly"?"€168 / Jahr":sel.subscription_plan==="monthly"?"€16 / Monat":null;
                    const zMap={active:{label:"✓ Aktiv",c:T.green},past_due:{label:"⚠ Zahlung offen",c:"#d97706"},canceled:{label:"○ Gekündigt",c:"#64748b"}};
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
                  {[["E-Mail",sel.email],["Telefon",sel.telefon],["Adresse",[sel.adresse,[sel.plz,sel.ort].filter(Boolean).join(" ")].filter(Boolean).join(", ")],["UID",sel.uid_nummer],["Rechtsform",sel.unternehmensform],["Firmenbuch",sel.firmenbuchnummer],["GISA",sel.gisazahl],["Fotos",sel.fotos?"Ja":"Nein"],["Bestellt",fmtDate(sel.created_at)]].map(([l,v])=>v?<div key={l} style={{display:"grid",gridTemplateColumns:"110px 1fr",padding:"9px 0",borderBottom:`1px solid ${T.bg3}`,fontSize:".83rem"}}>
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
                    <a href={`https://sitereadyprototype.pages.dev/s/${sel.subdomain}`} target="_blank" rel="noopener noreferrer" style={{padding:"8px 16px",background:T.accent,color:"#fff",borderRadius:T.rSm,fontSize:".8rem",fontWeight:700,textDecoration:"none",fontFamily:T.font}}>Website {"↗"}</a>
                    <a href={`https://sitereadyprototype.pages.dev/s/${sel.subdomain}/vcard`} target="_blank" rel="noopener noreferrer" style={{padding:"8px 12px",border:`2px solid ${T.bg3}`,borderRadius:T.rSm,background:"#fff",color:T.textSub,fontSize:".78rem",fontWeight:600,textDecoration:"none",fontFamily:T.font}}>Vcard {"↗"}</a>
                    {sel.stripe_customer_id&&<a href={`https://dashboard.stripe.com/customers/${sel.stripe_customer_id}`} target="_blank" rel="noopener noreferrer" style={{padding:"8px 12px",border:`2px solid ${T.bg3}`,borderRadius:T.rSm,background:"#fff",color:T.textSub,fontSize:".78rem",fontWeight:600,textDecoration:"none",fontFamily:T.font}}>Stripe {"↗"}</a>}
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
                      :<button onClick={()=>generateWebsite(sel.id)} disabled={genLoading[sel.id]} style={{padding:"8px 16px",border:"none",borderRadius:T.rSm,background:genLoading[sel.id]?T.bg3:T.dark,color:"#fff",cursor:genLoading[sel.id]?"wait":"pointer",fontSize:".82rem",fontWeight:700,fontFamily:T.font}}>{genLoading[sel.id]?"Generiert (ca. 30s)...":`✨ Website generieren`}</button>}
                  </div>
                  {regenConfirm===sel.id&&<div style={{background:"#fff7ed",border:"1px solid #fed7aa",borderRadius:T.rSm,padding:"12px 14px"}}>
                    <div style={{fontSize:".78rem",fontWeight:700,color:T.amberText,marginBottom:8}}>Bestehende Website wird ueberschrieben.</div>
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
                {deleteConfirm===sel.id&&<div style={{background:T.redLight,border:`1px solid ${T.redBorder}`,borderRadius:T.rSm,padding:"12px 14px"}}>
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
                  const sc=siteConfig[sel.id]||{subdomain:sel.subdomain||"",stil:sel.stil||"klassisch",editing:false};
                  const editing=!!sc.editing;
                  const setsc=v=>setSiteConfig(c=>({...c,[sel.id]:{...sc,...v}}));
                  const dirty=sc.subdomain!==(sel.subdomain||"")||sc.stil!==(sel.stil||"klassisch");
                  const save=async()=>{
                    const oldSub=sel.subdomain||"";const oldStil=sel.stil||"klassisch";
                    await updateOrder(sel.id,{subdomain:sc.subdomain,stil:sc.stil});
                    setSel(s=>({...s,subdomain:sc.subdomain,stil:sc.stil}));setsc({editing:false});
                    if(sc.subdomain!==oldSub)logActivity(sel.id,"subdomain_changed",{from:oldSub,to:sc.subdomain});
                    if(sc.stil!==oldStil)logActivity(sel.id,"stil_changed",{from:oldStil,to:sc.stil});
                  };
                  const cancel=()=>setsc({subdomain:sel.subdomain||"",stil:sel.stil||"klassisch",editing:false});
                  return(<div style={{...secStyle,borderStyle:"dashed"}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                      <div style={{fontSize:".8rem",fontWeight:700,color:T.dark}}>Subdomain & Stil</div>
                      {!editing&&<button onClick={()=>setsc({editing:true})} title="Bearbeiten" style={{background:"none",border:"none",cursor:"pointer",padding:"2px 5px",color:T.textMuted,fontSize:".85rem",lineHeight:1}}>{"✏"}</button>}
                    </div>
                    {!editing
                      ?<div style={{display:"flex",flexDirection:"column",gap:4}}>
                          <div style={{fontSize:".8rem"}}><span style={{color:T.textMuted}}>Subdomain: </span><span style={{fontFamily:T.mono,color:T.dark}}>{sel.subdomain||"—"}</span></div>
                          <div style={{fontSize:".8rem"}}><span style={{color:T.textMuted}}>Stil: </span><span style={{color:T.dark}}>{STYLES_MAP[sel.stil||"klassisch"]?.label||sel.stil||"Professional"}</span></div>
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
                          <div style={{fontSize:".75rem",color:T.amberText}}>Danach Website neu generieren</div>
                        </div>
                    }
                  </div>);
                })()}
                {/* Notfall: Status setzen */}
                <div style={{padding:"12px 16px",background:T.bg,borderRadius:T.rSm,border:`1px solid ${T.bg3}`}}>
                  <button onClick={()=>setShowStatusOverride(s=>!s)} style={{background:"none",border:"none",cursor:"pointer",padding:0,fontFamily:T.font,display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%"}}>
                    <span style={{fontSize:".8rem",fontWeight:700,color:T.textMuted}}>Notfall: Status setzen</span>
                    <span style={{fontSize:".75rem",color:T.textMuted,transition:"transform .2s",display:"inline-block",transform:showStatusOverride?"rotate(180deg)":"rotate(0deg)"}}>{"▼"}</span>
                  </button>
                  {showStatusOverride&&<div style={{marginTop:10,display:"flex",flexWrap:"wrap",gap:6}}>
                    {[{s:"pending",label:"Eingang"},{s:"in_arbeit",label:"In Generierung"},{s:"trial",label:"Testphase"},{s:"live",label:"Live"},{s:"offline",label:"Offline"}].map(({s,label})=>(
                      <button key={s} onClick={sel.status!==s?()=>{const prev=sel.status;updateOrder(sel.id,{status:s});logActivity(sel.id,"status_changed",{from:prev,to:s});}:undefined} disabled={sel.status===s} style={{padding:"5px 10px",border:`2px solid ${sel.status===s?STATUS_COLORS[s]||T.accent:T.bg3}`,borderRadius:T.rSm,background:sel.status===s?(STATUS_COLORS[s]||T.accent)+"18":"#fff",color:sel.status===s?STATUS_COLORS[s]||T.accent:T.textSub,cursor:sel.status===s?"default":"pointer",fontSize:".75rem",fontWeight:700,fontFamily:T.font}}>{label}{sel.status===s?` ✓`:""}</button>
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
                    {notizSaved[sel.id]?"✓":"✏"}
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
                    :<div style={{display:"flex",flexDirection:"column",gap:4,maxHeight:360,overflowY:"auto"}}>
                        {(orderLogs[sel.id]||[]).map(log=>(
                          <div key={log.id} style={{display:"flex",alignItems:"flex-start",gap:8,padding:"7px 10px",background:T.bg,borderRadius:T.rSm,border:`1px solid ${T.bg3}`}}>
                            <span style={{fontSize:".8rem",flexShrink:0,minWidth:16,textAlign:"center"}}>{logIcon(log.action)}</span>
                            <div style={{flex:1,minWidth:0}}>
                              <div style={{fontSize:".77rem",color:T.dark,fontWeight:600,lineHeight:1.3}}>{logLabel(log.action,log.details)}</div>
                              {log.actor==="system"&&["payment_succeeded","payment_failed","checkout_completed","subscription_canceled","subscription_updated"].includes(log.action)&&<div style={{fontSize:".75rem",color:T.textMuted}}>via Stripe</div>}
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
                {key:"in_arbeit",label:"Schritt 2 – KI-Generierung",icon:"⚙️",detail:hasHtml?"Website wurde erfolgreich generiert.":st==="in_arbeit"?"Generierung laeuft gerade...":"Noch nicht gestartet.",meta:[hasHtml&&["Modell","claude-sonnet-4-6"],hasHtml&&["Tokens In",(sel.tokens_in||0).toLocaleString("de-AT")],hasHtml&&["Tokens Out",(sel.tokens_out||0).toLocaleString("de-AT")],hasHtml&&["Kosten Generierung",`€${(sel.cost_eur||0).toFixed(4)}`],sel.import_cost_eur&&["Kosten Import",`€${(sel.import_cost_eur||0).toFixed(4)}`],hasHtml&&["Kosten Gesamt",`€${((sel.cost_eur||0)+(sel.import_cost_eur||0)).toFixed(4)}`],hasHtml&&["HTML-Groesse",`${Math.round((sel.website_html||"").length/1024)} KB`],genDurationSec&&["Dauer",`${genDurationSec}s`]].filter(Boolean),error:sel.last_error||null},
                {key:"trial",label:"Schritt 3 – Testphase",icon:"🔬",detail:st==="trial"?`Website aktiv. Kunde hat${trialDaysLeft!==null?` noch ${trialDaysLeft} Tag${trialDaysLeft===1?"":"e"}`:""} um ein Abo abzuschliessen.`:st==="live"||st==="offline"?"Testphase abgeschlossen – Abo aktiv.":"Noch nicht erreicht.",meta:[["Trial bis",trialExpiry?trialExpiry.toLocaleDateString("de-AT",{day:"2-digit",month:"long",year:"numeric"}):"—"],["Subdomain",sel.subdomain||"—"],["Plan",sel.subscription_plan||"—"]]},
                {key:"live",label:"Schritt 4 – Abo & Live",icon:"🚀",detail:"Stripe-Abo aktiv. Erste Zahlung eingegangen. Website oeffentlich erreichbar.",meta:[["Abo-Plan",sel.subscription_plan==="yearly"?"Jährlich (€168)":sel.subscription_plan==="monthly"?"Monatlich (€16)":"—"],["Stripe Customer",sel.stripe_customer_id||"—"],["Status",st==="live"?"Online":st==="offline"?"Offline":"Ausstehend"],["Subdomain",sel.subdomain?`${sel.subdomain}.siteready.at`:"—"]]},
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
                        {current&&<span style={{background:T.amberLight,color:T.amberText,fontSize:".75rem",fontWeight:700,padding:"2px 6px",borderRadius:4}}>Aktuell</span>}
                      </div>
                      <div style={{fontSize:".78rem",color:T.textMuted,marginBottom:step.error?6:8,lineHeight:1.5}}>{step.detail}</div>
                      {step.error&&<div style={{marginBottom:8,padding:"8px 12px",background:T.redLight,border:`1px solid ${T.redBorder}`,borderRadius:T.rSm,fontSize:".75rem",color:"#991b1b",fontFamily:T.mono,lineHeight:1.5,wordBreak:"break-word"}}>{step.error}</div>}
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
                        <span style={{background:T.amberLight,color:T.amberText,fontSize:".75rem",fontWeight:700,padding:"2px 6px",borderRadius:4}}>Prototyp</span>
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


export default Admin;
