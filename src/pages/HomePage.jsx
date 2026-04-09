import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const upcomingEvents = [
    {
      eventId: 1,
      title: 'Youth Conference 2026',
      eventDate: '2026-05-15',
      category: 'YOUTH',
      location: 'Main Church Hall',
      description: 'Annual youth gathering for spiritual growth and fellowship.'
    },
    {
      eventId: 2,
      title: 'Community Outreach Day',
      eventDate: '2026-05-22',
      category: 'COMMUNITY',
      location: 'City Centre',
      description: 'Join us as we serve our local community with love and care.'
    },
    {
      eventId: 3,
      title: 'Annual Conference',
      eventDate: '2026-06-10',
      category: 'CONFERENCE',
      location: 'Conference Centre',
      description: 'Our annual gathering of all AME Church YPD members.'
    },
  ];

  const latestPosts = [
    {
      postId: 1,
      title: 'Walking in Faith During Difficult Times',
      excerpt: 'Discover how to maintain your faith when life gets challenging...',
      category: 'SERMON',
      publishedAt: '2026-03-15',
    },
    {
      postId: 2,
      title: 'Youth Leadership Program Launch',
      excerpt: 'We are excited to announce our new youth leadership program...',
      category: 'ANNOUNCEMENT',
      publishedAt: '2026-03-10',
    },
    {
      postId: 3,
      title: 'Community Service Report 2026',
      excerpt: 'Read about all the amazing work our members did this year...',
      category: 'NEWS',
      publishedAt: '2026-03-05',
    },
  ];

  const categoryColors = {
    CONFERENCE: 'bg-blue-100 text-blue-800',
    YOUTH: 'bg-purple-100 text-purple-800',
    COMMUNITY: 'bg-green-100 text-green-800',
    WORSHIP: 'bg-amber-100 text-amber-800',
    EDUCATIONAL: 'bg-red-100 text-red-800',
    ANNOUNCEMENT: 'bg-blue-100 text-blue-800',
    SERMON: 'bg-purple-100 text-purple-800',
    NEWS: 'bg-amber-100 text-amber-800',
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-800 to-emerald-900 text-white py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center font-bold text-white text-2xl mx-auto mb-6">
            YPD
          </div>
          <h1 className="text-5xl font-bold mb-6">
            Welcome to AME Church
            <span className="text-amber-400"> Young People's Division</span>
          </h1>
          <p className="text-xl text-emerald-200 mb-8 max-w-2xl mx-auto">
            Empowering youth and young adults to grow in faith, leadership,
            and community. Join us on this journey of spiritual growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-8 rounded-lg transition text-lg"
            >
              Join Our Community
            </Link>
            <Link
              to="/about"
              className="border-2 border-white hover:bg-white hover:text-emerald-800 text-white font-bold py-3 px-8 rounded-lg transition text-lg"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-amber-500 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold">500+</div>
              <div className="text-amber-100">Members</div>
            </div>
            <div>
              <div className="text-4xl font-bold">50+</div>
              <div className="text-amber-100">Churches</div>
            </div>
            <div>
              <div className="text-4xl font-bold">100+</div>
              <div className="text-amber-100">Events</div>
            </div>
            <div>
              <div className="text-4xl font-bold">10+</div>
              <div className="text-amber-100">Years</div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-emerald-800 mb-4">
              Upcoming Events
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Stay connected with our community through these upcoming events.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {upcomingEvents.map((event) => (
              <div key={event.eventId} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                <div className="w-full h-48 bg-emerald-100 flex items-center justify-center">
                  <span className="text-emerald-400 text-5xl">⛪</span>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryColors[event.category]}`}>
                      {event.category}
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatDate(event.eventDate)}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-emerald-800 mb-2">{event.title}</h3>
                  <p className="text-gray-600 mb-4">{event.description}</p>
                  <p className="text-sm text-gray-500 mb-4">📍 {event.location}</p>
                  <Link
                    to={`/events/${event.eventId}`}
                    className="block w-full text-center bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-2 px-4 rounded transition"
                  >
                    View Details & RSVP
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/events"
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 px-8 rounded-lg transition"
            >
              View All Events
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Blog Posts */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-emerald-800 mb-4">
              Latest from Our Blog
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Sermons, announcements, testimonies and more from our community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestPosts.map((post) => (
              <div key={post.postId} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                <div className="w-full h-48 bg-amber-50 flex items-center justify-center">
                  <span className="text-amber-400 text-5xl">📖</span>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryColors[post.category]}`}>
                      {post.category}
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatDate(post.publishedAt)}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-emerald-800 mb-2">{post.title}</h3>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <Link
                    to={`/blog/${post.postId}`}
                    className="block w-full text-center bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-4 rounded transition"
                  >
                    Read More
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/blog"
              className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-8 rounded-lg transition"
            >
              View All Posts
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-emerald-800 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Stay Connected
          </h2>
          <p className="text-emerald-200 mb-8 max-w-xl mx-auto">
            Subscribe to our newsletter and never miss an update from
            the AME Church YPD community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 rounded-lg focus:outline-none text-gray-800"
            />
            <button className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-lg transition">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;