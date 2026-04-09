import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Navigation = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className="bg-emerald-800 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center font-bold text-white text-sm">
              YPD
            </div>
            <span className="text-xl font-bold">AME Church YPD</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link to="/" className="hover:text-amber-400 transition">Home</Link>
            <Link to="/about" className="hover:text-amber-400 transition">About</Link>
            <Link to="/events" className="hover:text-amber-400 transition">Events</Link>
            <Link to="/blog" className="hover:text-amber-400 transition">Blog</Link>
            <Link to="/charges" className="hover:text-amber-400 transition">Church Finder</Link>
            <Link to="/media" className="hover:text-amber-400 transition">Media</Link>
            <Link to="/contact" className="hover:text-amber-400 transition">Contact</Link>

            {isAuthenticated() ? (
              <div className="flex items-center space-x-4">
                <span className="text-amber-400 font-semibold">
                  Welcome, {user?.firstName || user?.username}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-amber-500 hover:bg-amber-600 px-4 py-2 rounded transition font-semibold"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="border border-white px-4 py-2 rounded hover:bg-white hover:text-emerald-800 transition font-semibold"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-amber-500 hover:bg-amber-600 px-4 py-2 rounded transition font-semibold"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link to="/" className="block py-2 hover:text-amber-400" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link to="/about" className="block py-2 hover:text-amber-400" onClick={() => setMobileMenuOpen(false)}>About</Link>
            <Link to="/events" className="block py-2 hover:text-amber-400" onClick={() => setMobileMenuOpen(false)}>Events</Link>
            <Link to="/blog" className="block py-2 hover:text-amber-400" onClick={() => setMobileMenuOpen(false)}>Blog</Link>
            <Link to="/charges" className="block py-2 hover:text-amber-400" onClick={() => setMobileMenuOpen(false)}>Church Finder</Link>
            <Link to="/media" className="block py-2 hover:text-amber-400" onClick={() => setMobileMenuOpen(false)}>Media</Link>
            <Link to="/contact" className="block py-2 hover:text-amber-400" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
            {isAuthenticated() ? (
              <button onClick={handleLogout} className="block w-full text-left py-2 hover:text-amber-400">
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="block py-2 hover:text-amber-400" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                <Link to="/register" className="block py-2 hover:text-amber-400" onClick={() => setMobileMenuOpen(false)}>Register</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;