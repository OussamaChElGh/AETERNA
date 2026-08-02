'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Trophy, ChevronRight, User, Flame, Share2 } from 'lucide-react';
import { AVATARS } from '@/context/GamificationContext';
import { formatXP } from '@/context/GamificationContext';
import type { LeaderboardEntry } from '@/lib/leaderboard';
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

function Row({ entry, place, isMe }: { entry: LeaderboardEntry; place: number; isMe?: boolean }) {
  const avatarImg = getAvatarImage(entry.avatarId);
  return (
    <div
      className={cn(
        "flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors",
        isMe ? "bg-brand-gold/10 border border-brand-gold/30" : "hover:bg-white/5"
      )}
    >
      <span className="w-6 text-right font-mono text-[10px] text-brand-offwhite/50">{place}</span>
      <div className={cn(
        "relative shrink-0 w-7 h-7 rounded-full border overflow-hidden flex items-center justify-center bg-brand-gold/10",
        place === 1 ? "border-amber-300/80" :
        place === 2 ? "border-slate-300/70" :
        place === 3 ? "border-orange-400/60" :
        "border-brand-gold/25"
      )}>
        {avatarImg ? (
          <Image src={avatarImg} alt={entry.name} width={28} height={28} className="object-cover" />
        ) : (
          <User size={14} className="text-brand-gold" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className={cn("text-[11px] font-serif font-bold truncate", isMe ? "text-brand-gold" : "text-brand-offwhite")}>
          {entry.name}
          {isMe && <span className="ml-1 text-[8px] font-mono text-brand-gold/60 uppercase">· Tú</span>}
        </div>
      </div>
      <div className="text-right shrink-0">
        <div className="text-[10px] font-mono text-brand-gold">Nv. {entry.level}</div>
        <div className="text-[9px] font-mono text-brand-offwhite/40">{formatXP(entry.xp)} XP</div>
      </div>
    </div>
  );
}

export function MiniLeaderboard({ entries, currentUserId, currentUserRank, isLoading, scope, currentUserData }: MiniLeaderboardProps) {
  const top = entries.slice(0, 5);
  const me = currentUserId ? entries.find(e => e.uid === currentUserId) : undefined;
  const hasMeInTop = !!me;

  return (
    <div className="bg-brand-ink/80 border border-brand-gold/20 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Trophy size={16} className="text-brand-gold" />
          <h3 className="font-serif text-lg text-brand-offwhite">Clasificación</h3>
        </div>
        {scope === 'weekly' && (
          <span className="text-[8px] font-mono uppercase tracking-widest text-brand-gold/60 border border-brand-gold/20 rounded-full px-2 py-0.5">
            Semanal
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-2 animate-pulse">
          {[...Array(5)].map((_, i) => <div key={i} className="h-9 rounded-lg bg-white/5" />)}
        </div>
      ) : top.length === 0 ? (
        <p className="text-[11px] text-brand-offwhite/40 font-serif py-4 text-center">
          La clasificación se llena con los primeros sabios.
        </p>
      ) : (
        <>
          <div className="space-y-1">
            {top.map((entry, idx) => (
              <Row key={entry.uid} entry={entry} place={idx + 1} isMe={entry.uid === currentUserId} />
            ))}
          </div>

          {!hasMeInTop && currentUserId && currentUserRank && (
            <>
              <div className="my-2 flex items-center gap-2 text-brand-offwhite/30">
                <div className="flex-1 border-t border-dashed border-brand-offwhite/10" />
                <span className="text-[9px] font-mono">···</span>
                <div className="flex-1 border-t border-dashed border-brand-offwhite/10" />
              </div>
              {me && <Row entry={me} place={currentUserRank} isMe />}
            </>
          )}

          <div className="mt-3 flex items-center gap-2">
            {currentUserData && currentUserRank && (
              <ShareRankCard
                name={currentUserData.name}
                photoURL={currentUserData.photoURL}
                avatarId={currentUserData.avatarId}
                rank={currentUserRank}
                xp={currentUserData.xp}
                weeklyXp={currentUserData.weeklyXp}
                level={currentUserData.level}
                scope={scope}
                achievementsCount={currentUserData.achievementsCount}
                relicsCount={currentUserData.relicsCount}
                dailyStreak={currentUserData.dailyStreak}
              />
            )}
            <Link
              href="/clasificacion"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-brand-gold/30 text-brand-gold text-[11px] font-mono font-bold uppercase tracking-wider hover:bg-brand-gold hover:text-brand-ink transition-all group"
            >
              Ver completa
              <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
