'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Network, CheckCircle2, XCircle, Sparkles, RefreshCw, Link as LinkIcon, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGamification } from '@/context/GamificationContext';
import { useExerciseFeedback } from '@/lib/useExerciseFeedback';

export interface ConceptNode {
  id: string;
  label: string;
  category?: string;
}

export interface ConceptRelation {
  sourceId: string;
  targetId: string;
  relationLabel: string;
}

export interface ConceptMapProps {
  id?: string;
  title?: string;
  badgeText?: string;
  description?: string;
  nodes: ConceptNode[];
  relationOptions?: string[];
  validConnections: ConceptRelation[];
  xp?: number;
  content?: string;
  className?: string;
}

export function ConceptMap({
  id,
  title = "Mapa de Conceptos y Relaciones",
  badgeText = "RELACIONAR CONCEPTOS",
  description,
  nodes = [],
  relationOptions = ["produce", "depende de", "es un tipo de", "requiere", "inversamente proporcional a"],
  validConnections = [],
  xp = 60,
  content,
  className
}: ConceptMapProps) {
  const { markQuestionAnswered, hasAnsweredQuestion } = useGamification();
  const { feedbackRef, trigger, fxClass } = useExerciseFeedback();

  let parsedTitle = title;
  let parsedDesc = description || '';
  let parsedNodes: ConceptNode[] = nodes;
  let parsedValid: ConceptRelation[] = validConnections;
  let parsedRelations: string[] = relationOptions;
  let parsedXp = xp;

  if (content && content.trim()) {
    const lines = content.split('\n');
    const nodeList: ConceptNode[] = [];
    const validList: ConceptRelation[] = [];

    lines.forEach(l => {
      const line = l.trim();
      if (line.startsWith('TITLE:')) parsedTitle = line.replace('TITLE:', '').trim();
      else if (line.startsWith('DESC:')) parsedDesc = line.replace('DESC:', '').trim();
      else if (line.startsWith('XP:')) parsedXp = parseInt(line.replace('XP:', '').trim(), 10) || 60;
      else if (line.startsWith('NODE:')) {
        const parts = line.replace('NODE:', '').split('|').map(s => s.trim());
        if (parts.length >= 2) {
          nodeList.push({ id: parts[0], label: parts[1], category: parts[2] || '' });
        }
      } else if (line.startsWith('VALID_RELATION:')) {
        const parts = line.replace('VALID_RELATION:', '').split('|').map(s => s.trim());
        if (parts.length >= 3) {
          validList.push({ sourceId: parts[0], relationLabel: parts[1], targetId: parts[2] });
        }
      }
    });

    if (nodeList.length > 0) parsedNodes = nodeList;
    if (validList.length > 0) parsedValid = validList;
  }

  // Active state for connecting nodes
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);
  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null);
  const [selectedRelation, setSelectedRelation] = useState<string>(parsedRelations[0] || 'relacionado con');
  const [userConnections, setUserConnections] = useState<ConceptRelation[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const mapId = id || btoa(encodeURIComponent((parsedTitle + parsedDesc).substring(0, 40))).substring(0, 32);
  const isCompleted = hasAnsweredQuestion(mapId);

  const handleAddConnection = () => {
    if (!selectedSourceId || !selectedTargetId || selectedSourceId === selectedTargetId) return;
    
    // Avoid duplicate
    const exists = userConnections.some(
      c => c.sourceId === selectedSourceId && c.targetId === selectedTargetId && c.relationLabel === selectedRelation
    );
    if (!exists) {
      setUserConnections(prev => [...prev, { sourceId: selectedSourceId, targetId: selectedTargetId, relationLabel: selectedRelation }]);
    }
    setSelectedSourceId(null);
    setSelectedTargetId(null);
  };

  const handleRemoveConnection = (index: number) => {
    if (isSubmitted) return;
    setUserConnections(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (userConnections.length === 0 || isSubmitted) return;
    setIsSubmitted(true);

    const correctlyConnected = userConnections.filter(uc =>
      parsedValid.some(v => v.sourceId === uc.sourceId && v.targetId === uc.targetId)
    ).length;

    if (correctlyConnected >= Math.ceil(parsedValid.length * 0.6) && !isCompleted) {
      markQuestionAnswered(mapId, parsedXp, `Mapa Conceptual: ${parsedTitle}`);
    }
    if (correctlyConnected >= Math.ceil(parsedValid.length * 0.6)) {
      trigger('correct', mapId, parsedXp);
    } else {
      trigger('wrong', mapId);
    }
  };

  const handleReset = () => {
    setUserConnections([]);
    setSelectedSourceId(null);
    setSelectedTargetId(null);
    setIsSubmitted(false);
  };

  const getNodeLabel = (nodeId: string) => parsedNodes.find(n => n.id === nodeId)?.label || nodeId;

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
            <div className="w-11 h-11 rounded-full bg-blue-500 border-2 border-black flex items-center justify-center text-black shrink-0 shadow-[2px_2px_0px_0px_#000]">
              <Network className="w-6 h-6 text-black" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-black uppercase tracking-[0.25em] text-blue-700 dark:text-blue-300 block">
                [{badgeText}]
              </span>
              <h3 className="font-serif text-xl md:text-2xl font-bold text-brand-ink dark:text-white leading-tight">
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

        {/* Connection Creator UI */}
        {!isSubmitted && (
          <div className="bg-white dark:bg-[#12100C] p-4 md:p-5 border-2 border-[#D4AF37]/60 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.15)] font-mono space-y-4">
            <h4 className="text-xs font-mono font-black uppercase tracking-wider text-[#8B6914] dark:text-[#D4AF37]">
              Establecer nueva conexión entre conceptos:
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
              {/* Source Node */}
              <div>
                <label className="text-[11px] font-mono font-bold text-gray-400 block mb-1">Origen</label>
                <select
                  value={selectedSourceId || ''}
                  onChange={e => setSelectedSourceId(e.target.value || null)}
                  className="w-full text-xs md:text-sm p-2.5 border-2 border-[#D4AF37]/50 bg-white dark:bg-[#12100C] text-brand-ink dark:text-amber-100 font-mono"
                >
                  <option value="">Selecciona concepto origen...</option>
                  {parsedNodes.map(n => (
                    <option key={n.id} value={n.id}>{n.label}</option>
                  ))}
                </select>
              </div>

              {/* Relation Label */}
              <div>
                <label className="text-[11px] font-mono font-bold text-gray-400 block mb-1">Relación</label>
                <select
                  value={selectedRelation}
                  onChange={e => setSelectedRelation(e.target.value)}
                  className="w-full text-xs md:text-sm p-2.5 border-2 border-[#D4AF37]/50 bg-white dark:bg-[#12100C] font-mono font-bold text-blue-700 dark:text-blue-300"
                >
                  {parsedRelations.map((r, i) => (
                    <option key={i} value={r}>— {r} —</option>
                  ))}
                </select>
              </div>

              {/* Target Node */}
              <div>
                <label className="text-[11px] font-mono font-bold text-gray-400 block mb-1">Destino</label>
                <select
                  value={selectedTargetId || ''}
                  onChange={e => setSelectedTargetId(e.target.value || null)}
                  className="w-full text-xs md:text-sm p-2.5 border-2 border-[#D4AF37]/50 bg-white dark:bg-[#12100C] text-brand-ink dark:text-amber-100 font-mono"
                >
                  <option value="">Selecciona concepto destino...</option>
                  {parsedNodes.map(n => (
                    <option key={n.id} value={n.id}>{n.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              disabled={!selectedSourceId || !selectedTargetId || selectedSourceId === selectedTargetId}
              onClick={handleAddConnection}
              className={cn(
                "w-full py-4 px-6 font-mono font-black text-xs uppercase tracking-[0.2em] border-2 border-black transition-all shadow-[3px_3px_0px_0px_#000] flex items-center justify-center gap-2",
                selectedSourceId && selectedTargetId && selectedSourceId !== selectedTargetId
                  ? "bg-blue-500 text-black hover:bg-blue-400 cursor-pointer active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                  : "bg-gray-300 text-gray-600 dark:bg-gray-800 dark:text-gray-500 border-gray-700 cursor-not-allowed"
              )}
            >
              <Plus className="w-4 h-4" /> Añadir Conexión Conceptual
            </button>
          </div>
        )}

        {/* User Connections List */}
        <div>
          <h4 className="text-xs font-mono font-black uppercase tracking-wider text-[#8B6914] dark:text-[#D4AF37] mb-3 flex items-center gap-1.5">
            <LinkIcon className="w-3.5 h-3.5" /> Conexiones Establecidas en tu Mapa ({userConnections.length}):
          </h4>

          {userConnections.length === 0 ? (
            <div className="p-6 text-center text-xs font-mono text-gray-400 dark:text-gray-500 border-2 border-dashed border-black/20 dark:border-white/20">
              No has añadido conexiones conceptuales todavía.
            </div>
          ) : (
            <div className="space-y-2">
              {userConnections.map((conn, idx) => {
                const isValid = parsedValid.some(v => v.sourceId === conn.sourceId && v.targetId === conn.targetId);
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
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold font-sans text-gray-800 dark:text-gray-100">{getNodeLabel(conn.sourceId)}</span>
                      <span className="bg-blue-500 text-black font-mono font-bold text-[11px] px-2 py-0.5">
                        [{conn.relationLabel}]
                      </span>
                      <span className="font-bold font-sans text-gray-800 dark:text-gray-100">{getNodeLabel(conn.targetId)}</span>
                    </div>

                    {!isSubmitted ? (
                      <button onClick={() => handleRemoveConnection(idx)} className="text-rose-500 hover:text-rose-700 p-1">
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
            disabled={userConnections.length === 0}
            onClick={handleSubmit}
            className={cn(
              "w-full py-4 px-6 font-mono font-black text-xs uppercase tracking-[0.2em] border-2 border-black transition-all shadow-[3px_3px_0px_0px_#000] flex items-center justify-center gap-2",
              userConnections.length > 0
                ? "bg-[#D4AF37] text-black hover:bg-yellow-400 cursor-pointer active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                : "bg-gray-300 text-gray-600 dark:bg-gray-800 dark:text-gray-500 border-gray-700 cursor-not-allowed"
            )}
          >
            Validar Estructura del Mapa Conceptual
          </button>
        ) : (
          <div className="space-y-4 pt-2">
            <div className="p-4 bg-white dark:bg-[#12100C] border-2 border-[#D4AF37]">
              <h4 className="text-xs font-mono font-black uppercase tracking-wider text-[#8B6914] dark:text-[#D4AF37] mb-2 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Explicación de Relaciones Válidas
              </h4>
              <div className="space-y-1.5 text-xs md:text-sm font-sans text-brand-ink dark:text-amber-100">
                {parsedValid.map((v, i) => (
                  <div key={i} className="font-mono">
                    ✓ <span className="font-bold">{getNodeLabel(v.sourceId)}</span> [{v.relationLabel}] <span className="font-bold">{getNodeLabel(v.targetId)}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleReset}
              className="text-xs font-mono font-bold flex items-center gap-1.5 text-[#8B6914] hover:text-black dark:text-[#D4AF37] dark:hover:text-white transition-colors mt-2"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reorganizar mapa conceptual
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
