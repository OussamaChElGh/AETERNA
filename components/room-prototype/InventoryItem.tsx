'use client';
import React from 'react';
import Image from 'next/image';
import { Plus, Compass, Move } from 'lucide-react';
import { CatalogItem } from '@/data/roomItems';
import { cn } from '@/lib/utils';

interface InventoryItemProps {
  item: CatalogItem;
  onAddItem: (item: CatalogItem) => void;
  placedCount: number;
}

export function InventoryItem({ item, onAddItem, placedCount }: InventoryItemProps) {
  return (
    <div
      onClick={() => onAddItem(item)}
      className="p-3 rounded-xl border border-brand-gold/30 bg-white dark:bg-white/5 hover:border-brand-gold hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between relative group select-none"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-[#8B6914] dark:text-brand-gold">
          {item.widthGrid}x{item.heightGrid} celda
        </span>
        <div className="p-1 rounded-md bg-brand-gold/15 text-brand-gold group-hover:scale-110 transition-transform">
          <Plus size={12} />
        </div>
      </div>

      {/* Item Sprite Icon */}
      <div className="w-14 h-14 mx-auto relative mb-2 flex items-center justify-center">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-contain drop-shadow-md group-hover:scale-105 transition-transform"
        />
      </div>

      <div>
        <h4 className="font-serif font-bold text-xs text-brand-ink dark:text-white leading-tight mb-1 line-clamp-1">
          {item.name}
        </h4>
        <div className="flex items-center justify-between text-[9px] text-brand-muted font-mono">
          <span className="capitalize">{item.category}</span>
          {placedCount > 0 && (
            <span className="text-brand-gold font-bold">Colocados: {placedCount}</span>
          )}
        </div>
      </div>
    </div>
  );
}
