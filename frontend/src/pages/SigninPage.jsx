// Signin Page — Figma node 2003:9
// Email + password sign-in form, consistent with glass-card design system.
// "Sign in" yellow CTA, "Create account" ghost link.

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  rootStyle, glassCard, pageHeader, titleStyle, subtitleStyle,
  yellowBtn, colors, shadow, fonts,
} from '../styles/theme';

export default function SigninPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);

  const valid = email.trim() && password.length >= 1;

  return (
    <div style={rootStyle}>
      <div style={bgAccent} />
      <p style={pageHeader}>StudyLynk</p>

      <div style={{ ...glassCard, maxWidth: 480 }}>
        <h1 style={titleStyle}>Sign in</h1>
        <p style={subtitleStyle}>Welcome back — let's keep the streak going.</p>

        <div style={form}>
          <label style={label}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            style={inputStyle}
          />

          <label style={label}>Password</label>
          <div style={pwWrap}>
            <input
              type={showPw ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ ...inputStyle, paddingRight: 52 }}
            />
            <button style={eyeBtn} onClick={() => setShowPw((v) => !v)}>
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
              opacity: valid ? 1 : 0.5,
            }}
            disabled={!valid}
            onClick={() => navigate('/dashboard')}
          >
            Sign in
          </button>

          <div style={divider}>
            <span style={dividerLine} />
            <span style={dividerText}>or</span>
            <span style={dividerLine} />
          </div>

          <button style={googleBtn}>
            <span>G</span> Continue with Google
          </button>
        </div>

        <p style={footerText}>
          Don't have an account?{' '}
          <button style={linkBtn} onClick={() => navigate('/welcome')}>
            Create one
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
