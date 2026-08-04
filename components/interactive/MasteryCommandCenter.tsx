'use client';
import React from "react";
import { motion } from "motion/react";
import { BrainCircuit, Star, Layers, Trophy, ChevronRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface MasteryCommandCenterProps {
  currentLevel: string;
  onChangeLevel: (level: string) => void;
  progress: number;
  xpGained?: number;
  availableLevels: string[];
}

export function MasteryCommandCenter({
  currentLevel,
  onChangeLevel,
  progress,
  xpGained = 0,
  availableLevels,
}: MasteryCommandCenterProps) {
  
  const levels_map: Record<string, { label: string; icon: any; color: string }> = {
    principiante: { label: "Fundamentos", icon: BrainCircuit, color: "#8B6914" },
    intermedio: { label: "Profundización", icon: Layers, color: "#D4AF37" },
    avanzado: { label: "Frontera", icon: Trophy, color: "#1A1A1A" },
  };

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-[100] w-full bg-[#FDFBF7]/80 backdrop-blur-xl border-b border-[#8B6914]/15 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between gap-8">
        {/* Left: Progress Indicator */}
        <div className="flex items-center gap-6 flex-1">
          <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="24"
                cy="24"
                r="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-[#8B6914]/10"
              />
              <motion.circle
                cx="24"
                cy="24"
                r="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="125.6"
                initial={{ strokeDashoffset: 125.6 }}
                animate={{ strokeDashoffset: 125.6 - (125.6 * progress) / 100 }}
                className="text-[#D4AF37]"
              />
            </svg>
            <span className="absolute text-[10px] font-mono font-black text-[#8B6914]">
              {Math.round(progress)}%
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[9px] font-mono font-bold tracking-[0.3em] text-[#8B6914]/40 uppercase">
              Sincronización
            </span>
            <div className="flex items-center gap-2">
              <span className="font-serif text-lg text-[#1A1A1A]">
                Canon Anektia
              </span>
              {xpGained > 0 && (
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[10px] font-mono font-bold text-[#D4AF37]"
                >
                  +{xpGained} XP
                </motion.span>
              )}
            </div>
          </div>
        </div>

        {/* Center: Level Selector */}
        <div className="flex items-center bg-black/5 p-1 rounded-full border border-black/5">
          {availableLevels.map((lvl) => {
            const config = levels_map[lvl] || { label: lvl, icon: Sparkles, color: "#1A1A1A" };
            const isActive = currentLevel === lvl;
            const Icon = config.icon;

            return (
              <button
                key={lvl}
                onClick={() => onChangeLevel(lvl)}
                className={cn(
                  "flex items-center gap-3 px-6 py-2.5 rounded-full transition-all duration-500",
                  isActive
                    ? "bg-white shadow-[0_4px_20px_rgba(139,105,20,0.1)] border border-[#8B6914]/10"
                    : "opacity-40 hover:opacity-100"
                )}
              >
                <Icon
                  className={cn("w-3.5 h-3.5", isActive ? "text-[#D4AF37]" : "text-[#1A1A1A]")}
                  strokeWidth={2.5}
                />
                <span className={cn(
                  "text-[10px] font-mono font-black uppercase tracking-[0.2em]",
                  isActive ? "text-[#1A1A1A]" : "text-[#1A1A1A]/60"
                )}>
                  {config.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="active-indicator"
                    className="w-1 h-1 rounded-full bg-[#D4AF37]"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Right: Mastery Badge */}
        <div className="flex items-center justify-end gap-4 flex-1">
          <div className="flex flex-col items-end">
            <span className="text-[9px] font-mono font-bold tracking-[0.3em] text-[#8B6914]/40 uppercase">
              Estado Actual
            </span>
            <span className="font-serif text-sm text-[#1A1A1A] italic">
              Aspirante al Conocimiento
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center">
            <Star className="w-5 h-5 text-[#D4AF37]" />
          </div>
        </div>
      </div>

      {/* Thin Progress line at the very bottom */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-black/5 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="h-full bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-[#D4AF37]"
        />
      </div>
    </motion.div>
  );
}
