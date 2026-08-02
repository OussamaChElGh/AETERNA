'use client';
import React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Medal, Lock, Crown, Flame, Award, User } from 'lucide-react';
import { AVATARS } from '@/context/GamificationContext';
import type { LeaderboardEntry } from '@/lib/leaderboard';
import { formatXP } from '@/context/GamificationContext';
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

  return (
    <div>
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
              {isMe && (
                <div className="mt-1 text-[9px] font-mono font-bold text-brand-gold uppercase tracking-wider">Tú</div>
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
              return (
                <tr
                  key={entry.uid}
                  className={cn(
                    "border-b border-white/5 transition-colors",
                    isMe ? "bg-brand-gold/10 border-brand-gold/30" : "hover:bg-white/5"
                  )}
                >
                  <td className="py-2.5 px-3 font-mono text-xs text-brand-offwhite/50">{place}</td>
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
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
