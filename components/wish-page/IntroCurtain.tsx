'use client';

import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Sparkles, Heart, Gift, Volume2, Award, PartyPopper } from 'lucide-react';
import confetti from 'canvas-confetti';
import { WishPage } from '@/lib/types';
import { TEMPLATES } from './theme-config';

interface IntroCurtainProps {
  page: WishPage;
  onBegin: () => void;
}

const CURTAIN_STYLES = {
  'neon-night': {
    backdrop: 'bg-[#030711]/98',
    glowA: 'from-cyan-500/25 to-cyan-500/0',
    glowB: 'from-pink-500/25 to-violet-600/0',
    ribbon: 'from-cyan-400 via-white to-pink-400',
    frame: 'border-cyan-300/50 bg-gradient-to-b from-[#10182b] via-[#090f20] to-[#050812] shadow-[0_15px_50px_rgba(0,0,0,0.8),0_0_40px_rgba(34,211,238,0.25)] group-hover:border-cyan-300',
    seal: 'from-cyan-200 via-cyan-400 to-pink-500 border-cyan-100 shadow-[0_0_32px_rgba(34,211,238,0.55)]',
    accent: 'text-cyan-200 border-cyan-300/35 bg-cyan-400/10',
    prompt: 'text-cyan-200',
    label: 'A celebration transmission',
  },
  'pastel-dream': {
    backdrop: 'bg-[#21152f]/98',
    glowA: 'from-pink-300/30 to-rose-400/0',
    glowB: 'from-violet-300/25 to-amber-200/0',
    ribbon: 'from-pink-300 via-rose-100 to-violet-300',
    frame: 'border-pink-200/55 bg-gradient-to-b from-[#5b3b69] via-[#41294f] to-[#2b1b3a] shadow-[0_18px_55px_rgba(15,8,24,0.7),0_0_40px_rgba(251,207,232,0.22)] group-hover:border-pink-100',
    seal: 'from-pink-100 via-rose-300 to-violet-400 border-pink-50 shadow-[0_0_32px_rgba(251,207,232,0.5)]',
    accent: 'text-pink-100 border-pink-200/40 bg-pink-200/10',
    prompt: 'text-pink-100',
    label: 'A keepsake from the heart',
  },
  'royal-gold': {
    backdrop: 'bg-[#090808]/98',
    glowA: 'from-amber-500/25 to-amber-700/0',
    glowB: 'from-red-900/30 to-amber-500/0',
    ribbon: 'from-amber-700 via-yellow-200 to-amber-700',
    frame: 'border-amber-400/55 bg-gradient-to-b from-[#241b14] via-[#15110e] to-[#090807] shadow-[0_18px_55px_rgba(0,0,0,0.8),0_0_40px_rgba(212,175,55,0.22)] group-hover:border-amber-300',
    seal: 'from-yellow-200 via-amber-400 to-amber-700 border-yellow-100 shadow-[0_0_32px_rgba(212,175,55,0.5)]',
    accent: 'text-amber-200 border-amber-400/40 bg-amber-400/10',
    prompt: 'text-amber-200',
    label: 'A private commemorative edition',
  },
} as const;

