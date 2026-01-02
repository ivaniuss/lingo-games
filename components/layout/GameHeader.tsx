'use client';

import React from 'react';

type Difficulty = 'easy' | 'normal' | 'hard';

interface GameHeaderProps {
  title: string;
  description: string;
  puzzleNumber?: number | string;
  difficulty: Difficulty;
  onDifficultyChange: (d: Difficulty) => void;
  difficultyLabels: {
    easy: string;
    normal: string;
    hard: string;
  };
}

export function GameHeader({
  title,
  description,
  puzzleNumber,
  difficulty,
  onDifficultyChange,
  difficultyLabels
}: GameHeaderProps) {
  return (
    <div className="w-full flex flex-col items-center mb-6 md:mb-10">
      {/* Title & Description */}
      <div className="text-center mb-0 animate-in fade-in slide-in-from-bottom-4">
        <h2 className="text-xl md:text-3xl lg:text-4xl font-black uppercase tracking-[0.3em] text-primary mb-4">
          {title}
        </h2>
        <p className="text-text-muted text-sm md:text-base max-w-md mx-auto leading-relaxed px-4">
          {description}
        </p>
      </div>

      {/* Visual Divider */}
      <div className="my-8 flex flex-col items-center">
         <div className="h-8 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>
      </div>

      {/* Difficulty Selector */}
      <div className="flex flex-col items-center gap-3">
         {/* Optional visual separator or label if needed, but spacing + styling helps significantly */}
         <div className="flex items-center gap-2 md:gap-3 p-1.5 md:p-2 bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl animate-in fade-in zoom-in-95 duration-500 shadow-xl">
          {(['easy', 'normal', 'hard'] as const).map((d) => (
            <button
              key={d}
              onClick={() => onDifficultyChange(d)}
              className={`
                relative px-6 py-2.5 md:py-3 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all duration-300 cursor-pointer border
                ${difficulty === d 
                  ? 'bg-primary border-primary text-bg-deep shadow-[0_0_20px_rgba(45,201,172,0.4)] scale-105 z-10' 
                  : 'bg-white/5 border-transparent text-text-muted hover:bg-white/10 hover:border-white/10 hover:text-white hover:scale-105 active:scale-95'
                }
              `}
            >
              {difficultyLabels[d]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
