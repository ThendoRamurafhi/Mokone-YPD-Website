import React, { useState, useEffect } from 'react';
import leadershipService from '../../services/leadershipService';
import mediaService from '../../services/mediaService'; 
import api from '../../services/api';

const AdminLeadership = () => {
  const [leaders, setLeaders] = useState([]);
  const [leadershipPhotos, setLeadershipPhotos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showPhotoPicker, setShowPhotoPicker] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
   const [success, setSuccess] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    initials: '',
    description: '',
    photoUrl: '',
    pageSection: 'BOTH',
    displayOrder: 0
  });

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
      const sorted = (response.data || []).sort((a, b) => a.displayOrder - b.displayOrder);
      setLeaders(sorted);
    } catch (err) {
      console.error('Failed to load leaders:', err);
      setError('Failed to load leadership data');
    } finally {
      setLoading(false);
    }
  };

  const loadLeadershipPhotos = async () => {
    try {
      // Get all media with LEADERSHIP category and LEADERSHIP_PROFILE usage
      const response = await mediaService.getByCategoryAndUsage('EXECUTIVE_MEMBERS', 'LEADERSHIP_PROFILE');
       const photos = response.data || [];
      setLeadershipPhotos(photos);
      console.log('Loaded leadership photos:', photos.length);
    } catch (err) {
      console.error('Failed to load leadership photos:', err);
    }
  };

  // ══════════════════════════════════════════════════════════════
  // FORM HANDLERS
  // ══════════════════════════════════════════════════════════════

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    // ── Validation for About page limit ──
    if (formData.pageSection !== 'STRUCTURE_TEAM') {
      // Counting leaders already on About page
      const aboutLeaders = leaders.filter(l => 
        (l.pageSection === 'BOTH' || l.pageSection === 'ABOUT_LEADERSHIP') &&
        l.leaderId !== editingId  // Exclude current edit
      ).length;

      if (aboutLeaders >= 4) {
        setError('Maximum 4 leaders can be displayed on the About page. Remove or move a leader to Structure Only first.');
        return;
      }
    }

    try {
      if (editingId) {
        await leadershipService.update(editingId, formData);
        setSuccess('Leader updated successfully!');
      } else {
        await leadershipService.create(formData);
        setSuccess('Leader added successfully!');
      }
      
      resetForm();
      loadLeaders();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Failed to save leader:', err);
      setError('Failed to save leader. Please try again.');
    }
  };

  const handleEdit = (leader) => {
    setFormData({
      name: leader.name,
      role: leader.role,
      initials: leader.initials || '',
      description: leader.description || '',
      photoUrl: leader.photoUrl || '',
      pageSection: leader.pageSection,
      displayOrder: leader.displayOrder
    });
    setEditingId(leader.leaderId);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this leader?')) return;

    try {
      await leadershipService.remove(id);
      setSuccess('Leader removed successfully!');
      loadLeaders();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Failed to delete leader:', err);
      setError('Failed to delete leader');
    }
  };

  const handlePhotoSelect = (photo) => {
    setFormData({ ...formData, photoUrl: photo.fileUrl });
    setShowPhotoPicker(false);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      role: '',
      initials: '',
      description: '',
      photoUrl: '',
      pageSection: 'BOTH',
      displayOrder: 0
    });
    setEditingId(null);
    setShowForm(false);
  };
  
  // ══════════════════════════════════════════════════════════════
  // HELPER: Count About page leaders
  // ══════════════════════════════════════════════════════════════

  const countAboutLeaders = () => {
    return leaders.filter(l => l.pageSection === 'BOTH' || l.pageSection === 'ABOUT_LEADERSHIP').length;
  };

  const canAddToAbout = () => {
    return countAboutLeaders() < 4;
  };

  // ══════════════════════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════════════════════

  return (
    <div style={{ padding: '32px', maxWidth: 1400, margin: '0 auto', fontFamily: 'Lato,sans-serif' }}>
      <style>{`
        .leader-card {
          border: 1px solid rgba(0,0,0,.08);
          border-radius: 12px;
          overflow: hidden;
          background: #fff;
          transition: all .25s;
        }
        .leader-card:hover {
          box-shadow: 0 8px 24px rgba(0,0,0,.1);
          transform: translateY(-2px);
        }
        .btn {
          padding: 10px 20px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-family: Lato,sans-serif;
          font-size: 13px;
          font-weight: 600;
          transition: all .2s;
        }
        .btn-primary {
          background: #1a4731;
          color: #fff;
        }
        .btn-primary:hover {
          background: #0d2b1a;
        }
        .btn-primary:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
        .btn-secondary {
          background: #e9ecef;
          color: #333;
        }
        .btn-secondary:hover {
          background: #dee2e6;
        }
        .btn-danger {
          background: #c0392b;
          color: #fff;
        }
        .btn-danger:hover {
          background: #a93226;
        }
        input, select, textarea {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-family: Lato,sans-serif;
          font-size: 14px;
          box-sizing: border-box;
        }
        input:focus, select:focus, textarea:focus {
          outline: none;
          border-color: #1a4731;
          box-shadow: 0 0 0 2px rgba(26,71,49,.1);
        }
        .photo-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 12px;
          max-height: 400px;
          overflow-y: auto;
        }
        .photo-option {
          aspect-ratio: 1;
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          border: 3px solid transparent;
          transition: all .2s;
        }
        .photo-option:hover {
          border-color: #c9a84c;
          transform: scale(1.05);
        }
        .badge {
          display: inline-block;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: .1em;
          padding: 4px 10px;
          border-radius: 20px;
        }
        .badge-about {
          background: rgba(37,96,64,.15);
          color: #1a4731;
        }
        .badge-structure {
          background: rgba(201,168,76,.15);
          color: #7d5b00;
        }
        .badge-both {
          background: rgba(26,71,49,.15);
          color: #0d2b1a;
        }
      `}</style>

      {/* ══════════════════════════════════════════════════════════════
          HEADER
      ══════════════════════════════════════════════════════════════ */}
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#0d2b1a', marginBottom: 6 }}>
            Leadership Management
          </h1>
          <p style={{ fontSize: 14, color: '#6b8070' }}>
            Manage church leaders (Max 4 on About page, unlimited on Structure page)
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: 8 }}
        >
          {showForm ? '✕ Cancel' : '➕ Add Leader'}
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          MESSAGES
      ══════════════════════════════════════════════════════════════ */}
      
      {error && (
        <div style={{
          background: '#fee',
          border: '1px solid #c0392b',
          color: '#c0392b',
          padding: '12px 16px',
          borderRadius: 8,
          marginBottom: 24
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
          marginBottom: 24
        }}>
          ✓ {success}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          STATS
      ══════════════════════════════════════════════════════════════ */}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
        <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,.08)', borderRadius: 8, padding: 16 }}>
          <div style={{ fontSize: 12, color: '#6b8070', fontWeight: 600, marginBottom: 4 }}>ABOUT PAGE</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#1a4731' }}>
            {countAboutLeaders()} <span style={{ fontSize: 14, fontWeight: 400, color: '#aaa' }}>/4</span>
          </div>
          <div style={{ fontSize: 11, color: '#999', marginTop: 4 }}>
            {canAddToAbout() ? '✓ Can add more' : '⚠️ Limit reached'}
          </div>
        </div>
        <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,.08)', borderRadius: 8, padding: 16 }}>
          <div style={{ fontSize: 12, color: '#6b8070', fontWeight: 600, marginBottom: 4 }}>STRUCTURE PAGE</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#1a4731' }}>{leaders.length}</div>
          <div style={{ fontSize: 11, color: '#999', marginTop: 4 }}>All leaders displayed</div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          ADD/EDIT FORM
      ══════════════════════════════════════════════════════════════ */}
      
      {showForm && (
        <div style={{
          background: '#f7f9f7',
          border: '1px solid rgba(0,0,0,.08)',
          borderRadius: 12,
          padding: 24,
          marginBottom: 32
        }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 20, color: '#0d2b1a' }}>
            {editingId ? 'Edit Leader' : 'Add New Leader'}
          </h2>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
              {/* Name */}
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#333' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Rev. John Doe"
                  required
                />
              </div>

              {/* Role */}
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#333' }}>
                  Role/Title *
                </label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="Presiding Elder"
                  required
                />
              </div>

              {/* Initials */}
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#333' }}>
                  Initials (fallback if no photo)
                </label>
                <input
                  type="text"
                  value={formData.initials}
                  onChange={(e) => setFormData({ ...formData, initials: e.target.value })}
                  placeholder="JD"
                  maxLength={3}
                />
              </div>

              {/* Display Order */}
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#333' }}>
                  Display Order (Lower number = First)
                </label>
                <input
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                  min="0"
                />
              </div>
            </div>

            {/* Page Section */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#333' }}>
                Display On *
              </label>
              <select
                value={formData.pageSection}
                onChange={(e) => setFormData({ ...formData, pageSection: e.target.value })}
                disabled={!canAddToAbout() && formData.pageSection !== 'STRUCTURE_TEAM' && !editingId}
                required
              >
                <option value="BOTH" disabled={!canAddToAbout() && !editingId}>
                  Both About & Structure Pages {!canAddToAbout() && !editingId ? '(Limit reached)' : ''}
                </option>
                <option value="ABOUT_LEADERSHIP" disabled={!canAddToAbout() && !editingId}>
                  About Page Only {!canAddToAbout() && !editingId ? '(Limit reached)' : ''}
                </option>
                <option value="STRUCTURE_TEAM">Structure Page Only</option>
              </select>
            </div>

            {/* Description */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#333' }}>
                Biography (shown on About page)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief bio or description..."
                rows="4"
              />
            </div>

            {/* Photo URL */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#333' }}>
                Photo (Category: EXECUTIVE_MEMBERS, Usage: LEADERSHIP_PROFILE)
              </label>
              <div style={{ display: 'flex', gap: 12 }}>
                <input
                  type="url"
                  value={formData.photoUrl}
                  onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                  placeholder="Paste photo URL or click Pick from Media"
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPhotoPicker(true)}
                  className="btn btn-secondary"
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
                    border: '2px solid #ddd'
                  }}
                  onError={() => console.log('Image failed to load')}
                />
              )}
            </div>

            {/* Submit */}
            <div style={{ display: 'flex', gap: 12 }}>
              <button type="submit" className="btn btn-primary">
                {editingId ? '✓ Update Leader' : '➕ Add Leader'}
              </button>
              <button type="button" onClick={resetForm} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

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
              <h3 style={{ fontSize: 18, fontWeight: 600 }}>
                Select Leadership Photo
              </h3>
              <button
                onClick={() => setShowPhotoPicker(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 20,
                  cursor: 'pointer'
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: 24, overflowY: 'auto' }}>
              {leadershipPhotos.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#aaa' }}>
                  <p>No leadership photos found.</p>
                  <p style={{ fontSize: 12, marginTop: 8 }}>
                    Upload photos to <strong>Media</strong> page with:
                    <br/>Category: <strong>EXECUTIVE_MEMBERS</strong>
                    <br/>Usage: <strong>LEADERSHIP_PROFILE</strong>
                  </p>
                </div>
              ) : (
                <div className="photo-grid">
                  {leadershipPhotos.map(photo => (
                    <div
                      key={photo.mediaId}
                      className="photo-option"
                      onClick={() => handlePhotoSelect(photo)}
                      style={{
                        backgroundImage: `url(${photo.fileUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
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
          LEADERS LIST
      ══════════════════════════════════════════════════════════════ */}
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#aaa' }}>
          Loading...
        </div>
      ) : leaders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#aaa' }}>
          <p style={{ fontSize: 18, marginBottom: 8 }}>No leaders added yet</p>
          <p style={{ fontSize: 14 }}>Click "Add Leader" to get started</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 20
        }}>
          {leaders.map(leader => (
            <div key={leader.leaderId} className="leader-card">
              {/* Photo */}
              <div style={{
                height: 200,
                background: leader.photoUrl
                  ? `url(${leader.photoUrl})`
                  : 'linear-gradient(135deg, #1a4731, #40916c)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}>
                {!leader.photoUrl && leader.initials && (
                  <span style={{
                    fontSize: 48,
                    fontWeight: 700,
                    color: 'rgba(255,255,255,.9)',
                    fontFamily: 'Georgia,serif'
                  }}>
                    {leader.initials}
                  </span>
                )}
                
                {/* Badges */}
                <div style={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  display: 'flex',
                  gap: 8,
                  flexWrap: 'wrap',
                  justifyContent: 'flex-end'
                }}>
                  <span className={`badge badge-${leader.pageSection === 'BOTH' ? 'both' : leader.pageSection === 'ABOUT_LEADERSHIP' ? 'about' : 'structure'}`}>
                    {leader.pageSection === 'BOTH' ? '📄 BOTH' :
                     leader.pageSection === 'ABOUT_LEADERSHIP' ? '📖 ABOUT' :
                     '🏛️ STRUCTURE'}
                  </span>
                  <span style={{
                    background: '#c9a84c',
                    color: '#fff',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '10px',
                    fontWeight: '700',
                    letterSpacing: '.1em'
                  }}>
                    #{leader.displayOrder}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div style={{ padding: 20 }}>
                <h3 style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: '#0d2b1a',
                  marginBottom: 4
                }}>
                  {leader.name}
                </h3>
                <p style={{
                  fontSize: 13,
                  color: '#c9a84c',
                  fontWeight: 600,
                  marginBottom: 12
                }}>
                  {leader.role}
                </p>
                {leader.description && (
                  <p style={{
                    fontSize: 12,
                    color: '#6b8070',
                    lineHeight: 1.6,
                    marginBottom: 16,
                    maxHeight: 60,
                    overflow: 'hidden'
                  }}>
                    {leader.description}
                  </p>
                )}

                {/* Actions */}
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => handleEdit(leader)}
                    className="btn btn-secondary"
                    style={{ flex: 1, fontSize: 12 }}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(leader.leaderId)}
                    className="btn btn-danger"
                    style={{ fontSize: 12 }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminLeadership;
