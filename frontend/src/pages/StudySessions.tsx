import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Award, 
  Activity, 
  BookOpen, 
  CheckCircle 
} from 'lucide-react';
import { usePlanner } from '../context/PlannerContext';

const MODE_CONFIGS = {
  Pomodoro: { duration: 25, label: 'Work Focus', color: 'from-purple-500 to-indigo-600', ringColor: '#8B5CF6' },
  'Short Break': { duration: 5, label: 'Short Rest', color: 'from-blue-500 to-cyan-500', ringColor: '#3B82F6' },
  'Long Break': { duration: 15, label: 'Long Rest', color: 'from-emerald-500 to-teal-500', ringColor: '#10B981' },
};

export const StudySessions: React.FC = () => {
  const { courses, studySessions, addStudySession } = usePlanner();

  const [mode, setMode] = useState<'Pomodoro' | 'Short Break' | 'Long Break'>('Pomodoro');
  const [courseId, setCourseId] = useState(courses[0]?.id || '');
  const [timeLeft, setTimeLeft] = useState(MODE_CONFIGS.Pomodoro.duration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);
  const [loggedMinutes, setLoggedMinutes] = useState(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const initialTimeForMode = MODE_CONFIGS[mode].duration * 60;
  const timeSpentSeconds = initialTimeForMode - timeLeft;
  const timeSpentMinutes = Math.floor(timeSpentSeconds / 60);

  // Sync course selection if course list loads after mounts
  useEffect(() => {
    if (courses.length > 0 && !courseId) {
      setCourseId(courses[0].id);
    }
  }, [courses, courseId]);

  // Handle mode changes
  useEffect(() => {
    setIsRunning(false);
    setTimeLeft(MODE_CONFIGS[mode].duration * 60);
  }, [mode]);

  // Main countdown process logic
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            if (timerRef.current) clearInterval(timerRef.current);
            
            // Log session automatically on complete
            const completedMinutes = MODE_CONFIGS[mode].duration;
            addStudySession(courseId, completedMinutes, mode);
            setLoggedMinutes(completedMinutes);
            setShowLogModal(true);

            return MODE_CONFIGS[mode].duration * 60;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, mode, courseId, addStudySession]);

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(initialTimeForMode);
  };

  const progressPercent = ((initialTimeForMode - timeLeft) / initialTimeForMode) * 100;

  const handleStopEarly = () => {
    setIsRunning(false);
    if (timeSpentMinutes >= 1) {
      if (confirm(`Do you want to log your active study block of ${timeSpentMinutes} minutes?`)) {
        addStudySession(courseId, timeSpentMinutes, mode);
        setLoggedMinutes(timeSpentMinutes);
        setShowLogModal(true);
      }
    }
    setTimeLeft(initialTimeForMode);
  };

  // Radial Ring layout constants
  const strokeWidth = 12;
  const radius = 140;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  // Format MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
      className="page-container space-y-6"
    >
      {/* Top Header Banner */}
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-glass-border">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-35"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1516534775068-ba3e84589d90?q=80&w=1200&auto=format&fit=crop')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-bg via-dark-bg/60 to-transparent" />
        
        <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Focus Studio</h2>
            <p className="text-slate-200 text-base max-w-xl leading-relaxed">
              Activate focus loops and track deep work hours. Configure your Pomodoro session lengths and associate them with active academic courses.
            </p>
          </div>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Pomodoro module column */}
        <div className="lg:col-span-2 glass-panel p-8 rounded-3xl border border-glass-border flex flex-col items-center justify-center space-y-6 relative overflow-hidden bg-gradient-to-b from-slate-900/60 to-dark-bg/60">
          
          {/* Background visuals - higher opacity & resolution */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-25 select-none pointer-events-none"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop')` }}
          />

          {/* Mode selections */}
          <div className="flex gap-2.5 bg-slate-950/80 p-2 rounded-2xl border border-glass-border relative z-10">
            {(['Pomodoro', 'Short Break', 'Long Break'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-4.5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  mode === m
                    ? `bg-gradient-to-r ${MODE_CONFIGS[m].color} text-white shadow-md glow-purple`
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          {/* Circular Countdown Tracker */}
          <div className="relative flex items-center justify-center py-6 z-10 select-none">
            <svg width="320" height="320" className="transform -rotate-90">
              {/* Background Ring */}
              <circle
                cx="160"
                cy="160"
                r={radius}
                className="stroke-slate-800"
                strokeWidth={strokeWidth}
                fill="transparent"
              />
              {/* Animated Progress Ring */}
              <motion.circle
                cx="160"
                cy="160"
                r={radius}
                className="transition-all duration-300"
                strokeWidth={strokeWidth}
                stroke={MODE_CONFIGS[mode].ringColor}
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>

            {/* Centered digits */}
            <div className="absolute flex flex-col items-center justify-center space-y-1">
              <span className="text-6xl font-extrabold text-white tracking-tight tabular-nums">
                {formatTime(timeLeft)}
              </span>
              <span className="text-xs font-bold tracking-widest text-slate-300 uppercase mt-1">
                {MODE_CONFIGS[mode].label}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-5 relative z-10">
            {/* Reset */}
            <button
              onClick={handleReset}
              className="p-4.5 rounded-xl border border-glass-border bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
              title="Reset Timer"
            >
              <RotateCcw className="h-6 w-6" />
            </button>

            {/* Play/Pause */}
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`p-6 rounded-2xl bg-gradient-to-r ${MODE_CONFIGS[mode].color} text-white shadow-xl glow-purple hover:brightness-110 cursor-pointer transform transition-transform active:scale-95`}
            >
              {isRunning ? <Pause className="h-7 w-7 fill-white" /> : <Play className="h-7 w-7 fill-white ml-0.5" />}
            </button>

            {/* Stop / Save */}
            <button
              onClick={handleStopEarly}
              className="p-4.5 rounded-xl border border-glass-border bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
              title="Save Study Session"
            >
              <CheckCircle className="h-6 w-6" />
            </button>
          </div>

          {/* Course select drop down */}
          {courses.length > 0 && mode === 'Pomodoro' && (
            <div className="w-full max-w-xs space-y-2 relative z-10 mt-2">
              <label className="block text-center text-xs font-bold text-slate-300 uppercase tracking-widest">
                Associate Active Course
              </label>
              <div className="relative">
                <BookOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <select
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-glass-border rounded-xl text-slate-200 text-sm font-semibold focus:outline-none focus:border-brand-purple cursor-pointer"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code} — {c.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Sessions history column */}
        <div className="glass-panel p-6 rounded-3xl border border-glass-border flex flex-col h-full space-y-4">
          <div className="border-b border-glass-border pb-3 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-purple-400" />
              <h3 className="text-lg font-extrabold text-white">Focus History</h3>
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase bg-slate-900 px-2.5 py-1 rounded border border-glass-border">
              {studySessions.length} Blocks
            </span>
          </div>

          {/* Log entries */}
          <div className="flex-1 overflow-y-auto space-y-3 max-h-[380px] pr-1">
            {studySessions.length > 0 ? (
              studySessions.map((session) => (
                <div 
                  key={session.id} 
                  className="p-3.5 rounded-2xl border border-glass-border/40 bg-slate-950/40 flex justify-between items-center gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-200 truncate">
                      {session.courseTitle}
                    </p>
                    <p className="text-xs text-slate-300 font-medium flex items-center gap-1.5 mt-1">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        session.focusType === 'Pomodoro' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}>
                        {session.focusType}
                      </span>
                      <span>•</span>
                      <span>{session.duration} min</span>
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-slate-500 shrink-0">
                    {new Date(session.date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-slate-500 text-sm">
                No sessions completed yet. Log your first block!
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Timer Log Completion modal */}
      <AnimatePresence>
        {showLogModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogModal(false)}
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm glass-panel p-6 rounded-2xl border border-glass-border shadow-2xl z-10 text-center space-y-4"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-brand-purple to-brand-blue flex items-center justify-center text-white glow-purple animate-bounce">
                <Award className="h-8 w-8" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">Focus Block Logged!</h3>
                <p className="text-slate-400 text-sm">
                  Congratulations, you've completed <span className="text-emerald-400 font-semibold">{loggedMinutes} minutes</span> of deep study focus. Your stats have been updated.
                </p>
              </div>

              <button
                onClick={() => setShowLogModal(false)}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-purple to-brand-blue text-white font-semibold text-sm cursor-pointer shadow-lg hover:brightness-110"
              >
                Awesome, continue
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};
export default StudySessions;
