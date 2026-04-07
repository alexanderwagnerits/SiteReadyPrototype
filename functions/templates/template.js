/**
 * SiteReady — Unified Template
 * One template, 3 styles (klassisch/modern/elegant) via CSS classes.
 * Style is applied serve-time via <body class="stil-{name}">.
 */

export function buildTemplate(data) {
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
    stil,
  } = data;

  const stilClass = `stil-${stil || "klassisch"}`;

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
<meta property="og:image" content="{{OG_IMAGE}}">
<meta name="twitter:card" content="summary_large_image">
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
.stil-elegant{--textMuted:#716040}
html{scroll-behavior:smooth}
body{font-family:var(--font);color:var(--text);line-height:1.7;font-size:1.05rem;-webkit-font-smoothing:antialiased;background:var(--white)}
.stil-elegant{line-height:1.75;letter-spacing:-.01em}
img{max-width:100%;display:block}
a{color:inherit}
/* Focus-States (Accessibility) */
:focus-visible{outline:2px solid var(--accent);outline-offset:3px;border-radius:2px}
.btn:focus-visible{outline-offset:2px;box-shadow:0 0 0 4px color-mix(in srgb,var(--accent) 25%,transparent)}
.nav-link:focus-visible,.mob-link:focus-visible{outline:2px solid rgba(255,255,255,.6);outline-offset:3px}
.nav-cta:focus-visible,.mob-cta:focus-visible{outline:2px solid rgba(255,255,255,.8);outline-offset:3px}
.k-form input:focus-visible,.k-form textarea:focus-visible,.k-form select:focus-visible{outline:none;border-color:var(--accent);box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 15%,transparent)}
.kontakt-social a:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.kontakt-tel:focus-visible,.kontakt-email:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.w{max-width:var(--maxW);margin:0 auto;padding:0 28px}
@keyframes sr-up{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes sr-grain{0%,100%{transform:translate(0,0)}10%{transform:translate(-5%,-10%)}30%{transform:translate(3%,-15%)}50%{transform:translate(-15%,5%)}70%{transform:translate(12%,10%)}90%{transform:translate(-3%,8%)}}
.sr-a{opacity:0;animation:sr-up .55s cubic-bezier(.22,1,.36,1) forwards}
.stil-elegant .sr-a{animation-duration:.65s}
.sr-fade{opacity:0;transform:translateY(28px);transition:opacity .65s cubic-bezier(.22,1,.36,1),transform .65s cubic-bezier(.22,1,.36,1)}
.stil-elegant .sr-fade{transform:translateY(22px);transition-duration:.75s}
.sr-fade.sr-vis{opacity:1;transform:translateY(0)}
/* Subtiler Grain-Overlay fuer Tiefe (Hero, About) */
.sr-grain::after{content:'';position:absolute;inset:-50%;width:200%;height:200%;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.04'/%3E%3C/svg%3E");background-repeat:repeat;pointer-events:none;z-index:0;opacity:.5;animation:sr-grain 8s steps(8) infinite}

/* ══════════════════════════════════════════════════════
   HERO
   ══════════════════════════════════════════════════════ */
.hero{background:linear-gradient(160deg,var(--primary) 0%,color-mix(in srgb,var(--primary) 72%,#000) 55%,color-mix(in srgb,var(--primary) 85%,var(--accent)) 100%);color:#fff;display:flex;align-items:center;position:relative;min-height:100vh;min-height:100svh;overflow:hidden}
.hero-inner{position:relative;z-index:2;width:100%;max-width:var(--maxW);margin:0 auto;padding:56px 28px 40px}
.hero h1{font-size:clamp(2.8rem,6.5vw,4.5rem);font-weight:800;line-height:1.05;letter-spacing:-.04em;margin-bottom:14px;max-width:700px}
.hero-sub{font-size:1.05rem;color:rgba(255,255,255,.7);font-weight:500;margin-bottom:12px}
.hero-desc{font-size:.98rem;color:rgba(255,255,255,.58);max-width:480px;margin-bottom:32px;line-height:1.8}
.hero-btns{display:flex;flex-wrap:wrap;gap:14px;margin-bottom:0}
.hero-accent-line{display:none}

/* Hero — Modern: Grain deaktivieren (Blobs stattdessen) */
.stil-modern .hero.sr-grain::after{display:none}
.stil-modern .hero{background:var(--primary);overflow:hidden}
.stil-modern .hero::before{content:'';position:absolute;width:520px;height:520px;border-radius:60% 40% 55% 45%;background:var(--accent);opacity:.1;top:-100px;right:-100px;filter:blur(80px);pointer-events:none;animation:sr-float 20s ease-in-out infinite}
@keyframes sr-float{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(20px,-20px) scale(1.05)}}
.stil-modern .hero-inner{padding:64px 28px 48px}

/* Hero — Elegant */
.stil-elegant .hero{background:linear-gradient(135deg,var(--primary) 0%,color-mix(in srgb,var(--primary) 70%,#000) 100%)}
.stil-elegant .hero-inner{padding:72px 28px 56px}
.stil-elegant .hero h1{font-weight:300;margin-bottom:0}
.stil-elegant .hero-accent-line{display:block;width:72px;height:2px;background:var(--accent);margin:22px 0 28px;opacity:.6}
.stil-elegant .hero-sub{font-size:1.05rem;color:rgba(255,255,255,.65);font-weight:400;letter-spacing:.02em}
.stil-elegant .hero-desc{color:rgba(255,255,255,.55);line-height:1.8}

/* ── Trust Bar ── */
.trust{padding:18px 0;background:var(--bg,#f8fafc);border-bottom:1px solid var(--sep)}
.trust-items{display:flex;flex-wrap:wrap;justify-content:center;gap:12px 28px}
.trust-item{display:flex;align-items:center;gap:7px;font-size:.82rem;font-weight:600;color:var(--primary);white-space:nowrap}
.trust-item svg{color:var(--accent);flex-shrink:0}

/* Trust — Modern: Pill-Style */
.stil-modern .trust{padding:20px 0}
.stil-modern .trust-items{gap:14px 24px}
.stil-modern .trust-item{background:#fff;padding:8px 16px;border-radius:100px;box-shadow:0 1px 4px rgba(0,0,0,.06)}

/* Trust — Elegant: Minimal */
.stil-elegant .trust-items{gap:12px 32px}
.stil-elegant .trust-item{font-size:.78rem;font-weight:500;letter-spacing:.01em}
.stil-elegant .trust-item svg{opacity:.7}

/* ── Buttons ── */
.btn{display:inline-flex;align-items:center;justify-content:center;min-height:52px;padding:15px 36px;font-size:.95rem;font-weight:600;text-decoration:none;border-radius:var(--r);transition:all .25s cubic-bezier(.22,1,.36,1);cursor:pointer;border:none;font-family:var(--font)}
.btn-accent{background:var(--accent);color:#fff}
.btn-accent:hover{opacity:.88;transform:translateY(-2px);box-shadow:0 6px 20px rgba(0,0,0,.15)}
.btn-accent:active{transform:translateY(0);box-shadow:none}
.btn-ghost{background:rgba(255,255,255,.06);color:rgba(255,255,255,.8);border:1.5px solid rgba(255,255,255,.18);backdrop-filter:blur(4px)}
.btn-ghost:hover{border-color:rgba(255,255,255,.45);color:#fff;background:rgba(255,255,255,.1)}

/* Buttons — Modern: Pill + Shadow + Glow */
.stil-modern .btn{font-weight:700;border-radius:100px;transition:all .25s cubic-bezier(.22,1,.36,1)}
.stil-modern .btn-accent{box-shadow:0 4px 16px color-mix(in srgb,var(--accent) 30%,transparent)}
.stil-modern .btn-accent:hover{opacity:.9;transform:translateY(-2px);box-shadow:0 8px 28px color-mix(in srgb,var(--accent) 40%,transparent)}
.stil-modern .btn-accent:active{transform:translateY(0)}
.stil-modern .btn-ghost{background:rgba(255,255,255,.06);border-radius:100px;border:1.5px solid rgba(255,255,255,.15);backdrop-filter:blur(4px)}
.stil-modern .btn-ghost:hover{background:rgba(255,255,255,.12);border-color:rgba(255,255,255,.3)}

/* Buttons — Elegant: Minimal, kein translateY — bewusst ruhig */
.stil-elegant .btn{font-weight:500;letter-spacing:.02em}
.stil-elegant .btn-accent:hover{opacity:.82;transform:none;box-shadow:none}
.stil-elegant .btn-ghost{border-width:1px;border-color:rgba(255,255,255,.15);color:rgba(255,255,255,.65)}
.stil-elegant .btn-ghost:hover{background:rgba(255,255,255,.05)}
/* Elegant: Grain noch subtiler */
.stil-elegant .sr-grain::after{opacity:.3}
/* Elegant: Social-Icons ohne Lift */
.stil-elegant .kontakt-social a:hover{transform:none;box-shadow:none}

@media(max-width:640px){
  .hero-btns{flex-direction:column}
  .hero-btns .btn{width:100%;text-align:center}
  .hero-inner{padding:56px 20px 32px}
  .stil-modern .hero-inner{padding:56px 20px 36px}
  .stil-elegant .hero-inner{padding:56px 20px 40px}
}

/* ══════════════════════════════════════════════════════
   LEISTUNGEN
   ══════════════════════════════════════════════════════ */
.leist{padding:100px 0;background:#fff;position:relative}
.leist-top{margin-bottom:48px}
.leist-label{display:inline-flex;align-items:center;font-size:.68rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--accent);margin-bottom:16px;background:color-mix(in srgb,var(--accent) 10%,transparent);padding:5px 14px;border-radius:100px;border:1px solid color-mix(in srgb,var(--accent) 20%,transparent)}
.leist h2{font-size:clamp(1.6rem,3vw,2.4rem);font-weight:800;color:var(--primary);letter-spacing:-.03em;margin-bottom:14px}
.leist-intro{color:var(--textMuted);font-size:1.05rem;max-width:560px;line-height:1.75}
@media(min-width:900px){.leist{padding:140px 0}}
@media(max-width:640px){.sr-leist-grid{grid-template-columns:1fr!important}}

/* Leistungen — Modern */
.stil-modern .leist-label{gap:6px;font-size:.7rem;letter-spacing:.12em;background:color-mix(in srgb,var(--accent) 8%,transparent);border:none;padding:6px 14px}
.stil-modern .leist h2{font-size:clamp(1.5rem,3vw,2.2rem)}
.stil-modern .leist-intro{max-width:520px}

/* Leistungen — Elegant */
.stil-elegant .leist-label{font-size:.65rem;font-weight:500;letter-spacing:.16em;background:none;border:none;padding:0}
.stil-elegant .leist h2{font-size:clamp(1.4rem,3vw,2rem);font-weight:300;letter-spacing:-.02em}
.stil-elegant .leist-intro{max-width:500px;line-height:1.8}

/* ══════════════════════════════════════════════════════
   \u00dcBER UNS
   ══════════════════════════════════════════════════════ */
.ueber{padding:100px 0;background:var(--primary);color:#fff;position:relative;overflow:hidden}
.ueber-grid{display:grid;gap:48px;position:relative;z-index:1}
@media(min-width:900px){.ueber-grid{grid-template-columns:1fr 1fr;gap:72px;align-items:start}.ueber{padding:140px 0}}
.ueber h2{font-size:clamp(1.5rem,3vw,2.1rem);font-weight:800;letter-spacing:-.03em;margin-bottom:20px;color:#fff}
.ueber-text{font-size:1rem;line-height:1.9;opacity:.75;margin-bottom:28px}
.ueber-vorteile{list-style:none;display:flex;flex-direction:column;gap:14px}
.ueber-vorteile li{font-size:.95rem;font-weight:500;opacity:.85;padding-left:22px;position:relative;transition:opacity .2s}
.ueber-vorteile li:hover{opacity:1}
.ueber-vorteile li::before{content:'';position:absolute;left:0;top:9px;width:6px;height:6px;background:var(--accent);border-radius:1px;opacity:.8}

/* Ueber uns — Modern: Blob + Circular Checkmarks */
.stil-modern .ueber::before{content:'';position:absolute;width:400px;height:400px;border-radius:50%;background:var(--accent);opacity:.06;bottom:-120px;left:-80px;filter:blur(60px);pointer-events:none;animation:sr-float 18s ease-in-out infinite}
.stil-modern .ueber h2{font-size:clamp(1.5rem,3vw,2.2rem)}
.stil-modern .ueber-vorteile{gap:14px}
.stil-modern .ueber-vorteile li{padding-left:28px}
.stil-modern .ueber-vorteile li::before{content:'\\2713';width:22px;height:22px;display:inline-flex;align-items:center;justify-content:center;background:rgba(255,255,255,.15);color:#fff;border-radius:50%;font-size:.65rem;font-weight:700;top:0;left:0}

/* Ueber uns — Elegant: Dash-Lines */
.stil-elegant .ueber h2{font-size:clamp(1.4rem,3vw,2rem);font-weight:300;letter-spacing:-.02em}
.stil-elegant .ueber-text{opacity:.7}
.stil-elegant .ueber-vorteile{gap:0}
.stil-elegant .ueber-vorteile li{font-weight:400;opacity:.85;padding:14px 0 14px 24px;border-top:1px solid rgba(255,255,255,.08)}
.stil-elegant .ueber-vorteile li:last-child{border-bottom:1px solid rgba(255,255,255,.08)}
.stil-elegant .ueber-vorteile li::before{content:'\\2013';position:absolute;left:0;top:14px;width:auto;height:auto;background:none;color:rgba(255,255,255,.5);font-weight:500;border-radius:0}

/* ══════════════════════════════════════════════════════
   KONTAKT INFOS (Features-Grid)
   ══════════════════════════════════════════════════════ */
.kontakt-infos{margin-top:32px;padding-top:28px;border-top:1px solid var(--sep);display:grid;grid-template-columns:repeat(3,1fr);gap:14px 20px}
.kontakt-info-item{display:flex;align-items:flex-start;gap:10px;font-size:.85rem;color:var(--text);line-height:1.5}
.kontakt-info-icon{width:32px;height:32px;border-radius:var(--rLg);background:color-mix(in srgb,var(--accent) 8%,#fff);display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:2px}
.kontakt-info-icon svg{color:var(--accent)}
@media(max-width:768px){.kontakt-infos{grid-template-columns:1fr 1fr}}
@media(max-width:480px){.kontakt-infos{grid-template-columns:1fr}}

/* Kontakt-Infos — Modern */
.stil-modern .kontakt-info-icon{border-radius:50%;background:color-mix(in srgb,var(--accent) 8%,#fff)}
.stil-modern .kontakt-info-item{font-size:.85rem}

/* Kontakt-Infos — Elegant */
.stil-elegant .kontakt-info-item{font-size:.82rem}
.stil-elegant .kontakt-info-icon{background:color-mix(in srgb,var(--accent) 6%,#fff)}
.stil-elegant .kontakt-info-icon svg{opacity:.7}

/* ══════════════════════════════════════════════════════
   KONTAKT
   ══════════════════════════════════════════════════════ */
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
.kontakt-social a{display:flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:var(--r);border:1px solid var(--sep);color:var(--primary);text-decoration:none;transition:all .25s cubic-bezier(.22,1,.36,1)}
.kontakt-social a:hover{background:var(--primary);color:#fff;border-color:var(--primary);transform:translateY(-2px);box-shadow:0 4px 12px rgba(0,0,0,.1)}

/* Kontakt — Modern */
.stil-modern .kontakt h2{font-size:clamp(1.5rem,3vw,2.2rem)}
.stil-modern .kontakt-item-value{font-size:.9rem}
.stil-modern .kontakt-tel{color:var(--accent)}
.stil-modern .kontakt-tel:hover{opacity:.7}
.stil-modern .kontakt-social a{width:40px;height:40px;border-radius:50%;border:none;background:color-mix(in srgb,var(--accent) 8%,#fff);color:var(--accent)}
.stil-modern .kontakt-social a:hover{background:var(--accent);color:#fff;transform:translateY(-2px)}

/* Kontakt — Elegant */
.stil-elegant .kontakt h2{font-size:clamp(1.4rem,3vw,2rem);font-weight:300;letter-spacing:-.02em}
.stil-elegant .kontakt-item-label{font-size:.62rem;font-weight:500;letter-spacing:.12em}
.stil-elegant .kontakt-item-value{font-size:.88rem;font-weight:400}
.stil-elegant .kontakt-tel{font-size:1.1rem;font-weight:600}
.stil-elegant .kontakt-email{font-weight:500}

/* ══════════════════════════════════════════════════════
   KONTAKT FORM
   ══════════════════════════════════════════════════════ */
.kontakt-form-wrap{margin-top:48px;padding-top:48px;border-top:1px solid var(--sep)}
.k-form h3{font-size:1rem;font-weight:800;color:var(--primary);margin-bottom:20px}
.k-form label{display:block;font-size:.65rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--textMuted);margin-bottom:5px}
.k-form input,.k-form textarea{width:100%;padding:11px 14px;border:1.5px solid var(--sep);border-radius:var(--r);font-size:.88rem;font-family:var(--font);background:#fff;color:var(--text);outline:none;transition:border-color .2s;box-sizing:border-box}
.k-form input:focus,.k-form textarea:focus{border-color:var(--accent)}
.k-form input:user-invalid,.k-form textarea:user-invalid{border-color:#dc2626;background:#fef2f2}
.k-form textarea{resize:vertical;min-height:160px}
.k-form select{min-height:44px}
.k-form-row{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:12px}
.k-form-row-2{grid-template-columns:1fr 1fr}
.k-form-field{margin-bottom:12px}
.k-form button{background:var(--accent);color:#fff;border:none;padding:13px 32px;border-radius:var(--r);font-size:.88rem;font-weight:700;cursor:pointer;font-family:var(--font);min-height:48px;transition:opacity .2s}
.k-form button:hover{opacity:.85}
.k-form-ok{display:none;text-align:center;padding:40px 20px}
.k-form-ok h4{font-size:1.1rem;font-weight:800;color:var(--primary);margin:12px 0 6px}
.k-form-ok p{color:var(--textMuted);font-size:.88rem}
@media(max-width:640px){.k-form-row,.k-form-row-2{grid-template-columns:1fr}}

/* Form — Modern */
.stil-modern .k-form input,.stil-modern .k-form textarea{padding:12px 16px;border-width:2px}
.stil-modern .k-form button{border-radius:100px;padding:14px 36px;box-shadow:0 4px 16px color-mix(in srgb,var(--accent) 25%,transparent);transition:all .25s cubic-bezier(.22,1,.36,1)}
.stil-modern .k-form button:hover{opacity:.9;transform:translateY(-1px);box-shadow:0 6px 20px color-mix(in srgb,var(--accent) 35%,transparent)}

/* Form — Elegant */
.stil-elegant .k-form h3{font-size:.92rem;font-weight:600;letter-spacing:-.01em}
.stil-elegant .k-form label{font-size:.62rem;font-weight:500;letter-spacing:.12em}
.stil-elegant .k-form input,.stil-elegant .k-form textarea{border-width:1px;font-size:.85rem}
.stil-elegant .k-form button{background:var(--primary);font-size:.85rem;font-weight:500;letter-spacing:.02em}
.stil-elegant .k-form button:hover{opacity:.82}
.stil-elegant .k-form-ok h4{font-size:1rem;font-weight:600}
.stil-elegant .k-form-ok p{font-size:.85rem}

/* ══════════════════════════════════════════════════════
   TERMIN CTA
   ══════════════════════════════════════════════════════ */
.termin-cta{padding:80px 0;background:var(--primary);color:#fff;text-align:center}
.termin-cta h2{font-size:clamp(1.3rem,3vw,1.8rem);font-weight:800;margin-bottom:10px;color:#fff}
.termin-cta p{font-size:.9rem;opacity:.5;margin-bottom:28px}
.termin-cta .btn-accent{background:#fff;color:var(--primary)}
.termin-cta .btn-accent:hover{opacity:.9}

/* Termin CTA — Modern: Accent bg */
.stil-modern .termin-cta{background:var(--accent)}
.stil-modern .termin-cta p{opacity:.7}
.stil-modern .termin-cta .btn-accent{color:var(--accent)}

/* Termin CTA — Elegant */
.stil-elegant .termin-cta h2{font-size:clamp(1.2rem,3vw,1.6rem);font-weight:300;letter-spacing:-.01em}
.stil-elegant .termin-cta p{opacity:.4;font-size:.85rem}

/* ══════════════════════════════════════════════════════
   LIGHTBOX
   ══════════════════════════════════════════════════════ */
.lb{display:none;position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.9);align-items:center;justify-content:center;cursor:zoom-out}
.lb.open{display:flex}
.lb img{max-width:90vw;max-height:90vh;object-fit:contain;border-radius:var(--rLg)}
.lb-x{position:absolute;top:20px;right:24px;background:none;border:none;color:#fff;font-size:2rem;cursor:pointer;opacity:.6}
.lb-x:hover{opacity:1}
.stil-elegant .lb{background:rgba(0,0,0,.92)}
.stil-elegant .lb-x{opacity:.5}

/* ══════════════════════════════════════════════════════
   NEW SECTIONS (placeholders, styled serve-time)
   ══════════════════════════════════════════════════════ */
.sec-faq{padding:100px 0;background:#fff}
.sec-galerie{padding:100px 0;background:var(--bg)}
.sec-fakten{padding:80px 0;background:var(--bg)}
.sec-partner{padding:60px 0;background:#fff;border-top:1px solid var(--sep)}
.sec-cta-block{padding:80px 0;text-align:center}
@media(min-width:900px){.sec-faq{padding:140px 0}.sec-galerie{padding:140px 0}}

/* New Sections — Modern */
.stil-modern .sec-cta-block .btn{border-radius:100px;box-shadow:0 4px 16px color-mix(in srgb,var(--accent) 30%,transparent)}
.stil-modern .sec-cta-block .btn:hover{transform:translateY(-1px)}
.stil-modern .sec-partner{border-top:none}

/* New Sections — Elegant */
.stil-elegant .sec-faq{padding:100px 0}
.stil-elegant .sec-fakten{padding:80px 0}
.stil-elegant .sec-cta-block{padding:80px 0}
.stil-elegant .sec-partner{border-top:1px solid var(--sep)}

/* Sticky CTA entfernt — zu aufdringlich auf Mobile */

/* ══════════════════════════════════════════════════════
   CUSTOM STIL (erbt Basis, nutzt CSS-Variablen)
   ══════════════════════════════════════════════════════ */
.stil-custom .btn-accent:hover{box-shadow:0 6px 20px color-mix(in srgb,var(--accent) 25%,transparent)}
.stil-custom .kontakt-social a:hover{box-shadow:0 4px 12px color-mix(in srgb,var(--primary) 15%,transparent)}

/* ══════════════════════════════════════════════════════
   PRINT
   ══════════════════════════════════════════════════════ */
@media print{
#sitenav,.hbg,.mob-menu,.sr-sticky-cta,.lb,.kontakt-form-wrap,.termin-cta,.sr-skip{display:none!important}
.hero{min-height:auto!important;padding:32px 0!important;print-color-adjust:exact;-webkit-print-color-adjust:exact}
.hero-inner{padding:24px 0!important}
body{font-size:11pt;line-height:1.6}
.w{max-width:100%;padding:0}
.leist,.ueber,.kontakt,.sec-faq,.sec-galerie,.sec-fakten,.sec-partner{padding:24px 0!important}
.ueber{color:#000!important;background:#f5f5f5!important;print-color-adjust:exact}
.sr-grain::after{display:none!important}
.btn{border:1px solid #333!important;background:transparent!important;color:#333!important;box-shadow:none!important}
a{text-decoration:underline}
.kontakt-tel,.kontakt-email{color:#000!important}
footer{padding:16px 0!important}
.ft-grid{gap:16px!important}
}
</style>
</head>
<body class="${stilClass}">
<a href="#leistungen" class="sr-skip" style="position:absolute;top:-100px;left:16px;background:var(--accent);color:#fff;padding:12px 24px;border-radius:var(--r);font-weight:700;font-size:.88rem;z-index:9999;text-decoration:none;transition:top .2s">Zum Inhalt springen</a>
<style>.sr-skip:focus{top:16px}</style>
<!-- NAV -->

<section class="hero sr-grain" id="sr-hero">
<div class="hero-inner">
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

<!-- CTA_BLOCK -->

<!-- ABLAUF -->

<section class="ueber sr-grain" id="ueber-uns">
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

<!-- FAKTEN -->

<!-- GALERIE -->

<!-- BEWERTUNGEN -->

<!-- FAQ -->

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

<!-- PARTNER -->

${buchungslinkHtml}

<!-- FOOTER -->

<div class="lb" id="sr-lb" onclick="this.classList.remove('open')"><button class="lb-x" aria-label="Schliessen">\u00d7</button><img id="sr-lb-img" src="" alt=""/></div>
<script>(function(){var o=new IntersectionObserver(function(e){e.forEach(function(i){if(i.isIntersecting){i.target.classList.add('sr-a');o.unobserve(i.target)}})},{threshold:.12});document.querySelectorAll('.leist,.ueber,.kontakt,.termin-cta,.sec-faq,.sec-galerie,.sec-fakten,.sec-partner,.sec-cta-block').forEach(function(s){o.observe(s)});var f=new IntersectionObserver(function(e){e.forEach(function(i){if(i.isIntersecting){i.target.classList.add('sr-vis');f.unobserve(i.target)}})},{threshold:.06,rootMargin:'0px 0px -40px 0px'});document.querySelectorAll('.sr-leist-grid,.ueber-grid,.kontakt-grid').forEach(function(p){var ch=p.children;for(var j=0;j<ch.length;j++){ch[j].style.transitionDelay=j*100+'ms';if(!ch[j].classList.contains('sr-fade'))ch[j].classList.add('sr-fade');f.observe(ch[j])}});document.querySelectorAll('.sr-leist-grid').forEach(function(g){var cards=g.children;for(var k=0;k<cards.length;k++){cards[k].style.transitionDelay=k*80+'ms'}});document.querySelectorAll('.sr-fade').forEach(function(el){f.observe(el)});document.addEventListener('click',function(e){var img=e.target.closest('.sr-zoom');if(img){var lb=document.getElementById('sr-lb');document.getElementById('sr-lb-img').src=img.src;lb.classList.add('open');}});document.addEventListener('keydown',function(e){if(e.key==='Escape')document.getElementById('sr-lb').classList.remove('open');});})();</script>
</body>
</html>`;
}
