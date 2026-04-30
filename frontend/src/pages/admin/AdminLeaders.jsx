// Manages the leadership team shown on the About page.
// Spring Boot entity needed:
//   Leader { id, name, role, description, imageUrl, orderIndex, isActive }
// Endpoint: GET/POST/PUT/DELETE /api/v1/leaders

import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const leaderService = {
  getAll:  ()         => api.get('/leaders'),
  create:  (data)     => api.post('/leaders', data),
  update:  (id, data) => api.put(`/leaders/${id}`, data),
  remove:  (id)       => api.delete(`/leaders/${id}`),
};

const EMPTY = { name:'', role:'', description:'', imageUrl:'', orderIndex:0, isActive:true };

const AdminLeaders = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form,    setForm]    = useState(EMPTY);
  const [saving,  setSaving]  = useState(false);
  const [msg,     setMsg]     = useState(null);

  const load = async () => {
    try { setLoading(true); const d = await leaderService.getAll(); setLeaders(d.content||d||[]); }
    catch {} finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openNew  = () => { setForm(EMPTY); setEditing('new'); setMsg(null); };
  const openEdit = (l) => { setForm(l); setEditing(l); setMsg(null); };
  const cancel   = () => { setEditing(null); setMsg(null); };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      editing === 'new' ? await leaderService.create(form) : await leaderService.update(editing.id, form);
      setMsg({ type:'success', text:'Saved!' });
      await load();
      setTimeout(() => { setEditing(null); setMsg(null); }, 1000);
    } catch (err) {
      setMsg({ type:'error', text: typeof err==='string' ? err : 'Save failed.' });
    } finally { setSaving(false); }
  };

  const handleDelete = async (l) => {
    if (!window.confirm(`Remove "${l.name}"?`)) return;
    try { await leaderService.remove(l.id); await load(); }
    catch { alert('Delete failed.'); }
  };

  const inputStyle = { width:'100%', padding:'11px 14px', border:'1.5px solid rgba(26,71,49,.2)', borderRadius:6, fontSize:14, outline:'none', fontFamily:"'Lato',sans-serif", boxSizing:'border-box' };
  const labelStyle = { display:'block', fontSize:11, fontWeight:700, letterSpacing:'.12em', color:'#3d5247', marginBottom:7 };

  return (
    <AdminLayout>
      {editing ? (
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:28 }}>
            <button onClick={cancel} style={{ background:'transparent', border:'1px solid rgba(0,0,0,.15)', borderRadius:6, padding:'8px 16px', cursor:'pointer', fontSize:13, color:'#6b8070' }}>← Back</button>
            <h1 style={{ fontFamily:'Georgia,serif', fontSize:24, color:'#0d2b1a' }}>{editing==='new'?'Add Leader':'Edit Leader'}</h1>
          </div>
          {msg && <div style={{ padding:'12px 16px', borderRadius:6, marginBottom:20, background:msg.type==='success'?'rgba(37,96,64,.1)':'rgba(192,57,43,.08)', border:`1px solid ${msg.type==='success'?'rgba(37,96,64,.3)':'rgba(192,57,43,.3)'}`, color:msg.type==='success'?'#1a4731':'#c0392b', fontSize:13 }}>{msg.text}</div>}
          <form onSubmit={handleSave} style={{ background:'#fff', borderRadius:12, padding:'28px', border:'1px solid rgba(0,0,0,.07)' }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>
              <div>
                <label style={labelStyle}>FULL NAME *</label>
                <input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Rev. John Doe" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>ROLE / TITLE *</label>
                <input required value={form.role} onChange={e=>setForm({...form,role:e.target.value})} placeholder="Presiding Elder" style={inputStyle} />
              </div>
            </div>
            <div style={{ marginBottom:16 }}>
              <label style={labelStyle}>DESCRIPTION</label>
              <textarea rows={3} value={form.description||''} onChange={e=>setForm({...form,description:e.target.value})} placeholder="A brief bio…" style={{ ...inputStyle, resize:'vertical' }} />
            </div>
            <div style={{ marginBottom:16 }}>
              <label style={labelStyle}>PHOTO URL (optional)</label>
              <input value={form.imageUrl||''} onChange={e=>setForm({...form,imageUrl:e.target.value})} placeholder="https://example.com/photo.jpg" style={inputStyle} />
              {form.imageUrl && <img src={form.imageUrl} alt="preview" style={{ width:60, height:60, borderRadius:'50%', objectFit:'cover', marginTop:8, border:'2px solid #c9a84c' }} />}
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:20 }}>
              <div>
                <label style={labelStyle}>DISPLAY ORDER</label>
                <input type="number" min={0} value={form.orderIndex||0} onChange={e=>setForm({...form,orderIndex:+e.target.value})} style={inputStyle} />
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:10, paddingTop:28 }}>
                <input type="checkbox" id="active" checked={form.isActive!==false} onChange={e=>setForm({...form,isActive:e.target.checked})} />
                <label htmlFor="active" style={{ fontSize:14, color:'#3d5247', cursor:'pointer' }}>Show on About page</label>
              </div>
            </div>
            <div style={{ display:'flex', gap:12 }}>
              <button type="submit" disabled={saving} style={{ background:'#1a4731', color:'#fff', border:'none', padding:'13px 32px', borderRadius:8, fontFamily:"'Lato',sans-serif", fontSize:14, fontWeight:700, cursor:'pointer', opacity:saving?.7:1 }}>
                {saving ? 'Saving…' : editing==='new' ? 'Add Leader' : 'Save Changes'}
              </button>
              <button type="button" onClick={cancel} style={{ background:'transparent', border:'1px solid rgba(0,0,0,.18)', color:'#6b8070', padding:'13px 24px', borderRadius:8, fontFamily:"'Lato',sans-serif", fontSize:14, cursor:'pointer' }}>Cancel</button>
            </div>
          </form>
        </div>
      ) : (
        <div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24, flexWrap:'wrap', gap:12 }}>
            <div>
              <h1 style={{ fontFamily:'Georgia,serif', fontSize:28, color:'#0d2b1a' }}>Leadership Team</h1>
              <p style={{ fontSize:13, color:'#6b8070', marginTop:4 }}>These appear on the public About page.</p>
            </div>
            <button onClick={openNew} style={{ background:'#c9a84c', color:'#0d2b1a', border:'none', padding:'12px 24px', borderRadius:8, fontFamily:"'Lato',sans-serif", fontSize:14, fontWeight:700, cursor:'pointer' }}>+ Add Leader</button>
          </div>

          {loading ? <LoadingSpinner /> : (
            <div style={{ background:'#fff', borderRadius:12, border:'1px solid rgba(0,0,0,.07)', overflow:'hidden' }}>
              <table style={{ width:'100%', borderCollapse:'collapse' }}>
                <thead>
                  <tr>
                    {['Photo','Name','Role','Order','Visible','Actions'].map(h => (
                      <th key={h} style={{ textAlign:'left', padding:'12px 16px', fontSize:11, fontWeight:700, letterSpacing:'.12em', color:'#6b8070', borderBottom:'1px solid rgba(0,0,0,.08)', background:'#f7f9f7' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {leaders.length === 0 ? (
                    <tr><td colSpan={6} style={{ textAlign:'center', padding:'40px', color:'#aaa' }}>No leaders yet. Add your first one above.</td></tr>
                  ) : leaders.map(l => (
                    <tr key={l.id} style={{ borderBottom:'1px solid rgba(0,0,0,.05)' }}>
                      <td style={{ padding:'14px 16px' }}>
                        {l.imageUrl
                          ? <img src={l.imageUrl} alt={l.name} style={{ width:40, height:40, borderRadius:'50%', objectFit:'cover', border:'2px solid #c9a84c' }} />
                          : <div style={{ width:40, height:40, borderRadius:'50%', background:'#1a4731', display:'flex', alignItems:'center', justifyContent:'center', color:'#c9a84c', fontFamily:'Georgia,serif', fontWeight:700, fontSize:14 }}>{(l.name||'?')[0]}</div>
                        }
                      </td>
                      <td style={{ padding:'14px 16px', fontWeight:600, color:'#0d2b1a', fontSize:14 }}>{l.name}</td>
                      <td style={{ padding:'14px 16px', fontSize:13, color:'#6b8070' }}>{l.role}</td>
                      <td style={{ padding:'14px 16px', fontSize:13, color:'#6b8070', textAlign:'center' }}>{l.orderIndex||0}</td>
                      <td style={{ padding:'14px 16px' }}>
                        <span style={{ fontSize:10, fontWeight:700, letterSpacing:'.1em', padding:'3px 10px', borderRadius:20, background:l.isActive!==false?'rgba(37,96,64,.1)':'rgba(192,57,43,.1)', color:l.isActive!==false?'#1a4731':'#c0392b' }}>
                          {l.isActive!==false?'VISIBLE':'HIDDEN'}
                        </span>
                      </td>
                      <td style={{ padding:'14px 16px' }}>
                        <div style={{ display:'flex', gap:8 }}>
                          <button onClick={()=>openEdit(l)} style={{ background:'rgba(37,96,64,.1)', color:'#1a4731', border:'none', padding:'7px 14px', borderRadius:5, cursor:'pointer', fontSize:12, fontFamily:"'Lato',sans-serif", fontWeight:700 }}>Edit</button>
                          <button onClick={()=>handleDelete(l)} style={{ background:'rgba(192,57,43,.1)', color:'#c0392b', border:'none', padding:'7px 14px', borderRadius:5, cursor:'pointer', fontSize:12, fontFamily:"'Lato',sans-serif", fontWeight:700 }}>Remove</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminLeaders;