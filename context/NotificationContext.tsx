'use client';
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { collection, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "./AuthContext";
import {
  type NotificationData,
  type NotificationType,
  createNotification,
  markAsRead as markAsReadFn,
  markAllRead as markAllReadFn,
  deleteNotification as deleteNotificationFn,
} from "@/lib/notifications";

export type { NotificationData, NotificationType };

interface NotificationContextType {
  notifications: NotificationData[];
  unreadCount: number;
  isLoading: boolean;
  addNotification: (
    type: NotificationType,
    title: string,
    message: string,
    meta?: Record<string, any>
  ) => Promise<string | null>;
  markAsRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }

    setIsLoading(true);
    const colRef = collection(db, "aeternaNotifications", user.uid, "items");
    const q = query(colRef, orderBy("createdAt", "desc"), limit(50));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data: NotificationData[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as NotificationData[];
        setNotifications(data);
        setIsLoading(false);
      },
      (error) => {
        console.warn("NotificationContext: onSnapshot error", error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const addNotification = useCallback(
    async (
      type: NotificationType,
      title: string,
      message: string,
      meta?: Record<string, any>
    ) => {
      if (!user) return null;
      return createNotification(user.uid, type, title, message, meta);
    },
    [user]
  );

  const markAsRead = useCallback(
    async (id: string) => {
      if (!user) return;
      await markAsReadFn(user.uid, id);
    },
    [user]
  );

  const markAllRead = useCallback(async () => {
    if (!user) return;
    await markAllReadFn(user.uid);
  }, [user]);

  const deleteNotification = useCallback(
    async (id: string) => {
      if (!user) return;
      await deleteNotificationFn(user.uid, id);
    },
    [user]
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isLoading,
        addNotification,
        markAsRead,
        markAllRead,
        deleteNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within NotificationProvider");
  }
  return context;
}
