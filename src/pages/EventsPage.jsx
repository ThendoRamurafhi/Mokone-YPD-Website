import React, { useState } from 'react';
import EventCard from '../components/events/EventCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const EventsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [loading] = useState(false);

  const events = [
    {
      eventId: 1,
      title: 'Youth Conference 2026',
      eventDate: '2026-05-15',
      eventTime: '09:00',
      category: 'YOUTH',
      location: 'Main Church Hall',
      description: 'Annual youth gathering for spiritual growth and fellowship. Join us for a day of worship, learning and community.',
      currentAttendees: 45,
      maxAttendees: 100,
    },
    {
      eventId: 2,
      title: 'Community Outreach Day',
      eventDate: '2026-05-22',
      eventTime: '08:00',
      category: 'COMMUNITY',
      location: 'City Centre',
      description: 'Join us as we serve our local community with love and care. Bring your family and friends!',
      currentAttendees: 30,
      maxAttendees: 50,
    },
    {
      eventId: 3,
      title: 'Annual Conference',
      eventDate: '2026-06-10',
      eventTime: '10:00',
      category: 'CONFERENCE',
      location: 'Conference Centre',
      description: 'Our annual gathering of all AME Church YPD members from across the region.',
      currentAttendees: 120,
      maxAttendees: 200,
    },
    {
      eventId: 4,
      title: 'Sunday Worship Service',
      eventDate: '2026-05-19',
      eventTime: '10:00',
      category: 'WORSHIP',
      location: 'Main Sanctuary',
      description: 'Join us for our weekly worship service filled with praise and the Word of God.',
      currentAttendees: 80,
      maxAttendees: 150,
    },
    {
      eventId: 5,
      title: 'Bible Study Workshop',
      eventDate: '2026-05-28',
      eventTime: '18:00',
      category: 'EDUCATIONAL',
      location: 'Fellowship Hall',
      description: 'Deep dive into the scriptures with our experienced Bible study leaders.',
      currentAttendees: 25,
      maxAttendees: 40,
    },
    {
      eventId: 6,
      title: 'Youth Leadership Training',
      eventDate: '2026-06-05',
      eventTime: '09:00',
      category: 'YOUTH',
      location: 'Training Centre',
      description: 'Equipping the next generation of leaders with the skills they need to serve.',
      currentAttendees: 20,
      maxAttendees: 30,
    },
  ];

  const categories = ['ALL', 'YOUTH', 'COMMUNITY', 'CONFERENCE', 'WORSHIP', 'EDUCATIONAL'];

  const filteredEvents = selectedCategory === 'ALL'
    ? events
    : events.filter(event => event.category === selectedCategory);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-800 to-emerald-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Upcoming Events</h1>
          <p className="text-xl text-emerald-200 max-w-2xl mx-auto">
            Stay connected with our community through these
            upcoming events and activities.
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="bg-white shadow-md py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-semibold transition ${
                  selectedCategory === category
                    ? 'bg-emerald-700 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-emerald-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          {loading ? (
            <LoadingSpinner />
          ) : filteredEvents.length > 0 ? (
            <>
              <p className="text-gray-600 mb-8 text-center">
                Showing {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredEvents.map((event) => (
                  <EventCard key={event.eventId} event={event} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-2xl font-bold text-gray-600 mb-2">
                No events found
              </h3>
              <p className="text-gray-500">
                There are no events in this category right now.
                Check back soon!
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default EventsPage;