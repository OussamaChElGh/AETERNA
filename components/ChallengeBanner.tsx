'use client';
import React from 'react';
import { motion } from 'motion/react';
import { Swords, Trophy, BookOpen, Zap, Check, Circle } from 'lucide-react';
import { useChallenges } from '@/context/ChallengeContext';
import { CHALLENGE_TYPES, type Challenge, type ChallengeType } from '@/lib/challenges';
import { cn } from '@/lib/utils';

const TYPE_ICONS: Record<ChallengeType, typeof Trophy> = {
  xp_race: Trophy,
  articles_race: BookOpen,
  level_race: Zap,
};

const TYPE_UNITS: Record<ChallengeType, string> = {
  xp_race: 'XP',
  articles_race: 'artículos',
  level_race: 'nivel',
};

function ChallengeItem({ challenge, currentUserId }: { challenge: Challenge; currentUserId: string }) {
  const { acceptChallenge } = useChallenges();
  const isMe = (uid: string) => uid === currentUserId;
  const amCreator = isMe(challenge.creator);
  const myProgress = amCreator ? challenge.creatorProgress : challenge.challengerProgress;
  const theirProgress = amCreator ? challenge.challengerProgress : challenge.creatorProgress;
  const Icon = TYPE_ICONS[challenge.type];
  const total = challenge.target;
  const myPct = Math.min(100, (myProgress / total) * 100);
  const theirPct = Math.min(100, (theirProgress / total) * 100);

  return (
    <div className={cn(
      "rounded-2xl border-2 p-4 transition-all",
      challenge.status === 'active'
        ? "border-brand-gold/40 bg-brand-gold/5"
        : "border-white/10 bg-white/[0.02]"
    )}>
      <div className="flex items-center gap-2 mb-3">
        <Icon size={16} className="text-brand-gold" />
        <span className="font-serif text-sm text-brand-offwhite font-bold">
          {CHALLENGE_TYPES[challenge.type].emoji} {CHALLENGE_TYPES[challenge.type].label}
        </span>
        <span className="ml-auto text-[8px] font-mono uppercase tracking-wider text-brand-offwhite/30">
          Meta: {total} {TYPE_UNITS[challenge.type]}
        </span>
      </div>

      {/* Progress bars */}
      <div className="space-y-2 mb-3">
        <div>
          <div className="flex items-center justify-between text-[9px] font-mono text-brand-offwhite/40 mb-0.5">
            <span>{amCreator ? 'Tú' : 'Rival'}</span>
            <span>{myProgress}/{total}</span>
          </div>
          <div className="h-2 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${myPct}%` }}
              transition={{ duration: 0.5 }}
              className="h-full rounded-full bg-gradient-to-r from-brand-gold to-amber-400"
            />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between text-[9px] font-mono text-brand-offwhite/40 mb-0.5">
            <span>{amCreator ? 'Rival' : 'Rival'}</span>
            <span>{theirProgress}/{total}</span>
          </div>
          <div className="h-2 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${theirPct}%` }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="h-full rounded-full bg-brand-cosmic/50"
            />
          </div>
        </div>
      </div>

      {/* Status / action */}
      <div className="flex items-center justify-between">
        {challenge.status === 'pending' ? (
          <>
            <span className="text-[9px] font-mono text-brand-offwhite/40">
              {amCreator ? 'Esperando aceptación...' : 'Reto pendiente'}
            </span>
            {!amCreator && (
              <button
                onClick={() => challenge.id && acceptChallenge(challenge.id)}
                className="px-3 py-1 rounded-lg bg-brand-gold text-brand-ink text-[9px] font-mono font-bold uppercase tracking-wider hover:bg-brand-gold/90 transition-all"
              >
                ¡Aceptar!
              </button>
            )}
          </>
        ) : (
          <span className="text-[9px] font-mono text-brand-cosmic uppercase tracking-wider">
            ⚔️ En combate
          </span>
        )}
      </div>
    </div>
  );
}

export function ChallengeBanner({ currentUserId }: { currentUserId: string }) {
  const { challenges, isLoading } = useChallenges();

  if (isLoading || challenges.length === 0) return null;

  return (
    <div className="mb-6 space-y-3">
      <div className="flex items-center gap-2">
        <Swords size={14} className="text-brand-gold" />
        <h3 className="text-[10px] font-mono uppercase tracking-wider text-brand-offwhite/40">
          Retos activos ({challenges.length})
        </h3>
      </div>
      {challenges.map((c) => (
        <ChallengeItem key={c.id} challenge={c} currentUserId={currentUserId} />
      ))}
    </div>
  );
}
