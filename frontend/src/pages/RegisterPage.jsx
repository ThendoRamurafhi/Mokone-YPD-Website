import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import authService from '../services/authService';

const RegisterPage = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const password = watch('password');

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.register({
        username: data.username,
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
      });
      login(response.user, response.token);
      navigate('/');
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-emerald-700 rounded-full flex items-center justify-center font-bold text-white text-2xl mx-auto mb-4">
            YPD
          </div>
          <h1 className="text-3xl font-bold text-emerald-800">
            Join Our Community
          </h1>
          <p className="text-gray-600 mt-2">
            Create your AME Church YPD account
          </p>
        </div>

        {/* Register Form */}
        <div className="bg-white rounded-lg shadow-md p-8">

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              ❌ {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* First and Last Name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  {...register('firstName', {
                    required: 'First name is required'
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
                  placeholder="John"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  {...register('lastName', {
                    required: 'Last name is required'
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
                  placeholder="Doe"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Username *
              </label>
              <input
                type="text"
                {...register('username', {
                  required: 'Username is required',
                  minLength: {
                    value: 3,
                    message: 'Username must be at least 3 characters'
                  }
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
                placeholder="johndoe"
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.username.message}
                </p>
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
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                {...register('phone')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
                placeholder="+27 12 345 6789"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Password *
              </label>
              <input
                type="password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters'
                  }
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Confirm Password *
              </label>
              <input
                type="password"
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: value =>
                    value === password || 'Passwords do not match'
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 px-6 rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Login Link */}
          <div className="text-center mt-6">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-emerald-700 hover:text-emerald-800 font-semibold"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Guest Option */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            Continue as Guest →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;