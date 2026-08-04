'use client';
import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Compass, ShieldCheck, Zap, Info, CheckCircle2, Lock, Award, Atom, BookOpen, Layers, Move, RotateCw, Trash2, Plus, ArrowRight, X, Grid } from 'lucide-react';
import { cn } from '@/lib/utils';
import relicsData from '@/data/relics.json';

export interface PlacedFurniture {
  instanceId: string;
  itemId: string;
  name: string;
  icon: string;
  x: number; // percentage left 0..100
  y: number; // percentage top 0..100
  boostText: string;
}

export interface FurnitureCatalogItem {
  id: string;
  name: string;
  category: string;
  icon: string;
  defaultX: number;
  defaultY: number;
  unlockCondition: string;
  unlocked: boolean;
  boostText: string;
}

export function AnektiaPixelRoom({ 
  userCompletedArticles = [],
  completedLayers = {},
  unlockedBranches = ['ciencias_naturales', 'ciencias_formales']
}: { 
  userCompletedArticles?: string[];
  completedLayers?: Record<string, string[]>;
  unlockedBranches?: string[];
}) {
  const [activeBranch, setActiveBranch] = useState<string>('ciencias_naturales');
  const [editMode, setEditMode] = useState<boolean>(false);
  const [showGridOverlay, setShowGridOverlay] = useState<boolean>(true);
  const [selectedFurniture, setSelectedFurniture] = useState<PlacedFurniture | null>(null);

  const roomCanvasRef = useRef<HTMLDivElement>(null);

  // Completed articles check
  const physicsCompletedCount = userCompletedArticles.filter(p => p.includes('fisica') || p.includes('como-piensa') || p.includes('4-fuerzas')).length;

  // Posters: relics from data/relics.json unlocked by completed layers.
  // A layer with no defined relic shows an empty frame.
  const relics = relicsData.relics || [];
  const posterEntries = relics.map(r => ({
    ...r,
    unlocked: false,
  }));
  // Also show an empty frame count: number of completed layers without a relic defined.
  const completedLayerTotal = Object.values(completedLayers || {}).reduce((s, arr) => s + (Array.isArray(arr) ? arr.length : 0), 0);
  const emptyPosterCount = Math.max(0, completedLayerTotal - posterEntries.filter(p => p.unlocked).length);

  const hasLevel1 = physicsCompletedCount >= 1 || userCompletedArticles.some(p => p.includes('como-piensa') || p.includes('guia-maestra'));
  const hasLevel2 = physicsCompletedCount >= 3 || userCompletedArticles.some(p => p.includes('mecanica') || p.includes('termodinamica'));
  const hasLevel3 = physicsCompletedCount >= 5 || userCompletedArticles.some(p => p.includes('relatividad') || p.includes('cuantica'));
  const hasLevel4 = physicsCompletedCount >= 8 || userCompletedArticles.some(p => p.includes('cosmologia') || p.includes('teoria-todo'));

  // Catalog of furniture items for Physics
  const PHYSICS_CATALOG: FurnitureCatalogItem[] = [
    {
      id: 'telescope',
      name: 'Telescopio de Galileo',
      category: 'Física',
      icon: '/images/anektia_pixel_telescope.png',
      defaultX: 22,
      defaultY: 35,
      unlockCondition: 'Completar Nivel 1: Fundamentos de Física',
      unlocked: hasLevel1,
      boostText: '+5% XP en Asimilación del Cosmos'
    },
    {
      id: 'prism',
      name: 'Prisma de Newton y Manzana',
      category: 'Física',
      icon: '/images/anektia_pixel_prism.png',
      defaultX: 48,
      defaultY: 55,
      unlockCondition: 'Completar Nivel 2: Física Clásica',
      unlocked: hasLevel2,
      boostText: '+10 XP extra por Decision Box de Física'
    },
    {
      id: 'bookshelf',
      name: 'Estantería de Pergaminos Alquímicos',
      category: 'Física',
      icon: '/images/anektia_pixel_bookshelf.png',
      defaultX: 72,
      defaultY: 30,
      unlockCondition: 'Completar Nivel 3: Física Moderna',
      unlocked: hasLevel3,
      boostText: '+15% XP en Exégesis Avanzada'
    },
    {
      id: 'trophy',
      name: 'Orbe Cuántico del Sabio',
      category: 'Física',
      icon: '/images/anektia_pixel_trophy.png',
      defaultX: 75,
      defaultY: 65,
      unlockCondition: 'Completar Nivel 4: Frontera Teórica',
      unlocked: hasLevel4,
      boostText: 'Titulación: Sabio del Cosmos (+20% XP Global)'
    }
  ];

  // Placed items in 2D isometric room
  const [placedItems, setPlacedItems] = useState<PlacedFurniture[]>([
    {
      instanceId: 'inst-1',
      itemId: 'telescope',
      name: 'Telescopio de Galileo',
      icon: '/images/anektia_pixel_telescope.png',
      x: 22,
      y: 35,
      boostText: '+5% XP en Asimilación del Cosmos'
    },
    {
      instanceId: 'inst-2',
      itemId: 'prism',
      name: 'Prisma de Newton y Manzana',
      icon: '/images/anektia_pixel_prism.png',
      x: 48,
      y: 55,
      boostText: '+10 XP extra por Decision Box de Física'
    }
  ]);

  // Handle adding furniture item from catalog to room
  const placeItemInRoom = (item: FurnitureCatalogItem) => {
    if (!item.unlocked) return;
    const exists = placedItems.some(p => p.itemId === item.id);
    if (exists) return;

    const newItem: PlacedFurniture = {
      instanceId: `inst-${Date.now()}`,
      itemId: item.id,
      name: item.name,
      icon: item.icon,
      x: item.defaultX,
      y: item.defaultY,
      boostText: item.boostText
    };

    setPlacedItems(prev => [...prev, newItem]);
    setSelectedFurniture(newItem);
  };

  // Remove furniture from room
  const removeItemFromRoom = (instanceId: string) => {
    setPlacedItems(prev => prev.filter(p => p.instanceId !== instanceId));
    if (selectedFurniture?.instanceId === instanceId) {
      setSelectedFurniture(null);
    }
  };

  // Handle Dragging in 2D Isometric Space
  const handleDragEnd = (instanceId: string, info: any) => {
    if (!roomCanvasRef.current) return;
    const rect = roomCanvasRef.current.getBoundingClientRect();
    
    // Calculate new position percentages relative to room canvas
    setPlacedItems(prev => prev.map(item => {
      if (item.instanceId === instanceId) {
        const currentLeftPx = (item.x / 100) * rect.width;
        const currentTopPx = (item.y / 100) * rect.height;
        
        const newLeftPx = currentLeftPx + info.offset.x;
        const newTopPx = currentTopPx + info.offset.y;

        const newX = Math.max(5, Math.min(85, Math.round((newLeftPx / rect.width) * 100)));
        const newY = Math.max(10, Math.min(80, Math.round((newTopPx / rect.height) * 100)));

        return { ...item, x: newX, y: newY };
      }
      return item;
    }));
  };

  const isRoomUnlocked = unlockedBranches.includes(activeBranch) || activeBranch === 'ciencias_naturales';

  return (
    <div className="bg-[#FAF8F5] dark:bg-[#121216] border border-brand-gold/30 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden font-sans">
      {/* HEADER & CONTROLS */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-brand-gold/20 pb-6 mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-[0.4em] text-[#8B6914] dark:text-brand-gold mb-1">
            <Sparkles size={14} /> Minijuego 2D • Habitaciones y Muebles estilo Animal Crossing
          </div>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-brand-ink dark:text-white">
            Gabinete de Física y Cosmología
          </h2>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Mode Switcher */}
          <button
            onClick={() => setEditMode(!editMode)}
            className={cn(
              "px-4 py-2 text-[10px] font-mono font-bold uppercase tracking-widest rounded-xl transition-all border flex items-center gap-2 shadow-md",
              editMode 
                ? "bg-brand-gold text-brand-ink border-brand-gold font-black shadow-[0_0_15px_rgba(212,175,55,0.4)]" 
                : "bg-white dark:bg-white/5 text-brand-ink dark:text-brand-offwhite border-brand-gold/30 hover:border-brand-gold"
            )}
          >
            <Move size={14} />
            <span>{editMode ? "Modo Edición Activo" : "Mover Muebles (Animal Crossing)"}</span>
          </button>

          {/* Grid Toggle */}
          <button
            onClick={() => setShowGridOverlay(!showGridOverlay)}
            className={cn(
              "p-2.5 rounded-xl border text-xs transition-all",
              showGridOverlay 
                ? "bg-brand-gold/20 border-brand-gold/40 text-brand-gold" 
                : "bg-white/5 border-white/10 text-brand-muted"
            )}
            title="Alternar cuadrícula de suelo"
          >
            <Grid size={16} />
          </button>
        </div>
      </div>

      {/* LARGE 2D ISOMETRIC ROOM CANVAS */}
      <div 
        ref={roomCanvasRef}
        className="relative w-full h-[480px] md:h-[620px] rounded-3xl overflow-hidden border-2 border-brand-gold/40 shadow-2xl bg-black mb-8 select-none"
      >
        {/* ISOMETRIC ROOM BACKGROUND */}
        <Image 
          src="/images/anektia_pixel_isometric_room.png" 
          alt="Habitación Isométrica Amplia" 
          fill 
          className="object-cover" 
        />

        {/* Ambient Dark Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

        {/* OPTIONAL ISOMETRIC FLOOR GRID OVERLAY */}
        {showGridOverlay && editMode && (
          <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(to_right,#D4AF37_1px,transparent_1px),linear-gradient(to_bottom,#D4AF37_1px,transparent_1px)] [background-size:40px_40px]" />
        )}

        {/* PLACED 2D PHYSICAL FURNITURE ITEMS ON THE FLOOR */}
        {placedItems.map(item => {
          const isSelected = selectedFurniture?.instanceId === item.instanceId;

          return (
            <motion.div
              key={item.instanceId}
              drag={editMode}
              dragConstraints={roomCanvasRef}
              dragElastic={0.05}
              dragMomentum={false}
              onDragEnd={(_, info) => handleDragEnd(item.instanceId, info)}
              onClick={() => setSelectedFurniture(item)}
              style={{
                left: `${item.x}%`,
                top: `${item.y}%`,
                zIndex: Math.floor(item.y * 10) // Depth sorting based on Y position (Isometric Layering!)
              }}
              className={cn(
                "absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group transition-transform duration-150",
                editMode && "cursor-grab active:cursor-grabbing",
                isSelected && "scale-105"
              )}
            >
              <div className="relative w-20 h-20 md:w-28 md:h-28">
                {/* Furniture Pixel Art Sprite */}
                <Image 
                  src={item.icon} 
                  alt={item.name} 
                  fill 
                  className={cn(
                    "object-contain drop-shadow-[0_12px_20px_rgba(0,0,0,0.6)] group-hover:scale-105 transition-transform",
                    isSelected && "drop-shadow-[0_0_20px_#D4AF37]"
                  )} 
                />

                {/* Selection Highlight Ring */}
                {isSelected && (
                  <div className="absolute -inset-2 rounded-2xl border-2 border-brand-gold animate-pulse bg-brand-gold/10 pointer-events-none" />
                )}

                {/* Hover/Select Tag */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black/90 text-brand-gold text-[9px] font-mono font-bold px-3 py-1 rounded-md border border-brand-gold/40 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-xl">
                  {item.name}
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* HUD OVERLAY INFO */}
        <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md border border-brand-gold/40 px-4 py-2.5 rounded-2xl text-brand-gold text-xs font-mono font-bold flex items-center gap-3 shadow-xl">
          <Layers size={16} />
          <span>Muebles Físicos en Habitación: {placedItems.length} En Espacio 2D</span>
        </div>
      </div>

      {/* CATALOG OF UNLOCKED FURNITURE TO ADD TO ROOM */}
      <div className="bg-black/5 dark:bg-white/5 border border-brand-gold/20 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xs font-mono uppercase tracking-widest text-[#8B6914] dark:text-brand-gold font-bold">
              Catálogo de Muebles Desbloqueados (Animal Crossing Style)
            </h3>
            <p className="text-[11px] text-brand-ink/60 dark:text-brand-offwhite/60 italic font-serif">
              Haz clic en cualquier mueble para depositarlo físicamente en el suelo de tu habitación.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {PHYSICS_CATALOG.map(item => {
            const isPlaced = placedItems.some(p => p.itemId === item.id);

            return (
              <div
                key={item.id}
                onClick={() => placeItemInRoom(item)}
                className={cn(
                  "p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden",
                  item.unlocked 
                    ? isPlaced
                      ? "bg-brand-gold/15 border-brand-gold shadow-md" 
                      : "bg-white dark:bg-white/5 border-brand-gold/30 hover:border-brand-gold"
                    : "opacity-40 border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 cursor-not-allowed"
                )}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-[#8B6914] dark:text-brand-gold font-bold">
                    {item.unlocked ? (isPlaced ? "COLOCADO EN SUELO" : "EN INVENTARIO") : "BLOQUEADO"}
                  </span>
                  {item.unlocked ? (
                    isPlaced ? <CheckCircle2 size={14} className="text-emerald-500" /> : <Plus size={14} className="text-brand-gold" />
                  ) : (
                    <Lock size={14} className="text-brand-muted" />
                  )}
                </div>

                <div className="w-16 h-16 mx-auto relative mb-3">
                  <Image src={item.icon} alt={item.name} fill className={cn("object-contain", !item.unlocked && "grayscale opacity-40")} />
                </div>

                <div>
                  <h4 className="font-serif font-bold text-xs text-brand-ink dark:text-white leading-tight mb-1">
                    {item.name}
                  </h4>
                  <p className="text-[10px] text-[#8B6914] dark:text-brand-gold font-mono">
                    {item.unlocked ? item.boostText : item.unlockCondition}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SELECTED FURNITURE ACTION DRAWER */}
      <AnimatePresence>
        {selectedFurniture && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] bg-[#FFFFFF] dark:bg-[#181822] border-2 border-brand-gold rounded-2xl p-4 shadow-2xl flex items-center gap-6 max-w-lg w-full"
          >
            <div className="w-14 h-14 relative shrink-0 rounded-xl bg-brand-gold/15 border border-brand-gold/30 p-1">
              <Image src={selectedFurniture.icon} alt={selectedFurniture.name} fill className="object-contain" />
            </div>

            <div className="flex-1">
              <span className="text-[9px] font-mono uppercase tracking-widest text-brand-gold font-bold block">
                Mueble Seleccionado en Espacio 2D
              </span>
              <h4 className="font-serif font-bold text-sm text-brand-ink dark:text-white">
                {selectedFurniture.name}
              </h4>
              <p className="text-[10px] text-brand-gold font-mono">
                {selectedFurniture.boostText}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => removeItemFromRoom(selectedFurniture.instanceId)}
                className="p-2.5 rounded-xl border border-red-500/30 text-red-500 hover:bg-red-500/10 transition-colors"
                title="Guardar en Inventario"
              >
                <Trash2 size={16} />
              </button>
              <button
                onClick={() => setSelectedFurniture(null)}
                className="p-2.5 rounded-xl bg-brand-gold text-brand-ink font-bold text-xs"
              >
                Listo
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Muro de Posters (reliquias por capa) */}
      <div className="mt-6 p-4 bg-black/5 dark:bg-white/5 border border-brand-gold/20 rounded-2xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-brand-gold font-bold">
            <Award size={14} /> Muro de Posters
          </div>
          <span className="text-[9px] font-mono text-brand-muted">
            {posterEntries.filter(p => p.unlocked).length} desbloqueados · {emptyPosterCount} recuadros vacíos
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {posterEntries.map((poster) => (
            <div
              key={poster.id}
              className={cn(
                "rounded-xl border-2 p-3 flex flex-col items-center gap-2 text-center transition-all",
                poster.unlocked
                  ? "border-brand-gold bg-brand-gold/10"
                  : "border-brand-gold/20 bg-black/5 dark:bg-white/5 opacity-60"
              )}
              title={poster.unlocked ? `${poster.name}: desbloqueado` : poster.description}
            >
              {poster.unlocked ? (
                <>
                  <div className="w-16 h-16 rounded-lg bg-brand-gold/20 border border-brand-gold/30 flex items-center justify-center p-1">
                    <Image src={poster.icon} alt={poster.name} width={56} height={56} className="object-contain" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-brand-ink dark:text-white leading-tight">{poster.name}</span>
                  <span className="text-[8px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 size={10} /> Desbloqueado
                  </span>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-lg border-2 border-dashed border-brand-gold/30 flex items-center justify-center text-brand-muted">
                    <Lock size={20} />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-brand-muted leading-tight">{poster.name}</span>
                  <span className="text-[8px] font-mono text-brand-muted">Bloqueado</span>
                </>
              )}
            </div>
          ))}

          {emptyPosterCount > 0 && (
            <div className="rounded-xl border-2 border-dashed border-brand-gold/30 p-3 flex flex-col items-center justify-center gap-2 text-center min-h-[110px]">
              <div className="w-16 h-16 rounded-lg border-2 border-dashed border-brand-muted/30 flex items-center justify-center text-brand-muted/50">
                <Compass size={20} />
              </div>
              <span className="text-[10px] font-mono font-bold text-brand-muted leading-tight">Ningún hallazgo</span>
              <span className="text-[8px] font-mono text-brand-muted/60">Esta capa no tiene reliquia definida</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
