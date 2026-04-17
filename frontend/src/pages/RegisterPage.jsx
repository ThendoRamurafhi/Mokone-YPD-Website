import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import authService from '../services/authService';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ firstName:'', lastName:'', username:'', email:'', phone:'', password:'', confirmPassword:'' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async e => {
    e.preventDefault();
    if(formData.password !== formData.confirmPassword) { setError('Passwords do not match.'); return; }
    setLoading(true); setError(null);
    setTimeout(() => setLoading(false), 1000);
  };

  const field = (k, l, ph, t='text', req=false) => (
    <div key={k} style={{ marginBottom:16 }}>
      <label style={{ display:'block', fontSize:11, fontWeight:700, letterSpacing:'.12em', color:'#3d5247', marginBottom:8 }}>{l}</label>
      <input type={t} required={req} placeholder={ph} value={formData[k]} onChange={e=>setFormData({...formData,[k]:e.target.value})}
        style={{ width:'100%', padding:'13px 16px', border:'1.5px solid rgba(26,71,49,.2)', borderRadius:8, fontSize:14, outline:'none', fontFamily:"'Lato',sans-serif", boxSizing:'border-box', transition:'border-color .2s' }}
        onFocus={e=>e.target.style.borderColor='#1a4731'} onBlur={e=>e.target.style.borderColor='rgba(26,71,49,.2)'} />
    </div>
  );

  return (
    <div style={{ fontFamily:"'Lato',sans-serif", minHeight:'100vh', background:'linear-gradient(150deg,#071812,#0d2b1a 60%,#1a4731)', display:'flex', alignItems:'center', justifyContent:'center', padding:'24px', paddingTop:88 }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Lato:wght@300;400;700&display=swap');`}</style>
      <div style={{ width:'100%', maxWidth:480 }}>
        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:36 }}>
          <div style={{ display:'flex', justifyContent:'center', marginBottom:18 }}>
            <svg width="72" height="72" viewBox="0 0 72 72" fill="none"><circle cx="36" cy="36" r="34" fill="#0d2b1a" stroke="#c9a84c" strokeWidth="2"/><circle cx="36" cy="36" r="27" fill="none" stroke="#c9a84c" strokeWidth=".7" strokeDasharray="2 3"/><text x="36" y="42" textAnchor="middle" fill="#c9a84c" fontSize="15" fontWeight="700" fontFamily="Georgia,serif" letterSpacing="1.5">YPD</text></svg>
          </div>
          <h1 style={{ fontFamily:'Georgia,serif', fontSize:28, fontWeight:700, color:'#fff', marginBottom:8 }}>Join Our Community</h1>
          <p style={{ fontSize:14, color:'rgba(255,255,255,.5)' }}>Create your Mokone YPD account</p>
        </div>

        <div style={{ background:'#fff', borderRadius:14, padding:'36px 32px', boxShadow:'0 24px 60px rgba(0,0,0,.3)' }}>
          {error && (
            <div style={{ background:'rgba(192,57,43,.08)', border:'1px solid rgba(192,57,43,.3)', color:'#c0392b', padding:'12px 16px', borderRadius:6, fontSize:13, marginBottom:20 }}>
              ❌ {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            {/* Name row */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:0 }}>
              {field('firstName','First Name *','John','text',true)}
              {field('lastName','Last Name *','Doe','text',true)}
            </div>
            {field('username','Username *','johndoe123','text',true)}
            {field('email','Email Address *','john@example.com','email',true)}
            {field('phone','Phone Number','+ 27 12 345 6789','tel',false)}
            {field('password','Password *','••••••••','password',true)}
            {field('confirmPassword','Confirm Password *','••••••••','password',true)}

            <button type="submit" disabled={loading}
              style={{ width:'100%', background:'#1a4731', color:'#fff', border:'none', padding:'15px', borderRadius:8, fontFamily:'Lato,sans-serif', fontSize:14, fontWeight:700, cursor:'pointer', letterSpacing:'.06em', transition:'background .2s', marginTop:8, opacity:loading?.7:1 }}
              onMouseEnter={e=>!loading&&(e.target.style.background='#0d2b1a')} onMouseLeave={e=>e.target.style.background='#1a4731'}>
              {loading ? 'Creating Account…' : 'Create Account'}
            </button>
          </form>
          <div style={{ textAlign:'center', marginTop:20, borderTop:'1px solid rgba(0,0,0,.07)', paddingTop:18 }}>
            <p style={{ fontSize:14, color:'#6b8070' }}>
              Already have an account?{' '}
              <a href="/login" style={{ color:'#1a4731', fontWeight:700, textDecoration:'none' }}>Sign in here</a>
            </p>
          </div>
        </div>
        <div style={{ textAlign:'center', marginTop:18 }}>
          <a href="/" style={{ fontSize:13, color:'rgba(255,255,255,.35)', textDecoration:'none' }}>Continue as Guest →</a>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;