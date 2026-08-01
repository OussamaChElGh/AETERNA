'use client';
import React, { useEffect, useState, useRef, useMemo } from "react";
import Link from 'next/link';
import Image from 'next/image';
import confetti from "canvas-confetti";
import {
  motion, AnimatePresence
} from "motion/react";
import {
  ArrowRight, ArrowLeft, ChevronLeft, ChevronRight, RotateCcw,
  CheckCircle2, Lightbulb, Sparkles, Zap, Layers, ShieldCheck,
  BookOpen, Clock, List, X, Trophy, Atom, Compass, Target, Flame,
  ArrowUpRight
} from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { PixelParticles } from "@/components/PixelParticles";
import { useGamification } from "@/context/GamificationContext";
import { customMarkdownComponents, markdownPlugins } from "./components/customMarkdownComponents";
import { preprocessAeternaContent } from "./parsers/preprocessAeternaContent";
import { extractInteractiveFromContent, extractImageFromContent } from "./parsers/extractInteractive";
import ReactMarkdown from "react-markdown";
import type { AeternaArticle } from "@/types";

const layerMeta: Record<string, { label: string; code: string; icon: any }> = {
  principiante: { label: "CAPA I: FUNDAMENTOS", code: "CAPA 01", icon: Compass },
  intermedio: { label: "CAPA II: EXÉGESIS", code: "CAPA 02", icon: BookOpen },
  avanzado: { label: "CAPA III: FRONTERA", code: "CAPA 03", icon: ShieldCheck }
};

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

interface FocusStepViewerProps {
  article: AeternaArticle;
  displaySecciones: any[];
  currentLevel: string;
  changeLevel: (level: string) => void;
  availableLevels: string[];
  onComplete: () => void;
  onSwitchToScroll: () => void;
  transitioning?: boolean;
  nextArticle?: { title: string; href: string } | null;
}

export function FocusStepViewer({
  article,
  displaySecciones,
  currentLevel,
  changeLevel,
  availableLevels,
  onComplete,
  onSwitchToScroll,
  transitioning,
  nextArticle
}: FocusStepViewerProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [showDrawer, setShowDrawer] = useState(false);

  const { addXP, completeLayer, progress, combo, fireFeedback } = useGamification();
  const { metadata, introduccion } = article;

  const articlePhase = (metadata.nivel && metadata.nivel >= 1 && metadata.nivel <= 4)
    ? metadata.nivel
    : (currentLevel === 'principiante' ? 1 : currentLevel === 'intermedio' ? 2 : 3);
  const completedLayerCount = Object.values(progress.completedLayers || {}).reduce((sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0), 0);

  const isFirstLevel = currentLevel === 'principiante' || (availableLevels && availableLevels[0] === currentLevel);
  const showIntroStep = isFirstLevel;
  const totalSteps = displaySecciones.length + (showIntroStep ? 2 : 1);
  const isIntro = showIntroStep && currentStep === 0;
  const isCompletion = currentStep === totalSteps - 1;

  const sectionIndex = showIntroStep ? currentStep - 1 : currentStep;
  const activeSection = (!isIntro && !isCompletion) ? displaySecciones[sectionIndex] : null;

  useEffect(() => {
    setCurrentStep(0);
  }, [currentLevel]);

  const exordiumBanner = useMemo(() => {
    const cat = (metadata.category || "").toLowerCase();
    const subcat = (metadata.subcategory || "").toLowerCase();

    if (cat.includes("math") || subcat.includes("matematica") || subcat.includes("logica")) {
      return "/images/aeterna_pixel_math.png";
    }
    if (cat.includes("info") || subcat.includes("computacion") || subcat.includes("programacion")) {
      return "/images/aeterna_pixel_cs.png";
    }
    return "/images/aeterna_pixel_physics.png";
  }, [metadata.category, metadata.subcategory]);

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setDirection(1);
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      addXP(15, "Hito completado");

      if (nextStep === totalSteps - 1) {
        onComplete();
        completeLayer(metadata.slug, currentLevel);
        try {
          confetti({
            particleCount: 150,
            spread: 90,
            origin: { y: 0.6 }
          });
        } catch (_e) {}
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(prev => prev - 1);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "ArrowRight" || e.key === "Enter") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentStep, totalSteps, metadata.slug, currentLevel]);

  const currentMeta = layerMeta[currentLevel] || { label: currentLevel.toUpperCase(), code: "CAPA", icon: Target };

  const { hasInteractive, textContent: preImageText, interactiveBlocks } = useMemo(() => {
    if (!activeSection) return { hasInteractive: false, textContent: "", interactiveBlocks: [] };
    return extractInteractiveFromContent(activeSection.activeContent || "");
  }, [activeSection]);

  const { hasImage, textContent, imageContent } = useMemo(() => {
    if (!preImageText) return { hasImage: false, textContent: preImageText, imageContent: null };
    return extractImageFromContent(preImageText);
  }, [preImageText]);

  const renderSectionTextCard = (colClass: string) => (
    <div className={cn(
      "bg-[#FFFFFF] dark:bg-[#16161B] border border-brand-gold/30 rounded-3xl p-8 md:p-14 shadow-[0_20px_50px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-2xl relative overflow-hidden space-y-8",
      colClass
    )}>
      <div className="absolute top-0 right-0 w-60 h-60 bg-brand-gold/5 blur-3xl pointer-events-none rounded-full" />

      <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.4em] text-[#8B6914] dark:text-brand-gold">
            HITO {String(sectionIndex + 1).padStart(2, '0')} / {String(displaySecciones.length).padStart(2, '0')}
          </span>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-brand-ink/60 dark:text-brand-muted">
          <Clock size={12} className="text-brand-gold" />
          <span>~2 min lectura</span>
        </div>
      </div>

      <h2 className="font-serif text-2xl md:text-4xl text-brand-ink dark:text-white font-bold tracking-tight leading-snug">
        {activeSection?.activeTitle}
      </h2>

      <div className="markdown-body prose dark:prose-invert max-w-none text-base md:text-lg leading-relaxed font-sans text-[#262626] dark:text-slate-100">
        <ReactMarkdown
          remarkPlugins={markdownPlugins.remark}
          rehypePlugins={markdownPlugins.rehype}
          components={customMarkdownComponents}
        >
          {preprocessAeternaContent(textContent || "Contenido no disponible para este nivel.")}
        </ReactMarkdown>
      </div>

      {activeSection?.acciones && activeSection.acciones.length > 0 && (
        <div className="pt-6 border-t border-black/10 dark:border-white/10">
          <RenderAcciones acciones={activeSection.acciones} />
        </div>
      )}
    </div>
  );

  const renderExerciseRail = (colClass: string) => {
    const isSingle = interactiveBlocks.length === 1;
    return (
    <div className={cn(
      "bg-[#FFFFFF] dark:bg-[#181822] border-2 border-brand-gold/50 rounded-3xl p-6 md:p-8 shadow-[0_20px_50px_rgba(212,175,55,0.12)] backdrop-blur-2xl relative overflow-hidden",
      "lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:flex lg:flex-col",
      isSingle && "lg:min-h-[55vh]",
      colClass
    )}>
      <div className="flex items-center justify-between border-b border-brand-gold/30 pb-4 shrink-0">
        <div className="text-[11px] font-mono font-bold uppercase tracking-[0.4em] text-[#8B6914] dark:text-brand-gold flex items-center gap-2">
          <Zap size={16} className="text-brand-gold animate-pulse" />
          <span>Actividad Práctica Interactiva</span>
        </div>
        <span className="px-3 py-1 rounded-full bg-brand-gold/20 text-[#8B6914] dark:text-brand-gold text-[9px] font-mono font-bold uppercase tracking-widest border border-brand-gold/30">
          Aeterna Lab
        </span>
      </div>

      <div className={cn(
        "space-y-6 overflow-y-auto pr-1 mt-6 flex-1 min-h-0 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-brand-gold/30 [&::-webkit-scrollbar-track]:bg-transparent",
        isSingle && "lg:flex lg:flex-col lg:justify-center"
      )}>
        {interactiveBlocks.map((block, idx) => (
          <div key={idx} className="[&>*]:my-0!">
            <ReactMarkdown
              remarkPlugins={markdownPlugins.remark}
              rehypePlugins={markdownPlugins.rehype}
              components={customMarkdownComponents}
            >
              {preprocessAeternaContent(block)}
            </ReactMarkdown>
          </div>
        ))}
      </div>
    </div>
    );
  };

  const renderImagePanel = (colClass: string) => {
    const m = imageContent?.match(/!\[([^\]]*)\]\(([^)\s]+)/);
    const src = m?.[2];
    const alt = m?.[1] || "";
    if (!src) return null;

    return (
      <div className={cn("lg:sticky lg:top-24", colClass)}>
        <figure className="bg-[#FFFFFF] dark:bg-[#16161B] border border-brand-gold/30 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            loading="lazy"
            className="w-full h-auto object-contain"
          />
          {alt && (
            <figcaption className="px-4 py-3 text-xs font-mono text-brand-ink/50 dark:text-brand-muted border-t border-black/10 dark:border-white/10">
              {alt}
            </figcaption>
          )}
        </figure>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#0F0F12] text-[#1C1C1E] dark:text-[#F4F2EC] flex flex-col justify-between selection:bg-brand-gold selection:text-brand-ink relative overflow-hidden font-sans transition-colors duration-500">
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0">
        <div className="absolute inset-0 bg-[radial-gradient(#8B6914_1px,transparent_1px)] dark:bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:32px_32px]" />
        <div className="absolute inset-0 bg-engraving opacity-10" />
      </div>

      <PixelParticles count={18} />

      <header className="sticky top-0 z-50 bg-[#FAF8F5]/90 dark:bg-[#0F0F12]/90 backdrop-blur-2xl border-b border-brand-gold/20 px-6 py-3.5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowDrawer(true)}
            className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-[#8B6914] dark:text-brand-gold px-3.5 py-2 rounded-xl border border-brand-gold/30 bg-brand-gold/10 hover:bg-brand-gold hover:text-brand-ink transition-all"
            title="Abrir índice lateral de hitos"
          >
            <List size={14} />
            <span className="hidden sm:inline">Índice Hitos</span>
          </button>

          <button
            onClick={onSwitchToScroll}
            className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-brand-ink/70 dark:text-brand-offwhite/70 hover:text-brand-gold transition-colors px-3 py-1.5 rounded-xl border border-black/10 dark:border-white/10"
            title="Cambiar a vista de lectura continua"
          >
            <Layers size={14} />
            <span className="hidden md:inline">Pergamino</span>
          </button>
        </div>

        <div className="flex flex-col items-center gap-1.5 max-w-xs md:max-w-md w-full mx-4">
          <div className="flex justify-between items-center w-full text-[10px] font-mono uppercase tracking-widest text-[#8B6914] dark:text-brand-gold font-bold">
            <span>{currentMeta.label}</span>
            <span>Hito {currentStep + 1} de {totalSteps}</span>
          </div>

          <div className="w-full flex items-center gap-1.5 h-2">
            {Array.from({ length: totalSteps }).map((_, idx) => (
              <div
                key={idx}
                className={cn(
                  "flex-1 h-full rounded-full transition-all duration-400 cursor-pointer",
                  idx < currentStep ? "bg-brand-gold" :
                  idx === currentStep ? "bg-brand-gold shadow-[0_0_10px_#D4AF37] scale-y-125" :
                  "bg-black/10 dark:bg-white/10"
                )}
                onClick={() => setCurrentStep(idx)}
                title={`Ir a Hito ${idx + 1}`}
              />
            ))}
          </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-brand-gold/15 border border-brand-gold/30 px-3 py-1 rounded-xl text-[#8B6914] dark:text-brand-gold font-mono font-bold text-xs" title="Capas completadas en todos los artículos">
            <ShieldCheck size={14} className="text-brand-gold" />
            <span>{completedLayerCount} Capas</span>
          </div>

          {combo >= 2 && (
            <motion.div
              key={`combo-${combo}`}
              initial={{ scale: 0.6, rotate: -6 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 12 }}
              className="flex items-center gap-1.5 bg-orange-500/15 border border-orange-400/40 px-3 py-1 rounded-xl text-orange-600 dark:text-orange-300 font-mono font-bold text-xs" title="Cadena de respuestas correctas"
            >
              <Flame size={14} className="text-orange-500 animate-pulse" />
              <span>Cadena x{combo}</span>
            </motion.div>
          )}

          <div className="hidden sm:flex items-center gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-xl border border-brand-gold/20">
            {availableLevels.map(lvl => {
              const isSelected = currentLevel === lvl;
              const meta = layerMeta[lvl] || { label: lvl, code: lvl };

              return (
                <button
                  key={lvl}
                  onClick={() => changeLevel(lvl)}
                  className={cn(
                    "px-3 py-1 text-[9px] font-mono font-bold uppercase tracking-widest rounded-lg transition-all border flex items-center gap-1.5",
                    isSelected
                      ? "bg-brand-gold text-brand-ink font-black border-brand-gold shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                      : "bg-transparent text-brand-ink/70 dark:text-brand-offwhite/70 hover:text-brand-ink dark:hover:text-white border-transparent"
                  )}
                >
                  <span>{meta.code}</span>
                </button>
              );
            })}
          </div>
        </div>
        </div>
      </header>

      <AnimatePresence>
        {showDrawer && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDrawer(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-80 md:w-96 bg-[#FFFFFF] dark:bg-[#16161B] border-l border-brand-gold/30 z-[101] p-8 flex flex-col justify-between shadow-2xl overflow-y-auto"
            >
              <div>
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-black/10 dark:border-white/10">
                  <div className="flex items-center gap-3 text-xs font-mono font-bold uppercase tracking-widest text-[#8B6914] dark:text-brand-gold">
                    <List size={18} />
                    <span>Índice de Hitos</span>
                  </div>
                  <button onClick={() => setShowDrawer(false)} className="text-brand-ink/50 dark:text-brand-offwhite/50 hover:text-brand-gold">
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => { setCurrentStep(0); setShowDrawer(false); }}
                    className={cn(
                      "w-full text-left p-3.5 rounded-xl border text-xs font-serif transition-all flex items-center justify-between",
                      currentStep === 0
                        ? "bg-brand-gold/15 border-brand-gold text-[#8B6914] dark:text-brand-gold font-bold"
                        : "bg-white/50 dark:bg-white/5 border-black/5 dark:border-white/5 text-brand-ink dark:text-brand-offwhite hover:border-brand-gold/30"
                    )}
                  >
                    <span>Exordio e Introducción</span>
                    {currentStep > 0 && <CheckCircle2 size={14} className="text-emerald-500" />}
                  </button>

                  {displaySecciones.map((sec, idx) => {
                    const stepNum = idx + 1;
                    const isCurrent = currentStep === stepNum;
                    const isDone = currentStep > stepNum;

                    return (
                      <button
                        key={sec.id}
                        onClick={() => { setCurrentStep(stepNum); setShowDrawer(false); }}
                        className={cn(
                          "w-full text-left p-3.5 rounded-xl border text-xs transition-all flex items-start gap-3",
                          isCurrent
                            ? "bg-brand-gold/15 border-brand-gold text-[#8B6914] dark:text-brand-gold font-bold shadow-sm"
                            : isDone
                            ? "bg-white/50 dark:bg-white/5 border-black/5 dark:border-white/5 text-brand-ink/70 dark:text-brand-offwhite/70"
                            : "bg-white/30 dark:bg-white/5 border-black/5 dark:border-white/5 text-brand-ink/40 dark:text-brand-offwhite/40"
                        )}
                      >
                        <span className="font-mono text-[10px] uppercase font-bold shrink-0 mt-0.5">{String(stepNum).padStart(2, '0')}</span>
                        <span className="font-serif italic line-clamp-2 flex-1">{sec.activeTitle}</span>
                        {isDone && <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-6 border-t border-brand-gold/20">
                <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-[#8B6914] dark:text-brand-gold font-bold mb-1">
                  <ShieldCheck size={12} /> Capas completadas: {completedLayerCount}
                </div>
                <div className="text-xs font-mono font-bold text-brand-ink dark:text-white">
                  {currentMeta.label}
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {transitioning && (
          <motion.div
            key="layer-transition"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-[95] pointer-events-none"
          >
            <div className="absolute inset-0 bg-[#FAF8F5]/80 dark:bg-[#0F0F12]/80 backdrop-blur-md" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.35),transparent_65%)]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="px-6 py-3 bg-brand-gold text-brand-ink font-mono font-black text-xs uppercase tracking-[0.4em] border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_#000]">
                {currentMeta.label}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className={cn(
        "flex-1 w-full mx-auto px-4 md:px-8 py-10 flex items-center justify-center relative z-10 transition-all duration-500",
        (hasInteractive || hasImage) && !isIntro && !isCompletion ? "max-w-[1680px]" : "max-w-4xl"
      )}>
        <AnimatePresence mode="wait" custom={direction}>
          {hasInteractive && !isIntro && !isCompletion ? (
            <motion.div
              key={`${currentLevel}-${currentStep}-split`}
              custom={direction}
              initial={{ opacity: 0, y: 26, x: direction * 40, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, x: -direction * 40, scale: 0.99 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start"
            >
              {hasImage && renderImagePanel("lg:col-span-3")}
              {renderSectionTextCard(hasImage ? "lg:col-span-5" : "lg:col-span-6")}
              {renderExerciseRail(hasImage ? "lg:col-span-4" : "lg:col-span-6")}
            </motion.div>
          ) : (
            <motion.div
              key={`${currentLevel}-${currentStep}-single`}
              custom={direction}
              initial={{ opacity: 0, y: 26, x: direction * 40, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, x: -direction * 40, scale: 0.99 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                "w-full",
                hasImage && !isIntro && !isCompletion
                  ? "grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start"
                  : ""
              )}
            >

              {isIntro && (
                <div className="bg-[#FFFFFF] dark:bg-[#16161B] border border-brand-gold/30 rounded-3xl p-8 md:p-14 shadow-[0_20px_50px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-brand-gold/5 blur-3xl pointer-events-none rounded-full" />
                  <div className="space-y-8">
                  <div className="relative w-full h-48 md:h-64 rounded-2xl overflow-hidden border-2 border-brand-gold/40 shadow-xl bg-brand-gold/10">
                    <Image
                      src={exordiumBanner}
                      alt="Aeterna Visual Exordium"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#FFFFFF] dark:from-[#16161B] via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-6 flex items-center gap-2 bg-brand-gold text-brand-ink text-[9px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-md shadow-md">
                      <Sparkles size={12} /> Visual Exordium: {metadata.subcategory || metadata.category}
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-4">
                    <div className="flex items-center gap-3 text-[10px] font-mono font-bold uppercase tracking-[0.5em] text-[#8B6914] dark:text-brand-gold">
                      <span>{metadata.category}</span>
                      <span>•</span>
                      <span>{metadata.subcategory}</span>
                    </div>
                    <div className="px-3.5 py-1 rounded-full border border-brand-gold/40 bg-brand-gold/10 text-[#8B6914] dark:text-brand-gold text-[9px] font-mono font-bold uppercase tracking-widest">
                      {currentMeta.label}
                    </div>
                  </div>

                  <h1 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-brand-ink dark:text-white leading-tight">
                    {metadata.title}
                  </h1>
                  <p className="text-brand-ink/80 dark:text-brand-offwhite/80 text-lg font-serif italic leading-relaxed border-l-2 border-brand-gold pl-6 py-1">
                    {metadata.description}
                  </p>

                  {introduccion && (
                    <div className="mt-8 mb-12 p-8 bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/10 rounded-2xl">
                      <div className="text-[11px] font-mono font-bold uppercase tracking-[0.6em] text-[#8B6914] dark:text-brand-gold mb-6 flex items-center gap-3">
                        <Lightbulb size={16} /> Exordio
                      </div>
                      <div className="markdown-body prose dark:prose-invert max-w-none text-lg leading-relaxed text-[#262626] dark:text-slate-100 font-sans">
                        <ReactMarkdown
                          remarkPlugins={markdownPlugins.remark}
                          rehypePlugins={markdownPlugins.rehype}
                          components={customMarkdownComponents}
                        >
                          {preprocessAeternaContent(introduccion)}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )}
                </div>
                </div>
              )}

              {!isIntro && !isCompletion && hasImage && (
                <>
                  {renderImagePanel("lg:col-span-3")}
                  {renderSectionTextCard("lg:col-span-6")}
                </>
              )}

              {!isIntro && !isCompletion && !hasImage && renderSectionTextCard("")}

              {isCompletion && (
                <div className="bg-[#FFFFFF] dark:bg-[#16161B] border border-brand-gold/30 rounded-3xl p-8 md:p-14 shadow-[0_20px_50px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-brand-gold/5 blur-3xl pointer-events-none rounded-full" />
                  <div className="text-center py-8 space-y-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="w-24 h-24 mx-auto relative flex items-center justify-center"
                  >
                    <Image
                      src="/images/aeterna_pixel_prism.png"
                      alt="Prism Relic"
                      width={96}
                      height={96}
                      className="relative z-10 border-2 border-brand-gold rounded-2xl bg-brand-gold/10 p-2 shadow-[0_0_40px_rgba(212,175,55,0.4)]"
                    />
                  </motion.div>

                  <div>
                    <h2 className="font-serif text-3xl md:text-4xl text-brand-ink dark:text-white font-bold mb-3">
                      {currentMeta.label} Asimilada
                    </h2>
                    <p className="text-brand-ink/70 dark:text-brand-muted text-sm max-w-md mx-auto italic font-serif">
                      Has completado todos los hitos y hallazgos de física en esta capa.
                    </p>
                  </div>

                  <div className="flex justify-center items-center gap-6 py-2">
                    <div className="bg-black/5 dark:bg-white/5 border border-brand-gold/30 px-6 py-4 rounded-2xl text-center">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#8B6914] dark:text-brand-muted block mb-1">Capas Completadas</span>
                      <span className="text-2xl font-mono font-bold text-brand-gold">{completedLayerCount}</span>
                    </div>
                    <div className="bg-black/5 dark:bg-white/5 border border-brand-gold/30 px-6 py-4 rounded-2xl text-center">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#8B6914] dark:text-brand-muted block mb-1">Dominio</span>
                      <span className="text-2xl font-mono font-bold text-emerald-600 dark:text-emerald-400">100%</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-center gap-4 pt-4">
                    {nextArticle && (
                      <Link
                        href={nextArticle.href}
                        className="inline-flex items-center gap-3 px-8 py-4 bg-emerald-600 text-white font-bold text-xs uppercase tracking-[0.3em] rounded-xl hover:bg-emerald-700 transition-all shadow-xl group"
                      >
                        <span className="flex flex-col items-start text-left">
                          <span className="text-[9px] font-mono opacity-80 tracking-[0.35em]">Siguiente Parada</span>
                          <span className="font-serif normal-case tracking-normal text-sm italic max-w-[220px] line-clamp-1">{nextArticle.title}</span>
                        </span>
                        <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
                      </Link>
                    )}
                    {currentLevel === 'principiante' && availableLevels.includes('intermedio') && (
                      <button
                        onClick={() => changeLevel('intermedio')}
                        className="inline-flex items-center gap-3 px-8 py-4 bg-brand-gold text-brand-ink font-bold text-xs uppercase tracking-[0.3em] rounded-xl hover:bg-black hover:text-brand-gold transition-all shadow-xl"
                      >
                        <span>Avanzar a Capa II: Exégesis →</span>
                      </button>
                    )}
                    {currentLevel === 'intermedio' && availableLevels.includes('avanzado') && (
                      <button
                        onClick={() => changeLevel('avanzado')}
                        className="inline-flex items-center gap-3 px-8 py-4 bg-brand-gold text-brand-ink font-bold text-xs uppercase tracking-[0.3em] rounded-xl hover:bg-black hover:text-brand-gold transition-all shadow-xl"
                      >
                        <span>Avanzar a Capa III: Frontera →</span>
                      </button>
                    )}
                    <Link
                      href="/guias"
                      className="inline-flex items-center gap-3 px-8 py-4 bg-black/10 dark:bg-white/10 text-brand-ink dark:text-white font-bold text-xs uppercase tracking-[0.3em] rounded-xl hover:bg-black/20 dark:hover:bg-white/20 transition-all border border-black/10 dark:border-white/10"
                    >
                      <span>Volver al Nexo de Guías</span>
                    </Link>
                  </div>
                </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="sticky bottom-0 z-50 bg-[#FAF8F5]/95 dark:bg-[#0F0F12]/95 backdrop-blur-2xl border-t border-brand-gold/20 px-8 py-5 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={isIntro}
            className={cn(
              "px-6 py-3 rounded-xl border text-xs font-mono font-bold uppercase tracking-widest transition-all flex items-center gap-2",
              isIntro
                ? "opacity-20 border-black/5 dark:border-white/5 text-brand-ink/40 dark:text-brand-muted cursor-not-allowed"
                : "border-brand-gold/30 bg-white dark:bg-white/5 text-brand-ink dark:text-white hover:bg-brand-gold/10"
            )}
          >
            <ChevronLeft size={16} />
            <span>Anterior</span>
          </button>

          <div className="hidden md:flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-[#8B6914] dark:text-brand-muted/70">
            <span>Navega con:</span>
            <kbd className="bg-brand-gold/20 text-[#8B6914] dark:text-brand-gold px-2 py-1 rounded font-bold border border-brand-gold/30">↵ Enter</kbd>
            <span>o</span>
            <kbd className="bg-brand-gold/20 text-[#8B6914] dark:text-brand-gold px-2 py-1 rounded font-bold border border-brand-gold/30">→</kbd>
          </div>

          {!isCompletion ? (
            <button
              onClick={handleNext}
              className="px-8 py-3.5 bg-brand-gold text-brand-ink font-mono font-black text-xs uppercase tracking-[0.3em] rounded-xl hover:bg-black hover:text-brand-gold transition-all shadow-[0_0_25px_rgba(212,175,55,0.3)] flex items-center gap-3 group"
            >
              <span>{isIntro ? "Comenzar Hitos" : "Continuar Hito"}</span>
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          ) : (
            <button
              onClick={() => setCurrentStep(0)}
              className="px-6 py-3 rounded-xl border border-brand-gold/40 text-brand-gold text-xs font-mono font-bold uppercase tracking-widest hover:bg-brand-gold hover:text-brand-ink transition-all flex items-center gap-2"
            >
              <RotateCcw size={16} />
              <span>Repasar Capa</span>
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}
