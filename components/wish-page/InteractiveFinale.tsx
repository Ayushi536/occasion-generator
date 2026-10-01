'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Flame,
  Heart,
  RotateCcw,
  Cake,
  Award,
  Crown,
  Zap,
  PartyPopper,
  Star,
  CheckCircle2,
} from 'lucide-react';
import { WishPage } from '@/lib/types';
import { TEMPLATES } from './theme-config';

interface InteractiveFinaleProps {
  page: WishPage;
}

type CakeStyle =
  | 'strawberry-velvet'
  | 'royal-gold'
  | 'rose-petal'
  | 'cyber-neon'
  | 'chocolate-truffle'
  | 'rainbow-celestial';

type CandleStyle = 'striped' | 'sparkler' | 'milestone' | 'heart' | 'cosmic';

export default function InteractiveFinale({ page }: InteractiveFinaleProps) {
  const theme = TEMPLATES[page.template] || TEMPLATES['neon-night'];
  const [candlesBlown, setCandlesBlown] = useState(false);
  const [candlesCount, setCandlesCount] = useState(page.candlesCount || 0);
  const [isBlowing, setIsBlowing] = useState(false);

  // User customizable cake design & candle style
  const [cakeStyle, setCakeStyle] = useState<CakeStyle>('strawberry-velvet');
  const [candleStyle, setCandleStyle] = useState<CandleStyle>('striped');
  const [candleNumber, setCandleNumber] = useState<number>(5);

  // Floating Balloons array for after-blowing animation
  const [balloons, setBalloons] = useState<
    Array<{ id: number; color: string; left: number; delay: number; scale: number; popped: boolean }>
  >([]);

  // Fireworks rockets array
  const [fireworks, setFireworks] = useState<
    Array<{ id: number; left: number; top: number; color: string; size: number }>
  >([]);

  // Milestone number string (e.g. '25' or '5')
  const milestoneNum = page.ageOrYears?.match(/\d+/)?.[0] || '25';

  // Sound effect for blowing breath + triumphant fanfare using Web Audio API
  const playBlowAndFanfareSound = () => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const now = ctx.currentTime;

        // 1. Whoosh gust sound for breath blowing
        const bufferSize = ctx.sampleRate * 0.45;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }
        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, now);
        filter.frequency.exponentialRampToValueAtTime(100, now + 0.4);
        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.25, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        whiteNoise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(ctx.destination);
        whiteNoise.start(now);
        whiteNoise.stop(now + 0.4);

        // 2. Triumphant Fanfare Chords after 0.35s (Major celebration fanfare)
        const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5, 1567.98]; // C5, E5, G5, C6, E6, G6
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + 0.35 + i * 0.08);
          gain.gain.setValueAtTime(0.18, now + 0.35 + i * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35 + i * 0.08 + 1.8);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + 0.35 + i * 0.08);
          osc.stop(now + 0.35 + i * 0.08 + 1.8);
        });
      }
    } catch {
      // AudioContext unavailable
    }
  };

  const handlePopBalloon = (id: number) => {
    setBalloons((prev) =>
      prev.map((b) => (b.id === id ? { ...b, popped: true } : b))
    );
    // Balloon pop sound
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(180, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      }
    } catch {
      // Ignore
    }
  };

  const handleBlowCandles = async () => {
    if (isBlowing) return;
    setIsBlowing(true);
    setCandlesBlown(true);
    playBlowAndFanfareSound();

    // 1. Generate 22 vibrant rising helium balloons
    const balloonColors = [
      '#f43f5e',
      '#ec4899',
      '#8b5cf6',
      '#3b82f6',
      '#06b6d4',
      '#10b981',
      '#f59e0b',
      '#fbbf24',
      '#ffd700',
    ];
    const newBalloons = new Array(22).fill(0).map((_, i) => ({
      id: i,
      color: balloonColors[i % balloonColors.length],
      left: 3 + Math.random() * 94,
      delay: Math.random() * 1.2,
      scale: 0.7 + Math.random() * 0.6,
      popped: false,
    }));
    setBalloons(newBalloons);

    // 2. Multi-stage canvas confetti & fireworks explosions
    const end = Date.now() + 3.8 * 1000;
    const colors = ['#f59e0b', '#ec4899', '#06b6d4', '#8b5cf6', '#ffffff', '#ffd700'];

    // Left cannon
    confetti({
      particleCount: 90,
      spread: 80,
      angle: 60,
      origin: { x: 0.1, y: 0.7 },
      colors,
    });

    // Right cannon
    confetti({
      particleCount: 90,
      spread: 80,
      angle: 120,
      origin: { x: 0.9, y: 0.7 },
      colors,
    });

    // Continuous starry fireworks burst interval
    const interval = setInterval(() => {
      if (Date.now() > end) {
        clearInterval(interval);
        return;
      }
      confetti({
        particleCount: 22,
        startVelocity: 35,
        spread: 360,
        ticks: 70,
        origin: { x: 0.15 + Math.random() * 0.7, y: 0.15 + Math.random() * 0.45 },
        colors,
      });
    }, 240);

    // Record celebration count in DB
    try {
      const res = await fetch(`/api/w/${page.slug}/candle`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setCandlesCount(data.count);
      } else {
        setCandlesCount((c) => c + 1);
      }
    } catch {
      setCandlesCount((c) => c + 1);
    } finally {
      setIsBlowing(false);
    }
  };

  const handleRelight = () => {
    setCandlesBlown(false);
    setBalloons([]);
  };

  const isBirthday = page.occasion === 'birthday';
  const isAnniversary = page.occasion === 'anniversary' || page.occasion === 'love';

  return (
    <section className="relative py-24 px-4 sm:px-6 max-w-5xl mx-auto text-center overflow-hidden select-none">
      {/* Background celebration spotlight & luminous ambiance */}
      <div
        className={`absolute inset-0 bg-gradient-to-t ${theme.accentGlow} to-transparent pointer-events-none opacity-40`}
      />

      {/* ULTRA-ANIMATED BALLOONS ASCENSION AFTER BLOWING */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-30">
        <AnimatePresence>
          {candlesBlown &&
            balloons.map(
              (b) =>
                !b.popped && (
                  <motion.div
                    key={b.id}
                    initial={{ y: '110vh', opacity: 0 }}
                    animate={{
                      y: '-25vh',
                      opacity: [0, 0.95, 0.95, 0],
                      x: [0, (b.id % 2 === 0 ? 20 : -20), (b.id % 2 === 0 ? -15 : 15), 0],
                    }}
                    exit={{ scale: 1.4, opacity: 0 }}
                    transition={{
                      duration: 6 + (b.id % 3) * 1.5,
                      delay: b.delay,
                      ease: 'easeOut',
                    }}
                    style={{
                      left: `${b.left}%`,
                      transform: `scale(${b.scale})`,
                    }}
                    className="absolute flex flex-col items-center pointer-events-auto cursor-pointer group"
                    onClick={() => handlePopBalloon(b.id)}
                    title="Tap to pop balloon!"
                  >
                    {/* Balloon Body */}
                    <div
                      className="w-12 h-16 rounded-[50%_50%_50%_50%_/_40%_40%_60%_60%] shadow-xl relative flex items-center justify-center group-hover:scale-110 transition-transform"
                      style={{ backgroundColor: b.color }}
                    >
                      {/* Specular light highlight */}
                      <div className="absolute top-2 left-2.5 w-3 h-4 rounded-full bg-white/40 -rotate-12" />
                      <Sparkles className="h-4 w-4 text-white/80" />
                    </div>
                    {/* Balloon knot & waving string */}
                    <div className="w-2 h-1.5 rounded-full" style={{ backgroundColor: b.color }} />
                    <motion.div
                      animate={{ rotate: [-8, 8, -8] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                      className="w-0.5 h-16 bg-white/40"
                    />
                  </motion.div>
                )
            )}
        </AnimatePresence>
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Occasion Finale Header */}
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-3">
          <PartyPopper className="h-4 w-4" />
          <span>Interactive Grand Finale Climax</span>
        </div>

        <h2 className={`text-3xl sm:text-5xl font-black text-white mb-3 ${theme.fontHeading} tracking-tight`}>
          {isBirthday
            ? 'Make a Wish & Blow the Candles!'
            : isAnniversary
            ? 'Ignite the Eternal Flame of Love'
            : 'Unleash the Grand Celebration!'}
        </h2>

        <p className="text-xs sm:text-base text-slate-300 max-w-lg mb-6">
          Close your eyes, hold your warmest wish in your heart, customize the cake below, and tap to blow out the candles!
        </p>

        {/* 1. CAKE DESIGN SELECTOR TOOLBAR (6 Unique Designs) */}
        <div className="w-full max-w-2xl mx-auto mb-6 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Cake className="h-3.5 w-3.5 text-amber-400" />
              <span>Choose Cake Design:</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">6 Styles</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { id: 'strawberry-velvet', name: '🍓 Strawberry Royale', color: 'from-rose-500 to-pink-600' },
              { id: 'royal-gold', name: '👑 24K Imperial Gold', color: 'from-amber-400 to-yellow-600 text-slate-950' },
              { id: 'rose-petal', name: '💖 Rose Romance', color: 'from-pink-400 to-rose-400 text-slate-950' },
              { id: 'cyber-neon', name: '⚡ Cyberpunk Neon', color: 'from-cyan-400 to-blue-500 text-slate-950' },
              { id: 'chocolate-truffle', name: '🍫 Belgian Truffle', color: 'from-amber-900 to-stone-900 text-amber-200' },
              { id: 'rainbow-celestial', name: '🦄 Celestial Rainbow', color: 'from-purple-400 via-pink-400 to-cyan-400 text-slate-950' },
            ].map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCakeStyle(c.id as CakeStyle)}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center cursor-pointer ${
                  cakeStyle === c.id
                    ? `bg-gradient-to-r ${c.color} shadow-lg scale-102 border border-white/40`
                    : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>{c.name}</span>
              </button>
            ))}
          </div>

          {/* 2. CANDLE STYLE SELECTOR TOOLBAR (5 Unique Designs) */}
          <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Flame className="h-3.5 w-3.5 text-amber-400" />
              <span>Candles Style:</span>
            </span>

            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'striped', label: '🕯️ Classic Striped' },
                { id: 'sparkler', label: '✨ Sparkler Fireworks' },
                { id: 'milestone', label: `#${milestoneNum} Milestone` },
                { id: 'heart', label: '💖 Heart Flame' },
                { id: 'cosmic', label: '🪄 Cosmic Neon' },
              ].map((cs) => (
                <button
                  key={cs.id}
                  type="button"
                  onClick={() => setCandleStyle(cs.id as CandleStyle)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                    candleStyle === cs.id
                      ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                      : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {cs.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 3. THE INTERACTIVE CAKE & CANDLE CENTERPIECE */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="relative my-6 flex flex-col items-center justify-center cursor-pointer select-none"
          onClick={candlesBlown ? handleRelight : handleBlowCandles}
          title={candlesBlown ? 'Click to Relight Candles' : 'Click to Blow Candles!'}
        >
          {/* Candle & Flame Row */}
          <div className="flex items-end justify-center gap-4 sm:gap-6 mb-2">
            {candleStyle === 'milestone' ? (
              // Milestone Number Candles (e.g. '25')
              <div className="flex items-center gap-3">
                {milestoneNum.split('').map((char, charIdx) => (
                  <div key={charIdx} className="flex flex-col items-center">
                    {/* Flame */}
                    <AnimatePresence>
                      {!candlesBlown ? (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{
                            scale: [1, 1.25, 0.95, 1.2, 1],
                            opacity: [0.9, 1, 0.85, 1, 0.9],
                            y: [0, -3, 1, -2, 0],
                          }}
                          exit={{ scale: 0, opacity: 0, y: -20 }}
                          transition={{ repeat: Infinity, duration: 1.2 + charIdx * 0.2 }}
                          className="h-10 w-7 rounded-full bg-gradient-to-t from-amber-500 via-orange-400 to-yellow-100 shadow-[0_0_25px_#f59e0b] relative flex items-center justify-center"
                        >
                          <div className="h-5 w-2 rounded-full bg-white blur-[1px]" />
                        </motion.div>
                      ) : (
                        // Volumetric Animated Rising Smoke Trail
                        <motion.div
                          initial={{ opacity: 0.9, y: 0, scale: 0.8 }}
                          animate={{ opacity: 0, y: -45, x: charIdx === 0 ? -15 : 15, scale: 1.8 }}
                          transition={{ duration: 2.2 }}
                          className="text-base select-none"
                        >
                          💨
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Number Candle Body */}
                    <div className="px-4 py-2 mt-1 rounded-xl bg-gradient-to-b from-amber-200 via-amber-300 to-amber-500 text-slate-950 font-black text-2xl sm:text-3xl font-syne border-2 border-white/60 shadow-xl shadow-amber-500/30">
                      {char}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // 5 Candles with styled stems and flame dynamics
              [1, 2, 3, 4, 5].map((candleIndex) => (
                <div key={candleIndex} className="flex flex-col items-center">
                  <AnimatePresence>
                    {!candlesBlown ? (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{
                          scale:
                            candleStyle === 'sparkler'
                              ? [1, 1.4, 1.05, 1.45, 1]
                              : candleStyle === 'cosmic'
                              ? [1, 1.3, 0.9, 1.35, 1]
                              : [1, 1.2, 0.95, 1.15, 1],
                          opacity: [0.9, 1, 0.85, 1, 0.9],
                          y: [0, -3, 1, -2, 0],
                        }}
                        exit={{ scale: 0, opacity: 0, y: -20 }}
                        transition={{
                          repeat: Infinity,
                          duration:
                            candleStyle === 'sparkler'
                              ? 0.5
                              : 1.1 + candleIndex * 0.18,
                          ease: 'easeInOut',
                        }}
                        className={`rounded-full relative flex items-center justify-center ${
                          candleStyle === 'sparkler'
                            ? 'h-10 w-7 bg-gradient-to-t from-yellow-400 via-white to-amber-200 shadow-[0_0_30px_#fde047]'
                            : candleStyle === 'cosmic'
                            ? 'h-9 w-6 bg-gradient-to-t from-cyan-400 via-purple-300 to-white shadow-[0_0_25px_#06b6d4]'
                            : candleStyle === 'heart'
                            ? 'h-9 w-6 bg-gradient-to-t from-rose-500 via-pink-400 to-yellow-100 shadow-[0_0_25px_#f43f5e]'
                            : 'h-8 w-5 bg-gradient-to-t from-amber-500 via-orange-400 to-yellow-200 shadow-[0_0_18px_#f59e0b]'
                        }`}
                      >
                        <div className="h-3 w-1.5 rounded-full bg-white blur-[1px]" />
                        {candleStyle === 'sparkler' && (
                          <div className="absolute -inset-1.5 rounded-full border border-yellow-300 animate-ping opacity-60" />
                        )}
                        {candleStyle === 'heart' && (
                          <Heart className="h-3 w-3 text-white fill-white absolute" />
                        )}
                      </motion.div>
                    ) : (
                      // Volumetric Animated Smoke Trails
                      <motion.div
                        initial={{ opacity: 0.9, y: 0, scale: 0.7 }}
                        animate={{
                          opacity: 0,
                          y: -45,
                          x: candleIndex % 2 === 0 ? 14 : -14,
                          scale: 2,
                        }}
                        transition={{ duration: 2.2, ease: 'easeOut' }}
                        className="text-base select-none pointer-events-none"
                      >
                        💨
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Candle Stick */}
                  <div
                    className={`w-3.5 h-11 rounded-sm mt-1 shadow-md border border-white/20 ${
                      candleStyle === 'sparkler'
                        ? 'bg-gradient-to-b from-yellow-300 via-amber-400 to-amber-600'
                        : candleStyle === 'cosmic'
                        ? 'bg-gradient-to-b from-cyan-400 via-indigo-500 to-purple-600'
                        : candleStyle === 'heart'
                        ? 'bg-gradient-to-b from-pink-300 via-rose-400 to-rose-600'
                        : candleIndex % 2 === 0
                        ? 'bg-gradient-to-b from-pink-400 via-rose-500 to-pink-600'
                        : 'bg-gradient-to-b from-cyan-400 via-blue-500 to-cyan-600'
                    }`}
                  />
                </div>
              ))
            )}
          </div>

          {/* DIVERSE CAKE ARCHITECTURE & TIERS */}
          <div className="relative flex flex-col items-center">
            {/* Top Tier Platform */}
            <div
              className={`w-48 sm:w-56 h-12 rounded-t-2xl relative flex items-center justify-center border-t-2 shadow-lg transition-all duration-500 ${
                cakeStyle === 'royal-gold'
                  ? 'bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 border-amber-400'
                  : cakeStyle === 'strawberry-velvet'
                  ? 'bg-gradient-to-r from-rose-200 via-white to-rose-200 border-rose-300'
                  : cakeStyle === 'chocolate-truffle'
                  ? 'bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 border-amber-700'
                  : cakeStyle === 'rainbow-celestial'
                  ? 'bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 border-purple-300'
                  : cakeStyle === 'rose-petal'
                  ? 'bg-gradient-to-r from-pink-200 via-rose-100 to-pink-200 border-pink-300'
                  : 'bg-slate-900 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
              }`}
            >
              {cakeStyle === 'strawberry-velvet' && (
                <div className="flex gap-4 text-base">
                  <span>🍓</span>
                  <span>🍓</span>
                  <span>🍓</span>
                </div>
              )}
              {cakeStyle === 'royal-gold' && <Crown className="h-5 w-5 text-amber-400" />}
              {cakeStyle === 'rose-petal' && <span className="text-sm">🌹 🌹 🌹</span>}
              {cakeStyle === 'chocolate-truffle' && <span className="text-sm">🍫 🌰 🍫</span>}
              {cakeStyle === 'rainbow-celestial' && <span className="text-sm">⭐ 🌈 ⭐</span>}
              {cakeStyle === 'cyber-neon' && <Zap className="h-4 w-4 text-cyan-400" />}
            </div>

            {/* Main Tier Platform */}
            <div
              className={`w-72 sm:w-96 h-24 rounded-t-3xl border-t-4 relative flex items-center justify-center overflow-hidden shadow-2xl transition-all duration-500 ${
                cakeStyle === 'strawberry-velvet'
                  ? 'bg-gradient-to-r from-rose-900 via-pink-800 to-rose-900 border-rose-400'
                  : cakeStyle === 'royal-gold'
                  ? 'bg-gradient-to-r from-black via-slate-900 to-black border-amber-400 shadow-[0_0_35px_rgba(212,175,55,0.3)]'
                  : cakeStyle === 'rose-petal'
                  ? 'bg-gradient-to-r from-pink-300 via-rose-200 to-pink-300 border-pink-400'
                  : cakeStyle === 'chocolate-truffle'
                  ? 'bg-gradient-to-r from-stone-950 via-amber-950 to-stone-950 border-amber-600'
                  : cakeStyle === 'rainbow-celestial'
                  ? 'bg-gradient-to-r from-purple-950 via-slate-900 to-pink-950 border-pink-400'
                  : 'bg-slate-950 border-cyan-400 shadow-[0_0_35px_rgba(6,182,212,0.4)]'
              }`}
            >
              {/* Decorative Frosting Glaze & Text */}
              {cakeStyle === 'strawberry-velvet' && (
                <div className="absolute top-0 left-0 right-0 h-4 bg-white/40 rounded-b-xl" />
              )}
              {cakeStyle === 'cyber-neon' && (
                <div className="absolute inset-0 border-b-2 border-cyan-400/50 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:12px_12px] opacity-40" />
              )}

              {/* Center Cake Dedication Tag */}
              <div className="flex items-center gap-2 font-bold text-sm tracking-wide z-10">
                {cakeStyle === 'royal-gold' ? (
                  <div className="text-amber-300 flex items-center gap-1.5 font-cinzel text-base tracking-widest">
                    <span>👑</span>
                    <span>FOR {page.recipientName.toUpperCase()}</span>
                    <span>👑</span>
                  </div>
                ) : cakeStyle === 'rose-petal' ? (
                  <div className="text-pink-900 flex items-center gap-1.5 font-serif italic text-base">
                    <Heart className="h-4 w-4 fill-pink-600 text-pink-600" />
                    <span>Cherished Forever, {page.recipientName}</span>
                    <Heart className="h-4 w-4 fill-pink-600 text-pink-600" />
                  </div>
                ) : cakeStyle === 'chocolate-truffle' ? (
                  <div className="text-amber-200 flex items-center gap-2 font-serif text-sm">
                    <span>✨</span>
                    <span>Pure Joy for {page.recipientName}</span>
                    <span>✨</span>
                  </div>
                ) : cakeStyle === 'rainbow-celestial' ? (
                  <div className="text-white flex items-center gap-1.5 font-bold text-sm tracking-wide">
                    <span>⭐</span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-300 to-cyan-300">
                      Happy Celebration, {page.recipientName}!
                    </span>
                    <span>⭐</span>
                  </div>
                ) : cakeStyle === 'cyber-neon' ? (
                  <div className="text-cyan-300 font-mono tracking-wider flex items-center gap-1.5">
                    <Zap className="h-4 w-4 text-cyan-400" />
                    <span>CELEBRATE_{page.recipientName.toUpperCase()}</span>
                  </div>
                ) : (
                  <div className="text-white flex items-center gap-2 font-bold">
                    <Sparkles className="h-4 w-4 text-amber-300" />
                    <span>Happy Celebration, {page.recipientName}!</span>
                    <Sparkles className="h-4 w-4 text-amber-300" />
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Platter Base */}
            <div
              className={`w-80 sm:w-[420px] h-5 rounded-full border-2 shadow-2xl ${
                cakeStyle === 'royal-gold'
                  ? 'bg-amber-950/80 border-amber-400'
                  : cakeStyle === 'cyber-neon'
                  ? 'bg-slate-900 border-cyan-400'
                  : 'bg-slate-900 border-white/20'
              }`}
            />
          </div>

          {/* ULTRA-ANIMATED GRAND HOLOGRAPHIC BADGE DESCENDING */}
          <AnimatePresence>
            {candlesBlown && (
              <motion.div
                initial={{ opacity: 0, scale: 0.2, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: 'spring', damping: 12, stiffness: 180 }}
                className="absolute -top-20 left-1/2 -translate-x-1/2 z-40 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 font-black py-3 px-8 rounded-full shadow-[0_0_45px_rgba(245,158,11,0.7)] border-2 border-white flex items-center gap-2.5 whitespace-nowrap text-sm sm:text-base font-syne tracking-wide"
              >
                <Sparkles className="h-5 w-5 fill-slate-950 animate-spin" style={{ animationDuration: '4s' }} />
                <span>✦ WISH GRANTED! CELEBRATION UNLEASHED ✦</span>
                <Sparkles className="h-5 w-5 fill-slate-950 animate-spin" style={{ animationDuration: '4s' }} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Action Button */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={candlesBlown ? handleRelight : handleBlowCandles}
            disabled={isBlowing}
            className={`py-4 px-10 rounded-2xl text-sm font-bold flex items-center justify-center gap-2.5 transition cursor-pointer shadow-2xl hover:scale-105 active:scale-95 ${theme.primaryButton}`}
          >
            {candlesBlown ? (
              <>
                <Flame className="h-4 w-4 text-amber-500 fill-amber-500" />
                <span>Relight Candles & Wish Again</span>
              </>
            ) : (
              <>
                <PartyPopper className="h-4 w-4" />
                <span>Tap Cake to Blow Candles & Celebrate!</span>
              </>
            )}
          </button>
        </div>

        {/* Live Celebration Counter */}
        <div className="mt-5 flex items-center gap-1.5 text-xs text-slate-400 font-mono">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          <span>Celebrated</span>
          <span className="font-bold text-white tabular-nums px-1.5 py-0.5 bg-white/10 rounded border border-white/10">
            {candlesCount}
          </span>
          <span>times worldwide</span>
        </div>
      </div>
    </section>
  );
}
