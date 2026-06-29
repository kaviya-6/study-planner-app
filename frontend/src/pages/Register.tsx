import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, UserPlus, ArrowRight, GraduationCap } from 'lucide-react';
import { usePlanner } from '../context/PlannerContext';
import { AuthLayout } from '../components/AuthLayout';

export const Register: React.FC = () => {
  const { registerUser } = usePlanner();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await registerUser(name, email.trim().toLowerCase(), password);
      navigate('/');
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { error?: string } } };
      if (!axiosErr.response) {
        setError('Cannot reach the server. Make sure the backend is running on port 5000.');
      } else {
        setError(axiosErr.response?.data?.error || 'Registration failed. Try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      heroTitle={
        <>
          Join the ranks of{' '}
          <span className="text-purple-600 dark:text-purple-400">highly structured</span> students.
        </>
      }
      heroDescription="Create structural learning schedules, optimize Pomodoro work sessions, and visually verify your weekly target achievements."
      metrics={[
        { value: '100%', label: 'GDPR Compliant Data' },
        { value: 'Free', label: 'For Active Students' },
      ]}
    >
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4 lg:hidden">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-brand-purple to-brand-blue">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
        </div>
        <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Create Account</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">Sign up in seconds to jumpstart your study planner</p>
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
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alex Carter"
              className="w-full pl-12 pr-4 py-3.5 rounded-xl glass-input text-base"
              required
            />
          </div>
        </div>

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
          <label className="block text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 6 characters"
              className="w-full pl-12 pr-4 py-3.5 rounded-xl glass-input text-base"
              required
            />
          </div>
        </div>

        <div className="flex items-start">
          <input
            id="terms"
            type="checkbox"
            required
            className="mt-1 h-4 w-4 rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-purple-600 focus:ring-purple-500/40 cursor-pointer"
          />
          <label
            htmlFor="terms"
            className="ml-2 block text-sm text-slate-600 dark:text-slate-300 select-none leading-relaxed cursor-pointer"
          >
            I certify that I agree to the{' '}
            <a href="#terms" className="text-purple-600 dark:text-purple-400 hover:underline font-semibold">
              Terms of Service
            </a>{' '}
            and understand the{' '}
            <a href="#privacy" className="text-purple-600 dark:text-purple-400 hover:underline font-semibold">
              Privacy Policy
            </a>.
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
              <span>Create Account</span>
              <UserPlus className="h-5 w-5" />
            </>
          )}
        </motion.button>
      </form>

      <div className="mt-8 text-center text-base text-slate-600 dark:text-slate-300">
        Already have an account?{' '}
        <Link
          to="/login"
          className="text-purple-600 dark:text-purple-400 hover:text-purple-500 dark:hover:text-purple-300 font-bold inline-flex items-center gap-1.5 group"
        >
          Sign in here
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 duration-150" />
        </Link>
      </div>
    </AuthLayout>
  );
};
