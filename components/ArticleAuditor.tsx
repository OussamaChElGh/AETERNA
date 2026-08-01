'use client';
import React, { useState, useCallback } from "react";
import {
  motion, AnimatePresence
} from "motion/react";
import {
  BrainCircuit, ShieldCheck, BookOpen, Lightbulb, Zap,
  Target, Layers, Eye, Compass, Award, AlertTriangle,
  CheckCircle2, XCircle, TrendingUp, List, ArrowRight,
  Atom, Feather, Clock, ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ArticleOption {
  slug: string;
  title: string;
}

interface Props {
  articles: ArticleOption[];
}

const DIMENSION_META: Record<string, { label: string; max: number; icon: any; color: string; desc: string }> = {
  rigorAcademico: { label: "Rigor Académico", max: 20, icon: BookOpen, color: "text-blue-600 dark:text-blue-400", desc: "Profundidad teórica, fórmulas, fuentes" },
  estructuraPedagogica: { label: "Estructura Pedagógica", max: 20, icon: Layers, color: "text-emerald-600 dark:text-emerald-400", desc: "Capas, secciones, navegación" },
  practica: { label: "Práctica", max: 20, icon: Target, color: "text-amber-600 dark:text-amber-400", desc: "Ejercicios, distribución por capas" },
  razonamiento: { label: "Razonamiento", max: 15, icon: BrainCircuit, color: "text-purple-600 dark:text-purple-400", desc: "Análisis, justificación, pensamiento crítico" },
  interactividad: { label: "Interactividad", max: 10, icon: Zap, color: "text-orange-600 dark:text-orange-400", desc: "Componentes interactivos, laboratorios" },
  conexiones: { label: "Conexiones", max: 10, icon: Feather, color: "text-rose-600 dark:text-rose-400", desc: "Transdisciplina, transferencia" },
  experienciaAeterna: { label: "Experiencia Aeterna", max: 5, icon: Compass, color: "text-cyan-600 dark:text-cyan-400", desc: "Bloques pedagógicos, narrativa" },
};

const STATUS_META: Record<string, { label: string; color: string; bg: string }> = {
  EXCELENTE: { label: "Excelente", color: "text-emerald-700 dark:text-emerald-300", bg: "bg-emerald-100 dark:bg-emerald-900/30 border-emerald-400" },
  BUENO: { label: "Bueno", color: "text-blue-700 dark:text-blue-300", bg: "bg-blue-100 dark:bg-blue-900/30 border-blue-400" },
  NECESITA_REVISION: { label: "Necesita Revisión", color: "text-amber-700 dark:text-amber-300", bg: "bg-amber-100 dark:bg-amber-900/30 border-amber-400" },
  DEBIL: { label: "Débil", color: "text-orange-700 dark:text-orange-300", bg: "bg-orange-100 dark:bg-orange-900/30 border-orange-400" },
  NO_APROBADO: { label: "No Aprobado", color: "text-red-700 dark:text-red-300", bg: "bg-red-100 dark:bg-red-900/30 border-red-400" },
};

function CircularScore({ score, size = 160 }: { score: number; size?: number }) {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" strokeWidth={strokeWidth} className="text-black/5 dark:text-white/10" />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className="text-brand-gold transition-all duration-1000" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-mono font-black text-brand-ink dark:text-white">{score}</span>
        <span className="text-[10px] font-mono uppercase tracking-widest text-brand-ink/50 dark:text-brand-offwhite/50">/100</span>
      </div>
    </div>
  );
}

function ScoreBar({ label, score, max, icon: Icon, color, desc }: { label: string; score: number; max: number; icon: any; color: string; desc: string }) {
  const pct = Math.round((score / max) * 100);
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <Icon size={14} className={cn("shrink-0", color)} />
          <span className="text-xs font-mono font-bold text-brand-ink dark:text-brand-offwhite truncate">{label}</span>
        </div>
        <span className="text-xs font-mono font-black text-brand-ink dark:text-white shrink-0 ml-2">{score}/{max}</span>
      </div>
      <div className="relative w-full h-2 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className={cn("h-full rounded-full", pct >= 80 ? "bg-emerald-500" : pct >= 60 ? "bg-amber-500" : "bg-red-500")}
        />
      </div>
      <p className="text-[10px] font-mono text-brand-ink/40 dark:text-brand-offwhite/40">{desc}</p>
    </div>
  );
}

