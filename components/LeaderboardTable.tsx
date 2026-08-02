'use client';
import React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Medal, Crown, Flame, Award, User, Sparkles } from 'lucide-react';
import { AVATARS } from '@/context/GamificationContext';
import type { LeaderboardEntry } from '@/lib/leaderboard';
import { formatXP, calculateProgressToNextLevel } from '@/context/GamificationContext';
import { cn } from '@/lib/utils';

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
  isLoading?: boolean;
  scope: 'global' | 'weekly';
}

function getAvatarImage(avatarId: string): string {
  const av = AVATARS.find(a => a.id === avatarId);
  return av?.image || '';
}

function AvatarDisplay({ entry, size = 40 }: { entry: LeaderboardEntry; size?: number }) {
  const avatarImg = getAvatarImage(entry.avatarId);
  return (
    <div
      className="relative shrink-0 rounded-full border border-brand-gold/30 bg-brand-gold/10 overflow-hidden flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {avatarImg ? (
        <Image src={avatarImg} alt={entry.name} width={size} height={size} className="object-cover" />
      ) : (
        <User size={size * 0.5} className="text-brand-gold" />
      )}
    </div>
  );
}

const podiumMedals = [
  { place: 1, color: 'from-amber-300/30 to-amber-600/20 border-amber-400/60', text: 'text-amber-300', label: 'Oro', icon: Crown, order: 'order-2 md:order-2', size: 'md:h-64', offset: 'md:-mt-4' },
  { place: 2, color: 'from-slate-300/30 to-slate-500/20 border-slate-300/60', text: 'text-slate-200', label: 'Plata', icon: Medal, order: 'order-1 md:order-1', size: 'md:h-56', offset: '' },
  { place: 3, color: 'from-orange-300/30 to-orange-700/20 border-orange-400/60', text: 'text-orange-300', label: 'Bronce', icon: Medal, order: 'order-3 md:order-3', size: 'md:h-56', offset: '' },
];

export function LeaderboardTable({ entries, currentUserId, isLoading = false, scope }: LeaderboardTableProps) {
  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);
  const userEntry = currentUserId
    ? entries.find(e => e.uid === currentUserId)
    : undefined;

  if (isLoading) {
    return (
      <div className="space-y-3 animate-pulse">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-14 rounded-xl bg-white/5 border border-white/5" />
        ))}
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-16 text-brand-offwhite/50 font-serif text-lg">
        Aún no hay sabios en esta clasificación.
      </div>
    );
  }

  const xpKey = scope === 'weekly' ? 'weeklyXp' : 'xp';
  const leader = entries[0];

  return (
    <div>
      {/* BANNER DEL LÍDER */}
      {leader && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden mb-8 rounded-2xl border border-brand-gold/40 bg-gradient-to-r from-brand-gold/10 via-brand-gold/5 to-transparent p-4 flex items-center gap-4"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(212,175,55,0.15),transparent_60%)]" />
          <motion.div
            animate={{ rotate: [0, 12, 0, -12, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="relative shrink-0"
          >
            <Crown size={28} className="text-brand-gold drop-shadow-[0_0_12px_rgba(212,175,55,0.6)]" />
          </motion.div>
          <div className="relative min-w-0">
            <div className="text-[9px] font-mono uppercase tracking-[0.3em] text-brand-gold/70 mb-0.5">
              {scope === 'weekly' ? 'Líder de la semana' : 'Sabio Supremo'}
            </div>
            <div className="font-serif text-xl font-bold text-brand-offwhite truncate leading-tight">
              {leader.name}
            </div>
            <div className="text-[11px] font-mono text-brand-offwhite/50">
              Nivel {leader.level} · {formatXP(leader[xpKey])} XP
            </div>
          </div>
          <div className="relative ml-auto hidden sm:block">
            <div className="text-right">
              <div className="text-[9px] font-mono uppercase tracking-wider text-brand-gold/60">Distancia</div>
              {entries[1] ? (
                <div className="font-mono text-xs text-brand-offwhite/70">
                  +{formatXP(leader[xpKey] - entries[1][xpKey])} XP sobre el 2º
                </div>
              ) : (
                <div className="font-mono text-xs text-brand-offwhite/70">Único sabio</div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* PODIO */}
      <div className="flex flex-col md:flex-row items-end justify-center gap-4 md:gap-8 mb-10">
        {top3.map((entry) => {
          const meta = podiumMedals.find(m => m.place === top3.indexOf(entry) + 1)!;
          const Icon = meta.icon;
          const isMe = entry.uid === currentUserId;
          return (
            <motion.div
              key={entry.uid}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: top3.indexOf(entry) * 0.12, type: 'spring', stiffness: 120, damping: 18 }}
              className={cn(
                "flex flex-col items-center text-center w-28 md:w-36 rounded-t-3xl rounded-b-2xl border bg-gradient-to-b px-4 pt-4 pb-6 relative",
                meta.color,
                meta.size,
                meta.order,
                meta.offset
              )}
            >
              <div className={cn("flex items-center gap-1 mb-1", meta.text)}>
                <Icon size={18} />
                <span className="text-xs font-mono font-bold uppercase tracking-wider">{meta.label}</span>
              </div>
              <div className="text-3xl font-black font-serif text-brand-offwhite mb-2">{meta.place}</div>
              <AvatarDisplay entry={entry} size={64} />
              <div className={cn("mt-2 text-sm font-bold font-serif leading-tight", isMe ? "text-brand-gold" : "text-brand-offwhite")}>
                {entry.name}
              </div>
              <div className="text-[10px] font-mono text-brand-offwhite/50 mt-1">
                Nivel {entry.level} · {formatXP(entry[xpKey])} XP
              </div>
              {/* Barra de progreso hacia el siguiente nivel */}
              {(() => {
                const p = calculateProgressToNextLevel(entry[xpKey]);
                const pct = p.xpForNextLevel > 0 ? Math.min(100, Math.round((p.currentLevelXp / p.xpForNextLevel) * 100)) : 0;
                return (
                  <div className="w-full mt-2">
                    <div className="h-1 rounded-full bg-black/30 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-brand-gold/60 to-brand-gold"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })()}
              {/* Stat chips: logros, reliquias y racha */}
              <div className="flex items-center gap-1.5 mt-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-black/20 border border-white/10 px-1.5 py-0.5 text-[8px] font-mono text-brand-offwhite/60">
                  <Award size={9} className="text-brand-gold" />
                  {entry.achievementsCount}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-black/20 border border-white/10 px-1.5 py-0.5 text-[8px] font-mono text-brand-offwhite/60">
                  <Sparkles size={9} className="text-brand-gold" />
                  {entry.relicsCount}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-black/20 border border-white/10 px-1.5 py-0.5 text-[8px] font-mono text-brand-offwhite/60">
                  <Flame size={9} className="text-orange-400" />
                  {entry.dailyStreak}
                </span>
              </div>
              {isMe && (
                <div className="mt-2 text-[9px] font-mono font-bold text-brand-gold uppercase tracking-wider bg-brand-gold/10 border border-brand-gold/30 rounded-full px-2 py-0.5">
                  Tú
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* TABLA */}
      <div className="max-h-[440px] overflow-y-auto pr-1">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-brand-ink z-10">
            <tr className="border-b border-brand-gold/20">
              <th className="py-2 px-3 text-[10px] font-mono uppercase tracking-wider text-brand-gold/60 w-12">#</th>
              <th className="py-2 px-3 text-[10px] font-mono uppercase tracking-wider text-brand-gold/60">Sabio</th>
              <th className="py-2 px-3 text-[10px] font-mono uppercase tracking-wider text-brand-gold/60 text-center w-16">Nivel</th>
              <th className="py-2 px-3 text-[10px] font-mono uppercase tracking-wider text-brand-gold/60 text-right w-24">XP</th>
              <th className="py-2 px-3 text-[10px] font-mono uppercase tracking-wider text-brand-gold/60 text-center w-16 hidden sm:table-cell">Logros</th>
              <th className="py-2 px-3 text-[10px] font-mono uppercase tracking-wider text-brand-gold/60 text-center w-14 hidden sm:table-cell">Racha</th>
            </tr>
          </thead>
          <tbody>
            {rest.map((entry, idx) => {
              const place = idx + 4;
              const isMe = entry.uid === currentUserId;
              const topMedal = place <= 3 ? podiumMedals[place - 1] : null;
              return (
                <motion.tr
                  key={entry.uid}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.03, duration: 0.3 }}
                  className={cn(
                    "border-b border-white/5 transition-colors",
                    isMe ? "bg-brand-gold/10 border-brand-gold/30" : "hover:bg-white/5"
                  )}
                >
                  <td className="py-2.5 px-3">
                    <span className="flex items-center gap-1.5">
                      {topMedal && (
                        <Medal size={13} className={cn(topMedal.text, "shrink-0")} />
                      )}
                      <span className="font-mono text-xs text-brand-offwhite/50">{place}</span>
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2.5">
                      <AvatarDisplay entry={entry} size={28} />
                      <div className="min-w-0">
                        <div className={cn("text-xs font-serif font-bold truncate max-w-[160px]", isMe ? "text-brand-gold" : "text-brand-offwhite")}>
                          {entry.name}
                        </div>
                        {isMe && (
                          <div className="text-[8px] font-mono text-brand-gold/60 uppercase tracking-wider">Tú</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono text-xs text-brand-offwhite/70">{entry.level}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-xs text-brand-gold">{formatXP(entry[xpKey])}</td>
                  <td className="py-2.5 px-3 text-center hidden sm:table-cell">
                    <span className="inline-flex items-center gap-1 text-xs text-brand-offwhite/60">
                      <Award size={12} className="text-brand-gold/70" />
                      {entry.achievementsCount}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center hidden sm:table-cell">
                    <span className="inline-flex items-center gap-1 text-xs text-brand-offwhite/60">
                      <Flame size={12} className="text-orange-400/80" />
                      {entry.dailyStreak}
                    </span>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
