'use client';
import { useEffect, useRef } from 'react';
import { useGamification } from '@/context/GamificationContext';
import { useNotifications } from '@/context/NotificationContext';
import { useAuth } from '@/context/AuthContext';
import { deriveLevel } from '@/lib/leaderboard';

export function useNotificationTriggers() {
  const { user } = useAuth();
  const { progress } = useGamification();
  const { addNotification } = useNotifications();
  const prevLevelRef = useRef(progress.level);
  const prevRelicsRef = useRef<string[]>(progress.physicsRelics || []);
  const prevAchievementsRef = useRef<string[]>(progress.achievements || []);
  const prevWeeklyResetRef = useRef(progress.weeklyResetDate);

  useEffect(() => {
    if (!user) return;

    const prevLevel = prevLevelRef.current;
    const currentLevel = progress.level;

    if (currentLevel > prevLevel) {
      addNotification(
        'level_up',
        '¡Nivel Ascendido!',
        `Has alcanzado el Nivel ${currentLevel}. Tu sabiduría crece.`
      );
    }

    prevLevelRef.current = currentLevel;
  }, [user, progress.level, addNotification]);

  useEffect(() => {
    if (!user) return;

    const prevRelics = prevRelicsRef.current;
    const currentRelics = progress.physicsRelics || [];

    if (currentRelics.length > prevRelics.length) {
      const newRelics = currentRelics.filter(r => !prevRelics.includes(r));
      newRelics.forEach(relicId => {
        const relicNames: Record<string, string> = {
          'relic_fundamentos_cosmos': 'Reliquia de los Fundamentos del Cosmos',
          'relic_profundizacion_mecanica': 'Reliquia de la Profundización Mecánica',
          'relic_fisica_moderna': 'Reliquia de la Física Moderna',
          'relic_fronteras_cosmos': 'Reliquia de las Fronteras del Cosmos',
        };
        const name = relicNames[relicId] || 'Reliquia Misteriosa';
        addNotification(
          'relic_unlocked',
          '¡Reliquia Desbloqueada!',
          `Has obtenido la ${name}.`
        );
      });
    }

    prevRelicsRef.current = currentRelics;
  }, [user, progress.physicsRelics, addNotification]);

  useEffect(() => {
    if (!user) return;

    const prevAchievements = prevAchievementsRef.current;
    const currentAchievements = progress.achievements || [];

    if (currentAchievements.length > prevAchievements.length) {
      const newAchievements = currentAchievements.filter(a => !prevAchievements.includes(a));
      newAchievements.forEach(achievementId => {
        addNotification(
          'achievement',
          '¡Logro Desbloqueado!',
          `Has desbloqueado un nuevo logro: ${achievementId.replace(/_/g, ' ')}.`
        );
      });
    }

    prevAchievementsRef.current = currentAchievements;
  }, [user, progress.achievements, addNotification]);

  useEffect(() => {
    if (!user) return;

    const prevReset = prevWeeklyResetRef.current;
    const currentReset = progress.weeklyResetDate;

    if (currentReset && currentReset !== prevReset && prevReset) {
      addNotification(
        'weekly_reset',
        'Nueva Semana',
        'El ranking semanal se ha reiniciado. ¡Compite por el trono!'
      );
    }

    prevWeeklyResetRef.current = currentReset;
  }, [user, progress.weeklyResetDate, addNotification]);
}
