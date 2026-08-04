'use client';
import React, { useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, Trophy, Scroll, BookOpen, Lock, CheckCircle, Star, Gem, ChevronRight, Compass, Sparkles, Medal, Crown } from 'lucide-react';
import fisicaCurriculum from '@/data/curriculum/fisica.json';
import relicData from '@/data/relics.json';
import { useGamification, formatXP } from '@/context/GamificationContext';
import { cn } from '@/lib/utils';

type ArticleJSON = { slug: string; title: string; nivel: number; orden: number; tipo?: string };

const GOLD = '#C5A059';
const CHARCOAL = '#121212';
const CREAM = '#E5E5E5';
const SURFACE = '#1A1A1A';

const LEVELS_ORBIT = {
  1: { radius: 120, cx: 0,   cy: 0,   color: '#8B5CF6', label: 'Fundamentos' },
  2: { radius: 200, cx: 100, cy: -30, color: '#06B6D4', label: 'El Reino de lo Clásico' },
  3: { radius: 280, cx: -50, cy: 20, color: '#F97316', label: 'Las Fronteras de la Realidad' },
  4: { radius: 360, cx: 40,  cy: -10, color: '#EF4444', label: 'La Síntesis y el Futuro' },
};

interface PlanetNode { slug: string; title: string; nivel: number; orden: number; layers: number; completed: boolean; unlocked: boolean; inProgress: boolean; x: number; y: number; angle: number; orbit: number; }

function AnimatedFlame({ streak }: { streak: number }) {
  if (streak < 1) return null;
  const glow = Math.min(0.3 + streak * 0.08, 1);
  return (
    <motion.div className="relative inline-flex items-center gap-1" animate={streak >= 5 ? { scale: [1, 1.04, 1] } : {}} transition={{ duration: 0.6, repeat: Infinity }}>
      <div className="absolute inset-0 rounded-full blur-xl" style={{ background: `radial-gradient(circle, rgba(251,146,60,${glow}) 0%, transparent 70%)`, transform: 'scale(2.5)' }} />
      <Flame size={14} className="relative text-orange-400" style={{ filter: `drop-shadow(0 0 ${4 + streak * 1.5}px rgba(251,146,60,0.8))` }} />
      <span className="relative font-mono font-black text-[11px] text-orange-400">{streak}</span>
    </motion.div>
  );
}

