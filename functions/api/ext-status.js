export async function onRequestGet({request,env}){
  const url=new URL(request.url);
  const key=url.searchParams.get("key");
  if(key!==env.ADMIN_SECRET)return new Response("Unauthorized",{status:401});

  const sources=[
    {key:"anthropic",url:"https://status.anthropic.com/api/v2/status.json"},
    {key:"cloudflare",url:"https://www.cloudflarestatus.com/api/v2/status.json"},
    {key:"supabase",url:"https://status.supabase.com/api/v2/status.json"},
    {key:"stripe",url:"https://www.stripestatus.com/api/v2/status.json"},
  ];

  const results=await Promise.allSettled(
    sources.map(s=>fetch(s.url,{headers:{"User-Agent":"SiteReady-StatusCheck/1.0"},signal:AbortSignal.timeout(5000)}).then(r=>r.json()))
  );

  const out={};
  sources.forEach((s,i)=>{
    out[s.key]=results[i].status==="fulfilled"?(results[i].value||null):null;
  });

  // API-Keys Verfügbarkeit (ohne die Keys selbst zu zeigen)
  out.api_keys={
    anthropic: !!env.ANTHROPIC_API_KEY,
    supabase: !!env.SUPABASE_SERVICE_KEY,
    stripe: !!env.STRIPE_SECRET_KEY,
    firecrawl: !!env.FIRECRAWL_API_KEY,
    admin: !!env.ADMIN_SECRET,
  };

  return new Response(JSON.stringify(out),{
    headers:{"Content-Type":"application/json","Cache-Control":"no-store"},
  });
}
