import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ContactForm from '../components/contact/ContactForm';
import prayerService from '../services/prayerService';

const ContactPage = () => {
  const [formData, setFormData] = useState({ firstName:'', lastName:'', email:'', phone:'', message:'' });
  const [sent, setSent] = useState(false);
  const [prayerText, setPrayerText] = useState('');
  const [prayerForm, setPrayerForm] = useState({ text: '', name: '', email: '' });
  const [prayerSent, setPrayerSent] = useState(false);
  const [prayerLoading, setPrayerLoading] = useState(false);
  const [prayerError, setPrayerError] = useState(null);

  // Add this function alongside handlePrayerSubmit (before the schedules array):
  const handleSubmit = e => {
    e.preventDefault();
    if (formData.email && formData.message) setSent(true);
  };

  const handlePrayerSubmit = async () => {
    if (!prayerForm.text.trim()) return;
    setPrayerLoading(true);
    setPrayerError(null);
    try {
      await prayerService.submit({
        requestText:    prayerForm.text,
        submitterName:  prayerForm.name  || null,
        submitterEmail: prayerForm.email || null,
        isAnonymous:    !prayerForm.name,          // anonymous if no name given
        category:       'GENERAL',
      });
      setPrayerSent(true);
    } catch (err) {
      setPrayerError('Could not submit your request. Please try again.');
    } finally {
      setPrayerLoading(false);
    }
  };

  const schedules = [
    { day: 'Monday - Friday', hours: '08:00 - 17:00' },
    { day: 'Saturday', hours: '09:00 - 13:00' },
    { day: 'Sunday', hours: 'Church Services Only' },
  ];

  return (
    <div style={{ fontFamily:"'Lato',sans-serif", paddingTop:64 }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Lato:wght@300;400;700&display=swap');`}</style>

      {/* HERO */}
      <div style={{ background:'linear-gradient(150deg,#071812,#0d2b1a 50%,#1a4731)', padding:'120px 24px 80px', textAlign:'center' }}>
        <span style={{ fontFamily:'Lato,sans-serif', fontSize:10, fontWeight:700, letterSpacing:'.24em', color:'#c9a84c', display:'block', marginBottom:12 }}>REACH US ANYTIME</span>
        <h1 style={{ fontFamily:'Georgia,serif', fontSize:'clamp(2.4rem,5vw,4rem)', fontWeight:700, color:'#fff', lineHeight:1.1, marginBottom:16 }}>Get in Touch</h1>
        <p style={{ fontFamily:'Lato,sans-serif', fontSize:15, color:'rgba(255,255,255,.6)', maxWidth:480, margin:'0 auto', lineHeight:1.8 }}>
          Connect with Mokone YPD Conference. We value your feedback and questions.
        </p>
        <div style={{ display:'flex', gap:20, justifyContent:'center', marginTop:32, flexWrap:'wrap' }}>
          <a href="mailto:info@mokonypd.org" style={{ display:'flex', alignItems:'center', gap:8, color:'#c9a84c', textDecoration:'none', fontFamily:'Lato,sans-serif', fontSize:14, border:'1px solid rgba(201,168,76,.3)', padding:'10px 20px', borderRadius:6 }}>📧 Email</a>
          <a href="tel:+27123456789" style={{ display:'flex', alignItems:'center', gap:8, color:'#c9a84c', textDecoration:'none', fontFamily:'Lato,sans-serif', fontSize:14, border:'1px solid rgba(201,168,76,.3)', padding:'10px 20px', borderRadius:6 }}>📞 Phone</a>
        </div>
      </div>

      {/* MAIN CONTACT SECTION */}
      <section style={{ background:'#f7f9f7', padding:'80px 24px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(320px,1fr))', gap:48 }}>
          {/* Info */}
          <div>
            <div style={{ background:'#1a4731', borderRadius:12, padding:'36px 32px', marginBottom:24 }}>
              <h3 style={{ fontFamily:'Georgia,serif', fontSize:22, color:'#c9a84c', marginBottom:24 }}>Contact Information</h3>
              {[['📍','Address','123 Church Street, Pretoria, South Africa'],['📞','Phone','+27 12 345 6789'],['📧','Email','info@mokonypd.org']].map(([icon,label,val]) => (
                <div key={label} style={{ display:'flex', gap:14, marginBottom:20, alignItems:'flex-start' }}>
                  <div style={{ width:40, height:40, background:'rgba(201,168,76,.15)', borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 }}>{icon}</div>
                  <div>
                    <div style={{ fontSize:10, fontWeight:700, letterSpacing:'.14em', color:'#c9a84c', marginBottom:3 }}>{label}</div>
                    <div style={{ fontSize:13, color:'rgba(255,255,255,.75)', lineHeight:1.5 }}>{val}</div>
                  </div>
                </div>
              ))}
              {/* Social */}
              <div style={{ borderTop:'1px solid rgba(255,255,255,.1)', paddingTop:20, marginTop:8 }}>
                <div style={{ fontSize:10, fontWeight:700, letterSpacing:'.15em', color:'#c9a84c', marginBottom:12 }}>FOLLOW US</div>
                <div style={{ display:'flex', gap:10 }}>
                  {['Facebook','Instagram','YouTube'].map(s => (
                    <a key={s} href="#" style={{ padding:'7px 12px', border:'1px solid rgba(201,168,76,.25)', borderRadius:4, color:'rgba(255,255,255,.55)', textDecoration:'none', fontSize:11, fontFamily:'Lato,sans-serif', transition:'all .2s' }}
                      onMouseEnter={e=>{ e.target.style.borderColor='#c9a84c'; e.target.style.color='#c9a84c'; }}
                      onMouseLeave={e=>{ e.target.style.borderColor='rgba(201,168,76,.25)'; e.target.style.color='rgba(255,255,255,.55)'; }}>{s}</a>
                  ))}
                </div>
              </div>
            </div>

            {/* Office Hours */}
            <div style={{ background:'#fff', borderRadius:12, padding:'28px 28px', border:'1px solid rgba(0,0,0,.07)' }}>
              <h4 style={{ fontFamily:'Georgia,serif', fontSize:18, color:'#0d2b1a', marginBottom:18 }}>Office Hours</h4>
              {schedules.map(s => (
                <div key={s.day} style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid rgba(0,0,0,.06)' }}>
                  <span style={{ fontSize:13, color:'#3d5247', fontWeight:500 }}>{s.day}</span>
                  <span style={{ fontSize:13, color:'#1a4731', fontWeight:700 }}>{s.hours}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div style={{ background:'#fff', borderRadius:12, padding:'36px 32px', border:'1px solid rgba(0,0,0,.07)' }}>
            {sent ? (
              <div style={{ textAlign:'center', padding:'48px 0' }}>
                <div style={{ width:64, height:64, borderRadius:'50%', background:'rgba(26,71,49,.1)', border:'2px solid #1a4731', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', fontSize:26, color:'#1a4731' }}>✓</div>
                <h3 style={{ fontFamily:'Georgia,serif', fontSize:22, color:'#1a4731', marginBottom:10 }}>Message Sent!</h3>
                <p style={{ color:'#6b8070', fontSize:14 }}>We'll respond promptly. God bless you!</p>
                <button onClick={()=>{ setSent(false); setFormData({ firstName:'', lastName:'', email:'', phone:'', message:'' }); }}
                  style={{ marginTop:20, background:'#c9a84c', color:'#0d2b1a', border:'none', padding:'12px 28px', borderRadius:6, fontFamily:'Lato,sans-serif', fontSize:13, fontWeight:700, cursor:'pointer' }}>
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3 style={{ fontFamily:'Georgia,serif', fontSize:22, color:'#0d2b1a', marginBottom:24 }}>Contact Us</h3>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
                  {[['firstName','First name','Thendo'],['lastName','Last name','Ramurafhi']].map(([k,l,ph]) => (
                    <div key={k}>
                      <label style={{ display:'block', fontSize:11, fontWeight:700, letterSpacing:'.12em', color:'#3d5247', marginBottom:7 }}>{l.toUpperCase()}</label>
                      <input placeholder={ph} value={formData[k]} onChange={e=>setFormData({...formData,[k]:e.target.value})}
                        style={{ width:'100%', padding:'12px 14px', border:'1.5px solid rgba(26,71,49,.2)', borderRadius:6, fontSize:14, outline:'none', fontFamily:"'Lato',sans-serif", boxSizing:'border-box' }} />
                    </div>
                  ))}
                </div>
                {[['email','Email *','thendo@example.com','email'],['phone','Phone','+ 27 12 345 6789','tel']].map(([k,l,ph,t]) => (
                  <div key={k} style={{ marginBottom:14 }}>
                    <label style={{ display:'block', fontSize:11, fontWeight:700, letterSpacing:'.12em', color:'#3d5247', marginBottom:7 }}>{l.toUpperCase()}</label>
                    <input type={t} required={k==='email'} placeholder={ph} value={formData[k]} onChange={e=>setFormData({...formData,[k]:e.target.value})}
                      style={{ width:'100%', padding:'12px 14px', border:'1.5px solid rgba(26,71,49,.2)', borderRadius:6, fontSize:14, outline:'none', fontFamily:"'Lato',sans-serif", boxSizing:'border-box' }} />
                  </div>
                ))}
                <div style={{ marginBottom:22 }}>
                  <label style={{ display:'block', fontSize:11, fontWeight:700, letterSpacing:'.12em', color:'#3d5247', marginBottom:7 }}>MESSAGE *</label>
                  <textarea required rows={4} placeholder="Write your message here..." value={formData.message} onChange={e=>setFormData({...formData,message:e.target.value})}
                    style={{ width:'100%', padding:'12px 14px', border:'1.5px solid rgba(26,71,49,.2)', borderRadius:6, fontSize:14, outline:'none', resize:'vertical', fontFamily:"'Lato',sans-serif", boxSizing:'border-box' }} />
                </div>
                <button type="submit"
                  style={{ width:'100%', background:'#1a4731', color:'#fff', border:'none', padding:'15px', borderRadius:6, fontFamily:'Lato,sans-serif', fontSize:13, fontWeight:700, cursor:'pointer', letterSpacing:'.08em', transition:'background .2s', marginBottom:12 }}
                  onMouseEnter={e=>e.target.style.background='#0d2b1a'} onMouseLeave={e=>e.target.style.background='#1a4731'}>
                  Submit
                </button>
                <p style={{ fontSize:11, color:'#aaa', textAlign:'center' }}>Or drop us a note: <a href="mailto:info@mokonypd.org" style={{ color:'#1a4731', textDecoration:'none' }}>info@mokonypd.org</a></p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* OUR LOCATION */}
      <section style={{ background:'#fff', padding:'80px 24px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:48, alignItems:'center' }}>
          <div>
            <span style={{ fontFamily:'Lato,sans-serif', fontSize:10, fontWeight:700, letterSpacing:'.22em', color:'#c9a84c', display:'block', marginBottom:12 }}>OUR LOCATION</span>
            <h2 style={{ fontFamily:'Georgia,serif', fontSize:'clamp(1.6rem,3vw,2.2rem)', fontWeight:700, color:'#0d2b1a', marginBottom:16 }}>Find Us</h2>
            <p style={{ fontSize:15, color:'#6b8070', lineHeight:1.8, marginBottom:28 }}>
              Find us at our conference location in South Africa. We look forward to welcoming you!
            </p>
            <div style={{ display:'flex', gap:14 }}>
              <div style={{ flex:1, background:'#f7f9f7', borderRadius:8, padding:'18px', border:'1px solid rgba(26,71,49,.1)' }}>
                <div style={{ fontSize:10, fontWeight:700, letterSpacing:'.14em', color:'#c9a84c', marginBottom:6 }}>VIEW</div>
                <p style={{ fontSize:13, color:'#3d5247' }}>Mokone YPD Conference Center</p>
              </div>
              <div style={{ flex:1, background:'#f7f9f7', borderRadius:8, padding:'18px', border:'1px solid rgba(26,71,49,.1)' }}>
                <div style={{ fontSize:10, fontWeight:700, letterSpacing:'.14em', color:'#c9a84c', marginBottom:6 }}>MAP</div>
                <p style={{ fontSize:13, color:'#3d5247' }}>We look forward to welcoming you!</p>
              </div>
            </div>
          </div>
          {/* Map placeholder */}
          <div style={{ background:'linear-gradient(135deg,#e8f4f0,#d4e8dc)', borderRadius:12, height:300, display:'flex', alignItems:'center', justifyContent:'center', border:'1px solid rgba(26,71,49,.15)', position:'relative', overflow:'hidden' }}>
            {[...Array(5)].map((_,i) => (
              <div key={i} style={{ position:'absolute', width:10, height:10, borderRadius:'50%', background:'rgba(26,71,49,.5)', top:`${20+i*15}%`, left:`${15+i*17}%`, boxShadow:'0 0 0 5px rgba(26,71,49,.1)' }} />
            ))}
            <div style={{ textAlign:'center', color:'#6b8070' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <p style={{ marginTop:8, fontSize:12, fontFamily:'Georgia,serif', fontStyle:'italic' }}>Connect your Google Maps API key</p>
            </div>
          </div>
        </div>
      </section>

      {/* PRAYER REQUEST */}
      <section style={{ background:'#0d2b1a', padding:'80px 24px' }}>
        <div style={{ maxWidth:700, margin:'0 auto', textAlign:'center' }}>
          <span style={{ fontFamily:'Lato,sans-serif', fontSize:10, fontWeight:700, letterSpacing:'.22em', color:'#c9a84c', display:'block', marginBottom:14 }}>DROP US A NOTE</span>
          <h2 style={{ fontFamily:'Georgia,serif', fontSize:'clamp(1.8rem,3vw,2.6rem)', fontWeight:700, color:'#fff', marginBottom:14 }}>Submit a Prayer Request</h2>
          <p style={{ fontFamily:'Lato,sans-serif', fontSize:15, color:'rgba(255,255,255,.55)', lineHeight:1.8, marginBottom:36 }}>
            We believe in the power of prayer. Share your request and our community will lift you up.
          </p>
          {prayerSent ? (
            <div style={{ background:'rgba(201,168,76,.15)', border:'1px solid rgba(201,168,76,.4)', borderRadius:10, padding:'24px', color:'#c9a84c', fontFamily:'Georgia,serif', fontSize:16 }}>
              ✦ Your prayer request has been received. We're praying for you!
            </div>
          ) : (
            <div style={{ background:'rgba(255,255,255,.06)', border:'1px solid rgba(255,255,255,.12)', borderRadius:12, padding:'32px' }}>
              <textarea
                rows={4}
                placeholder="Share your prayer request here..."
                value={prayerForm.text}
                onChange={e => setPrayerForm({ ...prayerForm, text: e.target.value })}
                style={{ width:'100%', padding:'14px', background:'rgba(255,255,255,.08)', border:'1px solid rgba(255,255,255,.15)', borderRadius:6, color:'#fff', fontSize:14, outline:'none', resize:'vertical', fontFamily:"'Lato',sans-serif", boxSizing:'border-box', marginBottom:16 }}
              />
              <input
                placeholder="Your Name (leave blank to stay anonymous)"
                value={prayerForm.name}
                onChange={e => setPrayerForm({ ...prayerForm, name: e.target.value })}
                style={{ width:'100%', padding:'12px 14px', background:'rgba(255,255,255,.08)', border:'1px solid rgba(255,255,255,.15)', borderRadius:6, color:'#fff', fontSize:14, outline:'none', fontFamily:"'Lato',sans-serif", boxSizing:'border-box', marginBottom:10 }}
              />
              <input
                type="email"
                placeholder="Email (optional — for confirmation)"
                value={prayerForm.email}
                onChange={e => setPrayerForm({ ...prayerForm, email: e.target.value })}
                style={{ width:'100%', padding:'12px 14px', background:'rgba(255,255,255,.08)', border:'1px solid rgba(255,255,255,.15)', borderRadius:6, color:'#fff', fontSize:14, outline:'none', fontFamily:"'Lato',sans-serif", boxSizing:'border-box', marginBottom:14 }}
              />
              {prayerError && (
                <p style={{ color:'#f88', fontSize:13, marginBottom:10 }}>{prayerError}</p>
              )}
              <button
                onClick={handlePrayerSubmit}
                disabled={prayerLoading}
                style={{ width:'100%', background: prayerLoading ? '#888' : '#c9a84c', color:'#0d2b1a', border:'none', padding:'14px', borderRadius:6, fontFamily:'Lato,sans-serif', fontSize:13, fontWeight:700, cursor: prayerLoading ? 'not-allowed' : 'pointer', letterSpacing:'.08em' }}>
                {prayerLoading ? 'Sending...' : 'Send Prayer Request'}
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ContactPage;