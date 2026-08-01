'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { ROOM_ENGINE_CATALOG } from '@/data/roomEngineCatalog';
import { PlacedRoomItem, UserRoomData, RoomCatalogItem } from '@/types/roomEngine';
import { 
  loadRoomEngineState, 
  saveRoomEngineStateDebounced, 
  GRID_SIZE_X,
  GRID_SIZE_Y
} from '@/lib/roomEngineStorage';
import { useAuth } from '@/context/AuthContext';
import { RoomEngineHUD } from './RoomEngineHUD';
import { IsoRoomStage } from './IsoRoomStage';
import { InventoryDrawer } from './InventoryDrawer';

export function RoomEngine() {
  const { user } = useAuth();
  const userId = user?.uid || 'anonymous';

  const [engineState, setEngineState] = useState<UserRoomData>({
    roomId: 'main_2d_room',
    theme: 'parchment_classical',
    gridSizeX: GRID_SIZE_X,
    gridSizeY: GRID_SIZE_Y,
    placedItems: []
  });

  const [editMode, setEditMode] = useState<boolean>(false); // Start in clean Contemplation Mode by default
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [showDebugMode, setShowDebugMode] = useState<boolean>(false);
  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(null);
  const [inventoryOpen, setInventoryOpen] = useState<boolean>(true);

  // Load initial state on mount
  useEffect(() => {
    const loaded = loadRoomEngineState();
    setEngineState(loaded);
  }, []);

  // Auto-deselect item when switching to Contemplation Mode
  useEffect(() => {
    if (!editMode) {
      setSelectedInstanceId(null);
    }
  }, [editMode]);

  // Update placed items state and auto-save via Debounce (300ms) to LocalStorage & Firestore
  const updatePlacedItems = useCallback((newItems: PlacedRoomItem[]) => {
    setEngineState(prev => {
      const updatedState = { ...prev, placedItems: newItems };
      saveRoomEngineStateDebounced(updatedState, userId);
      return updatedState;
    });
  }, [userId]);

  // Spawn a NEW instance of a catalog item onto the 2D Isometric Room Stage
  const handleSpawnItem = (item: RoomCatalogItem) => {
    const newInstanceId = `inst_${item.id}_${Date.now()}`;
    const defaultTileX = item.placementSurface === 'wall' ? 4 : 7;
    const defaultTileY = item.placementSurface === 'wall' ? 0 : 7;
    const defaultTileZ = item.placementSurface === 'desk' ? 1 : 0;

    const newItem: PlacedRoomItem = {
      instanceId: newInstanceId,
      catalogItemId: item.id,
      tileX: defaultTileX,
      tileY: defaultTileY,
      tileZ: defaultTileZ,
      rotation: 0
    };

    const updated = [...engineState.placedItems, newItem];
    updatePlacedItems(updated);
    setSelectedInstanceId(newInstanceId);
  };

  // Update position tileX, tileY, and optional tileZ (wall elevation)
  const handleUpdatePosition = (instanceId: string, tileX: number, tileY: number, tileZ?: number) => {
    const updated = engineState.placedItems.map(item => {
      if (item.instanceId === instanceId) {
        return {
          ...item,
          tileX,
          tileY,
          tileZ: tileZ !== undefined ? tileZ : item.tileZ
        };
      }
      return item;
    });
    updatePlacedItems(updated);
  };

  // Rotate item orientation (0° -> 90° -> 180° -> 270° -> 0°) by switching sprites (NO CSS rotate)
  const handleRotate = (instanceId: string) => {
    const nextRotations: Record<0 | 90 | 180 | 270, 0 | 90 | 180 | 270> = {
      0: 90,
      90: 180,
      180: 270,
      270: 0
    };

    const updated: PlacedRoomItem[] = engineState.placedItems.map(item => {
      if (item.instanceId === instanceId) {
        const nextRot = nextRotations[item.rotation] ?? 0;
        return {
          ...item,
          rotation: nextRot
        };
      }
      return item;
    });
    updatePlacedItems(updated);
  };

  // Toggle surface elevation (tileZ = 0 for floor, tileZ = 1 for desk surface)
  const handleToggleElevation = (instanceId: string) => {
    const updated = engineState.placedItems.map(item => {
      if (item.instanceId === instanceId) {
        return {
          ...item,
          tileZ: item.tileZ === 1 ? 0 : 1
        };
      }
      return item;
    });
    updatePlacedItems(updated);
  };

  // Delete item instance from room
  const handleDelete = (instanceId: string) => {
    const updated = engineState.placedItems.filter(item => item.instanceId !== instanceId);
    updatePlacedItems(updated);
    if (selectedInstanceId === instanceId) {
      setSelectedInstanceId(null);
    }
  };

  // Reset to default room layout
  const handleReset = () => {
    const defaultState = loadRoomEngineState();
    updatePlacedItems(defaultState.placedItems);
    setSelectedInstanceId(null);
  };

  return (
    <div className="min-h-screen bg-[#F4F1EA] dark:bg-[#0E0E12] p-4 sm:p-6 md:p-8 font-sans text-brand-ink dark:text-white transition-colors duration-500 relative">
      <div className="max-w-6xl mx-auto pb-24">
        {/* Room Engine HUD Header */}
        <RoomEngineHUD
          editMode={editMode}
          setEditMode={setEditMode}
          showGrid={showGrid}
          setShowGrid={setShowGrid}
          showDebugMode={showDebugMode}
          setShowDebugMode={setShowDebugMode}
          onReset={handleReset}
          itemCount={engineState.placedItems.length}
        />

        {/* 2D Isometric Room Stage Viewport */}
        <IsoRoomStage
          placedItems={engineState.placedItems}
          editMode={editMode}
          showGrid={showGrid}
          showDebugMode={showDebugMode}
          selectedInstanceId={selectedInstanceId}
          onSelectItem={(item) => setSelectedInstanceId(item ? item.instanceId : null)}
          onUpdatePosition={handleUpdatePosition}
          onRotate={handleRotate}
          onToggleElevation={handleToggleElevation}
          onDelete={handleDelete}
          onSpawnItem={handleSpawnItem}
        />

        {/* Inventory Drawer (Only Visible in Decoration Mode) */}
        {editMode && (
          <InventoryDrawer
            isOpen={inventoryOpen}
            onToggle={() => setInventoryOpen(!inventoryOpen)}
            onSpawnItem={handleSpawnItem}
            placedItems={engineState.placedItems}
          />
        )}
      </div>
    </div>
  );
}
