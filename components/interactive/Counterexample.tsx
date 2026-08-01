'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Target, CheckCircle2, XCircle, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGamification } from '@/context/GamificationContext';
import { useExerciseFeedback } from '@/lib/useExerciseFeedback';

export interface CandidateItem {
  id: string;
  label: string;
  isCounterexample: boolean;
  explanation: string;
}

export interface CounterexampleProps {
  id?: string;
  title?: string;
  badgeText?: string;
  generalStatement: string;
  candidates: CandidateItem[];
  xp?: number;
  content?: string;
  className?: string;
}

export function Counterexample({
  id,
  title = "Búsqueda de Contraejemplos y Casos Límite",
  badgeText = "PENSAMIENTO CRÍTICO Y CASOS LÍMITE",
  generalStatement,
  candidates = [],
  xp = 60,
  content,
  className
}: CounterexampleProps) {
  const { markQuestionAnswered, hasAnsweredQuestion } = useGamification();

  let parsedTitle = title;
  let parsedStatement = generalStatement || '';
  let parsedCandidates: CandidateItem[] = candidates;
  let parsedXp = xp;

  if (content && content.trim()) {
    const lines = content.split('\n');
    const candList: CandidateItem[] = [];

    lines.forEach(l => {
      const line = l.trim();
      if (line.startsWith('TITLE:')) parsedTitle = line.replace('TITLE:', '').trim();
      else if (line.startsWith('STATEMENT:')) parsedStatement = line.replace('STATEMENT:', '').trim();
      else if (line.startsWith('XP:')) parsedXp = parseInt(line.replace('XP:', '').trim(), 10) || 60;
      else if (line.startsWith('COUNTEREXAMPLE:')) {
        // Format: COUNTEREXAMPLE: id | label | explanation
        const parts = line.replace('COUNTEREXAMPLE:', '').split('|').map(s => s.trim());
        if (parts.length >= 2) {
          candList.push({ id: parts[0], label: parts[1], isCounterexample: true, explanation: parts[2] || '¡Contraejemplo válido!' });
        }
      } else if (line.startsWith('REGULAR_CASE:')) {
        // Format: REGULAR_CASE: id | label | explanation
        const parts = line.replace('REGULAR_CASE:', '').split('|').map(s => s.trim());
        if (parts.length >= 2) {
          candList.push({ id: parts[0], label: parts[1], isCounterexample: false, explanation: parts[2] || 'Este caso sí cumple la afirmación.' });
        }
      }
    });

    if (candList.length > 0) parsedCandidates = candList;
  }

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { feedbackRef, trigger, fxClass } = useExerciseFeedback();

  const ceId = id || btoa(encodeURIComponent((parsedTitle + parsedStatement).substring(0, 40))).substring(0, 32);
  const isCompleted = hasAnsweredQuestion(ceId);

  const handleSubmit = () => {
    if (selectedIndex === null || isSubmitted) return;
    setIsSubmitted(true);

    const selected = parsedCandidates[selectedIndex];
    if (selected && selected.isCounterexample && !isCompleted) {
      markQuestionAnswered(ceId, parsedXp, `Contraejemplo: ${parsedTitle}`);
      trigger('correct', ceId, parsedXp);
    } else {
      trigger('wrong', ceId);
    }
  };

  const handleReset = () => {
    setSelectedIndex(null);
    setIsSubmitted(false);
  };

  const selectedCandidate = selectedIndex !== null ? parsedCandidates[selectedIndex] : null;

  return (
    <div ref={feedbackRef} className={cn("not-prose my-12 mx-auto max-w-4xl px-2 relative", className)}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={cn("bg-[#FAF6EC] dark:bg-[#1A1712] border-4 border-[#D4AF37] p-6 md:p-8 shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#D4AF37] relative space-y-6", fxClass)}
      >
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b-4 border-[#D4AF37]/40 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-none bg-indigo-500 border-2 border-black flex items-center justify-center text-black shrink-0 shadow-[2px_2px_0px_0px_#000]">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-black uppercase tracking-[0.25em] text-indigo-700 dark:text-indigo-300 block">
                [{badgeText.toUpperCase()}]
              </span>
              <h3 className="font-mono text-lg md:text-xl font-bold uppercase text-brand-ink dark:text-white leading-tight">
                {parsedTitle}
              </h3>
            </div>
          </div>
          <span className="px-3 py-1 bg-black text-[#D4AF37] dark:bg-white dark:text-black font-mono font-bold text-[11px] uppercase tracking-widest border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_#D4AF37]">
            +{parsedXp} XP
          </span>
        </div>

        {/* General Statement to Disprove */}
        <div className="bg-white dark:bg-[#12100C] p-5 border-2 border-[#D4AF37]/60 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.15)] font-mono">
          <span className="text-[10px] font-mono font-black uppercase tracking-[0.25em] text-[#8B6914] dark:text-[#D4AF37] block mb-2">
            Afirmación General a Evaluar:
          </span>
          <p className="font-sans text-base md:text-lg font-bold text-brand-ink dark:text-amber-100">
            "{parsedStatement}"
          </p>
        </div>

        {/* Candidate List */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono font-black uppercase tracking-wider text-[#8B6914] dark:text-[#D4AF37]">
            Selecciona el caso que demuestra que la afirmación NO siempre se cumple:
          </h4>

          {parsedCandidates.map((cand, idx) => {
            const isSelected = selectedIndex === idx;
            let btnClass = "border-2 border-[#D4AF37]/50 bg-white dark:bg-[#12100C] text-brand-ink dark:text-amber-100 shadow-[3px_3px_0px_0px_#000] hover:bg-indigo-100 dark:hover:bg-indigo-950/60";

            if (isSelected) {
              btnClass = "border-2 border-black bg-[#D4AF37] text-black font-bold shadow-[4px_4px_0px_0px_#000]";
            }

            if (isSubmitted) {
              if (cand.isCounterexample) {
                btnClass = "border-2 border-black bg-emerald-500 text-black font-bold shadow-[4px_4px_0px_0px_#000]";
              } else if (isSelected && !cand.isCounterexample) {
                btnClass = "border-2 border-black bg-rose-600 text-white font-bold shadow-[4px_4px_0px_0px_#000]";
              } else {
                btnClass = "opacity-40 border-2 border-black/20 dark:border-white/20 bg-gray-100 dark:bg-zinc-900";
              }
            }

            return (
              <button
                key={cand.id || idx}
                disabled={isSubmitted}
                onClick={() => setSelectedIndex(idx)}
                className={cn(
                  "w-full text-left p-4 font-mono font-bold transition-all flex items-center justify-between gap-4 text-sm md:text-base",
                  btnClass
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 bg-black text-[#D4AF37] border border-[#D4AF37] flex items-center justify-center font-black text-xs shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{cand.label}</span>
                </div>

                {isSubmitted && cand.isCounterexample && <CheckCircle2 className="w-6 h-6 text-black shrink-0" />}
                {isSubmitted && isSelected && !cand.isCounterexample && <XCircle className="w-6 h-6 text-white shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Action Button & Feedback */}
        {!isSubmitted ? (
          <button
            disabled={selectedIndex === null}
            onClick={handleSubmit}
            className={cn(
              "w-full py-4 px-6 font-mono font-black text-xs uppercase tracking-[0.2em] border-2 border-black transition-all shadow-[3px_3px_0px_0px_#000] flex items-center justify-center gap-2",
              selectedIndex !== null
                ? "bg-[#D4AF37] text-black hover:bg-yellow-400 cursor-pointer active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                : "bg-gray-300 text-gray-600 dark:bg-gray-800 dark:text-gray-500 border-gray-700 cursor-not-allowed"
            )}
          >
            Confirmar Contraejemplo
          </button>
        ) : (
          <div className="space-y-4 pt-2 font-mono">
            <div className={cn(
              "p-4 border-2 border-black shadow-[3px_3px_0px_0px_#000]",
              selectedCandidate?.isCounterexample ? "bg-emerald-500 text-black font-bold" : "bg-rose-600 text-white font-bold"
            )}>
              <div className="flex items-center gap-2 font-black mb-1 text-sm uppercase tracking-wider">
                {selectedCandidate?.isCounterexample ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                <span>{selectedCandidate?.isCounterexample ? "¡CONTRAEJEMPLO VÁLIDO ENCONTRADO!" : "ESTE CASO SÍ CUMPLE LA AFIRMACIÓN GENERAL"}</span>
              </div>
              <p className="text-xs md:text-sm font-sans leading-relaxed">
                {selectedCandidate?.explanation}
              </p>
            </div>

            <button
              onClick={handleReset}
              className="text-xs font-mono font-bold flex items-center gap-1.5 text-[#8B6914] hover:text-black dark:text-[#D4AF37] dark:hover:text-white transition-colors mt-2"
            >
              <RefreshCw className="w-3.5 h-3.5" /> ↺ Volver a probar
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
