import { motion } from 'motion/react';
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverLift?: boolean;
  glow?: boolean;
  id?: string;
  onClick?: () => void;
}

export function Card({
  children,
  className = '',
  hoverLift = true,
  glow = false,
  id,
  onClick,
}: CardProps) {
  const baseStyle = 'relative overflow-hidden rounded-2xl border transition-all duration-300 backdrop-blur-md';
  const themeStyle = 'bg-white/80 border-neutral-200/60 text-neutral-800 dark:bg-neutral-900/60 dark:border-neutral-800/80 dark:text-neutral-100';
  const cursorStyle = onClick ? 'cursor-pointer' : '';

  const cardContent = (
    <div className={`p-6 sm:p-8 ${className}`} id={id}>
      {glow && (
        <div className="absolute -right-20 -top-20 -z-10 h-40 w-40 rounded-full bg-magenta/10 blur-3xl pointer-events-none" />
      )}
      {children}
    </div>
  );

  if (hoverLift) {
    return (
      <motion.div
        whileHover={{ y: -6, scale: 1.01 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={`${baseStyle} ${themeStyle} ${cursorStyle} hover:shadow-[0_12px_30px_-10px_rgba(233,30,99,0.15)]`}
        onClick={onClick}
      >
        {cardContent}
      </motion.div>
    );
  }

  return (
    <div className={`${baseStyle} ${themeStyle} ${cursorStyle}`} onClick={onClick}>
      {cardContent}
    </div>
  );
}
