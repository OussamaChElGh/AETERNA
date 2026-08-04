'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GitCommit, ArrowDown, ChevronDown, ChevronUp, Sparkles, Layers, ListOrdered, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FlowchartStep {
  id?: string | number;
  title: string;
  subtitle?: string;
  description?: string;
  items?: string[];
  type?: 'start' | 'process' | 'decision' | 'end';
}

export interface AnektiaFlowchartProps {
  title?: string;
  subtitle?: string;
  steps: FlowchartStep[];
  badgeText?: string;
  interactive?: boolean;
  defaultOpenAll?: boolean;
}

export function AnektiaFlowchart({
  title = 'Diagrama de Flujo del Proceso',
  subtitle = 'Explora el proceso desplegando cada paso en el acordeón interactivo',
  steps = [],
  badgeText = 'ACORDEÓN PEDAGÓGICO',
  interactive = true,
  defaultOpenAll = false
}: AnektiaFlowchartProps) {
  // Store expanded state per step index
  const [openSteps, setOpenSteps] = useState<Record<number, boolean>>(() => {
    const initialState: Record<number, boolean> = {};
    steps.forEach((_, idx) => {
      initialState[idx] = defaultOpenAll || idx === 0; // First step open by default
    });
    return initialState;
  });

  const toggleStep = (index: number) => {
    setOpenSteps(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const toggleAll = () => {
    const allAreOpen = steps.every((_, idx) => openSteps[idx]);
    const newState: Record<number, boolean> = {};
    steps.forEach((_, idx) => {
      newState[idx] = !allAreOpen;
    });
    setOpenSteps(newState);
  };

  if (!steps || steps.length === 0) return null;

  const allOpen = steps.every((_, idx) => openSteps[idx]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="my-12 rounded-none bg-[#FAF8FF] dark:bg-[#0F0B1E] border-4 border-indigo-600 dark:border-indigo-400 p-5 md:p-8 shadow-[8px_8px_0px_0px_#4338CA] dark:shadow-[8px_8px_0px_0px_#818CF8] relative overflow-hidden"
    >
      {/* Background Pixel Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none opacity-40" />

      {/* Top Header Tag */}
      <div className="relative flex flex-wrap items-center justify-between gap-4 border-b-4 border-indigo-600/30 dark:border-indigo-400/30 pb-5 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-none bg-indigo-600 text-white dark:bg-indigo-400 dark:text-black flex items-center justify-center border-2 border-black dark:border-white shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#FFF] shrink-0 font-mono font-bold">
            <ListOrdered size={20} />
          </div>
          <div>
            <span className="text-[10px] font-mono font-black uppercase tracking-[0.25em] text-indigo-700 dark:text-indigo-300 block">
              [{badgeText}]
            </span>
            <h3 className="font-mono text-xl md:text-2xl font-black uppercase text-brand-ink dark:text-white leading-tight">
              {title}
            </h3>
          </div>
        </div>

        {/* Accordion Toggle Control Button */}
        <button
          onClick={toggleAll}
          className="px-4 py-2 bg-indigo-600 text-white dark:bg-indigo-400 dark:text-black border-2 border-black dark:border-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-indigo-700 dark:hover:bg-indigo-300 transition-colors shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#FFF] flex items-center gap-2"
        >
          {allOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          {allOpen ? 'Plegar Acordeón' : 'Desplegar Acordeón'}
        </button>
      </div>

      {subtitle && (
        <p className="relative font-sans text-sm md:text-base text-slate-700 dark:text-slate-300 mb-8 max-w-3xl leading-relaxed">
          {subtitle}
        </p>
      )}

      {/* Accordion Flowchart Sequence */}
      <div className="relative space-y-4">
        {steps.map((step, index) => {
          const isOpen = !!openSteps[index];
          const isLast = index === steps.length - 1;

          return (
            <React.Fragment key={index}>
              {/* Accordion Step Item */}
              <div
                className={cn(
                  'transition-all duration-200 border-3 overflow-hidden shadow-[5px_5px_0px_0px_rgba(0,0,0,0.15)]',
                  isOpen
                    ? 'bg-white dark:bg-[#18122B] border-indigo-600 dark:border-indigo-400 shadow-[6px_6px_0px_0px_#4338CA] dark:shadow-[6px_6px_0px_0px_#818CF8]'
                    : 'bg-indigo-50/70 dark:bg-black/60 border-slate-300 dark:border-slate-800 hover:border-indigo-400'
                )}
              >
                {/* Accordion Header Click Bar */}
                <button
                  onClick={() => toggleStep(index)}
                  className="w-full p-4 md:p-5 flex items-center justify-between gap-4 text-left focus:outline-none transition-colors"
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={cn(
                        'px-2.5 py-0.5 font-mono text-xs font-black uppercase tracking-wider border-2 shadow-[2px_2px_0px_0px_#000]',
                        isOpen
                          ? 'bg-indigo-600 text-white dark:bg-indigo-400 dark:text-black border-black dark:border-white'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-400'
                      )}
                    >
                      Paso {String(index + 1).padStart(2, '0')}
                    </span>

                    <h4 className="font-mono text-base md:text-lg font-bold text-brand-ink dark:text-white leading-snug">
                      {step.title}
                    </h4>

                    {step.subtitle && (
                      <span className="font-mono text-xs text-indigo-700 dark:text-indigo-300 font-semibold hidden sm:inline-block">
                        — {step.subtitle}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-mono text-[11px] text-slate-500 hidden md:inline-block">
                      {isOpen ? 'Plegar' : 'Desplegar paso'}
                    </span>
                    <div className={cn('w-7 h-7 rounded-none border-2 border-black dark:border-white flex items-center justify-center transition-transform duration-200', isOpen ? 'bg-indigo-600 text-white dark:bg-indigo-400 dark:text-black rotate-180' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200')}>
                      <ChevronDown size={16} />
                    </div>
                  </div>
                </button>

                {/* Accordion Collapsible Content */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      className="border-t border-indigo-200 dark:border-indigo-900/60 p-5 md:p-6 bg-white/90 dark:bg-[#140F24]"
                    >
                      {step.description && (
                        <p className="font-sans text-sm md:text-base text-slate-800 dark:text-slate-200 leading-relaxed mb-4">
                          {step.description}
                        </p>
                      )}

                      {step.items && step.items.length > 0 && (
                        <div className="space-y-2 pt-2">
                          <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">
                            Detalles del paso:
                          </span>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-indigo-50/60 dark:bg-indigo-950/40 p-3.5 border border-indigo-300/40 dark:border-indigo-700/40">
                            {step.items.map((item, i) => (
                              <li key={i} className="flex items-start gap-2.5 font-mono text-xs md:text-sm text-slate-800 dark:text-slate-200">
                                <span className="text-indigo-600 dark:text-indigo-400 font-bold shrink-0">▶</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Animated Step Directional Connector Line */}
              {!isLast && (
                <div className="flex flex-col items-center justify-center py-0.5">
                  <motion.div
                    animate={{ y: [0, 2, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="w-7 h-7 rounded-none bg-indigo-600 text-white dark:bg-indigo-400 dark:text-black flex items-center justify-center border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFF] z-10"
                  >
                    <ArrowDown size={14} className="stroke-[3]" />
                  </motion.div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Footer Bar */}
      <div className="mt-8 pt-4 border-t-2 border-dashed border-indigo-300 dark:border-indigo-800 flex flex-wrap items-center justify-between text-xs font-mono text-slate-600 dark:text-slate-400">
        <span className="flex items-center gap-1.5 font-bold text-indigo-700 dark:text-indigo-300">
          <Layers size={14} /> Total de pasajes en acordeón: {steps.length}
        </span>
        <button
          onClick={toggleAll}
          className="text-indigo-600 dark:text-indigo-400 font-bold underline underline-offset-4 hover:text-indigo-800"
        >
          {allOpen ? 'Contraer todo el flujo' : 'Expandir todo el flujo'}
        </button>
      </div>
    </motion.div>
  );
}
