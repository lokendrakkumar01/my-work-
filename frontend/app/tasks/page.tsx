'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

interface Task {
      _id: string;
      title: string;
      description: string;
      priority: string;
      status: string;
      dueDate: string;
}

export default function TasksPage() {
      const router = useRouter();
      const [tasks, setTasks] = useState<Task[]>([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState('');
      const [showModal, setShowModal] = useState(false);
      const [formData, setFormData] = useState({
            title: '',
            description: '',
            priority: 'medium',
            dueDate: ''
      });

      const fetchTasks = async () => {
            try {
                  const res = await api.getTasks();
                  if (res.success) {
                        setTasks(res.data.tasks);
                  } else {
                        setError(res.message || 'Failed to fetch tasks');
                  }
            } catch (err: any) {
                  setError(err.message || 'An error occurred');
            } finally {
                  setLoading(false);
            }
      };

      useEffect(() => {
            fetchTasks();
      }, []);

      const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            try {
                  const res = await api.createTask({
                        ...formData,
                        status: 'pending' // Default status
                  });
                  if (res.success) {
                        setShowModal(false);
                        setFormData({ title: '', description: '', priority: 'medium', dueDate: '' });
                        fetchTasks();
                  } else {
                        alert(res.message || 'Failed to create task');
                  }
            } catch (err: any) {
                  alert(err.message || 'An error occurred');
            }
      };

      const handleDelete = async (id: string) => {
            if (!confirm('Are you sure?')) return;
            try {
                  await api.deleteTask(id);
                  setTasks(tasks.filter(t => t._id !== id));
            } catch (err) {
                  alert('Failed to delete task');
            }
      };

      if (loading) return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
      );

      return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
                  <div className="max-w-7xl mx-auto">
                        <div className="flex justify-between items-center mb-8">
                              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Task Manager</h1>
                              <div className="space-x-4">
                                    <button
                                          onClick={() => router.push('/dashboard')}
                                          className="px-4 py-2 text-gray-600 hover:text-gray-900 bg-gray-200 rounded-lg"
                                    >
                                          Back to Dashboard
                                    </button>
                                    <button
                                          onClick={() => setShowModal(true)}
                                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                          + Add Task
                                    </button>
                              </div>
                        </div>

                        {error && (
                              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                    {error}
                              </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {tasks.map((task) => (
                                    <div key={task._id} className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 border-l-4 border-blue-500">
                                          <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-lg font-bold dark:text-white">{task.title}</h3>
                                                <span className={`px-2 py-1 rounded text-xs font-semibold
                  ${task.priority === 'high' ? 'bg-red-100 text-red-800' :
                                                            task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                                                  'bg-green-100 text-green-800'}`}>
                                                      {task.priority}
                                                </span>
                                          </div>
                                          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{task.description}</p>
                                          <div className="flex justify-between items-center text-sm text-gray-500">
                                                <span>Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}</span>
                                                <button
                                                      onClick={() => handleDelete(task._id)}
                                                      className="text-red-500 hover:text-red-700"
                                                >
                                                      Delete
                                                </button>
                                          </div>
                                    </div>
                              ))}

                              {tasks.length === 0 && (
                                    <div className="col-span-full text-center py-12 text-gray-500">
                                          No tasks pending. You are all caught up!
                                    </div>
                              )}
                        </div>

                        {showModal && (
                              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                                    <div className="bg-white dark:bg-gray-800 rounded-xl max-w-lg w-full p-6">
                                          <h2 className="text-xl font-bold mb-4 dark:text-white">Add New Task</h2>
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
                                                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                                                      <textarea
                                                            className="w-full p-2 border rounded h-24 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                                            value={formData.description}
                                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                      ></textarea>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4 mb-4">
                                                      <div>
                                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
                                                            <select
                                                                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                                                  value={formData.priority}
                                                                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                                            >
                                                                  <option value="low">Low</option>
                                                                  <option value="medium">Medium</option>
                                                                  <option value="high">High</option>
                                                            </select>
                                                      </div>
                                                      <div>
                                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Due Date</label>
                                                            <input
                                                                  type="date"
                                                                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                                                  value={formData.dueDate}
                                                                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                                            />
                                                      </div>
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
                                                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                                      >
                                                            Add Task
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
