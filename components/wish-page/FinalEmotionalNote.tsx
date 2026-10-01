'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import QRCode from 'qrcode';
import {
  Share2,
  Copy,
  Check,
  Download,
  RotateCcw,
  Sparkles,
  Heart,
  MessageCircle,
  Gift,
  Award,
} from 'lucide-react';
import { WishPage } from '@/lib/types';
import { TEMPLATES } from './theme-config';

interface FinalEmotionalNoteProps {
  page: WishPage;
}

const CLOSING_STYLES = {
  'neon-night': {
    secret: 'border-cyan-400/30 bg-[#071426]/75 shadow-[0_0_55px_rgba(34,211,238,0.12)]',
    hub: 'border-cyan-400/25 bg-gradient-to-br from-[#071426]/95 via-[#080b18]/95 to-[#18091a]/95',
    glow: 'bg-cyan-400/15',
    eyebrow: 'border-cyan-400/30 bg-cyan-400/10 text-cyan-200',
    accentText: 'text-cyan-300',
    keepsake: 'from-[#071426] to-[#120917] border-cyan-400/40',
    title: 'Keep the signal glowing',
    noteLabel: 'One final transmission',
    canvas: { background: '#05070f', panel: '#0a1426', accent: '#22d3ee', muted: '#a5f3fc' },
  },
  'pastel-dream': {
    secret: 'border-pink-200/35 bg-[#4b315f]/55 shadow-[0_24px_70px_rgba(20,8,30,0.22)] rounded-[3.5rem]',
    hub: 'border-pink-200/25 bg-gradient-to-br from-[#4b315f]/80 via-[#2f203f]/95 to-[#231634]/95 rounded-[3.5rem]',
    glow: 'bg-pink-200/15',
    eyebrow: 'border-pink-200/40 bg-pink-200/10 text-pink-100',
    accentText: 'text-pink-200',
    keepsake: 'from-[#4b315f] to-[#24172f] border-pink-200/40 rounded-[2rem]',
    title: 'Keep this little piece of us',
    noteLabel: 'A note tucked between the petals',
    canvas: { background: '#231634', panel: '#3a2653', accent: '#fbcfe8', muted: '#e9d5ff' },
  },
  'royal-gold': {
    secret: 'border-amber-400/35 bg-[#16110f]/85 shadow-[0_26px_80px_rgba(0,0,0,0.35)] rounded-t-[4rem]',
    hub: 'border-amber-400/30 bg-gradient-to-b from-[#1d1611]/95 via-[#100d0b]/95 to-black rounded-t-[4rem]',
    glow: 'bg-amber-400/15',
    eyebrow: 'border-amber-400/35 bg-amber-400/10 text-amber-200',
    accentText: 'text-amber-300',
    keepsake: 'from-[#1d1611] to-black border-amber-400/45',
    title: 'Preserve this commemorative edition',
    noteLabel: 'The closing inscription',
    canvas: { background: '#0b0a0c', panel: '#16110f', accent: '#d4af37', muted: '#f5e6c8' },
  },
} as const;

