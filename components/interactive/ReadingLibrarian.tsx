'use client';
import React from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence, useMotionValueEvent } from 'motion/react';
import { BookOpen, User, Check, BookText } from 'lucide-react';
import { useGamification } from '@/context/GamificationContext';

import successGif from '@/assets/success.gif';

export const ReadingLibrarian = ({ articlePathId }: { articlePathId?: string }) => {
  const { scrollYProgress } = useScroll();
  const { addXP, completePath } = useGamification();
  
  // State for status
  const [isFinished, setIsFinished] = React.useState(false);
  const [imgLoaded, setImgLoaded] = React.useState(false);
  const [awarded, setAwarded] = React.useState(false);
  
  const progressPercent = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const [statusText, setStatusText] = React.useState("Listo para el saber");

  useMotionValueEvent(progressPercent, "change", (v) => {
    const p = Math.round(v);
    if (p >= 98) setStatusText("¡Misión Cumplida!");
    else if (p > 75) setStatusText("Casi terminamos");
    else if (p > 50) setStatusText("Buen progreso");
    else if (p > 25) setStatusText("Sigues leyendo");
    else setStatusText("Listo para el saber");
  });

useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest >= 0.98 && !isFinished) {
      setIsFinished(true);
      if (!awarded) {
        setAwarded(true);
        if (articlePathId) {
          completePath(articlePathId);
        }
      }
    }
    if (latest < 0.98 && isFinished) setIsFinished(false);
  });

  const floatY = useSpring(useTransform(scrollYProgress, [0, 1], [-10, 10]), { stiffness: 45, damping: 20 });

  return (
    <motion.div 
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5, duration: 1 }}
      className="fixed bottom-6 md:top-20 md:bottom-auto right-0 z-50 flex items-center no-print select-none pointer-events-none pr-4 md:pr-8"
    >
      {/* Container for the whole composition */}
      <div className="relative flex items-center">
        
        {/* Speech Bubble (To the left of the librarian) */}
        <motion.div 
          style={{ 
            opacity: useTransform(scrollYProgress, [0, 0.02], [0, 1]),
            x: useSpring(useTransform(scrollYProgress, [0, 1], [20, 0]), { stiffness: 100, damping: 30 })
          }}
          className="mr-[-15px] mb-[40px] z-10 pointer-events-auto"
        >
          <div className="bg-[#1a1a1a] text-white py-3 px-6 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-white/10 whitespace-nowrap tracking-wider flex items-center gap-2 relative">
            <span className="uppercase text-[10px] font-black">
              {statusText}
            </span>
            <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-4 h-4 bg-[#1a1a1a] rotate-45 border-r border-t border-white/10" />
          </div>
        </motion.div>

        {/* Librarian Avatar Area */}
        <motion.div 
          style={{ y: floatY }}
          className="relative w-[100px] h-[140px] md:w-[130px] md:h-[180px] pointer-events-auto group"
        >
          {/* Main Character Image (No clipping) */}
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-white border border-brand-border shadow-2xl rounded-none p-1 overflow-hidden">
            {!imgLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <BookText className="w-8 h-8 text-brand-blue animate-pulse opacity-20" />
              </div>
            )}
            <img 
              src={typeof successGif === 'object' && successGif !== null && 'src' in successGif ? (successGif as any).src : String(successGif)} 
              loading="eager"
              className={`w-full h-full object-cover grayscale transition-all duration-700 ${imgLoaded ? 'opacity-100' : 'opacity-0'} group-hover:grayscale-0 group-hover:scale-105`}
              onLoad={() => setImgLoaded(true)}
              alt="Bibliotecario"
            />
          </div>

          {/* Progress Ring Background (Positioned strategically) */}
          <div className="absolute right-[-10%] top-[-10%] z-30 bg-white">
            <svg className="w-14 h-14 -rotate-90">
              <circle
                cx="28"
                cy="28"
                r="24"
                className="stroke-brand-border fill-none"
                strokeWidth="1"
              />
              <motion.circle
                cx="28"
                cy="28"
                r="24"
                className="stroke-brand-blue fill-none"
                strokeWidth="3"
                strokeDasharray="150.8"
                style={{ 
                  pathLength: scrollYProgress,
                }}
                strokeLinecap="butt"
              />
            </svg>
            
            {/* Percentage Badge */}
            <motion.div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-ink text-brand-offwhite text-[9px] font-bold w-9 h-9 flex items-center justify-center border border-white"
            >
              <motion.span>{useTransform(progressPercent, v => `${Math.round(v)}%`)}</motion.span>
            </motion.div>
          </div>

          {/* Sparkles / Particles for when finished */}
          {isFinished && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 pointer-events-none z-30"
            >
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    y: [-20, -100], 
                    x: [0, (i % 2 === 0 ? 30 : -30)],
                    opacity: [0, 1, 0],
                    scale: [0, 1.2, 0]
                  }}
                  transition={{ 
                    duration: 2 + Math.random(), 
                    repeat: Infinity, 
                    delay: i * 0.3 
                  }}
                  className="absolute left-1/2 bottom-1/2 w-1.5 h-1.5 bg-brand-blue rounded-full"
                />
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

