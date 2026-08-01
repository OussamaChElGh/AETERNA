'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { FileSearch, CheckCircle2, XCircle, Sparkles, RefreshCw, Link as LinkIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGamification } from '@/context/GamificationContext';
import { useExerciseFeedback } from '@/lib/useExerciseFeedback';

export interface ClaimItem {
  id: string;
  statement: string;
}

export interface EvidenceItem {
  id: string;
  sourceText: string;
  matchesClaimId: string;
  explanation?: string;
}

export interface EvidenceMatcherProps {
  id?: string;
  title?: string;
  badgeText?: string;
  description?: string;
  claims: ClaimItem[];
  evidences: EvidenceItem[];
  xp?: number;
  content?: string;
  className?: string;
}

export function EvidenceMatcher({
  id,
  title = "Emparejador de Afirmaciones y Evidencias",
  badgeText = "EVALUACIÓN DE EVIDENCIAS Y PRUEBAS",
  description,
  claims = [],
  evidences = [],
  xp = 60,
  content,
  className
}: EvidenceMatcherProps) {
  const { markQuestionAnswered, hasAnsweredQuestion } = useGamification();
  const { feedbackRef, trigger, fxClass } = useExerciseFeedback();

  let parsedTitle = title;
  let parsedDesc = description || '';
  let parsedClaims: ClaimItem[] = claims;
  let parsedEvidences: EvidenceItem[] = evidences;
  let parsedXp = xp;

  if (content && content.trim()) {
    const lines = content.split('\n');
    const claimList: ClaimItem[] = [];
    const evList: EvidenceItem[] = [];

    lines.forEach(l => {
      const line = l.trim();
      if (line.startsWith('TITLE:')) parsedTitle = line.replace('TITLE:', '').trim();
      else if (line.startsWith('DESC:')) parsedDesc = line.replace('DESC:', '').trim();
      else if (line.startsWith('XP:')) parsedXp = parseInt(line.replace('XP:', '').trim(), 10) || 60;
      else if (line.startsWith('CLAIM:')) {
        const parts = line.replace('CLAIM:', '').split('|').map(s => s.trim());
        if (parts.length >= 2) {
          claimList.push({ id: parts[0], statement: parts[1] });
        }
      } else if (line.startsWith('EVIDENCE:')) {
        // Format: EVIDENCE: id | sourceText | matchesClaimId | explanation
        const parts = line.replace('EVIDENCE:', '').split('|').map(s => s.trim());
        if (parts.length >= 3) {
          evList.push({ id: parts[0], sourceText: parts[1], matchesClaimId: parts[2], explanation: parts[3] || '' });
        }
      }
    });

    if (claimList.length > 0) parsedClaims = claimList;
    if (evList.length > 0) parsedEvidences = evList;
  }

  // Record mapping claimId -> evidenceId
  const [userMatches, setUserMatches] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const matcherId = id || btoa(encodeURIComponent((parsedTitle + parsedDesc).substring(0, 40))).substring(0, 32);
  const isCompleted = hasAnsweredQuestion(matcherId);

  const handleSelectPair = (claimId: string, evidenceId: string) => {
    if (isSubmitted) return;
    setUserMatches(prev => ({ ...prev, [claimId]: evidenceId }));
  };

  const handleSubmit = () => {
    if (Object.keys(userMatches).length < parsedClaims.length || isSubmitted) return;
    setIsSubmitted(true);

    const correctlyMatched = parsedClaims.filter(c => {
      const selectedEvId = userMatches[c.id];
      const ev = parsedEvidences.find(e => e.id === selectedEvId);
      return ev && ev.matchesClaimId === c.id;
    }).length;

    if (correctlyMatched === parsedClaims.length && !isCompleted) {
      markQuestionAnswered(matcherId, parsedXp, `Evidencias: ${parsedTitle}`);
    }
    if (correctlyMatched === parsedClaims.length) {
      trigger('correct', matcherId, parsedXp);
    } else {
      trigger('wrong', matcherId);
    }
  };

  const handleReset = () => {
    setUserMatches({});
    setIsSubmitted(false);
  };

  const allMatched = Object.keys(userMatches).length === parsedClaims.length;

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
            <div className="w-11 h-11 rounded-none bg-emerald-500 border-2 border-black flex items-center justify-center text-black shrink-0 shadow-[2px_2px_0px_0px_#000]">
              <FileSearch className="w-6 h-6 text-black" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-black uppercase tracking-[0.25em] text-emerald-700 dark:text-emerald-300 block">
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

        {/* Claims & Evidences Grid */}
        <div className="space-y-6">
          {parsedClaims.map((claim, idx) => {
            const selectedEvId = userMatches[claim.id] || '';
            const matchingEv = parsedEvidences.find(e => e.id === selectedEvId);
            const isCorrect = isSubmitted && matchingEv && matchingEv.matchesClaimId === claim.id;
            const isWrong = isSubmitted && matchingEv && matchingEv.matchesClaimId !== claim.id;

            return (
              <div
                key={claim.id}
                className={cn(
                  "p-4 border-2 transition-all space-y-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.15)]",
                  isSubmitted
                    ? (isCorrect ? "border-emerald-500 bg-emerald-500/10" : "border-rose-500 bg-rose-500/10")
                    : "border-black/10 dark:border-white/20 bg-white dark:bg-[#12100C]"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 bg-emerald-500 text-black border-2 border-black font-mono font-black text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <h4 className="font-bold text-sm md:text-base font-sans text-brand-ink dark:text-amber-100">
                      {claim.statement}
                    </h4>
                  </div>
                  {isSubmitted && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />}
                  {isSubmitted && isWrong && <XCircle className="w-5 h-5 text-rose-500 shrink-0" />}
                </div>

                {/* Dropdown / Selector for Evidence */}
                <div>
                  <label className="text-[11px] font-mono font-bold text-gray-400 block mb-1">
                    Selecciona la evidencia que respalda esta afirmación:
                  </label>
                  <select
                    disabled={isSubmitted}
                    value={selectedEvId}
                    onChange={e => handleSelectPair(claim.id, e.target.value)}
                    className="w-full text-xs md:text-sm p-2.5 border-2 border-[#D4AF37]/50 bg-white dark:bg-[#12100C] text-brand-ink dark:text-amber-100 font-mono"
                  >
                    <option value="">Selecciona evidencia empírica / textual...</option>
                    {parsedEvidences.map(ev => (
                      <option key={ev.id} value={ev.id}>
                        {ev.sourceText}
                      </option>
                    ))}
                  </select>
                </div>

                {isSubmitted && matchingEv && (
                  <p className="text-xs opacity-90 font-mono pt-1">
                    {matchingEv.explanation || (isCorrect ? "Evidencia sólida y válida." : "Esta evidencia no corresponde a la afirmación.")}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Button & Feedback */}
        {!isSubmitted ? (
          <button
            disabled={!allMatched}
            onClick={handleSubmit}
            className={cn(
              "w-full py-4 px-6 font-mono font-black text-xs uppercase tracking-[0.2em] border-2 border-black transition-all shadow-[3px_3px_0px_0px_#000] flex items-center justify-center gap-2",
              allMatched
                ? "bg-[#D4AF37] text-black hover:bg-yellow-400 cursor-pointer active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                : "bg-gray-300 text-gray-600 dark:bg-gray-800 dark:text-gray-500 border-gray-700 cursor-not-allowed"
            )}
          >
            Validar Emparejamiento de Evidencias
          </button>
        ) : (
          <button
            onClick={handleReset}
            className="text-xs font-mono font-bold flex items-center gap-1.5 text-[#8B6914] hover:text-black dark:text-[#D4AF37] dark:hover:text-white transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reintentar emparejamiento de evidencias
          </button>
        )}
      </motion.div>
    </div>
  );
}
