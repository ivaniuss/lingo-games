'use client';

import React, { useState, useCallback } from 'react';
import { Share2, Check, Copy } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface ShareResultsProps {
    gameType: 'wordle' | 'connections' | 'crossword';
    difficulty: 'easy' | 'normal' | 'hard';
    puzzleNumber: number;
    data: unknown; // Wordle: { guesses: string[], targetWord: string }, Connections: Group[], etc.
}

const TRANSLATIONS = {
    en: { share: 'Share Results', copied: 'Copied to clipboard!' },
    es: { share: 'Compartir Resultados', copied: '¡Copiado al portapapeles!' },
    fr: { share: 'Partager les résultats', copied: 'Copié dans le presse-papier !' },
    de: { share: 'Ergebnisse teilen', copied: 'In die Zwischenablage kopiert!' },
    it: { share: 'Condividi Risultati', copied: 'Copiato negli appunti!' },
    'pt-BR': { share: 'Compartilhar Resultados', copied: 'Copiado para a área de transferência!' },
    'pt-PT': { share: 'Partilhar Resultados', copied: 'Copiado para a área de transferência!' },
};

export function ShareResults({ gameType, difficulty, puzzleNumber, data }: ShareResultsProps) {
    const { language } = useLanguage();
    const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS] || TRANSLATIONS.en;
    const [copied, setCopied] = useState(false);

    const generateWordleGrid = useCallback(() => {
        const d = data as { guesses: string[], targetWord: string };
        const { guesses, targetWord } = d;
        const normalize = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
        const targetNormalized = normalize(targetWord);

        return guesses.map((guess: string) => {
            const guessNormalized = normalize(guess);
            let row = '';
            for (let i = 0; i < targetNormalized.length; i++) {
                if (guessNormalized[i] === targetNormalized[i]) {
                    row += '🟩';
                } else if (targetNormalized.includes(guessNormalized[i])) {
                    row += '🟨';
                } else {
                    row += '⬜';
                }
            }
            return row;
        }).join('\n');
    }, [data]);

    const generateConnectionsGrid = useCallback(() => {
        // Each group is a color
        const colors = {
            easy: '🟨',
            medium: '🟩',
            hard: '🟦',
            expert: '🟪'
        };
        // data is expected to be an array of objects with group color/level
        const groups = data as any[];
        return groups.map((group: any) => {
            const icon = group.color === 'blue' ? '🟦' : (group.color === 'green' ? '🟩' : (group.color === 'purple' ? '🟪' : '🟨'));
            return icon + icon + icon + icon;
        }).join('\n');
    }, [data]);

    const handleShare = async () => {
        let resultText = `LingoGames ${gameType.toUpperCase()} #${puzzleNumber} (${difficulty})\n`;

        if (gameType === 'wordle') {
            const d = data as { guesses: string[], maxGuesses: number };
            resultText += `${d.guesses.length}/${d.maxGuesses}\n\n`;
            resultText += generateWordleGrid();
        } else if (gameType === 'connections') {
            const d = data as any[];
            resultText += `Groups found: ${d.length}\n\n`;
            resultText += generateConnectionsGrid();
        } else if (gameType === 'crossword') {
            resultText += `Puzzled solved! 🧩\n`;
        }

        resultText += `\n\nPlay at: https://lingogames.app?lang=${language}`;

        try {
            if (navigator.share) {
                await navigator.share({
                    title: `LingoGames - ${gameType}`,
                    text: resultText,
                });
            } else {
                await navigator.clipboard.writeText(resultText);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            }
        } catch (err) {
            console.error('Share failed', err);
        }
    };

    return (
        <button
            onClick={handleShare}
            className="flex items-center justify-center gap-3 w-full py-4 px-6 bg-primary text-bg-deep rounded-2xl font-black uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/20"
        >
            {copied ? (
                <>
                    <Check className="w-5 h-5" />
                    <span>{t.copied}</span>
                </>
            ) : (
                <>
                    <Share2 className="w-5 h-5" />
                    <span>{t.share}</span>
                </>
            )}
        </button>
    );
}
