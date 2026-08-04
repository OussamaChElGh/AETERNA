'use client';
import React from 'react';
import { motion } from 'motion/react';
import { Flame, Compass, Layers, Zap, Moon, CheckCircle, Gift } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SideQuest } from '@/data/levelQuests';

interface SideQuestBannerProps {
  quests: SideQuest[];
  // contexts: completedLayers, completedPaths, dailyStreak, xp, levelArticles
  completedLayers: Record<string, string[]>;
  completedPaths: string[];
  dailyStreak: number;
  xp: number;
  levelArticles: string[];
}

const ICON_MAP: Record<string, React.ComponentType<any>> = {
  Flame, Compass, Layers, Zap, Moon,
};

export function SideQuestBanner({ quests, completedLayers, completedPaths, dailyStreak, xp, levelArticles }: SideQuestBannerProps) {
  return (
    <div className="glass-panel rounded-2xl p-4 space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <Gift size={14} className="text-brand-gold" />
        <span className="text-[10px] font-mono font-black uppercase tracking-[0.2em] text-brand-offwhite/60">
          Misiones Secundarias
        </span>
      </div>

      {quests.map((quest) => {
        const isDone = quest.check({ completedLayers, completedPaths, dailyStreak, xp, levelArticles });
        const Icon = ICON_MAP[quest.icon] || Compass;

        return (
          <motion.div
            key={quest.id}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className={cn(
              "flex items-start gap-2.5 p-2.5 rounded-xl transition-all",
              isDone ? "bg-emerald-500/5 border border-emerald-500/20" : "bg-white/[0.01] border border-white/5"
            )}
          >
            <div className={cn(
              "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
              isDone ? "bg-emerald-500/15" : "bg-white/5"
            )}>
              {isDone ? <CheckCircle size={14} className="text-emerald-400" /> :
                       <Icon size={14} className="text-brand-offwhite/40" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className={cn("text-[11px] font-mono font-bold leading-tight", isDone ? "text-emerald-300" : "text-brand-offwhite/60")}>
                  {quest.title}
                </p>
                {isDone && <span className="text-[8px] font-mono font-black uppercase text-emerald-500 px-1.5 py-0.5 rounded-full bg-emerald-500/10">HECHO</span>}
              </div>
              <p className="text-[9px] text-brand-offwhite/25 mt-0.5 leading-relaxed">
                {quest.description}
              </p>
              <div className="flex items-center gap-1 mt-1">
                {quest.reward.type === 'xp' ? (
                  <div className="flex items-center gap-0.5">
                    <Zap size={9} className={isDone ? "text-emerald-400" : "text-amber-400/60"} />
                    <span className={cn("text-[9px] font-mono font-bold", isDone ? "text-emerald-400" : "text-amber-400/60")}>+{quest.reward.amount} XP</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-0.5">
                    <Gift size={9} className={isDone ? "text-emerald-400" : "text-brand-gold/60"} />
                    <span className={cn("text-[9px] font-mono font-bold", isDone ? "text-emerald-400" : "text-brand-gold/60")}>{quest.reward.name}</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