export default function CosmicConstellationPath() {
  const { progress } = useGamification();
  const completedPaths = progress.completedPaths || [];
  const completedLayers = progress.completedLayers || {};
  const physicsRelics = progress.physicsRelics || [];
  const achievements = progress.achievements || [];
  const dailyStreak = progress.dailyStreak || 0;
  const userLevel = progress.level || 1;
  const userXp = progress.xp || 0;

  const curriculum = fisicaCurriculum as { levels?: { nivel: number; titulo: string; descripcion: string }[]; articles?: ArticleJSON[] };
  const relics = (relicData as any).relics || [];

  const allArticles = useMemo(() => [...(curriculum.articles || [])].sort((a, b) => a.nivel - b.nivel || a.orden - b.orden), []);
  
  // Level structure from raw curriculum  
  const rawLevels = useMemo(() => (curriculum.levels || []).map(l => ({
    ...l, articles: allArticles.filter(a => a.nivel === l.nivel)
  })).filter(l => l.articles.length > 0), [allArticles]);

  // Node data with progress  
  const nodes = useMemo(() => {
    let prevDone = true;
    return allArticles.map((a, i) => {
      const lyrs = completedLayers[a.slug]?.length || 0;
      const done = completedPaths.includes(a.slug) || lyrs >= 3;
      const open = i === 0 || prevDone;
      if (done) prevDone = true; else prevDone = false;
      return { ...a, layers: lyrs, completed: done, unlocked: open, inProgress: lyrs > 0 && lyrs < 3 };
    });
  }, [allArticles, completedPaths, completedLayers]);

  const activeNode = nodes.find(n => !n.completed && n.unlocked) || nodes[nodes.length - 1];
  const doneCount = nodes.filter(n => n.completed).length;
  const totalLayersDone = nodes.reduce((s, n) => s + n.layers, 0);

  // Position nodes in orbital rings  
  const levels = useMemo(() => rawLevels.map(l => ({
    ...l, articles: nodes.filter(a => a.nivel === l.nivel)
  })), [rawLevels, nodes]);

  const planets = useMemo(() => {
    const result: PlanetNode[] = [];
    levels.forEach((lvl, li) => {
      const cfg = LEVELS_ORBIT[lvl.nivel as keyof typeof LEVELS_ORBIT] || LEVELS_ORBIT[1];
      const count = lvl.articles.length;
      lvl.articles.forEach((art, ai) => {
        const angle = (ai / count) * Math.PI * 2 - Math.PI / 2 + li * 0.4;
        result.push({
          slug: art.slug, title: art.title, nivel: art.nivel, orden: art.orden,
          layers: art.layers, completed: art.completed, unlocked: art.unlocked, inProgress: art.inProgress,
          orbit: li, angle,
          x: cfg.cx + Math.cos(angle) * cfg.radius,
          y: cfg.cy + Math.sin(angle) * cfg.radius,
        });
      });
    });
    return result;
  }, [levels]);

  const circ = 2 * Math.PI * 31;
  const lvlProg = (userXp % 1200) / 1200;

  return (
    <div className="min-h-screen relative overflow-hidden font-sans" style={{ background: CHARCOAL, color: CREAM }}>
      {/* Nebula background — 3 overlapping colored blobs */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[10%] w-[700px] h-[700px] rounded-full opacity-15 blur-[140px]" style={{ background: 'radial-gradient(circle, #8B5CF6, transparent)' }} />
        <div className="absolute top-[30%] right-[5%] w-[600px] h-[600px] rounded-full opacity-10 blur-[120px]" style={{ background: 'radial-gradient(circle, #06B6D4, transparent)' }} />
        <div className="absolute bottom-[-10%] left-[30%] w-[500px] h-[500px] rounded-full opacity-08 blur-[100px]" style={{ background: 'radial-gradient(circle, #F97316, transparent)' }} />
        {/* Starfield dots */}
        {Array.from({ length: 60 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, width: '1.5px', height: '1.5px' }}
            animate={{ opacity: [0.1, 0.6, 0.1] }}
            transition={{ duration: 2 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 3 }}
          />
        ))}
        {/* Parchment lines */}
        <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(197,160,89,0.4) 2px, rgba(197,160,89,0.4) 3px), repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(197,160,89,0.2) 60px, rgba(197,160,89,0.2) 61px)' }} />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b backdrop-blur-xl" style={{ background: 'rgba(18,18,18,0.9)', borderColor: 'rgba(197,160,89,0.1)' }}>
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: `radial-gradient(circle, ${GOLD}22, transparent)` }}>
              <Compass size={16} style={{ color: GOLD }} />
            </div>
            <h1 className="font-serif text-lg font-bold tracking-tight">El Sendero del Sabio</h1>
            <span className="text-[8px] font-mono font-bold uppercase tracking-[0.4em] px-2 py-0.5 rounded-full" style={{ background: 'rgba(197,160,89,0.08)', color: 'rgba(197,160,89,0.6)' }}>COSMIC</span>
          </div>
          <div className="flex items-center gap-4">
            <AnimatedFlame streak={dailyStreak} />
            <div className="flex items-center gap-1.5 text-[11px] font-mono" style={{ color: 'rgba(229,229,229,0.5)' }}>
              <Gem size={12} style={{ color: GOLD }} />
              <span style={{ color: CREAM }}>{formatXP(userXp)} XP</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main: 3 columns = sidebar + constellation + card */}
      <div className="max-w-7xl mx-auto flex gap-6 px-6 py-6 relative z-10">
        
        {/* LEFT: mini sidebar with level dots */}
        <div className="hidden lg:flex flex-col justify-center gap-3 w-12 shrink-0 pt-20">
          {levels.map((lvl, li) => {
            const done = nodes.filter(n => n.nivel === lvl.nivel && n.completed).length;
            const total = nodes.filter(n => n.nivel === lvl.nivel).length;
            const cfg = LEVELS_ORBIT[lvl.nivel as keyof typeof LEVELS_ORBIT];
            const pct = total > 0 ? (done / total) * 100 : 0;
            return (
              <a key={lvl.nivel} href={`#lvl-${lvl.nivel}`} className="flex flex-col items-center gap-1 group">
                <div className="relative">
                  <div className="w-2.5 h-2.5 rounded-full transition-all" style={{ background: done >= total ? GOLD : cfg?.color || '#555' }} />
                  {done >= total && <div className="absolute inset-0 rounded-full animate-ping" style={{ background: GOLD, opacity: 0.3 }} />}
                </div>
                <span className="text-[7px] font-mono font-bold opacity-0 group-hover:opacity-40 transition-opacity text-center w-10 leading-tight" style={{ color: CREAM }}>
                  {Math.round(pct)}%
                </span>
              </a>
            );
          })}
        </div>

        {/* CENTER: Constellation map with orbiting planets */}
        <div className="flex-1 relative" style={{ minHeight: '620px' }}>
          {/* SVG orbit rings */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible" viewBox="-400 -300 800 600">
            {Object.values(LEVELS_ORBIT).map((cfg, i) => (
              <ellipse key={i} cx={cfg.cx} cy={cfg.cy} rx={cfg.radius} ry={cfg.radius * 0.55}
                fill="none" stroke={cfg.color} strokeWidth="0.4" opacity="0.12" strokeDasharray="4,6" />
            ))}
            {/* Constellation lines between consecutive completed nodes */}
            {planets.filter(p => p.completed).map((p, i, arr) => {
              if (i >= arr.length - 1) return null;
              const next = arr[i + 1];
              return (
                <motion.line key={i} x1={p.x} y1={p.y} x2={next.x} y2={next.y}
                  stroke={GOLD} strokeWidth="0.6" opacity="0.25" strokeDasharray="3,5"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: i * 0.15 }} />
              );
            })}
          </svg>

          {/* Planet nodes */}
          {planets.map((planet, i) => {
            const isActive = activeNode?.slug === planet.slug;
            const cfg = LEVELS_ORBIT[planet.nivel as keyof typeof LEVELS_ORBIT] || LEVELS_ORBIT[1];
            const nodeSize = isActive ? 48 : planet.completed ? 38 : !planet.unlocked ? 28 : 42;
            return (
              <motion.div
                key={planet.slug}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05, type: 'spring', stiffness: 200 }}
                className="absolute z-10"
                style={{ left: `calc(50% + ${planet.x}px)`, top: `calc(50% + ${planet.y}px)`, transform: 'translate(-50%, -50%)' }}
              >
                <Link href={planet.unlocked ? `/guias/ciencias_naturales/fisica/${planet.slug}` : '#'}
                  className={cn("block", !planet.unlocked && "pointer-events-none")}>
                  <motion.div
                    whileHover={planet.unlocked ? { scale: 1.15 } : {}}
                    className="relative flex flex-col items-center gap-2"
                  >
                    {/* Glow halo */}
                    {planet.unlocked && (
                      <div className="absolute inset-0 rounded-full blur-xl"
                        style={{ background: `radial-gradient(circle, ${planet.completed ? GOLD : cfg.color}${isActive ? '60' : '20'}, transparent)`, transform: 'scale(2.5)' }} />
                    )}
                    {/* Planet circle */}
                    <div className="relative rounded-full flex items-center justify-center border-2 transition-all"
                      style={{
                        width: nodeSize, height: nodeSize,
                        borderColor: planet.completed ? GOLD : planet.inProgress ? '#34D399' : planet.unlocked ? cfg.color + '80' : 'rgba(255,255,255,0.1)',
                        background: planet.completed ? `radial-gradient(circle at 30% 30%, ${GOLD}40, transparent)` :
                                    planet.inProgress ? 'rgba(34,197,94,0.06)' : 'rgba(255,255,255,0.02)',
                        boxShadow: isActive ? `0 0 30px ${planet.completed ? GOLD : cfg.color}40` : 'none',
                      }}>
                      {/* Progress ring for in-progress */}
                      {planet.inProgress && (
                        <svg className="absolute inset-0 -rotate-90" viewBox={`0 0 ${nodeSize} ${nodeSize}`}>
                          <circle cx={nodeSize/2} cy={nodeSize/2} r={nodeSize/2 - 2} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="2" />
                          <motion.circle cx={nodeSize/2} cy={nodeSize/2} r={nodeSize/2 - 2} fill="none" stroke="#34D399" strokeWidth="2" strokeLinecap="round"
                            initial={{ pathLength: 0 }} animate={{ pathLength: planet.layers / 3 }}
                            transition={{ duration: 1 }} strokeDasharray={2 * Math.PI * (nodeSize/2 - 2)} />
                        </svg>
                      )}
                      {planet.completed ? <CheckCircle size={Math.max(14, nodeSize/3)} style={{ color: GOLD }} /> :
                       planet.unlocked ? <BookOpen size={Math.max(11, nodeSize/3.5)} style={{ color: isActive ? GOLD : 'rgba(197,160,89,0.4)' }} /> :
                       <Lock size={Math.max(10, nodeSize/3.8)} style={{ color: 'rgba(255,255,255,0.15)' }} />}
                    </div>
                    {/* Label below */}
                    <span className="text-[9px] font-mono font-bold text-center leading-tight max-w-[90px] truncate"
                      style={{ color: !planet.unlocked ? 'rgba(255,255,255,0.12)' : isActive ? CREAM : 'rgba(229,229,229,0.45)' }}>
                      {planet.title}
                    </span>
                    {planet.unlocked && (
                      <div className="flex gap-0.5">
                        {[0, 1, 2].map(j => (
                          <div key={j} className="w-1 h-1 rounded-full" style={{ background: j < planet.layers ? GOLD : 'rgba(255,255,255,0.06)' }} />
                        ))}
                      </div>
                    )}
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}

          {/* Center legend */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20 text-center">
            <motion.div animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 4, repeat: Infinity }}>
              <Compass size={18} style={{ color: GOLD, opacity: 0.4 }} />
            </motion.div>
          </div>
        </div>

        {/* RIGHT: Immersive card + widgets */}
        <div className="w-[320px] shrink-0 space-y-4 hidden xl:block">
          {/* Active node immersive card */}
          {activeNode && (
            <motion.div
              key={activeNode.slug}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative"
            >
              <div className="absolute inset-0 rounded-2xl blur-2xl" style={{ background: `linear-gradient(135deg, ${LEVELS_ORBIT[activeNode.nivel as keyof typeof LEVELS_ORBIT]?.color || GOLD}20, transparent)` }} />
              <div className="relative rounded-2xl p-5 border" style={{ background: 'rgba(26,26,26,0.85)', borderColor: 'rgba(197,160,89,0.15)', backdropFilter: 'blur(20px)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: LEVELS_ORBIT[activeNode.nivel as keyof typeof LEVELS_ORBIT]?.color || GOLD }} />
                  <span className="text-[8px] font-mono font-black uppercase tracking-[0.3em]" style={{ color: 'rgba(197,160,89,0.6)' }}>
                    NIVEL {activeNode.nivel} · {levels.find(l => l.nivel === activeNode.nivel)?.titulo || ''}
                  </span>
                </div>
                <h2 className="font-serif text-lg font-bold mb-2 leading-tight">{activeNode.title}</h2>
                
                {activeNode.inProgress && (
                  <div className="mb-4">
                    <div className="flex justify-between text-[9px] font-mono mb-1.5" style={{ color: 'rgba(229,229,229,0.3)' }}>
                      <span>Capas dominadas</span><span>{activeNode.layers}/3</span>
                    </div>
                    <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
                      <motion.div className="h-full rounded-full" style={{ background: `linear-gradient(to right, ${GOLD}, #D4AF37)` }}
                        initial={{ width: 0 }} animate={{ width: `${(activeNode.layers/3)*100}%` }} transition={{ duration: 0.8 }} />
                    </div>
                  </div>
                )}
                <p className="text-[11px] leading-relaxed mb-4" style={{ color: 'rgba(229,229,229,0.35)' }}>
                  {activeNode.completed ? 'Has dominado completamente este conocimiento. Las 3 capas han sido asimiladas.' :
                   activeNode.inProgress ? `Has explorado ${activeNode.layers} de 3 capas de profundidad. Continúa para desbloquear el siguiente emblema.` :
                   `Comienza tu expedición en este nodo del conocimiento. Cada capa revela una nueva dimensión de comprensión.`}
                </p>
                <Link href={`/guias/ciencias_naturales/fisica/${activeNode.slug}`}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-mono text-[11px] font-bold uppercase tracking-wider transition-all hover:scale-[1.02]"
                  style={{ background: `rgba(197,160,89,0.12)`, color: GOLD, border: `1px solid rgba(197,160,89,0.25)` }}>
                  {activeNode.completed ? 'Repasar' : activeNode.inProgress ? 'Continuar' : 'Empezar'}
                  <ChevronRight size={13} />
                </Link>
              </div>
            </motion.div>
          )}

          {/* Circular level progress */}
          <div className="rounded-2xl p-5 border text-center relative overflow-hidden" style={{ background: 'rgba(26,26,26,0.7)', borderColor: 'rgba(197,160,89,0.12)', backdropFilter: 'blur(12px)' }}>
            <div className="absolute top-0 right-0 w-20 h-20 opacity-[0.03]" style={{ background: `radial-gradient(circle, ${GOLD}, transparent)` }} />
            <div className="relative inline-flex mb-2">
              <svg width="80" height="80" viewBox="0 0 80 80" className="-rotate-90">
                <circle cx="40" cy="40" r="31" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="3" />
                <motion.circle cx="40" cy="40" r="31" fill="none" stroke={GOLD} strokeWidth="3" strokeLinecap="round"
                  initial={{ strokeDashoffset: circ }}
                  animate={{ strokeDashoffset: circ * (1 - lvlProg) }}
                  transition={{ duration: 1.5 }}
                  style={{ filter: `drop-shadow(0 0 8px ${GOLD}50)` }}
                  strokeDasharray={circ} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-serif text-2xl font-bold" style={{ color: GOLD }}>{userLevel}</span>
                <span className="text-[7px] font-mono uppercase tracking-[0.3em]" style={{ color: 'rgba(197,160,89,0.5)' }}>NIVEL</span>
              </div>
            </div>
            <p className="font-serif text-[11px] font-bold">Sabio Nivel {userLevel}</p>
            <p className="text-[9px] mt-0.5" style={{ color: 'rgba(229,229,229,0.3)' }}>{formatXP(userXp)} XP · {totalLayersDone} capas</p>
            <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t" style={{ borderColor: 'rgba(197,160,89,0.06)' }}>
              {[{ v: physicsRelics.length, l: 'Reliquias' }, { v: achievements.length, l: 'Logros' }, { v: doneCount, l: 'Emblemas' }].map((s, i) => (
                <div key={i} className="text-center">
                  <div className="font-mono font-black text-[13px]" style={{ color: GOLD }}>{s.v}</div>
                  <div className="text-[7px] font-mono uppercase tracking-[0.2em] mt-0.5" style={{ color: 'rgba(229,229,229,0.25)' }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Leaderboard scroll */}
          <div className="rounded-2xl p-4 border" style={{ background: 'rgba(26,26,26,0.7)', borderColor: 'rgba(197,160,89,0.12)', backdropFilter: 'blur(12px)' }}>
            <div className="flex items-center gap-2 mb-3">
              <Scroll size={13} style={{ color: GOLD }} />
              <span className="text-[9px] font-mono font-black uppercase tracking-[0.3em]" style={{ color: 'rgba(197,160,89,0.6)' }}>Ranking</span>
            </div>
            {[0, 1, 2, 3].map(i => {
              const rank = i + 1;
              const medals = ['🥇', '🥈', '🥉', ''];
              return (
                <div key={i} className="flex items-center gap-2 py-1.5 border-b last:border-0" style={{ borderColor: 'rgba(197,160,89,0.05)' }}>
                  <span className="font-mono font-bold text-[10px] w-5 text-center">{medals[i] || `#${rank}`}</span>
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-mono font-bold"
                    style={{ background: 'rgba(197,160,89,0.07)', color: 'rgba(197,160,89,0.5)' }}>
                    {String.fromCharCode(64 + rank)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-medium truncate">{['Alquimista Supremo', 'Maestro Arcano', 'Sabio Errante', 'Aprendiz'][i]}</div>
                  </div>
                  <span className="text-[9px] font-mono font-bold" style={{ color: 'rgba(197,160,89,0.45)' }}>
                    Nv.{8 - rank}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Achievements */}
          <div className="rounded-2xl p-4 border" style={{ background: 'rgba(26,26,26,0.7)', borderColor: 'rgba(197,160,89,0.12)', backdropFilter: 'blur(12px)' }}>
            <div className="flex items-center gap-2 mb-3">
              <Medal size={13} style={{ color: GOLD }} />
              <span className="text-[9px] font-mono font-black uppercase tracking-[0.3em]" style={{ color: 'rgba(197,160,89,0.6)' }}>Medallas</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {['🐺', '🧭', '🔥', '👑', '💎', '⚡', '🌙', '📚'].map((emoji, i) => {
                const unlocked = i < achievements.length || i === 0;
                return (
                  <motion.div key={i} whileHover={unlocked ? { scale: 1.15, rotate: 5 } : {}}
                    className="aspect-square rounded-lg flex items-center justify-center text-sm border transition-all"
                    style={{
                      background: unlocked ? 'rgba(197,160,89,0.08)' : 'rgba(255,255,255,0.01)',
                      borderColor: unlocked ? 'rgba(197,160,89,0.25)' : 'rgba(255,255,255,0.04)',
                      opacity: unlocked ? 1 : 0.25,
                      filter: unlocked ? 'none' : 'grayscale(1)',
                    }}>
                    {emoji}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar: level progress + CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t px-6 py-2.5 backdrop-blur-xl"
        style={{ background: 'rgba(18,18,18,0.9)', borderColor: 'rgba(197,160,89,0.08)' }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="text-[9px] font-mono uppercase tracking-[0.3em]" style={{ color: 'rgba(229,229,229,0.2)' }}>
            {doneCount}/{nodes.length} emblemas
          </span>
          <div className="flex items-center gap-5">
            {levels.map(lvl => {
              const done = nodes.filter(n => n.nivel === lvl.nivel && n.completed).length;
              const total = nodes.filter(n => n.nivel === lvl.nivel).length;
              const pct = total > 0 ? (done / total) * 100 : 0;
              const cfg = LEVELS_ORBIT[lvl.nivel as keyof typeof LEVELS_ORBIT];
              return (
                <div key={lvl.nivel} className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: pct >= 100 ? GOLD : cfg?.color + '40' || '#555' }} />
                  <span className="text-[7px] font-mono font-bold uppercase tracking-wider" style={{ color: 'rgba(229,229,229,0.25)' }}>{lvl.titulo}</span>
                  <div className="w-12 h-[3px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <motion.div className="h-full rounded-full" style={{ background: cfg?.color || GOLD }}
                      initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, delay: 0.2 }} />
                  </div>
                </div>
              );
            })}
          </div>
          <Link href={activeNode ? `/guias/ciencias_naturales/fisica/${activeNode.slug}` : '#'}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full font-mono text-[10px] font-bold uppercase tracking-wider hover:scale-105 transition-all"
            style={{ background: `rgba(197,160,89,0.1)`, color: GOLD, border: `1px solid rgba(197,160,89,0.2)` }}>
            Continuar <ChevronRight size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
}
