'use client';
import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import fisicaCurriculum from '@/data/curriculum/fisica.json';
import { useGamification } from '@/context/GamificationContext';

type ArticleJSON = { slug: string; title: string; nivel: number; orden: number; tipo?: string };

const GOLD = '#D4AF37';
const GOLD_DIM = '#B8860B';
const GOLD_DARK = '#8B6914';
const LVL2_ACCENT = '#534AB7';
const LEVEL_LABELS: Record<number, string> = { 1: '🌍 NIVEL 1 — Fundamentos del Cosmos', 2: '⚙️ NIVEL 2 — El Reino de lo Clásico', 3: '🔮 NIVEL 3 — Las Fronteras de la Realidad', 4: '🌟 NIVEL 4 — La Síntesis y el Futuro' };
const NODE_EMOJIS: Record<string, string> = {
  'guia-maestra-de-fisica': '🗺️', 'como-piensa-un-fisico': '⚡', 'cinematica': '🌀',
  'materia-y-energia': '💎', 'metodo-cientifico': '🔬', 'vectores': '📐',
  'leyes-newton-movimiento': '🍎', 'trabajo-energia': '⚙️', 'momentum-colisiones': '💥',
  'movimiento-circular-satelites': '🛰️', 'torque-momento-angular': '🔄',
  'termodinamica': '🔥', 'electromagnetismo': '⚡', 'ondas-y-optica': '🌈',
  'mecanica-cuantica': '🐱', 'relatividad-especial': '⏱️', 'relatividad-general': '🕳️',
  'fisica-atomica-y-nuclear': '⚛️', 'fisica-particulas': '🧩', 'teoria-del-todo': '🌌',
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
    <div className="min-h-screen" style={{ background: '#0D0B08', color: '#C8A842', fontFamily: 'var(--font-sans), system-ui, sans-serif' }}>
      <div className="max-w-[680px] mx-auto py-6 px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-serif text-2xl font-bold mb-1" style={{ color: GOLD }}>El Sendero del Sabio</h1>
          <p className="text-xs" style={{ color: 'rgba(200,168,66,0.5)' }}>16 paradas · 4 niveles · 3 capas por lección</p>
        </div>

        {levels.map((lvl, li) => {
          const lvlDone = lvl.nodes.filter(n => n.done).length;
          const lvlColor = li === 0 ? GOLD_DIM : li === 1 ? '#7F77DD' : li === 2 ? '#E87B3A' : '#D4536A';
          const lvlBorder = li === 0 ? '#2A2415' : li === 1 ? '#2A2045' : li === 2 ? '#3A2015' : '#3A1520';
          const lvlBg = li === 0 ? '#16140F' : li === 1 ? '#14121B' : li === 2 ? '#1B1410' : li === 3 ? '#1B1014' : '#16140F';

          return (
            <div key={lvl.nivel} className="mb-2">
              {/* Level band */}
              <div className="relative rounded-xl border px-3 pt-5 pb-5 mb-2" style={{ background: lvlBg, borderColor: lvlBorder, borderWidth: '0.5px' }}>
                {/* Level title — positioned absolute top-center */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-0.5 rounded-xl border text-[10px] font-semibold tracking-[0.1em]" style={{ background: lvlBg, color: lvlColor, borderColor: lvlBorder, borderWidth: '0.5px' }}>
                  {LEVEL_LABELS[lvl.nivel] || `NIVEL ${lvl.nivel}`}
                </div>

                <div className="flex flex-col items-center gap-0 mt-2">
                  {/* Nodes in horizontal rows, 2 per row */}
                  {Array.from({ length: Math.ceil(lvl.nodes.length / 2) }).map((_, rowIdx) => {
                    const leftNode = lvl.nodes[rowIdx * 2];
                    const rightNode = lvl.nodes[rowIdx * 2 + 1];
                    return (
                      <React.Fragment key={rowIdx}>
                        {/* Vertical connector between rows */}
                        {rowIdx > 0 && (
                          <div className="w-[2px] h-8 flex-shrink-0" style={{ background: `linear-gradient(180deg, ${lvlColor}, ${lvlColor}80)`, opacity: 0.5 }} />
                        )}
                        {/* Chest at midpoint */}
                        {rowIdx === Math.ceil(lvl.nodes.length / 4) && lvl.nodes.length > 2 && (
                          <>
                            <div className="w-[2px] h-8 flex-shrink-0" style={{ background: `linear-gradient(180deg, ${lvlColor}, ${lvlColor}80)`, opacity: 0.5 }} />
                            <div className="flex flex-col items-center gap-0">
                              <motion.div
                                whileHover={{ scale: 1.08 }}
                                className="w-[52px] h-10 rounded-lg border flex flex-col items-center justify-center gap-0.5 cursor-pointer relative"
                                style={{ background: '#1C1810', borderColor: lvlDone >= 2 ? GOLD : lvlColor, borderWidth: '1.5px', opacity: lvlDone >= 2 ? 1 : 0.4, boxShadow: lvlDone >= 2 ? `0 0 12px ${GOLD}40` : 'none' }}
                                onClick={() => lvlDone >= 2 && alert('🎁 ¡Cofre desbloqueado!')}
                              >
                                <span className="text-lg leading-none">{lvlDone >= 2 ? '🎁' : '🔒'}</span>
                                <span className="text-[8px] font-medium tracking-[0.05em]" style={{ color: lvlDone >= 2 ? GOLD_DARK : lvlColor }}>{lvlDone >= 2 ? 'COFRE' : 'BLOQUEADO'}</span>
                              </motion.div>
                            </div>
                            <div className="w-[2px] h-8 flex-shrink-0" style={{ background: `linear-gradient(180deg, ${lvlColor}, ${lvlColor}80)`, opacity: 0.5 }} />
                          </>
                        )}
                        {/* Row of 2 nodes */}
                        <div className="flex items-center justify-center gap-0">
                          {[leftNode, rightNode].map((node, ni) => {
                            if (!node) return <div key={ni} className="w-[112px]" />;
                            const isActive = !node.done && node.unlocked;
                            const isLocked = !node.unlocked;
                            const emoji = NODE_EMOJIS[node.slug] || '📚';
                            return (
                              <React.Fragment key={node.slug}>
                                {/* Horizontal connector between nodes */}
                                {ni === 1 && (
                                  <div className="h-[2px] w-12 flex-shrink-0" style={{ background: `linear-gradient(90deg, ${lvlColor}, ${lvlColor}CC)`, opacity: 0.4 }} />
                                )}
                                <Link href={node.unlocked ? `/guias/ciencias_naturales/fisica/${node.slug}` : '#'}
                                  className={isLocked ? 'pointer-events-none' : ''}>
                                  <motion.div className="flex flex-col items-center gap-1.5 cursor-pointer relative py-1" whileHover={node.unlocked ? { scale: 1.04 } : {}}>
                                    {/* Node circle */}
                                    <div
                                      className="w-16 h-16 rounded-full flex items-center justify-center text-[22px] border-[2.5px] relative transition-all"
                                      style={{
                                        background: node.done ? '#1C1510' : isActive ? '#2A1E08' : '#16140F',
                                        borderColor: node.done ? GOLD : isActive ? '#EF9F27' : lvlColor,
                                        opacity: isLocked ? 0.5 : 1,
                                        boxShadow: node.done ? `0 0 0 4px ${GOLD}26` : isActive ? `0 0 0 6px rgba(239,159,39,0.2), 0 0 16px rgba(239,159,39,0.3)` : 'none',
                                      }}
                                    >
                                      {emoji}
                                      {/* Done check */}
                                      {node.done && (
                                        <div className="absolute -top-1 -right-1 w-[18px] h-[18px] rounded-full flex items-center justify-center text-[10px]" style={{ background: GOLD, color: '#1C1510' }}>✓</div>
                                      )}
                                      {/* XP badge on active */}
                                      {isActive && (
                                        <div className="absolute -top-2 -right-2 text-[9px] font-semibold px-1.5 py-0.5 rounded-xl leading-tight" style={{ background: '#EF9F27', color: '#412402' }}>+25 XP</div>
                                      )}
                                    </div>
                                    {/* Node label */}
                                    <div className="text-[10px] font-medium text-center max-w-[72px] leading-tight" style={{ color: node.done ? GOLD_DIM : isActive ? '#EF9F27' : isLocked ? 'rgba(200,168,66,0.3)' : 'rgba(200,168,66,0.7)' }}>
                                      {node.title}
                                    </div>
                                    {/* Star rating */}
                                    <div className="flex gap-0.5 mt-0.5">
                                      {[0, 1, 2].map(s => (
                                        <span key={s} className="text-[8px]" style={{ opacity: s < node.layers ? 1 : 0.3 }}>★</span>
                                      ))}
                                    </div>
                                    {/* Tooltip on hover */}
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-[140px] rounded-lg border px-2.5 py-2 text-[11px] leading-relaxed z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
                                      style={{ background: '#1C1810', borderColor: GOLD, borderWidth: '0.5px', color: '#C8A842' }}>
                                      <strong className="block mb-0.5 text-[11px]" style={{ color: GOLD }}>{node.title}</strong>
                                      {node.done ? 'Lección completada. Obtuviste 75 XP.' :
                                       isActive ? 'Lección activa. ¡Continúa tu viaje!' :
                                       isLocked ? 'Completa la lección anterior para desbloquear.' :
                                       'Disponible. 3 capas de profundidad.'}
                                    </div>
                                  </motion.div>
                                </Link>
                              </React.Fragment>
                            );
                          })}
                        </div>
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}

        {/* Bottom bar */}
        <div className="flex items-center justify-between mt-4 px-3.5 py-2.5 rounded-xl border" style={{ background: '#16140F', borderColor: '#2A2415', borderWidth: '0.5px' }}>
          <div className="text-xs" style={{ color: 'rgba(200,168,66,0.6)' }}>
            XP total: <strong style={{ color: GOLD }}>{totalXP} / {maxXP}</strong> · Nivel: <strong style={{ color: GOLD }}>Aprendiz del Cosmos</strong>
          </div>
          <Link href="/guias/ciencias_naturales/fisica"
            className="text-[11px] px-3 py-1.5 rounded-2xl border transition-colors hover:opacity-80"
            style={{ background: '#1C1810', borderColor: GOLD, borderWidth: '0.5px', color: GOLD }}>
            Continuar ↗
          </Link>
        </div>
      </div>
    </div>
  );
}
