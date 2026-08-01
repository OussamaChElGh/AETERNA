'use client';
import React from 'react';
import { EnvironmentLayout, EnvironmentTheme } from '@/types/environmentEngine';
import { tileToScreen } from '@/lib/roomEngineStorage';

interface WallRendererProps {
  layout: EnvironmentLayout;
  theme: EnvironmentTheme;
}

export function WallRenderer({ layout, theme }: WallRendererProps) {
  const wallFaces: React.ReactNode[] = [];
  const windowsAndDetails: React.ReactNode[] = [];
  const ceilingBeams: React.ReactNode[] = [];

  const wallHeightPx = 150;

  layout.wallSegments.forEach(segment => {
    const isNorthWest = segment.facingDirection === 'north_west';

    for (let x = segment.startTile.tileX; x <= segment.endTile.tileX; x++) {
      for (let y = segment.startTile.tileY; y <= segment.endTile.tileY; y++) {
        const basePos = tileToScreen(x, y, 0);
        const nextPos = tileToScreen(x + (isNorthWest ? 1 : 0), y + (isNorthWest ? 0 : 1), 0);

        const points = `${basePos.screenX},${basePos.screenY} ` +
                       `${nextPos.screenX},${nextPos.screenY} ` +
                       `${nextPos.screenX},${nextPos.screenY - wallHeightPx} ` +
                       `${basePos.screenX},${basePos.screenY - wallHeightPx}`;

        // Color shading: Left wall catches window key light (#3D332B), Right wall is shaded (#26201B)
        const fillShade = isNorthWest ? '#382F28' : '#241D18';

        wallFaces.push(
          <g key={`wall-face-${segment.id}-${x}-${y}`}>
            {/* Masonry Block Surface */}
            <polygon
              points={points}
              fill={fillShade}
              stroke="#17120E"
              strokeWidth="1.5"
            />

            {/* Hand-painted Stone Brick Mortar Patterns */}
            <line
              x1={basePos.screenX}
              y1={basePos.screenY - 45}
              x2={nextPos.screenX}
              y2={nextPos.screenY - 45}
              stroke="#1A1410"
              strokeWidth="1"
              strokeOpacity="0.5"
            />
            <line
              x1={basePos.screenX}
              y1={basePos.screenY - 95}
              x2={nextPos.screenX}
              y2={nextPos.screenY - 95}
              stroke="#1A1410"
              strokeWidth="1"
              strokeOpacity="0.5"
            />
          </g>
        );

        // Render Gothic Arch Window Module on North-West Wall
        if (isNorthWest && x === 8) {
          const winCenterX = (basePos.screenX + nextPos.screenX) / 2;
          const winCenterY = (basePos.screenY + nextPos.screenY) / 2 - 75;

          windowsAndDetails.push(
            <g key={`wall-window-${x}-${y}`}>
              {/* Window Outer Arch Frame */}
              <ellipse
                cx={winCenterX}
                cy={winCenterY - 15}
                rx="22"
                ry="35"
                fill="#120D0A"
                stroke="#D4AF37"
                strokeWidth="2.5"
              />
              {/* Stained Glass Golden Warm Reflection */}
              <ellipse
                cx={winCenterX}
                cy={winCenterY - 15}
                rx="18"
                ry="30"
                fill="url(#window-glass-grad)"
              />
              {/* Window Wooden Lattice Cross */}
              <line x1={winCenterX} y1={winCenterY - 45} x2={winCenterX} y2={winCenterY + 15} stroke="#381D08" strokeWidth="2" />
              <line x1={winCenterX - 18} y1={winCenterY - 15} x2={winCenterX + 18} y2={winCenterY - 15} stroke="#381D08" strokeWidth="2" />
            </g>
          );
        }
      }
    }
  });

  // Render Heavy Solid Wood Ceiling Beams (Vigas de Madera Maciza)
  const beamStart = tileToScreen(5, 5, 0);
  const beamEndNW = tileToScreen(12, 5, 0);
  const beamEndNE = tileToScreen(25, 12, 0);

  ceilingBeams.push(
    <g key="ceiling-beams">
      {/* Heavy Corner Pillar */}
      <polygon
        points={`${beamStart.screenX - 8},${beamStart.screenY} ${beamStart.screenX + 8},${beamStart.screenY} ${beamStart.screenX + 8},${beamStart.screenY - wallHeightPx - 10} ${beamStart.screenX - 8},${beamStart.screenY - wallHeightPx - 10}`}
        fill="#2A1203"
        stroke="#120600"
        strokeWidth="2"
      />
      {/* Structural Ceiling Beam NW */}
      <polygon
        points={`${beamStart.screenX},${beamStart.screenY - wallHeightPx} ${beamEndNW.screenX},${beamEndNW.screenY - wallHeightPx} ${beamEndNW.screenX},${beamEndNW.screenY - wallHeightPx - 16} ${beamStart.screenX},${beamStart.screenY - wallHeightPx - 16}`}
        fill="#3D1D07"
        stroke="#1C0A00"
        strokeWidth="2"
      />
      {/* Structural Ceiling Beam NE */}
      <polygon
        points={`${beamStart.screenX},${beamStart.screenY - wallHeightPx} ${beamEndNE.screenX},${beamEndNE.screenY - wallHeightPx} ${beamEndNE.screenX},${beamEndNE.screenY - wallHeightPx - 16} ${beamStart.screenX},${beamStart.screenY - wallHeightPx - 16}`}
        fill="#270F02"
        stroke="#1C0A00"
        strokeWidth="2"
      />
    </g>
  );

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
      <defs>
        <linearGradient id="window-glass-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FEF08A" stop-opacity="0.9" />
          <stop offset="50%" stop-color="#F59E0B" stop-opacity="0.7" />
          <stop offset="100%" stop-color="#78350F" stop-opacity="0.4" />
        </linearGradient>
      </defs>
      {wallFaces}
      {windowsAndDetails}
      {ceilingBeams}
    </svg>
  );
}
