'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.login(email, password);

      if (response.success) {
        router.push('/dashboard');
      } else {
        setError(response.error || response.message || 'Login failed');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setDemoLoading(true);
    setError('');

    try {
      const response = await api.demoLogin();

      if (response.success) {
        router.push('/dashboard');
      } else {
        setError(response.error || response.message || 'Demo login failed');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred connecting to server');
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-slate-900 to-indigo-950 p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/60">
        <div className="text-center">
          <Link href="/" className="inline-block text-xs font-semibold text-purple-400 hover:text-purple-300 mb-2">
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            🚀 Creator Control Hub
          </h1>
          <p className="text-slate-400 text-sm mt-1">Sign in to your creator workspace</p>
        </div>

        {/* Instant Demo Button for Recruiters & Visitors */}
        <div className="p-3 bg-purple-950/40 border border-purple-800/60 rounded-xl text-center">
          <p className="text-xs text-purple-300 mb-2 font-medium">Testing as recruiter or portfolio reviewer?</p>
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={demoLoading || loading}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-sm font-bold rounded-lg shadow-md transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            <span>⚡</span>
            <span>{demoLoading ? 'Launching Demo Workspace...' : '1-Click Instant Demo Access'}</span>
          </button>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-700 w-full" />
          <span className="bg-slate-900 px-3 text-xs text-slate-400 uppercase tracking-wider font-semibold">
            Or sign in with email
          </span>
          <div className="border-t border-slate-700 w-full" />
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-900/40 border border-red-700/60 rounded-lg text-red-200 text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-xs font-medium text-slate-300 mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              placeholder="you@domain.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-medium text-slate-300 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading || demoLoading}
            className="w-full py-2.5 px-4 bg-slate-100 hover:bg-white text-slate-900 font-bold text-sm rounded-lg shadow transition cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-slate-400 text-xs">
            Don't have an account?{' '}
            <Link href="/register" className="text-purple-400 hover:text-purple-300 font-semibold transition">
              Create one here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
