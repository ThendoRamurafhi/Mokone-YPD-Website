import api from './api';

const chargeService = {

  // GET /api/v1/charges?area=Sibasa&page=0&size=20
  getAll: (params = {}) => api.get('/charges', { params }),

  // GET /api/v1/charges/:id
  getById: (id) => api.get(`/charges/${id}`),

  // GET /api/v1/charges/map  (lat/lng only, for map markers)
  getMapMarkers: () => api.get('/charges/map'),

   // GET /api/v1/charges/district/:district
  getByDistrict: (district) =>
    api.get(`/charges/district/${district}`),

  // GET /api/v1/charges/districts — list of all districts for the filter pills
  getDistricts: () =>
    api.get('/charges/districts'),

  // POST /api/v1/charges  (ADMIN only)
  create: (data) => api.post('/charges', data),

  // PUT /api/v1/charges/:id
  update: (id, data) => api.put(`/charges/${id}`, data),

  // DELETE /api/v1/charges/:id
  remove: (id) => api.delete(`/charges/${id}`),
};

export default chargeService;