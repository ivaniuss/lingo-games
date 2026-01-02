'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { SoftKeyboard } from '@/components/ui/SoftKeyboard';
import { useGameStore } from '@/store/useGameStore';
import { GameCompletedOverlay } from './GameCompletedOverlay';

interface Clue {
  number: number;
  direction: 'across' | 'down';
  text: string;
  row: number;
  col: number;
  length: number;
  answer: string;
}

interface RealCrosswordProps {
  grid: string[][];
  clues: Clue[];
  width: number;
  height: number;
  maxAttempts: number;
  initialHints: number;
}

const TRANSLATIONS = {
  en: {
    across: "Across",
    down: "Down",
    submit: "Check Answers",
    completed: "Crossword Completed!",
    playAgain: "Play Again",
    incomplete: "Fill all squares first",
    giveUp: "Give Up",
    confirmGiveUp: "Are you sure? This will count as a loss.",
    betterLuck: "Better luck next time!",
    gameOver: "Game Over",
    show_keyboard: "Show keyboard",
    close: "Close"
  },
  es: {
    across: "Horizontal",
    down: "Vertical",
    submit: "Comprobar",
    completed: "¡Crucigrama Completado!",
    playAgain: "Jugar de nuevo",
    incomplete: "Rellena todo primero",
    giveUp: "Rendirse",
    confirmGiveUp: "¿Seguro? Esto contará como derrota.",
    betterLuck: "¡Suerte la próxima!",
    gameOver: "Fin del Juego",
    show_keyboard: "Mostrar teclado",
    close: "Cerrar"
  },
  fr: {
    across: "Horizontal",
    down: "Vertical",
    submit: "Vérifier",
    completed: "Mots croisés terminés !",
    playAgain: "Rejouer",
    incomplete: "Remplissez tout d'abord",
    giveUp: "Abandonner",
    confirmGiveUp: "Sûr ? Cela comptera comme une défaite.",
    betterLuck: "Plus de chance la prochaine fois !",
    gameOver: "Jeu Terminé",
    show_keyboard: "Afficher le clavier",
    close: "Fermer"
  },
  de: {
    across: "Waagerecht",
    down: "Senkrecht",
    submit: "Prüfen",
    completed: "Kreuzworträtsel gelöst!",
    playAgain: "Erneut spielen",
    incomplete: "Erst alles ausfüllen",
    giveUp: "Aufgeben",
    confirmGiveUp: "Sicher? Das zählt als Niederlage.",
    betterLuck: "Viel Glück beim nächsten Mal!",
    gameOver: "Spiel Vorbei",
    show_keyboard: "Tastatur anzeigen",
    close: "Schließen"
  },
  it: {
    across: "Orizzontale",
    down: "Verticale",
    submit: "Controlla",
    completed: "Cruciverba Completato!",
    playAgain: "Gioca ancora",
    incomplete: "Completa tutto prima",
    giveUp: "Arrendersi",
    confirmGiveUp: "Sicuro? Conterà come sconfitta.",
    betterLuck: "Più fortuna la prossima volta!",
    gameOver: "Game Over",
    show_keyboard: "Mostra tastiera",
    close: "Chiudi"
  },
  pt: {
    across: "Horizontal",
    down: "Vertical",
    submit: "Verificar",
    completed: "Palavras Cruzadas Concluídas!",
    playAgain: "Jogar novamente",
    incomplete: "Preencha tudo primeiro",
    giveUp: "Desistir",
    confirmGiveUp: "Tem certeza? Contará como derrota.",
    betterLuck: "Mais sorte da próxima vez!",
    gameOver: "Fim de Jogo",
    show_keyboard: "Mostrar teclado",
    close: "Fechar"
  }
};
const EXTRA_KEYS_BY_LANG: Record<string, string[]> = {
  es: ['Ñ'],
  'pt-BR': ['Ç','Ã','Õ'],
  'pt-PT': ['Ç','Ã','Õ'],
  fr: ['Ç','É','È','À','Ù'],
  de: ['Ä','Ö','Ü','ß'],
  it: ['À','È','É','Ì','Ò','Ù'],
  en: []
};

export function RealCrossword({ grid: templateGrid, clues, width, height, maxAttempts, initialHints }: RealCrosswordProps) {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS] || TRANSLATIONS.en;
  
  const extraKeys = EXTRA_KEYS_BY_LANG[language] || [];
  const extraKeysFiltered = (language || '').toString().startsWith('es')
    ? extraKeys.filter(k => k.toUpperCase() !== 'Ñ')
    : extraKeys;
  
  const recordWin = useGameStore((state) => state.recordWin);
  const recordLoss = useGameStore((state) => state.recordLoss);
  const markComplete = useGameStore((state) => state.markComplete);

  // State
  // userGrid stores the user's input. Uses null for black cells and '' for empty cells.
  const [userGrid, setUserGrid] = useState<(string | null)[][]>([]);
  
  const [selectedCell, setSelectedCell] = useState<{r: number, c: number} | null>(null);
  const [direction, setDirection] = useState<'across' | 'down'>('across');
  const [isFinished, setIsFinished] = useState(false);
  const [hasWon, setHasWon] = useState(false); // Track if finished via win or surrender
  const [errors, setErrors] = useState<Set<string>>(new Set()); // "r,c" strings
  const mobileInputRef = useRef<HTMLInputElement | null>(null);

  const saveGameState = useGameStore((state) => state.saveGameState);
  const getGameState = useGameStore((state) => state.getGameState);

  const [attempts, setAttempts] = useState(maxAttempts);
  const [hintsRemaining, setHintsRemaining] = useState(initialHints);
  const [showKeyboard, setShowKeyboard] = useState(false);

  // Initialize User Grid (Persistence Logic)
  useEffect(() => {
    if (templateGrid && templateGrid.length > 0) {
      // 1. Try loading saved state
      const savedState = getGameState('grid', language);
      const isSameLang = savedState?.language === language;
      if (savedState && savedState.gridData && savedState.gridData.length === height && isSameLang) {
        setUserGrid(savedState.gridData as (string | null)[][]);
        if (savedState.attemptsRemaining !== undefined) setAttempts(savedState.attemptsRemaining);
        else setAttempts(maxAttempts);
        if (savedState.hintsRemaining !== undefined) setHintsRemaining(savedState.hintsRemaining);
        else setHintsRemaining(initialHints);
        if (savedState.status === 'finished') {
          setIsFinished(true);
          setHasWon(savedState.attemptsRemaining !== 0);
        }
      } else {
        const initInfo = templateGrid.map((row, r) => row.map((cell, c) => {
          if (!cell) return null;
          const isStart = clues.some(clue => clue.row === r && clue.col === c);
          return isStart ? cell : '';
        }));
        setUserGrid(initInfo as (string | null)[][]);
        setAttempts(maxAttempts);
        setHintsRemaining(initialHints);
      }
      
      // Select first available cell (defer state set to next tick)
      const firstClue = clues[0];
      if (firstClue && !selectedCell) {
        setSelectedCell({ r: firstClue.row, c: firstClue.col });
      }
    }
  }, [templateGrid, clues, height, getGameState, maxAttempts, initialHints]); // Added loading deps

  // Save State Effect
  useEffect(() => {
    if (userGrid.length > 0) {
      saveGameState('grid', {
        gridData: userGrid,
        status: isFinished ? 'finished' : 'playing',
        attemptsRemaining: attempts,
        hintsRemaining,
        language // Save language
      }, language);
    }
  }, [userGrid, isFinished, attempts, hintsRemaining, saveGameState, language]);

  // Helper to find the clue that the user is currently "in"
  const getCurrentClue = useCallback((r: number, c: number, dir: 'across' | 'down') => {
     if (dir === 'across') {
       return clues.find(cl => cl.direction === 'across' && cl.row === r && c >= cl.col && c < cl.col + cl.length);
     } else {
       return clues.find(cl => cl.direction === 'down' && cl.col === c && r >= cl.row && r < cl.row + cl.length);
     }
  }, [clues]);

  const isProtected = useCallback((r: number, c: number) => {
    // Protected if it is a start cell (Hint)
    // We check if ANY clue starts here.
    return clues.some(clue => clue.row === r && clue.col === c);
  }, [clues]);

  const checkAnswers = useCallback(() => {
    // If no attempts left, do nothing (should be disabled anyway)
    if (attempts <= 0) return;

    const newErrors = new Set<string>();
    let allCorrect = true;
    let allFilled = true;

    for (let r = 0; r < height; r++) {
      for (let c = 0; c < width; c++) {
        const userVal = userGrid[r][c];
        const correctVal = templateGrid[r][c];
        if (correctVal) { // White cell
          if (!userVal) allFilled = false;
          else if (userVal !== correctVal) {
            newErrors.add(`${r},${c}`);
            allCorrect = false;
          }
        }
      }
    }

    setErrors(newErrors);

    if (allCorrect && allFilled) {
      setIsFinished(true);
      setHasWon(true);
      recordWin('grid');
      markComplete('grid', language);
    } else {
      // Decrement attempts
      const newAttempts = attempts - 1;
      setAttempts(newAttempts);
      if (newAttempts <= 0) {
        // Game Over logic
        setIsFinished(true);
        setHasWon(false);
        recordLoss('grid');
        markComplete('grid', language);
        // Reveal full grid
        const info = templateGrid.map((row) => row.map((cell) => cell || ''));
        setUserGrid(info);
      }
    }
  }, [attempts, height, width, userGrid, templateGrid, recordWin, markComplete, recordLoss, language]);

  // Navigation helpers (declared before effects to avoid TDZ issues)
  const navigate = useCallback((dr: number, dc: number) => {
    if (!selectedCell) return;
    let nr = selectedCell.r + dr;
    let nc = selectedCell.c + dc;
    // Check bounds
    if (nr >= 0 && nr < height && nc >= 0 && nc < width) {
      // Check if valid (not black)
      if (userGrid[nr][nc] !== null) {
        setSelectedCell({ r: nr, c: nc });
      } else {
        // skip black cell once
        nr += dr;
        nc += dc;
        if (nr >= 0 && nr < height && nc >= 0 && nc < width && userGrid[nr][nc] !== null) {
          setSelectedCell({ r: nr, c: nc });
        }
      }
    }
  }, [selectedCell, height, width, userGrid]);

  const moveCursor = useCallback((step: 1 | -1) => {
    if (!selectedCell) return;
    let nr = selectedCell.r;
    let nc = selectedCell.c;
    if (direction === 'across') nc += step; else nr += step;
    if (nr >= 0 && nr < height && nc >= 0 && nc < width && userGrid[nr][nc] !== null) {
      setSelectedCell({ r: nr, c: nc });
    }
  }, [selectedCell, direction, height, width, userGrid]);

  const handleEnter = useCallback(() => {
    if (!selectedCell || isFinished) return;
    const { r, c } = selectedCell;
    const isFull = userGrid.every(row => row.every(cell => cell !== ''));
    if (isFull) {
      checkAnswers();
    } else {
      const currentClue = getCurrentClue(r, c, direction);
      if (currentClue) {
        const currentIdx = clues.findIndex(cl => cl.number === currentClue.number && cl.direction === currentClue.direction);
        const nextIdx = (currentIdx + 1) % clues.length;
        const nextClue = clues[nextIdx];
        if (nextClue) {
          setSelectedCell({ r: nextClue.row, c: nextClue.col });
          setDirection(nextClue.direction);
        }
      }
    }
  }, [selectedCell, isFinished, userGrid, checkAnswers, getCurrentClue, direction, clues]);

  const useHint = useCallback(() => {
    if (!selectedCell || isFinished || hintsRemaining <= 0) return;
    const { r, c } = selectedCell;
    const currentClue = getCurrentClue(r, c, direction);
    if (!currentClue) return;

    let rr = currentClue.row;
    let cc = currentClue.col;
    for (let i = 0; i < currentClue.length; i++) {
      const cr = direction === 'across' ? currentClue.row : currentClue.row + i;
      const cc2 = direction === 'across' ? currentClue.col + i : currentClue.col;
      const protectedCell = isProtected(cr, cc2);
      const correctVal = templateGrid[cr][cc2];
      const userVal = userGrid[cr][cc2];
      if (!protectedCell && userVal !== correctVal) {
        rr = cr; cc = cc2;
        const newGrid = [...userGrid];
        newGrid[rr][cc] = correctVal;
        setUserGrid(newGrid);
        setHintsRemaining(h => Math.max(0, h - 1));
        setSelectedCell({ r: rr, c: cc });
        break;
      }
    }
  }, [direction, getCurrentClue, isFinished, isProtected, selectedCell, templateGrid, userGrid, hintsRemaining]);

  const handleType = useCallback((char: string) => {
    if (!selectedCell || isFinished) return;
    const { r, c } = selectedCell;
    const val = char.toUpperCase();

    if (/^[A-ZÀ-ÿ]$/.test(val)) {
      const protectedCell = isProtected(r, c);
      if (!protectedCell) {
        const newGrid = [...userGrid];
        newGrid[r][c] = val;
        setUserGrid(newGrid);

        if (errors.has(`${r},${c}`)) {
          const newErrors = new Set(errors);
          newErrors.delete(`${r},${c}`);
          setErrors(newErrors);
        }
      }

      const currentClue = getCurrentClue(r, c, direction);
      if (currentClue) {
        const isAtEnd = direction === 'across'
          ? c === currentClue.col + currentClue.length - 1
          : r === currentClue.row + currentClue.length - 1;
        if (!isAtEnd) moveCursor(1);
      }
    }
  }, [selectedCell, isFinished, isProtected, userGrid, errors, getCurrentClue, direction, moveCursor]);

  const handleBackspace = useCallback(() => {
    if (!selectedCell || isFinished) return;
    const { r, c } = selectedCell;
    const isEmpty = userGrid[r][c] === '';
    const protectedCell = isProtected(r, c);

    if (!isEmpty && !protectedCell) {
      const newGrid = [...userGrid];
      newGrid[r][c] = '';
      setUserGrid(newGrid);
      moveCursor(-1);
    } else {
      const currentClue = getCurrentClue(r, c, direction);
      if (currentClue) {
        const isAtStart = direction === 'across' ? c === currentClue.col : r === currentClue.row;
        if (!isAtStart) {
          moveCursor(-1);
          let nr = r, nc = c;
          if (direction === 'across') nc -= 1; else nr -= 1;
          setTimeout(() => {
            setUserGrid(prev => {
              if (isProtected(nr, nc)) return prev;
              const g = [...prev];
              g[nr][nc] = '';
              return g;
            });
          }, 0);
        }
      }
    }
  }, [selectedCell, isFinished, userGrid, isProtected, moveCursor, getCurrentClue, direction]);

  // Keep a tiny hidden input focused to show soft keyboard on mobile/tablet
  useEffect(() => {
    if (mobileInputRef.current) {
      try {
        mobileInputRef.current.focus();
      } catch {}
    }
  }, [selectedCell]);

  const onMobileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedCell || isFinished) return;
    const v = e.target.value;
    if (!v) return;
    const ch = v.slice(-1).toUpperCase();
    handleType(ch);
    e.target.value = '';
  }, [selectedCell, isFinished, handleType]);

  const onMobileKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      handleBackspace();
      e.preventDefault();
    } else if (e.key === 'Enter') {
      handleEnter();
      e.preventDefault();
    }
  }, [handleBackspace, handleEnter]);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If the focus is on our hidden input, let the input handlers (onMobileInputChange/onMobileKeyDown)
      // handle the event to avoid double-typing on physical keyboards.
      if (e.target === mobileInputRef.current) return;

      if (!selectedCell || isFinished) return;

      if (/^[A-Za-zÀ-ÿ]$/.test(e.key)) {
        handleType(e.key);
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleEnter();
      } else if (e.key === 'ArrowRight') navigate(0, 1);
      else if (e.key === 'ArrowLeft') navigate(0, -1);
      else if (e.key === 'ArrowUp') navigate(-1, 0);
      else if (e.key === 'ArrowDown') navigate(1, 0);
      else if (e.key === ' ') {
        e.preventDefault();
        setDirection(d => d === 'across' ? 'down' : 'across');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCell, isFinished, handleType, handleBackspace, handleEnter, navigate]);

  // helpers are declared above

  const handleCellClick = (r: number, c: number) => {
    if (isFinished || userGrid[r][c] === null) return;
    
    if (selectedCell?.r === r && selectedCell?.c === c) {
      setDirection(d => d === 'across' ? 'down' : 'across');
    } else {
      setSelectedCell({ r, c });
      // Focus hidden input to ensure soft keyboard is visible on mobile/tablet
      setTimeout(() => {
        if (mobileInputRef.current) {
          try { mobileInputRef.current.focus(); } catch {}
        }
      }, 0);
      
      // Smart Direction: Determine best direction based on word availability
      const hasAcross = clues.some(cl => cl.direction === 'across' && cl.row === r && c >= cl.col && c < cl.col + cl.length);
      const hasDown = clues.some(cl => cl.direction === 'down' && cl.col === c && r >= cl.row && r < cl.row + cl.length);
      
      if (hasAcross && !hasDown) setDirection('across');
      else if (!hasAcross && hasDown) setDirection('down');
      else if (hasAcross && hasDown) {
        // If both, keep current if valid, else default to across
        // Actually, if we just landed here, usually we prefer Horizontal unless we were already traversing Vertical?
        // Let's stick effectively to "Keep current" unless it's invalid, which is handled implicitly.
        // But if user clicks a brand new cell, maybe default to Across?
        // Let's leave it as "keep current" for now, but ensure Across is default if current is invalid (not implemented, assuming current is strictly 'across'|'down').
      }
    }
  };

  // checkAnswers declared above

  
  // Helper to find clue number for a cell
  const getClueNumber = (r: number, c: number) => {
    return clues.find(cl => cl.row === r && cl.col === c)?.number;
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 lg:gap-16 items-center">
      
      {/* GRID CONTAINER */}
      <div className="w-full lg:flex-1 flex justify-center lg:justify-end">
        <div 
          className={`relative bg-black/20 p-3 rounded-2xl border border-white/5 shadow-2xl backdrop-blur-sm ${isFinished ? 'pointer-events-none opacity-80 grayscale-[0.3]' : ''}`}
          style={{ 
            display: 'grid', 
            gridTemplateColumns: `repeat(${width}, minmax(1.8rem, 2.8rem))`,
            gap: '4px' 
          }}
        >
          {userGrid.length > 0 && userGrid.map((row, r) => (
            row.map((val, c) => {
              // visual reference removed
              const isBlack = val === null;
              const isSelected = selectedCell?.r === r && selectedCell?.c === c;
              
              const isHigh = selectedCell && !isBlack && (
                direction === 'across' 
                  ? r === selectedCell.r 
                  : c === selectedCell.c
              );
              // Note: Precise highlighting (stopping at black cells) requires more logic, 
              // keeping rough row/col highlight for now as it's "good enough" for MVP.
              
              const clueNum = getClueNumber(r, c);
              const isError = errors.has(`${r},${c}`);
              
              return (
                <div 
                  key={`${r}-${c}`}
                  onClick={() => handleCellClick(r, c)}
                  className={`
                    aspect-square relative flex items-center justify-center text-lg md:text-2xl font-black uppercase
                    select-none transition-all duration-150 cursor-pointer rounded-lg
                    ${isBlack 
                      ? 'bg-transparent opacity-0' 
                      : 'bg-white/10 text-white border-2 border-transparent hover:bg-white/20 hover:scale-105 shadow-lg'
                    }
                    ${isHigh && !isBlack && !isSelected ? 'bg-primary/20 border-primary/30' : ''}
                    ${isSelected ? 'bg-primary! text-bg-deep! border-primary! z-20 scale-110 shadow-[0_0_20px_rgba(45,201,172,0.4)]' : ''}
                    ${isError && !isBlack ? 'bg-red-500/20! border-red-500! text-red-200!' : ''}
                    ${isFinished && !isBlack ? 'bg-emerald-500/20! border-emerald-500! text-emerald-200!' : ''}
                  `}
                >
                  {!isBlack && (
                    <>
                      {clueNum && (
                        <span className={`absolute top-0.5 left-1 text-[8px] md:text-[10px] leading-none font-bold ${isSelected ? 'text-bg-deep/70' : 'text-primary/70'}`}>
                          {clueNum}
                        </span>
                      )}
                      {val}
                    </>
                  )}
                </div>
              );
            })
          ))}
        </div>
      </div>

      {/* CLUES SIDEBAR (Sticky on Desktop) */}
      <div className="w-full lg:w-96 flex flex-col gap-4 lg:gap-6 lg:sticky lg:top-32 h-auto lg:h-[calc(100vh-10rem)] max-h-none lg:max-h-[800px]">
        
        {/* CLUES LIST SCROLLABLE */}
        {/* Mobile: Limit height to ~40vh to ensure controls are visible. Desktop: flex-1 to fill space. */}
        <div className="flex-1 max-h-[40vh] lg:max-h-none overflow-y-auto custom-scrollbar flex flex-col gap-4 lg:gap-6 bg-deep-card/50 backdrop-blur rounded-2xl p-4 lg:p-6 border border-white/10 order-1">
            {/* ACROSS */}
            <div>
               <div className="flex items-center gap-2 mb-2 lg:mb-3 sticky top-0 bg-deep-card/95 py-2 z-10 border-b border-white/10 backdrop-blur">
                 <div className="w-2 h-2 rounded-full bg-primary"></div>
                 <h3 className="text-primary font-black uppercase tracking-widest text-xs">
                   {t.across}
                 </h3>
               </div>
               <ul className="space-y-1">
                 {clues.filter(c => c.direction === 'across')
                        .sort((a, b) => a.number - b.number)
                        .map(clue => (
                   <li 
                     key={`a-${clue.number}`}
                     onClick={() => {
                       setSelectedCell({ r: clue.row, c: clue.col });
                       setDirection('across');
                     }}
                     className={`
                       cursor-pointer transition-all duration-200 p-2 lg:p-3 rounded-xl group border border-transparent
                       ${(selectedCell && direction === 'across' && selectedCell.r === clue.row) 
                         ? 'bg-primary/10 border-primary/20 text-white shadow-lg translate-x-2' 
                         : 'hover:bg-white/5 text-text-muted hover:text-white'
                       }
                     `}
                   >
                     <div className="flex items-start gap-3">
                       <span className={`font-black text-sm w-5 ${(selectedCell && direction === 'across' && selectedCell.r === clue.row) ? 'text-primary' : 'text-white/40'}`}>
                         {clue.number}
                       </span>
                       <span className="text-sm font-medium leading-tight">
                          {clue.text} 
                          <span className="opacity-50 text-xs ml-1 font-bold">({clue.length})</span>
                       </span>
                     </div>
                   </li>
                 ))}
               </ul>
            </div>

            {/* DOWN */}
            <div>
               <div className="flex items-center gap-2 mb-2 lg:mb-3 sticky top-0 bg-deep-card/95 py-2 z-10 border-b border-white/10 backdrop-blur">
                 <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                 <h3 className="text-emerald-400 font-black uppercase tracking-widest text-xs">
                   {t.down}
                 </h3>
               </div>
               <ul className="space-y-1">
                 {clues.filter(c => c.direction === 'down')
                        .sort((a, b) => a.number - b.number)
                        .map(clue => (
                   <li 
                     key={`d-${clue.number}`}
                     onClick={() => {
                       setSelectedCell({ r: clue.row, c: clue.col });
                       setDirection('down');
                     }}
                     className={`
                       cursor-pointer transition-all duration-200 p-2 lg:p-3 rounded-xl group border border-transparent
                       ${(selectedCell && direction === 'down' && selectedCell.c === clue.col) 
                         ? 'bg-emerald-400/10 border-emerald-400/20 text-white shadow-lg translate-x-2' 
                         : 'hover:bg-white/5 text-text-muted hover:text-white'
                       }
                     `}
                   >
                     <div className="flex items-start gap-3">
                       <span className={`font-black text-sm w-5 ${(selectedCell && direction === 'down' && selectedCell.c === clue.col) ? 'text-emerald-400' : 'text-white/40'}`}>
                         {clue.number}
                       </span>
                       <span className="text-sm font-medium leading-tight">
                          {clue.text}
                          <span className="opacity-50 text-xs ml-1 font-bold">({clue.length})</span>
                       </span>
                     </div>
                   </li>
                 ))}
               </ul>
            </div>
        </div>

        {/* CONTROLS CARD */}
        <div className="bg-deep-card/80 backdrop-blur rounded-2xl p-4 lg:p-6 border border-white/10 shadow-lg order-2">
           {/* ... header ... */}
           <div className="flex items-center justify-between mb-4">
            <div>
               <h3 className="text-base lg:text-lg font-black text-white">Controls</h3>
               <p className="text-[10px] lg:text-xs text-text-muted">Navigate with arrows or tap</p>
            </div>
            {/* Attempts & Hints Indicator */}
             <div className="flex items-center gap-2">
               <div className="flex items-center gap-1">
                 {[...Array(Math.max(1, Math.min(8, maxAttempts)))].map((_, i) => (
                   <div key={i} className={`w-2 h-2 rounded-full ${i < attempts ? 'bg-primary' : 'bg-white/10'}`} />
                 ))}
                 <span className="text-xs font-bold text-primary ml-1">{attempts}/{maxAttempts}</span>
               </div>
               <div className="w-px h-4 bg-white/10" />
               <div className="flex items-center gap-1">
                 <svg className="w-3.5 h-3.5 text-amber-300" viewBox="0 0 24 24" fill="currentColor"><path d="M9 21h6v-1a3 3 0 0 0-3-3 3 3 0 0 0-3 3v1Zm3-6a7 7 0 1 0-7-7 7 7 0 0 0 7 7Z"/></svg>
                 <span className="text-xs font-bold text-amber-300">{hintsRemaining}</span>
               </div>
             </div>
          </div>
          <div className="flex flex-col gap-3">
             <button
                onClick={checkAnswers}
                disabled={isFinished || attempts <= 0}
                className="w-full py-3 lg:py-4 bg-primary text-bg-deep font-black uppercase tracking-widest rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg hover:shadow-primary/20 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed text-sm lg:text-base"
             >
                <span>{t.submit}</span>
                <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
             </button>
             <button
                onClick={useHint}
                disabled={isFinished || hintsRemaining <= 0}
                className="w-full py-3 lg:py-4 bg-amber-400/20 text-amber-200 font-black uppercase tracking-widest rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg hover:shadow-amber-400/20 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed text-sm lg:text-base"
             >
                <span>Hint</span>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 21h6v-1a3 3 0 0 0-3-3 3 3 0 0 0-3 3v1Zm3-6a7 7 0 1 0-7-7 7 7 0 0 0 7 7Z"/>
                </svg>
             </button>
          </div>
        </div>
      </div>

      {/* Hidden input to enable mobile soft keyboard */}
      <input
        ref={mobileInputRef}
        inputMode="text"
        autoCapitalize="characters"
        autoCorrect="off"
        autoComplete="off"
        onChange={onMobileInputChange}
        onKeyDown={onMobileKeyDown}
        className="absolute opacity-0 w-px h-px"
        aria-hidden="true"
      />

      {/* Toggle keyboard button (hidden while sheet open) */}
      {!showKeyboard && (
        <button
          type="button"
          onClick={() => setShowKeyboard(true)}
          className="fixed bottom-4 left-4 z-40 px-4 py-2 rounded-full bg-white/10 text-white border border-white/20 text-xs font-bold backdrop-blur hover:bg-white/20"
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
                if (isFinished) return;
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

      <GameCompletedOverlay 
        isOpen={isFinished} 
        variant={hasWon ? 'success' : 'failure'}
        title={hasWon ? t.completed : t.gameOver}
        message={hasWon ? "You've solved today's puzzle!" : t.betterLuck}
        solutionContent={
           <div className="w-full text-left">
              <div className="text-xs font-black uppercase tracking-widest text-text-muted mb-3 text-center opacity-60">Solution</div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs md:text-sm">
                 {clues.sort((a,b) => a.number - b.number).map(clue => (
                    <div key={clue.number + clue.direction} className="flex flex-col bg-white/5 p-2 rounded border border-white/5">
                       <span className="font-bold text-primary mb-0.5">{clue.number}. {clue.direction === 'across' ? t.across : t.down}</span>
                       <span className="text-white font-black tracking-wide">{clue.answer}</span>
                       <span className="text-[10px] text-text-muted truncate">{clue.text}</span>
                    </div>
                 ))}
              </div>
           </div>
        }
      />

    </div>
  );
}
