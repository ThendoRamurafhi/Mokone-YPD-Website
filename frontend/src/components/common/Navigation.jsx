import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { NavIcons } from './NavIcons';
import YPDLogo from './YPDLogo';

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
  // ← FIXED: single useAuth call with all needed values
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
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
      <nav
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 999,
          backgroundColor: 'rgba(10, 32, 21, 0.96)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(201,168,76,0.18)',
          fontFamily: "'Lato', sans-serif",
        }}
      >
        <div
          style={{
            maxWidth: 1200, margin: '0 auto', padding: '0 20px',
            height: 64, display: 'flex', alignItems: 'center',
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
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '6px 12px', borderRadius: 6, textDecoration: 'none',
                  fontSize: 13,
                  fontWeight: isActive(to) ? 700 : 400,
                  color: isActive(to) ? '#c9a84c' : 'rgba(255,255,255,0.78)',
                  backgroundColor: isActive(to) ? 'rgba(201,168,76,0.1)' : 'transparent',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { if (!isActive(to)) e.currentTarget.style.color = '#c9a84c'; }}
                onMouseLeave={e => { if (!isActive(to)) e.currentTarget.style.color = 'rgba(255,255,255,0.78)'; }}
              >
                <Icon />
                <span>{label}</span>
              </Link>
            ))}

            {/* Auth section */}
            {isAuthenticated() ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 8 }}>

                {/* ← ADMIN PANEL BUTTON — only shows for admins */}
                {isAdmin && isAdmin() ? (
                  <Link
                    to="/admin"
                    style={{ color: '#c9a84c', fontSize: 13, textDecoration: 'none', fontWeight: 400 }}
                    title="Admin Panel"
                  >
                    {user?.firstName || user?.username}
                  </Link>
                ) : (
                  <span style={{ color: '#c9a84c', fontSize: 13 }}>
                    {user?.firstName || user?.username}
                  </span>
                )}

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
            style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 4, display: 'none' }}
            className="ypd-burger"
          >
            {mobileMenuOpen ? <NavIcons.Close /> : <NavIcons.Menu />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div style={{ background: '#fff', borderTop: '1px solid rgba(201,168,76,0.2)', boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}>
            {NAV_ITEMS.map(({ label, to, Icon }) => {
              const active = isActive(to);
              return (
                <Link
                  key={to} to={to} onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '16px 20px', textDecoration: 'none',
                    fontFamily: "'Lato',sans-serif", fontSize: 15,
                    fontWeight: active ? 700 : 400,
                    color: active ? '#fff' : '#1a4731',
                    backgroundColor: active ? '#1a6640' : 'transparent',
                    borderBottom: '1px solid rgba(26,71,49,0.07)',
                  }}
                >
                  <span style={{ color: active ? '#fff' : '#256040' }}><Icon /></span>
                  {label}
                </Link>
              );
            })}

            {/* Mobile admin link */}
            {isAuthenticated() && isAdmin && isAdmin() && (
              <Link
                to="/admin" onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '16px 20px', textDecoration: 'none',
                  fontFamily: "'Lato',sans-serif", fontSize: 15,
                  color: '#c9a84c', fontWeight: 700,
                  borderBottom: '1px solid rgba(26,71,49,0.07)',
                  background: 'rgba(201,168,76,0.08)',
                }}
              >
                ⚙ Admin Panel
              </Link>
            )}

            {isAuthenticated() ? (
              <button
                onClick={handleLogout}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  width: '100%', padding: '16px 20px',
                  background: 'none', border: 'none',
                  fontFamily: "'Lato',sans-serif", fontSize: 15,
                  color: '#c0392b', cursor: 'pointer',
                  borderTop: '1px solid rgba(26,71,49,0.07)',
                }}
              >
                <NavIcons.Logout /> Logout
              </button>
            ) : (
              <Link
                to="/login" onClick={() => setMobileMenuOpen(false)}
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

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Lato:wght@300;400;700&display=swap');
        @media (max-width: 900px) {
          .ypd-desktop-nav { display: none !important; }
          .ypd-burger { display: block !important; }
        }
        @media (min-width: 901px) {
          .ypd-burger { display: none !important; }
        }
      `}</style>
    </>
  );
};

export default Navigation;