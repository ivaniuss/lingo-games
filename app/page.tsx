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
      heroSubtitle: 'linguistic challenges',
      heroDesc: 'Pick your game and master languages in minutes.',
      selectLang: 'Choose your target language below:',
      getStarted: 'Get started by picking a language',
      gamesSection: 'Games',
      new: 'NEW',
      daily: 'DAILY',
      completed: 'COMPLETED',
      playNow: 'Play Now',
      completedToday: 'Completed Today',
      comingSoon: 'Coming Soon',
      footerText: 'New games every week.',
      footerSub: 'Practice your language skills with fun, challenging puzzles designed for learners of all levels.',
      games: {
        wordle: { title: 'Wordle', desc: 'Guess the hidden 6-letter word.' },
        crossword: { title: 'Crossword', desc: 'Solve the daily crossword puzzle.' },
        connections: { title: 'Connections', desc: 'Group words by their secret links.' }
      }
    },
    es: {
      heroTitle: 'Retos',
      heroSubtitle: 'lingüísticos diarios',
      heroDesc: 'Elige tu juego y domina idiomas en minutos.',
      selectLang: 'Elige tu idioma objetivo abajo:',
      getStarted: 'Empieza eligiendo un idioma',
      gamesSection: 'Juegos',
      new: 'NUEVO',
      daily: 'DIARIO',
      completed: 'COMPLETADO',
      playNow: 'Jugar Ahora',
      completedToday: 'Completado Hoy',
      comingSoon: 'Próximamente',
      footerText: 'Nuevos juegos cada semana.',
      footerSub: 'Practica tus habilidades lingüísticas con puzzles divertidos y desafiantes diseñados para todos los niveles.',
      games: {
        wordle: { title: 'Wordle', desc: 'Adivina la palabra oculta de 6 letras.' },
        crossword: { title: 'Crossword', desc: 'Resuelve el crucigrama diario.' },
        connections: { title: 'Conexiones', desc: 'Agrupa palabras por sus enlaces secretos.' }
      }
    },
    fr: {
      heroTitle: 'Défis',
      heroSubtitle: 'linguistiques quotidiens',
      heroDesc: 'Choisissez votre jeu et maîtrisez les langues en quelques minutes.',
      selectLang: 'Choisissez votre langue cible ci-dessous :',
      getStarted: 'Commencez par choisir une langue',
      gamesSection: 'Jeux',
      new: 'NOUVEAU',
      daily: 'QUOTIDIEN',
      completed: 'TERMINÉ',
      playNow: 'Jouer Maintenant',
      completedToday: 'Terminé Aujourd\'hui',
      comingSoon: 'Bientôt',
      footerText: 'Nouveaux jeux chaque semaine.',
      footerSub: 'Pratiquez vos compétences linguistiques avec des puzzles amusants et stimulants conçus pour tous les niveaux.',
      games: {
        wordle: { title: 'Wordle', desc: 'Devinez le mot caché de 6 lettres.' },
        crossword: { title: 'Crossword', desc: 'Résolvez les mots croisés du jour.' },
        connections: { title: 'Connexions', desc: 'Groupez les mots par leurs liens secrets.' }
      }
    },
    de: {
      heroTitle: 'Tägliche',
      heroSubtitle: 'Sprachherausforderungen',
      heroDesc: 'Wähle dein Spiel und meistere Sprachen in Minuten.',
      selectLang: 'Wähle deine Zielsprache unten:',
      getStarted: 'Beginne mit der Auswahl einer Sprache',
      gamesSection: 'Spiele',
      new: 'NEU',
      daily: 'TÄGLICH',
      completed: 'FERTIG',
      playNow: 'Jetzt Spielen',
      completedToday: 'Heute Erledigt',
      comingSoon: 'Demnächst',
      footerText: 'Jede Woche neue Spiele.',
      footerSub: 'Übe deine Sprachkenntnisse mit lustigen, herausfordernden Rätseln für alle Niveaus.',
      games: {
        wordle: { title: 'Wordle', desc: 'Errate das versteckte 6-Buchstaben-Wort.' },
        crossword: { title: 'Crossword', desc: 'Löse das tägliche Kreuzworträtsel.' },
        connections: { title: 'Verbindungen', desc: 'Gruppiere Wörter nach ihren geheimen Verbindungen.' }
      }
    },
    it: {
      heroTitle: 'Sfide',
      heroSubtitle: 'linguistiche quotidiane',
      heroDesc: 'Scegli il tuo gioco e padroneggia le lingue in pochi minuti.',
      selectLang: 'Scegli la lingua di destinazione qui sotto:',
      getStarted: 'Inizia scegliendo una lingua',
      gamesSection: 'Giochi',
      new: 'NUOVO',
      daily: 'QUOTIDIANO',
      completed: 'COMPLETATO',
      playNow: 'Gioca Ora',
      completedToday: 'Completato Oggi',
      comingSoon: 'Prossimamente',
      footerText: 'Nuovi giochi ogni settimana.',
      footerSub: 'Esercita le tue abilità linguistiche con puzzle divertenti e stimolanti per tutti i livelli.',
      games: {
        wordle: { title: 'Wordle', desc: 'Indovina la parola nascosta di 6 lettere.' },
        crossword: { title: 'Crossword', desc: 'Risolvi il cruciverba del giorno.' },
        connections: { title: 'Connessioni', desc: 'Raggruppa le parole per i loro legami segreti.' }
      }
    },
    pt: {
      heroTitle: 'Desafios',
      heroSubtitle: 'linguísticos diários',
      heroDesc: 'Escolha seu jogo e domine idiomas em minutos.',
      selectLang: 'Escolha seu idioma alvo abaixo:',
      getStarted: 'Comece escolhendo um idioma',
      gamesSection: 'Jogos',
      new: 'NOVO',
      daily: 'DIÁRIO',
      completed: 'CONCLUÍDO',
      playNow: 'Jogar Agora',
      completedToday: 'Concluído Hoje',
      comingSoon: 'Em Breve',
      footerText: 'Novos jogos toda semana.',
      footerSub: 'Pratique suas habilidades linguísticas com quebra-cabeças divertidos e desafiadores para todos os níveis.',
      games: {
        wordle: { title: 'Wordle', desc: 'Adivinhe a palavra oculta de 6 letras.' },
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
      
      <main className="flex-1 flex flex-col items-center gap-y-16 md:gap-y-24 lg:gap-y-32">
        
        {/* Hero Section */}
        <section className="w-full max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center text-center py-6 md:py-10 space-y-6 md:space-y-8">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-white leading-tight">
              {t.heroTitle} <span className="text-gradient">{t.heroSubtitle}</span>
            </h1>
            <p className="text-sm md:text-lg lg:text-xl text-text-muted max-w-2xl mx-auto leading-relaxed font-medium">
              {t.heroDesc} 
              <span className="block mt-2 text-primary/80">{t.selectLang}</span>
            </p>

            {/* Prominent Language Selector in Hero */}
            <div className="flex flex-col items-center gap-6 mt-8">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/60">
                {t.getStarted}
              </span>
              <div className="flex flex-wrap justify-center gap-3 md:gap-4">
                {['es', 'en', 'fr', 'pt-BR', 'pt-PT', 'it', 'de'].map((langCode) => {
                  const lang = languages.find(l => l.code === langCode);
                  if (!lang) return null;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => setLanguage(lang.code)}
                      className={`
                        flex items-center gap-3 px-5 py-3 md:px-7 md:py-4 rounded-2xl transition-all duration-300
                        font-bold text-sm md:text-base border shadow-xl
                        ${language === lang.code 
                          ? 'bg-primary text-bg-deep border-primary shadow-primary/20 scale-105' 
                          : 'bg-white/5 text-white border-white/10 hover:bg-white/10 hover:border-white/20'
                        }
                      `}
                    >
                      <span className="text-2xl">{lang.flag}</span>
                      <span className="uppercase tracking-wider">{lang.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Daily Score Section */}
        <section className="w-full max-w-7xl mx-auto px-4 md:px-6 -mt-8 md:-mt-12">
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
        <section className="w-full max-w-7xl mx-auto px-4 md:px-6 pb-20 md:pb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12">
            {games.map((game, index) => {
              const checkCompleted = isGameComplete(game.id as 'wordle' | 'connections' | 'grid');
              const completed = mounted && checkCompleted;
              
              return (
              <div
                key={game.id}
                className="animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Link 
                  href={completed ? '#' : game.slug}
                  className={`
                    group relative flex flex-col h-full
                    glass-panel transition-all duration-500
                    ${completed || game.slug === '#' 
                      ? 'opacity-50 cursor-not-allowed grayscale' 
                      : 'hover:scale-[1.02] cursor-pointer'
                    }
                  `}
                  onClick={(e) => (completed || game.slug === '#') && e.preventDefault()}
                >
                  {/* Tag Badge */}
                  {game.tag && !completed && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                      <span className={`
                        inline-block text-[9px] md:text-[10px] font-black 
                        px-4 py-2 rounded-full tracking-[0.25em] 
                        shadow-lg border
                        ${['NUEVO', 'NEW', 'NOUVEAU', 'NEU', 'NUOVO', 'NOVO'].includes(game.tag)
                          ? 'bg-primary text-bg-deep border-primary/20' 
                          : 'bg-secondary text-bg-deep border-secondary/20'
                        }
                      `}>
                        {game.tag}
                      </span>
                    </div>
                  )}
                  
                  {/* Completed Badge */}
                  {completed && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                      <span className="inline-block text-[9px] md:text-[10px] font-black px-4 py-2 rounded-full tracking-[0.25em] shadow-lg border bg-white/10 text-white/60 border-white/20">
                        {t.completed}
                      </span>
                    </div>
                  )}
                  
                  {/* Icon - Más espacio arriba */}
                  <div className="flex justify-center pt-4 pb-6 md:pb-8">
                    <div className={`text-7xl md:text-8xl transform transition-all duration-500 drop-shadow-2xl ${!completed && 'group-hover:scale-110 group-hover:-rotate-6'}`}>
                      {game.icon}
                    </div>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-black mb-4 tracking-tight text-center text-gradient px-4">
                    {game.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-text-muted text-sm md:text-base leading-relaxed text-center mb-8 flex-1 px-6">
                    {game.description}
                  </p>
                  
                  {/* CTA Button */}
                  <div className={`
                    w-full py-4 md:py-5 rounded-2xl text-center
                    text-xs font-black uppercase tracking-[0.3em]
                    transition-all duration-300
                    ${completed
                      ? 'bg-white/5 border border-white/5 text-text-muted/50'
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
        <section className="w-full max-w-5xl mx-auto px-4 md:px-6 pb-24 md:pb-32">
          <div className="glass-panel !rounded-3xl !p-10 md:!p-14 text-center hover:!bg-white/5">
            <p className="text-text-muted text-base md:text-lg leading-relaxed">
              <span className="text-primary font-bold">{t.footerText}</span> {t.footerSub}
            </p>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}