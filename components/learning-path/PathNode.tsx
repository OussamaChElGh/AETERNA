'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Lock, Play, Check, BookOpen } from 'lucide-react';
import confetti from 'canvas-confetti';
import { cn } from '@/lib/utils';
import { CurvedLine } from './CurvedLine';

export interface PathNodeData {
  slug: string;
  title: string;
  nivel: number;
  orden: number;
  tipo?: string;
  completedLayers: number;
  isUnlocked: boolean;
}

interface PathNodeProps {
  node: PathNodeData;
  isFirst: boolean;
  isLast: boolean;
  index: number;
}

function playCompleteSound() {
  if (typeof window === 'undefined') return;
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.connect(gain); gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(523.25, ctx.currentTime);
    osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
    osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.6);
  } catch {}
}

function fireConfetti(colors: string[]) {
  confetti({ particleCount: 90, spread: 80, origin: { x: 0.5, y: 0.55 }, colors, ticks: 150, gravity: 0.7, scalar: 1.1, shapes: ['star', 'circle'] });
  setTimeout(() => {
    confetti({ particleCount: 40, spread: 50, origin: { x: 0.3, y: 0.5 }, colors, ticks: 100, gravity: 0.6, scalar: 0.8 });
    confetti({ particleCount: 40, spread: 50, origin: { x: 0.7, y: 0.5 }, colors, ticks: 100, gravity: 0.6, scalar: 0.8 });
  }, 200);
}

export function PathNode({ node, isFirst, isLast, index }: PathNodeProps) {
  const [hovered, setHovered] = useState(false);
  const { completedLayers, isUnlocked } = node;
  const isCompleted = completedLayers >= 3;
  const isInProgress = completedLayers > 0 && completedLayers < 3;
  const isAvailable = isUnlocked && completedLayers === 0;
  const isLocked = !isUnlocked;
  const progressPercent = Math.round((completedLayers / 3) * 100);

  const handleClick = () => {
    if (completedLayers === 2) { fireConfetti(['#D4AF37', '#FDE047', '#22D3EE', '#A855F7', '#FFFFFF']); playCompleteSound(); }
    else if (isAvailable) { fireConfetti(['#22D3EE', '#06B6D4', '#67E8F9']); }
  };

  const lineColor = isCompleted ? '#F59E0B' : isInProgress ? '#34D399' : isAvailable ? '#22D3EE' : '#3F3F46';
  const lineVariant = isCompleted ? 'glow' : isAvailable ? 'glow' : 'solid';

  const nodeContent = (
    <div className="relative">
      {/* Top connector curve */}
      {!isFirst && (
        <div className="absolute -top-8 left-0 w-16 h-8">
          <CurvedLine fromY={0} toY={32} startX={28} color={lineColor} thickness={2} variant={lineVariant} />
        </div>
      )}

      <div className="flex items-center gap-3 px-3 py-2">
        <motion.div
          className={cn(
            "relative w-[52px] h-[52px] rounded-full flex items-center justify-center shrink-0 transition-all duration-500 border-2",
            isCompleted ? "border-amber-500/60 bg-amber-500/10 shadow-[0_0_20px_rgba(245,158,11,0.35)]" :
            isInProgress ? "border-emerald-500/60 bg-emerald-500/10 shadow-[0_0_10px_rgba(34,197,94,0.2)]" :
            isAvailable ? "border-cyan-500/60 bg-cyan-500/5 shadow-[0_0_25px_rgba(6,182,212,0.4)] animate-node-glow" :
            "border-neutral-700/40 bg-neutral-800/30",
          )}
          style={{ transformStyle: 'preserve-3d' }}
          whileHover={isUnlocked ? { scale: 1.1, rotateY: -3, transition: { type: 'spring', stiffness: 400 } } : {}}
        >
          {!isCompleted && isUnlocked && (
            <svg className="absolute inset-0 -rotate-90 w-full h-full" viewBox="0 0 52 52">
              <circle cx="26" cy="26" r="22" fill="none" stroke="currentColor" className="text-neutral-700/20" strokeWidth="2.5" />
              <motion.circle cx="26" cy="26" r="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: progressPercent / 100 }}
                transition={{ duration: 1, ease: 'easeOut' }}
                strokeDasharray={`${2 * Math.PI * 22}`}
                className={cn(isInProgress ? "text-emerald-500" : "text-cyan-500")}
              />
            </svg>
          )}
          {isCompleted ? <Check size={20} className="text-amber-400" /> :
           isLocked ? <Lock size={16} className="text-neutral-500" /> :
           <BookOpen size={18} className={cn(isAvailable && "text-cyan-400", isInProgress && "text-emerald-400")} />}
          {isLocked && <div className="absolute inset-0 rounded-full bg-neutral-900/70" />}
        </motion.div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            {isAvailable && <span className="text-[9px] font-mono font-black uppercase tracking-widest text-cyan-400 animate-pulse">EMPEZAR</span>}
            {isInProgress && <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-emerald-400">{completedLayers}/3 CAPAS</span>}
            {isCompleted && <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-amber-400">COMPLETADO</span>}
            {isLocked && <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-neutral-500">BLOQUEADO</span>}
          </div>
          <h3 className={cn("font-serif text-sm md:text-base leading-tight transition-colors", isLocked ? "text-neutral-500" : hovered ? "text-white" : "text-brand-offwhite")}>{node.title}</h3>
          {node.tipo === 'hub' && <span className="text-[7px] font-mono uppercase tracking-widest text-brand-gold/60 mt-0.5 block">● GUÍA MAESTRA</span>}
        </div>
      </div>
    </div>
  );

  if (isLocked) return <div className="relative py-4 opacity-35 pointer-events-none select-none">{nodeContent}</div>;

  return (
    <Link href={`/guias/ciencias_naturales/fisica/${node.slug}`} className="block group" onClick={handleClick}>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.05, duration: 0.35 }}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        whileHover={{ x: 4 }}
        className={cn(
          "relative rounded-2xl transition-all duration-300 cursor-pointer",
          isAvailable && "hover:bg-cyan-500/[0.04]",
          isInProgress && "hover:bg-emerald-500/[0.04]",
          isCompleted && "hover:bg-amber-500/[0.04]",
        )}
      >
        {nodeContent}
      </motion.div>
    </Link>
  );
}
