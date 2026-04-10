import React from 'react';
import ContactForm from '../components/contact/ContactForm';

const ContactPage = () => {
  const schedules = [
    { day: 'Monday - Friday', hours: '08:00 - 17:00' },
    { day: 'Saturday', hours: '09:00 - 13:00' },
    { day: 'Sunday', hours: 'Church Services Only' },
  ];

  return (
    <div>
      <section className="bg-gradient-to-br from-emerald-800 to-emerald-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl text-emerald-200 max-w-2xl mx-auto">
            We would love to hear from you.
          </p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <ContactForm />
            </div>
            <div className="space-y-8">
              <div className="bg-white rounded-lg shadow-md p-8">
                <h3 className="text-2xl font-bold text-emerald-800 mb-6">
                  Get In Touch
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span>📍</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Address</h4>
                      <p className="text-gray-600">
                        123 Church Street, Pretoria, South Africa
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span>📞</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Phone</h4>
                      <p className="text-gray-600">+27 12 345 6789</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span>📧</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Email</h4>
                      <p className="text-gray-600">info@amechurchypd.com</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-8">
                <h3 className="text-2xl font-bold text-emerald-800 mb-6">
                  Office Hours
                </h3>
                <div className="space-y-3">
                  {schedules.map((schedule, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-2 border-b border-gray-100"
                    >
                      <span className="font-semibold text-gray-700">
                        {schedule.day}
                      </span>
                      <span className="text-emerald-700 font-semibold">
                        {schedule.hours}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-8">
                <h3 className="text-2xl font-bold text-emerald-800 mb-6">
                  Follow Us
                </h3>
                <div className="flex space-x-4">
                  <a href="#" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg text-center transition">
                    Facebook
                  </a>
                  <a href="#" className="flex-1 bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 px-4 rounded-lg text-center transition">
                    Instagram
                  </a>
                  <a href="#" className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg text-center transition">
                    YouTube
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-emerald-800 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Submit a Prayer Request
          </h2>
          <p className="text-emerald-200 mb-8 max-w-xl mx-auto">
            We believe in the power of prayer.
          </p>
          <div className="max-w-lg mx-auto bg-white rounded-lg p-8">
            <textarea
              rows="4"
              placeholder="Share your prayer request here..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500 mb-4"
            />
            <button className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-lg transition">
              Submit Prayer Request
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;