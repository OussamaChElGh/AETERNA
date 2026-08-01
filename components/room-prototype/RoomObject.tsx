'use client';
import React from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { PlacedItem, getCatalogItem } from '@/data/roomItems';
import { GRID_COLUMNS, GRID_ROWS } from '@/lib/roomState';
import { cn } from '@/lib/utils';
import { Compass } from 'lucide-react';

interface RoomObjectProps {
  item: PlacedItem;
  editMode: boolean;
  isSelected: boolean;
  onSelect: (item: PlacedItem) => void;
  onMove: (instanceId: string, targetGridX: number, targetGridY: number) => void;
  canvasRef: React.RefObject<HTMLDivElement | null>;
}

export function RoomObject({
  item,
  editMode,
  isSelected,
  onSelect,
  onMove,
  canvasRef
}: RoomObjectProps) {
  const catalogItem = getCatalogItem(item.itemId);
  if (!catalogItem) return null;

  const widthGrid = catalogItem.widthGrid || 2;
  const heightGrid = catalogItem.heightGrid || 2;

  // Percentage calculations relative to logical grid columns/rows (Responsive!)
  const leftPercent = (item.gridX / GRID_COLUMNS) * 100;
  const topPercent = (item.gridY / GRID_ROWS) * 100;
  const itemWidthPercent = (widthGrid / GRID_COLUMNS) * 100;
  const itemHeightPercent = (heightGrid / GRID_ROWS) * 100;

  const handleDragEnd = (_: any, info: any) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const cellPxWidth = rect.width / GRID_COLUMNS;
    const cellPxHeight = rect.height / GRID_ROWS;

    const deltaGridX = Math.round(info.offset.x / cellPxWidth);
    const deltaGridY = Math.round(info.offset.y / cellPxHeight);

    const targetGridX = Math.max(0, Math.min(GRID_COLUMNS - widthGrid, item.gridX + deltaGridX));
    const targetGridY = Math.max(0, Math.min(GRID_ROWS - heightGrid, item.gridY + deltaGridY));

    onMove(item.instanceId, targetGridX, targetGridY);
  };

  return (
    <motion.div
      drag={editMode}
      dragConstraints={canvasRef}
      dragElastic={0.05}
      dragMomentum={false}
      onDragEnd={handleDragEnd}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(item);
      }}
      style={{
        position: 'absolute',
        left: `${leftPercent}%`,
        top: `${topPercent}%`,
        width: `${itemWidthPercent}%`,
        height: `${itemHeightPercent}%`,
        zIndex: item.zIndex + 10,
        transform: `rotate(${item.rotation}deg)`
      }}
      className={cn(
        "group transition-transform duration-150 relative flex items-center justify-center select-none",
        editMode ? "cursor-grab active:cursor-grabbing" : "cursor-pointer",
        isSelected && "scale-105 z-50"
      )}
    >
      <div className="relative w-full h-full">
        {/* Pixel Art Sprite */}
        <Image
          src={catalogItem.image}
          alt={catalogItem.name}
          fill
          className={cn(
            "object-contain drop-shadow-[0_10px_16px_rgba(0,0,0,0.7)] group-hover:scale-105 transition-transform",
            isSelected && "drop-shadow-[0_0_20px_#D4AF37]"
          )}
        />

        {/* Selection Ring */}
        {editMode && isSelected && (
          <div className="absolute -inset-1 rounded-xl border-2 border-brand-gold animate-pulse bg-brand-gold/10 pointer-events-none" />
        )}

        {/* Hover Badge */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-black/90 text-brand-gold text-[9px] font-mono font-bold px-2 py-0.5 rounded border border-brand-gold/40 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-lg">
          {catalogItem.name}
        </div>
      </div>
    </motion.div>
  );
}
