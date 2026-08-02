'use client';
import React, { useRef, useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { Share2, Download, X, Copy, Check, Trophy, Crown, Sparkles, Flame, AlertCircle, ImageIcon } from 'lucide-react';
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

const SOCIALS = [
  {
    id: 'twitter',
    label: 'X',
    url: (text: string, link: string) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(link)}`,
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    id: 'facebook',
    label: 'Facebook',
    url: (text: string, link: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}&quote=${encodeURIComponent(text)}`,
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    url: (text: string, link: string) =>
      `https://wa.me/?text=${encodeURIComponent(text + ' ' + link)}`,
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    ),
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    url: (text: string, link: string) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(link)}`,
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    id: 'telegram',
    label: 'Telegram',
    url: (text: string, link: string) =>
      `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(text)}`,
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
      </svg>
    ),
  },
];

export function ShareRankCard(props: ShareRankCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [origin, setOrigin] = useState('');

  const shareText = `¡Estoy en el puesto #${props.rank} del ranking ${props.scope === 'weekly' ? 'semanal' : 'global'} de AETERNA con ${formatXP(props.scope === 'weekly' ? props.weeklyXp : props.xp)} XP!`;
  const shareUrl = origin + '/clasificacion';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  const generateImage = async () => {
    if (!cardRef.current) return;
    setIsGenerating(true);
    setImageError(false);
    // Clonar el card fuera de la vista para que html2canvas lo capture bien
    const clone = cardRef.current.cloneNode(true) as HTMLElement;
    clone.style.position = 'fixed';
    clone.style.left = '-9999px';
    clone.style.top = '0';
    clone.style.width = '600px';
    clone.style.height = '400px';
    clone.style.transform = 'none';
    clone.style.zIndex = '99999';
    document.body.appendChild(clone);

    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const canvas = await html2canvas(clone, {
        backgroundColor: '#09090B',
        scale: 2,
        allowTaint: true,
        logging: false,
      });
      setImageDataUrl(canvas.toDataURL('image/png'));
      setShowImagePreview(true);
    } catch (e) {
      console.error('Error generando imagen:', e);
      setImageError(true);
    } finally {
      document.body.removeChild(clone);
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setShowImagePreview(false);
      setImageDataUrl(null);
      setImageError(false);
    }
  }, [isOpen]);

  const handleDownload = () => {
    if (!imageDataUrl) return;
    const a = document.createElement('a');
    a.href = imageDataUrl;
    a.download = `aeterna-ranking-${props.scope}.png`;
    a.click();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  };

  const handleNativeShare = async () => {
    if (!imageDataUrl) {
      await generateImage();
      return;
    }
    try {
      const blob = await fetch(imageDataUrl).then(r => r.blob());
      const file = new File([blob], `aeterna-ranking-${props.scope}.png`, { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: 'Mi ranking en AETERNA', text: shareText });
      } else {
        handleDownload();
      }
    } catch {
      handleDownload();
    }
  };

  const avatarImg = getAvatarImage(props.avatarId);
  const xpValue = props.scope === 'weekly' ? props.weeklyXp : props.xp;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-brand-gold/30 text-brand-gold text-[10px] font-mono font-bold uppercase tracking-wider hover:bg-brand-gold hover:text-brand-ink transition-all"
      >
        <Share2 size={12} />
        Compartir
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-md my-8">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute -top-2 -right-2 z-10 p-2 rounded-full bg-brand-ink border border-brand-gold/30 text-brand-gold hover:bg-brand-gold hover:text-brand-ink transition-all"
            >
              <X size={16} />
            </button>

            <div className="bg-brand-ink border border-brand-gold/20 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-lg text-brand-offwhite">Compartir ranking</h3>
                <span className={cn(
                  "text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full border",
                  props.scope === 'weekly'
                    ? "text-brand-cosmic border-brand-cosmic/30"
                    : "text-brand-gold border-brand-gold/30"
                )}>
                  {props.scope === 'weekly' ? 'Semanal' : 'Global'}
                </span>
              </div>

              {/* Stats preview */}
              <div className="mb-4 flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="relative shrink-0 w-12 h-12 rounded-full border-2 border-brand-gold/40 overflow-hidden bg-brand-gold/10 flex items-center justify-center">
                  {avatarImg ? (
                    <img src={avatarImg} alt={props.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-brand-gold text-lg font-serif font-bold">
                      {props.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-serif text-sm text-brand-offwhite font-bold truncate">{props.name}</div>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-brand-offwhite/50 mt-0.5">
                    <span>#{props.rank}</span>
                    <span>·</span>
                    <span>Nivel {props.level}</span>
                    <span>·</span>
                    <span>{formatXP(xpValue)} XP</span>
                  </div>
                </div>
              </div>

              {/* Social media buttons — siempre visibles */}
              <div className="mb-4">
                <p className="text-[9px] font-mono uppercase tracking-wider text-brand-offwhite/40 mb-2">
                  Compartir en redes
                </p>
                <div className="grid grid-cols-5 gap-2">
                  {SOCIALS.map(s => (
                    <a
                      key={s.id}
                      href={s.url(shareText, shareUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        e.preventDefault();
                        window.open(s.url(shareText, shareUrl), s.id, 'width=600,height=400');
                      }}
                      className="flex flex-col items-center gap-1 p-2 rounded-lg border border-white/10 hover:border-brand-gold/30 hover:bg-white/5 transition-all text-brand-offwhite/70 hover:text-brand-offwhite"
                      title={`Compartir en ${s.label}`}
                    >
                      {s.icon}
                      <span className="text-[8px] font-mono text-brand-offwhite/50">{s.label}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Image generation & download */}
              <div className="border-t border-brand-gold/10 pt-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[9px] font-mono uppercase tracking-wider text-brand-offwhite/40">
                    Imagen para compartir
                  </p>
                  {!imageDataUrl && !isGenerating && (
                    <button
                      onClick={generateImage}
                      className="flex items-center gap-1 text-[9px] font-mono text-brand-gold/60 hover:text-brand-gold transition-colors"
                    >
                      <ImageIcon size={12} />
                      Generar
                    </button>
                  )}
                </div>

                {isGenerating && (
                  <div className="flex items-center justify-center gap-2 py-3 text-brand-gold/60">
                    <div className="w-4 h-4 border-2 border-brand-gold border-t-transparent rounded-full animate-spin" />
                    <span className="text-[10px] font-mono">Generando...</span>
                  </div>
                )}

                {imageError && (
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-red-500/10 text-red-400 text-[10px]">
                    <AlertCircle size={14} />
                    Error al generar. Intenta de nuevo.
                  </div>
                )}

                {imageDataUrl && showImagePreview && (
                  <div className="space-y-2">
                    <img
                      src={imageDataUrl}
                      alt="Ranking preview"
                      className="w-full rounded-lg border border-brand-gold/20"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleDownload}
                        className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border border-brand-gold/40 text-brand-gold text-[10px] font-mono font-bold uppercase tracking-wider hover:bg-brand-gold hover:text-brand-ink transition-all"
                      >
                        <Download size={14} />
                        Descargar PNG
                      </button>
                      {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
                        <button
                          onClick={handleNativeShare}
                          className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-brand-gold/40 text-brand-gold text-[10px] font-mono font-bold uppercase tracking-wider hover:bg-brand-gold hover:text-brand-ink transition-all"
                        >
                          <Share2 size={14} />
                          Compartir
                        </button>
                      )}
                      <button
                        onClick={handleCopyLink}
                        className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg border border-white/10 text-brand-offwhite/70 text-[10px] font-mono font-bold uppercase tracking-wider hover:text-brand-gold hover:border-brand-gold/30 transition-all"
                      >
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Card off-screen for html2canvas */}
              <div
                ref={cardRef}
                className="fixed left-[-9999px] top-0 z-[-1] rounded-xl overflow-hidden border border-brand-gold/20 bg-brand-ink"
                style={{ width: 600, height: 400 }}
              >
                <div className="absolute inset-0 bg-engraving opacity-30" />
                <div className="relative h-full flex flex-col p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-brand-gold/60 mb-1">
                        {props.scope === 'weekly' ? 'Ranking Semanal' : 'Ranking Global'}
                      </div>
                      <div className="font-serif text-3xl text-brand-offwhite font-bold">AETERNA</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-brand-offwhite/40">Puesto</div>
                      <div className="font-serif text-5xl font-black text-brand-gold">#{props.rank}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-5 mb-6">
                    <div className="relative shrink-0 w-20 h-20 rounded-full border-2 border-brand-gold/40 overflow-hidden bg-brand-gold/10 flex items-center justify-center">
                      {avatarImg ? (
                        <img src={avatarImg} alt={props.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-brand-gold text-2xl font-serif font-bold">
                          {props.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-serif text-xl text-brand-offwhite font-bold truncate mb-1">{props.name}</div>
                      <div className="flex items-center gap-3 text-xs font-mono text-brand-offwhite/60">
                        <span className="flex items-center gap-1"><Sparkles size={12} className="text-brand-gold" />Nivel {props.level}</span>
                        <span className="flex items-center gap-1"><Trophy size={12} className="text-brand-gold" />{formatXP(xpValue)} XP</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-center">
                      <div className="text-[9px] font-mono uppercase tracking-wider text-brand-offwhite/40 mb-1">Logros</div>
                      <div className="text-lg font-serif font-bold text-brand-gold">{props.achievementsCount || 0}</div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-center">
                      <div className="text-[9px] font-mono uppercase tracking-wider text-brand-offwhite/40 mb-1">Reliquias</div>
                      <div className="text-lg font-serif font-bold text-brand-gold">{props.relicsCount || 0}</div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-center">
                      <div className="text-[9px] font-mono uppercase tracking-wider text-brand-offwhite/40 mb-1">Racha</div>
                      <div className="text-lg font-serif font-bold text-orange-400 flex items-center justify-center gap-1">
                        <Flame size={14} />{props.dailyStreak || 0}
                      </div>
                    </div>
                  </div>
                  <div className="mt-auto pt-4 border-t border-brand-gold/20 flex items-center justify-between">
                    <div className="text-[9px] font-mono uppercase tracking-widest text-brand-offwhite/40">aeterna.app</div>
                    {props.scope === 'weekly' ? (
                      <Crown size={16} className="text-brand-cosmic" />
                    ) : (
                      <Trophy size={16} className="text-brand-gold" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
