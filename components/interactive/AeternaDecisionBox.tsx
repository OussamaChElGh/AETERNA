'use client';
import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ShieldCheck, CheckCircle2, ArrowRight, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGamification, calculateProgressToNextLevel } from '@/context/GamificationContext';
import { useExerciseFeedback } from '@/lib/useExerciseFeedback';

export interface AeternaDecisionBoxProps {
  id?: string;
  badgeText?: string;
  title?: string;
  question?: string;
  levelRequired?: number;
  xp?: number;
  buttonText?: string;
  completedText?: string;
  onDecision?: () => void;
  className?: string;
  content?: string; 
}

export function AeternaDecisionBox({
  id,
  badgeText = "Fragmento de Destino",
  title = "",
  question,
  levelRequired = 0,
  xp = 50,
  buttonText = "Aceptar Destino",
  completedText = "Decisión Sellada",
  onDecision,
  className,
  content
}: AeternaDecisionBoxProps) {
  const { progress, markQuestionAnswered, hasAnsweredQuestion } = useGamification();
  const [textValue, setTextValue] = useState("");
  const cardRef = useRef<HTMLDivElement>(null);
  const { feedbackRef, trigger, fxClass } = useExerciseFeedback();

  let finalBadge = badgeText;
  let finalTitle = title;
  let finalQuestion = question || "";
  let finalLevel = levelRequired;
  let finalXp = xp;
  let finalButton = buttonText;
  let finalRespuesta = "";

  if (content) {
    const lines = content.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      if (trimmed.startsWith('Badge:')) finalBadge = trimmed.replace('Badge:', '').trim();
      else if (trimmed.startsWith('Título:')) finalTitle = trimmed.replace('Título:', '').trim();
      else if (trimmed.startsWith('Pregunta:')) finalQuestion = trimmed.replace('Pregunta:', '').trim();
      else if (trimmed.startsWith('Nivel:')) finalLevel = parseInt(trimmed.replace('Nivel:', '').trim()) || 0;
      else if (trimmed.startsWith('XP:')) finalXp = parseInt(trimmed.replace('XP:', '').trim()) || 50;
      else if (trimmed.startsWith('Botón:')) finalButton = trimmed.replace('Botón:', '').trim();
      else if (trimmed.startsWith('Respuesta:')) finalRespuesta = trimmed.replace('Respuesta:', '').trim();
    }
  }

  const definitiveId = id || btoa(encodeURIComponent(finalQuestion)).substring(0, 32);
  const isCompleted = hasAnsweredQuestion(definitiveId);
  const currentLevelStat = calculateProgressToNextLevel(progress.xp);
  const userLevel = currentLevelStat.level;
  const isLocked = userLevel < finalLevel;

  const handleDecision = () => {
    if (isLocked || isCompleted || !textValue.trim()) return;
    markQuestionAnswered(definitiveId, finalXp, `Reflexión: ${finalBadge}`);
    trigger('correct', definitiveId, finalXp);
    if (onDecision) onDecision();
  };

  return (
    <div ref={feedbackRef} className={cn("not-prose relative my-12 mx-auto max-w-2xl px-4", className)}>
      <div ref={cardRef} className={cn(
        "relative z-10 bg-[#FAF6EC] dark:bg-[#1A1712] border-4 border-[#D4AF37] p-6 md:p-8 transition-all duration-300 shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#D4AF37] space-y-6",
        isCompleted && "border-emerald-500 shadow-[6px_6px_0px_0px_#10B981]",
        fxClass
      )}>
        {/* HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b-4 border-[#D4AF37]/40 pb-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-11 h-11 rounded-full bg-purple-600 border-2 border-black flex items-center justify-center text-white shrink-0 shadow-[2px_2px_0px_0px_#000]",
              isCompleted && "bg-emerald-500 text-black"
            )}>
              {isCompleted ? <ShieldCheck size={22} /> : <Sparkles size={22} />}
            </div>
            <div>
              <span className="text-[10px] font-mono font-black uppercase tracking-[0.25em] text-purple-700 dark:text-purple-300 block">
                [{finalBadge.toUpperCase()}]
              </span>
              <h3 className="font-serif text-xl md:text-2xl font-bold text-brand-ink dark:text-white leading-tight">
                {finalQuestion || "Reflexión Aeterna"}
              </h3>
            </div>
          </div>

          <span className="px-3 py-1 bg-black text-[#D4AF37] dark:bg-white dark:text-black font-mono font-bold text-[11px] uppercase tracking-widest border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_#D4AF37]">
            +{finalXp} XP
          </span>
        </div>

        {/* SUBTITLE */}
        {finalTitle && (
          <div className="bg-white dark:bg-[#12100C] p-4 border-2 border-[#D4AF37]/60 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.15)] font-mono text-sm">
            <p className="font-sans text-base leading-relaxed italic text-brand-ink/90 dark:text-amber-100">
              {finalTitle}
            </p>
          </div>
        )}

        {/* INPUT */}
        {!isCompleted ? (
          <div className="space-y-4 font-mono">
            <textarea 
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
              className="w-full p-4 rounded-none bg-white dark:bg-[#12100C] border-2 border-[#D4AF37] text-brand-ink dark:text-slate-100 font-sans focus:outline-none focus:border-yellow-400 shadow-[inset_2px_2px_0px_0px_rgba(0,0,0,0.2)] text-base resize-none"
              placeholder={isLocked ? `Desbloquea el Nivel ${finalLevel} para interactuar` : "Expresa tu respuesta aquí..."}
              disabled={isCompleted || isLocked}
              rows={4}
            />

            <div className="flex justify-end">
              <button
                onClick={handleDecision}
                disabled={isLocked || !textValue.trim()}
                className={cn(
                  "inline-flex items-center gap-3 px-6 py-3 font-mono font-black text-xs uppercase tracking-[0.2em] border-2 border-black transition-all shadow-[3px_3px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
                  !isLocked && textValue.trim()
                    ? "bg-[#D4AF37] text-black hover:bg-yellow-400 cursor-pointer"
                    : "bg-gray-300 text-gray-600 dark:bg-gray-800 dark:text-gray-500 border-gray-700 cursor-not-allowed"
                )}
              >
                <span>▶ {finalButton}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="p-5 bg-emerald-500 text-black border-2 border-black font-mono shadow-[3px_3px_0px_0px_#000] flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={24} className="shrink-0" />
                <div>
                  <span className="font-black text-xs uppercase tracking-widest block">¡DECISIÓN REGISTRADA!</span>
                  <span className="text-xs font-sans">Tu respuesta ha sido guardada y has ganado +{finalXp} XP.</span>
                </div>
              </div>
              <span className="font-black text-sm px-3 py-1 bg-black text-emerald-400 border border-black shrink-0">
                +{finalXp} XP
              </span>
            </div>
            {finalRespuesta && (
              <div className="p-5 bg-amber-50 dark:bg-amber-950/40 border-2 border-[#D4AF37] space-y-3">
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 font-mono font-bold text-xs uppercase tracking-wider">
                  <MessageCircle size={16} />
                  <span>¿Te acercaste a la respuesta?</span>
                </div>
                <div className="font-sans text-sm text-brand-ink dark:text-amber-100 leading-relaxed">
                  {finalRespuesta}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
