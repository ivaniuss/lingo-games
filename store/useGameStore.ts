'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type GameType = 'wordle' | 'connections' | 'grid' | 'crossword';

interface GameScore {
  wins: number;
  losses: number;
}

interface GameState {
  puzzleNumber?: number;
  difficulty?: 'easy' | 'normal' | 'hard';
  language?: string;
  gameState?: 'playing' | 'won' | 'lost';
  // Wordle specific
  guesses?: string[];
  currentGuess?: string;
  targetWords?: string[];
  wordLength?: number;
  maxGuesses?: number;
  // Connections specific
  selectedWords?: string[];
  foundGroups?: unknown[];
  allWords?: unknown[];
  mistakesRemaining?: number;
  // Grid specific
  gridData?: (string | null)[][];
  status?: 'playing' | 'validating' | 'finished';
  attemptsRemaining?: number;
  hintsRemaining?: number;
  // Crossword specific
  userGrid?: (string | null)[][];
}

interface GameStore {
  // Daily scores
  dailyScores: Record<GameType, GameScore>;

  // Completion tracking
  completedGames: Record<string, boolean>;

  // Game states (now supports dynamic keys for languages)
  gameStates: Record<string, GameState>;

  // Last play date for daily reset
  lastPlayDate: string;

  // Actions
  recordWin: (game: GameType) => void;
  recordLoss: (game: GameType) => void;
  saveGameState: (game: GameType, state: GameState, lang?: string) => void;
  getGameState: (game: GameType, lang?: string) => GameState | undefined;
  markComplete: (game: GameType, lang?: string) => void;
  isGameComplete: (game: GameType, lang?: string) => boolean;
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
      completedGames: {},
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

      saveGameState: (game, state, lang) => {
        get().checkAndResetDaily();
        const key = lang ? `${game}-${lang}` : game;
        set((currentState) => ({
          gameStates: {
            ...currentState.gameStates,
            [key]: state,
          },
        }));
      },

      getGameState: (game, lang) => {
        get().checkAndResetDaily();
        const key = lang ? `${game}-${lang}` : game;
        const specificState = get().gameStates[key];

        if (specificState) return specificState;

        // Strict Fallback Logic:
        // Only fall back to the legacy 'game' key (e.g. 'wordle') if the requested language is 'en'
        // This prevents 'es' games from loading 'en' state (e.g. "BECOME")
        if (lang === 'en' || !lang) {
          return get().gameStates[game];
        }

        return undefined;
      },

      markComplete: (game, lang) => {
        get().checkAndResetDaily();
        const key = lang ? `${game}-${lang}` : game;
        set((state) => ({
          completedGames: {
            ...state.completedGames,
            [key]: true,
          },
        }));
      },

      isGameComplete: (game, lang) => {
        get().checkAndResetDaily();
        const key = lang ? `${game}-${lang}` : game;
        return !!get().completedGames[key];
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
