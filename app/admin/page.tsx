'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Shield,
  Users,
  FileText,
  Eye,
  MessageSquareHeart,
  Flame,
  Trash2,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Sparkles,
} from 'lucide-react';
import { WishPage, UserRecord } from '@/lib/types';

interface AdminData {
  stats: {
    totalUsers: number;
    totalPages: number;
    publishedPages: number;
    totalViews: number;
    totalWishes: number;
    totalCandles: number;
  };
  users: Array<Omit<UserRecord, 'passwordHash'>>;
  pages: WishPage[];
}

export default function AdminControlRoom() {
  const router = useRouter();
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pages' | 'wishes' | 'users'>('pages');

  const fetchAdminData = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('wishly_token') : null;
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/admin', { headers });
      if (res.status === 403 || res.status === 401) {
        alert('Admin authorization required. Please sign in as admin.');
        router.push('/login');
        return;
      }
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    async function initAdmin() {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('wishly_token') : null;
        const headers: Record<string, string> = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch('/api/admin', { headers });
        if (!isMounted) return;
        if (res.status === 403 || res.status === 401) {
          router.push('/login');
          return;
        }
        const json = await res.json();
        if (!isMounted) return;
        setData(json);
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    initAdmin();
    return () => {
      isMounted = false;
    };
  }, [router]);

  const handleToggleStatus = async (pageId: string) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('wishly_token') : null;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/admin', {
        method: 'POST',
        headers,
        body: JSON.stringify({ action: 'toggle_page_status', pageId }),
      });
      if (res.ok) {
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePage = async (pageId: string) => {
    if (!confirm('Are you sure you want to delete this page permanently?')) return;
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('wishly_token') : null;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/admin', {
        method: 'POST',
        headers,
        body: JSON.stringify({ action: 'delete_page', pageId }),
      });
      if (res.ok) {
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteWish = async (pageId: string, wishId: string) => {
    if (!confirm('Moderate and delete this wish?')) return;
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('wishly_token') : null;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/admin', {
        method: 'POST',
        headers,
        body: JSON.stringify({ action: 'delete_wish', pageId, wishId }),
      });
      if (res.ok) {
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07080c] flex items-center justify-center text-white">
        <Sparkles className="h-8 w-8 text-amber-400 animate-spin" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-[#07080c] text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-amber-400" />
              <h1 className="text-3xl font-extrabold text-white">Admin Control Room</h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Platform-wide moderation, metrics telemetry, and user management.
            </p>
          </div>
        </div>

        {/* Global Platform Statistics (Tabular numerals) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-slate-400 uppercase block mb-1">Users</span>
            <span className="text-2xl font-bold font-mono text-white tabular-nums">
              {data.stats.totalUsers}
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-slate-400 uppercase block mb-1">Wish Pages</span>
            <span className="text-2xl font-bold font-mono text-white tabular-nums">
              {data.stats.totalPages}
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-slate-400 uppercase block mb-1">Published</span>
            <span className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
              {data.stats.publishedPages}
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-slate-400 uppercase block mb-1">Total Views</span>
            <span className="text-2xl font-bold font-mono text-cyan-400 tabular-nums">
              {data.stats.totalViews}
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-slate-400 uppercase block mb-1">Guest Wishes</span>
            <span className="text-2xl font-bold font-mono text-pink-400 tabular-nums">
              {data.stats.totalWishes}
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-slate-400 uppercase block mb-1">Candle Blows</span>
            <span className="text-2xl font-bold font-mono text-amber-400 tabular-nums">
              {data.stats.totalCandles}
            </span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 p-1 bg-white/5 border border-white/10 rounded-2xl w-fit mb-6">
          <button
            onClick={() => setActiveTab('pages')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              activeTab === 'pages' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Pages Moderation ({data.pages.length})
          </button>
          <button
            onClick={() => setActiveTab('wishes')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              activeTab === 'wishes' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Wishes Moderation
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              activeTab === 'users' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Registered Users ({data.users.length})
          </button>
        </div>

        {/* TAB 1: Pages Moderation */}
        {activeTab === 'pages' && (
          <div className="rounded-3xl border border-white/10 bg-slate-900/50 backdrop-blur-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-white/10 bg-white/5 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                  <tr>
                    <th className="p-4">Recipient & Headline</th>
                    <th className="p-4">Occasion & Style</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 font-mono tabular-nums">Views</th>
                    <th className="p-4 font-mono tabular-nums">Wishes</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {data.pages.map((p) => (
                    <tr key={p.id} className="hover:bg-white/[0.02] transition">
                      <td className="p-4">
                        <div className="font-bold text-white text-sm">{p.recipientName}</div>
                        <div className="text-slate-400 text-[11px] truncate max-w-xs">{p.headline}</div>
                        <div className="font-mono text-[10px] text-amber-400/90 mt-0.5">/w/{p.slug}</div>
                      </td>
                      <td className="p-4 capitalize text-slate-300">
                        <div>{p.occasion}</div>
                        <div className="text-[10px] text-slate-500">{p.template}</div>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleToggleStatus(p.id)}
                          className={`px-2.5 py-1 rounded-md text-[10px] font-bold border transition ${
                            p.status === 'published'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          }`}
                        >
                          {p.status}
                        </button>
                      </td>
                      <td className="p-4 font-mono tabular-nums text-slate-200">{p.views}</td>
                      <td className="p-4 font-mono tabular-nums text-slate-200">{p.wishes?.length || 0}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/w/${p.slug}`}
                            target="_blank"
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition"
                            title="Inspect Live"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Link>
                          <button
                            onClick={() => handleDeletePage(p.id)}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition"
                            title="Delete Permanently"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: Wishes Moderation */}
        {activeTab === 'wishes' && (
          <div className="space-y-4">
            {data.pages
              .filter((p) => p.wishes && p.wishes.length > 0)
              .map((p) => (
                <div key={p.id} className="p-6 rounded-3xl border border-white/10 bg-slate-900/50 backdrop-blur-xl">
                  <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
                    <span className="text-sm font-bold text-white">
                      Wishes for <strong className="text-amber-400">{p.recipientName}</strong> ({p.wishes.length})
                    </span>
                    <Link href={`/w/${p.slug}`} target="_blank" className="text-xs text-slate-400 hover:text-white flex items-center gap-1">
                      <span>View Page</span>
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {p.wishes.map((w) => (
                      <div key={w.id} className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <span className="text-xl">{w.avatarEmoji || '🎈'}</span>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-white">{w.authorName}</span>
                              {w.relationship && <span className="text-[10px] text-amber-400">({w.relationship})</span>}
                            </div>
                            <p className="text-xs text-slate-300 mt-1">{w.message}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteWish(p.id, w.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 transition"
                          title="Remove Wish"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* TAB 3: Registered Users */}
        {activeTab === 'users' && (
          <div className="rounded-3xl border border-white/10 bg-slate-900/50 backdrop-blur-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 bg-white/5 text-slate-400 uppercase text-[10px] font-semibold">
                <tr>
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Created Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data.users.map((u) => (
                  <tr key={u.id} className="hover:bg-white/[0.02]">
                    <td className="p-4 font-bold text-white">{u.name}</td>
                    <td className="p-4 font-mono text-slate-300">{u.email}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.role === 'admin' ? 'bg-purple-500/20 text-purple-300' : 'bg-white/10 text-slate-300'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400 text-[11px]">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
