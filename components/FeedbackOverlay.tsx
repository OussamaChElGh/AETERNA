'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useGamification } from '@/context/GamificationContext';

export function FeedbackOverlay() {
  const { feedbackEvent } = useGamification();

  useEffect(() => {
    if (!feedbackEvent) return;

    const { type, x, y } = feedbackEvent;
    const originX = x !== undefined ? x / window.innerWidth : 0.5;
    const originY = y !== undefined ? y / window.innerHeight : 0.6;
    const mood = type === 'correct' ? 'happy' : type === 'wrong' ? 'sad' : type === 'combo' ? 'happy' : 'celebrate';

    window.dispatchEvent(new CustomEvent('aeterna:mascot', { detail: { mood } }));

    if (type === 'correct') {
      confetti({
        particleCount: 24,
        spread: 60,
        startVelocity: 32,
        scalar: 0.8,
        ticks: 80,
        origin: { x: originX, y: originY },
        colors: ['#D4AF37', '#0EA5E9', '#22C55E', '#F59E0B'],
        disableForReducedMotion: true,
      });
    } else if (type === 'relic') {
      confetti({
        particleCount: 80,
        spread: 100,
        startVelocity: 45,
        scalar: 1.1,
        ticks: 120,
        origin: { x: originX, y: originY },
        colors: ['#D4AF37', '#FFFFFF', '#FDE68A'],
        disableForReducedMotion: true,
      });
    } else if (type === 'level_up') {
      confetti({
        particleCount: 120,
        spread: 120,
        startVelocity: 50,
        scalar: 1.2,
        ticks: 150,
        origin: { x: 0.5, y: 0.4 },
        colors: ['#D4AF37', '#FDE68A', '#22C55E', '#0EA5E9'],
        disableForReducedMotion: true,
      });
    }
  }, [feedbackEvent]);

  if (!feedbackEvent) return null;

  const isXp = feedbackEvent.type === 'correct' && (feedbackEvent.xp ?? 0) > 0;
  const isLevel = feedbackEvent.type === 'level_up';

  return (
    <AnimatePresence>
      {isXp && feedbackEvent.x && feedbackEvent.y && (
        <motion.div
          key={`xp-${feedbackEvent.id}`}
          initial={{
            opacity: 0,
            scale: 0.4,
            left: feedbackEvent.x,
            top: feedbackEvent.y,
          }}
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0.4, 1.15, 0.9, 0.7],
            left: [feedbackEvent.x, feedbackEvent.x + 60, window.innerWidth - 190],
            top: [feedbackEvent.y, feedbackEvent.y - 90, 28],
          }}
          exit={{ opacity: 0, scale: 0.7 }}
          transition={{ duration: 1.4, times: [0, 0.25, 0.75, 1], ease: 'easeInOut' }}
          className="fixed z-[9998] pointer-events-none flex items-center gap-1.5 px-3 py-1.5 bg-black text-[#D4AF37] dark:bg-white dark:text-black font-mono font-black text-sm uppercase tracking-widest border-2 border-black dark:border-white shadow-[3px_3px_0px_0px_#D4AF37]"
        >
          <Sparkles className="w-4 h-4" />
          +{feedbackEvent.xp} XP
        </motion.div>
      )}

      {isLevel && (
        <motion.div
          key={`level-${feedbackEvent.id}`}
          initial={{ opacity: 0, scale: 0.6, rotate: -4 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ type: 'spring', stiffness: 220, damping: 14 }}
          className="fixed top-32 left-1/2 -translate-x-1/2 z-[9997] bg-black text-[#D4AF37] dark:bg-[#D4AF37] dark:text-black border-2 border-black px-6 py-3 shadow-[5px_5px_0px_0px_#D4AF37] flex items-center gap-2"
        >
          <Sparkles className="w-5 h-5" />
          <span className="font-mono font-black text-sm uppercase tracking-[0.25em]">
            ¡Nivel {feedbackEvent.level}!
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
