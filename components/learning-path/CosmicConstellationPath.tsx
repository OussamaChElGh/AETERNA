'use client';
import React, { useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Flame, Gem, Lock, CheckCircle, BookOpen, Circle, Star, Compass } from 'lucide-react';
import fisicaCurriculum from '@/data/curriculum/fisica.json';
import { useGamification, formatXP } from '@/context/GamificationContext';
import { cn } from '@/lib/utils';

type ArticleJSON = { slug: string; title: string; nivel: number; orden: number; tipo?: string };

const GOLD = '#C5A059';
const CHARCOAL = '#121212';
const CREAM = '#E5E5E5';

export default function CosmicConstellationPath() {
  const { progress } = useGamification();
  const completedPaths = progress.completedPaths || [];
  const completedLayers = progress.completedLayers || {};
  const dailyStreak = progress.dailyStreak || 0;
  const userLevel = progress.level || 1;
  const userXp = progress.xp || 0;

  const curriculum = fisicaCurriculum as { levels?: { nivel: number; titulo: string; descripcion: string }[]; articles?: ArticleJSON[] };

  const articles = useMemo(() => [...(curriculum.articles || [])].sort((a, b) => a.nivel - b.nivel || a.orden - b.orden), []);

  const nodes = useMemo(() => {
    let prevDone = true;
    return articles.map((a, i) => {
      const lyrs = completedLayers[a.slug]?.length || 0;
      const done = completedPaths.includes(a.slug) || lyrs >= 3;
      const open = i === 0 || prevDone;
      if (done) prevDone = true; else prevDone = false;
      return { ...a, layers: lyrs, completed: done, unlocked: open, inProgress: lyrs > 0 && lyrs < 3 };
    });
  }, [articles, completedPaths, completedLayers]);

  const levels = useMemo(() => (curriculum.levels || []).map(l => ({
    ...l, nodes: nodes.filter(a => a.nivel === l.nivel)
  })).filter(l => l.nodes.length > 0), [nodes]);

  const doneCount = nodes.filter(n => n.completed).length;

  return (
    <div className="min-h-screen font-sans" style={{ background: CHARCOAL, color: CREAM }}>
      {/* Subtle nebula */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-[0.06] blur-[120px]" style={{ background: 'radial-gradient(circle, #8B5CF6, transparent)' }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-[0.05] blur-[100px]" style={{ background: 'radial-gradient(circle, #06B6D4, transparent)' }} />
      </div>

      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b backdrop-blur-md" style={{ background: 'rgba(18,18,18,0.85)', borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Compass size={18} style={{ color: GOLD }} />
            <h1 className="font-serif text-base font-bold tracking-tight">El Sendero del Sabio</h1>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <div className="flex items-center gap-1" style={{ color: 'rgba(229,229,229,0.4)' }}>
              <Flame size={13} className="text-orange-400" />
              <span>{dailyStreak}</span>
            </div>
            <div className="flex items-center gap-1" style={{ color: 'rgba(229,229,229,0.4)' }}>
              <Gem size={13} style={{ color: GOLD }} />
              <span>{formatXP(userXp)} XP</span>
            </div>
            <span style={{ color: 'rgba(229,229,229,0.2)' }}>·</span>
            <span style={{ color: 'rgba(229,229,229,0.4)' }}>Nv.{userLevel}</span>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-10 relative z-10">
        {/* Title */}
        <div className="mb-10">
          <span className="text-[9px] font-mono font-black uppercase tracking-[0.4em]" style={{ color: 'rgba(197,160,89,0.5)' }}>Camino de Física</span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold mt-2 mb-2">Explora el Universo</h2>
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(229,229,229,0.4)' }}>
            Cada lección tiene 3 capas de profundidad. Domínalas para avanzar.
          </p>
        </div>

        {/* Levels */}
        <div className="space-y-12">
          {levels.map(lvl => {
            const lvlDone = lvl.nodes.filter(n => n.completed).length;
            const allDone = lvlDone >= lvl.nodes.length;
            const progPct = lvl.nodes.length > 0 ? Math.round((lvlDone / lvl.nodes.length) * 100) : 0;
            const colors: Record<number, string> = { 1: '#8B5CF6', 2: '#06B6D4', 3: '#F97316', 4: '#EF4444' };
            const accent = colors[lvl.nivel] || GOLD;

            return (
              <div key={lvl.nivel}>
                {/* Level header */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: accent }} />
                  <span className="text-[9px] font-mono font-black uppercase tracking-[0.3em]" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    Nivel {lvl.nivel}
                  </span>
                  <span className="text-[8px] font-mono ml-auto" style={{ color: 'rgba(255,255,255,0.15)' }}>
                    {lvlDone}/{lvl.nodes.length}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="h-[2px] rounded-full mb-5" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <motion.div className="h-full rounded-full transition-all duration-700" style={{ width: `${progPct}%`, background: allDone ? GOLD : accent }} />
                </div>

                {/* Node cards */}
                <div className="space-y-2">
                  {lvl.nodes.map((node, ni) => (
                    <Link key={node.slug} href={node.unlocked ? `/guias/ciencias_naturales/fisica/${node.slug}` : '#'}
                      className={cn("block group", !node.unlocked && "pointer-events-none")}>
                      <motion.div
                        initial={{ opacity: 0, x: -16 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: ni * 0.06 }}
                        whileHover={node.unlocked ? { x: 6 } : {}}
                        className="flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200"
                        style={{
                          background: node.unlocked ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.005)',
                          opacity: node.unlocked ? 1 : 0.3,
                        }}
                      >
                        {/* Status circle */}
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 transition-all duration-300"
                          style={{
                            borderColor: node.completed ? GOLD : node.inProgress ? '#34D399' : node.unlocked ? accent : 'rgba(255,255,255,0.08)',
                            background: node.completed ? `radial-gradient(circle, ${GOLD}20, transparent)` : 'transparent',
                            boxShadow: node.completed ? `0 0 12px ${GOLD}30` : 'none',
                          }}
                        >
                          {node.completed ? <CheckCircle size={18} style={{ color: GOLD }} /> :
                           node.unlocked ? <Circle size={18} style={{ color: accent+'80' }} /> :
                           <Lock size={14} style={{ color: 'rgba(255,255,255,0.1)' }} />}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-serif text-sm font-bold leading-tight" style={{ color: node.unlocked ? CREAM : 'rgba(229,229,229,0.2)' }}>
                            {node.title}
                          </h3>
                          {node.unlocked && (
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex gap-0.5">
                                {[0, 1, 2].map(i => (
                                  <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: i < node.layers ? GOLD : 'rgba(255,255,255,0.06)' }} />
                                ))}
                              </div>
                              <span className="text-[9px] font-mono" style={{ color: 'rgba(229,229,229,0.25)' }}>
                                {node.completed ? 'Completado' : node.inProgress ? `${node.layers}/3 capas` : '3 capas'}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Arrow */}
                        {node.unlocked && (
                          <motion.div
                            animate={{ x: [0, 3, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            style={{ color: 'rgba(197,160,89,0.3)' }}
                          >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                          </motion.div>
                        )}
                      </motion.div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer stats */}
        <div className="mt-16 pt-8 border-t text-center" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <div className="flex items-center justify-center gap-2 text-[10px] font-mono" style={{ color: 'rgba(229,229,229,0.3)' }}>
            <Star size={12} style={{ color: GOLD }} />
            <span>{doneCount} de {nodes.length} emblemas obtenidos</span>
          </div>
        </div>
      </div>
    </div>
  );
}
