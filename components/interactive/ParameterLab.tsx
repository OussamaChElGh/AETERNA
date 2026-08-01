'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sliders, Activity, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGamification } from '@/context/GamificationContext';
import { useExerciseFeedback } from '@/lib/useExerciseFeedback';

export interface ParameterSpec {
  id: string;
  label: string;
  unit: string;
  min: number;
  max: number;
  step?: number;
  defaultValue: number;
}

export interface ParameterLabProps {
  id?: string;
  title?: string;
  badgeText?: string;
  description?: string;
  parameters: ParameterSpec[];
  outputLabel: string;
  outputUnit: string;
  calculateOutput?: (params: Record<string, number>) => number;
  guidedQuestion?: string;
  guidedAnswer?: string;
  xp?: number;
  content?: string;
  className?: string;
}

export function ParameterLab({
  id,
  title = "Laboratorio de Parámetros Interactivo",
  badgeText = "EXPERIMENTAR CON VARIABLES",
  description,
  parameters = [],
  outputLabel = "Resultado Calculado",
  outputUnit = "",
  calculateOutput,
  guidedQuestion,
  guidedAnswer,
  xp = 60,
  content,
  className
}: ParameterLabProps) {
  const { markQuestionAnswered, hasAnsweredQuestion } = useGamification();

  let parsedTitle = title;
  let parsedDesc = description || '';
  let parsedOutputLabel = outputLabel;
  let parsedOutputUnit = outputUnit;
  let parsedQuestion = guidedQuestion || '';
  let parsedAnswer = guidedAnswer || '';
  let parsedParams: ParameterSpec[] = parameters;
  let parsedXp = xp;

  if (content && content.trim()) {
    const lines = content.split('\n');
    const paramsList: ParameterSpec[] = [];

    lines.forEach(l => {
      const line = l.trim();
      if (line.startsWith('TITLE:')) parsedTitle = line.replace('TITLE:', '').trim();
      else if (line.startsWith('DESC:')) parsedDesc = line.replace('DESC:', '').trim();
      else if (line.startsWith('OUTPUT_LABEL:')) parsedOutputLabel = line.replace('OUTPUT_LABEL:', '').trim();
      else if (line.startsWith('OUTPUT_UNIT:')) parsedOutputUnit = line.replace('OUTPUT_UNIT:', '').trim();
      else if (line.startsWith('QUESTION:')) parsedQuestion = line.replace('QUESTION:', '').trim();
      else if (line.startsWith('ANSWER:')) parsedAnswer = line.replace('ANSWER:', '').trim();
      else if (line.startsWith('XP:')) parsedXp = parseInt(line.replace('XP:', '').trim(), 10) || 60;
      else if (line.startsWith('PARAM:')) {
        // Format: PARAM: id | label | unit | min | max | step | default
        const parts = line.replace('PARAM:', '').split('|').map(s => s.trim());
        if (parts.length >= 6) {
          paramsList.push({
            id: parts[0],
            label: parts[1],
            unit: parts[2],
            min: parseFloat(parts[3]),
            max: parseFloat(parts[4]),
            step: parseFloat(parts[5] || '1'),
            defaultValue: parseFloat(parts[6] || parts[3])
          });
        }
      }
    });

    if (paramsList.length > 0) parsedParams = paramsList;
  }

  // Initial state values for parameters
  const [paramValues, setParamValues] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    parsedParams.forEach(p => {
      initial[p.id] = p.defaultValue ?? p.min;
    });
    return initial;
  });

  const [hasExperimented, setHasExperimented] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const { feedbackRef, trigger, fxClass } = useExerciseFeedback();

  const labId = id || btoa(encodeURIComponent((parsedTitle + parsedOutputLabel).substring(0, 40))).substring(0, 32);
  const isCompleted = hasAnsweredQuestion(labId);

  const handleSliderChange = (paramId: string, val: number) => {
    setParamValues(prev => ({ ...prev, [paramId]: val }));
    if (!hasExperimented) {
      setHasExperimented(true);
    }
  };

  const handleReset = () => {
    const initial: Record<string, number> = {};
    parsedParams.forEach(p => {
      initial[p.id] = p.defaultValue ?? p.min;
    });
    setParamValues(initial);
  };

  // Compute calculated output
  let computedOutput = 0;
  if (calculateOutput) {
    computedOutput = calculateOutput(paramValues);
  } else {
    // Default fallback computation: ratio or product of first two params
    const keys = Object.keys(paramValues);
    if (keys.length >= 2) {
      const v1 = paramValues[keys[0]];
      const v2 = paramValues[keys[1]];
      computedOutput = v2 !== 0 ? v1 / v2 : 0;
    } else if (keys.length === 1) {
      computedOutput = paramValues[keys[0]];
    }
  }

  const handleCompleteLab = () => {
    setShowAnswer(true);
    if (!isCompleted) {
      markQuestionAnswered(labId, parsedXp, `Laboratorio: ${parsedTitle}`);
      trigger('correct', labId, parsedXp);
    }
  };

  return (
    <div ref={feedbackRef} className={cn("not-prose my-12 mx-auto max-w-4xl px-2 relative", className)}>
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className={cn("bg-[#FAF6EC] dark:bg-[#1A1712] border-4 border-[#D4AF37] p-6 md:p-8 shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#D4AF37] relative space-y-6", fxClass)}
      >
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b-4 border-[#D4AF37]/40 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-emerald-500 border-2 border-black flex items-center justify-center text-black shrink-0 shadow-[2px_2px_0px_0px_#000]">
              <Sliders size={22} />
            </div>
            <div>
              <span className="text-[10px] font-mono font-black uppercase tracking-[0.25em] text-emerald-700 dark:text-emerald-400 block">
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

        {parsedDesc && (
          <p className="text-sm md:text-base font-sans text-brand-ink dark:text-amber-100 leading-relaxed">
            {parsedDesc}
          </p>
        )}

        {/* Parameter Sliders Box */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-[#12100C] p-5 border-2 border-[#D4AF37]/60 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.15)] font-mono">
          {parsedParams.map(p => {
            const currentVal = paramValues[p.id] ?? p.min;
            return (
              <div key={p.id} className="space-y-2">
                <div className="flex justify-between items-center text-xs md:text-sm font-bold">
                  <span className="text-brand-ink dark:text-amber-100">{p.label}</span>
                  <span className="text-[#8B6914] dark:text-[#D4AF37]">
                    {currentVal} {p.unit}
                  </span>
                </div>
                <input
                  type="range"
                  min={p.min}
                  max={p.max}
                  step={p.step || 1}
                  value={currentVal}
                  onChange={e => handleSliderChange(p.id, parseFloat(e.target.value))}
                  className="w-full h-2 bg-black/10 dark:bg-white/20 appearance-none cursor-pointer accent-[#D4AF37]"
                />
                <div className="flex justify-between text-[10px] text-gray-500 dark:text-gray-400">
                  <span>{p.min} {p.unit}</span>
                  <span>{p.max} {p.unit}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Computed Output Display */}
        <div className="p-5 bg-black text-[#D4AF37] border-2 border-black shadow-[4px_4px_0px_0px_#000] flex flex-col md:flex-row items-center justify-between gap-4 font-mono">
          <div className="flex items-center gap-3">
            <Activity size={24} className="text-emerald-400 animate-pulse" />
            <div>
              <span className="text-xs text-gray-400 uppercase tracking-wider block font-bold">
                {parsedOutputLabel}
              </span>
              <div className="text-2xl md:text-3xl font-black tracking-tight text-white mt-0.5">
                {Number.isInteger(computedOutput)
                  ? computedOutput
                  : typeof computedOutput === 'number'
                    ? computedOutput.toFixed(2)
                    : computedOutput} <span className="text-sm font-normal text-emerald-400">{parsedOutputUnit}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="text-xs px-3 py-1.5 bg-[#D4AF37] text-black font-bold uppercase tracking-wider border border-black hover:bg-yellow-400 transition-colors flex items-center gap-1.5 shrink-0"
          >
            <RotateCcw size={14} /> Restablecer
          </button>
        </div>

        {/* Guided Question & Conclusion */}
        {parsedQuestion && (
          <div className="space-y-4 pt-4 border-t-2 border-[#D4AF37]/40 font-mono">
            <div className="bg-amber-100 dark:bg-amber-950/60 border-2 border-[#D4AF37] p-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#8B6914] dark:text-[#D4AF37] mb-1 flex items-center gap-1.5">
                <Sparkles size={14} /> PREGUNTA DE REFLEXIÓN EXPERIMENTAL
              </h4>
              <p className="text-sm font-sans font-medium text-amber-900 dark:text-amber-200">
                {parsedQuestion}
              </p>
            </div>

            {!showAnswer ? (
              <button
                onClick={handleCompleteLab}
                className="w-full py-3.5 px-6 bg-[#D4AF37] text-black font-mono font-black text-xs uppercase tracking-widest border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:bg-yellow-400 transition-all cursor-pointer active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
              >
                ▶ VER CONCLUSIÓN DEL LABORATORIO
              </button>
            ) : (
              <div className="p-4 bg-emerald-500 text-black border-2 border-black shadow-[3px_3px_0px_0px_#000]">
                <div className="flex items-center gap-2 font-black text-xs uppercase tracking-widest mb-1">
                  <CheckCircle2 size={18} /> CONCLUSIÓN CONFIRMADA
                </div>
                <p className="text-sm font-sans font-medium">
                  {parsedAnswer || "Al modificar los parámetros se evidencia la relación funcional directa e inversa entre las magnitudes físicas manipuladas."}
                </p>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
