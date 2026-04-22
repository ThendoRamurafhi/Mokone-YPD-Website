// import api from './api';

const userService = {

  // GET /api/v1/users  (ADMIN only)
  getAll: (params = {}) => api.get('/users', { params }),

  // GET /api/v1/users/:id
  getById: (id) => api.get(`/users/${id}`),

  // PUT /api/v1/users/:id
  update: (id, data) => api.put(`/users/${id}`, data),

  // PUT /api/v1/users/:id/role  (ADMIN only)
  updateRole: (id, role) => api.put(`/users/${id}/role`, { role }),

  // DELETE /api/v1/users/:id  (ADMIN only)
  remove: (id) => api.delete(`/users/${id}`),
};

export default userService;