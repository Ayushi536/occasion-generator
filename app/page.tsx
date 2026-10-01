'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Sparkles,
  ArrowRight,
  Heart,
  Cake,
  Play,
  Share2,
  Lock,
  Volume2,
  Calendar,
  Gift,
  Eye,
  CheckCircle2,
  Wand2,
  RotateCw,
  Flame,
  Award,
  Layers,
  Film,
  MessageCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';

export default function HomePage() {
  const [unboxed, setUnboxed] = useState(false);
  const [heroTemplate, setHeroTemplate] = useState<'neon' | 'pastel' | 'royal'>('neon');

  // Interactive Live AI Wish Generator Lab State
  const [aiName, setAiName] = useState('Ananya');
  const [aiOccasion, setAiOccasion] = useState('birthday');
  const [aiTone, setAiTone] = useState<'emotional' | 'funny' | 'poetic'>('emotional');
  const [aiLang, setAiLang] = useState<'en' | 'hi' | 'hinglish'>('hinglish');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [generatedWish, setGeneratedWish] = useState<string>(
    'Happy 25th Birthday to my favorite human in the whole universe! From late-night chai gossip to celebrating every win together, you have always been the spark that lights up the room. Tumhari positivity is truly one in a billion. Keep shining bright! ✨'
  );
  const [generatedHeadline, setGeneratedHeadline] = useState<string>('Happy 25th Birthday, Ananya!');

  const playChimeSound = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        const ctx = new AudioContextClass();
        const now = ctx.currentTime;
        const freqs = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);
          gain.gain.setValueAtTime(0.18, now + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 1.2);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 1.2);
        });
      }
    } catch {
      // AudioContext unavailable
    }
  };

  const handleCelebrateDemo = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    playChimeSound();
    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.65 },
      colors: heroTemplate === 'pastel'
        ? ['#f472b6', '#c084fc', '#fbcfe8', '#fef08a']
        : heroTemplate === 'royal'
        ? ['#d4af37', '#fef08a', '#f59e0b', '#ffffff']
        : ['#06b6d4', '#ec4899', '#f59e0b', '#3b82f6'],
    });
  };

  const handleToggleUnbox = () => {
    if (!unboxed) {
      handleCelebrateDemo();
    }
    setUnboxed(!unboxed);
  };

  const handleGenerateAiWishDemo = async () => {
    setIsGeneratingAi(true);
    try {
      const res = await fetch('/api/ai/wish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientName: aiName.trim() || 'Loved One',
          occasion: aiOccasion,
          relationship: 'Best Friend',
          tone: aiTone,
          language: aiLang,
          mode: 'full_letter',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.headline) setGeneratedHeadline(data.headline);
        if (data.paragraphs && data.paragraphs.length > 0) {
          setGeneratedWish(data.paragraphs.join('\n\n'));
        }
        playChimeSound();
        confetti({
          particleCount: 40,
          spread: 50,
          origin: { y: 0.7 },
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07080c] text-slate-100 flex flex-col selection:bg-amber-400 selection:text-slate-950 overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 pt-12 pb-24 overflow-hidden">
        {/* Dynamic atmospheric backdrop responding to template selection */}
        <div
          className={`absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[420px] blur-[140px] pointer-events-none rounded-full transition-all duration-1000 ${
            heroTemplate === 'neon'
              ? 'bg-gradient-to-r from-cyan-500/20 via-fuchsia-500/15 to-blue-500/20'
              : heroTemplate === 'pastel'
              ? 'bg-gradient-to-r from-pink-500/20 via-purple-500/15 to-rose-400/20'
              : 'bg-gradient-to-r from-amber-500/25 via-yellow-600/15 to-amber-700/20'
          }`}
        />

        {/* Floating Ambient Stars / Embers */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-12 left-10 w-2 h-2 rounded-full bg-amber-400/60 animate-ping" />
          <div className="absolute top-36 right-16 w-3 h-3 rounded-full bg-cyan-400/40 animate-pulse" />
          <div className="absolute bottom-28 left-1/4 w-2 h-2 rounded-full bg-pink-400/50 animate-bounce" />
          <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 rounded-full bg-yellow-300/70 animate-ping" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          {/* Natural kicker badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-6">
            <span className="flex items-center gap-1.5 text-amber-400">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Cinematic Occasion Pages</span>
            </span>
            <span aria-hidden="true">·</span>
            <span>Gemini AI Heartfelt Letters</span>
            <span aria-hidden="true">·</span>
            <span className="text-cyan-400">3D Interactive Stories</span>
          </div>

          {/* Marquee Headline */}
          <h1
            className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-tight max-w-3xl mb-6 font-syne"
            style={{ textWrap: 'balance' }}
          >
            Turn Simple Wishes Into{' '}
            <span
              className={`transition-colors duration-500 ${
                heroTemplate === 'neon'
                  ? 'bg-gradient-to-r from-cyan-400 via-pink-400 to-amber-400 bg-clip-text text-transparent'
                  : heroTemplate === 'pastel'
                  ? 'bg-gradient-to-r from-pink-300 via-purple-300 to-rose-300 bg-clip-text text-transparent'
                  : 'gold-gradient-text'
              }`}
            >
              Cinematic Stories
            </span>
          </h1>

          <p
            className="text-base sm:text-xl text-slate-300 max-w-2xl font-light mb-8 leading-relaxed"
            style={{ textWrap: 'balance' }}
          >
            A bespoke, interactive celebration website with personalized heartfelt letters, 3D memory Polaroids, ambient music, virtual candle blowouts, and a luxury printable QR gift tag.
          </p>

          {/* Action Decision Block */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-10">
            <Link
              href="/create"
              className="w-full sm:w-auto py-4 px-8 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-xl shadow-amber-500/25"
            >
              <Sparkles className="h-4 w-4" />
              <span>Create Free Wish Page</span>
            </Link>

            <Link
              href="/w/priya-25th-birthday"
              className="w-full sm:w-auto py-4 px-8 rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10 text-white font-semibold text-sm flex items-center justify-center gap-2 transition cursor-pointer backdrop-blur-md"
            >
              <Play className="h-4 w-4 text-amber-400 fill-amber-400" />
              <span>Experience Live Demo</span>
            </Link>
          </div>

          {/* Template Mood Switcher Preview Bar */}
          <div className="flex items-center gap-2 mb-6 p-1.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
            <span className="text-[11px] font-mono text-slate-400 px-2">Preview Theme:</span>
            <button
              onClick={() => setHeroTemplate('neon')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                heroTemplate === 'neon' ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20' : 'text-slate-400 hover:text-white'
              }`}
            >
              ⚡ Neon Night
            </button>
            <button
              onClick={() => setHeroTemplate('pastel')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                heroTemplate === 'pastel' ? 'bg-pink-400 text-slate-950 shadow-md shadow-pink-500/20' : 'text-slate-400 hover:text-white'
              }`}
            >
              🌸 Pastel Dream
            </button>
            <button
              onClick={() => setHeroTemplate('royal')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                heroTemplate === 'royal' ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20' : 'text-slate-400 hover:text-white'
              }`}
            >
              👑 Royal Gold
            </button>
          </div>

          {/* Interactive Hero Unbox Simulator Widget */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={handleToggleUnbox}
            className={`w-full max-w-md rounded-3xl border-2 p-6 backdrop-blur-xl shadow-2xl cursor-pointer relative group overflow-hidden select-none transition-all duration-500 ${
              heroTemplate === 'neon'
                ? 'border-cyan-400/50 bg-slate-900/90 shadow-cyan-500/10'
                : heroTemplate === 'pastel'
                ? 'border-pink-400/50 bg-[#161220]/90 shadow-pink-500/10'
                : 'border-amber-400/50 bg-slate-950/90 shadow-amber-500/15'
            }`}
          >
            {/* Ambient Shimmer */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400/5 via-pink-400/5 to-cyan-400/5 opacity-50 group-hover:opacity-100 transition" />

            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="font-mono text-amber-300 flex items-center gap-1.5 font-bold">
                <Gift className="h-4 w-4" />
                <span>Tap To {unboxed ? 'Close' : 'Unbox Live'} Preview</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Interactive Simulator</span>
            </div>

            <AnimatePresence mode="wait">
              {!unboxed ? (
                <motion.div
                  key="sealed"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  className="py-6 flex flex-col items-center justify-center"
                >
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/30 mb-3 animate-pulse">
                    <Sparkles className="h-8 w-8" />
                  </div>
                  <span className="text-sm font-bold text-white font-syne">Sealed Surprise For Priya</span>
                  <span className="text-xs text-slate-400 mt-1">Tap anywhere to break wax seal & unlock</span>
                </motion.div>
              ) : (
                <motion.div
                  key="opened"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="py-4 text-left space-y-3"
                >
                  <div className="flex items-center justify-between text-xs text-amber-400 font-bold">
                    <span>🎉 25th Birthday Celebration</span>
                    <span className="text-[10px] text-slate-400">60 FPS Cinematic Story</span>
                  </div>
                  <p className="text-xs text-slate-200 italic leading-relaxed">
                    &ldquo;To the girl who turns ordinary days into electric midnight memories... May your 25th chapter be filled with audacious dreams and endless joy!&rdquo;
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[11px] text-slate-400">
                    <span className="text-emerald-400 font-medium">✨ Chimes & Audio Unlocked</span>
                    <span className="text-amber-400 font-bold">Tap to seal</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Adjacency proof signals */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Gemini AI Heartfelt Writing</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>3D Flippable Memory Polaroids</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Luxury Printable Keepsake QR Tag</span>
            </div>
          </div>
        </div>
      </section>

      {/* LIVE AI WISH WRITER LABORATORY (Interactive Demo Section) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-8 sm:p-12 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
          {/* Top ambient glow */}
          <div className="absolute top-0 right-1/4 w-80 h-32 bg-amber-400/10 blur-3xl pointer-events-none" />

          <div className="text-center max-w-xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-semibold mb-3">
              <Wand2 className="h-3.5 w-3.5" />
              <span>Try The AI Wishing Assistant Live</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-syne">
              Craft Heartfelt Wishes in Seconds
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Never get writer&apos;s block again. Watch Gemini craft deep, tear-jerking, or hilarious wishes in English, Hindi, or Hinglish.
            </p>
          </div>

          {/* Interactive controls */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Input Parameters (5 cols) */}
            <div className="md:col-span-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Recipient Name
                </label>
                <input
                  type="text"
                  value={aiName}
                  onChange={(e) => setAiName(e.target.value)}
                  placeholder="e.g. Aryan, Priya, Dad"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Occasion
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'birthday', label: '🎂 Birthday' },
                    { id: 'anniversary', label: '💖 Anniversary' },
                    { id: 'milestone', label: '🌟 Milestone' },
                  ].map((occ) => (
                    <button
                      key={occ.id}
                      type="button"
                      onClick={() => setAiOccasion(occ.id)}
                      className={`py-2 px-2 rounded-xl text-[11px] font-semibold transition cursor-pointer border ${
                        aiOccasion === occ.id
                          ? 'bg-amber-400/20 border-amber-400 text-amber-300'
                          : 'border-white/10 bg-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      {occ.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Tone
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'emotional', label: '🥺 Emotional' },
                    { id: 'funny', label: '😂 Playful' },
                    { id: 'poetic', label: '✍️ Poetic' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setAiTone(t.id as 'emotional' | 'funny' | 'poetic')}
                      className={`py-2 px-2 rounded-xl text-[11px] font-semibold transition cursor-pointer border ${
                        aiTone === t.id
                          ? 'bg-amber-400/20 border-amber-400 text-amber-300'
                          : 'border-white/10 bg-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Language Style
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'hinglish', label: 'Hinglish' },
                    { id: 'hi', label: 'हिंदी (Devanagari)' },
                    { id: 'en', label: 'English' },
                  ].map((l) => (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => setAiLang(l.id as 'en' | 'hi' | 'hinglish')}
                      className={`py-2 px-2 rounded-xl text-[11px] font-semibold transition cursor-pointer border ${
                        aiLang === l.id
                          ? 'bg-amber-400/20 border-amber-400 text-amber-300'
                          : 'border-white/10 bg-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={handleGenerateAiWishDemo}
                disabled={isGeneratingAi}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-amber-500/20 disabled:opacity-50"
              >
                <Wand2 className="h-4 w-4" />
                <span>{isGeneratingAi ? 'Gemini AI is Writing...' : '✨ Generate AI Wish Live'}</span>
              </button>
            </div>

            {/* Generated Output Stage (7 cols) */}
            <div className="md:col-span-7 p-6 rounded-2xl bg-black/50 border border-white/10 relative flex flex-col justify-between min-h-[300px]">
              <div>
                <div className="flex items-center justify-between text-xs text-amber-400 font-mono mb-3 border-b border-white/10 pb-2">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                    <span>AI Story Preview</span>
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase">{aiLang} · {aiTone}</span>
                </div>

                <h3 className="text-base font-bold text-white mb-3 font-serif">
                  {generatedHeadline}
                </h3>

                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line italic">
                  &ldquo;{generatedWish}&rdquo;
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Ready to personalize for your loved one?</span>
                <Link
                  href="/create"
                  className="py-1.5 px-3 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1 transition"
                >
                  <span>Use In My Page</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Distinct Templates Showcase */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full border-t border-white/10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Theme Aesthetics</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-syne">
            Three Distinct Visual Universes
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-md mx-auto">
            Choose the mood that best honors your recipient&apos;s personality.
          </p>
        </div>

        {/* Template Showcase Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 1. Neon Night */}
          <div className="rounded-3xl border border-cyan-500/30 bg-slate-900/50 p-6 backdrop-blur-xl flex flex-col justify-between hover:border-cyan-400 transition-all shadow-[0_0_25px_-5px_rgba(6,182,212,0.2)]">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-syne text-lg font-bold text-cyan-300 neon-glow-cyan">
                  Neon Night
                </span>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                  CYBER GLOW
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-6">
                Vibrant electric cyan & magenta on dark obsidian. Pulsing stars, glow typography, and electronic synth ambiance.
              </p>
            </div>
            <Link
              href="/w/priya-25th-birthday"
              className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition"
            >
              <span>View Neon Demo</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* 2. Pastel Dream */}
          <div className="rounded-3xl border border-pink-400/30 bg-[#161220]/60 p-6 backdrop-blur-xl flex flex-col justify-between hover:border-pink-400 transition-all shadow-[0_0_25px_-5px_rgba(244,114,182,0.2)]">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-serif text-lg font-bold text-pink-200">
                  Pastel Dream
                </span>
                <span className="text-[10px] font-mono text-pink-300 bg-pink-950/80 px-2 py-0.5 rounded border border-pink-400/30">
                  ROMANTIC
                </span>
              </div>
              <p className="text-xs text-pink-100/80 leading-relaxed mb-6">
                Soft twilight rose, drifting floral petals, gentle serif calligraphy, and tender acoustic piano music.
              </p>
            </div>
            <Link
              href="/w/sam-and-alex-5th-anniversary"
              className="w-full py-2.5 rounded-xl bg-pink-400 hover:bg-pink-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition"
            >
              <span>View Pastel Demo</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* 3. Royal Gold */}
          <div className="rounded-3xl border border-amber-400/40 bg-slate-950/70 p-6 backdrop-blur-xl flex flex-col justify-between hover:border-amber-400 transition-all shadow-[0_0_25px_-5px_rgba(245,197,24,0.2)]">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-cinzel text-lg font-bold text-amber-200">
                  Royal Gold
                </span>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/30">
                  REGAL LUXE
                </span>
              </div>
              <p className="text-xs text-amber-100/80 leading-relaxed mb-6">
                24k brushed gold foil on midnight velvet, regal Cinzel typography, and stately orchestral celebration anthems.
              </p>
            </div>
            <Link
              href="/w/rohan-graduation-gala"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-amber-500/20"
            >
              <span>View Royal Demo</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Conversion Banner */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full text-center">
        <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-b from-amber-500/10 via-slate-900/60 to-slate-950/80 border border-amber-400/30 shadow-2xl relative overflow-hidden">
          <div className="h-16 w-16 mx-auto rounded-2xl bg-amber-400/10 text-amber-400 flex items-center justify-center mb-6">
            <Cake className="h-8 w-8" />
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-4 font-syne">
            Ready to Surprise Someone Special?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto mb-8">
            Create an unforgettable cinematic tribute in less than 3 minutes. Free to build, permanent shareable URL, downloadable luxury QR tag.
          </p>
          <Link
            href="/create"
            className="inline-flex items-center gap-2 py-4 px-8 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/25 transition cursor-pointer"
          >
            <Sparkles className="h-4 w-4" />
            <span>Start Creating Now</span>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
