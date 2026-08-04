'use client';
import React, { useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Gift, Sparkles } from 'lucide-react';
import fisicaCurriculum from '@/data/curriculum/fisica.json';
import { useGamification } from '@/context/GamificationContext';

type ArticleJSON = { slug: string; title: string; nivel: number; orden: number; tipo?: string };

const GOLD = '#D4AF37';
const GOLD_LIGHT = '#F0D060';
const GOLD_DIM = '#B8860B';

const LEVEL_ARCANA: Record<number, {
  label: string; border: string; bg: string; accent: string; accentGlow: string;
  nebula: string; rune: string; name: string;
}> = {
  1: { label: '✦ NIVEL I — Los Fundamentos del Éter', border: '#2A1A3A', bg: '#120D1A', accent: '#A78BFA', accentGlow: 'rgba(167,139,250,0.25)', nebula: 'rgba(139,92,246,0.08)', rune: '◎', name: 'Fundamentos' },
  2: { label: '◈ NIVEL II — El Reino de lo Arcano', border: '#1A2A3A', bg: '#0D131A', accent: '#67E8F9', accentGlow: 'rgba(103,232,249,0.25)', nebula: 'rgba(6,182,212,0.08)', rune: '◆', name: 'Clásico' },
  3: { label: '⬡ NIVEL III — Las Fronteras del Abismo', border: '#2A1A1A', bg: '#1A0F0D', accent: '#FB923C', accentGlow: 'rgba(251,146,60,0.25)', nebula: 'rgba(249,115,22,0.07)', rune: '⬡', name: 'Frontera' },
  4: { label: '◉ NIVEL IV — La Síntesis Estelar', border: '#2A1A2A', bg: '#1A0D16', accent: '#F472B6', accentGlow: 'rgba(244,114,182,0.25)', nebula: 'rgba(236,72,153,0.07)', rune: '◉', name: 'Síntesis' },
};

const NODE_EMOJIS: Record<string, string> = {
  'guia-maestra-de-fisica':'🔮','como-piensa-un-fisico':'☄️','cinematica':'🌌','materia-y-energia':'💠',
  'metodo-cientifico':'⚗️','vectores':'🧿','leyes-newton-movimiento':'🌍','trabajo-energia':'⚡',
  'momentum-colisiones':'💫','movimiento-circular-satelites':'🪐','torque-momento-angular':'🌀',
  'termodinamica':'🔥','electromagnetismo':'🌩️','ondas-y-optica':'🌈','mecanica-cuantica':'⬡',
  'relatividad-especial':'⏳','relatividad-general':'🕳️','fisica-atomica-y-nuclear':'⚛️',
  'fisica-particulas':'✨','teoria-del-todo':'☯️','cosmologia':'🌟','fluidos':'💧',
  'electromagnetismo-avanzado':'🔌','ondas-y-optica-practica':'👁️','relatividad-especial-practica':'🚀',
};

const COSMIC_PARTICLE_COLORS = ['#A78BFA','#67E8F9','#FB923C','#F472B6','#D4AF37','#F0D060'];

