import { createLogger } from "../_lib/log.js";

export async function onRequestPost({request, env}) {
  const log = createLogger(env);
  try {
    const {url} = await request.json();
    if (!url) return Response.json({error: "URL fehlt"}, {status: 400});
    log.time("import");
    const startTime = Date.now();
    const elapsed = () => Date.now() - startTime;
    const BUDGET_MS = 80000;

    let cleanUrl = url.trim();
    if (!cleanUrl.startsWith("http")) cleanUrl = "https://" + cleanUrl;

    // URL Auto-Detect
    const urlHost = new URL(cleanUrl).hostname.toLowerCase();
    const urlPath = new URL(cleanUrl).pathname.toLowerCase();
    let importType = "website";
    if (/google\.(com|at|de|ch)/.test(urlHost) && /\/(maps|place)/.test(urlPath)) importType = "google";
    else if (/goo\.gl/.test(urlHost)) importType = "google";
    else if (/linktr\.ee|lnk\.bio|instagram\.com|facebook\.com|fb\.com/.test(urlHost)) importType = "social";

    let base = new URL(cleanUrl).origin;
    await log.info(null, "import_start", {type: importType, url: cleanUrl});

    const firecrawlKey = env.FIRECRAWL_API_KEY;
    const anthropicKey = env.ANTHROPIC_API_KEY;
    if (!anthropicKey) return Response.json({error:"API-Konfigurationsfehler."}, {status:500});

    /* ═══ HELPER ═══ */
    const emailRegex = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g;
    const phoneRegex = /(?:\+43|0043|0)\s*(?:\d[\s\-/]*){6,12}\d/g;
    const allEmails = new Set();
    const allPhones = new Set();
    const socialLinks = {facebook:"", instagram:"", linkedin:"", tiktok:""};
    let whatsappLink = "";
    let buchungsLink = "";
    const structuredData = {openingHours:"", adresse:"", plz:"", ort:"", name:"", rating:null, reviews:[]};
    const brandColors = [];

    const extractFromHtml = (html) => {
      if (!html) return;
      // Meta
      const metaFields = [
        [/property=["']og:title["'][^>]+content=["']([^"']+)["']/i, "ogTitle"],
        [/name=["']description["'][^>]+content=["']([^"']+)["']/i, "description"],
      ];
      for (const [rx, key] of metaFields) {
        const m = html.match(rx); if (m && !structuredData[key]) structuredData[key] = m[1].trim();
      }
      // mailto + tel
      for (const m of html.matchAll(/mailto:([a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,})/gi)) allEmails.add(m[1].toLowerCase());
      for (const m of html.matchAll(/href=["']tel:([^"']+)["']/gi)) { const p=m[1].replace(/\s/g,"").replace(/%20/g,""); if(p.length>=8) allPhones.add(p); }
      // JSON-LD Structured Data
      for (const m of html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
        try {
          const ld = JSON.parse(m[1]);
          let items = Array.isArray(ld) ? ld : [ld];
          const withGraph = [];
          for (const item of items) { withGraph.push(item); if (item["@graph"]) withGraph.push(...item["@graph"]); }
          for (const item of withGraph) {
            if (item.telephone) allPhones.add(String(item.telephone).replace(/\s/g,""));
            if (item.email) allEmails.add(String(item.email).toLowerCase());
            if (item.openingHoursSpecification && !structuredData.openingHours) {
              const specs = Array.isArray(item.openingHoursSpecification) ? item.openingHoursSpecification : [item.openingHoursSpecification];
              structuredData.openingHours = specs.map(s => {
                const days = Array.isArray(s.dayOfWeek) ? s.dayOfWeek : [s.dayOfWeek];
                const dn = days.map(d => String(d).replace(/https?:\/\/schema\.org\//,"").slice(0,2)).join(",");
                return `${dn} ${s.opens||""}-${s.closes|""}`;
              }).join(", ");
            }
            if (item.openingHours && !structuredData.openingHours) structuredData.openingHours = Array.isArray(item.openingHours) ? item.openingHours.join(", ") : String(item.openingHours);
            const addr = item.address || item.location?.address;
            if (addr && typeof addr === "object") {
              if (addr.streetAddress && !structuredData.adresse) structuredData.adresse = addr.streetAddress;
              if (addr.postalCode && !structuredData.plz) structuredData.plz = String(addr.postalCode);
              if (addr.addressLocality && !structuredData.ort) structuredData.ort = addr.addressLocality;
            }
            if (item.name && !structuredData.name) structuredData.name = item.name;
            if (item.aggregateRating && !structuredData.rating) structuredData.rating = {value: item.aggregateRating.ratingValue, count: item.aggregateRating.reviewCount};
            if (item.review && Array.isArray(item.review)) {
              for (const rev of item.review.slice(0, 6)) {
                if (rev.reviewBody || rev.description) structuredData.reviews.push({name: rev.author?.name || "", text: rev.reviewBody || rev.description || "", sterne: parseInt(rev.reviewRating?.ratingValue) || 0});
              }
            }
          }
        } catch(_) {}
      }
      // Plain-text
      const vis = html.replace(/<script[\s\S]*?<\/script>/gi," ").replace(/<style[\s\S]*?<\/style>/gi," ").replace(/<[^>]+>/g," ");
      for (const m of vis.matchAll(emailRegex)) allEmails.add(m[0].toLowerCase());
      for (const m of vis.matchAll(phoneRegex)) { const p=m[0].replace(/[\s\-/]/g,""); if(p.length>=8) allPhones.add(p); }
      // Social + WhatsApp + Buchung
      for (const h of [...html.matchAll(/href=["']([^"']+)["']/gi)].map(m=>m[1])) {
        if (!socialLinks.facebook  && /facebook\.com\//i.test(h)  && !/sharer|share|login/i.test(h)) socialLinks.facebook=h;
        if (!socialLinks.instagram && /instagram\.com\//i.test(h) && !/sharer|share|login/i.test(h)) socialLinks.instagram=h;
        if (!socialLinks.linkedin  && /linkedin\.com\//i.test(h)  && !/sharer|share|login/i.test(h)) socialLinks.linkedin=h;
        if (!socialLinks.tiktok    && /tiktok\.com\//i.test(h)    && !/sharer|share|login/i.test(h)) socialLinks.tiktok=h;
        if (!whatsappLink && /wa\.me\//i.test(h)) whatsappLink = h;
        if (!whatsappLink && /api\.whatsapp\.com/i.test(h)) whatsappLink = h;
        if (!buchungsLink && /calendly\.com|doctolib|terminland|timify|booksy|treatwell|shore\.com|salonmeister|appointy|10minutes|termin.*online|online.*termin/i.test(h)) buchungsLink = h;
      }
      // Farben
      const tc = html.match(/<meta[^>]+name=["']theme-color["'][^>]+content=["']([^"']+)["']/i);
      if (tc) brandColors.push({source:"theme-color", color:tc[1].trim(), priority:10});
      for (const cm of html.matchAll(/--(?:primary|brand-?color|color-primary|main-?color|accent)\s*:\s*(#[0-9a-fA-F]{3,8})/g)) {
        brandColors.push({source:"css-var", color:cm[1].trim(), priority:8});
      }
      // Erweiterte Suche: häufige Variablen-Namen für Akzentfarben
      for (const cm of html.matchAll(/--(?:blue|teal|cyan|green|red|orange|purple|violet|indigo|brand|highlight|link-color|cta)\s*:\s*(#[0-9a-fA-F]{3,8})/g)) {
        brandColors.push({source:"css-var-ext", color:cm[1].trim(), priority:5});
      }
    };

    /* ═══ FIRECRAWL: Seite scrapen ═══ */
    const scrapeFirecrawl = async (pageUrl, opts = {}) => {
      if (!firecrawlKey) return null;
      try {
        const r = await fetch("https://api.firecrawl.dev/v1/scrape", {
          method: "POST",
          headers: {"Authorization": `Bearer ${firecrawlKey}`, "Content-Type": "application/json"},
          body: JSON.stringify({
            url: pageUrl,
            formats: opts.formats || ["markdown"],
            onlyMainContent: opts.onlyMainContent !== false,
            timeout: opts.timeout || 15000,
            ...(opts.location ? {location: opts.location} : {}),
          }),
          signal: AbortSignal.timeout(20000),
        });
        if (!r.ok) { console.error("firecrawl: HTTP", r.status, pageUrl); return null; }
        const d = await r.json();
        return d.success ? d.data : null;
      } catch(e) { console.error("firecrawl: fehlgeschlagen", pageUrl, e.message); return null; }
    };

    /* ═══ CLAUDE API mit Rate-Limit Retry ═══ */
    const callClaude = async (body, timeoutMs = 30000) => {
      for (let attempt = 1; attempt <= 3; attempt++) {
        const resp = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {"Content-Type":"application/json","x-api-key":anthropicKey,"anthropic-version":"2023-06-01"},
          body: JSON.stringify(body),
          signal: AbortSignal.timeout(timeoutMs),
        });
        if (resp.ok) return await resp.json();
        if (resp.status === 429 && attempt < 3) {
          const retryAfter = parseInt(resp.headers.get("retry-after") || "30");
          const waitSec = Math.min(retryAfter, 45);
          console.error(`Claude Rate Limit — warte ${waitSec}s (Versuch ${attempt}/3)`);
          await new Promise(ok => setTimeout(ok, waitSec * 1000));
          continue;
        }
        const errText = await resp.text().catch(() => "");
        if (resp.status === 429) {
          return {_error: "rate_limit", _message: "Der Server ist gerade ausgelastet. Bitte versuchen Sie es in einer Minute erneut."};
        }
        return {_error: "api_error", _message: "Die Analyse ist fehlgeschlagen: " + errText.slice(0, 200)};
      }
      return {_error: "unknown", _message: "Unbekannter Fehler bei der Analyse."};
    };

    /* ═══ JINA FALLBACK (wenn kein Firecrawl-Key) ═══ */
    const fetchJina = async (pageUrl) => {
      try {
        const r = await fetch("https://r.jina.ai/" + pageUrl, {
          headers: {"Accept":"text/plain","X-Return-Format":"text"},
          signal: AbortSignal.timeout(15000),
        });
        if (r.ok) {
          const text = await r.text();
          if (text.length < 30 || /^(Unable to|Error:|404|Page not found)/i.test(text.trim())) return "";
          return text;
        }
      } catch(e) { console.error("jina: fehlgeschlagen", pageUrl, e.message); }
      return "";
    };

    const fetchHtml = async (pageUrl, timeout=10000) => {
      try {
        const r = await fetch(pageUrl, {
          headers: {"User-Agent":"Mozilla/5.0 (compatible; SiteReady/1.0)","Accept":"text/html","Accept-Language":"de-AT,de;q=0.9"},
          redirect:"follow", signal: AbortSignal.timeout(timeout),
        });
        if (r.ok) return await r.text();
      } catch(_) {}
      return "";
    };

    const stripHtml = (html) => {
      if (!html) return "";
      return html.replace(/<script[\s\S]*?<\/script>/gi," ").replace(/<style[\s\S]*?<\/style>/gi," ")
        .replace(/<[^>]+>/g," ").replace(/&nbsp;/g," ").replace(/&amp;/g,"&").replace(/\s{2,}/g," ").trim();
    };

    /* ═══ 1. HAUPTSEITE CRAWLEN ═══ */
    let mainMarkdown = "";
    let mainHtml = "";
    let discoveredLinks = [];
    let firecrawlCreditsUsed = 0;

    if (importType === "google") {
      // Google Maps URL: Direkt Web Search nutzen, kein Crawl
      const nameMatch = cleanUrl.match(/place\/([^/]+)/);
      const searchName = nameMatch ? decodeURIComponent(nameMatch[1]).replace(/\+/g, " ") : cleanUrl;
      structuredData.googleSearchName = searchName;
    } else if (firecrawlKey) {
      // Firecrawl: Hauptseite mit HTML + Links
      const mainData = await scrapeFirecrawl(cleanUrl, {
        formats: ["markdown", "html", "links"],
        onlyMainContent: false,
        timeout: 20000,
        location: {country: "AT", languages: ["de"]},
      });
      if (mainData) {
        mainMarkdown = mainData.markdown || "";
        mainHtml = mainData.html || mainData.rawHtml || "";
        discoveredLinks = (mainData.links || []).map(l => {
          try {
            if (!l.startsWith("http")) l = l.startsWith("/") ? base + l : base + "/" + l;
            const u = new URL(l);
            if (u.origin !== base) return null;
            const p = u.pathname.replace(/\/+$/,"") || "/";
            if (p === "/") return null;
            if (/\.(pdf|jpg|jpeg|png|gif|svg|css|js|ico|woff|woff2|xml|txt|json)$/i.test(p)) return null;
            if (/\/(wp-admin|wp-content|cdn-cgi|assets|static|_next|login|cart|checkout|tag|category|page\/\d)\b/i.test(p)) return null;
            return u.origin + p;
          } catch(_) { return null; }
        }).filter(Boolean);
        firecrawlCreditsUsed++;
        extractFromHtml(mainHtml);
      }
    } else {
      // Jina Fallback
      mainHtml = await fetchHtml(cleanUrl, 12000);
      extractFromHtml(mainHtml);
      mainMarkdown = await fetchJina(cleanUrl);
      if (!mainMarkdown || mainMarkdown.length < 100) mainMarkdown = stripHtml(mainHtml);
    }

    // Pruefen ob genug Content
    const mainText = mainMarkdown || stripHtml(mainHtml);
    if (!mainText || mainText.length < 50) {
      if (importType !== "google") {
        await log.error("import", {message:"Website nicht lesbar", url:cleanUrl, mainLen:mainText?.length||0, hasFirecrawl:!!firecrawlKey});
        return Response.json({error:"Die Website konnte nicht gelesen werden. Mögliche Gründe: Die Seite ist passwortgeschützt, blockiert automatische Zugriffe, oder die URL ist nicht erreichbar."}, {status:400});
      }
    }

    /* ═══ 2. LINK DISCOVERY + UNTERSEITEN CRAWLEN ═══ */
    const skipExt = /\.(pdf|jpg|jpeg|png|gif|svg|css|js|ico|woff|woff2|xml|txt|json)$/i;
    const skipPath = /\/(wp-admin|wp-content|cdn-cgi|assets|static|_next|login|cart|checkout|tag|category|page\/\d)\b/i;
    const allInternalLinks = new Set(discoveredLinks);

    const addLink = (href) => {
      if (!href) return;
      if (href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("javascript:") || href.startsWith("#")) return;
      if (!href.startsWith("http")) href = href.startsWith("/") ? base + href : base + "/" + href;
      try {
        const u = new URL(href);
        if (u.origin !== base) return;
        const p = u.pathname.replace(/\/+$/,"") || "/";
        if (p === "/") return;
        if (skipExt.test(p) || skipPath.test(p)) return;
        allInternalLinks.add(u.origin + p);
      } catch(_) {}
    };

    // Links aus HTML extrahieren (Fallback wenn Firecrawl keine liefert)
    if (mainHtml) {
      for (const m of mainHtml.matchAll(/href=["']([^"'#]+)["']/gi)) addLink(m[1]);
    }
    // Links aus Markdown extrahieren
    if (mainMarkdown) {
      for (const m of mainMarkdown.matchAll(/\[([^\]]{2,60})\]\((https?:\/\/[^\s)]+)\)/gi)) addLink(m[2]);
    }

    // PDF-Links aus HTML sammeln (für Downloads-Feature)
    const pdfLinksFound = new Map(); // url -> label
    const addPdfLink = (href, labelHint) => {
      if (!href) return;
      try {
        if (!href.startsWith("http")) href = href.startsWith("/") ? base + href : base + "/" + href;
        if (!href.match(/\.pdf(\?|$)/i)) return;
        if (pdfLinksFound.has(href) || pdfLinksFound.size >= 3) return;
        // Label aus Link-Text, Dateiname oder Fallback ableiten
        let label = (labelHint||"").trim().slice(0,60);
        if (!label || /^https?:\/\//i.test(label)) {
          const fname = href.split("/").pop().replace(/\.pdf(\?.*)?$/i,"").replace(/[-_]/g," ").replace(/\b\w/g,c=>c.toUpperCase());
          label = fname.slice(0,60) || "Dokument";
        }
        pdfLinksFound.set(href, label + " (PDF)");
      } catch(_) {}
    };
    if (mainHtml) {
      for (const m of mainHtml.matchAll(/href=["']([^"'#]+\.pdf[^"']*?)["'][^>]*>([^<]{0,60})/gi)) addPdfLink(m[1], m[2]);
      // Nochmal ohne Text-Kontext falls oben nichts gefunden
      if (pdfLinksFound.size === 0) {
        for (const m of mainHtml.matchAll(/href=["']([^"'#]+\.pdf[^"']*?)["']/gi)) addPdfLink(m[1], "");
      }
    }
    if (pdfLinksFound.size === 0 && mainMarkdown) {
      for (const m of mainMarkdown.matchAll(/\[([^\]]{2,60})\]\((https?:\/\/[^\s)]+\.pdf[^\s)]*)\)/gi)) addPdfLink(m[2], m[1]);
    }
    // Sitemap checken (1 Subrequest, liefert oft die besten Links)
    let sitemapFound = false;
    if (importType === "website" && elapsed() < BUDGET_MS - 40000) {
      try {
        const smRes = await fetch(base + "/sitemap.xml", {signal: AbortSignal.timeout(5000), headers:{"User-Agent":"Mozilla/5.0 (compatible; SiteReady/1.0)"}});
        if (smRes.ok) {
          const smText = await smRes.text();
          if (smText.includes("<urlset") || smText.includes("<sitemapindex")) {
            sitemapFound = true;
            for (const m of smText.matchAll(/<loc>\s*(https?:\/\/[^<]+)\s*<\/loc>/gi)) addLink(m[1]);
          }
        }
      } catch(_) {}
    }
    // Standard-Pfade als Fallback (wenige Links) oder kritische Pfade immer hinzufuegen
    if (importType === "website") {
      const criticalPaths = ["/impressum","/kontakt","/contact"];
      const hasPath = (p) => [...allInternalLinks].some(u => { try { return new URL(u).pathname.toLowerCase().includes(p.replace("/","")); } catch(_) { return false; } });
      for (const p of criticalPaths) { if (!hasPath(p)) addLink(base + p); }
      if (allInternalLinks.size < 3) {
        const standardPaths = ["/leistungen","/services","/angebot","/ueber-uns","/about","/team","/faq","/preise","/galerie","/partner","/referenzen"];
        for (const p of standardPaths) addLink(base + p);
      }
    }

    const priorityPatterns = [/kontakt|contact/i, /impressum|imprint/i, /leistung|service|angebot|schwerpunkt|behandlung/i, /ueber|about|team|praxis|ordination/i, /faq|haeufig|fragen/i, /partner|referenz|zertifik/i, /preise|pricing/i, /galerie|gallery|portfolio/i];
    const pageContents = [];

    if (importType === "website" && allInternalLinks.size > 0) {
      const allLinks = [...allInternalLinks];
      const priority = allLinks.filter(u => { try { const p = new URL(u).pathname.toLowerCase(); return priorityPatterns.some(rx => rx.test(p)); } catch(_) { return false; } });
      const rest = allLinks.filter(u => !priority.includes(u));
      const toFetch = [...new Set([...priority, ...rest])].slice(0, 8);

      const results = await Promise.all(toFetch.map(async (pageUrl) => {
        if (firecrawlKey) {
          const data = await scrapeFirecrawl(pageUrl, {formats: ["markdown"], onlyMainContent: true, timeout: 12000});
          firecrawlCreditsUsed++;
          if (data?.markdown && data.markdown.length >= 50) {
            const path = new URL(pageUrl).pathname.toLowerCase();
            return {url: pageUrl, path, text: data.markdown.slice(0, 6000)};
          }
        } else {
          const text = await fetchJina(pageUrl);
          if (text && text.length >= 50) {
            const path = new URL(pageUrl).pathname.toLowerCase();
            return {url: pageUrl, path, text: text.slice(0, 6000)};
          }
        }
        return null;
      }));

      for (const r of results.filter(Boolean)) {
        const path = r.path;
        let category = "sonstige";
        if (/kontakt|contact/.test(path)) category = "kontakt";
        else if (/impressum|imprint/.test(path)) category = "impressum";
        else if (/leistung|service|angebot|preis|schwerpunkt|behandlung|therapie/.test(path)) category = "leistungen";
        else if (/ueber|about|team|praxis|ordination|unternehmen|firma/.test(path)) category = "ueberuns";
        else if (/faq|haeufig|fragen/.test(path)) category = "faq";
        else if (/partner|referenz|zertifik/.test(path)) category = "partner";
        else if (/galerie|gallery|portfolio/.test(path)) category = "galerie";
        pageContents.push({...r, category});
      }
    }

    // Emails/Phones aus Markdown extrahieren
    for (const t of [mainText, ...pageContents.map(p => p.text)].filter(Boolean)) {
      for (const m of t.matchAll(emailRegex)) allEmails.add(m[0].toLowerCase());
      for (const m of t.matchAll(phoneRegex)) { const p=m[0].replace(/[\s\-/]/g,""); if(p.length>=8) allPhones.add(p); }
      // Obfuskierte E-Mails
      for (const m of t.matchAll(/([a-zA-Z0-9._%+\-]+)\s*[\[\(]\s*(?:at|ät|AT)\s*[\]\)]\s*([a-zA-Z0-9.\-]+\.[a-zA-Z]{2,})/g)) {
        allEmails.add((m[1] + "@" + m[2]).toLowerCase());
      }
    }

    /* ═══ 3. WEB SEARCH — Google-Daten ergaenzen ═══ */
    let webSearchData = {};
    let webSearchTokensIn = 0;
    let webSearchTokensOut = 0;

    const firmennameGuess = structuredData.name || structuredData.ogTitle || new URL(cleanUrl).hostname.replace(/^www\./,"").split(".")[0];
    const ortGuess = structuredData.ort || "";
    const searchQuery = importType === "google"
      ? (structuredData.googleSearchName || cleanUrl)
      : `${firmennameGuess}${ortGuess ? " " + ortGuess : ""}`;

    try {
      const wsData = await callClaude({
          model: "claude-sonnet-4-6",
          max_tokens: 2048,
          tools: [{
            type: "web_search_20250305",
            name: "web_search",
            max_uses: 3,
            user_location: {type: "approximate", country: "AT", timezone: "Europe/Vienna"},
          }],
          messages: [{
            role: "user",
            content: `Suche nach dem oesterreichischen Unternehmen "${searchQuery}" und finde folgende Informationen.
Antworte NUR mit einem JSON-Objekt (kein Markdown, kein Text drumherum).

{
  "firmenname": "Offizieller Name falls gefunden",
  "telefon": "+43...",
  "email": "kontakt@...",
  "adresse": "Strasse Nr",
  "plz": "1234",
  "ort": "Ortsname",
  "oeffnungszeiten": "Mo-Fr 08:00-17:00",
  "bewertungen_anzahl": 0,
  "bewertungen_schnitt": 0,
  "bewertungen": [{"name":"...","text":"...","sterne":5}],
  "website_url": "https://...",
  "branche_hinweis": "z.B. Elektriker, Friseur"
}

Nur Daten die du tatsaechlich findest. Leere Strings fuer nicht gefundene Felder.
Bewertungen: nur echte Google-Bewertungen mit Text, max 6.`,
          }],
        }, 40000);
      if (wsData._error) {
        console.error("web_search:", wsData._message);
      } else {
        webSearchTokensIn = wsData.usage?.input_tokens || 0;
        webSearchTokensOut = wsData.usage?.output_tokens || 0;
        const textBlocks = (wsData.content || []).filter(b => b.type === "text").map(b => b.text).join("\n");
        try {
          const jsonMatch = textBlocks.match(/\{[\s\S]*\}/);
          if (jsonMatch) webSearchData = JSON.parse(jsonMatch[0]);
        } catch(_) {}
      }
    } catch(e) { console.error("web_search fehlgeschlagen:", e.message); }

    // Google Maps Import: Wenn Website-URL gefunden, crawle die auch noch
    if (importType === "google" && webSearchData.website_url) {
      cleanUrl = webSearchData.website_url;
      base = new URL(cleanUrl).origin;
      if (firecrawlKey) {
        const mainData = await scrapeFirecrawl(cleanUrl, {formats: ["markdown", "html", "links"], onlyMainContent: false, timeout: 18000});
        if (mainData) {
          mainMarkdown = mainData.markdown || "";
          mainHtml = mainData.html || "";
          discoveredLinks = (mainData.links || []).filter(l => { try { return new URL(l).origin === base && new URL(l).pathname !== "/"; } catch(_) { return false; } });
          firecrawlCreditsUsed++;
          extractFromHtml(mainHtml);
        }
      }
    }

    /* ═══ 4. EMAILS + PHONES FILTERN ═══ */
    const filteredEmails = [...allEmails].filter(e =>
      !/noreply|no-reply|support@stripe|mailer|bounce|postmaster|webmaster|siteready|wix\.com|squarespace|wordpress|@sentry/i.test(e)
    );
    const normalizePhone = (p) => {
      let n = p.replace(/[\s\-/()\+]/g,"");
      if (n.startsWith("0043")) n = n.slice(2);
      else if (n.startsWith("0")) n = "43" + n.slice(1);
      return n;
    };
    const phoneMap = new Map();
    for (const p of allPhones) { const norm = normalizePhone(p); if (norm.length >= 8 && norm.length <= 16) { if (!phoneMap.has(norm) || p.startsWith("+")) phoneMap.set(norm, p); } }
    const filteredPhones = [...phoneMap.values()].filter(p => { const c=p.replace(/[\s\-/]/g,""); return c.length>=8 && c.length<=16; });

    let whatsappNumber = "";
    if (whatsappLink) { const m = whatsappLink.match(/wa\.me\/(\d+)|phone=(\d+)/); if (m) whatsappNumber = "+" + (m[1] || m[2]); }

    /* ═══ 5. GESAMTTEXT AUFBAUEN ═══ */
    const grouped = {};
    for (const p of pageContents) { if (!grouped[p.category]) grouped[p.category] = ""; grouped[p.category] += "\n--- " + p.path + " ---\n" + p.text; }

    let fullText = "";
    if (mainText) fullText += "=== HAUPTSEITE ===\n" + mainText.slice(0, 10000);
    const sectionOrder = ["leistungen","ueberuns","kontakt","impressum","faq","partner","galerie","sonstige"];
    const sectionLabels = {leistungen:"LEISTUNGEN/ANGEBOT",ueberuns:"ÜBER UNS/TEAM",kontakt:"KONTAKT",impressum:"IMPRESSUM",faq:"FAQ",partner:"PARTNER/REFERENZEN",galerie:"GALERIE",sonstige:"WEITERE SEITEN"};
    for (const key of sectionOrder) {
      if (grouped[key]) {
        const maxLen = (key === "leistungen" || key === "ueberuns") ? 6000 : key === "sonstige" ? 3000 : 4000;
        fullText += `\n\n=== ${sectionLabels[key]} ===\n` + grouped[key].slice(0, maxLen);
      }
    }
    fullText = fullText.slice(0, 40000);

    // Web Search Daten als Hinweis anhaengen
    let webSearchHint = "";
    if (webSearchData.oeffnungszeiten) webSearchHint += `\nGoogle Öffnungszeiten: ${webSearchData.oeffnungszeiten}`;
    if (webSearchData.bewertungen?.length) webSearchHint += `\nGoogle Bewertungen: ${JSON.stringify(webSearchData.bewertungen.slice(0,6))}`;
    if (webSearchData.branche_hinweis) webSearchHint += `\nGoogle Branche: ${webSearchData.branche_hinweis}`;

    // Structured Data + Email/Phone Hints
    let structuredHint = "";
    if (structuredData.openingHours) structuredHint += `\nSchema.org Öffnungszeiten: ${structuredData.openingHours}`;
    if (structuredData.adresse) structuredHint += `\nSchema.org Adresse: ${structuredData.adresse}, ${structuredData.plz} ${structuredData.ort}`;
    if (structuredData.reviews.length) structuredHint += `\nSchema.org Bewertungen (${structuredData.reviews.length}): ${JSON.stringify(structuredData.reviews.slice(0,6))}`;

    const emailHint = filteredEmails.length > 0 ? `\nGefundene E-Mails: ${filteredEmails.join(", ")}` : "";
    const phoneHint = filteredPhones.length > 0 ? `\nGefundene Telefonnummern: ${filteredPhones.join(", ")}` : "";

    /* ═══ 6. CLAUDE EXTRAKTION ═══ */
    const claudeData = await callClaude({
        model: "claude-sonnet-4-6",
        max_tokens: 8192,
        messages: [{
          role: "user",
          content: `Extrahiere aus folgendem Website-Text ALLE Daten eines oesterreichischen Unternehmens.
Du bekommst den Inhalt von ${pageContents.length + 1} Seiten${webSearchData.bewertungen?.length ? " + Google-Bewertungen" : ""}.

WICHTIG: Lies den GESAMTEN Text SEHR GRUENDLICH durch. Informationen koennen auf verschiedenen Seiten verstreut sein.
Antworte NUR mit einem JSON-Objekt (kein Markdown, kein Text drumherum).

OBERSTE REGEL: Nur Informationen die TATSAECHLICH im Text stehen. NICHTS erfinden.
Leere Strings "" und leere Arrays [] fuer nicht gefundene Felder.

JSON-Felder:

=== FIRMA & KONTAKT ===
- firmenname: Offizieller Name (max 60 Zeichen). Priorisiere: Impressum > Seitentitel > Logo-Text. Ohne Rechtsform-Zusatz wenn moeglich.
- vorname: Vorname des Inhabers/Geschaeftsfuehrers (aus Impressum)
- nachname: Nachname des Inhabers/Geschaeftsfuehrers (aus Impressum)
- telefon: Hauptnummer des Betriebs (Format +43..., Festnetz bevorzugt, sonst Mobil)
- email: Offizielle Kontakt-E-Mail des Unternehmens (NICHT persoenliche Team-E-Mails). Priorisiere: Impressum > Kontaktseite > office@/info@. NIEMALS no-reply@ oder Drittanbieter. Nur E-Mails die TATSAECHLICH auf der Website stehen.
- plz: 4-stellige oesterreichische Postleitzahl (aus Impressum bevorzugt)
- ort: Ortsname (aus Impressum bevorzugt)
- adresse: Strasse mit Hausnummer (aus Impressum bevorzugt, z.B. "Lavaterstraße 1/RH3")
- kurzbeschreibung: Was das Unternehmen macht, 1-2 Saetze, max 200 Zeichen
- bundesland: NUR: wien/noe/ooe/stmk/sbg/tirol/ktn/vbg/bgld
- whatsapp: WhatsApp-Nummer falls erwaehnt (Format: +43...)
- buchungslink: URL zum Online-Terminbuchungssystem falls vorhanden

=== RECHTLICHES (aus Impressum — ALLES was du findest) ===
- unternehmensform: NUR: eu/einzelunternehmen/gmbh/og/kg/ag/verein/gesnbr
- uid: ATU...
- firmenbuchnummer: FN...
- firmenbuchgericht: z.B. HG Wien, LG Linz
- gisazahl: Nur Ziffern
- geschaeftsfuehrer: Name(n) der Geschäftsführer
- gesellschafter: Name(n) der Gesellschafter falls angegeben
- unternehmensgegenstand: Gewerbebezeichnung falls im Impressum
- kammer_berufsrecht: Kammerzugehörigkeit (z.B. WKO, Ärztekammer)
- aufsichtsbehoerde: Aufsichtsbehörde falls angegeben

=== BRANCHE & LEISTUNGEN ===
- branche: NUR einer dieser Werte:
  Handwerk: elektro/installateur/maler/tischler/fliesenleger/schlosser/dachdecker/zimmerei/maurer/bodenleger/glaser/gaertner/klima/reinigung/baumeister/kfz/aufsperrdienst/hafner/raumausstatter/goldschmied/schneider/rauchfangkehrer/schaedlingsbekaempfung/fahrradwerkstatt/erdbau
  Kosmetik: friseur/kosmetik/nagel/massage/tattoo/fusspflege/permanent_makeup/hundesalon
  Gastro: restaurant/cafe/baeckerei/catering/bar/heuriger/imbiss/fleischerei/winzer
  Gesundheit: arzt/zahnarzt/physiotherapie/psychotherapie/tierarzt/apotheke/optiker/heilpraktiker/ergotherapie/logopaedie/energetiker/hebamme/diaetologe/hoerakustiker/zahntechnik/heilmasseur/osteopath/lebensberater
  Dienstleistung: steuerberater/rechtsanwalt/fotograf/versicherung/immobilien/hausverwaltung/umzug/eventplanung/florist/architekt/it_service/werbeagentur/bestattung/notar/finanzberater/reisebuero/innenarchitekt/textilreinigung/unternehmensberater/dolmetscher/druckerei/sicherheitsdienst
  Bildung: fahrschule/nachhilfe/musikschule/trainer/yoga/hundeschule/tanzschule/reitschule/schwimmschule/coach
  Sonstige: sonstige
- leistungen: Array mit konkreten Leistungen/Angeboten die ein KUNDE BUCHEN kann (max 8). NUR echte Services, NICHT interne Arbeitsschritte (z.B. "Redaktion" oder "Grafik" sind keine buchbaren Leistungen). Qualität vor Quantität.
- spezialisierung: Fachgebiet

=== OEFFNUNGSZEITEN & HINWEISE ===
- oeffnungszeiten: Format: "Mo-Fr 08:00-17:00, Sa 09:00-12:00"
- gut_zu_wissen: Permanente Kundenhinweise, getrennt durch \\n. Max 5.

=== BEWERTUNGEN (nur echte!) ===
- bewertungen: [{"name":"...","text":"...","sterne":5}] Max 6.

=== FAQ (nur echte!) ===
- faq: [{"frage":"...","antwort":"..."}] Max 8.

=== ZAHLEN & FAKTEN ===
- fakten: [{"zahl":"15+","label":"Jahre Erfahrung"}] Max 4.

=== PARTNER & ZERTIFIKATE ===
- partner: [{"name":"WKO"}] Max 8.

=== TEAM ===
- team: [{"name":"...","rolle":"...","email":"...","beschreibung":"..."}] Max 8. Email nur wenn eine persönliche E-Mail auf der Website steht. beschreibung: 1-2 Sätze über die Person, NUR wenn auf der Website ein Bio-Text steht. NICHT erfinden.

=== ABLAUF ===
- ablauf_schritte: [{"titel":"...","text":"..."}] Max 5. NUR wenn auf Website beschrieben.

=== LEISTUNGS-BESCHREIBUNGEN ===
- leistungen_beschreibungen: {"Leistungsname":"Kurzbeschreibung"} NUR wenn echte Texte vorhanden.

=== MERKMALE ===
- merkmale: Objekt. NUR auf true wenn KLAR im Text erwaehnt.
  Keys: kassenvertrag ("alle_kassen"/"wahlarzt"/"privat"/"oegk"/"bvaeb"/"svs"), barrierefrei, parkplaetze, notdienst, meisterbetrieb, terminvereinbarung, erstgespraech_gratis, online_beratung, hausbesuche, kartenzahlung, ratenzahlung, gutscheine, zertifiziert, kostenvoranschlag, foerderungsberatung, gastgarten, takeaway, lieferservice

Website-Text:
${fullText}${structuredHint}${webSearchHint}${emailHint}${phoneHint}`,
        }],
      }, 45000);

    if (claudeData._error) {
      await log.error("import", {message: claudeData._message, url: cleanUrl});
      return Response.json({error: claudeData._message}, {status: claudeData._error === "rate_limit" ? 429 : 500});
    }

    const rawContent = claudeData.content?.[0]?.text || "{}";
    const usage = claudeData.usage || {};
    const extractTokIn = usage.input_tokens || 0;
    const extractTokOut = usage.output_tokens || 0;

    // Gesamt-Kosten
    const totalTokIn = extractTokIn + webSearchTokensIn;
    const totalTokOut = extractTokOut + webSearchTokensOut;
    const importCostEur = Math.round(((totalTokIn * 3 + totalTokOut * 15) / 1000000) * 0.92 * 10000) / 10000;
    const webSearchCost = (usage.server_tool_use?.web_search_requests || 0) * 0.01;

    let extracted;
    try {
      const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
      extracted = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
    } catch(_) {
      try { const cb = rawContent.match(/```(?:json)?\s*([\s\S]*?)\s*```/); if (cb) extracted = JSON.parse(cb[1]); else extracted = {}; } catch(_) { extracted = {}; }
    }

    /* ═══ 7. NORMALISIEREN & VALIDIEREN ═══ */
    const ufRaw = (extracted.unternehmensform||"").toLowerCase().replace(/[\s.]/g,"");
    const ufMap = {"eu":"eu","einzelunternehmen":"einzelunternehmen","gmbh":"gmbh","og":"og","kg":"kg","ag":"ag","verein":"verein","gesnbr":"gesnbr","gesbr":"gesnbr"};
    const unternehmensform = ufMap[ufRaw] || (ufRaw.includes("gmbh")?"gmbh":ufRaw.includes("eu")?"eu":"");

    const siteDomain = new URL(cleanUrl).hostname.replace(/^www\./,"");
    const domainMatch = filteredEmails.find(e => e.split("@")[1] === siteDomain);
    const claudeEmail = (extracted.email||"").toLowerCase().trim();
    const wsEmail = (webSearchData.email||"").toLowerCase().trim();
    const claudeEmailValid = claudeEmail && emailRegex.test(claudeEmail);
    const finalEmail = domainMatch || (claudeEmailValid ? claudeEmail : "") || wsEmail || filteredEmails[0] || "";

    const wsPhone = (webSearchData.telefon||"").replace(/[\s\-/]/g,"");
    // Telefon nur verwenden wenn aus vertrauenswürdiger Quelle:
    // 1. Direkt auf der Website gefunden (Regex)
    // 2. Von Claude aus dem Website-Text extrahiert (wenn Regex auch was fand)
    // 3. Web Search (Google Maps) als letzte Option
    // NICHT: Claude-Extraktion wenn auf der Website gar keine Nummer stand (dann erfindet Claude manchmal)
    const hasPhoneOnSite = filteredPhones.length > 0;
    const finalPhone = hasPhoneOnSite
      ? filteredPhones[0]
      : (wsPhone || "");

    const plzRaw = (extracted.plz || webSearchData.plz || structuredData.plz || "").replace(/\D/g,"");
    const plz = plzRaw.length === 4 ? plzRaw : "";
    const ort = extracted.ort || webSearchData.ort || structuredData.ort || "";
    const adresse = extracted.adresse || webSearchData.adresse || structuredData.adresse || "";

    const validBL = ["wien","noe","ooe","stmk","sbg","tirol","ktn","vbg","bgld"];
    const plzToBundesland = (p) => {
      if (!p || p.length !== 4) return "";
      const n = parseInt(p);
      if (n >= 1000 && n <= 1239) return "wien";
      if (n >= 1300 && n <= 1400) return "noe";
      if ((n >= 2000 && n <= 2999) || (n >= 3000 && n <= 3999)) return "noe";
      if (n >= 4000 && n <= 4999) return "ooe";
      if (n >= 5000 && n <= 5999) return "sbg";
      if (n >= 6000 && n <= 6599) return "tirol";
      if (n >= 6600 && n <= 6999) return "vbg";
      if (n >= 7000 && n <= 7999) return "bgld";
      if (n >= 8000 && n <= 8999) return "stmk";
      if (n >= 9000 && n <= 9999) return "ktn";
      return "";
    };
    const bundesland = plzToBundesland(plz) || (validBL.includes(extracted.bundesland) ? extracted.bundesland : "");

    const validBranchen = [
      "elektro","installateur","maler","tischler","fliesenleger","schlosser","dachdecker","zimmerei","maurer","bodenleger","glaser","gaertner","klima","reinigung","baumeister","kfz","aufsperrdienst","hafner","raumausstatter","goldschmied","schneider","rauchfangkehrer","schaedlingsbekaempfung","fahrradwerkstatt","erdbau",
      "friseur","kosmetik","nagel","massage","tattoo","fusspflege","permanent_makeup","hundesalon",
      "restaurant","cafe","baeckerei","catering","bar","heuriger","imbiss","fleischerei","winzer",
      "arzt","zahnarzt","physiotherapie","psychotherapie","tierarzt","apotheke","optiker","heilpraktiker","ergotherapie","logopaedie","energetiker","hebamme","diaetologe","hoerakustiker","zahntechnik","heilmasseur","osteopath","lebensberater",
      "steuerberater","rechtsanwalt","fotograf","versicherung","immobilien","hausverwaltung","umzug","eventplanung","florist","architekt","it_service","werbeagentur","bestattung","notar","finanzberater","reisebuero","innenarchitekt","textilreinigung","unternehmensberater","dolmetscher","druckerei","sicherheitsdienst",
      "fahrschule","nachhilfe","musikschule","trainer","yoga","hundeschule","tanzschule","reitschule","schwimmschule","coach",
      "sonstige",
    ];
    const brancheRaw = (extracted.branche || "").toLowerCase().replace(/[\s\-]/g,"_");
    const branche = validBranchen.includes(brancheRaw) ? brancheRaw : (validBranchen.find(b => brancheRaw.includes(b)) || "sonstige");

    const leistungen = Array.isArray(extracted.leistungen) ? [...new Set(extracted.leistungen.map(l=>l?.trim()).filter(Boolean))].slice(0,12) : [];

    // Bewertungen: Website > Web Search > Structured Data
    let bewertungen = Array.isArray(extracted.bewertungen)
      ? extracted.bewertungen.filter(b=>b&&typeof b.text==="string"&&b.text.trim()).map(b=>({name:(b.name||"").slice(0,60),text:b.text.trim().slice(0,500),sterne:Math.min(Math.max(parseInt(b.sterne)||0,0),5)}))
      : [];
    if (bewertungen.length === 0 && webSearchData.bewertungen?.length) {
      bewertungen = webSearchData.bewertungen.filter(b=>b?.text?.trim()).map(b=>({name:(b.name||"").slice(0,60),text:b.text.trim().slice(0,500),sterne:Math.min(Math.max(parseInt(b.sterne)||0,0),5)}));
    }
    if (bewertungen.length === 0 && structuredData.reviews.length > 0) {
      bewertungen = structuredData.reviews.filter(r=>r.text?.trim()).map(r=>({name:(r.name||"").slice(0,60),text:r.text.trim().slice(0,500),sterne:Math.min(Math.max(parseInt(r.sterne)||0,0),5)}));
    }
    bewertungen = bewertungen.slice(0,6);

    const faq = Array.isArray(extracted.faq) ? extracted.faq.filter(f=>f&&f.frage?.trim()&&f.antwort?.trim()).map(f=>({frage:f.frage.trim().slice(0,200),antwort:f.antwort.trim().slice(0,500)})).slice(0,8) : [];
    const fakten = Array.isArray(extracted.fakten) ? extracted.fakten.filter(f=>f&&f.zahl?.trim()&&f.label?.trim()).map(f=>({zahl:f.zahl.trim().slice(0,20),label:f.label.trim().slice(0,60)})).slice(0,4) : [];
    const partner = Array.isArray(extracted.partner) ? extracted.partner.filter(p=>p&&p.name?.trim()).map(p=>({name:p.name.trim().slice(0,60)})).slice(0,8) : [];
    const team = Array.isArray(extracted.team) ? extracted.team.filter(t=>t&&t.name?.trim()).map(t=>({name:t.name.trim().slice(0,60),rolle:(t.rolle||"").trim().slice(0,60)})).slice(0,8) : [];
    const ablaufSchritte = Array.isArray(extracted.ablauf_schritte) ? extracted.ablauf_schritte.filter(s=>s&&s.titel?.trim()).map(s=>({titel:s.titel.trim().slice(0,60),text:(s.text||"").trim().slice(0,150)})).slice(0,5) : [];
    const leistBeschreibungen = (typeof extracted.leistungen_beschreibungen === "object" && extracted.leistungen_beschreibungen && !Array.isArray(extracted.leistungen_beschreibungen))
      ? Object.fromEntries(Object.entries(extracted.leistungen_beschreibungen).map(([k,v])=>[k.slice(0,60),String(v||"").slice(0,200)]).filter(([k,v])=>k&&v)) : {};

    const merkmale = extracted.merkmale || {};

    // Oeffnungszeiten: Web Search > Claude > Structured Data
    const oeffnungszeiten = webSearchData.oeffnungszeiten || extracted.oeffnungszeiten || structuredData.openingHours || "";
    const finalWhatsapp = whatsappNumber || (extracted.whatsapp || "").replace(/[\s\-/]/g,"") || "";
    const finalBuchungslink = buchungsLink || extracted.buchungslink || "";

    const sectionsVisible = {};
    if (faq.length > 0) sectionsVisible.faq = true;
    if (fakten.length > 0) sectionsVisible.fakten = true;
    if (partner.length > 0) sectionsVisible.partner = true;
    if (bewertungen.length > 0) sectionsVisible.bewertungen = true;
    if (team.length > 0) sectionsVisible.team = true;
    if (ablaufSchritte.length >= 2) sectionsVisible.ablauf = true;

    const { berechneVarianten } = await import("../_lib/varianten.js");
    const variantenCache = berechneVarianten({
      hero_image: null, url_hero: null, stil: "klassisch", branche,
      leistungen: leistungen.map(() => ({foto: false})),
      ablauf: ablaufSchritte, bewertungen, team, faq, galerie: [], adresse, plz,
    });

    // Brand-Farbe
    const normalizeHex = (c) => { if (!c) return ""; c = c.trim().toLowerCase(); if (/^#[0-9a-f]{3}$/.test(c)) c = "#"+c[1]+c[1]+c[2]+c[2]+c[3]+c[3]; return /^#[0-9a-f]{6}$/.test(c) ? c : ""; };
    let brandColor = "";
    if (brandColors.length > 0) {
      const sorted = brandColors.map(b => ({...b, color: normalizeHex(b.color)})).filter(b => b.color).sort((a,b) => b.priority - a.priority);
      if (sorted.length > 0) brandColor = sorted[0].color;
    }

    await log.timeEnd("import", null, "import_success");

    return Response.json({
      firmenname: (extracted.firmenname || webSearchData.firmenname || structuredData.name || "").slice(0,60),
      telefon: finalPhone, email: finalEmail,
      plz, ort, adresse,
      kurzbeschreibung: (extracted.kurzbeschreibung||"").slice(0,200),
      bundesland, unternehmensform,
      uid: extracted.uid || "", firmenbuchnummer: extracted.firmenbuchnummer || "",
      firmenbuchgericht: extracted.firmenbuchgericht || "", gisazahl: extracted.gisazahl || "",
      geschaeftsfuehrer: extracted.geschaeftsfuehrer || "",
      gesellschafter: extracted.gesellschafter || "",
      unternehmensgegenstand: extracted.unternehmensgegenstand || "",
      kammer_berufsrecht: extracted.kammer_berufsrecht || "",
      aufsichtsbehoerde: extracted.aufsichtsbehoerde || "",
      branche, leistungen, spezialisierung: extracted.spezialisierung || "",
      oeffnungszeiten_import: oeffnungszeiten,
      gut_zu_wissen: extracted.gut_zu_wissen || "",
      bewertungen, faq, fakten, partner, team, ablauf_schritte: ablaufSchritte,
      leistungen_beschreibungen: Object.keys(leistBeschreibungen).length > 0 ? leistBeschreibungen : undefined,
      whatsapp: finalWhatsapp, buchungslink: finalBuchungslink,
      varianten_cache: variantenCache, sections_visible: sectionsVisible,
      facebook: socialLinks.facebook || "", instagram: socialLinks.instagram || "",
      linkedin: socialLinks.linkedin || "", tiktok: socialLinks.tiktok || "",
      merkmale, brand_color: brandColor,
      downloads: pdfLinksFound.size > 0 ? [...pdfLinksFound.entries()].map(([url,label]) => ({url, label})) : undefined,
      _meta: {
        pages_read: pageContents.length + 1,
        links_found: allInternalLinks.size,
        sitemap: sitemapFound,
        firecrawl_credits: firecrawlCreditsUsed,
        web_search_requests: usage.server_tool_use?.web_search_requests || 0,
        import_tokens_in: totalTokIn, import_tokens_out: totalTokOut,
        import_cost_eur: importCostEur, web_search_cost_eur: webSearchCost,
        import_type: importType === "google" ? (webSearchData.website_url ? "google+website" : "google") : importType,
      },
    });

  } catch(e) {
    await log.error("import", {message:e.message, stack:e.stack?.slice(0, 500)});
    return Response.json({error:`Der Import ist fehlgeschlagen (${e.message?.slice(0, 80) || "unbekannter Fehler"}). Bitte versuchen Sie es erneut oder geben Sie die Daten manuell ein.`}, {status:500});
  }
}
