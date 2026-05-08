import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import mediaService from '../../services/mediaService';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminMedia = () => {
  const [media, setMedia]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [uploading, setUploading]   = useState(false);
  const [filter, setFilter]         = useState('ALL');
  const [uploadMode, setUploadMode] = useState('FILE'); // FILE or YOUTUBE
  const [copiedId, setCopiedId]     = useState(null); // tracks which card was just copied
  const [authError,  setAuthError]  = useState(null); // surfaces 403 clearly
  
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'EVENTS',
    usage: 'GALLERY',
    mediaType: 'IMAGE'
  });
  
  const [youtubeForm, setYoutubeForm] = useState({
    youtubeUrl: '',
    title: '',
    description: '',
    category: 'EVENTS',
    usage: 'GALLERY'
  });

  const fileRef = useRef(null);

  // ══════════════════════════════════════════════════════════════
  // LOAD MEDIA
  // ══════════════════════════════════════════════════════════════
  
  const load = async () => {
    try {
      setLoading(true);
      const data = await mediaService.getAll();
      setMedia(Array.isArray(data) ? data : data.content || []);
    } catch (error) {
      console.error('Failed to load media:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // ══════════════════════════════════════════════════════════════
  // HANDLE FILE UPLOAD
  // ══════════════════════════════════════════════════════════════
  
  const handleFileUpload = async (e) => {
    e.preventDefault();
    setAuthError(null);
    const file = fileRef.current?.files[0];
    
    if (!file) {
      alert('Please select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', form.title || file.name);
    formData.append('description', form.description || '');
    formData.append('category', form.category);
    formData.append('usage', form.usage);
    formData.append('uploadedBy', 'Admin'); // TODO: Get from auth context

    setUploading(true);
    try {
      await mediaService.upload(formData);
      await load();
      
      // Reset form
      setForm({
        title: '',
        description: '',
        category: 'EVENTS',
        usage: 'GALLERY',
        mediaType: 'IMAGE'
      });
      if (fileRef.current) fileRef.current.value = '';
      
      alert('File uploaded successfully!');
    } catch (error) {
      const msg = typeof err === 'string' ? err : 'Upload failed';
      // Surface 403 with a helpful message
      if (msg.toLowerCase().includes('access denied') || msg.includes('403')) {
        setAuthError(
          '⚠️ Upload blocked (403). Your account may not have ADMIN role. ' +
          'Open browser console and run: JSON.parse(localStorage.getItem("user"))'
        );
      } else {
        alert(msg);
      }
    } finally {
      setUploading(false);
    }
  };

  // ══════════════════════════════════════════════════════════════
  // HANDLE YOUTUBE VIDEO SAVE
  // ══════════════════════════════════════════════════════════════
  
  const handleYoutubeSubmit = async (e) => {
    e.preventDefault();
    
    const videoId = mediaService.extractYoutubeId(youtubeForm.youtubeUrl);
    if (!videoId) {
      alert('Invalid YouTube URL. Please paste a valid YouTube video link.');
      return;
    }

    setUploading(true);
    try {
      await mediaService.saveYoutubeVideo({
        youtubeVideoId: videoId,
        title: youtubeForm.title || 'YouTube Video',
        description: youtubeForm.description || '',
        category: youtubeForm.category,
        usage: youtubeForm.usage,
        uploadedBy: 'Admin'
      });
      
      await load();
      
      // Reset form
      setYoutubeForm({
        youtubeUrl: '',
        title: '',
        description: '',
        category: 'EVENTS',
        usage: 'GALLERY'
      });
      
      alert('YouTube video added successfully!');
    } catch (error) {
      alert(typeof error === 'string' ? error : 'Failed to save YouTube video');
    } finally {
      setUploading(false);
    }
  };

  // ══════════════════════════════════════════════════════════════
  // HANDLE DELETE
  // ══════════════════════════════════════════════════════════════
  
  const handleDelete = async (item) => {
    if (!window.confirm(`Delete "${item.title}"?`)) return;
    
    try {
      await mediaService.remove(item.mediaId);
      await load();
    } catch (error) {
      alert('Delete failed.');
    }
  };

  // ══════════════════════════════════════════════════════════════
  // ── Copy image URL to clipboard ──
  // ══════════════════════════════════════════════════════════════

  const handleCopyUrl = (item) => {
    if (!item.fileUrl) { alert('This item has no file URL to copy.'); return; }
    navigator.clipboard.writeText(item.fileUrl).then(() => {
      setCopiedId(item.mediaId);
      setTimeout(() => setCopiedId(null), 2000);
    }).catch(() => {
      // Fallback for browsers that block clipboard
      prompt('Copy this URL:', item.fileUrl);
    });
  };

  // Add this helper at the top of AdminMedia.jsx and MediaPage.jsx
  const getImageUrl = (url) => {
    if (!url) return null;
    // If already full URL, return as-is
    if (url.startsWith('http')) return url;
    // If relative, prepend backend base URL
    return `http://localhost:8080${url}`;
  };

  // ══════════════════════════════════════════════════════════════
  // FILTER MEDIA
  // ══════════════════════════════════════════════════════════════
  
  const TYPES = ['ALL', 'IMAGE', 'VIDEO', 'DOCUMENT'];
  const filtered = filter === 'ALL' 
    ? media 
    : media.filter(m => m.mediaType === filter);

  // ══════════════════════════════════════════════════════════════
  // STYLES
  // ══════════════════════════════════════════════════════════════
  
  const inputStyle = {
    width: '100%',
    padding: '11px 14px',
    border: '1.5px solid rgba(26,71,49,.2)',
    borderRadius: 6,
    fontSize: 14,
    outline: 'none',
    fontFamily: "'Lato',sans-serif",
    boxSizing: 'border-box',
    background: '#fff'
  };

  const labelStyle = {
    display: 'block',
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '.12em',
    color: '#3d5247',
    marginBottom: 7
  };

  const selectStyle = {
    ...inputStyle,
    cursor: 'pointer'
  };

  return (
      <AdminLayout>
        <h1 style={{ fontFamily: 'Georgia,serif', fontSize: 28, color: '#0d2b1a', marginBottom: 24 }}>
          Media Library
        </h1>
  
        {/* ── UPLOAD SECTION ── */}
        <div style={{ background: '#fff', borderRadius: 12, padding: '24px', border: '1px solid rgba(0,0,0,.07)', marginBottom: 28 }}>
          <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 20, color: '#0d2b1a', marginBottom: 18 }}>Add New Media</h2>
  
          <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
            <button onClick={() => setUploadMode('FILE')} style={{ padding: '10px 24px', borderRadius: 20, border: '1px solid rgba(26,71,49,.2)', background: uploadMode === 'FILE' ? '#1a4731' : '#fff', color: uploadMode === 'FILE' ? '#fff' : '#3d5247', fontFamily: "'Lato',sans-serif", fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all .2s' }}>
              📁 Upload File
            </button>
            <button onClick={() => setUploadMode('YOUTUBE')} style={{ padding: '10px 24px', borderRadius: 20, border: '1px solid rgba(26,71,49,.2)', background: uploadMode === 'YOUTUBE' ? '#c0392b' : '#fff', color: uploadMode === 'YOUTUBE' ? '#fff' : '#3d5247', fontFamily: "'Lato',sans-serif", fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all .2s' }}>
              ▶️ Add YouTube Video
            </button>
          </div>
  
          {/* FILE UPLOAD FORM */}
          {uploadMode === 'FILE' && (
            <form onSubmit={handleFileUpload}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 14, marginBottom: 14 }}>
                <div>
                  <label style={labelStyle}>TITLE</label>
                  <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Media title" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>CATEGORY *</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={selectStyle} required>
                    <option value="EVENTS">Events</option>
                    <option value="WORSHIP">Worship</option>
                    <option value="YOUTH">Youth</option>
                    <option value="COMMUNITY">Community</option>
                    <option value="LEADERSHIP">Leadership</option>
                    <option value="GALLERY">Gallery</option>
                    <option value="HERO_IMAGES">Hero Images</option>
                    <option value="BLOG_IMAGES">Blog Images</option>
                    <option value="STRUCTURE">Structure</option>
                    <option value="ABOUT">About Page</option>
                    <option value="GENERAL">General</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>USAGE *</label>
                  <select value={form.usage} onChange={e => setForm({ ...form, usage: e.target.value })} style={selectStyle} required>
                    <option value="GALLERY">Gallery</option>
                    <option value="BLOG_FEATURED">Blog Featured</option>
                    <option value="BLOG_INLINE">Blog Inline</option>
                    <option value="HERO_SECTION">Hero Section</option>
                    <option value="LEADERSHIP_PROFILE">Leadership Profile</option>
                    <option value="EVENT_COVER">Event Cover</option>
                    <option value="PAGE_HEADER">Page Header</option>
                    <option value="GENERAL">General</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>FILE *</label>
                  <input type="file" ref={fileRef} accept="image/*,video/*,.pdf" style={{ ...inputStyle, padding: '9px 14px', cursor: 'pointer' }} required />
                </div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>DESCRIPTION</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Optional description" rows="3" style={inputStyle} />
              </div>
              <button type="submit" disabled={uploading} style={{ background: '#1a4731', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: 8, fontFamily: "'Lato',sans-serif", fontSize: 14, fontWeight: 700, cursor: 'pointer', opacity: uploading ? 0.7 : 1 }}>
                {uploading ? 'Uploading...' : '📤 Upload File'}
              </button>
            </form>
          )}
  
          {/* YOUTUBE FORM */}
          {uploadMode === 'YOUTUBE' && (
            <form onSubmit={handleYoutubeSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 14, marginBottom: 14 }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>YOUTUBE URL *</label>
                  <input value={youtubeForm.youtubeUrl} onChange={e => setYoutubeForm({ ...youtubeForm, youtubeUrl: e.target.value })} placeholder="https://www.youtube.com/watch?v=..." style={inputStyle} required />
                  <p style={{ fontSize: 11, color: '#6b8070', marginTop: 5 }}>Paste any YouTube video URL or video ID</p>
                </div>
                <div>
                  <label style={labelStyle}>TITLE *</label>
                  <input value={youtubeForm.title} onChange={e => setYoutubeForm({ ...youtubeForm, title: e.target.value })} placeholder="Video title" style={inputStyle} required />
                </div>
                <div>
                  <label style={labelStyle}>CATEGORY *</label>
                  <select value={youtubeForm.category} onChange={e => setYoutubeForm({ ...youtubeForm, category: e.target.value })} style={selectStyle} required>
                    <option value="EVENTS">Events</option>
                    <option value="WORSHIP">Worship</option>
                    <option value="YOUTH">Youth</option>
                    <option value="COMMUNITY">Community</option>
                    <option value="GENERAL">General</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>USAGE *</label>
                  <select value={youtubeForm.usage} onChange={e => setYoutubeForm({ ...youtubeForm, usage: e.target.value })} style={selectStyle} required>
                    <option value="GALLERY">Gallery</option>
                    <option value="HERO_SECTION">Hero Section</option>
                    <option value="GENERAL">General</option>
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>DESCRIPTION</label>
                <textarea value={youtubeForm.description} onChange={e => setYoutubeForm({ ...youtubeForm, description: e.target.value })} placeholder="Optional description" rows="3" style={inputStyle} />
              </div>
              <button type="submit" disabled={uploading} style={{ background: '#c0392b', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: 8, fontFamily: "'Lato',sans-serif", fontSize: 14, fontWeight: 700, cursor: 'pointer', opacity: uploading ? 0.7 : 1 }}>
                {uploading ? 'Saving...' : '▶️ Add YouTube Video'}
              </button>
            </form>
          )}
        </div>
  
        {/* ── FILTER TABS ── */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
          {TYPES.map(t => (
            <button key={t} onClick={() => setFilter(t)} style={{ padding: '9px 16px', borderRadius: 20, border: '1px solid rgba(26,71,49,.2)', background: filter === t ? '#1a4731' : '#fff', color: filter === t ? '#fff' : '#3d5247', fontFamily: "'Lato',sans-serif", fontSize: 12, cursor: 'pointer', transition: 'all .2s' }}>
              {t}
            </button>
          ))}
        </div>
  
        {/* ── MEDIA GRID ── */}
        {loading ? <LoadingSpinner /> : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#aaa' }}>No media files yet. Upload one above.</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 16 }}>
            {filtered.map(item => (
              <div key={item.mediaId} style={{ background: '#fff', borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(0,0,0,.07)' }}>
  
                {/* Thumbnail */}
                <div style={{ height: 160, background: 'linear-gradient(135deg,#1a4731,#40916c)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 50, position: 'relative', overflow: 'hidden' }}>
                  {item.mediaType === 'IMAGE' && item.fileUrl ? (
                    <img src={getImageUrl(item.fileUrl)} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
                  ) : item.isYoutubeVideo && item.youtubeThumbnail ? (
                    <img src={item.youtubeThumbnail} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span>{item.mediaType === 'VIDEO' ? '🎬' : '📄'}</span>
                  )}
  
                  {/* Badges */}
                  <div style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(0,0,0,.6)', color: '#fff', fontSize: 9, fontWeight: 700, letterSpacing: '.1em', padding: '4px 8px', borderRadius: 3 }}>
                    {item.category}
                  </div>
                  <div style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(201,168,76,.9)', color: '#0d2b1a', fontSize: 9, fontWeight: 700, letterSpacing: '.08em', padding: '4px 8px', borderRadius: 3 }}>
                    {item.usage}
                  </div>
                  {item.isYoutubeVideo && (
                    <div style={{ position: 'absolute', bottom: 8, left: 8, background: '#c0392b', color: '#fff', fontSize: 10, fontWeight: 700, padding: '4px 8px', borderRadius: 3 }}>
                      ▶️ YouTube
                    </div>
                  )}
                </div>
  
                {/* Info + Actions */}
                <div style={{ padding: '14px' }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: '#0d2b1a', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: 11, color: '#aaa', marginBottom: 10 }}>
                    {item.mediaType}{item.fileSize && ` • ${(item.fileSize / 1024).toFixed(1)}KB`}
                  </div>
  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {/* Copy URL button — only for non-YouTube images */}
                    {!item.isYoutubeVideo && item.fileUrl && (
                      <button
                        onClick={() => handleCopyUrl(item)}
                        style={{
                          width: '100%',
                          background: copiedId === item.mediaId ? 'rgba(37,96,64,.15)' : 'rgba(26,71,49,.08)',
                          color: copiedId === item.mediaId ? '#1a4731' : '#256040',
                          border: `1px solid ${copiedId === item.mediaId ? 'rgba(37,96,64,.4)' : 'rgba(26,71,49,.2)'}`,
                          padding: '8px',
                          borderRadius: 5,
                          cursor: 'pointer',
                          fontSize: 12,
                          fontFamily: "'Lato',sans-serif",
                          fontWeight: 700,
                          transition: 'all .2s'
                        }}
                      >
                        {copiedId === item.mediaId ? '✓ URL Copied!' : '📋 Copy Image URL'}
                      </button>
                    )}
  
                    <button
                      onClick={() => handleDelete(item)}
                      style={{ width: '100%', background: 'rgba(192,57,43,.1)', color: '#c0392b', border: 'none', padding: '8px', borderRadius: 5, cursor: 'pointer', fontSize: 12, fontFamily: "'Lato',sans-serif", fontWeight: 700 }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminLayout>
    );
};

export default AdminMedia;
