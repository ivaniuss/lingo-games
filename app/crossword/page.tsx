'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { RealCrossword } from '@/components/ui/RealCrossword';
import { useGameStore } from '@/store/useGameStore';
import { GameCompletedOverlay } from '@/components/ui/GameCompletedOverlay';
import { GameWrapper } from '@/components/layout/GameWrapper';

const TRANSLATIONS = {
  en: {
    title: 'Daily Crossword',
    description: 'Solve the crossword by guessing words from their categories.',
    helper: 'Click any cell to start',
    loading: 'Loading...',
    error: "Failed to load today's challenge. Please try again later."
  },
  es: {
    title: 'Crucigrama Diario',
    description: 'Resuelve el crucigrama adivinando palabras por su categoría.',
    helper: 'Haz clic en una casilla para empezar',
    loading: 'Cargando...',
    error: 'No se pudo cargar el reto de hoy. Por favor, inténtalo de nuevo más tarde.'
  },
  fr: {
    title: 'Mots Croisés Quotidiens',
    description: 'Résolvez les mots croisés en devinant les mots de leurs catégories.',
    helper: 'Cliquez sur une case pour commencer',
    loading: 'Chargement...',
    error: "Échec du chargement du défi d'aujourd'hui. Veuillez réessayer plus tard."
  },
  de: {
    title: 'Tägliches Kreuzworträtsel',
    description: 'Löse das Kreuzworträtsel, indem du Wörter aus ihren Kategorien errätst.',
    helper: 'Klicken Sie auf eine Zelle, um zu beginnen',
    loading: 'Laden...',
    error: 'Die heutige Herausforderung konnte nicht geladen werden. Bitte versuchen Sie es später erneut.'
  },
  it: {
    title: 'Cruciverba Quotidiano',
    description: 'Risolvi il cruciverba indovinando le parole dalle loro categorie.',
    helper: 'Clicca su una cella per iniziare',
    loading: 'Caricamento...',
    error: 'Impossibile caricare la sfida di oggi. Riprova più tardi.'
  },
  pt: {
    title: 'Palavras Cruzadas Diárias',
    description: 'Resolva as palavras cruzadas adivinhando palavras de suas categorias.',
    helper: 'Clique em uma célula para começar',
    loading: 'Carregando...',
    error: 'Falha ao carregar o desafio de hoje. Por favor, tente novamente mais tarde.'
  }
};

interface Clue {
  number: number;
  direction: 'across' | 'down';
  text: string;
  row: number;
  col: number;
  length: number;
  answer: string;
}

interface CrosswordData {
  grid: string[][];
  clues: Clue[];
  width: number;
  height: number;
  date: string;
  number: number;
}

export default function LingoGridPage() {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS] || TRANSLATIONS.en;
  
  const [data, setData] = useState<CrosswordData | null>(null);
  const [loading, setLoading] = useState(true);
  
  const isGameComplete = useGameStore((state) => state.isGameComplete);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function fetchGrid() {
      try {
        setLoading(true);
        const res = await fetch(`/api/crossword?lang=${language}`);
        
        if (!res.ok) {
          const text = await res.text();
          console.error(`API Error: ${res.status} ${res.statusText}`, text);
          throw new Error('Failed to fetch crossword data');
        }

        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error('Failed to fetch crossword:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchGrid();
  }, [language]);

  if (loading || !mounted) {
    return (
      <div className="min-h-screen bg-deep-radial flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <GameWrapper title={t.title} gameId={`LingoCrossword #${data.number}`}>
      {isGameComplete('grid') && <GameCompletedOverlay />}

      <div className="flex flex-col items-center justify-center flex-1 w-full">
        {/* Helper Text */}
        <p className="text-text-muted text-center text-base md:text-lg mb-8 max-w-xl animate-in fade-in slide-in-from-top-2">
          {t.description}
        </p>

        <RealCrossword 
          grid={data.grid}
          clues={data.clues}
          width={data.width}
          height={data.height}
        />
      </div>
    </GameWrapper>
  );
}
