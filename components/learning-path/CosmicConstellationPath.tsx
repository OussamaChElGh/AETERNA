'use client';
import React, { useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Flame, Trophy, Medal, Scroll, BookOpen, Lock, CheckCircle, Star, Gem, ChevronRight, Compass, Zap } from 'lucide-react';
import fisicaCurriculum from '@/data/curriculum/fisica.json';
import { useGamification, formatXP } from '@/context/GamificationContext';
import { cn } from '@/lib/utils';

interface ArticleJSON { slug: string; title: string; nivel: number; orden: number; tipo?: string; }

const GOLD = '#C5A059';
const CHARCOAL = '#121212';
const CREAM = '#E5E5E5';
const DARK_SURFACE = '#1A1A1A';
const GOLD_LIGHT = '#D4AF37';

const LEVEL_COLORS = {
  1: { from: '#8B5CF6', to: '#7C3AED', label: 'Fundamentos' },
  2: { from: '#06B6D4', to: '#0891B2', label: 'Clásico' },
  3: { from: '#F97316', to: '#EA580C', label: 'Frontera' },
  4: { from: '#EF4444', to: '#DC2626', label: 'Síntesis' },
};

function FlameStreakIcon({ streak }: { streak: number }) {
  if (streak === 0) return null;
  const glow = Math.min(streak * 0.15, 1);
  return (
    <motion.div className="relative inline-flex items-center" animate={{ scale: streak >= 5 ? [1, 1.05, 1] : 1 }} transition={{ duration: 0.5, repeat: streak >= 5 ? Infinity : 0 }}>
      <div className="absolute inset-0 rounded-full blur-lg" style={{ background: `radial-gradient(circle, rgba(251,146,60,${glow}) 0%, transparent 70%)`, transform: 'scale(2)' }} />
      <Flame size={16} className="text-orange-400" style={{ filter: `drop-shadow(0 0 ${4 + streak}px rgba(251,146,60,0.7))` }} />
      <span className="ml-1 font-mono font-black text-xs text-orange-400">{streak}</span>
    </motion.div>
  );
}

