'use client';
import React from 'react';
import { motion } from 'motion/react';

interface ConstellationLinesProps {
  active: boolean;
}

export function ConstellationLines({ active }: ConstellationLinesProps) {
  if (!active) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Top connecting line */}
      <motion.div
        initial={{ opacity: 0, scaleY: 0 }}
        animate={{ opacity: 1, scaleY: 1 }}
        exit={{ opacity: 0, scaleY: 0 }}
        className="absolute top-0 left-1/2 w-[1px] h-6 -translate-x-1/2"
        style={{
          background: 'linear-gradient(to bottom, rgba(34,211,238,0.5), transparent)',
          boxShadow: '0 0 8px rgba(34,211,238,0.3)',
        }}
      />
      {/* Bottom connecting line */}
      <motion.div
        initial={{ opacity: 0, scaleY: 0 }}
        animate={{ opacity: 1, scaleY: 1 }}
        exit={{ opacity: 0, scaleY: 0 }}
        className="absolute -bottom-1 left-1/2 w-[1px] h-6 -translate-x-1/2"
        style={{
          background: 'linear-gradient(to top, rgba(34,211,238,0.5), transparent)',
          boxShadow: '0 0 8px rgba(34,211,238,0.3)',
        }}
      />
      {/* Sparkle dots along the line */}
      <motion.div
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="absolute top-2 left-1/2 w-1.5 h-1.5 -translate-x-1/2 rounded-full bg-cyan-400 shadow-[0_0_6px_#22D3EE]"
      />
      <motion.div
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 1.2, repeat: Infinity, delay: 0.5 }}
        className="absolute bottom-2 left-1/2 w-1.5 h-1.5 -translate-x-1/2 rounded-full bg-cyan-300 shadow-[0_0_6px_#67E8F9]"
      />
    </div>
  );
}
