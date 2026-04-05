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

    const extractFromHtml = (html) => {
      if (!html) return;
      for (const m of html.matchAll(/mailto:([a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,})/gi)) allEmails.add(m[1].toLowerCase());
      for (const m of html.matchAll(/href=["']tel:([^"']+)["']/gi)) { const p=m[1].replace(/\s/g,"").replace(/%20/g,""); if(p.length>=8) allPhones.add(p); }
      for (const m of html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
        try { const ld=m[1]; for(const em of ld.matchAll(emailRegex)) allEmails.add(em[0].toLowerCase()); for(const ph of ld.matchAll(/"telephone"\s*:\s*"([^"]+)"/gi)) allPhones.add(ph[1].replace(/\s/g,"")); } catch(_){}
      }
      const vis=html.replace(/<script[\s\S]*?<\/script>/gi," ").replace(/<style[\s\S]*?<\/style>/gi," ").replace(/<[^>]+>/g," ");
      for (const m of vis.matchAll(emailRegex)) allEmails.add(m[0].toLowerCase());
      for (const m of vis.matchAll(phoneRegex)) { const p=m[0].replace(/[\s\-/]/g,""); if(p.length>=8) allPhones.add(p); }
      const hrefs=[...html.matchAll(/href=["']([^"']+)["']/gi)].map(m=>m[1]);
      for (const h of hrefs) {
        if (!socialLinks.facebook  && /facebook\.com\//i.test(h)  && !/sharer|share|login|dialog/i.test(h)) socialLinks.facebook=h;
        if (!socialLinks.instagram && /instagram\.com\//i.test(h) && !/sharer|share|login/i.test(h))        socialLinks.instagram=h;
        if (!socialLinks.linkedin  && /linkedin\.com\//i.test(h)  && !/sharer|share|login/i.test(h))        socialLinks.linkedin=h;
        if (!socialLinks.tiktok    && /tiktok\.com\//i.test(h)    && !/sharer|share|login/i.test(h))        socialLinks.tiktok=h;
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

    // Jina fuer Hauptseite (rendert JS)
    let mainText = await fetchJina(cleanUrl);
    if (!mainText || mainText.length < 100) mainText = stripHtml(mainHtml);

    if (!mainText || mainText.length < 50) {
      await log.error("import", {message:"Website nicht lesbar", url:cleanUrl});
      return Response.json({error:"Die Website konnte nicht gelesen werden. M\u00f6gliche Gr\u00fcnde: Die Seite ist passwortgesch\u00fctzt, blockiert automatische Zugriffe, oder die URL ist nicht erreichbar."}, {status:400});
    }

    /* ═══ 2. ALLE INTERNEN LINKS FINDEN ═══ */
    const allInternalLinks = new Set();
    const skipPatterns = /\.(pdf|jpg|jpeg|png|gif|svg|webp|css|js|ico|woff|woff2|ttf|eot|mp4|mp3|zip|xml|txt|json)$/i;
    const skipPaths = /\/(wp-admin|wp-content|wp-includes|cdn-cgi|assets|static|_next|\.well-known|feed|rss|sitemap|search|login|register|cart|checkout|warenkorb|kasse)\b/i;

    const collectLinks = (html, text) => {
      // Links aus HTML
      if (html) {
        for (const m of html.matchAll(/href=["']([^"'#]+)["']/gi)) {
          let href = m[1];
          if (href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("javascript:")) continue;
          if (!href.startsWith("http")) href = href.startsWith("/") ? base + href : base + "/" + href;
          try {
            const u = new URL(href);
            if (u.origin !== base) continue;
            if (skipPatterns.test(u.pathname) || skipPaths.test(u.pathname)) continue;
            if (u.pathname === "/" || u.pathname === "") continue;
            allInternalLinks.add(u.origin + u.pathname);
          } catch(_) {}
        }
      }
      // Links aus Jina-Markdown (fuer JS-Seiten)
      if (text) {
        for (const m of text.matchAll(/\[([^\]]{2,60})\]\((https?:\/\/[^\s)]+)\)/gi)) {
          try {
            const u = new URL(m[2]);
            if (u.origin !== base) continue;
            if (skipPatterns.test(u.pathname) || skipPaths.test(u.pathname)) continue;
            if (u.pathname === "/" || u.pathname === "") continue;
            allInternalLinks.add(u.origin + u.pathname);
          } catch(_) {}
        }
      }
    };

    collectLinks(mainHtml, mainText);

    // Emails/Phones aus Jina-Text
    for (const m of mainText.matchAll(emailRegex)) allEmails.add(m[0].toLowerCase());
    for (const m of mainText.matchAll(phoneRegex)) { const p=m[0].replace(/[\s\-/]/g,""); if(p.length>=8) allPhones.add(p); }

    // Standard-Pfade hinzufuegen falls nicht schon gefunden
    const standardPaths = ["/kontakt","/contact","/impressum","/leistungen","/services","/angebot",
      "/ueber-uns","/about","/team","/ueber-mich","/faq","/preise","/galerie","/partner","/referenzen"];
    for (const p of standardPaths) {
      const full = base + p;
      if (![...allInternalLinks].some(l => l.toLowerCase().includes(p.slice(1)))) {
        allInternalLinks.add(full);
      }
    }

    /* ═══ 3. ALLE UNTERSEITEN LADEN (parallel, max 15) ═══ */
    const urlsToFetch = [...allInternalLinks].slice(0, 15);
    const pageContents = [];

    await Promise.all(urlsToFetch.map(async (pageUrl) => {
      // HTML fuer Emails/Phones/Links
      const html = await fetchHtml(pageUrl, 6000);
      if (html) {
        extractFromHtml(html);
        collectLinks(html, null); // Weitere Links entdecken (2. Ebene)
      }

      // Jina fuer sauberen Text
      let text = await fetchJina(pageUrl);
      if (!text || text.length < 50) text = stripHtml(html);
      if (!text || text.length < 30) return;

      // Emails/Phones aus Text
      for (const m of text.matchAll(emailRegex)) allEmails.add(m[0].toLowerCase());
      for (const m of text.matchAll(phoneRegex)) { const p=m[0].replace(/[\s\-/]/g,""); if(p.length>=8) allPhones.add(p); }

      // Seite kategorisieren
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

    // Falls 2. Ebene neue Links ergeben hat: Noch ein paar nachladen
    const secondLevel = [...allInternalLinks].filter(u => !urlsToFetch.includes(u)).slice(0, 5);
    if (secondLevel.length > 0) {
      await Promise.all(secondLevel.map(async (pageUrl) => {
        const html = await fetchHtml(pageUrl, 5000);
        if (html) extractFromHtml(html);
        let text = await fetchJina(pageUrl);
        if (!text || text.length < 50) text = stripHtml(html);
        if (!text || text.length < 30) return;
        for (const m of text.matchAll(emailRegex)) allEmails.add(m[0].toLowerCase());
        for (const m of text.matchAll(phoneRegex)) { const p=m[0].replace(/[\s\-/]/g,""); if(p.length>=8) allPhones.add(p); }
        const path = new URL(pageUrl).pathname.toLowerCase();
        let category = "sonstige";
        if (/leistung|service|angebot|preis|schwerpunkt|behandlung|therapie/.test(path)) category = "leistungen";
        else if (/ueber|about|team/.test(path)) category = "ueberuns";
        pageContents.push({url: pageUrl, path, category, text: text.slice(0, 3000)});
      }));
    }

    /* ═══ 4. SPAM FILTERN ═══ */
    const filteredEmails = [...allEmails].filter(e =>
      !/noreply|no-reply|donotreply|support@stripe|mailer|bounce|postmaster|webmaster|siteready|wix\.com|squarespace|wordpress/i.test(e)
    );
    const filteredPhones = [...allPhones].filter(p => p.length >= 8 && p.length <= 16);

    /* ═══ 5. GESAMTTEXT AUFBAUEN ═══ */
    const anthropicKey = env.ANTHROPIC_API_KEY;
    if (!anthropicKey) return Response.json({error:"API-Konfigurationsfehler."}, {status:500});

    // Text nach Kategorie gruppieren
    const grouped = {};
    for (const p of pageContents) {
      if (!grouped[p.category]) grouped[p.category] = "";
      grouped[p.category] += "\n--- " + p.path + " ---\n" + p.text;
    }

    let fullText = "=== HAUPTSEITE ===\n" + mainText.slice(0, 5000);
    const sectionOrder = ["leistungen","ueberuns","kontakt","impressum","faq","partner","galerie","sonstige"];
    const sectionLabels = {leistungen:"LEISTUNGEN/ANGEBOT",ueberuns:"\u00dcBER UNS/TEAM",kontakt:"KONTAKT",impressum:"IMPRESSUM",faq:"FAQ",partner:"PARTNER/REFERENZEN",galerie:"GALERIE",sonstige:"WEITERE SEITEN"};

    for (const key of sectionOrder) {
      if (grouped[key]) {
        const maxLen = key === "sonstige" ? 2000 : key === "impressum" ? 4000 : 4000;
        fullText += `\n\n=== ${sectionLabels[key]} ===\n` + grouped[key].slice(0, maxLen);
      }
    }

    // Mehr Platz fuer Sonnet (bis 24k Zeichen)
    fullText = fullText.slice(0, 24000);

    const emailHint = filteredEmails.length > 0
      ? `\n\nGefundene E-Mail-Adressen: ${filteredEmails.join(", ")}\nWaehle die primaere Kontakt-E-Mail (nicht no-reply, nicht Drittanbieter).`
      : "";
    const phoneHint = filteredPhones.length > 0
      ? `\nGefundene Telefonnummern: ${filteredPhones.join(", ")}\nWaehle die primaere Kontakt-Telefonnummer.`
      : "";

    /* ═══ 6. CLAUDE SONNET EXTRAKTION ═══ */
    const claudeResp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {"Content-Type":"application/json","x-api-key":anthropicKey,"anthropic-version":"2023-06-01"},
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 4096,
        messages: [{
          role: "user",
          content: `Extrahiere aus folgendem Website-Text ALLE Daten eines oesterreichischen Unternehmens.
Du bekommst den vollstaendigen Inhalt ALLER Unterseiten. Lies alles gruendlich durch.
Antworte NUR mit einem JSON-Objekt (kein Markdown, kein Text drumherum).

OBERSTE REGEL: Nur Informationen die TATSAECHLICH im Text stehen. NICHTS erfinden.
Leere Strings "" und leere Arrays [] fuer nicht gefundene Felder.
Im Zweifel lieber leer lassen als etwas Falsches schreiben.

JSON-Felder:

=== FIRMA & KONTAKT ===
- firmenname: Offizieller Name (max 60 Zeichen)
- telefon: Format +43... (leer wenn nicht gefunden)
- email: Primaere Kontakt-E-Mail
- plz: 4-stellige Postleitzahl
- ort: Ortsname
- adresse: Strasse mit Hausnummer
- kurzbeschreibung: Was das Unternehmen macht, 1-2 Saetze, max 200 Zeichen. Aus echtem Text ableiten.
- bundesland: NUR: wien/noe/ooe/stmk/sbg/tirol/ktn/vbg/bgld

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
- leistungen: Array mit ALLEN konkreten Leistungen/Angeboten die auf der Website stehen (max 12). Suche gruendlich auf ALLEN Seiten. NUR buchbare Dienstleistungen. Formuliere klar und professionell.
- spezialisierung: Fachgebiet (z.B. "Allgemeinmedizin", "Photovoltaik")

=== OEFFNUNGSZEITEN & HINWEISE ===
- oeffnungszeiten: Oeffnungszeiten als Freitext
- gut_zu_wissen: Permanente Kundenhinweise, getrennt durch \\n. Max 5.

=== BEWERTUNGEN (nur echte!) ===
- bewertungen: Array mit Kundenbewertungen die WOERTLICH auf der Website stehen.
  Format: [{"name":"Name","text":"Bewertungstext","sterne":5}]
  Max 6. NUR echte, NICHTS erfinden.

=== FAQ (nur echte!) ===
- faq: Array mit FAQ die TATSAECHLICH auf der Website stehen.
  Format: [{"frage":"Die Frage?","antwort":"Die Antwort."}]
  Max 8. NUR echte Fragen+Antworten von der Website.

=== ZAHLEN & FAKTEN (nur echte!) ===
- fakten: Array mit Zahlen die TATSAECHLICH auf der Website stehen.
  Format: [{"zahl":"15+","label":"Jahre Erfahrung"}]
  z.B. "Ueber 15 Jahre" -> {"zahl":"15+","label":"Jahre Erfahrung"}
  Max 4.

=== PARTNER & ZERTIFIKATE (nur echte!) ===
- partner: Array mit Partnern/Zertifizierungen/Verbaenden von der Website.
  Format: [{"name":"WKO"}]
  z.B. WKO, TÜV, ISO, Innungsmitglied, Partnerlogos. Max 8.

=== TEAM ===
- team: Array mit Teammitgliedern die auf der Website stehen.
  Format: [{"name":"Martin Berger","rolle":"Geschäftsführer"}]
  NUR wenn Name UND Rolle/Position auf der Website stehen. Max 8.

=== MERKMALE ===
- merkmale: Objekt. NUR auf true wenn KLAR im Text erwaehnt.
  Keys: kassenvertrag ("alle_kassen"/"wahlarzt"/"privat"/"oegk"/"bvaeb"/"svs"), barrierefrei, parkplaetze, notdienst, meisterbetrieb, terminvereinbarung, erstgespraech_gratis, online_beratung, hausbesuche, kartenzahlung, ratenzahlung, gutscheine, zertifiziert, kostenvoranschlag, foerderungsberatung, gastgarten, takeaway, lieferservice

Website-Text (${pageContents.length + 1} Seiten gelesen):
${fullText}${emailHint}${phoneHint}`,
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

    /* ═══ 7. NORMALISIEREN & VALIDIEREN ═══ */

    // Unternehmensform
    const ufRaw = (extracted.unternehmensform||"").toLowerCase().replace(/[\s.]/g,"");
    const ufMap = {"eu":"eu","einzelunternehmen":"einzelunternehmen","gmbh":"gmbh","og":"og","kg":"kg","ag":"ag","verein":"verein","gesnbr":"gesnbr","gesbr":"gesnbr"};
    const unternehmensform = ufMap[ufRaw] || (ufRaw.includes("gmbh")?"gmbh":ufRaw.includes("eu")?"eu":"");

    // Email: Domain-Match > Claude > erster Fund
    const siteDomain = new URL(cleanUrl).hostname.replace(/^www\./,"");
    const domainMatch = filteredEmails.find(e => e.split("@")[1] === siteDomain);
    const claudeEmail = (extracted.email||"").toLowerCase();
    const finalEmail = domainMatch || (filteredEmails.includes(claudeEmail)?claudeEmail:"") || filteredEmails[0] || "";

    // Telefon: tel:-Link > Claude
    const claudePhone = (extracted.telefon||"").replace(/[\s\-/]/g,"");
    const finalPhone = filteredPhones[0] || claudePhone || "";

    // PLZ
    const plzRaw = (extracted.plz||"").replace(/\D/g,"");
    const plz = plzRaw.length === 4 ? plzRaw : "";

    // Bundesland
    const validBL = ["wien","noe","ooe","stmk","sbg","tirol","ktn","vbg","bgld"];
    const bundesland = validBL.includes(extracted.bundesland) ? extracted.bundesland : "";

    // Leistungen (max 12, Duplikate raus)
    const leistungen = Array.isArray(extracted.leistungen)
      ? [...new Set(extracted.leistungen.map(l=>l?.trim()).filter(Boolean))].slice(0,12)
      : [];

    // Bewertungen
    const bewertungen = Array.isArray(extracted.bewertungen)
      ? extracted.bewertungen.filter(b=>b&&typeof b.text==="string"&&b.text.trim())
        .map(b=>({name:(b.name||"").slice(0,60),text:b.text.trim().slice(0,500),sterne:Math.min(Math.max(parseInt(b.sterne)||0,0),5)}))
        .slice(0,6)
      : [];

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

    // Layout-Empfehlung
    let layoutSuggestion = "standard";
    const hasRichContent = faq.length >= 2 || fakten.length >= 2 || partner.length >= 2;
    const hasMinimalContent = leistungen.length <= 3 && !bewertungen.length;
    if (hasRichContent) layoutSuggestion = "ausfuehrlich";
    else if (hasMinimalContent) layoutSuggestion = "kompakt";

    // Sections-Visible
    const sectionsVisible = {};
    if (faq.length > 0) sectionsVisible.faq = true;
    if (fakten.length > 0) sectionsVisible.fakten = true;
    if (partner.length > 0) sectionsVisible.partner = true;

    const duration = log.timeEnd("import");
    await log.activity(null, "import_success", {url:cleanUrl, duration, pages:pageContents.length+1, fields:Object.keys(extracted).length});

    return Response.json({
      firmenname: (extracted.firmenname||"").slice(0,60),
      telefon: finalPhone,
      email: finalEmail,
      plz,
      ort: extracted.ort || "",
      adresse: extracted.adresse || "",
      kurzbeschreibung: (extracted.kurzbeschreibung||"").slice(0,200),
      bundesland,
      unternehmensform,
      uid: extracted.uid || "",
      firmenbuchnummer: extracted.firmenbuchnummer || "",
      firmenbuchgericht: extracted.firmenbuchgericht || "",
      gisazahl: extracted.gisazahl || "",
      branche: extracted.branche || "",
      leistungen,
      spezialisierung: extracted.spezialisierung || "",
      oeffnungszeiten_import: extracted.oeffnungszeiten || "",
      gut_zu_wissen: extracted.gut_zu_wissen || "",
      bewertungen,
      faq,
      fakten,
      partner,
      team,
      layout_suggestion: layoutSuggestion,
      sections_visible: sectionsVisible,
      facebook: socialLinks.facebook || "",
      instagram: socialLinks.instagram || "",
      linkedin: socialLinks.linkedin || "",
      tiktok: socialLinks.tiktok || "",
      merkmale,
      _meta: {pages_read: pageContents.length + 1, duration_ms: duration},
    });

  } catch(e) {
    await log.error("import", {message:e.message, stack:e.stack});
    return Response.json({error:"Der Import ist fehlgeschlagen. Bitte pr\u00fcfen Sie die URL und versuchen Sie es erneut."}, {status:500});
  }
}
