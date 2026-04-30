import api from './api';

const blogService = {

  // GET /api/v1/blog/posts?page=0&size=10&category=SERMON
  getAll: (params = {}) => api.get('/blog/posts', { params }),

  // GET /api/v1/blog/posts/:id
  getById: (id) => api.get(`/blog/posts/${id}`),

  // POST /api/v1/blog/posts  (ADMIN only)
  create: (data) => api.post('/blog/posts', data),

  // PUT /api/v1/blog/posts/:id
  update: (id, data) => api.put(`/blog/posts/${id}`, data),

  // DELETE /api/v1/blog/posts/:id
  remove: (id) => api.delete(`/blog/posts/${id}`),
};

export default blogService;