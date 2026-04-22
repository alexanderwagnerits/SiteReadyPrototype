/* ═══ TOKENS ═══ */ /* build:20260413 */
export const CTA = '#185FA5';
export const CTA_H = '#0C447C';
export const CTA_G = 'rgba(24,95,165,.25)';
export const CTA_L = '#E6F1FB';

export const T = {
  bg:'#F5F5F2',bg2:'#EEEEE9',bg3:'#E0E0DB',white:'#ffffff',dark:'#111111',dark2:'#2B2F36',text:'#2B2F36',textSub:'#4A4F5A',textMuted:'#505560',accent:'#8FA3B8',accentLight:'rgba(143,163,184,0.1)',accentGlow:'rgba(143,163,184,0.15)',cta:'#111111',ctaLight:'rgba(17,17,17,0.06)',green:'#16a34a',greenLight:'#f0fdf4',greenGlow:'rgba(22,163,74,0.1)',greenBright:'#4ade80',greenBorder:'#bbf7d0',red:'#dc2626',redLight:'#fef2f2',redBorder:'#fecaca',orange:'#ea580c',amber:'#f59e0b',amberLight:'#fef3c7',amberBorder:'#fde68a',amberText:'#92400e',r:'12px',rSm:'8px',rLg:'16px',rXl:'20px',font:"'DM Sans',-apple-system,sans-serif",mono:"'JetBrains Mono',monospace",sh1:'0 1px 2px rgba(0,0,0,0.04)',sh2:'0 4px 24px rgba(0,0,0,0.06)',sh3:'0 16px 48px rgba(0,0,0,0.08)',sh4:'0 24px 80px rgba(0,0,0,0.12)',
};

export const LP_FONT = "'Poppins',-apple-system,sans-serif";

