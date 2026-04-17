import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import authService from '../services/authService';
import YPDLogo from '../components/common/YPDLogo';

const LoginPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);
  const { login } = useAuth();
  const navigate  = useNavigate();

  // ── Scroll to top on mount ──────────────────────────
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login(data.email, data.password);
      login(response.user, response.token);
      navigate('/');
    } catch (err) {
      setError('Invalid email or password. Please try again.');
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

          <form onSubmit={handleSubmit(onSubmit)}>

            {/* Email */}
            <div style={{ marginBottom: 18 }}>
              <label className="login-label">EMAIL ADDRESS *</label>
              <input
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email address' },
                })}
                className="login-input"
                placeholder="john@example.com"
              />
              {errors.email && <p style={{ color: '#c0392b', fontSize: 12, marginTop: 5 }}>{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div style={{ marginBottom: 10 }}>
              <label className="login-label">PASSWORD *</label>
              <input
                type="password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 8, message: 'Password must be at least 8 characters' },
                })}
                className="login-input"
                placeholder="••••••••"
              />
              {errors.password && <p style={{ color: '#c0392b', fontSize: 12, marginTop: 5 }}>{errors.password.message}</p>}
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