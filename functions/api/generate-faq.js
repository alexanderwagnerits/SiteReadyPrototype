/**
 * FAQ-Generierung per Claude — Erzeugt 4-5 branchenspezifische FAQs
 * POST /api/generate-faq  Body: { order_id }
 * Auth: Supabase JWT im Authorization-Header
 */
export async function onRequestPost({request, env}) {
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

  // 2. Order laden und pruefen ob sie dem User gehoert
  const {order_id} = await request.json();
  if (!order_id) return Response.json({error: "order_id fehlt"}, {status: 400});

  const r = await fetch(
    `${env.SUPABASE_URL}/rest/v1/orders?id=eq.${order_id}&select=firmenname,branche,einsatzgebiet,leistungen,kurzbeschreibung,email`,
    {headers: {"apikey": env.SUPABASE_SERVICE_KEY, "Authorization": `Bearer ${env.SUPABASE_SERVICE_KEY}`}}
  );
  if (!r.ok) return Response.json({error: "DB-Fehler"}, {status: 502});
  const rows = await r.json();
  if (!rows.length) return Response.json({error: "Order nicht gefunden"}, {status: 404});
  const o = rows[0];

  // Pruefen ob Order dem authentifizierten User gehoert
  if (o.email !== user.email) return Response.json({error: "Nicht autorisiert"}, {status: 403});

  // 3. FAQ per Claude generieren
  const prompt = `Du generierst FAQ-Eintraege fuer eine KMU-Website.

Betrieb: ${o.firmenname || "Unbekannt"}
Branche: ${o.branche || "Dienstleistung"}
Einsatzgebiet: ${o.einsatzgebiet || ""}
Leistungen: ${(o.leistungen || []).join(", ")}
Kurzbeschreibung: ${o.kurzbeschreibung || ""}

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
    const errBody = await aiRes.text().catch(() => "");
    console.error("Claude API Fehler:", aiRes.status, errBody);
    return Response.json({error: "KI-Fehler"}, {status: 502});
  }

  const aiData = await aiRes.json();
  const text = aiData.content?.[0]?.text || "";

  // JSON aus Antwort extrahieren (funktioniert auch mit ```json ... ```)
  let jsonStr = text;
  const codeBlock = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (codeBlock) jsonStr = codeBlock[1];
  const match = jsonStr.match(/\[[\s\S]*\]/);
  if (!match) return Response.json({error: "Ungueltige KI-Antwort"}, {status: 500});

  try {
    const faq = JSON.parse(match[0]);

    // 4. In DB speichern
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
        body: JSON.stringify({faq}),
      }
    );
    if (!patchRes.ok) return Response.json({error: "Fehler beim Speichern"}, {status: 502});

    return Response.json({faq});
  } catch {
    return Response.json({error: "JSON-Parse-Fehler"}, {status: 500});
  }
}
