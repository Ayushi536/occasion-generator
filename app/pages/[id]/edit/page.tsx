'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Sparkles,
  Save,
  ArrowLeft,
  Trash2,
  Plus,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import { WishPage, TemplateType, LanguageType } from '@/lib/types';
import { TEMPLATES } from '@/components/wish-page/theme-config';

export default function EditWishPage() {
  const params = useParams();
  const router = useRouter();
  const pageId = params.id as string;

  const [page, setPage] = useState<WishPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!page) return;

    setSaving(true);
    setSavedSuccess(false);

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('wishly_token') : null;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`/api/pages/${pageId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(page),
      });

      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
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
        <Link href="/dashboard" className="text-amber-400 underline text-sm">
          Return to dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07080c] text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8">
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
            <Eye className="h-3.5 w-3.5" />
            <span>View Live Page</span>
          </Link>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="p-8 rounded-3xl border border-white/10 bg-slate-900/50 backdrop-blur-xl space-y-6">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <span>Edit Celebration:</span>
              <span className="text-amber-400">{page.recipientName}</span>
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Recipient Name
                </label>
                <input
                  type="text"
                  value={page.recipientName}
                  onChange={(e) => setPage({ ...page, recipientName: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Status
                </label>
                <select
                  value={page.status}
                  onChange={(e) => setPage({ ...page, status: e.target.value as 'draft' | 'published' })}
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-2.5 text-sm text-white focus:border-amber-400 focus:outline-none"
                >
                  <option value="published">Published (Live)</option>
                  <option value="draft">Draft (Hidden)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Headline
              </label>
              <input
                type="text"
                value={page.headline}
                onChange={(e) => setPage({ ...page, headline: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Subheadline
              </label>
              <input
                type="text"
                value={page.subheadline || ''}
                onChange={(e) => setPage({ ...page, subheadline: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Visual Template
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['neon-night', 'pastel-dream', 'royal-gold'] as TemplateType[]).map((tmpl) => (
                  <button
                    key={tmpl}
                    type="button"
                    onClick={() => setPage({ ...page, template: tmpl })}
                    className={`py-3 px-4 rounded-xl border text-xs font-semibold transition ${
                      page.template === tmpl
                        ? 'border-amber-400 bg-amber-400/10 text-white'
                        : 'border-white/10 bg-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    {tmpl}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Message Paragraphs
              </label>
              {page.paragraphs.map((p, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <textarea
                    rows={3}
                    value={p}
                    onChange={(e) => {
                      const updated = [...page.paragraphs];
                      updated[idx] = e.target.value;
                      setPage({ ...page, paragraphs: updated });
                    }}
                    className="flex-1 rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white focus:border-amber-400 focus:outline-none resize-none"
                  />
                  {page.paragraphs.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        setPage({
                          ...page,
                          paragraphs: page.paragraphs.filter((_, i) => i !== idx),
                        })
                      }
                      className="p-2 text-slate-500 hover:text-rose-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => setPage({ ...page, paragraphs: [...page.paragraphs, ''] })}
                className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold"
              >
                <Plus className="h-3 w-3" />
                <span>Add Paragraph</span>
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Secret Note
              </label>
              <input
                type="text"
                value={page.secretNote || ''}
                onChange={(e) => setPage({ ...page, secretNote: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            {savedSuccess ? (
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" />
                <span>Changes saved successfully!</span>
              </span>
            ) : (
              <span />
            )}

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-lg shadow-amber-500/20"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
