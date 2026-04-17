import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import authService from '../services/authService';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email:'', password:'' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    // integrate with authService.login here
    setTimeout(() => { setLoading(false); setError('Invalid email or password. Please try again.'); }, 1000);
  };

  return (
    <div style={{ fontFamily:"'Lato',sans-serif", minHeight:'100vh', background:'linear-gradient(150deg,#071812,#0d2b1a 60%,#1a4731)', display:'flex', alignItems:'center', justifyContent:'center', padding:'24px', paddingTop:88 }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Lato:wght@300;400;700&display=swap');`}</style>
      <div style={{ width:'100%', maxWidth:440 }}>
        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:36 }}>
          <div style={{ display:'flex', justifyContent:'center', marginBottom:18 }}>
            <div style={{ position:'relative' }}>
              <div style={{ position:'absolute', inset:-8, borderRadius:'50%', border:'1px solid rgba(201,168,76,.3)' }} />
              <svg width="72" height="72" viewBox="0 0 72 72" fill="none"><circle cx="36" cy="36" r="34" fill="#0d2b1a" stroke="#c9a84c" strokeWidth="2"/><circle cx="36" cy="36" r="27" fill="none" stroke="#c9a84c" strokeWidth=".7" strokeDasharray="2 3"/><text x="36" y="42" textAnchor="middle" fill="#c9a84c" fontSize="15" fontWeight="700" fontFamily="Georgia,serif" letterSpacing="1.5">YPD</text></svg>
            </div>
          </div>
          <h1 style={{ fontFamily:'Georgia,serif', fontSize:28, fontWeight:700, color:'#fff', marginBottom:8 }}>Welcome Back</h1>
          <p style={{ fontSize:14, color:'rgba(255,255,255,.5)' }}>Sign in to your Mokone YPD account</p>
        </div>

        {/* Card */}
        <div style={{ background:'#fff', borderRadius:14, padding:'36px 32px', boxShadow:'0 24px 60px rgba(0,0,0,.3)' }}>
          {error && (
            <div style={{ background:'rgba(192,57,43,.08)', border:'1px solid rgba(192,57,43,.3)', color:'#c0392b', padding:'12px 16px', borderRadius:6, fontSize:13, marginBottom:20 }}>
              ❌ {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            {[['email','Email Address *','john@example.com','email'],['password','Password *','••••••••','password']].map(([k,l,ph,t]) => (
              <div key={k} style={{ marginBottom:18 }}>
                <label style={{ display:'block', fontSize:11, fontWeight:700, letterSpacing:'.12em', color:'#3d5247', marginBottom:8 }}>{l}</label>
                <input type={t} required placeholder={ph} value={formData[k]} onChange={e=>setFormData({...formData,[k]:e.target.value})}
                  style={{ width:'100%', padding:'13px 16px', border:'1.5px solid rgba(26,71,49,.2)', borderRadius:8, fontSize:14, outline:'none', fontFamily:"'Lato',sans-serif", boxSizing:'border-box', transition:'border-color .2s' }}
                  onFocus={e=>e.target.style.borderColor='#1a4731'} onBlur={e=>e.target.style.borderColor='rgba(26,71,49,.2)'} />
              </div>
            ))}
            <div style={{ textAlign:'right', marginBottom:24 }}>
              <a href="/forgot-password" style={{ fontSize:13, color:'#1a4731', textDecoration:'none', fontWeight:600 }}>Forgot your password?</a>
            </div>
            <button type="submit" disabled={loading}
              style={{ width:'100%', background:'#1a4731', color:'#fff', border:'none', padding:'15px', borderRadius:8, fontFamily:'Lato,sans-serif', fontSize:14, fontWeight:700, cursor:'pointer', letterSpacing:'.06em', transition:'background .2s', opacity:loading?.7:1 }}
              onMouseEnter={e=>!loading&&(e.target.style.background='#0d2b1a')} onMouseLeave={e=>e.target.style.background='#1a4731'}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
          <div style={{ textAlign:'center', marginTop:24, borderTop:'1px solid rgba(0,0,0,.07)', paddingTop:20 }}>
            <p style={{ fontSize:14, color:'#6b8070' }}>
              Don't have an account?{' '}
              <a href="/register" style={{ color:'#1a4731', fontWeight:700, textDecoration:'none' }}>Register here</a>
            </p>
          </div>
        </div>
        <div style={{ textAlign:'center', marginTop:20 }}>
          <a href="/" style={{ fontSize:13, color:'rgba(255,255,255,.35)', textDecoration:'none' }}>Continue as Guest →</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;