export interface StudyProgress {
  completedPaths: string[];
  completedLayers?: Record<string, string[]>;
  articleProgress?: Record<string, number>;
  extraFurniture?: string[];
}

export const STUDY_LAYERS = ['principiante', 'intermedio', 'avanzado'] as const;

export function studySlug(path: string) {
  return path.split('/').pop()!.replace(/^article_read_/, '');
}

export function getStudyStatus(progress: StudyProgress, slug: string) {
  const layers = STUDY_LAYERS.filter(layer => progress.completedLayers?.[slug]?.includes(layer));
  const reading = progress.articleProgress?.[slug] || 0;
  const completed = progress.completedPaths.some(path => studySlug(path) === slug) ||
    layers.length === STUDY_LAYERS.length;
  return {
    layers,
    completed,
    percent: completed ? 100 : Math.max(reading, Math.round(100 * layers.length / STUDY_LAYERS.length)),
  };
}

export interface StudyActivity {
  slug: string;
  layer?: string;
  at: number;
}

export function recordStudyActivity(
  activity: StudyActivity[] | undefined, event: Omit<StudyActivity, 'at'>, at: number
) {
  return [{ ...event, at }, ...(activity || []).filter(
    entry => entry.slug !== event.slug || entry.layer !== event.layer
  )].slice(0, 60);
}
