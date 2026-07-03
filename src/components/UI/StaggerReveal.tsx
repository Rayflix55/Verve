import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';

// Highly-polished Bezier curve for ultra-premium slide & fade-in entrance
export const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
};

export const staggerItemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1], // Custom ultra-smooth easeOutExpo-like curve
    },
  },
};

interface StaggerContainerProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  id?: string;
  once?: boolean;
  margin?: string;
}

export function StaggerContainer({
  children,
  className = '',
  id,
  once = true,
  margin = '-100px',
  ...props
}: StaggerContainerProps) {
  return (
    <motion.div
      id={id}
      variants={staggerContainerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
}

export function StaggerItem({
  children,
  className = '',
  ...props
}: StaggerItemProps) {
  return (
    <motion.div
      variants={staggerItemVariants}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
