/**
 * SiteReady — "Klassisch" Template
 * Serious, trustworthy, timeless.
 */

export function buildKlassischTemplate(data) {
  const {
    firmenname, brancheLabel, einsatzgebiet, kurzbeschreibung,
    ctaPrimary, ctaPrimaryHref, ctaSecondary,
    leistungenIntro, preislisteHtml,
    ueberUnsText, vorteileHtml, oeffnungszeiten,
    adresseVoll, telDisplay, telHref, email,
    socialHtml, buchungslinkHtml, stickyCtaHtml,
    metaTitle, metaDesc, siteUrl, fontUrl, fontFamily,
    primary, accent, bg, sep,
    kontaktCtaHeadline, kontaktCtaText,
    borderRadius, borderRadiusLg,
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
--r:${borderRadius||"4px"};
--rLg:${borderRadiusLg||"8px"};
--font:${fontFamily||"'Inter',system-ui,-apple-system,sans-serif"};
--maxW:1060px;
}
html{scroll-behavior:smooth}
body{font-family:var(--font);color:var(--text);line-height:1.7;font-size:1.05rem;-webkit-font-smoothing:antialiased;background:var(--white)}
img{max-width:100%;display:block}
a{color:inherit}
.w{max-width:var(--maxW);margin:0 auto;padding:0 28px}
@keyframes sr-up{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
.sr-a{opacity:0;animation:sr-up .5s ease forwards}
.sr-fade{opacity:0;transform:translateY(32px);transition:opacity .7s cubic-bezier(.22,1,.36,1),transform .7s cubic-bezier(.22,1,.36,1)}
.sr-fade.sr-vis{opacity:1;transform:translateY(0)}

/* ── Hero ── */
.hero{background:linear-gradient(135deg,${primary} 0%,color-mix(in srgb,${primary} 75%,#000) 100%);color:#fff;display:flex;align-items:center;position:relative;min-height:100vh}
.hero-inner{position:relative;z-index:1;width:100%;max-width:var(--maxW);margin:0 auto;padding:56px 28px 40px}
.hero h1{font-size:clamp(3rem,7vw,5rem);font-weight:800;line-height:1.05;letter-spacing:-.04em;margin-bottom:14px;max-width:700px}
.trust{padding:18px 0;background:var(--bg,#f8fafc);border-bottom:1px solid var(--sep)}
.trust-items{display:flex;flex-wrap:wrap;justify-content:center;gap:12px 28px}
.trust-item{display:flex;align-items:center;gap:7px;font-size:.82rem;font-weight:600;color:var(--primary);white-space:nowrap}
.trust-item svg{color:var(--accent);flex-shrink:0}
.hero-sub{font-size:1.1rem;color:rgba(255,255,255,.65);font-weight:500;margin-bottom:12px}
.hero-desc{font-size:1rem;color:rgba(255,255,255,.55);max-width:480px;margin-bottom:28px;line-height:1.75}
.hero-btns{display:flex;flex-wrap:wrap;gap:12px;margin-bottom:0}
.btn{display:inline-flex;align-items:center;justify-content:center;min-height:52px;padding:15px 36px;font-size:.95rem;font-weight:600;text-decoration:none;border-radius:var(--r);transition:all .2s ease;cursor:pointer;border:none;font-family:var(--font)}
.btn-accent{background:var(--accent);color:#fff}
.btn-accent:hover{opacity:.85}
.btn-ghost{background:transparent;color:rgba(255,255,255,.8);border:1.5px solid rgba(255,255,255,.2)}
.btn-ghost:hover{border-color:rgba(255,255,255,.5);color:#fff}
@media(max-width:640px){
  .hero-btns{flex-direction:column}
  .hero-btns .btn{width:100%;text-align:center}
  .hero-inner{padding:56px 20px 32px}
}

/* ── Leistungen ── */
.leist{padding:100px 0;background:#fff}
.leist-top{margin-bottom:48px}
.leist-label{display:inline-flex;align-items:center;font-size:.68rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--accent);margin-bottom:16px;background:color-mix(in srgb,var(--accent) 10%,transparent);padding:5px 14px;border-radius:100px;border:1px solid color-mix(in srgb,var(--accent) 20%,transparent)}
.leist h2{font-size:clamp(1.6rem,3vw,2.4rem);font-weight:800;color:var(--primary);letter-spacing:-.03em;margin-bottom:14px}
.leist-intro{color:var(--textMuted);font-size:1.05rem;max-width:560px;line-height:1.75}
@media(min-width:900px){.leist{padding:140px 0}}
@media(max-width:640px){.sr-leist-grid{grid-template-columns:1fr!important}}

/* ── Über uns ── */
.ueber{padding:100px 0;background:var(--primary);color:#fff}
.ueber-grid{display:grid;gap:48px}
@media(min-width:900px){.ueber-grid{grid-template-columns:1fr 1fr;gap:72px;align-items:start}.ueber{padding:140px 0}}
.ueber h2{font-size:clamp(1.5rem,3vw,2.1rem);font-weight:800;letter-spacing:-.03em;margin-bottom:20px;color:#fff}
.ueber-text{font-size:1rem;line-height:1.9;opacity:.75;margin-bottom:28px}
.ueber-vorteile{list-style:none;display:flex;flex-direction:column;gap:12px}
.ueber-vorteile li{font-size:.95rem;font-weight:500;opacity:.9;padding-left:20px;position:relative}
.ueber-vorteile li::before{content:'';position:absolute;left:0;top:8px;width:6px;height:6px;background:rgba(255,255,255,.7);border-radius:1px}
.kontakt-infos{margin-top:32px;padding-top:28px;border-top:1px solid var(--sep);display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
.kontakt-info-item{display:flex;align-items:center;gap:10px;font-size:.85rem;color:var(--text)}
.kontakt-info-icon{width:32px;height:32px;border-radius:var(--rLg);background:color-mix(in srgb,var(--accent) 8%,#fff);display:flex;align-items:center;justify-content:center;flex-shrink:0}
.kontakt-info-icon svg{color:var(--accent)}
@media(max-width:768px){.kontakt-infos{grid-template-columns:1fr 1fr}}
@media(max-width:480px){.kontakt-infos{grid-template-columns:1fr}}

/* ── Kontakt ── */
.kontakt{padding:100px 0;background:var(--bg,#f8fafc)}
.kontakt-grid{display:grid;gap:48px}
@media(min-width:900px){.kontakt-grid{grid-template-columns:1fr 1fr;gap:72px;align-items:start}.kontakt{padding:140px 0}}
.kontakt h2{font-size:clamp(1.5rem,3vw,2.1rem);font-weight:800;color:var(--primary);letter-spacing:-.03em;margin-bottom:28px}
.kontakt-item{margin-bottom:20px}
.kontakt-item-label{font-size:.65rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--textMuted);margin-bottom:5px}
.kontakt-item-value{font-size:1rem;font-weight:500}
.kontakt-tel{font-size:1.2rem;font-weight:800;color:var(--primary);text-decoration:none;display:inline-block;margin:4px 0}
.kontakt-tel:hover{color:var(--accent)}
.kontakt-email{color:var(--primary);text-decoration:none;font-weight:600}
.kontakt-email:hover{color:var(--accent)}
.kontakt-social{display:flex;gap:10px;margin-top:12px}
.kontakt-social a{display:flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:var(--r);border:1px solid var(--sep);color:var(--primary);text-decoration:none;transition:all .2s}
.kontakt-social a:hover{background:var(--primary);color:#fff;border-color:var(--primary)}
.kontakt-form-wrap{margin-top:48px;padding-top:48px;border-top:1px solid var(--sep)}
.k-form h3{font-size:1rem;font-weight:800;color:var(--primary);margin-bottom:20px}
.k-form label{display:block;font-size:.65rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--textMuted);margin-bottom:5px}
.k-form input,.k-form textarea{width:100%;padding:11px 14px;border:1.5px solid var(--sep);border-radius:var(--r);font-size:.88rem;font-family:var(--font);background:#fff;color:var(--text);outline:none;transition:border-color .2s;box-sizing:border-box}
.k-form input:focus,.k-form textarea:focus{border-color:var(--accent)}
.k-form textarea{resize:vertical}
.k-form-row{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:12px}
.k-form-field{margin-bottom:12px}
.k-form button{background:var(--accent);color:#fff;border:none;padding:13px 32px;border-radius:var(--r);font-size:.88rem;font-weight:700;cursor:pointer;font-family:var(--font);min-height:48px;transition:opacity .2s}
.k-form button:hover{opacity:.85}
.k-form-ok{display:none;text-align:center;padding:40px 20px}
.k-form-ok h4{font-size:1.1rem;font-weight:800;color:var(--primary);margin:12px 0 6px}
.k-form-ok p{color:var(--textMuted);font-size:.88rem}
@media(max-width:640px){.k-form-row{grid-template-columns:1fr}}

/* ── Termin CTA ── */
.termin-cta{padding:80px 0;background:var(--primary);color:#fff;text-align:center}
.termin-cta h2{font-size:clamp(1.3rem,3vw,1.8rem);font-weight:800;margin-bottom:10px;color:#fff}
.termin-cta p{font-size:.9rem;opacity:.5;margin-bottom:28px}
.termin-cta .btn-accent{background:#fff;color:var(--primary)}
.termin-cta .btn-accent:hover{opacity:.9}

.lb{display:none;position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.9);align-items:center;justify-content:center;cursor:zoom-out}
.lb.open{display:flex}
.lb img{max-width:90vw;max-height:90vh;object-fit:contain;border-radius:var(--rLg)}
.lb-x{position:absolute;top:20px;right:24px;background:none;border:none;color:#fff;font-size:2rem;cursor:pointer;opacity:.6}
.lb-x:hover{opacity:1}
</style>
</head>
<body>
<!-- NAV -->

<section class="hero" id="sr-hero">
<div class="hero-inner">
<h1>${firmenname}</h1>
<p class="hero-sub">${brancheLabel} &ndash; ${einsatzgebiet}</p>
<p class="hero-desc">${kurzbeschreibung}</p>
<div class="hero-btns">
<a href="${ctaPrimaryHref}" class="btn btn-accent">${ctaPrimary}</a>
<a href="#leistungen" class="btn btn-ghost">${ctaSecondary}</a>
</div>
</div>
</section>

<!-- TRUST -->

<section class="leist" id="leistungen">
<div class="w">
<div class="leist-top sr-fade">
<div class="leist-label">Leistungen</div>
<h2>Was wir f\u00fcr Sie tun</h2>
<p class="leist-intro">${leistungenIntro}</p>
</div>
<!-- LEISTUNGEN -->
${preislisteHtml}
<!-- LEIST_FOTOS -->
</div>
</section>

<!-- ABLAUF -->

<section class="ueber" id="ueber-uns">
<div class="w">
<div class="ueber-grid">
<div class="sr-fade">
<h2>\u00dcber ${firmenname}</h2>
<p class="ueber-text">{{UEBER_UNS_TEXT}}</p>
<ul class="ueber-vorteile">{{VORTEILE}}</ul>
<!-- ABOUT_FOTOS -->
</div>
<div class="sr-fade">
<!-- TEAM -->
</div>
</div>
</div>
</section>

<section class="kontakt" id="kontakt">
<div class="w">
<div class="kontakt-grid">
<div class="sr-fade">
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
<!-- KONTAKT_INFOS -->
<div class="kontakt-form-wrap">
<!-- KONTAKT_FORM -->
</div>
</div>
</section>

${buchungslinkHtml}

<!-- FOOTER -->

<div class="lb" id="sr-lb" onclick="this.classList.remove('open')"><button class="lb-x" aria-label="Schliessen">\u00d7</button><img id="sr-lb-img" src="" alt=""/></div>
<script>(function(){var o=new IntersectionObserver(function(e){e.forEach(function(i){if(i.isIntersecting){i.target.classList.add('sr-a');o.unobserve(i.target)}})},{threshold:.15});document.querySelectorAll('.leist,.ueber,.kontakt,.termin-cta').forEach(function(s){o.observe(s)});var f=new IntersectionObserver(function(e){e.forEach(function(i){if(i.isIntersecting){i.target.classList.add('sr-vis');f.unobserve(i.target)}})},{threshold:.08,rootMargin:'0px 0px -60px 0px'});document.querySelectorAll('.sr-leist-grid,.ueber-grid,.kontakt-grid').forEach(function(p){var ch=p.children;for(var j=0;j<ch.length;j++){ch[j].style.transitionDelay=j*120+'ms';if(!ch[j].classList.contains('sr-fade'))ch[j].classList.add('sr-fade');f.observe(ch[j])}});document.querySelectorAll('.sr-fade').forEach(function(el){f.observe(el)});document.addEventListener('click',function(e){var img=e.target.closest('.sr-zoom');if(img){var lb=document.getElementById('sr-lb');document.getElementById('sr-lb-img').src=img.src;lb.classList.add('open');}});document.addEventListener('keydown',function(e){if(e.key==='Escape')document.getElementById('sr-lb').classList.remove('open');});})();</script>
</body>
</html>`;
}
