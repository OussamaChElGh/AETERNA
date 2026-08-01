'use client';
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Eye, X } from "lucide-react";

const ETERNAL_INSIGHTS = [
  "El tiempo es una imagen móvil de la eternidad. — Platón",
  "La eternidad no es la duración infinita, sino la ausencia de tiempo.",
  "En cada instante nace un mundo nuevo, y en cada instante muere lo que ya no es necesario.",
  "El ahora es el único punto donde la eternidad toca el tiempo.",
  "Nada es permanente, excepto el cambio. Pero el cambio es eterno.",
  "La sabiduría es el recuerdo de lo que el alma ya sabía en la eternidad."
];

export function EternalObserver() {
  const [isOpen, setIsOpen] = useState(false);
  const [insight, setInsight] = useState("");

  const showInsight = () => {
    const random = ETERNAL_INSIGHTS[Math.floor(Math.random() * ETERNAL_INSIGHTS.length)];
    setInsight(random);
    setIsOpen(true);
  };

  return (
    <>
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1, rotate: 15 }}
        onClick={showInsight}
        className="fixed bottom-8 right-8 z-[100] w-14 h-14 bg-brand-ink text-brand-gold border border-brand-gold flex items-center justify-center shadow-2xl group"
      >
        <Eye className="w-6 h-6 transition-transform group-hover:scale-125" />
        <div className="absolute inset-0 bg-brand-gold/10 animate-pulse" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-8 bg-brand-ink/90 backdrop-blur-md"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-xl bg-white border border-brand-gold p-16 shadow-3xl text-center relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-engraving opacity-10" />
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-8 right-8 text-brand-muted hover:text-brand-ink transition-colors"
              >
                <X size={20} />
              </button>
              
              <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-brand-gold mb-12 block">
                Insight Eterno
              </span>
              
              <p className="font-serif text-3xl md:text-5xl leading-tight text-brand-ink italic mb-12">
                "{insight}"
              </p>
              
              <div className="w-24 h-px bg-brand-gold mx-auto opacity-30" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
