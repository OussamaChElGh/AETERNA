'use client';
import React from 'react';
import { EnvironmentLayout, EnvironmentTheme } from '@/types/environmentEngine';
import { tileToScreen } from '@/lib/roomEngineStorage';

interface LargeModuleWallRendererProps {
  layout: EnvironmentLayout;
  theme: EnvironmentTheme;
}

export function LargeModuleWallRenderer({ layout, theme }: LargeModuleWallRendererProps) {
  const wallHeightPx = 170;
  const wallThicknessPx = 12; // 3D Wall Top Depth/Thickness (Grosor 3D de la pared)

  const pNWStart = tileToScreen(5, 5, 0);     // North corner (Wall join)
  const pNWEnd = tileToScreen(13, 5, 0);      // NW Wall end
  const pNEEnd = tileToScreen(25, 13, 0);     // NE Wall end

  // NW Wall Polygon (North-West Wall Section Module)
  const nwWallPoints = `${pNWStart.screenX},${pNWStart.screenY} ` +
                       `${pNWEnd.screenX},${pNWEnd.screenY} ` +
                       `${pNWEnd.screenX},${pNWEnd.screenY - wallHeightPx} ` +
                       `${pNWStart.screenX},${pNWStart.screenY - wallHeightPx}`;

  // NE Wall Polygon (North-East Wall Section Module)
  const neWallPoints = `${pNWStart.screenX},${pNWStart.screenY} ` +
                       `${pNEEnd.screenX},${pNEEnd.screenY} ` +
                       `${pNEEnd.screenX},${pNEEnd.screenY - wallHeightPx} ` +
                       `${pNWStart.screenX},${pNWStart.screenY - wallHeightPx}`;

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
      <defs>
        {/* Wall Masonry Illumination Gradients */}
        <linearGradient id="wall-nw-master" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#443930" />
          <stop offset="50%" stopColor="#352C25" />
          <stop offset="100%" stopColor="#241D18" />
        </linearGradient>

        <linearGradient id="wall-ne-master" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2D241D" />
          <stop offset="60%" stopColor="#1E1712" />
          <stop offset="100%" stopColor="#140E0A" />
        </linearGradient>

        <linearGradient id="gothic-glass-amber" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.95" />
          <stop offset="40%" stopColor="#F59E0B" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#78350F" stopOpacity="0.4" />
        </linearGradient>

        {/* Ambient Occlusion Drop Shadow behind Wall Base */}
        <filter id="wall-base-ao" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000000" floodOpacity="0.7" />
        </filter>
      </defs>

      {/* 1. NORTH-WEST WALL MODULE SECTION (Lit by window) */}
      <g filter="url(#wall-base-ao)">
        <polygon
          points={nwWallPoints}
          fill="url(#wall-nw-surface)"
          stroke="#17120E"
          strokeWidth="2"
        />

        {/* 3D Wall Top Depth Face (Grosor Superior 3D) */}
        <polygon
          points={`${pNWStart.screenX},${pNWStart.screenY - wallHeightPx} ${pNWEnd.screenX},${pNWEnd.screenY - wallHeightPx} ${pNWEnd.screenX + wallThicknessPx},${pNWEnd.screenY - wallHeightPx - 6} ${pNWStart.screenX + wallThicknessPx},${pNWStart.screenY - wallHeightPx - 6}`}
          fill="#52443A"
          stroke="#1F1712"
          strokeWidth="1"
        />

        {/* Hand-painted Stone Brick Mortar Horizontal Courses */}
        <line x1={pNWStart.screenX} y1={pNWStart.screenY - 45} x2={pNWEnd.screenX} y2={pNWEnd.screenY - 45} stroke="#1D1611" strokeWidth="1.2" opacity="0.6" />
        <line x1={pNWStart.screenX} y1={pNWStart.screenY - 95} x2={pNWEnd.screenX} y2={pNWEnd.screenY - 95} stroke="#1D1611" strokeWidth="1.2" opacity="0.6" />
        <line x1={pNWStart.screenX} y1={pNWStart.screenY - 145} x2={pNWEnd.screenX} y2={pNWEnd.screenY - 145} stroke="#1D1611" strokeWidth="1.2" opacity="0.6" />
      </g>

      {/* 2. NORTH-EAST WALL MODULE SECTION (Shaded) */}
      <g filter="url(#wall-base-ao)">
        <polygon
          points={neWallPoints}
          fill="url(#wall-ne-surface)"
          stroke="#120D09"
          strokeWidth="2"
        />

        {/* 3D Wall Top Depth Face (Grosor Superior 3D) */}
        <polygon
          points={`${pNWStart.screenX},${pNWStart.screenY - wallHeightPx} ${pNEEnd.screenX},${pNEEnd.screenY - wallHeightPx} ${pNEEnd.screenX - wallThicknessPx},${pNEEnd.screenY - wallHeightPx - 6} ${pNWStart.screenX - wallThicknessPx},${pNWStart.screenY - wallHeightPx - 6}`}
          fill="#3B2F26"
          stroke="#140E0A"
          strokeWidth="1"
        />

        {/* Hand-painted Stone Brick Mortar Horizontal Courses */}
        <line x1={pNWStart.screenX} y1={pNWStart.screenY - 45} x2={pNEEnd.screenX} y2={pNEEnd.screenY - 45} stroke="#110C08" strokeWidth="1.2" opacity="0.6" />
        <line x1={pNWStart.screenX} y1={pNWStart.screenY - 95} x2={pNEEnd.screenX} y2={pNEEnd.screenY - 95} stroke="#110C08" strokeWidth="1.2" opacity="0.6" />
        <line x1={pNWStart.screenX} y1={pNWStart.screenY - 145} x2={pNEEnd.screenX} y2={pNEEnd.screenY - 145} stroke="#110C08" strokeWidth="1.2" opacity="0.6" />
      </g>

      {/* 3. GOTHIC ARCH STAINED GLASS WINDOW MODULE */}
      <g transform={`translate(${(pNWStart.screenX + pNWEnd.screenX) / 2}, ${(pNWStart.screenY + pNWEnd.screenY) / 2 - 85})`}>
        {/* Outer Stone Frame Arch */}
        <path
          d="M -28,25 L -28,-20 Q 0,-60 28,-20 L 28,25 Z"
          fill="#1C1510"
          stroke="#D4AF37"
          strokeWidth="3"
        />
        {/* Inner Stained Glass Window Pane */}
        <path
          d="M -22,20 L -22,-16 Q 0,-50 22,-16 L 22,20 Z"
          fill="url(#gothic-glass-amber)"
        />
        {/* Wooden Window Tracery / Crossbars */}
        <line x1="0" y1="-45" x2="0" y2="20" stroke="#381D08" strokeWidth="3" />
        <line x1="-22" y1="-10" x2="22" y2="-10" stroke="#381D08" strokeWidth="2.5" />
      </g>

      {/* 4. HEAVY MAHOGANY CEILING BEAMS (Vigas de Madera Maciza) */}
      <polygon
        points={`${pNWStart.screenX},${pNWStart.screenY - wallHeightPx} ${pNWEnd.screenX},${pNWEnd.screenY - wallHeightPx} ${pNWEnd.screenX},${pNWEnd.screenY - wallHeightPx - 20} ${pNWStart.screenX},${pNWStart.screenY - wallHeightPx - 20}`}
        fill="#3D1D07"
        stroke="#1C0A00"
        strokeWidth="2"
      />
      <polygon
        points={`${pNWStart.screenX},${pNWStart.screenY - wallHeightPx} ${pNEEnd.screenX},${pNEEnd.screenY - wallHeightPx} ${pNEEnd.screenX},${pNEEnd.screenY - wallHeightPx - 20} ${pNWStart.screenX},${pNWStart.screenY - wallHeightPx - 20}`}
        fill="#270F02"
        stroke="#1C0A00"
        strokeWidth="2"
      />

      {/* 5. CORNER STRUCTURAL PILLAR MODULE */}
      <g>
        <polygon
          points={`${pNWStart.screenX - 12},${pNWStart.screenY} ${pNWStart.screenX + 12},${pNWStart.screenY} ${pNWStart.screenX + 12},${pNWStart.screenY - wallHeightPx - 20} ${pNWStart.screenX - 12},${pNWStart.screenY - wallHeightPx - 20}`}
          fill="#2A1203"
          stroke="#120600"
          strokeWidth="2"
        />
        {/* Gold Decorative Capital Accent */}
        <rect x={pNWStart.screenX - 14} y={pNWStart.screenY - wallHeightPx - 18} width="28" height="6" fill="#D4AF37" rx="1" />
      </g>
    </svg>
  );
}
