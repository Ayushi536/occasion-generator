'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Plus,
  ExternalLink,
  Edit,
  Copy,
  Trash2,
  BarChart3,
  Eye,
  MessageSquareHeart,
  Flame,
  Sparkles,
  Share2,
  Check,
  Search,
  Filter,
  MessageCircle,
  X,
  QrCode,
} from 'lucide-react';
import { WishPage, UserSession } from '@/lib/types';

export default function DashboardPage() {
  const router = useRouter();
  const [pages, setPages] = useState<WishPage[]>([]);
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [shareModalPage, setShareModalPage] = useState<WishPage | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('wishly_token') : null;
        const reqHeaders: Record<string, string> = {};
        if (token) {
          reqHeaders['Authorization'] = `Bearer ${token}`;
        }

        const authRes = await fetch('/api/auth/me', { headers: reqHeaders });
        const authData = await authRes.json();
        if (!isMounted) return;

        let activeUser = authData.user;
        if (!activeUser && typeof window !== 'undefined') {
          const localUserStr = localStorage.getItem('wishly_user');
          if (localUserStr) {
            try {
              activeUser = JSON.parse(localUserStr);
            } catch {
              // ignore
            }
          }
        }

        if (!activeUser) {
          router.push('/login');
          return;
        }
        setUser(activeUser);

        const res = await fetch('/api/pages', { headers: reqHeaders });
        const data = await res.json();
        if (!isMounted) return;
        setPages(data.pages || []);
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, [router]);

  const handleDuplicate = async (id: string) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('wishly_token') : null;
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`/api/pages/${id}/duplicate`, {
        method: 'POST',
        headers,
      });
      if (res.ok) {
        const { page } = await res.json();
        setPages([page, ...pages]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this wish page?')) return;
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('wishly_token') : null;
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`/api/pages/${id}`, {
        method: 'DELETE',
        headers,
      });
      if (res.ok) {
        setPages(pages.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = (slug: string, id: string) => {
    const url = `${window.location.origin}/w/${slug}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  // Filter & Search
  const filteredPages = pages.filter((p) => {
    const matchesSearch =
      p.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.headline.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.occasion.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedFilter === 'all' ? true : p.status === selectedFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate insights overview
  const totalViews = pages.reduce((sum, p) => sum + (p.views || 0), 0);
  const totalVisitors = pages.reduce((sum, p) => sum + (p.uniqueVisitors || 0), 0);
  const totalWishes = pages.reduce((sum, p) => sum + (p.wishes?.length || 0), 0);

  return (
    <div className="min-h-screen bg-[#07080c] text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
              <span>Creator Dashboard</span>
              <Sparkles className="h-5 w-5 text-amber-400" />
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Manage your generated celebration pages, inspect visitor engagement, and share memories.
            </p>
          </div>

          <Link
            href="/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition shadow-lg shadow-amber-500/20"
          >
            <Plus className="h-4 w-4" />
            <span>Create New Wish</span>
          </Link>
        </div>

        {/* Aggregate Insights Metrics (Tabular figures) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block mb-1">Total Page Views</span>
              <span className="text-2xl font-bold font-mono text-white tabular-nums">
                {totalViews}
              </span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Eye className="h-5 w-5" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block mb-1">Unique Visitors</span>
              <span className="text-2xl font-bold font-mono text-white tabular-nums">
                {totalVisitors}
              </span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Sparkles className="h-5 w-5" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block mb-1">Wishes Received</span>
              <span className="text-2xl font-bold font-mono text-white tabular-nums">
                {totalWishes}
              </span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center">
              <MessageSquareHeart className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search recipient or occasion..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
            />
          </div>

          {/* Interactive filter tabs */}
          <div className="flex items-center gap-1 p-1 bg-white/5 border border-white/10 rounded-xl">
            {(['all', 'published', 'draft'] as const).map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setSelectedFilter(filter)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition capitalize ${
                  selectedFilter === filter
                    ? 'bg-amber-400 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Wish Pages List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-72 rounded-3xl bg-white/5 border border-white/10 animate-pulse" />
            ))}
          </div>
        ) : filteredPages.length === 0 ? (
          <div className="p-12 rounded-3xl border border-dashed border-white/10 bg-white/5 text-center">
            <Sparkles className="h-10 w-10 text-amber-400/60 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1">No wish pages found</h3>
            <p className="text-xs text-slate-400 mb-6">
              {searchTerm ? 'Try adjusting your search filters' : 'Create your very first personalized surprise page now.'}
            </p>
            <Link
              href="/create"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs"
            >
              <Plus className="h-4 w-4" />
              <span>Create Wish Page</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPages.map((page) => (
              <div
                key={page.id}
                className="rounded-3xl border border-white/10 bg-slate-900/50 backdrop-blur-xl overflow-hidden flex flex-col justify-between hover:border-amber-400/40 transition-all duration-300 group shadow-lg"
              >
                {/* Thumbnail & Header Banner */}
                <div>
                  <div className="relative h-40 w-full overflow-hidden bg-slate-950">
                    {page.photos[0] ? (
                      <img
                        src={page.photos[0].url}
                        alt={page.recipientName}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-4xl bg-gradient-to-br from-purple-900/40 to-slate-900">
                        ✨
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                    {/* Metadata chips (Unboxed clean text) */}
                    <div className="absolute top-3 left-3 text-[11px] font-semibold text-white/90 bg-black/60 px-2.5 py-1 rounded-lg backdrop-blur-md border border-white/10">
                      {page.occasion} · {page.template}
                    </div>

                    <div className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md border border-white/10">
                      <span className={page.status === 'published' ? 'text-emerald-400' : 'text-amber-400'}>
                        {page.status}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-lg font-bold text-white leading-tight truncate">
                        {page.recipientName}
                      </h3>
                      <p className="text-xs text-slate-300 truncate">
                        {page.headline}
                      </p>
                    </div>
                  </div>

                  {/* Body Metrics */}
                  <div className="p-4 grid grid-cols-3 gap-2 text-center border-b border-white/5 text-xs text-slate-400">
                    <div>
                      <span className="block text-[10px] uppercase">Views</span>
                      <strong className="text-white font-mono">{page.views || 0}</strong>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase">Wishes</span>
                      <strong className="text-white font-mono">{page.wishes?.length || 0}</strong>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase">Candles</span>
                      <strong className="text-white font-mono">{page.candlesCount || 0}</strong>
                    </div>
                  </div>
                </div>

                {/* Card Action Controls */}
                <div className="p-4 bg-white/[0.02] flex items-center justify-between gap-1 text-xs">
                  <Link
                    href={`/w/${page.slug}`}
                    target="_blank"
                    className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition flex items-center gap-1"
                    title="Open Page"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span>Open</span>
                  </Link>

                  <Link
                    href={`/pages/${page.id}/edit`}
                    className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition flex items-center gap-1"
                    title="Edit Page"
                  >
                    <Edit className="h-3.5 w-3.5" />
                    <span>Edit</span>
                  </Link>

                  <Link
                    href={`/pages/${page.id}/insights`}
                    className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition flex items-center gap-1"
                    title="Insights"
                  >
                    <BarChart3 className="h-3.5 w-3.5" />
                    <span>Insights</span>
                  </Link>

                  <button
                    onClick={() => setShareModalPage(page)}
                    className="p-2 rounded-xl text-amber-400 hover:text-white hover:bg-amber-400/20 transition flex items-center gap-1"
                    title="Share Page"
                  >
                    <Share2 className="h-3.5 w-3.5" />
                    <span>Share</span>
                  </button>

                  <button
                    onClick={() => handleDuplicate(page.id)}
                    className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition"
                    title="Duplicate Page"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>

                  <button
                    onClick={() => handleDelete(page.id)}
                    className="p-2 rounded-xl text-rose-400/80 hover:text-rose-400 hover:bg-rose-500/10 transition"
                    title="Delete Page"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Share Modal Dialog */}
        {shareModalPage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
            onClick={() => setShareModalPage(null)}
          >
            <div
              className="max-w-md w-full rounded-3xl border border-amber-500/30 bg-slate-900 p-6 sm:p-8 shadow-2xl relative space-y-5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider block">
                    Share Celebration
                  </span>
                  <h3 className="text-lg font-bold text-white">
                    For {shareModalPage.recipientName}
                  </h3>
                </div>
                <button
                  onClick={() => setShareModalPage(null)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* URL Box */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Permanent Shareable Link</span>
                  {copiedId === shareModalPage.id && (
                    <span className="text-emerald-400 text-[11px]">✓ Copied!</span>
                  )}
                </label>
                <div className="flex items-center gap-2 rounded-2xl bg-white/5 border border-white/10 p-2">
                  <input
                    type="text"
                    readOnly
                    value={typeof window !== 'undefined' ? `${window.location.origin}/w/${shareModalPage.slug}` : ''}
                    className="bg-transparent text-xs text-slate-200 px-2 flex-1 focus:outline-none truncate font-mono select-all"
                  />
                  <button
                    type="button"
                    onClick={() => handleShare(shareModalPage.slug, shareModalPage.id)}
                    className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition cursor-pointer shrink-0"
                  >
                    {copiedId === shareModalPage.id ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedId === shareModalPage.id ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const url = `${window.location.origin}/w/${shareModalPage.slug}`;
                    const text = `🎉 Open this special celebration surprise for *${shareModalPage.recipientName}*!\n\nTap to experience the music, memory timeline & personalized wishes:\n👉 ${url}`;
                    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
                  }}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-emerald-950/30"
                >
                  <MessageCircle className="h-4 w-4 fill-slate-950" />
                  <span>Share Directly to WhatsApp</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href={`/create/${shareModalPage.id}/review`}
                    className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs flex items-center justify-center gap-1.5 border border-white/10 transition"
                  >
                    <QrCode className="h-3.5 w-3.5 text-amber-400" />
                    <span>Download QR Tag</span>
                  </Link>

                  <Link
                    href={`/w/${shareModalPage.slug}`}
                    target="_blank"
                    className="py-2.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition"
                  >
                    <span>Open Live Page</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
