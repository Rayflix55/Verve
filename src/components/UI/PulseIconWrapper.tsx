import { motion } from 'motion/react';
import React, { ReactNode } from 'react';

interface PulseIconWrapperProps {
  children: ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function PulseIconWrapper({
  children,
  className = '',
  size = 'md',
}: PulseIconWrapperProps) {
  const sizeClasses = {
    sm: 'h-10 w-10 rounded-xl',
    md: 'h-14 w-14 rounded-2xl',
    lg: 'h-16 w-16 rounded-3xl',
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {/* Outer Pulse Glow Background (Framer Motion animated) */}
      <motion.div
        animate={{
          scale: [1, 1.04, 1],
          opacity: [0.35, 0.55, 0.35],
          boxShadow: [
            '0 0 12px 1px rgba(233, 30, 99, 0.25)', // Magenta
            '0 0 24px 2px rgba(0, 188, 212, 0.55)',  // Cyan
            '0 0 12px 1px rgba(233, 30, 99, 0.25)', // Magenta
          ],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute inset-0 rounded-inherit -z-10 blur-[8px] pointer-events-none"
        style={{ borderRadius: 'inherit' }}
      />

      {/* Main Inner Container */}
      <motion.div
        animate={{
          borderColor: [
            'rgba(233, 30, 99, 0.2)', // Magenta
            'rgba(0, 188, 212, 0.4)', // Cyan
            'rgba(233, 30, 99, 0.2)', // Magenta
          ],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className={`relative z-10 flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 border shadow-sm transition-all duration-300 w-full h-full`}
        style={{ borderRadius: 'inherit' }}
      >
        {children}
      </motion.div>
    </div>
  );
}