export default function FinalEmotionalNote({ page }: FinalEmotionalNoteProps) {
  const theme = TEMPLATES[page.template] || TEMPLATES['neon-night'];
  const closing = CLOSING_STYLES[page.template] || CLOSING_STYLES['neon-night'];
  const shouldReduceMotion = useReducedMotion();
  const [copied, setCopied] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [isGeneratingKeepsake, setIsGeneratingKeepsake] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentUrl = `${window.location.origin}/w/${page.slug}`;

      // Generate ultra-sharp QR code with gold dark tone
      QRCode.toDataURL(currentUrl, {
        width: 480,
        margin: 2,
        color: {
          dark: closing.canvas.background,
          light: '#ffffff',
        },
      })
        .then((dataUrl) => setQrCodeDataUrl(dataUrl))
        .catch((err) => console.error('QR code generation error:', err));
    }
  }, [closing.canvas.background, page.slug]);

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/w/${page.slug}` : `https://wishly.app/w/${page.slug}`;

  const handleCopyLink = async () => {
    const urlToCopy = shareUrl || (typeof window !== 'undefined' ? `${window.location.origin}/w/${page.slug}` : '');
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(urlToCopy);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = urlToCopy;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  // High-Resolution Luxury Printable Keepsake Tag Generator
  const handleDownloadLuxuryTag = async () => {
    if (!qrCodeDataUrl) return;
    setIsGeneratingKeepsake(true);

    try {
      const canvas = document.createElement('canvas');
      const width = 800;
      const height = 1100;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // 1. Rich Velvet Background
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, closing.canvas.background);
      bgGrad.addColorStop(0.5, closing.canvas.panel);
      bgGrad.addColorStop(1, closing.canvas.background);
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Luxury Double Gold Foil Border
      ctx.strokeStyle = closing.canvas.accent;
      ctx.lineWidth = 4;
      ctx.strokeRect(30, 30, width - 60, height - 60);

      ctx.globalAlpha = 0.45;
      ctx.strokeStyle = closing.canvas.accent;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(42, 42, width - 84, height - 84);
      ctx.globalAlpha = 1;

      // 3. Hanging Tag Eyelet at Top
      ctx.beginPath();
      ctx.arc(width / 2, 80, 16, 0, Math.PI * 2);
      ctx.fillStyle = closing.canvas.background;
      ctx.fill();
      ctx.strokeStyle = closing.canvas.accent;
      ctx.lineWidth = 3;
      ctx.stroke();

      // Inner Eyelet Hole
      ctx.beginPath();
      ctx.arc(width / 2, 80, 8, 0, Math.PI * 2);
      ctx.fillStyle = '#1e2230';
      ctx.fill();

      // 4. Header Typography
      ctx.fillStyle = closing.canvas.muted;
      ctx.font = 'bold 20px "Cinzel", "Georgia", serif';
      ctx.textAlign = 'center';
      ctx.fillText('W I S H L Y   E X C L U S I V E', width / 2, 160);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '14px sans-serif';
      ctx.fillText('INTERACTIVE CELEBRATION SURPRISE', width / 2, 190);

      // Decorative divider
      ctx.strokeStyle = closing.canvas.accent;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(width / 2 - 120, 215);
      ctx.lineTo(width / 2 + 120, 215);
      ctx.stroke();

      // 5. Recipient Name
      ctx.fillStyle = '#ffffff';
      ctx.font = '16px "Georgia", serif';
      ctx.fillText('Special Tribute Crafted For', width / 2, 260);

      ctx.fillStyle = closing.canvas.accent;
      ctx.font = 'bold 44px "Cinzel", "Georgia", serif';
      ctx.fillText(page.recipientName, width / 2, 320);

      if (page.occasion) {
        ctx.fillStyle = '#cbd5e1';
        ctx.font = 'bold 15px sans-serif';
        ctx.fillText(`• ${page.occasion.toUpperCase()} KEEPSAKE EDITION •`, width / 2, 360);
      }

      // 6. Draw the QR Code with Luxury Matting
      const qrImg = new Image();
      qrImg.crossOrigin = 'anonymous';
      qrImg.src = qrCodeDataUrl;

      await new Promise<void>((resolve) => {
        qrImg.onload = () => {
          const qrSize = 360;
          const qrX = (width - qrSize) / 2;
          const qrY = 410;

          // QR Card background with gold border
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.roundRect(qrX - 16, qrY - 16, qrSize + 32, qrSize + 32, 24);
          ctx.fill();
          ctx.strokeStyle = closing.canvas.accent;
          ctx.lineWidth = 3;
          ctx.stroke();

          // Draw the QR
          ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
          resolve();
        };
      });

      // 7. Instruction and Footer
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px "Cinzel", serif';
      ctx.fillText('SCAN WITH YOUR PHONE CAMERA', width / 2, 850);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '15px sans-serif';
      ctx.fillText('To open your personalized cinematic celebration story & music', width / 2, 885);

      // Gold Seal Emblem
      ctx.fillStyle = closing.canvas.accent;
      ctx.font = '14px monospace';
      ctx.fillText(`PERPETUAL LINK: wishly.app/w/${page.slug}`, width / 2, 950);

      ctx.fillStyle = '#64748b';
      ctx.font = '12px sans-serif';
      ctx.fillText('Tie this card to your gift box, cake, flowers, or greeting card.', width / 2, 1020);

      // Download the image
      const tagDataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = tagDataUrl;
      a.download = `wishly-luxury-tag-${page.slug}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error('Failed to generate keepsake tag:', err);
    } finally {
      setIsGeneratingKeepsake(false);
    }
  };

  const handleReplay = () => {
    window.scrollTo({ top: 0, behavior: shouldReduceMotion ? 'auto' : 'smooth' });
  };

  // WhatsApp & Native Share Handler
  const effectiveShareUrl = shareUrl || (typeof window !== 'undefined' ? `${window.location.origin}/w/${page.slug}` : `https://wishly.app/w/${page.slug}`);
  const shareTitle = `✨ A Celebration Surprise for ${page.recipientName}!`;
  const shareMessageText = `🎉 Open this special celebration surprise created for *${page.recipientName}*!\n\nTap to experience the music, memory timeline & personalized wishes:\n👉 ${effectiveShareUrl}`;

  const handleWhatsAppShare = () => {
    // Official wa.me universal URL - works across mobile apps and web
    const waUrl = `https://wa.me/?text=${encodeURIComponent(shareMessageText)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: `A special personalized celebration surprise for ${page.recipientName}!`,
          url: effectiveShareUrl,
        });
      } catch {
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <section className="relative py-24 px-4 sm:px-6 max-w-4xl mx-auto">
      {/* Secret Note / Final Emotional Card */}
      {page.secretNote && (
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className={`rounded-3xl p-8 sm:p-12 mb-16 border ${closing.secret} text-center relative overflow-hidden`}
        >
          <div className="absolute inset-x-10 top-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${theme.palette.primary}, transparent)` }} aria-hidden="true" />
          <div className={`flex items-center justify-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] mb-4 ${closing.accentText}`}>
            {page.occasion === 'anniversary' || page.occasion === 'love' ? (
              <Heart className="h-4 w-4" aria-hidden="true" />
            ) : page.occasion === 'graduation' || page.occasion === 'milestone' ? (
              <Award className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Sparkles className="h-4 w-4" aria-hidden="true" />
            )}
            <span>{closing.noteLabel}</span>
          </div>

          <p className="text-xl sm:text-2xl font-serif text-white italic max-w-2xl mx-auto leading-relaxed drop-shadow-md">
            &ldquo;{page.secretNote}&rdquo;
          </p>

          <div className="mt-6 flex items-center justify-center gap-3 text-xs text-slate-400">
            <span>Always in your corner</span>
            <span aria-hidden="true" className="text-amber-400">✦</span>
            <span>Forever cherished</span>
          </div>
        </motion.div>
      )}

      {/* Luxury Share & Printable Keepsake Hub */}
      <div className={`rounded-3xl p-8 sm:p-12 border ${closing.hub} backdrop-blur-2xl shadow-2xl relative overflow-hidden`}>
        {/* Ambient Top Glow */}
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-96 h-28 ${closing.glow} blur-3xl pointer-events-none`} />

        <div className="text-center mb-10 relative z-10">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold mb-3 shadow-inner ${closing.eyebrow}`}>
            <Gift className="h-3.5 w-3.5" />
            <span>Personal keepsake</span>
          </div>
          <h3 className={`text-2xl sm:text-4xl font-extrabold text-white ${theme.fontHeading}`}>
            {closing.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-md mx-auto">
            This personalized site lives on a perpetual unique link. Download the luxury printable gift tag or share via WhatsApp!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
          {/* Printable Luxury Gift Tag Card (5 Cols) */}
          <div className={`md:col-span-5 flex flex-col items-center p-6 rounded-3xl bg-gradient-to-b border-2 shadow-2xl relative group transition ${closing.keepsake}`}>
            {/* Tag Hanging Eyelet */}
            <div className="h-5 w-5 rounded-full border-2 bg-black flex items-center justify-center shadow-inner mb-2" style={{ borderColor: theme.palette.primary }}>
              <div className="h-2 w-2 rounded-full bg-slate-800" />
            </div>

            <span className="text-[10px] uppercase tracking-widest font-mono text-amber-300/80 mb-1">
              WISHLY LUXURY TAG
            </span>

            <h4 className="text-sm font-bold text-white text-center font-serif truncate max-w-[200px]">
              For {page.recipientName}
            </h4>

            {/* QR Code Container */}
            <div className="mt-3 p-3 bg-white rounded-2xl shadow-2xl border-2 relative" style={{ borderColor: theme.palette.primary }}>
              {qrCodeDataUrl ? (
                <img
                  src={qrCodeDataUrl}
                  alt={`QR Code for ${page.recipientName}`}
                  loading="lazy"
                  decoding="async"
                  className="w-44 h-44 object-contain"
                />
              ) : (
                <div className="w-44 h-44 rounded-xl bg-slate-800 animate-pulse" />
              )}
            </div>

            <p className="text-[11px] text-amber-200/90 font-medium mt-3 text-center">
              Scan with camera to unbox story
            </p>

            <button
              onClick={handleDownloadLuxuryTag}
              disabled={isGeneratingKeepsake || !qrCodeDataUrl}
              className={`mt-4 w-full flex items-center justify-center gap-2 text-xs font-bold transition py-2.5 px-4 rounded-xl cursor-pointer disabled:opacity-50 ${theme.primaryButton}`}
            >
              <Download className="h-3.5 w-3.5" />
              <span>{isGeneratingKeepsake ? 'Crafting High-Res Tag...' : 'Download Printable Gift Tag'}</span>
            </button>
            <span className="text-[10px] text-slate-400 mt-1">High-res PNG with gold border & name</span>
          </div>

          {/* Action Hub & Direct Sharing (7 Cols) */}
          <div className="md:col-span-7 space-y-4">
            {/* Share URL Box */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Permanent Shareable Link</span>
                {copied && <span className="text-emerald-400 font-normal text-[11px]">✓ Copied to clipboard!</span>}
              </label>
              <div className="flex items-center gap-2 rounded-2xl bg-white/5 border border-white/15 p-2 focus-within:border-amber-400 transition">
                <input
                  type="text"
                  readOnly
                  value={effectiveShareUrl}
                  className="bg-transparent text-xs text-slate-200 px-3 flex-1 focus:outline-none truncate font-mono select-all"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className={`flex items-center gap-1.5 py-2 px-4 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${theme.primaryButton}`}
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Direct WhatsApp Share Button */}
            <button
              type="button"
              onClick={handleWhatsAppShare}
              className="w-full py-4 px-6 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2.5 transition shadow-xl shadow-emerald-950/40 cursor-pointer group"
            >
              <MessageCircle className="h-5 w-5 fill-slate-950 group-hover:scale-110 transition-transform" />
              <span>Share Directly to WhatsApp</span>
            </button>

            {/* Native Mobile Share / Social Grid */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleNativeShare}
                className="py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Share2 className="h-4 w-4 text-amber-400" />
                <span>Device Share</span>
              </button>

              <button
                type="button"
                onClick={handleReplay}
                className="py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <RotateCcw className="h-4 w-4 text-amber-400" />
                <span>Replay Story</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
