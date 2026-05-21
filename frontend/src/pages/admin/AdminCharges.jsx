import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import chargeService from '../../services/chargeService';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const EMPTY_CHARGE = {
  chargeName:    '',
  district:      '',
  city:          '',
  province:      '',
  address:       '',
  ministerName:  '',
  contactPhone:  '',
  contactEmail:  '',
  websiteUrl:    '',
  serviceTimes:  '',
  latitude:      '',
  longitude:     '',
  isActive:      true,
};

const AdminCharges = () => {
  const [charges, setCharges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form,    setForm]    = useState(EMPTY_CHARGE);
  const [saving,  setSaving]  = useState(false);
  const [msg,     setMsg]     = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      const d = await chargeService.getAll({ page: 0, size: 200 });
      setCharges(d.content || d || []);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openNew  = () => { setForm(EMPTY_CHARGE); setEditing('new'); setMsg(null); };
  const openEdit = (c)  => { setForm({ ...EMPTY_CHARGE, ...c }); setEditing(c); setMsg(null); };
  const cancel   = ()   => { setEditing(null); setMsg(null); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Convert lat/lng to numbers (or null) before sending
      const payload = {
        ...form,
        latitude:  form.latitude  !== '' ? Number(form.latitude)  : null,
        longitude: form.longitude !== '' ? Number(form.longitude) : null,
      };
      editing === 'new'
        ? await chargeService.create(payload)
        : await chargeService.update(editing.chargeId, payload);

      setMsg({ type: 'success', text: 'Church saved!' });
      await load();
      setTimeout(() => { setEditing(null); setMsg(null); }, 1200);
    } catch (err) {
      setMsg({ type: 'error', text: typeof err === 'string' ? err : 'Save failed.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (c) => {
    if (!window.confirm(`Remove "${c.chargeName}"?`)) return;
    try { await chargeService.remove(c.chargeId); await load(); }
    catch { alert('Delete failed.'); }
  };

  const inputStyle = {
    width: '100%', padding: '11px 14px',
    border: '1.5px solid rgba(26,71,49,.2)', borderRadius: 6,
    fontSize: 14, outline: 'none',
    fontFamily: "'Lato',sans-serif", boxSizing: 'border-box',
  };
  const labelStyle = {
    display: 'block', fontSize: 11, fontWeight: 700,
    letterSpacing: '.12em', color: '#3d5247', marginBottom: 7,
  };

  // [fieldKey, label, placeholder, required]
  const FIELDS = [
    ['district',     'DISTRICT / AREA *',  'Sibasa Area',           true],
    ['city',         'CITY *',              'Thohoyandou',           true],
    ['province',     'PROVINCE',            'Limpopo',               false],
    ['address',      'ADDRESS',             '123 Church Street',     false],
    ['ministerName', 'MINISTER NAME',       'Rev. John Doe',         false],
    ['contactPhone', 'CONTACT PHONE',       '+27 15 123 4567',       false],
    ['contactEmail', 'CONTACT EMAIL',       'church@email.com',      false],
    ['websiteUrl',   'WEBSITE URL',         'https://church.org',    false],
    ['serviceTimes', 'SERVICE TIMES',       'Sunday 10:00 AM',       false],
    ['latitude',     'LATITUDE (for map)',  '-22.9087',              false],
    ['longitude',    'LONGITUDE (for map)', '30.4549',              false],
  ];

  return (
    <AdminLayout>
      {editing ? (
        /* ── FORM VIEW ── */
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
            <button
              onClick={cancel}
              style={{ background: 'transparent', border: '1px solid rgba(0,0,0,.15)', borderRadius: 6, padding: '8px 16px', cursor: 'pointer', fontSize: 13, color: '#6b8070', fontFamily: "'Lato',sans-serif" }}>
              ← Back
            </button>
            <h1 style={{ fontFamily: 'Georgia,serif', fontSize: 24, color: '#0d2b1a', margin: 0 }}>
              {editing === 'new' ? 'Add Church' : 'Edit Church'}
            </h1>
          </div>

          {msg && (
            <div style={{
              padding: '12px 16px', borderRadius: 6, marginBottom: 20, fontSize: 13,
              background: msg.type === 'success' ? 'rgba(37,96,64,.1)' : 'rgba(192,57,43,.08)',
              border: `1px solid ${msg.type === 'success' ? 'rgba(37,96,64,.3)' : 'rgba(192,57,43,.3)'}`,
              color: msg.type === 'success' ? '#1a4731' : '#c0392b',
            }}>
              {msg.type === 'success' ? '✓ ' : '⚠️ '}{msg.text}
            </div>
          )}

          <form onSubmit={handleSave} style={{ background: '#fff', borderRadius: 12, padding: '28px', border: '1px solid rgba(0,0,0,.07)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

              {/* Church name spans full width */}
              <div style={{ gridColumn: 'span 2' }}>
                <label style={labelStyle}>CHURCH NAME *</label>
                <input
                  required
                  value={form.chargeName}
                  onChange={e => setForm({ ...form, chargeName: e.target.value })}
                  placeholder="Bethel AME Church"
                  style={inputStyle}
                />
              </div>

              {/* All other fields using correct backend keys */}
              {FIELDS.map(([key, label, placeholder, required]) => (
                <div key={key}>
                  <label style={labelStyle}>{label}</label>
                  <input
                    required={required}
                    value={form[key] ?? ''}
                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                    placeholder={placeholder}
                    style={inputStyle}
                  />
                </div>
              ))}

              {/* Active toggle */}
              <div>
                <label style={labelStyle}>STATUS</label>
                <select
                  value={form.isActive ? 'true' : 'false'}
                  onChange={e => setForm({ ...form, isActive: e.target.value === 'true' })}
                  style={{ ...inputStyle, background: '#fff' }}>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button
                type="submit"
                disabled={saving}
                style={{ background: '#1a4731', color: '#fff', border: 'none', padding: '13px 32px', borderRadius: 8, fontFamily: "'Lato',sans-serif", fontSize: 14, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
                {saving ? 'Saving…' : editing === 'new' ? 'Add Church' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={cancel}
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
            <h1 style={{ fontFamily: 'Georgia,serif', fontSize: 28, color: '#0d2b1a', margin: 0 }}>
              Churches ({charges.length})
            </h1>
            <button
              onClick={openNew}
              style={{ background: '#c9a84c', color: '#0d2b1a', border: 'none', padding: '12px 24px', borderRadius: 8, fontFamily: "'Lato',sans-serif", fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
              + Add Church
            </button>
          </div>

          {loading ? <LoadingSpinner /> : (
            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid rgba(0,0,0,.07)', overflow: 'hidden' }}>
              <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {['Church', 'District', 'Minister', 'Service Times', 'Status', 'Actions'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontSize: 11, fontWeight: 700, letterSpacing: '.12em', color: '#6b8070', borderBottom: '1px solid rgba(0,0,0,.08)', background: '#f7f9f7' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {charges.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#aaa' }}>No churches yet.</td>
                    </tr>
                  ) : charges.map(c => (
                    <tr
                      key={c.chargeId}
                      style={{ borderBottom: '1px solid rgba(0,0,0,.05)' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f7f9f7'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 600, color: '#0d2b1a', fontSize: 14 }}>{c.chargeName}</div>
                        <div style={{ fontSize: 12, color: '#aaa', marginTop: 2 }}>📍 {c.city || '—'}</div>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: 13, color: '#6b8070' }}>{c.district || '—'}</td>
                      <td style={{ padding: '14px 16px', fontSize: 13, color: '#6b8070' }}>{c.ministerName || '—'}</td>
                      <td style={{ padding: '14px 16px', fontSize: 13, color: '#6b8070' }}>{c.serviceTimes || '—'}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{
                          fontSize: 10, fontWeight: 700, letterSpacing: '.1em', padding: '3px 10px', borderRadius: 20,
                          background: c.isActive ? 'rgba(37,96,64,.15)' : 'rgba(192,57,43,.1)',
                          color: c.isActive ? '#1a4731' : '#c0392b',
                        }}>
                          {c.isActive ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button
                            onClick={() => openEdit(c)}
                            style={{ background: 'rgba(37,96,64,.1)', color: '#1a4731', border: 'none', padding: '7px 14px', borderRadius: 5, cursor: 'pointer', fontSize: 12, fontFamily: "'Lato',sans-serif", fontWeight: 700 }}>
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDelete(c)}
                            style={{ background: 'rgba(192,57,43,.1)', color: '#c0392b', border: 'none', padding: '7px 14px', borderRadius: 5, cursor: 'pointer', fontSize: 12, fontFamily: "'Lato',sans-serif", fontWeight: 700 }}>
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

export default AdminCharges;