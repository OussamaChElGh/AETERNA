'use client';
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, X } from "lucide-react";
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const QUOTES = [
  "El conocimiento es poder. ¿Qué exploraremos hoy?",
  "La curiosidad es la brújula del alma.",
  "Cada lectura es un viaje a otra dimensión.",
  "Las constelaciones de ideas te esperan.",
  "La magia existe, se llama ciencia y filosofía."
];

const MOOD_QUOTES = {
  happy: ["¡Exacto, explorador!", "¡Brillante razonamiento!", "La física te sonríe.", "¡Cada acierto acerca a la maestría!"],
  sad: ["Casi… vuelve a intentarlo.", "Los grandes sabios también dudan.", "Analiza las premisas con calma."],
  celebrate: ["¡Un hallazgo digno de los antiguos!", "¡Tu gnosis asciende, maestro!", "¡Los astros celebran tu avance!"],
} as const;

type Mood = 'idle' | 'happy' | 'sad' | 'celebrate';

export function FloatingMascot() {
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipText, setTooltipText] = useState("");
  const [isHidden, setIsHidden] = useState(false);
  const [mood, setMood] = useState<Mood>('idle');
  const pathname = usePathname();

  useEffect(() => {
    let hideTimer: ReturnType<typeof setTimeout> | null = null;
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ mood: Mood }>).detail;
      if (!detail?.mood || detail.mood === 'idle') return;
      setMood(detail.mood);

      const pool = MOOD_QUOTES[detail.mood] || QUOTES;
      setTooltipText(pool[Math.floor(Math.random() * pool.length)]);
      setShowTooltip(true);

      if (hideTimer) clearTimeout(hideTimer);
      hideTimer = setTimeout(() => {
        setMood('idle');
        setShowTooltip(false);
      }, 2800);
    };
    window.addEventListener('aeterna:mascot', handler);
    return () => {
      window.removeEventListener('aeterna:mascot', handler);
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, []);

  useEffect(() => {
    setTooltipText(QUOTES[Math.floor(Math.random() * QUOTES.length)]);

    const timer = setTimeout(() => {
      if (!isHidden) setShowTooltip(true);
    }, 6000);

    const hideTimer = setTimeout(() => {
      setShowTooltip(false);
    }, 16000);

    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, [pathname, isHidden]);

  if (isHidden) return null;

  return (
    /* Full-width walk zone at the bottom of the screen */
    <div className="fixed bottom-3 left-0 right-0 z-50 pointer-events-none print:hidden">
      <motion.div
        className="relative w-max"
        initial={{ x: '-5vw' }}
        animate={{ x: ['-5vw', '92vw', '-5vw'] }}
        transition={{ duration: 42, ease: 'linear', repeat: Infinity }}
      >
        {/* Tooltip follows the mascot */}
        <AnimatePresence>
          {(isHovered || showTooltip) && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              className="absolute -top-40 left-1/2 -translate-x-1/2 w-max max-w-[220px] relative bg-brand-ink text-brand-offwhite p-4 rounded-2xl rounded-br-none shadow-[0_10px_30px_rgba(0,0,0,0.3)] border border-brand-gold/30 pointer-events-auto"
            >
              <p className="text-xs font-serif italic text-brand-offwhite/90 leading-relaxed">
                "{tooltipText}"
              </p>
              <button
                onClick={() => setIsHidden(true)}
                className="absolute -top-2 -right-2 bg-brand-ink border border-brand-border rounded-full p-1 text-brand-muted hover:text-white transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-brand-ink transform rotate-45 border-r border-b border-brand-gold/30"></div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mascot Circle */}
        <motion.div
          className="relative pointer-events-auto cursor-pointer group w-max"
          onMouseEnter={() => { setIsHovered(true); setShowTooltip(true); }}
          onMouseLeave={() => setIsHovered(false)}
          animate={
            mood === 'happy'
              ? { y: [0, -26, 0], scale: [1, 1.2, 1], rotate: [0, -8, 8, 0] }
              : mood === 'sad'
                ? { y: [0, 6, 0], scale: [1, 0.94, 1], rotate: [0, -12, 12, -8, 0] }
                : mood === 'celebrate'
                  ? { y: [0, -46, 0, -30, 0], scale: [1, 1.3, 1, 1.18, 1], rotate: [0, -10, 10, -6, 0] }
                  : { y: [0, -8, 0] }
          }
          transition={{
            duration: mood === 'idle' ? 2.2 : 1.1,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <div className={cn(
            "absolute -inset-1 blur-md rounded-full transition-opacity duration-500",
            mood === 'celebrate' ? "bg-brand-gold/70 opacity-100 animate-glow-pulse" : "bg-brand-gold/40 opacity-0 group-hover:opacity-100"
          )} />
          <div className={cn(
            "absolute -inset-2 blur-xl rounded-full transition-opacity duration-1000",
            mood === 'happy' ? "bg-brand-cosmic/50 opacity-100" : "bg-brand-cosmic/30 opacity-0 group-hover:opacity-100"
          )} />

          <div className={cn(
            "relative w-16 h-16 rounded-full border-2 border-brand-gold/40 flex items-center justify-center overflow-hidden bg-brand-ink shadow-[0_5px_15px_rgba(0,0,0,0.4)]",
            mood === 'sad' && "saturate-50 grayscale-[0.3]"
          )}>
            <img
              src="/mascot.png"
              alt="Mascota Anektia"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?q=80&w=200&auto=format&fit=crop";
              }}
            />
          </div>

          <div className={cn(
            "absolute -bottom-1 -right-1 w-6 h-6 bg-brand-ink text-brand-gold border border-brand-gold/40 rounded-full flex items-center justify-center shadow-lg",
            mood === 'celebrate' && "animate-bounce bg-brand-gold text-brand-ink"
          )}>
            <Sparkles className="w-3 h-3" />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
