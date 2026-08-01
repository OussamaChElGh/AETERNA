'use client';
import React from 'react';
import { FloorRenderer } from '@/components/environment-engine/FloorRenderer';
import { WallRenderer } from '@/components/environment-engine/WallRenderer';
import { MAIN_STUDY_LAYOUT } from '@/data/environment-engine/layouts/mainStudy.layout';
import { ACADEMIC_LIBRARY_THEME } from '@/data/environment-engine/themes/academicLibrary.theme';
import { getChromaKeyAlphaSprite } from '@/lib/chromaKeyAlpha';
import { tileToScreen } from '@/lib/roomEngineStorage';

interface HeroRoomSceneProps {
  children?: React.ReactNode;
}

interface StaticItem {
  catalogItemId: string;
  src: string;
  tileX: number;
  tileY: number;
  tileZ: number;
  rotation: 0 | 90 | 180 | 270;
  pixelWidth: number;
  pixelHeight: number;
  anchorX: number;
  anchorY: number;
  placementSurface: 'floor' | 'wall';
}

const STATIC_ITEMS: StaticItem[] = [
  {
    catalogItemId: 'desk_academic',
    src: '/images/aeterna_master_desk_0deg.png',
    tileX: 5,
    tileY: 5,
    tileZ: 0,
    rotation: 0,
    pixelWidth: 200,
    pixelHeight: 150,
    anchorX: 0.5,
    anchorY: 0.85,
    placementSurface: 'floor'
  },
  {
    catalogItemId: 'fireplace_gothic',
    src: '/images/aeterna_master_fireplace.png',
    tileX: 2,
    tileY: 0,
    tileZ: 0,
    rotation: 0,
    pixelWidth: 200,
    pixelHeight: 200,
    anchorX: 0.5,
    anchorY: 1,
    placementSurface: 'wall'
  },
  {
    catalogItemId: 'bookshelf_library',
    src: '/images/aeterna_master_bookshelf.png',
    tileX: 9,
    tileY: 0,
    tileZ: 0,
    rotation: 0,
    pixelWidth: 180,
    pixelHeight: 200,
    anchorX: 0.5,
    anchorY: 1,
    placementSurface: 'wall'
  },
  {
    catalogItemId: 'window_stone_arch_gothic',
    src: '/images/aeterna_master_gothic_window.png',
    tileX: 6,
    tileY: 0,
    tileZ: 0,
    rotation: 0,
    pixelWidth: 160,
    pixelHeight: 200,
    anchorX: 0.5,
    anchorY: 1,
    placementSurface: 'wall'
  },
  {
    catalogItemId: 'telescope_brass',
    src: '/images/aeterna_master_telescope.png',
    tileX: 8,
    tileY: 9,
    tileZ: 0,
    rotation: 0,
    pixelWidth: 120,
    pixelHeight: 160,
    anchorX: 0.5,
    anchorY: 0.85,
    placementSurface: 'floor'
  }
];

function StaticSprite({ item }: { item: StaticItem }) {
  const [cleanSrc, setCleanSrc] = React.useState(item.src);
  React.useEffect(() => {
    let mounted = true;
    getChromaKeyAlphaSprite(item.src).then(url => { if (mounted) setCleanSrc(url); });
    return () => { mounted = false; };
  }, [item.src]);

  const { screenX, screenY } = tileToScreen(item.tileX, item.tileY, item.tileZ);
  const isNwWall = item.placementSurface === 'wall' && item.tileY === 0;

  return (
    <div
      style={{
        position: 'absolute',
        left: `${screenX}px`,
        top: `${screenY}px`,
        width: `${item.pixelWidth}px`,
        height: `${item.pixelHeight}px`,
        transform: `translate(-${item.anchorX * 100}%, -${item.anchorY * 100}%)`,
        zIndex: item.placementSurface === 'wall' ? 8 : 100 + item.tileX + item.tileY
      }}
      className="pointer-events-none"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={cleanSrc}
        alt={item.catalogItemId}
        className="w-full h-full object-contain"
        style={{
          transform: isNwWall ? 'skewY(26.57deg) scaleX(0.8944)' : 'none',
          transformOrigin: 'center bottom',
          filter: 'drop-shadow(0 8px 14px rgba(0,0,0,0.45))'
        }}
      />
    </div>
  );
}

export function HeroRoomScene({ children }: HeroRoomSceneProps) {
  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
      {/* Static isometric room — scaled to fill hero */}
      <div
        className="absolute"
        style={{
          width: '1200px',
          height: '950px',
          left: '50%',
          top: '58%',
          transform: 'translate(-50%, -50%) scale(1.05)',
        }}
      >
        <div className="relative w-full h-full">
          {/* Floor */}
          <div className="absolute inset-0 z-[1]">
            <FloorRenderer layout={MAIN_STUDY_LAYOUT} theme={ACADEMIC_LIBRARY_THEME} />
          </div>

          {/* Walls */}
          <div className="absolute inset-0 z-[5]">
            <WallRenderer layout={MAIN_STUDY_LAYOUT} theme={ACADEMIC_LIBRARY_THEME} />
          </div>

          {/* Static furniture */}
          {STATIC_ITEMS.map(item => (
            <StaticSprite key={item.catalogItemId} item={item} />
          ))}
        </div>
      </div>

      {/* Orbital rings + nodes constellation projected above the desk */}
      <div className="absolute inset-0 z-10 pointer-events-none">{children}</div>
    </div>
  );
}
