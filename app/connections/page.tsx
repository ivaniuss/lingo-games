'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useGameStore } from '@/store/useGameStore';
import { GameHeader } from '@/components/layout/GameHeader';
import { ConnectionsGame } from '@/components/ui/ConnectionsGame';
import { GameWrapper } from '@/components/layout/GameWrapper';

const GAME_TITLE = 'Connections';

const TRANSLATIONS = {
  en: {
    description: 'Find {n} groups of {n} words that have something in common.',
    helper: 'Select {n} words and press submit',
    loading: 'Loading...',
    error: "Failed to load today's challenge. Please try again later.",
    easy: 'Easy',
    normal: 'Normal', 
    hard: 'Hard'
  },
  es: {
    description: 'Encuentra {n} grupos de {n} palabras que tengan algo en común.',
    helper: 'Selecciona {n} palabras y pulsa enviar',
    loading: 'Cargando...',
    error: 'No se pudo cargar el reto de hoy. Por favor, inténtalo de nuevo más tarde.',
    easy: 'Fácil',
    normal: 'Normal',
    hard: 'Difícil'
  },
  fr: {
    description: 'Trouvez {n} groupes de {n} mots ayant un point commun.',
    helper: 'Sélectionnez {n} mots et appuyez sur envoyer',
    loading: 'Chargement...',
    error: "Échec du chargement du défi d'aujourd'hui. Veuillez réessayer plus tard.",
    easy: 'Facile',
    normal: 'Normal',
    hard: 'Difficile'
  },
  de: {
    description: 'Finde {n} Gruppen von {n} Wörtern, die etwas gemeinsam haben.',
    helper: 'Wähle {n} Wörter aus und drücke auf Senden',
    loading: 'Laden...',
    error: 'Die heutige Herausforderung konnte nicht geladen werden. Bitte versuchen Sie es später erneut.',
    easy: 'Leicht',
    normal: 'Normal',
    hard: 'Schwierig'
  },
  it: {
    description: 'Trova {n} gruppi di {n} parole che hanno qualcosa in comune.',
    helper: 'Seleziona {n} parole e premi invia',
    loading: 'Caricamento...',
    error: 'Impossibile caricare la sfida di oggi. Riprova più tardi.',
    easy: 'Facile',
    normal: 'Normale',
    hard: 'Difficile'
  },
  pt: {
    description: 'Encontre {n} grupos de {n} palavras que tenham algo em comum.',
    helper: 'Selecione {n} palavras e pressione enviar',
    loading: 'Carregando...',
    error: 'Falha ao carregar o desafío de hoje. Por favor, tente novamente mais tarde.',
    easy: 'Fácil',
    normal: 'Normal',
    hard: 'Difícil'
  }
};

export default function ConnectionsPage() {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS] || TRANSLATIONS.en;

  const isGameComplete = useGameStore((state) => state.isGameComplete('connections'));
  const [gameData, setGameData] = useState<{ groups: any[], number: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [difficulty, setDifficulty] = useState<'easy' | 'normal' | 'hard'>('normal');

  const handleDifficultyChange = (newDifficulty: 'easy' | 'normal' | 'hard') => {
    if (newDifficulty === difficulty) return;
    setDifficulty(newDifficulty);
    setGameData(null);
  };

  useEffect(() => {
    setLoading(true);
    fetch(`/api/connections?lang=${language}&difficulty=${difficulty}`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`Server returned ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then(data => {
        setGameData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching connections data:', err);
        setLoading(false);
      });
  }, [language, difficulty]);

  if (loading) {
    return (
      <GameWrapper title="Connections" gameId={t.loading}>
        <div className="flex-1 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        </div>
      </GameWrapper>
    );
  }

  if (!gameData) {
    return (
      <GameWrapper title="Connections" gameId="Error">
        <div className="flex-1 flex items-center justify-center text-error font-bold text-center px-6">
          {t.error}
        </div>
      </GameWrapper>
    );
  }

  const n = { easy: 3, normal: 4, hard: 5 }[difficulty];
  const dynamicDescription = t.description.replaceAll('{n}', n.toString());
  const dynamicHelper = t.helper.replaceAll('{n}', n.toString());

  return (
    <GameWrapper title={GAME_TITLE} gameId="">
      <div className="flex flex-col items-center justify-center flex-1 w-full py-8">
        
        <GameHeader 
          title={GAME_TITLE}
          description={dynamicDescription}
          puzzleNumber={gameData.number}
          difficulty={difficulty}
          onDifficultyChange={handleDifficultyChange}
          difficultyLabels={{
            easy: t.easy,
            normal: t.normal,
            hard: t.hard
          }}
        />

        {/* Spacer for breathing room */}
        <div className="h-12 md:h-16" />

        <ConnectionsGame 
          groups={gameData.groups} 
          difficulty={difficulty}
          puzzleNumber={gameData.number}
        />
        
        <div className="mt-16 text-center text-[10px] md:text-xs font-black tracking-[0.3em] text-text-muted uppercase opacity-40">
          {dynamicHelper}
        </div>
      </div>
    </GameWrapper>
  );
}
