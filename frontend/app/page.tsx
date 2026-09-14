'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';

export default function LandingPage() {
  const router = useRouter();
  const [demoLoading, setDemoLoading] = useState(false);

  const handleDemoAccess = async () => {
    setDemoLoading(true);
    try {
      const res = await api.demoLogin();
      if (res.success) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    } catch (e) {
      router.push('/login');
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-purple-500 selection:text-white">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-purple-600/20 via-indigo-600/10 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Top Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">🚀</span>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
              Creator Control Hub
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg transition"
            >
              Sign In
            </Link>
            <button
              onClick={handleDemoAccess}
              disabled={demoLoading}
              className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-lg shadow-md hover:shadow-purple-500/20 transition cursor-pointer disabled:opacity-50"
            >
              {demoLoading ? 'Launching Demo...' : '⚡ Instant Demo'}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-8">
          <span>✨ Enterprise-Grade Full-Stack Platform</span>
          <span className="w-1 h-1 rounded-full bg-purple-400" />
          <span className="text-purple-400">Next.js 16 + Express + Gemini AI</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-none mb-6">
          The All-in-One Operating System for{' '}
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
            Modern Content Creators
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Manage your YouTube production pipeline, plan multi-channel social campaigns, supercharge tasks, and generate viral scripts with Google Gemini AI.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <button
            onClick={handleDemoAccess}
            disabled={demoLoading}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-purple-600/30 hover:scale-105 transition-all text-base cursor-pointer disabled:opacity-50"
          >
            {demoLoading ? 'Opening Workspace...' : '🚀 Launch Live Demo (1-Click)'}
          </button>
          <Link
            href="/register"
            className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl border border-slate-700/80 transition text-base"
          >
            Create Free Account
          </Link>
        </div>

        {/* Live Metrics Row */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="text-3xl font-extrabold text-white">100%</div>
            <div className="text-xs text-slate-400 mt-1">Cloud Deployed & Live</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="text-3xl font-extrabold text-purple-400">Gemini 1.5</div>
            <div className="text-xs text-slate-400 mt-1">Integrated AI Copilot</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="text-3xl font-extrabold text-blue-400">MongoDB</div>
            <div className="text-xs text-slate-400 mt-1">Atlas Cloud Cluster</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="text-3xl font-extrabold text-pink-400">&lt; 150ms</div>
            <div className="text-xs text-slate-400 mt-1">Optimized API Latency</div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-900">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Engineered for High-Velocity Creators
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Everything you need to orchestrate content creation from initial brainstorm to viral execution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="p-8 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800 hover:border-purple-500/50 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-400 text-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              🎬
            </div>
            <h3 className="text-xl font-bold text-white mb-2">YouTube Production Pipeline</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Track videos across 7 lifecycle stages: Idea ➜ Script ➜ Recording ➜ Editing ➜ Optimizing ➜ Publishing ➜ Live. Includes SEO scoring algorithms.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-8 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800 hover:border-purple-500/50 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 text-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              📱
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Multi-Platform Social Hub</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Plan and schedule posts across Twitter/X, LinkedIn, and Instagram. Built-in character limits, tag formatting, and engagement tracking.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-8 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800 hover:border-purple-500/50 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 text-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              ✅
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Smart Tasks & Kanban</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Organize priorities with real-time status toggles, urgency filters, countdown tags, and automated daily productivity scores.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-8 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800 hover:border-purple-500/50 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 text-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              🤖
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Gemini AI Copilot</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Generate magnetic hooks, YouTube scripts with timestamps, trending hashtag sets, and tailored productivity roadmaps in seconds.
            </p>
          </div>

          {/* Card 5 */}
          <div className="p-8 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800 hover:border-purple-500/50 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 text-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              📈
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Performance Analytics</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Live visualization of task velocity, publication consistency, channel distributions, and creator milestone unlocks.
            </p>
          </div>

          {/* Card 6 */}
          <div className="p-8 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800 hover:border-purple-500/50 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 text-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              🛡️
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Production Security</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Secure JWT authentication, bcrypt hash salt rounds, express rate limiting, dynamic CORS authorization, and helmet headers.
            </p>
          </div>
        </div>
      </section>

      {/* Tech Stack Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-900">
        <h2 className="text-center text-xs font-bold uppercase tracking-widest text-slate-500 mb-8">
          Powered by Modern Architecture & Cloud Infrastructure
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
          <span className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-semibold text-sm">
            ⚡ Next.js 16 (App Router)
          </span>
          <span className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-semibold text-sm">
            🔷 TypeScript
          </span>
          <span className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-semibold text-sm">
            🎨 Tailwind CSS 4
          </span>
          <span className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-semibold text-sm">
            🟢 Node.js & Express
          </span>
          <span className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-semibold text-sm">
            🍃 MongoDB Atlas
          </span>
          <span className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-semibold text-sm">
            🤖 Google Gemini 1.5 Flash
          </span>
          <span className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-semibold text-sm">
            ☁️ Render Web Services
          </span>
        </div>
      </section>

      {/* Call to Action Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-12 text-center text-slate-500 text-sm">
        <div className="max-w-7xl mx-auto px-4">
          <p className="mb-4 text-slate-400 font-medium">
            Creator Control Hub • Crafted for Content Creators & Developers
          </p>
          <div className="flex justify-center space-x-6">
            <Link href="/login" className="hover:text-purple-400 transition">Sign In</Link>
            <Link href="/register" className="hover:text-purple-400 transition">Register</Link>
            <button onClick={handleDemoAccess} className="hover:text-purple-400 transition cursor-pointer">Live Demo</button>
            <a href="https://github.com/lokendrakkumar01/my-work-" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition">GitHub Repo</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
