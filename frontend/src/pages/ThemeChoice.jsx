// Theme Choice — onboarding step 3
// Figma node 2004:281
// Allows user to pick a color theme for the app.
// Design inferred from established system: glass card, yellow accent, teal bg.

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  rootStyle, glassCard, pageHeader, titleStyle, subtitleStyle,
  yellowBtn, ghostBtn, colors, shadow, fonts,
} from '../styles/theme';

const THEMES = [
  { id: 'ocean',   label: 'Ocean',   primary: '#2393BC', bg: 'linear-gradient(135deg,#0d2a35,#1a4a5a,#2d5260)' },
  { id: 'sunset',  label: 'Sunset',  primary: '#E8834A', bg: 'linear-gradient(135deg,#3a1a0d,#5a2a1a,#6a3020)' },
  { id: 'forest',  label: 'Forest',  primary: '#4CAF7A', bg: 'linear-gradient(135deg,#0d2a1a,#1a4a2d,#2d5240)' },
  { id: 'midnight',label: 'Midnight',primary: '#7B6FE8', bg: 'linear-gradient(135deg,#12103a,#1e1a5a,#2a2060)' },
];

export default function ThemeChoice() {
  const navigate = useNavigate();
  const [chosen, setChosen] = useState('ocean');

  return (
    <div style={rootStyle}>
      <div style={bgAccent} />
      <p style={pageHeader}>Theme Choice</p>

      <div style={glassCard}>
        <h1 style={titleStyle}>Choose your theme</h1>
        <p style={subtitleStyle}>
          Pick a look that keeps you focused. You can change it anytime.
        </p>

        <div style={grid}>
          {THEMES.map(({ id, label, primary, bg }) => {
            const active = chosen === id;
            return (
              <button
                key={id}
                onClick={() => setChosen(id)}
                style={{
                  ...themeCard,
                  background: bg,
                  border: active ? `2px solid ${colors.yellow}` : `2px solid ${colors.borderWhite}`,
                  boxShadow: active ? `0 0 0 3px ${colors.yellow}44` : shadow.box,
                }}
              >
                <div style={{ ...swatch, background: primary }} />
                <span style={themeLabel}>{label}</span>
                {active && <span style={checkBadge}>✓</span>}
              </button>
            );
          })}
        </div>

        <div style={btnRow}>
          <button style={{ ...yellowBtn, width: 127 }} onClick={() => navigate('/dashboard')}>
            Next
          </button>
          <button style={{ ...ghostBtn, width: 127 }} onClick={() => navigate('/dashboard')}>
            Skip
          </button>
        </div>
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

const grid = {
  width: '100%',
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 16,
};

const themeCard = {
  borderRadius: 16,
  padding: '20px 16px',
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 10,
  position: 'relative',
  transition: 'border 0.15s, box-shadow 0.15s',
};

const swatch = {
  width: 48,
  height: 48,
  borderRadius: '50%',
  boxShadow: shadow.box,
};

const themeLabel = {
  fontFamily: fonts.body,
  fontWeight: 400,
  fontSize: 16,
  color: colors.white,
  textShadow: shadow.text,
};

const checkBadge = {
  position: 'absolute',
  top: 8,
  right: 12,
  color: colors.yellow,
  fontSize: 18,
  fontWeight: 700,
};

const btnRow = { display: 'flex', gap: 16, marginTop: 8 };

const borderWhite = 'rgba(255,251,251,0.6)';
Object.assign(ThemeChoice, { borderWhite });
