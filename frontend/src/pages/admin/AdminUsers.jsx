import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import userService from '../../services/userService';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminUsers = () => {
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');
  const [filter,  setFilter]  = useState('ALL');

  const load = async () => {
    try { setLoading(true); const d = await userService.getAll({ page:0, size:200 }); setUsers(d.content||d||[]); }
    catch {} finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleRoleChange = async (userId, newRole) => {
    if (!window.confirm(`Change this user's role to ${newRole}?`)) return;
    try { await userService.updateRole(userId, newRole); await load(); }
    catch { alert(typeof err === 'string' ? err : 'Role update failed. This user may be protected.'); }
  };

  const handleDelete = async (u) => {
    if (!window.confirm(`Permanently remove ${u.firstName} ${u.lastName}?`)) return;
    try { await userService.remove(u.userId); await load(); }
    catch { alert(typeof err === 'string' ? err : 'Role update failed. This user may be protected.'); }
  };

  const ROLES  = ['ALL', 'SUPER_ADMIN', 'ADMIN','MEMBER','GUEST'];
  const filtered = users.filter(u => {
    const matchRole   = filter==='ALL' || u.role===filter;
    const matchSearch = !search || (`${u.firstName} ${u.lastName} ${u.email}`).toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  const ROLE_COLOR = { SUPER_ADMIN:{bg:'rgba(139,92,246,.1)',text:'#8b5cf6'}, ADMIN:{bg:'rgba(107,33,168,.1)',text:'#6b21a8'}, MEMBER:{bg:'rgba(37,96,64,.1)',text:'#1a4731'}, GUEST:{bg:'rgba(88,88,88,.1)',text:'#555'} };

  return (
    <AdminLayout>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24, flexWrap:'wrap', gap:12 }}>
        <h1 style={{ fontFamily:'Georgia,serif', fontSize:28, color:'#0d2b1a' }}>Users ({users.length})</h1>
      </div>

      <div style={{ display:'flex', gap:12, marginBottom:20, flexWrap:'wrap' }}>
        <input placeholder="Search by name or email…" value={search} onChange={e=>setSearch(e.target.value)}
          style={{ flex:1, minWidth:200, padding:'11px 14px', border:'1.5px solid rgba(26,71,49,.2)', borderRadius:8, fontSize:14, outline:'none', fontFamily:"'Lato',sans-serif", boxSizing:'border-box' }} />
        <div style={{ display:'flex', gap:8 }}>
          {ROLES.map(r=>(
            <button key={r} onClick={()=>setFilter(r)} 
            style={{ padding:'9px 16px', borderRadius:20, border:'1px solid rgba(26,71,49,.2)', background:filter===r?'#1a4731':'#fff', color:filter===r?'#fff':'#3d5247', fontFamily:"'Lato',sans-serif", fontSize:12, cursor:'pointer', transition:'all .2s' }}>
              {r === 'SUPER_ADMIN' ? '⭐ SUPER' : r}</button>
          ))}
        </div>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div style={{ background:'#fff', borderRadius:12, border:'1px solid rgba(0,0,0,.07)', overflow:'hidden' }}>
          <table className="admin-table">
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.length===0 ? 
              <tr><td colSpan={5} style={{ textAlign:'center', padding:'40px', color:'#aaa' }}>
                No users found.</td></tr>
              : filtered.map(u=>(
                <tr key={u.userId}>
                  <td>
                    <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                      <div style={{ width:36, height:36, borderRadius:'50%', background:'#1a4731', display:'flex', alignItems:'center', justifyContent:'center', color:'#c9a84c', fontFamily:'Georgia,serif', fontWeight:700, fontSize:13, flexShrink:0 }}>
                        {(u.firstName||'?')[0]}{(u.lastName||'')[0]}
                      </div>
                      <div>
                        <div style={{ fontWeight:600, color:'#0d2b1a' }}>
                          {u.firstName} {u.lastName}
                          {u.role === 'SUPER_ADMIN' && ' ⭐'}
                        </div>
                        <div style={{ fontSize:12, color:'#aaa' }}>@{u.username}</div>
                      </div>
                    </div>
                  </td>

                  <td style={{ fontSize:13 }}>{u.email}</td>
                  <td>
                    {u.role === 'SUPER_ADMIN' ? (
                      <span style={{
                        display:'inline-block',
                        fontSize:11, fontWeight:700, letterSpacing:'.1em',
                        padding:'4px 12px', borderRadius:20,
                        background: ROLE_STYLE.SUPER_ADMIN.bg,
                        color: ROLE_STYLE.SUPER_ADMIN.text,
                        border: ROLE_STYLE.SUPER_ADMIN.border,
                      }}>
                        SUPER ADMIN ⭐
                      </span>
                    ) : (
                      <select
                        value={u.role}
                        onChange={e => handleRoleChange(u.userId, e.target.value)}
                        style={{
                          padding:'5px 10px', borderRadius:5,
                          border:'1px solid rgba(0,0,0,.15)', fontSize:12,
                          color: ROLE_STYLE[u.role]?.text || '#555',
                          background:'#fff', cursor:'pointer',
                          fontFamily:"'Lato',sans-serif",
                        }}>
                        {/* Never show SUPER_ADMIN as an option */}
                        {['ADMIN','MEMBER','GUEST'].map(r => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    )}
                  </td>
                  <td style={{ fontSize:13 }}>{u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-ZA') : '—'}</td>
                  <td>
                    {u.role === 'SUPER_ADMIN' ? (
                      <span style={{ fontSize:12, color:'#aaa', fontStyle:'italic' }}>Protected</span>
                    ) : (
                      <button 
                        onClick={()=>handleDelete(u)} 
                        style={{ background:'rgba(192,57,43,.1)', color:'#c0392b', border:'none', padding:'7px 14px', borderRadius:5, cursor:'pointer', fontSize:12, fontFamily:"'Lato',sans-serif", fontWeight:700 }}>
                        Remove
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminUsers;