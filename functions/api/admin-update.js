import { checkAdminAuth } from "../_lib/auth.js";

export async function onRequestPost({request, env}) {
  const unauthorized = checkAdminAuth(request, env);
  if (unauthorized) return unauthorized;

  const body = await request.json();
  const {id, table = "orders", ...fields} = body;
  if (!id) return Response.json({error: "ID required"}, {status: 400});

  const ALLOWED_TABLES = ["orders", "support_requests", "docs", "activity_log"];
  if (!ALLOWED_TABLES.includes(table)) return Response.json({error: "Table not allowed"}, {status: 400});

  const resp = await fetch(
    `${env.SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "apikey": env.SUPABASE_SERVICE_KEY,
        "Authorization": `Bearer ${env.SUPABASE_SERVICE_KEY}`,
        "Prefer": "return=minimal",
      },
      body: JSON.stringify(fields),
    }
  );

  return Response.json({ok: resp.ok});
}
