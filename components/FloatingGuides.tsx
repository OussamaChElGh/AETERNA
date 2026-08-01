'use client';
import { useState } from "react";
import Link from 'next/link';
import { motion, AnimatePresence } from "motion/react";
import { Sparkles } from "lucide-react";
import { CATEGORIES_DATA } from "@/data/categories";

const SUB_GUIDES = CATEGORIES_DATA.map(c => ({
  name: c.name,
  path: c.path,
  icon: c.icon,
  color: "bg-brand-ink"
}));

export function FloatingGuides() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="hidden md:flex fixed bottom-28 right-8 z-[100] flex-col items-end">
      <div className="relative mb-6">
        <AnimatePresence>
          {isOpen && (
            <div className="flex flex-col gap-4 items-end">
              {SUB_GUIDES.map((guide, i) => (
                <motion.div
                  key={guide.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ 
                    opacity: 1, 
                    x: 0, 
                    transition: {
                      delay: i * 0.05,
                    }
                  }}
                  exit={{ 
                    opacity: 0, 
                    x: 20,
                  }}
                  className="relative group flex items-center gap-4"
                >
                  <div className="px-3 py-1 bg-brand-ink text-brand-offwhite text-[9px] font-sans font-bold uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10 pointer-events-none">
                    {guide.name}
                  </div>
                  <Link href={guide.path}
                    className={`flex h-12 w-12 items-center justify-center ${guide.color} border border-white/20 text-brand-offwhite shadow-xl hover:bg-brand-gold hover:text-brand-ink transition-all duration-300`}
                  >
                    <guide.icon className="h-4 w-4 relative z-10" />
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="group relative flex h-16 w-16 items-center justify-center bg-brand-ink border border-white/20 shadow-2xl z-[110]"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
               key="close"
               initial={{ rotate: -90, opacity: 0 }}
               animate={{ rotate: 0, opacity: 1 }}
               exit={{ rotate: 90, opacity: 0 }}
               className="text-brand-offwhite font-light text-2xl"
            >
              ×
            </motion.div>
          ) : (
            <motion.div 
               key="open"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="flex flex-col items-center"
            >
              <Sparkles className="h-5 w-5 text-brand-gold mb-1" />
              <span className="text-[7px] font-sans font-bold uppercase tracking-[0.3em] text-brand-offwhite/50">Canon</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
