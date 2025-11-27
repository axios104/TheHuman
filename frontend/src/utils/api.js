import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  signup: (data) => api.post('/api/auth/signup', data),
  login: (data) => api.post('/api/auth/login', `username=${data.email}&password=${data.password}`, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  }),
  getCurrentUser: () => api.get('/api/users/me'),
};

export const sectorAPI = {
  getAll: () => api.get('/api/sectors'),
  getById: (id) => api.get(`/api/sectors/${id}`),
  create: (data) => api.post('/api/sectors', data),
  update: (id, data) => api.put(`/api/sectors/${id}`, data),
  delete: (id) => api.delete(`/api/sectors/${id}`),
  getMessages: (id) => api.get(`/api/sectors/${id}/messages`),
  sendMessage: (id, content) => api.post(`/api/sectors/${id}/messages`, { content }),
};

export const goalAPI = {
  create: (sectorId, data) => api.post(`/api/sectors/${sectorId}/goals`, data),
  getAll: (sectorId) => api.get(`/api/sectors/${sectorId}/goals`),
  update: (goalId, data) => api.put(`/api/goals/${goalId}`, data),
  delete: (goalId) => api.delete(`/api/goals/${goalId}`),
};

export const statisticAPI = {
  create: (sectorId, data) => api.post(`/api/sectors/${sectorId}/statistics`, data),
  getAll: (sectorId) => api.get(`/api/sectors/${sectorId}/statistics`),
};

export const badgeAPI = {
  getAll: () => api.get('/api/badges'),
  getUserBadges: () => api.get('/api/users/me/badges'),
};

export default api;
