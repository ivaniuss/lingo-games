'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useLanguage } from '@/context/LanguageContext';
import { languages } from '@/lib/languages';
import { DailyScore } from '@/components/ui/DailyScore';
import { useGameStore } from '@/store/useGameStore';

import React, { useState, useEffect, useMemo } from 'react';
import { HOME_TRANSLATIONS } from '@/lib/translations/home';
import { GameCard } from '@/components/ui/GameCard';

export default function Home() {
  const { language, setLanguage } = useLanguage();
  const isGameComplete = useGameStore((state) => state.isGameComplete);
  const completedGames = useGameStore((state) => state.completedGames);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const t = HOME_TRANSLATIONS[language as keyof typeof HOME_TRANSLATIONS] || HOME_TRANSLATIONS.en;

  const games = useMemo(() => [
    {
      id: 'wordle',
      title: t.games.wordle.title,
      description: t.games.wordle.desc,
      tag: t.daily,
      slug: '/wordle',
      icon: '🔤'
    },
    {
      id: 'grid',
      title: t.games.crossword.title,
      description: t.games.crossword.desc,
      tag: t.daily,
      slug: '/crossword',
      icon: '📝'
    },
    {
      id: 'connections',
      title: t.games.connections.title,
      description: t.games.connections.desc,
      tag: t.new,
      slug: '/connections',
      icon: '🔗'
    }
  ], [t]);

  return (
    <div className="relative min-h-screen flex flex-col bg-deep-radial overflow-x-hidden">
      <Header />

      {/* Spacer Estandarizado */}
      <div className="h-24 md:h-32 lg:h-40" />

      <main className="flex-1 flex flex-col items-center gap-y-12 md:gap-y-16 lg:gap-y-20">

        {/* Hero Section */}
        <section className="w-full max-w-7xl mx-auto px-4 md:px-6 animate-in fade-in slide-in-from-bottom-8">
          <div className="flex flex-col items-center text-center py-4 md:py-6 space-y-4 md:space-y-6">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
              {t.heroTitle} <span className="text-gradient">{t.heroSubtitle}</span>
            </h1>

            {/* Prominent Language Selector in Hero */}
            <div className="flex flex-col items-center gap-6 mt-8 animate-in fade-in slide-in-from-bottom-4 delay-200">
              <span className="text-xs font-black uppercase tracking-[0.3em] text-primary/70">
                {t.getStarted}
              </span>
              <div className="flex flex-wrap justify-center gap-3 md:gap-4">
                {['es', 'en', 'fr', 'pt-BR', 'pt-PT', 'it', 'de'].map((langCode) => {
                  const lang = languages.find(l => l.code === langCode);
                  if (!lang) return null;
                  const isActive = language === lang.code;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => setLanguage(lang.code)}
                      className={`
                        flex items-center gap-3 px-5 py-3 md:px-7 md:py-4 rounded-2xl transition-all duration-500
                        font-bold text-sm md:text-base border shadow-xl relative overflow-hidden cursor-pointer
                        ${isActive
                          ? 'bg-primary text-bg-deep border-primary shadow-primary/30 scale-105 animate-pulse-glow z-10'
                          : 'bg-white/5 text-white/70 border-white/5 hover:bg-white/10 hover:border-white/20 hover:text-white hover:scale-105 active:scale-95'
                        }
                      `}
                    >
                      {isActive ? (
                        <div className="absolute inset-0 bg-white/20 animate-pulse mix-blend-overlay"></div>
                      ) : null}
                      <span className="text-2xl filter drop-shadow-md">{lang.flag}</span>
                      <span className="uppercase tracking-wider">{lang.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Daily Score Section */}
        <section className="w-full max-w-7xl mx-auto px-4 md:px-6 animate-in fade-in slide-in-from-bottom-4 delay-300">
          <DailyScore />
        </section>

        {/* Divider Simplificado */}
        <div className="w-full max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-center gap-4">
            <div className="h-px flex-1 max-w-[100px] bg-gradient-to-r from-transparent via-white/10 to-white/10"></div>
            <h2 className="text-[10px] font-black tracking-[0.4em] uppercase text-text-muted/50 whitespace-nowrap">
              {t.gamesSection}
            </h2>
            <div className="h-px flex-1 max-w-[100px] bg-gradient-to-l from-transparent via-white/10 to-white/10"></div>
          </div>
        </div>

        {/* Games Grid - Más espacio entre cards */}
        <section className="w-full max-w-7xl mx-auto px-4 md:px-6 pb-20 md:pb-24 animate-in fade-in slide-in-from-bottom-4 delay-500">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12">
            {games.map((game) => {
              const checkCompleted = isGameComplete(game.id as 'wordle' | 'connections' | 'grid', language);
              const completed = mounted && checkCompleted;

              return (
                <GameCard
                  key={game.id}
                  game={game}
                  completed={completed}
                  completedGames={completedGames}
                  t={t}
                />
              );
            })}
          </div>
        </section>
        {/* Info Section */}
        <section className="w-full max-w-5xl mx-auto px-4 md:px-6">
          <div className="glass-panel !rounded-3xl !p-10 md:!p-14 text-center hover:!bg-white/5">
            <p className="text-text-muted text-base md:text-lg leading-relaxed font-medium">
              <span className="text-primary font-bold">{t.footerText}</span> {t.footerSub}
            </p>
          </div>
        </section>
        {/* Absolute minimal spacer for tight layout */}
        <div className="h-4 md:h-6 w-full" aria-hidden="true" />
      </main>

      <Footer />
    </div>
  );
}