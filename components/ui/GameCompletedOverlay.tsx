'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

import { useLanguage } from '@/context/LanguageContext';

import { X, ArrowLeft, Clock } from 'lucide-react';

import { ShareResults } from './ShareResults';

import { Language } from '@/lib/languages';
import { StreakManager, StreakData } from '@/lib/streaks';

const TRANSLATIONS: Record<Language | 'pt', {
  won: string;
  lost: string;
  completed: string;
  message: string;
  nextGame: string;
  backHome: string;
  playAgain: string;
  viewSolution: string;
  close: string;
}> = {
  en: {
    won: 'You Won!',
    lost: 'Game Over',
    completed: 'Game Completed!',
    message: 'You have already played this game today.',
    nextGame: 'Next game available in:',
    backHome: 'Back to Home',
    playAgain: 'Play Again',
    viewSolution: 'View Solution',
    close: 'Close'
  },
  es: {
    won: '¡Ganaste!',
    lost: 'Juego Terminado',
    completed: '¡Juego Completado!',
    message: 'Ya has jugado este juego hoy.',
    nextGame: 'Próximo juego disponible en:',
    backHome: 'Volver al Inicio',
    playAgain: 'Jugar de Nuevo',
    viewSolution: 'Ver Solución',
    close: 'Cerrar'
  },
  fr: {
    won: 'Gagné !',
    lost: 'Partie Terminée',
    completed: 'Jeu Terminé !',
    message: 'Vous avez déjà joué à ce jeu aujourd\'hui.',
    nextGame: 'Prochain jeu disponible dans :',
    backHome: 'Retour à l\'accueil',
    playAgain: 'Rejouer',
    viewSolution: 'Voir la Solution',
    close: 'Fermer'
  },
  de: {
    won: 'Gewonnen!',
    lost: 'Spiel Vorbei',
    completed: 'Spiel Abgeschlossen!',
    message: 'Du hast dieses Spiel heute bereits gespielt.',
    nextGame: 'Nächstes Spiel verfügbar in:',
    backHome: 'Zurück zur Startseite',
    playAgain: 'Nochmal spielen',
    viewSolution: 'Lösung anzeigen',
    close: 'Schließen'
  },
  it: {
    won: 'Hai Vinto!',
    lost: 'Gioco Finito',
    completed: 'Gioco Completato!',
    message: 'Hai già giocato a questo gioco oggi.',
    nextGame: 'Prossimo gioco disponibile tra:',
    backHome: 'Torna alla Home',
    playAgain: 'Rigioca',
    viewSolution: 'Vedi Soluzione',
    close: 'Chiudi'
  },
  pt: {
    won: 'Você Venceu!',
    lost: 'Fim de Jogo',
    completed: 'Jogo Concluído!',
    message: 'Você já jogou este jogo hoje.',
    nextGame: 'Próximo jogo disponível em:',
    backHome: 'Voltar ao Início',
    playAgain: 'Jogar Novamente',
    viewSolution: 'Ver Solução',
    close: 'Fechar'
  },
  'pt-BR': {
    won: 'Você Venceu!',
    lost: 'Fim de Jogo',
    completed: 'Jogo Concluído!',
    message: 'Você já jogou este jogo hoje.',
    nextGame: 'Próximo jogo disponível em:',
    backHome: 'Voltar ao Início',
    playAgain: 'Jogar Novamente',
    viewSolution: 'Ver Solução',
    close: 'Fechar'
  },
  'pt-PT': {
    won: 'Ganhou!',
    lost: 'Fim de Jogo',
    completed: 'Jogo Concluído!',
    message: 'Já jogou este jogo hoje.',
    nextGame: 'Próximo jogo disponível em:',
    backHome: 'Voltar ao Início',
    playAgain: 'Jogar Novamente',
    viewSolution: 'Ver Solução',
    close: 'Fechar'
  }
};

