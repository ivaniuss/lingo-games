'use client';

import React from 'react';
import Link from 'next/link';
import { languages } from '@/lib/languages';

interface GameCardProps {
    game: {
        id: string;
        title: string;
        description: string;
        tag: string;
        slug: string;
        icon: string;
    };
    completed: boolean;
    completedGames: Record<string, boolean>;
    t: Record<string, any>;
}

export const GameCard = React.memo(({ game, completed, completedGames, t }: GameCardProps) => {
    return (
        <div className="group h-full">
            <Link
                href={game.slug === '#' ? '#' : game.slug}
                className={`
          relative glass-panel h-full flex flex-col items-center !p-10 !rounded-[2.5rem]
          border border-white/5 hover:border-primary/30 transition-all duration-700
          hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)]
          ${game.slug === '#' ? 'opacity-50 cursor-not-allowed scale-[0.98]' : 'hover:-translate-y-3 cursor-pointer'}
          overflow-hidden
        `}
                onClick={(e) => game.slug === '#' ? e.preventDefault() : null}
            >
                {/* Inner Shimmer Effect on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

                {/* Icon Container with refined size */}
                <div className="mb-6 relative">
                    <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-0 group-hover:scale-150 transition-transform duration-1000"></div>
                    <div className={`
            w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-surface border border-white/10 flex items-center justify-center
            text-4xl md:text-5xl shadow-2xl transition-all duration-500 group-hover:rotate-[10deg] group-hover:scale-110 relative z-10
            ${completed ? 'border-primary/40 shadow-[0_0_20px_rgba(45,201,172,0.2)]' : ''}
          `}>
                        {game.icon}
                    </div>
                </div>

                {/* Title */}
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-black mb-4 tracking-tight text-center text-gradient px-4 group-hover:text-white transition-colors">
                    {game.title}
                </h3>

                {/* Description */}
                <p className="text-text-muted text-sm md:text-base leading-relaxed text-center mb-6 flex-1 px-6 group-hover:text-text-muted/100 transition-colors">
                    {game.description}
                </p>

                {/* Completed Languages Indicators */}
                {(() => {
                    const completedLangs = languages.filter(l => {
                        const key = `${game.id}-${l.code}`;
                        return completedGames[key] || (l.code === 'en' && completedGames[game.id]);
                    });

                    return completedLangs.length > 0 ? (
                        <div className="mb-6 flex flex-col items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-primary/60">
                                {t.completed}:
                            </span>
                            <div className="flex gap-2 flex-wrap justify-center px-4">
                                {completedLangs.map(l => (
                                    <span
                                        key={l.code}
                                        className="text-xl filter drop-shadow-md hover:scale-125 transition-transform cursor-help"
                                        title={l.name}
                                    >
                                        {l.flag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ) : null;
                })()}

                {/* CTA Button */}
                <div className={`
          w-full py-4 md:py-5 rounded-2xl text-center
          text-xs font-black uppercase tracking-[0.3em]
          transition-all duration-500
          ${completed
                        ? 'bg-primary/20 border border-primary/20 text-primary'
                        : game.slug === '#'
                            ? 'bg-white/5 border border-white/5 text-text-muted/50'
                            : 'bg-white/5 border border-white/10 text-primary group-hover:bg-primary group-hover:text-bg-deep group-hover:shadow-[0_0_40px_rgba(45,201,172,0.4)] group-hover:border-primary/50'
                    }
        `}>
                    {completed ? t.completedToday : game.slug === '#' ? t.comingSoon : t.playNow}
                </div>
            </Link>
        </div>
    );
});

GameCard.displayName = 'GameCard';
