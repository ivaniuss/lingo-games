'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';
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
    theWordWas: 'The word was',
    easy: 'Easy',
    normal: 'Normal', 
    hard: 'Hard',
    check: 'CHECK'
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
    theWordWas: 'La palabra era',
    easy: 'Fácil',
    normal: 'Normal',
    hard: 'Difícil',
    check: 'COMPROBAR'
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
    theWordWas: 'Le mot était',
    easy: 'Facile',
    normal: 'Normal',
    hard: 'Difficile',
    check: 'VÉRIFIER'
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
    theWordWas: 'Das Wort war',
    easy: 'Leicht',
    normal: 'Normal',
    hard: 'Schwierig',
    check: 'PRÜFEN'
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
    theWordWas: 'La parola era',
    easy: 'Facile',
    normal: 'Normale',
    hard: 'Difficile',
    check: 'CONTROLLA'
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
    theWordWas: 'A palavra era',
    easy: 'Fácil',
    normal: 'Normal',
    hard: 'Difícil',
    check: 'VERIFICAR'
  },
  'pt-BR': {
    description: 'Adivinhe a palavra oculta do dia em {n} tentativas ou menos.',
    helper: 'Use o seu teclado para digitar • ENTER para enviar',
    won: 'EXCELENTE!',
    lost: 'FIM DE JOGO',
    won_msg: 'Você decifrou a palavra do dia brilhantemente.',
    lost_msg: (word: string) => `Não se preocupe, a palavra era: ${word}`,
    next: 'PRÓXIMO DESAFIO',
    show_keyboard: 'Mostrar teclado',
    close: 'Fechar',
    theWordWas: 'A palavra era',
    easy: 'Fácil',
    normal: 'Normal',
    hard: 'Difícil',
    check: 'VERIFICAR'
  },
  'pt-PT': {
    description: 'Adivinhe a palavra oculta do dia em {n} tentativas ou menos.',
    helper: 'Use o seu teclado para digitar • ENTER para enviar',
    won: 'EXCELENTE!',
    lost: 'FIM DE JOGO',
    won_msg: 'Você decifrou a palavra do dia brilhantemente.',
    lost_msg: (word: string) => `Não se preocupe, a palavra era: ${word}`,
    next: 'PRÓXIMO DESAFIO',
    show_keyboard: 'Mostrar teclado',
    close: 'Fechar',
    theWordWas: 'A palavra era',
    easy: 'Fácil',
    normal: 'Normal',
    hard: 'Difícil',
    check: 'VERIFICAR'
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
  const isGameComplete = useGameStore((state) => state.isGameComplete);
  
  const [difficulty, setDifficulty] = useState<'easy' | 'normal' | 'hard'>('normal');
  const [targetWords, setTargetWords] = useState<string[]>([]);
  const [wordLength, setWordLength] = useState(6);
  const [maxGuesses, setMaxGuesses] = useState(6);
  const [puzzleNumber, setPuzzleNumber] = useState(0);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  const mobileInputRef = useRef<HTMLInputElement | null>(null);
  
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
        const savedState = getGameState('wordle', language);
        
        // Conditions to restore progress:
        // 1. Saved state exists
        // 2. It's the same day (puzzleNumber)
        // 3. It's the same difficulty
        // 4. It matches the current language
        
        const isSameGame = savedState && 
                          savedState.puzzleNumber === data.number && 
                          savedState.difficulty === difficulty &&
                          savedState.language === language; // Validate language

        // Check if game is already marked as complete for today in THIS language
        const alreadyCompleted = isGameComplete('wordle', language);

        if (alreadyCompleted) {
          // If completed, load state but force game over UI
          // Only load if state matches language (sanity check)
          if (savedState?.language === language) {
            setTargetWords(savedState?.targetWords || data.words || []);
            setWordLength(savedState?.wordLength || data.wordLength || 6);
            setMaxGuesses(savedState?.maxGuesses || data.maxGuesses || 6);
            setPuzzleNumber(data.number);
            setGuesses(savedState?.guesses || []);
            setCurrentGuess('');
            // Ensure we show the overlay
            setGameState(savedState?.gameState === 'lost' ? 'lost' : 'won');
          }
        } else if (isSameGame) {
          // Restore progress for this day/difficulty/language
          setTargetWords(savedState.targetWords || []);
          setWordLength(savedState.wordLength || 6);
          setMaxGuesses(savedState.maxGuesses || 6);
          setPuzzleNumber(savedState.puzzleNumber || 0);
          setGuesses(savedState.guesses || []);
          setCurrentGuess(savedState.currentGuess || '');
          setGameState(savedState.gameState || 'playing');
        } else {
          // Start a fresh game for the new day or difficulty or language
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
  }, [language, difficulty, getGameState, isGameComplete]);

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
        language, // Save language
      }, language);
    }
  }, [guesses, currentGuess, gameState, targetWords, wordLength, maxGuesses, difficulty, puzzleNumber, saveGameState, language]);

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
        markComplete('wordle', language);
      } else {
        recordLoss('wordle');
        markComplete('wordle', language);
      }
    }
  }, [currentGuess, guesses, gameState, targetWord, maxGuesses, recordWin, markComplete, recordLoss, language]);

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
             <div className="text-xs font-black uppercase tracking-widest text-text-muted">{t.theWordWas}</div>
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
        <div className={`grid gap-2 md:gap-3 mb-12 md:mb-16 animate-in zoom-in-95 duration-500 p-4 rounded-3xl bg-glass/10 backdrop-blur-sm border border-white/5 shadow-2xl transition-all ${
          gameState !== 'playing' ? 'pointer-events-none opacity-50 grayscale contrast-125' : ''
        }`}>
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

        {/* Mobile Check Button */}
        <div className={`
          mt-6 w-full max-w-xs transition-all duration-500 ease-out transform
          ${currentGuess.length === (targetWord?.length || wordLength) && gameState === 'playing'
             ? 'opacity-100 translate-y-0' 
             : 'opacity-0 translate-y-4 pointer-events-none'}
        `}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEnter();
            }}
            className="w-full py-4 rounded-xl bg-primary text-bg-deep font-black tracking-[0.2em] shadow-lg shadow-primary/25 active:scale-95 transition-all text-sm hover:bg-primary-light"
          >
            {t.check}
          </button>
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

      </div>
    </GameWrapper>
  );
}
