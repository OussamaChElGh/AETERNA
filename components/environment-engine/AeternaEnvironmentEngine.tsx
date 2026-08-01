'use client';
import React, { useState, useRef, useEffect } from 'react';
import { EnvironmentLayout, EnvironmentTheme, EnvironmentPlacedItem } from '@/types/environmentEngine';
import { Room } from './Room';
import { RoomEngineHUD } from '../room-engine/RoomEngineHUD';
import { InventoryDrawer } from '../room-engine/InventoryDrawer';
import { RoomCatalogItem as LegacyCatalogItem } from '@/types/roomEngine';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AeternaEnvironmentEngineProps {
  layout: EnvironmentLayout;
  theme: EnvironmentTheme;
  initialItems?: EnvironmentPlacedItem[];
}

export function AeternaEnvironmentEngine({
  layout,
  theme,
  initialItems = []
}: AeternaEnvironmentEngineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [placedItems, setPlacedItems] = useState<EnvironmentPlacedItem[]>(initialItems);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [showDebugMode, setShowDebugMode] = useState<boolean>(false);
  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(null);
  const [inventoryOpen, setInventoryOpen] = useState<boolean>(true);

  const [scaleFactor, setScaleFactor] = useState(1.0);
  const [zoom, setZoom] = useState(1.0);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef<{ startX: number; startY: number; initialPanX: number; initialPanY: number } | null>(null);

  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const factor = width / 1200;
      setScaleFactor(Math.max(0.4, Math.min(1.2, factor)));
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    // Furniture items call e.stopPropagation(), so any event reaching here is background
    setSelectedInstanceId(null);
    setIsPanning(true);
    panStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialPanX: pan.x,
      initialPanY: pan.y
    };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isPanning && panStartRef.current) {
      const deltaX = e.clientX - panStartRef.current.startX;
      const deltaY = e.clientY - panStartRef.current.startY;
      setPan({
        x: panStartRef.current.initialPanX + deltaX,
        y: panStartRef.current.initialPanY + deltaY
      });
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isPanning) {
      setIsPanning(false);
      panStartRef.current = null;
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch (err) {}
    }
  };

  const handleResetCamera = () => {
    setZoom(1.0);
    setPan({ x: 0, y: 0 });
  };

  const handleSpawnItem = (item: LegacyCatalogItem) => {
    const newInstanceId = `inst_${item.id}_${Date.now()}`;
    const isWallItem = item.placementSurface === 'wall';
    const newItem: EnvironmentPlacedItem = {
      instanceId: newInstanceId,
      catalogItemId: item.id,
      tileX: isWallItem ? 4 : (layout.spawnPoint?.tileX ?? 7),
      tileY: isWallItem ? 0 : (layout.spawnPoint?.tileY ?? 7),
      tileZ: item.placementSurface === 'desk' ? 1 : 0,
      rotation: 0
    };

    setPlacedItems(prev => [...prev, newItem]);
    setSelectedInstanceId(newInstanceId);
  };

  const handleUpdatePosition = (instanceId: string, tileX: number, tileY: number, tileZ?: number) => {
    setPlacedItems(prev => prev.map(item => {
      if (item.instanceId === instanceId) {
        return { 
          ...item, 
          tileX, 
          tileY,
          tileZ: tileZ !== undefined ? tileZ : item.tileZ 
        };
      }
      return item;
    }));
  };

  const handleRotate = (instanceId: string) => {
    const nextRotations: Record<0 | 90 | 180 | 270, 0 | 90 | 180 | 270> = {
      0: 90, 90: 180, 180: 270, 270: 0
    };
    setPlacedItems(prev => prev.map(item => {
      if (item.instanceId === instanceId) {
        return { ...item, rotation: nextRotations[item.rotation] ?? 0 };
      }
      return item;
    }));
  };

  const handleToggleElevation = (instanceId: string) => {
    setPlacedItems(prev => prev.map(item => {
      if (item.instanceId === instanceId) {
        return { ...item, tileZ: item.tileZ === 1 ? 0 : 1 };
      }
      return item;
    }));
  };

  const handleDelete = (instanceId: string) => {
    setPlacedItems(prev => prev.filter(item => item.instanceId !== instanceId));
    if (selectedInstanceId === instanceId) setSelectedInstanceId(null);
  };

  const handleReset = () => {
    setPlacedItems(initialItems);
    setSelectedInstanceId(null);
    setPan({ x: 0, y: 0 });
    setZoom(1.0);
  };

  const handleWheel = (e: React.WheelEvent) => {
    const zoomDelta = e.deltaY < 0 ? 0.08 : -0.08;
    setZoom(prev => Math.max(0.6, Math.min(1.8, prev + zoomDelta)));
  };

  return (
    <div className="min-h-screen bg-[#F4F1EA] dark:bg-[#0E0E12] p-4 sm:p-6 md:p-8 font-sans text-brand-ink dark:text-white transition-colors duration-500 relative">
      <div className="max-w-6xl mx-auto pb-24">
        {/* HUD Navigation Header */}
        <RoomEngineHUD
          editMode={editMode}
          setEditMode={setEditMode}
          showGrid={showGrid}
          setShowGrid={setShowGrid}
          showDebugMode={showDebugMode}
          setShowDebugMode={setShowDebugMode}
          onReset={handleReset}
          itemCount={placedItems.length}
        />

        {/* ENVIRONMENT ENGINE VIEWPORT */}
        <div 
          ref={containerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onWheel={handleWheel}
          className={cn(
            "relative w-full aspect-[16/10] min-h-[500px] bg-[#1E1712] rounded-3xl border-2 border-brand-gold/50 shadow-2xl overflow-hidden select-none transition-all duration-300 environment-viewport",
            isPanning ? "cursor-grabbing" : "cursor-grab"
          )}
        >
          {/* CAMERA PAN & ZOOM WRAPPER */}
          <div 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '1200px',
              height: '950px',
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: 'top left'
            }}
          >
            {/* MAIN ROOM CONTAINER */}
            <Room
              layout={layout}
              theme={theme}
              placedItems={placedItems}
              editMode={editMode}
              selectedInstanceId={selectedInstanceId}
              onSelect={(selected) => setSelectedInstanceId(selected.instanceId)}
              onUpdatePosition={handleUpdatePosition}
              onRotate={handleRotate}
              onToggleElevation={handleToggleElevation}
              onDelete={handleDelete}
              onDeselect={() => setSelectedInstanceId(null)}
              scaleFactor={scaleFactor * zoom}
            />
          </div>

          {/* CAMERA ZOOM & PAN CONTROLS */}
          <div className="absolute top-4 right-4 z-40 flex items-center gap-1.5 bg-[#FAF8F5]/80 dark:bg-[#16161D]/80 backdrop-blur-md p-1.5 rounded-2xl border border-brand-gold/30 shadow-lg">
            <span className="text-[10px] text-brand-gold font-mono font-bold px-2 py-1 bg-brand-gold/10 rounded-lg border border-brand-gold/20">
              Cámara Pan
            </span>
            <button
              onClick={() => setZoom(prev => Math.min(1.4, prev + 0.1))}
              className="p-2 hover:bg-brand-gold/20 text-brand-ink dark:text-white rounded-xl transition-colors"
              title="Acercar Cámara"
            >
              <ZoomIn size={15} />
            </button>
            <span className="text-[10px] font-mono font-bold text-brand-gold px-1">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom(prev => Math.max(0.7, prev - 0.1))}
              className="p-2 hover:bg-brand-gold/20 text-brand-ink dark:text-white rounded-xl transition-colors"
              title="Alejar Cámara"
            >
              <ZoomOut size={15} />
            </button>
            <button
              onClick={handleResetCamera}
              className="p-2 hover:bg-brand-gold/20 text-brand-gold rounded-xl transition-colors"
              title="Restablecer Vista y Cámara"
            >
              <Maximize2 size={14} />
            </button>
          </div>
        </div>

        {/* Inventory Drawer (Only in Edit Mode) */}
        {editMode && (
          <InventoryDrawer
            isOpen={inventoryOpen}
            onToggle={() => setInventoryOpen(!inventoryOpen)}
            onSpawnItem={handleSpawnItem}
            placedItems={placedItems}
          />
        )}
      </div>
    </div>
  );
}
