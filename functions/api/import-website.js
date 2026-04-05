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

    /* ═══ 1. HAUPTSEITE HTML LADEN (fuer Links, Emails, Social, Telefon) ═══ */
    let mainHtml = "";
    try {
      const r = await fetch(cleanUrl, {
        headers: {"User-Agent": "Mozilla/5.0 (compatible; SiteReady/1.0)", "Accept": "text/html", "Accept-Language": "de-AT,de;q=0.9"},
        redirect: "follow", signal: AbortSignal.timeout(10000),
      });
      if (r.ok) mainHtml = await r.text();
    } catch(e) { /* ignore */ }

    /* ═══ 2. STRUKTURIERTE DATEN AUS HTML EXTRAHIEREN ═══ */
    const emailRegex = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g;
    const phoneRegex = /(?:\+43|0043|0)\s*(?:\d[\s\-/]*){6,12}\d/g;
    const allEmails = new Set();
    const allPhones = new Set();
    const socialLinks = {facebook:"", instagram:"", linkedin:"", tiktok:""};

    const extractFromHtml = (html) => {
      if (!html) return;
      // mailto: Links
      for (const m of html.matchAll(/mailto:([a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,})/gi)) {
        allEmails.add(m[1].toLowerCase());
      }
      // tel: Links
      for (const m of html.matchAll(/href=["']tel:([^"']+)["']/gi)) {
        const phone = m[1].replace(/\s/g, "").replace(/%20/g, "");
        if (phone.length >= 8) allPhones.add(phone);
      }
      // JSON-LD Structured Data
      for (const m of html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
        try {
          const ld = m[1];
          for (const em of ld.matchAll(emailRegex)) allEmails.add(em[0].toLowerCase());
          for (const ph of ld.matchAll(/"telephone"\s*:\s*"([^"]+)"/gi)) allPhones.add(ph[1].replace(/\s/g, ""));
        } catch(_) {}
      }
      // Plain-text Emails + Phones
      const visText = html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ");
      for (const m of visText.matchAll(emailRegex)) allEmails.add(m[0].toLowerCase());
      for (const m of visText.matchAll(phoneRegex)) {
        const phone = m[0].replace(/[\s\-/]/g, "");
        if (phone.length >= 8) allPhones.add(phone);
      }
      // Social Media Links
      const hrefs = [...html.matchAll(/href=["']([^"']+)["']/gi)].map(m => m[1]);
      for (const h of hrefs) {
        if (!socialLinks.facebook  && /facebook\.com\//i.test(h)  && !/sharer|share|login|dialog/i.test(h)) socialLinks.facebook  = h;
        if (!socialLinks.instagram && /instagram\.com\//i.test(h) && !/sharer|share|login/i.test(h))        socialLinks.instagram = h;
        if (!socialLinks.linkedin  && /linkedin\.com\//i.test(h)  && !/sharer|share|login/i.test(h))        socialLinks.linkedin  = h;
        if (!socialLinks.tiktok    && /tiktok\.com\//i.test(h)    && !/sharer|share|login/i.test(h))        socialLinks.tiktok    = h;
      }
    };

    extractFromHtml(mainHtml);

    /* ═══ 3. ALLE RELEVANTEN UNTERSEITEN FINDEN ═══ */
    const subpagePatterns = [
      /kontakt|contact/i, /impressum|imprint|legal/i, /leistungen|services|angebot/i,
      /ueber-uns|about|team/i, /preise|pricing/i, /galerie|gallery|portfolio/i,
      /schwerpunkt/i, /angebot/i, /behandlung/i, /therapie/i, /faq|haeufige/i, /partner|referenz|zertifik/i,
    ];
    const linkTextPatterns = /kontakt|impressum|leistung|service|angebot|\u00fcber\s*(uns|mich)|about|team|preis|schwerpunkt|behandlung|therapie|galerie|portfolio|faq|h\u00e4ufig|partner|referenz|zertifik/i;
    const foundLinks = new Set();
    if (mainHtml) {
      for (const m of mainHtml.matchAll(/href=["']([^"'#]+)["']/gi)) {
        let href = m[1];
        if (href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("javascript:")) continue;
        if (!href.startsWith("http")) href = href.startsWith("/") ? base + href : base + "/" + href;
        try {
          const u = new URL(href);
          if (u.origin !== base) continue;
          const path = u.pathname.toLowerCase();
          if (subpagePatterns.some(p => p.test(path))) foundLinks.add(href);
        } catch(_) {}
      }
      for (const m of mainHtml.matchAll(/<a[^>]+href=["']([^"'#]+)["'][^>]*>([^<]{2,40})<\/a>/gi)) {
        const href = m[1];
        const text = m[2].trim();
        if (linkTextPatterns.test(text)) {
          let fullUrl = href;
          if (!fullUrl.startsWith("http")) fullUrl = fullUrl.startsWith("/") ? base + fullUrl : base + "/" + fullUrl;
          try {
            const u = new URL(fullUrl);
            if (u.origin === base) foundLinks.add(fullUrl);
          } catch(_) {}
        }
      }
    }

    /* ═══ 4. JINA ALS PRIMAERE TEXT-QUELLE (rendert auch JS-Seiten) ═══ */
    const fetchJina = async (pageUrl) => {
      try {
        const r = await fetch("https://r.jina.ai/" + pageUrl, {
          headers: {"Accept": "text/plain", "X-Return-Format": "text"},
          signal: AbortSignal.timeout(15000),
        });
        if (r.ok) {
          const text = await r.text();
          // Jina gibt manchmal Fehlermeldungen statt Inhalt zurueck
          if (text.includes("Unable to") || text.includes("Error:") || text.length < 30) return "";
          return text;
        }
      } catch(e) {}
      return "";
    };

    // Hauptseite via Jina
    let mainText = await fetchJina(cleanUrl);

    // Fallback: HTML-Strip wenn Jina fehlschlaegt
    if (!mainText || mainText.length < 100) {
      if (mainHtml) {
        mainText = mainHtml
          .replace(/<script[\s\S]*?<\/script>/gi, " ")
          .replace(/<style[\s\S]*?<\/style>/gi, " ")
          .replace(/<[^>]+>/g, " ")
          .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
          .replace(/\s{2,}/g, " ").trim();
      }
    }

    if (!mainText || mainText.length < 50) {
      await log.error("import", {message: "Website nicht lesbar", url: cleanUrl});
      return Response.json({error: "Die Website konnte nicht gelesen werden. M\u00f6gliche Gr\u00fcnde: Die Seite ist passwortgesch\u00fctzt, blockiert automatische Zugriffe, oder die URL ist nicht erreichbar. Sie k\u00f6nnen die Daten manuell eingeben oder das Problem unter support@siteready.at melden \u2014 wir schauen uns an, woran es liegt."}, {status: 400});
    }

    // Links aus Jina-Haupttext extrahieren (fuer JS-Seiten mit Wix-Routing)
    if (mainText) {
      for (const m of mainText.matchAll(/\[([^\]]{2,40})\]\((https?:\/\/[^\s)]+)\)/gi)) {
        const text = m[1];
        const href = m[2];
        if (linkTextPatterns.test(text)) {
          try {
            const u = new URL(href);
            if (u.origin === base) foundLinks.add(href);
          } catch(_) {}
        }
      }
    }

    // Emails + Phones auch aus Jina-Text sammeln
    for (const m of mainText.matchAll(emailRegex)) allEmails.add(m[0].toLowerCase());
    for (const m of mainText.matchAll(phoneRegex)) {
      const phone = m[0].replace(/[\s\-/]/g, "");
      if (phone.length >= 8) allPhones.add(phone);
    }

    /* ═══ 5. UNTERSEITEN LADEN (parallel, max 8) ═══ */
    const subpageTexts = {};
    const subpageUrls = [...foundLinks].slice(0, 5);

    const standardPaths = {
      kontakt: ["/kontakt", "/contact", "/kontakt.html"],
      impressum: ["/impressum", "/impressum.html", "/de/impressum"],
      leistungen: ["/leistungen", "/services", "/angebot", "/leistungen.html", "/schwerpunkte", "/behandlungen", "/preise"],
      ueberuns: ["/ueber-uns", "/about", "/about-us", "/team", "/ueber-mich"],
      faq: ["/faq", "/haeufige-fragen", "/fragen"],
    };

    for (const [key, paths] of Object.entries(standardPaths)) {
      if (!subpageUrls.some(u => paths.some(p => u.toLowerCase().includes(p.replace("/", ""))))) {
        for (const p of paths) {
          subpageUrls.push(base + p);
          break;
        }
      }
    }

    const uniqueUrls = [...new Set(subpageUrls)].slice(0, 8);

    await Promise.all(uniqueUrls.map(async (pageUrl) => {
      try {
        const r = await fetch(pageUrl, {
          headers: {"User-Agent": "Mozilla/5.0 (compatible; SiteReady/1.0)", "Accept": "text/html"},
          redirect: "follow", signal: AbortSignal.timeout(6000),
        });
        if (r.ok) {
          const html = await r.text();
          extractFromHtml(html);
        }
      } catch(e) {}

      const text = await fetchJina(pageUrl);
      if (text && text.length > 50) {
        for (const m of text.matchAll(emailRegex)) allEmails.add(m[0].toLowerCase());
        for (const m of text.matchAll(phoneRegex)) {
          const phone = m[0].replace(/[\s\-/]/g, "");
          if (phone.length >= 8) allPhones.add(phone);
        }
        const path = new URL(pageUrl).pathname.toLowerCase();
        if (/kontakt|contact/.test(path)) subpageTexts.kontakt = text.slice(0, 3000);
        else if (/impressum|imprint|legal/.test(path)) subpageTexts.impressum = text.slice(0, 4000);
        else if (/leistungen|services|angebot|preise|schwerpunkt|behandlung|therapie/.test(path)) subpageTexts.leistungen = (subpageTexts.leistungen || "") + "\n" + text.slice(0, 3000);
        else if (/ueber|about|team/.test(path)) subpageTexts.ueberuns = text.slice(0, 3000);
        else if (/faq|haeufig|fragen/.test(path)) subpageTexts.faq = text.slice(0, 3000);
        else if (/partner|referenz|zertifik/.test(path)) subpageTexts.partner = text.slice(0, 2000);
        else subpageTexts.sonstige = (subpageTexts.sonstige || "") + "\n" + text.slice(0, 1500);
      }
    }));

    /* ═══ 6. SPAM FILTERN ═══ */
    const filteredEmails = [...allEmails].filter(e =>
      !/noreply|no-reply|donotreply|support@stripe|mailer|bounce|postmaster|webmaster|siteready|wix\.com|squarespace/i.test(e)
    );
    const filteredPhones = [...allPhones].filter(p => p.length >= 8 && p.length <= 16);

    /* ═══ 7. GESAMTTEXT FUER CLAUDE ZUSAMMENBAUEN ═══ */
    const anthropicKey = env.ANTHROPIC_API_KEY;
    if (!anthropicKey) return Response.json({error: "API-Konfigurationsfehler."}, {status: 500});

    let fullText = "=== HAUPTSEITE ===\n" + mainText.slice(0, 4000);
    if (subpageTexts.leistungen) fullText += "\n\n=== LEISTUNGEN ===\n" + subpageTexts.leistungen;
    if (subpageTexts.ueberuns) fullText += "\n\n=== UEBER UNS ===\n" + subpageTexts.ueberuns;
    if (subpageTexts.kontakt) fullText += "\n\n=== KONTAKT ===\n" + subpageTexts.kontakt;
    if (subpageTexts.impressum) fullText += "\n\n=== IMPRESSUM ===\n" + subpageTexts.impressum;
    if (subpageTexts.faq) fullText += "\n\n=== FAQ-SEITE ===\n" + subpageTexts.faq;
    if (subpageTexts.partner) fullText += "\n\n=== PARTNER/REFERENZEN ===\n" + subpageTexts.partner;
    if (subpageTexts.sonstige) fullText += "\n\n=== WEITERE SEITEN ===\n" + subpageTexts.sonstige.slice(0, 2000);

    // Sonnet fuer bessere Extraktion (zuverlaessiger als Haiku bei komplexen Strukturen)
    fullText = fullText.slice(0, 16000);

    const emailHint = filteredEmails.length > 0
      ? `\n\nGefundene E-Mail-Adressen: ${filteredEmails.join(", ")}\nWaehle die primaere Kontakt-E-Mail (nicht no-reply, nicht Drittanbieter).`
      : "";
    const phoneHint = filteredPhones.length > 0
      ? `\nGefundene Telefonnummern: ${filteredPhones.join(", ")}\nWaehle die primaere Kontakt-Telefonnummer.`
      : "";

    /* ═══ 8. CLAUDE SONNET EXTRAKTION ═══ */
    const claudeResp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {"Content-Type": "application/json", "x-api-key": anthropicKey, "anthropic-version": "2023-06-01"},
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 4096,
        messages: [{
          role: "user",
          content: `Extrahiere aus folgendem Website-Text die Daten eines oesterreichischen Unternehmens.
Antworte NUR mit einem JSON-Objekt (kein Markdown, kein Text drumherum).

OBERSTE REGEL: Nur Informationen extrahieren die TATSAECHLICH im Text stehen. NICHTS erfinden, vermuten oder halluzinieren. Leere Strings "" und leere Arrays [] fuer nicht gefundene Felder. Im Zweifel lieber leer lassen als etwas Falsches angeben.

Oesterreichisches Format fuer Telefon (+43...), PLZ (4-stellig), etc.

JSON-Felder:

=== FIRMA & KONTAKT ===
- firmenname: Offizieller Name (max 60 Zeichen)
- telefon: Telefonnummer im Format +43... (leer wenn nicht gefunden)
- email: Primaere Kontakt-E-Mail (leer wenn nicht gefunden)
- plz: 4-stellige Postleitzahl (leer wenn nicht gefunden)
- ort: Ortsname (leer wenn nicht gefunden)
- adresse: Strasse mit Hausnummer (leer wenn nicht gefunden)
- kurzbeschreibung: Was das Unternehmen macht, 1-2 Saetze (max 200 Zeichen). Nur aus echtem Text ableiten, nicht erfinden.
- bundesland: NUR einer dieser Werte: wien/noe/ooe/stmk/sbg/tirol/ktn/vbg/bgld (leer wenn nicht erkennbar)

=== RECHTLICHES (aus Impressum) ===
- unternehmensform: NUR einer dieser Werte: eu/einzelunternehmen/gmbh/og/kg/ag/verein/gesnbr (leer wenn nicht erkennbar)
- uid: UID-Nummer ATU... (leer wenn nicht gefunden)
- firmenbuchnummer: FN... (leer wenn nicht gefunden)
- firmenbuchgericht: z.B. HG Wien (leer wenn nicht gefunden)
- gisazahl: Nur Ziffern (leer wenn nicht gefunden)

=== BRANCHE & LEISTUNGEN ===
- branche: NUR einer dieser Werte (waehle den passendsten):
  Handwerk: elektro/installateur/maler/tischler/fliesenleger/schlosser/dachdecker/zimmerei/maurer/bodenleger/glaser/gaertner/klima/reinigung/baumeister
  Kosmetik: friseur/kosmetik/nagel/massage/tattoo/fusspflege/permanent_makeup
  Gastro: restaurant/cafe/baeckerei/catering
  Gesundheit: arzt/zahnarzt/physiotherapie/psychotherapie/tierarzt/apotheke/optiker/heilpraktiker
  Dienstleistung: steuerberater/rechtsanwalt/fotograf/versicherung/immobilien/hausverwaltung/umzug/eventplanung
  Bildung: fahrschule/nachhilfe/musikschule/trainer/yoga
  Sonstige: sonstige (nur wenn KEINE der obigen passt)
  WICHTIG: Arzt-Ordinationen = "arzt". Immer eine Branche zuordnen wenn moeglich!
- leistungen: Array mit max 8 konkreten Leistungen/Angeboten. NUR sinnvolle Dienstleistungen die ein Kunde buchen wuerde. Keine Navigationspunkte, keine internen Begriffe. Formuliere klar und professionell. Leeres Array wenn keine erkennbar.
- spezialisierung: Fachgebiet (z.B. "Allgemeinmedizin", "Photovoltaik"). Leer wenn nicht erkennbar.

=== OEFFNUNGSZEITEN & HINWEISE ===
- oeffnungszeiten: Oeffnungszeiten als Freitext. Leer wenn nicht gefunden.
- gut_zu_wissen: Permanente Kundenhinweise von der Website, getrennt durch \\n. Max 5. Leer wenn nichts Relevantes.

=== BEWERTUNGEN (nur echte von der Website!) ===
- bewertungen: Array mit max 5 Kundenbewertungen/Testimonials die WOERTLICH auf der Website stehen.
  Format: [{"name":"Kundenname","text":"Bewertungstext","sterne":5}]
  Sterne 1-5, 0 wenn nicht erkennbar. NUR echte Bewertungen, NICHTS erfinden. Leeres Array wenn keine gefunden.

=== FAQ (nur echte von der Website!) ===
- faq: Array mit FAQ-Eintraegen die TATSAECHLICH auf der Website stehen.
  Format: [{"frage":"Die Frage?","antwort":"Die Antwort."}]
  NUR Fragen+Antworten die woertlich auf der Website stehen. NICHTS erfinden.
  Leeres Array wenn keine FAQ-Sektion auf der Website existiert.

=== ZAHLEN & FAKTEN (nur echte!) ===
- fakten: Array mit beeindruckenden Zahlen die TATSAECHLICH auf der Website stehen.
  Format: [{"zahl":"15+","label":"Jahre Erfahrung"}]
  Beispiele: "Über 15 Jahre Erfahrung" -> {"zahl":"15+","label":"Jahre Erfahrung"}
  "2.000 zufriedene Kunden" -> {"zahl":"2.000+","label":"Zufriedene Kunden"}
  Max 4 Eintraege. NUR was wirklich auf der Website steht. Leeres Array wenn keine solchen Zahlen gefunden.

=== PARTNER & ZERTIFIKATE (nur echte!) ===
- partner: Array mit Partnern, Zertifizierungen oder Verbaenden die auf der Website erwaehnt werden.
  Format: [{"name":"WKO"},{"name":"TÜV Austria"}]
  Beispiele: WKO, TÜV, ISO-Zertifizierungen, Partnerlogos, Innungsmitgliedschaften.
  NUR was tatsaechlich auf der Website steht. Leeres Array wenn keine gefunden.

=== MERKMALE (Features) ===
- merkmale: Objekt mit erkannten Merkmalen. NUR auf true setzen wenn KLAR im Text erwaehnt.
  Keys: kassenvertrag ("alle_kassen"/"wahlarzt"/"privat"/"oegk"/"bvaeb"/"svs"), barrierefrei, parkplaetze, notdienst, meisterbetrieb, terminvereinbarung, erstgespraech_gratis, online_beratung, hausbesuche, kartenzahlung, ratenzahlung, gutscheine, zertifiziert, kostenvoranschlag, foerderungsberatung, gastgarten, takeaway, lieferservice

Website-Text:
${fullText}${emailHint}${phoneHint}`,
        }],
      }),
    });

    if (!claudeResp.ok) {
      const errText = await claudeResp.text();
      await log.error("import", {message: "Claude API Fehler: " + errText.slice(0, 500), url: cleanUrl});
      return Response.json({error: "Die Analyse der Website ist fehlgeschlagen. Bitte versuchen Sie es erneut oder melden Sie das Problem unter support@siteready.at"}, {status: 500});
    }

    const claudeData = await claudeResp.json();
    const rawContent = claudeData.content?.[0]?.text || "{}";

    let extracted;
    try {
      const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
      extracted = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
    } catch(e) {
      // Zweiter Versuch: Code-Block entfernen
      try {
        const codeBlock = rawContent.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        if (codeBlock) extracted = JSON.parse(codeBlock[1]);
        else extracted = {};
      } catch(e2) {
        extracted = {};
      }
    }

    /* ═══ 9. DATEN NORMALISIEREN UND VALIDIEREN ═══ */

    // Unternehmensform normalisieren
    const ufRaw = (extracted.unternehmensform || "").toLowerCase().replace(/[\s.]/g, "");
    const ufMap = {"eu":"eu","einzelunternehmen":"einzelunternehmen","gmbh":"gmbh","og":"og","kg":"kg","ag":"ag","verein":"verein","gesnbr":"gesnbr","gesbr":"gesnbr"};
    const unternehmensform = ufMap[ufRaw] || (ufRaw.includes("gmbh")?"gmbh":ufRaw.includes("eu")?"eu":ufRaw.includes("einzelunternehmen")?"einzelunternehmen":"");

    // Email: Domain-Match priorisieren
    const siteDomain = new URL(cleanUrl).hostname.replace(/^www\./, "");
    const domainMatch = filteredEmails.find(e => e.split("@")[1] === siteDomain);
    const claudeEmail = (extracted.email || "").toLowerCase();
    const finalEmail = domainMatch
      || (filteredEmails.includes(claudeEmail) ? claudeEmail : "")
      || filteredEmails[0]
      || "";

    // Telefon: tel:-Link priorisieren, dann Claude
    const claudePhone = (extracted.telefon || "").replace(/[\s\-/]/g, "");
    const finalPhone = filteredPhones[0] || claudePhone || "";

    // PLZ validieren
    const plzRaw = (extracted.plz || "").replace(/\D/g, "");
    const plz = plzRaw.length === 4 ? plzRaw : "";

    // Bundesland validieren
    const validBundeslaender = ["wien","noe","ooe","stmk","sbg","tirol","ktn","vbg","bgld"];
    const bundesland = validBundeslaender.includes(extracted.bundesland) ? extracted.bundesland : "";

    // Leistungen: Duplikate entfernen, leere raus
    const leistungen = Array.isArray(extracted.leistungen)
      ? [...new Set(extracted.leistungen.map(l => l?.trim()).filter(Boolean))].slice(0, 8)
      : [];

    // Bewertungen validieren
    const bewertungen = Array.isArray(extracted.bewertungen)
      ? extracted.bewertungen.filter(b => b && typeof b.text === "string" && b.text.trim())
        .map(b => ({name: (b.name || "").slice(0, 60), text: b.text.trim().slice(0, 500), sterne: Math.min(Math.max(parseInt(b.sterne) || 0, 0), 5)}))
        .slice(0, 5)
      : [];

    // FAQ validieren
    const faq = Array.isArray(extracted.faq)
      ? extracted.faq.filter(f => f && typeof f.frage === "string" && typeof f.antwort === "string" && f.frage.trim() && f.antwort.trim())
        .map(f => ({frage: f.frage.trim().slice(0, 200), antwort: f.antwort.trim().slice(0, 500)}))
        .slice(0, 8)
      : [];

    // Fakten validieren
    const fakten = Array.isArray(extracted.fakten)
      ? extracted.fakten.filter(f => f && typeof f.zahl === "string" && typeof f.label === "string" && f.zahl.trim() && f.label.trim())
        .map(f => ({zahl: f.zahl.trim().slice(0, 20), label: f.label.trim().slice(0, 60)}))
        .slice(0, 4)
      : [];

    // Partner validieren
    const partner = Array.isArray(extracted.partner)
      ? extracted.partner.filter(p => p && typeof p.name === "string" && p.name.trim())
        .map(p => ({name: p.name.trim().slice(0, 60)}))
        .slice(0, 8)
      : [];

    // Merkmale extrahieren
    const merkmale = extracted.merkmale || {};

    // Layout-Empfehlung basierend auf Inhaltsmenge
    let layoutSuggestion = "standard";
    const hasRichContent = faq.length >= 2 || fakten.length >= 2 || partner.length >= 2;
    const hasMinimalContent = leistungen.length <= 3 && !bewertungen.length;
    if (hasRichContent) layoutSuggestion = "ausfuehrlich";
    else if (hasMinimalContent) layoutSuggestion = "kompakt";

    // Sections-Visible basierend auf extrahierten Daten
    const sectionsVisible = {};
    if (faq.length > 0) sectionsVisible.faq = true;
    if (fakten.length > 0) sectionsVisible.fakten = true;
    if (partner.length > 0) sectionsVisible.partner = true;

    const duration = log.timeEnd("import");
    await log.activity(null, "import_success", {url: cleanUrl, duration, fields: Object.keys(extracted).length});

    return Response.json({
      firmenname: (extracted.firmenname || "").slice(0, 60),
      telefon: finalPhone,
      email: finalEmail,
      plz,
      ort: extracted.ort || "",
      adresse: extracted.adresse || "",
      kurzbeschreibung: (extracted.kurzbeschreibung || "").slice(0, 200),
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
      layout_suggestion: layoutSuggestion,
      sections_visible: sectionsVisible,
      facebook:  socialLinks.facebook  || "",
      instagram: socialLinks.instagram || "",
      linkedin:  socialLinks.linkedin  || "",
      tiktok:    socialLinks.tiktok    || "",
      merkmale,
    });

  } catch(e) {
    await log.error("import", {message: e.message, stack: e.stack});
    return Response.json({error: "Der Import ist fehlgeschlagen. Bitte pr\u00fcfen Sie die URL und versuchen Sie es erneut. Bei wiederholtem Fehler melden Sie sich unter support@siteready.at"}, {status: 500});
  }
}
