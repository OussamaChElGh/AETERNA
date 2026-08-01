'use client';
import React from 'react';
import { motion } from 'motion/react';
import { Compass } from 'lucide-react';
import { PixelFrame } from '@/components/blocks/PixelFrame';

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
      className="my-6"
    >
      <PixelFrame accent="#34D399" bgClass="bg-[#ECFDF5] dark:bg-[#0B241B]" dense>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-none bg-emerald-500 border border-black flex items-center justify-center text-black shrink-0">
            <Compass size={13} />
          </div>
          <h4 className="font-mono text-xs font-black uppercase tracking-[0.15em] text-emerald-700 dark:text-emerald-300 leading-tight">
            {title}
          </h4>
          <span className="px-1.5 py-0.5 bg-emerald-500 text-black font-mono font-bold text-[9px] uppercase tracking-widest border border-black shrink-0">
            {targetDomain}
          </span>
        </div>
        <p className="font-mono text-[12px] leading-snug text-brand-ink dark:text-slate-200">
          ▶ {prompt}
        </p>
      </PixelFrame>
    </motion.div>
  );
}
