'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

interface Video {
      _id: string;
      title: string;
      description: string;
      status: string;
      thumbnailUrl?: string;
}

export default function YouTubePage() {
      const router = useRouter();
      const [videos, setVideos] = useState<Video[]>([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState('');
      const [showModal, setShowModal] = useState(false);
      const [formData, setFormData] = useState({
            title: '',
            description: '',
            status: 'idea'
      });

      const fetchVideos = async () => {
            try {
                  const res = await api.getYouTubeVideos();
                  if (res.success) {
                        setVideos(res.data.videos);
                  } else {
                        setError(res.message || 'Failed to fetch videos');
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
                  const res = await api.createYouTubeVideo(formData);
                  if (res.success) {
                        setShowModal(false);
                        setFormData({ title: '', description: '', status: 'idea' });
                        fetchVideos();
                  } else {
                        alert(res.message || 'Failed to create video');
                  }
            } catch (err: any) {
                  alert(err.message || 'An error occurred');
            }
      };

      if (loading) return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
            </div>
      );

      return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
                  <div className="max-w-7xl mx-auto">
                        <div className="flex justify-between items-center mb-8">
                              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">YouTube Content</h1>
                              <div className="space-x-4">
                                    <button
                                          onClick={() => router.push('/dashboard')}
                                          className="px-4 py-2 text-gray-600 hover:text-gray-900 bg-gray-200 rounded-lg"
                                    >
                                          Back to Dashboard
                                    </button>
                                    <button
                                          onClick={() => setShowModal(true)}
                                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                    >
                                          + New Video
                                    </button>
                              </div>
                        </div>

                        {error && (
                              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                    {error}
                              </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {videos.map((video) => (
                                    <div key={video._id} className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
                                          <div className="flex justify-between items-start mb-4">
                                                <h3 className="text-xl font-bold dark:text-white truncate">{video.title}</h3>
                                                <span className={`px-2 py-1 rounded text-xs font-semibold
                  ${video.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                      {video.status}
                                                </span>
                                          </div>
                                          <p className="text-gray-600 dark:text-gray-300 line-clamp-3 mb-4">{video.description}</p>
                                    </div>
                              ))}

                              {videos.length === 0 && (
                                    <div className="col-span-full text-center py-12 text-gray-500">
                                          No videos found. Start planning your next hit!
                                    </div>
                              )}
                        </div>

                        {showModal && (
                              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                                    <div className="bg-white dark:bg-gray-800 rounded-xl max-w-lg w-full p-6">
                                          <h2 className="text-xl font-bold mb-4 dark:text-white">New Video Project</h2>
                                          <form onSubmit={handleSubmit}>
                                                <div className="mb-4">
                                                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                                                      <input
                                                            type="text"
                                                            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                                            value={formData.title}
                                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                            required
                                                      />
                                                </div>
                                                <div className="mb-4">
                                                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description/Notes</label>
                                                      <textarea
                                                            className="w-full p-2 border rounded h-32 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                                            value={formData.description}
                                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                      ></textarea>
                                                </div>
                                                <div className="flex justify-end space-x-3">
                                                      <button
                                                            type="button"
                                                            onClick={() => setShowModal(false)}
                                                            className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                                      >
                                                            Cancel
                                                      </button>
                                                      <button
                                                            type="submit"
                                                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                                      >
                                                            Creates Project
                                                      </button>
                                                </div>
                                          </form>
                                    </div>
                              </div>
                        )}
                  </div>
            </div>
      );
}
