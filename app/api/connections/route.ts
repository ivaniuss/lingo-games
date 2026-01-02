import { NextResponse, NextRequest } from 'next/server';
import { CONNECTIONS_DATA } from '@/lib/connections-data';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get('lang') || 'en';
  const difficultyParam = (searchParams.get('difficulty') || 'normal').toLowerCase();
  
  const pool = CONNECTIONS_DATA[lang] || CONNECTIONS_DATA['en'];

  const now = new Date();
  const dateString = `${now.getUTCFullYear()}-${now.getUTCMonth() + 1}-${now.getUTCDate()}`;
  
  // Seed hash for deterministic daily selection
  let hash = 0;
  for (let i = 0; i < dateString.length; i++) {
    hash = dateString.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Selection logic for difficulty
  // Easy: 3x3, Normal: 4x4, Hard: 5x5
  const countMap = { easy: 3, normal: 4, hard: 5 };
  const n = countMap[difficultyParam as keyof typeof countMap] || 4;

  // For a pool of categories, we pick N.
  // We use the hash to shuffle and pick the first N.
  const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  const selectedGroups = [...pool]
    .sort((a, b) => seededRandom(hash + a.category.length) - seededRandom(hash + b.category.length))
    .slice(0, Math.min(n, pool.length))
    .map(group => ({
      ...group,
      words: group.words.slice(0, n) // Slice words to match the N groups (3x3, 4x4, 5x5)
    }));

  const puzzleNumber = Math.floor(now.getTime() / (1000 * 60 * 60 * 24)) - 20000;

  return NextResponse.json({
    groups: selectedGroups,
    number: puzzleNumber,
    date: dateString,
    lang,
    difficulty: difficultyParam
  });
}
