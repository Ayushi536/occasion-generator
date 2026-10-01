'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageSquareHeart,
  Send,
  Sparkles,
  Wand2,
  Trash2,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Edit3,
  UserCheck,
  X,
} from 'lucide-react';
import { WishPage, GuestWish } from '@/lib/types';
import { TEMPLATES } from './theme-config';

interface WishesWallProps {
  page: WishPage;
}

const EMOJIS = ['🎈', '🎂', '💖', '✨', '🥂', '🌟', '🎉', '🌸', '⚡', '💫'];

export default function WishesWall({ page }: WishesWallProps) {
  const theme = TEMPLATES[page.template] || TEMPLATES['neon-night'];
  const [wishes, setWishes] = useState<GuestWish[]>(page.wishes || []);
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [message, setMessage] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('🎈');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<Array<{ message: string; emoji: string }>>([]);
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiTone, setAiTone] = useState<'emotional' | 'funny' | 'poetic' | 'filmi'>('emotional');
  const [successNotice, setSuccessNotice] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Delete & Re-upload state
  const [deletedWishCache, setDeletedWishCache] = useState<GuestWish | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [myWishIds, setMyWishIds] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(`wishly_my_wishes_${page.slug}`);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [wishToDeleteModal, setWishToDeleteModal] = useState<GuestWish | null>(null);

  const recordMyWish = (id: string) => {
    try {
      const updated = [...myWishIds, id];
      setMyWishIds(updated);
      localStorage.setItem(`wishly_my_wishes_${page.slug}`, JSON.stringify(updated));
    } catch {
      // Ignore localStorage write errors
    }
  };

  const removeMyWish = (id: string) => {
    try {
      const updated = myWishIds.filter((item) => item !== id);
      setMyWishIds(updated);
      localStorage.setItem(`wishly_my_wishes_${page.slug}`, JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  const handleGenerateAiWish = async () => {
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/ai/wish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientName: page.recipientName,
          occasion: page.occasion,
          relationship: relationship || 'Friend',
          tone: aiTone,
          language: page.language || 'en',
          mode: 'short_wish',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.wishes && Array.isArray(data.wishes)) {
          setAiSuggestions(data.wishes);
          setShowAiModal(true);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSelectAiSuggestion = (text: string, emoji: string) => {
    setMessage(text);
    setSelectedEmoji(emoji);
    setShowAiModal(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      setErrorMsg('Please enter both your name and your heartfelt wish.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch(`/api/w/${page.slug}/wish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorName: name.trim(),
          relationship: relationship.trim() || 'Well-wisher',
          message: message.trim(),
          avatarEmoji: selectedEmoji,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to post wish');
      }

      const { wish } = await res.json();
      setWishes([wish, ...wishes]);
      recordMyWish(wish.id);
      setMessage('');
      setSuccessNotice(true);
      setDeletedWishCache(null);
      setTimeout(() => setSuccessNotice(false), 4500);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('Failed to post wish. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Execute deletion with instant restore into form for easy re-upload
  const confirmDeleteWish = async (wish: GuestWish) => {
    setDeletingId(wish.id);
    try {
      const res = await fetch(`/api/w/${page.slug}/wish?wishId=${wish.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        // Cache deleted wish for 1-click restore/edit
        setDeletedWishCache(wish);
        removeMyWish(wish.id);
        setWishes((prev) => prev.filter((w) => w.id !== wish.id));

        // Automatically prefill form fields so user can fix and reupload immediately!
        setName(wish.authorName);
        setRelationship(wish.relationship || '');
        setMessage(wish.message);
        setSelectedEmoji(wish.avatarEmoji || '🎈');

        // Close modal
        setWishToDeleteModal(null);

        // Smooth scroll to form
        const formElement = document.getElementById('wish-input-form');
        if (formElement) {
          formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete wish');
      }
    } catch (err) {
      console.error(err);
      alert('Network error while deleting wish');
    } finally {
      setDeletingId(null);
    }
  };

  const handleClearForm = () => {
    setMessage('');
    setErrorMsg('');
  };

  return (
    <section className="relative py-24 px-4 sm:px-6 max-w-6xl mx-auto select-none">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
          <MessageSquareHeart className="h-4 w-4" />
          <span>Celebration Guestbook & Community Wall</span>
        </div>
        <h2 className={`text-3xl sm:text-5xl font-extrabold text-white ${theme.fontHeading} tracking-tight`}>
          Leave a Heartfelt Wish
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-md mx-auto">
          Share your love and laughter in {page.recipientName}&apos;s perpetual guestbook. Made a typo or sent a wrong wish? You can delete and re-upload anytime!
        </p>
      </div>

      {/* Undo / Edit Banner if wish was recently deleted */}
      <AnimatePresence>
        {deletedWishCache && (
          <motion.div
            initial={{ opacity: 0, y: -15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15 }}
            className="mb-8 p-4 rounded-2xl bg-amber-400/15 border border-amber-400/40 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl"
          >
            <div className="flex items-center gap-2.5 text-xs text-amber-200">
              <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
              <span>
                Wish by <strong>{deletedWishCache.authorName}</strong> deleted! Your message was restored in the form below so you can edit and re-upload.
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const formElement = document.getElementById('wish-input-form');
                  if (formElement) formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
                className="py-1.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md"
              >
                <Edit3 className="h-3.5 w-3.5" />
                <span>Jump to Edit Form</span>
              </button>
              <button
                type="button"
                onClick={() => setDeletedWishCache(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column (5 cols) */}
        <div className="lg:col-span-5" id="wish-input-form">
          <form
            onSubmit={handleSubmit}
            className={`rounded-3xl p-6 sm:p-8 border ${theme.cardBorder} ${theme.cardBg} space-y-4 shadow-2xl backdrop-blur-xl relative overflow-hidden`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-400" />
                <span>Write Your Message</span>
              </h3>

              <div className="flex items-center gap-2">
                {/* Clear / Delete Form Input button */}
                {message.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearForm}
                    className="text-xs text-rose-400 hover:text-rose-300 font-medium flex items-center gap-1 px-2 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20 transition cursor-pointer"
                    title="Clear current text"
                  >
                    <Trash2 className="h-3 w-3" />
                    <span>Clear</span>
                  </button>
                )}

                {/* AI Generator Helper Button */}
                <button
                  type="button"
                  onClick={handleGenerateAiWish}
                  disabled={isAiLoading}
                  className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-400/10 border border-amber-400/25 hover:bg-amber-400/20 transition cursor-pointer shadow-sm"
                >
                  <Wand2 className="h-3 w-3" />
                  <span>{isAiLoading ? 'Writing...' : 'AI Wish Ideas'}</span>
                </button>
              </div>
            </div>

            {/* AI Modal Suggestions if open */}
            <AnimatePresence>
              {showAiModal && aiSuggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 rounded-2xl bg-amber-400/10 border border-amber-400/30 space-y-2.5"
                >
                  <div className="flex items-center justify-between text-[11px] font-semibold text-amber-300">
                    <span className="flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      <span>Choose an AI-Generated Wish:</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowAiModal(false)}
                      className="text-slate-400 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {aiSuggestions.map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectAiSuggestion(item.message, item.emoji)}
                        className="w-full text-left p-2.5 rounded-xl bg-black/40 hover:bg-black/70 border border-white/10 hover:border-amber-400/40 transition text-xs text-slate-200 flex items-start gap-2 cursor-pointer"
                      >
                        <span className="text-base shrink-0">{item.emoji}</span>
                        <span className="line-clamp-2">{item.message}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Your Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Chen, Uncle Dave, Sarah"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Relationship (Optional)
              </label>
              <input
                type="text"
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                placeholder="e.g. College Roommate, Sister, Colleague"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Choose Celebration Badge Emoji
              </label>
              <div className="flex flex-wrap gap-2">
                {EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setSelectedEmoji(emoji)}
                    className={`h-8 w-8 rounded-xl flex items-center justify-center text-sm transition cursor-pointer ${
                      selectedEmoji === emoji
                        ? 'bg-amber-400 text-slate-950 scale-110 shadow-md font-bold'
                        : 'bg-white/5 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300">
                  Your Heartfelt Message *
                </label>
                <span className="text-[10px] text-slate-500">{message.length}/500</span>
              </div>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your personal memories, inside jokes, and warmest blessings..."
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none resize-none leading-relaxed"
              />
            </div>

            {errorMsg && (
              <p className="text-xs text-rose-400 font-medium flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                <span>{errorMsg}</span>
              </p>
            )}

            {successNotice && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 font-medium flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>✨ Your wish was posted! You can delete & re-upload anytime.</span>
                </span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer shadow-lg ${theme.primaryButton} disabled:opacity-50`}
            >
              <Send className="h-3.5 w-3.5" />
              <span>{isSubmitting ? 'Posting Wish to Wall...' : 'Post Wish to Celebration Wall'}</span>
            </button>
          </form>
        </div>

        {/* Wishes List Column (7 cols) */}
        <div className="lg:col-span-7 space-y-4 max-h-[640px] overflow-y-auto pr-2">
          {wishes.length === 0 ? (
            <div className="h-64 rounded-3xl border border-dashed border-white/10 flex flex-col items-center justify-center text-slate-400 p-6 text-center">
              <Sparkles className="h-8 w-8 text-amber-400/50 mb-3" />
              <p className="text-sm font-medium text-slate-300">No wishes posted yet</p>
              <p className="text-xs text-slate-500 mt-1">Be the very first to leave a cherished note!</p>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {wishes.map((w, idx) => {
                const isMyWish = myWishIds.includes(w.id);

                return (
                  <motion.div
                    key={w.id || idx}
                    layout
                    initial={{ opacity: 0, y: 15, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.35 }}
                    className={`rounded-2xl p-5 border transition shadow-lg relative group ${
                      isMyWish
                        ? 'border-amber-400/50 bg-gradient-to-r from-amber-500/10 via-white/5 to-transparent'
                        : `${theme.cardBorder} ${theme.cardBg}`
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="h-10 w-10 shrink-0 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-xl shadow-inner">
                        {w.avatarEmoji || '🎈'}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline justify-between gap-2 mb-1">
                          <div className="flex items-center gap-2 min-w-0 flex-wrap">
                            <h4 className="text-sm font-bold text-white truncate">
                              {w.authorName}
                            </h4>
                            {w.relationship && (
                              <span className="text-[11px] text-amber-400/90 font-medium shrink-0">
                                · {w.relationship}
                              </span>
                            )}
                            {isMyWish && (
                              <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded-full bg-amber-400/25 text-amber-300 border border-amber-400/30 flex items-center gap-1 font-bold">
                                <UserCheck className="h-2.5 w-2.5" />
                                <span>Your Wish</span>
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[10px] text-slate-400 font-mono">
                              {new Date(w.createdAt).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>

                            {/* DELETE & RE-UPLOAD BUTTON */}
                            <button
                              type="button"
                              onClick={() => setWishToDeleteModal(w)}
                              disabled={deletingId === w.id}
                              className="py-1 px-2.5 rounded-lg text-rose-300 hover:text-white bg-rose-500/15 hover:bg-rose-500/30 border border-rose-500/30 transition cursor-pointer flex items-center gap-1 text-[11px] font-semibold shadow-sm"
                              title="Delete wrong wish and re-upload"
                            >
                              <Trash2 className="h-3.5 w-3.5 text-rose-400" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                          {w.message}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Confirmation Modal to Delete & Re-upload */}
      <AnimatePresence>
        {wishToDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-md w-full rounded-3xl p-6 bg-slate-900 border border-white/20 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-base">
                  <Trash2 className="h-5 w-5" />
                  <span>Delete Wish & Re-upload?</span>
                </div>
                <button
                  onClick={() => setWishToDeleteModal(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Did you spot a typo or want to rephrase your message? If you delete this wish, we will automatically load your words back into the form so you can make your changes and re-upload it immediately!
              </p>

              <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-xs text-slate-400 italic line-clamp-3">
                &ldquo;{wishToDeleteModal.message}&rdquo;
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setWishToDeleteModal(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-white/10 transition"
                >
                  Keep Wish
                </button>
                <button
                  type="button"
                  onClick={() => confirmDeleteWish(wishToDeleteModal)}
                  disabled={deletingId === wishToDeleteModal.id}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 transition shadow-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>{deletingId === wishToDeleteModal.id ? 'Deleting...' : 'Delete & Edit in Form'}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
