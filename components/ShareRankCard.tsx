'use client';
import React, { useRef, useState } from 'react';
import Image from 'next/image';
import html2canvas from 'html2canvas';
import { Share2, Download, X, Copy, Check, Trophy, Crown, Sparkles, Flame } from 'lucide-react';
import { AVATARS } from '@/context/GamificationContext';
import { formatXP } from '@/context/GamificationContext';
import { cn } from '@/lib/utils';

interface ShareRankCardProps {
  name: string;
  photoURL?: string;
  avatarId: string;
  rank: number;
  xp: number;
  weeklyXp: number;
  level: number;
  scope: 'global' | 'weekly';
  achievementsCount?: number;
  relicsCount?: number;
  dailyStreak?: number;
}

function getAvatarImage(avatarId: string): string {
  const av = AVATARS.find(a => a.id === avatarId);
  return av?.image || '';
}

export function ShareRankCard(props: ShareRankCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleShare = async () => {
    setIsOpen(true);
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#09090B',
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((b) => resolve(b!), 'image/png');
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `aeterna-ranking-${props.scope}.png`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Error generando imagen:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNativeShare = async () => {
    if (!cardRef.current || !navigator.canShare) return;
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#09090B',
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((b) => resolve(b!), 'image/png');
      });
      const file = new File([blob], `aeterna-ranking-${props.scope}.png`, { type: 'image/png' });
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Mi ranking en AETERNA',
          text: `¡Estoy en el puesto #${props.rank} del ranking ${props.scope === 'weekly' ? 'semanal' : 'global'} de AETERNA!`,
        });
      } else {
        await handleDownload();
      }
    } catch (e) {
      console.error('Error compartiendo:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin + '/clasificacion');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const avatarImg = getAvatarImage(props.avatarId);
  const xpKey = props.scope === 'weekly' ? 'weeklyXp' : 'xp';
  const xpValue = props.scope === 'weekly' ? props.weeklyXp : props.xp;

  return (
    <>
      <button
        onClick={handleShare}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-brand-gold/30 text-brand-gold text-[10px] font-mono font-bold uppercase tracking-wider hover:bg-brand-gold hover:text-brand-ink transition-all"
      >
        <Share2 size={12} />
        Compartir
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative max-w-lg w-full">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute -top-2 -right-2 z-10 p-2 rounded-full bg-brand-ink border border-brand-gold/30 text-brand-gold hover:bg-brand-gold hover:text-brand-ink transition-all"
            >
              <X size={16} />
            </button>

            <div className="bg-brand-ink border border-brand-gold/20 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-lg text-brand-offwhite">Compartir mi ranking</h3>
                <span className={cn(
                  "text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full border",
                  props.scope === 'weekly'
                    ? "text-brand-cosmic border-brand-cosmic/30"
                    : "text-brand-gold border-brand-gold/30"
                )}>
                  {props.scope === 'weekly' ? 'Semanal' : 'Global'}
                </span>
              </div>

              <div ref={cardRef} className="relative rounded-xl overflow-hidden border border-brand-gold/20 bg-brand-ink" style={{ width: 600, height: 400 }}>
                <div className="absolute inset-0 bg-engraving opacity-30" />
                <div className="relative h-full flex flex-col p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-brand-gold/60 mb-1">
                        {props.scope === 'weekly' ? 'Ranking Semanal' : 'Ranking Global'}
                      </div>
                      <div className="font-serif text-3xl text-brand-offwhite font-bold">
                        AETERNA
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-brand-offwhite/40">
                        Puesto
                      </div>
                      <div className="font-serif text-5xl font-black text-brand-gold">
                        #{props.rank}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-5 mb-6">
                    <div className="relative shrink-0 w-20 h-20 rounded-full border-2 border-brand-gold/40 overflow-hidden bg-brand-gold/10">
                      {avatarImg ? (
                        <Image src={avatarImg} alt={props.name} width={80} height={80} className="object-cover w-full h-full" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-brand-gold text-2xl font-serif font-bold">
                          {props.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-serif text-xl text-brand-offwhite font-bold truncate mb-1">
                        {props.name}
                      </div>
                      <div className="flex items-center gap-3 text-xs font-mono text-brand-offwhite/60">
                        <span className="flex items-center gap-1">
                          <Sparkles size={12} className="text-brand-gold" />
                          Nivel {props.level}
                        </span>
                        <span className="flex items-center gap-1">
                          <Trophy size={12} className="text-brand-gold" />
                          {formatXP(xpValue)} XP
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-center">
                      <div className="text-[9px] font-mono uppercase tracking-wider text-brand-offwhite/40 mb-1">
                        Logros
                      </div>
                      <div className="text-lg font-serif font-bold text-brand-gold">
                        {props.achievementsCount || 0}
                      </div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-center">
                      <div className="text-[9px] font-mono uppercase tracking-wider text-brand-offwhite/40 mb-1">
                        Reliquias
                      </div>
                      <div className="text-lg font-serif font-bold text-brand-gold">
                        {props.relicsCount || 0}
                      </div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-center">
                      <div className="text-[9px] font-mono uppercase tracking-wider text-brand-offwhite/40 mb-1">
                        Racha
                      </div>
                      <div className="text-lg font-serif font-bold text-orange-400 flex items-center justify-center gap-1">
                        <Flame size={14} />
                        {props.dailyStreak || 0}
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto pt-4 border-t border-brand-gold/20 flex items-center justify-between">
                    <div className="text-[9px] font-mono uppercase tracking-widest text-brand-offwhite/40">
                      aeterna.app
                    </div>
                    {props.scope === 'weekly' ? (
                      <Crown size={16} className="text-brand-cosmic" />
                    ) : (
                      <Trophy size={16} className="text-brand-gold" />
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-4">
                {navigator.canShare ? (
                  <button
                    onClick={handleNativeShare}
                    disabled={isGenerating}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border border-brand-gold/40 text-brand-gold font-mono text-xs font-bold uppercase tracking-wider hover:bg-brand-gold hover:text-brand-ink transition-all disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <div className="w-4 h-4 border-2 border-brand-gold border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Share2 size={14} />
                    )}
                    {isGenerating ? 'Generando...' : 'Compartir'}
                  </button>
                ) : (
                  <button
                    onClick={handleDownload}
                    disabled={isGenerating}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border border-brand-gold/40 text-brand-gold font-mono text-xs font-bold uppercase tracking-wider hover:bg-brand-gold hover:text-brand-ink transition-all disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <div className="w-4 h-4 border-2 border-brand-gold border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Download size={14} />
                    )}
                    {isGenerating ? 'Generando...' : 'Descargar PNG'}
                  </button>
                )}
                <button
                  onClick={handleCopyLink}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-white/10 text-brand-offwhite/70 font-mono text-xs font-bold uppercase tracking-wider hover:text-brand-gold hover:border-brand-gold/30 transition-all"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? 'Copiado' : 'Link'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
