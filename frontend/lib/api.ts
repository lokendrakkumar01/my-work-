const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface ApiResponse<T = any> {
      success: boolean;
      message?: string;
      data?: T;
      error?: string;
}

class ApiClient {
      private baseURL: string;
      private token: string | null = null;

      constructor(baseURL: string) {
            this.baseURL = baseURL;
            if (typeof window !== 'undefined') {
                  this.token = localStorage.getItem('token');
            }
      }

      setToken(token: string | null) {
            this.token = token;
            if (typeof window !== 'undefined') {
                  if (token) {
                        localStorage.setItem('token', token);
                  } else {
                        localStorage.removeItem('token');
                  }
            }
      }

      private async request<T = any>(
            endpoint: string,
            options: RequestInit = {}
      ): Promise<ApiResponse<T>> {
            const headers: HeadersInit = {
                  'Content-Type': 'application/json',
                  ...options.headers,
            };

            if (this.token) {
                  headers['Authorization'] = `Bearer ${this.token}`;
            }

            try {
                  const response = await fetch(`${this.baseURL}${endpoint}`, {
                        ...options,
                        headers,
                  });

                  const data = await response.json();

                  if (!response.ok) {
                        throw new Error(data.message || 'An error occurred');
                  }

                  return data;
            } catch (error: any) {
                  return {
                        success: false,
                        error: error.message || 'Network error',
                  };
            }
      }

      // Auth endpoints
      async register(email: string, password: string, fullName?: string) {
            return this.request('/auth/register', {
                  method: 'POST',
                  body: JSON.stringify({ email, password, fullName }),
            });
      }

      async login(email: string, password: string) {
            const response = await this.request('/auth/login', {
                  method: 'POST',
                  body: JSON.stringify({ email, password }),
            });

            if (response.success && response.data?.token) {
                  this.setToken(response.data.token);
            }

            return response;
      }

      async sendOTP(email: string) {
            return this.request('/auth/send-otp', {
                  method: 'POST',
                  body: JSON.stringify({ email }),
            });
      }

      async verifyOTP(email: string, otp: string) {
            const response = await this.request('/auth/verify-otp', {
                  method: 'POST',
                  body: JSON.stringify({ email, otp }),
            });

            if (response.success && response.data?.token) {
                  this.setToken(response.data.token);
            }

            return response;
      }

      async logout() {
            const response = await this.request('/auth/logout', { method: 'POST' });
            this.setToken(null);
            return response;
      }

      async getCurrentUser() {
            return this.request('/auth/me');
      }

      // Social media endpoints
      async getSocialPosts(params?: { status?: string; platform?: string }) {
            const query = new URLSearchParams(params as any).toString();
            return this.request(`/social${query ? `?${query}` : ''}`);
      }

      async createSocialPost(data: any) {
            return this.request('/social', {
                  method: 'POST',
                  body: JSON.stringify(data),
            });
      }

      async updateSocialPost(id: string, data: any) {
            return this.request(`/social/${id}`, {
                  method: 'PUT',
                  body: JSON.stringify(data),
            });
      }

      async deleteSocialPost(id: string) {
            return this.request(`/social/${id}`, { method: 'DELETE' });
      }

      // YouTube endpoints
      async getYouTubeVideos(params?: { stage?: string; status?: string }) {
            const query = new URLSearchParams(params as any).toString();
            return this.request(`/youtube${query ? `?${query}` : ''}`);
      }

      async createYouTubeVideo(data: any) {
            return this.request('/youtube', {
                  method: 'POST',
                  body: JSON.stringify(data),
            });
      }

      async updateYouTubeVideo(id: string, data: any) {
            return this.request(`/youtube/${id}`, {
                  method: 'PUT',
                  body: JSON.stringify(data),
            });
      }

      // Task endpoints
      async getTasks(params?: { status?: string; priority?: string }) {
            const query = new URLSearchParams(params as any).toString();
            return this.request(`/tasks${query ? `?${query}` : ''}`);
      }

      async createTask(data: any) {
            return this.request('/tasks', {
                  method: 'POST',
                  body: JSON.stringify(data),
            });
      }

      async updateTask(id: string, data: any) {
            return this.request(`/tasks/${id}`, {
                  method: 'PUT',
                  body: JSON.stringify(data),
            });
      }

      async deleteTask(id: string) {
            return this.request(`/tasks/${id}`, { method: 'DELETE' });
      }

      // Habit endpoints
      async getHabits() {
            return this.request('/habits');
      }

      async createHabit(data: any) {
            return this.request('/habits', {
                  method: 'POST',
                  body: JSON.stringify(data),
            });
      }

      async completeHabit(id: string, note?: string) {
            return this.request(`/habits/${id}/complete`, {
                  method: 'POST',
                  body: JSON.stringify({ note }),
            });
      }

      // Project endpoints
      async getProjects(params?: { status?: string }) {
            const query = new URLSearchParams(params as any).toString();
            return this.request(`/projects${query ? `?${query}` : ''}`);
      }

      async createProject(data: any) {
            return this.request('/projects', {
                  method: 'POST',
                  body: JSON.stringify(data),
            });
      }

      async updateProject(id: string, data: any) {
            return this.request(`/projects/${id}`, {
                  method: 'PUT',
                  body: JSON.stringify(data),
            });
      }

      // AI endpoints
      async generateCaption(data: {
            context: string;
            platform: string;
            language?: string;
            tone?: string;
      }) {
            return this.request('/ai/generate-caption', {
                  method: 'POST',
                  body: JSON.stringify(data),
            });
      }

      async generateScript(data: {
            topic: string;
            duration?: number;
            style?: string;
      }) {
            return this.request('/ai/generate-script', {
                  method: 'POST',
                  body: JSON.stringify(data),
            });
      }

      async generateContentIdeas(data: {
            niche: string;
            platform: string;
            count?: number;
      }) {
            return this.request('/ai/content-ideas', {
                  method: 'POST',
                  body: JSON.stringify(data),
            });
      }

      // Analytics
      async getDashboardAnalytics() {
            return this.request('/analytics/dashboard');
      }

      // Notifications
      async getNotifications(params?: { status?: string; limit?: number }) {
            const query = new URLSearchParams(params as any).toString();
            return this.request(`/notifications${query ? `?${query}` : ''}`);
      }

      async markNotificationAsRead(id: string) {
            return this.request(`/notifications/${id}/read`, { method: 'PUT' });
      }
}

export const api = new ApiClient(API_URL);
export default api;
