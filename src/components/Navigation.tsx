import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from './UI/Button';
import { ThemeToggle } from './UI/ThemeToggle';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { Logo } from './Logo';
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
  const { language, setLanguage } = useLanguage();

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
      <div className="fixed top-4 left-4 right-4 z-40 max-w-7xl mx-auto pointer-events-none">
        <motion.nav
          id="navbar"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: isVisible ? 0 : -120, opacity: isVisible ? 1 : 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className={`w-full pointer-events-auto transition-all duration-300 rounded-2xl border ${
            isScrolled
              ? 'py-3.5 bg-white/55 dark:bg-neutral-900/35 backdrop-blur-xl border-white/50 dark:border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.06)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.3)]'
              : 'py-5 bg-white/20 dark:bg-neutral-900/15 backdrop-blur-md border-white/20 dark:border-white/5 shadow-sm'
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
              <div className="h-10 w-10 flex items-center justify-center">
                <Logo className="h-9 w-9" />
              </div>
              <span className="tracking-tight text-neutral-900 dark:text-white font-extrabold">
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
                  className="text-sm font-bold text-neutral-800 dark:text-neutral-100 hover:text-magenta dark:hover:text-magenta transition-colors relative group py-1.5"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-magenta transition-all duration-200 group-hover:w-full" />
                </a>
              ))}
            </div>

            {/* Desktop Right CTA / Mode */}
            <div className="hidden md:flex items-center space-x-4" id="nav-desktop-cta">
              {/* Language Selector Pill */}
              <button
                onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full border border-white/45 dark:border-white/10 bg-white/25 dark:bg-white/5 backdrop-blur-md text-[10px] font-bold text-neutral-800 dark:text-neutral-100 hover:bg-white/35 dark:hover:bg-white/10 transition-all cursor-pointer relative overflow-hidden"
                title="Switch Language"
                id="language-toggle-pill"
              >
                <span className="absolute inset-0 bg-gradient-to-b from-white/15 to-transparent pointer-events-none" />
                <span className={language === 'en' ? 'text-magenta font-black' : 'opacity-60'}>EN</span>
                <span className="opacity-30">|</span>
                <span className={language === 'es' ? 'text-magenta font-black' : 'opacity-60'}>ES</span>
              </button>

              <ThemeToggle />
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleLinkClick('#contact')}
                id="get-started-cta"
              >
                {language === 'es' ? 'Comenzar' : 'Get Started'}
              </Button>
            </div>

            {/* Mobile Right Controls */}
            <div className="flex md:hidden items-center space-x-3.5" id="nav-mobile-controls">
              {/* Mobile Language Selector */}
              <button
                onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
                className="flex items-center space-x-1 px-2.5 py-1 rounded-full border border-white/40 dark:border-white/10 bg-white/20 dark:bg-white/5 backdrop-blur-md text-[10px] font-bold text-neutral-800 dark:text-neutral-100 hover:bg-white/30 transition-all cursor-pointer relative"
              >
                <span className={language === 'en' ? 'text-magenta' : 'opacity-60'}>EN</span>
                <span className="opacity-30">|</span>
                <span className={language === 'es' ? 'text-magenta' : 'opacity-60'}>ES</span>
              </button>

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
      </div>

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
                      className="text-lg font-bold text-neutral-800 dark:text-neutral-200 hover:text-magenta dark:hover:text-magenta transition-colors py-2 block border-b border-neutral-100 dark:border-neutral-900"
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
                  {language === 'es' ? 'Comenzar Gratis' : 'Get Started Free'}
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
