'use client';
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  User as AvatarIcon,
  Trophy,
  Flame,
  Award,
  BookOpen,
  Star,
  ArrowRight,
  X,
  BrainCircuit,
  Zap,
  Fingerprint,
  Scroll,
  LogOut,
  Sparkles,
} from "lucide-react";
import Link from 'next/link';
import {
  useGamification,
  ACHIEVEMENTS,
  AVATARS,
  calculateProgressToNextLevel,
  formatXP
} from "@/context/GamificationContext";
import { cn, getArticlePath } from "@/lib/utils";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import { useAuth } from "@/context/AuthContext";
import { CATEGORIES_DATA } from "@/data/categories";
import type { ArticleFrontmatter } from "@/types";
import { ConstellationMap } from "@/components/ConstellationMap";
import { RoomProvider } from "@/context/RoomContext";
import { AeternaKnowledgeRoom } from "@/components/interactive/AeternaKnowledgeRoom";

export function ProfilePageClient({ initialArticles = [] }: { initialArticles?: ArticleFrontmatter[] }) {
  const { progress, selectAvatar, resetProgress } = useGamification();
  const { user } = useAuth();
  const [articles, setArticles] = useState<ArticleFrontmatter[]>(initialArticles);
  const [dailyChallenge, setDailyChallenge] = useState<{
    title: string;
    description: string;
    slug?: string;
    path?: string;
  } | null>(null);
  const [selectedAchievement, setSelectedAchievement] = useState<{
    id: string;
    unlocked: boolean;
  } | null>(null);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showAchievementsModal, setShowAchievementsModal] = useState(false);

  const handleReset = () => {
    resetProgress();
    setShowResetConfirm(false);
  };

  useEffect(() => {
    if (initialArticles && initialArticles.length > 0) {
      setArticles(initialArticles);
    }
  }, [initialArticles]);

  // Generate or load daily challenge
  useEffect(() => {
    if (articles.length === 0) return;

    const today = new Date().toISOString().split('T')[0];
    const storageKey = `daily_challenge_${user?.uid || 'guest'}`;
    const cached = localStorage.getItem(storageKey);
    
    if (cached) {
      const { day, challenge } = JSON.parse(cached);
      if (day === today) {
        setDailyChallenge(challenge);
        return;
      }
    }

    // Generate new challenge
    // 1. Prioritize articles with progress between 0 and 100
    const inProgress = articles.filter(a => {
      const p = progress.articleProgress?.[a.slug || ''] || 0;
      return p > 0 && p < 95;
    });

    // 2. Then articles not started at all
    const notStarted = articles.filter(a => {
      const p = progress.articleProgress?.[a.slug || ''] || 0;
      return p === 0;
    });

    let selected: ArticleFrontmatter | null = null;
    let challengeData = null;

    if (inProgress.length > 0) {
      selected = inProgress[Math.floor(Math.random() * inProgress.length)];
      challengeData = {
        title: `Retome su estudio: ${selected.title}`,
        description: `Continúe explorando las profundidades de ${selected.category}. Su sabiduría está a medio camino.`,
        slug: selected.slug,
        path: getArticlePath(selected)
      };
    } else if (notStarted.length > 0) {
      selected = notStarted[Math.floor(Math.random() * notStarted.length)];
      challengeData = {
        title: `Nuevo Horizonte: ${selected.title}`,
        description: `Se le ha asignado una nueva vía de conocimiento en ${selected.category}. Rompa el sello de este misterio.`,
        slug: selected.slug,
        path: getArticlePath(selected)
      };
    } else {
      // All completed
      challengeData = {
        title: "Maestría Absoluta",
        description: "Ha explorado todos los tomos disponibles. Su misión hoy es la contemplación de lo aprendido.",
        path: "/constelacion"
      };
    }

    setDailyChallenge(challengeData);
    localStorage.setItem(storageKey, JSON.stringify({ day: today, challenge: challengeData }));
  }, [articles, progress.articleProgress, user?.uid]);

  // Force path refresh if stored challenge has old format or missing path
  useEffect(() => {
    if (dailyChallenge && dailyChallenge.slug && articles.length > 0) {
      const art = articles.find(a => a.slug === dailyChallenge.slug);
      if (art) {
        const correctPath = getArticlePath(art);
        if (dailyChallenge.path !== correctPath) {
          setDailyChallenge(prev => prev ? ({ ...prev, path: correctPath }) : null);
        }
      }
    }
  }, [articles, dailyChallenge?.slug]);

  // Calculate real progress per category
  const branchStats = CATEGORIES_DATA.map(category => {
    // Find all articles in this category or its subcategories
    const categoryArticles = articles.filter(a => {
      // Normal matches
      if (a.category === category.id) return true;
      
      // Match by subcategory array
      if (category.subcategories.some(sub => sub.id === a.category)) return true;
      
      // Additional check using `a.subcategory` from frontmatter
      if (a.subcategory) {
         if (a.subcategory === category.id) return true;
         if (category.subcategories.some(sub => sub.id === a.subcategory)) return true;
      }
      
      // Special mappings for existing articles
      if (a.category === 'ciencias' && category.id === 'ciencias_naturales') return true;
      if (a.category === 'guias' && a.subcategory === 'ciencias' && category.id === 'ciencias_naturales') return true;
      if (a.category === 'literatura' && category.id === 'humanidades') return true;

      return false;
    });

    const totalArticles = categoryArticles.length;
    let completedWeight = 0;
    categoryArticles.forEach(art => {
      let val = progress.articleProgress?.[art.slug || ''] || 0;
      if (art.slug && progress.completedPaths.some(p => p.endsWith('.' + art.slug))) {
         val = Math.max(val, 100);
      }
      completedWeight += val;
    });

    const averageProgress = totalArticles > 0 ? Math.round(completedWeight / totalArticles) : 0;

    return {
      id: category.id,
      subject: category.name.split(' ')[0], // Short name for the chart
      fullName: category.name,
      value: averageProgress,
      fullMark: 100,
      color: category.id === 'humanidades' ? '#D4AF37' : '#D4AF37AA'
    };
  });

  // Dominant branch
  const dominantBranch = [...branchStats].sort((a, b) => b.value - a.value)[0];

  const currentAvatar =
    (AVATARS as any[]).find((a) => a.id === progress.selectedAvatarId) || AVATARS[0];
  const CurrentIcon = currentAvatar.icon;

  const getAvatarGlow = (color?: string, isUnlocked = true) => {
    if (!isUnlocked) return "text-white/20";
    switch (color) {
      case 'blue': return "text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.4)]";
      case 'cyan': return "text-cyan-300 drop-shadow-[0_0_15px_rgba(103,232,249,0.5)]";
      case 'gold-cyan': return "text-brand-gold drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]";
      case 'gold': return "text-brand-gold drop-shadow-[0_0_20px_rgba(212,175,55,0.6)]";
      case 'gold-intense': return "text-brand-gold drop-shadow-[0_0_25px_rgba(212,175,55,0.8)]";
      case 'divine': return "text-brand-gold drop-shadow-[0_0_30px_rgba(212,175,55,0.7)]";
      case 'radiant': return "text-brand-gold drop-shadow-[0_0_40px_rgba(212,175,55,1)] animate-pulse";
      default: return "text-brand-gold";
    }
  };

  const progressStats = calculateProgressToNextLevel(progress.xp);

  return (
    <div className="bg-brand-offwhite min-h-screen pb-48 lg:pb-64 selection:bg-brand-gold/20 selection:text-brand-ink">
      {/* Editorial Header */}
      <section className="bg-brand-ink text-brand-offwhite pt-32 pb-32 border-b border-brand-gold/10 relative overflow-hidden rounded-b-[40px] shadow-2xl z-20">
        <div className="absolute inset-0 bg-engraving opacity-10" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-gold/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="mx-auto max-w-7xl px-8 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
            <div className="max-w-2xl">
              <motion.span 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-brand-gold mb-6"
              >
                Panel del Estudiante • ID: {user?.uid?.slice(0, 8) || "INVITADO"}
              </motion.span>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="font-serif text-5xl md:text-7xl leading-tight mb-6 tracking-tight"
              >
                Su Archivo <span className="italic text-brand-gold">Central</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-lg text-white/50 leading-relaxed font-sans font-light max-w-xl"
              >
                Usted está navegando por la cartografía de sus propios hallazgos intelectuales. Cada lectura enciende una neurona en el gran archivo universal.
              </motion.p>
            </div>

            {user && (
              <div className="flex flex-col gap-4 lg:items-end relative">
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-6 group relative z-10 bg-white/5 backdrop-blur-md p-4 rounded-3xl border border-white/10"
                >
                  <button
                    onClick={() => setShowAvatarSelector(true)}
                    className="relative w-24 h-24 bg-brand-ink rounded-2xl text-brand-gold flex items-center justify-center transition-all group/avatar shadow-lg overflow-hidden border border-brand-gold/30 hover:border-brand-gold/60"
                  >
                    <div className="absolute inset-0 bg-brand-gold/5 animate-pulse" />
                    
                    {/* Efecto de humo/fuego azul suave de fondo */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none mix-blend-screen z-0 opacity-80">
                      <motion.div 
                        className="absolute bottom-[-20%] left-1/2 -translate-x-1/2 w-[120%] h-[120%] bg-cyan-500/20 blur-[20px] rounded-full"
                        animate={{ 
                          y: ['10%', '-20%', '10%'], 
                          opacity: [0.5, 0.9, 0.5],
                          scale: [1, 1.2, 1]
                        }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      />
                    </div>

                    {currentAvatar.image ? (
                      <motion.img 
                        src={currentAvatar.image} 
                        className="absolute inset-0 w-full h-full object-cover grayscale opacity-70 group-hover/avatar:grayscale-0 group-hover/avatar:opacity-100 transition-all duration-700 z-10" 
                        alt={currentAvatar.name}
                        animate={{ 
                          y: [0, -3, 0] 
                        }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      />
                    ) : (
                      <CurrentIcon className={cn("w-10 h-10 relative z-10", getAvatarGlow((currentAvatar as any).color))} />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/80 via-transparent to-transparent z-20" />
                    <div className="absolute inset-x-0 bottom-0 py-2 bg-brand-gold/90 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity z-30">
                      <span className="text-[8px] uppercase font-bold text-brand-ink tracking-[0.2em] text-center">
                        Cambiar
                      </span>
                    </div>
                  </button>
                  <div className="pr-4">
                    <h2 className="font-serif text-2xl text-white mb-1 leading-tight">
                      {user.displayName || "Anónimo"}
                    </h2>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-gold">
                        {currentAvatar.name}
                      </span>
                      <span className="text-[9px] text-white/40 font-mono tracking-widest italic">
                        {user.email}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-8 -mt-16 relative z-30 space-y-8">
        {/* PROMINENT HERO: Habitación del Conocimiento 2D Interactiva */}
        <section className="shadow-2xl rounded-3xl overflow-hidden relative">
          <div className="bg-brand-ink text-brand-gold p-3 px-6 flex items-center justify-between border-b border-brand-gold/30">
            <span className="text-xs font-mono font-bold uppercase tracking-widest flex items-center gap-2">
              <Sparkles size={14} /> Motor de Habitación 2D Aeterna
            </span>
            <Link 
              href="/room-engine"
              className="px-4 py-1.5 bg-brand-gold text-brand-ink text-[10px] font-mono font-bold uppercase tracking-widest rounded-xl hover:bg-white hover:text-black transition-all flex items-center gap-2"
            >
              <span>Abrir Room Engine 2D (/room-engine)</span>
              <ArrowRight size={12} />
            </Link>
          </div>
          <RoomProvider>
            <AeternaKnowledgeRoom />
          </RoomProvider>
        </section>

        {/* Bento Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Detailed Daily Challenge Card (Prominent at top) */}
          {dailyChallenge && (
            <motion.div 
              whileHover={{ scale: 1.01 }}
              className="lg:col-span-4 bg-white border border-brand-border/40 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 shadow-xl shadow-brand-blue/5 relative overflow-hidden mb-4"
            >
              <div className="absolute top-0 right-0 p-8 text-brand-gold/5 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
                <BrainCircuit size={240} />
              </div>
              <div className="relative z-10 flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-gold/10 rounded-full mb-4">
                  <Flame className="w-4 h-4 text-brand-gold" />
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-gold">Misión Activa</span>
                </div>
                <h4 className="font-serif text-3xl md:text-4xl text-brand-ink mb-3">
                  {dailyChallenge.title.split(':')[0]} <span className="italic">{dailyChallenge.title.split(':')[1] || ''}</span>
                </h4>
                <p className="text-sm text-brand-muted leading-relaxed max-w-3xl">
                  {dailyChallenge.description}
                </p>
              </div>
              {dailyChallenge.path ? (
                <Link href={dailyChallenge.path}
                  className="shrink-0 px-8 py-4 bg-brand-ink text-brand-offwhite text-xs uppercase font-bold tracking-[0.2em] hover:bg-brand-gold rounded-xl transition-all shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:scale-105 hover:shadow-[0_8px_30px_rgba(197,160,89,0.3)] flex items-center gap-3"
                >
                  Continuar Estudio <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <div className="shrink-0 px-8 py-4 bg-brand-border/50 text-brand-muted text-xs uppercase font-bold tracking-[0.2em] rounded-xl flex items-center gap-3">
                  <Star className="w-4 h-4" /> Maestría Alcanzada
                </div>
              )}
            </motion.div>
          )}

          {/* Main Level Progress */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="md:col-span-2 bg-gradient-to-br from-white to-brand-offwhite/50 border border-brand-border/50 rounded-2xl p-8 flex flex-col justify-between h-[360px] shadow-lg shadow-brand-blue/5 group overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
            <div className="relative z-10 flex justify-between items-start">
              <div>
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-muted mb-2 block">Nivel Actual</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-sans font-medium text-brand-muted">Lvl</span>
                  <div className="text-8xl font-serif leading-none text-brand-ink group-hover:text-brand-gold transition-colors drop-shadow-sm">
                    {progress.level}
                  </div>
                </div>
              </div>
              <div className="w-16 h-16 bg-white shrink-0 rounded-2xl shadow-md border border-brand-border flex items-center justify-center">
                <Flame className="w-8 h-8 text-brand-gold mb-1" />
              </div>
            </div>
            
            <div className="relative z-10">
               <div className="flex justify-between items-end mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-ink/80 flex items-center gap-2">
                    <Zap className="w-3 h-3 text-brand-gold" /> Progreso
                  </span>
                  <span className="text-xs font-mono font-bold text-brand-gold">{formatXP(progressStats.currentLevelXp)} <span className="text-brand-muted">/ {formatXP(progressStats.xpForNextLevel)} XP</span></span>
               </div>
               <div className="h-3 bg-brand-border/50 w-full relative rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, Math.max(0, (progressStats.currentLevelXp / progressStats.xpForNextLevel) * 100))}%` }}
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-brand-gold/80 to-brand-gold rounded-full shadow-[inset_0_2px_4px_rgba(255,255,255,0.3)]"
                  />
               </div>
               
               <div className="mt-8 flex justify-end">
                 <button 
                   onClick={() => setShowResetConfirm(true)}
                   className="group flex items-center gap-2 px-3 py-1.5 rounded-lg border border-red-500/10 text-red-500/60 text-[10px] uppercase tracking-widest font-bold hover:bg-red-50 hover:text-red-600 hover:border-red-500/30 transition-all"
                 >
                   <LogOut className="w-3 h-3" />
                   Reiniciar
                 </button>
               </div>
            </div>
          </motion.div>

          {/* Quick Stats Column 1 */}
          <div className="flex flex-col gap-4 h-[360px]">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="flex-1 bg-brand-ink rounded-2xl p-6 flex flex-col justify-between border border-brand-ink shadow-lg shadow-brand-ink/10 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
              <div className="relative z-10 flex justify-between items-start">
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-gold">Racha de Vigilia</span>
                <Flame className="w-4 h-4 text-brand-gold opacity-50" />
              </div>
              <div className="relative z-10 flex items-baseline gap-3 mb-1">
                <span className="text-6xl font-serif text-white">{progress.dailyStreak}</span>
                <span className="text-xs uppercase font-bold text-white/50 tracking-widest">Días</span>
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="flex-1 bg-white rounded-2xl p-6 border border-brand-border/50 flex flex-col justify-between shadow-lg shadow-brand-blue/5 overflow-hidden relative"
            >
              <div className="relative z-10 flex justify-between items-start">
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-muted">Tomos Leídos</span>
                <BookOpen className="w-4 h-4 text-brand-gold opacity-50" />
              </div>
              <div className="relative z-10 flex items-baseline gap-3 mt-4">
                <span className="text-5xl font-serif text-brand-ink">{Object.keys(progress.articleProgress || {}).length}</span>
                <span className="text-xs uppercase font-bold text-brand-gold tracking-widest">Temas</span>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-brand-border/30">
                 <div 
                   className="h-full bg-brand-gold relative" 
                   style={{ 
                     width: `${articles.length > 0 ? (Object.keys(progress.articleProgress || {}).length / articles.length) * 100 : 0}%` 
                   }} 
                 >
                   <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-brand-gold rounded-full shadow-[0_0_8px_rgba(212,175,55,1)]" />
                 </div>
              </div>
            </motion.div>
          </div>

          {/* Achievements Highlight */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-brand-gold rounded-2xl p-8 flex flex-col justify-between h-[360px] shadow-lg shadow-brand-gold/20 relative overflow-hidden group text-brand-ink"
          >
            <div className="absolute -bottom-10 -right-10 p-4 opacity-10 transform group-hover:scale-110 group-hover:-rotate-12 transition-all duration-700 pointer-events-none">
               <Trophy size={240} />
            </div>
            
            <div className="relative z-10">
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-ink/70 flex items-center gap-2 mb-2">
                <Award className="w-4 h-4" /> Méritos
              </span>
              <div className="text-8xl font-serif leading-none italic drop-shadow-sm">
                {progress.achievements.length}
              </div>
            </div>
            
            <div className="relative z-10 bg-white/20 backdrop-blur-md rounded-xl p-5 border border-white/30">
              <h4 className="text-[9px] font-bold uppercase tracking-widest text-brand-ink/70 mb-1">Último Logro</h4>
              <p className="font-serif text-lg leading-tight mb-4">
                {progress.achievements.length > 0 
                  ? ACHIEVEMENTS[progress.achievements[progress.achievements.length - 1]].title
                  : "Descubre tu primer logro"}
              </p>
              <button 
                onClick={() => setShowAchievementsModal(true)} 
                className="inline-flex items-center justify-center w-full bg-brand-ink text-white py-2.5 rounded-lg text-[10px] uppercase font-bold tracking-[0.2em] hover:bg-brand-ink/90 transition-colors gap-2"
              >
                Ver Todos <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Enhanced Knowledge Pulse Widget - Full Width */}
        <div className="mt-8">
          <motion.div 
            whileHover={{ y: -5 }}
            className="md:col-span-2 lg:col-span-4 bg-white border border-brand-border/50 rounded-3xl p-10 lg:p-16 flex flex-col lg:flex-row gap-16 shadow-xl shadow-brand-blue/5 overflow-hidden relative"
          >
             <div className="absolute top-0 left-0 w-1 h-full bg-brand-gold opacity-50" />
             
             <div className="lg:w-2/5 flex flex-col">
                <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-brand-muted mb-8 block">Relieve del Intelecto</span>
                <h3 className="font-serif text-5xl mb-6">Equilibrio de <span className="italic underline decoration-brand-gold/30">Saberes</span></h3>
                <p className="text-[11px] text-brand-muted leading-relaxed mb-12 max-w-sm">
                   Esta visualización representa la expansión de su consciencia a través de las grandes ramas del conocimiento humano. Su forma es el reflejo directo de sus incursiones en la Biblioteca.
                </p>

                <div className="space-y-6 flex-1">
                   {branchStats.map(stat => (
                     <div key={stat.fullName} className="group/stat">
                        <div className="flex justify-between items-center mb-2">
                           <span className="text-[9px] font-bold uppercase tracking-widest text-brand-ink">{stat.fullName}</span>
                           <span className="text-[10px] font-mono text-brand-gold">{stat.value}%</span>
                        </div>
                        <div className="h-1 bg-brand-offwhite w-full relative">
                           <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${stat.value}%` }}
                              className="h-full bg-brand-gold"
                           />
                        </div>
                     </div>
                   ))}
                </div>

                <div className="mt-12 pt-8 border-t border-brand-border/10">
                   <h5 className="text-[10px] font-bold uppercase tracking-widest text-brand-ink mb-1">Diagnóstico Dimensional</h5>
                   <p className="text-[10px] text-brand-muted leading-relaxed italic">
                      Su {dominantBranch?.fullName || 'camino'} dicta la forma de su pensamiento. El {dominantBranch?.value || 0}% de exégesis en esta rama revela una predisposición natural hacia {dominantBranch?.id === 'humanidades' ? 'lo trascendente' : 'lo empírico'}.
                   </p>
                </div>
             </div>
             
             <div className="lg:w-3/5 min-h-[400px] lg:min-h-0 relative bg-brand-offwhite/30 border border-brand-border/50">
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                   <BrainCircuit size={300} />
                </div>
                
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={branchStats}>
                    <PolarGrid stroke="#e5e7eb" strokeDasharray="3 3" />
                    <PolarAngleAxis 
                      dataKey="fullName" 
                      tick={{ fill: '#1a1a1a', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em' }}
                    />
                    <PolarRadiusAxis 
                      angle={30} 
                      domain={[0, 100]} 
                      tick={{ fontSize: 8, fill: '#D4AF37' }}
                      axisLine={false}
                    />
                    {/* Shadow Layer for Depth */}
                    <Radar
                      name="Shade"
                      dataKey="value"
                      stroke="none"
                      fill="#000"
                      fillOpacity={0.05}
                    />
                    <Radar
                      name="Progreso"
                      dataKey="value"
                      stroke="#D4AF37"
                      strokeWidth={3}
                      fill="#D4AF37"
                      fillOpacity={0.2}
                      dot={{ r: 4, fill: '#D4AF37', stroke: '#fff', strokeWidth: 2 }}
                      activeDot={{ r: 6, fill: '#1a1a1a', stroke: '#D4AF37', strokeWidth: 2 }}
                    />
                  </RadarChart>
                </ResponsiveContainer>

                <div className="absolute bottom-8 right-8 text-[8px] uppercase tracking-widest font-bold text-brand-muted/50 font-mono">
                   Sincronización de Datos: Real-Time / {user?.uid?.slice(0, 4)}
                </div>
             </div>
          </motion.div>
        </div>

        {/* Dynamic Activity Feed & Map */}
        {/* Interactive Knowledge Map Section */}
        <div className="mt-32 grid grid-cols-1 lg:grid-cols-4 gap-24">
          <div className="lg:col-span-1 border-t border-brand-border pt-12" id="medallero">
            <div className="mb-12">
              <h3 className="font-serif text-4xl text-brand-ink mb-4 italic">
                Galardones
              </h3>
              <p className="text-[11px] text-brand-muted uppercase tracking-[0.2em] font-medium leading-relaxed">
                Su medallero de seda y lacre. Los hitos de su pensamiento.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-1 gap-8">
              {Object.entries(ACHIEVEMENTS).slice(0, 10).map(([id, achievement]) => {
                const isUnlocked = progress.achievements.includes(id);
                const Icon = achievement.icon as any;

                return (
                  <motion.div
                    key={id}
                    whileHover={{ x: isUnlocked ? 5 : 0 }}
                    onClick={() => {
                      if (isUnlocked) {
                        setSelectedAchievement({ id, unlocked: isUnlocked });
                      }
                    }}
                    className={`flex items-start gap-5 group transition-all p-4 ${isUnlocked ? "cursor-pointer bg-white rounded-2xl border border-brand-border/40 hover:border-brand-gold hover:shadow-lg shadow-sm" : "opacity-30 grayscale pointer-events-none"}`}
                  >
                    <div className={`p-3 rounded-xl border mt-1 shrink-0 ${isUnlocked ? 'border-brand-ink bg-brand-ink text-brand-gold shadow-md' : 'border-brand-border bg-brand-offwhite text-brand-muted'} transition-all`}>
                      {React.createElement(achievement.icon as any, { className: "w-5 h-5" })}
                    </div>
                    <div>
                      <h6 className="font-sans font-bold text-[10px] uppercase tracking-[0.2em] mb-1 leading-none">
                        {achievement.title}
                      </h6>
                      <p className="text-[10px] text-brand-muted font-sans font-light leading-tight mt-1 line-clamp-1">
                        {achievement.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Added Library Widget */}
            <div className="mt-24 pt-12 border-t border-brand-border">
               <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-brand-gold mb-4 block">Fuelle Intelectual</span>
               <h4 className="font-serif text-2xl mb-6">Su <span className="italic">Biblioteca</span> Privada</h4>
               <div className="space-y-4">
                  {articles.filter(a => (progress.articleProgress?.[a.slug || ''] || 0) > 0).slice(0, 3).map(a => (
                    <Link key={a.slug} href={getArticlePath(a)} className="group block bg-white border border-brand-border/40 p-4 rounded-2xl hover:border-brand-gold transition-colors shadow-sm hover:shadow-md">
                       <div className="flex justify-between items-center mb-2">
                          <span className="text-[10px] font-bold uppercase text-brand-ink group-hover:text-brand-gold transition-colors block max-w-[80%] truncate">{a.title}</span>
                          <span className="text-[9px] font-mono text-brand-gold">{progress.articleProgress?.[a.slug || ''] || 0}%</span>
                       </div>
                       <div className="h-1 bg-brand-border/30 w-full rounded-full overflow-hidden">
                          <div className="h-full bg-brand-gold/60 rounded-full" style={{ width: `${progress.articleProgress?.[a.slug || ''] || 0}%` }} />
                       </div>
                    </Link>
                  ))}
                  {articles.filter(a => (progress.articleProgress?.[a.slug || ''] || 0) > 0).length === 0 && (
                    <p className="text-[10px] text-brand-muted italic">Aún no ha rescatado tomos del olvido.</p>
                  )}
               </div>
            </div>
          </div>

          <div className="lg:col-span-3 border-t border-brand-border pt-12 relative min-h-[900px]">
             {/* Map Section */}
             <div className="mb-20 flex flex-col md:flex-row md:items-end md:justify-between gap-12">
                <div>
                  <span className="text-[10px] font-sans font-bold uppercase tracking-[0.6em] text-brand-gold mb-4 block">
                    Cartografía de la Sabiduría
                  </span>
                  <h2 className="font-serif text-6xl text-brand-ink leading-none tracking-tighter">
                    Su <span className="italic">Cosmografía</span> Personal
                  </h2>
                  <p className="text-brand-mixed opacity-60 font-sans text-base max-w-xl mt-6 leading-relaxed">
                    Las estrellas se alinean. Cada artículo completado es un faro en este desierto de ignorancia. Explore su mapa interactivo de conocimientos.
                  </p>
                </div>
                
                <div className="hidden md:block">
                   <div className="bg-brand-ink text-brand-offwhite px-6 py-4 flex items-center gap-6 border border-brand-gold/30 rounded-2xl shadow-xl shadow-brand-ink/10">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-brand-gold animate-pulse shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
                        <span className="text-[9px] uppercase font-bold tracking-widest">Sincronizado</span>
                      </div>
                      <div className="w-px h-8 bg-white/10" />
                      <span className="text-[11px] font-mono italic text-white/50">{new Date().toLocaleTimeString()}</span>
                   </div>
                </div>
             </div>
             
             <div className="w-full h-[600px] border border-brand-border/60 bg-gradient-to-b from-white to-brand-offwhite/50 shadow-2xl shadow-brand-blue/5 overflow-hidden mb-24 relative group/map rounded-3xl">
                <div className="absolute inset-0 bg-engraving opacity-[0.03] pointer-events-none" />
                <ConstellationMap articles={articles} articleProgress={progress.articleProgress || {}} />
                
                <div className="absolute top-6 left-6 flex flex-col gap-4 pointer-events-none">
                   <div className="bg-brand-ink/80 backdrop-blur-md border border-white/10 p-5 rounded-2xl inline-block shadow-xl">
                      <span className="text-[9px] uppercase font-bold tracking-widest text-brand-gold block mb-3">Leyenda del Mapa</span>
                      <div className="flex gap-6">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-brand-gold shadow-[0_0_8px_rgba(212,175,55,0.6)]" />
                          <span className="text-[9px] uppercase text-white/80 font-bold tracking-widest">Completado</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full border border-brand-gold/50" />
                          <span className="text-[9px] uppercase text-white/40 font-bold tracking-widest">En Curso</span>
                        </div>
                      </div>
                   </div>
                </div>
             </div>

             {/* Activity Log - New Section */}
             <div className="border-t border-brand-border pt-16">
                <div className="flex items-center gap-4 mb-12">
                   <Scroll className="text-brand-gold w-6 h-6" />
                   <div>
                      <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-brand-gold mb-1 block">Crónica de Actividad</span>
                      <h3 className="font-serif text-4xl">Recientes <span className="italic">Iluminaciones</span></h3>
                   </div>
                </div>
                
                <div className="space-y-6">
                   <motion.div 
                     initial={{ opacity: 0, x: -20 }}
                     whileInView={{ opacity: 1, x: 0 }}
                     viewport={{ once: true }}
                     className="flex gap-8 p-8 bg-white border border-brand-border/40 rounded-2xl group hover:border-brand-gold transition-all shadow-sm hover:shadow-lg"
                   >
                      <div className="w-12 h-12 bg-brand-ink rounded-xl flex items-center justify-center shrink-0 shadow-lg">
                         <BookOpen className="w-5 h-5 text-brand-gold" />
                      </div>
                      <div>
                         <span className="text-[9px] uppercase tracking-widest font-bold text-brand-muted mb-2 block">Hace 2 horas</span>
                         <h5 className="font-serif text-xl text-brand-ink mb-2">Reflexión sobre lo Inmanente</h5>
                         <p className="text-sm text-brand-mixed opacity-60 leading-relaxed font-sans max-w-2xl">
                           Ha profundizado en el concepto de la "Sustancia" según Spinoza. Su mapa se ha expandido hacia el cuadrante racionalista.
                         </p>
                      </div>
                   </motion.div>
                   
                   <motion.div 
                     initial={{ opacity: 0, x: -20 }}
                     whileInView={{ opacity: 1, x: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: 0.1 }}
                     className="flex gap-8 p-8 bg-white border border-brand-border/40 rounded-2xl group hover:border-brand-gold transition-all shadow-sm opacity-60 hover:opacity-100"
                   >
                      <div className="w-12 h-12 bg-brand-ink rounded-xl flex items-center justify-center shrink-0">
                         <Star className="w-5 h-5 text-brand-gold" />
                      </div>
                      <div>
                         <span className="text-[9px] uppercase tracking-widest font-bold text-brand-muted mb-2 block">Ayer</span>
                         <h5 className="font-serif text-xl text-brand-ink mb-2">Hito Alcanzado: Lector Decisivo</h5>
                         <p className="text-sm text-brand-mixed opacity-60 leading-relaxed font-sans max-w-2xl">
                           Al terminar el análisis de la dialéctica hegeliana, ha obtenido 500 unidades de XP.
                         </p>
                      </div>
                   </motion.div>

                   <motion.div 
                     initial={{ opacity: 0, x: -20 }}
                     whileInView={{ opacity: 1, x: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: 0.2 }}
                     className="flex gap-8 p-8 bg-brand-ink text-white border border-brand-ink/50 rounded-2xl shadow-xl relative overflow-hidden"
                   >
                      <div className="absolute inset-0 bg-engraving opacity-10" />
                      <div className="w-12 h-12 bg-brand-gold rounded-xl flex items-center justify-center shrink-0 relative z-10">
                         <Fingerprint className="w-5 h-5 text-brand-ink" />
                      </div>
                      <div className="relative z-10">
                         <span className="text-[9px] uppercase tracking-widest font-bold text-brand-gold mb-2 block">Evento de Seguridad</span>
                         <h5 className="font-serif text-xl text-white mb-2">Identidad Cifrada en la Logia</h5>
                         <p className="text-sm text-white/60 leading-relaxed font-sans max-w-2xl">
                           Su perfil ha sido sincronizado con los servidores centrales de la Biblioteca. Su legado está ahora a salvo del tiempo.
                         </p>
                      </div>
                   </motion.div>
                </div>
             </div>
          </div>
        </div>
      </div>


      {/* Avatar Selector Modal */}
      <AnimatePresence>
        {showAchievementsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-brand-ink/80 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setShowAchievementsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-brand-offwhite p-8 md:p-12 max-w-4xl w-full rounded-[32px] relative shadow-2xl border border-brand-border/40 max-h-[90vh] flex flex-col"
            >
              <button
                onClick={() => setShowAchievementsModal(false)}
                className="absolute top-8 right-8 text-brand-muted hover:text-brand-ink transition-colors z-10"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="mb-8 shrink-0">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand-gold mb-4 block">Medallero Completo</span>
                <h3 className="font-serif text-3xl md:text-4xl text-brand-ink mb-4">
                  Sus <span className="italic">Galardones</span>
                </h3>
              </div>

              <div className="overflow-y-auto pr-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1 min-h-0">
                {Object.entries(ACHIEVEMENTS).map(([id, achievement]) => {
                  const isUnlocked = progress.achievements.includes(id);
                  return (
                    <div
                      key={id}
                      onClick={() => {
                        if (isUnlocked) {
                          setSelectedAchievement({ id, unlocked: isUnlocked });
                        }
                      }}
                      className={cn(
                        "flex items-start gap-4 p-4 transition-all rounded-2xl border",
                        isUnlocked 
                          ? "cursor-pointer bg-white border-brand-border/40 hover:border-brand-gold shadow-sm hover:shadow-md" 
                          : "opacity-40 grayscale border-brand-border/20 bg-brand-border/5 pointer-events-none"
                      )}
                    >
                      <div className={cn(
                         "p-3 rounded-xl border mt-1 shrink-0 transition-all",
                         isUnlocked ? "border-brand-ink bg-brand-ink text-brand-gold shadow-md" : "border-brand-border bg-white text-brand-muted"
                      )}>
                        {React.createElement(achievement.icon as any, { className: "w-5 h-5" })}
                      </div>
                      <div>
                        <h6 className="font-sans font-bold text-[10px] uppercase tracking-[0.2em] mb-1 leading-none text-brand-ink">
                          {achievement.title}
                        </h6>
                        <p className="text-[10px] text-brand-muted font-sans font-light leading-tight mt-1 line-clamp-2">
                          {achievement.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Avatar Selector Modal */}
      <AnimatePresence>
        {showAvatarSelector && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-brand-ink/80 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setShowAvatarSelector(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-brand-ink p-12 max-w-2xl w-full rounded-[32px] relative shadow-2xl border border-brand-gold/20"
            >
              <button
                onClick={() => setShowAvatarSelector(false)}
                className="absolute top-8 right-8 text-brand-offwhite/40 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="mb-12">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand-gold mb-4 block">Personalización</span>
                <h3 className="font-serif text-4xl text-white mb-4">
                  Seleccione su <span className="italic">Arquetipo</span>
                </h3>
                <p className="text-brand-offwhite/40 text-sm font-sans font-light leading-relaxed max-w-md">
                  A medida que su nivel de exégesis aumenta, se desbloquean nuevas representaciones simbólicas de su conocimiento acumulado.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {(AVATARS as any[]).map((avatar) => {
                  const isUnlocked = progress.level >= avatar.requiredLevel;
                  const isSelected = progress.selectedAvatarId === avatar.id;
                  const Icon = avatar.icon;

                  return (
                    <button
                      key={avatar.id}
                      onClick={() => {
                        if (isUnlocked) {
                          selectAvatar(avatar.id);
                          setShowAvatarSelector(false);
                        }
                      }}
                      disabled={!isUnlocked}
                      className={cn(
                        "relative flex flex-col items-center justify-center p-6 transition-all group aspect-square border overflow-hidden rounded-2xl",
                        isSelected 
                          ? "bg-brand-gold/10 border-brand-gold shadow-[0_0_30px_rgba(212,175,55,0.1)]" 
                          : isUnlocked 
                            ? "bg-brand-ink border-white/10 hover:border-brand-gold/50 cursor-pointer" 
                            : "bg-brand-ink/50 border-white/5 opacity-50 cursor-not-allowed"
                      )}
                    >
                      <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[7px] font-bold uppercase tracking-[0.3em] text-brand-gold/40">
                        {avatar.name}
                      </div>

                      <div className={cn(
                        "w-full h-full absolute inset-0 transition-all duration-1000",
                        isSelected ? "scale-110" : "group-hover:scale-105"
                      )}>
                        {avatar.image ? (
                          <motion.img 
                            src={avatar.image} 
                            className={cn(
                              "w-full h-full object-cover transition-all grayscale duration-700 relative z-0",
                              isUnlocked ? (isSelected ? "grayscale-0 opacity-100" : "group-hover:grayscale-0 opacity-40 group-hover:opacity-100") : "opacity-20 grayscale"
                            )} 
                            alt={avatar.name} 
                            animate={isUnlocked ? {
                              y: [0, -4, 0],
                              scale: [1, 1.03, 1]
                            } : {}}
                            transition={{
                              duration: 4,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center relative z-0">
                            <Icon className={cn("w-10 h-10", getAvatarGlow(avatar.color, isUnlocked))} />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/90 via-brand-ink/20 to-transparent z-10" />
                        
                        {/* Efecto de humo/fuego azul suave */}
                        {isUnlocked && (
                          <div className="absolute inset-0 overflow-hidden pointer-events-none mix-blend-screen z-20 opacity-60 mix-blend-lighten">
                            <motion.div 
                              className="absolute top-1/2 left-1/2 -translate-x-1/2 w-3/4 h-3/4 bg-cyan-500/30 blur-[25px] rounded-full"
                              animate={{ 
                                y: ['20%', '-10%', '20%'], 
                                opacity: [0.4, 0.8, 0.4],
                                scale: [1, 1.3, 1]
                              }}
                              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            />
                            <motion.div 
                              className="absolute top-1/2 left-1/2 -translate-x-1/2 w-1/2 h-[120%] bg-blue-600/40 blur-[30px] rounded-[100%]"
                              animate={{ 
                                y: ['10%', '-30%', '10%'], 
                                opacity: [0.3, 0.7, 0.3],
                                scale: [1, 1.5, 1],
                                rotate: [0, 10, -10, 0]
                              }}
                              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            />
                            <motion.div 
                              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-1/2 bg-brand-gold/10 blur-[20px] rounded-full"
                              animate={{ 
                                opacity: [0.2, 0.5, 0.2]
                              }}
                              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            />
                          </div>
                        )}
                      </div>

                      <div className="absolute inset-0 border border-brand-gold/0 group-hover:border-brand-gold/20 transition-all z-10" />

                      <div className="absolute bottom-4 text-center">
                        {!isUnlocked && (
                           <div className="text-[8px] uppercase tracking-widest font-bold text-brand-offwhite/40">
                             Nivel {avatar.requiredLevel}
                           </div>
                        )}
                        {isSelected && (
                           <div className="text-[8px] uppercase tracking-widest font-bold text-brand-gold">
                             Activo
                           </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Achievement Detail Modal */}
      <AnimatePresence>
        {selectedAchievement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-brand-ink/80 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setSelectedAchievement(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white p-12 max-w-md w-full relative shadow-2xl border border-brand-border"
            >
              <button
                onClick={() => setSelectedAchievement(null)}
                className="absolute top-8 right-8 text-brand-muted hover:text-brand-ink transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="text-center">
                <div className="w-24 h-24 bg-brand-gold/10 flex items-center justify-center mx-auto mb-8">
                  {React.createElement(
                    ACHIEVEMENTS[selectedAchievement.id].icon,
                    { className: "w-10 h-10 text-brand-gold" },
                  )}
                </div>

                <span className="text-[10px] uppercase font-bold tracking-[0.4em] text-brand-gold mb-4 block">
                  Galardón Obtenido
                </span>

                <h3 className="font-serif text-4xl text-brand-ink mb-6">
                  {ACHIEVEMENTS[selectedAchievement.id].title}
                </h3>

                <p className="text-brand-muted leading-relaxed mb-10 font-sans font-light italic">
                  {ACHIEVEMENTS[selectedAchievement.id].description}
                </p>

                <div className="bg-brand-ink px-6 py-4 inline-block">
                  <div className="flex items-center gap-3">
                    <Star className="w-4 h-4 text-brand-gold" />
                    <span className="font-bold text-white text-[11px] uppercase tracking-widest">
                      +{formatXP(ACHIEVEMENTS[selectedAchievement.id].xp)} Unidades XP
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reset Confirmation Modal */}
      <AnimatePresence>
        {showResetConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-brand-ink/90 flex items-center justify-center p-4 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white p-12 max-w-sm w-full text-center border border-brand-border"
            >
              <h3 className="font-serif text-3xl mb-4 text-red-600 italic">¿Borrar Historial?</h3>
              <p className="text-sm text-brand-muted mb-8 leading-relaxed">
                Esta acción eliminará permanentemente su XP, Niveles y artículos completados en la Gran Logia.
              </p>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleReset}
                  className="w-full bg-red-600 text-white py-4 text-[10px] uppercase font-bold tracking-[0.4em] hover:bg-red-700 transition-colors"
                >
                  Confirmar Purga
                </button>
                <button 
                  onClick={() => setShowResetConfirm(false)}
                  className="w-full bg-brand-offwhite text-brand-ink py-4 text-[10px] uppercase font-bold tracking-[0.4em] hover:bg-brand-border transition-colors border border-brand-border"
                >
                  Mantener Legado
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Level Info */}
      <div className="mx-auto max-w-7xl px-8 mt-32 pb-48 lg:pb-64 border-t border-brand-border/30 pt-24 text-center">
        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand-gold mb-4 block">Escalamiento de la Realidad</span>
        <h3 className="font-serif text-5xl mb-16">Tabla de <span className="italic">Niveles & XP</span></h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {[1, 5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((lvl, idx) => {
            const base = 15000;
            const mult = 1.0415;
            const xpTotal = Math.floor(base * (Math.pow(mult, lvl - 1) - 1));
            const range = [...AVATARS].reverse().find(a => a.requiredLevel <= lvl)?.name || "Iniciado";
            const isActive = progress.level >= lvl;
            
            return (
              <motion.div 
                key={lvl} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className={`p-6 border transition-all ${isActive ? 'border-brand-gold bg-brand-gold/5 shadow-lg' : 'border-brand-border opacity-30 grayscale'} flex flex-col gap-3 relative group`}
              >
                <div className="absolute top-2 right-2 opacity-10 group-hover:opacity-100 transition-opacity">
                   <Star className="w-3 h-3 text-brand-gold" />
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${isActive ? 'text-brand-gold' : 'text-brand-muted'}`}>Nv. {lvl}</span>
                <span className="text-2xl font-serif">{formatXP(xpTotal)}</span>
                <div className="h-px bg-brand-gold/20 w-8 mx-auto my-1" />
                <span className="text-[8px] uppercase tracking-widest font-bold opacity-60 leading-none h-4">
                   {range}
                </span>
              </motion.div>
            );
          })}
        </div>
        <p className="mt-16 text-[11px] text-brand-muted italic max-w-xl mx-auto leading-relaxed">
          * Su progresión intelectual sigue una curva exponencial del 4.15%. Navegar los 1,911 pilares del canon universal (aprox. 860,000 XP) le permitirá alcanzar el Nivel 100 y la Trascendencia Total.
        </p>
      </div>
    </div>
  );
}
