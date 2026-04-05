/**
 * FAQ-Generierung per Claude — Erzeugt 4-5 branchenspezifische FAQs
 * POST /api/generate-faq  Body: { order_id }
 */
export async function onRequestPost({request, env}) {
  const {order_id} = await request.json();
  if (!order_id) return new Response(JSON.stringify({error:"order_id fehlt"}), {status:400, headers:{"Content-Type":"application/json"}});

  // Order laden
  const r = await fetch(
    `${env.SUPABASE_URL}/rest/v1/orders?id=eq.${order_id}&select=firmenname,branche,einsatzgebiet,leistungen,kurzbeschreibung`,
    {headers:{"apikey":env.SUPABASE_SERVICE_KEY,"Authorization":`Bearer ${env.SUPABASE_SERVICE_KEY}`}}
  );
  if (!r.ok) return new Response(JSON.stringify({error:"DB-Fehler"}), {status:502, headers:{"Content-Type":"application/json"}});
  const rows = await r.json();
  if (!rows.length) return new Response(JSON.stringify({error:"Order nicht gefunden"}), {status:404, headers:{"Content-Type":"application/json"}});
  const o = rows[0];

  const prompt = `Du generierst FAQ-Eintraege fuer eine KMU-Website.

Betrieb: ${o.firmenname || "Unbekannt"}
Branche: ${o.branche || "Dienstleistung"}
Einsatzgebiet: ${o.einsatzgebiet || ""}
Leistungen: ${(o.leistungen||[]).join(", ")}
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
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      "x-api-key":env.ANTHROPIC_API_KEY,
      "anthropic-version":"2023-06-01",
    },
    body:JSON.stringify({
      model:"claude-sonnet-4-6",
      max_tokens:1024,
      messages:[{role:"user",content:prompt}],
    }),
  });

  if (!aiRes.ok) {
    return new Response(JSON.stringify({error:"KI-Fehler"}), {status:502, headers:{"Content-Type":"application/json"}});
  }

  const aiData = await aiRes.json();
  const text = aiData.content?.[0]?.text || "";

  // JSON aus Antwort extrahieren
  const match = text.match(/\[[\s\S]*\]/);
  if (!match) {
    return new Response(JSON.stringify({error:"Ungueltige KI-Antwort"}), {status:500, headers:{"Content-Type":"application/json"}});
  }

  try {
    const faq = JSON.parse(match[0]);
    // In DB speichern
    await fetch(
      `${env.SUPABASE_URL}/rest/v1/orders?id=eq.${order_id}`,
      {
        method:"PATCH",
        headers:{
          "apikey":env.SUPABASE_SERVICE_KEY,
          "Authorization":`Bearer ${env.SUPABASE_SERVICE_KEY}`,
          "Content-Type":"application/json",
          "Prefer":"return=minimal",
        },
        body:JSON.stringify({faq}),
      }
    );
    return new Response(JSON.stringify({faq}), {headers:{"Content-Type":"application/json"}});
  } catch {
    return new Response(JSON.stringify({error:"JSON-Parse-Fehler"}), {status:500, headers:{"Content-Type":"application/json"}});
  }
}
