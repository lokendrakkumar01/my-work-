'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import Navbar from '../components/Navbar';

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [userRes, analyticsRes] = await Promise.all([
          api.getCurrentUser(),
          api.getDashboardAnalytics(),
        ]);

        if (userRes.success) setUser(userRes.data?.user);
        if (analyticsRes.success) setAnalytics(analyticsRes.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mx-auto mb-4" />
          <p className="text-slate-400 text-sm">Calculating Analytics & Metrics...</p>
        </div>
      </div>
    );
  }

  const totalTasks = analytics?.totalTasks || 0;
  const completedTasks = analytics?.completedTasks || 0;
  const totalPosts = analytics?.totalPosts || 0;
  const totalVideos = analytics?.totalVideos || 0;
  const productivityScore = analytics?.productivityScore || 0;
  const totalContent = totalPosts + totalVideos;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar user={user} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center space-x-2">
              <span>📈</span>
              <span>Creator Performance Analytics</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Holistic view of your content output, task velocity, and channel distribution.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 transition self-start sm:self-auto"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* High-Level Score Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-800/40">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Productivity Score</span>
            <div className="text-4xl font-black text-white mt-2 flex items-baseline space-x-2">
              <span>{productivityScore}%</span>
              <span className="text-xs text-emerald-400 font-semibold">Velocity</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Based on {completedTasks} of {totalTasks} tasks completed
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-950/40 via-slate-900 to-slate-900 border border-purple-800/40">
            <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">Total Content Output</span>
            <div className="text-4xl font-black text-white mt-2">
              {totalContent}
            </div>
            <p className="text-xs text-slate-400 mt-2">
              {totalPosts} social posts + {totalVideos} YouTube projects
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-red-950/40 via-slate-900 to-slate-900 border border-red-800/40">
            <span className="text-xs font-semibold text-red-400 uppercase tracking-wider">YouTube Pipeline</span>
            <div className="text-4xl font-black text-white mt-2">
              {totalVideos}
            </div>
            <p className="text-xs text-slate-400 mt-2">Videos across 7 production stages</p>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-950/40 via-slate-900 to-slate-900 border border-blue-800/40">
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Completed Tasks</span>
            <div className="text-4xl font-black text-white mt-2">
              {completedTasks}
            </div>
            <p className="text-xs text-slate-400 mt-2">
              {totalTasks - completedTasks} remaining in active sprint
            </p>
          </div>
        </div>

        {/* Visual Breakdown Meters */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Progress Bar 1: Task Completion Rate */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-white text-base">Sprint Completion Rate</h3>
              <span className="text-sm font-bold text-emerald-400">{productivityScore}%</span>
            </div>
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(productivityScore, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-400">
              <span>Completed: {completedTasks} tasks</span>
              <span>Total: {totalTasks} tasks</span>
            </div>
          </div>

          {/* Progress Bar 2: Content Distribution */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-white text-base">Channel Portfolio Split</h3>
              <span className="text-xs text-slate-400">{totalContent} total items</span>
            </div>
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden flex mb-3">
              <div
                className="h-full bg-purple-500 transition-all duration-500"
                style={{
                  width: totalContent > 0 ? `${(totalPosts / totalContent) * 100}%` : '50%',
                }}
                title={`Social: ${totalPosts}`}
              />
              <div
                className="h-full bg-red-500 transition-all duration-500"
                style={{
                  width: totalContent > 0 ? `${(totalVideos / totalContent) * 100}%` : '50%',
                }}
                title={`YouTube: ${totalVideos}`}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-400">
              <span className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                <span>Social Posts ({totalPosts})</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span>YouTube Projects ({totalVideos})</span>
              </span>
            </div>
          </div>
        </div>

        {/* Creator Achievement Badges */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 mb-8">
          <h3 className="font-bold text-white text-base mb-4 flex items-center space-x-2">
            <span>🏆</span>
            <span>Creator Milestone Unlocks</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center space-x-3">
              <span className="text-3xl">🚀</span>
              <div>
                <div className="font-bold text-sm text-white">Full-Stack Live</div>
                <div className="text-[11px] text-emerald-400 font-medium">Unlocked ✓</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center space-x-3">
              <span className="text-3xl">🤖</span>
              <div>
                <div className="font-bold text-sm text-white">Gemini AI Copilot</div>
                <div className="text-[11px] text-purple-400 font-medium">Active ✓</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center space-x-3">
              <span className="text-3xl">🎬</span>
              <div>
                <div className="font-bold text-sm text-white">7-Stage Pipeline</div>
                <div className="text-[11px] text-red-400 font-medium">Ready ✓</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center space-x-3">
              <span className="text-3xl">⚡</span>
              <div>
                <div className="font-bold text-sm text-white">Fast Cloud CDN</div>
                <div className="text-[11px] text-blue-400 font-medium">100% Uptime ✓</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
