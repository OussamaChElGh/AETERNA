'use client';
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLevel } from '@/context/LevelContext';

export interface BotonTransicionProps {
  nivel: string;
  children: React.ReactNode;
}

export function BotonTransicion({ nivel, children }: BotonTransicionProps) {
  const { setActiveLevel } = useLevel();

  const handleTransition = () => {
    // We assume nivel in the button matches the level names or IDs.
    // E.g. "profundizacion".
    // ProgresionArticulo uses strings like "Profundización". NivelActivo normalizes it.
    // It's safest to just pass the raw nivel value.
    if (nivel.toLowerCase().includes("profundi")) {
      setActiveLevel("Profundización");
    } else if (nivel.toLowerCase().includes("frontera")) {
      setActiveLevel("Frontera");
    } else {
      setActiveLevel(nivel.charAt(0).toUpperCase() + nivel.slice(1));
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="my-16 text-center max-w-2xl mx-auto flex flex-col items-center gap-6">
      <div className="text-xl font-medium text-brand-charcoal md:text-2xl leading-relaxed">
        {children}
      </div>
      
      <Button 
        onClick={handleTransition} 
        size="lg"
        className="bg-brand-ink text-brand-offwhite hover:bg-brand-gold hover:text-brand-ink rounded-full px-8 py-6 text-lg font-bold shadow-lg shadow-brand-ink/10 transition-all group"
      >
        Continuar a {nivel.charAt(0).toUpperCase() + nivel.slice(1)}
        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
      </Button>
    </div>
  );
}
