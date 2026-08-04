'use client';
import React, { useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Star, ChevronRight, Telescope, Atom, Globe, Zap, Sparkles } from 'lucide-react';
import fisicaCurriculum from '@/data/curriculum/fisica.json';
import { useGamification } from '@/context/GamificationContext';
import { FlameStreak } from './FlameStreak';
import { cn } from '@/lib/utils';

interface ArticleJSON { slug: string; title: string; nivel: number; orden: number; tipo?: string; }

interface PlanetNode {
  slug: string; title: string; nivel: number; orden: number;
  x: number; y: number; orbit: number; angle: number;
  completed: boolean; inProgress: boolean; locked: boolean; layers: number;
  icon: React.ReactNode;
}

const PLANET_ICONS = [<Star key="s" size={14} />, <Atom key="a" size={14} />, <Globe key="g" size={14} />, <Telescope key="t" size={14} />, <Zap key="z" size={14} />];
const LEVEL_COLORS: Record<number, { glow: string; line: string; card: string; dot: string }> = {
  1: { glow: 'rgba(139,92,246,0.6)', line: 'rgba(139,92,246,0.3)', card: 'from-violet-500/20 to-purple-900/30', dot: '#A78BFA' },
  2: { glow: 'rgba(6,182,212,0.6)', line: 'rgba(6,182,212,0.3)', card: 'from-cyan-500/20 to-blue-900/30', dot: '#22D3EE' },
  3: { glow: 'rgba(249,115,22,0.6)', line: 'rgba(249,115,22,0.3)', card: 'from-orange-500/20 to-amber-900/30', dot: '#FB923C' },
  4: { glow: 'rgba(244,63,94,0.6)', line: 'rgba(244,63,94,0.3)', card: 'from-rose-500/20 to-red-900/30', dot: '#FB7185' },
};

