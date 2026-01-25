'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

interface SocialPost {
      _id: string;
      content: string;
      platform: string;
      status: string;
      scheduledFor: string;
      createdAt: string;
}

export default function SocialPage() {
      const router = useRouter();
      const [posts, setPosts] = useState<SocialPost[]>([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState('');
      const [showModal, setShowModal] = useState(false);
      const [formData, setFormData] = useState({
            content: '',
            platform: 'twitter',
            scheduledFor: ''
      });

      const fetchPosts = async () => {
            try {
                  const res = await api.getSocialPosts();
                  if (res.success) {
                        setPosts(res.data.posts);
                  } else {
                        setError(res.message || 'Failed to fetch posts');
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
                  const res = await api.createSocialPost(formData);
                  if (res.success) {
                        setShowModal(false);
                        setFormData({ content: '', platform: 'twitter', scheduledFor: '' });
                        fetchPosts(); // Refresh list
                  } else {
                        alert(res.message || 'Failed to create post');
                  }
            } catch (err: any) {
                  alert(err.message || 'An error occurred');
            }
      };

      if (loading) return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
            </div>
      );

      return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
                  <div className="max-w-7xl mx-auto">
                        <div className="flex justify-between items-center mb-8">
                              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Social Media Posts</h1>
                              <div className="space-x-4">
                                    <button
                                          onClick={() => router.push('/dashboard')}
                                          className="px-4 py-2 text-gray-600 hover:text-gray-900 bg-gray-200 rounded-lg"
                                    >
                                          Back to Dashboard
                                    </button>
                                    <button
                                          onClick={() => setShowModal(true)}
                                          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                                    >
                                          + New Post
                                    </button>
                              </div>
                        </div>

                        {error && (
                              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                    {error}
                              </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {posts.map((post) => (
                                    <div key={post._id} className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
                                          <div className="flex justify-between items-start mb-4">
                                                <span className={`px-2 py-1 rounded text-xs font-semibold
                  ${post.platform === 'twitter' ? 'bg-blue-100 text-blue-800' :
                                                            post.platform === 'linkedin' ? 'bg-blue-50 text-blue-600' :
                                                                  'bg-purple-100 text-purple-800'}`}>
                                                      {post.platform.toUpperCase()}
                                                </span>
                                                <span className={`px-2 py-1 rounded text-xs font-semibold
                  ${post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                      {post.status}
                                                </span>
                                          </div>
                                          <p className="text-gray-800 dark:text-gray-200 mb-4">{post.content}</p>
                                          <div className="text-sm text-gray-500 dark:text-gray-400">
                                                Scheduled: {post.scheduledFor ? new Date(post.scheduledFor).toLocaleDateString() : 'Now'}
                                          </div>
                                    </div>
                              ))}

                              {posts.length === 0 && (
                                    <div className="col-span-full text-center py-12 text-gray-500">
                                          No posts found. Create your first one!
                                    </div>
                              )}
                        </div>

                        {showModal && (
                              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                                    <div className="bg-white dark:bg-gray-800 rounded-xl max-w-lg w-full p-6">
                                          <h2 className="text-xl font-bold mb-4 dark:text-white">Create New Post</h2>
                                          <form onSubmit={handleSubmit}>
                                                <div className="mb-4">
                                                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Platform</label>
                                                      <select
                                                            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                                            value={formData.platform}
                                                            onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                                                      >
                                                            <option value="twitter">Twitter</option>
                                                            <option value="linkedin">LinkedIn</option>
                                                            <option value="instagram">Instagram</option>
                                                      </select>
                                                </div>
                                                <div className="mb-4">
                                                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content</label>
                                                      <textarea
                                                            className="w-full p-2 border rounded h-32 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                                            value={formData.content}
                                                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                                            required
                                                      ></textarea>
                                                </div>
                                                <div className="mb-6">
                                                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Schedule date (optional)</label>
                                                      <input
                                                            type="datetime-local"
                                                            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                                            value={formData.scheduledFor}
                                                            onChange={(e) => setFormData({ ...formData, scheduledFor: e.target.value })}
                                                      />
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
                                                            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                                                      >
                                                            Create Post
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
