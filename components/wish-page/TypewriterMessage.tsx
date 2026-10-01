'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Quote,
  Sparkles,
  RotateCcw,
  Volume2,
  VolumeX,
  Zap,
  Play,
  Pause,
  Heart,
  Feather,
} from 'lucide-react';
import { WishPage } from '@/lib/types';
import { TEMPLATES } from './theme-config';

interface TypewriterMessageProps {
  page: WishPage;
}

export default function TypewriterMessage({ page }: TypewriterMessageProps) {
  const theme = TEMPLATES[page.template];
  const isHindi = page.language === 'hi' || page.paragraphs.some((p) => /[\u0900-\u097F]/.test(p));

  // Typing state
  const [currentParaIndex, setCurrentParaIndex] = useState(0);
  const [displayedChars, setDisplayedChars] = useState<number[]>(
    new Array(page.paragraphs.length).fill(0)
  );
  const [isTyping, setIsTyping] = useState(true);
  const [typingSpeed, setTypingSpeed] = useState<25 | 12 | 0>(25); // 25ms = 1x, 12ms = 2x, 0 = instant
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Soft key-tap sound effect using Web Audio API
  const playTapSound = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        // Random pitch around 800Hz-1200Hz for organic typewriter click
        osc.frequency.setValueAtTime(800 + Math.random() * 400, ctx.currentTime);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      }
    } catch {
      // AudioContext unavailable
    }
  };

  // Staged typewriter animation loop
  useEffect(() => {
    if (!hasStarted || !isTyping || isCompleted) return;

    if (typingSpeed === 0) {
      // Show all immediately
      const timer = setTimeout(() => {
        setDisplayedChars(page.paragraphs.map((p) => p.length));
        setIsCompleted(true);
      }, 0);
      return () => clearTimeout(timer);
    }

    const currentParagraph = page.paragraphs[currentParaIndex];
    if (!currentParagraph) {
      const timer = setTimeout(() => {
        setIsCompleted(true);
      }, 0);
      return () => clearTimeout(timer);
    }

    const interval = setInterval(() => {
      setDisplayedChars((prev) => {
        const next = [...prev];
        const currentCount = next[currentParaIndex] || 0;

        if (currentCount < currentParagraph.length) {
          next[currentParaIndex] = currentCount + 1;
          if (currentCount % 3 === 0) playTapSound();
          return next;
        } else {
          // Finished this paragraph, advance to next
          if (currentParaIndex < page.paragraphs.length - 1) {
            setCurrentParaIndex((idx) => idx + 1);
          } else {
            setIsCompleted(true);
          }
          return next;
        }
      });
    }, typingSpeed);

    return () => clearInterval(interval);
  }, [hasStarted, isTyping, currentParaIndex, typingSpeed, page.paragraphs, isCompleted, soundEnabled]);

  const handleStartTyping = () => {
    setHasStarted(true);
    setIsTyping(true);
  };

  const handleReplay = () => {
    setCurrentParaIndex(0);
    setDisplayedChars(new Array(page.paragraphs.length).fill(0));
    setIsCompleted(false);
    setIsTyping(true);
    setHasStarted(true);
  };

  const handleInstantReveal = () => {
    setDisplayedChars(page.paragraphs.map((p) => p.length));
    setIsCompleted(true);
    setIsTyping(false);
  };

  return (
    <section className="relative py-24 px-4 sm:px-6 max-w-4xl mx-auto">
      {/* Dynamic ambient halo behind the letter card */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-yellow-500/15 blur-[120px] pointer-events-none rounded-full" />

      {/* Floating Animated Sparks */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ y: [-10, 10, -10], opacity: [0.3, 0.7, 0.3] }}
          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
          className="absolute top-10 left-8 text-amber-400/40 text-xl"
        >
          ✦
        </motion.div>
        <motion.div
          animate={{ y: [12, -12, 12], opacity: [0.2, 0.6, 0.2] }}
          transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 1 }}
          className="absolute bottom-16 right-10 text-pink-400/40 text-lg"
        >
          ★
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        onViewportEnter={() => {
          if (!hasStarted) handleStartTyping();
        }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className={`relative rounded-3xl p-8 sm:p-14 border ${theme.cardBorder} ${theme.cardBg} transition-all duration-500 shadow-2xl backdrop-blur-2xl overflow-hidden`}
      >
        {/* Animated Moving Gradient Border Beam */}
        <div className="absolute inset-0 rounded-3xl border border-amber-400/20 pointer-events-none" />

        {/* Ambient Top Lighting Line */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />

        {/* Floating Sinusoidal Quote Icon */}
        <motion.div
          animate={{ y: [0, -8, 0], rotate: [0, 2, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
          className="absolute top-8 right-8 opacity-15 pointer-events-none text-white"
        >
          <Quote className="h-20 w-20" />
        </motion.div>

        {/* Letter Top Header with Live Animation Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-white/10 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-amber-300">
                A Letter From The Heart
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Personalized heartfelt dedication for {page.recipientName}
            </p>
          </div>

          {/* Interactive Player Controls for Typewriter */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/5 border border-white/10 shrink-0 self-start sm:self-auto backdrop-blur-md">
            {/* Play/Pause */}
            <button
              type="button"
              onClick={() => setIsTyping(!isTyping)}
              className="p-1.5 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white transition"
              title={isTyping ? 'Pause typing' : 'Resume typing'}
            >
              {isTyping ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            </button>

            {/* Sound Toggle */}
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-1.5 rounded-xl transition ${
                soundEnabled ? 'text-amber-400 bg-amber-400/10' : 'text-slate-400 hover:text-white'
              }`}
              title={soundEnabled ? 'Mute typing sound' : 'Enable typewriter sound'}
            >
              {soundEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
            </button>

            {/* Speed Toggle (1x / 2x) */}
            <button
              type="button"
              onClick={() => setTypingSpeed((s) => (s === 25 ? 12 : 25))}
              className="px-2 py-1 rounded-xl text-[10px] font-mono text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 transition"
              title="Change typing speed"
            >
              {typingSpeed === 12 ? '2x' : '1x'}
            </button>

            {/* Instant Reveal */}
            <button
              type="button"
              onClick={handleInstantReveal}
              className="px-2 py-1 rounded-xl text-[10px] font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition flex items-center gap-1"
              title="Reveal all text"
            >
              <Zap className="h-3 w-3 text-amber-400" />
              <span>Instant</span>
            </button>

            {/* Replay */}
            <button
              type="button"
              onClick={handleReplay}
              className="p-1.5 rounded-xl hover:bg-white/10 text-slate-300 hover:text-amber-400 transition"
              title="Replay from start"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Letter Title with Gold Shimmer */}
        <h2
          className={`text-2xl sm:text-4xl font-black mb-8 ${theme.fontHeading} ${
            isHindi ? 'font-hindi' : ''
          } text-white tracking-tight drop-shadow-md`}
        >
          {page.letterTitle || 'To Someone Truly Special'}
        </h2>

        {/* Animated Paragraphs with Progressive Typing */}
        <div
          className={`space-y-6 text-base sm:text-xl leading-relaxed ${theme.textBody} ${
            isHindi ? 'font-hindi font-medium' : ''
          }`}
        >
          {page.paragraphs.map((para, idx) => {
            const charsRevealed = displayedChars[idx] || 0;
            const isCurrentlyTypingThis = isTyping && idx === currentParaIndex && !isCompleted;
            const visibleText = para.slice(0, charsRevealed);

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: charsRevealed > 0 ? 1 : 0.2, x: 0 }}
                transition={{ duration: 0.4 }}
                className="relative pl-5 border-l-2 border-amber-400/60 transition-colors"
              >
                <span>{visibleText}</span>

                {/* Animated Glowing Typing Cursor */}
                {isCurrentlyTypingThis && (
                  <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ repeat: Infinity, duration: 0.7 }}
                    className="inline-block w-2 h-5 bg-amber-400 ml-1 rounded-sm align-middle shadow-[0_0_8px_#f59e0b]"
                  />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Wax Seal & Personalized Signature Footer */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-400"
        >
          <div className="flex items-center gap-3">
            {/* Wax Seal Emblem */}
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/20 border border-amber-200 shrink-0">
              <Heart className="h-4 w-4 fill-slate-950" />
            </div>
            <div>
              <span className="text-white font-bold block text-sm">
                Dedicated to {page.recipientName}
              </span>
              <span className="text-[11px] text-amber-300/80">Archived with perpetual love</span>
            </div>
          </div>

          <div className="flex items-center gap-2 italic text-slate-300 font-serif sm:text-right">
            <Feather className="h-4 w-4 text-amber-400 shrink-0" />
            <span>&ldquo;With endless affection & proudest wishes&rdquo;</span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
