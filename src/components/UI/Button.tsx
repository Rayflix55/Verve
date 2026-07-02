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
  const baseStyle = 'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

  const sizeStyles = {
    sm: 'px-4 py-1.5 text-xs',
    md: 'px-6 py-2.5 text-sm',
    lg: 'px-8 py-3.5 text-base',
  };

  const variantStyles = {
    primary: 'bg-gradient-to-r from-magenta to-cyan text-white shadow-lg hover:shadow-magenta/20 focus:ring-magenta hover:brightness-110',
    secondary: 'bg-neutral-800 text-white hover:bg-neutral-700 border border-neutral-700 focus:ring-neutral-600 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:border-neutral-700',
    outline: 'border border-neutral-300 text-neutral-800 hover:bg-neutral-50 focus:ring-neutral-400 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-900',
    ghost: 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-neutral-100',
    accent: 'bg-magenta text-white shadow-lg shadow-magenta/10 hover:bg-opacity-90 hover:shadow-magenta/20 focus:ring-magenta',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyle} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
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
