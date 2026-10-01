'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Heart } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith('/w/')) return null;

  return (
    <footer className="border-t border-white/[0.08] bg-[#07080b] py-12 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-syne text-lg font-bold text-white">Wishly</span>
              <span className="text-xs text-amber-400">
                <Sparkles className="h-3 w-3" />
              </span>
            </Link>
            <p className="text-xs text-slate-400 max-w-sm text-center md:text-left">
              Crafting unforgettable cinematic celebration pages with animated memories, music, and love.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-xs text-slate-400">
            <Link href="/create" className="hover:text-white transition">Create Wish</Link>
            <Link href="/templates" className="hover:text-white transition">Templates</Link>
            <Link href="/dashboard" className="hover:text-white transition">Dashboard</Link>
            <Link href="/admin" className="hover:text-white transition">Admin</Link>
            <Link href="/w/priya-25th-birthday" className="hover:text-white transition">Sample Page</Link>
          </div>

          <div className="flex items-center gap-1 text-xs text-slate-400">
            <span>Made with</span>
            <Heart className="h-3 w-3 text-rose-500 fill-rose-500" />
            <span>for life&apos;s special moments</span>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/[0.05] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 Wishly Studio. All rights reserved.</p>
          <div className="flex gap-4">
            <span>Encrypted Links</span>
            <span>·</span>
            <span>Zero Expiration</span>
            <span>·</span>
            <span>60fps Interactive Story</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
