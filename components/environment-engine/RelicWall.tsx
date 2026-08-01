'use client';
import React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { X, Award, Lock } from 'lucide-react';
import relicsData from '@/data/relics.json';
import { useGamification } from '@/context/GamificationContext';
import { cn } from '@/lib/utils';

interface RelicWallProps {
  open: boolean;
  onClose: () => void;
}

export function RelicWall({ open, onClose }: RelicWallProps) {
  const { progress } = useGamification();
  const relics = relicsData.relics || [];
  const completedLayers = progress.completedLayers || {};

  const unlockedLayerKeys = new Set<string>();
  for (const [article, layers] of Object.entries(completedLayers)) {
    for (const layer of layers) unlockedLayerKeys.add(`${article}|${layer}`);
  }

  const posterEntries = relics.map(r => ({
    ...r,
    unlocked: unlockedLayerKeys.has(`${r.unlocksOn.article}|${r.unlocksOn.layer}`),
  }));

  const completedLayerTotal = Object.values(completedLayers).reduce((s, arr) => s + (Array.isArray(arr) ? arr.length : 0), 0);
  const unlockedCount = posterEntries.filter(p => p.unlocked).length;

  // Rellena la grilla con recuadros vacíos reales para que el contador
  // corresponda a lo que se ve en pantalla.
  const MIN_SLOTS = 6;
  const emptySlots = Math.max(0, MIN_SLOTS - posterEntries.length);
  const slots = [...posterEntries, ...Array.from({ length: emptySlots }, (_, i) => ({ id: `empty-${i}`, name: 'Reliquia por descubrir', unlocked: false, unlocksOn: { article: '', layer: '' }, icon: null as string | null }))];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          onPointerDown={(e) => e.stopPropagation()}
          className="absolute inset-0 z-[80] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.92, y: 16 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.92, y: 16 }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl bg-brand-ink border-2 border-brand-gold/40 rounded-3xl shadow-[0_0_80px_rgba(212,175,55,0.2)] p-8"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 rounded-full border border-brand-gold/30 flex items-center justify-center text-brand-gold hover:bg-brand-gold hover:text-brand-ink transition-all"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-2">
              <Award size={20} className="text-brand-gold" />
              <h3 className="font-serif text-3xl text-brand-offwhite">Muro de Reliquias</h3>
            </div>
            <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-brand-gold mb-6">
              {unlockedCount} de {posterEntries.length} desbloqueadas {emptySlots > 0 && `· ${emptySlots} recuadros vacíos`}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {slots.map((poster) => (
                <div
                  key={poster.id}
                  title={poster.unlocked ? `${poster.name}: desbloqueada en ${poster.unlocksOn.article} (${poster.unlocksOn.layer})` : 'Bloqueada'}
                  className={cn(
                    "relative aspect-square rounded-2xl border flex flex-col items-center justify-center gap-2 p-3 text-center transition-all",
                    poster.unlocked
                      ? "border-brand-gold/50 bg-brand-gold/5 shadow-[0_0_30px_rgba(212,175,55,0.15)]"
                      : "border-white/5 bg-black/20"
                  )}
                >
                  {poster.unlocked ? (
                    <>
                      {poster.icon && (
                        <Image src={poster.icon} alt={poster.name} width={56} height={56} className="object-contain" />
                      )}
                      <span className="text-[10px] font-mono font-bold text-brand-gold leading-tight">{poster.name}</span>
                    </>
                  ) : (
                    <>
                      <Lock size={22} className="text-brand-offwhite/20" />
                      <span className="text-[10px] font-mono text-brand-offwhite/30 leading-tight">{poster.name}</span>
                    </>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
