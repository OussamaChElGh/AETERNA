'use client';
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface PathSectionProps {
  nivel: number;
  title: string;
  description: string;
  completedArticles: number;
  totalArticles: number;
  color?: string;
}

const NIVEL_COLORS: Record<number, { from: string; via: string; to: string; dot: string; text: string }> = {
  1: { from: '#8B5CF6', via: '#7C3AED', to: '#A78BFA', dot: 'bg-violet-500', text: 'text-violet-300' },
  2: { from: '#3B82F6', via: '#06B6D4', to: '#22D3EE', dot: 'bg-cyan-500', text: 'text-cyan-300' },
  3: { from: '#F97316', via: '#F59E0B', to: '#EAB308', dot: 'bg-orange-500', text: 'text-orange-300' },
  4: { from: '#F43F5E', via: '#E11D48', to: '#FB7185', dot: 'bg-rose-500', text: 'text-rose-300' },
};

export function PathSection({ nivel, title, description, completedArticles, totalArticles }: PathSectionProps) {
  const colors = NIVEL_COLORS[nivel] || NIVEL_COLORS[1];
  const allDone = completedArticles >= totalArticles && totalArticles > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-2"
    >
      {/* Gradient border wrapper */}
      <div
        className="relative rounded-2xl p-[2px] bg-gradient-to-r bg-[length:200%] animate-gradient-shift shimmer-overlay"
        style={{
          backgroundImage: `linear-gradient(90deg, ${colors.from}, ${colors.via}, ${colors.to})`,
          backgroundSize: '200% 200%',
          animation: 'gradient-shift 4s ease infinite',
        }}
      >
        {/* Inner card */}
        <div className="relative rounded-2xl bg-brand-ink p-5">
          {/* Nivel badge */}
          <div className="flex items-center gap-3 mb-2">
            <div className="relative">
              <div className={cn("w-3 h-3 rounded-full", colors.dot)} />
              {allDone && (
                <div className={cn("absolute inset-0 rounded-full animate-ping opacity-75", colors.dot)} />
              )}
            </div>
            <span className={cn("text-[10px] font-mono font-black uppercase tracking-[0.3em]", colors.text)}>
              SECTION {nivel} · NIVEL {nivel}
            </span>
            <span className="text-[10px] font-mono font-bold text-brand-offwhite/30 ml-auto">
              {completedArticles}/{totalArticles}
            </span>
          </div>

          <h2 className="text-lg md:text-xl font-serif font-bold text-brand-offwhite mb-1">
            {title}
          </h2>
          <p className="text-xs text-brand-offwhite/50 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
