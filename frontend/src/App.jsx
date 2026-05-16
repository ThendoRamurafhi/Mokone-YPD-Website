import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider }   from './context/AuthContext';
import ScrollToTop        from './components/common/ScrollToTop';
import Navigation         from './components/common/Navigation';
import Footer             from './components/common/Footer';
import ProtectedRoute     from './components/auth/ProtectedRoute';
import AdminRoute         from './components/admin/AdminRoute';

// Public pages
import HomePage           from './pages/HomePage';
import AboutPage          from './pages/AboutPage';
import EventsPage         from './pages/EventsPage';
import EventDetailPage    from './pages/EventDetailPage';
import BlogPage           from './pages/BlogPage';
import BlogPostDetail     from './pages/BlogPostDetail';
import ChargesPage        from './pages/ChargesPage';
import MediaPage          from './pages/MediaPage';
import ContactPage        from './pages/ContactPage';
import LoginPage          from './pages/LoginPage';
import RegisterPage       from './pages/RegisterPage';
import StructurePage      from './pages/StructurePage';

// Admin pages — lazy-loaded so they don't bloat the public bundle
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard'));
const AdminEvents    = React.lazy(() => import('./pages/admin/AdminEvents'));
const AdminBlog      = React.lazy(() => import('./pages/admin/AdminBlog'));
const AdminMedia     = React.lazy(() => import('./pages/admin/AdminMedia'));
const AdminCharges   = React.lazy(() => import('./pages/admin/AdminCharges'));
const AdminUsers     = React.lazy(() => import('./pages/admin/AdminUsers'));
const AdminPrayers   = React.lazy(() => import('./pages/admin/AdminPrayers'));
const AdminLeadership = React.lazy(() => import('./pages/admin/AdminLeadership'));

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <React.Suspense fallback={<div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', fontFamily:'Georgia,serif', color:'#1a4731', fontSize:18 }}>Loading…</div>}>
          <Routes>
            {/* ── ADMIN ROUTES (no public nav/footer) ─────────────────── */}
            <Route path="/admin"          element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/events"   element={<AdminRoute><AdminEvents /></AdminRoute>} />
            <Route path="/admin/events/new" element={<AdminRoute><AdminEvents /></AdminRoute>} />
            <Route path="/admin/blog"     element={<AdminRoute><AdminBlog /></AdminRoute>} />
            <Route path="/admin/blog/new" element={<AdminRoute><AdminBlog /></AdminRoute>} />
            <Route path="/admin/media"    element={<AdminRoute><AdminMedia /></AdminRoute>} />
            <Route path="/admin/media/upload" element={<AdminRoute><AdminMedia /></AdminRoute>} />
            <Route path="/admin/charges"  element={<AdminRoute><AdminCharges /></AdminRoute>} />
            <Route path="/admin/charges/new" element={<AdminRoute><AdminCharges /></AdminRoute>} />
            <Route path="/admin/users"    element={<AdminRoute><AdminUsers /></AdminRoute>} />
            <Route path="/admin/prayers"  element={<AdminRoute><AdminPrayers /></AdminRoute>} />
            <Route path="/admin/leadership"   element={<AdminRoute><AdminLeadership /></AdminRoute>} />

            {/* ── PUBLIC ROUTES (with nav + footer) ───────────────────── */}
            <Route path="*" element={
              <div className="flex flex-col min-h-screen">
                <Navigation />
                <main style={{ flex:1 }}>
                  <Routes>
                    <Route path="/"           element={<HomePage />} />
                    <Route path="/about"      element={<AboutPage />} />
                    <Route path="/events"     element={<EventsPage />} />
                    <Route path="/events/:id" element={<EventDetailPage />} />
                    <Route path="/blog"       element={<BlogPage />} />
                    <Route path="/blog/:id"   element={<BlogPostDetail />} />
                    <Route path="/charges"    element={<ChargesPage />} />
                    <Route path="/media"      element={<MediaPage />} />
                    <Route path="/contact"    element={<ContactPage />} />
                    <Route path="/structure"  element={<StructurePage />} />
                    <Route path="/login"      element={<LoginPage />} />
                    <Route path="/register"   element={<RegisterPage />} />
                    {/* Example of a member-only route */}
                    {/* <Route path="/dashboard" element={<ProtectedRoute><MemberDashboard /></ProtectedRoute>} /> */}
                    {/* 404 */}
                    <Route path="*" element={
                      <div style={{ textAlign:'center', padding:'120px 24px', fontFamily:'Georgia,serif' }}>
                        <h1 style={{ fontSize:72, color:'#c9a84c', marginBottom:16 }}>404</h1>
                        <p style={{ fontSize:18, color:'#6b8070', marginBottom:28 }}>Page not found.</p>
                        <a href="/" style={{ background:'#1a4731', color:'#fff', padding:'13px 32px', borderRadius:8, textDecoration:'none', fontSize:14, fontWeight:700 }}>Go Home</a>
                      </div>
                    } />
                  </Routes>
                </main>
                <Footer />
              </div>
            } />
          </Routes>
        </React.Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;