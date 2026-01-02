'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { RealCrossword } from '@/components/ui/RealCrossword';
import { useGameStore } from '@/store/useGameStore';
import { GameCompletedOverlay } from '@/components/ui/GameCompletedOverlay';
import { GameWrapper } from '@/components/layout/GameWrapper';
import { GameHeader } from '@/components/layout/GameHeader';

const GAME_TITLE = 'Crossword';

const TRANSLATIONS = {
  en: {
    description: 'Solve the crossword by guessing words from their categories.',
    helper: 'Click any cell to start',
    loading: 'Loading...',
    error: "Failed to load today's challenge. Please try again later.",
    easy: 'Easy',
    normal: 'Normal',
    hard: 'Hard',
    won: 'PUZZLE SOLVED!',
    won_msg: 'You successfully completed the crossword!',
    lost: 'GAME OVER',
    lost_msg: 'Better luck next time!',
    solution: 'Solution'
  },
  es: {
    description: 'Resuelve el crucigrama adivinando palabras por su categoría.',
    helper: 'Haz clic en una casilla para empezar',
    loading: 'Cargando...',
    error: 'No se pudo cargar el reto de hoy. Por favor, inténtalo de nuevo más tarde.',
    easy: 'Fácil',
    normal: 'Normal',
    hard: 'Difícil',
    won: '¡EXCELENTE!',
    won_msg: '¡Has completado el crucigrama!',
    lost: 'JUEGO TERMINADO',
    lost_msg: '¡Mejor suerte la próxima vez!',
    solution: 'Solución'
  },
  fr: {
    description: 'Résolvez les mots fléchés en devinant les mots par leurs catégories.',
    helper: 'Cliquez sur une case pour commencer',
    loading: 'Chargement...',
    error: "Échec du chargement du défi d'aujourd'hui. Veuillez réessayer plus tard.",
    easy: 'Facile',
    normal: 'Normal',
    hard: 'Difficile',
    won: 'EXCELLENT !',
    won_msg: 'Vous avez terminé les mots fléchés !',
    lost: 'PERDU',
    lost_msg: 'Plus de chance la prochaine fois !',
    solution: 'Solution'
  },
  de: {
    description: 'Löse das Kreuzworträtsel, indem du Wörter aus ihren Kategorien errätst.',
    helper: 'Klicken Sie auf eine Zelle, um zu beginnen',
    loading: 'Laden...',
    error: 'Die heutige Herausforderung konnte nicht geladen werden. Bitte versuchen Sie es später erneut.',
    easy: 'Leicht',
    normal: 'Normal',
    hard: 'Schwierig',
    won: 'GROSSARTIG!',
    won_msg: 'Sie haben das Kreuzworträtsel gelöst!',
    lost: 'SPIEL VORBEI',
    lost_msg: 'Viel Glück beim nächsten Mal!',
    solution: 'Lösung'
  },
  it: {
    description: 'Risolvi il cruciverba indovinando le parole dalle loro categorie.',
    helper: 'Clicca su una cella per iniziare',
    loading: 'Caricamento...',
    error: 'Impossibile caricare la sfida di oggi. Riprova più tardi.',
    easy: 'Facile',
    normal: 'Normale',
    hard: 'Difficile',
    won: 'ECCELLENTE!',
    won_msg: 'Hai completato il cruciverba!',
    lost: 'GAME OVER',
    lost_msg: 'Buona fortuna per la prossima volta!',
    solution: 'Soluzione'
  },
  pt: {
    description: 'Resolva as palavras cruzadas adivinhando palavras de suas categorias.',
    helper: 'Clique em uma célula para começar',
    loading: 'Carregando...',
    error: 'Falha ao carregar o desafio de hoje. Por favor, tente novamente mais tarde.',
    easy: 'Fácil',
    normal: 'Normal',
    hard: 'Difícil',
    won: 'EXCELENTE!',
    won_msg: 'Você completou as palavras cruzadas!',
    lost: 'FIM DE JOGO',
    lost_msg: 'Mais sorte da próxima vez!',
    solution: 'Solução'
  },
  'pt-BR': {
    description: 'Resolva as palavras cruzadas adivinhando palavras de suas categorias.',
    helper: 'Clique em uma célula para começar',
    loading: 'Carregando...',
    error: 'Falha ao carregar o desafio de hoje. Por favor, tente novamente mais tarde.',
    easy: 'Fácil',
    normal: 'Normal',
    hard: 'Difícil',
    won: 'EXCELENTE!',
    won_msg: 'Você completou as palavras cruzadas!',
    lost: 'FIM DE JOGO',
    lost_msg: 'Mais sorte da próxima vez!',
    solution: 'Solução'
  },
  'pt-PT': {
    description: 'Resolva as palavras cruzadas adivinhando palavras de suas categorias.',
    helper: 'Clique em uma célula para começar',
    loading: 'Carregando...',
    error: 'Falha ao carregar o desafio de hoje. Por favor, tente novamente mais tarde.',
    easy: 'Fácil',
    normal: 'Normal',
    hard: 'Difícil',
    won: 'EXCELENTE!',
    won_msg: 'Completou as palavras cruzadas!',
    lost: 'FIM DE JOGO',
    lost_msg: 'Mais sorte da próxima vez!',
    solution: 'Solução'
  }
};

