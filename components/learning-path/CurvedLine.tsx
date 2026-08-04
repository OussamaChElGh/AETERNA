'use client';
import React from 'react';
import { motion } from 'motion/react';

interface CurvedLineProps {
  fromY?: number;
  toY?: number;
  startX?: number;
  color?: string;
  thickness?: number;
  dashOffset?: number;
  variant?: 'solid' | 'dashed' | 'glow';
}

export function CurvedLine({
  fromY = 0,
  toY = 60,
  startX = 28,
  color = '#6B7280',
  thickness = 2.5,
  variant = 'solid',
}: CurvedLineProps) {
  const cp1x = startX + 16;
  const cp1y = fromY + (toY - fromY) * 0.35;
  const cp2x = startX + 16;
  const cp2y = fromY + (toY - fromY) * 0.65;

  const path = `M ${startX} ${fromY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${startX} ${toY}`;

  const strokeDash = variant === 'dashed' ? '6,4' : undefined;

  return (
    <svg
      className="absolute top-0 left-0 w-full pointer-events-none overflow-visible"
      style={{ height: `${toY + 10}px`, zIndex: 0 }}
    >
      {/* Glow underlayer */}
      {variant === 'glow' && (
        <motion.path
          d={path}
          fill="none"
          stroke={color}
          strokeWidth={thickness * 3}
          strokeLinecap="round"
          opacity={0.15}
          style={{ filter: `blur(4px)` }}
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      )}

      {/* Main line */}
      <motion.path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={thickness}
        strokeLinecap="round"
        strokeDasharray={strokeDash}
        opacity={variant === 'dashed' ? 0.5 : 0.6}
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
      />
    </svg>
  );
}
