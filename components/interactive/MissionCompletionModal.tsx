'use client';
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Star, CheckCircle2, ChevronRight, X, BrainCircuit, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { formatXP } from '@/context/GamificationContext';

interface MissionCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  xp: number;
  precision: number;
  achievementTitle?: string;
  learnings: string[];
  nextMissionUrl?: string;
}

export function MissionCompletionModal({
  isOpen,
  onClose,
  xp,
  precision,
  achievementTitle,
  learnings,
  nextMissionUrl
}: MissionCompletionModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-brand-ink/80 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-lg bg-brand-offwhite border border-brand-border rounded-none overflow-hidden shadow-2xl p-12"
        >
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-brand-ink/40 hover:text-brand-ink transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="">
            {/* Header */}
            <div className="text-center mb-12">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center justify-center w-16 h-16 bg-brand-ink text-brand-offwhite mb-8 border border-white/20"
              >
                <Trophy className="w-6 h-6" />
              </motion.div>
              <h2 className="font-serif text-4xl text-brand-ink mb-4 tracking-tight">Consolidación de Gnosis</h2>
              <p className="text-brand-gold font-sans tracking-[0.4em] text-[10px] uppercase font-bold">Registro de Avance</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-px bg-brand-border border border-brand-border mb-12">
              <div className="bg-brand-offwhite p-8 flex flex-col items-center justify-center">
                <div className="flex items-center gap-3 mb-2">
                  <Star className="w-4 h-4 text-brand-gold" />
                  <span className="text-2xl font-bold font-serif text-brand-ink">+{formatXP(xp)} XP</span>
                </div>
                <span className="text-[9px] uppercase font-bold tracking-[0.3em] opacity-40">Intelecto</span>
              </div>
              <div className="bg-brand-offwhite p-8 flex flex-col items-center justify-center">
                <div className="flex items-center gap-3 mb-2">
                  <Zap className="w-4 h-4 text-brand-gold" />
                  <span className="text-2xl font-bold font-serif text-brand-ink">{precision}%</span>
                </div>
                <span className="text-[9px] uppercase font-bold tracking-[0.3em] opacity-40">Exégesis</span>
              </div>
            </div>

            {/* Achievement Card */}
            {achievementTitle && (
              <div className="mb-12 p-8 border border-brand-border bg-white flex items-center gap-6">
                <div className="w-12 h-12 shrink-0 bg-brand-ink text-brand-offwhite flex items-center justify-center">
                  <BrainCircuit className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[9px] uppercase font-bold tracking-[0.3em] text-brand-gold mb-1">Título Honorífico:</p>
                  <h4 className="font-serif text-xl text-brand-ink">{achievementTitle}</h4>
                </div>
              </div>
            )}

            {/* Learnings */}
            <div className="mb-12">
              <p className="text-[9px] uppercase font-bold tracking-[0.4em] text-brand-muted mb-6 border-b border-brand-border pb-2">Conceptos Integrados</p>
              <div className="space-y-4">
                {learnings.map((learning, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + (idx * 0.1) }}
                    className="flex items-start gap-4"
                  >
                    <CheckCircle2 className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                    <span className="text-brand-ink/70 text-sm leading-relaxed italic">{learning}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Action */}
            <button
              onClick={() => {
                if (nextMissionUrl) {
                  router.push(nextMissionUrl);
                } else {
                  onClose();
                }
              }}
              className="w-full py-5 bg-brand-ink text-brand-offwhite font-bold text-[10px] tracking-[0.4em] uppercase hover:bg-brand-gold transition-all flex items-center justify-center gap-4 group"
            >
              <span>Continuar hacia la siguiente tesis</span>
              <ChevronRight className="h-3 w-3 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
