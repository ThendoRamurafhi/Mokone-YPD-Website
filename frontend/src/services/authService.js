import api from './api';

const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response;
  },

  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response;
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },

  hasRole: (role) => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return false;
    const user = JSON.parse(userStr);
    return user?.role === role;
  }
};

export default authService;