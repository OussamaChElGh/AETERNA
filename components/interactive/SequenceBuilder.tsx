'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ListOrdered, CheckCircle2, XCircle, Sparkles, RefreshCw, ArrowDown, MoveUp, MoveDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGamification } from '@/context/GamificationContext';
import { useExerciseFeedback } from '@/lib/useExerciseFeedback';

export interface SequenceStep {
  id: string;
  label: string;
}

export interface SequenceBuilderProps {
  id?: string;
  title?: string;
  badgeText?: string;
  description?: string;
  steps: SequenceStep[];
  correctOrderIds: string[];
  explanation?: string;
  xp?: number;
  content?: string;
  className?: string;
}

export function SequenceBuilder({
  id,
  title = "Reconstructor de Secuencia de Proceso",
  badgeText = "RECONSTRUIR PROCESO EN ORDEN CORRECTO",
  description,
  steps = [],
  correctOrderIds = [],
  explanation,
  xp = 60,
  content,
  className
}: SequenceBuilderProps) {
  const { markQuestionAnswered, hasAnsweredQuestion } = useGamification();
  const { feedbackRef, trigger, fxClass } = useExerciseFeedback();

  let parsedTitle = title;
  let parsedDesc = description || '';
  let parsedExplanation = explanation || '';
  let parsedSteps: SequenceStep[] = steps;
  let parsedCorrectIds: string[] = correctOrderIds;
  let parsedXp = xp;

  if (content && content.trim()) {
    const lines = content.split('\n');
    const stepList: SequenceStep[] = [];
    const correctIds: string[] = [];

    lines.forEach(l => {
      const line = l.trim();
      if (line.startsWith('TITLE:')) parsedTitle = line.replace('TITLE:', '').trim();
      else if (line.startsWith('DESC:')) parsedDesc = line.replace('DESC:', '').trim();
      else if (line.startsWith('EXPLANATION:')) parsedExplanation = line.replace('EXPLANATION:', '').trim();
      else if (line.startsWith('XP:')) parsedXp = parseInt(line.replace('XP:', '').trim(), 10) || 60;
      else if (line.startsWith('STEP:')) {
        // Format: STEP: id | label
        const parts = line.replace('STEP:', '').split('|').map(s => s.trim());
        if (parts.length >= 2) {
          stepList.push({ id: parts[0], label: parts[1] });
        }
      } else if (line.startsWith('CORRECT_ORDER:')) {
        const ids = line.replace('CORRECT_ORDER:', '').split(',').map(s => s.trim());
        correctIds.push(...ids);
      }
    });

    if (stepList.length > 0) parsedSteps = stepList;
    if (correctIds.length > 0) parsedCorrectIds = correctIds;
  }

  // Active ordered list state
  const [currentOrder, setCurrentOrder] = useState<SequenceStep[]>(() => [...parsedSteps]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const seqId = id || btoa(encodeURIComponent((parsedTitle + parsedDesc).substring(0, 40))).substring(0, 32);
  const isCompleted = hasAnsweredQuestion(seqId);

  const moveUp = (index: number) => {
    if (index === 0 || isSubmitted) return;
    const newArr = [...currentOrder];
    const temp = newArr[index - 1];
    newArr[index - 1] = newArr[index];
    newArr[index] = temp;
    setCurrentOrder(newArr);
  };

  const moveDown = (index: number) => {
    if (index === currentOrder.length - 1 || isSubmitted) return;
    const newArr = [...currentOrder];
    const temp = newArr[index + 1];
    newArr[index + 1] = newArr[index];
    newArr[index] = temp;
    setCurrentOrder(newArr);
  };

  const handleSubmit = () => {
    if (isSubmitted) return;
    setIsSubmitted(true);

    const isCorrect =
      currentOrder.length === parsedCorrectIds.length &&
      currentOrder.every((step, idx) => step.id === parsedCorrectIds[idx]);

    if (isCorrect && !isCompleted) {
      markQuestionAnswered(seqId, parsedXp, `Secuencia: ${parsedTitle}`);
    }
    if (isCorrect) {
      trigger('correct', seqId, parsedXp);
    } else {
      trigger('wrong', seqId);
    }
  };

  const handleReset = () => {
    setCurrentOrder([...parsedSteps]);
    setIsSubmitted(false);
  };

  const isCorrect =
    currentOrder.length === parsedCorrectIds.length &&
    currentOrder.every((step, idx) => step.id === parsedCorrectIds[idx]);

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
            <div className="w-11 h-11 rounded-none bg-teal-500 border-2 border-black flex items-center justify-center text-black shrink-0 shadow-[2px_2px_0px_0px_#000]">
              <ListOrdered className="w-6 h-6 text-black" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-black uppercase tracking-[0.25em] text-teal-700 dark:text-teal-300 block">
                [{badgeText}]
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

        {parsedDesc && (
          <p className="text-sm font-sans text-brand-ink dark:text-amber-100 leading-relaxed">
            {parsedDesc}
          </p>
        )}

        {/* Steps Reordering Controls */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-mono font-black uppercase tracking-wider text-[#8B6914] dark:text-[#D4AF37]">
            Ordena las etapas del proceso de arriba a abajo (usa las flechas):
          </h4>

          {currentOrder.map((step, idx) => {
            const isTargetPos = isSubmitted && parsedCorrectIds[idx] === step.id;

            return (
              <div
                key={step.id}
                className={cn(
                  "p-3.5 border-2 flex items-center justify-between gap-3 text-sm md:text-base font-mono transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,0.15)]",
                  isSubmitted
                    ? (isTargetPos ? "border-emerald-500 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 font-semibold" : "border-rose-500 bg-rose-500/10 text-rose-800 dark:text-rose-300")
                    : "border-black/10 dark:border-white/20 bg-white dark:bg-[#12100C]"
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 bg-teal-500 text-black border-2 border-black font-mono font-black text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span>{step.label}</span>
                </div>

                {!isSubmitted ? (
                  <div className="flex items-center gap-1">
                    <button
                      disabled={idx === 0}
                      onClick={() => moveUp(idx)}
                      className="p-1.5 border-2 border-black/20 dark:border-white/20 bg-white dark:bg-[#12100C] hover:bg-teal-500/20 disabled:opacity-30 transition-colors"
                    >
                      <MoveUp className="w-4 h-4 text-gray-600 dark:text-zinc-300" />
                    </button>
                    <button
                      disabled={idx === currentOrder.length - 1}
                      onClick={() => moveDown(idx)}
                      className="p-1.5 border-2 border-black/20 dark:border-white/20 bg-white dark:bg-[#12100C] hover:bg-teal-500/20 disabled:opacity-30 transition-colors"
                    >
                      <MoveDown className="w-4 h-4 text-gray-600 dark:text-zinc-300" />
                    </button>
                  </div>
                ) : (
                  isTargetPos ? <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> : <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                )}
              </div>
            );
          })}
        </div>

        {/* Action Button & Feedback */}
        {!isSubmitted ? (
          <button
            onClick={handleSubmit}
            className="w-full py-4 px-6 font-mono font-black text-xs uppercase tracking-[0.2em] border-2 border-black transition-all shadow-[3px_3px_0px_0px_#000] flex items-center justify-center gap-2 bg-[#D4AF37] text-black hover:bg-yellow-400 cursor-pointer active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
          >
            Validar Secuencia del Proceso
          </button>
        ) : (
          <div className="space-y-4 pt-2">
            <div className={cn(
              "p-4 border-2 border-black shadow-[3px_3px_0px_0px_#000] text-sm",
              isCorrect ? "bg-emerald-500 text-black font-bold" : "bg-rose-600 text-white font-bold"
            )}>
              <div className="font-bold mb-1 flex items-center gap-2 text-sm uppercase tracking-wider">
                {isCorrect ? <CheckCircle2 className="w-5 h-5 text-black" /> : <XCircle className="w-5 h-5 text-white" />}
                <span>{isCorrect ? "¡Secuencia del Proceso Reconstruida Correctamente!" : "El orden de la secuencia contiene errores de precedencia"}</span>
              </div>
              <p className="opacity-90 leading-relaxed text-xs md:text-sm font-sans">
                {parsedExplanation || "Los pasos procedimentales requieren respetar el orden estricto de dependencias iniciales y finales."}
              </p>
            </div>

            <button
              onClick={handleReset}
              className="text-xs font-mono font-bold flex items-center gap-1.5 text-[#8B6914] hover:text-black dark:text-[#D4AF37] dark:hover:text-white transition-colors mt-2"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reordenar secuencia
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
