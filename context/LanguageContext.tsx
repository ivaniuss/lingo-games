'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Language, languages } from '@/lib/languages';
import { StreakManager } from '@/lib/streaks';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [language, setLanguageState] = useState<Language>('en');

  // Helper to check if a code is valid
  const isValidLang = useCallback((code: string | null): code is Language => {
    if (!code) return false;
    if (code === 'pt') return false; // Legacy check handled elsewhere
    return languages.some(l => l.code === code);
  }, []);

  // Set language and update URL/Storage
  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);

    // Update Storage
    if (typeof window !== 'undefined') {
      localStorage.setItem('lingo-language', lang);
    }

    // Update URL without a full reload
    const params = new URLSearchParams(searchParams.toString());
    params.set('lang', lang);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [pathname, router, searchParams]);

  useEffect(() => {
    const langParam = searchParams.get('lang');
    const savedRaw = localStorage.getItem('lingo-language');

    const migrateLegacy = (val: string | null): Language | null => {
      if (!val) return null;
      if (val === 'pt') return 'pt-BR';
      if (languages.find(l => l.code === val)) return val as Language;
      return null;
    };

    // Priority: 1. URL Param, 2. LocalStorage, 3. Browser Navigator
    if (isValidLang(langParam)) {
      setLanguageState(langParam as Language);
    } else {
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
    }
  }, [searchParams, isValidLang, setLanguageState]);

  useEffect(() => {
    StreakManager.validateStreak();
  }, []);

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
