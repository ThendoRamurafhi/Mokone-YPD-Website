// import api from './api';

const mediaService = {

  // GET /api/v1/media?type=IMAGE&category=Events&page=0
  getAll: (params = {}) => api.get('/media', { params }),

  // GET /api/v1/media/:id
  getById: (id) => api.get(`/media/${id}`),

  // POST /api/v1/media/upload  (multipart/form-data)
  upload: (formData) =>
    api.post('/media/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  // DELETE /api/v1/media/:id
  remove: (id) => api.delete(`/media/${id}`),
};

export default mediaService;