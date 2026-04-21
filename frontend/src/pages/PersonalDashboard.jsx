// Personal Dashboard — rebuilt with Layout wrapper
// Uses the Honey Bee / StudyLynk design system from theme.js + Layout.jsx

import { useState } from 'react';
import Layout from '../components/Layout';
import gnomeImg from '../assets/Gnome.png';
import { colors, fonts, shadow } from '../styles/theme';

const GEO = "'Georama', 'Inter', sans-serif";
const TEAL = '#5BC8E8';
const BORDER = 'rgba(255,255,255,0.14)';

// ── Mock data ────────────────────────────────────────────────────────────────
const USER = {
  name: 'Josh Kwon',
  initials: 'JK',
  rank: 12,
  xp: 2490,
  title: 'Engineer',
  bio: "I'm not sure what to put here yet but we will find something to put here",
  avatar: gnomeImg,
};

const RING_STATS = [
  { label: 'All Tasks',    value: 98, max: 100, color: '#7B6FE8' },
  { label: 'Academic',     value: 42, max: 100, color: '#9B6FE8' },
  { label: 'Professional', value: 37, max: 100, color: TEAL },
  { label: 'Clubs',        value: 12, max: 100, color: '#6FA8E8' },
];

const TASKS = [
  { name: 'Calc III Problem Set', date: 'March 24th, 2026',  time: '1 hour 10 min', category: 'Academics'    },
  { name: 'Internship Project',   date: 'March 20th, 2026',  time: '1 hour 5 min',  category: 'Professional' },
  { name: 'Event Graphic',        date: 'Feb 15th, 2026',    time: '30 min',         category: 'Clubs'        },
  { name: 'Uber PM Application',  date: 'Feb 8th, 2026',     time: '55 min',         category: 'Recruiting'   },
  { name: 'Data Structures HW',   date: 'Jan 30th, 2026',    time: '2 hours',        category: 'Academics'    },
];

const PAGE_SIZES = [5, 10, 20];

const CATEGORY_COLOR = {
  Academics:    '#9B6FE8',
  Professional: TEAL,
  Clubs:        '#6FA8E8',
  Recruiting:   colors.yellow,
};

