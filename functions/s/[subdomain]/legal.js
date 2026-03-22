const PALETTES = {
  elektro:{p:"#0c1d3d",a:"#f59e0b",bg:"#f8faff"}, installateur:{p:"#1a3050",a:"#dc2626",bg:"#f8fafc"},
  maler:{p:"#2c3e50",a:"#e67e22",bg:"#fffef9"}, tischler:{p:"#4a2c0a",a:"#d97706",bg:"#fefaf0"},
  fliesenleger:{p:"#0f3460",a:"#0891b2",bg:"#f0fdfe"}, schlosser:{p:"#1c1c2e",a:"#64748b",bg:"#f1f5f9"},
  dachdecker:{p:"#3b1f0a",a:"#b45309",bg:"#fff8f0"}, zimmerei:{p:"#1a3c28",a:"#a16207",bg:"#f7fdf0"},
  maurer:{p:"#2d2d2d",a:"#ea580c",bg:"#fafafa"}, bodenleger:{p:"#2d1b69",a:"#b45309",bg:"#fdf8ff"},
  glaser:{p:"#0c4a6e",a:"#0891b2",bg:"#f0f9ff"}, gaertner:{p:"#14532d",a:"#15803d",bg:"#f0fdf4"},
  klima:{p:"#0c2340",a:"#0284c7",bg:"#f0f9ff"}, reinigung:{p:"#0f2942",a:"#0ea5e9",bg:"#f8fbff"},
  sonstige:{p:"#1e293b",a:"#3b82f6",bg:"#f8fafc"},
};

function buildImpressumRows(o) {
  const uf = o.unternehmensform || "";
  const ufSuffix = {eu:"e.U.",gmbh:"GmbH",og:"OG",kg:"KG",ag:"AG"};
  const firmaVoll = o.firmenname + (ufSuffix[uf] ? ` ${ufSuffix[uf]}` : "");
  const sitz = [o.plz, o.ort].filter(Boolean).join(" ");
  const adresse = [o.adresse, sitz].filter(Boolean).join(", ");
  const rows = [];
  const add = (l, v) => { if (v && String(v).trim()) rows.push([l, String(v).trim()]); };

  add("Medieninhaber & Herausgeber", firmaVoll);

  if (uf === "einzelunternehmen") {
    add("Inhaber", o.firmenname); add("Anschrift", adresse);
    add("Unternehmensgegenstand", o.unternehmensgegenstand);
  } else if (uf === "eu") {
    add("Sitz", sitz); add("Firmenbuchnummer", o.firmenbuchnummer);
    add("Firmenbuchgericht", o.firmenbuchgericht);
    if (o.liquidation) add("Hinweis", "Gesellschaft in Liquidation");
  } else if (uf === "gmbh") {
    add("Sitz", sitz); add("Firmenbuchnummer", o.firmenbuchnummer);
    add("Firmenbuchgericht", o.firmenbuchgericht);
    add("Gesch\u00e4ftsf\u00fchrer", o.geschaeftsfuehrer);
    if (o.liquidation) add("Hinweis", "Gesellschaft in Liquidation");
  } else if (uf === "og" || uf === "kg") {
    add("Sitz", sitz); add("Firmenbuchnummer", o.firmenbuchnummer);
    add("Firmenbuchgericht", o.firmenbuchgericht);
    if (o.liquidation) add("Hinweis", "Gesellschaft in Liquidation");
  } else if (uf === "ag") {
    add("Sitz", sitz); add("Firmenbuchnummer", o.firmenbuchnummer);
    add("Firmenbuchgericht", o.firmenbuchgericht);
    add("Vorstand", o.vorstand); add("Aufsichtsrat", o.aufsichtsrat);
    if (o.liquidation) add("Hinweis", "Gesellschaft in Liquidation");
  } else if (uf === "verein") {
    add("Vereinsname", o.firmenname); add("Sitz", sitz);
    add("ZVR-Zahl", o.zvr_zahl);
    add("Vertretungsbefugte Organe", o.vertretungsorgane);
  } else if (uf === "gesnbr") {
    add("Bezeichnung", o.firmenname); add("Anschrift", adresse);
    add("Unternehmensgegenstand", o.unternehmensgegenstand);
    add("Gesellschafter", o.gesellschafter);
  } else {
    add("Anschrift", adresse);
  }

  add("Telefon", o.telefon); add("E-Mail", o.email);
  add("UID-Nummer", o.uid_nummer); add("GISA-Zahl", o.gisazahl);
  if (o.aufsichtsbehoerde) {
    add("Aufsichtsbeh\u00f6rde", o.aufsichtsbehoerde);
  } else if (uf !== "verein" && uf !== "gesnbr") {
    add("Aufsichtsbeh\u00f6rde", "Zust\u00e4ndige Bezirksverwaltungsbeh\u00f6rde");
  }
  if (o.kammer_berufsrecht) {
    add("Kammer / Berufsrecht", o.kammer_berufsrecht);
  } else if (uf !== "verein" && uf !== "gesnbr" && uf !== "einzelunternehmen") {
    add("Mitglied der", "Wirtschaftskammer \u00d6sterreich");
    add("Berufsrecht", "Gewerbeordnung (www.ris.bka.gv.at)");
  }
  return {rows, firmaVoll, adresse};
}

