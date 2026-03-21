export async function onRequestPost({request}) {
  try {
    const {url} = await request.json();
    if (!url) return Response.json({error: "URL fehlt"}, {status: 400});

    // URL normalisieren
    let fetchUrl = url.trim();
    if (!fetchUrl.startsWith("http")) fetchUrl = "https://" + fetchUrl;

    // Website abrufen
    const resp = await fetch(fetchUrl, {
      headers: {"User-Agent": "Mozilla/5.0 (compatible; SiteReady-Import/1.0)"},
      redirect: "follow",
    });

    if (!resp.ok) return Response.json({error: "Website nicht erreichbar (Status " + resp.status + ")"}, {status: 400});

    const html = await resp.text();
    const text = html.replace(/<script[\s\S]*?<\/script>/gi, "")
                     .replace(/<style[\s\S]*?<\/style>/gi, "")
                     .replace(/<[^>]+>/g, " ")
                     .replace(/\s+/g, " ");

    // Firmenname: title > h1 > og:title
    const title = (html.match(/<title[^>]*>([^<]{2,80})<\/title>/i)||[])[1]
      || (html.match(/<meta[^>]+property="og:title"[^>]+content="([^"]{2,80})"/i)||[])[1]
      || (html.match(/<h1[^>]*>([^<]{2,80})<\/h1>/i)||[])[1]
      || "";
    const firmenname = title.replace(/\s*[-|–|·|·].*$/, "").replace(/\s+/g, " ").trim().slice(0, 60);

    // Telefon: oesterreichische Nummern
    const telMatches = text.match(/(\+43[\s\-]?[\d\s\-\/]{6,20}|0[\d]{2,4}[\s\-\/]?[\d\s\-\/]{4,15})/g) || [];
    const telefon = telMatches.map(t => t.replace(/\s+/g, " ").trim()).filter(t => t.replace(/\D/g, "").length >= 7)[0] || "";

    // E-Mail
    const emailMatches = text.match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g) || [];
    const email = emailMatches.filter(e => !e.includes("sentry") && !e.includes("example") && !e.includes("@2"))[0] || "";

    // Adresse: PLZ + Ort (oesterreichisch: 4-stellige PLZ)
    const plzMatch = text.match(/\b(\d{4})\s+([A-ZAEOUE][a-zaeoue\-\s]{2,30})/);
    const plz = plzMatch ? plzMatch[1] : "";
    const ort = plzMatch ? plzMatch[2].trim().split(/\s{2,}/)[0].slice(0, 40) : "";

    // Strasse
    const strasseMatch = text.match(/([A-ZAEOUE][a-zaeoue\-]+(?:gasse|strasse|weg|platz|ring|allee|zeile|gasse|strasse|gasse)[^,\n]{0,20})/);
    const adresse = strasseMatch ? strasseMatch[0].trim().slice(0, 60) : "";

    // Beschreibung: meta description oder erster Satz
    const desc = (html.match(/<meta[^>]+name="description"[^>]+content="([^"]{10,200})"/i)||[])[1]
      || (html.match(/<meta[^>]+content="([^"]{10,200})"[^>]+name="description"/i)||[])[1]
      || "";
    const kurzbeschreibung = desc.trim().slice(0, 200);

    return Response.json({
      firmenname,
      telefon,
      email,
      plz,
      ort,
      adresse,
      kurzbeschreibung,
    });
  } catch(e) {
    return Response.json({error: "Import fehlgeschlagen: " + e.message}, {status: 500});
  }
}
