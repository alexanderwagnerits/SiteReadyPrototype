/**
 * SiteReady — "Elegant" Template
 * Premium, refined, calm with minimal decoration.
 */

export function buildElegantTemplate(data) {
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
--textMuted:#78716c;
--white:#fff;
--r:2px;
--rLg:4px;
--font:'Inter',system-ui,-apple-system,sans-serif;
--maxW:1060px;
}
html{scroll-behavior:smooth}
body{font-family:var(--font);color:var(--text);line-height:1.7;-webkit-font-smoothing:antialiased;background:var(--white);letter-spacing:-.01em}
img{max-width:100%;display:block}
a{color:inherit}
.w{max-width:var(--maxW);margin:0 auto;padding:0 28px}
@keyframes sr-up{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
.sr-a{opacity:0;animation:sr-up .6s ease forwards}

/* ── Hero ── */
.hero{background:${primary};color:#fff;display:flex;align-items:center;position:relative;min-height:100vh}
.hero-inner{position:relative;z-index:1;width:100%;max-width:var(--maxW);margin:0 auto;padding:72px 28px 56px}
.hero-badges{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:18px}
.hero-badge{padding:5px 14px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);border-radius:var(--r);font-size:.68rem;font-weight:500;color:rgba(255,255,255,.55);letter-spacing:.06em;text-transform:uppercase}
.hero h1{font-size:clamp(2rem,5vw,3rem);font-weight:300;line-height:1.1;letter-spacing:-.03em;margin-bottom:0;max-width:600px}
.hero-accent-line{display:block;width:72px;height:2px;background:var(--accent);margin:20px 0 24px;opacity:.6}
.hero-sub{font-size:.88rem;color:rgba(255,255,255,.45);font-weight:400;margin-bottom:10px;letter-spacing:.02em}
.hero-desc{font-size:.85rem;color:rgba(255,255,255,.32);max-width:420px;margin-bottom:24px;line-height:1.8}
.hero-btns{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:0}
.btn{display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:14px 32px;font-size:.85rem;font-weight:500;text-decoration:none;border-radius:var(--r);transition:all .2s ease;cursor:pointer;border:none;font-family:var(--font);letter-spacing:.02em}
.btn-accent{background:var(--accent);color:#fff}
.btn-accent:hover{opacity:.82}
.btn-ghost{background:transparent;color:rgba(255,255,255,.65);border:1px solid rgba(255,255,255,.15)}
.btn-ghost:hover{border-color:rgba(255,255,255,.4);color:#fff}
@media(max-width:640px){
  .hero-btns{flex-direction:column}
  .hero-btns .btn{width:100%;text-align:center}
  .hero-inner{padding:56px 20px 40px}
}

/* ── Leistungen ── */
.leist{padding:96px 0;background:var(--white)}
.leist-top{margin-bottom:48px}
.leist-label{font-size:.65rem;font-weight:500;letter-spacing:.16em;text-transform:uppercase;color:var(--accent);margin-bottom:14px}
.leist h2{font-size:clamp(1.4rem,3vw,2rem);font-weight:300;color:var(--primary);letter-spacing:-.02em;margin-bottom:14px}
.leist-intro{color:var(--textMuted);font-size:.88rem;max-width:500px;line-height:1.8}
@media(min-width:900px){.leist{padding:120px 0}}

/* ── Ueber uns ── */
.ueber{padding:96px 0;background:var(--primary);color:#fff}
.ueber-grid{display:grid;gap:48px}
@media(min-width:900px){.ueber-grid{grid-template-columns:1fr 1fr;gap:72px;align-items:start}.ueber{padding:120px 0}}
.ueber h2{font-size:clamp(1.4rem,3vw,2rem);font-weight:300;letter-spacing:-.02em;margin-bottom:20px;color:#fff}
.ueber-text{font-size:.88rem;line-height:1.9;opacity:.6;margin-bottom:28px}
.ueber-vorteile{list-style:none;display:flex;flex-direction:column;gap:0}
.ueber-vorteile li{font-size:.85rem;font-weight:400;opacity:.7;padding:14px 0 14px 24px;position:relative;border-top:1px solid rgba(255,255,255,.08)}
.ueber-vorteile li:last-child{border-bottom:1px solid rgba(255,255,255,.08)}
.ueber-vorteile li::before{content:'\u2013';position:absolute;left:0;top:14px;color:var(--accent);font-weight:500}
.info-card{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:var(--rLg);padding:32px 28px}
.info-card h3{font-size:.68rem;font-weight:500;letter-spacing:.14em;text-transform:uppercase;opacity:.35;margin-bottom:24px}
.info-row{padding:14px 0;border-bottom:1px solid rgba(255,255,255,.06)}
.info-row:last-child{border-bottom:none}
.info-row-label{font-size:.62rem;font-weight:500;text-transform:uppercase;letter-spacing:.12em;opacity:.35;margin-bottom:4px}
.info-row-value{font-size:.88rem;font-weight:500}
.info-row-value a{color:#fff;text-decoration:none}
.info-row-value a:hover{opacity:.6}

/* ── Kontakt ── */
.kontakt{padding:96px 0;background:var(--bg)}
.kontakt-grid{display:grid;gap:48px}
@media(min-width:900px){.kontakt-grid{grid-template-columns:1fr 1fr;gap:72px;align-items:start}.kontakt{padding:120px 0}}
.kontakt h2{font-size:clamp(1.4rem,3vw,2rem);font-weight:300;color:var(--primary);letter-spacing:-.02em;margin-bottom:28px}
.kontakt-item{margin-bottom:20px}
.kontakt-item-label{font-size:.62rem;font-weight:500;text-transform:uppercase;letter-spacing:.12em;color:var(--textMuted);margin-bottom:5px}
.kontakt-item-value{font-size:.88rem;font-weight:400}
.kontakt-tel{font-size:1.1rem;font-weight:600;color:var(--primary);text-decoration:none;display:inline-block;margin:4px 0}
.kontakt-tel:hover{color:var(--accent)}
.kontakt-email{color:var(--primary);text-decoration:none;font-weight:500}
.kontakt-email:hover{color:var(--accent)}
.kontakt-social{display:flex;gap:10px;margin-top:12px}
.kontakt-social a{display:flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:var(--r);border:1px solid var(--sep);color:var(--primary);text-decoration:none;transition:all .2s}
.kontakt-social a:hover{background:var(--primary);color:#fff;border-color:var(--primary)}
.kontakt-form-wrap{margin-top:48px;padding-top:48px;border-top:1px solid var(--sep)}
.k-form h3{font-size:.92rem;font-weight:600;color:var(--primary);margin-bottom:20px;letter-spacing:-.01em}
.k-form label{display:block;font-size:.62rem;font-weight:500;text-transform:uppercase;letter-spacing:.12em;color:var(--textMuted);margin-bottom:5px}
.k-form input,.k-form textarea{width:100%;padding:11px 14px;border:1px solid var(--sep);border-radius:var(--r);font-size:.85rem;font-family:var(--font);background:#fff;color:var(--text);outline:none;transition:border-color .2s;box-sizing:border-box}
.k-form input:focus,.k-form textarea:focus{border-color:var(--accent)}
.k-form textarea{resize:vertical}
.k-form-row{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:12px}
.k-form-field{margin-bottom:12px}
.k-form button{background:var(--primary);color:#fff;border:none;padding:13px 32px;border-radius:var(--r);font-size:.85rem;font-weight:500;cursor:pointer;font-family:var(--font);min-height:48px;transition:opacity .2s;letter-spacing:.02em}
.k-form button:hover{opacity:.82}
.k-form-ok{display:none;text-align:center;padding:40px 20px}
.k-form-ok h4{font-size:1rem;font-weight:600;color:var(--primary);margin:12px 0 6px}
.k-form-ok p{color:var(--textMuted);font-size:.85rem}
@media(max-width:640px){.k-form-row{grid-template-columns:1fr}}

/* ── Termin CTA ── */
.termin-cta{padding:80px 0;background:var(--primary);color:#fff;text-align:center}
.termin-cta h2{font-size:clamp(1.2rem,3vw,1.6rem);font-weight:300;margin-bottom:10px;color:#fff;letter-spacing:-.01em}
.termin-cta p{font-size:.85rem;opacity:.4;margin-bottom:28px}

.lb{display:none;position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.92);align-items:center;justify-content:center;cursor:zoom-out}
.lb.open{display:flex}
.lb img{max-width:90vw;max-height:90vh;object-fit:contain;border-radius:var(--rLg)}
.lb-x{position:absolute;top:20px;right:24px;background:none;border:none;color:#fff;font-size:2rem;cursor:pointer;opacity:.5}
.lb-x:hover{opacity:1}
</style>
</head>
<body>
<!-- NAV -->

<section class="hero" id="sr-hero">
<div class="hero-inner">
<div class="hero-badges">${badgesHtml}</div>
<h1>${firmenname}</h1>
<span class="hero-accent-line"></span>
<p class="hero-sub">${brancheLabel} &ndash; ${einsatzgebiet}</p>
<p class="hero-desc">${kurzbeschreibung}</p>
<div class="hero-btns">
<a href="${ctaPrimaryHref}" class="btn btn-accent">${ctaPrimary}</a>
<a href="#leistungen" class="btn btn-ghost">${ctaSecondary}</a>
</div>
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
<!-- LEIST_FOTOS -->
</div>
</section>

<section class="ueber" id="ueber-uns">
<div class="w">
<div class="ueber-grid">
<div>
<h2>\u00dcber ${firmenname}</h2>
<p class="ueber-text">{{UEBER_UNS_TEXT}}</p>
<ul class="ueber-vorteile">{{VORTEILE}}</ul>
<!-- ABOUT_FOTOS -->
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
<div><!-- MAPS --></div>
</div>
<div class="kontakt-form-wrap">
<!-- KONTAKT_FORM -->
</div>
</div>
</section>

${buchungslinkHtml}

<!-- FOOTER -->

<div class="lb" id="sr-lb" onclick="this.classList.remove('open')"><button class="lb-x" aria-label="Schliessen">\u00d7</button><img id="sr-lb-img" src="" alt=""/></div>
<script>(function(){var o=new IntersectionObserver(function(e){e.forEach(function(i){if(i.isIntersecting){i.target.classList.add('sr-a');o.unobserve(i.target)}})},{threshold:.15});document.querySelectorAll('.leist,.ueber,.kontakt,.termin-cta').forEach(function(s){o.observe(s)});document.addEventListener('click',function(e){var img=e.target.closest('.sr-zoom');if(img){var lb=document.getElementById('sr-lb');document.getElementById('sr-lb-img').src=img.src;lb.classList.add('open');}});document.addEventListener('keydown',function(e){if(e.key==='Escape')document.getElementById('sr-lb').classList.remove('open');});})();</script>
</body>
</html>`;
}
