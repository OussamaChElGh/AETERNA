'use client';
import React from 'react';
import { motion } from 'motion/react';
import { Compass, Sparkles } from 'lucide-react';

interface TransferBlockProps {
  title?: string;
  targetDomain: string;
  prompt: string;
}

export function TransferBlock({
  title = 'Transfiere',
  targetDomain,
  prompt
}: TransferBlockProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="my-10 rounded-none bg-[#ECFDF5] dark:bg-[#0B241B] border-4 border-emerald-500 dark:border-emerald-400 p-6 md:p-8 shadow-[6px_6px_0px_0px_#047857] dark:shadow-[6px_6px_0px_0px_#34D399] relative space-y-5"
    >
      {/* Pixel Header Tag */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-4 border-emerald-500/30 dark:border-emerald-400/30 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-none bg-white dark:bg-black border-2 border-emerald-500 dark:border-emerald-400 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-[2px_2px_0px_0px_#047857] dark:shadow-[2px_2px_0px_0px_#34D399] shrink-0">
            <Compass size={18} />
          </div>
          <div>
            <span className="text-[10px] font-mono font-black uppercase tracking-[0.25em] text-emerald-700 dark:text-emerald-300 block">
              [SALTO DE CONTEXTO]
            </span>
            <h3 className="font-mono text-lg md:text-xl font-bold uppercase text-brand-ink dark:text-white leading-tight">
              {title}
            </h3>
          </div>
        </div>

        <span className="px-3 py-1 bg-emerald-500 text-black font-mono font-bold text-[10px] uppercase tracking-widest border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_#000] flex items-center gap-1">
          <Sparkles size={11} /> {targetDomain}
        </span>
      </div>

      {/* Pixel Prompt Box */}
      <div className="bg-white dark:bg-black p-4 border-2 border-emerald-500/50 dark:border-emerald-400/50 text-brand-ink dark:text-slate-100 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.15)] font-mono">
        <span className="text-[9px] font-black uppercase tracking-wider block text-emerald-600 dark:text-emerald-400 mb-1">
          ▶ DESAFÍO DE TRANSFERENCIA:
        </span>
        <p className="font-sans text-base leading-relaxed font-normal">
          {prompt}
        </p>
      </div>
    </motion.div>
  );
}
