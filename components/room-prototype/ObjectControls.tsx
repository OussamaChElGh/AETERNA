'use client';
import React from 'react';
import Image from 'next/image';
import { RotateCw, Trash2, ArrowUp, Check, Info } from 'lucide-react';
import { PlacedItem, getCatalogItem } from '@/data/roomItems';
import { motion } from 'motion/react';

interface ObjectControlsProps {
  selectedItem: PlacedItem;
  onRotate: (instanceId: string) => void;
  onDelete: (instanceId: string) => void;
  onBringToFront: (instanceId: string) => void;
  onDeselect: () => void;
}

export function ObjectControls({
  selectedItem,
  onRotate,
  onDelete,
  onBringToFront,
  onDeselect
}: ObjectControlsProps) {
  const catalogItem = getCatalogItem(selectedItem.itemId);
  if (!catalogItem) return null;

  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 30, opacity: 0 }}
      className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[100] bg-white dark:bg-[#181822] border-2 border-brand-gold rounded-2xl p-4 shadow-2xl flex items-center gap-6 max-w-md w-full font-sans select-none"
    >
      <div className="w-12 h-12 relative shrink-0 rounded-xl bg-brand-gold/15 border border-brand-gold/30 p-1 flex items-center justify-center">
        <Image src={catalogItem.image} alt={catalogItem.name} fill className="object-contain" />
      </div>

      <div className="flex-1">
        <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-brand-gold block">
          Posición Grid ({selectedItem.gridX}, {selectedItem.gridY})
        </span>
        <h4 className="font-serif font-bold text-xs text-brand-ink dark:text-white leading-tight">
          {catalogItem.name}
        </h4>
        <span className="text-[9px] text-brand-muted font-mono">
          Rotación: {selectedItem.rotation}°
        </span>
      </div>

      <div className="flex items-center gap-2">
        {catalogItem.allowRotation && (
          <button
            onClick={() => onRotate(selectedItem.instanceId)}
            className="p-2.5 rounded-xl border border-brand-gold/40 text-brand-gold hover:bg-brand-gold/10 transition-colors"
            title="Rotar 90°"
          >
            <RotateCw size={16} />
          </button>
        )}

        <button
          onClick={() => onBringToFront(selectedItem.instanceId)}
          className="p-2.5 rounded-xl border border-brand-gold/40 text-brand-gold hover:bg-brand-gold/10 transition-colors"
          title="Traer al frente"
        >
          <ArrowUp size={16} />
        </button>

        <button
          onClick={() => onDelete(selectedItem.instanceId)}
          className="p-2.5 rounded-xl border border-red-500/40 text-red-500 hover:bg-red-500/10 transition-colors"
          title="Eliminar de la habitación"
        >
          <Trash2 size={16} />
        </button>

        <button
          onClick={onDeselect}
          className="px-3 py-2.5 rounded-xl bg-brand-gold text-brand-ink font-bold text-xs flex items-center gap-1 shadow-md"
        >
          <Check size={14} />
          <span>Listo</span>
        </button>
      </div>
    </motion.div>
  );
}
