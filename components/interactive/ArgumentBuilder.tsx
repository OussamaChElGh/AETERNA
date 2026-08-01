'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Layers, ArrowDown, CheckCircle2, XCircle, Sparkles, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGamification } from '@/context/GamificationContext';
import { useExerciseFeedback } from '@/lib/useExerciseFeedback';

export interface PremiseItem {
  id: string;
  text: string;
  isIrrelevant?: boolean;
}

export interface ArgumentBuilderProps {
  id?: string;
  title?: string;
  badgeText?: string;
  claimOrConclusion: string;
  premises: PremiseItem[];
  correctOrderIds: string[];
  justification?: string;
  xp?: number;
  content?: string;
  className?: string;
}

export function ArgumentBuilder({
  id,
  title = "Constructor de Argumentos Lógicos",
  badgeText = "CONSTRUIR Y ESTRUCTURAR ARGUMENTO",
  claimOrConclusion,
  premises = [],
  correctOrderIds = [],
  justification,
  xp = 60,
  content,
  className
}: ArgumentBuilderProps) {
  const { markQuestionAnswered, hasAnsweredQuestion } = useGamification();

  let parsedTitle = title;
  let parsedConclusion = claimOrConclusion || '';
  let parsedJustification = justification || '';
  let parsedPremises: PremiseItem[] = premises;
  let parsedCorrectIds: string[] = correctOrderIds;
  let parsedXp = xp;

  if (content && content.trim()) {
    const lines = content.split('\n');
    const premList: PremiseItem[] = [];
    const correctIds: string[] = [];

    lines.forEach(l => {
      const line = l.trim();
      if (line.startsWith('TITLE:')) parsedTitle = line.replace('TITLE:', '').trim();
      else if (line.startsWith('CONCLUSION:')) parsedConclusion = line.replace('CONCLUSION:', '').trim();
      else if (line.startsWith('JUSTIFICATION:')) parsedJustification = line.replace('JUSTIFICATION:', '').trim();
      else if (line.startsWith('XP:')) parsedXp = parseInt(line.replace('XP:', '').trim(), 10) || 60;
      else if (line.startsWith('PREMISE:')) {
        // Format: PREMISE: id | text
        const parts = line.replace('PREMISE:', '').split('|').map(s => s.trim());
        if (parts.length >= 2) {
          premList.push({ id: parts[0], text: parts[1] });
        }
      } else if (line.startsWith('PREMISE_IRRELEVANT:')) {
        const parts = line.replace('PREMISE_IRRELEVANT:', '').split('|').map(s => s.trim());
        if (parts.length >= 2) {
          premList.push({ id: parts[0], text: parts[1], isIrrelevant: true });
        }
      } else if (line.startsWith('CORRECT_ORDER:')) {
        const ids = line.replace('CORRECT_ORDER:', '').split(',').map(s => s.trim());
        correctIds.push(...ids);
      }
    });

    if (premList.length > 0) parsedPremises = premList;
    if (correctIds.length > 0) parsedCorrectIds = correctIds;
  }

  // Selected premise order sequence
  const [selectedPremiseIds, setSelectedPremiseIds] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { feedbackRef, trigger, fxClass } = useExerciseFeedback();

  const argId = id || btoa(encodeURIComponent((parsedTitle + parsedConclusion).substring(0, 40))).substring(0, 32);
  const isCompleted = hasAnsweredQuestion(argId);

  const togglePremiseSelection = (premId: string) => {
    if (isSubmitted) return;
    if (selectedPremiseIds.includes(premId)) {
      setSelectedPremiseIds(prev => prev.filter(id => id !== premId));
    } else {
      setSelectedPremiseIds(prev => [...prev, premId]);
    }
  };

  const handleSubmit = () => {
    if (selectedPremiseIds.length === 0 || isSubmitted) return;
    setIsSubmitted(true);

    const isCorrectSequence =
      selectedPremiseIds.length === parsedCorrectIds.length &&
      selectedPremiseIds.every((id, idx) => id === parsedCorrectIds[idx]);

    if (isCorrectSequence && !isCompleted) {
      markQuestionAnswered(argId, parsedXp, `Argumento: ${parsedTitle}`);
      trigger('correct', argId, parsedXp);
    } else {
      trigger('wrong', argId);
    }
  };

  const handleReset = () => {
    setSelectedPremiseIds([]);
    setIsSubmitted(false);
  };

  const isCorrect =
    selectedPremiseIds.length === parsedCorrectIds.length &&
    selectedPremiseIds.every((id, idx) => id === parsedCorrectIds[idx]);

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
            <div className="w-11 h-11 rounded-none bg-amber-500 border-2 border-black flex items-center justify-center text-black shrink-0 shadow-[2px_2px_0px_0px_#000]">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-black uppercase tracking-[0.25em] text-amber-700 dark:text-amber-300 block">
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

        {/* Conclusion Box */}
        <div className="bg-white dark:bg-[#12100C] p-5 border-2 border-[#D4AF37]/60 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.15)] font-mono">
          <span className="text-[10px] font-mono font-black uppercase tracking-[0.25em] text-[#8B6914] dark:text-[#D4AF37] block mb-2">
            Conclusión / Afirmación a Demostrar:
          </span>
          <p className="font-sans text-base md:text-lg font-bold text-brand-ink dark:text-amber-100">
            {parsedConclusion}
          </p>
        </div>

        {/* Premise Selector Pool */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono font-black uppercase tracking-wider text-[#8B6914] dark:text-[#D4AF37]">
            Selecciona y Ordena las Premisas Necesarias (Haz clic en el orden lógico):
          </h4>

          <div className="grid grid-cols-1 gap-2.5">
            {parsedPremises.map(prem => {
              const selectedOrderIndex = selectedPremiseIds.indexOf(prem.id);
              const isSelected = selectedOrderIndex !== -1;

              return (
                <button
                  key={prem.id}
                  disabled={isSubmitted}
                  onClick={() => togglePremiseSelection(prem.id)}
                  className={cn(
                    "w-full text-left p-4 font-mono font-bold transition-all flex items-center justify-between gap-4 text-sm md:text-base",
                    isSelected
                      ? "border-2 border-black bg-[#D4AF37] text-black font-bold shadow-[4px_4px_0px_0px_#000]"
                      : "border-2 border-[#D4AF37]/50 bg-white dark:bg-[#12100C] text-brand-ink dark:text-amber-100 shadow-[3px_3px_0px_0px_#000] hover:bg-amber-100 dark:hover:bg-amber-950/60"
                  )}
                >
                  <div className="flex items-center gap-3">
                    {isSelected ? (
                      <span className="w-7 h-7 bg-black text-[#D4AF37] border border-[#D4AF37] flex items-center justify-center font-black text-xs shrink-0">
                        {selectedOrderIndex + 1}
                      </span>
                    ) : (
                      <span className="w-7 h-7 bg-black text-[#D4AF37] border border-[#D4AF37] flex items-center justify-center font-black text-xs shrink-0">
                        +
                      </span>
                    )}
                    <span>{prem.text}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Sequence Flow Preview */}
        {selectedPremiseIds.length > 0 && (
          <div className="bg-white dark:bg-[#12100C] p-5 border-2 border-[#D4AF37]/50 shadow-[3px_3px_0px_0px_#000] font-mono space-y-2">
            <span className="text-[10px] font-mono font-black uppercase tracking-[0.25em] text-[#8B6914] dark:text-[#D4AF37] block mb-1">
              Secuencia Argumentativa Construida:
            </span>
            {selectedPremiseIds.map((id, i) => {
              const p = parsedPremises.find(item => item.id === id);
              return (
                <div key={id} className="flex items-center gap-2 text-xs md:text-sm font-medium font-sans text-brand-ink dark:text-amber-100">
                  <span className="font-mono font-bold text-amber-700 dark:text-amber-300">Paso {i + 1}:</span>
                  <span>{p?.text}</span>
                </div>
              );
            })}
            <div className="pt-2 flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-300 border-t-2 border-[#D4AF37]/40">
              <ArrowDown className="w-4 h-4" /> ➔ Conclusión: {parsedConclusion}
            </div>
          </div>
        )}

        {/* Action Button & Feedback */}
        {!isSubmitted ? (
          <button
            disabled={selectedPremiseIds.length === 0}
            onClick={handleSubmit}
            className={cn(
              "w-full py-4 px-6 font-mono font-black text-xs uppercase tracking-[0.2em] border-2 border-black transition-all shadow-[3px_3px_0px_0px_#000] flex items-center justify-center gap-2",
              selectedPremiseIds.length > 0
                ? "bg-[#D4AF37] text-black hover:bg-yellow-400 cursor-pointer active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                : "bg-gray-300 text-gray-600 dark:bg-gray-800 dark:text-gray-500 border-gray-700 cursor-not-allowed"
            )}
          >
            Validar Argumento Lógico
          </button>
        ) : (
          <div className="space-y-4 pt-2 font-mono">
            <div className={cn(
              "p-4 border-2 border-black shadow-[3px_3px_0px_0px_#000]",
              isCorrect ? "bg-emerald-500 text-black font-bold" : "bg-rose-600 text-white font-bold"
            )}>
              <div className="flex items-center gap-2 font-black mb-1 text-sm uppercase tracking-wider">
                {isCorrect ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                <span>{isCorrect ? "¡ARGUMENTO VÁLIDO Y ESTRUCTURADO!" : "SECUENCIA ARGUMENTATIVA INCOMPLETA O CON MISCONCEPCIONES"}</span>
              </div>
              <p className="text-xs md:text-sm font-sans leading-relaxed">
                {parsedJustification || "El argumento se sostiene correctamente cuando las premisas siguen el orden lógico deducido."}
              </p>
            </div>

            <button
              onClick={handleReset}
              className="text-xs font-mono font-bold flex items-center gap-1.5 text-[#8B6914] hover:text-black dark:text-[#D4AF37] dark:hover:text-white transition-colors mt-2"
            >
              <RefreshCw className="w-3.5 h-3.5" /> ↺ Reconstruir argumento
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
