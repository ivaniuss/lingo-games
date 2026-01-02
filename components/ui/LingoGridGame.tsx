'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface LingoGridGameProps {
  rows: string[];
  cols: string[];
  onComplete?: (results: string[][]) => void;
}

const TRANSLATIONS = {
  en: {
    submit: 'Finish Challenge',
    success: 'Good job! You have completed today\'s LingoGrid.',
    playAgain: 'Play Again'
  },
  es: {
    submit: 'Finalizar Reto',
    success: '¡Buen trabajo! Has completado el LingoGrid de hoy.',
    playAgain: 'Jugar de nuevo'
  },
  fr: {
    submit: 'Terminer le défi',
    success: 'Bon travail ! Vous avez terminé le LingoGrid d\'aujourd\'hui.',
    playAgain: 'Rejouer'
  },
  de: {
    submit: 'Herausforderung beenden',
    success: 'Gut gemacht! Du hast das heutige LingoGrid abgeschlossen.',
    playAgain: 'Erneut spielen'
  },
  it: {
    submit: 'Termina la sfida',
    success: 'Ottimo lavoro! Hai completato il LingoGrid di oggi.',
    playAgain: 'Gioca ancora'
  },
  pt: {
    submit: 'Finalizar Desafio',
    success: 'Bom trabalho! Você completou o LingoGrid de hoje.',
    playAgain: 'Jogar novamente'
  }
};

export function LingoGridGame({ rows, cols, onComplete }: LingoGridGameProps) {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS] || TRANSLATIONS.en;

  const [grid, setGrid] = useState<string[][]>(
    Array(3).fill(null).map(() => Array(3).fill(''))
  );
  const [status, setStatus] = useState<'playing' | 'validating' | 'finished'>('playing');

  const handleInputChange = (rowIndex: number, colIndex: number, value: string) => {
    if (status !== 'playing') return;
    
    const newGrid = [...grid];
    newGrid[rowIndex][colIndex] = value.toUpperCase();
    setGrid(newGrid);
  };

  const isCellValid = (rowIndex: number, colIndex: number) => {
    const value = grid[rowIndex][colIndex].trim();
    if (!value) return null;
    return value.startsWith(cols[colIndex]);
  };

  const isGridFull = () => {
    return grid.every(row => row.every(cell => cell.trim().length > 0));
  };

  const handleSubmit = () => {
    if (!isGridFull()) return;
    setStatus('finished');
    if (onComplete) onComplete(grid);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto px-4">
      <div className="grid grid-cols-[auto_1fr_1fr_1fr] gap-3 md:gap-4 w-full">
        {/* Empty top-left cell */}
        <div className="w-12 md:w-20"></div>
        
        {/* Column Headers (Letters) */}
        {cols.map((letter, i) => (
          <div key={i} className="flex items-center justify-center h-12 md:h-16 bg-primary/10 border border-primary/20 rounded-xl text-primary font-black text-xl md:text-2xl">
            {letter}
          </div>
        ))}

        {/* Rows */}
        {rows.map((category, rowIndex) => (
          <div key={`row-${rowIndex}`} className="contents">
            {/* Row Header (Category) */}
            <div className="flex items-center justify-end pr-3 text-[10px] md:text-xs font-black tracking-wider text-text-muted uppercase text-right leading-tight w-12 md:w-20">
              {category}
            </div>
            
            {/* Grid Cells */}
            {grid[rowIndex].map((cell, colIndex) => {
              const valid = status === 'finished' ? isCellValid(rowIndex, colIndex) : null;
              
              return (
                <div key={`${rowIndex}-${colIndex}`} className="relative group">
                  <input
                    type="text"
                    value={cell}
                    onChange={(e) => handleInputChange(rowIndex, colIndex, e.target.value)}
                    disabled={status !== 'playing'}
                    className={`
                      w-full h-14 md:h-20 text-center text-sm md:text-lg font-bold uppercase
                      bg-glass border-2 rounded-2xl transition-all duration-300
                      focus:outline-none focus:ring-2 focus:ring-primary/50
                      ${status === 'playing' 
                        ? 'border-glass-border hover:border-white/20' 
                        : valid === true
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-error bg-error/10 text-error'
                      }
                    `}
                    placeholder={`${cols[colIndex]}...`}
                  />
                  {status === 'playing' && cell && !cell.startsWith(cols[colIndex]) && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-error rounded-full border-2 border-bg-deep animate-pulse"></div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="mt-12 w-full max-w-xs transition-all duration-500">
        <button
          onClick={handleSubmit}
          disabled={!isGridFull() || status !== 'playing'}
          className={`
            w-full py-4 md:py-5 font-black uppercase tracking-[0.2em] rounded-2xl transition-all
            ${isGridFull() && status === 'playing'
              ? 'bg-primary text-bg-deep shadow-lg hover:scale-[1.02] active:scale-95 cursor-pointer'
              : 'bg-white/5 text-text-muted/50 border border-white/5 cursor-not-allowed grayscale'
            }
          `}
        >
          {t.submit}
        </button>
      </div>

      {status === 'finished' && (
        <div className="mt-8 text-center animate-in fade-in slide-in-from-bottom-4">
          <p className="text-text-muted mb-6">
            {t.success}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all"
          >
            {t.playAgain}
          </button>
        </div>
      )}
    </div>
  );
}
