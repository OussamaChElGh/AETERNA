import { GlossaryEntry } from '@/types';
import { buildGlossaryRegex } from './conceptHighlighter';

interface TextNode {
  type: 'text';
  value: string;
  position?: any;
}

interface ConceptNode {
  type: 'conceptTerm';
  term: string;
  definition: string;
  tags?: string[];
  children: TextNode[];
  position?: any;
}

/**
 * Remark plugin: walks markdown AST text nodes and wraps glossary terms
 * in custom `conceptTerm` nodes. ReactMarkdown renders them via `components`.
 * Uses manual recursive traversal to avoid mutation-during-visit issues.
 */
export function remarkConceptGlossary(entries: GlossaryEntry[], options: { minTermLength?: number; maxOccurrencesPerTerm?: number } = {}) {
  const { minTermLength = 5, maxOccurrencesPerTerm = 4 } = options;
  const regex = buildGlossaryRegex(entries, minTermLength);

  function transformNode(node: any): any {
    if (!node) return node;

    if (node.type === 'text' && typeof node.value === 'string') {
      return transformText(node);
    }

    if (node.children && Array.isArray(node.children)) {
      const newChildren: any[] = [];
      for (const child of node.children) {
        const transformed = transformNode(child);
        if (Array.isArray(transformed)) {
          newChildren.push(...transformed);
        } else if (transformed) {
          newChildren.push(transformed);
        }
      }
      return { ...node, children: newChildren };
    }

    return node;
  }

  const termCount: Record<string, number> = {};

  function transformText(node: TextNode): (TextNode | ConceptNode)[] {
    if (!regex.test(node.value)) {
      regex.lastIndex = 0;
      return [node];
    }
    regex.lastIndex = 0;

    const parts: (TextNode | ConceptNode)[] = [];
    let lastIndex = 0;
    let m: RegExpExecArray | null;

    while ((m = regex.exec(node.value)) !== null) {
      const matched = m[0];
      const entry = matchEntry(entries, matched);
      if (!entry) continue;

      const key = entry.term.toLowerCase();
      termCount[key] = (termCount[key] || 0) + 1;
      if (termCount[key] > maxOccurrencesPerTerm) continue;

      if (m.index > lastIndex) {
        parts.push({ type: 'text', value: node.value.slice(lastIndex, m.index) });
      }

      parts.push({
        type: 'conceptTerm',
        term: entry.term,
        definition: entry.definition,
        tags: entry.tags || [],
        children: [{ type: 'text', value: matched }],
      });

      lastIndex = m.index + m[0].length;
    }

    if (parts.length === 0) return [node];

    if (lastIndex < node.value.length) {
      parts.push({ type: 'text', value: node.value.slice(lastIndex) });
    }

    return parts;
  }

  return (tree: any) => {
    return transformNode(tree);
  };
}

function matchEntry(entries: GlossaryEntry[], matchedText: string): GlossaryEntry | null {
  const lower = matchedText.toLowerCase();
  return (
    entries.find(e => {
      if (e.term.toLowerCase() === lower) return true;
      return (e.synonyms || []).some((s: string) => s.toLowerCase() === lower);
    }) || null
  );
}

interface HtmlNode {
  type: 'html';
  value: string;
  position?: any;
}

function escapeHtmlAttr(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * Alternative plugin: emits standard mdast `html` nodes with a
 * `<a data-glossary="..." data-def="...">` wrapper. rehypeRaw (already in the
 * pipeline) parses them into real elements, which react-markdown renders via
 * components (we override `a`).
 */
export function remarkConceptGlossaryHtml(entries: GlossaryEntry[], options: { minTermLength?: number; maxOccurrencesPerTerm?: number; gapBetween?: number } = {}) {
  const { minTermLength = 5, maxOccurrencesPerTerm = 6, gapBetween = 2 } = options;
  const regex = buildGlossaryRegex(entries, minTermLength);

  function transformText(node: TextNode, termState: Record<string, { count: number; skip: number }>): (TextNode | HtmlNode)[] {
    if (!regex.test(node.value)) {
      regex.lastIndex = 0;
      return [node];
    }
    regex.lastIndex = 0;

    const parts: (TextNode | HtmlNode)[] = [];
    let lastIndex = 0;
    let m: RegExpExecArray | null;

    while ((m = regex.exec(node.value)) !== null) {
      const matched = m[0];
      const entry = matchEntry(entries, matched);
      if (!entry) continue;

      const key = entry.term.toLowerCase();
      const state = (termState[key] = termState[key] || { count: 0, skip: 0 });

      state.count += 1;
      if (state.count > maxOccurrencesPerTerm) continue;

      // Spacing: skip some occurrences so the same word isn't highlighted
      // every single time it appears.
      if (state.skip > 0) {
        state.skip -= 1;
        continue;
      }
      state.skip = gapBetween;

      if (m.index > lastIndex) {
        parts.push({ type: 'text', value: node.value.slice(lastIndex, m.index) });
      }

      const tagsAttr = (entry.tags || []).map(t => escapeHtmlAttr(t)).join(',');
      parts.push({
        type: 'html',
        value: `<a data-glossary="${escapeHtmlAttr(entry.term)}" data-def="${escapeHtmlAttr(entry.definition)}" data-tags="${tagsAttr}" class="concept-glossary">${escapeHtmlAttr(matched)}</a>`,
      });

      lastIndex = m.index + m[0].length;
    }

    if (parts.length === 0) return [node];

    if (lastIndex < node.value.length) {
      parts.push({ type: 'text', value: node.value.slice(lastIndex) });
    }

    return parts;
  }

  // Walk the tree, wrapping glossary terms. `insideLink` prevents wrapping
  // terms that already live inside an <a> (avoid nested anchors).
  function transformChildren(node: any, termState: Record<string, { count: number; skip: number }>, insideLink: boolean): void {
    if (!node || !Array.isArray(node.children)) return;

    const newChildren: any[] = [];
    for (const child of node.children) {
      if (child && child.type === 'text' && typeof child.value === 'string' && !insideLink) {
        const parts = transformText(child, termState);
        if (parts.length > 1) {
          newChildren.push(...parts);
          continue;
        }
      }
      const childInLink = insideLink || child.type === 'link';
      transformChildren(child, termState, childInLink);
      newChildren.push(child);
    }
    node.children = newChildren;
  }

  // unified expects an "attacher" that returns a transformer.
  // termCount lives INSIDE the transformer so every markdown render
  // (each article section) starts with a fresh per-term counter.
  return function attacher() {
    return function transformer(tree: any) {
      transformChildren(tree, {}, false);
    };
  };
}