interface GameCompletedOverlayProps {
  variant?: 'success' | 'failure' | 'neutral';
  title?: string;
  message?: string;
  isOpen?: boolean;
  onViewBoard?: () => void;
  solutionContent?: React.ReactNode;
  shareProps?: {
    gameType: 'wordle' | 'connections' | 'crossword';
    difficulty: 'easy' | 'normal' | 'hard';
    puzzleNumber: number;
    data: unknown;
  };
}

export function GameCompletedOverlay({
  variant = 'neutral',
  title,
  message,
  isOpen = true,
  onViewBoard,
  solutionContent,
  shareProps
}: GameCompletedOverlayProps) {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS] || TRANSLATIONS.en;
  const [streak, setStreak] = useState<StreakData | null>(null);

  useEffect(() => {
    if (isOpen) {
      setStreak(StreakManager.getStreak());
    }
  }, [isOpen]);
  const [timeUntilMidnight, setTimeUntilMidnight] = useState('');

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

  // Only render when open
  if (!isOpen) return null;

  // Visual variants
  const styles = {
    success: {
      title: 'text-emerald-600 dark:text-emerald-400',
      buttonBg: 'bg-emerald-600 hover:bg-emerald-700 text-white',
      border: 'border-emerald-500/20',
      buttonText: t.won
    },
    failure: {
      title: 'text-red-600 dark:text-red-400',
      buttonBg: 'bg-red-600 hover:bg-red-700 text-white',
      border: 'border-red-500/20',
      buttonText: t.lost
    },
    neutral: {
      iconBg: 'bg-blue-100 dark:bg-blue-500/20',
      iconColor: 'text-blue-600 dark:text-blue-400',
      icon: <Clock className="w-8 h-8" strokeWidth={2} />,
      title: 'text-blue-600 dark:text-blue-400',
      buttonBg: 'bg-blue-600 hover:bg-blue-700 text-white',
      border: 'border-blue-500/20',
      buttonText: t.completed
    }
  };

  const currentStyle = styles[variant];

  const handleClose = onViewBoard || (() => window.location.href = '/');

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200 p-4 sm:p-6">
      <div className={`relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border ${currentStyle.border}`}>
        {/* Close Button - Positioned in corner */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          aria-label={t.close}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          {/* Title */}
          <h2 className={`text-2xl font-bold text-center mb-3 ${currentStyle.title}`}>
            {title || currentStyle.buttonText}
          </h2>

          {/* Message and Solution */}
          <div className="mb-6">
            {/* Only show the default message if there's no custom solution content */}
            {message && (
              <p className="text-sm md:text-base text-text-muted leading-relaxed max-w-sm">
                {message}
              </p>
            )}

            {/* Streak Bonus Hook */}
            {streak && streak.currentStreak > 0 && (
              <div className="flex flex-col items-center gap-1 mt-2 animate-bounce-slow">
                <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400">
                  <span className="text-2xl">🔥</span>
                  <span className="text-xl font-black">{streak.currentStreak} DAY STREAK!</span>
                </div>
              </div>
            )}
          </div>
          {/* Render the solution content if provided */}
          {solutionContent && (
            <div className="mt-4">
              {solutionContent}
            </div>
          )}

          {/* Countdown */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 mb-6">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 text-center mb-1">
              {t.nextGame}
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white text-center font-mono">
              {timeUntilMidnight}
            </div>
          </div>

          {/* Share Results */}
          {shareProps && (
            <div className="mb-6">
              <ShareResults {...shareProps} />
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            {onViewBoard && (
              <button
                onClick={onViewBoard}
                className={`w-full py-3 px-4 rounded-xl font-medium transition-all ${currentStyle.buttonBg} hover:opacity-90 active:scale-[0.98]`}
              >
                {t.viewSolution}
              </button>
            )}

            <Link
              href="/"
              className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl font-medium transition-all active:scale-[0.98]"
            >
              <ArrowLeft className="w-4 h-4" />
              {t.backHome}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
