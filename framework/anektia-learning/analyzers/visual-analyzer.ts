import { ExtractedVisual, VisualAnalysisResult, VisualCategory, VisualOpportunity } from '../types';

export function classifyVisualCategory(
  url: string, 
  altText: string, 
  caption: string = '', 
  contextText: string = ''
): { category: VisualCategory; isPedagogical: boolean } {
  const combined = `${url} ${altText} ${caption} ${contextText}`.toLowerCase();

  if (combined.includes('grafic') || combined.includes('chart') || combined.includes('plot') || combined.includes('curva') || combined.includes('eje')) {
    return { category: 'DATA_VISUALIZATION', isPedagogical: true };
  }
  if (combined.includes('paso') || combined.includes('proceso') || combined.includes('flujo') || combined.includes('workflow') || combined.includes('diagrama de flujo')) {
    return { category: 'PROCESS', isPedagogical: true };
  }
  if (combined.includes('versus') || combined.includes('vs') || combined.includes('comparat') || combined.includes('diferencia') || combined.includes('antes') || combined.includes('despues')) {
    return { category: 'COMPARISON', isPedagogical: true };
  }
  if (combined.includes('archivo') || combined.includes('histor') || combined.includes('manuscrito') || combined.includes('retrato')) {
    return { category: 'HISTORICAL_CONTEXT', isPedagogical: true };
  }
  if (combined.includes('esquema') || combined.includes('modelo') || combined.includes('concepto') || combined.includes('mapa') || combined.includes('diagrama')) {
    return { category: 'CONCEPTUAL', isPedagogical: true };
  }
  if (combined.includes('ejemplo') || combined.includes('experimento') || combined.includes('demostracion') || combined.includes('caso')) {
    return { category: 'EXAMPLE', isPedagogical: true };
  }
  if (caption.trim().length > 10 || altText.trim().length > 15) {
    return { category: 'EXPLANATORY', isPedagogical: true };
  }

  // Stock / decorative images
  if (url.includes('unsplash') || url.includes('pixabay') || url.includes('stock') || altText.toLowerCase().includes('decorat') || altText.trim().length === 0) {
    return { category: 'DECORATIVE', isPedagogical: false };
  }

  return { category: 'EXPLANATORY', isPedagogical: true };
}

export function extractVisualsFromMDX(rawContent: string, layers: { id: 'inicio' | 'intermedio' | 'avanzado'; startLine: number; endLine: number; content: string }[]): ExtractedVisual[] {
  const visuals: ExtractedVisual[] = [];
  const lines = rawContent.split('\n');

  // Regex 1: Markdown images ![alt](url "caption")
  const markdownImgRegex = /!\[([^\]]*)\]\(([^"'\)]+)(?:[\s"']+(.*?)["']?)?\)/g;
  // Regex 2: JSX <Image src="..." alt="..." /> or <img ... /> or <AnektiaVisual ... />
  const jsxImgRegex = /<(?:Image|img|AnektiaVisual|VisualExordium)\s+[^>]*?\b(?:src|image|url)=["']([^"']+)["'][^>]*?>/gi;
  // Regex 3: Modern placeholder markers [IMAGEN SUGERIDA: description]
  const imagenSugeridaRegex = /\[IMAGEN SUGERIDA:\s*([\s\S]*?)\]/g;

  let visualCounter = 1;

  lines.forEach((line, lineIdx) => {
    const lineNum = lineIdx + 1;
    let currentLayer: 'inicio' | 'intermedio' | 'avanzado' | 'general' = 'general';

    for (const l of layers) {
      if (lineNum >= l.startLine && lineNum <= l.endLine) {
        currentLayer = l.id;
        break;
      }
    }

    // Markdown Image Matches
    let match: RegExpExecArray | null;
    while ((match = markdownImgRegex.exec(line)) !== null) {
      const altText = match[1] || '';
      const url = match[2] || '';
      const caption = match[3] || '';

      const { category, isPedagogical } = classifyVisualCategory(url, altText, caption, line);

      visuals.push({
        id: `vis_${visualCounter++}`,
        url,
        altText,
        caption,
        category,
        layerId: currentLayer,
        isPedagogical,
        hasAccessibility: altText.trim().length >= 5
      });
    }

    // JSX Matches
    let jsxMatch: RegExpExecArray | null;
    while ((jsxMatch = jsxImgRegex.exec(line)) !== null) {
      const url = jsxMatch[1] || '';
      const altMatch = /alt=["']([^"']+)["']/i.exec(line);
      const captionMatch = /caption=["']([^"']+)["']/i.exec(line);
      const altText = altMatch ? altMatch[1] : '';
      const caption = captionMatch ? captionMatch[1] : '';

      const { category, isPedagogical } = classifyVisualCategory(url, altText, caption, line);

      visuals.push({
        id: `vis_${visualCounter++}`,
        url,
        altText,
        caption,
        category,
        layerId: currentLayer,
        isPedagogical,
        hasAccessibility: altText.trim().length >= 5
      });
    }

    // IMAGEN SUGERIDA placeholder markers (modern format)
    let imgSugMatch: RegExpExecArray | null;
    while ((imgSugMatch = imagenSugeridaRegex.exec(line)) !== null) {
      const description = imgSugMatch[1].trim();
      const { category, isPedagogical } = classifyVisualCategory('sugerida', description, '', description);

      visuals.push({
        id: `vis_sug_${visualCounter++}`,
        url: '',
        altText: description,
        caption: description,
        category,
        layerId: currentLayer,
        isPedagogical,
        hasAccessibility: description.length >= 5,
        width: undefined,
        height: undefined
      });
    }
  });

  return visuals;
}

