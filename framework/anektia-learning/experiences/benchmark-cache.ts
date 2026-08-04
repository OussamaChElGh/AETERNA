import { KnowledgeModel } from '../types';

const memoryCache = new Map<string, { model: KnowledgeModel; timestamp: number }>();

export function getCachedKnowledgeModel(topicSlug: string): KnowledgeModel | null {
  const cached = memoryCache.get(topicSlug.toLowerCase());
  if (!cached) return null;
  // Expire after 1 hour if needed
  if (Date.now() - cached.timestamp > 3600000) {
    memoryCache.delete(topicSlug.toLowerCase());
    return null;
  }
  return cached.model;
}

export function setCachedKnowledgeModel(topicSlug: string, model: KnowledgeModel): void {
  memoryCache.set(topicSlug.toLowerCase(), {
    model,
    timestamp: Date.now()
  });
}

export function clearBenchmarkCache(): void {
  memoryCache.clear();
}
