'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, BookOpen, Quote, Target, Sparkles, Hexagon, X } from 'lucide-react';
import { useGamification } from '@/context/GamificationContext';
import { LearningPath, LearningPathArticle, LearningPathLevel } from '@/components/LearningPath';
import { NexusNode3D } from '@/components/NexusNode3D';
import { CATEGORIES_DATA } from '@/data/categories';
import { cn } from '@/lib/utils';

interface Home2ClientProps {
  levels: LearningPathLevel[];
  articles: LearningPathArticle[];
  articleContent: Record<string, { introduccion?: string; secciones?: { titulo: string; niveles?: Record<string, string> }[] }>;
}

function NodePoint({ id, active, label, x, y, delay = 0, onClick }: any) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, scale: 0 }}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.95 }}
      animate={{
        opacity: 1,
        scale: active ? 1.25 : 1,
        left: `${x}%`,
        top: `${y}%`,
        boxShadow: active ? "0 0 60px rgba(212,175,55,0.4)" : "0 0 20px rgba(212,175,55,0)"
      }}
      transition={{ delay, duration: 0.8, type: "spring", stiffness: 100 }}
      className={cn(
        "absolute -translate-x-1/2 -translate-y-1/2 group z-20 pointer-events-auto cursor-pointer",
        "w-16 h-16 md:w-32 md:h-32 rounded-full flex flex-col items-center justify-center transition-all",
        active
          ? "bg-brand-cosmic/10 text-brand-ink border-4 border-brand-cosmic shadow-[0_0_40px_rgba(14,165,233,0.3)]"
          : "bg-brand-ink/40 backdrop-blur-3xl border border-brand-gold/30 text-brand-gold hover:border-brand-cosmic hover:text-brand-cosmic hover:shadow-[0_0_30px_rgba(14,165,233,0.2)]"
      )}
    >
      <div className="absolute inset-0 rounded-full bg-brand-cosmic/0 blur-xl group-hover:bg-brand-cosmic/20 transition-colors" />
      <div className="w-full h-full p-2 relative z-10 transition-transform duration-500 group-hover:scale-110">
        <NexusNode3D id={id} active={active} />
      </div>
      <div className={cn(
        "absolute top-full mt-6 flex flex-col items-center transition-all duration-500",
        active ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
      )}>
        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand-cosmic whitespace-nowrap bg-brand-ink/80 px-4 py-1 backdrop-blur-md border border-brand-cosmic/30">
          {label}
        </span>
        <div className="w-px h-8 bg-gradient-to-b from-brand-cosmic/60 to-transparent mt-2" />
      </div>
    </motion.button>
  );
}

