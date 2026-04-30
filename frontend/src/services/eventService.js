import api from './api';

const eventService = {

  // GET /api/v1/events?page=0&size=10&category=YOUTH
  getAll: (params = {}) => api.get('/events', { params }),

  // GET /api/v1/events/:id
  getById: (id) => api.get(`/events/${id}`),

  // POST /api/v1/events  (ADMIN only)
  create: (data) => api.post('/events', data),

  // PUT /api/v1/events/:id  (ADMIN only)
  update: (id, data) => api.put(`/events/${id}`, data),

  // DELETE /api/v1/events/:id  (ADMIN only)
  remove: (id) => api.delete(`/events/${id}`),

  // POST /api/v1/events/:id/rsvp
  rsvp: (eventId, rsvpData) => api.post(`/events/${eventId}/rsvp`, rsvpData),

  // GET /api/v1/events/:id/rsvps  (ADMIN only)
  getRsvps: (eventId) => api.get(`/events/${eventId}/rsvps`),
};

export default eventService;