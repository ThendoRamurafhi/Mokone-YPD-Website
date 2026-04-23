import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import eventService  from '../../services/eventService';
import blogService   from '../../services/blogService';
import chargeService from '../../services/chargeService';
import prayerService from '../../services/prayerService';
import userService   from '../../services/userService';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ events:0, posts:0, churches:0, users:0, prayers:0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [events, posts, churches, pending] = await Promise.allSettled([
          eventService.getAll({ page:0, size:1 }),
          blogService.getAll({ page:0, size:1 }),
          chargeService.getAll({ page:0, size:1 }),
          prayerService.getPending(),
        ]);
        setStats({
          events:  events.value?.totalElements  || events.value?.length  || 0,
          posts:   posts.value?.totalElements   || posts.value?.length   || 0,
          churches:churches.value?.totalElements|| churches.value?.length|| 0,
          prayers: pending.value?.length || 0,
        });
      } catch {}
      setLoading(false);
    };
    fetchStats();
  }, []);

  const STAT_CARDS = [
    { label:'Total Events',    value:stats.events,  to:'/admin/events',  color:'#1a4731', icon:'📅' },
    { label:'Blog Posts',      value:stats.posts,   to:'/admin/blog',    color:'#256040', icon:'📝' },
    { label:'Churches',        value:stats.churches,to:'/admin/charges', color:'#40916c', icon:'⛪' },
    { label:'Pending Prayers', value:stats.prayers, to:'/admin/prayers', color:'#c9a84c', icon:'🙏' },
  ];

  const QUICK_ACTIONS = [
    { label:'Create Event',       to:'/admin/events/new',   color:'#1a4731' },
    { label:'Write Blog Post',    to:'/admin/blog/new',     color:'#256040' },
    { label:'Add Church',         to:'/admin/charges/new',  color:'#40916c' },
    { label:'Upload Media',       to:'/admin/media/upload', color:'#c9a84c' },
    { label:'Review Prayers',     to:'/admin/prayers',      color:'#6b21a8' },
    { label:'Manage Users',       to:'/admin/users',        color:'#1a56a0' },
  ];

  return (
    <AdminLayout>
      <h1 style={{ fontFamily:'Georgia,serif', fontSize:28, color:'#0d2b1a', marginBottom:6 }}>Good morning, Admin</h1>
      <p style={{ fontSize:14, color:'#6b8070', marginBottom:32 }}>Here's an overview of your YPD website.</p>

      {/* Stat cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:18, marginBottom:36 }}>
        {STAT_CARDS.map(s => (
          <Link key={s.label} to={s.to} style={{ textDecoration:'none', background:'#fff', borderRadius:12, padding:'24px', border:'1px solid rgba(0,0,0,.07)', transition:'all .3s', display:'block' }}
            onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='0 10px 28px rgba(0,0,0,.09)'; }}
            onMouseLeave={e=>{ e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; }}>
            <div style={{ fontSize:28, marginBottom:10 }}>{s.icon}</div>
            <div style={{ fontFamily:'Georgia,serif', fontSize:36, fontWeight:700, color:s.color, lineHeight:1 }}>
              {loading ? '…' : s.value}
            </div>
            <div style={{ fontSize:13, color:'#6b8070', marginTop:6 }}>{s.label}</div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ background:'#fff', borderRadius:12, padding:'24px', border:'1px solid rgba(0,0,0,.07)', marginBottom:28 }}>
        <h2 style={{ fontFamily:'Georgia,serif', fontSize:20, color:'#0d2b1a', marginBottom:20 }}>Quick Actions</h2>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:12 }}>
          {QUICK_ACTIONS.map(a => (
            <Link key={a.label} to={a.to} style={{ display:'block', background:a.color, color: a.color==='#c9a84c'?'#0d2b1a':'#fff', padding:'14px 16px', borderRadius:8, textDecoration:'none', fontSize:13, fontWeight:700, textAlign:'center', transition:'opacity .2s' }}
              onMouseEnter={e=>e.currentTarget.style.opacity='.85'} onMouseLeave={e=>e.currentTarget.style.opacity='1'}>
              {a.label}
            </Link>
          ))}
        </div>
      </div>

      <div style={{ background:'#fff', borderRadius:12, padding:'24px', border:'1px solid rgba(0,0,0,.07)' }}>
        <h2 style={{ fontFamily:'Georgia,serif', fontSize:20, color:'#0d2b1a', marginBottom:8 }}>Getting Started</h2>
        <p style={{ fontSize:14, color:'#6b8070', lineHeight:1.8 }}>
          Use the sidebar to manage all website content. Create events and members will see them live instantly.
          Blog posts, church listings, media — all managed here without touching any code.
        </p>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;