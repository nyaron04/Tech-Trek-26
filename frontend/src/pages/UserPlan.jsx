// User Plan — onboarding step 2
// Figma node 403:6  |  1382×914 canvas
// Title: "What do you plan to track time on?"
// Subtitle: "Setting up your projects. You can always add more later!"
// 3 project input fields (534×56, glass, white border)
// 1 selected row (white bg) — indicates first project is filled
// "Next" yellow button + "Skip" ghost button
// Fonts: Albert Sans 32px title, Albert Sans 15px subtitle, Inter 24px inputs

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  rootStyle, glassCard, pageHeader, titleStyle, subtitleStyle,
  yellowBtn, ghostBtn, fonts, colors, shadow,
} from '../styles/theme';

export default function UserPlan() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState(['', '', '']);

  const update = (i, val) => {
    setProjects((p) => {
      const next = [...p];
      next[i] = val;
      return next;
    });
  };

  const hasAny = projects.some((p) => p.trim());

  return (
    <div style={rootStyle}>
      <div style={bgAccent} />
      <p style={pageHeader}>What do you plan to track time on</p>

      <div style={glassCard}>
        <h1 style={titleStyle}>What do you plan to track time on?</h1>
        <p style={subtitleStyle}>
          Setting up your projects. You can always add more later!
        </p>

        <div style={fieldList}>
          {projects.map((val, i) => (
            <input
              key={i}
              value={val}
              onChange={(e) => update(i, e.target.value)}
              placeholder="Add project"
              style={{
                ...inputField,
                background: val.trim()
                  ? 'rgba(255,255,255,0.18)'
                  : colors.cardBg,
              }}
            />
          ))}
        </div>

        <div style={btnRow}>
          <button
            style={{ ...yellowBtn, width: 127, opacity: hasAny ? 1 : 0.5 }}
            disabled={!hasAny}
            onClick={() => navigate('/theme')}
          >
            Next
          </button>
          <button style={{ ...ghostBtn, width: 127 }} onClick={() => navigate('/theme')}>
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

const fieldList = {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
};

const inputField = {
  width: '100%',
  height: 56,
  borderRadius: 10,
  border: `1px solid ${colors.white}`,
  padding: '0 20px',
  fontFamily: fonts.body,
  fontWeight: 400,
  fontSize: 24,
  color: colors.white,
  outline: 'none',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  boxShadow: shadow.box,
  transition: 'background 0.15s',
};

const btnRow = {
  display: 'flex',
  gap: 16,
  marginTop: 8,
};
