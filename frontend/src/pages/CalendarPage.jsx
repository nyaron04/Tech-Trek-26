import { useState, useRef, useEffect } from 'react';
import Layout from '../components/Layout';
import { getCurrentUser, getUserId } from '../auth';

const GEO    = "'Georama', 'Inter', sans-serif";
const TEAL   = '#5BC8E8';
const BORDER = 'rgba(255,255,255,0.14)';
const BLR    = 'blur(18px)';

function getWeekDates(offset = 0) {
  const now = new Date();
  const day = now.getDay();
  const mon = new Date(now);
  mon.setDate(now.getDate() - ((day + 6) % 7) + offset * 7);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(mon);
    d.setDate(mon.getDate() + i);
    return d;
  });
}

function addCategory(userId, name, color) {
  const Category = { 
    userId: userId, 
    name: name, 
    color: color
  };
  const response = fetch('http://localhost:8080/api/categories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(Category),
  });

  console.log('Adding category:', Category);
  console.log('Server response:', response);
}

const HOURS     = Array.from({ length: 16 }, (_, i) => i + 6); // 6 AM – 9 PM
const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const INIT_CATEGORIES = [
  { label: 'Work',     color: TEAL,      count: 3 },
  { label: 'Personal', color: '#7BDE8A', count: 2 },
  { label: 'Study',    color: '#E8C85B', count: 5 },
  { label: 'Health',   color: '#E87B5B', count: 1 },
  { label: 'Creative', color: '#BE7BE8', count: 2 },
];

const COLOR_ROTATION = [TEAL, '#7BDE8A', '#E8C85B', '#E87B5B', '#BE7BE8', '#E85B9A', '#5BE8B4'];

// Keyed "dayIndex-hour" (0 = Mon … 6 = Sun)
const WEEK_EVENTS = {
  '0-10': { title: 'Deep Work',      color: '#7BDE8A' },
  '1-15': { title: 'Lunch Meeting',  color: '#E87B5B' },
  '2-9':  { title: 'Team Sync',      color: TEAL      },
  '2-14': { title: 'Project Review', color: '#E8C85B' },
  '4-11': { title: 'Study Session',  color: '#BE7BE8' },
  '6-13': { title: 'Planning',       color: '#E87B5B' },
};

const INIT_CHAT = [
  { from: 'bot',  text: "Hi! I'm Bumble 🐝 How can I help you today?" },
  { from: 'user', text: 'Can you schedule my study session for tomorrow?' },
  { from: 'bot',  text: "Done! I've added a 2-hour study block at 9 AM tomorrow." },
];

function fmtHour(h) {
  if (h === 12) return '12 PM';
  return h < 12 ? `${h} AM` : `${h - 12} PM`;
}

