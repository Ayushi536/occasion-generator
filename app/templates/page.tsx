'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Sparkles,
  ArrowRight,
  Eye,
  CheckCircle2,
  Heart,
  ExternalLink,
} from 'lucide-react';
import { TemplateType } from '@/lib/types';
import { TEMPLATES } from '@/components/wish-page/theme-config';

interface TemplateCardData {
  id: TemplateType;
  title: string;
  tagline: string;
  description: string;
  accentColor: string;
  font: string;
  palette: string[];
  demoSlug: string;
  features: string[];
}

const TEMPLATE_SHOWCASE: TemplateCardData[] = [
  {
    id: 'neon-night',
    title: 'Neon Night',
    tagline: 'Dark, glowing & futuristic',
    description:
      'Designed for milestone birthdays, wild friend celebrations, and high-energy gatherings. Features cyber glow typography, deep obsidian background, laser-like animated particles, and electric cyan/pink accents.',
    accentColor: '#06b6d4',
    font: 'Syne (Futuristic Display)',
    palette: ['#050811', '#06b6d4', '#ec4899', '#8b5cf6'],
    demoSlug: 'priya-25th-birthday',
    features: [
      'Glow shader headline typography',
      'Cyber-party floating particles',
      'High-contrast dark obsidian cards',
      'Electronic ambient soundtrack',
      'Multi-color neon confetti shower',
    ],
  },
  {
    id: 'pastel-dream',
    title: 'Pastel Dream',
    tagline: 'Soft, romantic & dreamy',
    description:
      'Crafted for wedding anniversaries, love letters, and warm heartfelt bonds. Envelops the viewer in twilight rose hues, floating flower petals, gentle serif typography, and soft candlelight warmth.',
    accentColor: '#f472b6',
    font: 'Playfair & Great Vibes (Romantic Serif)',
    palette: ['#120f18', '#f472b6', '#c084fc', '#fef3c7'],
    demoSlug: 'alex-sam-forever',
    features: [
      'Ethereal floating rose petals',
      'Blush pink & lavender gradients',
      'Gentle piano romantic audio',
      'Parchment letter presentation',
      'Soft pastel celebratory confetti',
    ],
  },
  {
    id: 'royal-gold',
    title: 'Royal Gold',
    tagline: 'Elegant, luxurious & prestigious',
    description:
      'Reserved for doctorates, retirements, grand corporate galas, and monumental lifetime honors. Features 24k gold leaf borders, regal Cinzel roman serif typography, and opulent champagne shimmer.',
    accentColor: '#d4af37',
    font: 'Cinzel (Imperial Roman Serif)',
    palette: ['#090b10', '#d4af37', '#f59e0b', '#fef08a'],
    demoSlug: 'rohan-graduation-gala',
    features: [
      '24k brushed gold sheen lettering',
      'Imperial obsidian and navy backdrop',
      'Regal orchestral background track',
      'Aristocratic framed memories',
      'Golden star & champagne sparkle burst',
    ],
  },
];

export default function TemplatesPage() {
  const [selectedTmpl, setSelectedTmpl] = useState<TemplateCardData>(TEMPLATE_SHOWCASE[0]);

  return (
    <div className="min-h-screen bg-[#07080c] text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-semibold mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Cinematic Design Collection</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white">
            Curated Occasion Templates
          </h1>
          <p className="text-sm sm:text-base text-slate-400 mt-3">
            Each template features an intentionally different aesthetic, typography hierarchy, particle engine, and animation style.
          </p>
        </div>

        {/* 3 Template Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {TEMPLATE_SHOWCASE.map((tmpl) => (
            <div
              key={tmpl.id}
              className={`rounded-3xl p-8 border flex flex-col justify-between transition-all duration-300 relative overflow-hidden backdrop-blur-xl ${
                tmpl.id === 'neon-night'
                  ? 'border-cyan-500/30 bg-slate-900/40 hover:border-cyan-400 shadow-[0_0_30px_-5px_rgba(6,182,212,0.2)]'
                  : tmpl.id === 'pastel-dream'
                  ? 'border-pink-400/30 bg-[#161220]/60 hover:border-pink-400 shadow-[0_0_30px_-5px_rgba(244,114,182,0.2)]'
                  : 'border-amber-400/30 bg-[#131622]/60 hover:border-amber-400 shadow-[0_0_30px_-5px_rgba(245,197,24,0.2)]'
              }`}
            >
              <div>
                {/* Palette Swatches */}
                <div className="flex gap-2 mb-6">
                  {tmpl.palette.map((color, i) => (
                    <div
                      key={i}
                      className="h-5 w-5 rounded-full border border-white/20 shadow-sm"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>

                <span className="text-xs uppercase font-bold tracking-wider text-slate-400 block mb-1">
                  {tmpl.tagline}
                </span>

                <h3 className="text-2xl font-black text-white mb-3">
                  {tmpl.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                  {tmpl.description}
                </p>

                <div className="pt-4 border-t border-white/10 space-y-2 mb-6">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide block">
                    Key Features:
                  </span>
                  {tmpl.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-6 border-t border-white/10 flex items-center justify-between gap-3">
                <Link
                  href={`/w/${tmpl.demoSlug}`}
                  target="_blank"
                  className="px-4 py-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-semibold text-white flex items-center gap-1.5 transition"
                >
                  <Eye className="h-3.5 w-3.5 text-amber-400" />
                  <span>Live Demo</span>
                </Link>

                <Link
                  href={`/create?template=${tmpl.id}`}
                  className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shadow-md shadow-amber-500/20"
                >
                  <span>Use Template</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
