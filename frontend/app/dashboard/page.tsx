'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function DashboardPage() {
      const router = useRouter();
      const [loading, setLoading] = useState(true);
      const [user, setUser] = useState<any>(null);
      const [analytics, setAnalytics] = useState<any>(null);

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
                  } catch (error) {
                        router.push('/login');
                  } finally {
                        setLoading(false);
                  }
            };

            checkAuth();
      }, [router]);

      const handleLogout = async () => {
            await api.logout();
            router.push('/login');
      };

      if (loading) {
            return (
                  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
                  </div>
            );
      }

      return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                  {/* Top Bar */}
                  <div className="bg-white dark:bg-gray-800 shadow">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    🚀 Creator Control Hub
                              </h1>
                              <div className="flex items-center space-x-4">
                                    <span className="text-gray-700 dark:text-gray-300">
                                          {user?.profile?.fullName || user?.email}
                                    </span>
                                    <button
                                          onClick={handleLogout}
                                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                                    >
                                          Logout
                                    </button>
                              </div>
                        </div>
                  </div>

                  {/* Dashboard Content */}
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="mb-8">
                              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                    Welcome back, {user?.profile?.fullName?.split(' ')[0] || 'Creator'}! 👋
                              </h2>
                              <p className="text-gray-600 dark:text-gray-400">
                                    Here's your creator overview
                              </p>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                              <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
                                    <div className="flex items-center justify-between">
                                          <div>
                                                <p className="text-purple-100 text-sm font-medium">Total Posts</p>
                                                <p className="text-3xl font-bold mt-2">{analytics?.totalPosts || 0}</p>
                                          </div>
                                          <div className="text-4xl opacity-80">📱</div>
                                    </div>
                              </div>

                              <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-xl p-6 text-white shadow-lg">
                                    <div className="flex items-center justify-between">
                                          <div>
                                                <p className="text-red-100 text-sm font-medium">YouTube Videos</p>
                                                <p className="text-3xl font-bold mt-2">{analytics?.totalVideos || 0}</p>
                                          </div>
                                          <div className="text-4xl opacity-80">🎬</div>
                                    </div>
                              </div>

                              <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-6 text-white shadow-lg">
                                    <div className="flex items-center justify-between">
                                          <div>
                                                <p className="text-blue-100 text-sm font-medium">Total Tasks</p>
                                                <p className="text-3xl font-bold mt-2">{analytics?.totalTasks || 0}</p>
                                          </div>
                                          <div className="text-4xl opacity-80">✅</div>
                                    </div>
                              </div>

                              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
                                    <div className="flex items-center justify-between">
                                          <div>
                                                <p className="text-green-100 text-sm font-medium">Productivity</p>
                                                <p className="text-3xl font-bold mt-2">{analytics?.productivityScore || 0}%</p>
                                          </div>
                                          <div className="text-4xl opacity-80">📊</div>
                                    </div>
                              </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
                              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                                    Quick Actions
                              </h3>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <button className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition text-center">
                                          <div className="text-3xl mb-2">📝</div>
                                          <p className="text-sm font-medium text-gray-900 dark:text-white">New Post</p>
                                    </button>
                                    <button className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition text-center">
                                          <div className="text-3xl mb-2">🎥</div>
                                          <p className="text-sm font-medium text-gray-900 dark:text-white">New Video</p>
                                    </button>
                                    <button className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition text-center">
                                          <div className="text-3xl mb-2">✏️</div>
                                          <p className="text-sm font-medium text-gray-900 dark:text-white">Add Task</p>
                                    </button>
                                    <button className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition text-center">
                                          <div className="text-3xl mb-2">🤖</div>
                                          <p className="text-sm font-medium text-gray-900 dark:text-white">AI Copilot</p>
                                    </button>
                              </div>
                        </div>

                        {/* Platform is ready message */}
                        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-8 text-white text-center">
                              <h3 className="text-2xl font-bold mb-2">🎉 Platform is Live!</h3>
                              <p className="text-purple-100 mb-4">
                                    Your creator management platform is ready. Full features coming soon!
                              </p>
                              <p className="text-sm text-purple-200">
                                    Backend API is fully operational with authentication, social media, YouTube, tasks, and AI integration.
                              </p>
                        </div>
                  </div>
            </div>
      );
}
