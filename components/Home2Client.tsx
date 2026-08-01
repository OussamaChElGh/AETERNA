'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'motion/react';
import { ArrowRight, BookOpen, Quote, Target, Sparkles, Hexagon, Lock, Clock, ChevronDown, Zap, Trophy, Award, Package } from 'lucide-react';
import { useGamification, formatXP } from '@/context/GamificationContext';
import { LearningPath, LearningPathArticle, LearningPathLevel } from '@/components/LearningPath';
import { NexusNode3D } from '@/components/NexusNode3D';
import { Starfield } from '@/components/Starfield';
import { evaluateRoomUnlocks } from '@/lib/roomEngineStorage';
import relicsData from '@/data/relics.json';
import { CATEGORIES_DATA } from '@/data/categories';
import { cn } from '@/lib/utils';

interface Home2ClientProps {
  levels: LearningPathLevel[];
  articles: LearningPathArticle[];
  articleContent: Record<string, { introduccion?: string; secciones?: { titulo: string; niveles?: Record<string, string> }[] }>;
}

const ORBITS = [
  { id: "inner", radius: 24, duration: 30, phase: 0.35, categories: ["ciencias_naturales", "ciencias_formales"] },
  { id: "mid", radius: 36, duration: 42, phase: 1.1, categories: ["ciencias_sociales", "humanidades", "artes"] },
  { id: "outer", radius: 48, duration: 56, phase: 0.75, categories: ["aplicadas", "idiomas"] },
];

const LIVE_CATEGORIES = new Set(["ciencias_naturales"]);

const SPARKLES = Array.from({ length: 10 }, (_, i) => {
  const angle = (i / 10) * Math.PI * 2;
  return {
    x: Math.cos(angle) * 30,
    y: Math.sin(angle) * 30,
    delay: Math.random() * 0.15,
  };
});

function OrbitalNode({ category, angle, radius, duration, live, active, delay = 0, onClick, onHover, onLeave }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: "spring", stiffness: 100 }}
      className="absolute pointer-events-none"
      style={{
        left: `calc(50% + (${radius}% * cos(${angle}rad)))`,
        top: `calc(50% + (${radius}% * sin(${angle}rad)))`,
      }}
    >
      <motion.div
        animate={{ rotateZ: -360 }}
        transition={{ duration, repeat: Infinity, ease: "linear" }}
        className="w-14 h-14 md:w-24 md:h-24 -translate-x-1/2 -translate-y-1/2"
      >
        <button
          onClick={onClick}
          onMouseEnter={onHover}
          onMouseLeave={onLeave}
          className={cn(
            "group pointer-events-auto relative w-full h-full cursor-pointer transition-all",
            live ? "" : "cursor-default"
          )}
        >
          {/* Nodo visual */}
          <div className={cn(
            "w-full h-full rounded-full flex items-center justify-center transition-all duration-300 p-1.5 relative",
            live
              ? active
                ? "bg-brand-cosmic/10 border-2 border-brand-cosmic shadow-[0_0_50px_rgba(14,165,233,0.5)] scale-110"
                : "bg-brand-ink/50 backdrop-blur-md border border-brand-gold/40 hover:border-brand-cosmic hover:shadow-[0_0_35px_rgba(14,165,233,0.3)]"
              : "bg-brand-ink/30 border border-brand-offwhite/10 opacity-50 saturate-0 hover:opacity-80 hover:saturate-50"
          )}>
            <NexusNode3D id={category.id} active={active && live} />
            {!live && (
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-brand-ink border border-brand-gold/30 flex items-center justify-center z-20">
                <Lock size={10} className="text-brand-gold/60" />
              </div>
            )}
          </div>

          {/* Destello de partículas al hacer hover (solo nodos vivos) */}
          {live && active && (
            <motion.div className="absolute inset-0 pointer-events-none">
              {SPARKLES.map((s, i) => (
                <motion.span
                  key={i}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
                  animate={{ x: s.x, y: s.y, opacity: [1, 1, 0], scale: [0, 1, 0.3] }}
                  transition={{ duration: 0.8, delay: s.delay, repeat: Infinity, repeatDelay: 1.2, ease: "easeOut" }}
                  className="absolute left-1/2 top-1/2 w-1 h-1 rounded-full bg-brand-gold shadow-[0_0_6px_rgba(212,175,55,0.8)]"
                />
              ))}
            </motion.div>
          )}

          {/* Label */}
          <div className={cn(
            "absolute top-full mt-4 left-1/2 -translate-x-1/2 flex flex-col items-center transition-all duration-500 pointer-events-none",
            active ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
          )}>
            <span className={cn(
              "text-[9px] md:text-[10px] font-bold uppercase tracking-[0.35em] whitespace-nowrap px-3 py-1 backdrop-blur-md border",
              live
                ? "text-brand-cosmic bg-brand-ink/80 border-brand-cosmic/30"
                : "text-brand-gold/60 bg-brand-ink/80 border-brand-gold/20"
            )}>
              {live ? category.name : "Próximamente"}
            </span>
          </div>
        </button>
      </motion.div>
    </motion.div>
  );
}

