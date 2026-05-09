import React, { useState } from 'react';
import rsvpService from '../../services/rsvpService';

// Single Responsibility: this component only handles the RSVP submission flow
const RSVPForm = ({ event, currentUser, onSuccess }) => {
  const [form, setForm]       = useState({ guestName:'', guestEmail:'', guestPhone:'', attendanceCount:1 });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [done, setDone]       = useState(false);

  const spotsLeft = event.maxAttendees
    ? event.maxAttendees - (event.currentAttendees || 0)
    : null;

  const handleSubmit = async () => {
    if (!form.guestName.trim() || !form.guestEmail.trim()) {
      setError('Name and email are required.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // Use member RSVP if logged in, guest RSVP otherwise (Strategy pattern)
      if (currentUser) {
        await rsvpService.submitMember(event.eventId, currentUser.userId, {
          attendanceCount: form.attendanceCount,
        });
      } else {
        await rsvpService.submitGuest(event.eventId, {
          guestName:       form.guestName,
          guestEmail:      form.guestEmail,
          guestPhone:      form.guestPhone || null,
          attendanceCount: form.attendanceCount,
        });
      }
      setDone(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      const msg = err.response?.data?.message || 'Could not complete your RSVP. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div style={{ textAlign:'center', padding:'32px 0' }}>
        <div style={{ fontSize:40, marginBottom:12 }}>✅</div>
        <h3 style={{ fontFamily:'Georgia,serif', fontSize:20, color:'#1a4731', marginBottom:8 }}>You're registered!</h3>
        <p style={{ color:'#6b8070', fontSize:14 }}>A confirmation has been sent to {form.guestEmail || currentUser?.email}.</p>
      </div>
    );
  }

  return (
    <div>
      {spotsLeft !== null && (
        <p style={{ fontSize:13, color: spotsLeft < 10 ? '#c0392b' : '#6b8070', marginBottom:16 }}>
          {spotsLeft} spot{spotsLeft !== 1 ? 's' : ''} remaining
        </p>
      )}

      {!currentUser && (
        <>
          {[['guestName','Your Name *','text'],['guestEmail','Email Address *','email'],['guestPhone','Phone (optional)','tel']].map(([k,l,t]) => (
            <div key={k} style={{ marginBottom:14 }}>
              <label style={{ display:'block', fontSize:11, fontWeight:700, letterSpacing:'.12em', color:'#3d5247', marginBottom:6 }}>{l.toUpperCase()}</label>
              <input
                type={t}
                value={form[k]}
                onChange={e => setForm({ ...form, [k]: e.target.value })}
                style={{ width:'100%', padding:'12px 14px', border:'1.5px solid rgba(26,71,49,.2)', borderRadius:6, fontSize:14, outline:'none', fontFamily:"'Lato',sans-serif", boxSizing:'border-box' }}
              />
            </div>
          ))}
        </>
      )}

      <div style={{ marginBottom:18 }}>
        <label style={{ display:'block', fontSize:11, fontWeight:700, letterSpacing:'.12em', color:'#3d5247', marginBottom:6 }}>NUMBER OF PEOPLE</label>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          {[1,2,3,4,5].map(n => (
            <button key={n} onClick={() => setForm({ ...form, attendanceCount: n })}
              style={{ width:40, height:40, borderRadius:'50%', border:`2px solid ${form.attendanceCount===n?'#1a4731':'rgba(26,71,49,.2)'}`, background: form.attendanceCount===n?'#1a4731':'#fff', color: form.attendanceCount===n?'#fff':'#1a4731', fontSize:14, fontWeight:700, cursor:'pointer', transition:'all .2s' }}>
              {n}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p style={{ color:'#c0392b', fontSize:13, marginBottom:12, padding:'10px', background:'rgba(192,57,43,.08)', borderRadius:6 }}>{error}</p>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{ width:'100%', background: loading?'#888':'#1a4731', color:'#fff', border:'none', padding:'15px', borderRadius:6, fontFamily:'Lato,sans-serif', fontSize:13, fontWeight:700, cursor: loading?'not-allowed':'pointer', letterSpacing:'.08em', transition:'background .2s' }}>
        {loading ? 'Reserving your spot...' : `RSVP — ${form.attendanceCount} person${form.attendanceCount>1?'s':''}`}
      </button>
    </div>
  );
};

export default RSVPForm;