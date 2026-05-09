import api from './api';

const rsvpService = {
  // Public — guest RSVP (no login needed)
  submitGuest: (eventId, data) =>
    api.post(`/events/${eventId}/rsvp/guest`, data),

  // Authenticated — member RSVP
  submitMember: (eventId, userId, data) =>
    api.post(`/events/${eventId}/rsvp/member/${userId}`, data),

  // Cancel an RSVP
  cancel: (rsvpId) =>
    api.put(`/events/rsvp/${rsvpId}/cancel`),

  // Admin — get all RSVPs for an event
  getForEvent: (eventId) =>
    api.get(`/events/${eventId}/rsvps`),

  // Get RSVPs for the logged-in user
  getForUser: (userId) =>
    api.get(`/events/rsvp/user/${userId}`),
};

export default rsvpService;