import { motion } from 'motion/react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggleTheme}
      className="p-2 rounded-full border border-neutral-200 bg-white/40 backdrop-blur-md text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900/40 dark:text-neutral-300 hover:text-magenta dark:hover:text-magenta transition-colors cursor-pointer focus:outline-none"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      id="theme-toggle"
    >
      <motion.div
        key={theme}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        exit={{ rotate: 90, opacity: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="h-5 w-5 flex items-center justify-center"
      >
        {theme === 'light' ? <Moon className="h-4.5 w-4.5" /> : <Sun className="h-4.5 w-4.5 text-yellow-400" />}
      </motion.div>
    </motion.button>
  );
}
