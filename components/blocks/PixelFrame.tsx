'use client';
import React from 'react';
import { cn } from '@/lib/utils';

interface PixelFrameProps {
  children: React.ReactNode;
  className?: string;
  accent?: string;
  bgClass?: string;
  dense?: boolean;
}

/**
 * PixelFrame — placa compacta estilo "ficha de inventario 8-bit".
 * Pequeña, sin sombras gigantes, con barra superior pixelada (dithering)
 * y borde de un solo píxel. Distinta de las tarjetas grandes: es una placa.
 */
export function PixelFrame({
  children,
  className,
  accent = '#D4AF37',
  bgClass = 'bg-[#FAF6EC] dark:bg-[#1A1712]',
  dense = false
}: PixelFrameProps) {
  return (
    <div
      className={cn(
        "relative w-full border-2 overflow-hidden",
        dense ? "p-3" : "p-4 md:p-5",
        bgClass,
        className
      )}
      style={{ borderColor: accent }}
    >
      {/* Top pixel dithering bar */}
      <div
        className="absolute top-0 left-0 right-0 h-2"
        style={{
          backgroundImage:
            `linear-gradient(90deg, ${accent} 25%, transparent 25%, transparent 50%, ${accent} 50%, ${accent} 75%, transparent 75%)`,
          backgroundSize: '8px 8px',
          opacity: 0.9
        }}
      />
      {/* Subtle diagonal hatch across the plate */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)',
          backgroundSize: '10px 10px'
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
