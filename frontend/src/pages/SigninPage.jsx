// Signin Page — Figma node 2003:9
// Dual-mode auth: toggles between "Sign in" and "Create account" on the
// same glass card. Signup adds a Name field and calls signUp(); sign-in
// just calls signIn(). Both land on /dashboard.

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  rootStyle, glassCard, pageHeader, titleStyle, subtitleStyle,
  yellowBtn, colors, shadow, fonts,
} from '../styles/theme';
import { supabase } from '../supabaseClient';
import { signIn, signUp } from '../auth';

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
    <div style={rootStyle}>
      <div style={bgAccent} />
      <p style={pageHeader}>StudyLynk</p>

      <div style={{ ...glassCard, maxWidth: 480 }}>
        <div style={tabRow}>
          <button
            style={{ ...tabBtn, ...(isSignup ? {} : tabBtnActive) }}
            onClick={() => switchMode('signin')}
            type="button"
          >
            Sign in
          </button>
          <button
            style={{ ...tabBtn, ...(isSignup ? tabBtnActive : {}) }}
            onClick={() => switchMode('signup')}
            type="button"
          >
            Create account
          </button>
        </div>

        <h1 style={titleStyle}>{isSignup ? 'Create account' : 'Sign in'}</h1>
        <p style={subtitleStyle}>
          {isSignup
            ? 'Start building your study streak today.'
            : "Welcome back — let's keep the streak going."}
        </p>

        <div style={form}>
          {isSignup && (
            <>
              <label style={label}>Name <span style={optionalTag}>(optional)</span></label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                placeholder="Ada Lovelace"
                style={inputStyle}
              />
            </>
          )}

          <label style={label}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="you@example.com"
            style={inputStyle}
          />

          <label style={label}>
            Password {isSignup && <span style={optionalTag}>(8+ characters)</span>}
          </label>
          <div style={pwWrap}>
            <input
              type={showPw ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="••••••••"
              style={{ ...inputStyle, paddingRight: 52 }}
            />
            <button style={eyeBtn} onClick={() => setShowPw((v) => !v)} type="button">
              {showPw ? '🙈' : '👁'}
            </button>
          </div>

          <button
            style={{
              ...yellowBtn,
              width: '100%',
              height: 50,
              marginTop: 8,
              fontSize: 18,
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

          <div style={divider}>
            <span style={dividerLine} />
            <span style={dividerText}>or</span>
            <span style={dividerLine} />
          </div>

          <button
            style={{ ...googleBtn, opacity: busy ? 0.6 : 1, cursor: busy ? 'wait' : 'pointer' }}
            onClick={handleGoogleSignIn}
            disabled={busy}
            type="button"
          >
            <span>G</span> {googleLoading
              ? 'Redirecting…'
              : (isSignup ? 'Sign up with Google' : 'Continue with Google')}
          </button>

          {error && <p style={errorText}>{error}</p>}
        </div>

        <p style={footerText}>
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            style={linkBtn}
            onClick={() => switchMode(isSignup ? 'signin' : 'signup')}
            type="button"
          >
            {isSignup ? 'Sign in' : 'Create one'}
          </button>
        </p>
      </div>
    </div>
  );
}

const bgAccent = {
  position: 'absolute',
  inset: 0,
  background:
    'radial-gradient(ellipse at 70% 30%, rgba(45,82,96,0.6) 0%, transparent 60%),' +
    'radial-gradient(ellipse at 20% 80%, rgba(20,50,65,0.8) 0%, transparent 50%)',
  pointerEvents: 'none',
};

const form = {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
};

const label = {
  fontFamily: fonts.body,
  fontSize: 14,
  color: colors.offWhite,
  textShadow: shadow.text,
  marginBottom: -4,
};

const inputStyle = {
  width: '100%',
  height: 48,
  borderRadius: 10,
  border: `1px solid ${colors.white}`,
  padding: '0 16px',
  fontFamily: fonts.body,
  fontSize: 16,
  color: colors.white,
  background: colors.cardBg,
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  outline: 'none',
  boxShadow: shadow.box,
};

const pwWrap = { position: 'relative' };

const eyeBtn = {
  position: 'absolute',
  right: 12,
  top: '50%',
  transform: 'translateY(-50%)',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontSize: 16,
};

const divider = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  margin: '4px 0',
};

const dividerLine = {
  flex: 1,
  height: 1,
  background: 'rgba(255,255,255,0.3)',
};

const dividerText = {
  color: colors.offWhite,
  fontSize: 13,
  fontFamily: fonts.body,
};

const googleBtn = {
  width: '100%',
  height: 48,
  borderRadius: 10,
  border: `1px solid ${colors.white}`,
  background: 'rgba(255,255,255,0.1)',
  color: colors.white,
  fontFamily: fonts.body,
  fontSize: 16,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 10,
  backdropFilter: 'blur(8px)',
};

const footerText = {
  fontFamily: fonts.body,
  fontSize: 14,
  color: colors.offWhite,
  textAlign: 'center',
  marginTop: 4,
};

const linkBtn = {
  background: 'none',
  border: 'none',
  color: colors.yellow,
  fontFamily: fonts.body,
  fontSize: 14,
  cursor: 'pointer',
  textDecoration: 'underline',
};

const errorText = {
  fontFamily: fonts.body,
  fontSize: 13,
  color: '#ff8a8a',
  textAlign: 'center',
  margin: '4px 0 0',
};

const tabRow = {
  display: 'flex',
  width: '100%',
  gap: 0,
  padding: 4,
  marginBottom: 16,
  borderRadius: 12,
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.12)',
};

const tabBtn = {
  flex: 1,
  height: 36,
  border: 'none',
  background: 'transparent',
  color: colors.offWhite,
  fontFamily: fonts.body,
  fontSize: 14,
  fontWeight: 500,
  cursor: 'pointer',
  borderRadius: 8,
  transition: 'background 0.15s, color 0.15s',
};

const tabBtnActive = {
  background: colors.yellow,
  color: colors.black,
  fontWeight: 600,
};

const optionalTag = {
  color: 'rgba(255,255,255,0.45)',
  fontWeight: 400,
  fontSize: 12,
};
