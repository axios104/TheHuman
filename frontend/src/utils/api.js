import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 Request with token:', config.method.toUpperCase(), config.url);
    } else {
      console.warn('⚠️ No token found for request:', config.url);
    }
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => {
    console.log('✅ Response:', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('❌ Response error:', error.response?.status, error.response?.data);
    
    if (error.response?.status === 401) {
      console.log('🔒 Unauthorized - clearing token and redirecting to login');
      localStorage.removeItem('token');
      const currentPath = window.location.pathname;
      if (!['/login', '/signup', '/'].includes(currentPath)) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  signup: (data) => api.post('/api/auth/signup', data),
  login: (data) => api.post('/api/auth/login', `username=${data.email}&password=${data.password}`, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  }),
  getCurrentUser: () => api.get('/api/users/me'),
};

export const sectorAPI = {
  getAll: () => {
    console.log('🔍 Fetching all sectors...');
    return api.get('/api/sectors');
  },
  getById: (id) => api.get(`/api/sectors/${id}`),
  create: (data) => {
    console.log('➕ Creating sector:', data);
    return api.post('/api/sectors', data);
  },
  update: (id, data) => api.put(`/api/sectors/${id}`, data),
  delete: (id) => api.delete(`/api/sectors/${id}`),
  getMessages: (id) => api.get(`/api/sectors/${id}/messages`),
  sendMessage: (id, content) => api.post(`/api/sectors/${id}/messages`, { content, is_user: true }),
};

export const goalAPI = {
  getAll: () => {
    console.log('🔍 Fetching all goals...');
    return api.get('/api/goals');
  },
  getBySector: (sectorId) => api.get(`/api/sectors/${sectorId}/goals`),
  create: (sectorId, data) => {
    console.log('➕ Creating goal for sector:', sectorId, data);
    return api.post(`/api/sectors/${sectorId}/goals`, data);
  },
  update: (goalId, data) => api.put(`/api/goals/${goalId}`, data),
  complete: (goalId) => api.put(`/api/goals/${goalId}/complete`),
  delete: (goalId) => api.delete(`/api/goals/${goalId}`),
};

export const conversationAPI = {
  getAll: () => api.get('/api/conversations'),
  getById: (id) => api.get(`/api/conversations/${id}`),
  create: (data) => api.post('/api/conversations', data),
  update: (id, data) => api.put(`/api/conversations/${id}`, data),
  delete: (id) => api.delete(`/api/conversations/${id}`),
  getMessages: (id) => api.get(`/api/conversations/${id}/messages`),
  addMessage: (id, message) => api.post(`/api/conversations/${id}/messages`, message),
};

export const badgeAPI = {
  checkProgress: () => api.get('/api/badges/check-progress'),
};

export const savedNewsAPI = {
  getAll: () => api.get('/api/saved-news'),
  save: (data) => api.post('/api/saved-news', data),
  delete: (id) => api.delete(`/api/saved-news/${id}`),
};


export default api;
