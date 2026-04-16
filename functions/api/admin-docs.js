import { checkAdminAuth } from "../_lib/auth.js";

export async function onRequest({request, env}) {
  const unauthorized = checkAdminAuth(request, env);
  if (unauthorized) return unauthorized;

  const h = {
    "apikey": env.SUPABASE_SERVICE_KEY,
    "Authorization": `Bearer ${env.SUPABASE_SERVICE_KEY}`,
    "Content-Type": "application/json",
  };

  if (request.method === "GET") {
    const r = await fetch(`${env.SUPABASE_URL}/rest/v1/docs?select=*&order=sort_order.asc`, {headers: h});
    return Response.json(await r.json());
  }

  if (request.method === "POST") {
    const body = await request.json();
    if (body.id) {
      const {id, ...fields} = body;
      fields.updated_at = new Date().toISOString();
      await fetch(`${env.SUPABASE_URL}/rest/v1/docs?id=eq.${id}`, {
        method: "PATCH",
        headers: {...h, "Prefer": "return=minimal"},
        body: JSON.stringify(fields),
      });
      return Response.json({ok: true});
    } else {
      const r = await fetch(`${env.SUPABASE_URL}/rest/v1/docs`, {
        method: "POST",
        headers: {...h, "Prefer": "return=representation"},
        body: JSON.stringify(body),
      });
      const rows = await r.json();
      return Response.json(rows[0] || {});
    }
  }

  if (request.method === "DELETE") {
    const {id} = await request.json();
    await fetch(`${env.SUPABASE_URL}/rest/v1/docs?id=eq.${id}`, {method: "DELETE", headers: h});
    return Response.json({ok: true});
  }

  return Response.json({error: "Method not allowed"}, {status: 405});
}
