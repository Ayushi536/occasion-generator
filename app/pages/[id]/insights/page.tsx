'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  BarChart3,
  Eye,
  Users,
  MessageSquareHeart,
  Flame,
  ArrowLeft,
  Sparkles,
  ExternalLink,
  Calendar,
} from 'lucide-react';
import { WishPage } from '@/lib/types';

export default function PageInsights() {
  const params = useParams();
  const pageId = params.id as string;

  const [page, setPage] = useState<WishPage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('wishly_token') : null;
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    fetch(`/api/pages/${pageId}`, { headers })
      .then((res) => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then((data) => {
        setPage(data.page);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [pageId]);

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
        <Link href="/dashboard" className="text-amber-400 underline text-sm">
          Return to dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07080c] text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Link>

          <Link
            href={`/w/${page.slug}`}
            target="_blank"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 text-xs font-medium text-slate-200 hover:bg-white/10 transition"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>Open Live Wish</span>
          </Link>
        </div>

        {/* Page Header */}
        <div className="mb-10">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
            Real-Time Analytics
          </span>
          <h1 className="text-3xl font-extrabold text-white mt-1">
            Insights for {page.recipientName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Created on {new Date(page.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })} · Template: {page.template}
          </p>
        </div>

        {/* 4 Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div className="p-6 rounded-2xl border border-white/10 bg-white/5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400 font-medium">Total Views</span>
              <Eye className="h-4 w-4 text-cyan-400" />
            </div>
            <span className="text-3xl font-bold font-mono text-white tabular-nums">
              {page.views || 0}
            </span>
            <span className="text-[11px] text-slate-500 mt-2">Cumulative visits</span>
          </div>

          <div className="p-6 rounded-2xl border border-white/10 bg-white/5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400 font-medium">Unique Visitors</span>
              <Users className="h-4 w-4 text-purple-400" />
            </div>
            <span className="text-3xl font-bold font-mono text-white tabular-nums">
              {page.uniqueVisitors || 0}
            </span>
            <span className="text-[11px] text-slate-500 mt-2">Distinct devices</span>
          </div>

          <div className="p-6 rounded-2xl border border-white/10 bg-white/5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400 font-medium">Wishes Left</span>
              <MessageSquareHeart className="h-4 w-4 text-pink-400" />
            </div>
            <span className="text-3xl font-bold font-mono text-white tabular-nums">
              {page.wishes?.length || 0}
            </span>
            <span className="text-[11px] text-slate-500 mt-2">Community posts</span>
          </div>

          <div className="p-6 rounded-2xl border border-white/10 bg-white/5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400 font-medium">Candle Blows</span>
              <Flame className="h-4 w-4 text-amber-400" />
            </div>
            <span className="text-3xl font-bold font-mono text-white tabular-nums">
              {page.candlesCount || 0}
            </span>
            <span className="text-[11px] text-slate-500 mt-2">Interactive sparks</span>
          </div>
        </div>

        {/* Guestbook Wishes List */}
        <div className="p-8 rounded-3xl border border-white/10 bg-slate-900/50 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <MessageSquareHeart className="h-5 w-5 text-pink-400" />
              <span>Messages from Well-Wishers ({page.wishes?.length || 0})</span>
            </h3>
          </div>

          {page.wishes?.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">
              No wishes posted yet. Share your page link to collect notes!
            </p>
          ) : (
            <div className="space-y-4">
              {page.wishes.map((w) => (
                <div
                  key={w.id}
                  className="p-4 rounded-xl border border-white/5 bg-white/5 flex items-start gap-3"
                >
                  <span className="text-2xl">{w.avatarEmoji || '🎈'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2 mb-1">
                      <strong className="text-xs text-white">{w.authorName}</strong>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {new Date(w.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {w.relationship && (
                      <span className="text-[11px] text-amber-400 block mb-1">
                        {w.relationship}
                      </span>
                    )}
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {w.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
