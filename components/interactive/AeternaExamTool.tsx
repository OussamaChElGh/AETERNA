'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, Trophy, CheckCircle2, ChevronRight, XCircle, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGamification } from '@/context/GamificationContext';

export interface ExamQuestion {
  id: string;
  question: string;
  options: string[];
  correctOption: number;
}

interface AeternaExamToolProps {
  levelNum: number;
  levelTitle: string;
  badgeName: string;
  categoryName: string;
  stepId?: string;
  questions?: ExamQuestion[];
  xpReward?: number;
}

const DEFAULT_QUESTIONS: ExamQuestion[] = [
  {
    id: 'q1',
    question: '¿Cuál es el principal objetivo de este nivel de conocimiento?',
    options: [
      'Alcanzar la comprensión superficial',
      'Integrar los fundamentos conceptuales y prácticos',
      'Evitar la lectura profunda',
      'Memorizar sin reflexionar'
    ],
    correctOption: 1
  },
  {
    id: 'q2',
    question: 'Según los principios aprendidos, ¿qué actitud es la más adecuada frente a lo desconocido?',
    options: [
      'Ignorarlo sistemáticamente',
      'Miedo irracional',
      'Cuestionamiento racional y curiosidad',
      'Crear dogmas absolutos'
    ],
    correctOption: 2
  },
  {
    id: 'q3',
    question: '¿Qué representa la insignia de este nivel?',
    options: [
      'La asimilación de los preceptos críticos',
      'Un mero adorno estético',
      'Un certificado de finalización sin valor',
      'La negación de la teoría'
    ],
    correctOption: 0
  }
];

export function AeternaExamTool({ 
  levelNum, 
  levelTitle, 
  badgeName, 
  categoryName,
  stepId,
  questions = DEFAULT_QUESTIONS,
  xpReward = 200
}: AeternaExamToolProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const { addXP, progress, unlockAchievement } = useGamification();
  const achievementId = stepId
    ? `level_badge_${categoryName}_${stepId}_${levelNum}`.toLowerCase().replace(/\s+/g, '_')
    : `level_badge_${categoryName}_${levelNum}`.toLowerCase().replace(/\s+/g, '_');
  const isAlreadyUnlocked = progress.achievements.includes(achievementId);

  // If we already passed it, maybe we don't need to show it, or we show it but no XP
  
  const handleSelect = (idx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    
    setTimeout(() => {
      const isCorrect = idx === questions[currentQIndex].correctOption;
      setAnswers([...answers, isCorrect]);
      setShowResult(true);
      
      setTimeout(() => {
        if (currentQIndex < questions.length - 1) {
          setCurrentQIndex(currentQIndex + 1);
          setSelectedOption(null);
          setShowResult(false);
        } else {
          setIsFinished(true);
          // Evaluate pass/fail
          const correctCount = answers.filter(a => a).length + (isCorrect ? 1 : 0);
          const passed = correctCount >= Math.ceil(questions.length * 0.7); // 70% to pass
          
          if (passed && !isAlreadyUnlocked) {
            const ratio = correctCount / questions.length;
            addXP(Math.round(xpReward * ratio), `Examen Nivel ${levelNum} (${levelTitle}) completado`);
            // To successfully see the achievement in UI, maybe we just dispatch an event or mutate ACHIEVEMENTS logic.
            // Since ACHIEVEMENTS is a constant, we'll manually addXP and just give the ID, let the Gamification system handle it if possible.
            // We can also trigger a custom notification for the badge.
            setTimeout(() => {
                const event = new CustomEvent('aeterna-notification', { detail: { 
                  type: 'achievement', 
                  title: `Insignia Obtenida: ${badgeName}`, 
                  message: `Has demostrado dominio en ${levelTitle}.`,
                  points: 0
                } });
                window.dispatchEvent(event);
                unlockAchievement(achievementId);
            }, 1000);
          }
        }
      }, 1500);
    }, 500);
  };

  const currentQ = questions[currentQIndex];
  const correctCount = answers.filter(a => a).length;
  const passed = isFinished && correctCount >= Math.ceil(questions.length * 0.7);

  const restart = () => {
    setCurrentQIndex(0);
    setSelectedOption(null);
    setAnswers([]);
    setIsFinished(false);
    setShowResult(false);
  };

  if (!isOpen) {
    if (isAlreadyUnlocked) {
      return (
        <div className="bg-brand-ink/50 border border-brand-border/50 p-6 flex flex-col sm:flex-row items-center justify-between gap-6 transition-all hover:bg-brand-ink/80 hover:border-brand-gold/30 group">
          <div className="flex items-center gap-4 text-left">
             <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
               <Trophy className="w-5 h-5 text-emerald-500" />
             </div>
             <div>
               <h4 className="font-serif text-xl text-white mb-1">Dominio de {levelTitle} Alcanzado</h4>
               <p className="text-[11px] font-sans text-brand-muted uppercase tracking-widest">
                 Insignia Obtenida: {badgeName}
               </p>
             </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 text-[9px] font-bold uppercase tracking-[0.3em] rounded-sm border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" /> Completado
          </div>
        </div>
      );
    }

    return (
      <div className="bg-brand-ink border flex flex-col items-center justify-center border-brand-border p-12 text-center relative overflow-hidden group shadow-2xl">
        <div className="absolute inset-0 bg-brand-gold/5 pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-brand-gold/10 rounded-full blur-[100px] pointer-events-none" />
        
        <Brain className="w-16 h-16 text-brand-gold mx-auto mb-6 relative z-10" />
        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand-gold mb-4 block relative z-10">
          Prueba de Dominio
        </span>
        <h3 className="font-serif text-3xl md:text-4xl text-white mb-4 relative z-10">
          Evaluación: {levelTitle}
        </h3>
        <p className="text-brand-muted max-w-xl mx-auto font-sans font-light leading-relaxed relative z-10 mb-8">
          Demuestra tu asimilación de los conocimientos de <em>{levelTitle}</em> y desbloquea la insignia <strong>{badgeName}</strong>.
        </p>
        
        <button 
          onClick={() => setIsOpen(true)}
          className="px-10 py-5 bg-brand-gold text-brand-ink text-[11px] font-sans font-bold uppercase tracking-[0.4em] hover:bg-white hover:text-brand-ink transition-all shadow-[0_0_30px_rgba(212,175,55,0.2)] relative z-10"
        >
          Iniciar Evaluación
        </button>
      </div>
    );
  }

  return (
    <div className="bg-brand-ink border border-brand-border text-brand-offwhite relative overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-brand-border bg-black/20">
        <div className="flex items-center gap-4">
          <Brain className="w-6 h-6 text-brand-gold" />
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand-gold">
            Evaluación / Nivel {levelNum}
          </span>
        </div>
        <div className="flex gap-1">
          {questions.map((_, i) => (
             <div 
               key={i} 
               className={cn(
                 "w-8 h-1 transition-colors",
                 i < currentQIndex ? (answers[i] ? "bg-emerald-500" : "bg-red-500") : 
                 i === currentQIndex ? "bg-brand-gold animate-pulse" : "bg-brand-muted/20"
               )} 
             />
          ))}
        </div>
      </div>

      <div className="p-8 md:p-12 min-h-[400px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {!isFinished ? (
            <motion.div 
              key={currentQIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full max-w-2xl mx-auto"
            >
              <h4 className="font-serif text-2xl md:text-3xl mb-12 text-center text-white">
                {currentQ.question}
              </h4>

              <div className="grid gap-4">
                {currentQ.options.map((opt, i) => {
                  const isSelected = selectedOption === i;
                  const isCorrectAnswer = i === currentQ.correctOption;
                  const showAsCorrect = showResult && isCorrectAnswer;
                  const showAsWrong = showResult && isSelected && !isCorrectAnswer;

                  return (
                    <button
                      key={i}
                      disabled={selectedOption !== null}
                      onClick={() => handleSelect(i)}
                      className={cn(
                        "p-6 text-left border transition-all flex items-center justify-between group text-sm md:text-base font-sans leading-relaxed",
                        selectedOption === null 
                          ? "border-brand-border/50 hover:border-brand-gold hover:bg-brand-gold/5 bg-transparent text-white/80" 
                          : showAsCorrect 
                            ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
                            : showAsWrong
                              ? "border-red-500/50 bg-red-500/10 text-red-400"
                              : "border-brand-border/20 bg-transparent text-white/30 opacity-50"
                      )}
                    >
                       <span>{opt}</span>
                       {showResult && isCorrectAnswer && <CheckCircle2 className="w-5 h-5 text-emerald-500 ml-4 shrink-0" />}
                       {showResult && showAsWrong && <XCircle className="w-5 h-5 text-red-500 ml-4 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-xl mx-auto text-center"
            >
              {passed ? (
                <>
                  <Trophy className="w-24 h-24 text-brand-gold mx-auto mb-8 drop-shadow-[0_0_30px_rgba(212,175,55,0.5)]" />
                  <h3 className="font-serif text-4xl text-white mb-4">La Prueba ha sido Superada</h3>
                  <p className="text-brand-muted mb-12">
                    Has respondido correctamente {correctCount} de {questions.length} preguntas. 
                    La insignia <strong>{badgeName}</strong> es ahora tuya.
                  </p>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="px-10 py-5 bg-brand-gold text-brand-ink text-[11px] font-sans font-bold uppercase tracking-[0.4em] hover:bg-white hover:text-brand-ink transition-all"
                  >
                    Volver a la Ruta
                  </button>
                </>
              ) : (
                <>
                  <XCircle className="w-24 h-24 text-red-500 mx-auto mb-8 opacity-80" />
                  <h3 className="font-serif text-4xl text-white mb-4">Insuficiente</h3>
                  <p className="text-brand-muted mb-12">
                    Solo respondiste correctamente {correctCount} de {questions.length} preguntas. 
                    El conocimiento requiere reflexión. Vuelve a intentarlo cuando estés listo.
                  </p>
                  <div className="flex justify-center gap-4">
                    <button 
                      onClick={restart}
                      className="px-8 py-4 bg-brand-ink border border-brand-border text-brand-offwhite text-[10px] font-sans font-bold uppercase tracking-[0.4em] hover:bg-brand-gold hover:text-brand-ink hover:border-brand-gold transition-all flex items-center gap-3"
                    >
                      <RotateCcw className="w-4 h-4" /> Reintentar
                    </button>
                    <button 
                      onClick={() => setIsOpen(false)}
                      className="px-8 py-4 bg-transparent border border-transparent text-brand-muted text-[10px] font-sans font-bold uppercase tracking-[0.4em] hover:text-white transition-all flex items-center gap-3"
                    >
                      Cerrar
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
