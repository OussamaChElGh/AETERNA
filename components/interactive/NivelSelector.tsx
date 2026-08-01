'use client';
import React, { useEffect } from 'react';
import { useLevel } from '@/context/LevelContext';

export interface NivelSelectorProps {
  niveles?: string[];
  nivelPorDefecto?: string;
}

export function NivelSelector({ 
  niveles = ['Principiante', 'Intermedio', 'Avanzado'], 
  nivelPorDefecto = 'Intermedio' 
}: NivelSelectorProps) {
  const { activeLevel, setActiveLevel } = useLevel();

  return (
    <div className="flex bg-white/5 border border-white/10 backdrop-blur-xl rounded-full p-1.5 my-16 max-w-lg mx-auto shadow-2xl relative z-10">
      {niveles.map(nivel => {
        const isActive = activeLevel.toLowerCase() === nivel.toLowerCase();
        return (
          <button
            key={nivel}
            onClick={() => setActiveLevel(nivel)}
            className={`flex-1 px-4 py-3 text-[10px] font-sans font-bold tracking-[0.2em] uppercase rounded-full transition-all duration-500 ${
              isActive 
                ? 'bg-[#D4AF37] text-black shadow-[0_0_20px_rgba(212,175,55,0.3)]' 
                : 'text-white/40 hover:text-white hover:bg-white/5'
            }`}
          >
            {nivel}
          </button>
        );
      })}
    </div>
  );
}
