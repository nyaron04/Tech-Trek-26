import { useState, useEffect } from 'react';
import Layout from '../components/Layout';

const GEO    = "'Georama', 'Inter', sans-serif";
const TEAL   = '#5BC8E8';
const BORDER = 'rgba(255,255,255,0.14)';

const TABS = ['Day', 'Week', 'Month', 'Year'];

function loadTasks() {
  try { return JSON.parse(localStorage.getItem('honeybee_tasks') || '[]'); }
  catch { return []; }
}

function getWeekBounds(now) {
  const day = now.getDay(); // 0=Sun … 6=Sat
  const diffToMon = (day === 0 ? -6 : 1 - day);
  const mon = new Date(now); mon.setDate(now.getDate() + diffToMon); mon.setHours(0, 0, 0, 0);
  const sun = new Date(mon); sun.setDate(mon.getDate() + 6); sun.setHours(23, 59, 59, 999);
  return [mon, sun];
}

function filterByTab(tasks, tab) {
  const now = new Date();
  return tasks.filter(t => {
    if (!t.date) return false;
    const d = new Date(t.date);
    if (tab === 'Day') {
      return d.getFullYear() === now.getFullYear() &&
             d.getMonth()    === now.getMonth()    &&
             d.getDate()     === now.getDate();
    }
    if (tab === 'Week') {
      const [mon, sun] = getWeekBounds(now);
      return d >= mon && d <= sun;
    }
    if (tab === 'Month') {
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    }
    if (tab === 'Year') {
      return d.getFullYear() === now.getFullYear();
    }
    return true;
  });
}

function CalendarIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ flexShrink: 0 }}>
      <rect x="1" y="2" width="11" height="10" rx="1.5" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" fill="none"/>
      <line x1="1" y1="5" x2="12" y2="5" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2"/>
      <line x1="4" y1="1" x2="4" y2="3.5" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="9" y1="1" x2="9" y2="3.5" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );
}

function CheckboxIcon({ checked, color }) {
  return (
    <div style={{
      width: 18,
      height: 18,
      borderRadius: 4,
      border: checked ? 'none' : '1.5px solid rgba(255,255,255,0.4)',
      background: checked ? (color || TEAL) : 'transparent',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      cursor: 'pointer',
    }}>
      {checked && (
        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
          <path d="M1 4L3.8 7L9 1" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </div>
  );
}

function DotsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="3" r="1.2" fill="rgba(255,255,255,0.4)"/>
      <circle cx="8" cy="8" r="1.2" fill="rgba(255,255,255,0.4)"/>
      <circle cx="8" cy="13" r="1.2" fill="rgba(255,255,255,0.4)"/>
    </svg>
  );
}

