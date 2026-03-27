function Dashboard() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      
      {/* Top Bar */}
      <div style={{ background: '#f0f0f0', padding: '10px', display: 'flex', justifyContent: 'space-between' }}>
        <input placeholder="What Are You Working On Today?" style={{ width: '50%' }} />
        <button>Category Tag</button>
        <span>0:00:00</span>
      </div>

      {/* Main Content */}
      <div style={{ display: 'flex', flex: 1 }}>

        {/* Left Sidebar */}
        <div style={{ width: '150px', background: '#e0e0e0', padding: '10px' }}>
          <h3>Profile</h3>
          <h4>Time Spent</h4>
          <p>Category hr:min:sec</p>
          <h4>AI Chatbox</h4>
        </div>

        {/* Calendar */}
        <div style={{ flex: 1, background: '#fff', padding: '10px' }}>
          <h3>Calendar goes here</h3>
        </div>

        {/* Right Sidebar */}
        <div style={{ width: '150px', background: '#e0e0e0', padding: '10px' }}>
          <h3>Categories</h3>
          <p>+ Add Category</p>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
