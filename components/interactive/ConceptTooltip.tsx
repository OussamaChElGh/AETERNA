'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConceptTooltipProps {
  term: string;
  definition: string;
  tags?: string[];
  children: React.ReactNode;
}

export function ConceptTooltip({ term, definition, tags = [], children }: ConceptTooltipProps) {
  const [show, setShow] = useState(false);
  const [mounted, setMounted] = useState(false);
  const wrapRef = useRef<HTMLSpanElement>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [pos, setPos] = useState<{ left: number; top: number; placement: 'top' | 'bottom' } | null>(null);

  useEffect(() => {
    setMounted(true);
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);

  const computePosition = useCallback(() => {
    const wrap = wrapRef.current;
    if (!wrap || typeof window === 'undefined') return;
    const rect = wrap.getBoundingClientRect();
    const tooltipWidth = 260;
    let left = rect.left + rect.width / 2 - tooltipWidth / 2;
    left = Math.max(8, Math.min(window.innerWidth - tooltipWidth - 8, left));
    const spaceBelow = window.innerHeight - rect.bottom;
    const placement: 'top' | 'bottom' = spaceBelow < 220 ? 'top' : 'bottom';
    const top = placement === 'bottom' ? rect.bottom + 10 : rect.top - 10;
    setPos({ left, top, placement });
  }, []);

  const handleEnter = useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    computePosition();
    setShow(true);
  }, [computePosition]);

  const handleLeave = useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setShow(false), 250);
  }, []);

  useEffect(() => {
    if (!show) return;
    const handler = () => computePosition();
    window.addEventListener('scroll', handler, true);
    window.addEventListener('resize', handler);
    return () => {
      window.removeEventListener('scroll', handler, true);
      window.removeEventListener('resize', handler);
    };
  }, [show, computePosition]);

  return (
    <span
      ref={wrapRef}
      className="relative inline-block cursor-help"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <span className="border-b-2 border-dotted border-[#D4AF37]/70 text-amber-700 dark:text-amber-300 font-medium transition-colors hover:bg-amber-100 dark:hover:bg-amber-950/50 hover:text-amber-900 dark:hover:text-amber-200 px-0.5 rounded-sm">
        {children}
      </span>

      {mounted &&
        createPortal(
          show && pos ? (
            <div
              style={{ left: pos.left, top: pos.top }}
              className={cn(
                "pointer-events-none fixed z-[9999] w-[260px] p-3 bg-[#FAF6EC] dark:bg-[#1A1712] border-2 border-[#D4AF37] shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_rgba(212,175,55,0.4)] rounded-sm",
                pos.placement === 'top' && "translate-y-[-100%]"
              )}
            >
              <div className={cn(
                "absolute left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-[#FAF6EC] dark:bg-[#1A1712] border-r-2 border-b-2 border-[#D4AF37] rotate-45",
                pos.placement === 'top' ? "-bottom-[6px]" : "-top-[6px]"
              )} />

              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded bg-[#D4AF37] flex items-center justify-center text-black shrink-0 mt-0.5">
                  <BookOpen size={13} />
                </div>
                <div>
                  <span className="block font-serif font-bold text-sm text-brand-ink dark:text-amber-100 leading-tight">
                    {term}
                  </span>
                  {tags.length > 0 && (
                    <span className="block mt-0.5 text-[9px] font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400">
                      {tags.join(' · ')}
                    </span>
                  )}
                </div>
              </div>

              <p className="mt-2 font-sans text-xs leading-relaxed text-brand-ink/90 dark:text-amber-100/90">
                {definition}
              </p>
            </div>
          ) : null,
          document.body
        )}
    </span>
  );
}
