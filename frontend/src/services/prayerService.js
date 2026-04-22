// import api from './api';

const prayerService = {

  // GET /api/v1/prayers  (public approved prayers)
  getApproved: (params = {}) => api.get('/prayers', { params }),

  // GET /api/v1/prayers/pending  (ADMIN only)
  getPending: () => api.get('/prayers/pending'),

  // POST /api/v1/prayers
  submit: (data) => api.post('/prayers', data),

  // PUT /api/v1/prayers/:id/approve  (ADMIN only)
  approve: (id) => api.put(`/prayers/${id}/approve`),

  // DELETE /api/v1/prayers/:id  (ADMIN only)
  remove: (id) => api.delete(`/prayers/${id}`),
};

export default prayerService;