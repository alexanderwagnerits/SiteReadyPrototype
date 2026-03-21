export async function onRequestGet({request, env}) {
  const url = new URL(request.url);
  const email = url.searchParams.get("email");
  if (!email) return Response.json({error: "Email required"}, {status: 400});

  // Kunden per E-Mail suchen
  const custResp = await fetch(
    `https://api.stripe.com/v1/customers?email=${encodeURIComponent(email)}&limit=1`,
    {headers: {"Authorization": `Bearer ${env.STRIPE_SECRET_KEY}`}}
  );
  const custData = await custResp.json();
  if (!custData.data || custData.data.length === 0) return Response.json({charges: []});

  // Zahlungen fuer diesen Kunden laden
  const chargesResp = await fetch(
    `https://api.stripe.com/v1/charges?customer=${custData.data[0].id}&limit=20`,
    {headers: {"Authorization": `Bearer ${env.STRIPE_SECRET_KEY}`}}
  );
  const chargesData = await chargesResp.json();

  return Response.json({
    charges: (chargesData.data || []).map(c => ({
      id: c.id,
      amount: c.amount,
      currency: c.currency,
      status: c.status,
      created: c.created,
      description: c.description,
      receipt_url: c.receipt_url,
    }))
  });
}
