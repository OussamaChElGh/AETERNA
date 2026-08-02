'use client';
import React from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Medal, Crown, Flame, Award, User, Sparkles } from 'lucide-react';
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

// Anillos de color según la medalla (oro/plata/bronce)
const podiumMeta = [
  {
    place: 1,
    ring: 'border-amber-300/80',
    glow: 'shadow-[0_0_24px_rgba(251,191,36,0.25)]',
    badge: 'bg-amber-300 text-amber-950',
    label: 'Oro',
    scale: 'md:scale-105',
    icon: Crown,
  },
  {
    place: 2,
    ring: 'border-slate-300/70',
    glow: 'shadow-[0_0_16px_rgba(203,213,225,0.15)]',
    badge: 'bg-slate-300 text-slate-900',
    label: 'Plata',
    scale: '',
    icon: Medal,
  },
  {
    place: 3,
    ring: 'border-orange-400/60',
    glow: 'shadow-[0_0_16px_rgba(251,146,60,0.15)]',
    badge: 'bg-orange-400 text-orange-950',
    label: 'Bronce',
    scale: '',
    icon: Medal,
  },
];

function PodiumAvatar({ entry, meta }: { entry: LeaderboardEntry; meta: typeof podiumMeta[number] }) {
  const avatarImg = getAvatarImage(entry.avatarId);
  const Icon = meta.icon;
  return (
    <div className={cn("relative rounded-full p-1.5 border-2 bg-brand-ink", meta.ring, meta.glow)}>
      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden flex items-center justify-center bg-brand-gold/10">
        {avatarImg ? (
          <Image src={avatarImg} alt={entry.name} width={80} height={80} className="object-cover w-full h-full" />
        ) : (
          <User size={32} className="text-brand-gold" />
        )}
      </div>
      <div className={cn("absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center border-2 border-brand-ink", meta.badge)}>
        <Icon size={12} />
      </div>
    </div>
  );
}

function RowAvatar({ entry, place }: { entry: LeaderboardEntry; place: number }) {
  const avatarImg = getAvatarImage(entry.avatarId);
  return (
    <div className={cn(
      "relative shrink-0 w-8 h-8 rounded-full border overflow-hidden flex items-center justify-center bg-brand-gold/10",
      place === 1 ? "border-amber-300/80" :
      place === 2 ? "border-slate-300/70" :
      place === 3 ? "border-orange-400/60" :
      "border-brand-gold/25"
    )}>
      {avatarImg ? (
        <Image src={avatarImg} alt={entry.name} width={32} height={32} className="object-cover w-full h-full" />
      ) : (
        <User size={14} className="text-brand-gold" />
      )}
    </div>
  );
}

export function LeaderboardTable({ entries, currentUserId, isLoading = false, scope }: LeaderboardTableProps) {
  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);

  if (isLoading) {
    return (
      <div className="space-y-3 animate-pulse">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-12 rounded-xl bg-white/5 border border-white/5" />
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
      {/* BANNER DEL LÍDER — sutil, tipográfico */}
      {leader && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center gap-3 px-4 py-3 rounded-xl border border-brand-gold/25 bg-brand-gold/5"
        >
          <span className="text-brand-gold"><Crown size={16} /></span>
          <div className="min-w-0">
            <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-brand-gold/60 mr-2">
              {scope === 'weekly' ? 'Líder de la semana' : 'Sabio supremo'}
            </span>
            <span className="text-sm font-serif font-bold text-brand-offwhite">{leader.name}</span>
          </div>
          <div className="ml-auto shrink-0 text-right">
            <div className="font-mono text-xs text-brand-gold">{formatXP(leader[xpKey])} XP</div>
            <div className="text-[9px] font-mono text-brand-offwhite/40">Nivel {leader.level}</div>
          </div>
        </motion.div>
      )}

      {/* PODIO — limpio, sin gradientes ni alturas forzadas */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-8 mb-10">
        {top3.map((entry) => {
          const meta = podiumMeta.find(m => m.place === top3.indexOf(entry) + 1)!;
          const isMe = entry.uid === currentUserId;
          return (
            <motion.div
              key={entry.uid}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: top3.indexOf(entry) * 0.1, type: 'spring', stiffness: 140, damping: 20 }}
              className={cn("flex flex-col items-center text-center px-4 py-4 w-32", meta.scale)}
            >
              <PodiumAvatar entry={entry} meta={meta} />
              <div className="mt-3 flex items-center gap-1.5">
                <span className="text-xs font-black font-serif text-brand-offwhite">{meta.place}</span>
                <span className={cn("text-[9px] font-mono uppercase tracking-wider", meta.ring.includes('amber') ? 'text-amber-300' : meta.ring.includes('slate') ? 'text-slate-300' : 'text-orange-400')}>
                  {meta.label}
                </span>
              </div>
              <div className={cn("mt-1 text-sm font-serif font-bold leading-tight max-w-[120px] truncate", isMe ? "text-brand-gold" : "text-brand-offwhite")}>
                {entry.name}
              </div>
              {isMe && (
                <span className="mt-0.5 text-[8px] font-mono text-brand-gold/70 uppercase tracking-widest">Tú</span>
              )}
              <div className="text-[10px] font-mono text-brand-offwhite/40 mt-0.5">
                {formatXP(entry[xpKey])} XP
              </div>
              <div className="flex items-center gap-2 mt-2 text-brand-offwhite/40">
                <span className="inline-flex items-center gap-0.5 text-[9px] font-mono"><Award size={9} className="text-brand-gold/60" />{entry.achievementsCount}</span>
                <span className="inline-flex items-center gap-0.5 text-[9px] font-mono"><Sparkles size={9} className="text-brand-gold/60" />{entry.relicsCount}</span>
                <span className="inline-flex items-center gap-0.5 text-[9px] font-mono"><Flame size={9} className="text-orange-400/70" />{entry.dailyStreak}</span>
              </div>
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
                <motion.tr
                  key={entry.uid}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.03, duration: 0.25 }}
                  className={cn(
                    "border-b border-white/5 transition-colors",
                    isMe ? "bg-brand-gold/10 border-brand-gold/30" : "hover:bg-white/5"
                  )}
                >
                  <td className="py-2.5 px-3 font-mono text-xs text-brand-offwhite/50">{place}</td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2.5">
                      <RowAvatar entry={entry} place={place} />
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
