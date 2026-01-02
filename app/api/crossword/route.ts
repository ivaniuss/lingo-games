import { NextResponse } from 'next/server';
import { GRID_DATA } from '@/lib/grid-data';

export const dynamic = 'force-dynamic';

interface PlacedWord {
  word: string;
  category: string;
  row: number;
  col: number;
  direction: 'across' | 'down';
}

interface Clue {
  number: number;
  direction: 'across' | 'down';
  text: string;
  row: number;
  col: number;
  length: number;
  answer: string;
}

interface Intersection {
  letter: string;
  pos1: number; // index in word1
  pos2: number; // index in word2
}

function findAllIntersections(word1: string, word2: string): Intersection[] {
  const intersections: Intersection[] = [];
  for (let i = 0; i < word1.length; i++) {
    for (let j = 0; j < word2.length; j++) {
      if (word1[i] === word2[j]) {
        intersections.push({ letter: word1[i], pos1: i, pos2: j });
      }
    }
  }
  return intersections;
}

function canPlaceWord(
  grid: string[][],
  word: string,
  row: number,
  col: number,
  direction: 'across' | 'down',
  rows: number,
  cols: number
): boolean {
  if (row < 0 || col < 0) return false;
  if (direction === 'across') {
    if (col + word.length > cols) return false;
    for (let i = 0; i < word.length; i++) {
      const cell = grid[row][col + i];
      if (cell !== '' && cell !== word[i]) return false;
      
      // Strict check: letters cannot be adjacent to letters from other words
      // EXCEPT at the point of intersection.
      if (cell === '') {
        // Vertical neighbors
        if (row > 0 && grid[row - 1][col + i] !== '') return false;
        if (row < rows - 1 && grid[row + 1][col + i] !== '') return false;
      }
    }
    // Start and End neighbors
    if (col > 0 && grid[row][col - 1] !== '') return false;
    if (col + word.length < cols && grid[row][col + word.length] !== '') return false;

  } else { // Down
    if (row + word.length > rows) return false;
    for (let i = 0; i < word.length; i++) {
      const cell = grid[row + i][col];
      if (cell !== '' && cell !== word[i]) return false;
      
      if (cell === '') {
        // Horizontal neighbors
        if (col > 0 && grid[row + i][col - 1] !== '') return false;
        if (col < cols - 1 && grid[row + i][col + 1] !== '') return false;
      }
    }
    // Start and End neighbors
    if (row > 0 && grid[row - 1][col] !== '') return false;
    if (row + word.length < rows && grid[row + word.length][col] !== '') return false;
  }

  return true;
}

