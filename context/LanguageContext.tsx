'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type Language = 'en' | 'es' | 'fr' | 'de' | 'it' | 'pt-BR' | 'pt-PT';

interface LanguageOption {
  code: Language;
  name: string;
  flag: string;
}

export const languages: LanguageOption[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt-BR', name: 'Português (Brasil)', flag: '🇧🇷' },
  { code: 'pt-PT', name: 'Português (Portugal)', flag: '🇵🇹' },
];

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const savedRaw = typeof window !== 'undefined' ? localStorage.getItem('lingo-language') : null;
    const migrateLegacy = (val: string | null): Language | null => {
      if (!val) return null;
      if (val === 'pt') return 'pt-BR';
      if (languages.find(l => l.code === val)) return val as Language;
      return null;
    };
    const migrated = migrateLegacy(savedRaw);
    
    if (migrated) {
      setLanguageState(migrated);
    } else if (typeof navigator !== 'undefined' && navigator.language) {
      const lower = navigator.language.toLowerCase();
      if (lower.startsWith('pt')) {
        setLanguageState(lower.includes('br') ? 'pt-BR' : 'pt-PT');
      } else {
        const map2: Record<string, Language> = { en: 'en', es: 'es', fr: 'fr', de: 'de', it: 'it' };
        const two = lower.slice(0, 2);
        if (map2[two]) setLanguageState(map2[two]);
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('lingo-language', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
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
