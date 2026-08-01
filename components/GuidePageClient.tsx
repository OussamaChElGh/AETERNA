'use client';
import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ArrowRight, CheckCircle2, PlayCircle, BookOpen, Gamepad2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGamification } from "../context/GamificationContext";
import { KanaTool } from "@/components/interactive/KanaTool";
import { KanaGameV2 } from "@/components/interactive/KanaGameV2";
import { NexusNode3D } from "@/components/NexusNode3D";
import { Starfield } from "@/components/Starfield";
import { CATEGORIES_DATA } from "@/data/categories";
import { ROADMAPS, populateRoadmaps, Step } from "@/data/roadmaps";
import type { ArticleFrontmatter } from "@/types";
import { useMemo } from "react";

function GuidePageContent({ overrideSubcategory, overrideCategory, initialArticles = [] }: { overrideSubcategory?: string; overrideCategory?: string; initialArticles?: ArticleFrontmatter[] }) {
  const roadmaps = useMemo(() => populateRoadmaps(initialArticles), [initialArticles]);
  const params = useParams<{ category: string; subcategory?: string }>();
  const category = overrideCategory || params.category || "filosofia";
  const subcategory = overrideSubcategory || params.subcategory;
  const [selectedSub, setSelectedSub] = useState<string | null>(null);
  const [subcategoryFilter, setSubcategoryFilter] = useState<string>("Todas");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isKanaGameOpen, setIsKanaGameOpen] = useState(false);
  const { completePath, progress } = useGamification();

  useEffect(() => {
    setSelectedSub(null);
    setSubcategoryFilter("Todas");
    setIsFilterOpen(false);
  }, [category]);
  
  
  const normalizedCategory = category.replace(/-/g, "_");
  const normalizedSubcategory = subcategory?.replace(/-/g, "_");
  
  const FANS_MAP: Record<string, any[]> = {
    guias: CATEGORIES_DATA.map(c => ({ id: c.id, name: c.name, icon: "📚", subcategory: "General", pathPrefix: "/guias/" }))
  };

  CATEGORIES_DATA.forEach(cat => {
    FANS_MAP[cat.id] = cat.subcategories.map(sub => ({
      id: sub.id,
      name: sub.name,
      icon: "📚", 
      subcategory: cat.name
    }));
  });

  const hasFan = !!FANS_MAP[normalizedCategory];
  // If subcategory is provided in URL, prioritize it. Otherwise use selection state.
  const activeKey = normalizedSubcategory || (hasFan ? (selectedSub || normalizedCategory) : normalizedCategory);
  const roadmap = roadmaps[activeKey] || roadmaps.guias;

  // Show selection only if there are fans (subcategories) and no subcategory is currently active (via URL or selection)
  const showsSelection = hasFan && !selectedSub && !subcategory;
  let selectionItems = FANS_MAP[normalizedCategory] || [];
