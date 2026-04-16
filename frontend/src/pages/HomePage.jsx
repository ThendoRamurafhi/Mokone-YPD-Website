import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { NavIcons } from "../components/common/NavIcons";

const HomePage = () => {

  /* ── data (unchanged from original) ── */
  const upcomingEvents = [
    {
      eventId: 1,
      title: 'Youth Conference 2026',
      eventDate: '2026-05-15',
      category: 'YOUTH',
      location: 'Main Church Hall',
      description: 'Annual youth gathering for spiritual growth and fellowship.',
    },
    {
      eventId: 2,
      title: 'Community Outreach Day',
      eventDate: '2026-05-22',
      category: 'COMMUNITY',
      location: 'City Centre',
      description: 'Join us as we serve our local community with love and care.',
    },
    {
      eventId: 3,
      title: 'Annual Conference',
      eventDate: '2026-06-10',
      category: 'CONFERENCE',
      location: 'Conference Centre',
      description: 'Our annual gathering of all AME Church YPD members.',
    },
  ];

  const latestPosts = [
    {
      postId: 1,
      title: 'Walking in Faith During Difficult Times',
      excerpt: 'Discover how to maintain your faith when life gets challenging...',
      category: 'SERMON',
      publishedAt: '2026-03-15',
    },
    {
      postId: 2,
      title: 'Youth Leadership Program Launch',
      excerpt: 'We are excited to announce our new youth leadership program...',
      category: 'ANNOUNCEMENT',
      publishedAt: '2026-03-10',
    },
    {
      postId: 3,
      title: 'Community Service Report 2026',
      excerpt: 'Read about all the amazing work our members did this year...',
      category: 'NEWS',
      publishedAt: '2026-03-05',
    },
  ];

  /* ─── WELCOME / QUICK-ACCESS (Wix-inspired) ─── */
  const TILES = [
    { label: "Events",        href: "#events",        Icon: NavIcons.Events    },
    { label: "Contact",       href: "#contact",        Icon: NavIcons.Contact   },
    { label: "Media",         href: "#media",          Icon: NavIcons.Media     },
    { label: "Blog",          href: "#blog",           Icon: NavIcons.Blog      },
    { label: "Church Finder", href: "#church-finder",  Icon: NavIcons.ChurchFinder},
    { label: "Structure",     href: "#structure",      Icon: NavIcons.Structure },
    { label: "About",         href: "#about-us",       Icon: NavIcons.About     },
  ];

  /* ─── SERMON SECTION ─── */
  const [playing, setPlaying] = useState(false);

  /* ── newsletter state ── */
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) { setSubscribed(true); setEmail(''); }
  };

  /* ── helpers (unchanged from original) ── */
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric', month: 'long', day: 'numeric',
    });

  const daysUntil = (dateString) => {
    const diff = new Date(dateString) - new Date();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const categoryColors = {
    CONFERENCE: { bg: '#e8f0fe', text: '#1a56a0' },
    YOUTH:      { bg: '#f0e8fe', text: '#6b21a8' },
    COMMUNITY:  { bg: '#e6f4ea', text: '#1a6640' },
    WORSHIP:    { bg: '#fef3e2', text: '#92400e' },
    EDUCATIONAL:{ bg: '#fce8e8', text: '#991b1b' },
    ANNOUNCEMENT:{ bg: '#e8f0fe', text: '#1a56a0' },
    SERMON:     { bg: '#f0e8fe', text: '#6b21a8' },
    NEWS:       { bg: '#fef3e2', text: '#92400e' },
  };

  /* recent updates for the right column (matches screenshot 2) */
  const recentUpdates = [
    { id: 1, title: 'Community Outreach Event', excerpt: 'Join us for our monthly community service initiative...', timeAgo: '2 days ago' },
    { id: 2, title: 'Youth Prayer Night',        excerpt: 'A powerful evening of worship and intercession together.', timeAgo: '4 days ago' },
    { id: 3, title: 'Annual Conference Update',  excerpt: 'Registrations are now open for the 2026 conference.', timeAgo: '1 week ago' },
  ];

  return (
    <div style={{ fontFamily: "'Lato', sans-serif" }}>

      {/* ═══════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════ */}
      <section
        style={{
          background: 'linear-gradient(150deg, #071812 0%, #0d2b1a 45%, #1a4731 80%, #0d2218 100%)',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '100px 24px 60px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Radial glow */}
        <div style={{
          position: 'absolute', top: '18%', left: '50%', transform: 'translateX(-50%)',
          width: 420, height: 420,
          background: 'radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: 700 }}>
          {/* YPD Circle Logo */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', inset: -10, borderRadius: '50%', border: '1px solid rgba(201,168,76,0.3)', animation: 'pulse 3s ease-in-out infinite' }} />
              <svg width="88" height="88" viewBox="0 0 88 88" fill="none">
                <circle cx="44" cy="44" r="42" fill="#0d2b1a" stroke="#c9a84c" strokeWidth="2.2"/>
                <circle cx="44" cy="44" r="34" fill="none" stroke="#c9a84c" strokeWidth="0.8" strokeDasharray="3 3"/>
                <text x="44" y="51" textAnchor="middle" fill="#c9a84c" fontSize="18" fontWeight="700" fontFamily="Georgia,serif" letterSpacing="2">YPD</text>
              </svg>
            </div>
          </div>

          <div style={{ color: '#c9a84c', fontSize: 10, fontWeight: 700, letterSpacing: '0.28em', marginBottom: 18 }}>
            AFRICAN METHODIST EPISCOPAL CHURCH
          </div>

          <h1 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(3rem, 8vw, 6rem)',
            fontWeight: 700,
            color: '#fff',
            lineHeight: 1.02,
            marginBottom: 18,
          }}>
            Welcome to AME Church<br />
            <span style={{ color: '#c9a84c', fontStyle: 'italic' }}>Young People's Division</span>
          </h1>

          <p style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 18,
            color: 'rgba(255,255,255,0.55)',
            fontStyle: 'italic',
            marginBottom: 10,
          }}>
            Inspired by Luke 17:20–21 · Discover the Kingdom Within
          </p>

          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.65)', lineHeight: 1.8, maxWidth: 500, margin: '0 auto 44px' }}>
            Empowering youth and young adults to grow in faith, leadership,
            and community. Join us on this journey of spiritual growth.
          </p>

          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 52 }}>
            <Link
              to="/register"
              style={{
                background: '#c9a84c', color: '#0d2b1a', padding: '15px 36px',
                borderRadius: 4, textDecoration: 'none', fontWeight: 700,
                fontSize: 13, letterSpacing: '0.1em', transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#e0c060'}
              onMouseLeave={e => e.currentTarget.style.background = '#c9a84c'}
            >
              JOIN OUR COMMUNITY
            </Link>
            <Link
              to="/about"
              style={{
                border: '1.5px solid rgba(255,255,255,0.45)', color: '#fff',
                padding: '15px 36px', borderRadius: 4, textDecoration: 'none',
                fontSize: 13, letterSpacing: '0.1em', transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#c9a84c'; e.currentTarget.style.color = '#c9a84c'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.45)'; e.currentTarget.style.color = '#fff'; }}
            >
              LEARN MORE
            </Link>
          </div>

          {/* Newsletter */}
          <div style={{
            background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(8px)',
            border: '1px solid rgba(201,168,76,0.22)', borderRadius: 10,
            padding: '26px 30px', maxWidth: 480, margin: '0 auto',
          }}>
            {subscribed ? (
              <p style={{ color: '#c9a84c', fontFamily: 'Georgia,serif', fontSize: 16 }}>
                ✦ Welcome to the community! We'll be in touch.
              </p>
            ) : (
              <>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', color: '#c9a84c', marginBottom: 14 }}>
                  BE THE FIRST TO KNOW — THE EVENT IS LIVE
                </p>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginBottom: 14 }}>
                  Subscribe for an exclusive preview before anyone else.
                </p>
                <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <input
                    type="email" placeholder="Enter your email" value={email}
                    onChange={e => setEmail(e.target.value)} required
                    style={{
                      flex: 1, minWidth: 180, padding: '11px 14px',
                      background: 'rgba(255,255,255,0.09)', border: '1px solid rgba(255,255,255,0.18)',
                      borderRadius: 4, color: '#fff', fontSize: 14, outline: 'none',
                    }}
                  />
                  <button type="submit" style={{
                    background: '#c9a84c', color: '#0d2b1a', border: 'none',
                    padding: '11px 20px', borderRadius: 4, cursor: 'pointer',
                    fontWeight: 700, fontSize: 12, letterSpacing: '0.08em',
                    whiteSpace: 'nowrap',
                  }}>
                    Subscribe Now
                  </button>
                </form>
              </>
            )}
          </div>
        </div>

        {/* Scroll cue */}
        <div style={{
          position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
          animation: 'bounce 2.5s ease-in-out infinite',
        }}>
          <span style={{ fontSize: 9, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.28)' }}>SCROLL</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="2" strokeLinecap="round">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          STATS BAR
      ═══════════════════════════════════════════ */}
      <section style={{ background: '#c9a84c', padding: '0' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' }}>
          {[['500+','Members'],['50+','Churches'],['100+','Events'],['20+','Years']].map(([val, lbl], i) => (
            <div key={i} style={{
              textAlign: 'center', padding: '28px 8px',
              borderRight: i < 3 ? '1px solid rgba(10,40,20,0.2)' : 'none',
            }}>
              <div style={{ fontFamily: 'Georgia,serif', fontSize: 'clamp(1.8rem,3vw,2.4rem)', fontWeight: 700, color: '#0d2b1a', lineHeight: 1 }}>{val}</div>
              <div style={{ fontSize: 11, letterSpacing: '0.14em', color: 'rgba(10,40,20,0.65)', marginTop: 5 }}>{lbl}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
         WELCOME SECTION  
      ═══════════════════════════════════════════ */}
      <section id="welcome" style={{ background: "var(--cream)", padding: "100px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <span className="section-eyebrow">WELCOME</span>
          <h2 className="section-title" style={{ marginBottom: 16 }}>
            Join us in Spiritual Growth<br />
            <span style={{ color: "var(--green-mid)", fontStyle: "italic" }}>& Community</span>
          </h2>
          <p style={{ fontFamily: "'Lato',sans-serif", fontSize: 15, color: "var(--text-light)", lineHeight: 1.8, maxWidth: 560, margin: "0 auto" }}>
            Discover meaningful resources and connections through Mokone YPD Conference. Everything you need, in one place.
          </p>
        </div>
          {/* Wix-style resource tiles */}
          <div style={{ marginBottom: 1 }}>
            <p style={{ fontFamily: "'Lato',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", color: "var(--text-light)", marginBottom: 24, textAlign: "center" }}>
              EXPLORE OUR RESOURCES — DISCOVER OUR CHURCH OFFERINGS WITH JUST ONE CLICK
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 16 }}>
              {TILES.map(({ label, href, Icon: Ic }) => (
                <a key={label} href={href} className="resource-tile">
                  <div className="tile-icon-wrap" style={{ width: 60, height: 60, borderRadius: "50%", background: "var(--cream-dark)", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.3s" }}>
                    <Ic />
                  </div>
                  <span style={{ fontFamily: "'Lato',sans-serif", fontSize: 13, fontWeight: 700, color: "var(--text-dark)", letterSpacing: "0.04em" }}>{label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          UPCOMING EVENTS — redesigned to match screenshot 2
          Left col: stacked action tiles (Events / Latest Sermons / Get Involved)
          Right col: Featured sermon card + Recent Updates list
      ═══════════════════════════════════════════ */}
      <section style={{ background: '#f7f9f7', padding: '80px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>

          {/* Section heading */}
          <div style={{ marginBottom: 48 }}>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', color: '#c9a84c', display: 'block', marginBottom: 10 }}>
              WHAT'S HAPPENING
            </span>
            <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 'clamp(1.9rem,3.5vw,2.8rem)', fontWeight: 700, color: '#0d2b1a', lineHeight: 1.2, marginBottom: 0 }}>
              Upcoming Events
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 32 }}>

            {/* ── LEFT COLUMN: stacked tiles (matches screenshot 2) ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Tile 1 — Upcoming Events */}
              <Link
                to="/events"
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 18,
                  background: '#fff', border: '1px solid rgba(0,0,0,0.07)',
                  borderRadius: 14, padding: '24px 22px', textDecoration: 'none',
                  transition: 'box-shadow 0.25s, transform 0.25s',
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 12px 32px rgba(26,71,49,0.12)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{
                  width: 52, height: 52, borderRadius: 12, flexShrink: 0,
                  background: 'rgba(201,168,76,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                </div>
                <div>
                  <div style={{ fontFamily: 'Georgia,serif', fontSize: 17, fontWeight: 600, color: '#1a4731', marginBottom: 5 }}>
                    Upcoming Events
                  </div>
                  <div style={{ fontSize: 13, color: '#6b8070', lineHeight: 1.5 }}>
                    Join us for worship and fellowship
                  </div>
                  {/* Mini event list */}
                  <div style={{ marginTop: 14 }}>
                    {upcomingEvents.map(ev => (
                      <div key={ev.eventId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: '#0d2b1a' }}>{ev.title}</div>
                          <div style={{ fontSize: 11, color: '#6b8070' }}>📍 {ev.location}</div>
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 12 }}>
                          <div style={{
                            fontSize: 10, fontWeight: 700, letterSpacing: '0.1em',
                            padding: '3px 8px', borderRadius: 3,
                            background: categoryColors[ev.category]?.bg || '#e6f4ea',
                            color: categoryColors[ev.category]?.text || '#1a6640',
                          }}>
                            {ev.category}
                          </div>
                          <div style={{ fontSize: 11, color: '#6b8070', marginTop: 3 }}>
                            {daysUntil(ev.eventDate)}d away
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Link
                    to="/events"
                    style={{
                      display: 'inline-block', marginTop: 14,
                      fontSize: 12, fontWeight: 700, letterSpacing: '0.08em',
                      color: '#1a4731', textDecoration: 'none',
                    }}
                    onClick={e => e.stopPropagation()}
                  >
                    VIEW ALL EVENTS →
                  </Link>
                </div>
              </Link>

              {/* Tile 2 — Latest Sermons */}
              <Link
                to="/media"
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 18,
                  background: '#fff', border: '1px solid rgba(0,0,0,0.07)',
                  borderRadius: 14, padding: '24px 22px', textDecoration: 'none',
                  transition: 'box-shadow 0.25s, transform 0.25s',
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 12px 32px rgba(26,71,49,0.12)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{
                  width: 52, height: 52, borderRadius: 12, flexShrink: 0,
                  background: 'rgba(201,168,76,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/>
                  </svg>
                </div>
                <div>
                  <div style={{ fontFamily: 'Georgia,serif', fontSize: 17, fontWeight: 600, color: '#1a4731', marginBottom: 5 }}>
                    Latest Sermons
                  </div>
                  <div style={{ fontSize: 13, color: '#6b8070' }}>Watch our recent messages</div>
                </div>
              </Link>

              {/* Tile 3 — Get Involved */}
              <Link
                to="/about"
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 18,
                  background: '#fff', border: '1px solid rgba(0,0,0,0.07)',
                  borderRadius: 14, padding: '24px 22px', textDecoration: 'none',
                  transition: 'box-shadow 0.25s, transform 0.25s',
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 12px 32px rgba(26,71,49,0.12)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{
                  width: 52, height: 52, borderRadius: 12, flexShrink: 0,
                  background: 'rgba(201,168,76,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
                  </svg>
                </div>
                <div>
                  <div style={{ fontFamily: 'Georgia,serif', fontSize: 17, fontWeight: 600, color: '#1a4731', marginBottom: 5 }}>
                    Get Involved
                  </div>
                  <div style={{ fontSize: 13, color: '#6b8070' }}>Discover ministry opportunities</div>
                </div>
              </Link>
            </div>

            {/* ── RIGHT COLUMN: featured sermon + recent updates (matches screenshot 2) ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Featured sermon card */}
              <div style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.07)' }}>
                {/* Green video thumbnail */}
                <div style={{
                  background: 'linear-gradient(135deg, #1a4731, #40916c)',
                  height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  position: 'relative', cursor: 'pointer',
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/>
                  </svg>
                  <div style={{
                    position: 'absolute', bottom: 12, left: 14,
                    background: 'rgba(201,168,76,0.9)', color: '#0d2b1a',
                    fontSize: 10, fontWeight: 700, letterSpacing: '0.1em',
                    padding: '4px 10px', borderRadius: 3,
                  }}>
                    Featured
                  </div>
                </div>
                <div style={{ background: '#fff', padding: '20px 22px 24px' }}>
                  <h3 style={{ fontFamily: 'Georgia,serif', fontSize: 19, fontWeight: 600, color: '#1a4731', marginBottom: 8 }}>
                    Latest Sermon: Faith in Action
                  </h3>
                  <p style={{ fontSize: 13, color: '#6b8070', lineHeight: 1.65, marginBottom: 14 }}>
                    Watch our most recent message about living out faith through service.
                  </p>
                  <Link
                    to="/media"
                    style={{
                      color: '#1a4731', textDecoration: 'none',
                      fontSize: 13, fontWeight: 700,
                    }}
                  >
                    Watch Now →
                  </Link>
                </div>
              </div>

              {/* Recent Updates */}
              <div>
                <h3 style={{ fontFamily: 'Georgia,serif', fontSize: 17, fontWeight: 600, color: '#0d2b1a', marginBottom: 14 }}>
                  Recent Updates
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {recentUpdates.map(item => (
                    <div
                      key={item.id}
                      style={{
                        background: '#fff', border: '1px solid rgba(0,0,0,0.07)',
                        borderRadius: 10, padding: '14px 16px',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12,
                      }}
                    >
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#0d2b1a', marginBottom: 4 }}>{item.title}</div>
                        <div style={{ fontSize: 12, color: '#6b8070', lineHeight: 1.5 }}>{item.excerpt}</div>
                      </div>
                      <span style={{ fontSize: 11, color: '#aaa', whiteSpace: 'nowrap', flexShrink: 0 }}>{item.timeAgo}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 14 }}>
                  <Link
                    to="/blog"
                    style={{
                      display: 'inline-block', background: '#1a4731', color: '#fff',
                      padding: '10px 22px', borderRadius: 6, textDecoration: 'none',
                      fontSize: 12, fontWeight: 700, letterSpacing: '0.08em',
                    }}
                  >
                    VIEW ALL UPDATES
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="media" style={{ background: "var(--green-deep)", padding: "100px 24px", position: "relative", overflow: "hidden" }}>
        {/* BG texture lines */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 80px, rgba(201,168,76,0.03) 80px, rgba(201,168,76,0.03) 81px)", pointerEvents: "none" }} />
        
        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 64, alignItems: "center" }}>
            <div>
              <span className="section-eyebrow">THIS WEEK'S MESSAGE</span>
              <h2 className="section-title-light" style={{ marginBottom: 20 }}>
                This Week's Sermon
              </h2>
              <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, color: "rgba(255,255,255,0.65)", fontStyle: "italic", lineHeight: 1.7, marginBottom: 12 }}>
                "The kingdom of God is within you — not in outward signs,<br />but in the transformation of the heart."
              </p>
              <p style={{ fontFamily: "'Lato',sans-serif", fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 36 }}>
                — Rev. John Doe · Luke 17:20–21
              </p>
              <p style={{ fontFamily: "'Lato',sans-serif", fontSize: 15, color: "rgba(255,255,255,0.6)", lineHeight: 1.8, marginBottom: 36 }}>
                Tune in to our latest sermon where we dive deep into faith and inspiration. Experience spiritual renewal and discover the Kingdom within you this week.
              </p>

              
            </div>
          </div>
        
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          LATEST BLOG POSTS (unchanged structure)
      ═══════════════════════════════════════════ */}
      <section style={{ padding: '80px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', color: '#c9a84c', display: 'block', marginBottom: 10 }}>
              FROM THE COMMUNITY
            </span>
            <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 'clamp(1.9rem,3.5vw,2.8rem)', fontWeight: 700, color: '#0d2b1a', marginBottom: 12 }}>
              Latest from Our Blog
            </h2>
            <p style={{ fontSize: 15, color: '#6b8070', maxWidth: 480, margin: '0 auto', lineHeight: 1.8 }}>
              Sermons, announcements, testimonies and more from our community.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 28 }}>
            {latestPosts.map((post, i) => (
              <div
                key={post.postId}
                style={{
                  background: '#fff', borderRadius: 12, overflow: 'hidden',
                  border: '1px solid rgba(0,0,0,0.07)', transition: 'all 0.3s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(26,71,49,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ height: 5, background: i === 0 ? '#1a4731' : i === 1 ? '#c9a84c' : '#40916c' }} />
                <div style={{
                  height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: i === 0 ? 'linear-gradient(135deg,#1a4731,#40916c)' : i === 1 ? 'linear-gradient(135deg,#7d5b00,#c9a84c)' : 'linear-gradient(135deg,#256040,#3a7d56)',
                }}>
                  <span style={{ fontFamily: 'Georgia,serif', fontSize: 48, color: 'rgba(255,255,255,0.18)', fontStyle: 'italic' }}>
                    {post.category === 'SERMON' ? '✝' : post.category === 'ANNOUNCEMENT' ? '✦' : '❝'}
                  </span>
                </div>
                <div style={{ padding: '22px 24px 26px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <span style={{
                      fontSize: 10, fontWeight: 700, letterSpacing: '0.14em',
                      padding: '4px 10px', borderRadius: 3,
                      background: categoryColors[post.category]?.bg || '#e6f4ea',
                      color: categoryColors[post.category]?.text || '#1a6640',
                    }}>
                      {post.category}
                    </span>
                    <span style={{ fontSize: 12, color: '#aaa' }}>{formatDate(post.publishedAt)}</span>
                  </div>
                  <h3 style={{ fontFamily: 'Georgia,serif', fontSize: 19, fontWeight: 600, color: '#0d2b1a', lineHeight: 1.35, marginBottom: 10 }}>
                    {post.title}
                  </h3>
                  <p style={{ fontSize: 13, color: '#6b8070', lineHeight: 1.7, marginBottom: 18 }}>{post.excerpt}</p>
                  <Link
                    to={`/blog/${post.postId}`}
                    style={{
                      display: 'block', textAlign: 'center', background: '#c9a84c',
                      color: '#0d2b1a', padding: '11px', borderRadius: 6,
                      textDecoration: 'none', fontSize: 12, fontWeight: 700,
                      letterSpacing: '0.08em', transition: 'background 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#e0c060'}
                    onMouseLeave={e => e.currentTarget.style.background = '#c9a84c'}
                  >
                    READ MORE
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 44 }}>
            <Link
              to="/blog"
              style={{
                display: 'inline-block', border: '1.5px solid #1a4731', color: '#1a4731',
                padding: '13px 36px', borderRadius: 6, textDecoration: 'none',
                fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#1a4731'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#1a4731'; }}
            >
              VIEW ALL POSTS
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          NEWSLETTER (unchanged structure, no contact form)
      ═══════════════════════════════════════════ */}
      <section style={{ background: '#0d2b1a', padding: '80px 24px' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 'clamp(1.8rem,3.5vw,2.6rem)', fontWeight: 700, color: '#fff', marginBottom: 14 }}>
            Stay Connected
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', lineHeight: 1.8, marginBottom: 36 }}>
            Subscribe to our newsletter and never miss an update from
            the AME Church YPD community.
          </p>
          <form
            onSubmit={handleSubscribe}
            style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', maxWidth: 440, margin: '0 auto' }}
          >
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{
                flex: 1, minWidth: 200, padding: '13px 16px', borderRadius: 6,
                border: 'none', fontSize: 14, outline: 'none',
                fontFamily: "'Lato',sans-serif",
              }}
            />
            <button
              type="submit"
              style={{
                background: '#c9a84c', color: '#0d2b1a', border: 'none',
                padding: '13px 24px', borderRadius: 6, cursor: 'pointer',
                fontWeight: 700, fontSize: 13, letterSpacing: '0.08em',
                fontFamily: "'Lato',sans-serif", whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => e.target.style.background = '#e0c060'}
              onMouseLeave={e => e.target.style.background = '#c9a84c'}
            >
              Subscribe
            </button>
          </form>
          {subscribed && (
            <p style={{ color: '#c9a84c', marginTop: 18, fontFamily: 'Georgia,serif', fontSize: 15 }}>
              ✦ You're subscribed! God bless you.
            </p>
          )}
        </div>
      </section>

      {/* Keyframe animations */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Lato:wght@300;400;700&display=swap');
      
        @keyframes pulse {
          0%,100% { transform:scale(1); opacity:0.45; }
          50%      { transform:scale(1.07); opacity:1; }
        }
        @keyframes bounce {
          0%,100% { transform:translateX(-50%) translateY(0); }
          50%      { transform:translateX(-50%) translateY(8px); }
        }
        :root {
          --green-deep:   #0d2b1a;
          --green-dark:   #c9a84c;
          --green-mid:    #256040;
          --green-soft:   #3a7d56;
          --gold:         #c9a84c;
          --gold-light:   #e8c878;
          --gold-pale:    #f5edcf;
          --cream:        #fdf9f2;
          --cream-dark:   #f3ead8;
          --white:        #ffffff;
          --text-dark:    #1a2a1e;
          --text-mid:     #3d5247;
          --text-light:   #6b8070;
          --border:       rgba(201,168,76,0.18);
        }
        /* Tiles */
        .resource-tile { background: #ffffff; border: 1px solid rgba(201,168,76,0.15); border-radius: 10px; padding: 32px 24px; text-align: center; cursor: pointer; transition: all 0.3s ease; text-decoration: none; display: flex; flex-direction: column; align-items: center; gap: 14px; }
        .resource-tile:hover { border-color: #c9a84c; transform: translateY(-6px); box-shadow: 0 20px 48px rgba(26,71,49,0.12); }
        .resource-tile:hover .tile-icon-wrap { background: #c9a84c; }
        .resource-tile:hover .tile-icon-wrap svg { stroke: #c9a84c; }

        /* Section headers */
        .section-eyebrow { font-size: 11px; font-weight: 700; letter-spacing: 0.22em; color: var(--gold); font-family: 'Lato', sans-serif; margin-bottom: 12px; display: block; }
        .section-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(2rem, 4vw, 3rem); font-weight: 700; color: var(--text-dark); line-height: 1.15; }
        .section-title-light { font-family: 'Cormorant Garamond', serif; font-size: clamp(2rem, 4vw, 3rem); font-weight: 700; color: var(--white); line-height: 1.15; }
        .section-body { font-size: 15px; color: var(--text-light); line-height: 1.8; max-width: 520px; }
      `}</style>
    </div>
  );
};

export default HomePage;
