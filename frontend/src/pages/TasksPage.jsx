import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Layout from '../components/Layout';
import { yellowBtn } from '../styles/theme';
import { authFetch, getUserId, __internal } from '../auth';

const API_BASE = __internal.API_BASE;

const GEO = "'Georama', 'Inter', sans-serif";
const WHITE = '#fff';
const WHITE60 = 'rgba(255,255,255,0.6)';
const WHITE40 = 'rgba(255,255,255,0.4)';
const WHITE15 = 'rgba(255,255,255,0.15)';
const WHITE08 = 'rgba(255,255,255,0.08)';
const BORDER = 'rgba(255,255,255,0.25)';

function colorWithAlpha(hex, alpha) {
  if (!hex) return `rgba(91,200,232,${alpha})`;
  const h = hex.replace(/^#/, '');
  const digits = /^[0-9a-fA-F]{6}/.test(h) ? h.slice(0, 6) : null;
  if (!digits) return `rgba(91,200,232,${alpha})`;
  const r = parseInt(digits.slice(0, 2), 16);
  const g = parseInt(digits.slice(2, 4), 16);
  const b = parseInt(digits.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

const TYPES = ['Task', 'Project', 'Homework'];

// Color palette assigned to new categories on a round-robin basis.
const CAT_COLORS = ['#5BC8E8', '#FED430', '#7BDE8A', '#E89C5B', '#C85BE8', '#FF8A8A'];

function ClockIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="11" r="9.5" stroke={WHITE60} strokeWidth="1.5" />
      <line x1="11" y1="6" x2="11" y2="11" stroke={WHITE60} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="11" y1="11" x2="14.5" y2="13.5" stroke={WHITE60} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function TargetIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="11" r="9.5" stroke={WHITE60} strokeWidth="1.5" />
      <circle cx="11" cy="11" r="5.5" stroke={WHITE60} strokeWidth="1.5" />
      <circle cx="11" cy="11" r="2" fill={WHITE60} />
    </svg>
  );
}

function CalendarBtnIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="1.5" y="3" width="15" height="13.5" rx="2" stroke={WHITE} strokeWidth="1.5" />
      <line x1="1.5" y1="7.5" x2="16.5" y2="7.5" stroke={WHITE} strokeWidth="1.5" />
      <line x1="5.5" y1="1.5" x2="5.5" y2="4.5" stroke={WHITE} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="12.5" y1="1.5" x2="12.5" y2="4.5" stroke={WHITE} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function fmtDate(date) {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).replace(/(\w+), (\w+) (\d+)/, (_, wd, mo, d) => {
    const suffix = ['th','st','nd','rd'][((d % 100 - 11) % 10) < 4 && (d % 100 - 11) >= 0 ? 0 : [1,2,3].includes(d % 10) ? d % 10 : 0] || 'th';
    return `${wd}, ${mo} ${d}${suffix}`;
  });
}

function fmtTime(date) {
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    .toLowerCase().replace(' ', '');
}

