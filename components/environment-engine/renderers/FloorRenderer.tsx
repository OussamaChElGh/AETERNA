'use client';
import React, { useState, useEffect } from 'react';
import { EnvironmentLayout, EnvironmentTheme } from '@/types/environmentEngine';
import { tileToScreen } from '@/lib/roomEngineStorage';
import { AutotilingEngine } from '@/lib/environment-engine/AutotilingEngine';
import { getChromaKeyAlphaSprite } from '@/lib/chromaKeyAlpha';

interface FloorRendererProps {
  layout: EnvironmentLayout;
  theme: EnvironmentTheme;
}

export function FloorRenderer({ layout, theme }: FloorRendererProps) {
  const [cleanVariants, setCleanVariants] = useState<string[]>([]);
  const autotiling = new AutotilingEngine(layout);

  useEffect(() => {
    let isMounted = true;
    const variants = theme.floorTileSet.variants;

    Promise.all(variants.map(src => getChromaKeyAlphaSprite(src))).then(cleaned => {
      if (isMounted) {
        setCleanVariants(cleaned);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [theme.floorTileSet.variants]);

  const floorTileNodes: React.ReactNode[] = [];
  const platformEdges: React.ReactNode[] = [];
  const baseboardTrims: React.ReactNode[] = [];

  const platformThicknessPx = 18; // 3D Platform Thickness / Espesor del Canto

  for (let x = 0; x < layout.gridSizeX; x++) {
    for (let y = 0; y < layout.gridSizeY; y++) {
      const cell = layout.cells[x]?.[y];
      if (cell?.type !== 'floor' || layout.blockedTiles.has(`${x},${y}`)) continue;

      const pTop = tileToScreen(x, y, 0);

      // Autotiling classification: center, edges, corners
      const classification = autotiling.getTileClassification(x, y);
      const variantIdx = autotiling.getFloorVariantIndex(x, y);
      const tileSpriteSrc = cleanVariants[variantIdx % cleanVariants.length] || cleanVariants[0] || theme.floorTileSet.variants[0];

      // 1. Render Top Surface Parquet Tile
      floorTileNodes.push(
        <div
          key={`floor-tile-${x}-${y}`}
          style={{
            position: 'absolute',
            left: `${pTop.screenX}px`,
            top: `${pTop.screenY}px`,
            width: '64px',
            height: '32px',
            transform: 'translate(-50%, 0)',
            pointerEvents: 'none',
            zIndex: 1
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={tileSpriteSrc}
            alt={`Floor Tile ${classification} v${variantIdx}`}
            className="w-full h-full object-contain filter drop-shadow-[0_1px_3px_rgba(0,0,0,0.3)]"
          />
        </div>
      );

      // 2. Render 3D Platform Side Edges (Canto Frontal / Espesor 3D Elevado) along exposed South/East edges
      const isSouthEdge = layout.cells[x]?.[y + 1]?.type !== 'floor' || y === 25;
      const isEastEdge = layout.cells[x + 1]?.[y]?.type !== 'floor' || x === 25;

      if (isSouthEdge) {
        const pLeft = tileToScreen(x, y + 1, 0);
        const pBottom = tileToScreen(x + 1, y + 1, 0);

        platformEdges.push(
          <g key={`edge-south-${x}-${y}`}>
            {/* Front Left Thickness Face */}
            <polygon
              points={`${pLeft.screenX},${pLeft.screenY} ${pBottom.screenX},${pBottom.screenY} ${pBottom.screenX},${pBottom.screenY + platformThicknessPx} ${pLeft.screenX},${pLeft.screenY + platformThicknessPx}`}
              fill="#2E1608"
              stroke="#170A03"
              strokeWidth="1"
            />
            {/* Edge Bevel Highlight */}
            <line
              x1={pLeft.screenX}
              y1={pLeft.screenY}
              x2={pBottom.screenX}
              y2={pBottom.screenY}
              stroke="#6E3A19"
              strokeWidth="1"
            />
          </g>
        );
      }

      if (isEastEdge) {
        const pBottom = tileToScreen(x + 1, y + 1, 0);
        const pRight = tileToScreen(x + 1, y, 0);

        platformEdges.push(
          <g key={`edge-east-${x}-${y}`}>
            {/* Front Right Thickness Face */}
            <polygon
              points={`${pBottom.screenX},${pBottom.screenY} ${pRight.screenX},${pRight.screenY} ${pRight.screenX},${pRight.screenY + platformThicknessPx} ${pBottom.screenX},${pBottom.screenY + platformThicknessPx}`}
              fill="#1C0A03"
              stroke="#0D0401"
              strokeWidth="1"
            />
            {/* Edge Bevel Highlight */}
            <line
              x1={pBottom.screenX}
              y1={pBottom.screenY}
              x2={pRight.screenX}
              y2={pRight.screenY}
              stroke="#542B11"
              strokeWidth="1"
            />
          </g>
        );
      }

      // 3. Baseboard Trim along Wall Boundaries
      const isNorthWestWallBorder = layout.cells[x]?.[y - 1]?.type === 'wall' || y === 5;
      const isNorthEastWallBorder = layout.cells[x - 1]?.[y]?.type === 'wall' || x === 5;

      if (isNorthWestWallBorder) {
        baseboardTrims.push(
          <polygon
            key={`baseboard-nw-${x}-${y}`}
            points={`${pTop.screenX},${pTop.screenY} ${pTop.screenX + 32},${pTop.screenY + 16} ${pTop.screenX + 32},${pTop.screenY + 8} ${pTop.screenX},${pTop.screenY - 8}`}
            fill="#270F02"
            stroke="#1A0901"
            strokeWidth="1"
          />
        );
      }

      if (isNorthEastWallBorder) {
        baseboardTrims.push(
          <polygon
            key={`baseboard-ne-${x}-${y}`}
            points={`${pTop.screenX - 32},${pTop.screenY + 16} ${pTop.screenX},${pTop.screenY} ${pTop.screenX},${pTop.screenY - 8} ${pTop.screenX - 32},${pTop.screenY + 8}`}
            fill="#1C0A01"
            stroke="#100500"
            strokeWidth="1"
          />
        );
      }
    }
  }

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
      {/* Top Parquet Tiles */}
      {floorTileNodes}

      {/* 3D Platform Rim & Side Thickness Pass */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-2">
        {platformEdges}
        {baseboardTrims}
      </svg>
    </div>
  );
}
