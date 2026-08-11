'use client';
import React from 'react';
import { EnvironmentLayout, EnvironmentTheme, EnvironmentPlacedItem } from '@/types/environmentEngine';
import { FloorRenderer } from './FloorRenderer';
import { WallRenderer } from './WallRenderer';
import { FurnitureRenderer } from './FurnitureRenderer';
import { ParticleRenderer } from './renderers/ParticleRenderer';
import { RoomCatalogItem, RoomAsset } from '@/types/roomEngine';

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
  dynamicCatalog?: RoomCatalogItem[];
  dynamicAssets?: Record<string, RoomAsset>;
  envScale?: number;
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
  scaleFactor,
  dynamicCatalog,
  dynamicAssets,
  envScale = 1
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
        transformOrigin: 'top left',
        backgroundColor: '#14110D'
      }}
      className="relative"
    >
      {/* ENVIRONMENT WRAPPER: suelo + paredes se escalan juntos */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `scale(${envScale})`,
          transformOrigin: '50% 30%',
          pointerEvents: 'none'
        }}
      >
        <FloorRenderer layout={layout} theme={theme} />
        <WallRenderer layout={layout} theme={theme} />
      </div>

      {/* FurnitureRenderer (muebles a escala normal = scaleFactor del Room) */}
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
        dynamicCatalog={dynamicCatalog}
        dynamicAssets={dynamicAssets}
        envScale={envScale}
      />

      {/* 4. ParticleRenderer */}
      <ParticleRenderer theme={theme} />
    </div>
  );
}
