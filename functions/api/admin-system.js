export async function onRequestGet({request, env}) {
  const url = new URL(request.url);
  const key = url.searchParams.get("key");
  if (!key || key !== env.ADMIN_SECRET) {
    return Response.json({error: "Unauthorized"}, {status: 401});
  }

  const results = {};

  // Supabase
  try {
    const t0 = Date.now();
    const r = await fetch(`${env.SUPABASE_URL}/rest/v1/orders?select=id&limit=1`, {
      headers: {"apikey": env.SUPABASE_SERVICE_KEY, "Authorization": `Bearer ${env.SUPABASE_SERVICE_KEY}`},
    });
    results.supabase = {ok: r.ok, latency: Date.now() - t0, status: r.status};
  } catch(e) {
    results.supabase = {ok: false, error: e.message};
  }

  // Stripe
  try {
    const r = await fetch("https://api.stripe.com/v1/balance", {
      headers: {"Authorization": `Bearer ${env.STRIPE_SECRET_KEY}`},
    });
    const j = await r.json();
    results.stripe = {ok: r.ok, livemode: j.livemode, error: j.error?.message};
  } catch(e) {
    results.stripe = {ok: false, error: e.message};
  }

  // Anthropic + Rate Limits
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {"x-api-key": env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01", "Content-Type": "application/json"},
      body: JSON.stringify({model:"claude-sonnet-4-6",max_tokens:1,messages:[{role:"user",content:"hi"}]}),
    });
    const rateLimits = {
      requests_limit: r.headers.get("anthropic-ratelimit-requests-limit"),
      requests_remaining: r.headers.get("anthropic-ratelimit-requests-remaining"),
      requests_reset: r.headers.get("anthropic-ratelimit-requests-reset"),
      tokens_limit: r.headers.get("anthropic-ratelimit-input-tokens-limit"),
      tokens_remaining: r.headers.get("anthropic-ratelimit-input-tokens-remaining"),
      tokens_reset: r.headers.get("anthropic-ratelimit-input-tokens-reset"),
      output_tokens_limit: r.headers.get("anthropic-ratelimit-output-tokens-limit"),
      output_tokens_remaining: r.headers.get("anthropic-ratelimit-output-tokens-remaining"),
    };
    const tokLimit = parseInt(rateLimits.tokens_limit) || 0;
    const tier = tokLimit >= 400000 ? 4 : tokLimit >= 160000 ? 3 : tokLimit >= 80000 ? 2 : 1;
    results.anthropic = {ok: r.ok, status: r.status, tier, rate_limits: rateLimits};
    if (!r.ok) {
      const j = await r.json().catch(() => ({}));
      results.anthropic.error = j.error?.message;
      results.anthropic.billing = r.status === 402 || (j.error?.type || "").includes("credit");
    }
  } catch(e) {
    results.anthropic = {ok: false, error: e.message};
  }

  // Env Vars pruefen
  const required = ["SUPABASE_URL","SUPABASE_SERVICE_KEY","STRIPE_SECRET_KEY","STRIPE_WEBHOOK_SECRET","ANTHROPIC_API_KEY","ADMIN_SECRET","SITE_URL"];
  results.envvars = {};
  required.forEach(k => { results.envvars[k] = !!env[k]; });

  return Response.json(results);
}
