export interface ConnectionCategory {
  category: string;
  words: string[];
  difficulty: number;
}

export const CONNECTIONS_DATA: Record<string, ConnectionCategory[]> = {
  es: [
    { category: 'FRUTAS ROJAS', words: ['FRESA', 'CEREZA', 'SANDÍA', 'FRAMBUESA', 'CIRUELA'], difficulty: 1 },
    { category: 'INSTRUMENTOS DE CUERDA', words: ['GUITARRA', 'VIOLÍN', 'ARPA', 'CHELO', 'CONTRABAJO'], difficulty: 2 },
    { category: 'CIUDADES ESPAÑOLAS', words: ['MADRID', 'BARCELONA', 'VALENCIA', 'SEVILLA', 'BILBAO'], difficulty: 3 },
    { category: 'PALABRAS QUE TERMINAN EN -AL', words: ['CANAL', 'FINAL', 'METAL', 'VOCAL', 'TOTAL'], difficulty: 4 },
    { category: 'METALES PRECIOSOS', words: ['ORO', 'PLATA', 'PLATINO', 'COBRE', 'PALADIO'], difficulty: 1 },
    { category: 'PLANETAS', words: ['MARTE', 'JÚPITER', 'SATURNO', 'VENUS', 'MERCURIO'], difficulty: 2 },
    { category: 'GÉNEROS LITERARIOS', words: ['POESÍA', 'DRAMA', 'NOVELA', 'ENSAYO', 'CRÓNICA'], difficulty: 3 },
    { category: 'ANIMALES NOCTURNOS', words: ['BÚHO', 'MURCIÉLAGO', 'ZORRO', 'MAPACHE', 'HURÓN'], difficulty: 4 },
    { category: 'COCOS', words: ['CONCIERTO', 'CONFERENCIA', 'CONGRESO', 'CONVENCION', 'CONCILIO'], difficulty: 4 },
    { category: 'TRANSPORTE PÚBLICO', words: ['AUTOBÚS', 'METRO', 'TREN', 'TRANVÍA', 'FERRY'], difficulty: 1 },
    { category: 'ELEMENTOS QUÍMICOS', words: ['OXÍGENO', 'HIERRO', 'ORO', 'PLATA', 'HELIO'], difficulty: 2 },
    { category: 'GÉNEROS MUSICALES', words: ['ROCK', 'JAZZ', 'SALSA', 'TECHNO', 'REGGAE'], difficulty: 3 },
    { category: 'ANIMALES CON CAPARAZÓN', words: ['TORTUGA', 'CARACOL', 'ARMADILLO', 'CANGREJO', 'LANGOSTA'], difficulty: 4 },
  ],
  en: [
    { category: 'RED FRUITS', words: ['STRAWBERRY', 'CHERRY', 'WATERMELON', 'RASPBERRY', 'PLUM'], difficulty: 1 },
    { category: 'STRING INSTRUMENTS', words: ['GUITAR', 'VIOLIN', 'HARP', 'CELLO', 'BASS'], difficulty: 2 },
    { category: 'US CITIES', words: ['MIAMI', 'CHICAGO', 'BOSTON', 'SEATTLE', 'DENVER'], difficulty: 3 },
    { category: 'WORDS ENDING IN -AL', words: ['CANAL', 'FINAL', 'METAL', 'VOCAL', 'TOTAL'], difficulty: 4 },
    { category: 'PRECIOUS METALS', words: ['GOLD', 'SILVER', 'PLATINUM', 'COPPER', 'PALLADIUM'], difficulty: 1 },
    { category: 'PLANETS', words: ['MARS', 'JUPITER', 'SATURN', 'VENUS', 'MERCURY'], difficulty: 2 },
    { category: 'LITERARY GENRES', words: ['POETRY', 'DRAMA', 'NOVEL', 'ESSAY', 'MEMOIR'], difficulty: 3 },
    { category: 'NOCTURNAL ANIMALS', words: ['OWL', 'BAT', 'FOX', 'RACCOON', 'FERRET'], difficulty: 4 },
    { category: 'GATHERINGS', words: ['CONCERT', 'CONFERENCE', 'CONGRESS', 'CONVENTION', 'COUNCIL'], difficulty: 4 },
    { category: 'PUBLIC TRANSPORT', words: ['BUS', 'SUBWAY', 'TRAIN', 'TRAM', 'FERRY'], difficulty: 1 },
    { category: 'CHEMICAL ELEMENTS', words: ['OXYGEN', 'IRON', 'GOLD', 'SILVER', 'HELIUM'], difficulty: 2 },
    { category: 'MUSIC GENRES', words: ['ROCK', 'JAZZ', 'POP', 'TECHNO', 'REGGAE'], difficulty: 3 },
    { category: 'SHELLED ANIMALS', words: ['TURTLE', 'SNAIL', 'ARMADILLO', 'CRAB', 'LOBSTER'], difficulty: 4 },
  ],
  fr: [
    { category: 'FRUITS ROUGES', words: ['FRAISE', 'CERISE', 'PASTÈQUE', 'FRAMBOISE', 'PRUNE'], difficulty: 1 },
    { category: 'INSTRUMENTS À CORDES', words: ['GUITARE', 'VIOLON', 'HARPE', 'VIOLONCELLE', 'CONTREBASSE'], difficulty: 2 },
    { category: 'VILLES FRANÇAISES', words: ['PARIS', 'LYON', 'MARSEILLE', 'NICE', 'BORDEAUX'], difficulty: 3 },
    { category: 'MOTS FINISSANT PAR -AL', words: ['CANAL', 'FINAL', 'MÉTAL', 'VOCAL', 'TOTAL'], difficulty: 4 },
    { category: 'MÉTAUX PRÉCIEUX', words: ['OR', 'ARGENT', 'PLATINE', 'CUIVRE', 'PALLADIUM'], difficulty: 1 },
    { category: 'PLANÈTES', words: ['MARS', 'JUPITER', 'SATURNE', 'VÉNUS', 'MERCURE'], difficulty: 2 }
  ],
  de: [
    { category: 'ROTE FRÜCHTE', words: ['ERDBEERE', 'KIRSCHE', 'WASSERMELONE', 'HIMBEERE', 'PFLAUME'], difficulty: 1 },
    { category: 'SAITENINSTRUMENTE', words: ['GITARRE', 'VIOLINE', 'HARFE', 'CELLO', 'KONTREBASS'], difficulty: 2 },
    { category: 'DEUTSCHE STÄDTE', words: ['BERLIN', 'MÜNCHEN', 'HAMBURG', 'KÖLN', 'FRANKFURT'], difficulty: 3 },
    { category: 'WÖRTER AUF -AL', words: ['KANAL', 'FINAL', 'METALL', 'VOKAL', 'TOTAL'], difficulty: 4 },
    { category: 'EDELMETALLE', words: ['GOLD', 'SILBER', 'PLATIN', 'KUPFER', 'PALLADIUM'], difficulty: 1 },
    { category: 'PLANETEN', words: ['MARS', 'JUPITER', 'SATURN', 'VENUS', 'MERKUR'], difficulty: 2 }
  ],
  it: [
    { category: 'FRUTTI ROSSI', words: ['FRAGOLA', 'CILIEGIA', 'ANGURIA', 'LAMPONE', 'PRUGNA'], difficulty: 1 },
    { category: 'STRUMENTI A CORDE', words: ['CHITARRA', 'VIOLINO', 'ARPA', 'CELLO', 'CONTRABBASSO'], difficulty: 2 },
    { category: 'CITTÀ ITALIANE', words: ['ROMA', 'MILANO', 'VENEZIA', 'NAPOLI', 'FIRENZE'], difficulty: 3 },
    { category: 'PAROLE CHE FINISCONO IN -AL', words: ['CANAL', 'FINAL', 'METAL', 'VOCAL', 'TOTAL'], difficulty: 4 },
    { category: 'METALLI PREZIOSI', words: ['ORO', 'ARGENTO', 'PLATINO', 'RAME', 'PALLADIO'], difficulty: 1 },
    { category: 'PIANETI', words: ['MARTE', 'GIOVE', 'SATURNO', 'VENERE', 'MERCURIO'], difficulty: 2 }
  ],
  pt: [
    { category: 'FRUTAS VERMELHAS', words: ['MORANGO', 'CEREJA', 'MELANCIA', 'FRAMBOESA', 'AMEIXA'], difficulty: 1 },
    { category: 'INSTRUMENTOS DE CORDAS', words: ['GUITARRA', 'VIOLINO', 'HARPA', 'CHELO', 'CONTRABAIXO'], difficulty: 2 },
    { category: 'CIDADES BRASILEIRAS', words: ['RIO', 'SAO PAULO', 'BRASILIA', 'RECIFE', 'CURITIBA'], difficulty: 3 },
    { category: 'PALABRAS QUE TERMINAM EM -AL', words: ['CANAL', 'FINAL', 'METAL', 'VOGAL', 'TOTAL'], difficulty: 4 },
    { category: 'METAIS PRECIOSOS', words: ['OURO', 'PRATA', 'PLATINA', 'COBRE', 'PALÁDIO'], difficulty: 1 },
    { category: 'PLANETAS', words: ['MARTE', 'JÚPITER', 'SATURNO', 'VÊNUS', 'MERCÚRIO'], difficulty: 2 }
  ],
  'pt-BR': [
    { category: 'FRUTAS VERMELHAS', words: ['MORANGO', 'CEREJA', 'MELANCIA', 'FRAMBOESA', 'AMEIXA'], difficulty: 1 },
    { category: 'INSTRUMENTOS DE CORDAS', words: ['GUITARRA', 'VIOLINO', 'HARPA', 'CHELO', 'CONTRABAIXO'], difficulty: 2 },
    { category: 'CIDADES BRASILEIRAS', words: ['RIO', 'SAO PAULO', 'BRASILIA', 'RECIFE', 'CURITIBA'], difficulty: 3 },
    { category: 'PALABRAS QUE TERMINAM EM -AL', words: ['CANAL', 'FINAL', 'METAL', 'VOGAL', 'TOTAL'], difficulty: 4 },
    { category: 'METAIS PRECIOSOS', words: ['OURO', 'PRATA', 'PLATINA', 'COBRE', 'PALÁDIO'], difficulty: 1 },
    { category: 'PLANETAS', words: ['MARTE', 'JÚPITER', 'SATURNO', 'VÊNUS', 'MERCÚRIO'], difficulty: 2 }
  ],
  'pt-PT': [
    { category: 'FRUTOS VERMELHOS', words: ['MORANGO', 'CEREJA', 'MELANCIA', 'FRAMBOESA', 'AMEIXA'], difficulty: 1 },
    { category: 'INSTRUMENTOS DE CORDAS', words: ['GUITARRA', 'VIOLINO', 'HARPA', 'VIOLONCELO', 'CONTRABAIXO'], difficulty: 2 },
    { category: 'CIDADES PORTUGUESAS', words: ['LISBOA', 'PORTO', 'COIMBRA', 'BRAGA', 'FARO'], difficulty: 3 },
    { category: 'PALAVRAS QUE TERMINAM EM -AL', words: ['CANAL', 'FINAL', 'METAL', 'VOGAL', 'TOTAL'], difficulty: 4 },
    { category: 'METAIS PRECIOSOS', words: ['OURO', 'PRATA', 'PLATINA', 'COBRE', 'PALÁDIO'], difficulty: 1 },
    { category: 'PLANETAS', words: ['MARTE', 'JÚPITER', 'SATURNO', 'VÉNUS', 'MERCÚRIO'], difficulty: 2 }
  ]
};