export const css = `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400&family=JetBrains+Mono:wght@400;500&family=Inter:wght@400;500;600;700;800;900&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Poppins:wght@300;400;500;600;700&display=swap');*{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}body{font-family:${T.font};color:${T.text};-webkit-font-smoothing:antialiased;background:${T.bg}}::selection{background:${T.dark};color:#fff}
@keyframes fadeUp{from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
@keyframes slideDown{from{opacity:0;transform:translateY(-12px)}to{opacity:1;transform:translateY(0)}}
@keyframes mockFade{0%{opacity:0;transform:scale(.97)}10%{opacity:1;transform:scale(1)}90%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(.97)}}
.sr-reveal{opacity:0;transform:translateY(32px);transition:opacity .6s cubic-bezier(.22,1,.36,1),transform .6s cubic-bezier(.22,1,.36,1)}.sr-reveal.sr-visible{opacity:1;transform:translateY(0)}
.lp-btn-primary{transition:transform .18s,box-shadow .18s,opacity .18s!important}.lp-btn-primary:hover{transform:translateY(-2px)!important;box-shadow:0 8px 32px rgba(0,0,0,.22)!important;opacity:.93}
.lp-btn-primary:active{transform:translateY(0)!important;box-shadow:0 4px 16px rgba(0,0,0,.15)!important}
.lp-btn-cta{transition:transform .18s cubic-bezier(.22,1,.36,1),box-shadow .18s!important}.lp-btn-cta:hover{transform:translateY(-2px)!important;box-shadow:0 8px 32px rgba(24,95,165,.35)!important}.lp-btn-cta:active{transform:translateY(0)!important;box-shadow:0 4px 16px rgba(24,95,165,.2)!important}
@keyframes highlightGrow{from{transform:scaleX(0);transform-origin:left}to{transform:scaleX(1);transform-origin:left}}
.sr-reveal-d1{transition-delay:.1s}.sr-reveal-d2{transition-delay:.2s}.sr-reveal-d3{transition-delay:.3s}.sr-reveal-d4{transition-delay:.4s}
@media(prefers-reduced-motion:reduce){.sr-reveal{transition:none!important;opacity:1!important;transform:none!important}}
.sr-form-btn{transition:background .2s,transform .15s,box-shadow .15s!important}.sr-form-btn:not(:disabled):hover{transform:translateY(-1px)!important;box-shadow:0 4px 16px rgba(0,0,0,.18)!important}.sr-form-btn:not(:disabled):active{transform:translateY(0)!important}
.ad-wrap button{transition:border-color .15s,color .15s,box-shadow .15s,background .15s}.ad-wrap button:not(:disabled):hover{border-color:${T.dark}!important}.ad-wrap button:not(:disabled):active{transform:scale(.98)}
.lp-hamburger{display:none}
@media(max-width:960px){
  .lp-w{padding:0 28px!important}
  .lp-sec{padding:72px 0!important}
  .lp-hero-grid{grid-template-columns:1fr!important}
  .lp-hero-mock{display:none!important}
  .lp-hero-stats{flex-wrap:wrap}
  .lp-problem-grid{grid-template-columns:1fr!important;gap:48px!important}
  .lp-steps-line{display:none!important}
  .lp-steps-grid{grid-template-columns:repeat(2,1fr)!important;gap:32px!important}
  .lp-variants-grid{grid-template-columns:1fr!important}
  .lp-variants-grid>div{transform:none!important}
  .lp-pricing-grid{grid-template-columns:1fr!important;max-width:480px!important}
  .lp-why-grid{grid-template-columns:repeat(2,1fr)!important}
  .lp-compare{overflow-x:auto}
  .lp-nav-links{display:none!important}
  .lp-testi-grid{grid-template-columns:1fr!important}
  .lp-faq-grid{grid-template-columns:1fr!important}
  .lp-faq-sticky{position:static!important}
  .lp-cta-inner{grid-template-columns:1fr!important;text-align:center}
  .lp-cta-stats{flex-direction:row!important;justify-content:center!important;gap:32px!important}
  .lp-footer-cols{gap:32px!important}
  .lp-hamburger{display:flex!important;align-items:center;justify-content:center;width:44px;height:44px;border:none;background:transparent;cursor:pointer;border-radius:8px;padding:0;flex-shrink:0}
  .lp-mob-menu{display:block!important}
}
@media(max-width:560px){
  .lp-w{padding:0 16px!important}
  .lp-sec{padding:56px 0!important}
  .lp-steps-grid{grid-template-columns:1fr!important}
  .lp-why-grid{grid-template-columns:1fr!important}
  .lp-hero-btns{flex-direction:column!important}
  .lp-hero-btns a,.lp-hero-btns button{width:100%!important;text-align:center!important;justify-content:center!important}
  .lp-hero-stats{display:inline-flex!important;gap:8px!important}
  .lp-hero-stats>span{padding:6px 12px!important;font-size:.72rem!important}
  .lp-trust-bar{gap:16px!important}
  .lp-trust-bar>div{font-size:.78rem!important}
  .lp-pricing-grid{max-width:100%!important}
  .lp-pricing-grid>div{padding:28px 20px!important}
  .lp-footer-top{flex-direction:column!important;align-items:center!important;text-align:center!important}
  .lp-footer-brand{max-width:100%!important;display:flex!important;flex-direction:column!important;align-items:center!important}
  .lp-footer-flex{flex-direction:column!important;gap:16px!important;text-align:center!important;align-items:center!important}
  .lp-footer-cols{flex-direction:column!important;gap:32px!important;text-align:center!important;align-items:center!important}
  .lp-footer-cols>div{gap:8px!important;align-items:center!important;display:flex!important;flex-direction:column!important}
  .lp-footer-cols a,.lp-footer-cols span{text-align:center!important}
  .lp-cta-section{padding:56px 0!important}
  .lp-cta-stats{flex-direction:column!important;gap:16px!important}
  .lp-cta-stats>div{justify-content:center!important}
  .lp-cta-inner h2{font-size:clamp(1.6rem,6vw,2.2rem)!important}
  .lp-compare table th:nth-child(n+4),.lp-compare table td:nth-child(n+4){display:none!important}
  .lp-compare table{font-size:.8rem!important}
  .lp-compare table th,.lp-compare table td{padding:10px 12px!important}
  .lp-compare{position:relative}
  footer{padding:48px 0 32px!important}
  .pt-topbar{padding:0 16px!important}
  .pt-email{display:none!important}
  .pt-sub-bar{padding-bottom:8px!important}
}
@media(max-width:960px){
  .sp-topbar{padding:0 20px!important}
  .sp-content{padding:24px 20px!important}
  .sp-header{flex-direction:column!important;align-items:flex-start!important;gap:14px!important}
  .sp-grid{grid-template-columns:1fr!important}
  .sp-page{height:auto!important;overflow:auto!important;min-height:100vh}
}
@media(max-width:560px){
  .sp-content{padding:16px!important}
  .sp-card{padding:20px 16px!important}
  .sp-name-grid{grid-template-columns:1fr!important}
  .sp-price-row{flex-direction:column!important;align-items:stretch!important}
  .sp-price-row button{width:100%!important}
}
.ad-mob-topbar{display:none}
.ad-mob-overlay{display:none}
.ad-kpi-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
@media(max-width:960px){
  .ad-wrap{flex-direction:column!important;height:auto!important;min-height:100vh!important}
  .ad-sidebar{position:fixed!important;left:0;top:0;bottom:0;z-index:100;transform:translateX(-100%);transition:transform .25s ease;width:260px!important;height:100vh!important}
  .ad-sidebar.ad-sidebar-open{transform:translateX(0)}
  .ad-mob-topbar{display:flex!important;position:sticky;top:0;z-index:50;background:${T.dark};padding:10px 14px;align-items:center;gap:12px;border-bottom:1px solid rgba(255,255,255,.07)}
  .ad-mob-overlay{display:block;position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:99;opacity:0;pointer-events:none;transition:opacity .2s}
  .ad-mob-overlay.ad-mob-overlay-open{opacity:1;pointer-events:auto}
  .ad-main{padding:16px!important}
  .ad-kpi-grid{grid-template-columns:repeat(2,1fr)!important}
  .ad-filter-bar{flex-direction:column!important;align-items:stretch!important;gap:8px!important}
  .ad-filter-bar>h2{margin-right:0!important;margin-bottom:4px!important}
  .ad-filter-bar select,.ad-filter-bar input{width:100%!important}
  .ad-filter-bar>div{width:100%!important}
  .ad-table-wrap{overflow-x:auto!important;-webkit-overflow-scrolling:touch}
  .ad-table-wrap table{min-width:640px}
  .sp-incl-grid{grid-template-columns:1fr!important}
  .sp-name-grid{grid-template-columns:1fr!important}
}
@media(max-width:560px){
  .ad-kpi-grid{grid-template-columns:1fr!important}
}
@media(max-width:767px){
  .pt-info-row{grid-template-columns:120px 1fr!important}
  .pt-about-grid{grid-template-columns:repeat(3,1fr)!important}
  .pt-upload-hdr{flex-direction:column!important;align-items:stretch!important;gap:10px!important}
  .pt-upload-hdr>div:last-child{justify-content:flex-start!important}
  .pt-card{padding:18px 16px!important}
  .pt-color-grid{grid-template-columns:1fr 1fr!important}
  .pt-layout-grid{grid-template-columns:1fr!important}
  .pt-font-grid{grid-template-columns:1fr!important}
  .pt-impres-grid{grid-template-columns:1fr!important}
  .pt-save-bar{flex-direction:column!important;gap:10px!important;text-align:center!important}
  .pt-save-bar>div:last-child{width:100%!important;justify-content:center!important}
  .pt-rechnung-item{flex-wrap:wrap!important;gap:10px!important}
  .pt-rechnung-item>div:first-child{width:100%!important}
}
@media(max-width:560px){
  .pt-info-row{grid-template-columns:1fr!important}
  .pt-field-grid{grid-template-columns:1fr!important}
  .pt-tab-nav{width:100%!important;overflow-x:auto!important}
  .pt-addr-grid{grid-template-columns:1fr!important}
  .pt-photo-grid{grid-template-columns:repeat(3,1fr)!important}
  .pt-variant-row{flex-direction:column!important}
  .pt-variant-row>button{width:100%!important}
  .pt-about-grid{grid-template-columns:repeat(2,1fr)!important}
  .pt-fakten-grid{grid-template-columns:1fr!important}
  .pt-color-grid{grid-template-columns:1fr!important}
  .pt-logo-preview{grid-template-columns:1fr!important}
  .pt-toast{left:16px!important;right:16px!important;bottom:16px!important;justify-content:center!important}
  .pt-faq-row{grid-template-columns:1fr!important}
  .pt-faq-row>button{position:absolute!important;top:8px!important;right:8px!important}
  .pt-faq-row{position:relative!important}
}`;

