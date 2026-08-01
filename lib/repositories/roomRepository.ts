import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import type { UserRoomData, PlacedRoomItem } from "@/types/room";
import { ROOM_ITEM_CATALOG } from "@/data/roomCatalog";

const DEFAULT_GRID_COLUMNS = 20;
const DEFAULT_GRID_ROWS = 15;

export const DEFAULT_ROOM_DATA: UserRoomData = {
  id: "main_room",
  userId: "local_user",
  theme: "parchment_classical",
  gridColumns: DEFAULT_GRID_COLUMNS,
  gridRows: DEFAULT_GRID_ROWS,
  unlockedItemIds: [
    "math_abacus",
    "general_bookshelf",
    "physics_telescope"
  ],
  placedItems: [
    {
      id: "placed_general_bookshelf_default",
      itemId: "general_bookshelf",
      gridX: 15,
      gridY: 3,
      rotation: 0,
      zIndex: 3,
      scale: 1
    },
    {
      id: "placed_physics_telescope_default",
      itemId: "physics_telescope",
      gridX: 4,
      gridY: 5,
      rotation: 0,
      zIndex: 5,
      scale: 1
    }
  ],
  updatedAt: new Date().toISOString()
};

function getLocalStorageKey(userId: string): string {
  return `aeterna_knowledge_room_${userId || "anonymous"}`;
}

export class RoomRepository {
  /**
   * Fetches room data for a given user from Firestore or LocalStorage fallback
   */
  static async getRoomData(userId: string): Promise<UserRoomData> {
    const defaultData: UserRoomData = {
      ...DEFAULT_ROOM_DATA,
      userId: userId || "anonymous"
    };

    // 1. Try Firebase Firestore if userId exists and db is available
    if (userId && userId !== "anonymous" && db) {
      try {
        const roomRef = doc(db, "users", userId, "knowledge_room", "main");
        const docSnap = await getDoc(roomRef);
        if (docSnap.exists()) {
          const remoteData = docSnap.data() as UserRoomData;
          return {
            ...defaultData,
            ...remoteData,
            userId,
            unlockedItemIds: Array.from(new Set([...defaultData.unlockedItemIds, ...(remoteData.unlockedItemIds || [])]))
          };
        }
      } catch (error) {
        console.warn("RoomRepository: Error loading from Firestore, falling back to LocalStorage:", error);
      }
    }

    // 2. Fallback to LocalStorage
    try {
      const storageKey = getLocalStorageKey(userId);
      const localStr = localStorage.getItem(storageKey);
      if (localStr) {
        const parsed = JSON.parse(localStr) as UserRoomData;
        return {
          ...defaultData,
          ...parsed,
          userId: userId || "anonymous",
          unlockedItemIds: Array.from(new Set([...defaultData.unlockedItemIds, ...(parsed.unlockedItemIds || [])]))
        };
      }
    } catch (e) {
      console.warn("RoomRepository: Error parsing LocalStorage:", e);
    }

    return defaultData;
  }

  /**
   * Persists room data to Firestore and LocalStorage
   */
  static async saveRoomData(userId: string, roomData: UserRoomData): Promise<void> {
    const updatedRoom: UserRoomData = {
      ...roomData,
      userId: userId || "anonymous",
      updatedAt: new Date().toISOString()
    };

    // 1. Always save to LocalStorage for instant UI response and offline safety
    try {
      const storageKey = getLocalStorageKey(userId);
      localStorage.setItem(storageKey, JSON.stringify(updatedRoom));
    } catch (e) {
      console.warn("RoomRepository: Failed to save to LocalStorage:", e);
    }

    // 2. Sync to Firebase Firestore if logged in
    if (userId && userId !== "anonymous" && db) {
      try {
        const roomRef = doc(db, "users", userId, "knowledge_room", "main");
        await setDoc(roomRef, updatedRoom, { merge: true });
      } catch (error) {
        console.warn("RoomRepository: Failed to sync to Firestore:", error);
      }
    }
  }

  /**
   * Unlocks an item for a user without coupling to the room placement
   */
  static async unlockItem(userId: string, itemId: string): Promise<UserRoomData> {
    const currentRoom = await this.getRoomData(userId);
    if (!currentRoom.unlockedItemIds.includes(itemId)) {
      const updatedRoom: UserRoomData = {
        ...currentRoom,
        unlockedItemIds: [...currentRoom.unlockedItemIds, itemId]
      };
      await this.saveRoomData(userId, updatedRoom);
      return updatedRoom;
    }
    return currentRoom;
  }
}
