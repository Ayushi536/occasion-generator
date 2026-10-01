'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Sparkles, Lock, Mail, ArrowRight, Shield, User } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Invalid credentials');
      }

      if (data.token) {
        localStorage.setItem('wishly_token', data.token);
        localStorage.setItem('wishly_user', JSON.stringify(data.user));
        window.dispatchEvent(new Event('auth-changed'));
      }

      window.location.href = '/dashboard';
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-screen bg-[#07080c] text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-md w-full p-8 rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-2xl">
          <div className="text-center mb-6">
            <Link href="/" className="inline-flex items-center gap-1.5 font-syne text-2xl font-black text-white mb-2">
              Wishly
              <Sparkles className="h-4 w-4 text-amber-400" />
            </Link>
            <h1 className="text-xl font-bold text-white">Welcome Back</h1>
            <p className="text-xs text-slate-400 mt-1">
              Sign in to manage and customize your celebration sites
            </p>
          </div>

          {/* 1-Click Demo Login Shortcuts */}
          <div className="mb-6 p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <span className="text-[11px] font-semibold text-slate-400 block text-center">
              Quick-Fill Demo Credentials:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('creator@wishly.app', 'wishly123')}
                className="py-1.5 px-2 rounded-lg bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 text-xs font-medium border border-amber-400/20 flex items-center justify-center gap-1 transition"
              >
                <User className="h-3 w-3" />
                <span>Creator Account</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('admin@wishly.app', 'admin123')}
                className="py-1.5 px-2 rounded-lg bg-purple-400/10 hover:bg-purple-400/20 text-purple-300 text-xs font-medium border border-purple-400/20 flex items-center justify-center gap-1 transition"
              >
                <Shield className="h-3 w-3" />
                <span>Admin Account</span>
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-amber-500/20 disabled:opacity-50"
            >
              <span>{loading ? 'Signing In...' : 'Sign In to Dashboard'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-400">
            <span>Don&apos;t have an account yet? </span>
            <Link href="/signup" className="text-amber-400 font-semibold hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
