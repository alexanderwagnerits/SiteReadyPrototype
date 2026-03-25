export async function onRequestGet({request, env}) {
  const url = new URL(request.url);
  const customerId = url.searchParams.get("customer_id");
  const returnUrl = url.searchParams.get("return_url") || url.origin + "/portal";

  if (!customerId) return new Response("customer_id required", {status: 400});
  if (!env.STRIPE_SECRET_KEY) return new Response("Stripe not configured", {status: 500});

  const resp = await fetch("https://api.stripe.com/v1/billing_portal/sessions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${env.STRIPE_SECRET_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({customer: customerId, return_url: returnUrl}).toString(),
  });

  const data = await resp.json();
  if (!resp.ok) return new Response(JSON.stringify({error: data.error?.message || "Stripe-Fehler"}), {status: 500, headers: {"Content-Type": "application/json"}});

  return new Response(JSON.stringify({url: data.url}), {headers: {"Content-Type": "application/json"}});
}
