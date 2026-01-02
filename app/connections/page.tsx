'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useGameStore } from '@/store/useGameStore';
import { GameHeader } from '@/components/layout/GameHeader';
import { ConnectionsGame } from '@/components/ui/ConnectionsGame';
import { GameWrapper } from '@/components/layout/GameWrapper';
import { GameCompletedOverlay } from '@/components/ui/GameCompletedOverlay';

const GAME_TITLE = 'Connections';

const TRANSLATIONS = {
  en: {
    description: 'Find {n} groups of {n} words that have something in common.',
    helper: 'Select {n} words and press submit',
    loading: 'Loading...',
    error: "Failed to load today's challenge. Please try again later.",
    easy: 'Easy',
    normal: 'Normal', 
    hard: 'Hard',
    won: 'EXCELLENT!',
    won_msg: 'You have found all the groups!',
    lost: 'GAME OVER',
    lost_msg: 'Better luck next time!',
    groups: 'The groups were:'
  },
  es: {
    description: 'Encuentra {n} grupos de {n} palabras que tengan algo en común.',
    helper: 'Selecciona {n} palabras y pulsa enviar',
    loading: 'Cargando...',
    error: 'No se pudo cargar el reto de hoy. Por favor, inténtalo de nuevo más tarde.',
    easy: 'Fácil',
    normal: 'Normal',
    hard: 'Difícil',
    won: '¡EXCELENTE!',
    won_msg: '¡Has encontrado todos los grupos!',
    lost: 'JUEGO TERMINADO',
    lost_msg: '¡Mejor suerte la próxima vez!',
    groups: 'Los grupos eran:'
  },
  fr: {
    description: 'Trouvez {n} groupes de {n} mots ayant un point commun.',
    helper: 'Sélectionnez {n} mots et appuyez sur envoyer',
    loading: 'Chargement...',
    error: "Échec du chargement du défi d'aujourd'hui. Veuillez réessayer plus tard.",
    easy: 'Facile',
    normal: 'Normal',
    hard: 'Difficile',
    won: 'EXCELLENT !',
    won_msg: 'Vous avez trouvé tous les groupes !',
    lost: 'PERDU',
    lost_msg: 'Plus de chance la prochaine fois !',
    groups: 'Les groupes étaient :'
  },
  de: {
    description: 'Finde {n} Gruppen von {n} Wörtern, die etwas gemeinsam haben.',
    helper: 'Wähle {n} Wörter aus und drücke auf Senden',
    loading: 'Laden...',
    error: 'Die heutige Herausforderung konnte nicht geladen werden. Bitte versuchen Sie es später erneut.',
    easy: 'Leicht',
    normal: 'Normal',
    hard: 'Schwierig',
    won: 'AUSGEZEICHNET!',
    won_msg: 'Sie haben alle Gruppen gefunden!',
    lost: 'SPIEL VORBEI',
    lost_msg: 'Viel Glück beim nächsten Mal!',
    groups: 'Die Gruppen waren:'
  },
  it: {
    description: 'Trova {n} gruppi di {n} parole che hanno qualcosa in comune.',
    helper: 'Seleziona {n} parole e premi invia',
    loading: 'Caricamento...',
    error: 'Impossibile caricare la sfida di oggi. Riprova più tardi.',
    easy: 'Facile',
    normal: 'Normale',
    hard: 'Difficile',
    won: 'ECCELLENTE!',
    won_msg: 'Hai trovato tutti i gruppi!',
    lost: 'GAME OVER',
    lost_msg: 'Buona fortuna per la prossima volta!',
    groups: 'I gruppi erano:'
  },
  pt: {
    description: 'Encontre {n} grupos de {n} palavras que tenham algo em comum.',
    helper: 'Selecione {n} palavras e pressione enviar',
    loading: 'Carregando...',
    error: 'Falha ao carregar o desafio de hoje. Por favor, tente novamente mais tarde.',
    easy: 'Fácil',
    normal: 'Normal',
    hard: 'Difícil',
    won: 'EXCELENTE!',
    won_msg: 'Você encontrou todos os grupos!',
    lost: 'FIM DE JOGO',
    lost_msg: 'Mais sorte da próxima vez!',
    groups: 'Os grupos eram:'
  },
  'pt-BR': {
    description: 'Encontre {n} grupos de {n} palavras que tenham algo em comum.',
    helper: 'Selecione {n} palavras e pressione enviar',
    loading: 'Carregando...',
    error: 'Falha ao carregar o desafio de hoje. Por favor, tente novamente mais tarde.',
    easy: 'Fácil',
    normal: 'Normal',
    hard: 'Difícil',
    won: 'EXCELENTE!',
    won_msg: 'Você encontrou todos os grupos!',
    lost: 'FIM DE JOGO',
    lost_msg: 'Mais sorte da próxima vez!',
    groups: 'Os grupos eram:'
  },
  'pt-PT': {
    description: 'Encontre {n} grupos de {n} palavras que tenham algo em comum.',
    helper: 'Selecione {n} palavras e pressione enviar',
    loading: 'Carregando...',
    error: 'Falha ao carregar o desafio de hoje. Por favor, tente novamente mais tarde.',
    easy: 'Fácil',
    normal: 'Normal',
    hard: 'Difícil',
    won: 'EXCELENTE!',
    won_msg: 'Encontrou todos os grupos!',
    lost: 'FIM DE JOGO',
    lost_msg: 'Mais sorte da próxima vez!',
    groups: 'Os grupos eram:'
  }
};

export default function ConnectionsPage() {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS] || TRANSLATIONS.en;

  const isGameComplete = useGameStore((state) => state.isGameComplete('connections', language));
  // Retrieve saved state to know if won/lost
  const savedState = useGameStore((state) => state.gameStates[language ? `connections-${language}` : 'connections']);
  
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
      <GameCompletedOverlay 
        isOpen={isGameComplete}
        variant={savedState?.gameState === 'lost' ? 'failure' : 'success'}
        title={savedState?.gameState === 'lost' ? t.lost : t.won}
        message={savedState?.gameState === 'lost' ? t.lost_msg : t.won_msg}
        solutionContent={
          <div className="flex flex-col gap-2 p-4 bg-white/5 rounded-xl border border-white/10 w-full max-w-sm">
             <div className="text-xs font-black uppercase tracking-widest text-text-muted text-center mb-2">{t.groups}</div>
             {gameData.groups.map((group, idx) => (
                <div key={idx} className={`p-3 rounded-lg flex flex-col items-center justify-center text-center`} style={{ backgroundColor: group.color || 'rgba(255,255,255,0.1)' }}>
                  <div className="font-bold text-bg-deep uppercase text-sm">{group.category}</div>
                  <div className="text-bg-deep/80 text-xs">{group.words.join(', ')}</div>
                </div>
             ))}
          </div>
        }
      />
      
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