export function CosmicConstellationPath() {
  const { progress } = useGamification();
  const completedPaths = progress.completedPaths || [];
  const completedLayers = progress.completedLayers || {};
  const dailyStreak = progress.dailyStreak || 0;

  const curriculum = fisicaCurriculum as { levels?: { nivel: number; titulo: string; descripcion: string }[]; articles?: ArticleJSON[] };

  const allNodes = useMemo(() => {
    const articles = [...(curriculum.articles || [])].sort((a, b) => a.nivel - b.nivel || a.orden - b.orden);
    let prevCompleted = true;
    return articles.map((art, idx) => {
      const layers = completedLayers[art.slug]?.length || 0;
      const isCompleted = completedPaths.includes(art.slug) || layers >= 3;
      const isUnlocked = idx === 0 || prevCompleted;
      if (isCompleted) prevCompleted = true; else prevCompleted = false;
      return { ...art, layers, completed: isCompleted, inProgress: layers > 0 && layers < 3, locked: !isUnlocked };
    });
  }, []);

  const levels = useMemo(() => (curriculum.levels || []).map(l => ({
    ...l, articles: allNodes.filter(a => a.nivel === l.nivel) })).filter(l => l.articles.length > 0),
  [allNodes]);

  // Position nodes in constellation orbits
  const planets = useMemo(() => {
    const nodes: PlanetNode[] = [];
    levels.forEach((lvl, li) => {
      const radius = 140 + li * 100;
      const count = lvl.articles.length;
      const startAngle = li * 0.3;
      lvl.articles.forEach((art, ai) => {
        const angle = startAngle + (ai / count) * Math.PI * 1.4;
        nodes.push({
          slug: art.slug, title: art.title, nivel: art.nivel, orden: art.orden,
          orbit: li, angle,
          x: 50 + Math.cos(angle) * radius,
          y: 45 + Math.sin(angle) * radius - li * 8,
          completed: art.completed,
          inProgress: art.inProgress,
          locked: art.locked,
          layers: art.layers,
          icon: PLANET_ICONS[ai % PLANET_ICONS.length],
        });
      });
    });
    return nodes;
  }, [levels]);

  const completedCount = allNodes.filter(n => n.completed).length;

  // Draw constellation lines between consecutive completed nodes
  const constellationLines = useMemo(() => {
    const lines: { x1: number; y1: number; x2: number; y2: number; color: string }[] = [];
    for (let i = 0; i < planets.length - 1; i++) {
      if (!planets[i].completed) continue;
      const next = planets.slice(i + 1).find(p => p.completed);
      if (next) {
        const lvl = LEVEL_COLORS[planets[i].nivel] || LEVEL_COLORS[1];
        lines.push({ x1: planets[i].x, y1: planets[i].y, x2: next.x, y2: next.y, color: lvl.dot });
      }
    }
    return lines;
  }, [planets]);

  // Find current active node
  const activeNode = planets.find(p => !p.completed && !p.locked) || planets[planets.length - 1];

  return (
    <div className="min-h-screen bg-[#06080D] font-sans relative overflow-hidden">
      {/* Nebula background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-1/4 w-[600px] h-[600px] rounded-full bg-violet-500/8 blur-[120px]" />
        <div className="absolute bottom-20 right-1/4 w-[500px] h-[500px] rounded-full bg-cyan-500/6 blur-[100px]" />
        <div className="absolute top-1/3 right-1/3 w-[400px] h-[400px] rounded-full bg-amber-500/4 blur-[80px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#06080D_80%)]" />
        {/* Star dots */}
        {Array.from({ length: 40 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-[1.5px] h-[1.5px] rounded-full bg-white"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
            animate={{ opacity: [0.2, 0.7, 0.2] }}
            transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 3 }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#06080D]/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-violet-400" />
              <h1 className="font-sans text-lg font-bold tracking-tight bg-gradient-to-r from-violet-400 via-cyan-400 to-amber-400 bg-clip-text text-transparent">
                El Sendero del Sabio
              </h1>
            </div>
            <span className="text-[9px] font-mono font-bold text-white/20 uppercase tracking-[0.3em]">COSMIC EDITION</span>
          </div>
          <div className="flex items-center gap-3">
            <FlameStreak streak={dailyStreak} />
            <span className="text-[10px] font-mono font-bold text-white/30">{completedCount}/{allNodes.length} nodos</span>
          </div>
        </div>
      </div>

      {/* Constellation Map */}
      <div className="max-w-7xl mx-auto px-6 py-8 flex">
        {/* Left: constellation canvas */}
        <div className="flex-1 relative min-h-[650px]">
          {/* SVG constellation lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 100 100" preserveAspectRatio="none">
            {constellationLines.map((line, i) => (
              <motion.line
                key={i}
                x1={`${line.x1}%`} y1={`${line.y1}%`}
                x2={`${line.x2}%`} y2={`${line.y2}%`}
                stroke={line.color}
                strokeWidth="0.3"
                strokeDasharray="2,4"
                opacity={0.4}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: i * 0.2 }}
              />
            ))}
          </svg>

          {/* Planet nodes */}
          {planets.map((planet, idx) => {
            const lvl = LEVEL_COLORS[planet.nivel] || LEVEL_COLORS[1];
            const isActive = activeNode?.slug === planet.slug;
            const size = isActive ? 48 : planet.completed ? 36 : planet.locked ? 28 : 40;
            const nodeSize = Math.max(28, size);

            return (
              <motion.div
                key={planet.slug}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.06, type: 'spring' }}
                className="absolute z-10"
                style={{ left: `${planet.x}%`, top: `${planet.y}%`, transform: 'translate(-50%, -50%)' }}
              >
                <Link href={planet.locked ? '#' : `/guias/ciencias_naturales/fisica/${planet.slug}`}>
                  <motion.div
                    whileHover={!planet.locked ? { scale: 1.15 } : {}}
                    className={cn(
                      "relative flex items-center justify-center rounded-full transition-all cursor-pointer",
                      planet.completed && "cursor-pointer",
                      planet.locked && "cursor-not-allowed"
                    )}
                    style={{ width: nodeSize, height: nodeSize }}
                  >
                    {/* Glow halo */}
                    {!planet.locked && (
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        style={{ background: `radial-gradient(circle, ${lvl.glow} 0%, transparent 70%)` }}
                        animate={{ opacity: isActive ? [0.4, 0.8, 0.4] : 0.3, scale: isActive ? [1, 1.3, 1] : 1 }}
                        transition={{ duration: 3, repeat: Infinity }}
                      />
                    )}

                    {/* Planet core */}
                    <div
                      className={cn(
                        "relative rounded-full flex items-center justify-center z-10 border-2",
                        planet.completed ? "bg-amber-500/20 border-amber-500/40" :
                        planet.inProgress ? "bg-emerald-500/10 border-emerald-500/40" :
                        !planet.locked ? "bg-cyan-500/10 border-cyan-500/40" :
                        "bg-neutral-800/30 border-neutral-700/30"
                      )}
                      style={{ width: nodeSize - 8, height: nodeSize - 8 }}
                    >
                      {/* Progress arc for in-progress */}
                      {planet.inProgress && (
                        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 32 32">
                          <circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" className="text-white/5" strokeWidth="2" />
                          <circle cx="16" cy="16" r="14" fill="none" stroke="#34D399" strokeWidth="2" strokeLinecap="round"
                            strokeDasharray={`${2 * Math.PI * 14}`}
                            strokeDashoffset={`${2 * Math.PI * 14 * (1 - planet.layers / 3)}`}
                          />
                        </svg>
                      )}
                      {planet.locked ? (
                        <div className="w-1.5 h-1.5 rounded-full bg-neutral-600" />
                      ) : planet.completed ? (
                        <Star size={14} className="text-amber-400" />
                      ) : (
                        <div className="text-white/60">{planet.icon}</div>
                      )}
                    </div>

                    {/* Label */}
                    <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap">
                      <span className={cn(
                        "text-[9px] font-mono font-bold tracking-wider block text-center max-w-[120px] truncate",
                        planet.completed ? "text-amber-400/70" :
                        planet.locked ? "text-white/10" :
                        isActive ? "text-white/80" : "text-white/40"
                      )}>
                        {planet.title}
                      </span>
                      {!planet.locked && (
                        <span className={cn("text-[7px] font-mono block text-center mt-0.5",
                          planet.completed ? "text-amber-400/40" : "text-white/20"
                        )}>
                          {planet.completed ? '✦' : `${planet.layers}/3`}
                        </span>
                      )}
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Right: immersive card for current node */}
        <div className="w-[340px] shrink-0 ml-6">
          {activeNode && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              key={activeNode.slug}
              className="sticky top-24"
            >
              <div className="relative">
                {/* Glow */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-cyan-500/20 to-violet-500/10 blur-2xl" />

                <div className="relative rounded-2xl border border-white/[0.06] bg-[#0A0D14]/90 backdrop-blur-xl p-6">
                  {/* Level badge */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    <span className="text-[9px] font-mono font-black uppercase tracking-[0.3em] text-cyan-400/70">
                      NIVEL {activeNode.nivel}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="font-sans text-xl font-bold text-white mb-2 leading-tight">
                    {activeNode.title}
                  </h2>

                  {/* Progress bar */}
                  {activeNode.inProgress && (
                    <div className="mb-4">
                      <div className="flex justify-between text-[9px] font-mono text-white/30 mb-1.5">
                        <span>Progreso de capas</span>
                        <span>{activeNode.layers}/3</span>
                      </div>
                      <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-violet-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${(activeNode.layers / 3) * 100}%` }}
                          transition={{ duration: 1 }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  <p className="text-xs text-white/40 leading-relaxed mb-4 font-serif">
                    {activeNode.locked
                      ? 'Completa el nodo anterior para desbloquear esta lección.'
                      : activeNode.completed
                      ? 'Has dominado las 3 capas de este conocimiento.'
                      : activeNode.inProgress
                      ? 'Continúa explorando las capas restantes de este tema.'
                      : 'Comienza tu viaje en esta lección del Sendero del Sabio.'}
                  </p>

                  {/* Action button */}
                  <Link
                    href={activeNode.locked ? '#' : `/guias/ciencias_naturales/fisica/${activeNode.slug}`}
                    className={cn(
                      "flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all",
                      activeNode.locked
                        ? "bg-white/5 text-white/20 cursor-not-allowed"
                        : "bg-white/[0.06] border border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20"
                    )}
                  >
                    {activeNode.locked ? 'BLOQUEADO' : activeNode.completed ? 'REPASAR' : activeNode.inProgress ? 'CONTINUAR' : 'EMPEZAR'}
                    <ChevronRight size={14} />
                  </Link>
                </div>
              </div>

              {/* Section hint */}
              <div className="mt-4 text-center">
                <span className="text-[9px] font-mono text-white/15 uppercase tracking-[0.4em]">
                  {levels.find(l => l.nivel === activeNode.nivel)?.titulo || ''}
                </span>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Bottom stats bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-[#06080D]/90 backdrop-blur-xl border-t border-white/5 px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-8">
          {levels.map(lvl => {
            const done = allNodes.filter(n => n.nivel === lvl.nivel && n.completed).length;
            const total = allNodes.filter(n => n.nivel === lvl.nivel).length;
            const pct = total > 0 ? Math.round((done / total) * 100) : 0;
            const lvlColors = LEVEL_COLORS[lvl.nivel] || LEVEL_COLORS[1];
            return (
              <div key={lvl.nivel} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: lvlColors.dot }} />
                <span className="text-[9px] font-mono font-bold text-white/30 uppercase">{lvl.titulo}</span>
                <div className="w-16 h-1 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: lvlColors.dot }} />
                </div>
                <span className="text-[9px] font-mono text-white/20">{done}/{total}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