function legalShell(o, pal, subdomain, title, content) {
  const year = new Date().getFullYear();
  const tel = o.telefon || "";
  const telHref = tel ? `tel:${tel.replace(/\s/g,"")}` : "";
  return `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>${title} &ndash; ${o.firmenname}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:system-ui,-apple-system,sans-serif;background:#f8fafc;color:#1e293b;line-height:1.6}
.topbar{background:${pal.p};padding:16px 24px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px}
.topbar a{color:rgba(255,255,255,.8);text-decoration:none;font-size:.85rem}
.topbar-logo{color:#fff;font-weight:800;font-size:1rem;text-decoration:none}
.topbar-links{display:flex;gap:20px;align-items:center}
.back{color:rgba(255,255,255,.7);font-size:.82rem}
.wrap{max-width:800px;margin:0 auto;padding:48px 24px 80px}
h1{font-size:1.6rem;font-weight:800;color:${pal.p};margin-bottom:32px;padding-bottom:16px;border-bottom:2px solid ${pal.a}}
table{width:100%;border-collapse:collapse;margin-bottom:32px}
td{padding:9px 16px 9px 0;font-size:.9rem;vertical-align:top;border-bottom:1px solid #e8edf2}
td:first-child{font-weight:600;color:${pal.p};width:220px;white-space:nowrap}
h2{font-size:1.1rem;font-weight:700;color:${pal.p};margin:32px 0 12px}
p{font-size:.9rem;color:#475569;line-height:1.75;margin-bottom:12px}
.footer-bar{background:${pal.p};color:rgba(255,255,255,.5);text-align:center;padding:16px;font-size:.78rem;margin-top:48px}
.footer-bar a{color:rgba(255,255,255,.5);text-decoration:none;margin:0 12px}
</style>
</head>
<body>
<div class="topbar">
<a href="/s/${subdomain}" class="topbar-logo">${o.firmenname}</a>
<div class="topbar-links">
<a href="/s/${subdomain}" class="back">&larr; Zur\u00fcck zur Website</a>
${tel ? `<a href="${telHref}" style="color:#fff;font-weight:700">${tel}</a>` : ""}
</div>
</div>
<div class="wrap">
${content}
</div>
<div class="footer-bar">
&copy; ${year} ${o.firmenname} &nbsp;&mdash;&nbsp;
<a href="/s/${subdomain}/impressum">Impressum</a>
<a href="/s/${subdomain}/datenschutz">Datenschutz</a>
</div>
</body>
</html>`;
}

