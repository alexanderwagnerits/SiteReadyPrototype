// Farben kommen aus custom_* DB-Feldern (gesetzt via Branchengruppe oder User-Override)
const DEFAULT_PAL = {p:"#1a1a1a", a:"#b08d57"};

const STIL_R = {klassisch:"4px", modern:"12px", elegant:"2px", professional:"4px", traditional:"2px"};
const STIL_FONT = {klassisch:"Inter", modern:"Plus Jakarta Sans", elegant:"Inter", professional:"Inter", traditional:"Inter"};

export async function onRequestPost({request, env}) {
  try {
    // 1. Supabase JWT pruefen
    const auth = request.headers.get("Authorization") || "";
    if (!auth.startsWith("Bearer ")) return Response.json({error: "Unauthorized"}, {status: 401});
    const token = auth.slice(7);

    const userRes = await fetch(`${env.SUPABASE_URL}/auth/v1/user`, {
      headers: {"apikey": env.SUPABASE_SERVICE_KEY, "Authorization": `Bearer ${token}`},
    });
    if (!userRes.ok) return Response.json({error: "Unauthorized"}, {status: 401});
    const user = await userRes.json();
    if (!user?.email) return Response.json({error: "Unauthorized"}, {status: 401});

    // 2. Bestellung laden
    const orderRes = await fetch(
      `${env.SUPABASE_URL}/rest/v1/orders?email=eq.${encodeURIComponent(user.email)}&select=*&order=created_at.desc&limit=1`,
      {headers: {"apikey": env.SUPABASE_SERVICE_KEY, "Authorization": `Bearer ${env.SUPABASE_SERVICE_KEY}`}},
    );
    const orders = await orderRes.json();
    if (!orders.length) return Response.json({error: "Keine Bestellung gefunden"}, {status: 404});
    const order = orders[0];

    // 3. Nur Leistungen unterstuetzt (Design nur per Support)
    let body;
    try { body = await request.json(); } catch(e) { return Response.json({error: "Invalid JSON"}, {status: 400}); }
    const {section, data} = body;
    if (section !== "leistungen") return Response.json({error: "Nur Leistungen koennen self-service geaendert werden"}, {status: 400});
    if (!data) return Response.json({error: "data erforderlich"}, {status: 400});

    // 4. Rate-Limit: 2 pro 30 Tage
    const now = new Date();
    const ago30 = now.getTime() - 30 * 24 * 60 * 60 * 1000;
    const recent = [order.last_regen_at, order.prev_regen_at]
      .filter(Boolean).map(d => new Date(d)).filter(d => d.getTime() > ago30).sort((a, b) => a - b);
    if (recent.length >= 2) {
      const nextFree = new Date(recent[0].getTime() + 30 * 24 * 60 * 60 * 1000);
      return Response.json({error: "limit_reached", next_available: nextFree.toISOString()}, {status: 429});
    }

    // 5. Neue Leistungen-Sektion mit Sonnet generieren (Partial Regen)
    const pal  = {p: order.custom_color || DEFAULT_PAL.p, a: order.custom_accent || DEFAULT_PAL.a};
    const r    = STIL_R[order.stil]    || "6px";
    const font = STIL_FONT[order.stil] || "Inter";

    const leistungen = [...(data.leistungen || [])];
    if (data.extra_leistung?.trim()) leistungen.push(data.extra_leistung.trim());

    const aiRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {"x-api-key": env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01", "content-type": "application/json"},
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 2048,
        system: `Du bist ein Senior Frontend-Entwickler. Generiere NUR eine einzelne HTML-Sektion.
AUSGABE: Ausschliesslich reiner HTML-Code ohne Erklaerungen oder Markdown. Beginne direkt mit <section.`,
        messages: [{role: "user", content: `Erstelle die Leistungen-Sektion fuer einen ${order.branche_label || order.branche}-Betrieb.

Primaerfarbe: ${pal.p}
Akzentfarbe:  ${pal.a}
Schrift:      ${font} (bereits geladen – kein @import)
Border-Radius: ${r}

LEISTUNGEN (${leistungen.length}):
${leistungen.map((l, i) => `${i + 1}. ${l}`).join("\n")}

Anforderungen:
- <section id="leistungen" style="background:#fff;padding:96px 0">
- H2 "Unsere Leistungen" in Primaerfarbe, font-weight:800
- CSS Grid: display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:24px
- Cards: background:#fff;border-radius:${r};box-shadow:0 2px 16px rgba(0,0,0,.07);padding:28px 24px
- Hover-Lift: transition:transform .2s;:hover{transform:translateY(-4px)}
- Jede Card: Emoji-Icon (font-size:2rem), H3 (Primaerfarbe), 1 Satz Beschreibung (selbst verfassen)
- Responsive: @media(max-width:640px){padding:64px 0}
- Kein eigener <style>-Block mit Google Fonts`}],
      }),
    });

    if (!aiRes.ok) {
      const err = await aiRes.json().catch(() => ({}));
      return Response.json({error: "KI-Fehler: " + (err.error?.message || aiRes.status)}, {status: 500});
    }
    const aiData = await aiRes.json();
    const usage = aiData.usage || {};
    const tokIn = usage.input_tokens || 0;
    const tokOut = usage.output_tokens || 0;
    // Sonnet $3/1M in + $15/1M out, ~0.92 EUR/USD
    const addCostEur = Math.round(((tokIn * 3 + tokOut * 15) / 1000000) * 0.92 * 10000) / 10000;
    let newSection = (aiData.content?.[0]?.text || "").replace(/^```html\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();

    // 6. Leistungen-Sektion im gespeicherten HTML ersetzen
    const oldHtml = order.website_html || "";
    const updatedHtml = oldHtml.replace(/<section[^>]*id="leistungen"[^>]*>[\s\S]*?<\/section>/i, newSection);

    if (updatedHtml === oldHtml) {
      return Response.json({error: "Leistungen-Sektion nicht gefunden – bitte einmal vollstaendig neu generieren lassen."}, {status: 422});
    }

    // 7. Speichern (status bleibt unveraendert – direkt live)
    await fetch(`${env.SUPABASE_URL}/rest/v1/orders?id=eq.${order.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "apikey": env.SUPABASE_SERVICE_KEY,
        "Authorization": `Bearer ${env.SUPABASE_SERVICE_KEY}`,
        "Prefer": "return=minimal",
      },
      body: JSON.stringify({
        leistungen: data.leistungen,
        extra_leistung: data.extra_leistung,
        notdienst: data.notdienst,
        website_html: updatedHtml,
        prev_regen_at: order.last_regen_at || null,
        last_regen_at: now.toISOString(),
        regen_requested: false,
        tokens_in: (order.tokens_in || 0) + tokIn,
        tokens_out: (order.tokens_out || 0) + tokOut,
        cost_eur: Math.round(((order.cost_eur || 0) + addCostEur) * 10000) / 10000,
      }),
    });

    return Response.json({ok: true, partial: true});

  } catch(e) {
    return Response.json({error: "Interner Fehler: " + e.message}, {status: 500});
  }
}
