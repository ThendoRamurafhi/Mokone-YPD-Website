import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import eventService from '../services/eventService';
import mediaService from '../services/mediaService';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/common/LoadingSpinner';

// ── Doc 8's richer dark-mode-aware category colours ──
const CAT_COLOR = {
  CONFERENCE:  { bg:'rgba(26,86,160,.2)',   text:'#93b4e8' },
  YOUTH:       { bg:'rgba(107,33,168,.2)',  text:'#c4a0f0' },
  COMMUNITY:   { bg:'rgba(26,102,64,.2)',   text:'#6ecfa0' },
  WORSHIP:     { bg:'rgba(201,168,76,.2)',  text:'#c9a84c' },
  EDUCATIONAL: { bg:'rgba(153,27,27,.2)',   text:'#f09090' },
  FUNDRAISER:  { bg:'rgba(201,168,76,.2)',  text:'#c9a84c' },
  OTHER:       { bg:'rgba(255,255,255,.08)',text:'rgba(255,255,255,.7)' },
};

function useCountdown(targetDate) {
  const calc = useCallback(() => {
    const diff = new Date(targetDate) - Date.now();
    if (diff <= 0) return { days:0, hours:0, minutes:0, seconds:0, over:true };
    return {
      days:    Math.floor(diff / 86400000),
      hours:   Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000)  / 60000),
      seconds: Math.floor((diff % 60000)    / 1000),
      over: false,
    };
  }, [targetDate]);
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  }, [calc]);
  return time;
}

const CountBox = ({ value, label }) => (
  <div style={{
    display:'flex', flexDirection:'column', alignItems:'center',
    background:'rgba(255,255,255,.05)',
    border:'1px solid rgba(201,168,76,.18)',
    borderRadius:8, padding:'12px 16px', minWidth:60,
  }}>
    <span style={{
      fontFamily:"'Cormorant Garamond',Georgia,serif",
      fontSize:'clamp(1.4rem,3.5vw,2.2rem)',
      fontWeight:700, color:'#c9a84c', lineHeight:1,
      fontVariantNumeric:'tabular-nums',
    }}>
      {String(value).padStart(2,'0')}
    </span>
    <span style={{
      fontFamily:"'Lato',sans-serif", fontSize:8, fontWeight:700,
      letterSpacing:'.22em', color:'rgba(255,255,255,.35)',
      marginTop:5, textTransform:'uppercase',
    }}>
      {label}
    </span>
  </div>
);

const EventDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [event,       setEvent]       = useState(null);
  const [coverImage,  setCoverImage]  = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);
  const [rsvpDone,    setRsvpDone]    = useState(false);
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [rsvpError,   setRsvpError]   = useState(null);
  const [form, setForm] = useState({ name:'', email:'', attendees:1 });

  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await eventService.getById(id);
        setEvent(data);
        if (user) setForm(f => ({
          ...f,
          name:  `${user.firstName||''} ${user.lastName||''}`.trim(),
          email: user.email || '',
        }));
        // Admin-uploaded cover image — shown in body, not hero
        try {
          const covers = await mediaService.getByUsage('EVENT_COVER');
          if (covers.length > 0) setCoverImage(covers[0].fileUrl);
        } catch { /* no cover uploaded yet */ }
      } catch {
        setError('Event not found.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, user]);

  const targetDT = event?.eventDate
    ? `${event.eventDate}T${event.eventTime ? String(event.eventTime).slice(0, 5) : '00:00'}:00`
    : new Date().toISOString();

  const countdown   = useCountdown(targetDT);
  const spotsLeft   = event?.maxAttendees ? event.maxAttendees - (event.currentAttendees || 0) : null;
  const capacityPct = event?.maxAttendees ? Math.min(100, Math.round(((event.currentAttendees || 0) / event.maxAttendees) * 100)) : 0;
  const cat         = CAT_COLOR[event?.category] || CAT_COLOR.OTHER;

  const formatDate = d =>
    new Date(d).toLocaleDateString('en-ZA', { weekday:'long', year:'numeric', month:'long', day:'numeric' });

  const formatTime = t => {
    if (!t) return 'TBA';
    const p = String(t).split(':');
    const h = parseInt(p[0], 10);
    return `${h % 12 || 12}:${p[1] || '00'} ${h >= 12 ? 'PM' : 'AM'}`;
  };

  const submitRSVP = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) { setRsvpError('Name and email are required.'); return; }
    setRsvpLoading(true); setRsvpError(null);
    try {
      await eventService.rsvp(event.eventId, {
        guestName: form.name, guestEmail: form.email,
        attendanceCount: form.attendees, userId: user?.userId || null,
      });
      setRsvpDone(true);
      const fresh = await eventService.getById(id);
      setEvent(fresh);
    } catch (err) {
      setRsvpError(typeof err === 'string' ? err : 'RSVP failed. Please try again.');
    } finally {
      setRsvpLoading(false);
    }
  };

  if (loading) return (
    <div style={{ display:'flex', justifyContent:'center', alignItems:'center', minHeight:'100vh' }}>
      <LoadingSpinner />
    </div>
  );

  if (error || !event) return (
    <div style={{ textAlign:'center', padding:'120px 24px', fontFamily:'Georgia,serif' }}>
      <div style={{ fontSize:64, marginBottom:16 }}>📅</div>
      <h2 style={{ color:'#0d2b1a', marginBottom:12 }}>Event not found</h2>
      <Link to="/events" style={{ color:'#1a4731', fontWeight:700 }}>← Back to Events</Link>
    </div>
  );

  return (
    <div style={{ fontFamily:"'Lato',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Lato:wght@300;400;700&display=swap');
        *,*::before,*::after { box-sizing:border-box; }
        .det-input { width:100%; padding:12px 14px; border:1.5px solid rgba(26,71,49,.2); border-radius:7px; font-size:14px; outline:none; font-family:'Lato',sans-serif; transition:border-color .2s; background:#fff; }
        .det-input:focus { border-color:#1a4731; }
        .att-btn { width:42px; height:42px; border-radius:50%; border:2px solid rgba(26,71,49,.2); background:#fff; color:#1a4731; font-size:14px; font-weight:700; cursor:pointer; transition:all .2s; display:flex; align-items:center; justify-content:center; font-family:'Lato',sans-serif; }
        .att-btn.on { background:#1a4731; color:#fff; border-color:#1a4731; }
        .att-btn:hover:not(.on) { border-color:#1a4731; }
        .info-chip { display:flex; align-items:center; gap:10px; padding:14px 18px; background:#f7f9f7; border:1px solid rgba(26,71,49,.08); border-radius:10px; }
        @media(max-width:900px) {
          .ev-body-grid { grid-template-columns:1fr !important; }
          .cd-row { flex-wrap:wrap; }
          .rsvp-sticky { position:static !important; }
        }
      `}</style>

      {/* ══════════════════════════
          HERO — refined dark, no cover-image background
      ══════════════════════════ */}
      <div style={{
        minHeight:'62vh',
        background: event.coverImageUrl
          ? `linear-gradient(to bottom,rgba(7,24,18,.45) 0%,rgba(13,43,26,.9) 100%),url(${event.coverImageUrl}) center/cover no-repeat`
          : 'linear-gradient(150deg,#071812 0%,#0d2b1a 50%,#1a4731 100%)',
        display:'flex', flexDirection:'column', justifyContent:'flex-end',
        padding:'80px 24px 56px', position:'relative', overflow:'hidden',
      }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:'repeating-linear-gradient(90deg,transparent,transparent 80px,rgba(201,168,76,.03) 80px,rgba(201,168,76,.03) 81px)', pointerEvents:'none' }} />

        <div style={{ maxWidth:960, margin:'0 auto', width:'100%', position:'relative', zIndex:1 }}>
          <Link to="/events" style={{ display:'inline-flex', alignItems:'center', gap:6, color:'rgba(255,255,255,.5)', textDecoration:'none', fontSize:11, fontWeight:700, letterSpacing:'.12em', marginBottom:28 }}>
            ← ALL EVENTS
          </Link>

          <div style={{ marginBottom:14 }}>
            <span style={{ fontSize:10, fontWeight:700, letterSpacing:'.18em', padding:'5px 14px', borderRadius:3, background:cat.bg, color:cat.text }}>
              {event.category}
            </span>
          </div>

          <h1 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'clamp(2.2rem,5.5vw,4rem)', fontWeight:700, color:'#fff', lineHeight:1.1, marginBottom:18, maxWidth:720 }}>
            {event.title}
          </h1>

          <div style={{ display:'flex', gap:24, flexWrap:'wrap', marginBottom:44 }}>
            {[['📅', formatDate(event.eventDate)], ['🕐', formatTime(event.eventTime)], ['📍', event.location || 'TBA']].map(([icon, text]) => (
              <span key={icon} style={{ fontSize:13, color:'rgba(255,255,255,.7)', display:'flex', alignItems:'center', gap:7 }}>
                {icon} {text}
              </span>
            ))}
          </div>

          {!countdown.over ? (
            <div>
              <p style={{ fontSize:10, fontWeight:700, letterSpacing:'.22em', color:'#c9a84c', marginBottom:14 }}>EVENT STARTS IN</p>
              <div className="cd-row" style={{ display:'flex', gap:10 }}>
                <CountBox value={countdown.days}    label="Days"    />
                <CountBox value={countdown.hours}   label="Hours"   />
                <CountBox value={countdown.minutes} label="Minutes" />
                <CountBox value={countdown.seconds} label="Seconds" />
              </div>
            </div>
          ) : (
            <div style={{ padding:'14px 20px', background:'rgba(201,168,76,.12)', border:'1px solid rgba(201,168,76,.3)', borderRadius:8, display:'inline-block' }}>
              <span style={{ color:'#c9a84c', fontWeight:700, fontSize:13 }}>This event has already taken place</span>
            </div>
          )}
        </div>
      </div>

      {/* ══════════════════════════
          BODY
      ══════════════════════════ */}
      <div style={{ background:'#f7f9f7', padding:'52px 24px 80px' }}>
        <div className="ev-body-grid" style={{ maxWidth:1100, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 370px', gap:36, alignItems:'start' }}>

          {/* ── LEFT ── */}
          <div>
            {/* Info chips */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(190px,1fr))', gap:12, marginBottom:24 }}>
              {[
                ['📅', 'Date',     formatDate(event.eventDate)],
                ['🕐', 'Time',     formatTime(event.eventTime)],
                ['📍', 'Location', event.location || 'TBA'],
                event.maxAttendees ? ['👥', 'Capacity', `${event.maxAttendees} people`] : null,
              ].filter(Boolean).map(([icon, label, value]) => (
                <div key={label} className="info-chip">
                  <span style={{ fontSize:20 }}>{icon}</span>
                  <div>
                    <div style={{ fontSize:9, fontWeight:700, letterSpacing:'.14em', color:'#6b8070', marginBottom:2 }}>{label.toUpperCase()}</div>
                    <div style={{ fontSize:13, fontWeight:600, color:'#0d2b1a' }}>{value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Cover image: full natural height, no cropping ── */}
            {coverImage ? (
              <div style={{ borderRadius:14, overflow:'hidden', marginBottom:24, border:'1px solid rgba(0,0,0,.07)', boxShadow:'0 4px 20px rgba(26,71,49,.08)', background:'#e8ede9' }}>
                <img
                  src={coverImage}
                  alt={event.title}
                  style={{ width:'100%', height:'auto', display:'block' }}
                  onError={e => { e.target.parentNode.style.display = 'none'; }}
                />
              </div>
            ) : (
              /* Placeholder when no cover image is uploaded yet */
              <div style={{
                borderRadius:14, marginBottom:24,
                border:'1px solid rgba(26,71,49,.1)',
                background:'linear-gradient(135deg,rgba(26,71,49,.06) 0%,rgba(201,168,76,.06) 100%)',
                display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
                padding:'48px 24px', gap:12,
              }}>
                <div style={{ fontSize:40, opacity:.35 }}>🖼️</div>
                <p style={{ fontSize:12, fontWeight:600, letterSpacing:'.1em', color:'#6b8070', margin:0 }}>
                  NO COVER IMAGE UPLOADED
                </p>
                <p style={{ fontSize:11, color:'#aab8b0', margin:0, textAlign:'center', maxWidth:260, lineHeight:1.6 }}>
                  Upload an image in the admin panel under Media with usage <strong>EVENT_COVER</strong>
                </p>
              </div>
            )}

            {/* Registration bar */}
            {event.maxAttendees && (
              <div style={{ background:'#fff', borderRadius:12, padding:'20px 24px', border:'1px solid rgba(0,0,0,.07)', marginBottom:20 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10 }}>
                  <span style={{ fontSize:13, fontWeight:700, color:'#0d2b1a' }}>Registration</span>
                  <span style={{ fontSize:13, fontWeight:700, color: spotsLeft < 10 ? '#c0392b' : '#1a6640' }}>
                    {spotsLeft} spot{spotsLeft !== 1 ? 's' : ''} remaining
                  </span>
                </div>
                <div style={{ height:5, background:'rgba(26,71,49,.1)', borderRadius:3, overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${capacityPct}%`, background: capacityPct > 80 ? '#c0392b' : '#1a4731', borderRadius:3, transition:'width .6s' }} />
                </div>
                <div style={{ fontSize:11, color:'#6b8070', marginTop:7 }}>{event.currentAttendees || 0} of {event.maxAttendees} registered</div>
              </div>
            )}

            {/* Description */}
            {event.description && (
              <div style={{ background:'#fff', borderRadius:12, padding:'26px 28px', border:'1px solid rgba(0,0,0,.07)' }}>
                <h2 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:21, fontWeight:700, color:'#0d2b1a', marginBottom:14 }}>
                  About This Event
                </h2>
                <p style={{ fontSize:14, color:'#3d5247', lineHeight:1.9 }}>{event.description}</p>
              </div>
            )}
          </div>

          {/* ── RIGHT: RSVP ── */}
          <div className="rsvp-sticky" style={{ position:'sticky', top:88 }}>
            <div style={{ background:'#fff', borderRadius:14, border:'1px solid rgba(0,0,0,.07)', overflow:'hidden', boxShadow:'0 8px 32px rgba(26,71,49,.08)' }}>

              <div style={{ background:'linear-gradient(135deg,#1a4731,#256040)', padding:'22px 24px' }}>
                <div style={{ fontSize:9, fontWeight:700, letterSpacing:'.22em', color:'#c9a84c', marginBottom:7 }}>RSVP FOR THIS EVENT</div>
                <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:18, color:'#fff', lineHeight:1.3, marginBottom:4 }}>{event.title}</h3>
                <p style={{ fontSize:11, color:'rgba(255,255,255,.5)' }}>
                  {formatDate(event.eventDate)}{event.eventTime ? ` · ${formatTime(event.eventTime)}` : ''}
                </p>
              </div>

              <div style={{ padding:'22px 24px' }}>
                {rsvpDone ? (
                  <div style={{ textAlign:'center', padding:'16px 0' }}>
                    <div style={{ width:56, height:56, borderRadius:'50%', background:'rgba(26,102,64,.1)', border:'2px solid #1a6640', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px', fontSize:24, color:'#1a6640' }}>✓</div>
                    <h4 style={{ fontFamily:'Georgia,serif', fontSize:17, color:'#0d2b1a', marginBottom:7 }}>You're registered!</h4>
                    <p style={{ fontSize:12, color:'#6b8070', lineHeight:1.65 }}>
                      Confirmation sent to <strong>{form.email}</strong>.
                    </p>
                    <button
                      onClick={() => { setRsvpDone(false); setForm({ name:'', email:'', attendees:1 }); }}
                      style={{ marginTop:16, background:'transparent', border:'1.5px solid #1a4731', color:'#1a4731', padding:'9px 18px', borderRadius:6, fontFamily:'Lato,sans-serif', fontSize:11, fontWeight:700, cursor:'pointer' }}>
                      Register Another Person
                    </button>
                  </div>
                ) : countdown.over ? (
                  <div style={{ textAlign:'center', padding:'12px 0' }}>
                    <p style={{ color:'#6b8070', fontSize:13, lineHeight:1.6 }}>Registration is now closed.</p>
                    <Link to="/events" style={{ display:'inline-block', marginTop:12, color:'#1a4731', fontWeight:700, fontSize:13 }}>Browse Events →</Link>
                  </div>
                ) : (
                  <form onSubmit={submitRSVP}>
                    <div style={{ marginBottom:12 }}>
                      <label style={{ display:'block', fontSize:10, fontWeight:700, letterSpacing:'.14em', color:'#3d5247', marginBottom:6 }}>FULL NAME *</label>
                      <input className="det-input" type="text" required placeholder="Thendo Ramurafhi"
                        value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                    </div>
                    <div style={{ marginBottom:12 }}>
                      <label style={{ display:'block', fontSize:10, fontWeight:700, letterSpacing:'.14em', color:'#3d5247', marginBottom:6 }}>EMAIL ADDRESS *</label>
                      <input className="det-input" type="email" required placeholder="you@example.com"
                        value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                    </div>
                    <div style={{ marginBottom:18 }}>
                      <label style={{ display:'block', fontSize:10, fontWeight:700, letterSpacing:'.14em', color:'#3d5247', marginBottom:9 }}>NUMBER OF PEOPLE</label>
                      <div style={{ display:'flex', gap:7 }}>
                        {[1, 2, 3, 4, 5].map(n => (
                          <button type="button" key={n}
                            className={`att-btn${form.attendees === n ? ' on' : ''}`}
                            onClick={() => setForm({ ...form, attendees: n })}>
                            {n}
                          </button>
                        ))}
                      </div>
                    </div>
                    {rsvpError && (
                      <div style={{ background:'rgba(192,57,43,.08)', border:'1px solid rgba(192,57,43,.2)', borderRadius:6, padding:'9px 12px', marginBottom:12 }}>
                        <p style={{ color:'#c0392b', fontSize:12, margin:0 }}>{rsvpError}</p>
                      </div>
                    )}
                    <button type="submit" disabled={rsvpLoading || spotsLeft === 0}
                      style={{ width:'100%', background:(rsvpLoading || spotsLeft === 0) ? '#ccc' : '#c9a84c', color:'#0d2b1a', border:'none', padding:'14px', borderRadius:7, fontFamily:'Lato,sans-serif', fontSize:12, fontWeight:700, cursor:(rsvpLoading || spotsLeft === 0) ? 'not-allowed' : 'pointer', letterSpacing:'.1em', transition:'background .2s' }}
                      onMouseEnter={e => { if (!rsvpLoading && spotsLeft !== 0) e.currentTarget.style.background = '#e0c060'; }}
                      onMouseLeave={e => { if (!rsvpLoading && spotsLeft !== 0) e.currentTarget.style.background = '#c9a84c'; }}>
                      {rsvpLoading ? 'Reserving...' : spotsLeft === 0 ? 'EVENT FULL' : `RSVP — ${form.attendees} PERSON${form.attendees > 1 ? 'S' : ''}`}
                    </button>
                    <p style={{ fontSize:10, color:'#bbb', textAlign:'center', marginTop:10 }}>Free · No account required</p>
                  </form>
                )}
              </div>
            </div>

            {/* Share */}
            <div style={{ marginTop:12, background:'#fff', borderRadius:12, padding:'16px 18px', border:'1px solid rgba(0,0,0,.07)' }}>
              <p style={{ fontSize:9, fontWeight:700, letterSpacing:'.16em', color:'#6b8070', marginBottom:10 }}>SHARE THIS EVENT</p>
              <div style={{ display:'flex', gap:7 }}>
                {[
                  { label:'WhatsApp', color:'#25D366', fn: () => window.open(`https://wa.me/?text=${encodeURIComponent(event.title + ' — ' + window.location.href)}`, '_blank') },
                  { label:'Facebook', color:'#1877F2', fn: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank') },
                  { label:'Copy',     color:'#1a4731', fn: () => navigator.clipboard.writeText(window.location.href) },
                ].map(({ label, color, fn }) => (
                  <button key={label} onClick={fn}
                    style={{ flex:1, padding:'8px 4px', borderRadius:6, border:`1.5px solid ${color}33`, background:`${color}10`, color, fontSize:10, fontWeight:700, cursor:'pointer', fontFamily:'Lato,sans-serif', transition:'all .2s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = color; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = `${color}10`; e.currentTarget.style.color = color; }}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;