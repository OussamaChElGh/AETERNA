'use client';
import React from 'react';
import Link from 'next/link';
import { Trophy, ChevronRight, User, Flame, Crown, Sparkles } from 'lucide-react';
import { AVATARS } from '@/context/GamificationContext';
import { formatXP } from '@/context/GamificationContext';
import type { LeaderboardEntry } from '@/lib/leaderboard';
import { getLeague, LEAGUES, type LeagueId } from '@/lib/leaderboard';
import { cn } from '@/lib/utils';
import { ShareRankCard } from '@/components/ShareRankCard';

interface MiniLeaderboardProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
  currentUserRank?: number | null;
  isLoading?: boolean;
  scope: 'global' | 'weekly';
  currentUserData?: {
    name: string;
    photoURL?: string;
    avatarId: string;
    xp: number;
    weeklyXp: number;
    level: number;
    achievementsCount?: number;
    relicsCount?: number;
    dailyStreak?: number;
  };
}

function getAvatarImage(avatarId: string): string {
  const av = AVATARS.find(a => a.id === avatarId);
  return av?.image || '';
}

function Row({ entry, place, isMe, scope }: { entry: LeaderboardEntry; place: number; isMe?: boolean; scope: 'global' | 'weekly' }) {
  const league = getLeague(place);
  const avatarImg = getAvatarImage(entry.avatarId);

  return (
    <div className={cn(
      "flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all border",
      isMe
        ? "bg-brand-gold/10 border-brand-gold/30"
        : "bg-transparent border-transparent hover:bg-white/[0.04] hover:border-white/5"
    )}>
      <span className="w-5 text-right font-mono text-[10px] font-black"
        style={{ color: place <= 3 ? (place === 1 ? '#fbbf24' : place === 2 ? '#0ea5e9' : '#38bdf8') : 'rgba(245,245,240,0.3)' }}>
        {place}
      </span>
      <div className={cn(
        "relative shrink-0 w-7 h-7 rounded-full border overflow-hidden flex items-center justify-center",
        place === 1 ? "border-amber-300/80 shadow-[0_0_8px_rgba(251,191,36,0.2)]" :
        place === 2 ? "border-brand-cosmic/70 shadow-[0_0_8px_rgba(14,165,233,0.15)]" :
        place === 3 ? "border-sky-400/50" :
        "border-white/10"
      )}>
        {avatarImg ? (
          <img src={avatarImg} alt={entry.name} className="w-full h-full object-cover" />
        ) : (
          <User size={12} className="text-brand-gold/50" />
        )}
        {isMe && (
          <div className="absolute -bottom-0.5 inset-x-0 flex justify-center">
            <span className="text-[5px] font-mono font-bold bg-brand-gold text-brand-ink px-0.5 rounded">TÚ</span>
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className={cn("text-[10px] font-serif font-bold truncate", isMe ? "text-brand-gold" : "text-brand-offwhite")}>
          {entry.name}
        </div>
      </div>
      <div className="text-right shrink-0">
        <div className="text-[9px] font-mono font-bold text-brand-gold">
          {formatXP(scope === 'weekly' ? entry.weeklyXp : entry.xp)}
        </div>
        <div className="text-[7px] font-mono text-brand-offwhite/30">Nv.{entry.level}</div>
      </div>
    </div>
  );
}

export function MiniLeaderboard({ entries, currentUserId, currentUserRank, isLoading, scope, currentUserData }: MiniLeaderboardProps) {
  const top = entries.slice(0, 5);
  const me = currentUserId ? entries.find(e => e.uid === currentUserId) : undefined;
  const hasMeInTop = !!me;

  return (
    <div className="bg-brand-ink/80 border border-brand-gold/20 rounded-2xl p-4 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center">
            <Trophy size={14} className="text-brand-gold" />
          </div>
          <div>
            <h3 className="font-serif text-sm text-brand-offwhite font-bold leading-tight">Clasificación</h3>
            <div className="flex items-center gap-1 text-[8px] font-mono text-brand-offwhite/40">
              {scope === 'weekly' ? (
                <><Crown size={8} className="text-brand-cosmic" /> Semanal</>
              ) : (
                <><Trophy size={8} className="text-brand-gold" /> Global</>
              )}
            </div>
          </div>
        </div>
        {currentUserRank && (
          <div className="flex items-center gap-1 text-xs font-mono font-black">
            <span className="text-brand-offwhite/40">#</span>
            <span className="text-brand-gold">{currentUserRank}</span>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-2 animate-pulse">
          {[...Array(5)].map((_, i) => <div key={i} className="h-9 rounded-xl bg-white/5" />)}
        </div>
      ) : top.length === 0 ? (
        <p className="text-[10px] text-brand-offwhite/40 font-serif py-4 text-center">La clasificación se llena con los primeros sabios.</p>
      ) : (
        <>
          <div className="space-y-1">
            {top.map((entry, idx) => (
              <Row key={entry.uid} entry={entry} place={idx + 1} isMe={entry.uid === currentUserId} scope={scope} />
            ))}
          </div>

          {!hasMeInTop && currentUserId && currentUserRank && me && (
            <>
              <div className="my-2 flex items-center gap-2 text-brand-offwhite/20">
                <div className="flex-1 border-t border-dashed border-brand-offwhite/10" />
                <span className="text-[8px] font-mono">···</span>
                <div className="flex-1 border-t border-dashed border-brand-offwhite/10" />
              </div>
              <Row entry={me} place={currentUserRank} isMe scope={scope} />
            </>
          )}

          <div className="mt-3 flex items-center gap-2">
            {currentUserData && currentUserRank && (
              <ShareRankCard
                name={currentUserData.name} photoURL={currentUserData.photoURL} avatarId={currentUserData.avatarId}
                rank={currentUserRank} xp={currentUserData.xp} weeklyXp={currentUserData.weeklyXp}
                level={currentUserData.level} scope={scope}
                achievementsCount={currentUserData.achievementsCount} relicsCount={currentUserData.relicsCount}
                dailyStreak={currentUserData.dailyStreak}
              />
            )}
            <Link href="/clasificacion" className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-brand-gold/30 text-brand-gold text-[10px] font-mono font-bold uppercase tracking-wider hover:bg-brand-gold hover:text-brand-ink transition-all group">
              Ver completa
              <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
