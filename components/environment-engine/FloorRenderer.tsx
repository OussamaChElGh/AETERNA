'use client';
import React, { useState, useEffect } from 'react';
import { EnvironmentLayout, EnvironmentTheme } from '@/types/environmentEngine';
import { VISUAL_FLOOR } from '@/lib/environment-engine/EnvironmentGeometry';
import { getChromaKeyAlphaSprite } from '@/lib/chromaKeyAlpha';

interface FloorRendererProps {
  layout: EnvironmentLayout;
  theme: EnvironmentTheme;
  visibleGrid?: number;
  roomWidth?: number;
  roomHeight?: number;
}

const FloorRendererBase = ({ layout, theme, visibleGrid = 14, roomWidth = 1200, roomHeight = 950 }: FloorRendererProps) => {
  const [cleanFloorSrc, setCleanFloorSrc] = useState<string>('');
  const rawSrc = '/images/master_floor_asset.png';

  useEffect(() => {
    getChromaKeyAlphaSprite(rawSrc).then(setCleanFloorSrc);
  }, []);

  const floorScale = visibleGrid / 14;
  const scaleX = (roomWidth / 1200);
  const scaleY = (roomHeight / 950);
  const centerX = 600 * scaleX;
  const centerY = 490 * scaleY;

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
      {cleanFloorSrc && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={cleanFloorSrc}
          alt="Master Wooden Floor"
          style={{
            position: 'absolute',
            left:   `${centerX}px`,
            top:    `${centerY}px`,
            width:  `${VISUAL_FLOOR.imageWidth * floorScale * scaleX}px`,
            height: `${VISUAL_FLOOR.imageHeight * floorScale * scaleY}px`,
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            filter: 'drop-shadow(0 12px 32px rgba(0,0,0,0.65))'
          }}
        />
      )}
    </div>
  );
};

export const FloorRenderer = React.memo(FloorRendererBase);