function formatDate() {
  return new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function ProgressPage() {
  const [activeTab, setActiveTab] = useState('Day');
  const [tasks, setTasks]         = useState([]);

  useEffect(() => {
    const raw = loadTasks();
    try {
      const names = JSON.parse(localStorage.getItem('completedTaskNames') || '[]');
      if (names.length > 0) {
        setTasks(raw.map(t => (!t.completed && names.includes(t.title)) ? { ...t, completed: true } : t));
        return;
      }
    } catch {}
    setTasks(raw);
  }, []);

  useEffect(() => {
    const apply = () => {
      try {
        const names = JSON.parse(localStorage.getItem('completedTaskNames') || '[]');
        if (names.length === 0) return;
        setTasks(prev => {
          const needsUpdate = prev.some(t => !t.completed && names.includes(t.title));
          if (!needsUpdate) return prev;
          return prev.map(t => (!t.completed && names.includes(t.title)) ? { ...t, completed: true } : t);
        });
      } catch {}
    };
    window.addEventListener('storage', apply);
    return () => window.removeEventListener('storage', apply);
  }, []);

  const filtered  = filterByTab(tasks, activeTab);
  const doneCount = filtered.filter(t => t.completed).length;
  const pct       = filtered.length ? Math.round((doneCount / filtered.length) * 100) : 0;

  const toggleTask = id => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  return (
    <Layout>
      <div style={s.page}>
        <div style={s.card}>

          {/* Header */}
          <div style={s.header}>
            <h2 style={s.title}>Today's Task Planning</h2>
            <div style={s.dateRow}>
              <CalendarIcon />
              <span style={s.dateText}>{formatDate()}</span>
            </div>

            {/* Progress bar */}
            <div style={s.progressWrap}>
              <div style={s.progressLabelRow}>
                <span style={s.progressLabel}>Progress</span>
                <span style={s.progressPct}>{pct}%</span>
              </div>
              <div style={s.track}>
                <div style={{ ...s.fill, width: `${pct}%` }} />
              </div>
            </div>
          </div>

          {/* Tab row */}
          <div style={s.tabRow}>
            {TABS.map((tab, i) => (
              <div key={tab} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                {i > 0 && <div style={s.tabDivider} />}
                <button
                  style={{ ...s.tab, ...(activeTab === tab ? s.tabActive : {}) }}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              </div>
            ))}
          </div>

          {/* Task list */}
          <div style={s.taskList}>
            {filtered.length === 0 ? (
              <div style={s.emptyMsg}>
                {tasks.length === 0
                  ? 'No tasks yet — add one from the Calendar page.'
                  : 'No tasks for this period.'}
              </div>
            ) : filtered.map(task => (
              <div key={task.id} style={s.taskRow}>
                <div onClick={() => toggleTask(task.id)} style={{ flexShrink: 0 }}>
                  <CheckboxIcon checked={!!task.completed} color={task.color} />
                </div>
                <span style={{
                  ...s.taskName,
                  textDecoration: task.completed ? 'line-through' : 'none',
                  opacity: task.completed ? 0.55 : 1,
                }}>
                  {task.title}
                </span>
                <div style={s.taskRight}>
                  {task.categoryLabel && (
                    <span style={{
                      ...s.pill,
                      background: (task.color || TEAL) + '28',
                      border: `1px solid ${(task.color || TEAL)}66`,
                      color: task.color || TEAL,
                    }}>
                      {task.categoryLabel}
                    </span>
                  )}
                  <button style={s.dotsBtn}><DotsIcon /></button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </Layout>
  );
}

const s = {
  page: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    padding: '28px 32px',
    boxSizing: 'border-box',
  },

  card: {
    width: '100%',
    maxWidth: 700,
    background: 'rgba(255,255,255,0.10)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: `1px solid ${BORDER}`,
    borderRadius: 20,
    padding: '24px 28px',
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
    boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
    maxHeight: 'calc(100vh - 120px)',
    overflowY: 'auto',
  },

  header: {
    marginBottom: 16,
  },

  title: {
    fontFamily: GEO,
    fontSize: 18,
    fontWeight: 700,
    color: '#fff',
    margin: '0 0 4px',
    letterSpacing: 0.2,
  },

  dateRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    marginBottom: 14,
  },

  dateText: {
    fontFamily: GEO,
    fontSize: 12,
    color: 'rgba(255,255,255,0.55)',
  },

  progressWrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: 5,
  },

  progressLabelRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  progressLabel: {
    fontFamily: GEO,
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
  },

  progressPct: {
    fontFamily: GEO,
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
  },

  track: {
    width: '100%',
    height: 8,
    borderRadius: 999,
    background: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },

  fill: {
    height: '100%',
    borderRadius: 999,
    background: TEAL,
    transition: 'width 0.4s ease',
  },

  tabRow: {
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(255,255,255,0.06)',
    border: `1px solid ${BORDER}`,
    borderRadius: 10,
    padding: '4px 8px',
    marginBottom: 16,
  },

  tabDivider: {
    width: 1,
    height: 18,
    background: 'rgba(255,255,255,0.15)',
    margin: '0 4px',
    flexShrink: 0,
  },

  tab: {
    background: 'transparent',
    border: 'none',
    fontFamily: GEO,
    fontSize: 13,
    fontWeight: 500,
    color: 'rgba(255,255,255,0.6)',
    cursor: 'pointer',
    padding: '6px 0',
    borderRadius: 7,
    transition: 'background 0.15s, color 0.15s',
    flex: 1,
    textAlign: 'center',
  },

  tabActive: {
    background: 'rgba(20,40,55,0.75)',
    color: '#fff',
    fontWeight: 600,
  },

  taskList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },

  emptyMsg: {
    fontFamily: GEO,
    fontSize: 13,
    color: 'rgba(255,255,255,0.3)',
    textAlign: 'center',
    padding: '24px 0',
  },

  taskRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    background: 'rgba(255,255,255,0.06)',
    border: `1px solid ${BORDER}`,
    borderRadius: 10,
    padding: '12px 14px',
  },

  taskName: {
    fontFamily: GEO,
    fontSize: 13,
    fontWeight: 500,
    color: '#fff',
    flex: 1,
    minWidth: 0,
  },

  taskRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flexShrink: 0,
  },

  pill: {
    display: 'inline-block',
    padding: '3px 12px',
    borderRadius: 20,
    fontFamily: GEO,
    fontSize: 11,
    fontWeight: 500,
  },

  dotsBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
  },
};
