import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import MainPage         from './pages/MainPage';
import UserPlan         from './pages/UserPlan';
import ThemeChoice      from './pages/ThemeChoice';
import SigninPage       from './pages/SigninPage';
import PersonalDashboard from './pages/PersonalDashboard';
import TasksPage        from './pages/TasksPage';
import TaskCompleted    from './pages/TaskCompleted';
import Timer            from './pages/Timer';
import CalendarPage     from './pages/CalendarPage';
import ProgressPage     from './pages/ProgressPage';

import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Marketing / landing */}
        <Route path="/"               element={<MainPage />} />

        {/* Onboarding flow */}
        <Route path="/user-plan"      element={<UserPlan />} />
        <Route path="/theme"          element={<ThemeChoice />} />

        {/* Auth */}
        <Route path="/signin"         element={<SigninPage />} />

        {/* App */}
        <Route path="/dashboard"      element={<PersonalDashboard />} />
        <Route path="/tasks"          element={<TasksPage />} />
        <Route path="/task-completed" element={<TaskCompleted />} />
        <Route path="/timer"          element={<Timer />} />
        <Route path="/calendar"       element={<CalendarPage />} />
        <Route path="/progress"       element={<ProgressPage />} />

        {/* Fallback */}
        <Route path="*"               element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
