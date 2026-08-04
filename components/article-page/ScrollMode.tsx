'use client';
import React from "react";
import {
  motion, AnimatePresence
} from "motion/react";
import {
  Target, Layers, Lightbulb, BrainCircuit, Hash
} from "lucide-react";
import { cn } from "@/lib/utils";
import { customMarkdownComponents, markdownPlugins } from "./components/customMarkdownComponents";
import { preprocessAnektiaContent } from "./parsers/preprocessAnektiaContent";
import ReactMarkdown from "react-markdown";
import { MasteryCommandCenter } from "@/components/interactive/MasteryCommandCenter";
import type { AnektiaArticle } from "@/types";

function FloatingLevelLabel({ level }: { level: string }) {
  const levelNames: Record<string, string> = {
    principiante: "CAPA I: FUNDAMENTOS",
    intermedio: "CAPA II: EXÉGESIS",
    avanzado: "CAPA III: FRONTERA"
  };

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed bottom-12 right-12 z-50 pointer-events-none"
    >
      <div className="bg-[#1A1A1A] dark:bg-[#121215] text-brand-gold px-7 py-4 rounded-full border border-brand-gold/30 shadow-2xl backdrop-blur-xl flex items-center gap-4">
        <div className="w-2.5 h-2.5 rounded-full bg-brand-gold animate-pulse shadow-[0_0_10px_#D4AF37]" />
        <span className="text-[10px] font-mono font-bold uppercase tracking-[0.4em]">{levelNames[level] || level}</span>
      </div>
    </motion.div>
  );
}

function SidebarTOC({ sections, activeId, currentLevel }: { sections: any[], activeId: string, currentLevel: string }) {
  if (sections.length === 0) return null;
  const layerLabel = currentLevel === 'principiante' ? 'FUNDAMENTOS (CAPA I)' : currentLevel === 'intermedio' ? 'EXÉGESIS (CAPA II)' : 'FRONTERA (CAPA III)';

  return (
    <aside className="hidden xl:block w-80 shrink-0">
      <div className="sticky top-48 space-y-16">
        <div className="relative pl-8 border-l border-brand-gold/20">
          <div className="text-[11px] font-mono font-bold uppercase tracking-[0.5em] text-[#8B6914] dark:text-brand-gold mb-10 flex items-center gap-3">
            <Hash size={14} className="text-brand-gold" /> HITOS DE {layerLabel}
          </div>
          <nav className="space-y-8">
            {sections.map((s, idx) => {
              const sectionTitle = typeof s.titulo === 'object'
                ? (s.titulo[currentLevel] || s.titulo['principiante'] || s.id)
                : s.titulo;

              return (
                <a key={s.id} href={`#${s.id}`} className={cn("group block transition-all duration-500", activeId === s.id && "translate-x-3")}>
                  <div className="flex items-start gap-4">
                    <span className={cn("text-[11px] font-mono font-bold transition-all duration-500", activeId === s.id ? "text-brand-gold scale-110" : "text-brand-ink/30 dark:text-brand-offwhite/30")}>{String(idx + 1).padStart(2, '0')}</span>
                    <span className={cn("text-xs font-serif italic transition-all duration-500 line-clamp-2 leading-relaxed", activeId === s.id ? "text-brand-ink dark:text-brand-offwhite font-semibold" : "text-brand-ink/60 dark:text-brand-offwhite/60 group-hover:text-brand-ink dark:group-hover:text-brand-offwhite")}>{sectionTitle}</span>
                  </div>
                </a>
              );
            })}
          </nav>
        </div>
      </div>
    </aside>
  );
}

function RenderAcciones({ acciones }: { acciones: any[] }) {
  if (!acciones || acciones.length === 0) return null;

  let AccionBotones: any;
  let BotonSimplificar: any, BotonProfundizar: any, BotonEjemplos: any, BotonConexiones: any;

  try {
    const mod = require("@/components/interactive/AccionBotones");
    AccionBotones = mod.AccionBotones;
    BotonSimplificar = mod.BotonSimplificar;
    BotonProfundizar = mod.BotonProfundizar;
    BotonEjemplos = mod.BotonEjemplos;
    BotonConexiones = mod.BotonConexiones;
  } catch {
    return null;
  }

  return (
    <AccionBotones>
      {acciones.map((acc, i) => {
        if (acc.tipo === "simplificar") return <BotonSimplificar key={i}>{acc.contenido}</BotonSimplificar>;
        if (acc.tipo === "profundizar") return <BotonProfundizar key={i}>{acc.contenido}</BotonProfundizar>;
        if (acc.tipo === "ejemplos") return <BotonEjemplos key={i}>{acc.contenido}</BotonEjemplos>;
        if (acc.tipo === "conexiones") return <BotonConexiones key={i}>{acc.contenido}</BotonConexiones>;
        return null;
      })}
    </AccionBotones>
  );
}

interface ScrollModeProps {
  article: AnektiaArticle;
  displaySecciones: any[];
  currentLevel: string;
  changeLevel: (level: string) => void;
  availableLevels: string[];
  onSwitchToFocus: () => void;
  transitioning: boolean;
  activeHeadingId: string;
  liveProgress: number;
}

export function ScrollMode({
  article,
  displaySecciones,
  currentLevel,
  changeLevel,
  availableLevels,
  onSwitchToFocus,
  transitioning,
  activeHeadingId,
  liveProgress
}: ScrollModeProps) {
  const { metadata, introduccion } = article;

  return (
    <div className="bg-[#FDFBF7] dark:bg-[#0F0F12] min-h-screen text-[#1A1A1A] dark:text-[#F4F2EC] selection:bg-brand-gold selection:text-brand-ink pb-64 transition-colors duration-500 font-sans">
      <MasteryCommandCenter
        currentLevel={currentLevel}
        onChangeLevel={changeLevel}
        progress={liveProgress}
        xpGained={0}
        availableLevels={availableLevels}
      />
      <FloatingLevelLabel level={currentLevel} />

      <AnimatePresence>
        {transitioning && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-[#FDFBF7] dark:bg-[#0F0F12] flex flex-col items-center justify-center gap-10 backdrop-blur-3xl bg-[#FDFBF7]/95 dark:bg-[#0F0F12]/95"
          >
            <BrainCircuit className="w-20 h-20 text-brand-gold animate-[pulse_1.5s_ease-in-out_infinite]" />
            <span className="text-[12px] font-mono font-black uppercase tracking-[0.8em] text-[#8B6914] dark:text-brand-gold ml-[0.8em]">Sincronizando Nueva Capa</span>
            <div className="w-48 h-0.5 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
              <motion.div initial={{ x: '-100%' }} animate={{ x: '100%' }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} className="w-full h-full bg-brand-gold" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="relative pt-48 pb-32 px-10 bg-transparent border-b border-black/5 dark:border-white/10 overflow-hidden">
        <div className="absolute top-0 right-0 p-20 opacity-[0.02] pointer-events-none text-brand-ink dark:text-brand-offwhite"><Layers size={500} /></div>
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-32 items-end relative z-10">
          <div>
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-6 text-[11px] font-mono font-bold uppercase tracking-[0.6em] text-[#8B6914] dark:text-brand-gold">
                <span>{metadata.category}</span>
                <div className="w-12 h-px bg-brand-gold/50" />
                <span className="opacity-60">{metadata.subcategory}</span>
              </div>

              <button
                onClick={onSwitchToFocus}
                className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-[0.2em] bg-brand-gold text-brand-ink px-4 py-2 rounded-xl shadow-lg hover:bg-black hover:text-brand-gold transition-all"
              >
                <Target size={14} />
                <span>Modo Enfoque Paso a Paso 🎯</span>
              </button>
            </div>

            <h1 className="font-serif text-3xl md:text-4xl lg:text-[2.75rem] leading-[1.2] tracking-tight mb-12 text-brand-ink dark:text-white font-bold">
              {metadata.title.split(':').map((p, i) => (
                <span key={i} className={i === 1 ? "block text-brand-ink/60 dark:text-brand-offwhite/60 mt-3 font-sans font-light text-xl md:text-2xl" : ""}>{p}</span>
              ))}
            </h1>

            <p className="text-brand-ink/80 dark:text-brand-offwhite/80 text-xl font-serif italic leading-relaxed max-w-2xl font-normal border-l-2 border-brand-gold pl-6">
              {metadata.description}
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto px-10 pt-32">
        <div className="flex gap-32">
          <SidebarTOC sections={displaySecciones} activeId={activeHeadingId} currentLevel={currentLevel} />

          <main className="flex-1 max-w-4xl">
            {introduccion && (currentLevel === 'principiante' || (availableLevels && availableLevels[0] === currentLevel)) && (
              <div className="mb-24 p-12 bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/10 rounded-3xl">
                <div className="text-[11px] font-mono font-bold uppercase tracking-[0.6em] text-[#8B6914] dark:text-brand-gold mb-8 flex items-center gap-3">
                  <Lightbulb size={16} /> Exordio
                </div>
                <div className="markdown-body prose dark:prose-invert max-w-none text-xl leading-relaxed text-[#262626] dark:text-slate-100">
                  <ReactMarkdown
                    remarkPlugins={markdownPlugins.remark}
                    rehypePlugins={markdownPlugins.rehype}
                    components={customMarkdownComponents}
                  >
                    {preprocessAnektiaContent(introduccion)}
                  </ReactMarkdown>
                </div>
              </div>
            )}

            <div className="space-y-32">
              {displaySecciones.map((sec, idx) => (
                <section key={sec.id} id={sec.id} className="scroll-mt-48 pt-12 border-t border-black/5 dark:border-white/10 first:border-0 first:pt-0">
                  <div className="flex items-center gap-4 text-[11px] font-mono font-bold uppercase tracking-[0.5em] text-brand-gold mb-6">
                    <span>HITO {String(idx + 1).padStart(2, '0')}</span>
                  </div>

                  <h2 className="font-serif text-3xl md:text-4xl text-brand-ink dark:text-white font-bold mb-12">
                    {sec.activeTitle}
                  </h2>

                  <div className="markdown-body prose dark:prose-invert max-w-none text-[#262626] dark:text-slate-100">
                    <ReactMarkdown
                      remarkPlugins={markdownPlugins.remark}
                      rehypePlugins={markdownPlugins.rehype}
                      components={customMarkdownComponents}
                    >
                      {preprocessAnektiaContent(sec.activeContent || "Contenido no disponible para este nivel.")}
                    </ReactMarkdown>
                  </div>

                  {sec.acciones && sec.acciones.length > 0 && (
                    <div className="mt-12 pt-8 border-t border-black/5 dark:border-white/10">
                      <RenderAcciones acciones={sec.acciones} />
                    </div>
                  )}
                </section>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