const availableSubcategories = ["Todas", ...Array.from(new Set(selectionItems.filter(item => item.subcategory).map(item => item.subcategory)))];
  
  if (subcategoryFilter !== "Todas") {
    selectionItems = selectionItems.filter(item => item.subcategory === subcategoryFilter);
  }

  const hydratedSteps = roadmap.steps.map((step, i) => {
    const isCompleted = progress.completedPaths.includes(`${activeKey}.${step.id}`);
    
    let isCurrent = false;
    if (i === 0) {
      isCurrent = !isCompleted;
    } else {
      const prevStepId = roadmap.steps[i - 1].id;
      isCurrent = !isCompleted && progress.completedPaths.includes(`${activeKey}.${prevStepId}`);
    }

    const status = isCompleted ? "completed" : isCurrent ? "current" : "available";

    return {
      ...step,
      status
    };
  });

  const groupedSteps = hydratedSteps.reduce((acc, step) => {
    const levelNum = step.level?.num || 0;
    if (!acc[levelNum]) {
      acc[levelNum] = {
        level: step.level,
        steps: []
      };
    }
    acc[levelNum].steps.push(step);
    return acc;
  }, {} as Record<number, { level?: typeof hydratedSteps[0]['level'], steps: typeof hydratedSteps }>);
  
  const levels = Object.values(groupedSteps).sort((a, b) => (a.level?.num || 0) - (b.level?.num || 0));

  const renderSteps = () => (
    <div className="flex flex-col gap-32 pt-32">
      {!showsSelection && hydratedSteps.length === 0 && (
        <div className="mx-auto max-w-4xl w-full text-center py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center gap-6"
          >
            <div className="w-24 h-24 rounded-full bg-brand-gold/10 border-2 border-dashed border-brand-gold/40 flex items-center justify-center text-brand-gold mb-4">
              <Clock size={36} />
            </div>
            <span className="text-brand-gold text-[10px] font-sans font-bold uppercase tracking-[0.5em] mb-2">
              Dimensión en construcción
            </span>
            <h2 className="font-serif text-4xl md:text-6xl text-brand-offwhite leading-tight">
              {roadmap.title} está siendo cartografiada
            </h2>
            <p className="text-lg text-brand-offwhite/40 font-sans font-light max-w-xl mx-auto">
              El contenido de esta dimensión del conocimiento se está construyendo.
              Nuestro equipo está trabajando para traerte la mejor ruta de estudio.
            </p>
            <Link href="/home2"
              className="mt-6 px-8 py-4 bg-brand-gold text-brand-ink text-[11px] font-sans font-bold uppercase tracking-[0.4em] hover:bg-brand-offwhite transition-all shadow-[0_0_30px_rgba(212,175,55,0.3)]"
            >
              Volver al Nexo
            </Link>
          </motion.div>
        </div>
      )}
      <div className="mx-auto max-w-4xl w-full">
        {!showsSelection && roadmap.content && (
          <div className="flex justify-center mb-24">
            <button 
              onClick={() => document.getElementById('ensayo-maestro')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-10 py-5 bg-brand-gold text-brand-ink text-[11px] font-sans font-bold uppercase tracking-[0.4em] hover:bg-brand-offwhite transition-all shadow-[0_0_30px_rgba(212,175,55,0.2)] flex items-center gap-3"
            >
              <BookOpen className="w-4 h-4" /> Leer Tesis Maestra
            </button>
          </div>
        )}
        
        <div className="flex flex-col gap-24">
          {levels.map((group, groupIndex) => (
            <div key={group.level?.num || groupIndex} className="relative">
              {group.level && (
                <div className="sticky top-24 z-20 bg-brand-ink/90 backdrop-blur-md py-6 mb-12 border-b border-white/5 relative">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                      <div className="text-[10px] md:text-xs font-sans font-bold uppercase tracking-[0.4em] text-brand-gold whitespace-nowrap hidden sm:block">
                        Nivel {group.level.num}
                      </div>
                      <div className="h-px w-8 bg-brand-gold hidden sm:block"></div>
                      <h2 className="font-serif text-2xl md:text-3xl text-brand-offwhite">
                        {group.level.title}
                      </h2>
                    </div>
                    
                    <div className="flex items-center gap-3">
                       <span className="text-[10px] font-sans text-brand-offwhite/40 uppercase tracking-[0.2em] hidden sm:block">Insignia:</span>
                       <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-brand-offwhite px-4 py-2 bg-[#1E1E22] border border-white/5 shadow-sm">
                        {group.level.badge}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex flex-col gap-12">
                {group.steps.map((step, i) => (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="group"
                  >
                    <div className="flex flex-col md:flex-row gap-12 items-stretch">
                      <div className={cn("md:w-32 flex flex-col items-center", step.type === "practice" ? "pt-0" : "pt-8")}>
                        {step.type === "practice" ? (
                          <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center relative">
                            {/* Small dot instead of big icon for practice */}
                            <div className={cn(
                              "w-3 h-3 rounded-full z-10 outline outline-4 outline-[#09090B]",
                              step.status === "completed" ? "bg-brand-gold" : 
                              step.status === "current" ? "bg-brand-gold animate-pulse" : "bg-white/10"
                            )}></div>
                          </div>
                        ) : (
                          <div className={cn(
                            "w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full transition-all duration-700 z-10 box-content outline outline-8 outline-[#09090B]",
                            step.status === "completed" ? "bg-brand-gold text-white shadow-[0_0_20px_rgba(212,175,55,0.4)]" :
                            step.status === "current" ? "bg-brand-gold text-brand-ink shadow-[0_0_20px_rgba(212,175,55,0.3)] animate-pulse" :
                            "bg-[#1E1E22] border-2 border-white/10 text-brand-offwhite/40"
                          )}>
                            {step.status === "completed" ? <CheckCircle2 className="h-5 w-5 md:h-6 md:w-6" /> :
                             step.status === "current" ? <PlayCircle className="h-5 w-5 md:h-6 md:w-6" /> :
                             <BookOpen className="h-4 w-4 md:h-5 md:w-5 opacity-50" />}
                          </div>
                        )}
                        <div className={cn("w-px h-full mt-4 group-last:hidden", group.level && step.type !== "practice" ? "md:pb-6" : "", step.status === "completed" ? "bg-brand-gold" : "bg-white/10")}></div>
                      </div>

                      <div className={cn(
                        "flex-1 p-8 md:p-10 border transition-all duration-500 hover:-translate-y-1 relative group/card",
                        step.type === "practice" ? "bg-slate-900 border-slate-800 ml-0 md:ml-12 mt-4 md:mt-0 shadow-2xl" : "bg-[#121214] border-white/5 hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)]",
                        step.status === "available" && "border-white/5 opacity-90",
                        step.status === "current" && (step.type === "practice" ? "border-brand-gold/50 shadow-[0_10px_40px_rgba(212,175,55,0.15)]" : "border-brand-gold/50 shadow-[0_10px_40px_rgba(212,175,55,0.1)]"),
                        step.status === "completed" && "border-brand-gold/30"
                      )}>
                        {step.type === "practice" && (
                          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none"></div>
                        )}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 relative z-10">
                          <div className="flex items-center gap-4 text-[9px] font-bold uppercase tracking-[0.3em]">
                            <span className="text-brand-gold">{step.type}</span>
                            <div className={cn("w-1 h-1 rounded-full", step.type === "practice" ? "bg-slate-700" : "bg-white/10")}></div>
                            <span className={step.type === "practice" ? "text-slate-400 font-mono tracking-widest text-[8px]" : "text-brand-offwhite/40"}>{step.duration} de estudio</span>
                          </div>
                          {step.status === "completed" && (
                            <span className={cn("text-[9px] font-bold uppercase tracking-[0.2em] px-2.5 py-1", step.type === "practice" ? "text-brand-gold bg-brand-gold/10 border border-brand-gold/20" : "text-brand-gold bg-brand-gold/10 border border-brand-gold/20")}>Integrado</span>
                          )}
                        </div>
                        
                        <h3 className={cn("font-serif text-3xl md:text-4xl mb-6 relative z-10", step.type === "practice" ? "text-slate-100" : "text-brand-offwhite")}>
                          {step.title}
                        </h3>
                        <p className={cn("font-sans text-base leading-relaxed mb-10 max-w-2xl relative z-10", step.type === "practice" ? "text-slate-400 font-mono text-sm" : "text-brand-offwhite/40")}>
                          {step.description}
                        </p>
                        
                        {(step.status === "current" || step.status === "completed" || step.status === "available") && (
                          <div className={cn("flex flex-wrap gap-6 pt-8 border-t relative z-10", step.type === "practice" ? "border-slate-800" : "border-white/5")}>
                            {step.path ? (
                              <Link href={step.path} className={cn("px-8 py-4 text-[10px] font-sans font-bold uppercase tracking-[0.4em] transition-all", step.type === "practice" ? "bg-brand-gold text-slate-900 hover:bg-brand-offwhite" : "bg-brand-gold text-brand-ink hover:bg-brand-offwhite")}>
                                {step.status === "completed" ? "Repasar" : "Iniciar"}
                              </Link>
                            ) : (
                              <button className={cn("px-8 py-4 text-[10px] font-sans font-bold uppercase tracking-[0.4em] cursor-default", step.type === "practice" ? "bg-slate-800 text-slate-500" : "bg-white/5 text-brand-offwhite/30")}>
                                Próximamente
                              </button>
                            )}
                            {(step.status === "current" || step.status === "available") && (
                              <button 
                                onClick={() => completePath(`${activeKey}.${step.id}`)}
                                className={cn("px-8 py-4 border text-[10px] font-bold uppercase tracking-[0.4em] transition-all", step.type === "practice" ? "border-brand-gold/30 text-brand-gold hover:bg-brand-gold hover:text-slate-900" : "border-white/10 text-brand-offwhite/40 hover:text-brand-gold hover:border-brand-gold")}
                              >
                                Marcar como Completada
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#09090B] text-brand-offwhite">
      {/* Header Panel */}
      <section className="bg-brand-ink text-brand-offwhite pt-40 pb-32 relative overflow-hidden">
        <Starfield className="absolute inset-0 w-full h-full pointer-events-none opacity-50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.06)_0%,transparent_70%)]" />
        <div className="absolute inset-0 opacity-5 grayscale">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--color-brand-gold)_1px,_transparent_1px)] bg-[size:60px_60px]"></div>
        </div>
        
        <div className="mx-auto max-w-7xl px-8 relative z-10 text-center">
          <Link href="/home2" 
            className="inline-flex items-center gap-4 text-brand-offwhite/40 text-[9px] uppercase tracking-[0.4em] font-bold mb-16 hover:text-brand-gold transition-all group"
          >
            <ArrowLeft className="h-3 w-3 group-hover:-translate-x-2 transition-transform" />
            Volver al Nexo
          </Link>
          
          <div className="max-w-5xl mx-auto">
            <motion.div
              key={activeKey}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {!showsSelection && (
                <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, duration: 0.8, type: "spring", stiffness: 100 }}
                  className="relative w-40 h-40 md:w-52 md:h-52 mx-auto mb-12 rounded-full border-2 border-brand-gold shadow-[0_0_60px_rgba(212,175,55,0.3)] bg-brand-ink/80 p-3"
                >
                  <div className="absolute inset-0 rounded-full bg-brand-gold opacity-10 blur-[40px] animate-pulse" />
                  <div className="w-full h-full relative z-10">
                    <NexusNode3D id={normalizedCategory} active />
                  </div>
                </motion.div>
              )}

              <span className="text-brand-gold text-[10px] font-sans font-bold uppercase tracking-[0.6em] mb-8 block">
                {showsSelection ? "Trayectoria Crítica / " + category : `Rama / ${roadmap.subtitle || category}`}
              </span>
              
              <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl text-brand-offwhite leading-[0.9] mb-12 tracking-tighter">
                {showsSelection ? (
                  normalizedCategory === "guias" ? "Canon de Aprendizaje" : `Gnosis: ${CATEGORIES_DATA.find(c => c.id === normalizedCategory)?.name || category}`
                ) : roadmap.title}
              </h1>
              
              <p className="text-xl md:text-2xl text-brand-offwhite/40 leading-relaxed font-sans font-light max-w-3xl mx-auto italic mb-12">
                {showsSelection ? "Inicie su exégesis seleccionando una dimensión del conocimiento estructurado." : roadmap.description}
              </p>

              {!showsSelection && roadmap.content && (
                <button 
                  onClick={() => document.getElementById('ensayo-maestro')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-10 py-5 bg-brand-gold text-brand-ink text-[11px] font-sans font-bold uppercase tracking-[0.4em] hover:bg-brand-offwhite transition-all shadow-[0_0_30px_rgba(212,175,55,0.4)]"
                >
                  Estudiar Tesis Maestra
                </button>
              )}
            </motion.div>

            {selectedSub && (
              <button 
                onClick={() => setSelectedSub(null)}
                className="mt-16 text-brand-gold text-[9px] uppercase font-bold tracking-[0.4em] flex items-center gap-3 mx-auto hover:opacity-70 transition-opacity"
              >
                <ArrowLeft className="h-3 w-3" /> Reiniciar Selección
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Master Article Section */}
      {roadmap.content && (
        <section id="ensayo-maestro" className="bg-[#121214] border-b border-white/5 py-40 px-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col items-center mb-24 text-center">
              <span className="text-[10px] font-sans font-bold uppercase tracking-[0.6em] text-brand-gold mb-4">La Tesis Maestra</span>
              <div className="w-12 h-px bg-brand-gold/20"></div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <p className="font-serif text-[1.75rem] md:text-[2.25rem] text-brand-offwhite leading-[1.4] text-center italic font-normal">
                "{roadmap.content}"
              </p>
            </motion.div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-8 pb-48">
        {showsSelection ? (
          <div className="flex flex-col gap-32">
            
            {/* If there are steps for this specific root category exist, render them at the top */}
            {levels.some(g => g.steps.length > 0) && (
              <div className="mb-16">
                <div className="flex flex-col items-center text-center mt-12 mb-16">
                  <span className="text-brand-gold text-[9px] font-sans font-bold uppercase tracking-[0.5em] mb-6 block">Guía Global de {roadmap.title}</span>
                </div>
                {renderSteps()}
              </div>
            )}

            <div className="flex flex-col items-center text-center mt-16">
              <span className="text-brand-gold text-[9px] font-sans font-bold uppercase tracking-[0.5em] mb-6 block">Ramas de Estudio</span>
              <h2 className="font-serif text-5xl text-brand-offwhite mb-8 leading-tight">La Estructura del Saber</h2>
              <p className="text-brand-offwhite/40 max-w-2xl mb-16 leading-relaxed font-sans text-lg">
                "Ninguna disciplina es una isla; el conocimiento es una red de intersecciones profundas."
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10 border border-white/10">
              {selectionItems.map((item, i) => (
                <Link key={item.id}
                  href={`/guias/${category}/${item.id}`}
                  className="group relative bg-[#121214] p-12 h-[360px] flex flex-col justify-between items-start transition-all hover:bg-[#1E1E22] hover:border-brand-gold/30"
                >
                  <span className="text-[11px] font-sans font-bold text-brand-gold uppercase tracking-widest group-hover:text-brand-offwhite/50">
                    Fascículo {String(i + 1).padStart(2, '0')}
                  </span>
                  
                  <div className="flex flex-col items-start text-left">
                    <div className="text-4xl mb-6 grayscale group-hover:grayscale-0 transition-all">{item.icon}</div>
                    <h3 className="font-serif text-4xl text-brand-offwhite group-hover:text-brand-gold group-hover:italic transition-all duration-300">
                      {item.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-4 text-[9px] font-bold uppercase tracking-[0.3em] text-brand-offwhite/40 group-hover:text-brand-gold transition-all">
                    <span>Acceder a la Ruta</span>
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-2 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          renderSteps()
        )}
      </section>

      {activeKey === "japones" && !showsSelection && (
          <div className="mt-16 space-y-16">
            <div className="bg-[#121214] border sm:border-x-0 border-white/5 py-24 px-8 md:px-0">
              <div className="max-w-7xl mx-auto text-center px-8">
                <div className="mb-16">
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand-gold mb-4 block">Cartografía del Lenguaje</span>
                  <h3 className="font-serif text-4xl mb-6 text-brand-offwhite">Herramienta Interactiva: <span className="italic text-brand-gold">KanaTool</span></h3>
                  <p className="text-brand-offwhite/40 max-w-xl mx-auto font-sans font-light leading-relaxed">Domina el sistema de escritura japonés. Alterna entre Romaji, Hiragana y Katakana de forma dinámica para una transición fluida al canon oriental.</p>
                </div>
                <KanaTool />
              </div>
            </div>

            <div className="bg-brand-ink p-16 lg:p-32 text-center relative overflow-hidden group shadow-2xl mx-4 md:mx-0 border border-white/5">
              <div className="absolute inset-0 bg-brand-gold/5 pointer-events-none" />
              <div className="absolute -top-32 -right-32 w-64 h-64 bg-brand-gold/10 rounded-none transform rotate-12 blur-[100px] pointer-events-none" />
              <Gamepad2 className="w-16 h-16 text-brand-gold mx-auto mb-8 relative z-10" />
              <h3 className="font-serif text-5xl text-brand-offwhite mb-8 relative z-10 leading-none">Desafío del <span className="italic text-brand-gold">Kana</span></h3>
              <p className="text-brand-offwhite/50 mb-12 max-w-lg mx-auto relative z-10 text-lg leading-relaxed font-sans font-light">Ponte a prueba en este juego interactivo. Supera los distintos niveles, responda correctamente y sume XP para convertirse en maestro de la lectura rápida en japonés.</p>
              <button 
                onClick={() => setIsKanaGameOpen(true)}
                className="px-12 py-5 bg-brand-gold text-brand-ink font-bold tracking-[0.4em] uppercase text-[11px] hover:bg-brand-offwhite transition-all relative z-10 group-hover:scale-105 active:scale-95"
              >
                Comenzar Juego
              </button>
            </div>
          </div>
        )}


      {/* KanaGameV2 Modal */}
      <AnimatePresence>
        {isKanaGameOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-brand-ink flex flex-col overflow-y-auto"
          >
            <div className="sticky top-0 right-0 p-6 flex justify-end z-[210]">
              <button 
                onClick={() => setIsKanaGameOpen(false)}
                className="text-brand-offwhite/50 hover:text-white transition-colors p-2 bg-black/20 rounded-full backdrop-blur-md"
              >
                <ArrowLeft className="w-8 h-8" />
              </button>
            </div>
            <div className="flex-1 w-full flex flex-col justify-center max-w-6xl mx-auto px-4 pb-8">
              <KanaGameV2 />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function GuidePageClient(props: any) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-brand-ink flex items-center justify-center text-brand-gold font-mono text-xs">Cargando guía...</div>}>
      <GuidePageContent {...props} />
    </Suspense>
  );
}
