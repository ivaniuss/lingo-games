'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type GameType = 'wordle' | 'connections' | 'grid' | 'crossword';

interface GameScore {
  wins: number;
  losses: number;
}

interface GameState {
  // Wordle state
  wordle?: {
    guesses: string[];
    currentGuess: string;
    gameState: 'playing' | 'won' | 'lost';
    targetWord: string;
    puzzleNumber: number;
  };
  // Connections state
  connections?: {
    selectedWords: string[];
    foundGroups: any[];
    mistakesRemaining: number;
    gameState: 'playing' | 'won' | 'lost';
    allWords: any[];
  };
  // Grid state
  grid?: {
    gridData: string[][];
    status: 'playing' | 'validating' | 'finished';
    attemptsRemaining: number;
    hintsRemaining?: number;
  };
  // Crossword state
  crossword?: {
    gameState: 'playing' | 'won' | 'lost';
    userGrid: string[][];
  };
}

interface GameStore {
  // Daily scores
  dailyScores: Record<GameType, GameScore>;
  
  // Completion tracking
  completedGames: Record<GameType, boolean>;
  
  // Game states
  gameStates: GameState;
  
  // Last play date for daily reset
  lastPlayDate: string;
  
  // Actions
  recordWin: (game: GameType) => void;
  recordLoss: (game: GameType) => void;
  saveGameState: (game: GameType, state: any) => void;
  getGameState: (game: GameType) => any;
  markComplete: (game: GameType) => void;
  isGameComplete: (game: GameType) => boolean;
  checkAndResetDaily: () => void;
  getTotalScore: () => { wins: number; losses: number };
}

const getTodayDate = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      dailyScores: {
        wordle: { wins: 0, losses: 0 },
        connections: { wins: 0, losses: 0 },
        grid: { wins: 0, losses: 0 },
        crossword: { wins: 0, losses: 0 },
      },
      completedGames: {
        wordle: false,
        connections: false,
        grid: false,
        crossword: false,
      },
      gameStates: {},
      lastPlayDate: getTodayDate(),

      recordWin: (game) => {
        get().checkAndResetDaily();
        set((state) => ({
          dailyScores: {
            ...state.dailyScores,
            [game]: {
              ...state.dailyScores[game],
              wins: state.dailyScores[game].wins + 1,
            },
          },
        }));
      },

      recordLoss: (game) => {
        get().checkAndResetDaily();
        set((state) => ({
          dailyScores: {
            ...state.dailyScores,
            [game]: {
              ...state.dailyScores[game],
              losses: state.dailyScores[game].losses + 1,
            },
          },
        }));
      },

      saveGameState: (game, state) => {
        get().checkAndResetDaily();
        set((currentState) => ({
          gameStates: {
            ...currentState.gameStates,
            [game]: state,
          },
        }));
      },

      getGameState: (game) => {
        get().checkAndResetDaily();
        return get().gameStates[game];
      },

      markComplete: (game) => {
        get().checkAndResetDaily();
        set((state) => ({
          completedGames: {
            ...state.completedGames,
            [game]: true,
          },
        }));
      },

      isGameComplete: (game) => {
        get().checkAndResetDaily();
        return get().completedGames[game];
      },

      getTotalScore: () => {
        get().checkAndResetDaily();
        const scores = get().dailyScores;
        const totalWins = scores.wordle.wins + scores.connections.wins + scores.grid.wins + (scores.crossword?.wins || 0);
        const totalLosses = scores.wordle.losses + scores.connections.losses + scores.grid.losses + (scores.crossword?.losses || 0);
        return { wins: totalWins, losses: totalLosses };
      },

      checkAndResetDaily: () => {
        const today = getTodayDate();
        const lastDate = get().lastPlayDate;
        
        if (today !== lastDate) {
          // New day - reset everything
          set({
            dailyScores: {
              wordle: { wins: 0, losses: 0 },
              connections: { wins: 0, losses: 0 },
              grid: { wins: 0, losses: 0 },
              crossword: { wins: 0, losses: 0 },
            },
            completedGames: {
              wordle: false,
              connections: false,
              grid: false,
              crossword: false,
            },
            gameStates: {},
            lastPlayDate: today,
          });
        }
      },
    }),
    {
      name: 'lingogames-storage',
    }
  )
);
