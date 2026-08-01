'use client';
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { PlacedRoomItem, RoomCatalogItem } from '@/types/roomEngine';
import { IsoSpriteObject } from './IsoSpriteObject';
import { GRID_SIZE_X, GRID_SIZE_Y, TILE_WIDTH_HALF, TILE_HEIGHT_HALF, ORIGIN_X, ORIGIN_Y, tileToScreen, screenToTile } from '@/lib/roomEngineStorage';
import { isTileOnFloor, isTileOnWall, ROOM_BLOCKED_TILES } from '@/data/roomLayoutData';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IsoRoomStageProps {
  placedItems: PlacedRoomItem[];
  editMode: boolean;
  showGrid: boolean;
  showDebugMode: boolean;
  selectedInstanceId: string | null;
  onSelectItem: (item: PlacedRoomItem | null) => void;
  onUpdatePosition: (instanceId: string, tileX: number, tileY: number) => void;
  onRotate: (instanceId: string) => void;
  onToggleElevation: (instanceId: string) => void;
  onDelete: (instanceId: string) => void;
  onSpawnItem: (catalogItem: RoomCatalogItem) => void;
}

export function IsoRoomStage({
  placedItems,
  editMode,
  showGrid,
  showDebugMode,
  selectedInstanceId,
  onSelectItem,
  onUpdatePosition,
  onRotate,
  onToggleElevation,
  onDelete,
  onSpawnItem
}: IsoRoomStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scaleFactor, setScaleFactor] = useState(1.0);
  const [zoom, setZoom] = useState(1.0);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef<{ startX: number; startY: number; initialPanX: number; initialPanY: number } | null>(null);

  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const factor = width / 1200;
      setScaleFactor(Math.max(0.4, Math.min(1.2, factor)));
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    onSelectItem(null);
    setIsPanning(true);
    panStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialPanX: pan.x,
      initialPanY: pan.y
    };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isPanning && panStartRef.current) {
      const deltaX = e.clientX - panStartRef.current.startX;
      const deltaY = e.clientY - panStartRef.current.startY;
      setPan({
        x: panStartRef.current.initialPanX + deltaX,
        y: panStartRef.current.initialPanY + deltaY
      });
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isPanning) {
      setIsPanning(false);
      panStartRef.current = null;
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch (err) {}
    }
  };

  const handleResetCamera = () => {
    setZoom(1.0);
    setPan({ x: 0, y: 0 });
  };

  // Render subtle grid OR full DEBUG geometric mesh
  const renderGridAndDebugGeometry = () => {
    if (!editMode || (!showGrid && !showDebugMode)) return null;

    const polygons: React.ReactNode[] = [];
    const gridLines: React.ReactNode[] = [];

    if (showDebugMode) {
      for (let x = 0; x < GRID_SIZE_X; x++) {
        for (let y = 0; y < GRID_SIZE_Y; y++) {
          const pTop = tileToScreen(x, y, 0);
          const pRight = tileToScreen(x + 1, y, 0);
          const pBottom = tileToScreen(x + 1, y + 1, 0);
          const pLeft = tileToScreen(x, y + 1, 0);

          const points = `${pTop.screenX},${pTop.screenY} ${pRight.screenX},${pRight.screenY} ${pBottom.screenX},${pBottom.screenY} ${pLeft.screenX},${pLeft.screenY}`;

          const isFloor = isTileOnFloor(x, y);
          const isWall = isTileOnWall(x, y);

          let fillColor = 'rgba(239, 68, 68, 0.25)';
          let strokeColor = 'rgba(239, 68, 68, 0.4)';

          if (isFloor) {
            fillColor = 'rgba(34, 197, 94, 0.25)';
            strokeColor = 'rgba(34, 197, 94, 0.5)';
          } else if (isWall) {
            fillColor = 'rgba(59, 130, 246, 0.25)';
            strokeColor = 'rgba(59, 130, 246, 0.5)';
          }

          polygons.push(
            <polygon
              key={`debug-tile-${x}-${y}`}
              points={points}
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth="0.5"
            />
          );
        }
      }
    }

    if (showGrid) {
      for (let x = 0; x <= GRID_SIZE_X; x += 2) {
        const pStart = tileToScreen(x, 0, 0);
        const pEnd = tileToScreen(x, GRID_SIZE_Y, 0);
        gridLines.push(
          <line
            key={`grid-x-${x}`}
            x1={pStart.screenX}
            y1={pStart.screenY}
            x2={pEnd.screenX}
            y2={pEnd.screenY}
            stroke="#D4AF37"
            strokeWidth="1"
            strokeOpacity="0.12"
          />
        );
      }
      for (let y = 0; y <= GRID_SIZE_Y; y += 2) {
        const pStart = tileToScreen(0, y, 0);
        const pEnd = tileToScreen(GRID_SIZE_X, y, 0);
        gridLines.push(
          <line
            key={`grid-y-${y}`}
            x1={pStart.screenX}
            y1={pStart.screenY}
            x2={pEnd.screenX}
            y2={pEnd.screenY}
            stroke="#D4AF37"
            strokeWidth="1"
            strokeOpacity="0.12"
          />
        );
      }
    }

    return (
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
        {polygons}
        {gridLines}
      </svg>
    );
  };

  return (
    <div 
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className={cn(
        "relative w-full aspect-[16/10] min-h-[500px] bg-[#FAF8F5] dark:bg-[#16161D] rounded-3xl border-2 border-brand-gold/40 shadow-2xl overflow-hidden select-none transition-all duration-300",
        isPanning ? "cursor-grabbing" : "cursor-grab"
      )}
    >
      {/* 2.5D ISOMETRIC ROOM STAGE */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '1200px',
          height: '800px',
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${scaleFactor * zoom})`,
          transformOrigin: 'top left'
        }}
        className="relative overflow-hidden stage-bg"
      >
        {/* ROOM BACKGROUND */}
        <div className="absolute inset-0 z-0 stage-bg">
          <Image
            src="/images/aeterna_pixel_iso_empty_room.png"
            alt="Estancia Isométrica Aeterna"
            fill
            priority
            className="object-cover stage-bg"
          />
        </div>

        {/* GEOMETRIC DEBUG / GRID OVERLAY */}
        {renderGridAndDebugGeometry()}

        {/* PLACED ROOM ITEMS */}
        {placedItems.map(item => (
          <IsoSpriteObject
            key={item.instanceId}
            item={item}
            placedItems={placedItems}
            editMode={editMode}
            isSelected={selectedInstanceId === item.instanceId}
            onSelect={(selected) => onSelectItem(selected)}
            onUpdatePosition={onUpdatePosition}
            onRotate={onRotate}
            onToggleElevation={onToggleElevation}
            onDelete={onDelete}
            onDeselect={() => onSelectItem(null)}
            scaleFactor={scaleFactor * zoom}
          />
        ))}
      </div>

      {/* CAMERA CONTROLS */}
      <div className="absolute top-4 right-4 z-40 flex items-center gap-1.5 bg-[#FAF8F5]/80 dark:bg-[#16161D]/80 backdrop-blur-md p-1.5 rounded-2xl border border-brand-gold/30 shadow-lg">
        <span className="text-[10px] text-brand-gold font-mono font-bold px-2 py-1 bg-brand-gold/10 rounded-lg border border-brand-gold/20">
          Cámara Pan
        </span>
        <button
          onClick={() => setZoom(prev => Math.min(1.4, prev + 0.1))}
          className="p-2 hover:bg-brand-gold/20 text-brand-ink dark:text-white rounded-xl transition-colors"
          title="Acercar Cámara"
        >
          <ZoomIn size={15} />
        </button>
        <span className="text-[10px] font-mono font-bold text-brand-gold px-1">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={() => setZoom(prev => Math.max(0.7, prev - 0.1))}
          className="p-2 hover:bg-brand-gold/20 text-brand-ink dark:text-white rounded-xl transition-colors"
          title="Alejar Cámara"
        >
          <ZoomOut size={15} />
        </button>
        <button
          onClick={handleResetCamera}
          className="p-2 hover:bg-brand-gold/20 text-brand-gold rounded-xl transition-colors"
          title="Restablecer Vista y Cámara"
        >
          <Maximize2 size={14} />
        </button>
      </div>
    </div>
  );
}
