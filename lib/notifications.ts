import {
  collection,
  doc,
  getDoc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  where,
  getDocs,
  writeBatch,
  serverTimestamp,
  type Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export type NotificationType =
  | "level_up"
  | "rank_up"
  | "overtaken"
  | "weekly_reset"
  | "relic_unlocked"
  | "top10"
  | "achievement"
  | "streak"
  | "xp"
  | "warning";

export interface NotificationData {
  id?: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: Timestamp | null;
  meta?: Record<string, any>;
}

const MAX_NOTIFICATIONS = 50;

function notificationsCol(userId: string) {
  return collection(db, "aeternaNotifications", userId, "items");
}

export async function createNotification(
  userId: string,
  type: NotificationType,
  title: string,
  message: string,
  meta?: Record<string, any>
): Promise<string | null> {
  try {
    const ref = await addDoc(notificationsCol(userId), {
      type,
      title,
      message,
      read: false,
      createdAt: serverTimestamp(),
      meta: meta || {},
    });
    await pruneOldNotifications(userId);
    return ref.id;
  } catch (e) {
    console.warn("createNotification: error", e);
    return null;
  }
}

async function pruneOldNotifications(userId: string) {
  try {
    const snap = await getDocs(
      query(notificationsCol(userId), orderBy("createdAt", "desc"), limit(MAX_NOTIFICATIONS + 20))
    );
    if (snap.size <= MAX_NOTIFICATIONS) return;
    const toDelete = snap.docs.slice(MAX_NOTIFICATIONS);
    const batch = writeBatch(db);
    toDelete.forEach((d) => batch.delete(d.ref));
    await batch.commit();
  } catch (e) {
    console.warn("pruneOldNotifications: error", e);
  }
}

export async function markAsRead(userId: string, notificationId: string) {
  try {
    await updateDoc(doc(notificationsCol(userId), notificationId), { read: true });
  } catch (e) {
    console.warn("markAsRead: error", e);
  }
}

export async function markAllRead(userId: string) {
  try {
    const snap = await getDocs(query(notificationsCol(userId), where("read", "==", false)));
    if (snap.empty) return;
    const batch = writeBatch(db);
    snap.docs.forEach((d) => batch.update(d.ref, { read: true }));
    await batch.commit();
  } catch (e) {
    console.warn("markAllRead: error", e);
  }
}

export async function getUnreadCount(userId: string): Promise<number> {
  try {
    const snap = await getDocs(query(notificationsCol(userId), where("read", "==", false)));
    return snap.size;
  } catch (e) {
    console.warn("getUnreadCount: error", e);
    return 0;
  }
}

export async function getNotifications(userId: string, max = 50): Promise<NotificationData[]> {
  try {
    const snap = await getDocs(
      query(notificationsCol(userId), orderBy("createdAt", "desc"), limit(max))
    );
    return snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as NotificationData[];
  } catch (e) {
    console.warn("getNotifications: error", e);
    return [];
  }
}

export async function deleteNotification(userId: string, notificationId: string) {
  try {
    await deleteDoc(doc(notificationsCol(userId), notificationId));
  } catch (e) {
    console.warn("deleteNotification: error", e);
  }
}
