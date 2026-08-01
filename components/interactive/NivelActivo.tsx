'use client';
import React from 'react';
import { useLevel } from '@/context/LevelContext';

export interface NivelActivoProps {
  id: string; // "fundamentos"
  children: React.ReactNode;
}

export function NivelActivo({ id, children }: NivelActivoProps) {
  const { activeLevel } = useLevel();
  
  // Normalized comparison
  const normalizedActive = activeLevel?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") || "";
  const normalizedId = id.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // Intermedio is the default uninitialized state of the context originally, 
  // but ProgresionArticulo forces it to hitoInicial
  if (normalizedActive !== normalizedId && normalizedActive !== "") {
    return null;
  }

  return (
    <section id={id} className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out fill-mode-both">
      {children}
    </section>
  );
}
