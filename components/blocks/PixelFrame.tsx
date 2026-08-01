'use client';
import React from 'react';
import { cn } from '@/lib/utils';

interface PixelFrameProps {
  children: React.ReactNode;
  className?: string;
  borderColor?: string;
  shadowColor?: string;
  innerColor?: string;
  bgClass?: string;
  accent?: string;
}

/**
 * PixelFrame: marco 8-bit para bloques de Aeterna.
 * - Doble borde duro (exterior 4px + interior 2px)
 * - Esquinas "mordidas" estilo sprite (cuadrados en cada esquina)
 * - Textura checkerboard de píxel en el fondo
 * - Sombra dura desplazada (hard offset shadow)
 */
export function PixelFrame({
  children,
  className,
  borderColor = '#D4AF37',
  shadowColor = '#000',
  innerColor = '#000',
  bgClass = 'bg-[#FAF6EC] dark:bg-[#1A1712]',
  accent = '#8B6914'
}: PixelFrameProps) {
  return (
    <div className={cn("relative", className)}>
      {/* Outer hard shadow + thick pixel border */}
      <div
        className="relative border-4"
        style={{
          borderColor,
          boxShadow: `8px 8px 0 0 ${shadowColor}`,
          color: accent
        }}
      >
        {/* Pixel checkerboard texture (whole block) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: 0.08,
            backgroundImage:
              'linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)',
            backgroundSize: '14px 14px',
            backgroundPosition: '0 0, 7px 7px'
          }}
        />

        {/* Inner thin border (double-line pixel look) */}
        <div className="absolute inset-1.5 border-2 pointer-events-none" style={{ borderColor: innerColor, opacity: 0.35 }} />

        {/* Corner sprites (pixel corners) */}
        <span className="absolute -top-2 -left-2 w-4 h-4 z-20" style={{ background: borderColor }} aria-hidden="true" />
        <span className="absolute -top-2 -right-2 w-4 h-4 z-20" style={{ background: borderColor }} aria-hidden="true" />
        <span className="absolute -bottom-2 -left-2 w-4 h-4 z-20" style={{ background: borderColor }} aria-hidden="true" />
        <span className="absolute -bottom-2 -right-2 w-4 h-4 z-20" style={{ background: borderColor }} aria-hidden="true" />

        <div className={cn("relative z-10 p-6 md:p-8 space-y-5", bgClass)}>
          {children}
        </div>
      </div>
    </div>
  );
}
