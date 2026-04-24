import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import authService from '../services/authService';
import YPDLogo from '../components/common/YPDLogo';

const LoginPage = () => {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);

  const { login, isAuthenticated } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const from      = location.state?.from?.pathname || '/';

  useEffect(() => { window.scrollTo(0, 0); }, []);

  // If already logged in, skip the page entirely
  useEffect(() => { if (isAuthenticated()) navigate(from, { replace: true }); }, [isAuthenticated]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(150deg,#071812 0%,#0d2b1a 60%,#1a4731 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px', paddingTop: 88,
      fontFamily: "'Lato',sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700&family=Lato:wght@300;400;700&display=swap');
        .login-input { width:100%; padding:13px 16px; border:1.5px solid rgba(26,71,49,0.2); border-radius:8px; font-size:14px; outline:none; font-family:'Lato',sans-serif; box-sizing:border-box; transition:border-color 0.2s; }
        .login-input:focus { border-color:#1a4731; }
        .login-label { display:block; font-size:11px; font-weight:700; letter-spacing:.12em; color:#3d5247; margin-bottom:8px; }
      `}</style>

      <div style={{ width: '100%', maxWidth: 440 }}>

        {/* ── Logo ──────────────────────────────────────
            Replace <YPDLogo> with your real image once
            you have the file (see instructions at top).
        ──────────────────────────────────────────────── */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', inset: -8, borderRadius: '50%', border: '1px solid rgba(201,168,76,0.3)' }} />
              <YPDLogo width={80} height={80} />
              {/*
                ── REAL LOGO (uncomment when you have the image file): ──
                <img
                  src={logoImg}
                  alt="AME YPD Logo"
                  style={{ width:80, height:80, objectFit:'contain', borderRadius:'50%' }}
                />
              */}
            </div>
          </div>
          <h1 style={{ fontFamily: 'Georgia,serif', fontSize: 28, fontWeight: 700, color: '#fff', marginBottom: 8 }}>
            Welcome Back
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,.5)' }}>
            Sign in to your Mokone YPD account
          </p>
        </div>

        {/* ── Card ── */}
        <div style={{ background: '#fff', borderRadius: 14, padding: '36px 32px', boxShadow: '0 24px 60px rgba(0,0,0,0.3)' }}>

          {error && (
            <div style={{ background: 'rgba(192,57,43,.08)', border: '1px solid rgba(192,57,43,.3)', color: '#c0392b', padding: '12px 16px', borderRadius: 6, fontSize: 13, marginBottom: 20 }}>
              ❌ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Email */}
            <div style={{ marginBottom: 18 }}>
              <label className="login-label">EMAIL ADDRESS *</label>
              <input
                type="email"
                value={email} onChange={e=>setEmail(e.target.value)}
                className="login-input"
                placeholder="thendo@example.com"
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 10 }}>
              <label className="login-label">PASSWORD *</label>
              <input
                type="password"
                value={password} onChange={e=>setPassword(e.target.value)}
                className="login-input"
                placeholder="••••••••"
              />
            </div>

            {/* Forgot password */}
            <div style={{ textAlign: 'right', marginBottom: 24 }}>
              <Link to="/forgot-password" style={{ fontSize: 13, color: '#1a4731', textDecoration: 'none', fontWeight: 600 }}>
                Forgot your password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', background: '#1a4731', color: '#fff', border: 'none', padding: '15px', borderRadius: 8, fontFamily: "'Lato',sans-serif", fontSize: 14, fontWeight: 700, cursor: 'pointer', letterSpacing: '.06em', transition: 'background 0.2s', opacity: loading ? 0.7 : 1 }}
              onMouseEnter={e => { if (!loading) e.target.style.background = '#0d2b1a'; }}
              onMouseLeave={e => e.target.style.background = '#1a4731'}
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          {/* Register link */}
          <div style={{ textAlign: 'center', marginTop: 24, borderTop: '1px solid rgba(0,0,0,.07)', paddingTop: 20 }}>
            <p style={{ fontSize: 14, color: '#6b8070' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: '#1a4731', fontWeight: 700, textDecoration: 'none' }}>
                Register here
              </Link>
            </p>
          </div>
        </div>

        {/* Guest link */}
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Link to="/" style={{ fontSize: 13, color: 'rgba(255,255,255,.35)', textDecoration: 'none' }}>
            Continue as Guest →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;