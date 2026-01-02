'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useGameStore } from '@/store/useGameStore';
import { GameCompletedOverlay } from './GameCompletedOverlay';

interface Group {
  category: string;
  words: string[];
  difficulty: number;
}

interface ConnectionsGameProps {
  groups: Group[];
}

const TRANSLATIONS = {
  en: {
    excellent: 'Excellent!',
    tryAgain: 'Try again',
    won: 'Congratulations! You won.',
    lost: 'Game over. You ran out of attempts.',
    mistakes: 'Mistakes:',
    shuffle: 'Shuffle',
    deselect: 'Deselect all',
    submit: 'Submit',
    playAgain: 'Play again'
  },
  es: {
    excellent: '¡Excelente!',
    tryAgain: 'Inténtalo de nuevo',
    won: '¡Felicidades! Has ganado.',
    lost: 'Fin del juego. Te has quedado sin intentos.',
    mistakes: 'Intentos:',
    shuffle: 'Barajar',
    deselect: 'Deseleccionar',
    submit: 'Enviar',
    playAgain: 'Jugar de nuevo'
  },
  fr: {
    excellent: 'Excellent !',
    tryAgain: 'Réessayez',
    won: 'Félicitations ! Vous avez gagné.',
    lost: 'Partie terminée. Vous n\'avez plus d\'essais.',
    mistakes: 'Nombre d\'erreurs :',
    shuffle: 'Mélanger',
    deselect: 'Tout désélectionner',
    submit: 'Envoyer',
    playAgain: 'Rejouer'
  },
  de: {
    excellent: 'Ausgezeichnet!',
    tryAgain: 'Versuch es nochmal',
    won: 'Herzlichen Glückwunsch! Du hast gewonnen.',
    lost: 'Game over. Du hast keine Versuche mehr.',
    mistakes: 'Fehler:',
    shuffle: 'Mischen',
    deselect: 'Alle abwählen',
    submit: 'Senden',
    playAgain: 'Erneut spielen'
  },
  it: {
    excellent: 'Eccellente!',
    tryAgain: 'Riprova',
    won: 'Congratulazioni! Hai vinto.',
    lost: 'Game over. Hai esaurito i tentativi.',
    mistakes: 'Errori:',
    shuffle: 'Mischia',
    deselect: 'Deseleziona tutto',
    submit: 'Invia',
    playAgain: 'Gioca ancora'
  },
  pt: {
    excellent: 'Excelente!',
    tryAgain: 'Tente novamente',
    won: 'Parabéns! Você ganhou.',
    lost: 'Fim de jogo. Você ficou sem tentativas.',
    mistakes: 'Erros:',
    shuffle: 'Embaralhar',
    deselect: 'Desmarcar tudo',
    submit: 'Enviar',
    playAgain: 'Jogar novamente'
  }
};

export function ConnectionsGame({ groups }: ConnectionsGameProps) {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS] || TRANSLATIONS.en;

  const saveGameState = useGameStore((state) => state.saveGameState);
  const getGameState = useGameStore((state) => state.getGameState);
  const recordWin = useGameStore((state) => state.recordWin);
  const recordLoss = useGameStore((state) => state.recordLoss);
  const markComplete = useGameStore((state) => state.markComplete);

  const [allWords, setAllWords] = useState<{ word: string; category: string; difficulty: number }[]>([]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [foundGroups, setFoundGroups] = useState<Group[]>([]);
  const [mistakesRemaining, setMistakesRemaining] = useState(4);
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  const [message, setMessage] = useState('');

  // Load saved state on mount
  useEffect(() => {
    const savedState = getGameState('connections');
    if (savedState && savedState.allWords && savedState.allWords.length > 0) {
      setAllWords(savedState.allWords);
      setSelectedWords(savedState.selectedWords || []);
      setFoundGroups(savedState.foundGroups || []);
      setMistakesRemaining(savedState.mistakesRemaining ?? 4);
      setGameState(savedState.gameState || 'playing');
    } else {
      // Initialize with shuffled words
      const words = groups.flatMap(g => g.words.map(w => ({ word: w, category: g.category, difficulty: g.difficulty })));
      setAllWords(words.sort(() => Math.random() - 0.5));
    }
  }, [groups, getGameState]);

  // Auto-save state whenever it changes
  useEffect(() => {
    if (allWords.length > 0) {
      saveGameState('connections', {
        allWords,
        selectedWords,
        foundGroups,
        mistakesRemaining,
        gameState,
      });
    }
  }, [allWords, selectedWords, foundGroups, mistakesRemaining, gameState, saveGameState]);

  const toggleWord = (word: string) => {
    if (gameState !== 'playing') return;
    if (selectedWords.includes(word)) {
      setSelectedWords(selectedWords.filter(w => w !== word));
    } else if (selectedWords.length < 4) {
      setSelectedWords([...selectedWords, word]);
    }
  };

  const handleSubmit = () => {
    if (selectedWords.length !== 4) return;

    const firstWordData = allWords.find(w => w.word === selectedWords[0]);
    const isCorrect = selectedWords.every(word => {
      const wordData = allWords.find(w => w.word === word);
      return wordData?.category === firstWordData?.category;
    });

    if (isCorrect) {
      const newGroup = groups.find(g => g.category === firstWordData?.category)!;
      setFoundGroups([...foundGroups, newGroup]);
      setAllWords(allWords.filter(w => !selectedWords.includes(w.word)));
      setSelectedWords([]);
      setMessage(t.excellent);
      
      if (foundGroups.length === 3) {
        setGameState('won');
        setMessage(t.won);
        recordWin('connections');
        markComplete('connections');
      }
    } else {
      setMistakesRemaining(prev => prev - 1);
      setMessage(t.tryAgain);
      if (mistakesRemaining <= 1) {
        setGameState('lost');
        setMessage(t.lost);
        recordLoss('connections');
        markComplete('connections');
      }
    }

    setTimeout(() => setMessage(''), 2000);
  };

  const shuffleWords = () => {
    setAllWords([...allWords].sort(() => Math.random() - 0.5));
  };

  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1: return 'bg-yellow-400 text-black';
      case 2: return 'bg-green-400 text-black';
      case 3: return 'bg-blue-400 text-black';
      case 4: return 'bg-purple-400 text-white';
      default: return 'bg-primary text-bg-deep';
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto px-4 gap-y-8">
      {/* Found Groups */}
      <div className="w-full flex flex-col gap-2">
        {foundGroups.map((group, i) => (
          <div 
            key={i} 
            className={`w-full py-4 rounded-xl text-center font-black uppercase tracking-widest animate-in slide-in-from-top-4 ${getDifficultyColor(group.difficulty)}`}
          >
            <div className="text-xs opacity-80 mb-1">{group.category}</div>
            <div className="text-sm md:text-base">{group.words.join(', ')}</div>
          </div>
        ))}
      </div>

      {/* Message Overlay */}
      {message && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-white text-black px-6 py-2 rounded-full font-bold shadow-xl animate-in fade-in zoom-in-90">
          {message}
        </div>
      )}

      {/* Word Grid */}
      {gameState === 'playing' && (
        <div className="grid grid-cols-4 gap-2 md:gap-4 w-full">
          {allWords.map((item, i) => (
            <button
              key={i}
              onClick={() => toggleWord(item.word)}
              className={`
                h-16 md:h-24 rounded-xl flex items-center justify-center text-[10px] md:text-sm font-black uppercase tracking-tight transition-all duration-200
                ${selectedWords.includes(item.word)
                  ? 'bg-primary text-bg-deep scale-95'
                  : 'bg-glass border border-white/5 hover:bg-white/10'
                }
              `}
            >
              {item.word}
            </button>
          ))}
        </div>
      )}

      {/* Game State Info */}
      <div className="flex flex-col items-center gap-4">
        {gameState === 'playing' && (
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-[10px] uppercase font-black tracking-widest text-text-muted mr-2">{t.mistakes}</span>
            {Array.from({ length: 4 }).map((_, i) => (
              <div 
                key={i} 
                className={`w-3 h-3 rounded-full border border-white/20 ${i < mistakesRemaining ? 'bg-primary' : 'bg-transparent'}`}
              />
            ))}
          </div>
        )}

        {/* Controls */}
        <div className="flex gap-4">
          {gameState === 'playing' ? (
            <>
              <button
                onClick={shuffleWords}
                className="px-6 py-3 bg-white/5 border border-white/10 rounded-full text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all"
              >
                {t.shuffle}
              </button>
              <button
                onClick={() => setSelectedWords([])}
                className="px-6 py-3 bg-white/5 border border-white/10 rounded-full text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all"
              >
                {t.deselect}
              </button>
              <button
                onClick={handleSubmit}
                disabled={selectedWords.length !== 4}
                className={`
                  px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all
                  ${selectedWords.length === 4
                    ? 'bg-primary text-bg-deep shadow-lg hover:scale-[1.05] active:scale-95'
                    : 'bg-white/5 text-text-muted/50 border border-white/5 cursor-not-allowed grayscale'
                  }
                `}
              >
                {t.submit}
              </button>
            </>
          ) : (
            <button 
              onClick={() => window.location.href = '/'}
              className="px-12 py-4 bg-primary text-bg-deep rounded-2xl text-base font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl"
            >
              {t.playAgain}
            </button>
          )}
        </div>
      </div>
      {/* Standardized Completion Overlay */}
      <GameCompletedOverlay 
        isOpen={gameState !== 'playing'}
        variant={gameState === 'won' ? 'success' : 'failure'}
        title={gameState === 'won' ? t.won : t.lost}
        message={gameState === 'won' ? t.won : t.lost}
        solutionContent={
           <div className="w-full flex flex-col gap-2">
             <div className="text-xs font-black uppercase tracking-widest text-text-muted mb-1 opacity-60">Correct Groups</div>
             {groups.map((group, i) => (
               <div 
                 key={i} 
                 className={`w-full py-2 rounded-lg text-center font-bold uppercase tracking-wide text-[10px] md:text-xs ${getDifficultyColor(group.difficulty)}`}
               >
                 <div className="opacity-80">{group.category}</div>
                 <div className="text-[8px] md:text-[10px] mt-0.5 opacity-70 leading-tight">{group.words.join(', ')}</div>
               </div>
             ))}
           </div>
        }
      />
    </div>
  );
}
