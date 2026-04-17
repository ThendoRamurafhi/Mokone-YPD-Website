import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';

const MediaPage = () => {
  const [activeTab, setActiveTab] = useState('PHOTOS');
  const [lightbox, setLightbox] = useState(null);

  const mediaItems = [
    { id:1,  type:'IMAGE', title:'Youth Conference Highlights',    category:'Events',   gradient:'linear-gradient(135deg,#1a4731,#40916c)' },
    { id:2,  type:'IMAGE', title:'Community Outreach Day',         category:'Outreach', gradient:'linear-gradient(135deg,#0d2b1a,#256040)' },
    { id:3,  type:'IMAGE', title:'Sunday Worship Service',         category:'Worship',  gradient:'linear-gradient(135deg,#7d5b00,#c9a84c)' },
    { id:4,  type:'IMAGE', title:'Annual Conference 2025',         category:'Events',   gradient:'linear-gradient(135deg,#1a2a40,#2a4060)' },
    { id:5,  type:'IMAGE', title:'Youth Leadership Training',      category:'Training', gradient:'linear-gradient(135deg,#2a1a40,#5a2a80)' },
    { id:6,  type:'IMAGE', title:'Community Prayer Night',         category:'Worship',  gradient:'linear-gradient(135deg,#1a4020,#40916c)' },
    { id:7,  type:'VIDEO', title:'Youth Conference 2025 Recap',    category:'Events',   gradient:'linear-gradient(135deg,#1a4731,#40916c)', ytId:'dQw4w9WgXcQ' },
    { id:8,  type:'VIDEO', title:'Sunday Worship — Full Service',  category:'Worship',  gradient:'linear-gradient(135deg,#0d2b1a,#1a4731)', ytId:'dQw4w9WgXcQ' },
    { id:9,  type:'VIDEO', title:'Christmas Service 2025',         category:'Worship',  gradient:'linear-gradient(135deg,#7d5b00,#c9a84c)', ytId:'dQw4w9WgXcQ' },
    { id:10, type:'AUDIO', title:'Faith in Action — Sermon',       category:'Sermons',  gradient:'linear-gradient(135deg,#1a4731,#256040)' },
    { id:11, type:'AUDIO', title:'Prayer & Intercession Session',  category:'Prayer',   gradient:'linear-gradient(135deg,#0d2b1a,#40916c)' },
    { id:12, type:'AUDIO', title:'Gospel Music — Praise Night',    category:'Music',    gradient:'linear-gradient(135deg,#7d5b00,#c9a84c)' },
  ];

  const photos = mediaItems.filter(m=>m.type==='IMAGE');
  const videos = mediaItems.filter(m=>m.type==='VIDEO');
  const audios = mediaItems.filter(m=>m.type==='AUDIO');
  const current = activeTab==='PHOTOS'?photos:activeTab==='VIDEOS'?videos:audios;

  return (
    <div style={{ fontFamily:"'Lato',sans-serif", paddingTop:64 }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Lato:wght@300;400;700&display=swap');
        .media-card{border-radius:12px;overflow:hidden;cursor:pointer;transition:all .3s;}
        .media-card:hover{transform:scale(1.02);box-shadow:0 16px 40px rgba(0,0,0,.25);}
        .tab-btn{padding:12px 28px;border:none;font-family:'Lato',sans-serif;font-size:13px;font-weight:700;letter-spacing:.08em;cursor:pointer;transition:all .25s;border-bottom:3px solid transparent;}
        .tab-btn.active{color:#1a4731;border-bottom-color:#c9a84c;background:transparent;}
        .tab-btn:not(.active){color:#6b8070;background:transparent;}
        .tab-btn:hover:not(.active){color:#1a4731;}`}</style>

      {/* HERO */}
      <div style={{ background:'linear-gradient(150deg,#071812,#0d2b1a 50%,#1a4731)', padding:'120px 24px 80px', textAlign:'center' }}>
        <span style={{ fontFamily:'Lato,sans-serif', fontSize:10, fontWeight:700, letterSpacing:'.24em', color:'#c9a84c', display:'block', marginBottom:12 }}>MOKONE YPD CONFERENCE</span>
        <h1 style={{ fontFamily:'Georgia,serif', fontSize:'clamp(2.4rem,5vw,4rem)', fontWeight:700, color:'#fff', lineHeight:1.1, marginBottom:16 }}>Moments of Worship</h1>
        <p style={{ fontFamily:'Lato,sans-serif', fontSize:15, color:'rgba(255,255,255,.6)', maxWidth:540, margin:'0 auto', lineHeight:1.8 }}>
          Explore our vibrant photo gallery, inspiring videos and faithful audio content highlighting special church events, community gatherings and worship services.
        </p>
      </div>

      {/* MASONRY PHOTO HIGHLIGHT (Wix style — big grid) */}
      <section style={{ background:'#0d2b1a', padding:'0' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gridTemplateRows:'200px 200px', gap:3 }}>
          {photos.slice(0,6).map((m,i) => (
            <div key={m.id} onClick={()=>setLightbox(m)} className="media-card" style={{ borderRadius:0, background:m.gradient, gridColumn: i===0?'span 2':i===3?'span 2':'span 1', display:'flex', alignItems:'flex-end', padding:16 }}>
              <span style={{ fontFamily:'Georgia,serif', fontSize:13, color:'rgba(255,255,255,.6)', fontStyle:'italic' }}>{m.title}</span>
            </div>
          ))}
        </div>
      </section>

      {/* TABS */}
      <div style={{ background:'#fff', borderBottom:'1px solid rgba(0,0,0,.08)', position:'sticky', top:64, zIndex:10 }}>
        <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 24px', display:'flex', gap:0 }}>
          {[['PHOTOS','🖼️ Moments of Worship'],['VIDEOS','🎬 Inspiring Faith Content'],['AUDIO','🎵 Faithful Soundtrack']].map(([t,l]) => (
            <button key={t} className={`tab-btn${activeTab===t?' active':''}`} onClick={()=>setActiveTab(t)}>{l}</button>
          ))}
        </div>
      </div>

      {/* CONTENT GRID */}
      <section style={{ background:'#f7f9f7', padding:'60px 24px 80px' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <div style={{ marginBottom:32 }}>
            <h2 style={{ fontFamily:'Georgia,serif', fontSize:'clamp(1.6rem,3vw,2.2rem)', fontWeight:700, color:'#0d2b1a', marginBottom:10 }}>
              {activeTab==='PHOTOS'?'Moments of Worship':activeTab==='VIDEOS'?'Inspiring Faith Content':'Faithful Soundtrack'}
            </h2>
            <p style={{ fontSize:14, color:'#6b8070', lineHeight:1.7, maxWidth:540 }}>
              {activeTab==='PHOTOS'?'Experience the heart of Mokone YPD through these cherished moments.':activeTab==='VIDEOS'?'Dive into our video library featuring sermons, testimonials and educational content.':'Listen to uplifting audio sermons, prayers and gospel music.'}
            </p>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:20 }}>
            {current.map(item => (
              <div key={item.id} className="media-card" onClick={()=>setLightbox(item)} style={{ background:item.gradient, aspectRatio:'4/3', position:'relative', display:'flex', flexDirection:'column', justifyContent:'space-between', padding:18 }}>
                {/* Play button for video/audio */}
                {item.type!=='IMAGE' && (
                  <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <div style={{ width:56, height:56, borderRadius:'50%', background:'rgba(201,168,76,.25)', border:'2px solid rgba(201,168,76,.6)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><polygon points="10 8 16 12 10 16 10 8"/></svg>
                    </div>
                  </div>
                )}
                <div style={{ alignSelf:'flex-start', background:'rgba(0,0,0,.35)', padding:'4px 10px', borderRadius:3, fontSize:10, fontWeight:700, letterSpacing:'.1em', color:'rgba(255,255,255,.85)' }}>
                  {item.category}
                </div>
                <div>
                  <p style={{ fontFamily:'Georgia,serif', fontSize:14, color:'rgba(255,255,255,.85)', fontStyle:'italic', marginBottom:4 }}>{item.title}</p>
                  <p style={{ fontSize:10, color:'rgba(255,255,255,.45)', letterSpacing:'.1em', fontWeight:700 }}>{item.type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LIGHTBOX */}
      {lightbox && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.85)', zIndex:300, display:'flex', alignItems:'center', justifyContent:'center', padding:24 }} onClick={()=>setLightbox(null)}>
          <div style={{ background:'#fff', borderRadius:14, maxWidth:700, width:'100%', overflow:'hidden' }} onClick={e=>e.stopPropagation()}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'16px 20px', borderBottom:'1px solid rgba(0,0,0,.07)' }}>
              <h3 style={{ fontFamily:'Georgia,serif', fontSize:19, color:'#0d2b1a' }}>{lightbox.title}</h3>
              <button onClick={()=>setLightbox(null)} style={{ background:'none', border:'none', fontSize:22, cursor:'pointer', color:'#6b8070' }}>✕</button>
            </div>
            <div style={{ background:lightbox.gradient, height:320, display:'flex', alignItems:'center', justifyContent:'center' }}>
              {lightbox.ytId ? (
                <iframe src={`https://www.youtube.com/embed/${lightbox.ytId}?autoplay=1`} style={{ width:'100%', height:'100%', border:'none' }} allowFullScreen title={lightbox.title} />
              ) : (
                <span style={{ fontFamily:'Georgia,serif', fontSize:80, color:'rgba(255,255,255,.15)', fontStyle:'italic' }}>
                  {lightbox.type==='AUDIO'?'♪':'🖼'}
                </span>
              )}
            </div>
            {lightbox.type==='AUDIO' && (
              <div style={{ padding:'20px 24px', background:'#f7f9f7' }}>
                <audio controls style={{ width:'100%' }}><source src="#" type="audio/mp3" /></audio>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaPage;