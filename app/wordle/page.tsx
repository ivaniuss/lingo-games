'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { GameWrapper } from '@/components/layout/GameWrapper';
import { useGameStore } from '@/store/useGameStore';
import { GameCompletedOverlay } from '@/components/ui/GameCompletedOverlay';

const WORD_LENGTH = 6;
const MAX_GUESSES = 6;

const TRANSLATIONS = {
  en: {
    helper: 'Use your keyboard to type • ENTER to submit',
    won: 'EXCELLENT!',
    lost: 'GAME OVER',
    won_msg: 'You have decrypted the word of the day brilliantly.',
    lost_msg: (word: string) => `Don't worry, the word was: ${word}`,
    next: 'NEXT CHALLENGE'
  },
  es: {
    helper: 'Usa tu teclado para escribir • ENTER para enviar',
    won: '¡EXCELENTE!',
    lost: 'GAME OVER',
    won_msg: 'Has descifrado la palabra del día de forma brillante.',
    lost_msg: (word: string) => `No te preocupes, la palabra era: ${word}`,
    next: 'SIGUIENTE RETO'
  },
  fr: {
    helper: 'Utilisez votre clavier pour taper • ENTRÉE pour envoyer',
    won: 'EXCELLENT !',
    lost: 'PARTIE PERDUE',
    won_msg: 'Vous avez déchiffré le mot du jour avec brio.',
    lost_msg: (word: string) => `Ne vous inquiétez pas, le mot était : ${word}`,
    next: 'DÉFI SUIVANT'
  },
  de: {
    helper: 'Benutze deine Tastatur • ENTER zum Bestätigen',
    won: 'AUSGEZEICHNET!',
    lost: 'GAME OVER',
    won_msg: 'Du hast das Wort des Tages brillant entschlüsselt.',
    lost_msg: (word: string) => `Keine Sorge, das Wort war: ${word}`,
    next: 'NÄCHSTE HERAUSFORDERUNG'
  },
  it: {
    helper: 'Usa la tua tastiera per scrivere • INVIO per inviare',
    won: 'ECCELLENTE!',
    lost: 'GAME OVER',
    won_msg: 'Hai decifrato la parola del giorno brillantemente.',
    lost_msg: (word: string) => `Non preoccuparti, la parola era: ${word}`,
    next: 'PROSSIMA SFIDA'
  },
  pt: {
    helper: 'Use o seu teclado para digitar • ENTER para enviar',
    won: 'EXCELENTE!',
    lost: 'FIM DE JOGO',
    won_msg: 'Você decifrou a palavra do dia brilhantemente.',
    lost_msg: (word: string) => `Não se preocupe, a palavra era: ${word}`,
    next: 'PRÓXIMO DESAFIO'
  }
};

