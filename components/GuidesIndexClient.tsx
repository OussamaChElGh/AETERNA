'use client';
import { useState, useMemo, useRef } from "react";
import Link from 'next/link';
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, ArrowRight, Star, BookOpen, Sparkles, X,
  CheckCircle2, Hexagon, Component, Zap, Hash, Target,
  Cpu, Brain, Atom, Languages
} from "lucide-react";
import { CATEGORIES_DATA } from "@/data/categories";
import { ROADMAPS, populateRoadmaps } from "@/data/roadmaps";
import { useGamification } from "@/context/GamificationContext";
import { cn } from "@/lib/utils";
import type { ArticleFrontmatter } from "@/types";

const GUIDES_METADATA: Record<string, { difficulty: string; xp: number; image: string; type: "Standard" | "Elite" | "Forbidden" }> = {
  "filosofia": { difficulty: "Nivel III: Erudito", xp: 1200, image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=800", type: "Elite" },
  "matematicas": { difficulty: "Nivel II: Discípulo", xp: 850, image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=800", type: "Standard" },
  "historia": { difficulty: "Nivel I: Iniciado", xp: 500, image: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&q=80&w=800", type: "Standard" },
  "japones": { difficulty: "Nivel II: Discípulo", xp: 950, image: "https://images.unsplash.com/photo-1528114039593-4366cc08227d?auto=format&fit=crop&q=80&w=800", type: "Standard" },
  "fisica": { difficulty: "Nivel III: Erudito", xp: 1500, image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800", type: "Elite" },
  "informatica": { difficulty: "Nivel II: Discípulo", xp: 750, image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800", type: "Standard" },
  "literatura": { difficulty: "Nivel I: Iniciado", xp: 450, image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=800", type: "Standard" },
  "artes": { difficulty: "Nivel I: Iniciado", xp: 600, image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80&w=800", type: "Standard" },
};

function NodeLine({ active, x1, y1, x2, y2 }: { active: boolean; x1: number | string; y1: number | string; x2: number | string; y2: number | string }) {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
      <motion.line
        x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={active ? "rgba(212, 175, 55, 0.4)" : "rgba(212, 175, 55, 0.05)"}
        strokeWidth={1}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
      {active && (
        <motion.circle
          r="2"
          fill="#D4AF37"
          animate={{
            cx: [`${x1}%`, `${x2}%`],
            cy: [`${y1}%`, `${y2}%`],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      )}
    </svg>
  );
}

function GuideCard({ id, name, description, steps, url }: { id: string; name: string; description: string; steps: any[]; url: string }) {
  const meta = GUIDES_METADATA[id] || { difficulty: "Iniciado", xp: 300, image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=800", type: "Standard" };
  const [isHovered, setIsHovered] = useState(false);
  const { progress } = useGamification();

  const completedCount = steps.filter(step => 
    progress.completedPaths.includes(`${id}.${step.id}`)
  ).length;

  const totalSteps = steps.length;
  const progressPercentage = totalSteps > 0 ? (completedCount / totalSteps) * 100 : 0;
  const isFinished = totalSteps > 0 && completedCount === totalSteps;

  return (
    <motion.div
      layout
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-brand-ink border border-brand-gold/10 overflow-hidden min-h-[450px] flex flex-col"
    >
      <div className="absolute -top-10 -right-10 opacity-10 group-hover:opacity-20 transition-opacity">
        <Hexagon size={180} className="text-brand-gold rotate-12" />
      </div>

      <div className="h-40 overflow-hidden relative border-b border-brand-gold/10">
        <img src={meta.image} className="w-full h-full object-cover grayscale opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700" alt={name} />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-ink via-transparent to-transparent" />
        
        <div className="absolute top-6 left-6 flex flex-col gap-2">
           <div className="bg-brand-gold/10 backdrop-blur-md text-brand-gold px-3 py-1 text-[8px] font-bold uppercase tracking-widest border border-brand-gold/30">
             {meta.difficulty}
           </div>
        </div>

        <div className="absolute bottom-6 right-6">
           <svg className="w-12 h-12 -rotate-90">
             <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(212,175,55,0.1)" strokeWidth="2" />
             <motion.circle 
               cx="24" cy="24" r="20" fill="none" 
               stroke={isFinished ? "#10b981" : "#D4AF37"} 
               strokeWidth="2"
               strokeDasharray="125.6"
               initial={{ strokeDashoffset: 125.6 }}
               animate={{ strokeDashoffset: 125.6 - (125.6 * progressPercentage) / 100 }}
               transition={{ duration: 1.5 }}
             />
           </svg>
           <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[7px] font-mono text-brand-gold">{Math.round(progressPercentage)}%</span>
           </div>
        </div>
      </div>

      <div className="p-8 flex-1 flex flex-col justify-between relative z-10">
        <div>
          <div className="flex justify-between items-start mb-6">
             <h3 className="font-serif text-2xl text-brand-offwhite group-hover:text-brand-gold transition-colors">{name}</h3>
             <div className="text-right">
                <div className="flex items-center gap-1 text-brand-gold mb-1">
                   <Star size={10} fill="currentColor" />
                   <span className="text-[9px] font-mono font-bold tracking-widest">{meta.xp} XP</span>
                </div>
                {isFinished && <CheckCircle2 size={12} className="text-emerald-500 ml-auto" />}
             </div>
          </div>
          <p className="text-[11px] text-brand-muted leading-relaxed line-clamp-3 mb-6 font-light italic">
            "{description}"
          </p>

          <div className="flex flex-wrap gap-2 mb-8">
             {steps.slice(0, 3).map((s, idx) => {
               const done = progress.completedPaths.includes(`${id}.${s.id}`);
               return (
                 <div key={idx} className={cn(
                   "w-2 h-2 rounded-full border transition-all",
                   done ? "bg-brand-gold border-brand-gold shadow-[0_0_8px_rgba(212,175,55,0.5)]" : "border-brand-gold/30"
                 )} />
               );
             })}
             {steps.length > 3 && <div className="text-[8px] text-brand-gold/40 flex items-center">+ {steps.length - 3}</div>}
          </div>
        </div>

        <Link href={url}
          className="group/link w-full py-4 border border-brand-gold/20 flex items-center justify-between px-6 text-[9px] font-bold uppercase tracking-[0.4em] text-brand-gold hover:bg-brand-gold hover:text-brand-ink transition-all"
        >
          <span>Establecer Conexión</span>
          <ArrowRight size={14} className="transition-transform group-hover/link:translate-x-1" />
        </Link>
      </div>

      <div className="absolute inset-0 pointer-events-none border border-brand-gold/5 group-hover:border-brand-gold/20 transition-all" />
    </motion.div>
  );
}

export function GuidesIndexClient({ initialArticles = [] }: { initialArticles?: ArticleFrontmatter[] }) {
  const roadmaps = useMemo(() => populateRoadmaps(initialArticles), [initialArticles]);
  const [search, setSearch] = useState("");
  const [selection, setSelection] = useState<{
    main: string | null;
    sub: string | null;
  }>({ main: null, sub: null });
  
  const selectedMainData = useMemo(() => 
    CATEGORIES_DATA.find(c => c.id === selection.main), 
  [selection.main]);

  const guides = useMemo(() => {
    let list: any[] = [];
    CATEGORIES_DATA.forEach(cat => {
      list.push({
        id: cat.id,
        name: cat.name,
        description: cat.description,
        category: cat.id,
        subcategory: null,
        steps: roadmaps[cat.id]?.steps || []
      });
      cat.subcategories.forEach(sub => {
        list.push({
            id: sub.id,
            name: sub.name,
            description: roadmaps[sub.id]?.description || `Especialización en ${sub.name}.`,
            category: cat.id,
            subcategory: sub.id,
            steps: roadmaps[sub.id]?.steps || []
        });
      });
    });

    return list.filter(g => {
      const matchesSearch = (g.name.toLowerCase().includes(search.toLowerCase()) || g.description.toLowerCase().includes(search.toLowerCase()));
      const matchesMain = !selection.main || g.category === selection.main;
      const matchesSub = !selection.sub || g.subcategory === selection.sub;
      return matchesSearch && matchesMain && matchesSub;
    });
  }, [search, selection, roadmaps]);

  const resetAll = () => setSelection({ main: null, sub: null });

  return (
    <div className="min-h-screen bg-brand-ink text-brand-offwhite selection:bg-brand-gold selection:text-brand-ink">
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]">
         <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:40px_40px]" />
         <div className="absolute inset-0 bg-engraving opacity-20" />
      </div>

      <section className="relative pt-48 pb-32 overflow-hidden border-b border-brand-gold/10">
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="text-center mb-24">
             <motion.div
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ opacity: 1, scale: 1 }}
               className="inline-flex items-center gap-4 px-6 py-2 border border-brand-gold/20 bg-brand-gold/5 backdrop-blur-xl mb-8"
             >
                <Component size={14} className="text-brand-gold animate-pulse" />
                <span className="text-[9px] font-bold uppercase tracking-[0.8em] text-brand-gold">Matriz de Sabiduría</span>
             </motion.div>
             <h1 className="text-7xl md:text-[10rem] font-serif tracking-tighter mb-6 leading-none">
               Nexo de <span className="italic text-brand-gold">Rutas</span>
             </h1>
             <p className="text-brand-muted text-sm font-light italic max-w-xl mx-auto opacity-60">
               Navegue por la topología del conocimiento. Cada nodo es una invitación a la trascendencia.
             </p>
          </div>

          <div className="relative h-[600px] flex items-center justify-center">
             <div className="absolute inset-0 pointer-events-none overflow-visible">
                {CATEGORIES_DATA.map((cat, i) => {
                  const angle = (i / CATEGORIES_DATA.length) * Math.PI * 2;
                  const x = 50 + Math.cos(angle) * 35;
                  const y = 50 + Math.sin(angle) * 35;
                  return (
                    <NodeLine 
                      key={cat.id} 
                      active={selection.main === cat.id} 
                      x1="50%" y1="50%" x2={`${x}%`} y2={`${y}%`} 
                    />
                  );
                })}
             </div>

             <div className="relative z-20 w-80 h-80 flex items-center justify-center">
                <motion.div 
                  className="absolute inset-0 rounded-full border border-brand-gold/10"
                  animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                <motion.div 
                   className="w-full h-full rounded-full border border-brand-gold/20 flex flex-col items-center justify-center bg-brand-ink/80 backdrop-blur-2xl shadow-[0_0_50px_rgba(212,175,55,0.1)] p-10 group"
                >
                   <Search size={24} className={cn("mb-4 transition-colors", search ? "text-brand-gold" : "text-brand-gold/40")} />
                   <input 
                     type="text"
                     placeholder="Infiltrar Archivo..."
                     className="w-full bg-transparent text-center text-sm font-serif italic outline-none text-brand-offwhite placeholder:text-brand-gold/20"
                     value={search}
                     onChange={(e) => setSearch(e.target.value)}
                   />
                   { (selection.main || search) && (
                     <button 
                       onClick={() => { resetAll(); setSearch(""); }}
                       className="mt-4 text-[8px] font-bold uppercase tracking-[0.4em] text-brand-gold hover:text-white transition-colors"
                     >
                       Reboot Nexus [X]
                     </button>
                   )}
                </motion.div>
             </div>

             {CATEGORIES_DATA.map((cat, i) => {
               const angle = (i / CATEGORIES_DATA.length) * Math.PI * 2;
               const x = Math.cos(angle) * 35;
               const y = Math.sin(angle) * 35;
               const isActive = selection.main === cat.id;

               return (
                 <motion.button
                   key={cat.id}
                   initial={{ opacity: 0, scale: 0 }}
                   animate={{ 
                     opacity: 1, 
                     scale: 1, 
                     left: `${50 + x}%`, 
                     top: `${50 + y}%`,
                     translateX: "-50%",
                     translateY: "-50%"
                   }}
                   onClick={() => setSelection({ main: isActive ? null : cat.id, sub: null })}
                   className={cn(
                     "absolute w-20 h-20 md:w-32 md:h-32 rounded-full border flex flex-col items-center justify-center transition-all group",
                     isActive ? "bg-brand-gold text-brand-ink scale-125 border-brand-gold z-30 shadow-[0_0_30px_rgba(212,175,55,0.5)]" : "bg-brand-ink border-brand-gold/20 text-brand-gold hover:border-brand-gold/60"
                   )}
                 >
                    <cat.icon size={isActive ? 24 : 18} className="mb-2" />
                    <span className="text-[7px] md:text-[9px] font-bold uppercase tracking-widest hidden md:block">{cat.name}</span>
                 </motion.button>
               );
             })}
          </div>

          <AnimatePresence>
            {selection.main && selectedMainData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="mt-32 p-12 bg-white/5 backdrop-blur-3xl border border-brand-gold/10 rounded-2xl"
              >
                <div className="flex items-center gap-6 mb-12">
                   <div className="w-12 h-px bg-brand-gold" />
                   <h2 className="text-3xl font-serif italic text-brand-gold">Especializaciones de {selectedMainData.name}</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                   {selectedMainData.subcategories.map((sub) => (
                     <button
                       key={sub.id}
                       onClick={() => setSelection(prev => ({ ...prev, sub: prev.sub === sub.id ? null : sub.id }))}
                       className={cn(
                         "group flex flex-col items-center p-6 border transition-all",
                         selection.sub === sub.id ? "bg-brand-gold text-brand-ink border-brand-gold h-full shadow-lg" : "bg-brand-ink/40 border-brand-gold/10 hover:border-brand-gold/40"
                       )}
                     >
                        <sub.icon size={16} className="mb-4" />
                        <span className="text-[9px] font-bold uppercase tracking-widest text-center">{sub.name}</span>
                     </button>
                   ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <section className="py-32 relative">
         <div className="max-w-[1800px] mx-auto px-10">
            <div className="flex items-center gap-8 mb-20 opacity-40">
               <span className="text-[10px] font-bold uppercase tracking-[1em]">Resultados de Exploración</span>
               <div className="flex-1 h-[1px] bg-brand-gold/20" />
               <span className="font-mono text-[10px]">{guides.length} Fragmentos Hallados</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
               {guides.map(guide => (
                 <GuideCard key={guide.id} {...guide} url={guide.subcategory ? `/guias/${guide.category}/${guide.subcategory}` : `/guias/${guide.category}`} />
               ))}
            </div>

            {guides.length === 0 && (
              <div className="py-48 text-center bg-brand-gold/5 border border-dashed border-brand-gold/10 rounded-3xl">
                 <Target size={40} className="text-brand-gold/20 mx-auto mb-8" />
                 <h3 className="text-3xl font-serif italic text-brand-gold/60 mb-2">Señal Perdida</h3>
                 <p className="text-brand-muted text-sm max-w-xs mx-auto font-light">No hay registros en esta frecuencia. Pruebe otro vector de búsqueda.</p>
              </div>
            )}
         </div>
      </section>

      <section className="py-40 bg-brand-offwhite text-brand-ink relative overflow-hidden">
         <div className="absolute inset-0 bg-engraving opacity-[0.05]" />
         <div className="max-w-7xl mx-auto px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
               <div className="relative">
                  <div className="aspect-square border border-brand-ink/10 relative flex items-center justify-center p-20">
                     <div className="absolute inset-0 animate-[spin_60s_linear_infinite] opacity-5">
                        <Hexagon size="100%" className="text-brand-ink" />
                     </div>
                     <div className="text-center relative z-10">
                        <motion.div 
                          className="w-32 h-32 bg-brand-ink flex items-center justify-center rounded-full mx-auto mb-10 shadow-[0_0_50px_rgba(0,0,0,0.2)]"
                        >
                           <Zap size={40} className="text-brand-gold" />
                        </motion.div>
                        <h4 className="text-6xl font-serif italic mb-2">Convergencia</h4>
                        <span className="text-[10px] font-bold uppercase tracking-[1em] text-brand-muted">Maestría de Datos</span>
                     </div>
                  </div>
                  <div className="absolute top-0 right-0 w-24 h-24 bg-brand-gold rounded-full flex items-center justify-center shadow-2xl -translate-y-1/2 translate-x-1/2">
                     <Hash size={24} className="text-brand-ink" />
                  </div>
               </div>
               
               <div>
                  <h2 className="text-6xl font-serif mb-12 tracking-tighter leading-none">
                    Evolucione más allá de los <span className="text-brand-gold">Limites</span> de la Información.
                  </h2>
                  <div className="space-y-12">
                     {[
                       { label: "Sincronización Cognitiva", xp: "2.4k", icon: Brain },
                       { label: "Arquitectura Lógica", xp: "1.8k", icon: Atom },
                       { label: "Traducción Conceptual", xp: "0.9k", icon: Sparkles },
                     ].map((item, i) => (
                        <div key={i} className="group cursor-default">
                           <div className="flex justify-between items-end mb-4">
                              <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 border border-brand-ink/10 flex items-center justify-center group-hover:bg-brand-ink group-hover:text-brand-gold transition-all">
                                    <item.icon size={16} />
                                 </div>
                                 <span className="text-[11px] font-bold uppercase tracking-[0.4em]">{item.label}</span>
                              </div>
                              <span className="font-mono text-[10px] text-brand-gold font-bold">{item.xp} XP / Recorrido</span>
                           </div>
                           <div className="h-[1px] bg-brand-ink/10 w-full" />
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
}
