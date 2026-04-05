/**
 * FAQ-Generierung per Claude — Erzeugt 5 branchenspezifische FAQs
 * POST /api/generate-faq  Body: { order_id }
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
      `${env.SUPABASE_URL}/rest/v1/orders?id=eq.${order_id}&select=firmenname,branche,einsatzgebiet,leistungen,kurzbeschreibung,email`,
      {headers: {"apikey": env.SUPABASE_SERVICE_KEY, "Authorization": `Bearer ${env.SUPABASE_SERVICE_KEY}`}}
    );
    if (!r.ok) return Response.json({error: "DB-Fehler"}, {status: 502});
    const rows = await r.json();
    if (!rows.length) return Response.json({error: "Order nicht gefunden"}, {status: 404});
    const o = rows[0];

    if (o.email !== user.email) return Response.json({error: "Nicht autorisiert"}, {status: 403});

    // 4. FAQ per Claude generieren
    const sanitize = (s) => String(s || "").slice(0, 500);
    const prompt = `Du generierst FAQ-Eintraege fuer eine KMU-Website.

Betrieb: ${sanitize(o.firmenname)}
Branche: ${sanitize(o.branche)}
Einsatzgebiet: ${sanitize(o.einsatzgebiet)}
Leistungen: ${(o.leistungen || []).map(l => sanitize(l)).join(", ")}
Kurzbeschreibung: ${sanitize(o.kurzbeschreibung)}

Erstelle exakt 5 haeufig gestellte Fragen mit Antworten.
Regeln:
- Branchenspezifisch und realistisch
- Antworten: 1-2 kurze, hilfreiche Saetze
- Keine Floskeln, nur konkrete Informationen
- Deutsche Umlaute verwenden (ae->ä, oe->ö, ue->ü)

Antworte NUR mit gueltigem JSON-Array, keine Erklaerung:
[{"frage":"...","antwort":"..."},...]`;

    const aiRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1024,
        messages: [{role: "user", content: prompt}],
      }),
    });

    if (!aiRes.ok) {
      console.error("Claude API Fehler:", aiRes.status);
      return Response.json({error: "KI-Fehler"}, {status: 502});
    }

    const aiData = await aiRes.json();
    const text = aiData.content?.[0]?.text || "";

    // JSON aus Antwort extrahieren
    let jsonStr = text;
    const codeBlock = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (codeBlock) jsonStr = codeBlock[1];
    const match = jsonStr.match(/\[[\s\S]*\]/);
    if (!match) return Response.json({error: "Ungueltige KI-Antwort"}, {status: 500});

    const faq = JSON.parse(match[0]);

    // Struktur validieren
    if (!Array.isArray(faq) || faq.length === 0) return Response.json({error: "Leere FAQ-Antwort"}, {status: 500});
    const validFaq = faq.filter(f => f && typeof f.frage === "string" && typeof f.antwort === "string" && f.frage.trim() && f.antwort.trim())
      .map(f => ({frage: f.frage.trim(), antwort: f.antwort.trim()}));
    if (validFaq.length === 0) return Response.json({error: "Keine gueltige FAQ generiert"}, {status: 500});

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
        body: JSON.stringify({faq: validFaq}),
      }
    );
    if (!patchRes.ok) return Response.json({error: "Fehler beim Speichern"}, {status: 502});

    return Response.json({faq: validFaq});
  } catch (e) {
    console.error("generate-faq error:", e);
    return Response.json({error: "Interner Fehler"}, {status: 500});
  }
}
