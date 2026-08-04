import { SourceTier } from '../types';

export type EntryType = 'definition' | 'formula' | 'law' | 'misconception' | 'key_fact';

export interface CorpusEntry {
  id: string;
  type: EntryType;
  text: string;
  laTeX?: string;
  laTeXNormalized?: string;
  source: 'wikipedia' | 'openstax' | 'arxiv';
  sourceUrl: string;
  sourceTitle: string;
  tier: SourceTier;
  authorityScore: number;
  relevanceScore: number;
}

export interface SourceSummary {
  name: string;
  tier: SourceTier;
  url: string;
  entriesCount: number;
}

export interface Corpus {
  topic: string;
  harvestedAt: string;
  entries: CorpusEntry[];
  sources: SourceSummary[];
  totalEntries: number;
}

export interface RigorCorrection {
  severity: 'MUST_FIX' | 'SHOULD_FIX';
  articleExcerpt: string;
  expected: string;
  sourceUrl: string;
  sourceName: string;
}

export interface RigorReport {
  rigorScore: number;
  totalClaims: number;
  claimsMatched: number;
  coverageScore: number;
  precisionScore: number;
  contradictions: number;
  missingCoreClaims: { entry: CorpusEntry; reason: string }[];
  corrections: RigorCorrection[];
  summary: string;
}

export interface Provider {
  name: string;
  search(topic: string, lang?: string): Promise<CorpusEntry[]>;
}
