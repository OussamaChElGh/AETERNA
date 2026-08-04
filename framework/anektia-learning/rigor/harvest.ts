import fs from 'fs';
import path from 'path';
import { Corpus, CorpusEntry, SourceSummary } from './types';
import { harvestAll } from './providers/index';

const RIGOR_DIR = path.join(process.cwd(), 'data', 'rigor');

function getSourceSummary(entries: CorpusEntry[]): SourceSummary[] {
  const map = new Map<string, { count: number; url: string; tier: CorpusEntry['tier'] }>();
  for (const e of entries) {
    const existing = map.get(e.source);
    if (existing) {
      existing.count++;
    } else {
      map.set(e.source, { count: 1, url: e.sourceUrl, tier: e.tier });
    }
  }
  return Array.from(map.entries()).map(([name, data]) => ({
    name: name === 'wikipedia' ? 'Wikipedia' : name === 'openstax' ? 'OpenStax' : 'arXiv',
    tier: data.tier,
    url: data.url,
    entriesCount: data.count,
  }));
}

export async function harvest(
  topic: string,
  discipline: string,
  options: { saveToFile?: boolean; slug?: string } = {}
): Promise<Corpus> {
  const { saveToFile = true, slug: fileSlug } = options;
  const derivedSlug = fileSlug || topic.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');

  if (!fs.existsSync(RIGOR_DIR)) {
    fs.mkdirSync(RIGOR_DIR, { recursive: true });
  }

  const entries = await harvestAll(topic);
  const sources = getSourceSummary(entries);

  const corpus: Corpus = {
    topic,
    harvestedAt: new Date().toISOString(),
    entries,
    sources,
    totalEntries: entries.length,
  };

  if (saveToFile) {
    const filePath = path.join(RIGOR_DIR, `${derivedSlug}.corpus.json`);
    fs.writeFileSync(filePath, JSON.stringify(corpus, null, 2), 'utf8');
    console.log(`[Rigor] Corpus guardado: ${filePath}`);
  }

  return corpus;
}

export function loadCorpus(slug: string): Corpus | null {
  const filePath = path.join(RIGOR_DIR, `${slug}.corpus.json`);
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8')) as Corpus;
  } catch {
    return null;
  }
}

export function loadCorpusOffline(slug: string, topic: string): Corpus | null {
  const filePath = path.join(RIGOR_DIR, `${slug}.corpus.json`);
  if (fs.existsSync(filePath)) {
    try {
      const stat = fs.statSync(filePath);
      const ageHours = (Date.now() - stat.mtimeMs) / 3600000;
      if (ageHours < 24) {
        return JSON.parse(fs.readFileSync(filePath, 'utf8')) as Corpus;
      }
    } catch {}
  }
  return null;
}
