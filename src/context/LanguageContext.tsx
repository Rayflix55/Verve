import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import contentEn from '../data/content.json';
import contentEs from '../data/content_es.json';

export type Language = 'en' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  content: typeof contentEn;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('verve-lang') as Language;
      if (savedLang === 'en' || savedLang === 'es') {
        return savedLang;
      }
    }
    return 'en';
  });

  const [content, setContent] = useState<typeof contentEn>(contentEn);

  useEffect(() => {
    if (language === 'es') {
      setContent(contentEs as any);
    } else {
      setContent(contentEn);
    }
    localStorage.setItem('verve-lang', language);
  }, [language]);

  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, content }} id="language-provider">
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
