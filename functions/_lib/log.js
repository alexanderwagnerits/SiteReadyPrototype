/**
 * Shared Logging Helper fuer Cloudflare Functions.
 * Loggt in Supabase activity_log (order-bezogen) und error_logs (Fehler).
 *
 * Usage:
 *   const log = createLogger(env);
 *   await log.info(orderId, "generate_start", {stil: "klassisch"});
 *   await log.error("import_failed", {url, message: e.message});
 *   log.time("generate"); ... log.timeEnd("generate", orderId, "generate_done");
 */

export function createLogger(env) {
  const sb = env.SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_KEY;
  if (!sb || !key) return noopLogger;

  const headers = {
    "Content-Type": "application/json",
    "apikey": key,
    "Authorization": `Bearer ${key}`,
    "Prefer": "return=minimal",
  };

  const timers = {};

  return {
    /** Order-bezogenes Event loggen (activity_log) */
    async info(order_id, action, details = null) {
      try {
        await fetch(`${sb}/rest/v1/activity_log`, {
          method: "POST", headers,
          body: JSON.stringify({
            order_id, action,
            details: details ? JSON.stringify(details) : null,
            actor: "system",
          }),
        });
      } catch (_) {}
    },

    /** Fehler loggen (error_logs) — kein order_id noetig */
    async error(source, details = {}) {
      try {
        await fetch(`${sb}/rest/v1/error_logs`, {
          method: "POST", headers,
          body: JSON.stringify({
            message: String(details.message || details.error || source).slice(0, 2000),
            source: String(source).slice(0, 100),
            stack: details.stack ? String(details.stack).slice(0, 4000) : null,
            url: details.url || null,
            user_agent: details.user_agent || "cloudflare-function",
          }),
        });
      } catch (_) {}
    },

    /** Timer starten */
    time(label) {
      timers[label] = Date.now();
    },

    /** Timer beenden + als activity_log speichern */
    async timeEnd(label, order_id, action) {
      const start = timers[label];
      if (!start) return;
      const durationMs = Date.now() - start;
      delete timers[label];
      await this.info(order_id, action, { duration_ms: durationMs });
    },
  };
}

const noopLogger = {
  async info() {},
  async error() {},
  time() {},
  async timeEnd() {},
};
