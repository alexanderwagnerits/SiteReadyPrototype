import { generateWebsite } from "../_lib/generate.js";

export async function onRequestPost({request, env}) {
  try {
    const url = new URL(request.url);
    const key = url.searchParams.get("key");
    if (!key || key !== env.ADMIN_SECRET) {
      return Response.json({error: "Unauthorized"}, {status: 401});
    }
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
