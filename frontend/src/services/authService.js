import api from './api';

const authService = {

  // POST /api/v1/auth/register
  register: async ({ username, email, password, firstName, lastName, phone }) => {
    const response = await api.post('/auth/register', { username, email, password, firstName, lastName, phone });
    if (response.token) {
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(response.user || { userId: response.userId, email, username }));
    }
    return response;
  },

  // POST /api/v1/auth/login
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.token) {
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    return response;
  },

  // Clear session
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  // Read current user from localStorage (no network call)
  getCurrentUser: () => {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },

  isAuthenticated: () => !!localStorage.getItem('authToken'),

  hasRole: (role) => {
    const user = authService.getCurrentUser();
    return user?.role === role;
  },

  isAdmin: () => authService.hasRole('ADMIN'),
};

export default authService;
