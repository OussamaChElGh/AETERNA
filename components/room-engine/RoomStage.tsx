'use client';
import React, { useRef, useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { PlacedRoomItem } from '@/types/roomEngine';
import { GRID_SIZE_X, GRID_SIZE_Y, calculateDerivedZIndex } from '@/lib/roomEngineStorage';
import { RoomSprite } from './RoomSprite';
import { Sun, Lightbulb, Compass, Hand, ZoomIn, ZoomOut } from 'lucide-react';

interface RoomStageProps {
  placedItems: PlacedRoomItem[];
  editMode: boolean;
  showGrid: boolean;
  selectedInstanceId: string | null;
  onSelectItem: (item: PlacedRoomItem | null) => void;
  onUpdatePosition: (instanceId: string, tileX: number, tileY: number) => void;
  onRotate: (instanceId: string) => void;
  onToggleElevation: (instanceId: string) => void;
  onDelete: (instanceId: string) => void;
}

export function RoomStage({
  placedItems,
  editMode,
  showGrid,
  selectedInstanceId,
  onSelectItem,
  onUpdatePosition,
  onRotate,
  onToggleElevation,
  onDelete
}: RoomStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scaleFactor, setScaleFactor] = useState<number>(1);
  const [zoom, setZoom] = useState<number>(1);
  const [lightOn, setLightOn] = useState<boolean>(true);

  // Responsive Camera Scaling (1200x800 logical canvas)
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const widthPx = containerRef.current.getBoundingClientRect().width;
        setScaleFactor(widthPx / 1200);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sortedItems = useMemo(() => {
    return [...placedItems].sort((a, b) => {
      const zA = calculateDerivedZIndex(a.tileX, a.tileY, a.tileZ, a.catalogItemId);
      const zB = calculateDerivedZIndex(b.tileX, b.tileY, b.tileZ, b.catalogItemId);
      return zA - zB;
    });
  }, [placedItems]);

  return (
    <div
      ref={containerRef}
      onClick={() => onSelectItem(null)}
      className="relative w-full aspect-[1200/800] max-h-[760px] rounded-3xl overflow-hidden border-2 border-brand-gold/40 shadow-2xl bg-[#09090E] select-none"
    >
      {/* SCALED LOGICAL 1200x800 ROOM CONTAINER */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '1200px',
          height: '800px',
          transform: `scale(${scaleFactor * zoom})`,
          transformOrigin: 'top left'
        }}
        className="relative overflow-hidden"
      >
        {/* ISOMETRIC ROOM BASE BACKGROUND IMAGE */}
        <Image
          src="/images/aeterna_pixel_iso_empty_room.png"
          alt="Habitación Isométrica 2D"
          fill
          className="object-cover pointer-events-none transition-opacity duration-500"
        />

        {/* Ambient Room Light Overlay */}
        <div className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${lightOn ? 'bg-amber-500/5' : 'bg-black/70'}`} />

        {/* ISOMETRIC 32PX GRID OVERLAY */}
        {showGrid && editMode && (
          <div className="absolute inset-0 pointer-events-none z-10 border border-brand-gold/20 bg-[linear-gradient(to_right,#D4AF37_1px,transparent_1px),linear-gradient(to_bottom,#D4AF37_1px,transparent_1px)] [background-size:32px_32px] opacity-20" />
        )}

        {/* RENDER SPRITES */}
        {sortedItems.map(item => (
          <RoomSprite
            key={item.instanceId}
            item={item}
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

        {/* ANIMAL CROSSING STYLE HUD CONTROLS */}
        {/* Top-Left: Light Bulb Toggle */}
        <div className="absolute top-6 left-6 z-40 flex items-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightOn(!lightOn);
            }}
            className="p-3 bg-black/80 hover:bg-black border-2 border-brand-gold/60 rounded-full text-brand-gold shadow-2xl transition-transform hover:scale-110"
            title="Alternar Luz"
          >
            <Lightbulb size={20} className={lightOn ? "text-amber-400 fill-amber-400" : "text-gray-400"} />
          </button>
        </div>

        {/* Bottom-Right: Cyan Hand Icon Guide */}
        {editMode && (
          <div className="absolute bottom-6 right-6 z-40 bg-black/80 border border-cyan-400/50 rounded-2xl px-4 py-2 text-cyan-300 font-mono text-xs flex items-center gap-2 shadow-2xl">
            <div className="w-6 h-6 bg-cyan-400/20 border border-cyan-400 rounded-full flex items-center justify-center">
              <Hand size={14} className="text-cyan-300" />
            </div>
            <span>Arrastrar Muebles en Rejilla 32px</span>
          </div>
        )}
      </div>
    </div>
  );
}
