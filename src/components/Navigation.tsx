import { useState, useEffect, useRef } from 'react';
import { Menu, X, Globe, ChevronDown } from 'lucide-react';
import { Button } from './UI/Button';
import { ThemeToggle } from './UI/ThemeToggle';
import { useTheme } from '../context/ThemeContext';
import { useLanguage, Language } from '../context/LanguageContext';
import { Logo } from './Logo';
import { motion, AnimatePresence } from 'motion/react';

interface NavLink {
  label: string;
  href: string;
}

interface NavigationProps {
  links: NavLink[];
}

const LANGUAGES = [
  { code: 'en' as Language, name: 'English', short: 'EN', flag: '🇺🇸' },
  { code: 'es' as Language, name: 'Español', short: 'ES', flag: '🇪🇸' },
  { code: 'fr' as Language, name: 'Français', short: 'FR', flag: '🇫🇷' },
  { code: 'de' as Language, name: 'Deutsch', short: 'DE', flag: '🇩🇪' },
  { code: 'hi' as Language, name: 'हिन्दी', short: 'HI', flag: '🇮🇳' },
  { code: 'zh' as Language, name: '中文', short: 'ZH', flag: '🇨🇳' },
];

export function Navigation({ links }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMobileLangOpen, setIsMobileLangOpen] = useState(false);

  const desktopLangRef = useRef<HTMLDivElement>(null);
  const mobileLangRef = useRef<HTMLDivElement>(null);

  const { theme } = useTheme();
  const { language, setLanguage } = useLanguage();

  const currentLangObj = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

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
        setIsLangOpen(false); // close dropdown when scrolling
      } else {
        setIsVisible(true); // scrolling up
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Click outside to close language dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (desktopLangRef.current && !desktopLangRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
      if (mobileLangRef.current && !mobileLangRef.current.contains(event.target as Node)) {
        setIsMobileLangOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    setIsMobileLangOpen(false);
  };

  const handleLinkClick = (href: string) => {
    setIsOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const selectLanguage = (code: Language) => {
    setLanguage(code);
    setIsLangOpen(false);
    setIsMobileLangOpen(false);
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
              ? 'py-3 bg-white/75 dark:bg-neutral-900/40 backdrop-blur-xl border-white/50 dark:border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.06)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.3)]'
              : 'py-4.5 bg-white/20 dark:bg-neutral-900/15 backdrop-blur-md border-white/20 dark:border-white/5 shadow-sm'
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
              
              {/* High Contrast Language Dropdown */}
              <div className="relative" ref={desktopLangRef}>
                <button
                  onClick={() => setIsLangOpen(!isLangOpen)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 text-xs font-bold text-neutral-800 dark:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all cursor-pointer shadow-sm"
                  title="Switch Language"
                  id="language-dropdown-toggle"
                >
                  <Globe className="h-3.5 w-3.5 text-magenta" />
                  <span className="tracking-wide uppercase text-[11px] font-black">{currentLangObj.short}</span>
                  <ChevronDown className={`h-3 w-3 text-neutral-400 transition-transform duration-200 ${isLangOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isLangOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className="absolute right-0 mt-2 w-44 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xl py-1.5 z-50 overflow-hidden"
                      id="language-dropdown-menu"
                    >
                      <div className="px-3 py-1 text-[9px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest border-b border-neutral-100 dark:border-neutral-800 mb-1">
                        Select Language
                      </div>
                      {LANGUAGES.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => selectLanguage(lang.code)}
                          className={`w-full text-left px-3.5 py-2 text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                            language === lang.code
                              ? 'bg-magenta/10 text-magenta dark:bg-magenta/20 dark:text-magenta-300'
                              : 'text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:text-magenta dark:hover:text-magenta'
                          }`}
                        >
                          <span className="flex items-center space-x-2">
                            <span className="text-[14px]">{lang.flag}</span>
                            <span>{lang.name}</span>
                          </span>
                          {language === lang.code && (
                            <span className="h-1.5 w-1.5 rounded-full bg-magenta" />
                          )}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <ThemeToggle />
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleLinkClick('#contact')}
                id="get-started-cta"
              >
                {language === 'es' ? 'Comenzar' : 
                 language === 'fr' ? 'Commencer' :
                 language === 'de' ? 'Starten' :
                 language === 'hi' ? 'शुरू करें' :
                 language === 'zh' ? '立即开始' : 'Get Started'}
              </Button>
            </div>

            {/* Mobile Right Controls */}
            <div className="flex md:hidden items-center space-x-3" id="nav-mobile-controls">
              
              {/* Mobile Language Selector Dropdown */}
              <div className="relative" ref={mobileLangRef}>
                <button
                  onClick={() => setIsMobileLangOpen(!isMobileLangOpen)}
                  className="flex items-center space-x-1 px-2.5 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 text-[10px] font-bold text-neutral-800 dark:text-neutral-100 hover:bg-neutral-50 transition-all cursor-pointer shadow-sm"
                >
                  <Globe className="h-3 w-3 text-magenta" />
                  <span className="tracking-wide uppercase font-black">{currentLangObj.short}</span>
                  <ChevronDown className="h-2.5 w-2.5 text-neutral-400" />
                </button>

                <AnimatePresence>
                  {isMobileLangOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-1.5 w-36 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xl py-1 z-50 overflow-hidden"
                    >
                      {LANGUAGES.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => selectLanguage(lang.code)}
                          className={`w-full text-left px-3 py-1.5 text-[11px] font-bold transition-colors flex items-center space-x-2 ${
                            language === lang.code
                              ? 'bg-magenta/10 text-magenta dark:bg-magenta/20'
                              : 'text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                          }`}
                        >
                          <span className="text-xs">{lang.flag}</span>
                          <span>{lang.name}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <ThemeToggle />
              <button
                onClick={toggleMenu}
                className="p-1.5 rounded-full border border-neutral-200 bg-white/40 dark:border-neutral-800 dark:bg-neutral-900/40 text-neutral-600 dark:text-neutral-300 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800"
                aria-label="Toggle navigation menu"
                id="nav-hamburger"
              >
                {isOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
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
                  {language === 'es' ? 'Comenzar Gratis' : 
                   language === 'fr' ? 'Commencer Gratuitement' :
                   language === 'de' ? 'Kostenlos Starten' :
                   language === 'hi' ? 'मुफ़्त शुरू करें' :
                   language === 'zh' ? '免费开始使用' : 'Get Started Free'}
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
