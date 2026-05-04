import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import mediaService from '../../services/mediaService';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminMedia = () => {
  const [media,    setMedia]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [uploading,setUploading]= useState(false);
  const [filter,   setFilter]   = useState('ALL');
  const [form,     setForm]     = useState({ title:'', category:'EVENTS', mediaType:'IMAGE' });
  const fileRef = useRef(null);

  const load = async () => {
    try { setLoading(true); const d = await mediaService.getAll({ page:0, size:100 }); setMedia(d.content||d||[]); }
    catch {} finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    const file = fileRef.current?.files[0];
    if (!file) { alert('Please select a file.'); return; }
    const fd = new FormData();
    fd.append('file', file);
    fd.append('title', form.title || file.name);
    fd.append('category', form.category);
    fd.append('mediaType', form.mediaType);
    setUploading(true);
    try {
      await mediaService.upload(fd);
      await load();
      setForm({ title:'', category:'EVENTS', mediaType:'IMAGE' });
      if (fileRef.current) fileRef.current.value = '';
    } catch (err) {
      alert(typeof err==='string' ? err : 'Upload failed. Check file size and type.');
    } finally { setUploading(false); }
  };

  const handleDelete = async (m) => {
    if (!window.confirm(`Delete "${m.title}"?`)) return;
    try { await mediaService.remove(m.mediaId); await load(); }
    catch { alert('Delete failed.'); }
  };

  const TYPES = ['ALL','IMAGE','VIDEO','DOCUMENT'];
  const filtered = filter==='ALL' ? media : media.filter(m=>m.mediaType===filter);

  const inputStyle = { width:'100%', padding:'11px 14px', border:'1.5px solid rgba(26,71,49,.2)', borderRadius:6, fontSize:14, outline:'none', fontFamily:"'Lato',sans-serif", boxSizing:'border-box', background:'#fff' };
  const labelStyle = { display:'block', fontSize:11, fontWeight:700, letterSpacing:'.12em', color:'#3d5247', marginBottom:7 };

  return (
    <AdminLayout>
      <h1 style={{ fontFamily:'Georgia,serif', fontSize:28, color:'#0d2b1a', marginBottom:24 }}>Media Library</h1>

      {/* Upload form */}
      <div style={{ background:'#fff', borderRadius:12, padding:'24px', border:'1px solid rgba(0,0,0,.07)', marginBottom:28 }}>
        <h2 style={{ fontFamily:'Georgia,serif', fontSize:20, color:'#0d2b1a', marginBottom:18 }}>Upload New File</h2>
        <form onSubmit={handleUpload}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:14, marginBottom:14 }}>
            <div>
              <label style={labelStyle}>TITLE</label>
              <input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="File title" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>TYPE</label>
              <select value={form.mediaType} onChange={e=>setForm({...form,mediaType:e.target.value})} style={inputStyle}>
                {['IMAGE','VIDEO','DOCUMENT'].map(t=><option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>CATEGORY</label>
              <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} style={inputStyle}>
                {['EVENTS','WORSHIP','YOUTH','COMMUNITY','GENERAL'].map(c=>
                  <option key={c} value={c}>{c}</option>
                )}
              </select>
            </div>
            <div>
              <label style={labelStyle}>FILE *</label>
              <input type="file" ref={fileRef} accept="image/*,video/*,.pdf,.doc,.docx"
                style={{ ...inputStyle, padding:'9px 14px', cursor:'pointer' }} />
            </div>
          </div>
          <button type="submit" disabled={uploading} style={{ background:'#1a4731', color:'#fff', border:'none', padding:'12px 28px', borderRadius:8, fontFamily:"'Lato',sans-serif", fontSize:14, fontWeight:700, cursor:'pointer', opacity:uploading?.7:1 }}>
            {uploading ? 'Uploading…' : 'Upload File'}
          </button>
        </form>
      </div>

      {/* Filter + grid */}
      <div style={{ display:'flex', gap:8, marginBottom:20 }}>
        {TYPES.map(t=><button key={t} onClick={()=>setFilter(t)} style={{ padding:'9px 16px', borderRadius:20, border:'1px solid rgba(26,71,49,.2)', background:filter===t?'#1a4731':'#fff', color:filter===t?'#fff':'#3d5247', fontFamily:"'Lato',sans-serif", fontSize:12, cursor:'pointer', transition:'all .2s' }}>{t}</button>)}
      </div>

      {loading ? <LoadingSpinner /> : filtered.length===0 ? (
        <div style={{ textAlign:'center', padding:'60px', color:'#aaa' }}>No media files yet. Upload one above.</div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:16 }}>
          {filtered.map(m => (
            <div key={m.mediaId} style={{ background:'#fff', borderRadius:10, overflow:'hidden', border:'1px solid rgba(0,0,0,.07)' }}>
              <div style={{ height:140, background:'linear-gradient(135deg,#1a4731,#40916c)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:40 }}>
                {m.mediaType==='IMAGE'?'🖼':m.mediaType==='VIDEO'?'🎬':'📄'}
              </div>
              <div style={{ padding:'14px' }}>
                <div style={{ fontWeight:600, fontSize:13, color:'#0d2b1a', marginBottom:4, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{m.title}</div>
                <div style={{ fontSize:11, color:'#aaa', marginBottom:10 }}>{m.category} · {m.mediaType}</div>
                <button onClick={()=>handleDelete(m)} style={{ width:'100%', background:'rgba(192,57,43,.1)', color:'#c0392b', border:'none', padding:'8px', borderRadius:5, cursor:'pointer', fontSize:12, fontFamily:"'Lato',sans-serif", fontWeight:700 }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminMedia;