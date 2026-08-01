'use client';
import { useEffect, useState, useRef } from "react";
import Link from 'next/link';
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { 
  ArrowRight, Sparkles, Hash, Zap, Target, Hexagon, 
  Component, Search, Cpu, Brain, Atom, Languages,
  ChevronRight, Circle, Globe, BookOpen, X, Fingerprint
} from "lucide-react";
import { CATEGORIES_DATA } from "@/data/categories";
import type { ArticleFrontmatter } from "@/types";
import { cn, getArticlePath } from "@/lib/utils";

import { NexusNode3D } from "@/components/NexusNode3D";

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
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
    </svg>
  );
}

export function HomeClient({ initialArticles = [] }: { initialArticles?: ArticleFrontmatter[] }) {
  const [articles, setArticles] = useState<ArticleFrontmatter[]>(initialArticles);
  const [loading, setLoading] = useState(false);
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.2]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  useEffect(() => {
    if (initialArticles && initialArticles.length > 0) {
      setArticles(initialArticles);
    }
  }, [initialArticles]);

  const featured = articles[0];
  const others = articles.slice(1);

  const selectedCategory = CATEGORIES_DATA.find(c => c.id === activeNode);

  return (
    <div ref={containerRef} className="home-page-container bg-brand-ink min-h-screen relative selection:bg-brand-gold selection:text-brand-ink overflow-x-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
         <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="absolute min-w-full min-h-full object-cover top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-40 mix-blend-screen scale-105"
         >
            <source src="/the-magical-black-and-white-cat.mp4" type="video/mp4" />
         </video>
         <div className="absolute inset-0 bg-brand-ink/40" />
         <div className="absolute inset-0 bg-engraving opacity-[0.03]" />
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08)_0%,transparent_70%)]" />
         <div className="absolute inset-0 bg-[linear-gradient(rgba(212,175,55,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(212,175,55,0.02)_1px,transparent_1px)] bg-[size:100px_100px]" />
         
         {/* Top and bottom subtle gradients for masking */}
         <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-brand-ink to-transparent" />
         <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-brand-ink via-brand-ink/80 to-transparent" />
      </div>

      {/* NEXUS HERO SECTION */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center p-4 overflow-hidden">
        <motion.div 
          animate={{ x: activeNode ? "-15%" : "0%" }}
          transition={{ duration: 0.8, ease: "circOut" }}
          style={{ opacity, scale }}
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
                         Nexus Activo
                      </div>
                   </div>
                </div>
             </div>
          </motion.div>
        </motion.div>

        {/* LATERAL BRANCH EXPANSION PANEL */}
        <AnimatePresence>
          {activeNode && selectedCategory && (
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="absolute right-0 top-0 h-full w-full md:w-[500px] lg:w-[700px] bg-brand-ink border-l border-brand-gold/30 z-50 overflow-hidden flex flex-col"
            >
              {/* Background Accents */}
              <div className="absolute inset-0 bg-engraving opacity-10 pointer-events-none" />
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-gold/5 blur-[120px] -translate-y-1/2 translate-x-1/2 rounded-full" />
              
              <div className="relative z-10 flex flex-col h-full">
                {/* Header with Close */}
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
                  {/* Master Portal Link */}
                  <div className="mb-16">
                     <Link href={selectedCategory.path || `/guias/${selectedCategory.id}`}
                       className="group relative flex flex-col items-center text-center bg-brand-ink border border-brand-gold/20 p-16 hover:border-brand-gold/50 transition-all shadow-2xl overflow-hidden backdrop-blur-sm"
                     >
                        <div className="absolute inset-0 bg-brand-gold opacity-0 group-hover:opacity-[0.03] transition-opacity" />
                        <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-brand-gold" />
                        <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-brand-gold" />
                        <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-brand-gold" />
                        <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-brand-gold" />
                        
                        <div className="w-20 h-20 rounded-full bg-brand-gold text-brand-ink flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(212,175,55,0.3)] group-hover:scale-110 transition-transform duration-500">
                           <Sparkles size={32} />
                        </div>
                        <h2 className="text-4xl font-serif text-brand-offwhite mb-4 group-hover:text-brand-gold transition-colors italic">Guía Maestra de {selectedCategory.name}</h2>
                        <p className="text-[11px] text-brand-offwhite/40 uppercase tracking-[0.3em] font-bold mb-10 group-hover:text-brand-offwhite/60">Acceso al Archivo Central</p>
                        
                        <div className="flex items-center gap-4 text-brand-gold text-[10px] font-bold uppercase tracking-[0.5em] border-t border-brand-gold/10 pt-8 w-full justify-center">
                           <span>Establecer Sincronización</span>
                           <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                        </div>
                     </Link>
                  </div>

                  {/* Branches Section */}
                  <div className="mb-10 flex items-center gap-6">
                     <span className="text-[9px] font-bold uppercase tracking-[1em] text-brand-gold whitespace-nowrap">Ramas Activas</span>
                     <div className="flex-1 h-px bg-brand-gold/20" />
                  </div>

                    <div className="grid grid-cols-1 gap-4">
                     {selectedCategory.subcategories.map((sub, idx) => (
                       <motion.div
                         key={sub.id}
                         initial={{ opacity: 0, x: 20 }}
                         animate={{ opacity: 1, x: 0 }}
                         transition={{ delay: 0.3 + (idx * 0.05) }}
                       >
                         <Link href={`${selectedCategory.path || `/guias/${selectedCategory.id}`}/${sub.id}`}
                           className="group flex flex-col gap-6 bg-brand-ink border border-white/[0.05] p-8 hover:bg-white/[0.03] hover:border-brand-gold/30 transition-all shadow-inner"
                         >
                            <div className="flex items-center justify-between">
                               <div className="flex items-center gap-6">
                                  <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold group-hover:bg-brand-gold group-hover:text-brand-ink transition-colors">
                                     <sub.icon size={18} />
                                  </div>
                                  <h3 className="text-2xl font-serif text-brand-offwhite group-hover:text-brand-gold transition-colors">{sub.name}</h3>
                               </div>
                               <ArrowRight size={16} className="text-brand-gold/20 group-hover:text-brand-gold transition-colors" />
                            </div>
                            
                            <div className="flex flex-wrap gap-2">
                               {sub.topics.map((topic) => (
                                 <span key={topic} className="text-[8px] font-mono border border-brand-gold/10 px-3 py-1 text-brand-offwhite/40 uppercase tracking-widest hover:border-brand-gold/30 hover:text-brand-offwhite transition-all">
                                   {topic}
                                 </span>
                               ))}
                            </div>
                         </Link>
                       </motion.div>
                     ))}
                  </div>

                  <div className="mt-20 p-12 border border-brand-gold/10 bg-brand-gold/[0.02] text-center italic">
                     <p className="text-[12px] text-brand-offwhite/50 leading-relaxed font-light">
                       "{selectedCategory.description}"
                     </p>
                  </div>
                </div>

                {/* Footer status */}
                <div className="p-8 border-t border-brand-gold/10 bg-brand-ink text-center">
                   <div className="flex items-center justify-center gap-4 text-[8px] font-mono text-brand-gold/30">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse" />
                      <span>CANON_BRIDGE_STABLE: 8.42GHz</span>
                   </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Data Points */}
        <div className="absolute bottom-12 left-12 flex flex-col gap-6 text-[8px] font-mono text-brand-cosmic/50">
           <div className="flex items-center gap-4">
              <span className="w-1.5 h-1.5 bg-brand-cosmic/80 shadow-[0_0_5px_rgba(14,165,233,0.8)]" />
              <span>SYNC_STATUS: 100%</span>
           </div>
           <div className="flex items-center gap-4">
              <span className="w-1.5 h-1.5 bg-brand-gold/40" />
              <span className="text-brand-gold/40">LOGOS_PROTOCOL: V4.2</span>
           </div>
           <div className="flex items-center gap-4">
              <span className="w-1.5 h-1.5 bg-brand-cosmic/80 shadow-[0_0_5px_rgba(14,165,233,0.8)]" />
              <span>AET_COORDS: [52.3, -4.1, 108.9]</span>
           </div>
        </div>

        <div className="absolute bottom-12 right-12 hidden md:block group cursor-pointer" onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth'})}>
           <div className="flex items-center gap-4 bg-brand-cosmic shadow-[0_0_25px_rgba(14,165,233,0.4)] px-6 py-4 hover:bg-white hover:text-brand-ink transition-all">
              <span className="text-[10px] font-bold text-brand-ink uppercase tracking-widest">Descender en el Archivo</span>
              <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                 <ArrowRight size={14} className="rotate-90 text-brand-ink" />
              </motion.div>
           </div>
        </div>
      </section>      {/* ARCHIVAL METRICS - REFINED STATUS PANEL */}
      <section className="py-20 relative z-10 border-y border-brand-gold/10 bg-brand-ink/40 backdrop-blur-md">
        <div className="max-w-[1600px] mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-24">
            
            {/* System Identity Block */}
            <div className="lg:col-span-1 border-r border-brand-gold/10 pr-12">
               <div className="flex items-center gap-3 mb-6">
                  <div className="w-2 h-2 bg-brand-cosmic rounded-full animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-brand-cosmic">Status_Activo</span>
               </div>
               <h3 className="font-serif text-3xl text-brand-offwhite mb-6">Integridad del <span className="italic">Canon</span> Literario</h3>
               <p className="text-[11px] text-brand-offwhite/40 leading-relaxed font-light italic mb-8">
                  "El conocimiento no se pierde, se transmuta en frecuencia."
               </p>
               <div className="font-mono text-[8px] text-brand-cosmic/40 tracking-widest">
                  RELIC_BUILD: 2026.05.06<br />
                  CRYPT_SIGN: 0x82A1B
               </div>
            </div>

            {/* Live Metrics Grid */}
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-12">
               {/* Metric 1 */}
               <div className="flex flex-col justify-between py-2 group">
                  <div>
                    <span className="text-[8px] font-mono text-brand-gold/40 block mb-4 uppercase">Sincronización Total</span>
                    <div className="flex items-baseline gap-4 mb-4">
                       <span className="text-4xl font-serif text-brand-gold italic">87.4%</span>
                       <span className="text-[10px] text-brand-offwhite/20">/ 100</span>
                    </div>
                    <div className="h-0.5 w-full bg-brand-gold/5 overflow-hidden">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: "87.4%" }}
                         transition={{ duration: 2 }}
                         className="h-full bg-brand-gold/40"
                       />
                    </div>
                  </div>
                  <Link href="/guias" className="mt-8 text-[9px] font-bold uppercase tracking-[0.4em] text-brand-offwhite/40 group-hover:text-brand-gold transition-colors inline-flex items-center gap-2">
                    Reforzar Enlaces <ArrowRight size={10} />
                  </Link>
               </div>

               {/* Metric 2 */}
               <div className="flex flex-col justify-between py-2 group">
                  <div>
                    <span className="text-[8px] font-mono text-brand-gold/40 block mb-4 uppercase">Fragmentos Registrados</span>
                    <div className="flex items-baseline gap-4 mb-4">
                       <span className="text-4xl font-serif text-brand-gold italic">1,242</span>
                       <span className="text-[10px] text-brand-offwhite/20">UDS</span>
                    </div>
                    <div className="flex gap-1 h-0.5">
                       {[1,2,3,4,5,6,7,8].map(i => (
                         <div key={i} className={cn("flex-1 bg-brand-gold/40", i > 6 && "opacity-10")} />
                       ))}
                    </div>
                  </div>
                  <Link href="/articulos" className="mt-8 text-[9px] font-bold uppercase tracking-[0.4em] text-brand-offwhite/40 group-hover:text-brand-gold transition-colors inline-flex items-center gap-2">
                    Consultar Archivo <ArrowRight size={10} />
                  </Link>
               </div>

               {/* Metric 3 - The "Nexus" state */}
               <div className="flex flex-col justify-between py-2 group border-l border-brand-cosmic/20 pl-12 bg-brand-cosmic/[0.02] p-6 -m-6 border border-transparent hover:border-brand-cosmic/30 transition-all">
                  <div className="flex items-start justify-between">
                    <div>
                       <span className="text-[8px] font-mono text-brand-cosmic/60 block mb-4 uppercase">Prioridad de Acceso</span>
                       <h4 className="text-xl font-serif text-brand-offwhite italic group-hover:text-brand-cosmic transition-colors">Exégesis Maestra</h4>
                    </div>
                    <div className="w-8 h-8 rounded-full border border-brand-cosmic/30 flex items-center justify-center">
                       <Zap size={14} className="text-brand-cosmic animate-pulse" />
                    </div>
                  </div>
                  <p className="text-[10px] text-brand-offwhite/40 my-4 leading-tight italic">
                    Acceso directo a la sección de meta-análisis y guías estructuradas.
                  </p>
                  <Link href="/guias/humanidades/filosofia" className="mt-4 px-6 py-3 border border-brand-cosmic/40 text-brand-cosmic text-[8px] font-bold uppercase tracking-widest hover:bg-brand-cosmic hover:text-brand-ink transition-all text-center">
                    Cargar Protocolo
                  </Link>
               </div>
            </div>

          </div>
        </div>
      </section>

      {/* THE DOSSIER - COMPACT FEATURED SPOTLIGHT */}
      {featured && (
        <section className="py-20 relative border-y border-brand-gold/10 overflow-hidden bg-brand-ink/50 backdrop-blur-sm">
          <div className="max-w-[1600px] mx-auto px-8 relative z-10">
            <div className="flex flex-col lg:flex-row items-stretch gap-0 border border-brand-gold/20 bg-brand-ink/80 shadow-2xl relative">
              
              {/* Visual Identification */}
              <div className="lg:w-1/3 relative group overflow-hidden border-r border-brand-cosmic/30 min-h-[300px]">
                <img 
                  src="https://images.unsplash.com/photo-1513001300722-370f803f498d?auto=format&fit=crop&q=80&w=1000" 
                  className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" 
                  alt={featured.title} 
                />
                <div className="absolute inset-0 bg-brand-cosmic/10 group-hover:bg-transparent transition-colors mix-blend-screen" />
              </div>

              {/* Data Content */}
              <div className="flex-1 p-10 lg:p-16 flex flex-col justify-center relative">
                {/* Background serial number */}
                <div className="absolute top-8 right-8 font-mono text-[40px] lg:text-[80px] text-brand-cosmic/5 pointer-events-none select-none font-bold uppercase">
                  #{featured.slug.slice(0, 4)}
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-brand-cosmic">{featured.category}</span>
                  <div className="w-1 h-1 bg-brand-cosmic/40 rounded-full animate-pulse" />
                  <span className="text-[9px] font-mono text-brand-cosmic/60 uppercase tracking-widest italic">{featured.author}</span>
                </div>

                <h2 className="font-serif text-4xl lg:text-6xl text-brand-offwhite mb-6 leading-tight tracking-tight">
                  <span className="block italic text-brand-cosmic/90 drop-shadow-[0_0_10px_rgba(14,165,233,0.3)]">{featured.title.split(' ')[0]}</span>
                  <span className="block">{featured.title.split(' ').slice(1).join(' ')}</span>
                </h2>

                <p className="max-w-2xl text-sm md:text-base text-brand-offwhite/50 leading-relaxed font-light mb-10 border-l border-brand-cosmic/40 pl-6 italic">
                  "{featured.description}"
                </p>

                <div className="flex flex-wrap items-center gap-8 pt-8 border-t border-brand-cosmic/20">
                  <Link href={getArticlePath(featured)}
                    className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-[0.4em] text-brand-cosmic hover:text-white transition-all group/link"
                  >
                    <span>Iniciar Exégesis</span>
                    <div className="w-10 h-10 rounded-full border border-brand-cosmic shadow-[0_0_15px_rgba(14,165,233,0.2)] flex items-center justify-center group-hover/link:bg-brand-cosmic group-hover/link:text-brand-ink transition-all">
                      <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                </div>
              </div>

              {/* Technical Indicator Sidebar */}
              <div className="hidden lg:flex flex-col border-l border-brand-cosmic/30 divide-y divide-brand-cosmic/20 bg-brand-cosmic/[0.02]">
                 <div className="flex-1 flex flex-col items-center justify-center px-4">
                    <div className="writing-mode-vertical-rl rotate-180 text-[7px] font-bold uppercase tracking-[0.8em] text-brand-cosmic/50">
                       PROYECTO_NEXUS
                    </div>
                 </div>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* RECENT NODE ACQUISITIONS */}
      <section className="py-48 relative overflow-hidden">
        <div className="max-w-[1800px] mx-auto px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-32 gap-12">
            <div>
              <span className="text-[10px] font-sans font-bold uppercase tracking-[0.6em] text-brand-cosmic mb-8 block">
                Nuevos Canales de Flujo
              </span>
              <h2 className="font-serif text-8xl md:text-[10rem] tracking-tighter leading-none text-brand-offwhite">
                La <span className="italic text-brand-cosmic drop-shadow-[0_0_20px_rgba(14,165,233,0.3)]">Crónica</span> Digital.
              </h2>
            </div>
            <Link href="/articulos" className="group flex items-center gap-10 text-[10px] font-sans font-bold uppercase tracking-[0.5em] text-brand-cosmic hover:text-white transition-all border-b border-brand-cosmic/30 pb-4">
              Expandir Nexus <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
             {others.slice(0, 4).map((article, idx) => (
                <motion.div 
                  key={article.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group"
                >
                   <div className="relative overflow-hidden mb-10 aspect-[4/5] border border-brand-cosmic/10 group-hover:border-brand-cosmic/40 transition-all duration-700">
                      <img src={`https://images.unsplash.com/photo-${idx === 0 ? '1532012197267-da84d127e765' : idx === 1 ? '1524993306907-3f1e4b7bf0e5' : idx === 2 ? '1504275107627-0c2ba7a43dba' : '1501503069356-3c6b82a17d89'}?auto=format&fit=crop&q=80&w=800`} className="w-full h-full object-cover grayscale opacity-50 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-1000" alt={article.title} />
                      <div className="absolute inset-0 bg-brand-ink/40 group-hover:opacity-0 transition-opacity" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <div className="w-16 h-16 border border-white flex items-center justify-center bg-brand-ink/60 backdrop-blur-md">
                            <ArrowRight size={24} className="text-white" />
                         </div>
                      </div>
                      <div className="absolute top-8 left-8">
                         <span className="text-[7px] font-bold uppercase tracking-[0.4em] bg-brand-cosmic text-brand-ink px-4 py-1.5 shadow-xl">{article.category}</span>
                      </div>
                   </div>
                   <div className="flex items-start justify-between mb-4">
                       <span className="font-mono text-[9px] text-brand-cosmic/40 uppercase tracking-widest">IDX_{String(idx + 1).padStart(3, '0')}</span>
                      <div className="flex gap-1 h-px w-8 bg-brand-cosmic/20" />
                   </div>
                   <h4 className="font-serif text-3xl text-brand-offwhite mb-6 group-hover:text-brand-cosmic transition-colors leading-tight">{article.title}</h4>
                   <Link href={getArticlePath(article)} className="text-[9px] font-bold uppercase tracking-[0.5em] text-brand-cosmic border-b border-brand-cosmic/20 pb-1 hover:border-brand-cosmic hover:text-white transition-all">
                      Iniciar Sincronización
                   </Link>
                </motion.div>
             ))}
          </div>
        </div>
      </section>

      {/* FINAL SYSTEM FOOTER */}
      <section className="py-48 bg-transparent relative overflow-hidden group">
         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(212,175,55,0.15),transparent_80%)] z-0 pointer-events-none" />

         <div className="max-w-7xl mx-auto px-8 relative z-10 text-center">
            <motion.div 
               animate={{ scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] }} 
               transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
               className="mb-12 relative w-32 h-32 mx-auto"
            >
               <div className="absolute inset-0 bg-brand-gold blur-3xl opacity-40 animate-pulse" />
               <div className="relative w-full h-full rounded-full border border-brand-gold/50 shadow-[0_0_40px_rgba(212,175,55,0.5)] overflow-hidden bg-brand-ink/90 flex items-center justify-center p-2 backdrop-blur-sm">
                 <img src="/mascot.png" alt="Aeterna Mascot" className="w-full h-full object-cover rounded-full" />
               </div>
            </motion.div>
            <h2 className="text-7xl md:text-9xl font-serif tracking-tighter text-brand-offwhite mb-16 leading-none drop-shadow-2xl">
              El Nexo es <span className="italic text-brand-gold drop-shadow-[0_0_20px_rgba(212,175,55,0.5)]">Infinito</span>.
            </h2>
            <div className="flex flex-wrap justify-center gap-12">
               {[
                 { label: "Guias", path: "/guias", icon: Target },
                 { label: "Autores", path: "/autores", icon: Brain },
                 { label: "Archivo", path: "/articulos", icon: BookOpen },
                 { label: "Perfil", path: "/profile", icon: Zap }
               ].map((item) => (
                 <Link key={item.label}
                   href={item.path} 
                   className="group/link flex flex-col items-center gap-4 text-brand-offwhite"
                 >
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
