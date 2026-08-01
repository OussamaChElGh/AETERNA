'use client';
import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Gamepad2, TrendingUp, Lightbulb, ShieldAlert, Cpu, XCircle, CheckCircle2 } from 'lucide-react';

export type EngagementType =
  | 'did-you-know' | 'archive-fragment'
  | 'common-error'  | 'misconception'
  | 'mini-challenge'
  | 'progress'
  | 'key-concept'    | 'key-insight'
  | 'aeterna-system';

interface EngagementBlockProps {
  type: EngagementType;
  title: string;
  content: string;
  extra?: string;
}

export function AeternaEngagement({ type, title, content, extra }: EngagementBlockProps) {
  let canonicalType = type;
  if (type === 'did-you-know') canonicalType = 'archive-fragment';
  if (type === 'common-error') canonicalType = 'misconception';
  if (type === 'key-concept') canonicalType = 'key-insight';

  // 1. PIXEL MISCONCEPTION (ERROR COMÚN) DUAL BOX
  if (canonicalType === 'misconception') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="my-10 rounded-none bg-[#FFF0F2] dark:bg-[#2A0E14] border-4 border-rose-600 dark:border-rose-500 p-6 md:p-8 shadow-[6px_6px_0px_0px_#991B1B] dark:shadow-[6px_6px_0px_0px_#F43F5E] relative space-y-5"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b-4 border-rose-600/30 dark:border-rose-500/30 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-none bg-white dark:bg-black border-2 border-rose-600 dark:border-rose-500 flex items-center justify-center text-rose-600 dark:text-rose-400 shadow-[2px_2px_0px_0px_#991B1B] dark:shadow-[2px_2px_0px_0px_#F43F5E] shrink-0">
              <ShieldAlert size={18} />
            </div>
            <div>
              <span className="text-[10px] font-mono font-black uppercase tracking-[0.25em] text-rose-700 dark:text-rose-300 block">
                [DISONANCIA COGNITIVA]
              </span>
              <h3 className="font-mono text-lg md:text-xl font-bold uppercase text-brand-ink dark:text-white leading-tight">
                {title}
              </h3>
            </div>
          </div>

          <span className="px-3 py-1 bg-rose-600 text-white font-mono font-bold text-[10px] uppercase tracking-widest border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_#000]">
            Error Común
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono">
          <div className="bg-white dark:bg-black p-4 border-2 border-rose-500/50 dark:border-rose-400/50 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.15)]">
            <span className="text-[9px] font-black uppercase tracking-wider flex items-center gap-1 text-rose-600 dark:text-rose-400 mb-1">
              <XCircle size={14} /> INTUICIÓN ERRÓNEA:
            </span>
            <p className="font-sans text-sm md:text-base text-brand-ink dark:text-slate-100 leading-relaxed">
              {content}
            </p>
          </div>

          {extra && (
            <div className="bg-emerald-50 dark:bg-emerald-950/50 p-4 border-2 border-emerald-500/50 dark:border-emerald-400/50 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.15)]">
              <span className="text-[9px] font-black uppercase tracking-wider flex items-center gap-1 text-emerald-700 dark:text-emerald-400 mb-1">
                <CheckCircle2 size={14} /> LA REALIDAD FÍSICA:
              </span>
              <p className="font-sans text-sm md:text-base text-brand-ink dark:text-slate-100 leading-relaxed">
                {extra}
              </p>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  // 2. PIXEL KEY INSIGHT (LA CLAVE EN 10S)
  if (canonicalType === 'key-insight') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="my-10 rounded-none bg-[#FFFDF0] dark:bg-[#241E10] border-4 border-[#D4AF37] p-6 md:p-8 shadow-[6px_6px_0px_0px_#8B6914] dark:shadow-[6px_6px_0px_0px_#D4AF37] relative space-y-5"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b-4 border-[#D4AF37]/40 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-none bg-white dark:bg-black border-2 border-[#D4AF37] flex items-center justify-center text-[#8B6914] dark:text-[#D4AF37] shadow-[2px_2px_0px_0px_#8B6914] shrink-0">
              <Lightbulb size={18} />
            </div>
            <div>
              <span className="text-[10px] font-mono font-black uppercase tracking-[0.25em] text-[#8B6914] dark:text-brand-gold block">
                [AXIOMA FUNDAMENTAL]
              </span>
              <h3 className="font-mono text-lg md:text-xl font-bold uppercase text-brand-ink dark:text-white leading-tight">
                {title}
              </h3>
            </div>
          </div>

          <span className="px-3 py-1 bg-[#D4AF37] text-black font-mono font-bold text-[10px] uppercase tracking-widest border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_#000]">
            La Clave en 10s
          </span>
        </div>

        <div className="bg-white dark:bg-black p-5 border-2 border-[#D4AF37]/60 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.15)] space-y-2">
          <p className="font-serif text-lg md:text-xl font-bold italic text-brand-ink dark:text-white leading-snug">
            "{content}"
          </p>
          {extra && (
            <p className="font-mono text-xs text-[#8B6914] dark:text-brand-gold">
              ▶ {extra}
            </p>
          )}
        </div>
      </motion.div>
    );
  }

  // 3. PIXEL ARCHIVE FRAGMENT / AETERNA SYSTEM / GENERAL PIXEL BLOCK
  const isSystem = canonicalType === 'aeterna-system';
  const isArchive = canonicalType === 'archive-fragment';
  const Icon = isSystem ? Cpu : isArchive ? Sparkles : Gamepad2;
  const borderColor = isSystem ? 'border-purple-600 dark:border-purple-400' : 'border-cyan-500 dark:border-cyan-400';
  const shadowColor = isSystem ? 'shadow-[6px_6px_0px_0px_#6B21A8] dark:shadow-[6px_6px_0px_0px_#A855F7]' : 'shadow-[6px_6px_0px_0px_#0891B2] dark:shadow-[6px_6px_0px_0px_#22D3EE]';
  const badgeBg = isSystem ? 'bg-purple-600' : 'bg-cyan-500';
  const tagText = isSystem ? 'Sistema Aeterna' : 'Fragmento de Archivo';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className={`my-10 rounded-none bg-white dark:bg-[#141418] border-4 ${borderColor} p-6 md:p-8 ${shadowColor} relative space-y-5`}
    >
      <div className={`flex flex-wrap items-center justify-between gap-3 border-b-4 ${borderColor}/30 pb-4`}>
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-none bg-white dark:bg-black border-2 ${borderColor} flex items-center justify-center text-brand-ink dark:text-white shadow-[2px_2px_0px_0px_#000] shrink-0`}>
            <Icon size={18} />
          </div>
          <div>
            <span className="text-[10px] font-mono font-black uppercase tracking-[0.25em] text-brand-ink/70 dark:text-brand-muted block">
              [{tagText.toUpperCase()}]
            </span>
            <h3 className="font-mono text-lg md:text-xl font-bold uppercase text-brand-ink dark:text-white leading-tight">
              {title}
            </h3>
          </div>
        </div>

        <span className={`px-3 py-1 ${badgeBg} text-black font-mono font-bold text-[10px] uppercase tracking-widest border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_#000]`}>
          {tagText}
        </span>
      </div>

      <div className="bg-[#FAF9F6] dark:bg-black p-4 border-2 border-black/20 dark:border-white/20 font-mono text-brand-ink dark:text-slate-100 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.15)]">
        <p className="font-sans text-base leading-relaxed">
          {content}
        </p>
        {extra && (
          <div className="mt-3 pt-2 border-t border-black/10 dark:border-white/10 text-xs font-mono text-brand-ink/70 dark:text-brand-muted">
            ▶ {extra}
          </div>
        )}
      </div>
    </motion.div>
  );
}
