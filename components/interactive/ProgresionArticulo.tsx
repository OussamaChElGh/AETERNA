'use client';
import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { useLevel } from '@/context/LevelContext';

export interface ProgresionArticuloProps {
  hitos?: string[];
  hitoInicial?: string;
}

export function ProgresionArticulo({ 
  hitos = ["Fundamentos", "Profundización", "Frontera"], 
  hitoInicial = "Fundamentos" 
}: ProgresionArticuloProps) {
  const { activeLevel, setActiveLevel } = useLevel();

  useEffect(() => {
    if (activeLevel === 'Intermedio' || !hitos.includes(activeLevel)) {
      setActiveLevel(hitoInicial);
    }
  }, [hitoInicial, activeLevel, setActiveLevel, hitos]);

  const setHito = (hito: string) => {
    setActiveLevel(hito);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const actualActive = hitos.includes(activeLevel) ? activeLevel : hitoInicial;

  return (
    <div className="w-full my-12 mb-[80px] no-print">
      <div className="bg-[#FAFAFA] border-y border-brand-ink/10 py-10 px-4 sm:px-12 relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between relative z-10 gap-8 sm:gap-0">
          
          {/* Progress Connecting Line */}
          <div className="hidden sm:block absolute left-12 right-12 top-[22px] h-[1px] bg-brand-ink/10 -translate-y-1/2 z-0" />
          <div 
            className="hidden sm:block absolute left-12 top-[22px] h-[1.5px] bg-[#816520] -translate-y-1/2 z-0 transition-all duration-700 ease-in-out"
            style={{ width: `calc(${hitos.indexOf(actualActive) * (100 / (hitos.length - 1))}% - 3rem)` }}
          />

          {hitos.map((hito, index) => {
            const isActive = actualActive === hito;
            const activeIndex = hitos.indexOf(actualActive);
            const isCompleted = index < activeIndex;
            const isPending = index > activeIndex;

            return (
              <button
                key={hito}
                onClick={() => setHito(hito)}
                className={cn(
                  "relative flex flex-col items-center group transition-all duration-300 w-full sm:w-auto",
                  isPending ? 'opacity-50 hover:opacity-100' : 'opacity-100'
                )}
              >
                {/* Visual Indicator Container */}
                <div className="relative mb-4 sm:mb-5 bg-[#FAFAFA] sm:px-4 flex items-center justify-center z-10">
                  {isCompleted ? (
                    <div className="w-10 h-10 rounded-full border border-[#816520] bg-white flex items-center justify-center text-[#816520] transition-colors group-hover:bg-[#816520]/5">
                      <Check className="w-4 h-4" />
                    </div>
                  ) : isActive ? (
                    <div className="relative flex items-center justify-center">
                      <div className="absolute inset-0 bg-[#816520] rounded-full blur-[6px] opacity-20 animate-pulse" />
                      <div className="w-10 h-10 rounded-full border-[1.5px] border-[#816520] bg-white flex items-center justify-center z-10">
                        <div className="w-3 h-3 rounded-full bg-[#816520]" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full border border-brand-ink/20 bg-white flex items-center justify-center transition-colors group-hover:border-[#816520]/40">
                      <div className="w-2 h-2 rounded-full bg-brand-ink/20 group-hover:bg-[#816520]/40 transition-colors" />
                    </div>
                  )}
                </div>

                {/* Text Label */}
                <div className={cn(
                  "text-center transition-colors duration-300",
                  isActive ? "text-[#816520]" : isCompleted ? "text-brand-ink/80" : "text-brand-ink/50"
                )}>
                  <span className="block text-[10px] sm:text-[11px] tracking-[0.2em] uppercase font-sans mb-1.5 opacity-70">
                    Capa {index + 1}
                  </span>
                  <span className="font-serif text-[1.125rem] sm:text-[1.25rem]">
                    {hito}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
