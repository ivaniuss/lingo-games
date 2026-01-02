'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { GameWrapper } from '@/components/layout/GameWrapper';
import { LingoGridGame } from '@/components/ui/LingoGridGame';

const TRANSLATIONS = {
  en: {
    title: 'Complete the Board',
    description: 'Find words that start with the indicated letter and belong to the category.',
    helper: 'Use the keyboard to complete each cell',
    loading: 'Loading...',
    error: "Failed to load today's challenge. Please try again later."
  },
  es: {
    title: 'Completa el Tablero',
    description: 'Encuentra palabras que empiecen por la letra indicada y pertenezcan a la categoría.',
    helper: 'Usa el teclado para completar cada celda',
    loading: 'Cargando...',
    error: 'No se pudo cargar el reto de hoy. Por favor, inténtalo de nuevo más tarde.'
  },
  fr: {
    title: 'Complétez le tableau',
    description: 'Trouvez des mots qui commencent par la lettre indiquée et appartiennent à la catégorie.',
    helper: 'Utilisez le clavier pour remplir chaque cellule',
    loading: 'Chargement...',
    error: "Échec du chargement du défi d'aujourd'hui. Veuillez réessayer plus tard."
  },
  de: {
    title: 'Vervollständige das Brett',
    description: 'Finde Wörter, die mit dem angegebenen Buchstaben beginnen und zur Kategorie gehören.',
    helper: 'Benutze die Tastatur, um jede Zelle auszufüllen',
    loading: 'Laden...',
    error: 'Die heutige Herausforderung konnte nicht geladen werden. Bitte versuchen Sie es später erneut.'
  },
  it: {
    title: 'Completa il tabellone',
    description: 'Trova parole che iniziano con la lettera indicata e appartengono alla categoria.',
    helper: 'Usa la tastiera per completare ogni cella',
    loading: 'Caricamento...',
    error: 'Impossibile caricare la sfida di oggi. Riprova più tardi.'
  },
  pt: {
    title: 'Complete o Tabuleiro',
    description: 'Encontre palavras que comecem com a letra indicada e pertençam à categoria.',
    helper: 'Use o teclado para completar cada célula',
    loading: 'Carregando...',
    error: 'Falha ao carregar o desafio de hoje. Por favor, tente novamente mais tarde.'
  }
};

export default function LingoGridPage() {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS] || TRANSLATIONS.en;

  const [gridData, setGridData] = useState<{ rows: string[], cols: string[], number: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/lingo-grid?lang=${language}`)
      .then(res => res.json())
      .then(data => {
        setGridData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching grid data:', err);
        setLoading(false);
      });
  }, [language]);

  if (loading) {
    return (
      <GameWrapper title="LingoGrid" gameId={t.loading}>
        <div className="flex-1 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        </div>
      </GameWrapper>
    );
  }

  if (!gridData) {
    return (
      <GameWrapper title="LingoGrid" gameId="Error">
        <div className="flex-1 flex items-center justify-center text-error font-bold">
          {t.error}
        </div>
      </GameWrapper>
    );
  }

  return (
    <GameWrapper title="LingoGrid" gameId={`LingoGrid #${gridData.number}`}>
      <div className="flex flex-col items-center justify-center flex-1 w-full py-12">
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4">
          <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">{t.title}</h2>
          <p className="text-text-muted text-sm md:text-base max-w-md mx-auto">
            {t.description}
          </p>
        </div>

        <LingoGridGame 
          rows={gridData.rows} 
          cols={gridData.cols} 
        />
        
        <div className="mt-16 text-center text-[10px] md:text-xs font-black tracking-[0.3em] text-text-muted uppercase opacity-40">
          {t.helper}
        </div>
      </div>
    </GameWrapper>
  );
}
