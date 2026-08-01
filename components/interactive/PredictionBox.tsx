'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Eye, CheckCircle2, XCircle, Sparkles, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGamification } from '@/context/GamificationContext';

export interface PredictionOption {
  id?: string;
  label: string;
  isCorrect: boolean;
  feedback: string;
}

export interface PredictionBoxProps {
  id?: string;
  title?: string;
  badgeText?: string;
  question: string;
  options: PredictionOption[];
  explanation?: string;
  xp?: number;
  content?: string;
  className?: string;
}

export function PredictionBox({
  id,
  title = "Experimento de Predicción",
  badgeText = "PREDECIR ANTES DE OBSERVAR",
  question,
  options = [],
  explanation,
  xp = 50,
  content,
  className
}: PredictionBoxProps) {
  const { markQuestionAnswered, hasAnsweredQuestion } = useGamification();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  // If content prop is provided (e.g. from code block parsing), parse lines
  let parsedTitle = title;
  let parsedQuestion = question;
  let parsedExplanation = explanation || '';
  let parsedOptions = options;
  let parsedXp = xp;

  if (content && content.trim()) {
    const lines = content.split('\n');
    const opts: PredictionOption[] = [];
    let currentExplanation = '';

    lines.forEach(l => {
      const line = l.trim();
      if (line.startsWith('TITLE:')) parsedTitle = line.replace('TITLE:', '').trim();
      else if (line.startsWith('QUESTION:')) parsedQuestion = line.replace('QUESTION:', '').trim();
      else if (line.startsWith('XP:')) parsedXp = parseInt(line.replace('XP:', '').trim(), 10) || 50;
      else if (line.startsWith('EXPLANATION:')) currentExplanation = line.replace('EXPLANATION:', '').trim();
      else if (line.startsWith('OPTION_CORRECT:')) {
        const parts = line.replace('OPTION_CORRECT:', '').split('|');
        opts.push({ label: parts[0]?.trim() || '', isCorrect: true, feedback: parts[1]?.trim() || '¡Correcto!' });
      } else if (line.startsWith('OPTION_WRONG:')) {
        const parts = line.replace('OPTION_WRONG:', '').split('|');
        opts.push({ label: parts[0]?.trim() || '', isCorrect: false, feedback: parts[1]?.trim() || 'Incorrecto.' });
      }
    });

    if (opts.length > 0) parsedOptions = opts;
    if (currentExplanation) parsedExplanation = currentExplanation;
  }

  const boxId = id || btoa(encodeURIComponent((parsedTitle + parsedQuestion).substring(0, 40))).substring(0, 32);
  const isCompleted = hasAnsweredQuestion(boxId);

  const handleSelectPrediction = (index: number) => {
    if (isRevealed) return;
    setSelectedIndex(index);
  };

  const handleConfirmPrediction = () => {
    if (selectedIndex === null || isRevealed) return;
    setIsRevealed(true);
    const selected = parsedOptions[selectedIndex];
    if (selected && selected.isCorrect && !isCompleted) {
      markQuestionAnswered(boxId, parsedXp, `Predicción: ${parsedTitle}`);
    }
  };

  const handleReset = () => {
    setSelectedIndex(null);
    setIsRevealed(false);
  };

  const selectedOpt = selectedIndex !== null ? parsedOptions[selectedIndex] : null;

  return (
    <div className={cn("not-prose my-12 mx-auto max-w-4xl px-2 relative", className)}>
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="bg-[#FAF6EC] dark:bg-[#1A1712] border-2 border-[#D4AF37] p-4 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#D4AF37] relative space-y-4 overflow-hidden"
      >
        <div className="relative z-10 space-y-4">
        {/* HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#D4AF37]/40 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-none bg-cyan-500 border border-black flex items-center justify-center text-black shrink-0">
              <Eye size={14} />
            </div>
            <div>
              <span className="text-[8px] font-mono font-black uppercase tracking-[0.2em] text-cyan-700 dark:text-cyan-300 block">
                {badgeText.toUpperCase()}
              </span>
              <h3 className="font-mono text-sm md:text-base font-black uppercase text-brand-ink dark:text-white leading-tight">
                {parsedTitle}
              </h3>
            </div>
          </div>

          <span className="px-3 py-1 bg-black text-[#D4AF37] dark:bg-white dark:text-black font-mono font-bold text-[11px] uppercase tracking-widest border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_#D4AF37]">
            +{parsedXp} XP
          </span>
        </div>

        {/* QUESTION */}
        <div className="bg-white dark:bg-[#12100C] p-5 border-2 border-[#D4AF37]/60 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.15)] font-mono">
          <p className="font-sans text-base md:text-lg font-semibold text-brand-ink dark:text-amber-100 leading-relaxed">
            {parsedQuestion}
          </p>
        </div>

        {/* OPTIONS */}
        <div className="space-y-3 font-mono">
          {parsedOptions.map((opt, idx) => {
            const isSelected = selectedIndex === idx;
            let btnClass = "border-2 border-[#D4AF37]/50 bg-white dark:bg-[#12100C] text-brand-ink dark:text-amber-100 shadow-[3px_3px_0px_0px_#000] hover:bg-amber-100 dark:hover:bg-amber-950/60";

            if (isSelected) {
              btnClass = "border-2 border-black bg-[#D4AF37] text-black font-bold shadow-[4px_4px_0px_0px_#000]";
            }

            if (isRevealed) {
              if (opt.isCorrect) {
                btnClass = "border-2 border-black bg-emerald-500 text-black font-bold shadow-[4px_4px_0px_0px_#000]";
              } else if (isSelected && !opt.isCorrect) {
                btnClass = "border-2 border-black bg-rose-600 text-white font-bold shadow-[4px_4px_0px_0px_#000]";
              } else {
                btnClass = "opacity-40 border-2 border-black/20 dark:border-white/20 bg-gray-100 dark:bg-zinc-900";
              }
            }

            return (
              <button
                key={idx}
                disabled={isRevealed}
                onClick={() => handleSelectPrediction(idx)}
                className={cn(
                  "w-full text-left p-4 font-mono font-bold transition-all flex items-center justify-between gap-4 text-sm md:text-base",
                  btnClass
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 bg-black text-[#D4AF37] border border-[#D4AF37] flex items-center justify-center font-black text-xs shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{opt.label}</span>
                </div>

                {isRevealed && opt.isCorrect && (
                  <CheckCircle2 size={20} className="text-black shrink-0" />
                )}
                {isRevealed && isSelected && !opt.isCorrect && (
                  <XCircle size={20} className="text-white shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* ACTION BUTTON */}
        {!isRevealed ? (
          <button
            disabled={selectedIndex === null}
            onClick={handleConfirmPrediction}
            className={cn(
              "w-full py-4 px-6 font-mono font-black text-xs uppercase tracking-[0.2em] border-2 border-black transition-all shadow-[3px_3px_0px_0px_#000] flex items-center justify-center gap-2",
              selectedIndex !== null
                ? "bg-[#D4AF37] text-black hover:bg-yellow-400 cursor-pointer active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                : "bg-gray-300 text-gray-600 dark:bg-gray-800 dark:text-gray-500 border-gray-700 cursor-not-allowed"
            )}
          >
            <span>▶ OBSERVAR RESULTADO DEL EXPERIMENTO</span>
            <ArrowRight size={14} />
          </button>
        ) : (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-4 pt-2 font-mono"
          >
            {/* Feedback Box */}
            <div className={cn(
              "p-4 border-2 border-black shadow-[3px_3px_0px_0px_#000]",
              selectedOpt?.isCorrect
                ? "bg-emerald-500 text-black font-bold"
                : "bg-rose-600 text-white font-bold"
            )}>
              <div className="flex items-center gap-2 font-black mb-1 text-sm uppercase tracking-wider">
                {selectedOpt?.isCorrect ? <ShieldCheck size={18} /> : <XCircle size={18} />}
                <span>{selectedOpt?.isCorrect ? "¡PREDICCIÓN CORRECTA!" : "RESULTADO DIFERENTE A TU PREDICCIÓN"}</span>
              </div>
              <p className="text-xs md:text-sm font-sans">{selectedOpt?.feedback}</p>
            </div>

            {/* Explanation */}
            {parsedExplanation && (
              <div className="p-4 bg-white dark:bg-[#12100C] border-2 border-[#D4AF37]">
                <h4 className="text-xs font-mono font-black uppercase tracking-wider text-[#8B6914] dark:text-[#D4AF37] mb-2 flex items-center gap-1.5">
                  <Sparkles size={14} /> EXPLICACIÓN CIENTÍFICA
                </h4>
                <div className="text-sm font-sans text-brand-ink dark:text-amber-100 leading-relaxed">
                  {parsedExplanation}
                </div>
              </div>
            )}

            <button
              onClick={handleReset}
              className="text-xs font-mono font-bold flex items-center gap-1.5 text-[#8B6914] hover:text-black dark:text-[#D4AF37] dark:hover:text-white transition-colors mt-2"
            >
              <RefreshCw size={14} /> ↺ REINICIAR EXPERIMENTO
            </button>
          </motion.div>
        )}
        </div>
      </motion.div>
    </div>
  );
}