export const pCss = `
.pt-layout{display:flex;height:100vh;height:100dvh;overflow:hidden}
.pt-sb{width:236px;background:#111111;display:flex;flex-direction:column;flex-shrink:0;overflow:hidden}
.pt-sb-top{padding:22px 18px 18px;border-bottom:1px solid rgba(255,255,255,.07)}
.pt-sb-brand{display:flex;align-items:center;gap:10px;margin-bottom:18px}
.pt-sb-logo{height:24px;filter:brightness(0) invert(1);opacity:.88}
.pt-sb-site{display:flex;align-items:center;gap:9px;padding:9px 12px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);border-radius:8px}
.pt-sb-dot{width:7px;height:7px;border-radius:50%;background:${T.greenBright};flex-shrink:0;animation:sb-blink 2.5s ease-in-out infinite}
@keyframes sb-blink{0%,100%{opacity:1}50%{opacity:.45}}
.pt-sb-url{font-size:.78rem;font-weight:600;color:rgba(255,255,255,.5);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pt-sb-nav{padding:12px 10px;flex:1;overflow-y:auto;scrollbar-width:none}
.pt-sb-nav::-webkit-scrollbar{display:none}
.pt-sb-grp{font-size:.64rem;font-weight:700;letter-spacing:.09em;text-transform:uppercase;color:rgba(255,255,255,.2);padding:14px 8px 5px}
.pt-sb-grp:first-child{padding-top:4px}
.pt-ni{display:flex;align-items:center;gap:9px;padding:9px 10px;border-radius:8px;cursor:pointer;color:rgba(255,255,255,.45);font-size:.91rem;font-weight:500;transition:all .12s;user-select:none;background:transparent;border:none;width:100%;font-family:inherit;text-align:left}
.pt-ni:hover{background:rgba(255,255,255,.06);color:rgba(255,255,255,.8)}
.pt-ni.active{background:rgba(255,255,255,.09);color:#fff;font-weight:600}
.pt-ni svg{flex-shrink:0;opacity:.5;transition:opacity .12s}
.pt-ni.active svg,.pt-ni:hover svg{opacity:.85}
.pt-ni-ch{margin-left:auto;font-size:.7rem;color:rgba(255,255,255,.22);transition:transform .18s;line-height:1}
.pt-ni.open .pt-ni-ch{transform:rotate(90deg)}
.pt-sub{overflow:hidden;max-height:0;transition:max-height .25s ease}
.pt-sub.open{max-height:400px}
.pt-si{display:flex;align-items:center;gap:8px;padding:7px 10px 7px 32px;border-radius:8px;cursor:pointer;color:rgba(255,255,255,.32);font-size:.86rem;font-weight:500;transition:all .12s;background:transparent;border:none;width:100%;font-family:inherit;text-align:left}
.pt-si::before{content:'';width:3px;height:3px;border-radius:50%;background:currentColor;flex-shrink:0;opacity:.7}
.pt-si:hover{background:rgba(255,255,255,.05);color:rgba(255,255,255,.68)}
.pt-si.active{color:rgba(255,255,255,.9);font-weight:600}
.pt-sb-foot{padding:12px 10px 14px;border-top:1px solid rgba(255,255,255,.07)}
.pt-sb-user{display:flex;align-items:center;gap:9px;padding:8px 10px;border-radius:8px;cursor:pointer;transition:background .12s;background:transparent;border:none;width:100%;font-family:inherit}
.pt-sb-user:hover{background:rgba(255,255,255,.05)}
.pt-sb-av{width:30px;height:30px;border-radius:50%;background:rgba(255,255,255,.1);border:1.5px solid rgba(255,255,255,.12);display:flex;align-items:center;justify-content:center;font-size:.68rem;font-weight:800;color:rgba(255,255,255,.72);flex-shrink:0}
.pt-sb-email{font-size:.8rem;color:rgba(255,255,255,.45);flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-align:left}
.pt-sb-out{color:rgba(255,255,255,.22);flex-shrink:0;transition:color .12s}
.pt-sb-user:hover .pt-sb-out{color:rgba(255,255,255,.55)}
.pt-main{flex:1;display:flex;flex-direction:column;overflow:hidden;background:#F5F5F2}
.pt-mh{padding:28px 36px 0;flex-shrink:0}
.pt-bc{font-size:.84rem;color:#505560;margin-bottom:7px;display:flex;align-items:center;gap:5px}
.pt-bc b{color:#4A4F5A}
.pt-mh-title{font-size:1.35rem;font-weight:800;color:#111111;letter-spacing:-.025em;line-height:1.2}
.pt-mh-sub{font-size:.9rem;color:#505560;margin-top:3px}
.pt-mh-line{height:1px;background:#E0E0DB;margin:20px 36px 0;flex-shrink:0}
.pt-mb{padding:20px 36px 32px;flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:16px}
.pt-hero{background:#111111;border-radius:12px;padding:24px 28px;position:relative;overflow:hidden}
.pt-hero::after{content:'';position:absolute;top:-50px;right:-50px;width:180px;height:180px;border-radius:50%;background:radial-gradient(circle,rgba(143,163,184,.14) 0%,transparent 65%);pointer-events:none}
.pt-hero-live{display:inline-flex;align-items:center;gap:6px;font-size:.7rem;font-weight:700;letter-spacing:.03em;color:${T.greenBright};background:rgba(74,222,128,.08);border:1px solid rgba(74,222,128,.14);border-radius:100px;padding:4px 11px;margin-bottom:12px}
.pt-hero-live-dot{width:5px;height:5px;border-radius:50%;background:${T.greenBright};animation:sb-blink 2.5s ease-in-out infinite}
.pt-hero-url{font-size:1.05rem;font-weight:700;color:#fff;letter-spacing:-.01em;margin-bottom:2px}
.pt-hero-url em{color:rgba(255,255,255,.22);font-style:normal}
.pt-hero-hint{font-size:.78rem;color:rgba(255,255,255,.32);margin-bottom:18px}
.pt-hero-btns{display:flex;gap:8px;flex-wrap:wrap}
.pt-btn-w{display:inline-flex;align-items:center;gap:6px;padding:9px 17px;background:#111;color:#fff;border:none;border-radius:8px;font-size:.82rem;font-weight:700;cursor:pointer;font-family:inherit;transition:opacity .12s;letter-spacing:-.01em}
.pt-btn-w:hover{opacity:.88}
.pt-btn-gw{display:inline-flex;align-items:center;gap:6px;padding:9px 17px;background:rgba(255,255,255,.07);color:rgba(255,255,255,.58);border:1px solid rgba(255,255,255,.09);border-radius:8px;font-size:.82rem;font-weight:600;cursor:pointer;font-family:inherit;transition:all .12s}
.pt-btn-gw:hover{background:rgba(255,255,255,.12);color:rgba(255,255,255,.88)}
`;
