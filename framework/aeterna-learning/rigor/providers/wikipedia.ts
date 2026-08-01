import { CorpusEntry } from '../types';

function wikiBase(lang: string): string {
  return `https://${lang}.wikipedia.org/w/api.php`;
}
const DELAY_MS = 200;

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function wikiFetch(lang: string, params: URLSearchParams): Promise<any> {
  const url = `${wikiBase(lang)}?${params.toString()}`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'AeternaLearning/1.0 (rigor; contact@aeterna.dev)' }
  });
  if (!res.ok) throw new Error(`Wikipedia API ${res.status}: ${res.statusText}`);
  return res.json();
}

function normalizeLaTeX(raw: string): string {
  let s = raw
    .replace(/\$\$/g, '')
    .replace(/\$/g, '')
    .replace(/\\displaystyle/g, '')
    .replace(/\{\\displaystyle\s*/g, '')
    .replace(/\\scriptstyle/g, '')
    .replace(/\\textstyle/g, '')
    .replace(/\\mathbf\s*/g, '')
    .replace(/\\mathrm\s*/g, '')
    .replace(/\\mathit\s*/g, '')
    .replace(/\\mathbb\s*/g, '')
    .replace(/\\vec\s*/g, '')
    .replace(/\\text\s*\{([^}]*)\}/g, '$1')
    .replace(/\\,/g, '')
    .replace(/\\;/g, '')
    .replace(/\\!/g, '')
    .replace(/\\qquad/g, '')
    .replace(/\\quad/g, '')
    .replace(/\\left\./g, '')
    .replace(/\\right\./g, '')
    .replace(/\\left\|/g, '')
    .replace(/\\right\|/g, '')
    .replace(/\\left\(/g, '(')
    .replace(/\\right\)/g, ')')
    .replace(/\\left\[/g, '[')
    .replace(/\\right\]/g, ']')
    .replace(/\\ \{/g, ' {')
    .replace(/\\ \}/g, ' }')
    .trim();

  while (s.startsWith('{') && s.endsWith('}')) {
    const inner = s.slice(1, -1);
    if ((inner.match(/\{/g) || []).length === (inner.match(/\}/g) || []).length) {
      s = inner.trim();
    } else { break; }
  }

  return s.replace(/\s+/g, ' ').trim();
}

function extractDefinitionSentences(text: string): { sentence: string; type: 'definition' | 'law' | 'key_fact' }[] {
  const results: { sentence: string; type: 'definition' | 'law' | 'key_fact' }[] = [];
  const sentences = text.split(/(?<=[.!?])\s+/);
  for (const s of sentences) {
    const lower = s.toLowerCase();
    if (
      /\b(is|are|was|were)\b/.test(lower) ||
      /\bdefined as\b/.test(lower) ||
      /\brefers to\b/.test(lower) ||
      /\b(es|son|fue|eran|está|están)\b/.test(lower) ||
      /\bse define como\b/.test(lower) ||
      /\bse refiere a\b/.test(lower) ||
      /\bconsiste en\b/.test(lower)
    ) {
      results.push({ sentence: s.trim().slice(0, 400), type: 'definition' });
    } else if (
      /\blaw of\b/i.test(lower) ||
      /\bprinciple of\b/i.test(lower) ||
      /\btheorem\b/i.test(lower) ||
      /\bley de\b/i.test(lower) ||
      /\bprincipio de\b/i.test(lower) ||
      /\bteorema de\b/i.test(lower)
    ) {
      results.push({ sentence: s.trim().slice(0, 400), type: 'law' });
    }
  }
  return results;
}

async function searchWikipedia(topic: string, lang: string): Promise<{ pageid: number; title: string }[]> {
  const params = new URLSearchParams({
    action: 'query',
    list: 'search',
    srsearch: topic,
    format: 'json',
    srlimit: '6',
    origin: '*',
  });
  const data = await wikiFetch(lang, params);
  return (data.query?.search || []).map((r: any) => ({ pageid: r.pageid, title: r.title }));
}

async function getExtracts(pageIds: number[], lang: string): Promise<Record<number, { title: string; extract: string }>> {
  const params = new URLSearchParams({
    action: 'query',
    prop: 'extracts',
    exintro: '1',
    explaintext: '1',
    pageids: pageIds.join('|'),
    format: 'json',
    origin: '*',
  });
  const data = await wikiFetch(lang, params);
  const pages = data.query?.pages || {};
  const result: Record<number, { title: string; extract: string }> = {};
  for (const [id, page] of Object.entries<any>(pages)) {
    result[Number(id)] = { title: page.title, extract: page.extract || '' };
  }
  return result;
}

async function getMathElements(title: string, lang: string): Promise<string[]> {
  const params = new URLSearchParams({
    action: 'parse',
    page: title,
    prop: 'text',
    format: 'json',
    origin: '*',
  });
  try {
    const data = await wikiFetch(lang, params);
    const html: string = data.parse?.text?.['*'] || '';
    const formulas: string[] = [];

    const annotationRegex = /<annotation\s+encoding="application\/x-tex">([\s\S]*?)<\/annotation>/gi;
    let match;
    while ((match = annotationRegex.exec(html)) !== null) {
      const latex = match[1].trim();
      if (latex.length > 2 && latex.length < 300) {
        formulas.push(latex);
      }
    }

    if (formulas.length === 0) {
      const mathMLRegex = /<math[^>]*>[\s\S]*?<mi[^>]*>([^<]+)<\/mi>/g;
      const tokens: string[] = [];
      while ((match = mathMLRegex.exec(html)) !== null) {
        tokens.push(match[1]);
      }
      if (tokens.length > 0) {
        formulas.push(tokens.join(' ').slice(0, 100));
      }
    }

    return [...new Set(formulas)].slice(0, 5);
  } catch {
    return [];
  }
}

export class WikipediaProvider {
  name = 'Wikipedia';

  async search(topic: string, lang: string = 'en'): Promise<CorpusEntry[]> {
    const entries: CorpusEntry[] = [];
    let counter = 0;

    try {
      const pages = await searchWikipedia(topic, lang);

      if (pages.length === 0) return entries;
      await delay(DELAY_MS);

      const pageIds = pages.map(p => p.pageid);
      const extracts = await getExtracts(pageIds, lang);
      await delay(DELAY_MS);

      for (const page of pages) {
        const info = extracts[page.pageid];
        if (!info || !info.extract) continue;

        const url = `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(page.title.replace(/ /g, '_'))}`;

        const defs = extractDefinitionSentences(info.extract);
        for (const d of defs.slice(0, 3)) {
          entries.push({
            id: `wp-${lang}-${page.pageid}-d${counter++}`,
            type: d.type,
            text: d.sentence,
            source: 'wikipedia',
            sourceUrl: url,
            sourceTitle: page.title,
            tier: 'TIER_3_HIGH_QUALITY_WEB',
            authorityScore: 75,
            relevanceScore: 90,
          });
        }

        const mathLaTeX = await getMathElements(page.title, lang);
        for (const latex of mathLaTeX.slice(0, 3)) {
          entries.push({
            id: `wp-${lang}-${page.pageid}-f${counter++}`,
            type: 'formula',
            text: latex,
            laTeX: `$$${latex}$$`,
            laTeXNormalized: normalizeLaTeX(latex),
            source: 'wikipedia',
            sourceUrl: url,
            sourceTitle: page.title,
            tier: 'TIER_3_HIGH_QUALITY_WEB',
            authorityScore: 75,
            relevanceScore: 85,
          });
        }
      }
    } catch (e: any) {
      console.error(`[WikipediaProvider] Error: ${e.message}`);
    }

    return entries;
  }
}
