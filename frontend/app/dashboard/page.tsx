'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import Navbar from '../components/Navbar';

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [health, setHealth] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userRes = await api.getCurrentUser();
        if (!userRes.success) {
          router.push('/login');
          return;
        }
        setUser(userRes.data?.user);

        const analyticsRes = await api.getDashboardAnalytics();
        if (analyticsRes.success) {
          setAnalytics(analyticsRes.data);
        }

        const healthRes = await api.getSystemHealth();
        setHealth(healthRes);
      } catch (error) {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4" />
          <p className="text-slate-400 text-sm font-medium">Loading Creator Workspace...</p>
        </div>
      </div>
    );
  }

  const firstName = user?.profile?.fullName?.split(' ')[0] || user?.email?.split('@')[0] || 'Creator';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar user={user} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome & Status Bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-purple-400 uppercase tracking-wider mb-1">
              <span>● Creator Control Deck</span>
              <span>•</span>
              <span className="text-emerald-400 flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Cloud Atlas Connected</span>
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Welcome back, {firstName}! 👋
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Here is what is happening across your production pipeline today.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/tasks"
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 text-sm font-semibold rounded-xl border border-slate-700/80 transition"
            >
              + New Task
            </Link>
            <Link
              href="/ai"
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm font-semibold rounded-xl shadow-md transition"
            >
              ✨ AI Copilot
            </Link>
          </div>
        </div>

        {/* Database Warning if ever disconnected */}
        {health && health.database?.status !== 'connected' && (
          <div className="bg-red-950/60 border border-red-800 text-red-200 p-4 mb-8 rounded-xl shadow">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="font-bold">Database Disconnected</p>
                <p className="text-xs text-red-300">
                  Backend failed to connect with MongoDB Atlas. Check your Render environment variables.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <Link
            href="/social"
            className="p-6 rounded-2xl bg-gradient-to-br from-purple-900/40 via-slate-900 to-slate-900 border border-purple-800/40 hover:border-purple-600/60 transition group cursor-pointer"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-purple-400 uppercase tracking-wider">Social Posts</p>
                <h3 className="text-3xl font-extrabold text-white mt-2 group-hover:text-purple-300 transition">
                  {analytics?.totalPosts || 0}
                </h3>
                <p className="text-xs text-slate-400 mt-1">Multi-channel scheduled & live</p>
              </div>
              <div className="text-3xl p-3 bg-purple-500/10 rounded-xl">📱</div>
            </div>
          </Link>

          <Link
            href="/youtube"
            className="p-6 rounded-2xl bg-gradient-to-br from-red-900/40 via-slate-900 to-slate-900 border border-red-800/40 hover:border-red-600/60 transition group cursor-pointer"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-red-400 uppercase tracking-wider">YouTube Projects</p>
                <h3 className="text-3xl font-extrabold text-white mt-2 group-hover:text-red-300 transition">
                  {analytics?.totalVideos || 0}
                </h3>
                <p className="text-xs text-slate-400 mt-1">In idea & production pipeline</p>
              </div>
              <div className="text-3xl p-3 bg-red-500/10 rounded-xl">🎬</div>
            </div>
          </Link>

          <Link
            href="/tasks"
            className="p-6 rounded-2xl bg-gradient-to-br from-blue-900/40 via-slate-900 to-slate-900 border border-blue-800/40 hover:border-blue-600/60 transition group cursor-pointer"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Active Tasks</p>
                <h3 className="text-3xl font-extrabold text-white mt-2 group-hover:text-blue-300 transition">
                  {analytics?.totalTasks || 0}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {analytics?.completedTasks || 0} completed so far
                </p>
              </div>
              <div className="text-3xl p-3 bg-blue-500/10 rounded-xl">✅</div>
            </div>
          </Link>

          <Link
            href="/analytics"
            className="p-6 rounded-2xl bg-gradient-to-br from-emerald-900/40 via-slate-900 to-slate-900 border border-emerald-800/40 hover:border-emerald-600/60 transition group cursor-pointer"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Productivity Rate</p>
                <h3 className="text-3xl font-extrabold text-white mt-2 group-hover:text-emerald-300 transition">
                  {analytics?.productivityScore || 0}%
                </h3>
                <p className="text-xs text-slate-400 mt-1">Task sprint completion velocity</p>
              </div>
              <div className="text-3xl p-3 bg-emerald-500/10 rounded-xl">📊</div>
            </div>
          </Link>
        </div>

        {/* Quick Launchpad Grid */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
            <span>⚡</span>
            <span>Quick Launchpad</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Link
              href="/social"
              className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/60 hover:bg-slate-900 transition flex flex-col items-center text-center group"
            >
              <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">📝</span>
              <span className="text-sm font-bold text-white">Create Post</span>
              <span className="text-xs text-slate-400 mt-1">Twitter, LinkedIn, IG</span>
            </Link>

            <Link
              href="/youtube"
              className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-red-500/60 hover:bg-slate-900 transition flex flex-col items-center text-center group"
            >
              <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">🎥</span>
              <span className="text-sm font-bold text-white">YouTube Pipeline</span>
              <span className="text-xs text-slate-400 mt-1">Advance video stages</span>
            </Link>

            <Link
              href="/tasks"
              className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/60 hover:bg-slate-900 transition flex flex-col items-center text-center group"
            >
              <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">✏️</span>
              <span className="text-sm font-bold text-white">Manage Tasks</span>
              <span className="text-xs text-slate-400 mt-1">Kanban & status controls</span>
            </Link>

            <Link
              href="/ai"
              className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/60 hover:bg-slate-900 transition flex flex-col items-center text-center group"
            >
              <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">🤖</span>
              <span className="text-sm font-bold text-white">AI Copilot</span>
              <span className="text-xs text-slate-400 mt-1">Gemini script & caption gen</span>
            </Link>
          </div>
        </div>

        {/* Platform Status Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-900/40 via-indigo-950/40 to-slate-900 border border-purple-800/40">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center space-x-2 text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 mb-2">
                <span>Production Mode</span>
              </div>
              <h3 className="text-xl font-bold text-white">Creator Hub is 100% Operational</h3>
              <p className="text-slate-400 text-sm mt-1 max-w-xl">
                RESTful backend with MongoDB Atlas replica set, JWT security, and real-time AI generation is live.
              </p>
            </div>
            <div className="flex space-x-3">
              <Link
                href="/analytics"
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold rounded-xl shadow transition"
              >
                View Full Analytics
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
