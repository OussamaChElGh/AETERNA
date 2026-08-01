'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CheckSquare, CheckCircle2, XCircle, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGamification } from '@/context/GamificationContext';
import { useExerciseFeedback } from '@/lib/useExerciseFeedback';

export interface EvaluationCriterion {
  id: string;
  label: string;
  isCorrectProblem: boolean;
  feedback: string;
}

export interface ArgumentEvaluationProps {
  id?: string;
  title?: string;
  badgeText?: string;
  argumentText: string;
  criteria: EvaluationCriterion[];
  xp?: number;
  content?: string;
  className?: string;
}

export function ArgumentEvaluation({
  id,
  title = "Evaluación Crítica de Argumentos",
  badgeText = "EVALUAR VALIDEZ Y PREMISAS DE UN ARGUMENTO",
  argumentText,
  criteria = [],
  xp = 60,
  content,
  className
}: ArgumentEvaluationProps) {
  const { markQuestionAnswered, hasAnsweredQuestion } = useGamification();
  const { feedbackRef, trigger, fxClass } = useExerciseFeedback();

  let parsedTitle = title;
  let parsedArgument = argumentText || '';
  let parsedCriteria: EvaluationCriterion[] = criteria;
  let parsedXp = xp;

  if (content && content.trim()) {
    const lines = content.split('\n');
    const critList: EvaluationCriterion[] = [];

    lines.forEach(l => {
      const line = l.trim();
      if (line.startsWith('TITLE:')) parsedTitle = line.replace('TITLE:', '').trim();
      else if (line.startsWith('ARGUMENT:')) parsedArgument = line.replace('ARGUMENT:', '').trim();
      else if (line.startsWith('XP:')) parsedXp = parseInt(line.replace('XP:', '').trim(), 10) || 60;
      else if (line.startsWith('CRITERION_CORRECT:')) {
        // Format: CRITERION_CORRECT: id | label | feedback
        const parts = line.replace('CRITERION_CORRECT:', '').split('|').map(s => s.trim());
        if (parts.length >= 2) {
          critList.push({ id: parts[0], label: parts[1], isCorrectProblem: true, feedback: parts[2] || '¡Evaluación certera del argumento!' });
        }
      } else if (line.startsWith('CRITERION_WRONG:')) {
        // Format: CRITERION_WRONG: id | label | feedback
        const parts = line.replace('CRITERION_WRONG:', '').split('|').map(s => s.trim());
        if (parts.length >= 2) {
          critList.push({ id: parts[0], label: parts[1], isCorrectProblem: false, feedback: parts[2] || 'Este no es el fallo del argumento.' });
        }
      }
    });

    if (critList.length > 0) parsedCriteria = critList;
  }

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const evalId = id || btoa(encodeURIComponent((parsedTitle + parsedArgument).substring(0, 40))).substring(0, 32);
  const isCompleted = hasAnsweredQuestion(evalId);

  const handleSubmit = () => {
    if (selectedIndex === null || isSubmitted) return;
    setIsSubmitted(true);

    const selected = parsedCriteria[selectedIndex];
    if (selected && selected.isCorrectProblem && !isCompleted) {
      markQuestionAnswered(evalId, parsedXp, `Evaluación Argumento: ${parsedTitle}`);
    }
    if (selected && selected.isCorrectProblem) {
      trigger('correct', evalId, parsedXp);
    } else {
      trigger('wrong', evalId);
    }
  };

  const handleReset = () => {
    setSelectedIndex(null);
    setIsSubmitted(false);
  };

  const selectedCriterion = selectedIndex !== null ? parsedCriteria[selectedIndex] : null;

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
            <div className="w-11 h-11 rounded-full bg-purple-500 border-2 border-black flex items-center justify-center text-black shrink-0 shadow-[2px_2px_0px_0px_#000]">
              <CheckSquare className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-black uppercase tracking-[0.25em] text-purple-700 dark:text-purple-300 block">
                [{badgeText.toUpperCase()}]
              </span>
              <h3 className="font-serif text-xl md:text-2xl font-bold text-brand-ink dark:text-white leading-tight">
                {parsedTitle}
              </h3>
            </div>
          </div>
          <span className="px-3 py-1 bg-black text-[#D4AF37] dark:bg-white dark:text-black font-mono font-bold text-[11px] uppercase tracking-widest border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_#D4AF37]">
            +{parsedXp} XP
          </span>
        </div>

        {/* Argument Box */}
        <div className="bg-white dark:bg-[#12100C] p-5 border-2 border-[#D4AF37]/60 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.15)] font-mono space-y-2">
          <span className="text-[10px] font-mono font-black uppercase tracking-[0.25em] text-[#8B6914] dark:text-[#D4AF37] block">
            Argumento Presentado:
          </span>
          <p className="font-sans text-base text-brand-ink dark:text-amber-100 italic leading-relaxed">
            "{parsedArgument}"
          </p>
        </div>

        {/* Evaluation Criteria Selection */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono font-black uppercase tracking-wider text-[#8B6914] dark:text-[#D4AF37]">
            ¿Cuál es la principal deficiencia o estado de validez de este argumento?
          </h4>

          {parsedCriteria.map((crit, idx) => {
            const isSelected = selectedIndex === idx;
            let btnClass = "border-2 border-[#D4AF37]/50 bg-white dark:bg-[#12100C] text-brand-ink dark:text-amber-100 shadow-[3px_3px_0px_0px_#000] hover:bg-purple-100 dark:hover:bg-purple-950/60";

            if (isSelected) {
              btnClass = "border-2 border-black bg-[#D4AF37] text-black font-bold shadow-[4px_4px_0px_0px_#000]";
            }

            if (isSubmitted) {
              if (crit.isCorrectProblem) {
                btnClass = "border-2 border-black bg-emerald-500 text-black font-bold shadow-[4px_4px_0px_0px_#000]";
              } else if (isSelected && !crit.isCorrectProblem) {
                btnClass = "border-2 border-black bg-rose-600 text-white font-bold shadow-[4px_4px_0px_0px_#000]";
              } else {
                btnClass = "opacity-40 border-2 border-black/20 dark:border-white/20 bg-gray-100 dark:bg-zinc-900";
              }
            }

            return (
              <button
                key={crit.id || idx}
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
                  <span>{crit.label}</span>
                </div>

                {isSubmitted && crit.isCorrectProblem && <CheckCircle2 className="w-6 h-6 text-black shrink-0" />}
                {isSubmitted && isSelected && !crit.isCorrectProblem && <XCircle className="w-6 h-6 text-white shrink-0" />}
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
            Confirmar Evaluación del Argumento
          </button>
        ) : (
          <div className="space-y-4 pt-2 font-mono">
            <div className={cn(
              "p-4 border-2 border-black shadow-[3px_3px_0px_0px_#000]",
              selectedCriterion?.isCorrectProblem ? "bg-emerald-500 text-black font-bold" : "bg-rose-600 text-white font-bold"
            )}>
              <div className="flex items-center gap-2 font-black mb-1 text-sm uppercase tracking-wider">
                {selectedCriterion?.isCorrectProblem ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                <span>{selectedCriterion?.isCorrectProblem ? "¡EVALUACIÓN ARGUMENTATIVA CERTERA!" : "EVALUACIÓN DE ARGUMENTO INCONCLUSO"}</span>
              </div>
              <p className="text-xs md:text-sm font-sans leading-relaxed">
                {selectedCriterion?.feedback}
              </p>
            </div>

            <button
              onClick={handleReset}
              className="text-xs font-mono font-bold flex items-center gap-1.5 text-[#8B6914] hover:text-black dark:text-[#D4AF37] dark:hover:text-white transition-colors mt-2"
            >
              <RefreshCw className="w-3.5 h-3.5" /> ↺ Reevaluar argumento
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
