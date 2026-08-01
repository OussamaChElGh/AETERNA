'use client';
import React from 'react';
import { EnvironmentLayout, EnvironmentTheme, EnvironmentPlacedItem } from '@/types/environmentEngine';
import { FloorRenderer } from './FloorRenderer';
import { WallRenderer } from './WallRenderer';
import { FurnitureRenderer } from './FurnitureRenderer';
import { ParticleRenderer } from './renderers/ParticleRenderer';

interface RoomProps {
  layout: EnvironmentLayout;
  theme: EnvironmentTheme;
  placedItems: EnvironmentPlacedItem[];
  editMode: boolean;
  selectedInstanceId: string | null;
  onSelect: (item: EnvironmentPlacedItem) => void;
  onUpdatePosition: (instanceId: string, tileX: number, tileY: number, tileZ?: number) => void;
  onRotate: (instanceId: string) => void;
  onToggleElevation: (instanceId: string) => void;
  onDelete: (instanceId: string) => void;
  onDeselect: () => void;
  scaleFactor: number;
}

export function Room({
  layout,
  theme,
  placedItems,
  editMode,
  selectedInstanceId,
  onSelect,
  onUpdatePosition,
  onRotate,
  onToggleElevation,
  onDelete,
  onDeselect,
  scaleFactor
}: RoomProps) {
  return (
    <div 
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '1200px',
        height: '950px',
        transform: `scale(${scaleFactor})`,
        transformOrigin: 'top left'
      }}
      className="relative"
    >
      {/* 1. FloorRenderer (FloorModule01, FloorModule02, FloorModule03) */}
      <FloorRenderer layout={layout} theme={theme} />

      {/* 2. WallRenderer (WallNorth, WallWest, Corner, Window) */}
      <WallRenderer layout={layout} theme={theme} placedItems={placedItems} />

      {/* 3. FurnitureRenderer (Placed User Items with Contact Shadows & Depth Sorting) */}
      <FurnitureRenderer
        placedItems={placedItems}
        editMode={editMode}
        selectedInstanceId={selectedInstanceId}
        onSelect={onSelect}
        onUpdatePosition={onUpdatePosition}
        onRotate={onRotate}
        onToggleElevation={onToggleElevation}
        onDelete={onDelete}
        onDeselect={onDeselect}
        scaleFactor={scaleFactor}
      />

      {/* 4. ParticleRenderer (Floating Dust Motes Pass) */}
      <ParticleRenderer theme={theme} />
    </div>
  );
}
