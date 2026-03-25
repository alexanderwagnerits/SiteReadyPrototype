export async function onRequestPost({request, env}) {
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
    try { event = JSON.parse(body); } catch(e) {
      return new Response("JSON ungueltig", {status: 400});
    }
  }

  const sb = env.SUPABASE_URL;
  const sbKey = env.SUPABASE_SERVICE_KEY;
  const headers = {
    "Content-Type": "application/json",
    "apikey": sbKey,
    "Authorization": `Bearer ${sbKey}`,
    "Prefer": "return=minimal",
  };

  // Hilfsfunktion: Order per orderId updaten
  const patchOrder = async (orderId, patch) => {
    if (!orderId) return;
    await fetch(`${sb}/rest/v1/orders?id=eq.${orderId}`, {
      method: "PATCH", headers,
      body: JSON.stringify(patch),
    });
  };

  // Hilfsfunktion: Order per stripe_customer_id finden
  const findOrderByCustomer = async (customerId) => {
    const r = await fetch(
      `${sb}/rest/v1/orders?stripe_customer_id=eq.${encodeURIComponent(customerId)}&select=id,status&limit=1`,
      {headers: {"apikey": sbKey, "Authorization": `Bearer ${sbKey}`}}
    );
    const rows = await r.json();
    return rows[0] || null;
  };

  // checkout.session.completed → stripe_customer_id + subscription_id speichern
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId = session.metadata?.order_id;
    if (orderId && sb && sbKey) {
      await patchOrder(orderId, {
        stripe_customer_id: session.customer || null,
        subscription_id: session.subscription || null,
        subscription_plan: session.metadata?.plan || "monthly",
      });
    }
  }

  // invoice.payment_succeeded → erster Zahlungseingang nach Trial → status: live + subscription_status: active
  if (event.type === "invoice.payment_succeeded") {
    const invoice = event.data.object;
    const customerId = invoice.customer;
    if (customerId && sb && sbKey) {
      const order = await findOrderByCustomer(customerId);
      if (order) {
        const patch = {subscription_status: "active"};
        if (order.status === "trial") patch.status = "live";
        await patchOrder(order.id, patch);
      }
    }
  }

  // invoice.payment_failed → Zahlung fehlgeschlagen → subscription_status: past_due
  if (event.type === "invoice.payment_failed") {
    const invoice = event.data.object;
    const customerId = invoice.customer;
    if (customerId && sb && sbKey) {
      const order = await findOrderByCustomer(customerId);
      if (order) {
        await patchOrder(order.id, {subscription_status: "past_due"});
      }
    }
  }

  // customer.subscription.updated → Status synchronisieren (z.B. past_due, unpaid, active)
  if (event.type === "customer.subscription.updated") {
    const sub = event.data.object;
    const customerId = sub.customer;
    const stripeStatus = sub.status; // active | past_due | unpaid | canceled | trialing
    if (customerId && sb && sbKey && stripeStatus) {
      const order = await findOrderByCustomer(customerId);
      if (order) {
        const mapped = stripeStatus === "active" ? "active" : stripeStatus === "past_due" || stripeStatus === "unpaid" ? "past_due" : stripeStatus === "canceled" ? "canceled" : null;
        if (mapped) await patchOrder(order.id, {subscription_status: mapped});
      }
    }
  }

  // customer.subscription.deleted → Abo gekuendigt/expired → wenn live: offline + canceled
  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object;
    const customerId = sub.customer;
    if (customerId && sb && sbKey) {
      const order = await findOrderByCustomer(customerId);
      if (order && order.status === "live") {
        await patchOrder(order.id, {status: "offline", subscription_status: "canceled"});
      }
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

  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - parseInt(timestamp)) > 300) throw new Error("Webhook zu alt");

  return JSON.parse(payload);
}
