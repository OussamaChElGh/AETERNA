'use client';
import React from 'react';
import { motion } from 'motion/react';
import { Eye, AlertTriangle } from 'lucide-react';

interface HiddenAssumptionBlockProps {
  title?: string;
  assumption: string;
  implication?: string;
}

export function HiddenAssumptionBlock({
  title = 'Supuesto Oculto',
  assumption,
  implication
}: HiddenAssumptionBlockProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="my-10 rounded-none bg-[#FEFCE8] dark:bg-[#1E1B0E] border-4 border-amber-500 dark:border-amber-400 p-6 md:p-8 shadow-[6px_6px_0px_0px_#B45309] dark:shadow-[6px_6px_0px_0px_#FBBF24] relative space-y-5"
    >
      {/* Pixel Header Tag */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-4 border-amber-500/30 dark:border-amber-400/30 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-none bg-white dark:bg-black border-2 border-amber-500 dark:border-amber-400 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-[2px_2px_0px_0px_#B45309] dark:shadow-[2px_2px_0px_0px_#FBBF24] shrink-0">
            <Eye size={18} />
          </div>
          <div>
            <span className="text-[10px] font-mono font-black uppercase tracking-[0.25em] text-amber-700 dark:text-amber-300 block">
              [PREMISA IMPLÍCITA]
            </span>
            <h3 className="font-mono text-lg md:text-xl font-bold uppercase text-brand-ink dark:text-white leading-tight">
              {title}
            </h3>
          </div>
        </div>

        <span className="px-3 py-1 bg-amber-500 text-black font-mono font-bold text-[10px] uppercase tracking-widest border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_#000]">
          Límite de Modelo
        </span>
      </div>

      {/* Pixel Assumption Box */}
      <div className="space-y-3 font-mono">
        <div className="bg-white dark:bg-black p-4 border-2 border-amber-500/50 dark:border-amber-400/50 text-brand-ink dark:text-slate-100 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.15)]">
          <span className="text-[9px] font-black uppercase tracking-wider block text-amber-600 dark:text-amber-400 mb-1">
            ▶ SUPUESTO ASUMIDO:
          </span>
          <p className="font-bold font-sans text-base leading-relaxed">
            {assumption}
          </p>
        </div>

        {implication && (
          <div className="bg-amber-100/60 dark:bg-amber-950/60 p-4 border-2 border-amber-600/30 text-amber-900 dark:text-amber-200">
            <span className="text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 text-amber-700 dark:text-amber-300 mb-1">
              <AlertTriangle size={12} /> CONSECUENCIA PRÁCTICA:
            </span>
            <p className="font-sans text-sm italic leading-relaxed">
              {implication}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
