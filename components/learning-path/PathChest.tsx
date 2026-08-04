'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gift, Lock, Sparkles, Star } from 'lucide-react';
import confetti from 'canvas-confetti';
import { cn } from '@/lib/utils';
import { CurvedLine } from './CurvedLine';

interface PathChestProps {
  nivel: number;
  relicName: string;
  isUnlocked: boolean;
  relicImage?: string;
}

export function PathChest({ nivel, relicName, isUnlocked, relicImage }: PathChestProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShownConfetti, setHasShownConfetti] = useState(false);

  const handleClick = () => {
    if (!isUnlocked) return;
    setIsOpen(!isOpen);
    if (!hasShownConfetti) {
      setHasShownConfetti(true);
      setTimeout(() => {
        confetti({ particleCount: 150, spread: 100, origin: { x: 0.5, y: 0.45 }, colors: ['#D4AF37', '#FDE047', '#FFFFFF', '#F59E0B'], ticks: 200, gravity: 0.5, scalar: 1.3, shapes: ['star'] });
        setTimeout(() => {
          confetti({ particleCount: 60, spread: 70, origin: { x: 0.25, y: 0.5 }, colors: ['#D4AF37', '#FFFFFF'] });
          confetti({ particleCount: 60, spread: 70, origin: { x: 0.75, y: 0.5 }, colors: ['#FDE047', '#FFFFFF'] });
        }, 300);
      }, 200);
    }
  };

  const lineColor = isUnlocked ? '#F59E0B' : '#3F3F46';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative py-4"
    >
      {/* Top connector curve */}
      <div className="absolute -top-5 left-0 w-16 h-6">
        <CurvedLine fromY={0} toY={24} startX={28} color={lineColor} thickness={2} variant={isUnlocked ? 'glow' : 'solid'} />
      </div>

      <motion.div
        whileHover={isUnlocked ? { scale: 1.02 } : {}}
        onClick={handleClick}
        className={cn(
          "relative ml-3 p-[2px] rounded-2xl transition-all duration-500",
          isUnlocked ? "bg-gradient-to-r from-amber-600 via-amber-400 to-yellow-500 bg-[length:200%] animate-gradient-shift" : "bg-transparent"
        )}
      >
        <div className={cn("rounded-2xl p-4 transition-all", isUnlocked ? "bg-brand-ink shadow-[0_0_25px_rgba(245,158,11,0.15)] cursor-pointer" : "bg-neutral-800/20")}>
          <div className="flex items-center gap-3">
            <motion.div
              className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", isUnlocked ? "bg-amber-500/15" : "bg-neutral-700/20")}
              animate={isUnlocked ? { rotate: isOpen ? 0 : [0, -8, 8, -4, 4, 0] } : {}}
              transition={{ duration: 0.4, repeat: isOpen ? 0 : Infinity, repeatDelay: 4 }}
            >
              {isUnlocked ? (isOpen ? <Star size={22} className="text-amber-400" /> : <Gift size={22} className="text-amber-400" />) : <Lock size={16} className="text-neutral-500" />}
            </motion.div>
            <div className="flex-1 min-w-0">
              <span className={cn("text-[9px] font-mono font-black uppercase tracking-[0.3em]", isUnlocked ? "text-amber-400/80" : "text-neutral-500")}>{isUnlocked ? 'RELIQUIA OBTENIDA' : 'RELIQUIA BLOQUEADA'}</span>
              <h4 className={cn("font-serif text-sm leading-tight", isUnlocked ? "text-amber-300" : "text-neutral-500")}>{relicName}</h4>
            </div>
            {isUnlocked && <motion.div animate={{ rotate: isOpen ? 45 : 0 }}><Sparkles size={14} className="text-amber-400" /></motion.div>}
          </div>
          <AnimatePresence>
            {isOpen && isUnlocked && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="mt-3 pt-3 border-t border-amber-500/20 space-y-2">
                  {relicImage && <div className="w-full h-20 relative rounded-lg overflow-hidden bg-amber-500/5 border border-amber-500/10"><img src={relicImage} alt={relicName} className="w-full h-full object-contain p-2" /></div>}
                  <p className="text-xs text-brand-offwhite/60 leading-relaxed">Has desbloqueado esta reliquia completando el Nivel {nivel}. Se ha añadido a tu Muro de Reliquias.</p>
                  <div className="flex justify-center gap-6 py-1">
                    {[0, 45, -45].map((angle, i) => (<motion.div key={i} animate={{ rotate: [angle, angle + 360], scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 2 + i, repeat: Infinity, ease: 'linear' }}><Star size={16} className="text-amber-400/60" /></motion.div>))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
