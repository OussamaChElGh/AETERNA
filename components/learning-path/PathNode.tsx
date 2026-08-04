'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Lock, Play, Check, BookOpen } from 'lucide-react';
import confetti from 'canvas-confetti';
import { cn } from '@/lib/utils';
import { ConstellationLines } from './ConstellationLines';

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
    osc.connect(gain);
    gain.connect(ctx.destination);
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
  confetti({
    particleCount: 90,
    spread: 80,
    origin: { x: 0.5, y: 0.55 },
    colors,
    ticks: 150,
    gravity: 0.7,
    scalar: 1.1,
    shapes: ['star', 'circle'],
  });
  setTimeout(() => {
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { x: 0.3, y: 0.5 },
      colors,
      ticks: 100,
      gravity: 0.6,
      scalar: 0.8,
    });
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { x: 0.7, y: 0.5 },
      colors,
      ticks: 100,
      gravity: 0.6,
      scalar: 0.8,
    });
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

  const handleClick = (e: React.MouseEvent) => {
    if (completedLayers === 2) {
      fireConfetti(['#D4AF37', '#FDE047', '#22D3EE', '#A855F7', '#FFFFFF']);
      playCompleteSound();
    } else if (isAvailable) {
      fireConfetti(['#22D3EE', '#06B6D4', '#67E8F9']);
    }
  };

  const stateColors = isCompleted
    ? { ring: 'from-amber-400 to-yellow-500', bg: 'bg-amber-500/10', border: 'border-amber-500/60', text: 'text-amber-400', glow: 'animate-node-glow-completed', shadow: 'shadow-[0_0_25px_rgba(245,158,11,0.4)]' }
    : isInProgress
    ? { ring: 'from-emerald-400 to-green-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/60', text: 'text-emerald-400', glow: 'shadow-[0_0_12px_rgba(34,197,94,0.25)]', shadow: '' }
    : isAvailable
    ? { ring: 'from-cyan-400 to-blue-500', bg: 'bg-cyan-500/5', border: 'border-cyan-500/60', text: 'text-cyan-400', glow: 'animate-node-glow', shadow: 'shadow-[0_0_30px_rgba(6,182,212,0.5)]' }
    : { ring: 'from-neutral-600 to-neutral-700', bg: 'bg-neutral-800/30', border: 'border-neutral-700/40', text: 'text-neutral-500', glow: '', shadow: '' };

  const nodeContent = (
    <div className="relative">
      {/* Constellation lines on hover */}
      <ConstellationLines active={hovered && isUnlocked} />

      <div className="relative flex items-center gap-4 px-3 py-2">
        {/* Connector top */}
        {!isFirst && (
          <div className={cn(
            "absolute -top-7 left-7 w-[3px] h-7 -translate-x-1/2 rounded-full transition-colors duration-500",
            isCompleted ? "bg-amber-500/60 shadow-[0_0_8px_rgba(245,158,11,0.3)]" :
            isInProgress ? "bg-emerald-500/40" :
            "bg-neutral-700/30"
          )} />
        )}

        {/* Node circle */}
        <motion.div
          className={cn(
            "relative w-14 h-14 rounded-full flex items-center justify-center shrink-0 transition-all duration-500",
            stateColors.bg, stateColors.border, "border-2",
            stateColors.glow, stateColors.shadow
          )}
          style={{ transformStyle: 'preserve-3d' }}
          whileHover={isUnlocked ? { scale: 1.08, transition: { type: 'spring', stiffness: 400 } } : {}}
        >
          {/* Progress ring SVG */}
          {!isCompleted && isUnlocked && (
            <svg className="absolute inset-0 -rotate-90 w-full h-full" viewBox="0 0 56 56">
              <circle cx="28" cy="28" r="24" fill="none" stroke="currentColor"
                className="text-neutral-700/20" strokeWidth="3" />
              <motion.circle
                cx="28" cy="28" r="24" fill="none" stroke="currentColor"
                strokeWidth="3" strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: progressPercent / 100 }}
                transition={{ duration: 1, ease: 'easeOut' }}
                strokeDasharray={`${2 * Math.PI * 24}`}
                className={cn(isInProgress ? "text-emerald-500" : "text-cyan-500")}
              />
            </svg>
          )}

          {/* Icon */}
          {isCompleted ? (
            <Check size={24} className="text-amber-400" />
          ) : isLocked ? (
            <Lock size={18} className="text-neutral-500" />
          ) : (
            <BookOpen size={22} className={stateColors.text} />
          )}

          {/* Lock overlay */}
          {isLocked && (
            <div className="absolute inset-0 rounded-full bg-neutral-900/70 flex items-center justify-center" />
          )}
        </motion.div>

        {/* Node info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            {isAvailable && (
              <span className="text-[9px] font-mono font-black uppercase tracking-widest text-cyan-400 animate-pulse">
                EMPEZAR
              </span>
            )}
            {isInProgress && (
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                {completedLayers}/3 CAPAS
              </span>
            )}
            {isCompleted && (
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-amber-400">
                COMPLETADO
              </span>
            )}
            {isLocked && (
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-neutral-500">
                BLOQUEADO
              </span>
            )}
          </div>
          <h3 className={cn(
            "font-serif text-sm md:text-base leading-tight transition-colors duration-300",
            isLocked ? "text-neutral-500" : "text-brand-offwhite group-hover:text-white"
          )}>
            {node.title}
          </h3>
          {node.tipo === 'hub' && (
            <span className="text-[8px] font-mono uppercase tracking-widest text-brand-gold/60 mt-0.5 block">
              ● GUÍA MAESTRA
            </span>
          )}
        </div>
      </div>
    </div>
  );

  if (isLocked) {
    return (
      <div className="relative py-5 opacity-40 pointer-events-none select-none">
        {nodeContent}
      </div>
    );
  }

  return (
    <Link
      href={`/guias/ciencias_naturales/fisica/${node.slug}`}
      className="block group"
      onClick={handleClick}
    >
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.06, duration: 0.4 }}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        whileHover={{ x: 6, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
        className={cn(
          "relative py-5 rounded-2xl transition-all duration-300 cursor-pointer perspective-card",
          isAvailable && "hover:bg-cyan-500/5 hover:shadow-[inset_0_0_30px_rgba(6,182,212,0.05)]",
          isInProgress && "hover:bg-emerald-500/5 hover:shadow-[inset_0_0_30px_rgba(34,197,94,0.05)]",
          isCompleted && "hover:bg-amber-500/5 hover:shadow-[inset_0_0_30px_rgba(245,158,11,0.05)]",
          hovered && "bg-white/[0.02]"
        )}
      >
        {nodeContent}
      </motion.div>
    </Link>
  );
}
