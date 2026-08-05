'use client';
import React, { useMemo, useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'motion/react';
import { Gift, Sparkles, Star, Compass } from 'lucide-react';
import fisicaCurriculum from '@/data/curriculum/fisica.json';
import { useGamification } from '@/context/GamificationContext';

type ArticleJSON = { slug: string; title: string; nivel: number; orden: number; tipo?: string };

const GOLD       = '#D4AF37';
const GOLD_LIGHT = '#F5E6A0';
const GOLD_DIM   = '#B8860B';
const GOLD_PALE  = '#E8D48B';
const VOID       = '#06040D';
const ABYSS      = '#0A0815';

type ArcanaCfg = {
  label: string; border: string; bg: string; accent: string; accentGlow: string;
  nebula: string; rune: string; name: string; gradientFrom: string; gradientTo: string;
};

const LEVEL_ARCANA: Record<number, ArcanaCfg> = {
  1: { label: '✦ NIVEL I — Los Fundamentos del Éter', border: '#2A1A3A', bg: '#120D1A', accent: '#A78BFA', accentGlow: 'rgba(167,139,250,0.35)', nebula: 'rgba(139,92,246,0.06)', rune: '◎', name: 'Fundamentos', gradientFrom: '#A78BFA', gradientTo: '#7C3AED' },
  2: { label: '◈ NIVEL II — El Reino de lo Arcano', border: '#1A2A3A', bg: '#0D131A', accent: '#67E8F9', accentGlow: 'rgba(103,232,249,0.35)', nebula: 'rgba(6,182,212,0.06)', rune: '◆', name: 'Clásico', gradientFrom: '#67E8F9', gradientTo: '#0891B2' },
  3: { label: '⬡ NIVEL III — Las Fronteras del Abismo', border: '#2A1A1A', bg: '#1A0F0D', accent: '#FB923C', accentGlow: 'rgba(251,146,60,0.35)', nebula: 'rgba(249,115,22,0.06)', rune: '⬡', name: 'Frontera', gradientFrom: '#FB923C', gradientTo: '#EA580C' },
  4: { label: '◉ NIVEL IV — La Síntesis Estelar', border: '#2A1A2A', bg: '#1A0D16', accent: '#F472B6', accentGlow: 'rgba(244,114,182,0.35)', nebula: 'rgba(236,72,153,0.06)', rune: '◉', name: 'Síntesis', gradientFrom: '#F472B6', gradientTo: '#DB2777' },
};

const NODE_META: Record<string, { emoji: string; lore: string }> = {
  'guia-maestra-de-fisica':           { emoji: '🔮', lore: 'El grimorio que revela la arquitectura del cosmos.' },
  'como-piensa-un-fisico':            { emoji: '☄️', lore: 'La mente que se atrevió a cuestionar a los dioses.' },
  'cinematica':                       { emoji: '🌌', lore: 'El arte de trazar senderos en el vacío.' },
  'materia-y-energia':                { emoji: '💠', lore: 'Las dos caras de la moneda cósmica.' },
  'metodo-cientifico':                { emoji: '⚗️', lore: 'El ritual que separa la verdad del dogma.' },
  'vectores':                         { emoji: '🧿', lore: 'El lenguaje con el que el universo escribe sus leyes.' },
  'leyes-newton-movimiento':          { emoji: '🌍', lore: 'Los tres decretos que gobiernan todo movimiento.' },
  'trabajo-energia':                  { emoji: '⚡', lore: 'La moneda única que todo lo mueve.' },
  'momentum-colisiones':              { emoji: '💫', lore: 'El legado que nada puede crear ni destruir.' },
  'movimiento-circular-satelites':    { emoji: '🪐', lore: 'Las órbitas que mantienen a las estrellas cautivas.' },
  'torque-momento-angular':           { emoji: '🌀', lore: 'El giro eterno que los mundos no pueden detener.' },
  'termodinamica':                    { emoji: '🔥', lore: 'La flecha del tiempo grabada en calor.' },
  'electromagnetismo':                { emoji: '🌩️', lore: 'Donde la luz revela su doble naturaleza.' },
  'ondas-y-optica':                   { emoji: '🌈', lore: 'El arcoíris descifrado por la mente.' },
  'mecanica-cuantica':                { emoji: '⬡', lore: 'Donde la realidad se niega a ser definida.' },
  'relatividad-especial':             { emoji: '⏳', lore: 'El tiempo, ese río que fluye distinto para cada viajero.' },
  'relatividad-general':              { emoji: '🕳️', lore: 'El espacio que se curva bajo el peso de la existencia.' },
  'fisica-atomica-y-nuclear':         { emoji: '⚛️', lore: 'En el corazón de la materia arde un sol cautivo.' },
  'fisica-particulas':                { emoji: '✨', lore: 'El zoológico invisible que compone todo lo visible.' },
  'teoria-del-todo':                  { emoji: '☯️', lore: 'La última ecuación, la que unificaría el cosmos entero.' },
  'cosmologia':                       { emoji: '🌟', lore: 'La historia del universo contada por su propia luz.' },
  'fluidos':                          { emoji: '💧', lore: 'El caos ordenado que fluye entre lo sólido y lo etéreo.' },
  'electromagnetismo-avanzado':       { emoji: '🔌', lore: 'Las ecuaciones que Maxwell grabó en la eternidad.' },
  'ondas-y-optica-practica':          { emoji: '👁️', lore: 'El laboratorio donde la luz confiesa sus secretos.' },
  'relatividad-especial-practica':    { emoji: '🚀', lore: 'Viajando a lomos de un fotón hacia lo imposible.' },
  'fisica-tecnologia':                { emoji: '🔬', lore: 'Cuando la teoría se convierte en civilización.' },
};

const SPECTRAL_PALETTE = ['#A78BFA','#818CF8','#67E8F9','#6EE7B7','#FCD34D','#FB923C','#F472B6','#C084FC'];

export default function CosmicConstellationPath() {
  const { progress } = useGamification();
  const completedPaths = progress.completedPaths || [];
  const completedLayers = progress.completedLayers || {};
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: containerRef as React.RefObject<HTMLElement>, offset: ['start start', 'end end'] });
  const nebulaOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.15, 0.25, 0.2, 0.1]);
  const headerY = useTransform(scrollYProgress, [0, 0.2], [0, -60]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.15, 0.4], [1, 0.8, 0]);

  const curriculum = fisicaCurriculum as { levels?: { nivel: number; titulo: string; descripcion: string }[]; articles?: ArticleJSON[] };
  const articles = useMemo(() => [...(curriculum.articles || [])].sort((a, b) => a.nivel - b.nivel || a.orden - b.orden), []);
  const nodes = useMemo(() => {
    let prevDone = true;
    return articles.map((a, i) => {
      const lyrs = completedLayers[a.slug]?.length || 0;
      const done = completedPaths.includes(a.slug) || lyrs >= 3;
      const open = i === 0 || prevDone;
      if (done) prevDone = true; else prevDone = false;
      return { ...a, layers: lyrs, done, unlocked: open };
    });
  }, [articles, completedPaths, completedLayers]);
  const levels = useMemo(() => (curriculum.levels || []).map(l => ({
    ...l, nodes: nodes.filter(a => a.nivel === l.nivel)
  })).filter(l => l.nodes.length > 0), [nodes]);
  const totalXP = nodes.reduce((s, n) => s + n.layers * 25, 0);
  const maxXP = nodes.length * 75;
  const overallProgress = maxXP > 0 ? Math.round((totalXP / maxXP) * 100) : 0;

  const allDone = nodes.filter(n => n.done).length;
  const totalNodes = nodes.length;

  return (
    <div ref={containerRef} className="min-h-screen text-[#C8A842] relative overflow-x-hidden" style={{
      background: `linear-gradient(180deg, ${VOID} 0%, ${ABYSS} 30%, ${VOID} 100%)`,
      fontFamily: 'var(--font-sans), system-ui, sans-serif',
    }}>
      {/* ───── Starfield Background ───── */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{ perspective: '1200px' }}>
        {/* Soft nebula glows */}
        <motion.div className="absolute top-[-15%] left-[-5%] w-[70vw] h-[50vh] rounded-full opacity-[0.06] blur-[160px]" style={{
          background: 'radial-gradient(ellipse, #8B5CF6 0%, transparent 70%)', opacity: nebulaOpacity,
        }} />
        <motion.div className="absolute bottom-[-10%] right-[-10%] w-[55vw] h-[45vh] rounded-full opacity-[0.05] blur-[140px]" style={{
          background: 'radial-gradient(ellipse, #06B6D4 0%, transparent 70%)', opacity: nebulaOpacity,
        }} />
        <motion.div className="absolute top-[35%] left-[25%] w-[40vw] h-[35vh] rounded-full opacity-[0.04] blur-[120px]" style={{
          background: 'radial-gradient(ellipse, #F97316 0%, transparent 70%)', opacity: nebulaOpacity,
        }} />
        <motion.div className="absolute top-[60%] right-[20%] w-[35vw] h-[30vh] rounded-full opacity-[0.04] blur-[100px]" style={{
          background: 'radial-gradient(ellipse, #EC4899 0%, transparent 70%)', opacity: nebulaOpacity,
        }} />

        {/* Constellation stars */}
        {Array.from({ length: 80 }).map((_, i) => {
          const size = i < 8 ? 2.5 : i < 24 ? 2 : 1;
          const isBright = i < 8;
          const color = SPECTRAL_PALETTE[i % SPECTRAL_PALETTE.length];
          const twinkleDuration = 2 + Math.random() * 4;
          return (
            <motion.div
              key={`star-${i}`}
              className="absolute rounded-full"
              style={{
                left: `${5 + Math.random() * 90}%`,
                top: `${3 + Math.random() * 94}%`,
                width: `${size}px`, height: `${size}px`,
                background: color,
                boxShadow: isBright ? `0 0 ${size * 4}px ${color}60, 0 0 ${size * 8}px ${color}20` : 'none',
              }}
              animate={{ opacity: [0.2, isBright ? 1 : 0.7, 0.2] }}
              transition={{ duration: twinkleDuration, repeat: Infinity, delay: Math.random() * 4, ease: 'easeInOut' }}
            />
          );
        })}

        {/* Ethereal wisps */}
        {Array.from({ length: 18 }).map((_, i) => (
          <motion.div key={`wisp-${i}`} className="absolute w-1 h-1 rounded-full"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, background: SPECTRAL_PALETTE[i % SPECTRAL_PALETTE.length] }}
            animate={{ y: [-40, 40, -40], x: [-20, 20, -20], opacity: [0, 0.4, 0], scale: [0.5, 1.2, 0.5] }}
            transition={{ duration: 5 + Math.random() * 8, repeat: Infinity, delay: Math.random() * 6, ease: 'easeInOut' }}
          />
        ))}
      </div>

      {/* ───── Main Content ───── */}
      <div className="max-w-[720px] mx-auto px-5 py-12 relative z-10">
        {/* ───── Header ───── */}
        <motion.header className="text-center mb-16" style={{ y: headerY, opacity: headerOpacity }}>
          {/* Arcane sigil */}
          <motion.div className="relative inline-flex items-center justify-center mb-6"
            initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 14, delay: 0.2 }}>
            <div className="absolute w-24 h-24 rounded-full animate-pulse opacity-10" style={{ background: `radial-gradient(circle, ${GOLD}, transparent)` }} />
            <div className="absolute w-20 h-20 rounded-full border opacity-20" style={{ borderColor: GOLD }} />
            <div className="absolute w-14 h-14 rounded-full border-2 opacity-30" style={{ borderColor: GOLD }} />
            <Compass size={28} style={{ color: GOLD }} className="relative z-10" />
          </motion.div>

          <div className="inline-flex items-center gap-3 mb-3">
            <span className="h-px w-8 rounded-full opacity-30" style={{ background: `linear-gradient(90deg, transparent, ${GOLD})` }} />
            <motion.span className="text-[10px] font-mono font-black uppercase tracking-[0.6em] opacity-50"
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 0.5, x: 0 }} transition={{ delay: 0.5 }}>
              Volumen I · Codex Stellarum
            </motion.span>
            <span className="h-px w-8 rounded-full opacity-30" style={{ background: `linear-gradient(90deg, ${GOLD}, transparent)` }} />
          </div>

          <motion.h1 className="font-serif text-5xl font-bold mb-4 tracking-tight"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            style={{
              background: `linear-gradient(180deg, ${GOLD_LIGHT} 0%, ${GOLD} 35%, ${GOLD_DIM} 100%)`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              filter: `drop-shadow(0 4px 16px rgba(0,0,0,0.7)) drop-shadow(0 0 60px rgba(212,175,55,0.2))`,
            }}>
            El Sendero del Sabio
          </motion.h1>

          <motion.p className="font-serif text-sm italic tracking-[0.12em] opacity-40 font-light mb-4"
            initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} transition={{ delay: 0.6 }}>
            "El universo no está hecho de átomos; está hecho de historias."
          </motion.p>

          <motion.div className="flex items-center justify-center gap-6 text-[10px] tracking-[0.18em] opacity-30 font-mono uppercase"
            initial={{ opacity: 0 }} animate={{ opacity: 0.3 }} transition={{ delay: 0.8 }}>
            <span>{totalNodes} constelaciones</span>
            <span className="opacity-30">·</span>
            <span>4 reinos</span>
            <span className="opacity-30">·</span>
            <span>3 velos por lección</span>
          </motion.div>

          {/* Progress constellation bar */}
          <motion.div className="mt-8 inline-flex items-center gap-4 px-6 py-2.5 rounded-full border backdrop-blur-sm"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}
            style={{ background: 'rgba(10,8,21,0.7)', borderColor: `${GOLD}18`, borderWidth: '0.5px' }}>
            <Star size={12} style={{ color: GOLD }} />
            <span className="text-xs tracking-[0.1em] opacity-60">Progreso</span>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold tracking-wide" style={{ color: GOLD_LIGHT }}>{overallProgress}%</span>
              <span className="text-[10px] opacity-30">{allDone}/{totalNodes}</span>
            </div>
          </motion.div>
        </motion.header>

        {/* ───── Levels ───── */}
        {levels.map((lvl, li) => {
          const cfg = LEVEL_ARCANA[lvl.nivel] || LEVEL_ARCANA[1];
          const lvlDone = lvl.nodes.filter(n => n.done).length;
          const lvlTotal = lvl.nodes.length;
          const lvlProgress = lvlTotal > 0 ? Math.round((lvlDone / lvlTotal) * 100) : 0;

          return (
            <motion.section key={lvl.nivel}
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: li * 0.15, duration: 0.7 }}
              className="mb-6">

              {/* Level Tome Card */}
              <div className="relative rounded-[2rem] border-[0.5px] px-5 pt-8 pb-8 overflow-hidden"
                style={{
                  background: `linear-gradient(175deg, ${cfg.bg}F5 0%, ${cfg.bg} 40%, rgba(0,0,0,0.35) 100%)`,
                  borderColor: `${cfg.accent}18`,
                  boxShadow: `
                    inset 0 1px 0 rgba(255,255,255,0.015),
                    0 16px 48px rgba(0,0,0,0.55),
                    0 0 80px ${cfg.accentGlow},
                    0 0 140px ${cfg.accent}05
                  `,
                }}>
                {/* Subtle inner nebula */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[2rem]">
                  <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[80%] rounded-full opacity-[0.04] blur-[80px]"
                    style={{ background: `radial-gradient(ellipse, ${cfg.accent}, transparent)` }} />
                </div>

                {/* Runic seal corners */}
                {['top-3 left-4', 'top-3 right-4', 'bottom-3 left-4', 'bottom-3 right-4'].map((pos, idx) => (
                  <div key={idx} className={`absolute ${pos} text-xs opacity-15`} style={{ color: cfg.accent }}>
                    {idx % 2 === 0 ? cfg.rune : '⟡'}
                  </div>
                ))}

                {/* Level header pill */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <div className="flex items-center gap-2 px-5 py-1.5 rounded-full border-[0.5px] text-[10px] font-bold tracking-[0.15em] whitespace-nowrap"
                    style={{
                      background: `linear-gradient(180deg, ${cfg.bg}E8, rgba(0,0,0,0.8))`,
                      borderColor: `${cfg.accent}35`,
                      color: cfg.accent,
                      boxShadow: `0 4px 16px rgba(0,0,0,0.5), 0 0 24px ${cfg.accent}20, inset 0 1px 0 rgba(255,255,255,0.02)`,
                    }}>
                    <span className="opacity-60">{cfg.rune}</span>
                    {cfg.label}
                    <span className="opacity-60">{cfg.rune}</span>
                  </div>
                </div>

                {/* Level progress line */}
                <div className="flex items-center justify-center gap-3 mt-4 mb-6">
                  <div className="h-[1px] flex-1 max-w-[120px] rounded-full opacity-15"
                    style={{ background: cfg.accent }} />
                  <span className="text-[9px] tracking-[0.15em] opacity-25 font-mono">{lvlDone}/{lvlTotal}</span>
                  <div className="h-[2px] flex-1 max-w-[120px] rounded-full"
                    style={{
                      background: `linear-gradient(90deg, ${cfg.accent}80, ${cfg.accent}40)`,
                      width: `${lvlProgress}%`,
                      maxWidth: '120px',
                    }} />
                </div>

                {/* Node grid — paired constellation layout */}
                <div className="flex flex-col items-center gap-0">
                  {Array.from({ length: Math.ceil(lvl.nodes.length / 2) }).map((_, rowIdx) => {
                    const leftNode  = lvl.nodes[rowIdx * 2];
                    const rightNode = lvl.nodes[rowIdx * 2 + 1];
                    const chestIdx = Math.floor(lvl.nodes.length / 2);
                    const chestRow = Math.floor(chestIdx / 2);
                    const showChest = rowIdx === chestRow && chestIdx > 0 && lvl.nodes.length >= 3;

                    return (
                      <React.Fragment key={rowIdx}>
                        {/* Constellation ley line connector */}
                        {rowIdx > 0 && (
                          <div className="flex items-center justify-center h-14 w-full">
                            <div className="w-[1.5px] h-full rounded-full opacity-40"
                              style={{
                                background: `linear-gradient(180deg, transparent 0%, ${cfg.accent}40 30%, ${cfg.accent}20 60%, transparent 100%)`,
                                boxShadow: `0 0 6px ${cfg.accent}15`,
                              }} />
                          </div>
                        )}

                        {/* Node pair */}
                        <div className="flex items-center justify-center gap-0">
                          {[leftNode, rightNode].map((node, ni) => {
                            if (!node) return <div key={ni} className="w-[140px]" />;
                            const isActive = !node.done && node.unlocked;
                            const isLocked = !node.unlocked;
                            const meta = NODE_META[node.slug] || { emoji: '🔮', lore: 'Un misterio por descubrir.' };

                            return (
                              <React.Fragment key={node.slug}>
                                {/* Horizontal connector between pair */}
                                {ni === 1 && (
                                  <div className="h-[1.5px] w-14 rounded-full opacity-30 flex-shrink-0 mx-1"
                                    style={{ background: `linear-gradient(90deg, ${cfg.accent}20, ${cfg.accent}50, ${cfg.accent}20)`,
                                      boxShadow: `0 0 8px ${cfg.accent}10` }} />
                                )}

                                <Link href={node.unlocked ? `/guias/ciencias_naturales/fisica/${node.slug}` : '#'}
                                  className={`relative group ${isLocked ? 'pointer-events-none' : ''}`}>
                                  <motion.div className="flex flex-col items-center gap-2 py-3 cursor-pointer"
                                    whileHover={node.unlocked ? { scale: 1.05 } : {}}>

                                    {/* Celestial Orb */}
                                    <motion.div className="relative w-[76px] h-[76px] rounded-full flex items-center justify-center"
                                      animate={node.done ? { boxShadow: [
                                        `0 8px 28px rgba(0,0,0,0.6), 0 0 32px ${GOLD}45, 0 0 60px ${GOLD}15`,
                                        `0 8px 28px rgba(0,0,0,0.6), 0 0 36px ${GOLD}55, 0 0 64px ${GOLD}20`,
                                        `0 8px 28px rgba(0,0,0,0.6), 0 0 32px ${GOLD}45, 0 0 60px ${GOLD}15`,
                                      ]} : {}}
                                      transition={node.done ? { duration: 3, repeat: Infinity, ease: 'easeInOut' } : {}}
                                      style={{
                                        background: node.done
                                          ? `radial-gradient(circle at 35% 28%, ${GOLD_PALE}20 0%, ${GOLD_DIM}15 30%, #1C1510 65%, rgba(0,0,0,0.7) 100%)`
                                          : isActive
                                          ? `radial-gradient(circle at 35% 28%, ${cfg.accent}35 0%, ${cfg.bg} 55%, rgba(0,0,0,0.65) 100%)`
                                          : `radial-gradient(circle at 35% 28%, rgba(255,255,255,0.015) 0%, ${cfg.bg} 55%, rgba(0,0,0,0.55) 100%)`,
                                        border: `2.5px solid ${node.done ? GOLD : isActive ? cfg.accent : `${cfg.accent}35`}`,
                                        opacity: isLocked ? 0.3 : 1,
                                        boxShadow: node.done
                                          ? `0 8px 28px rgba(0,0,0,0.6), 0 0 32px ${GOLD}45, 0 0 60px ${GOLD}15, inset 0 1px 4px rgba(255,255,255,0.02)`
                                          : isActive
                                          ? `0 8px 28px rgba(0,0,0,0.6), 0 0 40px ${cfg.accent}55, 0 0 80px ${cfg.accent}20, inset 0 1px 4px rgba(255,255,255,0.02)`
                                          : `0 4px 20px rgba(0,0,0,0.5)`,
                                        filter: isLocked ? 'grayscale(0.6) brightness(0.45)' : 'none',
                                      }}>
                                      {/* Glass specular */}
                                      <div className="absolute top-2.5 left-3 w-4 h-3 rounded-full opacity-[0.04]"
                                        style={{ background: 'linear-gradient(135deg, white, transparent)' }} />
                                      {/* Shadow floor */}
                                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] h-[30%] rounded-full"
                                        style={{ background: 'rgba(0,0,0,0.5)', filter: 'blur(6px)' }} />
                                      {/* Emoji */}
                                      <span className="relative z-10 text-[28px] leading-none select-none"
                                        style={{
                                          textShadow: [
                                            '0 5px 12px rgba(0,0,0,0.9)',
                                            '0 2px 4px rgba(0,0,0,0.6)',
                                            '0 -1px 2px rgba(255,255,255,0.1)',
                                          ].join(', '),
                                          filter: isLocked
                                            ? 'grayscale(0.6) brightness(0.45)'
                                            : node.done
                                            ? `drop-shadow(0 0 10px ${GOLD}) drop-shadow(0 3px 6px rgba(0,0,0,0.8))`
                                            : isActive
                                            ? `drop-shadow(0 0 12px ${cfg.accent}) drop-shadow(0 3px 6px rgba(0,0,0,0.8))`
                                            : `drop-shadow(0 2px 4px rgba(0,0,0,0.6))`,
                                        }}>
                                        {meta.emoji}
                                      </span>

                                      {/* Completion seal */}
                                      {node.done && (
                                        <motion.div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-bold z-20"
                                          initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }}
                                          transition={{ type: 'spring', stiffness: 400, delay: 0.2 }}
                                          style={{
                                            background: `linear-gradient(135deg, ${GOLD_LIGHT} 0%, ${GOLD} 50%, ${GOLD_DIM} 100%)`,
                                            color: '#1C1510',
                                            boxShadow: `0 3px 14px ${GOLD}50, 0 1px 3px rgba(0,0,0,0.4)`,
                                          }}>
                                          ✓
                                        </motion.div>
                                      )}

                                      {/* Active pulse ring */}
                                      {isActive && (
                                        <>
                                          <motion.div className="absolute -inset-2 rounded-full border-2 pointer-events-none"
                                            style={{ borderColor: cfg.accent }}
                                            animate={{ opacity: [0.5, 0, 0.5], scale: [1, 1.25, 1] }}
                                            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }} />
                                          <motion.div className="absolute -inset-3 rounded-full border pointer-events-none"
                                            style={{ borderColor: `${cfg.accent}40` }}
                                            animate={{ opacity: [0.25, 0, 0.25], scale: [1, 1.35, 1] }}
                                            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }} />
                                        </>
                                      )}
                                    </motion.div>

                                    {/* Node label */}
                                    <p className="text-[11px] font-bold text-center max-w-[90px] leading-[1.3] tracking-[0.04em]"
                                      style={{
                                        color: node.done ? GOLD_DIM : isActive ? cfg.accent : isLocked ? 'rgba(200,168,66,0.18)' : 'rgba(200,168,66,0.5)',
                                        textShadow: isActive ? `0 0 14px ${cfg.accentGlow}` : node.done ? `0 0 10px ${GOLD}15` : 'none',
                                      }}>
                                      {node.title}
                                    </p>

                                    {/* Veil star dots */}
                                    <div className="flex gap-1">
                                      {[0, 1, 2].map(s => (
                                        <span key={s} className="text-[9px] transition-all duration-500"
                                          style={{
                                            opacity: s < node.layers ? 1 : 0.18,
                                            color: s < node.layers ? GOLD_LIGHT : cfg.accent,
                                            filter: s < node.layers ? `drop-shadow(0 0 5px ${GOLD})` : 'none',
                                            transform: s < node.layers ? 'scale(1.15)' : 'scale(1)',
                                          }}>✦</span>
                                      ))}
                                    </div>

                                    {/* Hover tooltip — Grimoire card */}
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-[180px] rounded-2xl border-[0.5px] px-4 py-3 text-[11px] leading-relaxed z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300"
                                      style={{
                                        background: `linear-gradient(175deg, ${cfg.bg}F8, ${cfg.bg})`,
                                        borderColor: isActive ? `${cfg.accent}70` : `${GOLD_DIM}40`,
                                        color: '#C8A842',
                                        boxShadow: `0 16px 40px rgba(0,0,0,0.6), 0 0 30px ${isActive ? cfg.accent : GOLD}10`,
                                      }}>
                                      <strong className="block mb-1 text-[11px] tracking-[0.03em]" style={{ color: isActive ? cfg.accent : GOLD }}>
                                        {node.title}
                                      </strong>
                                      <p className="opacity-50 text-[10px] leading-[1.5] italic">
                                        {meta.lore}
                                      </p>
                                      <p className="mt-1.5 text-[10px] font-bold opacity-70" style={{ color: isActive ? cfg.accent : GOLD }}>
                                        {node.done ? '✦ Sello completado' :
                                         isActive ? '✦ Portal activo — entrar' :
                                         isLocked ? '✦ Sellado — completa el anterior' :
                                         '✦ Tres velos por descorrer'}
                                      </p>
                                    </div>
                                  </motion.div>
                                </Link>
                              </React.Fragment>
                            );
                          })}
                        </div>

                        {/* Arcane Chest */}
                        {showChest && (
                          <>
                            <div className="flex items-center justify-center h-14 w-full">
                              <div className="w-[1.5px] h-full rounded-full opacity-30"
                                style={{
                                  background: `linear-gradient(180deg, transparent 0%, ${cfg.accent}30 30%, ${cfg.accent}10 60%, transparent 100%)`,
                                  boxShadow: `0 0 6px ${cfg.accent}10`,
                                }} />
                            </div>
                            <motion.div whileHover={lvlDone >= 2 ? { scale: 1.1, y: -2 } : {}}
                              className="flex flex-col items-center gap-1.5 py-1.5">
                              <div
                                onClick={() => lvlDone >= 2 && alert('🎁 ¡Cofre astral desbloqueado! Un artefacto ancestral se une a tu colección.')}
                                className={`w-[64px] h-[54px] rounded-2xl flex flex-col items-center justify-center gap-1
                                  ${lvlDone >= 2 ? 'cursor-pointer' : 'cursor-default'}
                                  border-2 relative transition-all`}
                                style={{
                                  background: lvlDone >= 2
                                    ? `radial-gradient(circle at 30% 30%, ${GOLD}15, ${cfg.bg})`
                                    : `radial-gradient(circle at 30% 30%, ${cfg.accent}10, ${cfg.bg})`,
                                  borderColor: lvlDone >= 2 ? GOLD : `${cfg.accent}30`,
                                  opacity: lvlDone >= 2 ? 1 : 0.35,
                                  boxShadow: lvlDone >= 2
                                    ? `0 6px 20px rgba(0,0,0,0.6), 0 0 30px ${GOLD}40, inset 0 1px 0 rgba(255,255,255,0.02)`
                                    : `0 4px 12px rgba(0,0,0,0.4)`,
                                  filter: lvlDone >= 2 ? 'none' : 'grayscale(0.5)',
                                }}>
                                {lvlDone >= 2 ? (
                                  <>
                                    <Gift size={22} style={{ color: GOLD }} />
                                    <span className="text-[8px] font-bold tracking-[0.1em]" style={{ color: GOLD_DIM }}>COFRE</span>
                                  </>
                                ) : (
                                  <>
                                    <span className="text-[20px] leading-none opacity-50">🔒</span>
                                    <span className="text-[7px] font-bold tracking-[0.1em]" style={{ color: cfg.accent }}>SELLADO</span>
                                  </>
                                )}
                              </div>
                              <span className="text-[9px] font-bold tracking-[0.1em] opacity-25" style={{ color: cfg.accent }}>
                                {lvlDone >= 2 ? `${lvlDone}/${lvlTotal} sellos — ¡abre!` : `${lvlDone} sellos de ${Math.ceil(lvlTotal / 2)} requeridos`}
                              </span>
                            </motion.div>
                            <div className="flex items-center justify-center h-14 w-full">
                              <div className="w-[1.5px] h-full rounded-full opacity-30"
                                style={{
                                  background: `linear-gradient(180deg, transparent 0%, ${cfg.accent}30 30%, ${cfg.accent}10 60%, transparent 100%)`,
                                  boxShadow: `0 0 6px ${cfg.accent}10`,
                                }} />
                            </div>
                          </>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            </motion.section>
          );
        })}

        {/* ───── Footer Grimoire Bar ───── */}
        <motion.footer
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="flex items-center justify-between mt-8 px-6 py-4 rounded-2xl border-[0.5px] backdrop-blur-sm"
          style={{
            background: `linear-gradient(180deg, rgba(20,16,20,0.85), rgba(10,8,16,0.92))`,
            borderColor: `${GOLD}18`,
            boxShadow: `0 14px 40px rgba(0,0,0,0.55), 0 0 50px ${GOLD}08, inset 0 1px 0 rgba(255,255,255,0.015)`,
          }}>
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] tracking-[0.12em] opacity-35 font-mono uppercase">Esencias recolectadas</span>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold tracking-[0.05em]" style={{ color: GOLD_LIGHT }}>{totalXP}</span>
              <span className="text-xs opacity-25">/ {maxXP}</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-0.5">
            <span className="text-[10px] tracking-[0.12em] opacity-35 font-mono uppercase">Rango arcano</span>
            <span className="text-sm font-bold tracking-[0.06em]" style={{ color: GOLD }}>
              {overallProgress >= 100 ? 'Maestro del Éter' :
               overallProgress >= 66 ? 'Guardián Arcano' :
               overallProgress >= 33 ? 'Aprendiz del Nexo' :
               'Iniciado del Éter'}
            </span>
          </div>
          <Link href="/guias/ciencias_naturales/fisica"
            className="flex items-center gap-2 text-[11px] font-bold px-5 py-3 rounded-2xl border transition-all hover:scale-[1.04] active:scale-95"
            style={{
              background: `linear-gradient(180deg, rgba(40,30,10,0.85), rgba(20,12,4,0.9))`,
              borderColor: `${GOLD}80`, borderWidth: '1px', color: GOLD,
              boxShadow: `0 2px 14px rgba(0,0,0,0.5), 0 0 24px ${GOLD}20`,
            }}>
            <Sparkles size={14} />
            Cruzar el Portal
          </Link>
        </motion.footer>
      </div>
    </div>
  );
}
