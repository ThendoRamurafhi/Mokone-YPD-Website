import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import YPDLogo from '../common/YPDLogo';

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location         = useLocation();
  const navigate         = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };
  const isActive = (path) => path === '/admin' 
    ? location.pathname === '/admin'
    : location.pathname.startsWith(path);

  const NAV = [
    { to:'/admin',          label:'Dashboard',       icon:'⊞' },
    { to:'/admin/events',   label:'Events',          icon:'📅' },
    { to:'/admin/blog',     label:'Blog Posts',      icon:'📝' },
    { to:'/admin/media',    label:'Media',           icon:'🎬' },
    { to:'/admin/charges',  label:'Churches',        icon:'⛪' },
    { to:'/admin/users',    label:'Users',           icon:'👥' },
    { to:'/admin/prayers',  label:'Prayer Requests', icon:'🙏' },
  ];

  return (
    <div style={{ display:'flex', minHeight:'100vh', fontFamily:"'Lato',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,400&family=Lato:wght@300;400;700&display=swap');
        * { box-sizing:border-box; }
        .admin-link { display:flex; align-items:center; gap:12px; padding:11px 20px; color:rgba(255,255,255,0.6); text-decoration:none; font-size:13px; border-radius:6px; margin:2px 8px; transition:all .2s; letter-spacing:0.03em; }
        .admin-link:hover { background:rgba(201,168,76,0.1); color:rgba(255,255,255,0.9); }
        .admin-link.active { background:rgba(201,168,76,0.18); color:#c9a84c; border-left:3px solid #c9a84c; padding-left:17px; }
        .admin-btn { padding:10px 20px; border:none; border-radius:6px; font-family:'Lato',sans-serif; font-size:13px; font-weight:700; cursor:pointer; transition:all .2s; }
        .admin-input { width:100%; padding:11px 14px; border:1.5px solid rgba(26,71,49,.2); border-radius:6px; font-size:14px; outline:none; font-family:'Lato',sans-serif; box-sizing:border-box; background:#fff; }
        .admin-input:focus { border-color:#1a4731; }
        .admin-table { width:100%; border-collapse:collapse; }
        .admin-table th { text-align:left; padding:12px 16px; font-size:11px; font-weight:700; letter-spacing:.12em; color:#6b8070; border-bottom:1px solid rgba(0,0,0,.08); background:#f7f9f7; }
        .admin-table td { padding:14px 16px; border-bottom:1px solid rgba(0,0,0,.05); font-size:14px; color:#3d5247; vertical-align:middle; }
        .admin-table tr:hover td { background:#f7f9f7; }
        .badge { display:inline-block; font-size:10px; font-weight:700; letter-spacing:.1em; padding:3px 10px; border-radius:20px; }
      `}</style>

      {/* ── SIDEBAR ── */}
      <aside style={{ 
        width: collapsed ? 64 : 260, 
        background: 'linear-gradient(180deg, #071812 0%, #0d2b1a 40%, #1a4731 100%)',
        borderRight: '1px solid rgba(201,168,76,0.15)',
        flexShrink: 0, 
        display: 'flex', 
        flexDirection: 'column', 
        transition: 'width .25s', 
        overflow: 'hidden', 
        position: 'sticky', 
        top: 0, 
        height: '100vh' 
      }}>
        
        {/* Logo area — matches your site header style */}
        <div style={{ 
          padding: '24px 16px', 
          borderBottom: '1px solid rgba(201,168,76,0.15)', 
          display: 'flex', 
          alignItems: 'center', 
          gap: 12, 
          minHeight: 80 
        }}>
          <div style={{ flexShrink: 0 }}>
            <YPDLogo width={40} height={40} />
          </div>
          {!collapsed && (
            <div>
              <div style={{ 
                fontFamily: "'Cormorant Garamond', serif", 
                color: '#fff', 
                fontSize: 16, 
                fontWeight: 700, 
                lineHeight: 1.2 
              }}>
                AME Church
              </div>
              <div style={{ 
                fontSize: 9, 
                fontWeight: 700, 
                letterSpacing: '0.18em', 
                color: '#c9a84c', 
                marginTop: 2 
              }}>
                ADMIN PANEL
              </div>
            </div>
          )}
        </div>

        {/* Nav section label */}
        {!collapsed && (
          <div style={{ 
            padding: '20px 20px 8px', 
            fontSize: 9, 
            fontWeight: 700, 
            letterSpacing: '0.2em', 
            color: 'rgba(201,168,76,0.5)' 
          }}>
            NAVIGATION
          </div>
        )}

        {/* Nav links */}
        <nav style={{ flex: 1, padding: '8px 0', overflowY: 'auto' }}>
          {NAV.map(({ to, label, icon }) => (
            <Link 
              key={to} 
              to={to} 
              className={`admin-link${isActive(to) ? ' active' : ''}`}
            >
              <span style={{ fontSize: 16, width: 20, textAlign: 'center', flexShrink: 0 }}>
                {icon}
              </span>
              {!collapsed && <span style={{ whiteSpace: 'nowrap' }}>{label}</span>}
            </Link>
          ))}
        </nav>

        {/* Bottom: user info + actions */}
        <div style={{ borderTop: '1px solid rgba(201,168,76,0.15)', padding: '16px' }}>
          {!collapsed && user && (
            <div style={{ 
              background: 'rgba(201,168,76,0.08)', 
              borderRadius: 8, 
              padding: '12px 14px', 
              marginBottom: 12,
              border: '1px solid rgba(201,168,76,0.15)'
            }}>
              <div style={{ 
                fontSize: 13, 
                fontWeight: 700, 
                color: '#fff', 
                marginBottom: 2 
              }}>
                {user.firstName || user.username || 'Admin'}
              </div>
              <div style={{ 
                fontSize: 10, 
                color: '#c9a84c', 
                letterSpacing: '0.12em', 
                fontWeight: 700 
              }}>
                ✦ ADMINISTRATOR
              </div>
            </div>
          )}
          
          <div style={{ display: 'flex', gap: 8 }}>
            <button 
              onClick={() => setCollapsed(!collapsed)} 
              style={{ 
                background: 'rgba(255,255,255,0.06)', 
                color: 'rgba(255,255,255,0.6)', 
                border: '1px solid rgba(255,255,255,0.1)',
                padding: '8px 12px', 
                borderRadius: 6,
                cursor: 'pointer',
                fontSize: 14,
                transition: 'all .2s'
              }}
            >
              {collapsed ? '→' : '←'}
            </button>
            {!collapsed && (
              <button 
                onClick={handleLogout} 
                style={{ 
                  background: 'rgba(192,57,43,0.15)', 
                  color: '#f08080', 
                  border: '1px solid rgba(192,57,43,0.2)',
                  flex: 1, 
                  fontSize: 12,
                  borderRadius: 6,
                  padding: '8px',
                  cursor: 'pointer',
                  fontFamily: "'Lato',sans-serif",
                  fontWeight: 700
                }}
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main style={{ flex: 1, background: '#f7f9f7', minHeight: '100vh', overflow: 'auto' }}>
        
        {/* Top bar — matches your site's navbar height and style */}
        <div style={{ 
          background: '#fff', 
          borderBottom: '1px solid rgba(201,168,76,0.15)', 
          padding: '0 28px', 
          height: 64, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          position: 'sticky', 
          top: 0, 
          zIndex: 10,
          boxShadow: '0 2px 12px rgba(13,43,26,0.06)'
        }}>
          <div style={{ 
            fontFamily: "'Cormorant Garamond', serif", 
            fontSize: 18, 
            color: '#0d2b1a',
            fontWeight: 600
          }}>
            {location.pathname === '/admin' 
              ? 'Dashboard' 
              : NAV.find(n => isActive(n.to) && n.to !== '/admin')?.label || 'Admin'}
          </div>
          
          <Link 
            to="/" 
            style={{ 
              fontSize: 13, 
              color: '#1a4731', 
              textDecoration: 'none', 
              fontWeight: 700,
              border: '1.5px solid rgba(26,71,49,0.3)',
              padding: '8px 16px',
              borderRadius: 4,
              letterSpacing: '0.06em',
              transition: 'all .2s'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#1a4731'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#1a4731'; }}
          >
            ← VIEW SITE
          </Link>
        </div>

        <div style={{ padding: '32px 28px' }}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;