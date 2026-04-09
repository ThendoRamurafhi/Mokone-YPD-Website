import api from './api';

const eventService = {
  getAllEvents: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await api.get(`/events?${queryString}`);
  },

  getEventById: async (eventId) => {
    return await api.get(`/events/${eventId}`);
  },

  createEvent: async (eventData) => {
    return await api.post('/events', eventData);
  },

  updateEvent: async (eventId, eventData) => {
    return await api.put(`/events/${eventId}`, eventData);
  },

  deleteEvent: async (eventId) => {
    return await api.delete(`/events/${eventId}`);
  },

  submitRSVP: async (eventId, rsvpData) => {
    return await api.post(`/events/${eventId}/rsvp`, rsvpData);
  },

  getEventRSVPs: async (eventId) => {
    return await api.get(`/events/${eventId}/rsvps`);
  }
};

export default eventService;