export async function buildLegalPage(subdomain, page, env) {
  if (!subdomain) return new Response("Not Found", {status: 404});

  const r = await fetch(
    `${env.SUPABASE_URL}/rest/v1/orders?subdomain=eq.${encodeURIComponent(subdomain)}&select=*`,
    {headers: {"apikey": env.SUPABASE_SERVICE_KEY, "Authorization": `Bearer ${env.SUPABASE_SERVICE_KEY}`}}
  );
  if (!r.ok) return new Response("Fehler", {status: 502});
  const rows = await r.json();
  if (!rows.length) return new Response("Nicht gefunden", {status: 404});

  const o = rows[0];
  const pal = PALETTES[o.branche] || PALETTES.sonstige;

  let content, title;

  if (page === "impressum") {
    title = "Impressum";
    const {rows: irows, firmaVoll, adresse} = buildImpressumRows(o);
    const tRows = irows.map(([l,v]) => `<tr><td>${l}</td><td>${v}</td></tr>`).join("");
    content = `<h1>Impressum</h1><table>${tRows}</table>
<p style="font-size:.8rem;color:#94a3b8;margin-top:24px">Gem\u00e4\u00df \u00a7 5 ECG (E-Commerce-Gesetz) und \u00a7 25 MedienG.</p>`;
  } else {
    title = "Datenschutzerkl\u00e4rung";
    const ufSuffix = {eu:"e.U.",gmbh:"GmbH",og:"OG",kg:"KG",ag:"AG"};
    const uf = o.unternehmensform || "";
    const firmaVoll = o.firmenname + (ufSuffix[uf] ? ` ${ufSuffix[uf]}` : "");
    const adresse = [o.adresse, [o.plz, o.ort].filter(Boolean).join(" ")].filter(Boolean).join(", ");
    content = `<h1>Datenschutzerkl\u00e4rung</h1>
<h2>Verantwortlicher</h2>
<p>${firmaVoll}, ${adresse}${o.email ? `, ${o.email}` : ""}${o.telefon ? `, ${o.telefon}` : ""}</p>
<h2>Welche Daten wir erheben</h2>
<p>Diese Website erhebt keine personenbezogenen Daten automatisch. Wenn Sie uns per Telefon oder E-Mail kontaktieren, speichern wir nur die von Ihnen freiwillig \u00fcbermittelten Daten (Name, Kontaktdaten, Anliegen) zur Bearbeitung Ihrer Anfrage.</p>
<h2>Rechtsgrundlage</h2>
<p>Die Verarbeitung erfolgt auf Basis von Art. 6 Abs. 1 lit. b DSGVO (Vertragsanbahnung bzw. -erf\u00fcllung) sowie Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Beantwortung von Anfragen).</p>
<h2>Cookies &amp; Tracking</h2>
<p>Diese Website verwendet keine Cookies und kein Tracking. Es werden keine Analyse- oder Werbe-Tools eingesetzt.</p>
<h2>Google Fonts</h2>
<p>Diese Website l\u00e4dt Schriftarten von Google Fonts (Google LLC, USA). Dabei wird Ihre IP-Adresse an Google \u00fcbertragen. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO. Weitere Informationen: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">policies.google.com/privacy</a></p>
<h2>Ihre Rechte</h2>
<p>Sie haben das Recht auf Auskunft, Berichtigung, L\u00f6schung, Einschr\u00e4nkung der Verarbeitung sowie Daten\u00fcbertragbarkeit. Beschwerden k\u00f6nnen Sie bei der \u00f6sterreichischen Datenschutzbeh\u00f6rde (dsb.gv.at) einreichen.</p>
<h2>Kontakt</h2>
<p>Bei Fragen zum Datenschutz: ${o.email ? `<a href="mailto:${o.email}">${o.email}</a>` : o.firmenname}</p>`;
  }

  const html = legalShell(o, pal, subdomain, title, content);
  return new Response(html, {headers: {"Content-Type": "text/html; charset=utf-8"}});
}
