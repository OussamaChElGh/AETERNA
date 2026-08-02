'use client';
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Swords, Trophy, BookOpen, Zap } from 'lucide-react';
import { useChallenges } from '@/context/ChallengeContext';
import { CHALLENGE_TYPES, type ChallengeType, CHALLENGE_TARGETS, createChallenge } from '@/lib/challenges';
import { cn } from '@/lib/utils';

interface Props {
  challengerUid: string;
  challengerName: string;
  isOpen: boolean;
  onClose: () => void;
}

const TYPE_ICONS: Record<ChallengeType, typeof Trophy> = {
  xp_race: Trophy,
  articles_race: BookOpen,
  level_race: Zap,
};

const TYPE_TARGETS: Record<ChallengeType, number[]> = {
  xp_race: [1000, 5000, 10000],
  articles_race: [3, 5, 10],
  level_race: [5, 10, 15],
};

const TYPE_TARGET_UNITS: Record<ChallengeType, string> = {
  xp_race: 'XP',
  articles_race: 'artículos',
  level_race: 'nivel',
};

export function CreateChallengeModal({ challengerUid, challengerName, isOpen, onClose }: Props) {
  const { createChallenge } = useChallenges();
  const [type, setType] = useState<ChallengeType>('xp_race');
  const [target, setTarget] = useState(1000);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  if (!isOpen) return null;

  const handleCreate = async () => {
    setSending(true);
    const id = await createChallenge(challengerUid, type, target);
    setSending(false);
    if (id) {
      setSent(true);
      setTimeout(() => { onClose(); setSent(false); }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-sm bg-brand-ink border border-brand-gold/20 rounded-2xl p-6">
        <button onClick={onClose} className="absolute top-3 right-3 p-1.5 rounded-full bg-white/5 text-brand-offwhite/50 hover:text-brand-gold transition-colors">
          <X size={14} />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <Swords size={18} className="text-brand-gold" />
          <h3 className="font-serif text-lg text-brand-offwhite">Retar a {challengerName}</h3>
        </div>

        {/* Challenge type */}
        <div className="mb-4">
          <label className="text-[9px] font-mono uppercase tracking-wider text-brand-offwhite/40 mb-2 block">Tipo de reto</label>
          <div className="flex gap-2">
            {(Object.entries(CHALLENGE_TYPES) as [ChallengeType, typeof CHALLENGE_TYPES['xp_race']][]).map(([key, info]) => {
              const Icon = TYPE_ICONS[key];
              return (
                <button key={key} onClick={() => setType(key)}
                  className={cn(
                    "flex-1 flex flex-col items-center gap-1 p-2 rounded-xl border transition-all",
                    type === key ? "bg-brand-gold text-brand-ink border-brand-gold" : "bg-white/5 border-white/10 text-brand-offwhite/50 hover:text-brand-gold"
                  )}>
                  <Icon size={16} />
                  <span className="text-[9px] font-mono font-bold uppercase">{info.emoji} {info.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Target */}
        <div className="mb-6">
          <label className="text-[9px] font-mono uppercase tracking-wider text-brand-offwhite/40 mb-2 block">Objetivo</label>
          <div className="flex gap-2">
            {TYPE_TARGETS[type].map((t) => (
              <button key={t} onClick={() => setTarget(t)}
                className={cn(
                  "flex-1 py-2 rounded-lg border text-[10px] font-mono font-bold transition-all",
                  target === t ? "bg-brand-gold/20 border-brand-gold/60 text-brand-gold" : "bg-white/5 border-white/10 text-brand-offwhite/50 hover:text-brand-gold"
                )}>
                {t} {TYPE_TARGET_UNITS[type]}
              </button>
            ))}
          </div>
        </div>

        {sent ? (
          <div className="text-center py-2 text-brand-gold font-mono text-xs font-bold uppercase tracking-wider">
            ✓ ¡Reto enviado!
          </div>
        ) : (
          <button onClick={handleCreate} disabled={sending}
            className="w-full py-2.5 rounded-xl bg-brand-gold text-brand-ink font-mono text-xs font-bold uppercase tracking-wider hover:bg-brand-gold/90 transition-all disabled:opacity-50">
            {sending ? 'Enviando...' : 'Enviar reto ⚔️'}
          </button>
        )}
      </div>
    </div>
  );
}
