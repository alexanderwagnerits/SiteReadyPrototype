import { generateWebsite } from "../_lib/generate.js";
import { checkAdminAuth } from "../_lib/auth.js";

export async function onRequestPost({request, env}) {
  try {
    const unauthorized = checkAdminAuth(request, env);
    if (unauthorized) return unauthorized;
    let body;
    try { body = await request.json(); } catch(e) {
      return Response.json({error: "Invalid JSON"}, {status: 400});
    }
    const {order_id} = body;
    if (!order_id) return Response.json({error: "order_id required"}, {status: 400});
    const result = await generateWebsite(order_id, env);
    return Response.json(result);
  } catch(e) {
    return Response.json({error: "Interner Fehler: " + e.message}, {status: 500});
  }
}
