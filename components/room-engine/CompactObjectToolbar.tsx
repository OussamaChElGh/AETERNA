'use client';
import React from 'react';
import { RotateCw, ArrowUp, Trash2, Check } from 'lucide-react';
import { PlacedRoomItem } from '@/types/roomEngine';

interface CompactObjectToolbarProps {
  item: PlacedRoomItem;
  isWallItem?: boolean;
  onRotate: (instanceId: string) => void;
  onToggleElevation: (instanceId: string) => void;
  onDelete: (instanceId: string) => void;
  onDeselect: () => void;
}

export function CompactObjectToolbar({
  item,
  isWallItem = false,
  onRotate,
  onToggleElevation,
  onDelete,
  onDeselect
}: CompactObjectToolbarProps) {
  return (
    <div 
      onClick={(e) => e.stopPropagation()}
      className="absolute -top-12 left-1/2 -translate-x-1/2 z-[999] bg-[#270F02] text-[#FDE047] border border-[#D4AF37] shadow-[0_8px_20px_rgba(0,0,0,0.6)] rounded-xl px-2 py-1 flex items-center gap-1.5 font-mono select-none animate-in fade-in zoom-in-95 duration-150"
    >
      {/* Rotate Orientation Button */}
      <button
        onClick={() => onRotate(item.instanceId)}
        className="p-1.5 hover:bg-[#D4AF37]/20 rounded-lg text-[#FDE047] transition-all flex items-center gap-1 active:scale-95"
        title="Rotar Orientación (0°/90°/180°/270°)"
      >
        <RotateCw size={13} />
        <span className="text-[10px] font-bold">{item.rotation}°</span>
      </button>

      <div className="w-[1px] h-4 bg-[#D4AF37]/30" />

      {/* Toggle Floor / Surface Elevation (solo muebles de suelo) */}
      {!isWallItem && (
        <>
          <div className="w-[1px] h-4 bg-[#D4AF37]/30" />
          <button
            onClick={() => onToggleElevation(item.instanceId)}
            className="p-1.5 hover:bg-[#D4AF37]/20 rounded-lg text-[#FDE047] transition-all flex items-center gap-1 active:scale-95"
            title={item.tileZ === 0
              ? "Elevar: coloca el objeto sobre una superficie (escritorio)"
              : "Bajar: coloca el objeto en el suelo"}
          >
            <ArrowUp size={13} />
            <span className="text-[10px] font-bold">{item.tileZ === 0 ? 'Suelo' : 'Mesa'}</span>
          </button>
        </>
      )}

      <div className="w-[1px] h-4 bg-[#D4AF37]/30" />

      {/* Delete Item */}
      <button
        onClick={() => onDelete(item.instanceId)}
        className="p-1.5 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-lg transition-all active:scale-95"
        title="Eliminar de la Habitación"
      >
        <Trash2 size={13} />
      </button>

      <div className="w-[1px] h-4 bg-[#D4AF37]/30" />

      {/* Deselect / Done */}
      <button
        onClick={onDeselect}
        className="p-1.5 bg-[#D4AF37] text-[#270F02] hover:bg-[#FDE047] font-bold rounded-lg transition-all active:scale-95"
        title="Confirmar Posición"
      >
        <Check size={13} />
      </button>
    </div>
  );
}
