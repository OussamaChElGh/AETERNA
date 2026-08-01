'use client';
import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Gamepad2, Lightbulb, ShieldAlert, Cpu, XCircle, CheckCircle2 } from 'lucide-react';
import { PixelFrame } from '@/components/blocks/PixelFrame';

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

function CompactTag({ label, color, dark }: { label: string; color: string; dark: string }) {
  return (
    <span
      className="inline-block px-2 py-0.5 font-mono font-black text-[9px] uppercase tracking-[0.2em] text-white"
      style={{ background: color }}
    >
      {label}
    </span>
  );
}

export function AeternaEngagement({ type, title, content, extra }: EngagementBlockProps) {
  let canonicalType = type;
  if (type === 'did-you-know') canonicalType = 'archive-fragment';
  if (type === 'common-error') canonicalType = 'misconception';
  if (type === 'key-concept') canonicalType = 'key-insight';

  // 1. COMPACT MISCONCEPTION (ERROR COMÚN)
  if (canonicalType === 'misconception') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="my-6"
      >
        <PixelFrame accent="#F43F5E" bgClass="bg-[#FFF0F2] dark:bg-[#2A0E14]" dense>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-none bg-rose-600 border border-black flex items-center justify-center text-white shrink-0">
              <ShieldAlert size={13} />
            </div>
            <h4 className="font-mono text-xs font-black uppercase tracking-[0.15em] text-rose-700 dark:text-rose-300 leading-tight">
              {title}
            </h4>
          </div>
          <div className="flex items-start gap-2 font-mono text-[12px] leading-snug text-brand-ink dark:text-slate-200">
            <span className="text-rose-600 dark:text-rose-400 font-black shrink-0">✗</span>
            <p>{content}</p>
          </div>
          {extra && (
            <div className="mt-2 flex items-start gap-2 font-mono text-[12px] leading-snug text-brand-ink dark:text-emerald-200 border-t border-rose-600/20 pt-2">
              <span className="text-emerald-600 dark:text-emerald-400 font-black shrink-0">✓</span>
              <p>{extra}</p>
            </div>
          )}
        </PixelFrame>
      </motion.div>
    );
  }

  // 2. COMPACT KEY INSIGHT (LA CLAVE)
  if (canonicalType === 'key-insight') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="my-6"
      >
        <PixelFrame accent="#D4AF37" bgClass="bg-[#FFFDF0] dark:bg-[#241E10]" dense>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-none bg-[#D4AF37] border border-black flex items-center justify-center text-black shrink-0">
              <Lightbulb size={13} />
            </div>
            <h4 className="font-mono text-xs font-black uppercase tracking-[0.15em] text-[#8B6914] dark:text-brand-gold leading-tight">
              {title}
            </h4>
          </div>
          <p className="font-mono text-[12px] leading-snug text-brand-ink dark:text-slate-200">
            ▸ {content}
          </p>
          {extra && (
            <p className="mt-1.5 font-mono text-[11px] text-[#8B6914] dark:text-brand-gold">
              ▶ {extra}
            </p>
          )}
        </PixelFrame>
      </motion.div>
    );
  }

  // 3. COMPACT ARCHIVE / SYSTEM / GENERAL
  const isSystem = canonicalType === 'aeterna-system';
  const isArchive = canonicalType === 'archive-fragment';
  const Icon = isSystem ? Cpu : isArchive ? Sparkles : Gamepad2;
  const accent = isSystem ? '#A855F7' : '#22D3EE';
  const tagText = isSystem ? 'SISTEMA AETERNA' : isArchive ? 'FRAGMENTO' : 'BLOQUE';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="my-6"
    >
      <PixelFrame accent={accent} bgClass="bg-white dark:bg-[#141418]" dense>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-none flex items-center justify-center shrink-0 border border-black text-brand-ink dark:text-white" style={{ background: accent }}>
            <Icon size={13} className="text-black" />
          </div>
          <h4 className="font-mono text-xs font-black uppercase tracking-[0.15em] text-brand-ink dark:text-white leading-tight">
            {title}
          </h4>
          <CompactTag label={tagText} color={accent} dark={accent} />
        </div>
        <p className="font-mono text-[12px] leading-snug text-brand-ink dark:text-slate-200">
          {content}
        </p>
        {extra && (
          <p className="mt-1.5 font-mono text-[11px] text-brand-ink/60 dark:text-brand-muted">
            ▶ {extra}
          </p>
        )}
      </PixelFrame>
    </motion.div>
  );
}
