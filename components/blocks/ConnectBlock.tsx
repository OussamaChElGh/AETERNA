'use client';
import React from 'react';
import { motion } from 'motion/react';
import { Network } from 'lucide-react';
import { PixelFrame } from '@/components/blocks/PixelFrame';

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
      className="my-6"
    >
      <PixelFrame accent="#818CF8" bgClass="bg-[#F5F3FF] dark:bg-[#141024]" dense>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-none bg-indigo-500 border border-black flex items-center justify-center text-black shrink-0">
            <Network size={13} />
          </div>
          <h4 className="font-mono text-xs font-black uppercase tracking-[0.15em] text-indigo-700 dark:text-indigo-300 leading-tight">
            {title}
          </h4>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap font-mono text-[10px] uppercase tracking-wider text-indigo-700 dark:text-indigo-300 mb-1.5">
          <span className="bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-400/40 px-1.5 py-0.5">{sourceConcept}</span>
          <span>→</span>
          <span className="bg-purple-50 dark:bg-purple-950/50 border border-purple-400/40 px-1.5 py-0.5 text-purple-700 dark:text-purple-300">{targetConcept}</span>
        </div>
        <p className="font-mono text-[12px] leading-snug text-brand-ink dark:text-slate-200">
          {content}
        </p>
      </PixelFrame>
    </motion.div>
  );
}
