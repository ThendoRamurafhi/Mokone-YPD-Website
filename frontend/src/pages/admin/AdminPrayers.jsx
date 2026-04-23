import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import prayerService from '../../services/prayerService';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminPrayers = () => {
  const [pending,  setPending]  = useState([]);
  const [approved, setApproved] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [tab,      setTab]      = useState('pending');

  const load = async () => {
    try {
      setLoading(true);
      const [pend, appr] = await Promise.all([prayerService.getPending(), prayerService.getApproved()]);
      setPending(pend||[]);
      setApproved(appr.content||appr||[]);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleApprove = async (id) => {
    try { await prayerService.approve(id); await load(); }
    catch { alert('Approve failed.'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this prayer request?')) return;
    try { await prayerService.remove(id); await load(); }
    catch { alert('Delete failed.'); }
  };

  const list = tab === 'pending' ? pending : approved;

  return (
    <AdminLayout>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24, flexWrap:'wrap', gap:12 }}>
        <h1 style={{ fontFamily:'Georgia,serif', fontSize:28, color:'#0d2b1a' }}>Prayer Requests</h1>
        {pending.length > 0 && <span style={{ background:'rgba(192,57,43,.1)', color:'#c0392b', padding:'6px 14px', borderRadius:20, fontSize:12, fontWeight:700 }}>{pending.length} pending review</span>}
      </div>

      <div style={{ display:'flex', gap:8, marginBottom:20 }}>
        {['pending','approved'].map(t => (
          <button key={t} onClick={()=>setTab(t)} style={{ padding:'10px 20px', borderRadius:20, border:'1px solid rgba(26,71,49,.2)', background:tab===t?'#1a4731':'#fff', color:tab===t?'#fff':'#3d5247', fontFamily:"'Lato',sans-serif", fontSize:13, cursor:'pointer', transition:'all .2s', textTransform:'capitalize', fontWeight:700 }}>
            {t.charAt(0).toUpperCase()+t.slice(1)} ({t==='pending'?pending.length:approved.length})
          </button>
        ))}
      </div>

      {loading ? <LoadingSpinner /> : list.length === 0 ? (
        <div style={{ textAlign:'center', padding:'60px', color:'#aaa' }}>No {tab} prayer requests.</div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {list.map(p => (
            <div key={p.requestId} style={{ background:'#fff', borderRadius:12, padding:'20px 24px', border:'1px solid rgba(0,0,0,.07)' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:12, flexWrap:'wrap' }}>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', gap:10, alignItems:'center', marginBottom:8, flexWrap:'wrap' }}>
                    <span style={{ fontWeight:700, fontSize:14, color:'#0d2b1a' }}>{p.isAnonymous ? 'Anonymous' : p.requesterName}</span>
                    <span style={{ fontSize:11, padding:'3px 10px', borderRadius:20, background:'rgba(37,96,64,.1)', color:'#1a4731', fontWeight:700 }}>{p.requestType}</span>
                    <span style={{ fontSize:12, color:'#aaa' }}>{p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-ZA') : ''}</span>
                  </div>
                  <p style={{ fontSize:14, color:'#3d5247', lineHeight:1.7 }}>{p.requestText}</p>
                </div>
                <div style={{ display:'flex', gap:8, flexShrink:0 }}>
                  {tab === 'pending' && (
                    <button onClick={()=>handleApprove(p.requestId)} style={{ background:'rgba(37,96,64,.1)', color:'#1a4731', border:'none', padding:'8px 16px', borderRadius:6, cursor:'pointer', fontSize:13, fontFamily:"'Lato',sans-serif", fontWeight:700 }}>✓ Approve</button>
                  )}
                  <button onClick={()=>handleDelete(p.requestId)} style={{ background:'rgba(192,57,43,.1)', color:'#c0392b', border:'none', padding:'8px 16px', borderRadius:6, cursor:'pointer', fontSize:13, fontFamily:"'Lato',sans-serif", fontWeight:700 }}>Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminPrayers;
