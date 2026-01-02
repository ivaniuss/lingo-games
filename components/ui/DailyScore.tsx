'use client';

import { useGameStore } from '@/store/useGameStore';
import { useLanguage } from '@/context/LanguageContext';
import { useMemo } from 'react';

const TRANSLATIONS = {
  en: { label: 'Daily Score' },
  es: { label: 'Puntuación Diaria' },
  fr: { label: 'Score Quotidien' },
  de: { label: 'Tägliche Punktzahl' },
  it: { label: 'Punteggio Giornaliero' },
  pt: { label: 'Pontuação Diária' }
};

interface DailyScoreProps {
  variant?: 'compact' | 'full';
  className?: string;
}

export function DailyScore({ variant = 'full', className = '' }: DailyScoreProps) {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS] || TRANSLATIONS.en;
  
  // Use direct selectors to avoid infinite loop
  const dailyScores = useGameStore((state) => state.dailyScores);
  
  // Calculate total score with useMemo
  const { wins, losses } = useMemo(() => {
    const totalWins = dailyScores.wordle.wins + dailyScores.connections.wins + dailyScores.grid.wins;
    const totalLosses = dailyScores.wordle.losses + dailyScores.connections.losses + dailyScores.grid.losses;
    return { wins: totalWins, losses: totalLosses };
  }, [dailyScores]);

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-3 px-3 py-1.5 bg-white/5 rounded-full border border-white/5 shadow-sm hover:bg-white/10 transition-colors ${className}`}>
        {/* Wins */}
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-full bg-primary/20 border border-primary flex items-center justify-center">
            <svg 
              className="w-2.5 h-2.5 text-primary" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="text-xs font-black text-primary tabular-nums">{wins}</span>
        </div>
        
        {/* Separator */}
        <div className="w-px h-3 bg-white/10"></div>
        
        {/* Losses */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-black text-red-500 tabular-nums">{losses}</span>
          <div className="w-4 h-4 rounded-full bg-red-500/20 border border-red-500 flex items-center justify-center">
            <svg 
              className="w-2.5 h-2.5 text-red-500" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center gap-2 mb-6 md:mb-8 animate-in fade-in slide-in-from-top-4 ${className}`}>
      <div className="text-[10px] md:text-xs font-black tracking-[0.3em] uppercase text-text-muted/60">
        {t.label}
      </div>
      <div className="flex items-center gap-3 md:gap-4 px-6 py-3 md:px-8 md:py-4 bg-glass/30 backdrop-blur-sm border border-white/10 rounded-2xl shadow-xl">
        {/* Wins */}
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
            <svg 
              className="w-3 h-3 md:w-4 md:h-4 text-primary" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="text-xl md:text-2xl font-black text-primary tabular-nums">
            {wins}
          </span>
        </div>

        {/* Separator */}
        <div className="text-xl md:text-2xl font-black text-text-muted/30">-</div>

        {/* Losses */}
        <div className="flex items-center gap-2">
          <span className="text-xl md:text-2xl font-black text-red-500 tabular-nums">
            {losses}
          </span>
          <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center">
            <svg 
              className="w-3 h-3 md:w-4 md:h-4 text-red-500" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
