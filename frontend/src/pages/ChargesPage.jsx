import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ChargesPage = () => {
  const charges = [
    { chargeId:1, chargeName:'Bethel AME Church',     area:'Pretoria North', city:'Pretoria',     pastor:'Rev. John Doe',     memberCount:250, phone:'+27 12 345 6789', email:'bethel@amechurch.co.za',     serviceTime:'Sun 10:00', status:'ACTIVE' },
    { chargeId:2, chargeName:'Emmanuel AME Church',   area:'Johannesburg',   city:'Johannesburg', pastor:'Pastor Jane Smith',  memberCount:180, phone:'+27 11 234 5678', email:'emmanuel@amechurch.co.za',   serviceTime:'Sun 09:00', status:'ACTIVE' },
    { chargeId:3, chargeName:'Grace AME Church',      area:'Cape Town',      city:'Cape Town',    pastor:'Rev. Michael Brown', memberCount:320, phone:'+27 21 345 6789', email:'grace@amechurch.co.za',       serviceTime:'Sun 10:30', status:'ACTIVE' },
    { chargeId:4, chargeName:'Trinity AME Church',    area:'Durban',         city:'Durban',       pastor:'Pastor Sarah Johnson',memberCount:210, phone:'+27 31 456 7890', email:'trinity@amechurch.co.za',     serviceTime:'Sun 10:00', status:'ACTIVE' },
    { chargeId:5, chargeName:'Zion AME Church',       area:'Pretoria South', city:'Pretoria',     pastor:'Rev. David Wilson',  memberCount:150, phone:'+27 12 456 7890', email:'zion@amechurch.co.za',        serviceTime:'Sun 08:00', status:'ACTIVE' },
    { chargeId:6, chargeName:'Mount Olive AME Church',area:'Johannesburg',   city:'Johannesburg', pastor:'Pastor Mary Thompson',memberCount:290, phone:'+27 11 567 8901', email:'mountolive@amechurch.co.za',  serviceTime:'Sun 11:00', status:'ACTIVE' },
    { chargeId:7, chargeName:'Calvary AME Church',    area:'Polokwane',      city:'Polokwane',    pastor:'Rev. Samuel Mashego',memberCount:140, phone:'+27 15 234 5678', email:'calvary@amechurch.co.za',     serviceTime:'Sun 09:30', status:'ACTIVE' },
    { chargeId:8, chargeName:'Hope AME Church',       area:'Nelspruit',      city:'Nelspruit',    pastor:'Pastor Faith Dlamini',memberCount:195, phone:'+27 13 345 6789', email:'hope@amechurch.co.za',        serviceTime:'Sun 10:00', status:'ACTIVE' },
    { chargeId:9, chargeName:'New Life AME Church',   area:'Cape Town',      city:'Cape Town',    pastor:'Rev. Peter Botha',  memberCount:170, phone:'+27 21 456 7890', email:'newlife@amechurch.co.za',      serviceTime:'Sun 09:00', status:'ACTIVE' },
  ];

  const areas = ['ALL', 'Pretoria North', 'Pretoria South', 'Johannesburg', 'Cape Town', 'Durban', 'Polokwane', 'Nelspruit'];
  const serviceTypes = ['ALL', 'Sunday Morning', 'Sunday Evening', 'Midweek'];

  const [selectedArea, setSelectedArea] = useState('ALL');
  const [searchTerm, setSearchTerm]   = useState('');
  const [selectedService, setSelectedService] = useState('ALL');
  const [savedSearch, setSavedSearch] = useState(false);
  const [selected, setSelected]       = useState(null);

  const filtered = charges.filter(c => {
    const matchArea    = selectedArea === 'ALL' || c.area === selectedArea;
    const matchSearch  = !searchTerm || c.chargeName.toLowerCase().includes(searchTerm.toLowerCase()) || c.city.toLowerCase().includes(searchTerm.toLowerCase()) || c.pastor.toLowerCase().includes(searchTerm.toLowerCase());
    return matchArea && matchSearch;
  });

  return (
    <div style={{ fontFamily:"'Lato',sans-serif", paddingTop:64 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Lato:wght@300;400;700&display=swap');
        .charge-card { background:#fff; border-radius:12px; border:1px solid rgba(0,0,0,.07); overflow:hidden; transition:all .3s; cursor:pointer; }
        .charge-card:hover { transform:translateY(-4px); box-shadow:0 16px 40px rgba(26,71,49,.13); }
        .filter-btn { padding:9px 18px; border-radius:20px; border:1px solid rgba(26,71,49,.2); background:#fff; font-family:'Lato',sans-serif; font-size:12px; cursor:pointer; transition:all .2s; color:#3d5247; }
        .filter-btn.active { background:#1a4731; color:#fff; border-color:#1a4731; }
        .filter-btn:hover:not(.active) { border-color:#1a4731; color:#1a4731; }
      `}</style>

      {/* ── HERO ── */}
      <div style={{ background:'linear-gradient(150deg,#071812,#0d2b1a 50%,#1a4731)', padding:'120px 24px 80px', textAlign:'center' }}>
        <span style={{ fontFamily:'Lato,sans-serif', fontSize:10, fontWeight:700, letterSpacing:'.24em', color:'#c9a84c', display:'block', marginBottom:12 }}>MOKONE YPD CONFERENCE</span>
        <h1 style={{ fontFamily:'Georgia,serif', fontSize:'clamp(2.4rem,5vw,4rem)', fontWeight:700, color:'#fff', lineHeight:1.1, marginBottom:16 }}>
          Find Your Church
        </h1>
        <p style={{ fontFamily:'Lato,sans-serif', fontSize:15, color:'rgba(255,255,255,.6)', lineHeight:1.8, maxWidth:500, margin:'0 auto 36px' }}>
          Use the filters below to quickly locate an AME congregation in your area.
        </p>
        {/* Stats */}
        <div style={{ display:'inline-flex', gap:0, background:'rgba(255,255,255,.06)', border:'1px solid rgba(201,168,76,.2)', borderRadius:10, padding:'4px' }}>
          {[['9','Churches'],['7','Areas'],['1755+','Members']].map(([v,l],i) => (
            <div key={i} style={{ padding:'14px 28px', borderRight: i<2 ? '1px solid rgba(201,168,76,.15)':'' }}>
              <div style={{ fontFamily:'Georgia,serif', fontSize:26, fontWeight:700, color:'#c9a84c', lineHeight:1 }}>{v}</div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,.45)', letterSpacing:'.1em', marginTop:3 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FILTER PANEL (Wix style) ── */}
      <div style={{ background:'#fff', borderBottom:'1px solid rgba(0,0,0,.08)', padding:'28px 24px', position:'sticky', top:64, zIndex:10 }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          {/* Search */}
          <div style={{ display:'flex', gap:12, flexWrap:'wrap', marginBottom:18, alignItems:'center' }}>
            <div style={{ position:'relative', flex:1, minWidth:220 }}>
              <svg style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b8070" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text" placeholder="Search by church name, city or pastor..."
                value={searchTerm} onChange={e=>setSearchTerm(e.target.value)}
                style={{ width:'100%', padding:'11px 14px 11px 38px', border:'1.5px solid rgba(26,71,49,.2)', borderRadius:8, fontSize:14, outline:'none', fontFamily:"'Lato',sans-serif", boxSizing:'border-box' }}
              />
            </div>
            <select value={selectedService} onChange={e=>setSelectedService(e.target.value)}
              style={{ padding:'11px 16px', border:'1.5px solid rgba(26,71,49,.2)', borderRadius:8, fontSize:14, color:'#3d5247', fontFamily:"'Lato',sans-serif", background:'#fff', cursor:'pointer' }}>
              <option value="ALL">Service Type: All</option>
              {serviceTypes.slice(1).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <button
              onClick={()=>setSavedSearch(true)}
              style={{ padding:'11px 22px', background:savedSearch?'#c9a84c':'transparent', border:'1.5px solid #c9a84c', borderRadius:8, color:savedSearch?'#0d2b1a':'#7d5b00', fontFamily:"'Lato',sans-serif", fontSize:13, fontWeight:700, cursor:'pointer', transition:'all .2s', whiteSpace:'nowrap' }}>
              {savedSearch ? '✓ Saved' : 'Save Search'}
            </button>
            <button onClick={()=>{ setSelectedArea('ALL'); setSearchTerm(''); setSelectedService('ALL'); }}
              style={{ padding:'11px 22px', background:'transparent', border:'1.5px solid rgba(0,0,0,.15)', borderRadius:8, color:'#6b8070', fontFamily:"'Lato',sans-serif", fontSize:13, cursor:'pointer' }}>
              Reset
            </button>
          </div>

          {/* Area filter pills */}
          <div style={{ display:'flex', flexWrap:'wrap', gap:8, alignItems:'center' }}>
            <span style={{ fontSize:11, fontWeight:700, letterSpacing:'.15em', color:'#6b8070', marginRight:4 }}>AREA:</span>
            {areas.map(a => (
              <button key={a} className={`filter-btn${selectedArea===a?' active':''}`} onClick={()=>setSelectedArea(a)}>
                {a}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── MAP PLACEHOLDER (Wix has "Church Map" section) ── */}
      <div style={{ background:'linear-gradient(135deg,#e8f4f0,#d4e8dc)', padding:'0 24px', overflow:'hidden' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', padding:'40px 0 0' }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:24, marginBottom:40 }}>
            <div>
              <h2 style={{ fontFamily:'Georgia,serif', fontSize:26, color:'#0d2b1a', marginBottom:10 }}>Church Map</h2>
              <p style={{ fontSize:14, color:'#6b8070', lineHeight:1.7 }}>Explore the map to discover nearby churches and their details.</p>
            </div>
            <div style={{ display:'flex', gap:20 }}>
              <div style={{ flex:1, background:'#fff', borderRadius:8, padding:'16px', border:'1px solid rgba(26,71,49,.12)' }}>
                <div style={{ fontSize:11, fontWeight:700, letterSpacing:'.12em', color:'#c9a84c', marginBottom:6 }}>VIEW</div>
                <p style={{ fontSize:12, color:'#6b8070' }}>Click on a church card for details</p>
              </div>
              <div style={{ flex:1, background:'#fff', borderRadius:8, padding:'16px', border:'1px solid rgba(26,71,49,.12)' }}>
                <div style={{ fontSize:11, fontWeight:700, letterSpacing:'.12em', color:'#c9a84c', marginBottom:6 }}>DIRECTIONS</div>
                <p style={{ fontSize:12, color:'#6b8070' }}>Get directions with a simple click</p>
              </div>
            </div>
          </div>
          {/* Stylised map placeholder */}
          <div style={{ background:'linear-gradient(135deg,#1a4731,#256040)', borderRadius:'12px 12px 0 0', height:220, display:'flex', alignItems:'center', justifyContent:'center', position:'relative', overflow:'hidden' }}>
            {[...Array(9)].map((_,i) => (
              <div key={i} style={{ position:'absolute', width:12, height:12, borderRadius:'50%', background:'rgba(201,168,76,.8)', top:`${20+(i*10)%60}%`, left:`${10+(i*11)%80}%`, boxShadow:'0 0 0 6px rgba(201,168,76,.2)' }} />
            ))}
            <div style={{ textAlign:'center', color:'rgba(255,255,255,.5)' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <p style={{ marginTop:8, fontSize:12, fontFamily:'Georgia,serif', fontStyle:'italic' }}>Interactive map — connect your Google Maps API key</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── CHURCH CARDS ── */}
      <section style={{ background:'#f7f9f7', padding:'60px 24px' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:32, flexWrap:'wrap', gap:12 }}>
            <div>
              <span style={{ fontSize:10, fontWeight:700, letterSpacing:'.22em', color:'#c9a84c', display:'block', marginBottom:8 }}>CHURCH DETAILS</span>
              <h2 style={{ fontFamily:'Georgia,serif', fontSize:'clamp(1.6rem,3vw,2.2rem)', fontWeight:700, color:'#0d2b1a' }}>
                {filtered.length} Church{filtered.length!==1?'es':''} Found
              </h2>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div style={{ textAlign:'center', padding:'80px 0' }}>
              <div style={{ fontSize:48, marginBottom:16, color:'#c9a84c' }}>⛪</div>
              <h3 style={{ fontFamily:'Georgia,serif', fontSize:22, color:'#0d2b1a', marginBottom:10 }}>No churches found</h3>
              <p style={{ color:'#6b8070', fontSize:14 }}>Try adjusting your filters to find a church near you.</p>
            </div>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:24 }}>
              {filtered.map(charge => (
                <div key={charge.chargeId} className="charge-card" onClick={()=>setSelected(selected?.chargeId===charge.chargeId?null:charge)}>
                  {/* Coloured header */}
                  <div style={{ background:'linear-gradient(135deg,#1a4731,#40916c)', padding:'22px 24px', position:'relative' }}>
                    <div style={{ position:'absolute', top:14, right:14, background:'rgba(201,168,76,.2)', border:'1px solid rgba(201,168,76,.4)', color:'#c9a84c', fontSize:10, fontWeight:700, letterSpacing:'.12em', padding:'4px 10px', borderRadius:3 }}>
                      {charge.area}
                    </div>
                    <div style={{ width:48, height:48, borderRadius:'50%', background:'rgba(255,255,255,.1)', border:'2px solid rgba(201,168,76,.4)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:12 }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="1.8" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
                    </div>
                    <h3 style={{ fontFamily:'Georgia,serif', fontSize:19, fontWeight:600, color:'#fff', lineHeight:1.25 }}>{charge.chargeName}</h3>
                    <p style={{ fontSize:12, color:'rgba(255,255,255,.55)', marginTop:4 }}>📍 {charge.city}</p>
                  </div>

                  {/* Details */}
                  <div style={{ padding:'20px 24px 24px' }}>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:16 }}>
                      {[['Pastor',charge.pastor],['Members',charge.memberCount+'+ members'],['Service',charge.serviceTime],['Status',charge.status]].map(([l,v]) => (
                        <div key={l}>
                          <div style={{ fontSize:10, fontWeight:700, letterSpacing:'.12em', color:'#c9a84c', marginBottom:3 }}>{l}</div>
                          <div style={{ fontSize:13, color:'#0d2b1a' }}>{v}</div>
                        </div>
                      ))}
                    </div>

                    {/* Expanded detail */}
                    {selected?.chargeId===charge.chargeId && (
                      <div style={{ borderTop:'1px solid rgba(0,0,0,.07)', paddingTop:14, marginBottom:14 }}>
                        {[['📞',charge.phone],['📧',charge.email]].map(([icon,val]) => (
                          <div key={val} style={{ display:'flex', gap:8, alignItems:'center', marginBottom:8 }}>
                            <span style={{ fontSize:14 }}>{icon}</span>
                            <span style={{ fontSize:13, color:'#3d5247' }}>{val}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div style={{ display:'flex', gap:10 }}>
                      <a href={`https://maps.google.com/?q=${charge.chargeName}+${charge.city}`} target="_blank" rel="noopener noreferrer"
                        style={{ flex:1, textAlign:'center', background:'#c9a84c', color:'#0d2b1a', padding:'10px', borderRadius:6, textDecoration:'none', fontSize:12, fontWeight:700, letterSpacing:'.06em', transition:'background .2s' }}
                        onMouseEnter={e=>e.currentTarget.style.background='#e0c060'} onMouseLeave={e=>e.currentTarget.style.background='#c9a84c'}
                        onClick={e=>e.stopPropagation()}>
                        Directions
                      </a>
                      <button
                        onClick={e=>{ e.stopPropagation(); setSelected(selected?.chargeId===charge.chargeId?null:charge); }}
                        style={{ flex:1, textAlign:'center', background:'transparent', border:'1.5px solid #1a4731', color:'#1a4731', padding:'10px', borderRadius:6, fontSize:12, fontWeight:700, letterSpacing:'.06em', cursor:'pointer', transition:'all .2s' }}
                        onMouseEnter={e=>{ e.currentTarget.style.background='#1a4731'; e.currentTarget.style.color='#fff'; }}
                        onMouseLeave={e=>{ e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#1a4731'; }}>
                        {selected?.chargeId===charge.chargeId ? 'Less Info' : 'View Details'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ChargesPage;