export default function TasksPage() {
  const navigate = useNavigate();
  const [taskType, setTaskType] = useState('Task');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setHours(19, 30, 0, 0);
    return d;
  });
  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    d.setHours(20, 30, 0, 0);
    return d;
  });
  const [deadline, setDeadline] = useState(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showDeadlinePicker, setShowDeadlinePicker] = useState(false);
  const startPickerRef = useRef(null);
  const deadlinePickerRef = useRef(null);

  const [tasks, setTasks] = useState([]);
  const [tasksError, setTasksError] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [showNewCatInput, setShowNewCatInput] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [creatingCat, setCreatingCat] = useState(false);
  const [completedNames, setCompletedNames] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem('completedTaskNames') || '[]')); }
    catch { return new Set(); }
  });
  const [hoveredDelete, setHoveredDelete] = useState(null);

  const dateLabel = fmtDate(startDate);
  const timeLabel = `${fmtTime(startDate)} – ${fmtTime(endDate)}`;
  const deadlineLabel = deadline ? fmtDate(deadline) : 'Add deadline';

  const loadTasks = useCallback(async () => {
    const userId = getUserId();
    if (!userId) {
      setTasks([]);
      setTasksError('Sign in to see your tasks.');
      return;
    }
    setTasksError('');
    try {
      const res = await authFetch(`${API_BASE}/tasks`);
      if (!res.ok) throw new Error(`Failed to load tasks (${res.status})`);
      const all = await res.json();
      setTasks(all.filter(t => t.userId === userId));
    } catch (e) {
      setTasksError(e?.message || 'Could not load tasks.');
    }
  }, []);

  const loadCategories = useCallback(async () => {
    const userId = getUserId();
    if (!userId) {
      setCategories([]);
      return;
    }
    try {
      const res = await authFetch(`${API_BASE}/categories?userId=${encodeURIComponent(userId)}`);
      if (!res.ok) throw new Error(`Failed to load categories (${res.status})`);
      const list = await res.json();
      setCategories(list);
      setSelectedCategoryId(prev => {
        if (prev && list.some(c => c.id === prev)) return prev;
        return list[0]?.id ?? null;
      });
    } catch (e) {
      // Non-fatal: form will warn when the user tries to submit.
      console.error('loadCategories failed:', e);
    }
  }, []);

  useEffect(() => {
    loadTasks();
    loadCategories();
  }, [loadTasks, loadCategories]);

  useEffect(() => {
    const sync = () => {
      try {
        setCompletedNames(new Set(JSON.parse(localStorage.getItem('completedTaskNames') || '[]')));
      } catch {}
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  async function handleCreateCategory() {
    const userId = getUserId();
    if (!userId) {
      setFormError('Sign in to create a category.');
      return;
    }
    const name = newCatName.trim();
    if (!name) return;

    setCreatingCat(true);
    setFormError('');
    try {
      const res = await authFetch(`${API_BASE}/categories`, {
        method: 'POST',
        body: JSON.stringify({
          userId,
          name,
          color: CAT_COLORS[categories.length % CAT_COLORS.length],
        }),
      });
      if (!res.ok) {
        const body = await res.text();
        throw new Error(body || `Create category failed (${res.status})`);
      }
      const saved = await res.json();
      setCategories(prev => {
        if (prev.some(c => c.id === saved.id)) return prev;
        return [...prev, saved];
      });
      setSelectedCategoryId(saved.id);
      setNewCatName('');
      setShowNewCatInput(false);
    } catch (e) {
      setFormError(e?.message || 'Could not create category.');
    } finally {
      setCreatingCat(false);
    }
  }

  async function handleAddTask() {
    const userId = getUserId();
    if (!userId) {
      setFormError('Sign in to create a task.');
      return;
    }
    if (!title.trim()) {
      setFormError('Title is required.');
      return;
    }
    if (!selectedCategoryId) {
      setFormError('Pick a category (or add one with "+ New") before saving.');
      return;
    }
    setFormError('');
    setSubmitting(true);
    try {
      const res = await authFetch(`${API_BASE}/tasks`, {
        method: 'POST',
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          status: 'not completed',
          categoryId: selectedCategoryId,
          userId,
          type: taskType.toLowerCase(),
        }),
      });
      if (!res.ok) {
        const body = await res.text();
        throw new Error(body || `Add failed (${res.status})`);
      }
      setTitle('');
      setDescription('');
      await loadTasks();
    } catch (e) {
      setFormError(e?.message || 'Could not create task.');
    } finally {
      setSubmitting(false);
    }
  }

  function categoryById(id) {
    return categories.find(c => c.id === id);
  }

  function deleteTask(taskId) {
    try {
      const stored = JSON.parse(localStorage.getItem('honeybee_tasks') || '[]');
      localStorage.setItem('honeybee_tasks', JSON.stringify(stored.filter(t => t.id !== taskId)));
    } catch {}
    setTasks(prev => prev.filter(t => t.id !== taskId));
  }

  function startTimerFor(task) {
    const cat = categoryById(task.categoryId);
    localStorage.setItem('honeybee_active_task', JSON.stringify({
      taskName: task.title,
      taskCategory: cat?.name || 'Uncategorized',
    }));
    navigate('/timer', {
      state: { taskId: task.id, taskTitle: task.title },
    });
  }

  return (
    <Layout>
      <style>{`
        .tasks-datepicker-wrap .react-datepicker-popper { z-index: 100; }
        .tasks-datepicker-wrap .react-datepicker {
          font-family: ${GEO};
          background: rgba(20,50,65,0.95);
          border: 1px solid ${BORDER};
          border-radius: 14px;
          color: ${WHITE};
          backdrop-filter: blur(20px);
        }
        .tasks-datepicker-wrap .react-datepicker__header {
          background: rgba(255,255,255,0.08);
          border-bottom: 1px solid ${BORDER};
          border-radius: 14px 14px 0 0;
        }
        .tasks-datepicker-wrap .react-datepicker__current-month,
        .tasks-datepicker-wrap .react-datepicker__day-name,
        .tasks-datepicker-wrap .react-datepicker-time__header {
          color: ${WHITE};
        }
        .tasks-datepicker-wrap .react-datepicker__day { color: ${WHITE}; border-radius: 6px; }
        .tasks-datepicker-wrap .react-datepicker__day:hover { background: rgba(255,255,255,0.15); }
        .tasks-datepicker-wrap .react-datepicker__day--selected,
        .tasks-datepicker-wrap .react-datepicker__day--keyboard-selected { background: rgba(91,200,232,0.5); }
        .tasks-datepicker-wrap .react-datepicker__time-container { border-left: 1px solid ${BORDER}; }
        .tasks-datepicker-wrap .react-datepicker__time { background: rgba(20,50,65,0.95); color: ${WHITE}; }
        .tasks-datepicker-wrap .react-datepicker__time-list-item { color: ${WHITE}; }
        .tasks-datepicker-wrap .react-datepicker__time-list-item:hover { background: rgba(255,255,255,0.15) !important; }
        .tasks-datepicker-wrap .react-datepicker__time-list-item--selected { background: rgba(91,200,232,0.5) !important; }
        .tasks-datepicker-wrap .react-datepicker__navigation-icon::before { border-color: ${WHITE60}; }
        textarea::placeholder { color: ${WHITE40}; }
        textarea:focus { outline: none; }
      `}</style>

      <main style={s.main}>
        <div style={s.card}>
          {/* Title input */}
          <input
            style={s.titleInput}
            placeholder="What are you up to?"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <div style={s.divider} />

          {/* Category picker */}
          <div style={s.catRow}>
            <span style={s.catLabel}>Category</span>
            <div style={s.catPills}>
              {categories.map(cat => {
                const active = cat.id === selectedCategoryId;
                const color = cat.color || '#5BC8E8';
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategoryId(cat.id)}
                    style={{
                      ...s.catPill,
                      background: active ? `${color}33` : 'transparent',
                      border: `1px solid ${active ? color : BORDER}`,
                      color: active ? WHITE : WHITE60,
                    }}
                  >
                    <span style={{ ...s.catDot, background: color }} />
                    {cat.name}
                  </button>
                );
              })}

              {showNewCatInput ? (
                <span style={s.newCatWrap}>
                  <input
                    autoFocus
                    value={newCatName}
                    onChange={e => setNewCatName(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') handleCreateCategory();
                      if (e.key === 'Escape') { setShowNewCatInput(false); setNewCatName(''); }
                    }}
                    placeholder="New category"
                    style={s.newCatInput}
                    disabled={creatingCat}
                  />
                  <button
                    type="button"
                    onClick={handleCreateCategory}
                    style={s.newCatSave}
                    disabled={creatingCat || !newCatName.trim()}
                  >
                    {creatingCat ? '…' : 'Add'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowNewCatInput(false); setNewCatName(''); }}
                    style={s.newCatCancel}
                    disabled={creatingCat}
                  >
                    ✕
                  </button>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowNewCatInput(true)}
                  style={s.addCatBtn}
                >
                  + New
                </button>
              )}
            </div>
          </div>

          {/* Date/time row */}
          <div
            style={s.infoRow}
            onClick={() => setShowStartPicker(v => !v)}
          >
            <ClockIcon />
            <div style={s.infoText}>
              <span style={s.infoMain}>{dateLabel}&nbsp;&nbsp;&nbsp;{timeLabel}</span>
              <span style={s.infoSub}>Does not repeat</span>
            </div>
            <div className="tasks-datepicker-wrap" style={s.pickerWrap} onClick={e => e.stopPropagation()}>
              {showStartPicker && (
                <DatePicker
                  ref={startPickerRef}
                  selected={startDate}
                  onChange={date => {
                    if (date) {
                      const diff = endDate - startDate;
                      setStartDate(date);
                      setEndDate(new Date(date.getTime() + diff));
                    }
                    setShowStartPicker(false);
                  }}
                  showTimeSelect
                  inline
                  timeIntervals={30}
                  dateFormat="MMMM d, yyyy h:mm aa"
                />
              )}
            </div>
          </div>

          {/* Deadline row */}
          <div
            style={s.infoRow}
            onClick={() => setShowDeadlinePicker(v => !v)}
          >
            <TargetIcon />
            <div style={s.infoText}>
              <span style={{ ...s.infoMain, color: deadline ? WHITE : WHITE60 }}>
                {deadlineLabel}
              </span>
            </div>
            <div className="tasks-datepicker-wrap" style={s.pickerWrap} onClick={e => e.stopPropagation()}>
              {showDeadlinePicker && (
                <DatePicker
                  ref={deadlinePickerRef}
                  selected={deadline}
                  onChange={date => {
                    setDeadline(date);
                    setShowDeadlinePicker(false);
                  }}
                  inline
                  dateFormat="MMMM d, yyyy"
                />
              )}
            </div>
          </div>

          {/* Description */}
          <textarea
            style={s.textarea}
            placeholder="Add description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={4}
          />

          {/* Button row */}
          <div style={s.btnRow}>
            <button
              style={{
                ...s.addTaskBtn,
                opacity: submitting || !title.trim() ? 0.6 : 1,
                cursor: submitting ? 'wait' : 'pointer',
              }}
              onClick={handleAddTask}
              disabled={submitting || !title.trim()}
            >
              {submitting ? 'Saving…' : 'Add Task'}
            </button>
          </div>

          {formError && <p style={s.errorText}>{formError}</p>}
        </div>

        {/* Tasks list */}
        <div style={s.listCard}>
          <div style={s.listHeader}>
            <h2 style={s.listTitle}>Your tasks</h2>
            <button style={s.refreshBtn} onClick={loadTasks} type="button">↻ Refresh</button>
          </div>

          {tasksError && <p style={s.errorText}>{tasksError}</p>}

          {tasks.length === 0 && !tasksError && (
            <p style={s.emptyText}>No tasks yet — create one above.</p>
          )}

          {tasks.map(task => {
            const cat      = categoryById(task.categoryId);
            const catColor = cat?.color || '#5BC8E8';
            const isDone   = completedNames.has(task.title);
            return (
              <div key={task.id} style={{ ...s.taskRow, ...(isDone ? { filter: 'brightness(0.6)' } : {}) }}>
                <div style={{ ...s.taskInfo, textDecoration: isDone ? 'line-through' : 'none' }}>
                  <span style={s.taskTitleText}>
                    {task.title}
                  </span>
                  {task.description && (
                    <span style={s.taskMeta}>{task.description}</span>
                  )}
                  <span style={s.taskMetaLine}>
                    {cat && (
                      <span style={{
                        ...s.taskCatChip,
                        background: colorWithAlpha(catColor, 0.16),
                        color: catColor,
                        border: `1px solid ${colorWithAlpha(catColor, 0.4)}`,
                      }}>
                        {cat.name}
                      </span>
                    )}
                    <span style={s.taskMeta}>{task.type} · {isDone ? 'completed' : task.status}</span>
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  <button
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '6px',
                      borderRadius: 6,
                      color: hoveredDelete === task.id ? '#FF4757' : 'rgba(255,255,255,0.3)',
                      transition: 'color 0.15s',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    onClick={() => deleteTask(task.id)}
                    onMouseEnter={() => setHoveredDelete(task.id)}
                    onMouseLeave={() => setHoveredDelete(null)}
                    type="button"
                    title="Delete task"
                  >
                    <svg width="15" height="15" viewBox="0 0 14 14" fill="none">
                      <path d="M2 4h10M5 4V2.5h4V4M5.5 6.5v4M8.5 6.5v4M3 4l.8 7.5h6.4L11 4"
                        stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <button
                    style={s.startTimerBtn}
                    onClick={() => startTimerFor(task)}
                    type="button"
                  >
                    ▶ Start timer
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </Layout>
  );
}

const s = {
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 24,
    padding: 24,
    overflow: 'auto',
  },
  card: {
    width: 'min(90%, 700px)',
    minHeight: 520,
    background: WHITE15,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: 24,
    border: `1px solid ${BORDER}`,
    padding: '48px 56px',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    fontFamily: GEO,
    color: WHITE,
    position: 'relative',
  },
  titleInput: {
    background: 'transparent',
    border: 'none',
    outline: 'none',
    fontFamily: GEO,
    fontSize: 22,
    fontWeight: 400,
    color: WHITE,
    width: '100%',
    padding: 0,
  },
  divider: {
    height: 1,
    background: 'rgba(255,255,255,0.35)',
    marginTop: -4,
  },
  typeRow: {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
  },
  typeBtn: {
    background: 'transparent',
    borderRadius: 20,
    padding: '5px 14px',
    fontFamily: GEO,
    fontSize: 14,
    cursor: 'pointer',
    transition: 'all 0.15s',
    fontWeight: 400,
  },
  infoRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    cursor: 'pointer',
    position: 'relative',
  },
  infoText: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  infoMain: {
    fontSize: 15,
    fontWeight: 400,
    color: WHITE,
  },
  infoSub: {
    fontSize: 12,
    color: WHITE60,
  },
  pickerWrap: {
    position: 'absolute',
    top: 30,
    left: 0,
    zIndex: 100,
  },
  textarea: {
    background: WHITE08,
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: `1px solid ${BORDER}`,
    borderRadius: 12,
    padding: '14px 16px',
    fontFamily: GEO,
    fontSize: 14,
    color: WHITE,
    resize: 'none',
    width: '100%',
    boxSizing: 'border-box',
    lineHeight: 1.5,
  },
  calBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: 'transparent',
    border: `1px solid ${BORDER}`,
    borderRadius: 20,
    padding: '8px 16px',
    fontFamily: GEO,
    fontSize: 14,
    color: WHITE,
    cursor: 'pointer',
    transition: 'background 0.15s',
  },
  btnRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  addTaskBtn: {
    ...yellowBtn,
    borderRadius: 20,
    height: 'auto',
    padding: '8px 20px',
    fontSize: 14,
    fontFamily: GEO,
  },
  errorText: {
    margin: '4px 0 0',
    fontFamily: GEO,
    fontSize: 13,
    color: '#ffb4b4',
    lineHeight: 1.4,
  },
  catRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  catLabel: {
    fontFamily: GEO,
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: 1.2,
    color: WHITE60,
    textTransform: 'uppercase',
  },
  catPills: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    alignItems: 'center',
  },
  catPill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    background: 'transparent',
    borderRadius: 20,
    padding: '5px 12px',
    fontFamily: GEO,
    fontSize: 13,
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  catDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    flexShrink: 0,
  },
  addCatBtn: {
    background: 'transparent',
    border: `1px dashed ${BORDER}`,
    color: WHITE60,
    borderRadius: 20,
    padding: '5px 12px',
    fontFamily: GEO,
    fontSize: 13,
    cursor: 'pointer',
  },
  newCatWrap: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
  },
  newCatInput: {
    height: 28,
    background: WHITE08,
    border: `1px solid ${BORDER}`,
    borderRadius: 14,
    padding: '0 10px',
    fontFamily: GEO,
    fontSize: 13,
    color: WHITE,
    outline: 'none',
    width: 140,
  },
  newCatSave: {
    height: 28,
    padding: '0 12px',
    borderRadius: 14,
    border: 'none',
    background: '#FED430',
    color: '#160a00',
    fontFamily: GEO,
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
  },
  newCatCancel: {
    height: 28,
    width: 28,
    padding: 0,
    borderRadius: 14,
    border: `1px solid ${BORDER}`,
    background: 'transparent',
    color: WHITE60,
    fontFamily: GEO,
    fontSize: 13,
    cursor: 'pointer',
  },
  taskMetaLine: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
  },
  taskCatChip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '2px 10px',
    borderRadius: 12,
    fontFamily: GEO,
    fontSize: 11,
    fontWeight: 500,
  },
  listCard: {
    width: 'min(90%, 700px)',
    background: WHITE15,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: 24,
    border: `1px solid ${BORDER}`,
    padding: '32px 40px',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    fontFamily: GEO,
    color: WHITE,
  },
  listHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  listTitle: {
    margin: 0,
    fontFamily: GEO,
    fontSize: 18,
    fontWeight: 600,
    color: WHITE,
  },
  refreshBtn: {
    background: 'transparent',
    border: `1px solid ${BORDER}`,
    color: WHITE60,
    fontFamily: GEO,
    fontSize: 12,
    borderRadius: 16,
    padding: '4px 12px',
    cursor: 'pointer',
  },
  emptyText: {
    margin: '8px 0',
    fontFamily: GEO,
    fontSize: 14,
    color: WHITE60,
    textAlign: 'center',
  },
  taskRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    padding: '12px 16px',
    background: WHITE08,
    border: `1px solid ${BORDER}`,
    borderRadius: 16,
  },
  taskInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    flex: 1,
    minWidth: 0,
  },
  taskTitleText: {
    fontFamily: GEO,
    fontSize: 15,
    fontWeight: 500,
    color: WHITE,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  taskMeta: {
    fontFamily: GEO,
    fontSize: 12,
    color: WHITE60,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  startTimerBtn: {
    ...yellowBtn,
    borderRadius: 20,
    height: 'auto',
    padding: '8px 16px',
    fontSize: 13,
    fontFamily: GEO,
    flexShrink: 0,
  },
};
