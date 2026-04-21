// Tasks Page — Figma node 2003:6
// Task list with add, complete, and delete actions.
// Sidebar nav matches PersonalDashboard layout.

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { colors, fonts, shadow } from '../styles/theme';

const INITIAL_TASKS = [
  { id: 1, text: 'Finish chapter 5 notes',      done: false, project: 'Personal progress' },
  { id: 2, text: 'Review Q2 resource plan',      done: true,  project: 'Resource planning' },
  { id: 3, text: 'Update team payroll sheet',    done: false, project: 'Team productivity' },
  { id: 4, text: 'Set weekly focus goals',       done: false, project: 'Personal progress' },
  { id: 5, text: 'Send project status report',   done: true,  project: 'Team productivity' },
];

const NAV_ITEMS = [
  { label: 'Dashboard', route: '/dashboard', icon: '🏠' },
  { label: 'Tasks',     route: '/tasks',     icon: '📋' },
  { label: 'Timer',     route: '/timer',     icon: '⏱' },
  { label: 'Calendar',  route: '/calendar',  icon: '📅' },
];

export default function TasksPage() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [draft, setDraft] = useState('');
  const [filter, setFilter] = useState('all'); // all | active | done

  const addTask = () => {
    const text = draft.trim();
    if (!text) return;
    setTasks((t) => [...t, { id: Date.now(), text, done: false, project: 'Personal progress' }]);
    setDraft('');
  };

  const toggle = (id) =>
    setTasks((t) => t.map((task) => task.id === id ? { ...task, done: !task.done } : task));

  const remove = (id) => setTasks((t) => t.filter((task) => task.id !== id));

  const visible = tasks.filter(
    (t) => filter === 'all' || (filter === 'done' ? t.done : !t.done)
  );

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
                background: route === '/tasks' ? 'rgba(254,212,48,0.15)' : 'transparent',
                borderLeft: route === '/tasks' ? `3px solid ${colors.yellow}` : '3px solid transparent',
              }}
              onClick={() => navigate(route)}
            >
              <span>{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main style={main}>
        <h1 style={pageTitle}>Tasks</h1>

        {/* Add task */}
        <div style={addRow}>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTask()}
            placeholder="Add a new task…"
            style={addInput}
          />
          <button style={addBtn} onClick={addTask}>+ Add</button>
        </div>

        {/* Filter tabs */}
        <div style={tabs}>
          {['all', 'active', 'done'].map((f) => (
            <button
              key={f}
              style={{
                ...tab,
                background: filter === f ? colors.yellow : 'rgba(45,82,96,0.25)',
                color: filter === f ? colors.black : colors.white,
              }}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Task list */}
        <div style={taskList}>
          {visible.length === 0 && (
            <p style={emptyMsg}>No tasks here — enjoy the break!</p>
          )}
          {visible.map(({ id, text, done, project }) => (
            <div key={id} style={{ ...taskRow, opacity: done ? 0.6 : 1 }}>
              <button style={checkCircle} onClick={() => toggle(id)}>
                {done ? '✓' : ''}
              </button>
              <div style={taskInfo}>
                <span style={{ ...taskText, textDecoration: done ? 'line-through' : 'none' }}>
                  {text}
                </span>
                <span style={taskProject}>{project}</span>
              </div>
              <button style={deleteBtn} onClick={() => remove(id)}>✕</button>
            </div>
          ))}
        </div>

        <p style={countMsg}>
          {tasks.filter((t) => !t.done).length} remaining · {tasks.filter((t) => t.done).length} completed
        </p>
      </main>
    </div>
  );
}

/* ── styles ───────────────────────────────────────────── */

const root = {
  display: 'flex', width: '100vw', height: '100vh',
  background: 'linear-gradient(135deg,#0d2a35 0%,#1a4a5a 40%,#2d5260 70%,#0d2a35 100%)',
  fontFamily: fonts.body, overflow: 'hidden',
};

const sidebar = {
  width: 220, flexShrink: 0, display: 'flex', flexDirection: 'column',
  padding: '28px 0',
  background: 'rgba(10,30,40,0.55)', backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)', borderRight: '1px solid rgba(255,255,255,0.1)',
};

const brand = {
  fontFamily: "'Albert Sans', sans-serif", fontWeight: 700, fontSize: 20,
  color: colors.white, padding: '0 24px 28px', textShadow: shadow.text,
};

const navList = { display: 'flex', flexDirection: 'column', gap: 4, flex: 1 };

const navItem = {
  display: 'flex', alignItems: 'center', gap: 12, padding: '12px 24px',
  fontFamily: fonts.body, fontSize: 15, color: colors.white,
  cursor: 'pointer', border: 'none', textAlign: 'left',
};

const main = { flex: 1, overflowY: 'auto', padding: '36px 40px', display: 'flex', flexDirection: 'column', gap: 20 };

const pageTitle = {
  margin: 0, fontFamily: "'Albert Sans', sans-serif", fontWeight: 400,
  fontSize: 28, color: colors.white, textShadow: shadow.text,
};

const addRow = { display: 'flex', gap: 12 };

const addInput = {
  flex: 1, height: 48, borderRadius: 10, border: `1px solid rgba(255,255,255,0.5)`,
  padding: '0 16px', fontFamily: fonts.body, fontSize: 16, color: colors.white,
  background: 'rgba(45,82,96,0.25)', backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)', outline: 'none',
};

const addBtn = {
  height: 48, padding: '0 24px', borderRadius: 10, background: colors.yellow,
  border: 'none', fontFamily: fonts.body, fontWeight: 600, fontSize: 15,
  color: colors.black, cursor: 'pointer', boxShadow: shadow.box,
};

const tabs = { display: 'flex', gap: 8 };

const tab = {
  height: 36, padding: '0 16px', borderRadius: 8, border: 'none',
  fontFamily: fonts.body, fontSize: 14, cursor: 'pointer', transition: 'background 0.15s',
};

const taskList = { display: 'flex', flexDirection: 'column', gap: 10 };

const taskRow = {
  display: 'flex', alignItems: 'center', gap: 14,
  background: 'rgba(45,82,96,0.22)', backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)', borderRadius: 12,
  padding: '14px 16px', boxShadow: shadow.box, transition: 'opacity 0.2s',
};

const checkCircle = {
  width: 28, height: 28, borderRadius: '50%', border: `2px solid ${colors.yellow}`,
  background: 'transparent', color: colors.yellow, fontSize: 14,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer', flexShrink: 0,
};

const taskInfo = { flex: 1, display: 'flex', flexDirection: 'column', gap: 3 };

const taskText = { fontSize: 15, color: colors.white };

const taskProject = { fontSize: 12, color: 'rgba(255,255,255,0.5)' };

const deleteBtn = {
  background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)',
  fontSize: 14, cursor: 'pointer', padding: '4px 6px',
};

const emptyMsg = { color: 'rgba(255,255,255,0.5)', fontSize: 15, textAlign: 'center', padding: '24px 0' };

const countMsg = { color: 'rgba(255,255,255,0.5)', fontSize: 13, textAlign: 'center' };
