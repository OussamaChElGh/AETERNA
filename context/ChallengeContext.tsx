'use client';
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { collection, query, where, onSnapshot, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "./AuthContext";
import {
  getActiveChallenges, createChallenge as createChallengeFn,
  acceptChallenge, updateChallengeProgress,
  type Challenge, type ChallengeType, CHALLENGE_TYPES,
} from "@/lib/challenges";

interface ChallengeContextType {
  challenges: Challenge[];
  isLoading: boolean;
  createChallenge: (challenger: string, type: ChallengeType, target: number) => Promise<string | null>;
  acceptChallenge: (id: string) => Promise<void>;
  updateProgress: (id: string, userId: string, progress: number) => Promise<void>;
}

const ChallengeContext = createContext<ChallengeContextType | undefined>(undefined);

export function ChallengeProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) { setChallenges([]); return; }
    setIsLoading(true);

    // Listen for challenges where user is creator or challenger
    const colRef = collection(db, "aeternaChallenges");
    const q1 = query(colRef, where("creator", "==", user.uid), where("status", "in", ["pending", "active"]));
    const q2 = query(colRef, where("challenger", "==", user.uid), where("status", "in", ["pending", "active"]));

    let combined: Challenge[] = [];
    const unsub1 = onSnapshot(q1, (snap) => {
      combined = combined.filter(c => c.creator !== user.uid);
      snap.forEach(d => combined.push({ id: d.id, ...d.data() } as Challenge));
      setChallenges([...combined]);
      setIsLoading(false);
    }, () => setIsLoading(false));

    const unsub2 = onSnapshot(q2, (snap) => {
      combined = combined.filter(c => c.challenger !== user.uid);
      snap.forEach(d => combined.push({ id: d.id, ...d.data() } as Challenge));
      setChallenges([...combined]);
      setIsLoading(false);
    }, () => setIsLoading(false));

    return () => { unsub1(); unsub2(); };
  }, [user]);

  const createChallenge = useCallback(async (challenger: string, type: ChallengeType, target: number) => {
    if (!user) return null;
    const id = await createChallengeFn(user.uid, challenger, type, target);
    return id;
  }, [user]);

  const accept = useCallback(async (id: string) => {
    await acceptChallenge(id);
  }, []);

  const updateProgress = useCallback(async (id: string, userId: string, progress: number) => {
    await updateChallengeProgress(id, userId, progress);
  }, []);

  return (
    <ChallengeContext.Provider value={{ challenges, isLoading, createChallenge, acceptChallenge: accept, updateProgress }}>
      {children}
    </ChallengeContext.Provider>
  );
}

export function useChallenges() {
  const ctx = useContext(ChallengeContext);
  if (!ctx) throw new Error("useChallenges must be used within ChallengeProvider");
  return ctx;
}
