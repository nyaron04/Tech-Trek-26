import { useState, useRef, useEffect, useCallback } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Layout from '../components/Layout';
import { getUserId, authFetch, __internal } from '../auth';

const API_BASE = __internal.API_BASE;

const GEO    = "'Georama', 'Inter', sans-serif";
const TEAL   = '#5BC8E8';
const BORDER = 'rgba(255,255,255,0.14)';
const BLR    = 'blur(18px)';

// Modal-form color tokens (match TasksPage)
const WHITE    = '#fff';
const WHITE60  = 'rgba(255,255,255,0.6)';
const WHITE40  = 'rgba(255,255,255,0.4)';
const WHITE15  = 'rgba(255,255,255,0.15)';
const WHITE08  = 'rgba(255,255,255,0.08)';
const MBORDER  = 'rgba(255,255,255,0.25)';

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

const HOURS      = Array.from({ length: 24 }, (_, i) => i); // 12 AM – 11 PM
const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const CAT_COLORS = [
  '#5BC8E8', // teal
  '#9B6FE8', // purple
  '#E8A05B', // orange
  '#E85B9A', // pink
  '#7BDE8A', // green
  '#E85B5B', // red
];


const INIT_CHAT = [
  { from: 'bot',  text: "Hi! I'm Bumble 🐝 How can I help you today?" },
  { from: 'user', text: 'Can you schedule my study session for tomorrow?' },
  { from: 'bot',  text: "Done! I've added a 2-hour study block at 9 AM tomorrow." },
];

function fmtHour(h) {
  if (h === 12) return '12 PM';
  return h < 12 ? `${h} AM` : `${h - 12} PM`;
}

function fmtDate(date) {
  return date.toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  }).replace(/(\w+), (\w+) (\d+)/, (_, wd, mo, d) => {
    const suffix = ['th','st','nd','rd'][
      ((d % 100 - 11) % 10) < 4 && (d % 100 - 11) >= 0
        ? 0
        : [1,2,3].includes(d % 10) ? d % 10 : 0
    ] || 'th';
    return `${wd}, ${mo} ${d}${suffix}`;
  });
}

function fmtTime(date) {
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    .toLowerCase().replace(' ', '');
}

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

// ── Event context popup ───────────────────────────────────────────────────────
function PencilIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M9.5 1.5l3 3L4 13H1v-3L9.5 1.5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M8 3l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2 4h10M5 4V2.5h4V4M5.5 6.5v4M8.5 6.5v4M3 4l.8 7.5h6.4L11 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2 7l4 4 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const POPUP_W = 144;
const POPUP_H = 112; // approx height for 3 items

function UndoIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2 5h5.5a4 4 0 1 1 0 8H4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 2.5L2 7l4.5 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function EventPopup({ x, y, onClose, onEdit, onDelete, onComplete, isCompleted }) {
  useEffect(() => {
    const dismiss = () => onClose();
    document.addEventListener('mousedown', dismiss);
    return () => document.removeEventListener('mousedown', dismiss);
  }, [onClose]);

  const overflowBottom = y + 8 + POPUP_H > window.innerHeight;
  const overflowRight  = x + 8 + POPUP_W > window.innerWidth;
  const top  = overflowBottom ? y - POPUP_H - 8 : y + 8;
  const left = overflowRight  ? x - POPUP_W - 8 : x + 8;

  const actions = [
    { Icon: PencilIcon, label: 'Edit',     fn: onEdit },
    { Icon: TrashIcon,  label: 'Delete',   fn: onDelete },
    { Icon: isCompleted ? UndoIcon : CheckIcon, label: isCompleted ? 'Undo Complete' : 'Complete', fn: onComplete },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        top,
        left,
        zIndex: 600,
        background: 'rgba(16,36,50,0.88)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        border: `1px solid ${BORDER}`,
        borderRadius: 10,
        padding: '4px 0',
        fontFamily: GEO,
        minWidth: POPUP_W,
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      }}
      onMouseDown={e => e.stopPropagation()}
    >
      {actions.map(({ Icon, label, fn }) => (
        <button
          key={label}
          onClick={fn}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 9,
            width: '100%',
            padding: '8px 15px',
            background: 'none',
            border: 'none',
            color: 'rgba(255,255,255,0.88)',
            fontFamily: GEO,
            fontSize: 13,
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          <Icon />{label}
        </button>
      ))}
    </div>
  );
}

