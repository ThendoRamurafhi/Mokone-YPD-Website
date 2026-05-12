import api from './api';

const leadershipService = {

  // ── Public (About + Structure pages) ──────────────────────
  getForAbout:     () => api.get('/leadership/about'),
  getForStructure: () => api.get('/leadership/structure'),

  // ── Admin CRUD ─────────────────────────────────────────────
  getAll:   ()           => api.get('/leadership'),
  getById:  (id)         => api.get(`/leadership/${id}`),
  create:   (data)       => api.post('/leadership', data),
  update:   (id, data)   => api.put(`/leadership/${id}`, data),
  remove:   (id)         => api.delete(`/leadership/${id}`),
};

export default leadershipService;