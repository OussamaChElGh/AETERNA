'use client';
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "./AuthContext";
import { follow as followFn, unfollow as unfollowFn } from "@/lib/follows";

interface FollowContextType {
  following: string[];
  isFollowing: (uid: string) => boolean;
  follow: (uid: string) => Promise<void>;
  unfollow: (uid: string) => Promise<void>;
}

const FollowContext = createContext<FollowContextType | undefined>(undefined);

export function FollowProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [following, setFollowing] = useState<string[]>([]);

  useEffect(() => {
    if (!user) {
      setFollowing([]);
      return;
    }
    const ref = doc(db, "aeternaFriends", user.uid);
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        setFollowing(snap.data().following || []);
      } else {
        setFollowing([]);
      }
    }, (err) => {
      console.warn("FollowContext: onSnapshot error", err);
    });
    return () => unsub();
  }, [user]);

  const follow = useCallback(async (uid: string) => {
    if (!user || uid === user.uid) return;
    setFollowing((prev) => prev.includes(uid) ? prev : [...prev, uid]);
    await followFn(user.uid, uid);
  }, [user]);

  const unfollow = useCallback(async (uid: string) => {
    if (!user) return;
    setFollowing((prev) => prev.filter((id) => id !== uid));
    await unfollowFn(user.uid, uid);
  }, [user]);

  const isFollowing = useCallback((uid: string) => following.includes(uid), [following]);

  return (
    <FollowContext.Provider value={{ following, isFollowing, follow, unfollow }}>
      {children}
    </FollowContext.Provider>
  );
}

export function useFollow() {
  const ctx = useContext(FollowContext);
  if (!ctx) throw new Error("useFollow must be used within FollowProvider");
  return ctx;
}
