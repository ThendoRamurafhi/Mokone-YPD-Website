import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import eventService from '../services/eventService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useAuth } from '../hooks/useAuth';

const EventsPage = () => {
  const [events,           setEvents]           = useState([]);
  const [loading,          setLoading]          = useState(true);
  const [error,            setError]            = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [view,             setView]             = useState('grid');
  const [rsvpEvent,        setRsvpEvent]        = useState(null);
  const [rsvpForm,         setRsvpForm]         = useState({ name:'', email:'', attendees:1 });
  const [rsvpDone,         setRsvpDone]         = useState(false);
  const [rsvpLoading,      setRsvpLoading]      = useState(false);

  const { user } = useAuth();

  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await eventService.getAll({ page: 0, size: 50 });
        // Spring Boot returns { content: [...], totalPages, totalElements }
        setEvents(data.content || data || []);
      } catch (err) {
        setError('Unable to load events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const categories = ['ALL', 'YOUTH', 'COMMUNITY', 'CONFERENCE', 'WORSHIP', 'EDUCATIONAL'];

  const CAT_STYLE = {
    CONFERENCE:  { bg:'rgba(26,86,160,.1)',  text:'#1a56a0' },
    YOUTH:       { bg:'rgba(107,33,168,.1)', text:'#6b21a8' },
    COMMUNITY:   { bg:'rgba(26,102,64,.1)',  text:'#1a6640' },
    WORSHIP:     { bg:'rgba(146,64,14,.1)',  text:'#92400e' },
    EDUCATIONAL: { bg:'rgba(153,27,27,.1)',  text:'#991b1b' },
  };

  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const getDay   = d => new Date(d).getDate();
  const getMonth = d => MONTHS[new Date(d).getMonth()].toUpperCase();
  const formatDate = d => new Date(d).toLocaleDateString('en-ZA', { year:'numeric', month:'long', day:'numeric' });
  const spotsLeft  = e => e.maxAttendees ? e.maxAttendees - (e.currentAttendees || 0) : null;
  const capacity   = e => e.maxAttendees ? Math.round(((e.currentAttendees||0)/e.maxAttendees)*100) : 0;

  const filtered = events.filter(e => selectedCategory === 'ALL' || e.category === selectedCategory);
  const featured = events.filter(e => e.featured)
  
  const handleRSVP = (ev) => { setRsvpEvent(ev); setRsvpDone(false); setRsvpForm({ name: user?.firstName || '', email: user?.email || '', attendees: 1 }); };

  const submitRSVP = async (e) => {
    e.preventDefault();
    setRsvpLoading(true);
    try {
      await eventService.rsvp(rsvpEvent.eventId, {
        guestName: rsvpForm.name,
        guestEmail: rsvpForm.email,
        attendanceCount: rsvpForm.attendees,
        userId: user?.userId || null,
      });
      setRsvpDone(true);
      // Refresh events to update attendee count
      const data = await eventService.getAll({ page:0, size:50 });
      setEvents(data.content || data || []);
    } catch (err) {
      alert(typeof err === 'string' ? err : 'RSVP failed. Please try again.');
    } finally {
      setRsvpLoading(false);
    }
  };

  return (
    <div style={{ fontFamily:"'Lato',sans-serif", paddingTop:64 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Lato:wght@300;400;700&display=swap');
        .ev-card { background:#fff; border-radius:12px; border:1px solid rgba(0,0,0,.07); overflow:hidden; transition:all .3s; }
        .ev-card:hover { transform:translateY(-4px); box-shadow:0 16px 40px rgba(26,71,49,.12); }
        .cat-pill { padding:8px 18px; border-radius:20px; font-family:'Lato',sans-serif; font-size:12px; cursor:pointer; transition:all .2s; border:1px solid rgba(26,71,49,.2); background:#fff; color:#3d5247; }
        .cat-pill.active { background:#1a4731; color:#fff; border-color:#1a4731; }
        .cat-pill:hover:not(.active) { border-color:#1a4731; }
        .view-btn { padding:7px 14px; border-radius:6px; border:1px solid rgba(26,71,49,.2); background:transparent; cursor:pointer; transition:all .2s; color:#3d5247; font-family:'Lato',sans-serif; font-size:12px; }
        .view-btn.active { background:#1a4731; color:#fff; border-color:#1a4731; }
        .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,.55); z-index:200; display:flex; align-items:center; justify-content:center; padding:24px; }
        .modal-box { background:#fff; border-radius:14px; max-width:500px; width:100%; max-height:90vh; overflow-y:auto; }
      `}</style>

      {/* ── HERO ── */}
      <div style={{ background:'linear-gradient(150deg,#071812,#0d2b1a 50%,#1a4731)', padding:'120px 24px 80px', textAlign:'center' }}>
        <span style={{ fontSize:10, fontWeight:700, letterSpacing:'.24em', color:'#c9a84c', display:'block', marginBottom:12, fontFamily:'Lato,sans-serif' }}>MOKONE YPD CONFERENCE</span>
        <h1 style={{ fontFamily:'Georgia,serif', fontSize:'clamp(2.4rem,5vw,4rem)', fontWeight:700, color:'#fff', lineHeight:1.1, marginBottom:16 }}>
          Upcoming Events
        </h1>
        <p style={{ fontFamily:'Lato,sans-serif', fontSize:15, color:'rgba(255,255,255,.6)', lineHeight:1.8, maxWidth:500, margin:'0 auto 36px' }}>
          Stay updated with our upcoming events tailored for all church members.
        </p>
        <button onClick={()=>window.scrollTo({top:400,behavior:'smooth'})}
          style={{ background:'#c9a84c', color:'#0d2b1a', border:'none', padding:'14px 36px', borderRadius:5, fontFamily:'Lato,sans-serif', fontSize:13, fontWeight:700, letterSpacing:'.1em', cursor:'pointer' }}>
          RSVP Now
        </button>
      </div>

      {/* ── FEATURED EVENTS (Wix horizontal scroll style) ── */}
      <section style={{ background:'#f7f9f7', padding:'60px 24px 0' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:28, flexWrap:'wrap', gap:12 }}>
            <div>
              <span style={{ fontSize:10, fontWeight:700, letterSpacing:'.22em', color:'#c9a84c', display:'block', marginBottom:8 }}>FEATURED</span>
              <h2 style={{ fontFamily:'Georgia,serif', fontSize:'clamp(1.6rem,3vw,2.2rem)', fontWeight:700, color:'#0d2b1a' }}>Engaging Experiences</h2>
            </div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:24, marginBottom:48 }}>
            {featured.map(ev => (
              <div key={ev.eventId} className="ev-card" style={{ position:'relative' }}>
                <div style={{ background:'linear-gradient(135deg,#1a4731,#40916c)', padding:'28px 24px 20px', display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                  <div>
                    <div style={{ fontFamily:'Georgia,serif', fontSize:52, fontWeight:700, color:'#fff', lineHeight:1 }}>{getDay(ev.eventDate)}</div>
                    <div style={{ fontSize:11, fontWeight:700, letterSpacing:'.18em', color:'#c9a84c' }}>{getMonth(ev.eventDate)} · {ev.eventTime}</div>
                  </div>
                  <span style={{ background:'rgba(201,168,76,.2)', border:'1px solid rgba(201,168,76,.4)', color:'#c9a84c', fontSize:10, letterSpacing:'.14em', padding:'4px 10px', borderRadius:3, fontWeight:700 }}>
                    {ev.category}
                  </span>
                </div>
                <div style={{ padding:'22px 24px 26px' }}>
                  <h3 style={{ fontFamily:'Georgia,serif', fontSize:20, fontWeight:600, color:'#0d2b1a', marginBottom:8, lineHeight:1.3 }}>{ev.title}</h3>
                  <p style={{ fontSize:13, color:'#6b8070', lineHeight:1.7, marginBottom:16 }}>{ev.description}</p>
                  <p style={{ fontSize:12, color:'#6b8070', marginBottom:14 }}>📍 {ev.location}</p>
                  {/* Capacity bar */}
                  <div style={{ marginBottom:18 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                      <span style={{ fontSize:11, color:'#6b8070' }}>Attendance</span>
                      <span style={{ fontSize:11, color:spotsLeft(ev)<10?'#c0392b':'#1a6640', fontWeight:700 }}>{spotsLeft(ev)} spots left</span>
                    </div>
                    <div style={{ height:4, background:'rgba(26,71,49,.1)', borderRadius:2 }}>
                      <div style={{ height:'100%', width:`${capacity(ev)}%`, background: capacity(ev)>80?'#c0392b':'#1a6640', borderRadius:2 }} />
                    </div>
                  </div>
                  <button onClick={()=>handleRSVP(ev)}
                    style={{ width:'100%', background:'#c9a84c', color:'#0d2b1a', border:'none', padding:'12px', borderRadius:6, fontFamily:'Lato,sans-serif', fontSize:12, fontWeight:700, letterSpacing:'.08em', cursor:'pointer', transition:'background .2s' }}
                    onMouseEnter={e=>e.target.style.background='#e0c060'} onMouseLeave={e=>e.target.style.background='#c9a84c'}>
                    REGISTER / RSVP →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FILTER + ALL EVENTS ── */}
      <section style={{ background:'#fff', padding:'0 24px 80px' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          {/* Filter bar */}
          <div style={{ background:'#fff', borderBottom:'1px solid rgba(0,0,0,.07)', padding:'20px 0 20px', position:'sticky', top:64, zIndex:9, display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12, marginBottom:36 }}>
            <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
              {categories.map(c => (
                <button key={c} className={`cat-pill${selectedCategory===c?' active':''}`} onClick={()=>setSelectedCategory(c)}>{c}</button>
              ))}
            </div>
            <div style={{ display:'flex', gap:8 }}>
              <button className={`view-btn${view==='grid'?' active':''}`} onClick={()=>setView('grid')}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
              </button>
              <button className={`view-btn${view==='list'?' active':''}`} onClick={()=>setView('list')}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
              </button>
            </div>
          </div>

          <div style={{ marginBottom:12 }}>
            <p style={{ fontSize:14, color:'#6b8070' }}>Showing <strong style={{ color:'#0d2b1a' }}>{filtered.length}</strong> event{filtered.length!==1?'s':''}</p>
          </div>

          {view === 'grid' ? (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(310px,1fr))', gap:24 }}>
              {filtered.map(ev => (
                <div key={ev.eventId} className="ev-card">
                  <div style={{ background:'linear-gradient(135deg,#1a4731,#3a7d56)', padding:'20px 22px 16px', display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                    <div>
                      <div style={{ fontFamily:'Georgia,serif', fontSize:40, fontWeight:700, color:'#fff', lineHeight:1 }}>{getDay(ev.eventDate)}</div>
                      <div style={{ fontSize:10, fontWeight:700, letterSpacing:'.18em', color:'#c9a84c' }}>{getMonth(ev.eventDate)}</div>
                    </div>
                    <span style={{ fontSize:10, fontWeight:700, letterSpacing:'.12em', padding:'4px 10px', borderRadius:3, background:CAT_STYLE[ev.category]?.bg, color:CAT_STYLE[ev.category]?.text }}>
                      {ev.category}
                    </span>
                  </div>
                  <div style={{ padding:'18px 22px 22px' }}>
                    <h3 style={{ fontFamily:'Georgia,serif', fontSize:17, fontWeight:600, color:'#0d2b1a', marginBottom:6, lineHeight:1.35 }}>{ev.title}</h3>
                    <p style={{ fontSize:12, color:'#6b8070', marginBottom:4 }}>🕐 {ev.eventTime} &nbsp;·&nbsp; 📍 {ev.location}</p>
                    {ev.rsvpDeadline && <p style={{ fontSize:11, color:'#c0392b', marginBottom:10 }}>RSVP by {formatDate(ev.rsvpDeadline)}</p>}
                    <div style={{ marginBottom:14 }}>
                      <div style={{ height:3, background:'rgba(26,71,49,.08)', borderRadius:2 }}>
                        <div style={{ height:'100%', width:`${capacity(ev)}%`, background:capacity(ev)>80?'#c0392b':'#1a6640', borderRadius:2 }} />
                      </div>
                      <p style={{ fontSize:11, color:'#6b8070', marginTop:4 }}>{spotsLeft(ev)} of {ev.maxAttendees} spots remaining</p>
                    </div>
                    <button onClick={()=>handleRSVP(ev)}
                      style={{ width:'100%', background:'#1a4731', color:'#fff', border:'none', padding:'11px', borderRadius:6, fontFamily:'Lato,sans-serif', fontSize:12, fontWeight:700, cursor:'pointer', transition:'background .2s', letterSpacing:'.06em' }}
                      onMouseEnter={e=>e.target.style.background='#0d2b1a'} onMouseLeave={e=>e.target.style.background='#1a4731'}>
                      RSVP / Calendar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* LIST VIEW (Wix-style rows) */
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {filtered.map(ev => (
                <div key={ev.eventId} style={{ background:'#fff', border:'1px solid rgba(0,0,0,.07)', borderRadius:10, padding:'18px 22px', display:'flex', gap:20, alignItems:'center', flexWrap:'wrap', transition:'all .2s' }}
                  onMouseEnter={e=>{ e.currentTarget.style.borderColor='rgba(201,168,76,.4)'; e.currentTarget.style.boxShadow='0 4px 16px rgba(26,71,49,.08)'; }}
                  onMouseLeave={e=>{ e.currentTarget.style.borderColor='rgba(0,0,0,.07)'; e.currentTarget.style.boxShadow='none'; }}>
                  {/* Date block */}
                  <div style={{ width:56, height:56, background:'#1a4731', borderRadius:8, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <div style={{ fontFamily:'Georgia,serif', fontSize:20, fontWeight:700, color:'#fff', lineHeight:1 }}>{getDay(ev.eventDate)}</div>
                    <div style={{ fontSize:9, fontWeight:700, letterSpacing:'.1em', color:'#c9a84c' }}>{getMonth(ev.eventDate)}</div>
                  </div>
                  <div style={{ flex:1, minWidth:180 }}>
                    <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:4, flexWrap:'wrap' }}>
                      <h3 style={{ fontFamily:'Georgia,serif', fontSize:17, fontWeight:600, color:'#0d2b1a' }}>{ev.title}</h3>
                      <span style={{ fontSize:10, fontWeight:700, letterSpacing:'.1em', padding:'3px 8px', borderRadius:3, background:CAT_STYLE[ev.category]?.bg, color:CAT_STYLE[ev.category]?.text }}>{ev.category}</span>
                    </div>
                    <p style={{ fontSize:12, color:'#6b8070' }}>🕐 {ev.eventTime} &nbsp;·&nbsp; 📍 {ev.location} &nbsp;·&nbsp; {spotsLeft(ev)} spots left</p>
                  </div>
                  <button onClick={()=>handleRSVP(ev)}
                    style={{ background:'#c9a84c', color:'#0d2b1a', border:'none', padding:'10px 22px', borderRadius:6, fontFamily:'Lato,sans-serif', fontSize:12, fontWeight:700, cursor:'pointer', whiteSpace:'nowrap', transition:'background .2s', letterSpacing:'.06em' }}
                    onMouseEnter={e=>e.target.style.background='#e0c060'} onMouseLeave={e=>e.target.style.background='#c9a84c'}>
                    RSVP →
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── RSVP MODAL ── */}
      {rsvpEvent && (
        <div className="modal-overlay" onClick={()=>setRsvpEvent(null)}>
          <div className="modal-box" onClick={e=>e.stopPropagation()}>
            {/* Header */}
            <div style={{ background:'linear-gradient(135deg,#1a4731,#40916c)', padding:'24px 28px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                <div>
                  <div style={{ fontSize:10, fontWeight:700, letterSpacing:'.18em', color:'#c9a84c', marginBottom:6 }}>{rsvpEvent.category}</div>
                  <h3 style={{ fontFamily:'Georgia,serif', fontSize:22, color:'#fff', lineHeight:1.25 }}>{rsvpEvent.title}</h3>
                  <p style={{ fontSize:13, color:'rgba(255,255,255,.65)', marginTop:6 }}>📍 {rsvpEvent.location} · 🕐 {formatDate(rsvpEvent.eventDate)} at {rsvpEvent.eventTime}</p>
                </div>
                <button onClick={()=>setRsvpEvent(null)} style={{ background:'none', border:'none', color:'rgba(255,255,255,.6)', fontSize:22, cursor:'pointer', lineHeight:1 }}>✕</button>
              </div>
            </div>
            <div style={{ padding:'28px' }}>
              {rsvpDone ? (
                <div style={{ textAlign:'center', padding:'24px 0' }}>
                  <div style={{ fontSize:40, color:'#1a6640', marginBottom:12 }}>✓</div>
                  <h4 style={{ fontFamily:'Georgia,serif', fontSize:20, color:'#0d2b1a', marginBottom:8 }}>RSVP Confirmed!</h4>
                  <p style={{ fontSize:13, color:'#6b8070' }}>Check your email for confirmation details. We look forward to seeing you!</p>
                  <button onClick={()=>setRsvpEvent(null)}
                    style={{ marginTop:20, background:'#c9a84c', color:'#0d2b1a', border:'none', padding:'12px 28px', borderRadius:6, fontFamily:'Lato,sans-serif', fontSize:13, fontWeight:700, cursor:'pointer' }}>
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={submitRSVP}>
                  <h4 style={{ fontFamily:'Georgia,serif', fontSize:18, color:'#0d2b1a', marginBottom:20 }}>Complete Your RSVP</h4>
                  {[['name','Full Name *','John Doe','text'],['email','Email Address *','john@example.com','email']].map(([k,l,ph,t]) => (
                    <div key={k} style={{ marginBottom:16 }}>
                      <label style={{ display:'block', fontSize:11, fontWeight:700, letterSpacing:'.12em', color:'#3d5247', marginBottom:7 }}>{l}</label>
                      <input type={t} required placeholder={ph} value={rsvpForm[k]} onChange={e=>setRsvpForm({...rsvpForm,[k]:e.target.value})}
                        style={{ width:'100%', padding:'12px 14px', border:'1.5px solid rgba(26,71,49,.2)', borderRadius:6, fontSize:14, outline:'none', fontFamily:"'Lato',sans-serif", boxSizing:'border-box' }} />
                    </div>
                  ))}
                  <div style={{ marginBottom:22 }}>
                    <label style={{ display:'block', fontSize:11, fontWeight:700, letterSpacing:'.12em', color:'#3d5247', marginBottom:7 }}>NUMBER OF ATTENDEES</label>
                    <input type="number" min={1} max={10} value={rsvpForm.attendees} onChange={e=>setRsvpForm({...rsvpForm,attendees:e.target.value})}
                      style={{ width:'100%', padding:'12px 14px', border:'1.5px solid rgba(26,71,49,.2)', borderRadius:6, fontSize:14, outline:'none', fontFamily:"'Lato',sans-serif", boxSizing:'border-box' }} />
                  </div>
                  <button type="submit" style={{ width:'100%', background:'#c9a84c', color:'#0d2b1a', border:'none', padding:'14px', borderRadius:6, fontFamily:'Lato,sans-serif', fontSize:13, fontWeight:700, cursor:'pointer', letterSpacing:'.08em' }}>
                    SUBMIT RSVP
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsPage;
