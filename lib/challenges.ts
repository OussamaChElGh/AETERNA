import {
  collection,
  doc,
  getDoc,
  addDoc,
  setDoc,
  updateDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
  type Timestamp,
  arrayUnion,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export type ChallengeType = "xp_race" | "articles_race" | "level_race";

export interface Challenge {
  id?: string;
  creator: string;
  challenger: string;
  type: ChallengeType;
  target: number;
  creatorProgress: number;
  challengerProgress: number;
  status: "pending" | "active" | "completed";
  winner: string | null;
  createdAt: Timestamp | null;
  resolvedAt: Timestamp | null;
}

const CHALLENGES_COL = "aeternaChallenges";

export async function createChallenge(
  creator: string,
  challenger: string,
  type: ChallengeType,
  target: number
): Promise<string | null> {
  try {
    const ref = await addDoc(collection(db, CHALLENGES_COL), {
      creator,
      challenger,
      type,
      target,
      creatorProgress: 0,
      challengerProgress: 0,
      status: "pending",
      winner: null,
      createdAt: serverTimestamp(),
      resolvedAt: null,
    });
    // Also add both users to a participants subcollection for querying
    await setDoc(doc(db, `${CHALLENGES_COL}/${ref.id}/participants`, creator), { uid: creator });
    await setDoc(doc(db, `${CHALLENGES_COL}/${ref.id}/participants`, challenger), { uid: challenger });
    return ref.id;
  } catch (e) {
    console.warn("createChallenge: error", e);
    return null;
  }
}

export async function acceptChallenge(challengeId: string) {
  try {
    await updateDoc(doc(db, CHALLENGES_COL, challengeId), { status: "active" });
  } catch (e) {
    console.warn("acceptChallenge: error", e);
  }
}

export async function updateChallengeProgress(
  challengeId: string,
  userId: string,
  progress: number
) {
  try {
    const ref = doc(db, CHALLENGES_COL, challengeId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return;
    const data = snap.data() as Challenge;
    if (data.status !== "active") return;

    const isCreator = data.creator === userId;
    const field = isCreator ? "creatorProgress" : "challengerProgress";
    const current = isCreator ? data.creatorProgress : data.challengerProgress;
    const otherProgress = isCreator ? data.challengerProgress : data.creatorProgress;

    const newProgress = Math.max(current, progress);
    const updates: Record<string, any> = { [field]: newProgress };

    // Check if challenge is completed
    if (newProgress >= data.target) {
      updates.winner = userId;
      updates.status = "completed";
      updates.resolvedAt = serverTimestamp();
    } else if (otherProgress >= data.target) {
      // Other player won
      updates.status = "completed";
      updates.resolvedAt = serverTimestamp();
    }

    await updateDoc(ref, updates);
  } catch (e) {
    console.warn("updateChallengeProgress: error", e);
  }
}

export async function getActiveChallenges(userId: string): Promise<Challenge[]> {
  try {
    // Query challenges where user is creator or challenger
    const [asCreator, asChallenger] = await Promise.all([
      getDocs(query(collection(db, CHALLENGES_COL),
        where("creator", "==", userId), where("status", "in", ["pending", "active"]))),
      getDocs(query(collection(db, CHALLENGES_COL),
        where("challenger", "==", userId), where("status", "in", ["pending", "active"]))),
    ]);

    const results: Challenge[] = [];
    asCreator.forEach((d) => results.push({ id: d.id, ...d.data() } as Challenge));
    asChallenger.forEach((d) => results.push({ id: d.id, ...d.data() } as Challenge));
    return results;
  } catch (e) {
    console.warn("getActiveChallenges: error", e);
    return [];
  }
}

export async function getChallenge(challengeId: string): Promise<Challenge | null> {
  try {
    const snap = await getDoc(doc(db, CHALLENGES_COL, challengeId));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as Challenge;
  } catch {
    return null;
  }
}

export const CHALLENGE_TYPES = {
  xp_race: { label: "Carrera de XP", emoji: "🏃", unit: "XP", description: "Quién consigue más XP" },
  articles_race: { label: "Carrera de artículos", emoji: "📚", unit: "artículos", description: "Quién completa más artículos" },
  level_race: { label: "Carrera de nivel", emoji: "⚡", unit: "nivel", description: "Quién alcanza el nivel X primero" },
};

export const CHALLENGE_TARGETS = [
  { value: 1000, label: "1.000 XP" },
  { value: 5000, label: "5.000 XP" },
  { value: 10000, label: "10.000 XP" },
  { value: 3, label: "3 artículos" },
  { value: 5, label: "5 artículos" },
  { value: 10, label: "10 artículos" },
  { value: 5, label: "Nivel 5" },
  { value: 10, label: "Nivel 10" },
  { value: 15, label: "Nivel 15" },
];
