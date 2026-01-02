'use client';

import Link from 'next/link';
import { useLanguage, languages } from '@/context/LanguageContext';
import React, { useState, useEffect } from 'react';
import { DailyScore } from '@/components/ui/DailyScore';
import { usePathname } from 'next/navigation';
import { SOCIAL_CONFIG } from '@/lib/social-config';

export function Header() {
  const { language } = useLanguage();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const isHomePage = pathname === '/';
  const currentLang = languages.find(l => l.code === language);

  return (
    <header className="fixed top-0 left-0 w-full h-24 md:h-32 z-50 bg-bg-deep/80 backdrop-blur-md border-b border-white/10 transition-all duration-300">
      
      {/* Layer 1: Logo Absolute Center (Viewport Relative) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div className="pointer-events-auto">
          <Link href="/" className="group flex flex-col items-center">
            <h2 className="text-xl md:text-3xl font-black italic tracking-tighter transition-all group-hover:scale-110 whitespace-nowrap animate-shimmer">
              <span className="text-white">LINGO</span><span className="text-primary group-hover:drop-shadow-[0_0_8px_rgba(45,201,172,0.8)] transition-all">GAMES</span>
            </h2>
            <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary to-transparent rounded-full mt-1 scale-x-0 group-hover:scale-x-100 transition-transform origin-center duration-500"></div>
          </Link>
        </div>
      </div>

      {/* Layer 2: Controls Container (Full Width) */}
      <div className="relative w-full h-full px-4 md:px-12 lg:px-16 flex items-center justify-between pointer-events-none z-10">
        
        {/* Left section - Compact Daily Score */}
        <div className="flex justify-start items-center pointer-events-auto">
          <DailyScore variant="compact" />
        </div>

        {/* Right section - Controls */}
        <div className="flex justify-end items-center gap-3 md:gap-6 pointer-events-auto">
          
          {/* Social Links - Responsive icons */}
          <div className="flex items-center gap-2 md:gap-3">
            <a 
              href={SOCIAL_CONFIG.twitter.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all hover:-translate-y-1"
              aria-label="X (Twitter)"
            >
              <svg className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a 
              href={SOCIAL_CONFIG.instagram.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all hover:-translate-y-1"
              aria-label="Instagram"
            >
              <svg className="w-3.5 h-3.5 md:w-5 md:h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path></svg>
            </a>
            <a 
              href={SOCIAL_CONFIG.email.url} 
              className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all hover:-translate-y-1"
              aria-label="Contact Email"
            >
              <svg className="w-3.5 h-3.5 md:w-5 md:h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            </a>
          </div>

          <div className="w-px h-5 md:h-6 bg-white/10"></div>

          {/* Static Language Indicator */}
          {mounted && (
            <div className="flex items-center gap-2 md:gap-3 px-3 py-2 md:px-5 md:py-3.5 rounded-xl md:rounded-2xl border border-white/5 bg-white/5 opacity-80 select-none">
              <div className="hidden xs:flex flex-col items-end mr-1">
                <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-0.5">
                  {isHomePage ? 'Learning' : 'Playing'}
                </span>
                <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-white">{currentLang?.name}</span>
              </div>
              <span className="text-xl md:text-3xl filter drop-shadow-md">{currentLang?.flag}</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}