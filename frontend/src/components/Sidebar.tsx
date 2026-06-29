import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  BookOpen, 
  CheckSquare, 
  Timer, 
  LogOut, 
  ChevronLeft, 
  ChevronRight, 
  GraduationCap 
} from 'lucide-react';
import { usePlanner } from '../context/PlannerContext';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const { logoutUser } = usePlanner();

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Courses', path: '/courses', icon: BookOpen },
    { name: 'Tasks', path: '/tasks', icon: CheckSquare },
    { name: 'Study Sessions', path: '/study-sessions', icon: Timer },
  ];

  return (
    <motion.div
      animate={{ width: isOpen ? 260 : 88 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="relative flex flex-col h-screen glass-panel border-r border-slate-200 dark:border-glass-border select-none z-30 shrink-0"
    >
      {/* Logo Header */}
      <div className="flex items-center justify-between h-16 px-5 border-b border-slate-200 dark:border-glass-border overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-brand-purple to-brand-blue shrink-0 glow-purple">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <AnimatePresence>
            {isOpen && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="font-extrabold text-xl bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent whitespace-nowrap tracking-wide"
              >
                StudyFlow
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto overflow-x-hidden">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group relative border ${
                isActive
                  ? 'bg-gradient-to-r from-purple-500/10 to-indigo-500/10 dark:from-brand-purple/25 dark:to-brand-blue/20 text-purple-700 dark:text-white border-purple-500/25 dark:border-brand-purple/35 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/80 dark:hover:bg-slate-800/50 border-transparent hover:border-slate-200/60 dark:hover:border-white/5 hover:translate-x-0.5'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={`h-5 w-5 shrink-0 transition-all duration-200 group-hover:scale-110 ${isActive ? 'text-purple-600 dark:text-purple-400' : 'text-slate-500 dark:text-slate-400 group-hover:text-purple-600 dark:group-hover:text-purple-300'}`} />
                <AnimatePresence>
                  {isOpen && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="text-[15px] font-semibold whitespace-nowrap tracking-wide"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
                {!isOpen && (
                  <div className="absolute left-[4.75rem] scale-0 rounded-lg bg-slate-900 dark:bg-slate-950 px-3 py-2 text-sm font-semibold text-white group-hover:scale-100 transition-all duration-150 z-50 shadow-xl border border-slate-200 dark:border-glass-border pointer-events-none">
                    {item.name}
                  </div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Section / Logout */}
      <div className="p-4 border-t border-slate-200 dark:border-glass-border">
        <button
          onClick={logoutUser}
          className="flex items-center gap-4 w-full px-4 py-3.5 rounded-xl text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 border border-transparent hover:border-red-200 dark:hover:border-red-500/25 transition-all duration-200 group relative"
        >
          <LogOut className="h-5 w-5 shrink-0 transition-transform group-hover:scale-110 duration-200" />
          <AnimatePresence>
            {isOpen && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="text-[15px] font-semibold whitespace-nowrap tracking-wide"
              >
                Sign Out
              </motion.span>
            )}
          </AnimatePresence>
          {!isOpen && (
            <div className="absolute left-[4.75rem] scale-0 rounded-lg bg-slate-900 dark:bg-slate-950 px-3 py-2 text-sm font-semibold text-red-400 group-hover:scale-100 transition-all duration-150 z-50 shadow-xl border border-red-500/20 pointer-events-none">
              Sign Out
            </div>
          )}
        </button>
      </div>

      {/* Collapse Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-1/2 -right-3.5 p-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-glass-border text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 shadow-lg cursor-pointer transform -translate-y-1/2 hover:scale-110 active:scale-95 transition-all duration-150"
        aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
      >
        {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </button>
    </motion.div>
  );
};
