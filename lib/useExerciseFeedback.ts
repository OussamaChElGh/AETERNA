'use client';

import { useCallback, useRef, useState } from 'react';
import { useGamification } from '@/context/GamificationContext';

export function useExerciseFeedback() {
  const { fireFeedback } = useGamification();
  const ref = useRef<HTMLDivElement>(null);
  const [fx, setFx] = useState<'correct' | 'wrong' | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const trigger = useCallback((type: 'correct' | 'wrong', sourceId?: string, xp?: number) => {
    setFx(type);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setFx(null), 650);

    const rect = ref.current?.getBoundingClientRect();
    fireFeedback({
      type,
      sourceId,
      xp: type === 'correct' ? xp : undefined,
      x: rect ? rect.left + rect.width / 2 : undefined,
      y: rect ? rect.top + rect.height / 2 : undefined,
    });
  }, [fireFeedback]);

  const fxClass = fx === 'correct' ? 'animate-pop' : fx === 'wrong' ? 'animate-shake' : '';

  return { feedbackRef: ref, trigger, fxClass };
}
