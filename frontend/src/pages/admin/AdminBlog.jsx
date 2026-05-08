import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import blogService from '../../services/blogService';
import mediaService from '../../services/mediaService';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const EMPTY_POST = { title:'', excerpt:'', content:'', category:'GENERAL', status:'PUBLISHED', featuredImageUrl:'' };
const POST_CATS = ['ANNOUNCEMENT','COMMUNITY','DEVOTIONAL','GENERAL','TESTIMONY','YOUTH'];

const AdminBlog = () => {
  const [posts,   setPosts]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form,    setForm]    = useState(EMPTY_POST);
  const [saving,  setSaving]  = useState(false);
  const [msg,     setMsg]     = useState(null);

  // Image picker state
  const [showPicker,  setShowPicker]  = useState(false);
  const [mediaImages, setMediaImages] = useState([]);
  const [pickerLoading, setPickerLoading] = useState(false);

  const load = async () => {
    try { 
      setLoading(true); 
      const d = await blogService.getAll({ page:0, size:100 }); 
      setPosts(d.content||d||[]); 
    } catch {} 
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openNew  = () => { setForm(EMPTY_POST); setEditing('new'); setMsg(null); };
  const openEdit = (p) => { setForm(p); setEditing(p); setMsg(null); };
  const cancel   = () => { setEditing(null); setMsg(null); };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      editing==='new' 
        ? await blogService.create(form) 
        : await blogService.update(editing.postId, form);
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

  // Open the image picker and load images from Media Library
  const openPicker = async () => {
    setPickerLoading(true);
    setShowPicker(true);
    try {
      // Call without params — matches your mediaService.getAll() signature
      const data = await mediaService.getAll();
      const all = Array.isArray(data) ? data : (data.content || data || []);
      setMediaImages(all.filter(m => m.mediaType === 'IMAGE' && !m.isYoutubeVideo));
    } catch (err) {
      console.error('Media load error:', err);
      // Don't close the modal — show the empty state instead
      setMediaImages([]);
    } finally {
      setPickerLoading(false);
    }
  };

  const pickImage = (item) => {
    setForm({ ...form, featuredImageUrl: item.fileUrl });
    setShowPicker(false);
  };

  // Helper — turns a relative /api/v1/media/files/... URL into an absolute URL
  const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `http://localhost:8080${url}`;
  };

  const inputStyle = { width:'100%', padding:'11px 14px', border:'1.5px solid rgba(26,71,49,.2)', borderRadius:6, fontSize:14, outline:'none', fontFamily:"'Lato',sans-serif", boxSizing:'border-box' };
  const labelStyle = { display:'block', fontSize:11, fontWeight:700, letterSpacing:'.12em', color:'#3d5247', marginBottom:7 };

  return (
      <AdminLayout>
  
        {/* ════════════════════════════════════════
            IMAGE PICKER MODAL
        ════════════════════════════════════════ */}
        {showPicker && (
          <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.65)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
            <div style={{ background:'#fff', borderRadius:14, width:'100%', maxWidth:720, maxHeight:'82vh', overflow:'hidden', display:'flex', flexDirection:'column', boxShadow:'0 24px 64px rgba(0,0,0,.3)' }}>
  
              {/* Modal header */}
              <div style={{ padding:'20px 24px', borderBottom:'1px solid rgba(0,0,0,.08)', display:'flex', justifyContent:'space-between', alignItems:'center', flexShrink:0 }}>
                <div>
                  <h3 style={{ fontFamily:'Georgia,serif', fontSize:20, color:'#0d2b1a', marginBottom:2 }}>Pick Featured Image</h3>
                  <p style={{ fontSize:12, color:'#6b8070' }}>Click an image to use it as the blog post's featured photo</p>
                </div>
                <button onClick={() => setShowPicker(false)} style={{ background:'transparent', border:'1px solid rgba(0,0,0,.15)', borderRadius:6, width:32, height:32, cursor:'pointer', color:'#6b8070', fontSize:16, display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
              </div>
  
              {/* Modal body */}
              <div style={{ overflowY:'auto', padding:20, flex:1 }}>
                {pickerLoading ? (
                  <div style={{ display:'flex', justifyContent:'center', padding:40 }}><LoadingSpinner /></div>
                ) : mediaImages.length === 0 ? (
                  <div style={{ textAlign:'center', padding:'40px 20px', color:'#aaa' }}>
                    <div style={{ fontSize:36, marginBottom:12 }}>🖼</div>
                    <p style={{ fontSize:14, marginBottom:8 }}>No images in your Media Library yet.</p>
                    <p style={{ fontSize:12 }}>Go to <strong>Media</strong> in the sidebar and upload an image first.</p>
                  </div>
                ) : (
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:12 }}>
                    {mediaImages.map(item => (
                      <div
                        key={item.mediaId}
                        onClick={() => pickImage(item)}
                        style={{ cursor:'pointer', borderRadius:8, overflow:'hidden', border:'2px solid transparent', transition:'all .2s', boxShadow:'0 2px 8px rgba(0,0,0,.07)' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor='#c9a84c'; e.currentTarget.style.transform='translateY(-2px)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor='transparent'; e.currentTarget.style.transform='translateY(0)'; }}
                      >
                        <img
                          src={getImageUrl(item.fileUrl)}
                          alt={item.title}
                          style={{ width:'100%', height:110, objectFit:'cover', display:'block' }}
                          onError={e => { e.target.style.display='none'; }}
                        />
                        <div style={{ padding:'6px 8px', background:'#fff', fontSize:11, color:'#3d5247', fontWeight:600, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                          {item.title || item.fileName}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
  
              {/* Modal footer hint */}
              <div style={{ padding:'12px 24px', borderTop:'1px solid rgba(0,0,0,.07)', background:'#f7f9f7', flexShrink:0 }}>
                <p style={{ fontSize:11, color:'#6b8070' }}>
                  💡 Tip: For best results use landscape images (1200×630px). Upload new images in the <strong>Media Library</strong>.
                </p>
              </div>
            </div>
          </div>
        )}
  
        {/* ════════════════════════════════════════
            FORM VIEW
        ════════════════════════════════════════ */}
        {editing ? (
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:28 }}>
              <button onClick={cancel} style={{ background:'transparent', border:'1px solid rgba(0,0,0,.15)', borderRadius:6, padding:'8px 16px', cursor:'pointer', fontSize:13, color:'#6b8070' }}>← Back</button>
              <h1 style={{ fontFamily:'Georgia,serif', fontSize:24, color:'#0d2b1a' }}>{editing==='new' ? 'Write New Post' : 'Edit Post'}</h1>
            </div>
  
            {msg && (
              <div style={{ padding:'12px 16px', borderRadius:6, marginBottom:20, background:msg.type==='success'?'rgba(37,96,64,.1)':'rgba(192,57,43,.08)', border:`1px solid ${msg.type==='success'?'rgba(37,96,64,.3)':'rgba(192,57,43,.3)'}`, color:msg.type==='success'?'#1a4731':'#c0392b', fontSize:13 }}>
                {msg.text}
              </div>
            )}
  
            <form onSubmit={handleSave} style={{ background:'#fff', borderRadius:12, padding:'28px', border:'1px solid rgba(0,0,0,.07)' }}>
  
              {/* Title */}
              <div style={{ marginBottom:16 }}>
                <label style={labelStyle}>TITLE *</label>
                <input required value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Post title" style={inputStyle} />
              </div>
  
              {/* Featured Image — with picker button */}
              <div style={{ marginBottom:16 }}>
                <label style={labelStyle}>FEATURED IMAGE</label>
                <div style={{ display:'flex', gap:8, marginBottom:8 }}>
                  <input
                    value={form.featuredImageUrl || ''}
                    onChange={e => setForm({...form, featuredImageUrl:e.target.value})}
                    placeholder="Paste a URL, or click 'Pick Image' to choose from Media Library"
                    style={{ ...inputStyle, flex:1 }}
                  />
                  <button
                    type="button"
                    onClick={openPicker}
                    style={{ background:'#1a4731', color:'#fff', border:'none', padding:'0 18px', borderRadius:6, cursor:'pointer', fontSize:12, fontWeight:700, fontFamily:"'Lato',sans-serif", whiteSpace:'nowrap', flexShrink:0 }}
                  >
                    📁 Pick Image
                  </button>
                </div>
  
                {/* Preview */}
                {form.featuredImageUrl && (
                  <div style={{ position:'relative', display:'inline-block', width:'100%' }}>
                    <img
                      src={getImageUrl(form.featuredImageUrl)}
                      alt="preview"
                      style={{ width:'100%', maxHeight:200, objectFit:'cover', borderRadius:8, border:'2px solid #c9a84c', display:'block' }}
                      onError={e => e.target.style.display='none'}
                    />
                    <button
                      type="button"
                      onClick={() => setForm({...form, featuredImageUrl:''})}
                      style={{ position:'absolute', top:8, right:8, background:'rgba(192,57,43,.9)', color:'#fff', border:'none', borderRadius:'50%', width:26, height:26, cursor:'pointer', fontSize:13, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center' }}
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
  
              {/* Category + Status */}
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
                    {['DRAFT','PUBLISHED','ARCHIVED'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
  
              {/* Excerpt */}
              <div style={{ marginBottom:16 }}>
                <label style={labelStyle}>EXCERPT <span style={{ color:'#aaa', fontWeight:400 }}>(short summary shown in lists)</span></label>
                <textarea rows={2} value={form.excerpt||''} onChange={e=>setForm({...form,excerpt:e.target.value})} placeholder="Brief summary…" style={{ ...inputStyle, resize:'vertical' }} />
              </div>
  
              {/* Content */}
              <div style={{ marginBottom:22 }}>
                <label style={labelStyle}>FULL CONTENT *</label>
                <textarea required rows={14} value={form.content||''} onChange={e=>setForm({...form,content:e.target.value})} placeholder="Write your full post here…" style={{ ...inputStyle, resize:'vertical', lineHeight:1.7 }} />
              </div>
  
              <div style={{ display:'flex', gap:12 }}>
                <button type="submit" disabled={saving} style={{ background:'#1a4731', color:'#fff', border:'none', padding:'13px 32px', borderRadius:8, fontFamily:"'Lato',sans-serif", fontSize:14, fontWeight:700, cursor:'pointer', opacity:saving ? 0.7 : 1 }}>
                  {saving ? 'Saving…' : editing==='new' ? 'Publish Post' : 'Save Changes'}
                </button>
                <button type="button" onClick={cancel} style={{ background:'transparent', border:'1px solid rgba(0,0,0,.18)', color:'#6b8070', padding:'13px 24px', borderRadius:8, fontFamily:"'Lato',sans-serif", fontSize:14, cursor:'pointer' }}>Cancel</button>
              </div>
            </form>
          </div>
  
        ) : (
          /* ════════════════════════════════════════
              LIST VIEW
          ════════════════════════════════════════ */
          <div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24, flexWrap:'wrap', gap:12 }}>
              <h1 style={{ fontFamily:'Georgia,serif', fontSize:28, color:'#0d2b1a' }}>Blog Posts</h1>
              <button onClick={openNew} style={{ background:'#c9a84c', color:'#0d2b1a', border:'none', padding:'12px 24px', borderRadius:8, fontFamily:"'Lato',sans-serif", fontSize:14, fontWeight:700, cursor:'pointer' }}>+ Write Post</button>
            </div>
  
            {loading ? <LoadingSpinner /> : (
              <div style={{ background:'#fff', borderRadius:12, border:'1px solid rgba(0,0,0,.07)', overflow:'hidden' }}>
                <table className="admin-table">
                  <thead>
                    <tr><th>Title</th><th>Category</th><th>Status</th><th>Published</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {posts.length === 0 ? (
                      <tr><td colSpan={5} style={{ textAlign:'center', padding:'40px', color:'#aaa' }}>No posts yet.</td></tr>
                    ) : posts.map(p => (
                      <tr key={p.postId}>
                        <td>
                          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                            {p.featuredImageUrl && (
                              <img src={p.featuredImageUrl} alt="" style={{ width:36, height:36, borderRadius:4, objectFit:'cover', flexShrink:0, border:'1px solid rgba(0,0,0,.08)' }} onError={e=>e.target.style.display='none'} />
                            )}
                            <div>
                              <div style={{ fontWeight:600, color:'#0d2b1a' }}>{p.title}</div>
                              <div style={{ fontSize:12, color:'#aaa' }}>{(p.excerpt||'').slice(0,55)}{p.excerpt?.length>55?'…':''}</div>
                            </div>
                          </div>
                        </td>
                        <td><span className="badge" style={{ background:'rgba(37,96,64,.1)', color:'#1a4731' }}>{p.category}</span></td>
                        <td><span className="badge" style={{ background:p.status==='PUBLISHED'?'rgba(37,96,64,.1)':'rgba(146,64,14,.1)', color:p.status==='PUBLISHED'?'#1a4731':'#92400e' }}>{p.status}</span></td>
                        <td style={{ fontSize:13 }}>{p.publishedAt ? new Date(p.publishedAt).toLocaleDateString('en-ZA') : '—'}</td>
                        <td>
                          <div style={{ display:'flex', gap:8 }}>
                            <button onClick={()=>openEdit(p)} style={{ background:'rgba(37,96,64,.1)', color:'#1a4731', border:'none', padding:'7px 14px', borderRadius:5, cursor:'pointer', fontSize:12, fontFamily:"'Lato',sans-serif", fontWeight:700 }}>Edit</button>
                            <button onClick={()=>handleDelete(p)} style={{ background:'rgba(192,57,43,.1)', color:'#c0392b', border:'none', padding:'7px 14px', borderRadius:5, cursor:'pointer', fontSize:12, fontFamily:"'Lato',sans-serif", fontWeight:700 }}>Delete</button>
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

export default AdminBlog;