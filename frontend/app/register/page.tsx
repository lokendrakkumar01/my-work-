'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';

export default function RegisterPage() {
      const router = useRouter();
      const [formData, setFormData] = useState({
            email: '',
            password: '',
            confirmPassword: '',
            fullName: '',
      });
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState('');

      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setFormData({ ...formData, [e.target.name]: e.target.value });
      };

      const handleRegister = async (e: React.FormEvent) => {
            e.preventDefault();
            setLoading(true);
            setError('');

            if (formData.password !== formData.confirmPassword) {
                  setError('Passwords do not match');
                  setLoading(false);
                  return;
            }

            if (formData.password.length < 8) {
                  setError('Password must be at least 8 characters');
                  setLoading(false);
                  return;
            }

            try {
                  const response = await api.register(
                        formData.email,
                        formData.password,
                        formData.fullName
                  );

                  if (response.success) {
                        router.push('/dashboard');
                  } else {
                        setError(response.error || 'Registration failed');
                  }
            } catch (err: any) {
                  setError(err.message || 'An error occurred');
            } finally {
                  setLoading(false);
            }
      };

      return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 p-4">
                  <div className="w-full max-w-md p-8 space-y-6 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20">
                        <div className="text-center">
                              <h1 className="text-4xl font-bold text-white mb-2">
                                    ✨ Join Creator Hub
                              </h1>
                              <p className="text-white/80">Create your creator account</p>
                        </div>

                        <form onSubmit={handleRegister} className="space-y-5">
                              {error && (
                                    <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-100 text-sm">
                                          {error}
                                    </div>
                              )}

                              <div>
                                    <label htmlFor="fullName" className="block text-sm font-medium text-white/90 mb-2">
                                          Full Name
                                    </label>
                                    <input
                                          id="fullName"
                                          name="fullName"
                                          type="text"
                                          value={formData.fullName}
                                          onChange={handleChange}
                                          className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                                          placeholder="John Doe"
                                    />
                              </div>

                              <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-2">
                                          Email Address
                                    </label>
                                    <input
                                          id="email"
                                          name="email"
                                          type="email"
                                          required
                                          value={formData.email}
                                          onChange={handleChange}
                                          className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                                          placeholder="your@email.com"
                                    />
                              </div>

                              <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-white/90 mb-2">
                                          Password
                                    </label>
                                    <input
                                          id="password"
                                          name="password"
                                          type="password"
                                          required
                                          value={formData.password}
                                          onChange={handleChange}
                                          className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                                          placeholder="••••••••"
                                    />
                                    <p className="mt-1 text-xs text-white/60">
                                          Minimum 8 characters, include uppercase, lowercase, and number
                                    </p>
                              </div>

                              <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/90 mb-2">
                                          Confirm Password
                                    </label>
                                    <input
                                          id="confirmPassword"
                                          name="confirmPassword"
                                          type="password"
                                          required
                                          value={formData.confirmPassword}
                                          onChange={handleChange}
                                          className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                                          placeholder="••••••••"
                                    />
                              </div>

                              <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:from-purple-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:opacity-50 transition-all transform hover:scale-[1.02]"
                              >
                                    {loading ? 'Creating Account...' : 'Create Account'}
                              </button>
                        </form>

                        <p className="text-center text-white/70 text-sm">
                              Already have an account?{' '}
                              <Link href="/login" className="text-purple-300 hover:text-purple-200 font-semibold transition">
                                    Sign in
                              </Link>
                        </p>
                  </div>
            </div>
      );
}
