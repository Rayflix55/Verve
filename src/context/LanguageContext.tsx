import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import contentEn from '../data/content.json';
import contentEs from '../data/content_es.json';
import contentFr from '../data/content_fr.json';
import contentDe from '../data/content_de.json';
import contentHi from '../data/content_hi.json';
import contentZh from '../data/content_zh.json';

export type Language = 'en' | 'es' | 'fr' | 'de' | 'hi' | 'zh';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  content: typeof contentEn;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Robust deep-merge helper to guarantee type-safety and fallback keys
function deepMerge(target: any, source: any): any {
  if (!source) return target;
  const result = { ...target };
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(target[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('verve-lang') as Language;
      const validLangs: Language[] = ['en', 'es', 'fr', 'de', 'hi', 'zh'];
      if (validLangs.includes(savedLang)) {
        return savedLang;
      }
    }
    return 'en';
  });

  const [content, setContent] = useState<typeof contentEn>(contentEn);

  useEffect(() => {
    let selectedContent = contentEn;
    switch (language) {
      case 'es':
        selectedContent = deepMerge(contentEn, contentEs);
        break;
      case 'fr':
        selectedContent = deepMerge(contentEn, contentFr);
        break;
      case 'de':
        selectedContent = deepMerge(contentEn, contentDe);
        break;
      case 'hi':
        selectedContent = deepMerge(contentEn, contentHi);
        break;
      case 'zh':
        selectedContent = deepMerge(contentEn, contentZh);
        break;
      default:
        selectedContent = contentEn;
    }
    setContent(selectedContent);
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
