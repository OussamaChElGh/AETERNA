'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, Clock, Lock, Sparkles } from 'lucide-react';
import { NexusNode3D } from '@/components/NexusNode3D';
import { Starfield } from '@/components/Starfield';
import { CATEGORIES_DATA } from '@/data/categories';
import { ROADMAPS, populateRoadmaps } from '@/data/roadmaps';
import type { ArticleFrontmatter } from '@/types';
import { cn } from '@/lib/utils';

interface BranchPageClientProps {
  overrideCategory?: string;
  initialArticles?: ArticleFrontmatter[];
}

const LIVE_CATEGORIES = new Set(['ciencias_naturales']);

export function BranchPageClient({ overrideCategory, initialArticles = [] }: BranchPageClientProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const categoryId = (overrideCategory || 'guias').replace(/-/g, '_');
  const category = CATEGORIES_DATA.find(c => c.id === categoryId);

  if (!category) {
    return (
      <div className="min-h-screen bg-brand-ink flex items-center justify-center">
        <div className="text-brand-gold font-serif text-3xl">Dimensión no encontrada</div>
      </div>
    );
  }

  const isLive = LIVE_CATEGORIES.has(category.id);
  const roadmaps = populateRoadmaps(initialArticles);
  const liveSubs = new Set(
    initialArticles
      .filter(a => (a.category || '').replace(/-/g, '_') === category.id)
      .map(a => a.subcategory)
      .filter(Boolean)
  );

  const articleCount = initialArticles.filter(a => (a.category || '').replace(/-/g, '_') === category.id).length;

  return (
    <div className="min-h-screen bg-brand-ink relative selection:bg-brand-gold selection:text-brand-ink overflow-x-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-brand-ink/40" />
        <div className="absolute inset-0 bg-engraving opacity-[0.03]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(212,175,55,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(212,175,55,0.02)_1px,transparent_1px)] bg-[size:100px_100px]" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-brand-ink to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-brand-ink via-brand-ink/80 to-transparent" />
      </div>

      {/* Header */}
      <section className="relative pt-40 pb-28 px-8 overflow-hidden">
        <Starfield className="absolute inset-0 w-full h-full pointer-events-none opacity-60" />
        <div className="max-w-6xl mx-auto relative z-10 text-center">
            <Link href="/"
            className="inline-flex items-center gap-4 text-brand-offwhite/40 text-[9px] uppercase tracking-[0.4em] font-bold mb-16 hover:text-brand-gold transition-all group"
          >
            <ArrowLeft className="h-3 w-3 group-hover:-translate-x-2 transition-transform" />
            Volver al Nexo
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className={cn(
              "text-[10px] font-sans font-bold uppercase tracking-[0.6em] mb-10 block",
              isLive ? "text-brand-gold" : "text-brand-offwhite/30"
            )}>
              {isLive ? "Portal Abierto · Contenido Disponible" : "Dimensión del Conocimiento"}
            </span>

            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, duration: 0.8, type: "spring", stiffness: 100 }}
              className={cn(
                "relative w-40 h-40 md:w-52 md:h-52 mx-auto mb-12 rounded-full flex items-center justify-center p-3",
                isLive
                  ? "border-2 border-brand-gold shadow-[0_0_60px_rgba(212,175,55,0.3)] bg-brand-ink/80"
                  : "border-2 border-brand-offwhite/10 shadow-none bg-brand-ink/50"
              )}
            >
              <div className={cn(
                "absolute inset-0 rounded-full",
                isLive ? "bg-brand-gold opacity-10 blur-[40px] animate-pulse" : "bg-brand-offwhite opacity-5 blur-[40px]"
              )} />
              <div className="w-full h-full relative z-10">
                <NexusNode3D id={category.id} active={isLive} />
              </div>
              {!isLive && (
                <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-brand-ink border border-brand-offwhite/10 flex items-center justify-center z-20">
                  <Lock size={14} className="text-brand-offwhite/40" />
                </div>
              )}
            </motion.div>

            <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl text-brand-offwhite leading-[0.9] mb-8 tracking-tighter">
              {category.name.split(' ')[0]}{' '}
              <span className="italic text-brand-gold">{category.name.split(' ').slice(1).join(' ') || 'Nexo'}</span>
            </h1>

            <p className="text-lg md:text-xl text-brand-offwhite/40 leading-relaxed font-sans font-light max-w-3xl mx-auto italic mb-12">
              {category.description}
            </p>

            {isLive ? (
              <div className="inline-flex items-center gap-3 border border-brand-gold/40 px-6 py-3 bg-brand-ink/60">
                <Sparkles size={14} className="text-brand-gold" />
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand-gold">
                  {articleCount} guías disponibles · {liveSubs.size} ramas activas
                </span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-3 border border-brand-offwhite/10 px-6 py-3 bg-brand-ink/40">
                <Clock size={14} className="text-brand-offwhite/40" />
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand-offwhite/40">
                  Esta dimensión está siendo cartografiada
                </span>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Fascículos / Subcategorías */}
      <section className="relative py-24 px-8">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col items-center text-center mb-16">
            <span className="text-brand-gold text-[9px] font-sans font-bold uppercase tracking-[0.5em] mb-6 block">
              Ramas de Estudio
            </span>
            <h2 className="font-serif text-5xl text-brand-offwhite mb-8 leading-tight">
              Fascículos de {category.name.split(' ')[0]}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-brand-gold/10 border border-brand-gold/10">
            {category.subcategories.map((sub, i) => {
              const subLive = liveSubs.has(sub.id) || (roadmaps[sub.id]?.steps?.length ?? 0) > 0;
              const subCount = roadmaps[sub.id]?.steps?.length ?? 0;
              const cardContent = (
                <>
                  {subLive && (
                    <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(212,175,55,0.12),transparent_60%)]" />
                    </div>
                  )}

                  <div className="flex items-center justify-between w-full">
                    <span className={cn(
                      "text-[11px] font-sans font-bold uppercase tracking-widest",
                      subLive ? "text-brand-gold" : "text-brand-offwhite/25"
                    )}>
                      Fascículo {String(i + 1).padStart(2, '0')}
                    </span>
                    {subLive ? (
                      <span className="text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 border border-brand-gold/30 text-brand-gold">
                        {subCount} guías
                      </span>
                    ) : (
                      <Lock size={14} className="text-brand-offwhite/20" />
                    )}
                  </div>

                  <div className="flex flex-col items-start text-left">
                    <div className={cn(
                      "text-5xl mb-6 transition-all",
                      subLive ? "text-brand-gold group-hover:scale-110 transition-transform duration-500" : "text-brand-offwhite/20 saturate-0"
                    )}>
                      <sub.icon size={48} strokeWidth={1.5} />
                    </div>
                    <h3 className={cn(
                      "font-serif text-4xl transition-all duration-300",
                      subLive
                        ? "text-brand-offwhite group-hover:text-brand-gold group-hover:italic"
                        : "text-brand-offwhite/30"
                    )}>
                      {sub.name}
                    </h3>
                  </div>

                  <div className={cn(
                    "flex items-center gap-4 text-[9px] font-bold uppercase tracking-[0.3em] transition-all",
                    subLive ? "text-brand-gold" : "text-brand-offwhite/20"
                  )}>
                    {subLive ? (
                      <>
                        <span>Acceder a la Ruta</span>
                        <ArrowRight className="h-3 w-3 group-hover:translate-x-2 transition-transform" />
                      </>
                    ) : (
                      <span>Próximamente</span>
                    )}
                  </div>
                </>
              );

              return subLive ? (
                <Link
                  key={sub.id}
                  href={`/guias/${category.id}/${sub.id}`}
                  className="group relative p-12 h-[340px] flex flex-col justify-between items-start transition-all bg-brand-ink/80 hover:bg-brand-ink border border-transparent hover:border-brand-gold/40"
                >
                  {cardContent}
                </Link>
              ) : (
                <div
                  key={sub.id}
                  className="group relative p-12 h-[340px] flex flex-col justify-between items-start transition-all bg-brand-ink/40 cursor-default"
                >
                  {cardContent}
                </div>
              );
            })}
          </div>

          {/* CTA volver al Nexo */}
          <div className="flex justify-center mt-24">
          <Link href="/"
              className="px-10 py-4 border border-brand-gold/30 text-brand-gold text-[11px] font-bold uppercase tracking-[0.4em] hover:bg-brand-gold hover:text-brand-ink transition-all"
            >
              Volver al Nexo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
