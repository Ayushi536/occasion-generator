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
  /** Layered CSS background painted behind the whole public page (renderer). */
  pageBackground: string;
  /** Text selection colours for the public page. */
  selectionClass: string;
  /** Which hero backdrop/mid-layer scene to draw. */
  heroScene: HeroScene;
  /** Hero headline typography + colour (size/weight/font only for the hero). */
  heroHeadline: string;
  heroSubtext: string;
  heroBadge: string;
  heroBadgeIcon: string;
  heroBadgeAge: string;
  heroScrollHint: string;
  heroScrollDot: string;
  /** Audio pill (on / off states) used in the hero. */
  audioButton: string;
  audioActiveText: string;
  audioIcon: string;
  audioBars: [string, string, string, string];
  /** Hero scene colours (CSS colour strings, used in inline styles). */
  palette: { primary: string; secondary: string; tertiary: string; glow: string };
}

export type HeroScene = 'starfield' | 'bokeh' | 'rays';

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
    pageBackground:
      'radial-gradient(ellipse at 15% 0%, rgba(34,211,238,0.10), transparent 45%), radial-gradient(ellipse at 90% 30%, rgba(236,72,153,0.10), transparent 50%), #05070f',
    selectionClass: 'selection:bg-cyan-400 selection:text-slate-950',
    heroScene: 'starfield',
    heroHeadline: 'font-syne font-extrabold tracking-tight text-4xl sm:text-6xl md:text-7xl neon-glow-cyan text-cyan-300',
    heroSubtext: 'text-slate-200',
    heroBadge: 'border-cyan-400/40 bg-gradient-to-r from-cyan-500/20 via-pink-500/15 to-violet-500/20 text-cyan-200 shadow-[0_0_25px_rgba(6,182,212,0.35)]',
    heroBadgeIcon: 'text-cyan-300',
    heroBadgeAge: 'bg-pink-500/30 border-pink-300/40 text-white',
    heroScrollHint: 'text-slate-400 group-hover:text-cyan-300',
    heroScrollDot: 'bg-cyan-300 shadow-[0_0_8px_#22d3ee]',
    audioButton: 'border-cyan-400/40 hover:border-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.3)]',
    audioActiveText: 'text-cyan-300',
    audioIcon: 'text-cyan-300',
    audioBars: ['bg-cyan-400', 'bg-pink-400', 'bg-violet-400', 'bg-cyan-300'],
    palette: { primary: '#22d3ee', secondary: '#ec4899', tertiary: '#8b5cf6', glow: 'rgba(34,211,238,0.35)' },
  },
  'pastel-dream': {
    bgClass: 'bg-[#231634] text-pink-50',
    cardBg: 'bg-[#3a2653]/55 backdrop-blur-xl',
    cardBorder: 'border-pink-200/35 hover:border-pink-200/70 shadow-[0_8px_40px_-8px_rgba(251,207,232,0.30)]',
    textHeading: 'text-transparent bg-clip-text bg-gradient-to-r from-pink-200 via-rose-300 to-purple-200',
    textBody: 'text-pink-100/90',
    accentGlow: 'from-pink-500/15 via-rose-500/15 to-purple-500/15',
    primaryButton: 'bg-gradient-to-r from-pink-400 via-rose-400 to-purple-400 hover:from-pink-300 hover:to-purple-300 text-slate-950 font-semibold shadow-[0_0_20px_rgba(244,114,182,0.4)]',
    fontHeading: 'font-serif',
    fontDisplay: 'font-romantic tracking-normal',
    confettiColors: ['#f472b6', '#fb7185', '#c084fc', '#fbcfe8', '#fef08a'],
    ambientAudioDefault: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c6f44d99.mp3',
    pageBackground:
      'radial-gradient(circle at 12% 8%, rgba(251,207,232,0.20), transparent 42%), radial-gradient(circle at 88% 22%, rgba(196,181,253,0.20), transparent 45%), radial-gradient(circle at 50% 95%, rgba(253,230,138,0.10), transparent 40%), linear-gradient(180deg, #2a1b3d 0%, #231634 55%, #1c1229 100%)',
    selectionClass: 'selection:bg-pink-300 selection:text-[#2a1b3d]',
    heroScene: 'bokeh',
    heroHeadline: 'font-romantic font-normal tracking-normal text-5xl sm:text-7xl md:text-8xl leading-[1.05] text-transparent bg-clip-text bg-gradient-to-r from-pink-100 via-rose-200 to-violet-200',
    heroSubtext: 'text-pink-50/90',
    heroBadge: 'border-pink-200/50 bg-gradient-to-r from-pink-300/25 via-violet-300/20 to-amber-200/20 text-pink-100 shadow-[0_0_25px_rgba(244,114,182,0.3)]',
    heroBadgeIcon: 'text-amber-200',
    heroBadgeAge: 'bg-violet-300/30 border-violet-200/40 text-white',
    heroScrollHint: 'text-pink-200/70 group-hover:text-pink-100',
    heroScrollDot: 'bg-pink-200 shadow-[0_0_8px_#fbcfe8]',
    audioButton: 'border-pink-200/50 hover:border-pink-200 shadow-[0_0_20px_rgba(244,114,182,0.3)]',
    audioActiveText: 'text-pink-200',
    audioIcon: 'text-pink-200',
    audioBars: ['bg-pink-300', 'bg-violet-300', 'bg-amber-200', 'bg-rose-300'],
    palette: { primary: '#fbcfe8', secondary: '#c4b5fd', tertiary: '#fde68a', glow: 'rgba(251,207,232,0.35)' },
  },
  'royal-gold': {
    bgClass: 'bg-[#0b0a0c] text-amber-50',
    cardBg: 'bg-[#16110f]/85 backdrop-blur-xl',
    cardBorder: 'border-amber-400/30 hover:border-amber-400/60 shadow-[0_0_30px_-5px_rgba(245,197,24,0.25)]',
    textHeading: 'text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-yellow-500',
    textBody: 'text-amber-100/90',
    accentGlow: 'from-amber-500/20 via-red-900/25 to-amber-700/20',
    primaryButton: 'bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 hover:from-amber-200 hover:to-amber-400 text-slate-950 font-bold shadow-[0_0_25px_rgba(245,197,24,0.45)]',
    fontHeading: 'font-cinzel',
    fontDisplay: 'font-cinzel tracking-wider',
    confettiColors: ['#f59e0b', '#d4af37', '#fef08a', '#ffffff', '#e2e8f0'],
    ambientAudioDefault: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3',
    pageBackground:
      'radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.14), transparent 55%), radial-gradient(ellipse at 50% 100%, rgba(127,29,29,0.22), transparent 55%), #0b0a0c',
    selectionClass: 'selection:bg-amber-400 selection:text-slate-950',
    heroScene: 'rays',
    heroHeadline: 'font-cinzel font-black tracking-wider text-4xl sm:text-6xl md:text-7xl gold-gradient-text',
    heroSubtext: 'text-amber-100/90',
    heroBadge: 'border-amber-400/50 bg-gradient-to-r from-amber-500/20 via-yellow-600/15 to-red-900/30 text-amber-300 shadow-[0_0_25px_rgba(245,158,11,0.3)]',
    heroBadgeIcon: 'text-amber-400',
    heroBadgeAge: 'bg-amber-400/30 border-amber-300/40 text-white',
    heroScrollHint: 'text-amber-200/60 group-hover:text-amber-300',
    heroScrollDot: 'bg-amber-400 shadow-[0_0_8px_#f59e0b]',
    audioButton: 'border-amber-400/40 hover:border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.25)]',
    audioActiveText: 'text-amber-300',
    audioIcon: 'text-amber-400',
    audioBars: ['bg-amber-400', 'bg-yellow-300', 'bg-amber-200', 'bg-amber-500'],
    palette: { primary: '#d4af37', secondary: '#f5e6c8', tertiary: '#9f1d1d', glow: 'rgba(212,175,55,0.35)' },
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