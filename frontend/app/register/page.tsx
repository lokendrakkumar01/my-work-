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
        setError(response.error || response.message || 'Registration failed');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
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
            ✨ Join Creator Hub
          </h1>
          <p className="text-slate-400 text-sm mt-1">Create your creator workspace</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-900/40 border border-red-700/60 rounded-lg text-red-200 text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="fullName" className="block text-xs font-medium text-slate-300 mb-1">
              Full Name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              placeholder="Alex Morgan"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-xs font-medium text-slate-300 mb-1">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              placeholder="alex@domain.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-medium text-slate-300 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              placeholder="••••••••"
            />
            <p className="mt-1 text-[11px] text-slate-400">
              Minimum 8 characters
            </p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-xs font-medium text-slate-300 mb-1">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-sm rounded-lg shadow transition cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Creating Workspace...' : 'Create Free Account'}
          </button>
        </form>

        <p className="text-center text-slate-400 text-xs">
          Already have an account?{' '}
          <Link href="/login" className="text-purple-400 hover:text-purple-300 font-semibold transition">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
