'use client';
import React, { useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Gift } from 'lucide-react';
import fisicaCurriculum from '@/data/curriculum/fisica.json';
import { useGamification } from '@/context/GamificationContext';

type ArticleJSON = { slug: string; title: string; nivel: number; orden: number; tipo?: string };

const GOLD = '#D4AF37';
const GOLD_LIGHT = '#F0D060';
const GOLD_DIM = '#B8860B';
const GOLD_DARK = '#8B6914';

const LEVEL_CONFIG: Record<number, {
  label: string; border: string; bg: string; accent: string; accentDim: string; glow: string;
  chestBg: string; chestBorder: string;
}> = {
  1: { label: '🌍 NIVEL 1 — Fundamentos del Cosmos', border: '#2A2415', bg: '#16140F', accent: '#B8860B', accentDim: '#6B4E0A', glow: 'rgba(212,175,55,0.25)', chestBg: '#1C1810', chestBorder: '#D4AF37' },
  2: { label: '⚙️ NIVEL 2 — El Reino de lo Clásico', border: '#2A2045', bg: '#14121B', accent: '#7F77DD', accentDim: '#4A4290', glow: 'rgba(127,119,221,0.2)', chestBg: '#1A1628', chestBorder: '#7F77DD' },
  3: { label: '🔮 NIVEL 3 — Las Fronteras de la Realidad', border: '#3A2015', bg: '#1B1410', accent: '#E87B3A', accentDim: '#9B4A20', glow: 'rgba(232,123,58,0.2)', chestBg: '#1C1810', chestBorder: '#E87B3A' },
  4: { label: '🌟 NIVEL 4 — La Síntesis y el Futuro', border: '#3A1520', bg: '#1B1014', accent: '#D4536A', accentDim: '#8E2E42', glow: 'rgba(212,83,106,0.2)', chestBg: '#1C1014', chestBorder: '#D4536A' },
};

