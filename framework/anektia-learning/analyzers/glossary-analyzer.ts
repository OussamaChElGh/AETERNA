import fs from 'fs';
import path from 'path';
import { GlossaryEntry } from '../types';
import { buildGlossaryRegex } from '../../../components/article-page/utils/conceptHighlighter';

const GLOSSARY_DIR = path.join(process.cwd(), 'data', 'glossary');

export interface GlossaryCoverageResult {
  totalTerms: number;
  termsCovered: number;
  coverageScore: number; // 0..100
  glossaryHasTerms: boolean;
  termsFound: string[];
  termsMissing: string[];
  recommendedTerms: GlossaryEntry[];
}

function loadGlossary(branchId: string = 'fisica'): GlossaryEntry[] {
  const file = path.join(GLOSSARY_DIR, `${branchId}.json`);
  if (!fs.existsSync(file)) return [];
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8')) as GlossaryEntry[];
  } catch {
    return [];
  }
}

/**
 * Audits whether the article body uses terms from the branch glossary.
 * A high score means the article naturally enables the glossary hover feature.
 */
export function analyzeGlossaryCoverage(
  rawBody: string,
  branchId: string = 'fisica'
): GlossaryCoverageResult {
  const glossary = loadGlossary(branchId);
  if (glossary.length === 0) {
    return {
      totalTerms: 0,
      termsCovered: 0,
      coverageScore: 0,
      glossaryHasTerms: false,
      termsFound: [],
      termsMissing: [],
      recommendedTerms: [],
    };
  }

  const regex = buildGlossaryRegex(glossary, 5);
  regex.lastIndex = 0;

  const termsFound: string[] = [];
  const termsMissing: string[] = [];
  const recommendedTerms: GlossaryEntry[] = [];

  let m: RegExpExecArray | null;
  const foundSet = new Set<string>();
  while ((m = regex.exec(rawBody)) !== null) {
    const matched = m[0].toLowerCase();
    const entry = glossary.find(e => {
      const candidates = [e.term.toLowerCase(), ...(e.synonyms || []).map((s: string) => s.toLowerCase())];
      return candidates.includes(matched);
    });
    if (entry && !foundSet.has(entry.term.toLowerCase())) {
      foundSet.add(entry.term.toLowerCase());
      termsFound.push(entry.term);
    }
  }

  const foundLower = new Set(termsFound.map(t => t.toLowerCase()));
  for (const entry of glossary) {
    const key = entry.term.toLowerCase();
    if (!foundLower.has(key)) {
      termsMissing.push(entry.term);
      if (entry.nivel === 'avanzado' || entry.nivel === 'intermedio') {
        recommendedTerms.push(entry);
      }
    }
  }

  const coverageScore = Math.round((termsFound.length / glossary.length) * 100);

  return {
    totalTerms: glossary.length,
    termsCovered: termsFound.length,
    coverageScore,
    glossaryHasTerms: true,
    termsFound,
    termsMissing,
    recommendedTerms,
  };
}
