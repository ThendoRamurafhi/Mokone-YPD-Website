import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import blogService from '../../services/blogService';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const EMPTY_POST = { title:'', excerpt:'', content:'', category:'NEWS', status:'PUBLISHED' };
const POST_CATS  = ['ANNOUNCEMENT','SERMON','TESTIMONY','NEWS','RESOURCE'];

const AdminBlog = () => {
  const [posts,   setPosts]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form,    setForm]    = useState(EMPTY_POST);
  const [saving,  setSaving]  = useState(false);
  const [msg,     setMsg]     = useState(null);

  const load = async () => {
    try { setLoading(true); const d = await blogService.getAll({ page:0, size:100 }); setPosts(d.content||d||[]); }
    catch {} finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openNew  = () => { setForm(EMPTY_POST); setEditing('new'); setMsg(null); };
  const openEdit = (p) => { setForm(p); setEditing(p); setMsg(null); };
  const cancel   = () => { setEditing(null); setMsg(null); };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      editing==='new' ? await blogService.create(form) : await blogService.update(editing.postId, form);
      setMsg({ type:'success', text:'Post saved!' });
      await load();
      setTimeout(() => { setEditing(null); setMsg(null); }, 1000);
    } catch (err) {
      setMsg({ type:'error', text: typeof err==='string' ? err : 'Save failed.' });
    } finally { setSaving(false); }
  };

  const handleDelete = async (p) => {
    if (!window.confirm(`Delete "${p.title}"?`)) return;
    try { await blogService.remove(p.postId); await load(); }
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
            <h1 style={{ fontFamily:'Georgia,serif', fontSize:24, color:'#0d2b1a' }}>{editing==='new'?'Write New Post':'Edit Post'}</h1>
          </div>
          {msg && <div style={{ padding:'12px 16px', borderRadius:6, marginBottom:20, background:msg.type==='success'?'rgba(37,96,64,.1)':'rgba(192,57,43,.08)', border:`1px solid ${msg.type==='success'?'rgba(37,96,64,.3)':'rgba(192,57,43,.3)'}`, color:msg.type==='success'?'#1a4731':'#c0392b', fontSize:13 }}>{msg.text}</div>}
          <form onSubmit={handleSave} style={{ background:'#fff', borderRadius:12, padding:'28px', border:'1px solid rgba(0,0,0,.07)' }}>
            <div style={{ marginBottom:16 }}>
              <label style={labelStyle}>TITLE *</label>
              <input required value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Post title" style={inputStyle} />
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>
              <div>
                <label style={labelStyle}>CATEGORY</label>
                <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} style={{ ...inputStyle, background:'#fff' }}>
                  {POST_CATS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>STATUS</label>
                <select value={form.status||'PUBLISHED'} onChange={e=>setForm({...form,status:e.target.value})} style={{ ...inputStyle, background:'#fff' }}>
                  {['DRAFT','PUBLISHED','ARCHIVED'].map(s=><option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div style={{ marginBottom:16 }}>
              <label style={labelStyle}>EXCERPT (short summary shown in lists)</label>
              <textarea rows={2} value={form.excerpt||''} onChange={e=>setForm({...form,excerpt:e.target.value})} placeholder="Brief summary…" style={{ ...inputStyle, resize:'vertical' }} />
            </div>
            <div style={{ marginBottom:22 }}>
              <label style={labelStyle}>FULL CONTENT *</label>
              <textarea required rows={12} value={form.content||''} onChange={e=>setForm({...form,content:e.target.value})} placeholder="Write your full post here…" style={{ ...inputStyle, resize:'vertical', lineHeight:1.7 }} />
            </div>
            <div style={{ display:'flex', gap:12 }}>
              <button type="submit" disabled={saving} style={{ background:'#1a4731', color:'#fff', border:'none', padding:'13px 32px', borderRadius:8, fontFamily:"'Lato',sans-serif", fontSize:14, fontWeight:700, cursor:'pointer', opacity:saving?.7:1 }}>
                {saving ? 'Saving…' : editing==='new' ? 'Publish Post' : 'Save Changes'}
              </button>
              <button type="button" onClick={cancel} style={{ background:'transparent', border:'1px solid rgba(0,0,0,.18)', color:'#6b8070', padding:'13px 24px', borderRadius:8, fontFamily:"'Lato',sans-serif", fontSize:14, cursor:'pointer' }}>Cancel</button>
            </div>
          </form>
        </div>
      ) : (
        <div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24, flexWrap:'wrap', gap:12 }}>
            <h1 style={{ fontFamily:'Georgia,serif', fontSize:28, color:'#0d2b1a' }}>Blog Posts</h1>
            <button onClick={openNew} style={{ background:'#c9a84c', color:'#0d2b1a', border:'none', padding:'12px 24px', borderRadius:8, fontFamily:"'Lato',sans-serif", fontSize:14, fontWeight:700, cursor:'pointer' }}>+ Write Post</button>
          </div>
          {loading ? <LoadingSpinner /> : (
            <div style={{ background:'#fff', borderRadius:12, border:'1px solid rgba(0,0,0,.07)', overflow:'hidden' }}>
              <table className="admin-table">
                <thead><tr><th>Title</th><th>Category</th><th>Status</th><th>Published</th><th>Actions</th></tr></thead>
                <tbody>
                  {posts.length===0 ? <tr><td colSpan={5} style={{ textAlign:'center', padding:'40px', color:'#aaa' }}>No posts yet.</td></tr>
                  : posts.map(p=>(
                    <tr key={p.postId}>
                      <td><div style={{ fontWeight:600, color:'#0d2b1a' }}>{p.title}</div><div style={{ fontSize:12, color:'#aaa' }}>{(p.excerpt||'').slice(0,60)}…</div></td>
                      <td><span className="badge" style={{ background:'rgba(37,96,64,.1)', color:'#1a4731' }}>{p.category}</span></td>
                      <td><span className="badge" style={{ background:p.status==='PUBLISHED'?'rgba(37,96,64,.1)':'rgba(146,64,14,.1)', color:p.status==='PUBLISHED'?'#1a4731':'#92400e' }}>{p.status}</span></td>
                      <td style={{ fontSize:13 }}>{p.publishedAt ? new Date(p.publishedAt).toLocaleDateString('en-ZA') : '—'}</td>
                      <td><div style={{ display:'flex', gap:8 }}>
                        <button onClick={()=>openEdit(p)} style={{ background:'rgba(37,96,64,.1)', color:'#1a4731', border:'none', padding:'7px 14px', borderRadius:5, cursor:'pointer', fontSize:12, fontFamily:"'Lato',sans-serif", fontWeight:700 }}>Edit</button>
                        <button onClick={()=>handleDelete(p)} style={{ background:'rgba(192,57,43,.1)', color:'#c0392b', border:'none', padding:'7px 14px', borderRadius:5, cursor:'pointer', fontSize:12, fontFamily:"'Lato',sans-serif", fontWeight:700 }}>Delete</button>
                      </div></td>
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

export default AdminBlog;