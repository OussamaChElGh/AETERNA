'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { LineChart as LineChartIcon, CheckCircle2, XCircle, Sparkles, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGamification } from '@/context/GamificationContext';
import { useExerciseFeedback } from '@/lib/useExerciseFeedback';

export interface GraphDataPoint {
  x: number;
  y: number;
  label?: string;
}

export interface GraphOption {
  label: string;
  isCorrect: boolean;
  feedback: string;
}

export interface GraphLabProps {
  id?: string;
  title?: string;
  badgeText?: string;
  description?: string;
  xLabel?: string;
  yLabel?: string;
  data: GraphDataPoint[];
  question: string;
  options: GraphOption[];
  xp?: number;
  content?: string;
  className?: string;
}

export function GraphLab({
  id,
  title = "Laboratorio de Interpretación de Gráficas",
  badgeText = "INTERPRETAR REPRESENTACIÓN GRÁFICA",
  description,
  xLabel = "Eje X",
  yLabel = "Eje Y",
  data = [],
  question,
  options = [],
  xp = 50,
  content,
  className
}: GraphLabProps) {
  const { markQuestionAnswered, hasAnsweredQuestion } = useGamification();

  let parsedTitle = title;
  let parsedDesc = description || '';
  let parsedXLabel = xLabel;
  let parsedYLabel = yLabel;
  let parsedQuestion = question;
  let parsedOptions: GraphOption[] = options;
  let parsedData: GraphDataPoint[] = data;
  let parsedXp = xp;

  if (content && content.trim()) {
    const lines = content.split('\n');
    const opts: GraphOption[] = [];
    const points: GraphDataPoint[] = [];

    lines.forEach(l => {
      const line = l.trim();
      if (line.startsWith('TITLE:')) parsedTitle = line.replace('TITLE:', '').trim();
      else if (line.startsWith('DESC:')) parsedDesc = line.replace('DESC:', '').trim();
      else if (line.startsWith('X_LABEL:')) parsedXLabel = line.replace('X_LABEL:', '').trim();
      else if (line.startsWith('Y_LABEL:')) parsedYLabel = line.replace('Y_LABEL:', '').trim();
      else if (line.startsWith('QUESTION:')) parsedQuestion = line.replace('QUESTION:', '').trim();
      else if (line.startsWith('XP:')) parsedXp = parseInt(line.replace('XP:', '').trim(), 10) || 50;
      else if (line.startsWith('POINT:')) {
        // Format: POINT: x | y | label
        const parts = line.replace('POINT:', '').split('|').map(s => s.trim());
        if (parts.length >= 2) {
          points.push({ x: parseFloat(parts[0]), y: parseFloat(parts[1]), label: parts[2] || '' });
        }
      } else if (line.startsWith('OPTION_CORRECT:')) {
        const parts = line.replace('OPTION_CORRECT:', '').split('|');
        opts.push({ label: parts[0]?.trim() || '', isCorrect: true, feedback: parts[1]?.trim() || '¡Correcto!' });
      } else if (line.startsWith('OPTION_WRONG:')) {
        const parts = line.replace('OPTION_WRONG:', '').split('|');
        opts.push({ label: parts[0]?.trim() || '', isCorrect: false, feedback: parts[1]?.trim() || 'Incorrecto.' });
      }
    });

    if (opts.length > 0) parsedOptions = opts;
    if (points.length > 0) parsedData = points;
  }

  // Active point state for hover/interaction
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { feedbackRef, trigger, fxClass } = useExerciseFeedback();

  const labId = id || btoa(encodeURIComponent((parsedTitle + parsedQuestion).substring(0, 40))).substring(0, 32);
  const isCompleted = hasAnsweredQuestion(labId);

  // SVG Chart Dimensions & Scale calculations
  const svgWidth = 500;
  const svgHeight = 240;
  const padding = 40;

  const maxX = Math.max(...(parsedData.map(p => p.x).length > 0 ? parsedData.map(p => p.x) : [10]), 1);
  const maxY = Math.max(...(parsedData.map(p => p.y).length > 0 ? parsedData.map(p => p.y) : [10]), 1);
  const minX = Math.min(...(parsedData.map(p => p.x).length > 0 ? parsedData.map(p => p.x) : [0]), 0);
  const minY = Math.min(...(parsedData.map(p => p.y).length > 0 ? parsedData.map(p => p.y) : [0]), 0);

  const getSvgX = (x: number) => padding + ((x - minX) / (maxX - minX || 1)) * (svgWidth - 2 * padding);
  const getSvgY = (y: number) => svgHeight - padding - ((y - minY) / (maxY - minY || 1)) * (svgHeight - 2 * padding);

  const pathD = parsedData.reduce((acc, p, idx) => {
    const sx = getSvgX(p.x);
    const sy = getSvgY(p.y);
    return idx === 0 ? `M ${sx} ${sy}` : `${acc} L ${sx} ${sy}`;
  }, '');

  const handleSubmit = () => {
    if (selectedIndex === null || isSubmitted) return;
    setIsSubmitted(true);
    const selected = parsedOptions[selectedIndex];
    if (selected && selected.isCorrect && !isCompleted) {
      markQuestionAnswered(labId, parsedXp, `Gráfica: ${parsedTitle}`);
      trigger('correct', labId, parsedXp);
    } else {
      trigger('wrong', labId);
    }
  };

  const selectedOpt = selectedIndex !== null ? parsedOptions[selectedIndex] : null;

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
            <div className="w-11 h-11 rounded-none bg-violet-500 border-2 border-black flex items-center justify-center text-black shrink-0 shadow-[2px_2px_0px_0px_#000]">
              <LineChartIcon className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-black uppercase tracking-[0.25em] text-violet-700 dark:text-violet-300 block">
                [{badgeText.toUpperCase()}]
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
          <p className="text-sm font-mono text-brand-ink/80 dark:text-amber-100/80 leading-relaxed">
            {parsedDesc}
          </p>
        )}

        {/* SVG Interactive Chart Canvas */}
        <div className="bg-white dark:bg-[#12100C] p-5 border-2 border-[#D4AF37]/50 shadow-[3px_3px_0px_0px_#000] overflow-x-auto">
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto max-h-[280px]">
            {/* Grid Lines */}
            <line x1={padding} y1={svgHeight - padding} x2={svgWidth - padding} y2={svgHeight - padding} stroke="currentColor" strokeOpacity="0.2" strokeWidth="1.5" />
            <line x1={padding} y1={padding} x2={padding} y2={svgHeight - padding} stroke="currentColor" strokeOpacity="0.2" strokeWidth="1.5" />

            {/* Axis Labels */}
            <text x={svgWidth - padding} y={svgHeight - 10} textAnchor="end" className="text-[10px] font-mono fill-gray-500 font-bold">{parsedXLabel}</text>
            <text x={15} y={padding - 10} textAnchor="start" className="text-[10px] font-mono fill-gray-500 font-bold">{parsedYLabel}</text>

            {/* Plot Line */}
            {parsedData.length > 1 && (
              <path d={pathD} fill="none" stroke="#8B6914" strokeWidth="3" className="dark:stroke-[#D4AF37]" />
            )}

            {/* Plot Points */}
            {parsedData.map((pt, idx) => {
              const cx = getSvgX(pt.x);
              const cy = getSvgY(pt.y);
              const isHovered = hoveredPointIndex === idx;

              return (
                <g key={idx} className="cursor-pointer" onMouseEnter={() => setHoveredPointIndex(idx)} onMouseLeave={() => setHoveredPointIndex(null)}>
                  <circle cx={cx} cy={cy} r={isHovered ? 7 : 5} fill="#D4AF37" stroke="#121214" strokeWidth="2" style={{ transition: 'all 0.2s' }} />
                  {isHovered && (
                    <g>
                      <rect x={cx - 30} y={cy - 30} width="60" height="20" fill="#1E1E22" stroke="#D4AF37" strokeWidth="1" />
                      <text x={cx} y={cy - 16} textAnchor="middle" fill="#FFFFFF" fontSize="9" fontFamily="monospace">
                        ({pt.x}, {pt.y})
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Question & Options */}
        <div className="bg-white dark:bg-[#12100C] p-5 border-2 border-[#D4AF37]/60 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.15)]">
          <p className="font-sans text-base md:text-lg font-semibold text-brand-ink dark:text-amber-100 leading-relaxed mb-4">
            {parsedQuestion}
          </p>

          <div className="space-y-3 font-mono">
            {parsedOptions.map((opt, idx) => {
              const isSelected = selectedIndex === idx;
              let btnClass = "border-2 border-[#D4AF37]/50 bg-white dark:bg-[#12100C] text-brand-ink dark:text-amber-100 shadow-[3px_3px_0px_0px_#000] hover:bg-violet-100 dark:hover:bg-violet-950/60";

              if (isSelected) btnClass = "border-2 border-black bg-[#D4AF37] text-black font-bold shadow-[4px_4px_0px_0px_#000]";

              if (isSubmitted) {
                if (opt.isCorrect) btnClass = "border-2 border-black bg-emerald-500 text-black font-bold shadow-[4px_4px_0px_0px_#000]";
                else if (isSelected && !opt.isCorrect) btnClass = "border-2 border-black bg-rose-600 text-white font-bold shadow-[4px_4px_0px_0px_#000]";
                else btnClass = "opacity-40 border-2 border-black/20 dark:border-white/20 bg-gray-100 dark:bg-zinc-900";
              }

              return (
                <button
                  key={idx}
                  disabled={isSubmitted}
                  onClick={() => setSelectedIndex(idx)}
                  className={cn(
                    "w-full text-left p-4 font-mono font-bold transition-all flex items-center justify-between gap-4 text-sm md:text-base",
                    btnClass
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 bg-black text-[#D4AF37] border border-[#D4AF37] flex items-center justify-center font-black text-xs shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt.label}</span>
                  </div>

                  {isSubmitted && opt.isCorrect && <CheckCircle2 className="w-6 h-6 text-black shrink-0" />}
                  {isSubmitted && isSelected && !opt.isCorrect && <XCircle className="w-6 h-6 text-white shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {!isSubmitted ? (
          <button
            disabled={selectedIndex === null}
            onClick={handleSubmit}
            className={cn(
              "w-full py-4 px-6 font-mono font-black text-xs uppercase tracking-[0.2em] border-2 border-black transition-all shadow-[3px_3px_0px_0px_#000] flex items-center justify-center gap-2",
              selectedIndex !== null
                ? "bg-[#D4AF37] text-black hover:bg-yellow-400 cursor-pointer active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                : "bg-gray-300 text-gray-600 dark:bg-gray-800 dark:text-gray-500 border-gray-700 cursor-not-allowed"
            )}
          >
            Confirmar Interpretación Gráfica
          </button>
        ) : (
          <div className={cn(
            "p-4 border-2 border-black shadow-[3px_3px_0px_0px_#000]",
            selectedOpt?.isCorrect ? "bg-emerald-500 text-black font-bold" : "bg-rose-600 text-white font-bold"
          )}>
            <div className="flex items-center gap-2 font-black mb-1 text-sm uppercase tracking-wider">
              {selectedOpt?.isCorrect ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
              <span>{selectedOpt?.isCorrect ? "¡INTERPRETACIÓN CORRECTA!" : "INTERPRETACIÓN ERRÓNEA"}</span>
            </div>
            <p className="text-xs md:text-sm font-sans">{selectedOpt?.feedback}</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
