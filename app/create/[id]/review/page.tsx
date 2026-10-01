'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  Download,
  Share2,
  Edit,
  ArrowRight,
  MessageCircle,
} from 'lucide-react';
import { WishPage } from '@/lib/types';

export default function ReviewPublishPage() {
  const params = useParams();
  const router = useRouter();
  const pageId = params.id as string;

  const [page, setPage] = useState<WishPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [published, setPublished] = useState(false);

  useEffect(() => {
    fetch(`/api/pages/${pageId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then((data) => {
        setPage(data.page);
        setPublished(data.page.status === 'published');
        setLoading(false);

        // Generate QR code
        const url = `${window.location.origin}/w/${data.page.slug}`;
        QRCode.toDataURL(url, {
          width: 280,
          margin: 2,
          color: { dark: '#0a0d14', light: '#ffffff' },
        }).then((dataUrl) => setQrCodeUrl(dataUrl));
      })
      .catch(() => {
        setLoading(false);
      });
  }, [pageId]);

  const shareUrl = typeof window !== 'undefined' && page ? `${window.location.origin}/w/${page.slug}` : '';

  const handlePublishNow = async () => {
    try {
      await fetch(`/api/pages/${pageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'published' }),
      });
      setPublished(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopy = async () => {
    const url = shareUrl || (typeof window !== 'undefined' && page ? `${window.location.origin}/w/${page.slug}` : '');
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = url;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleWhatsAppShare = () => {
    if (!page) return;
    const url = shareUrl || (typeof window !== 'undefined' ? `${window.location.origin}/w/${page.slug}` : `https://wishly.app/w/${page.slug}`);
    const text = `🎉 Open this special celebration surprise for *${page.recipientName}*!\n\nTap to experience the music, memory timeline & personalized wishes:\n👉 ${url}`;
    const waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleNativeShare = async () => {
    if (!page) return;
    const url = shareUrl || (typeof window !== 'undefined' ? `${window.location.origin}/w/${page.slug}` : `https://wishly.app/w/${page.slug}`);
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Celebration Surprise for ${page.recipientName}`,
          text: `Open this interactive celebration story for ${page.recipientName}!`,
          url,
        });
      } catch {
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  const handleDownloadQR = () => {
    if (!qrCodeUrl || !page) return;
    const a = document.createElement('a');
    a.href = qrCodeUrl;
    a.download = `wishly-qr-${page.slug}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07080c] flex items-center justify-center text-white">
        <Sparkles className="h-8 w-8 text-amber-400 animate-spin" />
      </div>
    );
  }

  if (!page) {
    return (
      <div className="min-h-screen bg-[#07080c] flex flex-col items-center justify-center text-white p-6 text-center">
        <h2 className="text-xl font-bold mb-2">Page Not Found</h2>
        <Link href="/create" className="text-amber-400 underline text-sm">
          Create a new wish page
        </Link>
      </div>
    );
  }

  // Pre-publish checklist verification
  const checklist = [
    { label: 'Occasion selected', pass: Boolean(page.occasion) },
    { label: 'Recipient name provided', pass: Boolean(page.recipientName) },
    { label: 'Heartfelt message written', pass: page.paragraphs.length >= 1 },
    { label: 'Memory photos uploaded', pass: page.photos.length >= 1 },
    { label: 'Template and animations configured', pass: Boolean(page.template) },
  ];

  return (
    <div className="min-h-screen bg-[#07080c] text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Ready for Celebration</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            {page.headline}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Review your generated occasion site before sending it to {page.recipientName}.
          </p>
        </div>

        {/* Verification Checklist */}
        <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md mb-8">
          <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span>Verification Checklist</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {checklist.map((c, i) => (
              <div key={i} className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className={`h-4 w-4 ${c.pass ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span>{c.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Share & Preview Hub */}
        <div className="p-8 rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-2xl mb-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-400 uppercase tracking-wider block">
                Permanent Shareable URL
              </span>
              <span className="text-sm sm:text-base font-mono text-amber-300 font-semibold truncate max-w-sm block">
                {shareUrl}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? 'Copied Link!' : 'Copy Link'}</span>
              </button>
              <Link
                href={`/w/${page.slug}`}
                target="_blank"
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-amber-500/20"
              >
                <span>Open Wish Page</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            {/* QR Code */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
              {qrCodeUrl && (
                <div className="p-2 bg-white rounded-xl shrink-0">
                  <img src={qrCodeUrl} alt="QR Code" className="w-24 h-24 object-contain" />
                </div>
              )}
              <div>
                <h4 className="text-xs font-bold text-white">Printable QR Code</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Stick this on a physical gift, greeting card, or cake box!
                </p>
                <button
                  onClick={handleDownloadQR}
                  className="mt-2 text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold"
                >
                  <Download className="h-3 w-3" />
                  <span>Download PNG</span>
                </button>
              </div>
            </div>

            {/* Quick Share to WhatsApp & Device */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleWhatsAppShare}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2.5 transition shadow-lg shadow-emerald-950/30 cursor-pointer"
              >
                <MessageCircle className="h-4 w-4 fill-slate-950" />
                <span>Share Directly to WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={handleNativeShare}
                className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium text-xs flex items-center justify-center gap-2 border border-white/10 transition cursor-pointer"
              >
                <Share2 className="h-3.5 w-3.5 text-amber-400" />
                <span>Share via Phone Apps (Instagram, AirDrop, etc.)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            href={`/pages/${page.id}/edit`}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition"
          >
            <Edit className="h-3.5 w-3.5" />
            <span>Make Changes / Edit Page</span>
          </Link>

          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 transition"
          >
            <span>Go to My Wish Dashboard</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
