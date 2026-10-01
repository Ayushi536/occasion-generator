'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart, Gift, Volume2, Star, PartyPopper } from 'lucide-react';
import confetti from 'canvas-confetti';
import { WishPage } from '@/lib/types';
import { TEMPLATES } from './theme-config';

interface IntroCurtainProps {
  page: WishPage;
  onBegin: () => void;
}

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
      particleCount: 85,
      spread: 75,
      origin: { y: 0.52 },
      colors: theme.confettiColors || ['#f59e0b', '#ec4899', '#3b82f6', '#ffd700'],
    });

    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0.2, y: 0.6 },
        colors: ['#ffd700', '#ffffff', '#f43f5e'],
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 0.8, y: 0.6 },
        colors: ['#ffd700', '#ffffff', '#06b6d4'],
      });
    }, 200);

    setTimeout(() => {
      setOpened(true);
      onBegin();
    }, 950);
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
          transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#05070d]/98 backdrop-blur-2xl p-6 text-center select-none overflow-hidden"
        >
          {/* Animated Atmospheric Background Glow Orbs */}
          <motion.div
            animate={{
              scale: [1, 1.25, 1],
              opacity: [0.25, 0.45, 0.25],
            }}
            transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
            className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/0 blur-[140px] pointer-events-none"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.25, 0.4, 0.25],
            }}
            transition={{ repeat: Infinity, duration: 7, ease: 'easeInOut' }}
            className="absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full bg-gradient-to-tl from-pink-500/25 to-purple-600/0 blur-[140px] pointer-events-none"
          />

          {/* Floating Atmospheric Stardust Particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
            {particles.map((p) => (
              <motion.div
                key={p.id}
                animate={{
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
                }}
                className="absolute rounded-full bg-amber-300 shadow-[0_0_10px_#fde047]"
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
              animate={{ y: [-3, 3, -3] }}
              transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-amber-400/30 text-amber-300 text-xs font-semibold tracking-widest uppercase mb-6 backdrop-blur-md shadow-[0_0_20px_rgba(245,158,11,0.2)]"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span>A Personal Celebration Gift</span>
              <Sparkles className="h-3.5 w-3.5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
            </motion.div>

            {/* The 3D Floating Envelope with Levitation & Light Rays */}
            <motion.div
              animate={{
                y: breakingSeal ? [0, -10, 0] : [-8, 8, -8],
                rotate: breakingSeal ? 0 : [-1.2, 1.2, -1.2],
              }}
              transition={{
                repeat: breakingSeal ? 0 : Infinity,
                duration: 4.2,
                ease: 'easeInOut',
              }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleOpen}
              className="relative mb-8 cursor-pointer group select-none"
            >
              {/* Rotating Light Sweep Aura Behind Envelope */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 18, ease: 'linear' }}
                className="absolute -inset-10 rounded-full bg-[conic-gradient(from_0deg,#ffd70022,#f43f5e22,#3b82f622,#ffd70022)] blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
              />

              {/* Envelope Main Body */}
              <div className="w-56 h-36 sm:w-64 sm:h-40 rounded-3xl border-2 border-amber-400/50 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950 shadow-[0_15px_50px_rgba(0,0,0,0.8),0_0_40px_rgba(245,197,24,0.25)] flex flex-col items-center justify-center relative overflow-hidden group-hover:border-amber-400 transition-all duration-300">
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
                <div className="absolute inset-y-0 w-7 bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-600 shadow-md flex items-center justify-center">
                  <div className="w-[1px] h-full bg-white/60" />
                </div>
                <div className="absolute inset-x-0 h-7 bg-gradient-to-b from-amber-500 via-yellow-300 to-amber-600 shadow-md flex items-center justify-center">
                  <div className="h-[1px] w-full bg-white/60" />
                </div>

                {/* Golden Wax Seal Centerpiece with Celestial Rings */}
                <motion.div
                  animate={
                    breakingSeal
                      ? { scale: [1, 1.4, 0], rotate: 180, opacity: [1, 1, 0] }
                      : { scale: [1, 1.08, 1] }
                  }
                  transition={
                    breakingSeal
                      ? { duration: 0.65, ease: 'easeIn' }
                      : { repeat: Infinity, duration: 2.5, ease: 'easeInOut' }
                  }
                  className="relative z-20 h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-gradient-to-br from-yellow-300 via-amber-500 to-amber-700 shadow-[0_0_30px_rgba(245,158,11,0.6)] flex items-center justify-center border-2 border-yellow-200"
                >
                  {/* Rotating Celestial Dashed Ring */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 12, ease: 'linear' }}
                    className="absolute -inset-2.5 rounded-full border border-dashed border-yellow-300/60 pointer-events-none"
                  />

                  {/* Wax Seal Icon */}
                  {page.occasion === 'anniversary' || page.occasion === 'love' ? (
                    <Heart className="h-8 w-8 text-slate-950 fill-slate-950 drop-shadow" />
                  ) : page.occasion === 'birthday' ? (
                    <Gift className="h-8 w-8 text-slate-950 drop-shadow" />
                  ) : (
                    <Sparkles className="h-8 w-8 text-slate-950 drop-shadow" />
                  )}

                  {/* Specular Glint Reflection */}
                  <div className="absolute top-1.5 left-2.5 w-3 h-2 rounded-full bg-white/60 -rotate-45 blur-[0.5px]" />
                </motion.div>

                {/* Shimmer prompt tag */}
                <div className="absolute bottom-2 z-10">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-amber-300 font-bold drop-shadow">
                    ✦ TAP TO BREAK SEAL ✦
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
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleOpen}
              disabled={breakingSeal}
              className={`w-full py-4 px-8 rounded-2xl text-sm font-bold flex items-center justify-center gap-3 transition-all cursor-pointer shadow-[0_10px_35px_rgba(245,158,11,0.35)] ${theme.primaryButton}`}
            >
              <PartyPopper className="h-4 w-4" />
              <span>{breakingSeal ? 'Unwrapping Celebration...' : 'Open Celebration Surprise'}</span>
            </motion.button>

            {/* Sound Notice Indicator */}
            <div className="mt-4 flex items-center gap-2 text-[11px] text-slate-400">
              <Volume2 className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
              <span>Music & audio effects prepared for you</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
