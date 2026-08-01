'use client';
import React from 'react';
import { motion } from 'motion/react';
import { Eye, AlertTriangle } from 'lucide-react';
import { PixelFrame } from '@/components/blocks/PixelFrame';

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
      className="my-6"
    >
      <PixelFrame accent="#FBBF24" bgClass="bg-[#FEFCE8] dark:bg-[#1E1B0E]" dense>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-none bg-amber-500 border border-black flex items-center justify-center text-black shrink-0">
            <Eye size={13} />
          </div>
          <h4 className="font-mono text-xs font-black uppercase tracking-[0.15em] text-amber-700 dark:text-amber-300 leading-tight">
            {title}
          </h4>
        </div>
        <p className="font-mono text-[12px] leading-snug text-brand-ink dark:text-slate-200">
          ▸ {assumption}
        </p>
        {implication && (
          <div className="mt-2 flex items-start gap-2 font-mono text-[12px] leading-snug text-brand-ink dark:text-amber-100 border-t border-amber-500/20 pt-2">
            <AlertTriangle size={13} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <p>{implication}</p>
          </div>
        )}
      </PixelFrame>
    </motion.div>
  );
}
