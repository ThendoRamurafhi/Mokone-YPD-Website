import React from 'react';
import { Link } from 'react-router-dom';

const categoryColors = {
  CONFERENCE: 'bg-blue-100 text-blue-800',
  YOUTH: 'bg-purple-100 text-purple-800',
  COMMUNITY: 'bg-green-100 text-green-800',
  WORSHIP: 'bg-amber-100 text-amber-800',
  EDUCATIONAL: 'bg-red-100 text-red-800'
};

const EventCard = ({ event }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      {/* Event Image */}
      {event.featuredImage ? (
        <img
          src={event.featuredImage}
          alt={event.title}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-emerald-100 flex items-center justify-center">
          <span className="text-emerald-400 text-5xl">⛪</span>
        </div>
      )}

      <div className="p-6">
        {/* Category and Date */}
        <div className="flex items-center justify-between mb-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryColors[event.category] || 'bg-gray-100 text-gray-800'}`}>
            {event.category}
          </span>
          <span className="text-sm text-gray-500">
            {formatDate(event.eventDate)}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-emerald-800 mb-2">
          {event.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 mb-4 line-clamp-3">
          {event.description}
        </p>

        {/* Event Details */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span>🕐 {event.eventTime || 'TBA'}</span>
          <span>📍 {event.location || 'TBA'}</span>
        </div>

        {/* Attendees */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span>
            👥 {event.currentAttendees || 0} / {event.maxAttendees || '∞'} attending
          </span>
        </div>

        {/* Button */}
        <Link
          to={`/events/${event.eventId}`}
          className="block w-full text-center bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-2 px-4 rounded transition"
        >
          View Details & RSVP
        </Link>
      </div>
    </div>
  );
};

export default EventCard;