'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { GitCommit, ArrowRight, CheckCircle2, XCircle, Sparkles, RefreshCw, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGamification } from '@/context/GamificationContext';
import { useExerciseFeedback } from '@/lib/useExerciseFeedback';

export interface CausalNode {
  id: string;
  text: string;
}

export interface CausalEdge {
  causeId: string;
  effectId: string;
}

export interface CausalMapProps {
  id?: string;
  title?: string;
  badgeText?: string;
  description?: string;
  nodes: CausalNode[];
  validEdges: CausalEdge[];
  explanation?: string;
  xp?: number;
  content?: string;
  className?: string;
}

export function CausalMap({
  id,
  title = "Mapa de Cadenas Causales (Causa y Consecuencia)",
  badgeText = "RAZONAMIENTO CAUSAL: ¿QUÉ PROVOCA QUÉ?",
  description,
  nodes = [],
  validEdges = [],
  explanation,
  xp = 65,
  content,
  className
}: CausalMapProps) {
  const { markQuestionAnswered, hasAnsweredQuestion } = useGamification();
  const { feedbackRef, trigger, fxClass } = useExerciseFeedback();

  let parsedTitle = title;
  let parsedDesc = description || '';
  let parsedExplanation = explanation || '';
  let parsedNodes: CausalNode[] = nodes;
  let parsedValidEdges: CausalEdge[] = validEdges;
  let parsedXp = xp;

  if (content && content.trim()) {
    const lines = content.split('\n');
    const nodeList: CausalNode[] = [];
    const edgeList: CausalEdge[] = [];

    lines.forEach(l => {
      const line = l.trim();
      if (line.startsWith('TITLE:')) parsedTitle = line.replace('TITLE:', '').trim();
      else if (line.startsWith('DESC:')) parsedDesc = line.replace('DESC:', '').trim();
      else if (line.startsWith('EXPLANATION:')) parsedExplanation = line.replace('EXPLANATION:', '').trim();
      else if (line.startsWith('XP:')) parsedXp = parseInt(line.replace('XP:', '').trim(), 10) || 65;
      else if (line.startsWith('NODE:')) {
        const parts = line.replace('NODE:', '').split('|').map(s => s.trim());
        if (parts.length >= 2) {
          nodeList.push({ id: parts[0], text: parts[1] });
        }
      } else if (line.startsWith('VALID_EDGE:')) {
        const parts = line.replace('VALID_EDGE:', '').split('|').map(s => s.trim());
        if (parts.length >= 2) {
          edgeList.push({ causeId: parts[0], effectId: parts[1] });
        }
      }
    });

    if (nodeList.length > 0) parsedNodes = nodeList;
    if (edgeList.length > 0) parsedValidEdges = edgeList;
  }

  const [selectedCauseId, setSelectedCauseId] = useState<string | null>(null);
  const [selectedEffectId, setSelectedEffectId] = useState<string | null>(null);
  const [userEdges, setUserEdges] = useState<CausalEdge[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const mapId = id || btoa(encodeURIComponent((parsedTitle + parsedDesc).substring(0, 40))).substring(0, 32);
  const isCompleted = hasAnsweredQuestion(mapId);

  const handleAddEdge = () => {
    if (!selectedCauseId || !selectedEffectId || selectedCauseId === selectedEffectId) return;
    const exists = userEdges.some(e => e.causeId === selectedCauseId && e.effectId === selectedEffectId);
    if (!exists) {
      setUserEdges(prev => [...prev, { causeId: selectedCauseId, effectId: selectedEffectId }]);
    }
    setSelectedCauseId(null);
    setSelectedEffectId(null);
  };

  const handleRemoveEdge = (index: number) => {
    if (isSubmitted) return;
    setUserEdges(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (userEdges.length === 0 || isSubmitted) return;
    setIsSubmitted(true);

    const correctlyIdentified = userEdges.filter(ue =>
      parsedValidEdges.some(ve => ve.causeId === ue.causeId && ve.effectId === ue.effectId)
    ).length;

    if (correctlyIdentified >= Math.ceil(parsedValidEdges.length * 0.7) && !isCompleted) {
      markQuestionAnswered(mapId, parsedXp, `CausalMap: ${parsedTitle}`);
    }
    if (correctlyIdentified >= Math.ceil(parsedValidEdges.length * 0.7)) {
      trigger('correct', mapId, parsedXp);
    } else {
      trigger('wrong', mapId);
    }
  };

  const handleReset = () => {
    setUserEdges([]);
    setSelectedCauseId(null);
    setSelectedEffectId(null);
    setIsSubmitted(false);
  };

  const getNodeText = (nodeId: string) => parsedNodes.find(n => n.id === nodeId)?.text || nodeId;

  return (
    <div ref={feedbackRef} className={cn("not-prose my-12 mx-auto max-w-4xl px-2 relative", className)}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={cn("bg-[#FAF6EC] dark:bg-[#1A1712] border-4 border-[#D4AF37] p-6 md:p-8 shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#D4AF37] relative space-y-6", fxClass)}
      >
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b-4 border-[#D4AF37]/40 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-none bg-orange-500 border-2 border-black flex items-center justify-center text-black shrink-0 shadow-[2px_2px_0px_0px_#000]">
              <GitCommit className="w-6 h-6 text-black" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-black uppercase tracking-[0.25em] text-orange-700 dark:text-orange-300 block">
                [{badgeText}]
              </span>
              <h3 className="font-mono text-lg md:text-xl font-bold uppercase text-brand-ink dark:text-white leading-tight">
                {parsedTitle}
              </h3>
            </div>
          </div>

          <span className="px-3 py-1 bg-black text-[#D4AF37] dark:bg-white dark:text-black font-mono font-bold text-[11px] uppercase tracking-widest border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_#D4AF37]">
            +{parsedXp} XP
          </span>
        </div>

        {parsedDesc && (
          <p className="text-sm font-sans text-brand-ink dark:text-amber-100 leading-relaxed">
            {parsedDesc}
          </p>
        )}

        {/* Edge Selector */}
        {!isSubmitted && (
          <div className="bg-white dark:bg-[#12100C] p-4 border-2 border-[#D4AF37]/60 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.15)] font-mono space-y-4">
            <h4 className="text-xs font-mono font-black uppercase tracking-wider text-[#8B6914] dark:text-[#D4AF37]">
              Conectar Causa ➔ Consecuencia:
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-mono font-bold text-gray-400 block mb-1">Causa (Qué ocurre primero)</label>
                <select
                  value={selectedCauseId || ''}
                  onChange={e => setSelectedCauseId(e.target.value || null)}
                  className="w-full text-xs md:text-sm p-2.5 border-2 border-[#D4AF37]/50 bg-white dark:bg-[#12100C] text-brand-ink dark:text-amber-100 font-mono"
                >
                  <option value="">Selecciona la Causa...</option>
                  {parsedNodes.map(n => (
                    <option key={n.id} value={n.id}>{n.text}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-mono font-bold text-gray-400 block mb-1">Consecuencia / Efecto</label>
                <select
                  value={selectedEffectId || ''}
                  onChange={e => setSelectedEffectId(e.target.value || null)}
                  className="w-full text-xs md:text-sm p-2.5 border-2 border-[#D4AF37]/50 bg-white dark:bg-[#12100C] text-brand-ink dark:text-amber-100 font-mono"
                >
                  <option value="">Selecciona el Efecto...</option>
                  {parsedNodes.map(n => (
                    <option key={n.id} value={n.id}>{n.text}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              disabled={!selectedCauseId || !selectedEffectId || selectedCauseId === selectedEffectId}
              onClick={handleAddEdge}
              className={cn(
                "w-full py-4 px-6 font-mono font-black text-xs uppercase tracking-[0.2em] border-2 border-black transition-all shadow-[3px_3px_0px_0px_#000] flex items-center justify-center gap-2",
                selectedCauseId && selectedEffectId && selectedCauseId !== selectedEffectId
                  ? "bg-orange-500 text-black hover:bg-orange-400 cursor-pointer active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                  : "bg-gray-300 text-gray-600 dark:bg-gray-800 dark:text-gray-500 border-gray-700 cursor-not-allowed"
              )}
            >
              <Plus className="w-4 h-4" /> Enlazar Causa ➔ Consecuencia
            </button>
          </div>
        )}

        {/* User Causal Chains List */}
        <div>
          <h4 className="text-xs font-mono font-black uppercase tracking-wider text-[#8B6914] dark:text-[#D4AF37] mb-3">
            Cadenas Causales Construidas ({userEdges.length}):
          </h4>

          {userEdges.length === 0 ? (
            <div className="p-6 text-center text-xs font-mono text-gray-400 dark:text-gray-500 border-2 border-dashed border-black/20 dark:border-white/20">
              No has enlazado causas y consecuencias todavía.
            </div>
          ) : (
            <div className="space-y-2">
              {userEdges.map((edge, idx) => {
                const isValid = parsedValidEdges.some(ve => ve.causeId === edge.causeId && ve.effectId === edge.effectId);
                return (
                  <div
                    key={idx}
                    className={cn(
                      "p-3 border-2 flex items-center justify-between text-xs md:text-sm font-mono transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,0.15)]",
                      isSubmitted
                        ? (isValid ? "border-emerald-500 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300" : "border-rose-500 bg-rose-500/10 text-rose-800 dark:text-rose-300")
                        : "border-black/10 dark:border-white/20 bg-white dark:bg-[#12100C]"
                    )}
                  >
                    <div className="flex items-center gap-2 flex-wrap font-medium">
                      <span className="font-bold">{getNodeText(edge.causeId)}</span>
                      <ArrowRight className="w-4 h-4 text-orange-500 shrink-0" />
                      <span className="font-bold">{getNodeText(edge.effectId)}</span>
                    </div>

                    {!isSubmitted ? (
                      <button onClick={() => handleRemoveEdge(idx)} className="text-rose-500 hover:text-rose-700 p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    ) : (
                      isValid ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-rose-500" />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Action Button & Feedback */}
        {!isSubmitted ? (
          <button
            disabled={userEdges.length === 0}
            onClick={handleSubmit}
            className={cn(
              "w-full py-4 px-6 font-mono font-black text-xs uppercase tracking-[0.2em] border-2 border-black transition-all shadow-[3px_3px_0px_0px_#000] flex items-center justify-center gap-2",
              userEdges.length > 0
                ? "bg-[#D4AF37] text-black hover:bg-yellow-400 cursor-pointer active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                : "bg-gray-300 text-gray-600 dark:bg-gray-800 dark:text-gray-500 border-gray-700 cursor-not-allowed"
            )}
          >
            Validar Cadena Causal
          </button>
        ) : (
          <div className="space-y-4 pt-2">
            {parsedExplanation && (
              <div className="p-4 bg-white dark:bg-[#12100C] border-2 border-[#D4AF37]">
                <h4 className="text-xs font-mono font-black uppercase tracking-wider text-[#8B6914] dark:text-[#D4AF37] mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> Explicación de las Cadenas Causales
                </h4>
                <p className="text-xs md:text-sm font-sans text-brand-ink dark:text-amber-100 leading-relaxed">
                  {parsedExplanation}
                </p>
              </div>
            )}

            <button
              onClick={handleReset}
              className="text-xs font-mono font-bold flex items-center gap-1.5 text-[#8B6914] hover:text-black dark:text-[#D4AF37] dark:hover:text-white transition-colors mt-2"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reconfigurar mapa causal
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
