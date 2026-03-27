import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Dashboard from './pages/Dashboard';
import Landing from './components/landing'
import './pages/Dashboard.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/Dashboard" element={<Dashboard/>}/>
        <Route path="/Landing" element={<Landing/>}/>
      </Routes>
    </Router>
  );

}

export default App;
