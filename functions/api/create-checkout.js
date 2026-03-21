export async function onRequestPost({request, env}) {
  try {
    const {orderId, firmenname, email} = await request.json();

    const siteUrl = env.SITE_URL || "https://sitereadyprototype.pages.dev";

    const params = new URLSearchParams({
      "mode": "payment",
      "payment_method_types[]": "card",
      "line_items[0][price_data][currency]": "eur",
      "line_items[0][price_data][product_data][name]": "SiteReady Standard",
      "line_items[0][price_data][product_data][description]": `Professionelle Website fuer ${firmenname} – 1. Monat`,
      "line_items[0][price_data][unit_amount]": "1800",
      "line_items[0][quantity]": "1",
      "customer_email": email || "",
      "metadata[order_id]": orderId || "",
      "success_url": `${siteUrl}?payment=success&order_id=${orderId}`,
      "cancel_url": `${siteUrl}?payment=canceled`,
    });

    const resp = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const session = await resp.json();

    if (session.error) {
      return Response.json({error: session.error.message}, {status: 400});
    }

    return Response.json({url: session.url});
  } catch(e) {
    return Response.json({error: e.message}, {status: 500});
  }
}
