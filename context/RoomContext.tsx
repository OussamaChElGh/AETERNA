'use client';
import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { RoomRepository } from '@/lib/repositories/roomRepository';
import { RewardService } from '@/lib/services/rewardService';
import { ROOM_ITEM_CATALOG, getCatalogItemById } from '@/data/roomCatalog';
import type { UserRoomData, PlacedRoomItem, RoomItemCatalogEntry } from '@/types/room';

export type RoomViewMode = 'view' | 'edit';

interface RoomContextType {
  roomData: UserRoomData;
  mode: RoomViewMode;
  setMode: (mode: RoomViewMode) => void;
  showGrid: boolean;
  setShowGrid: (show: boolean) => void;
  selectedPlacedItem: PlacedRoomItem | null;
  setSelectedPlacedItem: (item: PlacedRoomItem | null) => void;
  placeItemFromInventory: (itemId: string, targetGridX?: number, targetGridY?: number) => void;
  movePlacedItem: (instanceId: string, newGridX: number, newGridY: number) => void;
  rotatePlacedItem: (instanceId: string) => void;
  removePlacedItem: (instanceId: string) => void;
  saveRoom: () => Promise<void>;
  unlockedCatalog: RoomItemCatalogEntry[];
  evaluateArticleUnlock: (articleSlug: string) => Promise<void>;
  isSaving: boolean;
}

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export function RoomProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const userId = user?.uid || 'anonymous';

  const [roomData, setRoomData] = useState<UserRoomData>({
    id: 'main_room',
    userId: 'anonymous',
    theme: 'parchment_classical',
    gridColumns: 20,
    gridRows: 15,
    placedItems: [],
    unlockedItemIds: ['math_abacus', 'general_bookshelf', 'physics_telescope', 'physics_prism'],
    updatedAt: new Date().toISOString()
  });

  const [mode, setMode] = useState<RoomViewMode>('view');
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [selectedPlacedItem, setSelectedPlacedItem] = useState<PlacedRoomItem | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Load Room Data from Repository
  useEffect(() => {
    let isMounted = true;
    RoomRepository.getRoomData(userId).then(data => {
      if (isMounted) {
        setRoomData(data);
      }
    });
    return () => { isMounted = false; };
  }, [userId]);

  // Unlocked catalog items list
  const unlockedCatalog = useMemo(() => {
    return ROOM_ITEM_CATALOG.map(item => ({
      ...item,
      unlocked: roomData.unlockedItemIds.includes(item.id)
    })).filter(item => item.unlocked);
  }, [roomData.unlockedItemIds]);

  // Place item from inventory into room at snapping grid coordinates
  const placeItemFromInventory = useCallback((itemId: string, targetGridX?: number, targetGridY?: number) => {
    const catalogItem = getCatalogItemById(itemId);
    if (!catalogItem) return;

    // Default snap position if not specified
    const gridX = targetGridX ?? Math.floor(roomData.gridColumns / 2) - 1;
    const gridY = targetGridY ?? Math.floor(roomData.gridRows / 2) - 1;

    const newPlacedItem: PlacedRoomItem = {
      id: `placed_${itemId}_${Date.now()}`,
      itemId,
      gridX,
      gridY,
      rotation: 0,
      zIndex: gridY, // depth sorting by Y
      scale: 1
    };

    setRoomData(prev => ({
      ...prev,
      placedItems: [...prev.placedItems, newPlacedItem]
    }));
    setSelectedPlacedItem(newPlacedItem);
  }, [roomData.gridColumns, roomData.gridRows]);

  // Move placed item to new logical grid coordinates
  const movePlacedItem = useCallback((instanceId: string, newGridX: number, newGridY: number) => {
    const clampedX = Math.max(0, Math.min(roomData.gridColumns - 1, newGridX));
    const clampedY = Math.max(0, Math.min(roomData.gridRows - 1, newGridY));

    setRoomData(prev => ({
      ...prev,
      placedItems: prev.placedItems.map(item => {
        if (item.id === instanceId) {
          const updated = {
            ...item,
            gridX: clampedX,
            gridY: clampedY,
            zIndex: clampedY // depth sorting by Y
          };
          if (selectedPlacedItem?.id === instanceId) {
            setSelectedPlacedItem(updated);
          }
          return updated;
        }
        return item;
      })
    }));
  }, [roomData.gridColumns, roomData.gridRows, selectedPlacedItem?.id]);

  // Rotate item if allowed
  const rotatePlacedItem = useCallback((instanceId: string) => {
    setRoomData(prev => ({
      ...prev,
      placedItems: prev.placedItems.map(item => {
        if (item.id === instanceId) {
          const catalogItem = getCatalogItemById(item.itemId);
          if (!catalogItem?.allowRotation) return item;
          const nextRotation = (item.rotation + 90) % 360;
          const updated = { ...item, rotation: nextRotation };
          if (selectedPlacedItem?.id === instanceId) {
            setSelectedPlacedItem(updated);
          }
          return updated;
        }
        return item;
      })
    }));
  }, [selectedPlacedItem?.id]);

  // Remove item from room without locking it in inventory
  const removePlacedItem = useCallback((instanceId: string) => {
    setRoomData(prev => ({
      ...prev,
      placedItems: prev.placedItems.filter(item => item.id !== instanceId)
    }));
    if (selectedPlacedItem?.id === instanceId) {
      setSelectedPlacedItem(null);
    }
  }, [selectedPlacedItem?.id]);

  // Save room data to persistence (Firestore & LocalStorage)
  const saveRoom = useCallback(async () => {
    setIsSaving(true);
    try {
      await RoomRepository.saveRoomData(userId, roomData);
    } catch (e) {
      console.error("RoomContext: Save failed", e);
    } finally {
      setIsSaving(false);
    }
  }, [userId, roomData]);

  // Automatically save room data whenever placedItems or unlockedItemIds change
  useEffect(() => {
    const timer = setTimeout(() => {
      RoomRepository.saveRoomData(userId, roomData);
    }, 1000);
    return () => clearTimeout(timer);
  }, [userId, roomData]);

  // Decoupled unlock evaluation
  const evaluateArticleUnlock = useCallback(async (articleSlug: string) => {
    const { roomData: updatedRoom } = await RewardService.evaluateUnlocks(userId, {
      type: 'article_completed',
      targetId: articleSlug
    });
    setRoomData(updatedRoom);
  }, [userId]);

  return (
    <RoomContext.Provider
      value={{
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
        evaluateArticleUnlock,
        isSaving
      }}
    >
      {children}
    </RoomContext.Provider>
  );
}

export function useRoom() {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error('useRoom must be used within a RoomProvider');
  }
  return context;
}
