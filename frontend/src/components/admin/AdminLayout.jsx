import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location         = useLocation();
  const navigate         = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const NAV = [
    { to:'/admin',          label:'Dashboard',    icon:'⊞' },
    { to:'/admin/events',   label:'Events',        icon:'📅' },
    { to:'/admin/blog',     label:'Blog Posts',    icon:'📝' },
    { to:'/admin/media',    label:'Media',         icon:'🎬' },
    { to:'/admin/charges',  label:'Churches',      icon:'⛪' },
    { to:'/admin/users',    label:'Users',         icon:'👥' },
    { to:'/admin/prayers',  label:'Prayer Requests',icon:'🙏' },
  ];

  return (
    <div style={{ display:'flex', minHeight:'100vh', fontFamily:"'Lato',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap'); * { box-sizing:border-box; margin:0; padding:0; } .admin-link{display:flex;align-items:center;gap:12px;padding:11px 20px;color:rgba(255,255,255,.65);text-decoration:none;font-size:13px;border-radius:8px;margin:2px 8px;transition:all .2s} .admin-link:hover{background:rgba(255,255,255,.08);color:#fff} .admin-link.active{background:rgba(201,168,76,.2);color:#c9a84c} .admin-link .icon{font-size:16px;width:20px;text-align:center} .admin-btn{padding:10px 20px;border:none;border-radius:6px;font-family:'Lato',sans-serif;font-size:13px;font-weight:700;cursor:pointer;transition:all .2s} .admin-input{width:100%;padding:11px 14px;border:1.5px solid rgba(26,71,49,.2);border-radius:6px;font-size:14px;outline:none;font-family:'Lato',sans-serif;box-sizing:border-box;background:#fff} .admin-input:focus{border-color:#1a4731} .admin-table{width:100%;border-collapse:collapse} .admin-table th{text-align:left;padding:12px 16px;font-size:11px;font-weight:700;letter-spacing:.12em;color:#6b8070;border-bottom:1px solid rgba(0,0,0,.08);background:#f7f9f7} .admin-table td{padding:14px 16px;border-bottom:1px solid rgba(0,0,0,.05);font-size:14px;color:#3d5247;vertical-align:middle} .admin-table tr:hover td{background:#f7f9f7} .badge{display:inline-block;font-size:10px;font-weight:700;letter-spacing:.1em;padding:3px 10px;border-radius:20px}`}</style>

      {/* ── SIDEBAR ── */}
      <aside style={{ width:collapsed?64:240, background:'#0d2b1a', flexShrink:0, display:'flex', flexDirection:'column', transition:'width .25s', overflow:'hidden', position:'sticky', top:0, height:'100vh' }}>
        {/* Logo */}
        <div style={{ padding:'20px 16px', borderBottom:'1px solid rgba(255,255,255,.07)', display:'flex', alignItems:'center', gap:12, minHeight:72 }}>
          <div style={{ width:36, height:36, borderRadius:'50%', background:'#c9a84c', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Georgia,serif', fontWeight:700, fontSize:13, color:'#0d2b1a', flexShrink:0 }}>YPD</div>
          {!collapsed && <div style={{ color:'#fff', fontFamily:'Georgia,serif', fontSize:14, fontWeight:600, whiteSpace:'nowrap' }}>Admin Panel</div>}
        </div>

        {/* Nav links */}
        <nav style={{ flex:1, padding:'12px 0', overflowY:'auto' }}>
          {NAV.map(({ to, label, icon }) => (
            <Link key={to} to={to} className={`admin-link${isActive(to) && (to==='/admin' ? location.pathname==='/admin' : true) ? ' active' : ''}`}
              style={isActive(to) && (to==='/admin' ? location.pathname==='/admin' : location.pathname.startsWith(to)) ? { background:'rgba(201,168,76,.2)', color:'#c9a84c' } : {}}>
              <span className="icon">{icon}</span>
              {!collapsed && <span style={{ whiteSpace:'nowrap' }}>{label}</span>}
            </Link>
          ))}
        </nav>

        {/* Bottom: user + logout */}
        <div style={{ padding:'16px', borderTop:'1px solid rgba(255,255,255,.07)' }}>
          {!collapsed && user && (
            <div style={{ marginBottom:10 }}>
              <div style={{ fontSize:12, fontWeight:700, color:'rgba(255,255,255,.7)', marginBottom:2 }}>{user.firstName} {user.lastName}</div>
              <div style={{ fontSize:11, color:'#c9a84c', letterSpacing:'.08em' }}>ADMIN</div>
            </div>
          )}
          <div style={{ display:'flex', gap:8 }}>
            <button onClick={()=>setCollapsed(!collapsed)} className="admin-btn" style={{ background:'rgba(255,255,255,.08)', color:'rgba(255,255,255,.7)', padding:'8px 12px', fontSize:16 }}>
              {collapsed ? '→' : '←'}
            </button>
            {!collapsed && (
              <button onClick={handleLogout} className="admin-btn" style={{ background:'rgba(192,57,43,.2)', color:'#f08080', flex:1, fontSize:12 }}>
                Logout
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main style={{ flex:1, background:'#f7f9f7', minHeight:'100vh', overflow:'auto' }}>
        {/* Top bar */}
        <div style={{ background:'#fff', borderBottom:'1px solid rgba(0,0,0,.07)', padding:'0 28px', height:64, display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:10 }}>
          <div style={{ fontSize:13, color:'#6b8070' }}>
            {location.pathname === '/admin' ? 'Dashboard' : NAV.find(n=>location.pathname.startsWith(n.to) && n.to !== '/admin')?.label || 'Admin'}
          </div>
          <Link to="/" style={{ fontSize:13, color:'#1a4731', textDecoration:'none', fontWeight:600 }}>← View Site</Link>
        </div>

        <div style={{ padding:'28px' }}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;