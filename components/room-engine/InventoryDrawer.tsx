'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { ROOM_ENGINE_CATALOG } from '@/data/roomEngineCatalog';
import { getRoomAsset } from '@/data/roomEngineAssets';
import { PlacedRoomItem, RoomCatalogItem } from '@/types/roomEngine';
import { BookOpen, Plus, ChevronUp, ChevronDown, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InventoryDrawerProps {
  isOpen: boolean;
  onToggle: () => void;
  onSpawnItem: (item: RoomCatalogItem) => void;
  placedItems: PlacedRoomItem[];
  unlockedIds?: Set<string>;
}

export function InventoryDrawer({
  isOpen,
  onToggle,
  onSpawnItem,
  placedItems,
  unlockedIds
}: InventoryDrawerProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'Colección Completa' },
    { id: 'furniture', label: 'Mobiliario' },
    { id: 'scientific', label: 'Instrumentos' }
  ];

  const filteredCatalog = ROOM_ENGINE_CATALOG.filter(item => {
    if (activeCategory !== 'all' && item.category !== activeCategory) return false;
    return true;
  });

  const getDisciplineLabel = (disc: string) => {
    switch (disc) {
      case 'physics': return 'Física';
      case 'mathematics': return 'Matemáticas';
      case 'philosophy': return 'Filosofía';
      case 'biology': return 'Biología';
      case 'computer_science': return 'Humanidades';
      default: return 'General';
    }
  };

  const getRarityBadge = (rarity: string) => {
    switch (rarity) {
      case 'epic': return { text: 'Épico', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' };
      case 'rare': return { text: 'Raro', color: 'bg-purple-500/10 text-purple-400 border-purple-500/30' };
      case 'uncommon': return { text: 'Poco Común', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' };
      default: return { text: 'Común', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' };
    }
  };

  return (
    <div className={cn(
      "fixed bottom-4 left-1/2 -translate-x-1/2 z-[900] bg-brand-ink/95 backdrop-blur-md border-2 border-brand-gold/40 rounded-3xl shadow-[0_0_60px_rgba(212,175,55,0.15)] transition-all duration-300 font-sans max-w-4xl w-[92vw]",
      isOpen ? "p-5 max-h-[340px]" : "p-3 max-h-[58px] overflow-hidden"
    )}>
      {/* Header Bar */}
      <div 
        onClick={onToggle}
        className="flex items-center justify-between cursor-pointer select-none border-b border-brand-gold/20 pb-2 mb-3"
      >
        <div className="flex items-center gap-2.5">
          <BookOpen className="text-brand-gold" size={17} />
          <h3 className="font-serif font-bold text-sm text-brand-offwhite uppercase tracking-wider">
            Colección del Conocimiento
          </h3>
          <span className="text-[10px] text-brand-gold font-mono font-bold bg-brand-gold/10 px-2.5 py-0.5 rounded-full border border-brand-gold/30">
            {placedItems.length} {placedItems.length === 1 ? 'Colocado' : 'Colocados'}
          </span>
        </div>

        <button className="p-1 rounded-full bg-brand-gold/10 text-brand-gold hover:bg-brand-gold/20 transition-colors">
          {isOpen ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
        </button>
      </div>

      {/* Expanded Catalog Grid */}
      {isOpen && (
        <div className="space-y-3">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveCategory(cat.id);
                }}
                className={cn(
                  "px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider rounded-xl transition-all border shrink-0 select-none",
                  activeCategory === cat.id
                    ? "bg-brand-gold text-brand-ink border-brand-gold font-black shadow-sm"
                    : "bg-white/5 text-brand-offwhite/70 border-white/10 hover:text-brand-gold"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Catalog Item Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-h-[200px] overflow-y-auto pr-1">
            {filteredCatalog.map(item => {
              const instanceCount = placedItems.filter(p => p.catalogItemId === item.id).length;
              const asset = getRoomAsset(item.assetId);
              const badge = getRarityBadge(item.rarity);
              const isLocked = unlockedIds ? !unlockedIds.has(item.id) : false;

              return (
                <div
                  key={item.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isLocked) onSpawnItem(item);
                  }}
                  className={cn(
                    "p-3 rounded-2xl border transition-all flex items-center gap-3 relative group select-none",
                    isLocked
                      ? "border-white/5 bg-black/20 cursor-not-allowed opacity-50 grayscale"
                      : "border-brand-gold/30 bg-white/5 hover:border-brand-gold hover:shadow-xl cursor-pointer active:scale-98"
                  )}
                >
                  {isLocked && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/30 backdrop-blur-[1px]">
                      <Lock size={20} className="text-brand-gold/60" />
                    </div>
                  )}
                  <div className="w-12 h-12 relative shrink-0 bg-brand-gold/10 rounded-xl p-1 border border-brand-gold/20 flex items-center justify-center">
                    <Image
                      src={asset?.src || '/images/aeterna_master_sofa.png'}
                      alt={item.name}
                      fill
                      className="object-contain drop-shadow-md group-hover:scale-105 transition-transform"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-brand-gold">
                        {getDisciplineLabel(item.discipline)}
                      </span>
                      <span className={cn("text-[8px] font-mono font-bold px-1.5 py-0.2 rounded-full border", badge.color)}>
                        {badge.text}
                      </span>
                    </div>

                    <h4 className="font-serif font-bold text-xs text-brand-offwhite leading-tight mb-1">
                      {item.name}
                    </h4>

                    <div className="flex items-center justify-between text-[9px] text-brand-offwhite/40 font-mono">
                      {isLocked ? (
                        <span>Bloqueado · Completar para desbloquear</span>
                      ) : (
                        <span>{instanceCount > 0 ? `En habitación: ${instanceCount}` : 'Disponible'}</span>
                      )}
                      {!isLocked && <Plus size={12} className="text-brand-gold group-hover:scale-125 transition-transform" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
