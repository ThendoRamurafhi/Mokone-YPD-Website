import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

const ContactForm = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);
    try {
      // Will connect to backend later
      console.log('Contact form data:', data);
      setSuccess(true);
      reset();
    } catch (err) {
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <h3 className="text-2xl font-bold text-emerald-800 mb-6">
        Send Us a Message
      </h3>

      {/* Success Message */}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          ✅ Message sent successfully! We will get back to you soon.
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          ❌ {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Name */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Full Name *
          </label>
          <input
            type="text"
            {...register('name', { required: 'Name is required' })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
            placeholder="John Doe"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Email Address *
          </label>
          <input
            type="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
            placeholder="john@example.com"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Subject */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Subject *
          </label>
          <input
            type="text"
            {...register('subject', { required: 'Subject is required' })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
            placeholder="How can we help you?"
          />
          {errors.subject && (
            <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>
          )}
        </div>

        {/* Message */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Message *
          </label>
          <textarea
            {...register('message', { required: 'Message is required' })}
            rows="5"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
            placeholder="Write your message here..."
          />
          {errors.message && (
            <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 px-6 rounded-lg transition disabled:opacity-50"
        >
          {loading ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;