// import api from './api';

const chargeService = {

  // GET /api/v1/charges?area=Sibasa&page=0&size=20
  getAll: (params = {}) => api.get('/charges', { params }),

  // GET /api/v1/charges/:id
  getById: (id) => api.get(`/charges/${id}`),

  // GET /api/v1/charges/map  (lat/lng only, for map markers)
  getMapMarkers: () => api.get('/charges/map'),

  // POST /api/v1/charges  (ADMIN only)
  create: (data) => api.post('/charges', data),

  // PUT /api/v1/charges/:id
  update: (id, data) => api.put(`/charges/${id}`, data),

  // DELETE /api/v1/charges/:id
  remove: (id) => api.delete(`/charges/${id}`),
};

export default chargeService;