interface AuditReport {
  timestamp: string;
  filePath: string;
  articleTitle: string;
  profile: string;
  discipline: string;
  structurePass: boolean;
  layerStatus: { inicio: boolean; intermedio: boolean; avanzado: boolean };
  scores: {
    rigorAcademico: number;
    estructuraPedagogica: number;
    practica: number;
    razonamiento: number;
    interactividad: number;
    conexiones: number;
    experienciaAeterna: number;
  };
  totalScore: number;
  appliedScoreCap?: { cap: number; reason: string };
  status: string;
  qualityGatesPassed: boolean;
  criticalFailures: { ruleId: string; critical: boolean; message: string }[];
  warnings: string[];
  recommendations: string[];
  crossDimensionInterventions: {
    category: string;
    title: string;
    missingItem: string;
    recommendedIntervention: string;
    rationale: string;
    priorityLevel: string;
    type: string;
    why: string[];
  }[];
  contentDepthAnalysis: { coverageScore: number; depthScore: number; academicRigorScore: number };
  structureAnalysis: { articleStructureScore: number; layerDistributionScore: number; navigationScore: number };
  practiceEvaluation: {
    totalPracticeScore: number;
    quantity: { score: number };
    layerDistribution: { score: number };
    difficultyProgression: { score: number };
    cognitiveVariety: { score: number };
    competencyCoverage: { score: number };
  };
  interactiveAnalysis: {
    potential: number;
    breakdown?: { overall: number; meaningfulCoverage: number; activityDiversity: number; interactionDepth: number; manipulation: number; feedbackQuality: number; explanation?: string };
  };
  reasoningAnalysis: { contentScore: number; practiceScore: number; weightedScore: number };
  visualAnalysis: { visualCoverageScore: number; pedagogicalVisualsScore: number; imageAccessibilityScore: number };
  discoverabilityAnalysis: { technicalSeoScore: number; semanticCoverageScore: number; searchIntentScore: number };
  aeternaExperienceResult: { connectionsScore: number; experienceScore: number };
  knowledgeBenchmarkResult?: {
    topicProfile: { topic: string };
    referenceConfidence: string;
    sourcesCount: number;
    sourceQualityScore: number;
    coreConceptCoverageScore: number;
    importantRelationshipCoverageScore: number;
    representationCoverageScore: number;
    misconceptionCoverageScore: number;
    referenceAlignmentScore: number;
    academicCorrectnessScore: number;
    aeternaAddedValue: string;
    addedValueReasons: string[];
    conceptDetails: { concept: string; importance: string; status: string; detectionMode: string; explicitTerminology: string }[];
    gaps: { concept: string; importance: string; scope: string; status: string; reason: string; evidenceFromReferences: string[] }[];
    sequencingIssues: { severity: string; message: string }[];
    sourceTransparency: { sourceName: string; tier: string; authority: number; supportsAspect: string }[];
  };
  exercisesPerLayer: { inicio: number; intermedio: number; avanzado: number; general: number };
  totalExercises: number;
  interactiveDetected: boolean;
  interactiveRecommendation: string;
}

