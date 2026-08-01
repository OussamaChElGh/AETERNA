'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sigma, Copy, Check, Info, Sparkles, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import katex from 'katex';
import 'katex/dist/katex.min.css';

export interface VariableLegend {
  symbol: string;
  name: string;
  unit?: string;
  description?: string;
}

export interface AeternaFormulaProps {
  title?: string;
  formula?: string; // LaTeX equation string e.g. "\bar{x} = \frac{1}{N}\sum_{i=1}^{N} x_i"
  expression?: string;
  variables?: VariableLegend[] | string[];
  note?: string;
  badgeText?: string;
  category?: string;
}

export function AeternaFormula({
  title = 'Ecuación Fundamental',
  formula,
  expression,
  variables = [],
  note,
  badgeText = 'FÓRMULA CLAVE',
  category = 'FÍSICA & MATEMÁTICAS'
}: AeternaFormulaProps) {
  const [copied, setCopied] = useState(false);

  const rawFormula = formula || expression || '';

  // Render KaTeX HTML safely
  let renderedHtml = '';
  if (rawFormula) {
    try {
      renderedHtml = katex.renderToString(rawFormula, {
        displayMode: true,
        throwOnError: false
      });
    } catch (err) {
      renderedHtml = rawFormula;
    }
  }

  const handleCopy = () => {
    if (rawFormula) {
      navigator.clipboard.writeText(rawFormula);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Normalize variables into VariableLegend objects
  const parsedVariables: VariableLegend[] = (variables || []).map(v => {
    if (typeof v === 'string') {
      const parts = v.split(':');
      if (parts.length >= 2) {
        return {
          symbol: parts[0].trim(),
          name: parts[1].trim(),
          unit: parts[2] ? parts[2].trim() : undefined
        };
      }
      return { symbol: '•', name: v };
    }
    return v;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="my-10 rounded-none bg-[#FAF8F5] dark:bg-[#0D0B14] border-4 border-[#B8860B] dark:border-[#E6C200] p-6 md:p-8 shadow-[8px_8px_0px_0px_#8B6508] dark:shadow-[8px_8px_0px_0px_#E6C200] relative overflow-hidden"
    >
      {/* Subtle Math Grid Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#B8860B15_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      {/* Header Bar */}
      <div className="relative flex flex-wrap items-center justify-between gap-3 border-b-4 border-[#B8860B]/30 dark:border-[#E6C200]/30 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-none bg-[#B8860B] text-white dark:bg-[#E6C200] dark:text-black flex items-center justify-center border-2 border-black dark:border-white shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#FFF] shrink-0 font-mono font-bold">
            <Sigma size={22} />
          </div>
          <div>
            <span className="text-[10px] font-mono font-black uppercase tracking-[0.25em] text-[#8B6508] dark:text-[#E6C200] block">
              [{badgeText} // {category}]
            </span>
            <h3 className="font-mono text-xl md:text-2xl font-black uppercase text-brand-ink dark:text-white leading-tight">
              {title}
            </h3>
          </div>
        </div>

        {rawFormula && (
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 bg-white dark:bg-black text-[#8B6508] dark:text-[#E6C200] border-2 border-[#B8860B] dark:border-[#E6C200] font-mono text-xs font-bold uppercase tracking-wider hover:bg-amber-50 dark:hover:bg-amber-950/60 transition-colors shadow-[2px_2px_0px_0px_#8B6508] dark:shadow-[2px_2px_0px_0px_#E6C200] flex items-center gap-1.5"
          >
            {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
            {copied ? '¡Copiado!' : 'Copiar LaTeX'}
          </button>
        )}
      </div>

      {/* RENDERED KA-TEX FORMULA DISPLAY FRAME */}
      <div className="relative my-6 p-6 md:p-8 bg-white dark:bg-[#141020] border-3 border-[#B8860B]/60 dark:border-[#E6C200]/60 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] text-center overflow-x-auto flex items-center justify-center">
        {renderedHtml ? (
          <div
            className="text-xl md:text-2xl lg:text-3xl text-brand-ink dark:text-amber-100 font-serif leading-relaxed"
            dangerouslySetInnerHTML={{ __html: renderedHtml }}
          />
        ) : (
          <span className="font-mono text-base text-slate-500 italic">Sin expresión LaTeX disponible</span>
        )}
      </div>

      {/* VARIABLES LEGEND GRID */}
      {parsedVariables.length > 0 && (
        <div className="relative mt-6 pt-4 border-t-2 border-dashed border-[#B8860B]/30 dark:border-[#E6C200]/30">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#8B6508] dark:text-[#E6C200] block mb-3 flex items-center gap-1.5">
            <Sparkles size={14} /> Leyenda de Magnitudes y Unidades:
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {parsedVariables.map((v, idx) => (
              <div
                key={idx}
                className="p-3 bg-white/90 dark:bg-black/50 border-2 border-[#B8860B]/30 dark:border-[#E6C200]/30 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.08)] flex items-start gap-2.5 font-mono text-xs"
              >
                <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-950 text-[#8B6508] dark:text-[#E6C200] font-black border border-[#B8860B]/40 dark:border-[#E6C200]/40 shrink-0">
                  {v.symbol}
                </span>
                <div>
                  <span className="font-bold text-slate-900 dark:text-slate-100 block">{v.name}</span>
                  {v.unit && <span className="text-[11px] text-amber-700 dark:text-amber-300 font-semibold block">Unidad: {v.unit}</span>}
                  {v.description && <span className="text-[11px] text-slate-500 block">{v.description}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PEDAGOGICAL NOTE / WHEN TO USE */}
      {note && (
        <div className="relative mt-5 p-4 bg-amber-500/10 dark:bg-amber-400/10 border-l-4 border-[#B8860B] dark:border-[#E6C200] font-sans text-xs md:text-sm text-slate-800 dark:text-slate-200 flex items-start gap-3">
          <Info size={18} className="text-[#8B6508] dark:text-[#E6C200] shrink-0 mt-0.5" />
          <div>
            <span className="font-mono font-bold text-[#8B6508] dark:text-[#E6C200] uppercase block mb-0.5">
              💡 Cuándo aplicar esta fórmula:
            </span>
            <p className="leading-relaxed">{note}</p>
          </div>
        </div>
      )}
    </motion.div>
  );
}
