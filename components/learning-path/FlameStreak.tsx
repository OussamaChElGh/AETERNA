'use client';
import React from 'react';
import { cn } from '@/lib/utils';

interface FlameStreakProps {
  streak: number;
  className?: string;
}

export function FlameStreak({ streak, className }: FlameStreakProps) {
  if (streak < 3) return null;

  const flameIntensity = Math.min(streak / 10, 1);

  return (
    <div className={cn("relative inline-flex items-center", className)}>
      {/* Outer glow */}
      <div
        className="absolute inset-0 rounded-full blur-md"
        style={{
          background: `radial-gradient(circle, rgba(251,146,60,${0.3 * flameIntensity}) 0%, transparent 70%)`,
          transform: 'scale(1.8)',
        }}
      />
      {/* SVG Flame */}
      <svg
        width="18" height="22" viewBox="0 0 18 22"
        className="relative"
        style={{ filter: `drop-shadow(0 0 ${4 + streak}px rgba(251,146,60,0.6))` }}
      >
        <defs>
          <linearGradient id={`flame-grad-${streak}`} x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#F97316" />
            <stop offset="40%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#FEF08A" />
          </linearGradient>
        </defs>
        <path
          d="M9 22 C9 22 2 16 2 11 C2 7 4 5 6 3 C7 5 8 7 9 8 C10 7 11 5 12 3 C14 5 16 7 16 11 C16 16 9 22 9 22Z"
          fill={`url(#flame-grad-${streak})`}
          style={{
            animation: 'fire-flicker 0.15s ease-in-out infinite',
            transformOrigin: 'center bottom',
          }}
        />
        {/* Inner flame */}
        <path
          d="M9 20 C9 20 4 15 4 11 C4 8.5 5.5 7 7 5.5 C7.5 7 8 8 9 8.5 C10 8 10.5 7 11 5.5 C12.5 7 14 8.5 14 11 C14 15 9 20 9 20Z"
          fill="#FEF08A" opacity="0.7"
          style={{
            animation: 'fire-flicker 0.12s ease-in-out infinite',
            transformOrigin: 'center bottom',
          }}
        />
      </svg>
      <span className="ml-1 font-mono font-black text-sm text-orange-400">
        {streak}
      </span>
    </div>
  );
}
