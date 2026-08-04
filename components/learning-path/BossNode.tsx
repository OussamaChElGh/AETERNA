'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Swords, Lock, CheckCircle, XCircle, Zap, Star } from 'lucide-react';
import confetti from 'canvas-confetti';
import { cn } from '@/lib/utils';
import { CurvedLine } from './CurvedLine';

interface BossNodeProps { nivel: number; title: string; question: string; options: string[]; correctIndex: number; isAvailable: boolean; isCompleted: boolean; xpReward: number; }

export function BossNode({ nivel, title, question, options, correctIndex, isAvailable, isCompleted, xpReward }: BossNodeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [result, setResult] = useState<boolean | null>(null);

  const lineColor = isCompleted ? '#F59E0B' : isAvailable ? '#F97316' : '#3F3F46';

  const handleOpen = () => { if (!isAvailable || isCompleted) return; setIsOpen(true); setSelected(null); setAnswered(false); setResult(null); };
  const handleAnswer = (idx: number) => {
    if (answered) return; setSelected(idx); setAnswered(true);
    const correct = idx === correctIndex; setResult(correct);
    if (correct) confetti({ particleCount: 200, spread: 120, origin: { x: 0.5, y: 0.5 }, colors: ['#D4AF37', '#FDE047', '#F97316', '#FFFFFF', '#A855F7'], ticks: 200 });
  };

  return (
    <>
      <div className="relative py-4">
        {/* Top curved connector */}
        <div className="absolute -top-5 left-0 w-16 h-6">
          <CurvedLine fromY={0} toY={24} startX={28} color={lineColor} thickness={2} variant={isAvailable ? 'glow' : 'solid'} />
        </div>

        <motion.div whileHover={isAvailable && !isCompleted ? { scale: 1.02 } : {}} onClick={handleOpen} className={cn("relative ml-3 p-[2px] rounded-2xl transition-all", isCompleted ? "bg-gradient-to-r from-amber-600 via-orange-500 to-red-500 animate-gradient-shift bg-[length:200%]" : isAvailable ? "bg-gradient-to-r from-orange-600/80 via-red-500/80 to-violet-500/80 cursor-pointer" : "bg-transparent")}>
          <div className={cn("rounded-2xl p-4 transition-all", isCompleted ? "bg-brand-ink shadow-[0_0_25px_rgba(249,115,22,0.2)]" : isAvailable ? "bg-brand-ink hover:bg-brand-ink/90" : "bg-neutral-800/20")}>
            <div className="flex items-center gap-3">
              <motion.div className={cn("w-[52px] h-[52px] rounded-full flex items-center justify-center shrink-0 border-2", isCompleted ? "border-amber-500/40 bg-amber-500/15" : isAvailable ? "border-orange-500/40 bg-orange-500/15" : "border-neutral-700/40 bg-neutral-700/20")}
                animate={isCompleted ? { scale: [1, 1.05, 1] } : isAvailable ? { scale: [1, 1.03, 1] } : {}}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                {isCompleted ? <Star size={22} className="text-amber-400" /> : isAvailable ? <Swords size={22} className="text-orange-400" /> : <Lock size={18} className="text-neutral-500" />}
              </motion.div>
              <div className="flex-1 min-w-0">
                <span className={cn("text-[9px] font-mono font-black uppercase tracking-[0.3em]", isCompleted ? "text-amber-400/80" : isAvailable ? "text-orange-400/80" : "text-neutral-500")}>
                  {isCompleted ? 'JEFE DERROTADO' : isAvailable ? 'DESAFÍO DE NIVEL' : 'JEFE BLOQUEADO'}
                </span>
                <h4 className={cn("font-serif text-sm leading-tight", isCompleted ? "text-amber-300" : isAvailable ? "text-brand-offwhite" : "text-neutral-500")}>{title}</h4>
                <p className="text-[10px] text-brand-offwhite/30 mt-0.5 flex items-center gap-1">
                  {isCompleted ? `+${xpReward} XP` : isAvailable ? `+${xpReward} XP por vencer` : 'Completa todas las guías'} {isAvailable && !isCompleted && <Zap size={10} className="text-orange-400" />}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {isOpen && !isCompleted && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[101] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setIsOpen(false)}>
            <motion.div initial={{ scale: 0.85, y: 40, rotateX: 10 }} animate={{ scale: 1, y: 0, rotateX: 0 }} exit={{ scale: 0.85, y: 40, rotateX: 10 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} onClick={e => e.stopPropagation()} className="w-full max-w-lg">
              <div className="relative p-[3px] rounded-2xl bg-gradient-to-r from-orange-600 via-red-500 to-violet-600 animate-gradient-shift bg-[length:200%]">
                <div className="bg-brand-ink rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4"><div className="w-12 h-12 rounded-full bg-orange-500/15 border-2 border-orange-500/40 flex items-center justify-center"><Swords size={24} className="text-orange-400" /></div><div><span className="text-[9px] font-mono font-black uppercase tracking-[0.3em] text-orange-400/70">JEFE DEL NIVEL {nivel}</span><h3 className="font-serif text-lg font-bold text-brand-offwhite">{title}</h3></div><div className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20"><Zap size={12} className="text-orange-400" /><span className="text-xs font-mono font-bold text-orange-400">+{xpReward} XP</span></div></div>
                  {!answered ? (<><p className="text-sm text-brand-offwhite/80 leading-relaxed mb-5">{question}</p><div className="space-y-2">{options.map((opt, idx) => (<button key={idx} onClick={() => handleAnswer(idx)} className="w-full text-left p-3 rounded-xl border border-white/10 bg-white/[0.02] hover:border-orange-500/40 hover:bg-orange-500/5 transition-all text-sm text-brand-offwhite/70"><div className="flex items-center gap-2"><span className="text-[10px] font-mono font-bold text-brand-offwhite/30 w-5">{String.fromCharCode(65 + idx)}.</span>{opt}</div></button>))}</div></>) : (<div className="text-center py-4"><motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 15 }} className={cn("w-16 h-16 rounded-full border-2 flex items-center justify-center mx-auto mb-4", result ? "bg-emerald-500/15 border-emerald-500/30" : "bg-red-500/15 border-red-500/30")}>{result ? <CheckCircle size={32} className="text-emerald-400" /> : <XCircle size={32} className="text-red-400" />}</motion.div><p className={cn("text-sm font-bold mb-4", result ? "text-emerald-300" : "text-red-300")}>{result ? `¡Correcto! Has derrotado al Jefe del Nivel ${nivel}` : `Incorrecto. Respuesta: ${options[correctIndex]}`}</p>{result && <p className="text-xs text-brand-offwhite/50 mb-4">+{xpReward} XP</p>}<button onClick={() => setIsOpen(false)} className={cn("px-6 py-2 rounded-xl text-xs font-mono font-bold transition-all", result ? "bg-orange-500/20 border border-orange-500/30 text-orange-300" : "bg-white/5 border border-white/10 text-white/50")}>CERRAR</button></div>)}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