interface Clue {
  number: number;
  direction: 'across' | 'down';
  text: string;
  row: number;
  col: number;
  length: number;
  answer: string;
}

interface CrosswordData {
  grid: string[][];
  clues: Clue[];
  width: number;
  height: number;
  date: string;
  number: number;
  difficulty: 'easy' | 'normal' | 'hard';
  maxAttempts: number;
  hints: number;
}

export default function LingoGridPage() {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS] || TRANSLATIONS.en;
  
  const [data, setData] = useState<CrosswordData | null>(null);
  const [loading, setLoading] = useState(true);
  const [difficulty, setDifficulty] = useState<'easy' | 'normal' | 'hard'>('normal');
  
  // FIX: Use selector to get boolean value directly for reactivity
  const isGameComplete = useGameStore((state) => state.isGameComplete('grid', language));
  const savedState = useGameStore((state) => state.gameStates[language ? `grid-${language}` : 'grid']);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function fetchGrid() {
      try {
        setLoading(true);
        const res = await fetch(`/api/crossword?lang=${language}&difficulty=${difficulty}`);
        
        if (!res.ok) {
          const text = await res.text();
          console.error(`API Error: ${res.status} ${res.statusText}`, text);
          throw new Error('Failed to fetch crossword data');
        }

        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error('Failed to fetch crossword:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchGrid();
  }, [language, difficulty]);

  if (loading || !mounted) {
    return (
      <div className="min-h-screen bg-deep-radial flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <GameWrapper title={GAME_TITLE} gameId="">
      <GameCompletedOverlay 
        isOpen={isGameComplete}
        variant={savedState?.gameState === 'lost' ? 'failure' : 'success'}
        title={savedState?.gameState === 'lost' ? t.lost : t.won}
        message={savedState?.gameState === 'lost' ? t.lost_msg : t.won_msg}
        solutionContent={
          <div className="flex flex-col gap-2 p-4 bg-white/5 rounded-xl border border-white/10 w-full max-w-sm">
             {/* Crossword solution is usually visible on board, but we can add specific info here if needed */}
             <div className="text-xs font-black uppercase tracking-widest text-text-muted text-center">{t.solution}</div>
             <div className="text-center text-sm opacity-80 italic">
               {/* Just a placeholder or summary could go here */}
               {t.won_msg}
             </div>
          </div>
        }
      />

      <div className="flex flex-col items-center justify-center flex-1 w-full">
        <GameHeader 
          title={GAME_TITLE}
          description={t.description}
          puzzleNumber={data.number}
          difficulty={difficulty}
          onDifficultyChange={(d) => setDifficulty(d)}
          difficultyLabels={{
            easy: t.easy,
            normal: t.normal,
            hard: t.hard
          }}
        />

        {/* Stabilized container for Crossword to prevent layout jumps */}
        <div className="min-h-[50vh] flex flex-col mb-20">
          {/* Spacer for breathing room */}
          <div className="h-10 md:h-12" />

          <RealCrossword 
            grid={data.grid}
            clues={data.clues}
            width={data.width}
            height={data.height}
            maxAttempts={data.maxAttempts}
            initialHints={data.hints}
          />
        </div>
      </div>
    </GameWrapper>
  );
}
