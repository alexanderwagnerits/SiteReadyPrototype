export async function onRequestPost({request, env}) {
  try {
    const {url} = await request.json();
    if (!url) return Response.json({error: "URL fehlt"}, {status: 400});

    let cleanUrl = url.trim();
    if (!cleanUrl.startsWith("http")) cleanUrl = "https://" + cleanUrl;
    const base = new URL(cleanUrl).origin;

    // 1. Hauptseite als HTML laden
    let mainHtml = "";
    let pageText = "";
    try {
      const r = await fetch(cleanUrl, {
        headers: {"User-Agent": "Mozilla/5.0", "Accept": "text/html", "Accept-Language": "de-AT,de;q=0.9"},
        redirect: "follow", signal: AbortSignal.timeout(10000),
      });
      if (r.ok) mainHtml = await r.text();
    } catch(e) { /* ignore */ }

    // Alle E-Mail-Adressen aus HTML sammeln (mailto + plain text)
    const emailRegex = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g;
    const allEmails = new Set();
    if (mainHtml) {
      // mailto: Links
      for (const m of mainHtml.matchAll(/mailto:([a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,})/gi)) {
        allEmails.add(m[1].toLowerCase());
      }
      // Plain-text Emails im sichtbaren Inhalt
      const visibleText = mainHtml
        .replace(/<script[\s\S]*?<\/script>/gi, " ")
        .replace(/<style[\s\S]*?<\/style>/gi, " ")
        .replace(/<[^>]+>/g, " ");
      for (const m of visibleText.matchAll(emailRegex)) {
        allEmails.add(m[0].toLowerCase());
      }
    }

    // Social Media Links direkt aus HTML extrahieren
    const socialLinks = {facebook:"", instagram:"", linkedin:"", tiktok:""};
    if (mainHtml) {
      const hrefs = [...mainHtml.matchAll(/href=["']([^"']+)["']/gi)].map(m => m[1]);
      for (const h of hrefs) {
        if (!socialLinks.facebook  && /facebook\.com\//i.test(h)  && !/sharer|share|login|dialog/i.test(h)) socialLinks.facebook  = h;
        if (!socialLinks.instagram && /instagram\.com\//i.test(h) && !/sharer|share|login/i.test(h))        socialLinks.instagram = h;
        if (!socialLinks.linkedin  && /linkedin\.com\//i.test(h)  && !/sharer|share|login/i.test(h))        socialLinks.linkedin  = h;
        if (!socialLinks.tiktok    && /tiktok\.com\//i.test(h)    && !/sharer|share|login/i.test(h))        socialLinks.tiktok    = h;
      }
    }

    // Impressum-Link aus HTML-Links extrahieren
    let impressumUrl = "";
    if (mainHtml) {
      const linkMatches = [...mainHtml.matchAll(/href=["']([^"']+)["']/gi)];
      for (const m of linkMatches) {
        const href = m[1];
        if (/impressum|imprint|rechtliches|legal/i.test(href)) {
          impressumUrl = href.startsWith("http") ? href : href.startsWith("/") ? base + href : base + "/" + href;
          break;
        }
      }
      if (!impressumUrl) {
        const anchorMatches = [...mainHtml.matchAll(/<a[^>]+href=["']([^"']+)["'][^>]*>([^<]+)<\/a>/gi)];
        for (const m of anchorMatches) {
          if (/impressum|imprint/i.test(m[2])) {
            const href = m[1];
            impressumUrl = href.startsWith("http") ? href : href.startsWith("/") ? base + href : base + "/" + href;
            break;
          }
        }
      }
    }

    // Hauptseiten-Text aus HTML
    if (mainHtml) {
      pageText = mainHtml
        .replace(/<script[\s\S]*?<\/script>/gi, " ")
        .replace(/<style[\s\S]*?<\/style>/gi, " ")
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
        .replace(/\s{2,}/g, " ").trim();
    }

    // Fallback: Jina fuer Hauptseite
    if (!pageText || pageText.length < 100) {
      try {
        const r = await fetch("https://r.jina.ai/" + cleanUrl, {
          headers: {"Accept": "text/plain", "X-Return-Format": "text"},
          signal: AbortSignal.timeout(10000),
        });
        if (r.ok) pageText = await r.text();
      } catch(e) { /* ignore */ }
    }

    if (!pageText || pageText.length < 50) {
      return Response.json({error: "Website konnte nicht geladen werden."}, {status: 400});
    }

    // Emails aus pageText extrahieren (fängt auch JS-gerenderte Emails via Jina)
    for (const m of pageText.matchAll(emailRegex)) {
      allEmails.add(m[0].toLowerCase());
    }

    // Kontakt-Seite fetchen (zusaetzliche Email-Quelle)
    const kontaktTargets = ["/kontakt", "/contact", "/kontakt.html", "/contact.html", "/de/kontakt"].map(p => base + p);
    for (const kUrl of kontaktTargets) {
      try {
        const r = await fetch(kUrl, {
          headers: {"User-Agent": "Mozilla/5.0", "Accept": "text/html"},
          redirect: "follow", signal: AbortSignal.timeout(6000),
        });
        if (r.ok) {
          const html = await r.text();
          for (const m of html.matchAll(/mailto:([a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,})/gi)) {
            allEmails.add(m[1].toLowerCase());
          }
          const visText = html
            .replace(/<script[\s\S]*?<\/script>/gi, " ")
            .replace(/<style[\s\S]*?<\/style>/gi, " ")
            .replace(/<[^>]+>/g, " ");
          for (const m of visText.matchAll(emailRegex)) {
            allEmails.add(m[0].toLowerCase());
          }
          break; // erste erfolgreiche Kontakt-Seite reicht
        }
      } catch(e) { /* ignore */ }
    }

    // Impressum laden
    let impressumText = "";
    const impressumTargets = impressumUrl
      ? [impressumUrl]
      : ["/impressum", "/index.php/impressum", "/impressum.html", "/de/impressum", "/rechtliches/impressum", "/ueber-uns/impressum"].map(p => base + p);

    for (const impUrl of impressumTargets) {
      try {
        const r = await fetch(impUrl, {
          headers: {"User-Agent": "Mozilla/5.0", "Accept": "text/html"},
          redirect: "follow", signal: AbortSignal.timeout(8000),
        });
        if (r.ok) {
          const html = await r.text();
          // Auch Impressum-Emails sammeln
          for (const m of html.matchAll(/mailto:([a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,})/gi)) {
            allEmails.add(m[1].toLowerCase());
          }
          const impVisText = html
            .replace(/<script[\s\S]*?<\/script>/gi, " ")
            .replace(/<style[\s\S]*?<\/style>/gi, " ")
            .replace(/<[^>]+>/g, " ");
          for (const m of impVisText.matchAll(emailRegex)) {
            allEmails.add(m[0].toLowerCase());
          }
          const text = html
            .replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ")
            .replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&")
            .replace(/\s{2,}/g, " ").trim();
          if (text.length > 100 && /ATU|FN\s*\d|GISA|Medieninhaber|Firmenbuch|Gewerbe|Unternehmensgegenstand/i.test(text)) {
            impressumText = text.slice(0, 5000);
            break;
          }
        }
      } catch(e) { /* ignore */ }
    }

    // Spam-Emails filtern (no-reply, info@siteready etc.)
    const filteredEmails = [...allEmails].filter(e =>
      !/noreply|no-reply|donotreply|support@stripe|mailer|bounce|postmaster|webmaster|siteready/i.test(e)
    );

    const anthropicKey = env.ANTHROPIC_API_KEY;
    if (!anthropicKey) return Response.json({error: "API-Konfigurationsfehler."}, {status: 500});

    const mainExcerpt = pageText.slice(0, 4000);
    const fullText = impressumText
      ? mainExcerpt + "\n\n=== IMPRESSUM ===\n" + impressumText
      : mainExcerpt + "\n\n" + pageText.slice(-2000);

    const emailHint = filteredEmails.length > 0
      ? `\n\nGefundene E-Mail-Adressen auf der Website: ${filteredEmails.join(", ")}\nWaehle die primaere Kontakt-E-Mail des Unternehmens (nicht no-reply, nicht Drittanbieter).`
      : "";

    const claudeResp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {"Content-Type": "application/json", "x-api-key": anthropicKey, "anthropic-version": "2023-06-01"},
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 2048,
        messages: [{
          role: "user",
          content: `Extrahiere aus folgendem Website-Text die Daten eines oesterreichischen Unternehmens.
Antworte NUR mit einem JSON-Objekt (kein Markdown, kein Text drumherum) mit diesen Feldern:
- firmenname: Name des Unternehmens (max 60 Zeichen)
- telefon: Telefonnummer (oesterreichisches Format, leer wenn nicht gefunden)
- email: Primaere Kontakt-E-Mail-Adresse des Unternehmens (leer wenn nicht gefunden)
- plz: Postleitzahl 4-stellig (leer wenn nicht gefunden)
- ort: Ortsname (leer wenn nicht gefunden)
- adresse: Strassenname mit Hausnummer (leer wenn nicht gefunden)
- kurzbeschreibung: Kurze Beschreibung was das Unternehmen macht (max 200 Zeichen)
- bundesland: Oesterreichisches Bundesland (wien/noe/ooe/stmk/sbg/tirol/ktn/vbg/bgld, leer wenn nicht erkennbar)
- unternehmensform: Rechtsform (eu/einzelunternehmen/gmbh/og/kg/ag/verein/gesnbr/sonstige, leer wenn nicht erkennbar)
- uid: UID-Nummer im Format ATU12345678 (leer wenn nicht gefunden)
- firmenbuchnummer: Firmenbuchnummer z.B. FN 123456 a (leer wenn nicht gefunden)
- firmenbuchgericht: Firmenbuchgericht z.B. HG Wien (leer wenn nicht gefunden)
- gisazahl: GISA-Zahl (nur Ziffern, leer wenn nicht gefunden)
- branche: Branche des Betriebs (NUR einen dieser Werte – Handwerk: elektro/installateur/maler/tischler/fliesenleger/schlosser/dachdecker/zimmerei/maurer/bodenleger/glaser/gaertner/klima/reinigung/sonstige – Kosmetik & Koerperpflege: kosmetik/friseur/nagel/massage/tattoo/fusspflege/permanent_makeup/sonstige_kosmetik)
- leistungen: Array mit max. 8 konkreten Leistungen (z.B. ["Elektroinstallation","Beleuchtung"]), leeres Array wenn nicht erkennbar

Website-Text:
${fullText}${emailHint}`,
        }],
      }),
    });

    if (!claudeResp.ok) {
      const errText = await claudeResp.text();
      return Response.json({error: "KI-Analyse fehlgeschlagen: " + errText}, {status: 500});
    }

    const claudeData = await claudeResp.json();
    const rawContent = claudeData.content?.[0]?.text || "{}";

    let extracted;
    try {
      const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
      extracted = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
    } catch(e) {
      extracted = {};
    }

    // Unternehmensform normalisieren
    const ufRaw = (extracted.unternehmensform || "").toLowerCase().replace(/[\s.]/g, "");
    const ufMap = {"eu":"eu","einzelunternehmen":"einzelunternehmen","gmbh":"gmbh","og":"og","kg":"kg","ag":"ag","verein":"verein","gesnbr":"gesnbr","gesbr":"gesnbr"};
    const unternehmensform = ufMap[ufRaw] || (ufRaw.includes("gmbh")?"gmbh":ufRaw.includes("eu")?"eu":ufRaw.includes("einzelunternehmen")?"einzelunternehmen":extracted.unternehmensform||"");

    // Email: zuerst pruefen ob eine Email die gleiche Domain wie die Website hat
    const siteDomain = new URL(cleanUrl).hostname.replace(/^www\./, "");
    const domainMatch = filteredEmails.find(e => e.split("@")[1] === siteDomain);

    const claudeEmail = (extracted.email || "").toLowerCase();
    const finalEmail = domainMatch
      || (filteredEmails.includes(claudeEmail) ? claudeEmail : "")
      || filteredEmails[0]
      || "";

    return Response.json({
      firmenname: extracted.firmenname || "",
      telefon: extracted.telefon || "",
      email: finalEmail,
      plz: extracted.plz || "",
      ort: extracted.ort || "",
      adresse: extracted.adresse || "",
      kurzbeschreibung: extracted.kurzbeschreibung || "",
      bundesland: extracted.bundesland || "",
      unternehmensform,
      uid: extracted.uid || "",
      firmenbuchnummer: extracted.firmenbuchnummer || "",
      firmenbuchgericht: extracted.firmenbuchgericht || "",
      gisazahl: extracted.gisazahl || "",
      branche: extracted.branche || "",
      leistungen: Array.isArray(extracted.leistungen) ? extracted.leistungen.slice(0, 8) : [],
      facebook:  socialLinks.facebook  || "",
      instagram: socialLinks.instagram || "",
      linkedin:  socialLinks.linkedin  || "",
      tiktok:    socialLinks.tiktok    || "",
    });

  } catch(e) {
    return Response.json({error: "Import fehlgeschlagen: " + e.message}, {status: 500});
  }
}
