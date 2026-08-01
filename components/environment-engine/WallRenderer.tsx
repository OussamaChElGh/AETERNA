'use client';
import React from 'react';
import { EnvironmentLayout, EnvironmentTheme } from '@/types/environmentEngine';

interface WallRendererProps {
  layout: EnvironmentLayout;
  theme: EnvironmentTheme;
}

// ─────────────────────────────────────────────────────────────────────────────
// ACCURATE ISOMETRIC WALL RENDERER (USING MATCHING SKEW & SCALEX PROJECTION)
// Matches the exact skewY(26.57deg) and scaleX(0.8944) transformation
// used by wall objects, ensuring 100% visual alignment.
// ─────────────────────────────────────────────────────────────────────────────

const WallRendererBase = ({ layout, theme }: WallRendererProps) => {
  const wallSrcNW = '/images/master_wall_iso_nw.png';
  const wallSrcNE = '/images/master_wall_iso_ne.png';

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5 }}>
      {/* NW Wall (Left Wall: slanting downwards from 600,255 to 130,490) */}
      <div
        style={{
          position: 'absolute',
          left: '600px',
          top: '255px',
          width: '525.5px',
          height: '480px',
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

      {/* NE Wall (Right Wall: slanting downwards from 600,255 to 1070,490) */}
      <div
        style={{
          position: 'absolute',
          left: '600px',
          top: '255px',
          width: '525.5px',
          height: '480px',
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
