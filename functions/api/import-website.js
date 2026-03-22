export async function onRequestPost({request, env}) {
  try {
    const {url} = await request.json();
    if (!url) return Response.json({error: "URL fehlt"}, {status: 400});

    let cleanUrl = url.trim();
    if (!cleanUrl.startsWith("http")) cleanUrl = "https://" + cleanUrl;

    // Jina AI Reader als Primaerquelle (strukturierter Text, erkennt E-Mails/Links besser)
    let pageText = "";
    try {
      const jinaResp = await fetch("https://r.jina.ai/" + cleanUrl, {
        headers: {"Accept": "text/plain", "X-Return-Format": "text"},
        signal: AbortSignal.timeout(10000),
      });
      if (jinaResp.ok) pageText = await jinaResp.text();
    } catch(jinaErr) { /* ignore */ }

    // Fallback: Website direkt laden
    if (!pageText || pageText.length < 100) {
      try {
        const pageResp = await fetch(cleanUrl, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Accept": "text/html,application/xhtml+xml",
            "Accept-Language": "de-AT,de;q=0.9",
          },
          redirect: "follow",
          signal: AbortSignal.timeout(10000),
        });
        if (pageResp.ok) {
          const html = await pageResp.text();
          pageText = html
            .replace(/<script[\s\S]*?<\/script>/gi, " ")
            .replace(/<style[\s\S]*?<\/style>/gi, " ")
            .replace(/<[^>]+>/g, " ")
            .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&")
            .replace(/&lt;/g, "<").replace(/&gt;/g, ">")
            .replace(/\s{2,}/g, " ").trim();
        }
      } catch(fetchErr) { /* ignore */ }
    }

    if (!pageText || pageText.length < 50) {
      return Response.json({error: "Website konnte nicht geladen werden."}, {status: 400});
    }

    // Impressum-Seite zusaetzlich laden (Unternehmensinfos stehen meist dort)
    const impressumUrls = [cleanUrl.replace(/\/$/, "") + "/impressum", cleanUrl.replace(/\/$/, "") + "/impressum.html"];
    for (const impUrl of impressumUrls) {
      try {
        const impResp = await fetch("https://r.jina.ai/" + impUrl, {
          headers: {"Accept": "text/plain", "X-Return-Format": "text"},
          signal: AbortSignal.timeout(8000),
        });
        if (impResp.ok) {
          const impText = await impResp.text();
          if (impText && impText.length > 100) {
            pageText += "\n\n=== IMPRESSUM ===\n" + impText.slice(0, 3000);
            break;
          }
        }
      } catch(e) { /* ignore */ }
    }

    const anthropicKey = env.ANTHROPIC_API_KEY;
    if (!anthropicKey) return Response.json({error: "API-Konfigurationsfehler."}, {status: 500});

    // Anfang (fuer Firmenname/Kontakt) + Ende (fuer Impressum) kombinieren
    const start = pageText.slice(0, 5000);
    const end = pageText.length > 5000 ? "\n\n[...]\n\n" + pageText.slice(-3000) : "";
    const excerpt = (start + end).slice(0, 10000);

    const claudeResp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": anthropicKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1024,
        messages: [{
          role: "user",
          content: `Extrahiere aus folgendem Website-Text die Kontaktdaten eines oesterreichischen Unternehmens.
Antworte NUR mit einem JSON-Objekt (kein Markdown, kein Text drumherum) mit diesen Feldern:
- firmenname: Name des Unternehmens (max 60 Zeichen)
- telefon: Telefonnummer (oesterreichisches Format, z.B. +43 1 234567 oder 0664 1234567, leer wenn nicht gefunden)
- email: E-Mail-Adresse (leer wenn nicht gefunden)
- plz: Postleitzahl 4-stellig (leer wenn nicht gefunden)
- ort: Ortsname (leer wenn nicht gefunden)
- adresse: Strassenname mit Hausnummer (leer wenn nicht gefunden)
- kurzbeschreibung: Kurze Beschreibung was das Unternehmen macht (max 200 Zeichen, leer wenn nicht gefunden)
- bundesland: Oesterreichisches Bundesland (wien/noe/ooe/stmk/sbg/tirol/ktn/vbg/bgld, leer wenn nicht erkennbar)
- unternehmensform: Rechtsform (eu/einzelunternehmen/gmbh/og/kg/ag/verein/gesnbr/sonstige, leer wenn nicht erkennbar)
- uid: UID-Nummer im Format ATU12345678 (leer wenn nicht gefunden)
- firmenbuchnummer: Firmenbuchnummer z.B. FN 123456 a (leer wenn nicht gefunden)
- firmenbuchgericht: Firmenbuchgericht z.B. HG Wien (leer wenn nicht gefunden)
- gisazahl: GISA-Zahl (Ziffern, leer wenn nicht gefunden)
- branche: Handwerksbranche (NUR einen dieser exakten Werte: elektro/installateur/maler/tischler/fliesenleger/schlosser/dachdecker/zimmerei/maurer/bodenleger/glaser/gaertner/klima/reinigung/sonstige)
- leistungen: Array mit max. 8 konkreten Leistungen/Dienstleistungen des Unternehmens (z.B. ["Elektroinstallation","Beleuchtung","Photovoltaik"]), leeres Array wenn nicht erkennbar

Website-Text:
${excerpt}`,
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

    return Response.json({
      firmenname: extracted.firmenname || "",
      telefon: extracted.telefon || "",
      email: extracted.email || "",
      plz: extracted.plz || "",
      ort: extracted.ort || "",
      adresse: extracted.adresse || "",
      kurzbeschreibung: extracted.kurzbeschreibung || "",
      bundesland: extracted.bundesland || "",
      unternehmensform: extracted.unternehmensform || "",
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
