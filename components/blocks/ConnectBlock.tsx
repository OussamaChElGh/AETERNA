'use client';
import React from 'react';
import { motion } from 'motion/react';
import { Network, ArrowRight } from 'lucide-react';

interface ConnectBlockProps {
  title?: string;
  content: string;
  sourceConcept?: string;
  targetConcept?: string;
}

export function ConnectBlock({
  title = 'Conecta',
  content,
  sourceConcept = 'Concepto Físico',
  targetConcept = 'Dominio Relacionado'
}: ConnectBlockProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="my-10 rounded-none bg-[#F5F3FF] dark:bg-[#141024] border-4 border-indigo-600 dark:border-indigo-400 p-6 md:p-8 shadow-[6px_6px_0px_0px_#4338CA] dark:shadow-[6px_6px_0px_0px_#818CF8] relative space-y-5"
    >
      {/* Pixel Header Tag */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-4 border-indigo-600/30 dark:border-indigo-400/30 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-none bg-white dark:bg-black border-2 border-indigo-600 dark:border-indigo-400 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-[2px_2px_0px_0px_#4338CA] dark:shadow-[2px_2px_0px_0px_#818CF8] shrink-0">
            <Network size={18} />
          </div>
          <div>
            <span className="text-[10px] font-mono font-black uppercase tracking-[0.25em] text-indigo-700 dark:text-indigo-300 block">
              [VÍNCULO CONCEPTUAL]
            </span>
            <h3 className="font-mono text-lg md:text-xl font-bold uppercase text-brand-ink dark:text-white leading-tight">
              {title}
            </h3>
          </div>
        </div>

        <span className="px-3 py-1 bg-indigo-600 text-white font-mono font-bold text-[10px] uppercase tracking-widest border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_#000]">
          Pixel Bridge
        </span>
      </div>

      {/* Dual Pixel Node Box */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white dark:bg-black p-4 border-2 border-indigo-600/40 dark:border-indigo-400/40 font-mono text-xs shadow-[3px_3px_0px_0px_rgba(0,0,0,0.15)]">
        <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-400/40 text-indigo-900 dark:text-indigo-200">
          <span className="text-[9px] font-black uppercase tracking-wider block text-indigo-600 dark:text-indigo-400 mb-1">▶ CONCEPTO A:</span>
          <span className="font-bold">{sourceConcept}</span>
        </div>

        <div className="p-2.5 bg-purple-50 dark:bg-purple-950/50 border border-purple-400/40 text-purple-900 dark:text-purple-200 flex items-center gap-2">
          <ArrowRight size={14} className="text-purple-600 dark:text-purple-400 shrink-0" />
          <div>
            <span className="text-[9px] font-black uppercase tracking-wider block text-purple-600 dark:text-purple-400 mb-1">▶ CONEXIÓN B:</span>
            <span className="font-bold">{targetConcept}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <p className="text-base md:text-lg text-brand-ink dark:text-slate-100 font-sans leading-relaxed">
        {content}
      </p>
    </motion.div>
  );
}
