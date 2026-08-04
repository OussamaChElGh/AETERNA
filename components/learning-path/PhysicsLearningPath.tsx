'use client';
import React, { useMemo } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Trophy, Flame, Target, Zap, Star } from 'lucide-react';
import fisicaCurriculum from '@/data/curriculum/fisica.json';
import relicData from '@/data/relics.json';
import { useGamification } from '@/context/GamificationContext';
import { PathNode, PathNodeData } from './PathNode';
import { PathSection } from './PathSection';
import { PathChest } from './PathChest';
import { FloatingParticles } from './FloatingParticles';
import { ScrollProgressBar } from './ScrollProgressBar';
import { FlameStreak } from './FlameStreak';
import { MiniLeaderboard } from '@/components/MiniLeaderboard';
import { cn } from '@/lib/utils';

interface ArticleJSON {
  slug: string;
  title: string;
  nivel: number;
  orden: number;
  tipo?: string;
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

export function PhysicsLearningPath() {
  const { progress } = useGamification();
  const { scrollY } = useScroll();
  const particleY = useTransform(scrollY, [0, 1500], [0, -120]);

  const curriculum = fisicaCurriculum as { levels?: { nivel: number; titulo: string; descripcion: string }[]; articles?: ArticleJSON[] };
  const relics = (relicData as { relics?: { id: string; name: string; unlocksOn: { type: string; nivel?: number }; image?: string }[] }).relics || [];

  const completedPaths = progress.completedPaths || [];
  const completedLayers = progress.completedLayers || {};
  const physicsRelics = progress.physicsRelics || [];
  const dailyStreak = progress.dailyStreak || 0;
  const level = progress.level || 1;
  const xp = progress.xp || 0;

  const articles = useMemo(() => {
    const list = (curriculum.articles || []) as ArticleJSON[];
    return [...list].sort((a, b) => a.nivel - b.nivel || a.orden - b.orden);
  }, []);

  const levels = useMemo(() => {
    return (curriculum.levels || []).map(lvl => ({
      ...lvl,
      articles: articles.filter(a => a.nivel === lvl.nivel),
    })).filter(l => l.articles.length > 0);
  }, [articles]);

  const allNodes = useMemo(() => {
    let prevCompleted = true;
    return articles.map((art, idx) => {
      const layers = completedLayers[art.slug] || [];
      const isCompleted = completedPaths.includes(art.slug) || layers.length >= 3;
      const isUnlocked = idx === 0 || prevCompleted;
      if (isCompleted) prevCompleted = true;
      else prevCompleted = false;
      return {
        slug: art.slug, title: art.title, nivel: art.nivel, orden: art.orden,
        tipo: art.tipo, completedLayers: layers.length, isUnlocked,
      } as PathNodeData;
    });
  }, [articles, completedPaths, completedLayers]);

  const completedCount = allNodes.filter(n => n.completedLayers >= 3).length;
  const totalArticles = allNodes.length;
  const totalLayers = allNodes.reduce((s, n) => s + n.completedLayers, 0);

  return (
    <div className="min-h-screen bg-brand-ink font-sans relative">
      <ScrollProgressBar />
      <FloatingParticles />

      {/* Header */}
      <div className="sticky top-[3px] z-40 bg-brand-ink/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="font-serif text-xl font-bold bg-gradient-to-r from-cyan-400 via-violet-400 to-amber-400 bg-clip-text text-transparent">
              Física
            </h1>
            <div className="hidden sm:flex items-center gap-2.5">
              <FlameStreak streak={dailyStreak} />
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                <Zap size={12} className="text-cyan-400" />
                <span className="font-mono font-bold text-xs text-cyan-400">{xp.toLocaleString()}XP</span>
              </div>
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/20">
                <Target size={12} className="text-violet-400" />
                <span className="font-mono font-bold text-xs text-violet-400">N.{level}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 text-[10px] font-mono font-bold text-brand-offwhite/40">
            <span>{completedCount}/{totalArticles}</span>
            <span className="text-brand-gold">·</span>
            <span>{totalLayers} capas</span>
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div className="max-w-6xl mx-auto flex gap-6 px-4 py-6">
        {/* Left sidebar */}
        <div className="hidden lg:block w-48 shrink-0">
          <div className="sticky top-28 space-y-1">
            <div className="text-[9px] font-mono font-black uppercase tracking-[0.3em] text-brand-offwhite/25 mb-4 px-3">
              NIVELES
            </div>
            {levels.map(lvl => {
              const lvlNodes = allNodes.filter(n => n.nivel === lvl.nivel);
              const done = lvlNodes.filter(n => n.completedLayers >= 3).length;
              const allDone = done >= lvlNodes.length;
              const dotColors: Record<number, string> = { 1: 'bg-violet-500', 2: 'bg-cyan-500', 3: 'bg-orange-500', 4: 'bg-rose-500' };
              return (
                <a key={lvl.nivel} href={`#nivel-${lvl.nivel}`}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all",
                    "text-brand-offwhite/45 hover:text-brand-offwhite hover:bg-white/[0.04]",
                    allDone && "text-brand-offwhite/70"
                  )}
                >
                  <div className="relative">
                    <div className={cn("w-2 h-2 rounded-full", dotColors[lvl.nivel] || 'bg-brand-gold')} />
                    {allDone && <div className={cn("absolute inset-0 rounded-full animate-ping", dotColors[lvl.nivel] || 'bg-brand-gold')} />}
                  </div>
                  <span className="truncate text-[10px]">{lvl.titulo}</span>
                  <span className="ml-auto text-[9px] text-brand-offwhite/20">{done}/{lvlNodes.length}</span>
                </a>
              );
            })}
          </div>
        </div>

