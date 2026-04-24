import { useState, useRef } from 'react';
import { getCurrentUser } from '../auth';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Layout from '../components/Layout';

const GEO = "'Georama', 'Inter', sans-serif";
const WHITE = '#fff';
const WHITE60 = 'rgba(255,255,255,0.6)';
const WHITE40 = 'rgba(255,255,255,0.4)';
const WHITE15 = 'rgba(255,255,255,0.15)';
const WHITE08 = 'rgba(255,255,255,0.08)';
const BORDER = 'rgba(255,255,255,0.25)';

const TYPES = ['Task', 'Project', 'Homework'];

function addTask(category, title, description, deadline, type){
  const task = {
    userid: getCurrentUser().id,
    categoryid: category,
    title: title,
    description: description,
    deadline: deadline,
    status: 'incomplete',
    type: type
  }
  const response = fetch('http://localhost:8080/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });
  const result = response.json();
  if(!response.ok){
    throw new Error(`Failed to add task (${response.status})`);
  }
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

  const dateLabel = fmtDate(startDate);
  const timeLabel = `${fmtTime(startDate)} – ${fmtTime(endDate)}`;
  const deadlineLabel = deadline ? fmtDate(deadline) : 'Add deadline';

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

          {/* Type selector */}
          <div style={s.typeRow}>
            {TYPES.map(t => (
              <button
                key={t}
                style={{
                  ...s.typeBtn,
                  border: taskType === t ? `1px solid ${BORDER}` : '1px solid transparent',
                  color: taskType === t ? WHITE : WHITE60,
                }}
                onClick={() => setTaskType(t)}
              >
                {t}
              </button>
            ))}
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

          {/* Select Calendar */}
          <button style={s.calBtn}>
            <CalendarBtnIcon />
            <span>Select Calendar</span>
          </button>
        </div>
      </main>
    </Layout>
  );
}

const s = {
  main: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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
    alignSelf: 'flex-start',
    transition: 'background 0.15s',
  },
};
