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
  if (/^javascript:/i.test(v)) return "";
  if (!v.startsWith("http")) v = "https://" + v;
  if (!/^https?:\/\/[^\s]+\.[^\s]+/.test(v)) return "";
  return v;
}

module.exports = { esc, normSocial };
