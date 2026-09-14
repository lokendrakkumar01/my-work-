'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import Navbar from '../components/Navbar';
import Toast from '../components/Toast';

interface SocialPost {
  _id: string;
  content: string | { text: string; hashtags?: string[]; mentions?: string[]; media?: any[] };
  platform?: string;
  platforms?: string[];
  status: 'draft' | 'scheduled' | 'publishing' | 'published' | 'failed' | string;
  scheduledFor?: string;
  createdAt?: string;
}

export default function SocialPage() {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filters
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    content: '',
    platform: 'twitter',
    scheduledFor: '',
  });

  const fetchPosts = async () => {
    try {
      const [userRes, postsRes] = await Promise.all([
        api.getCurrentUser(),
        api.getSocialPosts(),
      ]);

      if (userRes.success) setUser(userRes.data?.user);
      if (postsRes.success) {
        setPosts(postsRes.data.posts || []);
      } else {
        setError(postsRes.message || 'Failed to fetch posts');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: any = {
        content: { text: formData.content },
        platforms: [formData.platform],
        status: formData.scheduledFor ? 'scheduled' : 'published',
      };
      if (formData.scheduledFor) {
        payload.scheduledFor = new Date(formData.scheduledFor).toISOString();
      }

      const res = await api.createSocialPost(payload);
      if (res.success) {
        setShowModal(false);
        setFormData({ content: '', platform: 'twitter', scheduledFor: '' });
        setToastMessage('Social post created successfully! 🚀');
        fetchPosts();
      } else {
        alert(res.message || res.error || 'Failed to create post');
      }
    } catch (err: any) {
      alert(err.message || 'An error occurred');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      setPosts((prev) => prev.filter((p) => p._id !== id));
      await api.deleteSocialPost(id);
      setToastMessage('Post deleted.');
    } catch (err) {
      alert('Failed to delete post');
      fetchPosts();
    }
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setToastMessage('Caption copied to clipboard! 📋');
  };

  // Filtered posts
  const filteredPosts = posts.filter((post) => {
    const platform = (post.platform || (post.platforms && post.platforms[0]) || 'twitter').toLowerCase();
    const contentText =
      typeof post.content === 'object' && post.content !== null
        ? post.content.text || ''
        : String(post.content || '');

    const matchesPlatform =
      selectedPlatform === 'all' ? true : platform === selectedPlatform;

    const matchesStatus =
      selectedStatus === 'all' ? true : post.status === selectedStatus;

    const matchesSearch =
      contentText.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesPlatform && matchesStatus && matchesSearch;
  });

  const charLimit = formData.platform === 'twitter' ? 280 : 3000;
  const charsRemaining = charLimit - formData.content.length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4" />
          <p className="text-slate-400 text-sm">Loading Social Hub...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar user={user} />

      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center space-x-2">
              <span>📱</span>
              <span>Social Media Hub</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Draft, schedule, and publish content across Twitter / X, LinkedIn, and Instagram.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/ai"
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-purple-300 text-xs font-semibold rounded-xl border border-purple-800/50 transition"
            >
              ✨ AI Captions
            </Link>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-purple-600/20 transition cursor-pointer"
            >
              + Create Post
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Platform filter pills */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 md:pb-0">
            {[
              { id: 'all', label: 'All Channels 🌐' },
              { id: 'twitter', label: 'Twitter / X 🐦' },
              { id: 'linkedin', label: 'LinkedIn 💼' },
              { id: 'instagram', label: 'Instagram 📸' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPlatform(p.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  selectedPlatform === p.id
                    ? 'bg-purple-600 text-white shadow'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-3">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="published">Published</option>
              <option value="scheduled">Scheduled</option>
              <option value="draft">Draft</option>
            </select>

            <input
              type="text"
              placeholder="Search post text..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500 w-full sm:w-44"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-900/40 border border-red-700 text-red-200 px-4 py-3 rounded-xl mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPosts.map((post) => {
            const platformName = (post.platform || (post.platforms && post.platforms[0]) || 'twitter').toLowerCase();
            const contentText =
              typeof post.content === 'object' && post.content !== null
                ? post.content.text || ''
                : String(post.content || '');

            const platformBadge = {
              twitter: { label: 'Twitter / X', style: 'bg-sky-500/10 text-sky-400 border-sky-500/30' },
              linkedin: { label: 'LinkedIn', style: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
              instagram: { label: 'Instagram', style: 'bg-pink-500/10 text-pink-400 border-pink-500/30' },
            }[platformName] || { label: platformName.toUpperCase(), style: 'bg-purple-500/10 text-purple-400 border-purple-500/30' };

            return (
              <div
                key={post._id}
                className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 transition shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${platformBadge.style}`}>
                      {platformBadge.label}
                    </span>

                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold uppercase ${
                        post.status === 'published'
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60'
                          : post.status === 'scheduled'
                          ? 'bg-amber-950/60 text-amber-400 border border-amber-800/60'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {post.status}
                    </span>
                  </div>

                  <p className="text-slate-200 text-sm whitespace-pre-line leading-relaxed mb-4">
                    {contentText}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
                  <span>
                    {post.scheduledFor
                      ? `🗓️ ${new Date(post.scheduledFor).toLocaleDateString()}`
                      : '⚡ Published'}
                  </span>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleCopyText(contentText)}
                      className="text-slate-400 hover:text-purple-400 transition cursor-pointer"
                    >
                      Copy
                    </button>
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="text-slate-500 hover:text-red-400 transition cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredPosts.length === 0 && (
            <div className="col-span-full text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800">
              <span className="text-4xl">📢</span>
              <h3 className="text-lg font-bold text-white mt-3">No social posts found</h3>
              <p className="text-slate-500 text-sm mt-1">
                Draft your first announcement or schedule a content drop.
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-lg transition cursor-pointer"
              >
                + Create First Post
              </button>
            </div>
          )}
        </div>

        {/* Create Post Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Create Social Post</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-slate-400 hover:text-white font-bold text-lg cursor-pointer"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Target Platform
                  </label>
                  <select
                    value={formData.platform}
                    onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                  >
                    <option value="twitter">Twitter / X 🐦 (280 chars)</option>
                    <option value="linkedin">LinkedIn 💼</option>
                    <option value="instagram">Instagram 📸</option>
                  </select>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-medium text-slate-300">
                      Post Content *
                    </label>
                    <span
                      className={`text-xs ${
                        charsRemaining < 0 ? 'text-red-400 font-bold' : 'text-slate-500'
                      }`}
                    >
                      {charsRemaining} chars left
                    </span>
                  </div>
                  <textarea
                    rows={5}
                    required
                    placeholder="Write your update, hashtags, or announcements..."
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <div className="flex justify-end mt-1">
                    <Link
                      href="/ai"
                      onClick={() => setShowModal(false)}
                      className="text-xs text-purple-400 hover:text-purple-300 flex items-center space-x-1"
                    >
                      <span>✨ Need creative ideas? Open AI Copilot</span>
                    </Link>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Schedule for Later (Optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.scheduledFor}
                    onChange={(e) => setFormData({ ...formData, scheduledFor: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-slate-400 hover:text-white text-sm font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm rounded-lg shadow transition cursor-pointer"
                  >
                    Publish / Schedule
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
