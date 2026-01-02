import { NextResponse, NextRequest } from 'next/server';

const PUZZLES_BY_LANG: Record<string, any[]> = {
  es: [
    {
      groups: [
        { category: 'FRUTAS ROJAS', words: ['FRESA', 'CEREZA', 'SANDÍA', 'FRAMBUESA'], difficulty: 1 },
        { category: 'INSTRUMENTOS DE CUERDA', words: ['GUITARRA', 'VIOLÍN', 'ARPA', 'CHELO'], difficulty: 2 },
        { category: 'CIUDADES ESPAÑOLAS', words: ['MADRID', 'BARCELONA', 'VALENCIA', 'SEVILLA'], difficulty: 3 },
        { category: 'PALABRAS QUE TERMINAN EN -AL', words: ['CANAL', 'FINAL', 'METAL', 'VOCAL'], difficulty: 4 },
      ]
    },
    {
      groups: [
        { category: 'TRANSPORTE PÚBLICO', words: ['AUTOBÚS', 'METRO', 'TREN', 'TRANVÍA'], difficulty: 1 },
        { category: 'ELEMENTOS QUÍMICOS', words: ['OXÍGENO', 'HIERRO', 'ORO', 'PLATA'], difficulty: 2 },
        { category: 'GÉNEROS MUSICALES', words: ['ROCK', 'JAZZ', 'SALSA', 'TECHNO'], difficulty: 3 },
        { category: 'ANIMALES CON CAPARAZÓN', words: ['TORTUGA', 'CARACOL', 'ARMADILLO', 'CANGREJO'], difficulty: 4 },
      ]
    }
  ],
  en: [
    {
      groups: [
        { category: 'RED FRUITS', words: ['STRAWBERRY', 'CHERRY', 'WATERMELON', 'RASPBERRY'], difficulty: 1 },
        { category: 'STRING INSTRUMENTS', words: ['GUITAR', 'VIOLIN', 'HARP', 'CELLO'], difficulty: 2 },
        { category: 'US CITIES', words: ['MIAMI', 'CHICAGO', 'BOSTON', 'SEATTLE'], difficulty: 3 },
        { category: 'WORDS ENDING IN -AL', words: ['CANAL', 'FINAL', 'METAL', 'VOCAL'], difficulty: 4 },
      ]
    },
    {
      groups: [
        { category: 'PUBLIC TRANSPORT', words: ['BUS', 'SUBWAY', 'TRAIN', 'TRAM'], difficulty: 1 },
        { category: 'CHEMICAL ELEMENTS', words: ['OXYGEN', 'IRON', 'GOLD', 'SILVER'], difficulty: 2 },
        { category: 'MUSIC GENRES', words: ['ROCK', 'JAZZ', 'POP', 'TECHNO'], difficulty: 3 },
        { category: 'SHELLED ANIMALS', words: ['TURTLE', 'SNAIL', 'ARMADILLO', 'CRAB'], difficulty: 4 },
      ]
    }
  ],
  fr: [
    {
      groups: [
        { category: 'FRUITS ROUGES', words: ['FRAISE', 'CERISE', 'PASTÈQUE', 'FRAMBOISE'], difficulty: 1 },
        { category: 'INSTRUMENTS À CORDES', words: ['GUITARE', 'VIOLON', 'HARPE', 'VIOLONCELLE'], difficulty: 2 },
        { category: 'VILLES FRANÇAISES', words: ['PARIS', 'LYON', 'MARSEILLE', 'NICE'], difficulty: 3 },
        { category: 'MOTS FINISSANT PAR -AL', words: ['CANAL', 'FINAL', 'MÉTAL', 'VOCAL'], difficulty: 4 },
      ]
    }
  ],
  de: [
    {
      groups: [
        { category: 'ROTE FRÜCHTE', words: ['ERDBEERE', 'KIRSCHE', 'WASSERMELONE', 'HIMBEERE'], difficulty: 1 },
        { category: 'SAITENINSTRUMENTE', words: ['GITARRE', 'VIOLINE', 'HARFE', 'CELLO'], difficulty: 2 },
        { category: 'DEUTSCHE STÄDTE', words: ['BERLIN', 'MÜNCHEN', 'HAMBURG', 'KÖLN'], difficulty: 3 },
        { category: 'WÖRTER AUF -AL', words: ['KANAL', 'FINAL', 'METALL', 'VOKAL'], difficulty: 4 },
      ]
    }
  ],
  it: [
    {
      groups: [
        { category: 'FRUTTI ROSSI', words: ['FRAGOLA', 'CILIEGIA', 'ANGURIA', 'LAMPONE'], difficulty: 1 },
        { category: 'STRUMENTI A CORDE', words: ['CHITARRA', 'VIOLINO', 'ARPA', 'CELLO'], difficulty: 2 },
        { category: 'CITTÀ ITALIANE', words: ['ROMA', 'MILANO', 'VENEZIA', 'NAPOLI'], difficulty: 3 },
        { category: 'PAROLE CHE FINISCONO IN -AL', words: ['CANAL', 'FINAL', 'METAL', 'VOCAL'], difficulty: 4 },
      ]
    }
  ],
  pt: [
    {
      groups: [
        { category: 'FRUTAS VERMELHAS', words: ['MORANGO', 'CEREJA', 'MELANCIA', 'FRAMBOESA'], difficulty: 1 },
        { category: 'INSTRUMENTOS DE CORDAS', words: ['GUITARRA', 'VIOLINO', 'HARPA', 'CHELO'], difficulty: 2 },
        { category: 'CIDADES BRASILEIRAS', words: ['RIO', 'SAO PAULO', 'BRASILIA', 'RECIFE'], difficulty: 3 },
        { category: 'PALAVRAS QUE TERMINAM EM -AL', words: ['CANAL', 'FINAL', 'METAL', 'VOGAL'], difficulty: 4 },
      ]
    }
  ]
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get('lang') || 'en';
  
  const puzzles = PUZZLES_BY_LANG[lang] || PUZZLES_BY_LANG['en'];

  const now = new Date();
  const dateString = `${now.getUTCFullYear()}-${now.getUTCMonth() + 1}-${now.getUTCDate()}`;
  
  let hash = 0;
  for (let i = 0; i < dateString.length; i++) {
    hash = dateString.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const index = Math.abs(hash) % puzzles.length;
  const puzzle = puzzles[index];
  const puzzleNumber = Math.floor(now.getTime() / (1000 * 60 * 60 * 24)) - 20000;

  return NextResponse.json({
    ...puzzle,
    number: puzzleNumber,
    date: dateString,
    lang
  });
}
