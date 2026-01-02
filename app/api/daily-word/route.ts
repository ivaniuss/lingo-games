import { NextResponse, NextRequest } from 'next/server';

const WORDS_BY_LANG: Record<string, string[]> = {
  es: ['LENGUA', 'IDIOMA', 'FRASE', 'HABLAR', 'LEER', 'NATIVO', 'PALABR', 'CULTUR', 'FLUIDO', 'ESTUDI', 'ACENTO', 'GLOSAR'],
  en: ['TONGUE', 'PHRASE', 'NATIVE', 'FLUENT', 'ACCENT', 'SPEECH', 'WRITER', 'READER', 'LISTEN', 'SCHOOL', 'LETTER', 'WORDS'],
  fr: ['LANGUE', 'PHRASE', 'PARLER', 'LIRE', 'NATIF', 'MOTS', 'CULTURE', 'FLUIDE', 'ETUDES', 'ACCENT', 'ECOLE', 'LETTRE'],
  de: ['SPRACH', 'PHRASE', 'REDEN', 'LESEN', 'MUTTER', 'WORTE', 'KULTUR', 'FLIESS', 'STUDIE', 'AKZENT', 'SCHULE', 'BRIEF'],
  it: ['LINGUA', 'FRASE', 'PARLARE', 'LEGGERE', 'NATIVO', 'PAROLA', 'STORIA', 'FLUIDO', 'STUDIO', 'ACCENTO', 'SCUOLA', 'LETTER'],
  pt: ['LINGUA', 'FRASO', 'FALAR', 'LER', 'NATIVO', 'PALAVR', 'CULTUR', 'FLUIDO', 'ESTUDO', 'ACENTO', 'ESCOLA', 'CARTA']
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get('lang') || 'en';
  
  const words = WORDS_BY_LANG[lang] || WORDS_BY_LANG['en'];

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
  const puzzleNumber = Math.floor(now.getTime() / (1000 * 60 * 60 * 24)) - 20000; // Arbitrary offset

  return NextResponse.json({
    word,
    number: puzzleNumber,
    date: dateString,
    lang
  });
}
