/**
 * SiteReady — "Klassisch" Template
 * Serious, trustworthy, timeless.
 */

export function buildKlassischTemplate(data) {
  const {
    firmenname, brancheLabel, einsatzgebiet, kurzbeschreibung,
    badgesHtml, ctaPrimary, ctaPrimaryHref, ctaSecondary,
    trustBar, leistungenIntro, preislisteHtml,
    ueberUnsText, vorteileHtml, oeffnungszeiten,
    adresseVoll, telDisplay, telHref, email,
    socialHtml, buchungslinkHtml, stickyCtaHtml,
    metaTitle, metaDesc, siteUrl, fontUrl,
    primary, accent, bg, sep,
    kontaktCtaHeadline, kontaktCtaText,
  } = data;

  return `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<meta name="description" content="${metaDesc}">
<meta property="og:title" content="${metaTitle}">
<meta property="og:description" content="${metaDesc}">
<meta property="og:type" content="website">
<meta property="og:url" content="${siteUrl}">
<link rel="canonical" href="${siteUrl}">
<title>${metaTitle}</title>
<style>
@import url('${fontUrl}');
*{margin:0;padding:0;box-sizing:border-box}
:root{
--primary:${primary};
--accent:${accent};
--bg:${bg};
--sep:${sep};
--text:#1f2937;
--textMuted:#64748b;
--white:#fff;
--r:4px;
--rLg:8px;
--font:'Inter',system-ui,-apple-system,sans-serif;
--maxW:1060px;
}
html{scroll-behavior:smooth}
body{font-family:var(--font);color:var(--text);line-height:1.6;-webkit-font-smoothing:antialiased;background:var(--white)}
img{max-width:100%;display:block}
a{color:inherit}
.w{max-width:var(--maxW);margin:0 auto;padding:0 28px}

/* ── Hero ── */
.hero{min-height:92vh;background:${primary};color:#fff;display:flex;align-items:center;position:relative}
.hero-inner{position:relative;z-index:1;width:100%;max-width:var(--maxW);margin:0 auto;padding:120px 28px 80px}
.hero-badges{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:32px}
.hero-badge{padding:6px 14px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.1);border-radius:var(--r);font-size:.72rem;font-weight:600;color:rgba(255,255,255,.75);letter-spacing:.02em}
.hero h1{font-size:clamp(2.4rem,6vw,4rem);font-weight:800;line-height:1.05;letter-spacing:-.04em;margin-bottom:16px;max-width:680px}
.hero-sub{font-size:1rem;color:rgba(255,255,255,.5);font-weight:400;margin-bottom:32px}
.hero-desc{font-size:.92rem;color:rgba(255,255,255,.4);max-width:480px;margin-bottom:40px;line-height:1.75}
.hero-btns{display:flex;flex-wrap:wrap;gap:12px;margin-bottom:40px}
.btn{display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:14px 32px;font-size:.88rem;font-weight:600;text-decoration:none;border-radius:var(--r);transition:all .2s ease;cursor:pointer;border:none;font-family:var(--font)}
.btn-accent{background:var(--accent);color:#fff}
.btn-accent:hover{opacity:.85}
.btn-ghost{background:transparent;color:rgba(255,255,255,.8);border:1.5px solid rgba(255,255,255,.2)}
.btn-ghost:hover{border-color:rgba(255,255,255,.5);color:#fff}
.hero-trust{font-size:.78rem;color:rgba(255,255,255,.35);line-height:1.8}
@media(max-width:640px){
  .hero-btns{flex-direction:column}
  .hero-btns .btn{width:100%;text-align:center}
  .hero-inner{padding:80px 20px 56px}
}

/* ── Leistungen ── */
.leist{padding:96px 0;background:var(--white)}
.leist-top{margin-bottom:48px}
.leist-label{font-size:.68rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--accent);margin-bottom:12px}
.leist h2{font-size:clamp(1.5rem,3vw,2.1rem);font-weight:800;color:var(--primary);letter-spacing:-.03em;margin-bottom:12px}
.leist-intro{color:var(--textMuted);font-size:.9rem;max-width:520px;line-height:1.7}
@media(min-width:900px){.leist{padding:120px 0}}

/* ── Über uns ── */
.ueber{padding:96px 0;background:var(--primary);color:#fff}
.ueber-grid{display:grid;gap:48px}
@media(min-width:900px){.ueber-grid{grid-template-columns:1fr 1fr;gap:72px;align-items:start}.ueber{padding:120px 0}}
.ueber h2{font-size:clamp(1.5rem,3vw,2.1rem);font-weight:800;letter-spacing:-.03em;margin-bottom:20px;color:#fff}
.ueber-text{font-size:.9rem;line-height:1.85;opacity:.7;margin-bottom:28px}
.ueber-vorteile{list-style:none;display:flex;flex-direction:column;gap:12px}
.ueber-vorteile li{font-size:.88rem;font-weight:500;opacity:.85;padding-left:20px;position:relative}
.ueber-vorteile li::before{content:'';position:absolute;left:0;top:8px;width:6px;height:6px;background:var(--accent);border-radius:1px}
.info-card{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:var(--rLg);padding:32px 28px}
.info-card h3{font-size:.72rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;opacity:.4;margin-bottom:24px}
.info-row{padding:14px 0;border-bottom:1px solid rgba(255,255,255,.08)}
.info-row:last-child{border-bottom:none}
.info-row-label{font-size:.65rem;font-weight:600;text-transform:uppercase;letter-spacing:.1em;opacity:.4;margin-bottom:4px}
.info-row-value{font-size:.9rem;font-weight:600}
.info-row-value a{color:#fff;text-decoration:none}
.info-row-value a:hover{opacity:.7}

/* ── Kontakt ── */
.kontakt{padding:96px 0;background:var(--bg)}
.kontakt-grid{display:grid;gap:48px}
@media(min-width:900px){.kontakt-grid{grid-template-columns:1fr 1fr;gap:72px;align-items:start}.kontakt{padding:120px 0}}
.kontakt h2{font-size:clamp(1.5rem,3vw,2.1rem);font-weight:800;color:var(--primary);letter-spacing:-.03em;margin-bottom:28px}
.kontakt-item{margin-bottom:20px}
.kontakt-item-label{font-size:.65rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--textMuted);margin-bottom:5px}
.kontakt-item-value{font-size:.9rem;font-weight:500}
.kontakt-tel{font-size:1.2rem;font-weight:800;color:var(--primary);text-decoration:none;display:inline-block;margin:4px 0}
.kontakt-tel:hover{color:var(--accent)}
.kontakt-email{color:var(--primary);text-decoration:none;font-weight:600}
.kontakt-email:hover{color:var(--accent)}
.kontakt-social{display:flex;gap:10px;margin-top:12px}
.kontakt-social a{display:flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:var(--r);border:1px solid var(--sep);color:var(--primary);text-decoration:none;transition:all .2s}
.kontakt-social a:hover{background:var(--primary);color:#fff;border-color:var(--primary)}
.k-form{background:var(--white);border:1px solid var(--sep);border-radius:var(--rLg);padding:32px 28px}
.k-form h3{font-size:1rem;font-weight:800;color:var(--primary);margin-bottom:20px}
.k-form label{display:block;font-size:.65rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--textMuted);margin-bottom:5px}
.k-form input,.k-form textarea{width:100%;padding:11px 14px;border:1.5px solid var(--sep);border-radius:var(--r);font-size:.88rem;font-family:var(--font);background:#fff;color:var(--text);outline:none;transition:border-color .2s;box-sizing:border-box}
.k-form input:focus,.k-form textarea:focus{border-color:var(--accent)}
.k-form textarea{resize:vertical}
.k-form-row{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px}
.k-form-field{margin-bottom:12px}
.k-form button{background:var(--accent);color:#fff;border:none;padding:13px;border-radius:var(--r);font-size:.88rem;font-weight:700;cursor:pointer;font-family:var(--font);width:100%;min-height:48px;transition:opacity .2s}
.k-form button:hover{opacity:.85}
.k-form-ok{display:none;text-align:center;padding:40px 20px}
.k-form-ok h4{font-size:1.1rem;font-weight:800;color:var(--primary);margin:12px 0 6px}
.k-form-ok p{color:var(--textMuted);font-size:.88rem}
@media(max-width:640px){.k-form-row{grid-template-columns:1fr}}

/* ── Termin CTA ── */
.termin-cta{padding:80px 0;background:var(--primary);color:#fff;text-align:center}
.termin-cta h2{font-size:clamp(1.3rem,3vw,1.8rem);font-weight:800;margin-bottom:10px;color:#fff}
.termin-cta p{font-size:.9rem;opacity:.5;margin-bottom:28px}

/* ── Sticky Mobile CTA ── */
.sticky-mob{display:none;position:fixed;bottom:0;left:0;right:0;z-index:900;background:var(--accent);text-align:center}
.sticky-mob a{color:#fff;text-decoration:none;font-weight:700;font-size:.9rem;display:block;min-height:52px;line-height:52px}
@media(max-width:640px){.sticky-mob{display:block}body{padding-bottom:52px}}
</style>
</head>
<body>
<!-- NAV -->

<section class="hero" id="sr-hero">
<div class="hero-inner">
<!-- LOGO -->
<div class="hero-badges">${badgesHtml}</div>
<h1>${firmenname}</h1>
<p class="hero-sub">${brancheLabel} &ndash; ${einsatzgebiet}</p>
<p class="hero-desc">${kurzbeschreibung}</p>
<div class="hero-btns">
<a href="${ctaPrimaryHref}" class="btn btn-accent">${ctaPrimary}</a>
<a href="#leistungen" class="btn btn-ghost">${ctaSecondary}</a>
</div>
<div class="hero-trust">${trustBar}</div>
</div>
</section>

<section class="leist" id="leistungen">
<div class="w">
<div class="leist-top">
<div class="leist-label">Leistungen</div>
<h2>Was wir f\u00fcr Sie tun</h2>
<p class="leist-intro">${leistungenIntro}</p>
</div>
<!-- LEISTUNGEN -->
${preislisteHtml}
</div>
</section>

<!-- FOTO_BAND -->

<section class="ueber" id="ueber-uns">
<div class="w">
<div class="ueber-grid">
<div>
<h2>\u00dcber ${firmenname}</h2>
<p class="ueber-text">{{UEBER_UNS_TEXT}}</p>
<ul class="ueber-vorteile">{{VORTEILE}}</ul>
</div>
<div class="info-card">
<h3>Auf einen Blick</h3>
<div class="info-row">
<div class="info-row-label">\u00d6ffnungszeiten</div>
<div class="info-row-value">{{OEFFNUNGSZEITEN}}</div>
</div>
<div class="info-row">
<div class="info-row-label">Einsatzgebiet</div>
<div class="info-row-value">${einsatzgebiet}</div>
</div>
<div class="info-row">
<div class="info-row-label">Telefon</div>
<div class="info-row-value"><a href="{{TEL_HREF}}">{{TEL_DISPLAY}}</a></div>
</div>
<div class="info-row">
<div class="info-row-label">E-Mail</div>
<div class="info-row-value"><a href="mailto:{{EMAIL}}">{{EMAIL}}</a></div>
</div>
</div>
</div>
</div>
</section>

<!-- GALERIE -->

<section class="kontakt" id="kontakt">
<div class="w">
<div class="kontakt-grid">
<div>
<h2>So erreichen Sie uns</h2>
<div class="kontakt-item">
<div class="kontakt-item-label">Adresse</div>
<div class="kontakt-item-value">{{ADRESSE_VOLL}}</div>
</div>
<div class="kontakt-item">
<div class="kontakt-item-label">Telefon</div>
<a href="{{TEL_HREF}}" class="kontakt-tel">{{TEL_DISPLAY}}</a>
</div>
<div class="kontakt-item">
<div class="kontakt-item-label">E-Mail</div>
<a href="mailto:{{EMAIL}}" class="kontakt-email">{{EMAIL}}</a>
</div>
<div class="kontakt-item">
<div class="kontakt-item-label">\u00d6ffnungszeiten</div>
<div class="kontakt-item-value">{{OEFFNUNGSZEITEN}}</div>
</div>
${socialHtml}
</div>
<!-- KONTAKT_FORM -->
</div>
<!-- MAPS -->
</div>
</section>

${buchungslinkHtml}

<!-- FOOTER -->

<div class="sticky-mob">${stickyCtaHtml}</div>
</body>
</html>`;
}
