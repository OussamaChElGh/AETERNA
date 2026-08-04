'use client';
import React, { useMemo } from 'react';
import { Sparkles } from 'lucide-react';

const GOLD_SHADES = ['#FDE047', '#D4AF37', '#F59E0B', '#EAB308', '#CA8A04'];
const CYAN_SHADES = ['#22D3EE', '#06B6D4', '#0891B2', '#67E8F9'];
const VIOLET_SHADES = ['#A855F7', '#8B5CF6', '#C084FC'];
const COLORS = [...GOLD_SHADES, ...CYAN_SHADES, ...VIOLET_SHADES];

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
  drift: number;
}

export function FloatingParticles() {
  const particles = useMemo(() => {
    const list: Particle[] = [];
    for (let i = 0; i < 25; i++) {
      list.push({
        id: i,
        x: Math.random() * 100,
        y: 30 + Math.random() * 70,
        size: 3 + Math.random() * 8,
        duration: 6 + Math.random() * 14,
        delay: Math.random() * 10,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        drift: (Math.random() - 0.5) * 80,
      });
    }
    return list;
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            bottom: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}40`,
            animation: `float-particle ${p.duration}s ${p.delay}s ease-out infinite`,
            '--drift': `${p.drift}px`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
