// Signin Page — merged honey-bee visual design with backend auth.
// Dual-mode: toggles between "Sign in" and "Create account" tabs.
// Email + password call the Spring Boot backend via auth.js; Google goes
// through Supabase OAuth. Both land on /dashboard.

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bgMain   from '../assets/Background.png';
import bgForest from '../assets/Background forest.png';
import beeLogo  from '../assets/Honey Bee Logo.png';
import { supabase } from '../supabaseClient';
import { signIn, signUp } from '../auth';

const GEO    = "'Georama', 'Inter', sans-serif";
const YELLOW = '#FED430';

export default function SigninPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  const isSignup = mode === 'signup';
  const minPwLen = isSignup ? 8 : 1;
  const valid = email.trim() && password.length >= minPwLen;
  const busy = submitting || googleLoading;

  function switchMode(next) {
    setMode(next);
    setError('');
  }

  async function handleSubmit() {
    if (!valid || busy) return;
    setError('');
    setSubmitting(true);
    try {
      if (isSignup) {
        await signUp(email.trim(), password, displayName.trim() || undefined);
      } else {
        await signIn(email.trim(), password);
      }
      navigate('/dashboard');
    } catch (e) {
      setError(e?.message || (isSignup ? 'Sign up failed' : 'Sign in failed'));
      setSubmitting(false);
    }
  }

  async function handleGoogleSignIn() {
    setError('');
    if (!supabase) {
      setError('Google sign-in is not configured. Set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_PUBLISHABLE_KEY in frontend/.env and restart the dev server.');
      return;
    }
    setGoogleLoading(true);
    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/dashboard` },
      });
      if (oauthError) {
        setError(oauthError.message);
        setGoogleLoading(false);
      }
    } catch (e) {
      setError(e?.message || 'Google sign-in failed');
      setGoogleLoading(false);
    }
  }

  return (
    <div style={s.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Georama:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        input::placeholder { color: rgba(255,255,255,0.35); }
        input:focus { outline: none; }
      `}</style>

      {/* Sky background */}
      <img src={bgMain} alt="" aria-hidden="true" style={s.bgMain} />

      {/* Forest fixed to bottom */}
      <img src={bgForest} alt="" aria-hidden="true" style={s.bgForest} />

      {/* Centered card */}
      <div style={s.card}>
        {/* Logo */}
        <div style={s.brandWrap}>
          <img src={beeLogo} alt="Honey Bee" style={s.logoImg} />
        </div>

        {/* Mode tabs */}
        <div style={s.tabRow}>
          <button
            style={{ ...s.tabBtn, ...(isSignup ? {} : s.tabBtnActive) }}
            onClick={() => switchMode('signin')}
            type="button"
          >
            Sign in
          </button>
          <button
            style={{ ...s.tabBtn, ...(isSignup ? s.tabBtnActive : {}) }}
            onClick={() => switchMode('signup')}
            type="button"
          >
            Create account
          </button>
        </div>

        {/* Heading */}
        <p style={s.heading}>
          {isSignup
            ? 'Start building your study streak today.'
            : 'Unlock Personalized study planning!'}
        </p>

        {/* Name (signup only) */}
        {isSignup && (
          <div style={s.fieldWrap}>
            <label style={s.label}>NAME <span style={s.optionalTag}>(OPTIONAL)</span></label>
            <input
              type="text"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              placeholder="Ada Lovelace"
              style={s.input}
            />
          </div>
        )}

        {/* Email */}
        <div style={s.fieldWrap}>
          <label style={s.label}>EMAIL</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder="you@example.com"
            style={s.input}
          />
        </div>

        {/* Password */}
        <div style={s.fieldWrap}>
          <label style={s.label}>
            PASSWORD {isSignup && <span style={s.optionalTag}>(8+ CHARACTERS)</span>}
          </label>
          <div style={s.pwWrap}>
            <input
              type={showPw ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              placeholder="••••••••"
              style={{ ...s.input, paddingRight: 48 }}
            />
            <button
              type="button"
              style={s.eyeBtn}
              onClick={() => setShowPw(v => !v)}
              aria-label={showPw ? 'Hide password' : 'Show password'}
            >
              {showPw ? '🙈' : '👁'}
            </button>
          </div>
        </div>

        {/* Primary CTA */}
        <button
          style={{
            ...s.btnYellow,
            opacity: valid && !busy ? 1 : 0.5,
            cursor: busy ? 'wait' : 'pointer',
          }}
          disabled={!valid || busy}
          onClick={handleSubmit}
        >
          {submitting
            ? (isSignup ? 'Creating account…' : 'Signing in…')
            : (isSignup ? 'Create account' : 'Sign in')}
        </button>

        {/* Divider */}
        <p style={s.divider}>{isSignup ? 'OR SIGN UP WITH' : 'OR CONTINUE WITH'}</p>

        {/* Social buttons */}
        <div style={s.socialRow}>
          <button
            type="button"
            style={{ ...s.socialBtn, opacity: busy ? 0.6 : 1, cursor: busy ? 'wait' : 'pointer' }}
            onClick={handleGoogleSignIn}
            disabled={busy}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            {googleLoading ? 'Redirecting…' : 'Google'}
          </button>

          <button type="button" style={{ ...s.socialBtn, opacity: 0.5, cursor: 'not-allowed' }} disabled title="Apple sign-in coming soon">
            <svg viewBox="0 0 814 1000" width="16" height="16" fill="currentColor" aria-hidden="true">
              <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-207.5 135.4-317.3 269-317.3 71 0 130.1 46.9 174.4 46.9 42.6 0 109.2-49.9 190.5-49.9 30.3 0 133.6 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z"/>
            </svg>
            Apple
          </button>
        </div>

        {/* Error */}
        {error && <p style={s.errorText}>{error}</p>}

        {/* Mode switch link */}
        <p style={s.switchText}>
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            style={s.switchLink}
            onClick={() => switchMode(isSignup ? 'signin' : 'signup')}
          >
            {isSignup ? 'Sign in' : 'Create one'}
          </button>
        </p>

        {/* Disclaimer */}
        <p style={s.disclaimer}>
          We're building a student-focused web application that integrates task planning,
          time tracking, calendar visualization, and an AI-assisted scheduling system to
          support realistic study planning.
        </p>
      </div>
    </div>
  );
}

