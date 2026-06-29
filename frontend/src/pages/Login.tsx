import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, ArrowRight, GraduationCap } from 'lucide-react';
import { usePlanner } from '../context/PlannerContext';
import { AuthLayout } from '../components/AuthLayout';

export const Login: React.FC = () => {
  const { loginUser } = usePlanner();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await loginUser(email.trim().toLowerCase(), password);
      navigate('/');
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { error?: string } } };
      if (!axiosErr.response) {
        setError('Cannot reach the server. Make sure the backend is running on port 5000.');
      } else {
        setError(axiosErr.response?.data?.error || 'Invalid email or password.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      heroTitle={
        <>
          Elevate your learning with{' '}
          <span className="text-purple-600 dark:text-purple-400">intelligent scheduling</span>.
        </>
      }
      heroDescription="Streamline your course materials, manage deadlines seamlessly, and focus deeply with custom Pomodoro modules built for high-performance students."
      metrics={[
        { value: '4.9x', label: 'Focus Session Yield' },
        { value: '96%', label: 'Deadline Accuracy' },
      ]}
    >
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4 lg:hidden">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-brand-purple to-brand-blue">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
        </div>
        <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Welcome Back</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">Enter your credentials to access your planner</p>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm font-semibold"
        >
          {error}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@university.edu"
              className="w-full pl-12 pr-4 py-3.5 rounded-xl glass-input text-base"
              required
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
              Password
            </label>
            <a
              href="#forgot"
              className="text-sm font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-500 dark:hover:text-purple-300 transition-colors"
            >
              Forgot Password?
            </a>
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-12 pr-4 py-3.5 rounded-xl glass-input text-base"
              required
            />
          </div>
        </div>

        <div className="flex items-center">
          <input
            id="remember"
            type="checkbox"
            className="h-4 w-4 rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-purple-600 focus:ring-purple-500/40 cursor-pointer"
          />
          <label
            htmlFor="remember"
            className="ml-2 block text-base text-slate-600 dark:text-slate-300 select-none cursor-pointer"
          >
            Keep me signed in for 30 days
          </label>
        </div>

        <motion.button
          whileHover={{ scale: 1.02, boxShadow: '0 0 25px rgba(124, 58, 237, 0.4)' }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-brand-purple to-brand-blue text-white font-bold text-base cursor-pointer shadow-lg transition-shadow hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <span>Sign In</span>
              <LogIn className="h-5 w-5" />
            </>
          )}
        </motion.button>
      </form>

      <div className="mt-8 text-center text-base text-slate-600 dark:text-slate-300">
        Don&apos;t have an account?{' '}
        <Link
          to="/register"
          className="text-purple-600 dark:text-purple-400 hover:text-purple-500 dark:hover:text-purple-300 font-bold inline-flex items-center gap-1.5 group"
        >
          Register here
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 duration-150" />
        </Link>
      </div>
    </AuthLayout>
  );
};
