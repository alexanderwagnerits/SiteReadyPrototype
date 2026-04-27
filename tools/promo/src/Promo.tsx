import React from 'react';
import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {loadFont as loadDM} from '@remotion/google-fonts/DMSans';
import {loadFont as loadJB} from '@remotion/google-fonts/JetBrainsMono';

const {fontFamily: DM} = loadDM();
const {fontFamily: JB} = loadJB();

export const FPS = 30;
export const DURATION = 660; // 22s

const BG = '#F5F5F2';
const BG2 = '#EEEEE9';
const BG3 = '#E0E0DB';
const DARK = '#111111';
const TEXT = '#2B2F36';
const SUB = '#4A4F5A';
const MUTED = '#8B8F95';
const CTA = '#185FA5';
const CTA_DARK = '#0C447C';
const CTA_G = 'rgba(24,95,165,.25)';
const RED = '#C3392E';
const GREEN = '#16a34a';
const GREEN_DARK = '#15803d';

// Scene boundaries — total 660 = 22s
const S1 = {start: 0,   dur: 90};   // 0-3s     Hook
const S2 = {start: 90,  dur: 360};  // 3-15s    Demo (with punch at end)
const S3 = {start: 450, dur: 210};  // 15-22s   Proof+CTA combined

// ─── Background ─────────────────────────────────────────
const BgPremium: React.FC<{tone?: 'light' | 'mid' | 'soft'}> = ({tone = 'light'}) => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 80) * 4;
  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            tone === 'soft'
              ? `radial-gradient(ellipse 100% 70% at 50% 40%, #FFFEFB 0%, ${BG} 70%, ${BG2} 100%)`
              : tone === 'mid'
              ? `radial-gradient(ellipse 90% 70% at 50% 30%, ${BG} 0%, ${BG2} 100%)`
              : `radial-gradient(ellipse 110% 80% at 50% 35%, #FAF9F6 0%, ${BG} 60%, ${BG2} 100%)`,
        }}
      />
      {/* Subtle drift accent */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 50% 35% at ${50 + drift}% 70%, rgba(24,95,165,0.06) 0%, transparent 70%)`,
          mixBlendMode: 'multiply',
        }}
      />
    </AbsoluteFill>
  );
};

// ─── Grain overlay ──────────────────────────────────────
const Grain: React.FC<{opacity?: number}> = ({opacity = 0.04}) => (
  <AbsoluteFill
    style={{
      pointerEvents: 'none',
      mixBlendMode: 'multiply',
      opacity,
      backgroundImage:
        'url("data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22240%22 height=%22240%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%222%22 stitchTiles=%22stitch%22/></filter><rect width=%22240%22 height=%22240%22 filter=%22url(%23n)%22/></svg>")',
    }}
  />
);

// ─── Phone Frame (premium) ──────────────────────────────
const PhoneFrame: React.FC<{children: React.ReactNode; width?: number; height?: number}> = ({
  children,
  width = 580,
  height = 1240,
}) => (
  <div
    style={{
      width,
      height,
      background: 'linear-gradient(160deg, #1a1a1a 0%, #0a0a0a 50%, #1a1a1a 100%)',
      borderRadius: 64,
      padding: 14,
      boxShadow:
        '0 60px 140px rgba(0,0,0,.32), 0 18px 40px rgba(0,0,0,.18), 0 1px 0 rgba(255,255,255,.06) inset, 0 -1px 0 rgba(0,0,0,.4) inset',
      position: 'relative',
    }}
  >
    {/* Outer chrome highlight */}
    <div
      style={{
        position: 'absolute',
        inset: 4,
        borderRadius: 60,
        border: '1.5px solid rgba(255,255,255,.06)',
        pointerEvents: 'none',
      }}
    />
    {/* Specular highlight on top edge */}
    <div
      style={{
        position: 'absolute',
        top: 8,
        left: 60,
        right: 60,
        height: 2,
        background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,.18) 50%, transparent 100%)',
        borderRadius: 2,
        pointerEvents: 'none',
      }}
    />
    {/* Inner screen */}
    <div
      style={{
        width: '100%',
        height: '100%',
        background: '#fff',
        borderRadius: 50,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Status bar */}
      <div
        style={{
          height: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 38px',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div style={{fontSize: 18, fontWeight: 700, fontFamily: DM, color: DARK}}>9:41</div>
        <div style={{display: 'flex', gap: 6, alignItems: 'center'}}>
          <svg width="18" height="12" viewBox="0 0 16 11" fill={DARK}>
            <rect x="0" y="7" width="3" height="4" rx="0.5" />
            <rect x="4" y="5" width="3" height="6" rx="0.5" />
            <rect x="8" y="2" width="3" height="9" rx="0.5" />
            <rect x="12" y="0" width="3" height="11" rx="0.5" />
          </svg>
          <div
            style={{
              width: 28,
              height: 13,
              border: `1.5px solid ${DARK}`,
              borderRadius: 3,
              padding: 1.5,
              boxSizing: 'border-box',
              position: 'relative',
            }}
          >
            <div style={{width: '85%', height: '100%', background: DARK, borderRadius: 1}} />
            <div
              style={{
                position: 'absolute',
                right: -3,
                top: 3.5,
                width: 2,
                height: 6,
                background: DARK,
                borderRadius: '0 1px 1px 0',
              }}
            />
          </div>
        </div>
      </div>
      {/* Dynamic Island */}
      <div
        style={{
          position: 'absolute',
          top: 14,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 132,
          height: 38,
          background: '#000',
          borderRadius: 100,
          zIndex: 11,
        }}
      />
      <div style={{height: 'calc(100% - 50px)', overflow: 'hidden', position: 'relative'}}>{children}</div>
      {/* Home indicator */}
      <div
        style={{
          position: 'absolute',
          bottom: 9,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 148,
          height: 5,
          background: '#000',
          borderRadius: 100,
          zIndex: 12,
        }}
      />
    </div>
  </div>
);

// ─── Scene 1: Hook ──────────────────────────────────────
const SceneHook: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const f = frame;

  const labelO = interpolate(f, [0, 12], [0, 1], {extrapolateRight: 'clamp'});
  const labelY = interpolate(f, [0, 12], [16, 0], {extrapolateRight: 'clamp'});

  const oldPriceEnter = spring({frame: f - 8, fps, config: {damping: 14, stiffness: 130}});
  const oldPriceScale = 0.9 + oldPriceEnter * 0.1;

  const strikeT = interpolate(f, [30, 42], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const oldFade = interpolate(f, [40, 58], [1, 0.28], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const oldShift = interpolate(f, [48, 68], [0, -22], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const oldScale = interpolate(f, [48, 68], [1, 0.92], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  const newLabelO = interpolate(f, [50, 64], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const newPriceEnter = spring({frame: f - 56, fps, config: {damping: 12, stiffness: 130, mass: 0.5}});
  const newPriceScale = 0.7 + newPriceEnter * 0.3;
  const newPriceY = (1 - newPriceEnter) * 28;

  // Subtle particle burst at the strike moment
  const particleT = interpolate(f, [42, 70], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{fontFamily: DM, alignItems: 'center', justifyContent: 'center'}}>
      <BgPremium tone="light" />

      <div style={{width: 1000, textAlign: 'center'}}>
        {/* Old (crossed out) */}
        <div style={{opacity: oldFade, transform: `translateY(${oldShift}px) scale(${oldScale})`}}>
          <div
            style={{
              fontSize: 30,
              color: SUB,
              fontWeight: 500,
              letterSpacing: '0.04em',
              opacity: labelO,
              transform: `translateY(${labelY}px)`,
              marginBottom: 18,
            }}
          >
            Eine Website beim Webdesigner:
          </div>
          <div
            style={{
              fontSize: 130,
              fontWeight: 800,
              fontFamily: JB,
              color: oldFade < 0.7 ? RED : DARK,
              letterSpacing: '-0.04em',
              transform: `scale(${oldPriceScale})`,
              opacity: oldPriceEnter,
              position: 'relative',
              display: 'inline-block',
            }}
          >
            1.500€&nbsp;–&nbsp;5.000€
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '-3%',
                height: 9,
                background: RED,
                transformOrigin: 'left center',
                transform: `scaleX(${strikeT}) rotate(-4deg) translateY(-4px)`,
                width: '106%',
                borderRadius: 4,
                boxShadow: `0 0 22px ${RED}`,
              }}
            />
            {/* Particle bursts */}
            {particleT > 0 && particleT < 1 && (
              <>
                {[...Array(8)].map((_, i) => {
                  const angle = (i / 8) * Math.PI * 2;
                  const dist = particleT * 80;
                  return (
                    <div
                      key={i}
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: RED,
                        opacity: 1 - particleT,
                        transform: `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px)`,
                        boxShadow: `0 0 10px ${RED}`,
                      }}
                    />
                  );
                })}
              </>
            )}
          </div>
        </div>

        {/* New */}
        <div style={{marginTop: 36, opacity: newLabelO}}>
          <div
            style={{
              fontSize: 30,
              color: CTA,
              fontWeight: 600,
              letterSpacing: '0.04em',
              marginBottom: 18,
            }}
          >
            Bei instantpage:
          </div>
          <div
            style={{
              fontSize: 240,
              fontWeight: 800,
              fontFamily: JB,
              color: DARK,
              letterSpacing: '-0.05em',
              transform: `scale(${newPriceScale}) translateY(${newPriceY}px)`,
              lineHeight: 1,
            }}
          >
            <span style={{color: CTA, textShadow: `0 8px 40px ${CTA_G}`}}>16€</span>
            <span
              style={{
                fontSize: 60,
                color: SUB,
                fontWeight: 600,
                marginLeft: 14,
                fontFamily: DM,
                letterSpacing: '-0.01em',
              }}
            >
              /Monat
            </span>
          </div>
        </div>
      </div>

      <Grain opacity={0.03} />
    </AbsoluteFill>
  );
};

// ─── Scene 2: Demo (Phone-Hero, Caption-Status) ─────────
const SceneDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const f = frame;

  // Phases
  let phase: 0 | 1 | 2 | 3 | 4 = 0;
  let phaseF = f;
  if (f >= 80 && f < 160) { phase = 1; phaseF = f - 80; }
  else if (f >= 160 && f < 240) { phase = 2; phaseF = f - 160; }
  else if (f >= 240 && f < 320) { phase = 3; phaseF = f - 240; }
  else if (f >= 320) { phase = 4; phaseF = f - 320; }

  // Visible counter
  const counterFrozen = f >= 320;
  const visibleSecs = counterFrozen ? 9 : Math.min(9, Math.floor((f / 320) * 10));
  const counterText = `00:0${visibleSecs}`;

  // Sticky states
  const branchePicked = f >= 40;
  const nameTyping = f >= 86 ? Math.min(20, Math.floor((f - 86) / 3)) : 0;
  const leist1 = f >= 175;
  const leist2 = f >= 195;
  const leist3 = f >= 215;
  const logoUploaded = f >= 285;

  // Section visibility
  const heroOn = interpolate(f, [42, 76], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const namePulse = f >= 86 && nameTyping < 20;
  const leistungenOn = interpolate(f, [200, 232], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const logoOn = interpolate(f, [285, 305], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  // Punch
  const punchEnter = spring({frame: f - 320, fps, config: {damping: 16, stiffness: 130, mass: 0.7}});
  const onlineBadgeEnter = spring({frame: f - 324, fps, config: {damping: 12, stiffness: 130, mass: 0.5}});

  // Phone — subtle 3D tilt + breathing parallax
  const phoneTilt = Math.sin(f / 60) * 1.8; // -1.8 to +1.8 degrees
  const phoneFloat = Math.sin(f / 50) * 4; // -4 to +4 px
  const phoneScale = 1 + punchEnter * 0.04;

  // Captions per phase: each replaces the last
  const captions = [
    {label: '01 — Branche', value: 'Elektriker'},
    {label: '02 — Firmenname', value: nameTyping >= 20 ? 'Meier Elektrotechnik' : nameTyping > 0 ? 'Meier Elektrotechnik'.slice(0, nameTyping) + '|' : ''},
    {label: '03 — Leistungen', value: ['Smart Home', leist2 ? 'PV-Anlagen' : null, leist3 ? 'E-Ladestation' : null].filter(Boolean).join(' · ')},
    {label: '04 — Logo', value: logoUploaded ? 'logo.png hochgeladen' : 'wird hochgeladen...'},
    {label: '✓ Online', value: 'Ihre Website ist live.'},
  ];
  const cap = captions[phase];
  // Caption enter animation per phase
  const capEnter = spring({frame: phaseF, fps, config: {damping: 18, stiffness: 130, mass: 0.6}});

  return (
    <AbsoluteFill style={{fontFamily: DM, overflow: 'hidden'}}>
      <BgPremium tone="mid" />

      {/* TOP: Logo + HERO COUNTER */}
      <div
        style={{
          position: 'absolute',
          top: 50,
          left: 60,
          right: 60,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 5,
        }}
      >
        <Img src={staticFile('logo.png')} style={{height: 52, width: 'auto', opacity: 0.95}} />

        <div
          style={{
            fontFamily: JB,
            fontSize: 56,
            fontWeight: 800,
            color: counterFrozen ? GREEN : DARK,
            letterSpacing: '-0.04em',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            transition: 'color 0.3s',
          }}
        >
          <span
            style={{
              width: 14,
              height: 14,
              borderRadius: '50%',
              background: counterFrozen ? GREEN : RED,
              opacity: counterFrozen ? 1 : 0.4 + 0.6 * Math.abs(Math.sin(f / 8)),
              boxShadow: counterFrozen ? `0 0 16px ${GREEN}` : `0 0 8px ${RED}`,
            }}
          />
          {counterText}
        </div>
      </div>

      {/* PHONE — centered, with 3D tilt + parallax */}
      <div
        style={{
          position: 'absolute',
          top: 170,
          left: '50%',
          transform: `translateX(-50%) translateY(${phoneFloat}px) scale(${phoneScale}) perspective(1800px) rotateY(${phoneTilt}deg) rotateX(1deg)`,
          transformOrigin: 'center center',
          zIndex: 3,
        }}
      >
        <PhoneFrame width={580} height={1240}>
          <div style={{position: 'relative', height: '100%', background: '#fff'}}>
            {/* Empty placeholder */}
            {heroOn < 0.1 && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: MUTED,
                  fontSize: 16,
                  fontWeight: 500,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  textAlign: 'center',
                  padding: '0 40px',
                }}
              >
                Ihre Website wird gebaut...
              </div>
            )}

            {/* Hero */}
            <div
              style={{
                opacity: heroOn,
                transform: `translateY(${(1 - heroOn) * 16}px)`,
                background: 'linear-gradient(160deg,#0f2b5b 0%,#1a3a6e 100%)',
                padding: '32px 30px',
                color: '#fff',
                position: 'relative',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  marginBottom: 18,
                  opacity: logoOn,
                  transform: `translateX(${(1 - logoOn) * -16}px)`,
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 9,
                    background: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#0f2b5b',
                    fontWeight: 800,
                    fontSize: 18,
                    fontFamily: JB,
                  }}
                >
                  M
                </div>
                <div style={{fontWeight: 700, fontSize: 15}}>Meier Elektrotechnik</div>
              </div>

              <div
                style={{
                  display: 'inline-block',
                  background: 'rgba(255,255,255,.16)',
                  padding: '5px 12px',
                  borderRadius: 100,
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  marginBottom: 14,
                }}
              >
                Meisterbetrieb
              </div>
              <div
                style={{
                  fontSize: 40,
                  fontWeight: 700,
                  lineHeight: 1.05,
                  letterSpacing: '-0.03em',
                  minHeight: 48,
                }}
              >
                {nameTyping > 0 ? 'Meier Elektrotechnik'.slice(0, nameTyping) : <span style={{opacity: 0.4}}>...</span>}
                {namePulse && f % 12 < 6 && (
                  <span
                    style={{
                      display: 'inline-block',
                      width: 3,
                      height: 38,
                      background: '#fff',
                      marginLeft: 3,
                      verticalAlign: 'middle',
                    }}
                  />
                )}
              </div>
              <div style={{fontSize: 15, opacity: 0.85, marginTop: 8}}>
                Elektroinstallationen · Wien
              </div>
              <div
                style={{
                  marginTop: 20,
                  background: '#fff',
                  color: '#0f2b5b',
                  display: 'inline-block',
                  padding: '11px 24px',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 700,
                  opacity: heroOn,
                }}
              >
                Termin anfragen
              </div>
            </div>

            {/* Leistungen */}
            <div
              style={{
                opacity: leistungenOn,
                transform: `translateY(${(1 - leistungenOn) * 16}px)`,
                padding: '24px 28px',
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: SUB,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  marginBottom: 12,
                }}
              >
                Leistungen
              </div>
              <div style={{display: 'flex', flexDirection: 'column', gap: 9}}>
                {[
                  {n: '01', t: 'Smart Home', show: leist1},
                  {n: '02', t: 'PV-Anlagen', show: leist2},
                  {n: '03', t: 'E-Ladestation', show: leist3},
                ].map((it) => {
                  const o = it.show ? 1 : 0;
                  return (
                    <div
                      key={it.t}
                      style={{
                        background: '#F7F7F4',
                        borderRadius: 10,
                        padding: '12px 14px',
                        fontSize: 14,
                        color: TEXT,
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        opacity: o,
                        transform: `scale(${0.92 + o * 0.08})`,
                      }}
                    >
                      <span
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: 6,
                          background: '#0f2b5b',
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontFamily: JB,
                          fontWeight: 700,
                          fontSize: 11,
                          flexShrink: 0,
                        }}
                      >
                        {it.n}
                      </span>
                      {it.t}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Online Badge — punch */}
            <div
              style={{
                position: 'absolute',
                top: 80,
                right: 22,
                opacity: onlineBadgeEnter,
                transform: `scale(${0.6 + onlineBadgeEnter * 0.4})`,
                background: `linear-gradient(140deg, ${GREEN} 0%, ${GREEN_DARK} 100%)`,
                color: '#fff',
                padding: '11px 20px',
                borderRadius: 100,
                fontSize: 14,
                fontWeight: 700,
                boxShadow: '0 14px 36px rgba(22,163,74,.55)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                zIndex: 10,
              }}
            >
              <span style={{fontSize: 16}}>✓</span> Online
            </div>
          </div>
        </PhoneFrame>
      </div>

      {/* CAPTION (Apple-style status) at bottom */}
      <div
        style={{
          position: 'absolute',
          bottom: 100,
          left: 0,
          right: 0,
          textAlign: 'center',
          padding: '0 60px',
        }}
      >
        <div
          key={`cap-label-${phase}`}
          style={{
            fontSize: 22,
            color: phase === 4 ? GREEN : MUTED,
            fontWeight: 700,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            marginBottom: 14,
            opacity: capEnter,
            transform: `translateY(${(1 - capEnter) * 12}px)`,
            fontFamily: phase === 4 ? DM : JB,
          }}
        >
          {cap.label}
        </div>
        <div
          key={`cap-value-${phase}`}
          style={{
            fontSize: phase === 4 ? 80 : 56,
            color: DARK,
            fontWeight: 700,
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            opacity: capEnter,
            transform: `translateY(${(1 - capEnter) * 16}px)`,
            minHeight: 90,
          }}
        >
          {cap.value}
        </div>
      </div>

      <Grain opacity={0.025} />
    </AbsoluteFill>
  );
};

// ─── Scene 3: Proof + CTA combined ──────────────────────
const SceneProofCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const f = frame;

  const checks = [
    {t: 'Bei Google sichtbar', delay: 0},
    {t: 'DSGVO + Impressum', delay: 6},
    {t: 'SSL-verschluesselt', delay: 12},
    {t: 'Mobil-optimiert', delay: 18},
  ];

  const logoEnter = spring({frame: f - 28, fps, config: {damping: 14, stiffness: 130, mass: 0.6}});
  const priceEnter = spring({frame: f - 48, fps, config: {damping: 13, stiffness: 110, mass: 0.6}});
  const subO = interpolate(f, [68, 88], [0, 1], {extrapolateRight: 'clamp'});
  const ctaEnter = spring({frame: f - 86, fps, config: {damping: 16, stiffness: 130}});
  const urlO = interpolate(f, [110, 130], [0, 1], {extrapolateRight: 'clamp'});

  const pulseT = interpolate(f, [120, 145, 170, 195], [0, 1, 0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const pulseShadow = `0 18px 60px ${CTA_G}, 0 0 0 ${pulseT * 18}px rgba(24,95,165,${0.18 - pulseT * 0.18})`;
  const arrowX = interpolate(f, [108, 128, 148, 168], [0, 6, 0, 6], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{fontFamily: DM, alignItems: 'center'}}>
      <BgPremium tone="soft" />

      {/* Top: 4 quick check pills */}
      <div
        style={{
          position: 'absolute',
          top: 100,
          left: 0,
          right: 0,
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 12,
          padding: '0 60px',
        }}
      >
        {checks.map((c) => {
          const o = interpolate(f, [c.delay, c.delay + 14], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const scale = 0.85 + o * 0.15;
          return (
            <div
              key={c.t}
              style={{
                opacity: o,
                transform: `scale(${scale})`,
                background: '#fff',
                border: `1px solid ${BG3}`,
                borderRadius: 100,
                padding: '12px 22px 12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                boxShadow: '0 6px 20px rgba(0,0,0,.05)',
              }}
            >
              <span
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: `linear-gradient(140deg, ${GREEN} 0%, ${GREEN_DARK} 100%)`,
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                  fontWeight: 800,
                  flexShrink: 0,
                  boxShadow: '0 4px 10px rgba(22,163,74,.35)',
                }}
              >
                ✓
              </span>
              <span style={{fontSize: 22, fontWeight: 700, color: DARK, letterSpacing: '-0.01em'}}>{c.t}</span>
            </div>
          );
        })}
      </div>

      {/* Center: Logo + Price */}
      <div
        style={{
          position: 'absolute',
          top: 380,
          left: 0,
          right: 0,
          textAlign: 'center',
        }}
      >
        <div style={{transform: `scale(${0.88 + logoEnter * 0.12})`, opacity: logoEnter, marginBottom: 28}}>
          <Img src={staticFile('logo.png')} style={{width: 720, height: 'auto', display: 'inline-block'}} />
        </div>

        <div style={{opacity: priceEnter, transform: `translateY(${(1 - priceEnter) * 16}px)`}}>
          <div style={{fontSize: 28, color: SUB, fontWeight: 500, marginBottom: 8}}>
            Ihre eigene Website
          </div>
          <div
            style={{
              fontSize: 160,
              fontWeight: 800,
              color: DARK,
              fontFamily: JB,
              letterSpacing: '-0.05em',
              lineHeight: 1,
            }}
          >
            <span style={{color: CTA, textShadow: `0 6px 36px ${CTA_G}`}}>16€</span>
            <span
              style={{
                fontSize: 46,
                color: SUB,
                fontWeight: 600,
                marginLeft: 14,
                fontFamily: DM,
                letterSpacing: '-0.01em',
              }}
            >
              /Monat
            </span>
          </div>
        </div>

        <div
          style={{
            marginTop: 22,
            fontSize: 28,
            color: SUB,
            fontWeight: 500,
            opacity: subO,
            letterSpacing: '-0.01em',
          }}
        >
          Heute starten. In 10 Minuten online.
        </div>
      </div>

      {/* CTA + URL */}
      <div
        style={{
          position: 'absolute',
          bottom: 220,
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div style={{opacity: ctaEnter, transform: `scale(${0.92 + ctaEnter * 0.08})`}}>
          <div
            style={{
              background: `linear-gradient(180deg, ${CTA} 0%, ${CTA_DARK} 100%)`,
              color: '#fff',
              padding: '28px 64px 28px 72px',
              borderRadius: 18,
              fontSize: 38,
              fontWeight: 600,
              boxShadow: pulseShadow,
              fontFamily: DM,
              letterSpacing: '-0.01em',
              display: 'flex',
              alignItems: 'center',
              gap: 22,
            }}
          >
            <span>Kostenlos starten</span>
            <span style={{transform: `translateX(${arrowX}px)`, display: 'inline-flex'}}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>

        <div
          style={{
            marginTop: 32,
            fontFamily: JB,
            fontSize: 30,
            color: DARK,
            fontWeight: 700,
            opacity: urlO,
            letterSpacing: '0.04em',
          }}
        >
          instantpage.at
        </div>
      </div>

      <Grain opacity={0.03} />
    </AbsoluteFill>
  );
};

// ─── Scene wrapper ──────────────────────────────────────
const SceneWrapper: React.FC<{
  dur: number;
  fadeIn?: number;
  fadeOut?: number;
  slide?: boolean;
  children: React.ReactNode;
}> = ({dur, fadeIn = 8, fadeOut = 10, slide = true, children}) => {
  const frame = useCurrentFrame();
  const fi = Math.max(1, fadeIn);
  const fo = Math.max(1, fadeOut);
  const inOp = fadeIn === 0 ? 1 : interpolate(frame, [0, fi], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const outOp = fadeOut === 0 ? 1 : interpolate(frame, [dur - fo, dur], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const opacity = Math.min(inOp, outOp);
  const slideY = slide && fadeIn > 0 ? interpolate(frame, [0, fi], [16, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 0;
  return (
    <AbsoluteFill style={{opacity, transform: `translateY(${slideY}px)`}}>
      {children}
    </AbsoluteFill>
  );
};

// ─── Main composition ───────────────────────────────────
export const Promo: React.FC = () => {
  return (
    <AbsoluteFill style={{background: BG}}>
      <Sequence from={S1.start} durationInFrames={S1.dur}>
        <SceneWrapper dur={S1.dur} fadeIn={0} fadeOut={0} slide={false}>
          <SceneHook />
        </SceneWrapper>
      </Sequence>

      <Sequence from={S2.start} durationInFrames={S2.dur}>
        <SceneWrapper dur={S2.dur} fadeIn={0} fadeOut={0} slide={false}>
          <SceneDemo />
        </SceneWrapper>
      </Sequence>

      <Sequence from={S3.start} durationInFrames={S3.dur}>
        <SceneWrapper dur={S3.dur} fadeIn={10} fadeOut={0}>
          <SceneProofCTA />
        </SceneWrapper>
      </Sequence>
    </AbsoluteFill>
  );
};
