'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import Navbar from '../components/Navbar';
import Toast from '../components/Toast';

interface Video {
  _id: string;
  title?: string;
  description?: string;
  stage: string;
  status?: string;
  thumbnailUrl?: string;
  idea?: {
    title?: string;
    description?: string;
    category?: string;
    priority?: string;
  };
}

const STAGES = [
  { id: 'idea', label: 'Idea 💡', next: 'script' },
  { id: 'script', label: 'Scripting 📝', next: 'recording' },
  { id: 'recording', label: 'Recording 🎥', next: 'editing' },
  { id: 'editing', label: 'Editing ✂️', next: 'optimizing' },
  { id: 'optimizing', label: 'Optimizing 🎯', next: 'publishing' },
  { id: 'publishing', label: 'Publishing 📤', next: 'published' },
  { id: 'published', label: 'Live 🚀', next: null },
];

export default function YouTubePage() {
  const router = useRouter();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filter
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    stage: 'idea',
    category: 'Tech & Coding',
  });

  const fetchVideos = async () => {
    try {
      const [userRes, videosRes] = await Promise.all([
        api.getCurrentUser(),
        api.getYouTubeVideos(),
      ]);

      if (userRes.success) setUser(userRes.data?.user);
      if (videosRes.success) {
        setVideos(videosRes.data.videos || []);
      } else {
        setError(videosRes.message || 'Failed to fetch videos');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        idea: {
          title: formData.title,
          description: formData.description,
          category: formData.category,
        },
        stage: formData.stage,
      };

      const res = await api.createYouTubeVideo(payload);
      if (res.success) {
        setShowModal(false);
        setFormData({ title: '', description: '', stage: 'idea', category: 'Tech & Coding' });
        setToastMessage('YouTube project created! 🎬');
        fetchVideos();
      } else {
        alert(res.message || res.error || 'Failed to create video');
      }
    } catch (err: any) {
      alert(err.message || 'An error occurred');
    }
  };

  const handleAdvanceStage = async (video: Video) => {
    const currentStage = video.stage || 'idea';
    const stageObj = STAGES.find((s) => s.id === currentStage);
    const nextStage = stageObj?.next;

    if (!nextStage) return; // already published

    try {
      // Optimistic update
      setVideos((prev) =>
        prev.map((v) => (v._id === video._id ? { ...v, stage: nextStage } : v))
      );

      await api.updateYouTubeVideo(video._id, { stage: nextStage });
      setToastMessage(`Project advanced to ${nextStage.toUpperCase()}! 🚀`);
    } catch (err) {
      fetchVideos();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this YouTube video project?')) return;
    try {
      setVideos((prev) => prev.filter((v) => v._id !== id));
      await api.deleteYouTubeVideo(id);
      setToastMessage('Video project removed.');
    } catch (err) {
      alert('Failed to delete video');
      fetchVideos();
    }
  };

  // Filtered videos
  const filteredVideos = videos.filter((video) => {
    const title = video.idea?.title || video.title || '';
    const desc = video.idea?.description || video.description || '';
    const stage = video.stage || 'idea';

    const matchesStage = stageFilter === 'all' ? true : stage === stageFilter;
    const matchesSearch =
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      desc.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStage && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mx-auto mb-4" />
          <p className="text-slate-400 text-sm">Loading YouTube Studio...</p>
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
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center space-x-2">
              <span>🎬</span>
              <span>YouTube Creator Studio</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Move video concepts through the 7-stage production lifecycle.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/ai"
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-red-400 text-xs font-semibold rounded-xl border border-red-800/50 transition"
            >
              ✨ AI Script Writer
            </Link>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-red-600/20 transition cursor-pointer"
            >
              + New Video Project
            </button>
          </div>
        </div>

        {/* Pipeline Stage Bar */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 mb-6">
          <div className="flex items-center justify-between overflow-x-auto pb-2 gap-2">
            <button
              onClick={() => setStageFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                stageFilter === 'all'
                  ? 'bg-red-600 text-white shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              All Stages ({videos.length})
            </button>

            {STAGES.map((s) => {
              const count = videos.filter((v) => (v.stage || 'idea') === s.id).length;
              return (
                <button
                  key={s.id}
                  onClick={() => setStageFilter(s.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap flex items-center space-x-1.5 ${
                    stageFilter === s.id
                      ? 'bg-red-600 text-white shadow'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <span>{s.label}</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px] text-slate-300">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800 flex justify-end">
            <input
              type="text"
              placeholder="Search video titles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-red-500 w-full sm:w-64"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-900/40 border border-red-700 text-red-200 px-4 py-3 rounded-xl mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Video Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredVideos.map((video) => {
            const videoTitle = video.idea?.title || video.title || 'Untitled Video';
            const videoDesc = video.idea?.description || video.description || '';
            const currentStage = video.stage || 'idea';
            const stageObj = STAGES.find((s) => s.id === currentStage);

            return (
              <div
                key={video._id}
                className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-red-500/40 transition shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/30">
                      {stageObj?.label || currentStage.toUpperCase()}
                    </span>

                    {video.idea?.category && (
                      <span className="text-[11px] text-slate-400">
                        {video.idea.category}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-white tracking-tight mb-2 line-clamp-2">
                    {videoTitle}
                  </h3>

                  {videoDesc && (
                    <p className="text-slate-400 text-xs line-clamp-3 mb-4 leading-relaxed">
                      {videoDesc}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-800 space-y-2">
                  {stageObj?.next && (
                    <button
                      onClick={() => handleAdvanceStage(video)}
                      className="w-full py-1.5 px-3 bg-red-950/60 hover:bg-red-900/60 border border-red-800/60 hover:border-red-700 text-red-300 text-xs font-bold rounded-lg transition cursor-pointer flex items-center justify-center space-x-1"
                    >
                      <span>Advance to {stageObj.next.toUpperCase()}</span>
                      <span>➡️</span>
                    </button>
                  )}

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                    <Link
                      href="/ai"
                      className="text-slate-400 hover:text-red-400 transition"
                    >
                      Write Script ✨
                    </Link>

                    <button
                      onClick={() => handleDelete(video._id)}
                      className="text-slate-500 hover:text-red-400 transition cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredVideos.length === 0 && (
            <div className="col-span-full text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800">
              <span className="text-4xl">🎥</span>
              <h3 className="text-lg font-bold text-white mt-3">No video projects found</h3>
              <p className="text-slate-500 text-sm mt-1">
                Start mapping out your next high-retention YouTube video!
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-lg transition cursor-pointer"
              >
                + Plan New Video
              </button>
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Create Video Project</h2>
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
                    Video Title or Concept *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. How I Built a SaaS in 7 Days"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Outline, Hook & Target Audience
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Hook, 3 key takeaways, target duration..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Starting Pipeline Stage
                    </label>
                    <select
                      value={formData.stage}
                      onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
                    >
                      <option value="idea">Idea 💡</option>
                      <option value="script">Scripting 📝</option>
                      <option value="recording">Recording 🎥</option>
                      <option value="editing">Editing ✂️</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Category
                    </label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
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
                    className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-sm rounded-lg shadow transition cursor-pointer"
                  >
                    Create Project
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
