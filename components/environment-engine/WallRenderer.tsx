'use client';
import React from 'react';
import { EnvironmentLayout, EnvironmentTheme } from '@/types/environmentEngine';

interface WallRendererProps {
  layout: EnvironmentLayout;
  theme: EnvironmentTheme;
  roomWidth?: number;
  roomHeight?: number;
}

const WallRendererBase = ({ layout, theme, roomWidth = 1200, roomHeight = 950 }: WallRendererProps) => {
  const wallSrcNW = '/images/master_wall_iso_nw.png';
  const wallSrcNE = '/images/master_wall_iso_ne.png';
  const scaleX = roomWidth / 1200;
  const scaleY = roomHeight / 950;
  const originX = 600 * scaleX;
  const originY = 255 * scaleY;
  const wWidth = 525.5 * scaleX;
  const wHeight = 480 * scaleY;

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5 }}>
      <div
        style={{
          position: 'absolute',
          left: `${originX}px`,
          top: `${originY}px`,
          width: `${wWidth}px`,
          height: `${wHeight}px`,
          transformOrigin: '100% 100%',
          transform: 'translate(-100%, -100%) skewY(-26.565deg) scaleX(0.8944)',
          pointerEvents: 'none'
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={wallSrcNW}
          alt="NW Wall"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      <div
        style={{
          position: 'absolute',
          left: `${originX}px`,
          top: `${originY}px`,
          width: `${wWidth}px`,
          height: `${wHeight}px`,
          transformOrigin: '0% 100%',
          transform: 'translate(0%, -100%) skewY(26.565deg) scaleX(0.8944)',
          pointerEvents: 'none'
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={wallSrcNE}
          alt="NE Wall"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
    </div>
  );
};

export const WallRenderer = React.memo(WallRendererBase);
