'use client';
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { PlacedRoomItem } from '@/types/roomEngine';
import { getCatalogItem } from '@/data/roomEngineCatalog';
import { getRoomAsset } from '@/data/roomEngineAssets';
import { tileToScreen, screenToTile, calculateDerivedZIndex } from '@/lib/roomEngineStorage';
import { getChromaKeyAlphaSprite } from '@/lib/chromaKeyAlpha';
import { CompactObjectToolbar } from './CompactObjectToolbar';
import { cn } from '@/lib/utils';

interface RoomSpriteProps {
  item: PlacedRoomItem;
  editMode: boolean;
  isSelected: boolean;
  onSelect: (item: PlacedRoomItem) => void;
  onUpdatePosition: (instanceId: string, tileX: number, tileY: number) => void;
  onRotate: (instanceId: string) => void;
  onToggleElevation: (instanceId: string) => void;
  onDelete: (instanceId: string) => void;
  onDeselect: () => void;
  scaleFactor: number;
}

export function RoomSprite({
  item,
  editMode,
  isSelected,
  onSelect,
  onUpdatePosition,
  onRotate,
  onToggleElevation,
  onDelete,
  onDeselect,
  scaleFactor
}: RoomSpriteProps) {
  const catalogItem = getCatalogItem(item.catalogItemId);
  if (!catalogItem) return null;

  const asset = getRoomAsset(catalogItem.assetId);

  const rawSpriteSrc = (asset?.spritesByRotation && asset.spritesByRotation[item.rotation]) 
    || asset?.src 
    || '/images/aeterna_master_sofa.png';

  const [cleanSpriteSrc, setCleanSpriteSrc] = useState<string>(rawSpriteSrc);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ startX: number; startY: number; initialTileX: number; initialTileY: number } | null>(null);

  useEffect(() => {
    let isMounted = true;
    getChromaKeyAlphaSprite(rawSpriteSrc).then(cleanUrl => {
      if (isMounted) {
        setCleanSpriteSrc(cleanUrl);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [rawSpriteSrc]);

  const { screenX, screenY } = tileToScreen(item.tileX, item.tileY, item.tileZ);

  const dynamicZIndex = calculateDerivedZIndex(
    item.tileX,
    item.tileY,
    item.tileZ,
    item.catalogItemId
  );

  const pixelWidth = asset?.pixelWidth || 120;
  const pixelHeight = asset?.pixelHeight || 120;
  const anchorXPercent = (asset?.anchorX ?? 0.5) * 100;
  const anchorYPercent = (asset?.anchorY ?? 0.85) * 100;

  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    onSelect(item);

    if (!editMode) return;

    setIsDragging(true);
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialTileX: item.tileX,
      initialTileY: item.tileY
    };

    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !dragStartRef.current || !editMode) return;

    const deltaXScreen = (e.clientX - dragStartRef.current.startX) / scaleFactor;
    const deltaYScreen = (e.clientY - dragStartRef.current.startY) / scaleFactor;

    const currentInitialScreen = tileToScreen(dragStartRef.current.initialTileX, dragStartRef.current.initialTileY, item.tileZ);
    const rawTargetScreenX = currentInitialScreen.screenX + deltaXScreen;
    const rawTargetScreenY = currentInitialScreen.screenY + deltaYScreen;

    const { tileX: targetTileX, tileY: targetTileY } = screenToTile(rawTargetScreenX, rawTargetScreenY, item.tileZ);

    if (targetTileX !== item.tileX || targetTileY !== item.tileY) {
      onUpdatePosition(item.instanceId, targetTileX, targetTileY);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      dragStartRef.current = null;
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch (err) {}
    }
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        position: 'absolute',
        left: `${screenX}px`,
        top: `${screenY}px`,
        width: `${pixelWidth}px`,
        height: `${pixelHeight}px`,
        transform: `translate(-${anchorXPercent}%, -${anchorYPercent}%)`,
        zIndex: dynamicZIndex
      }}
      className={cn(
        "group select-none transition-transform duration-75 flex items-center justify-center",
        editMode ? "cursor-grab active:cursor-grabbing" : "cursor-pointer",
        isSelected && "scale-[1.02]"
      )}
    >
      <div className="relative w-full h-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cleanSpriteSrc}
          alt={catalogItem.name}
          className={cn(
            "w-full h-full object-contain filter drop-shadow-[0_10px_16px_rgba(0,0,0,0.5)] group-hover:scale-[1.02] transition-transform pointer-events-none",
            isSelected && "drop-shadow-[0_0_20px_#06b6d4]"
          )}
        />

        {isSelected && (
          <div className="absolute -inset-1 border-2 border-cyan-400 rounded-lg shadow-[0_0_15px_#22d3ee] pointer-events-none bg-cyan-400/10">
            <div className="absolute -top-2 -left-2 w-2.5 h-2.5 bg-cyan-400 rounded-full border border-white" />
            <div className="absolute -top-2 -right-2 w-2.5 h-2.5 bg-cyan-400 rounded-full border border-white" />
            <div className="absolute -bottom-2 -left-2 w-2.5 h-2.5 bg-cyan-400 rounded-full border border-white" />
            <div className="absolute -bottom-2 -right-2 w-2.5 h-2.5 bg-cyan-400 rounded-full border border-white" />
          </div>
        )}
      </div>

      {editMode && isSelected && (
        <CompactObjectToolbar
          item={item}
          onRotate={onRotate}
          onToggleElevation={onToggleElevation}
          onDelete={onDelete}
          onDeselect={onDeselect}
        />
      )}
    </div>
  );
}
