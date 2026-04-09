import React from 'react';

const AboutPage = () => {
  const leaders = [
    {
      id: 1,
      name: 'Rev. John Doe',
      role: 'Presiding Elder',
      description: 'Leading our community with wisdom and grace for over 20 years.',
    },
    {
      id: 2,
      name: 'Pastor Jane Smith',
      role: 'YPD Director',
      description: 'Passionate about empowering youth to reach their full potential.',
    },
    {
      id: 3,
      name: 'Deacon Michael Brown',
      role: 'Youth Pastor',
      description: 'Dedicated to nurturing the spiritual growth of our young members.',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-800 to-emerald-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">About AME Church YPD</h1>
          <p className="text-xl text-emerald-200 max-w-2xl mx-auto">
            Learn about our mission, vision, history and the people
            who make our community special.
          </p>
        </div>
      </section>

      {/* Mission and Vision */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Mission */}
            <div className="bg-white rounded-lg shadow-md p-8 border-t-4 border-emerald-700">
              <div className="text-5xl mb-4">🎯</div>
              <h2 className="text-3xl font-bold text-emerald-800 mb-4">
                Our Mission
              </h2>
              <p className="text-gray-600 leading-relaxed">
                To empower youth and young adults within the African Methodist
                Episcopal Church to grow in their faith, develop leadership
                skills, and serve their communities with love and dedication.
                We strive to create an inclusive and nurturing environment
                where every young person can discover their God-given purpose.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-white rounded-lg shadow-md p-8 border-t-4 border-amber-500">
              <div className="text-5xl mb-4">👁️</div>
              <h2 className="text-3xl font-bold text-emerald-800 mb-4">
                Our Vision
              </h2>
              <p className="text-gray-600 leading-relaxed">
                To be a beacon of hope and transformation for young people
                across South Africa, building a generation of faithful,
                compassionate, and courageous leaders who will positively
                impact their communities and the world for Christ.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-emerald-800 mb-4">
              Our Core Values
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              These values guide everything we do as a community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '✝️', title: 'Faith', description: 'Rooted in the teachings of Jesus Christ and the Methodist tradition.' },
              { icon: '🤝', title: 'Community', description: 'Building strong bonds of fellowship and mutual support.' },
              { icon: '🌟', title: 'Excellence', description: 'Striving for the highest standards in all we do.' },
              { icon: '❤️', title: 'Service', description: 'Serving others with humility and compassion.' },
              { icon: '📚', title: 'Education', description: 'Committed to lifelong learning and spiritual growth.' },
              { icon: '🕊️', title: 'Peace', description: 'Promoting harmony and reconciliation in our communities.' },
            ].map((value, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-xl transition">
                <div className="text-5xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-emerald-800 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* History */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-emerald-800 mb-4">
                Our History
              </h2>
            </div>
            <div className="bg-white rounded-lg shadow-md p-8">
              <p className="text-gray-600 leading-relaxed mb-4">
                The African Methodist Episcopal Church Young People's Division
                has a rich history of nurturing young believers and equipping
                them for service. Founded on the principles of the AME Church,
                our YPD has grown from a small group of dedicated youth to a
                thriving community spanning multiple districts across South Africa.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Over the years, we have organized countless events, conferences,
                and outreach programs that have touched thousands of lives. Our
                members have gone on to become pastors, community leaders,
                educators, and agents of positive change in society.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Today, we continue to build on this legacy, embracing new
                technologies and approaches while staying true to our core
                values and mission. We are excited about the future and
                the impact our community will continue to make.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-emerald-800 mb-4">
              Our Leadership Team
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Meet the dedicated individuals who lead our community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {leaders.map((leader) => (
              <div key={leader.id} className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-xl transition">
                <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">👤</span>
                </div>
                <h3 className="text-xl font-bold text-emerald-800 mb-1">
                  {leader.name}
                </h3>
                <p className="text-amber-600 font-semibold mb-3">
                  {leader.role}
                </p>
                <p className="text-gray-600">
                  {leader.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Organizational Structure */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-emerald-800 mb-4">
              Organizational Structure
            </h2>
          </div>

          <div className="max-w-2xl mx-auto">
            {[
              { level: '1', title: 'Presiding Elders', color: 'bg-emerald-700' },
              { level: '2', title: 'Ordained Ministers', color: 'bg-emerald-600' },
              { level: '3', title: 'YPD Directors and Officers', color: 'bg-emerald-500' },
              { level: '4', title: 'Local Church YPD Leaders', color: 'bg-emerald-400' },
            ].map((item, index) => (
              <div key={index} className="flex items-center mb-4">
                <div className={`${item.color} text-white w-10 h-10 rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0`}>
                  {item.level}
                </div>
                <div className={`${item.color} text-white px-6 py-3 rounded-lg flex-1 font-semibold`}>
                  {item.title}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;