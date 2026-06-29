import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

const DARK_HERO_IMAGE =
  'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=1200&auto=format&fit=crop';
const LIGHT_HERO_IMAGE =
  'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop';

interface AuthMetric {
  value: string;
  label: string;
}

interface AuthLayoutProps {
  children: React.ReactNode;
  heroTitle: React.ReactNode;
  heroDescription: string;
  metrics: AuthMetric[];
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  heroTitle,
  heroDescription,
  metrics,
}) => {
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 dark:bg-[#030712] dark:text-slate-100 overflow-hidden transition-colors duration-300">
      {/* Theme toggle — available on auth pages */}
      <div className="fixed top-5 right-5 z-50">
        <ThemeToggle />
      </div>

      {/* Left side: Premium Animated Banner (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-100 dark:bg-slate-900 justify-center items-center overflow-hidden border-r border-slate-200 dark:border-glass-border transition-colors duration-300">
        {/* Light mode hero */}
        <img
          src={LIGHT_HERO_IMAGE}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center opacity-80 dark:hidden"
          referrerPolicy="no-referrer"
        />
        {/* Dark mode hero */}
        <img
          src={DARK_HERO_IMAGE}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center opacity-55 hidden dark:block scale-105 transition-transform duration-[20s] hover:scale-100"
          referrerPolicy="no-referrer"
        />

        {/* Light overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/92 via-white/75 to-white/40 dark:hidden" />
        {/* Dark overlay */}
        <div className="absolute inset-0 hidden dark:block bg-gradient-to-tr from-slate-950 via-slate-900/75 to-transparent" />

        {/* Floating gradient circles */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-brand-purple/15 dark:bg-brand-purple/20 blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-brand-blue/15 dark:bg-brand-blue/20 blur-[120px] animate-pulse delay-700" />

        {/* Content */}
        <div className="relative z-10 p-12 max-w-lg text-left">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-brand-purple to-brand-blue glow-purple">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <span className="font-extrabold text-2xl bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
              StudyFlow
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl font-extrabold tracking-tight mb-4 leading-tight text-slate-900 dark:text-white"
          >
            {heroTitle}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed mb-8"
          >
            {heroDescription}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-2 gap-4"
          >
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-glass-border shadow-sm"
              >
                <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{metric.value}</p>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">{metric.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Right side: Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="absolute top-10 right-10 w-48 h-48 rounded-full bg-brand-purple/10 blur-[80px] lg:hidden" />
        <div className="absolute bottom-10 left-10 w-48 h-48 rounded-full bg-brand-blue/10 blur-[80px] lg:hidden" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full max-w-md glass-panel p-8 rounded-3xl border border-slate-200 dark:border-glass-border shadow-xl dark:shadow-2xl relative z-10"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
};
