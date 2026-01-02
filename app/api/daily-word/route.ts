import { NextResponse, NextRequest } from 'next/server';
import { WORDS_BY_LANG } from '@/lib/word-data';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get('lang') || 'en';
  
  // Fallback to English if language not found, or empty array
  const words = WORDS_BY_LANG[lang] || WORDS_BY_LANG['en'];

  if (!words || words.length === 0) {
    return NextResponse.json({ error: 'Language not supported or empty dictionary' }, { status: 400 });
  }

  // Use UTC date to ensure all users see the same word at the same time
  const now = new Date();
  const dateString = `${now.getUTCFullYear()}-${now.getUTCMonth() + 1}-${now.getUTCDate()}`;
  
  // Simple deterministic hash based on date string
  let hash = 0;
  for (let i = 0; i < dateString.length; i++) {
    hash = dateString.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const index = Math.abs(hash) % words.length;
  const word = words[index];
  const puzzleNumber = Math.floor(now.getTime() / (1000 * 60 * 60 * 24)) - 19720; // Adjusted offset for realism

  return NextResponse.json({
    word,
    number: puzzleNumber,
    date: dateString,
    lang
  });
}
