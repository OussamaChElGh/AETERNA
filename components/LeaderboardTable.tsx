'use client';
import React from 'react';
import { motion } from 'motion/react';
import { Crown, Medal, Flame, Award, User, Sparkles, TrendingUp, Zap } from 'lucide-react';
import { AVATARS } from '@/context/GamificationContext';
import { formatXP } from '@/context/GamificationContext';
import { cn } from '@/lib/utils';
import { getLeague, LEAGUES, type League, type LeagueId } from '@/lib/leaderboard';
import type { LeaderboardEntry } from '@/lib/leaderboard';

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

function getXPProgress(entry: LeaderboardEntry, scope: 'global' | 'weekly'): number {
  const xp = scope === 'weekly' ? entry.weeklyXp : entry.xp;
  const levelXp = deriveLevelXP(entry.level);
  const nextLevelXp = deriveLevelXP(entry.level + 1);
  return Math.min(1, (xp - levelXp) / (nextLevelXp - levelXp));
}

function deriveLevelXP(level: number): number {
  const xpBase = 15000;
  const multiplier = 1.0415;
  if (level <= 1) return 0;
  return Math.round(xpBase * (Math.pow(multiplier, level - 1) - 1));
}

function LeagueBadge({ league, rank }: { league: League; rank: number }) {
  return (
    <div className={cn(
      "flex items-center gap-1 px-2 py-0.5 rounded-full border text-[9px] font-mono font-bold uppercase tracking-wider",
      league.border, league.bg, league.text
    )}>
      <span>{league.emoji}</span>
      <span>{league.name}</span>
    </div>
  );
}

function RankGlow({ rank, children }: { rank: number; children: React.ReactNode }) {
  const league = getLeague(rank);
  return (
    <div className="relative">
      <div className={cn(
        "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 blur-xl",
        rank === 1 ? 'bg-amber-300' :
        rank <= 3 ? 'bg-brand-cosmic' :
        rank <= 10 ? 'bg-sky-400' :
        'bg-brand-gold/30'
      )} />
      {children}
    </div>
  );
}

function XPCircle({ entry, scope }: { entry: LeaderboardEntry; scope: 'global' | 'weekly' }) {
  const progress = getXPProgress(entry, scope);
  const league = getLeague(typeof entry === 'object' && 'uid' in entry ? 0 : 0);
  const circumference = 2 * Math.PI * 18;

  return (
    <div className="relative shrink-0 w-12 h-12">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 44 44">
        <circle
          cx="22" cy="22" r="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className="text-white/5"
        />
        <circle
          cx="22" cy="22" r="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - progress)}
          className={cn(
            "transition-all duration-700",
            entry.uid === 'me' ? 'text-brand-gold' : 'text-brand-cosmic'
          )}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[9px] font-mono font-bold text-brand-offwhite/80">{entry.level}</span>
      </div>
    </div>
  );
}

