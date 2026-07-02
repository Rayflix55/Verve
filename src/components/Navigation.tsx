import { useState, useEffect } from 'react';
import { Menu, X, Sparkles } from 'lucide-react';
import { Button } from './UI/Button';
import { ThemeToggle } from './UI/ThemeToggle';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'motion/react';

interface NavLink {
  label: string;
  href: string;
}

interface NavigationProps {
  links: NavLink[];
}

export function Navigation({ links }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { theme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Scroll threshold for adding blur/border
      if (currentScrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Hide navigation on scroll down, show on scroll up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false); // scrolling down
      } else {
        setIsVisible(true); // scrolling up
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLinkClick = (href: string) => {
    setIsOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <motion.nav
        id="navbar"
        initial={{ y: 0 }}
        animate={{ y: isVisible ? 0 : -100 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'py-4 bg-white/70 dark:bg-neutral-950/70 backdrop-blur-md border-b border-neutral-200/50 dark:border-neutral-800/50 shadow-sm'
            : 'py-6 bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('#home');
            }}
            className="flex items-center space-x-2.5 font-bold text-xl sm:text-2xl text-neutral-900 dark:text-white hover:opacity-90"
            id="nav-logo"
          >
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-magenta to-cyan flex items-center justify-center shadow-lg shadow-magenta/15 text-white">
              <Sparkles className="h-5 w-5 fill-white/10" />
            </div>
            <span className="tracking-tight">
              Verve<span className="text-magenta font-black">.</span>
            </span>
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8" id="nav-desktop-links">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link.href);
                }}
                className="text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-magenta dark:hover:text-magenta transition-colors relative group py-1.5"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-magenta transition-all duration-200 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* Desktop Right CTA / Mode */}
          <div className="hidden md:flex items-center space-x-4" id="nav-desktop-cta">
            <ThemeToggle />
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleLinkClick('#contact')}
              id="get-started-cta"
            >
              Get Started
            </Button>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex md:hidden items-center space-x-3.5" id="nav-mobile-controls">
            <ThemeToggle />
            <button
              onClick={toggleMenu}
              className="p-2 rounded-full border border-neutral-200 bg-white/40 dark:border-neutral-800 dark:bg-neutral-900/40 text-neutral-600 dark:text-neutral-300 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800"
              aria-label="Toggle navigation menu"
              id="nav-hamburger"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleMenu}
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
            id="mobile-nav-overlay"
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-0 bottom-0 w-[280px] bg-white dark:bg-neutral-950 p-6 shadow-2xl flex flex-col justify-between"
            >
              <div className="space-y-8 pt-16">
                <div className="flex flex-col space-y-6">
                  {links.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      onClick={(e) => {
                        e.preventDefault();
                        handleLinkClick(link.href);
                      }}
                      className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 hover:text-magenta dark:hover:text-magenta transition-colors py-2 block border-b border-neutral-100 dark:border-neutral-900"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pb-8">
                <Button
                  variant="primary"
                  className="w-full justify-center"
                  onClick={() => handleLinkClick('#contact')}
                  id="mobile-get-started"
                >
                  Get Started Free
                </Button>
                <div className="text-center text-xs text-neutral-500 dark:text-neutral-400">
                  © 2026 Verve AI Productivity
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