export default function WordlePage() {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS] || TRANSLATIONS.en;
  
  const isGameComplete = useGameStore((state) => state.isGameComplete('wordle'));
  const saveGameState = useGameStore((state) => state.saveGameState);
  const getGameState = useGameStore((state) => state.getGameState);
  const recordWin = useGameStore((state) => state.recordWin);
  const recordLoss = useGameStore((state) => state.recordLoss);
  const markComplete = useGameStore((state) => state.markComplete);
  
  const [targetWord, setTargetWord] = useState('');
  const [puzzleNumber, setPuzzleNumber] = useState(0);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');

  // Load saved state on mount
  useEffect(() => {
    const savedState = getGameState('wordle');
    if (savedState && savedState.targetWord) {
      setGuesses(savedState.guesses || []);
      setCurrentGuess(savedState.currentGuess || '');
      setGameState(savedState.gameState || 'playing');
      setTargetWord(savedState.targetWord);
      setPuzzleNumber(savedState.puzzleNumber || 0);
    }
  }, [getGameState]);

  // Fetch word when language changes or on first load
  useEffect(() => {
    fetch(`/api/daily-word?lang=${language}`)
      .then(res => res.json())
      .then(data => {
        const savedState = getGameState('wordle');
        
        // Only reset if the puzzle number changed (new day) or no saved state
        if (!savedState || savedState.puzzleNumber !== data.number) {
          setTargetWord(data.word);
          setPuzzleNumber(data.number);
          setGuesses([]);
          setCurrentGuess('');
          setGameState('playing');
        } else {
          // Same puzzle, just update the word for the new language
          setTargetWord(data.word);
          setPuzzleNumber(data.number);
        }
      });
  }, [language, getGameState]);

  // Auto-save state whenever it changes
  useEffect(() => {
    if (targetWord) {
      saveGameState('wordle', {
        guesses,
        currentGuess,
        gameState,
        targetWord,
        puzzleNumber,
      });
    }
  }, [guesses, currentGuess, gameState, targetWord, puzzleNumber, saveGameState]);

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    if (gameState !== 'playing' || !targetWord) return;

    if (e.key === 'Enter') {
      if (currentGuess.length !== targetWord.length) return;
      
      const newGuesses = [...guesses, currentGuess.toUpperCase()];
      setGuesses(newGuesses);
      setCurrentGuess('');

      if (currentGuess.toUpperCase() === targetWord) {
        setGameState('won');
        recordWin('wordle');
        markComplete('wordle');
      } else if (newGuesses.length >= MAX_GUESSES) {
        setGameState('lost');
        recordLoss('wordle');
        markComplete('wordle');
      }
    } else if (e.key === 'Backspace') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (/^[a-zA-Z]$/.test(e.key) && currentGuess.length < targetWord.length) {
      setCurrentGuess(prev => prev + e.key.toUpperCase());
    }
  }, [currentGuess, guesses, gameState, targetWord, recordWin, recordLoss, markComplete]);

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onKeyDown]);

  const getLetterClass = (guess: string, index: number) => {
    const letter = guess[index];
    if (targetWord[index] === letter) return 'bg-primary border-primary text-bg-deep';
    if (targetWord.includes(letter)) return 'bg-secondary border-secondary text-bg-deep';
    return 'bg-state-absent border-state-absent text-text-muted';
  };

  return (
    <GameWrapper title="LingoWordle" gameId={`LingoWordle #${puzzleNumber}`}>
      {/* Unified Overlay Handling */}
      <GameCompletedOverlay 
        isOpen={gameState !== 'playing'}
        variant={gameState === 'won' ? 'success' : 'failure'}
        title={gameState === 'won' ? t.won : t.lost}
        message={gameState === 'won' ? t.won_msg : t.lost_msg('')} // Clean message for lost state as word is shown below
        solutionContent={
          <div className="flex flex-col items-center gap-2 p-4 bg-white/5 rounded-xl border border-white/10">
             <div className="text-xs font-black uppercase tracking-widest text-text-muted">The word was</div>
             <div className="text-3xl md:text-5xl font-black tracking-widest text-primary drop-shadow-[0_0_15px_rgba(45,201,172,0.5)]">
               {targetWord}
             </div>
          </div>
        }
      />
      
      {/* Game Board Container - Vertically Centered */}
      <div className="flex flex-col items-center justify-center flex-1 w-full -mt-10 md:mt-0">
        
        {/* Game Board */}
        <div className="grid gap-2 md:gap-3 mb-12 md:mb-16 animate-in zoom-in-95 duration-500 p-4 rounded-3xl bg-glass/10 backdrop-blur-sm border border-white/5 shadow-2xl">
          {Array.from({ length: MAX_GUESSES }).map((_, rowIndex) => {
            const guess = guesses[rowIndex];
            const isCurrentRow = rowIndex === guesses.length;
            
            return (
              <div key={rowIndex} className="flex gap-2 md:gap-3">
                {Array.from({ length: targetWord.length || WORD_LENGTH }).map((_, colIndex) => {
                  let char = '';
                  let statusClass = 'border-glass-border bg-glass';
                  
                  if (guess) {
                    char = guess[colIndex];
                    statusClass = getLetterClass(guess, colIndex);
                  } else if (isCurrentRow) {
                    char = currentGuess[colIndex] || '';
                    if (char) statusClass = 'border-text-muted bg-glass/20 scale-105 shadow-xl';
                  }

                  return (
                    <div 
                      key={colIndex} 
                      className={`w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 border-2 rounded-xl flex items-center justify-center text-xl sm:text-3xl font-black transition-all duration-300 select-none ${statusClass}`}
                    >
                      {char}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      
        {/* Helper Text */}
         <div className="text-center text-[10px] md:text-xs font-black tracking-[0.3em] text-text-muted uppercase opacity-60 mt-4 md:mt-8">
          {t.helper}
        </div>
      </div>
    </GameWrapper>
  );
}
