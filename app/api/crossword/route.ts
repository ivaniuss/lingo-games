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

// Helper to check if a placement is valid
function canPlaceWord(
  grid: string[][],
  word: string,
  row: number,
  col: number,
  direction: 'across' | 'down',
  rows: number,
  cols: number
): boolean {
  if (direction === 'across') {
    if (col + word.length > cols) return false;
    for (let i = 0; i < word.length; i++) {
      const cell = grid[row][col + i];
      if (cell !== '' && cell !== word[i]) return false;
      
      if (cell === '') {
        if (row > 0 && grid[row - 1][col + i] !== '') return false;
        if (row < rows - 1 && grid[row + 1][col + i] !== '') return false;
      }
    }
    if (col > 0 && grid[row][col - 1] !== '') return false;
    if (col + word.length < cols && grid[row][col + word.length] !== '') return false;

  } else { // Down
    if (row + word.length > rows) return false;
    for (let i = 0; i < word.length; i++) {
      const cell = grid[row + i][col];
      if (cell !== '' && cell !== word[i]) return false;
      
      if (cell === '') {
        if (col > 0 && grid[row + i][col - 1] !== '') return false;
        if (col < cols - 1 && grid[row + i][col + 1] !== '') return false;
      }
    }
    if (row > 0 && grid[row - 1][col] !== '') return false;
    if (row + word.length < rows && grid[row + word.length][col] !== '') return false;
  }

  return true;
}

function generateCrossword(language: string, dateSeed: number) {
  const data = GRID_DATA[language as keyof typeof GRID_DATA] || GRID_DATA.en;
  const categories = Object.keys(data);
  const GRID_SIZE = 12;
  
  let seed = dateSeed;
  const random = () => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };

  const wordPool: { word: string, category: string }[] = [];
  const shuffledCats = [...categories].sort(() => random() - 0.5);
  
  for (const cat of shuffledCats) {
    const words = data[cat];
    const picked = words[Math.floor(random() * words.length)];
    if (picked.length <= 8 && picked.length >= 3) {
      if (!wordPool.some(w => w.word === picked)) {
        wordPool.push({ word: picked, category: cat });
      }
    }
    if (wordPool.length >= 25) break; 
  }

  const grid: string[][] = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(''));
  const placedWords: PlacedWord[] = [];

  const first = wordPool[0];
  const startRow = Math.floor(GRID_SIZE / 2);
  const startCol = Math.floor((GRID_SIZE - first.word.length) / 2);
  
  if (canPlaceWord(grid, first.word, startRow, startCol, 'across', GRID_SIZE, GRID_SIZE)) {
     for (let i = 0; i < first.word.length; i++) grid[startRow][startCol + i] = first.word[i];
     placedWords.push({ ...first, row: startRow, col: startCol, direction: 'across' });
  }

  let attempts = 0;
  let poolIndex = 1;
  
  while (poolIndex < wordPool.length && attempts < 500) {
    const candidate = wordPool[poolIndex];
    let placed = false;
    const targets = [...placedWords].sort(() => random() - 0.5);

    for (const target of targets) {
      if (placed) break;
      for (let i = 0; i < candidate.word.length; i++) {
        for (let j = 0; j < target.word.length; j++) {
          if (candidate.word[i] === target.word[j]) {
            const newDir = target.direction === 'across' ? 'down' : 'across';
            let newRow, newCol;
            if (newDir === 'down') {
              newRow = target.row - i;
              newCol = target.col + j;
            } else {
              newRow = target.row + j;
              newCol = target.col - i;
            }

            if (newRow >= 0 && newCol >= 0 && 
                canPlaceWord(grid, candidate.word, newRow, newCol, newDir, GRID_SIZE, GRID_SIZE)) {
                  
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
        if (placed) break;
      }
    }
    poolIndex++;
    attempts++;
  }

  const clues: Clue[] = [];
  const startPositions = new Map<string, number>(); 
  let currentNumber = 1;

  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const startsHere = placedWords.filter(p => p.row === r && p.col === c);
      if (startsHere.length > 0) {
        startPositions.set(`${r},${c}`, currentNumber);
        startsHere.forEach(p => {
           clues.push({
             number: currentNumber,
             direction: p.direction,
             text: p.category, 
             row: r,
             col: c,
             length: p.word.length,
             answer: p.word
           });
        });
        currentNumber++;
      }
    }
  }

  return { grid, clues, placedWords };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get('lang') || 'en';
  const dateParam = searchParams.get('date');
  
  const now = dateParam ? new Date(dateParam) : new Date();
  const puzzleNumber = Math.floor((now.getTime() - new Date('2024-01-01').getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const dateString = now.toISOString().split('T')[0]; 
  const dateHash = dateString.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

  const { grid, clues } = generateCrossword(lang, dateHash);
  
  return NextResponse.json({
    grid,
    clues,
    date: dateString,
    number: puzzleNumber,
    width: 12,
    height: 12
  });
}
