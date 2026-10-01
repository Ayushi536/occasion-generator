'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import BrandLogo from '@/components/BrandLogo';
import { usePathname, useRouter } from 'next/navigation';
import { Sparkles, Plus, LogOut, LayoutDashboard, Shield, Heart } from 'lucide-react';
import { UserSession } from '@/lib/types';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('wishly_token') : null;
      const reqHeaders: Record<string, string> = {};
      if (token) {
        reqHeaders['Authorization'] = `Bearer ${token}`;
      }

      fetch('/api/auth/me', { headers: reqHeaders })
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            setUser(data.user);
          } else {
            const localUserStr = typeof window !== 'undefined' ? localStorage.getItem('wishly_user') : null;
            if (localUserStr) {
              try {
                setUser(JSON.parse(localUserStr));
              } catch {
                setUser(null);
              }
            } else {
              setUser(null);
            }
          }
          setLoading(false);
        })
        .catch(() => {
          const localUserStr = typeof window !== 'undefined' ? localStorage.getItem('wishly_user') : null;
          if (localUserStr) {
            try {
              setUser(JSON.parse(localUserStr));
            } catch {
              setUser(null);
            }
          } else {
            setUser(null);
          }
          setLoading(false);
        });
    };

    checkAuth();
    window.addEventListener('auth-changed', checkAuth);
    return () => {
      window.removeEventListener('auth-changed', checkAuth);
    };
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem('wishly_token');
      localStorage.removeItem('wishly_user');
    }
    setUser(null);
    router.push('/');
    router.refresh();
  };

  // If viewing a public wish page /w/[slug], keep top bar unobtrusive or let the wish page handle its own immersive header
  const isWishPage = pathname.startsWith('/w/');
  if (isWishPage) return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#090a0f]/80 backdrop-blur-xl transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Shared Wishly identity */}
        <Link href="/" className="group inline-flex items-center" aria-label="Wishly home">
          <BrandLogo tone="inverse" compact />
        </Link>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <Link
            href="/create"
            className={`transition-colors hover:text-white ${pathname === '/create' ? 'text-white' : ''}`}
          >
            Create Wish
          </Link>
          <Link
            href="/templates"
            className={`transition-colors hover:text-white ${pathname === '/templates' ? 'text-white' : ''}`}
          >
            Templates
          </Link>
          <Link
            href="/w/priya-25th-birthday"
            className="transition-colors hover:text-white flex items-center gap-1.5"
          >
            <Heart className="h-3.5 w-3.5 text-pink-400" />
            Live Demo
          </Link>
          {user && (
            <Link
              href="/dashboard"
              className={`transition-colors hover:text-white ${pathname.startsWith('/dashboard') ? 'text-white' : ''}`}
            >
              Dashboard
            </Link>
          )}
          {user?.role === 'admin' && (
            <Link
              href="/admin"
              className={`transition-colors hover:text-white flex items-center gap-1 ${pathname.startsWith('/admin') ? 'text-amber-400' : 'text-slate-400'}`}
            >
              <Shield className="h-3.5 w-3.5" />
              Admin
            </Link>
          )}
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          {loading ? (
            <div className="h-8 w-20 animate-pulse rounded-lg bg-white/5" />
          ) : user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/create"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-3.5 py-1.5 text-xs font-semibold text-slate-950 transition hover:bg-amber-300 whitespace-nowrap shadow-sm shadow-amber-400/20"
              >
                <Plus className="h-3.5 w-3.5" />
                New Wish
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:bg-white/10 whitespace-nowrap"
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{user.name.split(' ')[0]}</span>
              </Link>
              <button
                onClick={handleLogout}
                title="Log out"
                className="rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-slate-200 transition"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/login"
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 transition whitespace-nowrap"
              >
                Log In
              </Link>
              <Link
                href="/create"
                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-3.5 py-1.5 text-xs font-semibold text-slate-950 transition hover:bg-amber-300 whitespace-nowrap shadow-sm shadow-amber-400/20"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Create Wish
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