function pickDailyFragment(content: Record<string, { introduccion?: string; secciones?: { titulo: string; niveles?: Record<string, string> }[] }>, articles: LearningPathArticle[]): { text: string; article: LearningPathArticle } | null {
  if (!articles || articles.length === 0) return null;
  const dayOffset = Math.floor(Date.now() / 86400000);
  const article = articles[dayOffset % articles.length];
  const data = content[article.slug];

  const candidates: string[] = [];
  if (data?.introduccion) {
    const parts = data.introduccion.split('\n').filter(l => l.trim().length > 30 && !l.startsWith('#') && !l.startsWith('**['));
    if (parts.length > 0) candidates.push(parts[0]);
  }
  for (const sec of data?.secciones || []) {
    for (const lvl of ['principiante', 'intermedio', 'avanzado']) {
      const body = sec.niveles?.[lvl];
      if (!body) continue;
      const sentences = body.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 25 && s.trim().length < 200 && !s.startsWith('```') && !s.startsWith('|'));
      if (sentences.length > 0) candidates.push(sentences[0]);
    }
  }

  if (candidates.length === 0) return null;
  const pick = candidates[dayOffset % candidates.length];
  return { text: pick.replace(/\*\*/g, '').trim().slice(0, 180), article };
}

export function Home2Client({ levels, articles, articleContent }: Home2ClientProps) {
  const { progress } = useGamification();
  const [mounted, setMounted] = useState(false);
  const [hoverNode, setHoverNode] = useState<string | null>(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 50, damping: 20 });
  const smy = useSpring(my, { stiffness: 50, damping: 20 });
  const tiltX = useTransform(smy, [-0.5, 0.5], [66, 58]);
  const tiltZ = useTransform(smx, [-0.5, 0.5], [-10, -18]);
  const sceneX = useTransform(smx, [-0.5, 0.5], [12, -12]);
  const sceneY = useTransform(smy, [-0.5, 0.5], [8, -8]);
  const planeTransform = useMotionTemplate`rotateX(${tiltX}deg) rotateZ(${tiltZ}deg)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  useEffect(() => { setMounted(true); }, []);

  const completedArticles = new Set(
    (progress.completedPaths || []).map(p => p.replace('article_read_', '').replace(/^.*\//, ''))
  );

  const layersByArticle: Record<string, string[]> = {};
  for (const [slug, layers] of Object.entries(progress.completedLayers || {})) {
    layersByArticle[slug] = layers;
  }

  const dailyFragment = mounted ? pickDailyFragment(articleContent, articles) : null;
  const focusedCategory = hoverNode ? CATEGORIES_DATA.find(c => c.id === hoverNode) : null;
  const focusedIsLive = focusedCategory ? LIVE_CATEGORIES.has(focusedCategory.id) : false;

  // Stats for progression panel
  const totalLayers = Object.values(progress.completedLayers || {}).reduce((s, arr) => s + (Array.isArray(arr) ? arr.length : 0), 0);
  const { unlockedIds } = evaluateRoomUnlocks({
    completedPaths: progress.completedPaths || [],
    completedLayers: progress.completedLayers || {}
  });
  const relicUnlockedCount = (relicsData.relics || []).filter(r =>
    (progress.completedLayers?.[r.unlocksOn.article] || []).includes(r.unlocksOn.layer)
  ).length;
  const levelInfo = {
    level: progress.level || 1,
    nextLevel: progress.xp
  };

  return (
    <div className="home-page-container bg-brand-ink min-h-screen relative selection:bg-brand-gold selection:text-brand-ink overflow-x-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-brand-ink/40" />
        <div className="absolute inset-0 bg-engraving opacity-[0.03]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(212,175,55,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(212,175,55,0.02)_1px,transparent_1px)] bg-[size:100px_100px]" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-brand-ink to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-brand-ink via-brand-ink/80 to-transparent" />
      </div>

      {/* HERO — LA HABITACIÓN COMO MAPA DEL SABER */}
      <section
        onMouseMove={handleMouseMove}
        className="relative min-h-[600px] flex items-center justify-center p-4 overflow-hidden"
      >
        {/* Starfield base — llena las bandas donde la imagen no llega */}
        <Starfield className="absolute inset-0 w-full h-full pointer-events-none" />

        {/* Contenedor con el aspect ratio exacto de la imagen — centrado */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="relative"
            style={{
              width: 'min(96vw, 1300px, calc(100vh * 1.6))',
              aspectRatio: '1445 / 1088'
            }}
          >
            {/* Halo luminoso detrás — funde con el espacio */}
            <img 
              src="/images/hero-fantasy-room.png"
              className="absolute inset-0 w-full h-full object-contain object-center scale-[1.35] blur-[140px] opacity-80"
              alt=""
              aria-hidden="true"
            />

            {/* Estancia de fantasía — bordes totalmente difuminados */}
            <img 
              src="/images/hero-fantasy-room.png"
              className="absolute inset-0 w-full h-full object-contain object-center"
              style={{
                maskImage: 'radial-gradient(ellipse 130% 90% at center, black 45%, transparent 68%)',
                WebkitMaskImage: 'radial-gradient(ellipse 130% 90% at center, black 45%, transparent 68%)'
              }}
              alt="Estancia del Sabio"
            />
          </div>
        </div>

          <motion.div
            className="relative w-full h-full max-w-5xl mx-auto flex items-center justify-center"
            style={{ paddingTop: "6%" }}
          >
            {/* Sistema de anillos 3D */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              style={{ perspective: "1400px", x: sceneX, y: sceneY }}
              className="relative w-[min(88vw,620px)] md:w-[min(88vw,720px)] lg:w-[min(50vw,700px)] aspect-square"
            >
            {/* Plano orbital inclinado */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{ transformStyle: "preserve-3d", transform: planeTransform }}
            >
              {/* Anillos */}
              {ORBITS.map((orbit) => (
                <div
                  key={orbit.id}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border"
                  style={{
                    width: `${orbit.radius * 2}%`,
                    height: `${orbit.radius * 2}%`,
                    borderColor: "rgba(212,175,55,0.14)",
                    boxShadow: "0 0 60px rgba(212,175,55,0.05)",
                  }}
                />
              ))}
              {/* Micro-anillo decorativo interior */}
              <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand-gold/5"
                style={{ width: "16%", height: "16%" }}
              />
              {/* Portadores orbitales (rotan) */}
              {ORBITS.map((orbit) => (
                <motion.div
                  key={`carrier-${orbit.id}`}
                  animate={{ rotateZ: 360 }}
                  transition={{ duration: orbit.duration, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0"
                >
                  {orbit.categories.map((catId, i) => {
                    const cat = CATEGORIES_DATA.find((c) => c.id === catId);
                    if (!cat) return null;
                    const angle = orbit.phase + (i / orbit.categories.length) * Math.PI * 2;
                    const live = LIVE_CATEGORIES.has(catId);
                    return (
                      <OrbitalNode
                        key={catId}
                        category={cat}
                        angle={angle}
                        radius={orbit.radius}
                        duration={orbit.duration}
                        live={live}
                        active={hoverNode === catId}
                        delay={0.8 + i * 0.15}
                        onHover={() => setHoverNode(catId)}
                        onLeave={() => setHoverNode(null)}
                        onClick={() => {
                          if (live && cat.path) {
                            window.location.href = cat.path;
                          }
                        }}
                      />
                    );
                  })}
                </motion.div>
              ))}
            </motion.div>

            {/* Núcleo central AETERNA */}
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none"
            >
              <div className="relative group pointer-events-none">
                <div className="absolute inset-0 rounded-full bg-brand-gold opacity-20 blur-[60px] animate-pulse group-hover:opacity-40 transition-opacity" />
                <div className="absolute inset-0 rounded-full bg-brand-cosmic opacity-20 blur-[80px] animate-pulse scale-125 mix-blend-screen group-hover:opacity-50 transition-opacity" />
                <div className="w-40 h-40 md:w-56 md:h-56 border-2 border-brand-gold flex items-center justify-center bg-brand-ink/80 backdrop-blur-3xl shadow-[0_0_80px_rgba(14,165,233,0.15)] transition-all p-5 relative">
                  <div className="absolute inset-0 z-0 overflow-hidden opacity-40">
                    <NexusNode3D id="core" active={!!hoverNode} />
                  </div>
                  <div className="absolute inset-2 border border-brand-gold/20 pointer-events-none" />
                  <div className="text-center relative z-10 w-full">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center"
                    >
                      <Hexagon size={200} className="text-brand-gold" />
                    </motion.div>
                    <h1 className="font-serif text-3xl md:text-5xl tracking-tight leading-none text-brand-offwhite mb-2">
                      AE<span className="italic text-brand-gold">TER</span>NA
                    </h1>
                    <div className="flex items-center justify-center gap-2 text-[7px] md:text-[8px] font-bold uppercase tracking-[0.4em] text-brand-gold">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-ping" />
                      El Camino del Sabio
                    </div>
                  </div>
                </div>

                {/* Holograma central - información del nodo enfocado */}
                <AnimatePresence>
                  {focusedCategory && (
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 16 }}
                      transition={{ duration: 0.4, ease: "circOut" }}
                      className="absolute top-full mt-8 left-1/2 -translate-x-1/2 w-[320px] md:w-[420px] text-center"
                    >
                      {focusedIsLive ? (
                        <div className="relative border border-brand-gold/40 bg-brand-ink/80 backdrop-blur-xl px-6 py-5">
                          <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-brand-gold" />
                          <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-brand-gold" />
                          <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-brand-gold" />
                          <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-brand-gold" />
                          <div className="flex items-center justify-center gap-3 mb-3">
                            <focusedCategory.icon size={16} className="text-brand-gold" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand-gold">
                              {focusedCategory.name}
                            </span>
                          </div>
                          <p className="font-serif text-2xl text-brand-offwhite mb-2 italic">Portal abierto</p>
                          <p className="text-[10px] text-brand-offwhite/50 mb-5 leading-relaxed">
                            {articles.length} guías disponibles · Física completa
                          </p>
                          {focusedCategory.path && (
                            <a
                              href={focusedCategory.path}
                              onClick={(e) => {
                                if (!LIVE_CATEGORIES.has(focusedCategory.id)) return;
                              }}
                              className="inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.4em] text-brand-gold border border-brand-gold/40 px-6 py-3 hover:bg-brand-gold hover:text-brand-ink transition-all"
                            >
                              Entrar <ArrowRight size={12} />
                            </a>
                          )}
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-3 border border-brand-offwhite/10 bg-brand-ink/70 backdrop-blur-md px-6 py-3">
                          <Clock size={12} className="text-brand-offwhite/40" />
                          <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-brand-offwhite/40">
                            {focusedCategory.name} · Próximamente
                          </span>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
          </motion.div>

        {/* CTA — Personalizar Estancia */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-20 left-1/2 -translate-x-1/2 z-30"
        >
          <Link
            href="/room-engine"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-brand-gold text-brand-ink text-[10px] font-bold uppercase tracking-[0.4em] shadow-[0_0_40px_rgba(212,175,55,0.4)] hover:bg-brand-offwhite transition-all"
          >
            <Hexagon size={14} className="group-hover:rotate-90 transition-transform duration-500" />
            Personalizar Estancia
            <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </motion.div>

        {/* Panel de Progreso — recompensas del estudio */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-30 hidden lg:block"
        >
          <div className="relative w-[240px] bg-brand-ink/70 backdrop-blur-xl border border-brand-gold/30 shadow-[0_0_50px_rgba(212,175,55,0.15)] p-6">
            <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-brand-gold" />
            <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-brand-gold" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-brand-gold" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-brand-gold" />

            <div className="flex items-center gap-2 mb-5">
              <Zap size={14} className="text-brand-gold" />
              <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-brand-gold">Tu Sabiduría</span>
            </div>

            <div className="flex items-end justify-between mb-5">
              <div>
                <div className="text-[9px] font-mono uppercase tracking-widest text-brand-offwhite/40 mb-1">Experiencia</div>
                <div className="font-serif text-3xl text-brand-offwhite leading-none">{formatXP(progress.xp)}</div>
              </div>
              <div className="text-right">
                <div className="text-[9px] font-mono uppercase tracking-widest text-brand-offwhite/40 mb-1">Nivel</div>
                <div className="font-serif text-3xl text-brand-gold leading-none">{levelInfo.level}</div>
              </div>
            </div>

            <div className="h-px bg-brand-gold/15 mb-5" />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] text-brand-offwhite/60">
                  <BookOpen size={12} className="text-brand-gold/70" /> Guías
                </div>
                <span className="font-mono text-xs text-brand-offwhite">{completedArticles.size}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] text-brand-offwhite/60">
                  <Sparkles size={12} className="text-brand-gold/70" /> Capas asimiladas
                </div>
                <span className="font-mono text-xs text-brand-offwhite">{totalLayers}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] text-brand-offwhite/60">
                  <Package size={12} className="text-brand-gold/70" /> Objetos en tu estancia
                </div>
                <span className="font-mono text-xs text-brand-offwhite">{unlockedIds.size}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] text-brand-offwhite/60">
                  <Award size={12} className="text-brand-gold/70" /> Reliquias
                </div>
                <span className="font-mono text-xs text-brand-offwhite">{relicUnlockedCount}</span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-brand-gold/10">
              <Link href="/room-engine" className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.3em] text-brand-gold hover:text-brand-offwhite transition-all">
                <Trophy size={12} /> Reclamar recompensas <ArrowRight size={10} className="hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Indicador de scroll */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
        >
          <span className="text-[8px] font-bold uppercase tracking-[0.5em] text-brand-gold/60">Explorar</span>
          <ChevronDown size={16} className="text-brand-gold/60" />
        </motion.div>
      </section>

      {/* EL CAMINO DEL SABIO — metro map */}
      <section className="relative py-24 border-y border-brand-gold/10 bg-brand-ink/40">
        <div className="max-w-[1600px] mx-auto px-8 relative z-10">
          <LearningPath
            levels={levels}
            articles={articles}
            completedArticles={completedArticles}
            layersByArticle={layersByArticle}
          />
        </div>
      </section>

      {/* FRAGMENTO DEL NEXO */}
      <section className="relative py-24 overflow-hidden">
        <div className="max-w-4xl mx-auto px-8 relative z-10">
          <div className="flex items-center gap-3 mb-10 justify-center">
            <Quote size={16} className="text-brand-gold" />
            <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-brand-gold">Fragmento del Nexo</span>
          </div>
          {dailyFragment ? (
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}
              className="relative border border-brand-gold/30 bg-brand-ink/60 backdrop-blur-sm p-12 md:p-16 text-center shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
              <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-brand-gold" />
              <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-brand-gold" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-brand-gold" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-brand-gold" />
              <p className="font-serif text-2xl md:text-3xl text-brand-offwhite leading-relaxed mb-10 italic">
                "{dailyFragment.text}"
              </p>
              <div className="flex items-center justify-center gap-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand-gold">{dailyFragment.article.title.split(':')[0]}</span>
                <div className="w-1 h-1 bg-brand-gold/40 rounded-full" />
                <Link href={`/guias/ciencias_naturales/fisica/${dailyFragment.article.slug}`}
                  className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand-offwhite/40 hover:text-white transition-all flex items-center gap-2">
                  Leer artículo <ArrowRight size={10} />
                </Link>
              </div>
            </motion.div>
          ) : (
            <div className="text-center text-brand-offwhite/40 py-12">Cargando fragmento...</div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <section className="py-32 bg-transparent relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(212,175,55,0.15),transparent_80%)] z-0 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-8 relative z-10 text-center">
          <motion.div animate={{ scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="mb-12 relative w-32 h-32 mx-auto">
            <div className="absolute inset-0 bg-brand-gold blur-3xl opacity-40 animate-pulse" />
            <div className="relative w-full h-full rounded-full border border-brand-gold/50 shadow-[0_0_40px_rgba(212,175,55,0.5)] overflow-hidden bg-brand-ink/90 flex items-center justify-center p-2 backdrop-blur-sm">
              <img src="/mascot.png" alt="Aeterna Mascot" className="w-full h-full object-cover rounded-full" />
            </div>
          </motion.div>
          <h2 className="text-6xl md:text-8xl font-serif tracking-tighter text-brand-offwhite mb-16 leading-none drop-shadow-2xl">
            El Nexo es <span className="italic text-brand-gold drop-shadow-[0_0_20px_rgba(212,175,55,0.5)]">Infinito</span>.
          </h2>
          <div className="flex flex-wrap justify-center gap-12">
            {[
              { label: "Guias", path: "/guias", icon: BookOpen },
              { label: "Física", path: "/guias/ciencias_naturales/fisica", icon: Target },
              { label: "Archivo", path: "/articulos", icon: Sparkles }
            ].map((item) => (
              <Link key={item.label} href={item.path} className="group/link flex flex-col items-center gap-4 text-brand-offwhite">
                <div className="w-16 h-16 rounded-full border border-brand-offwhite/20 bg-brand-ink/40 backdrop-blur-md flex items-center justify-center group-hover/link:border-brand-gold group-hover/link:text-brand-gold transition-all duration-500 hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] hover:-translate-y-2">
                  <item.icon size={20} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-brand-offwhite/60 group-hover/link:text-brand-gold transition-colors">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
