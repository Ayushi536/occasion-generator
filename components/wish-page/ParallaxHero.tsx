'use client';

import { useRef, useState } from 'react';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import { WishPage } from '@/lib/types';
import { TEMPLATES, getOccasionDecoration } from './theme-config';

interface ParallaxHeroProps {
  page: WishPage;
  isPlayingMusic: boolean;
  onToggleMusic: () => void;
}

/**
 * 3-layer parallax hero.
 *  - Back layer  (~0.2x): template scene (starfield / bokeh / light rays)
 *  - Mid layer   (~0.5x): occasion emojis + template shapes
 *  - Front layer (1x+) : badge, headline, subheadline, scroll hint
 * All motion is transform/opacity only. With prefers-reduced-motion the
 * layers are static and only simple fades remain.
 */
export default function ParallaxHero({ page, isPlayingMusic, onToggleMusic }: ParallaxHeroProps) {
  const theme = TEMPLATES[page.template] || TEMPLATES['neon-night'];
  const deco = getOccasionDecoration(page.occasion);
  const reduce = useReducedMotion() ?? false;

  const sectionRef = useRef<HTMLElement | null>(null);
  const headlineWords = page.headline.split(' ');
  const isDevanagari = page.language === 'hi' || /[\u0900-\u097F]/.test(page.headline);

  // --- Scroll-linked parallax (one useScroll, different ranges per layer) ---
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const backY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const midY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const frontY = useTransform(scrollYProgress, [0, 1], ['0%', '-10%']);
  const frontOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  // --- Pointer tilt (mouse only, desktop) ---
  const pointerX = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 60, damping: 20, mass: 0.6 });
  const backX = useTransform(smoothX, (v) => v * -14);
  const midX = useTransform(smoothX, (v) => v * -34);
  const frontX = useTransform(smoothX, (v) => v * 10);

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (reduce || e.pointerType !== 'mouse') return;
    const rect = e.currentTarget.getBoundingClientRect();
    pointerX.set((e.clientX - rect.left) / rect.width - 0.5);
  };

  // --- Deterministic scene data (no Math.random => no hydration mismatch) ---
  const [stars] = useState(() =>
    Array.from({ length: 56 }).map((_, i) => ({
      id: i,
      left: (i * 37) % 100,
      top: (i * 53) % 100,
      size: 1 + (i % 3),
      delay: (i * 0.37) % 4,
      duration: 2.5 + (i % 4),
      opacity: 0.35 + (i % 5) * 0.13,
    }))
  );
  const [bokeh] = useState(() =>
    Array.from({ length: 14 }).map((_, i) => ({
      id: i,
      left: (i * 29 + 6) % 96,
      top: (i * 41 + 8) % 92,
      size: 70 + ((i * 37) % 130),
      color: i % 3 === 0 ? 'primary' : i % 3 === 1 ? 'secondary' : 'tertiary',
      delay: (i * 0.6) % 5,
      duration: 6 + (i % 4) * 1.5,
    }))
  );
  const [dust] = useState(() =>
    Array.from({ length: 22 }).map((_, i) => ({
      id: i,
      left: (i * 23 + 5) % 96,
      top: (i * 47 + 3) % 94,
      size: 2 + (i % 3),
      delay: (i * 0.45) % 4,
      duration: 3 + (i % 4),
    }))
  );
  const [midSpots] = useState(() =>
    Array.from({ length: 8 }).map((_, i) => ({
      id: i,
      left: (i * 23 + 7) % 90,
      top: 10 + ((i * 31) % 80),
      size: 28 + (i % 3) * 10,
      duration: 5 + (i % 4) * 1.4,
      delay: (i * 0.7) % 3,
      drift: i % 2 === 0 ? 1 : -1,
    }))
  );

  const { primary, secondary, tertiary, glow } = theme.palette;
  const tone = (k: string) => (k === 'primary' ? primary : k === 'secondary' ? secondary : tertiary);
  const layerBase = 'absolute inset-x-0 pointer-events-none will-change-transform';

  const fade = (delay: number, y = 20) =>
    reduce
      ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.4, delay: delay * 0.4 } }
      : {
          initial: { opacity: 0, y },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, delay },
        };

  return (
    <section
      ref={sectionRef}
      onPointerMove={handlePointerMove}
      className="relative min-h-[96vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden pt-12 pb-20 select-none"
    >
      {/* ===== LAYER 1 — BACK (slowest, ~0.2x): template scene ===== */}
      <motion.div
        aria-hidden="true"
        className={`${layerBase} -top-1/4 bottom-0`}
        style={reduce ? undefined : { y: backY, x: backX }}
      >
        {theme.heroScene === 'starfield' && (
          <>
            {stars.map((s) => (
              <motion.span
                key={s.id}
                className="absolute rounded-full bg-white"
                style={{
                  left: `${s.left}%`,
                  top: `${s.top}%`,
                  width: s.size,
                  height: s.size,
                  opacity: s.opacity,
                  boxShadow: s.size > 2 ? `0 0 8px ${primary}` : undefined,
                }}
                animate={reduce ? undefined : { opacity: [s.opacity, 0.08, s.opacity] }}
                transition={reduce ? undefined : { duration: s.duration, delay: s.delay, repeat: Infinity, ease: 'easeInOut' }}
              />
            ))}
            {/* perspective neon grid floor */}
            <div
              className="absolute inset-x-0 bottom-0 h-[45%] opacity-40"
              style={{
                backgroundImage: `linear-gradient(${primary}55 1px, transparent 1px), linear-gradient(90deg, ${secondary}55 1px, transparent 1px)`,
                backgroundSize: '56px 56px',
                transform: 'perspective(500px) rotateX(62deg)',
                transformOrigin: 'bottom',
                maskImage: 'linear-gradient(to top, black, transparent 90%)',
                WebkitMaskImage: 'linear-gradient(to top, black, transparent 90%)',
              }}
            />
            <div
              className="absolute left-1/2 top-[38%] h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[110px] sm:h-[620px] sm:w-[620px]"
              style={{ background: `radial-gradient(circle, ${primary}40, ${secondary}30 55%, transparent 75%)` }}
            />
          </>
        )}

        {theme.heroScene === 'bokeh' && (
          <>
            {bokeh.map((b) => (
              <motion.span
                key={b.id}
                className="absolute rounded-full blur-2xl"
                style={{
                  left: `${b.left}%`,
                  top: `${b.top}%`,
                  width: b.size,
                  height: b.size,
                  background: tone(b.color),
                  opacity: 0.22,
                }}
                animate={reduce ? undefined : { scale: [1, 1.18, 1], opacity: [0.16, 0.3, 0.16] }}
                transition={reduce ? undefined : { duration: b.duration, delay: b.delay, repeat: Infinity, ease: 'easeInOut' }}
              />
            ))}
            <div
              className="absolute inset-0"
              style={{ background: `radial-gradient(ellipse at 50% 40%, ${glow}, transparent 60%)` }}
            />
          </>
        )}

        {theme.heroScene === 'rays' && (
          <>
            <div
              className="absolute left-1/2 top-[40%] h-[1400px] w-[1400px] -translate-x-1/2 -translate-y-1/2"
              style={{
                background: `repeating-conic-gradient(from 0deg at 50% 50%, ${primary}22 0deg 3deg, transparent 3deg 15deg)`,
                maskImage: 'radial-gradient(circle, black 5%, transparent 55%)',
                WebkitMaskImage: 'radial-gradient(circle, black 5%, transparent 55%)',
              }}
            />
            <motion.div
              className="absolute left-1/2 top-[40%] h-[460px] w-[460px] -translate-x-1/2 -translate-y-1/2 rounded-full border sm:h-[640px] sm:w-[640px]"
              style={{ borderColor: `${primary}55` }}
              animate={reduce ? undefined : { rotate: 360 }}
              transition={reduce ? undefined : { duration: 90, repeat: Infinity, ease: 'linear' }}
            >
              <span className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45" style={{ background: primary, boxShadow: `0 0 14px ${primary}` }} />
              <span className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45" style={{ background: tertiary, boxShadow: `0 0 14px ${tertiary}` }} />
            </motion.div>
            <div
              className="absolute left-1/2 top-[40%] h-[340px] w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full border sm:h-[500px] sm:w-[500px]"
              style={{ borderColor: `${secondary}33` }}
            />
            {dust.map((d) => (
              <motion.span
                key={d.id}
                className="absolute rounded-full"
                style={{
                  left: `${d.left}%`,
                  top: `${d.top}%`,
                  width: d.size,
                  height: d.size,
                  background: primary,
                  boxShadow: `0 0 10px ${primary}`,
                  opacity: 0.5,
                }}
                animate={reduce ? undefined : { opacity: [0.15, 0.85, 0.15] }}
                transition={reduce ? undefined : { duration: d.duration, delay: d.delay, repeat: Infinity, ease: 'easeInOut' }}
              />
            ))}
            <div
              className="absolute inset-0"
              style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.65) 90%)' }}
            />
          </>
        )}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.35)_100%)]" />
      </motion.div>

      {/* ===== LAYER 2 — MID (~0.5x): occasion emojis + template shapes ===== */}
      <motion.div
        aria-hidden="true"
        className={`${layerBase} -top-1/2 bottom-0`}
        style={reduce ? undefined : { y: midY, x: midX }}
      >
        {midSpots.map((m, idx) => {
          const emoji = deco.floatingItems[idx % deco.floatingItems.length];
          return (
            <motion.span
              key={m.id}
              className="absolute select-none drop-shadow-[0_0_10px_rgba(255,255,255,0.35)]"
              style={{ left: `${m.left}%`, top: `${m.top}%`, fontSize: m.size, opacity: 0.85 }}
              animate={reduce ? undefined : { y: [0, -18, 0], rotate: [0, 8 * m.drift, 0] }}
              transition={reduce ? undefined : { duration: m.duration, delay: m.delay, repeat: Infinity, ease: 'easeInOut' }}
            >
              {emoji}
            </motion.span>
          );
        })}
        {/* template-specific mid shapes */}
        {theme.heroScene === 'starfield' &&
          [0, 1, 2].map((i) => (
            <motion.span
              key={`shape-${i}`}
              className="absolute rounded-full border-2"
              style={{
                left: `${14 + i * 34}%`,
                top: `${22 + i * 26}%`,
                width: 54 + i * 16,
                height: 54 + i * 16,
                borderColor: i === 1 ? secondary : primary,
                boxShadow: `0 0 18px ${i === 1 ? secondary : primary}, inset 0 0 14px ${i === 1 ? secondary : primary}55`,
                opacity: 0.55,
              }}
              animate={reduce ? undefined : { scale: [1, 1.12, 1] }}
              transition={reduce ? undefined : { duration: 4 + i, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
        {theme.heroScene === 'bokeh' &&
          [0, 1, 2, 3].map((i) => (
            <motion.span
              key={`balloon-${i}`}
              className="absolute rounded-[50%_50%_48%_48%]"
              style={{
                left: `${8 + i * 26}%`,
                top: `${30 + ((i * 17) % 40)}%`,
                width: 34 + (i % 2) * 14,
                height: 44 + (i % 2) * 16,
                background: `linear-gradient(160deg, ${tone(['primary', 'secondary', 'tertiary', 'primary'][i])}, ${tone(['secondary', 'tertiary', 'primary', 'tertiary'][i])}aa)`,
                opacity: 0.55,
              }}
              animate={reduce ? undefined : { y: [0, -26, 0] }}
              transition={reduce ? undefined : { duration: 6 + i, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
        {theme.heroScene === 'rays' &&
          [0, 1, 2, 3, 4].map((i) => (
            <motion.span
              key={`diamond-${i}`}
              className="absolute rotate-45"
              style={{
                left: `${10 + i * 19}%`,
                top: `${20 + ((i * 29) % 55)}%`,
                width: 10 + (i % 2) * 6,
                height: 10 + (i % 2) * 6,
                background: i % 2 === 0 ? primary : tertiary,
                boxShadow: `0 0 12px ${i % 2 === 0 ? primary : tertiary}`,
                opacity: 0.7,
              }}
              animate={reduce ? undefined : { y: [0, -14, 0], opacity: [0.4, 0.9, 0.4] }}
              transition={reduce ? undefined : { duration: 5 + i * 0.6, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
      </motion.div>

      {/* Audio controller (kept outside the parallax layers so it never drifts) */}
      {page.audioTrack?.enabled && (
        <div className="absolute top-6 right-6 z-30">
          <button
            onClick={onToggleMusic}
            title={isPlayingMusic ? 'Mute Celebration Track' : 'Play Celebration Track'}
            className={`flex items-center gap-2.5 rounded-full border bg-black/60 px-4 py-2 text-xs font-semibold text-white backdrop-blur-xl transition hover:bg-black/80 cursor-pointer group ${theme.audioButton}`}
          >
            {isPlayingMusic ? (
              <>
                <Volume2 className={`h-4 w-4 ${theme.audioIcon} ${reduce ? '' : 'animate-pulse'}`} />
                <span className={`text-[11px] font-mono tracking-wider ${theme.audioActiveText}`}>AUDIO ON</span>
                <div className="flex gap-0.5 items-end h-3.5">
                  {[
                    ['4px', '14px', '6px', '12px', '4px', 0.8, 0],
                    ['12px', '4px', '14px', '7px', '12px', 0.7, 0.1],
                    ['6px', '14px', '5px', '14px', '6px', 0.9, 0.2],
                    ['10px', '5px', '12px', '4px', '10px', 0.75, 0.3],
                  ].map((b, i) =>
                    reduce ? (
                      <span key={i} className={`w-1 rounded-full ${theme.audioBars[i]}`} style={{ height: b[0] as string }} />
                    ) : (
                      <motion.span
                        key={i}
                        animate={{ height: b.slice(0, 5) as string[] }}
                        transition={{ repeat: Infinity, duration: b[5] as number, ease: 'easeInOut', delay: b[6] as number }}
                        className={`w-1 rounded-full ${theme.audioBars[i]}`}
                      />
                    )
                  )}
                </div>
              </>
            ) : (
              <>
                <VolumeX className="h-4 w-4 text-slate-400 group-hover:text-white transition" />
                <span className="text-[11px] text-slate-400 group-hover:text-slate-200">UNMUTE SOUND</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* ===== LAYER 3 — FRONT (1x+): story content ===== */}
      <motion.div
        className="relative z-10 max-w-4xl mx-auto flex flex-col items-center will-change-transform"
        style={reduce ? undefined : { y: frontY, x: frontX, opacity: frontOpacity }}
      >
        <motion.div
          initial={reduce ? { opacity: 0 } : { scale: 0.7, opacity: 0, y: -20 }}
          animate={reduce ? { opacity: 1 } : { scale: 1, opacity: 1, y: 0 }}
          transition={reduce ? { duration: 0.4 } : { type: 'spring', damping: 14, stiffness: 180, delay: 0.1 }}
          className={`flex flex-wrap items-center justify-center gap-2.5 px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-xl ${theme.heroBadge}`}
        >
          <Sparkles
            className={`h-3.5 w-3.5 ${theme.heroBadgeIcon} ${reduce ? '' : 'animate-spin'}`}
            style={reduce ? undefined : { animationDuration: '4s' }}
          />
          <span>{deco.badge}</span>
          <span className="text-white/40">·</span>
          <span>{page.relationship}</span>
          {page.ageOrYears && (
            <>
              <span className="text-white/40">·</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] border ${theme.heroBadgeAge}`}>
                {page.ageOrYears}
              </span>
            </>
          )}
        </motion.div>

        <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-2 mb-6 max-w-3xl">
          {headlineWords.map((word, wordIdx) => (
            <motion.span
              key={wordIdx}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 35, rotateX: -60, scale: 0.8 }}
              animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, rotateX: 0, scale: 1 }}
              transition={
                reduce
                  ? { duration: 0.4, delay: 0.1 + wordIdx * 0.05 }
                  : { duration: 0.7, delay: 0.25 + wordIdx * 0.12, ease: [0.16, 1, 0.3, 1] }
              }
              className={`inline-block ${theme.heroHeadline}`}
              style={{ textWrap: 'balance', ...(isDevanagari ? { fontFamily: 'var(--font-hindi)' } : {}) }}
            >
              {word}
            </motion.span>
          ))}
        </div>

        {page.subheadline && (
          <motion.p
            {...fade(0.65)}
            className={`text-base sm:text-xl max-w-2xl font-light mb-10 leading-relaxed font-sans ${theme.heroSubtext}`}
            style={{ textWrap: 'balance' }}
          >
            {page.subheadline}
          </motion.p>
        )}

        <motion.div
          {...fade(0.85, 15)}
          className="flex flex-col items-center gap-2 cursor-pointer pt-2 group"
          onClick={() => {
            window.scrollBy({ top: window.innerHeight * 0.85, behavior: reduce ? 'auto' : 'smooth' });
          }}
        >
          <div className={`flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest transition ${theme.heroScrollHint}`}>
            <span>Scroll To Begin The Story</span>
          </div>
          <motion.div
            animate={reduce ? undefined : { y: [0, 8, 0] }}
            transition={reduce ? undefined : { repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
            className="h-10 w-6 rounded-full border-2 border-white/20 group-hover:border-white/60 flex items-start justify-center p-1 transition"
          >
            <motion.div
              animate={reduce ? undefined : { y: [0, 14, 0] }}
              transition={reduce ? undefined : { repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
              className={`w-1.5 h-2.5 rounded-full ${theme.heroScrollDot}`}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}