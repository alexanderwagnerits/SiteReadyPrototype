/**
 * SiteReady — Unified Template v2
 * Rewritten to match finalized Stil-Mockups (Klassisch/Modern/Elegant).
 * One template, 3 styles via CSS class on <body>.
 * Style is applied serve-time via <body class="stil-{name}">.
 */

export function buildCss(data) {
  const {
    primary, accent, bg, sep,
    borderRadius, borderRadiusLg, fontFamily,
  } = data;

  return `<style>

/* ═══════════════════════════════════════════════════════
   RESET & BASE
   ═══════════════════════════════════════════════════════ */
*{margin:0;padding:0;box-sizing:border-box}
a,button,input,select,textarea{touch-action:manipulation}
:root{
--primary:${primary};
--accent:${accent};
--bg:${bg};
--sep:${sep};
--text:#1e293b;
--textMuted:#475569;
--white:#fffffe;
--r:${borderRadius || "4px"};
--rLg:${borderRadiusLg || "6px"};
--font:${fontFamily || "'Inter',system-ui,-apple-system,sans-serif"};
--fontHeading:var(--font);
--mono:'JetBrains Mono',monospace;
--maxW:1100px;
--sectionY:80px;
}

/* Style-spezifische Variablen */
.stil-klassisch{--fontHeading:'Merriweather',Georgia,serif}
.stil-modern{--text:#18181b;--textMuted:#71717a;--fontHeading:'Space Grotesk','Plus Jakarta Sans',system-ui,sans-serif;--maxW:1140px;--sectionY:100px}
.stil-elegant{--text:#2c2620;--textMuted:#6b6058;--white:#fdfbf7;--fontHeading:'Cormorant Garamond',Georgia,serif;--maxW:1060px;--sectionY:100px}

html{scroll-behavior:smooth;scroll-padding-top:80px;overflow-x:clip}
h1,h2,h3,.s-h2{font-family:var(--fontHeading)}
body{font-family:var(--font);color:var(--text);line-height:1.7;font-size:1rem;-webkit-font-smoothing:antialiased;background:var(--white);overflow-x:clip;max-width:100vw}
.stil-elegant body,.stil-elegant{line-height:1.8;letter-spacing:-.01em}
img{max-width:100%;display:block}
a{color:inherit}

/* ═══════════════════════════════════════════════════════
   LAYOUT
   ═══════════════════════════════════════════════════════ */
.w{max-width:var(--maxW);margin:0 auto;padding:0 28px}
@media(min-width:900px){.w{padding:0 32px}}

/* ═══════════════════════════════════════════════════════
   ANIMATIONS
   ═══════════════════════════════════════════════════════ */
@keyframes sr-up{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes sr-grain{0%,100%{transform:translate(0,0)}10%{transform:translate(-5%,-10%)}30%{transform:translate(3%,-15%)}50%{transform:translate(-15%,5%)}70%{transform:translate(12%,10%)}90%{transform:translate(-3%,8%)}}

.sr-a{opacity:0;animation:sr-up .55s cubic-bezier(.22,1,.36,1) forwards}
.stil-elegant .sr-a{animation-duration:.65s}

/* Scroll-Animation: fade-up (Mockup-Naming) + sr-fade (Serve-Time-Kompatibilitaet) */
.fade-up,.sr-fade{opacity:0;transform:translateY(16px);transition:opacity .7s cubic-bezier(.22,1,.36,1),transform .7s cubic-bezier(.22,1,.36,1)}
.fade-up.visible,.sr-fade.sr-vis{opacity:1;transform:translateY(0)}
.stil-elegant .fade-up,.stil-elegant .sr-fade{transform:translateY(12px);transition-duration:.8s}
@media(prefers-reduced-motion:reduce){.fade-up,.sr-fade{opacity:1;transform:none;transition:none}.sr-grain::after{animation:none}}
@media(max-width:768px){.sr-grain::after{animation:none}}

/* Button-Hover: Pfeil-Slide */
.btn{position:relative;transition:transform .28s cubic-bezier(.22,1,.36,1),box-shadow .28s cubic-bezier(.22,1,.36,1)}
.btn::after{content:"\\2192";display:inline-block;opacity:0;margin-left:0;transform:translateX(-6px);transition:opacity .28s cubic-bezier(.22,1,.36,1),transform .28s cubic-bezier(.22,1,.36,1),margin-left .28s cubic-bezier(.22,1,.36,1);font-weight:600}
.btn:hover::after{opacity:1;transform:translateX(0);margin-left:8px}
.btn:hover{transform:translateY(-1px);box-shadow:0 10px 28px rgba(0,0,0,.18)}
@media(prefers-reduced-motion:reduce){.btn,.btn::after{transition:none}.btn:hover{transform:none}}

/* Ablauf: Steps nacheinander einblenden */
.sr-ablauf-h > div:not(.sr-ablauf-arrow){opacity:0;transform:translateY(14px);transition:opacity .65s cubic-bezier(.22,1,.36,1),transform .65s cubic-bezier(.22,1,.36,1)}
.sr-ablauf-h > div:not(.sr-ablauf-arrow) > div:first-child{transform:scale(.2);transition:transform .65s cubic-bezier(.34,1.56,.64,1)}
.sr-ablauf-h.sr-ablauf-play > div:not(.sr-ablauf-arrow){opacity:1;transform:none}
.sr-ablauf-h.sr-ablauf-play > div:not(.sr-ablauf-arrow) > div:first-child{transform:scale(1)}
.sr-ablauf-h.sr-ablauf-play > div:nth-child(1){transition-delay:0ms}
.sr-ablauf-h.sr-ablauf-play > div:nth-child(3){transition-delay:190ms}
.sr-ablauf-h.sr-ablauf-play > div:nth-child(5){transition-delay:380ms}
.sr-ablauf-h.sr-ablauf-play > div:nth-child(7){transition-delay:570ms}
.sr-ablauf-h.sr-ablauf-play > div:nth-child(1) > div:first-child{transition-delay:110ms}
.sr-ablauf-h.sr-ablauf-play > div:nth-child(3) > div:first-child{transition-delay:300ms}
.sr-ablauf-h.sr-ablauf-play > div:nth-child(5) > div:first-child{transition-delay:490ms}
.sr-ablauf-h.sr-ablauf-play > div:nth-child(7) > div:first-child{transition-delay:680ms}
.sr-ablauf-h .sr-ablauf-arrow{opacity:0;transition:opacity .45s ease}
.sr-ablauf-h.sr-ablauf-play .sr-ablauf-arrow:nth-child(2){transition-delay:240ms;opacity:1}
.sr-ablauf-h.sr-ablauf-play .sr-ablauf-arrow:nth-child(4){transition-delay:430ms;opacity:1}
.sr-ablauf-h.sr-ablauf-play .sr-ablauf-arrow:nth-child(6){transition-delay:620ms;opacity:1}
@media(prefers-reduced-motion:reduce){.sr-ablauf-h *{opacity:1 !important;transform:none !important;transition:none !important}}

/* Ueber-uns Vorteile: staggered reveal + Check-Kreis Pop */
.ueber-vorteile > div{opacity:0;transform:translateX(-10px);transition:opacity .55s cubic-bezier(.22,1,.36,1),transform .55s cubic-bezier(.22,1,.36,1)}
.ueber-vorteile > div > div:first-child{transform:scale(.2);transition:transform .55s cubic-bezier(.34,1.56,.64,1)}
.ueber-vorteile.ueber-vorteile-play > div{opacity:1;transform:none}
.ueber-vorteile.ueber-vorteile-play > div > div:first-child{transform:scale(1)}
.ueber-vorteile.ueber-vorteile-play > div:nth-child(1){transition-delay:0ms}
.ueber-vorteile.ueber-vorteile-play > div:nth-child(2){transition-delay:120ms}
.ueber-vorteile.ueber-vorteile-play > div:nth-child(3){transition-delay:240ms}
.ueber-vorteile.ueber-vorteile-play > div:nth-child(4){transition-delay:360ms}
.ueber-vorteile.ueber-vorteile-play > div:nth-child(5){transition-delay:480ms}
.ueber-vorteile.ueber-vorteile-play > div:nth-child(6){transition-delay:600ms}
.ueber-vorteile.ueber-vorteile-play > div:nth-child(7){transition-delay:720ms}
.ueber-vorteile.ueber-vorteile-play > div:nth-child(8){transition-delay:840ms}
.ueber-vorteile.ueber-vorteile-play > div:nth-child(1) > div:first-child{transition-delay:70ms}
.ueber-vorteile.ueber-vorteile-play > div:nth-child(2) > div:first-child{transition-delay:190ms}
.ueber-vorteile.ueber-vorteile-play > div:nth-child(3) > div:first-child{transition-delay:310ms}
.ueber-vorteile.ueber-vorteile-play > div:nth-child(4) > div:first-child{transition-delay:430ms}
.ueber-vorteile.ueber-vorteile-play > div:nth-child(5) > div:first-child{transition-delay:550ms}
.ueber-vorteile.ueber-vorteile-play > div:nth-child(6) > div:first-child{transition-delay:670ms}
.ueber-vorteile.ueber-vorteile-play > div:nth-child(7) > div:first-child{transition-delay:790ms}
.ueber-vorteile.ueber-vorteile-play > div:nth-child(8) > div:first-child{transition-delay:910ms}
@media(prefers-reduced-motion:reduce){.ueber-vorteile *{opacity:1 !important;transform:none !important;transition:none !important}}

/* Hero Content Staggered Reveal (Pageload) */
.hero-sub,.hero h1,.hero-accent-line,.hero-desc,.hero-btns,.hero-split-img{opacity:0;transform:translateY(14px);transition:opacity .75s cubic-bezier(.22,1,.36,1),transform .75s cubic-bezier(.22,1,.36,1)}
body.hero-play .hero-sub{opacity:1;transform:none;transition-delay:0ms}
body.hero-play .hero h1{opacity:1;transform:none;transition-delay:110ms}
body.hero-play .hero-accent-line{opacity:1;transform:none;transition-delay:220ms}
body.hero-play .hero-desc{opacity:1;transform:none;transition-delay:330ms}
body.hero-play .hero-btns{opacity:1;transform:none;transition-delay:440ms}
body.hero-play .hero-split-img{opacity:1;transform:none;transition-delay:180ms}
@media(prefers-reduced-motion:reduce){.hero-sub,.hero h1,.hero-accent-line,.hero-desc,.hero-btns,.hero-split-img{opacity:1 !important;transform:none !important;transition:none !important}}

/* Nav-Scroll-Glass */
#sitenav{transition:background .35s cubic-bezier(.22,1,.36,1),backdrop-filter .35s cubic-bezier(.22,1,.36,1),-webkit-backdrop-filter .35s cubic-bezier(.22,1,.36,1),box-shadow .35s cubic-bezier(.22,1,.36,1)}
body.nav-scrolled #sitenav{background:color-mix(in srgb,var(--primary) 88%,transparent) !important;-webkit-backdrop-filter:blur(12px) saturate(140%);backdrop-filter:blur(12px) saturate(140%);box-shadow:0 6px 22px rgba(0,0,0,.2);border-bottom:1px solid rgba(255,255,255,.08)}
@supports not ((-webkit-backdrop-filter:blur(1px)) or (backdrop-filter:blur(1px))){body.nav-scrolled #sitenav{background:var(--primary) !important}}

/* Grain-Overlay fuer Tiefe (Hero, About) */
.sr-grain::after{content:'';position:absolute;inset:-50%;width:200%;height:200%;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.04'/%3E%3C/svg%3E");background-repeat:repeat;pointer-events:none;z-index:0;opacity:.5;animation:sr-grain 8s steps(8) infinite}
.stil-elegant .sr-grain::after{opacity:.3}
.stil-modern .hero.sr-grain::after{display:none}

/* ═══════════════════════════════════════════════════════
   ACCESSIBILITY
   ═══════════════════════════════════════════════════════ */
:focus-visible{outline:2px solid var(--accent);outline-offset:2px;border-radius:2px}
.btn:focus-visible{outline-offset:2px;box-shadow:0 0 0 4px rgba(99,102,241,.25);box-shadow:0 0 0 4px color-mix(in srgb,var(--accent) 25%,transparent)}
.nav-link:focus-visible,.mob-link:focus-visible{outline:2px solid rgba(255,255,255,.6);outline-offset:3px}
.nav-cta:focus-visible,.mob-cta:focus-visible{outline:2px solid rgba(255,255,255,.8);outline-offset:3px}
.k-form input:focus-visible,.k-form textarea:focus-visible,.k-form select:focus-visible{outline:none;border-color:var(--accent);box-shadow:0 0 0 3px rgba(99,102,241,.15);box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 15%,transparent)}
.kontakt-social a:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.kontakt-tel:focus-visible,.kontakt-email:focus-visible{outline:2px solid var(--accent);outline-offset:2px}

.sr-skip{position:absolute;top:-100px;left:16px;background:var(--accent);color:#fff;padding:12px 24px;border-radius:var(--r);font-weight:700;font-size:.88rem;z-index:10000;text-decoration:none;transition:top .2s}
.sr-skip:focus{top:16px}

/* ═══════════════════════════════════════════════════════
   SECTION HEADERS (gemeinsame Klassen)
   ═══════════════════════════════════════════════════════ */
.s-label{display:inline-flex;align-items:center;font-size:.72rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--accent);margin-bottom:14px}
.s-label-light{color:rgba(255,255,255,.6)}
.s-h2{font-size:clamp(1.5rem,3vw,2.2rem);font-weight:800;color:var(--primary);letter-spacing:-.03em;margin-bottom:12px}
.s-intro{color:var(--textMuted);font-size:.95rem;max-width:540px;line-height:1.7}

/* Section Headers — Modern */
.stil-modern .s-label{gap:6px;letter-spacing:.1em;background:color-mix(in srgb,var(--accent) 8%,transparent);padding:6px 14px;border-radius:100px}
.stil-modern .s-h2{font-size:clamp(2rem,4.5vw,3rem)}

/* Section Headers — Elegant */
.stil-elegant .s-label{font-size:.68rem;font-weight:500;letter-spacing:.14em}
.stil-elegant .s-label-light{letter-spacing:.18em}
.stil-elegant .s-h2{font-size:clamp(1.8rem,4vw,2.8rem);font-weight:500;letter-spacing:-.02em}
.stil-elegant .s-intro{line-height:1.8}

/* ═══════════════════════════════════════════════════════
   HERO
   ═══════════════════════════════════════════════════════ */
.hero{background:linear-gradient(150deg,var(--primary) 0%,color-mix(in srgb,var(--primary) 65%,#000) 60%,color-mix(in srgb,var(--primary) 80%,var(--accent)) 100%);color:#fff;display:flex;align-items:center;position:relative;min-height:92vh;min-height:92svh;overflow:hidden}
.hero-inner{position:relative;z-index:2;width:100%;max-width:var(--maxW);margin:0 auto;padding:120px 28px 60px}
.hero h1{font-size:clamp(2.8rem,5.5vw,4.6rem);font-weight:800;line-height:1.05;letter-spacing:-.04em;margin-bottom:20px;max-width:720px}
.hero-accent-line{display:none}

/* Eyebrow-Badge: Branche oberhalb H1 (Klassisch + Modern) */
.hero-sub{display:inline-flex;align-items:center;gap:6px;padding:7px 16px;border:1px solid rgba(255,255,255,.2);border-radius:100px;background:rgba(255,255,255,.09);font-size:.72rem;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:rgba(255,255,255,.92);margin-bottom:22px}
.hero-sub .hero-loc{display:inline-flex;align-items:center;gap:4px;text-transform:none;font-weight:600;opacity:.8}

.hero-desc{font-size:.95rem;color:rgba(255,255,255,.62);max-width:500px;margin-bottom:34px;line-height:1.78}
.hero-btns{display:flex;flex-wrap:wrap;gap:12px;margin-bottom:0}

/* Klassisch: dekorative Kreise rechts oben */
body:not(.stil-modern):not(.stil-elegant) .hero::before{content:'';position:absolute;top:-120px;right:-120px;width:540px;height:540px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.05) 0%,transparent 65%);pointer-events:none;z-index:0}
body:not(.stil-modern):not(.stil-elegant) .hero::after{content:'';position:absolute;top:80px;right:180px;width:220px;height:220px;border-radius:50%;border:1px solid rgba(255,255,255,.04);pointer-events:none;z-index:0}

/* Hero-Bild (serve-time Injection fuer Split-Variante) */
.hero-img{display:none}

/* Hero — Modern: Blur-Blobs statt Grain */
.stil-modern .hero{background:var(--primary);overflow:hidden}
.stil-modern .hero::before{content:'';position:absolute;width:700px;height:700px;border-radius:50%;background:radial-gradient(circle,var(--accent),transparent 70%);opacity:.14;top:-200px;right:-150px;filter:blur(50px);pointer-events:none}
.stil-modern .hero::after{content:'';position:absolute;width:450px;height:450px;border-radius:50%;background:radial-gradient(circle,color-mix(in srgb,var(--accent) 60%,#fff),transparent 70%);opacity:.07;bottom:-120px;left:-60px;filter:blur(70px);pointer-events:none;z-index:0}
.stil-modern .hero h1{font-size:clamp(3.2rem,7vw,5.8rem);letter-spacing:-.045em}
.stil-modern .hero-inner{padding:120px 28px 60px}
.stil-modern .hero-sub{background:color-mix(in srgb,var(--accent) 18%,rgba(255,255,255,.05));border-color:color-mix(in srgb,var(--accent) 35%,rgba(255,255,255,.1));color:rgba(255,255,255,.95)}

/* Hero — Elegant: Schlicht, Akzentlinie als Trenner */
.stil-elegant .hero{background:linear-gradient(155deg,var(--primary) 0%,color-mix(in srgb,var(--primary) 60%,#000) 100%);align-items:center}
.stil-elegant .hero-inner{padding:140px 28px 68px}
.stil-elegant .hero h1{font-size:clamp(3rem,7vw,5.5rem);font-weight:500;margin-bottom:0;letter-spacing:-.02em}
.stil-elegant .hero-accent-line{display:block;width:48px;height:1px;background:var(--accent);margin:28px 0 28px;opacity:.55}
.stil-elegant .hero-sub{background:transparent;border-color:rgba(255,255,255,.14);text-transform:none;letter-spacing:.04em;font-weight:400;font-size:.8rem;padding:6px 14px;color:rgba(255,255,255,.7);margin-bottom:0}
.stil-elegant .hero-desc{color:rgba(255,255,255,.52);line-height:1.85}

/* ── Trust Bar ── */
.trust{padding:18px 0;background:var(--bg,#f8fafc);border-bottom:1px solid var(--sep)}
.trust-items{display:flex;flex-wrap:wrap;justify-content:center;gap:12px 28px}
.trust-item{display:flex;align-items:center;gap:7px;font-size:.82rem;font-weight:600;color:var(--primary);white-space:nowrap}
.trust-item svg{color:var(--accent);flex-shrink:0}

/* Trust — Modern: Pill-Karten mit Schatten */
.stil-modern .trust{padding:20px 0}
.stil-modern .trust-items{gap:14px 24px}
.stil-modern .trust-item{background:#fff;padding:8px 16px;border-radius:100px;box-shadow:0 1px 4px rgba(0,0,0,.06)}

/* Trust — Elegant: Minimal */
.stil-elegant .trust-items{gap:12px 32px}
.stil-elegant .trust-item{font-size:.78rem;font-weight:500;letter-spacing:.01em}
.stil-elegant .trust-item svg{opacity:.7}

/* Hero Trust Bar (fuer Mockup-Variante innerhalb Hero) */
.hero-trust-bar{position:relative;z-index:2;margin-top:32px;padding-top:24px;border-top:1px solid rgba(255,255,255,.1)}
.hero-trust-inner{display:flex;flex-wrap:wrap;gap:12px 28px}
.t-item{display:flex;align-items:center;gap:7px;font-size:.82rem;font-weight:600;color:rgba(255,255,255,.85);white-space:nowrap}
.t-icon{width:28px;height:28px;border-radius:var(--r);border:1px solid rgba(255,255,255,.15);display:flex;align-items:center;justify-content:center;flex-shrink:0}
.t-icon svg{width:14px;height:14px;color:rgba(255,255,255,.7)}

.stil-modern .t-item{background:rgba(255,255,255,.06);padding:6px 14px;border-radius:100px;backdrop-filter:blur(4px)}
.stil-modern .t-icon{border:none;background:rgba(255,255,255,.1);border-radius:50%}
.stil-elegant .t-item{font-size:.78rem;font-weight:400;color:rgba(255,255,255,.6);letter-spacing:.01em}
.stil-elegant .t-icon{border-color:rgba(255,255,255,.1)}

/* ═══════════════════════════════════════════════════════
   BUTTONS
   ═══════════════════════════════════════════════════════ */
.btn{display:inline-flex;align-items:center;justify-content:center;min-height:50px;padding:14px 32px;font-size:.9rem;font-weight:600;text-decoration:none;border-radius:var(--r);transition:all .2s cubic-bezier(.22,1,.36,1);cursor:pointer;border:none;font-family:var(--font);letter-spacing:.01em}
.btn-accent{background:var(--accent);color:#fff}
.btn-accent:hover{opacity:.92;transform:translateY(-1px);box-shadow:0 4px 16px rgba(0,0,0,.18)}
.btn-accent:active{transform:translateY(0);box-shadow:none}
.btn-ghost{background:rgba(255,255,255,.08);color:rgba(255,255,255,.85);border:1.5px solid rgba(255,255,255,.2);backdrop-filter:blur(6px)}
.btn-ghost:hover{border-color:rgba(255,255,255,.5);color:#fff;background:rgba(255,255,255,.14)}

/* Buttons — Modern: Pill + Glow */
.stil-modern .btn{font-weight:700;border-radius:100px;transition:all .25s cubic-bezier(.22,1,.36,1)}
.stil-modern .btn-accent{box-shadow:0 4px 16px color-mix(in srgb,var(--accent) 30%,transparent)}
.stil-modern .btn-accent:hover{opacity:.9;transform:translateY(-3px) scale(1.02);box-shadow:0 8px 32px color-mix(in srgb,var(--accent) 40%,transparent)}
.stil-modern .btn-accent:active{transform:translateY(0) scale(.97)}
.stil-modern .btn-ghost{border-radius:100px;border:1.5px solid rgba(255,255,255,.15);backdrop-filter:blur(4px)}
.stil-modern .btn-ghost:hover{background:rgba(255,255,255,.12);border-color:rgba(255,255,255,.3)}

/* Buttons — Elegant: Minimal, ruhig */
.stil-elegant .btn{font-weight:500;letter-spacing:.02em}
.stil-elegant .btn-accent:hover{opacity:.82;transform:none;box-shadow:none}
.stil-elegant .btn-ghost{border-width:1px;border-color:rgba(255,255,255,.15);color:rgba(255,255,255,.65)}
.stil-elegant .btn-ghost:hover{background:rgba(255,255,255,.05)}

/* ═══════════════════════════════════════════════════════
   LEISTUNGEN
   ═══════════════════════════════════════════════════════ */
.leist{padding:var(--sectionY) 0;background:var(--bg);position:relative}
.leist-head{margin-bottom:40px}
.leist-label,.sec-label{display:inline-flex;align-items:center;font-size:.72rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--accent);margin-bottom:14px}
.leist h2{font-size:clamp(1.5rem,3vw,2.2rem);font-weight:800;color:var(--primary);letter-spacing:-.03em;margin-bottom:12px}
.leist-intro{color:var(--textMuted);font-size:.95rem;max-width:540px;line-height:1.7}

/* Leistungen-Grid (serve-time) */
.leist-list{display:grid;gap:40px;margin-bottom:48px}
.leist-item{display:grid;grid-template-columns:1fr 1fr;gap:32px;align-items:center}
.leist-item:nth-child(even){direction:rtl}
.leist-item>*{direction:ltr}
.leist-item-img{border-radius:var(--rLg);overflow:hidden;aspect-ratio:3/2;object-fit:cover;width:100%;transition:transform .6s cubic-bezier(.22,1,.36,1)}
.leist-item-img:hover{transform:scale(1.02)}
.leist-item-text h3{font-size:1.15rem;font-weight:700;color:var(--primary);margin-bottom:8px}
.leist-item-text p{font-size:.9rem;color:var(--textMuted);line-height:1.7}
.leist-item-meta{display:flex;gap:16px;margin-top:12px;font-size:.82rem;color:var(--textMuted)}
.leist-item-price{font-family:var(--mono);font-weight:600;color:var(--primary)}
.leist-item-link{color:var(--accent);text-decoration:none;font-weight:600}
.leist-item-link:hover{text-decoration:underline}

/* Kompakte Leistungen (3-Spalten-Grid) */
.leist-more{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:32px}
.leist-more-item{background:var(--bg);border-radius:var(--rLg);padding:24px;transition:transform .3s cubic-bezier(.22,1,.36,1),box-shadow .3s}
.leist-more-item:hover{transform:translateY(-3px);box-shadow:0 4px 16px rgba(0,0,0,.06)}
.leist-more-item h4{font-size:.92rem;font-weight:700;color:var(--primary);margin-bottom:6px}
.leist-more-item p{font-size:.82rem;color:var(--textMuted);line-height:1.6}

/* Leistungen — Modern */
.stil-modern .leist-label,.stil-modern .sec-label{gap:6px;letter-spacing:.1em;background:color-mix(in srgb,var(--accent) 8%,transparent);padding:6px 14px;border-radius:100px}
.stil-modern .leist h2{font-size:clamp(1.6rem,3vw,2.4rem)}
.stil-modern .leist-more-item{border-radius:16px;box-shadow:0 2px 12px rgba(0,0,0,.04)}
.stil-modern .leist-more-item:hover{transform:translateY(-5px);box-shadow:0 8px 32px rgba(0,0,0,.08)}

/* Leistungen — Elegant */
.stil-elegant .leist-label,.stil-elegant .sec-label{font-size:.68rem;font-weight:500;letter-spacing:.14em}
.stil-elegant .leist h2{font-size:clamp(1.4rem,3vw,2rem);font-weight:500;letter-spacing:-.02em}
.stil-elegant .leist-intro{line-height:1.8}
.stil-elegant .leist-item-text h3{font-weight:500}
.stil-elegant .leist-item-img{filter:saturate(.75)}
.stil-elegant .leist-item-img:hover{transform:scale(1.03);filter:saturate(.9)}
.stil-elegant .leist-more-item{background:transparent;border:1px solid var(--sep);border-radius:var(--rLg)}
.stil-elegant .leist-more-item:hover{transform:none;box-shadow:none;border-color:var(--accent)}

@media(max-width:768px){
.leist-item{grid-template-columns:1fr!important}
.leist-item:nth-child(even){direction:ltr}
.leist-more{grid-template-columns:1fr}
}

/* ═══════════════════════════════════════════════════════
   ABLAUF (serve-time Section)
   ═══════════════════════════════════════════════════════ */
.ablauf{padding:var(--sectionY) 0;background:#fff;position:relative}
.ablauf-head{margin-bottom:48px}
.ablauf-steps{display:grid;grid-template-columns:repeat(4,1fr);gap:24px}
.ablauf-step{background:var(--bg);border-radius:var(--rLg);padding:28px 24px;position:relative;transition:transform .3s cubic-bezier(.22,1,.36,1)}
.ablauf-step:hover{transform:translateY(-3px)}
.ablauf-num{font-family:var(--mono);font-size:1.8rem;font-weight:700;color:var(--accent);opacity:.35;margin-bottom:12px;display:block}
.ablauf-step h4{font-size:.95rem;font-weight:700;color:var(--primary);margin-bottom:6px}
.ablauf-step p{font-size:.82rem;color:var(--textMuted);line-height:1.6}

/* Ablauf — Modern: Gradient-Stripe oben */
.stil-modern .ablauf-step{border-radius:16px;box-shadow:0 2px 12px rgba(0,0,0,.04)}
.stil-modern .ablauf-step::before{content:'';position:absolute;top:0;left:0;right:0;height:4px;border-radius:16px 16px 0 0;background:linear-gradient(90deg,var(--accent),color-mix(in srgb,var(--accent) 60%,#818cf8))}
.stil-modern .ablauf-num{font-size:2rem;opacity:.5;background:linear-gradient(135deg,var(--accent),color-mix(in srgb,var(--accent) 60%,#818cf8));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.stil-modern .ablauf-step:hover{transform:translateY(-5px);box-shadow:0 8px 32px rgba(0,0,0,.08)}

/* Ablauf — Elegant: Schlicht, grosse Nummern */
.stil-elegant .ablauf-step{background:transparent;border:1px solid var(--sep);border-radius:var(--rLg);padding:32px 24px}
.stil-elegant .ablauf-step:hover{transform:none;border-color:var(--accent)}
.stil-elegant .ablauf-num{font-size:2.4rem;font-weight:300;opacity:.25}
.stil-elegant .ablauf-step h4{font-weight:500}
.stil-elegant .ablauf-step p{font-size:.8rem}

@media(max-width:768px){.ablauf-steps{grid-template-columns:1fr 1fr}.sr-ablauf-h{flex-direction:column;align-items:stretch!important}.sr-ablauf-h>div{min-width:0!important;max-width:100%}.sr-ablauf-arrow{transform:rotate(90deg);align-self:center;padding-top:0!important}}
@media(max-width:480px){.ablauf-steps{grid-template-columns:1fr}}

/* ═══════════════════════════════════════════════════════
   ÜBER UNS
   ═══════════════════════════════════════════════════════ */
.ueber{padding:var(--sectionY) 0;background:var(--primary);color:#fff;position:relative;overflow:hidden}
.ueber-grid{display:grid;gap:40px;position:relative;z-index:1}
.ueber h2{font-size:clamp(1.4rem,3vw,2rem);font-weight:800;letter-spacing:-.03em;margin-bottom:18px;color:#fff}
.ueber-text{font-size:.95rem;line-height:1.85;opacity:.82;margin-bottom:24px}
.ueber-vorteile{list-style:none;display:flex;flex-direction:column;gap:12px}
.ueber-vorteile li{font-size:.92rem;font-weight:500;opacity:.88;padding-left:20px;position:relative;transition:opacity .2s}
.ueber-vorteile li:hover{opacity:1}
.ueber-vorteile li::before{content:'';position:absolute;left:0;top:9px;width:5px;height:5px;background:var(--accent);border-radius:1px;opacity:.85}

/* About — Stats (serve-time) */
.ueber-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:24px;margin-top:48px;padding-top:32px;border-top:1px solid rgba(255,255,255,.1)}
.ueber-stat{text-align:center}
.ueber-stat-num{font-family:var(--mono);font-size:clamp(1.6rem,3vw,2.4rem);font-weight:700;color:#fff;margin-bottom:4px}
.ueber-stat-label{font-size:.76rem;color:rgba(255,255,255,.5);font-weight:500;text-transform:uppercase;letter-spacing:.06em}

/* About — Modern: Blob + Checkmarks */
.stil-modern .ueber::before{content:'';position:absolute;width:400px;height:400px;border-radius:50%;background:var(--accent);opacity:.06;bottom:-120px;left:-80px;filter:blur(60px);pointer-events:none}
.stil-modern .ueber h2{font-size:clamp(1.5rem,3vw,2.2rem)}
.stil-modern .ueber-vorteile{gap:14px}
.stil-modern .ueber-vorteile li{padding-left:28px}
.stil-modern .ueber-vorteile li::before{content:'\\2713';width:22px;height:22px;display:inline-flex;align-items:center;justify-content:center;background:rgba(255,255,255,.15);color:#fff;border-radius:50%;font-size:.65rem;font-weight:700;top:0;left:0}

/* About — Elegant: Dash-Separatoren */
.stil-elegant .ueber h2{font-size:clamp(1.4rem,3vw,2rem);font-weight:500;letter-spacing:-.02em}
.stil-elegant .ueber-text{opacity:.7}
.stil-elegant .ueber-vorteile{gap:0}
.stil-elegant .ueber-vorteile li{font-weight:400;opacity:.85;padding:14px 0 14px 24px;border-top:1px solid rgba(255,255,255,.08)}
.stil-elegant .ueber-vorteile li:last-child{border-bottom:1px solid rgba(255,255,255,.08)}
.stil-elegant .ueber-vorteile li::before{content:'\\2013';position:absolute;left:0;top:14px;width:auto;height:auto;background:none;color:rgba(255,255,255,.5);font-weight:500;border-radius:0}
.stil-elegant .ueber-stat-num{font-weight:300}
.stil-elegant .ueber-stat-label{font-size:.7rem;letter-spacing:.12em}

@media(min-width:900px){.ueber-grid{grid-template-columns:1fr 1fr;gap:48px;align-items:start}.ueber-grid.ueber-single{grid-template-columns:1fr!important;max-width:680px;margin:0 auto;text-align:center}.ueber-grid.ueber-single>*:not(:first-child){display:none}.ueber-grid.ueber-single .ueber-vorteile{text-align:left;display:inline-flex}}
@media(max-width:768px){.ueber-stats{grid-template-columns:1fr 1fr}}

/* ═══════════════════════════════════════════════════════
   TEAM (serve-time Section)
   ═══════════════════════════════════════════════════════ */
.team{padding:var(--sectionY) 0;background:var(--bg)}
.team-head{margin-bottom:40px}
.team-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:28px}
.team-member{text-align:center}
.team-avatar{width:100%;aspect-ratio:1;object-fit:cover;border-radius:var(--rLg);margin-bottom:16px;transition:transform .4s cubic-bezier(.22,1,.36,1)}
.team-avatar:hover{transform:scale(1.02)}
.team-avatar-placeholder{width:100%;aspect-ratio:1;border-radius:var(--rLg);background:color-mix(in srgb,var(--accent) 8%,var(--bg));display:flex;align-items:center;justify-content:center;font-size:1.8rem;font-weight:700;color:var(--accent);margin-bottom:16px}
.team-name{font-size:1rem;font-weight:700;color:var(--primary);margin-bottom:2px}
.team-role{font-size:.82rem;color:var(--textMuted)}

.stil-modern .team-avatar{border-radius:16px}
.stil-modern .team-member{background:#fff;border-radius:16px;padding:20px;box-shadow:0 2px 12px rgba(0,0,0,.04);transition:transform .3s,box-shadow .3s}
.stil-modern .team-member:hover{transform:translateY(-4px);box-shadow:0 8px 32px rgba(0,0,0,.08)}
.stil-elegant .team-avatar{filter:grayscale(.8) saturate(.5);transition:filter .4s,transform .4s}
.stil-elegant .team-avatar:hover{filter:grayscale(.2) saturate(.8);transform:scale(1.02)}
.stil-elegant .team-name{font-weight:500}
.stil-elegant .team-role{font-size:.78rem;letter-spacing:.02em}

@media(max-width:768px){.team-grid{grid-template-columns:1fr 1fr}}

/* ═══════════════════════════════════════════════════════
   GALERIE (serve-time Section)
   ═══════════════════════════════════════════════════════ */
.galerie{padding:var(--sectionY) 0;background:var(--bg)}
.galerie-head{margin-bottom:32px}
.galerie-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
.galerie-item{border-radius:var(--rLg);overflow:hidden;aspect-ratio:3/2;cursor:pointer}
.galerie-item img{width:100%;height:100%;object-fit:cover;transition:transform .5s cubic-bezier(.22,1,.36,1)}
.galerie-item:hover img{transform:scale(1.04)}

.stil-modern .galerie-item{border-radius:16px}
.stil-elegant .galerie-item img{filter:saturate(.8) contrast(.95)}
.stil-elegant .galerie-item:hover img{filter:saturate(1) contrast(1)}

@media(max-width:768px){.galerie-grid{grid-template-columns:1fr 1fr}}

/* ═══════════════════════════════════════════════════════
   BEWERTUNGEN (serve-time Section)
   ═══════════════════════════════════════════════════════ */
.bew{padding:var(--sectionY) 0;background:#fff}
.bew-head{margin-bottom:40px}

/* Rating-Zusammenfassung */
.bew-rating{display:flex;align-items:center;gap:12px;margin-bottom:32px}
.bew-rating-num{font-family:var(--mono);font-size:1.4rem;font-weight:700;color:var(--primary)}
.bew-rating-bar{height:6px;border-radius:3px;background:var(--sep);flex:1;max-width:180px;overflow:hidden}
.bew-rating-fill{height:100%;border-radius:3px;background:var(--accent)}

/* Variante: Cards (2+) */
.bew-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.bew-card{background:var(--bg);border-radius:var(--rLg);padding:28px;position:relative;transition:transform .3s,box-shadow .3s}
.bew-card:hover{transform:translateY(-3px);box-shadow:0 4px 16px rgba(0,0,0,.06)}
.bew-text{font-size:.9rem;color:var(--text);line-height:1.7;margin-bottom:16px;font-style:italic}
.bew-author{display:flex;align-items:center;gap:10px}
.bew-avatar{width:36px;height:36px;border-radius:50%;background:color-mix(in srgb,var(--accent) 12%,#fff);display:flex;align-items:center;justify-content:center;font-size:.75rem;font-weight:700;color:var(--accent);flex-shrink:0}
.bew-name{font-size:.85rem;font-weight:600;color:var(--primary)}
.bew-meta{font-size:.75rem;color:var(--textMuted)}

/* Variante: Blockquote (1) */
.bew-quote{max-width:640px}
.bew-quote-text{font-size:clamp(1.1rem,2vw,1.4rem);line-height:1.7;color:var(--text);font-style:italic;margin-bottom:20px;padding-left:24px;border-left:3px solid var(--accent)}
.bew-quote-author{padding-left:24px}
.bew-quote-name{font-size:.9rem;font-weight:700;color:var(--primary)}
.bew-quote-meta{font-size:.78rem;color:var(--textMuted)}

/* Variante: Liste */
.bew-list{display:flex;flex-direction:column;gap:20px}
.bew-item{display:grid;grid-template-columns:1fr auto;gap:20px;padding-bottom:20px;border-bottom:1px solid var(--sep)}
.bew-item:last-child{border-bottom:none}
.bew-author-side{text-align:right;white-space:nowrap}

/* Bewertungen — Modern: Gradient-Border */
.stil-modern .bew-card{background:#fff;border-radius:16px;box-shadow:0 2px 12px rgba(0,0,0,.04);isolation:isolate;overflow:hidden}
.stil-modern .bew-card::before{content:'';position:absolute;inset:-1px;border-radius:17px;padding:1px;background:linear-gradient(135deg,var(--accent),color-mix(in srgb,var(--accent) 50%,#818cf8),color-mix(in srgb,var(--accent) 30%,#c084fc));-webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);-webkit-mask-composite:xor;mask-composite:exclude;opacity:.3;transition:opacity .3s;pointer-events:none;z-index:-1}
.stil-modern .bew-card:hover{transform:translateY(-5px);box-shadow:0 8px 32px rgba(0,0,0,.08)}
.stil-modern .bew-card:hover::before{opacity:.7}

/* Bewertungen — Elegant: Schlicht */
.stil-elegant .bew-card{background:transparent;border:1px solid var(--sep);border-radius:var(--rLg)}
.stil-elegant .bew-card:hover{transform:none;box-shadow:none;border-color:var(--accent)}
.stil-elegant .bew-text{font-size:.88rem}
.stil-elegant .bew-quote-text{font-size:clamp(1rem,2vw,1.3rem);border-left-width:1px;padding-left:28px}

@media(max-width:768px){.bew-grid{grid-template-columns:1fr}}

/* ═══════════════════════════════════════════════════════
   CTA BLOCK (serve-time Section)
   ═══════════════════════════════════════════════════════ */
.cta-block{padding:64px 0;background:var(--primary);color:#fff;text-align:center;position:relative;overflow:hidden}
.cta-block-inner{position:relative;z-index:1}
.cta-block h2{font-size:clamp(1.3rem,3vw,1.8rem);font-weight:800;margin-bottom:10px;color:#fff}
.cta-block p{font-size:.9rem;opacity:.6;margin-bottom:28px}
.cta-block .btn-accent{background:#fff;color:var(--primary)}
.cta-block .btn-accent:hover{opacity:.9}

.stil-modern .cta-block{background:var(--accent);background:linear-gradient(135deg,var(--accent),color-mix(in srgb,var(--accent) 60%,#818cf8))}
.stil-modern .cta-block::before{content:'';position:absolute;width:300px;height:300px;border-radius:50%;background:rgba(255,255,255,.08);top:-100px;right:-50px;filter:blur(40px);pointer-events:none}
.stil-modern .cta-block p{opacity:.8}
.stil-modern .cta-block .btn-accent{color:var(--accent)}

.stil-elegant .cta-block h2{font-weight:500;letter-spacing:-.01em}
.stil-elegant .cta-block p{opacity:.5;font-size:.85rem}

@media(min-width:900px){.cta-block{padding:80px 0}}

/* ═══════════════════════════════════════════════════════
   FAQ (serve-time Section)
   ═══════════════════════════════════════════════════════ */
.faq{padding:var(--sectionY) 0;background:#fff}
.faq-layout{display:grid;gap:40px}
.faq-head{margin-bottom:0}
.faq-list{display:flex;flex-direction:column}
.faq-item{border-bottom:1px solid var(--sep)}
.faq-q{display:flex;justify-content:space-between;align-items:center;width:100%;background:none;border:none;padding:20px 0;font-size:.95rem;font-weight:600;color:var(--primary);cursor:pointer;text-align:left;font-family:var(--font);gap:16px;transition:color .2s}
.faq-q:hover{color:var(--accent)}
.faq-toggle{width:28px;height:28px;border-radius:50%;background:var(--bg);display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:transform .3s,background .3s;font-size:.85rem;color:var(--textMuted)}
.faq-a{max-height:0;overflow:hidden;transition:max-height .35s cubic-bezier(.22,1,.36,1),padding .35s}
.faq-a.open{max-height:400px;padding-bottom:20px}
.faq-a p{font-size:.88rem;color:var(--textMuted);line-height:1.7}

.stil-modern .faq-toggle{background:color-mix(in srgb,var(--accent) 8%,#fff);color:var(--accent)}
.stil-modern .faq-q{font-size:1rem}

.stil-elegant .faq-q{font-weight:500;font-size:.92rem}
.stil-elegant .faq-toggle{background:transparent;border:1px solid var(--sep)}
.stil-elegant .faq-a p{font-size:.85rem;line-height:1.8}

@media(min-width:900px){.faq-layout{grid-template-columns:280px 1fr;gap:64px}}

/* ═══════════════════════════════════════════════════════
   KONTAKT
   ═══════════════════════════════════════════════════════ */
.kontakt{padding:var(--sectionY) 0}
.kontakt-head{margin-bottom:40px}
.kontakt-grid{display:grid;gap:40px}
.kontakt h2{font-size:clamp(1.5rem,3vw,2.1rem);font-weight:800;color:var(--primary);letter-spacing:-.03em;margin-bottom:28px}
.kontakt-item{margin-bottom:20px}
.kontakt-item-label{font-size:.65rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--textMuted);margin-bottom:5px}
.kontakt-item-value{font-size:1rem;font-weight:500}
.kontakt-tel{font-size:1.2rem;font-weight:800;color:var(--primary);text-decoration:none;display:inline-block;margin:4px 0;transition:color .2s}
.kontakt-tel:hover{color:var(--accent)}
.kontakt-email{color:var(--primary);text-decoration:none;font-weight:600;transition:color .2s}
.kontakt-email:hover{color:var(--accent)}
.kontakt-social{display:flex;gap:10px;margin-top:12px}
.kontakt-social a{display:flex;align-items:center;justify-content:center;width:44px;height:44px;border-radius:var(--r);border:1px solid var(--sep);color:var(--primary);text-decoration:none;transition:all .2s cubic-bezier(.22,1,.36,1)}
.kontakt-social a:hover{background:var(--primary);color:#fff;border-color:var(--primary);transform:translateY(-2px);box-shadow:0 4px 12px rgba(0,0,0,.1)}

/* Kontakt Map */
.kontakt-map{border-radius:var(--rLg);overflow:hidden;min-height:280px;background:var(--sep)}
.kontakt-map iframe{width:100%;height:100%;min-height:280px;border:none;display:block}

/* Kontakt — Modern */
.stil-modern .kontakt h2{font-size:clamp(1.5rem,3vw,2.2rem)}
.stil-modern .kontakt-item-value{font-size:.9rem}
.stil-modern .kontakt-tel{color:var(--accent)}
.stil-modern .kontakt-tel:hover{opacity:.7}
.stil-modern .kontakt-social a{width:44px;height:44px;border-radius:50%;border:none;background:color-mix(in srgb,var(--accent) 8%,#fff);color:var(--accent)}
.stil-modern .kontakt-social a:hover{background:var(--accent);color:#fff;transform:translateY(-2px)}
.stil-modern .kontakt-map{border-radius:16px}

/* Kontakt — Elegant */
.stil-elegant .kontakt h2{font-size:clamp(1.4rem,3vw,2rem);font-weight:500;letter-spacing:-.02em}
.stil-elegant .kontakt-item-label{font-size:.62rem;font-weight:500;letter-spacing:.12em}
.stil-elegant .kontakt-item-value{font-size:.88rem;font-weight:400}
.stil-elegant .kontakt-tel{font-size:1.1rem;font-weight:600}
.stil-elegant .kontakt-email{font-weight:500}
.stil-elegant .kontakt-social a:hover{transform:none;box-shadow:none}

@media(min-width:900px){.kontakt-grid{grid-template-columns:1fr 1.2fr;gap:40px;align-items:stretch}}

/* ═══════════════════════════════════════════════════════
   KONTAKT INFOS (Features-Grid)
   ═══════════════════════════════════════════════════════ */
.kontakt-infos{margin-top:32px;padding-top:28px;border-top:1px solid var(--sep);display:grid;grid-template-columns:repeat(3,1fr);gap:14px 20px}
.kontakt-info-item{display:flex;align-items:flex-start;gap:10px;font-size:.85rem;color:var(--text);line-height:1.5}
.kontakt-info-icon{width:32px;height:32px;border-radius:var(--rLg);background:color-mix(in srgb,var(--accent) 8%,#fff);display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:2px}
.kontakt-info-icon svg{color:var(--accent)}

.stil-modern .kontakt-info-icon{border-radius:50%}
.stil-elegant .kontakt-info-item{font-size:.82rem}
.stil-elegant .kontakt-info-icon{background:color-mix(in srgb,var(--accent) 6%,#fff)}
.stil-elegant .kontakt-info-icon svg{opacity:.7}

@media(max-width:768px){.kontakt-infos{grid-template-columns:1fr 1fr}}
@media(max-width:480px){.kontakt-infos{grid-template-columns:1fr}}

/* ═══════════════════════════════════════════════════════
   KONTAKT FORM
   ═══════════════════════════════════════════════════════ */
.kontakt-form-wrap{margin-top:32px;padding-top:32px;border-top:1px solid var(--sep)}.kontakt-form-wrap:empty{display:none}
.k-form h3{font-size:1rem;font-weight:800;color:var(--primary);margin-bottom:20px}
.k-form label{display:block;font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--textMuted);margin-bottom:6px}
.k-form input,.k-form textarea,.k-form select{width:100%;padding:13px 16px;border:1.5px solid var(--sep);border-radius:var(--r);font-size:.9rem;font-family:var(--font);background:#fff;color:var(--text);outline:none;transition:border-color .2s,box-shadow .2s;box-sizing:border-box;min-height:44px}
.k-form input:focus,.k-form textarea:focus{border-color:var(--accent);box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 12%,transparent)}
.k-form input:user-invalid,.k-form textarea:user-invalid{border-color:#dc2626;background:#fef2f2}
.k-form textarea{resize:vertical;min-height:120px}
.k-form select{min-height:44px}
.k-form-row{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:12px}
.k-form-row-2{grid-template-columns:1fr 1fr}
.k-form-field{margin-bottom:12px}
.k-form button{background:var(--accent);color:#fff;border:none;padding:13px 32px;border-radius:var(--r);font-size:.88rem;font-weight:700;cursor:pointer;font-family:var(--font);min-height:48px;transition:all .2s;display:inline-flex;align-items:center;justify-content:center;gap:8px;position:relative}
.k-form button:hover{opacity:.85}
.k-form button:disabled{opacity:.7;cursor:wait}
.k-form button .kf-spinner{display:none;width:16px;height:16px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:kf-spin .7s linear infinite}
.k-form button.loading .kf-spinner{display:inline-block}
.k-form button.loading .kf-label{opacity:.7}
@keyframes kf-spin{to{transform:rotate(360deg)}}
#sr-form-wrap{transition:opacity .3s ease}
#sr-form-wrap.fading{opacity:0;pointer-events:none}
.k-form-ok{display:none;text-align:center;padding:40px 20px;opacity:0;transform:translateY(8px);transition:opacity .4s ease,transform .4s ease}
.k-form-ok.visible{display:block;opacity:1;transform:translateY(0)}
.k-form-ok h4{font-size:1.1rem;font-weight:800;color:var(--primary);margin:12px 0 6px}
.k-form-ok p{color:var(--textMuted);font-size:.88rem}
.k-form-check{width:56px;height:56px;border-radius:50%;background:#16a34a;color:#fff;display:flex;align-items:center;justify-content:center;margin:0 auto;animation:kf-check .45s cubic-bezier(.22,1,.36,1) .1s backwards}
.k-form-check svg{width:28px;height:28px;stroke-dasharray:30;stroke-dashoffset:30;animation:kf-draw .4s cubic-bezier(.22,1,.36,1) .3s forwards}
@keyframes kf-check{from{transform:scale(.5);opacity:0}to{transform:scale(1);opacity:1}}
@keyframes kf-draw{to{stroke-dashoffset:0}}

/* Form — Modern */
.stil-modern .k-form input,.stil-modern .k-form textarea{padding:12px 16px;border-width:2px;border-radius:12px}
.stil-modern .k-form button{border-radius:100px;padding:14px 36px;box-shadow:0 4px 16px color-mix(in srgb,var(--accent) 25%,transparent)}
.stil-modern .k-form button:hover{opacity:.9;transform:translateY(-1px);box-shadow:0 6px 20px color-mix(in srgb,var(--accent) 35%,transparent)}

/* Form — Elegant */
.stil-elegant .k-form h3{font-size:.92rem;font-weight:600;letter-spacing:-.01em}
.stil-elegant .k-form label{font-size:.62rem;font-weight:500;letter-spacing:.12em}
.stil-elegant .k-form input,.stil-elegant .k-form textarea{border-width:1px;font-size:.85rem}
.stil-elegant .k-form button{background:var(--primary);font-size:.85rem;font-weight:500;letter-spacing:.02em}
.stil-elegant .k-form button:hover{opacity:.82}
.stil-elegant .k-form-ok h4{font-size:1rem;font-weight:600}
.stil-elegant .k-form-ok p{font-size:.85rem}

@media(max-width:640px){.k-form-row,.k-form-row-2{grid-template-columns:1fr}}

/* ═══════════════════════════════════════════════════════
   TERMIN CTA
   ═══════════════════════════════════════════════════════ */
.termin-cta{padding:80px 0;background:var(--primary);color:#fff;text-align:center}
.termin-cta h2{font-size:clamp(1.3rem,3vw,1.8rem);font-weight:800;margin-bottom:10px;color:#fff}
.termin-cta p{font-size:.9rem;opacity:.5;margin-bottom:28px}
.termin-cta .btn-accent{background:#fff;color:var(--primary)}
.termin-cta .btn-accent:hover{opacity:.9}

.stil-modern .termin-cta{background:var(--accent)}
.stil-modern .termin-cta p{opacity:.7}
.stil-modern .termin-cta .btn-accent{color:var(--accent)}

.stil-elegant .termin-cta h2{font-size:clamp(1.2rem,3vw,1.6rem);font-weight:500;letter-spacing:-.01em}
.stil-elegant .termin-cta p{opacity:.4;font-size:.85rem}

/* ═══════════════════════════════════════════════════════
   SECTIONS (Fakten, Partner)
   ═══════════════════════════════════════════════════════ */
.sec-faq{padding:var(--sectionY) 0;background:#fff}
.sec-galerie{padding:var(--sectionY) 0;background:var(--bg)}
.sec-fakten{padding:64px 0;background:var(--bg)}
.sec-partner{padding:48px 0;background:#fff;border-top:1px solid var(--sep)}
.sec-cta-block{padding:64px 0;text-align:center}
@media(min-width:900px){.sec-faq{padding:var(--sectionY) 0}.sec-galerie{padding:var(--sectionY) 0}.sec-fakten{padding:80px 0}.sec-cta-block{padding:80px 0}}

.stil-modern .sec-cta-block .btn{border-radius:100px;box-shadow:0 4px 16px color-mix(in srgb,var(--accent) 30%,transparent)}
.stil-modern .sec-cta-block .btn:hover{transform:translateY(-1px)}
.stil-modern .sec-partner{border-top:none}

/* ═══════════════════════════════════════════════════════
   LIGHTBOX
   ═══════════════════════════════════════════════════════ */
.lb{display:none;position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.9);align-items:center;justify-content:center;cursor:zoom-out}
.lb.open{display:flex}
.lb img{max-width:90vw;max-height:90vh;object-fit:contain;border-radius:var(--rLg)}
.lb-x{position:absolute;top:20px;right:24px;background:none;border:none;color:#fff;font-size:2rem;cursor:pointer;opacity:.6;transition:opacity .2s;z-index:2}
.lb-x:hover{opacity:1}
.lb-prev,.lb-next{position:absolute;top:50%;transform:translateY(-50%);background:rgba(255,255,255,.15);border:none;color:#fff;font-size:2.5rem;cursor:pointer;opacity:.6;transition:opacity .2s;width:48px;height:48px;border-radius:50%;display:flex;align-items:center;justify-content:center;z-index:2;backdrop-filter:blur(4px)}
.lb-prev{left:16px}.lb-next{right:16px}
.lb-prev:hover,.lb-next:hover{opacity:1;background:rgba(255,255,255,.25)}
.stil-elegant .lb{background:rgba(0,0,0,.92)}

/* ═══════════════════════════════════════════════════════
   CUSTOM STIL
   ═══════════════════════════════════════════════════════ */
.stil-custom .btn-accent:hover{box-shadow:0 6px 20px color-mix(in srgb,var(--accent) 25%,transparent)}
.stil-custom .kontakt-social a:hover{box-shadow:0 4px 12px color-mix(in srgb,var(--primary) 15%,transparent)}

/* ═══════════════════════════════════════════════════════
   RESPONSIVE
   ═══════════════════════════════════════════════════════ */
@media(min-width:900px){
.leist,.ablauf,.bew,.faq,.team,.galerie,.kontakt,.ueber{padding:var(--sectionY) 0}
.stil-modern .leist,.stil-modern .ablauf,.stil-modern .bew,.stil-modern .faq,.stil-modern .team,.stil-modern .galerie,.stil-modern .kontakt,.stil-modern .ueber{padding:128px 0}
.stil-elegant .leist,.stil-elegant .ablauf,.stil-elegant .bew,.stil-elegant .faq,.stil-elegant .team,.stil-elegant .galerie,.stil-elegant .kontakt,.stil-elegant .ueber{padding:140px 0}
}

@media(max-width:768px){
/* Hero — auf Mobile */
.hero{min-height:78svh;align-items:center}
.hero-inner{padding:52px 24px 44px}
.hero h1{font-size:clamp(2.1rem,9vw,2.8rem);letter-spacing:-.03em;margin-bottom:14px}
.hero-sub{display:block;background:transparent!important;border:none!important;border-radius:0!important;padding:0!important;font-size:.7rem;font-weight:700;letter-spacing:.1em;color:rgba(255,255,255,.55);margin-bottom:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.hero-sub .hero-loc{display:none}
.hero-desc{font-size:.88rem;margin-bottom:28px;max-width:100%;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
.hero-btns{flex-direction:column;gap:10px}
.hero-btns .btn{width:100%;text-align:center}
.stil-modern .hero-inner{padding:40px 24px 40px}
.stil-modern .hero h1{font-size:clamp(2.4rem,10vw,3.6rem)}
.stil-elegant .hero-inner{padding:40px 24px 44px}
.stil-elegant .hero h1{font-size:clamp(2.2rem,9vw,3.2rem)}
.hero-trust-bar{margin-top:24px;padding-top:20px}
.hero-trust-inner{gap:10px 20px}
.t-item{font-size:.76rem}
/* Section-Abstände auf Mobile deutlich reduzieren */
.leist,.ablauf,.bew,.faq,.team,.galerie,.kontakt,.ueber,.sec-faq,.sec-galerie{padding:56px 0!important}
.stil-modern .leist,.stil-modern .ablauf,.stil-modern .bew,.stil-modern .faq,.stil-modern .team,.stil-modern .galerie,.stil-modern .kontakt,.stil-modern .ueber{padding:64px 0!important}
.stil-elegant .leist,.stil-elegant .ablauf,.stil-elegant .bew,.stil-elegant .faq,.stil-elegant .team,.stil-elegant .galerie,.stil-elegant .kontakt,.stil-elegant .ueber{padding:64px 0!important}
.sec-fakten{padding:44px 0!important}
.sec-partner{padding:32px 0!important}
.sec-cta-block{padding:48px 0!important}
/* Sektions-Überschriften */
.leist-head,.ablauf-head,.bew-head,.team-head,.galerie-head,.faq-head,.kontakt-head{margin-bottom:28px}
}

@media(max-width:480px){
.team-grid{grid-template-columns:1fr!important}
.galerie-grid{grid-template-columns:1fr 1fr!important}
.ueber-stats{grid-template-columns:1fr 1fr!important}
}

/* ═══════════════════════════════════════════════════════
   PRINT
   ═══════════════════════════════════════════════════════ */
@media print{
#sitenav,.hbg,.mob-menu,.sr-sticky-cta,.lb,.kontakt-form-wrap,.termin-cta,.sr-skip,.hero-trust-bar,.trust{display:none!important}
.hero{min-height:auto!important;padding:32px 0!important;print-color-adjust:exact;-webkit-print-color-adjust:exact}
.hero-inner{padding:24px 0!important}
body{font-size:11pt;line-height:1.6}
.w{max-width:100%;padding:0}
.leist,.ueber,.kontakt,.bew,.faq,.ablauf,.team,.galerie,.sec-faq,.sec-galerie,.sec-fakten,.sec-partner{padding:24px 0!important}
.ueber{color:#000!important;background:#f5f5f5!important;print-color-adjust:exact}
.sr-grain::after{display:none!important}
.btn{border:1px solid #333!important;background:transparent!important;color:#333!important;box-shadow:none!important}
a{text-decoration:underline}
.kontakt-tel,.kontakt-email{color:#000!important}
footer{padding:16px 0!important}
.ft-grid{gap:16px!important}
}
</style>
`;
}

