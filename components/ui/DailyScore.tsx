'use client';

import { useGameStore } from '@/store/useGameStore';
import { useLanguage, languages } from '@/context/LanguageContext';
import { useMemo } from 'react';

const TRANSLATIONS = {
  en: { label: 'Daily Score', max: 'Total games', all_lang_max: 'All languages max', breakdown: 'Points per Language' },
  es: { label: 'Puntuación Diaria', max: 'Total juegos', all_lang_max: 'Máx (Todos los idiomas)', breakdown: 'Puntos por Idioma' },
  fr: { label: 'Score Quotidien', max: 'Jeux totaux', all_lang_max: 'Max (Toutes langues)', breakdown: 'Points par Langue' },
  de: { label: 'Tägliche Punktzahl', max: 'Spiele gesamt', all_lang_max: 'Max (Alle Sprachen)', breakdown: 'Punkte pro Sprache' },
  it: { label: 'Punteggio Giornaliero', max: 'Giochi totali', all_lang_max: 'Max (Tutte le lingue)', breakdown: 'Punti per Lingua' },
  pt: { label: 'Pontuação Diária', max: 'Total de jogos', all_lang_max: 'Máx (Todos idiomas)', breakdown: 'Pontos por Idioma' },
  'pt-BR': { label: 'Pontuação Diária', max: 'Total de jogos', all_lang_max: 'Máx (Todos idiomas)', breakdown: 'Pontos por Idioma' },
  'pt-PT': { label: 'Pontuação Diária', max: 'Total de jogos', all_lang_max: 'Máx (Todos idiomas)', breakdown: 'Pontos por Idioma' }
};

interface DailyScoreProps {
  variant?: 'compact' | 'full';
  className?: string;
}

export function DailyScore({ variant = 'full', className = '' }: DailyScoreProps) {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS] || TRANSLATIONS.en;
  
  const gameStates = useGameStore((state) => state.gameStates);
  
  // Calculate total score and max score
  const { wins, losses, maxScore, allLangMaxScore, allLangWins, allLangLosses, langScores } = useMemo(() => {
    // Primary UX: show progress for the currently selected language
    const baseGames = ['wordle', 'connections', 'grid'] as const;
    const gamesCount = baseGames.length;

    const resolveState = (game: (typeof baseGames)[number], langCode: string) => {
      const directKey = `${game}-${langCode}`;
      const direct = gameStates[directKey];
      if (direct) return direct;

      if (langCode.startsWith('pt-')) {
        const legacyPtKey = `${game}-pt`;
        const legacyPt = gameStates[legacyPtKey];
        if (legacyPt && (legacyPt.language === 'pt' || legacyPt.language === langCode)) return legacyPt;
      }

      const legacy = gameStates[game];
      if (!legacy) return undefined;

      if (langCode === 'en') return legacy;
      if (legacy.language === langCode) return legacy;
      return undefined;
    };

    const getOutcome = (game: (typeof baseGames)[number], state: unknown) => {
      if (!state || typeof state !== 'object') return undefined;
      const s = state as Record<string, unknown>;

      if (s.gameState === 'won' || s.gameState === 'lost') return s.gameState;

      if (game === 'grid' && s.status === 'finished') {
        return s.attemptsRemaining === 0 ? 'lost' : 'won';
      }

      return undefined;
    };

    let winsThisLang = 0;
    let lossesThisLang = 0;
    baseGames.forEach((g) => {
      const state = resolveState(g, language);
      const outcome = getOutcome(g, state);
      if (outcome === 'won') winsThisLang++;
      if (outcome === 'lost') lossesThisLang++;
    });

    // Optional: completionist totals across all languages
    const allLangMax = gamesCount * languages.length;
    let totalWinsAllLang = 0;
    let totalLossesAllLang = 0;

    languages.forEach((l) => {
      baseGames.forEach((g) => {
        const state = resolveState(g, l.code);
        const outcome = getOutcome(g, state);
        if (outcome === 'won') totalWinsAllLang++;
        if (outcome === 'lost') totalLossesAllLang++;
      });
    });

    // Calculate score per language (for the flags breakdown)
    const scores: Record<string, number> = {};
    languages.forEach((l) => {
      let score = 0;
      baseGames.forEach((g) => {
        const state = resolveState(g, l.code);
        const outcome = getOutcome(g, state);
        if (outcome === 'won') score++;
      });
      if (score > 0) scores[l.code] = score;
    });

    return {
      wins: winsThisLang,
      losses: lossesThisLang,
      maxScore: gamesCount,
      allLangMaxScore: allLangMax,
      allLangWins: totalWinsAllLang,
      allLangLosses: totalLossesAllLang,
      langScores: scores,
    };
  }, [gameStates, language]);

  const completed = wins + losses;
  const allLangCompleted = allLangWins + allLangLosses;

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
        <div className="text-[10px] font-bold text-text-muted/40 uppercase tracking-wider">
           {t.all_lang_max}: {allLangMaxScore}
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
            {completed} <span className="text-sm text-primary/40 font-bold">/ {maxScore}</span>
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

      <div className="text-[10px] font-bold text-text-muted/40 uppercase tracking-wider">
        {allLangCompleted} / {allLangMaxScore} • {allLangLosses}
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
