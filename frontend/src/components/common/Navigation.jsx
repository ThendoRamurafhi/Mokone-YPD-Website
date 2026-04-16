import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

/* ── Inline SVG icons matching your screenshot exactly ── */
const NavIcons = {
  Home: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  About: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
    </svg>
  ),
  ChurchFinder: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
    </svg>
  ),
  Events: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  Blog: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/>
    </svg>
  ),
  Media: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
    </svg>
  ),
  Structure: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="3" width="6" height="4" rx="1"/><rect x="2" y="17" width="6" height="4" rx="1"/><rect x="16" y="17" width="6" height="4" rx="1"/>
      <line x1="12" y1="7" x2="12" y2="13"/><line x1="5" y1="17" x2="5" y2="13"/><line x1="19" y1="17" x2="19" y2="13"/><line x1="5" y1="13" x2="19" y2="13"/>
    </svg>
  ),
  Contact: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
    </svg>
  ),
  Login: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>
    </svg>
  ),
  Logout: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  Menu: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  ),
  Close: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
};

/* ── YPD Logo ── */
const YPDLogo = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    <circle cx="20" cy="20" r="19" fill="#0d2b1a" stroke="#c9a84c" strokeWidth="1.8"/>
    <circle cx="20" cy="20" r="15" fill="none" stroke="#c9a84c" strokeWidth="0.6" strokeDasharray="2 2"/>
    <text x="20" y="24" textAnchor="middle" fill="#c9a84c" fontSize="10" fontWeight="700" fontFamily="Georgia,serif" letterSpacing="1">YPD</text>
  </svg>
);

const NAV_ITEMS = [
  { label: 'Home',          to: '/',           Icon: NavIcons.Home         },
  { label: 'About Us',      to: '/about',      Icon: NavIcons.About        },
  { label: 'Church Finder', to: '/charges',    Icon: NavIcons.ChurchFinder },
  { label: 'Events',        to: '/events',     Icon: NavIcons.Events       },
  { label: 'Blog',          to: '/blog',       Icon: NavIcons.Blog         },
  { label: 'Media',         to: '/media',      Icon: NavIcons.Media        },
  { label: 'Structure',     to: '/structure',  Icon: NavIcons.Structure    },
  { label: 'Contact',       to: '/contact',    Icon: NavIcons.Contact      },
];

const Navigation = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <>
      {/* ── TOP NAV BAR ── */}
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 999,
          backgroundColor: 'rgba(10, 32, 21, 0.96)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(201,168,76,0.18)',
          fontFamily: "'Lato', sans-serif",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: '0 20px',
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <YPDLogo />
            <div>
              <div style={{ color: '#c9a84c', fontFamily: 'Georgia,serif', fontSize: 15, fontWeight: 600, lineHeight: 1.1 }}>
                AME Church
              </div>
              <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                Young People's Division
              </div>
            </div>
          </Link>

          {/* Desktop links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="ypd-desktop-nav">
            {NAV_ITEMS.map(({ label, to, Icon }) => (
              <Link
                key={to}
                to={to}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 12px',
                  borderRadius: 6,
                  textDecoration: 'none',
                  fontSize: 13,
                  fontWeight: isActive(to) ? 700 : 400,
                  color: isActive(to) ? '#c9a84c' : 'rgba(255,255,255,0.78)',
                  backgroundColor: isActive(to) ? 'rgba(201,168,76,0.1)' : 'transparent',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  if (!isActive(to)) e.currentTarget.style.color = '#c9a84c';
                }}
                onMouseLeave={e => {
                  if (!isActive(to)) e.currentTarget.style.color = 'rgba(255,255,255,0.78)';
                }}
              >
                <Icon />
                <span>{label}</span>
              </Link>
            ))}

            {/* Auth */}
            {isAuthenticated() ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 8 }}>
                <span style={{ color: '#c9a84c', fontSize: 13 }}>
                  {user?.firstName || user?.username}
                </span>
                <button
                  onClick={handleLogout}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.35)',
                    color: '#c9a84c', padding: '7px 14px', borderRadius: 6,
                    cursor: 'pointer', fontSize: 13, fontFamily: "'Lato',sans-serif",
                  }}
                >
                  <NavIcons.Logout /> Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                style={{
                  display: 'flex', alignItems: 'center', gap: 6, marginLeft: 8,
                  background: '#c9a84c', color: '#0d2b1a', padding: '8px 18px',
                  borderRadius: 6, textDecoration: 'none', fontSize: 13,
                  fontWeight: 700, transition: 'background 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#e0c060'}
                onMouseLeave={e => e.currentTarget.style.background = '#c9a84c'}
              >
                <NavIcons.Login /> Log In
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'none', border: 'none', color: '#fff',
              cursor: 'pointer', padding: 4, display: 'none',
            }}
            className="ypd-burger"
          >
            {mobileMenuOpen ? <NavIcons.Close /> : <NavIcons.Menu />}
          </button>
        </div>

        {/* ── MOBILE MENU (sidebar-style, matches your screenshot) ── */}
        {mobileMenuOpen && (
          <div
            style={{
              background: '#fff',
              borderTop: '1px solid rgba(201,168,76,0.2)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
            }}
          >
            {/* Active (Home) row — green bg like your screenshot */}
            {NAV_ITEMS.map(({ label, to, Icon }) => {
              const active = isActive(to);
              return (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: '16px 20px',
                    textDecoration: 'none',
                    fontFamily: "'Lato',sans-serif",
                    fontSize: 15,
                    fontWeight: active ? 700 : 400,
                    color: active ? '#fff' : '#1a4731',
                    backgroundColor: active ? '#1a6640' : 'transparent',
                    borderBottom: '1px solid rgba(26,71,49,0.07)',
                    transition: 'background 0.15s',
                  }}
                >
                  <span style={{ color: active ? '#fff' : '#256040' }}>
                    <Icon />
                  </span>
                  {label}
                </Link>
              );
            })}

            {/* Auth row */}
            {isAuthenticated() ? (
              <button
                onClick={handleLogout}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  width: '100%', padding: '16px 20px',
                  background: 'none', border: 'none',
                  fontFamily: "'Lato',sans-serif", fontSize: 15, color: '#c0392b',
                  cursor: 'pointer', borderTop: '1px solid rgba(26,71,49,0.07)',
                }}
              >
                <NavIcons.Logout /> Logout
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '16px 20px', textDecoration: 'none',
                  fontFamily: "'Lato',sans-serif", fontSize: 15,
                  color: '#1a4731', borderTop: '1px solid rgba(26,71,49,0.07)',
                }}
              >
                <NavIcons.Login /> Log In
              </Link>
            )}
          </div>
        )}
      </nav>

      {/* Responsive styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Lato:wght@300;400;700&display=swap');
        @media (max-width: 900px) {
          .ypd-desktop-nav { display: none !important; }
          .ypd-burger      { display: block !important; }
        }
        @media (min-width: 901px) {
          .ypd-burger { display: none !important; }
        }
      `}</style>
    </>
  );
};

export default Navigation;
