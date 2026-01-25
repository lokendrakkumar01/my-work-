'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function AIPage() {
      const router = useRouter();
      const [loading, setLoading] = useState(false);
      const [result, setResult] = useState('');
      const [mode, setMode] = useState('caption'); // caption, ideas, script
      const [formData, setFormData] = useState({
            context: '',
            platform: 'instagram',
            tone: 'professional',
            topic: '',
            niche: ''
      });

      const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            setLoading(true);
            setResult('');

            try {
                  let res;
                  if (mode === 'caption') {
                        res = await api.generateCaption({
                              context: formData.context,
                              platform: formData.platform,
                              tone: formData.tone
                        });
                  } else if (mode === 'ideas') {
                        res = await api.generateContentIdeas({
                              niche: formData.niche || formData.context,
                              platform: formData.platform
                        });
                  } else if (mode === 'script') {
                        res = await api.generateScript({
                              topic: formData.topic || formData.context
                        });
                  }

                  if (res?.success) {
                        // Adjust based on response structure
                        const output = res.data.caption || res.data.script || res.data.ideas;
                        setResult(typeof output === 'string' ? output : JSON.stringify(output, null, 2));
                  } else {
                        setResult('Failed to generate content. Please try again.');
                  }
            } catch (err) {
                  setResult('An error occurred. AI service might be unavailable.');
            } finally {
                  setLoading(false);
            }
      };

      return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
                  <div className="max-w-4xl mx-auto">
                        <div className="flex justify-between items-center mb-8">
                              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI Copilot 🤖</h1>
                              <button
                                    onClick={() => router.push('/dashboard')}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-900 bg-gray-200 rounded-lg"
                              >
                                    Back to Dashboard
                              </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              {/* Sidebar Controls */}
                              <div className="space-y-4">
                                    <button
                                          onClick={() => setMode('caption')}
                                          className={`w-full p-4 rounded-lg text-left font-medium transition ${mode === 'caption' ? 'bg-purple-600 text-white' : 'bg-white text-gray-700'}`}
                                    >
                                          📝 Social Caption
                                    </button>
                                    <button
                                          onClick={() => setMode('ideas')}
                                          className={`w-full p-4 rounded-lg text-left font-medium transition ${mode === 'ideas' ? 'bg-purple-600 text-white' : 'bg-white text-gray-700'}`}
                                    >
                                          💡 Content Ideas
                                    </button>
                                    <button
                                          onClick={() => setMode('script')}
                                          className={`w-full p-4 rounded-lg text-left font-medium transition ${mode === 'script' ? 'bg-purple-600 text-white' : 'bg-white text-gray-700'}`}
                                    >
                                          🎬 Video Script
                                    </button>
                              </div>

                              {/* Main Input Area */}
                              <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow p-6">
                                    <form onSubmit={handleSubmit}>
                                          {mode === 'caption' && (
                                                <div className="space-y-4">
                                                      <div>
                                                            <label className="block text-sm font-medium mb-1">Platform</label>
                                                            <select
                                                                  className="w-full p-2 border rounded"
                                                                  value={formData.platform}
                                                                  onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                                                            >
                                                                  <option value="instagram">Instagram</option>
                                                                  <option value="twitter">Twitter</option>
                                                                  <option value="linkedin">LinkedIn</option>
                                                            </select>
                                                      </div>
                                                      <div>
                                                            <label className="block text-sm font-medium mb-1">What is your post about?</label>
                                                            <textarea
                                                                  className="w-full p-2 border rounded h-32"
                                                                  placeholder="E.g., Launching a new coffee blend called 'Morning Mist'..."
                                                                  value={formData.context}
                                                                  onChange={(e) => setFormData({ ...formData, context: e.target.value })}
                                                                  required
                                                            ></textarea>
                                                      </div>
                                                </div>
                                          )}

                                          {mode === 'ideas' && (
                                                <div className="space-y-4">
                                                      <div>
                                                            <label className="block text-sm font-medium mb-1">Niche / Topic</label>
                                                            <input
                                                                  type="text"
                                                                  className="w-full p-2 border rounded"
                                                                  placeholder="E.g., Digital Marketing, Fitness..."
                                                                  value={formData.niche}
                                                                  onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
                                                                  required
                                                            />
                                                      </div>
                                                </div>
                                          )}

                                          {mode === 'script' && (
                                                <div className="space-y-4">
                                                      <div>
                                                            <label className="block text-sm font-medium mb-1">Video Topic</label>
                                                            <input
                                                                  type="text"
                                                                  className="w-full p-2 border rounded"
                                                                  placeholder="E.g., How to bake sourdough bread..."
                                                                  value={formData.topic}
                                                                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                                                                  required
                                                            />
                                                      </div>
                                                </div>
                                          )}

                                          <button
                                                type="submit"
                                                disabled={loading}
                                                className="mt-6 w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-bold hover:opacity-90 transition disabled:opacity-50"
                                          >
                                                {loading ? 'Generating Magic... ✨' : 'Generate Content 🚀'}
                                          </button>
                                    </form>

                                    {result && (
                                          <div className="mt-8 pt-6 border-t">
                                                <h3 className="text-lg font-bold mb-3">AI Output:</h3>
                                                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg whitespace-pre-wrap font-mono text-sm">
                                                      {result}
                                                </div>
                                                <button
                                                      onClick={() => navigator.clipboard.writeText(result)}
                                                      className="mt-2 text-sm text-purple-600 hover:text-purple-800 font-medium"
                                                >
                                                      Copy to Clipboard
                                                </button>
                                          </div>
                                    )}
                              </div>
                        </div>
                  </div>
            </div>
      );
}