        {/* Center path */}
        <div className="flex-1 max-w-2xl mx-auto relative">
          {/* Parallax layer */}
          <motion.div style={{ y: particleY }} className="relative">
            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center mb-10"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-gold/20 bg-brand-gold/5 mb-3">
                <Star size={12} className="text-brand-gold" />
                <span className="text-[10px] font-mono font-black uppercase tracking-[0.5em] text-brand-gold/70">
                  Camino de Aprendizaje
                </span>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl text-brand-offwhite font-bold mt-2 bg-gradient-to-r from-cyan-400 via-violet-400 via-40% to-amber-400 bg-clip-text text-transparent">
                El Sendero del Sabio
              </h2>
              <p className="text-sm text-brand-offwhite/40 mt-3 max-w-md mx-auto leading-relaxed">
                Cada lección se compone de <span className="text-cyan-400 font-bold">3 capas</span> de profundidad.
                Domínalas para desbloquear la siguiente y obtener reliquias del conocimiento.
              </p>
            </motion.div>

            {/* Node path */}
            <div className="relative">
              {levels.map((lvl) => {
                const lvlNodes = allNodes.filter(n => n.nivel === lvl.nivel);
                const lvlCompleted = lvlNodes.filter(n => n.completedLayers >= 3).length;
                const relic = relics.find(r => r.unlocksOn.type === 'nivel_completed' && r.unlocksOn.nivel === lvl.nivel);

                return (
                  <div key={lvl.nivel} id={`nivel-${lvl.nivel}`} className="mb-10">
                    <PathSection
                      nivel={lvl.nivel}
                      title={lvl.titulo}
                      description={lvl.descripcion}
                      completedArticles={lvlCompleted}
                      totalArticles={lvlNodes.length}
                    />

                    <div className="mt-4 space-y-0">
                      {lvlNodes.map((node, idx) => (
                        <PathNode
                          key={node.slug}
                          node={node}
                          isFirst={idx === 0}
                          isLast={false}
                          index={idx}
                        />
                      ))}

                      {relic && (
                        <PathChest
                          nivel={lvl.nivel}
                          relicName={relic.name || `Reliquia del Nivel ${lvl.nivel}`}
                          isUnlocked={physicsRelics.includes(relic.id)}
                          relicImage={relic.image}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-14 relative"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-violet-500/10 to-amber-500/10 blur-3xl" />
              <div className="relative rounded-2xl border border-brand-gold/20 bg-brand-ink/80 backdrop-blur-sm p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-xl bg-brand-gold/10">
                    <Trophy size={20} className="text-brand-gold" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-brand-offwhite">Progreso del Sabio</h3>
                </div>
                <div className="grid grid-cols-3 gap-6">
                  {[
                    { value: completedCount, label: 'Guías', sub: 'Completadas' },
                    { value: totalLayers, label: 'Capas', sub: 'Asimiladas' },
                    { value: totalArticles > 0 ? Math.round((completedCount / totalArticles) * 100) : 0, label: '%', sub: 'Dominio' },
                  ].map((stat, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0.5, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.15, type: 'spring' }}
                      className="text-center p-4 rounded-xl bg-white/[0.02] border border-white/5"
                    >
                      <div className="text-3xl font-mono font-black bg-gradient-to-b from-brand-gold to-amber-500 bg-clip-text text-transparent">
                        {stat.label === '%' ? `${stat.value}%` : stat.value}
                      </div>
                      <div className="text-[10px] font-mono uppercase tracking-wider text-brand-offwhite/40 mt-2">{stat.sub}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Right widgets */}
        <div className="hidden xl:block w-64 shrink-0">
          <div className="sticky top-28 space-y-4">
            {/* League */}
            <div className="glass-panel rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Trophy size={14} className="text-brand-gold" />
                <span className="text-[10px] font-mono font-black uppercase tracking-[0.2em] text-brand-offwhite/60">Liga</span>
              </div>
              <MiniLeaderboard entries={[]} scope="global" />
            </div>

            {/* Stats */}
            <div className="glass-panel rounded-2xl p-4 space-y-3">
              {[
                { icon: Flame, color: 'text-orange-400', label: 'Racha', value: `${dailyStreak} días` },
                { icon: Zap, color: 'text-cyan-400', label: 'XP Total', value: xp.toLocaleString() },
                { icon: Target, color: 'text-violet-400', label: 'Nivel', value: level.toString() },
                { icon: Star, color: 'text-amber-400', label: 'Reliquias', value: `${physicsRelics.length}/${relics.length}` },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-brand-offwhite/40">{item.label}</span>
                  <div className="flex items-center gap-1.5">
                    <item.icon size={14} className={item.color} />
                    <span className={cn("font-mono font-bold text-sm", item.color)}>{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