// ── Task Modal ────────────────────────────────────────────────────────────────
function TaskModal({ onClose, initialDate, categories, onAddTask, initialData, editMode }) {
  const [title,              setTitle]              = useState(initialData?.title ?? '');
  const [description,        setDescription]        = useState(initialData?.description ?? '');
  const [selectedCategory,   setSelectedCategory]   = useState(initialData?.categoryLabel ?? null);
  const [formError,          setFormError]          = useState('');
  const [saving,             setSaving]             = useState(false);
  const [startDate,          setStartDate]          = useState(() => {
    if (initialData?.date) return new Date(initialData.date);
    if (initialDate) return initialDate;
    const d = new Date(); d.setMinutes(0, 0, 0); return d;
  });
  const [endDate,            setEndDate]            = useState(() => {
    const base = initialData?.date ? new Date(initialData.date) : initialDate ? new Date(initialDate) : new Date();
    if (!initialData?.date && !initialDate) base.setMinutes(0, 0, 0);
    base.setHours(base.getHours() + 1);
    return base;
  });
  const [deadline,           setDeadline]           = useState(null);
  const [showStartPicker,    setShowStartPicker]    = useState(false);
  const [showDeadlinePicker, setShowDeadlinePicker] = useState(false);
  const startPickerRef    = useRef(null);
  const deadlinePickerRef = useRef(null);

  const dateLabel     = fmtDate(startDate);
  const timeLabel     = `${fmtTime(startDate)} – ${fmtTime(endDate)}`;
  const deadlineLabel = deadline ? fmtDate(deadline) : 'Add deadline';

  return (
    <div style={m.overlay} onMouseDown={onClose}>
      <style>{`
        .cal-dp-wrap .react-datepicker-popper { z-index: 200; }
        .cal-dp-wrap .react-datepicker {
          font-family: ${GEO};
          background: rgba(20,50,65,0.97);
          border: 1px solid ${MBORDER};
          border-radius: 14px;
          color: ${WHITE};
          backdrop-filter: blur(20px);
        }
        .cal-dp-wrap .react-datepicker__header {
          background: rgba(255,255,255,0.08);
          border-bottom: 1px solid ${MBORDER};
          border-radius: 14px 14px 0 0;
        }
        .cal-dp-wrap .react-datepicker__current-month,
        .cal-dp-wrap .react-datepicker__day-name,
        .cal-dp-wrap .react-datepicker-time__header { color: ${WHITE}; }
        .cal-dp-wrap .react-datepicker__day { color: ${WHITE}; border-radius: 6px; }
        .cal-dp-wrap .react-datepicker__day:hover { background: rgba(255,255,255,0.15); }
        .cal-dp-wrap .react-datepicker__day--selected,
        .cal-dp-wrap .react-datepicker__day--keyboard-selected { background: rgba(91,200,232,0.5); }
        .cal-dp-wrap .react-datepicker__time-container { border-left: 1px solid ${MBORDER}; }
        .cal-dp-wrap .react-datepicker__time { background: rgba(20,50,65,0.97); color: ${WHITE}; }
        .cal-dp-wrap .react-datepicker__time-list-item { color: ${WHITE}; }
        .cal-dp-wrap .react-datepicker__time-list-item:hover { background: rgba(255,255,255,0.15) !important; }
        .cal-dp-wrap .react-datepicker__time-list-item--selected { background: rgba(91,200,232,0.5) !important; }
        .cal-dp-wrap .react-datepicker__navigation-icon::before { border-color: ${WHITE60}; }
        .cal-modal textarea::placeholder { color: ${WHITE40}; }
        .cal-modal textarea:focus { outline: none; }
        .cal-modal input::placeholder { color: ${WHITE40}; }
      `}</style>

      <div className="cal-modal" style={m.card} onMouseDown={e => e.stopPropagation()}>
        {/* X button */}
        <button style={m.closeBtn} onClick={onClose}>×</button>

        {/* Title */}
        <input
          style={m.titleInput}
          placeholder="What are you up to?"
          value={title}
          onChange={e => setTitle(e.target.value)}
          autoFocus
        />
        <div style={m.divider} />

        {/* Date / time row */}
        <div style={m.infoRow} onClick={() => setShowStartPicker(v => !v)}>
          <ClockIcon />
          <div style={m.infoText}>
            <span style={m.infoMain}>{dateLabel}&nbsp;&nbsp;&nbsp;{timeLabel}</span>
            <span style={m.infoSub}>Does not repeat</span>
          </div>
          <div className="cal-dp-wrap" style={m.pickerWrap} onClick={e => e.stopPropagation()}>
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
        <div style={m.infoRow} onClick={() => setShowDeadlinePicker(v => !v)}>
          <TargetIcon />
          <div style={m.infoText}>
            <span style={{ ...m.infoMain, color: deadline ? WHITE : WHITE60 }}>
              {deadlineLabel}
            </span>
          </div>
          <div className="cal-dp-wrap" style={m.pickerWrap} onClick={e => e.stopPropagation()}>
            {showDeadlinePicker && (
              <DatePicker
                ref={deadlinePickerRef}
                selected={deadline}
                onChange={date => { setDeadline(date); setShowDeadlinePicker(false); }}
                inline
                dateFormat="MMMM d, yyyy"
              />
            )}
          </div>
        </div>

        {/* Category selector */}
        {categories.length > 0 && (
          <div style={m.catRow}>
            {categories.map(({ label, color }) => (
              <button
                key={label}
                style={{
                  ...m.catPill,
                  border: selectedCategory === label
                    ? `1.5px solid ${color}`
                    : '1.5px solid rgba(255,255,255,0.15)',
                  background: selectedCategory === label
                    ? color + '22'
                    : 'rgba(255,255,255,0.06)',
                  color: selectedCategory === label ? color : WHITE60,
                }}
                onClick={() => setSelectedCategory(v => v === label ? null : label)}
              >
                <span style={{ ...m.catDot, background: color }} />
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Description */}
        <textarea
          style={m.textarea}
          placeholder="Add description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={4}
        />

        {/* Add Task / Save Changes button */}
        <div style={m.btnRow}>
          <button
            style={{ ...m.addBtn, opacity: saving ? 0.6 : 1 }}
            disabled={saving}
            onClick={async () => {
              const cat = categories.find(c => c.label === selectedCategory);
              setFormError('');
              setSaving(true);
              try {
                await onAddTask({ title, startDate, category: cat ?? null, description, id: initialData?.id });
                onClose();
              } catch (e) {
                setFormError(e?.message || 'Could not save task.');
              } finally {
                setSaving(false);
              }
            }}
          >{saving ? 'Saving...' : editMode ? 'Save Changes' : 'Add Task'}</button>
        </div>
        {formError && <div style={m.errorText}>{formError}</div>}
      </div>
    </div>
  );
}

// ── Calendar Page ─────────────────────────────────────────────────────────────
export default function CalendarPage() {
  const [weekOffset,   setWeekOffset]   = useState(0);
  const [chatInput,    setChatInput]    = useState('');
  const [msgs,         setMsgs]         = useState(INIT_CHAT);
  const [categories,   setCategories]   = useState([]);
  const [catError,     setCatError]     = useState('');
  const [taskError,    setTaskError]    = useState('');
  const [showAddInput, setShowAddInput] = useState(false);
  const [newCatName,   setNewCatName]   = useState('');
  const [newCatColor,  setNewCatColor]  = useState(CAT_COLORS[0]);
  const [hoveredCat,   setHoveredCat]   = useState(null);
  const [modalOpen,       setModalOpen]       = useState(false);
  const [modalDate,       setModalDate]       = useState(null);
  const [editData,        setEditData]        = useState(null);
  const [events,          setEvents]          = useState(() => {
    try { return JSON.parse(localStorage.getItem('honeybee_tasks') || '[]'); }
    catch { return []; }
  });
  const [popup,           setPopup]           = useState(null); // { eventId, x, y }
  const [selectedFilters, setSelectedFilters] = useState(() => new Set());
  const chatEndRef = useRef(null);

  const loadCategories = useCallback(async () => {
    const userId = getUserId();
    if (!userId) {
      setCategories([]);
      setSelectedFilters(new Set());
      setCatError('Sign in to manage categories.');
      return;
    }
    setCatError('');
    try {
      const res = await authFetch(`${API_BASE}/categories?userId=${encodeURIComponent(userId)}`);
      if (!res.ok) throw new Error(`Failed to load categories (${res.status})`);
      const list = await res.json();
      // Map backend shape (name) to UI shape (label) so the rest of the
      // component continues to use `label` without further changes.
      const mapped = list.map(c => ({
        id: c.id,
        label: c.name,
        color: c.color || TEAL,
      }));
      setCategories(mapped);
      setSelectedFilters(prev => {
        if (prev.size === 0) return new Set(mapped.map(c => c.label));
        const next = new Set();
        for (const c of mapped) if (prev.has(c.label)) next.add(c.label);
        return next;
      });
    } catch (e) {
      setCatError(e?.message || 'Could not load categories.');
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const openModal = (date = null) => { setEditData(null); setModalDate(date); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditData(null); };

  const openEditModal = id => {
    const ev = events.find(e => e.id === id);
    if (!ev) return;
    setEditData({ id: ev.id, title: ev.title, date: ev.date, categoryLabel: ev.categoryLabel, description: ev.description ?? '' });
    setModalOpen(true);
  };

  const saveBackendTask = async ({ backendId, title, description, category }) => {
    const userId = getUserId();
    if (!userId) throw new Error('Sign in to save a task.');
    if (!title.trim()) throw new Error('Task title is required.');
    if (!category?.id) throw new Error('Pick a category before saving this task.');

    const payload = {
      title: title.trim(),
      description: description?.trim() ?? '',
      status: 'not completed',
      categoryId: category.id,
      userId,
      type: 'calendar',
    };

    const res = await authFetch(`${API_BASE}/tasks${backendId ? `/${backendId}` : ''}`, {
      method: backendId ? 'PUT' : 'POST',
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(body || `Task save failed (${res.status})`);
    }
    return res.json();
  };

  const handleAddTask = async ({ title, startDate, category, description, id }) => {
    const existing = id ? events.find(e => e.id === id) : null;
    const saved = await saveBackendTask({
      backendId: existing?.taskId,
      title,
      description,
      category,
    });

    if (id) {
      setEvents(prev => prev.map(e => e.id === id ? {
        ...e,
        taskId: saved.id,
        title: saved.title,
        color: category?.color ?? e.color,
        categoryLabel: category?.label ?? null,
        date: startDate,
        description: saved.description ?? '',
      } : e));
    } else {
      setEvents(prev => [...prev, {
        id: saved.id,
        taskId: saved.id,
        title: saved.title,
        color: category?.color ?? TEAL,
        categoryLabel: category?.label ?? null,
        date: startDate,
        description: saved.description ?? '',
        completed: false,
      }]);
    }
  };

  const ensureBackendTaskForEvent = async (ev) => {
    if (ev?.taskId) return ev.taskId;
    const category = categories.find(c => c.label === ev.categoryLabel);
    const saved = await saveBackendTask({
      title: ev.title,
      description: ev.description,
      category,
    });
    setEvents(prev => prev.map(e => e.id === ev.id ? { ...e, taskId: saved.id } : e));
    return saved.id;
  };

  const updateBackendTaskStatus = async (ev, status) => {
    const taskId = await ensureBackendTaskForEvent(ev);
    const res = await authFetch(`${API_BASE}/tasks/${taskId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(body || `Task status update failed (${res.status})`);
    }
    return taskId;
  };

  const deleteEvent = async id => {
    const ev = events.find(e => e.id === id);
    if (ev?.taskId) {
      try {
        await authFetch(`${API_BASE}/tasks/${ev.taskId}`, { method: 'DELETE' });
      } catch {
        // Keep the calendar responsive even if the backend delete fails.
      }
    }
    if (ev) {
      try {
        const existing = JSON.parse(localStorage.getItem('completedTasks') || '[]');
        localStorage.setItem('completedTasks', JSON.stringify(
          existing.filter(t => t.taskName !== ev.title)
        ));
      } catch {}
    }
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  const completeEvent = async id => {
    const ev = events.find(e => e.id === id);
    if (!ev) return;

    setTaskError('');
    try {
      const taskId = await updateBackendTaskStatus(ev, 'completed');
      const entry = {
        taskName:      ev.title,
        dateCompleted: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        timeSpent:     '—',
        taskCategory:  ev.categoryLabel ?? 'Uncategorized',
      };
      const existing = JSON.parse(localStorage.getItem('completedTasks') || '[]');
      const alreadyExists = existing.some(t => t.taskName === entry.taskName && t.dateCompleted === entry.dateCompleted);
      if (!alreadyExists) {
        localStorage.setItem('completedTasks', JSON.stringify([entry, ...existing]));
      }
      setEvents(prev => prev.map(e => e.id === id ? { ...e, taskId, completed: true } : e));
    } catch (e) {
      setTaskError(e?.message || 'Could not mark task complete.');
    }
  };

  const uncompleteEvent = async id => {
    const ev = events.find(e => e.id === id);
    if (!ev) return;

    setTaskError('');
    try {
      const taskId = await updateBackendTaskStatus(ev, 'not completed');
      const dateCompleted = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      try {
        const existing = JSON.parse(localStorage.getItem('completedTasks') || '[]');
        localStorage.setItem('completedTasks', JSON.stringify(
          existing.filter(t => !(t.taskName === ev.title && t.dateCompleted === dateCompleted))
        ));
      } catch {}
      setEvents(prev => prev.map(e => e.id === id ? { ...e, taskId, completed: false } : e));
    } catch (e) {
      setTaskError(e?.message || 'Could not undo task completion.');
    }
  };

  const toggleFilter = label => {
    setSelectedFilters(prev => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label); else next.add(label);
      return next;
    });
  };

  const allSelected = selectedFilters.size === categories.length && categories.length > 0;
  const toggleAll = () => {
    setSelectedFilters(allSelected
      ? new Set()
      : new Set(categories.map(c => c.label))
    );
  };

  const addCategory = async () => {
    const name = newCatName.trim();
    if (!name) return;
    const userId = getUserId();
    if (!userId) {
      setCatError('Sign in to add a category.');
      return;
    }
    setCatError('');
    try {
      const res = await authFetch(`${API_BASE}/categories`, {
        method: 'POST',
        body: JSON.stringify({ userId, name, color: newCatColor }),
      });
      if (!res.ok) {
        const body = await res.text();
        throw new Error(body || `Add category failed (${res.status})`);
      }
      const saved = await res.json();
      const mapped = { id: saved.id, label: saved.name, color: saved.color || newCatColor };
      setCategories(prev => {
        if (prev.some(c => c.id === mapped.id)) return prev;
        return [...prev, mapped];
      });
      setSelectedFilters(prev => new Set([...prev, mapped.label]));
      setNewCatName('');
      setNewCatColor(CAT_COLORS[0]);
      setShowAddInput(false);
    } catch (e) {
      setCatError(e?.message || 'Could not add category.');
    }
  };

  const deleteCategory = async label => {
    const cat = categories.find(c => c.label === label);
    if (!cat) return;
    setCatError('');
    try {
      const res = await authFetch(`${API_BASE}/categories/${cat.id}`, { method: 'DELETE' });
      if (!res.ok && res.status !== 404) {
        const body = await res.text();
        throw new Error(body || `Delete failed (${res.status})`);
      }
      setCategories(prev => prev.filter(c => c.id !== cat.id));
      setSelectedFilters(prev => { const next = new Set(prev); next.delete(label); return next; });
    } catch (e) {
      setCatError(e?.message || 'Could not delete category.');
    }
  };

  const weekDates = getWeekDates(weekOffset);
  const todayISO  = new Date().toISOString().slice(0, 10);

  const eventMap = {};
  events.forEach(ev => {
    if (ev.categoryLabel !== null && !selectedFilters.has(ev.categoryLabel)) return;
    const d   = new Date(ev.date);
    const iso = d.toISOString().slice(0, 10);
    const di  = weekDates.findIndex(wd => wd.toISOString().slice(0, 10) === iso);
    if (di === -1) return;
    eventMap[`${di}-${d.getHours()}`] = {
      id: ev.id,
      taskId: ev.taskId,
      title: ev.title,
      color: ev.color,
      completed: ev.completed,
    };
  });

  useEffect(() => {
    localStorage.setItem('honeybee_tasks', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs]);

  const sendChat = async () => {
    if (!chatInput.trim()) return;

    const text = chatInput;

    setMsgs(prev => [
      ...prev,
      { from: 'user', text },
      { from: 'bot', text: "Thinking..." },
    ]);

    setChatInput('');

    try {
      const userId = getUserId();

      if (!userId) {
        throw new Error("No logged-in user found.");
      }

      const response = await authFetch("http://localhost:8080/ai/schedule/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          message: text,
        }),
      });

      const data = await response.text();

      setMsgs(prev => [
        ...prev.slice(0, -1),
        { from: 'bot', text: data },
      ]);
    } catch (error) {
      setMsgs(prev => [
        ...prev.slice(0, -1),
        { from: 'bot', text: "Something went wrong. Please try again." },
      ]);
    }
  };

  return (
    <Layout>
      {modalOpen && (
        <TaskModal
          onClose={closeModal}
          initialDate={modalDate}
          categories={categories}
          onAddTask={handleAddTask}
          initialData={editData}
          editMode={!!editData}
        />
      )}
      {popup && (() => {
        const popupEv = events.find(e => e.id === popup.eventId);
        return (
          <EventPopup
            x={popup.x}
            y={popup.y}
            onClose={() => setPopup(null)}
            onEdit={() => { openEditModal(popup.eventId); setPopup(null); }}
            onDelete={() => { deleteEvent(popup.eventId); setPopup(null); }}
            isCompleted={!!popupEv?.completed}
            onComplete={async () => {
              popupEv?.completed
                ? await uncompleteEvent(popup.eventId)
                : await completeEvent(popup.eventId);
              setPopup(null);
            }}
          />
        );
      })()}

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
        {taskError && <div style={s.taskErrorText}>{taskError}</div>}

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
                ...weekDates.map((date, di) => {
                  const ev = eventMap[`${di}-${hour}`];
                  const slotDate = new Date(date);
                  slotDate.setHours(hour, 0, 0, 0);
                  return (
                    <div
                      key={`c${di}-${hour}`}
                      style={s.gridCell}
                      onClick={!ev ? () => openModal(slotDate) : undefined}
                    >
                      {ev ? (
                        <div
                          style={{
                            ...s.eventBlock,
                            ...(ev.completed
                              ? { background: 'transparent', border: `1.5px dashed ${ev.color}`, opacity: 0.45 }
                              : { background: ev.color + '25', borderLeft: `3px solid ${ev.color}` }
                            ),
                          }}
                          onClick={e => { e.stopPropagation(); setPopup({ eventId: ev.id, x: e.clientX, y: e.clientY }); }}
                        >
                          <span style={{ ...s.eventText, color: ev.color, textDecoration: ev.completed ? 'line-through' : 'none' }}>{ev.title}</span>
                        </div>
                      ) : (
                        <div style={s.emptyCellHint} className="empty-cell-hint" />
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
        {/* Add Task */}
        <button style={s.addTaskYellow} onClick={() => openModal()}>+ Add Task</button>

        {/* Task Categories */}
        <div style={s.card}>
          <div style={{ ...s.cardTitle, justifyContent: 'space-between' }}>
            <span>Task Categories</span>
            <button
              style={{
                ...s.allBtn,
                background: allSelected ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.07)',
                color: allSelected ? '#fff' : 'rgba(255,255,255,0.5)',
                border: allSelected ? '1px solid rgba(255,255,255,0.35)' : '1px solid rgba(255,255,255,0.15)',
              }}
              onClick={toggleAll}
            >All</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {categories.map(({ label, color, count }) => {
              const active = selectedFilters.has(label);
              return (
                <div
                  key={label}
                  style={{
                    ...s.catRow,
                    background: active ? color + '22' : 'transparent',
                    border: active ? `1px solid ${color}55` : '1px solid transparent',
                    borderRadius: 7,
                    padding: '4px 6px',
                    margin: '0 -6px',
                    cursor: 'pointer',
                    transition: 'background 0.15s, border 0.15s',
                  }}
                  onClick={() => toggleFilter(label)}
                  onMouseEnter={() => setHoveredCat(label)}
                  onMouseLeave={() => setHoveredCat(null)}
                >
                  <div style={{ ...s.catDot, background: color }} />
                  <span style={{ ...s.catLabel, color: active ? '#fff' : 'rgba(255,255,255,0.78)' }}>
                    {label}
                  </span>
                  <button
                    style={{ ...s.catDeleteBtn, opacity: hoveredCat === label ? 1 : 0 }}
                    onClick={e => { e.stopPropagation(); deleteCategory(label); }}
                  >×</button>
                </div>
              );
            })}
          </div>
          {catError && (
            <div style={s.catErrorText}>{catError}</div>
          )}
          {showAddInput && (
            <div style={s.addCatForm}>
              <input
                style={s.catInput}
                placeholder="Category name"
                value={newCatName}
                autoFocus
                onChange={e => setNewCatName(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') addCategory();
                  if (e.key === 'Escape') { setShowAddInput(false); setNewCatName(''); }
                }}
              />
              <div style={s.swatchRow}>
                {CAT_COLORS.map(c => (
                  <button
                    key={c}
                    style={{
                      ...s.swatch,
                      background: c,
                      boxShadow: newCatColor === c ? `0 0 0 2px #fff` : 'none',
                    }}
                    onClick={() => setNewCatColor(c)}
                  />
                ))}
              </div>
            </div>
          )}
          <button
            style={{
              ...s.addTaskBtn,
              opacity: showAddInput && !newCatName.trim() ? 0.55 : 1,
              cursor: showAddInput && !newCatName.trim() ? 'not-allowed' : 'pointer',
            }}
            onClick={() => {
              if (!showAddInput) {
                setShowAddInput(true);
                return;
              }
              if (newCatName.trim()) {
                addCategory();
              } else {
                setShowAddInput(false);
              }
            }}
          >
            {showAddInput ? '✓ Save Category' : '+ Add Category'}
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

      <style>{`
        .empty-cell-hint { display: none; }
        [style*='gridCell']:hover .empty-cell-hint { display: block; }
      `}</style>
    </Layout>
  );
}

/* ── Calendar styles ── */
const s = {
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
  taskErrorText: {
    color: '#ff8a8a',
    fontFamily: GEO,
    fontSize: 12,
    marginTop: -4,
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
    cursor: 'pointer',
  },
  emptyCellHint: {
    position: 'absolute',
    inset: 2,
    borderRadius: 4,
    border: `1px dashed rgba(91,200,232,0.3)`,
    pointerEvents: 'none',
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
  addTaskYellow: {
    width: '100%',
    padding: '8px',
    borderRadius: 8,
    background: 'rgba(255,255,255,0.12)',
    border: '1px solid rgba(255,255,255,0.2)',
    color: '#fff',
    fontFamily: GEO,
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    flexShrink: 0,
  },
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
  allBtn: {
    padding: '2px 9px',
    borderRadius: 10,
    fontFamily: GEO,
    fontSize: 11,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.15s',
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
  addCatForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  swatchRow: {
    display: 'flex',
    gap: 7,
  },
  swatch: {
    width: 20,
    height: 20,
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    flexShrink: 0,
    transition: 'box-shadow 0.12s',
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
  catErrorText: {
    fontFamily: GEO,
    fontSize: 11,
    color: '#ff8a8a',
    padding: '2px 2px 0',
  },
  catConfirmBtn: {
    padding: '5px 10px',
    height: 'auto',
    width: 'fit-content',
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

/* ── Modal styles ── */
const m = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.55)',
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  card: {
    position: 'relative',
    width: 'min(90vw, 640px)',
    maxHeight: '90vh',
    overflowY: 'auto',
    background: WHITE15,
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    borderRadius: 24,
    border: `1px solid ${MBORDER}`,
    padding: '48px 52px 40px',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    fontFamily: GEO,
    color: WHITE,
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 18,
    background: 'rgba(255,255,255,0.1)',
    border: 'none',
    borderRadius: '50%',
    width: 28,
    height: 28,
    fontSize: 18,
    lineHeight: 1,
    color: 'rgba(255,255,255,0.7)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
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
    zIndex: 200,
  },
  textarea: {
    background: WHITE08,
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: `1px solid ${MBORDER}`,
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
  catRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
  },
  catPill: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '5px 12px',
    borderRadius: 20,
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
    display: 'inline-block',
  },
  btnRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  errorText: {
    color: '#ff8a8a',
    fontSize: 12,
    fontFamily: GEO,
  },
  addBtn: {
    background: '#FED430',
    border: 'none',
    color: '#160a00',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'opacity 0.15s',
    borderRadius: 20,
    height: 'auto',
    padding: '8px 24px',
    fontSize: 14,
    fontFamily: GEO,
  },
};
