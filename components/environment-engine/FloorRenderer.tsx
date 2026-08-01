'use client';
import React, { useState, useEffect } from 'react';
import { EnvironmentLayout, EnvironmentTheme } from '@/types/environmentEngine';
import { getChromaKeyAlphaSprite } from '@/lib/chromaKeyAlpha';
import { VISUAL_FLOOR } from '@/lib/environment-engine/EnvironmentGeometry';

interface FloorRendererProps {
  layout: EnvironmentLayout;
  theme: EnvironmentTheme;
}

export function FloorRenderer({ layout, theme }: FloorRendererProps) {
  const [cleanFloorSrc, setCleanFloorSrc] = useState<string>('/images/master_floor_asset.png');

  useEffect(() => {
    let isMounted = true;
    getChromaKeyAlphaSprite('/images/master_floor_asset.png').then(cleanUrl => {
      if (isMounted) setCleanFloorSrc(cleanUrl);
    });
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={cleanFloorSrc}
        alt="Master Wooden Floor"
        style={{
          position: 'absolute',
          left:   `${VISUAL_FLOOR.centerX}px`,
          top:    `${VISUAL_FLOOR.centerY}px`,
          width:  `${VISUAL_FLOOR.imageWidth}px`,
          height: `${VISUAL_FLOOR.imageHeight}px`,
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          filter: 'drop-shadow(0 12px 32px rgba(0,0,0,0.65))'
        }}
      />
    </div>
  );
}