export function LeaderboardTable({ entries, currentUserId, isLoading = false, scope }: LeaderboardTableProps) {
  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);
  const xpKey = scope === 'weekly' ? 'weeklyXp' : 'xp';

  if (isLoading) {
    return (
      <div className="space-y-3 animate-pulse">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-20 rounded-2xl bg-white/5 border border-white/5" />
        ))}
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-20 h-20 mx-auto rounded-full bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center mb-4">
          <Crown size={32} className="text-brand-gold/40" />
        </div>
        <p className="text-brand-offwhite/40 font-serif text-lg">Aún no hay sabios en esta clasificación</p>
      </div>
    );
  }

  // Calcular ligas para top 3
  const leaderLeague = getLeague(1);

  return (
    <div className="space-y-4">
      {/* ─── PODIO TOP 3 ─── */}
      <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6">
        {/* 2nd place */}
        {top3[1] && (
          <PodiumCard entry={top3[1]} rank={2} isMe={top3[1].uid === currentUserId} scope={scope} />
        )}
        {/* 1st place */}
        {top3[0] && (
          <PodiumCard entry={top3[0]} rank={1} isMe={top3[0].uid === currentUserId} scope={scope} highlight />
        )}
        {/* 3rd place */}
        {top3[2] && (
          <PodiumCard entry={top3[2]} rank={3} isMe={top3[2].uid === currentUserId} scope={scope} />
        )}
      </div>

      {/* ─── LEAGUE BAR ─── */}
      <div className="flex items-center gap-2 px-2 py-2 mb-2 overflow-x-auto scrollbar-none">
        {Object.entries(LEAGUES).map(([id, league]) => (
          <div key={id} className={cn(
            "flex items-center gap-1 px-2 py-0.5 rounded-full border text-[8px] font-mono font-bold uppercase tracking-wider shrink-0",
            league.border, league.bg, league.text
          )}>
            <span>{league.emoji}</span>
            <span>{league.name}</span>
          </div>
        ))}
      </div>

      {/* ─── RANKING LIST ─── */}
      <div className="space-y-2">
        {rest.map((entry, idx) => {
          const place = idx + 4;
          const isMe = entry.uid === currentUserId;
          const league = getLeague(place);

          return (
            <motion.div
              key={entry.uid}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04, duration: 0.3 }}
              className={cn(
                "group relative flex items-center gap-3 p-3 rounded-2xl border transition-all duration-300 hover:scale-[1.01]",
                isMe
                  ? "bg-brand-gold/10 border-brand-gold/40"
                  : "bg-white/[0.02] border-white/5 hover:bg-white/[0.04] hover:border-white/10"
              )}
            >
              {/* Rank number */}
              <div className="w-8 text-center">
                <span className={cn(
                  "font-mono text-sm font-black",
                  place <= 10 ? "text-brand-gold" : "text-brand-offwhite/40"
                )}>
                  {place}
                </span>
                {place <= 10 && (
                  <div className="text-[7px] font-mono text-brand-offwhite/30">TOP</div>
                )}
              </div>

              {/* Avatar */}
              <div
                className={cn(
                  "relative w-10 h-10 rounded-full border-2 overflow-hidden flex items-center justify-center shrink-0",
                  league.glow,
                  isMe ? "border-brand-gold" : league.border
                )}
              >
                {getAvatarImage(entry.avatarId) ? (
                  <img
                    src={getAvatarImage(entry.avatarId)}
                    alt={entry.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={18} className={league.icon} />
                )}
                {isMe && (
                  <div className="absolute -bottom-0.5 inset-x-0 flex justify-center">
                    <div className="bg-brand-gold text-brand-ink text-[6px] font-mono font-bold px-1 rounded">TÚ</div>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "text-xs font-serif font-bold truncate",
                    isMe ? "text-brand-gold" : "text-brand-offwhite"
                  )}>
                    {entry.name}
                  </span>
                  {entry.dailyStreak >= 7 && (
                    <Flame size={12} className="text-orange-400 shrink-0" />
                  )}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] font-mono text-brand-offwhite/40">
                    Nv.{entry.level}
                  </span>
                  <span className="text-[8px] font-mono text-brand-offwhite/20">·</span>
                  <span className="text-[10px] font-mono text-brand-offwhite/40 flex items-center gap-0.5">
                    <Award size={9} className="text-brand-gold/50" />
                    {entry.achievementsCount}
                  </span>
                  <span className="text-[8px] font-mono text-brand-offwhite/20">·</span>
                  <span className="text-[10px] font-mono text-brand-offwhite/40 flex items-center gap-0.5">
                    <Sparkles size={9} className="text-brand-gold/50" />
                    {entry.relicsCount}
                  </span>
                </div>
              </div>

              {/* XP */}
              <div className="text-right shrink-0">
                <div className="text-xs font-mono font-bold text-brand-gold">
                  {formatXP(entry[xpKey])}
                </div>
                <div className="text-[8px] font-mono text-brand-offwhite/30">XP</div>
              </div>

              {/* League badge */}
              <div className="hidden sm:block">
                <LeagueBadge league={league} rank={place} />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ─── PODIUM CARD ────────────────────────────────────────────────────────

function PodiumCard({
  entry,
  rank,
  isMe,
  scope,
  highlight = false,
}: {
  entry: LeaderboardEntry;
  rank: number;
  isMe: boolean;
  scope: 'global' | 'weekly';
  highlight?: boolean;
}) {
  const league = getLeague(rank);
  const xpKey = scope === 'weekly' ? 'weeklyXp' : 'xp';
  const progress = getXPProgress(entry, scope);
  const avatarImg = getAvatarImage(entry.avatarId);

  const rankColors = {
    1: { icon: Crown, shadow: 'shadow-[0_0_30px_rgba(251,191,36,0.25)]', ring: 'border-amber-300', badge: 'bg-amber-300 text-amber-950', label: 'Leyenda', color: '#fbbf24' },
    2: { icon: Medal, shadow: 'shadow-[0_0_20px_rgba(14,165,233,0.2)]', ring: 'border-brand-cosmic', badge: 'bg-brand-cosmic text-brand-ink', label: 'Diamante', color: '#0ea5e9' },
    3: { icon: Medal, shadow: 'shadow-[0_0_20px_rgba(56,189,248,0.15)]', ring: 'border-sky-400', badge: 'bg-sky-400 text-sky-950', label: 'Platino', color: '#38bdf8' },
  }[rank];

  if (!rankColors) return null;
  const Icon = rankColors.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.15, type: 'spring', stiffness: 120, damping: 18 }}
      className={cn(
        "relative rounded-2xl border bg-brand-ink/80 backdrop-blur-sm p-3 md:p-4 flex flex-col items-center text-center transition-all duration-300 hover:scale-[1.02]",
        rank === 1 ? "border-amber-300/50 order-1" :
        rank === 2 ? "border-brand-cosmic/40 order-0" :
        "border-sky-400/30 order-2",
        highlight && rankColors.shadow
      )}
    >
      {/* Crown/Medal icon top */}
      <div className={cn(
        "absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full border-2 border-brand-ink flex items-center justify-center",
        rankColors.badge
      )}>
        <Icon size={12} />
      </div>

      {/* Rank label */}
      <div className="text-[8px] font-mono font-bold uppercase tracking-widest mt-1 opacity-60"
        style={{ color: rank === 1 ? '#fbbf24' : rank === 2 ? '#0ea5e9' : '#38bdf8' }}>
        #{rank} · {rankColors.label}
      </div>

      {/* Avatar */}
      <div className={cn(
        "relative mt-2 w-14 h-14 md:w-16 md:h-16 rounded-full border-2 overflow-hidden flex items-center justify-center",
        rankColors.ring,
        highlight ? "ring-2 ring-amber-300/30 ring-offset-2 ring-offset-brand-ink" : "",
        rankColors.shadow
      )}>
        {avatarImg ? (
          <img src={avatarImg} alt={entry.name} className="w-full h-full object-cover" />
        ) : (
          <User size={24} className="text-brand-gold/60" />
        )}
      </div>

      {/* Name */}
      <div className={cn(
        "mt-2 text-xs md:text-sm font-serif font-bold truncate max-w-full px-1",
        isMe ? "text-brand-gold" : "text-brand-offwhite"
      )}>
        {entry.name}
      </div>
      {isMe && (
        <div className="text-[7px] font-mono text-brand-gold/70 uppercase tracking-widest">Tú</div>
      )}

      {/* Level + XP */}
      <div className="mt-1.5 flex items-center gap-2">
        <div className="flex items-center gap-1 text-[10px] font-mono font-bold">
          <Sparkles size={10} className="text-brand-gold" />
          <span className="text-brand-offwhite">Nv.{entry.level}</span>
        </div>
      </div>

      {/* XP amount */}
      <div className="text-base md:text-lg font-mono font-black text-brand-gold mt-0.5">
        {formatXP(entry[xpKey])}
        <span className="text-[8px] font-normal text-brand-offwhite/40 ml-1">XP</span>
      </div>

      {/* Progress bar */}
      <div className="w-full mt-2 flex items-center gap-2">
        <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.8, delay: rank * 0.2 + 0.3, ease: 'easeOut' }}
            className={cn(
              "h-full rounded-full",
              rank === 1 ? "bg-gradient-to-r from-amber-300 to-amber-400" :
              rank === 2 ? "bg-gradient-to-r from-brand-cosmic to-cyan-400" :
              "bg-gradient-to-r from-sky-400 to-sky-500"
            )}
          />
        </div>
        <span className="text-[9px] font-mono text-brand-offwhite/40">{Math.round(progress * 100)}%</span>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-2 mt-2 text-[9px] font-mono text-brand-offwhite/40">
        <span className="flex items-center gap-1"><Award size={9} className="text-brand-gold/60" />{entry.achievementsCount}</span>
        <span className="flex items-center gap-0.5"><Sparkles size={9} className="text-brand-gold/60" />{entry.relicsCount}</span>
        {entry.dailyStreak > 0 && (
          <span className="flex items-center gap-0.5"><Flame size={9} className="text-orange-400/70" />{entry.dailyStreak}</span>
        )}
      </div>
    </motion.div>
  );
}
