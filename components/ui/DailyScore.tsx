'use client';

import { useGameStore } from '@/store/useGameStore';
import { useLanguage, languages } from '@/context/LanguageContext';
import { useMemo } from 'react';

const TRANSLATIONS = {
  en: { label: 'Daily Score', max: 'Max Possible', breakdown: 'Points per Language' },
  es: { label: 'Puntuación Diaria', max: 'Máximo Posible', breakdown: 'Puntos por Idioma' },
  fr: { label: 'Score Quotidien', max: 'Maximum Possible', breakdown: 'Points par Langue' },
  de: { label: 'Tägliche Punktzahl', max: 'Maximal Möglich', breakdown: 'Punkte pro Sprache' },
  it: { label: 'Punteggio Giornaliero', max: 'Massimo Possibile', breakdown: 'Punti per Lingua' },
  pt: { label: 'Pontuação Diária', max: 'Máximo Possível', breakdown: 'Pontos por Idioma' },
  'pt-BR': { label: 'Pontuação Diária', max: 'Máximo Possível', breakdown: 'Pontos por Idioma' },
  'pt-PT': { label: 'Pontuação Diária', max: 'Máximo Possível', breakdown: 'Pontos por Idioma' }
};

interface DailyScoreProps {
  variant?: 'compact' | 'full';
  className?: string;
}

export function DailyScore({ variant = 'full', className = '' }: DailyScoreProps) {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS] || TRANSLATIONS.en;
  
  const dailyScores = useGameStore((state) => state.dailyScores);
  const gameStates = useGameStore((state) => state.gameStates);
  
  // Calculate total score and max score
  const { wins, losses, maxScore, langScores } = useMemo(() => {
    // Basic totals from dailyScores (which aggregates all wins)
    const totalWins = dailyScores.wordle.wins + dailyScores.connections.wins + dailyScores.grid.wins + (dailyScores.crossword?.wins || 0);
    const totalLosses = dailyScores.wordle.losses + dailyScores.connections.losses + dailyScores.grid.losses + (dailyScores.crossword?.losses || 0);
    
    // Max possible score = Games * Languages
    // We have 3 main games: Wordle, Connections, Crossword (Grid)
    const gamesCount = 3; 
    const maxPoss = gamesCount * languages.length;

    // Calculate score per language
    const scores: Record<string, number> = {};
    languages.forEach(l => {
      let score = 0;
      const games = ['wordle', 'connections', 'grid', 'crossword'];
      games.forEach(g => {
        // Check strict key or legacy key for 'en'
        const key = `${g}-${l.code}`;
        const state = gameStates[key] || (l.code === 'en' ? gameStates[g] : undefined);
        if (state?.gameState === 'won') {
          score++;
        }
      });
      if (score > 0) scores[l.code] = score;
    });

    return { 
      wins: totalWins, 
      losses: totalLosses, 
      maxScore: maxPoss,
      langScores: scores
    };
  }, [dailyScores, gameStates]);

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
    <div className={`flex flex-col items-center gap-4 mb-6 md:mb-8 animate-in fade-in slide-in-from-top-4 ${className}`}>
      <div className="flex flex-col items-center gap-1">
        <div className="text-[10px] md:text-xs font-black tracking-[0.3em] uppercase text-text-muted/60">
          {t.label}
        </div>
        
        {/* Max Score Helper */}
        <div className="text-[10px] font-bold text-primary/40 uppercase tracking-wider">
           {t.max}: {maxScore}
        </div>
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
            {wins} <span className="text-sm text-primary/40 font-bold">/ {maxScore}</span>
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

      {/* Language Breakdown */}
      {Object.keys(langScores).length > 0 && (
         <div className="flex gap-2 flex-wrap justify-center max-w-md animate-in fade-in slide-in-from-bottom-2">
            {Object.entries(langScores).map(([code, score]) => {
              const lang = languages.find(l => l.code === code);
              if (!lang) return null;
              return (
                <div key={code} className="px-2 py-1 bg-white/5 rounded-lg border border-white/5 flex items-center gap-2">
                   <span className="text-lg filter drop-shadow">{lang.flag}</span>
                   <span className="text-xs font-bold text-white/80 tabular-nums">+{score}</span>
                </div>
              );
            })}
         </div>
      )}
    </div>
  );
}
