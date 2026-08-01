'use client';
import React, { useRef } from 'react';
import Image from 'next/image';
import { PlacedItem } from '@/data/roomItems';
import { RoomObject } from './RoomObject';
import { GRID_COLUMNS, GRID_ROWS } from '@/lib/roomState';

interface RoomCanvasProps {
  placedItems: PlacedItem[];
  editMode: boolean;
  showGrid: boolean;
  selectedInstanceId: string | null;
  onSelectItem: (item: PlacedItem | null) => void;
  onMoveItem: (instanceId: string, targetGridX: number, targetGridY: number) => void;
}

export function RoomCanvas({
  placedItems,
  editMode,
  showGrid,
  selectedInstanceId,
  onSelectItem,
  onMoveItem
}: RoomCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);

  // Depth-sorted placed items for isometric layering
  const sortedItems = [...placedItems].sort((a, b) => a.zIndex - b.zIndex);

  return (
    <div
      ref={canvasRef}
      onClick={() => onSelectItem(null)}
      className="relative w-full h-[480px] sm:h-[580px] md:h-[680px] rounded-3xl overflow-hidden border-2 border-brand-gold/40 shadow-2xl bg-[#0A0A0E] select-none"
    >
      {/* ROOM ISOMETRIC BACKGROUND */}
      <Image
        src="/images/aeterna_pixel_isometric_room.png"
        alt="Habitación 2D Pixel Art"
        fill
        className="object-cover pointer-events-none opacity-95"
      />

      {/* Warm Ambient Lighting Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

      {/* LOGICAL GRID OVERLAY (40 Columns x 28 Rows, Snap Visualizer) */}
      {showGrid && editMode && (
        <div className="absolute inset-0 pointer-events-none z-10 border border-brand-gold/20">
          {Array.from({ length: GRID_ROWS }).map((_, r) => (
            <div
              key={r}
              className="w-full border-b border-brand-gold/10 flex"
              style={{ height: `${100 / GRID_ROWS}%` }}
            >
              {Array.from({ length: GRID_COLUMNS }).map((_, c) => (
                <div
                  key={c}
                  className="border-r border-brand-gold/10 flex-1 hover:bg-brand-gold/5"
                />
              ))}
            </div>
          ))}
        </div>
      )}

      {/* PLACED ROOM SPRITE OBJECTS */}
      {sortedItems.map(item => (
        <RoomObject
          key={item.instanceId}
          item={item}
          editMode={editMode}
          isSelected={selectedInstanceId === item.instanceId}
          onSelect={(selected) => onSelectItem(selected)}
          onMove={onMoveItem}
          canvasRef={canvasRef}
        />
      ))}
    </div>
  );
}
