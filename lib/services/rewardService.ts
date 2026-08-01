import { ROOM_ITEM_CATALOG } from "@/data/roomCatalog";
import { RoomRepository } from "@/lib/repositories/roomRepository";
import type { UserRoomData, RoomItemCatalogEntry } from "@/types/room";

export interface UnlockEvent {
  type: 'article_completed' | 'level_reached' | 'discipline_mastered' | 'streak_reached' | 'layer_completed';
  targetId: string;
  userLevel?: number;
  streakCount?: number;
  layer?: string;
}

export class RewardService {
  /**
   * Evaluates unlock conditions for all items in the catalog against an event.
   * Returns an array of newly unlocked catalog items.
   */
  static async evaluateUnlocks(
    userId: string, 
    event: UnlockEvent
  ): Promise<{ roomData: UserRoomData; newlyUnlocked: RoomItemCatalogEntry[] }> {
    let currentRoom = await RoomRepository.getRoomData(userId);
    const newlyUnlocked: RoomItemCatalogEntry[] = [];

    for (const item of ROOM_ITEM_CATALOG) {
      // Skip if item is already unlocked
      if (currentRoom.unlockedItemIds.includes(item.id)) continue;

      const cond = item.unlockCondition;
      let shouldUnlock = false;

      if (cond.type === 'article_completed' && event.type === 'article_completed') {
        if (event.targetId && (event.targetId.endsWith(cond.targetId) || cond.targetId.endsWith(event.targetId))) {
          shouldUnlock = true;
        }
      } else if (cond.type === 'layer_completed' && event.type === 'layer_completed') {
        // Only unlock when BOTH the article and the specific layer match.
        const articleMatches = event.targetId && (event.targetId.endsWith(cond.targetId) || cond.targetId.endsWith(event.targetId));
        const layerMatches = !cond.layer || cond.layer === event.layer;
        if (articleMatches && layerMatches) {
          shouldUnlock = true;
        }
      } else if (cond.type === 'level_reached' && event.type === 'level_reached') {
        const requiredLevel = parseInt(cond.targetId.replace('level_', ''), 10);
        if (event.userLevel && event.userLevel >= requiredLevel) {
          shouldUnlock = true;
        }
      } else if (cond.type === 'streak_reached' && event.type === 'streak_reached') {
        const requiredStreak = parseInt(cond.targetId.replace('streak_', ''), 10);
        if (event.streakCount && event.streakCount >= requiredStreak) {
          shouldUnlock = true;
        }
      } else if (cond.type === 'default') {
        shouldUnlock = true;
      }

      if (shouldUnlock) {
        currentRoom = await RoomRepository.unlockItem(userId, item.id);
        newlyUnlocked.push(item);
      }
    }

    return { roomData: currentRoom, newlyUnlocked };
  }
}
