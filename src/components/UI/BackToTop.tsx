import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp } from 'lucide-react';
import { useState, useEffect } from 'react';

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 sm:left-auto sm:right-6 sm:translate-x-0 z-50">
          <motion.button
            initial={{ opacity: 0, y: 15, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.8 }}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="p-3.5 rounded-full bg-magenta text-white shadow-xl hover:bg-opacity-95 cursor-pointer focus:outline-none shadow-magenta/25 flex items-center justify-center border border-magenta/20"
            aria-label="Back to top"
            id="back-to-top"
          >
            <ArrowUp className="h-5 w-5" strokeWidth={2.5} />
          </motion.button>
        </div>
      )}
    </AnimatePresence>
  );
}
