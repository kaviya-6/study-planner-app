import React from 'react';
import { useLocation } from 'react-router-dom';
import { Flame, Bell, Sparkles } from 'lucide-react';
import { usePlanner } from '../context/PlannerContext';
import { ThemeToggle } from './ThemeToggle';

export const TopNavbar: React.FC = () => {
  const { user, tasks } = usePlanner();
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Dashboard';
      case '/courses':
        return 'My Courses';
      case '/tasks':
        return 'Study Tasks';
      case '/study-sessions':
        return 'Focus Studio';
      default:
        return 'Study Planner';
    }
  };

  const pendingTasks = tasks.filter(t => t.status !== 'Done').length;

  return (
    <header className="h-16 px-6 glass-panel border-b border-slate-200 dark:border-glass-border flex items-center justify-between z-20 shrink-0 sticky top-0 transition-colors duration-300">
      {/* Title & Badge */}
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent my-0 py-0 leading-none">
          {getPageTitle()}
        </h1>
        {location.pathname === '/' && (
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-300 text-xs font-semibold">
            <Sparkles className="h-3 w-3 text-indigo-500 dark:text-indigo-400" />
            <span>AI Powered</span>
          </div>
        )}
      </div>

      {/* Right Side Controls */}
      <div className="flex items-center gap-3 sm:gap-5">
        {user.isAuthenticated && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/20 text-orange-600 dark:text-orange-400 font-medium text-sm">
            <Flame className="h-4 w-4 fill-orange-500" />
            <span className="font-semibold">{user.streak} Day Streak</span>
          </div>
        )}

        <button
          className="relative p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50 border border-transparent hover:border-slate-200 dark:hover:border-glass-border transition-all duration-200 cursor-pointer"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {pendingTasks > 0 && (
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-brand-purple glow-purple" />
          )}
        </button>

        <ThemeToggle />

        {user.isAuthenticated && (
          <div className="flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-glass-border">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{user.name}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">{user.email}</p>
            </div>
            <img
              src={user.avatar}
              alt={user.name}
              className="h-9 w-9 rounded-full object-cover border-2 border-purple-200 dark:border-brand-purple/40 glow-purple"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop';
              }}
            />
          </div>
        )}
      </div>
    </header>
  );
};
