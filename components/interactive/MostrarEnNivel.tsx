'use client';
import React from 'react';
import { useLevel } from '@/context/LevelContext';

export interface MostrarEnNivelProps {
  niveles?: string[];
  nivel?: string;
  children: React.ReactNode;
}

export function MostrarEnNivel({ niveles, nivel, children }: MostrarEnNivelProps) {
  const { activeLevel } = useLevel();
  
  const normalizedActive = activeLevel?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") || "";
  
  const targetLevels = niveles || (nivel ? [nivel] : []);
  const normalizedTargets = targetLevels.map(n => n.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""));

  if (normalizedTargets.length > 0 && !normalizedTargets.includes(normalizedActive) && normalizedActive !== "") {
    return null;
  }

  return (
    <div className="animate-in fade-in duration-500 ease-out fill-mode-both">
      {children}
    </div>
  );
}