export default function CosmicConstellationPath() {
  const { progress } = useGamification();
  const completedPaths = progress.completedPaths || [];
  const completedLayers = progress.completedLayers || {};
  const physicsRelics = progress.physicsRelics || [];
  const dailyStreak = progress.dailyStreak || 0;
  const userLevel = progress.level || 1;
  const userXp = progress.xp || 0;
  const achievements = progress.achievements || [];

  const curriculum = fisicaCurriculum as { levels?: { nivel: number; titulo: string; descripcion: string }[]; articles?: ArticleJSON[] };

  const levels = useMemo(() => {
    const articles = [...(curriculum.articles || [])].sort((a, b) => a.nivel - b.nivel || a.orden - b.orden);
    return (curriculum.levels || []).map(l => ({
      ...l, articles: articles.filter(a => a.nivel === l.nivel)
    })).filter(l => l.articles.length > 0);
  }, []);

  const allArticles = useMemo(() => levels.flatMap(l => l.articles), [levels]);

  const nodelData = useMemo(() => {
    let prevCompleted = true;
    return allArticles.map((art, idx) => {
      const layers = completedLayers[art.slug]?.length || 0;
      const isCompleted = completedPaths.includes(art.slug) || layers >= 3;
      const isUnlocked = idx === 0 || prevCompleted;
      if (isCompleted) prevCompleted = true; else prevCompleted = false;
      return { ...art, layers, completed: isCompleted, unlocked: isUnlocked, inProgress: layers > 0 && layers < 3 };
    });
  }, [allArticles, completedPaths, completedLayers]);

  const completedCount = nodelData.filter(n => n.completed).length;
  const totalLayers = nodelData.reduce((s, n) => s + n.layers, 0);
  const activeNode = nodelData.find(n => !n.completed && n.unlocked);

  const xpForLevel = 1000;
  const levelProgress = (userXp % xpForLevel) / xpForLevel;
  const circ = 2 * Math.PI * 28;

  return (
    <div className="min-h-screen font-sans text-white relative" style={{ background: CHARCOAL }}>
      {/* Dark parchment texture overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(197,160,89,0.3) 2px, rgba(197,160,89,0.3) 3px), repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(197,160,89,0.15) 40px, rgba(197,160,89,0.15) 41px)' }} />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b" style={{ background: 'rgba(18,18,18,0.92)', backdropFilter: 'blur(20px)', borderColor: 'rgba(197,160,89,0.12)' }}>
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: `radial-gradient(circle, ${GOLD_LIGHT}33, transparent)` }}>
                <Compass size={16} style={{ color: GOLD }} />
              </div>
              <h1 className="font-serif text-xl font-bold tracking-tight" style={{ color: CREAM }}>
                El Sendero del Sabio
              </h1>
            </div>
            <span className="text-[8px] font-mono font-bold uppercase tracking-[0.4em] px-2 py-1 rounded-full"
              style={{ background: 'rgba(197,160,89,0.08)', color: 'rgba(197,160,89,0.7)' }}>ANEKTIA</span>
          </div>

          <div className="flex items-center gap-4">
            <FlameStreakIcon streak={dailyStreak} />
            <div className="flex items-center gap-1.5 text-xs font-mono" style={{ color: 'rgba(229,229,229,0.5)' }}>
              <Gem size={12} style={{ color: GOLD }} />
              <span style={{ color: CREAM }}>{formatXP(userXp)} XP</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">
        {/* LEFT: Pathway map */}
        <div className="flex-1">
          {/* Level cards stacked vertically */}
          {levels.map((lvl, li) => {
            const lvlNodes = nodelData.filter(n => n.nivel === lvl.nivel);
            const lvlCompleted = lvlNodes.filter(n => n.completed).length;
            const lvlColor = LEVEL_COLORS[lvl.nivel as keyof typeof LEVEL_COLORS] || LEVEL_COLORS[1];

            return (
              <motion.div
                key={lvl.nivel}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: li * 0.15 }}
                className="mb-8"
              >
                {/* Level header with gold filigree */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-0.5 h-8 rounded-full" style={{ background: `linear-gradient(to bottom, ${lvlColor.from}, ${lvlColor.to})` }} />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[8px] font-mono font-black uppercase tracking-[0.4em]"
                        style={{ color: 'rgba(197,160,89,0.6)' }}>SECCIÓN {lvl.nivel}</span>
                      <span className="text-[8px] font-mono font-bold" style={{ color: 'rgba(229,229,229,0.3)' }}>
                        {lvlCompleted}/{lvlNodes.length}
                      </span>
                    </div>
                    <h2 className="font-serif text-xl font-bold mt-0.5" style={{ color: CREAM }}>{lvl.titulo}</h2>
                  </div>
                </div>

                {/* Node grid: horizontal scrolling cards */}
                <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                  {lvlNodes.map((node, ni) => {
                    const isActive = activeNode?.slug === node.slug;
                    return (
                      <Link
                        key={node.slug}
                        href={node.unlocked ? `/guias/ciencias_naturales/fisica/${node.slug}` : '#'}
                        className={cn("shrink-0", node.unlocked ? '' : 'pointer-events-none')}
                      >
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: ni * 0.08 }}
                          whileHover={node.unlocked ? { y: -4, scale: 1.02 } : {}}
                          className="relative w-[200px]"
                        >
                          {/* Card with glassmorphism */}
                          <div
                            className="rounded-2xl p-4 transition-all duration-300 border"
                            style={{
                              background: node.completed
                                ? `linear-gradient(135deg, rgba(197,160,89,0.08), rgba(212,175,55,0.04))`
                                : node.unlocked
                                ? `rgba(26,26,26,0.8)`
                                : `rgba(26,26,26,0.3)`,
                              borderColor: node.completed
                                ? 'rgba(197,160,89,0.3)'
                                : node.unlocked
                                ? `rgba(${isActive ? '197,160,89' : '255,255,255'}, ${isActive ? 0.4 : 0.08})`
                                : 'rgba(255,255,255,0.04)',
                              backdropFilter: 'blur(12px)',
                              boxShadow: isActive && node.unlocked
                                ? `0 0 30px rgba(197,160,89,0.15), inset 0 0 20px rgba(197,160,89,0.03)`
                                : 'none',
                              opacity: node.unlocked ? 1 : 0.35,
                            }}
                          >
                            {/* Gold emblem circle */}
                            <div className="flex items-center justify-center mb-3">
                              <motion.div
                                className="relative w-12 h-12 rounded-full flex items-center justify-center border-2"
                                style={{
                                  borderColor: node.completed
                                    ? GOLD
                                    : node.inProgress
                                    ? 'rgba(34,197,94,0.4)'
                                    : node.unlocked
                                    ? 'rgba(197,160,89,0.5)'
                                    : 'rgba(255,255,255,0.1)',
                                  background: node.completed
                                    ? `radial-gradient(circle, rgba(197,160,89,0.2), transparent)`
                                    : node.inProgress
                                    ? 'rgba(34,197,94,0.08)'
                                    : 'rgba(255,255,255,0.02)',
                                  boxShadow: node.completed ? `0 0 15px rgba(197,160,89,0.3)` : 'none',
                                }}
                                animate={isActive && node.unlocked ? { boxShadow: ['0 0 10px rgba(197,160,89,0.2)', '0 0 25px rgba(197,160,89,0.4)', '0 0 10px rgba(197,160,89,0.2)'] } : {}}
                                transition={{ duration: 2.5, repeat: Infinity }}
                              >
                                {/* Progress arc */}
                                {node.inProgress && (
                                  <svg className="absolute inset-0 -rotate-90" viewBox="0 0 48 48">
                                    <circle cx="24" cy="24" r="21" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
                                    <motion.circle cx="24" cy="24" r="21" fill="none" stroke="#34D399" strokeWidth="2" strokeLinecap="round"
                                      initial={{ pathLength: 0 }}
                                      animate={{ pathLength: node.layers / 3 }}
                                      transition={{ duration: 1 }}
                                      strokeDasharray={circ * 0.9}
                                      style={{ transformOrigin: 'center' }}
                                    />
                                  </svg>
                                )}
                                {node.completed ? (
                                  <CheckCircle size={20} style={{ color: GOLD }} />
                                ) : node.unlocked ? (
                                  <BookOpen size={16} style={{ color: isActive ? GOLD : 'rgba(197,160,89,0.5)' }} />
                                ) : (
                                  <Lock size={14} style={{ color: 'rgba(255,255,255,0.2)' }} />
                                )}
                              </motion.div>
                            </div>

                            {/* Title */}
                            <h3 className="font-serif text-sm font-bold text-center leading-tight mb-1"
                              style={{ color: node.unlocked ? CREAM : 'rgba(229,229,229,0.3)' }}>
                              {node.title}
                            </h3>

                            {/* Layer progress dots */}
                            <div className="flex items-center justify-center gap-1">
                              {[0, 1, 2].map(i => (
                                <div
                                  key={i}
                                  className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                                  style={{
                                    background: i < node.layers ? GOLD : 'rgba(255,255,255,0.08)',
                                    boxShadow: i < node.layers ? `0 0 6px ${GOLD}60` : 'none',
                                  }}
                                />
                              ))}
                            </div>

                            {isActive && node.unlocked && (
                              <motion.div
                                className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[8px] font-mono font-black uppercase tracking-[0.3em] px-2 py-0.5 rounded-full"
                                style={{ background: `rgba(197,160,89,0.15)`, color: GOLD }}
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              >
                                SIGUIENTE
                              </motion.div>
                            )}
                          </div>
                        </motion.div>
                      </Link>
                    );
                  })}

                  {/* Relic chest at end */}
                  {lvlCompleted >= lvlNodes.length && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      className="shrink-0 w-[200px] rounded-2xl p-4 flex flex-col items-center justify-center gap-2 border"
                      style={{
                        background: `linear-gradient(135deg, rgba(197,160,89,0.1), rgba(212,175,55,0.05))`,
                        borderColor: 'rgba(197,160,89,0.3)',
                        backdropFilter: 'blur(12px)',
                        boxShadow: '0 0 20px rgba(197,160,89,0.1)',
                      }}
                    >
                      <motion.div
                        animate={{ rotate: [0, -10, 10, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 3 }}
                      >
                        <Trophy size={28} style={{ color: GOLD }} />
                      </motion.div>
                      <p className="font-serif text-xs text-center" style={{ color: 'rgba(197,160,89,0.7)' }}>
                        Reliquia del Nivel {lvl.nivel}
                      </p>
                      <span className="text-[8px] font-mono font-bold uppercase tracking-[0.2em]" style={{ color: 'rgba(197,160,89,0.4)' }}>
                        OBTENIDA
                      </span>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}

          {/* Bottom summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-10 p-6 rounded-2xl border relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, rgba(197,160,89,0.04), rgba(26,26,26,0.6))', borderColor: 'rgba(197,160,89,0.15)', backdropFilter: 'blur(12px)' }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.03]" style={{ background: `radial-gradient(circle, ${GOLD}, transparent)` }} />
            <div className="relative flex items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl" style={{ background: 'rgba(197,160,89,0.08)' }}>
                  <Scroll size={20} style={{ color: GOLD }} />
                </div>
                <div>
                  <div className="font-serif text-2xl font-bold" style={{ color: GOLD }}>{completedCount}</div>
                  <div className="text-[9px] font-mono uppercase tracking-[0.2em] mt-0.5" style={{ color: 'rgba(229,229,229,0.4)' }}>Guías Completadas</div>
                </div>
              </div>

              <div className="w-px h-12" style={{ background: 'rgba(197,160,89,0.1)' }} />

              <div>
                <div className="font-serif text-2xl font-bold" style={{ color: GOLD }}>{totalLayers}</div>
                <div className="text-[9px] font-mono uppercase tracking-[0.2em] mt-0.5" style={{ color: 'rgba(229,229,229,0.4)' }}>Capas Asimiladas</div>
              </div>

              <div className="w-px h-12" style={{ background: 'rgba(197,160,89,0.1)' }} />

              <div>
                <div className="font-serif text-2xl font-bold" style={{ color: GOLD }}>
                  {allArticles.length > 0 ? Math.round((completedCount / allArticles.length) * 100) : 0}%
                </div>
                <div className="text-[9px] font-mono uppercase tracking-[0.2em] mt-0.5" style={{ color: 'rgba(229,229,229,0.4)' }}>Dominio</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* RIGHT: Sidebar with profile widgets */}
        <div className="w-[300px] shrink-0 space-y-4 hidden xl:block">
          {/* User level + progress ring */}
          <div className="rounded-2xl p-5 border text-center relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, rgba(26,26,26,0.8), rgba(18,18,18,0.9))', borderColor: 'rgba(197,160,89,0.15)', backdropFilter: 'blur(12px)' }}>
            <div className="absolute top-0 right-0 w-24 h-24 opacity-[0.04]" style={{ background: `radial-gradient(circle, ${GOLD}, transparent)` }} />

            {/* Circular progress */}
            <div className="relative inline-flex items-center justify-center mb-3">
              <svg width="72" height="72" viewBox="0 0 72 72" className="-rotate-90">
                <circle cx="36" cy="36" r="28" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                <motion.circle cx="36" cy="36" r="28" fill="none" stroke={GOLD} strokeWidth="3" strokeLinecap="round"
                  strokeDasharray={circ}
                  initial={{ strokeDashoffset: circ }}
                  animate={{ strokeDashoffset: circ * (1 - levelProgress) }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                  style={{ filter: `drop-shadow(0 0 6px rgba(197,160,89,0.4))` }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-serif text-xl font-bold" style={{ color: GOLD }}>{userLevel}</span>
                <span className="text-[7px] font-mono uppercase tracking-[0.3em]" style={{ color: 'rgba(197,160,89,0.5)' }}>NIVEL</span>
              </div>
            </div>

            <p className="font-serif text-xs font-bold" style={{ color: CREAM }}>
              Sabio Nivel {userLevel}
            </p>
            <p className="text-[9px] mt-1" style={{ color: 'rgba(229,229,229,0.4)' }}>
              {formatXP(userXp)} XP acumulados
            </p>

            <div className="flex items-center justify-center gap-4 mt-4 pt-3 border-t" style={{ borderColor: 'rgba(197,160,89,0.08)' }}>
              <div className="text-center">
                <div className="font-mono font-black text-sm" style={{ color: GOLD }}>{physicsRelics.length}</div>
                <div className="text-[7px] font-mono uppercase tracking-[0.2em] mt-0.5" style={{ color: 'rgba(229,229,229,0.3)' }}>Reliquias</div>
              </div>
              <div className="w-px h-8" style={{ background: 'rgba(197,160,89,0.1)' }} />
              <div className="text-center">
                <FlameStreakIcon streak={dailyStreak} />
                <div className="text-[7px] font-mono uppercase tracking-[0.2em] mt-0.5" style={{ color: 'rgba(229,229,229,0.3)' }}>Racha</div>
              </div>
              <div className="w-px h-8" style={{ background: 'rgba(197,160,89,0.1)' }} />
              <div className="text-center">
                <div className="font-mono font-black text-sm" style={{ color: GOLD }}>{achievements.length}</div>
                <div className="text-[7px] font-mono uppercase tracking-[0.2em] mt-0.5" style={{ color: 'rgba(229,229,229,0.3)' }}>Logros</div>
              </div>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="rounded-2xl p-5 border relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, rgba(26,26,26,0.8), rgba(18,18,18,0.9))', borderColor: 'rgba(197,160,89,0.15)', backdropFilter: 'blur(12px)' }}>
            <div className="flex items-center gap-2 mb-3">
              <Scroll size={14} style={{ color: GOLD }} />
              <span className="text-[9px] font-mono font-black uppercase tracking-[0.3em]" style={{ color: 'rgba(197,160,89,0.6)' }}>Ranking</span>
            </div>
            {[1, 2, 3, 4, 5].map(r => (
              <div key={r} className="flex items-center gap-2.5 py-1.5 border-b last:border-0"
                style={{ borderColor: 'rgba(197,160,89,0.06)' }}>
                <span className="font-mono font-bold text-[10px] w-5" style={{ color: r === 1 ? GOLD : r <= 3 ? 'rgba(197,160,89,0.5)' : 'rgba(255,255,255,0.15)' }}>
                  {r === 1 ? '🥇' : r === 2 ? '🥈' : r === 3 ? '🥉' : `#${r}`}
                </span>
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-mono"
                  style={{ background: 'rgba(197,160,89,0.08)', color: 'rgba(197,160,89,0.5)' }}>
                  {String.fromCharCode(64 + r)}
                </div>
                <div className="flex-1">
                  <div className="text-[10px] font-medium" style={{ color: CREAM }}>Sabio Arcano</div>
                  <div className="text-[8px] font-mono" style={{ color: 'rgba(197,160,89,0.4)' }}>Nivel {7 - r}</div>
                </div>
                <span className="text-[9px] font-mono font-bold" style={{ color: 'rgba(197,160,89,0.5)' }}>
                  {formatXP((6 - r) * 1500 + 500)} XP
                </span>
              </div>
            ))}
          </div>

          {/* Achievements gallery */}
          <div className="rounded-2xl p-5 border relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, rgba(26,26,26,0.8), rgba(18,18,18,0.9))', borderColor: 'rgba(197,160,89,0.15)', backdropFilter: 'blur(12px)' }}>
            <div className="flex items-center gap-2 mb-3">
              <Medal size={14} style={{ color: GOLD }} />
              <span className="text-[9px] font-mono font-black uppercase tracking-[0.3em]" style={{ color: 'rgba(197,160,89,0.6)' }}>Logros</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {['first_blood', 'explorer', 'streak_7', 'triple_crown', 'collector'].map((id, i) => {
                const unlocked = achievements.includes(id);
                const labels: Record<string, string> = { first_blood: '🐺', explorer: '🧭', streak_7: '🔥', triple_crown: '👑', collector: '💎' };
                return (
                  <motion.div key={id}
                    whileHover={{ scale: 1.1 }}
                    className="aspect-square rounded-xl flex items-center justify-center border transition-all"
                    style={{
                      background: unlocked ? 'rgba(197,160,89,0.1)' : 'rgba(255,255,255,0.02)',
                      borderColor: unlocked ? 'rgba(197,160,89,0.3)' : 'rgba(255,255,255,0.05)',
                      opacity: unlocked ? 1 : 0.3,
                      filter: unlocked ? 'none' : 'grayscale(1)',
                    }}>
                    <span className="text-lg">{labels[id] || '🏆'}</span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom navigation bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t px-6 py-2.5"
        style={{ background: 'rgba(18,18,18,0.92)', backdropFilter: 'blur(20px)', borderColor: 'rgba(197,160,89,0.1)' }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="text-[9px] font-mono uppercase tracking-[0.3em]" style={{ color: 'rgba(229,229,229,0.25)' }}>
            {completedCount} de {allArticles.length} emblemas obtenidos
          </span>

          <div className="flex items-center gap-6">
            {levels.map(lvl => {
              const done = nodelData.filter(n => n.nivel === lvl.nivel && n.completed).length;
              const total = nodelData.filter(n => n.nivel === lvl.nivel).length;
              const pct = total > 0 ? (done / total) * 100 : 0;
              return (
                <div key={lvl.nivel} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: pct >= 100 ? GOLD : 'rgba(255,255,255,0.1)' }} />
                  <span className="text-[8px] font-mono font-bold uppercase" style={{ color: 'rgba(229,229,229,0.3)' }}>
                    {lvl.titulo}
                  </span>
                  <div className="w-14 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(to right, ${LEVEL_COLORS[lvl.nivel as keyof typeof LEVEL_COLORS]?.from || GOLD}, ${LEVEL_COLORS[lvl.nivel as keyof typeof LEVEL_COLORS]?.to || GOLD})` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 1, delay: 0.3 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {activeNode && (
            <Link
              href={`/guias/ciencias_naturales/fisica/${activeNode.slug}`}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full font-mono text-[10px] font-bold uppercase tracking-wider transition-all hover:scale-105"
              style={{ background: `rgba(197,160,89,0.12)`, color: GOLD, border: `1px solid rgba(197,160,89,0.25)` }}
            >
              Continuar <ChevronRight size={12} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
