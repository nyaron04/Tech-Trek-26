import { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import bgMain   from '../assets/Background.png';
import bgForest from '../assets/Background forest.png';
import plantsImg from '../assets/Sunflower Growth.png';
import { authFetch, getUserId } from '../auth';

const GEO = "'Georama', 'Inter', sans-serif";

function fmtTime(s) {
  const hh = String(Math.floor(s / 3600)).padStart(2, '0');
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
  const ss = String(s % 60).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
}

export default function Timer() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const taskId    = location.state?.taskId || null;
  const taskTitle = location.state?.taskTitle || 'Title of Task';

  const [secs,    setSecs]    = useState(0);
  const [running, setRunning] = useState(false);
  const [timerId, setTimerId] = useState(null);
  const [error,   setError]   = useState('');
  const [busy,    setBusy]    = useState(false);
  const intervalRef = useRef(null);

  const canStart = !!taskId && !!getUserId();

  const startTimer = async () => {
    const userId = getUserId();
    if (!userId) {
      setError('You need to be signed in to start the timer.');
      return null;
    }
    if (!taskId) {
      setError('Pick a task first — open Tasks and click "Start timer".');
      return null;
    }

    setError('');
    setBusy(true);
    try {
      const res = await authFetch(`http://localhost:8080/api/timer/start`, {
        method: 'POST',
        body: JSON.stringify({ userId, taskId }),
      });
      if (!res.ok) {
        const body = await res.text();
        throw new Error(body || `Start failed (${res.status})`);
      }
      const saved = await res.json();
      setTimerId(saved.id);
      return saved.id;
    } catch (e) {
      setError(e?.message || 'Could not start the timer.');
      return null;
    } finally {
      setBusy(false);
    }
  };

  const endTimer = async (idOverride) => {
    const idToStop = idOverride || timerId;
    if (!idToStop) return;
    try {
      const res = await authFetch(`http://localhost:8080/api/timer/stop/${idToStop}`, {
        method: 'POST',
      });
      if (!res.ok) {
        const body = await res.text();
        throw new Error(body || `Stop failed (${res.status})`);
      }
      setTimerId(null);
    } catch (e) {
      setError(e?.message || 'Could not stop the timer.');
    }
  };

  const toggle = async () => {
    if (busy) return;

    if (running) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setRunning(false);
      await endTimer();
      return;
    }

    const newId = await startTimer();
    if (!newId) return; // backend failed; don't tick locally
    intervalRef.current = setInterval(() => setSecs(s => s + 1), 1000);
    setRunning(true);
  };

  const finish = async () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setRunning(false);
    await endTimer();
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

      {/* Plant growth strip — sits above the treeline */}
      <img src={plantsImg} alt="plant growth stages" style={s.plants} />

      {/* Top nav bar */}
      <div style={s.topBar}>
        <button style={s.navBtn} onClick={() => navigate(-1)}>{'< Back'}</button>
        <button style={s.navBtn} onClick={finish}>{'Finish! >'}</button>
      </div>

      {/* Center content */}
      <div style={s.center}>
        <h2 style={s.taskTitle}>{taskTitle}</h2>
        <div style={s.timeDisplay}>{fmtTime(secs)}</div>
        <button
          style={{
            ...s.startBtn,
            opacity: canStart && !busy ? 1 : 0.55,
            cursor: busy ? 'wait' : (canStart ? 'pointer' : 'not-allowed'),
          }}
          onClick={toggle}
          disabled={!canStart || busy}
          title={!canStart ? 'Pick a task from the Tasks page first' : undefined}
        >
          <span style={s.playIcon}>{running ? '⏸' : '▶'}</span>
          {busy ? ' …' : running ? ' Pause Timer' : ' Start Timer'}
        </button>

        {!taskId && (
          <p style={s.hint}>
            No task selected.{' '}
            <button style={s.linkBtn} onClick={() => navigate('/tasks')}>
              Pick one from Tasks
            </button>
          </p>
        )}
        {error && <p style={s.errorText}>{error}</p>}
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

  hint: {
    marginTop: 12,
    fontFamily: GEO,
    fontSize: 14,
    color: '#fff',
    textShadow: '0 1px 4px rgba(0,0,0,0.35)',
  },

  linkBtn: {
    background: 'none',
    border: 'none',
    color: '#FED430',
    fontFamily: GEO,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    textDecoration: 'underline',
    padding: 0,
  },

  errorText: {
    marginTop: 12,
    fontFamily: GEO,
    fontSize: 14,
    color: '#ffb4b4',
    textShadow: '0 1px 4px rgba(0,0,0,0.4)',
    maxWidth: 480,
    textAlign: 'center',
  },
};
