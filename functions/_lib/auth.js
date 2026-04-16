/**
 * Shared Admin-Auth Helper.
 *
 * Prueft den ADMIN_SECRET query-param. Gibt 401-Response zurueck wenn ungueltig,
 * sonst null (Request kann fortfahren).
 *
 * Usage:
 *   const unauthorized = checkAdminAuth(request, env);
 *   if (unauthorized) return unauthorized;
 */

export function checkAdminAuth(request, env) {
  const url = new URL(request.url);
  const key = url.searchParams.get("key");
  if (!key || key !== env.ADMIN_SECRET) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
