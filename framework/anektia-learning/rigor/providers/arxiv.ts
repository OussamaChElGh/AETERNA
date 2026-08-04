import { CorpusEntry } from '../types';

const ARXIV_API = 'https://export.arxiv.org/api/query';
const DELAY_MS = 500;

function normalizeLaTeX(raw: string): string {
  return raw
    .replace(/\$\$/g, '')
    .replace(/\$/g, '')
    .replace(/\\left\|/g, '')
    .replace(/\\right\|/g, '')
    .replace(/\\left\(/g, '(')
    .replace(/\\right\)/g, ')')
    .replace(/\\left\[/g, '[')
    .replace(/\\right\]/g, ']')
    .replace(/\\displaystyle/g, '')
    .replace(/\\,/g, '')
    .replace(/\\;/g, '')
    .replace(/\\!/g, '')
    .replace(/\\qquad/g, '')
    .replace(/\\quad/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractFormulasFromText(text: string): string[] {
  const formulas: string[] = [];
  const inlineMath = text.match(/\$[^$]+\$/g) || [];
  const displayMath = text.match(/\$\$[\s\S]*?\$\$/g) || [];
  for (const m of [...inlineMath, ...displayMath]) {
    const clean = m.replace(/\$\$/g, '').replace(/\$/g, '').trim();
    if (clean.length > 3 && clean.includes('=')) {
      formulas.push(clean);
    }
  }
  return [...new Set(formulas)];
}

function extractKeySentences(text: string): string[] {
  const sentences = text.split(/(?<=[.!?])\s+/);
  return sentences
    .filter(s => {
      const lower = s.toLowerCase();
      return (
        lower.includes(' show ') ||
        lower.includes(' find ') ||
        lower.includes(' derive ') ||
        lower.includes(' demonstrate ') ||
        lower.includes(' propose ') ||
        lower.includes(' we present ') ||
        lower.includes(' result ') ||
        lower.includes(' equation ')
      );
    })
    .map(s => s.trim().slice(0, 400))
    .slice(0, 4);
}

function parseAtomXML(xml: string): { id: string; title: string; summary: string; url: string }[] {
  const entries: { id: string; title: string; summary: string; url: string }[] = [];
  const entryMatches = xml.match(/<entry>[\s\S]*?<\/entry>/g) || [];
  for (const entryXml of entryMatches) {
    const idMatch = entryXml.match(/<id>([^<]+)<\/id>/);
    const titleMatch = entryXml.match(/<title[^>]*>([^<]+)<\/title>/);
    const summaryMatch = entryXml.match(/<summary[^>]*>([^<]+)<\/summary>/);
    const urlMatch = entryXml.match(/<link[^>]*href="([^"]*)"[^>]*rel="alternate"[^>]*\/?>/)
      || entryXml.match(/<link[^>]*rel="alternate"[^>]*href="([^"]*)"[^>]*\/?>/);
    if (titleMatch && summaryMatch) {
      entries.push({
        id: idMatch?.[1]?.split('/').pop() || 'unknown',
        title: titleMatch[1].replace(/\n/g, ' ').trim(),
        summary: summaryMatch[1].replace(/\n/g, ' ').trim(),
        url: urlMatch?.[1] || idMatch?.[1] || '',
      });
    }
  }
  return entries;
}

export class ArxivProvider {
  name = 'arXiv';

  async search(topic: string): Promise<CorpusEntry[]> {
    const entries: CorpusEntry[] = [];
    let counter = 0;

    try {
      const query = encodeURIComponent(`all:${topic}`);
      const url = `${ARXIV_API}?search_query=${query}&max_results=5&start=0`;
      const res = await fetch(url, {
        headers: { 'User-Agent': 'AnektiaLearning/1.0 (rigor; contact@anektia.dev)' }
      });
      if (!res.ok) throw new Error(`arXiv API ${res.status}`);
      const xml = await res.text();
      await new Promise(resolve => setTimeout(resolve, DELAY_MS));

      const parsed = parseAtomXML(xml);

      for (const entry of parsed) {
        const formulas = extractFormulasFromText(entry.summary);
        for (const latex of formulas) {
          entries.push({
            id: `arx-${entry.id}-f${counter++}`,
            type: 'formula',
            text: latex,
            laTeX: `$$${latex}$$`,
            laTeXNormalized: normalizeLaTeX(latex),
            source: 'arxiv',
            sourceUrl: entry.url,
            sourceTitle: entry.title.slice(0, 120),
            tier: 'TIER_1_ACADEMIC',
            authorityScore: 95,
            relevanceScore: 75,
          });
        }

        const sentences = extractKeySentences(entry.summary);
        for (const s of sentences) {
          entries.push({
            id: `arx-${entry.id}-k${counter++}`,
            type: 'key_fact',
            text: s,
            source: 'arxiv',
            sourceUrl: entry.url,
            sourceTitle: entry.title.slice(0, 120),
            tier: 'TIER_1_ACADEMIC',
            authorityScore: 95,
            relevanceScore: 75,
          });
        }
      }
    } catch (e: any) {
      console.error(`[ArxivProvider] Error: ${e.message}`);
    }

    return entries;
  }
}
