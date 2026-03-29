/**
 * SiteReady — "Klassisch" Template
 * Serious, trustworthy, timeless. Like a well-established Austrian Meisterbetrieb.
 * Navy + blue accent, Inter font, sharp edges, border-driven cards.
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
--rLg:6px;
--font:'Inter',system-ui,-apple-system,sans-serif;
--maxW:1140px;
}
html{scroll-behavior:smooth}
body{font-family:var(--font);color:var(--text);line-height:1.6;-webkit-font-smoothing:antialiased}
img{max-width:100%;display:block}
a{color:inherit}

/* ── Layout ── */
.wrap{max-width:var(--maxW);margin:0 auto;padding:0 24px}
.sec{padding:72px 0}
@media(min-width:900px){.sec{padding:88px 0}}

/* ── Section Label ── */
.sec-label{font-size:.7rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--accent);margin-bottom:10px}

/* ── Hero ── */
.hero{min-height:85vh;background:linear-gradient(160deg,${primary} 0%,#1e40af 100%);color:#fff;display:flex;align-items:center;position:relative;overflow:hidden}
.hero::before{content:'';position:absolute;top:-20%;right:-10%;width:500px;height:500px;border-radius:50%;background:radial-gradient(circle,${accent}12,transparent 70%);pointer-events:none}
.hero-inner{position:relative;z-index:1;width:100%;max-width:var(--maxW);margin:0 auto;padding:80px 24px 64px}
.hero-badges{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:20px}
.hero-badge{padding:5px 14px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.15);border-radius:var(--r);font-size:.75rem;font-weight:600;color:rgba(255,255,255,.85);letter-spacing:.02em}
.hero h1{font-size:clamp(2rem,5vw,3.2rem);font-weight:800;line-height:1.1;letter-spacing:-.03em;margin-bottom:8px}
.hero-sub{font-size:clamp(.9rem,2vw,1.1rem);color:rgba(255,255,255,.7);font-weight:500;margin-bottom:6px}
.hero-desc{font-size:.9rem;color:rgba(255,255,255,.55);max-width:520px;margin-bottom:24px;line-height:1.65}
.hero-btns{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:20px}
.btn{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:12px 28px;font-size:.88rem;font-weight:700;text-decoration:none;border-radius:var(--r);transition:opacity .2s,transform .15s;cursor:pointer;border:none;font-family:var(--font)}
.btn:active{transform:scale(.97)}
.btn-accent{background:var(--accent);color:#fff}
.btn-accent:hover{opacity:.88}
.btn-ghost{background:transparent;color:#fff;border:2px solid rgba(255,255,255,.4)}
.btn-ghost:hover{border-color:rgba(255,255,255,.7)}
.hero-trust{font-size:.8rem;color:rgba(255,255,255,.5);display:flex;flex-wrap:wrap;gap:16px}
@media(max-width:640px){
  .hero-btns{flex-direction:column}
  .hero-btns .btn{width:100%;text-align:center}
}

/* ── Leistungen ── */
.leist{background:var(--white)}
.leist h2{font-size:clamp(1.3rem,3vw,1.8rem);font-weight:800;color:var(--primary);letter-spacing:-.02em;margin-bottom:8px}
.leist-intro{color:var(--textMuted);font-size:.9rem;margin-bottom:32px;max-width:560px}

/* ── Über uns ── */
.ueber{background:var(--bg)}
.ueber-grid{display:grid;gap:40px}
@media(min-width:900px){.ueber-grid{grid-template-columns:3fr 2fr;gap:56px}}
.ueber h2{font-size:clamp(1.3rem,3vw,1.8rem);font-weight:800;color:var(--primary);letter-spacing:-.02em;margin-bottom:16px}
.ueber-text{color:var(--text);font-size:.9rem;line-height:1.75;margin-bottom:24px}
.ueber-vorteile{list-style:none;display:flex;flex-direction:column;gap:8px}
.ueber-vorteile li{display:flex;align-items:baseline;gap:10px;font-size:.88rem;font-weight:500}
.ueber-vorteile li::before{content:'\\2713';color:var(--accent);font-weight:800;font-size:.85rem;flex-shrink:0}
.info-card{background:var(--primary);color:#fff;border-radius:var(--rLg);padding:28px 24px;align-self:start}
.info-card h3{font-size:.95rem;font-weight:700;margin-bottom:20px;letter-spacing:-.01em}
.info-row{display:flex;flex-direction:column;gap:4px;padding:12px 0;border-bottom:1px solid rgba(255,255,255,.12)}
.info-row:last-child{border-bottom:none}
.info-row-label{font-size:.7rem;font-weight:600;text-transform:uppercase;letter-spacing:.08em;opacity:.55}
.info-row-value{font-size:.88rem;font-weight:600}
.info-row-value a{color:#fff;text-decoration:none}
.info-row-value a:hover{text-decoration:underline}

/* ── Kontakt ── */
.kontakt{background:var(--white)}
.kontakt-grid{display:grid;gap:40px}
@media(min-width:900px){.kontakt-grid{grid-template-columns:1fr 1fr;gap:56px}}
.kontakt h2{font-size:clamp(1.3rem,3vw,1.8rem);font-weight:800;color:var(--primary);letter-spacing:-.02em;margin-bottom:20px}
.kontakt-item{margin-bottom:16px}
.kontakt-item-label{font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--textMuted);margin-bottom:4px}
.kontakt-item-value{font-size:.9rem;font-weight:500}
.kontakt-tel{font-size:1.2rem;font-weight:800;color:var(--accent);text-decoration:none;display:inline-block;margin:4px 0}
.kontakt-tel:hover{text-decoration:underline}
.kontakt-email{color:var(--accent);text-decoration:none;font-weight:600}
.kontakt-email:hover{text-decoration:underline}
.kontakt-social{display:flex;gap:10px;margin-top:8px}
.kontakt-social a{display:flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:var(--r);border:1px solid var(--sep);color:var(--primary);text-decoration:none;transition:background .2s,border-color .2s}
.kontakt-social a:hover{background:var(--bg);border-color:var(--accent)}
.kontakt-cta{background:var(--primary);border-radius:var(--rLg);padding:36px 28px;color:#fff;align-self:start}
.kontakt-cta h3{font-size:1.05rem;font-weight:800;margin-bottom:8px}
.kontakt-cta p{font-size:.85rem;opacity:.7;line-height:1.6;margin-bottom:20px}
.kontakt-cta .btn{width:100%}

/* ── Termin CTA ── */
.termin-cta{background:var(--primary);color:#fff;text-align:center}
.termin-cta h2{font-size:clamp(1.2rem,3vw,1.6rem);font-weight:800;margin-bottom:8px;color:#fff}
.termin-cta p{font-size:.9rem;opacity:.65;margin-bottom:24px}

/* ── Maps ── */
.maps-wrap{border-radius:var(--rLg);overflow:hidden;margin-top:32px;border:1px solid var(--sep)}
.maps-wrap iframe{width:100%;height:260px;border:0;display:block}

/* ── Sticky Mobile CTA ── */
.sticky-mob{display:none;position:fixed;bottom:0;left:0;right:0;z-index:900;padding:12px 16px;background:var(--accent);text-align:center}
.sticky-mob a{color:#fff;text-decoration:none;font-weight:800;font-size:.95rem;display:block;min-height:44px;line-height:44px}
@media(max-width:640px){.sticky-mob{display:block}body{padding-bottom:68px}}
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

<section class="sec leist" id="leistungen">
<div class="wrap">
<div class="sec-label">Unser Leistungsangebot</div>
<h2>Unsere Leistungen</h2>
<p class="leist-intro">${leistungenIntro}</p>
<!-- LEISTUNGEN -->
${preislisteHtml}
</div>
</section>

<section class="sec ueber" id="ueber-uns">
<div class="wrap">
<div class="ueber-grid">
<div>
<div class="sec-label">\u00dcber uns</div>
<h2>${firmenname}</h2>
<p class="ueber-text">{{UEBER_UNS_TEXT}}</p>
<ul class="ueber-vorteile">{{VORTEILE}}</ul>
</div>
<div class="info-card">
<h3>Auf einen Blick</h3>
<div class="info-row">
<span class="info-row-label">\u00d6ffnungszeiten</span>
<span class="info-row-value">{{OEFFNUNGSZEITEN}}</span>
</div>
<div class="info-row">
<span class="info-row-label">Einsatzgebiet</span>
<span class="info-row-value">${einsatzgebiet}</span>
</div>
<div class="info-row">
<span class="info-row-label">Telefon</span>
<span class="info-row-value"><a href="{{TEL_HREF}}">{{TEL_DISPLAY}}</a></span>
</div>
<div class="info-row">
<span class="info-row-label">E-Mail</span>
<span class="info-row-value"><a href="mailto:{{EMAIL}}">{{EMAIL}}</a></span>
</div>
</div>
</div>
</div>
</section>

<!-- GALERIE -->

<section class="sec kontakt" id="kontakt">
<div class="wrap">
<div class="kontakt-grid">
<div>
<div class="sec-label">Kontakt</div>
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
<div class="kontakt-cta">
<h3>${kontaktCtaHeadline}</h3>
<p>${kontaktCtaText}</p>
<a href="{{TEL_HREF}}" class="btn btn-accent">${ctaPrimary}</a>
</div>
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
