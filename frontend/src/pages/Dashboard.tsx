import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  CheckSquare, 
  Award, 
  Timer, 
  ArrowUpRight, 
  Sparkles, 
  Flame,
  RefreshCw
} from 'lucide-react';
import { usePlanner } from '../context/PlannerContext';
import { PageHero } from '../components/PageHero';

const MOTIVATIONAL_QUOTES = [
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "Focus is a muscle, and you build it by using it.", author: "Dr. Sanjay Gupta" },
  { text: "Productivity is being able to do things that you were never able to do before.", author: "Franz Kafka" },
  { text: "Don't wish it were easier. Wish you were better.", author: "Jim Rohn" },
  { text: "Your talent determines what you can do. Your motivation determines how much you are willing to do.", author: "Lou Holtz" },
];

export const Dashboard: React.FC = () => {
  const { user, courses, tasks, studySessions } = usePlanner();
  const [quoteIndex, setQuoteIndex] = useState(0);

  const rotateQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length);
  };

  const totalCourses = courses.length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'Done').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const pending = pendingTasksCount(tasks);

  const totalStudyMinutes = studySessions
    .filter(s => s.focusType === 'Pomodoro')
    .reduce((acc, curr) => acc + curr.duration, 0);
  const studyHours = Math.floor(totalStudyMinutes / 60);
  const studyMinutesRemaining = totalStudyMinutes % 60;

  const courseProgress = courses.map(course => {
    const courseTasks = tasks.filter(t => t.courseId === course.id);
    const completedCourseTasks = courseTasks.filter(t => t.status === 'Done').length;
    const rate = courseTasks.length > 0 ? Math.round((completedCourseTasks / courseTasks.length) * 100) : 0;
    return {
      ...course,
      total: courseTasks.length,
      completed: completedCourseTasks,
      rate
    };
  });

  const recentSessions = studySessions.slice(0, 4);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      <PageHero
        imageUrl="https://images.unsplash.com/photo-1513258496099-48168024aec0?q=80&w=1920&auto=format&fit=crop"
        title={`Welcome back, ${user.name.split(' ')[0]}!`}
        subtitle={
          pending > 0
            ? `You've completed ${completedTasks} tasks. ${pending} active assignment${pending === 1 ? '' : 's'} are waiting for your attention.`
            : `You've completed ${completedTasks} tasks. All caught up — excellent work!`
        }
        badge={
          <div className="flex items-center gap-2 text-purple-600 dark:text-purple-300 font-bold text-xs sm:text-sm uppercase tracking-wider">
            <Sparkles className="h-4 w-4" />
            <span>Personalized Workspace</span>
          </div>
        }
        action={
          <Link 
            to="/study-sessions" 
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-brand-purple to-brand-blue text-white font-bold text-sm sm:text-base hover:brightness-110 shadow-lg glow-purple transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <Timer className="h-5 w-5" />
            <span>Start Study Timer</span>
          </Link>
        }
      />

      <div className="page-container space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { 
              title: 'Total Courses', 
              val: totalCourses, 
              sub: 'Active modules', 
              icon: BookOpen, 
              color: 'text-indigo-600 dark:text-indigo-400', 
              iconBg: 'bg-indigo-100/80 dark:bg-indigo-500/10',
              bg: 'bg-indigo-500/5 hover:bg-indigo-500/10 dark:bg-indigo-500/10 dark:hover:bg-indigo-500/15 border-indigo-500/10 dark:border-indigo-500/20 hover:border-indigo-500/30' 
            },
            { 
              title: 'Tasks', 
              val: `${completedTasks}/${totalTasks}`, 
              sub: `${completionRate}% completion rate`, 
              icon: CheckSquare, 
              color: 'text-emerald-600 dark:text-emerald-400', 
              iconBg: 'bg-emerald-100/80 dark:bg-emerald-500/10',
              bg: 'bg-emerald-500/5 hover:bg-emerald-500/10 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/15 border-emerald-500/10 dark:border-emerald-500/20 hover:border-emerald-500/30' 
            },
            { 
              title: 'Study Progress', 
              val: `${studyHours}h ${studyMinutesRemaining}m`, 
              sub: `${studySessions.length} sessions logged`, 
              icon: Timer, 
              color: 'text-sky-600 dark:text-sky-400', 
              iconBg: 'bg-sky-100/80 dark:bg-sky-500/10',
              bg: 'bg-sky-500/5 hover:bg-sky-500/10 dark:bg-sky-500/10 dark:hover:bg-sky-500/15 border-sky-500/10 dark:border-sky-500/20 hover:border-sky-500/30' 
            },
            { 
              title: 'Focus Streak', 
              val: `${user.streak} Days`, 
              sub: 'Daily logging streak', 
              icon: Flame, 
              color: 'text-orange-600 dark:text-orange-400', 
              iconBg: 'bg-orange-100/80 dark:bg-orange-500/10',
              bg: 'bg-orange-500/5 hover:bg-orange-500/10 dark:bg-orange-500/10 dark:hover:bg-orange-500/15 border-orange-500/10 dark:border-orange-500/20 hover:border-orange-500/30' 
            }
          ].map((m) => (
            <motion.div
              key={m.title}
              whileHover={{ y: -4, scale: 1.01 }}
              className={`glass-panel p-6 rounded-2xl border flex items-center justify-between gap-4 transition-all duration-300 hover:shadow-md dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.3)] ${m.bg}`}
            >
              <div className="space-y-1">
                <p className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{m.title}</p>
                <p className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">{m.val}</p>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{m.sub}</p>
              </div>
              <div className={`p-3.5 rounded-xl ${m.iconBg} ${m.color} border border-slate-200/40 dark:border-glass-border/40 shrink-0`}>
                <m.icon className="h-6 w-6" />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-200 dark:border-glass-border shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-glass-border pb-4">
              <div>
                <h3 className="text-xl font-extrabold text-slate-800 dark:text-white">Course Progress</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Completion stats based on course tasks</p>
              </div>
              <Link to="/courses" className="text-sm font-bold text-purple-600 dark:text-purple-400 hover:text-purple-500 dark:hover:text-purple-300 flex items-center gap-1 group">
                <span>View Courses</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>

            <div className="space-y-6">
              {courseProgress.length > 0 ? (
                courseProgress.map((course) => (
                  <div key={course.id} className="space-y-3">
                    <div className="flex justify-between items-center text-base">
                      <span className="font-bold text-slate-700 dark:text-slate-200">{course.title}</span>
                      <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                        {course.completed}/{course.total} Tasks ({course.rate}%)
                      </span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-slate-200 dark:bg-slate-900/80 overflow-hidden relative border border-slate-300/40 dark:border-glass-border">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${course.rate}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className={`h-full bg-gradient-to-r ${course.color}`}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                  <p className="text-base font-semibold">No courses added yet.</p>
                  <Link to="/courses" className="text-purple-600 dark:text-purple-400 text-sm font-bold hover:underline mt-2 inline-block">Add your first course</Link>
                </div>
              )}
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-glass-border flex flex-col justify-between h-full bg-gradient-to-br from-purple-500/5 to-blue-500/5 dark:from-brand-purple/10 dark:to-brand-blue/5 shadow-sm">
            <div className="space-y-5">
              <div className="flex justify-between items-center border-b border-slate-200 dark:border-glass-border pb-3">
                <span className="text-sm font-extrabold text-purple-600 dark:text-purple-300 tracking-widest uppercase">Motivation</span>
                <button 
                  onClick={rotateQuote}
                  className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>
              
              <motion.div
                key={quoteIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="py-6 space-y-4"
              >
                <p className="text-lg italic font-semibold text-slate-700 dark:text-slate-200 leading-relaxed">
                  &ldquo;{MOTIVATIONAL_QUOTES[quoteIndex].text}&rdquo;
                </p>
                <p className="text-sm text-right text-purple-600 dark:text-purple-400 font-bold">
                  — {MOTIVATIONAL_QUOTES[quoteIndex].author}
                </p>
              </motion.div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-glass-border/40 text-center">
              <div className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 font-medium">
                <Award className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />
                <span>Consistently review goals to stay active</span>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-glass-border shadow-sm">
          <div className="flex justify-between items-center border-b border-slate-200 dark:border-glass-border pb-4 mb-4">
            <div>
              <h3 className="text-xl font-extrabold text-slate-800 dark:text-white">Recent Study Activity</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">History of your logged blocks</p>
            </div>
            <Link to="/study-sessions" className="text-sm font-bold text-purple-600 dark:text-purple-400 hover:text-purple-500 dark:hover:text-purple-300 flex items-center gap-1 group">
              <span>View Focus History</span>
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            {recentSessions.length > 0 ? (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-glass-border text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <th className="py-3.5 px-4 font-bold">Course</th>
                    <th className="py-3.5 px-4 font-bold">Activity</th>
                    <th className="py-3.5 px-4 font-bold">Duration</th>
                    <th className="py-3.5 px-4 font-bold text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-glass-border/30 text-base">
                  {recentSessions.map((session) => (
                    <tr key={session.id} className="hover:bg-slate-100/50 dark:hover:bg-slate-800/20 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-700 dark:text-slate-200">{session.courseTitle}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded text-xs font-semibold uppercase tracking-wider ${
                          session.focusType === 'Pomodoro'
                            ? 'bg-purple-100 text-purple-700 border border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20'
                            : 'bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20'
                        }`}>
                          {session.focusType}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-medium">{session.duration} minutes</td>
                      <td className="py-3.5 px-4 text-right text-slate-500 dark:text-slate-400 font-medium">
                        {new Date(session.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-sm font-semibold">
                No recent study blocks logged. Start a Pomodoro session to log your efforts!
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

function pendingTasksCount(tasks: { status: string }[]) {
  return tasks.filter(t => t.status !== 'Done').length;
}
