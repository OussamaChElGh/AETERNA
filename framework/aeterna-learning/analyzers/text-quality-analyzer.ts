import fs from 'fs';
import path from 'path';

export interface TextQualityResult {
  repetitionScore: number;        // 0..100 (100 = sin repeticiones)
  repeatedPhrases: {
    phrase: string;
    count: number;
    locations: number[];
  }[];
  codeMarkdownScore: number;      // 0..100 (100 = sin markdown como código)
  codeMarkdownIssues: {
    kind: 'fenced_markdown' | 'raw_markdown' | 'escaped_markdown';
    sample: string;
    location: number;
  }[];
  overallScore: number;           // 0..100
  status: 'PASS' | 'PARTIAL' | 'FAIL';
  message: string;
}

// Lenguajes de bloques fenced que SON bloques interactivos/pedagógicos válidos de Aeterna.
// Cualquier otro fenced block que contenga sintaxis markdown se considera markdown "mostrado como código".
const KNOWN_INTERACTIVE_LANGS = new Set([
  'aeterna-exercise', 'aeterna-ejercicio', 'aeterna-decision', 'aeterna-decision-box',
  'prediction-box', 'prediction', 'parameter-lab', 'parameter', 'graph-lab', 'graph',
  'error-hunter', 'error', 'model-builder', 'model', 'concept-map', 'concept',
  'argument-builder', 'argument', 'causal-map', 'causal', 'evidence-matcher', 'evidence',
  'counterexample', 'argument-evaluation', 'sequence-builder', 'sequence',
  'aeterna-flowchart', 'flowchart', 'aeterna-formula', 'formula',
  'pedagogical-content-block', 'connect', 'hidden-assumption', 'transfer',
  'aeterna-engagement', 'boton-transicion', 'comparative-table', 'process-visual', 'visual-data'
]);

