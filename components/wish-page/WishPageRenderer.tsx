'use client';

import { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { Lock, Clock, Sparkles } from 'lucide-react';
import { WishPage } from '@/lib/types';
import { TEMPLATES } from './theme-config';
import IntroCurtain from './IntroCurtain';
import ParallaxHero from './ParallaxHero';
import TypewriterMessage from './TypewriterMessage';
import MemoryTimeline from './MemoryTimeline';
import AnimatedGallery from './AnimatedGallery';
import VideoPlayerSection from './VideoPlayerSection';
import WishesWall from './WishesWall';
import InteractiveFinale from './InteractiveFinale';
import FinalEmotionalNote from './FinalEmotionalNote';

interface WishPageRendererProps {
  page: WishPage & { isScheduledInFuture?: boolean; isUnlocked?: boolean };
}

export default function WishPageRenderer({ page }: WishPageRendererProps) {
  const [hasBegun, setHasBegun] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [passcodeAttempt, setPasscodeAttempt] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);
  const [unlockedState, setUnlockedState] = useState(page.isUnlocked ?? true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const theme = TEMPLATES[page.template] || TEMPLATES['neon-night'];

  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // Initialize audio track
  useEffect(() => {
    if (page.audioTrack?.enabled && page.audioTrack.url) {
      const audio = new Audio(page.audioTrack.url);
      audio.loop = true;
      audio.volume = 0.5;
      audioRef.current = audio;

      return () => {
        audio.pause();
        audio.src = '';
      };
    }
  }, [page.audioTrack]);

  const handleBegin = () => {
    setHasBegun(true);
    if (audioRef.current) {
      audioRef.current
        .play()
        .then(() => setIsPlayingMusic(true))
        .catch(() => {
          // Autoplay blocked by browser policy, keep mute icon
          setIsPlayingMusic(false);
        });
    }
  };

  const handleToggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlayingMusic) {
      audioRef.current.pause();
      setIsPlayingMusic(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlayingMusic(true))
        .catch(() => setIsPlayingMusic(false));
    }
  };

  const handleUnlockWithPasscode = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcodeAttempt) {
      // Reload with passcode query param
      window.location.href = `/w/${page.slug}?passcode=${encodeURIComponent(passcodeAttempt)}`;
    }
  };

  // Scheduled page countdown check
  if (page.isScheduledInFuture && page.revealAt) {
    const targetDate = new Date(page.revealAt).toLocaleString();
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#07080d]">
        <div className="max-w-md w-full rounded-3xl p-8 border border-white/15 bg-white/5 backdrop-blur-xl">
          <Clock className="h-12 w-12 text-amber-400 mx-auto mb-4 animate-pulse" />
          <h1 className="text-2xl font-bold text-white mb-2">Surprise in Preparation!</h1>
          <p className="text-sm text-slate-300 mb-6">
            This celebration page for <strong className="text-white">{page.recipientName}</strong> is scheduled to unlock on:
          </p>
          <div className="py-3 px-4 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-300 font-mono text-sm mb-6">
            {targetDate}
          </div>
          <p className="text-xs text-slate-400">
            Come back then to experience the full interactive story!
          </p>
        </div>
      </main>
    );
  }

  // Passcode protected check
  if (!unlockedState) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#07080d]">
        <div className="max-w-md w-full rounded-3xl p-8 border border-white/15 bg-white/5 backdrop-blur-xl">
          <Lock className="h-12 w-12 text-pink-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Secret Wish Page</h1>
          <p className="text-sm text-slate-300 mb-6">
            A passcode is required to view this personal celebration for <strong className="text-white">{page.recipientName}</strong>.
          </p>
          <form onSubmit={handleUnlockWithPasscode} className="space-y-4">
            <input
              type="password"
              placeholder="Enter secret passcode"
              value={passcodeAttempt}
              onChange={(e) => setPasscodeAttempt(e.target.value)}
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-center text-sm text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
            />
            {passcodeError && (
              <p className="text-xs text-rose-400">Incorrect passcode. Try again.</p>
            )}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm transition"
            >
              Unlock Surprise
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <div className={`min-h-screen ${theme.bgClass} relative selection:bg-amber-400 selection:text-slate-950`}>
      {/* 1. Tap-to-begin Intro Curtain */}
      <IntroCurtain page={page} onBegin={handleBegin} />

      {/* 2. Parallax Hero */}
      <ParallaxHero
        page={page}
        isPlayingMusic={isPlayingMusic}
        onToggleMusic={handleToggleMusic}
      />

      {/* 3. Animated/Typewriter Message */}
      <TypewriterMessage page={page} />

      {/* 4. Memory Timeline */}
      <MemoryTimeline page={page} />

      {/* 5. Animated Photo Gallery */}
      <AnimatedGallery page={page} />

      {/* 6. Video Section */}
      <VideoPlayerSection page={page} />

      {/* 7. Community Wishes Wall */}
      <WishesWall page={page} />

      {/* 8. Interactive Finale with Candles & Confetti */}
      <InteractiveFinale page={page} />

      {/* 9. Final Emotional Message + QR & Share */}
      <FinalEmotionalNote page={page} />
    </div>
  );
}
