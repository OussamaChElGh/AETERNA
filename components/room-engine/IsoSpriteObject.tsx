'use client';
import React, { useState, useRef, useEffect } from 'react';
import { PlacedRoomItem } from '@/types/roomEngine';
import { getCatalogItem } from '@/data/roomEngineCatalog';
import { getRoomAsset } from '@/data/roomEngineAssets';
import { tileToScreen, screenToTile, calculateDerivedZIndex, validatePlacement } from '@/lib/roomEngineStorage';
import { getChromaKeyAlphaSprite } from '@/lib/chromaKeyAlpha';
import { CompactObjectToolbar } from './CompactObjectToolbar';
import { cn } from '@/lib/utils';

interface IsoSpriteObjectProps {
  item: PlacedRoomItem;
  placedItems: PlacedRoomItem[];
  editMode: boolean;
  isSelected: boolean;
  onSelect: (item: PlacedRoomItem) => void;
  onUpdatePosition: (instanceId: string, tileX: number, tileY: number, tileZ?: number) => void;
  onRotate: (instanceId: string) => void;
  onToggleElevation: (instanceId: string) => void;
  onDelete: (instanceId: string) => void;
  onDeselect: () => void;
  scaleFactor: number;
}

export function IsoSpriteObject({
  item,
  placedItems,
  editMode,
  isSelected,
  onSelect,
  onUpdatePosition,
  onRotate,
  onToggleElevation,
  onDelete,
  onDeselect,
  scaleFactor
}: IsoSpriteObjectProps) {
  const catalogItem = getCatalogItem(item.catalogItemId);
  if (!catalogItem) return null;

  const asset = getRoomAsset(catalogItem.assetId);

  const rawSpriteSrc = (asset?.spritesByRotation && asset.spritesByRotation[item.rotation]) 
    || asset?.src 
    || '/images/aeterna_master_sofa.png';

  const [cleanSpriteSrc, setCleanSpriteSrc] = useState<string>('');
  const [spriteReady, setSpriteReady] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isValidDrag, setIsValidDrag] = useState(true);

  const dragStartRef = useRef<{ startX: number; startY: number; initialTileX: number; initialTileY: number; initialTileZ: number } | null>(null);

  useEffect(() => {
    let isMounted = true;
    setSpriteReady(false);
    getChromaKeyAlphaSprite(rawSpriteSrc).then(cleanUrl => {
      if (isMounted) {
        setCleanSpriteSrc(cleanUrl);
        setSpriteReady(true);
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

  const isWallItem = catalogItem.placementSurface === 'wall';
  const isNwWall = item.tileY === 0;

  const anchorXPercent = (asset?.anchorX ?? 0.5) * 100;
  const anchorYPercent = isWallItem ? 100 : (asset?.anchorY ?? 0.85) * 100;

  const hasSpecificRotationSprite = !!(
    asset?.spritesByRotation && 
    asset.spritesByRotation[item.rotation] && 
    asset.spritesByRotation[item.rotation] !== asset.src
  );

  // Mirror logic for 4-direction rotation:
  // - 90°  mirrors 0°   sprite (same sprite as src or as 0°)
  // - 270° mirrors 180° sprite (when 270° sprite == 180° sprite)
  const sprite0 = asset?.spritesByRotation?.[0] ?? asset?.src;
  const sprite90 = asset?.spritesByRotation?.[90] ?? asset?.src;
  const sprite180 = asset?.spritesByRotation?.[180] ?? asset?.src;
  const sprite270 = asset?.spritesByRotation?.[270] ?? asset?.src;

  const shouldMirrorFloor = !isWallItem && (
    (item.rotation === 90 && sprite90 === sprite0) ||
    (item.rotation === 270 && sprite270 === sprite180)
  );

  const isIsoPreAngled = asset?.isIsoPreAngled === true;

  const spriteTransformStyle: React.CSSProperties = isIsoPreAngled
    ? (isNwWall 
        ? { transform: 'translateY(14px) skewY(4.5deg) scaleX(0.98)', transformOrigin: 'center bottom' } 
        : { transform: 'translateY(14px) skewY(-4.5deg) scaleX(-0.98)', transformOrigin: 'center bottom' })
    : (isWallItem
        ? { 
            transform: isNwWall ? 'skewY(26.57deg) scaleX(0.8944)' : 'skewY(-26.57deg) scaleX(-0.8944)', 
            transformOrigin: 'center bottom' 
          }
        : (shouldMirrorFloor ? { transform: 'scaleX(-1)', transformOrigin: 'center center' } : {}));

  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    onSelect(item);

    if (!editMode) return;

    const initialValidation = validatePlacement(
      item.tileX,
      item.tileY,
      item.tileZ,
      item.rotation,
      item.catalogItemId,
      item.instanceId,
      placedItems
    );

    setIsDragging(true);
    setIsValidDrag(initialValidation.isValid);
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialTileX: item.tileX,
      initialTileY: item.tileY,
      initialTileZ: item.tileZ
    };

    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !dragStartRef.current || !editMode) return;

    const deltaXScreen = (e.clientX - dragStartRef.current.startX) / scaleFactor;
    const deltaYScreen = (e.clientY - dragStartRef.current.startY) / scaleFactor;

    const currentInitialScreen = tileToScreen(dragStartRef.current.initialTileX, dragStartRef.current.initialTileY, dragStartRef.current.initialTileZ);
    const rawTargetScreenX = currentInitialScreen.screenX + deltaXScreen;
    const rawTargetScreenY = currentInitialScreen.screenY + deltaYScreen;

    const rawTile = screenToTile(rawTargetScreenX, rawTargetScreenY, dragStartRef.current.initialTileZ);

    const isWallSurface = catalogItem.placementSurface === 'wall';
    let targetTileX = rawTile.tileX;
    let targetTileY = rawTile.tileY;
    let targetTileZ = item.tileZ;

    if (isWallSurface) {
      const initialZ = dragStartRef.current.initialTileZ ?? item.tileZ;
      targetTileZ = Math.max(0, Math.min(8, Math.round(initialZ - deltaYScreen / 32)));

      // Allow wall decor to switch walls dynamically between NW (tileY=0) and NE (tileX=0)
      if (rawTile.tileX >= rawTile.tileY) {
        targetTileY = 0;
        targetTileX = Math.max(0, Math.min(15, rawTile.tileX));
      } else {
        targetTileX = 0;
        targetTileY = Math.max(0, Math.min(15, rawTile.tileY));
      }
    }

    const validation = validatePlacement(
      targetTileX,
      targetTileY,
      targetTileZ,
      item.rotation,
      item.catalogItemId,
      item.instanceId,
      placedItems
    );

    setIsValidDrag(validation.isValid);

    if (targetTileX !== item.tileX || targetTileY !== item.tileY || targetTileZ !== item.tileZ) {
      onUpdatePosition(item.instanceId, targetTileX, targetTileY, targetTileZ);
    }
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleGlobalRelease = () => {
      if (isDragging) {
        setIsDragging(false);
        if (!isValidDrag && dragStartRef.current) {
          onUpdatePosition(
            item.instanceId,
            dragStartRef.current.initialTileX,
            dragStartRef.current.initialTileY,
            dragStartRef.current.initialTileZ
          );
        }
        dragStartRef.current = null;
        setIsValidDrag(true);
      }
    };

    window.addEventListener('pointercancel', handleGlobalRelease);
    window.addEventListener('blur', handleGlobalRelease);
    return () => {
      window.removeEventListener('pointercancel', handleGlobalRelease);
      window.removeEventListener('blur', handleGlobalRelease);
    };
  }, [isDragging, isValidDrag, item.instanceId, onUpdatePosition]);

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);

      if (!isValidDrag && dragStartRef.current) {
        onUpdatePosition(
          item.instanceId, 
          dragStartRef.current.initialTileX, 
          dragStartRef.current.initialTileY,
          dragStartRef.current.initialTileZ
        );
      }

      dragStartRef.current = null;
      setIsValidDrag(true);

      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch (err) {}
    }
  };

  const isDoorItem = item.catalogItemId.includes('door');

  const dropShadowClass = isWallItem
    ? (isNwWall ? 'drop-shadow-[5px_6px_8px_rgba(0,0,0,0.55)]' : 'drop-shadow-[-5px_6px_8px_rgba(0,0,0,0.55)]')
    : 'drop-shadow-[0_10px_16px_rgba(0,0,0,0.5)]';

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
        zIndex: isDragging ? 9999 : dynamicZIndex
      }}
      className={cn(
        "group select-none transition-transform duration-75 flex items-center justify-center",
        editMode ? "cursor-grab active:cursor-grabbing" : "cursor-pointer",
        isSelected && "scale-[1.02]"
      )}
    >
      <div className="relative w-full h-full" style={spriteTransformStyle}>
        {/* CONTACT SHADOW — elipse oscura en el suelo para muebles de piso */}
        {!isWallItem && (
          <div
            className="absolute pointer-events-none rounded-[50%]"
            style={{
              left: '50%',
              bottom: '8%',
              transform: 'translateX(-50%)',
              width: `${Math.max(60, (asset?.footprintTileWidth || 1) * 60)}%`,
              height: `${Math.max(18, (asset?.footprintTileWidth || 1) * 22)}%`,
              background: 'radial-gradient(ellipse, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.25) 45%, transparent 70%)',
              filter: 'blur(3px)',
              zIndex: 0
            }}
          />
        )}

        {/* RASTER PNG SPRITE — oculto hasta que el chroma-key procese la transparencia */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cleanSpriteSrc}
          alt={catalogItem.name}
          className={cn(
            "w-full h-full object-contain filter group-hover:scale-[1.02] transition-transform pointer-events-none",
            dropShadowClass,
            !spriteReady ? "opacity-0" : (!isValidDrag ? "opacity-80" : "opacity-100"),
            isSelected && isValidDrag && "drop-shadow-[0_0_20px_#06b6d4]"
          )}
        />

        {/* SELECTION / FOOTPRINT OUTLINE */}
        {isSelected && (
          <div className={cn(
            "absolute -inset-1 border-2 rounded-lg pointer-events-none transition-colors",
            isValidDrag 
              ? "border-cyan-400 shadow-[0_0_15px_#22d3ee] bg-cyan-400/10" 
              : "border-red-500 shadow-[0_0_15px_#ef4444] bg-red-500/20"
          )}>
            <div className={cn("absolute -top-2 -left-2 w-2.5 h-2.5 rounded-full border border-white", isValidDrag ? "bg-cyan-400" : "bg-red-500")} />
            <div className={cn("absolute -top-2 -right-2 w-2.5 h-2.5 rounded-full border border-white", isValidDrag ? "bg-cyan-400" : "bg-red-500")} />
            <div className={cn("absolute -bottom-2 -left-2 w-2.5 h-2.5 rounded-full border border-white", isValidDrag ? "bg-cyan-400" : "bg-red-500")} />
            <div className={cn("absolute -bottom-2 -right-2 w-2.5 h-2.5 rounded-full border border-white", isValidDrag ? "bg-cyan-400" : "bg-red-500")} />
          </div>
        )}
      </div>

      {/* COMPACT TOOLBAR WHEN SELECTED */}
      {editMode && isSelected && (
        <CompactObjectToolbar
          item={item}
          isWallItem={isWallItem}
          onRotate={onRotate}
          onToggleElevation={onToggleElevation}
          onDelete={onDelete}
          onDeselect={onDeselect}
        />
      )}
    </div>
  );
}
