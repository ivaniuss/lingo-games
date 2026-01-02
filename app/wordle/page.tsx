'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { SoftKeyboard } from '@/components/ui/SoftKeyboard';
import { GameHeader } from '@/components/layout/GameHeader';
import { GameWrapper } from '@/components/layout/GameWrapper';
import { useGameStore } from '@/store/useGameStore';
import { GameCompletedOverlay } from '@/components/ui/GameCompletedOverlay';

const GAME_TITLE = 'Wordle';

const TRANSLATIONS = {
  en: {
    description: 'Guess the hidden word of the day in {n} attempts or less.',
    helper: 'Use your keyboard to type • ENTER to submit',
    won: 'EXCELLENT!',
    lost: 'GAME OVER',
    won_msg: 'You have decrypted the word of the day brilliantly.',
    lost_msg: (word: string) => `Don't worry, the word was: ${word}`,
    next: 'NEXT CHALLENGE',
    show_keyboard: 'Show keyboard',
    close: 'Close',
    easy: 'Easy',
    normal: 'Normal', 
    hard: 'Hard'
  },
  es: {
    description: 'Adivina la palabra oculta del día en {n} intentos o menos.',
    helper: 'Usa tu teclado para escribir • ENTER para enviar',
    won: '¡EXCELENTE!',
    lost: 'GAME OVER',
    won_msg: 'Has descifrado la palabra del día de forma brillante.',
    lost_msg: (word: string) => `No te preocupes, la palabra era: ${word}`,
    next: 'SIGUIENTE RETO',
    show_keyboard: 'Mostrar teclado',
    close: 'Cerrar',
    easy: 'Fácil',
    normal: 'Normal',
    hard: 'Difícil'
  },
  fr: {
    description: 'Devinez le mot caché du jour en {n} essais ou moins.',
    helper: 'Utilisez votre clavier pour taper • ENTRÉE pour envoyer',
    won: 'EXCELLENT !',
    lost: 'PARTIE PERDUE',
    won_msg: 'Vous avez déchiffré le mot du jour avec brio.',
    lost_msg: (word: string) => `Ne vous inquiétez pas, le mot était : ${word}`,
    next: 'DÉFI SUIVANT',
    show_keyboard: 'Afficher le clavier',
    close: 'Fermer',
    easy: 'Facile',
    normal: 'Normal',
    hard: 'Difficile'
  },
  de: {
    description: 'Errate das versteckte Wort des Tages in {n} Versuchen oder weniger.',
    helper: 'Benutze deine Tastatur • ENTER zum Bestätigen',
    won: 'AUSGEZEICHNET!',
    lost: 'GAME OVER',
    won_msg: 'Du hast das Wort des Tages brillant entschlüsselt.',
    lost_msg: (word: string) => `Keine Sorge, das Wort war: ${word}`,
    next: 'NÄCHSTE HERAUSFORDERUNG',
    show_keyboard: 'Tastatur anzeigen',
    close: 'Schließen',
    easy: 'Leicht',
    normal: 'Normal',
    hard: 'Schwierig'
  },
  it: {
    description: 'Indovina la parola nascosta del giorno in {n} tentativi o meno.',
    helper: 'Usa la tua tastiera per scrivere • INVIO per inviare',
    won: 'ECCELLENTE!',
    lost: 'GAME OVER',
    won_msg: 'Hai decifrato la parola del giorno brillantemente.',
    lost_msg: (word: string) => `Non preoccuparti, la parola era: ${word}`,
    next: 'PROSSIMA SFIDA',
    show_keyboard: 'Mostra tastiera',
    close: 'Chiudi',
    easy: 'Facile',
    normal: 'Normale',
    hard: 'Difficile'
  },
  pt: {
    description: 'Adivinhe a palavra oculta do dia em {n} tentativas ou menos.',
    helper: 'Use o seu teclado para digitar • ENTER para enviar',
    won: 'EXCELENTE!',
    lost: 'FIM DE JOGO',
    won_msg: 'Você decifrou a palavra do dia brilhantemente.',
    lost_msg: (word: string) => `Não se preocupe, a palavra era: ${word}`,
    next: 'PRÓXIMO DESAFIO',
    show_keyboard: 'Mostrar teclado',
    close: 'Fechar',
    easy: 'Fácil',
    normal: 'Normal',
    hard: 'Difícil'
  }
};

