import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface GameWrapperProps {
  children: ReactNode;
  title: string;
  gameId?: string; // e.g., "Wordle #123"
}

export function GameWrapper({ children, gameId }: GameWrapperProps) {
  return (
    <div className="relative min-h-screen flex flex-col bg-deep-radial overflow-x-hidden">
      <Header />
      
      {/* Spacer para el header fixed - Estandarizado */}
      <div className="h-24 md:h-32 lg:h-40" />

      {/* Game Content Container */}
      <main className="flex-1 w-full flex flex-col items-center">
        {gameId && (
          <div className="w-full text-center py-6 md:py-10 animate-in fade-in slide-in-from-top-4">
            <div className="inline-block text-[10px] md:text-xs font-black tracking-[0.3em] text-primary/60 uppercase bg-primary/5 px-6 py-2 rounded-full border border-primary/10">
              {gameId}
            </div>
          </div>
        )}
        
        <div className="flex-1 w-full max-w-7xl px-4 md:px-6 flex flex-col items-center">
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
}
