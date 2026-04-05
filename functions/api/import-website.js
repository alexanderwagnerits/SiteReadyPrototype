import { createLogger } from "../_lib/log.js";

export async function onRequestPost({request, env}) {
  const log = createLogger(env);
  try {
    const {url} = await request.json();
    if (!url) return Response.json({error: "URL fehlt"}, {status: 400});
    log.time("import");

    let cleanUrl = url.trim();
    if (!cleanUrl.startsWith("http")) cleanUrl = "https://" + cleanUrl;
    const base = new URL(cleanUrl).origin;

    /* ═══ HELPER ═══ */
    const emailRegex = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g;
    const phoneRegex = /(?:\+43|0043|0)\s*(?:\d[\s\-/]*){6,12}\d/g;
    const allEmails = new Set();
    const allPhones = new Set();
    const socialLinks = {facebook:"", instagram:"", linkedin:"", tiktok:""};
    let whatsappLink = "";
    let buchungsLink = "";

    const extractFromHtml = (html) => {
      if (!html) return;
      for (const m of html.matchAll(/mailto:([a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,})/gi)) allEmails.add(m[1].toLowerCase());
      for (const m of html.matchAll(/href=["']tel:([^"']+)["']/gi)) { const p=m[1].replace(/\s/g,"").replace(/%20/g,""); if(p.length>=8) allPhones.add(p); }
      // JSON-LD Structured Data (vollstaendig auswerten)
      for (const m of html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
        try {
          const ld = JSON.parse(m[1]);
          const items = Array.isArray(ld) ? ld : [ld];
          for (const item of items) {
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
          signal: AbortSignal.timeout(15000),
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
      await log.error("import", {message:"Website nicht lesbar", url:cleanUrl});
      return Response.json({error:"Die Website konnte nicht gelesen werden. M\u00f6gliche Gr\u00fcnde: Die Seite ist passwortgesch\u00fctzt, blockiert automatische Zugriffe, oder die URL ist nicht erreichbar."}, {status:400});
    }

    /* ═══ 2. SITEMAP PRUEFEN + INTERNE LINKS SAMMELN ═══ */
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
    try {
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

    collectLinks(mainHtml, mainText);

    // Emails/Phones aus Jina-Haupttext
    for (const m of mainText.matchAll(emailRegex)) allEmails.add(m[0].toLowerCase());
    for (const m of mainText.matchAll(phoneRegex)) { const p=m[0].replace(/[\s\-/]/g,""); if(p.length>=8) allPhones.add(p); }

    // Standard-Pfade als Fallback
    const standardPaths = ["/kontakt","/contact","/impressum","/leistungen","/services","/angebot",
      "/ueber-uns","/about","/team","/faq","/preise","/galerie","/partner","/referenzen"];
    for (const p of standardPaths) {
      if (![...allInternalLinks].some(l => l.toLowerCase().includes(p.slice(1)))) addLink(base + p);
    }

    /* ═══ 3. UNTERSEITEN IN BATCHES LADEN ═══ */
    const urlsToFetch = [...allInternalLinks].slice(0, 20);
    const pageContents = [];

    // Batches von 5 Seiten (Jina Rate-Limit freundlich)
    const batchSize = 5;
    for (let i = 0; i < urlsToFetch.length; i += batchSize) {
      const batch = urlsToFetch.slice(i, i + batchSize);
      await Promise.all(batch.map(async (pageUrl) => {
        const html = await fetchHtml(pageUrl, 6000);
        if (html) {
          extractFromHtml(html);
          collectLinks(html, null);
        }

        let text = await fetchJina(pageUrl);
        if (!text || text.length < 50) text = stripHtml(html);
        if (!text || text.length < 30) return;

        for (const m of text.matchAll(emailRegex)) allEmails.add(m[0].toLowerCase());
        for (const m of text.matchAll(phoneRegex)) { const p=m[0].replace(/[\s\-/]/g,""); if(p.length>=8) allPhones.add(p); }

        const path = new URL(pageUrl).pathname.toLowerCase();
        let category = "sonstige";
        if (/kontakt|contact/.test(path)) category = "kontakt";
        else if (/impressum|imprint|legal/.test(path)) category = "impressum";
        else if (/leistung|service|angebot|preis|schwerpunkt|behandlung|therapie/.test(path)) category = "leistungen";
        else if (/ueber|about|team/.test(path)) category = "ueberuns";
        else if (/faq|haeufig|fragen/.test(path)) category = "faq";
        else if (/partner|referenz|zertifik/.test(path)) category = "partner";
        else if (/galerie|gallery|portfolio|fotos|bilder/.test(path)) category = "galerie";

        pageContents.push({url: pageUrl, path, category, text: text.slice(0, 4000)});
      }));
    }

    /* ═══ 4. CONTENT-DEDUP (Header/Footer/Nav entfernen) ═══ */
    // Absaetze zaehlen: Wenn ein Absatz auf 3+ Seiten vorkommt = Navigation/Footer
    const paragraphCount = {};
    const allTexts = [mainText, ...pageContents.map(p => p.text)];
    for (const t of allTexts) {
      const paras = t.split(/\n{2,}/).map(p => p.trim()).filter(p => p.length > 20 && p.length < 300);
      const seen = new Set();
      for (const para of paras) {
        const key = para.slice(0, 80).toLowerCase();
        if (!seen.has(key)) { seen.add(key); paragraphCount[key] = (paragraphCount[key] || 0) + 1; }
      }
    }
    const duplicateParas = new Set(Object.entries(paragraphCount).filter(([,c]) => c >= 3).map(([k]) => k));

    const dedup = (text) => {
      if (duplicateParas.size === 0) return text;
      return text.split(/\n{2,}/).filter(p => {
        const key = p.trim().slice(0, 80).toLowerCase();
        return !duplicateParas.has(key);
      }).join("\n\n");
    };

    /* ═══ 5. SPAM FILTERN ═══ */
    const filteredEmails = [...allEmails].filter(e =>
      !/noreply|no-reply|donotreply|support@stripe|mailer|bounce|postmaster|webmaster|siteready|wix\.com|squarespace|wordpress|@sentry/i.test(e)
    );
    const filteredPhones = [...allPhones].filter(p => p.length >= 8 && p.length <= 16);

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

    let fullText = "=== HAUPTSEITE ===\n" + dedup(mainText).slice(0, 5000);
    const sectionOrder = ["leistungen","ueberuns","kontakt","impressum","faq","partner","galerie","sonstige"];
    const sectionLabels = {leistungen:"LEISTUNGEN/ANGEBOT",ueberuns:"\u00dcBER UNS/TEAM",kontakt:"KONTAKT",impressum:"IMPRESSUM",faq:"FAQ",partner:"PARTNER/REFERENZEN",galerie:"GALERIE",sonstige:"WEITERE SEITEN"};

    for (const key of sectionOrder) {
      if (grouped[key]) {
        const maxLen = key === "sonstige" ? 2000 : 4000;
        fullText += `\n\n=== ${sectionLabels[key]} ===\n` + grouped[key].slice(0, maxLen);
      }
    }

    fullText = fullText.slice(0, 24000);

    // Structured-Data Hints
    let structuredHint = "";
    if (structuredData.openingHours) structuredHint += `\nStrukturierte Oeffnungszeiten (Schema.org): ${structuredData.openingHours}`;
    if (structuredData.adresse) structuredHint += `\nStrukturierte Adresse: ${structuredData.adresse}, ${structuredData.plz} ${structuredData.ort}`;
    if (structuredData.reviews.length) structuredHint += `\nStrukturierte Bewertungen (${structuredData.reviews.length}): ${JSON.stringify(structuredData.reviews.slice(0,3))}`;

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
        max_tokens: 4096,
        messages: [{
          role: "user",
          content: `Extrahiere aus folgendem Website-Text ALLE Daten eines oesterreichischen Unternehmens.
Du bekommst den vollstaendigen Inhalt von ${pageContents.length + 1} Unterseiten${sitemapFound ? " (via Sitemap gefunden)" : ""}. Lies ALLES gruendlich durch.
Antworte NUR mit einem JSON-Objekt (kein Markdown, kein Text drumherum).

OBERSTE REGEL: Nur Informationen die TATSAECHLICH im Text stehen. NICHTS erfinden.
Leere Strings "" und leere Arrays [] fuer nicht gefundene Felder.
Im Zweifel lieber leer lassen als etwas Falsches schreiben.

JSON-Felder:

=== FIRMA & KONTAKT ===
- firmenname: Offizieller Name (max 60 Zeichen)
- telefon: Format +43... (leer wenn nicht gefunden)
- email: Primaere Kontakt-E-Mail
- plz: 4-stellige oesterreichische Postleitzahl
- ort: Ortsname
- adresse: Strasse mit Hausnummer
- kurzbeschreibung: Was das Unternehmen macht, 1-2 Saetze, max 200 Zeichen. Aus echtem Text ableiten.
- bundesland: NUR: wien/noe/ooe/stmk/sbg/tirol/ktn/vbg/bgld
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
  Handwerk: elektro/installateur/maler/tischler/fliesenleger/schlosser/dachdecker/zimmerei/maurer/bodenleger/glaser/gaertner/klima/reinigung/baumeister/kfz/hafner/raumausstatter
  Kosmetik: friseur/kosmetik/nagel/massage/tattoo/fusspflege/permanent_makeup/hundesalon
  Gastro: restaurant/cafe/baeckerei/catering/bar/heuriger/fleischerei
  Gesundheit: arzt/zahnarzt/physiotherapie/psychotherapie/tierarzt/apotheke/optiker/heilpraktiker/ergotherapie/logopaedie/hebamme/diaetologe/hoerakustiker
  Dienstleistung: steuerberater/rechtsanwalt/fotograf/versicherung/immobilien/hausverwaltung/umzug/eventplanung
  Bildung: fahrschule/nachhilfe/musikschule/trainer/yoga
  Sonstige: sonstige
  Arzt-Ordinationen = "arzt". Immer eine Branche zuordnen!
- leistungen: Array mit ALLEN konkreten Leistungen/Angeboten (max 12). Suche gruendlich auf ALLEN Seiten, auch auf einzelnen Leistungs-Unterseiten. NUR buchbare Dienstleistungen, keine Navigationspunkte.
- spezialisierung: Fachgebiet (z.B. "Allgemeinmedizin", "Photovoltaik")

=== OEFFNUNGSZEITEN & HINWEISE ===
- oeffnungszeiten: Oeffnungszeiten als Freitext (Format: "Mo-Fr 08:00-17:00, Sa 09:00-12:00")
- gut_zu_wissen: Permanente Kundenhinweise, getrennt durch \\n. Max 5.

=== BEWERTUNGEN (nur echte!) ===
- bewertungen: Array mit Kundenbewertungen die WOERTLICH auf der Website stehen.
  Format: [{"name":"Name","text":"Bewertungstext","sterne":5}]
  Max 6. NUR echte, NICHTS erfinden.

=== FAQ (nur echte!) ===
- faq: Array mit FAQ die TATSAECHLICH auf der Website stehen.
  Format: [{"frage":"Die Frage?","antwort":"Die Antwort."}]
  Max 8. NUR echte Fragen+Antworten.

=== ZAHLEN & FAKTEN (nur echte!) ===
- fakten: Array mit konkreten Zahlen die auf der Website stehen.
  Format: [{"zahl":"15+","label":"Jahre Erfahrung"}]
  Max 4. NUR was wirklich auf der Website steht.

=== PARTNER & ZERTIFIKATE (nur echte!) ===
- partner: Array mit Partnern/Zertifizierungen/Verbaenden.
  Format: [{"name":"WKO"}]
  Max 8. NUR was tatsaechlich auf der Website steht.

=== TEAM ===
- team: Array mit Teammitgliedern.
  Format: [{"name":"Martin Berger","rolle":"Gesch\u00e4ftsf\u00fchrer"}]
  NUR wenn Name UND Rolle/Position auf der Website stehen. Max 8.

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

    // Bundesland
    const validBL = ["wien","noe","ooe","stmk","sbg","tirol","ktn","vbg","bgld"];
    const bundesland = validBL.includes(extracted.bundesland) ? extracted.bundesland : "";

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

    // Merkmale
    const merkmale = extracted.merkmale || {};

    // Oeffnungszeiten: Claude > Structured Data
    const oeffnungszeiten = extracted.oeffnungszeiten || structuredData.openingHours || "";

    // WhatsApp: Link-Extraktion > Claude
    const finalWhatsapp = whatsappNumber || (extracted.whatsapp || "").replace(/[\s\-/]/g,"") || "";

    // Buchungslink: Link-Extraktion > Claude
    const finalBuchungslink = buchungsLink || extracted.buchungslink || "";

    // Layout-Empfehlung
    let layoutSuggestion = "standard";
    if (faq.length >= 2 || fakten.length >= 2 || partner.length >= 2) layoutSuggestion = "ausfuehrlich";
    else if (leistungen.length <= 3 && !bewertungen.length) layoutSuggestion = "kompakt";

    // Sections-Visible
    const sectionsVisible = {};
    if (faq.length > 0) sectionsVisible.faq = true;
    if (fakten.length > 0) sectionsVisible.fakten = true;
    if (partner.length > 0) sectionsVisible.partner = true;

    const duration = log.timeEnd("import");
    await log.activity(null, "import_success", {url:cleanUrl, duration, pages:pageContents.length+1, sitemap:sitemapFound, deduped:duplicateParas.size});

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
      branche: extracted.branche || "",
      leistungen, spezialisierung: extracted.spezialisierung || "",
      oeffnungszeiten_import: oeffnungszeiten,
      gut_zu_wissen: extracted.gut_zu_wissen || "",
      bewertungen, faq, fakten, partner, team,
      whatsapp: finalWhatsapp,
      buchungslink: finalBuchungslink,
      layout_suggestion: layoutSuggestion,
      sections_visible: sectionsVisible,
      facebook: socialLinks.facebook || "",
      instagram: socialLinks.instagram || "",
      linkedin: socialLinks.linkedin || "",
      tiktok: socialLinks.tiktok || "",
      merkmale,
      _meta: {pages_read: pageContents.length+1, sitemap: sitemapFound, deduped_paragraphs: duplicateParas.size, duration_ms: duration},
    });

  } catch(e) {
    await log.error("import", {message:e.message, stack:e.stack});
    return Response.json({error:"Der Import ist fehlgeschlagen. Bitte pr\u00fcfen Sie die URL und versuchen Sie es erneut."}, {status:500});
  }
}
