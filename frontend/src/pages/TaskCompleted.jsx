// Task Completed — Figma node 2004:276
// Celebration screen shown after a task or session is finished.
// Glass card, big checkmark, stats summary, yellow CTA.

import { useNavigate } from 'react-router-dom';
import {
  rootStyle, glassCard, titleStyle, subtitleStyle,
  yellowBtn, ghostBtn, colors, shadow, fonts,
} from '../styles/theme';

export default function TaskCompleted({ taskName = 'Focus Session', duration = '45m', xp = 120 }) {
  const navigate = useNavigate();

  return (
    <div style={rootStyle}>
      <div style={bgAccent} />

      <div style={{ ...glassCard, alignItems: 'center', gap: 24 }}>
        {/* Big check */}
        <div style={checkRing}>
          <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
            <circle cx="26" cy="26" r="25" stroke={colors.yellow} strokeWidth="2" />
            <path d="M14 26L22 34L38 18" stroke={colors.yellow} strokeWidth="3"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <div style={{ textAlign: 'center' }}>
          <h1 style={titleStyle}>Task Completed!</h1>
          <p style={{ ...subtitleStyle, marginTop: 6, fontSize: 18 }}>{taskName}</p>
        </div>

        {/* Stats row */}
        <div style={statsRow}>
          <div style={statBox}>
            <span style={statVal}>{duration}</span>
            <span style={statLbl}>Duration</span>
          </div>
          <div style={statBox}>
            <span style={{ ...statVal, color: colors.yellow }}>+{xp}</span>
            <span style={statLbl}>XP earned</span>
          </div>
          <div style={statBox}>
            <span style={statVal}>🔥 12</span>
            <span style={statLbl}>Day streak</span>
          </div>
        </div>

        {/* Confetti strip */}
        <div style={confettiBar} aria-hidden="true">
          {'🎉 ⭐ 🏆 ✨ 🎊 ⭐ 🎉'.split(' ').map((e, i) => (
            <span key={i} style={{ fontSize: 22, opacity: 0.85 }}>{e}</span>
          ))}
        </div>

        <div style={btnRow}>
          <button
            style={{ ...yellowBtn, width: 180 }}
            onClick={() => navigate('/tasks')}
          >
            View all tasks
          </button>
          <button
            style={{ ...ghostBtn, width: 180 }}
            onClick={() => navigate('/timer')}
          >
            Start another
          </button>
        </div>

        <button style={dashLink} onClick={() => navigate('/dashboard')}>
          Back to dashboard
        </button>
      </div>
    </div>
  );
}

const bgAccent = {
  position: 'absolute', inset: 0,
  background:
    'radial-gradient(ellipse at 50% 40%, rgba(254,212,48,0.12) 0%, transparent 55%),' +
    'radial-gradient(ellipse at 70% 30%, rgba(45,82,96,0.6) 0%, transparent 60%)',
  pointerEvents: 'none',
};

const checkRing = {
  width: 90, height: 90,
  borderRadius: '50%',
  background: 'rgba(254,212,48,0.1)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  boxShadow: `0 0 0 8px rgba(254,212,48,0.08), ${shadow.box}`,
};

const statsRow = {
  display: 'flex', gap: 20, width: '100%', justifyContent: 'center',
};

const statBox = {
  flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
  background: 'rgba(45,82,96,0.3)', borderRadius: 12, padding: '14px 10px',
  boxShadow: shadow.box,
};

const statVal = {
  fontFamily: "'Albert Sans', sans-serif", fontWeight: 600,
  fontSize: 22, color: colors.white, textShadow: shadow.text,
};

const statLbl = { fontSize: 12, color: 'rgba(255,255,255,0.6)' };

const confettiBar = {
  display: 'flex', gap: 10, justifyContent: 'center',
  width: '100%', padding: '4px 0',
};

const btnRow = { display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' };

const dashLink = {
  background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)',
  fontFamily: fonts.body, fontSize: 14, cursor: 'pointer',
  textDecoration: 'underline', marginTop: -8,
};
