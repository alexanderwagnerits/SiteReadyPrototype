import { createLogger } from "../_lib/log.js";

export async function onRequestPost({request, env}) {
  const log = createLogger(env);
  try {
    const {url} = await request.json();
    if (!url) return Response.json({error: "URL fehlt"}, {status: 400});
    log.time("import");
    const startTime = Date.now();
    const elapsed = () => Date.now() - startTime;
    const BUDGET_MS = 80000; // 80s Budget (Frontend hat 120s Timeout)

    let cleanUrl = url.trim();
    if (!cleanUrl.startsWith("http")) cleanUrl = "https://" + cleanUrl;

    // ── URL Auto-Detect: Typ erkennen ──
    const urlHost = new URL(cleanUrl).hostname.toLowerCase();
    const urlPath = new URL(cleanUrl).pathname.toLowerCase();
    let importType = "website"; // default
    if (/linktr\.ee|lnk\.bio|koji\.to|campsite\.bio|linkin\.bio/.test(urlHost)) importType = "linktree";
    else if (/instagram\.com/.test(urlHost)) importType = "instagram";
    else if (/google\.(com|at|de|ch)/.test(urlHost) && /\/(maps|place)/.test(urlPath)) importType = "google";
    else if (/goo\.gl/.test(urlHost)) importType = "google";
    else if (/facebook\.com|fb\.com/.test(urlHost)) importType = "facebook";



    let base = new URL(cleanUrl).origin;
    await log.info(null, "import_type", {type: importType, url: cleanUrl});

    // ── Google Maps: Jina-Fallback (TODO LIVE: Google Places API statt Jina verwenden) ──
    let googleMapText = "";
    let googleWebsiteUrl = "";
    if (importType === "google") {
      const gText = await fetchJina(cleanUrl);
      if (gText && gText.length > 50) {
        googleMapText = gText;
        // Website-URL aus Google Maps Profil extrahieren
        const urlMatch = gText.match(/(?:Website|Webseite|Homepage)[:\s]*\n?\s*(https?:\/\/[^\s\n]+)/i)
          || gText.match(/(?:Besuchen Sie|Visit)[:\s]*\n?\s*(https?:\/\/[^\s\n]+)/i)
          || gText.match(/(https?:\/\/(?:www\.)?(?!google\.|goo\.gl|maps\.)[a-z0-9][a-z0-9\-]*\.[a-z]{2,}[^\s\n]*)/i);
        if (urlMatch) {
          googleWebsiteUrl = urlMatch[1].replace(/[.,;)}\]]+$/, "");
          await log.info(null, "google_website_found", {url: googleWebsiteUrl});
        }
      } else {
        return Response.json({error: "Das Google-Profil konnte nicht gelesen werden. Bitte geben Sie stattdessen die Website-URL Ihres Unternehmens ein."}, {status: 400});
      }
      // Wenn Website gefunden: auf normalen Website-Crawl umschalten
      if (googleWebsiteUrl) {
        cleanUrl = googleWebsiteUrl;
        base = new URL(cleanUrl).origin;
        importType = "website"; // Normaler Crawl-Pfad (Sitemap, Multi-Page etc.)
      }
    }
    // Ursprüngliche Quelle merken (für Logging/Meta)
    const importSource = googleMapText ? (googleWebsiteUrl ? "google+website" : "google") : importType;

    /* ═══ HELPER ═══ */
    const emailRegex = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g;
    const phoneRegex = /(?:\+43|0043|0)\s*(?:\d[\s\-/]*){6,12}\d/g;
    const allEmails = new Set();
    const allPhones = new Set();
    const socialLinks = {facebook:"", instagram:"", linkedin:"", tiktok:""};
    let whatsappLink = "";
    let buchungsLink = "";

    // Meta-Tags extrahieren (title, description, OpenGraph)
    const metaInfo = {title:"", description:"", ogTitle:"", ogDescription:"", ogImage:""};
    const extractMeta = (html) => {
      if (!html) return;
      if (!metaInfo.title) { const m = html.match(/<title[^>]*>([^<]+)<\/title>/i); if (m) metaInfo.title = m[1].trim(); }
      if (!metaInfo.description) { const m = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i) || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i); if (m) metaInfo.description = m[1].trim(); }
      if (!metaInfo.ogTitle) { const m = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i) || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["']/i); if (m) metaInfo.ogTitle = m[1].trim(); }
      if (!metaInfo.ogDescription) { const m = html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i) || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:description["']/i); if (m) metaInfo.ogDescription = m[1].trim(); }
    };

    // Headings extrahieren (h1-h3) fuer bessere Kategorisierung und Kontext
    const extractHeadings = (html) => {
      if (!html) return [];
      const headings = [];
      for (const m of html.matchAll(/<h[123][^>]*>([\s\S]*?)<\/h[123]>/gi)) {
        const text = m[1].replace(/<[^>]+>/g,"").trim();
        if (text.length > 2 && text.length < 200) headings.push(text);
      }
      return headings;
    };

    const extractFromHtml = (html) => {
      if (!html) return;
      extractMeta(html);
      extractColors(html);
      for (const m of html.matchAll(/mailto:([a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,})/gi)) allEmails.add(m[1].toLowerCase());
      for (const m of html.matchAll(/href=["']tel:([^"']+)["']/gi)) { const p=m[1].replace(/\s/g,"").replace(/%20/g,""); if(p.length>=8) allPhones.add(p); }
      // JSON-LD Structured Data (vollstaendig auswerten, inkl. @graph)
      for (const m of html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
        try {
          const ld = JSON.parse(m[1]);
          // @graph Support (Yoast, WordPress, etc.)
          let items = Array.isArray(ld) ? ld : [ld];
          const withGraph = [];
          for (const item of items) {
            withGraph.push(item);
            if (item["@graph"] && Array.isArray(item["@graph"])) {
              withGraph.push(...item["@graph"]);
            }
          }
          for (const item of withGraph) {
            if (item.telephone) allPhones.add(String(item.telephone).replace(/\s/g,""));
            if (item.email) allEmails.add(String(item.email).toLowerCase());
            // Oeffnungszeiten aus Schema.org
            if (item.openingHoursSpecification && !structuredData.openingHours) {
              const specs = Array.isArray(item.openingHoursSpecification) ? item.openingHoursSpecification : [item.openingHoursSpecification];
              structuredData.openingHours = specs.map(s => {
                const days = Array.isArray(s.dayOfWeek) ? s.dayOfWeek : [s.dayOfWeek];
                const dayNames = days.map(d => String(d).replace("http://schema.org/","").replace("https://schema.org/","").slice(0,2)).join(",");
                return `${dayNames} ${s.opens||""}-${s.closes||""}`;
              }).join(", ");
            }
            if (item.openingHours && !structuredData.openingHours) {
              structuredData.openingHours = Array.isArray(item.openingHours) ? item.openingHours.join(", ") : String(item.openingHours);
            }
            // Adresse aus Schema.org
            const addr = item.address || item.location?.address;
            if (addr && typeof addr === "object") {
              if (addr.streetAddress && !structuredData.adresse) structuredData.adresse = addr.streetAddress;
              if (addr.postalCode && !structuredData.plz) structuredData.plz = String(addr.postalCode);
              if (addr.addressLocality && !structuredData.ort) structuredData.ort = addr.addressLocality;
            }
            // Name
            if (item.name && !structuredData.name) structuredData.name = item.name;
            // Bewertungen aus Schema.org
            if (item.aggregateRating && !structuredData.rating) {
              structuredData.rating = {value: item.aggregateRating.ratingValue, count: item.aggregateRating.reviewCount};
            }
            if (item.review && Array.isArray(item.review)) {
              for (const rev of item.review.slice(0, 6)) {
                if (rev.reviewBody || rev.description) {
                  structuredData.reviews.push({
                    name: rev.author?.name || rev.author || "",
                    text: rev.reviewBody || rev.description || "",
                    sterne: parseInt(rev.reviewRating?.ratingValue) || 0,
                  });
                }
              }
            }
          }
        } catch(_) {}
      }
      // Plain-text Emails + Phones
      const vis = html.replace(/<script[\s\S]*?<\/script>/gi," ").replace(/<style[\s\S]*?<\/style>/gi," ").replace(/<[^>]+>/g," ");
      for (const m of vis.matchAll(emailRegex)) allEmails.add(m[0].toLowerCase());
      for (const m of vis.matchAll(phoneRegex)) { const p=m[0].replace(/[\s\-/]/g,""); if(p.length>=8) allPhones.add(p); }
      // Links: Social, WhatsApp, Buchung
      const hrefs = [...html.matchAll(/href=["']([^"']+)["']/gi)].map(m=>m[1]);
      for (const h of hrefs) {
        if (!socialLinks.facebook  && /facebook\.com\//i.test(h)  && !/sharer|share|login|dialog/i.test(h)) socialLinks.facebook=h;
        if (!socialLinks.instagram && /instagram\.com\//i.test(h) && !/sharer|share|login/i.test(h))        socialLinks.instagram=h;
        if (!socialLinks.linkedin  && /linkedin\.com\//i.test(h)  && !/sharer|share|login/i.test(h))        socialLinks.linkedin=h;
        if (!socialLinks.tiktok    && /tiktok\.com\//i.test(h)    && !/sharer|share|login/i.test(h))        socialLinks.tiktok=h;
        if (!whatsappLink && /wa\.me\//i.test(h)) whatsappLink = h;
        if (!whatsappLink && /api\.whatsapp\.com/i.test(h)) whatsappLink = h;
        if (!buchungsLink && /calendly\.com|doctolib|terminland|timify|booksy|treatwell|shore\.com|salonmeister|appointy|10minutes|termin.*online|online.*termin/i.test(h)) buchungsLink = h;
      }
    };

    // Structured data Sammler
    const structuredData = {openingHours:"", adresse:"", plz:"", ort:"", name:"", rating:null, reviews:[]};
    const brandColors = []; // Kandidaten fuer Primaerfarbe

    // Farb-Extraktion aus HTML (theme-color, CSS, Nav-Hintergrund)
    const extractColors = (html) => {
      if (!html) return;
      // 1. <meta name="theme-color"> — zuverlaessigste Quelle
      const tc = html.match(/<meta[^>]+name=["']theme-color["'][^>]+content=["']([^"']+)["']/i)
        || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']theme-color["']/i);
      if (tc) brandColors.push({source:"theme-color", color:tc[1].trim(), priority:10});
      // 2. msapplication-TileColor
      const ms = html.match(/<meta[^>]+name=["']msapplication-TileColor["'][^>]+content=["']([^"']+)["']/i);
      if (ms) brandColors.push({source:"tile-color", color:ms[1].trim(), priority:8});
      // 3. CSS Custom Properties (--primary, --brand-color, --color-primary, --main-color)
      for (const m of html.matchAll(/--(?:primary|brand-?color|color-primary|main-?color|accent)\s*:\s*(#[0-9a-fA-F]{3,8})/g)) {
        brandColors.push({source:"css-var", color:m[1].trim(), priority:7});
      }
      // 4. Nav/Header background-color
      for (const m of html.matchAll(/<(?:nav|header)[^>]+style=["'][^"']*background(?:-color)?:\s*(#[0-9a-fA-F]{3,8})/gi)) {
        brandColors.push({source:"nav-bg", color:m[1].trim(), priority:6});
      }
      // 5. Haeufigste Nicht-Standard-Farbe in inline styles
      for (const m of html.matchAll(/(?:color|background-color|background|border-color)\s*:\s*(#[0-9a-fA-F]{6})/gi)) {
        const c = m[1].toLowerCase();
        // Standard-Farben ignorieren (schwarz, weiss, grau, fast-weiss)
        if (!/^#(000|fff|0{6}|f{6}|[ef][0-9a-f][ef][0-9a-f][ef][0-9a-f]|[0-3][0-9a-f][0-3][0-9a-f][0-3][0-9a-f])$/i.test(c)) {
          brandColors.push({source:"inline", color:c, priority:3});
        }
      }
    };

    const fetchHtml = async (pageUrl, timeout=8000) => {
      try {
        const r = await fetch(pageUrl, {
          headers: {"User-Agent":"Mozilla/5.0 (compatible; SiteReady/1.0)","Accept":"text/html","Accept-Language":"de-AT,de;q=0.9"},
          redirect:"follow", signal: AbortSignal.timeout(timeout),
        });
        if (r.ok) return await r.text();
      } catch(_) {}
      return "";
    };

    const fetchJina = async (pageUrl) => {
      try {
        const r = await fetch("https://r.jina.ai/" + pageUrl, {
          headers: {"Accept":"text/plain","X-Return-Format":"text"},
          signal: AbortSignal.timeout(10000),
        });
        if (r.ok) {
          const text = await r.text();
          if (text.length < 30 || /^(Unable to|Error:|404|Page not found)/i.test(text.trim())) return "";
          return text;
        }
      } catch(_) {}
      return "";
    };

    const stripHtml = (html) => {
      if (!html) return "";
      return html.replace(/<script[\s\S]*?<\/script>/gi," ").replace(/<style[\s\S]*?<\/style>/gi," ")
        .replace(/<[^>]+>/g," ").replace(/&nbsp;/g," ").replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">")
        .replace(/\s{2,}/g," ").trim();
    };

    /* ═══ 1. HAUPTSEITE LADEN ═══ */
    const mainHtml = await fetchHtml(cleanUrl, 10000);
    extractFromHtml(mainHtml);

    let mainText = await fetchJina(cleanUrl);
    if (!mainText || mainText.length < 100) mainText = stripHtml(mainHtml);

    if (!mainText || mainText.length < 50) {
      // Google-only: Kein Website-Crawl moeglich, aber Google Maps Text vorhanden
      if (googleMapText && googleMapText.length > 50) {
        mainText = googleMapText;
        await log.info(null, "google_only_import", {url: cleanUrl, reason: "Website nicht lesbar, nur Google Maps Daten"});
      } else {
        await log.error("import", {message:"Website nicht lesbar", url:cleanUrl});
        return Response.json({error:"Die Website konnte nicht gelesen werden. Mögliche Gründe: Die Seite ist passwortgeschützt, blockiert automatische Zugriffe, oder die URL ist nicht erreichbar."}, {status:400});
      }
    }

    /* ═══ 2. SITEMAP PRUEFEN + INTERNE LINKS SAMMELN ═══ */
    // Google-only (kein Website-Link): Kein Crawl — nur Google Maps Text verwenden
    const skipCrawl = importSource === "google";
    const allInternalLinks = new Set();
    const skipExt = /\.(pdf|jpg|jpeg|png|gif|svg|webp|css|js|ico|woff|woff2|ttf|eot|mp4|mp3|zip|xml|txt|json)$/i;
    const skipPath = /\/(wp-admin|wp-content|wp-includes|cdn-cgi|assets|static|_next|\.well-known|feed|rss|search|login|register|cart|checkout|warenkorb|kasse|tag|category|author|page\/\d)\b/i;

    const addLink = (href) => {
      if (!href) return;
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

    // Sitemap checken (zuverlaessigste Quelle fuer alle Seiten)
    let sitemapFound = false;
    if (!skipCrawl) try {
      const smRes = await fetch(base + "/sitemap.xml", {signal: AbortSignal.timeout(5000), headers:{"User-Agent":"Mozilla/5.0 (compatible; SiteReady/1.0)"}});
      if (smRes.ok) {
        const smText = await smRes.text();
        if (smText.includes("<urlset") || smText.includes("<sitemapindex")) {
          sitemapFound = true;
          for (const m of smText.matchAll(/<loc>\s*(https?:\/\/[^<]+)\s*<\/loc>/gi)) {
            addLink(m[1]);
          }
          // Sitemap-Index: Untere Sitemaps auch pruefen
          const subSitemaps = [...smText.matchAll(/<loc>\s*(https?:\/\/[^<]*sitemap[^<]*\.xml)\s*<\/loc>/gi)].slice(0, 3);
          for (const sm of subSitemaps) {
            try {
              const subRes = await fetch(sm[1], {signal: AbortSignal.timeout(4000)});
              if (subRes.ok) {
                const subText = await subRes.text();
                for (const m2 of subText.matchAll(/<loc>\s*(https?:\/\/[^<]+)\s*<\/loc>/gi)) addLink(m2[1]);
              }
            } catch(_) {}
          }
        }
      }
    } catch(_) {}

    // Links aus HTML + Jina-Markdown sammeln
    const collectLinks = (html, text) => {
      if (html) {
        for (const m of html.matchAll(/href=["']([^"'#]+)["']/gi)) {
          const h = m[1];
          if (h.startsWith("mailto:") || h.startsWith("tel:") || h.startsWith("javascript:")) continue;
          addLink(h);
        }
      }
      if (text) {
        for (const m of text.matchAll(/\[([^\]]{2,60})\]\((https?:\/\/[^\s)]+)\)/gi)) addLink(m[2]);
      }
    };

    if (!skipCrawl) collectLinks(mainHtml, mainText);

    // Emails/Phones aus Jina-Haupttext
    for (const m of mainText.matchAll(emailRegex)) allEmails.add(m[0].toLowerCase());
    for (const m of mainText.matchAll(phoneRegex)) { const p=m[0].replace(/[\s\-/]/g,""); if(p.length>=8) allPhones.add(p); }

    // Standard-Pfade als Fallback
    if (!skipCrawl) {
      const standardPaths = ["/kontakt","/contact","/impressum","/leistungen","/services","/angebot",
        "/ueber-uns","/about","/team","/faq","/preise","/galerie","/partner","/referenzen",
        "/schwerpunkte","/behandlungen","/ordination","/praxis","/jobs","/karriere","/philosophie",
        "/unternehmen","/firma","/history","/geschichte"];
      for (const p of standardPaths) {
        if (![...allInternalLinks].some(l => l.toLowerCase().includes(p.slice(1)))) addLink(base + p);
      }
    }

    /* ═══ 3. UNTERSEITEN LADEN (parallel, max 20, 2 Runden) ═══ */
    const priorityPatterns = [/kontakt|contact/i, /impressum|imprint/i, /leistung|service|angebot|schwerpunkt|behandlung/i, /ueber|about|team|praxis|ordination/i, /faq|haeufig|fragen/i, /partner|referenz|zertifik/i];
    const fetchedUrls = new Set();
    const pageContents = [];

    const categorizePage = (path, headings) => {
      // Erst URL-basiert
      if (/kontakt|contact/.test(path)) return "kontakt";
      if (/impressum|imprint|legal/.test(path)) return "impressum";
      if (/leistung|service|angebot|preis|schwerpunkt|behandlung|therapie/.test(path)) return "leistungen";
      if (/ueber|about|team|praxis|ordination|unternehmen|firma|philosophie/.test(path)) return "ueberuns";
      if (/faq|haeufig|fragen/.test(path)) return "faq";
      if (/partner|referenz|zertifik/.test(path)) return "partner";
      if (/galerie|gallery|portfolio|fotos|bilder/.test(path)) return "galerie";
      if (/job|karriere|career|stelle/.test(path)) return "sonstige";
      // Content-basiert (Headings)
      if (headings && headings.length > 0) {
        const ht = headings.join(" ").toLowerCase();
        if (/leistung|service|angebot|schwerpunkt|behandlung|therapie|was wir|unsere /.test(ht)) return "leistungen";
        if (/über uns|team|wer wir|unser team|philosophie|leitbild/.test(ht)) return "ueberuns";
        if (/kontakt|erreich|anfahrt|standort/.test(ht)) return "kontakt";
        if (/faq|häufig|fragen/.test(ht)) return "faq";
        if (/partner|referenz|zertifik|auszeichnung/.test(ht)) return "partner";
      }
      return "sonstige";
    };

    // Schluesselseiten: Bei Fehler 1x wiederholen
    const keyPagePatterns = [/kontakt|contact/i, /impressum|imprint/i, /leistung|service|angebot/i];
    const isKeyPage = (pageUrl) => {
      const p = new URL(pageUrl).pathname.toLowerCase();
      return keyPagePatterns.some(rx => rx.test(p));
    };

    const fetchPage = async (pageUrl) => {
      if (fetchedUrls.has(pageUrl)) return;
      fetchedUrls.add(pageUrl);

      const doFetch = async () => {
        const [html, jinaText] = await Promise.all([
          fetchHtml(pageUrl, 6000),
          fetchJina(pageUrl),
        ]);
        if (html) {
          extractFromHtml(html);
          collectLinks(html, null);
        }

        let text = (jinaText && jinaText.length >= 50) ? jinaText : stripHtml(html);
        if (!text || text.length < 30) return;

        const headings = extractHeadings(html);

        for (const m of text.matchAll(emailRegex)) allEmails.add(m[0].toLowerCase());
        for (const m of text.matchAll(phoneRegex)) { const p=m[0].replace(/[\s\-/]/g,""); if(p.length>=8) allPhones.add(p); }

        const path = new URL(pageUrl).pathname.toLowerCase();
        const category = categorizePage(path, headings);
        const headingPrefix = headings.length > 0 ? "Seitenüberschriften: " + headings.slice(0, 5).join(" | ") + "\n" : "";
        pageContents.push({url: pageUrl, path, category, text: (headingPrefix + text).slice(0, 6000)});
      };

      try {
        await doFetch();
      } catch(e) {
        // Retry einmal fuer Schluesselseiten
        if (isKeyPage(pageUrl) && elapsed() < BUDGET_MS - 15000) {
          try { await doFetch(); } catch(_) {}
        }
      }
    };

    // Multi-Page-Crawl: Nur fuer normale Websites (nicht Instagram/Linktree/Facebook)
    let round2 = [];
    if (importType === "website") {
      // Runde 1: Erste 15 Seiten (priorisiert)
      const allLinks = [...allInternalLinks];
      const priority = allLinks.filter(u => { const p = new URL(u).pathname.toLowerCase(); return priorityPatterns.some(rx => rx.test(p)); });
      const rest = allLinks.filter(u => !priority.includes(u));
      const round1 = [...new Set([...priority, ...rest])].slice(0, 15);

      await Promise.all(round1.map(fetchPage));

      // Runde 2: Neu entdeckte Links von Unterseiten
      const newLinks = [...allInternalLinks].filter(u => !fetchedUrls.has(u));
      const newPriority = newLinks.filter(u => {
        const p = new URL(u).pathname.toLowerCase();
        return priorityPatterns.some(rx => rx.test(p));
      });
      round2 = elapsed() < BUDGET_MS - 30000 ? newPriority.slice(0, 8) : [];
      if (round2.length > 0) {
        await Promise.all(round2.map(fetchPage));
      }
    }
    // Instagram/Linktree/Facebook: Nur Hauptseite (schon oben gefetched)

    /* ═══ 4. CONTENT-DEDUP (Header/Footer/Nav entfernen) ═══ */
    // Absaetze zaehlen: Wenn ein Absatz auf 3+ Seiten vorkommt = Navigation/Footer
    const paragraphCount = {};
    const allTexts = [mainText, ...pageContents.map(p => p.text)];
    for (const t of allTexts) {
      const paras = t.split(/\n{2,}/).map(p => p.trim()).filter(p => p.length > 20 && p.length < 500);
      const seen = new Set();
      for (const para of paras) {
        // Laengerer Key (150 Zeichen) + normalisiert, um Kollisionen zu vermeiden
        const key = para.replace(/\s+/g," ").slice(0, 150).toLowerCase();
        if (!seen.has(key)) { seen.add(key); paragraphCount[key] = (paragraphCount[key] || 0) + 1; }
      }
    }
    // Nur entfernen wenn auf 3+ Seiten UND kurz genug um Nav/Footer zu sein (max 300 Zeichen)
    const duplicateParas = new Set(Object.entries(paragraphCount)
      .filter(([k,c]) => c >= 3 && k.length < 200)
      .map(([k]) => k));

    const dedup = (text) => {
      if (duplicateParas.size === 0) return text;
      return text.split(/\n{2,}/).filter(p => {
        const key = p.trim().replace(/\s+/g," ").slice(0, 150).toLowerCase();
        return !duplicateParas.has(key);
      }).join("\n\n");
    };

    /* ═══ 5. E-MAIL-OBFUSKIERUNG + SPAM FILTERN ═══ */
    // Obfuskierte E-Mails erkennen: info [at] firma.at, info(at)firma.at, info [ät] firma.at
    for (const t of allTexts) {
      for (const m of t.matchAll(/([a-zA-Z0-9._%+\-]+)\s*[\[\(]\s*(?:at|ät|AT)\s*[\]\)]\s*([a-zA-Z0-9.\-]+\.[a-zA-Z]{2,})/g)) {
        allEmails.add((m[1] + "@" + m[2]).toLowerCase());
      }
    }

    const filteredEmails = [...allEmails].filter(e =>
      !/noreply|no-reply|donotreply|support@stripe|mailer|bounce|postmaster|webmaster|siteready|wix\.com|squarespace|wordpress|@sentry/i.test(e)
    );

    // Telefonnummern normalisieren und deduplizieren
    // +431234567 und 01234567 sind dieselbe Nummer
    const normalizePhone = (p) => {
      let n = p.replace(/[\s\-/()\+]/g,"");
      // 0043... -> 43...
      if (n.startsWith("0043")) n = n.slice(2);
      // 0... -> 43... (oesterreichische Vorwahl)
      else if (n.startsWith("0")) n = "43" + n.slice(1);
      return n;
    };
    const phoneMap = new Map(); // normalized -> original format
    for (const p of allPhones) {
      const norm = normalizePhone(p);
      if (norm.length >= 8 && norm.length <= 16) {
        // Bevorzuge +43-Format
        if (!phoneMap.has(norm) || p.startsWith("+")) phoneMap.set(norm, p);
      }
    }
    const filteredPhones = [...phoneMap.values()].filter(p => {
      const clean = p.replace(/[\s\-/]/g,"");
      return clean.length >= 8 && clean.length <= 16;
    });

    // WhatsApp-Nummer aus Link extrahieren
    let whatsappNumber = "";
    if (whatsappLink) {
      const waMatch = whatsappLink.match(/wa\.me\/(\d+)|phone=(\d+)/);
      if (waMatch) whatsappNumber = "+" + (waMatch[1] || waMatch[2]);
    }

    /* ═══ 6. GESAMTTEXT AUFBAUEN (dedupliziert) ═══ */
    const anthropicKey = env.ANTHROPIC_API_KEY;
    if (!anthropicKey) return Response.json({error:"API-Konfigurationsfehler."}, {status:500});

    const grouped = {};
    for (const p of pageContents) {
      if (!grouped[p.category]) grouped[p.category] = "";
      grouped[p.category] += "\n--- " + p.path + " ---\n" + dedup(p.text);
    }

    let fullText = "";
    // Google Maps Text als eigene Sektion einfuegen (falls vorhanden)
    if (googleMapText) {
      fullText += "=== GOOGLE MAPS PROFIL ===\n" + googleMapText.slice(0, 6000) + "\n\n";
    }
    fullText += "=== HAUPTSEITE ===\n" + dedup(mainText).slice(0, 8000);
    const sectionOrder = ["leistungen","ueberuns","kontakt","impressum","faq","partner","galerie","sonstige"];
    const sectionLabels = {leistungen:"LEISTUNGEN/ANGEBOT",ueberuns:"ÜBER UNS/TEAM",kontakt:"KONTAKT",impressum:"IMPRESSUM",faq:"FAQ",partner:"PARTNER/REFERENZEN",galerie:"GALERIE",sonstige:"WEITERE SEITEN"};

    for (const key of sectionOrder) {
      if (grouped[key]) {
        // Leistungen und Ueberuns bekommen mehr Platz (oft die wichtigsten Inhalte)
        const maxLen = key === "sonstige" ? 3000 : (key === "leistungen" || key === "ueberuns") ? 6000 : 4000;
        fullText += `\n\n=== ${sectionLabels[key]} ===\n` + grouped[key].slice(0, maxLen);
      }
    }

    fullText = fullText.slice(0, 40000);

    // Structured-Data + Meta Hints
    let structuredHint = "";
    if (metaInfo.title) structuredHint += `\nSeitentitel: ${metaInfo.title}`;
    if (metaInfo.description || metaInfo.ogDescription) structuredHint += `\nMeta-Beschreibung: ${metaInfo.description || metaInfo.ogDescription}`;
    if (structuredData.openingHours) structuredHint += `\nStrukturierte Oeffnungszeiten (Schema.org): ${structuredData.openingHours}`;
    if (structuredData.adresse) structuredHint += `\nStrukturierte Adresse: ${structuredData.adresse}, ${structuredData.plz} ${structuredData.ort}`;
    if (structuredData.reviews.length) structuredHint += `\nStrukturierte Bewertungen (${structuredData.reviews.length}): ${JSON.stringify(structuredData.reviews.slice(0,6))}`;

    const emailHint = filteredEmails.length > 0
      ? `\n\nGefundene E-Mail-Adressen: ${filteredEmails.join(", ")}\nWaehle die primaere Kontakt-E-Mail (nicht no-reply, nicht Drittanbieter).`
      : "";
    const phoneHint = filteredPhones.length > 0
      ? `\nGefundene Telefonnummern: ${filteredPhones.join(", ")}\nWaehle die primaere Kontakt-Telefonnummer.`
      : "";

    /* ═══ 7. CLAUDE SONNET EXTRAKTION ═══ */
    const claudeResp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {"Content-Type":"application/json","x-api-key":anthropicKey,"anthropic-version":"2023-06-01"},
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 8192,
        messages: [{
          role: "user",
          content: `Extrahiere aus folgendem Website-Text ALLE Daten eines oesterreichischen Unternehmens.
Du bekommst den vollstaendigen Inhalt von ${pageContents.length + 1} Unterseiten${sitemapFound ? " (via Sitemap gefunden)" : ""}.

WICHTIG: Lies den GESAMTEN Text SEHR GRUENDLICH durch — jede Seite, jede Unterseite, jedes Detail.
Informationen koennen auf verschiedenen Seiten verstreut sein (z.B. Leistungen auf eigenen Unterseiten, Kontaktdaten im Impressum, Team auf der Ueber-uns-Seite).
Antworte NUR mit einem JSON-Objekt (kein Markdown, kein Text drumherum).

OBERSTE REGEL: Nur Informationen die TATSAECHLICH im Text stehen. NICHTS erfinden.
Leere Strings "" und leere Arrays [] fuer nicht gefundene Felder.
Im Zweifel lieber leer lassen als etwas Falsches schreiben.

JSON-Felder:

=== FIRMA & KONTAKT ===
- firmenname: Offizieller Name (max 60 Zeichen). Priorisiere: Impressum > Seitentitel > Logo-Text
- telefon: Format +43... (leer wenn nicht gefunden). Suche auf: Kontaktseite, Impressum, Footer, Header
- email: Primaere Kontakt-E-Mail (nicht no-reply, nicht Drittanbieter). Suche auf: Kontaktseite, Impressum, Footer
- plz: 4-stellige oesterreichische Postleitzahl
- ort: Ortsname
- adresse: Strasse mit Hausnummer
- kurzbeschreibung: Was das Unternehmen macht, 1-2 Saetze, max 200 Zeichen. Aus echtem Text ableiten.
- bundesland: NUR: wien/noe/ooe/stmk/sbg/tirol/ktn/vbg/bgld (aus PLZ oder Adresse ableiten falls nicht explizit)
- whatsapp: WhatsApp-Nummer falls auf der Website erwaehnt (Format: +43...)
- buchungslink: URL zum Online-Terminbuchungssystem falls vorhanden

=== RECHTLICHES (aus Impressum) ===
- unternehmensform: NUR: eu/einzelunternehmen/gmbh/og/kg/ag/verein/gesnbr
- uid: ATU...
- firmenbuchnummer: FN...
- firmenbuchgericht: z.B. HG Wien
- gisazahl: Nur Ziffern

=== BRANCHE & LEISTUNGEN ===
- branche: NUR einer dieser Werte:
  Handwerk: elektro/installateur/maler/tischler/fliesenleger/schlosser/dachdecker/zimmerei/maurer/bodenleger/glaser/gaertner/klima/reinigung/baumeister/kfz/aufsperrdienst/hafner/raumausstatter/goldschmied/schneider/rauchfangkehrer/schaedlingsbekaempfung
  Kosmetik: friseur/kosmetik/nagel/massage/tattoo/fusspflege/permanent_makeup/hundesalon
  Gastro: restaurant/cafe/baeckerei/catering/bar/heuriger/imbiss/fleischerei
  Gesundheit: arzt/zahnarzt/physiotherapie/psychotherapie/tierarzt/apotheke/optiker/heilpraktiker/ergotherapie/logopaedie/energetiker/hebamme/diaetologe/hoerakustiker/zahntechnik/heilmasseur
  Dienstleistung: steuerberater/rechtsanwalt/fotograf/versicherung/immobilien/hausverwaltung/umzug/eventplanung/florist/architekt/it_service/werbeagentur/bestattung/notar/finanzberater/reisebuero/innenarchitekt/textilreinigung
  Bildung: fahrschule/nachhilfe/musikschule/trainer/yoga/hundeschule/tanzschule/reitschule/schwimmschule
  Sonstige: sonstige
  Arzt-Ordinationen = "arzt". Immer eine Branche zuordnen!
- leistungen: Array mit ALLEN konkreten Leistungen/Angeboten (max 12).
  WICHTIG: Durchsuche ALLE Seiten gruendlich! Leistungen stehen oft auf:
  - Eigenen Unterseiten (z.B. /leistungen/photovoltaik)
  - Der Hauptseite unter "Unsere Leistungen"
  - In Aufzaehlungslisten oder Cards
  NUR buchbare Dienstleistungen/Produkte, keine Navigationspunkte oder Slogans.
- spezialisierung: Fachgebiet (z.B. "Allgemeinmedizin", "Photovoltaik")

=== OEFFNUNGSZEITEN & HINWEISE ===
- oeffnungszeiten: Oeffnungszeiten als Freitext (Format: "Mo-Fr 08:00-17:00, Sa 09:00-12:00"). Suche auf Kontaktseite, Hauptseite, Google-Info.
- gut_zu_wissen: Permanente Kundenhinweise (z.B. "Termine nur nach Vereinbarung", "Parkplaetze vorhanden"), getrennt durch \\n. Max 5.

=== BEWERTUNGEN (nur echte!) ===
- bewertungen: Array mit Kundenbewertungen die WOERTLICH auf der Website stehen.
  Format: [{"name":"Name","text":"Bewertungstext","sterne":5}]
  Max 6. NUR echte, NICHTS erfinden. Suche auch auf Unterseiten wie /bewertungen, /referenzen.

=== FAQ (nur echte!) ===
- faq: Array mit FAQ die TATSAECHLICH auf der Website stehen.
  Format: [{"frage":"Die Frage?","antwort":"Die Antwort."}]
  Max 8. NUR echte Fragen+Antworten. Suche auf /faq, aber auch Accordion-Elemente auf anderen Seiten.

=== ZAHLEN & FAKTEN (nur echte!) ===
- fakten: Array mit konkreten Zahlen die auf der Website stehen.
  Format: [{"zahl":"15+","label":"Jahre Erfahrung"}]
  Max 4. NUR was wirklich auf der Website steht. Typische Quellen: "Ueber uns", Hauptseite.

=== PARTNER & ZERTIFIKATE (nur echte!) ===
- partner: Array mit Partnern/Zertifizierungen/Verbaenden/Marken.
  Format: [{"name":"WKO"}]
  Max 8. NUR was tatsaechlich auf der Website steht. Suche auch Logo-Leisten, Footer, "Unsere Partner"-Bereiche.

=== TEAM ===
- team: Array mit Teammitgliedern.
  Format: [{"name":"Martin Berger","rolle":"Geschäftsführer"}]
  NUR wenn Name UND Rolle/Position auf der Website stehen. Max 8.
  Suche auf: /team, /ueber-uns, Hauptseite, Impressum (Geschaeftsfuehrer).

=== ABLAUF ===
- ablauf_schritte: Array mit Arbeits-/Ablauf-Schritten falls auf der Website beschrieben.
  Format: [{"titel":"Erstgespräch","text":"Wir besprechen Ihre Wünsche"}]
  Max 5. NUR wenn eine "So funktioniert's"/"Ablauf"/"Ihre Vorteile"-Sektion existiert.
  Suche auf: Hauptseite, /ablauf, /so-funktionierts. NICHTS erfinden.

=== LEISTUNGS-BESCHREIBUNGEN ===
- leistungen_beschreibungen: Objekt mit Kurzbeschreibungen zu den Leistungen.
  Format: {"Leistungsname":"Kurzbeschreibung in 1 Satz"}
  NUR wenn auf der Website echte Beschreibungstexte zu den Leistungen stehen.
  Uebernimm den Originaltext (gekuerzt auf max 20 Woerter).

=== MERKMALE ===
- merkmale: Objekt. NUR auf true wenn KLAR im Text erwaehnt.
  Keys: kassenvertrag ("alle_kassen"/"wahlarzt"/"privat"/"oegk"/"bvaeb"/"svs"), barrierefrei, parkplaetze, notdienst, meisterbetrieb, terminvereinbarung, erstgespraech_gratis, online_beratung, hausbesuche, kartenzahlung, ratenzahlung, gutscheine, zertifiziert, kostenvoranschlag, foerderungsberatung, gastgarten, takeaway, lieferservice

Website-Text:
${fullText}${structuredHint}${emailHint}${phoneHint}`,
        }],
      }),
    });

    if (!claudeResp.ok) {
      const errText = await claudeResp.text();
      await log.error("import", {message:"Claude API Fehler: "+errText.slice(0,500), url:cleanUrl});
      return Response.json({error:"Die Analyse der Website ist fehlgeschlagen. Bitte versuchen Sie es erneut."}, {status:500});
    }

    const claudeData = await claudeResp.json();
    const rawContent = claudeData.content?.[0]?.text || "{}";

    // Import-Kosten berechnen
    const usage = claudeData.usage || {};
    const importTokIn = usage.input_tokens || 0;
    const importTokOut = usage.output_tokens || 0;
    const importCostEur = Math.round(((importTokIn * 3 + importTokOut * 15) / 1000000) * 0.92 * 10000) / 10000;

    let extracted;
    try {
      const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
      extracted = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
    } catch(e) {
      try {
        const codeBlock = rawContent.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        if (codeBlock) extracted = JSON.parse(codeBlock[1]);
        else extracted = {};
      } catch(e2) { extracted = {}; }
    }

    /* ═══ 8. NORMALISIEREN & VALIDIEREN ═══ */

    const ufRaw = (extracted.unternehmensform||"").toLowerCase().replace(/[\s.]/g,"");
    const ufMap = {"eu":"eu","einzelunternehmen":"einzelunternehmen","gmbh":"gmbh","og":"og","kg":"kg","ag":"ag","verein":"verein","gesnbr":"gesnbr","gesbr":"gesnbr"};
    const unternehmensform = ufMap[ufRaw] || (ufRaw.includes("gmbh")?"gmbh":ufRaw.includes("eu")?"eu":"");

    // Email: Domain > Claude > Regex
    const siteDomain = new URL(cleanUrl).hostname.replace(/^www\./,"");
    const domainMatch = filteredEmails.find(e => e.split("@")[1] === siteDomain);
    const claudeEmail = (extracted.email||"").toLowerCase();
    const finalEmail = domainMatch || (filteredEmails.includes(claudeEmail)?claudeEmail:"") || filteredEmails[0] || "";

    // Telefon: tel:-Link > Claude
    const claudePhone = (extracted.telefon||"").replace(/[\s\-/]/g,"");
    const finalPhone = filteredPhones[0] || claudePhone || "";

    // PLZ: Claude > Structured Data
    const plzRaw = (extracted.plz || structuredData.plz || "").replace(/\D/g,"");
    const plz = plzRaw.length === 4 ? plzRaw : "";

    // Ort: Claude > Structured Data
    const ort = extracted.ort || structuredData.ort || "";

    // Adresse: Claude > Structured Data
    const adresse = extracted.adresse || structuredData.adresse || "";

    // Bundesland: PLZ-basiert (zuverlaessig) > Claude > leer
    const validBL = ["wien","noe","ooe","stmk","sbg","tirol","ktn","vbg","bgld"];
    const plzToBundesland = (p) => {
      if (!p || p.length !== 4) return "";
      const n = parseInt(p);
      if (n >= 1000 && n <= 1239) return "wien";
      if (n >= 1300 && n <= 1400) return "noe"; // Wien-Umgebung
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
    const blFromPlz = plzToBundesland(plz);
    const bundesland = blFromPlz || (validBL.includes(extracted.bundesland) ? extracted.bundesland : "");

    // Branche validieren
    const validBranchen = [
      // Handwerk
      "elektro","installateur","maler","tischler","fliesenleger","schlosser","dachdecker","zimmerei","maurer","bodenleger","glaser","gaertner","klima","reinigung","baumeister","kfz","aufsperrdienst","hafner","raumausstatter","goldschmied","schneider","rauchfangkehrer","schaedlingsbekaempfung",
      // Kosmetik
      "friseur","kosmetik","nagel","massage","tattoo","fusspflege","permanent_makeup","hundesalon",
      // Gastro
      "restaurant","cafe","baeckerei","catering","bar","heuriger","imbiss","fleischerei",
      // Gesundheit
      "arzt","zahnarzt","physiotherapie","psychotherapie","tierarzt","apotheke","optiker","heilpraktiker","ergotherapie","logopaedie","energetiker","hebamme","diaetologe","hoerakustiker","zahntechnik","heilmasseur",
      // Dienstleistung
      "steuerberater","rechtsanwalt","fotograf","versicherung","immobilien","hausverwaltung","umzug","eventplanung","florist","architekt","it_service","werbeagentur","bestattung","notar","finanzberater","reisebuero","innenarchitekt","textilreinigung",
      // Bildung
      "fahrschule","nachhilfe","musikschule","trainer","yoga","hundeschule","tanzschule","reitschule","schwimmschule",
      // Sonstige
      "sonstige",
    ];
    const brancheRaw = (extracted.branche || "").toLowerCase().replace(/[\s\-]/g,"_");
    const branche = validBranchen.includes(brancheRaw) ? brancheRaw : (validBranchen.find(b => brancheRaw.includes(b)) || "sonstige");

    // Leistungen
    const leistungen = Array.isArray(extracted.leistungen)
      ? [...new Set(extracted.leistungen.map(l=>l?.trim()).filter(Boolean))].slice(0,12)
      : [];

    // Bewertungen: Claude + Structured Data kombinieren
    let bewertungen = Array.isArray(extracted.bewertungen)
      ? extracted.bewertungen.filter(b=>b&&typeof b.text==="string"&&b.text.trim())
        .map(b=>({name:(b.name||"").slice(0,60),text:b.text.trim().slice(0,500),sterne:Math.min(Math.max(parseInt(b.sterne)||0,0),5)}))
      : [];
    // Structured Data Bewertungen ergaenzen (wenn Claude keine gefunden hat)
    if (bewertungen.length === 0 && structuredData.reviews.length > 0) {
      bewertungen = structuredData.reviews.filter(r=>r.text?.trim()).map(r=>({
        name:(r.name||"").slice(0,60), text:r.text.trim().slice(0,500), sterne:Math.min(Math.max(parseInt(r.sterne)||0,0),5)
      }));
    }
    bewertungen = bewertungen.slice(0,6);

    // FAQ
    const faq = Array.isArray(extracted.faq)
      ? extracted.faq.filter(f=>f&&typeof f.frage==="string"&&typeof f.antwort==="string"&&f.frage.trim()&&f.antwort.trim())
        .map(f=>({frage:f.frage.trim().slice(0,200),antwort:f.antwort.trim().slice(0,500)}))
        .slice(0,8)
      : [];

    // Fakten
    const fakten = Array.isArray(extracted.fakten)
      ? extracted.fakten.filter(f=>f&&typeof f.zahl==="string"&&typeof f.label==="string"&&f.zahl.trim()&&f.label.trim())
        .map(f=>({zahl:f.zahl.trim().slice(0,20),label:f.label.trim().slice(0,60)}))
        .slice(0,4)
      : [];

    // Partner
    const partner = Array.isArray(extracted.partner)
      ? extracted.partner.filter(p=>p&&typeof p.name==="string"&&p.name.trim())
        .map(p=>({name:p.name.trim().slice(0,60)}))
        .slice(0,8)
      : [];

    // Team
    const team = Array.isArray(extracted.team)
      ? extracted.team.filter(t=>t&&typeof t.name==="string"&&t.name.trim())
        .map(t=>({name:t.name.trim().slice(0,60),rolle:(t.rolle||"").trim().slice(0,60)}))
        .slice(0,8)
      : [];

    // Ablauf-Schritte
    const ablaufSchritte = Array.isArray(extracted.ablauf_schritte)
      ? extracted.ablauf_schritte.filter(s=>s&&typeof s.titel==="string"&&s.titel.trim())
        .map(s=>({titel:s.titel.trim().slice(0,60),text:(s.text||"").trim().slice(0,150)}))
        .slice(0,5)
      : [];

    // Leistungs-Beschreibungen
    const leistBeschreibungen = (typeof extracted.leistungen_beschreibungen === "object" && extracted.leistungen_beschreibungen && !Array.isArray(extracted.leistungen_beschreibungen))
      ? Object.fromEntries(Object.entries(extracted.leistungen_beschreibungen).map(([k,v])=>[k.slice(0,60),String(v||"").slice(0,200)]).filter(([k,v])=>k&&v))
      : {};

    // Merkmale
    const merkmale = extracted.merkmale || {};

    // Oeffnungszeiten: Claude > Structured Data
    const oeffnungszeiten = extracted.oeffnungszeiten || structuredData.openingHours || "";

    // WhatsApp: Link-Extraktion > Claude
    const finalWhatsapp = whatsappNumber || (extracted.whatsapp || "").replace(/[\s\-/]/g,"") || "";

    // Buchungslink: Link-Extraktion > Claude
    const finalBuchungslink = buchungsLink || extracted.buchungslink || "";

    // Sections-Visible (zeige Section wenn Daten vorhanden)
    const sectionsVisible = {};
    if (faq.length > 0) sectionsVisible.faq = true;
    if (fakten.length > 0) sectionsVisible.fakten = true;
    if (partner.length > 0) sectionsVisible.partner = true;
    if (bewertungen.length > 0) sectionsVisible.bewertungen = true;
    if (team.length > 0) sectionsVisible.team = true;
    if (ablaufSchritte.length >= 2) sectionsVisible.ablauf = true;

    // Varianten-Cache berechnen
    const { berechneVarianten } = await import("../_lib/varianten.js");
    const variantenCache = berechneVarianten({
      hero_image: null,
      stil: "klassisch", // Stil wird erst in Schritt 5 gewählt, Generierung überschreibt
      branche: branche,
      leistungen: leistungen.map(() => ({foto: false})),
      ablauf: ablaufSchritte,
      bewertungen,
      team,
      faq,
      galerie: [],
      adresse, plz,
    });

    // Brand-Farbe ermitteln (beste Kandidatin nach Prioritaet)
    const normalizeHex = (c) => {
      if (!c) return "";
      c = c.trim().toLowerCase();
      if (/^#[0-9a-f]{3}$/.test(c)) c = "#" + c[1]+c[1] + c[2]+c[2] + c[3]+c[3];
      if (/^#[0-9a-f]{6}$/.test(c)) return c;
      return "";
    };
    let brandColor = "";
    if (brandColors.length > 0) {
      // Nach Prioritaet sortieren, dann haeufigste inline-Farbe als Tiebreaker
      const sorted = brandColors
        .map(b => ({...b, color: normalizeHex(b.color)}))
        .filter(b => b.color);
      // Hoechste Prioritaet gewinnt
      sorted.sort((a,b) => b.priority - a.priority);
      if (sorted.length > 0) brandColor = sorted[0].color;
    }

    await log.timeEnd("import", null, "import_success");
    await log.info(null, "import_result", {url:cleanUrl, pages:pageContents.length+1, sitemap:sitemapFound, deduped:duplicateParas.size});

    return Response.json({
      firmenname: (extracted.firmenname || structuredData.name || "").slice(0,60),
      telefon: finalPhone,
      email: finalEmail,
      plz, ort, adresse,
      kurzbeschreibung: (extracted.kurzbeschreibung||"").slice(0,200),
      bundesland, unternehmensform,
      uid: extracted.uid || "",
      firmenbuchnummer: extracted.firmenbuchnummer || "",
      firmenbuchgericht: extracted.firmenbuchgericht || "",
      gisazahl: extracted.gisazahl || "",
      branche,
      leistungen, spezialisierung: extracted.spezialisierung || "",
      oeffnungszeiten_import: oeffnungszeiten,
      gut_zu_wissen: extracted.gut_zu_wissen || "",
      bewertungen, faq, fakten, partner, team, ablauf_schritte: ablaufSchritte,
      leistungen_beschreibungen: Object.keys(leistBeschreibungen).length > 0 ? leistBeschreibungen : undefined,
      whatsapp: finalWhatsapp,
      buchungslink: finalBuchungslink,
      varianten_cache: variantenCache,
      sections_visible: sectionsVisible,
      facebook: socialLinks.facebook || "",
      instagram: socialLinks.instagram || "",
      linkedin: socialLinks.linkedin || "",
      tiktok: socialLinks.tiktok || "",
      merkmale,
      brand_color: brandColor,
      _meta: {pages_read: pageContents.length+1, pages_round2: round2.length, sitemap: sitemapFound, deduped_paragraphs: duplicateParas.size, import_tokens_in: importTokIn, import_tokens_out: importTokOut, import_cost_eur: importCostEur, import_type: importSource, google_website: googleWebsiteUrl||undefined},
    });

  } catch(e) {
    await log.error("import", {message:e.message, stack:e.stack});
    return Response.json({error:"Der Import ist fehlgeschlagen. Bitte prüfen Sie die URL und versuchen Sie es erneut."}, {status:500});
  }
}
