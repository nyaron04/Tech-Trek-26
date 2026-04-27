import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import bgMain   from '../assets/Background.png';
import bgForest from '../assets/Background forest.png';
import plantsImg from '../assets/Sunflower Growth.png';

const GEO         = "'Georama', 'Inter', sans-serif";
const STORAGE_KEY = 'honeybee_timer';

function fmtTime(s) {
  const hh = String(Math.floor(s / 3600)).padStart(2, '0');
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
  const ss = String(s % 60).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
}

function loadTimer() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); }
  catch { return null; }
}

function saveTimer(isRunning, startTime, elapsed) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ isRunning, startTime, elapsed }));
}

export default function Timer() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const taskTitle = location.state?.taskTitle || 'Title of Task';

  const [running, setRunning] = useState(false);
  const [, setTick] = useState(0); // triggers re-render each second
  const intervalRef = useRef(null);
  // Source of truth for display — never stale because we read them at render time
  const elapsedRef  = useRef(0);   // ms accumulated before the current run
  const startRef    = useRef(null); // Date.now() when current run began (null if paused)

  // Restore from localStorage on mount — keep original startTime, no folding
  useEffect(() => {
    const saved = loadTimer();
    if (!saved) return;
    elapsedRef.current = saved.elapsed ?? 0;
    if (saved.isRunning && saved.startTime) {
      startRef.current = saved.startTime; // use saved startTime directly
      setRunning(true);
      intervalRef.current = setInterval(() => setTick(t => t + 1), 1000);
    }
    setTick(t => t + 1); // initial render with restored values
  }, []);

  // Display reads from refs — always accurate, no stale-closure risk
  const displaySecs = Math.floor(
    (elapsedRef.current + (startRef.current ? Date.now() - startRef.current : 0)) / 1000
  );

  const toggle = () => {
    if (running) {
      clearInterval(intervalRef.current);
      const newElapsed = elapsedRef.current + (Date.now() - startRef.current);
      elapsedRef.current = newElapsed;
      startRef.current   = null;
      setRunning(false);
      saveTimer(false, null, newElapsed);
    } else {
      const now = Date.now();
      startRef.current = now;
      setRunning(true);
      saveTimer(true, now, elapsedRef.current);
      intervalRef.current = setInterval(() => setTick(t => t + 1), 1000);
    }
  };

  const reset = () => {
    clearInterval(intervalRef.current);
    elapsedRef.current = 0;
    startRef.current   = null;
    setRunning(false);
    setTick(t => t + 1);
    saveTimer(false, null, 0);
  };

  const finish = () => {
    clearInterval(intervalRef.current);
    const finalElapsed = elapsedRef.current + (startRef.current ? Date.now() - startRef.current : 0);
    saveTimer(false, null, finalElapsed);
    navigate('/task-completed');
  };

  return (
    <div style={s.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Georama:wght@400;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>

      {/* Layered backgrounds */}
      <div style={s.bg} />
      <img src={bgForest} alt="" style={s.forest} />

      {/* Plant growth strip */}
      <img src={plantsImg} alt="plant growth stages" style={s.plants} />

      {/* Top nav bar */}
      <div style={s.topBar}>
        <button style={s.navBtn} onClick={() => navigate(-1)}>{'< Back'}</button>
        <button style={s.navBtn} onClick={finish}>{'Finish! >'}</button>
      </div>

      {/* Center content */}
      <div style={s.center}>
        <h2 style={s.taskTitle}>{taskTitle}</h2>
        <div style={s.timeDisplay}>{fmtTime(displaySecs)}</div>
        <button style={s.startBtn} onClick={toggle}>
          <span style={s.playIcon}>{running ? '⏸' : '▶'}</span>
          {running ? ' Pause Timer' : ' Start Timer'}
        </button>
        <button style={s.resetBtn} onClick={reset}>
          <svg width="15" height="15" viewBox="0 0 13 13" fill="none" style={{ marginRight: 6 }}>
            <path d="M11.5 6.5A5 5 0 1 1 9 2.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M9 0.5v2h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Reset
        </button>
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
    display: 'flex',
    flexDirection: 'column',
  },
  bg: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `url(${bgMain})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center top',
    zIndex: 0,
  },
  forest: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '100%',
    objectFit: 'cover',
    imageRendering: 'pixelated',
    filter: 'blur(3px)',
    zIndex: 1,
    pointerEvents: 'none',
    display: 'block',
  },
  plants: {
    position: 'fixed',
    bottom: '-3vh',
    left: '50%',
    transform: 'translateX(-50%)',
    height: '50vh',
    width: 'auto',
    zIndex: 2,
    pointerEvents: 'none',
  },
  topBar: {
    position: 'relative',
    zIndex: 10,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '22px 36px',
  },
  navBtn: {
    background: 'transparent',
    border: 'none',
    fontFamily: GEO,
    fontSize: 17,
    fontWeight: 600,
    color: '#fff',
    cursor: 'pointer',
    letterSpacing: 0.3,
    textShadow: '0 1px 4px rgba(0,0,0,0.3)',
  },
  center: {
    position: 'relative',
    zIndex: 10,
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: '6vh',
    gap: 12,
  },
  taskTitle: {
    fontFamily: GEO,
    fontWeight: 700,
    fontSize: 28,
    color: '#fff',
    textShadow: '0 2px 8px rgba(0,0,0,0.25)',
    letterSpacing: 0.2,
  },
  timeDisplay: {
    fontFamily: GEO,
    fontWeight: 800,
    fontSize: 'clamp(72px, 11vw, 120px)',
    color: '#fff',
    letterSpacing: 4,
    textShadow: '0 4px 16px rgba(0,0,0,0.2)',
    lineHeight: 1.1,
    marginTop: 8,
  },
  startBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 16,
    padding: '0 60px',
    height: 62,
    borderRadius: 40,
    background: '#FED430',
    border: 'none',
    fontFamily: GEO,
    fontWeight: 700,
    fontSize: 22,
    color: '#171717',
    cursor: 'pointer',
    boxShadow: '0 4px 20px rgba(254,212,48,0.35)',
    transition: 'transform 0.1s, box-shadow 0.1s',
    letterSpacing: 0.3,
  },
  playIcon: {
    fontSize: 18,
  },
  resetBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 0,
    padding: '0 28px',
    height: 42,
    borderRadius: 40,
    background: 'rgba(255,255,255,0.12)',
    border: '1px solid rgba(255,255,255,0.25)',
    fontFamily: GEO,
    fontWeight: 600,
    fontSize: 15,
    color: 'rgba(255,255,255,0.75)',
    cursor: 'pointer',
    letterSpacing: 0.3,
    marginTop: 4,
  },
};
