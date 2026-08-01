import fs from 'fs';
import path from 'path';
import { Corpus, CorpusEntry, RigorReport, RigorCorrection } from './types';
import { loadCorpus } from './harvest';

const JSON_ARTICLES_DIR = path.join(process.cwd(), 'data', 'articles');

function normalizeLaTeX(raw: string): string {
  let s = String(raw)
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
    .replace(/\\,\s*/g, '')
    .replace(/\\;\s*/g, '')
    .replace(/\\!\s*/g, '')
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

function laTeXStructure(s: string): string {
  return s
    .replace(/\\[a-zA-Z]+(\{[^}]*\})*/g, '\\cmd')
    .replace(/[a-zA-Z]+/g, 'X')
    .replace(/[0-9]+(\.[0-9]+)?/g, 'N')
    .replace(/\s+/g, '');
}

function extractAllArticleFormulas(articleBody: string): string[] {
  const formulas: string[] = [];
  const dm = articleBody.match(/\$\$([\s\S]*?)\$\$/g) || [];
  const im = articleBody.match(/\$([^$\n]{2,80})\$/g) || [];
  const fb = articleBody.match(/formula="([^"]+)"/g) || [];
  for (const m of [...dm, ...im]) {
    const norm = normalizeLaTeX(m);
    if (norm.length > 2) formulas.push(norm);
  }
  for (const f of fb) {
    const inner = f.replace(/^formula="/, '').replace(/"$/, '');
    const norm = normalizeLaTeX(inner);
    if (norm.length > 2) formulas.push(norm);
  }
  return [...new Set(formulas)];
}

function extractArticleBody(articleJson: any): string {
  const parts: string[] = [];

  if (articleJson.introduccion) {
    parts.push(String(articleJson.introduccion));
  }

  const secciones = articleJson.secciones || [];
  for (const sec of secciones) {
    if (sec.titulo) parts.push(String(sec.titulo));
    const niveles = sec.niveles || {};
    for (const key of ['principiante', 'intermedio', 'avanzado']) {
      if (niveles[key]) parts.push(String(niveles[key]));
    }
  }

  if (articleJson.conclusion) {
    parts.push(String(articleJson.conclusion));
  }

  const metadata = articleJson.metadata || {};
  if (Array.isArray(metadata.tags)) {
    parts.push(metadata.tags.join(' '));
  }

  return parts.join('\n');
}

function entryCovered(entry: CorpusEntry, articleBody: string): boolean {
  const bodyLower = articleBody.toLowerCase();

  if (entry.type === 'formula' && entry.laTeXNormalized) {
    const entryNorm = entry.laTeXNormalized.replace(/\s+/g, '');
    const entryStruct = laTeXStructure(entryNorm);
    const artFormulas = extractAllArticleFormulas(articleBody);

    for (const af of artFormulas) {
      const afNorm = af.replace(/\s+/g, '');
      if (afNorm === entryNorm) return true;
      if (laTeXStructure(afNorm) === entryStruct) return true;
      if (afNorm.replace(/[{}]/g, '') === entryNorm.replace(/[{}]/g, '')) return true;
    }
    return false;
  }

  if (entry.type === 'definition' || entry.type === 'law' || entry.type === 'key_fact') {
    const entryWords = entry.text.toLowerCase().match(/\b[a-záéíóúñ]{4,}\b/g) || [];
    if (entryWords.length === 0) return false;
    let matchCount = 0;
    for (const w of entryWords) {
      if (bodyLower.includes(w)) matchCount++;
    }
    const ratio = matchCount / Math.max(entryWords.length, 3);
    return ratio >= 0.25;
  }

  return false;
}

