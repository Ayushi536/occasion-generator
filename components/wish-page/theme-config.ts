import { TemplateType, OccasionType } from '@/lib/types';

export interface ThemeConfig {
  bgClass: string;
  cardBg: string;
  cardBorder: string;
  textHeading: string;
  textBody: string;
  accentGlow: string;
  primaryButton: string;
  fontHeading: string;
  fontDisplay: string;
  confettiColors: string[];
  ambientAudioDefault: string;
}

export const TEMPLATES: Record<TemplateType, ThemeConfig> = {
  'neon-night': {
    bgClass: 'bg-[#05070f] text-slate-100',
    cardBg: 'bg-slate-900/60 backdrop-blur-xl',
    cardBorder: 'border-cyan-500/30 hover:border-cyan-400/60 shadow-[0_0_25px_-5px_rgba(6,182,212,0.25)]',
    textHeading: 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-400 to-violet-400',
    textBody: 'text-slate-300',
    accentGlow: 'from-cyan-500/20 via-pink-500/20 to-violet-500/20',
    primaryButton: 'bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-cyan-400 hover:to-pink-400 text-slate-950 font-bold shadow-[0_0_20px_rgba(6,182,212,0.5)]',
    fontHeading: 'font-syne',
    fontDisplay: 'font-syne tracking-tight',
    confettiColors: ['#06b6d4', '#ec4899', '#8b5cf6', '#3b82f6', '#10b981'],
    ambientAudioDefault: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
  },
  'pastel-dream': {
    bgClass: 'bg-[#120f18] text-pink-50',
    cardBg: 'bg-[#1e1728]/70 backdrop-blur-xl',
    cardBorder: 'border-pink-300/25 hover:border-pink-300/50 shadow-[0_0_25px_-5px_rgba(244,114,182,0.2)]',
    textHeading: 'text-transparent bg-clip-text bg-gradient-to-r from-pink-200 via-rose-300 to-purple-200',
    textBody: 'text-pink-100/90',
    accentGlow: 'from-pink-500/15 via-rose-500/15 to-purple-500/15',
    primaryButton: 'bg-gradient-to-r from-pink-400 via-rose-400 to-purple-400 hover:from-pink-300 hover:to-purple-300 text-slate-950 font-semibold shadow-[0_0_20px_rgba(244,114,182,0.4)]',
    fontHeading: 'font-serif',
    fontDisplay: 'font-serif tracking-normal',
    confettiColors: ['#f472b6', '#fb7185', '#c084fc', '#fbcfe8', '#fef08a'],
    ambientAudioDefault: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c6f44d99.mp3',
  },
  'royal-gold': {
    bgClass: 'bg-[#090b10] text-amber-50',
    cardBg: 'bg-[#121622]/80 backdrop-blur-xl',
    cardBorder: 'border-amber-400/30 hover:border-amber-400/60 shadow-[0_0_30px_-5px_rgba(245,197,24,0.25)]',
    textHeading: 'text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-yellow-500',
    textBody: 'text-amber-100/90',
    accentGlow: 'from-amber-500/20 via-yellow-600/15 to-amber-700/20',
    primaryButton: 'bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 hover:from-amber-200 hover:to-amber-400 text-slate-950 font-bold shadow-[0_0_25px_rgba(245,197,24,0.45)]',
    fontHeading: 'font-cinzel',
    fontDisplay: 'font-cinzel tracking-wider',
    confettiColors: ['#f59e0b', '#d4af37', '#fef08a', '#ffffff', '#e2e8f0'],
    ambientAudioDefault: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3',
  },
};

export function getOccasionDecoration(occasion: OccasionType) {
  switch (occasion) {
    case 'birthday':
      return {
        badge: 'Birthday Celebration 🎂',
        floatingItems: ['🎈', '✨', '🧁', '🎉', '🎁'],
        icon: 'cake',
      };
    case 'anniversary':
      return {
        badge: 'Anniversary Milestone 💕',
        floatingItems: ['💖', '🌸', '✨', '🌹', '🕊️'],
        icon: 'heart',
      };
    case 'graduation':
      return {
        badge: 'Graduation Honors 🎓',
        floatingItems: ['🎓', '📜', '⭐', '✨', '🥂'],
        icon: 'award',
      };
    case 'love':
      return {
        badge: 'From The Heart 💌',
        floatingItems: ['❤️', '✨', '💐', '💫', '🌹'],
        icon: 'heart',
      };
    case 'milestone':
    case 'custom':
    default:
      return {
        badge: 'Special Celebration ✨',
        floatingItems: ['✨', '🌟', '🥂', '💫', '🎉'],
        icon: 'sparkles',
      };
  }
}