export default function IntroCurtain({ page, onBegin }: IntroCurtainProps) {
  const [opened, setOpened] = useState(false);
  const [breakingSeal, setBreakingSeal] = useState(false);
  const [particles] = useState<Array<{ id: number; left: number; top: number; size: number; delay: number; duration: number }>>(() => {
    return Array.from({ length: 28 }).map((_, i) => ({
      id: i,
      left: ((i * 17) % 94) + 3,
      top: ((i * 23) % 94) + 3,
      size: 2 + (i % 3) * 1.5,
      delay: (i * 0.4) % 3,
      duration: 3 + (i % 4) * 1.2,
    }));
  });
  const theme = TEMPLATES[page.template] || TEMPLATES['neon-night'];
  const curtain = CURTAIN_STYLES[page.template] || CURTAIN_STYLES['neon-night'];
  const shouldReduceMotion = useReducedMotion();

  const handleOpen = () => {
    if (breakingSeal || opened) return;
    setBreakingSeal(true);

    // Play triumphant multi-note celebration chime using Web Audio API
    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        const ctx = new AudioContextClass();
        const now = ctx.currentTime;
        const freqs = [523.25, 659.25, 783.99, 1046.5, 1318.51]; // C5, E5, G5, C6, E6 majestic chime
        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.09);
          gain.gain.setValueAtTime(0.22, now + idx * 0.09);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 1.4);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.09);
          osc.stop(now + idx * 0.09 + 1.4);
        });
      }
    } catch {
      // AudioContext fallback
    }

    // Double-blast celebratory confetti burst
    confetti({
      particleCount: shouldReduceMotion ? 24 : 85,
      spread: 75,
      origin: { y: 0.52 },
      colors: theme.confettiColors || ['#f59e0b', '#ec4899', '#3b82f6', '#ffd700'],
    });

    if (!shouldReduceMotion) {
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0.2, y: 0.6 },
          colors: theme.confettiColors,
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 0.8, y: 0.6 },
          colors: theme.confettiColors,
        });
      }, 200);
    }

    setTimeout(() => {
      setOpened(true);
      onBegin();
    }, shouldReduceMotion ? 300 : 950);
  };

  return (
    <AnimatePresence>
      {!opened && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.12,
            filter: 'blur(16px)',
          }}
          transition={{ duration: shouldReduceMotion ? 0.15 : 0.95, ease: [0.16, 1, 0.3, 1] }}
          className={`fixed inset-0 z-50 flex flex-col items-center justify-center ${curtain.backdrop} backdrop-blur-2xl p-6 text-center select-none overflow-hidden`}
        >
          {/* Animated Atmospheric Background Glow Orbs */}
          <motion.div
            animate={shouldReduceMotion ? undefined : {
              scale: [1, 1.25, 1],
              opacity: [0.25, 0.45, 0.25],
            }}
            transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
            className={`absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-gradient-to-br ${curtain.glowA} blur-[140px] pointer-events-none`}
          />
          <motion.div
            animate={shouldReduceMotion ? undefined : {
              scale: [1.2, 1, 1.2],
              opacity: [0.25, 0.4, 0.25],
            }}
            transition={{ repeat: Infinity, duration: 7, ease: 'easeInOut' }}
            className={`absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full bg-gradient-to-tl ${curtain.glowB} blur-[140px] pointer-events-none`}
          />

          {/* Floating Atmospheric Stardust Particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
            {particles.map((p) => (
              <motion.div
                key={p.id}
                animate={shouldReduceMotion ? undefined : {
                  y: [0, -35, 0],
                  x: [0, (p.id % 2 === 0 ? 15 : -15), 0],
                  opacity: [0.15, 0.85, 0.15],
                  scale: [1, 1.4, 1],
                }}
                transition={{
                  repeat: Infinity,
                  duration: p.duration,
                  delay: p.delay,
                  ease: 'easeInOut',
                }}
                style={{
                  left: `${p.left}%`,
                  top: `${p.top}%`,
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  backgroundColor: theme.palette.primary,
                  boxShadow: `0 0 10px ${theme.palette.glow}`,
                }}
                className="absolute rounded-full"
              />
            ))}
          </div>

          {/* Majestic Center Envelope & Seal Container */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 max-w-md w-full flex flex-col items-center"
          >
            {/* Occasion Floating Embellishment Ribbon */}
            <motion.div
              animate={shouldReduceMotion ? undefined : { y: [-3, 3, -3] }}
              transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-semibold tracking-[0.18em] uppercase mb-6 backdrop-blur-md ${curtain.accent}`}
            >
              <Sparkles className={`h-3.5 w-3.5 ${shouldReduceMotion ? '' : 'animate-spin'}`} style={{ color: theme.palette.primary, animationDuration: '6s' }} />
              <span>{curtain.label}</span>
              <Sparkles className={`h-3.5 w-3.5 ${shouldReduceMotion ? '' : 'animate-spin'}`} style={{ color: theme.palette.secondary, animationDuration: '6s' }} />
            </motion.div>

            {/* The 3D Floating Envelope with Levitation & Light Rays */}
            <motion.div
              animate={shouldReduceMotion ? undefined : {
                y: breakingSeal ? [0, -10, 0] : [-8, 8, -8],
                rotate: breakingSeal ? 0 : [-1.2, 1.2, -1.2],
              }}
              transition={{
                repeat: breakingSeal ? 0 : Infinity,
                duration: 4.2,
                ease: 'easeInOut',
              }}
              whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
              onClick={handleOpen}
              className="relative mb-8 cursor-pointer group select-none"
            >
              {/* Rotating Light Sweep Aura Behind Envelope */}
              <motion.div
                animate={shouldReduceMotion ? undefined : { rotate: 360 }}
                transition={{ repeat: Infinity, duration: 18, ease: 'linear' }}
                className="absolute -inset-10 rounded-full bg-[conic-gradient(from_0deg,#ffd70022,#f43f5e22,#3b82f622,#ffd70022)] blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
              />

              {/* Envelope Main Body */}
              <div className={`w-56 h-36 sm:w-64 sm:h-40 rounded-3xl border-2 ${curtain.frame} flex flex-col items-center justify-center relative overflow-hidden transition-all duration-300`}>
                {/* Diagonal Envelope Crease Geometry */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-amber-400/10 to-transparent" />
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-amber-300 to-transparent" />
                  {/* Flap fold lines */}
                  <svg className="absolute inset-0 w-full h-full opacity-30" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <polygon points="0,0 50,55 100,0" fill="rgba(255,255,255,0.04)" stroke="rgba(245,197,24,0.4)" strokeWidth="0.8" />
                    <line x1="0" y1="100" x2="45" y2="50" stroke="rgba(245,197,24,0.25)" strokeWidth="0.8" />
                    <line x1="100" y1="100" x2="55" y2="50" stroke="rgba(245,197,24,0.25)" strokeWidth="0.8" />
                  </svg>
                </div>

                {/* Animated Golden Satin Ribbon across the center */}
                <div className={`absolute inset-y-0 w-7 bg-gradient-to-r ${curtain.ribbon} shadow-md flex items-center justify-center`}>
                  <div className="w-[1px] h-full bg-white/60" />
                </div>
                <div className={`absolute inset-x-0 h-7 bg-gradient-to-b ${curtain.ribbon} shadow-md flex items-center justify-center`}>
                  <div className="h-[1px] w-full bg-white/60" />
                </div>

                {/* Golden Wax Seal Centerpiece with Celestial Rings */}
                <motion.div
                  animate={shouldReduceMotion ? undefined :
                    breakingSeal
                      ? { scale: [1, 1.4, 0], rotate: 180, opacity: [1, 1, 0] }
                      : { scale: [1, 1.08, 1] }
                  }
                  transition={
                    breakingSeal
                      ? { duration: 0.65, ease: 'easeIn' }
                      : { repeat: Infinity, duration: 2.5, ease: 'easeInOut' }
                  }
                  className={`relative z-20 h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-gradient-to-br ${curtain.seal} flex items-center justify-center border-2`}
                >
                  {/* Rotating Celestial Dashed Ring */}
                  <motion.div
                    animate={shouldReduceMotion ? undefined : { rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 12, ease: 'linear' }}
                    className="absolute -inset-2.5 rounded-full border border-dashed border-yellow-300/60 pointer-events-none"
                  />

                  {/* Wax Seal Icon */}
                  {page.occasion === 'anniversary' || page.occasion === 'love' ? (
                    <Heart className="h-8 w-8 text-slate-950 fill-slate-950 drop-shadow" />
                  ) : page.occasion === 'birthday' ? (
                    <Gift className="h-8 w-8 text-slate-950 drop-shadow" />
                  ) : page.occasion === 'graduation' || page.occasion === 'milestone' ? (
                    <Award className="h-8 w-8 text-slate-950 drop-shadow" />
                  ) : (
                    <Sparkles className="h-8 w-8 text-slate-950 drop-shadow" />
                  )}

                  {/* Specular Glint Reflection */}
                  <div className="absolute top-1.5 left-2.5 w-3 h-2 rounded-full bg-white/60 -rotate-45 blur-[0.5px]" />
                </motion.div>

                {/* Shimmer prompt tag */}
                <div className="absolute bottom-2 z-10">
                  <span className={`text-[10px] font-mono tracking-widest uppercase ${curtain.prompt} font-bold drop-shadow`}>
                    Tap to break the seal
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Recipient Dedication Header */}
            <span className="text-xs uppercase font-semibold tracking-widest text-slate-400 mb-1">
              Handcrafted Celebration For
            </span>

            {/* Recipient Name with Shimmering Gradient */}
            <h1
              className={`text-3xl sm:text-5xl font-extrabold text-white mb-2 leading-tight ${theme.fontHeading} tracking-tight`}
            >
              {page.recipientName}
            </h1>

            {page.recipientNickname && (
              <p className="text-sm sm:text-base text-amber-300 italic mb-3">
                &ldquo;{page.recipientNickname}&rdquo;
              </p>
            )}

            <div className="flex items-center gap-2 text-xs text-slate-400 mb-6">
              <span>{page.relationship}</span>
              <span aria-hidden="true">·</span>
              <span className="capitalize">{page.occasion} Special Edition</span>
            </div>

            {/* Tap to Open CTA Button */}
            <motion.button
              whileHover={shouldReduceMotion ? undefined : { scale: 1.03 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
              onClick={handleOpen}
              disabled={breakingSeal}
              className={`w-full py-4 px-8 rounded-2xl text-sm font-bold flex items-center justify-center gap-3 transition-all cursor-pointer shadow-[0_10px_35px_rgba(245,158,11,0.35)] ${theme.primaryButton}`}
            >
              <PartyPopper className="h-4 w-4" />
              <span>{breakingSeal ? 'Unwrapping Celebration...' : 'Open Celebration Surprise'}</span>
            </motion.button>

            {/* Sound Notice Indicator */}
            <div className="mt-4 flex items-center gap-2 text-[11px] text-slate-400">
              <Volume2 className={`h-3.5 w-3.5 ${shouldReduceMotion ? '' : 'animate-pulse'}`} style={{ color: theme.palette.primary }} />
              <span>Music & audio effects prepared for you</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
