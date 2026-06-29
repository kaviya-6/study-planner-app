import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  Calendar,
  X,
  CheckSquare,
  ListTodo,
  Loader,
  CircleCheck
} from 'lucide-react';
import { usePlanner } from '../context/PlannerContext';
import { PageHero, CoverImage } from '../components/PageHero';

type TaskStatus = 'To Do' | 'In Progress' | 'Done';

const STATUS_CONFIG: Record<TaskStatus, { label: string; dot: string; icon: React.ElementType }> = {
  'To Do': { label: 'To Do', dot: 'bg-slate-400', icon: ListTodo },
  'In Progress': { label: 'In Progress', dot: 'bg-amber-400', icon: Loader },
  'Done': { label: 'Done', dot: 'bg-emerald-400', icon: CircleCheck },
};

export const Tasks: React.FC = () => {
  const { courses, tasks, addTask, updateTaskStatus, deleteTask } = usePlanner();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeCourseId = searchParams.get('course') || 'all';
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [courseId, setCourseId] = useState(courses[0]?.id || '');
  const [deadline, setDeadline] = useState('');

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !courseId) return;

    addTask(courseId, title, deadline);
    setTitle('');
    setDeadline('');
    setIsModalOpen(false);
  };

  const scopedTasks = tasks.filter(t => activeCourseId === 'all' || t.courseId === activeCourseId);

  const getCourseColor = (id: string) => {
    return courses.find(c => c.id === id)?.color || 'from-purple-500 to-indigo-600';
  };

  const getCourseCode = (id: string) => {
    return courses.find(c => c.id === id)?.code || 'GEN';
  };

  const openNewTaskModal = () => {
    if (courses.length === 0) {
      alert('Please add a course first before creating tasks.');
      return;
    }
    setIsModalOpen(true);
  };

  const renderTaskCard = (task: typeof tasks[0]) => (
    <motion.div
      key={task.id}
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="task-card relative p-4 pl-5 space-y-3 overflow-hidden"
    >
      <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${getCourseColor(task.courseId)}`} />

      <div className="flex items-start gap-3">
        <button
          onClick={() => {
            const nextStatus: TaskStatus = task.status === 'Done' ? 'To Do' : 'Done';
            updateTaskStatus(task.id, nextStatus);
          }}
          className="mt-0.5 shrink-0 cursor-pointer transition-all hover:scale-110"
        >
          {task.status === 'Done' ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          ) : (
            <Circle className="h-5 w-5 text-slate-400 hover:text-purple-500" />
          )}
        </button>

        <div className="flex-1 min-w-0 space-y-2">
          <p className={`text-sm font-bold leading-snug ${
            task.status === 'Done' ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-100'
          }`}>
            {task.title}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide bg-gradient-to-r ${getCourseColor(task.courseId)} text-white`}>
              {getCourseCode(task.courseId)}
            </span>
            {task.deadline && (
              <span className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                <Calendar className="h-3 w-3" />
                {new Date(task.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={() => deleteTask(task.id)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer shrink-0"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="flex items-center gap-2 pl-8">
        <select
          value={task.status}
          onChange={(e) => updateTaskStatus(task.id, e.target.value as TaskStatus)}
          className="flex-1 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-glass-border rounded-lg text-xs font-semibold px-2 py-1.5 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-brand-purple cursor-pointer"
        >
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
      </div>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      <PageHero
        imageUrl="https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=1920&auto=format&fit=crop"
        title="Study Assignments & Tasks"
        subtitle="Organize homework, reviews, and milestones. Filter by course and track progress on a Trello-style board."
        action={
          <button
            onClick={openNewTaskModal}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-brand-purple to-brand-blue text-white font-bold text-sm sm:text-base hover:brightness-110 shadow-lg glow-purple transition-all flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Plus className="h-5 w-5" />
            <span>New Task</span>
          </button>
        }
      />

      <div className="page-container space-y-6">
        {/* Filters & View Toggle */}
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
          <div className="flex gap-2 overflow-x-auto pb-1 max-w-full">
            <button
              onClick={() => setSearchParams({})}
              className={`px-4 py-2.5 rounded-xl text-sm font-bold border transition-all cursor-pointer whitespace-nowrap ${
                activeCourseId === 'all'
                  ? 'bg-purple-600 border-purple-600 text-white shadow-md'
                  : 'border-slate-200 dark:border-glass-border text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'
              }`}
            >
              All Courses
            </button>
            {courses.map((c) => (
              <button
                key={c.id}
                onClick={() => setSearchParams({ course: c.id })}
                className={`px-4 py-2.5 rounded-xl text-sm font-bold border transition-all cursor-pointer whitespace-nowrap ${
                  activeCourseId === c.id
                    ? 'bg-purple-600 border-purple-600 text-white shadow-md'
                    : 'border-slate-200 dark:border-glass-border text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                }`}
              >
                {c.code}
              </button>
            ))}
          </div>

          <div className="flex bg-slate-100 dark:bg-slate-900/60 p-1 rounded-xl border border-slate-200 dark:border-glass-border">
            {(['board', 'list'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer capitalize ${
                  viewMode === mode
                    ? 'bg-white dark:bg-brand-purple text-slate-800 dark:text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4">
          {(['To Do', 'In Progress', 'Done'] as TaskStatus[]).map((status) => {
            const count = scopedTasks.filter(t => t.status === status).length;
            const config = STATUS_CONFIG[status];
            return (
              <div key={status} className="glass-panel rounded-xl p-4 border border-slate-200 dark:border-glass-border flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full ${config.dot}`} />
                <div>
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{config.label}</p>
                  <p className="text-2xl font-extrabold text-slate-800 dark:text-white">{count}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Board / List View */}
        {scopedTasks.length > 0 ? (
          viewMode === 'board' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {(['To Do', 'In Progress', 'Done'] as TaskStatus[]).map((status) => {
                const columnTasks = scopedTasks.filter(t => t.status === status);
                const config = STATUS_CONFIG[status];
                const Icon = config.icon;

                return (
                  <div key={status} className="kanban-column p-4 space-y-3 min-h-[280px]">
                    <div className="flex items-center gap-2 px-1 pb-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${config.dot}`} />
                      <Icon className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                      <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">{config.label}</h3>
                      <span className="ml-auto px-2 py-0.5 rounded-full text-xs font-bold bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {columnTasks.length}
                      </span>
                    </div>

                    <AnimatePresence mode="popLayout">
                      <div className="space-y-3 relative">
                        {columnTasks.map((task) => (
                          <div key={task.id} className="relative">
                            {renderTaskCard(task)}
                          </div>
                        ))}
                      </div>
                    </AnimatePresence>

                    {columnTasks.length === 0 && (
                      <p className="text-center text-xs text-slate-400 dark:text-slate-500 py-8 font-medium">
                        No tasks here
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {scopedTasks.map((task) => (
                  <div key={task.id} className="relative">
                    {renderTaskCard(task)}
                  </div>
                ))}
              </AnimatePresence>
            </div>
          )
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 glass-panel rounded-3xl border border-slate-200 dark:border-glass-border max-w-lg mx-auto space-y-6"
          >
            <div className="w-full h-44 rounded-2xl overflow-hidden relative border border-slate-200 dark:border-glass-border mx-auto max-w-sm">
              <CoverImage
                src="https://images.unsplash.com/photo-1512314889357-e157c22f938d?q=80&w=800&auto=format&fit=crop"
                alt="No tasks"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-slate-900/20 dark:bg-slate-950/40" />
            </div>
            <div className="space-y-2 px-6">
              <CheckSquare className="h-8 w-8 mx-auto text-purple-500 dark:text-purple-400" />
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">No tasks found</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Try changing your course filter or create a new task to get started.
              </p>
            </div>
            <button
              onClick={openNewTaskModal}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-purple to-brand-blue text-white font-bold text-sm hover:brightness-110 shadow-lg cursor-pointer"
            >
              Create First Task
            </button>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/50 dark:bg-slate-950/70 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md glass-panel p-6 rounded-2xl border border-slate-200 dark:border-glass-border shadow-2xl z-10 space-y-5"
            >
              <div className="flex justify-between items-center border-b border-slate-200 dark:border-glass-border pb-3">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">Add Study Task</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/40 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreateTask} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Course Module
                  </label>
                  <select
                    value={courseId}
                    onChange={(e) => setCourseId(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl glass-input text-base cursor-pointer"
                    required
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.code} — {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Task Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Write recursion algorithms homework"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl glass-input text-base"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl glass-input text-base"
                  />
                </div>

                <div className="flex gap-3 justify-end pt-3 border-t border-slate-200 dark:border-glass-border/40">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-glass-border hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-sm cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-purple to-brand-blue text-white font-bold text-base hover:brightness-110 shadow-lg cursor-pointer"
                  >
                    Add Task
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
