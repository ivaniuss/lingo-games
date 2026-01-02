'use client';

import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useLanguage, languages } from '@/context/LanguageContext';
import { DailyScore } from '@/components/ui/DailyScore';
import { useGameStore } from '@/store/useGameStore';

import React, { useState, useEffect } from 'react';

export default function Home() {
  const { language, setLanguage } = useLanguage();
  const isGameComplete = useGameStore((state) => state.isGameComplete);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  const TRANSLATIONS = {
    en: {
      heroTitle: 'Daily',
      heroSubtitle: 'Play',
      heroDesc: '',
      selectLang: 'Practice:',
      getStarted: 'Practice:',
      gamesSection: 'Games',
      new: 'NEW',
      daily: 'DAILY',
      completed: 'COMPLETED',
      playNow: 'Play Now',
      completedToday: 'Completed Today',
      comingSoon: 'Coming Soon',
      footerText: 'New games every week.',
      footerSub: 'Master languages through play.',
      games: {
        wordle: { title: 'Wordle', desc: 'Guess the hidden word of the day.' },
        crossword: { title: 'Crossword', desc: 'Solve the daily crossword puzzle.' },
        connections: { title: 'Connections', desc: 'Group words by their secret links.' }
      }
    },
    es: {
      heroTitle: 'Juega',
      heroSubtitle: 'Diario',
      heroDesc: '',
      selectLang: 'Practicar:',
      getStarted: 'Practicar:',
      gamesSection: 'Juegos',
      new: 'NUEVO',
      daily: 'DIARIO',
      completed: 'COMPLETADO',
      playNow: 'Jugar Ahora',
      completedToday: 'Completado Hoy',
      comingSoon: 'Próximamente',
      footerText: 'Nuevos juegos cada semana.',
      footerSub: 'Domina idiomas jugando.',
      games: {
        wordle: { title: 'Wordle', desc: 'Adivina la palabra oculta del día.' },
        crossword: { title: 'Crossword', desc: 'Resuelve el crucigrama diario.' },
        connections: { title: 'Conexiones', desc: 'Agrupa palabras por sus enlaces secretos.' }
      }
    },
    fr: {
      heroTitle: 'Jouez',
      heroSubtitle: 'Quotidien',
      heroDesc: '',
      selectLang: 'Pratiquer :',
      getStarted: 'Pratiquer :',
      gamesSection: 'Jeux',
      new: 'NOUVEAU',
      daily: 'QUOTIDIEN',
      completed: 'TERMINÉ',
      playNow: 'Jouer Maintenant',
      completedToday: 'Terminé Aujourd\'hui',
      comingSoon: 'Bientôt',
      footerText: 'Nouveaux jeux chaque semaine.',
      footerSub: 'Maîtrisez les langues par le jeu.',
      games: {
        wordle: { title: 'Wordle', desc: 'Devinez le mot caché du jour.' },
        crossword: { title: 'Crossword', desc: 'Résolvez les mots croisés du jour.' },
        connections: { title: 'Connexions', desc: 'Groupez les mots par leurs liens secrets.' }
      }
    },
    de: {
      heroTitle: 'Täglich',
      heroSubtitle: 'Spielen',
      heroDesc: '',
      selectLang: 'Üben:',
      getStarted: 'Üben:',
      gamesSection: 'Spiele',
      new: 'NEU',
      daily: 'TÄGLICH',
      completed: 'FERTIG',
      playNow: 'Jetzt Spielen',
      completedToday: 'Heute Erledigt',
      comingSoon: 'Demnächst',
      footerText: 'Jede Woche neue Spiele.',
      footerSub: 'Sprachen spielend meistern.',
      games: {
        wordle: { title: 'Wordle', desc: 'Errate das versteckte Wort des Tages.' },
        crossword: { title: 'Crossword', desc: 'Löse das tägliche Kreuzworträtsel.' },
        connections: { title: 'Verbindungen', desc: 'Gruppiere Wörter nach ihren geheimen Verbindungen.' }
      }
    },
    it: {
      heroTitle: 'Gioca',
      heroSubtitle: 'Ogni Giorno',
      heroDesc: '',
      selectLang: 'Praticare:',
      getStarted: 'Praticare:',
      gamesSection: 'Giochi',
      new: 'NUOVO',
      daily: 'QUOTIDIANO',
      completed: 'COMPLETATO',
      playNow: 'Gioca Ora',
      completedToday: 'Completato Oggi',
      comingSoon: 'Prossimamente',
      footerText: 'Nuovi giochi ogni settimana.',
      footerSub: 'Padroneggia le lingue giocando.',
      games: {
        wordle: { title: 'Wordle', desc: 'Indovina la parola nascosta del giorno.' },
        crossword: { title: 'Crossword', desc: 'Risolvi il cruciverba del giorno.' },
        connections: { title: 'Connessioni', desc: 'Raggruppa le parole per i loro legami segreti.' }
      }
    },
    pt: {
      heroTitle: 'Jogue',
      heroSubtitle: 'Diário',
      heroDesc: '',
      selectLang: 'Praticar:',
      getStarted: 'Praticar:',
      gamesSection: 'Jogos',
      new: 'NOVO',
      daily: 'DIÁRIO',
      completed: 'CONCLUÍDO',
      playNow: 'Jogar Agora',
      completedToday: 'Concluído Hoje',
      comingSoon: 'Em Breve',
      footerText: 'Novos jogos toda semana.',
      footerSub: 'Domine idiomas jogando.',
      games: {
        wordle: { title: 'Wordle', desc: 'Adivinhe a palavra oculta do dia.' },
        crossword: { title: 'Crossword', desc: 'Resolva as palavras cruzadas diárias.' },
        connections: { title: 'Conexões', desc: 'Agrupe palavras pelos seus laços secretos.' }
      }
    }
  };

  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS] || TRANSLATIONS.en;

  const games = [
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
  ];

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
                      {isActive && (
                        <div className="absolute inset-0 bg-white/20 animate-pulse mix-blend-overlay"></div>
                      )}
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
            {games.map((game, index) => {
              const checkCompleted = isGameComplete(game.id as 'wordle' | 'connections' | 'grid');
              const completed = mounted && (game.id === 'crossword' ? isGameComplete('crossword') : checkCompleted);

              return (
                <div key={game.id} className="group h-full">
                  <Link 
                    href={game.slug === '#' ? '#' : game.slug}
                    className={`
                      relative glass-panel h-full flex flex-col items-center !p-10 !rounded-[2.5rem]
                      border border-white/5 hover:border-primary/30 transition-all duration-700
                      hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)]
                      ${game.slug === '#' ? 'opacity-50 cursor-not-allowed scale-[0.98]' : 'hover:-translate-y-3 cursor-pointer'}
                      overflow-hidden
                    `}
                    onClick={(e) => game.slug === '#' && e.preventDefault()}
                  >
                    {/* Inner Shimmer Effect on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                    
                    {/* Icon Container with refined size */}
                    <div className="mb-10 relative">
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
                    <p className="text-text-muted text-sm md:text-base leading-relaxed text-center mb-8 flex-1 px-6 group-hover:text-text-muted/100 transition-colors">
                      {game.description}
                    </p>
                    
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