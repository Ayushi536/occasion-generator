'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Volume2, VolumeX, ChevronDown, Sparkles, Heart, Star, Zap } from 'lucide-react';
import { WishPage } from '@/lib/types';
import { TEMPLATES, getOccasionDecoration } from './theme-config';

interface ParallaxHeroProps {
  page: WishPage;
  isPlayingMusic: boolean;
  onToggleMusic: () => void;
}

export default function ParallaxHero({ page, isPlayingMusic, onToggleMusic }: ParallaxHeroProps) {
  const theme = TEMPLATES[page.template] || TEMPLATES['neon-night'];
  const deco = getOccasionDecoration(page.occasion);

  // Staggered letters for anime.js kinetic typography effect
  const headlineWords = page.headline.split(' ');

  // Kinetic stardust particles array
  const [kineticParticles] = useState<
    Array<{ id: number; left: number; speed: number; size: number; delay: number; opacity: number }>
  >(() => {
    return Array.from({ length: 32 }).map((_, i) => ({
      id: i,
      left: ((i * 19) % 94) + 3,
      speed: 4 + (i % 4) * 1.2,
      size: 3 + (i % 3) * 1.5,
      delay: (i * 0.3) % 4,
      opacity: 0.3 + (i % 5) * 0.14,
    }));
  });

  return (
    <section className="relative min-h-[96vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden pt-12 pb-20 select-none">
      {/* 1. ANIME.JS STYLE BACKGROUND: Concentric Kinetic Energy Rings */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden" aria-hidden="true">
        {/* Outer Counter-Rotating Dashed Orbit Ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 40, ease: 'linear' }}
          className="w-[720px] h-[720px] sm:w-[920px] sm:h-[920px] rounded-full border border-dashed border-amber-400/20 absolute"
        />

        {/* Mid Golden Energy Ring with Cardinal Crosshairs */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 25, ease: 'linear' }}
          className="w-[500px] h-[500px] sm:w-[650px] sm:h-[650px] rounded-full border border-white/10 absolute flex items-center justify-center"
        >
          <div className="absolute top-0 w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_15px_#f59e0b]" />
          <div className="absolute bottom-0 w-3 h-3 rounded-full bg-pink-500 shadow-[0_0_15px_#ec4899]" />
          <div className="absolute left-0 w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_15px_#06b6d4]" />
          <div className="absolute right-0 w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_15px_#f59e0b]" />
        </motion.div>

        {/* Inner Pulsing Chroma Core */}
        <motion.div
          animate={{
            scale: [0.92, 1.08, 0.92],
            opacity: [0.35, 0.65, 0.35],
          }}
          transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
          className="w-[320px] h-[320px] sm:w-[450px] sm:h-[450px] rounded-full bg-gradient-to-r from-amber-500/15 via-pink-500/20 to-cyan-500/15 blur-[90px] absolute"
        />

        {/* Anime Speed Burst Rays (Radiating outward with pulse) */}
        <motion.div
          animate={{ opacity: [0.15, 0.35, 0.15], scale: [0.98, 1.02, 0.98] }}
          transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.6)_85%)] pointer-events-none"
        />
      </div>

      {/* 2. Kinetic Rising Floating Particles & Occasion Symbols */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {kineticParticles.map((kp) => (
          <motion.div
            key={kp.id}
            initial={{ y: '110vh', opacity: 0 }}
            animate={{
              y: '-10vh',
              opacity: [0, kp.opacity, kp.opacity, 0],
              x: [0, kp.id % 2 === 0 ? 25 : -25, 0],
            }}
            transition={{
              duration: kp.speed,
              repeat: Infinity,
              delay: kp.delay,
              ease: 'linear',
            }}
            style={{ left: `${kp.left}%` }}
            className="absolute rounded-full bg-gradient-to-t from-amber-400 to-yellow-200 shadow-[0_0_12px_#fbbf24]"
            style-width={`${kp.size}px`}
            style-height={`${kp.size}px`}
          />
        ))}

        {deco.floatingItems.map((emoji, idx) => {
          const randomLeft = (idx * 21 + 9) % 92;
          const duration = 7 + (idx % 3) * 2;
          const delay = (idx * 0.9) % 4;
          return (
            <motion.div
              key={`emoji-${idx}`}
              initial={{ y: '110vh', opacity: 0 }}
              animate={{
                y: '-12vh',
                opacity: [0, 0.85, 0.85, 0],
                rotate: [0, idx % 2 === 0 ? 360 : -360],
              }}
              transition={{
                duration,
                repeat: Infinity,
                delay,
                ease: 'easeInOut',
              }}
              style={{ left: `${randomLeft}%` }}
              className="absolute text-2xl sm:text-4xl select-none filter drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]"
            >
              {emoji}
            </motion.div>
          );
        })}
      </div>

      {/* 3. Floating Audio Controller with Live Animated Equalizer */}
      {page.audioTrack?.enabled && (
        <div className="absolute top-6 right-6 z-30">
          <button
            onClick={onToggleMusic}
            title={isPlayingMusic ? 'Mute Celebration Track' : 'Play Celebration Track'}
            className="flex items-center gap-2.5 rounded-full border border-amber-400/40 bg-black/60 px-4 py-2 text-xs font-semibold text-white backdrop-blur-xl transition hover:border-amber-400 hover:bg-black/80 shadow-[0_0_20px_rgba(245,158,11,0.25)] cursor-pointer group"
          >
            {isPlayingMusic ? (
              <>
                <Volume2 className="h-4 w-4 text-amber-400 animate-pulse" />
                <span className="text-[11px] text-amber-300 font-mono tracking-wider">AUDIO ON</span>
                {/* Anime-Style Equalizer Visualizer Bars */}
                <div className="flex gap-0.5 items-end h-3.5">
                  <motion.span
                    animate={{ height: ['4px', '14px', '6px', '12px', '4px'] }}
                    transition={{ repeat: Infinity, duration: 0.8, ease: 'easeInOut' }}
                    className="w-1 bg-amber-400 rounded-full"
                  />
                  <motion.span
                    animate={{ height: ['12px', '4px', '14px', '7px', '12px'] }}
                    transition={{ repeat: Infinity, duration: 0.7, ease: 'easeInOut', delay: 0.1 }}
                    className="w-1 bg-yellow-300 rounded-full"
                  />
                  <motion.span
                    animate={{ height: ['6px', '14px', '5px', '14px', '6px'] }}
                    transition={{ repeat: Infinity, duration: 0.9, ease: 'easeInOut', delay: 0.2 }}
                    className="w-1 bg-pink-400 rounded-full"
                  />
                  <motion.span
                    animate={{ height: ['10px', '5px', '12px', '4px', '10px'] }}
                    transition={{ repeat: Infinity, duration: 0.75, ease: 'easeInOut', delay: 0.3 }}
                    className="w-1 bg-cyan-400 rounded-full"
                  />
                </div>
              </>
            ) : (
              <>
                <VolumeX className="h-4 w-4 text-slate-400 group-hover:text-amber-400 transition" />
                <span className="text-[11px] text-slate-400 group-hover:text-slate-200">UNMUTE SOUND</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* 4. MAIN HERO STAGE: Next-Level Staggered Kinetic Typography */}
      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
        {/* Holographic Anime Badge */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0, y: -20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: 'spring', damping: 14, stiffness: 180, delay: 0.1 }}
          className="flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-amber-400/40 bg-gradient-to-r from-amber-500/20 via-pink-500/15 to-purple-500/20 text-xs font-bold uppercase tracking-widest text-amber-300 mb-6 backdrop-blur-xl shadow-[0_0_25px_rgba(245,158,11,0.3)]"
        >
          <Sparkles className="h-3.5 w-3.5 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
          <span>{deco.badge}</span>
          <span className="text-white/40">·</span>
          <span>{page.relationship}</span>
          {page.ageOrYears && (
            <>
              <span className="text-white/40">·</span>
              <span className="text-white px-2 py-0.5 rounded-full bg-amber-400/30 text-[10px] border border-amber-300/40">
                {page.ageOrYears}
              </span>
            </>
          )}
        </motion.div>

        {/* KINETIC STAGGERED HEADLINE (Anime.js Character Split Stagger) */}
        <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-2 mb-6 max-w-3xl">
          {headlineWords.map((word, wordIdx) => (
            <motion.span
              key={wordIdx}
              initial={{ opacity: 0, y: 35, rotateX: -60, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
              transition={{
                duration: 0.7,
                delay: 0.25 + wordIdx * 0.12,
                ease: [0.16, 1, 0.3, 1],
              }}
              className={`text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight inline-block ${theme.fontDisplay} ${
                page.template === 'neon-night'
                  ? 'neon-glow-cyan text-cyan-300'
                  : page.template === 'royal-gold'
                  ? 'gold-gradient-text'
                  : 'text-transparent bg-clip-text bg-gradient-to-r from-white via-rose-100 to-amber-200'
              }`}
              style={{ textWrap: 'balance' }}
            >
              {word}
            </motion.span>
          ))}
        </div>

        {/* Dedication Subheadline with Fluid Fade In */}
        {page.subheadline && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.65 }}
            className="text-base sm:text-xl text-slate-200 max-w-2xl font-light mb-10 leading-relaxed font-sans"
            style={{ textWrap: 'balance' }}
          >
            {page.subheadline}
          </motion.p>
        )}

        {/* Anime Kinetic Interactive Scroll Prompt */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.85 }}
          className="flex flex-col items-center gap-2 cursor-pointer pt-2 group"
          onClick={() => {
            window.scrollBy({ top: window.innerHeight * 0.85, behavior: 'smooth' });
          }}
        >
          <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-slate-400 group-hover:text-amber-300 transition">
            <span>Scroll To Begin The Story</span>
          </div>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
            className="h-10 w-6 rounded-full border-2 border-white/20 group-hover:border-amber-400 flex items-start justify-center p-1 transition"
          >
            <motion.div
              animate={{ y: [0, 14, 0] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
              className="w-1.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
