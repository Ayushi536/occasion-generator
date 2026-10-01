'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Camera,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  RotateCw,
  LayoutGrid,
  Layers,
  Film,
  Play,
  Pause,
  Heart,
  Sparkles,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { WishPage, PhotoItem } from '@/lib/types';
import { TEMPLATES } from './theme-config';

interface AnimatedGalleryProps {
  page: WishPage;
}

export default function AnimatedGallery({ page }: AnimatedGalleryProps) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});
  const [viewMode, setViewMode] = useState<'coverflow' | 'polaroid' | 'mosaic'>('coverflow');
  const [isPlaying, setIsPlaying] = useState(false);
  const [likes, setLikes] = useState<Record<number, number>>({});
  const [floatingHearts, setFloatingHearts] = useState<Array<{ id: number; photoIdx: number; x: number; y: number }>>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const theme = TEMPLATES[page.template];

  const photos = page.photos || [];

  // Autoplay slideshow for 3D coverflow
  useEffect(() => {
    if (!isPlaying || photos.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % photos.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [isPlaying, photos.length]);

  if (photos.length === 0) return null;

  const currentPhoto = selectedPhotoIndex !== null ? photos[selectedPhotoIndex] : null;

  // Camera shutter click sound effect using Web Audio API
  const playShutterSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const now = ctx.currentTime;
        // Two quick mechanical click snaps
        [0, 0.04].forEach((delay) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(1400, now + delay);
          gain.gain.setValueAtTime(0.12, now + delay);
          gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.03);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + delay);
          osc.stop(now + delay + 0.03);
        });
      }
    } catch {
      // AudioContext unavailable
    }
  };

  const toggleFlip = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setFlippedCards((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleNext = () => {
    playShutterSound();
    if (selectedPhotoIndex !== null) {
      setSelectedPhotoIndex((selectedPhotoIndex + 1) % photos.length);
    } else {
      setActiveIndex((prev) => (prev + 1) % photos.length);
    }
  };

  const handlePrev = () => {
    playShutterSound();
    if (selectedPhotoIndex !== null) {
      setSelectedPhotoIndex((selectedPhotoIndex - 1 + photos.length) % photos.length);
    } else {
      setActiveIndex((prev) => (prev - 1 + photos.length) % photos.length);
    }
  };

  const handleLikePhoto = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikes((prev) => ({ ...prev, [index]: (prev[index] || 0) + 1 }));

    // Anime-style floating particle burst
    setFloatingHearts((prev) => [
      ...prev.slice(-15),
      {
        id: (prev[prev.length - 1]?.id || 0) + 1,
        photoIdx: index,
        x: ((index * 19) % 36) - 18,
        y: -10,
      },
      {
        id: (prev[prev.length - 1]?.id || 0) + 2,
        photoIdx: index,
        x: ((index * 29) % 40) - 20,
        y: -25,
      },
    ]);

    // Confetti pop
    try {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;
      confetti({
        particleCount: 22,
        spread: 55,
        origin: { x, y },
        colors: ['#ec4899', '#f43f5e', '#fb7185', '#38bdf8', '#fbbf24'],
        ticks: 60,
        shapes: ['circle', 'square'],
        scalar: 0.8,
      });
    } catch {
      // ignore
    }
  };

  // Subtle rotation angles for authentic Polaroid scatter
  const rotations = [-2.5, 1.8, -1.2, 2.2, -1.9, 1.5, -2, 2];

  return (
    <section className="relative py-24 px-4 sm:px-6 max-w-6xl mx-auto overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-r from-amber-500/15 via-pink-500/15 to-cyan-500/15 blur-[140px] pointer-events-none rounded-full" />

      {/* Header with View Mode Switcher & Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 relative z-10">
        <div className="text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
            <Camera className="h-4 w-4" />
            <span>Interactive Memory Reel</span>
          </div>
          <h2 className={`text-3xl sm:text-5xl font-extrabold text-white ${theme.fontHeading} tracking-tight`}>
            Timeless Photo Memories
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-md">
            Slide through the 3D film reel, tap to inspect in full cinema, or flip the Polaroid to discover hidden memories!
          </p>
        </div>

        {/* View Switcher Controls */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl shrink-0">
          <button
            type="button"
            onClick={() => setViewMode('coverflow')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              viewMode === 'coverflow' ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-500/25' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Film className="h-3.5 w-3.5" />
            <span>3D Film Reel</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('polaroid')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              viewMode === 'polaroid' ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-500/25' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Polaroid Table</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('mosaic')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              viewMode === 'mosaic' ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-500/25' : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            <span>Cinematic Grid</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: ANIME.JS LEVEL 3D COVERFLOW FILM REEL */}
      {viewMode === 'coverflow' && (
        <div className="relative py-8 select-none">
          {/* Animated Film Sprocket Tracks (Top & Bottom) */}
          <div className="flex items-center justify-between px-6 py-1 opacity-25 overflow-hidden">
            {new Array(24).fill(0).map((_, i) => (
              <div key={i} className="w-3 h-2 rounded-[2px] bg-white border border-white/40 shrink-0 mx-1" />
            ))}
          </div>

          {/* Coverflow Stage */}
          <div className="relative h-[400px] sm:h-[480px] flex items-center justify-center perspective-[1400px] overflow-hidden my-4">
            {photos.map((photo, idx) => {
              const offset = idx - activeIndex;
              const isCenter = offset === 0;
              const isAdjacent = Math.abs(offset) <= 2;

              if (!isAdjacent) return null;

              const translateX = offset * 230;
              const rotateY = offset * -32;
              const scale = isCenter ? 1.08 : Math.max(0.68, 1 - Math.abs(offset) * 0.18);
              const zIndex = 30 - Math.abs(offset) * 5;
              const opacity = isCenter ? 1 : Math.max(0.35, 1 - Math.abs(offset) * 0.35);

              return (
                <motion.div
                  key={photo.id || idx}
                  className="absolute cursor-pointer transition-all duration-600 ease-out"
                  style={{
                    transform: `translateX(${translateX}px) rotateY(${rotateY}deg) scale(${scale})`,
                    zIndex,
                    opacity,
                  }}
                  whileHover={isCenter ? { scale: 1.12, y: -6 } : { scale: scale * 1.05 }}
                  onClick={() => {
                    if (isCenter) {
                      playShutterSound();
                      setSelectedPhotoIndex(idx);
                    } else {
                      playShutterSound();
                      setActiveIndex(idx);
                    }
                  }}
                >
                  <div
                    className={`relative w-[260px] sm:w-[340px] aspect-[4/5] rounded-3xl overflow-hidden border-2 transition-all duration-500 shadow-2xl bg-slate-900 group ${
                      isCenter
                        ? 'border-amber-400 shadow-[0_0_35px_rgba(245,158,11,0.35)] ring-4 ring-amber-400/25'
                        : 'border-white/10 hover:border-white/40'
                    }`}
                  >
                    <img
                      src={photo.url}
                      alt={photo.caption || `Memory ${idx + 1}`}
                      className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />

                    {/* Anime Holographic Specular Light Sheen */}
                    {isCenter && (
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-transparent opacity-0 group-hover:opacity-100 transition duration-700 pointer-events-none transform -translate-x-full group-hover:translate-x-full duration-1000" />
                    )}

                    {/* Gradient Overlay & Caption */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] uppercase tracking-wider text-amber-300 font-mono block">
                            Memory #{idx + 1} of {photos.length}
                          </span>
                          <p className="text-sm font-bold text-white truncate drop-shadow">
                            {photo.caption || `Chapter #${idx + 1}`}
                          </p>
                        </div>

                        {/* Interactive Anime Heart Button */}
                        <div className="relative">
                          <button
                            type="button"
                            onClick={(e) => handleLikePhoto(idx, e)}
                            className="flex items-center gap-1.5 py-1 px-3 rounded-full bg-black/70 hover:bg-pink-600 border border-white/20 text-white text-xs backdrop-blur-md transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer shadow-lg"
                          >
                            <Heart className="h-3.5 w-3.5 fill-pink-500 text-pink-500" />
                            <span className="text-[11px] font-bold">{(likes[idx] || 0) + 7}</span>
                          </button>

                          {/* Floating Hearts Pop Animation */}
                          <AnimatePresence>
                            {floatingHearts
                              .filter((h) => h.photoIdx === idx)
                              .map((h) => (
                                <motion.span
                                  key={h.id}
                                  initial={{ opacity: 1, y: 0, x: h.x, scale: 0.6 }}
                                  animate={{ opacity: 0, y: -60, scale: 1.4 }}
                                  exit={{ opacity: 0 }}
                                  transition={{ duration: 1, ease: 'easeOut' }}
                                  className="absolute -top-3 left-1/2 pointer-events-none text-pink-400 text-sm select-none"
                                >
                                  💖
                                </motion.span>
                              ))}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>

                    {/* Center Click-to-Enlarge Cue */}
                    {isCenter && (
                      <div className="absolute top-4 right-4 p-2 rounded-xl bg-black/60 backdrop-blur-md text-white border border-white/20 hover:scale-110 transition shadow-lg">
                        <Maximize2 className="h-4 w-4 text-amber-400" />
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Animated Film Sprocket Tracks (Bottom) */}
          <div className="flex items-center justify-between px-6 py-1 opacity-25 overflow-hidden">
            {new Array(24).fill(0).map((_, i) => (
              <div key={i} className="w-3 h-2 rounded-[2px] bg-white border border-white/40 shrink-0 mx-1" />
            ))}
          </div>

          {/* Navigation Controls Bar */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              type="button"
              onClick={handlePrev}
              className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/10 transition cursor-pointer hover:scale-105 active:scale-95 shadow-lg"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {/* Slideshow Play / Pause Button */}
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold transition shadow-xl cursor-pointer hover:scale-105 active:scale-95 ${
                isPlaying
                  ? 'bg-amber-400 text-slate-950 shadow-amber-500/25 ring-2 ring-amber-300'
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="h-4 w-4" />
                  <span>Pause Reel</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 fill-current" />
                  <span>Play Cinematic Slideshow</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/10 transition cursor-pointer hover:scale-105 active:scale-95 shadow-lg"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Kinetic Indicator Bar */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {photos.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  playShutterSound();
                  setActiveIndex(i);
                }}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  i === activeIndex ? 'w-8 bg-amber-400 shadow-[0_0_8px_#f59e0b]' : 'w-2 bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* VIEW 2: POLAROID TABLE WITH 3D FLIP */}
      {viewMode === 'polaroid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 pt-4">
          {photos.map((photo, idx) => {
            const isFlipped = flippedCards[idx] || false;
            const rotation = rotations[idx % rotations.length];

            return (
              <motion.div
                key={photo.id || idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: (idx % 3) * 0.1 }}
                whileHover={{ y: -8, scale: 1.03 }}
                style={{
                  perspective: 1000,
                  transform: `rotate(${rotation}deg)`,
                }}
                className="relative group cursor-pointer"
                onClick={() => {
                  playShutterSound();
                  setSelectedPhotoIndex(idx);
                }}
              >
                {/* Tape Pin Sticker */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-amber-100/30 dark:bg-white/20 backdrop-blur-md rounded border border-white/20 shadow-md rotate-1 z-20 pointer-events-none" />

                {/* 3D Flippable Card Frame */}
                <div
                  className={`relative w-full rounded-2xl transition-transform duration-700 [transform-style:preserve-3d] p-3.5 pb-6 bg-slate-900 border-2 border-white/15 shadow-2xl hover:border-amber-400/60 hover:shadow-amber-500/15 ${
                    isFlipped ? '[transform:rotateY(180deg)]' : ''
                  }`}
                >
                  {/* FRONT FACE */}
                  <div className="[backface-visibility:hidden]">
                    <div className="overflow-hidden rounded-xl aspect-square relative bg-slate-950">
                      <img
                        src={photo.url}
                        alt={photo.caption || `Memory photo ${idx + 1}`}
                        className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />

                      {/* Quick Action Overlays */}
                      <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <button
                          type="button"
                          onClick={(e) => toggleFlip(idx, e)}
                          title="Flip to read note on back"
                          className="p-1.5 rounded-lg bg-black/70 hover:bg-amber-400 hover:text-slate-950 text-white backdrop-blur-md transition cursor-pointer"
                        >
                          <RotateCw className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            playShutterSound();
                            setSelectedPhotoIndex(idx);
                          }}
                          title="View Fullscreen"
                          className="p-1.5 rounded-lg bg-black/70 hover:bg-white hover:text-slate-950 text-white backdrop-blur-md transition cursor-pointer"
                        >
                          <Maximize2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Caption & Polaroid Bottom Stamp */}
                    <div className="mt-3 px-1 flex items-center justify-between gap-2">
                      <p className="text-xs font-bold text-slate-200 truncate">
                        {photo.caption || `Chapter #${idx + 1}`}
                      </p>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => handleLikePhoto(idx, e)}
                          className="flex items-center gap-1 text-[11px] text-pink-400 hover:text-pink-300 font-bold"
                        >
                          <Heart className="h-3 w-3 fill-pink-500 text-pink-500" />
                          <span>{(likes[idx] || 0) + 7}</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => toggleFlip(idx, e)}
                          className="text-[11px] font-mono text-amber-400 hover:text-amber-300 flex items-center gap-0.5"
                        >
                          <RotateCw className="h-3 w-3" />
                          <span>Flip</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* BACK FACE (180deg flipped) */}
                  <div
                    className="absolute inset-0 p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-left flex flex-col justify-between [transform:rotateY(180deg)] [backface-visibility:hidden] border-2 border-amber-400/40"
                    onClick={(e) => toggleFlip(idx, e)}
                  >
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-amber-400 font-mono mb-3">
                        <span>MEMO #{idx + 1}</span>
                        <RotateCw className="h-3.5 w-3.5" />
                      </div>
                      <h4 className="text-sm font-bold text-white mb-2 font-serif">
                        {photo.caption || 'Special Shared Memory'}
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed italic">
                        &ldquo;Every time I look at this snapshot, it brings back the laughter, inside jokes, and warmth of that unforgettable day.&rdquo;
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span>Archived with love</span>
                      <span className="text-amber-400">Tap to flip back</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* VIEW 3: CINEMATIC MOSAIC GRID */}
      {viewMode === 'mosaic' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((photo, idx) => (
            <motion.div
              key={photo.id || idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="relative group rounded-3xl overflow-hidden border border-white/10 bg-slate-900 aspect-square cursor-pointer shadow-xl hover:border-amber-400/50 transition-all duration-300 hover:-translate-y-1"
              onClick={() => {
                playShutterSound();
                setSelectedPhotoIndex(idx);
              }}
            >
              <img
                src={photo.url}
                alt={photo.caption || `Memory photo ${idx + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-white truncate">
                    {photo.caption || `Memory #${idx + 1}`}
                  </p>
                  <button
                    type="button"
                    onClick={(e) => handleLikePhoto(idx, e)}
                    className="flex items-center gap-1 text-xs text-pink-400 font-bold py-1 px-2.5 rounded-full bg-black/60 border border-white/20"
                  >
                    <Heart className="h-3.5 w-3.5 fill-pink-500 text-pink-500" />
                    <span>{(likes[idx] || 0) + 7}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Cinematic Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {selectedPhotoIndex !== null && currentPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 sm:p-8 backdrop-blur-2xl"
            onClick={() => setSelectedPhotoIndex(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedPhotoIndex(null)}
              className="absolute top-6 right-6 z-50 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition cursor-pointer"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Prev Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 p-3.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition cursor-pointer"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            {/* Next Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 p-3.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition cursor-pointer"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Main Stage Image & Caption */}
            <div
              className="relative max-h-[88vh] max-w-4xl flex flex-col items-center select-none"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={currentPhoto.url}
                alt={currentPhoto.caption || 'Enlarged photo memory'}
                className="max-h-[70vh] w-auto max-w-full rounded-3xl object-contain shadow-2xl border border-white/20"
                referrerPolicy="no-referrer"
              />

              <div className="mt-4 text-center max-w-lg">
                <span className="text-xs text-amber-400 font-mono">
                  {selectedPhotoIndex + 1} of {photos.length}
                </span>
                <h3 className="text-lg font-bold text-white mt-1">
                  {currentPhoto.caption || `Memory Chapter #${selectedPhotoIndex + 1}`}
                </h3>
              </div>

              {/* Scrubber Thumbnail Row */}
              <div className="flex items-center gap-2 mt-4 overflow-x-auto max-w-full p-2">
                {photos.map((p, idx) => (
                  <button
                    key={p.id || idx}
                    type="button"
                    onClick={() => {
                      playShutterSound();
                      setSelectedPhotoIndex(idx);
                    }}
                    className={`relative w-12 h-12 rounded-xl overflow-hidden border-2 transition shrink-0 cursor-pointer ${
                      selectedPhotoIndex === idx ? 'border-amber-400 scale-110' : 'border-white/20 opacity-50'
                    }`}
                  >
                    <img src={p.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
