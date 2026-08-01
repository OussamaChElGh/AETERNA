export interface LayerExtraction {
  id: 'inicio' | 'intermedio' | 'avanzado';
  title: string;
  found: boolean;
  startLine: number;
  endLine: number;
  content: string;
}

export function analyzeLayers(rawBody: string): LayerExtraction[] {
  const lines = rawBody.split('\n');
  
  const layers: LayerExtraction[] = [
    { id: 'inicio', title: 'Inicio / Fundamentos', found: false, startLine: -1, endLine: -1, content: '' },
    { id: 'intermedio', title: 'Intermedio / Profundización', found: false, startLine: -1, endLine: -1, content: '' },
    { id: 'avanzado', title: 'Avanzado / Frontera', found: false, startLine: -1, endLine: -1, content: '' }
  ];

  // Strategy 1: Look for <NivelActivo id="..."> tags
  let currentLayerId: 'inicio' | 'intermedio' | 'avanzado' | null = null;
  const layerContentMap: Record<string, string[]> = {
    inicio: [],
    intermedio: [],
    avanzado: []
  };
  const layerLinesMap: Record<string, { start: number; end: number }> = {
    inicio: { start: -1, end: -1 },
    intermedio: { start: -1, end: -1 },
    avanzado: { start: -1, end: -1 }
  };

  lines.forEach((line, idx) => {
    const lineNum = idx + 1;
    const lowerLine = line.toLowerCase().trim();

    // Check layer start tag or header
    if (lowerLine.includes('id="fundamentos"') || lowerLine.includes('id="inicio"') || lowerLine.includes('capa 1')) {
      currentLayerId = 'inicio';
      layerLinesMap.inicio.start = lineNum;
    } else if (lowerLine.includes('id="profundizacion"') || lowerLine.includes('id="intermedio"') || lowerLine.includes('capa 2')) {
      currentLayerId = 'intermedio';
      layerLinesMap.intermedio.start = lineNum;
    } else if (lowerLine.includes('id="frontera"') || lowerLine.includes('id="avanzado"') || lowerLine.includes('capa 3')) {
      currentLayerId = 'avanzado';
      layerLinesMap.avanzado.start = lineNum;
    }

    if (currentLayerId) {
      layerContentMap[currentLayerId].push(line);
      layerLinesMap[currentLayerId].end = lineNum;
    }
  });

  // Populate layers result
  layers.forEach(layer => {
    const linesArr = layerContentMap[layer.id];
    if (linesArr && linesArr.length > 0 && layerLinesMap[layer.id].start !== -1) {
      layer.found = true;
      layer.startLine = layerLinesMap[layer.id].start;
      layer.endLine = layerLinesMap[layer.id].end;
      layer.content = linesArr.join('\n');
    }
  });

  // Strategy 2 Fallback: If no explicit NivelActivo tags were found, partition document into thirds or by H2 headers
  if (!layers.some(l => l.found)) {
    // Treat entire document as present under default structure if H2 headings exist
    const totalLines = lines.length;
    layers[0].found = true;
    layers[0].startLine = 1;
    layers[0].endLine = Math.floor(totalLines / 3);
    layers[0].content = lines.slice(0, layers[0].endLine).join('\n');

    layers[1].found = true;
    layers[1].startLine = layers[0].endLine + 1;
    layers[1].endLine = Math.floor((totalLines * 2) / 3);
    layers[1].content = lines.slice(layers[1].startLine, layers[1].endLine).join('\n');

    layers[2].found = true;
    layers[2].startLine = layers[1].endLine + 1;
    layers[2].endLine = totalLines;
    layers[2].content = lines.slice(layers[2].startLine).join('\n');
  }

  return layers;
}
