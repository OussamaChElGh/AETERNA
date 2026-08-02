import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function getFollowing(userId: string): Promise<string[]> {
  try {
    const ref = doc(db, "aeternaFriends", userId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return [];
    return snap.data().following || [];
  } catch {
    return [];
  }
}

export async function follow(userId: string, targetUid: string) {
  try {
    const ref = doc(db, "aeternaFriends", userId);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const current = snap.data().following || [];
      if (current.includes(targetUid)) return;
      await updateDoc(ref, {
        following: [...current, targetUid],
        updatedAt: serverTimestamp(),
      });
    } else {
      await setDoc(ref, {
        following: [targetUid],
        updatedAt: serverTimestamp(),
      });
    }
  } catch (e) {
    console.warn("follow: error", e);
  }
}

export async function unfollow(userId: string, targetUid: string) {
  try {
    const ref = doc(db, "aeternaFriends", userId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return;
    const current: string[] = snap.data().following || [];
    await updateDoc(ref, {
      following: current.filter((uid) => uid !== targetUid),
      updatedAt: serverTimestamp(),
    });
  } catch (e) {
    console.warn("unfollow: error", e);
  }
}

export async function isFollowing(userId: string, targetUid: string): Promise<boolean> {
  try {
    const ref = doc(db, "aeternaFriends", userId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return false;
    return (snap.data().following || []).includes(targetUid);
  } catch {
    return false;
  }
}
