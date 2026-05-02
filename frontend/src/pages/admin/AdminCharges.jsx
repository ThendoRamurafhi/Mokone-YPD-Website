import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import chargeService from '../../services/chargeService';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const EMPTY_CHARGE = { 
  chargeName:'', 
  district:'',        // was 'area'
  city:'', 
  address:'', 
  ministerName:'',    // was 'pastorName'
  contactPhone:'',    // was 'pastorContact' and 'phone'
  contactEmail:'',    // was 'email'
  serviceTime:'Sunday 10:00', 
  isActive: true 
};

const AdminCharges = () => {
  const [charges, setCharges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form,    setForm]    = useState(EMPTY_CHARGE);
  const [saving,  setSaving]  = useState(false);
  const [msg,     setMsg]     = useState(null);

  const load = async () => {
    try { setLoading(true); const d = await chargeService.getAll({ page:0, size:200 }); setCharges(d.content||d||[]); }
    catch {} finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openNew  = () => { setForm(EMPTY_CHARGE); setEditing('new'); setMsg(null); };
  const openEdit = (c) => { setForm(c); setEditing(c); setMsg(null); };
  const cancel   = () => { setEditing(null); setMsg(null); };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      editing==='new' ? await chargeService.create(form) : await chargeService.update(editing.chargeId, form);
      setMsg({ type:'success', text:'Church saved!' });
      await load();
      setTimeout(() => { setEditing(null); setMsg(null); }, 1000);
    } catch (err) {
      setMsg({ type:'error', text: typeof err==='string' ? err : 'Save failed.' });
    } finally { setSaving(false); }
  };

  const handleDelete = async (c) => {
    if (!window.confirm(`Remove "${c.chargeName}"?`)) return;
    try { await chargeService.remove(c.chargeId); await load(); }
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
            <h1 style={{ fontFamily:'Georgia,serif', fontSize:24, color:'#0d2b1a' }}>{editing==='new'?'Add Church':'Edit Church'}</h1>
          </div>
          {msg && <div style={{ padding:'12px 16px', borderRadius:6, marginBottom:20, background:msg.type==='success'?'rgba(37,96,64,.1)':'rgba(192,57,43,.08)', border:`1px solid ${msg.type==='success'?'rgba(37,96,64,.3)':'rgba(192,57,43,.3)'}`, color:msg.type==='success'?'#1a4731':'#c0392b', fontSize:13 }}>{msg.text}</div>}
          <form onSubmit={handleSave} style={{ background:'#fff', borderRadius:12, padding:'28px', border:'1px solid rgba(0,0,0,.07)' }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
              <div style={{ gridColumn:'span 2', marginBottom:4 }}>
                <label style={labelStyle}>CHURCH NAME *</label>
                <input required value={form.chargeName} onChange={e=>setForm({...form,chargeName:e.target.value})} placeholder="Bethel AME Church" style={inputStyle} />
              </div>
              {[['area','Area / District *','Sibasa Area',true],['city','City *','Pretoria',true],['address','Address','123 Church Street',false],['pastorName','Pastor Name','Rev. John Doe',false],['pastorContact','Pastor Contact','pastor@email.com',false],['phone','Phone','+27 12 345 6789',false],['email','Email','church@email.com',false],['memberCount','Member Count','250',false],['serviceTime','Service Times','Sunday 10:00',false]].map(([k,l,ph,req])=>(
                <div key={k} style={{ marginBottom:4 }}>
                  <label style={labelStyle}>{l}</label>
                  <input required={req} value={form[k]||''} onChange={e=>setForm({...form,[k]:e.target.value})} placeholder={ph} style={inputStyle} />
                </div>
              ))}
              <div style={{ marginBottom:4 }}>
                <label style={labelStyle}>STATUS</label>
                <select value={form.status||'ACTIVE'} onChange={e=>setForm({...form,status:e.target.value})} style={{ ...inputStyle, background:'#fff' }}>
                  {['ACTIVE','INACTIVE','PENDING'].map(s=><option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display:'flex', gap:12, marginTop:20 }}>
              <button type="submit" disabled={saving} style={{ background:'#1a4731', color:'#fff', border:'none', padding:'13px 32px', borderRadius:8, fontFamily:"'Lato',sans-serif", fontSize:14, fontWeight:700, cursor:'pointer', opacity:saving?.7:1 }}>
                {saving ? 'Saving…' : editing==='new' ? 'Add Church' : 'Save Changes'}
              </button>
              <button type="button" onClick={cancel} style={{ background:'transparent', border:'1px solid rgba(0,0,0,.18)', color:'#6b8070', padding:'13px 24px', borderRadius:8, fontFamily:"'Lato',sans-serif", fontSize:14, cursor:'pointer' }}>Cancel</button>
            </div>
          </form>
        </div>
      ) : (
        <div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24, flexWrap:'wrap', gap:12 }}>
            <h1 style={{ fontFamily:'Georgia,serif', fontSize:28, color:'#0d2b1a' }}>Churches ({charges.length})</h1>
            <button onClick={openNew} style={{ background:'#c9a84c', color:'#0d2b1a', border:'none', padding:'12px 24px', borderRadius:8, fontFamily:"'Lato',sans-serif", fontSize:14, fontWeight:700, cursor:'pointer' }}>+ Add Church</button>
          </div>
          {loading ? <LoadingSpinner /> : (
            <div style={{ background:'#fff', borderRadius:12, border:'1px solid rgba(0,0,0,.07)', overflow:'hidden' }}>
              <table className="admin-table">
                <thead><tr><th>Church</th><th>Area</th><th>Pastor</th><th>Members</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {charges.length===0 ? <tr><td colSpan={6} style={{ textAlign:'center', padding:'40px', color:'#aaa' }}>No churches yet.</td></tr>
                  : charges.map(c=>(
                    <tr key={c.chargeId}>
                      <td><div style={{ fontWeight:600, color:'#0d2b1a' }}>{c.chargeName}</div><div style={{ fontSize:12, color:'#aaa' }}>📍 {c.city}</div></td>
                      <td style={{ fontSize:13 }}>{c.area||c.district||'—'}</td>
                      <td style={{ fontSize:13 }}>{c.pastorName||'—'}</td>
                      <td style={{ fontSize:13 }}>{c.memberCount||'—'}</td>
                      <td><span className="badge" style={{ background:c.status==='ACTIVE'?'rgba(37,96,64,.1)':'rgba(192,57,43,.1)', color:c.status==='ACTIVE'?'#1a4731':'#c0392b' }}>{c.status}</span></td>
                      <td><div style={{ display:'flex', gap:8 }}>
                        <button onClick={()=>openEdit(c)} style={{ background:'rgba(37,96,64,.1)', color:'#1a4731', border:'none', padding:'7px 14px', borderRadius:5, cursor:'pointer', fontSize:12, fontFamily:"'Lato',sans-serif", fontWeight:700 }}>Edit</button>
                        <button onClick={()=>handleDelete(c)} style={{ background:'rgba(192,57,43,.1)', color:'#c0392b', border:'none', padding:'7px 14px', borderRadius:5, cursor:'pointer', fontSize:12, fontFamily:"'Lato',sans-serif", fontWeight:700 }}>Remove</button>
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

export default AdminCharges;
