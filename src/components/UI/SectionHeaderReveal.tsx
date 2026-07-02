import React from 'react';
import { motion } from 'motion/react';

interface SectionHeaderRevealProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function SectionHeaderReveal({
  children,
  className = 'text-center max-w-3xl mx-auto mb-16 sm:mb-20',
  id,
}: SectionHeaderRevealProps) {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1], // Custom ultra-smooth easeOutExpo-like spring curve
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