function ConnectionLine({ x1, y1, x2, y2, active }: any) {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible">
      <motion.line
        x1={`${x1}%`} y1={`${y1}%`} x2={`${x2}%`} y2={`${y2}%`}
        stroke={active ? "var(--brand-cosmic, #0EA5E9)" : "rgba(212, 175, 55, 0.1)"}
        strokeWidth={active ? 2 : 1}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, delay: 0.5 }}
      />
      {active && (
        <motion.circle
          r="3"
          fill="var(--brand-cosmic, #0EA5E9)"
          animate={{
            cx: [`${x1}%`, `${x2}%`],
            cy: [`${y1}%`, `${y2}%`],
            opacity: [0, 1, 0]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </svg>
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
  const [activeNode, setActiveNode] = useState<string | null>(null);

  useEffect(() => { setMounted(true); }, []);

  const completedArticles = new Set(
    (progress.completedPaths || []).map(p => p.replace('article_read_', '').replace(/^.*\//, ''))
  );

  const layersByArticle: Record<string, string[]> = {};
  for (const [slug, layers] of Object.entries(progress.completedLayers || {})) {
    layersByArticle[slug] = layers;
  }

  const dailyFragment = mounted ? pickDailyFragment(articleContent, articles) : null;
  const selectedCategory = CATEGORIES_DATA.find(c => c.id === activeNode);

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

      {/* HERO — NEXUS CONSTELLATION */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center p-4 overflow-hidden">
        <motion.div
          animate={{ x: activeNode ? "-15%" : "0%" }}
          transition={{ duration: 0.8, ease: "circOut" }}
          className="relative w-full h-full max-w-5xl mx-auto flex items-center justify-center"
        >
          {/* Constellation Lines */}
          <div className="absolute inset-0">
            {CATEGORIES_DATA.map((cat, i) => {
              const angle = (i / CATEGORIES_DATA.length) * Math.PI * 2;
              const x = 50 + Math.cos(angle) * 35;
              const y = 50 + Math.sin(angle) * 35;
              return (
                <ConnectionLine
                  key={cat.id}
                  x1={50} y1={50} x2={x} y2={y}
                  active={activeNode === cat.id}
                />
              );
            })}
          </div>

          {/* Nodes */}
          <div className="absolute inset-0 pointer-events-none">
            {CATEGORIES_DATA.map((cat, i) => {
              const angle = (i / CATEGORIES_DATA.length) * Math.PI * 2;
              const x = 50 + Math.cos(angle) * 35;
              const y = 50 + Math.sin(angle) * 35;
              return (
                <NodePoint
                  key={cat.id}
                  id={cat.id}
                  x={x} y={y}
                  label={cat.name}
                  delay={i * 0.15}
                  active={activeNode === cat.id}
                  onClick={() => setActiveNode(activeNode === cat.id ? null : cat.id)}
                />
              );
            })}
          </div>

          {/* Central Core */}
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            className="relative z-30 flex flex-col items-center"
          >
            <div className="relative group cursor-pointer" onClick={() => setActiveNode(null)}>
              <div className="absolute inset-0 rounded-full bg-brand-gold opacity-20 blur-[60px] animate-pulse group-hover:opacity-40 transition-opacity" />
              <div className="absolute inset-0 rounded-full bg-brand-cosmic opacity-20 blur-[80px] animate-pulse scale-125 mix-blend-screen group-hover:opacity-50 transition-opacity" />
              <div className="w-48 h-48 md:w-64 md:h-64 border-2 border-brand-gold hover:border-brand-cosmic flex items-center justify-center bg-brand-ink/80 backdrop-blur-3xl shadow-[0_0_80px_rgba(14,165,233,0.15)] group-hover:shadow-[0_0_100px_rgba(14,165,233,0.3)] transition-all p-6 relative">
                <div className="absolute inset-0 z-0 overflow-hidden opacity-40">
                  <NexusNode3D id="core" active={!!activeNode} />
                </div>
                <div className="absolute inset-2 border border-brand-gold/20 pointer-events-none" />
                <div className="text-center relative z-10 w-full">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center"
                  >
                    <Hexagon size={240} className="text-brand-gold" />
                  </motion.div>
                  <h1 className="font-serif text-4xl md:text-6xl tracking-tight leading-none text-brand-offwhite mb-2">
                    AE<span className="italic text-brand-gold">TER</span>NA
                  </h1>
                  <div className="flex items-center justify-center gap-2 text-[7px] md:text-[8px] font-bold uppercase tracking-[0.4em] text-brand-gold">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-ping" />
                    El Camino del Sabio
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* LATERAL BRANCH PANEL */}
        <AnimatePresence>
          {activeNode && selectedCategory && (
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="absolute right-0 top-0 h-full w-full md:w-[500px] lg:w-[700px] bg-brand-ink border-l border-brand-gold/30 z-50 overflow-hidden flex flex-col"
            >
              <div className="absolute inset-0 bg-engraving opacity-10 pointer-events-none" />
              <div className="relative z-10 flex flex-col h-full">
                <div className="p-12 flex items-center justify-between border-b border-brand-gold/10 bg-brand-ink/50 backdrop-blur-xl">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-full border border-brand-gold/40 flex items-center justify-center text-brand-gold">
                      <selectedCategory.icon size={20} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-brand-gold">Navegador del Nexo</span>
                  </div>
                  <button
                    onClick={() => setActiveNode(null)}
                    className="w-12 h-12 rounded-full border border-brand-gold/10 flex items-center justify-center text-brand-gold hover:bg-brand-gold hover:text-brand-ink transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
                  <div className="mb-16">
                    <Link href={selectedCategory.path || `/guias/${selectedCategory.id}`}
                      className="group relative flex flex-col items-center text-center bg-brand-ink border border-brand-gold/20 p-16 hover:border-brand-gold/50 transition-all shadow-2xl overflow-hidden backdrop-blur-sm">
                      <div className="w-20 h-20 rounded-full bg-brand-gold text-brand-ink flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(212,175,55,0.3)] group-hover:scale-110 transition-transform duration-500">
                        <Sparkles size={32} />
                      </div>
                      <h2 className="text-4xl font-serif text-brand-offwhite mb-4 group-hover:text-brand-gold transition-colors italic">Guía Maestra de {selectedCategory.name}</h2>
                      <div className="flex items-center gap-4 text-brand-gold text-[10px] font-bold uppercase tracking-[0.5em] border-t border-brand-gold/10 pt-8 w-full justify-center">
                        <span>Establecer Sincronización</span>
                        <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                      </div>
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {selectedCategory.subcategories.map((sub, idx) => (
                      <motion.div key={sub.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + (idx * 0.05) }}>
                        <Link href={`${selectedCategory.path || `/guias/${selectedCategory.id}`}/${sub.id}`}
                          className="group flex flex-col gap-6 bg-brand-ink border border-white/[0.05] p-8 hover:bg-white/[0.03] hover:border-brand-gold/30 transition-all shadow-inner">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-6">
                              <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold group-hover:bg-brand-gold group-hover:text-brand-ink transition-colors">
                                <sub.icon size={18} />
                              </div>
                              <h3 className="text-2xl font-serif text-brand-offwhite group-hover:text-brand-gold transition-colors">{sub.name}</h3>
                            </div>
                            <ArrowRight size={16} className="text-brand-gold/20 group-hover:text-brand-gold transition-colors" />
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