export default function WordlePage() {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS] || TRANSLATIONS.en;
  const extraKeysByLang: Record<string, string[]> = {
    es: ['Ñ'],
    'pt-BR': ['Ç','Ã','Õ'],
    'pt-PT': ['Ç','Ã','Õ'],
    fr: ['Ç','É','È','À','Ù'],
    de: ['Ä','Ö','Ü','ß'],
    it: ['À','È','É','Ì','Ò','Ù'],
    en: []
  };
  const extraKeys = extraKeysByLang[language] || [];
  const extraKeysFiltered = (language || '').toString().startsWith('es')
    ? extraKeys.filter(k => k.toUpperCase() !== 'Ñ')
    : extraKeys;
  
  const saveGameState = useGameStore((state) => state.saveGameState);
  const getGameState = useGameStore((state) => state.getGameState);
  const recordWin = useGameStore((state) => state.recordWin);
  const recordLoss = useGameStore((state) => state.recordLoss);
  const markComplete = useGameStore((state) => state.markComplete);
  
  const [difficulty, setDifficulty] = useState<'easy' | 'normal' | 'hard'>('normal');
  const [targetWords, setTargetWords] = useState<string[]>([]);
  const [wordLength, setWordLength] = useState(6);
  const [maxGuesses, setMaxGuesses] = useState(6);
  const [puzzleNumber, setPuzzleNumber] = useState(0);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  const mobileInputRef = useRef<HTMLInputElement | null>(null);
  const [showKeyboard, setShowKeyboard] = useState(false);
  
  // Reset game when difficulty changes
  const handleDifficultyChange = (newDifficulty: 'easy' | 'normal' | 'hard') => {
    setDifficulty(newDifficulty);
    setGuesses([]);
    setCurrentGuess('');
    setGameState('playing');
    setTargetWords([]);
    setMaxGuesses(6); // Reset to default, will be updated by API response
  };
  
  // Get the current target word (for compatibility with existing logic)
  const targetWord = targetWords[0] || '';

  // Fetch words and initialize game state
  useEffect(() => {
    fetch(`/api/daily-word?lang=${language}&difficulty=${difficulty}`)
      .then(res => res.json())
      .then(data => {
        const savedState = getGameState('wordle');
        
        // Conditions to restore progress:
        // 1. Saved state exists
        // 2. It's the same day (puzzleNumber)
        // 3. It's the same difficulty
        // 4. (Optional but good) It matches the current language 
        //    (Note: if lang changed, we usually want new words unless we specifically track per-lang progress)
        
        const isSameGame = savedState && 
                          savedState.puzzleNumber === data.number && 
                          savedState.difficulty === difficulty;

        if (isSameGame) {
          // Restore progress for this day/difficulty
          setTargetWords(savedState.targetWords || []);
          setWordLength(savedState.wordLength || 6);
          setMaxGuesses(savedState.maxGuesses || 6);
          setPuzzleNumber(savedState.puzzleNumber || 0);
          setGuesses(savedState.guesses || []);
          setCurrentGuess(savedState.currentGuess || '');
          setGameState(savedState.gameState || 'playing');
        } else {
          // Start a fresh game for the new day or difficulty
          setTargetWords(data.words || []);
          setWordLength(data.wordLength || 6);
          setMaxGuesses(data.maxGuesses || 6);
          setPuzzleNumber(data.number);
          setGuesses([]);
          setCurrentGuess('');
          setGameState('playing');
        }
      })
      .catch(err => console.error('Failed to fetch words:', err));
  }, [language, difficulty, getGameState]);

  // Auto-save state whenever it changes
  useEffect(() => {
    if (targetWords.length > 0) {
      saveGameState('wordle', {
        guesses,
        currentGuess,
        gameState,
        targetWords,
        wordLength,
        maxGuesses,
        difficulty,
        puzzleNumber,
      });
    }
  }, [guesses, currentGuess, gameState, targetWords, wordLength, maxGuesses, difficulty, puzzleNumber, saveGameState]);

  const handleType = useCallback((key: string) => {
    if (gameState !== 'playing' || !targetWord) return;
    if (/^[A-Za-zÀ-ÿ]$/.test(key)) {
      setCurrentGuess(prev => {
        if (prev.length < targetWord.length) {
          return prev + key.toUpperCase();
        }
        return prev;
      });
    }
  }, [gameState, targetWord]);

  const handleBackspace = useCallback(() => {
    if (gameState !== 'playing' || !targetWord) return;
    setCurrentGuess(prev => prev.slice(0, -1));
  }, [gameState, targetWord]);

  const handleEnter = useCallback(() => {
    if (gameState !== 'playing' || !targetWord) return;
    if (currentGuess.length !== targetWord.length) return;
    
    const val = currentGuess.toUpperCase();
    const normalize = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
    const normalizedGuess = normalize(val);
    const normalizedTarget = normalize(targetWord);

    const newGuesses = [...guesses, val];
    
    // 1. Logic for game state
    let nextGameState: 'playing' | 'won' | 'lost' = 'playing';
    if (normalizedGuess === normalizedTarget) {
      nextGameState = 'won';
    } else if (newGuesses.length >= maxGuesses) {
      nextGameState = 'lost';
    }

    // 2. Perform state updates (can be batched safely)
    setGuesses(newGuesses);
    setCurrentGuess('');
    if (nextGameState !== 'playing') {
      setGameState(nextGameState);
      
      // 3. Side effects (Outside of updaters!)
      if (nextGameState === 'won') {
        recordWin('wordle');
        markComplete('wordle');
      } else {
        recordLoss('wordle');
        markComplete('wordle');
      }
    }
  }, [currentGuess, guesses, gameState, targetWord, maxGuesses, recordWin, markComplete, recordLoss]);

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    if (gameState !== 'playing' || !targetWord) return;
    
    // If the focus is on our hidden input, let the input handlers (onMobileChange/onMobileKeyDown)
    // handle the event to avoid double-typing on physical keyboards.
    if (e.target === mobileInputRef.current) return;

    if (e.key === 'Enter') {
      handleEnter();
    } else if (e.key === 'Backspace') {
      handleBackspace();
    } else {
      handleType(e.key);
    }
  }, [gameState, targetWord, handleEnter, handleBackspace, handleType]);

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onKeyDown]);

  // Keep a hidden input focused to raise the soft keyboard on mobile
  useEffect(() => {
    if (mobileInputRef.current) {
      try {
        mobileInputRef.current.focus();
      } catch {}
    }
  }, [gameState, targetWord]);

  const onMobileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (gameState !== 'playing' || !targetWord) return;
    const v = e.target.value;
    if (!v) return;
    const ch = v.slice(-1).toUpperCase();
    handleType(ch);
    e.target.value = '';
  }, [gameState, targetWord, handleType]);

  const onMobileKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (gameState !== 'playing' || !targetWord) return;
    if (e.key === 'Backspace') {
      handleBackspace();
      e.preventDefault();
    } else if (e.key === 'Enter') {
      handleEnter();
      e.preventDefault();
    }
  }, [gameState, targetWord, handleBackspace, handleEnter]);

  const getLetterClass = (guess: string, index: number) => {
    const letter = guess[index];
    if (targetWord[index] === letter) return 'bg-primary border-primary text-bg-deep';
    if (targetWord.includes(letter)) return 'bg-secondary border-secondary text-bg-deep';
    return 'bg-state-absent border-state-absent text-text-muted';
  };

  return (
    <GameWrapper title={GAME_TITLE} gameId="">
      <GameHeader 
        title={GAME_TITLE}
        description={t.description.replace('{n}', maxGuesses.toString())}
        puzzleNumber={puzzleNumber}
        difficulty={difficulty}
        onDifficultyChange={handleDifficultyChange}
        difficultyLabels={{
          easy: t.easy,
          normal: t.normal,
          hard: t.hard
        }}
      />

      {/* Spacer for breathing room */}
      <div className="h-10 md:h-12" />

      {/* Unified Overlay Handling */}
      <GameCompletedOverlay 
        isOpen={gameState !== 'playing'}
        variant={gameState === 'won' ? 'success' : 'failure'}
        title={gameState === 'won' ? t.won : t.lost}
        message={gameState === 'won' ? t.won_msg : t.lost_msg(targetWord)}
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
      <div
        className="flex flex-col items-center justify-center flex-1 w-full mb-16 md:mb-24"
        onClick={() => {
          if (mobileInputRef.current) {
            try { mobileInputRef.current.focus(); } catch {}
          }
        }}
      >
        
        {/* Game Board */}
        <div className="grid gap-2 md:gap-3 mb-12 md:mb-16 animate-in zoom-in-95 duration-500 p-4 rounded-3xl bg-glass/10 backdrop-blur-sm border border-white/5 shadow-2xl">
          {Array.from({ length: maxGuesses }).map((_, rowIndex) => {
            const guess = guesses[rowIndex];
            const isCurrentRow = rowIndex === guesses.length;
            
            return (
              <div key={rowIndex} className="flex gap-2 md:gap-3">
                {Array.from({ length: targetWord.length || wordLength }).map((_, colIndex) => {
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
        {/* Hidden input to enable mobile soft keyboard */}
        <input
          ref={mobileInputRef}
          inputMode="text"
          autoCapitalize="characters"
          autoCorrect="off"
          autoComplete="off"
          onChange={onMobileChange}
          onKeyDown={onMobileKeyDown}
          className="absolute opacity-0 w-px h-px"
          aria-hidden="true"
        />

        {/* Toggle keyboard button (hidden while sheet open) */}
        {!showKeyboard && (
          <button
            type="button"
            onClick={() => setShowKeyboard(true)}
            className="fixed bottom-4 left-4 z-40 px-4 py-2 rounded-full bg-white/10 text-white border border-white/20 text-xs font-bold backdrop-blur hover:bg-white/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            {t.show_keyboard}
          </button>
        )}

        {/* On-screen keyboard (bottom sheet) */}
        {showKeyboard && (
          <div className="fixed inset-x-0 bottom-0 z-50 bg-bg-deep/95 backdrop-blur-lg border-t border-white/10 p-3 pt-2 pb-[max(16px,env(safe-area-inset-bottom))]">
            {/* Sheet handle + close */}
            <div className="w-full flex justify-center px-2">
              <div className="w-full max-w-xl">
                <div className="flex flex-col items-center mb-2">
                  <div className="h-1.5 w-12 rounded-full bg-white/15" />
                  <button
                    aria-label="Ocultar teclado"
                    onClick={() => setShowKeyboard(false)}
                    className="mt-2 px-2 py-1 rounded-md text-xs font-bold text-white/80 hover:text-white hover:bg-white/10"
                  >
                    {t.close}
                  </button>
                </div>
                <SoftKeyboard
                  locale={language}
                  extraKeys={extraKeysFiltered}
                  onKey={(k) => {
                    if (gameState !== 'playing' || !targetWord) return;
                    if (k === 'Backspace') handleBackspace();
                    else if (k === 'Enter') handleEnter();
                    else handleType(k);
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Spacer to avoid content being covered by keyboard sheet */}
        {showKeyboard && (
          <div className="h-64 md:h-56" />
        )}
      </div>
    </GameWrapper>
  );
}
