import { motion, HTMLMotionProps } from 'motion/react';
import React from 'react';

interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
  className?: string;
  onClick?: any;
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  iconPosition = 'right',
  isLoading = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyle = 'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer relative overflow-hidden';

  const sizeStyles = {
    sm: 'px-4 py-1.5 text-xs',
    md: 'px-6 py-2.5 text-sm',
    lg: 'px-8 py-3.5 text-base',
  };

  const variantStyles = {
    primary: 'bg-gradient-to-r from-magenta to-cyan border border-white/25 dark:border-white/10 text-white shadow-[0_8px_32px_0_rgba(233,30,99,0.15)] backdrop-blur-md hover:brightness-110',
    secondary: 'bg-white/25 dark:bg-white/5 text-neutral-800 dark:text-neutral-200 hover:bg-white/35 dark:hover:bg-white/10 border border-white/40 dark:border-white/10 backdrop-blur-md shadow-sm',
    outline: 'border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 bg-white/10 dark:bg-black/10 hover:bg-white/20 dark:hover:bg-neutral-900/30 backdrop-blur-sm',
    ghost: 'text-neutral-600 hover:bg-neutral-100/50 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-900/30 dark:hover:text-neutral-100',
    accent: 'bg-magenta border border-white/25 dark:border-white/10 text-white shadow-[0_8px_32px_0_rgba(233,30,99,0.2)] backdrop-blur-md hover:brightness-110',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyle} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {/* iOS Liquid Glass Shine Overlay */}
      {(variant === 'primary' || variant === 'accent' || variant === 'secondary') && (
        <span className="absolute inset-0 bg-gradient-to-b from-white/15 to-transparent pointer-events-none rounded-full" />
      )}

      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}

      {!isLoading && icon && iconPosition === 'left' && <span className="mr-2 inline-flex">{icon}</span>}
      <span>{children}</span>
      {!isLoading && icon && iconPosition === 'right' && <span className="ml-2 inline-flex">{icon}</span>}
    </motion.button>
  );
}