export function ArticleAuditor({ articles }: Props) {
  const [selectedSlug, setSelectedSlug] = useState("");
  const [report, setReport] = useState<AuditReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showGates, setShowGates] = useState(false);
  const [showInterventions, setShowInterventions] = useState(false);
  const [showBenchmark, setShowBenchmark] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const runAudit = useCallback(async () => {
    if (!selectedSlug) return;
    setLoading(true);
    setError("");
    setReport(null);
    try {
      const res = await fetch("/api/audit-article", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: selectedSlug }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al auditar");
      setReport(data.report);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [selectedSlug]);

  const r = report;

  return (
    <div className="max-w-5xl mx-auto px-6 py-24">
      <header className="mb-16 text-center">
        <div className="inline-flex items-center gap-3 text-[10px] font-mono font-bold uppercase tracking-[0.6em] text-[#8B6914] dark:text-brand-gold mb-6">
          <BrainCircuit size={16} />
          <span>Framework de Aprendizaje Aeterna</span>
        </div>
        <h1 className="font-serif text-4xl md:text-5xl text-brand-ink dark:text-white font-bold tracking-tight mb-4">
          Auditor de Calidad
        </h1>
        <p className="text-brand-ink/60 dark:text-brand-offwhite/60 text-lg font-serif italic max-w-xl mx-auto">
          Evalúa la solidez pedagógica, interactividad y rigor académico de cada artículo
        </p>
      </header>

      <div className="bg-white dark:bg-[#16161B] border border-black/5 dark:border-white/10 rounded-3xl p-8 shadow-sm mb-12">
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-[#8B6914] dark:text-brand-gold mb-3">
              Seleccionar Artículo
            </label>
            <div className="relative">
              <select
                value={selectedSlug}
                onChange={e => setSelectedSlug(e.target.value)}
                className="w-full appearance-none bg-[#FDFBF7] dark:bg-[#0F0F12] border border-black/10 dark:border-white/10 rounded-xl px-4 py-3.5 pr-10 text-sm font-serif text-brand-ink dark:text-brand-offwhite focus:outline-none focus:border-brand-gold transition-colors"
              >
                <option value="">— Escoge un artículo —</option>
                {articles.map(a => (
                  <option key={a.slug} value={a.slug}>{a.title}</option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-ink/40 dark:text-brand-offwhite/40 pointer-events-none" />
            </div>
          </div>
          <button
            onClick={runAudit}
            disabled={!selectedSlug || loading}
            className={cn(
              "flex items-center gap-2 px-8 py-3.5 rounded-xl font-mono font-bold text-xs uppercase tracking-[0.2em] transition-all shrink-0",
              selectedSlug && !loading
                ? "bg-brand-gold text-brand-ink hover:bg-black hover:text-brand-gold shadow-lg"
                : "bg-black/5 dark:bg-white/5 text-brand-ink/30 dark:text-brand-offwhite/30 cursor-not-allowed"
            )}
          >
            {loading ? (
              <><div className="w-4 h-4 border-2 border-brand-ink/30 border-t-brand-ink rounded-full animate-spin" /> Auditando...</>
            ) : (
              <><ShieldCheck size={16} /> Auditar</>
            )}
          </button>
        </div>
      </div>

      {error && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 mb-8 flex items-start gap-4">
          <AlertTriangle size={20} className="text-red-500 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-mono font-bold text-xs uppercase tracking-widest text-red-700 dark:text-red-400 mb-1">Error de Auditoría</h3>
            <p className="text-sm text-red-600 dark:text-red-300">{error}</p>
          </div>
        </motion.div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-32 gap-6">
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
            <BrainCircuit size={48} className="text-brand-gold" />
          </motion.div>
          <p className="text-sm font-mono font-bold uppercase tracking-[0.3em] text-[#8B6914] dark:text-brand-gold animate-pulse">Analizando artículo...</p>
        </div>
      )}

      <AnimatePresence>
        {r && !loading && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
            {/* Score + Status Header */}
            <div className="bg-white dark:bg-[#16161B] border border-black/5 dark:border-white/10 rounded-3xl p-8 md:p-12 shadow-sm">
              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
                <div className="flex flex-col items-center">
                  <CircularScore score={r.totalScore} />
                  <div className={cn("mt-4 px-5 py-2 rounded-full border text-[10px] font-mono font-bold uppercase tracking-[0.3em]", STATUS_META[r.status]?.bg, STATUS_META[r.status]?.color)}>
                    {STATUS_META[r.status]?.label || r.status}
                  </div>
                  {r.appliedScoreCap && (
                    <p className="mt-2 text-[10px] font-mono text-amber-600 dark:text-amber-400 text-center">
                      Cap: {r.appliedScoreCap.cap}/100 — {r.appliedScoreCap.reason}
                    </p>
                  )}
                </div>
                <div className="flex-1 space-y-4 w-full">
                  <div>
                    <h2 className="font-serif text-2xl md:text-3xl text-brand-ink dark:text-white font-bold mb-1">{r.articleTitle}</h2>
                    <div className="flex flex-wrap gap-3 text-[10px] font-mono uppercase tracking-widest text-brand-ink/50 dark:text-brand-offwhite/50">
                      <span>{r.profile}</span>
                      <span>•</span>
                      <span>{r.discipline}</span>
                      <span>•</span>
                      <span>{r.totalExercises} ejercicios</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <div className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[10px] font-mono font-bold uppercase tracking-wider", r.qualityGatesPassed ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300" : "border-red-400 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300")}>
                      {r.qualityGatesPassed ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                      <span>Compuertas de Calidad: {r.qualityGatesPassed ? "APROBADO" : "FALLÓ"}</span>
                    </div>
                    <div className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[10px] font-mono font-bold uppercase tracking-wider", r.structurePass ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300" : "border-red-400 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300")}>
                      {r.structurePass ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                      <span>Estructura: {r.structurePass ? "VÁLIDA" : "INVÁLIDA"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 7 Dimension Scores */}
            <div className="bg-white dark:bg-[#16161B] border border-black/5 dark:border-white/10 rounded-3xl p-8 md:p-12 shadow-sm">
              <h3 className="font-serif text-xl text-brand-ink dark:text-white font-bold mb-8 flex items-center gap-3">
                <Award size={20} className="text-brand-gold" />
                Puntuación por Dimensión
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {Object.entries(DIMENSION_META).map(([key, meta]) => (
                  <ScoreBar key={key} label={meta.label} score={(r.scores as any)[key] || 0} max={meta.max} icon={meta.icon} color={meta.color} desc={meta.desc} />
                ))}
              </div>
            </div>

            {/* Score Breakdown */}
            <div className="bg-white dark:bg-[#16161B] border border-black/5 dark:border-white/10 rounded-3xl p-8 md:p-12 shadow-sm">
              <button onClick={() => setShowDetails(!showDetails)} className="w-full flex items-center justify-between">
                <h3 className="font-serif text-xl text-brand-ink dark:text-white font-bold flex items-center gap-3">
                  <List size={20} className="text-brand-gold" />
                  Desglose Detallado
                </h3>
                <ChevronDown size={18} className={cn("text-brand-ink/40 dark:text-brand-offwhite/40 transition-transform", showDetails && "rotate-180")} />
              </button>
              <AnimatePresence>
                {showDetails && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="pt-8 space-y-12">
                      {/* Structure */}
                      <SectionCard title="Estructura" icon={Layers}>
                        <Row label="Puntuación estructura" value={r.structureAnalysis.articleStructureScore} max={100} />
                        <Row label="Distribución capas" value={r.structureAnalysis.layerDistributionScore} max={100} />
                        <Row label="Navegación" value={r.structureAnalysis.navigationScore} max={100} />
                        <div className="flex flex-wrap gap-3 mt-4">
                          {Object.entries(r.layerStatus).map(([layer, ok]) => (
                            <span key={layer} className={cn("flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border", ok ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300" : "border-red-400 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300")}>
                              {ok ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                              {layer}
                            </span>
                          ))}
                        </div>
                      </SectionCard>

                      {/* Content Depth */}
                      <SectionCard title="Contenido" icon={BookOpen}>
                        <Row label="Cobertura" value={r.contentDepthAnalysis.coverageScore} max={100} />
                        <Row label="Profundidad" value={r.contentDepthAnalysis.depthScore} max={100} />
                        <Row label="Rigor académico" value={r.contentDepthAnalysis.academicRigorScore} max={100} />
                      </SectionCard>

                      {/* Practice */}
                      <SectionCard title="Práctica" icon={Target}>
                        <Row label="Cantidad" value={r.practiceEvaluation.quantity.score} max={100} />
                        <Row label="Distribución capas" value={r.practiceEvaluation.layerDistribution.score} max={100} />
                        <Row label="Progresión dificultad" value={r.practiceEvaluation.difficultyProgression.score} max={100} />
                        <Row label="Variedad cognitiva" value={r.practiceEvaluation.cognitiveVariety.score} max={100} />
                        <Row label="Cobertura competencias" value={r.practiceEvaluation.competencyCoverage.score} max={100} />
                        <div className="flex flex-wrap gap-2 mt-4 text-[10px] font-mono text-brand-ink/50 dark:text-brand-offwhite/50">
                          <span>Por capa: inicio={r.exercisesPerLayer.inicio} intermedio={r.exercisesPerLayer.intermedio} avanzado={r.exercisesPerLayer.avanzado} general={r.exercisesPerLayer.general}</span>
                        </div>
                      </SectionCard>

                      {/* Reasoning */}
                      <SectionCard title="Razonamiento" icon={BrainCircuit}>
                        <Row label="Contenido" value={r.reasoningAnalysis.contentScore} max={100} />
                        <Row label="Práctica" value={r.reasoningAnalysis.practiceScore} max={100} />
                        <Row label="Ponderado" value={Math.round(r.reasoningAnalysis.weightedScore * 6.67)} max={100} />
                      </SectionCard>

                      {/* Interactive */}
                      <SectionCard title="Interactividad" icon={Zap}>
                        <Row label="Potencial" value={r.interactiveAnalysis.potential * 20} max={100} />
                        {r.interactiveAnalysis.breakdown && (
                          <>
                            <Row label="Global" value={r.interactiveAnalysis.breakdown.overall} max={100} />
                            <Row label="Cobertura significativa" value={r.interactiveAnalysis.breakdown.meaningfulCoverage} max={100} />
                            <Row label="Diversidad actividades" value={r.interactiveAnalysis.breakdown.activityDiversity} max={100} />
                            <Row label="Profundidad interacción" value={r.interactiveAnalysis.breakdown.interactionDepth} max={100} />
                            <Row label="Manipulación" value={r.interactiveAnalysis.breakdown.manipulation} max={100} />
                            <Row label="Calidad feedback" value={r.interactiveAnalysis.breakdown.feedbackQuality} max={100} />
                            {r.interactiveAnalysis.breakdown.explanation && (
                              <p className="text-xs font-serif italic text-brand-ink/60 dark:text-brand-offwhite/60 mt-2">"{r.interactiveAnalysis.breakdown.explanation}"</p>
                            )}
                          </>
                        )}
                        <div className={cn("flex items-center gap-1.5 mt-4 text-[10px] font-mono font-bold uppercase tracking-wider", r.interactiveDetected ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400")}>
                          {r.interactiveDetected ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
                          {r.interactiveDetected ? "Interactivos detectados" : "Sin interactivos detectados"}
                        </div>
                        <p className="text-[10px] font-mono text-brand-ink/40 dark:text-brand-offwhite/40 mt-1">{r.interactiveRecommendation}</p>
                      </SectionCard>

                      {/* Visual */}
                      <SectionCard title="Visual" icon={Eye}>
                        <Row label="Cobertura visual" value={r.visualAnalysis.visualCoverageScore} max={100} />
                        <Row label="Visuales pedagógicos" value={r.visualAnalysis.pedagogicalVisualsScore} max={100} />
                        <Row label="Accesibilidad imágenes" value={r.visualAnalysis.imageAccessibilityScore} max={100} />
                      </SectionCard>

                      {/* Discoverability */}
                      <SectionCard title="Descubribilidad" icon={Compass}>
                        <Row label="SEO técnico" value={r.discoverabilityAnalysis.technicalSeoScore} max={100} />
                        <Row label="Cobertura semántica" value={r.discoverabilityAnalysis.semanticCoverageScore} max={100} />
                        <Row label="Intención de búsqueda" value={r.discoverabilityAnalysis.searchIntentScore} max={100} />
                      </SectionCard>

                      {/* Aeterna Experience */}
                      <SectionCard title="Experiencia Aeterna" icon={Compass}>
                        <Row label="Conexiones" value={r.aeternaExperienceResult.connectionsScore} max={100} />
                        <Row label="Experiencia" value={r.aeternaExperienceResult.experienceScore} max={100} />
                      </SectionCard>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Quality Gates */}
            <div className="bg-white dark:bg-[#16161B] border border-black/5 dark:border-white/10 rounded-3xl p-8 md:p-12 shadow-sm">
              <button onClick={() => setShowGates(!showGates)} className="w-full flex items-center justify-between">
                <h3 className="font-serif text-xl text-brand-ink dark:text-white font-bold flex items-center gap-3">
                  <ShieldCheck size={20} className="text-brand-gold" />
                  Compuertas de Calidad
                  <span className={cn("text-[10px] font-mono px-3 py-1 rounded-full border", r.qualityGatesPassed ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300" : "border-red-400 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300")}>
                    {r.qualityGatesPassed ? "APROBADO" : "FALLÓ"}
                  </span>
                </h3>
                <ChevronDown size={18} className={cn("text-brand-ink/40 dark:text-brand-offwhite/40 transition-transform", showGates && "rotate-180")} />
              </button>
              <AnimatePresence>
                {showGates && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="pt-8 space-y-4">
                      {r.criticalFailures.length === 0 && r.warnings.length === 0 && (
                        <p className="text-sm font-serif italic text-brand-ink/60 dark:text-brand-offwhite/60">No se detectaron fallos críticos ni advertencias.</p>
                      )}
                      {r.criticalFailures.length > 0 && (
                        <div>
                          <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-red-600 dark:text-red-400 mb-3">Fallos Críticos ({r.criticalFailures.length})</h4>
                          <div className="space-y-2">
                            {r.criticalFailures.map((f, i) => (
                              <div key={i} className="flex items-start gap-3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-xl p-4">
                                <XCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                                <div>
                                  <span className="text-[10px] font-mono font-bold text-red-700 dark:text-red-400">{f.ruleId}</span>
                                  <p className="text-xs text-red-600 dark:text-red-300">{f.message}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {r.warnings.length > 0 && (
                        <div>
                          <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-3 mt-6">Advertencias ({r.warnings.length})</h4>
                          <div className="space-y-2">
                            {r.warnings.map((w, i) => (
                              <div key={i} className="flex items-start gap-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                                <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" />
                                <p className="text-xs text-amber-700 dark:text-amber-300">{w}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Interventions */}
            {r.crossDimensionInterventions.length > 0 && (
              <div className="bg-white dark:bg-[#16161B] border border-black/5 dark:border-white/10 rounded-3xl p-8 md:p-12 shadow-sm">
                <button onClick={() => setShowInterventions(!showInterventions)} className="w-full flex items-center justify-between">
                  <h3 className="font-serif text-xl text-brand-ink dark:text-white font-bold flex items-center gap-3">
                    <TrendingUp size={20} className="text-brand-gold" />
                    Plan de Mejora Priorizado
                    <span className="text-[10px] font-mono text-brand-ink/40 dark:text-brand-offwhite/40">({r.crossDimensionInterventions.length} items)</span>
                  </h3>
                  <ChevronDown size={18} className={cn("text-brand-ink/40 dark:text-brand-offwhite/40 transition-transform", showInterventions && "rotate-180")} />
                </button>
                <AnimatePresence>
                  {showInterventions && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="pt-8 space-y-4">
                        {r.crossDimensionInterventions.map((inv, i) => (
                          <div key={i} className="border border-black/5 dark:border-white/10 rounded-2xl p-6 space-y-3">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-center gap-3 min-w-0">
                                <span className={cn(
                                  "w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-mono font-black shrink-0",
                                  inv.priorityLevel === "HIGH" ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300" :
                                  inv.priorityLevel === "MEDIUM" ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300" :
                                  "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                                )}>
                                  {i + 1}
                                </span>
                                <div className="min-w-0">
                                  <h4 className="text-sm font-mono font-bold text-brand-ink dark:text-white">{inv.title}</h4>
                                  <div className="flex flex-wrap gap-2 mt-1">
                                    <span className="text-[9px] font-mono uppercase tracking-wider text-brand-ink/40 dark:text-brand-offwhite/40 bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded">{inv.category}</span>
                                    <span className={cn(
                                      "text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded",
                                      inv.priorityLevel === "HIGH" ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300" :
                                      inv.priorityLevel === "MEDIUM" ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300" :
                                      "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                                    )}>
                                      {inv.priorityLevel}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <p className="text-xs text-brand-ink/70 dark:text-brand-offwhite/70 font-serif italic leading-relaxed">
                              <span className="font-mono font-bold not-italic text-[10px] uppercase tracking-wider text-brand-ink/50 dark:text-brand-offwhite/50">Falta: </span>
                              {inv.missingItem}
                            </p>
                            <div className="bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/10 rounded-xl p-4">
                              <p className="text-xs text-brand-ink dark:text-brand-offwhite leading-relaxed">
                                <span className="font-mono font-bold text-[10px] uppercase tracking-wider text-brand-gold">Intervención: </span>
                                {inv.recommendedIntervention}
                              </p>
                            </div>
                            <p className="text-[11px] text-brand-ink/50 dark:text-brand-offwhite/50 font-serif italic">{inv.rationale}</p>
                            {inv.why.length > 0 && (
                              <ul className="space-y-1">
                                {inv.why.map((w, j) => (
                                  <li key={j} className="flex items-start gap-2 text-[11px] text-brand-ink/60 dark:text-brand-offwhite/60">
                                    <ArrowRight size={10} className="text-brand-gold shrink-0 mt-1" />
                                    <span>{w}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Knowledge Benchmark */}
            {r.knowledgeBenchmarkResult && (
              <div className="bg-white dark:bg-[#16161B] border border-black/5 dark:border-white/10 rounded-3xl p-8 md:p-12 shadow-sm">
                <button onClick={() => setShowBenchmark(!showBenchmark)} className="w-full flex items-center justify-between">
                  <h3 className="font-serif text-xl text-brand-ink dark:text-white font-bold flex items-center gap-3">
                    <Atom size={20} className="text-brand-gold" />
                    Benchmark de Conocimiento
                    <span className="text-[10px] font-mono text-brand-ink/40 dark:text-brand-offwhite/40">({r.knowledgeBenchmarkResult.topicProfile.topic})</span>
                  </h3>
                  <ChevronDown size={18} className={cn("text-brand-ink/40 dark:text-brand-offwhite/40 transition-transform", showBenchmark && "rotate-180")} />
                </button>
                <AnimatePresence>
                  {showBenchmark && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="pt-8 space-y-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <MiniStat label="Cobertura conceptos" value={`${r.knowledgeBenchmarkResult.coreConceptCoverageScore}%`} />
                          <MiniStat label="Relaciones" value={`${r.knowledgeBenchmarkResult.importantRelationshipCoverageScore}%`} />
                          <MiniStat label="Representaciones" value={`${r.knowledgeBenchmarkResult.representationCoverageScore}%`} />
                          <MiniStat label="Misconcepciones" value={`${r.knowledgeBenchmarkResult.misconceptionCoverageScore}%`} />
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <MiniStat label="Alineación referencia" value={`${r.knowledgeBenchmarkResult.referenceAlignmentScore}/100`} />
                          <MiniStat label="Corrección académica" value={`${r.knowledgeBenchmarkResult.academicCorrectnessScore}/100`} />
                          <MiniStat label="Calidad fuentes" value={`${r.knowledgeBenchmarkResult.sourceQualityScore}/100`} />
                          <MiniStat label="Fuentes evaluadas" value={`${r.knowledgeBenchmarkResult.sourcesCount}`} />
                        </div>

                        <div className="bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/10 rounded-xl p-5">
                          <p className="text-xs font-serif italic text-brand-ink/70 dark:text-brand-offwhite/70 leading-relaxed">{r.knowledgeBenchmarkResult.aeternaAddedValue}</p>
                          {r.knowledgeBenchmarkResult.addedValueReasons.length > 0 && (
                            <ul className="mt-3 space-y-1">
                              {r.knowledgeBenchmarkResult.addedValueReasons.map((r, i) => (
                                <li key={i} className="flex items-start gap-2 text-[11px] text-brand-ink/60 dark:text-brand-offwhite/60">
                                  <ArrowRight size={10} className="text-brand-gold shrink-0 mt-1" />
                                  <span>{r}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>

                        {/* Concept Details */}
                        {r.knowledgeBenchmarkResult.conceptDetails.length > 0 && (
                          <div>
                            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-brand-ink/60 dark:text-brand-offwhite/60 mb-3">Detalle de Conceptos</h4>
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                              {r.knowledgeBenchmarkResult.conceptDetails.map((cd, i) => (
                                <div key={i} className="flex items-center justify-between bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/10 rounded-xl p-3">
                                  <div className="min-w-0 flex-1">
                                    <span className="text-xs font-serif text-brand-ink dark:text-brand-offwhite">{cd.concept}</span>
                                    <span className={cn("ml-2 text-[9px] font-mono uppercase px-2 py-0.5 rounded", cd.importance === "HIGH" ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300" : "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300")}>
                                      {cd.importance}
                                    </span>
                                  </div>
                                  <span className={cn("text-[10px] font-mono font-bold shrink-0 ml-3", cd.status === "COVERED" ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400")}>
                                    {cd.status}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Gaps */}
                        {r.knowledgeBenchmarkResult.gaps.length > 0 && (
                          <div>
                            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-red-600 dark:text-red-400 mb-3">Brechas de Conocimiento ({r.knowledgeBenchmarkResult.gaps.length})</h4>
                            <div className="space-y-2">
                              {r.knowledgeBenchmarkResult.gaps.map((g, i) => (
                                <div key={i} className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-xl p-4">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-mono font-bold text-red-700 dark:text-red-400">{g.concept}</span>
                                    <span className={cn("text-[9px] font-mono uppercase px-2 py-0.5 rounded", g.importance === "HIGH" ? "bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200" : "bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200")}>
                                      {g.importance}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-red-600 dark:text-red-300">{g.reason}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Source Transparency */}
                        {r.knowledgeBenchmarkResult.sourceTransparency.length > 0 && (
                          <div>
                            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-brand-ink/60 dark:text-brand-offwhite/60 mb-3">Transparencia de Fuentes</h4>
                            <div className="space-y-2">
                              {r.knowledgeBenchmarkResult.sourceTransparency.map((st, i) => (
                                <div key={i} className="flex items-center justify-between bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/10 rounded-xl p-3">
                                  <div className="min-w-0 flex-1">
                                    <span className="text-xs font-serif text-brand-ink dark:text-brand-offwhite">{st.sourceName}</span>
                                    <span className="ml-2 text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">{st.tier}</span>
                                  </div>
                                  <span className="text-[10px] font-mono font-bold text-brand-ink/50 dark:text-brand-offwhite/50 shrink-0 ml-3">Autoridad: {st.authority}/100</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Recommendations */}
            {r.recommendations.length > 0 && (
              <div className="bg-white dark:bg-[#16161B] border border-black/5 dark:border-white/10 rounded-3xl p-8 md:p-12 shadow-sm">
                <h3 className="font-serif text-xl text-brand-ink dark:text-white font-bold flex items-center gap-3 mb-6">
                  <Lightbulb size={20} className="text-brand-gold" />
                  Recomendaciones
                </h3>
                <ul className="space-y-3">
                  {r.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-brand-ink/70 dark:text-brand-offwhite/70 font-serif italic">
                      <span className="w-5 h-5 rounded-full bg-brand-gold/20 text-[10px] font-mono font-bold flex items-center justify-center text-brand-gold shrink-0 mt-0.5">{i + 1}</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SectionCard({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-[#8B6914] dark:text-brand-gold mb-4 pb-2 border-b border-black/5 dark:border-white/10">
        <Icon size={14} />
        {title}
      </h4>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
}

function Row({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs font-serif text-brand-ink/70 dark:text-brand-offwhite/70">{label}</span>
      <div className="flex items-center gap-3">
        <div className="w-24 h-1.5 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
          <div className={cn("h-full rounded-full", pct >= 80 ? "bg-emerald-500" : pct >= 60 ? "bg-amber-500" : "bg-red-500")} style={{ width: `${pct}%` }} />
        </div>
        <span className="text-xs font-mono font-bold text-brand-ink dark:text-white w-16 text-right">{value}/{max}</span>
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/10 rounded-xl p-4 text-center">
      <p className="text-lg font-mono font-black text-brand-ink dark:text-white">{value}</p>
      <p className="text-[9px] font-mono uppercase tracking-wider text-brand-ink/50 dark:text-brand-offwhite/50 mt-1">{label}</p>
    </div>
  );
}
