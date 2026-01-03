import { NextResponse, NextRequest } from 'next/server';
import { WORDS_BY_LANG } from '@/lib/word-data';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get('lang') || 'en';
  const difficultyParam = (searchParams.get('difficulty') || 'normal').toLowerCase();
  const difficulty = (['easy', 'normal', 'hard'].includes(difficultyParam) ? difficultyParam : 'normal') as 'easy' | 'normal' | 'hard';
  
  // Get words for the selected language and difficulty
  const langWords = WORDS_BY_LANG[lang] || WORDS_BY_LANG['en'];
  const words = langWords[difficulty] || [];

  if (!words || words.length === 0) {
    return NextResponse.json({ error: 'No words available for the selected language and difficulty' }, { status: 400 });
  }

  // Wordle Settings
  const settings = {
    easy: { wordLength: 4, maxGuesses: 6 },
    normal: { wordLength: 6, maxGuesses: 6 },
    hard: { wordLength: 8, maxGuesses: 6 }
  } as const;
  
  const config = settings[difficulty];
  
  // Filter words by exact length (should already be filtered, but just in case)
  let filteredWords = words.filter(word => word.length === config.wordLength);
  let actualWordLength: number = config.wordLength;

  // Fallback to any available words if none match the expected length
  if (filteredWords.length === 0) {
    // Try to get words of any length from the same difficulty
    filteredWords = words;
    actualWordLength = words[0]?.length || 0;
  }

  // Final fallback to any available words from any difficulty
  if (filteredWords.length === 0) {
    const allWords = Object.values(langWords).flat();
    filteredWords = allWords.length > 0 ? [allWords[0]] : ['WORD'];
    actualWordLength = filteredWords[0].length;
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
