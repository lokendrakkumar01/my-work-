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
                        setError(response.error || 'Login failed');
                  }
            } catch (err: any) {
                  setError(err.message || 'An error occurred');
            } finally {
                  setLoading(false);
            }
      };

      return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700">
                  <div className="w-full max-w-md p-8 space-y-8 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20">
                        <div className="text-center">
                              <h1 className="text-4xl font-bold text-white mb-2">
                                    🚀 Creator Control Hub
                              </h1>
                              <p className="text-white/80">Sign in to your creator dashboard</p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-6">
                              {error && (
                                    <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-100 text-sm">
                                          {error}
                                    </div>
                              )}

                              <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-2">
                                          Email Address
                                    </label>
                                    <input
                                          id="email"
                                          type="email"
                                          required
                                          value={email}
                                          onChange={(e) => setEmail(e.target.value)}
                                          className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition"
                                          placeholder="your@email.com"
                                    />
                              </div>

                              <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-white/90 mb-2">
                                          Password
                                    </label>
                                    <input
                                          id="password"
                                          type="password"
                                          required
                                          value={password}
                                          onChange={(e) => setPassword(e.target.value)}
                                          className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition"
                                          placeholder="••••••••"
                                    />
                              </div>

                              <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:from-purple-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
                              >
                                    {loading ? (
                                          <span className="flex items-center justify-center">
                                                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                                Signing in...
                                          </span>
                                    ) : (
                                          'Sign In'
                                    )}
                              </button>
                        </form>

                        <div className="text-center space-y-2">
                              <p className="text-white/70 text-sm">
                                    Don't have an account?{' '}
                                    <Link href="/register" className="text-purple-300 hover:text-purple-200 font-semibold transition">
                                          Sign up
                                    </Link>
                              </p>
                              <Link href="/forgot-password" className="block text-white/70 hover:text-white text-sm transition">
                                    Forgot password?
                              </Link>
                        </div>
                  </div>
            </div>
      );
}
