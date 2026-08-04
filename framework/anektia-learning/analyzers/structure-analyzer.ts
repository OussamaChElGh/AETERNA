import matter from 'gray-matter';

export interface StructureAnalysisResult {
  title: string;
  slug: string;
  author: string;
  category: string;
  subcategory?: string;
  tags: string[];
  nivel?: number;
  prerequisites: string[];
  rawFrontmatter: Record<string, any>;
  rawBody: string;
  h2Headings: string[];
  h3Headings: string[];
  mathFormulasCount: number;
  hasTransitionButtons: boolean;
  hasProgressHeader: boolean;
}

export function analyzeStructure(fileContent: string, filePath: string): StructureAnalysisResult {
  let parsedData: Record<string, any> = {};
  let content = fileContent;

  try {
    const parsed = matter(fileContent);
    parsedData = parsed.data || {};
    content = parsed.content || fileContent;
  } catch (e) {
    const frontmatterMatch = fileContent.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (frontmatterMatch) {
      content = fileContent.replace(frontmatterMatch[0], '').trim();
    }
  }

  // Extract headings
  const lines = content.split('\n');
  const h2Headings: string[] = [];
  const h3Headings: string[] = [];

  lines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith('## ')) {
      h2Headings.push(trimmed.replace(/^##\s+/, ''));
    } else if (trimmed.startsWith('### ')) {
      h3Headings.push(trimmed.replace(/^###\s+/, ''));
    }
  });

  // Extract LaTeX Math Formulas ($$ or $)
  const inlineMathMatches = content.match(/\$[^\$\n]+\$/g) || [];
  const blockMathMatches = content.match(/\$\$[\s\S]*?\$\$/g) || [];
  const mathFormulasCount = inlineMathMatches.length + blockMathMatches.length;

  // Structural components
  const hasTransitionButtons = /<BotonTransicion/i.test(content);
  const hasProgressHeader = /<ProgresionArticulo/i.test(content);

  // Prerequisites extraction
  const rawPrereqs = parsedData.prerequisitos || parsedData.prerequisites || [];
  const prerequisites: string[] = Array.isArray(rawPrereqs)
    ? rawPrereqs.map(p => String(p))
    : (typeof rawPrereqs === 'string' ? [rawPrereqs] : []);

  const filename = filePath.split(/[/\\]/).pop()?.replace(/\.md$/, '') || 'untitled';

  return {
    title: parsedData.title || filename,
    slug: parsedData.slug || filename,
    author: parsedData.author || 'Anektia',
    category: parsedData.category || 'ciencias',
    subcategory: parsedData.subcategory,
    tags: Array.isArray(parsedData.tags) ? parsedData.tags : [],
    nivel: parsedData.nivel,
    prerequisites,
    rawFrontmatter: parsedData,
    rawBody: content,
    h2Headings,
    h3Headings,
    mathFormulasCount,
    hasTransitionButtons,
    hasProgressHeader
  };
}
