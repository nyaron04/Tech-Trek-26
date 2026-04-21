import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import bgMain   from '../assets/Background.png';
import bgForest from '../assets/Background forest.png';
import beeLogo  from '../assets/Honey Bee Logo.png';

const GEO    = "'Georama', 'Inter', sans-serif";
const TEAL   = '#5BC8E8';
const BORDER = 'rgba(255,255,255,0.14)';
const BLR    = 'blur(18px)';

const NAV_SECTIONS = [
  {
    title: 'TRACK',
    items: [
      { label: 'Dashboard', route: '/dashboard' },
      { label: 'Calendar',  route: '/calendar'  },
      { label: 'Timer',     route: '/timer'      },
    ],
  },
  {
    title: 'ANALYZE',
    items: [
      { label: 'Reports',  route: '/dashboard' },
      { label: 'Progress', route: '/dashboard' },
    ],
  },
  {
    title: 'MANAGE',
    items: [
      { label: 'Tasks',    route: '/tasks'     },
      { label: 'Settings', route: '/dashboard' },
    ],
  },
];

const CATEGORY_TAGS = [
  { label: 'Work',     color: TEAL      },
  { label: 'Personal', color: '#7BDE8A' },
  { label: 'Study',    color: '#E8C85B' },
];

function fmtTimer(s) {
  const hh = String(Math.floor(s / 3600)).padStart(2, '0');
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
  const ss = String(s % 60).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
}

