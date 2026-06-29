import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  ArrowRight, 
  X,
  FileText,
  Clock,
  Sparkles
} from 'lucide-react';
import { usePlanner } from '../context/PlannerContext';
import { PageHero, CoverImage } from '../components/PageHero';

const COLOR_PRESETS = [
  { name: 'Purple Indigo', value: 'from-purple-500 to-indigo-600' },
  { name: 'Blue Cyan', value: 'from-blue-500 to-cyan-600' },
  { name: 'Pink Rose', value: 'from-pink-500 to-rose-600' },
  { name: 'Emerald Teal', value: 'from-emerald-500 to-teal-600' },
  { name: 'Amber Orange', value: 'from-amber-500 to-orange-600' },
];

const COVER_PRESETS = [
  { name: 'Technology/Code', url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop' },
  { name: 'Science/Math', url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=800&auto=format&fit=crop' },
  { name: 'Design/Creative', url: 'https://images.unsplash.com/photo-1561070791-26c113006238?q=80&w=800&auto=format&fit=crop' },
  { name: 'Literature/Arts', url: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=800&auto=format&fit=crop' },
];

export const Courses: React.FC = () => {
  const { courses, tasks, addCourse, deleteCourse } = usePlanner();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState(COLOR_PRESETS[0].value);
  const [coverImage, setCoverImage] = useState(COVER_PRESETS[0].url);
  const [customImage, setCustomImage] = useState('');

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !code) return;

    const finalImage = customImage.trim() || coverImage;
    addCourse(title, code, color, finalImage, description);
    
    setTitle('');
    setCode('');
    setDescription('');
    setColor(COLOR_PRESETS[0].value);
    setCoverImage(COVER_PRESETS[0].url);
    setCustomImage('');
    setIsModalOpen(false);
  };

  const getCourseTaskCount = (courseId: string, status?: string) => {
    const courseTasks = tasks.filter(t => t.courseId === courseId);
    if (!status) return courseTasks.length;
    return courseTasks.filter(t => t.status === status).length;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      <PageHero
        imageUrl="https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=1920&auto=format&fit=crop"
        title="Course Curriculum"
        subtitle="Add, organize, and track your educational modules. Keep study blocks structured and assign targets easily."
        action={
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-brand-purple to-brand-blue text-white font-bold text-sm sm:text-base hover:brightness-110 shadow-lg glow-purple transition-all flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Plus className="h-5 w-5" />
            <span>New Course</span>
          </button>
        }
      />

      <div className="page-container">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {courses.map((course) => {
            const totalTasks = getCourseTaskCount(course.id);
            const completedTasks = getCourseTaskCount(course.id, 'Done');
            const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

            return (
              <motion.div
                key={course.id}
                whileHover={{ y: -6 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                onClick={() => navigate(`/tasks?course=${course.id}`)}
                className="group rounded-2xl overflow-hidden glass-panel border border-slate-200 dark:border-glass-border flex flex-col cursor-pointer shadow-sm hover:shadow-lg dark:hover:shadow-[0_12px_40px_rgba(0,0,0,0.35)] transition-shadow duration-300"
              >
                <div className="h-44 relative overflow-hidden bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-glass-border">
                  <CoverImage
                    src={course.image}
                    alt={course.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent" />

                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="text-xs font-bold uppercase tracking-widest text-white/90 px-2.5 py-1 rounded-md bg-black/40 backdrop-blur-sm border border-white/10">
                      {course.code}
                    </span>
                    <h3 className="text-xl font-bold text-white tracking-wide truncate mt-2">
                      {course.title}
                    </h3>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Are you sure you want to delete ${course.title}? All tasks will be deleted.`)) {
                        deleteCourse(course.id);
                      }
                    }}
                    className="absolute top-3 right-3 p-2 rounded-lg bg-white/90 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white transition-all cursor-pointer opacity-0 group-hover:opacity-100 duration-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <p className="text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed line-clamp-2">
                    {course.description || 'No description provided.'}
                  </p>

                  <div className="grid grid-cols-2 gap-3 py-3 border-y border-slate-200/80 dark:border-glass-border/40 text-sm font-semibold">
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <FileText className="h-4 w-4 text-purple-500 dark:text-purple-400" />
                      <span>{totalTasks} Tasks</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <Clock className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                      <span>{totalTasks - completedTasks} Pending</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-slate-500 dark:text-slate-400">Completion</span>
                      <span className="text-slate-800 dark:text-white">{progress}%</span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-200 dark:bg-slate-900/60 rounded-full overflow-hidden border border-slate-200 dark:border-glass-border/40">
                      <div 
                        className={`h-full bg-gradient-to-r ${course.color} transition-all duration-500`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/tasks?course=${course.id}`);
                    }}
                    className="w-full py-3 rounded-xl border border-slate-200 dark:border-glass-border bg-slate-50 dark:bg-slate-900/40 hover:bg-gradient-to-r hover:from-brand-purple hover:to-brand-blue text-slate-700 dark:text-slate-200 hover:text-white font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer"
                  >
                    <span>Open Course Tasks</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 duration-150" />
                  </button>
                </div>
              </motion.div>
            );
          })}

          {courses.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center p-8 md:p-12 glass-panel border border-slate-200 dark:border-glass-border rounded-3xl text-center space-y-6 max-w-lg mx-auto">
              <div className="w-full h-48 rounded-2xl overflow-hidden relative border border-slate-200 dark:border-glass-border">
                <CoverImage
                  src="https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=800&auto=format&fit=crop"
                  alt="Empty courses"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-slate-900/30 dark:bg-slate-950/50" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-extrabold text-slate-800 dark:text-white">No courses added yet</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 max-w-sm leading-relaxed">
                  Add your first academic course to begin tracking study sessions, tasks, and analytics.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-purple to-brand-blue text-white font-bold text-sm hover:brightness-110 shadow-lg cursor-pointer"
              >
                Create Your First Course
              </button>
            </div>
          )}
        </div>
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
              transition={{ type: 'spring', duration: 0.5 }}
              className="relative w-full max-w-lg glass-panel p-6 rounded-2xl border border-slate-200 dark:border-glass-border shadow-2xl z-10 space-y-5 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center border-b border-slate-200 dark:border-glass-border pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white">Create New Course</h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/40 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreateCourse} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                      Course Code
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. CS-101"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl glass-input text-base"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                      Course Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Computer Science"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl glass-input text-base"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Short course description or syllabus summary..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl glass-input text-base resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Theme Color
                  </label>
                  <div className="flex gap-2.5">
                    {COLOR_PRESETS.map((p) => (
                      <button
                        key={p.value}
                        type="button"
                        onClick={() => setColor(p.value)}
                        className={`h-8 w-8 rounded-full bg-gradient-to-r ${p.value} cursor-pointer transition-all ${
                          color === p.value 
                            ? 'ring-2 ring-purple-500 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 scale-110' 
                            : 'opacity-70 hover:opacity-100 hover:scale-105'
                        }`}
                        title={p.name}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Cover Image
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {COVER_PRESETS.map((p) => (
                      <button
                        key={p.url}
                        type="button"
                        onClick={() => {
                          setCoverImage(p.url);
                          setCustomImage('');
                        }}
                        className={`h-16 rounded-lg overflow-hidden border relative cursor-pointer transition-all ${
                          coverImage === p.url && !customImage
                            ? 'border-brand-purple ring-2 ring-brand-purple/50'
                            : 'border-slate-200 dark:border-glass-border opacity-80 hover:opacity-100'
                        }`}
                      >
                        <CoverImage
                          src={p.url}
                          alt={p.name}
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Custom Image URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={customImage}
                    onChange={(e) => setCustomImage(e.target.value)}
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
                    Create Course
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
