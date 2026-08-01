'use client';
import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ChevronDown, ChevronUp, Sparkles, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface LearningPathArticle {
  slug: string;
  title: string;
  insignia: string;
  nivel: number;
  orden: number;
}

export interface LearningPathLevel {
  nivel: number;
  titulo: string;
  descripcion: string;
  icon: string;
  color: string;
}

export interface LearningPathProps {
  levels: LearningPathLevel[];
  articles: LearningPathArticle[];
  completedArticles: Set<string>;
  layersByArticle: Record<string, string[]>;
}

const LEVEL_META: Record<number, { icon: string; color: string }> = {
  1: { icon: '🌱', color: '#10B981' },
  2: { icon: '🏛️', color: '#D4AF37' },
  3: { icon: '🌀', color: '#8B5CF6' },
  4: { icon: '🌌', color: '#0EA5E9' },
};

export function LearningPath({ levels, articles, completedArticles, layersByArticle }: LearningPathProps) {
  const [expanded, setExpanded] = useState<number>(1);
  const scrollRef = useRef<HTMLDivElement>(null);

  const articlesByLevel = (nivel: number) =>
    articles.filter(a => a.nivel === nivel).sort((a, b) => a.orden - b.orden);

  const completedCount = articles.filter(a => completedArticles.has(a.slug)).length;
  const totalLayers = articles.reduce((s, a) => s + (layersByArticle[a.slug]?.length || 0), 0);
  const totalPossibleLayers = articles.length * 3;

  const toggleLevel = (nivel: number) => {
    setExpanded(expanded === nivel ? -1 : nivel);
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-brand-gold mb-6 block">
            El Camino del Sabio
          </span>
          <h2 className="font-serif text-5xl md:text-7xl tracking-tighter leading-none text-brand-offwhite">
            Tu Ruta hacia la <span className="italic text-brand-gold">Maestría</span>.
          </h2>
        </div>
        <div className="flex items-center gap-4 text-[9px] font-mono text-brand-offwhite/50">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-brand-gold" />
            Completado
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full border-2 border-brand-gold" />
            No iniciado
          </div>
        </div>
      </div>

      {/* Metro map */}
      <div ref={scrollRef} className="overflow-x-auto pb-6 no-scrollbar">
        <div className="min-w-[900px] space-y-4">
          {levels.map(level => {
            const levelArticles = articlesByLevel(level.nivel);
            const meta = LEVEL_META[level.nivel] || LEVEL_META[1];
            const isExpanded = expanded === level.nivel;
            const levelCompleted = levelArticles.filter(a => completedArticles.has(a.slug)).length;

            return (
              <div key={level.nivel} className="relative">
                {/* Level header row */}
                <button
                  onClick={() => toggleLevel(level.nivel)}
                  className="w-full flex items-center gap-4 text-left group py-2"
                >
                  <span className="text-2xl">{meta.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="font-serif text-xl md:text-2xl text-brand-offwhite group-hover:text-brand-gold transition-colors">
                        {level.titulo}
                      </span>
                      <span className="text-[9px] font-mono text-brand-offwhite/40">
                        {levelCompleted}/{levelArticles.length} completados
                      </span>
                    </div>
                    <p className="text-[11px] text-brand-offwhite/40 font-light">{level.descripcion}</p>
                  </div>
                  {isExpanded ? <ChevronUp size={18} className="text-brand-gold" /> : <ChevronDown size={18} className="text-brand-offwhite/40" />}
                </button>

                {/* Metro line */}
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                    className="relative ml-8 md:ml-12 py-6"
                  >
                    <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full opacity-30"
                      style={{ background: meta.color }} />

                    <div className="relative flex justify-between">
                      {levelArticles.map((article) => {
                        const isCompleted = completedArticles.has(article.slug);
                        const layers = layersByArticle[article.slug] || [];
                        const layerCount = layers.length;

                        return (
                          <div key={article.slug} className="flex-1 flex justify-center relative">
                            <Link
                              href={`/guias/ciencias_naturales/fisica/${article.slug}`}
                              className="group flex flex-col items-center"
                            >
                              <div
                                className={cn(
                                  "relative w-10 h-10 md:w-12 md:h-12 rounded-full border-2 flex items-center justify-center transition-all duration-500 z-10",
                                  isCompleted
                                    ? "border-brand-gold bg-brand-gold/20 shadow-[0_0_25px_rgba(212,175,55,0.4)]"
                                    : "border-brand-offwhite/20 bg-brand-ink hover:border-brand-gold hover:shadow-[0_0_20px_rgba(212,175,55,0.2)]"
                                )}
                              >
                                {isCompleted ? (
                                  <Sparkles size={18} className="text-brand-gold" />
                                ) : (
                                  <span className={cn(
                                    "w-2.5 h-2.5 rounded-full transition-colors",
                                    layerCount > 0 ? "bg-brand-gold/60" : "bg-brand-offwhite/20"
                                  )} />
                                )}
                                {layerCount > 0 && layerCount < 3 && (
                                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-brand-gold text-brand-ink flex items-center justify-center text-[8px] font-mono font-bold">
                                    {layerCount}
                                  </div>
                                )}
                              </div>

                              <div className="mt-3 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none absolute top-full pt-1 z-20 w-40">
                                <div className="bg-brand-ink border border-brand-gold/30 rounded-lg p-3 text-center shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
                                  <div className="text-[9px] font-mono uppercase tracking-widest text-brand-gold mb-1">
                                    {article.insignia}
                                  </div>
                                  <div className="text-[10px] font-bold text-brand-offwhite leading-tight">
                                    {article.title}
                                  </div>
                                </div>
                              </div>

                              <div className="mt-3 text-center">
                                <span className="text-[9px] font-mono text-brand-offwhite/50 group-hover:text-brand-gold transition-colors line-clamp-1 max-w-[80px]">
                                  {article.title.split(':')[0].split(' ').slice(0, 3).join(' ')}
                                </span>
                              </div>
                            </Link>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom progress summary */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-brand-gold/10 pt-10">
        <div className="p-6 bg-black/5 dark:bg-white/[0.02] border border-brand-gold/15 rounded-2xl">
          <div className="text-[9px] font-mono uppercase tracking-widest text-brand-gold/60 mb-2">Artículos Completados</div>
          <div className="font-serif text-4xl text-brand-offwhite mb-3">{completedCount}<span className="text-lg text-brand-offwhite/30">/{articles.length}</span></div>
          <div className="h-1 bg-brand-gold/10 overflow-hidden rounded-full">
            <div className="h-full bg-brand-gold/50" style={{ width: `${(completedCount / Math.max(articles.length, 1)) * 100}%` }} />
          </div>
        </div>
        <div className="p-6 bg-black/5 dark:bg-white/[0.02] border border-brand-gold/15 rounded-2xl">
          <div className="text-[9px] font-mono uppercase tracking-widest text-brand-gold/60 mb-2">Capas Asimiladas</div>
          <div className="font-serif text-4xl text-brand-offwhite mb-3">{totalLayers}<span className="text-lg text-brand-offwhite/30">/{totalPossibleLayers}</span></div>
          <div className="h-1 bg-brand-gold/10 overflow-hidden rounded-full">
            <div className="h-full bg-brand-gold/50" style={{ width: `${(totalLayers / Math.max(totalPossibleLayers, 1)) * 100}%` }} />
          </div>
        </div>
        <div className="p-6 bg-black/5 dark:bg-white/[0.02] border border-brand-gold/15 rounded-2xl">
          <div className="text-[9px] font-mono uppercase tracking-widest text-brand-gold/60 mb-2">Dominio del Canon</div>
          <div className="font-serif text-4xl text-brand-offwhite mb-3">{Math.round((completedCount / Math.max(articles.length, 1)) * 100)}<span className="text-lg text-brand-offwhite/30">%</span></div>
          <div className="flex items-center gap-2 mt-1 text-[10px] text-brand-offwhite/40">
            <Target size={12} /> Sigue avanzando para dominar el conocimiento
          </div>
        </div>
      </div>
    </div>
  );
}
