export async function onRequestPost({request, env}) {
  try {
    const {url} = await request.json();
    if (!url) return Response.json({error: "URL fehlt"}, {status: 400});

    let cleanUrl = url.trim();
    if (!cleanUrl.startsWith("http")) cleanUrl = "https://" + cleanUrl;
    const base = new URL(cleanUrl).origin;

    // 1. Hauptseite als HTML laden (fuer Link-Extraktion + mailto)
    let mainHtml = "";
    let pageText = "";
    try {
      const r = await fetch(cleanUrl, {
        headers: {"User-Agent": "Mozilla/5.0", "Accept": "text/html", "Accept-Language": "de-AT,de;q=0.9"},
        redirect: "follow", signal: AbortSignal.timeout(10000),
      });
      if (r.ok) mainHtml = await r.text();
    } catch(e) { /* ignore */ }

    // Email direkt aus mailto-Links extrahieren (zuverlaessiger als KI-Suche)
    let emailFromHtml = "";
    if (mainHtml) {
      const mailtoMatch = mainHtml.match(/mailto:([a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,})/i);
      if (mailtoMatch) emailFromHtml = mailtoMatch[1];
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
      // Fallback: Link-Text pruefen
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

    // Impressum laden (gefundener Link oder Jina-Fallback mit bekannten Patterns)
    let impressumText = "";
    const impressumTargets = impressumUrl
      ? [impressumUrl]
      : ["/impressum", "/index.php/impressum", "/impressum.html", "/de/impressum", "/rechtliches/impressum", "/ueber-uns/impressum"].map(p => base + p);

    for (const impUrl of impressumTargets) {
      try {
        // Zuerst direkt laden
        const r = await fetch(impUrl, {
          headers: {"User-Agent": "Mozilla/5.0", "Accept": "text/html"},
          redirect: "follow", signal: AbortSignal.timeout(8000),
        });
        if (r.ok) {
          const html = await r.text();
          // Email aus Impressum-Seite extrahieren wenn noch keine gefunden
          if (!emailFromHtml) {
            const m = html.match(/mailto:([a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,})/i);
            if (m) emailFromHtml = m[1];
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

    const anthropicKey = env.ANTHROPIC_API_KEY;
    if (!anthropicKey) return Response.json({error: "API-Konfigurationsfehler."}, {status: 500});

    const mainExcerpt = pageText.slice(0, 4000);
    const fullText = impressumText
      ? mainExcerpt + "\n\n=== IMPRESSUM ===\n" + impressumText
      : mainExcerpt + "\n\n" + pageText.slice(-2000);

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
- email: E-Mail-Adresse (leer wenn nicht gefunden)
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
- branche: Handwerksbranche (NUR einen dieser Werte: elektro/installateur/maler/tischler/fliesenleger/schlosser/dachdecker/zimmerei/maurer/bodenleger/glaser/gaertner/klima/reinigung/sonstige)
- leistungen: Array mit max. 8 konkreten Leistungen (z.B. ["Elektroinstallation","Beleuchtung"]), leeres Array wenn nicht erkennbar

Website-Text:
${fullText}`,
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

    return Response.json({
      firmenname: extracted.firmenname || "",
      telefon: extracted.telefon || "",
      email: emailFromHtml || extracted.email || "",
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
    });

  } catch(e) {
    return Response.json({error: "Import fehlgeschlagen: " + e.message}, {status: 500});
  }
}