function normalizeForComparison(s: string): string {
  return s
    .toLowerCase()
    .replace(/[.,;:!?"'()\[\]{}—–-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Extrae solo el texto narrativo real, eliminando:
// - Fenced blocks interactivos (```...```) — su contenido se duplica por diseño en capas
// - Componentes JSX (<AeternaDecisionBox ... />, <PedagogicalContentBlock>...</>)
// - Datos/atributos JSX (question=, options=[], id=...)
// - Líneas de encabezados (## / ###) — el título de sección se repite en las 3 capas
//   por diseño, no es prosa repetida.
// Así la detección de frases repetidas opera sobre prosa real, no sobre estructura.
function extractNarrativeText(rawBody: string): string {
  return rawBody
    // 1. Eliminar fenced code blocks completos
    .replace(/```[\s\S]*?```/g, ' ')
    // 2. Eliminar componentes JSX self-closing
    .replace(/<[A-Z][A-Za-z]*\s[^>]*\/>/g, ' ')
    // 3. Eliminar componentes JSX open/close completos (con children)
    .replace(/<[A-Z][A-Za-z]*\b[^>]*>[\s\S]*?<\/[A-Z][A-Za-z]*>/g, ' ')
    // 4. Eliminar etiquetas JSX sueltas residuales
    .replace(/<\/?[A-Z][A-Za-z]*\b[^>]*>/g, ' ')
    // 5. Eliminar líneas de encabezados markdown (estructura, no prosa)
    .replace(/^#{1,6}\s.*$/gm, ' ')
    .replace(/\{[\s\S]*?\}/g, ' ');
}

/**
 * Detecta frases repetidas innecesariamente dentro de un cuerpo de texto.
 * Busca ventanas de oraciones (7-22 palabras) que aparezcan más de una vez.
 */
function detectRepeatedPhrases(rawBody: string): { phrase: string; count: number; locations: number[] }[] {
  const narrative = extractNarrativeText(rawBody);
  const sentences = narrative
    .split(/(?<=[.!?])\s+/)
    .map(s => s.replace(/\n+/g, ' ').trim())
    .filter(s => s.length > 20);

  // 1. Oraciones completas duplicadas (normalizadas).
  const sentenceCount = new Map<string, number>();
  sentences.forEach(s => {
    const key = normalizeForComparison(s);
    if (key.length < 40) return;
    sentenceCount.set(key, (sentenceCount.get(key) || 0) + 1);
  });

  const result: { phrase: string; count: number; locations: number[] }[] = [];
  for (const [key, count] of sentenceCount) {
    if (count >= 2) result.push({ phrase: key, count, locations: [] });
  }

  // 2. Frases de 8-12 palabras que aparecen en oraciones DISTINTAS.
  //    Para cada oración tomamos ventanas no solapadas (salto = longitud) para
  //    evitar que una misma frase genere decenas de variantes.
  const phraseCount = new Map<string, { count: number; seenIn: Set<number> }>();
  sentences.forEach((sentence, idx) => {
    const words = sentence.split(/\s+/);
    if (words.length < 10) return;
    const maxLen = Math.min(10, words.length);
    for (let w = 8; w <= maxLen; w++) {
      for (let i = 0; i + w <= words.length; i += w) {
        const window = words.slice(i, i + w).join(' ');
        const key = normalizeForComparison(window);
        if (key.length < 40) continue;
        const entry = phraseCount.get(key) || { count: 0, seenIn: new Set<number>() };
        entry.seenIn.add(idx);
        phraseCount.set(key, entry);
      }
    }
  });

  for (const [key, entry] of phraseCount) {
    const distinctSentences = entry.seenIn.size;
    if (distinctSentences >= 2) {
      result.push({ phrase: key, count: distinctSentences, locations: Array.from(entry.seenIn).slice(0, 4) });
    }
  }

  // 3. Fusionar: una frase solo se reporta si aparece en ≥2 oraciones distintas.
  //    Eliminar duplicados (misma frase con distinta longitud de ventana).
  const dedup = new Map<string, { phrase: string; count: number; locations: number[] }>();
  for (const r of result) {
    const existing = dedup.get(r.phrase);
    if (!existing || r.count > existing.count) {
      dedup.set(r.phrase, r);
    }
  }

  // 4. Colapsar subcadenas: si una frase está contenida dentro de otra más larga
  //    detectada, se descarta (es la misma repetición vista con distinta ventana).
  const entries = Array.from(dedup.values()).sort((a, b) => b.phrase.length - a.phrase.length);
  const collapsed: typeof entries = [];
  for (const e of entries) {
    const isSubstring = collapsed.some(c => c.phrase.includes(e.phrase));
    if (!isSubstring) {
      collapsed.push(e);
    }
  }

  return collapsed
    .sort((a, b) => b.count - a.count || b.phrase.length - a.phrase.length)
    .slice(0, 10);
}

/**
 * Detecta contenido markdown que quedó "mostrado como código":
 * 1. Fenced blocks (```) con lenguaje desconocido que contienen sintaxis markdown.
 * 2. Sintaxis markdown literal al inicio de línea (headings, citas, listas, énfasis) que
 *    parece texto sin procesar (no es un fenced block, es markdown crudo en el body).
 * 3. Secuencias escapadas (ej. \`\`\`, &#x60;) que indican markdown pegado como código.
 */
function detectCodeMarkdown(rawBody: string): TextQualityResult['codeMarkdownIssues'] {
  const issues: TextQualityResult['codeMarkdownIssues'] = [];

  // 1. Fenced blocks con lenguaje desconocido que contienen markdown
  const fenceRegex = /```([a-zA-Z0-9-]*)\s*\n([\s\S]*?)```/g;
  let m: RegExpExecArray | null;
  while ((m = fenceRegex.exec(rawBody)) !== null) {
    const lang = m[1].trim().toLowerCase();
    const body = m[2];
    const loc = m.index;
    if (KNOWN_INTERACTIVE_LANGS.has(lang)) continue;

    // El contenido tiene marcas markdown? Entonces es markdown mostrado como código
    const hasMd = /(#{1,3}\s|\*\*|\*\s|\[[^\]]*\]\(|^\|.*\|$|^>\s)/m.test(body);
    if (hasMd && body.trim().length > 0) {
      const firstLine = body.split('\n').find(l => /(#{1,3}\s|\*\*|\*\s|^\|)/.test(l)) || '';
      issues.push({
        kind: 'fenced_markdown',
        sample: (lang ? `\`\`\`${lang} → ` : '``` → ') + firstLine.trim().slice(0, 80),
        location: loc
      });
    }
  }

  // 2. Markdown escapado real (backticks literal o escapes) en el texto narrativo.
  //    Los headings "##" legítimos SON markdown que debe renderizarse — no se marcan.
  //    Los bloques LaTeX ($$...$$) son fórmulas válidas con escapes propios — se excluyen.
  const narrative = extractNarrativeText(rawBody)
    .replace(/\$\$[\s\S]*?\$\$/g, ' ')   // quitar bloques LaTeX
    .replace(/\$[^$\n]+\$/g, ' ');        // quitar LaTeX inline
  const lines = narrative.split('\n');
  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (trimmed.length === 0) return;
    const escaped = /(&#x60;|\\`|\\\*|\\#|\\n)/.test(line);
    if (escaped) {
      issues.push({
        kind: 'escaped_markdown',
        sample: trimmed.slice(0, 80),
        location: idx
      });
    }
  });

  // 3. Secuencias de backticks literales en texto (markdown pegado como inline code)
  const inlineBacktickRegex = /`[^`\n]{10,}`/g;
  let im: RegExpExecArray | null;
  while ((im = inlineBacktickRegex.exec(rawBody)) !== null) {
    const inner = im[0];
    if (/(#{1,3}\s|\*\*|\[[^\]]*\]\(|^>)/.test(inner)) {
      issues.push({
        kind: 'escaped_markdown',
        sample: inner.slice(0, 80),
        location: im.index
      });
    }
  }

  // Deduplicar por muestra
  const seen = new Set<string>();
  return issues.filter(i => {
    const k = `${i.kind}:${i.sample}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  }).slice(0, 15);
}

export function analyzeTextQuality(rawBody: string): TextQualityResult {
  const repeatedPhrases = detectRepeatedPhrases(rawBody);
  const codeMarkdownIssues = detectCodeMarkdown(rawBody);

  // Repetición: 0 repeticiones = 100; cada frase repetida baja.
  const repetitionScore = Math.max(0, Math.min(100, 100 - repeatedPhrases.length * 25));

  // Markdown como código: 0 issues = 100; cada issue baja.
  const codeMarkdownScore = Math.max(0, Math.min(100, 100 - codeMarkdownIssues.length * 30));

  const overallScore = Math.round(repetitionScore * 0.5 + codeMarkdownScore * 0.5);

  let status: TextQualityResult['status'] = 'PASS';
  let message = 'Texto limpio: sin frases repetidas ni markdown mostrado como código.';

  if (codeMarkdownIssues.length > 0 || repeatedPhrases.length >= 4) {
    status = 'FAIL';
    message = `Detectados ${codeMarkdownIssues.length} fragmentos de markdown como código y ${repeatedPhrases.length} frases repetidas.`;
  } else if (repeatedPhrases.length >= 2 || codeMarkdownIssues.length > 0) {
    status = 'PARTIAL';
    message = `Texto con ${repeatedPhrases.length} frases repetidas y/o ${codeMarkdownIssues.length} fragmentos de markdown sin procesar.`;
  }

  return {
    repetitionScore,
    repeatedPhrases,
    codeMarkdownScore,
    codeMarkdownIssues,
    overallScore,
    status,
    message
  };
}