const NODE_EMOJIS: Record<string, string> = {
  'guia-maestra-de-fisica':'🗺️','como-piensa-un-fisico':'⚡','cinematica':'🌀','materia-y-energia':'💎',
  'metodo-cientifico':'🔬','vectores':'📐','leyes-newton-movimiento':'🍎','trabajo-energia':'⚙️',
  'momentum-colisiones':'💥','movimiento-circular-satelites':'🛰️','torque-momento-angular':'🔄',
  'termodinamica':'🔥','electromagnetismo':'⚡','ondas-y-optica':'🌈','mecanica-cuantica':'🐱',
  'relatividad-especial':'⏱️','relatividad-general':'🕳️','fisica-atomica-y-nuclear':'⚛️',
  'fisica-particulas':'🧩','teoria-del-todo':'🌌','cosmologia':'🌠','fluidos':'💧',
  'electromagnetismo-avanzado':'🔌','ondas-y-optica-practica':'👁️','relatividad-especial-practica':'🚀',
};

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
    <div className="min-h-screen text-[#C8A842]" style={{ background: 'radial-gradient(ellipse at 50% 0%, #1A1508 0%, #0D0B08 70%)', fontFamily: 'var(--font-sans), system-ui, sans-serif' }}>
      {/* Ambient floating particles */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-[2px] h-[2px] rounded-full"
            style={{ background: i % 3 === 0 ? GOLD : i % 3 === 1 ? '#7F77DD' : '#E87B3A', left: `${10 + Math.random() * 80}%`, top: `${10 + Math.random() * 80}%` }}
            animate={{ y: [0, -30 + Math.random() * 20, 0], opacity: [0.2, 0.7, 0.2] }}
            transition={{ duration: 3 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 5 }}
          />
        ))}
      </div>

      <div className="max-w-[680px] mx-auto py-8 px-4 relative z-10">
        {/* Header */}
        <motion.div className="text-center mb-10" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
          <h1
            className="font-serif text-3xl font-bold mb-2 tracking-tight"
            style={{
              color: GOLD_LIGHT,
              textShadow: `
                0 2px 4px rgba(0,0,0,0.5),
                0 0 40px rgba(212,175,55,0.2),
                0 0 80px rgba(212,175,55,0.1)
              `,
            }}
          >
            El Sendero del Sabio
          </h1>
          <p className="text-sm tracking-wide" style={{ color: 'rgba(200,168,66,0.4)' }}>16 paradas · 4 niveles · 3 capas por lección</p>
        </motion.div>

        {levels.map((lvl, li) => {
          const cfg = LEVEL_CONFIG[lvl.nivel] || LEVEL_CONFIG[1];
          const lvlDone = lvl.nodes.filter(n => n.done).length;

          return (
            <motion.div
              key={lvl.nivel}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: li * 0.1 }}
              className="mb-3"
            >
              {/* Level band */}
              <div
                className="relative rounded-2xl border px-3 pt-5 pb-6 mb-2"
                style={{
                  background: `linear-gradient(180deg, ${cfg.bg}CC, ${cfg.bg})`,
                  borderColor: cfg.border,
                  borderWidth: '0.5px',
                  boxShadow: `
                    inset 0 1px 0 rgba(255,255,255,0.03),
                    0 8px 24px rgba(0,0,0,0.4),
                    0 0 40px ${cfg.glow}
                  `,
                }}
              >
                {/* Level title */}
                <div
                  className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 rounded-2xl border text-[10px] font-bold tracking-[0.12em]"
                  style={{
                    background: cfg.bg,
                    color: cfg.accent,
                    borderColor: cfg.border,
                    borderWidth: '0.5px',
                    boxShadow: `0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.02)`,
                    textShadow: `0 0 10px ${cfg.glow}`,
                  }}
                >
                  {cfg.label}
                </div>

                <div className="flex flex-col items-center gap-0 mt-2.5">
                  {Array.from({ length: Math.ceil(lvl.nodes.length / 2) }).map((_, rowIdx) => {
                    const leftNode = lvl.nodes[rowIdx * 2];
                    const rightNode = lvl.nodes[rowIdx * 2 + 1];
                    const chestAt = Math.floor(lvl.nodes.length / 2);
                    const chestOnLeft = chestAt % 2 === 0;
                    const chestRow = Math.floor(chestAt / 2);
                    const showChestAfter = rowIdx === chestRow && chestAt > 0;

                    return (
                      <React.Fragment key={rowIdx}>
                        {/* Vertical connector */}
                        {rowIdx > 0 && (
                          <div className="w-[3px] h-10 flex-shrink-0 rounded-full relative"
                            style={{
                              background: `linear-gradient(180deg, ${cfg.accent}60, ${cfg.accentDim}40)`,
                              boxShadow: `0 0 6px ${cfg.accent}30`,
                            }}
                          >
                            <div className="absolute inset-0 rounded-full" style={{ background: `linear-gradient(90deg, transparent, ${cfg.accent}15, transparent)` }} />
                          </div>
                        )}

                        {/* Row of 2 nodes */}
                        <div className="flex items-center justify-center gap-0">
                          {[leftNode, rightNode].map((node, ni) => {
                            if (!node) return <div key={ni} className="w-[120px]" />;
                            const isActive = !node.done && node.unlocked;
                            const isLocked = !node.unlocked;
                            const emoji = NODE_EMOJIS[node.slug] || '📚';

                            return (
                              <React.Fragment key={node.slug}>
                                {ni === 1 && (
                                  <div className="h-[3px] w-14 flex-shrink-0 rounded-full relative"
                                    style={{
                                      background: `linear-gradient(90deg, ${cfg.accentDim}40, ${cfg.accent}80, ${cfg.accentDim}40)`,
                                      boxShadow: `0 0 8px ${cfg.accent}20`,
                                      opacity: 0.5,
                                    }}
                                  />
                                )}
                                <Link href={node.unlocked ? `/guias/ciencias_naturales/fisica/${node.slug}` : '#'}
                                  className={isLocked ? 'pointer-events-none' : 'group'}>
                                  <motion.div
                                    className="flex flex-col items-center gap-1.5 cursor-pointer relative py-2"
                                    whileHover={node.unlocked ? { scale: 1.05 } : {}}
                                  >
                                    {/* 3D Node circle */}
                                    <div
                                      className="w-[68px] h-[68px] rounded-full flex items-center justify-center text-[24px] border-[3px] relative transition-all duration-300 shadow-lg"
                                      style={{
                                        background: node.done
                                          ? `radial-gradient(circle at 40% 35%, ${GOLD}22, #1C1510 70%)`
                                          : isActive
                                          ? `radial-gradient(circle at 40% 35%, ${cfg.accent}30, #2A1E08 70%)`
                                          : `radial-gradient(circle at 40% 35%, rgba(255,255,255,0.02), ${cfg.bg} 70%)`,
                                        borderColor: node.done ? GOLD : isActive ? cfg.accent : cfg.accentDim,
                                        opacity: isLocked ? 0.4 : 1,
                                        boxShadow: node.done
                                          ? `0 4px 16px rgba(0,0,0,0.5), 0 0 20px ${GOLD}40, 0 0 40px ${GOLD}15, inset 0 2px 4px rgba(255,255,255,0.04)`
                                          : isActive
                                          ? `0 4px 16px rgba(0,0,0,0.5), 0 0 32px ${cfg.accent}50, 0 0 60px ${cfg.accent}20, inset 0 2px 4px rgba(255,255,255,0.04)`
                                          : `0 4px 12px rgba(0,0,0,0.4)`,
                                        filter: isLocked ? 'grayscale(0.6)' : 'none',
                                      }}
                                    >
                                      {/* Specular highlight */}
                                      <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-white opacity-[0.06]" />
                                      {/* Bottom shadow for sphere depth */}
                                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-1/3 rounded-full opacity-30"
                                        style={{ background: 'rgba(0,0,0,0.5)', filter: 'blur(4px)' }} />
                                      {/* Emoji with 3D text effects */}
                                      <span className="relative z-10"
                                        style={{
                                          textShadow: [
                                            `0 4px 8px rgba(0,0,0,0.7)`,        // deep shadow
                                            `0 2px 4px rgba(0,0,0,0.5)`,         // mid shadow  
                                            `0 1px 2px rgba(0,0,0,0.3)`,         // tight shadow
                                            `0 -1px 0 rgba(255,255,255,0.15)`,    // top highlight
                                          ].join(', '),
                                          filter: isLocked
                                            ? 'grayscale(0.6) brightness(0.7)'
                                            : node.done
                                            ? `drop-shadow(0 0 6px ${GOLD}) drop-shadow(0 2px 4px rgba(0,0,0,0.6))`
                                            : isActive
                                            ? `drop-shadow(0 0 8px ${cfg.accent}) drop-shadow(0 2px 4px rgba(0,0,0,0.6))`
                                            : `drop-shadow(0 2px 4px rgba(0,0,0,0.5))`,
                                        }}>
                                        {emoji}
                                      </span>
                                      {/* Done check */}
                                      {node.done && (
                                        <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shadow-md"
                                          style={{ background: `linear-gradient(135deg, ${GOLD_LIGHT}, ${GOLD})`, color: '#1C1510' }}>
                                          ✓
                                        </div>
                                      )}
                                      {/* XP badge */}
                                      {isActive && (
                                        <motion.div
                                          animate={{ scale: [1, 1.08, 1] }}
                                          transition={{ duration: 2, repeat: Infinity }}
                                          className="absolute -top-2.5 -right-2.5 text-[9px] font-bold px-1.5 py-0.5 rounded-2xl shadow-lg"
                                          style={{ background: `linear-gradient(135deg, ${cfg.accent}, ${cfg.accentDim})`, color: '#FFF' }}>
                                          +25 XP
                                        </motion.div>
                                      )}
                                    </div>

                                    {/* Node label */}
                                    <div
                                      className="text-[10px] font-bold text-center max-w-[76px] leading-tight tracking-wide"
                                      style={{
                                        color: node.done ? GOLD_DIM : isActive ? cfg.accent : isLocked ? 'rgba(200,168,66,0.25)' : 'rgba(200,168,66,0.65)',
                                        textShadow: isActive ? `0 0 10px ${cfg.glow}` : node.done ? `0 0 8px ${GOLD}30` : 'none',
                                      }}>
                                      {node.title}
                                    </div>

                                    {/* Star rating */}
                                    <div className="flex gap-0.5">
                                      {[0, 1, 2].map(s => (
                                        <span key={s} className="text-[9px] transition-all"
                                          style={{
                                            opacity: s < node.layers ? 1 : 0.25,
                                            filter: s < node.layers ? `drop-shadow(0 0 3px ${GOLD})` : 'none',
                                          }}>★</span>
                                      ))}
                                    </div>

                                    {/* Tooltip */}
                                    <div
                                      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 w-[150px] rounded-xl border px-3 py-2.5 text-[11px] leading-relaxed z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity shadow-2xl"
                                      style={{
                                        background: `linear-gradient(180deg, ${cfg.bg}EE, ${cfg.bg})`,
                                        borderColor: isActive ? cfg.accent : GOLD_DIM,
                                        borderWidth: '0.5px',
                                        color: '#C8A842',
                                      }}>
                                      <strong className="block mb-1 text-[11px]" style={{ color: isActive ? cfg.accent : GOLD }}>
                                        {node.title}
                                      </strong>
                                      {node.done ? 'Lección completada. 75 XP obtenidos.' :
                                       isActive ? '¡Activa! Continúa tu expedición.' :
                                       isLocked ? 'Completa la anterior para desbloquear.' :
                                       'Disponible. 3 capas por descubrir.'}
                                    </div>
                                  </motion.div>
                                </Link>
                              </React.Fragment>
                            );
                          })}
                        </div>

                        {/* Treasure Chest at mid-point */}
                        {showChestAfter && (
                          <>
                            <div className="w-[3px] h-10 flex-shrink-0 rounded-full"
                              style={{ background: `linear-gradient(180deg, ${cfg.accent}60, ${cfg.accentDim}40)`, boxShadow: `0 0 8px ${cfg.accent}25` }} />
                            <div className="flex flex-col items-center gap-0">
                              <motion.div
                                whileHover={{ scale: 1.1, rotateY: 5 }}
                                className="w-[56px] h-[48px] rounded-xl flex flex-col items-center justify-center gap-0.5 cursor-pointer relative shadow-lg"
                                style={{
                                  background: `radial-gradient(circle at 30% 30%, ${cfg.accent}18, ${cfg.chestBg})`,
                                  borderColor: lvlDone >= 2 ? GOLD : cfg.accentDim,
                                  borderWidth: '2px',
                                  opacity: lvlDone >= 2 ? 1 : 0.45,
                                  boxShadow: lvlDone >= 2
                                    ? `0 4px 16px rgba(0,0,0,0.4), 0 0 24px ${GOLD}40, inset 0 1px 0 rgba(255,255,255,0.03)`
                                    : `0 4px 12px rgba(0,0,0,0.3)`,
                                  filter: lvlDone >= 2 ? 'none' : 'grayscale(0.5)',
                                }}
                                onClick={() => lvlDone >= 2 && alert('🎁 ¡Cofre desbloqueado! Obtuviste: Mueble raro + 150 XP bonus.')}
                              >
                                {lvlDone >= 2 ? (
                                  <Gift size={20} className="shrink-0" style={{ color: GOLD }} />
                                ) : (
                                  <Gift size={20} className="shrink-0" style={{ color: cfg.accentDim, opacity: 0.6 }} />
                                )}
                                <span className="text-[8px] font-bold tracking-[0.06em]" style={{ color: lvlDone >= 2 ? GOLD_DIM : cfg.accentDim }}>
                                  {lvlDone >= 2 ? 'COFRE' : 'BLOQUEADO'}
                                </span>
                              </motion.div>
                            </div>
                            <div className="w-[3px] h-10 flex-shrink-0 rounded-full"
                              style={{ background: `linear-gradient(180deg, ${cfg.accent}60, ${cfg.accentDim}40)`, boxShadow: `0 0 8px ${cfg.accent}25` }} />
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

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mt-5 px-4 py-3 rounded-2xl border shadow-xl"
          style={{
            background: `linear-gradient(180deg, #1C1810EE, #16140F)`,
            borderColor: '#2A2415',
            borderWidth: '0.5px',
            boxShadow: `0 8px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.02)`,
          }}
        >
          <div className="text-xs font-medium" style={{ color: 'rgba(200,168,66,0.6)' }}>
            XP total: <strong className="tracking-wide" style={{ color: GOLD_LIGHT }}>{totalXP} / {maxXP}</strong>
            <span className="mx-2 opacity-30">·</span>
            Nivel: <strong style={{ color: GOLD }}>Aprendiz del Cosmos</strong>
          </div>
          <Link href="/guias/ciencias_naturales/fisica"
            className="text-[11px] font-bold px-4 py-2 rounded-2xl border shadow-md transition-all hover:scale-105"
            style={{
              background: `linear-gradient(180deg, #2A2008, #1C1810)`,
              borderColor: GOLD,
              borderWidth: '1px',
              color: GOLD,
              boxShadow: `0 2px 8px rgba(0,0,0,0.3), 0 0 16px ${GOLD}20`,
            }}>
            Continuar ↗
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
