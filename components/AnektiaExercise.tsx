'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Target, ShieldCheck, Lightbulb, CheckCircle2, MessageCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { cn } from '@/lib/utils';
import 'katex/dist/katex.min.css';
import { useGamification } from '@/context/GamificationContext';

interface AnektiaExerciseProps {
  content: string;
}

export function AnektiaExercise({ content }: AnektiaExerciseProps) {
  const { markQuestionAnswered, hasAnsweredQuestion } = useGamification();
  const [answerContent, setAnswerContent] = useState("");
  const [showHint, setShowHint] = useState(false);
  
  // Parsing: TITLE, HINT, XP, and Content
  const lines = content.split('\n');
  let label = "Ejercicio de Aplicación";
  let textBody = "";
  let pista = "";
  let solucion = "";
  let xp = 50;

  lines.forEach(line => {
    if (line.startsWith('TITLE:')) label = line.replace('TITLE:', '').trim();
    else if (line.startsWith('HINT:')) pista = line.replace('HINT:', '').trim();
    else if (line.startsWith('SOLUTION:')) solucion = line.replace('SOLUTION:', '').trim();
    else if (line.startsWith('XP:')) xp = parseInt(line.replace('XP:', '').trim()) || 50;
    else if (line.trim() && !line.startsWith('TITLE:') && !line.startsWith('HINT:') && !line.startsWith('XP:') && !line.startsWith('SOLUTION:')) {
      textBody += line + '\n';
    }
  });

  const exerciseId = btoa(encodeURIComponent(textBody.substring(0, 50))).substring(0, 32);
  const isCompleted = hasAnsweredQuestion(exerciseId);

  const handleCheckAnswer = () => {
    if (isCompleted || !answerContent.trim()) return;
    markQuestionAnswered(exerciseId, xp, `Ejercicio: ${label}`);
  };

  const markdownComponents = {
    p: ({ children }: any) => <p className="mb-4 text-brand-ink dark:text-slate-100 leading-relaxed font-sans font-normal text-base md:text-lg">{children}</p>,
    code: ({ children }: any) => <code className="bg-[#D4AF37]/20 text-[#8B6914] dark:text-[#D4AF37] px-2 py-0.5 font-mono text-sm border border-[#D4AF37]/40">{children}</code>
  };

  return (
    <div className="not-prose my-12 mx-auto max-w-4xl relative">
      {/* CLEAN PIXEL RPG QUEST CARD */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className={cn(
          "rounded-none bg-[#FAF6EC] dark:bg-[#1A1712] border-4 border-[#D4AF37] p-6 md:p-8 transition-all duration-300 relative space-y-6 shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#D4AF37]",
          isCompleted && "border-emerald-500 shadow-[6px_6px_0px_0px_#10B981]"
        )}
      >
        {/* HEADER: EMBLEM, TITLE & XP */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b-4 border-[#D4AF37]/40 pb-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-11 h-11 rounded-full bg-[#D4AF37] border-2 border-black flex items-center justify-center text-black shrink-0 shadow-[2px_2px_0px_0px_#000]",
              isCompleted && "bg-emerald-500 text-black"
            )}>
              {isCompleted ? <ShieldCheck size={22} /> : <Target size={22} />}
            </div>
            <div>
              <span className="text-[10px] font-mono font-black uppercase tracking-[0.25em] text-[#8B6914] dark:text-[#D4AF37] block">
                [MISIÓN PRÁCTICA]
              </span>
              <h3 className="font-serif text-xl md:text-2xl font-bold text-brand-ink dark:text-white leading-tight">
                {label}
              </h3>
            </div>
          </div>

          <span className="px-3 py-1 bg-black text-[#D4AF37] dark:bg-white dark:text-black font-mono font-bold text-[11px] uppercase tracking-widest border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_#D4AF37]">
            +{xp} XP
          </span>
        </div>

        {/* QUEST BODY */}
        <div className="bg-white dark:bg-[#12100C] p-5 border-2 border-[#D4AF37]/60 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.15)]">
          <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]} components={markdownComponents}>
            {textBody}
          </ReactMarkdown>
        </div>

        {/* ACTION AREA */}
        <div className="space-y-4 font-mono">
          {!isCompleted ? (
            <div className="space-y-4">
              <textarea 
                value={answerContent}
                onChange={(e) => setAnswerContent(e.target.value)}
                placeholder="Escribe tu respuesta aquí..."
                rows={3}
                className="w-full p-4 rounded-none bg-white dark:bg-[#12100C] border-2 border-[#D4AF37] text-brand-ink dark:text-slate-100 font-sans focus:outline-none focus:border-yellow-400 shadow-[inset_2px_2px_0px_0px_rgba(0,0,0,0.2)] text-base"
              />

              <div className="flex flex-wrap items-center justify-between gap-3">
                {pista && (
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="inline-flex items-center gap-2 px-3.5 py-2 bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 font-mono font-bold text-xs uppercase border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px]"
                  >
                    <Lightbulb size={14} />
                    <span>{showHint ? "Ocultar Pista" : "Ver Pista"}</span>
                  </button>
                )}

                <button
                  onClick={handleCheckAnswer}
                  disabled={!answerContent.trim()}
                  className={cn(
                    "ml-auto inline-flex items-center gap-3 px-6 py-3 font-mono font-black text-xs uppercase tracking-[0.2em] border-2 border-black transition-all shadow-[3px_3px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
                    answerContent.trim()
                      ? "bg-[#D4AF37] text-black hover:bg-yellow-400 cursor-pointer"
                      : "bg-gray-300 text-gray-600 dark:bg-gray-800 dark:text-gray-500 border-gray-700 cursor-not-allowed"
                  )}
                >
                  <span>▶ VERIFICAR RESPUESTA</span>
                </button>
              </div>

              <AnimatePresence>
                {showHint && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 bg-amber-50 dark:bg-amber-950/40 border-2 border-[#D4AF37] text-amber-900 dark:text-amber-200 text-xs font-mono"
                  >
                    <span className="font-bold block mb-1">💡 PISTA:</span>
                    <p className="font-sans text-sm">{pista}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="p-5 bg-emerald-500 text-black border-2 border-black font-mono shadow-[3px_3px_0px_0px_#000] flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={24} className="shrink-0" />
                  <div>
                    <span className="font-black text-xs uppercase tracking-widest block">¡MISIÓN COMPLETADA!</span>
                    <span className="text-xs font-sans">Has registrado esta experiencia y ganado +{xp} XP.</span>
                  </div>
                </div>
                <span className="font-black text-sm px-3 py-1 bg-black text-emerald-400 border border-black shrink-0">
                  +{xp} XP
                </span>
              </div>
              {solucion && (
                <div className="p-5 bg-amber-50 dark:bg-amber-950/40 border-2 border-[#D4AF37] space-y-3">
                  <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 font-mono font-bold text-xs uppercase tracking-wider">
                    <MessageCircle size={16} />
                    <span>¿Te acercaste a la respuesta?</span>
                  </div>
                  <div className="font-sans text-sm text-brand-ink dark:text-amber-100 leading-relaxed">
                    {solucion}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
