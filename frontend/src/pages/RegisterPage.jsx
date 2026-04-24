import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import YPDLogo from '../components/common/YPDLogo';

const RegisterPage = () => {
  const [form,    setForm]    = useState({ firstName:'', lastName:'', username:'', email:'', phone:'', password:'', confirmPassword:'' });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const { register } = useAuth();
  const navigate     = useNavigate();

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return; }
    if (form.password.length < 8)              { setError('Password must be at least 8 characters.'); return; }
    setLoading(true);
    setError(null);
    try {
      await register({ username:form.username, email:form.email, password:form.password, firstName:form.firstName, lastName:form.lastName, phone:form.phone });
      navigate('/');
    } catch (err) {
      setError(typeof err === 'string' ? err : err?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const field = (key, label, ph, type='text') => (
    <div style={{ marginBottom:14 }}>
      <label style={{ display:'block', fontSize:11, fontWeight:700, letterSpacing:'.12em', color:'#3d5247', marginBottom:7 }}>{label}</label>
      <input type={type} required={key!=='phone'} value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})} placeholder={ph} className="li" />
    </div>
  );

  return (
    <div style={{ fontFamily:"'Lato',sans-serif", minHeight:'100vh', background:'linear-gradient(150deg,#071812,#0d2b1a 60%,#1a4731)', display:'flex', alignItems:'center', justifyContent:'center', padding:'24px', paddingTop:88 }}>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Lato:wght@300;400;700&display=swap');
      .li { width:100%; padding:13px 16px; border:1.5px solid rgba(26,71,49,0.2); border-radius:8px; font-size:14px; outline:none; font-family:'Lato',sans-serif; box-sizing:border-box; transition:border-color .2s; }
      .li:focus { border-color:#1a4731; }
    `}</style>
      <div style={{ width:'100%', maxWidth:480 }}>
        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:36 }}>
                  <div style={{ display:'flex', justifyContent:'center', marginBottom:14 }}>
                    <YPDLogo width={80} height={80} />
                  </div>
                  <h1 style={{ fontFamily:'Georgia,serif', fontSize:24, fontWeight:700, color:'#fff', marginBottom:6 }}>Join Our Community</h1>
                  <p style={{ fontSize:13, color:'rgba(255,255,255,.5)' }}>Create your Mokone YPD account</p>
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
              {field('firstName','First Name *','Thendo','text',true)}
              {field('lastName','Last Name *','Ramurafhi','text',true)}
            </div>
            {field('username','Username *','thendo123','text',true)}
            {field('email','Email Address *','thendo@example.com','email',true)}
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
              <Link to="/login" style={{ color:'#1a4731', fontWeight:700, textDecoration:'none' }}>Sign in here</Link>
            </p>
          </div>
        </div>
        <div style={{ textAlign:'center', marginTop:18 }}>
          <Link to="/" style={{ fontSize:13, color:'rgba(255,255,255,.35)', textDecoration:'none' }}>Continue as Guest →</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;