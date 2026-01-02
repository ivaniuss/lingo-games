'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { GameWrapper } from '@/components/layout/GameWrapper';
import { ConnectionsGame } from '@/components/ui/ConnectionsGame';

const TRANSLATIONS = {
  en: {
    title: 'Form Groups of 4',
    description: 'Find four groups of four words that have something in common.',
    helper: 'Select 4 words and press submit',
    loading: 'Loading...',
    error: "Failed to load today's challenge. Please try again later."
  },
  es: {
    title: 'Forma Grupos de 4',
    description: 'Encuentra cuatro grupos de cuatro palabras que tengan algo en común.',
    helper: 'Selecciona 4 palabras y pulsa enviar',
    loading: 'Cargando...',
    error: 'No se pudo cargar el reto de hoy. Por favor, inténtalo de nuevo más tarde.'
  },
  fr: {
    title: 'Formez des groupes de 4',
    description: 'Trouvez quatre groupes de quatre mots qui ont quelque chose en commun.',
    helper: 'Sélectionnez 4 mots et appuyez sur envoyer',
    loading: 'Chargement...',
    error: "Échec du chargement du défi d'aujourd'hui. Veuillez réessayer plus tard."
  },
  de: {
    title: '4er-Gruppen bilden',
    description: 'Finde vier Gruppen von vier Wörtern, die etwas gemeinsam haben.',
    helper: 'Wähle 4 Wörter aus und drücke auf Senden',
    loading: 'Laden...',
    error: 'Die heutige Herausforderung konnte nicht geladen werden. Bitte versuchen Sie es später erneut.'
  },
  it: {
    title: 'Forma gruppi di 4',
    description: 'Trova quattro gruppi di quattro parole che hanno qualcosa in comune.',
    helper: 'Seleziona 4 parole e premi invia',
    loading: 'Caricamento...',
    error: 'Impossibile caricare la sfida di oggi. Riprova più tardi.'
  },
  pt: {
    title: 'Forme Grupos de 4',
    description: 'Encontre quatro grupos de quatro palavras que tenham algo em comum.',
    helper: 'Selecione 4 palavras e pressione enviar',
    loading: 'Carregando...',
    error: 'Falha ao carregar o desafio de hoje. Por favor, tente novamente mais tarde.'
  }
};

export default function ConnectionsPage() {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS] || TRANSLATIONS.en;

  const [gameData, setGameData] = useState<{ groups: any[], number: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/connections?lang=${language}`)
      .then(res => res.json())
      .then(data => {
        setGameData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching connections data:', err);
        setLoading(false);
      });
  }, [language]);

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

  return (
    <GameWrapper title="Connections" gameId={`Connections #${gameData.number}`}>
      <div className="flex flex-col items-center justify-center flex-1 w-full py-12">
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4">
          <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">{t.title}</h2>
          <p className="text-text-muted text-sm md:text-base max-w-md mx-auto">
            {t.description}
          </p>
        </div>

        <ConnectionsGame 
          groups={gameData.groups} 
        />
        
        <div className="mt-16 text-center text-[10px] md:text-xs font-black tracking-[0.3em] text-text-muted uppercase opacity-40">
          {t.helper}
        </div>
      </div>
    </GameWrapper>
  );
}
