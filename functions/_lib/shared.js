/**
 * Shared utilities used across multiple Cloudflare Functions.
 */

function esc(text) {
  if (!text) return "";
  return String(text).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");
}

function normSocial(v) {
  if (!v) return "";
  v = v.trim().replace(/\/+$/, "");
  if (v.startsWith("http")) return v;
  return "https://" + v;
}

module.exports = { esc, normSocial };
