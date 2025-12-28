'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { dictionaries, Locale } from '@/app/i18n/dictionaries';

type LanguageContextType = {
  language: Locale;
  setLanguage: (lang: Locale) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Locale>('id');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Locale;
    if (savedLang && (savedLang === 'en' || savedLang === 'id')) {
      setLanguage(savedLang);
    }
    setIsLoaded(true);
  }, []);

  const handleSetLanguage = (lang: Locale) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (path: string) => {
    const keys = path.split('.');
    let current: any = dictionaries[language];
    
    for (const key of keys) {
      if (current[key] === undefined) {
        console.warn(`Translation missing for key: ${path} in language: ${language}`);
        return path;
      }
      current = current[key];
    }
    
    return current as string;
  };

  if (!isLoaded) {
      // Optional: Return null or a loader to prevent flash of wrong language
      // For now, render children to avoid layout shift, it will default to 'id'
      // or we can just return children.
      // returning children immediately because default is 'id' which matches initial server render usually.
      // To strictly avoid hydration mismatch if default was different, we'd need to wait.
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
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
