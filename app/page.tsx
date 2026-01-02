'use client';

import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useLanguage, languages } from '@/context/LanguageContext';

export default function Home() {
  const { language, setLanguage } = useLanguage();
  const games = [
    {
      id: 'wordle',
      title: 'LingoWordle',
      description: 'Guess the hidden 6-letter word.',
      tag: 'DAILY',
      slug: '/wordle',
      icon: '🔤'
    },
    {
      id: 'grid',
      title: 'LingoGrid',
      description: 'Find words that match the categories.',
      tag: 'NEW',
      slug: '/grid',
      icon: '🥅'
    },
    {
      id: 'connections',
      title: 'Connections',
      description: 'Group words by their secret links.',
      tag: 'NEW',
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
              Daily <span className="text-gradient">linguistic challenges</span>
            </h1>
            <p className="text-sm md:text-lg lg:text-xl text-text-muted max-w-2xl mx-auto leading-relaxed font-medium">
              Pick your game and master languages in minutes. 
              <span className="block mt-2 text-primary/80">Choose your target language below:</span>
            </p>

            {/* Prominent Language Selector in Hero */}
            <div className="flex flex-col items-center gap-6 mt-8">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/60">
                Get started by picking a language
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

        {/* Divider Simplificado */}
        <div className="w-full max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-center gap-4">
            <div className="h-px flex-1 max-w-[100px] bg-gradient-to-r from-transparent via-white/10 to-white/10"></div>
            <h2 className="text-[10px] font-black tracking-[0.4em] uppercase text-text-muted/50 whitespace-nowrap">
              Games
            </h2>
            <div className="h-px flex-1 max-w-[100px] bg-gradient-to-l from-transparent via-white/10 to-white/10"></div>
          </div>
        </div>

        {/* Games Grid - Más espacio entre cards */}
        <section className="w-full max-w-7xl mx-auto px-4 md:px-6 pb-20 md:pb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12">
            {games.map((game, index) => (
              <div
                key={game.id}
                className="animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Link 
                  href={game.slug}
                  className={`
                    group relative flex flex-col h-full
                    glass-panel transition-all duration-500
                    ${game.slug === '#' 
                      ? 'opacity-50 cursor-not-allowed grayscale' 
                      : 'hover:scale-[1.02] cursor-pointer'
                    }
                  `}
                  onClick={(e) => game.slug === '#' && e.preventDefault()}
                >
                  {/* Tag Badge */}
                  {game.tag && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                      <span className={`
                        inline-block text-[9px] md:text-[10px] font-black 
                        px-4 py-2 rounded-full tracking-[0.25em] 
                        shadow-lg border
                        ${game.tag === 'NEW' 
                          ? 'bg-primary text-bg-deep border-primary/20' 
                          : game.tag === 'DAILY'
                          ? 'bg-secondary text-bg-deep border-secondary/20'
                          : 'bg-slate-700 text-white border-slate-600'
                        }
                      `}>
                        {game.tag}
                      </span>
                    </div>
                  )}
                  
                  {/* Icon - Más espacio arriba */}
                  <div className="flex justify-center pt-4 pb-6 md:pb-8">
                    <div className="text-7xl md:text-8xl transform transition-all duration-500 group-hover:scale-110 group-hover:-rotate-6 drop-shadow-2xl">
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
                    ${game.slug === '#'
                      ? 'bg-white/5 border border-white/5 text-text-muted/50'
                      : 'bg-white/5 border border-white/10 text-primary group-hover:bg-primary group-hover:text-bg-deep group-hover:shadow-[0_0_40px_rgba(45,201,172,0.4)] group-hover:border-primary/50'
                    }
                  `}>
                    {game.slug === '#' ? 'Coming Soon' : 'Play Now'}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Info Section */}
        <section className="w-full max-w-5xl mx-auto px-4 md:px-6 pb-24 md:pb-32">
          <div className="glass-panel !rounded-3xl !p-10 md:!p-14 text-center hover:!bg-white/5">
            <p className="text-text-muted text-base md:text-lg leading-relaxed">
              <span className="text-primary font-bold">New games every week.</span> Practice your language skills with fun, challenging puzzles designed for learners of all levels.
            </p>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}