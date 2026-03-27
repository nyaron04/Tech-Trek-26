import './Dashboard.css';

function Dashboard() {
  return (
    <div className="dashboard">
      <div className="topbar">
        <button className="profile-btn">Profile</button>
        <input className="task-input" placeholder="What Are You Working On Today?" />
        <button className="category-tag">● Category Tag</button>
        <button className="play-btn">▶</button>
        <span className="timer">0:00:00</span>
      </div>
      <div className="main">
        <div className="left-sidebar">
          <div className="time-spent">
            <h4>Time Spent</h4>
            <div className="time-row">Category <span>hr:min:sec</span></div>
            <div className="time-row">Category <span>hr:min:sec</span></div>
            <div className="time-row">Category <span>hr:min:sec</span></div>
            <div className="time-row">Category <span>hr:min:sec</span></div>
          </div>
          <div className="ai-chatbox">
            <h4>AI Chatbox</h4>
            <div className="chat-input-row">
              <input placeholder="Write Something" />
              <button>↑</button>
            </div>
          </div>
        </div>
        <div className="calendar">
          <h3>Calendar goes here</h3>
        </div>
        <div className="right-sidebar">
          <div className="category-item">
            <span>category</span><button>›</button>
          </div>
          <div className="category-item">
            <span>category</span><button>∨</button>
            <div className="task-list">
              <div className="task">Task</div>
              <div className="task">Task</div>
              <div className="task">Task</div>
              <div className="task">Task</div>
              <div className="task">Task</div>
              <button className="add-task">+ Add Task</button>
            </div>
          </div>
          <div className="category-item">
            <span>category</span><button>›</button>
          </div>
          <div className="category-item">
            <span>category</span><button>›</button>
          </div>
          <button className="add-category">+ Add Category</button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