function generateCrossword(language: string, dateSeed: number, difficulty: 'easy' | 'normal' | 'hard') {
  const data = GRID_DATA[language as keyof typeof GRID_DATA] || GRID_DATA.en;
  
  const settings = {
    easy: { size: 8, minLen: 3, maxLen: 5, targetCount: 4 },
    normal: { size: 11, minLen: 3, maxLen: 8, targetCount: 7 },
    hard: { size: 13, minLen: 4, maxLen: 10, targetCount: 10 },
  } as const;
  
  const config = settings[difficulty] || settings.normal;
  const GRID_SIZE = config.size;
  
  let seed = dateSeed;
  const random = () => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };

  // BUILD A ROBUST POOL: Flatten ALL words from ALL categories
  const wordPool: { word: string, category: string }[] = [];
  const entries = Object.entries(data);
  for (const [cat, words] of entries) {
    for (const w of words) {
      if (w.length >= config.minLen && w.length <= config.maxLen) {
        wordPool.push({ word: w.toUpperCase(), category: cat.toUpperCase() });
      }
    }
  }
  
  // Shuffle the entire pool
  wordPool.sort(() => random() - 0.5);

  if (wordPool.length === 0) return { grid: [], clues: [], width: 5, height: 5 };

  let grid: string[][] = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(''));
  let placedWords: PlacedWord[] = [];

  // Try different starting words if the first one leads to a dead end
  for (let startIdx = 0; startIdx < Math.min(wordPool.length, 5); startIdx++) {
    grid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(''));
    placedWords = [];

    const first = wordPool[startIdx];
    const startRow = Math.floor(GRID_SIZE / 2);
    const startCol = Math.max(0, Math.floor((GRID_SIZE - first.word.length) / 2));
    
    // Check if it fits (middle row)
    if (startCol + first.word.length <= GRID_SIZE) {
      for (let i = 0; i < first.word.length; i++) grid[startRow][startCol + i] = first.word[i];
      placedWords.push({ ...first, row: startRow, col: startCol, direction: 'across' });

      let poolIdx = 0;
      let attempts = 0;
      
      // Attempt to place remaining words
      while (placedWords.length < config.targetCount && poolIdx < wordPool.length && attempts < 1500) {
        const candidate = wordPool[poolIdx];
        poolIdx++;
        
        if (placedWords.some(p => p.word === candidate.word)) continue;

        let placed = false;
        // Try all placed words as potential intersection points
        const targets = [...placedWords].sort(() => random() - 0.5);
        
        for (const target of targets) {
          if (placed) break;
          const intersections = findAllIntersections(target.word, candidate.word);
          intersections.sort(() => random() - 0.5);
          
          for (const inter of intersections) {
            const newDir = target.direction === 'across' ? 'down' : 'across';
            let newRow, newCol;
            
            if (newDir === 'down') {
              newRow = target.row - inter.pos2;
              newCol = target.col + inter.pos1;
            } else {
              newRow = target.row + inter.pos1;
              newCol = target.col - inter.pos2;
            }

            if (canPlaceWord(grid, candidate.word, newRow, newCol, newDir, GRID_SIZE, GRID_SIZE)) {
              if (newDir === 'across') {
                for (let k = 0; k < candidate.word.length; k++) grid[newRow][newCol + k] = candidate.word[k];
              } else {
                for (let k = 0; k < candidate.word.length; k++) grid[newRow + k][newCol] = candidate.word[k];
              }
              placedWords.push({ ...candidate, row: newRow, col: newCol, direction: newDir });
              placed = true;
              break;
            }
          }
        }
        attempts++;
      }
      
      // If we reached a decent amount of words, stop trying different starters
      if (placedWords.length >= config.targetCount - 1) break;
    }
  }

  // Build clues using standard crossword numbering (shared number for same start cell)
  const clues: Clue[] = [];
  const startToNumber = new Map<string, number>();
  let nextNum = 1;
  
  // Sort placed words by row, then col to assign incremental numbers top-to-bottom, left-to-right
  const orderedPlacement = [...placedWords].sort((a, b) => (a.row - b.row) || (a.col - b.col));
  
  for (const p of orderedPlacement) {
    const key = `${p.row},${p.col}`;
    if (!startToNumber.has(key)) {
      startToNumber.set(key, nextNum++);
    }
    const num = startToNumber.get(key)!;
    
    clues.push({
      number: num,
      direction: p.direction,
      text: p.category,
      row: p.row,
      col: p.col,
      length: p.word.length,
      answer: p.word
    });
  }

  return { grid, clues, width: GRID_SIZE, height: GRID_SIZE };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get('lang') || 'en';
  const difficultyParam = (searchParams.get('difficulty') || 'normal').toLowerCase();
  const difficulty = (['easy', 'normal', 'hard'].includes(difficultyParam) ? difficultyParam : 'normal') as 'easy' | 'normal' | 'hard';
  const dateParam = searchParams.get('date');
  
  const now = dateParam ? new Date(dateParam) : new Date();
  const puzzleNumber = Math.floor((now.getTime() - new Date('2024-01-01').getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const dateString = now.toISOString().split('T')[0]; 
  const dateHash = dateString.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

  const { grid, clues, width, height } = generateCrossword(lang, dateHash, difficulty);
  
  const attemptsByDifficulty: Record<'easy' | 'normal' | 'hard', number> = { easy: 5, normal: 3, hard: 2 };
  const hintsByDifficulty: Record<'easy' | 'normal' | 'hard', number> = { easy: 6, normal: 4, hard: 2 };

  return NextResponse.json({
    grid,
    clues,
    date: dateString,
    number: puzzleNumber,
    width,
    height,
    difficulty,
    maxAttempts: attemptsByDifficulty[difficulty],
    hints: hintsByDifficulty[difficulty]
  });
}
