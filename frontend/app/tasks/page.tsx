'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Navbar from '../components/Navbar';
import Toast from '../components/Toast';

interface Task {
  _id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent' | string;
  status: 'todo' | 'in-progress' | 'completed' | 'cancelled' | string;
  dueDate?: string;
  createdAt?: string;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'todo' | 'in-progress' | 'completed'>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
  });

  const fetchTasks = async () => {
    try {
      const [userRes, tasksRes] = await Promise.all([
        api.getCurrentUser(),
        api.getTasks(),
      ]);

      if (userRes.success) setUser(userRes.data?.user);
      if (tasksRes.success) {
        setTasks(tasksRes.data.tasks || []);
      } else {
        setError(tasksRes.message || 'Failed to fetch tasks');
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
      const payload: any = {
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        status: 'todo',
      };
      if (formData.dueDate) {
        payload.dueDate = new Date(formData.dueDate).toISOString();
      }
      const res = await api.createTask(payload);
      if (res.success) {
        setShowModal(false);
        setFormData({ title: '', description: '', priority: 'medium', dueDate: '' });
        setToastMessage('Task created successfully! 🎯');
        fetchTasks();
      } else {
        alert(res.message || res.error || 'Failed to create task');
      }
    } catch (err: any) {
      alert(err.message || 'An error occurred');
    }
  };

  const handleStatusToggle = async (task: Task) => {
    let nextStatus = 'todo';
    if (task.status === 'todo') nextStatus = 'in-progress';
    else if (task.status === 'in-progress') nextStatus = 'completed';
    else if (task.status === 'completed') nextStatus = 'todo';

    try {
      // Optimistic update
      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? { ...t, status: nextStatus } : t))
      );
      await api.updateTask(task._id, { status: nextStatus });
      setToastMessage(`Task marked as ${nextStatus === 'in-progress' ? 'In Progress ⏳' : nextStatus === 'completed' ? 'Completed 🎉' : 'To Do 📌'}`);
    } catch (err) {
      fetchTasks(); // rollback on failure
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      setTasks((prev) => prev.filter((t) => t._id !== id));
      await api.deleteTask(id);
      setToastMessage('Task deleted.');
    } catch (err) {
      alert('Failed to delete task');
      fetchTasks();
    }
  };

  // Filtered tasks
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === 'all' ? true : task.status === statusFilter;

    const matchesPriority =
      priorityFilter === 'all' ? true : task.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const totalCompleted = tasks.filter((t) => t.status === 'completed').length;
  const totalInProgress = tasks.filter((t) => t.status === 'in-progress').length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4" />
          <p className="text-slate-400 text-sm">Loading Task Deck...</p>
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
        {/* Header & Quick Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center space-x-2">
              <span>✅</span>
              <span>Task & Kanban Manager</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Track creator workflows, priority sprints, and content deliverables.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-600/20 transition cursor-pointer flex items-center space-x-2 self-start sm:self-auto"
          >
            <span>+</span>
            <span>Add New Task</span>
          </button>
        </div>

        {/* Status Counter Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-xs text-slate-400 font-medium">Total Tasks</span>
            <p className="text-2xl font-black text-white mt-0.5">{tasks.length}</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-xs text-blue-400 font-medium">To Do</span>
            <p className="text-2xl font-black text-blue-300 mt-0.5">
              {tasks.filter((t) => t.status === 'todo').length}
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-xs text-amber-400 font-medium">In Progress</span>
            <p className="text-2xl font-black text-amber-300 mt-0.5">{totalInProgress}</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-xs text-emerald-400 font-medium">Completed</span>
            <p className="text-2xl font-black text-emerald-300 mt-0.5">{totalCompleted}</p>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-6 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          {/* Status Tabs */}
          <div className="flex items-center space-x-1 overflow-x-auto pb-2 md:pb-0">
            {[
              { id: 'all', label: 'All' },
              { id: 'todo', label: 'To Do' },
              { id: 'in-progress', label: 'In Progress' },
              { id: 'completed', label: 'Completed' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  statusFilter === tab.id
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-3">
            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent 🔴</option>
              <option value="high">High 🟠</option>
              <option value="medium">Medium 🔵</option>
              <option value="low">Low 🟢</option>
            </select>

            {/* Search Input */}
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 w-full sm:w-48"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-900/40 border border-red-700 text-red-200 px-4 py-3 rounded-xl mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTasks.map((task) => {
            const isCompleted = task.status === 'completed';
            const isInProgress = task.status === 'in-progress';

            const priorityStyles = {
              urgent: 'bg-red-500/10 text-red-400 border border-red-500/30',
              high: 'bg-amber-500/10 text-amber-400 border border-amber-500/30',
              medium: 'bg-blue-500/10 text-blue-400 border border-blue-500/30',
              low: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
            }[task.priority] || 'bg-slate-800 text-slate-400';

            return (
              <div
                key={task._id}
                className={`p-5 rounded-2xl bg-slate-900/80 border transition-all flex flex-col justify-between ${
                  isCompleted
                    ? 'border-slate-800/80 opacity-70 bg-slate-950/60'
                    : isInProgress
                    ? 'border-amber-500/40 hover:border-amber-500/80 shadow-md'
                    : 'border-slate-800 hover:border-blue-500/40 shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-start space-x-2.5">
                      <button
                        onClick={() => handleStatusToggle(task)}
                        title="Click to toggle status (Todo -> In Progress -> Completed)"
                        className="mt-0.5 w-5 h-5 rounded-full border border-slate-600 hover:border-blue-400 flex items-center justify-center transition cursor-pointer flex-shrink-0"
                      >
                        {isCompleted && <span className="text-emerald-400 text-xs">✓</span>}
                        {isInProgress && <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />}
                      </button>

                      <h3
                        className={`text-base font-bold tracking-tight text-white ${
                          isCompleted ? 'line-through text-slate-500' : ''
                        }`}
                      >
                        {task.title}
                      </h3>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-xs font-semibold uppercase ${priorityStyles}`}>
                      {task.priority}
                    </span>
                  </div>

                  {task.description && (
                    <p className="text-slate-400 text-xs mt-1 ml-7 line-clamp-3 whitespace-pre-wrap">
                      {task.description}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center space-x-2">
                    <span
                      onClick={() => handleStatusToggle(task)}
                      className={`px-2 py-0.5 rounded-full text-[11px] font-semibold cursor-pointer ${
                        isCompleted
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60'
                          : isInProgress
                          ? 'bg-amber-950/60 text-amber-400 border border-amber-800/60'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {isCompleted ? 'Completed ✓' : isInProgress ? 'In Progress ⏳' : 'To Do 📌'}
                    </span>

                    {task.dueDate && (
                      <span className="text-slate-400 text-[11px]">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleDelete(task._id)}
                    className="text-slate-500 hover:text-red-400 text-xs transition cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}

          {filteredTasks.length === 0 && (
            <div className="col-span-full text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800/80">
              <span className="text-4xl">🎉</span>
              <h3 className="text-lg font-bold text-white mt-3">No tasks found</h3>
              <p className="text-slate-500 text-sm mt-1">
                {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all'
                  ? 'Try adjusting your filters or search terms.'
                  : 'You have zero pending tasks! Create a new task to get started.'}
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition cursor-pointer"
              >
                + Create Task
              </button>
            </div>
          )}
        </div>

        {/* Add Task Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Create New Task</h2>
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
                    Task Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Record B-roll for YouTube Video"
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Description & Notes
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Include key details, links, or subtasks..."
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Priority
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                      <option value="low">Low 🟢</option>
                      <option value="medium">Medium 🔵</option>
                      <option value="high">High 🟠</option>
                      <option value="urgent">Urgent 🔴</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Target Due Date
                    </label>
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
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
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-lg shadow transition cursor-pointer"
                  >
                    Create Task
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
