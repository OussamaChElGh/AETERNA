'use client';
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gift, Lock, CheckCircle, XCircle, Sparkles, Home, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { cn } from '@/lib/utils';
import { CurvedLine } from './CurvedLine';
import type { LevelChestData } from '@/data/levelQuests';

interface FurnitureChestProps {
  chest: LevelChestData;
  completedCount: number;
  totalInLevel: number;
  isAlreadyUnlocked: boolean;
}

export function FurnitureChest({ chest, completedCount, totalInLevel, isAlreadyUnlocked }: FurnitureChestProps) {
  const [quizOpen, setQuizOpen] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [results, setResults] = useState<(boolean | null)[]>(() => new Array(chest.questions.length).fill(null));
  const [passed, setPassed] = useState(false);
  const [unlocked, setUnlocked] = useState(isAlreadyUnlocked);

  const canOpen = completedCount >= chest.minArticlesRequired;
  const answered = selectedOption !== null;
  const lineColor = unlocked ? '#22D3EE' : canOpen ? '#22D3EE' : '#3F3F46';

  const handleOpen = () => {
    if (!canOpen || unlocked) return;
    setQuizOpen(true); setCurrentQ(0); setSelectedOption(null);
    setResults(new Array(chest.questions.length).fill(null)); setPassed(false);
  };

  const handleAnswer = (idx: number) => {
    if (answered) return;
    setSelectedOption(idx);
    const correct = idx === chest.questions[currentQ].answer;
    const newResults = [...results];
    newResults[currentQ] = correct;
    setResults(newResults);
    setTimeout(() => {
      if (currentQ < chest.questions.length - 1) { setCurrentQ(prev => prev + 1); setSelectedOption(null); }
      else {
        if (newResults.every(r => r === true)) { setPassed(true); setUnlocked(true); fireChestConfetti(); }
      }
    }, 1000);
  };

  const fireChestConfetti = () => {
    confetti({ particleCount: 120, spread: 90, origin: { x: 0.5, y: 0.5 }, colors: ['#D4AF37', '#FDE047', '#FFFFFF', '#22D3EE', '#A855F7'], ticks: 200, gravity: 0.5, scalar: 1.2, shapes: ['star', 'circle'] });
    setTimeout(() => { confetti({ particleCount: 60, spread: 60, origin: { x: 0.3, y: 0.5 }, colors: ['#D4AF37', '#FFFFFF'] }); confetti({ particleCount: 60, spread: 60, origin: { x: 0.7, y: 0.5 }, colors: ['#FDE047', '#FFFFFF'] }); }, 250);
  };

  const score = results.filter(r => r === true).length;

  return (
    <>
      <div className="relative py-4">
        {/* Top curved connector */}
        <div className="absolute -top-5 left-0 w-16 h-6">
          <CurvedLine fromY={0} toY={24} startX={28} color={lineColor} thickness={2} variant={canOpen ? 'glow' : 'solid'} />
        </div>

        <motion.div
          whileHover={canOpen && !unlocked ? { scale: 1.02 } : {}}
          onClick={handleOpen}
          className={cn(
            "relative ml-3 p-[2px] rounded-2xl transition-all duration-500",
            unlocked ? "bg-gradient-to-r from-cyan-600 via-blue-500 to-violet-500 bg-[length:200%] animate-gradient-shift" :
            canOpen ? "bg-gradient-to-r from-cyan-600/80 via-blue-500/80 to-violet-500/80 cursor-pointer" : "bg-transparent"
          )}
        >
          <div className={cn("rounded-2xl p-4 transition-all", unlocked ? "bg-brand-ink shadow-[0_0_20px_rgba(6,182,212,0.2)]" : canOpen ? "bg-brand-ink hover:bg-brand-ink/90" : "bg-neutral-800/20")}>
            <div className="flex items-center gap-3">
              <motion.div
                className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", unlocked ? "bg-cyan-500/15" : canOpen ? "bg-cyan-500/10" : "bg-neutral-700/20")}
                animate={unlocked ? { scale: [1, 1.05, 1] } : canOpen ? { y: [0, -3, 0] } : {}}
                transition={unlocked ? { repeat: Infinity, duration: 2 } : { repeat: Infinity, duration: 3 }}
              >
                {unlocked ? <ShieldCheck size={22} className="text-cyan-400" /> : canOpen ? <Gift size={22} className="text-cyan-400" /> : <Lock size={16} className="text-neutral-500" />}
              </motion.div>
              <div className="flex-1 min-w-0">
                <span className={cn("text-[9px] font-mono font-black uppercase tracking-[0.3em]", unlocked ? "text-cyan-400/80" : canOpen ? "text-cyan-400/60" : "text-neutral-500")}>
                  {unlocked ? 'MUEBLE OBTENIDO' : canOpen ? 'TOCA PARA ABRIR' : `${chest.minArticlesRequired} GUÍAS NECESARIAS`}
                </span>
                <h4 className={cn("font-serif text-sm leading-tight", unlocked ? "text-cyan-300" : canOpen ? "text-brand-offwhite" : "text-neutral-500")}>{chest.title}</h4>
                <p className="text-[10px] text-brand-offwhite/30 mt-0.5">
                  {unlocked ? `Recompensa: ${chest.furnitureReward.name}` : canOpen ? `${chest.questions.length} preguntas → desbloquear mueble` : `Completa ${chest.minArticlesRequired} guías para desbloquear`}
                </p>
              </div>
              {canOpen && !unlocked && <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}><Sparkles size={14} className="text-cyan-400" /></motion.div>}
            </div>
            {unlocked && (
              <div className="mt-3 pt-3 border-t border-cyan-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center overflow-hidden"><img src={chest.furnitureReward.image} alt={chest.furnitureReward.name} className="w-8 h-8 object-contain" /></div>
                  <div><p className="text-xs font-mono font-bold text-cyan-300">{chest.furnitureReward.name}</p><p className="text-[10px] text-cyan-400/50">Añadido a la Habitación</p></div>
                  <Home size={16} className="text-cyan-400 ml-auto" />
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Quiz Modal */}
      <AnimatePresence>
        {quizOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => passed && setQuizOpen(false)}>
            <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }} onClick={e => e.stopPropagation()} className="w-full max-w-md bg-brand-ink border border-brand-gold/30 rounded-2xl p-6 shadow-[0_0_60px_rgba(212,175,55,0.15)]">
              <div className="flex items-center justify-between mb-4">
                <div><span className="text-[9px] font-mono font-black uppercase tracking-[0.3em] text-cyan-400/70">{chest.title}</span><h3 className="font-serif text-lg font-bold text-brand-offwhite mt-1">{passed ? '¡Cofre Abierto!' : `Pregunta ${currentQ + 1}/${chest.questions.length}`}</h3></div>
                <div className="flex gap-1">{results.map((r, i) => <div key={i} className={cn("w-2 h-2 rounded-full", r === true ? "bg-emerald-500" : r === false ? "bg-red-500" : "bg-neutral-600")} />)}</div>
              </div>
              {!passed ? (<>
                <p className="text-sm text-brand-offwhite/80 leading-relaxed mb-4">{chest.questions[currentQ].q}</p>
                <div className="space-y-2">
                  {chest.questions[currentQ].options.map((opt, idx) => {
                    let cls = "border-white/10 bg-white/[0.02] hover:border-cyan-500/40 hover:bg-cyan-500/5";
                    if (answered) { const correct = idx === chest.questions[currentQ].answer; cls = correct ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-300" : idx === selectedOption ? "border-red-500/60 bg-red-500/10 text-red-300" : "border-white/5 bg-white/[0.01] text-white/20"; }
                    return (<button key={idx} onClick={() => handleAnswer(idx)} disabled={answered} className={cn("w-full text-left p-3 rounded-xl border text-sm text-brand-offwhite/70 transition-all", cls, !answered && "cursor-pointer")}>
                      <div className="flex items-center gap-2"><span className="text-[10px] font-mono font-bold text-brand-offwhite/30 w-5">{String.fromCharCode(65 + idx)}.</span>{opt}{answered && idx === chest.questions[currentQ].answer && <CheckCircle size={14} className="text-emerald-400 ml-auto shrink-0" />}{answered && idx === selectedOption && idx !== chest.questions[currentQ].answer && <XCircle size={14} className="text-red-400 ml-auto shrink-0" />}</div>
                    </button>);
                  })}
                </div>
              </>) : (
                <div className="text-center py-4">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 15 }} className="w-16 h-16 rounded-full bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center mx-auto mb-4"><ShieldCheck size={32} className="text-cyan-400" /></motion.div>
                  <p className="text-sm text-brand-offwhite/70 mb-2">{score}/{chest.questions.length} correctas</p>
                  <div className="flex items-center justify-center gap-2 mb-4"><div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center"><img src={chest.furnitureReward.image} alt="" className="w-7 h-7 object-contain" /></div><div className="text-left"><p className="text-xs font-mono font-bold text-cyan-300">{chest.furnitureReward.name}</p><p className="text-[10px] text-cyan-400/50">Desbloqueado</p></div></div>
                  <button onClick={() => setQuizOpen(false)} className="px-6 py-2 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold hover:bg-cyan-500/30">CERRAR</button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
