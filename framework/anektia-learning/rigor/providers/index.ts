import { CorpusEntry } from '../types';
import { WikipediaProvider } from './wikipedia';
import { OpenStaxProvider } from './openstax';
import { ArxivProvider } from './arxiv';

function deduplicate(entries: CorpusEntry[]): CorpusEntry[] {
  const seen = new Set<string>();
  const result: CorpusEntry[] = [];

  for (const e of entries) {
    const key = e.laTeXNormalized
      ? `f:${e.laTeXNormalized}`
      : `t:${e.text.toLowerCase().slice(0, 80).replace(/\s+/g, ' ')}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(e);
  }

  return result.sort((a, b) => b.authorityScore - a.authorityScore);
}

export async function harvestAll(topic: string): Promise<CorpusEntry[]> {
  const wiki = new WikipediaProvider();

  const providers: { search: (t: string) => Promise<CorpusEntry[]>; name: string }[] = [
    { search: (t) => wiki.search(t, 'es'), name: 'Wikipedia ES' },
    { search: (t) => wiki.search(t, 'en'), name: 'Wikipedia EN' },
    { search: (t) => new OpenStaxProvider().search(t), name: 'OpenStax' },
    { search: (t) => new ArxivProvider().search(t), name: 'arXiv' },
  ];

  const promiseResults = await Promise.allSettled(
    providers.map(p => p.search(topic))
  );

  const allEntries = promiseResults.flatMap(r =>
    r.status === 'fulfilled' ? r.value : []
  );

  return deduplicate(allEntries);
}

export { WikipediaProvider, OpenStaxProvider, ArxivProvider };
