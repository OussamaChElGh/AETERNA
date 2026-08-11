'use client';
import React, { useState } from 'react';
import { useCombinedAssets } from '@/hooks/useCombinedAssets';
import { PlacedRoomItem, RoomCatalogItem } from '@/types/roomEngine';
import { BookOpen, Plus, ChevronRight, ChevronLeft, Lock } from 'lucide-react';
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
  const { catalog, assets } = useCombinedAssets();

  const categories = [
    { id: 'all', label: 'Todo' },
    { id: 'furniture', label: 'Mobiliario' },
    { id: 'scientific', label: 'Instrumentos' },
    { id: 'decoration', label: 'Decoración' }
  ];

  const filteredCatalog = catalog.filter(item => {
    if (activeCategory !== 'all' && item.category !== activeCategory) return false;
    return true;
  });

  const getDisciplineLabel = (disc: string) => {
    switch (disc) {
      case 'physics': return 'Física';
      case 'mathematics': return 'Mates';
      case 'philosophy': return 'Filosofía';
      case 'biology': return 'Biología';
      case 'computer_science': return 'Comp';
      default: return 'General';
    }
  };

  const getRarityStyle = (rarity: string) => {
    switch (rarity) {
      case 'epic': return { text: 'Épico', badge: 'bg-amber-500/20 text-amber-400', border: 'border-amber-500/30 group-hover:border-amber-500/70', glow: 'shadow-[0_0_15px_rgba(245,158,11,0.2)]' };
      case 'rare': return { text: 'Raro', badge: 'bg-purple-500/20 text-purple-400', border: 'border-purple-500/30 group-hover:border-purple-500/70', glow: 'shadow-[0_0_15px_rgba(168,85,247,0.2)]' };
      case 'uncommon': return { text: 'Poco Común', badge: 'bg-blue-500/20 text-blue-400', border: 'border-blue-500/30 group-hover:border-blue-500/70', glow: 'shadow-[0_0_15px_rgba(59,130,246,0.2)]' };
      default: return { text: 'Común', badge: 'bg-emerald-500/20 text-emerald-400', border: 'border-emerald-500/30 group-hover:border-emerald-500/70', glow: 'shadow-[0_0_15px_rgba(16,185,129,0.2)]' };
    }
  };

  return (
    <>
      {/* Floating Toggle Button when closed */}
      <button 
        onClick={onToggle}
        className={cn(
          "fixed top-1/2 right-0 -translate-y-1/2 z-[890] bg-brand-ink/90 backdrop-blur-md text-brand-gold border border-brand-gold/40 border-r-0 rounded-l-2xl p-2 transition-transform duration-500 shadow-[-5px_0_20px_rgba(212,175,55,0.15)] flex items-center justify-center hover:bg-brand-gold/10 hover:pr-4",
          isOpen ? "translate-x-full" : "translate-x-0"
        )}
      >
        <ChevronLeft size={24} />
      </button>

      {/* Main Sidebar */}
      <div className={cn(
        "fixed top-0 right-0 h-full z-[900] bg-[#0A0A0C]/95 backdrop-blur-3xl border-l border-brand-gold/30 shadow-[-20px_0_80px_rgba(212,175,55,0.15)] transition-transform duration-500 font-sans w-full sm:w-[380px] flex flex-col overflow-hidden",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        {/* Decorative Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(212,175,55,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(212,175,55,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

        {/* Header Bar */}
        <div className="relative z-10 flex items-center justify-between p-6 border-b border-brand-gold/20 bg-gradient-to-b from-brand-ink to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.2)]">
              <BookOpen className="text-brand-gold" size={18} />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-brand-offwhite leading-tight">
                Colección
              </h3>
              <span className="text-[10px] text-brand-gold/70 font-mono font-bold uppercase tracking-widest">
                {placedItems.length} En Uso
              </span>
            </div>
          </div>

          <button 
            onClick={onToggle}
            className="p-2 rounded-full bg-brand-gold/10 text-brand-gold hover:bg-brand-gold hover:text-brand-ink transition-colors shadow-sm"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Category Filters */}
        <div className="relative z-10 p-4 border-b border-white/5">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "px-4 py-2 text-[10px] font-mono font-bold uppercase tracking-wider rounded-lg transition-all border shrink-0 select-none",
                  activeCategory === cat.id
                    ? "bg-brand-gold text-brand-ink border-brand-gold shadow-[0_0_10px_rgba(212,175,55,0.3)]"
                    : "bg-white/5 text-brand-offwhite/60 border-white/5 hover:bg-white/10 hover:text-brand-gold"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Catalog Grid */}
        <div className="relative z-10 flex-1 overflow-y-auto p-4 custom-scrollbar">
          <div className="grid grid-cols-2 gap-4">
            {filteredCatalog.map(item => {
              const instanceCount = placedItems.filter(p => p.catalogItemId === item.id).length;
              const asset = assets[item.assetId];
              const isLocked = unlockedIds ? !unlockedIds.has(item.id) : false;
              const rarityStyle = getRarityStyle(item.rarity);

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    if (!isLocked) onSpawnItem(item);
                  }}
                  className={cn(
                    "flex flex-col p-3 rounded-2xl border transition-all duration-300 relative group select-none overflow-hidden bg-[#14110D]",
                    isLocked
                      ? "border-white/5 bg-black/40 cursor-not-allowed opacity-60 grayscale"
                      : cn("cursor-pointer hover:-translate-y-1 hover:bg-[#1A1611]", rarityStyle.border, rarityStyle.glow)
                  )}
                >
                  {isLocked && (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-[2px]">
                      <Lock size={24} className="text-brand-gold/60 mb-2" />
                      <span className="text-[9px] font-mono font-bold text-brand-gold/60 uppercase tracking-widest text-center px-2">Bloqueado</span>
                    </div>
                  )}

                  {/* Image Container */}
                  <div className="w-full h-24 relative shrink-0 bg-gradient-to-b from-white/5 to-transparent rounded-xl p-2 mb-3 flex items-center justify-center group-hover:from-brand-gold/10 transition-colors">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={asset?.src?.replace(/\\/g, '/') || '/images/anektia_master_sofa.png'}
                      alt={item.name}
                      className="w-full h-full object-contain drop-shadow-xl group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    {/* Badge */}
                    <div className="absolute -bottom-2 right-1 z-10">
                      <span className={cn("text-[8px] font-mono font-bold px-2 py-0.5 rounded-full border shadow-sm", rarityStyle.badge, "border-current/20")}>
                        {rarityStyle.text}
                      </span>
                    </div>
                  </div>

                  {/* Text Details */}
                  <div className="flex flex-col flex-1 justify-between">
                    <div>
                      <span className="text-[8px] font-mono font-bold uppercase tracking-wider text-brand-gold/70 block mb-1">
                        {getDisciplineLabel(item.discipline)}
                      </span>
                      <h4 className="font-serif font-bold text-[13px] text-brand-offwhite leading-tight mb-2 group-hover:text-brand-gold transition-colors">
                        {item.name}
                      </h4>
                    </div>

                    <div className="flex items-center justify-between text-[9px] font-mono border-t border-white/5 pt-2 mt-auto">
                      <span className="text-brand-offwhite/50">
                        {instanceCount > 0 ? `En sala: ${instanceCount}` : 'Disponible'}
                      </span>
                      {!isLocked && (
                        <div className="w-5 h-5 rounded-full bg-brand-gold/10 flex items-center justify-center group-hover:bg-brand-gold group-hover:text-brand-ink transition-colors">
                          <Plus size={12} className="text-brand-gold group-hover:text-brand-ink" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