function detectContradiction(
  articleBody: string,
  entries: CorpusEntry[]
): { articleFormula: string; corpusFormula: string; sourceUrl: string; sourceName: string }[] {
  const contradictions: { articleFormula: string; corpusFormula: string; sourceUrl: string; sourceName: string }[] = [];
  const articleFormulas = extractAllArticleFormulas(articleBody);
  const corpusFormulas = entries.filter(e => e.type === 'formula' && e.laTeXNormalized);

  for (const afNorm of articleFormulas) {
    const afStruct = laTeXStructure(afNorm);
    for (const cf of corpusFormulas) {
      const cfNorm = cf.laTeXNormalized!.replace(/\s+/g, '');
      const cfStruct = laTeXStructure(cfNorm);
      if (afStruct === cfStruct && afNorm !== cfNorm) {
        const opDiff = (afNorm.match(/[+\-]/g) || []).join('') !== (cfNorm.match(/[+\-]/g) || []).join('');
        const fracDiff = (afNorm.match(/\\frac/g) || []).length !== (cfNorm.match(/\\frac/g) || []).length;
        if (opDiff || fracDiff) {
          contradictions.push({
            articleFormula: afNorm,
            corpusFormula: cf.laTeX || cf.text,
            sourceUrl: cf.sourceUrl,
            sourceName: sourceName(cf.source),
          });
        }
      }
    }
  }

  return contradictions;
}

function sourceName(source: string): string {
  if (source === 'wikipedia') return 'Wikipedia';
  if (source === 'openstax') return 'OpenStax';
  return 'arXiv';
}

export function validate(articlePathOrSlug: string, corpus: Corpus): RigorReport {
  let articleJson: any;
  const jsonPath = articlePathOrSlug.endsWith('.json')
    ? path.resolve(articlePathOrSlug)
    : path.join(JSON_ARTICLES_DIR, `${articlePathOrSlug}.json`);

  const outlinePath = !articlePathOrSlug.endsWith('.json')
    ? path.join(JSON_ARTICLES_DIR, `${articlePathOrSlug}.outline.json`)
    : null;

  if (fs.existsSync(jsonPath)) {
    articleJson = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  } else if (outlinePath && fs.existsSync(outlinePath)) {
    articleJson = JSON.parse(fs.readFileSync(outlinePath, 'utf8'));
  } else {
    return {
      rigorScore: 0,
      totalClaims: corpus.totalEntries,
      claimsMatched: 0,
      coverageScore: 0,
      precisionScore: 0,
      contradictions: 0,
      missingCoreClaims: [],
      corrections: [],
      summary: `Artículo no encontrado: ${articlePathOrSlug}`,
    };
  }

  const articleBody = extractArticleBody(articleJson);

  const coreEntries = corpus.entries.filter(e =>
    e.authorityScore >= 70 || e.type === 'definition'
  );

  let matched = 0;
  const missing: RigorReport['missingCoreClaims'] = [];
  const corrections: RigorCorrection[] = [];

  for (const entry of coreEntries) {
    if (entryCovered(entry, articleBody)) {
      matched++;
    } else {
      missing.push({
        entry,
        reason: entry.type === 'formula'
          ? `La fórmula "${entry.laTeX || entry.text}" no aparece en el artículo.`
          : `El concepto definido no está cubierto: "${entry.text.slice(0, 100)}..."`,
      });
    }
  }

  for (const m of missing) {
    if (m.entry.authorityScore >= 90) {
      corrections.push({
        severity: 'MUST_FIX',
        articleExcerpt: m.reason,
        expected: m.entry.text.slice(0, 200),
        sourceUrl: m.entry.sourceUrl,
        sourceName: sourceName(m.entry.source),
      });
    }
  }

  const contradictions = detectContradiction(articleBody, corpus.entries);

  const totalClaims = coreEntries.length || 1;
  const coverageScore = Math.min(100, Math.round((matched / totalClaims) * 60));
  const precisionScore = Math.max(0, 40 - contradictions.length * 10);
  const rigorScore = Math.min(100, Math.max(0, coverageScore + precisionScore));

  let summary = '';
  if (rigorScore >= 85) {
    summary = `Rigor alto: ${matched}/${totalClaims} claims verificadas, ${contradictions.length} contradicciones.`;
  } else if (rigorScore >= 60) {
    summary = `Rigor medio: ${matched}/${totalClaims} claims verificadas, ${missing.length} claims sin cubrir.`;
  } else {
    summary = `Rigor bajo: solo ${matched}/${totalClaims} claims cubiertas. Revisar ${corrections.length} correcciones MUST_FIX.`;
  }

  return {
    rigorScore,
    totalClaims,
    claimsMatched: matched,
    coverageScore,
    precisionScore,
    contradictions: contradictions.length,
    missingCoreClaims: missing.slice(0, 15),
    corrections: corrections.slice(0, 10),
    summary,
  };
}