export default function Layout({ children }) {
  const navigate  = useNavigate();
  const { pathname } = useLocation();

  const [workingOn,   setWorkingOn]   = useState('');
  const [selectedTag, setSelectedTag] = useState('Work');
  const [timerSecs,   setTimerSecs]   = useState(0);
  const [running,     setRunning]     = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => () => clearInterval(intervalRef.current), []);

  const toggleTimer = () => {
    if (running) {
      clearInterval(intervalRef.current);
      setRunning(false);
    } else {
      intervalRef.current = setInterval(() => setTimerSecs(s => s + 1), 1000);
      setRunning(true);
    }
  };

  return (
    <div style={s.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Georama:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        input::placeholder { color: rgba(255,255,255,0.4); }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(91,200,232,0.35); border-radius: 2px; }
      `}</style>

      {/* Layered backgrounds */}
      <div style={s.bg} />
      <div style={s.bgOverlay} />
      <img src={bgForest} alt="" style={s.bgForest} />

      <div style={s.shell}>
        {/* ── TOP BAR ── */}
        <header style={s.topBar}>
          <div style={s.profileArea}>
            <div style={s.avatar}>JK</div>
            <span style={s.profileName}>Josh Kwon</span>
          </div>

          <div style={s.workWrap}>
            <span style={s.pencil}>✏</span>
            <input
              style={s.workInput}
              placeholder="What Are You Working On Today?"
              value={workingOn}
              onChange={e => setWorkingOn(e.target.value)}
            />
          </div>

          <div style={s.tagRow}>
            {CATEGORY_TAGS.map(({ label, color }) => (
              <button
                key={label}
                style={{
                  ...s.tagBtn,
                  border: `1px solid ${color}`,
                  background: selectedTag === label ? color + '2A' : 'transparent',
                  color: selectedTag === label ? color : 'rgba(255,255,255,0.6)',
                }}
                onClick={() => setSelectedTag(label)}
              >
                {label}
              </button>
            ))}
          </div>

          <div style={s.timerBox} onClick={toggleTimer} title={running ? 'Pause' : 'Start'}>
            <span style={s.timerIcon}>{running ? '⏸' : '▶'}</span>
            <span style={s.timerTime}>{fmtTimer(timerSecs)}</span>
          </div>
        </header>

        {/* ── BODY ── */}
        <div style={s.body}>
          {/* Left sidebar */}
          <aside style={s.sidebar}>
            <div style={s.brand}>
              <img src={beeLogo} alt="StudyLynk" style={s.logoImg} />
            </div>

            {NAV_SECTIONS.map(({ title, items }) => (
              <div key={title} style={s.navSection}>
                <div style={s.sectionLabel}>{title}</div>
                {items.map(({ label, route }) => {
                  const active = pathname === route;
                  return (
                    <button
                      key={label}
                      style={{
                        ...s.navItem,
                        background:  active ? 'rgba(91,200,232,0.16)' : 'transparent',
                        borderLeft:  active ? `3px solid ${TEAL}` : '3px solid transparent',
                        color:       active ? TEAL : 'rgba(255,255,255,0.75)',
                        fontWeight:  active ? 500 : 400,
                      }}
                      onClick={() => navigate(route)}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            ))}
          </aside>

          {/* Page content fills the rest */}
          {children}
        </div>
      </div>
    </div>
  );
}

/* ── Styles ── */
const s = {
  root: {
    position: 'relative',
    width: '100vw',
    height: '100vh',
    fontFamily: GEO,
    overflow: 'hidden',
  },
  bg: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `url(${bgMain})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    zIndex: 0,
  },
  bgOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(4,24,32,0.35)',
    zIndex: 1,
  },
  bgForest: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '100%',
    zIndex: 2,
    pointerEvents: 'none',
    display: 'block',
    filter: 'blur(3px)',
  },
  shell: {
    position: 'relative',
    zIndex: 3,
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },

  /* Top bar */
  topBar: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    padding: '10px 20px',
    background: 'rgba(255,255,255,0.07)',
    backdropFilter: BLR,
    WebkitBackdropFilter: BLR,
    borderBottom: `1px solid ${BORDER}`,
    flexShrink: 0,
  },
  profileArea: {
    display: 'flex',
    alignItems: 'center',
    gap: 9,
    flexShrink: 0,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    background: `linear-gradient(135deg, ${TEAL}, #2a7a9a)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    fontWeight: 700,
    color: '#fff',
    letterSpacing: 0.5,
  },
  profileName: {
    fontSize: 13,
    fontWeight: 500,
    color: 'rgba(255,255,255,0.88)',
    whiteSpace: 'nowrap',
  },
  workWrap: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    background: 'rgba(255,255,255,0.09)',
    border: `1px solid ${BORDER}`,
    borderRadius: 24,
    padding: '7px 16px',
  },
  pencil: {
    fontSize: 14,
    color: TEAL,
    flexShrink: 0,
  },
  workInput: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    outline: 'none',
    fontFamily: GEO,
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    minWidth: 0,
  },
  tagRow: {
    display: 'flex',
    gap: 7,
    flexShrink: 0,
  },
  tagBtn: {
    padding: '5px 13px',
    borderRadius: 20,
    fontFamily: GEO,
    fontSize: 12,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  timerBox: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: 'rgba(91,200,232,0.12)',
    border: `1px solid rgba(91,200,232,0.5)`,
    borderRadius: 20,
    padding: '7px 14px',
    cursor: 'pointer',
    flexShrink: 0,
    transition: 'background 0.15s',
  },
  timerIcon: {
    fontSize: 12,
    color: TEAL,
  },
  timerTime: {
    fontFamily: "'Courier New', monospace",
    fontSize: 14,
    color: TEAL,
    fontWeight: 700,
    letterSpacing: 1.5,
  },

  /* Body */
  body: {
    flex: 1,
    display: 'flex',
    overflow: 'hidden',
  },

  /* Sidebar */
  sidebar: {
    width: 196,
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    padding: '18px 0',
    background: 'rgba(255,255,255,0.06)',
    backdropFilter: BLR,
    WebkitBackdropFilter: BLR,
    borderRight: `1px solid ${BORDER}`,
    overflowY: 'auto',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 18px 16px',
    borderBottom: `1px solid ${BORDER}`,
    marginBottom: 6,
  },
  logoImg: {
    width: 140,
    height: 'auto',
    filter: 'brightness(0) invert(1) sepia(1) saturate(3) hue-rotate(5deg)',
    display: 'block',
  },
  navSection: {
    padding: '10px 0 2px',
  },
  sectionLabel: {
    padding: '0 18px 5px',
    fontSize: 9.5,
    fontWeight: 700,
    color: 'rgba(255,255,255,0.35)',
    letterSpacing: 1.8,
    textTransform: 'uppercase',
  },
  navItem: {
    display: 'block',
    width: '100%',
    padding: '9px 18px',
    fontFamily: GEO,
    fontSize: 13.5,
    border: 'none',
    borderRight: 'none',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.15s',
  },
};
