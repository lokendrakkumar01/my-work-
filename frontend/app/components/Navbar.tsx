'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import api from '@/lib/api';

interface NavbarProps {
  user?: {
    email?: string;
    profile?: {
      fullName?: string;
    };
  } | null;
}

export default function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'Tasks', href: '/tasks', icon: '✅' },
    { name: 'Social Hub', href: '/social', icon: '📱' },
    { name: 'YouTube Studio', href: '/youtube', icon: '🎬' },
    { name: 'AI Copilot', href: '/ai', icon: '🤖' },
    { name: 'Analytics', href: '/analytics', icon: '📈' },
  ];

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch (e) {
      console.error(e);
    }
    router.push('/login');
  };

  const displayName = user?.profile?.fullName || user?.email?.split('@')[0] || 'Creator';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Desktop Nav */}
          <div className="flex items-center space-x-8">
            <Link href="/dashboard" className="flex items-center space-x-2 group">
              <span className="text-2xl transform group-hover:scale-110 transition-transform">🚀</span>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
                Creator Hub
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 font-semibold shadow-sm border border-purple-200/50 dark:border-purple-800/50'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/70 dark:hover:bg-gray-800/70'
                    }`}
                  >
                    <span>{link.icon}</span>
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* User Badge & Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-3 bg-gray-100/80 dark:bg-gray-800/80 py-1.5 px-3 rounded-full border border-gray-200 dark:border-gray-700">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow">
                {initial}
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate max-w-[140px]">
                {displayName}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="px-3.5 py-1.5 text-xs font-semibold text-red-600 dark:text-red-400 hover:text-white hover:bg-red-600 dark:hover:bg-red-600 border border-red-200 dark:border-red-900/50 rounded-lg transition-colors cursor-pointer"
            >
              Sign Out
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none cursor-pointer"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg px-4 pt-2 pb-4 space-y-1">
          <div className="flex items-center space-x-3 py-2 px-3 mb-2 bg-gray-50 dark:bg-gray-800/60 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-bold text-sm flex items-center justify-center">
              {initial}
            </div>
            <div className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
              {displayName}
            </div>
          </div>

          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-2 px-3 py-2.5 rounded-lg text-base font-medium ${
                  isActive
                    ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <span>{link.icon}</span>
                <span>{link.name}</span>
              </Link>
            );
          })}

          <button
            onClick={handleLogout}
            className="w-full mt-2 text-left flex items-center space-x-2 px-3 py-2.5 rounded-lg text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer"
          >
            <span>🚪</span>
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </nav>
  );
}