export default function CalendarPage() {
  const [weekOffset,    setWeekOffset]    = useState(0);
  const [chatInput,     setChatInput]     = useState('');
  const [msgs,          setMsgs]          = useState(INIT_CHAT);
  const [categories,    setCategories]    = useState(INIT_CATEGORIES);
  const [showAddInput,  setShowAddInput]  = useState(false);
  const [newCatName,    setNewCatName]    = useState('');
  const [hoveredCat,    setHoveredCat]    = useState(null);
  const chatEndRef = useRef(null);

  const deleteCategory = label => {
    setCategories(prev => prev.filter(c => c.label !== label));
  };

  const weekDates = getWeekDates(weekOffset);
  const todayISO  = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs]);

  const sendChat = () => {
    if (!chatInput.trim()) return;
    const text = chatInput;
    setMsgs(prev => [
      ...prev,
      { from: 'user', text },
      { from: 'bot', text: "Got it! I'll update your schedule right away." },
    ]);
    setChatInput('');
  };

  return (
    <Layout>
      {/* ── WEEKLY CALENDAR ── */}
      <main style={s.calArea}>
        <div style={s.weekNav}>
          <button style={s.arrowBtn} onClick={() => setWeekOffset(o => o - 1)}>‹</button>
          <span style={s.weekRange}>
            {weekDates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            {' – '}
            {weekDates[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
          <button style={s.arrowBtn} onClick={() => setWeekOffset(o => o + 1)}>›</button>
          <button style={s.todayBtn} onClick={() => setWeekOffset(0)}>Today</button>
        </div>

        <div style={s.calPanel}>
          {/* Day headers */}
          <div style={s.dayHeaderRow}>
            <div style={s.timeCorner} />
            {weekDates.map((date, di) => {
              const iso     = date.toISOString().slice(0, 10);
              const isToday = iso === todayISO;
              return (
                <div
                  key={di}
                  style={{
                    ...s.dayHeader,
                    background: isToday ? 'rgba(91,200,232,0.18)' : 'transparent',
                  }}
                >
                  <span style={s.dayLabel}>{DAY_LABELS[di]}</span>
                  <span style={{ ...s.dayNum, color: isToday ? TEAL : 'rgba(255,255,255,0.9)' }}>
                    {date.getDate()}
                  </span>
                  {isToday && <div style={s.todayDot} />}
                </div>
              );
            })}
          </div>

          {/* Scrollable time grid */}
          <div style={s.gridScroll}>
            <div style={s.grid}>
              {HOURS.flatMap(hour => [
                <div key={`t${hour}`} style={s.timeLabel}>{fmtHour(hour)}</div>,
                ...weekDates.map((_, di) => {
                  const ev = WEEK_EVENTS[`${di}-${hour}`];
                  return (
                    <div key={`c${di}-${hour}`} style={s.gridCell}>
                      {ev && (
                        <div
                          style={{
                            ...s.eventBlock,
                            background:  ev.color + '25',
                            borderLeft: `3px solid ${ev.color}`,
                          }}
                        >
                          <span style={{ ...s.eventText, color: ev.color }}>{ev.title}</span>
                        </div>
                      )}
                    </div>
                  );
                }),
              ])}
            </div>
          </div>
        </div>
      </main>

      {/* ── RIGHT PANEL ── */}
      <aside style={s.rightPanel}>
        {/* Task Categories */}
        <div style={s.card}>
          <div style={s.cardTitle}>Task Categories</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {categories.map(({ label, color, count }) => (
              <div
                key={label}
                style={s.catRow}
                onMouseEnter={() => setHoveredCat(label)}
                onMouseLeave={() => setHoveredCat(null)}
              >
                <div style={{ ...s.catDot, background: color }} />
                <span style={s.catLabel}>{label}</span>
                <span style={{ ...s.catCount, color }}>{count}</span>
                <button
                  style={{ ...s.catDeleteBtn, opacity: hoveredCat === label ? 1 : 0 }}
                  onClick={() => deleteCategory(label)}
                >×</button>
              </div>
            ))}
          </div>
          {showAddInput && (
            <div style={s.catInputRow}>
              <input
                style={s.catInput}
                placeholder="Category name"
                value={newCatName}
                autoFocus
                onChange={e => setNewCatName(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') addCategory(getUserId(), newCatName.trim(), COLOR_ROTATION[categories.length % COLOR_ROTATION.length]);
                  if (e.key === 'Escape') { setShowAddInput(false); setNewCatName(''); }
                }}
              />
              <button style={s.catConfirmBtn} >✓</button>
            </div>
          )}
          <button
            style={s.addTaskBtn}
            onClick={() => setShowAddInput(v => !v)}
          >
            + Add Category
          </button>
        </div>

        {/* Bumble Assistant */}
        <div style={s.chatCard}>
          <div style={s.cardTitle}>🐝 Bumble Assistant</div>
          <div style={s.chatMsgs}>
            {msgs.map((msg, i) => (
              <div
                key={i}
                style={{
                  ...s.chatBubble,
                  alignSelf: msg.from === 'user' ? 'flex-end' : 'flex-start',
                  background: msg.from === 'user'
                    ? 'rgba(91,200,232,0.22)'
                    : 'rgba(255,255,255,0.09)',
                }}
              >
                {msg.text}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <div style={s.chatRow}>
            <input
              style={s.chatInput}
              placeholder="Ask Bumble..."
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendChat()}
            />
            <button style={s.sendBtn} onClick={sendChat}>↑</button>
          </div>
        </div>
      </aside>
    </Layout>
  );
}

/* ── Styles ── */
const s = {
  /* Calendar main area */
  calArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    padding: '14px 12px',
    gap: 10,
  },
  weekNav: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    flexShrink: 0,
  },
  arrowBtn: {
    width: 30,
    height: 30,
    borderRadius: 7,
    background: 'rgba(255,255,255,0.07)',
    border: `1px solid ${BORDER}`,
    color: 'rgba(255,255,255,0.8)',
    fontSize: 20,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: 1,
    padding: 0,
  },
  weekRange: {
    fontFamily: GEO,
    fontSize: 14,
    fontWeight: 500,
    color: 'rgba(255,255,255,0.88)',
  },
  todayBtn: {
    padding: '5px 14px',
    borderRadius: 7,
    background: 'rgba(91,200,232,0.18)',
    border: `1px solid rgba(91,200,232,0.5)`,
    color: TEAL,
    fontFamily: GEO,
    fontSize: 12,
    fontWeight: 500,
    cursor: 'pointer',
  },
  calPanel: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    background: 'rgba(255,255,255,0.05)',
    backdropFilter: BLR,
    WebkitBackdropFilter: BLR,
    border: `1px solid ${BORDER}`,
    borderRadius: 14,
    overflow: 'hidden',
  },
  dayHeaderRow: {
    display: 'grid',
    gridTemplateColumns: '54px repeat(7, 1fr)',
    flexShrink: 0,
    borderBottom: `1px solid ${BORDER}`,
    background: 'rgba(255,255,255,0.04)',
  },
  timeCorner: {
    borderRight: `1px solid ${BORDER}`,
  },
  dayHeader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '10px 4px 8px',
    borderRight: `1px solid rgba(255,255,255,0.07)`,
    gap: 2,
  },
  dayLabel: {
    fontSize: 10,
    fontWeight: 600,
    color: 'rgba(255,255,255,0.45)',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  dayNum: {
    fontSize: 19,
    fontWeight: 600,
    lineHeight: 1.2,
  },
  todayDot: {
    width: 5,
    height: 5,
    borderRadius: '50%',
    background: TEAL,
    marginTop: 2,
  },
  gridScroll: {
    flex: 1,
    overflowY: 'auto',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '54px repeat(7, 1fr)',
  },
  timeLabel: {
    padding: '6px 6px 0',
    height: 52,
    display: 'flex',
    alignItems: 'flex-start',
    fontSize: 10,
    color: 'rgba(255,255,255,0.38)',
    borderRight: `1px solid ${BORDER}`,
    borderBottom: `1px solid rgba(255,255,255,0.05)`,
    flexShrink: 0,
    letterSpacing: 0.3,
  },
  gridCell: {
    height: 52,
    borderRight: `1px solid rgba(255,255,255,0.055)`,
    borderBottom: `1px solid rgba(255,255,255,0.05)`,
    position: 'relative',
    padding: 2,
  },
  eventBlock: {
    borderRadius: 4,
    padding: '4px 7px',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  },
  eventText: {
    fontSize: 11,
    fontWeight: 500,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },

  /* Right panel */
  rightPanel: {
    width: 232,
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    padding: '14px 10px',
    background: 'rgba(255,255,255,0.06)',
    backdropFilter: BLR,
    WebkitBackdropFilter: BLR,
    borderLeft: `1px solid ${BORDER}`,
    overflowY: 'auto',
  },
  card: {
    background: 'rgba(255,255,255,0.07)',
    border: `1px solid ${BORDER}`,
    borderRadius: 13,
    padding: '13px 14px',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    flexShrink: 0,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: 600,
    color: 'rgba(255,255,255,0.9)',
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    marginBottom: 2,
  },
  catRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  catDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    flexShrink: 0,
  },
  catLabel: {
    flex: 1,
    fontSize: 13,
    color: 'rgba(255,255,255,0.78)',
  },
  catCount: {
    fontSize: 12,
    fontWeight: 600,
  },
  addTaskBtn: {
    marginTop: 2,
    padding: '8px',
    borderRadius: 8,
    background: 'rgba(91,200,232,0.16)',
    border: `1px solid rgba(91,200,232,0.5)`,
    color: TEAL,
    fontFamily: GEO,
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    width: '100%',
    transition: 'background 0.15s',
  },
  catDeleteBtn: {
    background: 'none',
    border: 'none',
    color: 'rgba(255,255,255,0.55)',
    cursor: 'pointer',
    fontSize: 15,
    lineHeight: 1,
    padding: '0 2px',
    transition: 'opacity 0.15s',
    flexShrink: 0,
  },
  catInputRow: {
    display: 'flex',
    gap: 6,
    alignItems: 'center',
  },
  catInput: {
    flex: 1,
    background: 'rgba(255,255,255,0.09)',
    border: `1px solid rgba(91,200,232,0.4)`,
    borderRadius: 7,
    padding: '5px 8px',
    fontFamily: GEO,
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    outline: 'none',
    minWidth: 0,
  },
  catConfirmBtn: {
    width: 26,
    height: 26,
    borderRadius: 6,
    background: 'rgba(91,200,232,0.25)',
    border: `1px solid rgba(91,200,232,0.5)`,
    color: TEAL,
    fontSize: 13,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    padding: 0,
  },
  chatCard: {
    flex: 1,
    background: 'rgba(255,255,255,0.07)',
    border: `1px solid ${BORDER}`,
    borderRadius: 13,
    padding: '13px 14px',
    display: 'flex',
    flexDirection: 'column',
    gap: 9,
    minHeight: 200,
    overflow: 'hidden',
  },
  chatMsgs: {
    flex: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    minHeight: 0,
  },
  chatBubble: {
    maxWidth: '92%',
    padding: '8px 11px',
    borderRadius: 10,
    fontSize: 12,
    color: 'rgba(255,255,255,0.88)',
    lineHeight: 1.45,
  },
  chatRow: {
    display: 'flex',
    gap: 6,
    flexShrink: 0,
  },
  chatInput: {
    flex: 1,
    background: 'rgba(255,255,255,0.09)',
    border: `1px solid ${BORDER}`,
    borderRadius: 8,
    padding: '7px 10px',
    fontFamily: GEO,
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    outline: 'none',
    minWidth: 0,
  },
  sendBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    background: TEAL,
    border: 'none',
    color: '#fff',
    fontSize: 16,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    padding: 0,
  },
};
