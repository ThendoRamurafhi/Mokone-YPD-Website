import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { NavIcons } from '../components/common/NavIcons';
import YPDLogo from '../components/common/YPDLogo';
import eventService from '../services/eventService';
import blogService from '../services/blogService';
import LoadingSpinner from '../components/common/LoadingSpinner';

const HomePage = () => {

  // ── Scroll to top on mount ──────────────────────────────
  useEffect(() => { window.scrollTo(0, 0); }, []);

  /* ── data ── */
  const TESTIMONIALS = [
    { name:'Ledile Kgopong',         role:'Church Member',              avatar:'LK',  quote:"A welcoming community that truly feels like family. I've never felt so at home in a church before." },
    { name:'Neo Mannya',             role:'YPD Conference President',   avatar:'NM',  quote:'Exceptional sermons that challenge my faith in the most beautiful way. Deeply transformative.' },
    { name:'Thendo Ramurafhi',       role:'New Member',                 avatar:'TR',  quote:"I've found my spiritual home here. The YPD has helped me grow in ways I never imagined possible." },
    { name:'Rev. MA Monyemorathwe', role:'Sibasa Circuit Local Pastor', avatar:'MAM', quote:'An inspiring experience every single time I attend. The spirit of this community is extraordinary.' },
  ];

  const categoryColors = {
    CONFERENCE:   { bg:'#e8f0fe',                text:'#1a56a0' },
    YOUTH:        { bg:'#f0e8fe',                text:'#6b21a8' },
    COMMUNITY:    { bg:'#e6f4ea',                text:'#1a6640' },
    WORSHIP:      { bg:'#fef3e2',                text:'#92400e' },
    EDUCATIONAL:  { bg:'#fce8e8',                text:'#991b1b' },
    TESTIMONY:    { bg:'rgba(180,60,60,0.08)',   color:'#8a2020' },
    ANNOUNCEMENT: { bg:'rgba(201,168,76,0.12)', color:'#8a6800' },
    SERMON:       { bg:'rgba(37,96,64,0.1)',    color:'#256040' },
    NEWS:         { bg:'rgba(30,80,140,0.08)',  color:'#1e508c' },
    RESOURCE:     { bg:'rgba(60,60,180,0.08)',  color:'#3c3cb4' },
  };

  /* ── state ── */
  const [playing,           setPlaying]           = useState(false);
  const [email,             setEmail]             = useState('');
  const [subscribed,        setSubscribed]        = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const handleSubscribe = e => { e.preventDefault(); if (email) { setSubscribed(true); setEmail(''); } };
  const daysUntil = d => Math.max(0, Math.ceil((new Date(d) - new Date()) / 86400000));

  useEffect(() => {
    const id = setInterval(() => setActiveTestimonial(a => (a + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(id);
  }, []);

  /* ── shared tile hover handlers ── */
  const tHoverOn  = e => { e.currentTarget.style.borderColor = '#c9a84c'; e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 20px 48px rgba(26,71,49,0.12)'; };
  const tHoverOff = e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.15)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; };

  // New API states
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [latestPosts,    setLatestPosts]    = useState([]);
  const [featuredSermon, setFeaturedSermon] = useState(null);
  const [updates,        setUpdates]        = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState(null);

  // New date formatter
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-ZA', { year:'numeric', month:'long', day:'numeric' });
  };

  // File 1 used capital keys: NavIcons.Events
  // File 2 uses lowercase keys: NavIcons.events
  // Match whatever your actual NavIcons export uses — check your NavIcons.js file
  // If NavIcons.Events works, keep File 1's version. Just make sure it's consistent.

  const TILES = [
    { label:'Events',        to:'/events',    Icon: NavIcons.Events        },
    { label:'Contact',       to:'/contact',   Icon: NavIcons.Contact       },
    { label:'Media',         to:'/media',     Icon: NavIcons.Media         },
    { label:'Blog',          to:'/blog',      Icon: NavIcons.Blog          },
    { label:'Church Finder', to:'/charges',   Icon: NavIcons.ChurchFinder  },
    { label:'Structure',     to:'/structure', Icon: NavIcons.Structure     },
    { label:'About',         to:'/about',     Icon: NavIcons.About         },
    { label:'Login',         to:'/login',     Icon: NavIcons.Login         },
  ];

  // The async data fetcher
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const today = new Date().toISOString().slice(0, 10); // "2026-05-04"

        // ── Events: filter to PUBLISHED + future, sort ascending, take 3 ──
        const eventsResponse = await eventService.getAll({ page: 0, size: 50 });
        const allEvents = eventsResponse.content || eventsResponse || [];
        const upcoming = allEvents
          .filter(e => e.status === 'PUBLISHED' && e.eventDate >= today)
          .sort((a, b) => a.eventDate.localeCompare(b.eventDate)) // O(n log n)
          .slice(0, 3);
        setUpcomingEvents(upcoming);

        // ── Blog posts ──
        const blogResponse = await blogService.getAll({ page: 0, size: 3 });
        setLatestPosts(blogResponse.content || blogResponse || []);

        // ── Featured sermon ──
        const sermonResponse = await blogService.getAll({ category: 'SERMON', page: 0, size: 1 });
        const sermons = sermonResponse.content || sermonResponse || [];
        if (sermons.length > 0) setFeaturedSermon(sermons[0]);

        // ── Announcements/updates ──
        const updatesResponse = await blogService.getAll({ category: 'ANNOUNCEMENT', page: 0, size: 4 });
        setUpdates(updatesResponse.content || updatesResponse || []);

      } catch (err) {
        console.error('Error fetching home data:', err);
        setError('Failed to load content. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  return (
    <div style={{ fontFamily:"'Lato',sans-serif" }}>
      {loading && (
        <div style={{ position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(255,255,255,0.8)', zIndex:999, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <LoadingSpinner />
        </div>
      )}
      {error && (
        <div style={{ background:'#fee', color:'#c00', padding:'12px 24px', textAlign:'center' }}>
          {error} <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      )}

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section style={{ background:'linear-gradient(150deg,#071812 0%,#0d2b1a 45%,#1a4731 80%,#0d2218 100%)', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'100px 24px 60px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'18%', left:'50%', transform:'translateX(-50%)', width:420, height:420, background:'radial-gradient(circle,rgba(201,168,76,0.06) 0%,transparent 70%)', pointerEvents:'none' }} />

        <div style={{ position:'relative', zIndex:2, textAlign:'center', maxWidth:700 }}>
          <div style={{ display:'flex', justifyContent:'center', marginBottom:28 }}>
            <div style={{ position:'relative' }}>
              <div style={{ position:'absolute', inset:-10, borderRadius:'50%', border:'1px solid rgba(201,168,76,0.3)', animation:'pulse 3s ease-in-out infinite' }} />
              <YPDLogo width={99} height={99} />
            </div>
          </div>

          <div style={{ color:'#c9a84c', fontSize:10, fontWeight:700, letterSpacing:'0.28em', marginBottom:18 }}>
            AFRICAN METHODIST EPISCOPAL CHURCH
          </div>

          <h1 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'clamp(3rem,8vw,6rem)', fontWeight:700, color:'#fff', lineHeight:1.02, marginBottom:18 }}>
            Welcome to AME Church<br />
            <span style={{ color:'#c9a84c', fontStyle:'italic' }}>Young People's Division</span>
          </h1>

          <p style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:18, color:'rgba(255,255,255,0.55)', fontStyle:'italic', marginBottom:10 }}>
            Inspired by Luke 17:20–21 · Discover the Kingdom Within
          </p>
          <p style={{ fontSize:15, color:'rgba(255,255,255,0.65)', lineHeight:1.8, maxWidth:500, margin:'0 auto 44px' }}>
            Empowering youth and young adults to grow in faith, leadership, and community. Join us on this journey of spiritual growth.
          </p>

          <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap', marginBottom:52 }}>
            <Link to="/register" style={{ background:'#c9a84c', color:'#0d2b1a', padding:'15px 36px', borderRadius:4, textDecoration:'none', fontWeight:700, fontSize:13, letterSpacing:'0.1em', transition:'background 0.2s' }}
              onMouseEnter={e=>e.currentTarget.style.background='#e0c060'} onMouseLeave={e=>e.currentTarget.style.background='#c9a84c'}>
              JOIN OUR COMMUNITY
            </Link>
            <Link to="/about" style={{ border:'1.5px solid rgba(255,255,255,0.45)', color:'#fff', padding:'15px 36px', borderRadius:4, textDecoration:'none', fontSize:13, letterSpacing:'0.1em', transition:'all 0.2s' }}
              onMouseEnter={e=>{ e.currentTarget.style.borderColor='#c9a84c'; e.currentTarget.style.color='#c9a84c'; }}
              onMouseLeave={e=>{ e.currentTarget.style.borderColor='rgba(255,255,255,0.45)'; e.currentTarget.style.color='#fff'; }}>
              LEARN MORE
            </Link>
          </div>

          {/* Newsletter */}
          <div style={{ background:'rgba(255,255,255,0.05)', backdropFilter:'blur(8px)', border:'1px solid rgba(201,168,76,0.22)', borderRadius:10, padding:'26px 30px', maxWidth:480, margin:'0 auto' }}>
            {subscribed
              ? <p style={{ color:'#c9a84c', fontFamily:'Georgia,serif', fontSize:16 }}>✦ Welcome to the community! We'll be in touch.</p>
              : <>
                  <p style={{ fontSize:10, fontWeight:700, letterSpacing:'0.22em', color:'#c9a84c', marginBottom:14 }}>BE THE FIRST TO KNOW — THE EVENT IS LIVE</p>
                  <p style={{ fontSize:13, color:'rgba(255,255,255,0.45)', marginBottom:14 }}>Subscribe for an exclusive preview before anyone else.</p>
                  <form onSubmit={handleSubscribe} style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                    <input type="email" placeholder="Enter your email" value={email} onChange={e=>setEmail(e.target.value)} required
                      style={{ flex:1, minWidth:180, padding:'11px 14px', background:'rgba(255,255,255,0.09)', border:'1px solid rgba(255,255,255,0.18)', borderRadius:4, color:'#fff', fontSize:14, outline:'none' }} />
                    <button type="submit" style={{ background:'#c9a84c', color:'#0d2b1a', border:'none', padding:'11px 20px', borderRadius:4, cursor:'pointer', fontWeight:700, fontSize:12, letterSpacing:'0.08em', whiteSpace:'nowrap' }}>
                      Subscribe Now
                    </button>
                  </form>
                </>
            }
          </div>
        </div>

        <div style={{ position:'absolute', bottom:28, left:'50%', transform:'translateX(-50%)', display:'flex', flexDirection:'column', alignItems:'center', gap:6, animation:'bounce 2.5s ease-in-out infinite' }}>
          <span style={{ fontSize:9, letterSpacing:'0.2em', color:'rgba(255,255,255,0.28)' }}>SCROLL</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="2" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
      </section>

      {/* ══════════════════════════════════════
          WELCOME / QUICK-ACCESS TILES
          All 8 tiles — each uses <Link to="...">
      ══════════════════════════════════════ */}
      <section id="welcome" style={{ background:'var(--cream)', padding:'100px 24px' }}>
        <div style={{ maxWidth:1300, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:64 }}>
            <span className="section-eyebrow">WELCOME</span>
            <h2 className="section-title" style={{ marginBottom:16 }}>
              Join us in Spiritual Growth<br />
              <span style={{ color:'var(--green-mid)', fontStyle:'italic' }}>&amp; Community</span>
            </h2>
            <p style={{ fontFamily:"'Lato',sans-serif", fontSize:15, color:'var(--text-light)', lineHeight:1.8, maxWidth:560, margin:'0 auto' }}>
              Discover meaningful resources and connections through Mokone YPD Conference. Everything you need, in one place.
            </p>
          </div>

          <p style={{ fontFamily:"'Lato',sans-serif", fontSize:11, fontWeight:700, letterSpacing:'0.2em', color:'var(--text-light)', marginBottom:24, textAlign:'center' }}>
            EXPLORE OUR RESOURCES — DISCOVER OUR CHURCH OFFERINGS WITH JUST ONE CLICK
          </p>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))', gap:16 }}>
            {TILES.map(({ label, to, Icon }) => (
              <Link
                key={label}
                to={to}
                style={{ background:'var(--white)', border:'1px solid rgba(201,168,76,0.15)', borderRadius:10, padding:'28px 20px', textAlign:'center', cursor:'pointer', transition:'all 0.3s ease', textDecoration:'none', display:'flex', flexDirection:'column', alignItems:'center', gap:14 }}
                onMouseEnter={tHoverOn}
                onMouseLeave={tHoverOff}
              >
                <div className="tile-icon-wrap" style={{ width:60, height:60, borderRadius:'50%', background:'var(--cream-dark)', display:'flex', alignItems:'center', justifyContent:'center', transition:'background 0.3s' }}>
                  <Icon />
                </div>
                <span style={{ fontFamily:"'Lato',sans-serif", fontSize:13, fontWeight:700, color:'var(--text-dark)', letterSpacing:'0.04em' }}>{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          UPCOMING EVENTS
      ══════════════════════════════════════ */}
      <section style={{ background:'#f7f9f7', padding:'80px 24px' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <div style={{ marginBottom:48 }}>
            <span style={{ fontSize:10, fontWeight:700, letterSpacing:'0.22em', color:'#c9a84c', display:'block', marginBottom:10 }}>WHAT'S HAPPENING</span>
            <h2 style={{ fontFamily:'Georgia,serif', fontSize:'clamp(1.9rem,3.5vw,2.8rem)', fontWeight:700, color:'#0d2b1a', lineHeight:1.2 }}>Upcoming Events</h2>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:32 }}>
            {/* LEFT column */}
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              {/* Events tile */}
              <Link to="/events" style={{ display:'flex', alignItems:'flex-start', gap:18, background:'#fff', border:'1px solid rgba(0,0,0,0.07)', borderRadius:14, padding:'24px 22px', textDecoration:'none', transition:'box-shadow 0.25s,transform 0.25s' }}
                onMouseEnter={e=>{ e.currentTarget.style.boxShadow='0 12px 32px rgba(26,71,49,0.12)'; e.currentTarget.style.transform='translateY(-3px)'; }}
                onMouseLeave={e=>{ e.currentTarget.style.boxShadow='none'; e.currentTarget.style.transform='translateY(0)'; }}>
                <div style={{ width:52, height:52, borderRadius:12, flexShrink:0, background:'rgba(201,168,76,0.15)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                </div>
                <div>
                  <div style={{ fontFamily:'Georgia,serif', fontSize:17, fontWeight:600, color:'#1a4731', marginBottom:5 }}>Upcoming Events</div>
                  <div style={{ fontSize:13, color:'#6b8070', lineHeight:1.5, marginBottom:14 }}>Join us for worship and fellowship</div>
                  {upcomingEvents.map(ev => (
                    <div key={ev.eventId} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0', borderBottom:'1px solid rgba(0,0,0,0.05)' }}>
                      <div>
                        <div style={{ fontSize:13, fontWeight:600, color:'#0d2b1a' }}>{ev.title}</div>
                        <div style={{ fontSize:11, color:'#6b8070' }}>📍 {ev.location}</div>
                      </div>
                      <div style={{ textAlign:'right', flexShrink:0, marginLeft:12 }}>
                        <div style={{ fontSize:10, fontWeight:700, letterSpacing:'0.1em', padding:'3px 8px', borderRadius:3, background:categoryColors[ev.category]?.bg||'#e6f4ea', color:categoryColors[ev.category]?.text||'#1a6640' }}>{ev.category}</div>
                        <div style={{ fontSize:11, color:'#6b8070', marginTop:3 }}>{daysUntil(ev.eventDate)}d away</div>
                      </div>
                    </div>
                  ))}
                  <span style={{ display:'inline-block', marginTop:14, fontSize:12, fontWeight:700, letterSpacing:'0.08em', color:'#1a4731' }}>VIEW ALL EVENTS →</span>
                </div>
              </Link>

              {/* Sermons tile */}
              <Link to="/media" style={{ display:'flex', alignItems:'flex-start', gap:18, background:'#fff', border:'1px solid rgba(0,0,0,0.07)', borderRadius:14, padding:'24px 22px', textDecoration:'none', transition:'box-shadow 0.25s,transform 0.25s' }}
                onMouseEnter={e=>{ e.currentTarget.style.boxShadow='0 12px 32px rgba(26,71,49,0.12)'; e.currentTarget.style.transform='translateY(-3px)'; }}
                onMouseLeave={e=>{ e.currentTarget.style.boxShadow='none'; e.currentTarget.style.transform='translateY(0)'; }}>
                <div style={{ width:52, height:52, borderRadius:12, flexShrink:0, background:'rgba(201,168,76,0.15)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
                </div>
                <div>
                  <div style={{ fontFamily:'Georgia,serif', fontSize:17, fontWeight:600, color:'#1a4731', marginBottom:5 }}>Latest Sermons</div>
                  <div style={{ fontSize:13, color:'#6b8070' }}>Watch our recent messages</div>
                </div>
              </Link>

              {/* Get Involved tile */}
              <Link to="/about" style={{ display:'flex', alignItems:'flex-start', gap:18, background:'#fff', border:'1px solid rgba(0,0,0,0.07)', borderRadius:14, padding:'24px 22px', textDecoration:'none', transition:'box-shadow 0.25s,transform 0.25s' }}
                onMouseEnter={e=>{ e.currentTarget.style.boxShadow='0 12px 32px rgba(26,71,49,0.12)'; e.currentTarget.style.transform='translateY(-3px)'; }}
                onMouseLeave={e=>{ e.currentTarget.style.boxShadow='none'; e.currentTarget.style.transform='translateY(0)'; }}>
                <div style={{ width:52, height:52, borderRadius:12, flexShrink:0, background:'rgba(201,168,76,0.15)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
                </div>
                <div>
                  <div style={{ fontFamily:'Georgia,serif', fontSize:17, fontWeight:600, color:'#1a4731', marginBottom:5 }}>Get Involved</div>
                  <div style={{ fontSize:13, color:'#6b8070' }}>Discover ministry opportunities</div>
                </div>
              </Link>
            </div>

            {/* RIGHT column */}
            <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
              <div style={{ borderRadius:14, overflow:'hidden', border:'1px solid rgba(0,0,0,0.07)' }}>
                <div style={{ background:'linear-gradient(135deg,#1a4731,#40916c)', height:200, display:'flex', alignItems:'center', justifyContent:'center', position:'relative', cursor:'pointer' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
                  <div style={{ position:'absolute', bottom:12, left:14, background:'rgba(201,168,76,0.9)', color:'#0d2b1a', fontSize:10, fontWeight:700, letterSpacing:'0.1em', padding:'4px 10px', borderRadius:3 }}>Featured</div>
                </div>
                <div style={{ background:'#fff', padding:'20px 22px 24px' }}>
                  <h3 style={{ fontFamily:'Georgia,serif', fontSize:19, fontWeight:600, color:'#1a4731', marginBottom:8 }}>Latest Sermon: Faith in Action</h3>
                  <p style={{ fontSize:13, color:'#6b8070', lineHeight:1.65, marginBottom:14 }}>Watch our most recent message about living out faith through service.</p>
                  <Link to="/media" style={{ color:'#1a4731', textDecoration:'none', fontSize:13, fontWeight:700 }}>Watch Now →</Link>
                </div>
              </div>

              <div>
                <h3 style={{ fontFamily:'Georgia,serif', fontSize:17, fontWeight:600, color:'#0d2b1a', marginBottom:14 }}>Recent Updates</h3>
                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  {updates.map(item => (
                    <div key={item.id} style={{ background:'#fff', border:'1px solid rgba(0,0,0,0.07)', borderRadius:10, padding:'14px 16px', display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:12 }}>
                      <div>
                        <div style={{ fontSize:13, fontWeight:600, color:'#0d2b1a', marginBottom:4 }}>{item.title}</div>
                        <div style={{ fontSize:12, color:'#6b8070', lineHeight:1.5 }}>{item.excerpt}</div>
                      </div>
                      <span style={{ fontSize:11, color:'#aaa', whiteSpace:'nowrap', flexShrink:0 }}>{item.timeAgo}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop:14 }}>
                  <Link to="/blog" style={{ display:'inline-block', background:'#1a4731', color:'#fff', padding:'10px 22px', borderRadius:6, textDecoration:'none', fontSize:12, fontWeight:700, letterSpacing:'0.08em' }}>VIEW ALL UPDATES</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SERMON SECTION
      ══════════════════════════════════════ */}
      <section id="media" style={{ background:'#0d2b1a', padding:'100px 24px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:'repeating-linear-gradient(90deg,transparent,transparent 80px,rgba(200,168,76,0.03) 80px,rgba(201,168,76,0.03) 81px)', pointerEvents:'none' }} />
        <div style={{ maxWidth:1200, margin:'0 auto', position:'relative' }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(340px,1fr))', gap:64, alignItems:'center' }}>
            <div>
              <span className="section-eyebrow">THIS WEEK'S MESSAGE</span>
              <h2 className="section-title-light" style={{ marginBottom:20 }}>This Week's Sermon</h2>
              <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, color:'rgba(255,255,255,0.65)', fontStyle:'italic', lineHeight:1.7, marginBottom:12 }}>
                "The kingdom of God is within you — not in outward signs, but in the transformation of the heart."
              </p>
              <p style={{ fontFamily:"'Lato',sans-serif", fontSize:13, color:'rgba(255,255,255,0.4)', marginBottom:36 }}>— Rev. John Doe · Luke 17:20-21</p>
              <p style={{ fontFamily:"'Lato',sans-serif", fontSize:15, color:'rgba(255,255,255,0.6)', lineHeight:1.8, marginBottom:36 }}>
                Tune in to our latest sermon where we dive deep into faith and inspiration. Experience spiritual renewal and discover the Kingdom within you this week.
              </p>
              <button onClick={()=>setPlaying(true)} className="btn-gold" style={{ display:'flex', alignItems:'center', gap:10, border:'none', cursor:'pointer', fontSize:13 }}>
                <NavIcons.Play /> WATCH NOW
              </button>
            </div>
            <div>
              <div onClick={()=>setPlaying(!playing)} style={{ background:'linear-gradient(135deg,#1a4731,#0d2218)', borderRadius:12, aspectRatio:'16/9', display:'flex', alignItems:'center', justifyContent:'center', border:'1px solid rgba(201,168,76,0.2)', cursor:'pointer', position:'relative', overflow:'hidden' }}>
                <div style={{ position:'absolute', width:2, height:'60%', background:'rgba(201,168,76,0.15)', top:'20%', left:'50%' }} />
                <div style={{ position:'absolute', height:2, width:'40%', background:'rgba(201,168,76,0.15)', top:'35%', left:'30%' }} />
                {playing
                  ? <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" style={{ position:'absolute', inset:0, width:'100%', height:'100%', border:'none', borderRadius:12 }} allowFullScreen title="Sermon" />
                  : <div style={{ textAlign:'center' }}>
                      <div style={{ width:72, height:72, borderRadius:'50%', background:'rgba(201,168,76,0.2)', border:'2px solid var(--gold)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
                        <NavIcons.Play />
                      </div>
                      <p style={{ fontFamily:"'Cormorant Garamond',serif", color:'rgba(255,255,255,0.6)', fontSize:15 }}>Click to Watch Sermon</p>
                    </div>
                }
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginTop:16 }}>
                {[['View','Access our sermon library'],['Share','Spread the Word with others'],['Discuss','Join group conversations'],['Join','Become a member today']].map(([t,d])=>(
                  <div key={t} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(201,168,76,0.1)', borderRadius:8, padding:'14px 16px' }}>
                    <div style={{ fontFamily:"'Lato',sans-serif", fontSize:12, fontWeight:700, color:'var(--gold)', marginBottom:4 }}>{t}</div>
                    <div style={{ fontFamily:"'Lato',sans-serif", fontSize:11, color:'rgba(255,255,255,0.4)', lineHeight:1.5 }}>{d}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          BLOG
      ══════════════════════════════════════ */}
      <section id="blog" style={{ background:'var(--cream)', padding:'100px 24px' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:56, flexWrap:'wrap', gap:15 }}>
            <div>
              <span className="section-eyebrow">FROM THE COMMUNITY</span>
              <h2 className="section-title">Latest from Our Blog<br /><span style={{ color:'var(--green-mid)', fontStyle:'italic' }}>&amp; Updates</span></h2>
            </div>
            <p style={{ fontSize:15, color:'#6b8070', maxWidth:340, lineHeight:1.8 }}>Sermons, announcements, testimonies and more from our community.</p>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:28 }}>
            {latestPosts.map((post,i)=>(
              <article key={post.postId} className="blog-card">
                <div style={{ height:5, background:i===0?'var(--green-dark)':i===1?'var(--gold)':'var(--green-soft)' }} />
                <div style={{ height:180, background:i===0?'linear-gradient(135deg,#1a4731,#3a7d56)':i===1?'linear-gradient(135deg,#2d4a10,#5a8c1a)':'linear-gradient(135deg,#1a2a40,#2a4060)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:48, color:'rgba(255,255,255,0.15)', fontStyle:'italic' }}>
                    {post.category==='SERMON'?'✝':post.category==='ANNOUNCEMENT'?'✦':'❝'}
                  </span>
                </div>
                <div style={{ padding:'24px 26px 28px' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
                    <span style={{ fontSize:10, fontFamily:"'Lato',sans-serif", fontWeight:700, letterSpacing:'0.16em', padding:'4px 10px', borderRadius:2, background:categoryColors[post.category]?.bg, color:categoryColors[post.category]?.color||categoryColors[post.category]?.text }}>
                      {post.category}
                    </span>
                    <span style={{ fontSize:12, color:'var(--text-light)', fontFamily:"'Lato',sans-serif" }}>
                      {post.readTime ? `${post.readTime} min` : ''}
                    </span>
                  </div>
                  <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, fontWeight:600, color:'var(--text-dark)', lineHeight:1.3, marginBottom:10 }}>{post.title}</h3>
                  <p style={{ fontFamily:"'Lato',sans-serif", fontSize:13, color:'var(--text-light)', lineHeight:1.75, marginBottom:20 }}>{post.excerpt}</p>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', borderTop:'1px solid rgba(0,0,0,0.06)', paddingTop:16 }}>
                    <span style={{ fontSize:12, color:'var(--text-mid)', fontFamily:"'Lato',sans-serif" }}>
                      {post.publishedAt ? formatDate(post.publishedAt) : ''}
                    </span>
                    <Link to="/blog" style={{ color:'var(--green-mid)', textDecoration:'none', fontSize:13, fontFamily:"'Lato',sans-serif", display:'flex', alignItems:'center', gap:4, fontWeight:700 }}>
                      Read <NavIcons.Arrow />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div style={{ textAlign:'center', marginTop:44 }}>
            <Link to="/blog" style={{ display:'inline-block', border:'1.5px solid #1a4731', color:'#1a4731', padding:'13px 36px', borderRadius:6, textDecoration:'none', fontSize:13, fontWeight:700, letterSpacing:'0.1em', transition:'all 0.2s' }}
              onMouseEnter={e=>{ e.currentTarget.style.background='#1a4731'; e.currentTarget.style.color='#fff'; }}
              onMouseLeave={e=>{ e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#1a4731'; }}>
              VIEW ALL POSTS
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          STAY INFORMED
      ══════════════════════════════════════ */}
      <section id="updates" style={{ background:'var(--white)', padding:'100px 24px' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(340px,1fr))', gap:64, alignItems:'center' }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gridTemplateRows:'200px 200px', gap:12 }}>
              {[{bg:'linear-gradient(135deg,#1a4731,#40916c)',text:'Community Life'},{bg:'linear-gradient(135deg,#0d2b1a,#1a4731)',text:'Sunday Worship'},{bg:'linear-gradient(135deg,#7d5b00,#c9a84c)',text:'Youth Programs'},{bg:'linear-gradient(135deg,#256040,#3a7d56)',text:'Outreach'}].map((b,i)=>(
                <div key={i} style={{ background:b.bg, borderRadius:8, display:'flex', alignItems:'flex-end', padding:16 }}>
                  <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:15, color:'rgba(255,255,255,0.65)', fontStyle:'italic' }}>{b.text}</span>
                </div>
              ))}
            </div>
            <div>
              <span className="section-eyebrow">STAY INFORMED</span>
              <h2 className="section-title" style={{ marginBottom:20 }}>Check Out Our Recent Updates</h2>
              <p style={{ fontFamily:"'Lato',sans-serif", fontSize:15, color:'var(--text-light)', lineHeight:1.85, marginBottom:16 }}>
                Stay connected with our community and discover upcoming events and initiatives. We share weekly updates on everything happening across our churches — from local outreach to national conference news.
              </p>
              <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:18, color:'var(--green-mid)', fontStyle:'italic', marginBottom:32 }}>
                "Iron sharpens iron, and one person sharpens another." — Proverbs 27:17
              </p>
              <Link to="/blog" className="btn-gold">LEARN MORE</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════ */}
      <section style={{ background:'var(--green-soft)', padding:'100px 24px' }}>
        <div style={{ maxWidth:900, margin:'0 auto', textAlign:'center' }}>
          <span className="section-eyebrow">WHAT OUR MEMBERS SAY</span>
          <h2 className="section-title-light" style={{ marginBottom:60 }}>Voices from Our Community</h2>
          <div style={{ position:'relative', minHeight:200 }}>
            {TESTIMONIALS.map((t,i)=>(
              <div key={i} style={{ position:i===activeTestimonial?'relative':'absolute', top:0, left:0, right:0, opacity:i===activeTestimonial?1:0, transition:'opacity 0.6s ease', padding:'0 24px' }}>
                <div style={{ marginBottom:28 }}><NavIcons.Quote /></div>
                <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(1.3rem,3vw,1.7rem)', color:'rgba(255,255,255,0.88)', fontStyle:'italic', lineHeight:1.65, marginBottom:32 }}>"{t.quote}"</p>
                <div style={{ display:'flex', alignItems:'center', gap:14, justifyContent:'center' }}>
                  <div style={{ width:48, height:48, borderRadius:'50%', background:'var(--green-mid)', border:'2px solid var(--gold)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Lato',sans-serif", fontWeight:700, fontSize:14, color:'var(--gold)' }}>{t.avatar}</div>
                  <div style={{ textAlign:'left' }}>
                    <div style={{ fontFamily:"'Lato',sans-serif", fontWeight:700, fontSize:14, color:'var(--white)' }}>{t.name}</div>
                    <div style={{ fontFamily:"'Lato',sans-serif", fontSize:12, color:'rgba(255,255,255,0.45)', letterSpacing:'0.08em' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display:'flex', justifyContent:'center', gap:8, marginTop:56 }}>
            {TESTIMONIALS.map((_,i)=>(
              <button key={i} onClick={()=>setActiveTestimonial(i)} style={{ width:i===activeTestimonial?24:8, height:8, borderRadius:4, background:i===activeTestimonial?'var(--gold)':'rgba(255,255,255,0.2)', border:'none', cursor:'pointer', transition:'all 0.3s', padding:0 }} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          NEWSLETTER
      ══════════════════════════════════════ */}
      <section style={{ background:'#0d2b1a', padding:'80px 24px' }}>
        <div style={{ maxWidth:600, margin:'0 auto', textAlign:'center' }}>
          <h2 style={{ fontFamily:'Georgia,serif', fontSize:'clamp(1.8rem,3.5vw,2.6rem)', fontWeight:700, color:'#fff', marginBottom:14 }}>Stay Connected</h2>
          <p style={{ fontSize:15, color:'rgba(255,255,255,0.55)', lineHeight:1.8, marginBottom:36 }}>
            Subscribe to our newsletter and never miss an update from the AME Church YPD community.
          </p>
          <form onSubmit={handleSubscribe} style={{ display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap', maxWidth:440, margin:'0 auto' }}>
            <input type="email" placeholder="Enter your email address" value={email} onChange={e=>setEmail(e.target.value)} required
              style={{ flex:1, minWidth:200, padding:'13px 16px', borderRadius:6, border:'none', fontSize:14, outline:'none', fontFamily:"'Lato',sans-serif" }} />
            <button type="submit" style={{ background:'#c9a84c', color:'#0d2b1a', border:'none', padding:'13px 24px', borderRadius:6, cursor:'pointer', fontWeight:700, fontSize:13, letterSpacing:'0.08em', fontFamily:"'Lato',sans-serif", whiteSpace:'nowrap' }}
              onMouseEnter={e=>e.target.style.background='#e0c060'} onMouseLeave={e=>e.target.style.background='#c9a84c'}>
              Subscribe
            </button>
          </form>
          {subscribed && <p style={{ color:'#c9a84c', marginTop:18, fontFamily:'Georgia,serif', fontSize:15 }}>✦ You're subscribed! God bless you.</p>}
        </div>
      </section>

      {/* ══════════════════════════════════════
          GLOBAL STYLES (scoped to this page)
      ══════════════════════════════════════ */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Lato:wght@300;400;700&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        html { scroll-behavior:smooth; }
        body { font-family:'Lato',sans-serif; background:#fff; color:#1a1a1a; overflow-x:hidden; }
        :root {
          --green-deep:#071812; --green-dark:#1a4731; --green-mid:#256040;
          --green-soft:#3a7d56; --gold:#c9a84c; --gold-light:#e8c878;
          --gold-pale:#f5edcf; --cream:#fdf9f2; --cream-dark:#f3ead8;
          --white:#ffffff; --text-dark:#1a2a1e; --text-mid:#3d5247; --text-light:#6b8070;
          --border:rgba(201,168,76,0.18);
        }
        .section-eyebrow { font-size:11px; font-weight:700; letter-spacing:.22em; color:var(--gold); font-family:'Lato',sans-serif; margin-bottom:12px; display:block; }
        .section-title { font-family:'Cormorant Garamond',serif; font-size:clamp(2rem,4vw,3rem); font-weight:700; color:var(--text-dark); line-height:1.15; }
        .section-title-light { font-family:'Cormorant Garamond',serif; font-size:clamp(2rem,4vw,3rem); font-weight:700; color:var(--white); line-height:1.15; }
        .blog-card { background:var(--white); border-radius:12px; overflow:hidden; border:1px solid rgba(0,0,0,0.06); transition:all .3s; cursor:pointer; }
        .blog-card:hover { transform:translateY(-4px); box-shadow:0 16px 40px rgba(26,71,49,0.13); }
        .btn-gold { background:var(--gold); color:var(--green-dark); border:none; padding:14px 36px; border-radius:4px; font-family:'Lato',sans-serif; font-size:13px; font-weight:700; letter-spacing:.12em; cursor:pointer; transition:all .2s; text-decoration:none; display:inline-block; }
        .btn-gold:hover { background:var(--gold-light); transform:translateY(-1px); }
        .tile-icon-wrap:hover { background:var(--green-dark)!important; }
        ::-webkit-scrollbar{width:6px} ::-webkit-scrollbar-track{background:#f0f0f0} ::-webkit-scrollbar-thumb{background:var(--green-mid);border-radius:3px}
        @keyframes pulse{0%,100%{transform:scale(1);opacity:.45}50%{transform:scale(1.07);opacity:1}}
        @keyframes bounce{0%,100%{transform:translateX(-50%) translateY(0)}50%{transform:translateX(-50%) translateY(8px)}}
        @media(max-width:768px){.desktop-only{display:none!important}.mobile-only{display:flex!important}}
        @media(min-width:769px){.mobile-only{display:none!important}}
      `}</style>
    </div>
  );
};

export default HomePage;
