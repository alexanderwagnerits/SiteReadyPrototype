export async function onRequestPost({request, env, ctx}) {
  const sig = request.headers.get("stripe-signature");
  const body = await request.text();


  let event;
  if (env.STRIPE_WEBHOOK_SECRET) {
    try {
      event = await verifyStripeSignature(body, sig, env.STRIPE_WEBHOOK_SECRET);
    } catch(e) {
      return new Response("Signatur ungueltig: " + e.message, {status: 400});
    }
  } else {
    // Fallback ohne Signaturpruefung (nur fuer Entwicklung)
    try { event = JSON.parse(body); } catch(e) {
      return new Response("JSON ungueltig", {status: 400});
    }
  }

  // checkout.session.completed → Order auf "paid" setzen
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId = session.metadata?.order_id;

    if (orderId && env.SUPABASE_URL && env.SUPABASE_SERVICE_KEY) {
      await fetch(`${env.SUPABASE_URL}/rest/v1/orders?id=eq.${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "apikey": env.SUPABASE_SERVICE_KEY,
          "Authorization": `Bearer ${env.SUPABASE_SERVICE_KEY}`,
          "Prefer": "return=minimal",
        },
        body: JSON.stringify({status: "paid"}),
      });

      // Kein Auto-Generate mehr – Kunde entscheidet im Portal ob mit/ohne Fotos
    }
  }

  return new Response("ok", {status: 200});
}

// HMAC-SHA256 Signaturpruefung fuer Stripe (Cloudflare Workers kompatibel)
async function verifyStripeSignature(payload, sigHeader, secret) {
  if (!sigHeader) throw new Error("Keine Signatur");

  const parts = sigHeader.split(",");
  const tPart = parts.find(p => p.startsWith("t="));
  const v1Part = parts.find(p => p.startsWith("v1="));
  if (!tPart || !v1Part) throw new Error("Signatur-Format ungueltig");

  const timestamp = tPart.slice(2);
  const expectedSig = v1Part.slice(3);
  const signedPayload = `${timestamp}.${payload}`;

  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw", enc.encode(secret), {name: "HMAC", hash: "SHA-256"}, false, ["sign"]
  );
  const mac = await crypto.subtle.sign("HMAC", key, enc.encode(signedPayload));
  const hex = Array.from(new Uint8Array(mac)).map(b => b.toString(16).padStart(2, "0")).join("");

  if (hex !== expectedSig) throw new Error("Signatur stimmt nicht ueberein");

  // Timestamp nicht aelter als 5 Minuten
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - parseInt(timestamp)) > 300) throw new Error("Webhook zu alt");

  return JSON.parse(payload);
}
