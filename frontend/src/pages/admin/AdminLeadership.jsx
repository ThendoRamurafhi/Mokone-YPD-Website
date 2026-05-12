import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import leadershipService from '../../services/leadershipService';
import mediaService from '../../services/mediaService';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const EMPTY = {
  name: '', role: '', initials: '', description: '',
  photoUrl: '', pageSection: 'BOTH', displayOrder: 0,
};

const SECTIONS = [
  { value: 'ABOUT_LEADERSHIP', label: 'About page — "Guiding Principles"' },
  { value: 'STRUCTURE_TEAM',   label: 'Structure page — "Our Leadership"' },
  { value: 'BOTH',             label: 'Both pages' },
];

const AdminLeadership = () => {
  const [leaders,  setLeaders]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [editing,  setEditing]  = useState(null);   // null=list, 'new'=new form, obj=edit
  const [form,     setForm]     = useState(EMPTY);
  const [saving,   setSaving]   = useState(false);
  const [msg,      setMsg]      = useState(null);

  // Photo picker
  const [showPicker,    setShowPicker]    = useState(false);
  const [pickerImages,  setPickerImages]  = useState([]);
  const [pickerLoading, setPickerLoading] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const data = await leadershipService.getAll();
      setLeaders(Array.isArray(data) ? data : []);
    } catch { setLeaders([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openNew  = () => { setForm(EMPTY); setEditing('new'); setMsg(null); };
  const openEdit = (l) => { setForm({ ...l }); setEditing(l); setMsg(null); };
  const cancel   = () => { setEditing(null); setMsg(null); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      editing === 'new'
        ? await leadershipService.create(form)
        : await leadershipService.update(editing.leaderId, form);
      setMsg({ type: 'success', text: 'Leader saved!' });
      await load();
      setTimeout(() => { setEditing(null); setMsg(null); }, 900);
    } catch (err) {
      setMsg({ type: 'error', text: typeof err === 'string' ? err : 'Save failed.' });
    } finally { setSaving(false); }
  };

  const handleDelete = async (l) => {
    if (!window.confirm(`Remove "${l.name}"?`)) return;
    try { await leadershipService.remove(l.leaderId); await load(); }
    catch { alert('Delete failed.'); }
  };

  // Photo picker — loads LEADERSHIP_PROFILE images from Media library
  const openPicker = async () => {
    setPickerLoading(true);
    setShowPicker(true);
    try {
      const data = await mediaService.getByUsage('LEADERSHIP_PROFILE');
      // Also try STRUCTURE_LEADER usage
      let extra = [];
      try { extra = await mediaService.getByUsage('STRUCTURE_LEADER'); } catch {}
      const all  = [...(Array.isArray(data) ? data : []), ...extra];
      // Deduplicate by mediaId
      const seen = new Set();
      setPickerImages(all.filter(m => {
        if (seen.has(m.mediaId)) return false;
        seen.add(m.mediaId); return true;
      }).filter(m => m.mediaType === 'IMAGE'));
    } catch { setPickerImages([]); }
    finally { setPickerLoading(false); }
  };

  const pickPhoto = (item) => {
    setForm({ ...form, photoUrl: item.fileUrl });
    setShowPicker(false);
  };

  // Styles
  const inp = { width: '100%', padding: '11px 14px', border: '1.5px solid rgba(26,71,49,.2)', borderRadius: 6, fontSize: 14, outline: 'none', fontFamily: "'Lato',sans-serif", boxSizing: 'border-box' };
  const lbl = { display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '.12em', color: '#3d5247', marginBottom: 7 };

  const sectionLabel = (v) => SECTIONS.find(s => s.value === v)?.label || v;

  return (
    <AdminLayout>

      {/* ── PHOTO PICKER MODAL ── */}
      {showPicker && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.65)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: '#fff', borderRadius: 14, width: '100%', maxWidth: 680, maxHeight: '80vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(0,0,0,.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontFamily: 'Georgia,serif', fontSize: 20, color: '#0d2b1a', marginBottom: 4 }}>Pick Leader Photo</h3>
                <p style={{ fontSize: 12, color: '#6b8070' }}>
                  Only showing images uploaded with usage "Leadership Profile" or "Structure Leader".
                  Upload photos in the <strong>Media Library</strong> first with those usage tags.
                </p>
              </div>
              <button onClick={() => setShowPicker(false)}
                style={{ background: 'transparent', border: '1px solid rgba(0,0,0,.15)', borderRadius: 6, width: 32, height: 32, cursor: 'pointer', color: '#6b8070', fontSize: 16 }}>✕</button>
            </div>
            <div style={{ overflowY: 'auto', padding: 20, flex: 1 }}>
              {pickerLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><LoadingSpinner /></div>
              ) : pickerImages.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#aaa' }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>📷</div>
                  <p style={{ fontSize: 14, marginBottom: 8 }}>No leader photos yet.</p>
                  <p style={{ fontSize: 12 }}>
                    Go to <strong>Media Library</strong> → upload a photo →
                    set Usage to <strong>"Leadership Profile"</strong> or <strong>"Structure Leader"</strong>.
                    Then come back here.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: 12 }}>
                  {pickerImages.map(item => (
                    <div key={item.mediaId} onClick={() => pickPhoto(item)}
                      style={{ cursor: 'pointer', borderRadius: 8, overflow: 'hidden', border: '2px solid transparent', transition: 'all .2s' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = '#c9a84c'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                      <img src={item.fileUrl} alt={item.title}
                        style={{ width: '100%', height: 120, objectFit: 'cover', display: 'block' }} />
                      <div style={{ padding: '6px 8px', background: '#fff', fontSize: 11, color: '#3d5247', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.title || item.fileName}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {editing ? (
        /* ── FORM VIEW ── */
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
            <button onClick={cancel} style={{ background: 'transparent', border: '1px solid rgba(0,0,0,.15)', borderRadius: 6, padding: '8px 16px', cursor: 'pointer', fontSize: 13, color: '#6b8070' }}>← Back</button>
            <h1 style={{ fontFamily: 'Georgia,serif', fontSize: 24, color: '#0d2b1a' }}>
              {editing === 'new' ? 'Add Leader' : 'Edit Leader'}
            </h1>
          </div>

          {msg && (
            <div style={{ padding: '12px 16px', borderRadius: 6, marginBottom: 20, background: msg.type === 'success' ? 'rgba(37,96,64,.1)' : 'rgba(192,57,43,.08)', border: `1px solid ${msg.type === 'success' ? 'rgba(37,96,64,.3)' : 'rgba(192,57,43,.3)'}`, color: msg.type === 'success' ? '#1a4731' : '#c0392b', fontSize: 13 }}>
              {msg.text}
            </div>
          )}

          <form onSubmit={handleSave} style={{ background: '#fff', borderRadius: 12, padding: 28, border: '1px solid rgba(0,0,0,.07)' }}>

            {/* Photo picker */}
            <div style={{ marginBottom: 20 }}>
              <label style={lbl}>PHOTO</label>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                {/* Preview */}
                <div style={{ width: 80, height: 80, borderRadius: '50%', overflow: 'hidden', background: '#1a4731', border: '2px solid #c9a84c', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c9a84c', fontFamily: 'Georgia,serif', fontWeight: 700, fontSize: 20 }}>
                  {form.photoUrl ? (
                    <img src={form.photoUrl} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
                  ) : (form.initials || '?')}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    <input value={form.photoUrl || ''} onChange={e => setForm({ ...form, photoUrl: e.target.value })}
                      placeholder="Paste photo URL, or click Pick Photo" style={{ ...inp, flex: 1 }} />
                    <button type="button" onClick={openPicker}
                      style={{ background: '#1a4731', color: '#fff', border: 'none', padding: '0 16px', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 700, fontFamily: "'Lato',sans-serif", whiteSpace: 'nowrap' }}>
                      📷 Pick Photo
                    </button>
                  </div>
                  <p style={{ fontSize: 11, color: '#6b8070' }}>
                    Upload the photo in Media Library with usage "Leadership Profile", then pick it here.
                    If no photo, the initials fallback is shown.
                  </p>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={lbl}>FULL NAME *</label>
                <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Rev. John Doe" style={inp} />
              </div>
              <div>
                <label style={lbl}>ROLE / TITLE *</label>
                <input required value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} placeholder="Presiding Elder" style={inp} />
              </div>
              <div>
                <label style={lbl}>INITIALS <span style={{ fontWeight: 400, color: '#aaa' }}>(fallback if no photo)</span></label>
                <input value={form.initials || ''} onChange={e => setForm({ ...form, initials: e.target.value })} placeholder="JD" style={inp} maxLength={4} />
              </div>
              <div>
                <label style={lbl}>DISPLAY ORDER <span style={{ fontWeight: 400, color: '#aaa' }}>(lower = first)</span></label>
                <input type="number" value={form.displayOrder || 0} onChange={e => setForm({ ...form, displayOrder: parseInt(e.target.value) || 0 })} style={inp} />
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={lbl}>APPEARS ON</label>
              <select value={form.pageSection || 'BOTH'} onChange={e => setForm({ ...form, pageSection: e.target.value })} style={{ ...inp, background: '#fff', cursor: 'pointer' }}>
                {SECTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: 22 }}>
              <label style={lbl}>BIO / DESCRIPTION <span style={{ fontWeight: 400, color: '#aaa' }}>(shown on About page)</span></label>
              <textarea rows={3} value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Short bio about this leader…" style={{ ...inp, resize: 'vertical' }} />
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button type="submit" disabled={saving}
                style={{ background: '#1a4731', color: '#fff', border: 'none', padding: '13px 32px', borderRadius: 8, fontFamily: "'Lato',sans-serif", fontSize: 14, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
                {saving ? 'Saving…' : editing === 'new' ? 'Add Leader' : 'Save Changes'}
              </button>
              <button type="button" onClick={cancel}
                style={{ background: 'transparent', border: '1px solid rgba(0,0,0,.18)', color: '#6b8070', padding: '13px 24px', borderRadius: 8, fontFamily: "'Lato',sans-serif", fontSize: 14, cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </form>
        </div>

      ) : (
        /* ── LIST VIEW ── */
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
            <h1 style={{ fontFamily: 'Georgia,serif', fontSize: 28, color: '#0d2b1a' }}>Leadership Team</h1>
            <button onClick={openNew}
              style={{ background: '#c9a84c', color: '#0d2b1a', border: 'none', padding: '12px 24px', borderRadius: 8, fontFamily: "'Lato',sans-serif", fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
              + Add Leader
            </button>
          </div>

          <div style={{ background: '#f0f7f3', border: '1px solid rgba(26,71,49,.1)', borderRadius: 8, padding: '12px 16px', marginBottom: 20, fontSize: 13, color: '#3d5247', lineHeight: 1.7 }}>
            <strong>📋 How to add a photo:</strong>
            Go to <strong>Media Library</strong> → upload the person's headshot →
            set Category to <strong>Leadership</strong> and Usage to <strong>Leadership Profile</strong> (for About page)
            or <strong>Structure Leader</strong> (for Structure page) →
            then come back here and click <strong>Edit → Pick Photo</strong>.
          </div>

          {loading ? <LoadingSpinner /> : (
            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid rgba(0,0,0,.07)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f7f9f7', borderBottom: '1px solid rgba(0,0,0,.07)' }}>
                    {['Photo', 'Name & Role', 'Appears on', 'Order', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, letterSpacing: '.1em', color: '#3d5247' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {leaders.length === 0 ? (
                    <tr><td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: '#aaa', fontSize: 14 }}>
                      No leaders yet. Add your first leader above.
                    </td></tr>
                  ) : leaders.map(l => (
                    <tr key={l.leaderId} style={{ borderBottom: '1px solid rgba(0,0,0,.05)' }}>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ width: 44, height: 44, borderRadius: '50%', overflow: 'hidden', background: '#1a4731', border: '2px solid #c9a84c', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c9a84c', fontFamily: 'Georgia,serif', fontWeight: 700, fontSize: 13 }}>
                          {l.photoUrl ? (
                            <img src={l.photoUrl} alt={l.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
                          ) : (l.initials || '?')}
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ fontWeight: 600, color: '#0d2b1a', fontSize: 14 }}>{l.name}</div>
                        <div style={{ fontSize: 12, color: '#6b8070' }}>{l.role}</div>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ background: 'rgba(26,71,49,.08)', color: '#1a4731', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 3 }}>
                          {sectionLabel(l.pageSection)}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: '#6b8070' }}>{l.displayOrder}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button onClick={() => openEdit(l)}
                            style={{ background: 'rgba(37,96,64,.1)', color: '#1a4731', border: 'none', padding: '7px 14px', borderRadius: 5, cursor: 'pointer', fontSize: 12, fontFamily: "'Lato',sans-serif", fontWeight: 700 }}>Edit</button>
                          <button onClick={() => handleDelete(l)}
                            style={{ background: 'rgba(192,57,43,.1)', color: '#c0392b', border: 'none', padding: '7px 14px', borderRadius: 5, cursor: 'pointer', fontSize: 12, fontFamily: "'Lato',sans-serif", fontWeight: 700 }}>Remove</button>
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

export default AdminLeadership;
