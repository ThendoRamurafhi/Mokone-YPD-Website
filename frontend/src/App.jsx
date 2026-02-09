import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layout Components
import Navigation from './components/common/Navigation';
import Footer from './components/common/Footer';

// Page Components
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import EventsPage from './pages/EventsPage';
import EventDetailsPage from './pages/EventDetailsPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import ChargesPage from './pages/ChargesPage';
import MediaPage from './pages/MediaPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import PrayerRequestsPage from './pages/PrayerRequestsPage';
import NotFoundPage from './pages/NotFoundPage';

// Protected Route Component
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminEventsPage from './pages/admin/AdminEventsPage';
import AdminBlogPage from './pages/admin/AdminBlogPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminPrayersPage from './pages/admin/AdminPrayersPage';

// Styles
import './styles/globals.css';

/**
 * Main Application Component for AME Church YPD Website
 * 
 * Architecture: Three-Layered (React Frontend + Spring Boot Backend + MySQL)
 * Features:
 * - User authentication (JWT-based)
 * - Role-based access control (Admin, Member, Guest)
 * - Event management with RSVP
 * - Blog system
 * - Church finder with map
 * - Prayer requests
 * - Media gallery
 * - Responsive design
 * 
 * @component
 */
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-50">
          {/* Navigation Header */}
          <Navigation />

          {/* Main Content Area */}
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/events/:eventId" element={<EventDetailsPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:postId" element={<BlogPostPage />} />
              <Route path="/charges" element={<ChargesPage />} />
              <Route path="/church-finder" element={<ChargesPage />} />
              <Route path="/media" element={<MediaPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/prayer-requests" element={<PrayerRequestsPage />} />

              {/* Authentication Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Protected Member Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes - Only accessible by ADMIN role */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/events"
                element={
                  <AdminRoute>
                    <AdminEventsPage />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/blog"
                element={
                  <AdminRoute>
                    <AdminBlogPage />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <AdminRoute>
                    <AdminUsersPage />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/prayers"
                element={
                  <AdminRoute>
                    <AdminPrayersPage />
                  </AdminRoute>
                }
              />

              {/* 404 Not Found */}
              <Route path="/404" element={<NotFoundPage />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </main>

          {/* Footer */}
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;