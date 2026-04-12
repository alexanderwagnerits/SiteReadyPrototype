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

const OEZ_LABELS = {
  "mo-fr-8-17": "Mo\u2013Fr 8:00\u201317:00",
  "mo-fr-7-16": "Mo\u2013Fr 7:00\u201316:00",
  "mo-fr-8-18": "Mo\u2013Fr 8:00\u201318:00",
  "mo-sa-8-17": "Mo\u2013Sa 8:00\u201317:00",
  "mo-sa-8-12": "Mo\u2013Sa 8:00\u201312:00",
  "vereinbarung": "Nach Vereinbarung",
};

module.exports = { esc, normSocial, OEZ_LABELS };
