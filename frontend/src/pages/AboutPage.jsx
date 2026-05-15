import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import leadershipService from '../services/leadershipService';
import mediaService from '../services/mediaService';
import api, { buildMediaUrl } from '../services/api';

/* ─── Shared styles injected once ─── */
const PageStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Lato:wght@300;400;700&display=swap');
    :root {
      --gd: #071812; --gk: #0d2b1a; --gm: #1a4731; --gs: #256040; --gl: #40916c;
      --gd2: #3a7d56; --gold: #c9a84c; --gold2: #e0c060; --cream: #fdf9f2;
      --cream2: #f3ead8; --white: #fff; --td: #0d2b1a; --tm: #3d5247; --tl: #6b8070;
    }
    .page-hero { background: linear-gradient(150deg,#071812 0%,#0d2b1a 50%,#1a4731 100%); padding:120px 24px 80px; text-align:center; }
    .eyebrow { font-family:'Lato',sans-serif; font-size:10px; font-weight:700; letter-spacing:.24em; color:var(--gold); display:block; margin-bottom:12px; }
    .page-title { font-family:'Cormorant Garamond',serif; font-size:clamp(2.4rem,5vw,4rem); font-weight:700; color:#fff; line-height:1.1; margin-bottom:16px; }
    .page-subtitle { font-family:'Lato',sans-serif; font-size:15px; color:rgba(255,255,255,.6); line-height:1.8; max-width:520px; margin:0 auto; }
    .section { padding:80px 24px; }
    .section-bg { background:var(--cream); }
    .section-white { background:#fff; }
    .section-dark { background:var(--gk); }
    .inner { max-width:1200px; margin:0 auto; }
    .grid-2 { display:grid; grid-template-columns:repeat(auto-fit,minmax(320px,1fr)); gap:48px; align-items:center; }
    .grid-3 { display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:28px; }
    .grid-4 { display:grid; grid-template-columns:repeat(auto-fill,minmax(191.6px,1fr)); gap:24px; }
    .card { background:#fff; border-radius:12px; border:1px solid rgba(0,0,0,.07); overflow:hidden; transition:all .3s; }
    .card:hover { transform:translateY(-4px); box-shadow:0 16px 40px rgba(26,71,49,.12); }
    .btn-gold { background:var(--gold); color:var(--gk); border:none; padding:13px 32px; border-radius:5px; font-family:'Lato',sans-serif; font-size:12px; font-weight:700; letter-spacing:.1em; cursor:pointer; text-decoration:none; display:inline-block; transition:background .2s; }
    .btn-gold:hover { background:var(--gold2); }
    .btn-outline { border:1.5px solid var(--gm); color:var(--gm); padding:13px 32px; border-radius:5px; font-family:'Lato',sans-serif; font-size:12px; font-weight:700; letter-spacing:.1em; cursor:pointer; text-decoration:none; display:inline-block; transition:all .2s; background:transparent; }
    .btn-outline:hover { background:var(--gm); color:#fff; }
    .leader-card{background:#fff;border:1px solid rgba(26,71,49,.1);border-radius:14px;padding:28px 22px;transition:all .3s;display:flex;gap:18px;align-items:flex-start;}
    .leader-card:hover{box-shadow:0 12px 32px rgba(26,71,49,.1);transform:translateY(-3px);}
  `}</style>
);

// Fallback mosaic tiles when no media images are uploaded yet
const JOURNEY_FALLBACKS = [
  { bg: 'linear-gradient(135deg,#1a4731,#40916c)', label: 'Worship' },
  { bg: 'linear-gradient(135deg,#0d2b1a,#256040)', label: 'Fellowship' },
  { bg: 'linear-gradient(135deg,#7d5b00,#c9a84c)', label: 'Youth' },
  { bg: 'linear-gradient(135deg,#256040,#3a7d56)', label: 'Service' },
];

const AboutPage = () => {
  const [leaders,       setLeaders]       = useState([]);
  const [journeyImages, setJourneyImages] = useState([]); // "Journey of Faith" mosaic
  const [formData, setFormData] = useState({ firstName:'', lastName:'', email:'', phone:'', message:'' });
  const [sent, setSent] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    // Load leaders for About page
    leadershipService.getForAbout()
      .then(data => setLeaders(Array.isArray(data) ? data : []))
      .catch(() => setLeaders([]));

    // Load "Journey of Faith" mosaic images (usage = ABOUT_JOURNEY)
    mediaService.getByUsage('ABOUT_JOURNEY')
      .then(data => setJourneyImages(Array.isArray(data) ? data.slice(0, 4) : []))
      .catch(() => setJourneyImages([]));
  }, []);

  const values = [
    { icon:'✝', title:'Faith',     desc:'Rooted in the teachings of Jesus Christ and the Methodist tradition.' },
    { icon:'⬡', title:'Community', desc:'Building strong bonds of fellowship and mutual support.' },
    { icon:'★', title:'Excellence',desc:'Striving for the highest standards in all we do.' },
    { icon:'♡', title:'Service',   desc:'Serving others with humility and compassion every day.' },
    { icon:'📖', title:'Education', desc:'Committed to lifelong learning and spiritual growth.' },
    { icon:'☮', title:'Peace',     desc:'Promoting harmony and reconciliation in our communities.' },
  ];

  const milestones = [
    { year:'1980', event:'Mokone YPD Conference founded by visionary church leaders.' },
    { year:'1995', event:'Expanded to 10 areas across South Africa.' },
    { year:'2005', event:'Launched the Youth Leadership Development Programme.' },
    { year:'2015', event:'Reached 500+ active members across all areas.' },
    { year:'2024', event:'Launched digital ministry and this online platform.' },
  ];

  const orgLevels = [
    { level: '01', title: 'Presiding Elder',          bg: '#3b0350' },
    { level: '02', title: 'Ordained Ministers',        bg: '#099bea' },
    { level: '03', title: 'YPD Directors & Officers',  bg: '#0d2b1a' },
    { level: '04', title: 'Area Church YPD Leaders',   bg: '#eaf608' },
  ];

  const handleSubmit = e => { e.preventDefault(); if (formData.email && formData.message) setSent(true); };

  // Build the Journey mosaic: use real images if available, else fallbacks
  // const mosaicTiles = journeyImages.length > 0
  //   ? journeyImages.map(img => ({ src: img.fileUrl, label: img.title || '' }))
  //   : JOURNEY_FALLBACKS.map(f => ({ src: null, bg: f.bg, label: f.label }));

  const mosaicTiles = (() => {
    const real = journeyImages
      .slice(0, 4)
      .map(img => ({
        src: buildMediaUrl(img.fileUrl),  // ← only change this line
        label: img.title || '',
      }));
    return [
      ...real,
      ...JOURNEY_FALLBACKS.slice(real.length).map(f => ({ src: null, bg: f.bg, label: f.label })),
    ].slice(0, 4);
  })();

  return (
    <div style={{ fontFamily:"'Lato',sans-serif", paddingTop:64 }}>
      <PageStyles />

      {/* ── HERO ── */}
      <div className="page-hero">
        <span className="eyebrow">ABOUT US</span>
        <h1 className="page-title">
          Empowering our community<br />
          <span style={{ color:'var(--gold)', fontStyle:'italic' }}>through faith and unity</span>
        </h1>
        <p style={{ fontFamily: "'Lato',sans-serif", fontSize: 15, color: 'rgba(255,255,255,.6)', maxWidth: 520, margin: '0 auto', lineHeight: 1.8 }}>
          We strive to provide a welcoming space for worship and growth,
          encouraging faith-driven lives across the Mokone YPD Conference.
        </p>
        <div style={{ marginTop:36 }}>
          <Link to="/register" className="btn-gold">Join Us</Link>
        </div>
      </div>

      {/* ── JOURNEY OF FAITH — image left, text right ── */}
      <section className="section section-white">
        <div className="inner grid-2">
          {/* Photo mosaic */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gridTemplateRows:'180px 180px', gap:12, alignSelf: 'stretch', minHeight: 412 }}>
           {mosaicTiles.map((tile, i) => (
            <div key={i} style={{
              borderRadius: 8,
              overflow: 'hidden',
              background: tile.bg || 'linear-gradient(135deg,#1a4731,#40916c)',
              position: 'relative',
              height: '100%',       // ← ADD THIS
            }}>
              {tile.src && (
                <img 
                  src={tile.src} 
                  alt={tile.label}
                  style={{ 
                    position: 'absolute', inset: 0,
                    width: '100%', height: '100%', 
                    objectFit: 'cover',
                  }} 
                />
              )}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(0,0,0,.5) 0%,transparent 60%)' }} />
              <span style={{ 
                position: 'absolute', bottom: 14, left: 14,
                fontFamily: 'Georgia,serif', fontSize: 13, 
                color: 'rgba(255,255,255,.8)', fontStyle: 'italic',
              }}>
                {tile.label}
              </span>
            </div>
          ))}
          </div>
          <div>
            <span className="eyebrow">A JOURNEY OF FAITH</span>
            <h2 style={{ fontFamily:'Georgia,serif', fontSize:'clamp(1.8rem,3vw,2.6rem)', fontWeight:700, color:'var(--td)', lineHeight:1.2, marginBottom:18 }}>
              Mokone YPD Conference — A Beacon of Hope
            </h2>
            <p style={{ fontSize:15, color:'var(--tl)', lineHeight:1.85, marginBottom:14 }}>
              Mokone YPD Conference has been a beacon of hope and guidance, fostering spiritual growth since its inception. We are a vibrant community of young people committed to living out their faith with boldness and purpose.
            </p>
            <p style={{ fontFamily:'Georgia,serif', fontStyle:'italic', fontSize:17, color:'var(--gm)', marginBottom:28 }}>
              "Iron sharpens iron, and one person sharpens another." — Proverbs 27:17
            </p>
            <Link to="/contact" className="btn-gold" style={{ margin:12 }}>Learn More</Link>
            <Link to="/events" className="btn-outline">Upcoming Events</Link>
          </div>
        </div>
      </section>

      {/* ── MISSION & VISION ── */}
      <section className="section section-bg">
        <div className="inner">
          <div style={{ textAlign:'center', marginBottom:52 }}>
            <span className="eyebrow">OUR PURPOSE</span>
            <h2 style={{ fontFamily:'Georgia,serif', fontSize:'clamp(1.8rem,3vw,2.6rem)', fontWeight:700, color:'var(--td)' }}>
              What Drives Us Forward
            </h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:28 }}>
            {/* Mission */}
            <div style={{ background:'#fff', borderLeft:'4px solid var(--gm)', borderRadius:'0 10px 10px 0', padding:'36px 32px', boxShadow:'0 4px 20px rgba(26,71,49,.06)' }}>
              <div style={{ fontSize:32, color:'var(--gm)', marginBottom:14, fontFamily:'Georgia,serif' }}>✦</div>
              <h3 style={{ fontFamily:'Georgia,serif', fontSize:22, color:'var(--td)', marginBottom:14 }}>Our Mission</h3>
              <p style={{ fontSize:15, color:'var(--tl)', lineHeight:1.85 }}>
                To empower youth and young adults within the African Methodist Episcopal Church to grow in faith, develop leadership skills, and serve their communities with love and dedication.
              </p>
            </div>
            {/* Vision */}
            <div style={{ background:'var(--gk)', borderLeft:'4px solid var(--gold)', borderRadius:'0 10px 10px 0', padding:'36px 32px' }}>
              <div style={{ fontSize:32, color:'var(--gold)', marginBottom:14, fontFamily:'Georgia,serif' }}>◈</div>
              <h3 style={{ fontFamily:'Georgia,serif', fontSize:22, color:'var(--gold)', marginBottom:14 }}>Our Vision</h3>
              <p style={{ fontSize:15, color:'rgba(255,255,255,.75)', lineHeight:1.85 }}>
                To be a beacon of hope for young people across South Africa — building a generation of faithful, compassionate, and courageous leaders who transform their communities for Christ.
              </p>
            </div>
            {/* Values summary */}
            <div style={{ background:'var(--gold)', borderLeft:'4px solid var(--gk)', borderRadius:'0 10px 10px 0', padding:'36px 32px' }}>
              <div style={{ fontSize:32, color:'var(--gk)', marginBottom:14, fontFamily:'Georgia,serif' }}>❋</div>
              <h3 style={{ fontFamily:'Georgia,serif', fontSize:22, color:'var(--gk)', marginBottom:14 }}>Our Foundation</h3>
              <p style={{ fontSize:15, color:'rgba(10,40,20,.75)', lineHeight:1.85 }}>
                Grounded in the Word of God, the Wesleyan tradition, and the rich heritage of the AME Church — we stand on a foundation that has endured for generations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── GUIDING PRINCIPLES / LEADERSHIP ── */}
      <section className="section section-white">
        <div className="inner">
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(340px,1fr))', gap:64, alignItems:'start' }}>
            <div>
              <span className="eyebrow">GUIDING PRINCIPLES</span>
              <h2 style={{ fontFamily:'Georgia,serif', fontSize:'clamp(1.8rem,3vw,2.6rem)', fontWeight:700, color:'var(--td)', marginBottom:18 }}>
                Led with Integrity<br /><span style={{ color:'var(--gs)', fontStyle:'italic' }}>& Compassion</span>
              </h2>
              <p style={{ fontSize:15, color:'var(--tl)', lineHeight:1.85, marginBottom:18 }}>
                Our dedicated leadership team consists of experienced members who guide our community with integrity and compassion. We are committed to fostering spiritual growth, building strong networks, and ensuring every voice is heard and valued.
              </p>
              <p style={{ fontSize:15, color:'var(--tl)', lineHeight:1.85, marginBottom:28 }}>
                Their vision is rooted in love, service, and a devotion to faith that inspires our congregants daily.
              </p>
              <Link to="/contact" className="btn-gold">Meet Us</Link>
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              {leaders.length === 0 ? (
                <p style={{ color: 'var(--tl)', fontSize: 14 }}>
                  No leaders added yet. Go to Admin → Leadership to add your team.
                </p>
              ) : leaders.map(l => (
                <div key={l.leaderId} className="leader-card">
                  {/* Photo or initials fallback */}
                  <div style={{ width: 56, height: 56, borderRadius: '50%', overflow: 'hidden', background: 'var(--gk)', border: '2px solid var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)', fontFamily: 'Georgia,serif', fontWeight: 700, fontSize: 15, flexShrink: 0 }}>
                    {l.photoUrl ? (
                      <img src={l.photoUrl} alt={l.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={e => { e.target.style.display = 'none'; }} />
                    ) : (l.initials || l.name.split(' ').map(w => w[0]).join('').slice(0, 2))}
                  </div>
                  <div>
                    <div style={{ fontFamily: 'Georgia,serif', fontWeight: 700, fontSize: 16, color: 'var(--td)', marginBottom: 2 }}>{l.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--gold)', letterSpacing: '.1em', marginBottom: 6, fontFamily: "'Lato',sans-serif", fontWeight: 700 }}>{l.role}</div>
                    {l.description && <p style={{ fontSize: 13, color: 'var(--tl)', lineHeight: 1.6 }}>{l.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CORE VALUES ── */}
      <section className="section section-bg">
        <div className="inner">
          <div style={{ textAlign:'center', marginBottom:52 }}>
            <span className="eyebrow">WHAT WE BELIEVE</span>
            <h2 style={{ fontFamily:'Georgia,serif', fontSize:'clamp(1.8rem,3vw,2.6rem)', fontWeight:700, color:'var(--td)' }}>Our Core Values</h2>
          </div>
          <div className="grid-4" style={{ gap:10 }}>
            {values.map((v,i) => (
              <div key={i} style={{ background:'#fff', borderRadius:10, padding:'28px 22px', textAlign:'center', border:'1px solid rgba(0,0,0,.07)', transition:'all .3s', cursor:'default' }}
                onMouseEnter={e=>{ e.currentTarget.style.borderColor='var(--gold)'; e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 12px 32px rgba(26,71,49,.1)'; }}
                onMouseLeave={e=>{ e.currentTarget.style.borderColor='rgba(0,0,0,.07)'; e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; }}>
                <div style={{ fontSize:28, color:'var(--gold)', marginBottom:14 }}>{v.icon}</div>
                <div style={{ fontFamily:'Georgia,serif', fontSize:17, color:'var(--td)', marginBottom:8 }}>{v.title}</div>
                <p style={{ fontSize:13, color:'var(--tl)', lineHeight:1.65 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ENGAGING TOGETHER / HISTORY TIMELINE ── */}
      <section className="section section-dark">
        <div className="inner">
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(320px,1fr))', gap:64, alignItems:'center' }}>
            <div>
              <span className="eyebrow">ENGAGING TOGETHER</span>
              <h2 style={{ fontFamily:'Georgia,serif', fontSize:'clamp(1.8rem,3vw,2.6rem)', fontWeight:700, color:'#fff', marginBottom:18 }}>
                Our Journey Through the Years
              </h2>
              <p style={{ fontSize:15, color:'rgba(255,255,255,.6)', lineHeight:1.85, marginBottom:28 }}>
                We foster an engaged community through various events and activities that promote fellowship, spiritual growth and service to the broader community.
              </p>
              <Link to="/events" className="btn-gold">Get Involved</Link>
            </div>
            {/* Timeline */}
            <div style={{ position:'relative', paddingLeft:28 }}>
              <div style={{ position:'absolute', left:8, top:0, bottom:0, width:2, background:'rgba(201,168,76,.25)' }} />
              {milestones.map((m,i) => (
                <div key={i} style={{ position:'relative', marginBottom:28, paddingLeft:24 }}>
                  <div style={{ position:'absolute', left:-20, top:4, width:14, height:14, borderRadius:'50%', background:'var(--gold)', border:'3px solid var(--gk)' }} />
                  <div style={{ fontSize:12, fontWeight:700, letterSpacing:'.1em', color:'var(--gold)', marginBottom:4 }}>{m.year}</div>
                  <p style={{ fontSize:14, color:'rgba(255,255,255,.65)', lineHeight:1.65 }}>{m.event}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── ORGANISATIONAL STRUCTURE PREVIEW ── */}
      <section className="section section-white">
        <div className="inner" style={{ textAlign:'center' }}>
          <span className="eyebrow">HOW WE'RE ORGANISED</span>
          <h2 style={{ fontFamily:'Georgia,serif', fontSize:'clamp(1.8rem,3vw,2.6rem)', fontWeight:700, color:'var(--td)', marginBottom:40 }}>
            Conference Structure
          </h2>
          <div style={{ maxWidth:640, margin:'0 auto' }}>
            {orgLevels.map((item,i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:16, marginBottom:12 }}>
                <div style={{ width:44, height:44, borderRadius:'50%', background:item.color, display:'flex', alignItems:'center', justifyContent:'center', color:'var(--gold)', fontFamily:'Georgia,serif', fontSize:12, fontWeight:700, flexShrink:0 }}>
                  {item.level}
                </div>
                <div style={{ flex:1, background:item.color, color:'#fff', padding:'14px 24px', borderRadius:8, textAlign:'left', fontFamily:'Georgia,serif', fontSize:16 }}>
                  {item.title}
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop:32 }}>
            <Link to="/structure" className="btn-gold" style={{ marginRight:12 }}>Full Structure</Link>
            <Link to="/contact" className="btn-outline">Reach Out</Link>
          </div>
        </div>
      </section>

      {/* ── CONTACT FORM (Wix about page has one) ── */}
      <section className="section section-bg">
        <div className="inner" style={{ maxWidth:700 }}>
          <div style={{ textAlign:'center', marginBottom:44 }}>
            <span className="eyebrow">REACH OUT</span>
            <h2 style={{ fontFamily:'Georgia,serif', fontSize:'clamp(1.6rem,3vw,2.2rem)', fontWeight:700, color:'var(--td)', marginBottom:8 }}>We're Here to Help</h2>
            <p style={{ fontSize:14, color:'var(--tl)' }}>Connect with Mokone YPD Conference — we'd love to hear from you.</p>
          </div>
          {sent ? (
            <div style={{ textAlign:'center', padding:'48px 0' }}>
              <div style={{ width:64, height:64, borderRadius:'50%', background:'rgba(37,96,64,.1)', border:'2px solid var(--gs)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', fontSize:26, color:'var(--gs)' }}>✓</div>
              <h3 style={{ fontFamily:'Georgia,serif', fontSize:22, color:'var(--gm)', marginBottom:10 }}>Message Received!</h3>
              <p style={{ color:'var(--tl)', fontSize:14 }}>We'll respond soon. God bless you!</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ background:'#fff', borderRadius:12, padding:'36px 32px', border:'1px solid rgba(0,0,0,.06)' }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>
                {[['firstName','First name','Thendo'],['lastName','Last name','Ramurafhi']].map(([k,l,ph]) => (
                  <div key={k}>
                    <label style={{ display:'block', fontSize:11, fontWeight:700, letterSpacing:'.12em', color:'var(--tm)', marginBottom:7 }}>{l.toUpperCase()}</label>
                    <input placeholder={ph} value={formData[k]} onChange={e=>setFormData({...formData,[k]:e.target.value})}
                      style={{ width:'100%', padding:'12px 14px', border:'1.5px solid rgba(26,71,49,.18)', borderRadius:6, fontSize:14, outline:'none', fontFamily:"'Lato',sans-serif", boxSizing:'border-box' }} />
                  </div>
                ))}
              </div>
              {[['email','Email *','thendo@example.com','email'],['phone','Phone','+ 27 12 345 6789','tel']].map(([k,l,ph,t]) => (
                <div key={k} style={{ marginBottom:16 }}>
                  <label style={{ display:'block', fontSize:11, fontWeight:700, letterSpacing:'.12em', color:'var(--tm)', marginBottom:7 }}>{l.toUpperCase()}</label>
                  <input type={t} required={k==='email'} placeholder={ph} value={formData[k]} onChange={e=>setFormData({...formData,[k]:e.target.value})}
                    style={{ width:'100%', padding:'12px 14px', border:'1.5px solid rgba(26,71,49,.18)', borderRadius:6, fontSize:14, outline:'none', fontFamily:"'Lato',sans-serif", boxSizing:'border-box' }} />
                </div>
              ))}
              <div style={{ marginBottom:22 }}>
                <label style={{ display:'block', fontSize:11, fontWeight:700, letterSpacing:'.12em', color:'var(--tm)', marginBottom:7 }}>MESSAGE *</label>
                <textarea required rows={4} placeholder="Write your message..." value={formData.message} onChange={e=>setFormData({...formData,message:e.target.value})}
                  style={{ width:'100%', padding:'12px 14px', border:'1.5px solid rgba(26,71,49,.18)', borderRadius:6, fontSize:14, outline:'none', resize:'vertical', fontFamily:"'Lato',sans-serif", boxSizing:'border-box' }} />
              </div>
              <button type="submit" className="btn-gold" style={{ width:'100%', padding:'15px', fontSize:13 }}>Submit</button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
