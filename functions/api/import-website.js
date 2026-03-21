export async function onRequestPost({request}) {
  try {
    const {url} = await request.json();
    if (!url) return Response.json({error: "URL fehlt"}, {status: 400});

    let cleanUrl = url.trim();
    if (!cleanUrl.startsWith("http")) cleanUrl = "https://" + cleanUrl;

    // Jina AI Reader: wandelt jede Website in sauberes Markdown um
    const jinaResp = await fetch("https://r.jina.ai/" + cleanUrl, {
      headers: {
        "Accept": "text/plain",
        "X-Return-Format": "text",
        "User-Agent": "Mozilla/5.0 (compatible; SiteReady/1.0)",
      },
    });

    if (!jinaResp.ok) return Response.json({error: "Website nicht erreichbar."}, {status: 400});

    const text = await jinaResp.text();
    if (!text || text.length < 50) return Response.json({error: "Keine Inhalte gefunden."}, {status: 400});

    // Aus dem sauberen Text extrahieren
    const lines = text.split("\n").map(l => l.trim()).filter(Boolean);

    // Firmenname: erste Ueberschrift oder Title-Zeile
    const titleLine = lines.find(l => l.startsWith("# ") || l.startsWith("Title:"));
    const firmenname = (titleLine || lines[0] || "")
      .replace(/^#+ /, "").replace(/^Title:\s*/i, "")
      .replace(/\s*[-|–|·].*$/, "").trim().slice(0, 60);

    // Telefon: AT-Nummern
    const telMatch = text.match(/(\+43[\s\-]?[\d\s\-\/]{6,18}|0[\d]{2,4}[\s\-\/]?[\d\s\-\/]{4,12})/g) || [];
    const telefon = telMatch
      .map(t => t.replace(/\s+/g, " ").trim())
      .filter(t => t.replace(/\D/g, "").length >= 7)[0] || "";

    // E-Mail
    const emailMatch = text.match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g) || [];
    const email = emailMatch.filter(e =>
      !e.includes("example") && !e.includes("sentry") && !e.includes("wixpress") && !e.match(/^\d/)
    )[0] || "";

    // PLZ + Ort (oesterreichisch: 4-stellig)
    const plzMatch = text.match(/\b(\d{4})\s+([A-ZAEOUE\u00c4\u00d6\u00dc][a-zA-Za\u00e4\u00f6\u00fc\u00df\-\s]{2,30})/);
    const plz = plzMatch ? plzMatch[1] : "";
    const ort = plzMatch ? plzMatch[2].trim().replace(/\s{2,}.*/, "").slice(0, 40) : "";

    // Strasse
    const strasseMatch = text.match(/[A-Z\u00c4\u00d6\u00dc][a-z\u00e4\u00f6\u00fc\u00df\-]+(?:gasse|stra(?:ss|\u00df)e|weg|platz|ring|allee|zeile|gasse|stra\u00dfe)[^\n,]{0,15}/i);
    const adresse = strasseMatch ? strasseMatch[0].trim().slice(0, 60) : "";

    // Beschreibung: erste laengere Zeile die wie Prosa aussieht
    const descLine = lines.find(l =>
      l.length > 40 && l.length < 250 &&
      !l.startsWith("#") && !l.startsWith("|") &&
      !l.match(/^[\d\+\(]/) && !l.includes("@") &&
      l.split(" ").length > 5
    ) || "";
    const kurzbeschreibung = descLine.slice(0, 200);

    return Response.json({firmenname, telefon, email, plz, ort, adresse, kurzbeschreibung});

  } catch(e) {
    return Response.json({error: "Import fehlgeschlagen: " + e.message}, {status: 500});
  }
}
