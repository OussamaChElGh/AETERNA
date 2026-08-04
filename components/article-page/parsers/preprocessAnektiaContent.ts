const COMPONENT_NAMES = [
  'PredictionBox', 'ParameterLab', 'GraphLab', 'ErrorHunter', 'ModelBuilder',
  'ConceptMap', 'ArgumentBuilder', 'CausalMap', 'EvidenceMatcher', 'Counterexample',
  'ArgumentEvaluation', 'SequenceBuilder', 'AnektiaDecisionBox', 'AnektiaExercise',
  'PedagogicalContentBlock', 'Connect', 'HiddenAssumption', 'Transfer', 'AnektiaEngagement',
  'AnektiaFlowchart', 'Flowchart', 'AnektiaFormula', 'FormulaBlock', 'Formula',
  'ComparativeTable', 'ProcessVisual', 'VisualData'
];

export function preprocessAnektiaContent(rawContent: string): string {
  if (!rawContent) return "";

  let processed = rawContent;

  COMPONENT_NAMES.forEach(comp => {
    const codeLang = comp.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

    const selfClosingRegex = new RegExp(`<${comp}\\s+([\\s\\S]*?)\\/>`, 'gi');
    processed = processed.replace(selfClosingRegex, (_, propsContent) => {
      return `\n\n\`\`\`${codeLang}\n${propsContent.trim()}\n\`\`\`\n\n`;
    });

    const openCloseRegex = new RegExp(`<${comp}\\s*([\\s\\S]*?)>([\\s\\S]*?)<\\/${comp}>`, 'gi');
    processed = processed.replace(openCloseRegex, (_, propsContent, childrenContent) => {
      const combined = `${propsContent.trim()}\ncontent=${JSON.stringify(childrenContent.trim())}`;
      return `\n\n\`\`\`${codeLang}\n${combined}\n\`\`\`\n\n`;
    });
  });

  processed = processed.replace(
    /<BotonTransicion\s+nivel=["']([^"']+)["']>([\s\S]*?)<\/BotonTransicion>/gi,
    (_, nivel, text) => {
      return `\n\n\`\`\`boton-transicion\nnivel="${nivel}"\ntext=${JSON.stringify(text.trim())}\n\`\`\`\n\n`;
    }
  );

  return processed;
}
