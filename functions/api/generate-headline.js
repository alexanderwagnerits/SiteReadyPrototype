/**
 * Hero-Headline-Generierung per Claude — Erzeugt einen Kernbotschaft-Satz
 * POST /api/generate-headline  Body: { order_id }
 * Auth: Supabase JWT im Authorization-Header
 */
export async function onRequestPost({request, env}) {
  try {
    // 1. Authentifizierung pruefen
    const auth = request.headers.get("Authorization") || "";
    if (!auth.startsWith("Bearer ")) return Response.json({error: "Nicht autorisiert"}, {status: 401});
    const token = auth.slice(7);

    const userRes = await fetch(`${env.SUPABASE_URL}/auth/v1/user`, {
      headers: {"apikey": env.SUPABASE_SERVICE_KEY, "Authorization": `Bearer ${token}`},
    });
    if (!userRes.ok) return Response.json({error: "Nicht autorisiert"}, {status: 401});
    const user = await userRes.json();
    if (!user?.email) return Response.json({error: "Nicht autorisiert"}, {status: 401});

    // 2. Body parsen
    let body;
    try { body = await request.json(); } catch { return Response.json({error: "Ungueltiger Request"}, {status: 400}); }
    const {order_id} = body;
    if (!order_id) return Response.json({error: "order_id fehlt"}, {status: 400});

    // 3. Order laden und pruefen ob sie dem User gehoert
    const r = await fetch(
      `${env.SUPABASE_URL}/rest/v1/orders?id=eq.${order_id}&select=firmenname,branche,einsatzgebiet,leistungen,kurzbeschreibung,email,text_vorteile`,
      {headers: {"apikey": env.SUPABASE_SERVICE_KEY, "Authorization": `Bearer ${env.SUPABASE_SERVICE_KEY}`}}
    );
    if (!r.ok) return Response.json({error: "DB-Fehler"}, {status: 502});
    const rows = await r.json();
    if (!rows.length) return Response.json({error: "Order nicht gefunden"}, {status: 404});
    const o = rows[0];

    if (o.email !== user.email) return Response.json({error: "Nicht autorisiert"}, {status: 403});

    // 4. Headline per Claude generieren
    const sanitize = (s) => String(s || "").slice(0, 500);
    const prompt = `Du generierst eine Hero-Ueberschrift fuer eine KMU-Website.

Betrieb: ${sanitize(o.firmenname)}
Branche: ${sanitize(o.branche)}
Einsatzgebiet: ${sanitize(o.einsatzgebiet)}
Leistungen: ${(o.leistungen || []).map(l => sanitize(l)).slice(0, 6).join(", ")}
Kurzbeschreibung: ${sanitize(o.kurzbeschreibung)}
${o.text_vorteile?.length ? `Vorteile: ${o.text_vorteile.slice(0, 3).map(v => sanitize(v)).join(" | ")}` : ""}

Erstelle EINEN kurzen, praegnanten Satz (4-8 Woerter) als Hero-Ueberschrift.
Regeln:
- KEIN Firmenname (der erscheint separat)
- KEIN generisches "Ihr Experte fuer ..." / "Willkommen bei ..."
- Fokus: Nutzen fuer den Kunden ODER Alleinstellung ODER Versprechen
- Emotional greifbar, nicht austauschbar
- Deutsche Umlaute (ä, ö, ü, ß)
- Max. 60 Zeichen

Beispiele fuer verschiedene Branchen:
- Fleischerei: "Frische Wurstwaren seit 1962"
- Arzt: "Ihre Gesundheit in guten Haenden"
- Elektriker: "Zuverlaessig. Schnell. Persoenlich."
- Yoga: "Finden Sie Ihre innere Mitte"
- Rechtsanwalt: "Recht bekommen. Klar. Direkt."

Antworte NUR mit dem Satz, KEINE Anfuehrungszeichen, KEINE Erklaerung.`;

    const aiRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 128,
        messages: [{role: "user", content: prompt}],
      }),
    });

    if (!aiRes.ok) return Response.json({error: "KI-Fehler"}, {status: 502});

    const aiData = await aiRes.json();
    let headline = (aiData.content?.[0]?.text || "").trim();

    // Aeussere Anfuehrungszeichen entfernen falls Claude sie doch setzt
    headline = headline.replace(/^["„»]+|["«"]+$/g, "").trim();
    if (!headline) return Response.json({error: "Leere Antwort"}, {status: 500});
    if (headline.length > 100) headline = headline.slice(0, 100).trim();

    // 5. In DB speichern
    const patchRes = await fetch(
      `${env.SUPABASE_URL}/rest/v1/orders?id=eq.${order_id}`,
      {
        method: "PATCH",
        headers: {
          "apikey": env.SUPABASE_SERVICE_KEY,
          "Authorization": `Bearer ${env.SUPABASE_SERVICE_KEY}`,
          "Content-Type": "application/json",
          "Prefer": "return=minimal",
        },
        body: JSON.stringify({hero_headline: headline}),
      }
    );
    if (!patchRes.ok) return Response.json({error: "Fehler beim Speichern"}, {status: 502});

    return Response.json({hero_headline: headline});
  } catch (e) {
    return Response.json({error: "Interner Fehler"}, {status: 500});
  }
}
