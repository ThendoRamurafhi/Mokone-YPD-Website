import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import leadershipService from '../../services/leadershipService';
import mediaService from '../../services/mediaService';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminLeadership = () => {
  const [leaders, setLeaders] = useState([]);
  const [leadershipPhotos, setLeadershipPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null = list view, 'new' = add form, leader object = edit form
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    initials: '',
    description: '',
    photoUrl: '',
    pageSection: 'BOTH',
    displayOrder: 0
  });
  const [showPhotoPicker, setShowPhotoPicker] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // ══════════════════════════════════════════════════════════════
  // LOAD DATA
  // ══════════════════════════════════════════════════════════════

  useEffect(() => {
    loadLeaders();
    loadLeadershipPhotos();
  }, []);

  const loadLeaders = async () => {
    try {
      setLoading(true);
      const response = await leadershipService.getAll();
      const data = Array.isArray(response) ? response : (response.data || []);
      const sorted = data.sort((a, b) => a.displayOrder - b.displayOrder);
      setLeaders(sorted);
      setError(null);
    } catch (err) {
      console.error('Failed to load leaders:', err);
      setError('Failed to load leadership data');
      setLeaders([]);
    } finally {
      setLoading(false);
    }
  };

  const loadLeadershipPhotos = async () => {
    try {
      const response = await mediaService.getByCategoryAndUsage('EXECUTIVE_MEMBERS', 'LEADERSHIP_PROFILE');
      const photos = Array.isArray(response) ? response : (response.data || []);
      setLeadershipPhotos(photos);
      console.log('Loaded leadership photos:', photos.length);
    } catch (err) {
      console.error('Failed to load leadership photos:', err);
      setLeadershipPhotos([]);
    }
  };

  // ══════════════════════════════════════════════════════════════
  // FORM HANDLERS
  // ══════════════════════════════════════════════════════════════

  const openNew = () => {
    setFormData({
      name: '',
      role: '',
      initials: '',
      description: '',
      photoUrl: '',
      pageSection: 'BOTH',
      displayOrder: 0
    });
    setEditing('new');
    setError(null);
    setSuccess(null);
  };

  const openEdit = (leader) => {
    setFormData({
      name: leader.name || '',
      role: leader.role || '',
      initials: leader.initials || '',
      description: leader.description || '',
      photoUrl: leader.photoUrl || '',
      pageSection: leader.pageSection || 'BOTH',
      displayOrder: leader.displayOrder || 0
    });
    setEditing(leader);
    setError(null);
    setSuccess(null);
  };

  const cancel = () => {
    setEditing(null);
    setError(null);
    setSuccess(null);
    setFormData({
      name: '',
      role: '',
      initials: '',
      description: '',
      photoUrl: '',
      pageSection: 'BOTH',
      displayOrder: 0
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    // Validation for About page limit (max 4 leaders)
    if (formData.pageSection !== 'STRUCTURE_TEAM') {
      const aboutLeaders = leaders.filter(l =>
        (l.pageSection === 'BOTH' || l.pageSection === 'ABOUT_LEADERSHIP') &&
        (editing === 'new' || l.leaderId !== editing.leaderId)
      ).length;

      if (aboutLeaders >= 4) {
        setError('Maximum 4 leaders can be displayed on the About page. Change an existing leader to "Structure Only" first.');
        setSaving(false);
        return;
      }
    }

    try {
      if (editing === 'new') {
        await leadershipService.create(formData);
        setSuccess('Leader added successfully!');
      } else {
        await leadershipService.update(editing.leaderId, formData);
        setSuccess('Leader updated successfully!');
      }

      await loadLeaders();
      setTimeout(() => {
        setSuccess(null);
        cancel();
      }, 1500);
    } catch (err) {
      console.error('Failed to save leader:', err);
      setError(err.response?.data?.message || 'Failed to save leader. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (leader) => {
    if (!window.confirm(`Are you sure you want to remove "${leader.name}"?`)) return;

    try {
      await leadershipService.remove(leader.leaderId);
      setSuccess('Leader removed successfully!');
      await loadLeaders();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Failed to delete leader:', err);
      setError(err.response?.data?.message || 'Failed to delete leader');
    }
  };

  const handlePhotoSelect = (photo) => {
    setFormData({ ...formData, photoUrl: photo.fileUrl });
    setShowPhotoPicker(false);
  };

  const openPhotoPicker = async () => {
    setShowPhotoPicker(true);
    if (leadershipPhotos.length === 0) {
      await loadLeadershipPhotos();
    }
  };

  // ══════════════════════════════════════════════════════════════
  // HELPERS
  // ══════════════════════════════════════════════════════════════

  const countAboutLeaders = () => {
    return leaders.filter(l =>
      l.pageSection === 'BOTH' || l.pageSection === 'ABOUT_LEADERSHIP'
    ).length;
  };

  const canAddToAbout = () => {
    return countAboutLeaders() < 4;
  };

  // ══════════════════════════════════════════════════════════════
  // STYLING
  // ══════════════════════════════════════════════════════════════

  const inputStyle = {
    width: '100%',
    padding: '11px 14px',
    border: '1.5px solid rgba(26,71,49,.2)',
    borderRadius: 6,
    fontSize: 14,
    outline: 'none',
    fontFamily: "'Lato',sans-serif",
    boxSizing: 'border-box'
  };

  const labelStyle = {
    display: 'block',
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '.12em',
    color: '#3d5247',
    marginBottom: 7
  };

  // ══════════════════════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════════════════════

  return (
    <AdminLayout>
      {/* ══════════════════════════════════════════════════════════════
          PHOTO PICKER MODAL
      ══════════════════════════════════════════════════════════════ */}

      {showPhotoPicker && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,.6)',
            zIndex: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24
          }}
          onClick={() => setShowPhotoPicker(false)}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 12,
              maxWidth: 700,
              width: '100%',
              maxHeight: '80vh',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid rgba(0,0,0,.08)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{ fontSize: 18, fontWeight: 600, fontFamily: 'Georgia,serif', color: '#0d2b1a' }}>
                Select Leadership Photo
              </h3>
              <button
                onClick={() => setShowPhotoPicker(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 20,
                  cursor: 'pointer',
                  color: '#6b8070'
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: 24, overflowY: 'auto' }}>
              {leadershipPhotos.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#aaa' }}>
                  <p style={{ fontSize: 14, marginBottom: 8 }}>No leadership photos found.</p>
                  <p style={{ fontSize: 12 }}>
                    Upload photos to <strong>Media</strong> page with:
                    <br />Category: <strong>EXECUTIVE_MEMBERS</strong>
                    <br />Usage: <strong>LEADERSHIP_PROFILE</strong>
                  </p>
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                  gap: 12
                }}>
                  {leadershipPhotos.map(photo => (
                    <div
                      key={photo.mediaId}
                      onClick={() => handlePhotoSelect(photo)}
                      style={{
                        aspectRatio: 1,
                        borderRadius: 8,
                        overflow: 'hidden',
                        cursor: 'pointer',
                        border: '3px solid transparent',
                        transition: 'all .2s',
                        backgroundImage: `url(${photo.fileUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = '#c9a84c';
                        e.currentTarget.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = 'transparent';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                      title={photo.fileName}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          FORM VIEW (Add / Edit)
      ══════════════════════════════════════════════════════════════ */}

      {editing ? (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
            <button
              onClick={cancel}
              style={{
                background: 'transparent',
                border: '1px solid rgba(0,0,0,.15)',
                borderRadius: 6,
                padding: '8px 16px',
                cursor: 'pointer',
                fontSize: 13,
                color: '#6b8070',
                fontFamily: "'Lato',sans-serif"
              }}
            >
              ← Back
            </button>
            <h1 style={{ fontFamily: 'Georgia,serif', fontSize: 24, color: '#0d2b1a', margin: 0 }}>
              {editing === 'new' ? 'Add New Leader' : 'Edit Leader'}
            </h1>
          </div>

          {/* Messages */}
          {error && (
            <div style={{
              background: '#fee',
              border: '1px solid #c0392b',
              color: '#c0392b',
              padding: '12px 16px',
              borderRadius: 8,
              marginBottom: 24,
              fontSize: 13
            }}>
              ⚠️ {error}
            </div>
          )}

          {success && (
            <div style={{
              background: 'rgba(37,96,64,.1)',
              border: '1px solid rgba(37,96,64,.3)',
              color: '#1a4731',
              padding: '12px 16px',
              borderRadius: 8,
              marginBottom: 24,
              fontSize: 13
            }}>
              ✓ {success}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{
            background: '#fff',
            borderRadius: 12,
            padding: '28px',
            border: '1px solid rgba(0,0,0,.07)'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              {/* Name */}
              <div>
                <label style={labelStyle}>FULL NAME *</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Thendo Ramurafhi"
                  style={inputStyle}
                />
              </div>

              {/* Role */}
              <div>
                <label style={labelStyle}>ROLE/TITLE *</label>
                <input
                  required
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="Technology Chairperson"
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              {/* Initials */}
              <div>
                <label style={labelStyle}>INITIALS (fallback if no photo)</label>
                <input
                  type="text"
                  value={formData.initials}
                  onChange={(e) => setFormData({ ...formData, initials: e.target.value.toUpperCase() })}
                  placeholder="TR"
                  maxLength={3}
                  style={inputStyle}
                />
              </div>

              {/* Display Order */}
              <div>
                <label style={labelStyle}>DISPLAY ORDER</label>
                <input
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                  min="0"
                  style={inputStyle}
                />
                <p style={{ fontSize: 11, color: '#6b8070', marginTop: 4 }}>Lower number appears first</p>
              </div>
            </div>

            {/* Page Section */}
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>DISPLAY ON *</label>
              <select
                value={formData.pageSection}
                onChange={(e) => setFormData({ ...formData, pageSection: e.target.value })}
                disabled={!canAddToAbout() && formData.pageSection !== 'STRUCTURE_TEAM' && editing !== 'new'}
                required
                style={{ ...inputStyle, background: '#fff' }}
              >
                <option value="BOTH" disabled={!canAddToAbout() && editing === 'new'}>
                  Both About &amp; Structure Pages {!canAddToAbout() && editing === 'new' ? '(Limit reached)' : ''}
                </option>
                <option value="ABOUT_LEADERSHIP" disabled={!canAddToAbout() && editing === 'new'}>
                  About Page Only {!canAddToAbout() && editing === 'new' ? '(Limit reached)' : ''}
                </option>
                <option value="STRUCTURE_TEAM">Structure Page Only</option>
              </select>
              <p style={{ fontSize: 11, color: '#6b8070', marginTop: 4 }}>
                About page: {countAboutLeaders()}/4 leaders
              </p>
            </div>

            {/* Description */}
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>BIOGRAPHY (shown on About page)</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief bio or description..."
                rows="4"
                style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
              />
            </div>

            {/* Photo URL */}
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>PHOTO</label>
              <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
                <input
                  type="url"
                  value={formData.photoUrl}
                  onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                  placeholder="Paste photo URL or click Pick from Media"
                  style={{ ...inputStyle, flex: 1 }}
                />
                <button
                  type="button"
                  onClick={openPhotoPicker}
                  style={{
                    background: '#1a4731',
                    color: '#fff',
                    border: 'none',
                    padding: '0 20px',
                    borderRadius: 6,
                    cursor: 'pointer',
                    fontSize: 13,
                    fontWeight: 700,
                    fontFamily: "'Lato',sans-serif",
                    whiteSpace: 'nowrap'
                  }}
                >
                  🖼️ Pick
                </button>
              </div>
              {formData.photoUrl && (
                <img
                  src={formData.photoUrl}
                  alt="Preview"
                  style={{
                    width: 100,
                    height: 100,
                    objectFit: 'cover',
                    borderRadius: 8,
                    marginTop: 12,
                    border: '2px solid #c9a84c'
                  }}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              )}
            </div>

            {/* Submit Buttons */}
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                type="submit"
                disabled={saving}
                style={{
                  background: '#1a4731',
                  color: '#fff',
                  border: 'none',
                  padding: '13px 32px',
                  borderRadius: 8,
                  fontFamily: "'Lato',sans-serif",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: saving ? 'not-allowed' : 'pointer',
                  opacity: saving ? 0.7 : 1
                }}
              >
                {saving ? 'Saving…' : editing === 'new' ? '➕ Add Leader' : '✓ Save Changes'}
              </button>
              <button
                type="button"
                onClick={cancel}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(0,0,0,.18)',
                  color: '#6b8070',
                  padding: '13px 24px',
                  borderRadius: 8,
                  fontFamily: "'Lato',sans-serif",
                  fontSize: 14,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* ══════════════════════════════════════════════════════════════
            LIST VIEW
        ══════════════════════════════════════════════════════════════ */
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 24,
            flexWrap: 'wrap',
            gap: 12
          }}>
            <div>
              <h1 style={{
                fontFamily: 'Georgia,serif',
                fontSize: 28,
                color: '#0d2b1a',
                margin: 0,
                marginBottom: 6
              }}>
                Leadership Management
              </h1>
              <p style={{ fontSize: 13, color: '#6b8070', margin: 0 }}>
                Manage church leaders (Max 4 on About page, unlimited on Structure page)
              </p>
            </div>
            <button
              onClick={openNew}
              style={{
                background: '#c9a84c',
                color: '#0d2b1a',
                border: 'none',
                padding: '12px 24px',
                borderRadius: 8,
                fontFamily: "'Lato',sans-serif",
                fontSize: 14,
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              ➕ Add Leader
            </button>
          </div>

          {/* Messages */}
          {error && (
            <div style={{
              background: '#fee',
              border: '1px solid #c0392b',
              color: '#c0392b',
              padding: '12px 16px',
              borderRadius: 8,
              marginBottom: 24,
              fontSize: 13
            }}>
              ⚠️ {error}
            </div>
          )}

          {success && (
            <div style={{
              background: 'rgba(37,96,64,.1)',
              border: '1px solid rgba(37,96,64,.3)',
              color: '#1a4731',
              padding: '12px 16px',
              borderRadius: 8,
              marginBottom: 24,
              fontSize: 13
            }}>
              ✓ {success}
            </div>
          )}

          {/* Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 16,
            marginBottom: 28
          }}>
            <div style={{
              background: '#fff',
              border: '1px solid rgba(0,0,0,.08)',
              borderRadius: 8,
              padding: 16
            }}>
              <div style={{ fontSize: 12, color: '#6b8070', fontWeight: 600, marginBottom: 4 }}>
                ABOUT PAGE
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#1a4731' }}>
                {countAboutLeaders()} <span style={{ fontSize: 14, fontWeight: 400, color: '#aaa' }}>/4</span>
              </div>
              <div style={{ fontSize: 11, color: '#999', marginTop: 4 }}>
                {canAddToAbout() ? '✓ Can add more' : '⚠️ Limit reached'}
              </div>
            </div>
            <div style={{
              background: '#fff',
              border: '1px solid rgba(0,0,0,.08)',
              borderRadius: 8,
              padding: 16
            }}>
              <div style={{ fontSize: 12, color: '#6b8070', fontWeight: 600, marginBottom: 4 }}>
                STRUCTURE PAGE
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#1a4731' }}>
                {leaders.length}
              </div>
              <div style={{ fontSize: 11, color: '#999', marginTop: 4 }}>
                All leaders displayed
              </div>
            </div>
          </div>

          {/* Leaders Table */}
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
              <LoadingSpinner />
            </div>
          ) : leaders.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px',
              color: '#aaa',
              background: '#fff',
              borderRadius: 12,
              border: '1px solid rgba(0,0,0,.07)'
            }}>
              <p style={{ fontSize: 18, marginBottom: 8 }}>No leaders added yet</p>
              <p style={{ fontSize: 14 }}>Click "Add Leader" to get started</p>
            </div>
          ) : (
            <div style={{
              background: '#fff',
              borderRadius: 12,
              border: '1px solid rgba(0,0,0,.07)',
              overflow: 'hidden'
            }}>
              <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {['PHOTO', 'NAME', 'ROLE', 'DISPLAY', 'ORDER', 'ACTIONS'].map((col, i) => (
                      <th
                        key={col}
                        style={{
                          textAlign: i === 4 ? 'center' : 'left',
                          padding: '12px 16px',
                          fontSize: 11,
                          fontWeight: 700,
                          letterSpacing: '.12em',
                          color: '#6b8070',
                          borderBottom: '1px solid rgba(0,0,0,.08)',
                          background: '#f7f9f7'
                        }}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {leaders.map(leader => (
                    <tr
                      key={leader.leaderId}
                      style={{ borderBottom: '1px solid rgba(0,0,0,.05)' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f7f9f7'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      {/* Photo */}
                      <td style={{ padding: '14px 16px' }}>
                        {leader.photoUrl ? (
                          <img
                            src={leader.photoUrl}
                            alt={leader.name}
                            style={{
                              width: 40,
                              height: 40,
                              borderRadius: '50%',
                              objectFit: 'cover',
                              border: '2px solid #c9a84c'
                            }}
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        ) : (
                          <div style={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            background: '#1a4731',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#c9a84c',
                            fontFamily: 'Georgia,serif',
                            fontWeight: 700,
                            fontSize: 14,
                            border: '2px solid #c9a84c'
                          }}>
                            {leader.initials || leader.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                          </div>
                        )}
                      </td>

                      {/* Name */}
                      <td style={{ padding: '14px 16px', fontWeight: 600, color: '#0d2b1a', fontSize: 14 }}>
                        {leader.name}
                      </td>

                      {/* Role */}
                      <td style={{ padding: '14px 16px', fontSize: 13, color: '#6b8070' }}>
                        {leader.role}
                      </td>

                      {/* Display badge */}
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{
                          fontSize: 10,
                          fontWeight: 700,
                          letterSpacing: '.1em',
                          padding: '3px 10px',
                          borderRadius: 20,
                          background: leader.pageSection === 'BOTH'
                            ? 'rgba(26,71,49,.15)'
                            : leader.pageSection === 'ABOUT_LEADERSHIP'
                            ? 'rgba(37,96,64,.15)'
                            : 'rgba(201,168,76,.15)',
                          color: leader.pageSection === 'BOTH'
                            ? '#0d2b1a'
                            : leader.pageSection === 'ABOUT_LEADERSHIP'
                            ? '#1a4731'
                            : '#7d5b00'
                        }}>
                          {leader.pageSection === 'BOTH' ? '📄 BOTH'
                            : leader.pageSection === 'ABOUT_LEADERSHIP' ? '📖 ABOUT'
                            : '🏛️ STRUCTURE'}
                        </span>
                      </td>

                      {/* Order */}
                      <td style={{
                        padding: '14px 16px',
                        fontSize: 13,
                        color: '#6b8070',
                        textAlign: 'center',
                        fontWeight: 700
                      }}>
                        #{leader.displayOrder || 0}
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button
                            onClick={() => openEdit(leader)}
                            style={{
                              background: 'rgba(37,96,64,.1)',
                              color: '#1a4731',
                              border: 'none',
                              padding: '7px 14px',
                              borderRadius: 5,
                              cursor: 'pointer',
                              fontSize: 12,
                              fontFamily: "'Lato',sans-serif",
                              fontWeight: 700
                            }}
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDelete(leader)}
                            style={{
                              background: 'rgba(192,57,43,.1)',
                              color: '#c0392b',
                              border: 'none',
                              padding: '7px 14px',
                              borderRadius: 5,
                              cursor: 'pointer',
                              fontSize: 12,
                              fontFamily: "'Lato',sans-serif",
                              fontWeight: 700
                            }}
                          >
                            🗑️ Delete
                          </button>
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