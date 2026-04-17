// Personal Dashboard — Figma node 2003:7
// Shows study stats, active projects, recent sessions, and quick actions.
// Sidebar nav + main content area, matching teal/glass design system.

import { useNavigate } from 'react-router-dom';
import { colors, fonts, shadow } from '../styles/theme';

const STATS = [
  { label: 'Hours today',   value: '3h 42m', icon: '⏱' },
  { label: 'Streak',        value: '12 days', icon: '🔥' },
  { label: 'Tasks done',    value: '8 / 11',  icon: '✅' },
  { label: 'Focus score',   value: '87%',     icon: '🎯' },
];

const PROJECTS = [
  { name: 'Team productivity',     progress: 72, color: colors.yellow },
  { name: 'Resource planning',     progress: 45, color: '#4CAF7A' },
  { name: 'Personal progress',     progress: 88, color: '#7B6FE8' },
];

const NAV_ITEMS = [
  { label: 'Dashboard', route: '/dashboard', icon: '🏠' },
  { label: 'Tasks',     route: '/tasks',     icon: '📋' },
  { label: 'Timer',     route: '/timer',     icon: '⏱' },
  { label: 'Calendar',  route: '/calendar',  icon: '📅' },
];

export default function PersonalDashboard() {
  const navigate = useNavigate();

  return (
    <div style={root}>
      {/* Sidebar */}
      <aside style={sidebar}>
        <div style={brand}>StudyLynk</div>
        <nav style={navList}>
          {NAV_ITEMS.map(({ label, route, icon }) => (
            <button
              key={route}
              style={{
                ...navItem,
                background: route === '/dashboard' ? 'rgba(254,212,48,0.15)' : 'transparent',
                borderLeft: route === '/dashboard' ? `3px solid ${colors.yellow}` : '3px solid transparent',
              }}
              onClick={() => navigate(route)}
            >
              <span>{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </nav>
        <button style={signOutBtn} onClick={() => navigate('/signin')}>
          Sign out
        </button>
      </aside>

      {/* Main content */}
      <main style={main}>
        <header style={topBar}>
          <div>
            <h1 style={greeting}>Good morning, Josh 👋</h1>
            <p style={dateLabel}>{new Date().toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric' })}</p>
          </div>
          <button style={timerQuickBtn} onClick={() => navigate('/timer')}>
            Start focus session ▶
          </button>
        </header>

        {/* Stats row */}
        <div style={statsGrid}>
          {STATS.map(({ label, value, icon }) => (
            <div key={label} style={statCard}>
              <span style={statIcon}>{icon}</span>
              <span style={statValue}>{value}</span>
              <span style={statLabel}>{label}</span>
            </div>
          ))}
        </div>

        {/* Projects */}
        <section style={section}>
          <h2 style={sectionTitle}>Active Projects</h2>
          <div style={projectList}>
            {PROJECTS.map(({ name, progress, color }) => (
              <div key={name} style={projectCard}>
                <div style={projectHeader}>
                  <span style={projectName}>{name}</span>
                  <span style={{ ...projectPct, color }}>{progress}%</span>
                </div>
                <div style={trackBg}>
                  <div style={{ ...trackFill, width: `${progress}%`, background: color }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick actions */}
        <section style={section}>
          <h2 style={sectionTitle}>Quick Actions</h2>
          <div style={actionRow}>
            <button style={actionBtn} onClick={() => navigate('/tasks')}>
              📋 View tasks
            </button>
            <button style={actionBtn} onClick={() => navigate('/calendar')}>
              📅 Open calendar
            </button>
            <button style={{ ...actionBtn, background: colors.yellow, color: colors.black }}
              onClick={() => navigate('/timer')}>
              ⏱ Focus timer
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

/* ── styles ───────────────────────────────────────────── */

const root = {
  display: 'flex',
  width: '100vw',
  height: '100vh',
  background: 'linear-gradient(135deg,#0d2a35 0%,#1a4a5a 40%,#2d5260 70%,#0d2a35 100%)',
  fontFamily: fonts.body,
  overflow: 'hidden',
};

const sidebar = {
  width: 220,
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  padding: '28px 0',
  background: 'rgba(10,30,40,0.55)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  borderRight: '1px solid rgba(255,255,255,0.1)',
};

const brand = {
  fontFamily: "'Albert Sans', sans-serif",
  fontWeight: 700,
  fontSize: 20,
  color: colors.white,
  padding: '0 24px 28px',
  textShadow: shadow.text,
};

const navList = {
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  flex: 1,
};

const navItem = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '12px 24px',
  fontFamily: fonts.body,
  fontSize: 15,
  color: colors.white,
  cursor: 'pointer',
  border: 'none',
  textAlign: 'left',
  transition: 'background 0.15s',
};

const signOutBtn = {
  margin: '16px 24px 0',
  padding: '10px 0',
  borderRadius: 8,
  border: '1px solid rgba(255,255,255,0.3)',
  background: 'transparent',
  color: colors.white,
  fontFamily: fonts.body,
  fontSize: 14,
  cursor: 'pointer',
};

const main = {
  flex: 1,
  overflowY: 'auto',
  padding: '36px 40px',
  display: 'flex',
  flexDirection: 'column',
  gap: 28,
};

const topBar = {
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: 16,
};

const greeting = {
  margin: 0,
  fontFamily: "'Albert Sans', sans-serif",
  fontWeight: 400,
  fontSize: 28,
  color: colors.white,
  textShadow: shadow.text,
};

const dateLabel = {
  margin: '4px 0 0',
  fontSize: 14,
  color: 'rgba(255,255,255,0.65)',
};

const timerQuickBtn = {
  height: 44,
  padding: '0 24px',
  borderRadius: 10,
  background: colors.yellow,
  border: 'none',
  fontFamily: fonts.body,
  fontWeight: 600,
  fontSize: 15,
  color: colors.black,
  cursor: 'pointer',
  boxShadow: shadow.box,
};

const statsGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: 16,
};

const statCard = {
  background: 'rgba(45,82,96,0.28)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  borderRadius: 16,
  padding: '20px 16px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 6,
  boxShadow: shadow.box,
};

const statIcon = { fontSize: 26 };

const statValue = {
  fontFamily: "'Albert Sans', sans-serif",
  fontWeight: 600,
  fontSize: 22,
  color: colors.white,
  textShadow: shadow.text,
};

const statLabel = {
  fontSize: 12,
  color: 'rgba(255,255,255,0.65)',
  textAlign: 'center',
};

const section = { display: 'flex', flexDirection: 'column', gap: 12 };

const sectionTitle = {
  margin: 0,
  fontFamily: "'Albert Sans', sans-serif",
  fontWeight: 400,
  fontSize: 18,
  color: colors.white,
  textShadow: shadow.text,
};

const projectList = { display: 'flex', flexDirection: 'column', gap: 12 };

const projectCard = {
  background: 'rgba(45,82,96,0.22)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  borderRadius: 12,
  padding: '16px 20px',
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
  boxShadow: shadow.box,
};

const projectHeader = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' };

const projectName = { fontSize: 15, color: colors.white, fontWeight: 400 };

const projectPct = { fontSize: 14, fontWeight: 600 };

const trackBg = {
  height: 6,
  borderRadius: 3,
  background: 'rgba(255,255,255,0.15)',
  overflow: 'hidden',
};

const trackFill = {
  height: '100%',
  borderRadius: 3,
  transition: 'width 0.4s ease',
};

const actionRow = { display: 'flex', gap: 12, flexWrap: 'wrap' };

const actionBtn = {
  height: 44,
  padding: '0 20px',
  borderRadius: 10,
  border: `1px solid rgba(255,255,255,0.3)`,
  background: 'rgba(45,82,96,0.3)',
  color: colors.white,
  fontFamily: fonts.body,
  fontSize: 15,
  cursor: 'pointer',
  backdropFilter: 'blur(8px)',
};
