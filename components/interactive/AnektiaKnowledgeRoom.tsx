'use client';
import React, { useState, useRef, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Move, 
  Grid, 
  RotateCw, 
  Trash2, 
  Plus, 
  CheckCircle2, 
  Lock, 
  Eye, 
  Layers, 
  BookOpen, 
  Compass, 
  X,
  Save,
  Info,
  Check
} from 'lucide-react';
import { useRoom } from '@/context/RoomContext';
import { ROOM_ITEM_CATALOG, getCatalogItemById } from '@/data/roomCatalog';
import type { PlacedRoomItem, ItemCategory, RoomItemCatalogEntry } from '@/types/room';
import { cn } from '@/lib/utils';

export function AnektiaKnowledgeRoom() {
  const {
    roomData,
    mode,
    setMode,
    showGrid,
    setShowGrid,
    selectedPlacedItem,
    setSelectedPlacedItem,
    placeItemFromInventory,
    movePlacedItem,
    rotatePlacedItem,
    removePlacedItem,
    saveRoom,
    unlockedCatalog,
    isSaving
  } = useRoom();

  const canvasRef = useRef<HTMLDivElement>(null);
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 800, height: 600 });
  const [activeCategory, setActiveCategory] = useState<ItemCategory | 'all'>('all');

  // Track responsive canvas dimensions
  useEffect(() => {
    const updateDimensions = () => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        setCanvasDimensions({
          width: rect.width,
          height: rect.height
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const gridColumns = roomData.gridColumns || 20;
  const gridRows = roomData.gridRows || 15;

  // Convert logical grid cell to pixels (Responsive Coordinates)
  const cellPxWidth = canvasDimensions.width / gridColumns;
  const cellPxHeight = canvasDimensions.height / gridRows;

  // Depth-sorted placed items for natural isometric layer ordering
  const sortedPlacedItems = useMemo(() => {
    return [...roomData.placedItems].sort((a, b) => (a.gridY - b.gridY) || (a.gridX - b.gridX));
  }, [roomData.placedItems]);

  // Inventory Filter Categories
  const categories: { id: ItemCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'Todos' },
    { id: 'furniture', label: 'Muebles' },
    { id: 'scientific', label: 'Científicos' },
    { id: 'decoration', label: 'Decoración' },
    { id: 'plants', label: 'Plantas' },
    { id: 'collectibles', label: 'Coleccionables' }
  ];

  const filteredCatalog = useMemo(() => {
    return ROOM_ITEM_CATALOG.filter(item => {
      if (activeCategory !== 'all' && item.category !== activeCategory) return false;
      return true;
    });
  }, [activeCategory]);

  // Handle Drag End in Edit Mode: Calculates snapped logical grid coordinates
  const handleDragEnd = (instanceId: string, info: any, initialGridX: number, initialGridY: number) => {
    if (!canvasRef.current || cellPxWidth === 0 || cellPxHeight === 0) return;
    
    const deltaGridX = Math.round(info.offset.x / cellPxWidth);
    const deltaGridY = Math.round(info.offset.y / cellPxHeight);

    const targetGridX = initialGridX + deltaGridX;
    const targetGridY = initialGridY + deltaGridY;

    movePlacedItem(instanceId, targetGridX, targetGridY);
  };

  return (
    <div className="bg-[#FAF8F5] dark:bg-[#121216] border border-brand-gold/30 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden font-sans transition-colors duration-500">
      {/* ROOM HEADER & CONTROLS */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-brand-gold/20 pb-6 mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-[0.4em] text-[#8B6914] dark:text-brand-gold mb-1">
            <Sparkles size={14} /> Sistema Interactivo 2D • Habitación del Conocimiento
          </div>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-brand-ink dark:text-white">
            {mode === 'edit' ? 'Taller de Decoración & Reorganización' : 'Santuario del Saber Personal'}
          </h2>
        </div>

        {/* View / Edit Mode Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {mode === 'edit' ? (
            <>
              {/* Grid Overlay Toggle */}
              <button
                onClick={() => setShowGrid(!showGrid)}
                className={cn(
                  "p-2.5 rounded-xl border text-xs transition-all flex items-center gap-2 font-mono font-bold",
                  showGrid 
                    ? "bg-brand-gold/20 border-brand-gold text-[#8B6914] dark:text-brand-gold" 
                    : "bg-white/5 border-black/10 dark:border-white/10 text-brand-muted"
                )}
                title="Mostrar/ocultar cuadrícula de ajuste"
              >
                <Grid size={16} />
                <span className="hidden sm:inline">Cuadrícula</span>
              </button>

              {/* View Mode Switcher */}
              <button
                onClick={() => {
                  setMode('view');
                  setSelectedPlacedItem(null);
                  saveRoom();
                }}
                className="px-5 py-2.5 bg-brand-gold text-brand-ink font-mono font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-black hover:text-brand-gold transition-all shadow-md flex items-center gap-2"
              >
                <Eye size={14} />
                <span>Modo Contemplación</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setMode('edit')}
              className="px-5 py-2.5 bg-brand-gold text-brand-ink font-mono font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-black hover:text-brand-gold transition-all shadow-md flex items-center gap-2"
            >
              <Move size={14} />
              <span>Modo Decoración 2D</span>
            </button>
          )}
        </div>
      </div>

      {/* 2D CANVAS CONTAINER (RESPONSIVE COORDINATE SPACE) */}
      <div
        ref={canvasRef}
        className="relative w-full h-[420px] sm:h-[520px] md:h-[620px] rounded-3xl overflow-hidden border-2 border-brand-gold/30 shadow-2xl bg-[#09090D] select-none"
      >
        {/* ROOM ISOMETRIC BACKGROUND */}
        <Image
          src="/images/anektia_pixel_isometric_room.png"
          alt="Habitación del Conocimiento"
          fill
          className="object-cover pointer-events-none opacity-90"
        />

        {/* Ambient Warm Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

        {/* OPTIONAL LOGICAL GRID OVERLAY (SNAPPING VISUALIZER IN EDIT MODE) */}
        {mode === 'edit' && showGrid && (
          <div className="absolute inset-0 pointer-events-none z-10 border border-brand-gold/20">
            {Array.from({ length: gridRows }).map((_, r) => (
              <div 
                key={r} 
                className="w-full border-b border-brand-gold/10 flex"
                style={{ height: `${100 / gridRows}%` }}
              >
                {Array.from({ length: gridColumns }).map((_, c) => (
                  <div 
                    key={c} 
                    className="border-r border-brand-gold/10 flex-1 hover:bg-brand-gold/5"
                  />
                ))}
              </div>
            ))}
          </div>
        )}

        {/* RENDER PLACED ROOM ITEMS IN 2D LOGICAL GRID COORDINATES */}
        {sortedPlacedItems.map(item => {
          const catalogEntry = getCatalogItemById(item.itemId);
          if (!catalogEntry) return null;

          const isSelected = selectedPlacedItem?.id === item.id;
          const widthGrid = catalogEntry.asset.widthGrid || 2;
          const heightGrid = catalogEntry.asset.heightGrid || 2;

          // Convert grid coordinates to percentages for responsive rendering
          const leftPercent = (item.gridX / gridColumns) * 100;
          const topPercent = (item.gridY / gridRows) * 100;
          const itemWidthPercent = (widthGrid / gridColumns) * 100;
          const itemHeightPercent = (heightGrid / gridRows) * 100;

          return (
            <motion.div
              key={item.id}
              drag={mode === 'edit'}
              dragConstraints={canvasRef}
              dragElastic={0.05}
              dragMomentum={false}
              onDragEnd={(_, info) => handleDragEnd(item.id, info, item.gridX, item.gridY)}
              onClick={() => {
                if (mode === 'edit') {
                  setSelectedPlacedItem(item);
                }
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
                "group cursor-pointer transition-transform duration-150 relative flex items-center justify-center",
                mode === 'edit' && "cursor-grab active:cursor-grabbing",
                isSelected && "scale-105"
              )}
            >
              {/* Asset Sprite: Pixel Art Image vs SVG Icon */}
              {catalogEntry.asset.type === 'pixel_art' ? (
                <div className="relative w-full h-full">
                  <Image
                    src={catalogEntry.asset.src}
                    alt={catalogEntry.name}
                    fill
                    className={cn(
                      "object-contain drop-shadow-[0_12px_20px_rgba(0,0,0,0.7)] group-hover:scale-105 transition-transform",
                      isSelected && "drop-shadow-[0_0_20px_#D4AF37]"
                    )}
                  />
                </div>
              ) : (
                /* Fallback Styled Vector Graphic */
                <div className="w-full h-full bg-brand-gold/15 border-2 border-brand-gold/50 rounded-2xl p-3 flex flex-col items-center justify-center text-brand-gold shadow-xl backdrop-blur-md">
                  <Compass className="w-8 h-8 text-brand-gold mb-1" />
                  <span className="text-[9px] font-mono font-bold text-center line-clamp-1">{catalogEntry.name}</span>
                </div>
              )}

              {/* Selection Border Glow */}
              {mode === 'edit' && isSelected && (
                <div className="absolute -inset-1 rounded-2xl border-2 border-brand-gold animate-pulse bg-brand-gold/10 pointer-events-none" />
              )}

              {/* Item Hover / Selection Label */}
              <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 bg-black/90 text-brand-gold text-[9px] font-mono font-bold px-2.5 py-1 rounded-md border border-brand-gold/40 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-xl">
                {catalogEntry.name}
              </div>
            </motion.div>
          );
        })}

        {/* STATUS HUD OVERLAY */}
        <div className="absolute top-4 left-4 z-40 bg-black/80 backdrop-blur-md border border-brand-gold/30 px-4 py-2 rounded-2xl text-brand-gold text-xs font-mono font-bold flex items-center gap-3 shadow-xl">
          <Layers size={14} />
          <span>Objetos en Habitación: {sortedPlacedItems.length}</span>
          {isSaving && (
            <span className="text-[10px] text-emerald-400 font-normal flex items-center gap-1">
              <Check size={12} /> Guardando...
            </span>
          )}
        </div>
      </div>

      {/* EDIT MODE: INVENTORY DRAWER & SELECTED ITEM ACTIONS */}
      {mode === 'edit' && (
        <div className="space-y-6">
          {/* CATEGORY FILTER TABS */}
          <div className="flex items-center justify-between border-b border-brand-gold/20 pb-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    "px-3.5 py-1.5 text-[10px] font-mono font-bold uppercase tracking-widest rounded-xl transition-all border shrink-0",
                    activeCategory === cat.id
                      ? "bg-brand-gold text-brand-ink border-brand-gold shadow-md font-black"
                      : "bg-white dark:bg-white/5 text-brand-ink/70 dark:text-brand-offwhite/70 hover:text-brand-gold border-black/10 dark:border-white/10"
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <span className="text-[10px] font-mono uppercase tracking-widest text-[#8B6914] dark:text-brand-gold font-bold shrink-0">
              Desbloqueados: {unlockedCatalog.length} / {ROOM_ITEM_CATALOG.length}
            </span>
          </div>

          {/* INVENTORY CATALOG CARDS */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {filteredCatalog.map(item => {
              const isUnlocked = roomData.unlockedItemIds.includes(item.id);
              const placedCount = roomData.placedItems.filter(p => p.itemId === item.id).length;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    if (isUnlocked) {
                      placeItemFromInventory(item.id);
                    }
                  }}
                  className={cn(
                    "p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden group",
                    isUnlocked
                      ? placedCount > 0
                        ? "bg-brand-gold/15 border-brand-gold shadow-md"
                        : "bg-white dark:bg-white/5 border-brand-gold/30 hover:border-brand-gold"
                      : "bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/5 opacity-50 cursor-not-allowed"
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[8px] font-mono uppercase tracking-widest text-[#8B6914] dark:text-brand-gold font-bold">
                      {isUnlocked ? (placedCount > 0 ? `COLOCADO (${placedCount})` : "EN INVENTARIO") : "BLOQUEADO"}
                    </span>
                    {isUnlocked ? <Plus size={12} className="text-brand-gold" /> : <Lock size={12} className="text-brand-muted" />}
                  </div>

                  <div className="w-12 h-12 mx-auto relative mb-2">
                    {item.asset.type === 'pixel_art' ? (
                      <Image src={item.asset.src} alt={item.name} fill className={cn("object-contain", !isUnlocked && "grayscale")} />
                    ) : (
                      <Compass className="w-8 h-8 text-brand-gold mx-auto" />
                    )}
                  </div>

                  <div>
                    <h4 className="font-serif font-bold text-[11px] text-brand-ink dark:text-white leading-tight mb-1 line-clamp-1">
                      {item.name}
                    </h4>
                    <p className="text-[9px] text-[#8B6914] dark:text-brand-gold font-mono line-clamp-2">
                      {isUnlocked ? item.description : item.unlockCondition.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* FLOATING ACTION TOOLBAR FOR SELECTED PLACED ITEM */}
          <AnimatePresence>
            {selectedPlacedItem && (
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] bg-white dark:bg-[#181822] border-2 border-brand-gold rounded-2xl p-4 shadow-2xl flex items-center gap-6 max-w-lg w-full"
              >
                {(() => {
                  const catalogItem = getCatalogItemById(selectedPlacedItem.itemId);
                  if (!catalogItem) return null;

                  return (
                    <>
                      <div className="w-12 h-12 relative shrink-0 rounded-xl bg-brand-gold/10 border border-brand-gold/30 p-1">
                        {catalogItem.asset.type === 'pixel_art' ? (
                          <Image src={catalogItem.asset.src} alt={catalogItem.name} fill className="object-contain" />
                        ) : (
                          <Compass className="w-8 h-8 text-brand-gold mx-auto" />
                        )}
                      </div>

                      <div className="flex-1">
                        <span className="text-[9px] font-mono uppercase tracking-widest text-brand-gold font-bold block">
                          Mueble Seleccionado ({selectedPlacedItem.gridX}, {selectedPlacedItem.gridY})
                        </span>
                        <h4 className="font-serif font-bold text-xs text-brand-ink dark:text-white">
                          {catalogItem.name}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2">
                        {catalogItem.allowRotation && (
                          <button
                            onClick={() => rotatePlacedItem(selectedPlacedItem.id)}
                            className="p-2 rounded-xl border border-brand-gold/30 text-brand-gold hover:bg-brand-gold/10 transition-colors"
                            title="Rotar 90°"
                          >
                            <RotateCw size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => removePlacedItem(selectedPlacedItem.id)}
                          className="p-2 rounded-xl border border-red-500/30 text-red-500 hover:bg-red-500/10 transition-colors"
                          title="Guardar en inventario"
                        >
                          <Trash2 size={16} />
                        </button>
                        <button
                          onClick={() => setSelectedPlacedItem(null)}
                          className="px-3 py-2 rounded-xl bg-brand-gold text-brand-ink font-bold text-xs"
                        >
                          Listo
                        </button>
                      </div>
                    </>
                  );
                })()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
