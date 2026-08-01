'use client';
import React from 'react';
import { EnvironmentLayout, EnvironmentTheme } from '@/types/environmentEngine';
import { tileToScreen } from '@/lib/roomEngineStorage';

interface LargeModuleFloorRendererProps {
  layout: EnvironmentLayout;
  theme: EnvironmentTheme;
}

export function LargeModuleFloorRenderer({ layout, theme }: LargeModuleFloorRendererProps) {
  // Bounding corners for ONE SINGLE COMPLETE FLOOR PLATFORM (FloorModule01)
  const pTop = tileToScreen(5, 5, 0);       // North corner (tileX: 5, tileY: 5)
  const pRight = tileToScreen(25, 5, 0);     // East corner (tileX: 25, tileY: 5)
  const pBottom = tileToScreen(25, 25, 0);   // South corner (tileX: 25, tileY: 25)
  const pLeft = tileToScreen(5, 25, 0);      // West corner (tileX: 5, tileY: 25)

  const floorPolygonPoints = `${pTop.screenX},${pTop.screenY} ${pRight.screenX},${pRight.screenY} ${pBottom.screenX},${pBottom.screenY} ${pLeft.screenX},${pLeft.screenY}`;

  const platformThicknessPx = 24; // 3D Elevated Base Rim Thickness

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-1">
        <defs>
          {/* FloorModule01: ONE SINGLE COMPLETE HAND-PAINTED PARQUET FLOOR IMAGE */}
          <linearGradient id="FloorModule01-surface" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#522C14" />
            <stop offset="35%" stopColor="#42220D" />
            <stop offset="70%" stopColor="#5C3117" />
            <stop offset="100%" stopColor="#301809" />
          </linearGradient>

          {/* 3D Platform Side Rim Gradients */}
          <linearGradient id="platform-rim-sw" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#331707" />
            <stop offset="100%" stopColor="#1C0A02" />
          </linearGradient>

          <linearGradient id="platform-rim-se" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#240F04" />
            <stop offset="100%" stopColor="#100501" />
          </linearGradient>

          {/* Floor Drop Shadow Filter */}
          <filter id="floor-drop-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="18" stdDeviation="14" floodColor="#000000" floodOpacity="0.65" />
          </filter>
        </defs>

        {/* 1. FLOOR PLATFORM AMBIENT DROP SHADOW */}
        <polygon
          points={`${pTop.screenX},${pTop.screenY + 28} ${pRight.screenX + 20},${pRight.screenY + 28} ${pBottom.screenX},${pBottom.screenY + 40} ${pLeft.screenX - 20},${pLeft.screenY + 28}`}
          fill="#000000"
          opacity="0.5"
          filter="blur(12px)"
        />

        {/* 2. 3D PLATFORM FRONT LEFT THICKNESS FACE (Canto Suroeste) */}
        <polygon
          points={`${pLeft.screenX},${pLeft.screenY} ${pBottom.screenX},${pBottom.screenY} ${pBottom.screenX},${pBottom.screenY + platformThicknessPx} ${pLeft.screenX},${pLeft.screenY + platformThicknessPx}`}
          fill="url(#platform-rim-sw)"
          stroke="#170A03"
          strokeWidth="1.5"
        />

        {/* 3. 3D PLATFORM FRONT RIGHT THICKNESS FACE (Canto Sureste) */}
        <polygon
          points={`${pBottom.screenX},${pBottom.screenY} ${pRight.screenX},${pRight.screenY} ${pRight.screenX},${pRight.screenY + platformThicknessPx} ${pBottom.screenX},${pBottom.screenY + platformThicknessPx}`}
          fill="url(#platform-rim-se)"
          stroke="#0D0401"
          strokeWidth="1.5"
        />

        {/* 4. FloorModule01 — ONE SINGLE COMPLETE FLOOR IMAGE (Zero Tile Subdivisions!) */}
        <g filter="url(#floor-drop-shadow)">
          {/* Primary Unified Floor Surface */}
          <polygon
            points={floorPolygonPoints}
            fill="url(#FloorModule01-surface)"
            stroke="#210D04"
            strokeWidth="2.5"
          />

          {/* Hand-painted Wood Board Stripes Across the Entire Single Floor Image */}
          <line x1={pTop.screenX + 60} y1={pTop.screenY + 30} x2={pLeft.screenX + 60} y2={pLeft.screenY + 30} stroke="#2E1507" strokeWidth="1.5" opacity="0.6" />
          <line x1={pTop.screenX + 120} y1={pTop.screenY + 60} x2={pLeft.screenX + 120} y2={pLeft.screenY + 60} stroke="#2E1507" strokeWidth="1.5" opacity="0.6" />
          <line x1={pTop.screenX + 180} y1={pTop.screenY + 90} x2={pLeft.screenX + 180} y2={pLeft.screenY + 90} stroke="#2E1507" strokeWidth="1.5" opacity="0.6" />
          <line x1={pTop.screenX + 240} y1={pTop.screenY + 120} x2={pLeft.screenX + 240} y2={pLeft.screenY + 120} stroke="#2E1507" strokeWidth="1.5" opacity="0.6" />
          <line x1={pTop.screenX + 300} y1={pTop.screenY + 150} x2={pLeft.screenX + 300} y2={pLeft.screenY + 150} stroke="#2E1507" strokeWidth="1.5" opacity="0.6" />
          <line x1={pTop.screenX + 360} y1={pTop.screenY + 180} x2={pLeft.screenX + 360} y2={pLeft.screenY + 180} stroke="#2E1507" strokeWidth="1.5" opacity="0.6" />

          {/* Bevel Rim Highlights */}
          <line x1={pTop.screenX} y1={pTop.screenY} x2={pRight.screenX} y2={pRight.screenY} stroke="#85461E" strokeWidth="1.5" opacity="0.6" />
          <line x1={pTop.screenX} y1={pTop.screenY} x2={pLeft.screenX} y2={pLeft.screenY} stroke="#85461E" strokeWidth="1.5" opacity="0.6" />
        </g>

        {/* 5. CONTINUOUS WOODEN BASEBOARD TRIMS ALONG WALL JOINTS */}
        <polygon
          points={`${pTop.screenX},${pTop.screenY} ${pRight.screenX},${pRight.screenY} ${pRight.screenX},${pRight.screenY - 12} ${pTop.screenX},${pTop.screenY - 12}`}
          fill="#270F02"
          stroke="#140600"
          strokeWidth="1"
        />
        <polygon
          points={`${pLeft.screenX},${pLeft.screenY} ${pTop.screenX},${pTop.screenY} ${pTop.screenX},${pTop.screenY - 12} ${pLeft.screenX},${pLeft.screenY - 12}`}
          fill="#1C0A01"
          stroke="#0D0300"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
}
