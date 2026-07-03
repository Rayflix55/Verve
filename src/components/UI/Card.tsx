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
  const baseStyle = 'relative overflow-hidden premium-glow-card';
  const themeStyle = 'text-neutral-800 dark:text-neutral-100';
  const cursorStyle = onClick ? 'cursor-pointer' : '';

  const cardContent = (
    <div className={`relative z-10 p-6 sm:p-8 ${className}`} id={id}>
      {/* Dynamic ambient color gradients */}
      <div className="card-ambient-overlay" />
      {/* iOS Liquid Glass Top-Edge Highlight */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-transparent pointer-events-none rounded-[28px]" />
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
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className={`${baseStyle} ${themeStyle} ${cursorStyle}`}
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
