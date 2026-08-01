'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldAlert, CheckCircle2, AlertTriangle, Sparkles, RefreshCw, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PixelFrame } from '@/components/blocks/PixelFrame';
import { useGamification } from '@/context/GamificationContext';
import { useExerciseFeedback } from '@/lib/useExerciseFeedback';

export interface ReasoningStep {
  id: string;
  text: string;
  hasError: boolean;
  errorType?: string;
  explanation: string;
}

export interface ErrorHunterProps {
  id?: string;
  title?: string;
  badgeText?: string;
  context?: string;
  steps: ReasoningStep[];
  xp?: number;
  content?: string;
  className?: string;
}

export function ErrorHunter({
  id,
  title = "Cazador de Errores Pedagógico",
  badgeText = "ANALIZAR Y DETECTAR ERRORES",
  context,
  steps = [],
  xp = 60,
  content,
  className
}: ErrorHunterProps) {
  const { markQuestionAnswered, hasAnsweredQuestion } = useGamification();

  let parsedTitle = title;
  let parsedContext = context || '';
  let parsedSteps: ReasoningStep[] = steps;
  let parsedXp = xp;

  if (content && content.trim()) {
    const lines = content.split('\n');
    const stepList: ReasoningStep[] = [];

    lines.forEach(l => {
      const line = l.trim();
      if (line.startsWith('TITLE:')) parsedTitle = line.replace('TITLE:', '').trim();
      else if (line.startsWith('CONTEXT:')) parsedContext = line.replace('CONTEXT:', '').trim();
      else if (line.startsWith('XP:')) parsedXp = parseInt(line.replace('XP:', '').trim(), 10) || 60;
      else if (line.startsWith('STEP_CORRECT:')) {
        // Format: STEP_CORRECT: id | text | explanation
        const parts = line.replace('STEP_CORRECT:', '').split('|').map(s => s.trim());
        if (parts.length >= 2) {
          stepList.push({ id: parts[0], text: parts[1], hasError: false, explanation: parts[2] || 'Paso correcto.' });
        }
      } else if (line.startsWith('STEP_ERROR:')) {
        // Format: STEP_ERROR: id | text | errorType | explanation
        const parts = line.replace('STEP_ERROR:', '').split('|').map(s => s.trim());
        if (parts.length >= 3) {
          stepList.push({ id: parts[0], text: parts[1], hasError: true, errorType: parts[2], explanation: parts[3] || '¡Error localizado aquí!' });
        }
      }
    });

    if (stepList.length > 0) parsedSteps = stepList;
  }

  const [selectedStepId, setSelectedStepId] = useState<string | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const { feedbackRef, trigger, fxClass } = useExerciseFeedback();

  const hunterId = id || btoa(encodeURIComponent((parsedTitle + parsedContext).substring(0, 40))).substring(0, 32);
  const isCompleted = hasAnsweredQuestion(hunterId);

  const handleSelectStep = (stepId: string) => {
    if (isRevealed) return;
    setSelectedStepId(stepId);
  };

  const handleConfirmHunt = () => {
    if (!selectedStepId || isRevealed) return;
    setIsRevealed(true);
    const selected = parsedSteps.find(s => s.id === selectedStepId);
    if (selected && selected.hasError && !isCompleted) {
      markQuestionAnswered(hunterId, parsedXp, `Cazador de Errores: ${parsedTitle}`);
      trigger('correct', hunterId, parsedXp);
    } else {
      trigger('wrong', hunterId);
    }
  };

  const handleReset = () => {
    setSelectedStepId(null);
    setIsRevealed(false);
  };

  const selectedStep = parsedSteps.find(s => s.id === selectedStepId);

  return (
    <div ref={feedbackRef} className={cn("not-prose my-12 mx-auto max-w-4xl px-2 relative", className)}>
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className={cn("relative space-y-6", fxClass)}
      >
        <PixelFrame accent="#D4AF37" bgClass="bg-[#FAF6EC] dark:bg-[#1A1712]" dense>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-none bg-rose-600 border border-black flex items-center justify-center text-white shrink-0">
                <ShieldAlert size={15} />
              </div>
              <div>
                <span className="text-[8px] font-mono font-black uppercase tracking-[0.2em] text-rose-700 dark:text-rose-400 block">
                  {badgeText.toUpperCase()}
                </span>
                <h3 className="font-mono text-sm md:text-base font-black uppercase text-brand-ink dark:text-white leading-tight">
                  {parsedTitle}
                </h3>
              </div>
            </div>

            <span className="px-2 py-1 bg-black text-[#D4AF37] dark:bg-white dark:text-black font-mono font-bold text-[10px] uppercase tracking-widest border border-black dark:border-white">
              +{parsedXp} XP
            </span>
          </div>

        {parsedContext && (
          <div className="bg-white dark:bg-[#12100C] p-3 border-2 border-[#D4AF37]/50 font-mono">
            <p className="font-sans text-[13px] font-semibold text-brand-ink dark:text-amber-100 leading-snug">
              {parsedContext}
            </p>
          </div>
        )}

        {/* Reasoning Steps List */}
        <div className="space-y-2 font-mono">
          {parsedSteps.map((step, idx) => {
            const isSelected = selectedStepId === step.id;
            let stepClass = "border-2 border-[#D4AF37]/40 bg-white dark:bg-[#12100C] text-brand-ink dark:text-amber-100 hover:bg-rose-100 dark:hover:bg-rose-950/60";

            if (isSelected) {
              stepClass = "border-2 border-black bg-rose-600 text-white font-bold shadow-[4px_4px_0px_0px_#000]";
            }

            if (isRevealed) {
              if (step.hasError) {
                stepClass = "border-2 border-black bg-rose-600 text-white font-bold shadow-[4px_4px_0px_0px_#000]";
              } else if (isSelected && !step.hasError) {
                stepClass = "border-2 border-black bg-amber-500 text-black font-bold shadow-[4px_4px_0px_0px_#000]";
              } else {
                stepClass = "opacity-40 border-2 border-black/20 dark:border-white/20 bg-gray-100 dark:bg-zinc-900";
              }
            }

            return (
              <button
                key={step.id || idx}
                disabled={isRevealed}
                onClick={() => handleSelectStep(step.id)}
                className={cn(
                  "w-full text-left p-3 font-mono font-bold transition-all flex items-start justify-between gap-3 text-[13px]",
                  stepClass
                )}
              >
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 bg-black text-white dark:bg-white dark:text-black border border-black flex items-center justify-center font-black text-[10px] shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{step.text}</span>
                </div>

                {isRevealed && step.hasError && (
                  <AlertTriangle size={16} className="text-white shrink-0 mt-0.5" />
                )}
                {isRevealed && !step.hasError && isSelected && (
                  <XCircle size={16} className="text-black shrink-0 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* Action Button */}
        {!isRevealed ? (
          <button
            disabled={!selectedStepId}
            onClick={handleConfirmHunt}
            className={cn(
              "w-full py-3 px-4 font-mono font-black text-[11px] uppercase tracking-[0.2em] border-2 border-black transition-all shadow-[3px_3px_0px_0px_#000] flex items-center justify-center gap-2",
              selectedStepId
                ? "bg-[#D4AF37] text-black hover:bg-yellow-400 cursor-pointer active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                : "bg-gray-300 text-gray-600 dark:bg-gray-800 dark:text-gray-500 border-gray-700 cursor-not-allowed"
            )}
          >
            <span>▶ IDENTIFICAR PASO CON ERROR</span>
          </button>
        ) : (
          <div className="space-y-3 pt-2 font-mono">
            <div className={cn(
              "p-3 border-2 border-black shadow-[3px_3px_0px_0px_#000]",
              selectedStep?.hasError
                ? "bg-emerald-500 text-black font-bold"
                : "bg-rose-600 text-white font-bold"
            )}>
              <div className="font-black mb-1 text-sm uppercase tracking-wider flex items-center gap-2">
                {selectedStep?.hasError ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
                <span>{selectedStep?.hasError ? "¡ERROR DETECTADO CORRECTAMENTE!" : "EL PASO SELECCIONADO ERA CORRECTO"}</span>
              </div>
              <p className="font-sans text-xs md:text-sm leading-relaxed">
                {selectedStep?.explanation || "El error radicaba en la aplicación o supuesto inicial."}
              </p>
            </div>

            <button
              onClick={handleReset}
              className="text-xs font-mono font-bold flex items-center gap-1.5 text-[#8B6914] hover:text-black dark:text-[#D4AF37] dark:hover:text-white transition-colors mt-2"
            >
              <RefreshCw size={14} /> ↺ REINICIAR CAZA DE ERRORES
            </button>
          </div>
        )}
        </PixelFrame>
      </motion.div>
    </div>
  );
}
