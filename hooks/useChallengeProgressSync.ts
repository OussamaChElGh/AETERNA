'use client';
import { useEffect, useRef } from 'react';
import { useGamification } from '@/context/GamificationContext';
import { useChallenges } from '@/context/ChallengeContext';
import { useAuth } from '@/context/AuthContext';

export function useChallengeProgressSync() {
  const { user } = useAuth();
  const { progress } = useGamification();
  const { challenges, updateProgress } = useChallenges();

  const prevXp = useRef(progress.xp || 0);
  const prevArticles = useRef(progress.completedPaths?.length || 0);
  const prevLevel = useRef(progress.level || 0);

  useEffect(() => {
    if (!user || challenges.length === 0) return;

    const xpChanged = progress.xp > prevXp.current;
    const articlesChanged = (progress.completedPaths?.length || 0) > prevArticles.current;
    const levelChanged = progress.level > prevLevel.current;

    if (!xpChanged && !articlesChanged && !levelChanged) return;

    for (const challenge of challenges) {
      if (challenge.status !== 'active' || !challenge.id) continue;
      if (challenge.creator !== user.uid && challenge.challenger !== user.uid) continue;

      if (challenge.type === 'xp_race' && xpChanged) {
        updateProgress(challenge.id, user.uid, progress.xp);
      } else if (challenge.type === 'articles_race' && articlesChanged) {
        updateProgress(challenge.id, user.uid, progress.completedPaths?.length || 0);
      } else if (challenge.type === 'level_race' && levelChanged) {
        updateProgress(challenge.id, user.uid, progress.level);
      }
    }

    prevXp.current = progress.xp || 0;
    prevArticles.current = progress.completedPaths?.length || 0;
    prevLevel.current = progress.level || 0;
  }, [progress.xp, progress.completedPaths?.length, progress.level, challenges, user]);
}
