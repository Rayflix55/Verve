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
  const baseStyle = 'relative overflow-hidden rounded-2xl border transition-all duration-300 backdrop-blur-xl';
  const themeStyle = 'bg-white/40 border-white/40 text-neutral-800 dark:bg-neutral-900/45 dark:border-white/10 dark:text-neutral-100 shadow-[0_8px_32px_0_rgba(31,38,135,0.04)]';
  const cursorStyle = onClick ? 'cursor-pointer' : '';

  const cardContent = (
    <div className={`p-6 sm:p-8 ${className}`} id={id}>
      {/* iOS Liquid Glass Top-Edge Highlight */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/15 via-transparent to-transparent pointer-events-none rounded-2xl" />
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
