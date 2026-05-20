import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import leadershipService from '../services/leadershipService';

const StructurePage = () => {

  // ── Scroll to top on mount ──────────────────────────
  useEffect(() => { window.scrollTo(0, 0); }, []);

  /* ── Data ─────────────────────────────────────────── */
  const [leaders,      setLeaders]      = useState([]);
  
  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    leadershipService.getForStructure()
      .then(data => {
        // Sort by displayOrder ascending (lower number = first)
        const sorted = (Array.isArray(data) ? data : [])
          .sort((a, b) => a.displayOrder - b.displayOrder);
        setLeaders(sorted);
      })
      .catch(() => setLeaders([]));
  }, []);

  const areas = [
    {
      areaId: 1,
      name: 'Sibasa Area',
      elder: 'Rev. John Doe',
      churches: [
        'Bethel AME Church',
        'Emmanuel AME Church',
        'Grace AME Church',
      ],
    },
    {
      areaId: 2,
      name: 'Thohoyandou Area',
      elder: 'Rev. Jane Smith',
      churches: [
        'Trinity AME Church',
        'Zion AME Church',
        'Mount Olive AME Church',
      ],
    },
    {
      areaId: 3,
      name: 'Makhado Area',
      elder: 'Rev. Peter Baloyi',
      churches: [
        'Calvary AME Church',
        'Hope AME Church',
        'New Life AME Church',
      ],
    },
    {
      areaId: 4,
      name: 'Musina Area',
      elder: 'Rev. David Mukheli',
      churches: [
        'Faith AME Church',
        'Glory AME Church',
        'Resurrection AME Church',
      ],
    },
  ];

  const orgLevels = [
    { level: '01', title: 'Presiding Elders',         bg: '#0d2b1a', labelColor: '#c9a84c' },
    { level: '02', title: 'Ordained Ministers',        bg: '#1a4731', labelColor: '#c9a84c' },
    { level: '03', title: 'YPD Directors & Officers',  bg: '#256040', labelColor: '#fff'    },
    { level: '04', title: 'Area Church YPD Leaders',   bg: '#40916c', labelColor: '#fff'    },
  ];

  const [expandedArea, setExpandedArea] = useState(null);

  return (
    <div style={{ fontFamily: "'Lato',sans-serif", paddingTop: 64 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Lato:wght@300;400;700&display=swap');
        * { box-sizing: border-box; }

        /* ── Org tree connector lines (matching image 1) ── */
        .org-connector-v {
          width: 2px; height: 48px; background: #40916c; margin: 0 auto;
        }
        .org-connector-h {
          display: flex; align-items: center; justify-content: center; gap: 0; margin: 0 auto;
        }

        /* ── Area card ── */
        .area-card {
          background: #fff; border: 1px solid rgba(26,71,49,0.12); border-radius: 14px; overflow: hidden; transition: box-shadow 0.25s, transform 0.25s; cursor: pointer;
        }
        .area-card:hover {
          box-shadow: 0 12px 32px rgba(26,71,49,0.12); transform: translateY(-3px);
        }

        /* ── Church row (image 1 — cream bg, full-width pill) ── */
        .church-row {
          background: #fdf5e0; border: 1px solid #e8d9a0; border-radius: 8px; padding: 12px 18px; font-family: 'Lato', sans-serif; font-size: 14px; color: #3d3000; transition: background 0.2s;
        }
        .church-row:hover { background: #f5e9b8; }
      
        /* Leader card — horizontal layout with real photo */
        .leader-card { background:#fff; border:1px solid rgba(26,71,49,.1); border-radius:14px; padding:20px 22px; display:flex; align-items:center; gap:18px; transition:all .3s; }
        .leader-card:hover { box-shadow:0 8px 24px rgba(26,71,49,.1); transform:translateY(-2px); }
        .leader-avatar { width:64px; height:64px; border-radius:50%; overflow:hidden; background:#0d2b1a; border:2px solid #c9a84c; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
      `}</style>

      {/* ── HERO ── */}
      <div style={{ background: 'linear-gradient(150deg,#071812,#0d2b1a 50%,#1a4731)', padding: '120px 24px 80px', textAlign: 'center' }}>
        <span style={{ fontFamily: 'Lato,sans-serif', fontSize: 10, fontWeight: 700, letterSpacing: '.24em', color: '#c9a84c', display: 'block', marginBottom: 12 }}>
          MOKONE YPD CONFERENCE
        </span>
        <h1 style={{ fontFamily: 'Georgia,serif', fontSize: 'clamp(2.4rem,5vw,4rem)', fontWeight: 700, color: '#fff', lineHeight: 1.1, marginBottom: 16 }}>
          Organizational Structure
        </h1>
        <p style={{ fontFamily: 'Lato,sans-serif', fontSize: 15, color: 'rgba(255,255,255,.6)', maxWidth: 500, margin: '0 auto', lineHeight: 1.8 }}>
          Discover how the Mokone YPD Conference is organized — from our Presiding Elders down to every local church in each area.
        </p>
      </div>

      {/* ═══════════════════════════════════════════
          ORG CHART TREE  (matching image 1 exactly)
      ═══════════════════════════════════════════ */}
      <section style={{ background: '#f0f7f3', padding: '80px 24px' }}>
              <div style={{ maxWidth: 900, margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: 52 }}>
                  <span style={{ fontFamily: 'Lato,sans-serif', fontSize: 10, fontWeight: 700, letterSpacing: '.22em', color: '#c9a84c', display: 'block', marginBottom: 12 }}>HOW WE ARE ORGANISED</span>
                  <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 700, color: '#0d2b1a' }}>Conference Hierarchy</h2>
                </div>
      
                {/* Root */}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <div style={{ background: '#1a6640', color: '#fff', fontFamily: 'Georgia,serif', fontSize: 16, fontWeight: 600, padding: '14px 48px', borderRadius: 8, boxShadow: '0 4px 16px rgba(26,71,49,.25)' }}>
                    Presiding Elders
                  </div>
                </div>
                <div className="org-connector-v" />
      
                {/* Level 2 */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, maxWidth: 700, margin: '0 auto' }}>
                  {['Ordained Ministers', 'YPD Directors'].map(b => (
                    <div key={b} style={{ border: '1.5px solid #c9a84c', borderRadius: 10, padding: '18px 24px', textAlign: 'center', background: '#fff', fontFamily: 'Georgia,serif', fontSize: 16, fontWeight: 600, color: '#1a4731' }}>
                      {b}
                    </div>
                  ))}
                </div>
                <div className="org-connector-v" />
      
                {/* Area panels */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {areas.map(area => (
                    <div key={area.areaId} className="area-card"
                      onClick={() => setExpandedArea(expandedArea === area.areaId ? null : area.areaId)}>
                      <div style={{ padding: '18px 24px', background: expandedArea === area.areaId ? '#f0f7f3' : '#fff', borderBottom: expandedArea === area.areaId ? '1px solid rgba(26,71,49,.1)' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontFamily: 'Georgia,serif', fontSize: 18, fontWeight: 700, color: '#0d2b1a' }}>{area.name}</div>
                          <div style={{ fontSize: 12, color: '#6b8070', marginTop: 3 }}>Elder: {area.elder}</div>
                        </div>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: expandedArea === area.areaId ? '#1a4731' : 'rgba(26,71,49,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={expandedArea === area.areaId ? '#fff' : '#1a4731'} strokeWidth="2.5" strokeLinecap="round">
                            <polyline points={expandedArea === area.areaId ? '18 15 12 9 6 15' : '6 9 12 15 18 9'} />
                          </svg>
                        </div>
                      </div>
                      {expandedArea === area.areaId && (
                        <div style={{ padding: '16px 20px', background: '#fafaf8', display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {area.churches.map((church, idx) => (
                            <div key={idx} className="church-row">{church}</div>
                          ))}
                          <div style={{ paddingTop: 8, textAlign: 'right' }}>
                            <Link to="/charges" style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.08em', color: '#1a4731', textDecoration: 'none' }}>VIEW ON MAP →</Link>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#6b8070' }}>Click an area to expand and see its churches.</p>
              </div>
            </section>
      
            {/* ── OUR LEADERSHIP — photos from DB/Media ── */}
            <section style={{ background: '#fff', padding: '80px 24px' }}>
              <div style={{ maxWidth: 900, margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: 16 }}>
                  <span style={{ fontFamily: 'Lato,sans-serif', fontSize: 10, fontWeight: 700, letterSpacing: '.22em', color: '#c9a84c', display: 'block', marginBottom: 12 }}>OUR LEADERSHIP</span>
                  <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 700, color: '#0d2b1a', marginBottom: 8 }}>Conference Leadership Team</h2>
                  <p style={{ fontSize: 13, color: '#6b8070', marginBottom: 40 }}>
                    All leaders are listed below, ranked by their display order.
                  </p>
                </div>
      
                {leaders.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: '#aaa' }}>
                    <p style={{ fontSize: 14 }}>No leaders added yet.</p>
                    <p style={{ fontSize: 12, marginTop: 8 }}>Go to <strong>Admin → Leadership</strong> to add your team members.</p>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(380px,1fr))', gap: 16 }}>
                    {leaders.map(person => (
                      <div key={person.leaderId} style={{background:'#fff', border:'1px solid rgba(26,71,49,.1)', borderRadius:'14px', padding:'20px 22px', display:'flex', alignItems:'center', gap:'18px', transition:'all .3s' }}
                        onMouseEnter={e => { e.currentTarget.style.boxShadow='0 8px 24px rgba(26,71,49,.1)'; e.currentTarget.style.transform='translateY(-2px)'; }}
                        onMouseLeave={e => { e.currentTarget.style.boxShadow='none'; e.currentTarget.style.transform='translateY(0)'; }}>
                        {/* Avatar — real photo or initials */}
                        <div style={{ width:64, height:64, borderRadius:'50%', overflow:'hidden', background:'#0d2b1a', border:'2px solid #c9a84c', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                          {person.photoUrl ? (
                            <img src={person.photoUrl} alt={person.name}
                              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                              onError={e => { e.target.style.display = 'none'; }} />
                          ) : (
                            <span style={{ color: '#c9a84c', fontFamily: 'Georgia,serif', fontWeight: 700, fontSize: 20 }}>
                              {person.initials || person.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                            </span>
                          )}
                        </div>
                        <div>
                          <div style={{ fontFamily: 'Georgia,serif', fontSize: 17, fontWeight: 700, color: '#0d2b1a', marginBottom: 3 }}>{person.name}</div>
                          <div style={{ fontFamily: "'Lato',sans-serif", fontSize: 12, color: '#c9a84c', fontWeight: 700, letterSpacing: '.06em', marginBottom: person.description ? 6 : 0 }}>{person.role}</div>
                          {person.description && <p style={{ fontSize: 12, color: '#6b8070', lineHeight: 1.5 }}>{person.description}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
      
            {/* ── STRUCTURE OVERVIEW LEVELS ── */}
            <section style={{ background: '#f0f7f3', padding: '80px 24px' }}>
              <div style={{ maxWidth: 680, margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: 48 }}>
                  <span style={{ fontFamily: 'Lato,sans-serif', fontSize: 10, fontWeight: 700, letterSpacing: '.22em', color: '#c9a84c', display: 'block', marginBottom: 12 }}>LEVELS OF AUTHORITY</span>
                  <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 'clamp(1.6rem,3vw,2.2rem)', fontWeight: 700, color: '#0d2b1a' }}>Conference Structure Overview</h2>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {orgLevels.map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div style={{ width: 44, height: 44, borderRadius: '50%', background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c9a84c', fontFamily: 'Georgia,serif', fontWeight: 700, fontSize: 13, flexShrink: 0, border: '2px solid rgba(201,168,76,.3)' }}>
                        {item.level}
                      </div>
                      <div style={{ flex: 1, background: item.bg, color: '#fff', padding: '15px 26px', borderRadius: 8, fontFamily: 'Georgia,serif', fontSize: 16, fontWeight: 600 }}>
                        {item.title}
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ textAlign: 'center', marginTop: 36 }}>
                  <Link to="/about"
                    style={{ display: 'inline-block', background: '#c9a84c', color: '#0d2b1a', padding: '13px 32px', borderRadius: 6, textDecoration: 'none', fontSize: 13, fontWeight: 700, letterSpacing: '.08em' }}
                    onMouseEnter={e => e.target.style.background = '#e0c060'} onMouseLeave={e => e.target.style.background = '#c9a84c'}>
                    LEARN MORE ABOUT US
                  </Link>
                </div>
              </div>
            </section>
      
            {/* CTA */}
            <section style={{ background: '#0d2b1a', padding: '80px 24px', textAlign: 'center' }}>
              <div style={{ maxWidth: 560, margin: '0 auto' }}>
                <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 'clamp(1.8rem,3.5vw,2.4rem)', fontWeight: 700, color: '#fff', marginBottom: 14 }}>Find a Church Near You</h2>
                <p style={{ fontSize: 15, color: 'rgba(255,255,255,.55)', lineHeight: 1.8, marginBottom: 32 }}>
                  Use our Church Finder to locate a congregation in your area and connect with your local YPD community.
                </p>
                <Link to="/charges"
                  style={{ display: 'inline-block', background: '#c9a84c', color: '#0d2b1a', padding: '14px 36px', borderRadius: 6, textDecoration: 'none', fontSize: 13, fontWeight: 700, letterSpacing: '.1em', marginRight: 12, marginBottom: 12 }}
                  onMouseEnter={e => e.target.style.background = '#e0c060'} onMouseLeave={e => e.target.style.background = '#c9a84c'}>
                  CHURCH FINDER
                </Link>
                <Link to="/contact"
                  style={{ display: 'inline-block', border: '1.5px solid rgba(255,255,255,.4)', color: '#fff', padding: '14px 36px', borderRadius: 6, textDecoration: 'none', fontSize: 13, letterSpacing: '.1em' }}
                  onMouseEnter={e => { e.target.style.borderColor = '#c9a84c'; e.target.style.color = '#c9a84c'; }}
                  onMouseLeave={e => { e.target.style.borderColor = 'rgba(255,255,255,.4)'; e.target.style.color = '#fff'; }}>
                  CONTACT US
                </Link>
              </div>
            </section>
          </div>
        );
      };
      
      export default StructurePage;
      