'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { CheckCircle2, Trophy, ShieldCheck, Zap, BrainCircuit, Activity } from 'lucide-react';
import { useGamification } from '@/context/GamificationContext';
import { cn } from '@/lib/utils';
import { useExerciseFeedback } from '@/lib/useExerciseFeedback';

interface AeternaProps {
  content: string;
  onResult?: (correct: boolean) => void;
}

export function AeternaInteractiveQuestion({ content, onResult }: AeternaProps) {
  const { markQuestionAnswered, hasAnsweredQuestion } = useGamification();
  const { feedbackRef, trigger, fxClass } = useExerciseFeedback();

  // --- Parsing robusto ---
  const lines = content.split('\n');
  let questionText = '';
  let parsedOptions: string[] = [];
  let correctAnswerText = '';
  let xp = 50;
  let tipoText = 'VALIDACIÓN';
  let parsingMode: 'none' | 'question' | 'options' = 'none';

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith('Tipo:')) {
      tipoText = trimmed.replace('Tipo:', '').trim();
      parsingMode = 'none';
    } else if (trimmed.startsWith('Pregunta:')) {
      questionText = trimmed.replace('Pregunta:', '').trim();
      parsingMode = 'question';
    } else if (trimmed.startsWith('Opciones:')) {
      parsingMode = 'options';
    } else if (trimmed.startsWith('RespuestaCorrecta:')) {
      correctAnswerText = trimmed.replace('RespuestaCorrecta:', '').trim();
      parsingMode = 'none';
    } else if (trimmed.startsWith('XP:')) {
      xp = parseInt(trimmed.replace('XP:', '').trim()) || 50;
      parsingMode = 'none';
    } else if (parsingMode === 'question') {
      // Las líneas siguientes pertenecen a la pregunta (si no empieza por "-")
      if (!trimmed.startsWith('-')) {
        questionText += ' ' + trimmed;
      }
    } else if (parsingMode === 'options' && trimmed.startsWith('-')) {
      parsedOptions.push(trimmed.replace(/^-\s*/, '').trim());
    }
  }

  // Limpiar artefactos de emoji del tipo
  tipoText = tipoText.replace(/^[^\w\s]+\s*/, '').trim() || 'VALIDACIÓN';

  const questionId = btoa(encodeURIComponent(questionText.substring(0, 80))).substring(0, 32);
  const isPreviouslyAnswered = hasAnsweredQuestion(questionId);
  const correctIndex = parsedOptions.findIndex(opt => opt === correctAnswerText);

  const [selected, setSelected] = useState<number | null>(null);
  const [status, setStatus] = useState<"idle" | "correct" | "incorrect">(isPreviouslyAnswered ? "correct" : "idle");

  const handleSelect = (index: number) => {
    if (status !== "idle" || isPreviouslyAnswered) return;
    setSelected(index);
    const isCorrect = index === correctIndex;
    setStatus(isCorrect ? "correct" : "incorrect");
    if (onResult) onResult(isCorrect);
    if (isCorrect) {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#8B6914', '#D4AF37', '#FDFBF7', '#1A1A1A']
      });
      markQuestionAnswered(questionId, xp, `Aeterna Quiz: ${tipoText}`);
      trigger('correct', questionId, xp);
    } else {
      trigger('wrong', questionId);
    }
  };

  return (
    <div ref={feedbackRef} className="not-prose my-14 mx-auto max-w-3xl relative" style={{ all: 'revert', fontFamily: 'inherit' }}>
      <div className="not-prose my-14 mx-auto max-w-3xl relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className={cn(
            "relative overflow-hidden rounded-none border-4 transition-all duration-700 shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#D4AF37]",
            fxClass,
            status === 'idle'
              ? "bg-[#FAF6EC] dark:bg-[#1A1712] border-[#d4af37]"
              : status === 'correct'
              ? "bg-[#FAF6EC] dark:bg-[#1A1712] border-emerald-500"
              : "bg-[#FAF6EC] dark:bg-[#1A1712] border-rose-600"
          )}
        >
          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37]/60 to-transparent" />

          {/* Subtle background texture */}
          <div className="absolute inset-0 opacity-[0.015] pointer-events-none bg-[radial-gradient(#8B6914_1px,transparent_1px)] bg-[size:24px_24px]" />

          {/* Header */}
          <div className="relative z-10 flex items-center justify-between px-7 pt-7 pb-5 border-b-4 border-[#D4AF37]/30">
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-10 h-10 rounded-none flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_0px_#000] transition-all duration-700",
                status === 'correct'
                  ? "bg-emerald-500 text-white"
                  : "bg-[#D4AF37] text-black"
              )}>
                {status === 'correct'
                  ? <ShieldCheck className="text-white w-5 h-5" />
                  : <Activity className="text-black w-5 h-5 animate-pulse" />
                }
              </div>
              <div>
                <span className="text-[9px] font-mono font-bold uppercase tracking-[0.35em] text-[#8B6914] dark:text-[#D4AF37] block">
                  {tipoText}
                </span>
                <span className="text-[8px] font-mono text-neutral-400 dark:text-neutral-600 tracking-wider">
                  CÁMARA DE VERIFICACIÓN
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-black text-[#D4AF37] dark:bg-white dark:text-black border-2 border-black dark:border-white px-4 py-2 rounded-none shadow-[2px_2px_0px_0px_#D4AF37]">
              <Trophy className="w-3.5 h-3.5 text-[#D4AF37] dark:text-black" />
              <span className="text-[11px] font-mono font-black">+{xp} XP</span>
            </div>
          </div>

          {/* Question */}
          <div className="relative z-10 px-7 py-7">
            <div className="flex gap-4 mb-7">
              <div className="w-[3px] rounded-none bg-gradient-to-b from-[#D4AF37] via-[#8B6914]/50 to-transparent shrink-0 mt-1" />
              <h3 className="font-mono text-[17px] md:text-[19px] font-bold uppercase text-neutral-800 dark:text-neutral-100 leading-snug tracking-tight">
                {questionText}
              </h3>
            </div>

            {/* Options */}
            <div className="flex flex-col gap-3">
              {parsedOptions.map((option, idx) => {
                const isSelected = selected === idx;
                const isCorrectOpt = idx === correctIndex;
                const showSuccess = status !== 'idle' && isCorrectOpt;
                const showError = isSelected && status === 'incorrect';
                const isGrayed = status !== 'idle' && !showSuccess && !showError;

                return (
                  <button
                    key={idx}
                    disabled={status !== 'idle'}
                    onClick={() => handleSelect(idx)}
                    className={cn(
                      "w-full group relative flex items-center gap-4 px-5 py-4 rounded-none border-2 transition-all duration-400 text-left cursor-pointer",
                      status === 'idle'
                        ? "bg-white dark:bg-[#1A1A1E] border-black/8 dark:border-white/6 hover:border-[#D4AF37]/60 dark:hover:border-[#D4AF37]/40 hover:bg-[#FFFDF5] dark:hover:bg-[#1E1C14] hover:translate-x-1 shadow-sm hover:shadow-md"
                        : "cursor-default",
                      showSuccess ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-400/50 dark:border-emerald-600/30 translate-x-2 shadow-md" : "",
                      showError ? "bg-rose-50 dark:bg-rose-950/20 border-rose-400/50 dark:border-rose-600/30" : "",
                      isGrayed ? "opacity-25 saturate-0" : ""
                    )}
                  >
                    {/* Letter badge */}
                    <div className={cn(
                      "w-7 h-7 rounded-none flex items-center justify-center font-mono text-[11px] font-bold shrink-0 border-2 transition-all duration-500",
                      showSuccess
                        ? "bg-emerald-500 text-white border-emerald-500 shadow"
                        : showError
                        ? "bg-rose-500 text-white border-rose-500"
                        : "bg-neutral-100 dark:bg-[#252528] text-neutral-400 dark:text-neutral-500 border-black/5 dark:border-white/5 group-hover:bg-[#D4AF37] group-hover:text-[#1A1A1A] group-hover:border-[#D4AF37]"
                    )}>
                      {String.fromCharCode(65 + idx)}
                    </div>

                    {/* Option text */}
                    <span className={cn(
                      "flex-1 text-[14px] md:text-[15px] leading-snug font-sans",
                      showSuccess
                        ? "text-emerald-800 dark:text-emerald-300 font-semibold"
                        : showError
                        ? "text-rose-700 dark:text-rose-300"
                        : "text-neutral-700 dark:text-neutral-300 font-normal"
                    )}>
                      {option}
                    </span>

                    {showSuccess && (
                      <motion.div
                        initial={{ scale: 0, rotate: -30 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="shrink-0 bg-emerald-500 rounded-full p-1 shadow"
                      >
                        <CheckCircle2 className="text-white w-3.5 h-3.5" />
                      </motion.div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status footer */}
          <AnimatePresence>
            {status !== 'idle' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className={cn(
                  "relative z-10 border-t px-7 py-5 flex items-center justify-between",
                  status === 'correct'
                    ? "border-emerald-200/50 dark:border-emerald-800/30 bg-emerald-50/40 dark:bg-emerald-950/10"
                    : "border-rose-200/50 dark:border-rose-800/30 bg-rose-50/40 dark:bg-rose-950/10"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-2.5 h-2.5 rounded-full",
                    status === 'correct' ? "bg-emerald-500 animate-pulse shadow-sm shadow-emerald-500/50" : "bg-rose-500"
                  )} />
                  <div>
                    <p className="text-[11px] font-mono font-bold uppercase tracking-[0.5em] text-neutral-700 dark:text-neutral-300">
                      {status === 'correct' ? 'Sincronización Exitosa' : 'Error de Integridad'}
                    </p>
                    <p className="text-[9px] font-mono text-neutral-400 dark:text-neutral-600 tracking-wider mt-0.5">
                      {status === 'correct'
                        ? 'La gnosis ha sido asimilada permanentemente.'
                        : 'Reintenta seleccionando la opción correcta.'}
                    </p>
                  </div>
                </div>

                {status === 'correct' && (
                  <div className="flex items-center gap-2 bg-white dark:bg-[#1E1E22] border border-emerald-200 dark:border-emerald-800/40 px-4 py-2 rounded-full shadow-sm">
                    <BrainCircuit size={14} className="text-emerald-600 dark:text-emerald-400" />
                    <span className="text-[9px] font-mono font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-[0.4em]">Trascendido</span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
