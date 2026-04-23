import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import eventService from '../../services/eventService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useAuth } from '../../hooks/useAuth';

const EMPTY_EVENT = { title:'', description:'', eventDate:'', eventTime:'', location:'', category:'COMMUNITY', maxAttendees:'', isPublic:true, status:'PUBLISHED' };
const CATEGORIES  = ['CONFERENCE','YOUTH','COMMUNITY','WORSHIP','EDUCATIONAL'];

const AdminEvents = () => {
  const [events,  setEvents]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [editing, setEditing] = useState(null);   // null = list view, 'new' or event object = form
  const [form,    setForm]    = useState(EMPTY_EVENT);
  const [saving,  setSaving]  = useState(false);
  const [msg,     setMsg]     = useState(null);
  const { user } = useAuth();

  const load = async () => {
    try { setLoading(true); const d = await eventService.getAll({ page:0, size:100 }); setEvents(d.content||d||[]); }
    catch { setError('Failed to load events.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openNew  = () => { setForm(EMPTY_EVENT); setEditing('new'); setMsg(null); };
  const openEdit = (ev) => { setForm({ ...ev, eventDate: ev.eventDate?.slice(0,10)||'', maxAttendees: ev.maxAttendees||'' }); setEditing(ev); setMsg(null); };
  const cancel   = () => { setEditing(null); setMsg(null); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing === 'new') {
        await eventService.create({ ...form, createdBy: user?.userId });
        setMsg({ type:'success', text:'Event created successfully!' });
      } else {
        await eventService.update(editing.eventId, form);
        setMsg({ type:'success', text:'Event updated successfully!' });
      }
      await load();
      setTimeout(() => { setEditing(null); setMsg(null); }, 1200);
    } catch (err) {
      setMsg({ type:'error', text: typeof err==='string' ? err : 'Save failed. Please try again.' });
    } finally { setSaving(false); }
  };

  const handleDelete = async (ev) => {
    if (!window.confirm(`Delete "${ev.title}"? This cannot be undone.`)) return;
    try { await eventService.remove(ev.eventId); await load(); }
    catch { alert('Delete failed. Please try again.'); }
  };

  const inputStyle = { width:'100%', padding:'11px 14px', border:'1.5px solid rgba(26,71,49,.2)', borderRadius:6, fontSize:14, outline:'none', fontFamily:"'Lato',sans-serif", boxSizing:'border-box' };
  const labelStyle = { display:'block', fontSize:11, fontWeight:700, letterSpacing:'.12em', color:'#3d5247', marginBottom:7 };

  return (
    <AdminLayout>
      {editing ? (
        /* ── FORM VIEW ── */
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:28 }}>
            <button onClick={cancel} style={{ background:'transparent', border:'1px solid rgba(0,0,0,.15)', borderRadius:6, padding:'8px 16px', cursor:'pointer', fontSize:13, color:'#6b8070' }}>← Back</button>
            <h1 style={{ fontFamily:'Georgia,serif', fontSize:24, color:'#0d2b1a' }}>{editing==='new'?'Create New Event':'Edit Event'}</h1>
          </div>

          {msg && <div style={{ padding:'12px 16px', borderRadius:6, marginBottom:20, background:msg.type==='success'?'rgba(37,96,64,.1)':'rgba(192,57,43,.08)', border:`1px solid ${msg.type==='success'?'rgba(37,96,64,.3)':'rgba(192,57,43,.3)'}`, color:msg.type==='success'?'#1a4731':'#c0392b', fontSize:13 }}>{msg.text}</div>}

          <form onSubmit={handleSave} style={{ background:'#fff', borderRadius:12, padding:'28px', border:'1px solid rgba(0,0,0,.07)' }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:18, marginBottom:0 }}>
              <div style={{ gridColumn:'span 2', marginBottom:16 }}>
                <label style={labelStyle}>EVENT TITLE *</label>
                <input required value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Youth Conference 2026" style={inputStyle} />
              </div>
              <div style={{ marginBottom:16 }}>
                <label style={labelStyle}>DATE *</label>
                <input type="date" required value={form.eventDate} onChange={e=>setForm({...form,eventDate:e.target.value})} style={inputStyle} />
              </div>
              <div style={{ marginBottom:16 }}>
                <label style={labelStyle}>TIME</label>
                <input type="time" value={form.eventTime||''} onChange={e=>setForm({...form,eventTime:e.target.value})} style={inputStyle} />
              </div>
              <div style={{ marginBottom:16 }}>
                <label style={labelStyle}>LOCATION *</label>
                <input required value={form.location||''} onChange={e=>setForm({...form,location:e.target.value})} placeholder="Main Church Hall, Pretoria" style={inputStyle} />
              </div>
              <div style={{ marginBottom:16 }}>
                <label style={labelStyle}>CATEGORY</label>
                <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} style={{ ...inputStyle, background:'#fff' }}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div style={{ marginBottom:16 }}>
                <label style={labelStyle}>MAX ATTENDEES (leave blank for unlimited)</label>
                <input type="number" min="1" value={form.maxAttendees||''} onChange={e=>setForm({...form,maxAttendees:e.target.value})} placeholder="100" style={inputStyle} />
              </div>
              <div style={{ marginBottom:16 }}>
                <label style={labelStyle}>STATUS</label>
                <select value={form.status||'PUBLISHED'} onChange={e=>setForm({...form,status:e.target.value})} style={{ ...inputStyle, background:'#fff' }}>
                  {['DRAFT','PUBLISHED','CANCELLED'].map(s=><option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div style={{ gridColumn:'span 2', marginBottom:16 }}>
                <label style={labelStyle}>DESCRIPTION</label>
                <textarea rows={4} value={form.description||''} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Describe the event…" style={{ ...inputStyle, resize:'vertical' }} />
              </div>
              <div style={{ gridColumn:'span 2', display:'flex', alignItems:'center', gap:10 }}>
                <input type="checkbox" id="isPublic" checked={form.isPublic!==false} onChange={e=>setForm({...form,isPublic:e.target.checked})} />
                <label htmlFor="isPublic" style={{ fontSize:14, color:'#3d5247', cursor:'pointer' }}>Visible to the public</label>
              </div>
            </div>

            <div style={{ display:'flex', gap:12, marginTop:24 }}>
              <button type="submit" disabled={saving} style={{ background:'#1a4731', color:'#fff', border:'none', padding:'13px 32px', borderRadius:8, fontFamily:"'Lato',sans-serif", fontSize:14, fontWeight:700, cursor:'pointer', opacity:saving?.7:1 }}>
                {saving ? 'Saving…' : editing==='new' ? 'Create Event' : 'Save Changes'}
              </button>
              <button type="button" onClick={cancel} style={{ background:'transparent', border:'1px solid rgba(0,0,0,.18)', color:'#6b8070', padding:'13px 24px', borderRadius:8, fontFamily:"'Lato',sans-serif", fontSize:14, cursor:'pointer' }}>Cancel</button>
            </div>
          </form>
        </div>
      ) : (
        /* ── LIST VIEW ── */
        <div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24, flexWrap:'wrap', gap:12 }}>
            <h1 style={{ fontFamily:'Georgia,serif', fontSize:28, color:'#0d2b1a' }}>Events</h1>
            <button onClick={openNew} style={{ background:'#c9a84c', color:'#0d2b1a', border:'none', padding:'12px 24px', borderRadius:8, fontFamily:"'Lato',sans-serif", fontSize:14, fontWeight:700, cursor:'pointer' }}>+ Create Event</button>
          </div>

          {loading ? <LoadingSpinner /> : error ? <p style={{ color:'#c0392b' }}>{error}</p> : (
            <div style={{ background:'#fff', borderRadius:12, border:'1px solid rgba(0,0,0,.07)', overflow:'hidden' }}>
              <table className="admin-table">
                <thead>
                  <tr><th>Event</th><th>Date</th><th>Category</th><th>Attendees</th><th>Status</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {events.length === 0 ? (
                    <tr><td colSpan={6} style={{ textAlign:'center', padding:'40px', color:'#aaa' }}>No events yet. Create your first one above.</td></tr>
                  ) : events.map(ev => (
                    <tr key={ev.eventId}>
                      <td>
                        <div style={{ fontWeight:600, color:'#0d2b1a' }}>{ev.title}</div>
                        <div style={{ fontSize:12, color:'#aaa' }}>📍 {ev.location}</div>
                      </td>
                      <td style={{ whiteSpace:'nowrap' }}>{ev.eventDate}</td>
                      <td><span className="badge" style={{ background:'rgba(26,71,49,.1)', color:'#1a4731' }}>{ev.category}</span></td>
                      <td>{ev.currentAttendees||0}{ev.maxAttendees ? ` / ${ev.maxAttendees}` : ''}</td>
                      <td><span className="badge" style={{ background:ev.status==='PUBLISHED'?'rgba(37,96,64,.1)':ev.status==='DRAFT'?'rgba(146,64,14,.1)':'rgba(192,57,43,.1)', color:ev.status==='PUBLISHED'?'#1a4731':ev.status==='DRAFT'?'#92400e':'#c0392b' }}>{ev.status}</span></td>
                      <td>
                        <div style={{ display:'flex', gap:8 }}>
                          <button onClick={()=>openEdit(ev)} style={{ background:'rgba(37,96,64,.1)', color:'#1a4731', border:'none', padding:'7px 14px', borderRadius:5, cursor:'pointer', fontSize:12, fontFamily:"'Lato',sans-serif", fontWeight:700 }}>Edit</button>
                          <button onClick={()=>handleDelete(ev)} style={{ background:'rgba(192,57,43,.1)', color:'#c0392b', border:'none', padding:'7px 14px', borderRadius:5, cursor:'pointer', fontSize:12, fontFamily:"'Lato',sans-serif", fontWeight:700 }}>Delete</button>
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

export default AdminEvents;