const s = {
  root: {
    position: 'relative',
    width: '100vw',
    minHeight: '100vh',
    overflow: 'auto',
    fontFamily: GEO,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#2b9ec7',
    padding: '40px 16px',
  },
  bgMain: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center',
    zIndex: 0,
  },
  bgForest: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '100%',
    zIndex: 1,
    pointerEvents: 'none',
    display: 'block',
    filter: 'blur(3px)',
  },
  card: {
    position: 'relative',
    zIndex: 2,
    width: 440,
    maxWidth: '100%',
    background: 'rgba(255,255,255,0.15)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: 24,
    border: '1.5px solid rgba(91,200,232,0.55)',
    padding: '40px 40px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
  },
  brandWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  logoImg: {
    width: 120,
    height: 'auto',
    display: 'block',
  },
  tabRow: {
    display: 'flex',
    width: '100%',
    padding: 4,
    borderRadius: 22,
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.2)',
  },
  tabBtn: {
    flex: 1,
    height: 34,
    border: 'none',
    background: 'transparent',
    color: 'rgba(255,255,255,0.75)',
    fontFamily: GEO,
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    borderRadius: 18,
    transition: 'background 0.15s, color 0.15s',
  },
  tabBtnActive: {
    background: YELLOW,
    color: '#160a00',
    fontWeight: 600,
  },
  heading: {
    margin: 0,
    fontFamily: GEO,
    fontWeight: 500,
    fontSize: 14,
    color: '#fff',
    textAlign: 'left',
    alignSelf: 'flex-start',
    lineHeight: 1.4,
  },
  fieldWrap: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: 5,
  },
  label: {
    fontFamily: GEO,
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: 1.5,
    color: 'rgba(255,255,255,0.85)',
    textTransform: 'uppercase',
  },
  optionalTag: {
    fontWeight: 400,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 1,
  },
  input: {
    width: '100%',
    height: 40,
    borderRadius: 20,
    border: '1.5px solid rgba(255,255,255,0.7)',
    background: 'rgba(255,255,255,0.18)',
    padding: '0 16px',
    fontFamily: GEO,
    fontSize: 14,
    color: '#fff',
  },
  pwWrap: {
    position: 'relative',
    width: '100%',
  },
  eyeBtn: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: 16,
    padding: 4,
    lineHeight: 1,
  },
  btnYellow: {
    width: '100%',
    height: 44,
    borderRadius: 22,
    background: YELLOW,
    border: 'none',
    fontFamily: GEO,
    fontWeight: 600,
    fontSize: 15,
    color: '#160a00',
    cursor: 'pointer',
    boxShadow: '0 2px 10px rgba(0,0,0,0.18)',
    marginTop: 4,
  },
  divider: {
    margin: '4px 0 0',
    fontFamily: GEO,
    fontSize: 11,
    fontWeight: 500,
    letterSpacing: 1.2,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },
  socialRow: {
    width: '100%',
    display: 'flex',
    gap: 12,
  },
  socialBtn: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    background: '#fff',
    border: 'none',
    fontFamily: GEO,
    fontWeight: 500,
    fontSize: 14,
    color: '#1a1a1a',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    boxShadow: '0 1px 6px rgba(0,0,0,0.12)',
  },
  errorText: {
    fontFamily: GEO,
    fontSize: 12,
    color: '#ffb4b4',
    textAlign: 'center',
    margin: '4px 0 0',
    lineHeight: 1.4,
  },
  switchText: {
    margin: '4px 0 0',
    fontFamily: GEO,
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  switchLink: {
    background: 'none',
    border: 'none',
    padding: 0,
    color: YELLOW,
    fontFamily: GEO,
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    textDecoration: 'underline',
  },
  disclaimer: {
    margin: '8px 0 0',
    fontFamily: GEO,
    fontSize: 10,
    lineHeight: 1.5,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
  },
};