export function buildTemplate(data) {
  const {
    firmenname, brancheLabel, einsatzgebiet, kurzbeschreibung,
    heroHeadline,
    ctaPrimary, ctaPrimaryHref, ctaSecondary,
    leistungenIntro, preislisteHtml,
    ueberUnsText, vorteileHtml, oeffnungszeiten,
    adresseVoll, telDisplay, telHref, email,
    socialHtml, buchungslinkHtml,
    metaTitle, metaDesc, siteUrl, fontUrl, fontFamily,
    primary, accent, bg, sep,
    kontaktCtaHeadline, kontaktCtaText,
    borderRadius, borderRadiusLg,
    stil,
  } = data;

  // Hero-H1: wenn heroHeadline vorhanden -> Wertversprechen, Firmenname klein als Sub
  // sonst Firmenname (Fallback fuer alte Orders + wenn kein Headline generiert)
  const heroH1 = heroHeadline && heroHeadline.trim() ? heroHeadline.trim() : firmenname;
  const showFirmenSub = !!(heroHeadline && heroHeadline.trim());

  const stilClass = `stil-${stil || "klassisch"}`;

  return `<!DOCTYPE html>
<html lang="de-AT">
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
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${fontUrl}" media="print" onload="this.media='all'">
<noscript><link rel="stylesheet" href="${fontUrl}"></noscript>
<title>${metaTitle}</title>
${buildCss(data)}
</head>
<body class="${stilClass}">
<a href="#leistungen" class="sr-skip">Zum Inhalt springen</a>
<!-- NAV -->

<main id="main">
<section class="hero sr-grain" id="sr-hero">
<div class="hero-inner">
<p class="hero-sub">${showFirmenSub ? `<strong style="color:inherit;font-weight:700">${firmenname}</strong> · ` : ""}${brancheLabel}${einsatzgebiet ? ` · <span class="hero-loc"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" style="vertical-align:-1px;opacity:.7"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>${einsatzgebiet}</span>` : ""}</p>
<h1>${heroH1}</h1>
<span class="hero-accent-line"></span>
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
<div class="leist-head fade-up">
<div class="leist-label">Leistungen</div>
<h2>Was wir für Sie tun</h2>
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
<div class="fade-up">
<div class="sec-label">Über uns</div>
<h2>Über ${firmenname}</h2>
<p class="ueber-text">{{UEBER_UNS_TEXT}}</p>
<ul class="ueber-vorteile">{{VORTEILE}}</ul>
</div>
<!-- ABOUT_FOTOS -->
</div>
<!-- TEAM -->
</div>
</section>

<!-- FAKTEN -->

<!-- GALERIE -->

<!-- PARTNER -->

<!-- BEWERTUNGEN -->

<!-- FAQ -->

<section class="kontakt" id="kontakt">
<div class="w">
<div class="kontakt-grid">
<div class="fade-up">
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
<div class="kontakt-item-label">Öffnungszeiten</div>
<div class="kontakt-item-value">{{OEFFNUNGSZEITEN}}</div>
</div>
${socialHtml}
</div>
<div class="fade-up"><!-- MAPS --></div>
</div>
<!-- KONTAKT_INFOS -->
<div class="kontakt-form-wrap">
<!-- KONTAKT_FORM -->
</div>
</div>
</section>

${buchungslinkHtml}

</main>

<!-- FOOTER -->

<div class="lb" id="sr-lb" role="dialog" aria-modal="true" aria-label="Bild vergrößert" onclick="if(event.target===this)this.classList.remove('open')"><button class="lb-prev" aria-label="Vorheriges Bild" onclick="event.stopPropagation();window._lbNav(-1)">&#8249;</button><img id="sr-lb-img" src="" alt=""/><button class="lb-next" aria-label="Nächstes Bild" onclick="event.stopPropagation();window._lbNav(1)">&#8250;</button><button class="lb-x" aria-label="Schließen" onclick="event.stopPropagation();document.getElementById('sr-lb').classList.remove('open')">×</button></div>
<script>(function(){
/* Scroll-Animationen: fade-up + sr-fade */
var f=new IntersectionObserver(function(e){e.forEach(function(i){if(i.isIntersecting){i.target.classList.add('visible','sr-vis');f.unobserve(i.target)}})},{threshold:.06,rootMargin:'0px 0px -40px 0px'});
document.querySelectorAll('.fade-up,.sr-fade').forEach(function(el){f.observe(el)});

/* Section-Einblendung */
var o=new IntersectionObserver(function(e){e.forEach(function(i){if(i.isIntersecting){i.target.classList.add('sr-a');o.unobserve(i.target)}})},{threshold:.12});
document.querySelectorAll('.leist,.ueber,.kontakt,.termin-cta,.bew,.faq,.ablauf,.team,.galerie,.sec-faq,.sec-galerie,.sec-fakten,.sec-partner,.sec-cta-block,.cta-block').forEach(function(s){o.observe(s)});

/* Staggered Delays fuer Grid-Kinder */
document.querySelectorAll('.ueber-grid,.kontakt-grid').forEach(function(p){
var ch=p.children;for(var j=0;j<ch.length;j++){ch[j].style.transitionDelay=j*100+'ms';if(!ch[j].classList.contains('fade-up')&&!ch[j].classList.contains('sr-fade')){ch[j].classList.add('fade-up');f.observe(ch[j])}}
});

/* FAQ Toggle */
document.addEventListener('click',function(e){
var btn=e.target.closest('.faq-q');
if(!btn)return;
var a=btn.nextElementSibling;
if(!a)return;
var open=a.classList.contains('open');
/* Alle schliessen */
document.querySelectorAll('.faq-a.open').forEach(function(el){el.classList.remove('open')});
document.querySelectorAll('.faq-toggle').forEach(function(el){el.textContent='+'});
if(!open){a.classList.add('open');var t=btn.querySelector('.faq-toggle');if(t)t.textContent='\\u2212'}
});

/* Lightbox mit Navigation + Focus-Trap */
var _lbImgs=[],_lbIdx=0,_lbPrevFocus=null;
window._lbNav=function(dir){if(_lbImgs.length<2)return;_lbIdx=(_lbIdx+dir+_lbImgs.length)%_lbImgs.length;document.getElementById('sr-lb-img').src=_lbImgs[_lbIdx].src;};
function _lbClose(){var lb=document.getElementById('sr-lb');lb.classList.remove('open');document.body.style.overflow='';if(_lbPrevFocus&&_lbPrevFocus.focus){try{_lbPrevFocus.focus();}catch(_){}}}
function _lbFocusables(lb){return Array.from(lb.querySelectorAll('button:not([style*="display:none"]):not([style*="display: none"])')).filter(function(b){return b.offsetParent!==null;});}
document.addEventListener('click',function(e){var img=e.target.closest('.sr-zoom');if(img){_lbImgs=Array.from(document.querySelectorAll('.sr-zoom'));_lbIdx=_lbImgs.indexOf(img);var lb=document.getElementById('sr-lb');document.getElementById('sr-lb-img').src=img.src;_lbPrevFocus=document.activeElement;lb.classList.add('open');document.body.style.overflow='hidden';var has=_lbImgs.length>1;lb.querySelector('.lb-prev').style.display=has?'':'none';lb.querySelector('.lb-next').style.display=has?'':'none';setTimeout(function(){var x=lb.querySelector('.lb-x');if(x)x.focus();},50);}});
/* Close-Overlay ersetzen: lb-click schließt via _lbClose um Focus wiederherzustellen */
(function(){var lb=document.getElementById('sr-lb');if(!lb)return;lb.onclick=function(e){if(e.target===lb)_lbClose();};var x=lb.querySelector('.lb-x');if(x)x.onclick=function(e){e.stopPropagation();_lbClose();};})();
document.addEventListener('keydown',function(e){var lb=document.getElementById('sr-lb');if(!lb.classList.contains('open'))return;if(e.key==='Escape'){e.preventDefault();_lbClose();}else if(e.key==='ArrowLeft'){window._lbNav(-1);}else if(e.key==='ArrowRight'){window._lbNav(1);}else if(e.key==='Tab'){var f=_lbFocusables(lb);if(!f.length)return;var first=f[0],last=f[f.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
/* Swipe */
(function(){var lb=document.getElementById('sr-lb'),sx=0;lb.addEventListener('touchstart',function(e){sx=e.touches[0].clientX},{passive:true});lb.addEventListener('touchend',function(e){var dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>50){window._lbNav(dx<0?1:-1)}},{passive:true})})();

/* Stats Counter Animation */
var so=new IntersectionObserver(function(e){e.forEach(function(i){if(i.isIntersecting){so.unobserve(i.target);
var els=i.target.querySelectorAll('.ueber-stat-num[data-val]');
els.forEach(function(el){var v=parseInt(el.getAttribute('data-val'))||0;var s=el.getAttribute('data-suffix')||'';
var d=1200,st=performance.now();
function tick(now){var p=Math.min((now-st)/d,1);p=1-Math.pow(1-p,3);el.textContent=Math.round(v*p)+s;if(p<1)requestAnimationFrame(tick)}
requestAnimationFrame(tick)})}})},{threshold:.3});
document.querySelectorAll('.ueber-stats').forEach(function(s){so.observe(s)});

/* Ablauf: Steps staggered Reveal */
var ablauf=document.querySelectorAll('.sr-ablauf-h');if(ablauf.length){var ioAbl=new IntersectionObserver(function(e){e.forEach(function(i){if(i.isIntersecting){i.target.classList.add('sr-ablauf-play');ioAbl.unobserve(i.target)}})},{threshold:.25});ablauf.forEach(function(el){ioAbl.observe(el)})}

/* Ueber-uns Vorteile: staggered Reveal */
var vort=document.querySelectorAll('.ueber-vorteile');if(vort.length){var ioVor=new IntersectionObserver(function(e){e.forEach(function(i){if(i.isIntersecting){i.target.classList.add('ueber-vorteile-play');ioVor.unobserve(i.target)}})},{threshold:.2});vort.forEach(function(el){ioVor.observe(el)})}

/* Hero Pageload Stagger */
requestAnimationFrame(function(){requestAnimationFrame(function(){document.body.classList.add('hero-play')})});

/* Nav-Scroll-Glass */
var navEl=document.getElementById('sitenav');if(navEl){var onScrollNav=function(){document.body.classList.toggle('nav-scrolled',window.scrollY>40)};window.addEventListener('scroll',onScrollNav,{passive:true});onScrollNav()}

})();</script>
</body>
</html>`;
}
