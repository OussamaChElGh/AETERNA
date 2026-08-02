'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { X, Award, Lock } from 'lucide-react';
import relicsData from '@/data/relics.json';
import { useGamification } from '@/context/GamificationContext';
import { cn } from '@/lib/utils';
import fisicaCurriculum from '@/data/curriculum/fisica.json';

interface RelicWallProps {
  open: boolean;
  onClose: () => void;
}

interface RelicEntry {
  id: string;
  name: string;
  description?: string;
  icon: string | null;
  unlocksOn: { type: string; nivel?: number; article?: string; layer?: string };
  unlocked: boolean;
}

function RelicIcon({ src, name }: { src: string; name: string }) {
  const [error, setError] = useState(false);
  if (error || !src) {
    return <Award size={40} className="text-brand-gold" />;
  }
  return (
    <Image
      src={src}
      alt={name}
      width={56}
      height={56}
      className="object-contain"
      onError={() => setError(true)}
    />
  );
}

export function RelicWall({ open, onClose }: RelicWallProps) {
  const { progress } = useGamification();
  const relics = (relicsData.relics || []) as Omit<RelicEntry, 'unlocked'>[];
  const completedPaths = progress.completedPaths || [];
  const completedLayers = progress.completedLayers || {};

  // Mapa de artículos por nivel desde el curriculum de física
  const articlesByNivel: Record<number, string[]> = {};
  for (const a of (fisicaCurriculum as { articles?: { slug: string; nivel: number }[] }).articles || []) {
    if (!articlesByNivel[a.nivel]) articlesByNivel[a.nivel] = [];
    articlesByNivel[a.nivel].push(a.slug);
  }

  // Un nivel está completado si todos sus artículos están en completedPaths
  const nivelCompleted = (nivel: number): boolean => {
    const slugs = articlesByNivel[nivel] || [];
    if (slugs.length === 0) return false;
    return slugs.every(slug => completedPaths.includes(slug));
  };

  const posterEntries: RelicEntry[] = relics.map(r => {
    let unlocked = false;
    if (r.unlocksOn.type === 'nivel_completed') {
      unlocked = nivelCompleted(r.unlocksOn.nivel || 0);
    } else if (r.unlocksOn.type === 'layer_completed') {
      const layers = completedLayers[r.unlocksOn.article || ''] || [];
      unlocked = layers.includes(r.unlocksOn.layer || '');
    } else if (r.unlocksOn.type === 'article_completed') {
      unlocked = completedPaths.includes(r.unlocksOn.article || '');
    }
    return { ...r, unlocked };
  });

  const unlockedCount = posterEntries.filter(p => p.unlocked).length;

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
              {unlockedCount} de {posterEntries.length} desbloqueadas
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {posterEntries.map((poster) => (
                <div
                  key={poster.id}
                  title={poster.unlocked ? `${poster.name}: desbloqueada` : `Completa todos los artículos de este nivel para desbloquearla`}
                  className={cn(
                    "relative aspect-square rounded-2xl border flex flex-col items-center justify-center gap-2 p-3 text-center transition-all",
                    poster.unlocked
                      ? "border-brand-gold/50 bg-brand-gold/5 shadow-[0_0_30px_rgba(212,175,55,0.15)]"
                      : "border-white/5 bg-black/20"
                  )}
                >
                  {poster.unlocked ? (
                    <>
                      {poster.icon && <RelicIcon src={poster.icon} name={poster.name} />}
                      <span className="text-[10px] font-mono font-bold text-brand-gold leading-tight">{poster.name}</span>
                      <span className="text-[8px] font-mono text-brand-gold/50 leading-tight">
                        Nivel {poster.unlocksOn.nivel || '?'}
                      </span>
                    </>
                  ) : (
                    <>
                      <Lock size={22} className="text-brand-offwhite/20" />
                      <span className="text-[10px] font-mono text-brand-offwhite/30 leading-tight">{poster.name}</span>
                      <span className="text-[8px] font-mono text-brand-offwhite/20 leading-tight">
                        Nivel {poster.unlocksOn.nivel || '?'}
                      </span>
                    </>
                  )}
                </div>
              ))}
            </div>

            <p className="mt-6 text-[9px] font-mono text-brand-offwhite/40 text-center leading-relaxed">
              Cada reliquia se desbloquea al completar todos los artículos de su nivel.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
