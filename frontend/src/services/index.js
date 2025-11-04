import api from './api';

export const authService = {
  login: async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    if (response.data.success) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.success) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

export const dashboardService = {
  getDashboard: async () => {
    const response = await api.get('/dashboard');
    return response.data;
  },

  getModules: async () => {
    const response = await api.get('/dashboard/modules');
    return response.data;
  }
};

export const campusService = {
  getAll: async () => {
    const response = await api.get('/campus');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/campus/${id}`);
    return response.data;
  },

  create: async (campusData) => {
    const response = await api.post('/campus', campusData);
    return response.data;
  },

  update: async (id, campusData) => {
    const response = await api.put(`/campus/${id}`, campusData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/campus/${id}`);
    return response.data;
  }
};
