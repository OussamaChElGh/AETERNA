'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Atom } from 'lucide-react';

interface Particle {
  id: number;
  left: number;
  top: number;
  size: number;
  delay: number;
  duration: number;
  drift: number;
  rise: number;
  kind: 'dot' | 'sparkle' | 'atom';
}

export function PixelParticles({ count = 18 }: { count?: number }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: 5 + Math.random() * 85,
        size: 5 + Math.random() * 7,
        delay: Math.random() * 8,
        duration: 8 + Math.random() * 10,
        drift: -30 + Math.random() * 60,
        rise: -70 - Math.random() * 60,
        kind: (['dot', 'sparkle', 'atom'] as const)[i % 3],
      }))
    );
  }, [count]);

  return (
    <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden" aria-hidden>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, y: 0, x: 0 }}
          animate={{ opacity: [0, 0.9, 0], y: [0, p.rise], x: [0, p.drift] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute"
          style={{ left: `${p.left}%`, top: `${p.top}%` }}
        >
          {p.kind === 'dot' && (
            <div
              className="rounded-none bg-[#D4AF37] border border-black/20 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.15)]"
              style={{ width: p.size, height: p.size }}
            />
          )}
          {p.kind === 'sparkle' && (
            <Sparkles
              className="text-[#D4AF37] drop-shadow-[0_0_6px_rgba(212,175,55,0.8)]"
              style={{ width: p.size * 2.6, height: p.size * 2.6 }}
            />
          )}
          {p.kind === 'atom' && (
            <Atom
              className="text-brand-gold drop-shadow-[0_0_6px_rgba(212,175,55,0.8)]"
              style={{ width: p.size * 3, height: p.size * 3 }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
}