// ── Ring component ────────────────────────────────────────────────────────────
function Ring({ value, max, color, label, size = 80 }) {
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const filled = (value / max) * circ;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={size/2} cy={size/2} r={r} fill="none"
            stroke="rgba(255,255,255,0.1)" strokeWidth={7} />
          <circle cx={size/2} cy={size/2} r={r} fill="none"
            stroke={color} strokeWidth={7}
            strokeDasharray={`${filled} ${circ}`}
            strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 0.6s ease' }}
          />
        </svg>
        <span style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: GEO, fontSize: size * 0.22, fontWeight: 600,
          color: colors.white,
        }}>{value}</span>
      </div>
      <span style={{ fontFamily: GEO, fontSize: 11, color: 'rgba(255,255,255,0.6)', textAlign: 'center' }}>
        {label}
      </span>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function PersonalDashboard() {
  const [pageSize, setPageSize] = useState(5);
  const [showSizeMenu, setShowSizeMenu] = useState(false);

  const visibleTasks = TASKS.slice(0, pageSize);

  return (
    <Layout>
      <div style={s.page}>

        {/* ── LEFT PANEL ── */}
        <aside style={s.leftPanel}>

          {/* Avatar */}
          <div style={s.avatarWrap}>
            <div style={s.avatarRing}>
              {USER.avatar
                ? <img src={USER.avatar} alt="" style={s.avatarImg} />
                : <div style={s.avatarInitials}>{USER.initials}</div>
              }
            </div>
          </div>

          {/* Name + rank */}
          <div style={s.userName}>{USER.name}</div>
          <div style={s.userRank}>Rank: {USER.rank}</div>

          {/* XP pill */}
          <div style={s.xpPill}>Experience Level: {USER.xp.toLocaleString()}</div>

          {/* Bio */}
          <div style={s.bioPill}>{USER.bio}</div>
        </aside>

        {/* ── RIGHT PANEL ── */}
        <main style={s.rightPanel}>

          {/* Ring stats row */}
          <div style={s.ringRow}>
            {RING_STATS.map(r => (
              <Ring key={r.label} value={r.value} max={r.max} color={r.color} label={r.label} size={88} />
            ))}
          </div>

          {/* Tasks table */}
          <div style={s.tableCard}>
            {/* Table header */}
            <div style={s.tableHeader}>
              <span style={s.tableTitle}>List of Tasks Completed</span>
              {/* Page size selector */}
              <div style={{ position: 'relative' }}>
                <button style={s.pageSizeBtn} onClick={() => setShowSizeMenu(v => !v)}>
                  Page Size: {pageSize} ▾
                </button>
                {showSizeMenu && (
                  <div style={s.dropdown}>
                    {PAGE_SIZES.map(n => (
                      <button key={n} style={{
                        ...s.dropItem,
                        background: n === pageSize ? 'rgba(91,200,232,0.15)' : 'transparent',
                        color: n === pageSize ? TEAL : 'rgba(255,255,255,0.8)',
                      }} onClick={() => { setPageSize(n); setShowSizeMenu(false); }}>
                        {n}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Column labels */}
            <div style={s.colRow}>
              <span style={{ flex: 3 }}>Task Name</span>
              <span style={{ flex: 2 }}>Date Completed</span>
              <span style={{ flex: 2 }}>Time Spent</span>
              <span style={{ flex: 2 }}>Task Category</span>
            </div>

            {/* Rows */}
            {visibleTasks.map((task, i) => (
              <div key={i} style={s.taskRow}>
                <span style={{ flex: 3, fontWeight: 500 }}>{task.name}</span>
                <span style={{ flex: 2, color: 'rgba(255,255,255,0.7)' }}>{task.date}</span>
                <span style={{ flex: 2, color: 'rgba(255,255,255,0.7)' }}>{task.time}</span>
                <span style={{ flex: 2 }}>
                  <span style={{
                    ...s.categoryTag,
                    background: (CATEGORY_COLOR[task.category] || '#888') + '22',
                    color: CATEGORY_COLOR[task.category] || 'rgba(255,255,255,0.7)',
                    border: `1px solid ${(CATEGORY_COLOR[task.category] || '#888')}55`,
                  }}>
                    {task.category}
                  </span>
                </span>
              </div>
            ))}
          </div>

        </main>
      </div>
    </Layout>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const s = {
  page: {
    display: 'flex',
    width: '100%',
    height: '100%',
    gap: 20,
    padding: '24px 28px',
    boxSizing: 'border-box',
    overflowY: 'auto',
  },

  // Left panel
  leftPanel: {
    width: 200,
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
  },
  avatarWrap: {
    marginBottom: 4,
  },
  avatarRing: {
    width: 110,
    height: 110,
    borderRadius: '50%',
    border: `3px solid ${BORDER}`,
    background: 'rgba(255,255,255,0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  avatarInitials: {
    fontFamily: GEO,
    fontSize: 32,
    fontWeight: 600,
    color: colors.white,
  },
  userName: {
    fontFamily: GEO,
    fontSize: 15,
    fontWeight: 600,
    color: colors.white,
    textAlign: 'center',
  },
  userRank: {
    fontFamily: GEO,
    fontSize: 12,
    color: 'rgba(255,255,255,0.55)',
    textAlign: 'center',
  },
  xpPill: {
    width: '100%',
    background: 'rgba(255,255,255,0.08)',
    border: `1px solid ${BORDER}`,
    borderRadius: 10,
    padding: '10px 12px',
    fontFamily: GEO,
    fontSize: 12,
    color: colors.white,
    textAlign: 'center',
    backdropFilter: 'blur(10px)',
  },
  bioPill: {
    width: '100%',
    background: 'rgba(255,255,255,0.06)',
    border: `1px solid ${BORDER}`,
    borderRadius: 10,
    padding: '12px 14px',
    fontFamily: GEO,
    fontSize: 11.5,
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 1.5,
    backdropFilter: 'blur(10px)',
  },

  // Right panel
  rightPanel: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    minWidth: 0,
  },
  ringRow: {
    display: 'flex',
    gap: 28,
    background: 'rgba(255,255,255,0.07)',
    border: `1px solid ${BORDER}`,
    borderRadius: 18,
    padding: '20px 28px',
    backdropFilter: 'blur(16px)',
    justifyContent: 'space-around',
  },

  // Table
  tableCard: {
    flex: 1,
    background: 'rgba(255,255,255,0.07)',
    border: `1px solid ${BORDER}`,
    borderRadius: 18,
    padding: '20px 24px',
    backdropFilter: 'blur(16px)',
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
  },
  tableHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  tableTitle: {
    fontFamily: GEO,
    fontSize: 15,
    fontWeight: 600,
    color: colors.white,
  },
  pageSizeBtn: {
    background: 'rgba(255,255,255,0.09)',
    border: `1px solid ${BORDER}`,
    borderRadius: 8,
    padding: '5px 12px',
    fontFamily: GEO,
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    cursor: 'pointer',
  },
  dropdown: {
    position: 'absolute',
    top: '110%',
    right: 0,
    background: 'rgba(10,30,40,0.92)',
    border: `1px solid ${BORDER}`,
    borderRadius: 8,
    overflow: 'hidden',
    zIndex: 10,
    backdropFilter: 'blur(20px)',
    minWidth: 80,
  },
  dropItem: {
    display: 'block',
    width: '100%',
    padding: '8px 16px',
    fontFamily: GEO,
    fontSize: 13,
    border: 'none',
    cursor: 'pointer',
    textAlign: 'left',
  },
  colRow: {
    display: 'flex',
    padding: '0 4px 8px',
    fontFamily: GEO,
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
    borderBottom: `1px solid ${BORDER}`,
    marginBottom: 4,
    gap: 8,
  },
  taskRow: {
    display: 'flex',
    alignItems: 'center',
    padding: '14px 4px',
    fontFamily: GEO,
    fontSize: 13,
    color: colors.white,
    borderBottom: `1px solid rgba(255,255,255,0.06)`,
    gap: 8,
  },
  categoryTag: {
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 500,
  },
};
