'use client';
import React, { useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Flame, Gem, Lock, CheckCircle, BookOpen, Compass, ChevronRight, Star } from 'lucide-react';
import fisicaCurriculum from '@/data/curriculum/fisica.json';
import { useGamification, formatXP } from '@/context/GamificationContext';
import { cn } from '@/lib/utils';

type ArticleJSON = { slug: string; title: string; nivel: number; orden: number; tipo?: string };
const GOLD = '#C5A059';

interface Planet { slug: string; title: string; nivel: number; orden: number; layers: number; completed: boolean; unlocked: boolean; inProgress: boolean; x: number; y: number; orbit: number; }

const ORBIT_RADII = [130, 195, 270, 350];
const ORBIT_COLORS = ['#8B5CF6', '#06B6D4', '#F97316', '#EF4444'];

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

  const rawLevels = useMemo(() => (curriculum.levels || []).map(l => ({
    ...l, nodes: nodes.filter(a => a.nivel === l.nivel)
  })).filter(l => l.nodes.length > 0), [nodes]);

  const planets = useMemo(() => {
    const result: Planet[] = [];
    rawLevels.forEach((lvl, li) => {
      const r = ORBIT_RADII[li] || 350;
      const color = ORBIT_COLORS[li] || GOLD;
      const count = lvl.nodes.length;
      lvl.nodes.forEach((n, ni) => {
        const angle = (ni / count) * Math.PI * 2 - Math.PI / 2 + li * 0.35;
        result.push({ ...n, orbit: li, x: Math.cos(angle) * r, y: Math.sin(angle) * r });
      });
    });
    return result;
  }, [rawLevels]);

  const activeNode = nodes.find(n => !n.completed && n.unlocked) || nodes[nodes.length - 1];
  const doneCount = nodes.filter(n => n.completed).length;

  // Constellation lines: connect consecutive completed nodes
  const lines = useMemo(() => {
    const completed = planets.filter(p => p.completed);
    const result: { x1: number; y1: number; x2: number; y2: number; color: string }[] = [];
    for (let i = 0; i < completed.length - 1; i++) {
      result.push({ x1: completed[i].x, y1: completed[i].y, x2: completed[i+1].x, y2: completed[i+1].y, color: completed[i].completed ? GOLD : 'rgba(197,160,89,0.2)' });
    }
    return result;
  }, [planets]);

  return (
    <div className="min-h-screen font-sans overflow-hidden relative flex flex-col" style={{ background: '#05060D', color: '#E5E5E5' }}>
      {/* Black hole background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Accretion disk glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20 blur-[80px]"
          style={{ background: 'conic-gradient(from 0deg, #8B5CF6, #06B6D4, #C5A059, #F97316, #EF4444, #8B5CF6)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-15 blur-[60px]"
          style={{ background: 'conic-gradient(from 90deg, transparent, #C5A05920, transparent)' }} />
        {/* Event horizon */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full" style={{ background: 'radial-gradient(circle, #0A0D14, #05060D)', boxShadow: '0 0 60px rgba(0,0,0,0.8)' }} />
        {/* Gravitational lensing ring */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border border-[#C5A05910] opacity-30" />
        {/* Stars */}
        {Array.from({ length: 80 }).map((_, i) => (
          <motion.div key={i} className="absolute rounded-full bg-white"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, width: `${Math.random() * 2 + 1}px`, height: `${Math.random() * 2 + 1}px` }}
            animate={{ opacity: [0.1, 0.7, 0.1] }}
            transition={{ duration: 2 + Math.random() * 5, repeat: Infinity, delay: Math.random() * 4 }} />
        ))}
      </div>

      {/* Top bar */}
      <div className="relative z-20 border-b backdrop-blur-xl px-6 h-14 flex items-center justify-between"
        style={{ background: 'rgba(5,6,13,0.85)', borderColor: 'rgba(197,160,89,0.08)' }}>
        <div className="flex items-center gap-3">
          <Compass size={17} style={{ color: GOLD }} />
          <h1 className="font-serif text-sm font-bold tracking-tight">El Sendero del Sabio</h1>
        </div>
        <div className="flex items-center gap-4 text-[11px] font-mono" style={{ color: 'rgba(229,229,229,0.35)' }}>
          <div className="flex items-center gap-1"><Flame size={13} className="text-orange-400" /><span>{dailyStreak}d</span></div>
          <div className="flex items-center gap-1"><Gem size={13} style={{ color: GOLD }} /><span>{formatXP(userXp)}</span></div>
          <span>Nv.{userLevel}</span>
        </div>
      </div>

      {/* Main: orbital map + large card */}
      <div className="flex-1 flex relative z-10">
        {/* Orbital map */}
        <div className="flex-1 relative" style={{ minHeight: 'calc(100vh - 56px)' }}>
          <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" viewBox="-450 -350 900 700">
            {/* Orbit rings */}
            {ORBIT_RADII.map((r, i) => (
              <ellipse key={i} cx={0} cy={0} rx={r} ry={r * 0.5}
                fill="none" stroke={ORBIT_COLORS[i]} strokeWidth="0.4" opacity="0.12" strokeDasharray="6,8" />
            ))}
            {/* Constellation lines */}
            {lines.map((l, i) => (
              <motion.line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
                stroke={l.color} strokeWidth="0.5" opacity="0.3"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, delay: i * 0.1 }} />
            ))}
          </svg>

          {/* Planet nodes */}
          {planets.map((p, i) => {
            const isActive = activeNode?.slug === p.slug;
            const size = isActive ? 44 : p.completed ? 36 : 30;
            const orbitColor = ORBIT_COLORS[p.orbit] || GOLD;
            return (
              <motion.div
                key={p.slug}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04, type: 'spring' }}
                className="absolute z-20"
                style={{ left: `calc(50% + ${p.x}px)`, top: `calc(50% + ${p.y}px)`, transform: 'translate(-50%, -50%)' }}
              >
                <Link href={p.unlocked ? `/guias/ciencias_naturales/fisica/${p.slug}` : '#'}
                  className={cn("block group", !p.unlocked && "pointer-events-none")}>
                  <motion.div whileHover={p.unlocked ? { scale: 1.2 } : {}} className="relative">
                    {/* Glow */}
                    {!p.unlocked ? null : (
                      <div className="absolute inset-0 rounded-full blur-md"
                        style={{ background: `radial-gradient(circle, ${p.completed ? GOLD : orbitColor}40, transparent)`, transform: 'scale(2.5)' }} />
                    )}
                    {/* Planet */}
                    <div className="relative rounded-full border-2 flex items-center justify-center transition-all"
                      style={{
                        width: size, height: size,
                        borderColor: p.completed ? GOLD : p.inProgress ? '#34D399' : p.unlocked ? orbitColor : 'rgba(255,255,255,0.08)',
                        background: p.completed ? `radial-gradient(circle at 30% 30%, ${GOLD}30, transparent)` : 'rgba(255,255,255,0.02)',
                        opacity: p.unlocked ? 1 : 0.3,
                        boxShadow: isActive ? `0 0 24px ${orbitColor}50` : p.completed ? `0 0 12px ${GOLD}30` : 'none',
                      }}>
                      {p.completed ? <CheckCircle size={Math.max(12, size/3)} style={{ color: GOLD }} /> :
                       p.unlocked ? <BookOpen size={Math.max(10, size/3.5)} style={{ color: orbitColor }} /> :
                       <Lock size={10} style={{ color: 'rgba(255,255,255,0.12)' }} />}
                    </div>
                    {/* Label */}
                    <div className="absolute top-full mt-1.5 left-1/2 -translate-x-1/2 text-center">
                      <span className="text-[8px] font-mono font-bold whitespace-nowrap block truncate max-w-[80px]"
                        style={{ color: p.unlocked ? (isActive ? '#E5E5E5' : 'rgba(229,229,229,0.35)') : 'rgba(255,255,255,0.08)' }}>
                        {p.title}
                      </span>
                      {p.unlocked && (
                        <div className="flex gap-0.5 justify-center mt-0.5">
                          {[0,1,2].map(j => <div key={j} className="w-1 h-1 rounded-full" style={{ background: j < p.layers ? GOLD : 'rgba(255,255,255,0.05)' }} />)}
                        </div>
                      )}
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Large immersive card for active node */}
        <div className="w-[380px] shrink-0 flex items-center p-6">
          {activeNode && (
            <motion.div
              key={activeNode.slug}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              <div className="relative rounded-2xl overflow-hidden" style={{ background: 'rgba(10,13,20,0.9)', backdropFilter: 'blur(24px)', border: '1px solid rgba(197,160,89,0.15)' }}>
                {/* Card glow */}
                <div className="absolute top-0 right-0 w-48 h-48 opacity-[0.06]" style={{ background: `radial-gradient(circle, ${GOLD}, transparent)` }} />

                <div className="relative p-8">
                  {/* Level badge */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: ORBIT_COLORS[activeNode.nivel - 1] || GOLD }} />
                    <span className="text-[9px] font-mono font-black uppercase tracking-[0.3em]" style={{ color: 'rgba(197,160,89,0.5)' }}>
                      Nivel {activeNode.nivel}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="font-serif text-2xl font-bold mb-3 leading-tight">{activeNode.title}</h2>

                  {/* Progress bar */}
                  {activeNode.inProgress && (
                    <div className="mb-5">
                      <div className="flex justify-between text-[9px] font-mono mb-1.5" style={{ color: 'rgba(229,229,229,0.25)' }}>
                        <span>Capas dominadas</span><span>{activeNode.layers}/3</span>
                      </div>
                      <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
                        <motion.div className="h-full rounded-full" style={{ background: `linear-gradient(to right, ${GOLD}, #D4AF37)` }}
                          initial={{ width: 0 }} animate={{ width: `${(activeNode.layers/3)*100}%` }} transition={{ duration: 0.8 }} />
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  <p className="text-sm leading-relaxed mb-6" style={{ color: 'rgba(229,229,229,0.35)' }}>
                    {activeNode.completed
                      ? 'Has completado las 3 capas de este conocimiento. El emblema dorado es tuyo.'
                      : activeNode.inProgress
                      ? `Llevas ${activeNode.layers} de 3 capas. Continúa profundizando en este tema para desbloquear el siguiente nodo.`
                      : 'Comienza tu viaje en esta lección. Tres capas de profundidad te esperan.'}
                  </p>

                  {/* CTA */}
                  <Link href={`/guias/ciencias_naturales/fisica/${activeNode.slug}`}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all hover:scale-[1.02]"
                    style={{ background: `rgba(197,160,89,0.12)`, color: GOLD, border: `1px solid rgba(197,160,89,0.2)` }}>
                    {activeNode.completed ? 'Repasar' : activeNode.inProgress ? 'Continuar' : 'Empezar'}
                    <ChevronRight size={14} />
                  </Link>

                  {/* Stats row */}
                  <div className="flex items-center justify-center gap-8 mt-5 pt-4 border-t" style={{ borderColor: 'rgba(197,160,89,0.06)' }}>
                    <div className="text-center">
                      <div className="font-mono font-black text-sm" style={{ color: GOLD }}>{doneCount}</div>
                      <div className="text-[8px] font-mono uppercase tracking-[0.2em] mt-0.5" style={{ color: 'rgba(229,229,229,0.2)' }}>Emblemas</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center gap-1"><Flame size={12} className="text-orange-400" /><span className="font-mono font-black text-sm text-orange-400">{dailyStreak}</span></div>
                      <div className="text-[8px] font-mono uppercase tracking-[0.2em] mt-0.5" style={{ color: 'rgba(229,229,229,0.2)' }}>Racha</div>
                    </div>
                    <div className="text-center">
                      <div className="font-mono font-black text-sm" style={{ color: GOLD }}>{userLevel}</div>
                      <div className="text-[8px] font-mono uppercase tracking-[0.2em] mt-0.5" style={{ color: 'rgba(229,229,229,0.2)' }}>Nivel</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Bottom thin bar */}
      <div className="relative z-20 border-t px-6 py-2" style={{ background: 'rgba(5,6,13,0.9)', borderColor: 'rgba(197,160,89,0.06)' }}>
        <div className="flex items-center justify-between max-w-full">
          <span className="text-[8px] font-mono uppercase tracking-[0.3em]" style={{ color: 'rgba(229,229,229,0.15)' }}>
            {doneCount}/{nodes.length} emblemas
          </span>
          <div className="flex items-center gap-4">
            {ORBIT_RADII.map((_, i) => {
              const lvl = rawLevels[i];
              if (!lvl) return null;
              const done = lvl.nodes.filter(n => n.completed).length;
              const pct = lvl.nodes.length > 0 ? (done / lvl.nodes.length) * 100 : 0;
              return (
                <div key={i} className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: pct >= 100 ? GOLD : ORBIT_COLORS[i] }} />
                  <span className="text-[7px] font-mono uppercase tracking-wider" style={{ color: 'rgba(229,229,229,0.2)' }}>{lvl.titulo}</span>
                  <div className="w-10 h-[2px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <motion.div className="h-full rounded-full" style={{ background: ORBIT_COLORS[i] || GOLD }}
                      initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
