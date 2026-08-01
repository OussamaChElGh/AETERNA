'use client';
import React, { useState } from 'react';
import { CATALOG_ITEMS, CatalogItem, PlacedItem } from '@/data/roomItems';
import { InventoryItem } from './InventoryItem';
import { Layers, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ObjectInventoryProps {
  onAddItem: (item: CatalogItem) => void;
  placedItems: PlacedItem[];
}

export function ObjectInventory({ onAddItem, placedItems }: ObjectInventoryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'Todos (10)' },
    { id: 'furniture', label: 'Muebles' },
    { id: 'scientific', label: 'Científicos' },
    { id: 'decoration', label: 'Decoración' },
    { id: 'plants', label: 'Plantas' },
    { id: 'books', label: 'Libros' }
  ];

  const filteredItems = CATALOG_ITEMS.filter(item => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="bg-[#FAF8F5] dark:bg-[#16161D] border border-brand-gold/30 rounded-2xl p-5 shadow-xl font-sans h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 mb-4 border-b border-brand-gold/20 pb-3">
          <Layers className="text-brand-gold" size={16} />
          <h3 className="font-serif font-bold text-sm text-brand-ink dark:text-white">
            Inventario de Objetos Pixel-Art
          </h3>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                "px-3 py-1.5 text-[9px] font-mono font-bold uppercase tracking-wider rounded-lg transition-all border shrink-0",
                selectedCategory === cat.id
                  ? "bg-brand-gold text-brand-ink border-brand-gold font-black shadow-sm"
                  : "bg-white dark:bg-white/5 text-brand-ink/70 dark:text-brand-offwhite/70 border-black/10 dark:border-white/10 hover:text-brand-gold"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid of Catalog Items */}
        <div className="grid grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-1">
          {filteredItems.map(item => {
            const count = placedItems.filter(p => p.itemId === item.id).length;
            return (
              <InventoryItem
                key={item.id}
                item={item}
                onAddItem={onAddItem}
                placedCount={count}
              />
            );
          })}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-brand-gold/20 text-[10px] text-brand-muted font-mono text-center">
        💡 Haz clic en cualquier objeto para añadir una nueva instancia a la habitación.
      </div>
    </div>
  );
}
