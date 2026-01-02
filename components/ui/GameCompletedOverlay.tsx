'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

const TRANSLATIONS = {
  en: {
    title: 'Game Completed!',
    message: 'You have already played this game today.',
    nextGame: 'Next game available in:',
    backHome: 'Back to Home'
  },
  es: {
    title: '¡Juego Completado!',
    message: 'Ya has jugado este juego hoy.',
    nextGame: 'Próximo juego disponible en:',
    backHome: 'Volver al Inicio'
  },
  fr: {
    title: 'Jeu Terminé !',
    message: 'Vous avez déjà joué à ce jeu aujourd\'hui.',
    nextGame: 'Prochain jeu disponible dans :',
    backHome: 'Retour à l\'accueil'
  },
  de: {
    title: 'Spiel Abgeschlossen!',
    message: 'Du hast dieses Spiel heute bereits gespielt.',
    nextGame: 'Nächstes Spiel verfügbar in:',
    backHome: 'Zurück zur Startseite'
  },
  it: {
    title: 'Gioco Completato!',
    message: 'Hai già giocato a questo gioco oggi.',
    nextGame: 'Prossimo gioco disponibile tra:',
    backHome: 'Torna alla Home'
  },
  pt: {
    title: 'Jogo Concluído!',
    message: 'Você já jogou este jogo hoje.',
    nextGame: 'Próximo jogo disponível em:',
    backHome: 'Voltar ao Início'
  }
};

// ... imports
interface GameCompletedOverlayProps {
  variant?: 'success' | 'failure' | 'neutral';
  title?: string;
  message?: string;
  isOpen?: boolean;
  onViewBoard?: () => void;
  solutionContent?: React.ReactNode; 
}

export function GameCompletedOverlay({ 
  variant = 'neutral', 
  title, 
  message,
  isOpen = true,
  onViewBoard,
  solutionContent
}: GameCompletedOverlayProps) {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS] || TRANSLATIONS.en;
  const [timeUntilMidnight, setTimeUntilMidnight] = useState('');
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      
      const diff = midnight.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeUntilMidnight(
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
      );
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);
  
  if (!mounted || !isOpen) return null;

  // Visual variants
  const styles = {
    success: {
      iconBg: 'bg-primary/20 border-primary',
      iconColor: 'text-primary',
      icon: (
        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ),
      glow: 'glow-primary border-primary/20',
      title: 'text-primary' // or gradient
    },
    failure: {
      iconBg: 'bg-red-500/20 border-red-500',
      iconColor: 'text-red-500',
      icon: (
        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
      glow: 'shadow-[0_0_50px_rgba(239,68,68,0.1)] border-red-500/20',
      title: 'text-red-500'
    },
    neutral: {
      iconBg: 'bg-white/10 border-white/20',
      iconColor: 'text-white',
      icon: (
        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
           <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ),
      glow: 'border-white/10',
      title: 'text-white'
    }
  };

  const currentStyle = styles[variant];

  return (
    <div className="fixed inset-0 bg-bg-deep/95 backdrop-blur-xl flex items-center justify-center z-50 animate-in fade-in duration-500 px-4 md:px-6">
      {/* Increased max-width for solution visibility, reduced padding/margin for mobile */}
      <div className={`glass-panel p-6 md:p-12 text-center max-w-lg w-full shadow-2xl flex flex-col max-h-[90vh] ${currentStyle.glow}`}>
        
        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar -mx-4 px-4">
            {/* Icon */}
            <div className="mb-4 md:mb-8">
              <div className={`w-16 h-16 md:w-24 md:h-24 mx-auto rounded-full ${currentStyle.iconBg} border-4 flex items-center justify-center ${currentStyle.iconColor}`}>
                {currentStyle.icon}
              </div>
            </div>

            {/* Title */}
            <h2 className={`text-2xl md:text-4xl font-black mb-2 md:mb-4 tracking-tight ${currentStyle.title}`}>
              {title || t.title}
            </h2>

            {/* Message */}
            <p className="text-text-muted text-sm md:text-lg mb-6 leading-relaxed max-w-sm mx-auto">
              {message || t.message}
            </p>

            {/* Solution Content (If provided) */}
            {solutionContent && (
              <div className="mb-6 animate-in zoom-in-95 duration-300">
                 {solutionContent}
              </div>
            )}
        </div>

        {/* Footer Area (Fixed at bottom of modal) */}
        <div className="mt-4 pt-4 border-t border-white/5">
            {/* Countdown */}
            <div className="mb-4 p-3 bg-black/20 rounded-xl border border-white/5">
              <div className="text-[10px] font-bold text-text-muted/60 mb-1 uppercase tracking-wider">
                {t.nextGame}
              </div>
              <div className="text-3xl font-black text-white tabular-nums tracking-tight">
                {timeUntilMidnight}
              </div>
            </div>

            <div className="flex flex-col gap-3">
                {/* Back Button */}
                <Link 
                  href="/"
                  className="block w-full py-3 md:py-4 bg-white/10 hover:bg-white/20 text-white text-base md:text-lg font-black rounded-xl transition-all hover:scale-[1.02] active:scale-95"
                >
                  {t.backHome}
                </Link>
                
                {/* View Board Button (Legacy/Optional) */}
                {onViewBoard && !solutionContent && (
                   <button
                     onClick={onViewBoard}
                     className="block w-full py-2 text-text-muted hover:text-white text-xs font-bold uppercase tracking-widest transition-colors"
                   >
                     View Board
                   </button>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
