import { GlossaryEntry } from '@/types';

export interface HighlightOptions {
  maxOccurrencesPerTerm?: number;
  minTermLength?: number;
}

/**
 * Builds a combined regex matching all glossary terms and synonyms,
 * longest terms first to avoid partial matches.
 */
export function buildGlossaryRegex(
  entries: GlossaryEntry[],
  minTermLength = 3
): RegExp {
  const allTerms: string[] = [];
  for (const e of entries) {
    const candidates = [e.term, ...(e.synonyms || [])];
    for (const c of candidates) {
      const clean = c.trim();
      if (clean.length >= minTermLength && !allTerms.includes(clean.toLowerCase())) {
        allTerms.push(clean.toLowerCase());
      }
    }
  }
  allTerms.sort((a, b) => b.length - a.length);

  const escaped = allTerms
    .map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .map(t => t.replace(/ /g, '\\s+'));

  if (escaped.length === 0) return /\b\b/;

  // Use lookarounds with full letter range (incl. accents) instead of \b,
  // because \b only recognizes ASCII word chars and breaks accented terms
  // like "entropía", "presión".
  const letter = '[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]';
  return new RegExp(`(?<!${letter})(?:${escaped.join('|')})(?!${letter})`, 'gi');
}

/**
 * Finds all glossary matches in a text, returning their start/end offsets
 * and which entry they map to. Handles overlapping (longest wins).
 */
export function findGlossaryMatches(
  text: string,
  entries: GlossaryEntry[],
  options: HighlightOptions = {}
): { start: number; end: number; entry: GlossaryEntry }[] {
  const { maxOccurrencesPerTerm = 5 } = options;
  const regex = buildGlossaryRegex(entries);
  const matches: { start: number; end: number; entry: GlossaryEntry }[] = [];
  const termCount: Record<string, number> = {};

  let m: RegExpExecArray | null;
  while ((m = regex.exec(text)) !== null) {
    const matched = m[0].toLowerCase();
    const matchedRaw = m[0];
    // Find the entry that owns this matched term
    const entry = entries.find(e => {
      const candidates = [e.term.toLowerCase(), ...(e.synonyms || []).map((s: string) => s.toLowerCase())];
      return candidates.includes(matched) || candidates.some(c => {
        const cNorm = c.replace(/ /g, '\\s+');
        return new RegExp(`^${cNorm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i').test(matchedRaw);
      });
    });
    if (!entry) continue;

    termCount[entry.term.toLowerCase()] = (termCount[entry.term.toLowerCase()] || 0) + 1;
    if (termCount[entry.term.toLowerCase()] > maxOccurrencesPerTerm) continue;

    matches.push({ start: m.index, end: m.index + m[0].length, entry });
  }

  // Remove overlapping matches keeping the longest
  const sorted = [...matches].sort((a, b) => b.end - b.start);
  const result: { start: number; end: number; entry: GlossaryEntry }[] = [];
  for (const match of sorted) {
    const overlap = result.some(r => match.start < r.end && match.end > r.start);
    if (!overlap) result.push(match);
  }
  return result.sort((a, b) => a.start - b.start);
}

export const GLOSSARY_PLACEHOLDER_PREFIX = '§§GLOSSARY§§';
