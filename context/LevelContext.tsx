'use client';

import React, { createContext, useContext, useState } from 'react';

type LevelContextType = {
  activeLevel: string;
  setActiveLevel: (level: string) => void;
};

const LevelContext = createContext<LevelContextType | undefined>(undefined);

export function LevelProvider({ children }: { children: React.ReactNode }) {
  const [activeLevel, setActiveLevel] = useState<string>('Fundamentos');

  return (
    <LevelContext.Provider value={{ activeLevel, setActiveLevel }}>
      {children}
    </LevelContext.Provider>
  );
}

export function useLevel() {
  const context = useContext(LevelContext);
  if (!context) {
    return { activeLevel: 'Fundamentos', setActiveLevel: () => {} };
  }
  return context;
}