export function analyzeVisuals(
  visuals: ExtractedVisual[], 
  rawBody: string, 
  headings: { h2: string[]; h3: string[] }
): VisualAnalysisResult {
  const totalVisuals = visuals.length;
  const categoriesDetected: Record<VisualCategory, number> = {
    DECORATIVE: 0,
    EXPLANATORY: 0,
    CONCEPTUAL: 0,
    DATA_VISUALIZATION: 0,
    PROCESS: 0,
    COMPARISON: 0,
    HISTORICAL_CONTEXT: 0,
    EXAMPLE: 0
  };

  const layerDistribution: Record<'inicio' | 'intermedio' | 'avanzado' | 'general', number> = {
    inicio: 0,
    intermedio: 0,
    avanzado: 0,
    general: 0
  };

  let pedagogicalCount = 0;
  let accessibleCount = 0;

  visuals.forEach(v => {
    categoriesDetected[v.category] = (categoriesDetected[v.category] || 0) + 1;
    layerDistribution[v.layerId] = (layerDistribution[v.layerId] || 0) + 1;
    if (v.isPedagogical) pedagogicalCount++;
    if (v.hasAccessibility) accessibleCount++;
  });

  const decorativeCount = categoriesDetected.DECORATIVE;

  // Calculate Sub-Scores
  let visualCoverageScore = 0;
  if (pedagogicalCount >= 2 && pedagogicalCount <= 7) visualCoverageScore = 100;
  else if (pedagogicalCount === 1) visualCoverageScore = 70;
  else if (pedagogicalCount > 7) visualCoverageScore = 80;
  else visualCoverageScore = 30;

  const pedagogicalVisualsScore = totalVisuals > 0 ? Math.round((pedagogicalCount / totalVisuals) * 100) : 50;
  const imageAccessibilityScore = totalVisuals > 0 ? Math.round((accessibleCount / totalVisuals) * 100) : 100;

  // Detect Visual Opportunities
  const visualOpportunities: VisualOpportunity[] = [];
  const lowerBody = rawBody.toLowerCase();

  if ((lowerBody.includes('paso 1') || lowerBody.includes('proceso') || lowerBody.includes('flujo')) && categoriesDetected.PROCESS === 0) {
    visualOpportunities.push({
      concept: 'Proceso de varios pasos',
      reason: 'El artículo explica una secuencia o proceso sin incluir un diagrama o esquema de flujo visual.',
      suggestedType: 'PROCESS',
      section: 'Desarrollo del Proceso'
    });
  }

  if ((lowerBody.includes('proporcional') || lowerBody.includes('relacion entre') || lowerBody.includes('tasa de cambio') || lowerBody.includes('grafica')) && categoriesDetected.DATA_VISUALIZATION === 0) {
    visualOpportunities.push({
      concept: 'Relación entre variables',
      reason: 'Se describe la dependencia funcional o variación entre magnitudes pero no se incluye gráfica o visualización de datos.',
      suggestedType: 'DATA_VISUALIZATION',
      section: 'Análisis Cuantitativo'
    });
  }

  if ((lowerBody.includes('diferencia entre') || lowerBody.includes('frente a') || lowerBody.includes('versus')) && categoriesDetected.COMPARISON === 0) {
    visualOpportunities.push({
      concept: 'Comparación conceptual',
      reason: 'Se comparan dos conceptos o métodos alternativos sin un esquema o tabla visual comparativa.',
      suggestedType: 'COMPARISON',
      section: 'Sección Comparativa'
    });
  }

  return {
    visualCoverageScore,
    pedagogicalVisualsScore,
    imageAccessibilityScore,
    totalVisuals,
    pedagogicalCount,
    decorativeCount,
    categoriesDetected,
    layerDistribution,
    visualOpportunities,
    extractedVisuals: visuals
  };
}
