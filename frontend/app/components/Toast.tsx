'use client';

import { useEffect } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
}

export default function Toast({ message, type = 'success', onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColors = {
    success: 'bg-emerald-600 text-white shadow-emerald-900/30',
    error: 'bg-red-600 text-white shadow-red-900/30',
    info: 'bg-indigo-600 text-white shadow-indigo-900/30',
  };

  const icons = {
    success: '✅',
    error: '⚠️',
    info: 'ℹ️',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-2 px-4 py-3 rounded-xl shadow-xl text-sm font-medium animate-bounce transition-all ${bgColors[type]}">
      <span>{icons[type]}</span>
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 text-white/80 hover:text-white font-bold cursor-pointer">
        ×
      </button>
    </div>
  );
}