export default function CosmicConstellationPath() {
  const { progress } = useGamification();
  const completedPaths = progress.completedPaths || [];
  const completedLayers = progress.completedLayers || {};

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

  return (
    <div className="min-h-screen text-[#C8A842] relative overflow-hidden" style={{
      background: 'radial-gradient(ellipse at 50% 20%, #1A0D30 0%, #0A0815 40%, #06040D 100%)',
      fontFamily: 'var(--font-sans), system-ui, sans-serif',
    }}>
      {/* Deep space background layers */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Nebula clouds */}
        <div className="absolute top-[-30%] left-[-10%] w-[800px] h-[600px] rounded-full opacity-[0.04] blur-[140px]" style={{ background: 'radial-gradient(ellipse, #8B5CF6, transparent)' }} />
        <div className="absolute bottom-[-20%] right-[-5%] w-[600px] h-[500px] rounded-full opacity-[0.04] blur-[120px]" style={{ background: 'radial-gradient(ellipse, #06B6D4, transparent)' }} />
        <div className="absolute top-[40%] left-[30%] w-[400px] h-[400px] rounded-full opacity-[0.03] blur-[100px]" style={{ background: 'radial-gradient(ellipse, #F97316, transparent)' }} />
        
        {/* Star field — varied sizes and speeds */}
        {Array.from({ length: 100 }).map((_, i) => {
          const size = Math.random() < 0.08 ? 2.5 : Math.random() < 0.2 ? 2 : 1;
          const color = COSMIC_PARTICLE_COLORS[Math.floor(Math.random() * COSMIC_PARTICLE_COLORS.length)];
          return (
            <motion.div
              key={`star-${i}`}
              className="absolute rounded-full"
              style={{
                left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
                width: `${size}px`, height: `${size}px`, background: color,
                boxShadow: size > 1.5 ? `0 0 ${size * 3}px ${color}40` : 'none',
              }}
              animate={{ opacity: [0.15, 0.8, 0.15], scale: size > 1.5 ? [1, 1.3, 1] : 1 }}
              transition={{ duration: 2 + Math.random() * 5, repeat: Infinity, delay: Math.random() * 5 }}
            />
          );
        })}

        {/* Arcane floating sparkles */}
        {Array.from({ length: 25 }).map((_, i) => (
          <motion.div
            key={`sparkle-${i}`}
            className="absolute"
            style={{ left: `${5 + Math.random() * 90}%`, top: `${5 + Math.random() * 90}%` }}
            animate={{ y: [-30, 30, -30], x: [-15, 15, -15], opacity: [0, 0.6, 0], rotate: [0, 180, 360] }}
            transition={{ duration: 4 + Math.random() * 6, repeat: Infinity, delay: Math.random() * 5 }}
          >
            <Sparkles size={8 + Math.random() * 8} style={{ color: COSMIC_PARTICLE_COLORS[i % COSMIC_PARTICLE_COLORS.length] }} opacity={0.4} />
          </motion.div>
        ))}
      </div>

      <div className="max-w-[680px] mx-auto py-10 px-4 relative z-10">
        {/* Header */}
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 mb-3">
            <Sparkles size={14} style={{ color: GOLD }} />
            <span className="text-[10px] font-mono font-black uppercase tracking-[0.5em] opacity-40">Archivo del Nexo</span>
            <Sparkles size={14} style={{ color: GOLD }} />
          </div>
          <h1 className="font-serif text-4xl font-bold mb-3 tracking-tight"
            style={{
              background: `linear-gradient(180deg, ${GOLD_LIGHT} 0%, ${GOLD} 40%, ${GOLD_DIM} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: `0 2px 8px rgba(0,0,0,0.5), 0 0 60px rgba(212,175,55,0.25)`,
              filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.6))',
            }}>
            El Sendero del Sabio
          </h1>
          <p className="text-sm tracking-[0.15em] opacity-40 font-light">16 constelaciones · 4 reinos · 3 velos por lección</p>
        </motion.div>

        {levels.map((lvl, li) => {
          const cfg = LEVEL_ARCANA[lvl.nivel] || LEVEL_ARCANA[1];
          const lvlDone = lvl.nodes.filter(n => n.done).length;

          return (
            <motion.div key={lvl.nivel} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: li * 0.12 }} className="mb-4">
              {/* Arcane level tome */}
              <div
                className="relative rounded-3xl border px-4 pt-6 pb-7 mb-2"
                style={{
                  background: `linear-gradient(180deg, ${cfg.bg}F2 0%, ${cfg.bg} 60%, rgba(0,0,0,0.3) 100%)`,
                  borderColor: `${cfg.accent}20`,
                  borderWidth: '0.5px',
                  boxShadow: `
                    inset 0 1px 0 rgba(255,255,255,0.02),
                    0 12px 40px rgba(0,0,0,0.5),
                    0 0 60px ${cfg.accentGlow},
                    0 0 100px ${cfg.accent}08
                  `,
                }}
              >
                {/* Runic corner decorations */}
                <div className="absolute top-3 left-3 text-[10px] opacity-20" style={{ color: cfg.accent }}>{cfg.rune}</div>
                <div className="absolute top-3 right-3 text-[10px] opacity-20" style={{ color: cfg.accent }}>{cfg.rune}</div>
                <div className="absolute bottom-3 left-3 text-[10px] opacity-20" style={{ color: cfg.accent }}>{cfg.rune}</div>
                <div className="absolute bottom-3 right-3 text-[10px] opacity-20" style={{ color: cfg.accent }}>{cfg.rune}</div>

                {/* Level title */}
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap px-4 py-1 rounded-2xl border text-[10px] font-bold tracking-[0.15em]"
                  style={{
                    background: cfg.bg, color: cfg.accent, borderColor: `${cfg.accent}30`, borderWidth: '0.5px',
                    boxShadow: `0 2px 12px rgba(0,0,0,0.4), 0 0 20px ${cfg.accent}20, inset 0 1px 0 rgba(255,255,255,0.03)`,
                  }}>
                  {cfg.label}
                </div>

                <div className="flex flex-col items-center gap-0 mt-3">
                  {Array.from({ length: Math.ceil(lvl.nodes.length / 2) }).map((_, rowIdx) => {
                    const leftNode = lvl.nodes[rowIdx * 2];
                    const rightNode = lvl.nodes[rowIdx * 2 + 1];
                    const chestAt = Math.floor(lvl.nodes.length / 2);
                    const chestRow = Math.floor(chestAt / 2);
                    const showChest = rowIdx === chestRow && chestAt > 0;

                    return (
                      <React.Fragment key={rowIdx}>
                        {/* Ley line connector */}
                        {rowIdx > 0 && (
                          <div className="w-[2px] h-12 flex-shrink-0 rounded-full relative"
                            style={{
                              background: `linear-gradient(180deg, ${cfg.accent}40, ${cfg.accent}15, ${cfg.accent}40)`,
                              boxShadow: `0 0 8px ${cfg.accent}15`,
                            }} />
                        )}

                        {/* Node row */}
                        <div className="flex items-center justify-center gap-0">
                          {[leftNode, rightNode].map((node, ni) => {
                            if (!node) return <div key={ni} className="w-[124px]" />;
                            const isActive = !node.done && node.unlocked;
                            const isLocked = !node.unlocked;
                            const emoji = NODE_EMOJIS[node.slug] || '🔮';

                            return (
                              <React.Fragment key={node.slug}>
                                {ni === 1 && (
                                  <div className="h-[2px] w-16 flex-shrink-0 rounded-full"
                                    style={{ background: `linear-gradient(90deg, ${cfg.accent}20, ${cfg.accent}60, ${cfg.accent}20)`, opacity: 0.6, boxShadow: `0 0 6px ${cfg.accent}15` }} />
                                )}
                                <Link href={node.unlocked ? `/guias/ciencias_naturales/fisica/${node.slug}` : '#'} className={isLocked ? 'pointer-events-none' : 'group'}>
                                  <motion.div className="flex flex-col items-center gap-1.5 cursor-pointer relative py-2.5" whileHover={node.unlocked ? { scale: 1.06 } : {}}>
                                    {/* Celestial orb */}
                                    <motion.div
                                      className="w-[70px] h-[70px] rounded-full flex items-center justify-center text-[26px] border-[3px] relative"
                                      animate={{ rotateY: 360 }}
                                      transition={{ duration: 10 + Math.random() * 6, repeat: Infinity, ease: 'linear' }}
                                      style={{
                                        transformStyle: 'preserve-3d', perspective: '400px',
                                        background: node.done
                                          ? `radial-gradient(circle at 35% 30%, ${GOLD}35 0%, #1C1510 55%, rgba(0,0,0,0.6) 100%)`
                                          : isActive
                                          ? `radial-gradient(circle at 35% 30%, ${cfg.accent}40 0%, ${cfg.bg} 55%, rgba(0,0,0,0.6) 100%)`
                                          : `radial-gradient(circle at 35% 30%, rgba(255,255,255,0.02) 0%, ${cfg.bg} 55%, rgba(0,0,0,0.5) 100%)`,
                                        borderColor: node.done ? GOLD : isActive ? cfg.accent : `${cfg.accent}40`,
                                        opacity: isLocked ? 0.35 : 1,
                                        boxShadow: node.done
                                          ? `0 6px 24px rgba(0,0,0,0.6), 0 0 24px ${GOLD}50, 0 0 50px ${GOLD}20, inset 0 2px 6px rgba(255,255,255,0.03)`
                                          : isActive
                                          ? `0 6px 24px rgba(0,0,0,0.6), 0 0 36px ${cfg.accent}60, 0 0 70px ${cfg.accent}25, inset 0 2px 6px rgba(255,255,255,0.03)`
                                          : `0 4px 16px rgba(0,0,0,0.5)`,
                                        filter: isLocked ? 'grayscale(0.5) brightness(0.5)' : 'none',
                                      }}>
                                      {/* Specular highlight */}
                                      <div className="absolute top-2 left-2.5 w-3.5 h-3.5 rounded-full bg-white opacity-[0.05]" />
                                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-1/3 rounded-full" style={{ background: 'rgba(0,0,0,0.5)', filter: 'blur(5px)' }} />
                                      {/* Emoji with arcane glow */}
                                      <span className="relative z-10"
                                        style={{
                                          textShadow: [
                                            '0 4px 10px rgba(0,0,0,0.8)',
                                            '0 2px 4px rgba(0,0,0,0.5)',
                                            '0 -1px 2px rgba(255,255,255,0.12)',
                                          ].join(', '),
                                          filter: isLocked
                                            ? 'grayscale(0.5) brightness(0.5)'
                                            : node.done
                                            ? `drop-shadow(0 0 8px ${GOLD}) drop-shadow(0 2px 4px rgba(0,0,0,0.7))`
                                            : isActive
                                            ? `drop-shadow(0 0 10px ${cfg.accent}) drop-shadow(0 2px 4px rgba(0,0,0,0.7))`
                                            : `drop-shadow(0 2px 4px rgba(0,0,0,0.5))`,
                                        }}>
                                        {emoji}
                                      </span>
                                      {/* Done seal */}
                                      {node.done && (
                                        <motion.div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold"
                                          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400 }}
                                          style={{ background: `linear-gradient(135deg, ${GOLD_LIGHT}, ${GOLD})`, color: '#1C1510', boxShadow: `0 2px 8px ${GOLD}40` }}>
                                          ✓
                                        </motion.div>
                                      )}
                                      {/* Active pulse ring */}
                                      {isActive && (
                                        <motion.div className="absolute -inset-2 rounded-full border-2 pointer-events-none"
                                          style={{ borderColor: cfg.accent }}
                                          animate={{ opacity: [0.5, 0, 0.5], scale: [1, 1.3, 1] }}
                                          transition={{ duration: 2.5, repeat: Infinity }} />
                                      )}
                                    </motion.div>

                                    {/* Node label */}
                                    <div className="text-[10px] font-bold text-center max-w-[80px] leading-tight tracking-wide"
                                      style={{
                                        color: node.done ? GOLD_DIM : isActive ? cfg.accent : isLocked ? 'rgba(200,168,66,0.2)' : 'rgba(200,168,66,0.55)',
                                        textShadow: isActive ? `0 0 10px ${cfg.accentGlow}` : node.done ? `0 0 8px ${GOLD}20` : 'none',
                                      }}>
                                      {node.title}
                                    </div>
                                    {/* Star veil markers */}
                                    <div className="flex gap-1">
                                      {[0, 1, 2].map(s => (
                                        <span key={s} className="text-[9px]"
                                          style={{
                                            opacity: s < node.layers ? 1 : 0.2,
                                            color: s < node.layers ? GOLD : cfg.accent,
                                            filter: s < node.layers ? `drop-shadow(0 0 4px ${GOLD})` : 'none',
                                          }}>✦</span>
                                      ))}
                                    </div>
                                    {/* Tooltip grimoire */}
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-[160px] rounded-2xl border px-3.5 py-2.5 text-[11px] leading-relaxed z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity shadow-2xl"
                                      style={{
                                        background: `linear-gradient(180deg, ${cfg.bg}F5, ${cfg.bg})`,
                                        borderColor: isActive ? cfg.accent : `${GOLD_DIM}60`, borderWidth: '0.5px', color: '#C8A842',
                                      }}>
                                      <strong className="block mb-1 text-[11px]" style={{ color: isActive ? cfg.accent : GOLD }}>{node.title}</strong>
                                      {node.done ? 'Sello completado. 75 esencias obtenidas.' :
                                       isActive ? '¡Portal activo! Las estrellas te aguardan.' :
                                       isLocked ? 'El velo aún no se ha rasgado.' :
                                       'Tres velos por descorrer.'}
                                    </div>
                                  </motion.div>
                                </Link>
                              </React.Fragment>
                            );
                          })}
                        </div>

                        {/* Arcane chest */}
                        {showChest && (
                          <>
                            <div className="w-[2px] h-12 flex-shrink-0 rounded-full"
                              style={{ background: `linear-gradient(180deg, ${cfg.accent}30, ${cfg.accent}10, ${cfg.accent}30)`, boxShadow: `0 0 8px ${cfg.accent}12` }} />
                            <div className="flex flex-col items-center gap-0">
                              <motion.div
                                whileHover={lvlDone >= 2 ? { scale: 1.12, rotateY: 10 } : {}}
                                className="w-[60px] h-[52px] rounded-2xl flex flex-col items-center justify-center gap-0.5 cursor-pointer relative"
                                style={{
                                  background: `radial-gradient(circle at 30% 30%, ${cfg.accent}15, ${cfg.bg})`,
                                  borderColor: lvlDone >= 2 ? GOLD : `${cfg.accent}40`,
                                  borderWidth: '2px', opacity: lvlDone >= 2 ? 1 : 0.4,
                                  boxShadow: lvlDone >= 2
                                    ? `0 6px 20px rgba(0,0,0,0.5), 0 0 28px ${GOLD}45, inset 0 1px 0 rgba(255,255,255,0.03)`
                                    : `0 4px 12px rgba(0,0,0,0.4)`,
                                  filter: lvlDone >= 2 ? 'none' : 'grayscale(0.4)',
                                }}
                                onClick={() => lvlDone >= 2 && alert('🎁 ¡Cofre astral desbloqueado! Un artefacto ancestral se une a tu colección.')}>
                                {lvlDone >= 2 ? (
                                  <div className="flex flex-col items-center gap-0.5">
                                    <Gift size={20} style={{ color: GOLD }} />
                                    <span className="text-[8px] font-bold tracking-[0.08em]" style={{ color: GOLD_DIM }}>COFRE</span>
                                  </div>
                                ) : (
                                  <div className="flex flex-col items-center gap-0.5 opacity-50">
                                    <span className="text-[18px] leading-none">🔒</span>
                                    <span className="text-[7px] font-bold tracking-[0.08em]" style={{ color: cfg.accent }}>SELLADO</span>
                                  </div>
                                )}
                              </motion.div>
                            </div>
                            <div className="w-[2px] h-12 flex-shrink-0 rounded-full"
                              style={{ background: `linear-gradient(180deg, ${cfg.accent}30, ${cfg.accent}10, ${cfg.accent}30)`, boxShadow: `0 0 8px ${cfg.accent}12` }} />
                          </>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Bottom Grimoire bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="flex items-center justify-between mt-6 px-5 py-3.5 rounded-2xl border"
          style={{
            background: `linear-gradient(180deg, rgba(20,16,20,0.9), rgba(12,8,12,0.95))`,
            borderColor: `${GOLD}20`, borderWidth: '0.5px',
            boxShadow: `0 10px 30px rgba(0,0,0,0.5), 0 0 40px ${GOLD}10, inset 0 1px 0 rgba(255,255,255,0.02)`,
          }}>
          <div className="text-xs font-medium" style={{ color: 'rgba(200,168,66,0.5)' }}>
            Esencias: <strong className="tracking-wide" style={{ color: GOLD_LIGHT }}>{totalXP} / {maxXP}</strong>
            <span className="mx-2 opacity-20">·</span>
            Rango: <strong style={{ color: GOLD }}>Iniciado del Éter</strong>
          </div>
          <Link href="/guias/ciencias_naturales/fisica"
            className="text-[11px] font-bold px-5 py-2.5 rounded-2xl border transition-all hover:scale-105"
            style={{
              background: `linear-gradient(180deg, rgba(40,30,10,0.8), rgba(20,12,4,0.9))`,
              borderColor: GOLD, borderWidth: '1px', color: GOLD,
              boxShadow: `0 2px 10px rgba(0,0,0,0.4), 0 0 20px ${GOLD}25`,
            }}>
            Cruzar el Portal ↗
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
