'use client';
import React, { useMemo } from 'react';
import { EnvironmentPlacedItem } from '@/types/environmentEngine';
import { IsoSpriteObject } from '../room-engine/IsoSpriteObject';
import { calculateDerivedZIndex } from '@/lib/roomEngineStorage';

interface FurnitureRendererProps {
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

export function FurnitureRenderer({
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
}: FurnitureRendererProps) {
  // Painter's algorithm: ordenar por z-index derivado para un correcto solapamiento
  // de sprites isométricos (los cercanos se dibujan encima de los lejanos).
  const sortedItems = useMemo(() => {
    return [...placedItems].sort((a, b) => {
      const za = calculateDerivedZIndex(a.tileX, a.tileY, a.tileZ, a.catalogItemId);
      const zb = calculateDerivedZIndex(b.tileX, b.tileY, b.tileZ, b.catalogItemId);
      return za - zb;
    });
  }, [placedItems]);

  return (
    <>
      {sortedItems.map(item => (
        <IsoSpriteObject
          key={item.instanceId}
          item={item}
          placedItems={placedItems}
          editMode={editMode}
          isSelected={selectedInstanceId === item.instanceId}
          onSelect={onSelect}
          onUpdatePosition={onUpdatePosition}
          onRotate={onRotate}
          onToggleElevation={onToggleElevation}
          onDelete={onDelete}
          onDeselect={onDeselect}
          scaleFactor={scaleFactor}
        />
      ))}
    </>
  );
}
