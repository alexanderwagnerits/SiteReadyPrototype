export async function onRequestPost({request, env}) {
  try {
    const {url} = await request.json();
    if (!url) return Response.json({error: "URL fehlt"}, {status: 400});

    let cleanUrl = url.trim();
    if (!cleanUrl.startsWith("http")) cleanUrl = "https://" + cleanUrl;

    // Website direkt laden
    let pageText = "";
    try {
      const pageResp = await fetch(cleanUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml",
          "Accept-Language": "de-AT,de;q=0.9",
        },
        redirect: "follow",
      });
      if (pageResp.ok) {
        const html = await pageResp.text();
        // HTML-Tags entfernen, sauberen Text extrahieren
        pageText = html
          .replace(/<script[\s\S]*?<\/script>/gi, " ")
          .replace(/<style[\s\S]*?<\/style>/gi, " ")
          .replace(/<[^>]+>/g, " ")
          .replace(/&nbsp;/g, " ")
          .replace(/&amp;/g, "&")
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/\s{2,}/g, " ")
          .trim();
      }
    } catch(fetchErr) {
      // Fallback: Jina AI Reader
    }

    // Fallback: Jina AI Reader (fuer JS-gerenderte Seiten)
    if (!pageText || pageText.length < 100) {
      try {
        const jinaResp = await fetch("https://r.jina.ai/" + cleanUrl, {
          headers: {
            "Accept": "text/plain",
            "X-Return-Format": "text",
          },
        });
        if (jinaResp.ok) {
          pageText = await jinaResp.text();
        }
      } catch(jinaErr) {
        // ignore
      }
    }

    if (!pageText || pageText.length < 50) {
      return Response.json({error: "Website konnte nicht geladen werden."}, {status: 400});
    }

    const anthropicKey = env.ANTHROPIC_API_KEY;
    if (!anthropicKey) return Response.json({error: "API-Konfigurationsfehler."}, {status: 500});

    // Ersten 4000 Zeichen an Claude schicken
    const excerpt = pageText.slice(0, 4000);

    const claudeResp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": anthropicKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307",
        max_tokens: 512,
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
    });

  } catch(e) {
    return Response.json({error: "Import fehlgeschlagen: " + e.message}, {status: 500});
  }
}
