'use client';
import React, { useState, useEffect } from 'react';
import { EnvironmentLayout, EnvironmentTheme } from '@/types/environmentEngine';
import { VISUAL_FLOOR } from '@/lib/environment-engine/EnvironmentGeometry';
import { getChromaKeyAlphaSprite } from '@/lib/chromaKeyAlpha';

interface FloorRendererProps {
  layout: EnvironmentLayout;
  theme: EnvironmentTheme;
  scale?: number;
}

const FloorRendererBase = ({ layout, theme, scale = 1 }: FloorRendererProps) => {
  const [cleanFloorSrc, setCleanFloorSrc] = useState<string>('');
  const rawSrc = '/images/master_floor_asset.png';

  useEffect(() => {
    getChromaKeyAlphaSprite(rawSrc).then(setCleanFloorSrc);
  }, []);

  const scaledWidth = VISUAL_FLOOR.imageWidth * scale;
  const scaledHeight = VISUAL_FLOOR.imageHeight * scale;
  const scaledCenterX = VISUAL_FLOOR.centerX;
  const scaledCenterY = 490 * scale;

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
      {cleanFloorSrc && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={cleanFloorSrc}
          alt="Master Wooden Floor"
          style={{
            position: 'absolute',
            left:   `${scaledCenterX}px`,
            top:    `${scaledCenterY}px`,
            width:  `${scaledWidth}px`,
            height: `${scaledHeight}px`,
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