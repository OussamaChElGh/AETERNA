'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Boxes, CheckCircle2, Sparkles, Plus, Trash2, ArrowRight, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGamification } from '@/context/GamificationContext';
import { useExerciseFeedback } from '@/lib/useExerciseFeedback';

export interface ModelVariable {
  id: string;
  name: string;
  isRelevant: boolean;
  justification?: string;
  category?: string;
}

export interface ModelBuilderProps {
  id?: string;
  title?: string;
  badgeText?: string;
  problemDescription: string;
  availableVariables: ModelVariable[];
  xp?: number;
  content?: string;
  className?: string;
}

export function ModelBuilder({
  id,
  title = "Constructor de Modelos y Simplificaciones",
  badgeText = "MODELIZAR Y SIMPLIFICAR",
  problemDescription,
  availableVariables = [],
  xp = 70,
  content,
  className
}: ModelBuilderProps) {
  const { markQuestionAnswered, hasAnsweredQuestion } = useGamification();

  let parsedTitle = title;
  let parsedDesc = problemDescription || '';
  let parsedVars: ModelVariable[] = availableVariables;
  let parsedXp = xp;

  if (content && content.trim()) {
    const lines = content.split('\n');
    const varList: ModelVariable[] = [];

    lines.forEach(l => {
      const line = l.trim();
      if (line.startsWith('TITLE:')) parsedTitle = line.replace('TITLE:', '').trim();
      else if (line.startsWith('PROBLEM:')) parsedDesc = line.replace('PROBLEM:', '').trim();
      else if (line.startsWith('XP:')) parsedXp = parseInt(line.replace('XP:', '').trim(), 10) || 70;
      else if (line.startsWith('VAR_RELEVANT:')) {
        // Format: VAR_RELEVANT: id | name | justification
        const parts = line.replace('VAR_RELEVANT:', '').split('|').map(s => s.trim());
        if (parts.length >= 2) {
          varList.push({ id: parts[0], name: parts[1], isRelevant: true, justification: parts[2] || 'Variable relevante para el modelo.' });
        }
      } else if (line.startsWith('VAR_IRRELEVANT:')) {
        // Format: VAR_IRRELEVANT: id | name | justification
        const parts = line.replace('VAR_IRRELEVANT:', '').split('|').map(s => s.trim());
        if (parts.length >= 2) {
          varList.push({ id: parts[0], name: parts[1], isRelevant: false, justification: parts[2] || 'Efecto despreciable o irrelevante.' });
        }
      }
    });

    if (varList.length > 0) parsedVars = varList;
  }

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { feedbackRef, trigger, fxClass } = useExerciseFeedback();

  const modelId = id || btoa(encodeURIComponent((parsedTitle + parsedDesc).substring(0, 40))).substring(0, 32);
  const isCompleted = hasAnsweredQuestion(modelId);

  const toggleVariable = (varId: string) => {
    if (isSubmitted) return;
    if (selectedIds.includes(varId)) {
      setSelectedIds(prev => prev.filter(i => i !== varId));
    } else {
      setSelectedIds(prev => [...prev, varId]);
    }
  };

  const handleBuildModel = () => {
    if (selectedIds.length === 0 || isSubmitted) return;
    setIsSubmitted(true);

    const relevantCount = parsedVars.filter(v => v.isRelevant).length;
    const correctlySelected = parsedVars.filter(v => v.isRelevant && selectedIds.includes(v.id)).length;
    const incorrectlySelected = parsedVars.filter(v => !v.isRelevant && selectedIds.includes(v.id)).length;

    // Check if model construction is successful (at least 80% relevant selected and 0 irrelevant)
    if (correctlySelected >= Math.ceil(relevantCount * 0.8) && incorrectlySelected === 0 && !isCompleted) {
      markQuestionAnswered(modelId, parsedXp, `Modelo: ${parsedTitle}`);
      trigger('correct', modelId, parsedXp);
    } else {
      trigger('wrong', modelId);
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
            <div className="w-11 h-11 rounded-none bg-[#D4AF37] border-2 border-black flex items-center justify-center text-black shrink-0 shadow-[2px_2px_0px_0px_#000]">
              <Boxes size={22} />
            </div>
            <div>
              <span className="text-[10px] font-mono font-black uppercase tracking-[0.25em] text-[#8B6914] dark:text-[#D4AF37] block">
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

        {/* Problem Description */}
        <div className="bg-white dark:bg-[#12100C] p-4 md:p-5 border-2 border-[#D4AF37]/60 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.15)] font-mono">
          <p className="font-sans text-base font-semibold text-brand-ink dark:text-amber-100 leading-relaxed">
            {parsedDesc}
          </p>
        </div>

        {/* Variables Selection Grid */}
        <div className="space-y-3 font-mono">
          <h4 className="text-xs font-black uppercase tracking-wider text-[#8B6914] dark:text-[#D4AF37]">
            ▶ SELECCIONA LOS FACTORES Y VARIABLES RELEVANTES PARA EL MODELO:
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {parsedVars.map(v => {
              const isSelected = selectedIds.includes(v.id);
              let cardClass = "border-2 border-[#D4AF37]/50 bg-white dark:bg-[#12100C] text-brand-ink dark:text-amber-100 shadow-[3px_3px_0px_0px_#000] hover:bg-amber-100 dark:hover:bg-amber-950/60";

              if (isSelected) {
                cardClass = "border-2 border-black bg-[#D4AF37] text-black font-bold shadow-[4px_4px_0px_0px_#000]";
              }

              if (isSubmitted) {
                if (v.isRelevant && isSelected) {
                  cardClass = "border-2 border-black bg-emerald-500 text-black font-bold shadow-[4px_4px_0px_0px_#000]";
                } else if (!v.isRelevant && isSelected) {
                  cardClass = "border-2 border-black bg-rose-600 text-white font-bold shadow-[4px_4px_0px_0px_#000]";
                } else if (v.isRelevant && !isSelected) {
                  cardClass = "border-2 border-black bg-amber-500 text-black font-bold shadow-[4px_4px_0px_0px_#000]";
                }
              }

              return (
                <button
                  key={v.id}
                  disabled={isSubmitted}
                  onClick={() => toggleVariable(v.id)}
                  className={cn(
                    "p-3.5 border font-mono font-bold text-left transition-all flex items-center justify-between text-sm",
                    cardClass
                  )}
                >
                  <span>{v.name}</span>
                  {isSelected ? <CheckCircle2 size={18} className="shrink-0" /> : <Plus size={18} className="shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Button & Justification Feedback */}
        {!isSubmitted ? (
          <button
            disabled={selectedIds.length === 0}
            onClick={handleBuildModel}
            className={cn(
              "w-full py-4 px-6 font-mono font-black text-xs uppercase tracking-[0.2em] border-2 border-black transition-all shadow-[3px_3px_0px_0px_#000] flex items-center justify-center gap-2",
              selectedIds.length > 0
                ? "bg-[#D4AF37] text-black hover:bg-yellow-400 cursor-pointer active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                : "bg-gray-300 text-gray-600 dark:bg-gray-800 dark:text-gray-500 border-gray-700 cursor-not-allowed"
            )}
          >
            <span>▶ CONSTRUIR MODELO SIMPLIFICADO</span>
          </button>
        ) : (
          <div className="space-y-4 pt-2 font-mono">
            <div className="p-4 bg-white dark:bg-[#12100C] border-2 border-[#D4AF37] shadow-[3px_3px_0px_0px_#000]">
              <h4 className="text-xs font-mono font-black uppercase tracking-wider text-[#8B6914] dark:text-[#D4AF37] mb-3 flex items-center gap-1.5">
                <Sparkles size={14} /> JUSTIFICACIÓN TEÓRICA DE SIMPLIFICACIONES
              </h4>

              <div className="space-y-2 text-xs md:text-sm">
                {parsedVars.map(v => (
                  <div key={v.id} className="p-2.5 bg-[#FAF6EC] dark:bg-black border border-black/20 dark:border-white/20 leading-relaxed">
                    <span className="font-bold">{v.name}: </span>
                    <span className={v.isRelevant ? "text-emerald-700 dark:text-emerald-400 font-black" : "text-gray-500 opacity-80"}>
                      [{v.isRelevant ? "RELEVANTE" : "DESPRECIABLE"}]
                    </span>{" "}
                    {v.justification}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
