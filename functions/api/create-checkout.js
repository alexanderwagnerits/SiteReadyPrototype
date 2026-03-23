export async function onRequestPost({request, env}) {
  try {
    const {orderId, firmenname, email, plan, trial_expires_at} = await request.json();

    const siteUrl = env.SITE_URL || "https://sitereadyprototype.pages.dev";
    const isYearly = plan === "yearly";

    // Verbleibende Trial-Tage berechnen (mind. 1)
    let trialDays = 7;
    if (trial_expires_at) {
      const remaining = Math.ceil((new Date(trial_expires_at) - Date.now()) / (1000 * 60 * 60 * 24));
      trialDays = Math.max(1, remaining);
    }

    const params = new URLSearchParams({
      "mode": "subscription",
      "payment_method_types[]": "card",
      "line_items[0][price_data][currency]": "eur",
      "line_items[0][price_data][recurring][interval]": isYearly ? "year" : "month",
      "line_items[0][price_data][unit_amount]": isYearly ? "18360" : "1800",
      "line_items[0][price_data][product_data][name]": isYearly ? "SiteReady Jahresabo" : "SiteReady Monatsabo",
      "line_items[0][price_data][product_data][description]": isYearly
        ? `Professionelle Website fuer ${firmenname} – jaehrlich (15% Rabatt)`
        : `Professionelle Website fuer ${firmenname} – monatlich kuendbar`,
      "line_items[0][quantity]": "1",
      "customer_email": email || "",
      "metadata[order_id]": orderId || "",
      "metadata[plan]": plan || "monthly",
      "subscription_data[trial_period_days]": String(trialDays),
      "subscription_data[metadata][order_id]": orderId || "",
      "subscription_data[metadata][plan]": plan || "monthly",
      "success_url": `${siteUrl}/portal?subscription=success`,
      "cancel_url": `${siteUrl}/portal`,
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
