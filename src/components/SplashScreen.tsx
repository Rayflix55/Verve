import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Logo } from './Logo';

interface SplashScreenProps {
  onComplete: () => void;
  key?: React.Key;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Elegant progressive loading simulator
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 400); // Slight delay for satisfaction
          return 100;
        }
        // Organic, pseudo-random loading speed
        const increment = Math.floor(Math.random() * 15) + 10;
        return Math.min(prev + increment, 100);
      });
    }, 150);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0,
        scale: 1.05,
        filter: 'blur(8px)',
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
      }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-neutral-950 transition-colors duration-500 overflow-hidden"
      id="splash-screen-container"
    >
      {/* Dynamic Background Glow Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[500px] h-[500px] rounded-full bg-magenta/5 dark:bg-magenta/10 blur-[120px] animate-pulse pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 -z-10 w-80 h-80 rounded-full bg-cyan/5 blur-[100px] pointer-events-none animate-bounce duration-10000" />

      {/* Main Logo and Branding container */}
      <div className="flex flex-col items-center" id="splash-logo-wrapper">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            duration: 0.9, 
            ease: [0.16, 1, 0.3, 1] 
          }}
          className="relative h-28 w-28 sm:h-32 sm:w-32 flex items-center justify-center mb-8"
        >
          {/* Outer Rotating/Pulse rings for tech-forward feel */}
          <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
            <circle
              cx="50%"
              cy="50%"
              r="46%"
              className="stroke-neutral-100 dark:stroke-neutral-900"
              strokeWidth="2"
              fill="transparent"
            />
            <motion.circle
              cx="50%"
              cy="50%"
              r="46%"
              className="stroke-magenta"
              strokeWidth="2.5"
              fill="transparent"
              strokeDasharray="290"
              animate={{ strokeDashoffset: 290 - (290 * progress) / 100 }}
              transition={{ ease: 'easeInOut' }}
              strokeLinecap="round"
            />
          </svg>

          {/* Core App Logo with ambient glow */}
          <div className="relative p-5 h-20 w-20 sm:h-24 sm:w-24 bg-white/40 dark:bg-neutral-900/40 rounded-full border border-neutral-200/30 dark:border-white/5 backdrop-blur-md shadow-lg flex items-center justify-center">
            <Logo className="h-12 w-12 sm:h-14 sm:w-14 text-neutral-900 dark:text-white" />
            <div className="absolute inset-0 bg-magenta/5 dark:bg-magenta/10 rounded-full blur-xl animate-pulse" />
          </div>
        </motion.div>

        {/* Wordmark */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white"
          id="splash-brand-text"
        >
          Verve<span className="text-magenta font-black">.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-xs sm:text-sm text-neutral-400 dark:text-neutral-500 font-medium uppercase tracking-[0.25em] mt-3"
        >
          Simplified by AI
        </motion.p>
      </div>

      {/* Progress bar text */}
      <div className="absolute bottom-16 flex flex-col items-center gap-2" id="splash-progress-wrapper">
        <span className="text-[10px] font-mono font-bold tracking-widest text-neutral-400 dark:text-neutral-500 uppercase">
          Optimizing Workspace {progress}%
        </span>
        <div className="w-40 h-[2px] bg-neutral-100 dark:bg-neutral-900 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-magenta to-cyan"
            style={{ width: `${progress}%` }}
            transition={{ ease: 'easeInOut' }}
          />
        </div>
      </div>
    </motion.div>
  );
}
