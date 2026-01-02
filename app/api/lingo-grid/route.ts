import { NextResponse, NextRequest } from 'next/server';

const DATA_BY_LANG: Record<string, { categories: string[], letters: string[] }> = {
  es: {
    categories: ['FRUTA', 'VERBO', 'PAÍS', 'COLOR', 'ANIMAL', 'PROFESIÓN', 'CIUDAD', 'OBJETO', 'COMIDA'],
    letters: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'L', 'M', 'N', 'O', 'P', 'R', 'S', 'T', 'U', 'V']
  },
  en: {
    categories: ['FRUIT', 'VERB', 'COUNTRY', 'COLOR', 'ANIMAL', 'JOB', 'CITY', 'OBJECT', 'FOOD'],
    letters: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'R', 'S', 'T', 'W']
  },
  fr: {
    categories: ['FRUIT', 'VERBE', 'PAYS', 'COULEUR', 'ANIMAL', 'METIER', 'VILLE', 'OBJET', 'NOURRITURE'],
    letters: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'L', 'M', 'N', 'O', 'P', 'R', 'S', 'T', 'U', 'V']
  },
  de: {
    categories: ['FRUCHT', 'VERB', 'LAND', 'FARBE', 'TIER', 'BERUF', 'STADT', 'OBJEKT', 'ESSEN'],
    letters: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'R', 'S', 'T', 'Z']
  },
  it: {
    categories: ['FRUTTA', 'VERBO', 'PAESE', 'COLORE', 'ANIMALE', 'LAVORO', 'CITTÀ', 'OGGETTO', 'CIBO'],
    letters: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V']
  },
  pt: {
    categories: ['FRUTA', 'VERBO', 'PAÍS', 'COR', 'ANIMAL', 'EMPREGO', 'CIDADE', 'OBJETO', 'COMIDA'],
    letters: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'L', 'M', 'N', 'O', 'P', 'R', 'S', 'T', 'U', 'V']
  }
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get('lang') || 'en';
  
  const data = DATA_BY_LANG[lang] || DATA_BY_LANG['en'];

  const now = new Date();
  const dateString = `${now.getUTCFullYear()}-${now.getUTCMonth() + 1}-${now.getUTCDate()}`;
  
  // Simple deterministic hash
  let hash = 0;
  for (let i = 0; i < dateString.length; i++) {
    hash = dateString.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const seed = Math.abs(hash);
  
  // Select 3 random categories and 3 random letters deterministically
  const rows: string[] = [];
  const cols: string[] = [];
  
  const availableCategories = [...data.categories];
  const availableLetters = [...data.letters];
  
  for (let i = 0; i < 3; i++) {
    const catIndex = (seed + i * 7) % availableCategories.length;
    rows.push(availableCategories[catIndex]);
    availableCategories.splice(catIndex, 1);
    
    const letIndex = (seed + i * 13) % availableLetters.length;
    cols.push(availableLetters[letIndex]);
    availableLetters.splice(letIndex, 1);
  }

  const puzzleNumber = Math.floor(now.getTime() / (1000 * 60 * 60 * 24)) - 20000;

  return NextResponse.json({
    rows,
    cols,
    number: puzzleNumber,
    date: dateString,
    lang
  });
}
