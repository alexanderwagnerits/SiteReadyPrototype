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
--rLg:8px;
--font:'Inter',system-ui,-apple-system,sans-serif;
--maxW:1100px;
}
html{scroll-behavior:smooth}
body{font-family:var(--font);color:var(--text);line-height:1.6;-webkit-font-smoothing:antialiased;background:var(--white)}
img{max-width:100%;display:block}
a{color:inherit}

/* ── Layout ── */
.wrap{max-width:var(--maxW);margin:0 auto;padding:0 28px}
.sec{padding:80px 0}
@media(min-width:900px){.sec{padding:104px 0}}

/* ── Section Label ── */
.sec-label{font-size:.65rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--accent);margin-bottom:12px;display:flex;align-items:center;gap:10px}
.sec-label::before{content:'';width:24px;height:1.5px;background:var(--accent)}

/* ── Hero ── */
.hero{min-height:88vh;background:linear-gradient(165deg,${primary} 0%,#0a1e42 40%,#1a3568 100%);color:#fff;display:flex;align-items:center;position:relative;overflow:hidden}
.hero::before{content:'';position:absolute;inset:0;background:url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")}
.hero::after{content:'';position:absolute;bottom:-2px;left:0;right:0;height:120px;background:linear-gradient(to top,var(--white),transparent);pointer-events:none}
.hero-inner{position:relative;z-index:1;width:100%;max-width:var(--maxW);margin:0 auto;padding:100px 28px 80px}
.hero-badges{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:28px}
.hero-badge{padding:6px 16px;background:rgba(255,255,255,.08);backdrop-filter:blur(4px);border:1px solid rgba(255,255,255,.12);border-radius:var(--r);font-size:.72rem;font-weight:600;color:rgba(255,255,255,.8);letter-spacing:.03em}
.hero h1{font-size:clamp(2.2rem,5.5vw,3.6rem);font-weight:800;line-height:1.08;letter-spacing:-.035em;margin-bottom:12px}
.hero-sub{font-size:clamp(.92rem,2vw,1.15rem);color:rgba(255,255,255,.6);font-weight:500;margin-bottom:8px}
.hero-desc{font-size:.88rem;color:rgba(255,255,255,.45);max-width:500px;margin-bottom:32px;line-height:1.7}
.hero-btns{display:flex;flex-wrap:wrap;gap:12px;margin-bottom:28px}
.btn{display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:13px 32px;font-size:.88rem;font-weight:700;text-decoration:none;border-radius:var(--r);transition:all .25s cubic-bezier(.4,0,.2,1);cursor:pointer;border:none;font-family:var(--font);letter-spacing:.01em}
.btn:active{transform:scale(.96)}
.btn-accent{background:var(--accent);color:#fff;box-shadow:0 2px 12px rgba(37,99,235,.25)}
.btn-accent:hover{box-shadow:0 6px 24px rgba(37,99,235,.35);transform:translateY(-1px)}
.btn-ghost{background:rgba(255,255,255,.06);color:#fff;border:1.5px solid rgba(255,255,255,.25)}
.btn-ghost:hover{background:rgba(255,255,255,.12);border-color:rgba(255,255,255,.5)}
.hero-trust{font-size:.78rem;color:rgba(255,255,255,.4);display:flex;flex-wrap:wrap;gap:20px;padding-top:8px;border-top:1px solid rgba(255,255,255,.08)}
@media(max-width:640px){
  .hero-btns{flex-direction:column}
  .hero-btns .btn{width:100%;text-align:center}
  .hero-inner{padding:80px 20px 60px}
}

/* ── Leistungen ── */
.leist{background:var(--white)}
.leist h2{font-size:clamp(1.4rem,3vw,2rem);font-weight:800;color:var(--primary);letter-spacing:-.025em;margin-bottom:10px}
.leist-intro{color:var(--textMuted);font-size:.9rem;margin-bottom:40px;max-width:540px;line-height:1.7}

/* ── Über uns ── */
.ueber{background:linear-gradient(180deg,var(--bg) 0%,#eef1f5 100%)}
.ueber-grid{display:grid;gap:40px}
@media(min-width:900px){.ueber-grid{grid-template-columns:3fr 2fr;gap:64px;align-items:start}}
.ueber h2{font-size:clamp(1.4rem,3vw,2rem);font-weight:800;color:var(--primary);letter-spacing:-.025em;margin-bottom:18px}
.ueber-text{color:var(--text);font-size:.9rem;line-height:1.8;margin-bottom:28px}
.ueber-vorteile{list-style:none;display:flex;flex-direction:column;gap:10px}
.ueber-vorteile li{display:flex;align-items:baseline;gap:12px;font-size:.88rem;font-weight:500;color:var(--text)}
.ueber-vorteile li::before{content:'\\2713';color:var(--accent);font-weight:800;font-size:.8rem;flex-shrink:0;width:20px;height:20px;display:flex;align-items:center;justify-content:center;background:rgba(37,99,235,.08);border-radius:var(--r)}
.info-card{background:var(--primary);color:#fff;border-radius:var(--rLg);padding:32px 28px;box-shadow:0 20px 60px rgba(15,43,91,.2);position:relative;overflow:hidden}
.info-card::before{content:'';position:absolute;top:0;right:0;width:120px;height:120px;background:radial-gradient(circle,rgba(37,99,235,.15),transparent 70%);pointer-events:none}
.info-card h3{font-size:.9rem;font-weight:700;margin-bottom:22px;letter-spacing:.02em;text-transform:uppercase;opacity:.7;font-size:.7rem;letter-spacing:.1em}
.info-row{display:flex;flex-direction:column;gap:4px;padding:14px 0;border-bottom:1px solid rgba(255,255,255,.1)}
.info-row:last-child{border-bottom:none}
.info-row-label{font-size:.65rem;font-weight:600;text-transform:uppercase;letter-spacing:.1em;opacity:.45}
.info-row-value{font-size:.9rem;font-weight:600}
.info-row-value a{color:#fff;text-decoration:none;transition:opacity .2s}
.info-row-value a:hover{opacity:.75}

/* ── Kontakt ── */
.kontakt{background:var(--white);position:relative}
.kontakt::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--sep),transparent)}
.kontakt-grid{display:grid;gap:40px}
@media(min-width:900px){.kontakt-grid{grid-template-columns:1fr 1fr;gap:64px;align-items:start}}
.kontakt h2{font-size:clamp(1.4rem,3vw,2rem);font-weight:800;color:var(--primary);letter-spacing:-.025em;margin-bottom:24px}
.kontakt-item{margin-bottom:18px}
.kontakt-item-label{font-size:.65rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--textMuted);margin-bottom:5px}
.kontakt-item-value{font-size:.9rem;font-weight:500}
.kontakt-tel{font-size:1.3rem;font-weight:800;color:var(--accent);text-decoration:none;display:inline-block;margin:4px 0;transition:color .2s}
.kontakt-tel:hover{color:var(--primary)}
.kontakt-email{color:var(--accent);text-decoration:none;font-weight:600;transition:color .2s}
.kontakt-email:hover{color:var(--primary)}
.kontakt-social{display:flex;gap:10px;margin-top:12px}
.kontakt-social a{display:flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:var(--r);border:1px solid var(--sep);color:var(--primary);text-decoration:none;transition:all .25s}
.kontakt-social a:hover{background:var(--primary);color:#fff;border-color:var(--primary)}
.kontakt-cta{background:var(--primary);border-radius:var(--rLg);padding:40px 32px;color:#fff;box-shadow:0 16px 48px rgba(15,43,91,.15);position:relative;overflow:hidden}
.kontakt-cta::before{content:'';position:absolute;bottom:-40px;right:-40px;width:160px;height:160px;border-radius:50%;background:rgba(37,99,235,.1);pointer-events:none}
.kontakt-cta h3{font-size:1.1rem;font-weight:800;margin-bottom:10px;position:relative}
.kontakt-cta p{font-size:.85rem;opacity:.65;line-height:1.65;margin-bottom:24px;position:relative}
.kontakt-cta .btn{width:100%;position:relative}

/* ── Termin CTA ── */
.termin-cta{background:linear-gradient(160deg,var(--primary),#0a1e42);color:#fff;text-align:center;position:relative;overflow:hidden}
.termin-cta::before{content:'';position:absolute;inset:0;background:url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")}
.termin-cta h2{font-size:clamp(1.3rem,3vw,1.8rem);font-weight:800;margin-bottom:10px;color:#fff;position:relative}
.termin-cta p{font-size:.9rem;opacity:.55;margin-bottom:28px;position:relative}

/* ── Maps ── */
.maps-wrap{border-radius:var(--rLg);overflow:hidden;margin-top:40px;border:1px solid var(--sep);box-shadow:0 4px 24px rgba(0,0,0,.06)}
.maps-wrap iframe{width:100%;height:280px;border:0;display:block}

/* ── Sticky Mobile CTA ── */
.sticky-mob{display:none;position:fixed;bottom:0;left:0;right:0;z-index:900;padding:0;background:var(--accent);text-align:center;box-shadow:0 -4px 24px rgba(0,0,0,.15)}
.sticky-mob a{color:#fff;text-decoration:none;font-weight:800;font-size:.92rem;display:block;min-height:56px;line-height:56px}
@media(max-width:640px){.sticky-mob{display:block}body{padding-bottom:56px}}
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
