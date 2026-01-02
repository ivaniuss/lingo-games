'use client';

import React, { useState, useRef } from 'react';

interface SoftKeyboardProps {
  onKey: (key: string) => void;
  showEnter?: boolean;
  className?: string;
  extraKeys?: string[]; // locale-specific characters like Ñ, Ç, Ä, etc.
  locale?: string; // e.g., 'es', 'fr', etc.
}

// Key with its variations for long press
interface KeyWithVariations {
  main: string;
  variations: string[];
}

const BASE_ROWS: string[][] = [
  ['Q','W','E','R','T','Y','U','I','O','P'],
  ['A','S','D','F','G','H','J','K','L'],
  ['Z','X','C','V','B','N','M']
];

function getLocalizedKeys(locale?: string): Record<string, string[]> {
  const variations: Record<string, string[]> = {};
  
  if (locale?.startsWith('es')) {
    variations['N'] = ['Ñ'];
    variations['?'] = ['¿'];
    variations['!'] = ['¡'];
  }
  
  if (locale?.startsWith('pt')) {
    variations['C'] = ['Ç'];
    variations['A'] = ['Ã', 'Á', 'Â', 'À'];
    variations['O'] = ['Õ', 'Ó', 'Ô', 'Ò'];
    variations['E'] = ['É', 'Ê', 'È'];
    variations['I'] = ['Í', 'Î', 'Ì'];
    variations['U'] = ['Ú', 'Û', 'Ù'];
    variations['?'] = ['¿'];
    variations['!'] = ['¡'];
  }
  
  if (locale?.startsWith('fr')) {
    variations['C'] = ['Ç'];
    variations['E'] = ['É', 'È', 'Ê', 'Ë'];
    variations['A'] = ['À', 'Â', 'Ä'];
    variations['O'] = ['Ô', 'Ö'];
    variations['U'] = ['Ù', 'Û', 'Ü'];
    variations['I'] = ['Î', 'Ï'];
  }
  
  if (locale?.startsWith('de')) {
    variations['A'] = ['Ä'];
    variations['O'] = ['Ö'];
    variations['U'] = ['Ü'];
    variations['S'] = ['ß'];
  }
  
  if (locale?.startsWith('it')) {
    variations['A'] = ['À'];
    variations['E'] = ['È', 'É'];
    variations['I'] = ['Ì', 'Í'];
    variations['O'] = ['Ò', 'Ó'];
    variations['U'] = ['Ù', 'Ú'];
  }
  
  return variations;
}

function getRows(locale?: string): KeyWithVariations[][] {
  const variations = getLocalizedKeys(locale);
  const rows = BASE_ROWS.map(r => 
    r.map(key => ({
      main: key,
      variations: variations[key] || []
    }))
  );
  
  return rows;
}

export function SoftKeyboard({ onKey, showEnter = true, className = '', extraKeys = [], locale }: SoftKeyboardProps) {
  const ROWS = getRows(locale);
  const [showVariations, setShowVariations] = useState<string | null>(null);
  const isLongPressRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const handleStart = (key: KeyWithVariations, e: React.MouseEvent | React.TouchEvent) => {
    // Prevent default on touch to avoid ghost clicks/scrolling the keyboard
    if (e.type === 'touchstart' && e.cancelable) {
      e.preventDefault();
    }
    
    isLongPressRef.current = false;
    if (key.variations.length > 0) {
      timeoutRef.current = setTimeout(() => {
        isLongPressRef.current = true;
        setShowVariations(key.main);
      }, 500);
    }
  };
  
  const handleEnd = (key: KeyWithVariations, e: React.MouseEvent | React.TouchEvent) => {
    if (e.type === 'touchend' && e.cancelable) {
      e.preventDefault();
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (!isLongPressRef.current) {
      // Short press: trigger key and close any open variations
      onKey(key.main);
      setShowVariations(null);
    }
    // If it was a long press, we leave the variations menu open
  };
  
  const handleVariationClick = (variation: string, e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    onKey(variation);
    setShowVariations(null);
  };
  
  return (
    <div className={`w-full max-w-xl mx-auto mt-4 select-none ${className}`}>
      {ROWS.map((row, idx) => (
        <div key={idx} className="flex justify-center gap-2 mb-2">
          {/* Row letters */}
          {row.map((keyObj) => (
            <div key={keyObj.main} className="relative">
              <button
                type="button"
                onMouseDown={(e) => handleStart(keyObj, e)}
                onMouseUp={(e) => handleEnd(keyObj, e)}
                onTouchStart={(e) => handleStart(keyObj, e)}
                onTouchEnd={(e) => handleEnd(keyObj, e)}
                className={`w-8 h-10 text-sm font-black uppercase rounded-md bg-white/10 text-white border border-white/10 relative cursor-pointer transition-all duration-200 hover:bg-white/20 hover:scale-110 active:scale-95 ${
                  showVariations === keyObj.main ? 'ring-2 ring-primary ring-offset-2 ring-offset-bg-deep' : ''
                }`}
              >
                {keyObj.main}
                {keyObj.variations.length > 0 && (
                  <span className="absolute -top-1 -right-1 text-xs text-primary">•</span>
                )}
              </button>
              
              {/* Variations popup */}
              {showVariations === keyObj.main && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 bg-bg-deep border border-white/20 rounded-md p-1 flex gap-1 shadow-lg z-10">
                  {keyObj.variations.map((variation) => (
                    <button
                      key={variation}
                      type="button"
                      onClick={(e) => handleVariationClick(variation, e)}
                      className="w-8 h-8 md:w-10 md:h-10 text-[10px] md:text-sm font-black rounded bg-white/10 text-white border border-white/10 hover:bg-white/20 hover:scale-110 active:scale-90 transition-all cursor-pointer"
                    >
                      {variation}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
          
          {/* Backspace on first row */}
          {idx === 0 && (
            <button
              type="button"
              aria-label="Backspace"
              onClick={() => onKey('Backspace')}
              className="w-12 h-10 text-sm font-black uppercase rounded-md bg-white/10 text-white border border-white/10 cursor-pointer transition-all hover:bg-white/20 hover:scale-110 active:scale-95"
            >
              ⌫
            </button>
          )}
          
          {/* Enter on last row */}
          {idx === 2 && showEnter && (
            <button
              type="button"
              onClick={() => onKey('Enter')}
              className="w-16 h-10 text-xs md:text-sm font-black uppercase rounded-md bg-primary text-bg-deep border border-primary/60 cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
            >
              Enter
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
