'use client';
import React from 'react';
import { useLevel } from '@/context/LevelContext';
import { motion, AnimatePresence } from 'motion/react';

export interface NivelContenidoProps {
  principiante?: React.ReactNode;
  intermedio?: React.ReactNode;
  avanzado?: React.ReactNode;
}

export function NivelContenido({ principiante, intermedio, avanzado }: NivelContenidoProps) {
  const { activeLevel } = useLevel();
  
  const levelKey = activeLevel.toLowerCase();
  
  let content = null;
  if (levelKey === 'principiante' || levelKey === 'fundamentos' || levelKey === 'capa 1') content = principiante;
  if (levelKey === 'intermedio' || levelKey.includes('profundi') || levelKey === 'capa 2') content = intermedio;
  if (levelKey === 'avanzado' || levelKey === 'frontera' || levelKey === 'capa 3') content = avanzado;

  // Fallbacks if a level is missing text, we try to show something so the layout doesn't break
  if (!content) {
    if (intermedio) content = intermedio;
    else if (principiante) content = principiante;
    else if (avanzado) content = avanzado;
  }

  return (
    <div className="my-6 relative min-h-[100px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={levelKey}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="prose-target-animations"
        >
          {content}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
