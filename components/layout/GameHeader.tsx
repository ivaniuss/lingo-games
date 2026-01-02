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
      <div className="text-center mb-6 animate-in fade-in slide-in-from-bottom-4">
        <h2 className="text-xl md:text-3xl lg:text-4xl font-black uppercase tracking-[0.3em] text-primary mb-4">
          {title}
        </h2>
        <p className="text-text-muted text-sm md:text-base max-w-md mx-auto leading-relaxed">
          {description}
        </p>
      </div>

      {/* Difficulty Selector */}
      <div className="flex items-center gap-2 p-1.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl animate-in fade-in zoom-in-95 duration-500">
        {(['easy', 'normal', 'hard'] as const).map((d) => (
          <button
            key={d}
            onClick={() => onDifficultyChange(d)}
            className={`
              relative px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 cursor-pointer
              ${difficulty === d 
                ? 'bg-primary text-bg-deep shadow-[0_0_20px_rgba(45,201,172,0.3)] scale-105' 
                : 'text-text-muted hover:text-white hover:bg-white/10 hover:scale-105 active:scale-95'
              }
            `}
          >
            {difficultyLabels[d]}
          </button>
        ))}
      </div>
    </div>
  );
}
