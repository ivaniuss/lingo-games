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
        <div className="flex-1 w-full max-w-7xl px-4 md:px-6 flex flex-col items-center">
          {children}
        </div>
        
        {/* MANDATORY SPACER TO GUARANTEE FOOTER SEPARATION */}
        <div className="h-10 md:h-16 w-full" aria-hidden="true" />
      </main>

      <Footer />
    </div>
  );
}
