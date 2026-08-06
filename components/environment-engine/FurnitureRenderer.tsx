'use client';
import React from 'react';
import { EnvironmentPlacedItem } from '@/types/environmentEngine';
import { IsoSpriteObject } from '../room-engine/IsoSpriteObject';
import { RoomCatalogItem, RoomAsset } from '@/types/roomEngine';

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
  dynamicCatalog?: RoomCatalogItem[];
  dynamicAssets?: Record<string, RoomAsset>;
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
  scaleFactor,
  dynamicCatalog,
  dynamicAssets
}: FurnitureRendererProps) {
  return (
    <>
      {placedItems.map(item => (
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
          dynamicCatalog={dynamicCatalog}
          dynamicAssets={dynamicAssets}
        />
      ))}
    </>
  );
}
