import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authFetch, getUserId, useCurrentUser, __internal } from '../auth';
import bgMain   from '../assets/Background.png';
import bgForest from '../assets/Background forest.png';
import beeLogo  from '../assets/Honey Bee Logo.png';

const API_BASE = __internal.API_BASE;

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
      { label: 'Log Out', route: '/landing' },
    ],
  },
];


function fmtTimer(s) {
  const hh = String(Math.floor(s / 3600)).padStart(2, '0');
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
  const ss = String(s % 60).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
}

function getInitials(name) {
  if (!name) return '?';
  return name.trim().split(/\s+/).map(w => w[0].toUpperCase()).slice(0, 2).join('');
}

export default function Layout({ children }) {
  const navigate  = useNavigate();
  const { pathname } = useLocation();
  const currentUser = useCurrentUser();
  const displayName = currentUser?.displayName || currentUser?.name || '';
  const initials = getInitials(displayName);

  const [workingOn,  setWorkingOn]  = useState('');
  const [timerSecs,  setTimerSecs]  = useState(0);
  const [running,     setRunning]     = useState(false);
  const [timerId,     setTimerId]     = useState(null);
  const [timerStatus, setTimerStatus] = useState(null);
  const [timerBusy,   setTimerBusy]   = useState(false);
  const [timerError,  setTimerError]  = useState('');
  const intervalRef = useRef(null);

  const stopLocalTicker = useCallback(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  }, []);

  const startLocalTicker = useCallback((timer) => {
    stopLocalTicker();
    const startedAt = new Date(timer.startTime).getTime();
    const accumulated = timer.durationSeconds || 0;
    const sync = () => {
      setTimerSecs(accumulated + Math.max(0, Math.floor((Date.now() - startedAt) / 1000)));
    };
    sync();
    intervalRef.current = setInterval(sync, 1000);
  }, [stopLocalTicker]);

  useEffect(() => () => stopLocalTicker(), [stopLocalTicker]);

  useEffect(() => {
    if (running && timerSecs > 0 && timerSecs % 60 === 0) {
      const prev = parseInt(localStorage.getItem('honeybee_xp') || '0', 10);
      localStorage.setItem('honeybee_xp', prev + 1);
    }
  }, [timerSecs, running]);

  const loadActiveTimer = useCallback(async () => {
    const userId = getUserId();
    if (!userId) {
      stopLocalTicker();
      setTimerId(null);
      setTimerStatus(null);
      setTimerSecs(0);
      setRunning(false);
      return;
    }

    try {
      const res = await authFetch(`${API_BASE}/api/timer/active/${encodeURIComponent(userId)}`);
      if (!res.ok) throw new Error(`Active timer failed (${res.status})`);
      const timer = await res.json();
      if (timer?.id && timer?.status === 'RUNNING') {
        setTimerId(timer.id);
        setTimerStatus(timer.status);
        setRunning(true);
        startLocalTicker(timer);
      } else if (timer?.id && timer?.status === 'PAUSED') {
        stopLocalTicker();
        setTimerId(timer.id);
        setTimerStatus(timer.status);
        setTimerSecs(timer.durationSeconds || 0);
        setRunning(false);
      } else {
        stopLocalTicker();
        setTimerId(null);
        setTimerStatus(null);
        setTimerSecs(0);
        setRunning(false);
      }
    } catch (e) {
      setTimerError(e?.message || 'Could not load timer.');
    }
  }, [startLocalTicker, stopLocalTicker]);

  useEffect(() => {
    loadActiveTimer();
  }, [loadActiveTimer, currentUser?.id]);

  const getOrCreateTimerTask = async (userId) => {
    const categoryRes = await authFetch(`${API_BASE}/categories`, {
      method: 'POST',
      body: JSON.stringify({ userId, name: 'Timer', color: TEAL }),
    });
    if (!categoryRes.ok) {
      const body = await categoryRes.text();
      throw new Error(body || `Category failed (${categoryRes.status})`);
    }
    const category = await categoryRes.json();

    const taskTitle = workingOn.trim() || 'Focus Session';
    const taskRes = await authFetch(`${API_BASE}/tasks`, {
      method: 'POST',
      body: JSON.stringify({
        title: taskTitle,
        description: '',
        status: 'not completed',
        categoryId: category.id,
        userId,
        type: 'timer',
      }),
    });
    if (!taskRes.ok) {
      const body = await taskRes.text();
      throw new Error(body || `Task failed (${taskRes.status})`);
    }
    return taskRes.json();
  };

  const startBackendTimer = async () => {
    const userId = getUserId();
    if (!userId) throw new Error('Sign in to start the timer.');

    const task = await getOrCreateTimerTask(userId);
    const timerRes = await authFetch(`${API_BASE}/api/timer/start`, {
      method: 'POST',
      body: JSON.stringify({ userId, taskId: task.id }),
    });
    if (!timerRes.ok) {
      const body = await timerRes.text();
      await loadActiveTimer();
      throw new Error(body || `Start failed (${timerRes.status})`);
    }
    return timerRes.json();
  };

  const stopBackendTimer = async (idOverride = timerId) => {
    let idToStop = idOverride;
    if (!idToStop) {
      const userId = getUserId();
      if (!userId) return;
      const activeRes = await authFetch(`${API_BASE}/api/timer/active/${encodeURIComponent(userId)}`);
      if (!activeRes.ok) {
        throw new Error(`Active timer failed (${activeRes.status})`);
      }
      const active = await activeRes.json();
      idToStop = active?.id;
    }
    if (!idToStop) return;

    const res = await authFetch(`${API_BASE}/api/timer/stop/${idToStop}`, {
      method: 'POST',
    });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(body || `Stop failed (${res.status})`);
    }
    return res.json();
  };

  const markTaskComplete = async (taskId) => {
    if (!taskId) return;
    const res = await authFetch(`${API_BASE}/tasks/${taskId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status: 'completed' }),
    });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(body || `Task completion failed (${res.status})`);
    }
  };

  const pauseBackendTimer = async () => {
    if (!timerId) return null;
    const res = await authFetch(`${API_BASE}/api/timer/pause/${timerId}`, {
      method: 'POST',
    });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(body || `Pause failed (${res.status})`);
    }
    return res.json();
  };

  const resumeBackendTimer = async () => {
    if (!timerId) return null;
    const res = await authFetch(`${API_BASE}/api/timer/resume/${timerId}`, {
      method: 'POST',
    });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(body || `Resume failed (${res.status})`);
    }
    return res.json();
  };

  const toggleTimer = async () => {
    if (timerBusy) return;
    setTimerBusy(true);
    setTimerError('');

    try {
      if (running) {
        const timer = await pauseBackendTimer();
        stopLocalTicker();
        setRunning(false);
        setTimerStatus('PAUSED');
        setTimerSecs(timer?.durationSeconds ?? timerSecs);
        return;
      }

      if (timerStatus === 'PAUSED') {
        const timer = await resumeBackendTimer();
        if (!timer) return;
        setTimerId(timer.id);
        setTimerStatus(timer.status);
        setRunning(true);
        startLocalTicker(timer);
        return;
      }

      const timer = await startBackendTimer();
      setTimerId(timer.id);
      setTimerStatus(timer.status);
      setRunning(true);
      startLocalTicker(timer);
    } catch (e) {
      setTimerError(e?.message || 'Timer failed.');
    } finally {
      setTimerBusy(false);
    }
  };

  const finishTimerAndNavigate = async () => {
    if (timerBusy) return;
    setTimerBusy(true);
    setTimerError('');
    try {
      const stoppedTimer = await stopBackendTimer();
      await markTaskComplete(stoppedTimer?.taskId);
      stopLocalTicker();
      setRunning(false);
      setTimerId(null);
      setTimerStatus(null);
      setTimerSecs(0);
      navigate('/task-completed');
    } catch (e) {
      setTimerError(e?.message || 'Could not finish timer.');
    } finally {
      setTimerBusy(false);
    }
  };

  const resetTimer = async () => {
    if (timerBusy) return;
    setTimerBusy(true);
    setTimerError('');
    try {
      if (timerId) {
        const res = await authFetch(`${API_BASE}/api/timer/reset/${timerId}`, { method: 'POST' });
        if (!res.ok) {
          const body = await res.text();
          throw new Error(body || `Reset failed (${res.status})`);
        }
      }
      stopLocalTicker();
      setRunning(false);
      setTimerId(null);
      setTimerStatus(null);
      setTimerSecs(0);
    } catch (e) {
      setTimerError(e?.message || 'Could not reset timer.');
    } finally {
      setTimerBusy(false);
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
            <div style={s.avatar}>{initials}</div>
            <span style={s.profileName}>{displayName || 'User'}</span>
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

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div
              style={{
                ...s.timerBox,
                opacity: timerBusy ? 0.65 : 1,
                cursor: timerBusy ? 'wait' : 'pointer',
              }}
              onClick={toggleTimer}
              title={timerBusy ? 'Syncing timer...' : running ? 'Pause timer' : timerStatus === 'PAUSED' ? 'Resume timer' : 'Start timer'}
            >
              <span style={s.timerIcon}>{timerBusy ? '…' : running ? '⏸' : '▶'}</span>
              <span style={s.timerTime}>{fmtTimer(timerSecs)}</span>
            </div>
            <button
              style={s.resetBtn}
              onClick={resetTimer}
              title="Reset timer"
            >
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M11.5 6.5A5 5 0 1 1 9 2.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M9 0.5v2h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          {timerError && <span style={s.timerError}>{timerError}</span>}

          <button style={s.doneBtn} onClick={finishTimerAndNavigate} title="Finish timer and mark task complete">
            ✓
          </button>
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
  timerError: {
    maxWidth: 180,
    color: '#ff8a8a',
    fontSize: 11,
    lineHeight: 1.2,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  resetBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(255,255,255,0.15)',
    color: 'rgba(255,255,255,0.5)',
    cursor: 'pointer',
    flexShrink: 0,
    transition: 'background 0.15s, color 0.15s',
  },
  doneBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 36,
    padding: '0 14px',
    borderRadius: 20,
    background: 'rgba(255,255,255,0.09)',
    border: '1px solid rgba(255,255,255,0.2)',
    color: '#fff',
    fontSize: 16,
    cursor: 'pointer',
    flexShrink: 0,
    transition: 'background 0.15s',
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
