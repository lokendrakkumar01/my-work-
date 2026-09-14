'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Navbar from '../components/Navbar';
import Toast from '../components/Toast';

export default function AIPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modes: caption, script, ideas, hashtags, productivity
  const [mode, setMode] = useState<'caption' | 'script' | 'ideas' | 'hashtags' | 'productivity'>('caption');

  const [formData, setFormData] = useState({
    context: '',
    platform: 'twitter',
    tone: 'engaging and witty',
    topic: '',
    duration: 8,
    style: 'educational & fast-paced',
    niche: '',
    goals: '',
    timeframe: 'this week',
  });

  useEffect(() => {
    api.getCurrentUser().then((res) => {
      if (res.success) setUser(res.data?.user);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult('');

    try {
      let res: any;

      if (mode === 'caption') {
        res = await api.generateCaption({
          context: formData.context,
          platform: formData.platform,
          tone: formData.tone,
        });
      } else if (mode === 'script') {
        res = await api.generateScript({
          topic: formData.topic || formData.context,
          duration: Number(formData.duration),
          style: formData.style,
        });
      } else if (mode === 'ideas') {
        res = await api.generateContentIdeas({
          niche: formData.niche || formData.context,
          platform: formData.platform,
        });
      } else if (mode === 'hashtags') {
        res = await api.generateHashtags({
          content: formData.context,
          platform: formData.platform,
        });
      } else if (mode === 'productivity') {
        res = await api.generateProductivityPlan({
          goals: formData.goals || formData.context,
          timeframe: formData.timeframe,
        });
      }

      if (res?.success) {
        const output =
          res.data?.caption ||
          res.data?.script ||
          res.data?.ideas ||
          res.data?.hashtags ||
          res.data?.plan;

        setResult(
          typeof output === 'string'
            ? output
            : Array.isArray(output)
            ? output.join('\n\n')
            : JSON.stringify(output, null, 2)
        );
        setToastMessage('AI generation complete! ✨');
      } else {
        setResult(
          res?.error ||
            'AI service responded with fallback. Make sure GEMINI_API_KEY is configured in backend.'
        );
      }
    } catch (err: any) {
      setResult('An error occurred contacting the AI service. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setToastMessage('Content copied to clipboard! 📋');
  };

  const handleSendToSocial = () => {
    handleCopy();
    router.push('/social');
  };

  const handleSendToYouTube = () => {
    handleCopy();
    router.push('/youtube');
  };

  const modesList = [
    { id: 'caption', label: 'Social Caption', icon: '📝', desc: 'Engaging copy for Twitter, LinkedIn, Instagram' },
    { id: 'script', label: 'YouTube Script', icon: '🎬', desc: 'Structured scripts with hooks & chapters' },
    { id: 'ideas', label: 'Content Ideas', icon: '💡', desc: '10 viral video and post angles for your niche' },
    { id: 'hashtags', label: 'Viral Hashtags', icon: '🏷️', desc: 'High-reach & niche-specific tags' },
    { id: 'productivity', label: 'Sprint Plan', icon: '📅', desc: 'Actionable weekly schedule & goal roadmap' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar user={user} />

      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30 mb-2">
            <span>Powered by Google Gemini 1.5 Flash</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center space-x-2">
            <span>🤖</span>
            <span>Creator AI Copilot</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Supercharge your writing, video structuring, and creative ideation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Mode Selector Sidebar */}
          <div className="lg:col-span-4 space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 px-1">
              Select AI Tool
            </h2>

            {modesList.map((m) => {
              const isSelected = mode === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => {
                    setMode(m.id as any);
                    setResult('');
                  }}
                  className={`w-full p-4 rounded-xl text-left transition cursor-pointer border ${
                    isSelected
                      ? 'bg-purple-950/60 border-purple-600 text-white shadow-lg shadow-purple-950/40'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{m.icon}</span>
                    <div>
                      <div className="font-bold text-sm">{m.label}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{m.desc}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Generator Form & Output Area */}
          <div className="lg:col-span-8 space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Caption Generator Inputs */}
                {mode === 'caption' && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Platform
                        </label>
                        <select
                          value={formData.platform}
                          onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                        >
                          <option value="twitter">Twitter / X 🐦</option>
                          <option value="linkedin">LinkedIn 💼</option>
                          <option value="instagram">Instagram 📸</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Tone
                        </label>
                        <input
                          type="text"
                          value={formData.tone}
                          onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                          placeholder="e.g. professional, humorous, inspirational"
                          className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        What is this post about? *
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={formData.context}
                        onChange={(e) => setFormData({ ...formData, context: e.target.value })}
                        placeholder="e.g. Launching my new open-source developer tool for creators..."
                        className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </>
                )}

                {/* Script Generator Inputs */}
                {mode === 'script' && (
                  <>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        YouTube Video Topic *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.topic}
                        onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                        placeholder="e.g. How to Deploy a MERN Stack App to Render in 10 Minutes"
                        className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Target Duration (Minutes)
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={60}
                          value={formData.duration}
                          onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                          className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Presentation Style
                        </label>
                        <input
                          type="text"
                          value={formData.style}
                          onChange={(e) => setFormData({ ...formData, style: e.target.value })}
                          placeholder="e.g. hands-on tutorial, storytelling"
                          className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Content Ideas Inputs */}
                {mode === 'ideas' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Your Niche or Industry *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.niche}
                        onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
                        placeholder="e.g. Web Development, AI Tools, Personal Finance"
                        className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Target Platform
                      </label>
                      <select
                        value={formData.platform}
                        onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                      >
                        <option value="youtube">YouTube Videos</option>
                        <option value="twitter">Twitter / X Threads</option>
                        <option value="linkedin">LinkedIn Articles</option>
                        <option value="instagram">Instagram Reels</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Hashtag Generator Inputs */}
                {mode === 'hashtags' && (
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Post Content or Keywords *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={formData.context}
                      onChange={(e) => setFormData({ ...formData, context: e.target.value })}
                      placeholder="Paste your post draft to generate tailored hashtags..."
                      className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                )}

                {/* Productivity Plan Inputs */}
                {mode === 'productivity' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Creator Goals *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.goals}
                        onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                        placeholder="e.g. Publish 2 YouTube videos, 5 tweets, and finish course outline"
                        className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Time Horizon
                      </label>
                      <select
                        value={formData.timeframe}
                        onChange={(e) => setFormData({ ...formData, timeframe: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                      >
                        <option value="this week">This Week (7-Day Sprint)</option>
                        <option value="the next 30 days">Next 30 Days (Monthly Sprint)</option>
                        <option value="today">Today (Daily Deep Focus)</option>
                      </select>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-purple-600/20 transition cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Generating with Gemini AI... ✨' : '🚀 Generate AI Content'}
                </button>
              </form>
            </div>

            {/* Output Display Card */}
            {result && (
              <div className="p-6 rounded-2xl bg-slate-900/90 border border-purple-800/50 shadow-2xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">✨</span>
                    <h3 className="font-bold text-white text-base">Generated Content</h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={handleCopy}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition cursor-pointer flex items-center space-x-1"
                    >
                      <span>📋</span>
                      <span>Copy</span>
                    </button>

                    {mode === 'caption' && (
                      <button
                        onClick={handleSendToSocial}
                        className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-lg transition cursor-pointer flex items-center space-x-1"
                      >
                        <span>📱</span>
                        <span>Post to Social Hub</span>
                      </button>
                    )}

                    {mode === 'script' && (
                      <button
                        onClick={handleSendToYouTube}
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded-lg transition cursor-pointer flex items-center space-x-1"
                      >
                        <span>🎬</span>
                        <span>Save to YouTube Studio</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 max-h-96 overflow-y-auto font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {result}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
