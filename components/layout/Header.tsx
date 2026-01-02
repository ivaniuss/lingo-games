'use client';

import Link from 'next/link';
import { useLanguage, languages } from '@/context/LanguageContext';
import React, { useEffect, useRef, useState } from 'react';
import { DailyScore } from '@/components/ui/DailyScore';

export function Header() {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, []);
  const currentLang = languages.find(l => l.code === language);

  return (
    <header className="fixed top-0 left-0 w-full h-24 md:h-32 z-50 bg-bg-deep/80 backdrop-blur-md border-b border-white/10 transition-all duration-300">
      
      {/* Layer 1: Logo Absolute Center (Viewport Relative) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div className="pointer-events-auto">
          <Link href="/" className="group flex flex-col items-center">
            <h2 className="text-2xl md:text-3xl font-black italic tracking-tighter transition-all group-hover:scale-105 whitespace-nowrap">
              LINGO<span className="text-primary">GAMES</span>
            </h2>
            <div className="h-1 w-12 bg-primary rounded-full mt-1 scale-x-0 group-hover:scale-x-100 transition-transform origin-center"></div>
          </Link>
        </div>
      </div>

      {/* Layer 2: Controls Container (Full Width) */}
      <div className="relative w-full h-full px-6 md:px-12 lg:px-16 flex items-center justify-between pointer-events-none z-10">
        
        {/* Left section - Compact Daily Score */}
        <div className="flex justify-start items-center pointer-events-auto">
          <DailyScore variant="compact" />
        </div>

        {/* Right section - Language Selector */}
        <div className="flex justify-end items-center gap-2 pointer-events-auto">
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={open}
              onClick={() => setOpen(o => !o)}
              className="flex items-center gap-3 bg-white/5 hover:bg-white/10 px-4 py-3 md:px-5 md:py-3.5 rounded-2xl border border-white/10 transition-all shadow-lg active:scale-95"
            >
              <div className="hidden sm:flex flex-col items-end mr-1">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-0.5">Learning</span>
                <span className="text-xs font-black uppercase tracking-widest text-white" suppressHydrationWarning>{currentLang?.name}</span>
              </div>
              <span className="text-2xl md:text-3xl filter drop-shadow-md" suppressHydrationWarning>{currentLang?.flag}</span>
              <svg
                className={`w-4 h-4 text-white/40 transition-transform duration-300 ${open ? 'rotate-180 text-white' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <div
              className={`absolute right-0 top-full pt-3 w-64 transition-all duration-500 z-60 ${
                open ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'
              }`}
            >
              <div className="bg-[#0a0f13]/95 backdrop-blur-xl border border-white/20 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden">
                {/* Header */}
                <div className="px-6 pt-6 pb-3">
                  <div className="text-[10px] font-black uppercase tracking-[0.15em] text-text-muted/50 border-b border-white/5 pb-3">
                    Select Language
                  </div>
                </div>
                
                {/* Language Options */}
                <div className="px-4 pb-5 grid grid-cols-1 gap-1.5" role="menu">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setOpen(false);
                      }}
                      className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 text-left w-full
                        ${language === lang.code
                          ? 'bg-primary/20 text-primary border border-primary/20'
                          : 'hover:bg-white/5 text-text-muted hover:text-white border border-transparent'}`}
                    >
                      <span className="text-2xl filter drop-shadow-sm">{lang.flag}</span>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold tracking-tight">{lang.name}</span>
                      </div>
                      {language === lang.code && (
                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_10px_rgba(45,201,172,0.8)]"></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}