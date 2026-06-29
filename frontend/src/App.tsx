import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { PlannerProvider, usePlanner } from './context/PlannerContext';
import { ThemeProvider } from './context/ThemeContext';
import { Sidebar } from './components/Sidebar';
import { TopNavbar } from './components/TopNavbar';
import { Dashboard } from './pages/Dashboard';
import { Courses } from './pages/Courses';
import { Tasks } from './pages/Tasks';
import { StudySessions } from './pages/StudySessions';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

// Protected Route Wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = usePlanner();
  if (!user.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};
// Main Layout Wrapper
const AppLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-800 dark:bg-[#030712] dark:text-slate-100 transition-colors duration-300">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <TopNavbar />
        <main className="flex-grow overflow-y-auto">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/study-sessions" element={<StudySessions />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

const AnimatedAppRoutes: React.FC = () => {
  const { user, authLoading } = usePlanner();
  const location = useLocation();

  if (authLoading) {
    return (
      <div className="flex min-h-screen w-screen items-center justify-center bg-slate-50 dark:bg-[#030712] text-slate-800 dark:text-slate-100 transition-colors duration-300">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 border-4 border-slate-200 dark:border-slate-800 border-t-brand-purple rounded-full animate-spin" />
          <p className="text-sm font-semibold tracking-wider text-slate-500 dark:text-slate-400">Verifying session...</p>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={
          user.isAuthenticated ? <Navigate to="/" replace /> : <Login />
        } />
        <Route path="/register" element={
          user.isAuthenticated ? <Navigate to="/" replace /> : <Register />
        } />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <ThemeProvider>
      <PlannerProvider>
        <Router>
          <AnimatedAppRoutes />
        </Router>
      </PlannerProvider>
    </ThemeProvider>
  );
}

export default App;
