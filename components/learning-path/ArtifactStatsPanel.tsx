'use client';
import React from 'react';
import { motion } from 'motion/react';
import { Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

const GOLD = '#C5A059';
const CHARCOAL = '#121212';
const CREAM = '#E5E5E5';
const PARCHMENT = '#F2E8CF';

interface ArtifactStatsPanelProps {
  xp: number;
  level: number;
  dailyStreak: number;
  relicsCount: number;
  totalRelics: number;
  layersDone: number;
  totalLayers: number;
  emblemsDone: number;
  totalEmblems: number;
  xpProgress: number; // 0-1
}

export function ArtifactStatsPanel({
  xp, level, dailyStreak,
  relicsCount, totalRelics,
  layersDone, totalLayers,
  emblemsDone, totalEmblems,
  xpProgress,
}: ArtifactStatsPanelProps) {
  const circ = 2 * Math.PI * 70;

  return (
    <div className="relative p-[2px]" style={{ background: `linear-gradient(135deg, ${GOLD}40, ${GOLD}10)` }}>
      <div className="relative p-8" style={{ background: CHARCOAL }}>
        {/* Corner filigree */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 -translate-x-1 -translate-y-1" style={{ borderColor: GOLD }} />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 -translate-y-1 translate-x-1" style={{ borderColor: GOLD }} />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 translate-y-1 -translate-x-1" style={{ borderColor: GOLD }} />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 translate-y-1 translate-x-1" style={{ borderColor: GOLD }} />

        {/* Title */}
        <h3 className="font-serif text-2xl uppercase tracking-widest text-center mb-8" style={{ color: GOLD }}>Tu Sabiduría</h3>

        {/* Streak Scroll */}
        <div className="relative p-4 mb-8 overflow-hidden" style={{ background: PARCHMENT, border: '1px solid #D4C4A8' }}>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-tighter" style={{ color: '#8B7355' }}>Racha Actual</span>
              <p className="text-3xl font-serif leading-tight" style={{ color: CHARCOAL }}>{dailyStreak} Días</p>
            </div>
            <motion.div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: GOLD, boxShadow: `0 0 20px ${GOLD}60` }}
              animate={{ scale: dailyStreak >= 5 ? [1, 1.05, 1] : 1 }}
              transition={{ duration: 0.5, repeat: dailyStreak >= 5 ? Infinity : 0 }}
            >
              <Flame size={28} style={{ color: CHARCOAL }} />
            </motion.div>
          </div>
          {/* Parchment texture overlay */}
          <div className="absolute inset-0 opacity-10 pointer-events-none"
            style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(139,115,85,0.3) 1px, rgba(139,115,85,0.3) 2px)' }} />
        </div>

        {/* Level Progress Circle */}
        <div className="flex flex-col items-center py-6">
          <div className="relative w-40 h-40 flex items-center justify-center">
            <svg className="absolute w-full h-full -rotate-90">
              <circle cx="80" cy="80" r="70" stroke="#1A1A1A" strokeWidth="8" fill="transparent" />
              <motion.circle
                cx="80" cy="80" r="70" stroke={GOLD} strokeWidth="8" fill="transparent"
                strokeLinecap="round"
                initial={{ strokeDashoffset: circ }}
                animate={{ strokeDashoffset: circ * (1 - xpProgress) }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                strokeDasharray={circ}
                style={{ filter: `drop-shadow(0 0 8px ${GOLD})` }}
              />
            </svg>
            <div className="text-center z-10">
              <span className="text-5xl font-serif block" style={{ color: CREAM }}>{level}</span>
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold mt-1 block" style={{ color: GOLD }}>Nivel de Sabio</span>
            </div>
          </div>
        </div>

        {/* Mini stat cards */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Reliquias', value: `${relicsCount} / ${totalRelics}` },
            { label: 'Capas', value: `${layersDone} / ${totalLayers}` },
            { label: 'Emblemas', value: `${emblemsDone} / ${totalEmblems}` },
          ].map((stat, i) => (
            <motion.div
              key={i}
              whileHover={{ borderColor: GOLD }}
              className="border p-4 text-center transition-colors group"
              style={{ borderColor: '#333' }}
            >
              <span className="text-[10px] uppercase tracking-widest block mb-1 group-hover:text-[#C5A059] transition-colors" style={{ color: '#888' }}>
                {stat.label}
              </span>
              <span className="text-xl font-serif" style={{ color: CREAM }}>{stat.value}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
