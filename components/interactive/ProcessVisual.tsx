'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GitBranch, ChevronDown, ChevronUp, ListOrdered, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ProcessVisualProps {
  id?: string;
  title?: string;
  steps?: string[];
}

export function ProcessVisual({
  id,
  title = 'Proceso',
  steps = []
}: ProcessVisualProps) {
  const [openSteps, setOpenSteps] = useState<Record<number, boolean>>(() => {
    const s: Record<number, boolean> = {};
    steps.forEach((_, idx) => { s[idx] = idx === 0; });
    return s;
  });

  const toggleStep = (index: number) => {
    setOpenSteps(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const toggleAll = () => {
    const allOpen = steps.every((_, idx) => openSteps[idx]);
    const s: Record<number, boolean> = {};
    steps.forEach((_, idx) => { s[idx] = !allOpen; });
    setOpenSteps(s);
  };

  if (!steps || steps.length === 0) return null;

  const allOpen = steps.every((_, idx) => openSteps[idx]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      id={id}
      className="my-12 rounded-none bg-[#FAF8FF] dark:bg-[#0F0B1E] border-4 border-emerald-600 dark:border-emerald-400 p-5 md:p-8 shadow-[8px_8px_0px_0px_#059669] dark:shadow-[8px_8px_0px_0px_#34D399] relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none opacity-40" />

      <div className="relative flex items-center justify-between gap-4 border-b-4 border-emerald-600/30 dark:border-emerald-400/30 pb-5 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-none bg-emerald-600 text-white dark:bg-emerald-400 dark:text-black flex items-center justify-center border-2 border-black dark:border-white shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#FFF] shrink-0">
            <GitBranch size={20} />
          </div>
          <h3 className="font-mono text-xl md:text-2xl font-black uppercase text-brand-ink dark:text-white leading-tight">
            {title}
          </h3>
        </div>
        <button
          onClick={toggleAll}
          className="px-4 py-2 bg-emerald-600 text-white dark:bg-emerald-400 dark:text-black border-2 border-black dark:border-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-emerald-700 dark:hover:bg-emerald-300 transition-colors shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#FFF] flex items-center gap-2"
        >
          {allOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          {allOpen ? 'Plegar Todo' : 'Desplegar Todo'}
        </button>
      </div>

      <div className="relative space-y-4">
        {steps.map((step, index) => {
          const isOpen = !!openSteps[index];
          const isLast = index === steps.length - 1;

          return (
            <React.Fragment key={index}>
              <div
                className={cn(
                  'transition-all duration-200 border-3 overflow-hidden shadow-[5px_5px_0px_0px_rgba(0,0,0,0.15)]',
                  isOpen
                    ? 'bg-white dark:bg-[#18122B] border-emerald-600 dark:border-emerald-400 shadow-[6px_6px_0px_0px_#059669] dark:shadow-[6px_6px_0px_0px_#34D399]'
                    : 'bg-emerald-50/70 dark:bg-black/60 border-slate-300 dark:border-slate-800 hover:border-emerald-400'
                )}
              >
                <button
                  onClick={() => toggleStep(index)}
                  className="w-full p-4 md:p-5 flex items-center justify-between gap-4 text-left focus:outline-none transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        'px-2.5 py-0.5 font-mono text-xs font-black uppercase tracking-wider border-2 shadow-[2px_2px_0px_0px_#000]',
                        isOpen
                          ? 'bg-emerald-600 text-white dark:bg-emerald-400 dark:text-black border-black dark:border-white'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-400'
                      )}
                    >
                      Paso {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="font-mono text-sm md:text-base font-bold text-brand-ink dark:text-white leading-snug">
                      {step.replace(/^[🔭✂️📐🔬🔄*]+\s*/, '')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className={cn('w-7 h-7 rounded-none border-2 border-black dark:border-white flex items-center justify-center transition-transform duration-200', isOpen ? 'bg-emerald-600 text-white dark:bg-emerald-400 dark:text-black rotate-180' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200')}>
                      <ChevronDown size={16} />
                    </div>
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      className="border-t border-emerald-200 dark:border-emerald-900/60 p-5 md:p-6 bg-white/90 dark:bg-[#140F24]"
                    >
                      <p className="font-sans text-sm md:text-base text-slate-800 dark:text-slate-200 leading-relaxed">
                        {step}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {!isLast && (
                <div className="flex flex-col items-center justify-center py-0.5">
                  <motion.div
                    animate={{ y: [0, 2, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="w-7 h-7 rounded-none bg-emerald-600 text-white dark:bg-emerald-400 dark:text-black flex items-center justify-center border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFF] z-10"
                  >
                    <ArrowDown size={14} className="stroke-[3]" />
                  </motion.div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      <div className="relative mt-8 pt-4 border-t-2 border-dashed border-emerald-300 dark:border-emerald-800">
        <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
          <ListOrdered size={14} /> Total de pasos: {steps.length}
        </span>
      </div>
    </motion.div>
  );
}
