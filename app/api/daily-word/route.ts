import { NextResponse, NextRequest } from 'next/server';
import { WORDS_BY_LANG } from '@/lib/word-data';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get('lang') || 'en';
  const difficultyParam = (searchParams.get('difficulty') || 'normal').toLowerCase();
  const difficulty = (['easy', 'normal', 'hard'].includes(difficultyParam) ? difficultyParam : 'normal') as 'easy' | 'normal' | 'hard';
  
  const words = WORDS_BY_LANG[lang] || WORDS_BY_LANG['en'];

  if (!words || words.length === 0) {
    return NextResponse.json({ error: 'Language not supported or empty dictionary' }, { status: 400 });
  }

  // Pure Wordle Settings: One word only!
  const settings = {
    easy: { wordLength: 4, maxGuesses: 6 },
    normal: { wordLength: 6, maxGuesses: 6 },
    hard: { wordLength: 8, maxGuesses: 6 }
  } as const;
  
  const config = settings[difficulty];
  
  // Filter words by exact length
  let filteredWords = words.filter(word => word.length === config.wordLength);
  let actualWordLength: number = config.wordLength;

  if (filteredWords.length === 0) {
    filteredWords = words.filter(word => word.length === 6);
    actualWordLength = 6;
  }

  if (filteredWords.length === 0) {
    filteredWords = [words[0]];
    actualWordLength = words[0].length;
  }
  
  const now = new Date();
  const dateString = `${now.getUTCFullYear()}-${now.getUTCMonth() + 1}-${now.getUTCDate()}`;
  
  let hash = 0;
  for (let i = 0; i < dateString.length; i++) {
    hash = dateString.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const selectedIndex = Math.abs(hash) % filteredWords.length;
  const targetWord = filteredWords[selectedIndex];
  
  const puzzleNumber = Math.floor(now.getTime() / (1000 * 60 * 60 * 24)) - 19720;

  return NextResponse.json({
    words: [targetWord],
    number: puzzleNumber,
    date: dateString,
    lang,
    difficulty,
    wordLength: actualWordLength,
    maxGuesses: config.maxGuesses
  });
}
